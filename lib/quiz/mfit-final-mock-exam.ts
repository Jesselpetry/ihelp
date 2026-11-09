import type { QuizQuestion } from "@/lib/quiz/quiz";
import type { LText } from "@/lib/i18n";

export const MFIT_FINAL_MOCK_QUIZ_ID = 900015;

export interface MfitPillar {
  pillar: number;
  name: LText;
  chapterRange: string;
  questionCount: number;
  pointsEst: string;
}

export const MFIT_FINAL_PILLARS: MfitPillar[] = [
  {
    pillar: 1,
    name: { th: "เสาที่ 1: ลิมิตและความต่อเนื่อง", en: "Pillar 1: Limits & Continuity" },
    chapterRange: "Week 08 (Calc-01)",
    questionCount: 5,
    pointsEst: "~4–5 คะแนน",
  },
  {
    pillar: 2,
    name: { th: "เสาที่ 2: อนุพันธ์และกฎลูกโซ่", en: "Pillar 2: Derivatives & Chain Rule" },
    chapterRange: "Week 09–10 (Calc-02, 03)",
    questionCount: 5,
    pointsEst: "~6–8 คะแนน",
  },
  {
    pillar: 3,
    name: { th: "เสาที่ 3: การประยุกต์อนุพันธ์ & ค่าสุดขีด", en: "Pillar 3: Optimization & Extrema" },
    chapterRange: "Week 11 (Calc-04)",
    questionCount: 5,
    pointsEst: "~7–8 คะแนน",
  },
  {
    pillar: 4,
    name: { th: "เสาที่ 4: ปริพันธ์ & การเปลี่ยนตัวแปร", en: "Pillar 4: Indefinite & Definite Integrals" },
    chapterRange: "Week 12–13 (Calc-05, 06)",
    questionCount: 5,
    pointsEst: "~7–8 คะแนน",
  },
  {
    pillar: 5,
    name: { th: "เสาที่ 5: By Parts & พื้นที่/ปริมาตร", en: "Pillar 5: By Parts, Area & Volume" },
    chapterRange: "Week 14–15 (Calc-07, 08)",
    questionCount: 5,
    pointsEst: "~7–8 คะแนน",
  },
];

export const MFIT_FINAL_MOCK_EXAM: QuizQuestion[] = [
  // ════════════════════════════════════════════════════════════════════════════
  // ── เสาที่ 1: ลิมิตและความต่อเนื่อง (Chapter 8 / Week 8) ────────────────────
  // ════════════════════════════════════════════════════════════════════════════
  {
    id: "mfit-fin-001",
    kind: "mcq",
    chapter: 8,
    prompt: {
      th: "จงหาค่าของลิมิต $\\lim_{x \\to 2} \\frac{x^2 - 4}{x^2 - x - 2}$",
      en: "Evaluate the limit $\\lim_{x \\to 2} \\frac{x^2 - 4}{x^2 - x - 2}$",
    },
    options: [
      {
        id: "a",
        label: { th: "$\\frac{4}{3}$", en: "$\\frac{4}{3}$" },
        why: { th: "ถูกต้อง — แยกตัวประกอบ $(x-2)$ แล้วตัดทอนได้ $\\frac{4}{3}$", en: "Correct" },
      },
      {
        id: "b",
        label: { th: "$4$", en: "$4$" },
        why: { th: "ไม่ถูกต้อง — ลืมแทนค่าตัวส่วน $x+1$", en: "Incorrect" },
      },
      {
        id: "c",
        label: { th: "$0$", en: "$0$" },
        why: { th: "ไม่ถูกต้อง — เกิดจากแทน $x=2$ บนเศษอย่างเดียวโดยไม่ได้คำนวณ", en: "Incorrect" },
      },
      {
        id: "d",
        label: { th: "หาค่าไม่ได้ (Does Not Exist)", en: "Does Not Exist" },
        why: { th: "ไม่ถูกต้อง — รูปแบบ $\\frac{0}{0}$ ต้องแยกตัวประกอบก่อน", en: "Incorrect" },
      },
    ],
    correctId: "a",
    explanationMd: "**ข้อ A ถูกต้อง ($\\frac{4}{3}$)**\n\n**ขั้นตอนการคำนวณ:**\n1. แทนค่า $x = 2$ พบว่าอยู่ในรูปแบบไม่กำหนด $\\frac{0}{0}$\n2. แยกตัวประกอบทั้งเศษและส่วน:\n   $$\\frac{x^2 - 4}{x^2 - x - 2} = \\frac{(x - 2)(x + 2)}{(x - 2)(x + 1)}$$\n3. ตัดทอนพจน์ $(x - 2)$ ที่ทำให้เกิด $\\frac{0}{0}$ ออก:\n   $$\\lim_{x \\to 2} \\frac{x + 2}{x + 1} = \\frac{2 + 2}{2 + 1} = \\frac{4}{3}$$\n\n*(หรือใช้กฎโลปิตาล L'Hôpital: $\\lim_{x\\to 2}\\frac{2x}{2x-1} = \\frac{4}{3}$)*",
    sourceRef: "Week 08 · Limits Form 0/0",
  },
  {
    id: "mfit-fin-002",
    kind: "mcq",
    chapter: 8,
    prompt: {
      th: "จงหาค่าของลิมิต $\\lim_{x \\to 0} \\frac{\\sqrt{x + 9} - 3}{x}$",
      en: "Evaluate the limit $\\lim_{x \\to 0} \\frac{\\sqrt{x + 9} - 3}{x}$",
    },
    options: [
      {
        id: "a",
        label: { th: "$\\frac{1}{6}$", en: "$\\frac{1}{6}$" },
        why: { th: "ถูกต้อง — คูณด้วยสังยุค (Conjugate) $\\sqrt{x+9}+3$", en: "Correct" },
      },
      {
        id: "b",
        label: { th: "$\\frac{1}{3}$", en: "$\\frac{1}{3}$" },
        why: { th: "ไม่ถูกต้อง — ลืมคูณส่วนด้วย 2 เท่าของราก", en: "Incorrect" },
      },
      {
        id: "c",
        label: { th: "$0$", en: "$0$" },
        why: { th: "ไม่ถูกต้อง — รูปแบบ $\\frac{0}{0}$ ต้องจัดรูปก่อน", en: "Incorrect" },
      },
      {
        id: "d",
        label: { th: "$\\frac{1}{9}$", en: "$\\frac{1}{9}$" },
        why: { th: "ไม่ถูกต้อง — คำนวณค่าตัวส่วนผิดพลาด", en: "Incorrect" },
      },
    ],
    correctId: "a",
    explanationMd: "**ข้อ A ถูกต้อง ($\\frac{1}{6}$)**\n\n**ขั้นตอนการคำนวณ:**\n1. แทน $x=0$ ได้ $\\frac{\\sqrt{9}-3}{0} = \\frac{0}{0}$\n2. คูณด้วยสังยุค (Conjugate) ทั้งเศษและส่วน:\n   $$\\lim_{x \\to 0} \\frac{(\\sqrt{x + 9} - 3)(\\sqrt{x + 9} + 3)}{x(\\sqrt{x + 9} + 3)}$$\n3. ใช้สูตรผลต่างกำลังสอง $(a-b)(a+b) = a^2 - b^2$:\n   $$\\lim_{x \\to 0} \\frac{(x + 9) - 9}{x(\\sqrt{x + 9} + 3)} = \\lim_{x \\to 0} \\frac{x}{x(\\sqrt{x + 9} + 3)} = \\lim_{x \\to 0} \\frac{1}{\\sqrt{x + 9} + 3}$$\n4. แทนค่า $x = 0$:\n   $$\\frac{1}{\\sqrt{9} + 3} = \\frac{1}{3 + 3} = \\frac{1}{6}$$",
    sourceRef: "Week 08 · Conjugate Method",
  },
  {
    id: "mfit-fin-003",
    kind: "mcq",
    chapter: 8,
    prompt: {
      th: "กำหนด $f(x) = \\frac{|x - 4|}{x - 4}$ ข้อใดระบุค่าลิมิตทางซ้าย $\\lim_{x \\to 4^-} f(x)$ และลิมิตทางขวา $\\lim_{x \\to 4^+} f(x)$ ได้ถูกต้อง",
      en: "Given $f(x) = \\frac{|x - 4|}{x - 4}$, evaluate $\\lim_{x \\to 4^-} f(x)$ and $\\lim_{x \\to 4^+} f(x)$",
    },
    options: [
      {
        id: "a",
        label: { th: "ทางซ้าย $= -1$ และ ทางขวา $= 1$", en: "Left $= -1$ and Right $= 1$" },
        why: { th: "ถูกต้อง — ค่าสัมบูรณ์ให้ผลต่างกันตามเครื่องหมายของ $(x-4)$", en: "Correct" },
      },
      {
        id: "b",
        label: { th: "ทางซ้าย $= 1$ และ ทางขวา $= -1$", en: "Left $= 1$ and Right $= -1$" },
        why: { th: "ไม่ถูกต้อง — สลับเครื่องหมาย", en: "Incorrect" },
      },
      {
        id: "c",
        label: { th: "ทั้งสองข้างเท่ากับ $1$", en: "Both equal $1$" },
        why: { th: "ไม่ถูกต้อง — ค่าสัมบูรณ์เมื่อ $x < 4$ จะได้ $-(x-4)$", en: "Incorrect" },
      },
      {
        id: "d",
        label: { th: "ทั้งสองข้างเท่ากับ $0$", en: "Both equal $0$" },
        why: { th: "ไม่ถูกต้อง — ผลหารของจำนวนเท่ากันไม่เท่ากับ 0", en: "Incorrect" },
      },
    ],
    correctId: "a",
    explanationMd: "**ข้อ A ถูกต้อง (ทางซ้าย $= -1$, ทางขวา $= 1$)**\n\n**ขั้นตอนการวิเคราะห์:**\n1. ตามนิยามของค่าสัมบูรณ์:\n   $$|x - 4| = \\begin{cases} x - 4, & x > 4 \\\\ -(x - 4), & x < 4 \\end{cases}$$\n2. ลิมิตทางซ้าย ($x \\to 4^-$ หมายถึง $x < 4$):\n   $$\\lim_{x \\to 4^-} \\frac{-(x - 4)}{x - 4} = -1$$\n3. ลิมิตทางขวา ($x \\to 4^+$ หมายถึง $x > 4$):\n   $$\\lim_{x \\to 4^+} \\frac{x - 4}{x - 4} = 1$$\n\n*(สรุป: เนื่องจากลิมิตซ้าย $\\ne$ ลิมิตขวา ดังนั้น $\\lim_{x \\to 4} f(x)$ จึงหาค่าไม่ได้)*",
    sourceRef: "Week 08 · One-Sided Limits & Absolute Value",
  },
  {
    id: "mfit-fin-004",
    kind: "mcq",
    chapter: 8,
    prompt: {
      th: "กำหนด $f(x) = \\begin{cases} kx^2 + 2x, & x \\le 2 \\\\ 3x + k, & x > 2 \\end{cases}$ ฟังก์ชัน $f(x)$ จะมีความต่อเนื่องที่ $x = 2$ เมื่อค่าคงที่ $k$ เท่ากับข้อใด",
      en: "Let $f(x) = \\begin{cases} kx^2 + 2x, & x \\le 2 \\\\ 3x + k, & x > 2 \\end{cases}$. For $f(x)$ to be continuous at $x = 2$, what is the value of $k$?",
    },
    options: [
      {
        id: "a",
        label: { th: "$\\frac{2}{3}$", en: "$\\frac{2}{3}$" },
        why: { th: "ถูกต้อง — แก้สมการ $4k + 4 = 6 + k$", en: "Correct" },
      },
      {
        id: "b",
        label: { th: "$2$", en: "$2$" },
        why: { th: "ไม่ถูกต้อง — คำนวณสัมประสิทธิ์ผิดพลาด", en: "Incorrect" },
      },
      {
        id: "c",
        label: { th: "$-\\frac{2}{3}$", en: "$-\\frac{2}{3}$" },
        why: { th: "ไม่ถูกต้อง — เครื่องหมายคลาดเคลื่อนในการย้ายข้าง", en: "Incorrect" },
      },
      {
        id: "d",
        label: { th: "$1$", en: "$1$" },
        why: { th: "ไม่ถูกต้อง", en: "Incorrect" },
      },
    ],
    correctId: "a",
    explanationMd: "**ข้อ A ถูกต้อง ($k = \\frac{2}{3}$)**\n\n**เงื่อนไขความต่อเนื่อง 3 ประการที่ $x = 2$:**\n1. $f(2)$ มีค่า: $f(2) = k(2)^2 + 2(2) = 4k + 4$\n2. ลิมิตซ้าย: $\\lim_{x \\to 2^-} f(x) = 4k + 4$\n3. ลิมิตขวา: $\\lim_{x \\to 2^+} f(x) = 3(2) + k = 6 + k$\n4. สำหรับความต่อเนื่อง ลิมิตซ้ายต้องเท่ากับลิมิตขวา:\n   $$4k + 4 = 6 + k \\implies 3k = 2 \\implies k = \\frac{2}{3}$$",
    sourceRef: "Week 08 · Continuity Conditions",
  },
  {
    id: "mfit-fin-005",
    kind: "mcq",
    chapter: 8,
    prompt: {
      th: "จงหาค่าของลิมิต $\\lim_{x \\to 0} \\frac{\\sin(4x)}{5x}$",
      en: "Evaluate the limit $\\lim_{x \\to 0} \\frac{\\sin(4x)}{5x}$",
    },
    options: [
      {
        id: "a",
        label: { th: "$\\frac{4}{5}$", en: "$\\frac{4}{5}$" },
        why: { th: "ถูกต้อง — อ้างอิงสูตรหลัก $\\lim_{\\theta \\to 0}\\frac{\\sin \\theta}{\\theta} = 1$", en: "Correct" },
      },
      {
        id: "b",
        label: { th: "$\\frac{5}{4}$", en: "$\\frac{5}{4}$" },
        why: { th: "ไม่ถูกต้อง — สลับเศษส่วน", en: "Incorrect" },
      },
      {
        id: "c",
        label: { th: "$1$", en: "$1$" },
        why: { th: "ไม่ถูกต้อง — ละเลยสัมประสิทธิ์หน้าตัวแปร $x$", en: "Incorrect" },
      },
      {
        id: "d",
        label: { th: "$0$", en: "$0$" },
        why: { th: "ไม่ถูกต้อง", en: "Incorrect" },
      },
    ],
    correctId: "a",
    explanationMd: "**ข้อ A ถูกต้อง ($\\frac{4}{5}$)**\n\n**ขั้นตอนการคำนวณ:**\n1. จัดรูปโดยใช้สูตรพื้นฐาน $\\lim_{u \\to 0} \\frac{\\sin u}{u} = 1$:\n   $$\\lim_{x \\to 0} \\frac{\\sin(4x)}{5x} = \\frac{4}{5} \\cdot \\lim_{x \\to 0} \\frac{\\sin(4x)}{4x}$$\n2. เนื่องจาก $\\lim_{x \\to 0} \\frac{\\sin(4x)}{4x} = 1$:\n   $$\\frac{4}{5} \\cdot 1 = \\frac{4}{5}$$",
    sourceRef: "Week 08 · Trigonometric Limits",
  },

  // ════════════════════════════════════════════════════════════════════════════
  // ── เสาที่ 2: อนุพันธ์และกฎลูกโซ่ (Chapters 9, 10 / Week 9–10) ───────────────
  // ════════════════════════════════════════════════════════════════════════════
  {
    id: "mfit-fin-006",
    kind: "mcq",
    chapter: 9,
    prompt: {
      th: "ถ้า $f(x) = 2x^2 - 3x$ จงหา $f'(x)$ โดยใช้นิยามลิมิตของอนุพันธ์ $f'(x) = \\lim_{h \\to 0} \\frac{f(x + h) - f(x)}{h}$",
      en: "If $f(x) = 2x^2 - 3x$, find $f'(x)$ using the limit definition of derivative.",
    },
    options: [
      {
        id: "a",
        label: { th: "$4x - 3$", en: "$4x - 3$" },
        why: { th: "ถูกต้อง — กระจายพจน์ $2(x+h)^2$ แล้วตัด $h$", en: "Correct" },
      },
      {
        id: "b",
        label: { th: "$4x + 3$", en: "$4x + 3$" },
        why: { th: "ไม่ถูกต้อง — เครื่องหมายพจน์หลังผิด", en: "Incorrect" },
      },
      {
        id: "c",
        label: { th: "$2x - 3$", en: "$2x - 3$" },
        why: { th: "ไม่ถูกต้อง — ลืมคูณ 2 จากเลขชี้กำลัง", en: "Incorrect" },
      },
      {
        id: "d",
        label: { th: "$4x$", en: "$4x$" },
        why: { th: "ไม่ถูกต้อง — ขาดอนุพันธ์ของ $-3x$", en: "Incorrect" },
      },
    ],
    correctId: "a",
    explanationMd: "**ข้อ A ถูกต้อง ($4x - 3$)**\n\n**ขั้นตอนการคำนวณตามนิยามลิมิต:**\n1. หา $f(x + h)$:\n   $$f(x + h) = 2(x + h)^2 - 3(x + h) = 2(x^2 + 2xh + h^2) - 3x - 3h = 2x^2 + 4xh + 2h^2 - 3x - 3h$$\n2. หา $f(x + h) - f(x)$:\n   $$(2x^2 + 4xh + 2h^2 - 3x - 3h) - (2x^2 - 3x) = 4xh + 2h^2 - 3h$$\n3. หารด้วย $h$:\n   $$\\frac{h(4x + 2h - 3)}{h} = 4x + 2h - 3$$\n4. เทคลิมิตเมื่อ $h \\to 0$:\n   $$\\lim_{h \\to 0} (4x + 2h - 3) = 4x - 3$$",
    sourceRef: "Week 09 · Limit Definition of Derivative",
  },
  {
    id: "mfit-fin-007",
    kind: "mcq",
    chapter: 9,
    prompt: {
      th: "จงหาอนุพันธ์ของ $f(x) = \\frac{3x - 2}{x^2 + 1}$ โดยใช้กฎผลหาร (Quotient Rule)",
      en: "Find the derivative of $f(x) = \\frac{3x - 2}{x^2 + 1}$ using the Quotient Rule.",
    },
    options: [
      {
        id: "a",
        label: { th: "$\\frac{-3x^2 + 4x + 3}{(x^2 + 1)^2}$", en: "$\\frac{-3x^2 + 4x + 3}{(x^2 + 1)^2}$" },
        why: { th: "ถูกต้อง — ใช้ $\\frac{v u' - u v'}{v^2}$ อย่างถูกต้อง", en: "Correct" },
      },
      {
        id: "b",
        label: { th: "$\\frac{3x^2 + 4x - 3}{(x^2 + 1)^2}$", en: "$\\frac{3x^2 + 4x - 3}{(x^2 + 1)^2}$" },
        why: { th: "ไม่ถูกต้อง — เครื่องหมายกลับกัน", en: "Incorrect" },
      },
      {
        id: "c",
        label: { th: "$\\frac{3}{2x}$", en: "$\\frac{3}{2x}$" },
        why: { th: "ไม่ถูกต้อง — ดิฟเศษส่วนแบบแยกบน-ล่างไม่ได้!", en: "Incorrect" },
      },
      {
        id: "d",
        label: { th: "$\\frac{-3x^2 - 4x + 3}{(x^2 + 1)^2}$", en: "$\\frac{-3x^2 - 4x + 3}{(x^2 + 1)^2}$" },
        why: { th: "ไม่ถูกต้อง — กระจายเครื่องหมายลบหน้า $(3x-2)(2x)$ ผิด", en: "Incorrect" },
      },
    ],
    correctId: "a",
    explanationMd: "**ข้อ A ถูกต้อง ($\\frac{-3x^2 + 4x + 3}{(x^2 + 1)^2}$)**\n\n**ขั้นตอนการคำนวณ:**\n1. กำหนด $u = 3x - 2 \\implies u' = 3$ และ $v = x^2 + 1 \\implies v' = 2x$\n2. ใช้สูตรกฎผลหาร $\\left(\\frac{u}{v}\\right)' = \\frac{v u' - u v'}{v^2}$:\n   $$f'(x) = \\frac{(x^2 + 1)(3) - (3x - 2)(2x)}{(x^2 + 1)^2}$$\n3. กระจายพจน์:\n   $$f'(x) = \\frac{3x^2 + 3 - (6x^2 - 4x)}{(x^2 + 1)^2} = \\frac{3x^2 + 3 - 6x^2 + 4x}{(x^2 + 1)^2} = \\frac{-3x^2 + 4x + 3}{(x^2 + 1)^2}$$",
    sourceRef: "Week 09 · Quotient Rule",
  },
  {
    id: "mfit-fin-008",
    kind: "mcq",
    chapter: 10,
    prompt: {
      th: "ถ้า $y = (2x^3 - 5x + 4)^5$ จงหาค่าของ $\\frac{dy}{dx}$ ที่จุด $x = 1$",
      en: "If $y = (2x^3 - 5x + 4)^5$, find the value of $\\frac{dy}{dx}$ at $x = 1$.",
    },
    options: [
      {
        id: "a",
        label: { th: "$5$", en: "$5$" },
        why: { th: "ถูกต้อง — $5(1)^4 \\cdot (6(1)^2 - 5) = 5$", en: "Correct" },
      },
      {
        id: "b",
        label: { th: "$25$", en: "$25$" },
        why: { th: "ไม่ถูกต้อง — ลืมคูณอนุพันธ์ไส้ใน", en: "Incorrect" },
      },
      {
        id: "c",
        label: { th: "$1$", en: "$1$" },
        why: { th: "ไม่ถูกต้อง", en: "Incorrect" },
      },
      {
        id: "d",
        label: { th: "$0$", en: "$0$" },
        why: { th: "ไม่ถูกต้อง", en: "Incorrect" },
      },
    ],
    correctId: "a",
    explanationMd: "**ข้อ A ถูกต้อง ($5$)**\n\n**ขั้นตอนการคำนวณด้วยกฎลูกโซ่ (Chain Rule):**\n1. ให้ $u = 2x^3 - 5x + 4 \\implies y = u^5$\n2. $\\frac{dy}{dx} = 5u^4 \\cdot \\frac{du}{dx} = 5(2x^3 - 5x + 4)^4 \\cdot (6x^2 - 5)$\n3. แทนค่า $x = 1$:\n   - ไส้ใน: $u(1) = 2(1)^3 - 5(1) + 4 = 1$\n   - อนุพันธ์ไส้ใน: $6(1)^2 - 5 = 1$\n   - ผลลัพธ์: $\\frac{dy}{dx}\\Big|_{x=1} = 5(1)^4 \\cdot (1) = 5$",
    sourceRef: "Week 10 · Chain Rule",
  },
  {
    id: "mfit-fin-009",
    kind: "mcq",
    chapter: 10,
    prompt: {
      th: "กำหนดสมการวงกลม $x^2 + y^2 = 25$ จงหาความชัน $\\frac{dy}{dx}$ ที่จุด $(3, 4)$ โดยใช้อนุพันธ์ฟังก์ชันแฝง (Implicit Differentiation)",
      en: "Find the slope $\\frac{dy}{dx}$ of the circle $x^2 + y^2 = 25$ at point $(3, 4)$ using Implicit Differentiation.",
    },
    options: [
      {
        id: "a",
        label: { th: "$-\\frac{3}{4}$", en: "$-\\frac{3}{4}$" },
        why: { th: "ถูกต้อง — $2x + 2y y' = 0 \\implies y' = -\\frac{x}{y} = -\\frac{3}{4}$", en: "Correct" },
      },
      {
        id: "b",
        label: { th: "$\\frac{3}{4}$", en: "$\\frac{3}{4}$" },
        why: { th: "ไม่ถูกต้อง — ลืมเครื่องหมายลบจากการย้ายข้าง", en: "Incorrect" },
      },
      {
        id: "c",
        label: { th: "$-\\frac{4}{3}$", en: "$-\\frac{4}{3}$" },
        why: { th: "ไม่ถูกต้อง — สลับเศษส่วนเป็น $-\\frac{y}{x}$", en: "Incorrect" },
      },
      {
        id: "d",
        label: { th: "$\\frac{4}{3}$", en: "$\\frac{4}{3}$" },
        why: { th: "ไม่ถูกต้อง", en: "Incorrect" },
      },
    ],
    correctId: "a",
    explanationMd: "**ข้อ A ถูกต้อง ($-\\frac{3}{4}$)**\n\n**ขั้นตอนการคำนวณ:**\n1. เทกอนุพันธ์เทียบกับ $x$ ทั้งสองข้างของสมการ:\n   $$\\frac{d}{dx}[x^2] + \\frac{d}{dx}[y^2] = \\frac{d}{dx}[25]$$\n2. ใช้กฎลูกโซ่กับพจน์ $y^2$ (ห้อย $\\frac{dy}{dx}$ เสมอ):\n   $$2x + 2y \\frac{dy}{dx} = 0$$\n3. จัดรูปหา $\\frac{dy}{dx}$:\n   $$2y \\frac{dy}{dx} = -2x \\implies \\frac{dy}{dx} = -\\frac{x}{y}$$\n4. แทนค่าพิกัด $(x, y) = (3, 4)$:\n   $$\\frac{dy}{dx} = -\\frac{3}{4}$$",
    sourceRef: "Week 10 · Implicit Differentiation",
  },
  {
    id: "mfit-fin-010",
    kind: "mcq",
    chapter: 10,
    prompt: {
      th: "จงหาสมการของเส้นสัมผัสเส้นโค้ง $y = x^3 - 4x + 3$ ที่จุด $x = 2$",
      en: "Find the equation of the tangent line to the curve $y = x^3 - 4x + 3$ at $x = 2$.",
    },
    options: [
      {
        id: "a",
        label: { th: "$y = 8x - 13$", en: "$y = 8x - 13$" },
        why: { th: "ถูกต้อง — ความชัน $m = 8$ ผ่านจุด $(2, 3)$", en: "Correct" },
      },
      {
        id: "b",
        label: { th: "$y = 8x + 3$", en: "$y = 8x + 3$" },
        why: { th: "ไม่ถูกต้อง — คำนวณจุดตัดแกน Y ผิด", en: "Incorrect" },
      },
      {
        id: "c",
        label: { th: "$y = 4x - 5$", en: "$y = 4x - 5$" },
        why: { th: "ไม่ถูกต้อง — คำนวณความชันผิดพลาด", en: "Incorrect" },
      },
      {
        id: "d",
        label: { th: "$y = 8x - 19$", en: "$y = 8x - 19$" },
        why: { th: "ไม่ถูกต้อง — เครื่องหมายในการแทนพิกัดผิด", en: "Incorrect" },
      },
    ],
    correctId: "a",
    explanationMd: "**ข้อ A ถูกต้อง ($y = 8x - 13$)**\n\n**ขั้นตอนการคำนวณ:**\n1. หาพิกัด $y$ ที่ $x = 2$:\n   $$y = 2^3 - 4(2) + 3 = 8 - 8 + 3 = 3 \\implies \\text{จุดสัมผัสคือ } (2, 3)$$\n2. หาความชันเส้นสัมผัส $m = y'(2)$:\n   $$y' = 3x^2 - 4 \\implies y'(2) = 3(2)^2 - 4 = 12 - 4 = 8$$\n3. สร้างสมการเส้นตรง $y - y_1 = m(x - x_1)$:\n   $$y - 3 = 8(x - 2) \\implies y - 3 = 8x - 16 \\implies y = 8x - 13$$",
    sourceRef: "Week 10 · Tangent Line Equations",
  },

  // ════════════════════════════════════════════════════════════════════════════
  // ── เสาที่ 3: การประยุกต์อนุพันธ์ & ค่าสุดขีด (Chapter 11 / Week 11) ──────────
  // ════════════════════════════════════════════════════════════════════════════
  {
    id: "mfit-fin-011",
    kind: "mcq",
    chapter: 11,
    prompt: {
      th: "จงหาจุดวิกฤต (Critical Numbers) ทั้งหมดของฟังก์ชัน $f(x) = 2x^3 - 3x^2 - 12x + 5$",
      en: "Find all critical numbers of the function $f(x) = 2x^3 - 3x^2 - 12x + 5$.",
    },
    options: [
      {
        id: "a",
        label: { th: "$x = 2$ และ $x = -1$", en: "$x = 2$ and $x = -1$" },
        why: { th: "ถูกต้อง — เป็นคำตอบของสมการ $6(x-2)(x+1) = 0$", en: "Correct" },
      },
      {
        id: "b",
        label: { th: "$x = -2$ และ $x = 1$", en: "$x = -2$ and $x = 1$" },
        why: { th: "ไม่ถูกต้อง — สลับเครื่องหมาย", en: "Incorrect" },
      },
      {
        id: "c",
        label: { th: "$x = 2$ เท่านั้น", en: "$x = 2$ only" },
        why: { th: "ไม่ถูกต้อง — ตกหล่นคำตอบ $x = -1$", en: "Incorrect" },
      },
      {
        id: "d",
        label: { th: "$x = 3$ และ $x = -2$", en: "$x = 3$ and $x = -2$" },
        why: { th: "ไม่ถูกต้อง — แยกตัวประกอบผิด", en: "Incorrect" },
      },
    ],
    correctId: "a",
    explanationMd: "**ข้อ A ถูกต้อง ($x = 2, -1$)**\n\n**ขั้นตอนการคำนวณ:**\n1. จุดวิกฤตคือค่า $x$ ที่ทำให้ $f'(x) = 0$ หรือ $f'(x)$ หาค่าไม่ได้\n2. หาอนุพันธ์อันดับ 1:\n   $$f'(x) = 6x^2 - 6x - 12$$\n3. ตั้งสมการ $f'(x) = 0$ และแยกตัวประกอบ:\n   $$6(x^2 - x - 2) = 0 \\implies 6(x - 2)(x + 1) = 0$$\n4. จะได้จุดวิกฤตคือ $x = 2$ และ $x = -1$",
    sourceRef: "Week 11 · Critical Numbers",
  },
  {
    id: "mfit-fin-012",
    kind: "mcq",
    chapter: 11,
    prompt: {
      th: "จงหาค่าสูงสุดสัมบูรณ์ (Absolute Maximum) ของ $f(x) = x^3 - 3x^2 + 2$ บนช่วงปิด $[0, 3]$",
      en: "Find the absolute maximum value of $f(x) = x^3 - 3x^2 + 2$ on the closed interval $[0, 3]$.",
    },
    options: [
      {
        id: "a",
        label: { th: "$2$", en: "$2$" },
        why: { th: "ถูกต้อง — เกิดขึ้นที่จุดขอบ $x=0$ และ $x=3$", en: "Correct" },
      },
      {
        id: "b",
        label: { th: "$-2$", en: "$-2$" },
        why: { th: "ไม่ถูกต้อง — $-2$ คือค่าต่ำสุดสัมบูรณ์ที่ $x = 2$", en: "Incorrect" },
      },
      {
        id: "c",
        label: { th: "$0$", en: "$0$" },
        why: { th: "ไม่ถูกต้อง", en: "Incorrect" },
      },
      {
        id: "d",
        label: { th: "$27$", en: "$27$" },
        why: { th: "ไม่ถูกต้อง", en: "Incorrect" },
      },
    ],
    correctId: "a",
    explanationMd: "**ข้อ A ถูกต้อง (ค่าสูงสุดสัมบูรณ์คือ $2$)**\n\n**ขั้นตอนการคำนวณ (Closed Interval Method):**\n1. หาจุดวิกฤต: $f'(x) = 3x^2 - 6x = 3x(x - 2) = 0 \\implies x = 0, 2$ (ทั้งสองจุดอยู่ในช่วง $[0, 3]$)\n2. คำนวณค่า $f(x)$ ที่จุดขอบและจุดวิกฤตทั้งหมด:\n   - จุดขอบซ้าย: $f(0) = 0^3 - 3(0)^2 + 2 = 2$\n   - จุดวิกฤต: $f(2) = 2^3 - 3(2)^2 + 2 = 8 - 12 + 2 = -2$\n   - จุดขอบขวา: $f(3) = 3^3 - 3(3)^2 + 2 = 27 - 27 + 2 = 2$\n3. เปรียบเทียบค่า: ค่าสูงสุดสัมบูรณ์คือ $2$ (และค่าต่ำสุดสัมบูรณ์คือ $-2$)",
    sourceRef: "Week 11 · Extreme Values on Closed Intervals",
  },
  {
    id: "mfit-fin-013",
    kind: "mcq",
    chapter: 11,
    prompt: {
      th: "สูบน้ำเข้าถังทรงกลมด้วยอัตราเร็วคงที่ $\\frac{dV}{dt} = 36\\pi\\text{ cm}^3/\\text{s}$ จงหาอัตราการเพิ่มขึ้นของรัศมี $\\frac{dr}{dt}$ ขณะที่รัศมี $r = 3\\text{ cm}$ (กำหนดปริมาตรทรงกลม $V = \\frac{4}{3}\\pi r^3$)",
      en: "Water is pumped into a spherical balloon at a rate of $\\frac{dV}{dt} = 36\\pi\\text{ cm}^3/\\text{s}$. Find $\\frac{dr}{dt}$ when $r = 3\\text{ cm}$ ($V = \\frac{4}{3}\\pi r^3$).",
    },
    options: [
      {
        id: "a",
        label: { th: "$1\\text{ cm/s}$", en: "$1\\text{ cm/s}$" },
        why: { th: "ถูกต้อง — $\\frac{dr}{dt} = \\frac{36\\pi}{4\\pi(3)^2} = 1$", en: "Correct" },
      },
      {
        id: "b",
        label: { th: "$3\\text{ cm/s}$", en: "$3\\text{ cm/s}$" },
        why: { th: "ไม่ถูกต้อง — ลืมหารด้วย $r^2$", en: "Incorrect" },
      },
      {
        id: "c",
        label: { th: "$4\\pi\\text{ cm/s}$", en: "$4\\pi\\text{ cm/s}$" },
        why: { th: "ไม่ถูกต้อง", en: "Incorrect" },
      },
      {
        id: "d",
        label: { th: "$0.5\\text{ cm/s}$", en: "$0.5\\text{ cm/s}$" },
        why: { th: "ไม่ถูกต้อง", en: "Incorrect" },
      },
    ],
    correctId: "a",
    explanationMd: "**ข้อ A ถูกต้อง ($1\\text{ cm/s}$)**\n\n**ขั้นตอนการคำนวณ (Related Rates):**\n1. เทกอนุพันธ์เทียบกับเวลา $t$ ในสูตรปริมาตร:\n   $$\\frac{d}{dt}[V] = \\frac{d}{dt}\\left[\\frac{4}{3}\\pi r^3\\right] \\implies \\frac{dV}{dt} = 4\\pi r^2 \\frac{dr}{dt}$$\n2. แทนค่า $\\frac{dV}{dt} = 36\\pi$ และ $r = 3$:\n   $$36\\pi = 4\\pi (3)^2 \\frac{dr}{dt} \\implies 36\\pi = 36\\pi \\frac{dr}{dt}$$\n3. แก้สมการได้ $\\frac{dr}{dt} = 1\\text{ cm/s}$",
    sourceRef: "Week 11 · Related Rates",
  },
  {
    id: "mfit-fin-014",
    kind: "mcq",
    chapter: 11,
    prompt: {
      th: "แผ่นกระดาษแข็งรูปสี่เหลี่ยมจัตุรัสขนาด $12 \\times 12\\text{ นิ้ว}$ ตัดมุมทั้งสี่เป็นสี่เหลี่ยมจัตุรัสยาวด้านละ $x$ นิ้ว แล้วพับขอบขึ้นเป็นกล่องเปิดฝาด้านบน ค่าของ $x$ ต้องเป็นเท่าใดเพื่อให้กล่องมีปริมาตรมากที่สุด",
      en: "A square cardboard sheet of $12 \\times 12$ inches has squares of side $x$ cut from each corner and edges folded up. Find $x$ that maximizes the volume.",
    },
    options: [
      {
        id: "a",
        label: { th: "$2\\text{ นิ้ว}$", en: "$2\\text{ inches}$" },
        why: { th: "ถูกต้อง — ให้ปริมาตรสูงสุด $128\\text{ in}^3$", en: "Correct" },
      },
      {
        id: "b",
        label: { th: "$3\\text{ นิ้ว}$", en: "$3\\text{ inches}$" },
        why: { th: "ไม่ถูกต้อง", en: "Incorrect" },
      },
      {
        id: "c",
        label: { th: "$4\\text{ นิ้ว}$", en: "$4\\text{ inches}$" },
        why: { th: "ไม่ถูกต้อง", en: "Incorrect" },
      },
      {
        id: "d",
        label: { th: "$6\\text{ นิ้ว}$", en: "$6\\text{ inches}$" },
        why: { th: "ไม่ถูกต้อง — ตัด $x=6$ กล่องจะไม่มีก้นกล่อง ($V=0$)", en: "Incorrect" },
      },
    ],
    correctId: "a",
    explanationMd: "**ข้อ A ถูกต้อง ($x = 2\\text{ นิ้ว}$)**\n\n**ขั้นตอนการสร้างโมเดล Optimization:**\n1. มิติของกล่อง:\n   - ฐานกล่องเป็นสี่เหลี่ยมจัตุรัสยาวด้านละ $12 - 2x$\n   - ความสูงของกล่องคือ $x$\n   - โดเมนของ $x$ คือ $0 < x < 6$\n2. ฟังก์ชันเป้าหมาย (ปริมาตร):\n   $$V(x) = x(12 - 2x)^2 = x(144 - 48x + 4x^2) = 4x^3 - 48x^2 + 144x$$\n3. หาอนุพันธ์และเซตเท่ากับ 0:\n   $$V'(x) = 12x^2 - 96x + 144 = 12(x^2 - 8x + 12) = 12(x - 2)(x - 6) = 0$$\n4. จะได้ $x = 2$ หรือ $x = 6$ แต่ $x = 6$ อยู่นอกโดเมนที่พับได้ ดังนั้น $x = 2\\text{ นิ้ว}$ ให้ปริมาตรสูงสุด",
    sourceRef: "Week 11 · Box Optimization",
  },
  {
    id: "mfit-fin-015",
    kind: "mcq",
    chapter: 11,
    prompt: {
      th: "ต้องการล้อมรั้วรูปสี่เหลี่ยมผืนผ้าติดริมแม่น้ำแนวตรง (ไม่ต้องล้อมรั้วด้านที่ติดแม่น้ำ) ให้มีพื้นที่ $800\\text{ ตารางเมตร}$ จงหาความยาวรั้วรวมที่น้อยที่สุดที่ต้องใช้",
      en: "A rectangular area of $800\\text{ m}^2$ is to be fenced along a straight river (no fence needed on the river side). Find the minimum length of fencing required.",
    },
    options: [
      {
        id: "a",
        label: { th: "$80\\text{ เมตร}$", en: "$80\\text{ meters}$" },
        why: { th: "ถูกต้อง — กว้าง 20 ม. (2 ด้าน) + ยาว 40 ม. (1 ด้าน) = 80 ม.", en: "Correct" },
      },
      {
        id: "b",
        label: { th: "$40\\text{ เมตร}$", en: "$40\\text{ meters}$" },
        why: { th: "ไม่ถูกต้อง — 40 ม. คือความยาวด้านเดียว", en: "Incorrect" },
      },
      {
        id: "c",
        label: { th: "$120\\text{ เมตร}$", en: "$120\\text{ meters}$" },
        why: { th: "ไม่ถูกต้อง", en: "Incorrect" },
      },
      {
        id: "d",
        label: { th: "$60\\text{ เมตร}$", en: "$60\\text{ meters}$" },
        why: { th: "ไม่ถูกต้อง", en: "Incorrect" },
      },
    ],
    correctId: "a",
    explanationMd: "**ข้อ A ถูกต้อง ($80\\text{ เมตร}$)**\n\n**ขั้นตอนการสร้างโมเดล:**\n1. ให้ $x$ เป็นความกว้าง (ล้อม 2 ด้านตั้งฉากแม่น้ำ) และ $y$ เป็นความยาว (ล้อม 1 ด้านขนานแม่น้ำ)\n2. เงื่อนไขพื้นที่ (Constraint): $x \\cdot y = 800 \\implies y = \\frac{800}{x}$\n3. ฟังก์ชันเป้าหมายคือความยาวรั้ว (Objective Function):\n   $$P(x) = 2x + y = 2x + \\frac{800}{x}$$\n4. หาอนุพันธ์และจุดวิกฤต:\n   $$P'(x) = 2 - \\frac{800}{x^2} = 0 \\implies 2x^2 = 800 \\implies x^2 = 400 \\implies x = 20\\text{ m}$$\n5. ความยาว $y = \\frac{800}{20} = 40\\text{ m}$\n6. ความยาวรั้วรวมขั้นต่ำ: $P(20) = 2(20) + 40 = 80\\text{ เมตร}$",
    sourceRef: "Week 11 · Fencing Optimization",
  },

  // ════════════════════════════════════════════════════════════════════════════
  // ── เสาที่ 4: ปริพันธ์ & การเปลี่ยนตัวแปร (Chapters 12, 13 / Week 12–13) ────────
  // ════════════════════════════════════════════════════════════════════════════
  {
    id: "mfit-fin-016",
    kind: "mcq",
    chapter: 12,
    prompt: {
      th: "จงหาค่าของปริพันธ์ไม่จำกัดเขต $\\int (9x^2 - 4x + 7)\\,dx$",
      en: "Evaluate the indefinite integral $\\int (9x^2 - 4x + 7)\\,dx$",
    },
    options: [
      {
        id: "a",
        label: { th: "$3x^3 - 2x^2 + 7x + C$", en: "$3x^3 - 2x^2 + 7x + C$" },
        why: { th: "ถูกต้อง — ใช้กฎกำลัง $\\int x^n dx = \\frac{x^{n+1}}{n+1} + C$", en: "Correct" },
      },
      {
        id: "b",
        label: { th: "$18x - 4 + C$", en: "$18x - 4 + C$" },
        why: { th: "ไม่ถูกต้อง — ข้อนี้คือการหาอนุพันธ์ ไม่ใช่อินทิเกรต!", en: "Incorrect" },
      },
      {
        id: "c",
        label: { th: "$3x^3 - 2x^2 + 7 + C$", en: "$3x^3 - 2x^2 + 7 + C$" },
        why: { th: "ไม่ถูกต้อง — ลืมคูณ $x$ กับค่าคงที่ 7", en: "Incorrect" },
      },
      {
        id: "d",
        label: { th: "$9x^3 - 4x^2 + 7x + C$", en: "$9x^3 - 4x^2 + 7x + C$" },
        why: { th: "ไม่ถูกต้อง — ลืมหารด้วยเลขชี้กำลังใหม่", en: "Incorrect" },
      },
    ],
    correctId: "a",
    explanationMd: "**ข้อ A ถูกต้อง ($3x^3 - 2x^2 + 7x + C$)**\n\n**ขั้นตอนการคำนวณ:**\n1. ใช้นิยามของปริพันธ์ไม่จำกัดเขต:\n   $$\\int (9x^2 - 4x + 7)\\,dx = 9\\left(\\frac{x^3}{3}\\right) - 4\\left(\\frac{x^2}{2}\\right) + 7x + C$$\n2. ตัดทอนสัมประสิทธิ์:\n   $$= 3x^3 - 2x^2 + 7x + C$$\n\n*(จุดเตือน: ปริพันธ์ไม่จำกัดเขตต้องมี $+ C$ เสมอ)*",
    sourceRef: "Week 12 · Indefinite Integrals",
  },
  {
    id: "mfit-fin-017",
    kind: "mcq",
    chapter: 12,
    prompt: {
      th: "จงหาค่าของ $\\int 3x^2 (x^3 + 2)^5\\,dx$ โดยใช้วิธีการเปลี่ยนตัวแปร ($u$-Substitution)",
      en: "Evaluate $\\int 3x^2 (x^3 + 2)^5\\,dx$ using $u$-Substitution.",
    },
    options: [
      {
        id: "a",
        label: { th: "$\\frac{(x^3 + 2)^6}{6} + C$", en: "$\\frac{(x^3 + 2)^6}{6} + C$" },
        why: { th: "ถูกต้อง — ให้ $u = x^3+2 \\implies du = 3x^2 dx$", en: "Correct" },
      },
      {
        id: "b",
        label: { th: "$\\frac{(x^3 + 2)^6}{18} + C$", en: "$\\frac{(x^3 + 2)^6}{18} + C$" },
        why: { th: "ไม่ถูกต้อง — มี $3x^2$ อยู่ในโจทย์แล้ว ไม่ต้องคูณ 3 ซ้ำ", en: "Incorrect" },
      },
      {
        id: "c",
        label: { th: "$(x^3 + 2)^6 + C$", en: "$(x^3 + 2)^6 + C$" },
        why: { th: "ไม่ถูกต้อง — ลืมหารด้วย 6 จากกฎกำลัง", en: "Incorrect" },
      },
      {
        id: "d",
        label: { th: "$\\frac{(x^3 + 2)^5}{6} + C$", en: "$\\frac{(x^3 + 2)^5}{6} + C$" },
        why: { th: "ไม่ถูกต้อง", en: "Incorrect" },
      },
    ],
    correctId: "a",
    explanationMd: "**ข้อ A ถูกต้อง ($\\frac{(x^3 + 2)^6}{6} + C$)**\n\n**ขั้นตอนการคำนวณ:**\n1. สังเกตว่าอนุพันธ์ของไส้ใน $x^3 + 2$ คือ $3x^2$ ซึ่งปรากฏอยู่ในตัวถูกอินทิเกรต\n2. กำหนด $u = x^3 + 2 \\implies du = 3x^2\\,dx$\n3. แปลงอินทิกรัลให้อยู่ในรูปตัวแปร $u$:\n   $$\\int (x^3 + 2)^5 \\cdot (3x^2\\,dx) = \\int u^5\\,du$$\n4. อินทิเกรตตามกฎกำลัง:\n   $$\\int u^5\\,du = \\frac{u^6}{6} + C$$\n5. แทน $u = x^3 + 2$ กลับคืน:\n   $$= \\frac{(x^3 + 2)^6}{6} + C$$",
    sourceRef: "Week 12 · u-Substitution",
  },
  {
    id: "mfit-fin-018",
    kind: "mcq",
    chapter: 13,
    prompt: {
      th: "จงหาค่าของปริพันธ์จำกัดเขต $\\int_{0}^{1} 2x(x^2 + 1)^3\\,dx$",
      en: "Evaluate the definite integral $\\int_{0}^{1} 2x(x^2 + 1)^3\\,dx$",
    },
    options: [
      {
        id: "a",
        label: { th: "$\\frac{15}{4}$", en: "$\\frac{15}{4}$" },
        why: { th: "ถูกต้อง — เปลี่ยนขอบเขตจาก $[0, 1]$ เป็น $[1, 2]$ ได้ $\\frac{16-1}{4}$", en: "Correct" },
      },
      {
        id: "b",
        label: { th: "$4$", en: "$4$" },
        why: { th: "ไม่ถูกต้อง — ลืมลบขอบเขตล่าง", en: "Incorrect" },
      },
      {
        id: "c",
        label: { th: "$\\frac{15}{2}$", en: "$\\frac{15}{2}$" },
        why: { th: "ไม่ถูกต้อง", en: "Incorrect" },
      },
      {
        id: "d",
        label: { th: "$\\frac{7}{4}$", en: "$\\frac{7}{4}$" },
        why: { th: "ไม่ถูกต้อง", en: "Incorrect" },
      },
    ],
    correctId: "a",
    explanationMd: "**ข้อ A ถูกต้อง ($\\frac{15}{4}$)**\n\n**ขั้นตอนการคำนวณ:**\n1. ให้ $u = x^2 + 1 \\implies du = 2x\\,dx$\n2. **เปลี่ยนขอบเขตตามตัวแปร $u$:**\n   - เมื่อ $x = 0 \\implies u = 0^2 + 1 = 1$\n   - เมื่อ $x = 1 \\implies u = 1^2 + 1 = 2$\n3. อินทิเกรตในรูป $u$:\n   $$\\int_{1}^{2} u^3\\,du = \\left[\\frac{u^4}{4}\\right]_{1}^{2} = \\frac{2^4}{4} - \\frac{1^4}{4} = \\frac{16 - 1}{4} = \\frac{15}{4}$$",
    sourceRef: "Week 13 · Definite Integrals with u-Sub",
  },
  {
    id: "mfit-fin-019",
    kind: "mcq",
    chapter: 13,
    prompt: {
      th: "โดยใช้ทฤษฎีบทหลักของแคลคูลัส (FTC Part 1) จงหา $\\frac{d}{dx}\\left[\\int_{2}^{x^3} \\sqrt{t^2 + 7}\\,dt\\right]$",
      en: "Using FTC Part 1 with the Chain Rule, evaluate $\\frac{d}{dx}\\left[\\int_{2}^{x^3} \\sqrt{t^2 + 7}\\,dt\\right]$",
    },
    options: [
      {
        id: "a",
        label: { th: "$3x^2 \\sqrt{x^6 + 7}$", en: "$3x^2 \\sqrt{x^6 + 7}$" },
        why: { th: "ถูกต้อง — แทน $t=x^3$ แล้วคูณด้วยอนุพันธ์ไส้ใน $\\frac{d}{dx}[x^3] = 3x^2$", en: "Correct" },
      },
      {
        id: "b",
        label: { th: "$\\sqrt{x^6 + 7}$", en: "$\\sqrt{x^6 + 7}$" },
        why: { th: "ไม่ถูกต้อง — ลืมคูณกฎลูกโซ่ $3x^2$", en: "Incorrect" },
      },
      {
        id: "c",
        label: { th: "$3x^2 \\sqrt{x^3 + 7}$", en: "$3x^2 \\sqrt{x^3 + 7}$" },
        why: { th: "ไม่ถูกต้อง — ลืมยกกำลังสองใน $(x^3)^2$", en: "Incorrect" },
      },
      {
        id: "d",
        label: { th: "$\\sqrt{x^2 + 7}$", en: "$\\sqrt{x^2 + 7}$" },
        why: { th: "ไม่ถูกต้อง", en: "Incorrect" },
      },
    ],
    correctId: "a",
    explanationMd: "**ข้อ A ถูกต้อง ($3x^2 \\sqrt{x^6 + 7}$)**\n\n**ขั้นตอนการคำนวณ:**\n1. ตามทฤษฎีบทหลักของแคลคูลัสควบคู่กฎลูกโซ่:\n   $$\\frac{d}{dx}\\left[\\int_{a}^{g(x)} f(t)\\,dt\\right] = f(g(x)) \\cdot g'(x)$$\n2. ในที่นี้ $f(t) = \\sqrt{t^2 + 7}$ และ $g(x) = x^3 \\implies g'(x) = 3x^2$\n3. แทนค่า $t = x^3$:\n   $$f(x^3) = \\sqrt{(x^3)^2 + 7} = \\sqrt{x^6 + 7}$$\n4. คูณด้วย $g'(x)$:\n   $$= \\sqrt{x^6 + 7} \\cdot 3x^2 = 3x^2 \\sqrt{x^6 + 7}$$",
    sourceRef: "Week 13 · Fundamental Theorem of Calculus",
  },
  {
    id: "mfit-fin-020",
    kind: "mcq",
    chapter: 13,
    prompt: {
      th: "จงหาค่าของปริพันธ์จำกัดเขต $\\int_{-2}^{2} (x^7 - 3x^3 + 5x + 4)\\,dx$ โดยใช้สมบัติความสมมาตรของฟังก์ชันคู่และฟังก์ชันคี่",
      en: "Evaluate $\\int_{-2}^{2} (x^7 - 3x^3 + 5x + 4)\\,dx$ using symmetry properties.",
    },
    options: [
      {
        id: "a",
        label: { th: "$16$", en: "$16$" },
        why: { th: "ถูกต้อง — พจน์คี่เป็นศูนย์ เหลือ $\\int_{-2}^2 4 dx = 16$", en: "Correct" },
      },
      {
        id: "b",
        label: { th: "$0$", en: "$0$" },
        why: { th: "ไม่ถูกต้อง — 4 เป็นฟังก์ชันคู่ ไม่เป็นศูนย์", en: "Incorrect" },
      },
      {
        id: "c",
        label: { th: "$8$", en: "$8$" },
        why: { th: "ไม่ถูกต้อง", en: "Incorrect" },
      },
      {
        id: "d",
        label: { th: "$32$", en: "$32$" },
        why: { th: "ไม่ถูกต้อง", en: "Incorrect" },
      },
    ],
    correctId: "a",
    explanationMd: "**ข้อ A ถูกต้อง ($16$)**\n\n**ขั้นตอนการคำนวณ:**\n1. สังเกตพจน์ในตัวถูกอินทิเกรต:\n   - $x^7$, $-3x^3$ และ $5x$ เป็นฟังก์ชันคี่ (Odd Functions: $f(-x) = -f(x)$)\n   - $4$ เป็นฟังก์ชันคู่ (Even Function)\n2. จากสมบัติการอินทิเกรตบนช่วงสมมาตร $[-a, a]$:\n   $$\\int_{-a}^{a} \\text{Odd}(x)\\,dx = 0$$\n3. ดังนั้น:\n   $$\\int_{-2}^{2} (x^7 - 3x^3 + 5x + 4)\\,dx = 0 + 0 + 0 + \\int_{-2}^{2} 4\\,dx$$\n4. คำนวณอินทิกรัลที่เหลือ:\n   $$\\int_{-2}^{2} 4\\,dx = 4[2 - (-2)] = 4(4) = 16$$",
    sourceRef: "Week 13 · Symmetry in Definite Integrals",
  },

  // ════════════════════════════════════════════════════════════════════════════
  // ── เสาที่ 5: By Parts & พื้นที่/ปริมาตร (Chapters 14, 15 / Week 14–15) ────────
  // ════════════════════════════════════════════════════════════════════════════
  {
    id: "mfit-fin-021",
    kind: "mcq",
    chapter: 14,
    prompt: {
      th: "จงหาค่าของ $\\int x e^{3x}\\,dx$ โดยใช้วิธี Integration by Parts",
      en: "Evaluate $\\int x e^{3x}\\,dx$ using Integration by Parts.",
    },
    options: [
      {
        id: "a",
        label: { th: "$\\frac{e^{3x}}{9}(3x - 1) + C$", en: "$\\frac{e^{3x}}{9}(3x - 1) + C$" },
        why: { th: "ถูกต้อง — $\\frac{x}{3}e^{3x} - \\frac{1}{9}e^{3x} + C$", en: "Correct" },
      },
      {
        id: "b",
        label: { th: "$\\frac{e^{3x}}{3}(x - 1) + C$", en: "$\\frac{e^{3x}}{3}(x - 1) + C$" },
        why: { th: "ไม่ถูกต้อง — ลืมหารด้วย 3 สองรอบในพจน์หลัง", en: "Incorrect" },
      },
      {
        id: "c",
        label: { th: "$x e^{3x} - e^{3x} + C$", en: "$x e^{3x} - e^{3x} + C$" },
        why: { th: "ไม่ถูกต้อง — ลืมสัมประสิทธิ์ $\\frac{1}{3}$", en: "Incorrect" },
      },
      {
        id: "d",
        label: { th: "$\\frac{x^2}{2}e^{3x} + C$", en: "$\\frac{x^2}{2}e^{3x} + C$" },
        why: { th: "ไม่ถูกต้อง — อินทิเกรตแยกพจน์แบบผลคูณไม่ได้!", en: "Incorrect" },
      },
    ],
    correctId: "a",
    explanationMd: "**ข้อ A ถูกต้อง ($\\frac{e^{3x}}{9}(3x - 1) + C$)**\n\n**ขั้นตอนการคำนวณ:**\n1. ใช้หลัก LIATE กำหนด $u = x$ และ $dv = e^{3x}\\,dx$\n2. หา $du$ และ $v$:\n   $$du = dx, \\quad v = \\int e^{3x}\\,dx = \\frac{1}{3}e^{3x}$$\n3. ใช้สูตร Integration by Parts $\\int u\\,dv = uv - \\int v\\,du$:\n   $$\\int x e^{3x}\\,dx = x\\left(\\frac{1}{3}e^{3x}\\right) - \\int \\frac{1}{3}e^{3x}\\,dx$$\n4. อินทิเกรตพจน์หลัง:\n   $$= \\frac{x}{3}e^{3x} - \\frac{1}{9}e^{3x} + C$$\n5. ดึงตัวร่วม $\\frac{e^{3x}}{9}$:\n   $$= \\frac{e^{3x}}{9}(3x - 1) + C$$",
    sourceRef: "Week 14 · Integration by Parts",
  },
  {
    id: "mfit-fin-022",
    kind: "mcq",
    chapter: 14,
    prompt: {
      th: "จงหาค่าของ $\\int x^2 \\cos x\\,dx$ โดยใช้ตาราง DI Method (Tabular Integration by Parts)",
      en: "Evaluate $\\int x^2 \\cos x\\,dx$ using Tabular Integration (DI Method).",
    },
    options: [
      {
        id: "a",
        label: { th: "$x^2 \\sin x + 2x \\cos x - 2\\sin x + C$", en: "$x^2 \\sin x + 2x \\cos x - 2\\sin x + C$" },
        why: { th: "ถูกต้อง — เครื่องหมายคูณทแยงมุม $(+), (-), (+)$ สลับกัน", en: "Correct" },
      },
      {
        id: "b",
        label: { th: "$x^2 \\sin x - 2x \\cos x + 2\\sin x + C$", en: "$x^2 \\sin x - 2x \\cos x + 2\\sin x + C$" },
        why: { th: "ไม่ถูกต้อง — เครื่องหมายลบคูณกับ $-\\cos x$ ต้องได้บวก", en: "Incorrect" },
      },
      {
        id: "c",
        label: { th: "$x^2 \\cos x - 2x \\sin x + C$", en: "$x^2 \\cos x - 2x \\sin x + C$" },
        why: { th: "ไม่ถูกต้อง", en: "Incorrect" },
      },
      {
        id: "d",
        label: { th: "$\\frac{x^3}{3}\\sin x + C$", en: "$\\frac{x^3}{3}\\sin x + C$" },
        why: { th: "ไม่ถูกต้อง", en: "Incorrect" },
      },
    ],
    correctId: "a",
    explanationMd: "**ข้อ A ถูกต้อง ($x^2 \\sin x + 2x \\cos x - 2\\sin x + C$)**\n\n**ขั้นตอนการสร้างตาราง DI Method:**\n\n| เครื่องหมาย | $D$ (ดิฟจนเป็น 0) | $I$ (อินทิเกรต) |\n|:---:|:---:|:---:|\n| $(+)$ | $x^2$ | $\\cos x$ |\n| $(-)$ | $2x$ | $\\sin x$ |\n| $(+)$ | $2$ | $-\\cos x$ |\n| $(-)$ | $0$ | $-\\sin x$ |\n\n**จับคู่คูณทแยงมุม:**\n1. แถว 1 $\\to$ 2: $(+)(x^2)(\\sin x) = x^2 \\sin x$\n2. แถว 2 $\\to$ 3: $(-)(2x)(-\\cos x) = +2x \\cos x$\n3. แถว 3 $\\to$ 4: $(+)(2)(-\\sin x) = -2\\sin x$\n\n**รวมผลลัพธ์:**\n$$= x^2 \\sin x + 2x \\cos x - 2\\sin x + C$$",
    sourceRef: "Week 14 · Tabular DI Method",
  },
  {
    id: "mfit-fin-023",
    kind: "mcq",
    chapter: 15,
    prompt: {
      th: "จงหาพื้นที่ของบริเวณปิดล้อมระหว่างพาราโบลา $y = x^2$ และเส้นตรง $y = 4x$",
      en: "Find the area of the region bounded by $y = x^2$ and $y = 4x$.",
    },
    options: [
      {
        id: "a",
        label: { th: "$\\frac{32}{3}$", en: "$\\frac{32}{3}$" },
        why: { th: "ถูกต้อง — $\\int_{0}^{4} (4x - x^2) dx = 32 - \\frac{64}{3} = \\frac{32}{3}$", en: "Correct" },
      },
      {
        id: "b",
        label: { th: "$\\frac{64}{3}$", en: "$\\frac{64}{3}$" },
        why: { th: "ไม่ถูกต้อง", en: "Incorrect" },
      },
      {
        id: "c",
        label: { th: "$16$", en: "$16$" },
        why: { th: "ไม่ถูกต้อง", en: "Incorrect" },
      },
      {
        id: "d",
        label: { th: "$\\frac{16}{3}$", en: "$\\frac{16}{3}$" },
        why: { th: "ไม่ถูกต้อง", en: "Incorrect" },
      },
    ],
    correctId: "a",
    explanationMd: "**ข้อ A ถูกต้อง ($\\frac{32}{3}$)**\n\n**ขั้นตอนการคำนวณพื้นที่ระหว่างเส้นโค้ง:**\n1. หาจุดตัดของเส้นโค้งทั้งสอง:\n   $$x^2 = 4x \\implies x^2 - 4x = 0 \\implies x(x - 4) = 0 \\implies x = 0, 4$$\n2. ตรวจสอบเส้นบน-ล่างบนช่วง $[0, 4]$:\n   - ที่ $x = 2$: เส้นตรง $y = 4(2) = 8$, พาราโบลา $y = 2^2 = 4$\n   - ดังนั้น เส้นตรง $y = 4x$ อยู่ด้านบน และ $y = x^2$ อยู่ด้านล่าง\n3. ตั้งสูตรพื้นที่ $A = \\int_{a}^{b} [y_{\\text{บน}} - y_{\\text{ล่าง}}]\\,dx$:\n   $$A = \\int_{0}^{4} (4x - x^2)\\,dx$$\n4. คำนวณอินทิกรัล:\n   $$= \\left[2x^2 - \\frac{x^3}{3}\\right]_{0}^{4} = \\left(2(16) - \\frac{64}{3}\\right) - 0 = 32 - \\frac{64}{3} = \\frac{96 - 64}{3} = \\frac{32}{3}$$",
    sourceRef: "Week 15 · Area Between Curves",
  },
  {
    id: "mfit-fin-024",
    kind: "mcq",
    chapter: 15,
    prompt: {
      th: "หมุนบริเวณใต้เส้นโค้ง $y = 2\\sqrt{x}$ จาก $x = 0$ ถึง $x = 3$ รอบแกน $X$ จงหาปริมาตรทรงตันที่เกิดขึ้นโดยใช้วิธีแบบจาน (Disk Method)",
      en: "Find the volume of the solid generated by revolving the region under $y = 2\\sqrt{x}$ from $x = 0$ to $x = 3$ about the X-axis using the Disk Method.",
    },
    options: [
      {
        id: "a",
        label: { th: "$18\\pi$", en: "$18\\pi$" },
        why: { th: "ถูกต้อง — $V = \\pi \\int_0^3 (2\\sqrt{x})^2 dx = \\pi \\int_0^3 4x dx = 18\\pi$", en: "Correct" },
      },
      {
        id: "b",
        label: { th: "$36\\pi$", en: "$36\\pi$" },
        why: { th: "ไม่ถูกต้อง — ลืมหารด้วย 2 ตอนอินทิเกรต $x$", en: "Incorrect" },
      },
      {
        id: "c",
        label: { th: "$12\\pi$", en: "$12\\pi$" },
        why: { th: "ไม่ถูกต้อง", en: "Incorrect" },
      },
      {
        id: "d",
        label: { th: "$9\\pi$", en: "$9\\pi$" },
        why: { th: "ไม่ถูกต้อง", en: "Incorrect" },
      },
    ],
    correctId: "a",
    explanationMd: "**ข้อ A ถูกต้อง ($18\\pi$)**\n\n**ขั้นตอนการคำนวณ (Disk Method):**\n1. การหมุนรอบแกน $X$ แบบแนบสนิท ใช้สูตรแบบจาน:\n   $$V = \\pi \\int_{a}^{b} [R(x)]^2\\,dx$$\n2. ในที่นี้รัศมี $R(x) = 2\\sqrt{x}$ และช่วงคือ $x \\in [0, 3]$:\n   $$[R(x)]^2 = (2\\sqrt{x})^2 = 4x$$\n3. อินทิเกรตหาปริมาตร:\n   $$V = \\pi \\int_{0}^{3} 4x\\,dx = \\pi \\left[2x^2\\right]_{0}^{3} = \\pi (2 \\cdot 3^2 - 0) = \\pi (2 \\cdot 9) = 18\\pi$$",
    sourceRef: "Week 15 · Disk Method",
  },
  {
    id: "mfit-fin-025",
    kind: "mcq",
    chapter: 15,
    prompt: {
      th: "หมุนบริเวณปิดล้อมระหว่างเส้นโค้ง $y = \\sqrt{x}$ และเส้นตรง $y = x$ รอบแกน $X$ จงหาปริมาตรทรงตันที่เกิดขึ้นโดยใช้วิธีแบบวงแหวน (Washer Method)",
      en: "Find the volume of the solid generated by revolving the region between $y = \\sqrt{x}$ and $y = x$ about the X-axis using the Washer Method.",
    },
    options: [
      {
        id: "a",
        label: { th: "$\\frac{\\pi}{6}$", en: "$\\frac{\\pi}{6}$" },
        why: { th: "ถูกต้อง — $V = \\pi \\int_0^1 (x - x^2) dx = \\pi (\\frac{1}{2} - \\frac{1}{3}) = \\frac{\\pi}{6}$", en: "Correct" },
      },
      {
        id: "b",
        label: { th: "$\\frac{\\pi}{3}$", en: "$\\frac{\\pi}{3}$" },
        why: { th: "ไม่ถูกต้อง", en: "Incorrect" },
      },
      {
        id: "c",
        label: { th: "$\\frac{\\pi}{2}$", en: "$\\frac{\\pi}{2}$" },
        why: { th: "ไม่ถูกต้อง", en: "Incorrect" },
      },
      {
        id: "d",
        label: { th: "$\\frac{5\\pi}{6}$", en: "$\\frac{5\\pi}{6}$" },
        why: { th: "ไม่ถูกต้อง", en: "Incorrect" },
      },
    ],
    correctId: "a",
    explanationMd: "**ข้อ A ถูกต้อง ($\\frac{\\pi}{6}$)**\n\n**ขั้นตอนการคำนวณ (Washer Method):**\n1. หาจุดตัดของเส้นโค้งทั้งสอง:\n   $$\\sqrt{x} = x \\implies x = x^2 \\implies x(x - 1) = 0 \\implies x = 0, 1$$\n2. ตรวจสอบรัศมีนอกและรัศมีในบนช่วง $[0, 1]$:\n   - ที่ $x = 0.25$: $\\sqrt{0.25} = 0.5$ และ $x = 0.25$\n   - รัศมีนอกคือ $R(x) = \\sqrt{x}$ และรัศมีในคือ $r(x) = x$\n3. สูตรแบบวงแหวนหมุนรอบแกน $X$:\n   $$V = \\pi \\int_{0}^{1} \\left([R(x)]^2 - [r(x)]^2\\right)\\,dx = \\pi \\int_{0}^{1} \\left((\\sqrt{x})^2 - x^2\\right)\\,dx = \\pi \\int_{0}^{1} (x - x^2)\\,dx$$\n4. คำนวณค่าอินทิกรัล:\n   $$V = \\pi \\left[\\frac{x^2}{2} - \\frac{x^3}{3}\\right]_{0}^{1} = \\pi \\left(\\frac{1}{2} - \\frac{1}{3}\\right) = \\frac{\\pi}{6}$$",
    sourceRef: "Week 15 · Washer Method",
  },
];

