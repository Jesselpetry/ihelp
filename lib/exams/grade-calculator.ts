/**
 * Grade & Exam Score Calculator Engine for iHelp
 *
 * Provides course presets for Year 1 Semester 1 (and extensible to any course),
 * safe expression calculation (e.g. "10 + 5 + 8.5"), target final exam score
 * roadmaps, GPA simulation, and Excel / TSV copy-paste import.
 */

export interface SubScoreItem {
  id: string;
  label: string;
  score: number;
  maxScore: number;
}

export interface ScoreCategory {
  id: string;
  name: string;
  weight: number; // Total max score / percentage
  rawInput: string; // Supports math like "15+12.5"
  score: number; // Computed score
  isFinal?: boolean; // Identified as final exam for target score projection
  subScores?: SubScoreItem[];
  showSubScores?: boolean;
}

export interface GradeCutoff {
  grade: "A" | "B+" | "B" | "C+" | "C" | "D+" | "D" | "F";
  min: number;
  point: number;
}

export interface CourseCalculator {
  id: string;
  code: string;
  shortCode: string;
  nameTh: string;
  nameEn: string;
  credits: number;
  color?: string;
  mode: "letter" | "pass_fail";
  categories: ScoreCategory[];
  cutoffs: GradeCutoff[];
  notes?: string;
}

export const DEFAULT_CUTOFFS: GradeCutoff[] = [
  { grade: "A", min: 80, point: 4.0 },
  { grade: "B+", min: 75, point: 3.5 },
  { grade: "B", min: 70, point: 3.0 },
  { grade: "C+", min: 65, point: 2.5 },
  { grade: "C", min: 60, point: 2.0 },
  { grade: "D+", min: 55, point: 1.5 },
  { grade: "D", min: 50, point: 1.0 },
  { grade: "F", min: 0, point: 0.0 },
];

/**
 * Year 1 Semester 1 Course Presets based on official IT KMITL syllabus
 */
export const Y1_S1_PRESETS: CourseCalculator[] = [
  {
    id: "itf",
    code: "06016402",
    shortCode: "ITF",
    nameTh: "พื้นฐานทางด้านเทคโนโลยีสารสนเทศ",
    nameEn: "IT Fundamentals",
    credits: 3,
    color: "#2563eb",
    mode: "letter",
    categories: [
      {
        id: "itf-midterm",
        name: "สอบกลางภาค (Midterm Exam)",
        weight: 30,
        rawInput: "",
        score: 0,
      },
      {
        id: "itf-final",
        name: "สอบปลายภาค (Final Exam)",
        weight: 30,
        rawInput: "",
        score: 0,
        isFinal: true,
      },
      {
        id: "itf-lab",
        name: "งานแล็บและการบ้าน (Lab & Assignments)",
        weight: 30,
        rawInput: "",
        score: 0,
        subScores: [
          { id: "lab-1", label: "Lab 01-05 (Linux, Word, LaTeX)", score: 0, maxScore: 15 },
          { id: "lab-2", label: "Lab 06-07 (Excel 1 & 2)", score: 0, maxScore: 15 },
        ],
      },
      {
        id: "itf-att",
        name: "การเข้าเรียนและการมีส่วนร่วม (Attendance)",
        weight: 10,
        rawInput: "",
        score: 0,
      },
    ],
    cutoffs: [...DEFAULT_CUTOFFS],
    notes: "เกณฑ์ตามประมวลการสอน 1/2569: สอบกลางภาค 30% · ปลายภาค 30% · แล็บ 30% · เข้าเรียน 10%",
  },
  {
    id: "ics",
    code: "06016411",
    shortCode: "ICS",
    nameTh: "ระบบคอมพิวเตอร์เบื้องต้น",
    nameEn: "Intro to Computer Systems",
    credits: 3,
    color: "#0284c7",
    mode: "letter",
    categories: [
      {
        id: "ics-midterm",
        name: "สอบกลางภาค (Midterm Exam)",
        weight: 50,
        rawInput: "",
        score: 0,
      },
      {
        id: "ics-final",
        name: "สอบปลายภาค (Final Exam)",
        weight: 10,
        rawInput: "",
        score: 0,
        isFinal: true,
      },
      {
        id: "ics-quiz",
        name: "Quiz ในคาบบรรยายรายสัปดาห์ (Lecture Quizzes)",
        weight: 15,
        rawInput: "",
        score: 0,
      },
      {
        id: "ics-lab",
        name: "งานแล็บ 1–5 (Logisim Lab Reports)",
        weight: 10,
        rawInput: "",
        score: 0,
      },
      {
        id: "ics-lab-exam",
        name: "สอบปฏิบัติการแล็บ (Lab Exam)",
        weight: 15,
        rawInput: "",
        score: 0,
      },
    ],
    cutoffs: [...DEFAULT_CUTOFFS],
    notes: "ครึ่งแรกเน้นดิจิทัลลอจิก (กลางภาค 50%) · ครึ่งหลังฮาร์ดแวร์ + แล็บ (50%)",
  },
  {
    id: "mfit",
    code: "06016401",
    shortCode: "MFIT",
    nameTh: "คณิตศาสตร์สำหรับเทคโนโลยีสารสนเทศ",
    nameEn: "Math for IT",
    credits: 3,
    color: "#7c3aed",
    mode: "letter",
    categories: [
      {
        id: "mfit-midterm",
        name: "สอบกลางภาค (Linear Algebra)",
        weight: 35,
        rawInput: "",
        score: 0,
      },
      {
        id: "mfit-final",
        name: "สอบปลายภาค (Calculus)",
        weight: 35,
        rawInput: "",
        score: 0,
        isFinal: true,
      },
      {
        id: "mfit-act",
        name: "กิจกรรมในห้อง, การบ้าน & Quiz (Participation & Homework)",
        weight: 30,
        rawInput: "",
        score: 0,
      },
    ],
    cutoffs: [...DEFAULT_CUTOFFS],
    notes: "สัดส่วนสไลด์ Week 01: กลางภาค 35% · ปลายภาค 35% · กิจกรรมและการบ้าน 30%",
  },
  {
    id: "pscp",
    code: "06066303",
    shortCode: "PSCP",
    nameTh: "การแก้ปัญหาและการโปรแกรมคอมพิวเตอร์",
    nameEn: "Problem Solving & Computer Programming",
    credits: 3,
    color: "#db2777",
    mode: "letter",
    categories: [
      {
        id: "pscp-midterm",
        name: "สอบกลางภาค (Midterm Coding Exam)",
        weight: 30,
        rawInput: "",
        score: 0,
      },
      {
        id: "pscp-final",
        name: "สอบปลายภาค (Final Coding Exam)",
        weight: 30,
        rawInput: "",
        score: 0,
        isFinal: true,
      },
      {
        id: "pscp-labs",
        name: "แบบฝึกหัดแล็บและโจทย์ iJudge (Weekly Labs & OJ)",
        weight: 30,
        rawInput: "",
        score: 0,
      },
      {
        id: "pscp-quiz",
        name: "Quiz ย่อยและการเข้าเรียน (Quizzes & Participation)",
        weight: 10,
        rawInput: "",
        score: 0,
      },
    ],
    cutoffs: [...DEFAULT_CUTOFFS],
    notes: "มาตรฐานวิชาโปรแกรมมิ่ง: กลางภาค 30% · ปลายภาค 30% · แล็บ iJudge 30% · Quiz 10%",
  },
  {
    id: "fe",
    code: "90644007",
    shortCode: "FE",
    nameTh: "ภาษาอังกฤษพื้นฐาน 1",
    nameEn: "Foundation English 1",
    credits: 3,
    color: "#059669",
    mode: "letter",
    categories: [
      {
        id: "fe-midterm",
        name: "สอบกลางภาค (Midterm Test)",
        weight: 30,
        rawInput: "",
        score: 0,
      },
      {
        id: "fe-final",
        name: "สอบปลายภาค (Final Exam)",
        weight: 35,
        rawInput: "",
        score: 0,
        isFinal: true,
      },
      {
        id: "fe-quiz",
        name: "Quizzes, Homework & Presentation",
        weight: 35,
        rawInput: "",
        score: 0,
      },
    ],
    cutoffs: [...DEFAULT_CUTOFFS],
    notes: "สามารถปรับโหมดการตัดเกรดเป็น A-F หรือ ผ่าน/ไม่ผ่าน (S/U) ได้",
  },
  {
    id: "charm",
    code: "90641001",
    shortCode: "CHARM",
    nameTh: "โรงเรียนสร้างเสน่ห์",
    nameEn: "Charm School",
    credits: 2,
    color: "#ea580c",
    mode: "letter",
    categories: [
      {
        id: "charm-act",
        name: "การเข้าเรียนและร่วมกิจกรรมกลุ่ม (Workshop & Attendance)",
        weight: 50,
        rawInput: "",
        score: 0,
      },
      {
        id: "charm-midterm",
        name: "งานที่ได้รับมอบหมายและสอบกลางภาค (Assignments)",
        weight: 25,
        rawInput: "",
        score: 0,
      },
      {
        id: "charm-final",
        name: "โครงงานปลายภาคและการประเมิน (Final Project)",
        weight: 25,
        rawInput: "",
        score: 0,
        isFinal: true,
      },
    ],
    cutoffs: [...DEFAULT_CUTOFFS],
    notes: "เน้นการเข้าเรียน ปฏิบัติจริง และโครงงานกลุ่ม",
  },
  {
    id: "sport",
    code: "90641003",
    shortCode: "SPORT",
    nameTh: "กีฬาและนันทนาการ",
    nameEn: "Sports & Recreational Activities",
    credits: 1,
    color: "#16a34a",
    mode: "letter",
    categories: [
      {
        id: "sport-att",
        name: "การเข้าร่วมชั้นเรียนและฝึกปฏิบัติ (Attendance & Practice)",
        weight: 60,
        rawInput: "",
        score: 0,
      },
      {
        id: "sport-test",
        name: "การทดสอบทักษะกีฬาและข้อเขียน (Skills Testing & Theory)",
        weight: 40,
        rawInput: "",
        score: 0,
        isFinal: true,
      },
    ],
    cutoffs: [...DEFAULT_CUTOFFS],
    notes: "เน้นการเข้าฝึกซ้อมสม่ำเสมอและการทดสอบทักษะท้ายเทอม",
  },
];

/**
 * Safe, zero-eval arithmetic parser for calculator inputs.
 * Supports: "+", "-", "*", "/", decimal points, parentheses, and clean whitespace.
 * e.g. "10 + 5.5 + 4" -> 19.5
 * e.g. "20 - 3" -> 17
 * e.g. "15 * 0.8" -> 12
 */
export function evaluateMathExpression(input: string): number | null {
  if (!input || typeof input !== "string") return null;
  const clean = input.trim().replace(/\s+/g, "");
  if (!clean) return null;

  // Validate allowed characters: digits, decimal, operators +, -, *, /, (, )
  if (!/^[\d+\-*/.()]+$/.test(clean)) {
    return null;
  }

  // Tokenize
  const tokens: (string | number)[] = [];
  let i = 0;
  while (i < clean.length) {
    const ch = clean[i];
    if (ch === "+" || ch === "-" || ch === "*" || ch === "/" || ch === "(" || ch === ")") {
      tokens.push(ch);
      i++;
    } else if (/\d|\./.test(ch)) {
      let numStr = "";
      while (i < clean.length && /[\d.]/.test(clean[i])) {
        numStr += clean[i];
        i++;
      }
      const parsed = parseFloat(numStr);
      if (isNaN(parsed)) return null;
      tokens.push(parsed);
    } else {
      return null;
    }
  }

  // Shunting-yard algorithm to convert to RPN
  const outputQueue: (number | string)[] = [];
  const operatorStack: string[] = [];
  const precedence: Record<string, number> = { "+": 1, "-": 1, "*": 2, "/": 2 };

  for (let idx = 0; idx < tokens.length; idx++) {
    const token = tokens[idx];
    if (typeof token === "number") {
      outputQueue.push(token);
    } else if (token in precedence) {
      // Handle unary minus: if at start or previous token is an operator or '('
      const isUnary =
        (token === "-" || token === "+") &&
        (idx === 0 || tokens[idx - 1] === "(" || tokens[idx - 1] in precedence);

      if (isUnary && token === "-") {
        outputQueue.push(0); // 0 - x
      }

      while (
        operatorStack.length > 0 &&
        operatorStack[operatorStack.length - 1] !== "(" &&
        precedence[operatorStack[operatorStack.length - 1]] >= precedence[token]
      ) {
        outputQueue.push(operatorStack.pop()!);
      }
      operatorStack.push(token);
    } else if (token === "(") {
      operatorStack.push(token);
    } else if (token === ")") {
      while (
        operatorStack.length > 0 &&
        operatorStack[operatorStack.length - 1] !== "("
      ) {
        outputQueue.push(operatorStack.pop()!);
      }
      if (operatorStack.length === 0) return null; // mismatched
      operatorStack.pop(); // discard '('
    }
  }

  while (operatorStack.length > 0) {
    const op = operatorStack.pop()!;
    if (op === "(" || op === ")") return null;
    outputQueue.push(op);
  }

  // Evaluate RPN
  const evalStack: number[] = [];
  for (const item of outputQueue) {
    if (typeof item === "number") {
      evalStack.push(item);
    } else {
      const b = evalStack.pop();
      const a = evalStack.pop();
      if (a === undefined || b === undefined) return null;
      switch (item) {
        case "+":
          evalStack.push(a + b);
          break;
        case "-":
          evalStack.push(a - b);
          break;
        case "*":
          evalStack.push(a * b);
          break;
        case "/":
          if (b === 0) return null;
          evalStack.push(a / b);
          break;
        default:
          return null;
      }
    }
  }

  if (evalStack.length !== 1) return null;
  const result = evalStack[0];
  if (isNaN(result) || !isFinite(result)) return null;

  // Round to 2 decimal places to prevent float rounding noise like 19.499999999999996
  return Math.round(result * 100) / 100;
}

/**
 * Calculates current course total score, grade letter, and grade points
 */
export function calculateCourseResult(course: CourseCalculator): {
  totalScore: number;
  maxScore: number;
  percentage: number;
  grade: string;
  point: number;
  status: "pass" | "fail" | "pending";
} {
  let totalScore = 0;
  let maxScore = 0;

  for (const cat of course.categories) {
    maxScore += cat.weight;
    let score = cat.score;
    // If category has sub-scores, sum them
    if (cat.subScores && cat.subScores.length > 0) {
      score = cat.subScores.reduce((acc, sub) => acc + (sub.score || 0), 0);
    }
    totalScore += Math.max(0, score);
  }

  totalScore = Math.round(totalScore * 100) / 100;
  const percentage = maxScore > 0 ? (totalScore / maxScore) * 100 : 0;

  if (course.mode === "pass_fail") {
    const passed = totalScore >= 50;
    return {
      totalScore,
      maxScore,
      percentage,
      grade: passed ? "S" : "U",
      point: passed ? 4.0 : 0.0,
      status: passed ? "pass" : "fail",
    };
  }

  // Sort cutoffs descending
  const sortedCutoffs = [...course.cutoffs].sort((a, b) => b.min - a.min);
  let matched = sortedCutoffs[sortedCutoffs.length - 1]; // fallback 'F'

  for (const cutoff of sortedCutoffs) {
    if (totalScore >= cutoff.min) {
      matched = cutoff;
      break;
    }
  }

  return {
    totalScore,
    maxScore,
    percentage,
    grade: matched.grade,
    point: matched.point,
    status: matched.grade !== "F" ? "pass" : "fail",
  };
}

export interface FinalTargetRequirement {
  grade: string;
  point: number;
  minTotal: number;
  neededOnFinal: number;
  percentageOfFinal: number;
  status: "achieved" | "achievable" | "impossible";
}

/**
 * Computes how many points are needed on the Final Exam to secure each grade
 */
export function calculateFinalTargets(
  course: CourseCalculator
): {
  finalCategory: ScoreCategory | null;
  currentWithoutFinal: number;
  targets: FinalTargetRequirement[];
} {
  const finalCategory =
    course.categories.find((c) => c.isFinal) ||
    course.categories[course.categories.length - 1] ||
    null;

  if (!finalCategory || finalCategory.weight <= 0) {
    return { finalCategory: null, currentWithoutFinal: 0, targets: [] };
  }

  // Calculate score from all categories except final
  let currentWithoutFinal = 0;
  for (const cat of course.categories) {
    if (cat.id === finalCategory.id) continue;
    let s = cat.score;
    if (cat.subScores && cat.subScores.length > 0) {
      s = cat.subScores.reduce((acc, sub) => acc + (sub.score || 0), 0);
    }
    currentWithoutFinal += Math.max(0, s);
  }
  currentWithoutFinal = Math.round(currentWithoutFinal * 100) / 100;

  const targets: FinalTargetRequirement[] = [];
  const sortedCutoffs = [...course.cutoffs].sort((a, b) => b.min - a.min);

  for (const cutoff of sortedCutoffs) {
    if (cutoff.grade === "F") continue; // No one targets F

    const needed = Math.round((cutoff.min - currentWithoutFinal) * 100) / 100;
    let status: "achieved" | "achievable" | "impossible" = "achievable";
    let pct = 0;

    if (needed <= 0) {
      status = "achieved";
      pct = 0;
    } else if (needed > finalCategory.weight) {
      status = "impossible";
      pct = Math.round((needed / finalCategory.weight) * 100);
    } else {
      status = "achievable";
      pct = Math.round((needed / finalCategory.weight) * 100);
    }

    targets.push({
      grade: cutoff.grade,
      point: cutoff.point,
      minTotal: cutoff.min,
      neededOnFinal: Math.max(0, needed),
      percentageOfFinal: pct,
      status,
    });
  }

  return {
    finalCategory,
    currentWithoutFinal,
    targets,
  };
}

/**
 * Calculates overall semester GPA (GPS)
 */
export function calculateSemesterGPA(courses: CourseCalculator[]): {
  totalCredits: number;
  evaluatedCredits: number;
  cumulativePoints: number;
  gpa: number;
} {
  let totalCredits = 0;
  let evaluatedCredits = 0;
  let cumulativePoints = 0;

  for (const course of courses) {
    totalCredits += course.credits;
    if (course.mode === "pass_fail") continue; // S/U not included in GPA

    const res = calculateCourseResult(course);
    evaluatedCredits += course.credits;
    cumulativePoints += res.point * course.credits;
  }

  const gpa =
    evaluatedCredits > 0
      ? Math.round((cumulativePoints / evaluatedCredits) * 100) / 100
      : 0;

  return {
    totalCredits,
    evaluatedCredits,
    cumulativePoints,
    gpa,
  };
}

/**
 * Parser for Excel / Sheets clipboard data (TSV, CSV, or formatted text)
 */
export function parseExcelOrTextCategories(rawText: string): ScoreCategory[] | null {
  if (!rawText || !rawText.trim()) return null;

  const lines = rawText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length === 0) return null;

  const parsed: ScoreCategory[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Try splitting by Tab (standard Excel copy)
    let parts = line.split("\t").map((p) => p.trim());
    if (parts.length === 1 && line.includes(",")) {
      parts = line.split(",").map((p) => p.trim());
    }

    // If still 1 part, try colon or dash e.g. "Midterm: 30% (ได้ 25)"
    if (parts.length === 1) {
      const colonMatch = line.match(/^([^:=-]+)[:=-]\s*(\d+(?:\.\d+)?)\s*%?\s*(?:\(?(\d+(?:\.\d+)?)\)?)?/);
      if (colonMatch) {
        parts = [colonMatch[1].trim(), colonMatch[2].trim(), colonMatch[3] ? colonMatch[3].trim() : ""];
      }
    }

    // Ignore headers like "หมวด", "สัดส่วน", "คะแนน"
    const lowerFirst = parts[0]?.toLowerCase() || "";
    if (
      lowerFirst.includes("หมวด") ||
      lowerFirst.includes("รายการ") ||
      lowerFirst.includes("category") ||
      lowerFirst.includes("name")
    ) {
      continue;
    }

    if (parts.length >= 2) {
      const name = parts[0];
      const weightNum = parseFloat(parts[1].replace(/[^0-9.]/g, ""));
      if (isNaN(weightNum) || weightNum <= 0) continue;

      let scoreNum = 0;
      let rawInput = "";
      if (parts[2]) {
        const rawScore = parts[2].trim();
        const evaluated = evaluateMathExpression(rawScore);
        if (evaluated !== null) {
          scoreNum = evaluated;
          rawInput = rawScore;
        }
      }

      const isFinal =
        name.toLowerCase().includes("final") ||
        name.includes("ปลายภาค") ||
        name.includes("สอบปลาย");

      parsed.push({
        id: `import-${Date.now()}-${i}`,
        name,
        weight: weightNum,
        rawInput,
        score: scoreNum,
        isFinal,
      });
    }
  }

  return parsed.length > 0 ? parsed : null;
}
