"use client";

import { useState } from "react";
import Link from "next/link";
import { useLocale, t, type LText } from "@/lib/i18n";
import type { QuizQuestion } from "@/lib/quiz";
import type { CourseTrackItem } from "@/lib/course-tracks";
import { SubjectTrackGrid } from "@/components/subject-track-grid";
import { ItKmitlBadge } from "@/components/it-kmitl-badge";
import { CourseSummaryCard } from "@/components/course-summary-card";
import { CourseOfficialInfo } from "@/components/course-official-info";
import type { ScrapedCourseInfo } from "@/lib/course-content";

export interface SubjectChapter {
  chapter: number;
  title: LText;
}

interface SubjectHubProps {
  /** Link back to the course directory */
  backHref: string;
  backLabel: LText;
  title: LText;
  subtitle: LText;
  courseCode?: string;
  courseNameTh?: string;
  courseNameEn?: string;
  officialCode?: string;
  credits?: string;
  summaryMarkdown?: string | null;
  /** Official subject details page on https://www.it.kmitl.ac.th */
  officialUrl?: string;
  /** Action cards, already resolved by lib/course-tracks.ts. */
  tracks: CourseTrackItem[];
  overviewTitle?: LText;
  chapters?: SubjectChapter[];
  questions?: QuizQuestion[];
  /** Optional footer note rendered below the chapter table */
  footerNote?: LText;
  /** Overrides the "Ch." prefix in the overview list (e.g. "Week" for MFIT) */
  chapterLabel?: LText;
  /** Official scraped IT KMITL subject information */
  officialInfo?: ScrapedCourseInfo | null;
}

export function SubjectHub({
  backHref,
  backLabel,
  title,
  subtitle,
  courseCode: _courseCode,
  courseNameTh: _courseNameTh,
  courseNameEn: _courseNameEn,
  officialCode: _officialCode,
  credits: _credits,
  summaryMarkdown,
  officialUrl,
  tracks,
  footerNote,
  officialInfo,
}: SubjectHubProps) {
  const { locale } = useLocale();
  const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);

  return (
    <main
      className={`mx-auto ${
        isSummaryExpanded
          ? "max-w-5xl lg:max-w-6xl xl:max-w-7xl"
          : "max-w-3xl"
      } px-3 sm:px-6 py-6 sm:py-10 w-full space-y-6 transition-all duration-300 ease-in-out`}
    >
      {/* Back link & official badge */}
      <div className="flex items-center justify-between gap-3">
        <Link
          href={backHref}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors font-medium"
        >
          {t(backLabel, locale)}
        </Link>
        {officialUrl && <ItKmitlBadge href={officialUrl} />}
      </div>

      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          {t(title, locale)}
        </h1>
        <p className="mt-1.5 text-sm sm:text-base text-muted-foreground">
          {t(subtitle, locale)}
        </p>
      </div>

      <SubjectTrackGrid tracks={tracks} />

      {/* Summary Markdown Card — on top of ภาพรวมรายวิชาอย่างเป็นทางการ card */}
      {summaryMarkdown && (
        <CourseSummaryCard
          markdown={summaryMarkdown}
          expanded={isSummaryExpanded}
          onExpandedChange={setIsSummaryExpanded}
        />
      )}

      {/* Official Scraped IT KMITL Overview */}
      {officialInfo && (
        <CourseOfficialInfo info={officialInfo} officialUrl={officialUrl} />
      )}

      {footerNote && (
        <p className="text-xs sm:text-sm text-muted-foreground">
          {t(footerNote, locale)}
        </p>
      )}
    </main>
  );
}
