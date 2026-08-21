import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { SubjectSummaryReader } from "@/components/subject-summary-reader";
import { loadMfit } from "@/lib/it-kmitl";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "สรุป MFIT Midterm · IT-KMITL · iHelp",
  description:
    "สรุปเนื้อหา 06016401 Mathematics for Information Technology Week 1-7 — เมทริกซ์, determinant, ระบบสมการเชิงเส้น, เวกเตอร์, ปริภูมิเวกเตอร์, การแปลงเชิงเส้น, eigenvalue",
};

const L = {
  backLabel: { th: "MFIT", en: "MFIT" },
  quizLabel: { th: "ทำแบบทดสอบ", en: "Take the quiz" },
};

export default function MfitSummaryPage() {
  const data = loadMfit();
  if (!data.summaryMd) notFound();
  return (
    <>
      <Navbar />
      <SubjectSummaryReader
        markdown={data.summaryMd}
        backHref="/it-kmitl/mfit"
        backLabel={L.backLabel}
        quizHref="/it-kmitl/mfit/quiz"
        quizLabel={L.quizLabel}
      />
    </>
  );
}
