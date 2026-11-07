"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { TopicHeader } from "@/components/course-hub-shared";
import { CourseWeekCard } from "@/components/course-week-card";
import { CourseExamMilestone } from "@/components/course-exam-milestone";
import { useLocale } from "@/lib/i18n";
import type {
  CourseExamMilestoneData,
  CourseWeekCardData,
} from "@/lib/courses/course-timeline-types";

export interface CourseWeeklyTimelineProps {
  weeks: CourseWeekCardData[];
  midtermMilestone?: CourseExamMilestoneData;
  finalMilestone?: CourseExamMilestoneData;
  libraryHref: string;
  scope?: "all" | "midterm" | "final";
}

export function CourseWeeklyTimeline({
  weeks,
  midtermMilestone,
  finalMilestone,
  libraryHref,
  scope = "all",
}: CourseWeeklyTimelineProps) {
  const { locale } = useLocale();
  const [search, setSearch] = useState("");

  const filteredWeeks = useMemo(() => {
    const q = search.trim().toLowerCase();

    return weeks.filter((w) => {
      if (scope !== "all" && w.scope !== "all" && w.scope !== scope) {
        return false;
      }

      if (!q) return true;

      const titleTh = (w.title.th ?? "").toLowerCase();
      const titleEn = (w.title.en ?? "").toLowerCase();
      const weekNum = String(w.weekNumber);

      return (
        titleTh.includes(q) ||
        titleEn.includes(q) ||
        weekNum === q ||
        `week ${weekNum}`.includes(q) ||
        `w${weekNum}`.includes(q)
      );
    });
  }, [weeks, search, scope]);

  const hasSecondHalf = useMemo(
    () => weeks.some((w) => w.scope === "final" || (w.scope === "all" && w.weekNumber > 7)),
    [weeks],
  );

  const midtermWeeks = useMemo(
    () =>
      filteredWeeks.filter(
        (w) => w.scope === "midterm" || (w.scope === "all" && w.weekNumber <= 7),
      ),
    [filteredWeeks],
  );

  const finalWeeks = useMemo(
    () =>
      filteredWeeks.filter(
        (w) => w.scope === "final" || (w.scope === "all" && w.weekNumber > 7),
      ),
    [filteredWeeks],
  );

  const showMidtermMilestone =
    (scope === "all" || scope === "midterm") && Boolean(midtermMilestone);
  const showFinalMilestone =
    (scope === "all" || scope === "final") && Boolean(finalMilestone);

  const firstHalfTitle = hasSecondHalf
    ? locale === "th"
      ? "เนื้อหารายสัปดาห์ ครึ่งแรก"
      : "Weekly Sessions (First Half)"
    : locale === "th"
      ? "เนื้อหารายสัปดาห์"
      : "Weekly Sessions";

  const secondHalfTitle =
    locale === "th"
      ? "เนื้อหารายสัปดาห์ ครึ่งหลัง"
      : "Weekly Sessions (Second Half)";

  const searchAside = (
    <div className="relative flex items-center w-40 sm:w-56 h-8 rounded-full border border-border/80 bg-white shadow-xs transition-all focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/20 dark:bg-card dark:border-white/10 dark:shadow-none">
      <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={locale === "th" ? "ค้นหาสัปดาห์..." : "Search weeks..."}
        className="h-full w-full rounded-full bg-transparent pl-8 pr-7 text-xs text-foreground placeholder:text-muted-foreground/70 focus:outline-hidden"
      />
      {search && (
        <button
          type="button"
          onClick={() => setSearch("")}
          aria-label={locale === "th" ? "ล้างคำค้นหา" : "Clear search"}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
        >
          <X className="size-3" />
        </button>
      )}
    </div>
  );

  // When scope is "final" or search matched only final weeks, the second half header is the first one visible.
  const isSecondHalfFirst = midtermWeeks.length === 0 && finalWeeks.length > 0;

  return (
    <section>
      {filteredWeeks.length === 0 ? (
        <div>
          <TopicHeader
            id="weekly-path"
            title={scope === "final" ? secondHalfTitle : firstHalfTitle}
            aside={searchAside}
          />
          <p className="py-6 text-center text-xs text-muted-foreground">
            {locale === "th"
              ? "ไม่พบสัปดาห์ที่ตรงกับคำค้นหา"
              : "No sessions matched your search"}
          </p>
        </div>
      ) : (
        <div className="flex flex-col">
          {/* ── First Half (Weeks 1..7) ── */}
          {midtermWeeks.length > 0 && (
            <div>
              <TopicHeader
                id="weekly-path"
                title={firstHalfTitle}
                aside={searchAside}
              />
              <div className="flex flex-col gap-2">
                {midtermWeeks.map((week) => (
                  <CourseWeekCard key={week.id} week={week} libraryHref={libraryHref} />
                ))}
              </div>
            </div>
          )}

          {/* ── Isolated Midterm Milestone ── */}
          {showMidtermMilestone && midtermMilestone && (
            <CourseExamMilestone milestone={midtermMilestone} />
          )}

          {/* ── Second Half (Weeks 8..15) ── */}
          {finalWeeks.length > 0 && (
            <div className={midtermWeeks.length > 0 || (showMidtermMilestone && midtermMilestone) ? "pt-8 sm:pt-10" : ""}>
              <TopicHeader
                id="weekly-second-half"
                title={secondHalfTitle}
                aside={isSecondHalfFirst ? searchAside : undefined}
              />
              <div className="flex flex-col gap-2">
                {finalWeeks.map((week) => (
                  <CourseWeekCard key={week.id} week={week} libraryHref={libraryHref} />
                ))}
              </div>
            </div>
          )}

          {/* ── Isolated Final Milestone ── */}
          {showFinalMilestone && finalMilestone && (
            <CourseExamMilestone milestone={finalMilestone} />
          )}
        </div>
      )}
    </section>
  );
}
