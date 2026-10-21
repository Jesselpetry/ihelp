"use client";

import { FileText, Layers } from "lucide-react";
import { FileActions } from "@/components/media/file-actions";
import { ScopeBadge } from "@/components/subject-library/badges";
import { CATEGORY } from "@/components/subject-library/types";
import { useLocale, t, type LText } from "@/lib/i18n";
import { formatBytes, type SubjectAsset, type AssetCategory } from "@/lib/library/subject-library-ui";

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

/**
 * One row of the deck, resolved: the library card it matched, or a stand-in
 * built from the row's own text. The card layout (below sm) and the table (from
 * sm up) both show it, so the facts are worked out once here.
 */
function resolveItem(item: SessionDocumentItem) {
  const categoryKey = item.matchedAsset?.category ?? inferCategory(item.fileName, item.title);
  const style = CATEGORY[categoryKey] ?? CATEGORY.lecture;

  const file: SubjectAsset = item.matchedAsset ?? {
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

  // A stand-in's `url` is only its file name. Just a real link can be opened,
  // downloaded or previewed; the rest of the row still reads as a label.
  const linkable = file.url.startsWith("http");

  return {
    style,
    Icon: style.icon,
    file,
    linkable,
    canPreview: linkable && file.fileType === "pdf",
    pagesCount: file.pages ?? (item.pages ? parseInt(item.pages, 10) || undefined : undefined),
  };
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
          const { style, Icon, file, linkable, canPreview, pagesCount } = resolveItem(item);
          const openPreview = canPreview && onOpenPreview ? () => onOpenPreview(file) : undefined;

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
                    {file.scope && <ScopeBadge scope={file.scope} />}
                    {pagesCount && (
                      <span className="inline-flex items-center gap-0.5">
                        <FileText className="size-3" />
                        {pagesCount} {t(L.pages, locale)}
                      </span>
                    )}
                    {file.sizeBytes && (
                      <span className="font-mono">{formatBytes(file.sizeBytes)}</span>
                    )}
                  </div>
                </div>

                {/* Title and Filename */}
                {openPreview ? (
                  <button
                    type="button"
                    onClick={openPreview}
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
                <FileActions
                  file={linkable ? file : undefined}
                  variant="session-card"
                  onPreview={openPreview}
                />
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
                const { style, Icon, file, linkable, canPreview, pagesCount } = resolveItem(item);
                const openPreview = canPreview && onOpenPreview ? () => onOpenPreview(file) : undefined;

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
                        {openPreview ? (
                          <button
                            type="button"
                            onClick={openPreview}
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
                      {file.scope ? (
                        <ScopeBadge scope={file.scope} />
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
                      {file.sizeBytes ? formatBytes(file.sizeBytes) : "—"}
                    </td>

                    {/* Actions */}
                    <td className="sticky right-0 z-10 w-28 whitespace-nowrap bg-card/95 backdrop-blur-xs py-2.5 pl-2 pr-4 text-right shadow-[-6px_0_10px_-4px_rgba(0,0,0,0.06)]">
                      <FileActions
                        file={linkable ? file : undefined}
                        variant="session-table"
                        onPreview={openPreview}
                      />
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
