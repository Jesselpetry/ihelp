"use client";

import Link from "next/link";
import { ItKmitlBadge } from "@/components/it-kmitl-badge";
import { CourseWatermark } from "@/components/course-watermark";
import { useLocale, t, type LText } from "@/lib/i18n";
import { IHELP_GRADIENT_CSS } from "@/lib/courses/course-theme";

export interface CourseBannerProps {
  backHref: string;
  backLabel: LText;
  /** Short code, e.g. "ICS". */
  code: string;
  name: LText;
  /** Already joined, e.g. "06016411 · 3 (2-2-5)". */
  meta: string;
  /** One-line course description. */
  tagline?: LText | null;
  /** Faculty page; the badge is left out without it. */
  officialUrl?: string;
}

/**
 * Standardized course banner:
 * - Signature iHelp tri-stop blue gradient background
 * - Translucent white hairline border (`border border-white/10`) & ambient shadow
 * - Context-aware watermark logo (GE white logo / KMITL seal / IT KMITL logo)
 * - Clean uncluttered typography and metadata
 */
export function CourseBanner({
  backHref,
  backLabel,
  code,
  name,
  meta,
  tagline,
  officialUrl,
}: CourseBannerProps) {
  const { locale } = useLocale();

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <Link
          href={backHref}
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          {t(backLabel, locale)}
        </Link>
        {officialUrl && <ItKmitlBadge href={officialUrl} />}
      </div>

      <header
        style={{ background: IHELP_GRADIENT_CSS }}
        className="relative isolate flex min-h-28 flex-col justify-end overflow-hidden rounded-2xl border border-white/10 p-4 text-white shadow-sm sm:min-h-36 sm:p-5"
      >
        {/*
         * Standardized course watermark logo bleeding off the bottom-right corner
         */}
        <CourseWatermark code={code} size="banner" />

        <div className="space-y-1 relative z-10">
          <span className="inline-block rounded-full bg-white/15 px-2.5 py-0.5 font-mono text-[11px] font-bold text-white tracking-wide">
            {code}
          </span>
          <h1 className="text-xl font-bold leading-tight sm:text-2xl text-white">{t(name, locale)}</h1>
          {meta && <p className="text-xs sm:text-sm text-white/85 font-mono">{meta}</p>}
          {tagline && (
            <p className="line-clamp-2 text-xs sm:text-sm text-white/90 sm:line-clamp-1">{t(tagline, locale)}</p>
          )}
        </div>
      </header>
    </div>
  );
}
