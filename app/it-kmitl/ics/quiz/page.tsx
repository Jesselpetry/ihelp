import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { SubjectQuizGate } from "@/components/subject-quiz-gate";
import { ICS_CHAPTERS, ICS_QUIZ, ICS_QUIZ_ID } from "@/lib/ics-quiz";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "แบบทดสอบ ICS · IT-KMITL · iHelp",
  description:
    "แบบทดสอบตัวเองวิชา ICS / Digital Logic 50 ข้อ ครอบคลุม 6 บท: เลขฐาน, บูลีน, K-Map, Timing, ออกแบบวงจร, MUX",
};

export default function IcsQuizPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl px-3 sm:px-6 py-5 sm:py-8 w-full">
        <div className="mb-4 sm:mb-6 flex items-center justify-between text-xs sm:text-sm">
          <Link
            href="/it-kmitl/ics"
            className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors font-medium"
          >
            <ArrowLeft className="size-3.5 sm:size-4" />
            ICS / Digital Logic
          </Link>
        </div>

        <article className="overflow-hidden rounded-3xl border bg-card p-4 sm:p-6 shadow-sm">
          <SubjectQuizGate
            quizId={ICS_QUIZ_ID}
            quizName="ICS / Digital Logic"
            questions={ICS_QUIZ}
            chapters={ICS_CHAPTERS}
          />
        </article>
      </main>
    </>
  );
}
