"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, ChevronDown, Info, User, Users } from "lucide-react";
import { SURFACE } from "@/components/course-hub-shared";
import { AllScoresTable } from "@/components/scores/all-scores-table";
import { MergedScoreBreakdown } from "@/components/scores/merged-score-breakdown";
import { formatScore, formatScoreDate } from "@/components/scores/score-utils";
import { Button } from "@/components/ui/button";
import { useManualScoresStore } from "@/lib/grades/manual-scores-store";
import { mergeCourseScores } from "@/lib/grades/score-merger";
import type { GradesCourseEntry } from "@/lib/grades/y1s1-courses";
import { useLocale, t, type LText } from "@/lib/i18n";
import type { CourseScoreViewResponse } from "@/lib/scores/types";
import { CourseCodeBadge } from "./course-code-badge";

const L = {
  tabMe: { th: "คะแนนของฉัน", en: "My scores" },
  tabAll: { th: "ดูทั้งหมด", en: "View all" },
  courseLink: { th: "หน้ารายวิชา", en: "Course page" },
  updatedAt: { th: "อัปเดต", en: "Updated" },
  creditsSuffix: { th: "นก.", en: "cr." },
  passFailMode: { th: "เกณฑ์ S / U", en: "S / U grading" },
  letterMode: { th: "เกณฑ์ A–F", en: "A–F grading" },
  syllabusNotesLabel: { th: "ประมวลการสอน", en: "Syllabus" },
  loadingAll: {
    th: "กำลังโหลดตารางคะแนนรวมทั้งวิชา...",
    en: "Loading full course score sheet...",
  },
  loadAllError: {
    th: "ไม่สามารถโหลดตารางคะแนนรวมได้",
    en: "Unable to load full class scores",
  },
  retry: { th: "ลองใหม่", en: "Retry" },
  noRecordPill: { th: "ไม่พบข้อมูลในชีต", en: "Not on sheet" },
} satisfies Record<string, LText>;

function splitSyllabusNotes(notes: string): {
  heading: string | null;
  items: string[];
} {
  const sepIndex = notes.indexOf(": ");
  const heading = sepIndex > 0 ? notes.slice(0, sepIndex).trim() : null;
  const body = sepIndex > 0 ? notes.slice(sepIndex + 2).trim() : notes.trim();
  const items = body
    .split(/\s+·\s+/)
    .map((part) => part.trim())
    .filter(Boolean);
  return { heading, items };
}

export function GradeCourseAccordion({
  course,
  score,
  isOpen,
  onToggle,
}: {
  course: GradesCourseEntry;
  score: CourseScoreViewResponse | null;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const { locale } = useLocale();
  const manualState = useManualScoresStore();
  const [view, setView] = useState<"me" | "all">("me");
  const [allData, setAllData] = useState<CourseScoreViewResponse | null>(null);
  const [loadingAll, setLoadingAll] = useState(false);
  const [allError, setAllError] = useState<string | null>(null);

  const panelId = `grade-panel-${course.code.toLowerCase()}`;
  const syllabus = course.syllabus;
  const merged = mergeCourseScores(course, score, manualState);
  const parsedNotes = syllabus.notes ? splitSyllabusNotes(syllabus.notes) : null;

  async function loadAllSheet() {
    if (!score || loadingAll) return;
    setLoadingAll(true);
    setAllError(null);
    try {
      const res = await fetch(
        `/api/scores/${encodeURIComponent(score.courseCode)}/hub?view=all`,
      );
      if (!res.ok) {
        setAllError(t(L.loadAllError, locale));
        return;
      }
      const json = (await res.json()) as CourseScoreViewResponse;
      setAllData(json);
    } catch {
      setAllError(t(L.loadAllError, locale));
    } finally {
      setLoadingAll(false);
    }
  }

  function handleSelectView(next: "me" | "all") {
    setView(next);
    if (next === "all" && !allData && !loadingAll) {
      void loadAllSheet();
    }
  }

  let headerRightText = `— / ${formatScore(merged.baseScale)}`;
  let headerRightTone: "primary" | "warn" | "muted" = "muted";

  if (score && (!score.enrolled || !score.mySummary) && !merged.hasAnyManualInput) {
    headerRightText = t(L.noRecordPill, locale);
  } else if (merged.sheetStatus) {
    headerRightText = merged.sheetStatus;
    headerRightTone = "warn";
  } else if (merged.hasAnyScore) {
    headerRightText = `${formatScore(merged.combinedEarned)} / ${formatScore(merged.baseScale)}`;
    headerRightTone = "primary";
  }

  const autoGradeLabel =
    merged.autoGradeReady && merged.suggestedGrade
      ? course.mode === "pass_fail"
        ? merged.suggestedGrade.passFail
        : merged.suggestedGrade.letter
      : null;

  return (
    <article
      id={`course-${course.code}`}
      className={`${SURFACE} overflow-hidden border border-border/40 scroll-mt-24`}
    >
      {/* Semantic heading + disclosure button; chevron right before badge */}
      <h3 className="m-0">
        <button
          type="button"
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={onToggle}
          className="flex w-full items-center justify-between gap-3 px-3.5 py-3 text-left transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary/40 cursor-pointer sm:px-4"
        >
          <span className="flex min-w-0 items-center gap-2.5">
            <ChevronDown
              aria-hidden="true"
              className={`size-4 shrink-0 text-muted-foreground transition-transform duration-200 ${
                isOpen ? "rotate-0" : "-rotate-90"
              }`}
            />
            <CourseCodeBadge code={course.code} />
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold text-foreground">
                {locale === "th" ? course.nameTh : course.nameEn}
              </span>
              <span className="block truncate text-[11px] text-muted-foreground">
                {course.officialCode ? `${course.officialCode} · ` : ""}
                {course.credits} {t(L.creditsSuffix, locale)}
                {score?.lastUpdated
                  ? ` · ${t(L.updatedAt, locale)} ${formatScoreDate(score.lastUpdated, locale)}`
                  : ""}
              </span>
            </span>
          </span>

          <span className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            {autoGradeLabel && (
              <span
                className={`rounded-full px-2 py-0.5 font-mono text-[11px] font-bold ${
                  autoGradeLabel === "F" || autoGradeLabel === "U"
                    ? "bg-amber-500/15 text-amber-500"
                    : "bg-emerald-500/15 text-emerald-500"
                }`}
              >
                {autoGradeLabel}
              </span>
            )}
            <span
              className={`rounded-full px-2.5 py-0.5 font-mono text-xs font-semibold tabular-nums ${
                headerRightTone === "primary"
                  ? "bg-primary/10 text-primary"
                  : headerRightTone === "warn"
                    ? "bg-amber-500/15 text-amber-500"
                    : "bg-muted text-muted-foreground text-[11px] font-medium"
              }`}
            >
              {headerRightText}
            </span>
          </span>
        </button>
      </h3>

      {isOpen && (
        <div id={panelId} className="border-t border-border/50">
          {/* Single compact action bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/40 bg-muted/15 px-3.5 py-2 sm:px-4">
            <div className="flex flex-wrap items-center gap-1.5">
              {score ? (
                <div
                  role="tablist"
                  aria-label={course.code}
                  className="inline-flex items-center rounded-lg bg-muted/70 p-0.5"
                >
                  <button
                    type="button"
                    role="tab"
                    aria-selected={view === "me"}
                    onClick={() => handleSelectView("me")}
                    className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer ${
                      view === "me"
                        ? "bg-card text-foreground shadow-xs"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <User className="size-3" />
                    <span>{t(L.tabMe, locale)}</span>
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={view === "all"}
                    onClick={() => handleSelectView("all")}
                    className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer ${
                      view === "all"
                        ? "bg-card text-foreground shadow-xs"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Users className="size-3" />
                    <span>{t(L.tabAll, locale)}</span>
                    <span className="font-mono text-[10px] opacity-75">
                      ({score.totalStudents})
                    </span>
                  </button>
                </div>
              ) : (
                <span className="text-[11px] text-muted-foreground">
                  {course.mode === "pass_fail"
                    ? t(L.passFailMode, locale)
                    : t(L.letterMode, locale)}
                </span>
              )}
            </div>

            {course.href && (
              <Link
                href={course.href}
                className="inline-flex items-center gap-1 rounded-lg border border-border/60 bg-background/50 px-2.5 py-1 text-[11px] font-medium text-foreground/90 transition-colors hover:bg-muted"
              >
                <span>{t(L.courseLink, locale)}</span>
                <ArrowUpRight className="size-3 text-muted-foreground" />
              </Link>
            )}
          </div>

          <div className="space-y-3 p-3.5 sm:p-4">
            {view === "me" ? (
              <>
                <MergedScoreBreakdown
                  course={course}
                  sheetScore={score}
                  embedded
                />

                {parsedNotes && parsedNotes.items.length > 0 && (
                  <div className="flex items-start gap-2 rounded-lg border border-border/50 bg-muted/20 px-3 py-2 text-[11px] leading-relaxed text-muted-foreground">
                    <Info className="mt-0.5 size-3.5 shrink-0 text-primary/80" />
                    <div className="min-w-0 space-y-1">
                      <div className="font-medium text-foreground/85">
                        {parsedNotes.heading ?? t(L.syllabusNotesLabel, locale)}
                      </div>
                      {parsedNotes.items.length > 1 ? (
                        <ul className="flex flex-wrap gap-x-3 gap-y-0.5">
                          {parsedNotes.items.map((item) => (
                            <li
                              key={item}
                              className="flex items-baseline gap-1.5"
                            >
                              <span
                                aria-hidden="true"
                                className="text-muted-foreground/50"
                              >
                                •
                              </span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p>{parsedNotes.items[0]}</p>
                      )}
                    </div>
                  </div>
                )}
              </>
            ) : loadingAll ? (
              <div className="py-8 text-center text-xs text-muted-foreground">
                {t(L.loadingAll, locale)}
              </div>
            ) : allError ? (
              <div className="flex flex-col items-center gap-2 py-8 text-center">
                <p className="text-xs text-muted-foreground">{allError}</p>
                <Button
                  type="button"
                  size="xs"
                  variant="outline"
                  onClick={() => void loadAllSheet()}
                >
                  {t(L.retry, locale)}
                </Button>
              </div>
            ) : allData ? (
              <AllScoresTable
                columns={allData.columns}
                rows={allData.allRows ?? []}
                viewerId={allData.viewerId}
                enrolled={allData.enrolled}
              />
            ) : null}
          </div>
        </div>
      )}
    </article>
  );
}
