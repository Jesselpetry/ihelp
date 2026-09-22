"use client";

import { Download, Eye, Images, Layers } from "lucide-react";
import { assetDownloadUrl } from "@/lib/library/asset-url";
import { useLocale, t, type LText } from "@/lib/i18n";
import { formatBytes, resolveCategory, type SubjectAsset } from "@/lib/library/subject-library-ui";
import { ScopeBadge, StatusBadges } from "./badges";
import { CATEGORY, DEFERRED, L } from "./types";

/**
 * A run of scanned pages or a group of multi-version documents, drawn as a
 * physical stack: two offset sheets behind the top one.
 */
export function PhotoStack({
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
  const isImageStack = assets.every((a) => a.fileType === "image");
  const Icon = isImageStack ? Images : (style.icon ?? Layers);
  const countLabel = isImageStack ? t(L.images, locale) : (locale === "th" ? "ฉบับ" : "editions");

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
          {isImageStack ? (
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
          ) : (
            <div className="relative aspect-[4/3] flex flex-col justify-between overflow-hidden bg-gradient-to-br from-muted/70 via-card to-muted/40 p-4 border-b">
              <div className="flex items-start justify-between">
                <div className="rounded-xl border border-primary/20 bg-primary/10 p-2.5 text-primary shadow-xs">
                  <Icon className="size-6" />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-1">
                  <span className="shelf-pill inline-flex items-center rounded-full border px-1.5 py-0.5 text-[9px] font-semibold text-primary">
                    {t(style.label, locale)}
                  </span>
                  {cover.scope && <ScopeBadge scope={cover.scope} />}
                </div>
                <p className="line-clamp-2 text-xs font-semibold text-foreground text-left">
                  {t(title, locale)}
                </p>
              </div>
            </div>
          )}

          {isImageStack && (
            <span
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/85 via-black/40 to-transparent"
            />
          )}

          <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-black/65 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm">
            {isImageStack ? <Images className="size-3" /> : <Layers className="size-3" />}
            {assets.length}
          </span>
          {code && (
            <span className="absolute left-2 top-2 rounded-md bg-black/60 px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-white backdrop-blur-sm">
              {code}
            </span>
          )}

          {isImageStack && (
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
                  {assets.length} {countLabel}
                  {bytes > 0 && ` · ${formatBytes(bytes)}`}
                </span>
              </div>
            </div>
          )}
        </button>
      </div>

      {!isImageStack && (
        <div className="mt-1 flex items-center justify-between px-1 text-[10px] text-muted-foreground tabular-nums">
          <span>
            {assets.length} {countLabel}
          </span>
          {bytes > 0 && <span>{formatBytes(bytes)}</span>}
        </div>
      )}

      <button
        type="button"
        onClick={onToggle}
        aria-expanded={expanded}
        className="mt-1.5 inline-flex items-center justify-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
      >
        {isImageStack ? <Images className="size-3" /> : <Layers className="size-3" />}
        {isImageStack
          ? t(expanded ? L.collapse : L.expand, locale)
          : t(expanded ? L.collapseDocs : L.expandDocs, locale)}
      </button>
    </article>
  );
}

/**
 * The opened stack: every page as a small thumbnail or edition card. Spans the whole grid row
 * so it reads as one contact sheet rather than more loose cards.
 */
export function StackSheet({
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
  const isImageStack = assets.every((a) => a.fileType === "image");
  const countLabel = isImageStack ? t(L.images, locale) : (locale === "th" ? "ฉบับ" : "editions");

  return (
    <section
      className="rounded-2xl border bg-muted/25 p-3"
      style={{ gridColumn: "1 / -1" }}
    >
      <header className="mb-2.5 flex items-center justify-between gap-3">
        <h3 className="truncate text-xs font-semibold">
          {t(title, locale)}{" "}
          <span className="font-normal text-muted-foreground">
            · {assets.length} {countLabel}
          </span>
        </h3>
        <button
          type="button"
          onClick={onCollapse}
          className="shrink-0 rounded-full border bg-card px-2.5 py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
        >
          {isImageStack ? t(L.collapse, locale) : t(L.collapseDocs, locale)}
        </button>
      </header>

      {isImageStack ? (
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
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {assets.map((asset, index) => (
            <div
              key={asset.id}
              className="flex items-center justify-between gap-3 rounded-xl border bg-card p-2.5 shadow-2xs hover:border-primary/40 transition-colors"
            >
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-mono text-[10px] text-muted-foreground">
                    #{index + 1}
                  </span>
                  <StatusBadges asset={asset} />
                  {asset.pages !== undefined && (
                    <span className="text-[10px] tabular-nums text-muted-foreground">
                      {asset.pages} {locale === "th" ? "หน้า" : "p."}
                    </span>
                  )}
                  {asset.sizeBytes !== undefined && (
                    <span className="text-[10px] tabular-nums text-muted-foreground">
                      · {formatBytes(asset.sizeBytes)}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => onOpen(index)}
                  className="block text-left text-xs font-medium text-foreground hover:text-primary transition-colors line-clamp-2"
                >
                  {t(asset.title, locale)}
                </button>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => onOpen(index)}
                  aria-label={`${t(L.preview, locale)}: ${t(asset.title, locale)}`}
                  className="rounded-full border bg-muted/40 p-1.5 text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors"
                >
                  <Eye className="size-3.5" />
                </button>
                <a
                  href={assetDownloadUrl(asset.url, asset.fileName)}
                  download={asset.fileName}
                  aria-label={`${t(L.download, locale)}: ${asset.fileName}`}
                  className="rounded-full border bg-muted/40 p-1.5 text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors"
                >
                  <Download className="size-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
