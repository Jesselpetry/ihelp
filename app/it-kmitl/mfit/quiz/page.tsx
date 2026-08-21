import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { SubjectQuizGate } from "@/components/subject-quiz-gate";
import { MFIT_CHAPTERS, MFIT_QUIZ, MFIT_QUIZ_ID } from "@/lib/mfit-quiz";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "แบบทดสอบ MFIT · IT-KMITL · iHelp",
  description:
    "แบบทดสอบตัวเองวิชา 06016401 Mathematics for Information Technology 45 ข้อ ครอบคลุม Week 1-7",
};

export default function MfitQuizPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl px-3 sm:px-6 py-5 sm:py-8 w-full">
        <div className="mb-4 sm:mb-6 flex items-center justify-between text-xs sm:text-sm">
          <Link
            href="/it-kmitl/mfit"
            className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors font-medium"
          >
            <ArrowLeft className="size-3.5 sm:size-4" />
            MFIT
          </Link>
        </div>

        <article className="overflow-hidden rounded-3xl border bg-card p-4 sm:p-6 shadow-sm">
          <SubjectQuizGate
            quizId={MFIT_QUIZ_ID}
            quizName="Mathematics for IT"
            questions={MFIT_QUIZ}
            chapters={MFIT_CHAPTERS}
            chapterLabel={{ th: "สัปดาห์ที่", en: "Week" }}
          />
        </article>
      </main>
    </>
  );
}
