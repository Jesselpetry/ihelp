import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { CeKmitlHub } from "@/components/ce-kmitl-hub";
import { loadCeKmitl } from "@/lib/ce-kmitl";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "CE-KMITL Computer Programming · iHelp",
  description: "สรุปเนื้อหาและแบบทดสอบสำหรับสอบกลางภาค 01006012 Computer Programming (CE-KMITL).",
};

export default function CeKmitlPage() {
  const data = loadCeKmitl();
  if (!data.summaryMd) notFound();
  return (
    <>
      <Navbar />
      <CeKmitlHub hasMockExam={Boolean(data.mockExamMd)} />
    </>
  );
}
