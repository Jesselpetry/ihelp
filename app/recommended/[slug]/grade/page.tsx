import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { CodeGrader } from "@/components/code-grader";
import { loadRecommendedProblem } from "@/lib/recommended";

import { loadRecommendedProblems } from "@/lib/recommended";

export async function generateStaticParams() {
  return loadRecommendedProblems().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const problem = loadRecommendedProblem(slug);
  return {
    title: problem
      ? `Grade OJ ${problem.id} - ${problem.cleanName} · Recommended Problems`
      : "Grade Problem",
    description: problem
      ? `Client-side grader for PSCP Recommended problem OJ ${problem.id} (${problem.cleanName}).`
      : "Recommended problem grader",
  };
}

export default async function RecommendedProblemGradePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const problem = loadRecommendedProblem(slug);
  if (!problem) notFound();

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-4xl px-3 sm:px-6 py-5 sm:py-8 w-full">
        <CodeGrader
          problemId={problem.id}
          problemName={problem.cleanName}
          initialCode={problem.pythonCode ?? undefined}
        />
      </main>
    </>
  );
}
