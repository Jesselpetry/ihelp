/**
 * The resource index: one normalized, deterministic JSON document that joins
 * what this repo keeps in six places — the course catalog, the module bindings,
 * the week schedules, the library cards, the generated manifest/stats and the
 * Markdown on disk — so a person or an agent can ask "what do we have for ITF
 * week 13?" without reading TypeScript.
 *
 * This module only *builds* the index in memory. scripts/library-index.ts
 * writes it to lib/library/resource-index.json, and scripts/library-audit.ts
 * builds the same thing to judge consistency and to tell whether the committed
 * file has gone stale — both call buildResourceIndex(), so there is no second
 * implementation to drift.
 *
 * Determinism is a hard requirement (running twice must give identical bytes),
 * which is why nothing here reads the clock, the disk's modification times, or
 * `public/assets` (that tree is gitignored and absent in CI): sizes and page
 * counts come from library-stats.json, "is it on disk" from library-manifest.json.
 */
import { ROOT } from "./library-root";

import fs from "node:fs";
import path from "node:path";
import { createElement, type ComponentProps } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { COURSES, courseDir } from "../lib/courses/catalog";
import { COURSE_BINDINGS } from "../lib/courses/course-bindings";
import { resolveCourseSpine } from "../lib/courses/course-spine";
import { STANDARD_SPINE } from "../lib/courses/spine";
import { readDocTable, textTableFromHast, type HastNode } from "../lib/docs/doc-table";
import { REMARK_MATH_OPTIONS, normalizeDisplayMath } from "../lib/docs/markdown";
import { remarkNotebook } from "../lib/docs/remark-notebook";
import { scheduleForCourse } from "../lib/library/course-weeks";
import LIBRARY_MANIFEST from "../lib/library/library-manifest.json";
import LIBRARY_STATS from "../lib/library/library-stats.json";
import { t } from "../lib/ltext";
import { storageKey } from "../lib/library/storage-key";
import { SUBJECT_ASSETS, mergedAssets } from "../lib/library/subject-library";
import { isRestrictedAsset, type SubjectAsset } from "../lib/library/subject-library-ui";
import { BUCKETS, bucketForAsset } from "../lib/storage/buckets";

export { ROOT };

// ── The index's shape ───────────────────────────────────────────────────────
// Mirrored, field for field, by lib/library/resource-index.schema.json — which
// is where each value's origin is documented. Change both together.

export type Scope = "midterm" | "final";
export type ModuleStatusName = "available" | "coming_soon" | "locked";
export type DocRole =
  | "overview"
  | "blueprint"
  | "week"
  | "study-guide"
  | "doc"
  | "data"
  | "readme"
  | "virtual";
export type BucketName = (typeof BUCKETS)["library" | "libraryExams"];

export interface TextPair {
  th: string;
  en: string;
}

export interface ModuleEntry {
  id: string;
  segment: string;
  status: ModuleStatusName;
  href: string | null;
  docs: string[];
}

export interface WeekEntry {
  week: number;
  scope: Scope | null;
  title: TextPair | null;
  upcoming: boolean;
  video: string | null;
  docs: string[];
  assets: string[];
}

export interface CourseCounts {
  assets: number;
  curated: number;
  generated: number;
  insider: number;
  legacy: number;
  withScope: number;
  withWeek: number;
  byCategory: Record<string, number>;
}

export interface CourseEntry {
  code: string;
  officialCode: string | null;
  dir: string;
  name: TextPair;
  group: string;
  credits: string | null;
  href: string;
  contentDir: string;
  assetDirs: string[];
  modules: ModuleEntry[];
  readiness: { available: number; total: number };
  weeks: WeekEntry[];
  unscheduledAssets: string[];
  assets: string[];
  docs: string[];
  counts: CourseCounts;
}

export interface DocBindingEntry {
  module: string;
  segment: string;
  slug: string;
  href: string | null;
  chapter: number | null;
  scope: Scope | null;
}

export interface DocEntry {
  id: string;
  path: string | null;
  course: string | null;
  role: DocRole;
  title: string | null;
  rendered: boolean;
  bindings: DocBindingEntry[];
  week: number | null;
  updated: string | null;
  assetRefs: string[];
  unresolvedRefs: string[];
}

export interface AssetEntry {
  id: string;
  course: string;
  origin: "curated" | "generated";
  title: TextPair;
  description: TextPair | null;
  category: string | null;
  fileType: "pdf" | "image" | "md" | "file";
  url: string;
  path: string | null;
  fileName: string;
  storage: { bucket: BucketName; key: string } | null;
  access: "member" | "insider";
  week: number | null;
  scope: Scope | null;
  edition: string | null;
  status: string | null;
  isCurrentYear: boolean;
  duplicateOf: string | null;
  sourceUrl: string | null;
  groupId: string | null;
  tags: string[];
  sizeBytes: number | null;
  pages: number | null;
  onDisk: boolean;
  usedBy: string[];
}

export interface IndexTotals {
  courses: number;
  coursesWithLibrary: number;
  docs: number;
  renderedDocs: number;
  assets: number;
  curated: number;
  generated: number;
  insider: number;
  files: number;
  sizeBytes: number;
  pages: number;
}

export interface ResourceIndex {
  $schema: "./resource-index.schema.json";
  version: 1;
  about: string;
  totals: IndexTotals;
  courses: Record<string, CourseEntry>;
  docs: Record<string, DocEntry>;
  assets: Record<string, AssetEntry>;
}

/** What the audit needs beyond the index itself. */
export interface BuildExtras {
  /** Every merged card exactly as the library serves it, before id de-duplication. */
  raw: Array<{
    course: string;
    asset: SubjectAsset;
    origin: "curated" | "generated";
    /** The key this card got in `index.assets`. */
    key: string;
  }>;
  /** Things the build tolerated: a repeated id that was renamed, a bound doc that loaded nothing. */
  warnings: string[];
}

export interface BuildResult {
  index: ResourceIndex;
  extras: BuildExtras;
}

// ── Where the index lives ───────────────────────────────────────────────────

export const INDEX_RELATIVE = "lib/library/resource-index.json";
export const INDEX_FILE = path.join(ROOT, INDEX_RELATIVE);

/** Two-space JSON plus a trailing newline — the exact bytes written to disk. */
export function serializeIndex(index: ResourceIndex): string {
  return `${JSON.stringify(index, null, 2)}\n`;
}

// ── Generated inputs ────────────────────────────────────────────────────────
// Typed once here so the audit reads the same objects the index was built from.

type AssetStat = { sizeBytes: number; pages?: number };
export const STATS = LIBRARY_STATS as Record<string, AssetStat | undefined>;
export const MANIFEST = LIBRARY_MANIFEST as Record<string, SubjectAsset[]>;

/** Locale-independent ordering, so the output never depends on the machine's ICU. */
export function compareText(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

/**
 * A bilingual string with both sides filled in. Content ported from Thai-only
 * sources omits `en`, and the app then shows the Thai (lib/ltext.ts `t`); the
 * index holds what an English reader would be shown, not a hole.
 */
function textPair(text: { th: string; en?: string }): TextPair {
  return { th: text.th, en: t(text, "en") };
}

/** The url of a card without its `#page=…` / `#chapter-1` fragment. */
export function bareUrl(url: string): string {
  return url.split("#")[0];
}

// ── Markdown: what a doc's file tables resolve to ───────────────────────────

// The shape react-markdown's `table` component hands over: createTableReader
// collects these and tableFileRefs reads them.
export type { HastNode };

/** One cell in a doc's file column, and the card (if any) it lands on. */
export interface FileRef {
  fileName: string;
  matched: SubjectAsset | undefined;
}

/**
 * The file cards a doc's table turns into. The rules — what makes a table a
 * document table, which column holds the files, how a name finds its card —
 * are lib/docs/doc-table.ts's, the same ones the reader applies
 * (components/md-view.tsx), so the audit judges the page readers actually get.
 * What is left here is what the index needs: the file name each row names and
 * the card it lands on. The title and pages columns are dropped: they decide
 * what a card says, never whether a row becomes a card or which asset it lands on.
 *
 * Returns null when the table is not a document table.
 */
export function tableFileRefs(node: HastNode | undefined, assets: SubjectAsset[]): FileRef[] | null {
  const table = textTableFromHast(node);
  const rows = table ? readDocTable(table, assets) : null;
  return rows ? rows.map((row) => ({ fileName: row.fileName, matched: row.matchedAsset })) : null;
}

/**
 * Parses Markdown with the pipeline MdView uses and hands back every table as
 * the hast element a `table` component would receive.
 *
 * It runs react-markdown itself rather than a look-alike: raw HTML in a cell
 * (`<br>`) becomes literal text there, which changes what a filename cell
 * reads as, and only the real pipeline does exactly that. The plugin list is
 * MdView's, minus rehype-katex — a math cell is never a filename — and its
 * options, like the display-math rewrite that runs before parsing, come from
 * lib/docs/markdown.ts so the two cannot drift. The packages are ESM-only,
 * hence the dynamic imports (this file runs as CJS under tsx).
 */
export async function createTableReader(): Promise<(markdown: string) => HastNode[]> {
  const [{ default: ReactMarkdown }, { default: remarkGfm }, { default: remarkFrontmatter }, { default: remarkMath }] =
    await Promise.all([
      import("react-markdown"),
      import("remark-gfm"),
      import("remark-frontmatter"),
      import("remark-math"),
    ]);

  const remarkPlugins: ComponentProps<typeof ReactMarkdown>["remarkPlugins"] = [
    remarkFrontmatter,
    remarkGfm,
    [remarkMath, REMARK_MATH_OPTIONS],
    remarkNotebook,
  ];

  return (markdown) => {
    const tables: HastNode[] = [];
    renderToStaticMarkup(
      createElement(
        ReactMarkdown,
        {
          remarkPlugins,
          components: {
            table: ({ node }: { node?: unknown }) => {
              if (node) tables.push(node as HastNode);
              return null;
            },
          },
        },
        normalizeDisplayMath(markdown),
      ),
    );
    return tables;
  };
}

// ── Markdown: front matter and headings ─────────────────────────────────────

function splitFrontmatter(markdown: string): { frontmatter: string | null; body: string } {
  const match = markdown.match(/^\uFEFF?---\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)/);
  return match
    ? { frontmatter: match[1], body: markdown.slice(match[0].length) }
    : { frontmatter: null, body: markdown };
}

function frontmatterValue(frontmatter: string | null, key: string): string | null {
  if (frontmatter === null) return null;
  const match = frontmatter.match(new RegExp(`^${key}:[ \\t]*(.*?)[ \\t]*$`, "m"));
  if (!match) return null;
  const value = match[1].replace(/^(["'])(.*)\1$/, "$2").trim();
  return value || null;
}

/** Text of the first `# ` heading, skipping fenced code (where `# comment` lives). */
function firstHeading(body: string): string | null {
  let fence: string | null = null;
  for (const line of body.split(/\r?\n/)) {
    if (fence === null) {
      const opening = line.match(/^ {0,3}(`{3,}|~{3,})/)?.[1];
      if (opening) {
        fence = opening;
        continue;
      }
    } else {
      // A closing fence carries no info string, so "```js" inside a block does not end it.
      const closing = line.match(/^ {0,3}(`{3,}|~{3,})[ \t]*$/)?.[1];
      if (closing && closing[0] === fence[0] && closing.length >= fence.length) fence = null;
      continue;
    }

    const heading = line.match(/^ {0,3}#[ \t]+(.+?)[ \t]*$/);
    if (heading) {
      const text = heading[1].replace(/[ \t]+#+$/, "").trim();
      if (text) return text;
    }
  }
  return null;
}

// ── Docs on disk ────────────────────────────────────────────────────────────

/** Every directory whose Markdown the index covers. */
const DOC_ROOTS = ["content/courses", "data/it-kmitl", "data/en-kmitl"];

function walkMarkdown(dir: string, out: string[]): void {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkMarkdown(full, out);
    else if (entry.name.endsWith(".md")) out.push(full);
  }
}

function readMarkdownFiles(): Array<{ path: string; content: string }> {
  const absolute: string[] = [];
  for (const root of DOC_ROOTS) walkMarkdown(path.join(ROOT, root), absolute);
  return absolute
    .map((file) => path.relative(ROOT, file).split(path.sep).join("/"))
    .sort(compareText)
    .map((rel) => ({ path: rel, content: fs.readFileSync(path.join(ROOT, rel), "utf-8") }));
}

function roleOf(docPath: string | null): DocRole {
  if (docPath === null) return "virtual";
  const base = path.posix.basename(docPath);
  const lower = base.toLowerCase();
  // `archive/readme.md` (lowercase) exists, so the match ignores case.
  if (lower === "readme.md") return "readme";
  if (docPath.startsWith("data/")) return "data";
  if (lower === "summary.md") return "overview";
  if (lower === "blueprint.md") return "blueprint";
  if (/^week\d+\.md$/.test(lower) && path.posix.basename(path.posix.dirname(docPath)) === "archive") {
    return "week";
  }
  if (lower.includes("study-guide")) return "study-guide";
  return "doc";
}

/**
 * Which course a file belongs to, by where it lives: `content/courses/<dir>/…`
 * names the course directly, and `data/<namespace>/<subject>/…` names it by its
 * lowercased code (itf, ics, mfit, chem). The two Thai-named files directly
 * under `data/en-kmitl/` carry no subject folder; they are Computer
 * Programming's, read by loadEnKmitl() in lib/courses/en-kmitl.ts.
 */
function ownerOfPath(docPath: string): string | null {
  const parts = docPath.split("/");
  if (parts[0] === "content" && parts[1] === "courses" && parts.length >= 4) {
    return COURSES.find((c) => courseDir(c) === parts[2])?.code ?? null;
  }
  if (parts[0] === "data" && parts.length >= 4) {
    return COURSES.find((c) => c.code.toLowerCase() === parts[2])?.code ?? null;
  }
  if (docPath.startsWith("data/en-kmitl/")) return "COMPRO";
  return null;
}

// ── The build ───────────────────────────────────────────────────────────────

interface DocDraft {
  id: string;
  path: string | null;
  content: string;
  bindings: Array<DocBindingEntry & { course: string }>;
}

const ABOUT =
  "Generated by `bun run library:index` (scripts/library-index.ts) from lib/courses/catalog.ts, " +
  "lib/courses/course-bindings.ts, lib/courses/course-spine.ts, lib/library/subject-library.ts, " +
  "lib/library/library-manifest.json, lib/library/library-stats.json, lib/library/course-weeks.ts and " +
  "every Markdown file under content/courses, data/it-kmitl and data/en-kmitl. Do not edit it by hand " +
  "— change a source and rebuild. Never import it from app code: it lists every card, past exams " +
  "included, and would carry that metadata into client bundles. Query it with `bun run library:find` " +
  "or jq; each field is documented in resource-index.schema.json.";

/**
 * Whether `week` row `w` of a course schedule is where an asset or doc numbered
 * `n` with scope `scope` is filed. The rule of `weekOf` in
 * components/subject-library/weekly-table.tsx: first matching row wins, a row
 * without a scope takes either half, and ICS (which numbers both halves 1–7)
 * is told apart by scope alone.
 */
function rowTakes(row: { week: number; scope?: Scope }, n: number, scope: Scope | null): boolean {
  return row.week === n && (!row.scope || !scope || row.scope === scope);
}

export async function buildResourceIndex(): Promise<BuildResult> {
  const warnings: string[] = [];

  // ── assets ────────────────────────────────────────────────────────────────
  const manifestUrls = new Set<string>();
  for (const list of Object.values(MANIFEST)) for (const a of list) manifestUrls.add(a.url);

  const raw: BuildExtras["raw"] = [];
  const assets: Record<string, AssetEntry> = {};
  const keyOf = new Map<SubjectAsset, string>();
  const courseAssets = new Map<string, SubjectAsset[]>();
  const idUses = new Map<string, number>();

  for (const course of COURSES) {
    const curated = new Set(SUBJECT_ASSETS[course.code] ?? []);
    const merged = mergedAssets(course.code);
    courseAssets.set(course.code, merged);

    for (const asset of merged) {
      const origin = curated.has(asset) ? "curated" : "generated";

      // Index keys must stay unique. The first holder keeps the id; the audit
      // reports the collision itself (rule id-collision) from `raw`.
      const uses = (idUses.get(asset.id) ?? 0) + 1;
      idUses.set(asset.id, uses);
      const key = uses === 1 ? asset.id : `${asset.id}~${uses}`;
      if (uses > 1) {
        warnings.push(`asset id "${asset.id}" repeats (${course.code}); indexed as "${key}"`);
      }
      keyOf.set(asset, key);
      raw.push({ course: course.code, asset, origin, key });

      const bare = bareUrl(asset.url);
      const isFile = bare.startsWith("/assets/");
      const restricted = isRestrictedAsset(asset);
      const stat = STATS[bare];
      const described = asset.description.th !== "" || (asset.description.en ?? "") !== "";

      assets[key] = {
        id: key,
        course: course.code,
        origin,
        title: textPair(asset.title),
        description: described ? textPair(asset.description) : null,
        category: asset.category ?? null,
        fileType: asset.fileType,
        url: asset.url,
        path: isFile ? `public${bare}` : null,
        fileName: asset.fileName,
        storage: isFile
          ? { bucket: BUCKETS[bucketForAsset(asset)], key: storageKey(bare) }
          : null,
        access: restricted ? "insider" : "member",
        week: asset.week ?? asset.chapter ?? null,
        scope: asset.scope ?? null,
        edition: asset.edition ?? null,
        status: asset.status ?? null,
        isCurrentYear: asset.isCurrentYear === true,
        duplicateOf: asset.duplicateOf ?? null,
        sourceUrl: asset.sourceUrl ?? null,
        groupId: asset.groupId ?? null,
        tags: [...asset.tags],
        sizeBytes: stat?.sizeBytes ?? null,
        pages: stat?.pages ?? null,
        onDisk: manifestUrls.has(bare),
        usedBy: [],
      };
    }
  }

  // ── docs: files, then the bindings that render them ───────────────────────
  const files = readMarkdownFiles();
  const drafts = new Map<string, DocDraft>();
  const byContent = new Map<string, string[]>();
  for (const file of files) {
    drafts.set(file.path, { id: file.path, path: file.path, content: file.content, bindings: [] });
    byContent.set(file.content, [...(byContent.get(file.content) ?? []), file.path]);
  }

  const moduleDocs = new Map<string, string[]>();
  for (const course of COURSES) {
    const resolved = resolveCourseSpine(course.code, courseDir(course));
    const bindings = COURSE_BINDINGS[course.code] ?? {};

    for (const spec of STANDARD_SPINE) {
      const href = resolved.find((m) => m.id === spec.id)?.href ?? null;
      const loaded: Array<{ slug: string; chapter?: number; scope?: Scope; markdown: string }> = [];
      for (const doc of bindings[spec.id]?.docs ?? []) {
        const markdown = doc.load();
        if (markdown === null) {
          warnings.push(`${course.code}.${spec.id}: doc "${doc.slug}" loaded nothing — its file is missing`);
          continue;
        }
        loaded.push({ slug: doc.slug, chapter: doc.chapter, scope: doc.scope, markdown });
      }

      const ids: string[] = [];
      for (const doc of loaded) {
        // The reader opens a specific document through ?doc=<slug> (see
        // components/module-reader.tsx); a one-document module needs no query.
        const docHref = href !== null && loaded.length > 1 ? `${href}?doc=${doc.slug}` : href;
        const matches = byContent.get(doc.markdown);
        const targets = matches ?? [`virtual:${course.code}/${spec.segment}/${doc.slug}`];

        for (const id of targets) {
          let draft = drafts.get(id);
          if (!draft) {
            draft = { id, path: null, content: doc.markdown, bindings: [] };
            drafts.set(id, draft);
          }
          draft.bindings.push({
            course: course.code,
            module: spec.id,
            segment: spec.segment,
            slug: doc.slug,
            href: docHref,
            chapter: doc.chapter ?? null,
            scope: doc.scope ?? null,
          });
          if (!ids.includes(id)) ids.push(id);
        }
      }
      moduleDocs.set(`${course.code}/${spec.id}`, ids);
    }
  }

  // ── docs: entries, with the cards their file tables resolve to ────────────
  const readTables = await createTableReader();
  const docs: Record<string, DocEntry> = {};

  for (const id of [...drafts.keys()].sort(compareText)) {
    const draft = drafts.get(id)!;
    const boundCourses = [...new Set(draft.bindings.map((b) => b.course))];
    const owner =
      draft.path !== null ? ownerOfPath(draft.path) : boundCourses.length === 1 ? boundCourses[0] : null;

    // The cards a doc's tables resolve against are the ones its page is handed:
    // assetsForCourse(code), i.e. the course's library minus past exams. A doc
    // nothing renders is checked against its owner, as if it were rendered there.
    const resolveAgainst = boundCourses.length > 0 ? boundCourses : owner ? [owner] : [];
    const assetRefs: string[] = [];
    const unresolvedRefs: string[] = [];
    if (resolveAgainst.length > 0) {
      const tables = readTables(draft.content);
      for (const code of resolveAgainst) {
        const visible = (courseAssets.get(code) ?? []).filter((a) => !isRestrictedAsset(a));
        for (const table of tables) {
          for (const ref of tableFileRefs(table, visible) ?? []) {
            if (ref.matched) {
              const key = keyOf.get(ref.matched)!;
              if (!assetRefs.includes(key)) assetRefs.push(key);
            } else if (!unresolvedRefs.includes(ref.fileName)) {
              unresolvedRefs.push(ref.fileName);
            }
          }
        }
      }
    }

    const { frontmatter, body } = splitFrontmatter(draft.content);
    const chapter = draft.bindings.find((b) => b.chapter !== null)?.chapter ?? null;
    const weekFromName = draft.path?.match(/(?:^|\/)week(\d{1,2})\.md$/i);

    docs[id] = {
      id,
      path: draft.path,
      course: owner,
      role: roleOf(draft.path),
      title: firstHeading(body),
      rendered: draft.bindings.length > 0,
      bindings: draft.bindings.map((b) => ({
        module: b.module,
        segment: b.segment,
        slug: b.slug,
        href: b.href,
        chapter: b.chapter,
        scope: b.scope,
      })),
      week: chapter ?? (weekFromName ? Number(weekFromName[1]) : null),
      updated: frontmatterValue(frontmatter, "updated"),
      assetRefs,
      unresolvedRefs,
    };
  }

  for (const doc of Object.values(docs)) {
    for (const key of doc.assetRefs) assets[key].usedBy.push(doc.id);
  }
  for (const asset of Object.values(assets)) asset.usedBy.sort(compareText);

  // ── courses ───────────────────────────────────────────────────────────────
  const courses: Record<string, CourseEntry> = {};

  for (const course of COURSES) {
    const dir = courseDir(course);
    const resolved = resolveCourseSpine(course.code, dir);
    const entries = (courseAssets.get(course.code) ?? []).map((a) => assets[keyOf.get(a)!]);
    const ownedDocs = Object.values(docs)
      .filter((d) => d.course === course.code)
      .map((d) => d.id);

    const modules: ModuleEntry[] = STANDARD_SPINE.map((spec) => {
      const slot = resolved.find((m) => m.id === spec.id);
      return {
        id: spec.id,
        segment: spec.segment,
        status: slot?.status ?? "coming_soon",
        href: slot?.href ?? null,
        docs: moduleDocs.get(`${course.code}/${spec.id}`) ?? [],
      };
    });

    // A doc's scope, for filing it under a week, is the one the course binds it with.
    const docScope = (doc: DocEntry): Scope | null => doc.bindings.find((b) => b.scope !== null)?.scope ?? null;

    let weeks: WeekEntry[];
    const unscheduledAssets: string[] = [];
    const schedule = scheduleForCourse(course.code);

    if (schedule) {
      weeks = schedule.weeks.map((w) => ({
        week: w.week,
        scope: w.scope ?? null,
        title: textPair(w.title),
        upcoming: w.upcoming === true,
        video: w.video ?? null,
        docs: [],
        assets: [],
      }));
      const rowFor = (n: number, scope: Scope | null) => schedule.weeks.findIndex((w) => rowTakes(w, n, scope));

      for (const asset of entries) {
        const at = asset.week === null ? -1 : rowFor(asset.week, asset.scope);
        if (at === -1) unscheduledAssets.push(asset.id);
        else weeks[at].assets.push(asset.id);
      }
      for (const id of ownedDocs) {
        const doc = docs[id];
        const at = doc.week === null ? -1 : rowFor(doc.week, docScope(doc));
        if (at !== -1) weeks[at].docs.push(id);
      }
    } else {
      // No schedule: one row per distinct week the course's own assets and docs name.
      const numbers = new Set<number>();
      for (const asset of entries) if (asset.week !== null) numbers.add(asset.week);
      for (const id of ownedDocs) if (docs[id].week !== null) numbers.add(docs[id].week!);
      weeks = [...numbers]
        .sort((a, b) => a - b)
        .map((n) => ({
          week: n,
          scope: null,
          title: null,
          upcoming: false,
          video: null,
          docs: ownedDocs.filter((id) => docs[id].week === n),
          assets: entries.filter((a) => a.week === n).map((a) => a.id),
        }));
      for (const asset of entries) if (asset.week === null) unscheduledAssets.push(asset.id);
    }

    const byCategory: Record<string, number> = {};
    for (const asset of entries) {
      const category = asset.category ?? "uncategorised";
      byCategory[category] = (byCategory[category] ?? 0) + 1;
    }

    const assetDirs = new Set<string>();
    for (const asset of entries) {
      if (asset.path === null) continue;
      const segments = asset.path.split("/");
      assetDirs.add(segments.slice(0, Math.min(4, segments.length - 1)).join("/"));
    }

    courses[course.code] = {
      code: course.code,
      officialCode: course.officialCode ?? null,
      dir,
      name: { th: course.nameTh, en: course.nameEn },
      group: course.group,
      credits: course.credits ?? null,
      href: `/courses/${dir}`,
      contentDir: `content/courses/${dir}`,
      assetDirs: [...assetDirs].sort(compareText),
      modules,
      readiness: {
        available: modules.filter((m) => m.status === "available").length,
        total: modules.length,
      },
      weeks,
      unscheduledAssets,
      assets: entries.map((a) => a.id),
      docs: ownedDocs,
      counts: {
        assets: entries.length,
        curated: entries.filter((a) => a.origin === "curated").length,
        generated: entries.filter((a) => a.origin === "generated").length,
        insider: entries.filter((a) => a.access === "insider").length,
        legacy: entries.filter((a) => a.status === "legacy").length,
        withScope: entries.filter((a) => a.scope !== null).length,
        withWeek: entries.filter((a) => a.week !== null).length,
        byCategory: Object.fromEntries(
          Object.entries(byCategory).sort(([a], [b]) => compareText(a, b)),
        ),
      },
    };
  }

  // ── totals ────────────────────────────────────────────────────────────────
  const allAssets = Object.values(assets);
  const allDocs = Object.values(docs);
  const distinct = new Map<string, AssetEntry>();
  for (const asset of allAssets) if (asset.path !== null && !distinct.has(asset.path)) distinct.set(asset.path, asset);

  const index: ResourceIndex = {
    $schema: "./resource-index.schema.json",
    version: 1,
    about: ABOUT,
    totals: {
      courses: COURSES.length,
      coursesWithLibrary: Object.values(courses).filter((c) => c.counts.assets > 0).length,
      docs: allDocs.length,
      renderedDocs: allDocs.filter((d) => d.rendered).length,
      assets: allAssets.length,
      curated: allAssets.filter((a) => a.origin === "curated").length,
      generated: allAssets.filter((a) => a.origin === "generated").length,
      insider: allAssets.filter((a) => a.access === "insider").length,
      files: distinct.size,
      sizeBytes: [...distinct.values()].reduce((sum, a) => sum + (a.sizeBytes ?? 0), 0),
      pages: [...distinct.values()].reduce((sum, a) => sum + (a.pages ?? 0), 0),
    },
    courses,
    docs,
    assets,
  };

  return { index, extras: { raw, warnings } };
}
