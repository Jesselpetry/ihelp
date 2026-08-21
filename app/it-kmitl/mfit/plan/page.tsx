import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { SubjectSummaryReader } from "@/components/subject-summary-reader";
import { loadMfit } from "@/lib/it-kmitl";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "แผนอ่าน 6 ชั่วโมงก่อนสอบ MFIT · IT-KMITL · iHelp",
  description:
    "แผนติวแบบ 6 บล็อก 05:00-11:15 เรียงตามน้ำหนักจริง พร้อมกลยุทธ์ลำดับทำข้อสอบในห้อง และแผนสำรองเมื่อเหลือเวลา 4 / 2 / 1 ชั่วโมง",
};

const L = {
  backLabel: { th: "MFIT", en: "MFIT" },
  quizLabel: { th: "ทำแบบทดสอบ", en: "Take the quiz" },
};

export default function MfitPlanPage() {
  const data = loadMfit();
  if (!data.learningPathMd) notFound();
  return (
    <>
      <Navbar />
      <SubjectSummaryReader
        markdown={data.learningPathMd}
        backHref="/it-kmitl/mfit"
        backLabel={L.backLabel}
        quizHref="/it-kmitl/mfit/quiz"
        quizLabel={L.quizLabel}
      />
    </>
  );
}
