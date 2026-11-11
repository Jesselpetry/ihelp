import { COURSES, courseHref, type CatalogCourse } from "@/lib/courses/catalog";
import type { LText } from "@/lib/i18n";
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

export interface ManualSubInputDef {
  id: string;
  label: LText;
  defaultWeight: number;
  editableWeight?: boolean;
}

export interface SyllabusCategory {
  id: string;
  name: string;
  nameEn?: string;
  weight: number;
  isFinal?: boolean;
  /** Matching key(s) in `CourseScoreViewResponse.categories` from local score sheets. */
  sheetKeys?: string[];
  /** Extra / bonus points on top of the 100-point scale (e.g. PSCP Exercise 3 pts). */
  isExtra?: boolean;
  /** Manual input behavior when not provided by a score sheet. */
  inputMode?: "score" | "problem_count";
  /** Problem count denominator when `inputMode === "problem_count"`. */
  problemCountMax?: number;
  /** Optional split sub-inputs (e.g. MFIT 1st-half / 2nd-half Attendance & Quiz). */
  subInputs?: ManualSubInputDef[];
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
      {
        id: "itf-midterm",
        name: "สอบกลางภาค (Midterm Exam)",
        nameEn: "Midterm Exam",
        weight: 30,
      },
      {
        id: "itf-final",
        name: "สอบปลายภาค (Final Exam)",
        nameEn: "Final Exam",
        weight: 30,
        isFinal: true,
      },
      {
        id: "itf-lab-att",
        name: "เช็คชื่อ Lab (W01–W17)",
        nameEn: "Lab Attendance (W01–W17)",
        weight: 15,
        sheetKeys: ["attendance"],
      },
      {
        id: "itf-lab-asg",
        name: "งาน Lab (W01–W17)",
        nameEn: "Lab Assignments (W01–W17)",
        weight: 15,
        sheetKeys: ["assignment"],
      },
      {
        id: "itf-lec-att",
        name: "เข้าเรียนภาคบรรยาย (Lecture Attendance)",
        nameEn: "Lecture Attendance",
        weight: 10,
      },
    ],
    cutoffs: [...DEFAULT_CUTOFFS],
    notes:
      "เกณฑ์ตามประมวลการสอน 1/2569: สอบกลางภาค 30% · ปลายภาค 30% · ปฏิบัติการแล็บ 30% (เช็คชื่อ 15% + งาน 15%) · เข้าเรียนบรรยาย 10%",
  },
  ICS: {
    credits: 3,
    mode: "letter",
    categories: [
      {
        id: "ics-midterm",
        name: "สอบกลางภาค ครึ่งแรก (ส่งทางอีเมล)",
        nameEn: "Midterm Exam (1st Half · Email)",
        weight: 50,
      },
      {
        id: "ics-quiz",
        name: "Quiz ในคาบครึ่งหลัง (ch01–ch07)",
        nameEn: "Lecture Quizzes (ch01–ch07)",
        weight: 15,
        sheetKeys: ["quiz"],
      },
      {
        id: "ics-lab",
        name: "งานแล็บครึ่งหลัง (Lab 1–5)",
        nameEn: "Hardware Labs (1–5)",
        weight: 10,
        sheetKeys: ["lab"],
      },
      {
        id: "ics-lab-exam",
        name: "สอบปฏิบัติการแล็บ (Lab Exam)",
        nameEn: "Lab Exam",
        weight: 15,
        sheetKeys: ["labExam"],
      },
      {
        id: "ics-final",
        name: "สอบปลายภาค ครึ่งหลัง (Final Exam)",
        nameEn: "Final Exam (2nd Half)",
        weight: 10,
        isFinal: true,
        sheetKeys: ["final"],
      },
    ],
    cutoffs: [...DEFAULT_CUTOFFS],
    notes: "ครึ่งแรกดิจิทัลลอจิก (กลางภาค 50% ส่งทางอีเมล) · ครึ่งหลังฮาร์ดแวร์ + แล็บ (50%)",
  },
  MFIT: {
    credits: 3,
    mode: "letter",
    categories: [
      {
        id: "mfit-midterm",
        name: "สอบกลางภาค (Linear Algebra)",
        nameEn: "Midterm Exam (Linear Algebra)",
        weight: 35,
      },
      {
        id: "mfit-final",
        name: "สอบปลายภาค (Calculus)",
        nameEn: "Final Exam (Calculus)",
        weight: 35,
        isFinal: true,
      },
      {
        id: "mfit-act",
        name: "Attendance & Quiz (ครึ่งแรก + ครึ่งหลัง)",
        nameEn: "Attendance & Quizzes (1st & 2nd Half)",
        weight: 30,
        subInputs: [
          {
            id: "mfit-att-1",
            label: { th: "Attendance ครึ่งแรก (Linear)", en: "Attendance · 1st Half (Linear)" },
            defaultWeight: 5,
            editableWeight: true,
          },
          {
            id: "mfit-quiz-1",
            label: { th: "Quiz / กิจกรรม ครึ่งแรก", en: "Quiz / Activity · 1st Half" },
            defaultWeight: 10,
            editableWeight: true,
          },
          {
            id: "mfit-att-2",
            label: { th: "Attendance ครึ่งหลัง (Calculus)", en: "Attendance · 2nd Half (Calculus)" },
            defaultWeight: 5,
            editableWeight: true,
          },
          {
            id: "mfit-quiz-2",
            label: { th: "Quiz / การบ้าน ครึ่งหลัง", en: "Quiz / Homework · 2nd Half" },
            defaultWeight: 10,
            editableWeight: true,
          },
        ],
      },
    ],
    cutoffs: [...DEFAULT_CUTOFFS],
    notes:
      "สัดส่วนสไลด์ Week 01: กลางภาค 35% · ปลายภาค 35% · Attendance & Quiz 30% (ปรับคะแนนเต็มช่องย่อย 30% ได้)",
  },
  PSCP: {
    credits: 3,
    mode: "letter",
    categories: [
      {
        id: "pscp-lecture",
        name: "เช็คชื่อ Lecture",
        nameEn: "Lecture Attendance",
        weight: 7.5,
        sheetKeys: ["lecture"],
      },
      {
        id: "pscp-lab",
        name: "เช็คชื่อ Lab",
        nameEn: "Lab Attendance",
        weight: 7.5,
        sheetKeys: ["lab"],
      },
      {
        id: "pscp-interview",
        name: "สัมภาษณ์ (Interview)",
        nameEn: "Interview",
        weight: 5,
        sheetKeys: ["interview"],
      },
      {
        id: "pscp-mini",
        name: "Mini Exam",
        nameEn: "Mini Exam",
        weight: 10,
        sheetKeys: ["miniExam"],
      },
      {
        id: "pscp-ijudge",
        name: "iJudge",
        nameEn: "iJudge",
        weight: 8,
        sheetKeys: ["ijudge"],
      },
      {
        id: "pscp-ll",
        name: "Learning Logs",
        nameEn: "Learning Logs",
        weight: 5,
        sheetKeys: ["learningLogs"],
      },
      {
        id: "pscp-feedback",
        name: "Feedback Form",
        nameEn: "Feedback Form",
        weight: 2,
        sheetKeys: ["feedback"],
      },
      {
        id: "pscp-midterm",
        name: "สอบกลางภาค (Midterm)",
        nameEn: "Midterm Exam",
        weight: 20,
        sheetKeys: ["midterm"],
      },
      {
        id: "pscp-exercise",
        name: "Exercise (คะแนนเสริม)",
        nameEn: "Exercise (Extra)",
        weight: 3,
        sheetKeys: ["exercise"],
        isExtra: true,
      },
      {
        id: "pscp-final",
        name: "สอบปลายภาค (Final · 12 ข้อ)",
        nameEn: "Final Exam (12 Problems)",
        weight: 35,
        isFinal: true,
        sheetKeys: ["final"],
        inputMode: "problem_count",
        problemCountMax: 12,
      },
    ],
    cutoffs: [...DEFAULT_CUTOFFS],
    notes:
      "เกณฑ์ 1/2569 ตามชีต: เก็บพื้นฐาน 65 (+3 Exercise เสริม) + ปลายภาค 35 (12 ข้อ) = ฐาน 100 คะแนน",
  },
  FE: {
    credits: 3,
    mode: "pass_fail",
    categories: [
      {
        id: "fe-midterm",
        name: "สอบกลางภาค (Midterm Test)",
        nameEn: "Midterm Test",
        weight: 30,
      },
      {
        id: "fe-final",
        name: "สอบปลายภาค (Final Exam)",
        nameEn: "Final Exam",
        weight: 35,
        isFinal: true,
      },
      {
        id: "fe-quiz",
        name: "Quizzes, Homework & Presentation",
        nameEn: "Quizzes, Homework & Presentation",
        weight: 35,
      },
    ],
    cutoffs: [{ grade: "A", min: 50, point: 0 }],
    notes: "ประเมินผลแบบผ่าน/ไม่ผ่าน (S/U)",
  },
  CHARM: {
    credits: 2,
    mode: "pass_fail",
    categories: [
      {
        id: "charm-act",
        name: "การเข้าเรียนและร่วมกิจกรรมกลุ่ม (Workshop & Attendance)",
        nameEn: "Workshop & Attendance",
        weight: 50,
      },
      {
        id: "charm-midterm",
        name: "งานที่ได้รับมอบหมายและสอบกลางภาค (Assignments)",
        nameEn: "Assignments",
        weight: 25,
      },
      {
        id: "charm-final",
        name: "โครงงานปลายภาคและการประเมิน (Final Project)",
        nameEn: "Final Project",
        weight: 25,
        isFinal: true,
      },
    ],
    cutoffs: [{ grade: "A", min: 60, point: 0 }],
    notes: "วิชาศึกษาทั่วไป (GE) ตัดเกรดแบบผ่าน/ไม่ผ่าน (S/U) โดยต้องได้คะแนนรวม ≥ 60 คะแนน",
  },
  SPORT: {
    credits: 1,
    mode: "pass_fail",
    categories: [
      {
        id: "sport-att",
        name: "การเข้าร่วมชั้นเรียนและฝึกปฏิบัติ (Attendance & Practice)",
        nameEn: "Attendance & Practice",
        weight: 60,
      },
      {
        id: "sport-test",
        name: "การทดสอบทักษะกีฬาและข้อเขียน (Skills Testing & Theory)",
        nameEn: "Skills Testing & Theory",
        weight: 40,
        isFinal: true,
      },
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

/** Find a Y1-S1 course descriptor by short code (`ITF`) or 8-digit code (`06016402`). */
export function findGradeCourseByCode(
  codeOrOfficial: string,
): GradesCourseEntry | null {
  const needle = codeOrOfficial.trim().toUpperCase();
  return (
    Y1_S1_GRADE_COURSES.find(
      (c) =>
        c.code.toUpperCase() === needle ||
        c.officialCode?.toUpperCase() === needle,
    ) ?? null
  );
}

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

/** Evaluate a numeric score (/100) against a course's grading cutoffs. */
export function calculateCourseGrade(
  totalScore: number,
  course: GradesCourseEntry,
): {
  letter: LetterGrade | null;
  passFail: PassFailGrade | null;
  point: number | null;
} {
  if (course.mode === "pass_fail") {
    const passMin = course.syllabus.cutoffs[0]?.min ?? 50;
    return {
      letter: null,
      passFail: totalScore >= passMin ? "S" : "U",
      point: null,
    };
  }

  const sorted = [...course.syllabus.cutoffs].sort((a, b) => b.min - a.min);
  for (const cutoff of sorted) {
    if (totalScore >= cutoff.min) {
      return {
        letter: cutoff.grade,
        passFail: null,
        point: cutoff.point,
      };
    }
  }

  return { letter: "F", passFail: null, point: 0.0 };
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
