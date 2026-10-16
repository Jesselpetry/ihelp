#!/usr/bin/env tsx
/**
 * Consistency audit for the course library. Run with `bun run library:audit`.
 *
 * The library lives in five places that have to agree: the TypeScript cards
 * (lib/library/subject-library.ts), the generated manifest and stats, the
 * Markdown docs that point at cards by file name, the files under public/assets
 * (gitignored, so absent in CI) and — in production — two Supabase Storage
 * buckets. Nothing else notices when they drift: a card whose file was renamed
 * just 404s, a doc whose file table names a PDF no card carries renders a card
 * that cannot be opened, and an exam uploaded to the public bucket is simply
 * public. This reads all five and says which disagree.
 *
 *   bun run library:audit                  # local checks
 *   bun run library:audit -- --course ITF  # one course only
 *   bun run library:audit -- --json        # machine-readable
 *   bun run library:audit -- --remote      # also compare with the buckets (read-only)
 *
 * It builds the resource index in memory with the same code `library:index`
 * uses (scripts/library-shared.ts), so what it audits is what would be written.
 * Checks that need public/assets are skipped, and say so, when it is absent.
 *
 * Exit code 1 when any error-level finding remains, 0 otherwise. 2 means the
 * audit could not run (bad arguments, or `--remote` without credentials or
 * with an unreachable Storage API).
 */
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

import {
  INDEX_FILE,
  INDEX_RELATIVE,
  MANIFEST,
  ROOT,
  STATS,
  buildResourceIndex,
  compareText,
  serializeIndex,
  type BuildExtras,
  type ResourceIndex,
} from "./library-shared";
import { COURSES } from "../lib/courses/catalog";
import { scheduleForCourse } from "../lib/library/course-weeks";
import { storageKey } from "../lib/library/storage-key";
import { isRestrictedAsset } from "../lib/library/subject-library-ui";
import { LIBRARY_BUCKET, RESTRICTED_BUCKET, listBucketKeys, storageConfig } from "./storage-keys";

type Severity = "error" | "warn" | "info";

/**
 * Every rule, in report order: its severity and, in a few words, what it means.
 * Severity lives here and nowhere else, so a finding can never disagree with it.
 */
const RULES = {
  "missing-file": { severity: "error", summary: "a card points at a file that is not on disk" },
  "id-collision": { severity: "error", summary: "two cards share one id" },
  "duplicate-url": { severity: "error", summary: "two curated cards in one course share a url" },
  "course-mismatch": { severity: "error", summary: "a card's file sits in another course's asset folder" },
  "dead-doc-card": { severity: "error", summary: "a rendered doc lists a file that no card matches" },
  "not-uploaded": { severity: "error", summary: "a file is missing from its Storage bucket — 404 in production (--remote)" },
  "insider-in-public-bucket": { severity: "error", summary: "a past exam is readable in the public bucket — a privacy leak (--remote)" },
  "unmapped-file": { severity: "warn", summary: "a file the manifest skips, so no card lists it" },
  // A warning, not an error: fileName is the download's suggested name, and a
  // doc that lists the real name instead is already caught by dead-doc-card.
  "filename-mismatch": { severity: "warn", summary: "a card's fileName is not the file's real name (and not a prefixed copy of it)" },
  "bad-filename": { severity: "warn", summary: "a file name that is not lowercase kebab-case" },
  "duplicate-content": { severity: "warn", summary: "byte-identical files on disk" },
  "stale-generated": { severity: "warn", summary: "the manifest, the stats or the committed index is out of date" },
  "orphan-doc": { severity: "warn", summary: "a doc under content/courses that no module renders" },
  "week-not-in-schedule": { severity: "warn", summary: "a card's week matches no row of its course's schedule" },
  "status-conflict": { severity: "warn", summary: "contradictory status flags, or a duplicateOf that points nowhere" },
  "wrong-bucket": { severity: "warn", summary: "a member file sits only in the private bucket (--remote)" },
  "stale-object": { severity: "warn", summary: "a bucket object with no file on disk (--remote)" },
  coverage: { severity: "info", summary: "how much of each course's library is curated, scoped and filed by week" },
} as const;

type Rule = keyof typeof RULES;

interface Finding {
  severity: Severity;
  rule: Rule;
  course?: string;
  where: string;
  message: string;
}

/** Past this many findings a group is cut short in the human report. */
const GROUP_LIMIT = 15;

/** The naming rule from docs/DROPZONE_SOP.md: lowercase, digits, hyphens, one extension. */
const KEBAB_FILENAME = /^[a-z0-9]+(?:[.-][a-z0-9]+)*\.[a-z0-9]+$/;

const ASSETS_DIR = path.join(ROOT, "public", "assets");

/** Compared as NFC so a Thai name typed on one machine matches the same name stored on another. */
const nfc = (text: string) => text.normalize("NFC");

// ── Arguments ────────────────────────────────────────────────────────────────

interface Options {
  json: boolean;
  remote: boolean;
  course: string | null;
}

const USAGE = `usage: bun run library:audit -- [--course CODE] [--json] [--remote]

  --course CODE  only findings about one course (ITF, ICS, MFIT, …)
  --json         print the findings as JSON instead of a report
  --remote       also compare public/assets with the Supabase buckets (read-only listing;
                 needs NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY)

exit code: 1 if any error-level finding, 0 otherwise, 2 if the audit could not run`;

function usageError(message: string): never {
  console.error(`${message}\n\n${USAGE}`);
  process.exit(2);
}

function parseArgs(argv: string[]): Options {
  const options: Options = { json: false, remote: false, course: null };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--") continue;
    if (arg === "--json") options.json = true;
    else if (arg === "--remote") options.remote = true;
    else if (arg === "--help" || arg === "-h") {
      console.log(USAGE);
      process.exit(0);
    } else if (arg === "--course") {
      const value = argv[i + 1];
      if (value === undefined || value.startsWith("--")) usageError("--course needs a course code");
      options.course = value;
      i += 1;
    } else if (arg.startsWith("--course=")) options.course = arg.slice("--course=".length);
    else usageError(`unknown argument "${arg}"`);
  }

  if (options.course !== null) {
    const wanted = options.course.trim().toLowerCase();
    const course = COURSES.find((c) => c.code.toLowerCase() === wanted);
    if (!course) {
      usageError(`unknown course "${options.course}" — known: ${COURSES.map((c) => c.code).join(", ")}`);
    }
    options.course = course.code;
  }
  return options;
}

// ── The disk ─────────────────────────────────────────────────────────────────

interface Disk {
  /** Paths relative to public/assets, forward slashes, sorted. */
  files: string[];
  /** The same files as repo paths, NFC — what a card's `path` is compared with. */
  paths: Set<string>;
}

/**
 * Every file under public/assets, or null when the tree is not there (CI, a
 * fresh clone): it is gitignored, so an empty or missing folder means "not
 * checked", never "all 700 files are gone".
 */
function readDisk(): Disk | null {
  if (!fs.existsSync(ASSETS_DIR)) return null;

  const files: string[] = [];
  const walk = (dir: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.name === ".DS_Store") continue;
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else files.push(path.relative(ASSETS_DIR, full).split(path.sep).join("/"));
    }
  };
  walk(ASSETS_DIR);

  if (files.length === 0) return null;
  files.sort(compareText);
  return { files, paths: new Set(files.map((file) => nfc(`public/assets/${file}`))) };
}

/**
 * The subject folders scripts/build-library-manifest.mjs turns into cards — the
 * keys of its SUBJECT_CODE table. Read from that script rather than copied, so
 * the audit judges "the manifest skips it" by the builder's own rule. If the
 * table cannot be found (the script was restructured), the course codes the
 * generated manifest already holds stand in.
 */
function manifestSubjects(): Set<string> {
  try {
    const source = fs.readFileSync(path.join(ROOT, "scripts", "build-library-manifest.mjs"), "utf-8");
    const table = source.match(/const SUBJECT_CODE = \{([\s\S]*?)\};/)?.[1] ?? "";
    const folders = [...table.matchAll(/\b([a-z0-9]+):\s*"/g)].map((match) => match[1]);
    if (folders.length > 0) return new Set(folders);
  } catch {
    // fall through
  }
  return new Set(Object.keys(MANIFEST).map((code) => code.toLowerCase()));
}

/** Why the manifest builder skips a file (path relative to public/assets), or null if it makes a card. */
function skipReason(rel: string, subjects: Set<string>): string | null {
  const segments = rel.split("/");
  if (segments.length < 4) return "it is not at <namespace>/<subject>/<category>/<file>";
  if (!subjects.has(segments[1])) return `"${segments[1]}" is not a subject folder the manifest knows`;
  return null;
}

/** The course whose asset folder a path (relative to public/assets) is in, if it is one. */
function courseOfRel(rel: string): string | undefined {
  const subject = rel.split("/")[1];
  return COURSES.find((c) => c.code.toLowerCase() === subject)?.code;
}

// ── The committed index ──────────────────────────────────────────────────────

/** A few words on how a stale index differs from a fresh build. */
function describeDrift(committedText: string, fresh: ResourceIndex): string {
  let committed: ResourceIndex;
  try {
    committed = JSON.parse(committedText) as ResourceIndex;
  } catch {
    return "it is not valid JSON";
  }

  const parts: string[] = [];
  for (const section of ["courses", "docs", "assets"] as const) {
    const before = committed[section] ?? {};
    const after = fresh[section];
    const keys = new Set([...Object.keys(before), ...Object.keys(after)]);
    let added = 0;
    let removed = 0;
    let changed = 0;
    for (const key of keys) {
      const was = (before as Record<string, unknown>)[key];
      const now = (after as Record<string, unknown>)[key];
      if (was === undefined) added += 1;
      else if (now === undefined) removed += 1;
      else if (JSON.stringify(was) !== JSON.stringify(now)) changed += 1;
    }
    const bits = [
      changed ? `${changed} changed` : "",
      added ? `${added} added` : "",
      removed ? `${removed} removed` : "",
    ].filter(Boolean);
    if (bits.length) parts.push(`${section}: ${bits.join(", ")}`);
  }
  return parts.length ? parts.join("; ") : "only the formatting or the header differs";
}

// ── The audit ────────────────────────────────────────────────────────────────

type IndexState = "fresh" | "stale" | "missing";

/** One object the library expects to find in a bucket. */
interface Expected {
  bucket: string;
  key: string;
  where: string;
  course?: string;
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const { index, extras } = await buildResourceIndex();
  const disk = readDisk();

  const findings: Finding[] = [];
  const ran = new Set<Rule>();
  const skipped: Array<{ rule: Rule; reason: string }> = [];

  const report = (rule: Rule, where: string, message: string, course?: string) => {
    ran.add(rule);
    findings.push({
      severity: RULES[rule].severity,
      rule,
      ...(course ? { course } : {}),
      where,
      message,
    });
  };
  /** Marks a rule as checked even when it finds nothing, so the summary lists it with a 0. */
  const checked = (...rules: Rule[]) => rules.forEach((rule) => ran.add(rule));

  const assets = Object.values(index.assets);
  const subjects = manifestSubjects();

  // ── cards ──────────────────────────────────────────────────────────────────
  checked("missing-file", "course-mismatch", "filename-mismatch");
  for (const asset of assets) {
    if (asset.path === null) continue; // a card for a page of this site has no file

    const present = disk ? disk.paths.has(nfc(asset.path)) : asset.onDisk;
    if (!present) {
      report(
        "missing-file",
        asset.id,
        disk
          ? `${asset.path} is not on disk → add the file under public/assets or correct the card's url`
          : `${asset.path} is not in library-manifest.json (public/assets is absent here) → add the file and run bun run library:build, or correct the card's url`,
        asset.course,
      );
    }

    const folder = asset.path.split("/")[3];
    if (folder !== asset.course.toLowerCase()) {
      report(
        "course-mismatch",
        asset.id,
        `${asset.path} is in the "${folder}" folder, but the card belongs to ${asset.course} → move the file to .../${asset.course.toLowerCase()}/ or the card to the course that owns the folder`,
        asset.course,
      );
    }

    const base = path.posix.basename(asset.path);
    // "ics-2564-pg-01.jpg" for pages/pg-01.jpg is a download name given context
    // on purpose; a leftover pre-rename name like "Ch4 Stiochiometry_key.pdf" is not.
    const prefixed = nfc(asset.fileName).endsWith(`-${nfc(base)}`);
    if (nfc(base) !== nfc(asset.fileName) && !prefixed) {
      report(
        "filename-mismatch",
        asset.id,
        `fileName "${asset.fileName}" is not the file's name "${base}" → set fileName to the real name (docs match cards by it)`,
        asset.course,
      );
    }
  }

  checked("id-collision");
  const firstById = new Map<string, BuildExtras["raw"][number]>();
  for (const entry of extras.raw) {
    const first = firstById.get(entry.asset.id);
    if (!first) {
      firstById.set(entry.asset.id, entry);
      continue;
    }
    report(
      "id-collision",
      entry.asset.id,
      `id already used by ${first.course} (${first.asset.url}) → give each card its own id; this one is indexed as "${entry.key}"`,
      entry.course,
    );
  }

  checked("duplicate-url");
  const curatedByUrl = new Map<string, string[]>();
  for (const entry of extras.raw) {
    if (entry.origin !== "curated") continue;
    const key = `${entry.course}\u0000${entry.asset.url}`;
    curatedByUrl.set(key, [...(curatedByUrl.get(key) ?? []), entry.key]);
  }
  for (const [key, ids] of curatedByUrl) {
    if (ids.length < 2) continue;
    const [course, url] = key.split("\u0000");
    report(
      "duplicate-url",
      url,
      `${ids.length} curated cards share this url (${ids.join(", ")}) → keep one, or tell them apart with a #page= fragment`,
      course,
    );
  }

  // ── docs ───────────────────────────────────────────────────────────────────
  checked("dead-doc-card", "orphan-doc");
  for (const doc of Object.values(index.docs)) {
    const where = doc.path ?? doc.id;
    if (doc.rendered) {
      for (const ref of doc.unresolvedRefs) {
        report(
          "dead-doc-card",
          where,
          `file cell "${ref}" matches no card's fileName, so it renders as a card with nothing to open → fix the name in the doc, or add or rename the card`,
          doc.course ?? undefined,
        );
      }
    }
    if (
      doc.path?.startsWith("content/courses/") &&
      !doc.rendered &&
      doc.role !== "blueprint" &&
      doc.role !== "readme"
    ) {
      report(
        "orphan-doc",
        where,
        "no module renders this doc → bind it in lib/courses/course-bindings.ts, or delete it",
        doc.course ?? undefined,
      );
    }
  }

  // ── schedules and status flags ─────────────────────────────────────────────
  checked("week-not-in-schedule", "status-conflict");
  for (const course of Object.values(index.courses)) {
    if (!scheduleForCourse(course.code)) continue;
    for (const id of course.unscheduledAssets) {
      const asset = index.assets[id];
      if (asset.week === null) continue; // no week at all is `coverage`'s business
      report(
        "week-not-in-schedule",
        asset.id,
        `week ${asset.week}${asset.scope ? ` (${asset.scope})` : ""} matches no row of the ${course.code} schedule → add the row in lib/library/course-weeks.ts, or fix the card's week/chapter or scope`,
        course.code,
      );
    }
  }

  const knownTargets = new Set<string>();
  for (const { asset } of extras.raw) {
    knownTargets.add(asset.id);
    knownTargets.add(asset.fileName);
  }
  for (const asset of assets) {
    if (asset.isCurrentYear && (asset.status === "legacy" || asset.status === "duplicate")) {
      report(
        "status-conflict",
        asset.id,
        `isCurrentYear is true but status is "${asset.status}" → a card cannot be both the current edition and ${asset.status === "legacy" ? "an old one" : "a copy"}`,
        asset.course,
      );
    }
    if (asset.duplicateOf !== null && !knownTargets.has(asset.duplicateOf)) {
      report(
        "status-conflict",
        asset.id,
        `duplicateOf "${asset.duplicateOf}" matches no card id or fileName → point it at the canonical card, or drop it`,
        asset.course,
      );
    }
  }

  // ── coverage ───────────────────────────────────────────────────────────────
  checked("coverage");
  for (const course of Object.values(index.courses)) {
    const { counts } = course;
    if (counts.assets === 0) continue;
    report(
      "coverage",
      course.assetDirs.join(", ") || course.contentDir,
      `${counts.assets} cards · ${counts.generated} generated-only (no curated card) · ${counts.assets - counts.withScope} without scope · ${counts.assets - counts.withWeek} without week`,
      course.code,
    );
  }

  // ── generated files vs the disk ────────────────────────────────────────────
  checked("stale-generated");
  const manifestUrls = new Set<string>();
  for (const list of Object.values(MANIFEST)) for (const card of list) manifestUrls.add(nfc(card.url));

  if (disk) {
    checked("unmapped-file", "bad-filename", "duplicate-content");
    const curatedPaths = new Set(
      assets.filter((a) => a.origin === "curated" && a.path !== null).map((a) => nfc(a.path!)),
    );

    for (const rel of disk.files) {
      const repoPath = `public/assets/${rel}`;
      const course = courseOfRel(rel);
      const skip = skipReason(rel, subjects);

      // A curated card can describe a file the manifest skips; then it is visible.
      if (skip && !curatedPaths.has(nfc(repoPath))) {
        report(
          "unmapped-file",
          repoPath,
          `the manifest skips it (${skip}), so no card lists it → move it under <namespace>/<subject>/<category>/ or give it a curated card`,
          course,
        );
      }

      const name = rel.split("/").pop()!;
      if (!KEBAB_FILENAME.test(name)) {
        report(
          "bad-filename",
          repoPath,
          `"${name}" is not lowercase kebab-case → rename it by docs/DROPZONE_SOP.md, then fix the card's url and fileName`,
          course,
        );
      }

      if (!skip && !manifestUrls.has(nfc(`/assets/${rel}`))) {
        report(
          "stale-generated",
          repoPath,
          "it is on disk but not in library-manifest.json → run bun run library:build",
          course,
        );
      }
    }

    // Hash only files that share a size: two files of different size cannot be identical.
    const bySize = new Map<number, string[]>();
    for (const rel of disk.files) {
      const size = fs.statSync(path.join(ASSETS_DIR, rel)).size;
      bySize.set(size, [...(bySize.get(size) ?? []), rel]);
    }
    for (const candidates of bySize.values()) {
      if (candidates.length < 2) continue;
      const byHash = new Map<string, string[]>();
      for (const rel of candidates) {
        const hash = crypto.createHash("sha1").update(fs.readFileSync(path.join(ASSETS_DIR, rel))).digest("hex");
        byHash.set(hash, [...(byHash.get(hash) ?? []), rel]);
      }
      for (const [hash, group] of byHash) {
        if (group.length < 2) continue;
        report(
          "duplicate-content",
          `public/assets/${group[0]}`,
          `${group.length} byte-identical files (sha1 ${hash.slice(0, 10)}): ${group.map((rel) => `public/assets/${rel}`).join(", ")} → keep one and point the cards at it`,
          courseOfRel(group[0]),
        );
      }
    }

    const diskUrls = new Set(disk.files.map((rel) => nfc(`/assets/${rel}`)));
    for (const url of manifestUrls) {
      if (!diskUrls.has(url)) {
        report(
          "stale-generated",
          `public${url}`,
          "it is in library-manifest.json but not on disk → run bun run library:build",
          courseOfRel(url.replace(/^\/assets\//, "")),
        );
      }
    }
  } else {
    const reason = "public/assets is not present";
    for (const rule of ["unmapped-file", "bad-filename", "duplicate-content"] as const) {
      skipped.push({ rule, reason });
    }
  }

  for (const list of Object.values(MANIFEST)) {
    for (const card of list) {
      if (STATS[card.url] === undefined) {
        report(
          "stale-generated",
          `public${card.url}`,
          "it is in library-manifest.json but has no entry in library-stats.json → run bun run library:build",
          card.courseCode,
        );
      }
    }
  }

  let indexState: IndexState = "fresh";
  const freshText = serializeIndex(index);
  if (!fs.existsSync(INDEX_FILE)) {
    indexState = "missing";
    report("stale-generated", INDEX_RELATIVE, "the index has not been built → run bun run library:index");
  } else {
    const committedText = fs.readFileSync(INDEX_FILE, "utf-8");
    if (committedText !== freshText) {
      indexState = "stale";
      report(
        "stale-generated",
        INDEX_RELATIVE,
        `the committed index differs from a fresh build (${describeDrift(committedText, index)}) → run bun run library:index`,
      );
    }
  }

  // ── the buckets ────────────────────────────────────────────────────────────
  let remoteState: "skipped" | "checked" | "failed" = "skipped";
  let remoteError: string | null = null;

  if (!options.remote) {
    for (const rule of ["not-uploaded", "insider-in-public-bucket", "wrong-bucket", "stale-object"] as const) {
      skipped.push({ rule, reason: "pass --remote to compare with the buckets" });
    }
  } else {
    const config = storageConfig(ROOT);
    if (!config) {
      console.error(
        "--remote needs NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY, in the environment or in .env.local",
      );
      process.exit(2);
    }

    try {
      const [publicKeys, privateKeys] = await Promise.all([
        listBucketKeys(LIBRARY_BUCKET, config),
        listBucketKeys(RESTRICTED_BUCKET, config),
      ]);
      remoteState = "checked";
      checked("not-uploaded", "insider-in-public-bucket", "wrong-bucket");
      const holds = (bucket: string, key: string) => (bucket === RESTRICTED_BUCKET ? privateKeys : publicKeys).has(key);

      // Which bucket each object belongs in. Decided exactly as the uploader
      // (scripts/sync-library-assets.ts) decides: a key is private when any card
      // that uses it is a past exam, or when the file sits in an exams/ folder.
      const restrictedKeys = new Set<string>();
      for (const asset of assets) if (asset.storage && asset.access === "insider") restrictedKeys.add(asset.storage.key);

      const fromCards: Expected[] = assets.flatMap((asset) =>
        asset.storage
          ? [{ bucket: asset.storage.bucket, key: asset.storage.key, where: asset.path ?? asset.id, course: asset.course }]
          : [],
      );
      const fromDisk: Expected[] = (disk?.files ?? []).map((rel) => {
        const key = storageKey(rel);
        const restricted = restrictedKeys.has(key) || isRestrictedAsset({ url: `/assets/${rel}` });
        return {
          bucket: restricted ? RESTRICTED_BUCKET : LIBRARY_BUCKET,
          key,
          where: `public/assets/${rel}`,
          course: courseOfRel(rel),
        };
      });

      const unique = (list: Expected[]) => [
        ...new Map(list.map((e): [string, Expected] => [`${e.bucket}\u0000${e.key}`, e])).values(),
      ];

      // Whether a file is uploaded is judged from the disk when it is there —
      // that is what `assets:sync` would send — plus the key each card with a
      // file will ask the bucket for, which only differs from the disk's when a
      // name is spelled two ways. Without the disk, the cards alone.
      const onDisk = (e: Expected) => disk?.paths.has(nfc(e.where)) ?? true;
      for (const expected of unique(disk ? [...fromDisk, ...fromCards.filter(onDisk)] : fromCards)) {
        if (!holds(expected.bucket, expected.key)) {
          report(
            "not-uploaded",
            expected.where,
            `${expected.bucket}/${expected.key} is not in the bucket, so the site answers 404 → run bun run assets:sync (ask the owner first)`,
            expected.course,
          );
        }
      }

      for (const expected of unique([...fromDisk, ...fromCards])) {
        if (expected.bucket === RESTRICTED_BUCKET && publicKeys.has(expected.key)) {
          report(
            "insider-in-public-bucket",
            expected.where,
            `a past exam is also readable in the public bucket ${LIBRARY_BUCKET} (${expected.key}) → delete that object (ask the owner first) and keep it in ${RESTRICTED_BUCKET}`,
            expected.course,
          );
        }
        if (expected.bucket === LIBRARY_BUCKET && !publicKeys.has(expected.key) && privateKeys.has(expected.key)) {
          report(
            "wrong-bucket",
            expected.where,
            `a member file is only in ${RESTRICTED_BUCKET} (${expected.key}), where visitors cannot reach it → upload it to ${LIBRARY_BUCKET}, or classify the card as an exam`,
            expected.course,
          );
        }
      }

      if (disk) {
        checked("stale-object");
        const diskKeys = new Set(disk.files.map((rel) => storageKey(rel)));
        for (const [bucket, keys] of [
          [LIBRARY_BUCKET, publicKeys],
          [RESTRICTED_BUCKET, privateKeys],
        ] as const) {
          for (const key of [...keys].sort(compareText)) {
            if (!diskKeys.has(key)) {
              report(
                "stale-object",
                `${bucket}/${key}`,
                "the bucket holds it but public/assets has no such file → delete the object (ask the owner first) or restore the file",
                COURSES.find((c) => c.code.toLowerCase() === key.split("/")[1])?.code,
              );
            }
          }
        }
      } else {
        skipped.push({ rule: "stale-object", reason: "public/assets is not present" });
      }
    } catch (error) {
      remoteState = "failed";
      remoteError = error instanceof Error ? error.message : String(error);
      for (const rule of ["not-uploaded", "insider-in-public-bucket", "wrong-bucket", "stale-object"] as const) {
        skipped.push({ rule, reason: "the bucket listing failed" });
      }
    }
  }

  // ── output ─────────────────────────────────────────────────────────────────
  const scoped = options.course ? findings.filter((f) => f.course === options.course) : findings;
  const order = Object.keys(RULES) as Rule[];
  const count = (rule: Rule) => scoped.filter((f) => f.rule === rule).length;
  const bySeverity = (severity: Severity) => scoped.filter((f) => f.severity === severity).length;
  const errors = bySeverity("error");
  const warnings = bySeverity("warn");
  const infos = bySeverity("info");

  if (options.json) {
    console.log(
      JSON.stringify(
        {
          totals: {
            errors,
            warnings,
            info: infos,
            byRule: Object.fromEntries(order.filter((rule) => ran.has(rule)).map((rule) => [rule, count(rule)])),
            cards: assets.length,
            docs: Object.keys(index.docs).length,
            filesOnDisk: disk ? disk.files.length : null,
            index: indexState,
            remote: remoteState,
            course: options.course,
          },
          skipped,
          ...(remoteError ? { remoteError } : {}),
          findings: scoped,
        },
        null,
        2,
      ),
    );
  } else {
    const lines: string[] = [];
    lines.push(
      `library audit${options.course ? ` · ${options.course}` : ""} — ${assets.length} cards, ` +
        `${Object.keys(index.docs).length} docs, ` +
        `${disk ? `${disk.files.length} files on disk` : "public/assets absent"}, ` +
        `index ${indexState}, remote ${remoteState}`,
    );

    for (const severity of ["error", "warn", "info"] as const) {
      for (const rule of order.filter((r) => RULES[r].severity === severity)) {
        const group = scoped.filter((f) => f.rule === rule);
        if (group.length === 0) continue;
        lines.push("", `${severity.toUpperCase().padEnd(5)} ${rule} · ${group.length} · ${RULES[rule].summary}`);
        for (const f of group.slice(0, GROUP_LIMIT)) {
          lines.push(`  ${(f.course ?? "").padEnd(6)} ${f.where}  ${f.message}`);
        }
        if (group.length > GROUP_LIMIT) {
          lines.push(`  …and ${group.length - GROUP_LIMIT} more (--json lists them all)`);
        }
      }
    }

    lines.push("", "summary");
    for (const rule of order.filter((r) => ran.has(r))) {
      lines.push(`  ${RULES[rule].severity.padEnd(5)}  ${rule.padEnd(26)} ${String(count(rule)).padStart(4)}`);
    }
    for (const { rule, reason } of skipped) lines.push(`  skip   ${rule.padEnd(26)} ${reason}`);
    if (remoteError) lines.push("", `remote listing failed: ${remoteError}`);

    lines.push(
      "",
      `${errors} error${errors === 1 ? "" : "s"}, ${warnings} warning${warnings === 1 ? "" : "s"}, ${infos} info`,
    );
    console.log(lines.join("\n"));
  }

  // Findings that exist are real even when the bucket listing failed; only a clean
  // local result with an unreachable bucket is "could not finish".
  process.exitCode = errors > 0 ? 1 : remoteState === "failed" ? 2 : 0;
}

main().catch((error) => {
  console.error(error);
  process.exit(2);
});
