"use client";

import Link from "next/link";
import { Download, Eye, Images, Layers } from "lucide-react";
import { assetDownloadUrl } from "@/lib/library/asset-url";
import { useLocale, t, type LText } from "@/lib/i18n";
import { formatBytes, resolveCategory, type SubjectAsset } from "@/lib/library/subject-library-ui";
import { ScopeBadge, StatusBadges } from "./badges";
import { CATEGORY, L, metaLine } from "./types";

/** One row of the compact list — same actions, one line, scannable by name. */
export function CompactRow({
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

/** A stack in compact list mode: one row for the whole run. */
export function CompactStackRow({
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
  const isImageStack = assets.every((a) => a.fileType === "image");
  const StackIcon = isImageStack ? Images : (style.icon ?? Layers);
  const countLabel = isImageStack
    ? t(L.images, locale)
    : locale === "th"
      ? "ฉบับ"
      : "editions";

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
        <StackIcon className="size-4 shrink-0 text-muted-foreground" />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[13px] font-medium">{t(title, locale)}</span>
          <span className="block truncate text-[11px] text-muted-foreground">
            {[
              code,
              t(style.label, locale),
              `${assets.length} ${countLabel}`,
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
