import type { LText } from "@/lib/i18n";

/**
 * The half of the subject library that a Client Component may import.
 *
 * lib/subject-library.ts imports library-manifest.json and library-stats.json
 * at module scope, so anything a client component pulls from it drags both
 * files — every asset's title, filename and size, past exams included — into
 * the browser bundle. Splitting the presentation constants out keeps that
 * metadata on the server. Import display helpers from here; import the asset
 * data itself only from a Server Component.
 */

// SubjectAsset describes one item in a subject's resource library.
// fileType determines how the preview modal renders the asset.
export type AssetFileType = "pdf" | "image" | "md" | "file";

/**
 * Half of the term a resource is studied for. The boundary is whatever each
 * course's own summary states — week 7 for ITF/ICS/MFIT/PSCP, chapter 7 for
 * DSA/PSTAT, week 8 for BFIT — never a guess from a filename.
 */
export type AssetScope = "midterm" | "final";

/**
 * What kind of study material this is, which is what the gallery's filter
 * chips switch on. Distinct from `fileType`, which only says how to render it:
 * a cheatsheet and a lecture deck are both PDFs but never the same shelf.
 */
export type AssetCategory =
  | "lecture"    // slide decks handed out by the lecturer
  | "cheatsheet" // condensed summaries, recap sheets, formula cards
  | "exam"       // past papers, quizzes, mock exams
  | "exercise"   // worksheets, labs, practice sets, activities
  | "note"       // scanned handwriting and photographed whiteboards
  | "reference"; // lookup tables and other supporting material

export interface SubjectAsset {
  id: string;
  title: LText;
  description: LText;
  tags: string[];         // display tags, e.g. ["Ch.2", "Variables", "Cheatsheet"]
  fileType: AssetFileType;
  url: string;            // public path, e.g. "/assets/en-kmitl/compro/cheatsheet.pdf"
  fileName: string;       // used for the download link's suggested filename
  /** Gallery shelf. Inferred from tags and fileType when left unset. */
  category?: AssetCategory;
  /** Short course code shown on the card's spine badge, e.g. "MFIT". */
  courseCode?: string;
  /**
   * Which exam this material is studied for. Left unset for anything that
   * spans the whole term — a course plan, a lookup table, a submission guide —
   * so it stays visible under either milestone.
   */
  scope?: AssetScope;
  /**
   * Scan set this image belongs to, keyed into ASSET_GROUPS. A run of pages
   * photographed from one notebook or one exam paper is a single thing a
   * student reaches for, so the gallery collapses them into one stack instead
   * of 26 identical cards. Only images are grouped.
   */
  groupId?: string;
  /**
   * Which chapter or week this material belongs to.
   *
   * The join key the library was missing. The app knew MFIT week 3 covers
   * systems of linear equations and knew `mfit-lec-week03-*.pdf` existed, and
   * nothing connected the two — so a 101-card shelf could not be cut by week,
   * and a quiz question could not point at the deck it came from.
   *
   * Filled by scripts/build-library-manifest.mjs only when the filename states
   * a chapter outright, and by hand on curated entries. Left unset otherwise:
   * material that genuinely spans the term has no chapter, and a wrong chapter
   * files a slide under a week it does not belong to.
   */
  chapter?: number;
  /** PDF page count. Filled in from library-stats.json by withAssetStats(). */
  pages?: number;
  /** File size in bytes. Filled in from library-stats.json by withAssetStats(). */
  sizeBytes?: number;
}


/**
 * Display names for the image groups referenced by SubjectAsset.groupId.
 *
 * A group is a page run, not a topic tag: the pages of one notebook or one
 * scanned paper, in order. Splitting them any finer than the source material
 * actually records would mean inventing a lecture mapping that the scans do
 * not carry.
 */
export const ASSET_GROUPS: Record<string, LText> = {
  "itf-class-notes": {
    th: "สมุดจดในชั้นเรียน (Lecture 01–07)",
    en: "Class notebook (Lectures 01–07)",
  },
  "ics-midterm-2564-scan": {
    th: "ภาพสแกนข้อสอบกลางภาค 1/2564",
    en: "Scanned midterm paper, 1/2564",
  },
};

// Tag vocabularies the library already uses, mapped onto gallery shelves. The
// existing entries are tagged in a mix of Thai and English, so both are listed.
const CATEGORY_TAGS: [AssetCategory, string[]][] = [
  ["note", ["สมุดจด", "note", "scan", "handwritten"]],
  ["lecture", ["สไลด์", "slide", "lecture", "handout"]],
  ["exercise", ["แบบฝึกหัด", "exercise", "worksheet", "activity", "lab", "practice", "pretest"]],
  ["cheatsheet", ["cheatsheet", "ชีทสรุป", "สรุป", "summary", "recap", "study guide"]],
  ["reference", ["reference", "ตาราง", "table", "อ้างอิง"]],
  ["exam", ["ข้อสอบ", "exam", "midterm", "final", "quiz", "mock", "past paper"]],
];

/**
 * Which gallery shelf an asset belongs on.
 *
 * An explicit `category` always wins, and every bundled entry sets one. The tag
 * scan is the fallback for anything added later: it runs most-specific first,
 * so "exam" only claims an asset that carries no tag naming what kind of
 * document it is. Anything unrecognised falls back to its file type.
 */
export function resolveCategory(asset: SubjectAsset): AssetCategory {
  if (asset.category) return asset.category;

  const tags = asset.tags.map((tag) => tag.toLowerCase());
  for (const [category, vocabulary] of CATEGORY_TAGS) {
    if (tags.some((tag) => vocabulary.some((word) => tag.includes(word)))) {
      return category;
    }
  }
  return asset.fileType === "image" ? "note" : "lecture";
}

/** Labels for the midterm/final segmented control and the card badges. */
export const SCOPE_LABEL: Record<AssetScope, LText> = {
  midterm: { th: "ก่อนมิดเทอม", en: "Midterm" },
  final: { th: "หลังมิดเทอม", en: "Final" },
};

/** Space-constrained variant for the badge printed on each card. */
export const SCOPE_SHORT: Record<AssetScope, LText> = {
  midterm: { th: "มิดเทอม", en: "Midterm" },
  final: { th: "ไฟนอล", en: "Final" },
};

/** Longer copy for the section heading above each scope's cards. */
export const SCOPE_HEADING: Record<AssetScope, LText> = {
  midterm: { th: "ก่อนสอบมิดเทอม", en: "Before the midterm" },
  final: { th: "หลังสอบมิดเทอม / ไฟนอล", en: "After the midterm · final" },
};

/** "3.4 MB" / "812 KB" — the size line on a book-cover card. */
export function formatBytes(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

/**
 * Whether an asset is a past exam paper, and therefore insider-only.
 *
 * Classified on `category`, not on path. Ten scanned past-exam pages live at
 * /assets/it-kmitl/ics/pages/pg-*.jpg — outside any `exams/` folder — so a
 * path rule alone silently publishes them. The path check is kept as a second
 * net for anything dropped into an `exams/` folder before it is categorised.
 *
 * Keep this in step with scripts/sync-library-assets.ts, which decides from the
 * same rule which bucket a file is uploaded to.
 */
export function isRestrictedAsset(asset: {
  url: string;
  category?: AssetCategory;
}): boolean {
  return asset.category === "exam" || asset.url.split("#")[0].includes("/exams/");
}
