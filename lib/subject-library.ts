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

