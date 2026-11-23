"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  ChevronRight,
  ExternalLink,
  FolderGit2,
  Menu,
  Sparkles,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  prevDoc: { th: "เอกสารก่อนหน้า", en: "Previous doc" },
  nextDoc: { th: "เอกสารถัดไป", en: "Next doc" },
  documentOutline: { th: "สารบัญในหน้านี้", en: "On this page" },
  allDocs: { th: "เอกสารทั้งหมด", en: "All Documents" },
  docCount: { th: "ฉบับ", en: "docs" },
  versionPage: { th: "ดูเวอร์ชันและ Changelog", en: "Version & Changelog" },
};

interface DocsReaderProps {
  doc: DevDocDetail;
  sections: DevDocSection[];
}

export function DocsReader({ doc, sections }: DocsReaderProps) {
  const { locale } = useLocale();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [isTocCollapsed, setIsTocCollapsed] = useState(false);

  // Extract table of contents from markdown content
  const tocItems = useMemo(() => extractToc(doc.content), [doc.content]);

  // Scroll to top on document change
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [doc.slug]);

  const githubUrl = `${SITE.repo.url}/blob/${SITE.repo.branch}/docs/${doc.fileName}`;

  return (
    <div className="min-h-screen bg-background">
      {/* Top Secondary Navigation Bar */}
      <header className="sticky top-14 z-30 w-full border-b bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-12 flex items-center justify-between gap-3 text-xs">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 min-w-0">
            <Button
              variant="ghost"
              size="icon-sm"
              className="md:hidden size-8 -ml-1 text-muted-foreground"
              onClick={() => setMobileNavOpen((prev) => !prev)}
              aria-label="Toggle navigation"
            >
              <Menu className="size-4" />
            </Button>

            <Link
              href="/docs"
              className="inline-flex items-center gap-1.5 font-medium text-muted-foreground hover:text-foreground transition-colors shrink-0"
            >
              <BookOpen className="size-3.5 text-primary" />
              <span className="hidden sm:inline">{t(L.hub, locale)}</span>
              <span className="sm:hidden">Docs</span>
            </Link>

            <ChevronRight className="size-3 text-muted-foreground/60 shrink-0" />

            <span className="text-muted-foreground truncate hidden md:inline">
              {t(doc.section.title, locale)}
            </span>

            <ChevronRight className="size-3 text-muted-foreground/60 shrink-0 hidden md:inline" />

            <span className="font-semibold text-foreground truncate max-w-[200px] sm:max-w-xs">
              {doc.title}
            </span>
          </div>

          {/* Quick Actions Right */}
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/version"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border bg-muted/30 hover:bg-muted/60 text-muted-foreground hover:text-foreground transition-colors text-[11px]"
            >
              <Sparkles className="size-3 text-primary" />
              <span className="hidden sm:inline">{t(L.versionPage, locale)}</span>
              <span className="sm:hidden">v{SITE.shortName}</span>
            </Link>

            <a
              href={githubUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors text-[11px]"
              title={t(L.viewOnGithub, locale)}
            >
              <FolderGit2 className="size-3.5" />
              <span className="hidden sm:inline">{t(L.viewOnGithub, locale)}</span>
              <ExternalLink className="size-2.5 opacity-60" />
            </a>
          </div>
        </div>
      </header>

      {/* Main 3-Column Layout: Sidebar (Nav) | Reader (Article) | TOC (Headings) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-8">
        <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] lg:grid-cols-[260px_1fr_240px] gap-8 items-start">
          {/* Left Column: Documentation Nav Tree */}
          <aside
            className={`
              fixed md:sticky top-28 md:top-28 inset-y-0 left-0 z-40 md:z-10
              w-72 md:w-full bg-background md:bg-transparent p-5 md:p-0 border-r md:border-r-0 shadow-xl md:shadow-none
              transition-transform duration-200 ease-in-out md:translate-x-0 overflow-y-auto max-h-[calc(100vh-8rem)]
              ${mobileNavOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
            `}
          >
            <div className="flex items-center justify-between pb-3 md:hidden border-b mb-3">
              <span className="font-semibold text-sm">{t(L.allDocs, locale)}</span>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setMobileNavOpen(false)}
              >
                <X className="size-4" />
              </Button>
            </div>

            <nav className="space-y-6 text-xs">
              {sections.map((sec) => (
                <div key={sec.id} className="space-y-2">
                  <div className="px-2 py-1 text-[11px] font-semibold text-primary uppercase tracking-wider flex items-center justify-between">
                    <span>{t(sec.title, locale)}</span>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      {sec.docs.length}
                    </span>
                  </div>

                  <ul className="space-y-1">
                    {sec.docs.map((item) => {
                      const isActive = item.slug === doc.slug;
                      return (
                        <li key={item.slug}>
                          <Link
                            href={item.slug === "readme" ? "/docs" : `/docs/${item.slug}`}
                            onClick={() => setMobileNavOpen(false)}
                            className={`
                              group flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-colors text-[13px]
                              ${
                                isActive
                                  ? "bg-primary/10 text-primary font-medium"
                                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                              }
                            `}
                          >
                            <span className="truncate">{item.title}</span>
                            {isActive && (
                              <div className="size-1.5 rounded-full bg-primary shrink-0 ml-2" />
                            )}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </nav>
          </aside>

          {/* Backdrop for mobile navigation */}
          {mobileNavOpen && (
            <div
              className="fixed inset-0 bg-black/60 z-30 md:hidden backdrop-blur-xs"
              onClick={() => setMobileNavOpen(false)}
            />
          )}

          {/* Center Column: Markdown Content */}
          <main className="min-w-0 max-w-3xl w-full mx-auto space-y-8">
            {/* Header Card */}
            <div className="rounded-2xl border bg-card/60 p-5 sm:p-6 space-y-3 shadow-2xs">
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
            </div>

            {/* Markdown Body */}
            <article className="prose-neutral dark:prose-invert max-w-none">
              <MdView markdown={doc.content} />
            </article>

            {/* Bottom Prev / Next Navigation */}
            <div className="pt-8 border-t grid grid-cols-1 sm:grid-cols-2 gap-4">
              {doc.prev ? (
                <Link
                  href={doc.prev.slug === "readme" ? "/docs" : `/docs/${doc.prev.slug}`}
                  className="group rounded-xl border bg-card/40 p-4 hover:border-primary/40 hover:bg-card transition-all space-y-1 text-left"
                >
                  <div className="inline-flex items-center gap-1.5 text-xs text-muted-foreground group-hover:text-primary transition-colors">
                    <ArrowLeft className="size-3.5" />
                    <span>{t(L.prevDoc, locale)}</span>
                  </div>
                  <div className="font-medium text-sm text-foreground line-clamp-1">
                    {doc.prev.title}
                  </div>
                </Link>
              ) : (
                <div />
              )}

              {doc.next ? (
                <Link
                  href={`/docs/${doc.next.slug}`}
                  className="group rounded-xl border bg-card/40 p-4 hover:border-primary/40 hover:bg-card transition-all space-y-1 text-right sm:col-start-2"
                >
                  <div className="inline-flex items-center gap-1.5 text-xs text-muted-foreground group-hover:text-primary transition-colors justify-end w-full">
                    <span>{t(L.nextDoc, locale)}</span>
                    <ArrowRight className="size-3.5" />
                  </div>
                  <div className="font-medium text-sm text-foreground line-clamp-1">
                    {doc.next.title}
                  </div>
                </Link>
              ) : null}
            </div>
          </main>

          {/* Right Column: Outline / TOC Side Panel */}
          <aside className="hidden lg:block sticky top-28 space-y-4">
            <TocSidePanel
              items={tocItems}
              title={L.documentOutline}
              isCollapsed={isTocCollapsed}
              onToggleCollapse={() => setIsTocCollapsed((prev) => !prev)}
            />
          </aside>
        </div>
      </div>
    </div>
  );
}
