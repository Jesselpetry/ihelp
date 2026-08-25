import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { SubjectSummaryReader } from "@/components/subject-summary-reader";
import { resolveCourse, courseDir, COURSES } from "@/lib/catalog";
import { loadItf, loadIcs, loadMfit } from "@/lib/it-kmitl";
import { loadEnKmitl, loadChem } from "@/lib/en-kmitl";
import { loadCourseOverview } from "@/lib/course-content";

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
    title: `สรุปเนื้อหา ${course.code} — ${course.nameTh}`,
    description: `สรุปเนื้อหาเตรียมสอบรายวิชา ${course.code} ${course.nameTh} (${course.nameEn}) IT KMITL`,
    alternates: { canonical: `/courses/${courseDir(course)}/summary` },
  };
}

export default async function CourseSummaryPage({
  params,
}: {
  params: Promise<{ dir: string }>;
}) {
  const { dir } = await params;
  const course = resolveCourse(dir);
  if (!course) notFound();

  const cDir = courseDir(course);
  const backHref = `/courses/${cDir}`;
  const backLabel = { th: course.nameTh, en: course.nameEn };
  const quizHref = course.tracks.quiz ?? backHref;
  const quizLabel = course.tracks.quiz
    ? { th: "ทำแบบทดสอบ", en: "Take the quiz" }
    : { th: "ภาพรวมรายวิชา", en: "Course Hub" };

  let markdown: string | null = null;

  if (course.code === "ITF") {
    markdown = loadItf().summaryMd;
  } else if (course.code === "ICS") {
    markdown = loadIcs().summaryMd;
  } else if (course.code === "MFIT") {
    markdown = loadMfit().summaryMd;
  } else if (course.code === "COMPRO") {
    markdown = loadEnKmitl().summaryMd;
  } else if (course.code === "CHEM") {
    markdown = loadChem().summaryMd;
  } else {
    markdown = loadCourseOverview(cDir);
  }

  if (!markdown) notFound();

  return (
    <>
      <Navbar />
      <SubjectSummaryReader
        markdown={markdown}
        backHref={backHref}
        backLabel={backLabel}
        quizHref={quizHref}
        quizLabel={quizLabel}
      />
    </>
  );
}
