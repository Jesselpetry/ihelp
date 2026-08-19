import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { EnKmitlSelectionHub } from "@/components/en-kmitl-selection-hub";

export const metadata: Metadata = {
  title: "EN-KMITL · iHelp",
  description:
    "เลือกวิชาที่ต้องการเตรียมสอบ: Computer Programming หรือ เคมีทั่วไป — สรุปเนื้อหา แบบทดสอบ และคลังทรัพยากร",
};

export default function EnKmitlPage() {
  return (
    <>
      <Navbar />
      <EnKmitlSelectionHub />
    </>
  );
}
