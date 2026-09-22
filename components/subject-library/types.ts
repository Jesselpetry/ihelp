import type { CSSProperties } from "react";
import {
  CalendarRange,
  FileText,
  Flag,
  FlaskConical,
  Milestone,
  NotebookPen,
  ScrollText,
  Sigma,
  Table2,
} from "lucide-react";

import { t, type LText } from "@/lib/i18n";
import {
  formatBytes,
  resolveCategory,
  SCOPE_SHORT,
  type AssetCategory,
  type AssetFileType,
  type AssetScope,
  type SubjectAsset,
} from "@/lib/library/subject-library-ui";

export type LayoutMode = "gallery" | "table" | "list";
export type Filter = AssetCategory | "all";

/**
 * What the grid actually lays out. A run of scanned pages collapses into one
 * stack, so a 26-page notebook costs one card and one thumbnail rather than 26
 * of each.
 */
export type GalleryEntry =
  | { kind: "single"; key: string; asset: SubjectAsset }
  | { kind: "stack"; key: string; title: LText; assets: SubjectAsset[] };

/**
 * Where the scope control can sit. "term" is the bucket for material that is
 * not tied to either half — a lookup table, a course plan — which is shown
 * under both milestones rather than hidden by either.
 */
export type ScopeFilter = AssetScope | "all";
export type ScopeBucket = AssetScope | "term";

/** Which milestone bucket an entry files under; a stack takes its cover's. */
export function entryScope(entry: GalleryEntry): ScopeBucket {
  const asset = entry.kind === "single" ? entry.asset : entry.assets[0];
  return asset.scope ?? "term";
}

// ── Category styling ─────────────────────────────────────────────────────────
export interface CategoryStyle {
  label: LText;
  icon: typeof FileText;
  /**
   * Rung on the ladder, applied to the card root. Everything inside then reads
   * `--shelf` through `.shelf-accent` / `.shelf-wash` / `.shelf-pill` /
   * `.shelf-glyph`, so a card is coloured by one class instead of four.
   */
  shelf: string;
}

export const CATEGORY: Record<AssetCategory, CategoryStyle> = {
  lecture: {
    label: { th: "สไลด์บรรยาย", en: "Lecture PDFs" },
    icon: ScrollText,
    shelf: "shelf-1",
  },
  cheatsheet: {
    label: { th: "ชีทสรุป", en: "Cheatsheets" },
    icon: Sigma,
    shelf: "shelf-2",
  },
  exam: {
    label: { th: "ข้อสอบเก่า", en: "Past Papers" },
    icon: FileText,
    shelf: "shelf-3",
  },
  exercise: {
    label: { th: "แบบฝึกหัด", en: "Exercises" },
    icon: FlaskConical,
    shelf: "shelf-4",
  },
  note: {
    label: { th: "ภาพสมุดจด", en: "Image Notes" },
    icon: NotebookPen,
    shelf: "shelf-5",
  },
  reference: {
    label: { th: "อ้างอิง", en: "References" },
    icon: Table2,
    shelf: "shelf-6",
  },
};

export const SCOPE_ICON: Record<ScopeBucket, typeof Milestone> = {
  midterm: Milestone,
  final: Flag,
  term: CalendarRange,
};

export const SCOPE_BADGE: Record<AssetScope, string> = {
  midterm: "border-transparent bg-primary text-primary-foreground shadow-xs",
  final: "border-primary/30 bg-primary/10 text-primary",
};

export const SCOPE_BADGE_ON_MEDIA: Record<AssetScope, string> = {
  midterm: "border-transparent bg-primary text-primary-foreground shadow-sm",
  final: "border-primary/60 bg-primary/25 text-white backdrop-blur-md",
};

export const FILE_TYPE_LABEL: Record<AssetFileType, string> = {
  pdf: "PDF",
  image: "IMG",
  md: "MD",
  file: "FILE",
};

export const L = {
  noPreview: {
    th: "ไฟล์นี้เปิดดูในเบราว์เซอร์ไม่ได้ — ดาวน์โหลดเพื่อเปิด",
    en: "This file type can't be previewed in the browser — download to open it.",
  },
  searchPlaceholder: { th: "ค้นหาชื่อเรื่อง คำอธิบาย หรือแท็ก…", en: "Search titles, descriptions, or tags…" },
  filterAll: { th: "ทั้งหมด", en: "All" },
  noResults: { th: "ไม่พบทรัพยากรที่ตรงกับคำค้นหา", en: "No resources match your search" },
  noResultsHint: { th: "ลองล้างตัวกรองหรือเปลี่ยนคำค้นหา", en: "Try clearing the filters or searching for something else" },
  clear: { th: "ล้างตัวกรอง", en: "Clear filters" },
  clearSearch: { th: "ล้างคำค้นหา", en: "Clear search" },
  clearAll: { th: "ล้างตัวกรองทั้งหมด", en: "Clear all filters" },
  activeFilters: { th: "ตัวกรองที่เลือก", en: "Active filters" },
  sortBy: { th: "เรียงตาม", en: "Sort by" },
  sortDefault: { th: "ค่าเริ่มต้น (แนะนำ)", en: "Default (Curated)" },
  allChapters: { th: "ทุกบท", en: "All chapters" },
  allTopics: { th: "หัวข้อทั้งหมด", en: "All topics" },
  moreTopics: { th: "หัวข้อเพิ่มเติม", en: "More topics" },
  filterScope: { th: "ช่วงสอบ", en: "Scope" },
  filterCat: { th: "หมวดหมู่", en: "Category" },
  filterCh: { th: "บทที่", en: "Ch." },
  filterTag: { th: "หัวข้อ", en: "Topic" },
  filterQuery: { th: "คำค้น", en: "Search" },
  preview: { th: "ดูตัวอย่าง", en: "Preview" },
  download: { th: "ดาวน์โหลด", en: "Download" },
  viewContent: { th: "ดูเนื้อหา", en: "View Content" },
  closePreview: { th: "ปิดหน้าต่างตัวอย่าง", en: "Close preview" },
  openInTab: { th: "เปิดในแท็บใหม่", en: "Open in new tab" },
  gallery: { th: "มุมมองแกลเลอรี", en: "Gallery view" },
  table: { th: "มุมมองตาราง", en: "Table view" },
  list: { th: "มุมมองกระชับ", en: "Compact list" },
  colName: { th: "ชื่อเอกสาร", en: "Name" },
  colCategory: { th: "หมวดหมู่", en: "Category" },
  colScope: { th: "ช่วงสอบ", en: "Scope" },
  colChapter: { th: "บท/สัปดาห์", en: "Chapter/Week" },
  colSize: { th: "ขนาด", en: "Size" },
  colActions: { th: "การดำเนินการ", en: "Actions" },
  copyLink: { th: "คัดลอกลิงก์", en: "Copy link" },
  linkCopied: { th: "คัดลอกแล้ว!", en: "Link copied!" },
  expandStack: { th: "ขยายรายการ", en: "Expand set" },
  collapseStack: { th: "ย่อรายการ", en: "Collapse set" },
  topics: { th: "หัวข้อ", en: "Topics" },
  chapters: { th: "บท/สัปดาห์", en: "Chapter" },
  scopeAll: { th: "ทั้งหมด", en: "All" },
  termWide: { th: "ตลอดภาคการศึกษา", en: "All term" },
  examScope: { th: "ช่วงสอบ", en: "Exam scope" },
  emptyScope: { th: "ยังไม่มีเอกสารในช่วงนี้", en: "Nothing filed under this milestone yet" },
  count: { th: "รายการ", en: "items" },
  pages: { th: "หน้า", en: "pages" },
  images: { th: "ภาพ", en: "images" },
  page: { th: "หน้า", en: "Page" },
  expand: { th: "ดูทุกภาพในชุด", en: "Show every page" },
  collapse: { th: "ย่อชุดภาพ", en: "Collapse set" },
  expandDocs: { th: "ดูทุกฉบับในชุด", en: "Show all editions" },
  collapseDocs: { th: "ย่อชุดเอกสาร", en: "Collapse editions" },
  zoomIn: { th: "ขยาย", en: "Zoom in" },
  zoomOut: { th: "ย่อ", en: "Zoom out" },
  resetZoom: { th: "รีเซ็ตการซูม", en: "Reset zoom" },
  fullscreen: { th: "เต็มจอ", en: "Fullscreen" },
  exitFullscreen: { th: "ออกจากเต็มจอ", en: "Exit fullscreen" },
  prev: { th: "ก่อนหน้า", en: "Previous" },
  next: { th: "ถัดไป", en: "Next" },
  panHint: { th: "ลากเพื่อเลื่อน · เลื่อนล้อเพื่อซูม", en: "Drag to pan · scroll to zoom" },
  mdHint: {
    th: "เอกสารนี้อ่านในเว็บ กด “ดูเนื้อหา” เพื่อเปิดหน้าอ่านพร้อมสารบัญ",
    en: "This one reads in-app — open it for the full text with a side outline.",
  },
} satisfies Record<string, LText>;

/** "12 หน้า · 3.4 MB", dropping whichever half is unknown. */
export function metaLine(asset: SubjectAsset, locale: "th" | "en"): string {
  const parts: string[] = [];
  if (asset.pages) parts.push(`${asset.pages} ${t(L.pages, locale)}`);
  if (asset.sizeBytes) parts.push(formatBytes(asset.sizeBytes));
  if (parts.length === 0) return asset.fileName;
  return parts.join(" · ");
}

const CHAPTER_TAG = /^(ch\.|บทที่|week|unit|lecture\s|สัปดาห์)/i;

export function chapterTag(asset: SubjectAsset): string | undefined {
  return asset.tags.find((tag) => CHAPTER_TAG.test(tag)) ?? asset.tags[0];
}

/**
 * Cards below the fold cost nothing to lay out until they scroll near the
 * viewport. The reserved height keeps the scrollbar honest in the meantime.
 */
export const DEFERRED: CSSProperties = {
  contentVisibility: "auto",
  containIntrinsicSize: "auto 260px",
};

// ── Global Sorting ───────────────────────────────────────────────────────────

export type SortColumn = "default" | "chapter" | "name" | "size" | "category" | "scope";
export type SortDirection = "asc" | "desc";

export interface SortOptionItem {
  id: string;
  col: SortColumn;
  dir: SortDirection;
  label: LText;
}

export const SORT_OPTIONS: SortOptionItem[] = [
  { id: "default", col: "default", dir: "asc", label: { th: "ค่าเริ่มต้น (แนะนำ)", en: "Default (Curated)" } },
  { id: "chapter-asc", col: "chapter", dir: "asc", label: { th: "บท/สัปดาห์: น้อย → มาก", en: "Chapter: Low to High" } },
  { id: "chapter-desc", col: "chapter", dir: "desc", label: { th: "บท/สัปดาห์: มาก → น้อย", en: "Chapter: High to Low" } },
  { id: "name-asc", col: "name", dir: "asc", label: { th: "ชื่อเอกสาร: ก-ฮ / A-Z", en: "Name: A to Z" } },
  { id: "name-desc", col: "name", dir: "desc", label: { th: "ชื่อเอกสาร: ฮ-ก / Z-A", en: "Name: Z to A" } },
  { id: "size-desc", col: "size", dir: "desc", label: { th: "ขนาดไฟล์: ใหญ่ที่สุด", en: "File Size: Largest" } },
  { id: "size-asc", col: "size", dir: "asc", label: { th: "ขนาดไฟล์: เล็กที่สุด", en: "File Size: Smallest" } },
  { id: "category", col: "category", dir: "asc", label: { th: "ตามหมวดหมู่เอกสาร", en: "By Category" } },
];

export function sortGalleryEntries(
  entries: GalleryEntry[],
  sortCol: SortColumn,
  sortDir: SortDirection,
  locale: "th" | "en",
): GalleryEntry[] {
  if (sortCol === "default") return entries;
  const sorted = [...entries];
  sorted.sort((a, b) => {
    if (sortCol === "name") {
      const aTitle = t(a.kind === "single" ? a.asset.title : a.title, locale);
      const bTitle = t(b.kind === "single" ? b.asset.title : b.title, locale);
      const cmp = aTitle.localeCompare(bTitle, locale);
      return sortDir === "asc" ? cmp : -cmp;
    }
    if (sortCol === "category") {
      const aCat = resolveCategory(a.kind === "single" ? a.asset : a.assets[0]);
      const bCat = resolveCategory(b.kind === "single" ? b.asset : b.assets[0]);
      const cmp = aCat.localeCompare(bCat);
      return sortDir === "asc" ? cmp : -cmp;
    }
    if (sortCol === "scope") {
      const aScope = entryScope(a);
      const bScope = entryScope(b);
      const cmp = aScope.localeCompare(bScope);
      return sortDir === "asc" ? cmp : -cmp;
    }
    if (sortCol === "chapter") {
      const aAsset = a.kind === "single" ? a.asset : a.assets[0];
      const bAsset = b.kind === "single" ? b.asset : b.assets[0];
      const aCh = aAsset.chapter ?? (sortDir === "asc" ? 999 : -1);
      const bCh = bAsset.chapter ?? (sortDir === "asc" ? 999 : -1);
      if (aCh !== bCh) return sortDir === "asc" ? aCh - bCh : bCh - aCh;
      const aTitle = t(a.kind === "single" ? a.asset.title : a.title, locale);
      const bTitle = t(b.kind === "single" ? b.asset.title : b.title, locale);
      return aTitle.localeCompare(bTitle, locale);
    }
    if (sortCol === "size") {
      const aBytes =
        a.kind === "single"
          ? (a.asset.sizeBytes ?? 0)
          : a.assets.reduce((sum, item) => sum + (item.sizeBytes ?? 0), 0);
      const bBytes =
        b.kind === "single"
          ? (b.asset.sizeBytes ?? 0)
          : b.assets.reduce((sum, item) => sum + (item.sizeBytes ?? 0), 0);
      return sortDir === "asc" ? aBytes - bBytes : bBytes - aBytes;
    }
    return 0;
  });
  return sorted;
}

export function shortDesc(text: string, maxLen = 42): string {
  if (!text) return "";
  return text.length > maxLen ? `${text.slice(0, maxLen - 1).trimEnd()}…` : text;
}
