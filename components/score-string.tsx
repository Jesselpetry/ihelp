"use client";

import { Check, X, Clock, AlertTriangle } from "lucide-react";
import type { CaseResult, CaseStatus } from "@/lib/grader-types";
import { Badge } from "@/components/ui/badge";
import { useLocale, t, type LText } from "@/lib/i18n";

const L: Record<string, LText> = {
  passed: { th: "ผ่าน", en: "passed" },
};

const STATUS_META: Record<
  CaseStatus,
  {
    icon: typeof Check;
    className: string;
    label: LText;
  }
> = {
  P: {
    icon: Check,
    className: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30",
    label: { th: "ผ่าน", en: "Passed" },
  },
  "-": {
    icon: X,
    className: "bg-destructive/15 text-destructive border border-destructive/30",
    label: { th: "คำตอบผิด", en: "Wrong Answer" },
  },
  T: {
    icon: Clock,
    className: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30",
    label: { th: "หมดเวลา", en: "Time Limit Exceeded" },
  },
  E: {
    icon: AlertTriangle,
    className: "bg-rose-600/15 text-rose-600 dark:text-rose-400 border border-rose-600/30",
    label: { th: "ข้อผิดพลาดขณะรัน", en: "Runtime Error" },
  },
};

/**
 * Renders an iJudge-style score string (e.g. "PPPP-") as individual
 * color-coded badges, plus a plain-language pass-count summary line.
 */
export function ScoreString({ results }: { results: CaseResult[] }) {
  const { locale } = useLocale();
  const passed = results.filter((r) => r.status === "P").length;
  const total = results.length;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-1.5">
        {results.map((r) => {
          const meta = STATUS_META[r.status];
          const Icon = meta.icon;
          return (
            <Badge
              key={r.caseId}
              className={`rounded-full px-2 py-0.5 gap-1 shadow-none font-mono ${meta.className}`}
              title={t(meta.label, locale)}
            >
              <Icon className="size-3" />
              <span>{r.status}</span>
            </Badge>
          );
        })}
      </div>
      <p className="text-sm font-medium text-foreground">
        {passed}/{total} {t(L.passed, locale)}
      </p>
    </div>
  );
}
