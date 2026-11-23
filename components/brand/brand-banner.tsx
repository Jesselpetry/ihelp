"use client";

import React from "react";
import { CourseWatermark, type CourseWatermarkSize } from "@/components/course-watermark";
import { IHELP_GRADIENT_CSS } from "@/lib/courses/course-theme";

export interface BrandBannerProps {
  /** Watermark code, e.g. "IT", "ICS", "ITF", "GE" */
  watermarkCode?: string;
  watermarkSize?: CourseWatermarkSize;
  /** Badge or category chip rendered at the top */
  badge?: React.ReactNode;
  /** Main title heading */
  title: React.ReactNode;
  /** Subtitle or description */
  subtitle?: React.ReactNode;
  /** Identity pill, button, or custom action slot */
  action?: React.ReactNode;
  /** Custom extra children elements inside the banner */
  children?: React.ReactNode;
  className?: string;
  headerClassName?: string;
}

/**
 * Standard iHelp Brand Banner container.
 *
 * Encapsulates the official iHelp visual styling:
 * - Signature Tri-Stop Royal Blue Gradient (`IHELP_GRADIENT_CSS`)
 * - Translucent hairline border (`border border-white/10`)
 * - Rounded corners (`rounded-2xl`)
 * - Ambient micro-shadow (`shadow-sm`)
 * - Context-aware watermark bleeding bottom-right at 25% opacity
 * - Clean white typography hierarchy (`text-white`, `text-white/80`)
 */
export function BrandBanner({
  watermarkCode = "IT",
  watermarkSize = "banner",
  badge,
  title,
  subtitle,
  action,
  children,
  className = "",
  headerClassName = "",
}: BrandBannerProps) {
  return (
    <header
      style={{ background: IHELP_GRADIENT_CSS }}
      className={`relative isolate flex min-h-28 flex-col justify-end overflow-hidden rounded-2xl border border-white/10 p-4 text-white shadow-sm sm:min-h-36 sm:p-5 ${headerClassName} ${className}`}
    >
      {watermarkCode && <CourseWatermark code={watermarkCode} size={watermarkSize} />}

      <div className="relative z-10 min-w-0 space-y-1.5">
        {badge && <div className="mb-1">{badge}</div>}
        {typeof title === "string" ? (
          <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
            {title}
          </h1>
        ) : (
          title
        )}
        {subtitle && (
          <p className="max-w-2xl text-xs leading-relaxed text-white/80 sm:text-sm">
            {subtitle}
          </p>
        )}
        {action && <div className="pt-1.5">{action}</div>}
        {children}
      </div>
    </header>
  );
}
