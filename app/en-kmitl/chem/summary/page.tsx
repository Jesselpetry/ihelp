import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { SubjectSummaryReader } from "@/components/subject-summary-reader";
import { loadChem } from "@/lib/en-kmitl";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "สรุปเคมี Midterm · Chem · EN-KMITL · iHelp",
  description:
    "สรุปเนื้อหาเคมีทั่วไป บทที่ 1-5 สำหรับเตรียมสอบกลางภาค — โครงสร้างอะตอม พันธะเคมี สโตอิชิโอเมตรี สารละลาย สมดุลเคมี",
};

const L = {
  backLabel: { th: "เคมีทั่วไป", en: "General Chemistry" },
  quizLabel: { th: "ทำแบบทดสอบ", en: "Take the quiz" },
};

export default function ChemSummaryPage() {
  const data = loadChem();
  if (!data.summaryMd) notFound();
  return (
    <>
      <Navbar />
      <SubjectSummaryReader
        markdown={data.summaryMd}
        backHref="/en-kmitl/chem"
        backLabel={L.backLabel}
        quizHref="/en-kmitl/chem/quiz"
        quizLabel={L.quizLabel}
      />
    </>
  );
}
