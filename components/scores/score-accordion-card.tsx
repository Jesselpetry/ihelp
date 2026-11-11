"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Trophy, User, Users } from "lucide-react";
import { SURFACE } from "@/components/course-hub-shared";
import { useLocale, t, type LText } from "@/lib/i18n";
import type {
  CourseScoreAllRow,
  CourseScoreViewResponse,
} from "@/lib/scores/types";
import { findGradeCourseByCode } from "@/lib/grades/y1s1-courses";
import { useManualScoresStore } from "@/lib/grades/manual-scores-store";
import { mergeCourseScores } from "@/lib/grades/score-merger";
import { AllScoresTable } from "./all-scores-table";
import { MergedScoreBreakdown } from "./merged-score-breakdown";
import { PersonalScoreView } from "./personal-score-view";
import { formatScore, formatScoreDate } from "./score-utils";

const L = {
  cardTitle: { th: "คะแนนเก็บและสอบ", en: "Scores" },
  notEnrolledBadge: { th: "ไม่มีรหัสในตาราง", en: "Not on sheet" },
  modePersonal: { th: "รายบุคคล", en: "My Score" },
  modeAll: { th: "ดูทั้งหมด", en: "View All" },
  loadingAll: {
    th: "กำลังโหลดตารางคะแนนทั้งหมด...",
    en: "Loading full score sheet...",
  },
  errorAll: {
    th: "โหลดตารางทั้งหมดไม่สำเร็จ",
    en: "Could not load full table",
  },
  retry: { th: "ลองอีกครั้ง", en: "Retry" },
  updatesPrefix: { th: "อัปเดต", en: "Updates" },
  gradesHubLink: { th: "ดูรวมทุกวิชา →", en: "All grades →" },
} satisfies Record<string, LText>;

type ViewMode = "personal" | "all";

export function ScoreAccordionCard({
  data,
  lookupCode,
}: {
  data: CourseScoreViewResponse;
  lookupCode: string;
}) {
  const { locale } = useLocale();
  const manualState = useManualScoresStore();
  const gradeCourse =
    findGradeCourseByCode(data.courseCode) ?? findGradeCourseByCode(lookupCode);
  const merged = gradeCourse
    ? mergeCourseScores(gradeCourse, data, manualState)
    : null;
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<ViewMode>("personal");
  const [allRows, setAllRows] = useState<CourseScoreAllRow[] | null>(
    data.allRows ?? null,
  );
  const [loadingAll, setLoadingAll] = useState(false);
  const [allError, setAllError] = useState(false);

  async function switchToAll() {
    setMode("all");
    if (allRows !== null || loadingAll) return;
    setLoadingAll(true);
    setAllError(false);
    try {
      const res = await fetch(
        `/api/local-scores/${encodeURIComponent(lookupCode)}/hub?view=all`,
      );
      if (!res.ok) throw new Error("fetch_failed");
      const full = (await res.json()) as CourseScoreViewResponse;
      setAllRows(full.allRows ?? []);
    } catch {
      setAllError(true);
    } finally {
      setLoadingAll(false);
    }
  }

  const summaryPill = (() => {
    const status = data.enrolled ? data.mySummary?.status : undefined;
    const sheetTotal = data.enrolled ? (data.mySummary?.total ?? 0) : 0;
    const sheetMax = data.enrolled ? (data.mySummary?.gradedMax ?? 0) : 0;

    if (merged && merged.hasAnyManualInput && merged.hasAnyScore) {
      const gradeLabel =
        merged.autoGradeReady && merged.suggestedGrade
          ? (merged.suggestedGrade.letter ?? merged.suggestedGrade.passFail)
          : null;
      return (
        <span className="inline-flex items-center gap-1.5">
          <span className="rounded-full border border-primary/25 bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold tabular-nums text-primary">
            {formatScore(merged.combinedEarned)} / {formatScore(merged.baseScale)}
          </span>
          {gradeLabel && (
            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/15 px-2 py-0.5 text-[11px] font-semibold text-emerald-400">
              {gradeLabel}
            </span>
          )}
          {status && (
            <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[11px] font-semibold text-amber-600 dark:text-amber-400">
              {status}
            </span>
          )}
        </span>
      );
    }

    if (!data.enrolled || !data.mySummary) {
      return (
        <span className="rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
          {t(L.notEnrolledBadge, locale)}
        </span>
      );
    }

    if (status && sheetTotal === 0) {
      return (
        <span className="rounded-full bg-amber-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-amber-600 dark:text-amber-400">
          {status}
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1.5">
        <span className="rounded-full bg-primary/10 border border-primary/25 px-2.5 py-0.5 text-[11px] font-semibold tabular-nums text-primary">
          {formatScore(sheetTotal)} / {formatScore(sheetMax)}
        </span>
        {status && (
          <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[11px] font-semibold text-amber-600 dark:text-amber-400">
            {status}
          </span>
        )}
      </span>
    );
  })();

  const headerName = data.viewerNickname || data.viewerFullName;

  return (
    <div
      className={`overflow-hidden transition-all duration-200 border ${
        isOpen
          ? "border-primary/40 bg-card shadow-sm"
          : "border-border/40 hover:border-primary/40 hover:bg-primary/[0.04] hover:shadow-md"
      } ${SURFACE}`}
    >
      {/* Accordion trigger */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        className="group w-full flex items-center justify-between gap-3 px-3.5 py-2.5 text-left transition-colors cursor-pointer select-none"
      >
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <span className="flex size-8.5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary transition-transform group-hover:scale-105">
            <Trophy className="size-4" />
          </span>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 min-w-0">
            <span className="truncate text-xs sm:text-sm font-medium text-foreground transition-colors group-hover:text-primary">
              {t(L.cardTitle, locale)} {data.title}
            </span>
            {headerName && (
              <span className="truncate max-w-36 sm:max-w-52 rounded-full bg-muted/60 px-2 py-0.5 text-[10px] font-medium text-foreground/85">
                {headerName}
              </span>
            )}
            <span className="rounded-full bg-muted/70 px-2 py-0.5 font-mono text-[10px] font-medium text-muted-foreground">
              {data.viewerId}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {summaryPill}
          <span className="inline-flex items-center justify-center text-muted-foreground group-hover:text-foreground p-1 rounded-lg transition-colors">
            <ChevronDown
              className={`size-4 transition-transform duration-200 ${
                isOpen ? "rotate-180 text-primary" : ""
              }`}
            />
          </span>
        </div>
      </button>

      {/* Expanded content */}
      {isOpen && (
        <div className="border-t border-border/40 px-3.5 py-3.5 sm:px-5 sm:py-4 bg-card/40 space-y-3.5">
          {/* View mode switcher */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div
              role="group"
              aria-label="Score view mode"
              className="inline-flex rounded-full bg-muted/80 p-0.5 border border-border/50 text-xs shadow-2xs"
            >
              <button
                type="button"
                aria-pressed={mode === "personal"}
                onClick={() => setMode("personal")}
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer ${
                  mode === "personal"
                    ? "bg-card text-foreground shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <User className="size-3" />
                <span>{t(L.modePersonal, locale)}</span>
              </button>
              <button
                type="button"
                aria-pressed={mode === "all"}
                onClick={switchToAll}
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer ${
                  mode === "all"
                    ? "bg-card text-foreground shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Users className="size-3" />
                <span>
                  {t(L.modeAll, locale)} ({data.totalStudents})
                </span>
              </button>
            </div>

            <Link
              href="/grades"
              className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              {t(L.gradesHubLink, locale)}
            </Link>
          </div>

          {/* Active view */}
          {mode === "personal" ? (
            gradeCourse ? (
              <MergedScoreBreakdown
                course={gradeCourse}
                sheetScore={data}
                embedded
              />
            ) : (
              <PersonalScoreView data={data} onOpenAll={switchToAll} />
            )
          ) : loadingAll ? (
            <div className="py-8 text-center text-xs text-muted-foreground animate-pulse">
              {t(L.loadingAll, locale)}
            </div>
          ) : allError || allRows === null ? (
            <div className="flex items-center justify-center gap-2 py-8 text-xs text-muted-foreground">
              <span>{t(L.errorAll, locale)}</span>
              <button
                type="button"
                onClick={() => {
                  setAllRows(null);
                  void switchToAll();
                }}
                className="underline hover:text-foreground cursor-pointer"
              >
                {t(L.retry, locale)}
              </button>
            </div>
          ) : (
            <AllScoresTable
              columns={data.columns}
              rows={allRows}
              viewerId={data.viewerId}
              enrolled={data.enrolled}
            />
          )}

          {/* Notes & update log */}
          {(data.notes.length > 0 || data.updates.length > 0) && (
            <div className="pt-2.5 border-t border-border/40 space-y-1 text-[11px] text-muted-foreground">
              {data.notes.map((note) => (
                <p key={note}>{note}</p>
              ))}
              {data.updates.length > 0 && (
                <p>
                  {t(L.updatesPrefix, locale)}:{" "}
                  {data.updates
                    .map(
                      (u) => `${formatScoreDate(u.date, locale)} (${u.note})`,
                    )
                    .join(" · ")}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
