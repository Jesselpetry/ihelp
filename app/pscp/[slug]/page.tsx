import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { PscpWorkspace } from "@/components/pscp-workspace";
import { loadPscpProblem, loadPscpProblems } from "@/lib/pscp";

export const dynamic = "force-static";

export function generateStaticParams() {
  return loadPscpProblems().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const problem = loadPscpProblem(slug);
  if (!problem) return { title: "ไม่พบโจทย์" };
  return {
    title: `OJ ${problem.id} · ${problem.cleanName}`,
    description:
      problem.statement?.description?.slice(0, 160) ??
      `โจทย์ OJ ${problem.id} จากรายวิชา PSCP พร้อมพื้นที่ทำงานรันโค้ด Python ในเบราว์เซอร์`,
    alternates: { canonical: `/pscp/${problem.slug}` },
  };
}

export default async function PscpProblemPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const problem = loadPscpProblem(slug);
  if (!problem) notFound();

  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6">
        <Link
          href="/pscp"
          className="mb-3 inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="size-3.5" />
          กลับไปหน้ารายการโจทย์
        </Link>
        {/* Embedded, not a modal: the split pane gets the full page height and
            the workspace is linkable / refreshable / back-navigable. */}
        <div className="h-[calc(100vh-9rem)] min-h-[36rem] overflow-hidden rounded-3xl border bg-card shadow-sm">
          <PscpWorkspace problem={problem} />
        </div>
      </main>
    </>
  );
}
