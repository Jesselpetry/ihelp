"use client";

import { useState } from "react";
import { useLocale, t, type LText } from "@/lib/i18n";
import type { ModuleScope, ResolvedModule } from "@/lib/courses/spine";
import { SubjectTrackGrid } from "@/components/subject-track-grid";
import { CourseOverview } from "@/components/course-overview";
import { CourseBanner } from "@/components/course-banner";
import { CourseSidebar } from "@/components/course-sidebar";
import type { OverviewTab } from "@/components/course-hub-shared";
import type { ScrapedCourseInfo } from "@/lib/courses/course-content";

interface SubjectHubProps {
  /** Link back to the course directory */
  backHref: string;
  backLabel: LText;
  /** Short course code, e.g. "ICS". */
  code: string;
  name: LText;
  /** Official code and credits, already joined. */
  meta: string;
  /** The overview's lead line, lifted out of it by splitSummaryLead(). */
  tagline?: LText | null;
  /** The overview with its H1 and lead blockquote removed. */
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

/**
 * A course hub laid out like a Google Classroom class page.
 *
 * One banner says which course this is; a narrow sidebar holds what a student
 * reaches for from anywhere on the page — the exam-scope filter, the topic list
 * and the resource archive; the stream holds the overview and the four topic
 * sections as one column of equal-width items. The old hub stacked all of it in
 * one column — title, an overview card repeating the title, a promo banner for
 * the archive, a floating filter, then a two-column grid with empty placeholder
 * boxes — so the eye kept switching widths and the content started a screen down.
 *
 * Reading the full overview drops the sidebar and widens the page: the summary
 * brings its own outline, and two side rails would squeeze the text column.
 */
export function SubjectHub({
  backHref,
  backLabel,
  code,
  name,
  meta,
  tagline,
  summaryMarkdown,
  officialUrl,
  modules,
  notes,
  officialInfo,
}: SubjectHubProps) {
  const { locale } = useLocale();
  const [scope, setScope] = useState<ModuleScope>("all");
  const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);

  const overviewTabs: OverviewTab[] = [
    ...(summaryMarkdown ? (["summary"] as const) : []),
    ...(officialInfo ? (["official"] as const) : []),
  ];
  const [overviewTab, setOverviewTab] = useState<OverviewTab>(overviewTabs[0] ?? "summary");

  const selectOverviewTab = (next: OverviewTab) => {
    // The wide reading layout belongs to the summary, not two paragraphs of
    // faculty prose.
    if (next !== "summary") setIsSummaryExpanded(false);
    setOverviewTab(next);
  };

  const reading = isSummaryExpanded && overviewTab === "summary";

  return (
    <main
      className={`mx-auto w-full ${
        reading ? "max-w-5xl lg:max-w-6xl xl:max-w-7xl" : "max-w-6xl"
      } space-y-6 px-3 py-6 transition-all duration-300 ease-in-out sm:px-6 sm:py-8`}
    >
      <CourseBanner
        backHref={backHref}
        backLabel={backLabel}
        code={code}
        name={name}
        meta={meta}
        tagline={tagline}
        officialUrl={officialUrl}
        overviewTabs={overviewTabs}
        overviewTab={overviewTab}
        onOverviewTabChange={selectOverviewTab}
      />

      <div
        className={`grid gap-6 ${reading ? "" : "lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-8"}`}
      >
        {!reading && (
          <CourseSidebar
            modules={modules}
            scope={scope}
            onScopeChange={setScope}
            hasOverview={overviewTabs.length > 0}
          />
        )}

        <div className="min-w-0 space-y-8">
          <CourseOverview
            summaryMarkdown={summaryMarkdown}
            officialInfo={officialInfo}
            officialUrl={officialUrl}
            tab={overviewTab}
            expanded={isSummaryExpanded}
            onExpandedChange={setIsSummaryExpanded}
          />

          {/* The filter is hidden while reading, so it must not keep filtering. */}
          <SubjectTrackGrid modules={modules} scope={reading ? "all" : scope} />

          {notes && notes.length > 0 && (
            <div className="space-y-2 text-xs text-muted-foreground sm:text-sm">
              {notes.map(({ title, note }) => (
                <p key={t(title, locale)}>
                  <span className="font-medium text-foreground/80">{t(title, locale)}</span>
                  {" — "}
                  {t(note, locale)}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
