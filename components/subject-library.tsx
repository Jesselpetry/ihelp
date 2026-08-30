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
  ArrowLeft,
  CalendarRange,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  FileDown,
  FileText,
  FlaskConical,
  Images,
  LayoutGrid,
  Library,
  Flag,
  Maximize,
  Maximize2,
  Milestone,
  Minimize,
  Minus,
  NotebookPen,
  Plus,
  Rows3,
  RotateCcw,
  ScrollText,
  Search,
  Sigma,
  Table2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocale, t, type LText } from "@/lib/i18n";
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
} from "@/lib/subject-library";

interface SubjectLibraryProps {
  assets: SubjectAsset[];
  backHref: string;
  backLabel: LText;
  title: LText;
  subtitle: LText;
  /** Short course code stamped on each cover, e.g. "MFIT". */
  courseCode?: string;
}

type LayoutMode = "gallery" | "list";
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

/** What the modal is currently showing, and where in its run. */
interface Preview {
  items: SubjectAsset[];
  index: number;
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
  preview: { th: "ดูตัวอย่าง", en: "Preview" },
  download: { th: "ดาวน์โหลด", en: "Download" },
  viewContent: { th: "ดูเนื้อหา", en: "View Content" },
  closePreview: { th: "ปิดหน้าต่างตัวอย่าง", en: "Close preview" },
  openInTab: { th: "เปิดในแท็บใหม่", en: "Open in new tab" },
  gallery: { th: "มุมมองแกลเลอรี", en: "Gallery view" },
  list: { th: "มุมมองรายการ", en: "Compact list" },
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

// ── Preview modal ────────────────────────────────────────────────────────────

interface Transform {
  scale: number;
  x: number;
  y: number;
}

const IDENTITY: Transform = { scale: 1, x: 0, y: 0 };
const MIN_SCALE = 1;
const MAX_SCALE = 6;

const clampScale = (scale: number) => Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale));

/** Safari still ships the prefixed Fullscreen API. */
type FullscreenCapable = HTMLElement & { webkitRequestFullscreen?: () => Promise<void> };
type FullscreenDocument = Document & {
  webkitFullscreenElement?: Element | null;
  webkitExitFullscreen?: () => Promise<void>;
};

/**
 * Full-screen preview. PDFs get an embedded viewer with a real fullscreen
 * toggle and a download link; images get a zoom-and-pan surface; in-app
 * markdown gets a link out to its reader. When opened from a scan set the
 * modal pages through the whole run.
 */
function PreviewModal({
  preview,
  courseCode,
  onIndexChange,
  onClose,
}: {
  preview: Preview;
  courseCode?: string;
  onIndexChange: (index: number) => void;
  onClose: () => void;
}) {
  const { locale } = useLocale();
  const { items, index } = preview;
  const asset = items[index];
  const category = resolveCategory(asset);
  const style = CATEGORY[category];
  const Icon = style.icon;

  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [transform, setTransform] = useState<Transform>(IDENTITY);
  // The origin only feeds the pointer maths, but whether a drag is in flight
  // also decides the cursor and whether the image animates, so that half is
  // state rather than a ref.
  const dragOrigin = useRef<{ x: number; y: number } | null>(null);
  const [dragging, setDragging] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const zoomable = asset.fileType === "image";
  const paged = items.length > 1;
  const meta = metaLine(asset, locale);
  const chapter = chapterTag(asset);

  const step = useCallback(
    (delta: number) => {
      if (!paged) return;
      onIndexChange((index + delta + items.length) % items.length);
    },
    [paged, index, items.length, onIndexChange],
  );

  // A new page starts fresh rather than inheriting the last one's zoom. This is
  // the adjust-state-during-render pattern rather than an effect, so the reset
  // lands in the same commit as the page change instead of one frame later.
  const [shownIndex, setShownIndex] = useState(index);
  if (shownIndex !== index) {
    setShownIndex(index);
    setTransform(IDENTITY);
  }

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      // In fullscreen the browser's own Escape exits it; closing the modal too
      // would drop the reader two levels in one keypress.
      if (event.key === "Escape" && !document.fullscreenElement) onClose();
      if (event.key === "ArrowRight") step(1);
      if (event.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [onClose, step]);

  // Fullscreen can also be left through the browser chrome or Escape, so the
  // button's label follows the document rather than its own click history.
  useEffect(() => {
    const doc = document as FullscreenDocument;
    const sync = () =>
      setIsFullscreen(
        (doc.fullscreenElement ?? doc.webkitFullscreenElement) === rootRef.current,
      );
    document.addEventListener("fullscreenchange", sync);
    document.addEventListener("webkitfullscreenchange", sync);
    return () => {
      document.removeEventListener("fullscreenchange", sync);
      document.removeEventListener("webkitfullscreenchange", sync);
    };
  }, []);

  const toggleFullscreen = () => {
    const doc = document as FullscreenDocument;
    const root = rootRef.current as FullscreenCapable | null;
    if (doc.fullscreenElement ?? doc.webkitFullscreenElement) {
      void (doc.exitFullscreen?.() ?? doc.webkitExitFullscreen?.());
    } else {
      void (root?.requestFullscreen?.() ?? root?.webkitRequestFullscreen?.());
    }
  };

  // React attaches wheel handlers passively, so zoom-on-scroll has to be bound
  // natively or the page scrolls underneath the image instead of zooming it.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || !zoomable) return;

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      setTransform((current) => {
        const next = clampScale(current.scale * (event.deltaY < 0 ? 1.12 : 1 / 1.12));
        // Zooming all the way out re-centres, so the image can never be left
        // parked off-screen with no way back.
        if (next === MIN_SCALE) return IDENTITY;
        return { ...current, scale: next };
      });
    };

    stage.addEventListener("wheel", onWheel, { passive: false });
    return () => stage.removeEventListener("wheel", onWheel);
  }, [zoomable]);

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!zoomable || transform.scale === MIN_SCALE) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragOrigin.current = { x: event.clientX - transform.x, y: event.clientY - transform.y };
    setDragging(true);
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const origin = dragOrigin.current;
    if (!origin) return;
    setTransform((current) => ({
      ...current,
      x: event.clientX - origin.x,
      y: event.clientY - origin.y,
    }));
  };

  const endDrag = () => {
    dragOrigin.current = null;
    setDragging(false);
  };

  const zoomBy = (factor: number) =>
    setTransform((current) => {
      const next = clampScale(current.scale * factor);
      return next === MIN_SCALE ? IDENTITY : { ...current, scale: next };
    });

  const arrowClass =
    "absolute top-1/2 z-10 -translate-y-1/2 rounded-full border bg-card/90 p-2 text-foreground shadow-lg backdrop-blur transition-colors hover:bg-card disabled:opacity-40";

  return (
    // Backdrop. Clicking it dismisses; the panel stops the event so a click
    // that starts inside — the end of a pan drag, say — never closes.
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-0 backdrop-blur-sm sm:p-4 lg:p-6"
      onPointerDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={rootRef}
        role="dialog"
        aria-modal="true"
        aria-label={t(asset.title, locale)}
        // Fullscreen paints the panel's own background over the whole screen,
        // so it drops the floating chrome and the size cap while it is up.
        className={
          isFullscreen
            ? "flex size-full flex-col bg-card"
            : "flex h-full max-h-none w-full flex-col overflow-hidden border bg-card shadow-2xl sm:h-[96vh] sm:max-h-[96vh] sm:w-[96vw] sm:max-w-7xl sm:rounded-2xl"
        }
      >
      {/* Header */}
      <header className="flex shrink-0 items-start justify-between gap-3 border-b bg-card/80 px-4 py-3 sm:px-6">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl border shelf-pill text-primary">
            <Icon className="size-4" />
          </div>
          <div className="min-w-0">
            <h2 className="truncate text-sm font-semibold leading-tight sm:text-base">
              {t(asset.title, locale)}
            </h2>
            <div className="mt-1 flex flex-wrap items-center gap-1.5">
              {chapter && (
                <span className="rounded-full border bg-muted px-1.5 py-0.5 text-[9px] font-semibold text-muted-foreground">
                  {chapter}
                </span>
              )}
              {asset.scope && <ScopeBadge scope={asset.scope} />}
              <span className="truncate text-xs text-muted-foreground">
                {[
                  courseCode ?? asset.courseCode,
                  t(style.label, locale),
                  meta,
                  paged ? `${index + 1} / ${items.length}` : "",
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </span>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          {zoomable && (
            <div className="hidden items-center gap-1 rounded-full border bg-card p-1 sm:flex">
              <button
                type="button"
                onClick={() => zoomBy(1 / 1.4)}
                aria-label={t(L.zoomOut, locale)}
                className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <Minus className="size-3.5" />
              </button>
              <span className="min-w-10 text-center text-[11px] font-medium tabular-nums text-muted-foreground">
                {Math.round(transform.scale * 100)}%
              </span>
              <button
                type="button"
                onClick={() => zoomBy(1.4)}
                aria-label={t(L.zoomIn, locale)}
                className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <Plus className="size-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setTransform(IDENTITY)}
                aria-label={t(L.resetZoom, locale)}
                className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <RotateCcw className="size-3.5" />
              </button>
            </div>
          )}

          {asset.fileType !== "md" && (
            <a
              href={asset.url}
              download={asset.fileName}
              aria-label={`${t(L.download, locale)}: ${asset.fileName}`}
              className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              <Download className="size-3.5" />
              <span className="hidden sm:inline">{t(L.download, locale)}</span>
            </a>
          )}

          <button
            type="button"
            onClick={toggleFullscreen}
            aria-label={t(isFullscreen ? L.exitFullscreen : L.fullscreen, locale)}
            aria-pressed={isFullscreen}
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            {isFullscreen ? <Minimize className="size-4" /> : <Maximize className="size-4" />}
          </button>

          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label={t(L.closePreview, locale)}
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>
      </header>

      {/* Stage */}
      <div
        ref={stageRef}
        className="relative min-h-0 flex-1 overflow-hidden bg-muted/40"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onDoubleClick={() => zoomable && setTransform(IDENTITY)}
        style={{
          cursor: zoomable
            ? transform.scale > MIN_SCALE
              ? dragging
                ? "grabbing"
                : "grab"
              : "zoom-in"
            : undefined,
        }}
      >
        {asset.fileType === "pdf" && (
          <iframe
            // Keyed so paging between PDFs remounts the viewer instead of
            // leaving the previous document's scroll position behind.
            key={asset.url}
            src={asset.url}
            title={t(asset.title, locale)}
            // min-h ensures the iframe is never squashed to zero on short
            // viewports while flex-1 on the stage still fills whatever remains.
            className="h-full min-h-[60vh] w-full border-0 bg-white"
          />
        )}

        {asset.fileType === "file" && (
          // Logisim circuits, spreadsheets and the like: nothing to preview
          // inline, so the stage becomes a plain hand-off to the download.
          <div className="flex size-full flex-col items-center justify-center gap-3 p-8 text-center">
            <FileDown className="size-10 text-muted-foreground" strokeWidth={1.5} />
            <p className="text-sm font-medium text-foreground">
              {t(L.noPreview, locale)}
            </p>
            <p className="text-xs text-muted-foreground">{asset.fileName}</p>
          </div>
        )}

        {asset.fileType === "image" && (
          // No extra padding — the image itself has a shadow and the stage
          // bg provides visual separation, so the image fills the full stage.
          <div className="flex size-full items-center justify-center overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={asset.url}
              alt={t(asset.title, locale)}
              draggable={false}
              className="max-h-full max-w-full select-none object-contain"
              style={{
                transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
                transition: dragging ? "none" : "transform 120ms ease-out",
              }}
            />
          </div>
        )}

        {asset.fileType === "md" && (
          <div className="mx-auto flex h-full max-w-lg flex-col items-center justify-center gap-4 px-6 text-center">
            <div className="flex size-14 items-center justify-center rounded-2xl border shelf-pill text-primary">
              <Library className="size-6" />
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">{t(L.mdHint, locale)}</p>
          </div>
        )}

        {paged && (
          <>
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label={t(L.prev, locale)}
              className={`${arrowClass} left-3`}
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              aria-label={t(L.next, locale)}
              className={`${arrowClass} right-3`}
            >
              <ChevronRight className="size-5" />
            </button>
          </>
        )}

        {zoomable && (
          <p className="pointer-events-none absolute inset-x-0 bottom-3 text-center text-[11px] text-muted-foreground">
            {t(L.panHint, locale)}
          </p>
        )}
      </div>

      {/* Footer — kept compact so as much vertical space as possible goes to
          the content stage. Description is shown on one line only. */}
      <footer className="shrink-0 border-t bg-card/80 px-4 py-2 sm:px-6">
        <div className="flex flex-wrap items-center gap-2">
          {asset.description && (
            <p className="mr-auto line-clamp-1 text-xs leading-relaxed text-muted-foreground">
              {t(asset.description, locale)}
            </p>
          )}
          {asset.fileType === "md" ? (
            <Button asChild size="sm" className="gap-1.5 rounded-full">
              <Link href={asset.url}>
                <Eye className="size-3.5" />
                {t(L.viewContent, locale)}
              </Link>
            </Button>
          ) : (
            <Button asChild size="sm" variant="outline" className="gap-1.5 rounded-full">
              <a href={asset.url} target="_blank" rel="noreferrer">
                <Maximize2 className="size-3.5" />
                {t(L.openInTab, locale)}
              </a>
            </Button>
          )}
          <span className="hidden truncate font-mono text-[11px] text-muted-foreground sm:inline">
            {asset.fileName}
          </span>
        </div>
      </footer>
      </div>
    </div>
  );
}

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
        href={asset.url}
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
          href={asset.url}
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
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [scope, setScope] = useState<ScopeFilter>("all");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [activeChapter, setActiveChapter] = useState<number | null>(null);
  const [layout, setLayout] = useState<LayoutMode>("gallery");
  const [openStacks, setOpenStacks] = useState<ReadonlySet<string>>(new Set());
  const [preview, setPreview] = useState<Preview | null>(null);

  // Category is derived, so resolve it once per asset rather than on every
  // keystroke through the filter.
  const shelved = useMemo(
    () => assets.map((asset) => ({ asset, category: resolveCategory(asset) })),
    [assets],
  );

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

  // Chapters this shelf actually carries. Only assets that state one appear;
  // material with no chapter survives every chapter filter rather than being
  // hidden by a cut it never claimed to belong to.
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
          // Searching the stack's name has to reach its pages, or "สมุดจด"
          // would hide the very set it names.
          (group ? t(group, locale).toLowerCase().includes(query) : false)
        );
      })
      .map(({ asset }) => asset);
  }, [shelved, search, filter, activeTag, activeChapter, scope, locale]);

  /**
   * Collapse each surviving scan run into one entry, in the position of its
   * first page. A run reduced to a single page by filtering is left as a plain
   * card — a stack of one is just a card with extra chrome.
   */
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

  /**
   * Entries split by milestone, in reading order: what you revise first, then
   * what comes after it, then the material that never stops applying. Only
   * used when nothing narrower is selected — once a scope is chosen the grid
   * is already one section and a heading would just repeat the control.
   */
  const sections = useMemo(() => {
    if (!scoped || scope !== "all") return null;
    const order: ScopeBucket[] = ["midterm", "final", "term"];
    return order
      .map((bucket) => ({
        bucket,
        entries: entries.filter((entry) => entryScope(entry) === bucket),
      }))
      .filter((section) => section.entries.length > 0);
  }, [entries, scope, scoped]);

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
  };

  const filtersActive =
    search !== "" || filter !== "all" || activeTag !== null || activeChapter !== null || scope !== "all";
  /** True when something other than the milestone is doing the filtering. */
  const filtersNarrowed =
    search !== "" || filter !== "all" || activeTag !== null || activeChapter !== null;

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

  const renderEntries = (list: GalleryEntry[]) =>
    layout === "list" ? renderList(list) : renderGrid(list);

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

      {/* Controls */}
      <div className="mb-6 space-y-3">
        {/* Exam milestone. Sits above search and the category chips because it
            is the coarsest cut a student makes: which exam am I revising for. */}
        {scoped && (
          <div
            role="group"
            aria-label={t(L.examScope, locale)}
            className="flex w-full gap-1 rounded-full border bg-card p-1 sm:w-auto sm:inline-flex"
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
                  className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold transition-colors sm:flex-none sm:px-4 ${
                    active
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {Icon && <Icon className="size-3.5" />}
                  <span className="truncate">{label}</span>
                  <span className="tabular-nums opacity-70">{total}</span>
                </button>
              );
            })}
          </div>
        )}

        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              id="library-search"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={t(L.searchPlaceholder, locale)}
              className="w-full rounded-full border bg-card py-2.5 pl-10 pr-4 text-sm transition-shadow placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div className="flex shrink-0 items-center gap-0.5 rounded-full border bg-card p-1">
            {(
              [
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
                className={`rounded-full p-2 transition-colors ${
                  layout === mode
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="size-4" />
              </button>
            ))}
          </div>
        </div>

        {/* Category chips */}
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
              filter === "all"
                ? "border-primary bg-primary text-primary-foreground"
                : "bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
            }`}
          >
            {t(L.filterAll, locale)} · {assets.length}
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
                className={`${style.shelf} inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "shelf-pill text-primary hover:brightness-95"
                }`}
              >
                <Icon className="size-3" />
                {t(style.label, locale)} · {counts[category]}
              </button>
            );
          })}
        </div>

        {/* Chapter — the cut a student actually thinks in ("what did week 3
            cover"), which the shelf could not offer until assets carried one. */}
        {allChapters.length > 1 && (
          <div className="flex items-center gap-2">
            <span className="shrink-0 text-[11px] font-medium text-muted-foreground">
              {t(L.chapters, locale)}
            </span>
            <div className="flex flex-1 gap-1.5 overflow-x-auto pb-1 [scrollbar-width:thin]">
              {allChapters.map((chapter) => (
                <button
                  key={chapter}
                  type="button"
                  onClick={() =>
                    setActiveChapter(activeChapter === chapter ? null : chapter)
                  }
                  className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[11px] font-medium tabular-nums transition-colors ${
                    activeChapter === chapter
                      ? "border-primary bg-primary text-primary-foreground"
                      : "bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
                  }`}
                >
                  {chapter}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Topic tags — the finer cut, kept on its own scrollable line so the
            category chips above stay the primary control on a phone. */}
        {allTags.length > 1 && (
          <div className="flex items-center gap-2">
            <span className="shrink-0 text-[11px] font-medium text-muted-foreground">
              {t(L.topics, locale)}
            </span>
            <div className="flex flex-1 gap-1.5 overflow-x-auto pb-1 [scrollbar-width:thin]">
              {allTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                  className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[11px] font-medium transition-colors ${
                    activeTag === tag
                      ? "border-foreground bg-foreground text-background"
                      : "bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
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
        renderEntries(entries)
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
