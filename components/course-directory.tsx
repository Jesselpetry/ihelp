"use client";

import { useMemo, useState } from "react";
import { GraduationCap, Search, BookOpen, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocale, t, type LText } from "@/lib/i18n";
import { COURSES, GROUPS, type CourseGroup } from "@/lib/courses/catalog";
import { SITE } from "@/lib/site";
import { CourseBookCard } from "@/components/course-book-card";

const L: Record<string, LText> = {
  // The home page's headline is the site's tagline.
  title: SITE.tagline,
  subtitle: {
    th: "สรุปเนื้อหา แบบทดสอบ คลังโจทย์ และสไลด์เลกเชอร์ ของรายวิชาชั้นปีที่ 1 รวมไว้ที่เดียว",
    en: "Summaries, quizzes, problem banks, and lecture slides for every first-year course, in one place",
  },
  search: { th: "ค้นหารายวิชา ชื่อ หรือรหัสวิชา...", en: "Search a course, name, or code..." },
  searchButton: { th: "ค้นหา", en: "Search" },
  clearSearch: { th: "ล้างการค้นหา", en: "Clear search" },
  noResults: { th: "ไม่พบรายวิชาที่ตรงกับคำค้นหา", en: "No course matches your search" },
  courses: { th: "รายวิชา", en: "courses" },
};

/* ── Mini calendar gimmick for semester/group headers ── */

/** Map group ids to calendar-style short labels */
const GROUP_CAL: Record<CourseGroup, { year: string; sem: string; shortTh: string; shortEn: string }> = {
  "Y1-S1": { year: "1", sem: "1", shortTh: "ปี 1 · เทอม 1", shortEn: "Y1 · S1" },
  "Y1-S2": { year: "1", sem: "2", shortTh: "ปี 1 · เทอม 2", shortEn: "Y1 · S2" },
  "EN-KMITL": { year: "—", sem: "—", shortTh: "EN-KMITL", shortEn: "EN-KMITL" },
};

/**
 * Tiny calendar icon component — looks like a mini torn-off desk calendar page.
 * Shows the year number on top bar and semester number as the big date.
 */
function SemesterCalendar({ groupId }: { groupId: CourseGroup }) {
  const cal = GROUP_CAL[groupId];
  if (!cal || groupId === "EN-KMITL") {
    // For EN-KMITL, just show a book icon instead
    return (
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border/80 bg-muted/60">
        <BookOpen className="size-4 text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex size-9 shrink-0 flex-col overflow-hidden rounded-lg border border-border/80 shadow-xs">
      {/* Top bar — year */}
      <div className="flex h-3 items-center justify-center bg-primary text-[8px] font-bold text-primary-foreground leading-none">
        Y{cal.year}
      </div>
      {/* Body — semester number */}
      <div className="flex flex-1 items-center justify-center bg-card text-sm font-black leading-none text-foreground">
        S{cal.sem}
      </div>
    </div>
  );
}

/**
 * @param readiness how many of the eleven spine modules each course fills,
 *   keyed by course code. Measured on the server from what each module binds,
 *   so a course's shelf badge moves the moment its content lands.
 */
export function CourseDirectory({
  readiness = {},
}: {
  readiness?: Record<string, number>;
}) {
  const { locale } = useLocale();
  const [query, setQuery] = useState("");

  const courses = COURSES;

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return courses;
    return courses.filter((c) =>
      [c.code, c.officialCode ?? "", c.nameTh, c.nameEn, c.slug]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [courses, query]);

  return (
    <main className="mx-auto w-full max-w-5xl px-3 py-8 sm:px-6 sm:py-12 animate-in fade-in-0 duration-500">
      <div className="mb-8 text-center animate-in fade-in-0 slide-in-from-top-4 duration-500">
        <GraduationCap className="mx-auto size-9 text-primary" />
        <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
          {t(L.title, locale)}
        </h1>
        <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground sm:text-base">
          {t(L.subtitle, locale)}
        </p>
      </div>

      {/* ── Search Input Box (Exam Schedule Design) ── */}
      <div className="mx-auto mb-8 max-w-xl animate-in fade-in-0 slide-in-from-bottom-2 duration-500 delay-100 fill-mode-both">
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
          role="search"
          className="relative flex items-center shadow-sm rounded-full border bg-card/90 p-1.5 backdrop-blur-md transition-all focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20"
        >
          <Search className="ml-3 size-4 text-muted-foreground shrink-0" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t(L.search, locale)}
            aria-label={t(L.search, locale)}
            className="h-9 border-0 bg-transparent px-3 text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              title={t(L.clearSearch, locale)}
              aria-label={t(L.clearSearch, locale)}
              className="p-1 text-muted-foreground hover:text-foreground mr-1 transition-colors"
            >
              <X className="size-4" />
            </button>
          )}
          <Button
            type="submit"
            size="sm"
            className="rounded-full px-5 text-xs font-semibold"
          >
            {t(L.searchButton, locale)}
          </Button>
        </form>
      </div>

      {matches.length === 0 && (
        <p className="rounded-3xl border border-dashed py-12 text-center text-sm text-muted-foreground animate-in fade-in-0 duration-300">
          {t(L.noResults, locale)}
        </p>
      )}

      <div className="space-y-10">
        {GROUPS.map((group, groupIdx) => {
          const courses = matches.filter((c) => c.group === group.id);
          if (courses.length === 0) return null;
          return (
            <section
              key={group.id}
              className="animate-in fade-in-0 slide-in-from-bottom-4 duration-600 fill-mode-both"
              style={{ animationDelay: `${groupIdx * 120}ms` }}
            >
              {/* ── Section Header with Mini Calendar ── */}
              <div className="mb-4 flex items-center justify-between gap-3 border-b pb-3">
                <div className="flex items-center gap-2.5">
                  <SemesterCalendar groupId={group.id} />
                  <div>
                    <h2 className="text-sm font-bold tracking-tight text-foreground">
                      {t(group.label, locale)}
                    </h2>
                    <p className="mt-0.5 text-[11px] text-muted-foreground/70">
                      {t(group.note, locale)}
                    </p>
                  </div>
                </div>

                {/* Course count pill */}
                <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border/60 bg-muted/50 px-2.5 py-1 font-mono text-[11px] font-semibold text-muted-foreground">
                  <BookOpen className="size-3 opacity-60" />
                  {courses.length} {t(L.courses, locale)}
                </span>
              </div>

              <div className="flex flex-col gap-2.5 sm:gap-3">
                {courses.map((c) => (
                  <CourseBookCard key={c.code} course={c} readiness={readiness[c.code] ?? 0} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}
