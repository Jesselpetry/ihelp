#!/usr/bin/env tsx
/**
 * Searches the committed resource index, so "which ITF file is the week 13
 * lab sheet?" is one command instead of a grep through 5,000 lines of
 * TypeScript. Run with `bun run library:find -- <terms…>`.
 *
 *   bun run library:find -- packet tracer --course ITF   # cards matching both words
 *   bun run library:find -- --course ITF --week 13       # everything filed under week 13
 *   bun run library:find -- --kind exercise --course ICS # one shelf of one course
 *   bun run library:find -- --docs --course ITF --week 13
 *   bun run library:find -- week13 --json                # the matching records
 *
 * Terms are ANDed and matched case-insensitively as substrings of a card's id,
 * file name, titles, tags and descriptions (a doc's path, title, role and
 * week with --docs). With no terms, the filters alone decide.
 *
 * It reads lib/library/resource-index.json as committed — rebuild that with
 * `bun run library:index` after changing a source — and deliberately loads
 * nothing else, so it answers in a fraction of a second.
 */
import fs from "node:fs";
import path from "node:path";

import { ROOT } from "./library-root";
import type { AssetEntry, DocEntry, ResourceIndex } from "./library-shared";

const INDEX_RELATIVE = "lib/library/resource-index.json";

/** The shelves a card can be on (AssetCategory in lib/library/subject-library-ui.ts). */
const KINDS = ["lecture", "cheatsheet", "exam", "exercise", "note", "reference"];
/** The roles a doc can have (DocEntry.role). */
const ROLES = ["overview", "blueprint", "week", "study-guide", "doc", "data", "readme", "virtual"];

const USAGE = `usage: bun run library:find -- [terms…] [--course CODE] [--week N] [--kind KIND] [--docs] [--json]

  terms          words that must all appear (case-insensitive) in a card's id, file name,
                 titles, tags or description — or, with --docs, in a doc's path, title, role or week
  --course CODE  only this course (ITF, ICS, MFIT, …)
  --week N       only material filed under week N
  --kind KIND    only this kind: ${KINDS.join(" | ")}
                 (with --docs: a doc role — ${ROLES.join(" | ")})
  --docs         search docs instead of library cards
  --json         print the matching records as JSON instead of a table

Reads ${INDEX_RELATIVE}; rebuild it with: bun run library:index`;

interface Options {
  terms: string[];
  course: string | null;
  week: number | null;
  kind: string | null;
  docs: boolean;
  json: boolean;
}

function usageError(message: string): never {
  console.error(`${message}\n\n${USAGE}`);
  process.exit(2);
}

function parseArgs(argv: string[]): Options {
  const options: Options = { terms: [], course: null, week: null, kind: null, docs: false, json: false };

  // `--flag value` and `--flag=value` both work.
  const valueOf = (arg: string, name: string, i: number): { value: string; next: number } | null => {
    if (arg === name) {
      const value = argv[i + 1];
      if (value === undefined || value.startsWith("--")) usageError(`${name} needs a value`);
      return { value, next: i + 1 };
    }
    if (arg.startsWith(`${name}=`)) return { value: arg.slice(name.length + 1), next: i };
    return null;
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--") continue; // `bun run … -- terms` may pass the separator through
    if (arg === "--help" || arg === "-h") {
      console.log(USAGE);
      process.exit(0);
    }
    if (arg === "--docs") {
      options.docs = true;
      continue;
    }
    if (arg === "--json") {
      options.json = true;
      continue;
    }

    const course = valueOf(arg, "--course", i);
    if (course) {
      options.course = course.value;
      i = course.next;
      continue;
    }
    const week = valueOf(arg, "--week", i);
    if (week) {
      if (!/^\d+$/.test(week.value)) usageError(`--week needs a whole number, got "${week.value}"`);
      options.week = Number(week.value);
      i = week.next;
      continue;
    }
    const kind = valueOf(arg, "--kind", i);
    if (kind) {
      options.kind = kind.value;
      i = kind.next;
      continue;
    }

    if (arg.startsWith("--")) usageError(`unknown option "${arg}"`);
    options.terms.push(arg);
  }
  return options;
}

function loadIndex(): ResourceIndex {
  const file = path.join(ROOT, INDEX_RELATIVE);
  if (!fs.existsSync(file)) {
    console.error(`${INDEX_RELATIVE} does not exist yet — build it with: bun run library:index`);
    process.exit(1);
  }
  let index: ResourceIndex;
  try {
    index = JSON.parse(fs.readFileSync(file, "utf-8")) as ResourceIndex;
  } catch (error) {
    console.error(`${INDEX_RELATIVE} is not valid JSON (${(error as Error).message}) — rebuild it with: bun run library:index`);
    process.exit(1);
  }
  if (index.version !== 1) {
    console.error(`${INDEX_RELATIVE} has version ${String(index.version)}, this script reads version 1 — rebuild it with: bun run library:index`);
    process.exit(1);
  }
  return index;
}

/** Every term must appear somewhere in the text. */
function matchesAll(terms: string[], text: string): boolean {
  const haystack = text.toLowerCase();
  return terms.every((term) => haystack.includes(term.toLowerCase()));
}

function assetText(asset: AssetEntry): string {
  return [
    asset.id,
    asset.fileName,
    asset.title.th,
    asset.title.en,
    ...asset.tags,
    asset.description?.th ?? "",
    asset.description?.en ?? "",
  ].join("\n");
}

function docText(doc: DocEntry): string {
  return [doc.path ?? doc.id, doc.title ?? "", doc.role, doc.week === null ? "" : `week ${doc.week}`].join("\n");
}

/** Left-aligned columns separated by two spaces; the last column is left ragged. */
function table(header: string[], rows: string[][]): string {
  const widths = header.map((title, col) => Math.max(title.length, ...rows.map((row) => row[col].length)));
  const render = (row: string[]) =>
    row
      .map((cell, col) => (col === row.length - 1 ? cell : cell.padEnd(widths[col])))
      .join("  ")
      .trimEnd();
  return [render(header), ...rows.map(render)].join("\n");
}

function main() {
  const argv = process.argv.slice(2);
  const options = parseArgs(argv);

  // A bare invocation is a request for help, not for all 700 cards.
  const bare =
    options.terms.length === 0 &&
    options.course === null &&
    options.week === null &&
    options.kind === null &&
    !options.docs &&
    !options.json;
  if (bare) {
    console.log(USAGE);
    return;
  }

  const index = loadIndex();

  let course: string | null = null;
  if (options.course !== null) {
    course = Object.keys(index.courses).find((code) => code.toLowerCase() === options.course!.toLowerCase()) ?? null;
    if (!course) usageError(`unknown course "${options.course}" — known: ${Object.keys(index.courses).join(", ")}`);
  }

  let kind: string | null = null;
  if (options.kind !== null) {
    const known = options.docs ? ROLES : KINDS;
    kind = known.find((value) => value === options.kind!.toLowerCase()) ?? null;
    if (!kind) usageError(`unknown ${options.docs ? "role" : "kind"} "${options.kind}" — known: ${known.join(", ")}`);
  }

  if (options.docs) {
    const all = Object.values(index.docs);
    const hits = all.filter(
      (doc) =>
        (course === null || doc.course === course) &&
        (options.week === null || doc.week === options.week) &&
        (kind === null || doc.role === kind) &&
        matchesAll(options.terms, docText(doc)),
    );

    if (options.json) {
      console.log(JSON.stringify(hits, null, 2));
      return;
    }
    if (hits.length === 0) {
      console.log(`no docs match (of ${all.length})`);
      return;
    }
    console.log(
      table(
        ["PATH", "COURSE", "WEEK", "ROLE", "RENDERED", "TITLE"],
        hits.map((doc) => [
          doc.path ?? doc.id,
          doc.course ?? "-",
          doc.week === null ? "-" : String(doc.week),
          doc.role,
          doc.rendered ? "yes" : "no",
          doc.title ?? "-",
        ]),
      ),
    );
    console.log(`\n${hits.length} of ${all.length} docs`);
    return;
  }

  const all = Object.values(index.assets);
  const hits = all.filter(
    (asset) =>
      (course === null || asset.course === course) &&
      (options.week === null || asset.week === options.week) &&
      (kind === null || asset.category === kind) &&
      matchesAll(options.terms, assetText(asset)),
  );

  if (options.json) {
    console.log(JSON.stringify(hits, null, 2));
    return;
  }
  if (hits.length === 0) {
    console.log(`no cards match (of ${all.length})`);
    return;
  }
  console.log(
    table(
      ["ID", "COURSE", "WEEK", "CATEGORY", "PAGES", "ACCESS", "PATH"],
      hits.map((asset) => [
        asset.id,
        asset.course,
        asset.week === null ? "-" : String(asset.week),
        asset.category ?? "-",
        asset.pages === null ? "-" : String(asset.pages),
        asset.access,
        asset.path ?? asset.url,
      ]),
    ),
  );
  console.log(`\n${hits.length} of ${all.length} cards`);
}

main();
