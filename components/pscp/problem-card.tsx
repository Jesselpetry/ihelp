"use client";

import Link from "next/link";
import { ChevronRight, FileText, Lightbulb, Sparkles } from "lucide-react";
import type { PscpProblem } from "@/lib/pscp";
import type { PscpProgress } from "@/lib/pscp-client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { WeekBadge } from "@/components/week-badge";
import { ConceptTags } from "@/components/pscp-workspace";
import { t, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import {
  DifficultyMeter,
  PL,
  ProblemActions,
  ProblemMeta,
  StatusDot,
  isExpired,
  problemState,
} from "@/components/pscp/problem-primitives";

/**
 * One problem, grid view.
 *
 * Four zones top to bottom — identity, title, concepts, footer — with exactly
 * one signal per zone competing for attention. Learning Log is a pink badge
 * beside the week tag; Recommended is a single icon; state is one dot. The
 * takeaway, attempt score and synced-file links moved to the title tooltip,
 * the status dot and the hover action row respectively.
 */
export function ProblemCard({
  problem,
  solved,
  attempt,
  hasSub,
  hasRefl,
  onOpen,
  onToggleSolved,
  locale,
}: {
  problem: PscpProblem;
  solved: boolean;
  attempt: PscpProgress[number] | undefined;
  hasSub: boolean;
  hasRefl: boolean;
  onOpen: () => void;
  onToggleSolved: () => void;
  locale: Locale;
}) {
  const expired = isExpired(problem, new Date());
  const state = problemState(solved, attempt, expired);
  const takeaway = problem.takeaway?.points?.[0];

  return (
    <article
      className={cn(
        "group relative flex flex-col rounded-xl border bg-card p-4 transition-colors",
        "hover:border-foreground/20 hover:bg-muted/30",
        expired && "opacity-70 hover:opacity-100",
      )}
    >
      {/* Identity */}
      <div className="flex items-center gap-2">
        {problem.recommended && (
          <Sparkles
            className="size-3.5 shrink-0 text-primary"
            aria-label={t(PL.recommended, locale)}
          />
        )}
        <span className="font-mono text-xs tabular-nums text-muted-foreground">
          OJ {problem.id}
        </span>
        {problem.week !== null && (
          <>
            <span aria-hidden className="text-muted-foreground/40">
              ·
            </span>
            <WeekBadge week={problem.week} variant="plain" />
          </>
        )}
        {problem.learningLog && (
          <Badge className="rounded-full bg-primary/10 px-2 py-0 text-[10px] font-medium text-primary shadow-none">
            {t(PL.learningLog, locale)}
          </Badge>
        )}
        <StatusDot state={state} attempt={attempt} locale={locale} className="ml-auto" />
      </div>

      {/* Title + difficulty */}
      <div className="mt-2.5 flex items-start gap-3">
        <h2 className="min-w-0 flex-1 text-[15px] font-medium leading-snug tracking-tight">
          <Link
            href={`/pscp/${problem.slug}`}
            title={takeaway ? t(takeaway, locale) : undefined}
            className="text-foreground transition-colors after:absolute after:inset-0 hover:text-primary"
          >
            {problem.cleanName || problem.name}
          </Link>
        </h2>
        <DifficultyMeter value={problem.difficulty} className="mt-1.5" />
      </div>

      {problem.tags.length > 0 && (
        <ConceptTags tags={problem.tags} limit={3} tone="neutral" className="mt-2.5" />
      )}

      {/* Footer: facts left, actions right. `relative` lifts the controls above
          the title link's stretched ::after hit area. */}
      <div className="relative mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 border-t pt-3">
        <ProblemMeta problem={problem} expired={expired} locale={locale} />

        <div className="ml-auto flex items-center gap-1">
          <ProblemActions
            problem={problem}
            solved={solved}
            hasSub={hasSub}
            hasRefl={hasRefl}
            onOpen={onOpen}
            onToggleSolved={onToggleSolved}
            locale={locale}
          />
          <Button
            asChild
            size="sm"
            variant="outline"
            className="h-8 gap-1 rounded-lg border-primary/30 px-3 text-xs font-medium text-primary hover:border-primary hover:bg-primary hover:text-primary-foreground"
          >
            <Link href={`/pscp/${problem.slug}`}>
              {t(PL.open, locale)}
              <ChevronRight className="size-3.5" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Wizard entry points: quiet text links, revealed with the action row.
          Height collapses while hidden so the card does not reserve dead space
          for a row most of the grid never shows. */}
      <div className="relative flex items-center gap-3 overflow-hidden transition-all mt-2 max-h-6 opacity-100 sm:mt-0 sm:max-h-0 sm:opacity-0 sm:group-hover:mt-2 sm:group-hover:max-h-6 sm:group-hover:opacity-100 sm:group-focus-within:mt-2 sm:group-focus-within:max-h-6 sm:group-focus-within:opacity-100">
        {problem.learningLog && (
          <Link
            href={`/make/submission?problem=${problem.id}`}
            className="inline-flex items-center gap-1 text-xs text-muted-foreground underline-offset-4 hover:text-primary hover:underline"
          >
            <FileText className="size-3" />
            submission
          </Link>
        )}
        <Link
          href={`/make/reflection?problem=${problem.id}`}
          className="inline-flex items-center gap-1 text-xs text-muted-foreground underline-offset-4 hover:text-primary hover:underline"
        >
          <Lightbulb className="size-3" />
          reflection
        </Link>
      </div>
    </article>
  );
}
