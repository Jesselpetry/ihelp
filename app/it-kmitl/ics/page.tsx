import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { SubjectHub, type SubjectExtraCard } from "@/components/subject-hub";
import { ICS_CHAPTERS, ICS_QUIZ } from "@/lib/ics-quiz";

export const metadata: Metadata = {
  title: "ICS / Digital Logic · IT-KMITL · iHelp",
  description:
    "สรุปเนื้อหา แบบทดสอบ ข้อสอบชุดฝึกพร้อมเฉลย และคลังทรัพยากรสำหรับวิชา ICS / Digital Logic (IT-KMITL) — เลขฐาน, พีชคณิตบูลีน, K-Map, Timing, ออกแบบวงจร, MUX",
};

const L = {
  backLabel: { th: "← IT-KMITL", en: "← IT-KMITL" },
  title: { th: "ICS / Digital Logic", en: "ICS / Digital Logic" },
  subtitle: {
    th: "เตรียมสอบกลางภาค · บทที่ 1-6 (120 คะแนน + เสริม 10)",
    en: "Midterm prep · Chapters 1-6 (120 marks + 10 bonus)",
  },
  summaryCardTitle: { th: "สรุปเนื้อหา", en: "Summary Notes" },
  summaryCardDesc: {
    th: "ครบทุกบท: เลขฐาน, บูลีน/เกต, K-Map, Timing, ออกแบบวงจร 7-Segment, MUX พร้อม 19 กับดักที่เสียคะแนนบ่อย",
    en: "All chapters: number systems, Boolean algebra & gates, K-maps, timing, 7-segment design, MUX — plus 19 common pitfalls",
  },
  quizCardTitle: { th: "แบบทดสอบ", en: "Interactive Quiz" },
  quizCardDesc: {
    th: "50 ข้อ ครอบคลุมทั้ง 6 บท พร้อมคำอธิบายว่าทำไมตัวเลือกอื่นถึงผิด",
    en: "50 questions across all 6 chapters, each explaining why the other options fail",
  },
  libraryCardTitle: { th: "คลังทรัพยากร", en: "Resource Library" },
  libraryCardDesc: {
    th: "ข้อสอบชุดฝึกพร้อมเฉลยละเอียด, บทวิเคราะห์พิมพ์เขียวข้อสอบ และข้อสอบจริง 1/2564 ฉบับสแกน",
    en: "Practice exam with full answer key, blueprint analysis, and the scanned 1/2564 past paper",
  },
  overviewTitle: { th: "ภาพรวมเนื้อหา", en: "Content Overview" },
  footerNote: {
    th: "ข้อสอบเป็นอัตนัยทั้งฉบับ — ต้องแสดงวิธีทำทุกข้อ คะแนนกระจุกที่พีชคณิตบูลีน + K-Map + ออกแบบวงจร รวม 90 จาก 120 คะแนน (75%)",
    en: "The exam is entirely constructed-response — always show your work. Boolean algebra + K-maps + circuit design carry 90 of the 120 marks (75%).",
  },
};

const EXTRA_CARDS: SubjectExtraCard[] = [
  {
    slug: "exam",
    icon: "file-check",
    title: { th: "ข้อสอบชุดฝึก + เฉลย", en: "Practice Exam + Key" },
    desc: {
      th: "ข้อสอบอัตนัย 6 ข้อ ตามพิมพ์เขียวข้อสอบจริง พร้อมเฉลยแสดงวิธีทำทีละขั้น",
      en: "Six constructed-response questions on the real blueprint, with step-by-step worked solutions",
    },
  },
  {
    slug: "analysis",
    icon: "microscope",
    title: { th: "วิเคราะห์ข้อสอบ", en: "Exam Analysis" },
    desc: {
      th: "ถอดโครงข้อสอบ 1/2564: น้ำหนักคะแนน, กับดักที่พบบ่อย และแผนจัดสรรเวลา 3 ชั่วโมง",
      en: "Reverse-engineering the 1/2564 paper: mark weights, recurring traps, and a 3-hour time budget",
    },
  },
];

export default function IcsPage() {
  return (
    <>
      <Navbar />
      <SubjectHub
        baseHref="/it-kmitl/ics"
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
        chapters={ICS_CHAPTERS}
        questions={ICS_QUIZ}
        footerNote={L.footerNote}
        extraCards={EXTRA_CARDS}
      />
    </>
  );
}
