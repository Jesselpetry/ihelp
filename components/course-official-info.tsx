"use client";

import { BookOpen, ShieldCheck, Users } from "lucide-react";
import { useLocale, t, type LText } from "@/lib/i18n";
import type { ScrapedCourseInfo } from "@/lib/course-content";

/**
 * What the faculty publishes about the course, as a panel rather than a card.
 *
 * Its own header, badge row and border moved up to CourseOverview, which shows
 * this behind the "ข้อมูลทางการจากคณะ" tab — see the note in
 * components/course-summary-panel.tsx for why the two stopped being cards.
 */
interface CourseOfficialInfoProps {
  info: ScrapedCourseInfo;
  className?: string;
}

const L = {
  description: { th: "คำอธิบายรายวิชา (Course Description)", en: "Course Description" },
  thaiDesc: { th: "ภาษาไทย", en: "Thai" },
  engDesc: { th: "English", en: "English" },
  prerequisites: { th: "วิชาบังคับก่อน", en: "Prerequisites" },
  none: { th: "ไม่มีวิชาบังคับก่อน", en: "None" },
  instructors: { th: "อาจารย์ผู้สอน", en: "Instructors" },
  faculty: { th: "คณาจารย์ประจำวิชา", en: "Course Faculty" },
} satisfies Record<string, LText>;

export function CourseOfficialInfo({ info, className = "" }: CourseOfficialInfoProps) {
  const { locale } = useLocale();

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Course Description */}
      {(info.descTh || info.descEn) && (
        <div className="space-y-3">
          <h4 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <BookOpen className="size-3.5" />
            {t(L.description, locale)}
          </h4>

          {info.descTh && (
            <div className="rounded-2xl border border-border/60 bg-muted/40 p-4 text-xs leading-relaxed text-foreground sm:text-sm">
              <span className="mb-1 inline-block rounded-sm bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                {t(L.thaiDesc, locale)}
              </span>
              <p className="mt-1">{info.descTh}</p>
            </div>
          )}

          {info.descEn && (
            <div className="rounded-2xl border border-border/40 bg-muted/20 p-4 text-xs italic leading-relaxed text-muted-foreground sm:text-sm">
              <span className="mb-1 inline-block rounded-sm bg-muted px-1.5 py-0.5 text-[10px] font-semibold not-italic text-foreground">
                {t(L.engDesc, locale)}
              </span>
              <p className="mt-1">{info.descEn}</p>
            </div>
          )}
        </div>
      )}

      {/* Meta Grid: Prerequisites, Instructors */}
      <div className="grid gap-4 border-t pt-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <ShieldCheck className="size-3.5" />
            {t(L.prerequisites, locale)}
          </span>
          <p className="text-xs font-medium text-foreground sm:text-sm">
            {info.prerequisites || t(L.none, locale)}
          </p>
        </div>

        <div className="space-y-1.5">
          <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <Users className="size-3.5" />
            {t(L.instructors, locale)}
          </span>
          {info.instructors && info.instructors.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {info.instructors.map((inst, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 rounded-full border bg-muted/60 px-2.5 py-0.5 text-xs text-foreground"
                >
                  <span>{inst.name}</span>
                  {inst.role && (
                    <span className="text-[10px] text-muted-foreground">({inst.role})</span>
                  )}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground sm:text-sm">{t(L.faculty, locale)}</p>
          )}
        </div>
      </div>
    </div>
  );
}
