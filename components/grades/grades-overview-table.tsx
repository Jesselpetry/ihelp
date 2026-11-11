"use client";

import { useCallback, useSyncExternalStore } from "react";
import { AlertTriangle, ChevronDown, Lock, RotateCcw } from "lucide-react";
import { GoogleMark } from "@/components/account/google-mark";
import { SURFACE } from "@/components/course-hub-shared";
import { formatScore } from "@/components/scores/score-utils";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  LETTER_GRADE_OPTIONS,
  PROBATION_GPA_THRESHOLD,
  calculateSemesterGpa,
  gradedPercentage,
  matchScoreForCourse,
  type GradesCourseEntry,
  type LetterGrade,
  type PassFailGrade,
  type Y1S1CourseCode,
} from "@/lib/grades/y1s1-courses";
import { useLocale, t, type LText } from "@/lib/i18n";
import type { CourseScoreViewResponse } from "@/lib/scores/types";
import { CourseCodeBadge } from "./course-code-badge";

const STORAGE_KEY = "ihelp_grades_hub_selections_v2";

interface GradeSelections {
  letters: Partial<Record<Y1S1CourseCode, LetterGrade | "">>;
  passFail: Partial<Record<Y1S1CourseCode, PassFailGrade | "">>;
}

const EMPTY_SELECTION: GradeSelections = { letters: {}, passFail: {} };
let cachedRaw: string | null = null;
let cachedParsed: GradeSelections = EMPTY_SELECTION;
const listeners = new Set<() => void>();

function readGradeStore(): GradeSelections {
  if (typeof window === "undefined") return EMPTY_SELECTION;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === cachedRaw) return cachedParsed;
    cachedRaw = raw;
    if (!raw) {
      cachedParsed = EMPTY_SELECTION;
      return cachedParsed;
    }
    const parsed = JSON.parse(raw) as Partial<GradeSelections>;
    cachedParsed = {
      letters: parsed?.letters && typeof parsed.letters === "object" ? parsed.letters : {},
      passFail: parsed?.passFail && typeof parsed.passFail === "object" ? parsed.passFail : {},
    };
    return cachedParsed;
  } catch {
    return EMPTY_SELECTION;
  }
}

function writeGradeStore(next: GradeSelections) {
  if (typeof window === "undefined") return;
  try {
    const raw = JSON.stringify(next);
    cachedRaw = raw;
    cachedParsed = next;
    window.localStorage.setItem(STORAGE_KEY, raw);
  } catch {
    // Ignore storage quota / privacy mode errors
  }
  for (const listener of listeners) {
    listener();
  }
}

function subscribeGradeStore(callback: () => void) {
  listeners.add(callback);
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) callback();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", onStorage);
  };
}

const L = {
  statAnnounced: { th: "วิชาที่มีคะแนนประกาศ", en: "Scores released" },
  statAverage: { th: "เฉลี่ยส่วนที่ประกาศแล้ว", en: "Avg. graded share" },
  statGpa: { th: "GPA จำลองภาคนี้", en: "Estimated GPA" },
  coursesUnit: { th: "วิชา", en: "courses" },
  colCourse: { th: "รายวิชา", en: "Course" },
  colGraded: { th: "คะแนนที่ประกาศแล้ว", en: "Graded score" },
  colGrade: { th: "เกรด / S-U", en: "Grade / S-U" },
  selectPlaceholder: { th: "เลือกเกรด", en: "Select" },
  inspectRow: { th: "ดูรายละเอียด", en: "Inspect" },
  gpaLabel: { th: "คำนวณ GPA รวม", en: "Calculated GPA" },
  gpaHintEmpty: {
    th: "เลือกเกรดรายวิชาด้านบนเพื่อคำนวณ GPA",
    en: "Choose course grades above to calculate GPA",
  },
  gpaCountPrefix: { th: "คำนวณจาก", en: "Across" },
  gpaCoursesLabel: { th: "วิชา", en: "courses" },
  gpaCreditsLabel: { th: "หน่วยกิต", en: "credits" },
  probationRisk: { th: "ต่ำกว่า 1.90 · ติดโปร", en: "Below 1.90 · Probation" },
  normalStatus: { th: "ปกติ (≥ 1.90)", en: "Good standing" },
  resetBtn: { th: "ล้างค่า", en: "Reset" },
  probationNote: {
    th: `หมายเหตุ: หากเกรดเฉลี่ยสะสม (GPA) ต่ำกว่า ${PROBATION_GPA_THRESHOLD.toFixed(2)} จะติดสถานะวิทยาทัณฑ์ (ติดโปร) · วิชา S/U (FE, CHARM, SPORT) ไม่นำมาคิดรวมใน GPA`,
    en: `Note: A cumulative GPA below ${PROBATION_GPA_THRESHOLD.toFixed(2)} triggers academic probation. S/U courses (FE, CHARM, SPORT) are excluded from GPA.`,
  },
  signInTitle: {
    th: "เข้าสู่ระบบด้วยอีเมล @kmitl.ac.th เพื่อดูคะแนนของฉันในแต่ละรายวิชา",
    en: "Sign in with @kmitl.ac.th to view your course scores",
  },
  signInCaption: {
    th: "ยังคงตรวจสอบสัดส่วนคะแนนและทดลองคำนวณ GPA ด้านล่างได้ทันที",
    en: "Syllabus weights and the GPA calculator below remain available.",
  },
  signInBtn: { th: "เข้าสู่ระบบด้วย KMITL", en: "Sign in with KMITL" },
  prodNotice: {
    th: "แสดงรายวิชาทั้งหมดและตัวคำนวณ GPA (ยังไม่มีไฟล์คะแนนประกาศในสภาพแวดล้อมนี้)",
    en: "Showing courses and GPA calculator (no score sheets published in this environment).",
  },
} satisfies Record<string, LText>;

export function GradesOverviewTable({
  courses,
  scores,
  authStatus,
  hasLocalSheets,
  onSignIn,
  onSelectCourse,
}: {
  courses: GradesCourseEntry[];
  scores: CourseScoreViewResponse[];
  authStatus: "loading" | "authenticated" | "unauthenticated";
  hasLocalSheets: boolean;
  onSignIn: () => void;
  onSelectCourse: (code: string) => void;
}) {
  const { locale } = useLocale();
  const selections = useSyncExternalStore(
    subscribeGradeStore,
    readGradeStore,
    () => EMPTY_SELECTION,
  );

  const handleLetterChange = useCallback(
    (code: Y1S1CourseCode, value: string) => {
      const current = readGradeStore();
      const nextLetters = { ...current.letters };
      if (!value) {
        delete nextLetters[code];
      } else {
        nextLetters[code] = value as LetterGrade;
      }
      writeGradeStore({ ...current, letters: nextLetters });
    },
    [],
  );

  const handlePassFailToggle = useCallback(
    (code: Y1S1CourseCode, value: PassFailGrade) => {
      const current = readGradeStore();
      const nextPassFail = { ...current.passFail };
      if (nextPassFail[code] === value) {
        delete nextPassFail[code];
      } else {
        nextPassFail[code] = value;
      }
      writeGradeStore({ ...current, passFail: nextPassFail });
    },
    [],
  );

  const handleResetGrades = useCallback(() => {
    writeGradeStore(EMPTY_SELECTION);
  }, []);

  const releasedCourses = courses.filter(
    (c) => matchScoreForCourse(c, scores)?.enrolled,
  );
  const percentages = courses
    .map((c) => gradedPercentage(matchScoreForCourse(c, scores)))
    .filter((v): v is number => v !== null);
  const avgPercent =
    percentages.length > 0
      ? percentages.reduce((acc, v) => acc + v, 0) / percentages.length
      : null;

  const gpaSummary = calculateSemesterGpa(courses, selections.letters);
  const hasAnySelection =
    gpaSummary.gradedCount > 0 ||
    Object.values(selections.passFail).some(Boolean);

  return (
    <div className={`${SURFACE} overflow-hidden border border-border/40`}>
      {/* Auth Sign-in Banner when logged out */}
      {authStatus === "unauthenticated" && (
        <div className="flex flex-col justify-between gap-3 border-b border-border/50 bg-muted/25 px-4 py-3 sm:flex-row sm:items-center">
          <div className="flex items-start gap-2.5 min-w-0">
            <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
              <Lock className="size-3.5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-foreground">
                {t(L.signInTitle, locale)}
              </p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                {t(L.signInCaption, locale)}
              </p>
            </div>
          </div>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={onSignIn}
            className="shrink-0 gap-2 text-xs cursor-pointer"
          >
            <GoogleMark className="size-3.5" />
            <span>{t(L.signInBtn, locale)}</span>
          </Button>
        </div>
      )}

      {/* Quiet environment notice when signed in on production without local/scores */}
      {authStatus === "authenticated" && !hasLocalSheets && (
        <div className="border-b border-border/50 bg-muted/20 px-4 py-2 text-[11px] text-muted-foreground">
          {t(L.prodNotice, locale)}
        </div>
      )}

      {/* Slim 3-Stat Overview Strip */}
      <div className="grid grid-cols-3 divide-x divide-border/50 border-b border-border/50">
        <div className="px-3.5 py-3 sm:px-4">
          <div className="text-[11px] text-muted-foreground">
            {t(L.statAnnounced, locale)}
          </div>
          <div className="mt-0.5 flex items-baseline gap-1 font-mono tabular-nums">
            <span className="text-base font-bold text-foreground sm:text-lg">
              {authStatus === "authenticated" ? releasedCourses.length : "—"}
            </span>
            <span className="text-[11px] text-muted-foreground">
              / {courses.length} {t(L.coursesUnit, locale)}
            </span>
          </div>
        </div>

        <div className="px-3.5 py-3 sm:px-4">
          <div className="text-[11px] text-muted-foreground">
            {t(L.statAverage, locale)}
          </div>
          <div className="mt-0.5 font-mono tabular-nums">
            <span className="text-base font-bold text-foreground sm:text-lg">
              {avgPercent !== null ? `${avgPercent.toFixed(1)}%` : "—"}
            </span>
          </div>
        </div>

        <div className="px-3.5 py-3 sm:px-4">
          <div className="text-[11px] text-muted-foreground">
            {t(L.statGpa, locale)}
          </div>
          <div className="mt-0.5 font-mono tabular-nums">
            <span
              className={`text-base font-bold sm:text-lg ${
                gpaSummary.gpa === null
                  ? "text-foreground"
                  : gpaSummary.isProbation
                    ? "text-amber-500"
                    : "text-emerald-500"
              }`}
            >
              {gpaSummary.gpa !== null ? gpaSummary.gpa.toFixed(2) : "—"}
            </span>
          </div>
        </div>
      </div>

      {/* Main Comparison + Inline GPA Table */}
      <div
        tabIndex={0}
        role="region"
        aria-labelledby="overview"
        className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary/40"
      >
        <Table>
          <TableHeader>
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableHead scope="col" className="pl-4 text-xs">
                {t(L.colCourse, locale)}
              </TableHead>
              <TableHead scope="col" className="text-right text-xs">
                {t(L.colGraded, locale)}
              </TableHead>
              <TableHead scope="col" className="text-right text-xs">
                {t(L.colGrade, locale)}
              </TableHead>
              <TableHead scope="col" className="w-8 pr-4" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.map((course) => {
              const score = matchScoreForCourse(course, scores);
              const pct = gradedPercentage(score);

              let gradedCell = "—";
              let hasStatusWarning = false;

              if (score?.enrolled && score.mySummary) {
                if (score.mySummary.status) {
                  gradedCell = score.mySummary.status;
                  hasStatusWarning = true;
                } else {
                  gradedCell = `${formatScore(score.mySummary.total)} / ${formatScore(score.mySummary.gradedMax)}`;
                }
              }

              const chosenLetter = selections.letters[course.code] ?? "";
              const chosenPassFail = selections.passFail[course.code] ?? "";

              return (
                <TableRow
                  key={course.code}
                  onClick={() => onSelectCourse(course.code)}
                  className="cursor-pointer border-border/40"
                >
                  <TableHead
                    scope="row"
                    className="h-auto py-2.5 pl-4 font-normal whitespace-normal"
                  >
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectCourse(course.code);
                      }}
                      aria-label={`${course.code} — ${t(L.inspectRow, locale)}`}
                      className="group/btn flex items-center gap-2.5 text-left focus-visible:outline-none focus-visible:underline cursor-pointer"
                    >
                      <CourseCodeBadge code={course.code} />
                      <span className="truncate text-xs font-medium text-foreground group-hover/btn:text-primary sm:text-[13px]">
                        {locale === "th" ? course.nameTh : course.nameEn}
                      </span>
                    </button>
                  </TableHead>

                  <TableCell className="text-right font-mono text-xs tabular-nums">
                    <span
                      className={
                        hasStatusWarning
                          ? "font-medium text-amber-500"
                          : "font-semibold text-foreground"
                      }
                    >
                      {gradedCell}
                    </span>
                    {pct !== null && (
                      <span className="ml-1.5 hidden text-[11px] text-muted-foreground sm:inline">
                        ({pct.toFixed(1)}%)
                      </span>
                    )}
                  </TableCell>

                  <TableCell
                    className="text-right"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {course.mode === "letter" ? (
                      <select
                        aria-label={`${t(L.colGrade, locale)} ${course.code}`}
                        value={chosenLetter}
                        onChange={(e) =>
                          handleLetterChange(course.code, e.target.value)
                        }
                        className="h-7 rounded-lg border border-border/70 bg-background/80 px-2 font-mono text-xs text-foreground transition-colors hover:border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 cursor-pointer"
                      >
                        <option value="">
                          {t(L.selectPlaceholder, locale)}
                        </option>
                        {LETTER_GRADE_OPTIONS.map((opt) => (
                          <option key={opt.grade} value={opt.grade}>
                            {opt.grade} ({opt.point.toFixed(1)})
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div
                        role="group"
                        aria-label={`${course.code} S/U`}
                        className="inline-flex items-center rounded-lg border border-border/60 bg-muted/50 p-0.5"
                      >
                        {(["S", "U"] as const).map((val) => {
                          const active = chosenPassFail === val;
                          return (
                            <button
                              key={val}
                              type="button"
                              aria-pressed={active}
                              onClick={() => handlePassFailToggle(course.code, val)}
                              className={`rounded-md px-2 py-0.5 font-mono text-[11px] font-semibold transition-colors cursor-pointer ${
                                active
                                  ? val === "S"
                                    ? "bg-emerald-500/20 text-emerald-500"
                                    : "bg-amber-500/20 text-amber-500"
                                  : "text-muted-foreground hover:text-foreground"
                              }`}
                            >
                              {val}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </TableCell>

                  <TableCell className="pr-4 text-right">
                    <ChevronDown className="inline size-3.5 text-muted-foreground/60" />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>

          {/* Integrated GPA Calculator Row inside the table */}
          <TableFooter className="border-t border-border/60 bg-muted/25">
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={2} className="py-3 pl-4 whitespace-normal">
                <div className="text-xs font-semibold text-foreground">
                  {t(L.gpaLabel, locale)}
                </div>
                <div className="mt-0.5 text-[11px] font-normal text-muted-foreground">
                  {gpaSummary.gradedCount > 0
                    ? `${t(L.gpaCountPrefix, locale)} ${gpaSummary.gradedCount}/${gpaSummary.letterCourseCount} ${t(L.gpaCoursesLabel, locale)} (${gpaSummary.gradedCredits} ${t(L.gpaCreditsLabel, locale)})`
                    : t(L.gpaHintEmpty, locale)}
                </div>
              </TableCell>

              <TableCell colSpan={2} className="py-3 pr-4 text-right">
                <div className="inline-flex items-center justify-end gap-2">
                  {hasAnySelection && (
                    <button
                      type="button"
                      onClick={handleResetGrades}
                      aria-label={t(L.resetBtn, locale)}
                      title={t(L.resetBtn, locale)}
                      className="inline-flex items-center gap-1 rounded-md px-1.5 py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground cursor-pointer"
                    >
                      <RotateCcw className="size-3" />
                      <span className="hidden sm:inline">
                        {t(L.resetBtn, locale)}
                      </span>
                    </button>
                  )}

                  {gpaSummary.gradedCount > 0 && (
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                        gpaSummary.isProbation
                          ? "bg-amber-500/15 text-amber-500"
                          : "bg-emerald-500/15 text-emerald-500"
                      }`}
                    >
                      {gpaSummary.isProbation && (
                        <AlertTriangle className="size-3 shrink-0" />
                      )}
                      <span>
                        {gpaSummary.isProbation
                          ? t(L.probationRisk, locale)
                          : t(L.normalStatus, locale)}
                      </span>
                    </span>
                  )}

                  <span
                    className={`font-mono text-lg font-bold tabular-nums ${
                      gpaSummary.gpa === null
                        ? "text-muted-foreground"
                        : gpaSummary.isProbation
                          ? "text-amber-500"
                          : "text-foreground"
                    }`}
                  >
                    {gpaSummary.gpa !== null
                      ? gpaSummary.gpa.toFixed(2)
                      : "—"}
                  </span>
                </div>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>

      {/* Academic Probation Note (< 1.90) directly at bottom of Overview Card */}
      <div
        className={`flex items-start gap-2 border-t px-4 py-2.5 text-[11px] ${
          gpaSummary.isProbation
            ? "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400"
            : "border-border/50 bg-muted/20 text-muted-foreground"
        }`}
      >
        <AlertTriangle
          className={`mt-0.5 size-3.5 shrink-0 ${
            gpaSummary.isProbation ? "text-amber-500" : "text-muted-foreground/80"
          }`}
        />
        <span>{t(L.probationNote, locale)}</span>
      </div>
    </div>
  );
}
