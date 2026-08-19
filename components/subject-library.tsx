"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Download,
  Eye,
  FileText,
  Image as ImageIcon,
  FileCode2,
  X,
  Search,
  Tag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocale, t, type LText } from "@/lib/i18n";
import type { SubjectAsset, AssetFileType } from "@/lib/subject-library";

interface SubjectLibraryProps {
  assets: SubjectAsset[];
  backHref: string;
  backLabel: LText;
  title: LText;
  subtitle: LText;
}

// ── File type icons & colours ─────────────────────────────────────────────────
const FILE_TYPE_CONFIG: Record<
  AssetFileType,
  { icon: typeof FileText; label: string; badgeClass: string }
> = {
  pdf: {
    icon: FileText,
    label: "PDF",
    badgeClass: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
  },
  image: {
    icon: ImageIcon,
    label: "Image",
    badgeClass: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20",
  },
  md: {
    icon: FileCode2,
    label: "Markdown",
    badgeClass: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20",
  },
};

const L: Record<string, LText> = {
  searchPlaceholder: { th: "ค้นหาทรัพยากร...", en: "Search resources..." },
  filterAll: { th: "ทั้งหมด", en: "All" },
  noResults: { th: "ไม่พบทรัพยากรที่ตรงกับคำค้นหา", en: "No resources match your search" },
  preview: { th: "ดูตัวอย่าง", en: "Preview" },
  download: { th: "ดาวน์โหลด", en: "Download" },
  viewContent: { th: "ดูเนื้อหา", en: "View Content" },
  closePreview: { th: "ปิด", en: "Close" },
  fileType: { th: "ประเภทไฟล์", en: "File type" },
  topics: { th: "หัวข้อ", en: "Topics" },
  count: { th: "รายการ", en: "items" },
};

// ── Preview Modal ─────────────────────────────────────────────────────────────
function PreviewModal({
  asset,
  onClose,
}: {
  asset: SubjectAsset;
  onClose: () => void;
}) {
  const { locale } = useLocale();
  const config = FILE_TYPE_CONFIG[asset.fileType];
  const Icon = config.icon;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={t(asset.title, locale)}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-3xl border bg-card shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b p-4 sm:p-5 shrink-0">
          <div className="flex items-start gap-3 min-w-0">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Icon className="size-4" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-semibold leading-tight truncate">
                {t(asset.title, locale)}
              </h2>
              <p className="mt-0.5 text-xs text-muted-foreground">{asset.fileName}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t(L.closePreview, locale)}
            className="shrink-0 rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Preview body */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-5 space-y-4">
          {/* Description */}
          <p className="text-sm text-foreground/80 leading-relaxed">
            {t(asset.description, locale)}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {asset.tags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="rounded-full text-[10px] font-medium"
              >
                {tag}
              </Badge>
            ))}
          </div>

          {/* Preview area */}
          {asset.fileType === "pdf" && (
            <div className="rounded-xl border overflow-hidden aspect-[4/3]">
              <iframe
                src={`${asset.url}#toolbar=0`}
                title={t(asset.title, locale)}
                className="w-full h-full"
              />
            </div>
          )}

          {asset.fileType === "image" && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={asset.url}
              alt={t(asset.title, locale)}
              className="w-full rounded-xl border object-contain max-h-96"
            />
          )}

          {asset.fileType === "md" && (
            <div className="rounded-xl border bg-muted/30 p-4 text-sm text-muted-foreground flex items-center gap-2.5">
              <FileCode2 className="size-4 text-primary shrink-0" />
              <span>
                {locale === "th"
                  ? "ไฟล์ Markdown — คลิก \"ดูเนื้อหา\" เพื่ออ่านเต็มรูปแบบ"
                  : "Markdown file — click \"View Content\" to read in full."}
              </span>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="border-t p-4 sm:p-5 shrink-0 flex gap-2 flex-wrap">
          {asset.fileType === "md" ? (
            <Button asChild className="rounded-full gap-1.5 flex-1">
              <Link href={asset.url}>
                <Eye className="size-3.5" />
                {t(L.viewContent, locale)}
              </Link>
            </Button>
          ) : (
            <>
              <Button asChild variant="outline" className="rounded-full gap-1.5">
                <a href={asset.url} target="_blank" rel="noreferrer">
                  <Eye className="size-3.5" />
                  {t(L.preview, locale)}
                </a>
              </Button>
              <Button asChild className="rounded-full gap-1.5 flex-1">
                <a href={asset.url} download={asset.fileName}>
                  <Download className="size-3.5" />
                  {t(L.download, locale)}
                </a>
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Asset Card ────────────────────────────────────────────────────────────────
function AssetCard({
  asset,
  onPreview,
}: {
  asset: SubjectAsset;
  onPreview: (asset: SubjectAsset) => void;
}) {
  const { locale } = useLocale();
  const config = FILE_TYPE_CONFIG[asset.fileType];
  const Icon = config.icon;

  return (
    <div className="group rounded-2xl border bg-card p-4 sm:p-5 shadow-sm flex flex-col gap-3 hover:border-primary/40 hover:shadow-md transition-all">
      {/* Header row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Icon className="size-4" />
          </div>
          <h3 className="text-sm font-semibold leading-tight truncate group-hover:text-primary transition-colors">
            {t(asset.title, locale)}
          </h3>
        </div>
        <Badge
          variant="outline"
          className={`rounded-full text-[10px] font-semibold shrink-0 border ${config.badgeClass}`}
        >
          {config.label}
        </Badge>
      </div>

      {/* Description */}
      <p className="text-xs text-muted-foreground leading-relaxed flex-1">
        {t(asset.description, locale)}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1">
        {asset.tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-0.5 rounded-full border px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
          >
            <Tag className="size-2.5" />
            {tag}
          </span>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-1">
        <Button
          variant="outline"
          size="sm"
          className="rounded-full gap-1.5 flex-1 text-xs"
          onClick={() => onPreview(asset)}
        >
          <Eye className="size-3" />
          {asset.fileType === "md" ? t(L.viewContent, locale) : t(L.preview, locale)}
        </Button>
        {asset.fileType !== "md" && (
          <Button
            asChild
            size="sm"
            className="rounded-full gap-1.5 text-xs"
          >
            <a href={asset.url} download={asset.fileName}>
              <Download className="size-3" />
            </a>
          </Button>
        )}
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export function SubjectLibrary({
  assets,
  backHref,
  backLabel,
  title,
  subtitle,
}: SubjectLibraryProps) {
  const { locale } = useLocale();
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [previewAsset, setPreviewAsset] = useState<SubjectAsset | null>(null);

  // Collect all unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    for (const a of assets) {
      for (const tag of a.tags) tags.add(tag);
    }
    return Array.from(tags);
  }, [assets]);

  // Filtered assets
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return assets.filter((a) => {
      const matchesSearch =
        !q ||
        t(a.title, locale).toLowerCase().includes(q) ||
        t(a.description, locale).toLowerCase().includes(q) ||
        a.tags.some((tag) => tag.toLowerCase().includes(q));
      const matchesTag = !activeTag || a.tags.includes(activeTag);
      return matchesSearch && matchesTag;
    });
  }, [assets, search, activeTag, locale]);

  return (
    <main className="mx-auto max-w-4xl px-3 sm:px-6 py-6 sm:py-10 w-full">
      {/* Back link */}
      <Link
        href={backHref}
        className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors font-medium mb-5"
      >
        <ArrowLeft className="size-3.5 sm:size-4" />
        {t(backLabel, locale)}
      </Link>

      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{t(title, locale)}</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          {t(subtitle, locale)} · {filtered.length} {t(L.count, locale)}
        </p>
      </div>

      {/* Search + filter */}
      <div className="mb-6 space-y-3">
        {/* Search bar */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t(L.searchPlaceholder, locale)}
            className="w-full rounded-full border bg-card pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow placeholder:text-muted-foreground"
            id="library-search"
          />
        </div>

        {/* Tag pills */}
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setActiveTag(null)}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
              activeTag === null
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
            }`}
          >
            {t(L.filterAll, locale)}
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                activeTag === tag
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Asset grid */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border bg-muted/20 py-16 text-center text-sm text-muted-foreground">
          {t(L.noResults, locale)}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((asset) => (
            <AssetCard
              key={asset.id}
              asset={asset}
              onPreview={setPreviewAsset}
            />
          ))}
        </div>
      )}

      {/* Preview modal */}
      {previewAsset && (
        <PreviewModal asset={previewAsset} onClose={() => setPreviewAsset(null)} />
      )}
    </main>
  );
}
