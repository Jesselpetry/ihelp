"use client";

import { useState } from "react";
import { ChevronDown, BookOpen } from "lucide-react";
import type { CatalogCourse, CourseGroup } from "@/lib/courses/catalog";
import { CourseBookCard } from "@/components/course-book-card";
import { useLocale, t, type LText } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const GROUP_CAL: Record<CourseGroup, { year: string; sem: string; shortTh: string; shortEn: string }> = {
  "Y1-S1": { year: "1", sem: "1", shortTh: "ปี 1 · เทอม 1", shortEn: "Y1 · S1" },
  "Y1-S2": { year: "1", sem: "2", shortTh: "ปี 1 · เทอม 2", shortEn: "Y1 · S2" },
  "EN-KMITL": { year: "—", sem: "—", shortTh: "EN-KMITL", shortEn: "EN-KMITL" },
};

function SemesterCalendar({
  groupId,
  isCurrent,
}: {
  groupId: CourseGroup;
  isCurrent?: boolean;
}) {
  const cal = GROUP_CAL[groupId];
  if (!cal || groupId === "EN-KMITL") {
    return (
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border/80 bg-muted/60">
        <BookOpen className="size-4 text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex size-9 shrink-0 flex-col overflow-hidden rounded-lg border border-border/80 shadow-xs">
      {/* Top bar — year */}
      <div
        className={cn(
          "flex h-3 items-center justify-center text-[8px] font-bold leading-none select-none",
          isCurrent
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground"
        )}
      >
        Y{cal.year}
      </div>
      {/* Body — semester number */}
      <div className="flex flex-1 items-center justify-center bg-card text-sm font-black leading-none text-foreground select-none">
        S{cal.sem}
      </div>
    </div>
  );
}

export interface SemesterGroupProps {
  groupId: CourseGroup;
  groupLabel: LText;
  groupNote?: LText;
  courses: CatalogCourse[];
  readiness: Record<string, number>;
  isCurrent?: boolean;
  defaultOpen?: boolean;
  searchQuery?: string;
  className?: string;
}

export function SemesterGroup({
  groupId,
  groupLabel,
  groupNote,
  courses,
  readiness,
  isCurrent = false,
  defaultOpen = isCurrent,
  searchQuery = "",
  className,
}: SemesterGroupProps) {
  const { locale } = useLocale();
  const [userOpen, setUserOpen] = useState<boolean | null>(null);

  // Derived state: Auto-expand when a search query is active, otherwise respect user toggle or default
  const isSearching = searchQuery.trim().length > 0;
  const isOpen = isSearching ? true : (userOpen ?? defaultOpen);

  if (courses.length === 0) return null;

  return (
    <section
      id={`semester-${groupId.toLowerCase()}`}
      className={cn(
        "rounded-2xl border bg-card shadow-xs transition-all duration-200 overflow-hidden",
        isCurrent
          ? "border-primary/30 ring-1 ring-primary/10"
          : "border-border/80 dark:border-white/10",
        className
      )}
    >
      {/* ── Card Accordion Header Bar ── */}
      <button
        type="button"
        onClick={() => setUserOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={`semester-content-${groupId.toLowerCase()}`}
        className="flex w-full items-center justify-between gap-3 p-3.5 sm:p-4 text-left transition-colors hover:bg-muted/40 cursor-pointer select-none"
      >
        {/* Left: Calendar badge + Title + Current Term badge + Subtitle */}
        <div className="flex items-center gap-3 min-w-0">
          <SemesterCalendar groupId={groupId} isCurrent={isCurrent} />

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm sm:text-base font-bold tracking-tight text-foreground truncate">
                {t(groupLabel, locale)}
              </h3>

              {isCurrent && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow-2xs">
                  <span className="size-1.5 rounded-full bg-emerald-500" />
                  {locale === "th" ? "ภาคเรียนปัจจุบัน" : "Current Term"}
                </span>
              )}
            </div>

            {groupNote && (
              <p className="mt-0.5 text-[11px] text-muted-foreground/80 line-clamp-1">
                {t(groupNote, locale)}
              </p>
            )}
          </div>
        </div>

        {/* Right slot: Course count and chevron indicator */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-muted/40 px-2.5 py-0.5 font-mono text-[11px] font-medium text-muted-foreground">
            <BookOpen className="size-3 opacity-60" />
            <span>
              {courses.length} {locale === "th" ? "รายวิชา" : "courses"}
            </span>
          </span>

          <div className="flex size-7 items-center justify-center rounded-lg text-muted-foreground">
            <ChevronDown
              className={cn(
                "size-4 transition-transform duration-300",
                isOpen ? "rotate-180" : "rotate-0"
              )}
            />
          </div>
        </div>
      </button>

      {/* ── Collapsible Course Cards Stream (Zero-layout-shift CSS Grid) ── */}
      <div
        id={`semester-content-${groupId.toLowerCase()}`}
        className={cn(
          "grid transition-[grid-template-rows,opacity] duration-300 ease-in-out",
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden">
          <div className="flex flex-col gap-2.5 sm:gap-3 p-3.5 sm:p-4 pt-0 border-t border-border/60 dark:border-white/5">
            {courses.map((course) => (
              <CourseBookCard
                key={course.code}
                course={course}
                readiness={readiness[course.code] ?? 0}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
