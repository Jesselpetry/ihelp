import type { LText } from "@/lib/i18n";

/**
 * Course catalogue for the home directory.
 *
 * Ported from iLearn's lib/taxonomy.ts (which mirrors the kmitl-archive folder
 * contract) and narrowed to year 1, plus the two EN-KMITL courses iHelp already
 * carries. Single source of truth for the home page and /courses/[slug].
 *
 * A course only lists a track here once that track actually renders. Tracks it
 * does not list are still shown in the UI — as locked slots — so a student can
 * see the whole roadmap and tell "not built yet" apart from "does not exist".
 */

/** Every kind of learning material a course can offer. */
export type TrackKind =
  | "overview"
  | "summary"
  | "quiz"
  | "mock_exam"
  | "problems"
  | "library";

/**
 * Fixed display order, shared by the course cards and the subject hubs so the
 * same course never lists its tracks in two different orders. Ordered the way
 * a student works: read the scope, study it, drill it, sit a full paper, grind
 * exercises, then dig through the raw material.
 */
export const TRACK_ORDER: TrackKind[] = [
  "overview",
  "summary",
  "quiz",
  "mock_exam",
  "problems",
  "library",
];

export const TRACK_LABEL: Record<TrackKind, LText> = {
  overview: { th: "ภาพรวมรายวิชา", en: "Syllabus" },
  summary: { th: "สรุปเนื้อหา", en: "Study Notes" },
  quiz: { th: "แบบทดสอบ", en: "Practice Quiz" },
  mock_exam: { th: "ข้อสอบจำลอง", en: "Mock Exam" },
  problems: { th: "คลังโจทย์", en: "Exercises" },
  library: { th: "คลังทรัพยากร", en: "Media Library" },
};

/** Longer copy for the module cards on a subject hub. */
export const TRACK_DESC: Record<TrackKind, LText> = {
  overview: {
    th: "ขอบเขตเนื้อหารายสัปดาห์ หน่วยกิต ผู้สอน และสัดส่วนคะแนน",
    en: "Weekly scope, credits, instructors, and grade breakdown",
  },
  summary: {
    th: "สรุปเนื้อหาและชีทติวแบบอ่านต่อเนื่อง พร้อมสารบัญด้านข้าง",
    en: "Study notes and cram sheets with a live outline panel",
  },
  quiz: {
    th: "แบบทดสอบตัวเองพร้อมคำอธิบายว่าทำไมตัวเลือกอื่นถึงผิด",
    en: "Self-test questions, each explaining why the other options fail",
  },
  mock_exam: {
    th: "ข้อสอบชุดจำลองเต็มรูปแบบพร้อมเฉลยแสดงวิธีทำ",
    en: "A full mock paper with worked solutions",
  },
  problems: {
    th: "คลังโจทย์ฝึกและโจทย์ OJ พร้อมกำหนดส่ง",
    en: "Exercise and OJ problem bank with due dates",
  },
  library: {
    th: "สไลด์บรรยาย ไฟล์ PDF ข้อสอบเก่า และภาพสมุดจด",
    en: "Lecture slides, PDFs, past papers, and note scans",
  },
};

export const COURSE_COLORS: Record<string, string> = {
  MFIT: "#2357A5",
  ITF: "#2357A5",
  ICS: "#2357A5",
  PSCP: "#2357A5",
  CHARM: "#2357A5",
  FE: "#2357A5",
  SPORT: "#2357A5",
  BFIT: "#2357A5",
  DSA: "#2357A5",
  OOP: "#2357A5",
  PSTAT: "#2357A5",
  FE2: "#2357A5",
  DL: "#2357A5",
  COMPRO: "#2357A5",
  CHEM: "#2357A5",
};

export type CourseGroup = "Y1-S1" | "Y1-S2" | "EN-KMITL";

export const GROUPS: { id: CourseGroup; label: LText; note: LText }[] = [
  {
    id: "Y1-S1",
    label: { th: "ปี 1 เทอม 1", en: "Year 1 · Semester 1" },
    note: { th: "หลักสูตร IT สจล. (ปรับปรุง 2565)", en: "IT KMITL curriculum (2022 revision)" },
  },
  {
    id: "Y1-S2",
    label: { th: "ปี 1 เทอม 2", en: "Year 1 · Semester 2" },
    note: { th: "หลักสูตร IT สจล. (ปรับปรุง 2565)", en: "IT KMITL curriculum (2022 revision)" },
  },
  {
    id: "EN-KMITL",
    label: { th: "EN-KMITL", en: "EN-KMITL" },
    note: { th: "วิชาคณะวิศวกรรมศาสตร์ที่เปิดให้ลงข้ามคณะ", en: "Engineering faculty courses" },
  },
];

export interface CatalogCourse {
  /** Short code used in filenames and badges, e.g. "MFIT" */
  code: string;
  /** Official KMITL subject code. Absent for courses with no published code. */
  officialCode?: string;
  /** Folder slug, shared with content/courses/{officialCode}-{slug}/ */
  slug: string;
  nameTh: string;
  nameEn: string;
  credits?: string;
  group: CourseGroup;
  /** Subject hub, when this course has its own portal. */
  portalHref?: string;
  /** Official subject details page on https://www.it.kmitl.ac.th */
  officialUrl?: string;
  /** Only the tracks that actually exist today. */
  tracks: Partial<Record<TrackKind, string>>;
}

export const COURSES: CatalogCourse[] = [
  // ── ปี 1 เทอม 1 ─────────────────────────────────────────────────────────────
  {
    code: "ITF",
    officialCode: "06016402",
    slug: "IT-Fundamentals",
    nameTh: "พื้นฐานทางด้านเทคโนโลยีสารสนเทศ",
    nameEn: "IT Fundamentals",
    credits: "3 (2-2-5)",
    group: "Y1-S1",
    portalHref: "/courses/06016402-IT-Fundamentals",
    officialUrl:
      "https://www.it.kmitl.ac.th/th/subjects/06016402-information-technology-fundamentals",
    tracks: {
      overview: "/courses/06016402-IT-Fundamentals",
      summary: "/courses/06016402-IT-Fundamentals/summary",
      quiz: "/courses/06016402-IT-Fundamentals/quiz",
      library: "/courses/06016402-IT-Fundamentals/library",
    },
  },
  {
    code: "ICS",
    officialCode: "06016411",
    slug: "Intro-to-Computer-Systems",
    nameTh: "ระบบคอมพิวเตอร์เบื้องต้น",
    nameEn: "Intro to Computer Systems",
    credits: "3 (2-2-5)",
    group: "Y1-S1",
    portalHref: "/courses/06016411-Intro-to-Computer-Systems",
    officialUrl:
      "https://www.it.kmitl.ac.th/th/subjects/06016411-introduction-to-computer-systems",
    tracks: {
      overview: "/courses/06016411-Intro-to-Computer-Systems",
      summary: "/courses/06016411-Intro-to-Computer-Systems/summary",
      quiz: "/courses/06016411-Intro-to-Computer-Systems/quiz",
      mock_exam: "/courses/06016411-Intro-to-Computer-Systems/exam",
      library: "/courses/06016411-Intro-to-Computer-Systems/library",
    },
  },
  {
    code: "MFIT",
    officialCode: "06016401",
    slug: "Math-for-IT",
    nameTh: "คณิตศาสตร์สำหรับเทคโนโลยีสารสนเทศ",
    nameEn: "Mathematics for Information Technology",
    credits: "3 (3-0-6)",
    group: "Y1-S1",
    portalHref: "/courses/06016401-Math-for-IT",
    officialUrl:
      "https://www.it.kmitl.ac.th/th/subjects/06016401-mathematics-for-information-technology",
    tracks: {
      overview: "/courses/06016401-Math-for-IT",
      summary: "/courses/06016401-Math-for-IT/summary",
      quiz: "/courses/06016401-Math-for-IT/quiz",
      mock_exam: "/courses/06016401-Math-for-IT/exam",
      library: "/courses/06016401-Math-for-IT/library",
    },
  },
  {
    code: "PSCP",
    officialCode: "06066303",
    slug: "Problem-Solving-and-Computer-Programming",
    nameTh: "การแก้ปัญหาและการโปรแกรมคอมพิวเตอร์",
    nameEn: "Problem Solving and Computer Programming",
    credits: "3 (2-2-5)",
    group: "Y1-S1",
    portalHref: "/courses/06066303-Problem-Solving-and-Computer-Programming",
    officialUrl:
      "https://www.it.kmitl.ac.th/th/subjects/06066303-problem-solving-and-computer-programming",
    tracks: {
      overview: "/courses/06066303-Problem-Solving-and-Computer-Programming",
      problems: "/pscp",
      summary: "/recommended",
      library: "/courses/06066303-Problem-Solving-and-Computer-Programming/library",
    },
  },
  {
    code: "CHARM",
    officialCode: "90641001",
    slug: "Charm-School",
    nameTh: "โรงเรียนสร้างเสน่ห์",
    nameEn: "Charm School",
    credits: "2 (1-2-3)",
    group: "Y1-S1",
    portalHref: "/courses/90641001-Charm-School",
    officialUrl: "https://www.it.kmitl.ac.th/th/subjects/90641001-charm-school",
    tracks: {
      overview: "/courses/90641001-Charm-School",
      summary: "/courses/90641001-Charm-School/summary",
      library: "/courses/90641001-Charm-School/library",
    },
  },
  {
    code: "FE",
    officialCode: "90644007",
    slug: "Foundation-English",
    nameTh: "ภาษาอังกฤษพื้นฐาน 1",
    nameEn: "Foundation English",
    credits: "3 (3-0-6)",
    group: "Y1-S1",
    portalHref: "/courses/90644007-Foundation-English",
    officialUrl: "https://www.it.kmitl.ac.th/th/subjects/90644007-foundation-english-1",
    tracks: {
      overview: "/courses/90644007-Foundation-English",
      summary: "/courses/90644007-Foundation-English/summary",
      library: "/courses/90644007-Foundation-English/library",
    },
  },
  {
    code: "SPORT",
    officialCode: "90641003",
    slug: "Sports-and-Recreational-Activities",
    nameTh: "กีฬาและนันทนาการ",
    nameEn: "Sports and Recreational Activities",
    credits: "1 (0-2-1)",
    group: "Y1-S1",
    portalHref: "/courses/90641003-Sports-and-Recreational-Activities",
    officialUrl:
      "https://www.it.kmitl.ac.th/th/subjects/90641003-sports-and-recreational-activities",
    tracks: {
      overview: "/courses/90641003-Sports-and-Recreational-Activities",
      summary: "/courses/90641003-Sports-and-Recreational-Activities/summary",
    },
  },

  // ── ปี 1 เทอม 2 ─────────────────────────────────────────────────────────────
  {
    code: "BFIT",
    officialCode: "06066101",
    slug: "Business-for-IT",
    nameTh: "พื้นฐานทางธุรกิจสำหรับเทคโนโลยีสารสนเทศ",
    nameEn: "Business for IT",
    credits: "3 (3-0-6)",
    group: "Y1-S2",
    portalHref: "/courses/06066101-Business-for-IT",
    officialUrl:
      "https://www.it.kmitl.ac.th/th/subjects/06066101-business-fundamentals-for-information",
    tracks: {
      overview: "/courses/06066101-Business-for-IT",
      summary: "/courses/06066101-Business-for-IT/summary",
      library: "/courses/06066101-Business-for-IT/library",
    },
  },
  {
    code: "DSA",
    officialCode: "06066301",
    slug: "Data-Structures-and-Algorithms",
    nameTh: "โครงสร้างข้อมูลและอัลกอริทึม",
    nameEn: "Data Structures and Algorithms",
    credits: "3 (2-2-5)",
    group: "Y1-S2",
    portalHref: "/courses/06066301-Data-Structures-and-Algorithms",
    officialUrl:
      "https://www.it.kmitl.ac.th/th/subjects/06066301-data-structures-and-algorithms",
    tracks: {
      overview: "/courses/06066301-Data-Structures-and-Algorithms",
      summary: "/courses/06066301-Data-Structures-and-Algorithms/summary",
      library: "/courses/06066301-Data-Structures-and-Algorithms/library",
    },
  },
  {
    code: "OOP",
    officialCode: "06016408",
    slug: "Object-Oriented-Programming",
    nameTh: "การสร้างโปรแกรมเชิงวัตถุ",
    nameEn: "Object-Oriented Programming",
    credits: "3 (2-2-5)",
    group: "Y1-S2",
    portalHref: "/courses/06016408-Object-Oriented-Programming",
    officialUrl:
      "https://www.it.kmitl.ac.th/th/subjects/06016408-object-oriented-programming",
    tracks: {
      overview: "/courses/06016408-Object-Oriented-Programming",
      summary: "/courses/06016408-Object-Oriented-Programming/summary",
      library: "/courses/06016408-Object-Oriented-Programming/library",
    },
  },
  {
    code: "PSTAT",
    officialCode: "06066001",
    slug: "Probability-and-Statistics",
    nameTh: "ความน่าจะเป็นและสถิติ",
    nameEn: "Probability and Statistics",
    credits: "3 (3-0-6)",
    group: "Y1-S2",
    portalHref: "/courses/06066001-Probability-and-Statistics",
    officialUrl:
      "https://www.it.kmitl.ac.th/th/subjects/06066001-probability-and-statistics",
    tracks: {
      overview: "/courses/06066001-Probability-and-Statistics",
      summary: "/courses/06066001-Probability-and-Statistics/summary",
      library: "/courses/06066001-Probability-and-Statistics/library",
    },
  },
  {
    code: "FE2",
    officialCode: "90644008",
    slug: "Foundation-English-II",
    nameTh: "ภาษาอังกฤษพื้นฐาน 2",
    nameEn: "Foundation English II",
    credits: "3 (3-0-6)",
    group: "Y1-S2",
    portalHref: "/courses/90644008-Foundation-English-II",
    officialUrl: "https://www.it.kmitl.ac.th/th/subjects/90644008-foundation-english-2",
    tracks: {
      overview: "/courses/90644008-Foundation-English-II",
      summary: "/courses/90644008-Foundation-English-II/summary",
      library: "/courses/90644008-Foundation-English-II/library",
    },
  },
  {
    code: "DL",
    officialCode: "90641002",
    slug: "Digital-Literacy",
    nameTh: "ความฉลาดทางดิจิทัล",
    nameEn: "Digital Literacy",
    credits: "3 (3-0-6)",
    group: "Y1-S2",
    portalHref: "/courses/90641002-Digital-Literacy",
    officialUrl:
      "https://www.it.kmitl.ac.th/th/subjects/90641002-digital-intelligence-quotient",
    tracks: {
      overview: "/courses/90641002-Digital-Literacy",
      summary: "/courses/90641002-Digital-Literacy/summary",
      library: "/courses/90641002-Digital-Literacy/library",
    },
  },

  // ── EN-KMITL ───────────────────────────────────────────────────────────────
  {
    code: "COMPRO",
    officialCode: "01006012",
    slug: "Computer-Programming",
    nameTh: "การเขียนโปรแกรมคอมพิวเตอร์",
    nameEn: "Computer Programming",
    group: "EN-KMITL",
    portalHref: "/courses/01006012-Computer-Programming",
    tracks: {
      overview: "/courses/01006012-Computer-Programming",
      summary: "/courses/01006012-Computer-Programming/summary",
      quiz: "/courses/01006012-Computer-Programming/quiz",
      library: "/courses/01006012-Computer-Programming/library",
    },
  },
  {
    code: "CHEM",
    slug: "General-Chemistry",
    nameTh: "เคมีทั่วไป",
    nameEn: "General Chemistry",
    group: "EN-KMITL",
    portalHref: "/courses/General-Chemistry",
    tracks: {
      overview: "/courses/General-Chemistry",
      summary: "/courses/General-Chemistry/summary",
      quiz: "/courses/General-Chemistry/quiz",
      library: "/courses/General-Chemistry/library",
    },
  },
];

/** Directory name under content/courses/ — matches iLearn's summaries layout. */
export function courseDir(course: CatalogCourse): string {
  return course.officialCode
    ? `${course.officialCode}-${course.slug}`
    : course.slug;
}

export function coursesByGroup(group: CourseGroup): CatalogCourse[] {
  return COURSES.filter((c) => c.group === group);
}

/** Resolves a course by directory name, code, or slug (case-insensitive). */
export function resolveCourse(param: string): CatalogCourse | undefined {
  const decoded = decodeURIComponent(param).trim();
  const lower = decoded.toLowerCase();
  return COURSES.find(
    (c) =>
      courseDir(c).toLowerCase() === lower ||
      c.code.toLowerCase() === lower ||
      c.slug.toLowerCase() === lower ||
      (c.officialCode && c.officialCode.toLowerCase() === lower),
  );
}

export function findCourse(dir: string): CatalogCourse | undefined {
  return resolveCourse(dir);
}

/** Where a course card points: its portal, its overview, or nowhere yet. */
export function courseHref(course: CatalogCourse): string | null {
  return course.portalHref ?? course.tracks.overview ?? `/courses/${courseDir(course)}`;
}

export function findCourseByCode(code: string): CatalogCourse | undefined {
  return COURSES.find((c) => c.code.toLowerCase() === code.toLowerCase());
}

/**
 * Track hrefs for one course, keyed by short code (e.g. "MFIT").
 */
export function tracksFor(
  code: string,
  extra?: Partial<Record<TrackKind, string>>,
): Partial<Record<TrackKind, string>> {
  return { ...(findCourseByCode(code)?.tracks ?? {}), ...extra };
}

