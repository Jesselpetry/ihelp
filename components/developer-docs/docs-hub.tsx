"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  BookOpen,
  ChevronRight,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { CourseBanner } from "@/components/course-banner";
import { TopicHeader, SURFACE } from "@/components/course-hub-shared";
import { Badge } from "@/components/ui/badge";
import { useLocale, t } from "@/lib/i18n";
import { SITE } from "@/lib/site";
import type { DevDocMeta, DevDocSection } from "@/lib/docs/dev-docs";

const L = {
  backLabel: { th: "← ดูประวัติเวอร์ชันและ Changelog", en: "← Version & Changelog" },
  hubCode: "DOCS",
  hubTitle: { th: "คลังเอกสารและสถาปัตยกรรมระบบ", en: "Developer Documentation Hub" },
  hubMeta: "iHelp Engineering · Super Library · 16 Documents",
  hubTagline: {
    th: `ศูนย์รวมเอกสารทางเทคนิค พิมพ์เขียวสถาปัตยกรรม 12 ระบบหลัก และคู่มือพัฒนาของ ${SITE.plainName}`,
    en: `Central technical documentation, master blueprints for 12 subsystems, and developer standards for ${SITE.plainName}.`,
  },
  searchPlaceholder: { th: "ค้นหาเอกสาร, ไฟล์, หรือหัวข้อ...", en: "Search docs, files, or topics..." },
  totalDocs: { th: "เอกสารทั้งหมด", en: "Total documents" },
  masterDocBadge: { th: "พิมพ์เขียวแม่บท", en: "Master Blueprint" },
  masterDocDesc: {
    th: "เอกสารแม่บทฉบับสมบูรณ์ อธิบายสถาปัตยกรรมระบบทั้ง 12 Subsystems, Data Pipelines และกฎการพัฒนา",
    en: "Master engineering blueprint covering all 12 subsystems, data pipelines, and development rules.",
  },
  openDoc: { th: "เปิดอ่านเอกสาร", en: "Read document" },
  noResults: { th: "ไม่พบเอกสารที่ตรงกับคำค้นหา", en: "No documents match your search" },
  items: { th: "ฉบับ", en: "docs" },
};

export function DocsHub({ sections }: { sections: DevDocSection[] }) {
  const { locale } = useLocale();
  const [search, setSearch] = useState("");

  const allDocs = useMemo(() => {
    return sections.flatMap((s) => s.docs.map((d) => ({ ...d, sectionTitle: s.title })));
  }, [sections]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return null;
    return allDocs.filter(
      (d) =>
        d.title.toLowerCase().includes(q) ||
        d.shortTitle.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q) ||
        d.fileName.toLowerCase().includes(q) ||
        d.slug.toLowerCase().includes(q)
    );
  }, [allDocs, search]);

  const masterDoc = useMemo(() => {
    return allDocs.find((d) => d.slug === "readme");
  }, [allDocs]);

  return (
    <main className="mx-auto max-w-5xl space-y-6 px-3 py-5 sm:px-5 sm:py-6">
      {/* ── 1. Standard Course Banner ── */}
      <CourseBanner
        backHref="/version"
        backLabel={L.backLabel}
        code={L.hubCode}
        name={L.hubTitle}
        meta={L.hubMeta}
        tagline={L.hubTagline}
      />

      {/* ── 2. Featured Master Architecture Card (If not searching) ── */}
      {!search && masterDoc && (
        <div
          className={`relative overflow-hidden rounded-2xl border border-primary/30 bg-primary/[0.04] p-4 sm:p-5 shadow-xs hover:border-primary/50 transition-all ${SURFACE}`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
            <div className="space-y-1.5 min-w-0">
              <div className="flex items-center gap-2">
                <span className="flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold shadow-xs">
                  ★
                </span>
                <Badge className="bg-primary/15 text-primary border-primary/30 text-[11px] font-semibold">
                  <Sparkles className="size-3 mr-1" />
                  {t(L.masterDocBadge, locale)}
                </Badge>
                <span className="text-xs font-mono text-muted-foreground">docs/README.md</span>
              </div>

              <h2 className="text-base sm:text-lg font-bold text-foreground">
                {masterDoc.title}
              </h2>

              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-2xl">
                {t(L.masterDocDesc, locale)}
              </p>
            </div>

            <Link
              href={`/docs/${masterDoc.slug}`}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-all"
            >
              <span>{t(L.openDoc, locale)}</span>
              <ChevronRight className="size-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* ── 3. Search and Filter Bar ── */}
      <div className="flex items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2">
          <BookOpen className="size-4 text-primary" />
          <h2 className="text-sm font-semibold text-foreground">
            {locale === "th" ? "สารบบเอกสารในคลัง" : "Documentation Catalog"}
          </h2>
          <span className="text-xs text-muted-foreground font-mono">
            ({allDocs.length})
          </span>
        </div>

        {/* Pill Search Box matching course hub */}
        <div className="relative flex items-center w-48 sm:w-64 h-8.5 rounded-full border border-border/80 bg-white shadow-2xs transition-all focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/20 dark:bg-card dark:border-white/10 dark:shadow-none">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t(L.searchPlaceholder, locale)}
            className="h-full w-full bg-transparent pl-8 pr-7 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* ── 4. Search Results OR Categorized Document Sections ── */}
      {filtered ? (
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground">
            {locale === "th"
              ? `พบ ${filtered.length} เอกสารที่ตรงกับคำค้นหา`
              : `Found ${filtered.length} matching documents`}
          </p>

          {filtered.length === 0 ? (
            <div className={`p-8 text-center ${SURFACE}`}>
              <p className="text-xs text-muted-foreground">{t(L.noResults, locale)}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filtered.map((doc, idx) => (
                <DocCard key={doc.slug} doc={doc} index={idx + 1} />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-8">
          {sections.map((section) => (
            <section key={section.id} className="space-y-3">
                <TopicHeader
                  id={section.id}
                  title={t(section.title, locale)}
                  description={section.description ? t(section.description, locale) : undefined}
                  aside={
                    <span className="text-[11px] font-mono text-muted-foreground">
                      {section.docs.length} {t(L.items, locale)}
                    </span>
                  }
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {section.docs.map((doc) => (
                    <DocCard key={doc.slug} doc={doc} index={doc.order} />
                  ))}
                </div>
              </section>
            ))}
        </div>
      )}
    </main>
  );
}

/** Individual document card styled identically to CourseWeekCard from course hubs */
function DocCard({ doc, index }: { doc: DevDocMeta; index: number }) {
  const isMaster = doc.slug === "readme";

  return (
    <Link
      href={`/docs/${doc.slug}`}
      className={`group flex items-center gap-3 px-3.5 py-3 transition-[box-shadow,background-color] hover:bg-primary/[0.03] hover:shadow-md dark:hover:bg-primary/10 no-underline ${SURFACE} ${
        isMaster ? "border-primary/40 bg-primary/[0.02]" : ""
      }`}
    >
      {/* Circular icon with index number matching CourseWeekCard */}
      <span
        className={`flex size-8.5 shrink-0 items-center justify-center rounded-full text-xs font-bold tabular-nums shadow-2xs ${
          isMaster
            ? "bg-primary text-primary-foreground"
            : "bg-primary/10 text-primary"
        }`}
      >
        {String(index).padStart(2, "0")}
      </span>

      <div className="flex min-w-0 flex-1 flex-col justify-center">
        <div className="flex items-center gap-1.5">
          <span className="truncate text-xs sm:text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
            {doc.title}
          </span>
        </div>

        {doc.description && (
          <p className="truncate text-xs text-muted-foreground/80 mt-0.5">
            {doc.description}
          </p>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <span className="hidden lg:inline text-[11px] font-mono text-muted-foreground/70">
          {doc.fileName}
        </span>
        <ChevronRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}
