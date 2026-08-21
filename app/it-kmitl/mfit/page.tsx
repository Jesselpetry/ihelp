import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { SubjectHub, type SubjectExtraCard } from "@/components/subject-hub";
import { MFIT_BLUEPRINT_QUIZ, MFIT_CHAPTERS, MFIT_QUIZ } from "@/lib/mfit-quiz";

export const metadata: Metadata = {
  title: "MFIT · IT-KMITL · iHelp",
  description:
    "สรุปเนื้อหา แบบทดสอบ ข้อสอบชุดจำลองพร้อมเฉลย และคลังทรัพยากรสำหรับ 06016401 Mathematics for Information Technology (IT-KMITL) — เมทริกซ์, determinant, ระบบสมการเชิงเส้น, เวกเตอร์, ปริภูมิเวกเตอร์, การแปลงเชิงเส้น, eigenvalue",
};

const ALL_MFIT_QUESTIONS = [...MFIT_QUIZ, ...MFIT_BLUEPRINT_QUIZ];

const L = {
  backLabel: { th: "← IT-KMITL", en: "← IT-KMITL" },
  title: { th: "MFIT — คณิตศาสตร์สำหรับ IT", en: "MFIT — Mathematics for IT" },
  subtitle: {
    th: "06016401 · เตรียมสอบกลางภาค · 10 ข้อ 180 นาที (พีชคณิตเชิงเส้น Week 1-7)",
    en: "06016401 · Midterm prep · 10 questions in 180 minutes (linear algebra, weeks 1-7)",
  },
  summaryCardTitle: { th: "สรุปเนื้อหา", en: "Summary Notes" },
  summaryCardDesc: {
    th: "ครบทั้ง 7 สัปดาห์: เมทริกซ์, determinant, ระบบสมการ, เวกเตอร์, ปริภูมิเวกเตอร์, การแปลงเชิงเส้น, eigenvalue พร้อม 12 กับดัก",
    en: "All seven weeks: matrices, determinants, linear systems, vectors, vector spaces, linear transformations, eigenvalues — plus 12 pitfalls",
  },
  quizCardTitle: { th: "แบบทดสอบ", en: "Interactive Quiz" },
  quizCardDesc: {
    th: "65 ข้อ รวมชุดซ้อมตามโครงข้อสอบจริง 20 ข้อ พร้อมคำอธิบายว่าทำไมตัวเลือกอื่นถึงผิด",
    en: "65 questions including the 20-item blueprint drill, each explaining why the other options fail",
  },
  libraryCardTitle: { th: "คลังทรัพยากร", en: "Resource Library" },
  libraryCardDesc: {
    th: "สไลด์เลกเชอร์ 7 สัปดาห์, In-Class Activity ทุกสัปดาห์ และข้อสอบชุดจำลองพร้อมเฉลย",
    en: "Seven weeks of lecture slides, every in-class activity, and the mock exam with its answer key",
  },
  overviewTitle: { th: "ภาพรวมเนื้อหา", en: "Content Overview" },
  chapterLabel: { th: "สัปดาห์ที่", en: "Week" },
  footerNote: {
    th: "โครงข้อสอบจากสไลด์ Q&A ของอาจารย์: 10 ข้อ · 180 นาที · ตอบเป็นตัวเลข · มีเครื่องคิดเลขให้ — ข้อ 10 (ค่าเจาะจง) ได้เวลามากสุด 20 นาที · blueprint นี้มาจากปีก่อน ถือเป็นความน่าจะเป็นสูง ไม่ใช่การรับประกัน",
    en: "Blueprint from the instructor's Q&A slides: 10 questions · 180 minutes · numeric answers · calculators provided. Question 10 (eigenvalues) gets the most time at 20 minutes. This is last year's blueprint — treat it as highly likely, not guaranteed.",
  },
};

const EXTRA_CARDS: SubjectExtraCard[] = [
  {
    slug: "cram",
    icon: "zap",
    title: { th: "สรุปเร่งด่วน (ตามข้อสอบ 1-10)", en: "Crash Summary (Q1-Q10)" },
    desc: {
      th: "เรียงตามโครงข้อสอบจริง ไม่ใช่ตามบท · สูตร → ขั้นตอน → ตารางกับดัก → วิธีเช็กคำตอบ",
      en: "Ordered by the real exam blueprint, not by chapter: formula → steps → trap table → self-check",
    },
  },
  {
    slug: "plan",
    icon: "calendar-clock",
    title: { th: "แผนอ่าน 6 ชั่วโมง", en: "6-Hour Study Plan" },
    desc: {
      th: "6 บล็อก เรียงตามน้ำหนักจริง · กลยุทธ์ลำดับทำข้อสอบในห้อง · แผนสำรองเมื่อเหลือ 4/2/1 ชม.",
      en: "Six blocks weighted by what actually counts, in-exam ordering strategy, and fallbacks for 4/2/1 hours left",
    },
  },
  {
    slug: "mock",
    icon: "timer",
    title: { th: "ชุดซ้อมด่วน + เฉลย", en: "Timed Drill + Key" },
    desc: {
      th: "ปรนัย 20 ข้อ 15 นาที + ข้อคำนวณ 5 ข้อที่แมปตรงกับข้อสอบจริงทั้ง 10 ช่อง",
      en: "20 MCQ in 15 minutes plus 5 calculation problems mapped onto all 10 real exam slots",
    },
  },
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
        questions={ALL_MFIT_QUESTIONS}
        footerNote={L.footerNote}
        extraCards={EXTRA_CARDS}
      />
    </>
  );
}
