import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { SubjectQuizGate } from "@/components/subject-quiz-gate";
import { EN_KMITL_CHAPTERS, EN_KMITL_QUIZ, EN_KMITL_QUIZ_ID } from "@/lib/en-kmitl-quiz";
import { EN_KMITL_MOCK_EXAM } from "@/lib/en-kmitl-mock-exam";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "แบบทดสอบ ComPro · EN-KMITL · iHelp",
  description:
    "แบบทดสอบตัวเองสำหรับเตรียมสอบกลางภาค 01006012 Computer Programming (EN-KMITL).",
};

// Combined: curated questions first, then mock exam
const ALL_QUESTIONS = [...EN_KMITL_QUIZ, ...EN_KMITL_MOCK_EXAM];

export default function ComProQuizPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl px-3 sm:px-6 py-5 sm:py-8 w-full">
        <div className="mb-4 sm:mb-6 flex items-center justify-between text-xs sm:text-sm">
          <Link
            href="/en-kmitl/compro"
            className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors font-medium"
          >
            <ArrowLeft className="size-3.5 sm:size-4" />
            Computer Programming
          </Link>
        </div>

        <article className="overflow-hidden rounded-3xl border bg-card p-4 sm:p-6 shadow-sm">
          <SubjectQuizGate
            quizId={EN_KMITL_QUIZ_ID}
            quizName="Computer Programming"
            questions={ALL_QUESTIONS}
            chapters={EN_KMITL_CHAPTERS}
          />
        </article>
      </main>
    </>
  );
}
