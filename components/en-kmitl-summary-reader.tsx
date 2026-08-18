"use client";

import Link from "next/link";
import { ArrowLeft, BrainCircuit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MdView } from "@/components/md-view";
import { useLocale, t, type LText } from "@/lib/i18n";

const L: Record<string, LText> = {
  back: { th: "EN-KMITL", en: "EN-KMITL" },
  takeQuiz: { th: "ทำแบบทดสอบ", en: "Take the quiz" },
};

export function EnKmitlSummaryReader({ markdown }: { markdown: string }) {
  const { locale } = useLocale();
  return (
    <main className="mx-auto max-w-3xl px-3 sm:px-6 py-5 sm:py-8 w-full">
      <div className="mb-4 sm:mb-6 flex items-center justify-between text-xs sm:text-sm">
        <Link
          href="/en-kmitl"
          className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors font-medium"
        >
          <ArrowLeft className="size-3.5 sm:size-4" />
          {t(L.back, locale)}
        </Link>
        <Button asChild size="sm" variant="outline" className="gap-1.5">
          <Link href="/en-kmitl/quiz">
            <BrainCircuit className="size-3.5" />
            {t(L.takeQuiz, locale)}
          </Link>
        </Button>
      </div>

      <article className="overflow-hidden rounded-3xl border bg-card p-4 sm:p-6 shadow-sm">
        <div className="prose prose-xs sm:prose-sm dark:prose-invert max-w-none">
          <MdView markdown={markdown} />
        </div>
      </article>
    </main>
  );
}
