"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import Link from "next/link";
import {
  CalendarRange,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  FileDown,
  FileText,
  FlaskConical,
  Flag,
  Library,
  Maximize,
  Maximize2,
  Minimize,
  Minus,
  Milestone,
  NotebookPen,
  Plus,
  RotateCcw,
  ScrollText,
  Sigma,
  Table2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocale, t, type LText } from "@/lib/i18n";
import { assetDownloadUrl } from "@/lib/asset-url";
import {
  formatBytes,
  resolveCategory,
  SCOPE_SHORT,
  type AssetCategory,
  type AssetScope,
  type SubjectAsset,
} from "@/lib/subject-library-ui";

export interface Preview {
  items: SubjectAsset[];
  index: number;
}

export interface CategoryStyle {
  label: LText;
  icon: typeof FileText;
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

export const SCOPE_ICON: Record<AssetScope | "term", typeof Milestone> = {
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

export function ScopeBadge({
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

const CHAPTER_TAG = /^(ch\.|บทที่|week|unit|lecture\s|สัปดาห์)/i;

export function chapterTag(asset: SubjectAsset): string | undefined {
  return asset.tags.find((tag) => CHAPTER_TAG.test(tag)) ?? asset.tags[0];
}

const L = {
  noPreview: {
    th: "ไฟล์นี้เปิดดูในเบราว์เซอร์ไม่ได้ — ดาวน์โหลดเพื่อเปิด",
    en: "This file type can't be previewed in the browser — download to open it.",
  },
  download: { th: "ดาวน์โหลด", en: "Download" },
  viewContent: { th: "ดูเนื้อหา", en: "View Content" },
  closePreview: { th: "ปิดหน้าต่างตัวอย่าง", en: "Close preview" },
  openInTab: { th: "เปิดในแท็บใหม่", en: "Open in new tab" },
  pages: { th: "หน้า", en: "pages" },
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

export function metaLine(asset: SubjectAsset, locale: "th" | "en"): string {
  const parts: string[] = [];
  if (asset.pages) parts.push(`${asset.pages} ${t(L.pages, locale)}`);
  if (asset.sizeBytes) parts.push(formatBytes(asset.sizeBytes));
  return parts.join(" · ");
}

interface Transform {
  scale: number;
  x: number;
  y: number;
}

const IDENTITY: Transform = { scale: 1, x: 0, y: 0 };
const MIN_SCALE = 1;
const MAX_SCALE = 6;

const clampScale = (scale: number) => Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale));

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
export function PreviewModal({
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

  const [shownIndex, setShownIndex] = useState(index);
  if (shownIndex !== index) {
    setShownIndex(index);
    setTransform(IDENTITY);
  }

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
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

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || !zoomable) return;

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      setTransform((current) => {
        const next = clampScale(current.scale * (event.deltaY < 0 ? 1.12 : 1 / 1.12));
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
                href={assetDownloadUrl(asset.url, asset.fileName)}
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
              key={asset.url}
              src={asset.url}
              title={t(asset.title, locale)}
              className="h-full min-h-[60vh] w-full border-0 bg-white"
            />
          )}

          {asset.fileType === "file" && (
            <div className="flex size-full flex-col items-center justify-center gap-3 p-8 text-center">
              <FileDown className="size-10 text-muted-foreground" strokeWidth={1.5} />
              <p className="text-sm font-medium text-foreground">
                {t(L.noPreview, locale)}
              </p>
              <p className="text-xs text-muted-foreground">{asset.fileName}</p>
            </div>
          )}

          {asset.fileType === "image" && (
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

        {/* Footer */}
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
