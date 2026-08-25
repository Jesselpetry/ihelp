"use client";

import { useMemo, useState } from "react";
import { GraduationCap, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useLocale, t, type LText } from "@/lib/i18n";
import {
  COURSES,
  GROUPS,
  courseDir,
} from "@/lib/catalog";
import { CourseBookCard } from "@/components/course-book-card";

const L: Record<string, LText> = {
  title: { th: "คลังเรียนรู้ IT KMITL", en: "IT KMITL Learning Hub" },
  subtitle: {
    th: "สรุปเนื้อหา แบบทดสอบ คลังโจทย์ และสไลด์เลกเชอร์ ของรายวิชาชั้นปีที่ 1 รวมไว้ที่เดียว",
    en: "Summaries, quizzes, problem banks, and lecture slides for every first-year course, in one place",
  },
  search: { th: "ค้นหารายวิชา ชื่อ หรือรหัสวิชา...", en: "Search a course, name, or code..." },
  noResults: { th: "ไม่พบรายวิชาที่ตรงกับคำค้นหา", en: "No course matches your search" },
  courses: { th: "รายวิชา", en: "courses" },
};

/**
 * @param overviews directory names (see courseDir) that have an overview
 *   document on disk. Resolved on the server so a course gains its overview
 *   chip the moment the markdown lands, with no edit here.
 */
export function CourseDirectory({ overviews = [] }: { overviews?: string[] }) {
  const { locale } = useLocale();
  const [query, setQuery] = useState("");

  const courses = useMemo(() => {
    const has = new Set(overviews);
    return COURSES.map((c) =>
      has.has(courseDir(c))
        ? { ...c, tracks: { overview: `/courses/${courseDir(c)}`, ...c.tracks } }
        : c,
    );
  }, [overviews]);

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

      <div className="relative mb-8 animate-in fade-in-0 slide-in-from-bottom-2 duration-500 delay-100 fill-mode-both">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t(L.search, locale)}
          aria-label={t(L.search, locale)}
          className="h-11 rounded-full pl-10 transition-shadow focus-visible:ring-2 focus-visible:ring-primary/20"
        />
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
          return (
            <section
              key={group.id}
              className="animate-in fade-in-0 slide-in-from-bottom-4 duration-600 fill-mode-both"
              style={{ animationDelay: `${groupIdx * 120}ms` }}
            >
              <div className="mb-4 flex items-baseline justify-between gap-3 border-b pb-2.5">
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-wider text-foreground">
                    {t(group.label, locale)}
                  </h2>
                  <p className="mt-0.5 text-xs text-muted-foreground/80">
                    {t(group.note, locale)}
                  </p>
                </div>
                <span className="shrink-0 font-mono text-xs text-muted-foreground">
                  {courses.length} {t(L.courses, locale)}
                </span>
              </div>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {courses.map((c) => (
                  <CourseBookCard key={c.code} course={c} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}
