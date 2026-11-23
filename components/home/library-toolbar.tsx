"use client";

import {
  SlidersHorizontal,
  SearchX,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLocale, t, type LText } from "@/lib/i18n";
import type {
  CourseFilterGroup,
  CourseSortOption,
} from "@/lib/home/course-filter";
import { cn } from "@/lib/utils";

const L: Record<string, LText> = {
  filterAll: { th: "ทั้งหมด", en: "All" },
  filterY1S2: { th: "ปี 1 เทอม 2", en: "Y1 · S2" },
  filterY1S1: { th: "ปี 1 เทอม 1", en: "Y1 · S1" },
  filterEn: { th: "วิศวกรรมศาสตร์", en: "EN-KMITL" },
  sortCurrentFirst: { th: "เทอมปัจจุบันก่อน", en: "Current semester first" },
  sortSemesterAsc: { th: "ตามลำดับเทอม", en: "Chronological" },
  sortCodeAsc: { th: "รหัสวิชา ก-ฮ", en: "Course code (A-Z)" },
  sortNameAsc: { th: "ชื่อวิชา", en: "Course name (A-Z)" },
  coursesUnit: { th: "รายวิชา", en: "courses" },
  emptyTitle: {
    th: "ไม่พบรายวิชาที่ตรงกับการค้นหา",
    en: "No courses match your search",
  },
  emptySubtitle: {
    th: "ไม่พบผลลัพธ์สำหรับคำค้นหาหรือตัวกรองที่เลือก ลองตรวจการสะกด หรือกดล้างตัวกรองเพื่อดูรายวิชาทั้งหมด",
    en: "No results found for your query or selected filters. Try checking the spelling or resetting filters.",
  },
  resetButton: {
    th: "ล้างตัวกรองทั้งหมด",
    en: "Reset all filters",
  },
};

export interface LibraryToolbarProps {
  selectedGroup: CourseFilterGroup;
  onGroupChange: (group: CourseFilterGroup) => void;
  sortBy: CourseSortOption;
  onSortChange: (sortBy: CourseSortOption) => void;
  matchCount: number;
  className?: string;
}

export function LibraryToolbar({
  selectedGroup,
  onGroupChange,
  sortBy,
  onSortChange,
  matchCount,
  className,
}: LibraryToolbarProps) {
  const { locale } = useLocale();

  const filterOptions: { id: CourseFilterGroup; label: LText }[] = [
    { id: "all", label: L.filterAll },
    { id: "Y1-S2", label: L.filterY1S2 },
    { id: "Y1-S1", label: L.filterY1S1 },
    { id: "EN-KMITL", label: L.filterEn },
  ];

  return (
    <div
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between py-1",
        className
      )}
    >
      {/* Category Filter Pills (Horizontal scroll on mobile) */}
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
        {filterOptions.map((opt) => {
          const isActive = selectedGroup === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onGroupChange(opt.id)}
              className={cn(
                "inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all select-none cursor-pointer",
                isActive
                  ? "bg-primary text-primary-foreground shadow-xs border border-transparent"
                  : "bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted border border-border/50 dark:border-white/10"
              )}
            >
              <span>{t(opt.label, locale)}</span>
            </button>
          );
        })}
      </div>

      {/* Sort Selector & Result Counter */}
      <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
        <span className="font-mono text-xs text-muted-foreground/80">
          <strong className="text-foreground font-semibold">{matchCount}</strong>{" "}
          {t(L.coursesUnit, locale)}
        </span>

        <div className="flex items-center gap-2">
          <Select
            value={sortBy}
            onValueChange={(val) => onSortChange(val as CourseSortOption)}
          >
            <SelectTrigger
              aria-label="Sort courses"
              className="h-8.5 rounded-full border-border/80 bg-card px-3 text-xs font-medium text-foreground transition-colors hover:border-primary/40 focus:ring-1 focus:ring-primary/20 dark:border-white/10 dark:bg-card cursor-pointer"
            >
              <SlidersHorizontal className="size-3.5 text-muted-foreground mr-1.5 shrink-0" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="end" className="rounded-xl">
              <SelectItem value="current-first" className="text-xs">
                {t(L.sortCurrentFirst, locale)}
              </SelectItem>
              <SelectItem value="semester-asc" className="text-xs">
                {t(L.sortSemesterAsc, locale)}
              </SelectItem>
              <SelectItem value="code-asc" className="text-xs">
                {t(L.sortCodeAsc, locale)}
              </SelectItem>
              <SelectItem value="name-asc" className="text-xs">
                {t(L.sortNameAsc, locale)}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

export function LibraryEmptyState({
  onReset,
  className,
}: {
  onReset: () => void;
  className?: string;
}) {
  const { locale } = useLocale();

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 bg-card/50 p-8 text-center sm:p-12 dark:border-white/10",
        className
      )}
    >
      <div className="flex size-12 items-center justify-center rounded-2xl bg-muted/60 text-muted-foreground mb-3.5">
        <SearchX className="size-6 text-muted-foreground/80" />
      </div>
      <h3 className="text-base font-bold text-foreground">
        {t(L.emptyTitle, locale)}
      </h3>
      <p className="mt-1 max-w-md text-xs sm:text-sm text-muted-foreground leading-relaxed">
        {t(L.emptySubtitle, locale)}
      </p>
      <div className="mt-5">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onReset}
          className="gap-2 rounded-full border-border/80 hover:bg-muted text-xs cursor-pointer"
        >
          <RotateCcw className="size-3.5" />
          <span>{t(L.resetButton, locale)}</span>
        </Button>
      </div>
    </div>
  );
}
