import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { GradesHub } from "@/components/grades/grades-hub";
import { SITE, absoluteUrl } from "@/lib/site";

const TITLE = `ผลการเรียนและคะแนนสะสม Y1·S1 · ${SITE.shortName}`;
const DESCRIPTION =
  "ศูนย์รวมผลการเรียน คะแนนสะสมที่ประกาศแล้ว สัดส่วนคะแนนรายวิชา และคำนวณ GPA ทั้ง 7 วิชา IT KMITL ชั้นปีที่ 1 ภาคเรียนที่ 1";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/grades" },
  openGraph: {
    type: "website",
    url: absoluteUrl("/grades"),
    title: TITLE,
    description: DESCRIPTION,
    images: [
      {
        url: SITE.og.courses,
        width: SITE.og.width,
        height: SITE.og.height,
        alt: TITLE,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [SITE.og.courses],
  },
};

export default function GradesPage() {
  return (
    <>
      <Navbar />
      <GradesHub />
    </>
  );
}

