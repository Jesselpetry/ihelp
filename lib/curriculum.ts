import { loadCourseJson } from "@/lib/course-content";
import type { LText } from "@/lib/i18n";
import type { SubjectChapter } from "@/lib/spine";

/**
 * The structured curriculum spec a course can ship beside its Markdown.
 *
 * MFIT's `archive/study-guide-curriculum.json` is the only one written so far,
 * and until now nothing read it — it sat next to eight weeks of final-scope
 * material that no route could reach either. It carries what the orientation
 * module needs and no Markdown heading can supply: learning pillars, the
 * grading model, the conditions that score zero, and a week-by-week map with
 * topics and formulas already separated out.
 *
 * Typed loosely on purpose. Only the fields the app renders are declared; the
 * file also holds homework cadence, source-material inventories and mock-exam
 * section tables that nothing reads yet, and narrowing them now would mean
 * guessing at a shape a second course has not had to satisfy.
 */
export interface CurriculumSpec {
  course?: {
    name_en?: string;
    name_th?: string;
    track?: string;
    year_semester?: string;
    known_course_codes?: string[];
    language_of_materials?: string;
  };
  scope?: {
    label?: string;
    weeks?: number[];
    week_start?: number;
    week_end?: number;
    source_slides?: string[];
    /** The 3-5 things the whole scope rests on. */
    pillars?: string[];
  };
  assessment?: {
    grading_model?: string;
    partial_credit?: boolean;
    full_solution_required?: boolean;
    full_solution_note_th?: string;
    handwritten_required?: boolean;
    typed_submission_allowed?: boolean;
    zero_score_conditions?: string[];
  };
  weeks?: CurriculumWeek[];
  mock_exam?: {
    total_points?: number;
    total_problems?: number;
    duration_minutes?: number;
    calculator_allowed?: boolean;
    covers_weeks?: number[];
  };
}

export interface CurriculumWeek {
  week: number;
  id?: string;
  title_th?: string;
  title_en?: string;
  source_slide?: string;
  pillar?: string;
  topics?: string[];
  key_formulas?: { name: string; latex: string }[];
}

/** Where a course keeps its curriculum spec, relative to its content directory. */
const CURRICULUM_PATHS = [
  "curriculum.json",
  "archive/study-guide-curriculum.json",
];

export function loadCurriculum(courseParam: string): CurriculumSpec | null {
  for (const relPath of CURRICULUM_PATHS) {
    const spec = loadCourseJson<CurriculumSpec>(courseParam, relPath);
    if (spec) return spec;
  }
  return null;
}

/**
 * The curriculum's weeks as spine chapters.
 *
 * `scope` comes from the spec's own `scope.label` rather than from the week
 * number: a file that says "Final Exam Scope" is stating it, and inferring the
 * same fact from "week >= 8" would be a guess that breaks the moment a course
 * splits its term somewhere else.
 */
export function curriculumChapters(spec: CurriculumSpec): SubjectChapter[] {
  const label = spec.scope?.label?.toLowerCase() ?? "";
  const scope = label.includes("final")
    ? ("final" as const)
    : label.includes("midterm")
      ? ("midterm" as const)
      : undefined;

  return (spec.weeks ?? []).map((week): SubjectChapter => ({
    chapter: week.week,
    title: {
      th: week.title_th ?? week.title_en ?? `สัปดาห์ที่ ${week.week}`,
      ...(week.title_en ? { en: week.title_en } : {}),
    },
    scope,
  }));
}

/** Pillars as display text. Empty when the spec does not name any. */
export function curriculumPillars(spec: CurriculumSpec): string[] {
  return spec.scope?.pillars ?? [];
}

/**
 * The assessment rules stated plainly enough to print on the orientation page.
 *
 * Everything here is quoted from the spec, never softened: "all_or_nothing"
 * with `partial_credit: false` is exactly the fact a student needs before
 * choosing how to practise, and it is the fact that makes a bank of four-option
 * multiple choice the wrong preparation for this paper.
 */
export function curriculumRules(spec: CurriculumSpec): LText[] {
  const a = spec.assessment;
  if (!a) return [];
  const rules: LText[] = [];

  if (a.grading_model === "all_or_nothing" || a.partial_credit === false) {
    rules.push({
      th: "ให้คะแนนแบบได้-ไม่ได้ ไม่มีคะแนนบางส่วน",
      en: "All-or-nothing marking — no partial credit",
    });
  }
  if (a.full_solution_required) {
    rules.push({
      th: a.full_solution_note_th ?? "ต้องแสดงวิธีทำทีละขั้นตอน ห้ามเขียนคำตอบอย่างเดียว",
      en: "Every step must be shown; a bare answer scores nothing",
    });
  }
  if (a.handwritten_required) {
    rules.push({
      th: "ต้องเขียนด้วยลายมือ พิมพ์ส่งไม่ได้",
      en: "Handwritten only — typed submissions are not accepted",
    });
  }
  return rules;
}
