import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { ItKmitlSelectionHub } from "@/components/it-kmitl-selection-hub";

export const metadata: Metadata = {
  title: "IT-KMITL · iHelp",
  description:
    "เลือกวิชาที่ต้องการเตรียมสอบของคณะ IT KMITL — สรุปเนื้อหา แบบทดสอบ ข้อสอบชุดฝึก และคลังทรัพยากร",
};

export default function ItKmitlPage() {
  return (
    <>
      <Navbar />
      <ItKmitlSelectionHub />
    </>
  );
}
