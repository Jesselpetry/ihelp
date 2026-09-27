"use client";

import Link from "next/link";
import { Download, ExternalLink, Eye } from "lucide-react";
import { assetDownloadUrl } from "@/lib/library/asset-url";
import { useLocale, t } from "@/lib/i18n";
import type { SubjectAsset } from "@/lib/library/subject-library-ui";
import { L } from "./types";

/**
 * The row under every gallery card. The primary action opens the in-app modal
 * rather than a new tab — leaving the page loses the filters and the scroll
 * position the student just set up. Download stays one click away beside it.
 */
export function CardActions({
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
      <SourceLink
        asset={asset}
        className="border px-2.5 py-1.5 hover:border-primary/40 hover:bg-transparent [&_svg]:size-3"
      />
    </div>
  );
}

/**
 * ต้นทาง — the file's original page on the course site. Rendered only for files
 * that carry a `sourceUrl`, so older-year material simply has no link rather
 * than a dead one.
 */
export function SourceLink({
  asset,
  withLabel = false,
  className = "",
}: {
  asset: SubjectAsset;
  withLabel?: boolean;
  className?: string;
}) {
  const { locale } = useLocale();
  if (!asset.sourceUrl) return null;
  return (
    <a
      href={asset.sourceUrl}
      target="_blank"
      rel="noopener noreferrer"
      title={t(L.sourceHint, locale)}
      aria-label={`${t(L.sourceHint, locale)}: ${t(asset.title, locale)}`}
      className={`inline-flex items-center gap-1 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-primary ${className}`}
    >
      <ExternalLink className="size-3.5" />
      {withLabel && <span className="text-xs font-medium">{t(L.source, locale)}</span>}
    </a>
  );
}
