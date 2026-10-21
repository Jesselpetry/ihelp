import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { Lock, CalendarDays } from "lucide-react";
import Link from "next/link";

import { FileLinkCard } from "@/components/media/file-link-card";
import { Navbar } from "@/components/navbar";
import { findCourseByCode } from "@/lib/courses/catalog";
import { listExamsForInsider } from "@/lib/library/exams";
import { ForbiddenError, UnauthorizedError } from "@/lib/auth/guards";

export const metadata: Metadata = {
  title: "คลังข้อสอบเก่า",
  robots: { index: false, follow: false },
};

// Signed URLs expire, so this page must never be cached.
export const dynamic = "force-dynamic";

const SCOPE_LABELS = { midterm: "กลางภาค", final: "ปลายภาค" } as const;

export default async function ExamsPage() {
  let items;
  try {
    items = await listExamsForInsider();
  } catch (error) {
    if (error instanceof UnauthorizedError) redirect("/onboarding");
    if (error instanceof ForbiddenError) {
      return (
        <>
          <Navbar />
          <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-4 px-4 py-20 text-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <Lock className="size-7" />
            </div>
            <h1 className="text-xl font-semibold">คลังนี้เปิดเฉพาะทีมงาน</h1>
            <p className="text-sm leading-relaxed text-muted-foreground text-pretty">
              ข้อสอบเก่าเป็นเนื้อหาที่จำกัดการเข้าถึง
              หากคุณควรมีสิทธิ์เข้าถึง กรุณาติดต่อผู้ดูแลระบบ
            </p>
            <Link
              href="/exam-schedule"
              className="mt-2 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-xs font-semibold text-primary hover:bg-primary/20 transition-colors"
            >
              <CalendarDays className="size-4" />
              <span>ค้นหาตารางสอบ & ผังที่นั่งสอบรายบุคคล</span>
            </Link>
          </main>
        </>
      );
    }
    throw error;
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <header className="mb-8 space-y-2">
          <h1 className="text-2xl font-semibold">คลังข้อสอบเก่า</h1>
          <p className="text-sm leading-relaxed text-muted-foreground text-pretty">
            ลิงก์แต่ละไฟล์มีอายุ 10 นาที และผูกกับบัญชีของคุณ กรุณาอย่าแชร์ต่อ
          </p>
        </header>

        {items.length === 0 ? (
          <p className="rounded-lg border border-dashed px-4 py-10 text-center text-sm text-muted-foreground">
            ยังไม่มีข้อสอบในคลัง
          </p>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2">
            {items.map((item) => {
              const course = findCourseByCode(item.subjectCode);
              return (
                <li key={item.id}>
                  <FileLinkCard
                    kind="restricted"
                    href={item.signedUrl}
                    title={item.title}
                    code={course?.code ?? item.subjectCode}
                    labels={[SCOPE_LABELS[item.scope]]}
                    note={item.examYear}
                  />
                </li>
              );
            })}
          </ul>
        )}
      </main>
    </>
  );
}
