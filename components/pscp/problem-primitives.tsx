"use client";

import Link from "next/link";
import { Check, Code2, Clock, ExternalLink, PanelsTopLeft, Star, TriangleAlert } from "lucide-react";
import type { PscpProblem } from "@/lib/pscp";
import type { PscpProgress } from "@/lib/pscp-client";
import { Button } from "@/components/ui/button";
import { t, type LText, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/**
 * Shared strings for the redesigned problem card/row. Kept separate from the
 * `L` record in problems-view.tsx so the primitives can be used without
 * threading a dozen labels through props.
 */
export const PL: Record<string, LText> = {
  solved: { th: "ผ่านแล้ว", en: "Solved" },
  inProgress: { th: "กำลังฝึก", en: "In progress" },
  expired: { th: "หมดเขตแล้ว", en: "Expired" },
  cases: { th: "เคส", en: "cases" },
  noCases: { th: "ไม่มีเคส", en: "no cases" },
  due: { th: "ถึง", en: "due" },
  open: { th: "เปิด", en: "Open" },
  openOnIjudge: { th: "เปิดโจทย์บน iJudge", en: "Open on iJudge" },
  quickPeek: { th: "ดูแบบเร็ว (ป๊อปอัป)", en: "Quick view (popup)" },
  makeSubmission: { th: "สร้าง submission.md", en: "Make submission.md" },
  makeReflection: { th: "สร้าง ai_reflection.md", en: "Make ai_reflection.md" },
  editOnRepo: { th: "เปิดแก้ไฟล์นี้ใน repo", en: "Open this file in the repo editor" },
  markSolved: { th: "ทำเครื่องหมายว่าผ่านแล้ว", en: "Mark as solved" },
  markUnsolved: { th: "ยกเลิกเครื่องหมายผ่าน", en: "Unmark solved" },
  difficulty: { th: "ความยาก", en: "Difficulty" },
  learningLog: { th: "Learning Log", en: "Learning Log" },
  recommended: { th: "แนะนำ", en: "Recommended" },
};

/** A problem is past due once its parsed deadline is behind `now`. */
export function isExpired(p: PscpProblem, now: Date): boolean {
  if (!p.expireIso) return false;
  const due = new Date(p.expireIso);
  return !Number.isNaN(due.getTime()) && due < now;
}

export type ProblemState = "solved" | "progress" | "expired" | "idle";

/** Collapses the four boolean-ish signals into the one state the UI shows. */
export function problemState(
  solved: boolean,
  attempt: PscpProgress[number] | undefined,
  expired: boolean,
): ProblemState {
  if (solved) return "solved";
  if (expired) return "expired";
  if (attempt && attempt.total > 0) return "progress";
  return "idle";
}

const DOT_TONE: Record<Exclude<ProblemState, "idle">, string> = {
  solved: "bg-emerald-500",
  progress: "bg-amber-500",
  expired: "bg-destructive",
};

const TEXT_TONE: Record<Exclude<ProblemState, "idle">, string> = {
  solved: "text-emerald-600 dark:text-emerald-400",
  progress: "text-amber-600 dark:text-amber-400",
  expired: "text-destructive",
};

/**
 * The card's single state signal. Replaces the old stack of solved / attempt /
 * expired pills: one dot, one label, three possible colours. `idle` renders
 * nothing at all, so an untouched problem stays visually quiet.
 */
export function StatusDot({
  state,
  attempt,
  locale,
  labelled = true,
  className,
}: {
  state: ProblemState;
  attempt?: PscpProgress[number] | undefined;
  locale: Locale;
  /** Dot-only (table status column) when false. */
  labelled?: boolean;
  className?: string;
}) {
  if (state === "idle") {
    return labelled ? null : <span className={cn("size-1.5 rounded-full bg-border", className)} />;
  }

  const label =
    state === "progress" && attempt
      ? `${attempt.passed}/${attempt.total}`
      : t(state === "solved" ? PL.solved : state === "expired" ? PL.expired : PL.inProgress, locale);

  if (!labelled) {
    return (
      <span
        title={label}
        className={cn("size-1.5 shrink-0 rounded-full", DOT_TONE[state], className)}
      />
    );
  }

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 text-xs font-medium",
        TEXT_TONE[state],
        className,
      )}
    >
      <span className={cn("size-1.5 rounded-full", DOT_TONE[state])} />
      <span className="tabular-nums">{label}</span>
    </span>
  );
}

/**
 * Five stars — filled up to `value`, outline for the rest. One component so the
 * card and table always agree on the difficulty scale.
 */
export function DifficultyMeter({ value, className }: { value: number; className?: string }) {
  const label = `${PL.difficulty.en} ${Math.max(value, 0)}/5`;
  return (
    <span
      className={cn("inline-flex shrink-0 items-center gap-0.5", className)}
      title={label}
      aria-label={label}
    >
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={cn(
            "size-3 transition-colors",
            i < value
              ? "fill-amber-400 text-amber-400"
              : "fill-transparent text-border",
          )}
        />
      ))}
    </span>
  );
}

/**
 * "11 September 2026, 00:00" -> "11 Sep 2026". The clock time is never the
 * deciding factor when scanning a list, and the full month name crowds the
 * footer; the exact value stays available in the workspace drawer.
 */
export function shortDate(label: string): string {
  if (!label) return label;
  const m = label.match(/^(\d{1,2})\s+([A-Za-z]{3})[a-z]*\s+(\d{4})/);
  return m ? `${m[1]} ${m[2]} ${m[3]}` : label.replace(/,\s*\d{1,2}:\d{2}.*$/, "");
}

/** Icon + mono text. The card/row footer is built entirely from these. */
export function MetaItem({
  icon: Icon,
  children,
  tone,
  className,
}: {
  icon: typeof Clock;
  children: React.ReactNode;
  tone?: "default" | "destructive";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-xs",
        tone === "destructive" ? "font-medium text-destructive" : "text-muted-foreground",
        className,
      )}
    >
      <Icon className="size-3.5 shrink-0" />
      <span className="tabular-nums">{children}</span>
    </span>
  );
}

/** Case count + deadline, the two facts worth keeping on the card face. */
export function ProblemMeta({
  problem,
  expired,
  locale,
  className,
}: {
  problem: PscpProblem;
  expired: boolean;
  locale: Locale;
  className?: string;
}) {
  return (
    <div className={cn("flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1", className)}>
      <MetaItem icon={Code2}>
        {problem.cases.length > 0
          ? `${problem.cases.length} ${t(PL.cases, locale)}`
          : t(PL.noCases, locale)}
      </MetaItem>
      {problem.expireLabel && (
        <MetaItem
          icon={expired ? TriangleAlert : Clock}
          tone={expired ? "destructive" : "default"}
        >
          {expired ? t(PL.expired, locale) : `${t(PL.due, locale)} ${shortDate(problem.expireLabel)}`}
        </MetaItem>
      )}
    </div>
  );
}

/**
 * Secondary actions. Always visible — one row of markup, no per-breakpoint
 * duplication.
 */
export function ProblemActions({
  problem,
  solved,
  hasSub,
  hasRefl,
  onOpen,
  onToggleSolved,
  locale,
  className,
}: {
  problem: PscpProblem;
  solved: boolean;
  hasSub: boolean;
  hasRefl: boolean;
  onOpen: () => void;
  onToggleSolved: () => void;
  locale: Locale;
  className?: string;
}) {
  return (
    <div
      className={cn("flex items-center gap-0.5", className)}
    >
      {hasSub && (
        <Button asChild size="sm" variant="ghost" className="size-8 rounded-lg p-0">
          <Link
            href={`/repo?path=oj${problem.id}/submission.md`}
            title={`submission.md — ${t(PL.editOnRepo, locale)}`}
          >
            <Check className="size-3.5 text-emerald-600 dark:text-emerald-400" />
          </Link>
        </Button>
      )}
      {hasRefl && (
        <Button asChild size="sm" variant="ghost" className="size-8 rounded-lg p-0">
          <Link
            href={`/repo?path=oj${problem.id}/ai_reflection.md`}
            title={`ai_reflection.md — ${t(PL.editOnRepo, locale)}`}
          >
            <Check className="size-3.5 text-emerald-600 dark:text-emerald-400" />
          </Link>
        </Button>
      )}
      <Button
        type="button"
        size="sm"
        variant="ghost"
        onClick={onToggleSolved}
        title={t(solved ? PL.markUnsolved : PL.markSolved, locale)}
        aria-pressed={solved}
        className="size-8 cursor-pointer rounded-lg p-0"
      >
        <Check
          className={cn(
            "size-3.5",
            solved ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground",
          )}
        />
      </Button>
      <Button
        type="button"
        size="sm"
        variant="ghost"
        onClick={onOpen}
        title={t(PL.quickPeek, locale)}
        className="size-8 cursor-pointer rounded-lg p-0"
      >
        <PanelsTopLeft className="size-3.5 text-muted-foreground" />
      </Button>
      <Button asChild size="sm" variant="ghost" className="size-8 rounded-lg p-0">
        {/* iJudge deep link, carried through from the export unchanged. */}
        <a href={problem.url} target="_blank" rel="noreferrer" title={t(PL.openOnIjudge, locale)}>
          <ExternalLink className="size-3.5 text-muted-foreground" />
        </a>
      </Button>
    </div>
  );
}
