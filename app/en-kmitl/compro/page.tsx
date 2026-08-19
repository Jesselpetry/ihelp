import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { SubjectHub } from "@/components/subject-hub";
import { EN_KMITL_CHAPTERS, EN_KMITL_QUIZ } from "@/lib/en-kmitl-quiz";
import { EN_KMITL_MOCK_EXAM } from "@/lib/en-kmitl-mock-exam";

export const metadata: Metadata = {
  title: "Computer Programming · EN-KMITL · iHelp",
  description:
    "สรุปเนื้อหา แบบทดสอบ และคลังทรัพยากรสำหรับ 01006012 Computer Programming (EN-KMITL) — เตรียมสอบกลางภาค",
};

// Combine curated quiz + mock exam questions for chapter-count display
const ALL_COMPRO_QUESTIONS = [...EN_KMITL_QUIZ, ...EN_KMITL_MOCK_EXAM];

const L = {
  backLabel: { th: "← EN-KMITL", en: "← EN-KMITL" },
  title: { th: "Computer Programming", en: "Computer Programming" },
  subtitle: {
    th: "01006012 Computer Programming — เตรียมสอบกลางภาค (บทที่ 1-5)",
    en: "01006012 Computer Programming — midterm prep (Chapters 1-5)",
  },
  summaryCardTitle: { th: "สรุปเนื้อหา", en: "Summary Notes" },
  summaryCardDesc: {
    th: "สรุปครบทุกบท: พื้นฐานคอมพิวเตอร์, ตัวแปร/นิพจน์, เงื่อนไข, while, for, และภาคผนวก",
    en: "Full chapter recap: computer basics, variables, conditionals, while, for, plus appendix",
  },
  quizCardTitle: { th: "แบบทดสอบ", en: "Interactive Quiz" },
  quizCardDesc: {
    th: "ทดสอบความเข้าใจจุดที่ข้อสอบชอบออก รวมข้อสอบจำลอง 60 ข้อ",
    en: "Test yourself on exam traps, including all 60 mock exam questions",
  },
  libraryCardTitle: { th: "คลังทรัพยากร", en: "Resource Library" },
  libraryCardDesc: {
    th: "เอกสาร สรุปเนื้อหารายบท และแหล่งอ้างอิงเพิ่มเติม",
    en: "Chapter-by-chapter documents, reference sheets, and study materials",
  },
  overviewTitle: { th: "ภาพรวมเนื้อหา", en: "Content Overview" },
};

export default function ComProPage() {
  return (
    <>
      <Navbar />
      <SubjectHub
        baseHref="/en-kmitl/compro"
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
        chapters={EN_KMITL_CHAPTERS}
        questions={ALL_COMPRO_QUESTIONS}
      />
    </>
  );
}
