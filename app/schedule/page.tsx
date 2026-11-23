import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { ScheduleHub } from "@/components/schedule/schedule-hub";
import { SITE, absoluteUrl } from "@/lib/site";

const TITLE = "ตารางเรียน";
const DESCRIPTION =
  "ระบบจำลองและวางแผนตารางเรียนส่วนบุคคล เลือก Section จำลองการตื่นสาย เลี่ยงตื่นเช้า และตรวจการชนของคาบเรียนและวันสอบ IT KMITL ชั้นปีที่ 1 ภาคเรียนที่ 2";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/schedule" },
  openGraph: {
    type: "website",
    url: absoluteUrl("/schedule"),
    title: `${TITLE} · ${SITE.name}`,
    description: DESCRIPTION,
    images: [
      {
        url: SITE.og.courses,
        width: SITE.og.width,
        height: SITE.og.height,
        alt: `${TITLE} · ${SITE.name}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${TITLE} · ${SITE.name}`,
    description: DESCRIPTION,
    images: [SITE.og.courses],
  },
};

export default function SchedulePage() {
  return (
    <>
      <Navbar />
      <ScheduleHub />
    </>
  );
}
