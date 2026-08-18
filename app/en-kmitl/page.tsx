import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { EnKmitlHub } from "@/components/en-kmitl-hub";
import { loadEnKmitl } from "@/lib/en-kmitl";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "EN-KMITL Computer Programming · iHelp",
  description: "สรุปเนื้อหาและแบบทดสอบสำหรับสอบกลางภาค 01006012 Computer Programming (EN-KMITL).",
};

export default function EnKmitlPage() {
  const data = loadEnKmitl();
  if (!data.summaryMd) notFound();
  return (
    <>
      <Navbar />
      <EnKmitlHub hasMockExam={Boolean(data.mockExamMd)} />
    </>
  );
}
