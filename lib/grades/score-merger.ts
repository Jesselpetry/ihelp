import type { LText } from "@/lib/i18n";
import type { CourseScoreViewResponse, ScoreCategoryItem } from "@/lib/scores/types";
import type { ManualScoresState, PscpFinalInputMode } from "./manual-scores-store";
import {
  calculateCourseGrade,
  type GradesCourseEntry,
  type LetterGrade,
  type PassFailGrade,
} from "./y1s1-courses";

const round2 = (n: number) => Math.round(n * 100) / 100;

/**
 * Safely parse a numeric score or simple `a + b` addition expression without eval.
 */
export function parseManualExpression(raw: string | undefined): {
  value: number | null;
  valid: boolean;
} {
  if (!raw) return { value: null, valid: true };
  const trimmed = raw.trim();
  if (!trimmed) return { value: null, valid: true };

  const terms = trimmed.split("+").map((t) => t.trim());
  let sum = 0;

  for (const term of terms) {
    if (!/^\d+(?:\.\d+)?$/.test(term)) {
      return { value: null, valid: false };
    }
    const num = Number(term);
    if (!Number.isFinite(num) || num < 0) {
      return { value: null, valid: false };
    }
    sum += num;
  }

  return { value: round2(sum), valid: true };
}

export interface MergedSubInputItem {
  id: string;
  label: LText;
  max: number;
  defaultWeight: number;
  editableWeight: boolean;
  rawWeight: string;
  rawInput: string;
  score: number | null;
  isInvalid: boolean;
  isOverMax: boolean;
}

export interface MergedCategoryItem {
  id: string;
  label: LText;
  max: number;
  isFinal: boolean;
  isExtra: boolean;
  source: "sheet" | "manual" | "sub_inputs" | "empty";
  editable: boolean;
  sheetCategory: ScoreCategoryItem | null;
  score: number | null;
  rawInput: string;
  isInvalid: boolean;
  isOverMax: boolean;
  inputMode: "score" | "problem_count";
  problemCountMax?: number;
  problemCount: number | null;
  pscpFinalMode?: PscpFinalInputMode;
  subInputs?: MergedSubInputItem[];
}

export interface MergedCourseScore {
  course: GradesCourseEntry;
  hasSheet: boolean;
  sheetStatus: "ลาออก" | "ขาดสอบ" | null;
  items: MergedCategoryItem[];
  sheetEarned: number;
  sheetMax: number;
  manualEarned: number;
  manualMax: number;
  combinedEarned: number;
  baseScale: number;
  extraEarned: number;
  extraMax: number;
  filledBaseWeight: number;
  hasAnyManualInput: boolean;
  hasAnyScore: boolean;
  isComplete: boolean;
  suggestedGrade: {
    letter: LetterGrade | null;
    passFail: PassFailGrade | null;
    point: number | null;
  } | null;
  autoGradeReady: boolean;
}

function findMatchingSheetCategory(
  sheetKeys: string[] | undefined,
  sheetScore: CourseScoreViewResponse | null,
): ScoreCategoryItem | null {
  if (!sheetKeys?.length || !sheetScore?.enrolled) return null;
  return (
    sheetScore.categories.find((c) => sheetKeys.includes(c.key)) ?? null
  );
}

function isOfficialGradedCategory(cat: ScoreCategoryItem | null): cat is ScoreCategoryItem {
  if (!cat) return false;
  if (cat.pending || cat.score === null) return false;
  if (typeof cat.score === "number" && Number.isFinite(cat.score)) return true;
  if (cat.score === "ลาออก" || cat.score === "ขาดสอบ") return true;
  return false;
}

export function mergeCourseScores(
  course: GradesCourseEntry,
  sheetScore: CourseScoreViewResponse | null,
  manualState: ManualScoresState,
): MergedCourseScore {
  const courseInputs = manualState.inputs[course.code] ?? {};
  const courseWeights = manualState.customWeights[course.code] ?? {};
  const hasSheet = Boolean(sheetScore?.enrolled);
  const sheetStatus = sheetScore?.enrolled
    ? (sheetScore.mySummary?.status ?? null)
    : null;

  const items: MergedCategoryItem[] = [];
  let sheetEarned = 0;
  let sheetMax = 0;
  let manualEarned = 0;
  let manualMax = 0;
  let extraEarned = 0;
  let extraMax = 0;
  let baseScale = 0;
  let filledBaseWeight = 0;
  let hasAnyManualInput = false;

  for (const cat of course.syllabus.categories) {
    const matchedSheet = findMatchingSheetCategory(cat.sheetKeys, sheetScore);
    const official = isOfficialGradedCategory(matchedSheet);
    const label: LText = { th: cat.name, en: cat.nameEn ?? cat.name };

    if (official && matchedSheet) {
      const numericVal =
        typeof matchedSheet.score === "number" && Number.isFinite(matchedSheet.score)
          ? round2(matchedSheet.score)
          : 0;
      const catMax = matchedSheet.max;

      sheetEarned = round2(sheetEarned + numericVal);
      sheetMax = round2(sheetMax + catMax);

      if (cat.isExtra) {
        extraMax = round2(extraMax + catMax);
        extraEarned = round2(extraEarned + numericVal);
      } else {
        baseScale = round2(baseScale + catMax);
        filledBaseWeight = round2(filledBaseWeight + catMax);
      }

      items.push({
        id: cat.id,
        label,
        max: catMax,
        isFinal: Boolean(cat.isFinal),
        isExtra: Boolean(cat.isExtra),
        source: "sheet",
        editable: false,
        sheetCategory: matchedSheet,
        score: numericVal,
        rawInput: "",
        isInvalid: false,
        isOverMax: false,
        inputMode: "score",
        problemCount: null,
      });
      continue;
    }

    if (cat.subInputs && cat.subInputs.length > 0) {
      const subItems: MergedSubInputItem[] = [];
      let subMaxTotal = 0;
      let subScoreTotal = 0;
      let anySubFilled = false;
      let anySubInvalid = false;
      let anySubOver = false;

      for (const sub of cat.subInputs) {
        const rawWeight = courseWeights[sub.id] ?? "";
        const parsedWeight = parseManualExpression(rawWeight);
        const effWeight =
          sub.editableWeight && parsedWeight.valid && parsedWeight.value !== null && parsedWeight.value > 0
            ? parsedWeight.value
            : sub.defaultWeight;

        const rawInput = courseInputs[sub.id] ?? "";
        if (rawInput.trim() !== "") hasAnyManualInput = true;
        const parsed = parseManualExpression(rawInput);

        const isOver =
          parsed.valid && parsed.value !== null && parsed.value > effWeight;
        const clamped =
          parsed.valid && parsed.value !== null
            ? round2(Math.min(effWeight, Math.max(0, parsed.value)))
            : null;

        if (clamped !== null) {
          anySubFilled = true;
          subScoreTotal = round2(subScoreTotal + clamped);
          manualEarned = round2(manualEarned + clamped);
          manualMax = round2(manualMax + effWeight);
          if (!cat.isExtra) {
            filledBaseWeight = round2(filledBaseWeight + effWeight);
          }
        }
        if (!parsed.valid) anySubInvalid = true;
        if (isOver) anySubOver = true;

        subMaxTotal = round2(subMaxTotal + effWeight);
        subItems.push({
          id: sub.id,
          label: sub.label,
          max: effWeight,
          defaultWeight: sub.defaultWeight,
          editableWeight: Boolean(sub.editableWeight),
          rawWeight,
          rawInput,
          score: clamped,
          isInvalid: !parsed.valid,
          isOverMax: isOver,
        });
      }

      if (cat.isExtra) {
        extraMax = round2(extraMax + subMaxTotal);
        extraEarned = round2(extraEarned + subScoreTotal);
      } else {
        baseScale = round2(baseScale + subMaxTotal);
      }

      items.push({
        id: cat.id,
        label,
        max: subMaxTotal,
        isFinal: Boolean(cat.isFinal),
        isExtra: Boolean(cat.isExtra),
        source: anySubFilled ? "sub_inputs" : "empty",
        editable: !sheetStatus,
        sheetCategory: matchedSheet,
        score: anySubFilled ? subScoreTotal : null,
        rawInput: "",
        isInvalid: anySubInvalid,
        isOverMax: anySubOver,
        inputMode: "score",
        problemCount: null,
        subInputs: subItems,
      });
      continue;
    }

    const catMax = cat.weight;
    const isProblemMode =
      cat.inputMode === "problem_count" &&
      typeof cat.problemCountMax === "number" &&
      cat.problemCountMax > 0 &&
      manualState.pscpFinalMode === "problems";

    const rawInput = courseInputs[cat.id] ?? "";
    if (rawInput.trim() !== "") hasAnyManualInput = true;
    const parsed = parseManualExpression(rawInput);

    let score: number | null = null;
    let problemCount: number | null = null;
    let isOverMax = false;

    if (isProblemMode && cat.problemCountMax) {
      if (parsed.valid && parsed.value !== null) {
        isOverMax = parsed.value > cat.problemCountMax;
        const clampedCount = Math.min(
          cat.problemCountMax,
          Math.max(0, parsed.value),
        );
        problemCount = round2(clampedCount);
        score = round2((clampedCount / cat.problemCountMax) * catMax);
      }
    } else if (parsed.valid && parsed.value !== null) {
      isOverMax = parsed.value > catMax;
      score = round2(Math.min(catMax, Math.max(0, parsed.value)));
    }

    if (cat.isExtra) {
      extraMax = round2(extraMax + catMax);
      if (score !== null) {
        extraEarned = round2(extraEarned + score);
      }
    } else {
      baseScale = round2(baseScale + catMax);
      if (score !== null) {
        filledBaseWeight = round2(filledBaseWeight + catMax);
      }
    }

    if (score !== null) {
      manualEarned = round2(manualEarned + score);
      manualMax = round2(manualMax + catMax);
    }

    items.push({
      id: cat.id,
      label,
      max: catMax,
      isFinal: Boolean(cat.isFinal),
      isExtra: Boolean(cat.isExtra),
      source: score !== null ? "manual" : "empty",
      editable: !sheetStatus,
      sheetCategory: matchedSheet,
      score,
      rawInput,
      isInvalid: !parsed.valid,
      isOverMax,
      inputMode: cat.inputMode ?? "score",
      problemCountMax: cat.problemCountMax,
      problemCount,
      pscpFinalMode:
        cat.inputMode === "problem_count" ? manualState.pscpFinalMode : undefined,
    });
  }

  const combinedEarned = round2(sheetEarned + manualEarned);
  const hasAnyScore = !sheetStatus && (sheetMax > 0 || manualMax > 0);
  const isComplete =
    !sheetStatus && baseScale > 0 && filledBaseWeight >= baseScale - 0.01;
  const suggestedGrade = hasAnyScore
    ? calculateCourseGrade(combinedEarned, course)
    : null;

  return {
    course,
    hasSheet,
    sheetStatus,
    items,
    sheetEarned,
    sheetMax,
    manualEarned,
    manualMax,
    combinedEarned,
    baseScale: baseScale > 0 ? baseScale : 100,
    extraEarned,
    extraMax,
    filledBaseWeight,
    hasAnyManualInput,
    hasAnyScore,
    isComplete,
    suggestedGrade,
    autoGradeReady: isComplete && suggestedGrade !== null,
  };
}
