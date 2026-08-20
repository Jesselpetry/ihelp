import type { LText } from "@/lib/i18n";
import type { QuizQuestion } from "@/lib/quiz";

// IT-KMITL — ICS / Digital Logic midterm self-test.
// Source: data/it-kmitl/ics/{summarize,midterm-exam,analysis}.md
// (derived from the 1/2564 midterm paper, ics-midterm-1-2564.pdf)
export const ICS_QUIZ_ID = 900003;

export interface IcsChapter {
  chapter: number;
  title: LText;
}

export const ICS_CHAPTERS: IcsChapter[] = [
  { chapter: 1, title: { th: "ระบบเลขฐาน", en: "Number Systems" } },
  { chapter: 2, title: { th: "พีชคณิตบูลีน & Logic Gates", en: "Boolean Algebra & Logic Gates" } },
  { chapter: 3, title: { th: "Karnaugh Map", en: "Karnaugh Map" } },
  { chapter: 4, title: { th: "Timing & Propagation Delay", en: "Timing & Propagation Delay" } },
  { chapter: 5, title: { th: "ออกแบบวงจร Combinational", en: "Combinational Circuit Design" } },
  { chapter: 6, title: { th: "Multiplexer (MUX)", en: "Multiplexer (MUX)" } },
];

export const ICS_QUIZ: QuizQuestion[] = [
  // ══ Chapter 1 — Number Systems ═════════════════════════════════════════════
  {
    id: "ics-q1",
    kind: "mcq",
    chapter: 1,
    prompt: {
      th: "`101101₂` มีค่าเท่ากับเลขฐานสิบใด",
      en: "What is `101101₂` in decimal?",
    },
    options: [
      { id: "a", label: { th: "46", en: "46" }, why: { th: "ผิด — 46 = 101110₂", en: "Wrong — 46 = 101110₂." } },
      { id: "b", label: { th: "91", en: "91" }, why: { th: "ผิด — 91 คือค่าที่ได้เมื่ออ่านบิตกลับด้าน (LSB↔MSB)", en: "Wrong — 91 comes from reading the bits in reverse (LSB↔MSB)." } },
      { id: "c", label: { th: "45", en: "45" }, why: { th: "ถูกต้อง — 2⁵+2³+2²+2⁰ = 32+8+4+1 = 45", en: "Correct — 2⁵+2³+2²+2⁰ = 32+8+4+1 = 45." } },
      { id: "d", label: { th: "43", en: "43" }, why: { th: "ผิด — 43 = 101011₂ (สลับบิตท้าย)", en: "Wrong — 43 = 101011₂; the trailing bits were swapped." } },
    ],
    correctId: "c",
    sourceRef: "midterm-exam.md ข้อ 1(a)",
  },
  {
    id: "ics-q2",
    kind: "mcq",
    chapter: 1,
    prompt: {
      th: "`187₁₀` เขียนเป็นเลขฐานสองได้เท่าใด",
      en: "Convert `187₁₀` to binary.",
    },
    options: [
      { id: "a", label: { th: "11011101₂", en: "11011101₂" }, why: { th: "ผิด — เป็นผลจากการอ่านเศษจากบนลงล่าง (กลับด้าน)", en: "Wrong — this is the remainder string read top-down (reversed)." } },
      { id: "b", label: { th: "10110111₂", en: "10110111₂" }, why: { th: "ผิด — ค่านี้ = 183", en: "Wrong — this equals 183." } },
      { id: "c", label: { th: "11101011₂", en: "11101011₂" }, why: { th: "ผิด — ค่านี้ = 235", en: "Wrong — this equals 235." } },
      { id: "d", label: { th: "10111011₂", en: "10111011₂" }, why: { th: "ถูกต้อง — 128+32+16+8+2+1 = 187 (หารสั้นด้วย 2 แล้วอ่านเศษจากล่างขึ้นบน)", en: "Correct — 128+32+16+8+2+1 = 187. Divide by 2 repeatedly and read remainders bottom-up." } },
    ],
    correctId: "d",
    sourceRef: "midterm-exam.md ข้อ 1(c)",
  },
  {
    id: "ics-q3",
    kind: "mcq",
    chapter: 1,
    prompt: {
      th: "`4D9₁₆` มีค่าเท่ากับเลขฐานสิบใด",
      en: "What is `4D9₁₆` in decimal?",
    },
    options: [
      { id: "a", label: { th: "1257", en: "1257" }, why: { th: "ผิด — ใช้ D = 14 (D = 13 ไม่ใช่ 14)", en: "Wrong — used D = 14; D is 13." } },
      { id: "b", label: { th: "1225", en: "1225" }, why: { th: "ผิด — ใช้ D = 12 (นั่นคือ C)", en: "Wrong — used D = 12, which is C." } },
      { id: "c", label: { th: "1049", en: "1049" }, why: { th: "ผิด — ลืมคูณหลัก 16¹ ของ D", en: "Wrong — forgot to weight the D digit by 16¹." } },
      { id: "d", label: { th: "1241", en: "1241" }, why: { th: "ถูกต้อง — 4(256) + 13(16) + 9 = 1024 + 208 + 9 = 1241", en: "Correct — 4(256) + 13(16) + 9 = 1024 + 208 + 9 = 1241." } },
    ],
    correctId: "d",
    sourceRef: "midterm-exam.md ข้อ 1(d)",
  },
  {
    id: "ics-q4",
    kind: "mcq",
    chapter: 1,
    prompt: {
      th: "`0 1011 0110 0100 1111₂` (17 บิต) เขียนเป็นเลขฐานสิบหกได้เท่าใด",
      en: "Convert `0 1011 0110 0100 1111₂` (17 bits) to hexadecimal.",
    },
    options: [
      { id: "a", label: { th: "B65F₁₆", en: "B65F₁₆" }, why: { th: "ผิด — อ่านกลุ่ม 0100 เป็น 5 (0100 = 4)", en: "Wrong — read 0100 as 5; 0100 is 4." } },
      { id: "b", label: { th: "A64F₁₆", en: "A64F₁₆" }, why: { th: "ผิด — อ่าน 1011 เป็น A (1011 = B, 1010 = A)", en: "Wrong — read 1011 as A; 1011 is B and 1010 is A." } },
      { id: "c", label: { th: "B64F₁₆", en: "B64F₁₆" }, why: { th: "ถูกต้อง — เติม 0 ข้างหน้าให้ครบ 20 บิต: 0000 1011 0110 0100 1111 → 0 B 6 4 F → B64F", en: "Correct — left-pad to 20 bits: 0000 1011 0110 0100 1111 → 0 B 6 4 F → B64F." } },
      { id: "d", label: { th: "16C9E₁₆", en: "16C9E₁₆" }, why: { th: "ผิด — จัดกลุ่ม 4 บิตจากซ้ายไปขวา ต้องจัดจากขวาไปซ้ายเสมอ", en: "Wrong — grouped 4 bits left-to-right; grouping must start from the right." } },
    ],
    correctId: "c",
    sourceRef: "midterm-exam.md ข้อ 1(b)",
  },
  {
    id: "ics-q5",
    kind: "mcq",
    chapter: 1,
    prompt: {
      th: "ในเลขฐานสิบหก ตัวอักษร `A` มีค่าเท่ากับเท่าใด",
      en: "In hexadecimal, what is the value of the digit `A`?",
    },
    options: [
      { id: "a", label: { th: "10", en: "10" }, why: { th: "ถูกต้อง — A=10, B=11, C=12, D=13, E=14, F=15 (นับเริ่มจาก 10) ตรวจง่ายๆ: F ต้องเป็น 15 เสมอ", en: "Correct — A=10, B=11, C=12, D=13, E=14, F=15. Quick check: F must always be 15." } },
      { id: "b", label: { th: "11", en: "11" }, why: { th: "ผิด — กับดักคลาสสิก ถ้า A=11 แล้ว F จะกลายเป็น 16 ซึ่งเป็นไปไม่ได้ในหลักเดียว", en: "Wrong — the classic trap. If A were 11, F would be 16, impossible for one hex digit." } },
      { id: "c", label: { th: "9", en: "9" }, why: { th: "ผิด — 9 ยังเป็นตัวเลข ไม่ใช่ตัวอักษร", en: "Wrong — 9 is still a numeral, not a letter digit." } },
      { id: "d", label: { th: "15", en: "15" }, why: { th: "ผิด — 15 คือ F", en: "Wrong — 15 is F." } },
    ],
    correctId: "a",
    sourceRef: "summarize.md §กับดัก 1",
  },
  {
    id: "ics-q6",
    kind: "mcq",
    chapter: 1,
    prompt: {
      th: "การแปลง Binary → Hex ต้องจัดกลุ่มบิตอย่างไร",
      en: "When converting binary → hex, how must the bits be grouped?",
    },
    options: [
      { id: "a", label: { th: "กลุ่มละ 3 บิต จากขวาไปซ้าย", en: "3 bits at a time, right-to-left" }, why: { th: "ผิด — กลุ่มละ 3 บิตใช้กับฐาน 8 (Octal)", en: "Wrong — 3-bit groups are for octal (base 8)." } },
      { id: "b", label: { th: "กลุ่มละ 4 บิต จากขวาไปซ้าย เติม 0 ต่อท้าย", en: "4 bits right-to-left, padding zeros on the right" }, why: { th: "ผิด — เติม 0 ต่อท้ายเท่ากับคูณค่าเดิม ต้องเติมข้างหน้า (ซ้าย)", en: "Wrong — padding on the right multiplies the value; padding must go on the left." } },
      { id: "c", label: { th: "กลุ่มละ 4 บิต จากขวาไปซ้าย เติม 0 ข้างหน้าถ้าไม่ครบ", en: "4 bits at a time, right-to-left, left-padding with 0 if needed" }, why: { th: "ถูกต้อง — หลักที่มีน้ำหนักน้อยสุดอยู่ขวา จึงต้องเริ่มจับกลุ่มจากขวา", en: "Correct — the least-significant bit is on the right, so grouping must start there." } },
      { id: "d", label: { th: "กลุ่มละ 4 บิต จากซ้ายไปขวา", en: "4 bits at a time, left-to-right" }, why: { th: "ผิด — ถ้าจำนวนบิตหาร 4 ไม่ลงตัว กลุ่มสุดท้ายจะผิดน้ำหนักทั้งหมด", en: "Wrong — when the bit count is not a multiple of 4, every weight ends up shifted." } },
    ],
    correctId: "c",
    sourceRef: "summarize.md §1.2, §กับดัก 2",
  },
  {
    id: "ics-q7",
    kind: "mcq",
    chapter: 1,
    prompt: {
      th: "การแปลง Decimal → Binary ด้วยการหารสั้นด้วย 2 ต้องอ่านเศษอย่างไร",
      en: "When converting decimal → binary by repeated division by 2, how are the remainders read?",
    },
    options: [
      { id: "a", label: { th: "อ่านจากล่างขึ้นบน (เศษตัวสุดท้าย = MSB)", en: "Bottom-up — the last remainder is the MSB" }, why: { th: "ถูกต้อง — เศษที่ได้ครั้งแรกคือบิตที่มีน้ำหนักน้อยสุด (LSB)", en: "Correct — the first remainder produced is the least-significant bit." } },
      { id: "b", label: { th: "อ่านจากบนลงล่าง", en: "Top-down" }, why: { th: "ผิด — จะได้เลขกลับด้านทั้งหมด เป็นกับดักที่ 3 ในสรุป", en: "Wrong — that reverses the whole number; it is pitfall #3 in the summary." } },
      { id: "c", label: { th: "อ่านเฉพาะเศษที่เป็น 1", en: "Read only the remainders equal to 1" }, why: { th: "ผิด — บิต 0 ก็มีความหมายตามตำแหน่ง ห้ามข้าม", en: "Wrong — zero bits carry positional meaning and cannot be skipped." } },
      { id: "d", label: { th: "อ่านผลหารสุดท้ายแทนเศษ", en: "Read the final quotients instead of the remainders" }, why: { th: "ผิด — ผลหารสุดท้ายเป็น 0 เสมอ ไม่ใช่คำตอบ", en: "Wrong — the final quotient is always 0 and carries no information." } },
    ],
    correctId: "a",
    sourceRef: "summarize.md §1.2, §กับดัก 3",
  },
  {
    id: "ics-q8",
    kind: "mcq",
    chapter: 1,
    prompt: {
      th: "ทางลัดแปลง `3A5₁₆` เป็นเลขฐานสอง (แปลงทีละหลักเป็น 4 บิต) ได้ผลลัพธ์ใด",
      en: "Using the digit-by-digit shortcut, `3A5₁₆` in binary is:",
    },
    options: [
      { id: "a", label: { th: "0011 1011 0101₂", en: "0011 1011 0101₂" }, why: { th: "ผิด — 1011 คือ B ไม่ใช่ A", en: "Wrong — 1011 is B, not A." } },
      { id: "b", label: { th: "0011 1010 0110₂", en: "0011 1010 0110₂" }, why: { th: "ผิด — 0110 คือ 6 ไม่ใช่ 5", en: "Wrong — 0110 is 6, not 5." } },
      { id: "c", label: { th: "1110 1000 0101₂", en: "1110 1000 0101₂" }, why: { th: "ผิด — แปลงหลักแรกผิด (3 = 0011)", en: "Wrong — the first digit is mis-converted; 3 = 0011." } },
      { id: "d", label: { th: "0011 1010 0101₂", en: "0011 1010 0101₂" }, why: { th: "ถูกต้อง — 3→0011, A→1010, 5→0101 ต่อกันได้เลย ไม่ต้องผ่านฐาน 10", en: "Correct — 3→0011, A→1010, 5→0101, concatenated. No detour through decimal." } },
    ],
    correctId: "d",
    sourceRef: "summarize.md §1.2",
  },

  // ══ Chapter 2 — Boolean Algebra & Logic Gates ══════════════════════════════
  {
    id: "ics-q9",
    kind: "mcq",
    chapter: 2,
    prompt: {
      th: "จงลดรูป `F(A,B,C) = A'B'C' + A'B'C + A'BC' + A'BC + AB'C' + AB'C` ให้สั้นที่สุด",
      en: "Minimize `F(A,B,C) = A'B'C' + A'B'C + A'BC' + A'BC + AB'C' + AB'C`.",
    },
    snippet: "F = A'B'(C'+C) + A'B(C'+C) + AB'(C'+C)\n  = A'B' + A'B + AB'",
    options: [
      { id: "a", label: { th: "F = A' + B'", en: "F = A' + B'" }, why: { th: "ถูกต้อง — A'B' + A'B = A'(B'+B) = A' แล้ว A' + AB' = A' + B' ด้วย Redundancy (X + X'Y = X + Y)", en: "Correct — A'B' + A'B = A', then A' + AB' = A' + B' by redundancy (X + X'Y = X + Y)." } },
      { id: "b", label: { th: "F = A' + AB'", en: "F = A' + AB'" }, why: { th: "ผิด — ลดรูปยังไม่จบ ยังเหลือรูปแบบ X + X'Y ให้ยุบต่อได้", en: "Wrong — not fully minimized; the X + X'Y pattern is still reducible." } },
      { id: "c", label: { th: "F = A'B'", en: "F = A'B'" }, why: { th: "ผิด — แคบเกินไป เช่น A=1,B=0,C=0 (AB'C') ควรได้ F=1 แต่สูตรนี้ให้ 0", en: "Wrong — too narrow: A=1,B=0,C=0 should give F=1 but this yields 0." } },
      { id: "d", label: { th: "F = A'B' + C", en: "F = A'B' + C" }, why: { th: "ผิด — C ถูกยุบไปแล้วตั้งแต่ขั้น Adjacency (C' + C = 1)", en: "Wrong — C already cancels at the adjacency step (C' + C = 1)." } },
    ],
    correctId: "a",
    sourceRef: "midterm-exam.md ข้อ 2(a)",
  },
  {
    id: "ics-q10",
    kind: "mcq",
    chapter: 2,
    prompt: {
      th: "กฎ Redundancy: `X + X'Y` ลดรูปได้เป็นอะไร",
      en: "The redundancy law: `X + X'Y` simplifies to what?",
    },
    options: [
      { id: "a", label: { th: "XY", en: "XY" }, why: { th: "ผิด — XY คือผลของรูปคู่ขนาน X(X'+Y) ไม่ใช่รูป OR", en: "Wrong — XY is the result of the dual form X(X'+Y), not the OR form." } },
      { id: "b", label: { th: "X'Y", en: "X'Y" }, why: { th: "ผิด — ทิ้งเทอม X ไปโดยไม่มีเหตุผล", en: "Wrong — it discards the X term for no reason." } },
      { id: "c", label: { th: "X + Y", en: "X + Y" }, why: { th: "ถูกต้อง — ถ้า X=1 ก็จริงอยู่แล้ว ถ้า X=0 เหลือ Y → X + Y (คู่ขนาน: X(X'+Y) = XY)", en: "Correct — if X=1 it is already true; if X=0 only Y matters → X + Y. Dual: X(X'+Y) = XY." } },
      { id: "d", label: { th: "X", en: "X" }, why: { th: "ผิด — นั่นคือ Absorption (X + XY = X) ซึ่งไม่มี complement", en: "Wrong — that is absorption (X + XY = X), which has no complement." } },
    ],
    correctId: "c",
    sourceRef: "summarize.md §2.1",
  },
  {
    id: "ics-q11",
    kind: "mcq",
    chapter: 2,
    prompt: {
      th: "ข้อใดคือกฎ Absorption ที่ถูกต้อง",
      en: "Which of these is the absorption law?",
    },
    options: [
      { id: "a", label: { th: "XY + XY' = X", en: "XY + XY' = X" }, why: { th: "ผิด — นั่นคือ Adjacency (จับคู่เทอมที่ต่างกันแค่ตัวแปรเดียว)", en: "Wrong — that is adjacency, combining two terms differing in one variable." } },
      { id: "b", label: { th: "X + 1 = 1", en: "X + 1 = 1" }, why: { th: "ผิด — นั่นคือ Null / Domination", en: "Wrong — that is the null (domination) law." } },
      { id: "c", label: { th: "X + XY = X และ X(X+Y) = X", en: "X + XY = X and X(X+Y) = X" }, why: { th: "ถูกต้อง — เทอมที่มี X เป็นตัวประกอบถูก X ดูดกลืนไป", en: "Correct — the term containing X as a factor is absorbed by X." } },
      { id: "d", label: { th: "X + X'Y = X + Y", en: "X + X'Y = X + Y" }, why: { th: "ผิด — นั่นคือ Redundancy (มี complement อยู่ในเทอมที่สอง)", en: "Wrong — that is redundancy; the second term carries a complement." } },
    ],
    correctId: "c",
    sourceRef: "summarize.md §2.1",
  },
  {
    id: "ics-q12",
    kind: "mcq",
    chapter: 2,
    prompt: {
      th: "`X + 1` มีค่าเท่ากับอะไร",
      en: "What does `X + 1` equal?",
    },
    options: [
      { id: "a", label: { th: "0", en: "0" }, why: { th: "ผิด — X · 0 = 0 คือรูป AND", en: "Wrong — X · 0 = 0 is the AND form." } },
      { id: "b", label: { th: "1", en: "1" }, why: { th: "ถูกต้อง — OR กับ 1 ให้ 1 เสมอ (Null law) เป็นจุดที่ทำให้ลดรูปได้ต่อ", en: "Correct — OR with 1 is always 1 (null law); spotting it unlocks further minimization." } },
      { id: "c", label: { th: "X", en: "X" }, why: { th: "ผิด — X + 0 = X ต่างหาก (Identity)", en: "Wrong — X + 0 = X is the identity law." } },
      { id: "d", label: { th: "X'", en: "X'" }, why: { th: "ผิด — ไม่มีกฎใดให้ผลเป็น complement จากการ OR กับ 1", en: "Wrong — OR-ing with 1 never produces a complement." } },
    ],
    correctId: "b",
    sourceRef: "summarize.md §2.1, §กับดัก 4",
  },
  {
    id: "ics-q13",
    kind: "mcq",
    chapter: 2,
    prompt: {
      th: "`(A + B'C)'` แกะบาร์ด้วย De Morgan ได้ผลลัพธ์ใด",
      en: "Apply De Morgan to `(A + B'C)'`.",
    },
    options: [
      { id: "a", label: { th: "A' + B + C'", en: "A' + B + C'" }, why: { th: "ผิด — ชั้นนอกเป็น OR จึงต้องกลายเป็น AND ไม่ใช่ OR", en: "Wrong — the outer layer is an OR, so it must become an AND." } },
      { id: "b", label: { th: "A'(B'C)", en: "A'(B'C)" }, why: { th: "ผิด — ลืมแกะบาร์ของก้อน B'C", en: "Wrong — the bar over B'C was never expanded." } },
      { id: "c", label: { th: "A'(B + C')", en: "A'(B + C')" }, why: { th: "ถูกต้อง — แกะทีละชั้น: (A + B'C)' = A'·(B'C)' = A'(B + C')", en: "Correct — one layer at a time: (A + B'C)' = A'·(B'C)' = A'(B + C')." } },
      { id: "d", label: { th: "A'B'C'", en: "A'B'C'" }, why: { th: "ผิด — แกะสองชั้นพร้อมกัน เป็นกับดักที่ 5 ในสรุป", en: "Wrong — two layers peeled at once; pitfall #5 in the summary." } },
    ],
    correctId: "c",
    sourceRef: "summarize.md §2.3, §กับดัก 5",
  },
  {
    id: "ics-q14",
    kind: "mcq",
    chapter: 2,
    prompt: {
      th: "กำหนด `F = ABC + B(C' + D')` จงหา `F'` ในรูปสั้นที่สุด",
      en: "Given `F = ABC + B(C' + D')`, find the simplest form of `F'`.",
    },
    options: [
      { id: "a", label: { th: "F' = B' + CD", en: "F' = B' + CD" }, why: { th: "ผิด — ลืมตัวประกอบ A' บนเทอม CD (มาจาก A' ใน (A'+B'+C'))", en: "Wrong — the A' factor on CD is missing; it comes from A' in (A'+B'+C')." } },
      { id: "b", label: { th: "F' = A'B' + C'D'", en: "F' = A'B' + C'D'" }, why: { th: "ผิด — แกะบาร์ผิดชั้น ทั้ง AND และ OR ไม่ได้สลับตามกฎ", en: "Wrong — the layers were not swapped correctly between AND and OR." } },
      { id: "c", label: { th: "F' = B' + A'CD", en: "F' = B' + A'CD" }, why: { th: "ถูกต้อง — F' = (ABC)'·[B(C'+D')]' = (A'+B'+C')(B' + CD) กระจายแล้วยุบด้วย Absorption ได้ B' + A'CD", en: "Correct — F' = (A'+B'+C')(B' + CD); expanding and absorbing leaves B' + A'CD." } },
      { id: "d", label: { th: "F' = A'B'C' · (B' + CD)", en: "F' = A'B'C' · (B' + CD)" }, why: { th: "ผิด — (ABC)' = A' + B' + C' ไม่ใช่ A'B'C'", en: "Wrong — (ABC)' = A' + B' + C', not A'B'C'." } },
    ],
    correctId: "c",
    sourceRef: "midterm-exam.md ข้อ 2(b) / summarize.md §2.3",
  },
  {
    id: "ics-q15",
    kind: "mcq",
    chapter: 2,
    prompt: {
      th: "ข้อใดถูกต้องเกี่ยวกับคุณสมบัติของ XOR",
      en: "Which XOR property is correct?",
    },
    options: [
      { id: "a", label: { th: "X ⊕ Y = XY + X'Y'", en: "X ⊕ Y = XY + X'Y'" }, why: { th: "ผิด — นั่นคือ XNOR (X ⊙ Y) XOR คือ XY' + X'Y", en: "Wrong — that is XNOR (X ⊙ Y); XOR is XY' + X'Y." } },
      { id: "b", label: { th: "X ⊕ 1 = X'", en: "X ⊕ 1 = X'" }, why: { th: "ถูกต้อง — XOR = \"ไม่เหมือนกัน → 1\" ดังนั้น XOR กับ 1 คือการกลับบิต (X ⊕ 0 = X)", en: "Correct — XOR means \"differs → 1\", so XOR-ing with 1 inverts the bit (and X ⊕ 0 = X)." } },
      { id: "c", label: { th: "X ⊕ 1 = X", en: "X ⊕ 1 = X" }, why: { th: "ผิด — นั่นคือ X ⊕ 0 = X", en: "Wrong — that is X ⊕ 0 = X." } },
      { id: "d", label: { th: "X ⊕ X = 1", en: "X ⊕ X = 1" }, why: { th: "ผิด — เหมือนกันจึงได้ 0 (X ⊕ X' = 1 ต่างหาก)", en: "Wrong — identical inputs give 0; X ⊕ X' = 1." } },
    ],
    correctId: "b",
    sourceRef: "summarize.md §2.5",
  },
  {
    id: "ics-q16",
    kind: "mcq",
    chapter: 2,
    prompt: {
      th: "เกตชนิดใดเป็น Universal Gate (สร้างเกตอื่นได้ทุกชนิด)",
      en: "Which gates are universal (can build every other gate)?",
    },
    options: [
      { id: "a", label: { th: "AND และ OR", en: "AND and OR" }, why: { th: "ผิด — ขาดการ invert จึงสร้าง NOT ไม่ได้", en: "Wrong — without inversion they cannot produce NOT." } },
      { id: "b", label: { th: "XOR และ XNOR", en: "XOR and XNOR" }, why: { th: "ผิด — สร้าง NOT ได้ (XOR กับ 1) แต่สร้าง AND/OR ตรงๆ ไม่ได้ จึงไม่ถือเป็น universal", en: "Wrong — they can invert (XOR with 1) but cannot form AND/OR alone, so they are not universal." } },
      { id: "c", label: { th: "NOT เพียงอย่างเดียว", en: "NOT alone" }, why: { th: "ผิด — NOT มีอินพุตเดียว รวมสัญญาณสองเส้นไม่ได้", en: "Wrong — NOT is single-input and cannot combine two signals." } },
      { id: "d", label: { th: "NAND และ NOR", en: "NAND and NOR" }, why: { th: "ถูกต้อง — ทั้งคู่สร้าง NOT/AND/OR ได้ครบ จึงสร้างวงจรใดก็ได้", en: "Correct — each alone can build NOT, AND, and OR, hence any circuit." } },
    ],
    correctId: "d",
    sourceRef: "summarize.md §2.5",
  },
  {
    id: "ics-q17",
    kind: "mcq",
    chapter: 2,
    prompt: {
      th: "กฎ Distributive รูปที่สอง (ที่มีเฉพาะในพีชคณิตบูลีน) คือข้อใด",
      en: "Which is the second distributive law, the one unique to Boolean algebra?",
    },
    options: [
      { id: "a", label: { th: "X + X' = 1", en: "X + X' = 1" }, why: { th: "ผิด — นั่นคือกฎ Complement", en: "Wrong — that is the complement law." } },
      { id: "b", label: { th: "X + YZ = (X + Y)(X + Z)", en: "X + YZ = (X + Y)(X + Z)" }, why: { th: "ถูกต้อง — ไม่มีในพีชคณิตปกติ ใช้แปลง SOP → POS", en: "Correct — it has no counterpart in ordinary algebra and converts SOP → POS." } },
      { id: "c", label: { th: "X(Y + Z) = XY + XZ", en: "X(Y + Z) = XY + XZ" }, why: { th: "ผิด — เป็นรูปแรกซึ่งเหมือนพีชคณิตปกติ", en: "Wrong — that is the first form, identical to ordinary algebra." } },
      { id: "d", label: { th: "(XY)' = X' + Y'", en: "(XY)' = X' + Y'" }, why: { th: "ผิด — นั่นคือ De Morgan", en: "Wrong — that is De Morgan." } },
    ],
    correctId: "b",
    sourceRef: "summarize.md §2.1",
  },
  {
    id: "ics-q18",
    kind: "mcq",
    chapter: 2,
    prompt: {
      th: "กฎ Consensus: `XY + X'Z + YZ` ลดรูปได้เป็นอะไร",
      en: "Consensus law: `XY + X'Z + YZ` reduces to what?",
    },
    options: [
      { id: "a", label: { th: "XY + X'Z", en: "XY + X'Z" }, why: { th: "ถูกต้อง — เทอม YZ เป็น consensus term ที่ซ้ำซ้อน (ถูกคลุมโดยสองเทอมแรกอยู่แล้ว)", en: "Correct — YZ is the redundant consensus term, already covered by the first two." } },
      { id: "b", label: { th: "XY + YZ", en: "XY + YZ" }, why: { th: "ผิด — ตัดเทอมผิดตัว X'Z จำเป็นเมื่อ X=0", en: "Wrong — dropped the wrong term; X'Z is needed when X=0." } },
      { id: "c", label: { th: "YZ", en: "YZ" }, why: { th: "ผิด — แคบเกินไป เช่น X=1,Y=1,Z=0 ให้ F=1 แต่ YZ = 0", en: "Wrong — too narrow: X=1,Y=1,Z=0 gives F=1 but YZ = 0." } },
      { id: "d", label: { th: "X + Z", en: "X + Z" }, why: { th: "ผิด — ตัดตัวแปร Y ทิ้งโดยไม่มีกฎรองรับ", en: "Wrong — it drops Y with no law justifying it." } },
    ],
    correctId: "a",
    sourceRef: "summarize.md §2.1",
  },
  {
    id: "ics-q19",
    kind: "mcq",
    chapter: 2,
    prompt: {
      th: "วงจร NOR 4 ตัว: W = NOR(X,Y), M = NOR(X,W), N = NOR(Y,W), G = NOR(M,N) เอาต์พุต G คืออะไร",
      en: "Four NOR gates: W = NOR(X,Y), M = NOR(X,W), N = NOR(Y,W), G = NOR(M,N). What is G?",
    },
    snippet: "W = X'Y'\nM = X'(X+Y) = X'Y\nN = Y'(X+Y) = XY'\nG = (M + N)'",
    options: [
      { id: "a", label: { th: "G = X ⊕ Y", en: "G = X ⊕ Y" }, why: { th: "ผิด — โครงสร้าง 4 เกตแบบนี้ให้ XOR เมื่อใช้ NAND ถ้าใช้ NOR จะได้ XNOR (เป็นคู่ dual กัน)", en: "Wrong — this 4-gate pattern gives XOR with NAND gates; with NOR gates it gives XNOR (the dual)." } },
      { id: "b", label: { th: "G = X'Y'", en: "G = X'Y'" }, why: { th: "ผิด — นั่นคือ W ซึ่งเป็นเอาต์พุตของเกตแรกเท่านั้น", en: "Wrong — that is W, the first gate's output only." } },
      { id: "c", label: { th: "G = X + Y", en: "G = X + Y" }, why: { th: "ผิด — NOR ตัวท้ายให้ค่ากลับด้าน ไม่ใช่ OR ตรงๆ", en: "Wrong — the final NOR inverts; it is not a plain OR." } },
      { id: "d", label: { th: "G = X ⊙ Y = XY + X'Y'", en: "G = X ⊙ Y = XY + X'Y'" }, why: { th: "ถูกต้อง — G = (X'Y + XY')' = (X ⊕ Y)' = XNOR", en: "Correct — G = (X'Y + XY')' = (X ⊕ Y)' = XNOR." } },
    ],
    correctId: "d",
    sourceRef: "midterm-exam.md ข้อ 2(d)",
  },

  // ══ Chapter 3 — Karnaugh Map ═══════════════════════════════════════════════
  {
    id: "ics-q20",
    kind: "mcq",
    chapter: 3,
    prompt: {
      th: "`F(A,B,C,D) = ΠM(4, 5, 14, 15)` ตัวเลข 4, 5, 14, 15 หมายถึงอะไร",
      en: "In `F(A,B,C,D) = ΠM(4, 5, 14, 15)`, what do the numbers 4, 5, 14, 15 mean?",
    },
    options: [
      { id: "a", label: { th: "ตำแหน่ง don't care", en: "The don't-care cells" }, why: { th: "ผิด — don't care เขียนด้วย Σd หรือ ΠD แยกต่างหาก", en: "Wrong — don't cares are written separately as Σd." } },
      { id: "b", label: { th: "จำนวนกลุ่มที่ต้องจับ", en: "The number of groups to draw" }, why: { th: "ผิด — เป็นหมายเลขช่อง ไม่ใช่จำนวนกลุ่ม", en: "Wrong — they are cell indices, not a group count." } },
      { id: "c", label: { th: "ตำแหน่งที่ F = 0 ช่องที่เหลือทั้งหมดเป็น 1", en: "The cells where F = 0; every remaining cell is 1" }, why: { th: "ถูกต้อง — ΠM คือ Product of Maxterms ซึ่งระบุตำแหน่งที่ฟังก์ชันเป็น 0", en: "Correct — ΠM is a product of maxterms, listing where the function is 0." } },
      { id: "d", label: { th: "ตำแหน่งที่ F = 1", en: "The cells where F = 1" }, why: { th: "ผิด — นั่นคือ Σm เป็นกับดักอันดับ 1 ของข้อ K-Map", en: "Wrong — that is Σm; this is the #1 K-map trap." } },
    ],
    correctId: "c",
    sourceRef: "summarize.md §3.3",
  },
  {
    id: "ics-q21",
    kind: "mcq",
    chapter: 3,
    prompt: {
      th: "จงลดรูป `F(A,B,C,D) = ΠM(4, 5, 14, 15)` ด้วย K-Map ให้อยู่ในรูป SOP",
      en: "Minimize `F(A,B,C,D) = ΠM(4, 5, 14, 15)` with a K-map, in SOP form.",
    },
    options: [
      { id: "a", label: { th: "F = B' + A'C'D + ACD", en: "F = B' + A'C'D + ACD" }, why: { th: "ผิด — จับกลุ่มไม่ใหญ่พอ ทำให้เหลือตัวแปร D ที่ควรถูกยุบไป", en: "Wrong — the groups are too small, leaving a D that should cancel." } },
      { id: "b", label: { th: "F = B' + A'C + AC'", en: "F = B' + A'C + AC'" }, why: { th: "ถูกต้อง — เติม 0 ที่ 4,5,14,15 ที่เหลือเป็น 1 จับได้กลุ่ม 8 (B', ต้อง wrap คอลัมน์ AB=00 กับ 10) + กลุ่ม 4 อีกสองกลุ่ม", en: "Correct — put 0 at 4,5,14,15 and 1 elsewhere: one size-8 group B' (wrapping columns AB=00 and 10) plus two size-4 groups." } },
      { id: "c", label: { th: "F = A'BC' + ABC", en: "F = A'BC' + ABC" }, why: { th: "ผิด — นั่นคือ F' (จับกลุ่มของ 0)", en: "Wrong — that is F', obtained by grouping the zeros." } },
      { id: "d", label: { th: "F = A'BC' + A'BC + ABC + ABC'", en: "F = A'BC' + A'BC + ABC + ABC'" }, why: { th: "ผิด — เติม 1 ลงในช่อง 4,5,14,15 (สับสน ΠM กับ Σm)", en: "Wrong — treated 4,5,14,15 as ones, confusing ΠM with Σm." } },
    ],
    correctId: "b",
    sourceRef: "midterm-exam.md เฉลยข้อ 3(a)",
  },
  {
    id: "ics-q22",
    kind: "mcq",
    chapter: 3,
    prompt: {
      th: "หัวคอลัมน์ของ K-Map ต้องเรียงลำดับอย่างไร",
      en: "How must the K-map column headings be ordered?",
    },
    options: [
      { id: "a", label: { th: "00, 01, 10, 11 (เรียงตามเลขฐานสอง)", en: "00, 01, 10, 11 (plain binary)" }, why: { th: "ผิด — 01 กับ 10 ต่างกัน 2 บิต การจับกลุ่มข้างเคียงจะผิดทั้งหมด", en: "Wrong — 01 and 10 differ in two bits, so adjacency grouping breaks." } },
      { id: "b", label: { th: "11, 10, 01, 00", en: "11, 10, 01, 00" }, why: { th: "ผิด — ลำดับนี้ก็ข้าม 2 บิตระหว่าง 10 กับ 01 เช่นกัน", en: "Wrong — this also jumps two bits between 10 and 01." } },
      { id: "c", label: { th: "เรียงอย่างไรก็ได้ ขอให้ครบ 4 ค่า", en: "Any order, as long as all four values appear" }, why: { th: "ผิด — ตำแหน่งเป็นตัวกำหนดความอยู่ติดกัน จึงเรียงมั่วไม่ได้", en: "Wrong — position defines adjacency, so the order matters." } },
      { id: "d", label: { th: "00, 01, 11, 10 (Gray Code)", en: "00, 01, 11, 10 (Gray code)" }, why: { th: "ถูกต้อง — ช่องข้างเคียงต้องต่างกันเพียง 1 บิต การจับกลุ่มจึงยุบตัวแปรได้", en: "Correct — adjacent cells must differ by exactly one bit so grouping cancels a variable." } },
    ],
    correctId: "d",
    sourceRef: "summarize.md §3.1, §กับดัก 9",
  },
  {
    id: "ics-q23",
    kind: "mcq",
    chapter: 3,
    prompt: {
      th: "ใน K-Map 4 ตัวแปร กลุ่มขนาด 8 ช่อง ให้เทอมที่มีตัวแปรกี่ตัว",
      en: "In a 4-variable K-map, a group of 8 cells yields a term with how many variables?",
    },
    options: [
      { id: "a", label: { th: "0 ตัว", en: "0 variables" }, why: { th: "ผิด — 0 ตัวคือกลุ่มขนาด 16 ซึ่งหมายถึง F = 1", en: "Wrong — zero variables means a group of 16, i.e. F = 1." } },
      { id: "b", label: { th: "1 ตัว", en: "1 variable" }, why: { th: "ถูกต้อง — กลุ่มขนาด 2ᵏ ยุบตัวแปรไป k ตัว: 8 = 2³ → เหลือ 4 − 3 = 1", en: "Correct — a group of 2ᵏ cancels k variables: 8 = 2³ leaves 4 − 3 = 1." } },
      { id: "c", label: { th: "2 ตัว", en: "2 variables" }, why: { th: "ผิด — 2 ตัวมาจากกลุ่มขนาด 4", en: "Wrong — two variables come from a group of 4." } },
      { id: "d", label: { th: "3 ตัว", en: "3 variables" }, why: { th: "ผิด — 3 ตัวมาจากกลุ่มขนาด 2", en: "Wrong — three variables come from a group of 2." } },
    ],
    correctId: "b",
    sourceRef: "summarize.md §3.2",
  },
  {
    id: "ics-q24",
    kind: "mcq",
    chapter: 3,
    prompt: {
      th: "ข้อใดกล่าวถูกเกี่ยวกับการ wrap-around ใน K-Map",
      en: "Which statement about K-map wrap-around is correct?",
    },
    options: [
      { id: "a", label: { th: "wrap ได้เฉพาะแนวนอนเท่านั้น", en: "Only horizontal wrapping is allowed" }, why: { th: "ผิด — wrap ได้ทั้งสองแกน", en: "Wrong — both axes wrap." } },
      { id: "b", label: { th: "4 มุมจับรวมกันไม่ได้เพราะไม่ติดกัน", en: "The four corners cannot group because they are not adjacent" }, why: { th: "ผิด — ทั้ง 4 มุมต่างกันทีละบิตแบบวนรอบ จึงเป็นกลุ่มขนาด 4 ที่ถูกต้อง", en: "Wrong — the corners are mutually adjacent through wrapping and form a valid size-4 group." } },
      { id: "c", label: { th: "wrap ใช้ได้เฉพาะกับ K-Map 5 ตัวแปร", en: "Wrapping applies only to 5-variable maps" }, why: { th: "ผิด — ใช้ได้กับทุกขนาดตั้งแต่ 3 ตัวแปรขึ้นไป", en: "Wrong — it applies to every map of 3 variables and up." } },
      { id: "d", label: { th: "ขอบซ้ายติดขอบขวา ขอบบนติดขอบล่าง และ 4 มุมรวมเป็นกลุ่มเดียวได้", en: "Left edge touches right, top touches bottom, and the four corners can form one group" }, why: { th: "ถูกต้อง — K-Map เป็นผิวโดนัท (torus) การลืม wrap คือเหตุผลอันดับ 1 ที่ได้คำตอบยาวเกิน", en: "Correct — a K-map wraps like a torus; forgetting it is the top cause of over-long answers." } },
    ],
    correctId: "d",
    sourceRef: "summarize.md §3.2, §กับดัก 10",
  },
  {
    id: "ics-q25",
    kind: "mcq",
    chapter: 3,
    prompt: {
      th: "หลักการใช้ don't care (X) ในการจับกลุ่ม K-Map ข้อใดถูก",
      en: "Which rule for using don't cares (X) when grouping is correct?",
    },
    options: [
      { id: "a", label: { th: "มองเป็น 1 เสมอ", en: "Always treat them as 1" }, why: { th: "ผิด — บางตัวไม่ช่วยอะไร กลับบังคับให้ต้องคลุมเพิ่ม", en: "Wrong — some of them help nothing yet force extra coverage." } },
      { id: "b", label: { th: "ใช้เฉพาะตัวที่ช่วยให้กลุ่มใหญ่ขึ้น ที่เหลือปล่อยเป็น 0 และห้ามสร้างกลุ่มที่มีแต่ X ล้วน", en: "Use only the ones that enlarge a group, leave the rest as 0, and never form a group of X's only" }, why: { th: "ถูกต้อง — เช่นในเฉลยข้อ 3(b) don't care ที่ 13 ไม่ถูกใช้เลย และนั่นถูกต้องแล้ว", en: "Correct — in the 3(b) key, don't care 13 is never used, and that is the right call." } },
      { id: "c", label: { th: "ต้องใช้ don't care ให้ครบทุกตัว", en: "Every don't care must be covered" }, why: { th: "ผิด — การบังคับคลุมทำให้ได้เทอมเกินมาฟรีๆ", en: "Wrong — forcing coverage adds unnecessary terms." } },
      { id: "d", label: { th: "ต้องมองเป็น 0 เสมอเพื่อความปลอดภัย", en: "Always treat them as 0 to be safe" }, why: { th: "ผิด — เสียโอกาสจับกลุ่มใหญ่ ทำให้สมการยาวขึ้น", en: "Wrong — that forfeits larger groups and yields a longer equation." } },
    ],
    correctId: "b",
    sourceRef: "summarize.md §3.4, midterm-exam.md เฉลยข้อ 3(b)",
  },
  {
    id: "ics-q26",
    kind: "mcq",
    chapter: 3,
    prompt: {
      th: "จงลดรูป `F(A,B,C,D) = Σm(0,1,2,5,6,7,8,9,10,14) + Σd(4,13)`",
      en: "Minimize `F(A,B,C,D) = Σm(0,1,2,5,6,7,8,9,10,14) + Σd(4,13)`.",
    },
    options: [
      { id: "a", label: { th: "F = B' + CD' + A'B", en: "F = B' + CD' + A'B" }, why: { th: "ผิด — B' ต้องคลุม m3 และ m11 ซึ่งเป็น 0 จึงจับกลุ่ม 8 ไม่ได้", en: "Wrong — B' would need m3 and m11, which are 0, so no size-8 group exists." } },
      { id: "b", label: { th: "F = B'C' + CD' + A'B + ABD", en: "F = B'C' + CD' + A'B + ABD" }, why: { th: "ผิด — เทอม ABD มาจากการดันคลุม don't care d13 ทั้งที่ไม่จำเป็น", en: "Wrong — ABD appears only from forcing coverage of don't care d13." } },
      { id: "c", label: { th: "F = B'C' + CD' + A'B", en: "F = B'C' + CD' + A'B" }, why: { th: "ถูกต้อง — B'C' ต้อง wrap คอลัมน์ AB=00↔10, CD' คือแถว CD=10 ทั้งแถว, A'B ใช้ don't care d4 (ส่วน d13 ไม่ถูกใช้)", en: "Correct — B'C' wraps columns AB=00↔10, CD' is the whole CD=10 row, and A'B uses don't care d4 (d13 goes unused)." } },
      { id: "d", label: { th: "F = B'C' + CD' + A'B + A'D", en: "F = B'C' + CD' + A'B + A'D" }, why: { th: "ผิด — 4 เทอมแปลว่าพลาด wrap-around หรือไม่ได้ใช้ d4", en: "Wrong — a fourth term means a missed wrap-around or unused d4." } },
    ],
    correctId: "c",
    sourceRef: "midterm-exam.md เฉลยข้อ 3(b)",
  },
  {
    id: "ics-q27",
    kind: "mcq",
    chapter: 3,
    prompt: {
      th: "K-Map 5 ตัวแปร (A,B,C,D,E): ถ้าช่องตำแหน่งเดียวกันเป็น 1 ทั้งผืน A=0 และ A=1 เทอมที่ได้เป็นอย่างไร",
      en: "In a 5-variable K-map (A,B,C,D,E), if the same cell is 1 on both the A=0 and A=1 sheets, what does the resulting term look like?",
    },
    options: [
      { id: "a", label: { th: "จับรวมกันได้ และเทอมที่ได้จะไม่มีตัวแปร A", en: "They combine, and the term contains no A" }, why: { th: "ถูกต้อง — สองผืนซ้อนทับกัน ตำแหน่งเดียวกันต่างกันแค่บิต A จึงยุบ A ทิ้ง (ตอบ A'BC + ABC = พลาด ที่ถูกคือ BC)", en: "Correct — the sheets stack; those cells differ only in A, so A cancels. Answering A'BC + ABC means you missed it — the answer is BC." } },
      { id: "b", label: { th: "จับรวมกันไม่ได้ ต้องเขียนสองเทอมแยกกัน", en: "They cannot combine; write two separate terms" }, why: { th: "ผิด — เป็นกับดักที่ 11 มองสองผืนเป็นแผนที่แยกกันโดยไม่ซ้อนทับ", en: "Wrong — pitfall #11: treating the sheets as unrelated maps." } },
      { id: "c", label: { th: "จับรวมได้ และเทอมจะมี A' เสมอ", en: "They combine and the term always keeps A'" }, why: { th: "ผิด — ถ้าเทอมยังมี A' แสดงว่าไม่ได้รวมสองผืนจริง", en: "Wrong — a surviving A' means the sheets were not actually merged." } },
      { id: "d", label: { th: "ต้องแยกทำเป็นสองฟังก์ชันแล้วนำมา OR กัน", en: "Solve two separate functions and OR them" }, why: { th: "ผิด — ทำแบบนั้นได้คำตอบที่ถูกแต่ยาวกว่าที่ควร ไม่ใช่รูปที่ลดรูปแล้ว", en: "Wrong — that gives a correct but non-minimal answer." } },
    ],
    correctId: "a",
    sourceRef: "summarize.md §3.2, §กับดัก 11",
  },
  {
    id: "ics-q28",
    kind: "mcq",
    chapter: 3,
    prompt: {
      th: "ข้อใดคือกลุ่มที่ถูกต้องตามกฎการจับกลุ่ม K-Map",
      en: "Which of these is a legal K-map group?",
    },
    options: [
      { id: "a", label: { th: "สี่เหลี่ยมขนาด 1, 2, 4, 8 หรือ 16 ช่อง", en: "A rectangle of 1, 2, 4, 8, or 16 cells" }, why: { th: "ถูกต้อง — ต้องเป็นกำลังของ 2 และเป็นสี่เหลี่ยมเท่านั้น", en: "Correct — the size must be a power of two and the shape a rectangle." } },
      { id: "b", label: { th: "กลุ่มขนาด 3 ช่องเรียงกัน", en: "Three cells in a row" }, why: { th: "ผิด — 3 ไม่ใช่กำลังของ 2 จึงยุบตัวแปรไม่ลงตัว", en: "Wrong — 3 is not a power of two, so no variable cancels cleanly." } },
      { id: "c", label: { th: "กลุ่มรูปตัว L ขนาด 4 ช่อง", en: "An L-shaped group of 4 cells" }, why: { th: "ผิด — รูปตัว L ไม่ใช่สี่เหลี่ยม ช่องในกลุ่มจึงไม่ต่างกันทีละบิตทั้งหมด", en: "Wrong — an L is not a rectangle, so its cells are not all single-bit adjacent." } },
      { id: "d", label: { th: "กลุ่มทแยงมุม 2 ช่อง", en: "Two diagonal cells" }, why: { th: "ผิด — ช่องทแยงต่างกัน 2 บิต ไม่ถือว่าอยู่ติดกัน", en: "Wrong — diagonal cells differ in two bits and are not adjacent." } },
    ],
    correctId: "a",
    sourceRef: "summarize.md §3.2",
  },
  {
    id: "ics-q29",
    kind: "mcq",
    chapter: 3,
    prompt: {
      th: "ความสัมพันธ์ระหว่าง Σm และ ΠM ข้อใดถูกต้อง",
      en: "Which relationship between Σm and ΠM is correct?",
    },
    options: [
      { id: "a", label: { th: "ΠM ใช้ได้เฉพาะเมื่อไม่มี don't care", en: "ΠM only works when there are no don't cares" }, why: { th: "ผิด — don't care ใช้ร่วมกับ ΠM ได้ตามปกติ", en: "Wrong — don't cares combine with ΠM just fine." } },
      { id: "b", label: { th: "ΠM ให้คำตอบในรูป SOP เสมอ", en: "ΠM always yields an SOP answer" }, why: { th: "ผิด — ΠM สื่อถึงรูป POS แต่จะตอบเป็น SOP ก็ได้ถ้าจับกลุ่ม 1 แทน", en: "Wrong — ΠM implies POS form, though you may still answer in SOP by grouping the ones." } },
      { id: "c", label: { th: "Σm(รายการ A) = ΠM(หมายเลขที่เหลือทั้งหมด)", en: "Σm(list A) = ΠM(all the remaining indices)" }, why: { th: "ถูกต้อง — ช่องที่ไม่ใช่ 1 ก็คือช่องที่เป็น 0 พอดี", en: "Correct — the cells that are not 1 are exactly the cells that are 0." } },
      { id: "d", label: { th: "Σm(รายการ A) = ΠM(รายการ A)", en: "Σm(list A) = ΠM(list A)" }, why: { th: "ผิด — ใช้รายการเดียวกันแต่คนละความหมาย จึงเป็นฟังก์ชันคนละตัวโดยสิ้นเชิง", en: "Wrong — the same list read two ways gives two completely different functions." } },
    ],
    correctId: "c",
    sourceRef: "summarize.md §3.3",
  },

  // ══ Chapter 4 — Timing & Propagation Delay ═════════════════════════════════
  {
    id: "ics-q30",
    kind: "mcq",
    chapter: 4,
    prompt: {
      th: "วงจร: G1=INV(A)→P [delay 1], G2=NAND(P,B)→Q [delay 2] จง Delay สะสมของ Q นับจากอินพุต",
      en: "Circuit: G1=INV(A)→P [delay 1], G2=NAND(P,B)→Q [delay 2]. What is Q's cumulative delay from the inputs?",
    },
    options: [
      { id: "a", label: { th: "1 หน่วยเวลา", en: "1 time unit" }, why: { th: "ผิด — 1 คือ delay ของ P เท่านั้น", en: "Wrong — 1 is P's delay alone." } },
      { id: "b", label: { th: "5 หน่วยเวลา", en: "5 time units" }, why: { th: "ผิด — บวก delay ของทั้งสองเส้นทางรวมกัน ต้องเลือกเส้นทางที่ยาวที่สุด ไม่ใช่บวกกัน", en: "Wrong — that adds both paths; you take the longest path, not the sum." } },
      { id: "c", label: { th: "3 หน่วยเวลา", en: "3 time units" }, why: { th: "ถูกต้อง — เส้นทางยาวสุดคือ A→INV(1)→NAND(2) = 3 (เส้นทาง B→NAND = 2 สั้นกว่า)", en: "Correct — the longest path is A→INV(1)→NAND(2) = 3; the B→NAND path is only 2." } },
      { id: "d", label: { th: "2 หน่วยเวลา", en: "2 time units" }, why: { th: "ผิด — นับ delay แค่เกตสุดท้าย เป็นกับดักที่ 13", en: "Wrong — that counts only the final gate; pitfall #13." } },
    ],
    correctId: "c",
    sourceRef: "midterm-exam.md เฉลยข้อ 4 ขั้นที่ 1",
  },
  {
    id: "ics-q31",
    kind: "mcq",
    chapter: 4,
    prompt: {
      th: "ต่อจากวงจรเดิม: G3=XOR(P,B)→R [delay 3], G4=NAND(Q,R)→S [delay 2] จง Delay สะสมของ S",
      en: "Continuing: G3=XOR(P,B)→R [delay 3], G4=NAND(Q,R)→S [delay 2]. What is S's cumulative delay?",
    },
    snippet: "P: INV = 1\nQ: max(1+2, 2) = 3\nR: max(1+3, 3) = 4\nS: max(Q, R) + 2 = ?",
    options: [
      { id: "a", label: { th: "5 หน่วยเวลา", en: "5 time units" }, why: { th: "ผิด — ใช้ Q (3) แทน R (4) เป็นตัวกำหนด ต้องใช้เส้นทางที่ช้ากว่า", en: "Wrong — that uses Q (3) instead of the slower R (4)." } },
      { id: "b", label: { th: "2 หน่วยเวลา", en: "2 time units" }, why: { th: "ผิด — นับเฉพาะ delay ของ G4", en: "Wrong — that counts only G4's own delay." } },
      { id: "c", label: { th: "9 หน่วยเวลา", en: "9 time units" }, why: { th: "ผิด — บวก Q และ R เข้าด้วยกัน ทั้งที่เป็นเส้นทางขนาน", en: "Wrong — it sums Q and R, which are parallel paths." } },
      { id: "d", label: { th: "6 หน่วยเวลา", en: "6 time units" }, why: { th: "ถูกต้อง — R ช้าที่สุดที่ 4 บวก NAND อีก 2 = 6", en: "Correct — R is the slowest input at 4, plus the NAND's 2 = 6." } },
    ],
    correctId: "d",
    sourceRef: "midterm-exam.md เฉลยข้อ 4 ขั้นที่ 1",
  },
  {
    id: "ics-q32",
    kind: "mcq",
    chapter: 4,
    prompt: {
      th: "สมการที่ใช้เขียน Timing Diagram ของเกตที่มี delay t_d คือข้อใด",
      en: "Which equation describes a gate output with propagation delay t_d?",
    },
    options: [
      { id: "a", label: { th: "Output(t) = f( Input(t − t_d) )", en: "Output(t) = f( Input(t − t_d) )" }, why: { th: "ถูกต้อง — เอาต์พุตวันนี้สะท้อนอินพุตเมื่อ t_d หน่วยที่แล้ว", en: "Correct — the output now reflects the input from t_d units ago." } },
      { id: "b", label: { th: "Output(t) = f( Input(t + t_d) )", en: "Output(t) = f( Input(t + t_d) )" }, why: { th: "ผิด — วงจรอ่านอนาคตไม่ได้ เครื่องหมายต้องเป็นลบ", en: "Wrong — a circuit cannot read the future; the sign must be negative." } },
      { id: "c", label: { th: "Output(t) = f( Input(t) ) − t_d", en: "Output(t) = f( Input(t) ) − t_d" }, why: { th: "ผิด — delay เลื่อนแกนเวลา ไม่ได้ลบค่าลอจิก", en: "Wrong — delay shifts the time axis; it does not subtract from a logic value." } },
      { id: "d", label: { th: "Output(t) = f( Input(t) ) เสมอ", en: "Output(t) = f( Input(t) ) always" }, why: { th: "ผิด — นั่นคือวงจรอุดมคติที่ไม่มี delay", en: "Wrong — that is the idealized zero-delay model." } },
    ],
    correctId: "a",
    sourceRef: "summarize.md §4.1",
  },
  {
    id: "ics-q33",
    kind: "mcq",
    chapter: 4,
    prompt: {
      th: "Glitch (Hazard) เกิดจากสาเหตุใด",
      en: "What causes a glitch (hazard)?",
    },
    options: [
      { id: "a", label: { th: "เกตหนึ่งรับ input จากสองเส้นทางที่มี delay ไม่เท่ากัน", en: "One gate receives inputs from two paths with unequal delays" }, why: { th: "ถูกต้อง — มีช่วงสั้นๆ ที่อินพุตทั้งสองสะท้อนสถานะคนละเวลา ทำให้เอาต์พุตแกว่ง", en: "Correct — for a brief window the two inputs reflect different moments in time, so the output momentarily flips." } },
      { id: "b", label: { th: "การคำนวณตารางความจริงผิด", en: "An error in the truth table" }, why: { th: "ผิด — glitch เกิดจริงในฮาร์ดแวร์แม้ตรรกะจะถูกต้อง 100%", en: "Wrong — glitches occur in real hardware even when the logic is perfectly correct." } },
      { id: "c", label: { th: "แรงดันไฟเลี้ยงไม่พอ", en: "Insufficient supply voltage" }, why: { th: "ผิด — เป็นปัญหาระดับไฟฟ้า ไม่ใช่นิยาม hazard ในวิชานี้", en: "Wrong — that is an electrical issue, not the hazard defined in this course." } },
      { id: "d", label: { th: "ใช้ NAND แทน NOR", en: "Using NAND instead of NOR" }, why: { th: "ผิด — ชนิดเกตไม่ใช่สาเหตุ ความต่างของ delay ต่างหาก", en: "Wrong — the gate type is not the cause; unequal delay is." } },
    ],
    correctId: "a",
    sourceRef: "summarize.md §4.3",
  },
  {
    id: "ics-q34",
    kind: "mcq",
    chapter: 4,
    prompt: {
      th: "Static-1 Hazard มีลักษณะอย่างไร",
      en: "What characterizes a static-1 hazard?",
    },
    options: [
      { id: "a", label: { th: "output เปลี่ยนสถานะแล้วแกว่งหลายครั้งก่อนนิ่ง", en: "The output toggles several times before settling" }, why: { th: "ผิด — นั่นคือ Dynamic Hazard", en: "Wrong — that is a dynamic hazard." } },
      { id: "b", label: { th: "output ค้างอยู่ที่ 1 ถาวร", en: "The output latches at 1 permanently" }, why: { th: "ผิด — hazard เป็นพัลส์ชั่วคราว ไม่ใช่การค้างถาวร", en: "Wrong — a hazard is a transient pulse, not a permanent latch." } },
      { id: "c", label: { th: "output ควรคงค่า 1 แต่ตกลงเป็น 0 ชั่วขณะ", en: "The output should stay 1 but momentarily dips to 0" }, why: { th: "ถูกต้อง — เช่นในเฉลยข้อ 4 สัญญาณ S ควรเป็น 1 ตลอด t=11–17 แต่ตกเป็น 0 ที่ t=14", en: "Correct — in the key for Q4, S should hold 1 across t=11–17 but drops to 0 at t=14." } },
      { id: "d", label: { th: "output ควรคงค่า 0 แต่กระโดดขึ้น 1 ชั่วขณะ", en: "The output should stay 0 but momentarily jumps to 1" }, why: { th: "ผิด — นั่นคือ Static-0 Hazard", en: "Wrong — that is a static-0 hazard." } },
    ],
    correctId: "c",
    sourceRef: "summarize.md §4.3",
  },
  {
    id: "ics-q35",
    kind: "mcq",
    chapter: 4,
    prompt: {
      th: "จากเฉลยข้อ 4 Glitch ที่สัญญาณ S เกิดขึ้นที่เวลาใด และเป็นชนิดใด",
      en: "In the Q4 answer key, when does the glitch on S occur and what type is it?",
    },
    options: [
      { id: "a", label: { th: "t = 6 ซึ่งเป็น delay สะสมของ S", en: "t = 6, which is S's cumulative delay" }, why: { th: "ผิด — t=6 คือเวลาที่ S เริ่มมีค่าที่เชื่อถือได้ ไม่ใช่จุดที่เกิด glitch", en: "Wrong — t=6 is when S first becomes valid, not where the glitch is." } },
      { id: "b", label: { th: "t = 14 กว้าง 1 หน่วยเวลา เป็น Static-1 Hazard", en: "t = 14, one time unit wide, a static-1 hazard" }, why: { th: "ถูกต้อง — Q ช้า 3 หน่วย R ช้า 4 หน่วย ต่างกัน 1 → ที่ t=12 ทั้งคู่เป็น 1 พร้อมกัน → NAND ให้ 0 → ปรากฏที่ S ตอน t = 12 + 2 = 14", en: "Correct — Q lags 3 and R lags 4, a 1-unit skew: at t=12 both are 1, the NAND outputs 0, and it shows on S at t = 12 + 2 = 14." } },
      { id: "c", label: { th: "t = 12 เป็น Static-0 Hazard", en: "t = 12, a static-0 hazard" }, why: { th: "ผิด — t=12 คือเวลาที่ต้นเหตุเกิดที่อินพุตของ G4 ยังต้องบวก delay ของ G4 อีก 2 และ S ตกจาก 1 เป็น 0 จึงเป็น Static-1", en: "Wrong — t=12 is when the cause appears at G4's inputs; add G4's 2-unit delay. Also S dips from 1, so it is static-1." } },
      { id: "d", label: { th: "ไม่เกิด glitch เพราะตรรกะถูกต้อง", en: "No glitch occurs because the logic is correct" }, why: { th: "ผิด — เป็นกับดักที่ 15 นักศึกษามักลบ glitch ทิ้งเพราะคิดว่าคำนวณผิด ทั้งที่เป็นคำตอบที่ให้คะแนน", en: "Wrong — pitfall #15: students erase the glitch thinking it is an arithmetic slip, when it is the scored answer." } },
    ],
    correctId: "b",
    sourceRef: "midterm-exam.md เฉลยข้อ 4 ขั้นที่ 5",
  },
  {
    id: "ics-q36",
    kind: "mcq",
    chapter: 4,
    prompt: {
      th: "วิธีแก้ปัญหา Glitch / Hazard ที่ถูกต้องคือข้อใด",
      en: "Which is a correct way to eliminate a glitch/hazard?",
    },
    options: [
      { id: "a", label: { th: "เพิ่ม redundant term (consensus term) ในสมการ หรือใช้ synchronous design", en: "Add a redundant (consensus) term to the equation, or move to a synchronous design" }, why: { th: "ถูกต้อง — consensus term คลุมช่วงเปลี่ยนสถานะที่กลุ่มเดิมไม่ทับกัน ส่วน synchronous design ใช้ clock sample หลัง worst-case delay", en: "Correct — the consensus term covers the transition where the original groups do not overlap; a synchronous design samples after the worst-case delay." } },
      { id: "b", label: { th: "ลดรูปสมการให้สั้นที่สุดเสมอ", en: "Always minimize the equation as much as possible" }, why: { th: "ผิด — สมการที่สั้นที่สุดคือสมการที่ไม่มี redundant term จึงมีโอกาสเกิด hazard มากกว่า", en: "Wrong — the most minimal equation is precisely the one without redundant terms, so it is more hazard-prone." } },
      { id: "c", label: { th: "เปลี่ยนลำดับอินพุตของเกต", en: "Swap the gate's input order" }, why: { th: "ผิด — เกตไม่สนใจลำดับอินพุต delay ของเส้นทางยังเท่าเดิม", en: "Wrong — gates are order-insensitive; the path delays are unchanged." } },
      { id: "d", label: { th: "ลบพัลส์ออกจาก timing diagram", en: "Erase the pulse from the timing diagram" }, why: { th: "ผิด — เป็นการซ่อนอาการ ไม่ได้แก้วงจร และเสียคะแนนในข้อสอบ", en: "Wrong — that hides the symptom, fixes nothing, and loses marks." } },
    ],
    correctId: "a",
    sourceRef: "summarize.md §4.3",
  },
  {
    id: "ics-q37",
    kind: "mcq",
    chapter: 4,
    prompt: {
      th: "ในช่วง t ที่น้อยกว่า delay สะสมของสัญญาณ ควรวาด timing diagram อย่างไร",
      en: "For t smaller than a signal's cumulative delay, how should the timing diagram be drawn?",
    },
    options: [
      { id: "a", label: { th: "ข้ามช่วงนั้นไปไม่ต้องวาด", en: "Skip that interval entirely" }, why: { th: "ผิด — ต้องแสดงให้ครบทุกช่วงเวลาที่โจทย์กำหนด", en: "Wrong — every interval the problem lists must be filled in." } },
      { id: "b", label: { th: "วาดเป็นเส้นไม่แน่นอน (หยัก) หรือใช้ค่าตามสมมติฐาน steady state ที่โจทย์ให้", en: "Draw it as undefined (hatched), or use the steady-state assumption the problem states" }, why: { th: "ถูกต้อง — ค่ายังไม่สะท้อนอินพุตจริง โจทย์ข้อ 4 กำหนดให้ก่อน t=0 วงจรอยู่ใน steady state", en: "Correct — the value does not yet reflect the real input. Q4 states the circuit is in steady state before t=0." } },
      { id: "c", label: { th: "วาดให้ตอบสนองทันทีตั้งแต่ t = 0", en: "Draw it responding immediately from t = 0" }, why: { th: "ผิด — เป็นกับดักที่ 14 ทำให้ทุกสัญญาณเลื่อนผิดตลอดทั้งข้อ", en: "Wrong — pitfall #14; it shifts every waveform for the rest of the problem." } },
      { id: "d", label: { th: "วาดเป็น 0 เสมอ", en: "Always draw 0" }, why: { th: "ผิด — steady state อาจเป็น 1 ก็ได้ เช่น P = A' เมื่อ A = 0 ก็เป็น 1", en: "Wrong — steady state may well be 1; e.g. P = A' equals 1 when A = 0." } },
    ],
    correctId: "b",
    sourceRef: "summarize.md §4.2, §กับดัก 14",
  },

  // ══ Chapter 5 — Combinational Circuit Design ═══════════════════════════════
  {
    id: "ics-q38",
    kind: "mcq",
    chapter: 5,
    prompt: {
      th: "ขั้นตอนมาตรฐานการออกแบบวงจร Combinational เรียงลำดับอย่างไร",
      en: "What is the standard order of the combinational design procedure?",
    },
    options: [
      { id: "a", label: { th: "ระบุ don't care หลังจากลดรูปสมการแล้ว", en: "Mark don't cares after minimizing the equations" }, why: { th: "ผิด — don't care มีประโยชน์เฉพาะตอนจับกลุ่มใน K-Map เท่านั้น", en: "Wrong — don't cares only help while grouping in the K-map." } },
      { id: "b", label: { th: "ระบุ I/O → ตารางความจริง → ระบุ don't care → K-Map แต่ละ output → สมการ → Schematic", en: "Identify I/O → truth table → mark don't cares → K-map per output → equations → schematic" }, why: { th: "ถูกต้อง — 6 ขั้นตามสรุป §5.1 ห้ามข้ามขั้น don't care เพราะจะได้สมการยาวเกิน", en: "Correct — the six steps in §5.1. Never skip the don't-care step or the equations balloon." } },
      { id: "c", label: { th: "วาด Schematic ก่อน แล้วค่อยตรวจด้วยตารางความจริง", en: "Draw the schematic first, then check it with a truth table" }, why: { th: "ผิด — ได้วงจรที่ไม่ได้ลดรูป และตรวจย้อนยากกว่า", en: "Wrong — that yields an unminimized circuit and is far harder to verify." } },
      { id: "d", label: { th: "เขียน K-Map ก่อนตารางความจริง", en: "Write the K-map before the truth table" }, why: { th: "ผิด — K-Map เติมค่าจากตารางความจริง จึงต้องมีตารางก่อน", en: "Wrong — the K-map is populated from the truth table, which must come first." } },
    ],
    correctId: "b",
    sourceRef: "summarize.md §5.1",
  },
  {
    id: "ics-q39",
    kind: "mcq",
    chapter: 5,
    prompt: {
      th: "ระบบมี input 3 บิต (XYZ) แต่โจทย์ใช้จริงเพียง 5 กรณี (010, 011, 100, 101, 110) กรณีที่เหลือควรทำอย่างไร",
      en: "A system has 3-bit input (XYZ) but only 5 cases are used (010, 011, 100, 101, 110). What about the rest?",
    },
    options: [
      { id: "a", label: { th: "อีก 3 กรณี (000, 001, 111) ต้องกำหนดเป็น don't care", en: "The other 3 cases (000, 001, 111) become don't cares" }, why: { th: "ถูกต้อง — input 3 บิตมี 2³ = 8 กรณี ใช้จริง 5 เหลือ 3 การใส่ X ทำให้ลดรูปได้สั้นลงมาก เช่น C0 = Z' แทน X'YZ' + XY'Z' + XYZ'", en: "Correct — 2³ = 8 cases, 5 used, 3 left. Marking them X shrinks the result dramatically, e.g. C0 = Z' instead of X'YZ' + XY'Z' + XYZ'." } },
      { id: "b", label: { th: "กำหนดเป็น 0 ทั้งหมด", en: "Set them all to 0" }, why: { th: "ผิด — เป็นกับดักข้อ 16 ทำให้สมการยาวกว่าที่ควรมาก", en: "Wrong — pitfall #16; the equations come out much longer than necessary." } },
      { id: "c", label: { th: "กำหนดเป็น 1 ทั้งหมด", en: "Set them all to 1" }, why: { th: "ผิด — บังคับให้ต้องคลุมทุกช่อง เสียโอกาสลดรูป", en: "Wrong — that forces coverage of every cell and forfeits minimization." } },
      { id: "d", label: { th: "ไม่ต้องเขียนลงตารางความจริง", en: "Leave them out of the truth table" }, why: { th: "ผิด — ตารางความจริงต้องครบ 2ⁿ แถวเสมอ เพียงแต่ช่อง output เป็น X", en: "Wrong — the truth table always has all 2ⁿ rows; the output column just holds X." } },
    ],
    correctId: "a",
    sourceRef: "midterm-exam.md ข้อ 5 / summarize.md §กับดัก 16",
  },
  {
    id: "ics-q40",
    kind: "mcq",
    chapter: 5,
    prompt: {
      th: "ในโจทย์ 7-Segment ที่แสดงตัวอักษร A, b, C, d, E สมการของ segment C4 (ซ้ายล่าง) คืออะไร",
      en: "In the 7-segment problem displaying A, b, C, d, E, what is the equation for segment C4 (lower-left)?",
    },
    options: [
      { id: "a", label: { th: "C4 = X' + Z", en: "C4 = X' + Z" }, why: { th: "ผิด — นั่นคือสมการของ C2", en: "Wrong — that is C2's equation." } },
      { id: "b", label: { th: "C4 = Z'", en: "C4 = Z'" }, why: { th: "ผิด — นั่นคือสมการของ C0", en: "Wrong — that is C0's equation." } },
      { id: "c", label: { th: "C4 = Y + Z", en: "C4 = Y + Z" }, why: { th: "ผิด — นั่นคือสมการของ C6 (segment กลาง)", en: "Wrong — that is C6, the middle segment." } },
      { id: "d", label: { th: "C4 = 1 (ต่อกับ VCC ตรงๆ ไม่ต้องใช้เกต)", en: "C4 = 1 — tie it straight to VCC, no gate needed" }, why: { th: "ถูกต้อง — ตัวอักษร A, b, C, d, E ล้วนใช้ segment ซ้ายล่างทั้งหมด ที่เหลือเป็น don't care จึงคลุมได้ทั้งแผนที่", en: "Correct — A, b, C, d, and E all light the lower-left segment, and the rest are don't cares, so the whole map groups as 1." } },
    ],
    correctId: "d",
    sourceRef: "midterm-exam.md เฉลยข้อ 5(a)",
  },
  {
    id: "ics-q41",
    kind: "mcq",
    chapter: 5,
    prompt: {
      th: "จากโจทย์เดียวกัน สมการของ C0 (segment บน) คืออะไร",
      en: "In the same problem, what is the equation for C0 (top segment)?",
    },
    snippet: "XYZ ที่ใช้: 010=A, 011=b, 100=C, 101=d, 110=E\nC0: A=1, b=0, C=1, d=0, E=1",
    options: [
      { id: "a", label: { th: "C0 = X + Z", en: "C0 = X + Z" }, why: { th: "ผิด — นั่นคือสมการของ C3 (segment ล่าง)", en: "Wrong — that is C3, the bottom segment." } },
      { id: "b", label: { th: "C0 = Z'", en: "C0 = Z'" }, why: { th: "ถูกต้อง — segment บนติดเมื่อ Z=0 (A, C, E) และดับเมื่อ Z=1 (b, d) ใช้ don't care ช่วยจึงเหลือแค่ Z'", en: "Correct — the top segment is on when Z=0 (A, C, E) and off when Z=1 (b, d); with don't cares the whole Z=0 row groups to Z'." } },
      { id: "c", label: { th: "C0 = Z", en: "C0 = Z" }, why: { th: "ผิด — กลับด้าน b และ d (Z=1) ไม่มี segment บน", en: "Wrong — inverted; b and d (Z=1) have no top segment." } },
      { id: "d", label: { th: "C0 = X'YZ' + XY'Z' + XYZ'", en: "C0 = X'YZ' + XY'Z' + XYZ'" }, why: { th: "ผิด — ถูกต้องเชิงตรรกะแต่ยังไม่ลดรูป เกิดจากใส่ 0 แทน don't care", en: "Wrong — logically valid but unminimized; it comes from writing 0 instead of X for the don't cares." } },
    ],
    correctId: "b",
    sourceRef: "midterm-exam.md เฉลยข้อ 5(a)",
  },
  {
    id: "ics-q42",
    kind: "mcq",
    chapter: 5,
    prompt: {
      th: "ตัวอักษร `b` (ตัวเล็ก) บน 7-segment ต่างจากเลข `6` อย่างไร",
      en: "How does a lowercase `b` on a 7-segment display differ from the digit `6`?",
    },
    options: [
      { id: "a", label: { th: "`b` ไม่มี segment กลาง แต่ `6` มี", en: "`b` has no middle segment but `6` does" }, why: { th: "ผิด — ทั้งคู่มี segment กลาง (C6 = 1)", en: "Wrong — both light the middle segment (C6 = 1)." } },
      { id: "b", label: { th: "ไม่ต่างกันเลย", en: "They are identical" }, why: { th: "ผิด — ถ้าเหมือนกันจะแยกตัวอักษรกับตัวเลขไม่ได้ เป็นกับดักที่ 17", en: "Wrong — if identical you could not tell letter from digit; pitfall #17." } },
      { id: "c", label: { th: "`b` ใช้เพียง 3 segment", en: "`b` uses only 3 segments" }, why: { th: "ผิด — `b` ใช้ 5 segment (C2, C3, C4, C5, C6)", en: "Wrong — `b` uses five segments (C2, C3, C4, C5, C6)." } },
      { id: "d", label: { th: "`b` ไม่มี segment บน (C0 = 0) แต่ `6` มี", en: "`b` has no top segment (C0 = 0), but `6` does" }, why: { th: "ถูกต้อง — เทคนิคกันพลาด: วาดกรอบ 7-segment ในกระดาษทดแล้วระบายตัวอักษรลงไปก่อนอ่านทีละ segment", en: "Correct — the safe technique is to sketch the 7-segment frame on scratch paper, shade the glyph, then read each segment off." } },
    ],
    correctId: "d",
    sourceRef: "summarize.md §5.2, §กับดัก 17",
  },
  {
    id: "ics-q43",
    kind: "mcq",
    chapter: 5,
    prompt: {
      th: "วงจรที่มี input n บิต ต้องมีตารางความจริงกี่แถว",
      en: "A circuit with n input bits needs a truth table with how many rows?",
    },
    options: [
      { id: "a", label: { th: "2n แถว", en: "2n rows" }, why: { th: "ผิด — โตแบบเชิงเส้น ไม่ครอบคลุมทุกชุดค่า", en: "Wrong — linear growth cannot cover every combination." } },
      { id: "b", label: { th: "n แถว", en: "n rows" }, why: { th: "ผิด — นับจำนวนตัวแปร ไม่ใช่จำนวนชุดค่า", en: "Wrong — that counts variables, not combinations." } },
      { id: "c", label: { th: "2ⁿ แถว", en: "2ⁿ rows" }, why: { th: "ถูกต้อง — แต่ละบิตมี 2 ค่า จึงมีชุดอินพุตทั้งหมด 2ⁿ ชุด (n=3 → 8 แถว)", en: "Correct — each bit takes 2 values, giving 2ⁿ input combinations (n=3 → 8 rows)." } },
      { id: "d", label: { th: "n² แถว", en: "n² rows" }, why: { th: "ผิด — สับสนระหว่างยกกำลังกับกำลังสอง n=3 ให้ 9 ซึ่งไม่มีความหมาย", en: "Wrong — confuses exponential with square; n=3 would give a meaningless 9." } },
    ],
    correctId: "c",
    sourceRef: "summarize.md §5.1",
  },
  {
    id: "ics-q44",
    kind: "mcq",
    chapter: 5,
    prompt: {
      th: "ถ้าคำตอบ K-Map ของคุณต่างจากเฉลย แต่มีจำนวนเทอมและจำนวนตัวแปรเท่ากัน ควรทำอย่างไร",
      en: "Your K-map answer differs from the key but has the same number of terms and variables. What now?",
    },
    options: [
      { id: "a", label: { th: "ถือว่าผิดเพราะไม่ตรงเฉลย", en: "Treat it as wrong because it differs from the key" }, why: { th: "ผิด — เกณฑ์คือความถูกต้องเชิงตรรกะและความสั้น ไม่ใช่รูปหน้าตา", en: "Wrong — the criteria are logical correctness and minimality, not textual match." } },
      { id: "b", label: { th: "รวมทั้งสองคำตอบเข้าด้วยกัน", en: "Merge both answers together" }, why: { th: "ผิด — ได้สมการที่ยาวขึ้นโดยไม่จำเป็น", en: "Wrong — that only lengthens the equation." } },
      { id: "c", label: { th: "ตรวจกับตารางความจริง ถ้าตรงทุกแถวก็ถือว่าถูก (equally minimal solutions)", en: "Verify against the truth table; if every row matches it is correct (equally minimal solutions)" }, why: { th: "ถูกต้อง — เช่น C1 = X'Z' + XZ และ C1 = X'Z' + Y'Z ถูกทั้งคู่ เพราะเลือกใช้ don't care คนละตัว", en: "Correct — e.g. C1 = X'Z' + XZ and C1 = X'Z' + Y'Z are both valid; they just use different don't cares." } },
      { id: "d", label: { th: "แก้ให้ตรงกับเฉลยเสมอ", en: "Always rewrite it to match the key" }, why: { th: "ผิด — K-Map อาจมีคำตอบที่สั้นที่สุดได้มากกว่าหนึ่งรูป", en: "Wrong — a K-map can have more than one equally minimal solution." } },
    ],
    correctId: "c",
    sourceRef: "midterm-exam.md เฉลยข้อ 5(a)",
  },

  // ══ Chapter 6 — Multiplexer ════════════════════════════════════════════════
  {
    id: "ics-q45",
    kind: "mcq",
    chapter: 6,
    prompt: {
      th: "4:1 MUX เมื่อ S1 = 1, S0 = 0 เอาต์พุตจะเท่ากับขาใด",
      en: "For a 4:1 MUX with S1 = 1, S0 = 0, the output equals which data input?",
    },
    options: [
      { id: "a", label: { th: "I3", en: "I3" }, why: { th: "ผิด — I3 เลือกเมื่อ S1S0 = 11", en: "Wrong — I3 needs S1S0 = 11." } },
      { id: "b", label: { th: "I0", en: "I0" }, why: { th: "ผิด — I0 เลือกเมื่อ S1S0 = 00", en: "Wrong — I0 needs S1S0 = 00." } },
      { id: "c", label: { th: "I2", en: "I2" }, why: { th: "ถูกต้อง — S1S0 = 10₂ = 2 จึงเลือก I2 (S1 คือ MSB)", en: "Correct — S1S0 = 10₂ = 2, selecting I2 (S1 is the MSB)." } },
      { id: "d", label: { th: "I1", en: "I1" }, why: { th: "ผิด — I1 เลือกเมื่อ S1S0 = 01 (สลับ MSB/LSB)", en: "Wrong — I1 is selected by S1S0 = 01; the MSB and LSB were swapped." } },
    ],
    correctId: "c",
    sourceRef: "summarize.md §6.1",
  },
  {
    id: "ics-q46",
    kind: "mcq",
    chapter: 6,
    prompt: {
      th: "การใช้ 4:1 MUX สร้างฟังก์ชัน 3 ตัวแปร ขา data สามารถต่อกับค่าใดได้บ้าง",
      en: "When a 4:1 MUX implements a 3-variable function, what may the data pins be tied to?",
    },
    options: [
      { id: "a", label: { th: "ตัวแปรที่ใช้เป็น control เท่านั้น", en: "Only the variables used as controls" }, why: { th: "ผิด — ตัวแปร control ต่ออยู่ที่ขา select แล้ว", en: "Wrong — the control variables are already wired to the select pins." } },
      { id: "b", label: { th: "ต่อกับ output ของ MUX ตัวอื่นเท่านั้น", en: "Only to another MUX's output" }, why: { th: "ผิด — เป็นการต่อแบบ cascade ซึ่งไม่จำเป็นในโจทย์นี้", en: "Wrong — that is cascading, unnecessary here." } },
      { id: "c", label: { th: "0, 1, A หรือ A' (ตัวแปรที่เหลือ)", en: "0, 1, A, or A' — the leftover variable" }, why: { th: "ถูกต้อง — 4 กรณีจากผลลัพธ์เมื่อ A=0/A=1: (0,0)→0 (1,1)→1 (0,1)→A (1,0)→A'", en: "Correct — the four cases of (output at A=0, output at A=1): (0,0)→0, (1,1)→1, (0,1)→A, (1,0)→A'." } },
      { id: "d", label: { th: "0 กับ 1 เท่านั้น", en: "Only 0 and 1" }, why: { th: "ผิด — เป็นกับดักที่ 18 ถ้าต่อได้แค่ 0/1 จะสร้างฟังก์ชันได้แค่ 2 ตัวแปร", en: "Wrong — pitfall #18; with only 0/1 a 4:1 MUX could implement just 2 variables." } },
    ],
    correctId: "c",
    sourceRef: "summarize.md §6.2, §กับดัก 18",
  },
  {
    id: "ics-q47",
    kind: "mcq",
    chapter: 6,
    prompt: {
      th: "โจทย์บอกว่า \"ใช้ A และ B เป็น control inputs\" ต้องต่อขา select อย่างไร",
      en: "The problem says \"use A and B as control inputs.\" How are the select pins wired?",
    },
    options: [
      { id: "a", label: { th: "ต่อ A และ B เข้าที่ขา data", en: "Wire A and B to the data pins" }, why: { th: "ผิด — control ต้องต่อที่ขา select ส่วนตัวแปรที่เหลือจึงไปอยู่ที่ขา data", en: "Wrong — controls go to the select pins; the leftover variable goes to the data pins." } },
      { id: "b", label: { th: "ต่ออย่างไรก็ได้ ผลลัพธ์เหมือนกัน", en: "Either way works; the result is the same" }, why: { th: "ผิด — ลำดับเปลี่ยนการจับคู่ระหว่างช่องตารางกับขา data", en: "Wrong — the order changes which truth-table rows map to which data pin." } },
      { id: "c", label: { th: "A = S1 (MSB), B = S0 (LSB)", en: "A = S1 (MSB), B = S0 (LSB)" }, why: { th: "ถูกต้อง — ตัวแรกที่โจทย์ระบุคือ MSB เสมอ", en: "Correct — the first variable named is always the MSB." } },
      { id: "d", label: { th: "A = S0, B = S1", en: "A = S0, B = S1" }, why: { th: "ผิด — เป็นกับดักที่ 19 สลับลำดับทำให้ I1 กับ I2 สลับกันทั้งข้อ", en: "Wrong — pitfall #19; swapping the order swaps I1 and I2 throughout." } },
    ],
    correctId: "c",
    sourceRef: "summarize.md §6.2, §กับดัก 19",
  },
  {
    id: "ics-q48",
    kind: "mcq",
    chapter: 6,
    prompt: {
      th: "ถ้าคู่ control หนึ่ง ให้ output = 1 เมื่อ A = 0 และ output = 0 เมื่อ A = 1 ขา data นั้นต้องต่อกับอะไร",
      en: "For one control combination, output = 1 when A = 0 and 0 when A = 1. What goes on that data pin?",
    },
    options: [
      { id: "a", label: { th: "A'", en: "A'" }, why: { th: "ถูกต้อง — output เป็นค่าตรงข้ามของ A จึงต่อ A ผ่าน inverter", en: "Correct — the output is the inverse of A, so route A through an inverter." } },
      { id: "b", label: { th: "A", en: "A" }, why: { th: "ผิด — A ใช้เมื่อ output ตามค่า A (0→0, 1→1)", en: "Wrong — plain A is for when the output follows A (0→0, 1→1)." } },
      { id: "c", label: { th: "1 (VCC)", en: "1 (VCC)" }, why: { th: "ผิด — ใช้เมื่อ output เป็น 1 ทั้งสองกรณี", en: "Wrong — that is for output = 1 in both cases." } },
      { id: "d", label: { th: "0 (GND)", en: "0 (GND)" }, why: { th: "ผิด — ใช้เมื่อ output เป็น 0 ทั้งสองกรณี", en: "Wrong — that is for output = 0 in both cases." } },
    ],
    correctId: "a",
    sourceRef: "summarize.md §6.2",
  },
  {
    id: "ics-q49",
    kind: "mcq",
    chapter: 6,
    prompt: {
      th: "จากตารางความจริง F(A,B,C) = 1,0,1,1,0,0,0,1 (เรียงตาม ABC = 000..111) ถ้าใช้ A,B เป็น control ขา I0–I3 ต้องต่อกับอะไร",
      en: "Given F(A,B,C) = 1,0,1,1,0,0,0,1 for ABC = 000..111, using A,B as controls, what goes on I0–I3?",
    },
    snippet: "AB=00: C=0→1, C=1→0\nAB=01: C=0→1, C=1→1\nAB=10: C=0→0, C=1→0\nAB=11: C=0→0, C=1→1",
    options: [
      { id: "a", label: { th: "I0 = C, I1 = 1, I2 = 0, I3 = C'", en: "I0 = C, I1 = 1, I2 = 0, I3 = C'" }, why: { th: "ผิด — สลับ C กับ C' ที่ I0 และ I3", en: "Wrong — C and C' are swapped between I0 and I3." } },
      { id: "b", label: { th: "I0 = C', I1 = 0, I2 = 1, I3 = C", en: "I0 = C', I1 = 0, I2 = 1, I3 = C" }, why: { th: "ผิด — สลับ I1 กับ I2 ซึ่งเกิดจากต่อ control กลับลำดับ (B เป็น MSB)", en: "Wrong — I1 and I2 are swapped, the symptom of wiring B as the MSB." } },
      { id: "c", label: { th: "I0 = 1, I1 = 1, I2 = 0, I3 = 1", en: "I0 = 1, I1 = 1, I2 = 0, I3 = 1" }, why: { th: "ผิด — พยายามใส่แค่ 0/1 ทั้งที่ AB=00 และ AB=11 ขึ้นกับค่า C", en: "Wrong — forcing 0/1 only, even though AB=00 and AB=11 depend on C." } },
      { id: "d", label: { th: "I0 = C', I1 = 1, I2 = 0, I3 = C", en: "I0 = C', I1 = 1, I2 = 0, I3 = C" }, why: { th: "ถูกต้อง — AB=00 กลับค่า C จึงเป็น C', AB=01 เป็น 1 ทั้งคู่, AB=10 เป็น 0 ทั้งคู่, AB=11 ตามค่า C", en: "Correct — AB=00 inverts C, AB=01 is always 1, AB=10 is always 0, and AB=11 follows C." } },
    ],
    correctId: "d",
    sourceRef: "midterm-exam.md เฉลยข้อ 6",
  },
  {
    id: "ics-q50",
    kind: "mcq",
    chapter: 6,
    prompt: {
      th: "สมการของ 4:1 MUX คือข้อใด",
      en: "Which equation describes a 4:1 MUX?",
    },
    options: [
      { id: "a", label: { th: "F = S1'S0'·I3 + S1'S0·I2 + S1S0'·I1 + S1S0·I0", en: "F = S1'S0'·I3 + S1'S0·I2 + S1S0'·I1 + S1S0·I0" }, why: { th: "ผิด — จับคู่ขา data กลับด้าน", en: "Wrong — the data pins are mapped in reverse." } },
      { id: "b", label: { th: "F = (I0 + I1 + I2 + I3)·S1S0", en: "F = (I0 + I1 + I2 + I3)·S1S0" }, why: { th: "ผิด — MUX เลือกมาเพียงขาเดียว ไม่ได้ OR ทุกขาเข้าด้วยกัน", en: "Wrong — a MUX selects one pin; it does not OR them all." } },
      { id: "c", label: { th: "F = I0 ⊕ I1 ⊕ I2 ⊕ I3", en: "F = I0 ⊕ I1 ⊕ I2 ⊕ I3" }, why: { th: "ผิด — นั่นคือวงจร parity ไม่ใช่ MUX", en: "Wrong — that is a parity circuit, not a MUX." } },
      { id: "d", label: { th: "F = S1'S0'·I0 + S1'S0·I1 + S1S0'·I2 + S1S0·I3", en: "F = S1'S0'·I0 + S1'S0·I1 + S1S0'·I2 + S1S0·I3" }, why: { th: "ถูกต้อง — แต่ละเทอมคือ minterm ของ select คูณกับขา data ที่ตรงกัน มีเพียงเทอมเดียวเป็น 1 ในเวลาหนึ่ง", en: "Correct — each term is a select minterm ANDed with its data pin; exactly one term is active at a time." } },
    ],
    correctId: "d",
    sourceRef: "summarize.md §6.1",
  },
];
