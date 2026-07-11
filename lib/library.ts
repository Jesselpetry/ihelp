import fs from "fs";
import path from "path";
import { ROOT } from "@/lib/paths";

// Bundled AI-Guidelines-PSCP docs, rendered as a book on /library.
// Override the folder with AI_GUIDELINES_PATH (same pattern as OJ_PROBLEMS_PATH).
const GUIDELINES_DIR =
  process.env.AI_GUIDELINES_PATH ?? path.join(ROOT, "data", "ai-guidelines");

export interface LibrarySection {
  dir: string; // "" = repo root
  title: { th: string; en: string };
}

// Book order: policy first, then how-tos, then reference material.
const SECTIONS: LibrarySection[] = [
  { dir: "", title: { th: "นโยบายหลัก", en: "Course policy" } },
  { dir: "policies", title: { th: "นโยบายห้องแลป", en: "Lab policies" } },
  { dir: "workflows", title: { th: "วิธีใช้ AI แต่ละแบบ", en: "Student workflows" } },
  { dir: "instructions", title: { th: "คำสั่งสำหรับ AI", en: "AI instructions" } },
  { dir: "templates", title: { th: "เทมเพลตทางการ", en: "Official templates" } },
  { dir: "examples", title: { th: "ตัวอย่างไฟล์", en: "Example files" } },
];

export interface LibraryDoc {
  slug: string; // url-safe id, e.g. "workflows--student-workflow-claude-code"
  section: LibrarySection;
  baseName: string; // file name without .th / .md suffixes
  title: string; // first heading of the English (or only) variant
  hasTh: boolean;
  hasEn: boolean;
}

function firstHeading(md: string, fallback: string): string {
  const m = md.match(/^#\s+(.+)$/m);
  return m ? m[1].trim() : fallback;
}

function slugify(dir: string, baseName: string): string {
  const base = baseName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return dir ? `${dir}--${base}` : base;
}

function variantPath(dir: string, baseName: string, locale: "th" | "en"): string {
  const name = locale === "th" ? `${baseName}.th.md` : `${baseName}.md`;
  return path.join(GUIDELINES_DIR, dir, name);
}

// Scan the guidelines folder and pair .md / .th.md variants into one doc each.
export function loadLibrary(): LibraryDoc[] {
  const docs: LibraryDoc[] = [];
  for (const section of SECTIONS) {
    const dirPath = path.join(GUIDELINES_DIR, section.dir);
    if (!fs.existsSync(dirPath)) continue;
    const files = fs
      .readdirSync(dirPath)
      .filter((f) => f.endsWith(".md"))
      .sort();
    const baseNames = [
      ...new Set(files.map((f) => f.replace(/\.th\.md$/, "").replace(/\.md$/, ""))),
    ];
    for (const baseName of baseNames) {
      const hasTh = files.includes(`${baseName}.th.md`);
      const hasEn = files.includes(`${baseName}.md`);
      const sample = fs.readFileSync(
        variantPath(section.dir, baseName, hasEn ? "en" : "th"),
        "utf8",
      );
      // skip pointer files like CLAUDE.md containing only "@AGENTS.md"
      if (/^@\S+\s*$/.test(sample.trim())) continue;
      docs.push({
        slug: slugify(section.dir, baseName),
        section,
        baseName,
        title: firstHeading(sample, baseName),
        hasTh,
        hasEn,
      });
    }
  }
  return docs;
}

export interface LibraryDocContent extends LibraryDoc {
  th: string | null;
  en: string | null;
  prev: LibraryDoc | null;
  next: LibraryDoc | null;
  index: number; // 0-based position in the book
  total: number;
}

export function loadLibraryDoc(slug: string): LibraryDocContent | null {
  const docs = loadLibrary();
  const i = docs.findIndex((d) => d.slug === slug);
  if (i === -1) return null;
  const doc = docs[i];
  const read = (locale: "th" | "en") =>
    fs.readFileSync(variantPath(doc.section.dir, doc.baseName, locale), "utf8");
  return {
    ...doc,
    th: doc.hasTh ? read("th") : null,
    en: doc.hasEn ? read("en") : null,
    prev: i > 0 ? docs[i - 1] : null,
    next: i < docs.length - 1 ? docs[i + 1] : null,
    index: i,
    total: docs.length,
  };
}
