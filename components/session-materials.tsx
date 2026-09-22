"use client";

import {
  Download,
  Eye,
  ExternalLink,
  FileText,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocale, t, type LText } from "@/lib/i18n";
import { assetDownloadUrl } from "@/lib/asset-url";
import { formatBytes, type SubjectAsset, type AssetCategory } from "@/lib/subject-library-ui";
import { CATEGORY, ScopeBadge } from "@/components/preview-modal";

export interface SessionDocumentItem {
  title: string;
  pages?: string;
  fileName: string;
  matchedAsset?: SubjectAsset;
}

interface SessionMaterialsDeckProps {
  items: SessionDocumentItem[];
  courseCode?: string;
  onOpenPreview?: (asset: SubjectAsset) => void;
}

const L = {
  sectionTitle: { th: "เอกสารและสื่อการเรียนประจำคาบ", en: "Session Documents & Materials" },
  filesCount: { th: "ไฟล์", en: "files" },
  colName: { th: "ชื่อเอกสาร", en: "Name" },
  colCategory: { th: "หมวดหมู่", en: "Category" },
  colScope: { th: "ช่วงสอบ", en: "Scope" },
  colPages: { th: "หน้า", en: "Pages" },
  colSize: { th: "ขนาด", en: "Size" },
  colActions: { th: "การดำเนินการ", en: "Actions" },
  preview: { th: "ดูตัวอย่าง", en: "Preview" },
  download: { th: "ดาวน์โหลด", en: "Download" },
  openInTab: { th: "เปิดในแท็บใหม่", en: "Open in new tab" },
  pages: { th: "หน้า", en: "pages" },
} satisfies Record<string, LText>;

function inferCategory(fileName: string, title: string): AssetCategory {
  const f = fileName.toLowerCase();
  const tStr = title.toLowerCase();
  if (f.includes("-lec-") || f.includes("lecture") || tStr.includes("สไลด์") || tStr.includes("บรรยาย")) {
    return "lecture";
  }
  if (f.includes("-lab-") || f.includes("lab") || tStr.includes("ใบงาน") || tStr.includes("แล็บ")) {
    return "exercise";
  }
  if (f.includes("-ref-") || f.includes("hardware") || f.includes("component") || tStr.includes("อุปกรณ์") || tStr.includes("อ้างอิง")) {
    return "reference";
  }
  if (f.includes("summary") || tStr.includes("สรุป")) {
    return "cheatsheet";
  }
  return "lecture";
}

export function SessionMaterialsDeck({
  items,
  courseCode,
  onOpenPreview,
}: SessionMaterialsDeckProps) {
  const { locale } = useLocale();

  return (
    <section className="brand-shelf my-5 not-prose">
      {/* Header bar */}
      <div className="mb-2.5 flex items-center justify-between gap-2 px-0.5">
        <div className="flex items-center gap-2">
          <div className="flex size-6 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Layers className="size-3.5" />
          </div>
          <h3 className="text-xs font-semibold text-foreground sm:text-sm">
            {t(L.sectionTitle, locale)}
          </h3>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
          {items.length} {t(L.filesCount, locale)}
        </span>
      </div>

      {/* Mobile Card View (shown on < sm) */}
      <div className="sm:hidden space-y-2.5">
        {items.map((item, idx) => {
          const categoryKey = item.matchedAsset?.category ?? inferCategory(item.fileName, item.title);
          const style = CATEGORY[categoryKey] ?? CATEGORY.lecture;
          const Icon = style.icon;

          const effectiveAsset: SubjectAsset = item.matchedAsset ?? {
            id: item.fileName,
            title: { th: item.title, en: item.title },
            description: { th: item.title, en: item.title },
            tags: [],
            category: categoryKey,
            fileType: item.fileName.endsWith(".pdf") ? "pdf" : "file",
            url: item.fileName,
            fileName: item.fileName,
            pages: item.pages ? parseInt(item.pages, 10) || undefined : undefined,
          };

          const canPreview = Boolean(
            effectiveAsset.url &&
              effectiveAsset.url.startsWith("http") &&
              effectiveAsset.fileType === "pdf",
          );
          const downloadUrl = effectiveAsset.url.startsWith("http")
            ? assetDownloadUrl(effectiveAsset.url, effectiveAsset.fileName)
            : undefined;

          const pagesCount =
            effectiveAsset.pages ??
            (item.pages ? parseInt(item.pages, 10) || undefined : undefined);

          return (
            <div
              key={`mobile-${item.fileName}-${idx}`}
              className={`${style.shelf} relative overflow-hidden rounded-2xl border bg-card p-3 shadow-2xs`}
            >
              <div
                aria-hidden
                className="shelf-accent absolute left-0 top-0 bottom-0 w-1"
              />

              <div className="pl-1.5 space-y-2.5">
                {/* Category, Scope & Meta */}
                <div className="flex items-center justify-between gap-1.5 flex-wrap">
                  <span
                    className={`${style.shelf} shelf-pill inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium text-primary`}
                  >
                    <Icon className="size-3" />
                    {t(style.label, locale)}
                  </span>

                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                    {effectiveAsset.scope && <ScopeBadge scope={effectiveAsset.scope} />}
                    {pagesCount && (
                      <span className="inline-flex items-center gap-0.5">
                        <FileText className="size-3" />
                        {pagesCount} {t(L.pages, locale)}
                      </span>
                    )}
                    {effectiveAsset.sizeBytes && (
                      <span className="font-mono">{formatBytes(effectiveAsset.sizeBytes)}</span>
                    )}
                  </div>
                </div>

                {/* Title and Filename */}
                {canPreview && onOpenPreview ? (
                  <button
                    type="button"
                    onClick={() => onOpenPreview(effectiveAsset)}
                    className="block text-left w-full group/title cursor-pointer focus-visible:outline-none"
                  >
                    <p className="text-xs sm:text-sm font-semibold text-foreground group-hover/title:text-primary transition-colors line-clamp-2">
                      {item.title}
                    </p>
                    <p className="font-mono text-[10px] text-muted-foreground truncate mt-0.5">
                      {item.fileName}
                    </p>
                  </button>
                ) : (
                  <div>
                    <p className="text-xs sm:text-sm font-semibold text-foreground line-clamp-2">
                      {item.title}
                    </p>
                    <p className="font-mono text-[10px] text-muted-foreground truncate mt-0.5">
                      {item.fileName}
                    </p>
                  </div>
                )}

                {/* Touch Actions */}
                <div className="flex items-center gap-1.5 pt-2 border-t border-border/40">
                  {canPreview && onOpenPreview && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => onOpenPreview(effectiveAsset)}
                      className="h-8 px-2.5 text-xs gap-1.5 rounded-xl flex-1 shadow-2xs cursor-pointer"
                    >
                      <Eye className="size-3.5 text-primary" />
                      <span>{t(L.preview, locale)}</span>
                    </Button>
                  )}

                  {downloadUrl && (
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="h-8 px-2.5 text-xs gap-1.5 rounded-xl flex-1 shadow-2xs"
                    >
                      <a href={downloadUrl} download={effectiveAsset.fileName}>
                        <Download className="size-3.5 text-muted-foreground" />
                        <span>{t(L.download, locale)}</span>
                      </a>
                    </Button>
                  )}

                  {effectiveAsset.url && effectiveAsset.url.startsWith("http") && (
                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 rounded-xl text-muted-foreground shrink-0"
                    >
                      <a
                        href={effectiveAsset.url}
                        target="_blank"
                        rel="noreferrer"
                        title={t(L.openInTab, locale)}
                      >
                        <ExternalLink className="size-3.5" />
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop Table view matching the /library style */}
      <div className="hidden sm:block overflow-hidden rounded-2xl border bg-card shadow-xs">
        <div className="overflow-x-auto [scrollbar-width:thin]">
          <table className="w-full min-w-[580px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b bg-muted/40 text-xs font-semibold text-muted-foreground select-none">
                <th scope="col" className="py-3 pl-4 pr-3">
                  {t(L.colName, locale)}
                </th>
                <th scope="col" className="py-3 px-3 whitespace-nowrap">
                  {t(L.colCategory, locale)}
                </th>
                <th scope="col" className="py-3 px-3 whitespace-nowrap">
                  {t(L.colScope, locale)}
                </th>
                <th scope="col" className="py-3 px-3 whitespace-nowrap">
                  {t(L.colPages, locale)}
                </th>
                <th scope="col" className="py-3 px-3 whitespace-nowrap">
                  {t(L.colSize, locale)}
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
              {items.map((item, idx) => {
                const categoryKey = item.matchedAsset?.category ?? inferCategory(item.fileName, item.title);
                const style = CATEGORY[categoryKey] ?? CATEGORY.lecture;
                const Icon = style.icon;

                const effectiveAsset: SubjectAsset = item.matchedAsset ?? {
                  id: item.fileName,
                  title: { th: item.title, en: item.title },
                  description: { th: item.title, en: item.title },
                  tags: [],
                  category: categoryKey,
                  fileType: item.fileName.endsWith(".pdf") ? "pdf" : "file",
                  url: item.fileName,
                  fileName: item.fileName,
                  pages: item.pages ? parseInt(item.pages, 10) || undefined : undefined,
                };

                const canPreview = Boolean(
                  effectiveAsset.url &&
                    effectiveAsset.url.startsWith("http") &&
                    effectiveAsset.fileType === "pdf",
                );
                const downloadUrl = effectiveAsset.url.startsWith("http")
                  ? assetDownloadUrl(effectiveAsset.url, effectiveAsset.fileName)
                  : undefined;

                const pagesCount =
                  effectiveAsset.pages ??
                  (item.pages ? parseInt(item.pages, 10) || undefined : undefined);

                return (
                  <tr
                    key={`${item.fileName}-${idx}`}
                    className={`${style.shelf} group transition-colors hover:bg-muted/35`}
                  >
                    {/* Name */}
                    <td className="py-2.5 pl-4 pr-3 max-w-[240px] sm:max-w-[320px] md:max-w-[420px]">
                      <div className="flex items-center gap-2.5">
                        <span
                          aria-hidden
                          className="shelf-accent h-7 w-1 shrink-0 rounded-full"
                        />
                        {canPreview && onOpenPreview ? (
                          <button
                            type="button"
                            onClick={() => onOpenPreview(effectiveAsset)}
                            className="flex min-w-0 flex-1 items-center gap-2 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 cursor-pointer"
                          >
                            <Icon className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
                            <div className="min-w-0 flex-1">
                              <span className="block truncate text-sm font-medium text-foreground transition-colors group-hover:text-primary">
                                {item.title}
                              </span>
                              <span className="block truncate font-mono text-[11px] text-muted-foreground">
                                {item.fileName}
                              </span>
                            </div>
                          </button>
                        ) : (
                          <div className="flex min-w-0 flex-1 items-center gap-2">
                            <Icon className="size-4 shrink-0 text-muted-foreground" />
                            <div className="min-w-0 flex-1">
                              <span className="block truncate text-sm font-medium text-foreground">
                                {item.title}
                              </span>
                              <span className="block truncate font-mono text-[11px] text-muted-foreground">
                                {item.fileName}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <span
                        className={`${style.shelf} shelf-pill inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium text-primary`}
                      >
                        <Icon className="size-3" />
                        {t(style.label, locale)}
                      </span>
                    </td>

                    {/* Scope */}
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      {effectiveAsset.scope ? (
                        <ScopeBadge scope={effectiveAsset.scope} />
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>

                    {/* Pages */}
                    <td className="py-2.5 px-3 whitespace-nowrap tabular-nums text-xs text-muted-foreground">
                      {pagesCount ? (
                        <span className="inline-flex items-center gap-1">
                          <FileText className="size-3 text-muted-foreground/70" />
                          {pagesCount} {t(L.pages, locale)}
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>

                    {/* Size */}
                    <td className="py-2.5 px-3 whitespace-nowrap tabular-nums text-xs text-muted-foreground">
                      {effectiveAsset.sizeBytes ? formatBytes(effectiveAsset.sizeBytes) : "—"}
                    </td>

                    {/* Actions */}
                    <td className="sticky right-0 z-10 w-28 whitespace-nowrap bg-card/95 backdrop-blur-xs py-2.5 pl-2 pr-4 text-right shadow-[-6px_0_10px_-4px_rgba(0,0,0,0.06)]">
                      <div className="flex items-center justify-end gap-1">
                        {canPreview && onOpenPreview && (
                          <button
                            type="button"
                            onClick={() => onOpenPreview(effectiveAsset)}
                            aria-label={t(L.preview, locale)}
                            title={t(L.preview, locale)}
                            className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-primary cursor-pointer"
                          >
                            <Eye className="size-3.5" />
                          </button>
                        )}

                        {downloadUrl && (
                          <a
                            href={downloadUrl}
                            download={effectiveAsset.fileName}
                            aria-label={`${t(L.download, locale)}: ${effectiveAsset.fileName}`}
                            title={t(L.download, locale)}
                            className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-primary"
                          >
                            <Download className="size-3.5" />
                          </a>
                        )}

                        {effectiveAsset.url && effectiveAsset.url.startsWith("http") && (
                          <a
                            href={effectiveAsset.url}
                            target="_blank"
                            rel="noreferrer"
                            aria-label={t(L.openInTab, locale)}
                            title={t(L.openInTab, locale)}
                            className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-primary"
                          >
                            <ExternalLink className="size-3.5" />
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
