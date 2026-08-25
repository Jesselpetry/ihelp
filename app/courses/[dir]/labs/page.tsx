import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { ComProLabHub } from "@/components/compro-lab-hub";
import { COURSES, courseDir, resolveCourse } from "@/lib/catalog";
import { COMPRO_META, COMPRO_PROBLEMS } from "@/lib/compro-labs";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const dirs = COURSES.map((c) => ({ dir: courseDir(c) }));
  const codes = COURSES.map((c) => ({ dir: c.code.toLowerCase() }));
  return [...dirs, ...codes];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ dir: string }>;
}): Promise<Metadata> {
  const { dir } = await params;
  const course = resolveCourse(dir);
  if (!course) return { title: "ไม่พบรายวิชา" };
  return {
    title: `ฝึกเขียนโปรแกรม Python ${course.code} — Lab สัปดาห์ 1-5 · EN-KMITL`,
    description:
      `ฝึกทำโจทย์ Lab Python วิชา ${course.officialCode ?? ""} ${course.nameTh} ` +
      `${COMPRO_PROBLEMS.length} ข้อ ${COMPRO_META.caseCount} เคสทดสอบ ` +
      `พร้อมบทเรียนภาษาไทยแบบทีละขั้น และคอมไพเลอร์ Python ในเบราว์เซอร์`,
    alternates: { canonical: `/courses/${courseDir(course)}/labs` },
  };
}

export default async function CourseLabsPage({
  params,
}: {
  params: Promise<{ dir: string }>;
}) {
  const { dir } = await params;
  const course = resolveCourse(dir);
  // The lab bank is ComPro-specific: the problems, the exact-output rules and
  // every walkthrough are written against that portal's chapters 1-5.
  if (!course || course.code !== "COMPRO") notFound();

  const backHref = `/courses/${courseDir(course)}`;

  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-6xl px-3 sm:px-6 py-5 sm:py-8">
        <div className="mb-4 flex items-center justify-between text-xs sm:text-sm">
          <Link
            href={backHref}
            className="inline-flex items-center gap-1.5 font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="size-3.5 sm:size-4" />
            {course.nameTh}
          </Link>
        </div>

        <header className="mb-5">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            ฝึกเขียน Python ทีละขั้น — Lab สัปดาห์ 1–5
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
            {course.officialCode} {course.nameTh} · เขียนโค้ด กดตรวจ เห็นผลทันทีในเบราว์เซอร์
            ไม่ต้องติดตั้ง Python
          </p>
        </header>

        <ComProLabHub />
      </main>
    </>
  );
}
