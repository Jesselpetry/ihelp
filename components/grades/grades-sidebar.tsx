"use client";

import Link from "next/link";
import { Archive, LayoutList } from "lucide-react";
import { SURFACE } from "@/components/course-hub-shared";
import { type GradesCourseEntry } from "@/lib/grades/y1s1-courses";
import { useLocale, t, type LText } from "@/lib/i18n";
import { CourseCodeBadge } from "./course-code-badge";

const L = {
  overview: { th: "ภาพรวมทั้งหมด", en: "Overview" },
  coursesHeading: { th: "รายวิชา", en: "Courses" },
  archive: { th: "ตารางสอบ 1/2569 (Archive)", en: "1/2569 Exam Archive" },
  courseCount: { th: "7 วิชา", en: "7 courses" },
} satisfies Record<string, LText>;

export function GradesSidebar({
  courses,
  activeSection,
  onSelectOverview,
  onSelectCourse,
}: {
  courses: GradesCourseEntry[];
  activeSection: string;
  onSelectOverview: () => void;
  onSelectCourse: (code: string) => void;
}) {
  const { locale } = useLocale();

  return (
    <>
      {/* Mobile compact jump bar */}
      <nav
        aria-label={t(L.coursesHeading, locale)}
        className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:hidden"
      >
        <button
          type="button"
          onClick={onSelectOverview}
          className={`inline-flex shrink-0 items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
            activeSection === "overview"
              ? "border-primary/40 bg-primary/10 text-primary"
              : "border-border/50 bg-card text-muted-foreground hover:text-foreground"
          }`}
        >
          <LayoutList className="size-3.5" />
          <span>{t(L.overview, locale)}</span>
        </button>

        {courses.map((course) => {
          const isActive = activeSection === course.code;

          return (
            <button
              key={course.code}
              type="button"
              onClick={() => onSelectCourse(course.code)}
              title={locale === "th" ? course.nameTh : course.nameEn}
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-xl border px-2 py-1 text-xs transition-colors cursor-pointer ${
                isActive
                  ? "border-primary/50 bg-primary/10"
                  : "border-border/50 bg-card hover:border-border"
              }`}
            >
              <CourseCodeBadge code={course.code} />
            </button>
          );
        })}
      </nav>

      {/* Desktop sticky sidebar */}
      <aside className="hidden lg:block">
        <div className="sticky top-20 space-y-3">
          <nav
            aria-label={t(L.coursesHeading, locale)}
            className={`${SURFACE} border border-border/40 p-2.5 space-y-1`}
          >
            <button
              type="button"
              onClick={onSelectOverview}
              className={`flex w-full items-center justify-between gap-2 rounded-xl px-2.5 py-2 text-left text-xs font-medium transition-colors cursor-pointer ${
                activeSection === "overview"
                  ? "bg-primary/10 text-primary"
                  : "text-foreground/85 hover:bg-muted/70"
              }`}
            >
              <span className="inline-flex items-center gap-2 min-w-0">
                <LayoutList className="size-3.5 shrink-0" />
                <span className="truncate">{t(L.overview, locale)}</span>
              </span>
              <span className="shrink-0 font-mono text-[11px] text-muted-foreground">
                {t(L.courseCount, locale)}
              </span>
            </button>

            <div className="px-2.5 pt-2 pb-1 text-[11px] font-medium text-muted-foreground">
              {t(L.coursesHeading, locale)}
            </div>

            <div className="space-y-0.5">
              {courses.map((course) => {
                const isActive = activeSection === course.code;
                const courseTitle = locale === "th" ? course.nameTh : course.nameEn;

                return (
                  <button
                    key={course.code}
                    type="button"
                    onClick={() => onSelectCourse(course.code)}
                    title={courseTitle}
                    className={`flex w-full items-center gap-2 rounded-xl px-2.5 py-1.5 text-left text-xs transition-colors cursor-pointer ${
                      isActive
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-foreground/85 hover:bg-muted/70"
                    }`}
                  >
                    <CourseCodeBadge code={course.code} />
                    <span className="min-w-0 flex-1 truncate">{courseTitle}</span>
                  </button>
                );
              })}
            </div>
          </nav>

          <div className={`${SURFACE} border border-border/40 p-2.5`}>
            <Link
              href="/exam-schedule/archive"
              className="flex items-center gap-2 rounded-xl px-2.5 py-2 text-xs text-foreground/85 transition-colors hover:bg-muted/70"
            >
              <Archive className="size-3.5 shrink-0 text-muted-foreground" />
              <span>{t(L.archive, locale)}</span>
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
