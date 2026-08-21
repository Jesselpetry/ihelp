import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { SubjectLibrary } from "@/components/subject-library";
import { MFIT_ASSETS } from "@/lib/subject-library";

export const metadata: Metadata = {
  title: "คลังทรัพยากร MFIT · IT-KMITL · iHelp",
  description:
    "คลังเอกสารวิชา 06016401 Mathematics for Information Technology — สไลด์เลกเชอร์ Week 1-7, In-Class Activity และข้อสอบชุดจำลองพร้อมเฉลย",
};

const L = {
  backLabel: { th: "MFIT", en: "MFIT" },
  title: { th: "คลังทรัพยากร · MFIT", en: "Resource Library · MFIT" },
  subtitle: {
    th: "สไลด์เลกเชอร์ โจทย์ในชั้นเรียน และสรุปเนื้อหาสำหรับ MFIT",
    en: "Lecture slides, in-class problems, and study materials for MFIT",
  },
};

export default function MfitLibraryPage() {
  return (
    <>
      <Navbar />
      <SubjectLibrary
        assets={MFIT_ASSETS}
        backHref="/it-kmitl/mfit"
        backLabel={L.backLabel}
        title={L.title}
        subtitle={L.subtitle}
      />
    </>
  );
}
