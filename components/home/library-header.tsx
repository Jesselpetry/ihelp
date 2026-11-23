"use client";

import { BookOpen, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useLocale, t, type LText } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const L: Record<string, LText> = {
  sectionTitle: {
    th: "คลังเรียนรู้ IT KMITL",
    en: "IT KMITL Learning Library",
  },
  sectionSubtitle: {
    th: "สรุปเนื้อหา แบบทดสอบ คลังโจทย์ และสไลด์เลกเชอร์ ชั้นปีที่ 1 ครบทุกวิชา",
    en: "Summaries, quizzes, problem banks, and lecture slides for all Year 1 courses",
  },
  searchPlaceholder: {
    th: "ค้นหารหัสวิชา หรือชื่อวิชา...",
    en: "Search course code or name...",
  },
  clearSearch: { th: "ล้างการค้นหา", en: "Clear search" },
};

export interface LibraryHeaderProps {
  query: string;
  onQueryChange: (query: string) => void;
  className?: string;
}

export function LibraryHeader({
  query,
  onQueryChange,
  className,
}: LibraryHeaderProps) {
  const { locale } = useLocale();

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/80 pb-3 sm:pb-3.5",
        className
      )}
    >
      {/* Left side: Standardized White icon in brand box + Title + Subtitle */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-white shadow-xs">
          <BookOpen className="size-5 text-white" strokeWidth={2.25} />
        </div>
        <div className="min-w-0">
          <h2 className="text-base sm:text-lg font-bold tracking-tight text-foreground truncate">
            {t(L.sectionTitle, locale)}
          </h2>
          <p className="text-xs text-muted-foreground leading-normal line-clamp-1 sm:line-clamp-none">
            {t(L.sectionSubtitle, locale)}
          </p>
        </div>
      </div>

      {/* Right side: Compact Search Input (aligned in header bar) */}
      <div className="relative w-full sm:w-72 md:w-80 shrink-0">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder={t(L.searchPlaceholder, locale)}
          aria-label={t(L.searchPlaceholder, locale)}
          className="h-9 sm:h-9.5 rounded-lg border-border/80 bg-card pl-9 pr-8 text-xs sm:text-sm transition-colors focus-visible:ring-2 focus-visible:ring-primary/20 dark:border-white/10 dark:bg-card placeholder:text-muted-foreground/70"
        />
        {query && (
          <button
            type="button"
            onClick={() => onQueryChange("")}
            title={t(L.clearSearch, locale)}
            aria-label={t(L.clearSearch, locale)}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <X className="size-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
