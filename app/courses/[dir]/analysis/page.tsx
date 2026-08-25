import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { SubjectSummaryReader } from "@/components/subject-summary-reader";
import { resolveCourse, courseDir, COURSES } from "@/lib/catalog";
import { loadIcs } from "@/lib/it-kmitl";

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
    title: `วิเคราะห์ข้อสอบ ${course.code} · IT-KMITL`,
    description: `ถอดพิมพ์เขียวข้อสอบมิดเทอม ${course.code} 1/2564 — ตารางคะแนนรายข้อ, Bloom's Taxonomy, Question Archetypes, 11 กับดัก และแผนจัดสรรเวลา`,
    alternates: { canonical: `/courses/${courseDir(course)}/analysis` },
  };
}

export default async function CourseAnalysisPage({
  params,
}: {
  params: Promise<{ dir: string }>;
}) {
  const { dir } = await params;
  const course = resolveCourse(dir);
  if (!course || course.code !== "ICS") notFound();

  const cDir = courseDir(course);
  const backHref = `/courses/${cDir}`;
  const backLabel = { th: course.nameTh, en: course.nameEn };
  const quizHref = course.tracks.quiz ?? backHref;
  const quizLabel = { th: "ทำแบบทดสอบ", en: "Take the quiz" };

  const data = loadIcs();
  if (!data.analysisMd) notFound();

  return (
    <>
      <Navbar />
      <SubjectSummaryReader
        markdown={data.analysisMd}
        backHref={backHref}
        backLabel={backLabel}
        quizHref={quizHref}
        quizLabel={quizLabel}
      />
    </>
  );
}
