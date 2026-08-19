import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { SubjectLibrary } from "@/components/subject-library";
import { COMPRO_ASSETS } from "@/lib/subject-library";

export const metadata: Metadata = {
  title: "คลังทรัพยากร ComPro · EN-KMITL · iHelp",
  description:
    "คลังเอกสาร สรุปเนื้อหารายบท และแหล่งอ้างอิงสำหรับ 01006012 Computer Programming",
};

const L = {
  backLabel: { th: "Computer Programming", en: "Computer Programming" },
  title: { th: "คลังทรัพยากร · ComPro", en: "Resource Library · ComPro" },
  subtitle: {
    th: "เอกสารและสรุปเนื้อหา Computer Programming",
    en: "Documents and study materials for Computer Programming",
  },
};

export default function ComProLibraryPage() {
  return (
    <>
      <Navbar />
      <SubjectLibrary
        assets={COMPRO_ASSETS}
        backHref="/en-kmitl/compro"
        backLabel={L.backLabel}
        title={L.title}
        subtitle={L.subtitle}
      />
    </>
  );
}
