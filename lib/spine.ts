import type { LText } from "@/lib/i18n";

/**
 * STANDARD_SPINE — the contract for what "one course" means.
 *
 * Before this file, a course was whatever its branch in app/courses/[dir]/page.tsx
 * happened to build: `TrackKind` was a closed union of six while the UI actually
 * shipped ten, and the extra four reached the screen through an `extraHrefs` bag
 * assembled inside the page component. Consistency depended on whoever wrote the
 * branch remembering the shape, which is why nine of fifteen courses ended up
 * with nothing but a summary and a pile of files.
 *
 * The relationship is now inverted. This file declares eleven modules, once. A
 * course supplies only a CourseBinding saying which of them it can actually fill
 * (lib/course-bindings.ts), and every route asks resolveCourseSpine() rather than
 * switching on a course code.
 *
 * Every course declares all eleven. "Declare" is not "have" — a module with no
 * binding still renders, as a locked slot that says what is missing. Keeping the
 * empty slots visible is deliberate: a reader can tell "not built yet" from "does
 * not exist", which is the same honesty the catalogue already practised.
 *
 * This file is pure data: types, the eleven specs, and the phase labels. It is
 * imported by client components, so it must not reach a loader or `fs` — the
 * joining of a course to its bindings lives in lib/course-spine.ts, which is
 * server-only.
 *
 * Ordered A -> D by what the brain actually does: take in, compress, retrieve,
 * then prove and repair. The order carries meaning — a student who jumps from
 * reading notes straight to a timed mock, skipping untimed retrieval, scores
 * badly and concludes they are bad at the subject rather than that they skipped
 * a step.
 */

/** The four phases of the learning path, in order. */
export type Phase = "orient" | "compress" | "retrieve" | "prove";

export const PHASE_LABEL: Record<Phase, LText> = {
  orient: { th: "เข้าใจ", en: "Orient" },
  compress: { th: "ย่อ", en: "Compress" },
  retrieve: { th: "ฝึก", en: "Retrieve" },
  prove: { th: "พิสูจน์", en: "Prove & Repair" },
};

export const PHASE_GOAL: Record<Phase, LText> = {
  orient: { th: "รู้ว่าต้องเรียนอะไร และสอบอะไร", en: "Know what to learn, and what the exam asks" },
  compress: { th: "เหลือเฉพาะสิ่งที่ต้องจำเข้าห้องสอบ", en: "Keep only what walks into the exam room" },
  retrieve: { th: "ดึงความจำออกมาใช้ ไม่ใช่แค่อ่านซ้ำ", en: "Pull it back out, not just read it again" },
  prove: { th: "รู้ว่าพร้อมหรือยัง และต้องซ่อมตรงไหน", en: "Know if you are ready, and what to repair" },
};

/**
 * The eleven modules. This union replaces both `TrackKind` (six, closed) and
 * `TrackIcon` (ten, open) — they described the same thing at two different
 * sizes, which is why the compact chip row could never show a cram sheet.
 */
export type ModuleId =
  // A · เข้าใจ
  | "orientation"
  | "syllabus_map"
  | "deep_summary"
  // B · ย่อ
  | "cram_sheet"
  | "key_cards"
  // C · ฝึก
  | "drill"
  | "speed_quiz"
  | "applied"
  // D · พิสูจน์
  | "mock_exam"
  | "weak_spot"
  | "archive";

/** Which half of the term a module serves. */
export type ModuleScope = "all" | "midterm" | "final";

/**
 * available   — bound and rendering
 * coming_soon — on the spine, nothing bound yet
 * locked      — exists but deliberately withheld
 */
export type ModuleStatus = "available" | "coming_soon" | "locked";

export interface ModuleSpec {
  id: ModuleId;
  phase: Phase;
  /** Fixed render position, 1..11. Two hubs can never disagree on order. */
  order: number;
  /**
   * URL segment under /courses/<dir>/.
   *
   * Deliberately NOT the module id. The existing segments are shared links and
   * are quoted by `alternates.canonical` and the sitemap, so they stay exactly
   * as they were; only genuinely new modules get a new segment. Same reasoning
   * as scope-is-metadata in FILE_STRUCTURE.md §3 — a URL that moves breaks
   * every link anyone has already sent.
   */
  segment: string;
  title: LText;
  subtitle: LText;
  scope: ModuleScope;
  /** What has to be true before this module counts as done. */
  dod: LText[];
}

export const STANDARD_SPINE: readonly ModuleSpec[] = [
  // ── เฟส A · เข้าใจ ─────────────────────────────────────────────────────────
  {
    id: "orientation",
    phase: "orient",
    order: 1,
    segment: "overview",
    title: { th: "เข้าใจวิชานี้ใน 3 นาที", en: "This Course in 3 Minutes" },
    subtitle: {
      th: "ขอบเขตสอบ สัดส่วนคะแนน รูปแบบข้อสอบ เกณฑ์ที่ทำให้ได้ 0 และเสาหลักของวิชา",
      en: "Exam scope, grade weighting, paper format, zero-score rules, and the pillars of the subject",
    },
    scope: "all",
    dod: [
      { th: "มีเสาหลัก (pillars) อย่างน้อย 3 ข้อ", en: "At least 3 pillars" },
      { th: "มี grading model", en: "A grading model" },
      {
        th: "มีเส้นแบ่งกลางภาค/ปลายภาค ที่อ้างจาก summary.md ของวิชานั้นเอง",
        en: "A midterm/final boundary taken from the course's own summary.md",
      },
    ],
  },
  {
    id: "syllabus_map",
    phase: "orient",
    order: 2,
    segment: "map",
    title: { th: "แผนที่เนื้อหา", en: "Syllabus Map" },
    subtitle: {
      th: "กริดสัปดาห์/บท ที่แต่ละช่องบอกได้ว่ามีสรุปไหม มีโจทย์กี่ข้อ มีสไลด์กี่ไฟล์",
      en: "A week/chapter grid: which have notes, how many questions, how many slides",
    },
    scope: "all",
    dod: [
      {
        th: "ทุกบทมี chapter ที่ quiz, asset และหัวข้อในสรุป อ้างถึงตรงกัน",
        en: "Every chapter has an id that quiz, asset, and note headings all agree on",
      },
    ],
  },
  {
    id: "deep_summary",
    phase: "orient",
    order: 3,
    segment: "summary",
    title: { th: "สรุปเนื้อหา", en: "Study Notes" },
    subtitle: {
      th: "สรุปเนื้อหาและชีทติวแบบอ่านต่อเนื่อง พร้อมสารบัญด้านข้าง",
      en: "Study notes and cram sheets with a live outline panel",
    },
    scope: "all",
    dod: [
      { th: "แต่ละบทอ่านจบใน ≤12 นาที", en: "Each chapter reads in ≤12 minutes" },
      {
        th: "ปุ่มถัดไปพาไปข้างหน้า ไม่ใช่ย้อนกลับหน้า hub",
        en: "The next button goes forward, not back to the hub",
      },
    ],
  },

  // ── เฟส B · ย่อ ────────────────────────────────────────────────────────────
  {
    id: "cram_sheet",
    phase: "compress",
    order: 4,
    segment: "cram",
    title: { th: "สรุปเร่งด่วน 10 นาที", en: "10-Minute Cram Sheet" },
    subtitle: {
      th: "กับดักที่พลาดบ่อย · สูตรที่ต้องจำทั้งหมดในหน้าเดียว · นิยามที่มักถามตรงๆ",
      en: "The traps, every formula on one page, and the definitions asked verbatim",
    },
    scope: "midterm",
    dod: [
      { th: "อ่านจบใน ≤10 นาทีจริง (คิดจากจำนวนคำ)", en: "≤10 minutes for real, measured by word count" },
      { th: "ทุกบรรทัดมี sourceRef", en: "Every line carries a sourceRef" },
      {
        th: "ไม่มีเนื้อหาใหม่ที่ไม่ปรากฏในสรุปเนื้อหา",
        en: "Nothing that does not already appear in the study notes",
      },
    ],
  },
  {
    id: "key_cards",
    phase: "compress",
    order: 5,
    segment: "cards",
    title: { th: "บัตรคำ / บัตรสูตร", en: "Key Cards" },
    subtitle: {
      th: "พลิกบัตร ให้คะแนนตัวเอง แล้วเข้าคิวทวนซ้ำตามช่วงเวลา",
      en: "Flip, rate yourself, and feed a spaced-repetition queue",
    },
    scope: "all",
    dod: [
      { th: "≥30 บัตรต่อวิชา", en: "≥30 cards per course" },
      { th: "ทุกบัตรลิงก์กลับย่อหน้าต้นทาง", en: "Every card links back to its source paragraph" },
    ],
  },

  // ── เฟส C · ฝึก ────────────────────────────────────────────────────────────
  {
    id: "drill",
    phase: "retrieve",
    order: 6,
    segment: "quiz",
    title: { th: "คลังโจทย์รายบท", en: "Chapter Drill" },
    subtitle: {
      th: "แบบทดสอบตัวเองแบบเลือกบทได้ ไม่จับเวลา พร้อมคำอธิบายว่าทำไมตัวเลือกอื่นถึงผิด",
      en: "Pick a chapter, no clock, each item explaining why the other options fail",
    },
    scope: "all",
    dod: [
      { th: "เลือกบทได้", en: "Chapter-scoped runs" },
      { th: "ตอบผิดได้ feedback ทันที", en: "Instant feedback on a wrong answer" },
      { th: "ทุกข้อมี chapter", en: "Every question carries a chapter" },
    ],
  },
  {
    id: "speed_quiz",
    phase: "retrieve",
    order: 7,
    segment: "speed",
    title: { th: "แบบทดสอบเร่งด่วน 10 นาที", en: "10-Minute Speed Quiz" },
    subtitle: {
      th: "12 ข้อ 10 นาที คละบทตามน้ำหนักการสอบ จบแล้วบอกทันทีว่าบทไหนอ่อน",
      en: "12 questions in 10 minutes, weighted like the paper, weak chapters named at the end",
    },
    scope: "midterm",
    dod: [
      { th: "ประกอบอัตโนมัติจากน้ำหนัก blueprint", en: "Assembled from blueprint weights, not hand-written" },
      { th: "จับเวลา และให้ผลรายบท", en: "Timed, and reports per chapter" },
    ],
  },
  {
    id: "applied",
    phase: "retrieve",
    order: 8,
    segment: "labs",
    title: { th: "ห้องปฏิบัติ", en: "Applied Practice" },
    subtitle: {
      th: "คลังโจทย์ ห้องแลป หรือโจทย์สถานการณ์ — แล้วแต่ว่าวิชานั้นฝึกด้วยอะไร",
      en: "A problem bank, a lab, or branching scenarios — whatever the subject practises with",
    },
    scope: "all",
    dod: [
      {
        th: "มีอย่างน้อย 1 ใน 3: คลังโจทย์ OJ · lab · scenario ≥5 ชุด",
        en: "At least one of: an OJ problem set, a lab, or ≥5 scenarios",
      },
    ],
  },

  // ── เฟส D · พิสูจน์ ────────────────────────────────────────────────────────
  {
    id: "mock_exam",
    phase: "prove",
    order: 9,
    segment: "mock",
    title: { th: "ข้อสอบเสมือนจริง", en: "Mock Exam" },
    subtitle: {
      th: "จับเวลา ตอบครบก่อนถึงเฉลย คะแนนและประวัติแยกจากการฝึกรายบท",
      en: "Timed, answers locked before the key, scored and recorded apart from the drill",
    },
    scope: "midterm",
    dod: [
      { th: "เป็นโหมด ไม่ใช่เอกสาร", en: "A mode, not a document" },
      {
        th: "จำนวนข้อและน้ำหนักตรงกับ blueprint ใน summary.md ส่วนที่ 4",
        en: "Item count and weights match the blueprint in summary.md §4",
      },
    ],
  },
  {
    id: "weak_spot",
    phase: "prove",
    order: 10,
    segment: "weak-spots",
    title: { th: "ห้องซ่อมจุดอ่อน", en: "Weak-Spot Room" },
    subtitle: {
      th: "ข้อที่เคยตอบผิด รวมไว้ที่เดียว ทำใหม่เฉพาะข้อนั้นได้",
      en: "Everything you missed, in one place, retryable on its own",
    },
    scope: "all",
    dod: [
      { th: "บอกว่าอ่อนบทไหน", en: "Names the weak chapter, not just the count" },
      { th: "ทำซ้ำเฉพาะข้อที่ผิดได้", en: "Retry only the missed questions" },
      { th: "เข้าถึงได้จากหน้าแรก ไม่ใช่แค่ในวิชา", en: "Reachable from the home page, not only inside a course" },
    ],
  },
  {
    id: "archive",
    phase: "prove",
    order: 11,
    segment: "library",
    title: { th: "คลังทรัพยากร", en: "Archive & Past Papers" },
    subtitle: {
      th: "สไลด์บรรยาย ไฟล์ PDF ข้อสอบเก่า และภาพสมุดจด",
      en: "Lecture slides, PDFs, past papers, and note scans",
    },
    scope: "all",
    dod: [
      {
        th: "ทุกการ์ดมี chapter หรือถูกทำเครื่องหมายว่าข้ามทั้งเทอมอย่างตั้งใจ",
        en: "Every card carries a chapter, or is deliberately marked term-wide",
      },
    ],
  },
] as const;

/** Every module id in spine order. */
export const MODULE_IDS: readonly ModuleId[] = STANDARD_SPINE.map((m) => m.id);

const SPEC_BY_ID = new Map<ModuleId, ModuleSpec>(STANDARD_SPINE.map((m) => [m.id, m]));
const SPEC_BY_SEGMENT = new Map<string, ModuleSpec>(STANDARD_SPINE.map((m) => [m.segment, m]));

export function moduleSpec(id: ModuleId): ModuleSpec {
  const spec = SPEC_BY_ID.get(id);
  if (!spec) throw new Error(`unknown module id: ${id}`);
  return spec;
}

/** Resolves a URL segment back to its module. Unknown segments return undefined. */
export function moduleBySegment(segment: string): ModuleSpec | undefined {
  return SPEC_BY_SEGMENT.get(segment);
}

/**
 * A chapter or week of a course.
 *
 * Moved out of components/subject-hub.tsx: this is data every layer needs —
 * the quiz gate groups by it, the asset gallery filters on it, and the syllabus
 * map is built from it — not a prop shape belonging to one component.
 */
export interface SubjectChapter {
  chapter: number;
  title: LText;
  /** Which exam this chapter is studied for. Absent means the course has not said. */
  scope?: Exclude<ModuleScope, "all">;
}

/** Live numbers a badge quotes, measured rather than typed in. */
export interface SpineMetrics {
  /** Question-bank size per module id, e.g. `{ drill: 65 }`. */
  questions?: Readonly<Partial<Record<ModuleId, number>>>;
  /** Resource-library breakdown, counted from the asset registry. */
  library?: { pdfs: number; images: number; docs: number };
}

/**
 * One module as the UI renders it: the spec, joined to what the course bound.
 *
 * Plain data, deliberately. This crosses into client components, and a binding
 * holds loader *functions* — passing one through would fail serialization at
 * build time. Server code that needs the docs or the bank asks
 * moduleBinding() in lib/course-spine.ts instead.
 */
export interface ResolvedModule {
  id: ModuleId;
  phase: Phase;
  order: number;
  title: LText;
  subtitle: LText;
  scope: ModuleScope;
  status: ModuleStatus;
  /** Absent when the module is not available. */
  href?: string;
  /** Short pill: a question count, or the coming-soon marker. */
  badge?: LText;
  /** Secondary line: a resource breakdown such as "7 PDF · 26 ภาพ". */
  stats?: LText;
  /** Caveat the course attached to this module, e.g. that a bank is derived. */
  note?: LText;
}
