"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  FolderGit2,
  Table2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MdView } from "@/components/md-view";
import { TocSidePanel } from "@/components/toc-side-panel";
import { extractToc } from "@/lib/docs/toc";
import { useLocale, t } from "@/lib/i18n";
import { SITE } from "@/lib/site";
import type { DevDocDetail, DevDocSection } from "@/lib/docs/dev-docs";

const L = {
  hub: { th: "คลังเอกสารนักพัฒนา", en: "Developer Hub" },
  backToHub: { th: "กลับหน้ารวมเอกสาร", en: "Back to docs hub" },
  viewOnGithub: { th: "ดูบน GitHub", en: "View on GitHub" },
  prev: { th: "ก่อนหน้า", en: "Previous" },
  next: { th: "ถัดไป", en: "Next" },
  prevDoc: { th: "เอกสารก่อนหน้า", en: "Previous doc" },
  nextDoc: { th: "เอกสารถัดไป", en: "Next doc" },
  documentOutline: { th: "สารบัญในหน้านี้", en: "Outline" },
  allDocs: { th: "เอกสารทั้งหมดในคลัง", en: "All Super Library Docs" },
  index: { th: "ดูหน้ารวม", en: "Hub View" },
};

interface DocsReaderProps {
  doc: DevDocDetail;
  sections: DevDocSection[];
}

export function DocsReader({ doc, sections }: DocsReaderProps) {
  const { locale } = useLocale();
  const router = useRouter();
  const [isTocCollapsed, setIsTocCollapsed] = useState(false);
  const activePillRef = useRef<HTMLButtonElement | null>(null);

  // Flatten all documents in sequential order
  const allDocs = useMemo(() => {
    return sections.flatMap((s) => s.docs);
  }, [sections]);

  const currentIndex = useMemo(() => {
    const idx = allDocs.findIndex((d) => d.slug === doc.slug);
    return idx === -1 ? 0 : idx;
  }, [allDocs, doc.slug]);

  // Extract table of contents outline from markdown content
  const tocItems = useMemo(() => extractToc(doc.content), [doc.content]);

  // Auto-scroll active pill into view
  useEffect(() => {
    if (activePillRef.current) {
      activePillRef.current.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [doc.slug]);

  // Scroll to top on document change
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [doc.slug]);

  const goToDoc = (targetSlug: string) => {
    router.push(`/docs/${targetSlug}`);
  };

  const isFirst = currentIndex === 0;
  const isLast = currentIndex === allDocs.length - 1;

  const prevDoc = currentIndex > 0 ? allDocs[currentIndex - 1] : null;
  const nextDoc = currentIndex < allDocs.length - 1 ? allDocs[currentIndex + 1] : null;

  const githubUrl = `${SITE.repo.url}/blob/${SITE.repo.branch}/docs/${doc.fileName}`;

  return (
    <main className="mx-auto max-w-5xl xl:max-w-6xl px-3 sm:px-6 py-5 sm:py-8 w-full space-y-5">
      {/* ── 1. Top Bar: Back to Hub + GitHub Link ── */}
      <div className="flex items-center justify-between gap-3 text-xs sm:text-sm">
        <Link
          href="/docs"
          className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors font-medium min-w-0"
        >
          <ArrowLeft className="size-3.5 sm:size-4 shrink-0" />
          <span className="truncate">{t(L.backToHub, locale)}</span>
        </Link>

        <a
          href={githubUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border bg-card/90 hover:bg-muted text-muted-foreground hover:text-foreground text-xs font-medium transition-colors shadow-2xs"
          title={t(L.viewOnGithub, locale)}
        >
          <FolderGit2 className="size-3.5 text-primary" />
          <span className="hidden sm:inline">{t(L.viewOnGithub, locale)}</span>
          <ExternalLink className="size-2.5 opacity-60" />
        </a>
      </div>

      {/* ── 2. ModuleReader-style Navigation Bar ── */}
      <nav aria-label="Developer Documents Navigation" className="mb-5">
        <div className="rounded-2xl border bg-card/85 p-2 sm:p-2.5 shadow-xs backdrop-blur-md">
          {/* Row 1: Session Selector, Hub View button & Quick Stepper (< >) */}
          <div className="flex items-center justify-between gap-1.5 sm:gap-2">
            {/* Hub view button */}
            <Link
              href="/docs"
              aria-label={t(L.index, locale)}
              title={t(L.backToHub, locale)}
              className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl border bg-background/90 px-2 sm:px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:bg-muted/50 hover:text-foreground cursor-pointer shadow-2xs h-8 sm:h-9"
            >
              <Table2 className="size-3.5 text-primary" />
              <span className="hidden sm:inline">{t(L.index, locale)}</span>
            </Link>

            {/* Dropdown Menu showing current document name with full list */}
            <div className="min-w-0 flex-1">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="flex w-full min-w-0 items-center justify-between gap-1.5 sm:gap-2 rounded-xl border bg-background/90 px-2.5 sm:px-3 py-1.5 text-left text-xs sm:text-sm font-semibold transition-colors hover:border-primary/40 hover:bg-muted/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 shadow-2xs cursor-pointer h-8 sm:h-9"
                  >
                    <div className="flex min-w-0 items-center gap-1.5 sm:gap-2">
                      <span className="shrink-0 font-mono text-[11px] sm:text-xs font-bold text-primary">
                        {currentIndex + 1}/{allDocs.length}
                      </span>
                      <span className="truncate">{doc.title}</span>
                      <span className="hidden md:inline-flex shrink-0">
                        <Badge
                          variant="outline"
                          className="text-[10px] font-mono px-1.5 py-0 border-primary/30 text-primary"
                        >
                          docs/{doc.fileName}
                        </Badge>
                      </span>
                    </div>
                    <ChevronDown className="size-3.5 sm:size-4 shrink-0 text-muted-foreground ml-1" />
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="start"
                  className="w-[calc(100vw-1.5rem)] max-w-sm sm:max-w-md max-h-[70vh] sm:max-h-[420px] overflow-y-auto p-1.5 rounded-xl shadow-xl"
                >
                  <DropdownMenuLabel className="text-[11px] font-semibold text-muted-foreground px-2 py-1.5">
                    {t(L.allDocs, locale)} ({allDocs.length})
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  {sections.map((section) => (
                    <div key={section.id} className="py-1">
                      <div className="px-2 py-1 text-[10px] font-bold text-primary uppercase tracking-wider">
                        {t(section.title, locale)}
                      </div>
                      {section.docs.map((d) => {
                        const isCurrent = d.slug === doc.slug;
                        const overallIndex = allDocs.findIndex((x) => x.slug === d.slug);
                        return (
                          <DropdownMenuItem
                            key={d.slug}
                            onClick={() => goToDoc(d.slug)}
                            className={`flex items-center justify-between gap-2 px-2.5 py-2 sm:py-2.5 rounded-lg cursor-pointer text-xs ${
                              isCurrent
                                ? "bg-primary/10 text-primary font-semibold"
                                : "hover:bg-muted text-foreground"
                            }`}
                          >
                            <div className="flex min-w-0 items-center gap-2">
                              <span
                                className={`flex size-5 shrink-0 items-center justify-center rounded-full text-[10px] font-mono font-bold ${
                                  isCurrent
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted text-muted-foreground"
                                }`}
                              >
                                {overallIndex + 1}
                              </span>
                              <span className="truncate text-xs sm:text-sm">{d.title}</span>
                            </div>
                            {isCurrent && (
                              <Check className="size-3.5 text-primary shrink-0" />
                            )}
                          </DropdownMenuItem>
                        );
                      })}
                    </div>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Quick Stepper (< >) */}
            <div className="flex shrink-0 items-center gap-1">
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={isFirst}
                onClick={() => prevDoc && goToDoc(prevDoc.slug)}
                aria-label={t(L.prev, locale)}
                title={t(L.prev, locale)}
                className="size-8 sm:h-9 sm:w-9 rounded-xl p-0 shadow-2xs cursor-pointer"
              >
                <ChevronLeft className="size-4" />
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={isLast}
                onClick={() => nextDoc && goToDoc(nextDoc.slug)}
                aria-label={t(L.next, locale)}
                title={t(L.next, locale)}
                className="size-8 sm:h-9 sm:w-9 rounded-xl p-0 shadow-2xs cursor-pointer"
              >
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>

          {/* Row 2: Single-line Compact Horizontal Pill Rail (matching ModuleReader) */}
          <div className="mt-2 flex items-center gap-1.5 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pt-1.5 border-t border-border/40 touch-pan-x overscroll-x-contain scroll-smooth px-0.5">
            {allDocs.map((item, i) => {
              const isActive = item.slug === doc.slug;
              return (
                <button
                  key={item.slug}
                  ref={isActive ? activePillRef : null}
                  type="button"
                  onClick={() => goToDoc(item.slug)}
                  title={item.title}
                  className={`
                    group inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all cursor-pointer whitespace-nowrap
                    ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                        : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                    }
                  `}
                >
                  <span
                    className={`font-mono text-[10px] tabular-nums ${
                      isActive ? "text-primary-foreground/90" : "text-muted-foreground"
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>{item.shortTitle}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* ── 3. Reader Grid: Article (Center) + Outline Panel (Right) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-8 items-start">
        {/* Main Article Column */}
        <article className="min-w-0 max-w-3xl w-full space-y-6">
          {/* Header Card */}
          <header className="rounded-2xl border bg-card/60 p-5 sm:p-6 space-y-3 shadow-2xs">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="text-[11px] font-medium border-primary/30 text-primary">
                {t(doc.section.title, locale)}
              </Badge>
              <span className="text-xs text-muted-foreground font-mono">
                docs/{doc.fileName}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              {doc.title}
            </h1>

            {doc.description && (
              <p className="text-sm text-muted-foreground leading-relaxed">
                {doc.description}
              </p>
            )}
          </header>

          {/* Markdown Content rendered via MdView */}
          <div className="prose-neutral dark:prose-invert max-w-none">
            <MdView markdown={doc.content} />
          </div>

          {/* Bottom Next/Prev Navigation Cards (Matching ModuleReader/Course layout) */}
          <footer className="pt-8 border-t grid grid-cols-1 sm:grid-cols-2 gap-4">
            {prevDoc ? (
              <Link
                href={`/docs/${prevDoc.slug}`}
                className="group rounded-xl border bg-card/40 p-4 hover:border-primary/40 hover:bg-card transition-all space-y-1 text-left"
              >
                <div className="inline-flex items-center gap-1.5 text-xs text-muted-foreground group-hover:text-primary transition-colors">
                  <ArrowLeft className="size-3.5" />
                  <span>{t(L.prevDoc, locale)}</span>
                </div>
                <div className="font-medium text-sm text-foreground line-clamp-1">
                  {prevDoc.title}
                </div>
              </Link>
            ) : (
              <div />
            )}

            {nextDoc ? (
              <Link
                href={`/docs/${nextDoc.slug}`}
                className="group rounded-xl border bg-card/40 p-4 hover:border-primary/40 hover:bg-card transition-all space-y-1 text-right sm:col-start-2"
              >
                <div className="inline-flex items-center gap-1.5 text-xs text-muted-foreground group-hover:text-primary transition-colors justify-end w-full">
                  <span>{t(L.nextDoc, locale)}</span>
                  <ArrowRight className="size-3.5" />
                </div>
                <div className="font-medium text-sm text-foreground line-clamp-1">
                  {nextDoc.title}
                </div>
              </Link>
            ) : null}
          </footer>
        </article>

        {/* Outline / Table of Contents Panel (Sticky Right) */}
        <aside className="hidden lg:block sticky top-24 space-y-4">
          <TocSidePanel
            items={tocItems}
            title={L.documentOutline}
            isCollapsed={isTocCollapsed}
            onToggleCollapse={() => setIsTocCollapsed((prev) => !prev)}
          />
        </aside>
      </div>
    </main>
  );
}
