"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import {
  BookOpen,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Eye,
  ListTree,
  ArrowUp,
  Compass,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MdView } from "@/components/md-view";
import { extractToc } from "@/lib/toc";
import { useLocale, type LText } from "@/lib/i18n";

interface CourseSummaryCardProps {
  markdown: string;
  className?: string;
  expanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  defaultExpanded?: boolean;
}

const L: Record<string, LText> = {
  sectionTitle: { th: "ภาพรวมและโครงสร้างรายวิชา", en: "Course Summary & Overview" },
  sectionSubtitle: {
    th: "ขอบเขตเนื้อหา สัดส่วนคะแนน และมโนทัศน์สำคัญ",
    en: "Syllabus, grading breakdown, and key concepts",
  },
  viewFullContent: { th: "ดูเนื้อหาฉบับเต็ม", en: "View full content" },
  collapseContent: { th: "ย่อเนื้อหา", en: "Collapse content" },
  curated: { th: "สรุปโครงสร้าง", en: "Syllabus & Summary" },
  outline: { th: "สารบัญเนื้อหา", en: "Outline" },
  backToTop: { th: "ขึ้นบนสุด", en: "Top" },
  progress: { th: "อ่านแล้ว", en: "Read" },
};

export function CourseSummaryCard({
  markdown,
  className = "",
  expanded: controlledExpanded,
  onExpandedChange,
  defaultExpanded = false,
}: CourseSummaryCardProps) {
  const { locale } = useLocale();
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);
  const expanded = controlledExpanded !== undefined ? controlledExpanded : internalExpanded;

  const setExpanded = (next: boolean) => {
    if (onExpandedChange) {
      onExpandedChange(next);
    } else {
      setInternalExpanded(next);
    }
  };

  const [activeId, setActiveId] = useState<string>("");
  const [scrollProgress, setScrollProgress] = useState(0);

  const cardRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);

  // Extract table of contents items from markdown
  const tocItems = useMemo(() => extractToc(markdown), [markdown]);
  const isCollapsible = markdown.length > 400;

  // Track active heading & scroll progress
  useEffect(() => {
    if (!expanded || typeof window === "undefined" || tocItems.length === 0) return;

    const handleScroll = () => {
      const panel = rightPanelRef.current;
      if (!panel) return;

      const rect = panel.getBoundingClientRect();
      const panelTop = rect.top;
      const panelHeight = rect.height;
      const windowHeight = window.innerHeight;

      // Calculate progress within the right summary card
      if (panelHeight > 0) {
        const scrolledInPanel = -panelTop;
        const totalScrollable = panelHeight - windowHeight;
        if (totalScrollable > 0) {
          const p = Math.min(100, Math.max(0, (scrolledInPanel / totalScrollable) * 100));
          setScrollProgress(Math.round(p));
        } else if (panelTop < windowHeight / 2) {
          setScrollProgress(100);
        } else {
          setScrollProgress(0);
        }
      }

      // Find active heading
      const headingElements = tocItems
        .map((item) => ({
          id: item.id,
          element: document.getElementById(item.id),
        }))
        .filter((h): h is { id: string; element: HTMLElement } => h.element !== null);

      if (headingElements.length === 0) return;

      const triggerPosition = windowHeight * 0.3;
      let currentActive = headingElements[0].id;

      for (const { id, element } of headingElements) {
        const top = element.getBoundingClientRect().top;
        if (top <= triggerPosition) {
          currentActive = id;
        } else {
          break;
        }
      }

      setActiveId(currentActive);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [expanded, tocItems]);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveId(id);
    }
  };

  const scrollToTop = () => {
    cardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  /* ──────────────────────────────────────────────────────────────────────────
   * 1. COLLAPSED (PREVIEW) MODE: Standard single card within max-w-3xl
   * ────────────────────────────────────────────────────────────────────────── */
  if (!expanded) {
    return (
      <div
        ref={cardRef}
        id="course-summary"
        className={`rounded-3xl border bg-card p-5 sm:p-7 shadow-xs space-y-6 scroll-mt-20 ${className}`}
      >
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <BookOpen className="size-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold leading-tight">
                {locale === "th" ? L.sectionTitle.th : L.sectionTitle.en}
              </h3>
              <p className="text-xs text-muted-foreground">
                {locale === "th" ? L.sectionSubtitle.th : L.sectionSubtitle.en}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="rounded-full text-[11px] font-medium border-primary/30 text-primary bg-primary/5"
            >
              <Sparkles className="size-3 mr-1 text-primary" />
              {locale === "th" ? L.curated.th : L.curated.en}
            </Badge>

            {isCollapsible && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setExpanded(true)}
                className="h-7.5 gap-1.5 rounded-full text-xs font-medium border-primary/20 text-primary hover:bg-primary/10 px-3 cursor-pointer"
              >
                <Eye className="size-3.5" />
                <span>{locale === "th" ? L.viewFullContent.th : L.viewFullContent.en}</span>
                <ChevronDown className="size-3.5" />
              </Button>
            )}
          </div>
        </div>

        {/* Body preview with gradient fade */}
        <div className="relative max-h-72 overflow-hidden">
          <MdView markdown={markdown} />

          <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-card via-card/90 to-transparent flex items-end justify-center pb-2">
            <Button
              variant="default"
              size="sm"
              onClick={() => setExpanded(true)}
              className="rounded-full shadow-lg gap-2 text-xs font-semibold px-5 h-9 bg-primary text-primary-foreground hover:bg-primary/90 transition-transform active:scale-95 cursor-pointer"
            >
              <Eye className="size-4" />
              <span>{locale === "th" ? L.viewFullContent.th : L.viewFullContent.en}</span>
              <ChevronDown className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  /* ──────────────────────────────────────────────────────────────────────────
   * 2. EXPANDED FULL CONTENT MODE:
   * Expands outward with Left side panel: "สารบัญเนื้อหา" (Outline)
   * Right side panel: "ภาพรวมและโครงสร้างรายวิชา" Card
   * ────────────────────────────────────────────────────────────────────────── */
  return (
    <div
      ref={cardRef}
      id="course-summary"
      className={`w-full scroll-mt-20 animate-in fade-in-50 duration-300 ${className}`}
    >
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* ══ LEFT SIDE PANEL: สารบัญเนื้อหา (Outline) ════════════════════════ */}
        {tocItems.length > 0 && (
          <aside className="hidden lg:flex flex-col gap-3 w-64 xl:w-72 shrink-0 sticky top-20 rounded-3xl border bg-card p-4 shadow-xs">
            {/* Outline Header */}
            <div className="flex items-center justify-between gap-2 border-b pb-3 shrink-0">
              <div className="flex items-center gap-2">
                <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <ListTree className="size-4" />
                </div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                  {locale === "th" ? L.outline.th : L.outline.en}
                </h4>
              </div>
              <Badge variant="outline" className="font-mono text-[10px] rounded-full px-1.5 py-0 h-4.5">
                {scrollProgress}% {locale === "th" ? L.progress.th : L.progress.en}
              </Badge>
            </div>

            {/* Reading Progress Bar */}
            <div className="h-1 w-full rounded-full bg-muted overflow-hidden shrink-0">
              <div
                className="h-full bg-primary transition-all duration-150 rounded-full"
                style={{ width: `${scrollProgress}%` }}
              />
            </div>

            {/* Nav list */}
            <nav
              className="overflow-y-auto space-y-0.5 pr-1 text-xs max-h-[calc(100vh-14rem)]"
              aria-label="Table of contents"
            >
              {tocItems.map((item) => {
                const isActive = activeId === item.id;
                const isL1 = item.level === 1;
                const isL2 = item.level === 2;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => scrollToHeading(item.id)}
                    className={`w-full text-left rounded-xl py-1.5 px-2.5 transition-all cursor-pointer flex items-center gap-1.5 ${
                      isL1
                        ? "font-semibold text-xs mt-1"
                        : isL2
                          ? "font-medium pl-3.5 text-xs text-foreground/90"
                          : "pl-5 text-[11px] text-muted-foreground"
                    } ${
                      isActive
                        ? "bg-primary/10 text-primary font-semibold border-l-2 border-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                    }`}
                  >
                    {isActive && <Compass className="size-3 text-primary shrink-0 animate-pulse" />}
                    <span className="truncate">{item.text}</span>
                  </button>
                );
              })}
            </nav>

            {/* Bottom info & quick jump */}
            <div className="pt-2.5 border-t shrink-0 flex items-center justify-between text-[11px]">
              <button
                type="button"
                onClick={scrollToTop}
                className="inline-flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors cursor-pointer"
              >
                <ArrowUp className="size-3" />
                <span>{locale === "th" ? L.backToTop.th : L.backToTop.en}</span>
              </button>
              <span className="text-[10px] font-mono text-muted-foreground/70">
                {tocItems.length} {locale === "th" ? "หัวข้อ" : "items"}
              </span>
            </div>
          </aside>
        )}

        {/* ══ RIGHT PANEL: ภาพรวมและโครงสร้างรายวิชา Card ════════════════════ */}
        <div
          ref={rightPanelRef}
          className="flex-1 min-w-0 rounded-3xl border bg-card p-5 sm:p-7 shadow-xs space-y-6"
        >
          {/* Card Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4">
            <div className="flex items-center gap-2.5">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <BookOpen className="size-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold leading-tight">
                  {locale === "th" ? L.sectionTitle.th : L.sectionTitle.en}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {locale === "th" ? L.sectionSubtitle.th : L.sectionSubtitle.en}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="rounded-full text-[11px] font-medium border-primary/30 text-primary bg-primary/5"
              >
                <Sparkles className="size-3 mr-1 text-primary" />
                {locale === "th" ? L.curated.th : L.curated.en}
              </Badge>

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setExpanded(false);
                  scrollToTop();
                }}
                className="h-7.5 gap-1.5 rounded-full text-xs font-medium border-primary/20 text-primary hover:bg-primary/10 px-3 cursor-pointer"
              >
                <ChevronUp className="size-3.5" />
                <span>{locale === "th" ? L.collapseContent.th : L.collapseContent.en}</span>
              </Button>
            </div>
          </div>

          {/* Rendered Markdown Body */}
          <div className="min-w-0 overflow-hidden">
            <MdView markdown={markdown} />
          </div>

          {/* Bottom Footer Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-border/40 text-xs">
            <Button
              variant="ghost"
              size="sm"
              onClick={scrollToTop}
              className="rounded-full text-xs text-muted-foreground hover:text-foreground gap-1.5 cursor-pointer"
            >
              <ArrowUp className="size-3.5" />
              <span>{locale === "th" ? L.backToTop.th : L.backToTop.en}</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setExpanded(false);
                scrollToTop();
              }}
              className="rounded-full text-xs gap-1.5 border-primary/20 text-primary hover:bg-primary/10 cursor-pointer"
            >
              <ChevronUp className="size-3.5" />
              <span>{locale === "th" ? L.collapseContent.th : L.collapseContent.en}</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
