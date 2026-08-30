"use client";

import Link from "next/link";
import { useCallback, useMemo } from "react";
import {
  ArrowRight,
  Clock,
  Cpu,
  ExternalLink,
  FileText,
  Lightbulb,
  Sparkles,
  Star,
  TriangleAlert,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MdView } from "@/components/md-view";
import { WeekBadge } from "@/components/week-badge";
import { CodeGrader } from "@/components/code-grader";
import { ScratchRunner } from "@/components/scratch-runner";
import { recordPscpRun } from "@/lib/pscp-client";
import { tagLabel, tagStyle } from "@/lib/pscp-tags";
import type { PscpProblem } from "@/lib/pscp";
import type { GradeReport } from "@/lib/grader-types";
import { useLocale, t, type LText } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const L: Record<string, LText> = {
  close: { th: "ปิด", en: "Close" },
  statement: { th: "โจทย์", en: "Problem Statement" },
  inputSpec: { th: "รูปแบบอินพุต", en: "Input Specification" },
  outputSpec: { th: "รูปแบบเอาต์พุต", en: "Output Specification" },
  authorNote: { th: "โน้ตจากผู้ออกโจทย์", en: "Author's Note" },
  noStatement: {
    th: "iJudge ไม่ได้เปิดเผยตัวโจทย์ของข้อนี้ไว้ในชุดข้อมูลที่นำเข้า — กดเปิดบน iJudge เพื่ออ่านโจทย์ฉบับเต็ม",
    en: "iJudge did not expose this problem's statement in the imported export — open it on iJudge to read the full text.",
  },
  takeaway: { th: "จุดสำคัญของข้อนี้", en: "Key Takeaways" },
  pitfalls: { th: "จุดที่มักพลาด", en: "Common Pitfalls" },
  concepts: { th: "แนวคิดที่ใช้", en: "Concepts" },
  workspace: { th: "พื้นที่ทำงาน", en: "Workspace" },
  onIJudge: { th: "เปิดบน iJudge", en: "Open on iJudge" },
  makeSub: { th: "สร้าง submission.md", en: "Make submission.md" },
  makeRefl: { th: "สร้าง ai_reflection.md", en: "Make ai_reflection.md" },
  limits: { th: "ข้อจำกัด", en: "Limits" },
  expires: { th: "หมดเขต", en: "Deadline" },
  passRate: { th: "อัตราผ่าน", en: "Pass rate" },
  learningLog: { th: "Learning Log", en: "Learning Log" },
  recommended: { th: "แนะนำ", en: "Recommended" },
  midterm: { th: "Midterm", en: "Midterm" },
};

function DifficultyStars({ value }: { value: number }) {
  if (value <= 0) return null;
  return (
    <span className="inline-flex items-center gap-0.5" title={`difficulty ${value}`}>
      {Array.from({ length: Math.max(value, 1) }).map((_, i) => (
        <Star key={i} className="size-3.5 fill-amber-400 text-amber-400" />
      ))}
    </span>
  );
}

export function ConceptTags({
  tags,
  limit,
  className,
}: {
  tags: string[];
  limit?: number;
  className?: string;
}) {
  const { locale } = useLocale();
  const shown = limit ? tags.slice(0, limit) : tags;
  const hidden = limit ? tags.length - shown.length : 0;
  return (
    <div className={cn("flex flex-wrap items-center gap-1", className)}>
      {shown.map((tag) => (
        <Badge
          key={tag}
          variant="outline"
          className={cn("rounded-full px-2 py-0 text-[10px] font-medium", tagStyle(tag))}
        >
          {t(tagLabel(tag), locale)}
        </Badge>
      ))}
      {hidden > 0 && (
        <Badge
          variant="outline"
          className="rounded-full px-2 py-0 text-[10px] font-medium text-muted-foreground"
        >
          +{hidden}
        </Badge>
      )}
    </div>
  );
}

/** Body of the problem drawer: statement on the left, live grader on the right. */
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

  // Official samples first, then the derived edge suite. CodeGrader groups
  // them into two labelled sections off the `official` flag.
  const allCases = useMemo(
    () => [...problem.cases, ...problem.edgeCases],
    [problem.cases, problem.edgeCases],
  );
  const hasCases = allCases.length > 0;
  const takeawayPoints = problem.takeaway?.points ?? [];

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* Sticky header */}
      <header className="shrink-0 border-b bg-card/95 px-4 py-3 backdrop-blur sm:px-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="font-mono text-sm font-bold text-primary">OJ {problem.id}</span>
              {problem.week !== null && <WeekBadge week={problem.week} />}
              {problem.learningLog && (
                <Badge className="rounded-full bg-primary px-2 py-0 text-[10px] font-medium text-primary-foreground shadow-none">
                  {t(L.learningLog, locale)}
                </Badge>
              )}
              {problem.recommended && (
                <Badge className="gap-1 rounded-full border-amber-500/30 bg-amber-500/10 px-2 py-0 text-[10px] font-semibold text-amber-600 shadow-none dark:text-amber-400">
                  <Sparkles className="size-2.5" />
                  {t(L.recommended, locale)}
                </Badge>
              )}
              {problem.midterm && (
                <Badge
                  variant="outline"
                  className="rounded-full px-2 py-0 text-[10px] font-medium"
                >
                  {t(L.midterm, locale)}
                </Badge>
              )}
              <DifficultyStars value={problem.difficulty} />
            </div>
            <h2 className="mt-1.5 truncate text-lg font-bold tracking-tight text-foreground">
              {problem.cleanName}
            </h2>
          </div>

          <div className="flex shrink-0 items-center gap-1.5">
            <Button
              asChild
              size="sm"
              variant="outline"
              className="h-8 gap-1 rounded-full text-xs"
            >
              {/* Preserved verbatim from the iJudge export — never rewritten. */}
              <a href={problem.url} target="_blank" rel="noreferrer">
                <ExternalLink className="size-3.5" />
                <span className="hidden sm:inline">{t(L.onIJudge, locale)}</span>
              </a>
            </Button>
            {onClose && (
              <Button
                type="button"
                onClick={onClose}
                size="sm"
                variant="ghost"
                className="size-8 cursor-pointer rounded-full p-0"
                title={t(L.close, locale)}
              >
                <X className="size-4" />
              </Button>
            )}
          </div>
        </div>

        <ConceptTags tags={problem.tags} className="mt-2" />
      </header>

      {/* Split pane: statement | workspace. Stacks on small screens. */}
      <div className="grid min-h-0 flex-1 grid-cols-1 overflow-y-auto lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:overflow-hidden">
        {/* Left: statement & pedagogy */}
        <section className="min-w-0 space-y-4 border-b px-4 py-4 sm:px-5 lg:overflow-y-auto lg:border-b-0 lg:border-r">
          {/* Meta strip */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
            {problem.stats.percentage !== null && (
              <span className="inline-flex items-center gap-1">
                <span className="font-bold text-primary">{problem.stats.percentage}%</span>
                <span>
                  {t(L.passRate, locale)} ({problem.stats.passed}/{problem.stats.attempt})
                </span>
              </span>
            )}
            {problem.expireLabel && (
              <span className="inline-flex items-center gap-1">
                <Clock className="size-3" />
                {t(L.expires, locale)} {problem.expireLabel}
              </span>
            )}
            {problem.limits?.timeoutSec != null && (
              <span className="inline-flex items-center gap-1 font-mono">
                <Cpu className="size-3" />
                {problem.limits.timeoutSec}s · {problem.limits.memoryKb?.toLocaleString()} KB
              </span>
            )}
          </div>

          {/* Key takeaways */}
          {takeawayPoints.length > 0 && (
            <div className="rounded-2xl border bg-muted/20 p-4">
              <h3 className="mb-2.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-foreground">
                <Lightbulb className="size-3.5 text-primary" />
                {t(L.takeaway, locale)}
              </h3>
              <ul className="space-y-2 text-xs leading-relaxed">
                {takeawayPoints.map((pt, i) => (
                  <li key={pt.tag} className="flex items-start gap-2.5">
                    <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-primary font-mono text-[10px] font-bold text-primary-foreground">
                      {i + 1}
                    </span>
                    <span className="text-foreground/90">{t(pt, locale)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Pitfalls */}
          {problem.pitfalls.length > 0 && (
            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/[0.06] p-4">
              <h3 className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-300">
                <TriangleAlert className="size-3.5" />
                {t(L.pitfalls, locale)}
              </h3>
              <ul className="space-y-1.5 text-xs leading-relaxed text-amber-900/90 dark:text-amber-200/90">
                {problem.pitfalls.map((pf, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-1.5 size-1 shrink-0 rounded-full bg-amber-500" />
                    <span>{t(pf, locale)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Author note */}
          {problem.note && (
            <div className="rounded-2xl border bg-card p-4">
              <h3 className="mb-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-foreground">
                <FileText className="size-3.5 text-primary" />
                {t(L.authorNote, locale)}
              </h3>
              <p className="text-xs leading-relaxed text-muted-foreground">{problem.note}</p>
            </div>
          )}

          {/* Statement */}
          {problem.statement ? (
            <div className="space-y-3">
              <div className="rounded-2xl border bg-card p-4">
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-foreground">
                  {t(L.statement, locale)}
                </h3>
                <div className="text-sm">
                  <MdView markdown={problem.statement.description} />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border bg-card p-4">
                  <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-foreground">
                    {t(L.inputSpec, locale)}
                  </h3>
                  <div className="text-xs">
                    <MdView markdown={problem.statement.inputSpec} />
                  </div>
                </div>
                <div className="rounded-2xl border bg-card p-4">
                  <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-foreground">
                    {t(L.outputSpec, locale)}
                  </h3>
                  <div className="text-xs">
                    <MdView markdown={problem.statement.outputSpec} />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed p-5 text-center">
              <p className="text-xs leading-relaxed text-muted-foreground">
                {t(L.noStatement, locale)}
              </p>
              <Button asChild size="sm" variant="outline" className="mt-3 gap-1 rounded-full text-xs">
                <a href={problem.url} target="_blank" rel="noreferrer">
                  {t(L.onIJudge, locale)}
                  <ExternalLink className="size-3" />
                </a>
              </Button>
            </div>
          )}

        </section>

        {/* Right: the live grader */}
        <section className="min-w-0 space-y-3 bg-muted/[0.15] px-4 py-4 sm:px-5 lg:overflow-y-auto">
          {hasCases ? (
            <CodeGrader
              problemId={problem.id}
              problemName={problem.cleanName}
              cases={allCases}
              onReport={handleReport}
              compact
            />
          ) : (
            <ScratchRunner problemId={problem.id} />
          )}

          {/* Wizard hand-off — same ?problem= contract the wizards read. */}
          <div className="flex flex-wrap items-center gap-2 rounded-2xl border bg-card p-3.5 shadow-xs">
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
