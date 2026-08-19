import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { SubjectHub } from "@/components/subject-hub";
import { CHEM_CHAPTERS, CHEM_QUIZ } from "@/lib/chem-quiz";

export const metadata: Metadata = {
  title: "เคมีทั่วไป · EN-KMITL · iHelp",
  description:
    "สรุปเนื้อหา แบบทดสอบ และคลังทรัพยากรสำหรับวิชาเคมีทั่วไป (EN-KMITL) — โครงสร้างอะตอม พันธะเคมี สโตอิชิโอเมตรี สารละลาย สมดุลเคมี",
};

const L = {
  backLabel: { th: "← EN-KMITL", en: "← EN-KMITL" },
  title: { th: "เคมีทั่วไป (General Chemistry)", en: "General Chemistry" },
  subtitle: {
    th: "เตรียมสอบกลางภาค · บทที่ 1-5",
    en: "Midterm prep · Chapters 1-5",
  },
  summaryCardTitle: { th: "สรุปเนื้อหา", en: "Summary Notes" },
  summaryCardDesc: {
    th: "สรุปครบทุกบท: อะตอม, ตารางธาตุ, พันธะ, สโตอิชิโอ, สารละลาย, สมดุล/กรด-เบส",
    en: "Full recap: atoms, periodic table, bonding, stoichiometry, solutions, equilibrium & acid-base",
  },
  quizCardTitle: { th: "แบบทดสอบ", en: "Interactive Quiz" },
  quizCardDesc: {
    th: "20 ข้อ ครอบคลุมทุกบท พร้อมคำอธิบายและ feedback ทันที",
    en: "20 questions covering all chapters with instant feedback and explanations",
  },
  libraryCardTitle: { th: "คลังทรัพยากร", en: "Resource Library" },
  libraryCardDesc: {
    th: "สรุปเนื้อหารายบท สูตรอ้างอิง และเอกสารเพิ่มเติม",
    en: "Chapter summaries, formula references, and supplementary documents",
  },
  overviewTitle: { th: "ภาพรวมเนื้อหา", en: "Content Overview" },
};

export default function ChemPage() {
  return (
    <>
      <Navbar />
      <SubjectHub
        baseHref="/en-kmitl/chem"
        backHref="/en-kmitl"
        backLabel={L.backLabel}
        title={L.title}
        subtitle={L.subtitle}
        summaryCardTitle={L.summaryCardTitle}
        summaryCardDesc={L.summaryCardDesc}
        quizCardTitle={L.quizCardTitle}
        quizCardDesc={L.quizCardDesc}
        libraryCardTitle={L.libraryCardTitle}
        libraryCardDesc={L.libraryCardDesc}
        overviewTitle={L.overviewTitle}
        chapters={CHEM_CHAPTERS}
        questions={CHEM_QUIZ}
      />
    </>
  );
}
