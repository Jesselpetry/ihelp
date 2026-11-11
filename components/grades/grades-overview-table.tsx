"use client";

import { useCallback, useSyncExternalStore } from "react";
import { AlertTriangle, ChevronDown, Lock, RotateCcw } from "lucide-react";
import { GoogleMark } from "@/components/account/google-mark";
import { SURFACE } from "@/components/course-hub-shared";
import { formatScore } from "@/components/scores/score-utils";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  hasCourseManualEntries,
  resetAllManualScores,
  useManualScoresStore,
} from "@/lib/grades/manual-scores-store";
import { mergeCourseScores } from "@/lib/grades/score-merger";
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
  colGraded: { th: "คะแนน (/100)", en: "Score (/100)" },
  colGrade: { th: "เกรด", en: "Grade" },
  selectPlaceholder: { th: "เลือกเกรด", en: "Select grade" },
  selectPassFailPlaceholder: { th: "เลือก (S/U)", en: "Select S/U" },
  optPass: { th: "S (ผ่าน)", en: "S (Pass)" },
  optFail: { th: "U (ไม่ผ่าน)", en: "U (Fail)" },
  autoPrefix: { th: "อัตโนมัติ", en: "Auto" },
  inspectRow: { th: "ดูรายละเอียด / กรอกคะแนน", en: "Inspect / Enter scores" },
  gpaLabel: { th: "คำนวณ GPA รวม", en: "Calculated GPA" },
  gpaHintEmpty: {
    th: "เลือกเกรด หรือกรอกคะแนนรายวิชาด้านล่างให้ครบ 100 เพื่อคำนวณ GPA",
    en: "Choose grades or complete a course's 100-pt scores below to calculate GPA",
  },
  gpaCountPrefix: { th: "คำนวณจาก", en: "Across" },
  gpaCoursesLabel: { th: "วิชา", en: "courses" },
  gpaCreditsLabel: { th: "หน่วยกิต", en: "credits" },
  probationRisk: { th: "ต่ำกว่า 1.90 · ติดโปร", en: "Below 1.90 · Probation" },
  normalStatus: { th: "ปกติ (≥ 1.90)", en: "Good standing" },
  resetGradesBtn: { th: "ล้างเกรด", en: "Reset grades" },
  resetScoresBtn: { th: "ล้างคะแนนที่กรอก", en: "Clear manual scores" },
  probationNote1: {
    th: `หากเกรดเฉลี่ยสะสม (GPA) ต่ำกว่า ${PROBATION_GPA_THRESHOLD.toFixed(2)} จะติดสถานะวิทยาทัณฑ์ (ติดโปร)`,
    en: `A cumulative GPA below ${PROBATION_GPA_THRESHOLD.toFixed(2)} triggers academic probation.`,
  },
  probationNote2: {
    th: "วิชาประเมินผลแบบ S/U (FE, CHARM, SPORT) ไม่นำมาคิดรวมในการคำนวณ GPA",
    en: "S/U courses (FE, CHARM, SPORT) are excluded from GPA calculation.",
  },
  signInTitle: {
    th: "เข้าสู่ระบบด้วยอีเมล @kmitl.ac.th เพื่อดูคะแนนของฉันในแต่ละรายวิชา",
    en: "Sign in with @kmitl.ac.th to view your course scores",
  },
  signInCaption: {
    th: "ยังคงกดเปิดรายวิชาด้านล่างเพื่อกรอกคะแนนแบบ manual และคำนวณ GPA ได้ทันที",
    en: "You can still expand courses below to enter manual scores and simulate GPA.",
  },
  signInBtn: { th: "เข้าสู่ระบบด้วย KMITL", en: "Sign in with KMITL" },
  prodNotice: {
    th: "แสดงรายวิชาทั้ง 7 วิชาในฐาน /100 — กดที่รายวิชาด้านล่างเพื่อกรอกคะแนนและคำนวณเกรดอัตโนมัติ",
    en: "All 7 courses are on a /100 scale — expand any course below to enter scores and auto-calculate grades.",
  },
} satisfies Record<string, LText>;

const AUTO_GRADE_VALUE = "__auto__";

function CourseGradeControl({
  course,
  manualLetter,
  autoLetter,
  manualPassFail,
  autoPassFail,
  locale,
  onLetterChange,
  onPassFailChange,
}: {
  course: GradesCourseEntry;
  manualLetter: LetterGrade | "";
  autoLetter: LetterGrade | "";
  manualPassFail: PassFailGrade | "";
  autoPassFail: PassFailGrade | "";
  locale: "th" | "en";
  onLetterChange: (code: Y1S1CourseCode, value: string) => void;
  onPassFailChange: (code: Y1S1CourseCode, value: string) => void;
}) {
  const isLetter = course.mode === "letter";
  const manualValue = isLetter ? manualLetter : manualPassFail;
  const autoValue = isLetter ? autoLetter : autoPassFail;
  const onChange = isLetter ? onLetterChange : onPassFailChange;
  const isUsingAuto = !manualValue && Boolean(autoValue);
  const isNegativeAuto = isLetter ? autoLetter === "F" : autoPassFail === "U";

  const autoPoint =
    isLetter && autoLetter
      ? LETTER_GRADE_OPTIONS.find((o) => o.grade === autoLetter)?.point
      : undefined;

  const autoItemLabel = autoValue
    ? isLetter
      ? `${t(L.autoPrefix, locale)}: ${autoValue}${autoPoint !== undefined ? ` (${autoPoint.toFixed(1)})` : ""}`
      : `${t(L.autoPrefix, locale)}: ${autoValue}`
    : isLetter
      ? t(L.selectPlaceholder, locale)
      : t(L.selectPassFailPlaceholder, locale);

  const options = isLetter
    ? LETTER_GRADE_OPTIONS.map((opt) => ({
        value: opt.grade,
        label: `${opt.grade} (${opt.point.toFixed(1)})`,
      }))
    : [
        { value: "S", label: t(L.optPass, locale) },
        { value: "U", label: t(L.optFail, locale) },
      ];

  return (
    <Select
      value={manualValue || AUTO_GRADE_VALUE}
      onValueChange={(value) =>
        onChange(course.code, value === AUTO_GRADE_VALUE ? "" : value)
      }
    >
      <SelectTrigger
        size="sm"
        aria-label={`${t(L.colGrade, locale)} ${course.code}`}
        className={`h-7 w-32 sm:w-36 max-w-full rounded-lg px-2 font-mono text-xs transition-colors cursor-pointer ${
          isUsingAuto
            ? isNegativeAuto
              ? "border-amber-500/50 bg-amber-500/10 text-amber-500 font-semibold hover:bg-amber-500/15 dark:bg-amber-500/10 dark:hover:bg-amber-500/15"
              : "border-emerald-500/45 bg-emerald-500/10 text-emerald-500 font-semibold hover:bg-emerald-500/15 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/15"
            : "border-border/70 bg-background/80 text-foreground hover:border-border dark:bg-background/80 dark:hover:bg-muted/40"
        }`}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent
        position="popper"
        align="end"
        className="min-w-36 font-mono text-xs"
      >
        <SelectItem
          value={AUTO_GRADE_VALUE}
          className={
            autoValue
              ? isNegativeAuto
                ? "font-mono text-xs font-medium text-amber-500"
                : "font-mono text-xs font-medium text-emerald-500"
              : "font-mono text-xs text-muted-foreground"
          }
        >
          {autoItemLabel}
        </SelectItem>
        <SelectSeparator />
        {options.map((opt) => (
          <SelectItem
            key={opt.value}
            value={opt.value}
            className="font-mono text-xs"
          >
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

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
  const manualState = useManualScoresStore();

  const updateGradeSelection = useCallback(
    <K extends keyof GradeSelections>(
      bucket: K,
      code: Y1S1CourseCode,
      value: string,
    ) => {
      const current = readGradeStore();
      const nextBucket = { ...current[bucket] };
      if (!value) {
        delete nextBucket[code];
      } else {
        (nextBucket as Record<string, string>)[code] = value;
      }
      writeGradeStore({ ...current, [bucket]: nextBucket });
    },
    [],
  );

  const handleLetterChange = useCallback(
    (code: Y1S1CourseCode, value: string) =>
      updateGradeSelection("letters", code, value),
    [updateGradeSelection],
  );

  const handlePassFailChange = useCallback(
    (code: Y1S1CourseCode, value: string) =>
      updateGradeSelection("passFail", code, value),
    [updateGradeSelection],
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

  const hasAnyManual = courses.some((c) =>
    hasCourseManualEntries(manualState, c.code),
  );

  const effectiveLetters: Partial<Record<Y1S1CourseCode, LetterGrade | "">> = {};

  const rows = courses.map((course) => {
    const score = matchScoreForCourse(course, scores);
    const merged = mergeCourseScores(course, score, manualState);

    let scoreCell = `— / ${formatScore(merged.baseScale)}`;
    let hasStatusWarning = false;

    if (merged.sheetStatus) {
      scoreCell = merged.sheetStatus;
      hasStatusWarning = true;
    } else if (merged.hasAnyScore) {
      scoreCell = `${formatScore(merged.combinedEarned)} / ${formatScore(merged.baseScale)}`;
    }

    const manualLetter: LetterGrade | "" = selections.letters[course.code] ?? "";
    const autoLetter: LetterGrade | "" =
      merged.autoGradeReady && merged.suggestedGrade?.letter
        ? merged.suggestedGrade.letter
        : "";
    const manualPassFail: PassFailGrade | "" =
      selections.passFail[course.code] ?? "";
    const autoPassFail: PassFailGrade | "" =
      merged.autoGradeReady && merged.suggestedGrade?.passFail
        ? merged.suggestedGrade.passFail
        : "";

    if (course.mode === "letter") {
      const resolved = manualLetter || autoLetter;
      if (resolved) effectiveLetters[course.code] = resolved;
    }

    return {
      course,
      scoreCell,
      hasStatusWarning,
      manualLetter,
      autoLetter,
      manualPassFail,
      autoPassFail,
    };
  });

  const gpaSummary = calculateSemesterGpa(courses, effectiveLetters);
  const hasAnySelection =
    Object.values(selections.letters).some(Boolean) ||
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
        <div className="px-2.5 py-2.5 sm:px-4 sm:py-3">
          <div className="text-[10px] text-muted-foreground sm:text-[11px]">
            {t(L.statAnnounced, locale)}
          </div>
          <div className="mt-0.5 flex flex-wrap items-baseline gap-1 font-mono tabular-nums">
            <span className="text-base font-bold text-foreground sm:text-lg">
              {authStatus === "authenticated" ? releasedCourses.length : "—"}
            </span>
            <span className="text-[10px] text-muted-foreground sm:text-[11px]">
              / {courses.length} {t(L.coursesUnit, locale)}
            </span>
          </div>
        </div>

        <div className="px-2.5 py-2.5 sm:px-4 sm:py-3">
          <div className="text-[10px] text-muted-foreground sm:text-[11px]">
            {t(L.statAverage, locale)}
          </div>
          <div className="mt-0.5 font-mono tabular-nums">
            <span className="text-base font-bold text-foreground sm:text-lg">
              {avgPercent !== null ? `${avgPercent.toFixed(1)}%` : "—"}
            </span>
          </div>
        </div>

        <div className="px-2.5 py-2.5 sm:px-4 sm:py-3">
          <div className="text-[10px] text-muted-foreground sm:text-[11px]">
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

      {/* Main Comparison + Inline Grade Selectors */}
      <div role="region" aria-labelledby="overview">
        {/* Mobile stacked list (< sm) — prevents horizontal table overflow */}
        <div className="divide-y divide-border/40 sm:hidden">
          {rows.map(
            ({
              course,
              scoreCell,
              hasStatusWarning,
              manualLetter,
              autoLetter,
              manualPassFail,
              autoPassFail,
            }) => (
              <div key={course.code} className="px-3.5 py-3">
                <button
                  type="button"
                  onClick={() => onSelectCourse(course.code)}
                  aria-label={`${course.code} — ${t(L.inspectRow, locale)}`}
                  className="group/btn flex w-full items-center gap-2 text-left focus-visible:outline-none focus-visible:underline cursor-pointer"
                >
                  <CourseCodeBadge code={course.code} />
                  <span className="min-w-0 flex-1 truncate text-xs font-medium text-foreground group-hover/btn:text-primary">
                    {locale === "th" ? course.nameTh : course.nameEn}
                  </span>
                  <ChevronDown className="size-3.5 shrink-0 text-muted-foreground/60" />
                </button>

                <div className="mt-2 flex items-center justify-between gap-2 pl-0.5">
                  <span
                    className={`font-mono text-xs tabular-nums ${
                      hasStatusWarning
                        ? "font-medium text-amber-500"
                        : "font-semibold text-foreground"
                    }`}
                  >
                    {scoreCell}
                  </span>

                  <CourseGradeControl
                    course={course}
                    manualLetter={manualLetter}
                    autoLetter={autoLetter}
                    manualPassFail={manualPassFail}
                    autoPassFail={autoPassFail}
                    locale={locale}
                    onLetterChange={handleLetterChange}
                    onPassFailChange={handlePassFailChange}
                  />
                </div>
              </div>
            ),
          )}
        </div>

        {/* Desktop & tablet table (>= sm) with fixed column budget */}
        <div className="hidden sm:block">
          <Table className="w-full table-fixed">
            <TableHeader>
              <TableRow className="border-border/50 hover:bg-transparent">
                <TableHead scope="col" className="pl-4 text-xs">
                  {t(L.colCourse, locale)}
                </TableHead>
                <TableHead scope="col" className="w-28 md:w-32 text-right text-xs">
                  {t(L.colGraded, locale)}
                </TableHead>
                <TableHead scope="col" className="w-40 md:w-44 text-right text-xs">
                  {t(L.colGrade, locale)}
                </TableHead>
                <TableHead scope="col" className="w-9 pr-4" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map(
                ({
                  course,
                  scoreCell,
                  hasStatusWarning,
                  manualLetter,
                  autoLetter,
                  manualPassFail,
                  autoPassFail,
                }) => (
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
                        className="group/btn flex w-full min-w-0 items-center gap-2.5 text-left focus-visible:outline-none focus-visible:underline cursor-pointer"
                      >
                        <CourseCodeBadge code={course.code} />
                        <span className="min-w-0 flex-1 truncate text-xs font-medium text-foreground group-hover/btn:text-primary sm:text-[13px]">
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
                        {scoreCell}
                      </span>
                    </TableCell>

                    <TableCell
                      className="text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <CourseGradeControl
                        course={course}
                        manualLetter={manualLetter}
                        autoLetter={autoLetter}
                        manualPassFail={manualPassFail}
                        autoPassFail={autoPassFail}
                        locale={locale}
                        onLetterChange={handleLetterChange}
                        onPassFailChange={handlePassFailChange}
                      />
                    </TableCell>

                    <TableCell className="pr-4 text-right">
                      <ChevronDown className="inline size-3.5 text-muted-foreground/60" />
                    </TableCell>
                  </TableRow>
                ),
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Standalone Responsive GPA Summary Bar outside the table container */}
      <div className="flex flex-col gap-3 border-t border-border/60 bg-muted/25 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="text-xs font-semibold text-foreground">
            {t(L.gpaLabel, locale)}
          </div>
          <div className="mt-0.5 text-[11px] font-normal text-muted-foreground">
            {gpaSummary.gradedCount > 0
              ? `${t(L.gpaCountPrefix, locale)} ${gpaSummary.gradedCount}/${gpaSummary.letterCourseCount} ${t(L.gpaCoursesLabel, locale)} (${gpaSummary.gradedCredits} ${t(L.gpaCreditsLabel, locale)})`
              : t(L.gpaHintEmpty, locale)}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2.5 sm:justify-end shrink-0">
          <div className="flex flex-wrap items-center gap-1.5">
            {hasAnyManual && (
              <button
                type="button"
                onClick={resetAllManualScores}
                aria-label={t(L.resetScoresBtn, locale)}
                title={t(L.resetScoresBtn, locale)}
                className="inline-flex items-center gap-1 rounded-md border border-border/50 bg-background/50 px-2 py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground cursor-pointer"
              >
                <RotateCcw className="size-3" />
                <span>{t(L.resetScoresBtn, locale)}</span>
              </button>
            )}

            {hasAnySelection && (
              <button
                type="button"
                onClick={handleResetGrades}
                aria-label={t(L.resetGradesBtn, locale)}
                title={t(L.resetGradesBtn, locale)}
                className="inline-flex items-center gap-1 rounded-md border border-border/50 bg-background/50 px-2 py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground cursor-pointer"
              >
                <RotateCcw className="size-3" />
                <span>{t(L.resetGradesBtn, locale)}</span>
              </button>
            )}

            {gpaSummary.gradedCount > 0 && (
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
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
          </div>

          <span
            className={`font-mono text-xl font-bold tabular-nums ${
              gpaSummary.gpa === null
                ? "text-muted-foreground"
                : gpaSummary.isProbation
                  ? "text-amber-500"
                  : "text-foreground"
            }`}
          >
            {gpaSummary.gpa !== null ? gpaSummary.gpa.toFixed(2) : "—"}
          </span>
        </div>
      </div>

      {/* Academic Probation & S/U Notes (2 bullet points) */}
      <div
        className={`flex items-start gap-2.5 border-t px-4 py-2.5 text-[11px] leading-relaxed ${
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
        <ul className="list-disc space-y-0.5 pl-4">
          <li>{t(L.probationNote1, locale)}</li>
          <li>{t(L.probationNote2, locale)}</li>
        </ul>
      </div>
    </div>
  );
}
