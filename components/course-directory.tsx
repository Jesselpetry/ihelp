"use client";

import { useMemo, useState } from "react";
import { GraduationCap, Search, X, CalendarDays, BookOpen, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocale, t, type LText } from "@/lib/i18n";
import { COURSES, GROUPS } from "@/lib/courses/catalog";
import { SITE } from "@/lib/site";
import { CourseBookCard } from "@/components/course-book-card";
import LIBRARY_TOTALS from "@/lib/library/library-totals.json";

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

      {/* ── Search Input Box (Same design as Exam Schedule) ── */}
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

      {/* Platform Stats Grid Column */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto mb-10 animate-in fade-in-0 duration-500 delay-150 fill-mode-both">
        <div className="rounded-2xl border bg-card/60 p-3 text-center shadow-xs hover:border-primary/30 transition-colors">
          <div className="font-mono text-xl sm:text-2xl font-bold text-foreground">{LIBRARY_TOTALS.courses}</div>
          <div className="text-[11px] sm:text-xs text-muted-foreground mt-0.5">
            {locale === "th" ? "รายวิชาในระบบ" : "Total Courses"}
          </div>
        </div>
        <div className="rounded-2xl border bg-card/60 p-3 text-center shadow-xs hover:border-primary/30 transition-colors">
          <div className="font-mono text-xl sm:text-2xl font-bold text-foreground">{LIBRARY_TOTALS.coursesWithLibrary}</div>
          <div className="text-[11px] sm:text-xs text-muted-foreground mt-0.5">
            {locale === "th" ? "วิชามีคลังสื่อ" : "With Library"}
          </div>
        </div>
        <div className="rounded-2xl border bg-card/60 p-3 text-center shadow-xs hover:border-primary/30 transition-colors">
          <div className="font-mono text-xl sm:text-2xl font-bold text-primary">{LIBRARY_TOTALS.assets}</div>
          <div className="text-[11px] sm:text-xs text-muted-foreground mt-0.5">
            {locale === "th" ? "การ์ดสื่อการเรียน" : "Study Cards"}
          </div>
        </div>
        <div className="rounded-2xl border bg-card/60 p-3 text-center shadow-xs hover:border-primary/30 transition-colors">
          <div className="font-mono text-xl sm:text-2xl font-bold text-primary">{LIBRARY_TOTALS.files}</div>
          <div className="text-[11px] sm:text-xs text-muted-foreground mt-0.5">
            {locale === "th" ? "ไฟล์ในระบบ" : "Distinct Files"}
          </div>
        </div>
      </div>

      {matches.length === 0 && (
        <p className="rounded-3xl border border-dashed py-12 text-center text-sm text-muted-foreground animate-in fade-in-0 duration-300">
          {t(L.noResults, locale)}
        </p>
      )}

      <div className="space-y-12">
        {GROUPS.map((group, groupIdx) => {
          const courses = matches.filter((c) => c.group === group.id);
          if (courses.length === 0) return null;

          // Pick an icon per group type
          const GroupIcon =
            group.id === "Y1-S1" || group.id === "Y1-S2"
              ? CalendarDays
              : Layers;

          return (
            <section
              key={group.id}
              className="animate-in fade-in-0 slide-in-from-bottom-4 duration-600 fill-mode-both"
              style={{ animationDelay: `${groupIdx * 120}ms` }}
            >
              <div className="mb-4 flex items-center justify-between gap-3 border-b pb-3">
                <div className="flex items-center gap-2.5">
                  {/* Group icon */}
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 dark:bg-primary/15">
                    <GroupIcon className="size-3.5 text-primary" />
                  </div>
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
                  {courses.length}{" "}
                  {t(L.courses, locale)}
                </span>
              </div>
              <div className="flex flex-col gap-3 sm:gap-3.5">
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
