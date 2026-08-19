import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { SubjectQuizGate } from "@/components/subject-quiz-gate";
import { CHEM_CHAPTERS, CHEM_QUIZ, CHEM_QUIZ_ID } from "@/lib/chem-quiz";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "แบบทดสอบเคมี · EN-KMITL · iHelp",
  description:
    "แบบทดสอบตัวเองวิชาเคมีทั่วไป ครอบคลุม 5 บท: อะตอม, พันธะ, สโตอิชิโอ, สารละลาย, สมดุล.",
};

export default function ChemQuizPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl px-3 sm:px-6 py-5 sm:py-8 w-full">
        <div className="mb-4 sm:mb-6 flex items-center justify-between text-xs sm:text-sm">
          <Link
            href="/en-kmitl/chem"
            className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors font-medium"
          >
            <ArrowLeft className="size-3.5 sm:size-4" />
            เคมีทั่วไป
          </Link>
        </div>

        <article className="overflow-hidden rounded-3xl border bg-card p-4 sm:p-6 shadow-sm">
          <SubjectQuizGate
            quizId={CHEM_QUIZ_ID}
            quizName="General Chemistry"
            questions={CHEM_QUIZ}
            chapters={CHEM_CHAPTERS}
          />
        </article>
      </main>
    </>
  );
}
