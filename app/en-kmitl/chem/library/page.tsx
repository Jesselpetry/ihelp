import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { SubjectLibrary } from "@/components/subject-library";
import { CHEM_ASSETS } from "@/lib/subject-library";

export const metadata: Metadata = {
  title: "คลังทรัพยากร Chem · EN-KMITL · iHelp",
  description:
    "คลังเอกสาร สรุปเนื้อหารายบท และแหล่งอ้างอิงสำหรับวิชาเคมีทั่วไป (EN-KMITL)",
};

const L = {
  backLabel: { th: "เคมีทั่วไป", en: "General Chemistry" },
  title: { th: "คลังทรัพยากร · เคมีทั่วไป", en: "Resource Library · General Chemistry" },
  subtitle: {
    th: "เอกสารและสรุปเนื้อหาเคมีทั่วไป",
    en: "Documents and study materials for General Chemistry",
  },
};

export default function ChemLibraryPage() {
  return (
    <>
      <Navbar />
      <SubjectLibrary
        assets={CHEM_ASSETS}
        backHref="/en-kmitl/chem"
        backLabel={L.backLabel}
        title={L.title}
        subtitle={L.subtitle}
      />
    </>
  );
}
