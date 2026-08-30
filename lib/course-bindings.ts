import type { LText } from "@/lib/i18n";
import type { QuizQuestion } from "@/lib/quiz";
import type { ModuleId, ModuleScope } from "@/lib/spine";
import { loadCourseDoc, loadCourseOverview } from "@/lib/course-content";
import { loadIcs, loadItf, loadMfit } from "@/lib/it-kmitl";
import { loadChem, loadEnKmitl } from "@/lib/en-kmitl";

import { ITF_QUIZ, ITF_QUIZ_ID } from "@/lib/itf-quiz";
import { ICS_QUIZ, ICS_QUIZ_ID } from "@/lib/ics-quiz";
import { MFIT_BLUEPRINT_QUIZ, MFIT_QUIZ, MFIT_QUIZ_ID } from "@/lib/mfit-quiz";
import { EN_KMITL_CURATED_QUIZ, EN_KMITL_QUIZ_ID } from "@/lib/en-kmitl-quiz";
import { EN_KMITL_MOCK_EXAM } from "@/lib/en-kmitl-mock-exam";
import { CHEM_QUIZ, CHEM_QUIZ_ID } from "@/lib/chem-quiz";
import { COMPRO_PROBLEMS } from "@/lib/compro-labs";

/**
 * Progress key for COMPRO's mock paper, now that it is its own module.
 *
 * Progress is keyed by a number because the store predates subject banks and
 * keys on iJudge problem ids; the synthetic 9000xx range exists so a subject
 * bank cannot collide with a real four-digit OJ id. A new module needs a new
 * id rather than sharing the drill's, or sixty summative answers would be
 * folded into the practice score.
 */
const COMPRO_MOCK_QUIZ_ID = 900006;

const COMPRO_PROBLEM_COUNT = COMPRO_PROBLEMS.length;

/**
 * What each course can actually fill, module by module.
 *
 * This is the whole of a course's configuration. Everything that used to be
 * spread across a `hubFor()` switch, an `extraHrefs` bag, a `questionCounts`
 * map and four separate `if (course.code === ...)` chains in the route layer
 * now lives here as one record per course, and lib/spine.ts joins it to the
 * standard eleven modules.
 *
 * A course lists only what it has. Modules it omits still render — as locked
 * slots naming what is missing — so the roadmap stays visible and the gap stays
 * honest.
 */

/** One document a module renders. */
export interface ModuleDoc {
  /** Stable id within the module, used for anchors and prev/next. */
  slug: string;
  title: LText;
  /** Reads the Markdown. Returns null when the file is not on disk. */
  load: () => string | null;
  /** Which chapter or week this document covers. */
  chapter?: number;
  /** Which exam it is studied for. Absent = spans the term. */
  scope?: Exclude<ModuleScope, "all">;
}

export interface ModuleBinding {
  /** Documents this module renders, in order. */
  docs?: ModuleDoc[];
  /** Question bank feeding this module. */
  bank?: () => QuizQuestion[];
  /** Progress-store key for that bank. Required whenever `bank` is set. */
  quizId?: number;
  /**
   * Escape hatch for a module whose content lives in a registry rather than in
   * documents or a bank — the asset library, the lab JSON. Without it those
   * modules would read as empty and render as locked slots beside the content
   * they actually have.
   */
  filled?: () => boolean;
  /**
   * Route override, for a module that lives outside /courses/<dir>/<segment>.
   * Only PSCP needs one: its problem bank predates the course hub and keeps
   * its own top-level URL, which students already have bookmarked.
   */
  href?: string;
  /** Per-course copy, when the standard wording undersells what is here. */
  title?: LText;
  subtitle?: LText;
  scope?: ModuleScope;
  /** Caveat printed under the module, e.g. that a bank is not the real paper. */
  note?: LText;
}

export type CourseBinding = Partial<Record<ModuleId, ModuleBinding>>;

// ── Shared helpers ───────────────────────────────────────────────────────────

/** The course-overview document every catalogued course ships. */
function overview(dir: string): ModuleDoc {
  return {
    slug: "overview",
    title: { th: "ภาพรวมรายวิชา", en: "Course Overview" },
    load: () => loadCourseOverview(dir),
  };
}

/**
 * The default binding: a course overview standing in for both orientation and
 * study notes, plus whatever the asset registry holds.
 *
 * Nine of fifteen courses have only this. That is not a template being lazy —
 * it is the true state of those courses, and the eight empty slots the spine
 * renders beside it are the point.
 */
function baseline(dir: string, opts: { archive?: boolean } = {}): CourseBinding {
  const binding: CourseBinding = {
    orientation: { docs: [overview(dir)] },
    deep_summary: { docs: [overview(dir)] },
  };
  if (opts.archive !== false) binding.archive = {};
  return binding;
}

/** MFIT's weeks 8-15: eight summaries and eight quizzes, paired, final scope. */
const MFIT_FINAL_WEEKS = [8, 9, 10, 11, 12, 13, 14, 15] as const;

function mfitWeekDocs(kind: "summary" | "quiz"): ModuleDoc[] {
  return MFIT_FINAL_WEEKS.map((week) => {
    const padded = String(week).padStart(2, "0");
    return {
      slug: `week${padded}-${kind}`,
      title:
        kind === "summary"
          ? { th: `สัปดาห์ที่ ${week} — สรุป`, en: `Week ${week} — Summary` }
          : { th: `สัปดาห์ที่ ${week} — แบบทดสอบ`, en: `Week ${week} — Quiz` },
      load: () =>
        loadCourseDoc("06016401", `archive/study-guide-week${padded}-${kind}.md`),
      chapter: week,
      scope: "final" as const,
    };
  });
}

// ── Per-course bindings ──────────────────────────────────────────────────────

export const COURSE_BINDINGS: Record<string, CourseBinding> = {
  // ── ปี 1 เทอม 1 ───────────────────────────────────────────────────────────
  ITF: {
    orientation: { docs: [overview("06016402-IT-Fundamentals")] },
    deep_summary: {
      title: { th: "คู่มือทบทวน", en: "Study Guide" },
      subtitle: {
        th: "คู่มือทบทวนกลางภาคฉบับเต็ม ครอบคลุม Lecture 01–07 พร้อมตารางเปรียบเทียบศัพท์และจุดที่ออกสอบบ่อย",
        en: "The full midterm guide across lectures 01–07, with comparison tables and the recurring exam points",
      },
      scope: "midterm",
      docs: [
        {
          slug: "study-guide",
          title: { th: "คู่มือทบทวน Lecture 01–07", en: "Study Guide, Lectures 01–07" },
          load: () => loadItf().summaryMd,
          scope: "midterm",
        },
        {
          slug: "midterm-study-guide",
          title: { th: "คู่มือทบทวนกลางภาค (ฉบับย่อ)", en: "Midterm Study Guide (condensed)" },
          load: () => loadCourseDoc("06016402", "midterm-study-guide.md"),
          scope: "midterm",
        },
      ],
    },
    drill: {
      subtitle: {
        th: "ปรนัย ถูก/ผิด และอัตนัยพร้อมเฉลยให้ตรวจเอง ครอบคลุม Lecture 01–07",
        en: "Multiple choice, true/false, and self-marked written answers across lectures 01–07",
      },
      scope: "midterm",
      bank: () => ITF_QUIZ,
      quizId: ITF_QUIZ_ID,
      note: {
        th: "คลังข้อสอบสร้างจากคู่มือทบทวนกลางภาค ไม่ใช่ข้อสอบจริง — ใช้ทบทวนความเข้าใจ ไม่ใช่เดาแนวข้อสอบ",
        en: "Derived from the midterm review guide, not the real paper — for reinforcing concepts, not predicting questions",
      },
    },
    archive: {},
  },

  ICS: {
    orientation: {
      subtitle: {
        th: "ภาพรวมรายวิชา และบทวิเคราะห์ข้อสอบ 1/2564: น้ำหนักคะแนน กับดักที่พบบ่อย และแผนจัดสรรเวลา 3 ชั่วโมง",
        en: "The course overview plus the 1/2564 paper taken apart: mark weights, recurring traps, and a three-hour plan",
      },
      docs: [
        overview("06016411-Intro-to-Computer-Systems"),
        {
          slug: "exam-analysis",
          title: { th: "วิเคราะห์ข้อสอบ 1/2564", en: "Exam Analysis, 1/2564" },
          load: () => loadIcs().analysisMd,
          scope: "midterm",
        },
      ],
    },
    deep_summary: {
      scope: "midterm",
      docs: [
        {
          slug: "notes",
          title: { th: "สรุปเนื้อหา บทที่ 1–6", en: "Study Notes, Chapters 1–6" },
          load: () => loadIcs().summaryMd,
          scope: "midterm",
        },
      ],
    },
    drill: { scope: "midterm", bank: () => ICS_QUIZ, quizId: ICS_QUIZ_ID },
    mock_exam: {
      title: { th: "ข้อสอบชุดฝึก + เฉลย", en: "Practice Exam + Key" },
      subtitle: {
        th: "ข้อสอบอัตนัยตามพิมพ์เขียวข้อสอบจริง พร้อมเฉลยแสดงวิธีทำทีละขั้น",
        en: "Constructed-response questions on the real blueprint, with step-by-step solutions",
      },
      scope: "midterm",
      docs: [
        {
          slug: "practice-paper",
          title: { th: "ข้อสอบชุดฝึกพร้อมเฉลย", en: "Practice paper with key" },
          load: () => loadIcs().examMd,
          scope: "midterm",
        },
      ],
      note: {
        th: "ข้อสอบเป็นอัตนัยทั้งฉบับ — ต้องแสดงวิธีทำทุกข้อ คะแนนกระจุกที่พีชคณิตบูลีน + K-Map + ออกแบบวงจร รวม 90 จาก 120 คะแนน (75%)",
        en: "The paper is constructed-response throughout — Boolean algebra, K-maps and circuit design carry 90 of 120 marks (75%)",
      },
    },
    archive: {},
  },

  MFIT: {
    orientation: { docs: [overview("06016401-Math-for-IT")] },
    syllabus_map: {
      subtitle: {
        th: "แผนที่ 8 สัปดาห์ของขอบเขตปลายภาค พร้อมเสาหลักและสไลด์ต้นทางของแต่ละสัปดาห์",
        en: "The eight weeks of the final-exam scope, with each week's pillar and source deck",
      },
      scope: "final",
      docs: [
        {
          slug: "syllabus",
          title: { th: "แผนที่เนื้อหาปลายภาค", en: "Final-scope syllabus map" },
          load: () => loadCourseDoc("06016401", "archive/study-guide-syllabus.md"),
          scope: "final",
        },
      ],
    },
    deep_summary: {
      subtitle: {
        th: "กลางภาค 7 สัปดาห์ (พีชคณิตเชิงเส้น) และปลายภาค 8 สัปดาห์ (แคลคูลัส) แยกตามสัปดาห์",
        en: "Seven midterm weeks of linear algebra and eight final weeks of calculus, split by week",
      },
      docs: [
        {
          slug: "linear-algebra",
          title: { th: "พีชคณิตเชิงเส้น สัปดาห์ที่ 1–7", en: "Linear Algebra, Weeks 1–7" },
          load: () => loadMfit().summaryMd,
          scope: "midterm",
        },
        ...mfitWeekDocs("summary"),
      ],
    },
    cram_sheet: {
      title: { th: "สรุปเร่งด่วน + แผนอ่าน", en: "Crash Summary + Study Plan" },
      subtitle: {
        th: "เรียงตามโครงข้อสอบจริง ไม่ใช่ตามบท · สูตร → ขั้นตอน → ตารางกับดัก และแผนอ่าน 6 บล็อก",
        en: "Ordered by the real blueprint, not by chapter: formula, steps, trap table, plus a six-block plan",
      },
      scope: "midterm",
      docs: [
        {
          slug: "crash-summary",
          title: { th: "สรุปเร่งด่วน (ตามข้อสอบ 1–10)", en: "Crash Summary (Q1–Q10)" },
          load: () => loadMfit().cramMd,
          scope: "midterm",
        },
        {
          slug: "study-plan",
          title: { th: "แผนอ่าน 6 ชั่วโมง", en: "6-Hour Study Plan" },
          load: () => loadMfit().learningPathMd,
          scope: "midterm",
        },
      ],
    },
    drill: {
      subtitle: {
        th: "คลังข้อสอบรวมชุดซ้อมตามโครงข้อสอบจริง พร้อมคำอธิบายว่าทำไมตัวเลือกอื่นถึงผิด",
        en: "The bank plus a blueprint-shaped drill, each item explaining why the other options fail",
      },
      // One order, declared once. The hub and the quiz page used to concatenate
      // these two arrays in opposite orders, so the hub described a sequence the
      // quiz did not run.
      bank: () => [...MFIT_QUIZ, ...MFIT_BLUEPRINT_QUIZ],
      quizId: MFIT_QUIZ_ID,
      docs: mfitWeekDocs("quiz"),
      note: {
        th: "โครงข้อสอบจากสไลด์ Q&A ของอาจารย์: 10 ข้อ · 180 นาที · ตอบเป็นตัวเลข · มีเครื่องคิดเลขให้",
        en: "Blueprint from the instructor's Q&A slides: 10 questions, 180 minutes, numeric answers, calculators allowed",
      },
    },
    speed_quiz: {
      title: { th: "ชุดซ้อมด่วน + เฉลย", en: "Timed Drill + Key" },
      subtitle: {
        th: "ปรนัย 20 ข้อ 15 นาที + ข้อคำนวณ 5 ข้อที่แมปตรงกับข้อสอบจริงทั้ง 10 ช่อง",
        en: "20 multiple choice in 15 minutes, plus 5 calculations mapped onto all ten exam slots",
      },
      scope: "midterm",
      docs: [
        {
          slug: "timed-drill",
          title: { th: "ชุดซ้อมด่วนพร้อมเฉลย", en: "Timed drill with key" },
          load: () => loadMfit().mockExamMd,
          scope: "midterm",
        },
      ],
    },
    mock_exam: {
      title: { th: "ข้อสอบชุดจำลอง + เฉลย", en: "Mock Exam + Key" },
      subtitle: {
        th: "4 พาร์ต 100 คะแนน: ปรนัย เติมคำ อัตนัย และข้อวิเคราะห์ พร้อมเฉลยละเอียด",
        en: "Four parts, 100 marks: multiple choice, fill-in, written, and analysis, fully worked",
      },
      docs: [
        {
          slug: "midterm-paper",
          title: { th: "ข้อสอบจำลองกลางภาค", en: "Midterm mock paper" },
          load: () => loadMfit().examMd,
          scope: "midterm",
        },
        {
          slug: "final-paper",
          title: { th: "ข้อสอบจำลองปลายภาค", en: "Final mock paper" },
          load: () => loadCourseDoc("06016401", "archive/study-guide-mock-exam.md"),
          scope: "final",
        },
      ],
    },
    archive: {},
  },

  PSCP: {
    orientation: {
      docs: [overview("06066303-Problem-Solving-and-Computer-Programming")],
    },
    deep_summary: {
      // Used to point at /recommended — a problem hub in a different information
      // architecture, reached by clicking "Study Notes". The course has real
      // notes; this now opens them.
      docs: [overview("06066303-Problem-Solving-and-Computer-Programming")],
    },
    applied: {
      title: { th: "คลังโจทย์ iJudge", en: "iJudge Problems" },
      subtitle: {
        th: "รายการโจทย์ทั้งหมดพร้อมกำหนดส่ง · โจทย์แนะนำ 10 ข้อพร้อมเฉลยและตัวตรวจโค้ดในเบราว์เซอร์",
        en: "Every problem with its deadline, plus ten annotated problems with a browser-based grader",
      },
      href: "/pscp",
    },
    archive: {},
  },

  CHARM: baseline("90641001-Charm-School"),
  FE: baseline("90644007-Foundation-English"),
  SPORT: baseline("90641003-Sports-and-Recreational-Activities", { archive: false }),

  // ── ปี 1 เทอม 2 ───────────────────────────────────────────────────────────
  BFIT: baseline("06066101-Business-for-IT"),
  DSA: baseline("06066301-Data-Structures-and-Algorithms"),
  OOP: baseline("06016408-Object-Oriented-Programming"),
  PSTAT: baseline("06066001-Probability-and-Statistics"),
  FE2: baseline("90644008-Foundation-English-II"),
  DL: baseline("90641002-Digital-Literacy"),

  // ── EN-KMITL ──────────────────────────────────────────────────────────────
  COMPRO: {
    orientation: {
      docs: [
        {
          slug: "overview",
          title: { th: "ภาพรวมรายวิชา", en: "Course Overview" },
          load: () => loadEnKmitl().summaryMd,
        },
      ],
    },
    deep_summary: {
      subtitle: {
        th: "สรุปครบทุกบท: พื้นฐานคอมพิวเตอร์ ตัวแปร/นิพจน์ เงื่อนไข while for และภาคผนวก",
        en: "Every chapter: computer basics, variables, conditionals, while, for, and the appendix",
      },
      docs: [
        {
          slug: "notes",
          title: { th: "สรุปเนื้อหา บทที่ 1–5", en: "Study Notes, Chapters 1–5" },
          load: () => loadEnKmitl().summaryMd,
          scope: "midterm",
        },
      ],
    },
    drill: {
      subtitle: {
        th: "ทดสอบความเข้าใจจุดที่ข้อสอบชอบออก บทที่ 1–5",
        en: "Drills on the traps the paper keeps setting, chapters 1–5",
      },
      scope: "midterm",
      // The 60-item mock paper used to be concatenated onto this bank, so a
      // student who pressed "practice quiz" was handed 70 questions with no
      // sign that 60 of them were a different instrument. It is its own module.
      bank: () => EN_KMITL_CURATED_QUIZ,
      quizId: EN_KMITL_QUIZ_ID,
    },
    applied: {
      title: { th: "ห้องแลป Python สัปดาห์ 1–5", en: "Python Labs, Weeks 1–5" },
      subtitle: {
        th: "25 โจทย์จากพอร์ทัลรายวิชา เขียนโค้ด กดตรวจ เห็นผลทันทีในเบราว์เซอร์",
        en: "25 problems from the course portal — write, run, and check in the browser",
      },
      scope: "all",
      filled: () => COMPRO_PROBLEM_COUNT > 0,
    },
    mock_exam: {
      subtitle: {
        th: "ข้อสอบจำลองกลางภาค 60 ข้อ 5 ตัวเลือก ครอบคลุมบทที่ 1–5",
        en: "A 60-question, five-option midterm mock across chapters 1–5",
      },
      scope: "midterm",
      bank: () => EN_KMITL_MOCK_EXAM,
      quizId: COMPRO_MOCK_QUIZ_ID,
    },
    archive: {},
  },

  CHEM: {
    orientation: {
      docs: [
        {
          slug: "overview",
          title: { th: "ภาพรวมรายวิชา", en: "Course Overview" },
          load: () => loadChem().summaryMd,
        },
      ],
    },
    deep_summary: {
      subtitle: {
        th: "สรุปครบทุกบท: อะตอม ตารางธาตุ พันธะ สโตอิชิโอเมตรี และสารละลาย",
        en: "Every chapter: atoms, the periodic table, bonding, stoichiometry, and solutions",
      },
      docs: [
        {
          slug: "notes",
          title: { th: "สรุปเนื้อหา บทที่ 1–5", en: "Study Notes, Chapters 1–5" },
          load: () => loadChem().summaryMd,
          scope: "midterm",
        },
      ],
    },
    drill: {
      subtitle: {
        th: "ครอบคลุมทุกบท พร้อมคำอธิบายและ feedback ทันที",
        en: "Across every chapter, with explanations and instant feedback",
      },
      scope: "midterm",
      bank: () => CHEM_QUIZ,
      quizId: CHEM_QUIZ_ID,
    },
    archive: {},
  },
};
