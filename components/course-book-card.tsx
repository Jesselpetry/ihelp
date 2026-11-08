"use client";

import Link from "next/link";
import { ArrowRight, User, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useLocale } from "@/lib/i18n";
import { courseHref, type CatalogCourse } from "@/lib/courses/catalog";
import { ItKmitlBadge } from "@/components/it-kmitl-badge";
import { CourseWatermark } from "@/components/course-watermark";
import { IHELP_GRADIENT_CSS } from "@/lib/courses/course-theme";

/**
 * Compact horizontal course card:
 * - Left thumbnail: iHelp signature blue gradient, uniform course code font bottom-left,
 *   standardized course watermark logo bleeding bottom-right:
 *     - General Education Logo (white) for Charm School & Foundation English (GE)
 *     - KMITL Institute seal for EN-KMITL courses
 *     - IT KMITL logo for IT Faculty courses
 * - Center: title, subtitle, official code & credits as rounded-full Badge components
 * - Right: top-right official KMITL link, bottom-right course action button
 *
 * @param readiness how many of the eleven spine modules this course fills.
 *   Counted on the server from what each module actually binds, so the number
 *   on the shelf is the same number the hub reports.
 */
export function CourseBookCard({
  course,
  readiness = 0,
}: {
  course: CatalogCourse;
  readiness?: number;
}) {
  const { locale } = useLocale();
  const href = courseHref(course);
  const liveCount = readiness;

  const title = locale === "th" ? course.nameTh : course.nameEn;
  const subtitle = locale === "th" ? course.nameEn : course.nameTh;

  return (
    <article
      className={
        "group relative flex flex-col sm:flex-row items-stretch sm:items-center gap-3 rounded-2xl border bg-card p-2.5 sm:p-3 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-primary/40 " +
        (liveCount > 0
          ? "border-border/70 dark:border-white/10"
          : "border-dashed border-border/60 bg-muted/20 opacity-85")
      }
    >
      {/* ── Full Card Navigation Overlay ── */}
      {href && (
        <Link
          href={href}
          aria-label={title}
          className="absolute inset-0 z-10 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        />
      )}

      {/* ── Left Thumbnail: Course Code + Watermark Logo ── */}
      <div
        className="relative w-full sm:w-38 md:w-44 h-22 sm:h-24 shrink-0 rounded-xl overflow-hidden flex flex-col justify-end p-2.5 select-none border border-white/10 transition-transform duration-300 group-hover:scale-[1.01]"
        style={{ background: IHELP_GRADIENT_CSS }}
      >
        {/* Course Logo Watermark — bottom-right, bleeds outside frame */}
        <CourseWatermark code={course.code} course={course} size="thumbnail" />

        {/* Course Code — uniform font size for all courses, left-aligned */}
        <span className="relative z-10 font-black text-white leading-none tracking-tighter select-none text-2xl sm:text-[1.65rem] pr-6">
          {course.code}
        </span>
      </div>

      {/* ── Center Description / Details ── */}
      <div className="flex-1 min-w-0 flex flex-col justify-center py-0.5">
        <h3 className="text-sm sm:text-base font-bold text-foreground group-hover:text-primary transition-colors tracking-tight line-clamp-1 sm:line-clamp-2">
          {title}
        </h3>

        <p className="text-[11px] sm:text-xs text-muted-foreground line-clamp-1 sm:line-clamp-2 mt-0.5 font-medium">
          {subtitle}
        </p>

        {/* ── Instructors / Professors ── */}
        {course.instructors && course.instructors.length > 0 && (
          <div
            className="mt-1 flex items-center gap-1.5 text-[11px] text-muted-foreground/85"
            title={course.instructors.join(", ")}
          >
            {course.instructors.length > 1 ? (
              <Users className="size-3 shrink-0 text-muted-foreground/60" />
            ) : (
              <User className="size-3 shrink-0 text-muted-foreground/60" />
            )}
            <span className="line-clamp-1 font-normal">
              {course.instructors.join(" · ")}
            </span>
          </div>
        )}

        {/* Metadata Badges — rounded-full */}
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          {course.officialCode && (
            <Badge
              variant="secondary"
              className="rounded-full font-mono text-[10px] font-semibold px-2.5 py-0.5"
            >
              {course.officialCode}
            </Badge>
          )}
          {course.credits && (
            <Badge
              variant="outline"
              className="rounded-full text-[10px] font-medium px-2.5 py-0.5"
            >
              {locale === "th"
                ? `${course.credits} หน่วยกิต`
                : `${course.credits} credits`}
            </Badge>
          )}
        </div>
      </div>

      {/* ── Right Section: Top-Right IT Link & Bottom-Right Action Button ── */}
      <div className="relative z-20 shrink-0 flex sm:flex-col items-center sm:items-end justify-between self-stretch gap-2 pt-1.5 sm:pt-0 border-t sm:border-t-0 border-border/40">
        <div className="flex items-center justify-end">
          {course.officialUrl && (
            <ItKmitlBadge href={course.officialUrl} className="shrink-0" />
          )}
        </div>

        <div className="mt-auto flex items-center justify-end">
          {href ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-xs transition-all duration-200 group-hover:bg-primary/90 group-hover:shadow-sm">
              <span>{locale === "th" ? "เข้าสู่รายวิชา" : "View Course"}</span>
              <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </span>
          ) : (
            <Badge
              variant="outline"
              className="rounded-full text-xs text-muted-foreground px-2.5 py-1"
            >
              {locale === "th" ? "เร็ว ๆ นี้" : "Coming soon"}
            </Badge>
          )}
        </div>
      </div>
    </article>
  );
}
