import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { Archive, ArrowLeft } from "lucide-react";
import { db, users } from "@/db";
import { Navbar } from "@/components/navbar";
import {
  ExamScheduleView,
  type ExamStudentIdentity,
} from "@/components/exams/exam-schedule-view";
import { currentStudentId } from "@/lib/auth/guards";
import { SITE, absoluteUrl } from "@/lib/site";

const TITLE = `ตารางสอบย้อนหลัง (1/2569) IT KMITL · ${SITE.name}`;
const DESCRIPTION =
  "คลังข้อมูลย้อนหลังตารางสอบปลายภาคและผังที่นั่งสอบ คณะเทคโนโลยีสารสนเทศ สจล. ประจำภาคเรียนที่ 1/2569";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/exam-schedule/archive" },
  robots: { index: false, follow: true },
  openGraph: {
    type: "website",
    url: absoluteUrl("/exam-schedule/archive"),
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

export default async function ArchivedExamSchedulePage() {
  const reqHeaders = await headers();
  const cacheControl = reqHeaders.get("cache-control") || "";
  const pragma = reqHeaders.get("pragma") || "";
  const isHardReload =
    cacheControl.includes("no-cache") || pragma.includes("no-cache");

  const viewerId = await currentStudentId();
  const identitiesById: Record<string, ExamStudentIdentity> = {};
  if (viewerId) {
    try {
      const rows = await db
        .select({
          studentId: users.studentId,
          firstName: users.firstName,
          lastName: users.lastName,
          nickname: users.nickname,
        })
        .from(users);
      for (const u of rows) {
        const fullName =
          [u.firstName, u.lastName].filter(Boolean).join(" ").trim() || null;
        const nickname = u.nickname?.trim() || null;
        if (fullName || nickname) {
          identitiesById[u.studentId] = { fullName, nickname };
        }
      }
    } catch {
      // Optional DB enrichment; page works cleanly from static exam index.
    }
  }

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto w-full max-w-4xl px-3 pt-5 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-border/60 bg-muted/40 px-4 py-2.5 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <Archive className="size-3.5 shrink-0 text-primary" />
              <span>
                คลังข้อมูลย้อนหลัง · ตารางสอบประจำภาคเรียนที่ 1/2569 (Archived)
              </span>
            </div>
            <Link
              href="/grades"
              className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
            >
              <ArrowLeft className="size-3.5" />
              <span>กลับไปหน้าผลการเรียน</span>
            </Link>
          </div>
        </div>

        <Suspense
          fallback={
            <div className="mx-auto flex h-64 max-w-5xl items-center justify-center">
              <div className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          }
        >
          <ExamScheduleView
            isHardReload={isHardReload}
            identitiesById={identitiesById}
            basePath="/exam-schedule/archive"
          />
        </Suspense>
      </main>
    </>
  );
}

