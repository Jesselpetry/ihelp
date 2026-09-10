"use client";

import Link from "next/link";
import { ChevronRight, FileText, Sparkles } from "lucide-react";
import type { PscpProblem } from "@/lib/pscp";
import type { PscpProgress } from "@/lib/pscp-client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { t, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import {
  DifficultyMeter,
  PL,
  ProblemActions,
  StatusDot,
  isExpired,
  shortDate,
  problemState,
} from "@/components/pscp/problem-primitives";

/**
 * One problem, matrix view.
 *
 * Where the card stacks, the table spreads: each signal gets its own column so
 * a run of 60 rows can be scanned down a single axis. Columns drop out from the
 * right as the viewport narrows — status, name and actions always survive.
 */
export function ProblemRow({
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

  return (
    <TableRow
      className={cn(
        "group border-l-2 border-l-transparent",
        problem.learningLog && "border-l-primary",
        expired && "opacity-70 hover:opacity-100",
      )}
      data-ll={problem.learningLog || undefined}
    >
      <TableCell className="py-3 pl-4 pr-0 align-middle">
        <StatusDot state={state} locale={locale} labelled={false} />
      </TableCell>

      <TableCell className="py-3 align-middle">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs tabular-nums text-muted-foreground">
            {problem.id}
          </span>
          <Link
            href={`/pscp/${problem.slug}`}
            className="min-w-0 truncate text-sm font-medium text-foreground transition-colors hover:text-primary"
          >
            {problem.cleanName || problem.name}
          </Link>
          {problem.recommended && (
            <Badge className="shrink-0 gap-1 rounded-full bg-primary/10 px-2 py-0 text-[10px] font-medium text-primary shadow-none">
              <Sparkles className="size-2.5" />
              {t(PL.recommended, locale)}
            </Badge>
          )}
          {problem.learningLog && (
            <Badge className="shrink-0 gap-1 rounded-full bg-primary/10 px-2 py-0 text-[10px] font-medium text-primary shadow-none">
              <FileText className="size-2.5" />
              submission.md
            </Badge>
          )}
        </div>
        {/* Progress score has no column of its own; it rides under the name. */}
        {state === "progress" && attempt && (
          <span className="mt-0.5 block pl-1 font-mono text-xs tabular-nums text-amber-600 dark:text-amber-400">
            {attempt.passed}/{attempt.total}
          </span>
        )}
      </TableCell>

      <TableCell className="hidden py-3 align-middle lg:table-cell">
        <span className="font-mono text-xs tabular-nums text-muted-foreground">
          {problem.week !== null ? `W${problem.week}` : "—"}
        </span>
      </TableCell>

      <TableCell className="hidden py-3 align-middle sm:table-cell">
        <DifficultyMeter value={problem.difficulty} />
      </TableCell>

      <TableCell className="hidden py-3 align-middle lg:table-cell">
        <span
          className={cn(
            "whitespace-nowrap text-xs tabular-nums",
            expired ? "font-medium text-destructive" : "text-muted-foreground",
          )}
        >
          {problem.expireLabel ? shortDate(problem.expireLabel) : "—"}
        </span>
      </TableCell>

      <TableCell className="py-3 pr-4 align-middle">
        <div className="flex items-center justify-end gap-1">
          <ProblemActions
            problem={problem}
            solved={solved}
            hasSub={hasSub}
            hasRefl={hasRefl}
            onOpen={onOpen}
            onToggleSolved={onToggleSolved}
            locale={locale}
          />
          {problem.learningLog && (
            <Button
              asChild
              size="sm"
              variant="outline"
              className="hidden h-8 gap-1 rounded-lg border-primary/30 px-3 text-xs font-medium text-primary hover:border-primary hover:bg-primary hover:text-primary-foreground sm:inline-flex"
            >
              <Link href={`/make/submission?problem=${problem.id}`} title={t(PL.makeSubmission, locale)}>
                <FileText className="size-3.5" />
                submission.md
              </Link>
            </Button>
          )}
          <Button asChild size="sm" className="h-8 gap-1 rounded-lg px-3 text-xs font-medium">
            <Link href={`/pscp/${problem.slug}`}>
              {t(PL.open, locale)}
              <ChevronRight className="size-3.5" />
            </Link>
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
