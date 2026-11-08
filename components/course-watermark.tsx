"use client";

import Image from "next/image";
import { ItKmitlLogoSvg } from "@/components/it-kmitl-badge";
import { findCourseByCode, type CatalogCourse } from "@/lib/courses/catalog";
import { isGeCourse, isEnKmitlCourse } from "@/lib/courses/course-theme";

export type CourseWatermarkSize = "thumbnail" | "banner";

export interface CourseWatermarkProps {
  code: string;
  course?: CatalogCourse;
  officialCode?: string;
  group?: string;
  size?: CourseWatermarkSize;
  className?: string;
}

/**
 * Standardized course watermark logo component:
 * - General Education (CHARM, FE, FE2, SPORT, DL): white GE logo
 * - EN-KMITL (COMPRO, CHEM): official KMITL seal
 * - IT KMITL (ITF, ICS, MFIT, PSCP, DSA, OOP, etc.): white IT KMITL logo
 */
export function CourseWatermark({
  code,
  course,
  officialCode,
  group,
  size = "thumbnail",
  className = "",
}: CourseWatermarkProps) {
  const resolved = course ?? findCourseByCode(code);
  const resolvedOfficialCode = officialCode ?? resolved?.officialCode;
  const resolvedGroup = group ?? resolved?.group;

  const isGe = isGeCourse(code, resolvedOfficialCode);
  const isEn = isEnKmitlCourse(code, resolvedGroup, resolvedOfficialCode);

  if (size === "banner") {
    return (
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute select-none ${
          isGe
            ? "-bottom-3 -right-4 sm:-bottom-4 sm:-right-6 opacity-20"
            : isEn
              ? "-bottom-4 -right-4 sm:-bottom-6 sm:-right-6 opacity-25"
              : "-bottom-4 -right-4 sm:-bottom-6 sm:-right-6 text-white opacity-20"
        } ${className}`}
      >
        {isGe ? (
          <Image
            src="/ge-logo-white.webp"
            alt=""
            width={240}
            height={110}
            className="h-24 sm:h-32 w-auto object-contain select-none"
          />
        ) : isEn ? (
          <Image
            src="/kmitl-seal.svg"
            alt=""
            width={140}
            height={140}
            className="size-32 sm:size-40 object-contain select-none"
          />
        ) : (
          <ItKmitlLogoSvg className="size-32 sm:size-40" monochrome="currentColor" />
        )}
      </div>
    );
  }

  // Default: thumbnail size (for course cards)
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute select-none ${
        isGe
          ? "-bottom-2 -right-3 opacity-25"
          : isEn
            ? "-bottom-3 -right-3 opacity-30"
            : "-bottom-3 -right-3 text-white opacity-25"
      } ${className}`}
    >
      {isGe ? (
        <Image
          src="/ge-logo-white.webp"
          alt=""
          width={160}
          height={74}
          className="h-16 sm:h-18 w-auto object-contain select-none"
        />
      ) : isEn ? (
        <Image
          src="/kmitl-seal.svg"
          alt=""
          width={88}
          height={88}
          className="size-22 object-contain select-none"
        />
      ) : (
        <ItKmitlLogoSvg className="size-22" monochrome="currentColor" />
      )}
    </div>
  );
}
