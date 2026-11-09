"use client";

import Link from "next/link";
import { BookOpen, ChevronRight, Flame, Target } from "lucide-react";
import { SURFACE, TopicHeader } from "@/components/course-hub-shared";
import { useLocale, t } from "@/lib/i18n";
import type { CourseExamMilestoneData } from "@/lib/courses/course-timeline-types";

export interface CourseExamMilestoneProps {
  milestone: CourseExamMilestoneData;
}

export function CourseExamMilestone({ milestone }: CourseExamMilestoneProps) {
  const { locale } = useLocale();
  const isMidterm = milestone.scope === "midterm";
  const isFinal = milestone.scope === "final";
  const headerId = isMidterm ? "milestone-midterm" : "milestone-final";

  const aside = (
    <span className="rounded-full bg-primary/10 border border-primary/25 px-2.5 py-0.5 text-xs font-medium text-primary">
      {isMidterm
        ? locale === "th"
          ? "ขอบเขตกลางภาค"
          : "Midterm Scope"
        : locale === "th"
          ? "ขอบเขตปลายภาค"
          : "Final Scope"}
    </span>
  );

  const questionStat = milestone.mockExam?.questionCount
    ? `${milestone.mockExam.questionCount} ${locale === "th" ? "ข้อสอบ" : "items"}`
    : null;

  return (
    <div className="pt-8 sm:pt-10">
      <TopicHeader id={headerId} title={t(milestone.title, locale)} aside={aside} />

      <div className="flex flex-col gap-2.5">
        {milestone.studyGuide && (
          isFinal ? (
            <Link
              href={milestone.studyGuide.href}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 p-4 sm:p-5 text-white shadow-lg shadow-red-950/25 hover:shadow-xl hover:shadow-red-600/35 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 border border-red-400/40"
            >
              <div className="absolute -top-10 -right-10 size-32 rounded-full bg-white/10 blur-xl pointer-events-none" />
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
                <div className="flex items-start sm:items-center gap-3 min-w-0">
                  <span className="flex size-11 sm:size-12 shrink-0 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm text-white shadow-inner">
                    <Flame className="size-6 text-white animate-pulse" />
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-bold text-white tracking-wide uppercase">
                        War Room · 35 คะแนนเต็ม
                      </span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug">
                      {locale === "th" ? "สอบปลายภาค" : "Final Examination"}
                    </h3>
                    {milestone.studyGuide.subtitle && (
                      <p className="text-xs sm:text-sm text-white/90 font-medium line-clamp-1 mt-0.5">
                        {t(milestone.studyGuide.subtitle, locale)}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                  <span className="inline-flex items-center gap-1.5 rounded-xl bg-white text-red-600 font-bold px-4 py-2 text-xs sm:text-sm shadow-md group-hover:bg-neutral-100 group-hover:shadow-lg transition-all">
                    {locale === "th" ? "เข้าสู่ War Room" : "Enter War Room"}
                    <ChevronRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </div>
            </Link>
          ) : (
            <Link
              href={milestone.studyGuide.href}
              className={`group flex items-center gap-2.5 px-3.5 py-2.5 transition-[box-shadow,background-color] hover:bg-primary/[0.03] hover:shadow-md dark:hover:bg-primary/10 border border-yellow-500/30 dark:border-yellow-400/20 ${SURFACE}`}
            >
              <span className="flex size-8.5 shrink-0 items-center justify-center rounded-full bg-yellow-500/15 text-yellow-600 dark:bg-yellow-400/15 dark:text-yellow-400">
                <BookOpen className="size-4" />
              </span>
              <div className="flex min-w-0 flex-1 items-center">
                <span className="min-w-0 truncate text-xs sm:text-sm font-medium">
                  {t(milestone.studyGuide.title, locale)}
                </span>
              </div>
              <ChevronRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
            </Link>
          )
        )}

        {milestone.mockExam && (
          <Link
            href={milestone.mockExam.href}
            className={`group flex items-center gap-2.5 px-3.5 py-2.5 transition-[box-shadow,background-color] hover:bg-primary/[0.03] hover:shadow-md dark:hover:bg-primary/10 border border-primary/25 ${SURFACE}`}
          >
            <span className="flex size-8.5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Target className="size-4" />
            </span>
            <div className="flex min-w-0 flex-1 items-center">
              <span className="min-w-0 truncate text-xs sm:text-sm font-medium">
                {t(milestone.mockExam.title, locale)}
              </span>
            </div>
            {questionStat && (
              <span className="hidden shrink-0 text-xs tabular-nums text-muted-foreground sm:block">
                {questionStat}
              </span>
            )}
            <ChevronRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
          </Link>
        )}
      </div>
    </div>
  );
}
