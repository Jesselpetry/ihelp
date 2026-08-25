import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { SubjectSummaryReader } from "@/components/subject-summary-reader";
import { resolveCourse, courseDir, COURSES } from "@/lib/catalog";
import { loadIcs, loadMfit } from "@/lib/it-kmitl";

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
    title: `ข้อสอบชุดฝึก/ชุดจำลอง ${course.code} + เฉลย · IT-KMITL`,
    description: `ข้อสอบชุดฝึกและชุดจำลองพร้อมเฉลยละเอียดสำหรับวิชา ${course.code} ${course.nameTh} (${course.nameEn})`,
    alternates: { canonical: `/courses/${courseDir(course)}/exam` },
  };
}

export default async function CourseExamPage({
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
  const quizLabel = { th: "ทำแบบทดสอบ", en: "Take the quiz" };

  let examMd: string | null = null;

  if (course.code === "ICS") {
    examMd = loadIcs().examMd;
  } else if (course.code === "MFIT") {
    examMd = loadMfit().examMd;
  } else {
    notFound();
  }

  if (!examMd) notFound();

  return (
    <>
      <Navbar />
      <SubjectSummaryReader
        markdown={examMd}
        backHref={backHref}
        backLabel={backLabel}
        quizHref={quizHref}
        quizLabel={quizLabel}
      />
    </>
  );
}
