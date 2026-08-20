import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { SubjectSummaryReader } from "@/components/subject-summary-reader";
import { loadIcs } from "@/lib/it-kmitl";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "สรุป ICS Midterm · IT-KMITL · iHelp",
  description:
    "สรุปเนื้อหา ICS / Digital Logic บทที่ 1-6 สำหรับเตรียมสอบกลางภาค — ระบบเลขฐาน พีชคณิตบูลีน K-Map Timing ออกแบบวงจร และ MUX",
};

const L = {
  backLabel: { th: "ICS / Digital Logic", en: "ICS / Digital Logic" },
  quizLabel: { th: "ทำแบบทดสอบ", en: "Take the quiz" },
};

export default function IcsSummaryPage() {
  const data = loadIcs();
  if (!data.summaryMd) notFound();
  return (
    <>
      <Navbar />
      <SubjectSummaryReader
        markdown={data.summaryMd}
        backHref="/it-kmitl/ics"
        backLabel={L.backLabel}
        quizHref="/it-kmitl/ics/quiz"
        quizLabel={L.quizLabel}
      />
    </>
  );
}
