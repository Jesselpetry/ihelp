"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { useLocale } from "@/lib/i18n";
import { courseHref, type CatalogCourse, COURSE_COLORS } from "@/lib/catalog";
import { ItKmitlBadge, ItKmitlLogoSvg } from "@/components/it-kmitl-badge";

const DEFAULT_THEME_COLOR = "#2357A5";

/**
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
  const courseColor = COURSE_COLORS[course.code] ?? DEFAULT_THEME_COLOR;

  const title = locale === "th" ? course.nameTh : course.nameEn;
  const subtitle = locale === "th" ? course.nameEn : course.nameTh;

  return (
    <div className="[perspective:1200px] w-full">
      <article
        style={{ "--course-color": courseColor } as React.CSSProperties}
        className={
          "group relative flex flex-col justify-between overflow-hidden rounded-r-2xl rounded-l-sm border transition-all duration-300 ease-out transform-gpu origin-left aspect-[1/1.08] min-h-[200px] sm:min-h-[220px] " +
          (liveCount > 0
            ? "bg-card hover:-translate-y-2 hover:[transform:rotateY(-7deg)_rotateX(2deg)_scale(1.02)] hover:shadow-[-3px_8px_20px_-4px_rgba(0,0,0,0.08),8px_16px_28px_-6px_rgba(35,87,165,0.18)] hover:border-[var(--course-color)]/60" +
              (href ? " cursor-pointer" : "")
            : "border-dashed bg-muted/20 opacity-85")
        }
      >
        {/* ── Spine hinge crease line ── */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-2.5 z-30 w-[1px] bg-border/60 transition-colors duration-300 group-hover:bg-[var(--course-color)]/40"
        />

        {/* ── Spine depth sheen effect on lift ── */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 z-30 w-3 bg-gradient-to-r from-black/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-white/10"
        />

        {/* ── Full Card Navigation Overlay ── */}
        {href && (
          <Link
            href={href}
            aria-label={title}
            className="absolute inset-0 z-10 rounded-r-2xl rounded-l-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        )}

        {/* ── Subtle IT KMITL Watermark Logo (Bottom-Right) ── */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 right-0 z-10 select-none opacity-[0.04] transition-all duration-300 group-hover:scale-110 group-hover:opacity-[0.12] dark:opacity-[0.08] dark:group-hover:opacity-[0.16]"
        >
          <ItKmitlLogoSvg className="size-40 shrink-0" />
        </div>

        {/* ── BOOK COVER BODY ── */}
        <div className="relative flex flex-1 flex-col p-4.5 pl-5.5 pb-4 text-left">
          {/* ── Top Header: Badges & Official IT KMITL Link ── */}
          <div className="relative z-20 flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <Badge
                variant={liveCount > 0 ? "default" : "outline"}
                className="rounded-md px-2.5 py-0.5 font-mono text-xs font-bold tracking-tight transition-transform duration-300 group-hover:scale-105"
                style={{
                  backgroundColor: liveCount > 0 ? courseColor : undefined,
                  borderColor: liveCount === 0 ? courseColor : undefined,
                  color: liveCount > 0 ? "#ffffff" : undefined,
                }}
              >
                {course.code}
              </Badge>
              {course.officialCode && (
                <span className="font-mono text-xs font-semibold text-muted-foreground">
                  {course.officialCode}
                </span>
              )}
              <span
                className="font-mono text-[11px] font-semibold text-muted-foreground/70"
                title={locale === "th" ? "โมดูลที่พร้อมแล้ว" : "Modules ready"}
              >
                {readiness}/11
              </span>
            </div>

            {/* Official IT KMITL Link Badge */}
            {course.officialUrl && (
              <ItKmitlBadge href={course.officialUrl} className="shrink-0" />
            )}
          </div>

          {/* ── Editorial Title Section (Top-Left Aligned) ── */}
          <div className="relative z-20 mt-6 pointer-events-none text-left">
            {/* Large Bold Main Subject Title */}
            <h3 className="text-lg sm:text-xl font-black leading-tight tracking-tight text-foreground transition-colors group-hover:text-[var(--course-color)]">
              {title}
            </h3>

            {/* Dynamic Secondary Subtitle */}
            <p className="mt-1.5 text-xs sm:text-sm font-semibold text-muted-foreground/80 leading-snug line-clamp-2">
              {subtitle}
            </p>
          </div>

          {/* ── Bottom Publication Meta ── */}
          <div className="relative z-20 mt-auto pt-3 pointer-events-none flex items-center justify-between border-t border-border/40 text-[11px] font-mono font-medium text-muted-foreground/70">
            <span>KMITL</span>
            <span>{course.group}</span>
          </div>
        </div>

        {/* ── Solid Book Footer Band (Course Theme Color) ── */}
        <div
          aria-hidden="true"
          className="relative z-20 h-2.5 sm:h-3 w-full shrink-0 transition-colors duration-200"
          style={{ backgroundColor: courseColor }}
        />
      </article>
    </div>
  );
}
