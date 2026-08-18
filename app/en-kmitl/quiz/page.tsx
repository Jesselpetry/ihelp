import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { EnKmitlQuizGate } from "@/components/en-kmitl-quiz-gate";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "แบบทดสอบ · EN-KMITL · iHelp",
  description: "แบบทดสอบตัวเองสำหรับเตรียมสอบกลางภาค 01006012 Computer Programming (EN-KMITL).",
};

export default function EnKmitlQuizPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl px-3 sm:px-6 py-5 sm:py-8 w-full">
        <div className="mb-4 sm:mb-6 flex items-center justify-between text-xs sm:text-sm">
          <Link
            href="/en-kmitl"
            className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors font-medium"
          >
            <ArrowLeft className="size-3.5 sm:size-4" />
            EN-KMITL Computer Programming
          </Link>
        </div>

        <article className="overflow-hidden rounded-3xl border bg-card p-4 sm:p-6 shadow-sm">
          <EnKmitlQuizGate />
        </article>
      </main>
    </>
  );
}
