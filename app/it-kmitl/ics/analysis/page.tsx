import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { SubjectSummaryReader } from "@/components/subject-summary-reader";
import { loadIcs } from "@/lib/it-kmitl";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "วิเคราะห์ข้อสอบ ICS · IT-KMITL · iHelp",
  description:
    "ถอดพิมพ์เขียวข้อสอบมิดเทอม ICS 1/2564 — ตารางคะแนนรายข้อ, Bloom's Taxonomy, Question Archetypes, 11 กับดัก และแผนจัดสรรเวลาในห้องสอบ",
};

const L = {
  backLabel: { th: "ICS / Digital Logic", en: "ICS / Digital Logic" },
  quizLabel: { th: "ทำแบบทดสอบ", en: "Take the quiz" },
};

export default function IcsAnalysisPage() {
  const data = loadIcs();
  if (!data.analysisMd) notFound();
  return (
    <>
      <Navbar />
      <SubjectSummaryReader
        markdown={data.analysisMd}
        backHref="/it-kmitl/ics"
        backLabel={L.backLabel}
        quizHref="/it-kmitl/ics/quiz"
        quizLabel={L.quizLabel}
      />
    </>
  );
}
