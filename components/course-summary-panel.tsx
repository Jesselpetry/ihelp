"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { ArrowUp, ChevronDown, ChevronUp, Compass, Eye, ListTree } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MdView } from "@/components/md-view";
import { extractToc } from "@/lib/docs/toc";
import { useLocale, t, type LText } from "@/lib/i18n";

/**
 * The curated course summary, as a panel rather than a card.
 *
 * The card chrome — icon, heading, "สรุปโครงสร้าง" badge, rounded border — used
 * to live here, and again, nearly identically, in CourseOfficialInfo. Two cards
 * named "ภาพรวมและโครงสร้างรายวิชา" and "ภาพรวมรายวิชาอย่างเป็นทางการ" stacked
 * on one page is one idea wearing two hats and two screens of vertical space.
 * The chrome now belongs to CourseOverview, which shows exactly one of the two
 * panels at a time behind a tab; this file renders the body only.
 */
interface CourseSummaryPanelProps {
  markdown: string;
  /** Whether the full document is shown. Owned by CourseOverview. */
  expanded: boolean;
  onExpandedChange: (expanded: boolean) => void;
  className?: string;
}

const L = {
  viewFullContent: { th: "ดูเนื้อหาฉบับเต็ม", en: "View full content" },
  collapseContent: { th: "ย่อเนื้อหา", en: "Collapse content" },
  outline: { th: "สารบัญเนื้อหา", en: "Outline" },
  backToTop: { th: "ขึ้นบนสุด", en: "Top" },
  progress: { th: "อ่านแล้ว", en: "Read" },
  items: { th: "หัวข้อ", en: "items" },
} satisfies Record<string, LText>;

/** Below this, the document is short enough that hiding half of it is theatre. */
const COLLAPSE_THRESHOLD = 400;

export function isSummaryCollapsible(markdown: string): boolean {
  return markdown.length > COLLAPSE_THRESHOLD;
}

export function CourseSummaryPanel({
  markdown,
  expanded,
  onExpandedChange,
  className = "",
}: CourseSummaryPanelProps) {
  const { locale } = useLocale();
  const [activeId, setActiveId] = useState<string>("");
  const [scrollProgress, setScrollProgress] = useState(0);

  const rootRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  const tocItems = useMemo(() => extractToc(markdown), [markdown]);
  const collapsible = isSummaryCollapsible(markdown);

  // Track active heading & scroll progress
  useEffect(() => {
    if (!expanded || typeof window === "undefined" || tocItems.length === 0) return;

    const handleScroll = () => {
      const panel = bodyRef.current;
      if (!panel) return;

      const rect = panel.getBoundingClientRect();
      const panelTop = rect.top;
      const panelHeight = rect.height;
      const windowHeight = window.innerHeight;

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
    rootRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  /* ── Preview: the first screenful, with the rest behind one button ──────── */
  if (!expanded) {
    return (
      <div ref={rootRef} className={`scroll-mt-20 ${className}`}>
        <div className="relative max-h-72 overflow-hidden">
          <MdView markdown={markdown} />

          {collapsible && (
            <div className="absolute inset-x-0 bottom-0 flex h-36 items-end justify-center bg-gradient-to-t from-card via-card/90 to-transparent pb-2">
              <Button
                variant="default"
                size="sm"
                onClick={() => onExpandedChange(true)}
                className="h-9 cursor-pointer gap-2 rounded-full bg-primary px-5 text-xs font-semibold text-primary-foreground shadow-lg transition-transform hover:bg-primary/90 active:scale-95"
              >
                <Eye className="size-4" />
                <span>{t(L.viewFullContent, locale)}</span>
                <ChevronDown className="size-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  /* ── Full document, with the outline panel alongside it ─────────────────── */
  return (
    <div
      ref={rootRef}
      className={`w-full scroll-mt-20 animate-in fade-in-50 duration-300 ${className}`}
    >
      <div className="flex flex-col items-start gap-6 lg:flex-row">
        {tocItems.length > 0 && (
          <aside className="sticky top-20 hidden w-64 shrink-0 flex-col gap-3 rounded-2xl border bg-background/60 p-4 lg:flex xl:w-72">
            <div className="flex shrink-0 items-center justify-between gap-2 border-b pb-3">
              <div className="flex items-center gap-2">
                <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <ListTree className="size-4" />
                </div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                  {t(L.outline, locale)}
                </h4>
              </div>
              <Badge
                variant="outline"
                className="h-4.5 rounded-full px-1.5 py-0 font-mono text-[10px]"
              >
                {scrollProgress}% {t(L.progress, locale)}
              </Badge>
            </div>

            <div className="h-1 w-full shrink-0 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all duration-150"
                style={{ width: `${scrollProgress}%` }}
              />
            </div>

            <nav
              className="max-h-[calc(100vh-14rem)] space-y-0.5 overflow-y-auto pr-1 text-xs"
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
                    className={`flex w-full cursor-pointer items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-left transition-all ${
                      isL1
                        ? "mt-1 text-xs font-semibold"
                        : isL2
                          ? "pl-3.5 text-xs font-medium text-foreground/90"
                          : "pl-5 text-[11px] text-muted-foreground"
                    } ${
                      isActive
                        ? "border-l-2 border-primary bg-primary/10 font-semibold text-primary"
                        : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                    }`}
                  >
                    {isActive && <Compass className="size-3 shrink-0 animate-pulse text-primary" />}
                    <span className="truncate">{item.text}</span>
                  </button>
                );
              })}
            </nav>

            <div className="flex shrink-0 items-center justify-between border-t pt-2.5 text-[11px]">
              <button
                type="button"
                onClick={scrollToTop}
                className="inline-flex cursor-pointer items-center gap-1 text-muted-foreground transition-colors hover:text-primary"
              >
                <ArrowUp className="size-3" />
                <span>{t(L.backToTop, locale)}</span>
              </button>
              <span className="font-mono text-[10px] text-muted-foreground/70">
                {tocItems.length} {t(L.items, locale)}
              </span>
            </div>
          </aside>
        )}

        <div ref={bodyRef} className="min-w-0 flex-1 space-y-6">
          <div className="min-w-0 overflow-hidden">
            <MdView markdown={markdown} />
          </div>

          <div className="flex items-center justify-between border-t border-border/40 pt-4 text-xs">
            <Button
              variant="ghost"
              size="sm"
              onClick={scrollToTop}
              className="cursor-pointer gap-1.5 rounded-full text-xs text-muted-foreground hover:text-foreground"
            >
              <ArrowUp className="size-3.5" />
              <span>{t(L.backToTop, locale)}</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                onExpandedChange(false);
                scrollToTop();
              }}
              className="cursor-pointer gap-1.5 rounded-full border-primary/20 text-xs text-primary hover:bg-primary/10"
            >
              <ChevronUp className="size-3.5" />
              <span>{t(L.collapseContent, locale)}</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
