#!/usr/bin/env node
/**
 * Builds lib/library-manifest.json — one card entry for every file under
 * public/assets/ that lib/subject-library.ts does not already describe by hand.
 *
 * The curated arrays in subject-library.ts carry bilingual titles and exam
 * scopes that no filename can supply, so they always win. This manifest is the
 * floor beneath them: it means a PDF dropped into
 * public/assets/it-kmitl/<subject>/<category>/ shows up on the shelf without
 * anyone hand-writing an entry first. Regenerate with:
 *
 *   npm run library:manifest
 *
 * Deliberately does NOT guess `scope`. Midterm/final is whatever the course's
 * own summary.md states, never an inference from a week number in a filename.
 *
 * It DOES read `chapter`, but only when the filename states one outright — a
 * `week08` or `ch3` token. That is a fact the file is asserting about itself,
 * not an inference about the term. Files that say nothing get no chapter, which
 * is the same rule the dropzone SOP applies to everything else: leave it blank
 * rather than guess, and let a curated entry fill it in later.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const ASSETS = path.join(ROOT, "public", "assets");
const OUT = path.join(ROOT, "lib", "library-manifest.json");

/** Asset-tree folder name -> the course code the gallery keys on. */
const SUBJECT_CODE = {
  itf: "ITF", ics: "ICS", mfit: "MFIT", pscp: "PSCP", charm: "CHARM",
  fe: "FE", fe2: "FE2", dsa: "DSA", oop: "OOP", pstat: "PSTAT",
  bfit: "BFIT", dl: "DL", compro: "COMPRO", chem: "CHEM",
};

/** Category folder -> gallery shelf (AssetCategory in subject-library.ts). */
const SHELF = {
  lectures: "lecture", slides: "lecture",
  sheets: "cheatsheet",
  exams: "exam",
  exercises: "exercise", labs: "exercise", activities: "exercise",
  worksheets: "exercise", cases: "exercise",
  notes: "note", pages: "note",
  references: "reference", misc: "reference",
};

/** Filename's second token -> the kind of document it announces. */
const DOC_TYPE = {
  lec: "Lecture", sheet: "Sheet", ex: "Exercise", hw: "Homework",
  lab: "Lab", quiz: "Quiz", note: "Note", ref: "Reference",
  midterm: "Midterm", final: "Final", archive: "Archive",
};

const FILE_TYPE = {
  ".pdf": "pdf",
  ".jpg": "image", ".jpeg": "image", ".png": "image", ".webp": "image",
  ".md": "md",
};

const ROMAN = new Set(["i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix", "x"]);
const UPPER = new Set(["os", "it", "ui", "ux", "id", "io", "ai", "sql", "mux", "cpu", "swot", "disc", "oj"]);

/** "week08" -> "Week 08", "ii" -> "II", "os" -> "OS", "database" -> "Database". */
function humanizeToken(tok) {
  if (ROMAN.has(tok)) return tok.toUpperCase();
  if (UPPER.has(tok)) return tok.toUpperCase();
  const m = tok.match(/^([a-z]+)(\d+)$/);
  if (m) return humanizeToken(m[1]) + " " + m[2];
  if (/^\d+$/.test(tok)) return tok;
  return tok.charAt(0).toUpperCase() + tok.slice(1);
}

/**
 * A readable title from a sanitized filename. "itf-lec-week08-database.pdf"
 * reads back as "Lecture · Week 08 Database" — the subject prefix is dropped
 * because the card already sits on that subject's shelf.
 */
function titleFrom(base, subjectFolder) {
  let toks = base.split("-").filter(Boolean);
  if (toks[0] === subjectFolder) toks = toks.slice(1);
  let label = null;
  if (toks.length > 1 && DOC_TYPE[toks[0]]) { label = DOC_TYPE[toks[0]]; toks = toks.slice(1); }
  const rest = toks.map(humanizeToken).join(" ").trim();
  if (label && rest) return `${label} · ${rest}`;
  return rest || label || base;
}

/**
 * The chapter or week a filename names outright.
 *
 * Matches the tokens the naming convention already uses — `week08`, `ch3`,
 * `lec02`, `unit4` — and nothing else. A bare number in a filename is usually a
 * year (`2564`) or a paper number, so it is ignored: a wrong chapter is worse
 * than no chapter, because it files a slide under a week it does not belong to.
 */
function chapterFrom(base) {
  for (const tok of base.split("-")) {
    const m = tok.match(/^(week|wk|ch|chapter|lec|lecture|unit)0*(\d{1,2})$/);
    if (m) {
      const n = Number(m[2]);
      if (n >= 1 && n <= 20) return n;
    }
  }
  return undefined;
}

function walk(dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(full));
    else if (e.name !== ".DS_Store") out.push(full);
  }
  return out;
}

const manifest = {};
let skipped = 0;
let chaptered = 0;

for (const file of walk(ASSETS).sort()) {
  const rel = path.relative(ASSETS, file).split(path.sep);
  // <namespace>/<subject>/<category>/<file>, e.g. it-kmitl/itf/lectures/x.pdf
  if (rel.length < 4) { skipped++; continue; }
  const [, subjectFolder, categoryFolder] = rel;
  const code = SUBJECT_CODE[subjectFolder];
  if (!code) { skipped++; continue; }

  const name = rel[rel.length - 1];
  const ext = path.extname(name).toLowerCase();
  const base = name.slice(0, name.length - ext.length);
  const title = titleFrom(base, subjectFolder);
  const shelf = SHELF[categoryFolder] ?? "reference";
  const extClean = ext.replace(/^\./, "").toLowerCase();
  const baseId = `gen-${subjectFolder}-${categoryFolder}-${base}${extClean ? '-' + extClean : ''}`;
  const chapter = chapterFrom(base);
  if (chapter !== undefined) chaptered++;

  (manifest[code] ??= []).push({
    id: baseId,
    title: { th: title, en: title },
    description: { th: "", en: "" },
    tags: [code, categoryFolder],
    category: shelf,
    fileType: FILE_TYPE[ext] ?? "file",
    url: "/assets/" + rel.join("/"),
    fileName: name,
    courseCode: code,
    ...(chapter !== undefined ? { chapter } : {}),
  });
}

fs.writeFileSync(OUT, JSON.stringify(manifest, null, 2) + "\n");
const total = Object.values(manifest).reduce((a, v) => a + v.length, 0);
console.log(
  `wrote ${total} entries across ${Object.keys(manifest).length} subjects ` +
  `to ${path.relative(ROOT, OUT)}, ${chaptered} with a chapter` +
  (skipped ? ` (${skipped} unmapped, skipped)` : ""),
);
