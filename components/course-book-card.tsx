"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useLocale } from "@/lib/i18n";
import { courseHref, type CatalogCourse } from "@/lib/courses/catalog";
import { ItKmitlBadge, ItKmitlLogoSvg } from "@/components/it-kmitl-badge";

/**
 * MIT OpenCourseWare-inspired horizontal course card with:
 * - Rounded container, padding, and subtle shadow (`shadow-sm`)
 * - Left thumbnail frame using iHelp blue gradient with course code and subject name
 * - Center area with title, subtitle/description, official code, credits, and readiness modules
 * - Right area with academic level badge, official KMITL link, and course hub action button
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
        "group relative flex flex-col sm:flex-row items-stretch sm:items-center gap-4 rounded-2xl border bg-card p-3 sm:p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-primary/40 " +
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

      {/* ── Left Thumbnail: iHelp Signature Blue Gradient with Subject Name ── */}
      <div className="relative w-full sm:w-48 md:w-56 h-28 sm:h-32 shrink-0 rounded-xl overflow-hidden shadow-xs flex flex-col justify-between p-3 select-none bg-gradient-to-br from-[#2a68c4] via-[#2357A5] to-[#123160] border border-white/15 dark:border-white/10 transition-transform duration-300 group-hover:scale-[1.01]">
        {/* Subtle light shimmer */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-white/20"
        />

        {/* Subtle IT KMITL Logo watermark */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-3 -right-3 text-white/15 select-none transition-all duration-300 group-hover:scale-110 group-hover:opacity-100"
        >
          <ItKmitlLogoSvg className="size-24 text-white" />
        </div>

        {/* Top Header inside frame: Code & Faculty */}
        <div className="relative z-10 flex items-center justify-between">
          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-xs text-[11px] font-mono font-bold text-white tracking-wider border border-white/20 shadow-2xs">
            {course.code}
          </span>
          <span className="font-mono text-[10px] font-medium tracking-wider text-white/70 uppercase">
            IT KMITL
          </span>
        </div>

        {/* Course Name inside frame (Bottom) */}
        <div className="relative z-10 mt-auto">
          <p className="text-xs sm:text-sm font-bold text-white leading-snug drop-shadow-xs line-clamp-2">
            {title}
          </p>
        </div>
      </div>

      {/* ── Center Description / Details ── */}
      <div className="flex-1 min-w-0 flex flex-col justify-center py-0.5">
        <h3 className="text-base sm:text-lg font-bold text-foreground group-hover:text-primary transition-colors tracking-tight line-clamp-1 sm:line-clamp-2">
          {title}
        </h3>

        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1 sm:line-clamp-2 mt-1 font-medium">
          {subtitle}
        </p>

        {/* Metadata Badges */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {course.officialCode && (
            <span className="font-mono text-xs font-semibold text-muted-foreground/90 bg-muted/70 dark:bg-muted/40 px-2.5 py-0.5 rounded-md border border-border/50">
              {course.officialCode}
            </span>
          )}
          {course.credits && (
            <span className="text-[11px] font-medium text-muted-foreground bg-muted/50 dark:bg-muted/30 px-2 py-0.5 rounded-md border border-border/40">
              {locale === "th" ? `${course.credits} หน่วยกิต` : `${course.credits} credits`}
            </span>
          )}
          <span
            className="inline-flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground bg-muted/50 dark:bg-muted/30 px-2 py-0.5 rounded-md border border-border/40"
            title={locale === "th" ? "โมดูลที่พร้อมแล้ว" : "Modules ready"}
          >
            <span
              className={`size-1.5 rounded-full ${liveCount > 0 ? "bg-emerald-500" : "bg-muted-foreground/40"}`}
            />
            <span>
              {readiness}/11 {locale === "th" ? "โมดูลพร้อม" : "modules ready"}
            </span>
          </span>
        </div>
      </div>

      {/* ── Right Section: Level, Official Link & Action Button ── */}
      <div className="relative z-20 shrink-0 flex sm:flex-col items-start sm:items-end justify-between self-stretch gap-2.5 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/40">
        <div className="flex items-center gap-2">
          {course.officialUrl && (
            <ItKmitlBadge href={course.officialUrl} className="shrink-0" />
          )}
          <span className="text-xs font-semibold text-primary/80 dark:text-primary/90 font-mono">
            {course.group === "EN-KMITL"
              ? "EN-KMITL"
              : locale === "th"
                ? "ปริญญาตรี"
                : "Undergraduate"}
          </span>
        </div>

        <div className="mt-auto flex items-center gap-2">
          {href ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground shadow-xs transition-all duration-200 group-hover:bg-primary/90 group-hover:shadow-sm">
              <span>{locale === "th" ? "เข้าสู่รายวิชา" : "View Course"}</span>
              <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </span>
          ) : (
            <Badge variant="outline" className="rounded-full text-xs text-muted-foreground px-3 py-1">
              {locale === "th" ? "เร็ว ๆ นี้" : "Coming soon"}
            </Badge>
          )}
        </div>
      </div>
    </article>
  );
}
