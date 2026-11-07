"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useLocale } from "@/lib/i18n";
import { courseHref, type CatalogCourse } from "@/lib/courses/catalog";
import { ItKmitlBadge, ItKmitlLogoSvg } from "@/components/it-kmitl-badge";

/** iHelp signature blue — single palette for all courses */
const IHELP_GRADIENT = { from: "#3a72c8", via: "#2357A5", to: "#163980" };

/**
 * MIT OpenCourseWare-inspired horizontal course card with:
 * - Rounded container, padding, and subtle shadow (`shadow-sm`)
 * - Left thumbnail frame: large course code text + IT KMITL logo watermark (white/10 opacity)
 * - Center area with title, subtitle/description, official code badge, credits, and readiness modules
 * - Right area with official KMITL link and course hub action button
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

  const grad = IHELP_GRADIENT;

  // Font size scales down as the code gets longer
  const codeFontSize =
    course.code.length <= 2
      ? "3rem"
      : course.code.length === 3
        ? "2.75rem"
        : course.code.length === 4
          ? "2.25rem"
          : "1.75rem";

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

      {/* ── Left Thumbnail: Large Course Code + IT KMITL Logo Watermark ── */}
      <div
        className="relative w-full sm:w-48 md:w-56 h-28 sm:h-32 shrink-0 rounded-xl overflow-hidden shadow-xs flex flex-col justify-between p-3 select-none border border-white/10 transition-transform duration-300 group-hover:scale-[1.01]"
        style={{
          background: `linear-gradient(135deg, ${grad.from}, ${grad.via}, ${grad.to})`,
        }}
      >
        {/* IT KMITL Logo — white, ~10% opacity, bottom-right, bleeds outside frame */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-5 -right-5 select-none"
        >
          <ItKmitlLogoSvg className="size-28 opacity-[0.10]" />
        </div>

        {/* Top right: "IT KMITL" label */}
        <div className="relative z-10 flex items-center justify-end">
          <span className="font-mono text-[10px] font-medium tracking-widest text-white/60 uppercase">
            IT KMITL
          </span>
        </div>

        {/* Course Code — left-aligned, large, bottom of frame */}
        <div className="relative z-10 mt-auto">
          <span
            className="font-mono font-black text-white leading-none tracking-tighter select-none drop-shadow-none"
            style={{ fontSize: codeFontSize }}
          >
            {course.code}
          </span>
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
            <Badge
              variant="secondary"
              className="font-mono text-xs font-semibold px-2.5 py-0.5 rounded-md"
            >
              {course.officialCode}
            </Badge>
          )}
          {course.credits && (
            <Badge
              variant="outline"
              className="text-[11px] font-medium px-2 py-0.5 rounded-md"
            >
              {locale === "th"
                ? `${course.credits} หน่วยกิต`
                : `${course.credits} credits`}
            </Badge>
          )}
          <Badge
            variant="outline"
            className={`inline-flex items-center gap-1.5 text-[11px] font-medium px-2 py-0.5 rounded-md ${
              liveCount > 0
                ? "text-emerald-600 dark:text-emerald-400 border-emerald-500/30 bg-emerald-500/5"
                : "text-muted-foreground"
            }`}
            title={locale === "th" ? "โมดูลที่พร้อมแล้ว" : "Modules ready"}
          >
            <span
              className={`size-1.5 rounded-full ${liveCount > 0 ? "bg-emerald-500" : "bg-muted-foreground/40"}`}
            />
            <span>
              {readiness}/11{" "}
              {locale === "th" ? "โมดูลพร้อม" : "modules ready"}
            </span>
          </Badge>
        </div>
      </div>

      {/* ── Right Section: Official Link & Action Button ── */}
      <div className="relative z-20 shrink-0 flex sm:flex-col items-start sm:items-end justify-between self-stretch gap-2.5 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/40">
        <div className="flex items-center gap-2">
          {course.officialUrl && (
            <ItKmitlBadge href={course.officialUrl} className="shrink-0" />
          )}
        </div>

        <div className="mt-auto flex items-center gap-2">
          {href ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground shadow-xs transition-all duration-200 group-hover:bg-primary/90 group-hover:shadow-sm">
              <span>{locale === "th" ? "เข้าสู่รายวิชา" : "View Course"}</span>
              <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </span>
          ) : (
            <Badge
              variant="outline"
              className="rounded-full text-xs text-muted-foreground px-3 py-1"
            >
              {locale === "th" ? "เร็ว ๆ นี้" : "Coming soon"}
            </Badge>
          )}
        </div>
      </div>
    </article>
  );
}
