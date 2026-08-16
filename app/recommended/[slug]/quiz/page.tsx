import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { TechniqueQuiz } from "@/components/technique-quiz";
import { loadRecommendedProblem } from "@/lib/recommended";
import { QUIZ_BANK } from "@/lib/quiz-content";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const problem = loadRecommendedProblem(slug);
  return {
    title: problem
      ? `Quiz - OJ ${problem.id} ${problem.cleanName} · Recommended Problems`
      : "Technique Quiz",
    description: problem
      ? `Self-test quiz on the technique behind PSCP recommended problem OJ ${problem.id} (${problem.cleanName}).`
      : "Technique self-test quiz",
  };
}

export default async function RecommendedProblemQuizPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const problem = loadRecommendedProblem(slug);
  if (!problem) notFound();

  const questions = QUIZ_BANK[problem.id];
  if (!questions || questions.length === 0) notFound();

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl px-3 sm:px-6 py-5 sm:py-8 w-full">
        <div className="mb-4 sm:mb-6 flex items-center justify-between text-xs sm:text-sm">
          <Link
            href={`/recommended/${problem.slug}`}
            className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors font-medium"
          >
            <ArrowLeft className="size-3.5 sm:size-4" />
            OJ {problem.id} · {problem.cleanName}
          </Link>
        </div>

        <article className="overflow-hidden rounded-3xl border bg-card p-4 sm:p-6 shadow-sm">
          <TechniqueQuiz
            problemId={problem.id}
            problemName={problem.cleanName}
            questions={questions}
            nextSlug={problem.next?.slug}
            nextName={problem.next?.cleanName}
          />
        </article>
      </main>
    </>
  );
}
