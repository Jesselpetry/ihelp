"use client";

import Link from "next/link";
import { ArrowLeft, BrainCircuit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MdView } from "@/components/md-view";
import { useLocale, t, type LText } from "@/lib/i18n";

interface SubjectSummaryReaderProps {
  markdown: string;
  /** Href for the ← back link (e.g. "/en-kmitl/compro") */
  backHref: string;
  backLabel: LText;
  /** Href for the "Take quiz" button (e.g. "/en-kmitl/compro/quiz") */
  quizHref: string;
  quizLabel?: LText;
}

const DEFAULT_QUIZ_LABEL: LText = { th: "ทำแบบทดสอบ", en: "Take the quiz" };

/** Generic Markdown summary reader shared across all subjects. */
export function SubjectSummaryReader({
  markdown,
  backHref,
  backLabel,
  quizHref,
  quizLabel = DEFAULT_QUIZ_LABEL,
}: SubjectSummaryReaderProps) {
  const { locale } = useLocale();

  return (
    <main className="mx-auto max-w-3xl px-3 sm:px-6 py-5 sm:py-8 w-full">
      <div className="mb-4 sm:mb-6 flex items-center justify-between text-xs sm:text-sm">
        <Link
          href={backHref}
          className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors font-medium"
        >
          <ArrowLeft className="size-3.5 sm:size-4" />
          {t(backLabel, locale)}
        </Link>
        <Button asChild size="sm" variant="outline" className="gap-1.5">
          <Link href={quizHref}>
            <BrainCircuit className="size-3.5" />
            {t(quizLabel, locale)}
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
