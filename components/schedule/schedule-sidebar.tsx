"use client";

import Link from "next/link";
import { Calendar, Download, GraduationCap } from "lucide-react";
import { SURFACE } from "@/components/course-hub-shared";
import { CourseCodeBadge } from "@/components/grades/course-code-badge";
import { useLocale, t, type LText } from "@/lib/i18n";
import type { TimetableCourse } from "@/lib/schedule/types";

const L = {
  timetable: { th: "ตารางเรียน (Timetable)", en: "Weekly Timetable" },
  facultyHeading: { th: "วิชาบังคับคณะ (4 วิชา)", en: "Faculty Courses (4)" },
  genedHeading: { th: "วิชาศึกษาทั่วไป (2 วิชา)", en: "GenEd Electives (2)" },
  export: { th: "ส่งออกข้อมูล (Export)", en: "Export Data" },
  gradesLink: { th: "ผลการเรียน & คำนวณ GPA", en: "Grades & GPA" },
} satisfies Record<string, LText>;

export function ScheduleSidebar({
  facultyCourses,
  genedCourses,
  activeSection,
  onSelectSection,
}: {
  facultyCourses: TimetableCourse[];
  genedCourses: TimetableCourse[];
  activeSection: string;
  onSelectSection: (id: string) => void;
}) {
  const { locale } = useLocale();
  const allCourses = [...facultyCourses, ...genedCourses];

  return (
    <>
      {/* Mobile compact jump bar */}
      <nav
        aria-label="เมนูรายวิชา"
        className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:hidden"
      >
        <button
          type="button"
          onClick={() => onSelectSection("timetable")}
          className={`inline-flex shrink-0 items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
            activeSection === "timetable"
              ? "border-primary/40 bg-primary/10 text-primary"
              : "border-border/50 bg-card text-muted-foreground hover:text-foreground"
          }`}
        >
          <Calendar className="size-3.5" />
          <span>{t(L.timetable, locale)}</span>
        </button>

        {allCourses.map((course) => {
          const isActive = activeSection === course.code;

          return (
            <button
              key={course.code}
              type="button"
              onClick={() => onSelectSection(course.code)}
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

        <button
          type="button"
          onClick={() => onSelectSection("export")}
          className={`inline-flex shrink-0 items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
            activeSection === "export"
              ? "border-primary/40 bg-primary/10 text-primary"
              : "border-border/50 bg-card text-muted-foreground hover:text-foreground"
          }`}
        >
          <Download className="size-3.5" />
          <span>{t(L.export, locale)}</span>
        </button>
      </nav>

      {/* Desktop sticky sidebar */}
      <aside className="hidden lg:block">
        <div className="sticky top-20 space-y-3">
          <nav
            aria-label="เมนูจัดตารางเรียน"
            className={`${SURFACE} border border-border/40 p-2.5 space-y-1`}
          >
            <button
              type="button"
              onClick={() => onSelectSection("timetable")}
              className={`flex w-full items-center justify-between gap-2 rounded-xl px-2.5 py-2 text-left text-xs font-medium transition-colors cursor-pointer ${
                activeSection === "timetable"
                  ? "bg-primary/10 text-primary"
                  : "text-foreground/85 hover:bg-muted/70"
              }`}
            >
              <span className="inline-flex items-center gap-2 min-w-0">
                <Calendar className="size-3.5 shrink-0" />
                <span className="truncate">{t(L.timetable, locale)}</span>
              </span>
              <span className="shrink-0 text-xs text-muted-foreground">
                จ.-ศ.
              </span>
            </button>

            {/* Faculty Courses Group */}
            <div className="px-2.5 pt-2 pb-1 text-[11px] font-semibold text-primary">
              {t(L.facultyHeading, locale)}
            </div>

            <div className="space-y-0.5">
              {facultyCourses.map((course) => {
                const isActive = activeSection === course.code;
                const courseTitle =
                  locale === "th" ? course.nameTh : course.nameEn;

                return (
                  <button
                    key={course.code}
                    type="button"
                    onClick={() => onSelectSection(course.code)}
                    title={courseTitle}
                    className={`flex w-full items-center gap-2 rounded-xl px-2.5 py-1.5 text-left text-xs transition-colors cursor-pointer ${
                      isActive
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-foreground/85 hover:bg-muted/70"
                    }`}
                  >
                    <CourseCodeBadge code={course.code} />
                    <span className="min-w-0 flex-1 truncate">
                      {courseTitle}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* GenEd Courses Group */}
            <div className="px-2.5 pt-2.5 pb-1 text-[11px] font-semibold text-primary">
              {t(L.genedHeading, locale)}
            </div>

            <div className="space-y-0.5">
              {genedCourses.map((course) => {
                const isActive = activeSection === course.code;
                const courseTitle =
                  locale === "th" ? course.nameTh : course.nameEn;

                return (
                  <button
                    key={course.code}
                    type="button"
                    onClick={() => onSelectSection(course.code)}
                    title={courseTitle}
                    className={`flex w-full items-center gap-2 rounded-xl px-2.5 py-1.5 text-left text-xs transition-colors cursor-pointer ${
                      isActive
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-foreground/85 hover:bg-muted/70"
                    }`}
                  >
                    <CourseCodeBadge code={course.code} />
                    <span className="min-w-0 flex-1 truncate">
                      {courseTitle}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => onSelectSection("export")}
                className={`flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-left text-xs font-medium transition-colors cursor-pointer ${
                  activeSection === "export"
                    ? "bg-primary/10 text-primary"
                    : "text-foreground/85 hover:bg-muted/70"
                }`}
              >
                <Download className="size-3.5 shrink-0" />
                <span>{t(L.export, locale)}</span>
              </button>
            </div>
          </nav>

          <div className={`${SURFACE} border border-border/40 p-2.5`}>
            <Link
              href="/grades"
              className="flex items-center gap-2 rounded-xl px-2.5 py-2 text-xs text-foreground/85 transition-colors hover:bg-muted/70"
            >
              <GraduationCap className="size-3.5 shrink-0 text-primary" />
              <span>{t(L.gradesLink, locale)}</span>
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
