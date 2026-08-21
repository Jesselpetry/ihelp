import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { SubjectSummaryReader } from "@/components/subject-summary-reader";
import { loadMfit } from "@/lib/it-kmitl";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "ชุดซ้อมด่วน MFIT + เฉลย · IT-KMITL · iHelp",
  description:
    "ชุดซ้อมจับเวลา: ปรนัย 20 ข้อ (15 นาที) และข้อคำนวณ 5 ข้อที่แมปตรงกับข้อสอบจริงทั้ง 10 ช่อง พร้อมเฉลย step-by-step",
};

const L = {
  backLabel: { th: "MFIT", en: "MFIT" },
  quizLabel: { th: "ทำแบบทดสอบ", en: "Take the quiz" },
};

export default function MfitMockPage() {
  const data = loadMfit();
  if (!data.mockExamMd) notFound();
  return (
    <>
      <Navbar />
      <SubjectSummaryReader
        markdown={data.mockExamMd}
        backHref="/it-kmitl/mfit"
        backLabel={L.backLabel}
        quizHref="/it-kmitl/mfit/quiz"
        quizLabel={L.quizLabel}
      />
    </>
  );
}
