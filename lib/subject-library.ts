import type { LText } from "@/lib/i18n";

// SubjectAsset describes one item in a subject's resource library.
// fileType determines how the preview modal renders the asset.
export type AssetFileType = "pdf" | "image" | "md";

export interface SubjectAsset {
  id: string;
  title: LText;
  description: LText;
  tags: string[];         // display tags, e.g. ["Ch.2", "Variables", "Cheatsheet"]
  fileType: AssetFileType;
  url: string;            // public path, e.g. "/assets/en-kmitl/compro/cheatsheet.pdf"
  fileName: string;       // used for the download link's suggested filename
}

// ── ComPro Assets ────────────────────────────────────────────────────────────
// These entries reference the bundled summary markdown (rendered inline in the
// preview modal as rich text) because no separate slide PDFs are bundled.
// Add physical file entries (fileType: "pdf") when actual course PDFs are
// placed in public/assets/en-kmitl/compro/.
export const COMPRO_ASSETS: SubjectAsset[] = [
  {
    id: "compro-summary-md",
    title: {
      th: "สรุปคอมโปร Midterm (บทที่ 1–5 + ภาคผนวก)",
      en: "ComPro Midterm Summary (Ch. 1–5 + Appendix)",
    },
    description: {
      th: "สรุปเนื้อหาทั้งหมดของวิชา 01006012 Computer Programming ครอบคลุมพื้นฐานคอมพิวเตอร์, ตัวแปร/นิพจน์, เงื่อนไข, while, for และภาคผนวก (list, string, dict, tuple, file) พร้อมตัวอย่างโค้ดและหมายเหตุสำคัญ",
      en: "Complete summary for 01006012 Computer Programming: computer basics, variables & expressions, conditionals, while loops, for loops, and appendix topics (list, string, dict, tuple, file I/O) with code examples and exam traps.",
    },
    tags: ["All Chapters", "Summary", "Markdown", "ภาษาไทย"],
    fileType: "md",
    url: "/en-kmitl/compro/summary",
    fileName: "สรุปคอมโปร-Midterm.md",
  },
  {
    id: "compro-ch1-fundamentals",
    title: {
      th: "บทที่ 1 — พื้นฐานคอมพิวเตอร์",
      en: "Chapter 1 — Computer Fundamentals",
    },
    description: {
      th: "โครงสร้างคอมพิวเตอร์ (CPU, RAM, Storage), หน่วยวัดข้อมูล (Bit→GB→TB), ความแตกต่างระหว่าง Hardware/Software, ระบบเลขฐาน (Binary/Hex) และการแปลง",
      en: "Computer architecture (CPU, RAM, Storage), data units (Bit→GB→TB), Hardware vs Software, number systems (Binary/Hex) and conversions.",
    },
    tags: ["Ch.1", "Computer Basics", "Binary", "Hardware"],
    fileType: "md",
    url: "/en-kmitl/compro/summary#chapter-1",
    fileName: "ComPro-Ch1-Fundamentals.md",
  },
  {
    id: "compro-ch2-variables",
    title: {
      th: "บทที่ 2 — ตัวแปร นิพจน์ และ I/O",
      en: "Chapter 2 — Variables, Expressions & I/O",
    },
    description: {
      th: "ชนิดข้อมูล (int, float, str, bool), ตัวดำเนินการทางคณิตศาสตร์และลำดับการคำนวณ, ฟังก์ชัน input()/print(), การแปลงชนิดข้อมูล (type casting) และจุดสำคัญเรื่อง float precision",
      en: "Data types (int, float, str, bool), arithmetic operators and precedence (**right-to-left!), input()/print(), type casting, and float precision pitfalls (0.1+0.2 ≠ 0.3).",
    },
    tags: ["Ch.2", "Variables", "Operators", "I/O", "Python"],
    fileType: "md",
    url: "/en-kmitl/compro/summary#chapter-2",
    fileName: "ComPro-Ch2-Variables.md",
  },
  {
    id: "compro-ch3-conditionals",
    title: {
      th: "บทที่ 3 — การเขียนโปรแกรมแบบมีเงื่อนไข",
      en: "Chapter 3 — Conditional Execution",
    },
    description: {
      th: "if / elif / else, ตัวดำเนินการเปรียบเทียบ, ตัวดำเนินการ logical (and/or/not), nested conditions, one-liner ternary และ Pattern ที่ออกข้อสอบบ่อย เช่น การหาค่าสูงสุด/ต่ำสุด",
      en: "if/elif/else syntax, comparison operators, logical operators (and/or/not), nested conditions, ternary expressions, and common exam patterns (finding max/min).",
    },
    tags: ["Ch.3", "Conditionals", "if-else", "Logic", "Python"],
    fileType: "md",
    url: "/en-kmitl/compro/summary#chapter-3",
    fileName: "ComPro-Ch3-Conditionals.md",
  },
  {
    id: "compro-ch4-while",
    title: {
      th: "บทที่ 4 — การวนซ้ำ while",
      en: "Chapter 4 — while Loops",
    },
    description: {
      th: "โครงสร้าง while loop, Infinite loop และการใช้ break, sentinel-controlled loop, counter-controlled loop, การสะสมค่า (accumulator pattern) และ while-else",
      en: "while loop structure, infinite loops and break, sentinel-controlled and counter-controlled patterns, accumulator pattern, and while-else.",
    },
    tags: ["Ch.4", "while", "Loops", "break", "Python"],
    fileType: "md",
    url: "/en-kmitl/compro/summary#chapter-4",
    fileName: "ComPro-Ch4-While.md",
  },
  {
    id: "compro-ch5-for",
    title: {
      th: "บทที่ 5 — การวนซ้ำ for",
      en: "Chapter 5 — for Loops",
    },
    description: {
      th: "for loop กับ range(), การ iterate ผ่าน string/list, nested for loop, for-else, เปรียบเทียบ for vs while และการเลือกใช้งาน",
      en: "for loops with range(), iterating over strings/lists, nested for loops, for-else, for vs while comparison and when to use each.",
    },
    tags: ["Ch.5", "for", "range()", "Loops", "Python"],
    fileType: "md",
    url: "/en-kmitl/compro/summary#chapter-5",
    fileName: "ComPro-Ch5-For.md",
  },
  {
    id: "compro-appendix-collections",
    title: {
      th: "ภาคผนวก — list, string, dict, tuple, file",
      en: "Appendix — list, string, dict, tuple, file I/O",
    },
    description: {
      th: "สรุปเมธอดและการใช้งานที่สำคัญ: list (append/pop/sort), string methods (split/join/strip), dict (keys/values/items), tuple (immutable), การอ่าน-เขียนไฟล์ด้วย open()",
      en: "Key methods and usage: list (append/pop/sort), string methods (split/join/strip), dict (keys/values/items), tuple (immutable), file I/O with open().",
    },
    tags: ["Appendix", "list", "dict", "string", "file", "Python"],
    fileType: "md",
    url: "/en-kmitl/compro/summary#appendix",
    fileName: "ComPro-Appendix-Collections.md",
  },
];

// ── Chem Assets ──────────────────────────────────────────────────────────────
export const CHEM_ASSETS: SubjectAsset[] = [
  {
    id: "chem-summary-md",
    title: {
      th: "📘 สรุปเนื้อหาเตรียมสอบมิดเทอม — เคมีทั่วไป (บทที่ 1–5 ฉบับเต็ม)",
      en: "📘 General Chemistry Midterm Complete Summary (Ch. 1–5)",
    },
    description: {
      th: "สรุปเนื้อหาเคมีทั่วไปมิดเทอม 2569 ฉบับสมบูรณ์ ครอบคลุมโครงสร้างอะตอม, ตารางธาตุและ Z_eff, พันธะเคมีและ VSEPR/MO, ปริมาณสารสัมพันธ์, ของเหลวและสารละลาย (สมบัติคอลลิเกทีฟ) พร้อมตารางสรุป สูตรต้องจำ จุดลวง และเช็คลิสต์ก่อนสอบ",
      en: "Complete 2569 Midterm General Chemistry summary: atomic structure, periodic table & Z_eff, chemical bonding & VSEPR/MO, stoichiometry, liquids & solutions (colligative properties) with formula cheatsheets, exam traps, and pre-exam checklist.",
    },
    tags: ["All Chapters", "Summary", "Markdown", "2569", "ภาษาไทย"],
    fileType: "md",
    url: "/en-kmitl/chem/summary",
    fileName: "สรุปเคมี-Midterm-2569.md",
  },
  // Ch 1
  {
    id: "chem-ch1-lecture",
    title: {
      th: "บทที่ 1 — โครงสร้างอะตอม (สไลด์เลกเชอร์)",
      en: "Chapter 1 — Atomic Structure (Lecture Slides)",
    },
    description: {
      th: "สไลด์ทางการ Ch1: วิวัฒนาการแบบจำลองอะตอม (Dalton, Thomson, Millikan, Rutherford, Bohr, Chadwick), อนุภาคมูลฐาน, คลื่นแม่เหล็กไฟฟ้า, ปรากฏการณ์โฟโตอิเล็กทริก, เลขควอนตัม และการจัดเรียงอิเล็กตรอน",
      en: "Official lecture slides for Ch1: atomic models evolution (Dalton, Thomson, Millikan, Rutherford, Bohr, Chadwick), subatomic particles, EM waves, photoelectric effect, quantum numbers, and electron configuration.",
    },
    tags: ["Ch.1", "Lecture Slide", "PDF", "Atomic Structure"],
    fileType: "pdf",
    url: "/assets/en-kmitl/chem/Ch1 Atomic structure.pdf",
    fileName: "Ch1 Atomic structure.pdf",
  },
  {
    id: "chem-ch1-selfstudy",
    title: {
      th: "บทที่ 1 — เอกสาร Self-Study โครงสร้างอะตอม",
      en: "Chapter 1 — Atomic Structure Self-Study Material",
    },
    description: {
      th: "แบบฝึกหัดทบทวนและเนื้อหาศึกษาด้วยตนเอง บทที่ 1 โครงสร้างอะตอม พร้อมโจทย์คำนวณความยาวคลื่น พลังงานโฟตอน และการเปลี่ยนระดับพลังงานของโบร์",
      en: "Self-study guide and review exercises for Ch1: wavelength, photon energy, and Bohr energy transitions.",
    },
    tags: ["Ch.1", "Self-Study", "PDF", "Exercises"],
    fileType: "pdf",
    url: "/assets/en-kmitl/chem/Ch1 Self study.pdf",
    fileName: "Ch1 Self study.pdf",
  },
  // Ch 2
  {
    id: "chem-ch2-lecture",
    title: {
      th: "บทที่ 2 — ตารางธาตุและสมบัติของอะตอม (สไลด์เลกเชอร์)",
      en: "Chapter 2 — The Periodic Table and Atomic Properties (Lecture Slides)",
    },
    description: {
      th: "สไลด์ทางการ Ch2: ประจุนิวเคลียสสุทธิ (Z_eff) และผลกำบัง, แนวโน้มขนาดอะตอม/ไอออน, พลังงานไอออไนเซชัน (IE) และจุดผิดปกติ, สัมพรรคภาพอิเล็กตรอน (EA), อิเล็กโทรเนกาติวิตี (EN)",
      en: "Official lecture slides for Ch2: effective nuclear charge (Z_eff) and shielding, atomic/ionic radius trends, ionization energy (IE) anomalies, electron affinity (EA), and electronegativity (EN).",
    },
    tags: ["Ch.2", "Lecture Slide", "PDF", "Periodic Table", "Z_eff"],
    fileType: "pdf",
    url: "/assets/en-kmitl/chem/Ch2 The Periodic Table and Some Atomic Properties 2569.pdf",
    fileName: "Ch2 The Periodic Table and Some Atomic Properties 2569.pdf",
  },
  {
    id: "chem-ch2-selfstudy",
    title: {
      th: "บทที่ 2 — เอกสาร Self-Study ตารางธาตุ",
      en: "Chapter 2 — Periodic Table Self-Study Material",
    },
    description: {
      th: "แบบฝึกหัดทบทวนแนวโน้มตารางธาตุ การเปรียบเทียบขนาดไอออนในอนุกรมไอโซอิเล็กทรอนิก และโจทย์วิเคราะห์ค่า IE เพื่อระบุหมู่ของธาตุ",
      en: "Self-study exercises on periodic trends, isoelectronic series ionic radii comparison, and IE jump analysis for identifying element groups.",
    },
    tags: ["Ch.2", "Self-Study", "PDF", "Exercises"],
    fileType: "pdf",
    url: "/assets/en-kmitl/chem/Ch2 Self study.pdf",
    fileName: "Ch2 Self study.pdf",
  },
  // Ch 3
  {
    id: "chem-ch3-lecture",
    title: {
      th: "บทที่ 3 — พันธะเคมี (สไลด์เลกเชอร์ 74 หน้า)",
      en: "Chapter 3 — Chemical Bonding (Lecture Slides - 74 slides)",
    },
    description: {
      th: "สไลด์ทางการ Ch3 (บทใหญ่ที่สุด): โครงสร้างลิวอิส, ประจุฟอร์มัล, ทฤษฎี VSEPR รูปร่างโมเลกุล (AX_nE_m), ไฮบริไดเซชัน (sp, sp², sp³, sp³d, sp³d²), ทฤษฎีออร์บิทัลเชิงโมเลกุล (MO) และแรงระหว่างโมเลกุล",
      en: "Official lecture slides for Ch3 (largest chapter): Lewis structures, formal charges, VSEPR molecular geometry, hybridization, Molecular Orbital (MO) theory, and intermolecular forces.",
    },
    tags: ["Ch.3", "Lecture Slide", "PDF", "Bonding", "VSEPR", "MO"],
    fileType: "pdf",
    url: "/assets/en-kmitl/chem/Ch3 Chemical Bonding_2569.pdf",
    fileName: "Ch3 Chemical Bonding_2569.pdf",
  },
  {
    id: "chem-ch3-discussion-key",
    title: {
      th: "บทที่ 3 — เฉลยโจทย์ Discussion Class พันธะเคมี",
      en: "Chapter 3 — Chemical Bonding Discussion Class Key",
    },
    description: {
      th: "เอกสารเฉลยละเอียดการอภิปรายในชั้นเรียน: เฉลยโจทย์วาดรูป VSEPR, การทำนายขั้วโมเลกุล, แผนภาพ MO ของโมเลกุลอะตอมคู่แถวสอง (N₂, O₂, NO, CO)",
      en: "Detailed discussion class answer key: VSEPR drawings, molecular polarity predictions, and MO diagrams for second-row diatomics (N₂, O₂, NO, CO).",
    },
    tags: ["Ch.3", "Discussion Key", "PDF", "Answer Key"],
    fileType: "pdf",
    url: "/assets/en-kmitl/chem/Ch03-Chemical Bonding-Discussion Class_2569-Key.pdf",
    fileName: "Ch03-Chemical Bonding-Discussion Class_2569-Key.pdf",
  },
  // Ch 4
  {
    id: "chem-ch4-review",
    title: {
      th: "บทที่ 4 — ปริมาณสารสัมพันธ์ (เอกสารทบทวน)",
      en: "Chapter 4 — Stoichiometry (Review Handout)",
    },
    description: {
      th: "เอกสารทบทวน Ch4: การแปลงหน่วยโมล-มวล-อนุภาค-ปริมาตรแก๊ส, สูตรอย่างง่าย/สูตรโมเลกุล, การดุลสมการ, สารกำหนดปริมาณ (Limiting Reagent), ร้อยละผลได้ (% Yield) และความเข้มข้นสารละลาย",
      en: "Ch4 review handout: mole conversions, empirical & molecular formulas, equation balancing, limiting reagents, percent yields, and solution concentration formulas.",
    },
    tags: ["Ch.4", "Review", "PDF", "Stoichiometry", "Limiting Reagent"],
    fileType: "pdf",
    url: "/assets/en-kmitl/chem/Ch4 Stiochiometry 2569_review.pdf",
    fileName: "Ch4 Stiochiometry 2569_review.pdf",
  },
  {
    id: "chem-ch4-key",
    title: {
      th: "บทที่ 4 — เฉลยแบบฝึกหัดปริมาณสารสัมพันธ์",
      en: "Chapter 4 — Stoichiometry Exercise Key",
    },
    description: {
      th: "เฉลยแบบฝึกหัดอย่างละเอียด Ch4 พร้อมวิธีคิดทีละสเต็ป แสดงการเทียบสัมประสิทธิ์สมการเคมีและการคำนวณการเจือจาง M₁V₁ = M₂V₂",
      en: "Complete step-by-step answer key for Ch4 stoichiometry exercises with equation stoichiometric ratios and dilution calculations.",
    },
    tags: ["Ch.4", "Exercise Key", "PDF", "Answer Key"],
    fileType: "pdf",
    url: "/assets/en-kmitl/chem/Ch4 Stiochiometry 2569_key.pdf",
    fileName: "Ch4 Stiochiometry 2569_key.pdf",
  },
  {
    id: "chem-ch4-selfstudy",
    title: {
      th: "บทที่ 4 — เอกสาร Self-Study ปริมาณสารสัมพันธ์",
      en: "Chapter 4 — Stoichiometry Self-Study Material",
    },
    description: {
      th: "แบบฝึกหัด Self-study บทที่ 4 เพิ่มเติมสำหรับฝึกทำโจทย์คำนวณสารกำหนดปริมาณและ % Yield หลากหลายรูปแบบ",
      en: "Additional self-study practice problems on limiting reagents, percent yield, and concentration conversions.",
    },
    tags: ["Ch.4", "Self-Study", "PDF", "Exercises"],
    fileType: "pdf",
    url: "/assets/en-kmitl/chem/Ch4 Self study.pdf",
    fileName: "Ch4 Self study.pdf",
  },
  // Ch 5
  {
    id: "chem-ch5-lecture",
    title: {
      th: "บทที่ 5 — ของเหลวและสารละลาย (สไลด์เลกเชอร์)",
      en: "Chapter 5 — Liquids and Solutions (Lecture Slides)",
    },
    description: {
      th: "สไลด์ทางการ Ch5: แรงระหว่างโมเลกุลกับสมบัติทางกายภาพ (ความดันไอ, จุดเดือด, ความหนืด), สมการ Clausius-Clapeyron, ปัจจัยต่อการละลาย, กฎของ Raoult, สมบัติคอลลิเกทีฟ (ΔT_b, ΔT_f, π) และคอลลอยด์",
      en: "Official lecture slides for Ch5: IMF vs physical properties (vapor pressure, boiling point, viscosity), Clausius-Clapeyron equation, solubility factors, Raoult's Law, colligative properties, and colloids.",
    },
    tags: ["Ch.5", "Lecture Slide", "PDF", "Liquids", "Colligative"],
    fileType: "pdf",
    url: "/assets/en-kmitl/chem/Ch5 Liquid and solution-2569 sc3.pdf",
    fileName: "Ch5 Liquid and solution-2569 sc3.pdf",
  },
  {
    id: "chem-ch5-selfstudy",
    title: {
      th: "บทที่ 5 — เอกสาร Self-Study ของเหลวและสารละลาย",
      en: "Chapter 5 — Liquids and Solutions Self-Study Material",
    },
    description: {
      th: "แบบฝึกหัดทบทวนการคำนวณความดันไอสารละลาย, การหามวลโมเลกุลจากจุดเยือกแข็งที่ลดลง (ΔT_f = K_f·m) และสมบัติคอลลอยด์",
      en: "Self-study exercises on solution vapor pressure, molar mass determination from freezing point depression, and colloid properties.",
    },
    tags: ["Ch.5", "Self-Study", "PDF", "Exercises"],
    fileType: "pdf",
    url: "/assets/en-kmitl/chem/Ch5 Self study.pdf",
    fileName: "Ch5 Self study.pdf",
  },
];


// ── ICS / Digital Logic Assets (IT-KMITL) ────────────────────────────────────
// Markdown entries link to the in-app readers under /it-kmitl/ics/*.
// PDF/image entries are the scanned 1/2564 midterm paper bundled in
// public/assets/it-kmitl/ics/.
export const ICS_ASSETS: SubjectAsset[] = [
  {
    id: "ics-summary-md",
    title: {
      th: "📘 สรุปเนื้อหา + Course Syllabus (บทที่ 1–6 ฉบับเต็ม)",
      en: "📘 Full Summary + Course Syllabus (Ch. 1–6)",
    },
    description: {
      th: "สรุปเตรียมสอบมิดเทอม ICS ครบทุกบท: ระบบเลขฐาน, พีชคณิตบูลีน, Logic Gates, K-Map (2–5 ตัวแปร), Timing & Propagation Delay, ออกแบบวงจร 7-Segment และ MUX พร้อมขอบเขตข้อสอบ 19 กับดักที่เสียคะแนนบ่อย และเช็คลิสต์ก่อนส่งกระดาษ",
      en: "Complete ICS midterm summary: number systems, Boolean algebra, logic gates, K-maps (2–5 variables), timing & propagation delay, 7-segment design, and MUX — plus exam scope, 19 common pitfalls, and a pre-submission checklist.",
    },
    tags: ["All Chapters", "Summary", "Markdown", "ภาษาไทย"],
    fileType: "md",
    url: "/it-kmitl/ics/summary",
    fileName: "ICS-สรุป-Midterm.md",
  },
  {
    id: "ics-mock-exam-md",
    title: {
      th: "📝 ข้อสอบมิดเทอมชุดฝึก + เฉลยละเอียด (120 + 10 คะแนน)",
      en: "📝 Practice Midterm Paper + Full Answer Key (120 + 10 pts)",
    },
    description: {
      th: "ข้อสอบอัตนัย 6 ข้อ ตามพิมพ์เขียวข้อสอบจริง (เลขฐาน 10, บูลีน 30, K-Map 30, Timing 20, ออกแบบวงจร 30, MUX เสริม 10) พร้อมเฉลยแบบแสดงวิธีทำทีละขั้น และ \"จุดที่คนมักผิด\" ทุกข้อ",
      en: "Six constructed-response questions matching the real exam blueprint (numbers 10, Boolean 30, K-map 30, timing 20, circuit design 30, MUX bonus 10) with fully worked solutions and a \"common mistakes\" note on every part.",
    },
    tags: ["Mock Exam", "Answer Key", "Markdown", "ภาษาไทย"],
    fileType: "md",
    url: "/it-kmitl/ics/exam",
    fileName: "ICS-ข้อสอบมิดเทอม-ชุดฝึก.md",
  },
  {
    id: "ics-analysis-md",
    title: {
      th: "🔍 วิเคราะห์พิมพ์เขียวข้อสอบ (Exam Blueprint Analysis)",
      en: "🔍 Exam Blueprint Analysis",
    },
    description: {
      th: "ถอดโครงข้อสอบมิดเทอม 1/2564 ทีละขั้น: ตารางคะแนนรายข้อ, ระดับความยากตาม Bloom's Taxonomy, Question Archetypes, 11 กับดักที่ข้อสอบชอบหลอก และคำแนะนำการจัดสรรเวลาในห้องสอบ 3 ชั่วโมง",
      en: "Step-by-step reverse-engineering of the 1/2564 midterm: per-question mark table, Bloom's-taxonomy difficulty profile, question archetypes, 11 recurring traps, and a 3-hour in-exam time budget.",
    },
    tags: ["Exam Analysis", "Strategy", "Markdown", "ภาษาไทย"],
    fileType: "md",
    url: "/it-kmitl/ics/analysis",
    fileName: "ICS-วิเคราะห์ข้อสอบ.md",
  },
  {
    id: "ics-past-paper-pdf",
    title: {
      th: "ข้อสอบมิดเทอมจริง ภาคเรียนที่ 1/2564 (PDF ฉบับสแกน)",
      en: "Actual Midterm Paper, Semester 1/2564 (scanned PDF)",
    },
    description: {
      th: "ไฟล์สแกนข้อสอบมิดเทอมของจริง ใช้เป็นต้นแบบของข้อสอบชุดฝึกและบทวิเคราะห์ทั้งหมดในหน้านี้ — 6 ข้อ 120 คะแนน + ข้อเสริม 10 คะแนน",
      en: "Scan of the real midterm paper — the source blueprint for the practice exam and analysis on this page. Six questions, 120 marks, plus a 10-mark bonus.",
    },
    tags: ["Past Paper", "PDF", "2564"],
    fileType: "pdf",
    url: "/assets/it-kmitl/ics/ics-midterm-1-2564.pdf",
    fileName: "ics-midterm-1-2564.pdf",
  },
  {
    id: "ics-past-paper-p1",
    title: { th: "ข้อสอบเดิม หน้า 1 — ข้อ 1 ระบบเลขฐาน", en: "Past paper p.1 — Q1 Number Systems" },
    description: {
      th: "หน้าแรกของข้อสอบจริง: หัวกระดาษ และข้อ 1 การแปลงเลขฐาน (bin→dec, bin→hex, dec→bin, hex→dec) รวม 10 คะแนน",
      en: "First page of the real paper: header and Q1 base conversions (bin→dec, bin→hex, dec→bin, hex→dec), 10 marks.",
    },
    tags: ["Past Paper", "Image", "Ch.1", "Number Systems"],
    fileType: "image",
    url: "/assets/it-kmitl/ics/pages/pg-01.jpg",
    fileName: "ics-2564-pg-01.jpg",
  },
  {
    id: "ics-past-paper-p2",
    title: { th: "ข้อสอบเดิม หน้า 2 — ข้อ 2 พีชคณิตบูลีน", en: "Past paper p.2 — Q2 Boolean Algebra" },
    description: {
      th: "ข้อ 2 พีชคณิตบูลีน: ลดรูปสมการ, De Morgan หา F', พิสูจน์เอกลักษณ์ และพิสูจน์เอาต์พุตของวงจร รวม 30 คะแนน",
      en: "Q2 Boolean algebra: minimization, De Morgan for F', identity proof, and proving a gate network's output — 30 marks.",
    },
    tags: ["Past Paper", "Image", "Ch.2", "Boolean Algebra"],
    fileType: "image",
    url: "/assets/it-kmitl/ics/pages/pg-02.jpg",
    fileName: "ics-2564-pg-02.jpg",
  },
  {
    id: "ics-past-paper-p3",
    title: { th: "ข้อสอบเดิม หน้า 3", en: "Past paper p.3" },
    description: {
      th: "หน้าต่อเนื่องของข้อ 2 — วงจรที่ต้องพิสูจน์เอาต์พุต และพื้นที่แสดงวิธีทำ",
      en: "Continuation of Q2 — the gate network to prove and the working space.",
    },
    tags: ["Past Paper", "Image", "Ch.2", "Logic Gates"],
    fileType: "image",
    url: "/assets/it-kmitl/ics/pages/pg-03.jpg",
    fileName: "ics-2564-pg-03.jpg",
  },
  {
    id: "ics-past-paper-p4",
    title: { th: "ข้อสอบเดิม หน้า 4 — ข้อ 3 K-Map", en: "Past paper p.4 — Q3 K-Map" },
    description: {
      th: "ข้อ 3 K-Map: 4 ตัวแปรรูปแบบ ΠM, 4 ตัวแปรพร้อม don't care และ 5 ตัวแปร รวม 30 คะแนน",
      en: "Q3 K-map: 4-variable ΠM, 4-variable with don't cares, and a 5-variable map — 30 marks.",
    },
    tags: ["Past Paper", "Image", "Ch.3", "K-Map"],
    fileType: "image",
    url: "/assets/it-kmitl/ics/pages/pg-04.jpg",
    fileName: "ics-2564-pg-04.jpg",
  },
  {
    id: "ics-past-paper-p5",
    title: { th: "ข้อสอบเดิม หน้า 5", en: "Past paper p.5" },
    description: {
      th: "หน้าต่อเนื่องของข้อ 3 — ผัง K-Map เปล่าสำหรับ 5 ตัวแปร (สองผืน A=0 และ A=1)",
      en: "Continuation of Q3 — blank 5-variable K-map sheets (A=0 and A=1).",
    },
    tags: ["Past Paper", "Image", "Ch.3", "K-Map"],
    fileType: "image",
    url: "/assets/it-kmitl/ics/pages/pg-05.jpg",
    fileName: "ics-2564-pg-05.jpg",
  },
  {
    id: "ics-past-paper-p6",
    title: { th: "ข้อสอบเดิม หน้า 6 — ข้อ 4 Time Response", en: "Past paper p.6 — Q4 Time Response" },
    description: {
      th: "ข้อ 4 Timing Diagram: วงจรพร้อมค่า gate delay, สัญญาณอินพุต A/B และตารางที่ต้องเติม 20 คะแนน",
      en: "Q4 timing diagram: the circuit with its gate delays, input waveforms A/B, and the table to fill in — 20 marks.",
    },
    tags: ["Past Paper", "Image", "Ch.4", "Timing"],
    fileType: "image",
    url: "/assets/it-kmitl/ics/pages/pg-06.jpg",
    fileName: "ics-2564-pg-06.jpg",
  },
  {
    id: "ics-past-paper-p7",
    title: { th: "ข้อสอบเดิม หน้า 7", en: "Past paper p.7" },
    description: {
      th: "หน้าต่อเนื่องของข้อ 4 — กริดสำหรับวาด Time Diagram ของสัญญาณ P, Q, R, S",
      en: "Continuation of Q4 — the grid for drawing the P, Q, R, S waveforms.",
    },
    tags: ["Past Paper", "Image", "Ch.4", "Timing"],
    fileType: "image",
    url: "/assets/it-kmitl/ics/pages/pg-07.jpg",
    fileName: "ics-2564-pg-07.jpg",
  },
  {
    id: "ics-past-paper-p8",
    title: { th: "ข้อสอบเดิม หน้า 8 — ข้อ 5 ออกแบบวงจร 7-Segment", en: "Past paper p.8 — Q5 7-Segment Design" },
    description: {
      th: "ข้อ 5 ออกแบบวงจร: โจทย์ 7-Segment Display, ตารางกำหนดการแสดงผล และผัง segment C0–C6 รวม 30 คะแนน",
      en: "Q5 circuit design: the 7-segment display brief, the display mapping table, and the C0–C6 segment layout — 30 marks.",
    },
    tags: ["Past Paper", "Image", "Ch.5", "7-Segment"],
    fileType: "image",
    url: "/assets/it-kmitl/ics/pages/pg-08.jpg",
    fileName: "ics-2564-pg-08.jpg",
  },
  {
    id: "ics-past-paper-p9",
    title: { th: "ข้อสอบเดิม หน้า 9", en: "Past paper p.9" },
    description: {
      th: "หน้าต่อเนื่องของข้อ 5 — ตารางความจริงเปล่า ผัง K-Map 7 ชุด และพื้นที่วาด Schematic",
      en: "Continuation of Q5 — the blank truth table, seven K-map grids, and the schematic space.",
    },
    tags: ["Past Paper", "Image", "Ch.5", "K-Map"],
    fileType: "image",
    url: "/assets/it-kmitl/ics/pages/pg-09.jpg",
    fileName: "ics-2564-pg-09.jpg",
  },
  {
    id: "ics-past-paper-p10",
    title: { th: "ข้อสอบเดิม หน้า 10 — ข้อ 6 MUX (คะแนนเสริม)", en: "Past paper p.10 — Q6 MUX (bonus)" },
    description: {
      th: "ข้อ 6 คะแนนเสริม: ออกแบบวงจรด้วย 4:1 MUX จากตารางความจริง โดยใช้ A และ B เป็น control inputs 10 คะแนน",
      en: "Q6 bonus: implement a truth table with a 4:1 MUX using A and B as control inputs — 10 marks.",
    },
    tags: ["Past Paper", "Image", "Ch.6", "MUX"],
    fileType: "image",
    url: "/assets/it-kmitl/ics/pages/pg-10.jpg",
    fileName: "ics-2564-pg-10.jpg",
  },
];
