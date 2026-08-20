import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { SubjectSummaryReader } from "@/components/subject-summary-reader";
import { loadIcs } from "@/lib/it-kmitl";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "ข้อสอบชุดฝึก ICS + เฉลย · IT-KMITL · iHelp",
  description:
    "ข้อสอบมิดเทอม ICS / Digital Logic ชุดฝึก 6 ข้อ 120 คะแนน (+ เสริม 10) พร้อมเฉลยแสดงวิธีทำทีละขั้นและจุดที่คนมักผิด",
};

const L = {
  backLabel: { th: "ICS / Digital Logic", en: "ICS / Digital Logic" },
  quizLabel: { th: "ทำแบบทดสอบ", en: "Take the quiz" },
};

export default function IcsExamPage() {
  const data = loadIcs();
  if (!data.examMd) notFound();
  return (
    <>
      <Navbar />
      <SubjectSummaryReader
        markdown={data.examMd}
        backHref="/it-kmitl/ics"
        backLabel={L.backLabel}
        quizHref="/it-kmitl/ics/quiz"
        quizLabel={L.quizLabel}
      />
    </>
  );
}
