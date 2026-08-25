import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { RecommendedHub } from "@/components/recommended-hub";
import { loadRecommendedHub } from "@/lib/recommended";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Recommended Problems",
  description: "Explore the 10 PSCP Recommended Problems with complete problem explanations, Python techniques, test cases, and solution code.",
  alternates: { canonical: "/recommended" },
};

export default function RecommendedPage() {
  const hubData = loadRecommendedHub();
  return (
    <>
      <Navbar />
      <RecommendedHub data={hubData} />
    </>
  );
}
