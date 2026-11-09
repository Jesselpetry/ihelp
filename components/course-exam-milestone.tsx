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

  const defaultBadgeText = isMidterm
    ? locale === "th"
      ? "ขอบเขตกลางภาค"
      : "Midterm Scope"
    : locale === "th"
      ? "ขอบเขตปลายภาค"
      : "Final Scope";

  const badgeText = milestone.scopeBadge
    ? t(milestone.scopeBadge, locale)
    : defaultBadgeText;

  const aside = (
    <span className="shrink-0 rounded-full bg-primary/10 border border-primary/25 px-2.5 py-0.5 text-xs font-medium text-primary">
      {badgeText}
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
              className="group flex items-center gap-3 px-4 py-3 sm:py-3.5 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:via-rose-500 hover:to-red-600 text-white border border-red-500/25 transition-colors"
            >
              <span className="flex size-9 sm:size-10 shrink-0 items-center justify-center rounded-xl bg-white/15 text-white">
                <Flame className="size-5" />
              </span>
              <div className="flex min-w-0 flex-1 items-center">
                <span className="text-base sm:text-lg font-bold text-white tracking-tight truncate">
                  {t(milestone.studyGuide.title, locale)}
                </span>
              </div>
              <ChevronRight className="size-5 shrink-0 text-white/80 transition-transform group-hover:translate-x-0.5 group-hover:text-white" />
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
