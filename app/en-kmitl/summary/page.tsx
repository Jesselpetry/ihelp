import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { EnKmitlSummaryReader } from "@/components/en-kmitl-summary-reader";
import { loadEnKmitl } from "@/lib/en-kmitl";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "สรุปคอมโปร Midterm · EN-KMITL · iHelp",
  description: "สรุปเนื้อหา 01006012 Computer Programming บทที่ 1-5 สำหรับเตรียมสอบกลางภาค.",
};

export default function EnKmitlSummaryPage() {
  const data = loadEnKmitl();
  if (!data.summaryMd) notFound();
  return (
    <>
      <Navbar />
      <EnKmitlSummaryReader markdown={data.summaryMd} />
    </>
  );
}
