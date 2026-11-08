"use client";

import Link from "next/link";
import { useCallback, useMemo } from "react";
import { ArrowRight, FileText, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProblemHeader } from "@/components/pscp/problem-header";
import { ProblemIOSection } from "@/components/pscp/problem-io-section";
import { CodeGrader } from "@/components/code-grader";
import { recordPscpRun } from "@/lib/pscp/pscp-client";
import { tagLabel, tagStyle } from "@/lib/pscp/pscp-tags";
import type { PscpProblem } from "@/lib/pscp/pscp";
import type { GradeReport } from "@/lib/pscp/grader-types";
import { useLocale, t, type LText } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const L: Record<string, LText> = {
  onIJudge: { th: "เปิดบน iJudge", en: "Open on iJudge" },
  makeSub: { th: "สร้าง submission.md", en: "Make submission.md" },
  makeRefl: { th: "สร้าง ai_reflection.md", en: "Make ai_reflection.md" },
};

/** Preserved for external callers (e.g. problem-card.tsx) */
export function ConceptTags({
  tags,
  limit,
  className,
  tone = "color",
}: {
  tags: string[];
  limit?: number;
  className?: string;
  tone?: "color" | "neutral";
}) {
  const { locale } = useLocale();
  const shown = limit ? tags.slice(0, limit) : tags;
  const hidden = limit ? tags.length - shown.length : 0;
  const neutral = tone === "neutral";
  return (
    <div className={cn("flex flex-wrap items-center gap-1", className)}>
      {shown.map((tag) => (
        <Badge
          key={tag}
          variant="outline"
          className={cn(
            "rounded-md px-1.5 py-0 font-normal",
            neutral
              ? "border-border/70 bg-transparent text-xs text-muted-foreground"
              : cn("rounded-full px-2 text-[10px] font-medium", tagStyle(tag)),
          )}
        >
          {t(tagLabel(tag), locale)}
        </Badge>
      ))}
      {hidden > 0 && (
        <Badge
          variant="outline"
          className={cn(
            "px-1.5 py-0 font-normal text-muted-foreground",
            neutral
              ? "rounded-md border-border/70 bg-transparent text-xs"
              : "rounded-full px-2 text-[10px] font-medium",
          )}
        >
          +{hidden}
        </Badge>
      )}
    </div>
  );
}

/** Body of the problem workspace: header at top, statement on the left, live grader on the right. */
export function PscpWorkspace({
  problem,
  onClose,
}: {
  problem: PscpProblem;
  onClose?: () => void;
}) {
  const { locale } = useLocale();

  const handleReport = useCallback(
    (report: GradeReport) => {
      const passed = report.results.filter((r) => r.status === "P").length;
      recordPscpRun(problem.id, passed, report.results.length);
    },
    [problem.id],
  );

  // Official samples first, then the derived edge suite.
  const allCases = useMemo(
    () => [...problem.cases, ...problem.edgeCases],
    [problem.cases, problem.edgeCases],
  );
  const takeawayPoints = problem.takeaway?.points ?? [];

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* 1. Consolidated Minimal Header with Breadcrumbs, Star Bookmark, subtle chips, and clean metric bar */}
      <ProblemHeader
        id={problem.id}
        title={problem.cleanName}
        week={problem.week}
        examType={problem.midterm ? "Midterm" : undefined}
        tags={problem.tags}
        stats={problem.stats}
        expireLabel={problem.expireLabel}
        expireIso={problem.expireIso}
        limits={problem.limits}
        difficulty={problem.difficulty}
        recommended={problem.recommended}
        examRecommended={problem.examRecommended}
        url={problem.url}
        onClose={onClose}
      />

      {/* Split pane: statement | workspace. Stacks on small screens. */}
      <div className="grid min-h-0 flex-1 grid-cols-1 overflow-y-auto lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:overflow-hidden">
        {/* Left: Separated Input / Output Format Rows & Problem Pedagogy */}
        <section className="min-w-0 space-y-4 border-b px-4 py-4 sm:px-5 lg:overflow-y-auto lg:border-b-0 lg:border-r">
          <ProblemIOSection
            statement={problem.statement}
            sampleCase={problem.cases[0]}
            pitfalls={problem.pitfalls}
            takeawayPoints={takeawayPoints}
            note={problem.note}
            url={problem.url}
          />
        </section>

        {/* Right: Coding Panel (Dark Editor) & Test Case Panel (Normal Theme) */}
        <section className="min-w-0 space-y-4 bg-muted/[0.12] p-4 sm:p-5 lg:overflow-y-auto border-t lg:border-t-0 lg:border-l border-border/60">
          <CodeGrader
            problemId={problem.id}
            problemName={problem.cleanName}
            cases={allCases}
            onReport={handleReport}
            compact
          />

          {/* Wizard hand-off — same ?problem= contract the wizards read. */}
          <div className="flex flex-wrap items-center gap-2 rounded-2xl border bg-card p-3.5 shadow-xs text-foreground">
            {problem.learningLog && (
              <Button asChild size="sm" className="h-8 gap-1 rounded-full text-xs font-medium">
                <Link href={`/make/submission?problem=${problem.id}`}>
                  <FileText className="size-3.5" />
                  {t(L.makeSub, locale)}
                </Link>
              </Button>
            )}
            <Button
              asChild
              size="sm"
              variant="outline"
              className="h-8 gap-1 rounded-full text-xs font-medium"
            >
              <Link href={`/make/reflection?problem=${problem.id}`}>
                <Sparkles className="size-3.5" />
                {t(L.makeRefl, locale)}
              </Link>
            </Button>
            <Button
              asChild
              size="sm"
              variant="ghost"
              className="ml-auto h-8 gap-1 rounded-full text-xs text-muted-foreground"
            >
              <a href={problem.url} target="_blank" rel="noreferrer">
                {t(L.onIJudge, locale)}
                <ArrowRight className="size-3.5" />
              </a>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
