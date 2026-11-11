import { COURSES, courseHref, type CatalogCourse } from "@/lib/courses/catalog";
import type { CourseScoreViewResponse } from "@/lib/scores/types";

export const Y1_S1_COURSE_CODES = [
  "ITF",
  "ICS",
  "MFIT",
  "PSCP",
  "FE",
  "CHARM",
  "SPORT",
] as const;

export type Y1S1CourseCode = (typeof Y1_S1_COURSE_CODES)[number];

export type LetterGrade = "A" | "B+" | "B" | "C+" | "C" | "D+" | "D" | "F";
export type PassFailGrade = "S" | "U";

export interface GradeOption {
  grade: LetterGrade;
  point: number;
}

export const LETTER_GRADE_OPTIONS: GradeOption[] = [
  { grade: "A", point: 4.0 },
  { grade: "B+", point: 3.5 },
  { grade: "B", point: 3.0 },
  { grade: "C+", point: 2.5 },
  { grade: "C", point: 2.0 },
  { grade: "D+", point: 1.5 },
  { grade: "D", point: 1.0 },
  { grade: "F", point: 0.0 },
];

export const PROBATION_GPA_THRESHOLD = 1.9;

export interface SyllabusCategory {
  id: string;
  name: string;
  weight: number;
  isFinal?: boolean;
}

export interface GradeCutoff {
  grade: LetterGrade;
  min: number;
  point: number;
}

export interface CourseSyllabusMeta {
  credits: number;
  mode: "letter" | "pass_fail";
  categories: SyllabusCategory[];
  cutoffs: GradeCutoff[];
  notes?: string;
}

const DEFAULT_CUTOFFS: GradeCutoff[] = [
  { grade: "A", min: 80, point: 4.0 },
  { grade: "B+", min: 75, point: 3.5 },
  { grade: "B", min: 70, point: 3.0 },
  { grade: "C+", min: 65, point: 2.5 },
  { grade: "C", min: 60, point: 2.0 },
  { grade: "D+", min: 55, point: 1.5 },
  { grade: "D", min: 50, point: 1.0 },
  { grade: "F", min: 0, point: 0.0 },
];

const Y1_S1_SYLLABUS: Record<Y1S1CourseCode, CourseSyllabusMeta> = {
  ITF: {
    credits: 3,
    mode: "letter",
    categories: [
      { id: "itf-midterm", name: "สอบกลางภาค (Midterm Exam)", weight: 30 },
      { id: "itf-final", name: "สอบปลายภาค (Final Exam)", weight: 30, isFinal: true },
      { id: "itf-lab", name: "งานแล็บและการบ้าน (Lab & Assignments)", weight: 30 },
      { id: "itf-att", name: "การเข้าเรียนและการมีส่วนร่วม (Attendance)", weight: 10 },
    ],
    cutoffs: [...DEFAULT_CUTOFFS],
    notes: "เกณฑ์ตามประมวลการสอน 1/2569: สอบกลางภาค 30% · ปลายภาค 30% · แล็บ 30% · เข้าเรียน 10%",
  },
  ICS: {
    credits: 3,
    mode: "letter",
    categories: [
      { id: "ics-midterm", name: "สอบกลางภาค (Midterm Exam)", weight: 50 },
      { id: "ics-final", name: "สอบปลายภาค (Final Exam)", weight: 10, isFinal: true },
      { id: "ics-quiz", name: "Quiz ในคาบบรรยายรายสัปดาห์ (Lecture Quizzes)", weight: 15 },
      { id: "ics-lab", name: "งานแล็บ 1–5 (Logisim Lab Reports)", weight: 10 },
      { id: "ics-lab-exam", name: "สอบปฏิบัติการแล็บ (Lab Exam)", weight: 15 },
    ],
    cutoffs: [...DEFAULT_CUTOFFS],
    notes: "ครึ่งแรกเน้นดิจิทัลลอจิก (กลางภาค 50%) · ครึ่งหลังฮาร์ดแวร์ + แล็บ (50%)",
  },
  MFIT: {
    credits: 3,
    mode: "letter",
    categories: [
      { id: "mfit-midterm", name: "สอบกลางภาค (Linear Algebra)", weight: 35 },
      { id: "mfit-final", name: "สอบปลายภาค (Calculus)", weight: 35, isFinal: true },
      { id: "mfit-act", name: "กิจกรรมในห้อง, การบ้าน & Quiz (Participation & Homework)", weight: 30 },
    ],
    cutoffs: [...DEFAULT_CUTOFFS],
    notes: "สัดส่วนสไลด์ Week 01: กลางภาค 35% · ปลายภาค 35% · กิจกรรมและการบ้าน 30%",
  },
  PSCP: {
    credits: 3,
    mode: "letter",
    categories: [
      { id: "pscp-midterm", name: "สอบกลางภาค (Midterm Coding Exam)", weight: 30 },
      { id: "pscp-final", name: "สอบปลายภาค (Final Coding Exam)", weight: 30, isFinal: true },
      { id: "pscp-labs", name: "แบบฝึกหัดแล็บและโจทย์ iJudge (Weekly Labs & OJ)", weight: 30 },
      { id: "pscp-quiz", name: "Quiz ย่อยและการเข้าเรียน (Quizzes & Participation)", weight: 10 },
    ],
    cutoffs: [...DEFAULT_CUTOFFS],
    notes: "มาตรฐานวิชาโปรแกรมมิ่ง: กลางภาค 30% · ปลายภาค 30% · แล็บ iJudge 30% · Quiz 10%",
  },
  FE: {
    credits: 3,
    mode: "pass_fail",
    categories: [
      { id: "fe-midterm", name: "สอบกลางภาค (Midterm Test)", weight: 30 },
      { id: "fe-final", name: "สอบปลายภาค (Final Exam)", weight: 35, isFinal: true },
      { id: "fe-quiz", name: "Quizzes, Homework & Presentation", weight: 35 },
    ],
    cutoffs: [{ grade: "A", min: 50, point: 0 }],
    notes: "ประเมินผลแบบผ่าน/ไม่ผ่าน (S/U)",
  },
  CHARM: {
    credits: 2,
    mode: "pass_fail",
    categories: [
      { id: "charm-act", name: "การเข้าเรียนและร่วมกิจกรรมกลุ่ม (Workshop & Attendance)", weight: 50 },
      { id: "charm-midterm", name: "งานที่ได้รับมอบหมายและสอบกลางภาค (Assignments)", weight: 25 },
      { id: "charm-final", name: "โครงงานปลายภาคและการประเมิน (Final Project)", weight: 25, isFinal: true },
    ],
    cutoffs: [{ grade: "A", min: 60, point: 0 }],
    notes: "วิชาศึกษาทั่วไป (GE) ตัดเกรดแบบผ่าน/ไม่ผ่าน (S/U) โดยต้องได้คะแนนรวม ≥ 60 คะแนน",
  },
  SPORT: {
    credits: 1,
    mode: "pass_fail",
    categories: [
      { id: "sport-att", name: "การเข้าร่วมชั้นเรียนและฝึกปฏิบัติ (Attendance & Practice)", weight: 60 },
      { id: "sport-test", name: "การทดสอบทักษะกีฬาและข้อเขียน (Skills Testing & Theory)", weight: 40, isFinal: true },
    ],
    cutoffs: [{ grade: "A", min: 50, point: 0 }],
    notes: "วิชาศึกษาทั่วไป (GE) ตัดเกรดแบบผ่าน/ไม่ผ่าน (S/U)",
  },
};

export interface GradesCourseEntry {
  code: Y1S1CourseCode;
  officialCode: string | null;
  nameTh: string;
  nameEn: string;
  credits: number;
  mode: "letter" | "pass_fail";
  href: string | null;
  catalog: CatalogCourse;
  syllabus: CourseSyllabusMeta;
}

/**
 * Joined Y1-S1 course descriptors combining the course catalog with official
 * assessment structures and grading modes.
 */
export const Y1_S1_GRADE_COURSES: GradesCourseEntry[] = Y1_S1_COURSE_CODES.flatMap(
  (code) => {
    const catalog = COURSES.find((c) => c.code === code);
    if (!catalog) return [];
    const syllabus = Y1_S1_SYLLABUS[code];

    return [
      {
        code,
        officialCode: catalog.officialCode ?? null,
        nameTh: catalog.nameTh,
        nameEn: catalog.nameEn,
        credits: syllabus.credits,
        mode: syllabus.mode,
        href: courseHref(catalog) ?? null,
        catalog,
        syllabus,
      },
    ];
  },
);

/** Match a score sheet response back to a catalog Y1-S1 course entry. */
export function matchScoreForCourse(
  entry: GradesCourseEntry,
  scores: CourseScoreViewResponse[],
): CourseScoreViewResponse | null {
  const shortUpper = entry.code.toUpperCase();
  const officialUpper = entry.officialCode?.toUpperCase();

  return (
    scores.find((s) => {
      const target = s.courseCode.toUpperCase();
      return target === shortUpper || (officialUpper ? target === officialUpper : false);
    }) ?? null
  );
}

/** Format the percentage progress across the currently graded parts of a score sheet. */
export function gradedPercentage(score: CourseScoreViewResponse | null): number | null {
  if (!score?.enrolled || !score.mySummary) return null;
  if (score.mySummary.status) return null;
  if (score.mySummary.gradedMax <= 0) return null;
  return (score.mySummary.total / score.mySummary.gradedMax) * 100;
}

export interface SemesterGpaSummary {
  gpa: number | null;
  gradedCount: number;
  letterCourseCount: number;
  gradedCredits: number;
  isProbation: boolean;
}

/**
 * Calculate semester GPA from the user's selected letter grades (excluding S/U courses).
 */
export function calculateSemesterGpa(
  courses: GradesCourseEntry[],
  selectedGrades: Partial<Record<Y1S1CourseCode, LetterGrade | "">>,
): SemesterGpaSummary {
  let gradedCount = 0;
  let letterCourseCount = 0;
  let gradedCredits = 0;
  let totalPoints = 0;

  for (const course of courses) {
    if (course.mode !== "letter") continue;
    letterCourseCount += 1;

    const chosen = selectedGrades[course.code];
    if (!chosen) continue;

    const option = LETTER_GRADE_OPTIONS.find((o) => o.grade === chosen);
    if (!option) continue;

    gradedCount += 1;
    gradedCredits += course.credits;
    totalPoints += option.point * course.credits;
  }

  const gpa =
    gradedCredits > 0 ? Math.round((totalPoints / gradedCredits) * 100) / 100 : null;

  return {
    gpa,
    gradedCount,
    letterCourseCount,
    gradedCredits,
    isProbation: gpa !== null && gpa < PROBATION_GPA_THRESHOLD,
  };
}
