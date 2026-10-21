"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  FileDown,
  Library,
  Maximize,
  Maximize2,
  Minimize,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FileActions } from "@/components/media/file-actions";
import { PdfFrame } from "@/components/media/pdf-frame";
import {
  useZoomPan,
  ZoomableImage,
  ZoomControls,
  ZoomStage,
} from "@/components/media/zoomable-image";
import { ScopeBadge } from "@/components/subject-library/badges";
import { CATEGORY, L, chapterTag, fileFacts } from "@/components/subject-library/types";
import { useLocale, t } from "@/lib/i18n";
import { resolveCategory, type SubjectAsset } from "@/lib/library/subject-library-ui";

export interface Preview {
  items: SubjectAsset[];
  index: number;
}

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
  const closeRef = useRef<HTMLButtonElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const zoom = useZoomPan(asset.fileType === "image", index);
  const paged = items.length > 1;
  // Not metaLine(): its file-name fallback would repeat what the footer shows.
  const meta = fileFacts(asset, locale);
  const chapter = chapterTag(asset);

  const step = useCallback(
    (delta: number) => {
      if (!paged) return;
      onIndexChange((index + delta + items.length) % items.length);
    },
    [paged, index, items.length, onIndexChange],
  );

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
            <ZoomControls zoom={zoom} />

            <FileActions file={asset} variant="header" />

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
        <ZoomStage zoom={zoom} className="relative min-h-0 flex-1 overflow-hidden bg-muted/40">
          {asset.fileType === "pdf" && (
            <PdfFrame src={asset.url} title={t(asset.title, locale)} />
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
            <ZoomableImage zoom={zoom} src={asset.url} alt={t(asset.title, locale)} />
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
        </ZoomStage>

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
