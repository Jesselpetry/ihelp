import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { SubjectSummaryReader } from "@/components/subject-summary-reader";
import { loadMfit } from "@/lib/it-kmitl";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "ข้อสอบชุดจำลอง MFIT + เฉลย · IT-KMITL · iHelp",
  description:
    "ข้อสอบมิดเทอม MFIT ชุดจำลอง 25 ข้อ 100 คะแนน — ปรนัย เติมคำ อัตนัยแสดงวิธีทำ และข้อวิเคราะห์ พร้อมเฉลยละเอียดทุกข้อ",
};

const L = {
  backLabel: { th: "MFIT", en: "MFIT" },
  quizLabel: { th: "ทำแบบทดสอบ", en: "Take the quiz" },
};

export default function MfitExamPage() {
  const data = loadMfit();
  if (!data.examMd) notFound();
  return (
    <>
      <Navbar />
      <SubjectSummaryReader
        markdown={data.examMd}
        backHref="/it-kmitl/mfit"
        backLabel={L.backLabel}
        quizHref="/it-kmitl/mfit/quiz"
        quizLabel={L.quizLabel}
      />
    </>
  );
}
