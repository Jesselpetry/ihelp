#!/usr/bin/env tsx
/**
 * Drift check for the living docs. Run with `bun run docs:check`.
 *
 * Code moves and the sentence about it stays where it was. Nothing notices, and the
 * next reader — usually an agent that takes AGENTS.md as fact — goes looking for a
 * file that is no longer there. This reads the docs that are meant to stay true and
 * reports every claim about the repo that the repo no longer backs:
 *
 *   stale-path            a path in backticks, or a relative link, that is not on disk
 *   unknown-script        `bun run <name>` where package.json has no such script
 *   component-not-listed  a .tsx file under components/ that components/README.md never names
 *   generated-list        the generated-files lists in AGENTS.md and FILE_STRUCTURE.md are
 *                         missing, empty or disagree
 *
 * Which docs: AGENTS.md, README.md, CONTRIBUTING.md, FILE_STRUCTURE.md, lib/README.md,
 * components/README.md, scripts/README.md, content/courses/README.md and every .md in docs/
 * and docs/adr/. CHANGELOG.md and docs/Current_Architecture_Report.md are left out on
 * purpose: they are history, and history keeps the paths it had. A doc that does not exist
 * yet is skipped, except where a rule below says it must be there.
 *
 * What counts as a path, so a doc can be written to be checked:
 *
 *   - A backtick span is a path when it starts with a top-level folder (app/, components/,
 *     lib/, scripts/, docs/, content/, data/, db/, public/) and holds no whitespace and no
 *     placeholder or glob character (< > * { } … ...). A trailing :12 or :12-30 and any #anchor
 *     are ignored. `app/courses/[dir]/page.tsx` is a real folder name, not a placeholder.
 *     It is found when it exists from the repo root or from the doc's own folder, since
 *     lib/README.md writes `docs/reading-progress.ts` for lib/docs/reading-progress.ts.
 *   - public/assets/ is never checked: it is gitignored, so it is absent in CI.
 *   - A bare file name counts only for a root-level file (package.json, next.config.ts, …).
 *     Anywhere else `summary.md` or `catalog.ts` means "the one in the folder being
 *     discussed", which a checker cannot know. components/README.md is the exception: it
 *     names files relative to components/ (`ui/button.tsx`), so those are resolved there.
 *   - A link is checked when it is relative: Markdown [text](path), ![alt](path) and HTML
 *     href/src, resolved against the doc's own folder. URLs, mailto:, #fragments and site
 *     routes such as /courses/… are not repo paths.
 *   - Fenced code blocks are skipped for paths (they hold shell sessions and ASCII trees,
 *     not claims) but not for `bun run`. HTML comments are skipped everywhere.
 *   - Names are compared exactly, case included: a Mac resolves docs/fonts.md to
 *     docs/FONTS.md, GitHub and CI do not.
 *
 * The generated-files lists sit between <!-- generated-files:start --> and
 * <!-- generated-files:end -->. Every path in backticks inside the block is compared, so put
 * only the generated files there and keep commands and prose about them outside the
 * backticks.
 *
 * Findings are printed as file:line. Exit code 1 when there is any, 0 otherwise, 2 when the
 * check could not run.
 */
import fs from "node:fs";
import path from "node:path";

import { ROOT } from "./library-root";

/** Every rule, in report order, with what a finding of it means. All are errors. */
const RULES = {
  "stale-path": "a path in backticks or a relative link that is not on disk",
  "unknown-script": "`bun run <name>` names a script that package.json does not have",
  "component-not-listed": "a .tsx file under components/ that components/README.md never mentions",
  "generated-list": "the generated-files lists in AGENTS.md and FILE_STRUCTURE.md are missing or disagree (every path in backticks between the markers counts)",
} as const;

type Rule = keyof typeof RULES;

interface Finding {
  rule: Rule;
  /** Repo-relative path of the file the finding is about. */
  file: string;
  /** 1-based line, when the finding points at one. */
  line: number | null;
  message: string;
}

const compareText = (a: string, b: string) => (a < b ? -1 : a > b ? 1 : 0);

// ── Arguments ────────────────────────────────────────────────────────────────

const USAGE = `usage: bun run docs:check

Reads the living docs and reports every claim about the repo that the repo no longer backs:

${Object.entries(RULES)
  .map(([rule, summary]) => `  ${rule.padEnd(21)}${summary}`)
  .join("\n")}

exit code: 1 if anything is reported, 0 otherwise, 2 if the check could not run`;

function parseArgs(argv: string[]) {
  for (const arg of argv) {
    if (arg === "--") continue;
    if (arg === "--help" || arg === "-h") {
      console.log(USAGE);
      process.exit(0);
    }
    console.error(`unknown argument "${arg}"\n\n${USAGE}`);
    process.exit(2);
  }
}

// ── The docs ─────────────────────────────────────────────────────────────────

const FIXED_DOCS = [
  "AGENTS.md",
  "README.md",
  "CONTRIBUTING.md",
  "FILE_STRUCTURE.md",
  "lib/README.md",
  "components/README.md",
  "scripts/README.md",
  "content/courses/README.md",
];

/** Folders whose top-level .md files are living docs too. */
const DOC_FOLDERS = ["docs", "docs/adr"];

/** History on purpose: they keep the paths the code had when they were written. */
const HISTORICAL = new Set(["CHANGELOG.md", "docs/Current_Architecture_Report.md"]);

const COMPONENTS_README = "components/README.md";

function livingDocs(): string[] {
  const docs = new Set(FIXED_DOCS.filter((rel) => fs.existsSync(path.join(ROOT, rel))));
  for (const folder of DOC_FOLDERS) {
    const dir = path.join(ROOT, folder);
    if (!fs.existsSync(dir)) continue;
    for (const name of fs.readdirSync(dir)) {
      const rel = `${folder}/${name}`;
      if (name.endsWith(".md") && !HISTORICAL.has(rel) && fs.statSync(path.join(dir, name)).isFile()) docs.add(rel);
    }
  }
  return [...docs].sort(compareText);
}

// ── Reading a doc ────────────────────────────────────────────────────────────

/** An inline code span: its text, and the line it starts on. */
interface Span {
  text: string;
  line: number;
}

/** A link target as written, and the line it is on. */
interface Link {
  target: string;
  line: number;
}

interface Doc {
  rel: string;
  /** The lines as written. The generated-files markers are looked up here. */
  lines: string[];
  inFence: boolean[];
  /** The text with only its HTML comments blanked: fenced blocks stay, because `bun run` is mostly written in them. */
  code: string;
  spans: Span[];
  links: Link[];
}

/**
 * Which lines sit inside a fenced code block, fence lines included. An unclosed fence
 * runs to the end of the file, as it does on GitHub.
 */
function fencedLines(lines: string[]): boolean[] {
  const inside: boolean[] = [];
  let open: { char: string; size: number } | null = null;
  for (const line of lines) {
    if (open === null) {
      const start = /^\s*(`{3,}|~{3,})(.*)$/.exec(line);
      // A backtick fence's info string cannot hold a backtick; that is what tells a fence
      // from ```code``` written on one line.
      const isFence = start !== null && !(start[1][0] === "`" && start[2].includes("`"));
      if (isFence) open = { char: start[1][0], size: start[1].length };
      inside.push(isFence);
      continue;
    }
    inside.push(true);
    if (new RegExp(`^\\s*${open.char}{${open.size},}\\s*$`).test(line)) open = null;
  }
  return inside;
}

/** Replaces every character but the line breaks, so offsets and line numbers survive. */
const blankOut = (text: string) => text.replace(/[^\n]/g, " ");

function lineLookup(text: string): (offset: number) => number {
  const starts = [0];
  for (let i = 0; i < text.length; i += 1) if (text[i] === "\n") starts.push(i + 1);
  return (offset) => {
    let low = 0;
    let high = starts.length - 1;
    while (low < high) {
      const mid = Math.ceil((low + high) / 2);
      if (starts[mid] <= offset) low = mid;
      else high = mid - 1;
    }
    return low + 1;
  };
}

/**
 * The inline code spans of a text, and the text with those spans blanked out (links are
 * looked for in that, so an example link inside backticks is not a link). Backtick runs
 * pair by length, as in CommonMark, and a span never crosses a blank line.
 */
function codeSpans(prose: string): { spans: Span[]; rest: string } {
  const lineAt = lineLookup(prose);
  const chars = prose.split("");
  const spans: Span[] = [];
  let i = 0;
  while (i < prose.length) {
    if (prose[i] !== "`") {
      i += 1;
      continue;
    }
    let size = 1;
    while (prose[i + size] === "`") size += 1;

    let close = -1;
    for (let at = prose.indexOf("`", i + size); at !== -1; at = prose.indexOf("`", at)) {
      let run = 1;
      while (prose[at + run] === "`") run += 1;
      if (run === size) {
        close = at;
        break;
      }
      at += run;
    }

    const inner = close === -1 ? "" : prose.slice(i + size, close);
    if (close === -1 || /\n[ \t]*\n/.test(inner)) {
      i += size; // an unmatched run is just backticks
      continue;
    }
    const flat = inner.replace(/\n/g, " ");
    // CommonMark drops one space on each side when the span has both and is not all spaces.
    const text = /^ .* $/.test(flat) && flat.trim() !== "" ? flat.slice(1, -1) : flat;
    spans.push({ text, line: lineAt(i) });
    for (let k = i; k < close + size; k += 1) if (chars[k] !== "\n") chars[k] = " ";
    i = close + size;
  }
  return { spans, rest: chars.join("") };
}

/** Markdown [text](target "title") and ![alt](target), plus HTML href="…" and src="…". */
function linksIn(rest: string): Link[] {
  const lineAt = lineLookup(rest);
  const links: Link[] = [];
  for (const match of rest.matchAll(/!?\[[^\]]*\]\(\s*(<[^>\n]*>|[^)\s]*)(?:\s+(?:"[^"\n]*"|'[^'\n]*'))?\s*\)/g)) {
    links.push({ target: match[1], line: lineAt(match.index ?? 0) });
  }
  for (const match of rest.matchAll(/\b(?:href|src)\s*=\s*"([^"]*)"/g)) {
    links.push({ target: match[1], line: lineAt(match.index ?? 0) });
  }
  return links;
}

function readDoc(rel: string): Doc {
  const text = fs.readFileSync(path.join(ROOT, rel), "utf8").replace(/\r\n/g, "\n");
  const lines = text.split("\n");
  const inFence = fencedLines(lines);

  const unfenced = lines.map((line, i) => (inFence[i] ? blankOut(line) : line)).join("\n");
  const prose = unfenced.replace(/<!--[\s\S]*?-->/g, blankOut);
  const proseLines = prose.split("\n");
  const code = lines.map((line, i) => (inFence[i] ? line : proseLines[i])).join("\n");

  const { spans, rest } = codeSpans(prose);
  return { rel, lines, inFence, code, spans, links: linksIn(rest) };
}

// ── The disk ─────────────────────────────────────────────────────────────────

/** Directory listings, read once: the name compared (NFC) → the name as stored. */
const listings = new Map<string, Map<string, string> | null>();

function listing(dir: string): Map<string, string> | null {
  if (!listings.has(dir)) {
    try {
      listings.set(dir, new Map(fs.readdirSync(dir).map((name) => [name.normalize("NFC"), name])));
    } catch {
      listings.set(dir, null); // not a folder, or not readable
    }
  }
  return listings.get(dir) ?? null;
}

type Lookup = { kind: "found" } | { kind: "case"; actual: string } | { kind: "missing" };

/**
 * Whether a repo-relative path exists, spelled exactly. fs.existsSync on a Mac says yes to
 * "docs/fonts.md" for docs/FONTS.md, and the same link is a 404 on GitHub and in CI, so this
 * walks the directory listings instead and says so when only the case differs. A trailing
 * slash means the path has to be a folder. Names are compared as NFC, so a Thai file name
 * typed on one machine matches the same name stored on another.
 */
function lookup(rel: string): Lookup {
  const segments = rel.split("/").filter((segment) => segment !== "" && segment !== ".");
  let dir = ROOT;
  let caseOnly = false;
  const actual: string[] = [];

  for (const segment of segments) {
    const names = listing(dir);
    if (names === null) return { kind: "missing" };
    const wanted = segment.normalize("NFC");
    let stored = names.get(wanted);
    if (stored === undefined) {
      const lower = wanted.toLowerCase();
      for (const [name, value] of names) {
        if (name.toLowerCase() === lower) {
          stored = value;
          caseOnly = true;
          break;
        }
      }
      if (stored === undefined) return { kind: "missing" };
    }
    actual.push(stored);
    dir = path.join(dir, stored);
  }

  if (rel.endsWith("/") && !fs.statSync(dir).isDirectory()) return { kind: "missing" };
  return caseOnly ? { kind: "case", actual: actual.join("/") } : { kind: "found" };
}

/** Folders a moved file can turn up in; public/assets is gitignored and large, so it is not walked. */
const TOP_LEVEL_DIRS = ["app", "components", "lib", "scripts", "docs", "content", "data", "db", "public"];

let fileNames: Map<string, string[]> | null = null;

/** Where files with this name live now: a stale path usually means the file moved, not vanished. */
function whereIs(name: string): string[] {
  if (fileNames === null) {
    fileNames = new Map();
    const walk = (dir: string, rel: string) => {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const childRel = `${rel}/${entry.name}`;
        if (childRel === "public/assets" || entry.name === "node_modules" || entry.name === ".DS_Store") continue;
        if (entry.isDirectory()) walk(path.join(dir, entry.name), childRel);
        else fileNames!.set(entry.name, [...(fileNames!.get(entry.name) ?? []), childRel]);
      }
    };
    for (const top of TOP_LEVEL_DIRS) if (fs.existsSync(path.join(ROOT, top))) walk(path.join(ROOT, top), top);
  }
  return (fileNames.get(name) ?? []).sort(compareText);
}

/** Why a repo-relative path is not acceptable, or null when it is. */
function problemWith(rel: string): string | null {
  const found = lookup(rel);
  if (found.kind === "found") return null;
  if (found.kind === "case") {
    return `exists as ${found.actual} — the case differs, which a Mac forgives and GitHub and CI do not`;
  }
  if (rel.endsWith("/") && lookup(rel.replace(/\/+$/, "")).kind === "found") return "is a file, not a folder";
  const moved = whereIs(path.posix.basename(rel.replace(/\/$/, "")));
  if (moved.length === 0) return "is not on disk";
  const shown = moved.slice(0, 3).join(", ");
  return `is not on disk — a file with that name is at ${shown}${moved.length > 3 ? `, +${moved.length - 3} more` : ""}`;
}

// ── What a doc says about paths ──────────────────────────────────────────────

const TOP_LEVEL = new RegExp(`^(?:${TOP_LEVEL_DIRS.join("|")})/`);

/** Characters that mean "some file", not "this file". Square brackets and parentheses are Next.js folder names. */
const PLACEHOLDER = /[<>*{}…]|\.\.\./;

/**
 * Root-level files worth checking by their bare name: the config files, the repo's own docs
 * and a few dotfiles. Anywhere else a bare name is ambiguous (`summary.md` exists in every
 * course folder), so it is left alone.
 */
const ROOT_FILES =
  /^(?:package\.json|tsconfig\.json|components\.json|bun\.lock|proxy\.ts|LICENSE|(?:AGENTS|CLAUDE|CHANGELOG|CONTRIBUTING|FILE_STRUCTURE|README)\.md|\.gitignore|\.vercelignore|\.env\.example|[a-z][\w-]*\.config\.[cm]?[jt]s)$/;

/** components/README.md writes `ui/button.tsx`, relative to components/. */
const COMPONENT_FILE = /^[\w.[\]()-]+(?:\/[\w.[\]()-]+)*\.tsx$/;

/** The repo-relative path a backtick span names, or null when it does not name one. */
function pathOfSpan(text: string, docRel: string): string | null {
  const trimmed = text.trim();
  if (trimmed === "" || /\s/.test(trimmed) || PLACEHOLDER.test(trimmed)) return null;
  const plain = trimmed.replace(/#.*$/, "").replace(/(?::\d+(?:[-–]\d+)?)+$/, "");

  if (TOP_LEVEL.test(plain)) return /^public\/assets(?:\/|$)/.test(plain) ? null : plain;
  if (ROOT_FILES.test(plain)) return plain;
  if (docRel === COMPONENTS_README && COMPONENT_FILE.test(plain)) return `components/${plain}`;
  return null;
}

/** The repo-relative path a link points at, or null when it is not a repo path. */
function pathOfLink(target: string, docRel: string): string | null {
  let raw = target.trim();
  if (raw.startsWith("<") && raw.endsWith(">")) raw = raw.slice(1, -1);
  // "#top", "/courses/x" (a site route), "https:", "mailto:", "//cdn…"
  if (raw === "" || raw.startsWith("#") || raw.startsWith("/") || /^[a-z][a-z0-9+.-]*:/i.test(raw)) return null;
  if (PLACEHOLDER.test(raw)) return null;
  raw = raw.split("#")[0].split("?")[0];
  if (raw === "") return null;
  try {
    raw = decodeURIComponent(raw);
  } catch {
    // keep it as written
  }
  return path.posix.normalize(path.posix.join(path.posix.dirname(docRel), raw));
}

// ── The checks ───────────────────────────────────────────────────────────────

interface Tally {
  docs: number;
  paths: number;
  commands: number;
  components: number;
}

/**
 * Why a path written in a doc is not acceptable, or null when it is. A doc may write a path
 * from its own folder: lib/README.md says `docs/reading-progress.ts` for
 * lib/docs/reading-progress.ts, and "docs/" is also a top-level folder here, so a path that
 * is not at the root counts when it exists beneath the doc's folder.
 */
function problemInDoc(rel: string, docRel: string): string | null {
  const problem = problemWith(rel);
  if (problem === null) return null;
  const folder = path.posix.dirname(docRel);
  if (folder !== "." && lookup(path.posix.join(folder, rel)).kind === "found") return null;
  return problem;
}

function checkPaths(doc: Doc, findings: Finding[], tally: Tally) {
  const report = (line: number, message: string) =>
    findings.push({ rule: "stale-path", file: doc.rel, line, message });

  for (const span of doc.spans) {
    const rel = pathOfSpan(span.text, doc.rel);
    if (rel === null) continue;
    tally.paths += 1;
    const problem = problemInDoc(rel, doc.rel);
    if (problem) report(span.line, `\`${span.text.trim()}\` ${problem}`);
  }

  for (const link of doc.links) {
    const rel = pathOfLink(link.target, doc.rel);
    if (rel === null) continue;
    tally.paths += 1;
    if (rel === ".." || rel.startsWith("../")) {
      report(link.line, `link ${link.target} points outside the repo`);
      continue;
    }
    const problem = problemWith(rel);
    if (problem) report(link.line, `link ${link.target}${rel === link.target ? "" : ` (${rel})`} ${problem}`);
  }
}

/** `bun run <name>`, in prose and in code blocks alike. */
function checkScripts(doc: Doc, scripts: Set<string>, findings: Finding[], tally: Tally) {
  doc.code.split("\n").forEach((line, index) => {
    for (const match of line.matchAll(/\bbun run ([A-Za-z0-9][\w:./-]*)/g)) {
      const name = match[1].replace(/[.:,;]+$/, ""); // "run bun run lint." ends a sentence
      tally.commands += 1;
      // `bun run scripts/foo.ts` runs a file, not a package.json script.
      const isFile = name.includes("/") || /\.(?:[cm]?[jt]sx?|py|sh)$/.test(name);
      const problem = isFile ? problemWith(name) : scripts.has(name) ? null : "is not a script in package.json";
      if (problem) {
        findings.push({ rule: "unknown-script", file: doc.rel, line: index + 1, message: `\`bun run ${name}\` ${problem}` });
      }
    }
  });
}

/** Every .tsx file under components/, relative to it. */
function componentFiles(): string[] {
  const found: string[] = [];
  const walk = (dir: string, rel: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const childRel = rel === "" ? entry.name : `${rel}/${entry.name}`;
      if (entry.isDirectory()) walk(path.join(dir, entry.name), childRel);
      else if (entry.name.endsWith(".tsx")) found.push(childRel);
    }
  };
  walk(path.join(ROOT, "components"), "");
  return found.sort(compareText);
}

const escapeRegExp = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * Whether the README names a file, by its path relative to components/ or its full path.
 * "navbar.tsx" must not be satisfied by "account/navbar.tsx", nor "button.tsx" by
 * "ui/button.tsx", so a hit counts only when no path character comes before or after it.
 */
function mentions(readme: string, relative: string): boolean {
  const pattern = new RegExp(`(?:^|[^\\w./@-])(?:components/)?${escapeRegExp(relative)}(?![\\w-]|\\.\\w)`);
  return pattern.test(readme);
}

function checkComponents(findings: Finding[], tally: Tally) {
  const files = componentFiles();
  tally.components = files.length;

  const readmePath = path.join(ROOT, COMPONENTS_README);
  if (!fs.existsSync(readmePath)) {
    findings.push({
      rule: "component-not-listed",
      file: COMPONENTS_README,
      line: null,
      message: `does not exist — it has to name each of the ${files.length} .tsx files under components/`,
    });
    return;
  }

  const readme = fs.readFileSync(readmePath, "utf8");
  for (const relative of files) {
    if (mentions(readme, relative)) continue;
    findings.push({
      rule: "component-not-listed",
      file: `components/${relative}`,
      line: null,
      message: `is not mentioned in ${COMPONENTS_README} → add a line for it there`,
    });
  }
}

const GENERATED_START = /^\s*<!--\s*generated-files:start\s*-->\s*$/;
const GENERATED_END = /^\s*<!--\s*generated-files:end\s*-->\s*$/;

/** The two docs that each carry the list of generated files, and must agree on it. */
const GENERATED_DOCS = ["AGENTS.md", "FILE_STRUCTURE.md"];

/** The backticked paths between the markers, each with the line it is first on. */
function generatedPaths(doc: Doc, findings: Finding[]): Map<string, number> | null {
  const fail = (line: number | null, message: string) => {
    findings.push({ rule: "generated-list", file: doc.rel, line, message });
    return null;
  };

  const markerLine = (marker: RegExp, from: number) => {
    for (let i = from; i < doc.lines.length; i += 1) if (!doc.inFence[i] && marker.test(doc.lines[i])) return i;
    return -1;
  };
  const start = markerLine(GENERATED_START, 0);
  if (start === -1) {
    return fail(null, "has no <!-- generated-files:start --> … <!-- generated-files:end --> block listing the generated files");
  }
  const end = markerLine(GENERATED_END, start + 1);
  if (end === -1) return fail(start + 1, "<!-- generated-files:start --> has no <!-- generated-files:end --> after it");

  const paths = new Map<string, number>();
  for (const span of doc.spans) {
    // The marker lines are comments, so no span sits on them; the block is the lines between.
    if (span.line <= start + 1 || span.line >= end + 1) continue;
    const text = span.text.trim().replace(/#.*$/, "").replace(/(?::\d+(?:[-–]\d+)?)+$/, "");
    const looksLikePath = text !== "" && !/\s/.test(text) && !text.startsWith("-") && (text.includes("/") || /\.\w+$/.test(text));
    if (!looksLikePath) continue;
    const key = text.replace(/^\.\//, "").replace(/\/$/, "");
    if (!paths.has(key)) paths.set(key, span.line);
  }
  if (paths.size === 0) return fail(start + 1, "the generated-files block lists no paths in backticks");
  return paths;
}

function checkGeneratedLists(docs: Map<string, Doc>, findings: Finding[]) {
  const lists = new Map<string, Map<string, number>>();
  for (const rel of GENERATED_DOCS) {
    const doc = docs.get(rel);
    if (!doc) {
      findings.push({ rule: "generated-list", file: rel, line: null, message: "does not exist" });
      continue;
    }
    const paths = generatedPaths(doc, findings);
    if (paths) lists.set(rel, paths);
  }
  if (lists.size < GENERATED_DOCS.length) return; // nothing to compare until both lists exist

  for (const [rel, paths] of lists) {
    const other = GENERATED_DOCS.find((candidate) => candidate !== rel)!;
    const theirs = lists.get(other)!;
    for (const [generated, line] of paths) {
      if (theirs.has(generated)) continue;
      findings.push({
        rule: "generated-list",
        file: rel,
        line,
        message: `lists \`${generated}\` as generated, but the list in ${other} does not`,
      });
    }
  }
}

// ── Output ───────────────────────────────────────────────────────────────────

function main() {
  parseArgs(process.argv.slice(2));

  let scripts: Set<string>;
  try {
    const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, "package.json"), "utf8")) as { scripts?: Record<string, string> };
    scripts = new Set(Object.keys(manifest.scripts ?? {}));
  } catch (error) {
    console.error(`could not read package.json: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(2);
  }

  const rels = livingDocs();
  if (rels.length === 0) {
    console.error("found none of the living docs — is this the repo root?");
    process.exit(2);
  }

  const docs = new Map(rels.map((rel) => [rel, readDoc(rel)]));
  const findings: Finding[] = [];
  const tally: Tally = { docs: docs.size, paths: 0, commands: 0, components: 0 };

  for (const doc of docs.values()) {
    checkPaths(doc, findings, tally);
    checkScripts(doc, scripts, findings, tally);
  }
  checkComponents(findings, tally);
  checkGeneratedLists(docs, findings);

  const lines: string[] = [
    `docs check — ${tally.docs} docs, ${tally.paths} paths and links, ${tally.commands} bun run commands, ${tally.components} components`,
  ];
  const where = (f: Finding) => (f.line === null ? f.file : `${f.file}:${f.line}`);
  const byPlace = (a: Finding, b: Finding) => compareText(a.file, b.file) || (a.line ?? 0) - (b.line ?? 0);

  for (const rule of Object.keys(RULES) as Rule[]) {
    const group = findings.filter((f) => f.rule === rule).sort(byPlace);
    if (group.length === 0) continue;
    lines.push("", `ERROR ${rule} · ${group.length} · ${RULES[rule]}`);
    for (const f of group) lines.push(`  ${where(f)}  ${f.message}`);
  }

  lines.push("", "summary");
  for (const rule of Object.keys(RULES) as Rule[]) {
    lines.push(`  ${rule.padEnd(21)} ${String(findings.filter((f) => f.rule === rule).length).padStart(4)}`);
  }
  lines.push("", `${findings.length} error${findings.length === 1 ? "" : "s"}`);
  console.log(lines.join("\n"));

  process.exitCode = findings.length > 0 ? 1 : 0;
}

try {
  main();
} catch (error) {
  console.error(error);
  process.exit(2);
}
