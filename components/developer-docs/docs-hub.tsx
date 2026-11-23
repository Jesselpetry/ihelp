"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  ChevronRight,
  Cpu,
  FileCode2,
  FolderGit2,
  ScrollText,
  Search,
  ShieldCheck,
  Tag,
  Wrench,
  X,
  type LucideIcon,
} from "lucide-react";
import { CourseBanner } from "@/components/course-banner";
import { TopicHeader, SURFACE } from "@/components/course-hub-shared";
import { useLocale, t } from "@/lib/i18n";
import { SITE } from "@/lib/site";
import type { DevDocMeta, DevDocSection } from "@/lib/docs/dev-docs";

const SECTION_ICONS: Record<string, LucideIcon> = {
  architecture: ScrollText,
  subsystems: Cpu,
  standards: Wrench,
  design: ShieldCheck,
};

const L = {
  backLabel: { th: "← ดูประวัติเวอร์ชันและ Changelog", en: "← Version & Changelog" },
  hubCode: "DOCS",
  hubTitle: { th: "คลังเอกสารและสถาปัตยกรรมระบบ", en: "Developer Documentation Hub" },
  hubMeta: "iHelp Engineering · Super Library · 16 Documents",
  hubTagline: {
    th: `ศูนย์รวมเอกสารทางเทคนิค พิมพ์เขียวสถาปัตยกรรม 12 ระบบหลัก และคู่มือพัฒนาของ ${SITE.plainName}`,
    en: `Central technical documentation, master blueprints for 12 subsystems, and developer standards for ${SITE.plainName}.`,
  },
  searchPlaceholder: { th: "ค้นหาเอกสาร...", en: "Search docs..." },
  categories: { th: "หมวดหมู่เอกสาร", en: "Categories" },
  shortcuts: { th: "ทางลัดและคลังโค้ด", en: "Shortcuts & Repo" },
  viewChangelog: { th: "เวอร์ชันและ Changelog", en: "Version & Changelog" },
  viewGithub: { th: "GitHub Repository", en: "GitHub Repository" },
  totalDocs: { th: "เอกสารทั้งหมด", en: "Total documents" },
  noResults: { th: "ไม่พบเอกสารที่ตรงกับคำค้นหา", en: "No documents match your search" },
  items: { th: "ฉบับ", en: "docs" },
};

export function DocsHub({ sections }: { sections: DevDocSection[] }) {
  const { locale } = useLocale();
  const [search, setSearch] = useState("");
  const [activeSection, setActiveSection] = useState<string | null>(null);

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

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <main className="mx-auto max-w-5xl space-y-6 px-3 py-5 sm:px-5 sm:py-6">
      {/* ── 1. Course Banner ── */}
      <CourseBanner
        backHref="/version"
        backLabel={L.backLabel}
        code={L.hubCode}
        name={L.hubTitle}
        meta={L.hubMeta}
        tagline={L.hubTagline}
      />

      {/* ── 2. Classroom 2-Panel Layout: Sidebar (Left) + Stream (Right) ── */}
      <div className="grid gap-5 lg:grid-cols-[230px_minmax(0,1fr)] lg:gap-6 items-start">
        {/* ── Left Sidebar (Sticky like CourseSidebar) ── */}
        <aside className="space-y-4 lg:sticky lg:top-20">
          {/* Box 1: Search & Categories Navigation */}
          <div className={`${SURFACE} p-3 sm:p-3.5 space-y-3`}>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                {t(L.categories, locale)}
              </span>
              <span className="text-[10px] font-mono text-muted-foreground">
                {allDocs.length} {t(L.items, locale)}
              </span>
            </div>

            {/* Quick Search Input */}
            <div className="relative flex items-center w-full h-8 rounded-full border border-border/80 bg-background shadow-2xs transition-all focus-within:border-primary/60 focus-within:ring-1 focus-within:ring-primary/20">
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
                  <X className="size-3" />
                </button>
              )}
            </div>

            {/* Category Jump Links */}
            <nav className="space-y-1 pt-1">
              {sections.map((sec) => {
                const Icon = SECTION_ICONS[sec.id] ?? FileCode2;
                const isActive = activeSection === sec.id;
                return (
                  <button
                    key={sec.id}
                    type="button"
                    onClick={() => scrollToSection(sec.id)}
                    className={`w-full flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-left transition-colors cursor-pointer ${
                      isActive
                        ? "bg-primary/10 text-primary font-semibold"
                        : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Icon className="size-3.5 shrink-0 text-primary" />
                      <span className="truncate">{t(sec.title, locale)}</span>
                    </div>
                    <span className="text-[10px] font-mono text-muted-foreground shrink-0">
                      {sec.docs.length}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Box 2: Shortcuts */}
          <div className={`${SURFACE} p-3 sm:p-3.5 space-y-2 text-xs`}>
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block mb-2">
              {t(L.shortcuts, locale)}
            </span>

            <Link
              href="/version"
              className="flex items-center justify-between gap-2 p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Tag className="size-3.5 text-primary" />
                <span>{t(L.viewChangelog, locale)}</span>
              </div>
              <ChevronRight className="size-3 text-muted-foreground" />
            </Link>

            <a
              href={SITE.repo.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between gap-2 p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <FolderGit2 className="size-3.5 text-primary" />
                <span>{t(L.viewGithub, locale)}</span>
              </div>
              <ChevronRight className="size-3 text-muted-foreground" />
            </a>
          </div>
        </aside>

        {/* ── Right Main Stream (Single Column per row cards) ── */}
        <div className="min-w-0 space-y-6">
          {filtered ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b pb-2">
                <h2 className="text-sm font-semibold text-foreground">
                  {locale === "th"
                    ? `ผลการค้นหา (${filtered.length} รายการ)`
                    : `Search Results (${filtered.length} docs)`}
                </h2>
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="text-xs text-primary hover:underline cursor-pointer"
                >
                  {locale === "th" ? "ล้างการค้นหา" : "Clear search"}
                </button>
              </div>

              {filtered.length === 0 ? (
                <div className={`p-8 text-center ${SURFACE}`}>
                  <p className="text-xs text-muted-foreground">{t(L.noResults, locale)}</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filtered.map((doc, idx) => (
                    <DocRowCard key={doc.slug} doc={doc} index={idx + 1} />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-8">
              {sections.map((section) => {
                return (
                  <section key={section.id} id={section.id} className="space-y-3 scroll-mt-20">
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

                    {/* 1 Card per row stack */}
                    <div className="space-y-2">
                      {section.docs.map((doc) => (
                        <DocRowCard key={doc.slug} doc={doc} index={doc.order} />
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

/** Individual full-width document row card styled like CourseWeekCard */
function DocRowCard({ doc, index }: { doc: DevDocMeta; index: number }) {
  const isMaster = doc.slug === "readme";

  return (
    <Link
      href={`/docs/${doc.slug}`}
      className={`group flex items-center gap-3 px-3.5 py-3 transition-[box-shadow,background-color] hover:bg-primary/[0.03] hover:shadow-md dark:hover:bg-primary/10 no-underline ${SURFACE} ${
        isMaster ? "border-primary/40 bg-primary/[0.015]" : ""
      }`}
    >
      {/* Circular icon with 2-digit number (matching CourseWeekCard) */}
      <span
        className={`flex size-8.5 shrink-0 items-center justify-center rounded-full text-xs font-bold tabular-nums shadow-2xs ${
          isMaster
            ? "bg-primary text-primary-foreground"
            : "bg-primary/10 text-primary"
        }`}
      >
        {String(index).padStart(2, "0")}
      </span>

      {/* Content info */}
      <div className="flex min-w-0 flex-1 flex-col justify-center">
        <div className="flex items-center gap-2">
          <span className="truncate text-xs sm:text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
            {doc.title}
          </span>
          {isMaster && (
            <span className="hidden sm:inline-block rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
              Master Blueprint
            </span>
          )}
        </div>

        {doc.description && (
          <p className="truncate text-xs text-muted-foreground/80 mt-0.5">
            {doc.description}
          </p>
        )}
      </div>

      {/* Right meta badge + Chevron */}
      <div className="flex shrink-0 items-center gap-2">
        <span className="hidden sm:inline text-[11px] font-mono text-muted-foreground/70">
          docs/{doc.fileName}
        </span>
        <ChevronRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}
