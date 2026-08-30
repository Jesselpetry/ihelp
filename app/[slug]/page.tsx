import { redirect, notFound } from "next/navigation";
import { loadRecommendedProblem, loadRecommendedProblems } from "@/lib/recommended";
import { loadLibraryDoc, loadLibrary } from "@/lib/library";

export async function generateStaticParams() {
  const recSlugs = loadRecommendedProblems().flatMap((p) => [
    { slug: p.slug },
    { slug: String(p.id) },
    { slug: `oj${p.id}` },
  ]);
  const libSlugs = loadLibrary().map((d) => ({ slug: d.slug }));
  return [...recSlugs, ...libSlugs];
}

export default async function TopLevelSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // 1. Check if slug matches a recommended problem (e.g. oj2996-Swap_Characters, oj2996, 2996)
  const recProblem = loadRecommendedProblem(slug);
  if (recProblem) {
    redirect(`/recommended/${recProblem.slug}`);
  }

  // 2. Check if slug matches a library doc (e.g. workflows--student-workflow)
  const doc = loadLibraryDoc(slug);
  if (doc) {
    redirect(`/library/${slug}`);
  }

  // 3. Check if slug is pure OJ ID (e.g. /2996 or /oj2996)
  const m = slug.match(/^(?:oj)?(\d+)$/i);
  if (m) {
    const id = parseInt(m[1], 10);
    const byId = loadRecommendedProblem(String(id));
    if (byId) {
      redirect(`/recommended/${byId.slug}`);
    }
  }

  notFound();
}
