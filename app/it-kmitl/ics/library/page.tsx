import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { SubjectLibrary } from "@/components/subject-library";
import { ICS_ASSETS } from "@/lib/subject-library";

export const metadata: Metadata = {
  title: "คลังทรัพยากร ICS · IT-KMITL · iHelp",
  description:
    "คลังเอกสารวิชา ICS / Digital Logic — สรุปเนื้อหา ข้อสอบชุดฝึกพร้อมเฉลย บทวิเคราะห์ข้อสอบ และข้อสอบจริง 1/2564 ฉบับสแกน",
};

const L = {
  backLabel: { th: "ICS / Digital Logic", en: "ICS / Digital Logic" },
  title: { th: "คลังทรัพยากร · ICS", en: "Resource Library · ICS" },
  subtitle: {
    th: "เอกสาร ข้อสอบเก่า และสรุปเนื้อหาสำหรับ ICS / Digital Logic",
    en: "Documents, past papers, and study materials for ICS / Digital Logic",
  },
};

export default function IcsLibraryPage() {
  return (
    <>
      <Navbar />
      <SubjectLibrary
        assets={ICS_ASSETS}
        backHref="/it-kmitl/ics"
        backLabel={L.backLabel}
        title={L.title}
        subtitle={L.subtitle}
      />
    </>
  );
}
