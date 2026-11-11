"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, ChevronDown, Lock, User, Users } from "lucide-react";
import { GoogleMark } from "@/components/account/google-mark";
import { SURFACE } from "@/components/course-hub-shared";
import { AllScoresTable } from "@/components/scores/all-scores-table";
import { PersonalScoreView } from "@/components/scores/personal-score-view";
import { formatScore, formatScoreDate } from "@/components/scores/score-utils";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  gradedPercentage,
  type GradesCourseEntry,
} from "@/lib/grades/y1s1-courses";
import { useLocale, t, type LText } from "@/lib/i18n";
import type { CourseScoreViewResponse } from "@/lib/scores/types";
import { CourseCodeBadge } from "./course-code-badge";

const L = {
  tabMe: { th: "คะแนนของฉัน", en: "My scores" },
  tabAll: { th: "ดูทั้งหมด", en: "View all" },
  courseLink: { th: "หน้ารายวิชา", en: "Course page" },
  updatedAt: { th: "อัปเดต", en: "Updated" },
  colPart: { th: "องค์ประกอบคะแนน", en: "Assessment" },
  colType: { th: "ประเภท", en: "Type" },
  colWeight: { th: "สัดส่วน", en: "Weight" },
  typeFinal: { th: "ปลายภาค", en: "Final" },
  typeContinuous: { th: "คะแนนเก็บ", en: "Coursework" },
  totalWeight: { th: "สัดส่วนรวม", en: "Total weight" },
  creditsSuffix: { th: "นก.", en: "cr." },
  passFailMode: { th: "ประเมินผลแบบ S / U", en: "S / U pass-fail" },
  letterMode: { th: "ตัดเกรดตัวอักษร (A–F)", en: "Letter grade (A–F)" },
  cutoffsLabel: { th: "เกณฑ์ผ่านเบื้องต้น:", en: "Grading cutoffs:" },
  loadingAll: {
    th: "กำลังโหลดตารางคะแนนรวมทั้งวิชา...",
    en: "Loading full course score sheet...",
  },
  loadAllError: {
    th: "ไม่สามารถโหลดตารางคะแนนรวมได้",
    en: "Unable to load full class scores",
  },
  retry: { th: "ลองใหม่", en: "Retry" },
  signInPrompt: {
    th: "เข้าสู่ระบบด้วย @kmitl.ac.th เพื่อตรวจคะแนนรายบุคคลของวิชานี้ (หากมีประกาศแล้ว)",
    en: "Sign in with @kmitl.ac.th to check your personal scores if released.",
  },
  signInBtn: { th: "เข้าสู่ระบบ", en: "Sign in" },
  pendingPill: { th: "รอประกาศ", en: "Pending" },
  passFailPill: { th: "S / U", en: "S / U" },
  passFailBlankNotice: {
    th: "วิชานี้ประเมินผลแบบผ่าน / ไม่ผ่าน (S / U) และยังไม่มีไฟล์คะแนนประกาศ",
    en: "Evaluated on a Pass / Fail (S / U) basis with no score sheet published yet.",
  },
  noRecordPill: { th: "ไม่พบข้อมูล", en: "No record" },
} satisfies Record<string, LText>;

export function GradeCourseAccordion({
  course,
  score,
  authStatus,
  isOpen,
  onToggle,
  onSignIn,
}: {
  course: GradesCourseEntry;
  score: CourseScoreViewResponse | null;
  authStatus: "loading" | "authenticated" | "unauthenticated";
  isOpen: boolean;
  onToggle: () => void;
  onSignIn: () => void;
}) {
  const { locale } = useLocale();
  const [view, setView] = useState<"me" | "all">("me");
  const [allData, setAllData] = useState<CourseScoreViewResponse | null>(null);
  const [loadingAll, setLoadingAll] = useState(false);
  const [allError, setAllError] = useState<string | null>(null);

  const panelId = `grade-panel-${course.code.toLowerCase()}`;
  const pct = gradedPercentage(score);
  const syllabus = course.syllabus;
  const totalWeight = syllabus.categories.reduce((acc, c) => acc + c.weight, 0);

  async function loadAllSheet() {
    if (!score || loadingAll) return;
    setLoadingAll(true);
    setAllError(null);
    try {
      const res = await fetch(
        `/api/local-scores/${encodeURIComponent(score.courseCode)}/hub?view=all`,
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

  let headerRightText =
    course.mode === "pass_fail"
      ? t(L.passFailPill, locale)
      : t(L.pendingPill, locale);
  let headerRightTone: "primary" | "warn" | "muted" = "muted";

  if (score) {
    if (!score.enrolled || !score.mySummary) {
      headerRightText = t(L.noRecordPill, locale);
    } else if (score.mySummary.status) {
      headerRightText = score.mySummary.status;
      headerRightTone = "warn";
    } else {
      headerRightText = `${formatScore(score.mySummary.total)} / ${formatScore(score.mySummary.gradedMax)}`;
      headerRightTone = "primary";
    }
  }

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

          <span className="flex shrink-0 items-center gap-2">
            {pct !== null && (
              <span className="hidden font-mono text-xs text-muted-foreground tabular-nums sm:inline">
                {pct.toFixed(1)}%
              </span>
            )}
            <span
              className={`rounded-full px-2.5 py-0.5 font-mono text-xs font-semibold tabular-nums ${
                headerRightTone === "primary"
                  ? "bg-primary/10 text-primary"
                  : headerRightTone === "warn"
                    ? "bg-amber-500/15 text-amber-500"
                    : "bg-muted text-muted-foreground font-sans text-[11px] font-medium"
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

          {/* Body: either live score view / class sheet OR syllabus breakdown */}
          {score ? (
            <div className="p-3.5 sm:p-4">
              {view === "me" ? (
                <PersonalScoreView
                  data={score}
                  embedded
                  onOpenAll={() => handleSelectView("all")}
                />
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
          ) : course.mode === "pass_fail" ? (
            <div className="px-4 py-6 text-center text-xs text-muted-foreground">
              {t(L.passFailBlankNotice, locale)}
            </div>
          ) : (
            <div className="space-y-3 p-3.5 sm:p-4">
              {authStatus === "unauthenticated" && (
                <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-muted/35 px-3 py-2 text-xs">
                  <span className="inline-flex items-center gap-2 text-muted-foreground">
                    <Lock className="size-3.5 shrink-0" />
                    <span>{t(L.signInPrompt, locale)}</span>
                  </span>
                  <Button
                    type="button"
                    size="xs"
                    variant="outline"
                    onClick={onSignIn}
                    className="gap-1.5 cursor-pointer"
                  >
                    <GoogleMark className="size-3" />
                    <span>{t(L.signInBtn, locale)}</span>
                  </Button>
                </div>
              )}

              <div
                tabIndex={0}
                role="region"
                aria-label={`${course.code} syllabus rubric`}
                className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              >
                <Table>
                  <TableHeader>
                    <TableRow className="border-border/50 hover:bg-transparent">
                      <TableHead scope="col" className="text-xs">
                        {t(L.colPart, locale)}
                      </TableHead>
                      <TableHead scope="col" className="text-center text-xs">
                        {t(L.colType, locale)}
                      </TableHead>
                      <TableHead scope="col" className="text-right text-xs">
                        {t(L.colWeight, locale)}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {syllabus.categories.map((cat) => (
                      <TableRow key={cat.id} className="border-border/40">
                        <TableHead
                          scope="row"
                          className="h-auto py-2 font-normal whitespace-normal text-xs text-foreground"
                        >
                          {cat.name}
                        </TableHead>
                        <TableCell className="text-center">
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${
                              cat.isFinal
                                ? "bg-primary/10 text-primary"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {cat.isFinal
                              ? t(L.typeFinal, locale)
                              : t(L.typeContinuous, locale)}
                          </span>
                        </TableCell>
                        <TableCell className="text-right font-mono text-xs font-semibold tabular-nums">
                          {cat.weight}%
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="border-t border-border/60 bg-muted/20 font-semibold hover:bg-muted/20">
                      <TableCell className="text-xs">
                        {t(L.totalWeight, locale)}
                      </TableCell>
                      <TableCell />
                      <TableCell className="text-right font-mono text-xs tabular-nums">
                        {totalWeight}%
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-muted-foreground">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span>{t(L.cutoffsLabel, locale)}</span>
                  {syllabus.cutoffs.map((c) => (
                    <span
                      key={c.grade}
                      className="rounded-md bg-muted/70 px-1.5 py-0.5 font-mono text-[10px] text-foreground/85"
                    >
                      {c.grade} ≥ {c.min}
                    </span>
                  ))}
                </div>
                {syllabus.notes && <span>{syllabus.notes}</span>}
              </div>
            </div>
          )}
        </div>
      )}
    </article>
  );
}
