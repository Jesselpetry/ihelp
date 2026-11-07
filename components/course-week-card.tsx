"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { SURFACE } from "@/components/course-hub-shared";
import { useLocale, t } from "@/lib/i18n";
import type { CourseWeekCardData } from "@/lib/courses/course-timeline-types";

export interface CourseWeekCardProps {
  week: CourseWeekCardData;
  libraryHref: string;
}

export function CourseWeekCard({ week, libraryHref }: CourseWeekCardProps) {
  const { locale } = useLocale();

  const targetHref = week.readerHref ?? (week.totalFiles > 0 ? libraryHref : null);

  const statText =
    week.totalFiles > 0
      ? `${week.totalFiles} ${locale === "th" ? "ไฟล์" : "files"}`
      : week.quizCount > 0
        ? `${week.quizCount} ${locale === "th" ? "ข้อ" : "items"}`
        : null;

  const content = (
    <div
      className={`group flex items-center gap-2.5 px-3.5 py-2.5 transition-[box-shadow,background-color] hover:bg-primary/[0.03] hover:shadow-md dark:hover:bg-primary/10 ${SURFACE}`}
    >
      {/* Circular icon with week number */}
      <span className="flex size-8.5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold tabular-nums">
        {String(week.weekNumber).padStart(2, "0")}
      </span>

      <div className="flex min-w-0 flex-1 flex-col justify-center">
        <span className="min-w-0 truncate text-xs sm:text-sm font-medium text-foreground">
          {t(week.title, locale)}
        </span>
        {week.description && (
          <p className="truncate text-xs text-muted-foreground/80 mt-0.5">
            {t(week.description, locale)}
          </p>
        )}
      </div>

      {statText && (
        <span className="hidden shrink-0 text-xs tabular-nums text-muted-foreground sm:block">
          {statText}
        </span>
      )}

      {targetHref && (
        <ChevronRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
      )}
    </div>
  );

  if (targetHref) {
    return (
      <Link href={targetHref} className="block no-underline">
        {content}
      </Link>
    );
  }

  return content;
}
