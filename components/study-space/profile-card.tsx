"use client";

import Link from "next/link";
import { ArrowRight, Lock, Timer } from "lucide-react";
import { useLocale, t } from "@/lib/i18n";
import { SUBJECTS, SUBJECT_ORDER } from "@/lib/study-space/subjects";
import { formatHours } from "@/lib/study-space/progress";
import type { StudyPlanSummary } from "@/lib/study-space/types";
import { examStatus } from "./exam-countdown";
import { SubjectDot } from "./primitives";
import { fill, L } from "./strings";

/**
 * The way into the study space, on the owner's own profile only. The profile
 * page decides whether to render it (signed-in student = profile = plan
 * owner); this only lays out what the server already summarised. A client
 * component because the copy follows the TH/EN toggle.
 */
export function StudySpaceCard({ href, summary }: { href: string; summary: StudyPlanSummary }) {
  const { locale } = useLocale();
  const next = SUBJECT_ORDER.map((code) => ({ code, ...examStatus(code, summary.today, locale) })).find(
    (e) => e.days >= 0,
  );

  return (
    <Link
      href={href}
      className="group flex items-center gap-4 rounded-2xl border bg-card p-4 transition-colors hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 sm:p-5"
    >
      <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
        <Timer className="size-5" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
          <span className="font-semibold">{t(L.cardTitle, locale)}</span>
          <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
            <Lock className="size-3" />
            {t(L.onlyYou, locale)}
          </span>
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
          {summary.tasks.length === 0 ? (
            <span>{t(L.cardNoTasks, locale)}</span>
          ) : (
            <>
              <span>{t(L.cardToday, locale)}</span>
              {summary.tasks.map((task) => (
                <span key={task.subject} className="inline-flex items-center gap-1 text-foreground">
                  <SubjectDot code={task.subject} />
                  {SUBJECTS[task.subject].shortName}
                  <span className="tabular-nums text-muted-foreground">
                    {formatHours(task.hours)} {t(L.hoursShort, locale)}
                  </span>
                </span>
              ))}
            </>
          )}
          {next && (
            <span className="w-full sm:w-auto sm:before:mr-2 sm:before:content-['·']">
              {fill(t(L.cardNextExam, locale), { c: SUBJECTS[next.code].shortName, when: next.label })}
            </span>
          )}
        </div>
      </div>
      <span className="hidden items-center gap-1 text-sm font-medium text-primary sm:inline-flex">
        {t(L.open, locale)}
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
      </span>
      <ArrowRight className="size-4 shrink-0 text-muted-foreground sm:hidden" />
    </Link>
  );
}
