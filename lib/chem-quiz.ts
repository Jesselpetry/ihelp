import type { LText } from "@/lib/i18n";
import type { QuizQuestion } from "@/lib/quiz";

// EN-KMITL General Chemistry — 60-question mock exam
// Source: /Users/chatan/Downloads/CH-EN/quiz.md (KMITL, 2569)
// 5-choice MCQ: options a/b/c/d/e map to ก/ข/ค/ง/จ
export const CHEM_QUIZ_ID = 900002;

export interface ChemChapter {
  chapter: number;
  title: LText;
}

export const CHEM_CHAPTERS: ChemChapter[] = [
  { chapter: 1, title: { th: "โครงสร้างอะตอม", en: "Atomic Structure" } },
  { chapter: 2, title: { th: "ตารางธาตุ", en: "Periodic Table" } },
  { chapter: 3, title: { th: "พันธะเคมี", en: "Chemical Bonding" } },
  { chapter: 4, title: { th: "ปริมาณสารสัมพันธ์", en: "Stoichiometry" } },
  { chapter: 5, title: { th: "ของเหลวและสารละลาย", en: "Liquids & Solutions" } },
];

export const CHEM_QUIZ: QuizQuestion[] = [
  // ══ Chapter 1: Atomic Structure — Easy (q1–q4) ════════════════════════════
  {
    id: "chem-q1",
    kind: "mcq",
    chapter: 1,
    prompt: {
      th: "นักวิทยาศาสตร์ท่านใดเป็นผู้ค้นพบ \"นิวเคลียส\" ของอะตอม จากการทดลองยิงอนุภาคแอลฟาผ่านแผ่นทองคำบาง ๆ",
      en: "Which scientist discovered the atomic nucleus by firing alpha particles through thin gold foil?",
    },
    options: [
      { id: "a", label: { th: "ก. Robert Millikan", en: "Robert Millikan" }, why: { th: "ผิด — Millikan ทดลองหยดน้ำมัน หาประจุอิเล็กตรอน", en: "Wrong — Millikan performed the oil-drop experiment to find the electron charge." } },
      { id: "b", label: { th: "ข. J.J. Thomson", en: "J.J. Thomson" }, why: { th: "ผิด — Thomson ค้นพบอิเล็กตรอนและเสนอแบบจำลองขนมปังลูกเกด", en: "Wrong — Thomson discovered the electron and proposed the plum-pudding model." } },
      { id: "c", label: { th: "ค. John Dalton", en: "John Dalton" }, why: { th: "ผิด — Dalton เสนอทฤษฎีอะตอม (1808) ยังไม่รู้โครงสร้างภายใน", en: "Wrong — Dalton proposed the atomic theory (1808) but knew nothing about internal structure." } },
      { id: "d", label: { th: "ง. Ernest Rutherford", en: "Ernest Rutherford" }, why: { th: "ถูกต้อง — Rutherford (1911) พบอนุภาคบางส่วนสะท้อนกลับ → สรุปว่ามีนิวเคลียสขนาดเล็กมีประจุบวก", en: "Correct — Rutherford (1911) found some particles deflected back → concluded atoms have a small, dense, positively-charged nucleus." } },
      { id: "e", label: { th: "จ. James Chadwick", en: "James Chadwick" }, why: { th: "ผิด — Chadwick ค้นพบนิวตรอน (1932)", en: "Wrong — Chadwick discovered the neutron (1932)." } },
    ],
    correctId: "d",
    sourceRef: "quiz.md ข้อ 1",
  },
  {
    id: "chem-q2",
    kind: "mcq",
    chapter: 1,
    prompt: {
      th: "อะตอมของธาตุ ⁵⁶₂₆Fe มีจำนวนนิวตรอนกี่อนุภาค",
      en: "How many neutrons does an atom of ⁵⁶₂₆Fe have?",
    },
    options: [
      { id: "a", label: { th: "ก. 24", en: "24" }, why: { th: "ผิด — คำนวณผิด", en: "Wrong — arithmetic error." } },
      { id: "b", label: { th: "ข. 26", en: "26" }, why: { th: "ผิด — 26 คือจำนวนโปรตอน (Z) ไม่ใช่นิวตรอน", en: "Wrong — 26 is the proton count (Z), not neutrons." } },
      { id: "c", label: { th: "ค. 30", en: "30" }, why: { th: "ถูกต้อง — นิวตรอน = A − Z = 56 − 26 = 30", en: "Correct — neutrons = A − Z = 56 − 26 = 30." } },
      { id: "d", label: { th: "ง. 56", en: "56" }, why: { th: "ผิด — 56 คือเลขมวล A (โปรตอน + นิวตรอน)", en: "Wrong — 56 is the mass number A (protons + neutrons)." } },
      { id: "e", label: { th: "จ. 82", en: "82" }, why: { th: "ผิด — 82 = A + Z (บวกแทนที่จะลบ)", en: "Wrong — 82 = A + Z (added instead of subtracted)." } },
    ],
    correctId: "c",
    sourceRef: "quiz.md ข้อ 2",
  },
  {
    id: "chem-q3",
    kind: "mcq",
    chapter: 1,
    prompt: {
      th: "ระดับพลังงานหลัก n = 3 บรรจุอิเล็กตรอนได้มากที่สุดกี่ตัว",
      en: "What is the maximum number of electrons in the principal energy level n = 3?",
    },
    options: [
      { id: "a", label: { th: "ก. 6", en: "6" }, why: { th: "ผิด — 6 คือ e⁻ สูงสุดในซับเชลล์ p เท่านั้น", en: "Wrong — 6 is the max for the p subshell only." } },
      { id: "b", label: { th: "ข. 9", en: "9" }, why: { th: "ผิด — 9 คือ n² = จำนวนออร์บิทัล ไม่ใช่จำนวนอิเล็กตรอน", en: "Wrong — 9 = n² = number of orbitals, not electrons." } },
      { id: "c", label: { th: "ค. 10", en: "10" }, why: { th: "ผิด — 10 คือ e⁻ สูงสุดในซับเชลล์ d", en: "Wrong — 10 is the max for the d subshell only." } },
      { id: "d", label: { th: "ง. 18", en: "18" }, why: { th: "ถูกต้อง — 2n² = 2(3)² = 18 ตรวจสอบ: 3s(2) + 3p(6) + 3d(10) = 18", en: "Correct — 2n² = 2(3)² = 18. Check: 3s(2) + 3p(6) + 3d(10) = 18." } },
      { id: "e", label: { th: "จ. 32", en: "32" }, why: { th: "ผิด — 32 คือ 2n² ของ n = 4", en: "Wrong — 32 = 2n² for n = 4." } },
    ],
    correctId: "d",
    sourceRef: "quiz.md ข้อ 3",
  },
  {
    id: "chem-q4",
    kind: "mcq",
    chapter: 1,
    prompt: {
      th: "ซับเชลล์ 3d ประกอบด้วยออร์บิทัลทั้งหมดกี่ออร์บิทัล",
      en: "How many orbitals are in the 3d subshell?",
    },
    options: [
      { id: "a", label: { th: "ก. 7", en: "7" }, why: { th: "ผิด — 7 คือออร์บิทัลในซับเชลล์ f (ℓ=3)", en: "Wrong — 7 is for the f subshell (ℓ=3)." } },
      { id: "b", label: { th: "ข. 3", en: "3" }, why: { th: "ผิด — 3 คือออร์บิทัลในซับเชลล์ p (ℓ=1)", en: "Wrong — 3 is for the p subshell (ℓ=1)." } },
      { id: "c", label: { th: "ค. 1", en: "1" }, why: { th: "ผิด — 1 คือออร์บิทัลในซับเชลล์ s (ℓ=0)", en: "Wrong — 1 is for the s subshell (ℓ=0)." } },
      { id: "d", label: { th: "ง. 5", en: "5" }, why: { th: "ถูกต้อง — ซับเชลล์ d มี ℓ=2 → จำนวนออร์บิทัล = 2ℓ+1 = 5 (m_ℓ = -2,-1,0,+1,+2)", en: "Correct — d subshell has ℓ=2 → 2ℓ+1 = 5 orbitals (m_ℓ = −2,−1,0,+1,+2)." } },
      { id: "e", label: { th: "จ. 10", en: "10" }, why: { th: "ผิด — 10 คือจำนวนอิเล็กตรอนสูงสุดใน d (5 ออร์บิทัล × 2) ไม่ใช่จำนวนออร์บิทัล", en: "Wrong — 10 is the max electrons in d (5 orbitals × 2), not the orbital count." } },
    ],
    correctId: "d",
    sourceRef: "quiz.md ข้อ 4",
  },

  // ══ Chapter 2: Periodic Table — Easy (q5–q8) ══════════════════════════════
  {
    id: "chem-q5",
    kind: "mcq",
    chapter: 2,
    prompt: {
      th: "ตารางธาตุในปัจจุบันจัดเรียงธาตุตามสมบัติใด",
      en: "The modern periodic table orders elements by which property?",
    },
    options: [
      { id: "a", label: { th: "ก. จำนวนนิวตรอนที่เพิ่มขึ้น", en: "Increasing neutron number" }, why: { th: "ผิด — จำนวนนิวตรอนไม่ได้เรียงเป็นระบบในตารางธาตุ", en: "Wrong — neutron numbers do not increase systematically in the periodic table." } },
      { id: "b", label: { th: "ข. มวลอะตอมที่เพิ่มขึ้น", en: "Increasing atomic mass" }, why: { th: "ผิด — เป็นวิธีของ Mendeleev (1869) ซึ่งมีจุดผิดพลาด", en: "Wrong — that was Mendeleev's (1869) method, which had anomalies." } },
      { id: "c", label: { th: "ค. เลขอะตอมที่เพิ่มขึ้น", en: "Increasing atomic number (Z)" }, why: { th: "ถูกต้อง — Moseley (1913) แก้ไขให้จัดตาม Z ซึ่งแก้ปัญหาคู่สลับที่เช่น Ar/K และ Te/I", en: "Correct — Moseley (1913) corrected the table by ordering by Z, resolving swapped pairs like Ar/K and Te/I." } },
      { id: "d", label: { th: "ง. ความหนาแน่นที่เพิ่มขึ้น", en: "Increasing density" }, why: { th: "ผิด — ความหนาแน่นไม่ได้เรียงตามระบบตารางธาตุ", en: "Wrong — density does not increase systematically across the periodic table." } },
      { id: "e", label: { th: "จ. จุดหลอมเหลวที่เพิ่มขึ้น", en: "Increasing melting point" }, why: { th: "ผิด — จุดหลอมเหลวไม่ได้เรียงเป็นระบบ", en: "Wrong — melting points do not increase systematically." } },
    ],
    correctId: "c",
    sourceRef: "quiz.md ข้อ 5",
  },
  {
    id: "chem-q6",
    kind: "mcq",
    chapter: 2,
    prompt: {
      th: "ธาตุใดมีค่าอิเล็กโทรเนกาติวิตี (EN) สูงที่สุดในตารางธาตุ",
      en: "Which element has the highest electronegativity in the periodic table?",
    },
    options: [
      { id: "a", label: { th: "ก. O", en: "O" }, why: { th: "ผิด — O มี EN = 3.5 สูงอันดับ 2 รองจาก F", en: "Wrong — O has EN = 3.5, second highest after F." } },
      { id: "b", label: { th: "ข. F", en: "F" }, why: { th: "ถูกต้อง — F มี EN = 4.0 สูงสุดในตารางธาตุ อยู่มุมขวาบน", en: "Correct — F has EN = 4.0, the highest in the periodic table, sitting in the top-right corner." } },
      { id: "c", label: { th: "ค. Cl", en: "Cl" }, why: { th: "ผิด — Cl มี EN = 3.0 ต่ำกว่า F และ O", en: "Wrong — Cl has EN = 3.0, lower than both F and O." } },
      { id: "d", label: { th: "ง. N", en: "N" }, why: { th: "ผิด — N มี EN = 3.0 เท่ากับ Cl แต่ก็ยังต่ำกว่า F", en: "Wrong — N has EN = 3.0, same as Cl, still lower than F." } },
      { id: "e", label: { th: "จ. He", en: "He" }, why: { th: "ผิด — ก๊าซเฉื่อยโดยทั่วไปไม่กำหนดค่า EN เพราะไม่สร้างพันธะ", en: "Wrong — noble gases are generally not assigned EN values as they do not form bonds." } },
    ],
    correctId: "b",
    sourceRef: "quiz.md ข้อ 6",
  },
  {
    id: "chem-q7",
    kind: "mcq",
    chapter: 2,
    prompt: {
      th: "ประจุนิวเคลียสสุทธิ (Z_eff) ของอะตอมคลอรีน (Z = 17) มีค่าเท่าใด (คำนวณแบบ Z_eff = Z − อิเล็กตรอนชั้นใน)",
      en: "What is the effective nuclear charge (Z_eff) of Cl (Z = 17)? (Using Z_eff = Z − inner electrons)",
    },
    options: [
      { id: "a", label: { th: "ก. 5", en: "5" }, why: { th: "ผิด — 5 คือ Z_eff ของ P", en: "Wrong — 5 is Z_eff of P." } },
      { id: "b", label: { th: "ข. 6", en: "6" }, why: { th: "ผิด — 6 คือ Z_eff ของ S", en: "Wrong — 6 is Z_eff of S." } },
      { id: "c", label: { th: "ค. 7", en: "7" }, why: { th: "ถูกต้อง — Cl: 1s²2s²2p⁶3s²3p⁵ → อิเล็กตรอนชั้นใน = 10 → Z_eff = 17−10 = 7 (= เวเลนซ์อิเล็กตรอน)", en: "Correct — Cl config: 1s²2s²2p⁶3s²3p⁵ → inner electrons = 10 → Z_eff = 17−10 = 7 (= valence electrons)." } },
      { id: "d", label: { th: "ง. 10", en: "10" }, why: { th: "ผิด — 10 คือจำนวนอิเล็กตรอนชั้นใน (S) ไม่ใช่ Z_eff", en: "Wrong — 10 is the count of inner electrons (S), not Z_eff." } },
      { id: "e", label: { th: "จ. 17", en: "17" }, why: { th: "ผิด — 17 คือเลขอะตอม Z ยังไม่ได้หักผลกำบัง", en: "Wrong — 17 is the atomic number Z, before subtracting shielding." } },
    ],
    correctId: "c",
    sourceRef: "quiz.md ข้อ 7",
  },
  {
    id: "chem-q8",
    kind: "mcq",
    chapter: 2,
    prompt: {
      th: "เมื่อเคลื่อนที่จากซ้ายไปขวาภายในคาบเดียวกันของตารางธาตุ ขนาดอะตอมจะเปลี่ยนแปลงอย่างไร",
      en: "Moving left to right across a period, how does atomic size change?",
    },
    options: [
      { id: "a", label: { th: "ก. ลดลงแล้วเพิ่มขึ้น", en: "Decreases then increases" }, why: { th: "ผิด — ขนาดลดลงอย่างสม่ำเสมอตลอดคาบ ไม่มีการกลับทิศ", en: "Wrong — size decreases steadily across a period without reversal." } },
      { id: "b", label: { th: "ข. เพิ่มขึ้นเรื่อย ๆ", en: "Increases steadily" }, why: { th: "ผิด — เป็นแนวโน้มเมื่อลงมาในหมู่เดียวกัน ไม่ใช่ในคาบ", en: "Wrong — that is the trend going down a group, not across a period." } },
      { id: "c", label: { th: "ค. คงที่ไม่เปลี่ยนแปลง", en: "Stays constant" }, why: { th: "ผิด — Z_eff เพิ่มขึ้นตลอดคาบ ทำให้ขนาดเล็กลง", en: "Wrong — Z_eff increases across the period, pulling electrons in." } },
      { id: "d", label: { th: "ง. เพิ่มขึ้นแล้วลดลง", en: "Increases then decreases" }, why: { th: "ผิด — ไม่มีการกลับทิศในคาบเดียวกัน", en: "Wrong — there is no reversal within a period." } },
      { id: "e", label: { th: "จ. ลดลงเรื่อย ๆ", en: "Decreases steadily" }, why: { th: "ถูกต้อง — Z เพิ่มขึ้นแต่ชั้นอิเล็กตรอนเท่าเดิม → Z_eff สูงขึ้น → ดึงอิเล็กตรอนเข้าใกล้นิวเคลียสมากขึ้น → อะตอมเล็กลง", en: "Correct — Z increases but electron shells stay the same → higher Z_eff → electrons pulled closer → smaller atom." } },
    ],
    correctId: "e",
    sourceRef: "quiz.md ข้อ 8",
  },

  // ══ Chapter 3: Chemical Bonding — Easy (q9–q12) ═══════════════════════════
  {
    id: "chem-q9",
    kind: "mcq",
    chapter: 3,
    prompt: {
      th: "โมเลกุล CH₄ มีรูปร่างโมเลกุลและมุมพันธะเป็นอย่างไร",
      en: "What is the molecular shape and bond angle of CH₄?",
    },
    options: [
      { id: "a", label: { th: "ก. สามเหลี่ยมแบนราบ, 120°", en: "Trigonal planar, 120°" }, why: { th: "ผิด — คือรูปร่างของ AX₃ เช่น BF₃", en: "Wrong — that is AX₃ geometry e.g., BF₃." } },
      { id: "b", label: { th: "ข. ทรงสี่หน้า, 109.5°", en: "Tetrahedral, 109.5°" }, why: { th: "ถูกต้อง — C มี 4 พันธะ ไม่มีคู่โดดเดี่ยว → AX₄ → Tetrahedral, sp³, 109.5°", en: "Correct — C has 4 bonds, no lone pairs → AX₄ → Tetrahedral, sp³, 109.5°." } },
      { id: "c", label: { th: "ค. เส้นตรง, 180°", en: "Linear, 180°" }, why: { th: "ผิด — คือรูปร่างของ AX₂ เช่น BeCl₂, CO₂", en: "Wrong — that is AX₂ geometry e.g., BeCl₂, CO₂." } },
      { id: "d", label: { th: "ง. พีระมิดฐานสามเหลี่ยม, 107°", en: "Trigonal pyramidal, 107°" }, why: { th: "ผิด — คือ AX₃E (มีคู่โดดเดี่ยว 1 คู่) เช่น NH₃", en: "Wrong — that is AX₃E (1 lone pair) e.g., NH₃." } },
      { id: "e", label: { th: "จ. มุมงอ, 104.5°", en: "Bent, 104.5°" }, why: { th: "ผิด — คือ AX₂E₂ (2 คู่โดดเดี่ยว) เช่น H₂O", en: "Wrong — that is AX₂E₂ (2 lone pairs) e.g., H₂O." } },
    ],
    correctId: "b",
    sourceRef: "quiz.md ข้อ 9",
  },
  {
    id: "chem-q10",
    kind: "mcq",
    chapter: 3,
    prompt: {
      th: "พันธะสาม (Triple bond) ประกอบด้วยพันธะชนิดใดบ้าง",
      en: "A triple bond consists of which types of bonds?",
    },
    options: [
      { id: "a", label: { th: "ก. พันธะซิกมา 1 พันธะ และพันธะพาย 1 พันธะ", en: "1 sigma and 1 pi bond" }, why: { th: "ผิด — นั่นคือพันธะคู่", en: "Wrong — that describes a double bond." } },
      { id: "b", label: { th: "ข. พันธะซิกมา 2 พันธะ และพันธะพาย 1 พันธะ", en: "2 sigma and 1 pi bond" }, why: { th: "ผิด — ระหว่างอะตอม 2 ตัวมี σ ได้เพียง 1 พันธะ", en: "Wrong — only one σ bond can form between two atoms." } },
      { id: "c", label: { th: "ค. พันธะซิกมา 3 พันธะ", en: "3 sigma bonds" }, why: { th: "ผิด — σ เกิดได้แค่ 1 พันธะต่อคู่อะตอม", en: "Wrong — only one σ bond per pair of atoms is possible." } },
      { id: "d", label: { th: "ง. พันธะพาย 3 พันธะ", en: "3 pi bonds" }, why: { th: "ผิด — ต้องมี σ เป็นโครงหลักก่อนเสมอ", en: "Wrong — there must be a σ bond as the framework first." } },
      { id: "e", label: { th: "จ. พันธะซิกมา 1 พันธะ และพันธะพาย 2 พันธะ", en: "1 sigma and 2 pi bonds" }, why: { th: "ถูกต้อง — กฎ: พันธะแรกเป็น σ เสมอ ส่วนที่เหลือเป็น π → triple bond = 1σ + 2π (เช่น N≡N, C≡C)", en: "Correct — rule: first bond is always σ, rest are π → triple bond = 1σ + 2π (e.g., N≡N, C≡C)." } },
    ],
    correctId: "e",
    sourceRef: "quiz.md ข้อ 10",
  },
  {
    id: "chem-q11",
    kind: "mcq",
    chapter: 3,
    prompt: {
      th: "อันดับพันธะ (Bond order) ของโมเลกุล N₂ ตามทฤษฎีออร์บิทัลเชิงโมเลกุล (MO) มีค่าเท่าใด",
      en: "What is the bond order of N₂ according to molecular orbital (MO) theory?",
    },
    options: [
      { id: "a", label: { th: "ก. 1", en: "1" }, why: { th: "ผิด — BO=1 คือ H₂, F₂", en: "Wrong — BO=1 is H₂ and F₂." } },
      { id: "b", label: { th: "ข. 1.5", en: "1.5" }, why: { th: "ผิด — BO=1.5 คือ O₂⁻", en: "Wrong — BO=1.5 is O₂⁻." } },
      { id: "c", label: { th: "ค. 2", en: "2" }, why: { th: "ผิด — BO=2 คือ O₂", en: "Wrong — BO=2 is O₂." } },
      { id: "d", label: { th: "ง. 3", en: "3" }, why: { th: "ถูกต้อง — N₂ มี 10 เวเลนซ์ e⁻: bonding=8, antibonding=2 → BO=(8−2)/2=3 → สอดคล้องกับโครงสร้างลิวอิส N≡N", en: "Correct — N₂ has 10 valence e⁻: bonding=8, antibonding=2 → BO=(8−2)/2=3, consistent with Lewis structure N≡N." } },
      { id: "e", label: { th: "จ. 2.5", en: "2.5" }, why: { th: "ผิด — BO=2.5 คือ NO", en: "Wrong — BO=2.5 is NO." } },
    ],
    correctId: "d",
    sourceRef: "quiz.md ข้อ 11",
  },
  {
    id: "chem-q12",
    kind: "mcq",
    chapter: 3,
    prompt: {
      th: "พันธะไฮโดรเจนจะเกิดขึ้นได้เมื่ออะตอมไฮโดรเจนสร้างพันธะโดยตรงกับธาตุใด",
      en: "Hydrogen bonding occurs when a hydrogen atom is directly bonded to which element(s)?",
    },
    options: [
      { id: "a", label: { th: "ก. F, O, N", en: "F, O, N" }, why: { th: "ถูกต้อง — H-bond เกิดเมื่อ H ต่อกับ F, O, N (EN สูงและขนาดเล็ก) — จำง่าย: FON", en: "Correct — H-bonds form when H is bonded to F, O, or N (high EN and small size) — remember: FON." } },
      { id: "b", label: { th: "ข. C, N, O", en: "C, N, O" }, why: { th: "ผิด — C มี EN เพียง 2.5 ต่ำเกินไป C–H ไม่เกิดพันธะไฮโดรเจน", en: "Wrong — C has EN of only 2.5, too low; C–H bonds do not form hydrogen bonds." } },
      { id: "c", label: { th: "ค. Cl, Br, I", en: "Cl, Br, I" }, why: { th: "ผิด — แม้ Cl มี EN เท่า N แต่ขนาดอะตอมใหญ่เกินไป → ความหนาแน่นประจุต่ำ → HCl ไม่มีพันธะไฮโดรเจน", en: "Wrong — even though Cl has EN similar to N, its large size gives low charge density → HCl has no H-bonds." } },
      { id: "d", label: { th: "ง. S, P, Si", en: "S, P, Si" }, why: { th: "ผิด — EN ต่ำและขนาดใหญ่ ไม่เหมาะกับพันธะไฮโดรเจน", en: "Wrong — low EN and large size; not suitable for hydrogen bonding." } },
      { id: "e", label: { th: "จ. C, H, S", en: "C, H, S" }, why: { th: "ผิด — ไม่ถูกต้องทั้งหมด", en: "Wrong — none of these correctly qualify." } },
    ],
    correctId: "a",
    sourceRef: "quiz.md ข้อ 12",
  },

  // ══ Chapter 4: Stoichiometry — Easy (q13–q16) ════════════════════════════
  {
    id: "chem-q13",
    kind: "mcq",
    chapter: 4,
    prompt: {
      th: "สาร 1 โมล ประกอบด้วยอนุภาคจำนวนเท่าใด",
      en: "How many particles are in 1 mole of a substance?",
    },
    options: [
      { id: "a", label: { th: "ก. 6.02 × 10²²", en: "6.02 × 10²²" }, why: { th: "ผิด — เลขชี้กำลังผิด (ต้องเป็น 23)", en: "Wrong — wrong exponent (must be 23)." } },
      { id: "b", label: { th: "ข. 6.02 × 10²³", en: "6.02 × 10²³" }, why: { th: "ถูกต้อง — เลขอาโวกาโดร (Avogadro's number) = 6.02 × 10²³ อนุภาค/โมล", en: "Correct — Avogadro's number = 6.02 × 10²³ particles/mol." } },
      { id: "c", label: { th: "ค. 6.02 × 10²⁴", en: "6.02 × 10²⁴" }, why: { th: "ผิด — เลขชี้กำลังผิด (ต้องเป็น 23)", en: "Wrong — wrong exponent (must be 23)." } },
      { id: "d", label: { th: "ง. 1.66 × 10⁻²⁴", en: "1.66 × 10⁻²⁴" }, why: { th: "ผิด — คือมวลของ 1 หน่วยมวลอะตอม (1 u) ในหน่วยกรัม ซึ่งเป็นส่วนกลับของ Nₐ", en: "Wrong — that is the mass of 1 atomic mass unit (1 u) in grams, the reciprocal of Nₐ." } },
      { id: "e", label: { th: "จ. 22.4 × 10²³", en: "22.4 × 10²³" }, why: { th: "ผิด — สับสนกับ 22.4 dm³ ซึ่งเป็นปริมาตรของแก๊ส 1 โมลที่ STP", en: "Wrong — confused with 22.4 dm³, the molar volume of a gas at STP." } },
    ],
    correctId: "b",
    sourceRef: "quiz.md ข้อ 13",
  },
  {
    id: "chem-q14",
    kind: "mcq",
    chapter: 4,
    prompt: {
      th: "มวลโมเลกุลของ Ca(NO₃)₂ มีค่าเท่าใด (Ca=40.08, N=14.01, O=16.00)",
      en: "What is the molar mass of Ca(NO₃)₂? (Ca=40.08, N=14.01, O=16.00)",
    },
    options: [
      { id: "a", label: { th: "ก. 102.1", en: "102.1" }, why: { th: "ผิด — ลืมคูณ 2 เข้าวงเล็บ (นับ N 1 ตัว, O 3 ตัว)", en: "Wrong — forgot to distribute the subscript 2 (counted N once, O three times)." } },
      { id: "b", label: { th: "ข. 118.1", en: "118.1" }, why: { th: "ผิด — นับจำนวนอะตอมไม่ครบ", en: "Wrong — incorrect atom counts." } },
      { id: "c", label: { th: "ค. 148.1", en: "148.1" }, why: { th: "ผิด — นับจำนวนอะตอมไม่ครบ", en: "Wrong — incorrect atom counts." } },
      { id: "d", label: { th: "ง. 180.1", en: "180.1" }, why: { th: "ผิด — 180.1 คือ MW ของกลูโคส C₆H₁₂O₆", en: "Wrong — 180.1 is the MW of glucose C₆H₁₂O₆." } },
      { id: "e", label: { th: "จ. 164.1", en: "164.1" }, why: { th: "ถูกต้อง — Ca: 40.08, N: 2×14.01=28.02, O: 6×16.00=96.00 → รวม = 164.1", en: "Correct — Ca: 40.08, N: 2×14.01=28.02, O: 6×16.00=96.00 → total = 164.1." } },
    ],
    correctId: "e",
    sourceRef: "quiz.md ข้อ 14",
  },
  {
    id: "chem-q15",
    kind: "mcq",
    chapter: 4,
    prompt: {
      th: "NaCl หนัก 117 กรัม (MW = 58.5 g/mol) คิดเป็นกี่โมล",
      en: "How many moles are in 117 g of NaCl (MW = 58.5 g/mol)?",
    },
    options: [
      { id: "a", label: { th: "ก. 0.5 โมล", en: "0.5 mol" }, why: { th: "ผิด — กลับเศษกับส่วน (58.5/117)", en: "Wrong — inverted numerator and denominator (58.5/117)." } },
      { id: "b", label: { th: "ข. 1 โมล", en: "1 mol" }, why: { th: "ผิด — ใช้มวล 58.5 g (1 โมลพอดี) ไม่ใช่ 117 g", en: "Wrong — that would be for 58.5 g (exactly 1 mol)." } },
      { id: "c", label: { th: "ค. 2 โมล", en: "2 mol" }, why: { th: "ถูกต้อง — n = 117/58.5 = 2 โมล", en: "Correct — n = 117/58.5 = 2 mol." } },
      { id: "d", label: { th: "ง. 3 โมล", en: "3 mol" }, why: { th: "ผิด — คำนวณผิด", en: "Wrong — arithmetic error." } },
      { id: "e", label: { th: "จ. 4 โมล", en: "4 mol" }, why: { th: "ผิด — คำนวณผิด", en: "Wrong — arithmetic error." } },
    ],
    correctId: "c",
    sourceRef: "quiz.md ข้อ 15",
  },
  {
    id: "chem-q16",
    kind: "mcq",
    chapter: 4,
    prompt: {
      th: "เมื่อดุลสมการ C₅H₁₂(g) + ___O₂(g) → 5CO₂(g) + 6H₂O(l) ให้ถูกต้อง สัมประสิทธิ์หน้า O₂ คือข้อใด",
      en: "When the equation C₅H₁₂(g) + ___O₂(g) → 5CO₂(g) + 6H₂O(l) is balanced, what is the coefficient of O₂?",
    },
    options: [
      { id: "a", label: { th: "ก. 5", en: "5" }, why: { th: "ผิด — ตรวจ O: ซ้าย 10, ขวา 10+6=16 ไม่ดุล", en: "Wrong — check O: left 10, right 10+6=16; not balanced." } },
      { id: "b", label: { th: "ข. 6", en: "6" }, why: { th: "ผิด — ตรวจ O: ซ้าย 12, ขวา 16 ไม่ดุล", en: "Wrong — check O: left 12, right 16; not balanced." } },
      { id: "c", label: { th: "ค. 7", en: "7" }, why: { th: "ผิด — ตรวจ O: ซ้าย 14, ขวา 16 ไม่ดุล", en: "Wrong — check O: left 14, right 16; not balanced." } },
      { id: "d", label: { th: "ง. 8", en: "8" }, why: { th: "ถูกต้อง — O ซ้าย: 8×2=16; O ขวา: 5×2+6×1=16 ✔ C: 5=5 ✔ H: 12=12 ✔", en: "Correct — O left: 8×2=16; O right: 5×2+6×1=16 ✔ C: 5=5 ✔ H: 12=12 ✔." } },
      { id: "e", label: { th: "จ. 11", en: "11" }, why: { th: "ผิด — ตรวจ O: ซ้าย 22, ขวา 16 ไม่ดุล", en: "Wrong — check O: left 22, right 16; not balanced." } },
    ],
    correctId: "d",
    sourceRef: "quiz.md ข้อ 16",
  },

  // ══ Chapter 5: Liquids & Solutions — Easy (q17–q20) ══════════════════════
  {
    id: "chem-q17",
    kind: "mcq",
    chapter: 5,
    prompt: {
      th: "\"ความสามารถในการละลาย (Solubility)\" ในบทเรียนนี้มีหน่วยเป็นอะไร",
      en: "In this course, what unit is used for solubility?",
    },
    options: [
      { id: "a", label: { th: "ก. โมลของตัวถูกละลายต่อสารละลาย 1 ลิตร", en: "mol solute per L of solution" }, why: { th: "ผิด — นั่นคือหน่วยของ Molarity (M)", en: "Wrong — that is the unit for Molarity (M)." } },
      { id: "b", label: { th: "ข. กรัมของตัวถูกละลายในตัวทำละลาย 100 กรัม", en: "g solute per 100 g solvent" }, why: { th: "ถูกต้อง — ค่า Solubility มักรายงานเป็น g/100 g ตัวทำละลาย", en: "Correct — solubility is commonly reported as g solute per 100 g of solvent." } },
      { id: "c", label: { th: "ค. โมลของตัวถูกละลายต่อตัวทำละลาย 1 กิโลกรัม", en: "mol solute per kg solvent" }, why: { th: "ผิด — นั่นคือหน่วยของ Molality (m)", en: "Wrong — that is the unit for Molality (m)." } },
      { id: "d", label: { th: "ง. กรัมของตัวถูกละลายต่อสารละลาย 1 ลิตร", en: "g solute per L of solution" }, why: { th: "ผิด — นั่นคือ concentration by mass-volume", en: "Wrong — that is mass-volume concentration." } },
      { id: "e", label: { th: "จ. เศษส่วนโมลของตัวถูกละลาย", en: "Mole fraction of solute" }, why: { th: "ผิด — เศษส่วนโมลไม่มีหน่วย ไม่ใช่ Solubility", en: "Wrong — mole fraction is dimensionless and is not solubility." } },
    ],
    correctId: "b",
    sourceRef: "quiz.md ข้อ 17",
  },
  {
    id: "chem-q18",
    kind: "mcq",
    chapter: 5,
    prompt: {
      th: "ปรากฏการณ์ทินดอลล์ (Tyndall effect) นำมาใช้ประโยชน์ในเรื่องใด",
      en: "The Tyndall effect is used to distinguish what?",
    },
    options: [
      { id: "a", label: { th: "ก. บ่งชี้ว่าสารเป็นกรดหรือเบส", en: "Identify acids or bases" }, why: { th: "ผิด — การทดสอบกรด-เบสใช้อินดิเคเตอร์หรือ pH meter", en: "Wrong — acid-base testing uses indicators or pH meters." } },
      { id: "b", label: { th: "ข. บ่งชี้ว่าเป็นสารละลายหรือคอลลอยด์", en: "Distinguish true solutions from colloids" }, why: { th: "ถูกต้อง — อนุภาคคอลลอยด์ (1-1000 nm) กระเจิงแสงได้ → เห็นลำแสง แต่สารละลายจริง (<1 nm) ไม่กระเจิง", en: "Correct — colloidal particles (1-1000 nm) scatter light → visible beam; true solutions (<1 nm) do not scatter." } },
      { id: "c", label: { th: "ค. วัดความหนืดของของเหลว", en: "Measure liquid viscosity" }, why: { th: "ผิด — ความหนืดวัดด้วย viscometer", en: "Wrong — viscosity is measured with a viscometer." } },
      { id: "d", label: { th: "ง. หามวลโมเลกุลของตัวถูกละลาย", en: "Find the molar mass of a solute" }, why: { th: "ผิด — มวลโมเลกุลหาได้จากสมบัติคอลลิเกทีฟ (ΔTf, ΔTb, π)", en: "Wrong — molar mass is found using colligative properties (ΔTf, ΔTb, π)." } },
      { id: "e", label: { th: "จ. หาจุดเดือดของสารละลาย", en: "Find the boiling point of a solution" }, why: { th: "ผิด — จุดเดือดวัดด้วยการวัดอุณหภูมิโดยตรง", en: "Wrong — boiling point is found by direct temperature measurement." } },
    ],
    correctId: "b",
    sourceRef: "quiz.md ข้อ 18",
  },
  {
    id: "chem-q19",
    kind: "mcq",
    chapter: 5,
    prompt: {
      th: "ค่าคงที่ของการลดลงของจุดเยือกแข็ง (Kf) ของน้ำมีค่าเท่าใด",
      en: "What is the freezing point depression constant (Kf) of water?",
    },
    options: [
      { id: "a", label: { th: "ก. 0.52 °C/m", en: "0.52 °C/m" }, why: { th: "ผิด — 0.52 คือ Kb ของน้ำ (จุดเดือด) ไม่ใช่ Kf (จุดเยือกแข็ง) ⚠️ ตัวหลอกที่ผิดบ่อยที่สุด!", en: "Wrong — 0.52 is Kb of water (boiling), not Kf (freezing). ⚠️ Most common trap!" } },
      { id: "b", label: { th: "ข. 3.90 °C/m", en: "3.90 °C/m" }, why: { th: "ผิด — 3.90 คือ Kf ของกรดอะซิติก", en: "Wrong — 3.90 is Kf of acetic acid." } },
      { id: "c", label: { th: "ค. 2.53 °C/m", en: "2.53 °C/m" }, why: { th: "ผิด — 2.53 คือ Kb ของเบนซีน", en: "Wrong — 2.53 is Kb of benzene." } },
      { id: "d", label: { th: "ง. 1.86 °C/m", en: "1.86 °C/m" }, why: { th: "ถูกต้อง — Kf(H₂O) = 1.86 °C/m (จำคู่กัน: Kb = 0.52, Kf = 1.86)", en: "Correct — Kf(H₂O) = 1.86 °C/m. (Pair to remember: Kb = 0.52, Kf = 1.86)" } },
      { id: "e", label: { th: "จ. 5.12 °C/m", en: "5.12 °C/m" }, why: { th: "ผิด — 5.12 คือ Kf ของเบนซีน", en: "Wrong — 5.12 is Kf of benzene." } },
    ],
    correctId: "d",
    sourceRef: "quiz.md ข้อ 19",
  },
  {
    id: "chem-q20",
    kind: "mcq",
    chapter: 5,
    prompt: {
      th: "\"จุดเดือดปกติ (Normal boiling point)\" หมายถึงอุณหภูมิที่ความดันไอของของเหลวมีค่าเท่ากับข้อใด",
      en: "\"Normal boiling point\" is the temperature at which a liquid's vapor pressure equals what?",
    },
    options: [
      { id: "a", label: { th: "ก. 0 บรรยากาศ", en: "0 atm" }, why: { th: "ผิด — 0 atm ไม่ใช่ค่ามาตรฐาน", en: "Wrong — 0 atm is not the standard." } },
      { id: "b", label: { th: "ข. 0.5 บรรยากาศ", en: "0.5 atm" }, why: { th: "ผิด — ไม่ใช่ค่ามาตรฐาน", en: "Wrong — not the standard value." } },
      { id: "c", label: { th: "ค. ความดันไอของน้ำที่ 25 °C", en: "Vapor pressure of water at 25 °C" }, why: { th: "ผิด — ความดันไอน้ำที่ 25°C ≈ 23.76 torr ≈ 0.031 atm ไม่ใช่ 1 atm", en: "Wrong — vapor pressure of water at 25°C ≈ 23.76 torr ≈ 0.031 atm, not 1 atm." } },
      { id: "d", label: { th: "ง. 2 บรรยากาศ", en: "2 atm" }, why: { th: "ผิด — ไม่ใช่ค่ามาตรฐาน", en: "Wrong — not the standard." } },
      { id: "e", label: { th: "จ. 1 บรรยากาศ", en: "1 atm" }, why: { th: "ถูกต้อง — จุดเดือดปกติ = อุณหภูมิที่ความดันไอ = 1 atm (760 mmHg) พอดี เช่น น้ำ = 100°C", en: "Correct — normal boiling point = temperature where vapor pressure = 1 atm (760 mmHg), e.g., water = 100°C." } },
    ],
    correctId: "e",
    sourceRef: "quiz.md ข้อ 20",
  },

  // ══ Chapter 1: Atomic Structure — Medium (q21–q25) ════════════════════════
  {
    id: "chem-q21",
    kind: "mcq",
    chapter: 1,
    prompt: {
      th: "อิเล็กตรอนในอะตอมไฮโดรเจนเปลี่ยนระดับพลังงานจาก n=3 ไปยัง n=2 ข้อใดกล่าวถูกต้อง",
      en: "An electron in hydrogen transitions from n=3 to n=2. Which statement is correct?",
    },
    options: [
      { id: "a", label: { th: "ก. คายพลังงาน 3.03 × 10⁻¹⁹ J", en: "Releases 3.03 × 10⁻¹⁹ J" }, why: { th: "ถูกต้อง — ΔE = −2.18×10⁻¹⁸(1/4−1/9) = −3.03×10⁻¹⁹ J (ลบ = คาย) → เปล่งแสงสีแดง λ=656 nm อนุกรม Balmer", en: "Correct — ΔE = −2.18×10⁻¹⁸(1/4−1/9) = −3.03×10⁻¹⁹ J (negative = released) → red light λ=656 nm, Balmer series." } },
      { id: "b", label: { th: "ข. ไม่มีการเปลี่ยนแปลงพลังงาน", en: "No energy change" }, why: { th: "ผิด — การเปลี่ยนระดับพลังงานต้องมีการเปลี่ยนแปลงพลังงานเสมอ", en: "Wrong — any energy level transition must involve an energy change." } },
      { id: "c", label: { th: "ค. ดูดพลังงาน 1.94 × 10⁻¹⁸ J", en: "Absorbs 1.94 × 10⁻¹⁸ J" }, why: { th: "ผิด — 1.94×10⁻¹⁸ J คือ ΔE ของ n=2→n=1 (อนุกรม Lyman)", en: "Wrong — 1.94×10⁻¹⁸ J is ΔE for n=2→n=1 (Lyman series)." } },
      { id: "d", label: { th: "ง. คายพลังงาน 5.45 × 10⁻¹⁹ J", en: "Releases 5.45 × 10⁻¹⁹ J" }, why: { th: "ผิด — ขนาดผิด (5.45×10⁻¹⁹ คือ E₂ เอง ไม่ใช่ผลต่าง)", en: "Wrong — wrong magnitude (5.45×10⁻¹⁹ is E₂ itself, not the difference)." } },
      { id: "e", label: { th: "จ. ดูดพลังงาน 3.03 × 10⁻¹⁹ J", en: "Absorbs 3.03 × 10⁻¹⁹ J" }, why: { th: "ผิด — ขนาดถูกแต่ทิศทางผิด n=3→n=2 ต้องคาย ไม่ใช่ดูด", en: "Wrong — magnitude correct but direction wrong; n=3→n=2 releases energy, doesn't absorb." } },
    ],
    correctId: "a",
    sourceRef: "quiz.md ข้อ 21",
  },
  {
    id: "chem-q22",
    kind: "mcq",
    chapter: 1,
    prompt: {
      th: "การจัดเรียงอิเล็กตรอนของ Cr (Z=24) ในสถานะพื้นคือข้อใด",
      en: "What is the ground-state electron configuration of Cr (Z=24)?",
    },
    options: [
      { id: "a", label: { th: "ก. [Ar]3d⁴4s²", en: "[Ar]3d⁴4s²" }, why: { th: "ผิด — เป็นคำตอบจากกฎ Aufbau ตรง ๆ แต่ Cr เป็นข้อยกเว้น", en: "Wrong — this is the Aufbau prediction, but Cr is an exception." } },
      { id: "b", label: { th: "ข. [Ar]3d³4s²4p¹", en: "[Ar]3d³4s²4p¹" }, why: { th: "ผิด — ไม่ตรงกับลำดับพลังงาน", en: "Wrong — does not follow energy ordering." } },
      { id: "c", label: { th: "ค. [Ar]3d⁵4s¹", en: "[Ar]3d⁵4s¹" }, why: { th: "ถูกต้อง — Cr เป็นข้อยกเว้น: 3d ครึ่งเต็ม (5) + 4s ครึ่งเต็ม (1) เสถียรกว่า 3d⁴4s²", en: "Correct — Cr is an exception: half-filled 3d (5) + half-filled 4s (1) is more stable than 3d⁴4s²." } },
      { id: "d", label: { th: "ง. [Ar]4s²4p⁴", en: "[Ar]4s²4p⁴" }, why: { th: "ผิด — ต้องเติม 3d ก่อน 4p", en: "Wrong — 3d must be filled before 4p." } },
      { id: "e", label: { th: "จ. [Ar]3d⁶4s⁰", en: "[Ar]3d⁶4s⁰" }, why: { th: "ผิด — จำนวนอิเล็กตรอนเกิน (18+6=24 แต่ e⁻ ชั้นในมี 18 แล้ว รวม = 24 ถูก แต่ 3d⁶ไม่ใช่ข้อยกเว้นสำหรับ Cr)", en: "Wrong — Cr's exception is 3d⁵4s¹ not 3d⁶4s⁰." } },
    ],
    correctId: "c",
    sourceRef: "quiz.md ข้อ 22",
  },
  {
    id: "chem-q23",
    kind: "mcq",
    chapter: 1,
    prompt: {
      th: "ไอออน Fe²⁺ (Z=26) มีอิเล็กตรอนเดี่ยว (unpaired electron) กี่ตัว",
      en: "How many unpaired electrons does Fe²⁺ (Z=26) have?",
    },
    options: [
      { id: "a", label: { th: "ก. 2", en: "2" }, why: { th: "ผิด — นับผิด", en: "Wrong — incorrect count." } },
      { id: "b", label: { th: "ข. 3", en: "3" }, why: { th: "ผิด — นับผิด", en: "Wrong — incorrect count." } },
      { id: "c", label: { th: "ค. 4", en: "4" }, why: { th: "ถูกต้อง — Fe=[Ar]3d⁶4s²; Fe²⁺ ดึง e⁻ จาก 4s ก่อน → [Ar]3d⁶ บรรจุใน 5 ออร์บิทัล: ↑↓↑↑↑↑ → เดี่ยว 4 ตัว", en: "Correct — Fe=[Ar]3d⁶4s²; Fe²⁺ loses 4s electrons first → [Ar]3d⁶. Filling 5 orbitals: ↑↓↑↑↑↑ → 4 unpaired." } },
      { id: "d", label: { th: "ง. 5", en: "5" }, why: { th: "ผิด — 5 คือกรณี Fe³⁺ = [Ar]3d⁵ (d ครึ่งเต็ม)", en: "Wrong — 5 is for Fe³⁺ = [Ar]3d⁵ (half-filled d)." } },
      { id: "e", label: { th: "จ. 6", en: "6" }, why: { th: "ผิด — 6 คือจำนวนอิเล็กตรอนทั้งหมดใน 3d ไม่ใช่จำนวนเดี่ยว", en: "Wrong — 6 is the total number of electrons in 3d, not the unpaired count." } },
    ],
    correctId: "c",
    sourceRef: "quiz.md ข้อ 23",
  },
  {
    id: "chem-q24",
    kind: "mcq",
    chapter: 1,
    prompt: {
      th: "ชุดเลขควอนตัมในข้อใด เป็นไปไม่ได้",
      en: "Which set of quantum numbers is impossible?",
    },
    options: [
      { id: "a", label: { th: "ก. n=2, ℓ=2, mℓ=+1, ms=+½", en: "n=2, ℓ=2, mℓ=+1, ms=+½" }, why: { th: "ถูกต้อง (= เป็นไปไม่ได้) — กฎ: ℓ ได้ 0 ถึง n−1 เท่านั้น สำหรับ n=2 ℓ ได้แค่ 0 หรือ 1 → ℓ=2 ไม่มีอยู่ใน n=2 (ไม่มีซับเชลล์ '2d')", en: "Correct (= impossible) — rule: ℓ ranges from 0 to n−1. For n=2, ℓ can only be 0 or 1 → ℓ=2 is impossible (no '2d' subshell)." } },
      { id: "b", label: { th: "ข. n=3, ℓ=2, mℓ=−2, ms=−½", en: "n=3, ℓ=2, mℓ=−2, ms=−½" }, why: { th: "ผิด (= เป็นไปได้) — n=3, ℓ=2 ≤ n−1=2 ✔, mℓ=−2 อยู่ใน range −2…+2 ✔ คือ 3d", en: "Wrong (= possible) — n=3, ℓ=2 ≤ n−1=2 ✔, mℓ=−2 within range −2…+2 ✔; describes 3d." } },
      { id: "c", label: { th: "ค. n=3, ℓ=1, mℓ=+1, ms=+½", en: "n=3, ℓ=1, mℓ=+1, ms=+½" }, why: { th: "ผิด (= เป็นไปได้) — n=3, ℓ=1 ✔, mℓ=+1 ✔ คือ 3p", en: "Wrong (= possible) — n=3, ℓ=1 ✔, mℓ=+1 ✔; describes 3p." } },
      { id: "d", label: { th: "ง. n=4, ℓ=0, mℓ=0, ms=−½", en: "n=4, ℓ=0, mℓ=0, ms=−½" }, why: { th: "ผิด (= เป็นไปได้) — n=4, ℓ=0 ✔, mℓ=0 ✔ คือ 4s", en: "Wrong (= possible) — n=4, ℓ=0 ✔, mℓ=0 ✔; describes 4s." } },
      { id: "e", label: { th: "จ. n=2, ℓ=1, mℓ=0, ms=+½", en: "n=2, ℓ=1, mℓ=0, ms=+½" }, why: { th: "ผิด (= เป็นไปได้) — n=2, ℓ=1 ✔, mℓ=0 ✔ คือ 2p", en: "Wrong (= possible) — n=2, ℓ=1 ✔, mℓ=0 ✔; describes 2p." } },
    ],
    correctId: "a",
    sourceRef: "quiz.md ข้อ 24",
  },
  {
    id: "chem-q25",
    kind: "mcq",
    chapter: 1,
    prompt: {
      th: "โฟตอนของแสงที่มีความยาวคลื่น 400 nm มีพลังงานเท่าใด (h=6.626×10⁻³⁴ J·s, c=3.00×10⁸ m/s)",
      en: "What is the energy of a photon with wavelength 400 nm? (h=6.626×10⁻³⁴ J·s, c=3.00×10⁸ m/s)",
    },
    options: [
      { id: "a", label: { th: "ก. 2.65 × 10⁻¹⁹ J", en: "2.65 × 10⁻¹⁹ J" }, why: { th: "ผิด — คือพลังงานของแสง λ=750 nm (สีแดง)", en: "Wrong — this is the energy for λ=750 nm (red light)." } },
      { id: "b", label: { th: "ข. 3.31 × 10⁻¹⁹ J", en: "3.31 × 10⁻¹⁹ J" }, why: { th: "ผิด — คือพลังงานของแสง λ=600 nm", en: "Wrong — this is for λ=600 nm." } },
      { id: "c", label: { th: "ค. 5.00 × 10⁻²⁰ J", en: "5.00 × 10⁻²⁰ J" }, why: { th: "ผิด — ลืมแปลง nm→m (×10⁻⁹)", en: "Wrong — forgot to convert nm→m (×10⁻⁹)." } },
      { id: "d", label: { th: "ง. 4.97 × 10⁻¹⁹ J", en: "4.97 × 10⁻¹⁹ J" }, why: { th: "ถูกต้อง — E = hc/λ = (6.626×10⁻³⁴)(3.00×10⁸)/(400×10⁻⁹) = 4.97×10⁻¹⁹ J", en: "Correct — E = hc/λ = (6.626×10⁻³⁴)(3.00×10⁸)/(400×10⁻⁹) = 4.97×10⁻¹⁹ J." } },
      { id: "e", label: { th: "จ. 7.50 × 10⁻¹⁹ J", en: "7.50 × 10⁻¹⁹ J" }, why: { th: "ผิด — คำนวณผิด", en: "Wrong — arithmetic error." } },
    ],
    correctId: "d",
    sourceRef: "quiz.md ข้อ 25",
  },

  // ══ Chapter 2: Periodic Table — Medium (q26–q30) ══════════════════════════
  {
    id: "chem-q26",
    kind: "mcq",
    chapter: 2,
    prompt: {
      th: "จงเรียงลำดับขนาดอะตอมของ K, Na, Al, Cl, Ne จาก เล็กไปใหญ่",
      en: "Order K, Na, Al, Cl, Ne from smallest to largest atomic radius.",
    },
    options: [
      { id: "a", label: { th: "ก. Ne < Al < Cl < K < Na", en: "Ne < Al < Cl < K < Na" }, why: { th: "ผิด — สลับ Al กับ Cl (Al อยู่ซ้ายกว่าใน Period 3 จึงใหญ่กว่า Cl)", en: "Wrong — Al and Cl swapped (Al is to the left in Period 3, so larger than Cl)." } },
      { id: "b", label: { th: "ข. K < Na < Al < Cl < Ne", en: "K < Na < Al < Cl < Ne" }, why: { th: "ผิด — กลับด้านทั้งหมด (นี่คือเรียงจากใหญ่ไปเล็ก)", en: "Wrong — this is largest to smallest." } },
      { id: "c", label: { th: "ค. Cl < Ne < Al < K < Na", en: "Cl < Ne < Al < K < Na" }, why: { th: "ผิด — สลับ Ne กับ Cl ผิด (Ne Period 2 เล็กกว่า Cl Period 3)", en: "Wrong — Ne (Period 2) should be smaller than Cl (Period 3)." } },
      { id: "d", label: { th: "ง. Ne < Cl < Al < Na < K", en: "Ne < Cl < Al < Na < K" }, why: { th: "ถูกต้อง — Period 2<Period 3<Period 4; ในคาบ 3: Cl<Al<Na (ขวา→ซ้าย)", en: "Correct — Period 2 < Period 3 < Period 4; within Period 3: Cl < Al < Na (right→left)." } },
      { id: "e", label: { th: "จ. Na < K < Al < Cl < Ne", en: "Na < K < Al < Cl < Ne" }, why: { th: "ผิด — Na และ K สลับที่ผิด (K Period 4 ต้องใหญ่กว่า Na Period 3)", en: "Wrong — Na and K are swapped (K Period 4 must be larger than Na Period 3)." } },
    ],
    correctId: "d",
    sourceRef: "quiz.md ข้อ 26",
  },
  {
    id: "chem-q27",
    kind: "mcq",
    chapter: 2,
    prompt: {
      th: "จงเรียงลำดับขนาดไอออนต่อไปนี้จาก ใหญ่ไปเล็ก: O²⁻, F⁻, Na⁺, Mg²⁺, Al³⁺",
      en: "Order these isoelectronic ions from largest to smallest: O²⁻, F⁻, Na⁺, Mg²⁺, Al³⁺",
    },
    options: [
      { id: "a", label: { th: "ก. O²⁻ > F⁻ > Na⁺ > Mg²⁺ > Al³⁺", en: "O²⁻ > F⁻ > Na⁺ > Mg²⁺ > Al³⁺" }, why: { th: "ถูกต้อง — ทั้ง 5 มี 10 e⁻ เท่ากัน (isoelectronic) ตัวที่มี Z มากกว่าดึง e⁻ แน่นกว่า → เล็กกว่า O(Z=8) < F(9) < Na(11) < Mg(12) < Al(13)", en: "Correct — all 5 have 10 e⁻ (isoelectronic); more protons = stronger pull = smaller. O(Z=8) < F(9) < Na(11) < Mg(12) < Al(13)." } },
      { id: "b", label: { th: "ข. ทุกไอออนมีขนาดเท่ากันเพราะมีอิเล็กตรอนเท่ากัน", en: "All equal size because they have the same electrons" }, why: { th: "ผิด — Z ต่างกัน ดึงอิเล็กตรอนต่างกัน จึงขนาดต่างกัน", en: "Wrong — different Z pulls electrons differently → different sizes." } },
      { id: "c", label: { th: "ค. Na⁺ > Mg²⁺ > Al³⁺ > O²⁻ > F⁻", en: "Na⁺ > Mg²⁺ > Al³⁺ > O²⁻ > F⁻" }, why: { th: "ผิด — ไอออนลบ (ประจุลบ) ต้องใหญ่กว่าไอออนบวก (ประจุบวก) เสมอในอนุกรมนี้", en: "Wrong — anions must always be larger than cations in this isoelectronic series." } },
      { id: "d", label: { th: "ง. F⁻ > O²⁻ > Al³⁺ > Mg²⁺ > Na⁺", en: "F⁻ > O²⁻ > Al³⁺ > Mg²⁺ > Na⁺" }, why: { th: "ผิด — F⁻ (Z=9) เล็กกว่า O²⁻ (Z=8) ไม่ใช่ใหญ่กว่า", en: "Wrong — F⁻ (Z=9) is smaller than O²⁻ (Z=8), not larger." } },
      { id: "e", label: { th: "จ. Al³⁺ > Mg²⁺ > Na⁺ > F⁻ > O²⁻", en: "Al³⁺ > Mg²⁺ > Na⁺ > F⁻ > O²⁻" }, why: { th: "ผิด — กลับด้านทั้งหมด (นี่คือเรียงจากเล็กไปใหญ่)", en: "Wrong — this is smallest to largest (reversed)." } },
    ],
    correctId: "a",
    sourceRef: "quiz.md ข้อ 27",
  },
  {
    id: "chem-q28",
    kind: "mcq",
    chapter: 2,
    prompt: {
      th: "เพราะเหตุใดพลังงานไอออไนเซชันลำดับที่ 1 (IE₁) ของ B จึงมีค่า น้อยกว่า Be ทั้งที่ B อยู่ทางขวาของ Be",
      en: "Why is IE₁ of B lower than Be, even though B is to the right of Be?",
    },
    options: [
      { id: "a", label: { th: "ก. B มีขนาดอะตอมใหญ่กว่า Be", en: "B has a larger atomic radius than Be" }, why: { th: "ผิด — B อยู่ทางขวาของ Be จึงมีขนาดเล็กกว่า", en: "Wrong — B is to the right of Be, so it has a smaller radius." } },
      { id: "b", label: { th: "ข. B มี Z_eff น้อยกว่า Be", en: "B has a smaller Z_eff than Be" }, why: { th: "ผิด — B มี Z_eff = 3 ซึ่งมากกว่า Be (Z_eff = 2)", en: "Wrong — B has Z_eff = 3, which is larger than Be's Z_eff = 2." } },
      { id: "c", label: { th: "ค. B เป็นโลหะ ส่วน Be เป็นอโลหะ", en: "B is a metal while Be is a nonmetal" }, why: { th: "ผิด — ทั้งสองเป็นโลหะ/กึ่งโลหะ และนี่ไม่ใช่เหตุผล", en: "Wrong — both are metals/metalloids, and this is not the reason." } },
      { id: "d", label: { th: "ง. อิเล็กตรอนที่ถูกดึงออกของ B อยู่ในออร์บิทัล 2p ซึ่งมีพลังงานสูงกว่า 2s ของ Be", en: "The electron removed from B is in the 2p orbital, which is higher energy than the 2s of Be" }, why: { th: "ถูกต้อง — Be=1s²2s²; B=1s²2s²2p¹ → e⁻ ใน 2p มีพลังงานสูงกว่าและถูก 2s กำบัง → ดึงออกง่ายกว่า → IE₁(B) < IE₁(Be) (ความผิดปกติจุดที่ 1)", en: "Correct — Be=1s²2s²; B=1s²2s²2p¹ → e⁻ in 2p is higher energy and shielded by 2s → easier to remove → IE₁(B) < IE₁(Be) (1st anomaly)." } },
      { id: "e", label: { th: "จ. B มีอิเล็กตรอนจับคู่กันในออร์บิทัล 2p ทำให้เกิดแรงผลัก", en: "B has paired electrons in 2p causing repulsion" }, why: { th: "ผิด — คำอธิบายเรื่อง e⁻ จับคู่ใช้กับความผิดปกติจุดที่ 2 (N→O) ไม่ใช่จุดนี้ B มีแค่ e⁻ เดี่ยว 1 ตัวใน 2p", en: "Wrong — the paired-electron explanation applies to the 2nd anomaly (N→O), not here; B has only 1 unpaired e⁻ in 2p." } },
    ],
    correctId: "d",
    sourceRef: "quiz.md ข้อ 28",
  },
  {
    id: "chem-q29",
    kind: "mcq",
    chapter: 2,
    prompt: {
      th: "ธาตุ X มีค่าพลังงานไอออไนเซชัน: IE₁=738, IE₂=1451, IE₃=7733 kJ/mol ธาตุ X น่าจะอยู่หมู่ใด",
      en: "Element X has ionization energies: IE₁=738, IE₂=1451, IE₃=7733 kJ/mol. Which group is X in?",
    },
    options: [
      { id: "a", label: { th: "ก. หมู่ 1", en: "Group 1" }, why: { th: "ผิด — ถ้าหมู่ 1 จุดกระโดดต้องอยู่ระหว่าง IE₁→IE₂", en: "Wrong — Group 1 would have a big jump between IE₁ and IE₂." } },
      { id: "b", label: { th: "ข. หมู่ 2", en: "Group 2" }, why: { th: "ถูกต้อง — จุดกระโดดใหญ่ระหว่าง IE₂→IE₃ (1451→7733 เพิ่ม 5 เท่า) → เวเลนซ์ e⁻ = 2 → หมู่ 2 (เช่น Mg)", en: "Correct — huge jump between IE₂→IE₃ (1451→7733, ~5× increase) → 2 valence electrons → Group 2 (e.g., Mg)." } },
      { id: "c", label: { th: "ค. หมู่ 13", en: "Group 13" }, why: { th: "ผิด — ถ้าหมู่ 13 จุดกระโดดต้องอยู่ระหว่าง IE₃→IE₄", en: "Wrong — Group 13 would have a big jump between IE₃ and IE₄." } },
      { id: "d", label: { th: "ง. หมู่ 15", en: "Group 15" }, why: { th: "ผิด — ถ้าหมู่ 15 จุดกระโดดต้องอยู่ระหว่าง IE₅→IE₆", en: "Wrong — Group 15 would have a big jump between IE₅ and IE₆." } },
      { id: "e", label: { th: "จ. หมู่ 17", en: "Group 17" }, why: { th: "ผิด — ถ้าหมู่ 17 จุดกระโดดต้องอยู่ระหว่าง IE₇→IE₈", en: "Wrong — Group 17 would have a big jump between IE₇ and IE₈." } },
    ],
    correctId: "b",
    sourceRef: "quiz.md ข้อ 29",
  },
  {
    id: "chem-q30",
    kind: "mcq",
    chapter: 2,
    prompt: {
      th: "ธาตุในหมู่ใดมีค่าสัมพรรคภาพอิเล็กตรอน (EA) เป็นลบมากที่สุด (ชอบรับอิเล็กตรอนมากที่สุด)",
      en: "Which group has the most negative electron affinity (EA) — most eager to gain electrons?",
    },
    options: [
      { id: "a", label: { th: "ก. หมู่ 1 (โลหะแอลคาไล)", en: "Group 1 (alkali metals)" }, why: { th: "ผิด — หมู่ 1 มีแนวโน้มเสีย e⁻ มากกว่ารับ EA เป็นลบเล็กน้อยเท่านั้น", en: "Wrong — Group 1 tends to lose electrons; EA is only slightly negative." } },
      { id: "b", label: { th: "ข. หมู่ 2 (โลหะแอลคาไลน์เอิร์ท)", en: "Group 2 (alkaline earth metals)" }, why: { th: "ผิด — ns² เต็มแล้ว e⁻ ที่รับต้องไปใน np ที่มีพลังงานสูง → EA ≈ 0 หรือบวก", en: "Wrong — ns² is full; incoming e⁻ must enter higher-energy np → EA ≈ 0 or positive." } },
      { id: "c", label: { th: "ค. หมู่ 15", en: "Group 15" }, why: { th: "ผิด — np³ ครึ่งเต็มเสถียร → ไม่อยากรับเพิ่ม → EA ใกล้ 0 (N มี EA ≈ +7 kJ/mol)", en: "Wrong — half-filled np³ is stable → reluctant to gain → EA near 0 (N has EA ≈ +7 kJ/mol)." } },
      { id: "d", label: { th: "ง. หมู่ 18 (ก๊าซเฉื่อย)", en: "Group 18 (noble gases)" }, why: { th: "ผิด — ออกเตตครบแล้ว EA เป็นบวก (ต้องใช้พลังงานบังคับให้รับ)", en: "Wrong — octet is complete; EA is positive (energy required to force an e⁻ in)." } },
      { id: "e", label: { th: "จ. หมู่ 17 (แฮโลเจน)", en: "Group 17 (halogens)" }, why: { th: "ถูกต้อง — แฮโลเจนขาด e⁻ แค่ 1 ตัวจะครบออกเตต → รับแล้วเสถียรมาก → EA เป็นลบมาก (Cl มี EA ≈ −349 kJ/mol)", en: "Correct — halogens need only 1 more e⁻ for a full octet → very stable after gaining one → very negative EA (Cl ≈ −349 kJ/mol)." } },
    ],
    correctId: "e",
    sourceRef: "quiz.md ข้อ 30",
  },

  // ══ Chapter 3: Chemical Bonding — Medium (q31–q35) ════════════════════════
  {
    id: "chem-q31",
    kind: "mcq",
    chapter: 3,
    prompt: {
      th: "โมเลกุล SF₄ มีรูปร่างโมเลกุลแบบใด",
      en: "What is the molecular shape of SF₄?",
    },
    options: [
      { id: "a", label: { th: "ก. ทรงสี่หน้า (Tetrahedral)", en: "Tetrahedral" }, why: { th: "ผิด — Tetrahedral คือ AX₄ ไม่มีคู่โดดเดี่ยว เช่น CH₄", en: "Wrong — Tetrahedral is AX₄ with no lone pairs, e.g., CH₄." } },
      { id: "b", label: { th: "ข. พีระมิดคู่ฐานสามเหลี่ยม (Trigonal bipyramidal)", en: "Trigonal bipyramidal" }, why: { th: "ผิด — นั่นคือรูปทรงโดเมนอิเล็กตรอน ไม่ใช่รูปร่างโมเลกุล ⚠️ ตัวหลอกที่ดีที่สุด!", en: "Wrong — that is the electron domain geometry, not the molecular shape. ⚠️ Best trap!" } },
      { id: "c", label: { th: "ค. กระดานหก (Seesaw)", en: "Seesaw" }, why: { th: "ถูกต้อง — S มี 6 เวเลนซ์ e⁻ + 4 พันธะกับ F → คู่โดดเดี่ยว 1 คู่ → AX₄E → 5 โดเมน → sp³d → Seesaw", en: "Correct — S has 6 valence e⁻, 4 bonds to F → 1 lone pair → AX₄E → 5 electron domains → sp³d → Seesaw." } },
      { id: "d", label: { th: "ง. รูปตัวที (T-shaped)", en: "T-shaped" }, why: { th: "ผิด — T-shaped คือ AX₃E₂ เช่น ClF₃ (คู่โดดเดี่ยว 2 คู่)", en: "Wrong — T-shaped is AX₃E₂ e.g., ClF₃ (2 lone pairs)." } },
      { id: "e", label: { th: "จ. สี่เหลี่ยมแบนราบ (Square planar)", en: "Square planar" }, why: { th: "ผิด — Square planar คือ AX₄E₂ เช่น XeF₄ (6 โดเมน คู่โดดเดี่ยว 2 คู่)", en: "Wrong — Square planar is AX₄E₂ e.g., XeF₄ (6 domains, 2 lone pairs)." } },
    ],
    correctId: "c",
    sourceRef: "quiz.md ข้อ 31",
  },
  {
    id: "chem-q32",
    kind: "mcq",
    chapter: 3,
    prompt: {
      th: "โมเลกุลใดต่อไปนี้เป็นโมเลกุล ไม่มีขั้ว ทั้งที่มีพันธะที่มีขั้วอยู่ภายใน",
      en: "Which molecule is nonpolar despite containing polar bonds?",
    },
    options: [
      { id: "a", label: { th: "ก. H₂O", en: "H₂O" }, why: { th: "ผิด — H₂O รูปร่าง Bent ไม่สมมาตร → มีขั้ว", en: "Wrong — H₂O is bent and asymmetric → polar." } },
      { id: "b", label: { th: "ข. CCl₄", en: "CCl₄" }, why: { th: "ถูกต้อง — CCl₄ เป็น Tetrahedral สมมาตรสมบูรณ์ เวกเตอร์ขั้วของ C–Cl 4 พันธะหักล้างกัน → μ = 0 → ไม่มีขั้ว", en: "Correct — CCl₄ is perfectly symmetric tetrahedral; 4 C–Cl bond dipoles cancel → μ = 0 → nonpolar." } },
      { id: "c", label: { th: "ค. SO₂", en: "SO₂" }, why: { th: "ผิด — SO₂ รูปร่าง Bent → มีขั้ว (ต่างจาก CO₂ ที่ Linear ไม่มีขั้ว)", en: "Wrong — SO₂ is bent → polar (unlike CO₂ which is linear and nonpolar)." } },
      { id: "d", label: { th: "ง. CHCl₃", en: "CHCl₃" }, why: { th: "ผิด — CHCl₃ ทรงสี่หน้าแต่อะตอมรอบนอกไม่เหมือนกัน (H≠Cl) → ไม่สมมาตร → มีขั้ว", en: "Wrong — CHCl₃ is tetrahedral but atoms are not all the same (H≠Cl) → asymmetric → polar." } },
      { id: "e", label: { th: "จ. NH₃", en: "NH₃" }, why: { th: "ผิด — NH₃ Trigonal pyramidal มีคู่โดดเดี่ยว → มีขั้ว", en: "Wrong — NH₃ is trigonal pyramidal with a lone pair → polar." } },
    ],
    correctId: "b",
    sourceRef: "quiz.md ข้อ 32",
  },
  {
    id: "chem-q33",
    kind: "mcq",
    chapter: 3,
    prompt: {
      th: "โมเลกุล XeF₄ มีรูปร่างและไฮบริไดเซชันของอะตอมกลางเป็นอย่างไร",
      en: "What is the shape and hybridization of XeF₄?",
    },
    options: [
      { id: "a", label: { th: "ก. สี่เหลี่ยมแบนราบ, sp³d²", en: "Square planar, sp³d²" }, why: { th: "ถูกต้อง — Xe: 8 เวเลนซ์ e⁻, 4 พันธะกับ F → คู่โดดเดี่ยว 2 คู่ → AX₄E₂ → 6 โดเมน → sp³d² → คู่โดดเดี่ยวอยู่ตรงข้ามกัน → Square planar", en: "Correct — Xe: 8 valence e⁻, 4 bonds to F → 2 lone pairs → AX₄E₂ → 6 domains → sp³d² → lone pairs opposite each other → Square planar." } },
      { id: "b", label: { th: "ข. ทรงแปดหน้า, sp³d²", en: "Octahedral, sp³d²" }, why: { th: "ผิด — ไฮบริดถูกแต่ทรงแปดหน้าคือรูปทรงโดเมน ไม่ใช่รูปร่างโมเลกุล (นั่นคือ SF₆)", en: "Wrong — hybridization correct but octahedral is the electron domain geometry, not molecular shape (SF₆ is octahedral)." } },
      { id: "c", label: { th: "ค. กระดานหก, sp³d", en: "Seesaw, sp³d" }, why: { th: "ผิด — Seesaw คือ AX₄E (5 โดเมน) เช่น SF₄", en: "Wrong — Seesaw is AX₄E (5 domains) e.g., SF₄." } },
      { id: "d", label: { th: "ง. พีระมิดฐานสี่เหลี่ยม, sp³d²", en: "Square pyramidal, sp³d²" }, why: { th: "ผิด — Square pyramidal คือ AX₅E เช่น BrF₅ (คู่โดดเดี่ยว 1 คู่)", en: "Wrong — Square pyramidal is AX₅E e.g., BrF₅ (1 lone pair)." } },
      { id: "e", label: { th: "จ. ทรงสี่หน้า, sp³", en: "Tetrahedral, sp³" }, why: { th: "ผิด — XeF₄ มี 6 โดเมน ไม่ใช่ 4", en: "Wrong — XeF₄ has 6 electron domains, not 4." } },
    ],
    correctId: "a",
    sourceRef: "quiz.md ข้อ 33",
  },
  {
    id: "chem-q34",
    kind: "mcq",
    chapter: 3,
    prompt: {
      th: "ข้อใดอธิบายสาเหตุที่ O₂ เป็นสารพาราแมกเนติก ได้ถูกต้องตามทฤษฎี MO",
      en: "Which statement correctly explains why O₂ is paramagnetic according to MO theory?",
    },
    options: [
      { id: "a", label: { th: "ก. O₂ มีพันธะคู่ระหว่างอะตอมออกซิเจน", en: "O₂ has a double bond" }, why: { th: "ผิด — พันธะคู่อธิบาย bond order แต่โครงสร้างลิวอิสทำนายผิดว่าไดอะแมกเนติก นี่คือความล้มเหลวของทฤษฎีลิวอิส", en: "Wrong — double bond explains bond order but Lewis structure wrongly predicts diamagnetic; this is a failure of Lewis theory." } },
      { id: "b", label: { th: "ข. O₂ มีอิเล็กตรอนจับคู่ครบทุกออร์บิทัล", en: "O₂ has all paired electrons" }, why: { th: "ผิด — ถ้าจับคู่ครบจะเป็นไดอะแมกเนติก ซึ่งขัดกับโจทย์", en: "Wrong — fully paired electrons would make O₂ diamagnetic, contradicting the premise." } },
      { id: "c", label: { th: "ค. O₂ มีอิเล็กตรอนเดี่ยว 2 ตัวอยู่ในออร์บิทัล σ*2p", en: "O₂ has 2 unpaired electrons in σ*2p" }, why: { th: "ผิด — e⁻ 2 ตัวสุดท้ายอยู่ใน π*2p ไม่ใช่ σ*2p", en: "Wrong — the 2 last electrons are in π*2p, not σ*2p." } },
      { id: "d", label: { th: "ง. O₂ มีอิเล็กตรอนเดี่ยว 2 ตัวอยู่ในออร์บิทัล π*2p", en: "O₂ has 2 unpaired electrons in the degenerate π*2p orbitals" }, why: { th: "ถูกต้อง — MO: (σ2s)²(σ*2s)²(σ2p)²(π2p)⁴(π*2p)² → e⁻ 2 ตัวสุดท้ายแยกกันอยู่ใน π*2p 2 ออร์บิทัลตามกฎฮุนด์ → พาราแมกเนติก BO=(8-4)/2=2 ✔ นี่คือชัยชนะของ MO", en: "Correct — MO: (σ2s)²(σ*2s)²(σ2p)²(π2p)⁴(π*2p)² → last 2 e⁻ separately occupy the 2 degenerate π*2p orbitals (Hund's rule) → paramagnetic. BO=(8-4)/2=2 ✔ This is MO theory's triumph." } },
      { id: "e", label: { th: "จ. O₂ มีอันดับพันธะเท่ากับ 3", en: "O₂ has bond order 3" }, why: { th: "ผิด — BO ของ O₂ = 2 ไม่ใช่ 3 (3 คือ N₂)", en: "Wrong — BO of O₂ = 2, not 3 (N₂ has BO = 3)." } },
    ],
    correctId: "d",
    sourceRef: "quiz.md ข้อ 34",
  },
  {
    id: "chem-q35",
    kind: "mcq",
    chapter: 3,
    prompt: {
      th: "สารประกอบไอออนิกใดต่อไปนี้มีพลังงานแลตทิซ (Lattice energy) สูงที่สุด",
      en: "Which ionic compound has the highest lattice energy?",
    },
    options: [
      { id: "a", label: { th: "ก. NaCl", en: "NaCl" }, why: { th: "ผิด — NaCl มีประจุ ±1 และ Cl⁻ ใหญ่กว่า F⁻", en: "Wrong — NaCl has ±1 charges and Cl⁻ is larger than F⁻." } },
      { id: "b", label: { th: "ข. NaF", en: "NaF" }, why: { th: "ผิด — NaF สูงที่สุดในกลุ่มประจุ ±1 แต่ยังต่ำกว่า MgO มาก", en: "Wrong — NaF is highest in the ±1 group but still much lower than MgO." } },
      { id: "c", label: { th: "ค. KCl", en: "KCl" }, why: { th: "ผิด — K⁺ ใหญ่กว่า Na⁺ → r ใหญ่ → U ต่ำกว่า NaCl", en: "Wrong — K⁺ is larger than Na⁺ → larger r → lower U than NaCl." } },
      { id: "d", label: { th: "ง. KBr", en: "KBr" }, why: { th: "ผิด — ทั้ง K⁺ และ Br⁻ ใหญ่ → U ต่ำสุดในตัวเลือก", en: "Wrong — both K⁺ and Br⁻ are large → lowest U among the options." } },
      { id: "e", label: { th: "จ. MgO", en: "MgO" }, why: { th: "ถูกต้อง — U ∝ Q₁Q₂/r; Mg²⁺ × O²⁻ → ผลคูณประจุ = (2)(2) = 4 ซึ่งสูงกว่ากลุ่ม ±1 มาก (≈3795 kJ/mol เทียบกับ NaCl ≈788 kJ/mol)", en: "Correct — U ∝ Q₁Q₂/r; Mg²⁺×O²⁻ → charge product = (2)(2) = 4, far higher than ±1 group (≈3795 kJ/mol vs NaCl ≈788 kJ/mol)." } },
    ],
    correctId: "e",
    sourceRef: "quiz.md ข้อ 35",
  },

  // ══ Chapter 4: Stoichiometry — Medium (q36–q40) ═══════════════════════════
  {
    id: "chem-q36",
    kind: "mcq",
    chapter: 4,
    prompt: {
      th: "สารประกอบชนิดหนึ่งประกอบด้วย C 40.0%, H 6.7%, O 53.3% โดยมวล สูตรอย่างง่ายของสารนี้คือข้อใด",
      en: "A compound contains C 40.0%, H 6.7%, O 53.3% by mass. What is its empirical formula?",
    },
    options: [
      { id: "a", label: { th: "ก. CH₂O", en: "CH₂O" }, why: { th: "ถูกต้อง — C: 40/12=3.33, H: 6.7/1=6.7, O: 53.3/16=3.33 → หาร 3.33 → C:H:O = 1:2:1 → CH₂O", en: "Correct — C: 40/12=3.33, H: 6.7/1=6.7, O: 53.3/16=3.33 → divide by 3.33 → 1:2:1 → CH₂O." } },
      { id: "b", label: { th: "ข. CHO", en: "CHO" }, why: { th: "ผิด — H ผิด (ต้องเป็น 2 ไม่ใช่ 1)", en: "Wrong — H is wrong (must be 2, not 1)." } },
      { id: "c", label: { th: "ค. C₂H₄O₂", en: "C₂H₄O₂" }, why: { th: "ผิด — C₂H₄O₂ เป็นสูตรโมเลกุลที่ถูกต้องได้ แต่โจทย์ถามสูตรอย่างง่าย ⚠️ ตัวหลอกหลัก!", en: "Wrong — C₂H₄O₂ could be a valid molecular formula, but the question asks for the empirical formula. ⚠️ Main trap!" } },
      { id: "d", label: { th: "ง. C₆H₁₂O₆", en: "C₆H₁₂O₆" }, why: { th: "ผิด — นั่นคือสูตรโมเลกุลของกลูโคส ไม่ใช่สูตรอย่างง่าย", en: "Wrong — that is the molecular formula of glucose, not the empirical formula." } },
      { id: "e", label: { th: "จ. CH₄O", en: "CH₄O" }, why: { th: "ผิด — จำนวน H ไม่ตรงกับอัตราส่วนที่คำนวณได้", en: "Wrong — the H count does not match the calculated ratio." } },
    ],
    correctId: "a",
    sourceRef: "quiz.md ข้อ 36",
  },
  {
    id: "chem-q37",
    kind: "mcq",
    chapter: 4,
    prompt: {
      th: "ร้อยละโดยมวลของไนโตรเจนในสารประกอบ (NH₄)₂SO₄ มีค่าเท่าใด",
      en: "What is the mass percent of nitrogen in (NH₄)₂SO₄?",
    },
    options: [
      { id: "a", label: { th: "ก. 10.60%", en: "10.60%" }, why: { th: "ผิด — ลืมคูณ 2 นับ N แค่ 1 อะตอม", en: "Wrong — forgot to multiply by 2; counted only 1 N atom." } },
      { id: "b", label: { th: "ข. 14.01%", en: "14.01%" }, why: { th: "ผิด — ใช้มวลอะตอมของ N มาตอบตรง ๆ ไม่ได้คำนวณ", en: "Wrong — directly used the atomic mass of N without calculating." } },
      { id: "c", label: { th: "ค. 24.24%", en: "24.24%" }, why: { th: "ผิด — ใช้ MW ที่ผิด", en: "Wrong — used wrong MW." } },
      { id: "d", label: { th: "ง. 21.20%", en: "21.20%" }, why: { th: "ถูกต้อง — MW = 2(14.01)+8(1.008)+32.07+4(16.00) = 132.15; %N = (2×14.01/132.15)×100 = 21.20%", en: "Correct — MW = 2(14.01)+8(1.008)+32.07+4(16.00) = 132.15; %N = (2×14.01/132.15)×100 = 21.20%." } },
      { id: "e", label: { th: "จ. 28.02%", en: "28.02%" }, why: { th: "ผิด — คือมวลรวมของ N (2×14.01) ไม่ได้หารด้วย MW แล้วคูณ 100", en: "Wrong — that is the total mass of N (2×14.01) without dividing by MW×100." } },
    ],
    correctId: "d",
    sourceRef: "quiz.md ข้อ 37",
  },
  {
    id: "chem-q38",
    kind: "mcq",
    chapter: 4,
    prompt: {
      th: "สารละลาย 500 mL มี Na₂SO₄ ละลายอยู่ 2.84 กรัม (MW=142 g/mol) สารละลายนี้มีความเข้มข้นกี่โมลาร์",
      en: "500 mL of solution contains 2.84 g of Na₂SO₄ (MW=142 g/mol). What is the molarity?",
    },
    options: [
      { id: "a", label: { th: "ก. 0.02 M", en: "0.02 M" }, why: { th: "ผิด — คือจำนวนโมล แต่ยังไม่ได้หารด้วยปริมาตร (ลืมว่า 500 mL = 0.5 L) ⚠️ ผิดบ่อยที่สุด!", en: "Wrong — that is the mole count without dividing by volume (500 mL = 0.5 L). ⚠️ Most common error!" } },
      { id: "b", label: { th: "ข. 0.20 M", en: "0.20 M" }, why: { th: "ผิด — ผิดจากการวางทศนิยม", en: "Wrong — decimal error." } },
      { id: "c", label: { th: "ค. 0.04 M", en: "0.04 M" }, why: { th: "ถูกต้อง — n = 2.84/142 = 0.02 mol; M = 0.02/0.5 = 0.04 M", en: "Correct — n = 2.84/142 = 0.02 mol; M = 0.02/0.5 = 0.04 M." } },
      { id: "d", label: { th: "ง. 0.40 M", en: "0.40 M" }, why: { th: "ผิด — ลืมแปลง mL→L (หารด้วย 500 แทน 0.5)", en: "Wrong — forgot to convert mL→L (divided by 500 instead of 0.5)." } },
      { id: "e", label: { th: "จ. 2.00 M", en: "2.00 M" }, why: { th: "ผิด — คำนวณกลับหัวกลับหาง", en: "Wrong — completely inverted calculation." } },
    ],
    correctId: "c",
    sourceRef: "quiz.md ข้อ 38",
  },
  {
    id: "chem-q39",
    kind: "mcq",
    chapter: 4,
    prompt: {
      th: "ต้องใช้สารละลาย NaOH 1.25 M ปริมาตรกี่มิลลิลิตร เพื่อเตรียม NaOH 0.125 M ปริมาตร 200.00 mL",
      en: "How many mL of 1.25 M NaOH are needed to prepare 200.00 mL of 0.125 M NaOH?",
    },
    options: [
      { id: "a", label: { th: "ก. 20.00 mL", en: "20.00 mL" }, why: { th: "ถูกต้อง — M₁V₁ = M₂V₂ → V₁ = (0.125×200)/1.25 = 20.00 mL ✔ (เจือจาง 10 เท่า → ปริมาตรเพิ่ม 10 เท่า: 200/10=20)", en: "Correct — M₁V₁ = M₂V₂ → V₁ = (0.125×200)/1.25 = 20.00 mL ✔ (10× dilution → 200/10=20)." } },
      { id: "b", label: { th: "ข. 10.00 mL", en: "10.00 mL" }, why: { th: "ผิด — คำนวณผิดสัดส่วน", en: "Wrong — proportion error." } },
      { id: "c", label: { th: "ค. 25.00 mL", en: "25.00 mL" }, why: { th: "ผิด — คำนวณผิด", en: "Wrong — arithmetic error." } },
      { id: "d", label: { th: "ง. 50.00 mL", en: "50.00 mL" }, why: { th: "ผิด — คำนวณผิด", en: "Wrong — arithmetic error." } },
      { id: "e", label: { th: "จ. 100.00 mL", en: "100.00 mL" }, why: { th: "ผิด — กลับเศษกับส่วน ใช้ V₁ = V₂×(M₁/M₂) แทนที่จะเป็น V₁ = V₂×(M₂/M₁)", en: "Wrong — inverted the formula, used V₁ = V₂×(M₁/M₂) instead of V₁ = V₂×(M₂/M₁)." } },
    ],
    correctId: "a",
    sourceRef: "quiz.md ข้อ 39",
  },
  {
    id: "chem-q40",
    kind: "mcq",
    chapter: 4,
    prompt: {
      th: "จากสมการ Zn(s) + 2HCl(aq) → ZnCl₂(aq) + H₂(g) ถ้าใช้ Zn 0.3 โมล ทำปฏิกิริยากับ HCl 0.52 โมล สารใดเป็นสารกำหนดปริมาณ และเกิด H₂ กี่กรัม",
      en: "Zn(s) + 2HCl(aq) → ZnCl₂(aq) + H₂(g). Using 0.3 mol Zn and 0.52 mol HCl, which is the limiting reagent and how many grams of H₂ are produced?",
    },
    options: [
      { id: "a", label: { th: "ก. Zn เป็นสารกำหนดปริมาณ, ได้ H₂ 0.60 กรัม", en: "Zn is limiting, 0.60 g H₂" }, why: { th: "ผิด — Zn ไม่ใช่ limiting reagent และมวล H₂ ผิด", en: "Wrong — Zn is not the limiting reagent and the H₂ mass is wrong." } },
      { id: "b", label: { th: "ข. HCl เป็นสารกำหนดปริมาณ, ได้ H₂ 0.52 กรัม", en: "HCl is limiting, 0.52 g H₂" }, why: { th: "ถูกต้อง — Zn/1=0.30; HCl/2=0.26 → HCl น้อยกว่า → HCl เป็น limiting; H₂ = 0.26 mol × 2 g/mol = 0.52 g ⚠️ จำ: ห้ามเทียบโมลดิบ ต้องหารด้วยสัมประสิทธิ์ก่อน!", en: "Correct — Zn/1=0.30; HCl/2=0.26 → HCl is limiting; H₂ = 0.26 mol × 2 g/mol = 0.52 g. ⚠️ Remember: always divide by coefficients before comparing!" } },
      { id: "c", label: { th: "ค. Zn เป็นสารกำหนดปริมาณ, ได้ H₂ 0.30 กรัม", en: "Zn is limiting, 0.30 g H₂" }, why: { th: "ผิด — Zn ไม่ใช่ limiting (ข้อผิดพลาดเพราะเทียบโมลดิบ 0.3<0.52)", en: "Wrong — Zn is not limiting (error from comparing raw moles 0.3<0.52 without dividing by coefficients)." } },
      { id: "d", label: { th: "ง. HCl เป็นสารกำหนดปริมาณ, ได้ H₂ 1.04 กรัม", en: "HCl is limiting, 1.04 g H₂" }, why: { th: "ผิด — HCl ถูกต้อง แต่ลืมหาร 2 (ใช้ 0.52 mol H₂ แทน 0.26 mol)", en: "Wrong — HCl correct but forgot to divide by 2 (used 0.52 mol H₂ instead of 0.26 mol)." } },
      { id: "e", label: { th: "จ. ทั้งคู่หมดพอดี, ได้ H₂ 0.26 กรัม", en: "Both are consumed, 0.26 g H₂" }, why: { th: "ผิด — Zn เหลือ 0.3−0.26=0.04 mol ไม่ได้หมดพอดี", en: "Wrong — Zn has 0.3−0.26=0.04 mol left; they are not both consumed." } },
    ],
    correctId: "b",
    sourceRef: "quiz.md ข้อ 40",
  },

  // ══ Chapter 5: Liquids & Solutions — Medium (q41–q45) ════════════════════
  {
    id: "chem-q41",
    kind: "mcq",
    chapter: 5,
    prompt: {
      th: "เมื่อแรงยึดเหนี่ยวระหว่างโมเลกุลของของเหลวเพิ่มมากขึ้น สมบัติในข้อใดถูกต้องทั้งหมด",
      en: "When intermolecular forces (IMF) increase, which description is completely correct?",
    },
    options: [
      { id: "a", label: { th: "ก. ความดันไอเพิ่มขึ้น, จุดเดือดเพิ่มขึ้น", en: "Vapor pressure increases, boiling point increases" }, why: { th: "ผิด — ความดันไอลดลง เมื่อ IMF แรงขึ้น", en: "Wrong — vapor pressure decreases when IMF increases." } },
      { id: "b", label: { th: "ข. ความดันไอและจุดเดือดไม่เปลี่ยนแปลง", en: "Both vapor pressure and boiling point unchanged" }, why: { th: "ผิด — IMF มีผลต่อทั้งสองค่าอย่างชัดเจน", en: "Wrong — IMF clearly affects both values." } },
      { id: "c", label: { th: "ค. ความดันไอลดลง, จุดเดือดลดลง", en: "Vapor pressure decreases, boiling point decreases" }, why: { th: "ผิด — ความดันไอลดถูก แต่จุดเดือดต้องเพิ่ม (ต้องใช้ความร้อนมากกว่าเพื่อให้ความดันไอ = 1 atm)", en: "Wrong — vapor pressure correct but boiling point must increase (more heat needed for vapor pressure to reach 1 atm)." } },
      { id: "d", label: { th: "ง. ความดันไอเพิ่มขึ้น, จุดเดือดลดลง", en: "Vapor pressure increases, boiling point decreases" }, why: { th: "ผิด — ทั้งคู่ผิด", en: "Wrong — both are incorrect." } },
      { id: "e", label: { th: "จ. ความดันไอลดลง, จุดเดือดเพิ่มขึ้น", en: "Vapor pressure decreases, boiling point increases" }, why: { th: "ถูกต้อง — IMF แรง → ระเหยยาก → ความดันไอต่ำ; ต้องให้ความร้อนมากขึ้นเพื่อเดือด → จุดเดือดสูง", en: "Correct — stronger IMF → harder to evaporate → lower vapor pressure; more heat needed to boil → higher boiling point." } },
    ],
    correctId: "e",
    sourceRef: "quiz.md ข้อ 41",
  },
  {
    id: "chem-q42",
    kind: "mcq",
    chapter: 5,
    prompt: {
      th: "สารในข้อใดมีจุดเดือด สูงที่สุด",
      en: "Which substance has the highest boiling point?",
    },
    options: [
      { id: "a", label: { th: "ก. CH₄", en: "CH₄" }, why: { th: "ผิด — CH₄ bp = −161.5°C (London forces, MW=16)", en: "Wrong — CH₄ bp = −161.5°C (London forces, MW=16)." } },
      { id: "b", label: { th: "ข. C₂H₆", en: "C₂H₆" }, why: { th: "ผิด — C₂H₆ bp = −88.6°C (London forces, MW=30)", en: "Wrong — C₂H₆ bp = −88.6°C (London forces, MW=30)." } },
      { id: "c", label: { th: "ค. N₂", en: "N₂" }, why: { th: "ผิด — N₂ bp = −195.8°C (London forces, MW=28)", en: "Wrong — N₂ bp = −195.8°C (London forces, MW=28)." } },
      { id: "d", label: { th: "ง. CO₂", en: "CO₂" }, why: { th: "ผิด — CO₂ ระเหิดที่ −78°C (London forces, MW=44) ⚠️ ตัวหลอก: MW สูงสุดแต่ชนิด IMF ต่ำ", en: "Wrong — CO₂ sublimes at −78°C (London forces, MW=44). ⚠️ Trap: highest MW but weakest IMF type." } },
      { id: "e", label: { th: "จ. H₂O", en: "H₂O" }, why: { th: "ถูกต้อง — H₂O bp = 100°C เพราะมี Hydrogen Bond ซึ่งเป็นแรง IMF ที่แรงที่สุดในกลุ่มนี้ ทั้งที่ MW เพียง 18", en: "Correct — H₂O bp = 100°C due to hydrogen bonding, the strongest IMF in this group, despite MW of only 18." } },
    ],
    correctId: "e",
    sourceRef: "quiz.md ข้อ 42",
  },
  {
    id: "chem-q43",
    kind: "mcq",
    chapter: 5,
    prompt: {
      th: "เมื่ออุณหภูมิของน้ำสูงขึ้น การละลายของแก๊สออกซิเจนในน้ำจะเป็นอย่างไร และเพราะเหตุใด",
      en: "As water temperature increases, how does oxygen gas solubility change and why?",
    },
    options: [
      { id: "a", label: { th: "ก. ละลายได้มากขึ้น เพราะการละลายของแก๊สเป็นปฏิกิริยาดูดความร้อน", en: "Increases because gas dissolving is endothermic" }, why: { th: "ผิด — สลับประเภทปฏิกิริยา การละลายของแก๊สส่วนใหญ่เป็นคายความร้อน", en: "Wrong — reaction type swapped; most gas dissolution is exothermic." } },
      { id: "b", label: { th: "ข. ละลายได้เท่าเดิม เพราะอุณหภูมิไม่มีผลต่อการละลายของแก๊ส", en: "Stays the same; temperature has no effect on gas solubility" }, why: { th: "ผิด — อุณหภูมิมีผลต่อการละลายของแก๊สอย่างชัดเจน", en: "Wrong — temperature clearly affects gas solubility." } },
      { id: "c", label: { th: "ค. ละลายได้มากขึ้น เพราะโมเลกุลเคลื่อนที่เร็วขึ้น", en: "Increases because molecules move faster" }, why: { th: "ผิด — โมเลกุลเคลื่อนที่เร็วขึ้นทำให้แก๊สหลุดออกจากสารละลายได้ง่ายขึ้น ละลายได้น้อยลง", en: "Wrong — faster-moving molecules escape the solution more easily → less soluble." } },
      { id: "d", label: { th: "ง. ละลายได้น้อยลง เพราะการละลายของแก๊สเป็นปฏิกิริยาคายความร้อน", en: "Decreases because gas dissolution is exothermic" }, why: { th: "ถูกต้อง — gas(g)+solvent(l) ⇌ solution+heat เป็น exothermic → เพิ่ม T → สมดุลย้อนกลับ → แก๊สละลายน้อยลง ตามหลัก Le Chatelier", en: "Correct — gas(g)+solvent(l) ⇌ solution+heat is exothermic → increasing T shifts equilibrium backward → less gas dissolves (Le Chatelier)." } },
      { id: "e", label: { th: "จ. ละลายได้น้อยลง เพราะความดันบรรยากาศลดลง", en: "Decreases because atmospheric pressure decreases" }, why: { th: "ผิด — คำตอบถูกแต่เหตุผลผิด ตัวแปรคืออุณหภูมิ ไม่ใช่ความดัน (ความดันเป็นคนละปัจจัยตามกฎ Henry)", en: "Wrong — answer direction correct but reason wrong; the variable is temperature, not pressure (pressure is a separate factor via Henry's Law)." } },
    ],
    correctId: "d",
    sourceRef: "quiz.md ข้อ 43",
  },
  {
    id: "chem-q44",
    kind: "mcq",
    chapter: 5,
    prompt: {
      th: "สารละลายซูโครส 68 g (MW=342) ในน้ำ 1,000 g ที่ 28°C ถ้าความดันไอของน้ำบริสุทธิ์ที่อุณหภูมินี้ = 28.35 torr ความดันไอของสารละลายมีค่าเท่าใด",
      en: "Sucrose 68 g (MW=342) dissolved in 1,000 g water at 28°C. Pure water vapor pressure = 28.35 torr. What is the solution's vapor pressure?",
    },
    options: [
      { id: "a", label: { th: "ก. 27.35 torr", en: "27.35 torr" }, why: { th: "ผิด — ลบไป 1.00 torr (คำนวณ ΔP ผิดสิบเท่า)", en: "Wrong — subtracted 1.00 torr (ΔP calculated 10× too large)." } },
      { id: "b", label: { th: "ข. 28.25 torr", en: "28.25 torr" }, why: { th: "ถูกต้อง — mol ซูโครส = 68/342 = 0.20; mol น้ำ = 1000/18 = 55.56; X_sucrose = 0.20/(0.20+55.56) = 0.00357; ΔP = 28.35×0.00357 = 0.10; P = 28.35−0.10 = 28.25 torr", en: "Correct — mol sucrose = 68/342 = 0.20; mol water = 1000/18 = 55.56; X_sucrose = 0.20/55.76 = 0.00357; ΔP = 28.35×0.00357 = 0.10; P = 28.35−0.10 = 28.25 torr." } },
      { id: "c", label: { th: "ค. 28.35 torr", en: "28.35 torr" }, why: { th: "ผิด — คือความดันไอของน้ำบริสุทธิ์ ไม่ได้ลบ ΔP ออก", en: "Wrong — that is pure water vapor pressure; did not subtract ΔP." } },
      { id: "d", label: { th: "ง. 28.45 torr", en: "28.45 torr" }, why: { th: "ผิด — บวก ΔP แทนที่จะลบ ⚠️ ความดันไอสารละลายต้องน้อยกว่าตัวทำละลายบริสุทธิ์เสมอ!", en: "Wrong — added ΔP instead of subtracting. ⚠️ Solution vapor pressure must always be lower than pure solvent!" } },
      { id: "e", label: { th: "จ. 0.10 torr", en: "0.10 torr" }, why: { th: "ผิด — คือค่า ΔP (ความดันที่ลดลง) ไม่ใช่ความดันไอของสารละลาย", en: "Wrong — that is ΔP (vapor pressure lowering), not the solution's vapor pressure." } },
    ],
    correctId: "b",
    sourceRef: "quiz.md ข้อ 44",
  },
  {
    id: "chem-q45",
    kind: "mcq",
    chapter: 5,
    prompt: {
      th: "สารละลายคู่ใดต่อไปนี้จัดเป็น \"สารละลายสมบูรณ์แบบ (Ideal solution)\" ที่มี ΔHsol = 0",
      en: "Which pair forms an ideal solution with ΔHsol = 0?",
    },
    options: [
      { id: "a", label: { th: "ก. NaCl + H₂O", en: "NaCl + H₂O" }, why: { th: "ผิด — เกิดแรง ion–dipole แรง ΔH ≠ 0 และ NaCl แตกตัวเป็นไอออน", en: "Wrong — strong ion–dipole forces, ΔH ≠ 0, and NaCl dissociates into ions." } },
      { id: "b", label: { th: "ข. I₂ + H₂O", en: "I₂ + H₂O" }, why: { th: "ผิด — I₂ ไม่มีขั้ว + H₂O มีขั้ว → ละลายน้อยมาก ไม่ใช่ ideal", en: "Wrong — I₂ nonpolar + H₂O polar → very low solubility, not ideal." } },
      { id: "c", label: { th: "ค. H₂O + CCl₄", en: "H₂O + CCl₄" }, why: { th: "ผิด — มีขั้ว + ไม่มีขั้ว → ไม่ผสมกันเลย (แยกชั้น)", en: "Wrong — polar + nonpolar → completely immiscible (separate layers)." } },
      { id: "d", label: { th: "ง. HCl + H₂O", en: "HCl + H₂O" }, why: { th: "ผิด — HCl แตกตัวสมบูรณ์เป็น H⁺ + Cl⁻ คายความร้อนมาก", en: "Wrong — HCl completely dissociates as H⁺ + Cl⁻ with significant heat released." } },
      { id: "e", label: { th: "จ. Benzene + Toluene", en: "Benzene + Toluene" }, why: { th: "ถูกต้อง — ทั้งคู่เป็นวงอะโรมาติกที่มีโครงสร้างและขนาดใกล้เคียงกัน แรงทั้ง 3 เท่ากัน (E₁=E₂=E₃) → ΔHsol = 0 → เป็นไปตามกฎของราอูลต์", en: "Correct — both aromatic with similar structure and size; all 3 interaction energies equal (E₁=E₂=E₃) → ΔHsol = 0 → follows Raoult's Law perfectly." } },
    ],
    correctId: "e",
    sourceRef: "quiz.md ข้อ 45",
  },

  // ══ Chapter 1: Atomic Structure — Hard (q46–q48) ══════════════════════════
  {
    id: "chem-q46",
    kind: "mcq",
    chapter: 1,
    prompt: {
      th: "อิเล็กตรอน (มวล 9.11×10⁻³¹ kg) เคลื่อนที่ด้วยความเร็ว 5.0×10⁶ m/s จะมีความยาวคลื่นเดอบรอยล์เท่าใด (h=6.626×10⁻³⁴ J·s)",
      en: "An electron (mass 9.11×10⁻³¹ kg) moves at 5.0×10⁶ m/s. What is its de Broglie wavelength? (h=6.626×10⁻³⁴ J·s)",
    },
    options: [
      { id: "a", label: { th: "ก. 1.45 × 10⁻¹⁰ m", en: "1.45 × 10⁻¹⁰ m" }, why: { th: "ถูกต้อง — λ = h/mv = 6.626×10⁻³⁴/(9.11×10⁻³¹ × 5.0×10⁶) = 6.626×10⁻³⁴/4.555×10⁻²⁴ = 1.45×10⁻¹⁰ m (≈ ขนาดอะตอม → เห็นสมบัติคลื่นได้จริง)", en: "Correct — λ = h/mv = 6.626×10⁻³⁴/(9.11×10⁻³¹×5.0×10⁶) = 6.626×10⁻³⁴/4.555×10⁻²⁴ = 1.45×10⁻¹⁰ m (≈ atomic size → wave properties observable)." } },
      { id: "b", label: { th: "ข. 1.45 × 10⁻¹² m", en: "1.45 × 10⁻¹² m" }, why: { th: "ผิด — เลขชี้กำลังผิด (คำนวณ 10⁻³⁴/10⁻²⁴ ผิด)", en: "Wrong — wrong exponent (error in computing 10⁻³⁴/10⁻²⁴)." } },
      { id: "c", label: { th: "ค. 3.03 × 10⁻⁹ m", en: "3.03 × 10⁻⁹ m" }, why: { th: "ผิด — คำนวณผิด", en: "Wrong — arithmetic error." } },
      { id: "d", label: { th: "ง. 6.63 × 10⁻¹⁰ m", en: "6.63 × 10⁻¹⁰ m" }, why: { th: "ผิด — ลืมคูณมวลกับความเร็ว หารด้วยแค่ตัวใดตัวหนึ่ง", en: "Wrong — forgot to multiply mass×velocity; divided by only one factor." } },
      { id: "e", label: { th: "จ. 7.28 × 10⁻⁸ m", en: "7.28 × 10⁻⁸ m" }, why: { th: "ผิด — สลับตัวเศษกับตัวส่วน", en: "Wrong — inverted numerator and denominator." } },
    ],
    correctId: "a",
    sourceRef: "quiz.md ข้อ 46",
  },
  {
    id: "chem-q47",
    kind: "mcq",
    chapter: 1,
    prompt: {
      th: "เส้นสเปกตรัมในอนุกรม Balmer ของไฮโดรเจนที่มีพลังงานต่ำที่สุด เกิดจากการเปลี่ยนระดับพลังงานในข้อใด",
      en: "Which energy transition produces the lowest-energy line in the Balmer series of hydrogen?",
    },
    options: [
      { id: "a", label: { th: "ก. n=2 → n=1", en: "n=2 → n=1" }, why: { th: "ผิด — n_f=1 คือ อนุกรม Lyman (UV) ไม่ใช่ Balmer", en: "Wrong — n_f=1 is the Lyman series (UV), not Balmer." } },
      { id: "b", label: { th: "ข. n=3 → n=1", en: "n=3 → n=1" }, why: { th: "ผิด — n_f=1 คือ Lyman series", en: "Wrong — n_f=1 is the Lyman series." } },
      { id: "c", label: { th: "ค. n=3 → n=2", en: "n=3 → n=2" }, why: { th: "ถูกต้อง — อนุกรม Balmer: n_f=2 เสมอ; n_i ที่ใกล้ n_f ที่สุด → ΔE น้อยสุด → λ = 656 nm (สีแดง)", en: "Correct — Balmer series always has n_f=2; n_i closest to n_f → smallest ΔE → λ = 656 nm (red light)." } },
      { id: "d", label: { th: "ง. n=6 → n=2", en: "n=6 → n=2" }, why: { th: "ผิด — อยู่ใน Balmer แต่ n_i=6 ห่างจาก n_f=2 มาก → ΔE สูงกว่า → λ สั้นกว่า (สีม่วง 410 nm)", en: "Wrong — Balmer series but n_i=6 far from n_f=2 → higher ΔE → shorter λ (violet 410 nm)." } },
      { id: "e", label: { th: "จ. n=4 → n=3", en: "n=4 → n=3" }, why: { th: "ผิด — n_f=3 คือ อนุกรม Paschen (IR)", en: "Wrong — n_f=3 is the Paschen series (IR)." } },
    ],
    correctId: "c",
    sourceRef: "quiz.md ข้อ 47",
  },
  {
    id: "chem-q48",
    kind: "mcq",
    chapter: 1,
    prompt: {
      th: "โลหะมีค่าฟังก์ชันงาน (Work function, W) = 3.00×10⁻¹⁹ J เมื่อฉายแสง 400 nm อิเล็กตรอนที่หลุดออกมาจะมีพลังงานจลน์สูงสุดเท่าใด",
      en: "A metal has a work function W = 3.00×10⁻¹⁹ J. Light of 400 nm is shone on it. What is the maximum kinetic energy of emitted electrons?",
    },
    options: [
      { id: "a", label: { th: "ก. 1.97 × 10⁻¹⁹ J", en: "1.97 × 10⁻¹⁹ J" }, why: { th: "ถูกต้อง — E_photon = 4.97×10⁻¹⁹ J (จากข้อ 25); KE = E_photon − W = 4.97×10⁻¹⁹ − 3.00×10⁻¹⁹ = 1.97×10⁻¹⁹ J", en: "Correct — E_photon = 4.97×10⁻¹⁹ J (from q25); KE = E_photon − W = 4.97×10⁻¹⁹ − 3.00×10⁻¹⁹ = 1.97×10⁻¹⁹ J." } },
      { id: "b", label: { th: "ข. 3.00 × 10⁻¹⁹ J", en: "3.00 × 10⁻¹⁹ J" }, why: { th: "ผิด — คือค่า Work function (W) ที่โจทย์ให้มา ไม่ใช่ KE", en: "Wrong — that is the work function (W) given in the problem, not KE." } },
      { id: "c", label: { th: "ค. 4.97 × 10⁻¹⁹ J", en: "4.97 × 10⁻¹⁹ J" }, why: { th: "ผิด — คือพลังงานโฟตอนทั้งหมด ยังไม่ได้หัก W ออก", en: "Wrong — that is the total photon energy before subtracting W." } },
      { id: "d", label: { th: "ง. 7.97 × 10⁻¹⁹ J", en: "7.97 × 10⁻¹⁹ J" }, why: { th: "ผิด — บวก W แทนที่จะลบ (KE = E + W ผิดสูตร)", en: "Wrong — added W instead of subtracting (used KE = E + W which is wrong)." } },
      { id: "e", label: { th: "จ. ไม่มีอิเล็กตรอนหลุดออกมา", en: "No electrons are emitted" }, why: { th: "ผิด — E_photon (4.97×10⁻¹⁹) > W (3.00×10⁻¹⁹) → อิเล็กตรอนหลุดได้ (ถ้า E < W จึงไม่หลุด)", en: "Wrong — E_photon (4.97×10⁻¹⁹) > W (3.00×10⁻¹⁹) → electrons are emitted (no emission only when E < W)." } },
    ],
    correctId: "a",
    sourceRef: "quiz.md ข้อ 48",
  },

  // ══ Chapter 2: Periodic Table — Hard (q49–q51) ════════════════════════════
  {
    id: "chem-q49",
    kind: "mcq",
    chapter: 2,
    prompt: {
      th: "เพราะเหตุใด Z_eff ของ Li, Na และ K จึงมีค่าเท่ากันคือ 1 ทั้งที่มีเลขอะตอมต่างกันมาก",
      en: "Why is Z_eff = 1 for Li, Na, and K even though their atomic numbers differ greatly?",
    },
    options: [
      { id: "a", label: { th: "ก. เพราะทั้งสามธาตุมีจำนวนโปรตอนเท่ากัน", en: "They have the same number of protons" }, why: { th: "ผิด — Li มี 3, Na มี 11, K มี 19 โปรตอน ต่างกันมาก", en: "Wrong — Li has 3, Na has 11, K has 19 protons; very different." } },
      { id: "b", label: { th: "ข. เพราะทั้งสามธาตุมีจำนวนอิเล็กตรอนทั้งหมดเท่ากัน", en: "They have the same total number of electrons" }, why: { th: "ผิด — จำนวนอิเล็กตรอน = 3, 11, 19 ต่างกัน", en: "Wrong — electron counts are 3, 11, 19; they are different." } },
      { id: "c", label: { th: "ค. เพราะเมื่อลงมาในหมู่เดียวกัน จำนวนอิเล็กตรอนชั้นในเพิ่มขึ้นตามเลขอะตอมพอดี เหลือเวเลนซ์อิเล็กตรอน 1 ตัวเท่ากัน", en: "Going down the group, inner electron count increases by the same amount as Z, leaving exactly 1 valence electron" }, why: { th: "ถูกต้อง — Li: Z=3, core=2 → Z_eff=1; Na: Z=11, core=10 → Z_eff=1; K: Z=19, core=18 → Z_eff=1 ผลต่าง Z−S = 1 เสมอ", en: "Correct — Li: Z=3, core=2 → Z_eff=1; Na: Z=11, core=10 → Z_eff=1; K: Z=19, core=18 → Z_eff=1; Z−S = 1 always." } },
      { id: "d", label: { th: "ง. เพราะทั้งสามธาตุมีขนาดอะตอมเท่ากัน", en: "They have the same atomic size" }, why: { th: "ผิด — ขนาดต่างกันชัดเจน K > Na > Li เพราะ n เพิ่มขึ้น", en: "Wrong — sizes differ clearly: K > Na > Li because n increases." } },
      { id: "e", label: { th: "จ. เพราะทั้งสามธาตุมีพลังงานไอออไนเซชันเท่ากัน", en: "They have the same ionization energy" }, why: { th: "ผิด — IE ต่างกัน Li(520) > Na(496) > K(419 kJ/mol)", en: "Wrong — IE values differ: Li(520) > Na(496) > K(419 kJ/mol)." } },
    ],
    correctId: "c",
    sourceRef: "quiz.md ข้อ 49",
  },
  {
    id: "chem-q50",
    kind: "mcq",
    chapter: 2,
    prompt: {
      th: "ข้อใดอธิบายเหตุผลที่ IE₁ ของ O มีค่า น้อยกว่า N ได้ถูกต้องที่สุด",
      en: "Which best explains why IE₁ of O is lower than N?",
    },
    options: [
      { id: "a", label: { th: "ก. O มีขนาดอะตอมใหญ่กว่า N", en: "O has a larger atomic radius than N" }, why: { th: "ผิด — O อยู่ทางขวาของ N จึงมีขนาดเล็กกว่า", en: "Wrong — O is to the right of N, so it is smaller." } },
      { id: "b", label: { th: "ข. O มี Z_eff น้อยกว่า N", en: "O has a smaller Z_eff than N" }, why: { th: "ผิด — O มี Z_eff=6 ซึ่งมากกว่า N (Z_eff=5)", en: "Wrong — O has Z_eff=6, larger than N's Z_eff=5." } },
      { id: "c", label: { th: "ค. O มีอิเล็กตรอนจับคู่กันในออร์บิทัล 2p ทำให้เกิดแรงผลักระหว่างอิเล็กตรอน จึงดึงออกง่ายกว่า N ที่มี p ครึ่งเต็ม", en: "O has a paired electron in 2p causing electron repulsion, making it easier to remove than N's half-filled p" }, why: { th: "ถูกต้อง — N(2p³): ↑ ↑ ↑ ครึ่งเต็มเสถียร; O(2p⁴): ↑↓ ↑ ↑ มีคู่ → แรงผลัก → ดึงออกง่าย → IE₁(O) < IE₁(N) (ความผิดปกติจุดที่ 2)", en: "Correct — N(2p³): ↑↑↑ half-filled, stable; O(2p⁴): ↑↓↑↑ has paired e⁻ → repulsion → easier to remove → IE₁(O) < IE₁(N) (2nd anomaly)." } },
      { id: "d", label: { th: "ง. อิเล็กตรอนที่ถูกดึงออกของ O อยู่ในซับเชลล์ s ส่วนของ N อยู่ในซับเชลล์ p", en: "The electron removed from O is in s while N's is in p" }, why: { th: "ผิด — ทั้ง N และ O ต่างดึง e⁻ ออกจากซับเชลล์ 2p เหมือนกัน", en: "Wrong — both N and O remove electrons from the 2p subshell." } },
      { id: "e", label: { th: "จ. O มีเวเลนซ์อิเล็กตรอนน้อยกว่า N", en: "O has fewer valence electrons than N" }, why: { th: "ผิด — O มีเวเลนซ์ 6 ตัว ซึ่งมากกว่า N ที่มี 5 ตัว", en: "Wrong — O has 6 valence electrons, more than N's 5." } },
    ],
    correctId: "c",
    sourceRef: "quiz.md ข้อ 50",
  },
  {
    id: "chem-q51",
    kind: "mcq",
    chapter: 2,
    prompt: {
      th: "จงเรียงลำดับพลังงานไอออไนเซชันลำดับที่ 1 (IE₁) ของธาตุ Na, Mg, Al, Si, P จาก น้อยไปมาก",
      en: "Order the first ionization energies (IE₁) of Na, Mg, Al, Si, P from lowest to highest.",
    },
    options: [
      { id: "a", label: { th: "ก. Na < Al < Mg < Si < P", en: "Na < Al < Mg < Si < P" }, why: { th: "ถูกต้อง — ความผิดปกติ: Al < Mg (e⁻ ใน 3p สูงกว่า 3s ของ Mg); ส่วน Na < Al < Mg < Si < P สอดคล้องกับข้อมูลจริง", en: "Correct — anomaly: Al < Mg (3p electron higher energy than Mg's filled 3s); Na < Al < Mg < Si < P matches real values." } },
      { id: "b", label: { th: "ข. Na < Mg < Al < Si < P", en: "Na < Mg < Al < Si < P" }, why: { th: "ผิด — เป็นแนวโน้มทั่วไปที่ไม่คำนึงถึงความผิดปกติ Mg/Al ⚠️ ตัวหลอกหลัก!", en: "Wrong — this is the general trend ignoring the Mg/Al anomaly. ⚠️ Main trap!" } },
      { id: "c", label: { th: "ค. P < Si < Al < Mg < Na", en: "P < Si < Al < Mg < Na" }, why: { th: "ผิด — กลับด้านทั้งหมด", en: "Wrong — completely reversed." } },
      { id: "d", label: { th: "ง. Mg < Na < Al < P < Si", en: "Mg < Na < Al < P < Si" }, why: { th: "ผิด — Mg < Na ผิด (Na หมู่ 1 ต่ำสุดในคาบ 3)", en: "Wrong — Mg < Na is wrong (Na Group 1 has the lowest IE in Period 3)." } },
      { id: "e", label: { th: "จ. Al < Na < Si < Mg < P", en: "Al < Na < Si < Mg < P" }, why: { th: "ผิด — Al < Na ผิด", en: "Wrong — Al < Na is incorrect." } },
    ],
    correctId: "a",
    sourceRef: "quiz.md ข้อ 51",
  },

  // ══ Chapter 3: Chemical Bonding — Hard (q52–q54) ══════════════════════════
  {
    id: "chem-q52",
    kind: "mcq",
    chapter: 3,
    prompt: {
      th: "จากโครงสร้างลิวอิสของ NO₃⁻ ที่มีพันธะคู่ N=O จำนวน 1 พันธะ และพันธะเดี่ยว N–O จำนวน 2 พันธะ ประจุฟอร์มัล (Formal charge) ของอะตอมไนโตรเจนมีค่าเท่าใด",
      en: "In the Lewis structure of NO₃⁻ with 1 N=O double bond and 2 N–O single bonds and no lone pairs on N, what is the formal charge on nitrogen?",
    },
    options: [
      { id: "a", label: { th: "ก. +1", en: "+1" }, why: { th: "ถูกต้อง — FC_N = 5 − 0 − ½(8) = +1 (เวเลนซ์ N=5, lone pairs=0, bonding e⁻=4+2+2=8)", en: "Correct — FC_N = 5 − 0 − ½(8) = +1 (N valence=5, lone pairs=0, bonding e⁻=4+2+2=8)." } },
      { id: "b", label: { th: "ข. 0", en: "0" }, why: { th: "ผิด — คือ FC ของ O ที่สร้างพันธะคู่", en: "Wrong — that is the FC of the oxygen forming the double bond." } },
      { id: "c", label: { th: "ค. −1", en: "−1" }, why: { th: "ผิด — คือ FC ของ O ที่สร้างพันธะเดี่ยว", en: "Wrong — that is the FC of each oxygen forming a single bond." } },
      { id: "d", label: { th: "ง. +2", en: "+2" }, why: { th: "ผิด — คำนวณผิด (ลืมหาร 2 หรือนับ e⁻ ร่วมพันธะผิด)", en: "Wrong — calculation error (forgot to halve or miscounted bonding electrons)." } },
      { id: "e", label: { th: "จ. −2", en: "−2" }, why: { th: "ผิด — ผิดทั้งเครื่องหมายและขนาด", en: "Wrong — both sign and magnitude are incorrect." } },
    ],
    correctId: "a",
    sourceRef: "quiz.md ข้อ 52",
  },
  {
    id: "chem-q53",
    kind: "mcq",
    chapter: 3,
    prompt: {
      th: "โมเลกุล NO มีอันดับพันธะและสมบัติทางแม่เหล็กเป็นอย่างไรตามทฤษฎี MO",
      en: "What is the bond order and magnetic property of NO according to MO theory?",
    },
    options: [
      { id: "a", label: { th: "ก. Bond order = 2.0, Diamagnetic", en: "Bond order = 2.0, Diamagnetic" }, why: { th: "ผิด — BO ผิด และ e⁻ รวม 11 (เลขคี่) → ต้องเป็น paramagnetic", en: "Wrong — BO incorrect, and 11 total e⁻ (odd number) → must be paramagnetic." } },
      { id: "b", label: { th: "ข. Bond order = 2.5, Paramagnetic", en: "Bond order = 2.5, Paramagnetic" }, why: { th: "ถูกต้อง — NO มี 11 เวเลนซ์ e⁻: bonding=8, antibonding=3 → BO=(8-3)/2=2.5; e⁻ เดี่ยว 1 ตัวใน π*2p → paramagnetic", en: "Correct — NO has 11 valence e⁻: bonding=8, antibonding=3 → BO=(8-3)/2=2.5; 1 unpaired e⁻ in π*2p → paramagnetic." } },
      { id: "c", label: { th: "ค. Bond order = 3.0, Diamagnetic", en: "Bond order = 3.0, Diamagnetic" }, why: { th: "ผิด — BO=3 คือ N₂ และ CO; NO มี e⁻ คี่จึงเป็น diamagnetic ไม่ได้", en: "Wrong — BO=3 is for N₂ and CO; NO has odd e⁻ count so cannot be diamagnetic." } },
      { id: "d", label: { th: "ง. Bond order = 1.5, Paramagnetic", en: "Bond order = 1.5, Paramagnetic" }, why: { th: "ผิด — BO=1.5 คือ O₂⁻", en: "Wrong — BO=1.5 is for O₂⁻." } },
      { id: "e", label: { th: "จ. Bond order = 2.5, Diamagnetic", en: "Bond order = 2.5, Diamagnetic" }, why: { th: "ผิด — BO ถูกแต่สมบัติแม่เหล็กผิด ⚠️ ตัวหลอกที่ดีที่สุด! e⁻ รวมเลขคี่ → paramagnetic เสมอ", en: "Wrong — BO correct but magnetic property wrong. ⚠️ Best trap! Odd total e⁻ → always paramagnetic." } },
    ],
    correctId: "b",
    sourceRef: "quiz.md ข้อ 53",
  },
  {
    id: "chem-q54",
    kind: "mcq",
    chapter: 3,
    prompt: {
      th: "โมเลกุล ClF₃ มีรูปร่างโมเลกุล ไฮบริไดเซชัน และจำนวนคู่โดดเดี่ยวบนอะตอมกลางเป็นอย่างไรตามลำดับ",
      en: "What is the molecular shape, hybridization, and number of lone pairs on the central atom of ClF₃?",
    },
    options: [
      { id: "a", label: { th: "ก. สามเหลี่ยมแบนราบ, sp², 0 คู่", en: "Trigonal planar, sp², 0 pairs" }, why: { th: "ผิด — Cl มีเวเลนซ์ 7 e⁻ ไม่ใช่ 3 ต้องมีคู่โดดเดี่ยว", en: "Wrong — Cl has 7 valence e⁻, not 3; lone pairs are unavoidable." } },
      { id: "b", label: { th: "ข. พีระมิดฐานสามเหลี่ยม, sp³, 1 คู่", en: "Trigonal pyramidal, sp³, 1 pair" }, why: { th: "ผิด — นับคู่โดดเดี่ยวผิด Cl มี 7−3=4 e⁻ ที่ไม่ใช่พันธะ = 2 คู่โดดเดี่ยว", en: "Wrong — lone pair count wrong; Cl has 7−3=4 non-bonding e⁻ = 2 lone pairs." } },
      { id: "c", label: { th: "ค. เส้นตรง, sp³d, 3 คู่", en: "Linear, sp³d, 3 pairs" }, why: { th: "ผิด — เส้นตรง + sp³d + 3 lone pairs คือ XeF₂ (AX₂E₃ 5 โดเมน)", en: "Wrong — Linear + sp³d + 3 lone pairs describes XeF₂ (AX₂E₃, 5 domains)." } },
      { id: "d", label: { th: "ง. กระดานหก, sp³d, 1 คู่", en: "Seesaw, sp³d, 1 pair" }, why: { th: "ผิด — Seesaw คือ AX₄E (SF₄) มีพันธะ 4 ตัว คู่โดดเดี่ยว 1 คู่", en: "Wrong — Seesaw is AX₄E (SF₄) with 4 bonds and 1 lone pair." } },
      { id: "e", label: { th: "จ. รูปตัวที (T-shaped), sp³d, 2 คู่", en: "T-shaped, sp³d, 2 pairs" }, why: { th: "ถูกต้อง — Cl: 7 e⁻, 3 พันธะกับ F → คู่โดดเดี่ยว 2 คู่ → AX₃E₂ → 5 โดเมน → sp³d → คู่โดดเดี่ยวทั้ง 2 อยู่ตำแหน่ง equatorial → T-shaped", en: "Correct — Cl: 7 e⁻, 3 F bonds → 2 lone pairs → AX₃E₂ → 5 domains → sp³d → both lone pairs in equatorial positions → T-shaped." } },
    ],
    correctId: "e",
    sourceRef: "quiz.md ข้อ 54",
  },

  // ══ Chapter 4: Stoichiometry — Hard (q55–q57) ════════════════════════════
  {
    id: "chem-q55",
    kind: "mcq",
    chapter: 4,
    prompt: {
      th: "จากปฏิกิริยา O₃(g) + NO(g) → O₂(g) + NO₂(g) ถ้าใช้ O₃ 0.740 g (MW=48.00) ทำปฏิกิริยากับ NO 0.670 g (MW=30.01) จะเกิด NO₂ (MW=46.01) กี่กรัม",
      en: "O₃(g) + NO(g) → O₂(g) + NO₂(g). Using O₃ 0.740 g (MW=48.00) and NO 0.670 g (MW=30.01), how many grams of NO₂ (MW=46.01) are produced?",
    },
    options: [
      { id: "a", label: { th: "ก. 0.522 กรัม", en: "0.522 g" }, why: { th: "ผิด — คำนวณ mol ผิด", en: "Wrong — mole calculation error." } },
      { id: "b", label: { th: "ข. 0.710 กรัม", en: "0.710 g" }, why: { th: "ถูกต้อง — mol O₃=0.740/48=0.01542; mol NO=0.670/30.01=0.02233; อัตราส่วน 1:1 → O₃ หมดก่อน (0.01542 < 0.02233); mol NO₂=0.01542; มวล = 0.01542×46.01 = 0.710 g", en: "Correct — mol O₃=0.740/48=0.01542; mol NO=0.670/30.01=0.02233; 1:1 ratio → O₃ is limiting (0.01542 < 0.02233); mol NO₂=0.01542; mass = 0.01542×46.01 = 0.710 g." } },
      { id: "c", label: { th: "ค. 1.027 กรัม", en: "1.027 g" }, why: { th: "ผิด — ใช้ NO เป็น limiting reagent (0.02233×46.01) ⚠️ ตรวจสอบว่าตัวไหนหมดก่อนเสมอ!", en: "Wrong — used NO as limiting reagent (0.02233×46.01). ⚠️ Always check which reagent is limiting!" } },
      { id: "d", label: { th: "ง. 1.410 กรัม", en: "1.410 g" }, why: { th: "ผิด — บวกมวลสารตั้งต้น (0.740+0.670) ซึ่งไม่ใช่วิธีที่ถูกต้อง", en: "Wrong — added reactant masses (0.740+0.670) which is not a valid method." } },
      { id: "e", label: { th: "จ. 0.318 กรัม", en: "0.318 g" }, why: { th: "ผิด — คำนวณผิด", en: "Wrong — arithmetic error." } },
    ],
    correctId: "b",
    sourceRef: "quiz.md ข้อ 55",
  },
  {
    id: "chem-q56",
    kind: "mcq",
    chapter: 4,
    prompt: {
      th: "การแยกทองแดงจาก Cu₂S 1,590 g (MW=159, AW Cu=63.5) ตามปฏิกิริยา Cu₂S + O₂ → 2Cu + SO₂ ถ้าได้ทองแดงจริง 1,200 g %yield มีค่าเท่าใด",
      en: "Extracting Cu from 1590 g Cu₂S (MW=159, AW Cu=63.5): Cu₂S + O₂ → 2Cu + SO₂. Actual Cu = 1200 g. What is %yield?",
    },
    options: [
      { id: "a", label: { th: "ก. 94.5%", en: "94.5%" }, why: { th: "ถูกต้อง — mol Cu₂S=1590/159=10; mol Cu=10×2=20; theoretical = 20×63.5=1270 g; %yield = 1200/1270×100 = 94.5%", en: "Correct — mol Cu₂S=1590/159=10; mol Cu=10×2=20; theoretical=20×63.5=1270 g; %yield=1200/1270×100=94.5%." } },
      { id: "b", label: { th: "ข. 84.2%", en: "84.2%" }, why: { th: "ผิด — คำนวณ MW หรือสัมประสิทธิ์ผิด", en: "Wrong — MW or coefficient error." } },
      { id: "c", label: { th: "ค. 75.5%", en: "75.5%" }, why: { th: "ผิด — ลืมคูณ 2 ในสมการ (ใช้ theoretical=635 g)", en: "Wrong — forgot to multiply by 2 in equation (used theoretical=635 g)." } },
      { id: "d", label: { th: "ง. 100.0%", en: "100.0%" }, why: { th: "ผิด — ผลได้จริง 1200 ≠ 1270 (ทางทฤษฎี)", en: "Wrong — actual yield 1200 ≠ 1270 (theoretical)." } },
      { id: "e", label: { th: "จ. 105.8%", en: "105.8%" }, why: { th: "ผิด — กลับเศษกับส่วน (1270/1200) ⚠️ %yield เกิน 100% ไม่ได้!", en: "Wrong — inverted the fraction (1270/1200). ⚠️ %yield cannot exceed 100%!" } },
    ],
    correctId: "a",
    sourceRef: "quiz.md ข้อ 56",
  },
  {
    id: "chem-q57",
    kind: "mcq",
    chapter: 4,
    prompt: {
      th: "สุรา gin ขนาด 1.00 L มีค่า 75 proof (Proof = 2 × %v/v ของเอทานอล, ความหนาแน่นเอทานอล = 0.798 g/mL) จงหามวลของเอทานอลในสุราขวดนี้",
      en: "Gin 1.00 L is 75 proof (Proof = 2 × %v/v ethanol, ethanol density = 0.798 g/mL). Find the mass of ethanol in this bottle.",
    },
    options: [
      { id: "a", label: { th: "ก. 149.6 กรัม", en: "149.6 g" }, why: { th: "ผิด — แปลง proof ผิด หาร 2 สองครั้ง", en: "Wrong — proof conversion error; divided by 2 twice." } },
      { id: "b", label: { th: "ข. 750.0 กรัม", en: "750.0 g" }, why: { th: "ผิด — ใช้ 75% โดยตรงและไม่คูณความหนาแน่น", en: "Wrong — used 75% directly and did not multiply by density." } },
      { id: "c", label: { th: "ค. 375.0 กรัม", en: "375.0 g" }, why: { th: "ผิด — คือปริมาตร (mL) ของเอทานอล ไม่ได้คูณความหนาแน่น ⚠️ อ่านหน่วยให้ดี!", en: "Wrong — that is the volume (mL) of ethanol, not multiplied by density. ⚠️ Check units!" } },
      { id: "d", label: { th: "ง. 598.5 กรัม", en: "598.5 g" }, why: { th: "ผิด — ใช้ %v/v = 75 (ไม่ได้หาร 2)", en: "Wrong — used %v/v = 75 without dividing by 2." } },
      { id: "e", label: { th: "จ. 299.3 กรัม", en: "299.3 g" }, why: { th: "ถูกต้อง — %v/v = 75/2 = 37.5%; V_ethanol = 37.5%×1000 mL = 375 mL; mass = 375×0.798 = 299.25 ≈ 299.3 g", en: "Correct — %v/v = 75/2 = 37.5%; V_ethanol = 37.5%×1000 mL = 375 mL; mass = 375×0.798 = 299.3 g." } },
    ],
    correctId: "e",
    sourceRef: "quiz.md ข้อ 57",
  },

  // ══ Chapter 5: Liquids & Solutions — Hard (q58–q60) ══════════════════════
  {
    id: "chem-q58",
    kind: "mcq",
    chapter: 5,
    prompt: {
      th: "เอทิลีนไกลคอล (C₂H₆O₂, MW=62 g/mol) ในน้ำเข้มข้น 25.0% w/w จุดเยือกแข็งของสารละลายนี้มีค่าประมาณเท่าใด (Kf=1.86 °C/m)",
      en: "Ethylene glycol (C₂H₆O₂, MW=62 g/mol) in water at 25.0% w/w. What is the freezing point of the solution? (Kf=1.86 °C/m)",
    },
    options: [
      { id: "a", label: { th: "ก. −2.8 °C", en: "−2.8 °C" }, why: { th: "ผิด — ใช้ Kb=0.52 แทน Kf (ΔTb=2.79 ≈ 2.8)", en: "Wrong — used Kb=0.52 instead of Kf (ΔTb=2.79 ≈ 2.8)." } },
      { id: "b", label: { th: "ข. −10.0 °C", en: "−10.0 °C" }, why: { th: "ถูกต้อง — สมมติ 100 g: glycol=25 g, water=75 g=0.075 kg; m=25/62/0.075=5.376 m; ΔTf=1.86×5.376=10.0°C; Tf=0−10=−10.0°C", en: "Correct — assume 100 g: glycol=25 g, water=75 g=0.075 kg; m=25/62/0.075=5.376 m; ΔTf=1.86×5.376=10.0°C; Tf=0−10=−10.0°C." } },
      { id: "c", label: { th: "ค. −7.5 °C", en: "−7.5 °C" }, why: { th: "ผิด — ใช้มวลสารละลาย 100 g เป็นตัวหารแทนมวลตัวทำละลาย 75 g ⚠️ จุดพลาดสำคัญ!", en: "Wrong — used solution mass 100 g as denominator instead of solvent mass 75 g. ⚠️ Key error!" } },
      { id: "d", label: { th: "ง. −5.4 °C", en: "−5.4 °C" }, why: { th: "ผิด — เอาค่า m (5.37) มาตอบโดยตรง ไม่ได้คูณ Kf", en: "Wrong — used m (5.37) directly as the answer without multiplying by Kf." } },
      { id: "e", label: { th: "จ. +10.0 °C", en: "+10.0 °C" }, why: { th: "ผิด — เครื่องหมายผิด ⚠️ จุดเยือกแข็งสารละลายต้องต่ำลงเสมอ ไม่ใช่สูงขึ้น!", en: "Wrong — wrong sign. ⚠️ Solution freezing point must always decrease, not increase!" } },
    ],
    correctId: "b",
    sourceRef: "quiz.md ข้อ 58",
  },
  {
    id: "chem-q59",
    kind: "mcq",
    chapter: 5,
    prompt: {
      th: "ละลายตัวถูกละลายที่ไม่แตกตัว 4.5 g ในน้ำ 125 g ได้สารละลายที่มีจุดเยือกแข็ง −0.372 °C จงหามวลโมเลกุลของตัวถูกละลาย (Kf=1.86 °C/m)",
      en: "4.5 g of a non-dissociating solute dissolved in 125 g water gives a solution with a freezing point of −0.372 °C. Find the molar mass of the solute. (Kf=1.86 °C/m)",
    },
    options: [
      { id: "a", label: { th: "ก. 60", en: "60" }, why: { th: "ผิด — คำนวณผิดหลัก", en: "Wrong — major arithmetic error." } },
      { id: "b", label: { th: "ข. 90", en: "90" }, why: { th: "ผิด — หาร 2 เกินไป", en: "Wrong — divided by 2 extra time." } },
      { id: "c", label: { th: "ค. 180", en: "180" }, why: { th: "ถูกต้อง — ΔTf = Kf×m → 0.372 = 1.86×(4.5/M_B)×(1000/125) → 0.372 = 1.86×4.5×8/M_B → M_B = 66.96/0.372 = 180 g/mol (กลูโคส!)", en: "Correct — ΔTf = Kf×m → 0.372 = 1.86×(4.5/M_B)×(1000/125) → 0.372 = 66.96/M_B → M_B = 180 g/mol (glucose!)." } },
      { id: "d", label: { th: "ง. 120", en: "120" }, why: { th: "ผิด — คำนวณอัตราส่วนผิด", en: "Wrong — ratio calculation error." } },
      { id: "e", label: { th: "จ. 342", en: "342" }, why: { th: "ผิด — คือ MW ของซูโครส สับสนจากตัวอย่างอื่น", en: "Wrong — that is MW of sucrose; confused with another example." } },
    ],
    correctId: "c",
    sourceRef: "quiz.md ข้อ 59",
  },
  {
    id: "chem-q60",
    kind: "mcq",
    chapter: 5,
    prompt: {
      th: "CCl₄ มีความดันไอ 0.132 atm ที่ 23°C และมี ΔHvap = 32.18 kJ/mol จงหาความดันไอของ CCl₄ ที่ 58°C (R=8.314 J/mol·K)",
      en: "CCl₄ has vapor pressure 0.132 atm at 23°C and ΔHvap = 32.18 kJ/mol. Find vapor pressure at 58°C. (R=8.314 J/mol·K)",
    },
    options: [
      { id: "a", label: { th: "ก. 0.132 atm", en: "0.132 atm" }, why: { th: "ผิด — คือ P₁ ที่ 23°C ความดันไอต้องเพิ่มขึ้นเมื่ออุณหภูมิสูงขึ้น", en: "Wrong — that is P₁ at 23°C; vapor pressure must increase as temperature rises." } },
      { id: "b", label: { th: "ข. 0.264 atm", en: "0.264 atm" }, why: { th: "ผิด — สมมติว่าความดันไอเพิ่มเป็น 2 เท่าแบบเชิงเส้น (ความสัมพันธ์จริงเป็น exponential)", en: "Wrong — assumes linear doubling; the actual relationship is exponential (Clausius-Clapeyron)." } },
      { id: "c", label: { th: "ค. 0.398 atm", en: "0.398 atm" }, why: { th: "ผิด — ลืมแปลง kJ→J หรือคำนวณ log ผิด", en: "Wrong — forgot to convert kJ→J or logarithm error." } },
      { id: "d", label: { th: "ง. 1.000 atm", en: "1.000 atm" }, why: { th: "ผิด — คือความดันที่จุดเดือดปกติของ CCl₄ (77°C) ไม่ใช่ที่ 58°C", en: "Wrong — that is the pressure at the normal boiling point of CCl₄ (77°C), not at 58°C." } },
      { id: "e", label: { th: "จ. 0.526 atm", en: "0.526 atm" }, why: { th: "ถูกต้อง — Clausius-Clapeyron: ln(P₂/0.132) = (32180/8.314)×(1/296−1/331) = 3870.5×3.575×10⁻⁴ = 1.383; P₂/0.132 = e^1.383 = 3.987; P₂ = 0.526 atm ⚠️ ต้องแปลง °C→K และ kJ→J!", en: "Correct — Clausius-Clapeyron: ln(P₂/0.132) = (32180/8.314)×(1/296−1/331) = 3870.5×3.575×10⁻⁴ = 1.383; P₂/0.132 = e^1.383 = 3.987; P₂ = 0.526 atm. ⚠️ Must convert °C→K and kJ→J!" } },
    ],
    correctId: "e",
    sourceRef: "quiz.md ข้อ 60",
  },
];
