"use client";

import {
  BookOpen,
  GraduationCap,
  Users,
  ShieldCheck,
  Building2,
  ExternalLink,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLocale, type LText } from "@/lib/i18n";
import type { ScrapedCourseInfo } from "@/lib/course-content";

interface CourseOfficialInfoProps {
  info: ScrapedCourseInfo;
  officialUrl?: string;
  className?: string;
}

const L: Record<string, LText> = {
  sectionTitle: { th: "ภาพรวมรายวิชาอย่างเป็นทางการ", en: "Official Course Overview" },
  sourceKmitl: { th: "คณะเทคโนโลยีสารสนเทศ สจล.", en: "School of IT, KMITL" },
  description: { th: "คำอธิบายรายวิชา (Course Description)", en: "Course Description" },
  thaiDesc: { th: "ภาษาไทย", en: "Thai" },
  engDesc: { th: "English", en: "English" },
  credits: { th: "หน่วยกิต", en: "Credits" },
  level: { th: "ระดับการศึกษา", en: "Level" },
  bachelor: { th: "ปริญญาตรี", en: "Undergraduate" },
  prerequisites: { th: "วิชาบังคับก่อน", en: "Prerequisites" },
  none: { th: "ไม่มีวิชาบังคับก่อน", en: "None" },
  instructors: { th: "อาจารย์ผู้สอน", en: "Instructors" },
  faculty: { th: "คณาจารย์ประจำวิชา", en: "Course Faculty" },
  programs: { th: "หลักสูตรที่เปิดสอน", en: "Curricula" },
  viewOfficial: { th: "ดูบนเว็บคณะฯ", en: "View on IT KMITL" },
};

export function CourseOfficialInfo({
  info,
  officialUrl,
  className = "",
}: CourseOfficialInfoProps) {
  const { locale } = useLocale();

  return (
    <div
      // The hub's "ภาพรวมรายวิชา" card scrolls here. scroll-mt clears the
      // sticky navbar so the heading is not hidden under it on arrival.
      id="course-overview"
      className={`scroll-mt-20 rounded-3xl border bg-card p-5 sm:p-7 shadow-xs space-y-6 ${className}`}
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <GraduationCap className="size-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold leading-tight">
              {locale === "th" ? L.sectionTitle.th : L.sectionTitle.en}
            </h3>
            <p className="text-xs text-muted-foreground">
              {locale === "th" ? L.sourceKmitl.th : L.sourceKmitl.en} · รหัส {info.officialCode}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <Badge
            variant="outline"
            className="rounded-full text-[11px] font-medium border-primary/30 text-primary bg-primary/5"
          >
            {locale === "th" ? L.bachelor.th : L.bachelor.en}
          </Badge>
          <Badge variant="outline" className="rounded-full text-[11px] font-mono">
            {info.credits}
          </Badge>
          {officialUrl && (
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="h-7 gap-1 rounded-full text-xs text-muted-foreground hover:text-primary px-2.5"
            >
              <a href={officialUrl} target="_blank" rel="noopener noreferrer">
                <span>{locale === "th" ? L.viewOfficial.th : L.viewOfficial.en}</span>
                <ExternalLink className="size-3" />
              </a>
            </Button>
          )}
        </div>
      </div>

      {/* Course Description */}
      {(info.descTh || info.descEn) && (
        <div className="space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <BookOpen className="size-3.5" />
            {locale === "th" ? L.description.th : L.description.en}
          </h4>

          {info.descTh && (
            <div className="rounded-2xl bg-muted/40 border border-border/60 p-4 text-xs sm:text-sm leading-relaxed text-foreground">
              <span className="mb-1 inline-block rounded-sm bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                {locale === "th" ? L.thaiDesc.th : L.thaiDesc.en}
              </span>
              <p className="mt-1">{info.descTh}</p>
            </div>
          )}

          {info.descEn && (
            <div className="rounded-2xl bg-muted/20 border border-border/40 p-4 text-xs sm:text-sm leading-relaxed text-muted-foreground italic">
              <span className="mb-1 inline-block rounded-sm bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-foreground not-italic">
                {locale === "th" ? L.engDesc.th : L.engDesc.en}
              </span>
              <p className="mt-1">{info.descEn}</p>
            </div>
          )}
        </div>
      )}

      {/* Meta Grid: Prerequisites, Instructors, Programs */}
      <div className="grid gap-4 sm:grid-cols-2 pt-1 border-t">
        {/* Prerequisites */}
        <div className="space-y-1.5">
          <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
            <ShieldCheck className="size-3.5" />
            {locale === "th" ? L.prerequisites.th : L.prerequisites.en}
          </span>
          <p className="text-xs sm:text-sm font-medium text-foreground">
            {info.prerequisites || (locale === "th" ? L.none.th : L.none.en)}
          </p>
        </div>

        {/* Instructors */}
        <div className="space-y-1.5">
          <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
            <Users className="size-3.5" />
            {locale === "th" ? L.instructors.th : L.instructors.en}
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
                    <span className="text-[10px] text-muted-foreground">
                      ({inst.role})
                    </span>
                  )}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs sm:text-sm text-muted-foreground">
              {locale === "th" ? L.faculty.th : L.faculty.en}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
