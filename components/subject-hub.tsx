"use client";

import { useState } from "react";
import { Info } from "lucide-react";
import { useLocale, t, type LText } from "@/lib/i18n";
import type { ModuleScope, ResolvedModule } from "@/lib/courses/spine";
import { CourseBanner } from "@/components/course-banner";
import { CourseSidebar } from "@/components/course-sidebar";
import { CourseOverview } from "@/components/course-overview";
import { CourseWeeklyTimeline } from "@/components/course-weekly-timeline";
import { CourseContributors } from "@/components/course-contributors";
import type { OverviewTab } from "@/components/course-hub-shared";
import type { ScrapedCourseInfo } from "@/lib/courses/course-content";
import type { CourseTimelineData } from "@/lib/courses/course-timeline-types";

export interface SubjectHubProps {
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
  /** All eleven spine modules from lib/courses/spine */
  modules: ResolvedModule[];
  /** Caveats attached to individual modules */
  notes?: { title: LText; note: LText }[];
  /** Official scraped IT KMITL subject information */
  officialInfo?: ScrapedCourseInfo | null;
  /** The weekly timeline roadmap and isolated exam milestones */
  timeline: CourseTimelineData;
  /** Href to the course archive library */
  libraryHref: string;
}

/**
 * A course hub laid out like a Google Classroom class page:
 * - Panel ซ้าย: CourseSidebar with exam scope filter, topics jump list, and archive library
 * - Panel ขวา: Main stream containing CourseOverview, the new Weekly Sessions, and notes
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
  timeline,
  libraryHref,
}: SubjectHubProps) {
  const { locale } = useLocale();
  const [scope, setScope] = useState<ModuleScope>("all");
  const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);

  const overviewTabs: OverviewTab[] = [
    ...(summaryMarkdown ? (["summary"] as const) : []),
    ...(officialInfo ? (["official"] as const) : []),
  ];
  const [overviewTab, setOverviewTab] = useState<OverviewTab>(
    overviewTabs[0] ?? "summary",
  );

  const selectOverviewTab = (next: OverviewTab) => {
    if (next !== "summary") setIsSummaryExpanded(false);
    setOverviewTab(next);
  };

  const reading = isSummaryExpanded && overviewTab === "summary";

  return (
    <main
      className={`mx-auto w-full ${
        reading ? "max-w-5xl lg:max-w-6xl" : "max-w-5xl"
      } space-y-5 px-3 py-5 transition-all duration-300 ease-in-out sm:px-5 sm:py-6`}
    >
      {/* ── 1. Course Banner ── */}
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

      {/* ── 2. Classroom 2-Panel Layout: Panel ซ้าย (Sidebar) + Panel ขวา (Stream) ── */}
      <div
        className={`grid gap-5 ${reading ? "" : "lg:grid-cols-[230px_minmax(0,1fr)] lg:gap-6"}`}
      >
        {!reading && (
          <CourseSidebar
            modules={modules}
            scope={scope}
            onScopeChange={setScope}
            hasOverview={overviewTabs.length > 0}
            weeksCount={timeline.weeks.length}
            hasMidtermMilestone={Boolean(timeline.midtermMilestone)}
            hasFinalMilestone={Boolean(timeline.finalMilestone)}
            hasSecondHalf={timeline.weeks.some(
              (w) => w.scope === "final" || (w.scope === "all" && w.weekNumber > 7),
            )}
          />
        )}

        <div className="min-w-0 space-y-6">
          {/* Section 1: ภาพรวมรายวิชา (Clean CourseOverview) */}
          <CourseOverview
            summaryMarkdown={summaryMarkdown}
            officialInfo={officialInfo}
            officialUrl={officialUrl}
            tab={overviewTab}
            expanded={isSummaryExpanded}
            onExpandedChange={setIsSummaryExpanded}
            scope={scope}
            onShowAll={() => setScope("all")}
          />

          {/* Section 2: บทเรียนรายสัปดาห์ (Weekly Sessions + Milestones) */}
          {timeline.weeks.length > 0 && (
            <CourseWeeklyTimeline
              weeks={timeline.weeks}
              midtermMilestone={timeline.midtermMilestone}
              finalMilestone={timeline.finalMilestone}
              libraryHref={libraryHref}
              scope={reading ? "all" : scope}
            />
          )}

          {/* Section 3: ข้อชี้แจงเกี่ยวกับแนวข้อสอบ */}
          {notes && notes.length > 0 && (
            <div className="rounded-2xl border border-border/70 bg-card/60 p-4 text-xs text-muted-foreground shadow-2xs">
              <div className="flex items-center gap-1.5 font-semibold text-foreground/85 text-[11px] uppercase tracking-wider mb-2.5">
                <Info className="size-3.5 text-primary shrink-0" />
                <span>
                  {locale === "th" ? "ข้อชี้แจงเกี่ยวกับแนวข้อสอบ" : "Course Material Notes"}
                </span>
              </div>
              <div className="space-y-2 text-[11px] sm:text-xs">
                {notes.map(({ title, note }) => (
                  <div
                    key={t(title, locale)}
                    className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2 rounded-lg bg-muted/40 p-2.5 leading-relaxed"
                  >
                    <span className="font-semibold text-foreground/90 shrink-0">
                      {t(title, locale)}
                    </span>
                    <span className="text-muted-foreground">
                      {t(note, locale)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 4: ผู้จัดทำและร่วมแบ่งปันเนื้อหา (Course Contributors & Authors) */}
          <CourseContributors courseCode={code} />
        </div>
      </div>
    </main>
  );
}
