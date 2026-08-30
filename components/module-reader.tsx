"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, BrainCircuit, Flag, Milestone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MdView } from "@/components/md-view";
import { TocSidePanel } from "@/components/toc-side-panel";
import { extractToc } from "@/lib/toc";
import { useLocale, t, type LText } from "@/lib/i18n";

/** One document, already read on the server. */
export interface ReaderDoc {
  slug: string;
  title: LText;
  markdown: string;
  chapter?: number;
  scope?: "midterm" | "final";
}

interface ModuleReaderProps {
  docs: ReaderDoc[];
  backHref: string;
  backLabel: LText;
  /**
   * Where the reader points once the last document is finished.
   *
   * Named deliberately: the old reader's only forward control was a quiz link
   * that fell back to the course hub, so on ten of fifteen courses "continue"
   * meant "go back to where you came from".
   */
  nextHref?: string;
  nextLabel?: LText;
}

const SCOPE_LABEL: Record<"midterm" | "final", LText> = {
  midterm: { th: "ก่อนมิดเทอม", en: "Midterm" },
  final: { th: "หลังมิดเทอม", en: "Final" },
};

const L = {
  docs: { th: "เอกสารในโมดูลนี้", en: "Documents in this module" },
  prev: { th: "ก่อนหน้า", en: "Previous" },
  next: { th: "ถัดไป", en: "Next" },
  defaultNext: { th: "ทำแบบทดสอบ", en: "Take the quiz" },
} satisfies Record<string, LText>;

function ScopeTag({ scope }: { scope: "midterm" | "final" }) {
  const { locale } = useLocale();
  const Icon = scope === "midterm" ? Milestone : Flag;
  return (
    <span
      className={`inline-flex items-center gap-0.5 rounded-full border px-1.5 py-0.5 text-[9px] font-semibold ${
        scope === "midterm"
          ? "border-transparent bg-primary text-primary-foreground shadow-xs"
          : "border-primary/30 bg-primary/10 text-primary"
      }`}
    >
      <Icon className="size-2.5" />
      {t(SCOPE_LABEL[scope], locale)}
    </span>
  );
}

/**
 * Reads one module's documents, with a live outline panel.
 *
 * Multi-document because a module is a shelf, not a file: MFIT's study notes
 * are the seven midterm weeks plus eight final weeks, and its cram module is a
 * crash summary beside a study plan. Splitting those across separate routes is
 * what produced six near-identical page files that all rendered this component
 * with one different loader each.
 */
export function ModuleReader({
  docs,
  backHref,
  backLabel,
  nextHref,
  nextLabel = L.defaultNext,
}: ModuleReaderProps) {
  const { locale } = useLocale();
  const [isTocCollapsed, setIsTocCollapsed] = useState(false);
  const [index, setIndex] = useState(0);

  const active = docs[Math.min(index, docs.length - 1)];
  const tocItems = useMemo(() => extractToc(active?.markdown ?? ""), [active?.markdown]);

  if (!active) return null;

  const isLast = index === docs.length - 1;

  function goTo(next: number) {
    setIndex(next);
    // A new document starts at its own top, not at the previous one's offset.
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  return (
    <main className="mx-auto max-w-6xl xl:max-w-7xl px-3 sm:px-6 py-5 sm:py-8 w-full">
      <div className="mb-4 sm:mb-6 flex items-center justify-between gap-3 text-xs sm:text-sm">
        <Link
          href={backHref}
          className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors font-medium"
        >
          <ArrowLeft className="size-3.5 sm:size-4" />
          {t(backLabel, locale)}
        </Link>
        {nextHref && (
          <Button asChild size="sm" variant="outline" className="gap-1.5 rounded-full shadow-xs">
            <Link href={nextHref}>
              <BrainCircuit className="size-3.5 text-primary" />
              {t(nextLabel, locale)}
            </Link>
          </Button>
        )}
      </div>

      {docs.length > 1 && (
        <nav aria-label={t(L.docs, locale)} className="mb-4">
          <div className="flex flex-wrap gap-1.5">
            {docs.map((doc, i) => {
              const activeDoc = i === index;
              return (
                <button
                  key={doc.slug}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-current={activeDoc ? "true" : undefined}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                    activeDoc
                      ? "border-transparent bg-primary text-primary-foreground shadow-xs"
                      : "bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground"
                  }`}
                >
                  {t(doc.title, locale)}
                  {!activeDoc && doc.scope && <ScopeTag scope={doc.scope} />}
                </button>
              );
            })}
          </div>
        </nav>
      )}

      <div
        className={`grid grid-cols-1 ${
          isTocCollapsed
            ? "lg:grid-cols-[56px_1fr]"
            : "lg:grid-cols-[290px_1fr] xl:grid-cols-[330px_1fr]"
        } gap-6 xl:gap-8 items-start transition-all duration-300`}
      >
        <TocSidePanel
          items={tocItems}
          isCollapsed={isTocCollapsed}
          onToggleCollapse={() => setIsTocCollapsed(!isTocCollapsed)}
        />

        <div className="min-w-0 space-y-4">
          <article className="min-w-0 overflow-hidden rounded-3xl border bg-card p-4 sm:p-7 xl:p-8 shadow-sm">
            <div className="prose prose-xs sm:prose-sm dark:prose-invert max-w-none">
              <MdView markdown={active.markdown} />
            </div>
          </article>

          {(docs.length > 1 || nextHref) && (
            <div className="flex items-center justify-between gap-3">
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5 rounded-full"
                disabled={index === 0}
                onClick={() => goTo(index - 1)}
              >
                <ArrowLeft className="size-3.5" />
                {t(L.prev, locale)}
              </Button>

              {isLast ? (
                nextHref && (
                  <Button asChild size="sm" className="gap-1.5 rounded-full">
                    <Link href={nextHref}>
                      {t(nextLabel, locale)}
                      <ArrowRight className="size-3.5" />
                    </Link>
                  </Button>
                )
              ) : (
                <Button
                  size="sm"
                  className="gap-1.5 rounded-full"
                  onClick={() => goTo(index + 1)}
                >
                  {t(docs[index + 1].title, locale)}
                  <ArrowRight className="size-3.5" />
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
