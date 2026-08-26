"use client";

import { useState } from "react";
import Link from "next/link";
import { useLocale, t, type LText } from "@/lib/i18n";
import type { ResolvedModule } from "@/lib/spine";
import { SubjectTrackGrid } from "@/components/subject-track-grid";
import { ItKmitlBadge } from "@/components/it-kmitl-badge";
import { CourseSummaryCard } from "@/components/course-summary-card";
import { CourseOfficialInfo } from "@/components/course-official-info";
import type { ScrapedCourseInfo } from "@/lib/course-content";

interface SubjectHubProps {
  /** Link back to the course directory */
  backHref: string;
  backLabel: LText;
  title: LText;
  subtitle: LText;
  summaryMarkdown?: string | null;
  /** Official subject details page on https://www.it.kmitl.ac.th */
  officialUrl?: string;
  /** All eleven spine modules, already resolved by lib/spine.ts. */
  modules: ResolvedModule[];
  /**
   * Caveats a course attached to individual modules, each labelled with the
   * module it belongs to — that a bank is derived from a review guide rather
   * than the real paper, where the marks actually sit, and so on.
   */
  notes?: { title: LText; note: LText }[];
  /** Official scraped IT KMITL subject information */
  officialInfo?: ScrapedCourseInfo | null;
}

export function SubjectHub({
  backHref,
  backLabel,
  title,
  subtitle,
  summaryMarkdown,
  officialUrl,
  modules,
  notes,
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

      <SubjectTrackGrid modules={modules} />

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

      {notes && notes.length > 0 && (
        <div className="space-y-2 text-xs sm:text-sm text-muted-foreground">
          {notes.map(({ title, note }) => (
            <p key={t(title, locale)}>
              <span className="font-medium text-foreground/80">{t(title, locale)}</span>
              {" — "}
              {t(note, locale)}
            </p>
          ))}
        </div>
      )}
    </main>
  );
}
