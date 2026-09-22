"use client";

import { Fragment, useState } from "react";
import Link from "next/link";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Check,
  ChevronRight,
  Copy,
  Download,
  Eye,
  Images,
  Layers,
} from "lucide-react";
import { assetDownloadUrl } from "@/lib/library/asset-url";
import { useLocale, t } from "@/lib/i18n";
import { formatBytes, resolveCategory, type SubjectAsset } from "@/lib/library/subject-library-ui";
import { ScopeBadge, StatusBadges } from "./badges";
import {
  CATEGORY,
  chapterTag,
  FILE_TYPE_LABEL,
  L,
  metaLine,
  shortDesc,
  type GalleryEntry,
  type SortColumn,
  type SortDirection,
} from "./types";

export function SubjectLibraryTable({
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
                const isImageStack = entry.assets.every(
                  (a) => a.fileType === "image",
                );
                const StackIcon = isImageStack ? Images : (style.icon ?? Layers);
                const countLabel = isImageStack
                  ? t(L.images, locale)
                  : locale === "th"
                    ? "ฉบับ"
                    : "editions";

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
                            <StackIcon className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
                            <div className="min-w-0 flex-1">
                              <span className="block truncate text-sm font-medium text-foreground transition-colors group-hover:text-primary">
                                {t(entry.title, locale)}
                              </span>
                              <span className="block truncate text-[11px] text-muted-foreground">
                                {entry.assets.length} {countLabel}
                              </span>
                            </div>
                          </button>
                        </div>
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <span
                          className={`${style.shelf} shelf-pill inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium text-primary`}
                        >
                          <StackIcon className="size-3" />
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
                          `${entry.assets.length} ${countLabel}`,
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
                                <StatusBadges asset={asset} />
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
