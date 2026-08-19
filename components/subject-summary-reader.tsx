"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, BrainCircuit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MdView } from "@/components/md-view";
import { TocSidePanel } from "@/components/toc-side-panel";
import { extractToc } from "@/lib/toc";
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

/** Generic Markdown summary reader shared across all subjects with real-time Outline Side Panel. */
export function SubjectSummaryReader({
  markdown,
  backHref,
  backLabel,
  quizHref,
  quizLabel = DEFAULT_QUIZ_LABEL,
}: SubjectSummaryReaderProps) {
  const { locale } = useLocale();
  const tocItems = useMemo(() => extractToc(markdown), [markdown]);

  return (
    <main className="mx-auto max-w-6xl xl:max-w-7xl px-3 sm:px-6 py-5 sm:py-8 w-full">
      {/* Top Header Navigation */}
      <div className="mb-4 sm:mb-6 flex items-center justify-between text-xs sm:text-sm">
        <Link
          href={backHref}
          className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors font-medium"
        >
          <ArrowLeft className="size-3.5 sm:size-4" />
          {t(backLabel, locale)}
        </Link>
        <Button asChild size="sm" variant="outline" className="gap-1.5 rounded-full shadow-xs">
          <Link href={quizHref}>
            <BrainCircuit className="size-3.5 text-primary" />
            {t(quizLabel, locale)}
          </Link>
        </Button>
      </div>

      {/* Main Grid: Content (left) + Side Panel (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_290px] xl:grid-cols-[1fr_330px] gap-6 xl:gap-8 items-start">
        <article className="min-w-0 overflow-hidden rounded-3xl border bg-card p-4 sm:p-7 xl:p-8 shadow-sm">
          <div className="prose prose-xs sm:prose-sm dark:prose-invert max-w-none">
            <MdView markdown={markdown} />
          </div>
        </article>

        {/* Outline Side Panel (sticky on desktop, floating drawer on mobile) */}
        <TocSidePanel items={tocItems} />
      </div>
    </main>
  );
}

