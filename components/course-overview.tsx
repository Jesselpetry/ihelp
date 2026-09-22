"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, ExternalLink, GraduationCap, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CourseSummaryPanel,
  isSummaryCollapsible,
} from "@/components/course-summary-panel";
import { CourseOfficialInfo } from "@/components/course-official-info";
import { useLocale, t, type LText } from "@/lib/i18n";
import type { ScrapedCourseInfo } from "@/lib/courses/course-content";

/**
 * "What is this course?", answered once, at the top of the hub.
 *
 * Two things changed here at the same time, and they are the same change. The
 * hub used to open on the learning path — a numbered list of work — so the
 * first thing a newcomer met was a to-do list for a subject they had not yet
 * been told anything about. And the answer to "what is this subject?" was
 * split across two near-identical cards below it: the curated summary and the
 * faculty's official description, each with its own header and its own screen
 * of height, differing mostly in tone.
 *
 * So: one card, moved above the path, with the two readings behind a tab. The
 * curated summary leads because it is the one written for a student ("สรุป
 * เข้าใจง่าย"); the faculty's text is one tap away for anyone who wants the
 * official wording.
 */
interface CourseOverviewProps {
  summaryMarkdown?: string | null;
  officialInfo?: ScrapedCourseInfo | null;
  /** Official subject page on https://www.it.kmitl.ac.th */
  officialUrl?: string;
  /** Lifts the hub to a wider container while the full summary is open. */
  expanded: boolean;
  onExpandedChange: (expanded: boolean) => void;
}

type OverviewTab = "summary" | "official";

const L = {
  sectionTitle: { th: "ภาพรวมรายวิชา", en: "Course overview" },
  sectionSubtitle: {
    th: "อ่านก่อนเริ่ม — ขอบเขตเนื้อหา สัดส่วนคะแนน และมโนทัศน์สำคัญ",
    en: "Read this first — syllabus, grade weighting, and the key ideas",
  },
  tabSummary: { th: "สรุปเข้าใจง่าย", en: "Student summary" },
  tabOfficial: { th: "ข้อมูลทางการจากคณะ", en: "Official (School of IT)" },
  curated: { th: "เรียบเรียงใหม่", en: "Curated" },
  viewFullContent: { th: "ดูเนื้อหาฉบับเต็ม", en: "View full content" },
  collapseContent: { th: "ย่อเนื้อหา", en: "Collapse" },
  viewOfficial: { th: "ดูบนเว็บคณะฯ", en: "View on IT KMITL" },
  code: { th: "รหัส", en: "Code" },
} satisfies Record<string, LText>;

export function CourseOverview({
  summaryMarkdown,
  officialInfo,
  officialUrl,
  expanded,
  onExpandedChange,
}: CourseOverviewProps) {
  const { locale } = useLocale();
  const [tab, setTab] = useState<OverviewTab>(summaryMarkdown ? "summary" : "official");

  if (!summaryMarkdown && !officialInfo) return null;

  const tabs: { id: OverviewTab; label: LText }[] = [
    ...(summaryMarkdown ? [{ id: "summary" as const, label: L.tabSummary }] : []),
    ...(officialInfo ? [{ id: "official" as const, label: L.tabOfficial }] : []),
  ];

  // A tab that lost its content (a course with only one of the two) must not
  // leave the card blank.
  const active: OverviewTab = tabs.some((item) => item.id === tab) ? tab : tabs[0].id;

  const selectTab = (next: OverviewTab) => {
    // The expanded reading layout belongs to the summary. Leaving it on while
    // the official panel shows would keep the whole hub at max-w-7xl for two
    // paragraphs of faculty prose.
    if (next !== "summary") onExpandedChange(false);
    setTab(next);
  };

  const collapsible = summaryMarkdown ? isSummaryCollapsible(summaryMarkdown) : false;

  return (
    <section
      id="course-overview"
      className="scroll-mt-20 space-y-5 rounded-3xl border bg-card p-5 shadow-xs sm:p-7"
    >
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <GraduationCap className="size-5" />
          </div>
          <div>
            <h2 className="text-base font-bold leading-tight sm:text-lg">
              {t(L.sectionTitle, locale)}
            </h2>
            <p className="text-xs text-muted-foreground">{t(L.sectionSubtitle, locale)}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {active === "summary" ? (
            <Badge
              variant="outline"
              className="rounded-full border-primary/30 bg-primary/5 text-[11px] font-medium text-primary"
            >
              <Sparkles className="mr-1 size-3 text-primary" />
              {t(L.curated, locale)}
            </Badge>
          ) : (
            officialInfo && (
              <>
                <Badge variant="outline" className="rounded-full font-mono text-[11px]">
                  {officialInfo.officialCode}
                </Badge>
                <Badge variant="outline" className="rounded-full font-mono text-[11px]">
                  {officialInfo.credits}
                </Badge>
              </>
            )
          )}

          {active === "summary" && collapsible && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onExpandedChange(!expanded)}
              className="h-7.5 cursor-pointer gap-1.5 rounded-full border-primary/20 px-3 text-xs font-medium text-primary hover:bg-primary/10"
            >
              {expanded ? (
                <>
                  <ChevronUp className="size-3.5" />
                  <span>{t(L.collapseContent, locale)}</span>
                </>
              ) : (
                <>
                  <ChevronDown className="size-3.5" />
                  <span>{t(L.viewFullContent, locale)}</span>
                </>
              )}
            </Button>
          )}

          {active === "official" && officialUrl && (
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
          )}
        </div>
      </div>

      {/* Tabs — hidden when the course only has one of the two readings. */}
      {tabs.length > 1 && (
        <div
          role="tablist"
          aria-label={t(L.sectionTitle, locale)}
          className="flex gap-1 rounded-full border bg-muted/40 p-1"
        >
          {tabs.map(({ id, label }) => {
            const selected = active === id;
            return (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => selectTab(id)}
                className={`flex-1 cursor-pointer rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                  selected
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:bg-background hover:text-foreground"
                }`}
              >
                {t(label, locale)}
              </button>
            );
          })}
        </div>
      )}

      {/* Body */}
      {active === "summary" && summaryMarkdown && (
        <CourseSummaryPanel
          markdown={summaryMarkdown}
          expanded={expanded}
          onExpandedChange={onExpandedChange}
        />
      )}
      {active === "official" && officialInfo && <CourseOfficialInfo info={officialInfo} />}
    </section>
  );
}
