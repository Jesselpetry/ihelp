import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { GradeCalculator } from "@/components/exams/grade-calculator";
import { SITE, absoluteUrl } from "@/lib/site";

const TITLE = `ระบบคำนวณคะแนน & ตัดเกรด IT KMITL · ${SITE.name}`;
const DESCRIPTION =
  "คำนวณคะแนนสอบและเกรดเฉลี่ยสะสมรายวิชา ปี 1 เทอม 1 คณะเทคโนโลยีสารสนเทศ สจล. พร้อมระบบคำนวณเป้าหมายคะแนน Final และนำเข้าข้อมูลจาก Excel";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/grade-calculator" },
  openGraph: {
    type: "website",
    url: absoluteUrl("/grade-calculator"),
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function GradeCalculatorPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl px-3 py-6 sm:px-6">
        <GradeCalculator />
      </main>
    </>
  );
}
