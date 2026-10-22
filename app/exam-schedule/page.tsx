import { Suspense } from "react";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { Navbar } from "@/components/navbar";
import { ExamScheduleView } from "@/components/exams/exam-schedule-view";
import { SITE, absoluteUrl } from "@/lib/site";

const TITLE = `ตารางสอบ & ผังที่นั่งสอบ IT KMITL · ${SITE.name}`;
const DESCRIPTION =
  "ตรวจสอบตารางสอบปลายภาคและผังที่นั่งสอบรายบุคคล คณะเทคโนโลยีสารสนเทศ สจล. ด้วยรหัสนักศึกษา พร้อมแจ้งเตือนผ่านปฏิทิน";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/exam-schedule" },
  openGraph: {
    type: "website",
    url: absoluteUrl("/exam-schedule"),
    title: TITLE,
    description: DESCRIPTION,
    images: [
      {
        url: SITE.og.examSchedule,
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
    images: [SITE.og.examSchedule],
  },
};

export default async function ExamSchedulePage() {
  const reqHeaders = await headers();
  const cacheControl = reqHeaders.get("cache-control") || "";
  const pragma = reqHeaders.get("pragma") || "";
  const isHardReload =
    cacheControl.includes("no-cache") || pragma.includes("no-cache");

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Suspense
          fallback={
            <div className="mx-auto flex h-64 max-w-5xl items-center justify-center">
              <div className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          }
        >
          <ExamScheduleView isHardReload={isHardReload} />
        </Suspense>
      </main>
    </>
  );
}
