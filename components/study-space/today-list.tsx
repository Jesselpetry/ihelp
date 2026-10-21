"use client";

import Link from "next/link";
import { CalendarClock, ChevronLeft, ChevronRight, Timer } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocale, t } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { SUBJECTS } from "@/lib/study-space/subjects";
import { href } from "@/lib/study-space/links";
import { dayHours, taskResources } from "@/lib/study-space/plan";
import { formatDay } from "@/lib/study-space/dates";
import { formatHours, formatMinutes, loggedMinutes, ratio } from "@/lib/study-space/progress";
import { unitById } from "@/lib/study-space/units";
import type { DailyPlan, StudyTask, SubjectCode } from "@/lib/study-space/types";
import { useStudySpace } from "./context";
import { DoneToggle, ProgressBar, ResourceLink, SubjectTag } from "./primitives";
import { fill, L } from "./strings";
import { CHROME } from "./timer-parts";

/**
 * What to read on the selected day, one row per course.
 *
 *   expanded   (dashboard)  every row open — key points, progress, links —
 *                           with a "จับเวลาวิชานี้" button on the rows the
 *                           timer is not on
 *   accordion  (focus mode) only the row the timer is on is open, the rest
 *                           stay one line each so the list reads at a glance
 *                           from across a desk; opening another row aims the
 *                           timer at it unless a focus block is running
 */
export function TodayList({
  variant,
  day,
  isToday,
  timingSubject,
  openTaskId,
  onOpenTask,
  onTimeTask,
  prevDate,
  nextDate,
  onSelectDate,
}: {
  variant: "expanded" | "accordion";
  day: DailyPlan;
  isToday: boolean;
  timingSubject: SubjectCode;
  /** accordion only */
  openTaskId?: string | null;
  /** accordion only */
  onOpenTask?: (task: StudyTask) => void;
  /** expanded only */
  onTimeTask?: (task: StudyTask) => void;
  prevDate?: string;
  nextDate?: string;
  onSelectDate: (date: string) => void;
}) {
  const { locale } = useLocale();
  const { data } = useStudySpace();
  const f = formatDay(day.date, locale);
  const allDone = day.tasks.length > 0 && day.tasks.every((task) => data.completedTasks[task.id]);
  const headingId = `today-heading-${variant}`;

  return (
    <section
      aria-labelledby={headingId}
      className={cn(variant === "accordion" && "w-full lg:max-h-[calc(100dvh-8rem)] lg:overflow-y-auto lg:p-1")}
    >
      <header className="mb-3 flex items-center gap-2">
        <h2 id={headingId} className="min-w-0 flex-1 text-lg font-semibold">
          {isToday ? t(L.todayHeading, locale) : fill(t(L.dayHeading, locale), { d: `${f.day} ${f.month}` })}
        </h2>
        <span className="text-xs tabular-nums text-muted-foreground">
          {fill(t(L.dayTarget, locale), { h: formatHours(dayHours(day)) })}
        </span>
        <div className={cn("flex", CHROME)}>
          <Button
            variant="ghost"
            size="icon-sm"
            disabled={!prevDate}
            onClick={() => prevDate && onSelectDate(prevDate)}
            aria-label={t(L.prevDay, locale)}
            title={t(L.prevDay, locale)}
          >
            <ChevronLeft />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            disabled={!nextDate}
            onClick={() => nextDate && onSelectDate(nextDate)}
            aria-label={t(L.nextDay, locale)}
            title={t(L.nextDay, locale)}
          >
            <ChevronRight />
          </Button>
        </div>
      </header>

      {day.exam && <ExamNote code={day.exam} isToday={isToday} />}

      <ol className={cn(variant === "expanded" ? "space-y-3" : "space-y-2")}>
        {day.tasks.map((task) => (
          <TaskRow
            key={task.id}
            task={task}
            date={day.date}
            variant={variant}
            open={variant === "expanded" || task.id === openTaskId}
            timing={task.subject === timingSubject}
            onOpen={() => onOpenTask?.(task)}
            onTime={() => onTimeTask?.(task)}
          />
        ))}
      </ol>

      {allDone && <p className="mt-3 text-center text-sm text-muted-foreground">{t(L.allDone, locale)}</p>}
    </section>
  );
}

function TaskRow({
  task,
  date,
  variant,
  open,
  timing,
  onOpen,
  onTime,
}: {
  task: StudyTask;
  date: string;
  variant: "expanded" | "accordion";
  open: boolean;
  timing: boolean;
  onOpen: () => void;
  onTime: () => void;
}) {
  const { locale } = useLocale();
  const { data, store } = useStudySpace();
  const done = !!data.completedTasks[task.id];
  const logged = loggedMinutes(data, date, task.subject);
  const target = task.hours * 60;
  const units = task.units.map(unitById).filter((u) => u !== undefined);
  const unitLabel =
    units.length === 0
      ? null
      : units.length === 1
        ? t(units[0].label, locale)
        : `${t(units[0].label, locale)}–${units[units.length - 1].week}`;
  const panelId = `task-${variant}-${task.id}`;
  const highlighted = variant === "expanded" ? timing : open;

  const meta = (
    <>
      <span className="flex items-center gap-2 text-xs text-muted-foreground">
        <SubjectTag code={task.subject} className="text-foreground" />
        {unitLabel && <span className="truncate">{unitLabel}</span>}
        {timing && (variant === "expanded" || open) && (
          <span className="inline-flex shrink-0 items-center gap-1 text-primary">
            <span aria-hidden className="size-1.5 rounded-full bg-primary" />
            {t(L.timing, locale)}
          </span>
        )}
        <span className="ml-auto shrink-0 tabular-nums">
          {formatMinutes(logged, locale)} / {formatHours(task.hours)} {t(L.hoursShort, locale)}
        </span>
      </span>
      <span
        className={cn("mt-1 block font-semibold leading-snug", done && "text-muted-foreground line-through decoration-1")}
      >
        {t(task.title, locale)}
      </span>
    </>
  );

  return (
    <li className={cn("rounded-2xl border bg-card transition-colors", highlighted && "border-primary/40")}>
      <div className="flex items-start gap-3 p-4">
        <DoneToggle
          done={done}
          onToggle={() => store.toggleDone(task.id)}
          label={`${t(done ? L.markedDone : L.markDone, locale)} — ${t(task.title, locale)}`}
          className="mt-0.5"
        />
        {variant === "accordion" ? (
          <button
            type="button"
            onClick={onOpen}
            aria-expanded={open}
            aria-controls={panelId}
            className="min-w-0 flex-1 rounded-md text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          >
            {meta}
          </button>
        ) : (
          <div className="min-w-0 flex-1">{meta}</div>
        )}
        {variant === "expanded" && !timing && (
          <Button variant="outline" size="sm" onClick={onTime} className="shrink-0 rounded-full" title={t(L.timeThis, locale)}>
            <Timer />
            <span className="hidden sm:inline">{t(L.timeThis, locale)}</span>
          </Button>
        )}
      </div>

      {open && (
        <div
          id={panelId}
          className={cn(
            "px-4 pb-4 sm:pl-12",
            variant === "expanded"
              ? "grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,15rem)]"
              : "space-y-4",
          )}
        >
          <div className={variant === "expanded" ? "space-y-3" : "space-y-4"}>
            <ProgressBar
              value={ratio(logged, target)}
              barClassName={SUBJECTS[task.subject].accent.bar}
              label={t(task.title, locale)}
            />
            <div>
              <h3 className="mb-1.5 text-xs font-medium text-muted-foreground">{t(L.keyPoints, locale)}</h3>
              <ul className="space-y-1.5 text-sm leading-relaxed">
                {task.keyPoints.map((point) => (
                  <li key={point} className="flex gap-2">
                    <span aria-hidden className="mt-2 size-1 shrink-0 rounded-full bg-muted-foreground/60" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="flex flex-wrap content-start gap-1.5">
            {taskResources(task).map((r) => (
              <ResourceLink key={r.href} resource={r} variant="chip" />
            ))}
            <Link
              href={href.hub(task.subject)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-full px-2 py-1.5 text-xs font-medium text-primary hover:underline"
            >
              {t(L.openCourse, locale)} {SUBJECTS[task.subject].shortName} →
            </Link>
          </div>
        </div>
      )}
    </li>
  );
}

function ExamNote({ code, isToday }: { code: SubjectCode; isToday: boolean }) {
  const { locale } = useLocale();
  const s = SUBJECTS[code];
  return (
    <div className="mb-2 flex items-center gap-3 rounded-2xl border border-primary/30 bg-primary/5 px-4 py-3">
      <CalendarClock className="size-4 shrink-0 text-primary" />
      <div className="min-w-0 flex-1 text-sm">
        <span className="font-semibold">
          {fill(t(isToday ? L.examToday : L.examThatDay, locale), { c: s.shortName })}
        </span>
        <span className="text-muted-foreground">
          {" "}
          · <span className="tabular-nums">{s.exam.time}</span> · {s.exam.room ?? t(L.roomPending, locale)}
        </span>
      </div>
      <Link
        href={href.examSchedule()}
        target="_blank"
        rel="noopener noreferrer"
        className="shrink-0 text-xs font-medium text-primary hover:underline"
      >
        {t(L.seeTimetable, locale)}
      </Link>
    </div>
  );
}
