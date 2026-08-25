import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { SubjectSummaryReader } from "@/components/subject-summary-reader";
import { resolveCourse, courseDir, COURSES } from "@/lib/catalog";
import { loadMfit } from "@/lib/it-kmitl";

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
    title: `ชุดซ้อมด่วน ${course.code} + เฉลย · IT-KMITL`,
    description: `ชุดซ้อมจับเวลา: ปรนัย 20 ข้อ (15 นาที) และข้อคำนวณ 5 ข้อที่แมปตรงกับข้อสอบจริงทั้ง 10 ช่อง สำหรับวิชา ${course.code}`,
    alternates: { canonical: `/courses/${courseDir(course)}/mock` },
  };
}

export default async function CourseMockPage({
  params,
}: {
  params: Promise<{ dir: string }>;
}) {
  const { dir } = await params;
  const course = resolveCourse(dir);
  if (!course || course.code !== "MFIT") notFound();

  const cDir = courseDir(course);
  const backHref = `/courses/${cDir}`;
  const backLabel = { th: course.nameTh, en: course.nameEn };
  const quizHref = course.tracks.quiz ?? backHref;
  const quizLabel = { th: "ทำแบบทดสอบ", en: "Take the quiz" };

  const data = loadMfit();
  if (!data.mockExamMd) notFound();

  return (
    <>
      <Navbar />
      <SubjectSummaryReader
        markdown={data.mockExamMd}
        backHref={backHref}
        backLabel={backLabel}
        quizHref={quizHref}
        quizLabel={quizLabel}
      />
    </>
  );
}
