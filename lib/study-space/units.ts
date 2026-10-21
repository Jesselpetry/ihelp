import { href, res } from "./links";
import type { StudyResource, StudyUnit, SubjectCode } from "./types";

/**
 * The final-exam scope of each course, one unit per week, with the pages that
 * teach it. Scope follows each course's summary.md §2 (AGENTS.md rule 7):
 *
 *   ITF  — weeks 8–15                         (§2.2)
 *   ICS  — the second half, sessions 1–7       (§2.2: "ออกเฉพาะเนื้อหาครึ่งหลัง")
 *   PSCP — weeks 8–14                          (§2.2)
 *   MFIT — library weeks 8–15 = syllabus weeks 9–16 (§2.2 note)
 *
 * Topics are the week pages' own titles. A unit's id is also its checklist
 * key in storage — never rename one.
 */

const unitId = (code: SubjectCode, week: number) => `${code}-week-${week}`;

const weekLabel = (week: number) => ({ th: `สัปดาห์ที่ ${week}`, en: `Week ${week}` });

function itf(week: number, topic: { th: string; en: string }): StudyUnit {
  return {
    id: unitId("ITF", week),
    subject: "ITF",
    week,
    label: weekLabel(week),
    topic,
    resources: [
      {
        kind: "week",
        label: { th: `หน้าสัปดาห์ที่ ${week} — สรุป · จุดพลาด · ทดสอบตัวเอง`, en: `Week ${week} page — notes, traps, self-check` },
        href: href.weekPage("ITF", week),
      },
      res.library("ITF"),
    ],
  };
}

function ics(session: number, topic: { th: string; en: string }): StudyUnit {
  return {
    id: unitId("ICS", session),
    subject: "ICS",
    week: session,
    label: { th: `คาบที่ ${session}`, en: `Session ${session}` },
    topic,
    resources: [
      {
        kind: "week",
        label: { th: `หน้าคาบที่ ${session} — วิดีโอ · สไลด์ · ใบงาน`, en: `Session ${session} page — videos, slides, lab sheet` },
        href: href.weekPage("ICS", session),
      },
      res.library("ICS"),
    ],
  };
}

function mfit(week: number, topic: { th: string; en: string }): StudyUnit {
  return {
    id: unitId("MFIT", week),
    subject: "MFIT",
    week,
    label: weekLabel(week),
    topic,
    resources: [
      {
        kind: "summary",
        label: { th: `สรุปสัปดาห์ที่ ${week}`, en: `Week ${week} summary` },
        href: href.mfitSummary(week),
      },
      {
        kind: "quiz",
        label: { th: `แบบฝึกสัปดาห์ที่ ${week}`, en: `Week ${week} quiz` },
        href: href.mfitQuiz(week),
      },
    ],
  };
}

function pscp(
  week: number,
  topic: { th: string; en: string },
  problemCount: number,
  featured: StudyResource[] = [],
): StudyUnit {
  return {
    id: unitId("PSCP", week),
    subject: "PSCP",
    week,
    label: weekLabel(week),
    topic,
    resources: [
      {
        kind: "problems",
        label: { th: `โจทย์ iJudge สัปดาห์ที่ ${week} (${problemCount} ข้อ)`, en: `Week ${week} iJudge problems (${problemCount})` },
        href: href.pscpWeek(week),
      },
      ...featured,
    ],
  };
}

export const UNITS: StudyUnit[] = [
  // ── ITF ─────────────────────────────────────────────────────────────────
  itf(8, { th: "Database — ลำดับชั้นข้อมูล, DBMS และ SQL", en: "Database" }),
  itf(9, { th: "Ethical, Social & Legal Aspects of IT — ความปลอดภัย ความเป็นส่วนตัว กฎหมาย", en: "Ethical, Social & Legal Aspects of IT" }),
  itf(10, { th: "Working in the Enterprise — ระบบสารสนเทศองค์กร สายงานไอที", en: "Working in the Enterprise" }),
  itf(11, { th: "Internet & Computer Networks 1 — protocol, access network, ISP", en: "Internet & Computer Networks 1" }),
  itf(12, { th: "Computer Networks 2 — Ethernet, IP addressing, static route", en: "Computer Networks 2" }),
  itf(13, { th: "Wireless Networks — 802.11, CDMA, CSMA/CA", en: "Wireless Networks" }),
  itf(14, { th: "Web Technology — HTML, CSS, JavaScript, client-server", en: "Web Technology" }),
  itf(15, { th: "IT Skills and System — SDLC, requirement, Gantt/PERT", en: "IT Skills and System" }),

  // ── ICS (second half — computer hardware) ───────────────────────────────
  ics(1, { th: "ภาพรวมระบบคอมพิวเตอร์ · แล็บมัลติมิเตอร์", en: "Computer systems overview · Multimeter lab" }),
  ics(2, { th: "Memory & I/O addressing · แล็บออสซิลโลสโคป", en: "Memory & I/O addressing · Oscilloscope lab" }),
  ics(3, { th: "Latch, Buffer, Tristate, SR flip-flop · แล็บ LED และ RC", en: "Latch, buffer, tristate, SR flip-flop · LED & RC lab" }),
  ics(4, { th: "Flip-flop, Counter, FIFO · แล็บออสซิลเลเตอร์ 74LS04", en: "Flip-flops, counters, FIFO · 74LS04 oscillator lab" }),
  ics(5, { th: "DAC (R-2R, op-amp) และ ADC (Flash, SAR) · แล็บ MUX จาก NAND", en: "DAC & ADC · MUX-from-NAND lab" }),
  ics(6, { th: "Memory unit — SRAM, DRAM, ROM · แล็บ FPGA Basys2", en: "Memory unit · FPGA Basys2 lab" }),
  ics(7, { th: "ALU · Instruction set · ซีพียู 4 บิต", en: "ALU · Instruction set · 4-bit CPU" }),

  // ── PSCP ────────────────────────────────────────────────────────────────
  pscp(8, { th: "Nested Loops & Pattern Printing", en: "Nested Loops & Pattern Printing" }, 12, [
    res.pscpProblem("oj3293-bigframe", "oj3293 BigFrame ⭐"),
    res.pscpProblem("oj3296-rgb-mixed", "oj3296 RGB Mixed ⭐"),
  ]),
  pscp(9, { th: "Lists, Sequence Processing & Simulation", en: "Lists, Sequence Processing & Simulation" }, 15, [
    res.pscpProblem("oj3355-shorten", "oj3355 Shorten ⭐"),
    res.pscpProblem("oj3357-giraffe", "oj3357 Giraffe ⭐"),
  ]),
  pscp(10, { th: "Nested Lists & Matrices (1)", en: "Nested Lists & Matrices (1)" }, 16),
  pscp(11, { th: "Nested Lists & Matrices (2)", en: "Nested Lists & Matrices (2)" }, 16),
  pscp(12, { th: "Dictionary & Sets", en: "Dictionary & Sets" }, 16),
  pscp(13, { th: "File I/O & Exceptions", en: "File I/O & Exceptions" }, 13),
  pscp(14, { th: "Sorting & Searching", en: "Sorting & Searching" }, 39),

  // ── MFIT (library numbering) ────────────────────────────────────────────
  mfit(8, { th: "ฟังก์ชัน ลิมิต และความต่อเนื่อง", en: "Functions, limits & continuity" }),
  mfit(9, { th: "อนุพันธ์ ภาค 1 — นิยาม กฎผลคูณ/ผลหาร", en: "Derivatives 1 — definition, product & quotient rules" }),
  mfit(10, { th: "อนุพันธ์ ภาค 2 — chain rule, implicit, related rates", en: "Derivatives 2 — chain rule, implicit, related rates" }),
  mfit(11, { th: "การประยุกต์อนุพันธ์ — ค่าสุดขีด กราฟ optimization", en: "Applications of the derivative" }),
  mfit(12, { th: "ปริพันธ์ ภาค 1 — antiderivative และทฤษฎีบทหลักมูล", en: "Integration 1 — antiderivatives & FTC" }),
  mfit(13, { th: "ปริพันธ์ ภาค 2 — u-substitution", en: "Integration 2 — u-substitution" }),
  mfit(14, { th: "ปริพันธ์ทีละส่วน · พื้นที่ · ปริมาตรจากการหมุน", en: "Integration by parts · area · volume" }),
  mfit(15, { th: "โมเมนต์และ centroid · อนุพันธ์ย่อย", en: "Moments & centroids · partial derivatives" }),
];

const UNIT_BY_ID = new Map(UNITS.map((u) => [u.id, u]));

export function unitById(id: string): StudyUnit | undefined {
  return UNIT_BY_ID.get(id);
}

export function unitsFor(code: SubjectCode): StudyUnit[] {
  return UNITS.filter((u) => u.subject === code);
}
