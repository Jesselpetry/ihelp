import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { SubjectSummaryReader } from "@/components/subject-summary-reader";
import { loadEnKmitl } from "@/lib/en-kmitl";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "สรุปคอมโปร Midterm · ComPro · EN-KMITL · iHelp",
  description:
    "สรุปเนื้อหา 01006012 Computer Programming บทที่ 1-5 สำหรับเตรียมสอบกลางภาค.",
};

const L = {
  backLabel: { th: "Computer Programming", en: "Computer Programming" },
  quizLabel: { th: "ทำแบบทดสอบ", en: "Take the quiz" },
};

export default function ComProSummaryPage() {
  const data = loadEnKmitl();
  if (!data.summaryMd) notFound();
  return (
    <>
      <Navbar />
      <SubjectSummaryReader
        markdown={data.summaryMd}
        backHref="/en-kmitl/compro"
        backLabel={L.backLabel}
        quizHref="/en-kmitl/compro/quiz"
        quizLabel={L.quizLabel}
      />
    </>
  );
}
