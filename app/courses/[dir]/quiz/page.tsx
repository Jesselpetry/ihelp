import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { SubjectQuizGate } from "@/components/subject-quiz-gate";
import { resolveCourse, courseDir, COURSES } from "@/lib/catalog";

// Subject quiz imports
import { ITF_CHAPTERS, ITF_QUIZ, ITF_QUIZ_ID } from "@/lib/itf-quiz";
import { ICS_CHAPTERS, ICS_QUIZ, ICS_QUIZ_ID } from "@/lib/ics-quiz";
import {
  MFIT_BLUEPRINT_QUIZ,
  MFIT_CHAPTERS,
  MFIT_QUIZ,
  MFIT_QUIZ_ID,
} from "@/lib/mfit-quiz";
import {
  EN_KMITL_CHAPTERS,
  EN_KMITL_QUIZ,
  EN_KMITL_QUIZ_ID,
} from "@/lib/en-kmitl-quiz";
import { EN_KMITL_MOCK_EXAM } from "@/lib/en-kmitl-mock-exam";
import { CHEM_CHAPTERS, CHEM_QUIZ, CHEM_QUIZ_ID } from "@/lib/chem-quiz";

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
    title: `แบบทดสอบ ${course.code} — ${course.nameTh}`,
    description: `แบบทดสอบตัวเองและฝึกทำโจทย์วิชา ${course.code} ${course.nameTh} (${course.nameEn}) IT KMITL`,
    alternates: { canonical: `/courses/${courseDir(course)}/quiz` },
  };
}

export default async function CourseQuizPage({
  params,
}: {
  params: Promise<{ dir: string }>;
}) {
  const { dir } = await params;
  const course = resolveCourse(dir);
  if (!course) notFound();

  const cDir = courseDir(course);
  const backHref = `/courses/${cDir}`;

  let quizId = 0;
  let quizName = "";
  let questions: any[] = [];
  let chapters: any[] = [];
  let chapterLabel: { th: string; en?: string } | undefined = undefined;

  if (course.code === "ITF") {
    quizId = ITF_QUIZ_ID;
    quizName = "ITF Midterm";
    questions = ITF_QUIZ;
    chapters = ITF_CHAPTERS;
    chapterLabel = { th: "Lecture", en: "Lecture" };
  } else if (course.code === "ICS") {
    quizId = ICS_QUIZ_ID;
    quizName = "ICS / Digital Logic";
    questions = ICS_QUIZ;
    chapters = ICS_CHAPTERS;
  } else if (course.code === "MFIT") {
    quizId = MFIT_QUIZ_ID;
    quizName = "Mathematics for IT";
    questions = [...MFIT_BLUEPRINT_QUIZ, ...MFIT_QUIZ];
    chapters = MFIT_CHAPTERS;
    chapterLabel = { th: "สัปดาห์ที่", en: "Week" };
  } else if (course.code === "COMPRO") {
    quizId = EN_KMITL_QUIZ_ID;
    quizName = "Computer Programming";
    questions = [...EN_KMITL_QUIZ, ...EN_KMITL_MOCK_EXAM];
    chapters = EN_KMITL_CHAPTERS;
  } else if (course.code === "CHEM") {
    quizId = CHEM_QUIZ_ID;
    quizName = "General Chemistry";
    questions = CHEM_QUIZ;
    chapters = CHEM_CHAPTERS;
  } else {
    notFound();
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl px-3 sm:px-6 py-5 sm:py-8 w-full">
        <div className="mb-4 sm:mb-6 flex items-center justify-between text-xs sm:text-sm">
          <Link
            href={backHref}
            className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors font-medium"
          >
            <ArrowLeft className="size-3.5 sm:size-4" />
            {course.nameTh}
          </Link>
        </div>

        <article className="overflow-hidden rounded-3xl border bg-card p-4 sm:p-6 shadow-sm">
          <SubjectQuizGate
            quizId={quizId}
            quizName={quizName}
            questions={questions}
            chapters={chapters}
            chapterLabel={chapterLabel}
          />
        </article>
      </main>
    </>
  );
}
