"use client";

import { ChevronUp, ExternalLink, Flag, Milestone } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CourseSummaryPanel,
  isSummaryCollapsible,
} from "@/components/course-summary-panel";
import { CourseOfficialInfo } from "@/components/course-official-info";
import {
  OVERVIEW_ANCHOR,
  OVERVIEW_TITLE,
  SURFACE,
  TopicHeader,
  type OverviewTab,
} from "@/components/course-hub-shared";
import { useLocale, t, type LText } from "@/lib/i18n";
import { filterParts, hasParts } from "@/lib/docs/parts";
import type { ModuleScope } from "@/lib/courses/spine";
import type { ScrapedCourseInfo } from "@/lib/courses/course-content";

/**
 * "What is this course?", as the first topic section of the hub's stream.
 *
 * It used to be a card of its own — icon, title, subtitle, badges, a tab bar in
 * a gray box, then the content — sitting inside a page that already had a
 * header, and with the "view full content" button shown twice. The hub is now
 * laid out like a Classroom class page, so this is a plain topic section: the
 * shared TopicHeader over one flat card.
 *
 * The banner owns the ฉบับย่อ / ทางการ switch, so `tab` and `expanded` arrive
 * from the hub instead of living here. The only expand control is the fade-out
 * button under the preview; once expanded, the header offers the way back.
 *
 * A summary that marks its two halves (lib/docs/parts.ts — ICS does) follows
 * the sidebar's exam-scope filter: picking มิดเทอม drops the second half from
 * the overview too, so a student revising one half never reads into the other.
 */
interface CourseOverviewProps {
  summaryMarkdown?: string | null;
  officialInfo?: ScrapedCourseInfo | null;
  /** Official subject page on https://www.it.kmitl.ac.th */
  officialUrl?: string;
  /** Which reading to show. Controlled by the hub; the switch lives in the banner. */
  tab: OverviewTab;
  /** Whether the full summary is open. The hub hides its sidebar while it is. */
  expanded: boolean;
  onExpandedChange: (expanded: boolean) => void;
  /** The hub's exam-scope filter; drops the other half of a marked summary. */
  scope: ModuleScope;
  /** Clears the filter — the sidebar is hidden while reading, so the notice offers it. */
  onShowAll: () => void;
}

const L = {
  collapseContent: { th: "ย่อเนื้อหา", en: "Collapse" },
  viewOfficial: { th: "ดูบนเว็บคณะฯ", en: "View on IT KMITL" },
  onlyMidterm: { th: "แสดงเฉพาะครึ่งแรก (ขอบเขตกลางภาค)", en: "Showing the first half only (midterm scope)" },
  onlyFinal: { th: "แสดงเฉพาะครึ่งหลัง (ขอบเขตปลายภาค)", en: "Showing the second half only (final scope)" },
  showAll: { th: "แสดงทั้งสองครึ่ง", en: "Show both halves" },
} satisfies Record<string, LText>;

export function CourseOverview({
  summaryMarkdown,
  officialInfo,
  officialUrl,
  tab,
  expanded,
  onExpandedChange,
  scope,
  onShowAll,
}: CourseOverviewProps) {
  const { locale } = useLocale();

  if (!summaryMarkdown && !officialInfo) return null;

  // A course with only one of the two readings must not render a blank card
  // when the banner still says the other one.
  const active: OverviewTab =
    tab === "summary" && !summaryMarkdown
      ? "official"
      : tab === "official" && !officialInfo
        ? "summary"
        : tab;

  // The expanded layout belongs to the summary; the official text is two
  // paragraphs and should never inherit it.
  const showExpanded = active === "summary" && expanded;
  const halved = summaryMarkdown ? hasParts(summaryMarkdown) : false;
  const filtered = halved && scope !== "all";
  const markdown = summaryMarkdown && filtered ? filterParts(summaryMarkdown, scope) : summaryMarkdown;
  const collapsible = markdown ? isSummaryCollapsible(markdown) : false;
  const ScopeIcon = scope === "final" ? Flag : Milestone;

  let aside = null;
  if (active === "official" && officialUrl) {
    aside = (
      <Button
        asChild
        variant="ghost"
        size="sm"
        className="h-7 gap-1 rounded-full px-2.5 text-xs text-muted-foreground hover:text-primary"
      >
        <a href={officialUrl} target="_blank" rel="noopener noreferrer">
          <span>{t(L.viewOfficial, locale)}</span>
          <ExternalLink className="size-3" />
        </a>
      </Button>
    );
  } else if (showExpanded && collapsible) {
    aside = (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onExpandedChange(false)}
        className="h-7 cursor-pointer gap-1 rounded-full px-2.5 text-xs text-muted-foreground hover:text-primary"
      >
        <ChevronUp className="size-3.5" />
        <span>{t(L.collapseContent, locale)}</span>
      </Button>
    );
  }

  return (
    <section>
      <TopicHeader id={OVERVIEW_ANCHOR} title={t(OVERVIEW_TITLE, locale)} aside={aside} />
      <div className={`${SURFACE} p-5 sm:p-6`}>
        {active === "summary" && filtered && (
          <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-1 rounded-xl bg-primary/5 px-3 py-2 text-xs">
            <ScopeIcon className="size-3.5 shrink-0 text-primary" aria-hidden="true" />
            <span className="font-medium text-primary">
              {t(scope === "final" ? L.onlyFinal : L.onlyMidterm, locale)}
            </span>
            <button
              type="button"
              onClick={onShowAll}
              className="ml-auto cursor-pointer font-medium text-muted-foreground underline-offset-2 hover:text-primary hover:underline"
            >
              {t(L.showAll, locale)}
            </button>
          </div>
        )}
        {active === "summary" && markdown && (
          <CourseSummaryPanel
            markdown={markdown}
            expanded={showExpanded}
            onExpandedChange={onExpandedChange}
          />
        )}
        {active === "official" && officialInfo && <CourseOfficialInfo info={officialInfo} />}
      </div>
    </section>
  );
}
