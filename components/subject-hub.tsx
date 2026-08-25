"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { useLocale, t, type LText } from "@/lib/i18n";
import type { QuizQuestion } from "@/lib/quiz";
import type { CourseTrackItem } from "@/lib/course-tracks";
import { SubjectTrackGrid } from "@/components/subject-track-grid";
import { ItKmitlBadge } from "@/components/it-kmitl-badge";
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
  /** Official subject details page on https://www.it.kmitl.ac.th */
  officialUrl?: string;
  /** Action cards, already resolved by lib/course-tracks.ts. */
  tracks: CourseTrackItem[];
  overviewTitle: LText;
  chapters: SubjectChapter[];
  questions: QuizQuestion[];
  /** Optional footer note rendered below the chapter table */
  footerNote?: LText;
  /** Overrides the "Ch." prefix in the overview list (e.g. "Week" for MFIT) */
  chapterLabel?: LText;
  /** Official scraped IT KMITL subject information */
  officialInfo?: ScrapedCourseInfo | null;
}

const L: Record<string, LText> = {
  chapter: { th: "บทที่", en: "Ch." },
  questions: { th: "ข้อ", en: "q" },
};

export function SubjectHub({
  backHref,
  backLabel,
  title,
  subtitle,
  officialUrl,
  tracks,
  overviewTitle,
  chapters,
  questions,
  footerNote,
  chapterLabel,
  officialInfo,
}: SubjectHubProps) {
  const { locale } = useLocale();

  const countByChapter = useMemo(() => {
    const counts: Record<number, number> = {};
    for (const q of questions) {
      if (q.chapter === undefined) continue;
      counts[q.chapter] = (counts[q.chapter] ?? 0) + 1;
    }
    return counts;
  }, [questions]);

  return (
    <main className="mx-auto max-w-3xl px-3 sm:px-6 py-6 sm:py-10 w-full space-y-6">
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

      {/* Official Scraped IT KMITL Overview */}
      {officialInfo && (
        <CourseOfficialInfo info={officialInfo} officialUrl={officialUrl} />
      )}

      {/* Chapter overview */}
      {chapters && chapters.length > 0 && (
        <div className="rounded-3xl border bg-card p-5 sm:p-6 shadow-xs">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {t(overviewTitle, locale)}
          </h3>
          <ul className="mt-3 space-y-1.5">
            {chapters.map(({ chapter, title: chTitle }) => {
              const count = countByChapter[chapter] ?? 0;
              return (
                <li
                  key={chapter}
                  className="flex items-center justify-between gap-3 rounded-xl px-2.5 py-1.5 text-sm"
                >
                  <span className="min-w-0 truncate">
                    <span className="font-mono text-muted-foreground">
                      {t(chapterLabel ?? L.chapter, locale)} {chapter}
                    </span>{" "}
                    {t(chTitle, locale)}
                  </span>
                  <Badge
                    variant={count > 0 ? "default" : "outline"}
                    className="rounded-full font-mono text-[10px] shrink-0"
                  >
                    {count} {t(L.questions, locale)}
                  </Badge>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {footerNote && (
        <p className="text-xs sm:text-sm text-muted-foreground">
          {t(footerNote, locale)}
        </p>
      )}
    </main>
  );
}
