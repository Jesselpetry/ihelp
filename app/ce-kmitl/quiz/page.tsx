import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { TechniqueQuiz } from "@/components/technique-quiz";
import { CE_KMITL_QUIZ, CE_KMITL_QUIZ_ID } from "@/lib/ce-kmitl-quiz";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "แบบทดสอบ · CE-KMITL · iHelp",
  description: "แบบทดสอบตัวเองสำหรับเตรียมสอบกลางภาค 01006012 Computer Programming (CE-KMITL).",
};

export default function CeKmitlQuizPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl px-3 sm:px-6 py-5 sm:py-8 w-full">
        <div className="mb-4 sm:mb-6 flex items-center justify-between text-xs sm:text-sm">
          <Link
            href="/ce-kmitl"
            className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors font-medium"
          >
            <ArrowLeft className="size-3.5 sm:size-4" />
            CE-KMITL Computer Programming
          </Link>
        </div>

        <article className="overflow-hidden rounded-3xl border bg-card p-4 sm:p-6 shadow-sm">
          <TechniqueQuiz
            problemId={CE_KMITL_QUIZ_ID}
            problemName="CE-KMITL Computer Programming"
            questions={CE_KMITL_QUIZ}
          />
        </article>
      </main>
    </>
  );
}
