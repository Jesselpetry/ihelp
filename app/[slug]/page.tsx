import { redirect, notFound } from "next/navigation";
import { loadRecommendedProblem } from "@/lib/recommended";
import { loadLibraryDoc } from "@/lib/library";

export const dynamic = "force-dynamic";

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
