import type { LText } from "@/lib/i18n";
import type { QuizQuestion } from "@/lib/quiz";

// IT-KMITL — 06016401 Mathematics for Information Technology (MFIT) midterm self-test.
// Source: data/it-kmitl/mfit/{summarize,midterm-exam}.md
// Chapters map to course weeks 1-7.
export const MFIT_QUIZ_ID = 900004;

export interface MfitChapter {
  chapter: number;
  title: LText;
}

export const MFIT_CHAPTERS: MfitChapter[] = [
  { chapter: 1, title: { th: "เมทริกซ์และการดำเนินการ", en: "Matrices & Operations" } },
  { chapter: 2, title: { th: "Inverse และ Determinants", en: "Inverse & Determinants" } },
  { chapter: 3, title: { th: "ระบบสมการเชิงเส้น", en: "Systems of Linear Equations" } },
  { chapter: 4, title: { th: "เวกเตอร์ใน Rⁿ", en: "Vectors in Rⁿ" } },
  { chapter: 5, title: { th: "ปริภูมิเวกเตอร์และความเป็นอิสระ", en: "Vector Spaces & Independence" } },
  { chapter: 6, title: { th: "การแปลงเชิงเส้น", en: "Linear Transformations" } },
  { chapter: 7, title: { th: "Eigenvalue และ Orthogonal Matrix", en: "Eigenvalues & Orthogonal Matrices" } },
];

export const MFIT_QUIZ: QuizQuestion[] = [
  // ══ Week 1 — Matrices ══════════════════════════════════════════════════════
  {
    id: "mfit-q1",
    kind: "mcq",
    chapter: 1,
    prompt: {
      th: "กำหนด `A` ขนาด 3 × 4, `B` ขนาด 4 × 2, `C` ขนาด 2 × 3 นิพจน์ใดหาค่าไม่ได้ (undefined)",
      en: "Given `A` is 3 × 4, `B` is 4 × 2, and `C` is 2 × 3, which expression is undefined?",
    },
    options: [
      { id: "a", label: { th: "`AᵀB`", en: "`AᵀB`" }, why: { th: "ถูกต้อง — `Aᵀ` ขนาด 4 × 3 คูณ `B` ขนาด 4 × 2 ไม่ได้ เพราะ 3 ≠ 4", en: "Correct — `Aᵀ` is 4 × 3 and `B` is 4 × 2; the inner dimensions 3 and 4 do not match." } },
      { id: "b", label: { th: "`ABC`", en: "`ABC`" }, why: { th: "ผิด — (3×4)(4×2) = 3×2 แล้ว (3×2)(2×3) = 3×3 หาค่าได้", en: "Wrong — (3×4)(4×2) = 3×2, then (3×2)(2×3) = 3×3. It is defined." } },
      { id: "c", label: { th: "`CAB`", en: "`CAB`" }, why: { th: "ผิด — (2×3)(3×4) = 2×4 แล้ว (2×4)(4×2) = 2×2 หาค่าได้", en: "Wrong — (2×3)(3×4) = 2×4, then (2×4)(4×2) = 2×2. It is defined." } },
      { id: "d", label: { th: "`BC`", en: "`BC`" }, why: { th: "ผิด — (4×2)(2×3) = 4×3 หาค่าได้", en: "Wrong — (4×2)(2×3) = 4×3. It is defined." } },
    ],
    correctId: "a",
    sourceRef: "midterm-exam.md พาร์ต 1 ข้อ 1",
  },
  {
    id: "mfit-q2",
    kind: "mcq",
    chapter: 1,
    prompt: {
      th: "`(AB)ᵀ` เท่ากับข้อใด",
      en: "What does `(AB)ᵀ` equal?",
    },
    options: [
      { id: "a", label: { th: "`AᵀBᵀ`", en: "`AᵀBᵀ`" }, why: { th: "ผิด — กับดักที่ 2 ในสรุป นอกจากค่าจะผิดแล้ว มิติมักคูณกันไม่ได้ด้วยซ้ำ", en: "Wrong — pitfall #2. Beyond the wrong value, the dimensions often will not even multiply." } },
      { id: "b", label: { th: "`AB`", en: "`AB`" }, why: { th: "ผิด — จริงเฉพาะกรณีพิเศษที่ `AB` เป็น symmetric เท่านั้น", en: "Wrong — true only in the special case where `AB` is symmetric." } },
      { id: "c", label: { th: "`BA`", en: "`BA`" }, why: { th: "ผิด — สลับลำดับแล้วแต่ลืม transpose แต่ละตัว", en: "Wrong — the order is reversed but each factor still needs transposing." } },
      { id: "d", label: { th: "`BᵀAᵀ`", en: "`BᵀAᵀ`" }, why: { th: "ถูกต้อง — transpose ของผลคูณต้อง **สลับลำดับ** เช่นเดียวกับ `(AB)⁻¹ = B⁻¹A⁻¹`", en: "Correct — transposing a product reverses the order, just like `(AB)⁻¹ = B⁻¹A⁻¹`." } },
    ],
    correctId: "d",
    sourceRef: "summarize.md Week 1 §สมบัติ",
  },
  {
    id: "mfit-q3",
    kind: "mcq",
    chapter: 1,
    prompt: {
      th: "เมทริกซ์ `AAᵀ` มีสมบัติใดเสมอ",
      en: "What is always true of the matrix `AAᵀ`?",
    },
    options: [
      { id: "a", label: { th: "หาตัวผกผันได้เสมอ", en: "It is always invertible" }, why: { th: "ผิด — ถ้าแถวของ A ขึ้นต่อกันเชิงเส้น `AAᵀ` จะ singular", en: "Wrong — if A's rows are linearly dependent, `AAᵀ` is singular." } },
      { id: "b", label: { th: "เป็นเมทริกซ์สมมาตร (symmetric)", en: "It is symmetric" }, why: { th: "ถูกต้อง — `(AAᵀ)ᵀ = (Aᵀ)ᵀAᵀ = AAᵀ` ทั้ง `AAᵀ` และ `AᵀA` เป็น symmetric เสมอ (แต่คนละขนาด)", en: "Correct — `(AAᵀ)ᵀ = (Aᵀ)ᵀAᵀ = AAᵀ`. Both `AAᵀ` and `AᵀA` are always symmetric, though of different sizes." } },
      { id: "c", label: { th: "เป็นเมทริกซ์ skew-symmetric", en: "It is skew-symmetric" }, why: { th: "ผิด — `B − Bᵀ` ต่างหากที่เป็น skew-symmetric", en: "Wrong — it is `B − Bᵀ` that is skew-symmetric." } },
      { id: "d", label: { th: "เท่ากับ `AᵀA` เสมอ", en: "It always equals `AᵀA`" }, why: { th: "ผิด — ถ้า A ขนาด m × n แล้ว `AAᵀ` เป็น m × m ส่วน `AᵀA` เป็น n × n คนละขนาดกัน", en: "Wrong — if A is m × n then `AAᵀ` is m × m while `AᵀA` is n × n." } },
    ],
    correctId: "b",
    sourceRef: "summarize.md Week 1 §สมบัติ",
  },
  {
    id: "mfit-q4",
    kind: "mcq",
    chapter: 1,
    prompt: {
      th: "การคูณเมทริกซ์ `AB` ขนาด (m × n)(n × p) ให้ผลลัพธ์ขนาดใด และสมาชิก `cᵢⱼ` คำนวณอย่างไร",
      en: "For `AB` of sizes (m × n)(n × p), what is the result size and how is entry `cᵢⱼ` computed?",
    },
    options: [
      { id: "a", label: { th: "ขนาด n × p โดย `cᵢⱼ = Σₖ aₖᵢ bⱼₖ`", en: "Size n × p, with `cᵢⱼ = Σₖ aₖᵢ bⱼₖ`" }, why: { th: "ผิด — สลับดัชนีจนกลายเป็นการคูณของ transpose", en: "Wrong — the indices are swapped, which describes a product of transposes." } },
      { id: "b", label: { th: "ขนาด p × m เพราะลำดับกลับด้าน", en: "Size p × m because the order reverses" }, why: { th: "ผิด — ลำดับกลับด้านเกิดกับ transpose และ inverse ไม่ใช่ขนาดของผลคูณ", en: "Wrong — order reversal applies to transposes and inverses, not to the product's shape." } },
      { id: "c", label: { th: "ขนาด m × p โดย `cᵢⱼ = Σₖ aᵢₖ bₖⱼ` (แถวที่ i ของ A · คอลัมน์ที่ j ของ B)", en: "Size m × p, with `cᵢⱼ = Σₖ aᵢₖ bₖⱼ` — row i of A dotted with column j of B" }, why: { th: "ถูกต้อง — มิติในติดกันต้องเท่ากัน (n) และหายไป เหลือมิตินอก m × p", en: "Correct — the inner dimensions must match (n) and cancel, leaving the outer dimensions m × p." } },
      { id: "d", label: { th: "ขนาด m × n โดยคูณสมาชิกตำแหน่งต่อตำแหน่ง", en: "Size m × n, multiplying entry-by-entry" }, why: { th: "ผิด — นั่นคือการคูณแบบ element-wise ซึ่งไม่ใช่การคูณเมทริกซ์", en: "Wrong — that is element-wise multiplication, not matrix multiplication." } },
    ],
    correctId: "c",
    sourceRef: "summarize.md Week 1 §การดำเนินการ",
  },
  {
    id: "mfit-q5",
    kind: "mcq",
    chapter: 1,
    prompt: {
      th: "ข้อความใดถูกต้องเกี่ยวกับการสลับที่ของการคูณเมทริกซ์",
      en: "Which statement about commutativity of matrix multiplication is correct?",
    },
    options: [
      { id: "a", label: { th: "`AB ≠ BA` โดยทั่วไป แม้ทั้งคู่จะหาค่าได้", en: "`AB ≠ BA` in general, even when both are defined" }, why: { th: "ถูกต้อง — บ่อยครั้ง `BA` หาค่าไม่ได้ด้วยซ้ำ และถึงหาได้ก็มักได้คนละค่า", en: "Correct — often `BA` is not even defined, and when it is, the values usually differ." } },
      { id: "b", label: { th: "`AB = BA` เสมอ เหมือนจำนวนจริง", en: "`AB = BA` always, like real numbers" }, why: { th: "ผิด — การคูณเมทริกซ์ไม่สลับที่ เป็นความต่างสำคัญจากพีชคณิตจำนวนจริง", en: "Wrong — matrix multiplication is not commutative; this is a key departure from real-number algebra." } },
      { id: "c", label: { th: "`A(BC) ≠ (AB)C` โดยทั่วไป", en: "`A(BC) ≠ (AB)C` in general" }, why: { th: "ผิด — การคูณเมทริกซ์ **เปลี่ยนหมู่ได้** เสมอ", en: "Wrong — matrix multiplication is always associative." } },
      { id: "d", label: { th: "`A(B + C) ≠ AB + AC`", en: "`A(B + C) ≠ AB + AC`" }, why: { th: "ผิด — กฎการแจกแจงใช้ได้ตามปกติ", en: "Wrong — the distributive law does hold." } },
    ],
    correctId: "a",
    sourceRef: "summarize.md Week 1 §สมบัติ",
  },

  // ══ Week 2 — Inverse & Determinants ════════════════════════════════════════
  {
    id: "mfit-q6",
    kind: "mcq",
    chapter: 2,
    prompt: {
      th: "`A` ขนาด 4 × 4 มี `det(A) = 3` จงหา `det(2Aᵀ A⁻¹)`",
      en: "`A` is 4 × 4 with `det(A) = 3`. Find `det(2Aᵀ A⁻¹)`.",
    },
    snippet: "det(cA) = cⁿ·det(A)\ndet(Aᵀ) = det(A)\ndet(A⁻¹) = 1/det(A)",
    options: [
      { id: "a", label: { th: "48", en: "48" }, why: { th: "ผิด — ลืมว่า `det(A⁻¹) = 1/3` แล้วคูณ 3 เข้าไปแทน", en: "Wrong — treats `det(A⁻¹)` as 3 instead of 1/3." } },
      { id: "b", label: { th: "6", en: "6" }, why: { th: "ผิด — ใช้ `det(2A) = 2·det(A)` ซึ่งเป็นกับดักที่ 3 ต้องเป็น `2ⁿ`", en: "Wrong — uses `det(2A) = 2·det(A)`; pitfall #3. The scalar is raised to the nth power." } },
      { id: "c", label: { th: "1/16", en: "1/16" }, why: { th: "ผิด — กลับเศษส่วนทั้งก้อน", en: "Wrong — the whole expression was inverted." } },
      { id: "d", label: { th: "16", en: "16" }, why: { th: "ถูกต้อง — `det(2AᵀA⁻¹) = 2⁴ · det(Aᵀ) · det(A⁻¹) = 16 · 3 · (1/3) = 16`", en: "Correct — `det(2AᵀA⁻¹) = 2⁴ · det(Aᵀ) · det(A⁻¹) = 16 · 3 · (1/3) = 16`." } },
    ],
    correctId: "d",
    sourceRef: "midterm-exam.md พาร์ต 1 ข้อ 2",
  },
  {
    id: "mfit-q7",
    kind: "mcq",
    chapter: 2,
    prompt: {
      th: "`det(cA)` เมื่อ `A` มีขนาด n × n เท่ากับข้อใด",
      en: "For an n × n matrix `A`, what is `det(cA)`?",
    },
    options: [
      { id: "a", label: { th: "`c · det(A)`", en: "`c · det(A)`" }, why: { th: "ผิด — กับดักที่ 3 จะถูกก็ต่อเมื่อ n = 1 เท่านั้น", en: "Wrong — pitfall #3; this holds only when n = 1." } },
      { id: "b", label: { th: "`det(A)` (ไม่เปลี่ยน)", en: "`det(A)` — unchanged" }, why: { th: "ผิด — การบวกพหุคูณของแถวหนึ่งเข้าอีกแถวต่างหากที่ไม่เปลี่ยน det", en: "Wrong — it is adding a multiple of one row to another that leaves det unchanged." } },
      { id: "c", label: { th: "`nc · det(A)`", en: "`nc · det(A)`" }, why: { th: "ผิด — เป็นการคูณ ไม่ใช่การยกกำลัง", en: "Wrong — the relationship is exponential, not multiplicative in n." } },
      { id: "d", label: { th: "`cⁿ · det(A)`", en: "`cⁿ · det(A)`" }, why: { th: "ถูกต้อง — คูณสเกลาร์เข้าไปทุกแถว ทั้ง n แถว จึงดึง c ออกมาได้ n ครั้ง", en: "Correct — the scalar multiplies all n rows, so c factors out n times." } },
    ],
    correctId: "d",
    sourceRef: "summarize.md Week 2 §สมบัติของ Determinant",
  },
  {
    id: "mfit-q8",
    kind: "mcq",
    chapter: 2,
    prompt: {
      th: "`A` ขนาด 3 × 3 มี `det(A) = 5` จงหา `det(A⁻¹)` และ `det(adj A)`",
      en: "`A` is 3 × 3 with `det(A) = 5`. Find `det(A⁻¹)` and `det(adj A)`.",
    },
    options: [
      { id: "a", label: { th: "`det(A⁻¹) = −5` และ `det(adj A) = 5`", en: "`det(A⁻¹) = −5` and `det(adj A) = 5`" }, why: { th: "ผิด — อินเวอร์สคือส่วนกลับ ไม่ใช่การเปลี่ยนเครื่องหมาย", en: "Wrong — inverting takes the reciprocal, not the negative." } },
      { id: "b", label: { th: "`det(A⁻¹) = 1/5` และ `det(adj A) = 125`", en: "`det(A⁻¹) = 1/5` and `det(adj A) = 125`" }, why: { th: "ผิด — ใช้เลขชี้กำลัง n แทนที่จะเป็น n − 1", en: "Wrong — uses exponent n instead of n − 1." } },
      { id: "c", label: { th: "`det(A⁻¹) = 5` และ `det(adj A) = 1/25`", en: "`det(A⁻¹) = 5` and `det(adj A) = 1/25`" }, why: { th: "ผิด — สลับกันทั้งสองค่า", en: "Wrong — both values are inverted relative to the truth." } },
      { id: "d", label: { th: "`det(A⁻¹) = 1/5` และ `det(adj A) = 25`", en: "`det(A⁻¹) = 1/5` and `det(adj A) = 25`" }, why: { th: "ถูกต้อง — `det(A⁻¹) = 1/det(A) = 1/5` และ `det(adj A) = [det(A)]ⁿ⁻¹ = 5² = 25`", en: "Correct — `det(A⁻¹) = 1/det(A) = 1/5`, and `det(adj A) = [det(A)]ⁿ⁻¹ = 5² = 25`." } },
    ],
    correctId: "d",
    sourceRef: "midterm-exam.md พาร์ต 2 ข้อ 15",
  },
  {
    id: "mfit-q9",
    kind: "mcq",
    chapter: 2,
    prompt: {
      th: "ข้อใด **ไม่** ทำให้ `det(A) = 0`",
      en: "Which of these does **not** force `det(A) = 0`?",
    },
    options: [
      { id: "a", label: { th: "มีแถวที่เป็นศูนย์ทั้งแถว", en: "A row of all zeros" }, why: { th: "ผิด — กางโคแฟกเตอร์ตามแถวนั้นได้ 0 ทันที", en: "Wrong — expanding along that row gives 0 immediately." } },
      { id: "b", label: { th: "มีสองแถวเหมือนกัน", en: "Two identical rows" }, why: { th: "ผิด — สลับสองแถวนั้นได้เมทริกซ์เดิมแต่ det ต้องเปลี่ยนเครื่องหมาย จึงต้องเป็น 0", en: "Wrong — swapping those rows gives the same matrix yet must negate det, so det = 0." } },
      { id: "c", label: { th: "มีแถวหนึ่งเป็นพหุคูณของอีกแถว", en: "One row is a multiple of another" }, why: { th: "ผิด — แถวขึ้นต่อกันเชิงเส้น det จึงเป็น 0", en: "Wrong — the rows are linearly dependent, so det = 0." } },
      { id: "d", label: { th: "บวกพหุคูณของแถวหนึ่งเข้าไปในอีกแถว", en: "Adding a multiple of one row to another row" }, why: { th: "ถูกต้อง — การกระทำนี้ **ไม่เปลี่ยน** det เลย จึงใช้ลดรูปก่อนกางโคแฟกเตอร์ได้ฟรี", en: "Correct — this operation leaves det unchanged, which is why it is free to use before cofactor expansion." } },
    ],
    correctId: "d",
    sourceRef: "summarize.md Week 2 §เงื่อนไขที่ทำให้ det = 0",
  },
  {
    id: "mfit-q10",
    kind: "mcq",
    chapter: 2,
    prompt: {
      th: "จงหา `A⁻¹` เมื่อ `A = [3 −4; −2 3]`",
      en: "Find `A⁻¹` for `A = [3 −4; −2 3]`.",
    },
    snippet: "A = [a b; c d]  →  A⁻¹ = 1/(ad − bc) · [d −b; −c a]",
    options: [
      { id: "a", label: { th: "`[3 4; 2 3]`", en: "`[3 4; 2 3]`" }, why: { th: "ถูกต้อง — `det = 9 − 8 = 1` จึงได้ `A⁻¹ = [d −b; −c a] = [3 4; 2 3]`", en: "Correct — `det = 9 − 8 = 1`, so `A⁻¹ = [d −b; −c a] = [3 4; 2 3]`." } },
      { id: "b", label: { th: "`[3 −4; −2 3]`", en: "`[3 −4; −2 3]`" }, why: { th: "ผิด — คือ A เดิม ลืมสลับแนวทแยงและกลับเครื่องหมายนอกแนวทแยง", en: "Wrong — that is A itself; the diagonal swap and off-diagonal sign flip were skipped." } },
      { id: "c", label: { th: "`[−3 4; 2 −3]`", en: "`[−3 4; 2 −3]`" }, why: { th: "ผิด — กลับเครื่องหมายทุกตัว ทั้งที่ต้องกลับเฉพาะนอกแนวทแยง", en: "Wrong — every sign was flipped; only the off-diagonal entries flip." } },
      { id: "d", label: { th: "`1/17 · [3 4; 2 3]`", en: "`1/17 · [3 4; 2 3]`" }, why: { th: "ผิด — คำนวณ det ผิดเป็น 9 + 8 ต้องเป็น `ad − bc` = 9 − 8 = 1", en: "Wrong — det computed as 9 + 8; it is `ad − bc` = 9 − 8 = 1." } },
    ],
    correctId: "a",
    sourceRef: "midterm-exam.md พาร์ต 2 ข้อ 12",
  },
  {
    id: "mfit-q11",
    kind: "mcq",
    chapter: 2,
    prompt: {
      th: "การกางโคแฟกเตอร์ (expansion by cofactors) ควรเลือกกางตามแถวหรือคอลัมน์ใด",
      en: "When expanding by cofactors, which row or column should you choose?",
    },
    options: [
      { id: "a", label: { th: "แถวหรือคอลัมน์ที่มีศูนย์เยอะที่สุด", en: "The row or column with the most zeros" }, why: { th: "ถูกต้อง — ทุกพจน์ที่ `aᵢⱼ = 0` ตัดทิ้งได้ทันที ไม่ต้องคำนวณ minor ของมัน", en: "Correct — every term with `aᵢⱼ = 0` drops out, so its minor never needs computing." } },
      { id: "b", label: { th: "แถวแรกเสมอ", en: "Always the first row" }, why: { th: "ผิด — ใช้ได้แต่มักเสียเวลาโดยใช่เหตุ กางตามแถวใดก็ได้ให้ผลเท่ากัน", en: "Wrong — valid but usually wasteful; any row gives the same determinant." } },
      { id: "c", label: { th: "แถวที่มีค่ามากที่สุด", en: "The row with the largest values" }, why: { th: "ผิด — ขนาดของตัวเลขไม่ได้ลดจำนวน minor ที่ต้องคำนวณ", en: "Wrong — the magnitude of entries does not reduce how many minors you must compute." } },
      { id: "d", label: { th: "ต้องกางทุกแถวแล้วเฉลี่ยผลลัพธ์", en: "Expand along every row and average the results" }, why: { th: "ผิด — ไม่มีวิธีนี้ กางแถวเดียวก็ได้คำตอบครบ", en: "Wrong — no such method exists; one expansion yields the complete answer." } },
    ],
    correctId: "a",
    sourceRef: "summarize.md Week 2 §Expansion by cofactors",
  },
  {
    id: "mfit-q12",
    kind: "mcq",
    chapter: 2,
    prompt: {
      th: "พื้นที่สามเหลี่ยมที่มีจุดยอด `(1, 2)`, `(4, 6)`, `(−2, 5)` เท่ากับเท่าใด",
      en: "What is the area of the triangle with vertices `(1, 2)`, `(4, 6)`, `(−2, 5)`?",
    },
    snippet: "Area = ± ½ · det [x₁ y₁ 1; x₂ y₂ 1; x₃ y₃ 1]",
    options: [
      { id: "a", label: { th: "5.25 ตารางหน่วย", en: "5.25 square units" }, why: { th: "ผิด — คูณ ¼ แทน ½ (¼ ใช้กับสูตรอื่น)", en: "Wrong — multiplied by ¼ instead of ½." } },
      { id: "b", label: { th: "10.5 ตารางหน่วย", en: "10.5 square units" }, why: { th: "ถูกต้อง — det ของเมทริกซ์ 3×3 นั้นได้ −21 จึงได้พื้นที่ `½ · |−21| = 21/2 = 10.5`", en: "Correct — the 3×3 determinant is −21, so the area is `½ · |−21| = 21/2 = 10.5`." } },
      { id: "c", label: { th: "21 ตารางหน่วย", en: "21 square units" }, why: { th: "ผิด — ลืมคูณ ½", en: "Wrong — the factor of ½ was omitted." } },
      { id: "d", label: { th: "−10.5 ตารางหน่วย", en: "−10.5 square units" }, why: { th: "ผิด — พื้นที่ต้องเป็นบวกเสมอ เลือกเครื่องหมายให้ผลลัพธ์เป็นบวก", en: "Wrong — area is always positive; choose the sign that makes it so." } },
    ],
    correctId: "b",
    sourceRef: "midterm-exam.md พาร์ต 2 ข้อ 18",
  },
  {
    id: "mfit-q13",
    kind: "mcq",
    chapter: 2,
    prompt: {
      th: "การเข้ารหัสด้วยเมทริกซ์ (cryptography) ถอดรหัสข้อความด้วยสูตรใด",
      en: "In matrix cryptography, which formula decodes the message?",
    },
    options: [
      { id: "a", label: { th: "`X = Y·A⁻¹` โดย A ต้อง invertible", en: "`X = Y·A⁻¹`, where A must be invertible" }, why: { th: "ถูกต้อง — เข้ารหัสด้วย `Y = X·A` จึงถอดด้วยการคูณ `A⁻¹` ทางขวา นิยมเลือก A ที่ `det(A) = ±1` เพื่อให้ได้จำนวนเต็ม", en: "Correct — encoding is `Y = X·A`, so decoding right-multiplies by `A⁻¹`. Choosing A with `det(A) = ±1` keeps the results integral." } },
      { id: "b", label: { th: "`X = A⁻¹·Y`", en: "`X = A⁻¹·Y`" }, why: { th: "ผิด — ลำดับผิดด้าน เพราะ X เป็น row matrix ที่คูณ A ทางขวา", en: "Wrong — wrong side; X is a row matrix that was right-multiplied by A." } },
      { id: "c", label: { th: "`X = Y·Aᵀ`", en: "`X = Y·Aᵀ`" }, why: { th: "ผิด — transpose ไม่ใช่การย้อนการคูณ ยกเว้น A เป็น orthogonal", en: "Wrong — transposing does not undo multiplication unless A is orthogonal." } },
      { id: "d", label: { th: "`X = Y / det(A)`", en: "`X = Y / det(A)`" }, why: { th: "ผิด — หารด้วยสเกลาร์ไม่ได้ย้อนการคูณเมทริกซ์", en: "Wrong — dividing by a scalar does not undo a matrix product." } },
    ],
    correctId: "a",
    sourceRef: "summarize.md Week 2 §Cryptography",
  },

  // ══ Week 3 — Systems of Linear Equations ═══════════════════════════════════
  {
    id: "mfit-q14",
    kind: "mcq",
    chapter: 3,
    prompt: {
      th: "ระบบสมการเชิงเส้นเอกพันธ์ (homogeneous) ที่มี 3 สมการ 5 ตัวแปร ข้อความใดถูกต้องเสมอ",
      en: "For a homogeneous linear system with 3 equations and 5 unknowns, which statement is always true?",
    },
    options: [
      { id: "a", label: { th: "ระบบไม่มีผลเฉลย (inconsistent)", en: "The system is inconsistent" }, why: { th: "ผิด — `x = 0` เป็นผลเฉลยเสมอ ระบบ homogeneous จึง consistent เสมอ", en: "Wrong — `x = 0` always solves it, so a homogeneous system is never inconsistent." } },
      { id: "b", label: { th: "ระบบมีผลเฉลยเดียวคือ trivial solution", en: "The only solution is the trivial one" }, why: { th: "ผิด — จะจริงได้ต่อเมื่อไม่มี free variable ซึ่งเป็นไปไม่ได้เมื่อตัวแปรมากกว่าสมการ", en: "Wrong — that requires no free variables, impossible when unknowns outnumber equations." } },
      { id: "c", label: { th: "สรุปไม่ได้ ต้องคำนวณ row-echelon form ก่อนเสมอ", en: "Cannot conclude without computing row-echelon form" }, why: { th: "ผิด — ทฤษฎีบทให้ข้อสรุปได้ทันทีจากการนับตัวแปรเทียบสมการ", en: "Wrong — the theorem settles it just by counting unknowns against equations." } },
      { id: "d", label: { th: "ระบบมีผลเฉลยเป็นจำนวนอนันต์", en: "The system has infinitely many solutions" }, why: { th: "ถูกต้อง — homogeneous มีผลเฉลยเสมอ (อย่างน้อย trivial) และเมื่อตัวแปร (5) มากกว่าสมการ (3) ย่อมมี free variable → อนันต์", en: "Correct — a homogeneous system always has the trivial solution, and with more unknowns (5) than equations (3) there must be a free variable, hence infinitely many." } },
    ],
    correctId: "d",
    sourceRef: "midterm-exam.md พาร์ต 1 ข้อ 4",
  },
  {
    id: "mfit-q15",
    kind: "mcq",
    chapter: 3,
    prompt: {
      th: "Cramer's Rule ใช้ได้ในเงื่อนไขใด",
      en: "Under what conditions does Cramer's Rule apply?",
    },
    options: [
      { id: "a", label: { th: "เมทริกซ์สัมประสิทธิ์ต้องจัตุรัส และ `det(A) ≠ 0`", en: "The coefficient matrix must be square with `det(A) ≠ 0`" }, why: { th: "ถูกต้อง — สูตร `xᵢ = det(Aᵢ)/det(A)` หารด้วย `det(A)` จึงต้องไม่เป็นศูนย์ (กับดักที่ 6)", en: "Correct — the formula `xᵢ = det(Aᵢ)/det(A)` divides by `det(A)`, so it must be nonzero (pitfall #6)." } },
      { id: "b", label: { th: "ใช้ได้กับทุกระบบสมการเชิงเส้น", en: "It works for every linear system" }, why: { th: "ผิด — ระบบที่ไม่จัตุรัสหรือ singular ต้องใช้ Gaussian elimination แทน", en: "Wrong — non-square or singular systems need Gaussian elimination instead." } },
      { id: "c", label: { th: "ใช้ได้เมื่อ `det(A) = 0` เท่านั้น", en: "Only when `det(A) = 0`" }, why: { th: "ผิด — กลับด้านกับความจริง `det(A) = 0` คือกรณีที่ใช้ไม่ได้", en: "Wrong — exactly backwards; `det(A) = 0` is the case that breaks it." } },
      { id: "d", label: { th: "ใช้ได้เฉพาะระบบ homogeneous", en: "Only for homogeneous systems" }, why: { th: "ผิด — ระบบ homogeneous ที่ `det(A) ≠ 0` ให้แต่ trivial solution จึงไม่ค่อยมีประโยชน์", en: "Wrong — a homogeneous system with `det(A) ≠ 0` yields only the trivial solution, so it is of little use there." } },
    ],
    correctId: "a",
    sourceRef: "summarize.md Week 3 §Cramer's Rule",
  },
  {
    id: "mfit-q16",
    kind: "mcq",
    chapter: 3,
    prompt: {
      th: "เมทริกซ์ในรูป row-echelon form ต้องมีสมบัติใด",
      en: "What defines a matrix in row-echelon form?",
    },
    options: [
      { id: "a", label: { th: "ต้องเป็นเมทริกซ์จัตุรัสเท่านั้น", en: "It must be square" }, why: { th: "ผิด — augmented matrix ไม่จัตุรัสอยู่แล้ว แต่ยังอยู่ในรูป echelon ได้", en: "Wrong — an augmented matrix is never square yet can still be in echelon form." } },
      { id: "b", label: { th: "แถวศูนย์อยู่ล่างสุด · ตัวนำของแต่ละแถวเป็น 1 · ตัวนำแถวล่างอยู่ขวาของแถวบน", en: "Zero rows at the bottom; each leading entry is 1; each leading 1 sits to the right of the one above" }, why: { th: "ถูกต้อง — ครบทั้งสามข้อจึงเป็น row-echelon form พร้อมแทนค่าย้อนกลับ", en: "Correct — all three conditions define row-echelon form, ready for back-substitution." } },
      { id: "c", label: { th: "ทุกสมาชิกนอกแนวทแยงต้องเป็นศูนย์", en: "Every off-diagonal entry must be zero" }, why: { th: "ผิด — นั่นคือเมทริกซ์ทแยงมุม ซึ่งเข้มกว่าที่ต้องการ", en: "Wrong — that describes a diagonal matrix, a far stronger condition." } },
      { id: "d", label: { th: "คอลัมน์ของตัวนำต้องมีศูนย์ทั้งบนและล่าง", en: "Each leading column must be zero above and below" }, why: { th: "ผิด — นั่นคือ **reduced** row-echelon form (ผลของ Gauss-Jordan)", en: "Wrong — that is reduced row-echelon form, the result of Gauss-Jordan." } },
    ],
    correctId: "b",
    sourceRef: "summarize.md Week 3 §Row-echelon form",
  },
  {
    id: "mfit-q17",
    kind: "mcq",
    chapter: 3,
    prompt: {
      th: "ระบบสมการเชิงเส้นมีจำนวนผลเฉลยที่เป็นไปได้กี่กรณี",
      en: "How many possibilities exist for the number of solutions of a linear system?",
    },
    options: [
      { id: "a", label: { th: "4 กรณี รวมกรณีที่ต้องใช้จำนวนเชิงซ้อน", en: "Four, including a complex-number case" }, why: { th: "ผิด — ไม่มีกรณีพิเศษนี้สำหรับระบบเชิงเส้นบนจำนวนจริง", en: "Wrong — no such extra case exists for real linear systems." } },
      { id: "b", label: { th: "3 กรณี: ผลเฉลยเดียว, ไม่มีผลเฉลย, หรืออนันต์", en: "Three: exactly one, none, or infinitely many" }, why: { th: "ถูกต้อง — เชิงเรขาคณิตคือเส้นตัดกัน, เส้นขนาน, และเส้นทับกัน ไม่มีกรณีอื่น", en: "Correct — geometrically: lines crossing, parallel, or coincident. There is no fourth case." } },
      { id: "c", label: { th: "2 กรณี: มีผลเฉลยหรือไม่มี", en: "Two: solvable or not" }, why: { th: "ผิด — แยกไม่ออกระหว่างผลเฉลยเดียวกับอนันต์ ซึ่งต่างกันในเชิงคำตอบ", en: "Wrong — it fails to distinguish a unique solution from infinitely many." } },
      { id: "d", label: { th: "มีได้ตั้งแต่ 0 ถึง n ผลเฉลย", en: "Anywhere from 0 to n solutions" }, why: { th: "ผิด — ระบบเชิงเส้นไม่มีทางมีผลเฉลยจำกัดที่มากกว่า 1 (เช่น 2 หรือ 3 ผลเฉลย)", en: "Wrong — a linear system can never have a finite count above one, such as exactly 2 or 3." } },
    ],
    correctId: "b",
    sourceRef: "summarize.md Week 3 §จำนวนผลเฉลย",
  },
  {
    id: "mfit-q18",
    kind: "mcq",
    chapter: 3,
    prompt: {
      th: "LU-Factorization แก้ระบบ `Ax = b` อย่างไร",
      en: "How does LU factorization solve `Ax = b`?",
    },
    options: [
      { id: "a", label: { th: "แก้ `Ux = b` ก่อนแล้วค่อย `Ly = x`", en: "Solve `Ux = b` first, then `Ly = x`" }, why: { th: "ผิด — สลับลำดับ ต้องเริ่มจาก L เพราะ `A = LU` ทำให้ `L(Ux) = b`", en: "Wrong — the order is reversed; `A = LU` means `L(Ux) = b`, so L comes first." } },
      { id: "b", label: { th: "แยก `A = LU` แล้วแก้ `Ly = b` (forward) ตามด้วย `Ux = y` (backward)", en: "Factor `A = LU`, solve `Ly = b` forward, then `Ux = y` backward" }, why: { th: "ถูกต้อง — L เป็น lower triangular ที่แนวทแยงเป็น 1 และ U เป็น upper triangular ทั้งสองขั้นแทนค่าตรงๆ ได้", en: "Correct — L is lower triangular with unit diagonal and U is upper triangular, so both stages substitute directly." } },
      { id: "c", label: { th: "แยก `A = LU` แล้วคำนวณ `x = U⁻¹L⁻¹b` โดยหาอินเวอร์สทั้งสองตัว", en: "Factor `A = LU`, then invert both to get `x = U⁻¹L⁻¹b`" }, why: { th: "ผิด — ถูกต้องเชิงพีชคณิตแต่เสียประโยชน์ของวิธีนี้ ซึ่งคือการหลีกเลี่ยงการหาอินเวอร์ส", en: "Wrong — algebraically valid but it discards the whole point, which is avoiding inversion." } },
      { id: "d", label: { th: "แยก `A = LU` โดย L และ U ต้องเป็น orthogonal", en: "Factor `A = LU` with both L and U orthogonal" }, why: { th: "ผิด — สับสนกับ QR factorization", en: "Wrong — that conflates it with QR factorization." } },
    ],
    correctId: "b",
    sourceRef: "summarize.md Week 3 §LU-Factorization",
  },

  // ══ Week 4 — Vectors in Rⁿ ═════════════════════════════════════════════════
  {
    id: "mfit-q19",
    kind: "mcq",
    chapter: 4,
    prompt: {
      th: "กำหนด `u = (2, −1, 3)` และ `v = (1, 0, −2)` จงหา `u × v`",
      en: "Given `u = (2, −1, 3)` and `v = (1, 0, −2)`, find `u × v`.",
    },
    snippet: "u × v = (u₂v₃ − u₃v₂, −(u₁v₃ − u₃v₁), u₁v₂ − u₂v₁)",
    options: [
      { id: "a", label: { th: "`(2, 7, 1)`", en: "`(2, 7, 1)`" }, why: { th: "ถูกต้อง — i: (−1)(−2) − (3)(0) = 2 · j: −[(2)(−2) − (3)(1)] = −(−7) = 7 · k: (2)(0) − (−1)(1) = 1", en: "Correct — i: (−1)(−2) − (3)(0) = 2; j: −[(2)(−2) − (3)(1)] = 7; k: (2)(0) − (−1)(1) = 1." } },
      { id: "b", label: { th: "`(2, −7, 1)`", en: "`(2, −7, 1)`" }, why: { th: "ผิด — ลืมเครื่องหมายลบหน้าพจน์ j ของสูตร cross product", en: "Wrong — the leading minus on the j term was dropped." } },
      { id: "c", label: { th: "`(−2, 7, −1)`", en: "`(−2, 7, −1)`" }, why: { th: "ผิด — คือ `v × u` ซึ่งเป็นลบของคำตอบที่ถูก", en: "Wrong — that is `v × u`, the negative of the correct answer." } },
      { id: "d", label: { th: "`(2, 7, −1)`", en: "`(2, 7, −1)`" }, why: { th: "ผิด — พจน์ k คำนวณผิดเครื่องหมาย", en: "Wrong — the k term carries the wrong sign." } },
    ],
    correctId: "a",
    sourceRef: "midterm-exam.md พาร์ต 1 ข้อ 5",
  },
  {
    id: "mfit-q20",
    kind: "mcq",
    chapter: 4,
    prompt: {
      th: "กำหนด `u = (1, −2, 2, 4)` ใน `R⁴` จงหา `‖u‖`",
      en: "Given `u = (1, −2, 2, 4)` in `R⁴`, find `‖u‖`.",
    },
    options: [
      { id: "a", label: { th: "25", en: "25" }, why: { th: "ผิด — คือ `‖u‖²` (= u · u) ลืมถอดรากที่สอง", en: "Wrong — that is `‖u‖²` (= u · u); the square root was skipped." } },
      { id: "b", label: { th: "√5", en: "√5" }, why: { th: "ผิด — บวกองค์ประกอบก่อนยกกำลังสอง แทนที่จะยกกำลังสองก่อนบวก", en: "Wrong — the components were summed before squaring instead of after." } },
      { id: "c", label: { th: "9", en: "9" }, why: { th: "ผิด — บวกค่าสัมบูรณ์ของแต่ละองค์ประกอบ (1+2+2+4) ซึ่งเป็นคนละนิยาม", en: "Wrong — that sums absolute values (1+2+2+4), a different norm entirely." } },
      { id: "d", label: { th: "5", en: "5" }, why: { th: "ถูกต้อง — `√(1 + 4 + 4 + 16) = √25 = 5`", en: "Correct — `√(1 + 4 + 4 + 16) = √25 = 5`." } },
    ],
    correctId: "d",
    sourceRef: "midterm-exam.md พาร์ต 2 ข้อ 13",
  },
  {
    id: "mfit-q21",
    kind: "mcq",
    chapter: 4,
    prompt: {
      th: "กำหนด `a = (3, −1)` และ `b = (2, 6)` มุมระหว่างเวกเตอร์ทั้งสองเท่ากับกี่องศา",
      en: "Given `a = (3, −1)` and `b = (2, 6)`, what is the angle between them?",
    },
    options: [
      { id: "a", label: { th: "45 องศา", en: "45 degrees" }, why: { th: "ผิด — `cos 45° ≠ 0` แต่ dot product เป็นศูนย์", en: "Wrong — `cos 45° ≠ 0`, yet the dot product is zero." } },
      { id: "b", label: { th: "180 องศา", en: "180 degrees" }, why: { th: "ผิด — ต้องชี้ตรงข้ามกัน ซึ่งจะให้ dot product เป็นลบ", en: "Wrong — that requires opposite directions, giving a negative dot product." } },
      { id: "c", label: { th: "90 องศา", en: "90 degrees" }, why: { th: "ถูกต้อง — `a · b = 6 − 6 = 0` dot product เป็นศูนย์แปลว่าตั้งฉาก ไม่ต้องคำนวณ norm เลย", en: "Correct — `a · b = 6 − 6 = 0`. A zero dot product means orthogonal; no norms needed." } },
      { id: "d", label: { th: "0 องศา", en: "0 degrees" }, why: { th: "ผิด — ต้องเป็นพหุคูณกัน ซึ่ง `(3,−1)` กับ `(2,6)` ไม่ใช่", en: "Wrong — that needs the vectors to be parallel multiples, which these are not." } },
    ],
    correctId: "c",
    sourceRef: "midterm-exam.md พาร์ต 2 ข้อ 14",
  },
  {
    id: "mfit-q22",
    kind: "mcq",
    chapter: 4,
    prompt: {
      th: "ข้อใดถูกต้องเกี่ยวกับ cross product `u × v`",
      en: "Which statement about the cross product `u × v` is correct?",
    },
    options: [
      { id: "a", label: { th: "`(u × v) · u = 0` และ `(u × v) · v = 0`", en: "`(u × v) · u = 0` and `(u × v) · v = 0`" }, why: { th: "ถูกต้อง — ผลลัพธ์ตั้งฉากกับทั้งสองเวกเตอร์ ใช้ตรวจคำตอบได้เร็วมาก", en: "Correct — the result is perpendicular to both inputs, which makes it a fast way to check your answer." } },
      { id: "b", label: { th: "`u × v = v × u`", en: "`u × v = v × u`" }, why: { th: "ผิด — cross product เป็น anticommutative: `u × v = −(v × u)`", en: "Wrong — the cross product is anticommutative: `u × v = −(v × u)`." } },
      { id: "c", label: { th: "`u × v` ให้ผลเป็นสเกลาร์", en: "`u × v` produces a scalar" }, why: { th: "ผิด — cross product ให้เวกเตอร์ ส่วน dot product ให้สเกลาร์", en: "Wrong — the cross product yields a vector; the dot product yields a scalar." } },
      { id: "d", label: { th: "ใช้ได้กับเวกเตอร์ใน `Rⁿ` ทุกมิติ", en: "It is defined for vectors in any `Rⁿ`" }, why: { th: "ผิด — cross product นิยามเฉพาะใน `R³` เท่านั้น", en: "Wrong — the cross product is defined only in `R³`." } },
    ],
    correctId: "a",
    sourceRef: "summarize.md Week 4 §Cross Product",
  },
  {
    id: "mfit-q23",
    kind: "mcq",
    chapter: 4,
    prompt: {
      th: "`u · u` เท่ากับข้อใด",
      en: "What does `u · u` equal?",
    },
    options: [
      { id: "a", label: { th: "`2‖u‖`", en: "`2‖u‖`" }, why: { th: "ผิด — ไม่มีกฎใดให้ผลเป็นสองเท่าของ norm", en: "Wrong — no identity produces twice the norm." } },
      { id: "b", label: { th: "0 เสมอ", en: "Always 0" }, why: { th: "ผิด — `u · u = 0` ก็ต่อเมื่อ `u` เป็นเวกเตอร์ศูนย์เท่านั้น", en: "Wrong — `u · u = 0` only when `u` is the zero vector." } },
      { id: "c", label: { th: "`‖u‖²`", en: "`‖u‖²`" }, why: { th: "ถูกต้อง — สูตรลัดที่ออกสอบบ่อย ใช้เลี่ยงการถอดรากแล้วยกกำลังสองซ้ำ", en: "Correct — a frequently tested shortcut that avoids taking a square root only to square it again." } },
      { id: "d", label: { th: "`‖u‖`", en: "`‖u‖`" }, why: { th: "ผิด — ลืมยกกำลังสอง norm คือ **รากที่สอง** ของ `u · u`", en: "Wrong — the norm is the square root of `u · u`, so the square is missing." } },
    ],
    correctId: "c",
    sourceRef: "summarize.md Week 4 §Dot Product",
  },
  {
    id: "mfit-q24",
    kind: "mcq",
    chapter: 4,
    prompt: {
      th: "`‖cu‖` เท่ากับข้อใด",
      en: "What does `‖cu‖` equal?",
    },
    options: [
      { id: "a", label: { th: "`|c| · ‖u‖`", en: "`|c| · ‖u‖`" }, why: { th: "ถูกต้อง — ต้องใช้ **ค่าสัมบูรณ์** เพราะความยาวเป็นลบไม่ได้ เช่น `‖−3u‖ = 3‖u‖`", en: "Correct — the absolute value is required since length cannot be negative; e.g. `‖−3u‖ = 3‖u‖`." } },
      { id: "b", label: { th: "`c · ‖u‖`", en: "`c · ‖u‖`" }, why: { th: "ผิด — ถ้า c เป็นลบจะได้ความยาวติดลบ ซึ่งเป็นไปไม่ได้", en: "Wrong — a negative c would give a negative length, which is impossible." } },
      { id: "c", label: { th: "`c² · ‖u‖`", en: "`c² · ‖u‖`" }, why: { th: "ผิด — `c²` มาจาก `‖cu‖² = c²‖u‖²` ยังไม่ได้ถอดราก", en: "Wrong — `c²` belongs to `‖cu‖² = c²‖u‖²`, before taking the square root." } },
      { id: "d", label: { th: "`‖u‖` (ไม่เปลี่ยน)", en: "`‖u‖` — unchanged" }, why: { th: "ผิด — เฉพาะเมทริกซ์ orthogonal เท่านั้นที่รักษาความยาว", en: "Wrong — only orthogonal matrices preserve length." } },
    ],
    correctId: "a",
    sourceRef: "summarize.md Week 4 §ความยาว (Norm)",
  },

  // ══ Week 5 — Vector Spaces & Independence ══════════════════════════════════
  {
    id: "mfit-q25",
    kind: "mcq",
    chapter: 5,
    prompt: {
      th: "เซตใด **ไม่เป็น** ปริภูมิย่อย (subspace) ของปริภูมิที่กำกับไว้",
      en: "Which set is **not** a subspace of the indicated space?",
    },
    options: [
      { id: "a", label: { th: "`W = {A ∈ M₂,₂ : A = Aᵀ}` ของ `M₂,₂`", en: "`W = {A ∈ M₂,₂ : A = Aᵀ}` of `M₂,₂`" }, why: { th: "ผิด — เมทริกซ์ศูนย์เป็น symmetric และผลบวก/พหุคูณของ symmetric ยังเป็น symmetric", en: "Wrong — the zero matrix is symmetric, and sums and scalar multiples of symmetric matrices stay symmetric." } },
      { id: "b", label: { th: "`W = {p ∈ P₃ : p(0) = 0}` ของ `P₃`", en: "`W = {p ∈ P₃ : p(0) = 0}` of `P₃`" }, why: { th: "ผิด — พหุนามศูนย์สอดคล้อง และเงื่อนไข `p(0) = 0` เป็นเอกพันธ์ จึงปิดครบ", en: "Wrong — the zero polynomial qualifies and the condition `p(0) = 0` is homogeneous, so closure holds." } },
      { id: "c", label: { th: "`W = {(x, y, z) ∈ R³ : x + y = 1}` ของ `R³`", en: "`W = {(x, y, z) ∈ R³ : x + y = 1}` of `R³`" }, why: { th: "ถูกต้อง — `(0,0,0)` ไม่อยู่ใน W เพราะ `0 + 0 = 0 ≠ 1` ตกข้อแรกของ Test for Subspace ทันที", en: "Correct — `(0,0,0)` fails since `0 + 0 = 0 ≠ 1`, so it flunks the very first subspace test." } },
      { id: "d", label: { th: "`W = {(x, y, z) ∈ R³ : x + 2y − z = 0}` ของ `R³`", en: "`W = {(x, y, z) ∈ R³ : x + 2y − z = 0}` of `R³`" }, why: { th: "ผิด — สมการเอกพันธ์ผ่านจุดกำเนิด และปิดใต้การบวก/สเกลาร์ จึงเป็น subspace", en: "Wrong — a homogeneous equation passes through the origin and is closed under both operations, so it is a subspace." } },
    ],
    correctId: "c",
    sourceRef: "midterm-exam.md พาร์ต 1 ข้อ 3",
  },
  {
    id: "mfit-q26",
    kind: "mcq",
    chapter: 5,
    prompt: {
      th: "Test for a Subspace ต้องตรวจกี่ข้อ และข้อใดบ้าง",
      en: "How many conditions does the subspace test require, and which?",
    },
    options: [
      { id: "a", label: { th: "10 ข้อ ตามสัจพจน์ของ vector space ทั้งหมด", en: "All ten vector-space axioms" }, why: { th: "ผิด — ต้องตรวจครบ 10 ข้อเฉพาะตอนพิสูจน์ว่าเซตเป็น vector space เองตั้งแต่ต้น", en: "Wrong — all ten are needed only when proving a set is a vector space from scratch." } },
      { id: "b", label: { th: "2 ข้อ: ปิดใต้การบวกและการคูณสเกลาร์เท่านั้น", en: "Two: closure under addition and scalar multiplication only" }, why: { th: "ผิด — ต้องยืนยันว่า W ไม่ว่างด้วย ซึ่งเช็กผ่าน `0 ∈ W`", en: "Wrong — you must also confirm W is non-empty, which the `0 ∈ W` check does." } },
      { id: "c", label: { th: "1 ข้อ: W ต้องเป็นเซตย่อยของ V", en: "One: W must be a subset of V" }, why: { th: "ผิด — เป็นเพียงข้อกำหนดเบื้องต้น ยังไม่รับประกันความเป็น subspace", en: "Wrong — that is only a precondition and guarantees nothing about subspace structure." } },
      { id: "d", label: { th: "3 ข้อ: `0 ∈ W`, ปิดใต้การบวก, ปิดใต้การคูณสเกลาร์", en: "Three: `0 ∈ W`, closed under addition, closed under scalar multiplication" }, why: { th: "ถูกต้อง — สัจพจน์ที่เหลือสืบทอดจาก V อยู่แล้ว เช็ก `0 ∈ W` ก่อนเสมอเพราะเร็วที่สุด", en: "Correct — the remaining axioms are inherited from V. Check `0 ∈ W` first; it is the fastest disqualifier." } },
    ],
    correctId: "d",
    sourceRef: "summarize.md Week 5 §Test for a Subspace",
  },
  {
    id: "mfit-q27",
    kind: "mcq",
    chapter: 5,
    prompt: {
      th: "เซตของพหุนามที่มีดีกรี **เท่ากับ 4 พอดี** เป็น vector space หรือไม่ เพราะเหตุใด",
      en: "Is the set of polynomials of degree **exactly 4** a vector space? Why?",
    },
    options: [
      { id: "a", label: { th: "ไม่เป็น — ไม่มีเวกเตอร์ศูนย์ และไม่ปิดใต้การบวก", en: "No — it lacks a zero vector and is not closed under addition" }, why: { th: "ถูกต้อง — พหุนามศูนย์ไม่มีดีกรี 4 และ `x⁴ + (−x⁴ + x) = x` ซึ่งดีกรี 1 หลุดออกจากเซต (กับดักที่ 8)", en: "Correct — the zero polynomial has no degree 4, and `x⁴ + (−x⁴ + x) = x` has degree 1, leaving the set (pitfall #8)." } },
      { id: "b", label: { th: "เป็น — เพราะ `P₄` เป็น vector space มาตรฐาน", en: "Yes — because `P₄` is a standard vector space" }, why: { th: "ผิด — `P₄` คือพหุนามดีกรี **ไม่เกิน** 4 ซึ่งต่างจาก \"เท่ากับ 4 พอดี\"", en: "Wrong — `P₄` means degree *at most* 4, which is a different set." } },
      { id: "c", label: { th: "เป็น — เพราะปิดใต้การคูณสเกลาร์", en: "Yes — because it is closed under scalar multiplication" }, why: { th: "ผิด — คูณด้วย 0 ได้พหุนามศูนย์ซึ่งหลุดจากเซต จึงไม่ปิดด้วยซ้ำ", en: "Wrong — multiplying by 0 gives the zero polynomial, which is outside the set, so even that closure fails." } },
      { id: "d", label: { th: "ไม่เป็น — เพราะการบวกพหุนามไม่สลับที่", en: "No — polynomial addition is not commutative" }, why: { th: "ผิด — การบวกพหุนามสลับที่ได้ตามปกติ ปัญหาอยู่ที่ closure และเวกเตอร์ศูนย์", en: "Wrong — polynomial addition commutes fine; the failures are closure and the zero vector." } },
    ],
    correctId: "a",
    sourceRef: "summarize.md Week 5 §ตัวอย่าง Vector Space",
  },
  {
    id: "mfit-q28",
    kind: "mcq",
    chapter: 5,
    prompt: {
      th: "เซต `S = {v₁, …, vₖ}` อิสระเชิงเส้น (linearly independent) เมื่อใด",
      en: "When is a set `S = {v₁, …, vₖ}` linearly independent?",
    },
    options: [
      { id: "a", label: { th: "เมื่อทุกเวกเตอร์ตั้งฉากกัน", en: "When all the vectors are mutually orthogonal" }, why: { th: "ผิด — เซต orthogonal ที่ไม่มีเวกเตอร์ศูนย์เป็น independent จริง แต่ independent ไม่จำเป็นต้อง orthogonal", en: "Wrong — orthogonal non-zero sets are independent, but independence does not require orthogonality." } },
      { id: "b", label: { th: "เมื่อ `c₁v₁ + … + cₖvₖ = 0` มีผลเฉลยเดียวคือ `c₁ = … = cₖ = 0`", en: "When `c₁v₁ + … + cₖvₖ = 0` forces `c₁ = … = cₖ = 0`" }, why: { th: "ถูกต้อง — ถ้ามีผลเฉลยอื่นนอกจาก trivial เซตนั้น dependent", en: "Correct — any non-trivial solution makes the set dependent." } },
      { id: "c", label: { th: "เมื่อไม่มีเวกเตอร์ตัวใดเป็นศูนย์", en: "When none of the vectors is the zero vector" }, why: { th: "ผิด — จำเป็นแต่ไม่พอ เช่น `{(1,0), (2,0)}` ไม่มีเวกเตอร์ศูนย์แต่ dependent", en: "Wrong — necessary but not sufficient: `{(1,0), (2,0)}` has no zero vector yet is dependent." } },
      { id: "d", label: { th: "เมื่อจำนวนเวกเตอร์มากกว่ามิติของสเปซ", en: "When the vectors outnumber the dimension of the space" }, why: { th: "ผิด — กลับด้าน กรณีนั้น **dependent เสมอ** เช่น 4 เวกเตอร์ใน R³", en: "Wrong — backwards. That case is always dependent, e.g. 4 vectors in R³." } },
    ],
    correctId: "b",
    sourceRef: "summarize.md Week 5 §Linear Independence",
  },
  {
    id: "mfit-q29",
    kind: "mcq",
    chapter: 5,
    prompt: {
      th: "ข้อใดเป็น **ทางลัด** ที่สรุปได้ทันทีว่าเซตขึ้นต่อกันเชิงเส้น (dependent)",
      en: "Which shortcut immediately proves a set is linearly dependent?",
    },
    options: [
      { id: "a", label: { th: "เมทริกซ์จัตุรัสที่ประกอบขึ้นมี `det ≠ 0`", en: "The assembled square matrix has `det ≠ 0`" }, why: { th: "ผิด — `det ≠ 0` แปลว่า **independent** ต้อง `det = 0` จึง dependent", en: "Wrong — `det ≠ 0` means independent; dependence needs `det = 0`." } },
      { id: "b", label: { th: "เวกเตอร์ทุกตัวมีความยาวเท่ากัน", en: "All the vectors have equal length" }, why: { th: "ผิด — ความยาวไม่เกี่ยวกับความเป็นอิสระเชิงเส้นเลย", en: "Wrong — length has no bearing on linear independence." } },
      { id: "c", label: { th: "เซตมีเวกเตอร์ศูนย์ หรือมีเวกเตอร์มากกว่ามิติของสเปซ", en: "The set contains the zero vector, or has more vectors than the dimension" }, why: { th: "ถูกต้อง — ทั้งสองกรณี dependent เสมอ ไม่ต้องตั้งระบบสมการเลย เช่น 4 เวกเตอร์ใน R³", en: "Correct — both are always dependent, with no system to solve. For example, 4 vectors in R³." } },
      { id: "d", label: { th: "เซตมีเวกเตอร์เพียง 2 ตัว", en: "The set has only two vectors" }, why: { th: "ผิด — 2 เวกเตอร์ dependent ก็ต่อเมื่อเป็นพหุคูณกันเท่านั้น", en: "Wrong — two vectors are dependent only when one is a multiple of the other." } },
    ],
    correctId: "c",
    sourceRef: "summarize.md Week 5 §ทางลัดที่ต้องจำ",
  },
  {
    id: "mfit-q30",
    kind: "mcq",
    chapter: 5,
    prompt: {
      th: "`span(S)` มีสมบัติใด",
      en: "What is true of `span(S)`?",
    },
    options: [
      { id: "a", label: { th: "เป็น subspace เฉพาะเมื่อ S อิสระเชิงเส้น", en: "It is a subspace only when S is linearly independent" }, why: { th: "ผิด — span เป็น subspace เสมอ ความเป็นอิสระมีผลแค่กับ **มิติ** ของ span", en: "Wrong — a span is always a subspace; independence only affects its dimension." } },
      { id: "b", label: { th: "เท่ากับ V เสมอ", en: "It always equals V" }, why: { th: "ผิด — จริงเฉพาะเมื่อ S เป็น spanning set ของ V", en: "Wrong — that holds only when S actually spans V." } },
      { id: "c", label: { th: "ไม่จำเป็นต้องบรรจุเวกเตอร์ศูนย์", en: "It need not contain the zero vector" }, why: { th: "ผิด — เลือกสัมประสิทธิ์เป็นศูนย์ทั้งหมดก็ได้เวกเตอร์ศูนย์เสมอ", en: "Wrong — taking all coefficients zero always yields the zero vector." } },
      { id: "d", label: { th: "เป็น subspace ของ V เสมอ และเป็น subspace ที่เล็กที่สุดที่บรรจุ S", en: "It is always a subspace of V, and the smallest one containing S" }, why: { th: "ถูกต้อง — ผลรวมเชิงเส้นของสมาชิกใน S ยังคงเป็นผลรวมเชิงเส้น จึงปิดครบทุกข้อโดยอัตโนมัติ", en: "Correct — a linear combination of linear combinations is still one, so closure holds automatically." } },
    ],
    correctId: "d",
    sourceRef: "summarize.md Week 5 §Linear Combination & Span",
  },

  // ══ Week 6 — Linear Transformations ════════════════════════════════════════
  {
    id: "mfit-q31",
    kind: "mcq",
    chapter: 6,
    prompt: {
      th: "ฟังก์ชันใด **ไม่ใช่** การแปลงเชิงเส้น (linear transformation)",
      en: "Which function is **not** a linear transformation?",
    },
    options: [
      { id: "a", label: { th: "`T: R² → R², T(x, y) = (x − 1, y + 2)`", en: "`T: R² → R², T(x, y) = (x − 1, y + 2)`" }, why: { th: "ถูกต้อง — `T(0,0) = (−1, 2) ≠ (0,0)` มีพจน์คงที่บวกอยู่ จึงไม่เชิงเส้น เช็ก `T(0) = 0` เป็นวิธีที่เร็วที่สุด", en: "Correct — `T(0,0) = (−1, 2) ≠ (0,0)`. The constant offsets break linearity, and checking `T(0) = 0` is the fastest test." } },
      { id: "b", label: { th: "`T: R² → R², T(x, y) = (2x − y, x + 3y)`", en: "`T: R² → R², T(x, y) = (2x − y, x + 3y)`" }, why: { th: "ผิด — เป็นเชิงเส้นล้วน ทุกพจน์เป็นดีกรีหนึ่งและไม่มีค่าคงที่", en: "Wrong — fully linear: every term is degree one with no constants." } },
      { id: "c", label: { th: "`T: R³ → R², T(x, y, z) = (x + z, 0)`", en: "`T: R³ → R², T(x, y, z) = (x + z, 0)`" }, why: { th: "ผิด — เป็นเชิงเส้น องค์ประกอบที่เป็นศูนย์คงที่ไม่ทำให้เสียความเป็นเชิงเส้น", en: "Wrong — this is linear; a constantly-zero component preserves linearity." } },
      { id: "d", label: { th: "`T: M₂,₂ → M₂,₂, T(A) = Aᵀ`", en: "`T: M₂,₂ → M₂,₂, T(A) = Aᵀ`" }, why: { th: "ผิด — เป็นเชิงเส้น เพราะ `(A + B)ᵀ = Aᵀ + Bᵀ` และ `(cA)ᵀ = cAᵀ`", en: "Wrong — it is linear, since `(A + B)ᵀ = Aᵀ + Bᵀ` and `(cA)ᵀ = cAᵀ`." } },
    ],
    correctId: "a",
    sourceRef: "midterm-exam.md พาร์ต 1 ข้อ 6",
  },
  {
    id: "mfit-q32",
    kind: "mcq",
    chapter: 6,
    prompt: {
      th: "ถ้าเมทริกซ์มาตรฐาน `A` มีขนาด m × n แล้ว `T` เป็นการแปลงจากที่ใดไปที่ใด",
      en: "If the standard matrix `A` is m × n, what are the domain and codomain of `T`?",
    },
    options: [
      { id: "a", label: { th: "`T: Rᵐ → Rⁿ`", en: "`T: Rᵐ → Rⁿ`" }, why: { th: "ผิด — สลับ n กับ m เป็นกับดักที่ 9 ในสรุป", en: "Wrong — swapping n and m is pitfall #9." } },
      { id: "b", label: { th: "`T: Rⁿ → Rⁿ` เสมอ", en: "Always `T: Rⁿ → Rⁿ`" }, why: { th: "ผิด — จริงเฉพาะเมื่อ A จัตุรัส", en: "Wrong — true only when A is square." } },
      { id: "c", label: { th: "`T: Rᵐ → Rᵐ` เสมอ", en: "Always `T: Rᵐ → Rᵐ`" }, why: { th: "ผิด — เช่นเดียวกัน จริงเฉพาะกรณีจัตุรัส", en: "Wrong — likewise only in the square case." } },
      { id: "d", label: { th: "`T: Rⁿ → Rᵐ` — จำนวนคอลัมน์ = มิติ domain, จำนวนแถว = มิติ codomain", en: "`T: Rⁿ → Rᵐ` — columns give the domain dimension, rows the codomain" }, why: { th: "ถูกต้อง — `Av` ต้องคูณได้ เวกเตอร์ input จึงมี n องค์ประกอบ และผลลัพธ์มี m องค์ประกอบ", en: "Correct — `Av` must be defined, so the input has n components and the output has m." } },
    ],
    correctId: "d",
    sourceRef: "summarize.md Week 6 §Standard Matrix",
  },
  {
    id: "mfit-q33",
    kind: "mcq",
    chapter: 6,
    prompt: {
      th: "เมทริกซ์มาตรฐานของ `T(x, y, z) = (2y − z, 4x + 3z, x − y)` คือข้อใด",
      en: "What is the standard matrix of `T(x, y, z) = (2y − z, 4x + 3z, x − y)`?",
    },
    snippet: "เรียงสัมประสิทธิ์ของ x, y, z ในแต่ละองค์ประกอบเป็นแถว",
    options: [
      { id: "a", label: { th: "`[2 −1 0; 4 3 0; 1 −1 0]`", en: "`[2 −1 0; 4 3 0; 1 −1 0]`" }, why: { th: "ผิด — ไม่ได้เว้นตำแหน่งให้ตัวแปรที่หายไป ต้องเรียงตามตำแหน่ง x, y, z เสมอ", en: "Wrong — it does not hold a slot for missing variables; positions must always follow x, y, z." } },
      { id: "b", label: { th: "`[0 2 −1; 4 0 3; 1 −1 1]`", en: "`[0 2 −1; 4 0 3; 1 −1 1]`" }, why: { th: "ผิด — องค์ประกอบที่สามคือ `x − y` ไม่มี z สมาชิกมุมล่างขวาจึงต้องเป็น 0", en: "Wrong — the third component `x − y` has no z, so the bottom-right entry must be 0." } },
      { id: "c", label: { th: "`[0 2 −1; 4 0 3; 1 −1 0]`", en: "`[0 2 −1; 4 0 3; 1 −1 0]`" }, why: { th: "ถูกต้อง — แต่ละแถวคือสัมประสิทธิ์ของ x, y, z ตามลำดับ โดยเติม 0 ให้ตัวแปรที่ไม่ปรากฏ", en: "Correct — each row lists the x, y, z coefficients in order, with 0 filled in for absent variables." } },
      { id: "d", label: { th: "`[0 4 1; 2 0 −1; −1 3 0]`", en: "`[0 4 1; 2 0 −1; −1 3 0]`" }, why: { th: "ผิด — คือ transpose ของคำตอบที่ถูก (วางสัมประสิทธิ์เป็นคอลัมน์แทนแถว)", en: "Wrong — that is the transpose, placing coefficients down columns instead of across rows." } },
    ],
    correctId: "c",
    sourceRef: "midterm-exam.md พาร์ต 2 ข้อ 16",
  },
  {
    id: "mfit-q34",
    kind: "mcq",
    chapter: 6,
    prompt: {
      th: "การประกอบการแปลง `T = T₂ ∘ T₁` มีเมทริกซ์มาตรฐานเป็นอะไร",
      en: "What is the standard matrix of the composition `T = T₂ ∘ T₁`?",
    },
    options: [
      { id: "a", label: { th: "`A = A₂A₁` หรือ `A₁A₂` ก็ได้ ผลเท่ากัน", en: "Either `A₂A₁` or `A₁A₂`; they are equal" }, why: { th: "ผิด — การคูณเมทริกซ์ไม่สลับที่ `T₂∘T₁ ≠ T₁∘T₂` โดยทั่วไป", en: "Wrong — matrix multiplication does not commute; `T₂∘T₁ ≠ T₁∘T₂` in general." } },
      { id: "b", label: { th: "`A = A₂A₁` — ลำดับกลับด้านจากที่เขียน", en: "`A = A₂A₁` — reversed from the written order" }, why: { th: "ถูกต้อง — `T(v) = T₂(T₁(v)) = A₂(A₁v) = (A₂A₁)v` ตัวที่ทำก่อนอยู่ขวาสุด", en: "Correct — `T(v) = T₂(T₁(v)) = A₂(A₁v) = (A₂A₁)v`. Whatever acts first sits rightmost." } },
      { id: "c", label: { th: "`A = A₁A₂`", en: "`A = A₁A₂`" }, why: { th: "ผิด — ตามลำดับที่เขียนอ่านซ้ายไปขวา แต่การประกอบฟังก์ชันทำงานจากในออกนอก", en: "Wrong — that follows the written order, but composition applies inside-out." } },
      { id: "d", label: { th: "`A = A₁ + A₂`", en: "`A = A₁ + A₂`" }, why: { th: "ผิด — การประกอบคือการคูณเมทริกซ์ ไม่ใช่การบวก", en: "Wrong — composition corresponds to matrix multiplication, not addition." } },
    ],
    correctId: "b",
    sourceRef: "summarize.md Week 6 §Composition",
  },
  {
    id: "mfit-q35",
    kind: "mcq",
    chapter: 6,
    prompt: {
      th: "เมทริกซ์ของการหมุนทวนเข็มนาฬิกาด้วยมุม θ ใน `R²` คือข้อใด",
      en: "Which matrix rotates counter-clockwise by θ in `R²`?",
    },
    options: [
      { id: "a", label: { th: "`[1 0; 0 −1]`", en: "`[1 0; 0 −1]`" }, why: { th: "ผิด — คือการสะท้อนแกน x ไม่ใช่การหมุน", en: "Wrong — that is a reflection across the x-axis, not a rotation." } },
      { id: "b", label: { th: "`[cos θ  −sin θ; sin θ  cos θ]`", en: "`[cos θ  −sin θ; sin θ  cos θ]`" }, why: { th: "ถูกต้อง — ตรวจได้ด้วย θ = 90°: `[0 −1; 1 0]` ซึ่งส่ง `(1,0)` ไป `(0,1)` ถูกต้อง", en: "Correct — check with θ = 90°: `[0 −1; 1 0]` maps `(1,0)` to `(0,1)`, as expected." } },
      { id: "c", label: { th: "`[cos θ  sin θ; −sin θ  cos θ]`", en: "`[cos θ  sin θ; −sin θ  cos θ]`" }, why: { th: "ผิด — คือการหมุน **ตามเข็ม** (transpose ของคำตอบที่ถูก)", en: "Wrong — that rotates clockwise; it is the transpose of the correct matrix." } },
      { id: "d", label: { th: "`[sin θ  cos θ; cos θ  −sin θ]`", en: "`[sin θ  cos θ; cos θ  −sin θ]`" }, why: { th: "ผิด — สลับ sin กับ cos จน θ = 0 ไม่ให้เมทริกซ์เอกลักษณ์", en: "Wrong — sin and cos are swapped, so θ = 0 fails to give the identity." } },
    ],
    correctId: "b",
    sourceRef: "summarize.md Week 6 §Elementary Matrices",
  },
  {
    id: "mfit-q36",
    kind: "mcq",
    chapter: 6,
    prompt: {
      th: "`T: Rⁿ → Rⁿ` หาการแปลงผกผัน (invertible) ได้เมื่อใด",
      en: "When is `T: Rⁿ → Rⁿ` invertible?",
    },
    options: [
      { id: "a", label: { th: "เมื่อ `T(0) = 0`", en: "When `T(0) = 0`" }, why: { th: "ผิด — เป็นจริงกับการแปลงเชิงเส้นทุกตัว รวมทั้งตัวที่ไม่ invertible", en: "Wrong — that holds for every linear transformation, invertible or not." } },
      { id: "b", label: { th: "เมื่อ `A` มีขนาด n × n เสมอ", en: "Whenever `A` is n × n" }, why: { th: "ผิด — จัตุรัสเป็นเงื่อนไขจำเป็นแต่ไม่พอ ยังต้อง `det ≠ 0`", en: "Wrong — squareness is necessary but not sufficient; `det ≠ 0` is still required." } },
      { id: "c", label: { th: "เมื่อ `det(A) ≠ 0` และเมทริกซ์ของ `T⁻¹` คือ `A⁻¹`", en: "When `det(A) ≠ 0`; the matrix of `T⁻¹` is `A⁻¹`" }, why: { th: "ถูกต้อง — ความเป็น invertible ของ T สมมูลกับความเป็น invertible ของเมทริกซ์มาตรฐาน", en: "Correct — T's invertibility is equivalent to that of its standard matrix." } },
      { id: "d", label: { th: "เมื่อ `A` เป็นเมทริกซ์สมมาตร", en: "When `A` is symmetric" }, why: { th: "ผิด — เมทริกซ์สมมาตรอาจ singular ได้ เช่น เมทริกซ์ศูนย์", en: "Wrong — symmetric matrices can be singular; the zero matrix is symmetric." } },
    ],
    correctId: "c",
    sourceRef: "summarize.md Week 6 §Inverse Linear Transformation",
  },

  // ══ Week 7 — Eigenvalues & Orthogonal Matrices ═════════════════════════════
  {
    id: "mfit-q37",
    kind: "mcq",
    chapter: 7,
    prompt: {
      th: "กำหนด `A = [4 7 −2; 0 −1 5; 0 0 3]` ข้อความใดถูกต้อง",
      en: "Given `A = [4 7 −2; 0 −1 5; 0 0 3]`, which statement is correct?",
    },
    options: [
      { id: "a", label: { th: "eigenvalues คือ 4, 1 และ 3", en: "The eigenvalues are 4, 1, and 3" }, why: { th: "ผิด — สมาชิกแนวทแยงตัวกลางคือ −1 ไม่ใช่ 1", en: "Wrong — the middle diagonal entry is −1, not 1." } },
      { id: "b", label: { th: "ต้องแก้สมการลักษณะเฉพาะดีกรี 3 ก่อนจึงจะทราบ", en: "You must solve the cubic characteristic equation first" }, why: { th: "ผิด — แก้ได้แต่เสียเวลา เพราะรูปสามเหลี่ยมให้คำตอบทันที", en: "Wrong — you could, but the triangular form hands you the answer immediately." } },
      { id: "c", label: { th: "`A` ไม่มี eigenvalue ที่เป็นจำนวนจริง", en: "`A` has no real eigenvalues" }, why: { th: "ผิด — มีครบสามค่าและเป็นจำนวนจริงทั้งหมด", en: "Wrong — all three exist and are real." } },
      { id: "d", label: { th: "eigenvalues คือ 4, −1 และ 3 อ่านจากแนวทแยงได้ทันที", en: "The eigenvalues are 4, −1, and 3, read straight off the diagonal" }, why: { th: "ถูกต้อง — เมทริกซ์สามเหลี่ยม (บนหรือล่าง) มี eigenvalue เป็นสมาชิกแนวทแยงหลัก ไม่ต้องแก้สมการดีกรี 3", en: "Correct — for any triangular matrix the eigenvalues are the diagonal entries; no cubic to solve." } },
    ],
    correctId: "d",
    sourceRef: "midterm-exam.md พาร์ต 1 ข้อ 7",
  },
  {
    id: "mfit-q38",
    kind: "mcq",
    chapter: 7,
    prompt: {
      th: "`P` เป็นเมทริกซ์เชิงตั้งฉาก (orthogonal) ข้อความใด **ไม่ถูกต้อง**",
      en: "If `P` is an orthogonal matrix, which statement is **false**?",
    },
    options: [
      { id: "a", label: { th: "`PᵀP = I`", en: "`PᵀP = I`" }, why: { th: "ผิด (ข้อความนี้จริง) — เป็นนิยามของเมทริกซ์ orthogonal", en: "Wrong — this statement is true; it is the definition." } },
      { id: "b", label: { th: "`det(P) = 1` หรือ `det(P) = −1`", en: "`det(P) = 1` or `det(P) = −1`" }, why: { th: "ผิด (ข้อความนี้จริง) — จาก `det(P)² = 1`", en: "Wrong — this is true, following from `det(P)² = 1`." } },
      { id: "c", label: { th: "`‖Px‖ = ‖x‖` ทุกเวกเตอร์ `x`", en: "`‖Px‖ = ‖x‖` for every `x`" }, why: { th: "ผิด (ข้อความนี้จริง) — เมทริกซ์ orthogonal รักษาความยาวและมุม", en: "Wrong — this is true; orthogonal matrices preserve lengths and angles." } },
      { id: "d", label: { th: "`P` ต้องเป็นเมทริกซ์สมมาตร", en: "`P` must be symmetric" }, why: { th: "ถูกต้อง (คือข้อที่ผิด) — เมทริกซ์หมุน `[cos θ −sin θ; sin θ cos θ]` เป็น orthogonal แต่ไม่สมมาตร นิยามคือ `P⁻¹ = Pᵀ` ไม่ใช่ `P = Pᵀ`", en: "Correct — this is the false one. A rotation matrix is orthogonal but not symmetric; the definition is `P⁻¹ = Pᵀ`, not `P = Pᵀ`." } },
    ],
    correctId: "d",
    sourceRef: "midterm-exam.md พาร์ต 1 ข้อ 8",
  },
  {
    id: "mfit-q39",
    kind: "mcq",
    chapter: 7,
    prompt: {
      th: "`A` ขนาด 3 × 3 มี eigenvalue 2, 2, 5 โดย eigenspace ของ `λ = 2` มีมิติ 1 ข้อสรุปใดถูกต้อง",
      en: "A 3 × 3 matrix `A` has eigenvalues 2, 2, 5, and the eigenspace for `λ = 2` has dimension 1. What follows?",
    },
    options: [
      { id: "a", label: { th: "diagonalize ไม่ได้ เพราะหา eigenvector อิสระได้เพียง 2 ตัว", en: "Not diagonalizable — only 2 independent eigenvectors exist" }, why: { th: "ถูกต้อง — ต้องมี eigenvector อิสระครบ n = 3 ตัว แต่ λ=2 ให้แค่ 1 และ λ=5 ให้อีก 1 รวม 2", en: "Correct — diagonalizability needs n = 3 independent eigenvectors, but λ=2 contributes 1 and λ=5 contributes 1, totalling 2." } },
      { id: "b", label: { th: "diagonalize ได้ เพราะมี eigenvalue ครบ 3 ค่า", en: "Diagonalizable, since there are 3 eigenvalues" }, why: { th: "ผิด — นับ eigenvalue ซ้ำไม่ช่วย สิ่งที่นับคือมิติของ eigenspace รวมกัน", en: "Wrong — counting eigenvalues with multiplicity is not the test; the summed eigenspace dimensions are." } },
      { id: "c", label: { th: "diagonalize ไม่ได้ เพราะมี eigenvalue ซ้ำกัน", en: "Not diagonalizable because an eigenvalue repeats" }, why: { th: "ผิด — ได้ข้อสรุปถูกด้วยเหตุผลผิด eigenvalue ซ้ำยัง diagonalize ได้ถ้า eigenspace มีมิติเท่ากับ multiplicity", en: "Wrong conclusion-by-luck: repeated eigenvalues are fine when the eigenspace dimension matches the multiplicity." } },
      { id: "d", label: { th: "diagonalize ได้แบบตั้งฉาก (orthogonally) เสมอ", en: "Always orthogonally diagonalizable" }, why: { th: "ผิด — ต้องเป็นเมทริกซ์สมมาตรเท่านั้น ซึ่งโจทย์ไม่ได้ระบุ", en: "Wrong — that requires a symmetric matrix, which is not given." } },
    ],
    correctId: "a",
    sourceRef: "midterm-exam.md พาร์ต 1 ข้อ 9",
  },
  {
    id: "mfit-q40",
    kind: "mcq",
    chapter: 7,
    prompt: {
      th: "เงื่อนไขใด **ไม่สมมูล** กับ \"`A` หาตัวผกผันได้ (invertible)\"",
      en: "Which condition is **not** equivalent to \"`A` is invertible\"?",
    },
    options: [
      { id: "a", label: { th: "ระบบ `Ax = 0` มีเฉพาะผลเฉลยชัด (trivial)", en: "`Ax = 0` has only the trivial solution" }, why: { th: "ผิด — สมมูลกัน ถ้ามีผลเฉลยอื่นแปลว่าคอลัมน์ขึ้นต่อกันและ `det = 0`", en: "Wrong — equivalent. A non-trivial solution means dependent columns and `det = 0`." } },
      { id: "b", label: { th: "คอลัมน์ของ `A` เป็นเซตอิสระเชิงเส้น", en: "The columns of `A` are linearly independent" }, why: { th: "ผิด — สมมูลกันตามทฤษฎีบทเงื่อนไขสมมูลของเมทริกซ์ผกผันได้", en: "Wrong — equivalent, by the invertible matrix theorem." } },
      { id: "c", label: { th: "`A` เป็นเมทริกซ์สมมาตร", en: "`A` is symmetric" }, why: { th: "ถูกต้อง — ไม่เกี่ยวกัน เมทริกซ์ศูนย์สมมาตรแต่ singular ส่วนเมทริกซ์หมุน invertible แต่ไม่สมมาตร", en: "Correct — unrelated. The zero matrix is symmetric yet singular, and a rotation matrix is invertible yet not symmetric." } },
      { id: "d", label: { th: "`det(A) ≠ 0`", en: "`det(A) ≠ 0`" }, why: { th: "ผิด — เป็นเงื่อนไขสมมูลมาตรฐาน", en: "Wrong — this is a standard equivalent condition." } },
    ],
    correctId: "c",
    sourceRef: "midterm-exam.md พาร์ต 1 ข้อ 10",
  },
  {
    id: "mfit-q41",
    kind: "mcq",
    chapter: 7,
    prompt: {
      th: "กำหนด `A = [5 2; 2 5]` สมการลักษณะเฉพาะและค่าเจาะจงคือข้อใด",
      en: "For `A = [5 2; 2 5]`, what is the characteristic equation and what are the eigenvalues?",
    },
    options: [
      { id: "a", label: { th: "`λ² − 21λ + 10 = 0` · `λ = 0.5, 20.5`", en: "`λ² − 21λ + 10 = 0`; `λ = 0.5, 20.5`" }, why: { th: "ผิด — สลับที่ระหว่าง trace กับ det ในสมการ", en: "Wrong — the trace and determinant have swapped places in the equation." } },
      { id: "b", label: { th: "`λ² − 10λ + 21 = 0` · `λ = 3, 7`", en: "`λ² − 10λ + 21 = 0`; `λ = 3, 7`" }, why: { th: "ถูกต้อง — `det(λI − A) = (λ−5)² − 4 = λ² − 10λ + 21` ตรวจได้: ผลรวม = 10 = trace, ผลคูณ = 21 = det", en: "Correct — `det(λI − A) = (λ−5)² − 4 = λ² − 10λ + 21`. Check: sum 10 = trace, product 21 = det." } },
      { id: "c", label: { th: "`λ² − 10λ + 25 = 0` · `λ = 5, 5`", en: "`λ² − 10λ + 25 = 0`; `λ = 5, 5`" }, why: { th: "ผิด — ลืมลบพจน์ `(−2)(2) = −4` จากสมาชิกนอกแนวทแยง", en: "Wrong — the off-diagonal contribution `(−2)(2) = −4` was dropped." } },
      { id: "d", label: { th: "`λ² + 10λ + 21 = 0` · `λ = −3, −7`", en: "`λ² + 10λ + 21 = 0`; `λ = −3, −7`" }, why: { th: "ผิด — เครื่องหมายของ trace กลับด้าน eigenvalue ของเมทริกซ์นี้เป็นบวก", en: "Wrong — the trace sign is flipped; this matrix has positive eigenvalues." } },
    ],
    correctId: "b",
    sourceRef: "midterm-exam.md พาร์ต 2 ข้อ 17",
  },
  {
    id: "mfit-q42",
    kind: "mcq",
    chapter: 7,
    prompt: {
      th: "`A` ขนาด n × n จะ diagonalizable เมื่อใด",
      en: "When is an n × n matrix `A` diagonalizable?",
    },
    options: [
      { id: "a", label: { th: "เมื่อ `det(A) ≠ 0`", en: "When `det(A) ≠ 0`" }, why: { th: "ผิด — ไม่เกี่ยวกัน เมทริกซ์ singular ก็ diagonalize ได้ (เช่น เมทริกซ์ศูนย์) และเมทริกซ์ invertible ก็อาจทำไม่ได้", en: "Wrong — unrelated. Singular matrices can be diagonalizable (the zero matrix is), and invertible ones may not be." } },
      { id: "b", label: { th: "เมื่อ `A` เป็นเมทริกซ์สามเหลี่ยม", en: "When `A` is triangular" }, why: { th: "ผิด — รูปสามเหลี่ยมช่วยให้อ่าน eigenvalue ได้ง่าย แต่ไม่รับประกันการ diagonalize", en: "Wrong — triangularity makes eigenvalues easy to read but guarantees nothing about diagonalizability." } },
      { id: "c", label: { th: "เมื่อมี eigenvector ที่อิสระเชิงเส้นครบ n ตัว", en: "When it has n linearly independent eigenvectors" }, why: { th: "ถูกต้อง — เป็นเงื่อนไขที่จำเป็นและเพียงพอ เพราะต้องใช้ eigenvector เป็นคอลัมน์ของ P ที่ต้อง invertible", en: "Correct — necessary and sufficient, since those eigenvectors form the columns of an invertible P." } },
      { id: "d", label: { th: "เมื่อมี eigenvalue ต่างกันครบ n ค่าเท่านั้น", en: "Only when it has n distinct eigenvalues" }, why: { th: "ผิด — เป็นเงื่อนไข **เพียงพอแต่ไม่จำเป็น** eigenvalue ซ้ำก็ยัง diagonalize ได้ถ้ามิติ eigenspace พอ", en: "Wrong — sufficient but not necessary; repeated eigenvalues still work if the eigenspaces are large enough." } },
    ],
    correctId: "c",
    sourceRef: "summarize.md Week 7 §Diagonalization",
  },
  {
    id: "mfit-q43",
    kind: "mcq",
    chapter: 7,
    prompt: {
      th: "`A` เป็น orthogonally diagonalizable (`PᵀAP = D` โดย P orthogonal) ก็ต่อเมื่อใด",
      en: "`A` is orthogonally diagonalizable (`PᵀAP = D` with P orthogonal) if and only if what?",
    },
    options: [
      { id: "a", label: { th: "`A` เป็นเมทริกซ์สามเหลี่ยม", en: "`A` is triangular" }, why: { th: "ผิด — เมทริกซ์สามเหลี่ยมทั่วไปไม่มีสมบัตินี้", en: "Wrong — general triangular matrices lack this property." } },
      { id: "b", label: { th: "`A` invertible", en: "`A` is invertible" }, why: { th: "ผิด — ไม่เกี่ยวกัน เมทริกซ์สมมาตรที่ singular ก็ยัง orthogonally diagonalizable", en: "Wrong — unrelated; a singular symmetric matrix is still orthogonally diagonalizable." } },
      { id: "c", label: { th: "`A` มี eigenvalue ต่างกันทุกค่า", en: "`A` has all-distinct eigenvalues" }, why: { th: "ผิด — ให้ diagonalizable ธรรมดา แต่ P ที่ได้ไม่จำเป็นต้อง orthogonal", en: "Wrong — that gives ordinary diagonalizability, but the resulting P need not be orthogonal." } },
      { id: "d", label: { th: "`A` เป็นเมทริกซ์สมมาตร", en: "`A` is symmetric" }, why: { th: "ถูกต้อง — เป็นทฤษฎีบทสเปกตรัม เมทริกซ์สมมาตรมี eigenvalue จริงทั้งหมดและ eigenvector ของ eigenvalue ต่างกันตั้งฉากกันเสมอ", en: "Correct — the spectral theorem. Symmetric matrices have all-real eigenvalues, and eigenvectors from distinct eigenvalues are automatically orthogonal." } },
    ],
    correctId: "d",
    sourceRef: "summarize.md Week 7 §Orthogonal Diagonalization",
  },
  {
    id: "mfit-q44",
    kind: "mcq",
    chapter: 7,
    prompt: {
      th: "วิธีตรวจคำตอบ eigenvalue อย่างรวดเร็วคือข้อใด",
      en: "What is the quick way to sanity-check computed eigenvalues?",
    },
    options: [
      { id: "a", label: { th: "ผลรวมของ eigenvalue = det(A)", en: "Their sum equals det(A)" }, why: { th: "ผิด — สลับกัน ผลรวมคู่กับ trace ส่วนผลคูณคู่กับ det", en: "Wrong — swapped. The sum pairs with the trace and the product with the determinant." } },
      { id: "b", label: { th: "eigenvalue ทุกตัวต้องเป็นบวก", en: "All eigenvalues must be positive" }, why: { th: "ผิด — eigenvalue เป็นลบหรือศูนย์ได้ตามปกติ", en: "Wrong — eigenvalues may be negative or zero." } },
      { id: "c", label: { th: "eigenvalue ต้องมีค่าน้อยกว่าสมาชิกที่มากที่สุดในเมทริกซ์เสมอ", en: "Every eigenvalue is smaller than the largest matrix entry" }, why: { th: "ผิด — ไม่มีกฎเช่นนี้ เช่น `[5 2; 2 5]` มี eigenvalue 7 ซึ่งมากกว่าทุกสมาชิก", en: "Wrong — no such rule; `[5 2; 2 5]` has eigenvalue 7, larger than any entry." } },
      { id: "d", label: { th: "ผลรวมของ eigenvalue = trace(A) และผลคูณ = det(A)", en: "Their sum equals trace(A) and their product equals det(A)" }, why: { th: "ถูกต้อง — ตรวจได้ในไม่กี่วินาที และจับความผิดพลาดเรื่องเครื่องหมายได้เกือบทั้งหมด", en: "Correct — it takes seconds and catches nearly every sign error." } },
    ],
    correctId: "d",
    sourceRef: "summarize.md Week 7 §ตรวจคำตอบเร็ว",
  },
  {
    id: "mfit-q45",
    kind: "mcq",
    chapter: 7,
    prompt: {
      th: "ถ้า `A` เป็นเมทริกซ์สมมาตร ข้อใด **ไม่จริง**",
      en: "If `A` is symmetric, which statement is **false**?",
    },
    options: [
      { id: "a", label: { th: "eigenvalue ของ `A` เป็นจำนวนจริงทั้งหมด", en: "All eigenvalues of `A` are real" }, why: { th: "ผิด (ข้อความนี้จริง) — เป็นสมบัติหลักของเมทริกซ์สมมาตร", en: "Wrong — this is true and is a defining property of symmetric matrices." } },
      { id: "b", label: { th: "`A` diagonalizable เสมอ", en: "`A` is always diagonalizable" }, why: { th: "ผิด (ข้อความนี้จริง) — ตามทฤษฎีบทสเปกตรัม", en: "Wrong — true, by the spectral theorem." } },
      { id: "c", label: { th: "eigenvector ของ eigenvalue ที่ต่างกันจะตั้งฉากกัน", en: "Eigenvectors from distinct eigenvalues are orthogonal" }, why: { th: "ผิด (ข้อความนี้จริง) — จึงสร้าง P ที่ orthogonal ได้หลัง normalize", en: "Wrong — true, which is why normalizing them yields an orthogonal P." } },
      { id: "d", label: { th: "`A` ต้องหาตัวผกผันได้เสมอ", en: "`A` must always be invertible" }, why: { th: "ถูกต้อง (คือข้อที่ผิด) — เมทริกซ์ศูนย์เป็นสมมาตรแต่ singular ความสมมาตรไม่รับประกัน `det ≠ 0`", en: "Correct — this is the false one. The zero matrix is symmetric yet singular; symmetry says nothing about `det`." } },
    ],
    correctId: "d",
    sourceRef: "summarize.md Week 7 §Symmetric Matrix",
  },
];
