import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { SubjectHub, type SubjectExtraCard } from "@/components/subject-hub";
import { MFIT_CHAPTERS, MFIT_QUIZ } from "@/lib/mfit-quiz";

export const metadata: Metadata = {
  title: "MFIT · IT-KMITL · iHelp",
  description:
    "สรุปเนื้อหา แบบทดสอบ ข้อสอบชุดจำลองพร้อมเฉลย และคลังทรัพยากรสำหรับ 06016401 Mathematics for Information Technology (IT-KMITL) — เมทริกซ์, determinant, ระบบสมการเชิงเส้น, เวกเตอร์, ปริภูมิเวกเตอร์, การแปลงเชิงเส้น, eigenvalue",
};

const L = {
  backLabel: { th: "← IT-KMITL", en: "← IT-KMITL" },
  title: { th: "MFIT — คณิตศาสตร์สำหรับ IT", en: "MFIT — Mathematics for IT" },
  subtitle: {
    th: "06016401 · เตรียมสอบกลางภาค · Week 1-7 (พีชคณิตเชิงเส้น)",
    en: "06016401 · Midterm prep · Weeks 1-7 (linear algebra)",
  },
  summaryCardTitle: { th: "สรุปเนื้อหา", en: "Summary Notes" },
  summaryCardDesc: {
    th: "ครบทั้ง 7 สัปดาห์: เมทริกซ์, determinant, ระบบสมการ, เวกเตอร์, ปริภูมิเวกเตอร์, การแปลงเชิงเส้น, eigenvalue พร้อม 12 กับดัก",
    en: "All seven weeks: matrices, determinants, linear systems, vectors, vector spaces, linear transformations, eigenvalues — plus 12 pitfalls",
  },
  quizCardTitle: { th: "แบบทดสอบ", en: "Interactive Quiz" },
  quizCardDesc: {
    th: "45 ข้อ ครอบคลุมทั้ง 7 สัปดาห์ พร้อมคำอธิบายว่าทำไมตัวเลือกอื่นถึงผิด",
    en: "45 questions across all seven weeks, each explaining why the other options fail",
  },
  libraryCardTitle: { th: "คลังทรัพยากร", en: "Resource Library" },
  libraryCardDesc: {
    th: "สไลด์เลกเชอร์ 7 สัปดาห์, In-Class Activity ทุกสัปดาห์ และข้อสอบชุดจำลองพร้อมเฉลย",
    en: "Seven weeks of lecture slides, every in-class activity, and the mock exam with its answer key",
  },
  overviewTitle: { th: "ภาพรวมเนื้อหา", en: "Content Overview" },
  chapterLabel: { th: "สัปดาห์ที่", en: "Week" },
  footerNote: {
    th: "สอบ 3 ชั่วโมง · น้ำหนัก 35% ของเกรดรวม · ขอบเขต Week 1-7 เท่านั้น (แคลคูลัสไปสอบปลายภาค) · Week 2 มีน้ำหนักสูงสุดที่ 20%",
    en: "Three-hour exam · 35% of the final grade · Weeks 1-7 only (calculus is deferred to the final) · Week 2 carries the heaviest weight at 20%",
  },
};

const EXTRA_CARDS: SubjectExtraCard[] = [
  {
    slug: "exam",
    icon: "file-check",
    title: { th: "ข้อสอบชุดจำลอง + เฉลย", en: "Mock Exam + Key" },
    desc: {
      th: "25 ข้อ 4 พาร์ต 100 คะแนน: ปรนัย เติมคำ อัตนัย และข้อวิเคราะห์ พร้อมเฉลยละเอียด",
      en: "25 questions, 4 parts, 100 marks: multiple choice, fill-in, show-your-work, and analysis, with full solutions",
    },
  },
];

export default function MfitPage() {
  return (
    <>
      <Navbar />
      <SubjectHub
        baseHref="/it-kmitl/mfit"
        backHref="/it-kmitl"
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
        chapters={MFIT_CHAPTERS}
        chapterLabel={L.chapterLabel}
        questions={MFIT_QUIZ}
        footerNote={L.footerNote}
        extraCards={EXTRA_CARDS}
      />
    </>
  );
}
