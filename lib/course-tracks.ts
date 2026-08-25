import type { LText } from "@/lib/i18n";

/**
 * The course hub's action cards, as data.
 *
 * Every subject hub used to be a hand-written block of JSX in
 * app/courses/[dir]/page.tsx — six near-identical branches, each repeating the
 * same card markup with different copy, and every question count typed in by
 * hand. This file holds the copy and the roadmap; the page supplies the live
 * hrefs and counts; buildCourseTracks() joins them into what the grid renders.
 *
 * Copy is LText rather than the plain strings a single-language app would use,
 * because every surface here ships Thai and English.
 */

/** Which half of the term a track serves. */
export type TrackScope = "all" | "midterm" | "final";

/**
 * available   — content is on disk and the card links to it
 * coming_soon — on the roadmap, nothing to link to yet
 * locked      — exists but deliberately withheld (permissions, gating)
 */
export type TrackStatus = "available" | "coming_soon" | "locked";

/** Icon keys. Resolved to components client-side; components cannot cross the
 *  server/client boundary as data. */
export type TrackIcon =
  | "overview"
  | "summary"
  | "cram"
  | "learning_path"
  | "quiz"
  | "mock_exam"
  | "speed_quiz"
  | "problems"
  | "library"
  | "analysis";

export interface CourseTrackItem {
  id: string;
  title: LText;
  subtitle: LText;
  icon?: TrackIcon;
  /** Absent when the track is not available. */
  href?: string;
  scope: TrackScope;
  status: TrackStatus;
  /** Short pill: a question count, or the coming-soon marker. */
  badge?: LText;
  /** Secondary line: a resource breakdown such as "7 PDF · 26 ภาพ". */
  stats?: LText;
}

/** Live numbers the badges quote, measured at request time rather than typed in. */
export interface CourseTrackMetrics {
  /** Question-bank size per track id, e.g. `{ quiz: 65, mock_exam: 25 }`. */
  questions?: Readonly<Record<string, number>>;
  /** Resource-library breakdown, counted from the asset registry. */
  library?: { pdfs: number; images: number; docs: number };
}

/** A track a course offers, before live data is folded in. */
interface TrackBlueprint {
  id: string;
  icon: TrackIcon;
  scope: TrackScope;
  title: LText;
  subtitle: LText;
}

const COMING_SOON: LText = { th: "เร็วๆ นี้", en: "Coming soon" };

// ── Shared blueprints ────────────────────────────────────────────────────────
// Courses override only the cards whose copy is subject-specific; everything
// else falls through to these so a new course starts with a full roadmap.

const SUMMARY: TrackBlueprint = {
  id: "summary",
  icon: "summary",
  scope: "midterm",
  title: { th: "สรุปเนื้อหา", en: "Study Notes" },
  subtitle: {
    th: "สรุปเนื้อหาและชีทติวแบบอ่านต่อเนื่อง พร้อมสารบัญด้านข้าง",
    en: "Study notes and cram sheets with a live outline panel",
  },
};

const QUIZ: TrackBlueprint = {
  id: "quiz",
  icon: "quiz",
  scope: "midterm",
  title: { th: "แบบทดสอบ", en: "Practice Quiz" },
  subtitle: {
    th: "แบบทดสอบตัวเองพร้อมคำอธิบายว่าทำไมตัวเลือกอื่นถึงผิด",
    en: "Self-test questions, each explaining why the other options fail",
  },
};

const MOCK_EXAM: TrackBlueprint = {
  id: "mock_exam",
  icon: "mock_exam",
  scope: "midterm",
  title: { th: "ข้อสอบชุดจำลอง", en: "Mock Exam" },
  subtitle: {
    th: "ข้อสอบชุดจำลองเต็มรูปแบบพร้อมเฉลยแสดงวิธีทำ",
    en: "A full mock paper with worked solutions",
  },
};

const PROBLEMS: TrackBlueprint = {
  id: "problems",
  icon: "problems",
  scope: "all",
  title: { th: "คลังโจทย์", en: "Exercises" },
  subtitle: {
    th: "คลังโจทย์ฝึกและโจทย์ OJ พร้อมกำหนดส่ง",
    en: "Exercise and OJ problem bank with due dates",
  },
};

const LIBRARY: TrackBlueprint = {
  id: "library",
  icon: "library",
  scope: "all",
  title: { th: "คลังทรัพยากร", en: "Resource Library" },
  subtitle: {
    th: "สไลด์บรรยาย ไฟล์ PDF ข้อสอบเก่า และภาพสมุดจด",
    en: "Lecture slides, PDFs, past papers, and note scans",
  },
};

/** The roadmap every course shows unless it declares its own. */
const DEFAULT_TRACKS: TrackBlueprint[] = [
  SUMMARY,
  QUIZ,
  MOCK_EXAM,
  PROBLEMS,
  LIBRARY,
];

/** Small helper so a course can keep a shared card but reword part of it. */
function reword(
  base: TrackBlueprint,
  patch: Partial<Pick<TrackBlueprint, "title" | "subtitle" | "scope">>,
): TrackBlueprint {
  return { ...base, ...patch };
}

// ── Per-course roadmaps ──────────────────────────────────────────────────────
// Order is the order a student works through the material, and it is also the
// render order, so two hubs never list the same tracks in a different sequence.

export const COURSE_TRACKS: Record<string, TrackBlueprint[]> = {
  ITF: [
    reword(SUMMARY, {
      title: { th: "คู่มือทบทวน", en: "Study Guide" },
      subtitle: {
        th: "คู่มือทบทวนกลางภาคฉบับเต็ม ครอบคลุม Lecture 01–07 พร้อมตารางเปรียบเทียบศัพท์และจุดที่ออกสอบบ่อย",
        en: "The full midterm guide across lectures 01–07, with comparison tables and the recurring exam points",
      },
    }),
    reword(QUIZ, {
      subtitle: {
        th: "ปรนัย ถูก/ผิด และอัตนัยพร้อมเฉลยให้ตรวจเอง ครอบคลุม Lecture 01–07",
        en: "Multiple choice, true/false, and self-marked written answers across lectures 01–07",
      },
    }),
    MOCK_EXAM,
    LIBRARY,
  ],

  ICS: [
    SUMMARY,
    QUIZ,
    reword(MOCK_EXAM, {
      title: { th: "ข้อสอบชุดฝึก + เฉลย", en: "Practice Exam + Key" },
      subtitle: {
        th: "ข้อสอบอัตนัยตามพิมพ์เขียวข้อสอบจริง พร้อมเฉลยแสดงวิธีทำทีละขั้น",
        en: "Constructed-response questions on the real blueprint, with step-by-step solutions",
      },
    }),
    {
      id: "analysis",
      icon: "analysis",
      scope: "midterm",
      title: { th: "วิเคราะห์ข้อสอบ", en: "Exam Analysis" },
      subtitle: {
        th: "ถอดโครงข้อสอบ 1/2564: น้ำหนักคะแนน กับดักที่พบบ่อย และแผนจัดสรรเวลา 3 ชั่วโมง",
        en: "The 1/2564 paper taken apart: mark weights, recurring traps, and a three-hour plan",
      },
    },
    LIBRARY,
  ],

  MFIT: [
    reword(SUMMARY, {
      subtitle: {
        th: "ครบทั้ง 7 สัปดาห์: เมทริกซ์ determinant ระบบสมการ เวกเตอร์ ปริภูมิเวกเตอร์ การแปลงเชิงเส้น และ eigenvalue",
        en: "All seven weeks: matrices, determinants, systems, vectors, spaces, transformations, and eigenvalues",
      },
    }),
    {
      id: "cram",
      icon: "cram",
      scope: "midterm",
      title: { th: "สรุปเร่งด่วน (ตามข้อสอบ 1–10)", en: "Crash Summary (Q1–Q10)" },
      subtitle: {
        th: "เรียงตามโครงข้อสอบจริง ไม่ใช่ตามบท · สูตร → ขั้นตอน → ตารางกับดัก → วิธีเช็กคำตอบ",
        en: "Ordered by the real blueprint, not by chapter: formula, steps, trap table, self-check",
      },
    },
    {
      id: "learning_path",
      icon: "learning_path",
      scope: "midterm",
      title: { th: "แผนอ่าน 6 ชั่วโมง", en: "6-Hour Study Plan" },
      subtitle: {
        th: "6 บล็อกเรียงตามน้ำหนักจริง · กลยุทธ์ลำดับทำข้อสอบในห้อง · แผนสำรองเมื่อเหลือ 4/2/1 ชม.",
        en: "Six blocks weighted by what counts, in-exam ordering, and fallbacks at 4/2/1 hours left",
      },
    },
    reword(QUIZ, {
      subtitle: {
        th: "คลังข้อสอบรวมชุดซ้อมตามโครงข้อสอบจริง พร้อมคำอธิบายว่าทำไมตัวเลือกอื่นถึงผิด",
        en: "The bank plus a blueprint-shaped drill, each item explaining why the other options fail",
      },
    }),
    reword(MOCK_EXAM, {
      title: { th: "ข้อสอบชุดจำลอง + เฉลย", en: "Mock Exam + Key" },
      subtitle: {
        th: "4 พาร์ต 100 คะแนน: ปรนัย เติมคำ อัตนัย และข้อวิเคราะห์ พร้อมเฉลยละเอียด",
        en: "Four parts, 100 marks: multiple choice, fill-in, written, and analysis, fully worked",
      },
    }),
    {
      id: "speed_quiz",
      icon: "speed_quiz",
      scope: "midterm",
      title: { th: "ชุดซ้อมด่วน + เฉลย", en: "Timed Drill + Key" },
      subtitle: {
        th: "ปรนัย 20 ข้อ 15 นาที + ข้อคำนวณ 5 ข้อที่แมปตรงกับข้อสอบจริงทั้ง 10 ช่อง",
        en: "20 multiple choice in 15 minutes, plus 5 calculations mapped onto all ten exam slots",
      },
    },
    LIBRARY,
  ],

  COMPRO: [
    reword(SUMMARY, {
      subtitle: {
        th: "สรุปครบทุกบท: พื้นฐานคอมพิวเตอร์ ตัวแปร/นิพจน์ เงื่อนไข while for และภาคผนวก",
        en: "Every chapter: computer basics, variables, conditionals, while, for, and the appendix",
      },
    }),
    reword(QUIZ, {
      subtitle: {
        th: "ทดสอบความเข้าใจจุดที่ข้อสอบชอบออก รวมชุดข้อสอบจำลอง",
        en: "Drills on the traps the paper keeps setting, mock paper included",
      },
    }),
    MOCK_EXAM,
    LIBRARY,
  ],

  CHEM: [
    reword(SUMMARY, {
      subtitle: {
        th: "สรุปครบทุกบท: อะตอม ตารางธาตุ พันธะ สโตอิชิโอเมตรี และสารละลาย",
        en: "Every chapter: atoms, the periodic table, bonding, stoichiometry, and solutions",
      },
    }),
    reword(QUIZ, {
      subtitle: {
        th: "ครอบคลุมทุกบท พร้อมคำอธิบายและ feedback ทันที",
        en: "Across every chapter, with explanations and instant feedback",
      },
    }),
    MOCK_EXAM,
    LIBRARY,
  ],

  PSCP: [
    reword(PROBLEMS, {
      title: { th: "คลังโจทย์ iJudge", en: "iJudge Problems" },
      subtitle: {
        th: "รายการโจทย์ทั้งหมด พร้อมระบบเช็คสถานะและกำหนดส่ง",
        en: "Every problem set, with a status tracker and deadlines",
      },
    }),
    reword(SUMMARY, {
      scope: "all",
      title: { th: "โจทย์แนะนำ + เฉลย", en: "Recommended Problems" },
      subtitle: {
        th: "10 โจทย์คัดสรรพร้อมแนวคิด เทคนิค Python และโค้ดตัวอย่าง",
        en: "Ten curated problems with the idea behind each, Python techniques, and worked code",
      },
    }),
    QUIZ,
    MOCK_EXAM,
    LIBRARY,
  ],
};

/**
 * Joins a course's roadmap to what is actually live.
 *
 * `hrefs` decides status: a track with a href is available, one without is on
 * the roadmap but not built. Counts come from `metrics` so a badge can never
 * drift from the bank it describes — the old hub had "63 ข้อ" and "65 ข้อ"
 * hand-written into two different files.
 */
export function buildCourseTracks(
  code: string,
  hrefs: Readonly<Record<string, string | undefined>>,
  metrics: CourseTrackMetrics = {},
): CourseTrackItem[] {
  const blueprints = COURSE_TRACKS[code] ?? DEFAULT_TRACKS;

  return blueprints.map((blueprint): CourseTrackItem => {
    const href = hrefs[blueprint.id];
    const status: TrackStatus = href ? "available" : "coming_soon";
    const questionCount = metrics.questions?.[blueprint.id];

    let badge: LText | undefined;
    if (status !== "available") {
      badge = COMING_SOON;
    } else if (questionCount) {
      badge = { th: `${questionCount} ข้อ`, en: `${questionCount} questions` };
    }

    let stats: LText | undefined;
    if (status === "available" && blueprint.id === "library" && metrics.library) {
      const { pdfs, images, docs } = metrics.library;
      const th: string[] = [];
      const en: string[] = [];
      if (pdfs) { th.push(`${pdfs} PDF`); en.push(`${pdfs} PDF${pdfs > 1 ? "s" : ""}`); }
      if (images) { th.push(`${images} ภาพ`); en.push(`${images} image${images > 1 ? "s" : ""}`); }
      if (docs) { th.push(`${docs} เอกสาร`); en.push(`${docs} doc${docs > 1 ? "s" : ""}`); }
      if (th.length) stats = { th: th.join(" · "), en: en.join(" · ") };
    }

    return {
      id: blueprint.id,
      title: blueprint.title,
      subtitle: blueprint.subtitle,
      icon: blueprint.icon,
      href,
      scope: blueprint.scope,
      status,
      badge,
      stats,
    };
  });
}
