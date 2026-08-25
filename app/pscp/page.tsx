import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { PscpModules } from "@/components/pscp-modules";
import { ProblemsView } from "@/components/problems-view";
import { loadProblems } from "@/lib/master";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "PSCP · การแก้ปัญหาและการโปรแกรมคอมพิวเตอร์",
  description:
    "คลังโจทย์ PSCP 06066303 IT KMITL — รายการโจทย์ iJudge พร้อมกำหนดส่ง โจทย์แนะนำพร้อมเฉลย ตัวช่วยสร้าง submission.md และ ai_reflection.md",
  alternates: { canonical: "/pscp" },
};

export default function PscpPage() {
  return (
    <>
      <Navbar />
      <PscpModules />
      <ProblemsView problems={loadProblems()} />
    </>
  );
}
