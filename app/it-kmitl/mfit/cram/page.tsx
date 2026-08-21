import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { SubjectSummaryReader } from "@/components/subject-summary-reader";
import { loadMfit } from "@/lib/it-kmitl";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "สรุปเร่งด่วน MFIT (เรียงตามข้อสอบ 1-10) · IT-KMITL · iHelp",
  description:
    "สรุปเร่งด่วนเรียงตามโครงข้อสอบจริง ข้อ 1-10 — สูตร ขั้นตอน ตารางกับดัก และวิธีเช็กคำตอบในตัว พร้อม checklist 60 วินาทีก่อนเข้าห้องสอบ",
};

const L = {
  backLabel: { th: "MFIT", en: "MFIT" },
  quizLabel: { th: "ทำแบบทดสอบ", en: "Take the quiz" },
};

export default function MfitCramPage() {
  const data = loadMfit();
  if (!data.cramMd) notFound();
  return (
    <>
      <Navbar />
      <SubjectSummaryReader
        markdown={data.cramMd}
        backHref="/it-kmitl/mfit"
        backLabel={L.backLabel}
        quizHref="/it-kmitl/mfit/quiz"
        quizLabel={L.quizLabel}
      />
    </>
  );
}
