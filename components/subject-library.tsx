"use client";

import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";
import Link from "next/link";
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  ArrowUpDown,
  CalendarRange,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Copy,
  Cpu,
  Download,
  Eye,
  FileDown,
  FileText,
  FlaskConical,
  Images,
  Layers,
  LayoutGrid,
  Library,
  Flag,
  Maximize,
  Maximize2,
  Milestone,
  Minimize,
  Minus,
  NotebookPen,
  Pin,
  Plus,
  Rows3,
  RotateCcw,
  ScrollText,
  Search,
  Sigma,
  Sparkles,
  Table2,
  Tag,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLocale, t, type LText } from "@/lib/i18n";
import { assetDownloadUrl } from "@/lib/asset-url";
import { PreviewModal, type Preview } from "@/components/preview-modal";

// Imported from subject-library-ui, not subject-library: the latter pulls in
// library-manifest.json and library-stats.json at module scope, which would
// ship every asset's title and filename — past exams included — to the browser.
import {
  ASSET_GROUPS,
  SCOPE_HEADING,
  SCOPE_LABEL,
  SCOPE_SHORT,
  formatBytes,
  resolveCategory,
  type AssetCategory,
  type AssetFileType,
  type AssetScope,
  type SubjectAsset,
} from "@/lib/subject-library-ui";

interface SubjectLibraryProps {
  assets: SubjectAsset[];
  backHref: string;
  backLabel: LText;
  title: LText;
  subtitle: LText;
  /** Short course code stamped on each cover, e.g. "MFIT". */
  courseCode?: string;
}

type LayoutMode = "gallery" | "table" | "list";
type Filter = AssetCategory | "all";

/**
 * What the grid actually lays out. A run of scanned pages collapses into one
 * stack, so a 26-page notebook costs one card and one thumbnail rather than 26
 * of each.
 */
type GalleryEntry =
  | { kind: "single"; key: string; asset: SubjectAsset }
  | { kind: "stack"; key: string; title: LText; assets: SubjectAsset[] };

/** Which milestone bucket an entry files under; a stack takes its cover's. */
function entryScope(entry: GalleryEntry): ScopeBucket {
  const asset = entry.kind === "single" ? entry.asset : entry.assets[0];
  return asset.scope ?? "term";
}

// ── Category styling ─────────────────────────────────────────────────────────
// Six shelves, one hue. The ladder (--shelf-1 … --shelf-6, defined by the
// .brand-shelf class in globals.css) walks the iHelp blue from its deepest
// weight down to a pale wash, ordered by how primary the material is: lecture
// decks at the top, lookup tables at the bottom. The icon is what names a
// shelf; the shade only gives the grid its rhythm.
//
// Pill text stays on `primary` at every step — the pale rungs are fill colours,
// not type colours, and would drop below contrast if used for both.
interface CategoryStyle {
  label: LText;
  icon: typeof FileText;
  /**
   * Rung on the ladder, applied to the card root. Everything inside then reads
   * `--shelf` through `.shelf-accent` / `.shelf-wash` / `.shelf-pill` /
   * `.shelf-glyph`, so a card is coloured by one class instead of four.
   */
  shelf: string;
}

const CATEGORY: Record<AssetCategory, CategoryStyle> = {
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

/**
 * Where the scope control can sit. "term" is the bucket for material that is
 * not tied to either half — a lookup table, a course plan — which is shown
 * under both milestones rather than hidden by either.
 */
type ScopeFilter = AssetScope | "all";
type ScopeBucket = AssetScope | "term";

const SCOPE_ICON: Record<ScopeBucket, typeof Milestone> = {
  midterm: Milestone,
  final: Flag,
  term: CalendarRange,
};

// Scope is a second axis on top of the category colours, so it stays on one
// hue — the KMITL brand blue — and separates the two milestones by volume
// instead: midterm is the full-strength fill, final the same blue held back to
// a wash. Driven off the `primary` token rather than a literal #2357A5 so the
// badges follow the per-course colour the hub layout sets, and so they relight
// correctly in dark mode (#5c9bf5).
//
// Kept in step with the same map in components/subject-track-grid.tsx.
const SCOPE_BADGE: Record<AssetScope, string> = {
  midterm: "border-transparent bg-primary text-primary-foreground shadow-xs",
  final: "border-primary/30 bg-primary/10 text-primary",
};

// Over a photo scrim the 10% wash disappears and dark blue text stops reading,
// so both variants gain body: the fill stays solid, the wash thickens behind a
// blur and switches to white type.
const SCOPE_BADGE_ON_MEDIA: Record<AssetScope, string> = {
  midterm: "border-transparent bg-primary text-primary-foreground shadow-sm",
  final: "border-primary/60 bg-primary/25 text-white backdrop-blur-md",
};

const FILE_TYPE_LABEL: Record<AssetFileType, string> = {
  pdf: "PDF",
  image: "IMG",
  md: "MD",
  file: "FILE",
};

const L = {
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
function metaLine(asset: SubjectAsset, locale: "th" | "en"): string {
  const parts: string[] = [];
  if (asset.pages) parts.push(`${asset.pages} ${t(L.pages, locale)}`);
  if (asset.sizeBytes) parts.push(formatBytes(asset.sizeBytes));
  return parts.join(" · ");
}

/**
 * The badge every card and the modal header carry. `onMedia` switches to the
 * heavier variant for the two places it sits over a photograph.
 */
function ScopeBadge({
  scope,
  onMedia = false,
  className = "",
}: {
  scope: AssetScope;
  onMedia?: boolean;
  className?: string;
}) {
  const { locale } = useLocale();
  const Icon = SCOPE_ICON[scope];
  const tone = (onMedia ? SCOPE_BADGE_ON_MEDIA : SCOPE_BADGE)[scope];
  return (
    <span
      className={`inline-flex items-center gap-0.5 rounded-full border px-1.5 py-0.5 text-[9px] font-semibold ${tone} ${className}`}
    >
      <Icon className="size-2.5" />
      {t(SCOPE_SHORT[scope], locale)}
    </span>
  );
}

/** Badges indicating current academic year (2569) or duplicate/variant status. */
function StatusBadges({
  asset,
  className = "",
}: {
  asset: SubjectAsset;
  className?: string;
}) {
  const { locale } = useLocale();
  return (
    <>
      {asset.isCurrentYear && (
        <span
          className={`inline-flex items-center gap-0.5 rounded-full border border-emerald-500/35 bg-emerald-500/15 px-1.5 py-0.5 text-[9px] font-bold text-emerald-700 dark:text-emerald-300 shadow-2xs ${className}`}
          title={locale === "th" ? "เนื้อหาประจำปีการศึกษา 2569 ล่าสุด" : "Current AY 2569 Curriculum"}
        >
          <Sparkles className="size-2.5" />
          <span>2569</span>
        </span>
      )}
      {asset.isDuplicate && (
        <span
          className={`inline-flex items-center gap-0.5 rounded-full border border-amber-500/35 bg-amber-500/15 px-1.5 py-0.5 text-[9px] font-medium text-amber-700 dark:text-amber-300 shadow-2xs ${className}`}
          title={asset.duplicateOf ? `ฉบับสำรองของ ${asset.duplicateOf}` : undefined}
        >
          <Copy className="size-2.5" />
          <span>{locale === "th" ? "สำรอง" : "Alt"}</span>
        </span>
      )}
      {!asset.isDuplicate && asset.edition && asset.edition !== "2569" && (
        <span
          className={`inline-flex items-center gap-0.5 rounded-full border border-border/80 bg-muted/60 px-1.5 py-0.5 text-[9px] font-medium text-muted-foreground ${className}`}
        >
          {asset.edition}
        </span>
      )}
    </>
  );
}

/**
 * The tag that names where in the course an asset sits. Tags are a flat list,
 * so pick the first one shaped like a chapter or week reference and fall back
 * to the leading tag when nothing matches.
 */
const CHAPTER_TAG = /^(ch\.|บทที่|week|unit|lecture\s|สัปดาห์)/i;

function chapterTag(asset: SubjectAsset): string | undefined {
  return asset.tags.find((tag) => CHAPTER_TAG.test(tag)) ?? asset.tags[0];
}

/**
 * Cards below the fold cost nothing to lay out until they scroll near the
 * viewport. The reserved height keeps the scrollbar honest in the meantime.
 */
const DEFERRED: CSSProperties = {
  contentVisibility: "auto",
  containIntrinsicSize: "auto 260px",
};



// ── Gallery cards ────────────────────────────────────────────────────────────

/**
 * A document rendered as a book on a shelf: a coloured spine down the binding
 * edge, a ruled cover face carrying the course badge and title, and the page
 * count and file size printed along the bottom the way a jacket does.
 */
function BookCover({
  asset,
  courseCode,
  onOpen,
}: {
  asset: SubjectAsset;
  courseCode?: string;
  onOpen: (asset: SubjectAsset) => void;
}) {
  const { locale } = useLocale();
  const category = resolveCategory(asset);
  const style = CATEGORY[category];
  const Icon = style.icon;
  const code = asset.courseCode ?? courseCode;
  const meta = metaLine(asset, locale);

  return (
    <article className={`group relative flex flex-col ${style.shelf}`} style={DEFERRED}>
      <button
        type="button"
        onClick={() => onOpen(asset)}
        aria-label={`${t(L.preview, locale)}: ${t(asset.title, locale)}`}
        className="relative block w-full overflow-hidden rounded-r-xl rounded-l-md border bg-card text-left shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-xl focus-visible:-translate-y-1 focus-visible:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
      >
        {/* Binding: a solid spine down the left edge, with the top edge picked
            out so a stack of covers reads as a shelf rather than a grid. */}
        <span aria-hidden className="shelf-accent absolute inset-y-0 left-0 w-2.5" />
        <span aria-hidden className="absolute inset-y-0 left-2.5 w-px bg-black/10 dark:bg-white/10" />
        <span aria-hidden className="shelf-accent absolute inset-x-0 top-0 h-1 opacity-70" />

        {/* Cover face */}
        <div className="shelf-wash flex aspect-[3/4] flex-col pl-6 pr-4 pt-4 pb-3">
          <div className="flex items-start justify-between gap-2">
            {code && (
              <span className="rounded-md border border-foreground/15 bg-background/70 px-1.5 py-0.5 text-[10px] font-bold tracking-wide">
                {code}
              </span>
            )}
            <span className="rounded-md bg-foreground/8 px-1.5 py-0.5 font-mono text-[9px] font-semibold tracking-wider text-muted-foreground">
              {FILE_TYPE_LABEL[asset.fileType]}
            </span>
          </div>

          <Icon className="shelf-glyph mt-4 size-6 shrink-0" strokeWidth={1.5} />

          <h3 className="mt-2 line-clamp-4 text-[13px] font-semibold leading-snug text-foreground">
            {t(asset.title, locale)}
          </h3>

          <div className="mt-auto space-y-1.5 pt-3">
            <div className="flex flex-wrap items-center gap-1">
              <span className="shelf-pill inline-flex items-center rounded-full border px-1.5 py-0.5 text-[9px] font-semibold text-primary">
                {t(style.label, locale)}
              </span>
              {asset.scope && <ScopeBadge scope={asset.scope} />}
              <StatusBadges asset={asset} />
            </div>
            {meta && (
              <p className="text-[10px] font-medium tabular-nums text-muted-foreground">{meta}</p>
            )}
          </div>
        </div>

        {/* Hover affordance: the cover lifts to show what clicking will do. */}
        <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-foreground/60 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100">
          <span className="flex items-center gap-1.5 rounded-full bg-background px-3 py-1.5 text-xs font-semibold shadow-lg">
            <Eye className="size-3.5" />
            {t(L.preview, locale)}
          </span>
        </span>
      </button>

      <CardActions asset={asset} onOpen={onOpen} />
    </article>
  );
}

/** A standalone note scan: the image itself is the card. */
function ImageTile({
  asset,
  courseCode,
  onOpen,
}: {
  asset: SubjectAsset;
  courseCode?: string;
  onOpen: (asset: SubjectAsset) => void;
}) {
  const { locale } = useLocale();
  const style = CATEGORY[resolveCategory(asset)];
  const code = asset.courseCode ?? courseCode;
  const meta = metaLine(asset, locale);

  return (
    <article className={`group relative flex flex-col ${style.shelf}`} style={DEFERRED}>
      <button
        type="button"
        onClick={() => onOpen(asset)}
        aria-label={`${t(L.preview, locale)}: ${t(asset.title, locale)}`}
        className="relative block w-full overflow-hidden rounded-xl border bg-card shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-xl focus-visible:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
      >
        <div className="aspect-[4/3] overflow-hidden bg-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={asset.url}
            alt={t(asset.title, locale)}
            loading="lazy"
            decoding="async"
            className="size-full object-cover contrast-[1.08] saturate-[0.9] transition-transform duration-300 group-hover:scale-110"
          />
        </div>

        {/* Scrim keeps the overlaid text readable over pale paper scans. */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 via-black/35 to-transparent"
        />

        {code && (
          <span className="absolute left-2 top-2 rounded-md bg-black/60 px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-white backdrop-blur-sm">
            {code}
          </span>
        )}

        <div className="absolute inset-x-0 bottom-0 space-y-1 p-2.5 text-left">
          <h3 className="line-clamp-2 text-xs font-semibold leading-snug text-white">
            {t(asset.title, locale)}
          </h3>
          <div className="flex flex-wrap items-center gap-1">
            <span className="shelf-pill inline-flex items-center rounded-full border px-1.5 py-0.5 text-[9px] font-semibold text-primary">
              {t(style.label, locale)}
            </span>
            {asset.scope && <ScopeBadge scope={asset.scope} onMedia />}
            {asset.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-white/20 px-1.5 py-0.5 text-[9px] font-medium text-white backdrop-blur-sm"
              >
                {tag}
              </span>
            ))}
            {meta && <span className="text-[9px] tabular-nums text-white/70">{meta}</span>}
          </div>
        </div>
      </button>

      <CardActions asset={asset} onOpen={onOpen} />
    </article>
  );
}

/**
 * A run of scanned pages, drawn as a physical stack: two offset sheets behind
 * the top one. Only the cover image is fetched until the stack is opened, so a
 * 26-page notebook costs one request instead of 26.
 */
function PhotoStack({
  title,
  assets,
  courseCode,
  expanded,
  onToggle,
  onOpen,
}: {
  title: LText;
  assets: SubjectAsset[];
  courseCode?: string;
  expanded: boolean;
  onToggle: () => void;
  onOpen: (index: number) => void;
}) {
  const { locale } = useLocale();
  const cover = assets[0];
  const style = CATEGORY[resolveCategory(cover)];
  const code = cover.courseCode ?? courseCode;
  const bytes = assets.reduce((sum, a) => sum + (a.sizeBytes ?? 0), 0);

  return (
    <article className={`group relative flex flex-col ${style.shelf}`} style={DEFERRED}>
      {/* The sheets underneath. Purely decorative, hence the padding above. */}
      <div className="relative pt-2">
        <span
          aria-hidden
          className="absolute inset-x-3 top-0 h-4 rounded-t-lg border border-b-0 bg-card/60"
        />
        <span
          aria-hidden
          className="absolute inset-x-1.5 top-1 h-4 rounded-t-lg border border-b-0 bg-card/80"
        />

        <button
          type="button"
          onClick={() => onOpen(0)}
          aria-label={`${t(L.preview, locale)}: ${t(title, locale)}`}
          className="relative block w-full overflow-hidden rounded-xl border bg-card shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-xl focus-visible:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        >
          <div className="aspect-[4/3] overflow-hidden bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={cover.url}
              alt={t(title, locale)}
              loading="lazy"
              decoding="async"
              className="size-full object-cover contrast-[1.08] saturate-[0.9] transition-transform duration-300 group-hover:scale-105"
            />
          </div>

          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/85 via-black/40 to-transparent"
          />

          <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-black/65 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm">
            <Images className="size-3" />
            {assets.length}
          </span>
          {code && (
            <span className="absolute left-2 top-2 rounded-md bg-black/60 px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-white backdrop-blur-sm">
              {code}
            </span>
          )}

          <div className="absolute inset-x-0 bottom-0 space-y-1 p-2.5 text-left">
            <h3 className="line-clamp-2 text-xs font-semibold leading-snug text-white">
              {t(title, locale)}
            </h3>
            <div className="flex flex-wrap items-center gap-1">
              <span className="shelf-pill inline-flex items-center rounded-full border px-1.5 py-0.5 text-[9px] font-semibold text-primary">
                {t(style.label, locale)}
              </span>
              {cover.scope && <ScopeBadge scope={cover.scope} onMedia />}
              <span className="text-[9px] tabular-nums text-white/75">
                {assets.length} {t(L.images, locale)}
                {bytes > 0 && ` · ${formatBytes(bytes)}`}
              </span>
            </div>
          </div>
        </button>
      </div>

      <button
        type="button"
        onClick={onToggle}
        aria-expanded={expanded}
        className="mt-1.5 inline-flex items-center justify-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
      >
        <Images className="size-3" />
        {t(expanded ? L.collapse : L.expand, locale)}
      </button>
    </article>
  );
}

/**
 * The opened stack: every page as a small thumbnail. Spans the whole grid row
 * so it reads as one contact sheet rather than more loose cards.
 */
function StackSheet({
  title,
  assets,
  onOpen,
  onCollapse,
}: {
  title: LText;
  assets: SubjectAsset[];
  onOpen: (index: number) => void;
  onCollapse: () => void;
}) {
  const { locale } = useLocale();

  return (
    <section
      className="rounded-2xl border bg-muted/25 p-3"
      style={{ gridColumn: "1 / -1" }}
    >
      <header className="mb-2.5 flex items-center justify-between gap-3">
        <h3 className="truncate text-xs font-semibold">
          {t(title, locale)}{" "}
          <span className="font-normal text-muted-foreground">
            · {assets.length} {t(L.images, locale)}
          </span>
        </h3>
        <button
          type="button"
          onClick={onCollapse}
          className="shrink-0 rounded-full border bg-card px-2.5 py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
        >
          {t(L.collapse, locale)}
        </button>
      </header>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(5.5rem,1fr))] gap-2">
        {assets.map((asset, index) => (
          <button
            key={asset.id}
            type="button"
            onClick={() => onOpen(index)}
            aria-label={`${t(L.preview, locale)}: ${t(asset.title, locale)}`}
            className="group/thumb relative overflow-hidden rounded-lg border bg-white shadow-xs transition-all hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            <div className="aspect-[3/4] overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={asset.url}
                alt={t(asset.title, locale)}
                loading="lazy"
                decoding="async"
                className="size-full object-cover contrast-[1.08] transition-transform duration-200 group-hover/thumb:scale-110"
              />
            </div>
            <span className="absolute inset-x-0 bottom-0 bg-black/65 py-0.5 text-center text-[9px] font-semibold tabular-nums text-white backdrop-blur-sm">
              {t(L.page, locale)} {index + 1}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}

/**
 * The row under every gallery card. The primary action opens the in-app modal
 * rather than a new tab — leaving the page loses the filters and the scroll
 * position the student just set up. Download stays one click away beside it.
 */
function CardActions({
  asset,
  onOpen,
}: {
  asset: SubjectAsset;
  onOpen: (asset: SubjectAsset) => void;
}) {
  const { locale } = useLocale();

  if (asset.fileType === "md") {
    return (
      <Link
        href={asset.url}
        className="mt-1.5 inline-flex items-center justify-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
      >
        <Eye className="size-3" />
        {t(L.viewContent, locale)}
      </Link>
    );
  }

  return (
    <div className="mt-1.5 flex gap-1.5">
      <button
        type="button"
        onClick={() => onOpen(asset)}
        className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border px-2 py-1.5 text-[11px] font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
      >
        <Eye className="size-3" />
        {t(L.preview, locale)}
      </button>
      <a
        href={assetDownloadUrl(asset.url, asset.fileName)}
        download={asset.fileName}
        aria-label={`${t(L.download, locale)}: ${asset.fileName}`}
        className="inline-flex items-center justify-center rounded-full border px-2.5 py-1.5 text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
      >
        <Download className="size-3" />
      </a>
    </div>
  );
}

/** One row of the compact list — same actions, one line, scannable by name. */
function CompactRow({
  asset,
  courseCode,
  onOpen,
}: {
  asset: SubjectAsset;
  courseCode?: string;
  onOpen: (asset: SubjectAsset) => void;
}) {
  const { locale } = useLocale();
  const style = CATEGORY[resolveCategory(asset)];
  const Icon = style.icon;
  const code = asset.courseCode ?? courseCode;
  const meta = metaLine(asset, locale);

  return (
    <div
      className={`${style.shelf} flex items-center gap-3 border-b px-3 py-2.5 transition-colors last:border-b-0 hover:bg-muted/40`}
    >
      <span aria-hidden className="shelf-accent h-8 w-1 shrink-0 rounded-full" />

      <button
        type="button"
        onClick={() => onOpen(asset)}
        className="flex min-w-0 flex-1 items-center gap-2.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
      >
        <Icon className="size-4 shrink-0 text-muted-foreground" />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[13px] font-medium">{t(asset.title, locale)}</span>
          <span className="block truncate text-[11px] text-muted-foreground">
            {[code, t(style.label, locale), meta].filter(Boolean).join(" · ")}
          </span>
        </span>
      </button>

      {asset.scope && <ScopeBadge scope={asset.scope} className="shrink-0" />}
      <StatusBadges asset={asset} className="shrink-0" />

      <div className="hidden shrink-0 gap-1 md:flex">
        {asset.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="rounded-full border px-1.5 py-0.5 text-[10px] text-muted-foreground"
          >
            {tag}
          </span>
        ))}
      </div>

      {asset.fileType === "md" ? (
        <Link
          href={asset.url}
          aria-label={t(L.viewContent, locale)}
          className="shrink-0 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-primary"
        >
          <Eye className="size-3.5" />
        </Link>
      ) : (
        <a
          href={assetDownloadUrl(asset.url, asset.fileName)}
          download={asset.fileName}
          aria-label={`${t(L.download, locale)}: ${asset.fileName}`}
          className="shrink-0 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-primary"
        >
          <Download className="size-3.5" />
        </a>
      )}
    </div>
  );
}

/** A scan set in compact list mode: one row for the whole run. */
function CompactStackRow({
  title,
  assets,
  courseCode,
  onOpen,
}: {
  title: LText;
  assets: SubjectAsset[];
  courseCode?: string;
  onOpen: (index: number) => void;
}) {
  const { locale } = useLocale();
  const style = CATEGORY[resolveCategory(assets[0])];
  const code = assets[0].courseCode ?? courseCode;
  const bytes = assets.reduce((sum, a) => sum + (a.sizeBytes ?? 0), 0);

  return (
    <div
      className={`${style.shelf} flex items-center gap-3 border-b px-3 py-2.5 transition-colors last:border-b-0 hover:bg-muted/40`}
    >
      <span aria-hidden className="shelf-accent h-8 w-1 shrink-0 rounded-full" />
      <button
        type="button"
        onClick={() => onOpen(0)}
        className="flex min-w-0 flex-1 items-center gap-2.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
      >
        <Images className="size-4 shrink-0 text-muted-foreground" />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[13px] font-medium">{t(title, locale)}</span>
          <span className="block truncate text-[11px] text-muted-foreground">
            {[
              code,
              t(style.label, locale),
              `${assets.length} ${t(L.images, locale)}`,
              bytes > 0 ? formatBytes(bytes) : "",
            ]
              .filter(Boolean)
              .join(" · ")}
          </span>
        </span>
      </button>
      {assets[0].scope && <ScopeBadge scope={assets[0].scope} className="shrink-0" />}
    </div>
  );
}

// ── Global Sorting & Table View ──────────────────────────────────────────────

export type SortColumn = "default" | "chapter" | "name" | "size" | "category" | "scope";
export type SortDirection = "asc" | "desc";

interface SortOptionItem {
  id: string;
  col: SortColumn;
  dir: SortDirection;
  label: LText;
}

const SORT_OPTIONS: SortOptionItem[] = [
  { id: "default", col: "default", dir: "asc", label: { th: "ค่าเริ่มต้น (แนะนำ)", en: "Default (Curated)" } },
  { id: "chapter-asc", col: "chapter", dir: "asc", label: { th: "บท/สัปดาห์: น้อย → มาก", en: "Chapter: Low to High" } },
  { id: "chapter-desc", col: "chapter", dir: "desc", label: { th: "บท/สัปดาห์: มาก → น้อย", en: "Chapter: High to Low" } },
  { id: "name-asc", col: "name", dir: "asc", label: { th: "ชื่อเอกสาร: ก-ฮ / A-Z", en: "Name: A to Z" } },
  { id: "name-desc", col: "name", dir: "desc", label: { th: "ชื่อเอกสาร: ฮ-ก / Z-A", en: "Name: Z to A" } },
  { id: "size-desc", col: "size", dir: "desc", label: { th: "ขนาดไฟล์: ใหญ่ที่สุด", en: "File Size: Largest" } },
  { id: "size-asc", col: "size", dir: "asc", label: { th: "ขนาดไฟล์: เล็กที่สุด", en: "File Size: Smallest" } },
  { id: "category", col: "category", dir: "asc", label: { th: "ตามหมวดหมู่เอกสาร", en: "By Category" } },
];

function sortGalleryEntries(
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

function shortDesc(text: string, maxLen = 42): string {
  if (!text) return "";
  return text.length > maxLen ? `${text.slice(0, maxLen - 1).trimEnd()}…` : text;
}

function SubjectLibraryTable({
  entries,
  courseCode,
  sortCol = "default",
  sortDir = "asc",
  onSort,
  onOpenSingle,
  onOpenStack,
}: {
  entries: GalleryEntry[];
  courseCode?: string;
  sortCol?: SortColumn;
  sortDir?: SortDirection;
  onSort?: (col: SortColumn) => void;
  onOpenSingle: (asset: SubjectAsset) => void;
  onOpenStack: (assets: SubjectAsset[], index: number) => void;
}) {
  const { locale } = useLocale();
  const [openStacks, setOpenStacks] = useState<ReadonlySet<string>>(new Set());
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const toggleStack = (key: string) => {
    setOpenStacks((prev) => {
      const next = new Set(prev);
      if (!next.delete(key)) next.add(key);
      return next;
    });
  };

  const copyUrl = (id: string, path: string) => {
    const url = typeof window !== "undefined" ? `${window.location.origin}${path}` : path;
    void navigator.clipboard.writeText(url).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const handleSort = (col: SortColumn) => {
    if (onSort) onSort(col);
  };

  const sortedEntries = entries;

  return (
    <div className="overflow-hidden rounded-2xl border bg-card shadow-xs">
      <div className="overflow-x-auto [scrollbar-width:thin]">
        <table className="w-full min-w-[620px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b bg-muted/40 text-xs font-semibold text-muted-foreground select-none">
              <th
                scope="col"
                className="py-3 pl-4 pr-3 cursor-pointer transition-colors hover:text-foreground"
                onClick={() => handleSort("name")}
              >
                <div className="inline-flex items-center gap-1.5">
                  <span>{t(L.colName, locale)}</span>
                  {sortCol === "name" ? (
                    sortDir === "asc" ? (
                      <ArrowUp className="size-3.5 text-primary" />
                    ) : (
                      <ArrowDown className="size-3.5 text-primary" />
                    )
                  ) : (
                    <ArrowUpDown className="size-3 opacity-30" />
                  )}
                </div>
              </th>
              <th
                scope="col"
                className="py-3 px-3 whitespace-nowrap cursor-pointer transition-colors hover:text-foreground"
                onClick={() => handleSort("category")}
              >
                <div className="inline-flex items-center gap-1.5">
                  <span>{t(L.colCategory, locale)}</span>
                  {sortCol === "category" ? (
                    sortDir === "asc" ? (
                      <ArrowUp className="size-3.5 text-primary" />
                    ) : (
                      <ArrowDown className="size-3.5 text-primary" />
                    )
                  ) : (
                    <ArrowUpDown className="size-3 opacity-30" />
                  )}
                </div>
              </th>
              <th
                scope="col"
                className="py-3 px-3 whitespace-nowrap cursor-pointer transition-colors hover:text-foreground"
                onClick={() => handleSort("scope")}
              >
                <div className="inline-flex items-center gap-1.5">
                  <span>{t(L.colScope, locale)}</span>
                  {sortCol === "scope" ? (
                    sortDir === "asc" ? (
                      <ArrowUp className="size-3.5 text-primary" />
                    ) : (
                      <ArrowDown className="size-3.5 text-primary" />
                    )
                  ) : (
                    <ArrowUpDown className="size-3 opacity-30" />
                  )}
                </div>
              </th>
              <th
                scope="col"
                className="py-3 px-3 whitespace-nowrap cursor-pointer transition-colors hover:text-foreground"
                onClick={() => handleSort("chapter")}
              >
                <div className="inline-flex items-center gap-1.5">
                  <span>{t(L.colChapter, locale)}</span>
                  {sortCol === "chapter" ? (
                    sortDir === "asc" ? (
                      <ArrowUp className="size-3.5 text-primary" />
                    ) : (
                      <ArrowDown className="size-3.5 text-primary" />
                    )
                  ) : (
                    <ArrowUpDown className="size-3 opacity-30" />
                  )}
                </div>
              </th>
              <th
                scope="col"
                className="py-3 px-3 whitespace-nowrap cursor-pointer transition-colors hover:text-foreground"
                onClick={() => handleSort("size")}
              >
                <div className="inline-flex items-center gap-1.5">
                  <span>{t(L.colSize, locale)}</span>
                  {sortCol === "size" ? (
                    sortDir === "asc" ? (
                      <ArrowUp className="size-3.5 text-primary" />
                    ) : (
                      <ArrowDown className="size-3.5 text-primary" />
                    )
                  ) : (
                    <ArrowUpDown className="size-3 opacity-30" />
                  )}
                </div>
              </th>
              <th
                scope="col"
                className="sticky right-0 z-10 w-28 whitespace-nowrap bg-muted/95 backdrop-blur-xs py-3 pl-2 pr-4 text-right shadow-[-6px_0_10px_-4px_rgba(0,0,0,0.06)]"
              >
                <span>{t(L.colActions, locale)}</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {sortedEntries.map((entry, idx) => {
              const itemKey =
                entry.kind === "single"
                  ? `${entry.key}-${entry.asset.url || idx}`
                  : entry.key;

              if (entry.kind === "stack") {
                const isExpanded = openStacks.has(entry.key);
                const firstAsset = entry.assets[0];
                const cat = resolveCategory(firstAsset);
                const style = CATEGORY[cat];
                const totalBytes = entry.assets.reduce(
                  (sum, a) => sum + (a.sizeBytes ?? 0),
                  0,
                );
                const isCopied = copiedId === entry.key;

                return (
                  <Fragment key={itemKey}>
                    <tr
                      className={`${style.shelf} group transition-colors hover:bg-muted/35`}
                    >
                      <td className="py-2.5 pl-4 pr-3 max-w-[220px] sm:max-w-[280px] md:max-w-[360px]">
                        <div className="flex items-center gap-2.5">
                          <button
                            type="button"
                            onClick={() => toggleStack(entry.key)}
                            aria-label={
                              isExpanded
                                ? t(L.collapseStack, locale)
                                : t(L.expandStack, locale)
                            }
                            className="flex size-6 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                          >
                            <ChevronRight
                              className={`size-3.5 transition-transform duration-200 ${
                                isExpanded ? "rotate-90" : ""
                              }`}
                            />
                          </button>
                          <span
                            aria-hidden
                            className="shelf-accent h-7 w-1 shrink-0 rounded-full"
                          />
                          <button
                            type="button"
                            onClick={() => onOpenStack(entry.assets, 0)}
                            className="flex min-w-0 flex-1 items-center gap-2 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                          >
                            <Images className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
                            <div className="min-w-0 flex-1">
                              <span className="block truncate text-sm font-medium text-foreground transition-colors group-hover:text-primary">
                                {t(entry.title, locale)}
                              </span>
                              <span className="block truncate text-[11px] text-muted-foreground">
                                {entry.assets.length} {t(L.images, locale)}
                              </span>
                            </div>
                          </button>
                        </div>
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <span
                          className={`${style.shelf} shelf-pill inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium text-primary`}
                        >
                          <Images className="size-3" />
                          {t(style.label, locale)}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        {firstAsset.scope ? (
                          <ScopeBadge scope={firstAsset.scope} />
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        {firstAsset.chapter !== undefined ? (
                          <span className="inline-flex items-center rounded-md border bg-muted/40 px-2 py-0.5 text-xs font-medium tabular-nums">
                            {chapterTag(firstAsset) ?? `Ch. ${firstAsset.chapter}`}
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 tabular-nums text-xs text-muted-foreground whitespace-nowrap">
                        {[
                          `${entry.assets.length} ${t(L.images, locale)}`,
                          totalBytes > 0 ? formatBytes(totalBytes) : "",
                        ]
                          .filter(Boolean)
                          .join(" · ")}
                      </td>
                      <td className="sticky right-0 z-10 w-28 whitespace-nowrap bg-card/95 backdrop-blur-xs py-2.5 pl-2 pr-4 text-right shadow-[-6px_0_10px_-4px_rgba(0,0,0,0.06)]">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => onOpenStack(entry.assets, 0)}
                            aria-label={t(L.preview, locale)}
                            className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-primary"
                          >
                            <Eye className="size-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => copyUrl(entry.key, firstAsset.url)}
                            aria-label={t(L.copyLink, locale)}
                            title={
                              isCopied
                                ? t(L.linkCopied, locale)
                                : t(L.copyLink, locale)
                            }
                            className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-primary"
                          >
                            {isCopied ? (
                              <Check className="size-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="size-3.5" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                    {isExpanded &&
                      entry.assets.map((asset, pageIdx) => {
                        const pageCopied = copiedId === asset.id;
                        return (
                          <tr
                            key={`${entry.key}-p-${asset.id || pageIdx}`}
                            className="bg-muted/15 text-xs text-muted-foreground transition-colors hover:bg-muted/30"
                          >
                            <td className="py-2 pl-12 pr-3 max-w-[220px] sm:max-w-[280px] md:max-w-[360px]">
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-[11px] text-muted-foreground/70">
                                  #{pageIdx + 1}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => onOpenStack(entry.assets, pageIdx)}
                                  className="truncate text-left font-medium text-foreground transition-colors hover:text-primary"
                                >
                                  {t(asset.title, locale) ||
                                    `${t(L.page, locale)} ${pageIdx + 1}`}
                                </button>
                              </div>
                            </td>
                            <td className="py-2 px-3 whitespace-nowrap">
                              <span className="text-[11px] text-muted-foreground">
                                {FILE_TYPE_LABEL[asset.fileType]}
                              </span>
                            </td>
                            <td className="py-2 px-3 whitespace-nowrap">—</td>
                            <td className="py-2 px-3 whitespace-nowrap">
                              {asset.chapter !== undefined ? (
                                <span className="tabular-nums">
                                  Ch. {asset.chapter}
                                </span>
                              ) : (
                                "—"
                              )}
                            </td>
                            <td className="py-2 px-3 tabular-nums whitespace-nowrap">
                              {asset.sizeBytes
                                ? formatBytes(asset.sizeBytes)
                                : "—"}
                            </td>
                            <td className="sticky right-0 z-10 w-28 whitespace-nowrap bg-muted/20 backdrop-blur-xs py-2 pl-2 pr-4 text-right shadow-[-6px_0_10px_-4px_rgba(0,0,0,0.06)]">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  type="button"
                                  onClick={() =>
                                    onOpenStack(entry.assets, pageIdx)
                                  }
                                  aria-label={t(L.preview, locale)}
                                  className="rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-primary"
                                >
                                  <Eye className="size-3" />
                                </button>
                                <a
                                  href={assetDownloadUrl(
                                    asset.url,
                                    asset.fileName,
                                  )}
                                  download={asset.fileName}
                                  aria-label={`${t(L.download, locale)}: ${asset.fileName}`}
                                  className="rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-primary"
                                >
                                  <Download className="size-3" />
                                </a>
                                <button
                                  type="button"
                                  onClick={() => copyUrl(asset.id, asset.url)}
                                  aria-label={t(L.copyLink, locale)}
                                  className="rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-primary"
                                >
                                  {pageCopied ? (
                                    <Check className="size-3 text-emerald-600" />
                                  ) : (
                                    <Copy className="size-3" />
                                  )}
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                  </Fragment>
                );
              }

              const asset = entry.asset;
              const cat = resolveCategory(asset);
              const style = CATEGORY[cat];
              const Icon = style.icon;
              const meta = metaLine(asset, locale);
              const isCopied = copiedId === asset.id;
              const code = asset.courseCode ?? courseCode;
              const desc = asset.description ? shortDesc(t(asset.description, locale), 42) : "";

              return (
                <tr
                  key={itemKey}
                  className={`${style.shelf} group transition-colors hover:bg-muted/35`}
                >
                  <td className="py-2.5 pl-4 pr-3 max-w-[220px] sm:max-w-[280px] md:max-w-[360px]">
                    <div className="flex items-center gap-2.5">
                      <span
                        aria-hidden
                        className="shelf-accent h-7 w-1 shrink-0 rounded-full"
                      />
                      {asset.fileType === "md" ? (
                        <Link
                          href={asset.url}
                          className="flex min-w-0 flex-1 items-center gap-2 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                        >
                          <Icon className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
                          <div className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-medium text-foreground transition-colors group-hover:text-primary">
                              {t(asset.title, locale)}
                            </span>
                            <span className="block truncate text-[11px] text-muted-foreground">
                              {[code, desc]
                                .filter(Boolean)
                                .join(" · ")}
                            </span>
                          </div>
                        </Link>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onOpenSingle(asset)}
                          className="flex min-w-0 flex-1 items-center gap-2 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                        >
                          <Icon className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
                          <div className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-medium text-foreground transition-colors group-hover:text-primary">
                              {t(asset.title, locale)}
                            </span>
                            <span className="block truncate text-[11px] text-muted-foreground">
                              {[code, desc]
                                .filter(Boolean)
                                .join(" · ")}
                            </span>
                          </div>
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    <span
                      className={`${style.shelf} shelf-pill inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium text-primary`}
                    >
                      <Icon className="size-3" />
                      {t(style.label, locale)}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      {asset.scope ? (
                        <ScopeBadge scope={asset.scope} />
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                      <StatusBadges asset={asset} />
                    </div>
                  </td>
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    {chapterTag(asset) ? (
                      <span className="inline-flex items-center rounded-md border bg-muted/40 px-2 py-0.5 text-xs font-medium tabular-nums">
                        {chapterTag(asset)}
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 tabular-nums text-xs text-muted-foreground whitespace-nowrap">
                    {meta || "—"}
                  </td>
                  <td className="sticky right-0 z-10 w-28 whitespace-nowrap bg-card/95 backdrop-blur-xs py-2.5 pl-2 pr-4 text-right shadow-[-6px_0_10px_-4px_rgba(0,0,0,0.06)]">
                    <div className="flex items-center justify-end gap-1">
                      {asset.fileType === "md" ? (
                        <Link
                          href={asset.url}
                          aria-label={t(L.viewContent, locale)}
                          className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-primary"
                        >
                          <Eye className="size-3.5" />
                        </Link>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onOpenSingle(asset)}
                          aria-label={t(L.preview, locale)}
                          className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-primary"
                        >
                          <Eye className="size-3.5" />
                        </button>
                      )}
                      {asset.fileType !== "md" && (
                        <a
                          href={assetDownloadUrl(asset.url, asset.fileName)}
                          download={asset.fileName}
                          aria-label={`${t(L.download, locale)}: ${asset.fileName}`}
                          className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-primary"
                        >
                          <Download className="size-3.5" />
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={() => copyUrl(asset.id, asset.url)}
                        aria-label={t(L.copyLink, locale)}
                        title={
                          isCopied
                            ? t(L.linkCopied, locale)
                            : t(L.copyLink, locale)
                        }
                        className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-primary"
                      >
                        {isCopied ? (
                          <Check className="size-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="size-3.5" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Pinned Weekly Courseware Shelf ──────────────────────────────────────────

const PINNED_ACTIONS_CELL =
  "sticky right-0 z-10 w-24 whitespace-nowrap bg-card/95 backdrop-blur-xs pl-2 pr-4 text-right shadow-[-6px_0_10px_-4px_rgba(0,0,0,0.06)]";

const PINNED_KIND = {
  lecture: {
    icon: ScrollText,
    label: { th: "สไลด์บรรยาย", en: "Lecture" } satisfies LText,
    accent: "bg-primary/60",
    text: "text-primary",
    pill: "border-primary/30 bg-primary/10 text-primary",
  },
  lab: {
    icon: FlaskConical,
    label: { th: "ใบงานแล็บ", en: "Lab sheet" } satisfies LText,
    accent: "bg-emerald-500/60",
    text: "text-emerald-600 dark:text-emerald-400",
    pill: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  },
} as const;

type PinnedKind = keyof typeof PINNED_KIND;

/** One asset line inside a week group — mirrors the main table's row anatomy. */
function PinnedWeekRow({
  asset,
  kind,
  onOpen,
}: {
  asset: SubjectAsset;
  kind: PinnedKind;
  onOpen: (asset: SubjectAsset) => void;
}) {
  const { locale } = useLocale();
  const style = PINNED_KIND[kind];
  const Icon = style.icon;

  return (
    <tr className="group transition-colors hover:bg-muted/35">
      <td className="py-2.5 pl-4 pr-3 max-w-[220px] sm:max-w-[320px] md:max-w-[460px]">
        <div className="flex items-center gap-2.5">
          <span aria-hidden className={`h-7 w-1 shrink-0 rounded-full ${style.accent}`} />
          <button
            type="button"
            onClick={() => onOpen(asset)}
            className="flex min-w-0 flex-1 items-center gap-2 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            <Icon className={`size-4 shrink-0 ${style.text}`} />
            <span className="block truncate text-sm font-medium text-foreground transition-colors group-hover:text-primary">
              {t(asset.title, locale)}
            </span>
          </button>
        </div>
      </td>
      <td className="py-2.5 px-3 whitespace-nowrap">
        <span
          className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${style.pill}`}
        >
          <Icon className="size-3" />
          {t(style.label, locale)}
        </span>
      </td>
      <td className="py-2.5 px-3 tabular-nums text-xs text-muted-foreground whitespace-nowrap">
        {metaLine(asset, locale) || "—"}
      </td>
      <td className={`${PINNED_ACTIONS_CELL} py-2.5`}>
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={() => onOpen(asset)}
            aria-label={t(L.preview, locale)}
            className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-primary"
          >
            <Eye className="size-3.5" />
          </button>
          <a
            href={assetDownloadUrl(asset.url, asset.fileName)}
            download={asset.fileName}
            aria-label={`${t(L.download, locale)}: ${asset.fileName}`}
            className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-primary"
          >
            <Download className="size-3.5" />
          </a>
        </div>
      </td>
    </tr>
  );
}

/** Placeholder line for a week that never shipped a slide or a lab sheet. */
function PinnedWeekEmptyRow({ kind, label }: { kind: PinnedKind; label: string }) {
  const Icon = PINNED_KIND[kind].icon;
  return (
    <tr className="text-xs text-muted-foreground">
      <td colSpan={3} className="py-2 pl-4 pr-3">
        <div className="flex items-center gap-2.5">
          <span aria-hidden className="h-7 w-1 shrink-0 rounded-full bg-border" />
          <Icon className="size-3.5 shrink-0 opacity-50" />
          <span className="truncate">{label}</span>
        </div>
      </td>
      <td className={`${PINNED_ACTIONS_CELL} py-2`}>—</td>
    </tr>
  );
}

interface PinnedWeeklyShelfProps {
  assets: SubjectAsset[];
  onOpen: (asset: SubjectAsset) => void;
  courseCode?: string;
}

function PinnedWeeklyShelf({ assets, onOpen }: PinnedWeeklyShelfProps) {
  const { locale } = useLocale();
  const [activeTrack, setActiveTrack] = useState<"hardware" | "digital">("hardware");
  // Starts folded: the shelf is a jump-list, not the page's main content.
  const [isCollapsed, setIsCollapsed] = useState(true);

  // 2569 hardware parts list reference
  const hardwareList = useMemo(() => {
    return assets.find(
      (a) => a.id === "ics-hardware-list-2569" || a.fileName.includes("component-list"),
    );
  }, [assets]);

  // Weeks 1 to 7
  const weeklyPairs = useMemo(() => {
    const weeks = [1, 2, 3, 4, 5, 6, 7];
    return weeks.map((w) => {
      let slide: SubjectAsset | undefined;
      let lab: SubjectAsset | undefined;
      let topicTitle = { th: `สัปดาห์ที่ ${w}`, en: `Week ${w}` };

      if (activeTrack === "hardware") {
        slide = assets.find(
          (a) =>
            a.scope === "final" &&
            (a.isCurrentYear || a.status === "current_year") &&
            a.category === "lecture" &&
            a.week === w,
        );
        lab = assets.find(
          (a) =>
            a.scope === "final" &&
            (a.isCurrentYear || a.status === "current_year") &&
            a.category === "exercise" &&
            a.week === w,
        );
        const titlesTh: Record<number, string> = {
          1: "ภาพรวมระบบคอมพิวเตอร์ และการใช้มัลติมิเตอร์",
          2: "หน่วยความจำ แอดเดรส I/O และออสซิลโลสโคป",
          3: "มัลติเพล็กเซอร์ แลตช์ และเบรดบอร์ดเบื้องต้น",
          4: "ฟลิปฟล็อป เคาน์เตอร์ และวงจรออสซิลเลเตอร์",
          5: "วงจรแปลงสัญญาณ DAC/ADC และลอจิกเกต",
          6: "วงจรหน่วยความจำ และการต่อบอร์ด FPGA Basys2",
          7: "วงจร ALU และการสร้างซีพียู 4 บิต (สอบแล็บ)",
        };
        const titlesEn: Record<number, string> = {
          1: "Computer Systems Overview & Multimeter",
          2: "Memory Addressing, I/O & Oscilloscope",
          3: "MUX, Latch, Buffer & Breadboard Basics",
          4: "Flip-Flops, Counters, ADC & Oscillator",
          5: "DAC/ADC Part 2 & Multiplexers via Logic Gates",
          6: "Memory Circuits & FPGA Basys2",
          7: "ALU & 4-bit CPU Synthesis (Lab Exam)",
        };
        topicTitle = {
          th: titlesTh[w] ?? `สัปดาห์ที่ ${w}`,
          en: titlesEn[w] ?? `Week ${w}`,
        };
      } else {
        slide = assets.find(
          (a) =>
            a.scope === "midterm" &&
            a.category === "lecture" &&
            a.week === w &&
            !a.isDuplicate,
        );
        lab = assets.find(
          (a) =>
            a.scope === "midterm" &&
            a.category === "exercise" &&
            a.week === w &&
            !a.isDuplicate,
        );
        const titlesTh: Record<number, string> = {
          1: "ระบบดิจิทัลเบื้องต้น และโปรแกรม Logisim",
          2: "พีชคณิตบูลีน ทฤษฎีเดอมอร์แกน และเกตลอจิก",
          3: "รูปแบบมาตรฐานคาโนนิคอล SOP & POS",
          4: "การลดรูปฟังก์ชันลอจิกด้วย K-map",
          5: "การตอบสนองเชิงเวลา (Time Response & Delay)",
          6: "ระบบเลขฐานและการคำนวณเลขฐานสอง (Arithmetic)",
          7: "วงจรมัลติเพล็กเซอร์และดีมัลติเพล็กเซอร์ (MUX/DEMUX)",
        };
        const titlesEn: Record<number, string> = {
          1: "Digital Systems Intro & Logisim Simulator",
          2: "Boolean Algebra & DeMorgan's Theorems",
          3: "Canonical SOP & POS Forms",
          4: "Logic Minimization via K-map",
          5: "Time Response & Propagation Delay",
          6: "Number Systems & Signed Binary Arithmetic",
          7: "Multiplexer & Demultiplexer Trees",
        };
        topicTitle = {
          th: titlesTh[w] ?? `สัปดาห์ที่ ${w}`,
          en: titlesEn[w] ?? `Week ${w}`,
        };
      }

      return { week: w, topicTitle, slide, lab };
    });
  }, [assets, activeTrack]);

  return (
    <section
      aria-label="Pinned Courseware"
      className="mb-8 overflow-hidden rounded-3xl border border-primary/25 bg-gradient-to-b from-primary/5 via-card to-card p-4 shadow-sm backdrop-blur-md sm:p-6"
    >
      {/* Header bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full border border-primary/35 bg-primary/10 px-2 py-0.5 text-[11px] font-bold text-primary shadow-2xs">
              <Pin className="size-3" />
              <span>{locale === "th" ? "ปักหมุดเอกสารประจำปี 2569" : "Pinned AY 2569"}</span>
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/35 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
              <Sparkles className="size-3" />
              <span>
                {locale === "th"
                  ? "จัดเรียงสไลด์คู่ใบงานแล็บรายสัปดาห์"
                  : "Weekly Paired Slide & Lab"}
              </span>
            </span>
          </div>
          <h2 className="mt-1.5 text-lg font-bold tracking-tight text-foreground sm:text-xl">
            {locale === "th"
              ? "สื่อการสอนประจำปีการศึกษา 2569 (จัดเรียงรายสัปดาห์ 1–7)"
              : "Academic Year 2569 Courseware (Sorted by Week 1–7)"}
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
            {locale === "th"
              ? "จับคู่สไลด์บรรยายและใบงานแล็บประจำแต่ละสัปดาห์ สามารถกดเปิดอ่านตัวอย่างหรือดาวน์โหลดได้ทันที"
              : "Paired weekly lecture slides and lab sheets with direct 1-click preview and download."}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="inline-flex items-center gap-1.5 self-start rounded-full border bg-background/80 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground cursor-pointer sm:self-center"
        >
          {isCollapsed ? (
            <>
              <span>{locale === "th" ? "แสดงทั้งหมด" : "Expand"}</span>
              <ChevronDown className="size-3.5" />
            </>
          ) : (
            <>
              <span>{locale === "th" ? "ย่อแถบปักหมุด" : "Collapse"}</span>
              <ChevronUp className="size-3.5" />
            </>
          )}
        </button>
      </div>

      {/* Hardware Parts List Banner */}
      {hardwareList && !isCollapsed && (
        <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-primary/20 bg-background/90 p-3 shadow-2xs sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-2.5 min-w-0">
            <div className="rounded-xl border border-primary/30 bg-primary/10 p-2 text-primary shrink-0">
              <Cpu className="size-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-foreground truncate">
                  {t(hardwareList.title, locale)}
                </span>
                <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-1.5 py-0.2 text-[9px] font-bold text-emerald-700 dark:text-emerald-300 shrink-0">
                  2569
                </span>
              </div>
              <p className="line-clamp-1 text-[11px] text-muted-foreground">
                {t(hardwareList.description, locale)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onOpen(hardwareList)}
              className="h-7 rounded-full text-xs font-medium cursor-pointer"
            >
              <Eye className="mr-1 size-3" />
              {t(L.preview, locale)}
            </Button>
            <a
              href={assetDownloadUrl(hardwareList.url, hardwareList.fileName)}
              download={hardwareList.fileName}
              className="inline-flex h-7 items-center gap-1 rounded-full bg-primary px-3 text-xs font-semibold text-primary-foreground shadow-2xs hover:bg-primary/90 transition-colors"
            >
              <Download className="size-3" />
              <span>{t(L.download, locale)}</span>
            </a>
          </div>
        </div>
      )}

      {/* Track Selector Tabs */}
      {!isCollapsed && (
        <div className="mt-4 flex flex-wrap items-center gap-2 border-b border-border/50 pb-3">
          <span className="text-xs font-semibold text-muted-foreground mr-1">
            {locale === "th" ? "เลือกพาร์ตการเรียน:" : "Select Track:"}
          </span>
          <button
            type="button"
            onClick={() => setActiveTrack("hardware")}
            className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
              activeTrack === "hardware"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "border border-border/80 bg-background/80 text-muted-foreground hover:text-foreground"
            }`}
          >
            <Cpu className="size-3.5" />
            <span>
              {locale === "th"
                ? "⚡ ฮาร์ดแวร์ & แล็บจริง 2569 (ดร.ศุภกฤษติ์ · W1–7)"
                : "⚡ Hardware & Bench Labs 2569 (Dr. Supakit)"}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTrack("digital")}
            className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
              activeTrack === "digital"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "border border-border/80 bg-background/80 text-muted-foreground hover:text-foreground"
            }`}
          >
            <Layers className="size-3.5" />
            <span>
              {locale === "th"
                ? "📐 ตรรกศาสตร์ดิจิทัล & Logisim (อ.สุขสันต์ · W1–7)"
                : "📐 Digital Logic & Logisim (Aj. Sooksan)"}
            </span>
          </button>
        </div>
      )}

      {/* Weekly Table — grouped by week, same anatomy as the library table */}
      {!isCollapsed && (
        <div className="mt-4 overflow-hidden rounded-2xl border bg-card shadow-xs">
          <div className="overflow-x-auto [scrollbar-width:thin]">
            <table className="w-full min-w-[560px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b bg-muted/40 text-xs font-semibold text-muted-foreground select-none">
                  <th scope="col" className="py-3 pl-4 pr-3">
                    {t(L.colName, locale)}
                  </th>
                  <th scope="col" className="py-3 px-3 whitespace-nowrap">
                    {t(L.colCategory, locale)}
                  </th>
                  <th scope="col" className="py-3 px-3 whitespace-nowrap">
                    {t(L.colSize, locale)}
                  </th>
                  <th
                    scope="col"
                    className="sticky right-0 z-10 w-24 whitespace-nowrap bg-muted/95 backdrop-blur-xs py-3 pl-2 pr-4 text-right shadow-[-6px_0_10px_-4px_rgba(0,0,0,0.06)]"
                  >
                    {t(L.colActions, locale)}
                  </th>
                </tr>
              </thead>
              {weeklyPairs.map(({ week, topicTitle, slide, lab }) => (
                <tbody
                  key={week}
                  className="divide-y divide-border/40 border-b border-border/60 last:border-b-0"
                >
                  {/* Week group header */}
                  <tr className="bg-muted/25">
                    <th scope="colgroup" colSpan={4} className="py-2 pl-4 pr-4 text-left">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex shrink-0 items-center rounded-md border border-primary/30 bg-primary/10 px-2 py-0.5 text-[11px] font-bold text-primary tabular-nums">
                          {locale === "th" ? `สัปดาห์ที่ ${week}` : `Week 0${week}`}
                        </span>
                        <span className="min-w-0 truncate text-xs font-bold text-foreground">
                          {t(topicTitle, locale)}
                        </span>
                        <span className="ml-auto shrink-0 text-[10px] font-medium text-muted-foreground">
                          {activeTrack === "hardware" ? "2569 Final" : "2569 Midterm"}
                        </span>
                      </div>
                    </th>
                  </tr>

                  {slide ? (
                    <PinnedWeekRow asset={slide} kind="lecture" onOpen={onOpen} />
                  ) : (
                    <PinnedWeekEmptyRow
                      kind="lecture"
                      label={locale === "th" ? "ไม่มีสไลด์บรรยาย" : "No lecture slide"}
                    />
                  )}

                  {lab ? (
                    <PinnedWeekRow asset={lab} kind="lab" onOpen={onOpen} />
                  ) : (
                    <PinnedWeekEmptyRow
                      kind="lab"
                      label={
                        week === 7 && activeTrack === "hardware"
                          ? locale === "th"
                            ? "📝 สอบปฏิบัติการในห้องเรียน (Lab Exam)"
                            : "📝 In-class Practical Lab Exam"
                          : locale === "th"
                            ? "ไม่มีใบงานแล็บสัปดาห์นี้"
                            : "No lab worksheet this week"
                      }
                    />
                  )}
                </tbody>
              ))}
            </table>
          </div>
        </div>
      )}
    </section>
  );
}

// ── Main component ───────────────────────────────────────────────────────────

export function SubjectLibrary({
  assets,
  backHref,
  backLabel,
  title,
  subtitle,
  courseCode,
}: SubjectLibraryProps) {
  const { locale } = useLocale();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [scope, setScope] = useState<ScopeFilter>("all");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [activeChapter, setActiveChapter] = useState<number | null>(null);
  const [layout, setLayout] = useState<LayoutMode>("table");
  const [sortCol, setSortCol] = useState<SortColumn>("default");
  const [sortDir, setSortDir] = useState<SortDirection>("asc");
  const [openStacks, setOpenStacks] = useState<ReadonlySet<string>>(new Set());
  const [preview, setPreview] = useState<Preview | null>(null);
  const [hideDuplicates, setHideDuplicates] = useState(courseCode === "ICS");

  // Quick keyboard shortcut: press '/' to focus search
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "/" &&
        !["INPUT", "TEXTAREA"].includes((document.activeElement as HTMLElement)?.tagName)
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const duplicateCount = useMemo(
    () => assets.filter((a) => a.isDuplicate).length,
    [assets],
  );

  const hasCurrentYear = useMemo(
    () => courseCode === "ICS" || assets.some((a) => a.isCurrentYear),
    [courseCode, assets],
  );

  // Category is derived, so resolve it once per asset rather than on every
  // keystroke through the filter. Filter out duplicates when hideDuplicates is active.
  const shelved = useMemo(() => {
    const list = hideDuplicates ? assets.filter((asset) => !asset.isDuplicate) : assets;
    return list.map((asset) => ({ asset, category: resolveCategory(asset) }));
  }, [assets, hideDuplicates]);

  const counts = useMemo(() => {
    const tally = {} as Record<AssetCategory, number>;
    for (const { category } of shelved) tally[category] = (tally[category] ?? 0) + 1;
    return tally;
  }, [shelved]);

  // Only the shelves this course actually has, in the fixed order above so two
  // libraries never present the same chips in a different sequence.
  const chips = useMemo(
    () => (Object.keys(CATEGORY) as AssetCategory[]).filter((c) => counts[c]),
    [counts],
  );

  // Counted over the whole library, like the "All" chip, so the numbers on the
  // segmented control do not shift as the other filters move.
  const scopeCounts = useMemo(() => {
    const tally: Record<ScopeBucket, number> = { midterm: 0, final: 0, term: 0 };
    for (const asset of assets) tally[asset.scope ?? "term"] += 1;
    return tally;
  }, [assets]);

  // A course whose material all sits on one side of the midterm has no
  // milestone to choose between, so the control stays out of the way.
  const scoped = scopeCounts.midterm > 0 && scopeCounts.final > 0;

  // Chapters this shelf actually carries.
  const allChapters = useMemo(() => {
    const found = new Set<number>();
    for (const asset of assets) if (asset.chapter !== undefined) found.add(asset.chapter);
    return Array.from(found).sort((a, b) => a - b);
  }, [assets]);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    for (const asset of assets) for (const tag of asset.tags) tags.add(tag);
    return Array.from(tags).sort((a, b) => a.localeCompare(b, locale));
  }, [assets, locale]);

  // Tally frequency of each tag to offer popular quick chips
  const tagCounts = useMemo(() => {
    const tally: Record<string, number> = {};
    for (const asset of assets) {
      for (const tag of asset.tags) {
        tally[tag] = (tally[tag] ?? 0) + 1;
      }
    }
    return tally;
  }, [assets]);

  const popularTags = useMemo(() => {
    return [...allTags]
      .sort((a, b) => (tagCounts[b] ?? 0) - (tagCounts[a] ?? 0))
      .slice(0, 8);
  }, [allTags, tagCounts]);

  const remainingTags = useMemo(() => {
    return allTags.filter((tag) => !popularTags.includes(tag));
  }, [allTags, popularTags]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return shelved
      .filter(({ asset, category }) => {
        // Term-wide material survives either milestone: a Z-table is needed
        // for both papers, so hiding it under one would be wrong.
        if (scope !== "all" && asset.scope && asset.scope !== scope) return false;
        if (filter !== "all" && category !== filter) return false;
        if (activeTag && !asset.tags.includes(activeTag)) return false;
        if (activeChapter !== null && asset.chapter !== activeChapter) return false;
        if (!query) return true;
        const group = asset.groupId ? ASSET_GROUPS[asset.groupId] : undefined;
        return (
          t(asset.title, locale).toLowerCase().includes(query) ||
          t(asset.description, locale).toLowerCase().includes(query) ||
          asset.fileName.toLowerCase().includes(query) ||
          asset.tags.some((tag) => tag.toLowerCase().includes(query)) ||
          (group ? t(group, locale).toLowerCase().includes(query) : false)
        );
      })
      .map(({ asset }) => asset);
  }, [shelved, search, filter, activeTag, activeChapter, scope, locale]);

  const entries = useMemo<GalleryEntry[]>(() => {
    const members = new Map<string, SubjectAsset[]>();
    for (const asset of filtered) {
      if (!asset.groupId || !ASSET_GROUPS[asset.groupId]) continue;
      const list = members.get(asset.groupId);
      if (list) list.push(asset);
      else members.set(asset.groupId, [asset]);
    }

    const emitted = new Set<string>();
    const out: GalleryEntry[] = [];
    for (const asset of filtered) {
      const groupId = asset.groupId;
      const group = groupId ? members.get(groupId) : undefined;
      if (!groupId || !group || group.length < 2) {
        out.push({ kind: "single", key: asset.id, asset });
        continue;
      }
      if (emitted.has(groupId)) continue;
      emitted.add(groupId);
      out.push({
        kind: "stack",
        key: groupId,
        title: ASSET_GROUPS[groupId],
        assets: group,
      });
    }
    return out;
  }, [filtered]);

  const sortedEntries = useMemo(() => {
    return sortGalleryEntries(entries, sortCol, sortDir, locale);
  }, [entries, sortCol, sortDir, locale]);

  const sections = useMemo(() => {
    if (!scoped || scope !== "all") return null;
    const order: ScopeBucket[] = ["midterm", "final", "term"];
    return order
      .map((bucket) => ({
        bucket,
        entries: sortedEntries.filter((entry) => entryScope(entry) === bucket),
      }))
      .filter((section) => section.entries.length > 0);
  }, [sortedEntries, scope, scoped]);

  const openSingle = useCallback(
    (asset: SubjectAsset) => setPreview({ items: [asset], index: 0 }),
    [],
  );
  const openIn = useCallback(
    (items: SubjectAsset[], index: number) => setPreview({ items, index }),
    [],
  );
  const toggleStack = useCallback((id: string) => {
    setOpenStacks((current) => {
      const next = new Set(current);
      if (!next.delete(id)) next.add(id);
      return next;
    });
  }, []);

  const clearFilters = () => {
    setSearch("");
    setFilter("all");
    setActiveTag(null);
    setActiveChapter(null);
    setScope("all");
    setSortCol("default");
    setSortDir("asc");
    setHideDuplicates(courseCode === "ICS");
  };

  const filtersActive =
    search !== "" ||
    filter !== "all" ||
    activeTag !== null ||
    activeChapter !== null ||
    scope !== "all" ||
    sortCol !== "default";

  const filtersNarrowed =
    search !== "" || filter !== "all" || activeTag !== null || activeChapter !== null;

  const currentSortLabel = useMemo(() => {
    const match = SORT_OPTIONS.find(
      (opt) => opt.col === sortCol && (opt.col === "default" || opt.dir === sortDir),
    );
    return match ? t(match.label, locale) : t(L.sortDefault, locale);
  }, [sortCol, sortDir, locale]);

  const handleTableSort = (col: SortColumn) => {
    if (sortCol !== col) {
      setSortCol(col);
      setSortDir(col === "size" ? "desc" : "asc");
    } else if (sortDir === "asc") {
      setSortDir("desc");
    } else {
      setSortCol("default");
      setSortDir("asc");
    }
  };

  const renderGrid = (list: GalleryEntry[]) => (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(9.5rem,1fr))] gap-x-4 gap-y-6">
      {list.map((entry, idx) => {
        const itemKey = entry.kind === "single" ? `${entry.key}-${entry.asset.url || idx}` : entry.key;
        if (entry.kind === "single") {
          return entry.asset.fileType === "image" ? (
            <ImageTile
              key={itemKey}
              asset={entry.asset}
              courseCode={courseCode}
              onOpen={openSingle}
            />
          ) : (
            <BookCover
              key={itemKey}
              asset={entry.asset}
              courseCode={courseCode}
              onOpen={openSingle}
            />
          );
        }

        const expanded = openStacks.has(entry.key);
        return (
          <Fragment key={itemKey}>
            <PhotoStack
              title={entry.title}
              assets={entry.assets}
              courseCode={courseCode}
              expanded={expanded}
              onToggle={() => toggleStack(entry.key)}
              onOpen={(index) => openIn(entry.assets, index)}
            />
            {expanded && (
              <StackSheet
                title={entry.title}
                assets={entry.assets}
                onOpen={(index) => openIn(entry.assets, index)}
                onCollapse={() => toggleStack(entry.key)}
              />
            )}
          </Fragment>
        );
      })}
    </div>
  );

  const renderList = (list: GalleryEntry[]) => (
    <div className="overflow-hidden rounded-2xl border bg-card">
      {list.map((entry, idx) => {
        const itemKey = entry.kind === "single" ? `${entry.key}-${entry.asset.url || idx}` : entry.key;
        return entry.kind === "stack" ? (
          <CompactStackRow
            key={itemKey}
            title={entry.title}
            assets={entry.assets}
            courseCode={courseCode}
            onOpen={(index) => openIn(entry.assets, index)}
          />
        ) : (
          <CompactRow
            key={itemKey}
            asset={entry.asset}
            courseCode={courseCode}
            onOpen={openSingle}
          />
        );
      })}
    </div>
  );

  const renderEntries = (list: GalleryEntry[]) => {
    if (layout === "table") {
      return (
        <SubjectLibraryTable
          entries={list}
          courseCode={courseCode}
          sortCol={sortCol}
          sortDir={sortDir}
          onSort={handleTableSort}
          onOpenSingle={openSingle}
          onOpenStack={openIn}
        />
      );
    }
    if (layout === "list") {
      return renderList(list);
    }
    return renderGrid(list);
  };

  return (
    <main className="brand-shelf mx-auto w-full max-w-6xl px-3 py-6 sm:px-6 sm:py-10">
      <Link
        href={backHref}
        className="mb-5 inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-primary sm:text-sm"
      >
        <ArrowLeft className="size-3.5 sm:size-4" />
        {t(backLabel, locale)}
      </Link>

      <header className="mb-6 sm:mb-8">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{t(title, locale)}</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          {t(subtitle, locale)} · {filtered.length}/{assets.length} {t(L.count, locale)}
        </p>
      </header>

      {/* Pinned Current Year Shelf for ICS */}
      {hasCurrentYear && (
        <PinnedWeeklyShelf
          assets={assets}
          onOpen={openSingle}
          courseCode={courseCode}
        />
      )}

      {/* Control Deck */}
      <div className="mb-8 rounded-2xl border bg-card/75 p-3.5 sm:p-5 shadow-xs backdrop-blur-md space-y-3.5">
        {/* Row 1: Command Toolbar (Search + Sort Dropdown + View Switcher) */}
        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
          {/* Search input with Clear and Keyboard Shortcut */}
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              ref={searchInputRef}
              id="library-search"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  if (search) setSearch("");
                  else e.currentTarget.blur();
                }
              }}
              placeholder={t(L.searchPlaceholder, locale)}
              className="w-full rounded-full border bg-background/90 py-2.5 pl-10 pr-20 text-sm shadow-2xs transition-shadow placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
              {search.trim() ? (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    searchInputRef.current?.focus();
                  }}
                  aria-label={t(L.clearSearch, locale)}
                  className="rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                >
                  <X className="size-3.5" />
                </button>
              ) : (
                <kbd className="hidden sm:inline-flex items-center rounded border border-border/80 bg-muted/70 px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground/70 select-none">
                  /
                </kbd>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 self-stretch justify-between sm:self-auto sm:justify-start">
            {/* Sort Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-medium shadow-2xs transition-colors cursor-pointer ${
                    sortCol !== "default"
                      ? "border-primary bg-primary/10 text-primary hover:bg-primary/15"
                      : "bg-background/90 text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                  aria-label={t(L.sortBy, locale)}
                >
                  <ArrowUpDown className="size-3.5 shrink-0" />
                  <span className="hidden sm:inline text-muted-foreground">{t(L.sortBy, locale)}:</span>
                  <span className="font-semibold text-foreground max-w-[130px] truncate">
                    {currentSortLabel}
                  </span>
                  <ChevronDown className="size-3 opacity-60 ml-0.5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 p-1 text-xs">
                <DropdownMenuLabel className="text-[11px] text-muted-foreground font-semibold px-2 py-1">
                  {t(L.sortBy, locale)}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {SORT_OPTIONS.map((opt) => {
                  const isSelected =
                    opt.col === sortCol && (opt.col === "default" || opt.dir === sortDir);
                  return (
                    <DropdownMenuItem
                      key={opt.id}
                      onClick={() => {
                        setSortCol(opt.col);
                        if (opt.dir) setSortDir(opt.dir);
                      }}
                      className="flex items-center justify-between py-1.5 px-2 cursor-pointer text-xs"
                    >
                      <span className={isSelected ? "font-semibold text-primary" : ""}>
                        {t(opt.label, locale)}
                      </span>
                      {isSelected && <Check className="size-3.5 text-primary ml-2 shrink-0" />}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* View Mode Switcher */}
            <div className="flex shrink-0 items-center gap-0.5 rounded-full border bg-background/90 p-1 shadow-2xs">
              {(
                [
                  ["table", Table2, L.table],
                  ["gallery", LayoutGrid, L.gallery],
                  ["list", Rows3, L.list],
                ] as const
              ).map(([mode, Icon, label]) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setLayout(mode)}
                  aria-label={t(label, locale)}
                  aria-pressed={layout === mode}
                  className={`rounded-full p-1.5 transition-colors cursor-pointer ${
                    layout === mode
                      ? "bg-primary text-primary-foreground shadow-2xs"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Icon className="size-3.5" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Row 2: Scope Tabs & Category Shelf Pills */}
        <div className="flex flex-col gap-2.5 lg:flex-row lg:items-center lg:justify-between border-t border-border/40 pt-3">
          {/* Exam Milestone Tabs */}
          {scoped && (
            <div
              role="group"
              aria-label={t(L.examScope, locale)}
              className="inline-flex shrink-0 gap-1 rounded-full border bg-muted/40 p-1 self-start"
            >
              {(["all", "midterm", "final"] as const).map((option) => {
                const active = scope === option;
                const Icon = option === "all" ? null : SCOPE_ICON[option];
                const label =
                  option === "all" ? t(L.scopeAll, locale) : t(SCOPE_LABEL[option], locale);
                const total =
                  option === "all"
                    ? assets.length
                    : scopeCounts[option] + scopeCounts.term;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setScope(option)}
                    aria-pressed={active}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                      active
                        ? "bg-background text-foreground shadow-2xs font-bold"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {Icon && <Icon className="size-3.5" />}
                    <span>{label}</span>
                    <span className="tabular-nums text-[10px] opacity-70">({total})</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Category Chips */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setFilter("all")}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors cursor-pointer ${
                filter === "all"
                  ? "border-primary bg-primary text-primary-foreground shadow-2xs"
                  : "bg-background/80 text-muted-foreground hover:border-primary/40 hover:text-foreground"
              }`}
            >
              {t(L.filterAll, locale)} · {shelved.length}
            </button>
            {chips.map((category) => {
              const style = CATEGORY[category];
              const Icon = style.icon;
              const active = filter === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setFilter(active ? "all" : category)}
                  className={`${style.shelf} inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer ${
                    active
                      ? "border-primary bg-primary text-primary-foreground shadow-2xs"
                      : "shelf-pill text-primary hover:brightness-95"
                  }`}
                >
                  <Icon className="size-3" />
                  <span>{t(style.label, locale)}</span>
                  <span className="text-[10px] opacity-80 tabular-nums">· {counts[category]}</span>
                </button>
              );
            })}

            {/* Duplicate Filter Toggle */}
            {duplicateCount > 0 && (
              <button
                type="button"
                onClick={() => setHideDuplicates(!hideDuplicates)}
                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer ${
                  hideDuplicates
                    ? "border-amber-500/35 bg-amber-500/10 text-amber-700 dark:text-amber-300 hover:bg-amber-500/20"
                    : "border-border/80 bg-background/80 text-muted-foreground hover:text-foreground"
                }`}
                title={
                  hideDuplicates
                    ? "คลิกเพื่อแสดงเอกสารสำรอง/v2 ทั้งหมด"
                    : "คลิกเพื่อซ่อนเอกสารสำรอง/v2"
                }
              >
                <Copy className="size-3 shrink-0" />
                <span>
                  {hideDuplicates
                    ? locale === "th"
                      ? `ซ่อนฉบับสำรอง (${duplicateCount})`
                      : `Hide duplicates (${duplicateCount})`
                    : locale === "th"
                      ? `แสดงฉบับสำรอง (${duplicateCount})`
                      : `Showing duplicates (${duplicateCount})`}
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Row 3: Chapters & Topics / Tags */}
        {(allChapters.length > 1 || allTags.length > 0) && (
          <div className="space-y-2 border-t border-border/40 pt-3 text-xs">
            {/* Chapter Row */}
            {allChapters.length > 1 && (
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none]">
                <span className="shrink-0 text-xs font-medium text-muted-foreground mr-1">
                  {t(L.chapters, locale)}:
                </span>
                <button
                  type="button"
                  onClick={() => setActiveChapter(null)}
                  className={`shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors cursor-pointer ${
                    activeChapter === null
                      ? "border-primary bg-primary text-primary-foreground shadow-2xs"
                      : "bg-background/80 text-muted-foreground hover:border-primary/40 hover:text-foreground"
                  }`}
                >
                  {t(L.allChapters, locale)}
                </button>
                {allChapters.map((chapter) => (
                  <button
                    key={chapter}
                    type="button"
                    onClick={() =>
                      setActiveChapter(activeChapter === chapter ? null : chapter)
                    }
                    className={`shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-medium tabular-nums transition-colors cursor-pointer ${
                      activeChapter === chapter
                        ? "border-primary bg-primary text-primary-foreground shadow-2xs"
                        : "bg-background/80 text-muted-foreground hover:border-primary/40 hover:text-foreground"
                    }`}
                  >
                    {locale === "th" ? `บท ${chapter}` : `Ch. ${chapter}`}
                  </button>
                ))}
              </div>
            )}

            {/* Topics Row */}
            {allTags.length > 0 && (
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none]">
                <span className="shrink-0 text-xs font-medium text-muted-foreground mr-1">
                  {t(L.topics, locale)}:
                </span>
                {/* Active tag if not in popularTags */}
                {activeTag && !popularTags.includes(activeTag) && (
                  <button
                    type="button"
                    onClick={() => setActiveTag(null)}
                    className="shrink-0 inline-flex items-center gap-1 rounded-full border border-primary bg-primary text-primary-foreground px-2.5 py-0.5 text-xs font-medium shadow-2xs cursor-pointer"
                  >
                    <span>{activeTag}</span>
                    <X className="size-2.5" />
                  </button>
                )}
                {/* Popular Tags */}
                {popularTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                    className={`shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors cursor-pointer ${
                      activeTag === tag
                        ? "border-primary bg-primary text-primary-foreground shadow-2xs"
                        : "bg-background/80 text-muted-foreground hover:border-primary/40 hover:text-foreground"
                    }`}
                  >
                    {tag}
                    <span className="ml-1 text-[10px] opacity-60 tabular-nums">
                      {tagCounts[tag]}
                    </span>
                  </button>
                ))}
                {/* All remaining tags in a Dropdown */}
                {remainingTags.length > 0 && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        type="button"
                        className="shrink-0 inline-flex items-center gap-1 rounded-full border bg-background/80 px-2.5 py-0.5 text-xs font-medium text-muted-foreground hover:border-primary/40 hover:text-foreground transition-colors cursor-pointer"
                      >
                        <Tag className="size-3 opacity-60" />
                        <span>+{remainingTags.length} {t(L.moreTopics, locale)}</span>
                        <ChevronDown className="size-2.5 opacity-60" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-56 max-h-72 overflow-y-auto p-1 text-xs">
                      <DropdownMenuLabel className="text-[11px] text-muted-foreground px-2 py-1">
                        {t(L.allTopics, locale)} ({allTags.length})
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {activeTag && (
                        <>
                          <DropdownMenuItem
                            onClick={() => setActiveTag(null)}
                            className="flex items-center justify-between text-destructive cursor-pointer"
                          >
                            <span>{t(L.clear, locale)} ({activeTag})</span>
                            <X className="size-3" />
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                        </>
                      )}
                      {allTags.map((tag) => {
                        const isSelected = activeTag === tag;
                        return (
                          <DropdownMenuItem
                            key={tag}
                            onClick={() => setActiveTag(isSelected ? null : tag)}
                            className="flex items-center justify-between py-1.5 px-2 cursor-pointer"
                          >
                            <span className={isSelected ? "font-semibold text-primary" : ""}>
                              {tag}
                            </span>
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] text-muted-foreground tabular-nums">
                                {tagCounts[tag]}
                              </span>
                              {isSelected && <Check className="size-3 text-primary shrink-0" />}
                            </div>
                          </DropdownMenuItem>
                        );
                      })}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            )}
          </div>
        )}

        {/* Row 4: Active Filters Bar & Match Summary (conditional) */}
        {filtersActive && (
          <div className="flex flex-wrap items-center gap-1.5 border-t border-border/50 pt-2.5 text-xs animate-in fade-in-0 duration-200">
            <span className="text-[11px] font-medium text-muted-foreground mr-1">
              {t(L.activeFilters, locale)}:
            </span>
            {search.trim() && (
              <span className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                {t(L.filterQuery, locale)}: &ldquo;{search.trim()}&rdquo;
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="rounded-full p-0.5 hover:bg-primary/20 cursor-pointer"
                >
                  <X className="size-2.5" />
                </button>
              </span>
            )}
            {scope !== "all" && (
              <span className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                {t(L.filterScope, locale)}: {t(SCOPE_LABEL[scope], locale)}
                <button
                  type="button"
                  onClick={() => setScope("all")}
                  className="rounded-full p-0.5 hover:bg-primary/20 cursor-pointer"
                >
                  <X className="size-2.5" />
                </button>
              </span>
            )}
            {filter !== "all" && (
              <span className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                {t(L.filterCat, locale)}: {t(CATEGORY[filter].label, locale)}
                <button
                  type="button"
                  onClick={() => setFilter("all")}
                  className="rounded-full p-0.5 hover:bg-primary/20 cursor-pointer"
                >
                  <X className="size-2.5" />
                </button>
              </span>
            )}
            {activeChapter !== null && (
              <span className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                {t(L.filterCh, locale)} {activeChapter}
                <button
                  type="button"
                  onClick={() => setActiveChapter(null)}
                  className="rounded-full p-0.5 hover:bg-primary/20 cursor-pointer"
                >
                  <X className="size-2.5" />
                </button>
              </span>
            )}
            {activeTag !== null && (
              <span className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                {t(L.filterTag, locale)}: {activeTag}
                <button
                  type="button"
                  onClick={() => setActiveTag(null)}
                  className="rounded-full p-0.5 hover:bg-primary/20 cursor-pointer"
                >
                  <X className="size-2.5" />
                </button>
              </span>
            )}
            {sortCol !== "default" && (
              <span className="inline-flex items-center gap-1 rounded-full border bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                {t(L.sortBy, locale)}: {currentSortLabel}
                <button
                  type="button"
                  onClick={() => {
                    setSortCol("default");
                    setSortDir("asc");
                  }}
                  className="rounded-full p-0.5 hover:bg-muted-foreground/20 cursor-pointer"
                >
                  <X className="size-2.5" />
                </button>
              </span>
            )}
            {hideDuplicates && duplicateCount > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/35 bg-amber-500/10 px-2 py-0.5 text-[11px] font-medium text-amber-700 dark:text-amber-300">
                {locale === "th"
                  ? `ซ่อนฉบับสำรอง: ${duplicateCount}`
                  : `Hidden duplicates: ${duplicateCount}`}
                <button
                  type="button"
                  onClick={() => setHideDuplicates(false)}
                  className="rounded-full p-0.5 hover:bg-amber-500/20 cursor-pointer"
                  title={locale === "th" ? "แสดงฉบับสำรอง" : "Show duplicates"}
                >
                  <X className="size-2.5" />
                </button>
              </span>
            )}
            <button
              type="button"
              onClick={clearFilters}
              className="ml-auto inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline cursor-pointer"
            >
              <RotateCcw className="size-3" />
              {t(L.clearAll, locale)}
            </button>
          </div>
        )}
      </div>

      {/* Results */}
      {entries.length === 0 ? (
        <div className="rounded-2xl border bg-muted/20 py-16 text-center">
          <p className="text-sm text-muted-foreground">
            {t(scope !== "all" && !filtersNarrowed ? L.emptyScope : L.noResults, locale)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">{t(L.noResultsHint, locale)}</p>
          {filtersActive && (
            <Button variant="outline" className="mt-4 rounded-full" onClick={clearFilters}>
              {t(L.clear, locale)}
            </Button>
          )}
        </div>
      ) : sections ? (
        <div className="space-y-9">
          {sections.map(({ bucket, entries: sectionEntries }) => {
            const Icon = SCOPE_ICON[bucket];
            return (
              <section key={bucket}>
                <header className="mb-3 flex items-center gap-2 border-b pb-2">
                  <Icon className="size-4 shrink-0 text-primary" />
                  <h2 className="text-sm font-bold">
                    {bucket === "term"
                      ? t(L.termWide, locale)
                      : t(SCOPE_HEADING[bucket], locale)}
                  </h2>
                  <span className="text-xs tabular-nums text-muted-foreground">
                    {sectionEntries.length}
                  </span>
                </header>
                {renderEntries(sectionEntries)}
              </section>
            );
          })}
        </div>
      ) : (
        renderEntries(sortedEntries)
      )}

      {preview && (
        <PreviewModal
          preview={preview}
          courseCode={courseCode}
          onIndexChange={(index) => setPreview({ ...preview, index })}
          onClose={() => setPreview(null)}
        />
      )}
    </main>
  );
}
