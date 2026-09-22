"use client";

import { Eye } from "lucide-react";
import { useLocale, t } from "@/lib/i18n";
import { resolveCategory, type SubjectAsset } from "@/lib/subject-library-ui";
import { ScopeBadge, StatusBadges } from "./badges";
import { CardActions } from "./card-actions";
import {
  CATEGORY,
  DEFERRED,
  FILE_TYPE_LABEL,
  L,
  metaLine,
} from "./types";

/**
 * A document rendered as a book on a shelf: a coloured spine down the binding
 * edge, a ruled cover face carrying the course badge and title, and the page
 * count and file size printed along the bottom the way a jacket does.
 */
export function BookCover({
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
export function ImageTile({
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
