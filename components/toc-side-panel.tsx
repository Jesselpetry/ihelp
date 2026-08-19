"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import {
  BookOpen,
  ChevronUp,
  Search,
  Hash,
  Menu,
  X,
  ListTree,
  Sparkles,
  ArrowUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocale, type LText } from "@/lib/i18n";
import type { TocItem } from "@/lib/toc";

interface TocSidePanelProps {
  items: TocItem[];
  title?: LText;
  className?: string;
}

const L: Record<string, LText> = {
  onThisPage: { th: "ในหน้านี้", en: "On this page" },
  outline: { th: "สารบัญเนื้อหา", en: "Table of Contents" },
  searchPlaceholder: { th: "ค้นหาหัวข้อ...", en: "Filter outline..." },
  noMatch: { th: "ไม่พบหัวข้อที่ค้นหา", en: "No matching headings" },
  backToTop: { th: "ขึ้นบนสุด", en: "Back to top" },
  progress: { th: "ความคืบหน้า", en: "Progress" },
  read: { th: "อ่านแล้ว", en: "read" },
  sections: { th: "หัวข้อ", en: "sections" },
  close: { th: "ปิด", en: "Close" },
  currentSection: { th: "กำลังอ่าน", en: "Current section" },
};

export function TocSidePanel({
  items,
  title = L.onThisPage,
  className = "",
}: TocSidePanelProps) {
  const { locale } = useLocale();
  const [activeId, setActiveId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);
  const activeLinkRef = useRef<HTMLButtonElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  // Filter items by search query
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return items;
    const q = searchQuery.toLowerCase();
    return items.filter((item) => item.text.toLowerCase().includes(q));
  }, [items, searchQuery]);

  // Find active item info
  const activeItem = useMemo(() => {
    return items.find((item) => item.id === activeId) || items[0];
  }, [items, activeId]);

  // ScrollSpy & Scroll Progress tracking
  useEffect(() => {
    if (typeof window === "undefined" || items.length === 0) return;

    const handleScroll = () => {
      // 1. Calculate reading progress
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      const progress = totalScroll > 0 ? Math.min(100, Math.max(0, (currentScroll / totalScroll) * 100)) : 0;
      setScrollProgress(Math.round(progress));

      // 2. Determine active heading
      const headingElements = items
        .map((item) => ({
          id: item.id,
          element: document.getElementById(item.id),
        }))
        .filter((h): h is { id: string; element: HTMLElement } => h.element !== null);

      if (headingElements.length === 0) return;

      // Find heading closest to top of viewport with offset
      const topOffset = 160;
      let currentActiveId = headingElements[0].id;

      for (const h of headingElements) {
        const rect = h.element.getBoundingClientRect();
        if (rect.top <= topOffset) {
          currentActiveId = h.id;
        } else {
          break;
        }
      }

      setActiveId(currentActiveId);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [items]);

  // Auto-scroll sidebar to keep active item in view
  useEffect(() => {
    if (activeLinkRef.current && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const activeEl = activeLinkRef.current;
      const containerRect = container.getBoundingClientRect();
      const activeRect = activeEl.getBoundingClientRect();

      if (
        activeRect.top < containerRect.top + 40 ||
        activeRect.bottom > containerRect.bottom - 40
      ) {
        activeEl.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }
    }
  }, [activeId]);

  const scrollToHeading = (id: string) => {
    setIsMobileOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", `#${id}`);
      setActiveId(id);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    history.replaceState(null, "", window.location.pathname);
  };

  if (items.length === 0) return null;

  return (
    <>
      {/* ── Desktop Sticky Sidebar ────────────────────────────────────────── */}
      <aside
        className={`hidden lg:block w-72 xl:w-80 shrink-0 sticky top-20 max-h-[calc(100vh-6rem)] rounded-3xl border bg-card/75 backdrop-blur-md p-4 shadow-sm flex flex-col ${className}`}
        aria-label="Table of contents"
      >
        {/* Header with Title & Progress Pill */}
        <div className="pb-3 border-b shrink-0 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <ListTree className="size-3.5 text-primary" />
              <span>{title[locale]}</span>
            </div>
            <Badge
              variant="outline"
              className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-primary/5 text-primary border-primary/20"
            >
              {scrollProgress}% {L.read[locale]}
            </Badge>
          </div>

          {/* Reading progress bar */}
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full bg-gradient-to-r from-primary/80 to-primary transition-all duration-150 ease-out"
              style={{ width: `${scrollProgress}%` }}
            />
          </div>

          {/* Search filter input */}
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={L.searchPlaceholder[locale]}
              className="w-full rounded-xl border bg-background/50 pl-8 pr-7 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="size-3" />
              </button>
            )}
          </div>
        </div>

        {/* Outline Items List */}
        <div
          ref={scrollContainerRef}
          className="overflow-y-auto flex-1 py-2 pr-1 space-y-0.5 scrollbar-thin scrollbar-thumb-muted-foreground/20 hover:scrollbar-thumb-muted-foreground/40"
        >
          {filteredItems.length === 0 ? (
            <p className="py-6 text-center text-xs text-muted-foreground">
              {L.noMatch[locale]}
            </p>
          ) : (
            filteredItems.map((item) => {
              const isActive = activeId === item.id;
              const isH1 = item.level === 1;
              const isH2 = item.level === 2;
              const isH3 = item.level === 3;

              return (
                <button
                  key={item.id}
                  ref={isActive ? activeLinkRef : null}
                  type="button"
                  onClick={() => scrollToHeading(item.id)}
                  className={`group relative w-full text-left transition-all rounded-xl py-1.5 px-2.5 flex items-start gap-2 ${
                    isH1 ? "font-semibold text-xs mt-2 first:mt-0" : ""
                  } ${isH2 ? "text-xs pl-3 font-medium" : ""} ${
                    isH3 ? "text-[11px] pl-6 text-muted-foreground" : ""
                  } ${
                    isActive
                      ? "bg-primary/10 text-primary font-semibold shadow-xs"
                      : "text-foreground/75 hover:bg-muted/60 hover:text-foreground"
                  }`}
                >
                  {/* Left Active Indicator Bar */}
                  {isActive && (
                    <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-primary" />
                  )}

                  <span className="shrink-0 mt-0.5 opacity-60 group-hover:opacity-100 transition-opacity">
                    {isH1 ? (
                      <BookOpen className="size-3 text-primary" />
                    ) : isH2 ? (
                      <Hash className="size-2.5" />
                    ) : (
                      <span className="inline-block size-1 rounded-full bg-current opacity-60" />
                    )}
                  </span>

                  <span className="line-clamp-2 leading-snug break-words">
                    {item.text}
                  </span>
                </button>
              );
            })
          )}
        </div>

        {/* Footer: Quick jump actions */}
        <div className="pt-2 border-t shrink-0 flex items-center justify-between text-xs text-muted-foreground">
          <span className="text-[10px]">
            {items.length} {L.sections[locale]}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={scrollToTop}
            className="h-7 px-2 text-xs gap-1 text-muted-foreground hover:text-primary rounded-lg"
          >
            <ChevronUp className="size-3.5" />
            {L.backToTop[locale]}
          </Button>
        </div>
      </aside>

      {/* ── Mobile Floating Trigger & Sheet ───────────────────────────────── */}
      <div className="lg:hidden">
        {/* Floating pill button */}
        <div className="fixed bottom-5 right-4 z-40">
          <Button
            onClick={() => setIsMobileOpen(true)}
            size="sm"
            className="rounded-full shadow-lg gap-2 bg-card/90 text-foreground border backdrop-blur-md hover:bg-card px-3.5 py-2 h-auto text-xs"
          >
            <ListTree className="size-3.5 text-primary" />
            <span className="font-medium max-w-[140px] truncate">
              {activeItem ? activeItem.text : L.outline[locale]}
            </span>
            <Badge
              variant="outline"
              className="text-[10px] px-1.5 py-0 rounded-full font-mono bg-primary/10 text-primary border-primary/20"
            >
              {scrollProgress}%
            </Badge>
          </Button>
        </div>

        {/* Mobile Slide-up Drawer Modal */}
        {isMobileOpen && (
          <div
            className="fixed inset-0 z-50 flex flex-col justify-end"
            role="dialog"
            aria-modal="true"
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
              onClick={() => setIsMobileOpen(false)}
            />

            {/* Panel */}
            <div className="relative z-10 w-full max-h-[80vh] rounded-t-3xl border-t bg-card p-4 shadow-2xl flex flex-col animate-in slide-in-from-bottom duration-300">
              {/* Drawer Handle */}
              <div className="w-12 h-1 bg-muted-foreground/20 rounded-full mx-auto mb-3 shrink-0" />

              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b shrink-0">
                <div className="flex items-center gap-2">
                  <div className="size-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <ListTree className="size-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold leading-tight">
                      {L.outline[locale]}
                    </h3>
                    <p className="text-[10px] text-muted-foreground">
                      {scrollProgress}% {L.read[locale]} · {items.length} {L.sections[locale]}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMobileOpen(false)}
                  className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted"
                >
                  <X className="size-4" />
                </button>
              </div>

              {/* Search */}
              <div className="py-2.5 shrink-0">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={L.searchPlaceholder[locale]}
                    className="w-full rounded-xl border bg-muted/40 pl-8 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
                  />
                </div>
              </div>

              {/* List */}
              <div className="overflow-y-auto flex-1 space-y-1 py-1 pr-1">
                {filteredItems.map((item) => {
                  const isActive = activeId === item.id;
                  const isH1 = item.level === 1;
                  const isH2 = item.level === 2;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => scrollToHeading(item.id)}
                      className={`w-full text-left rounded-xl py-2 px-3 flex items-start gap-2 text-xs transition-colors ${
                        isH1 ? "font-semibold" : ""
                      } ${isH2 ? "pl-5 font-medium" : "pl-8 text-muted-foreground"} ${
                        isActive
                          ? "bg-primary/10 text-primary font-semibold"
                          : "hover:bg-muted/60 text-foreground/80"
                      }`}
                    >
                      <span className="shrink-0 mt-0.5">
                        {isH1 ? (
                          <BookOpen className="size-3 text-primary" />
                        ) : (
                          <span className="inline-block size-1.5 rounded-full bg-current" />
                        )}
                      </span>
                      <span className="line-clamp-2 leading-snug">{item.text}</span>
                    </button>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="pt-3 border-t shrink-0 flex items-center justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsMobileOpen(false);
                    scrollToTop();
                  }}
                  className="rounded-full text-xs gap-1.5 w-full"
                >
                  <ArrowUp className="size-3.5" />
                  {L.backToTop[locale]}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
