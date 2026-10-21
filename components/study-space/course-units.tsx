"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocale, t } from "@/lib/i18n";
import { SUBJECTS, SUBJECT_ORDER } from "@/lib/study-space/subjects";
import { href } from "@/lib/study-space/links";
import { plannedOn } from "@/lib/study-space/plan";
import { formatDay } from "@/lib/study-space/dates";
import { ratio } from "@/lib/study-space/progress";
import { unitsFor } from "@/lib/study-space/units";
import type { SubjectCode } from "@/lib/study-space/types";
import { useStudySpace } from "./context";
import { DoneToggle, ProgressBar, ResourceLink, Segmented, SubjectDot } from "./primitives";
import { fill, L } from "./strings";

/**
 * The final scope course by course, week by week — a checklist that does
 * not depend on the day plan, for studying in your own order.
 */
export function CourseUnits({
  subject,
  onSubjectChange,
  onOpenDay,
}: {
  subject: SubjectCode;
  onSubjectChange: (code: SubjectCode) => void;
  onOpenDay: (date: string) => void;
}) {
  const { locale } = useLocale();
  const { plan, data, store } = useStudySpace();
  const planned = useMemo(() => plannedOn(plan), [plan]);
  const units = unitsFor(subject);
  const done = units.filter((u) => data.completedTasks[u.id]).length;
  const s = SUBJECTS[subject];

  return (
    <div className="space-y-3">
      <Segmented<SubjectCode>
        label={t(L.courseLabel, locale)}
        value={subject}
        onChange={onSubjectChange}
        className="w-full"
        options={SUBJECT_ORDER.map((code) => ({
          value: code,
          label: (
            <>
              <SubjectDot code={code} />
              {SUBJECTS[code].shortName}
            </>
          ),
        }))}
      />

      <div className="rounded-xl border bg-card p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="text-xs text-muted-foreground">
              {s.officialCode} · {t(L.finalScope, locale)}
            </div>
            <div className="text-sm font-semibold">{t(s.name, locale)}</div>
          </div>
          <Link
            href={href.hub(subject)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-0.5 text-xs font-medium text-primary hover:underline"
          >
            {t(L.openCourse, locale)}
            <ArrowUpRight className="size-3" />
          </Link>
        </div>
        <div className="mt-2.5 flex items-center gap-2">
          <ProgressBar value={ratio(done, units.length)} barClassName={s.accent.bar} label={s.shortName} />
          <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
            {fill(t(L.unitsDone, locale), { d: done, t: units.length })}
          </span>
        </div>
      </div>

      <ol className="divide-y overflow-hidden rounded-xl border bg-card">
        {units.map((unit) => {
          const isDone = !!data.completedTasks[unit.id];
          const days = planned[unit.id] ?? [];
          return (
            <li key={unit.id} className="flex gap-3 p-3">
              <DoneToggle
                done={isDone}
                onToggle={() => store.toggleDone(unit.id)}
                label={`${t(unit.label, locale)} — ${t(unit.topic, locale)}`}
                className="mt-0.5"
              />
              <div className="min-w-0 flex-1">
                <div className="text-xs text-muted-foreground">{t(unit.label, locale)}</div>
                <div className={cn("text-sm font-semibold leading-snug", isDone && "text-muted-foreground line-through decoration-1")}>
                  {t(unit.topic, locale)}
                </div>
                <div className="-mx-2.5 mt-1">
                  {unit.resources.map((r) => (
                    <ResourceLink key={r.href} resource={r} className="py-1.5" />
                  ))}
                </div>
                {days.length > 0 && (
                  <div className="mt-1 flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
                    <span>{t(L.plannedOn, locale)}</span>
                    {days.map((date) => {
                      const f = formatDay(date, locale);
                      return (
                        <button
                          key={date}
                          type="button"
                          onClick={() => onOpenDay(date)}
                          className="rounded-md bg-muted px-1.5 py-0.5 tabular-nums transition-colors hover:bg-primary/10 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                        >
                          {f.day} {f.month}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
