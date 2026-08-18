import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { CeKmitlSummaryReader } from "@/components/ce-kmitl-summary-reader";
import { loadCeKmitl } from "@/lib/ce-kmitl";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "สรุปคอมโปร Midterm · CE-KMITL · iHelp",
  description: "สรุปเนื้อหา 01006012 Computer Programming บทที่ 1-5 สำหรับเตรียมสอบกลางภาค.",
};

export default function CeKmitlSummaryPage() {
  const data = loadCeKmitl();
  if (!data.summaryMd) notFound();
  return (
    <>
      <Navbar />
      <CeKmitlSummaryReader markdown={data.summaryMd} />
    </>
  );
}
