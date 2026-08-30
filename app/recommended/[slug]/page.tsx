import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { RecommendedReader } from "@/components/recommended-reader";
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
      ? `OJ ${problem.id} - ${problem.cleanName} · Recommended Problems`
      : "Recommended Problem",
    description: problem
      ? `PSCP Recommended problem OJ ${problem.id} (${problem.cleanName}): ${problem.technique}`
      : "Recommended problem note",
  };
}

export default async function RecommendedProblemPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const problem = loadRecommendedProblem(slug);
  if (!problem) notFound();

  return (
    <div className="h-dvh max-h-dvh flex flex-col overflow-hidden bg-background">
      <Navbar />
      <RecommendedReader problem={problem} />
    </div>
  );
}
