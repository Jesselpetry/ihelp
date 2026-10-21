"use client";

import { cn } from "@/lib/utils";
import { useLocale, t } from "@/lib/i18n";
import { SUBJECTS, SUBJECT_ORDER } from "@/lib/study-space/subjects";
import { dayHours } from "@/lib/study-space/plan";
import { formatDay } from "@/lib/study-space/dates";
import { formatHours, loggedMinutes, ratio, targetMinutes } from "@/lib/study-space/progress";
import type { DailyPlan, StudyPlan, SubjectCode } from "@/lib/study-space/types";
import { useStudySpace } from "./context";
import { DoneToggle, ProgressBar, SubjectDot } from "./primitives";
import { fill, L } from "./strings";

/**
 * The whole plan, grouped by the exam each stretch of days leads up to: a
 * day belongs to the first paper on or after it. Rows open the day.
 */
function blocks(plan: StudyPlan): { exam: SubjectCode; days: DailyPlan[] }[] {
  return SUBJECT_ORDER.map((code, i) => {
    const end = SUBJECTS[code].exam.startsAt.slice(0, 10);
    const start = i === 0 ? "" : SUBJECTS[SUBJECT_ORDER[i - 1]].exam.startsAt.slice(0, 10);
    return { exam: code, days: plan.days.filter((d) => d.date > start && d.date <= end) };
  }).filter((b) => b.days.length > 0);
}

export function PlanBoard({
  selected,
  today,
  onOpenDay,
}: {
  selected: string;
  today: string;
  onOpenDay: (date: string) => void;
}) {
  const { locale } = useLocale();
  const { plan } = useStudySpace();

  return (
    <div className="space-y-5">
      {blocks(plan).map(({ exam, days }) => {
        const hours = days.reduce((s, d) => s + dayHours(d), 0);
        return (
          <section key={exam}>
            <header className="mb-2 flex items-baseline justify-between px-1">
              <h3 className="inline-flex items-center gap-1.5 text-sm font-semibold">
                <SubjectDot code={exam} />
                {fill(t(L.untilExam, locale), { c: SUBJECTS[exam].shortName })}
              </h3>
              <span className="text-xs tabular-nums text-muted-foreground">
                {fill(t(L.daysCount, locale), { n: days.length })} · {formatHours(hours)} {t(L.hoursShort, locale)}
              </span>
            </header>
            <ol className="divide-y overflow-hidden rounded-xl border bg-card">
              {days.map((day) => (
                <DayRow
                  key={day.date}
                  day={day}
                  selected={day.date === selected}
                  isToday={day.date === today}
                  onOpen={() => onOpenDay(day.date)}
                />
              ))}
            </ol>
          </section>
        );
      })}
    </div>
  );
}

function DayRow({
  day,
  selected,
  isToday,
  onOpen,
}: {
  day: DailyPlan;
  selected: boolean;
  isToday: boolean;
  onOpen: () => void;
}) {
  const { locale } = useLocale();
  const { data, store } = useStudySpace();
  const f = formatDay(day.date, locale);
  const logged = loggedMinutes(data, day.date);
  const target = targetMinutes(day);

  // The whole row opens the day through one transparent button laid over it;
  // the done toggles sit above that button, each on its own task's line.
  return (
    <li className={cn("relative flex gap-3 p-3 transition-colors hover:bg-muted/60 has-[>button:focus-visible]:bg-muted/60", selected && "bg-primary/5")}>
      <button
        type="button"
        onClick={onOpen}
        aria-current={selected ? "date" : undefined}
        aria-label={f.long}
        className="absolute inset-0 focus-visible:outline-none"
      />
      <div className="w-10 shrink-0 text-center">
        <div className="text-[10px] uppercase text-muted-foreground">{f.weekday}</div>
        <div className={cn("text-lg font-semibold leading-none tabular-nums", isToday && "text-primary")}>{f.day}</div>
        <div className="text-[10px] text-muted-foreground">{f.month}</div>
      </div>
      <div className="min-w-0 flex-1 space-y-1">
        {day.exam && (
          <div className="text-xs font-semibold text-primary">
            {fill(t(L.examThatDay, locale), { c: SUBJECTS[day.exam].shortName })} · {SUBJECTS[day.exam].exam.time}
          </div>
        )}
        {day.tasks.map((task) => (
          <div key={task.id} className="flex items-center gap-2 text-sm">
            <SubjectDot code={task.subject} />
            <span
              className={cn(
                "min-w-0 flex-1 truncate",
                data.completedTasks[task.id] && "text-muted-foreground line-through decoration-1",
              )}
            >
              {t(task.title, locale)}
            </span>
            <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
              {formatHours(task.hours)} {t(L.hoursShort, locale)}
            </span>
            <DoneToggle
              done={!!data.completedTasks[task.id]}
              onToggle={() => store.toggleDone(task.id)}
              label={`${SUBJECTS[task.subject].shortName} — ${t(task.title, locale)}`}
              className="relative z-10 ml-1"
            />
          </div>
        ))}
        <ProgressBar value={ratio(logged, target)} className="mt-1.5 h-1" label={f.long} />
      </div>
    </li>
  );
}
