"use client";

import Link from "next/link";
import { ArrowLeft, Lock, Maximize2, Settings2 } from "lucide-react";
import { useLocale, t } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { formatDay } from "@/lib/study-space/dates";
import { planHours } from "@/lib/study-space/plan";
import { formatHours, tasksDone, totalLoggedMinutes } from "@/lib/study-space/progress";
import type { DailyPlan, StudyTask, SubjectCode } from "@/lib/study-space/types";
import { useStudySpace } from "./context";
import { CourseUnits } from "./course-units";
import { DayStrip } from "./day-strip";
import { ExamCountdown } from "./exam-countdown";
import { PlanBoard } from "./plan-board";
import { Segmented, Stat } from "./primitives";
import { SessionLog } from "./session-log";
import { SettingsDialog } from "./settings-dialog";
import { fill, L } from "./strings";
import { TimerCard } from "./timer-parts";
import { TodayList } from "./today-list";
import type { StudyTimer } from "./use-study-timer";

export type DashboardTab = "today" | "plan" | "courses" | "log";
export const DASHBOARD_TABS: DashboardTab[] = ["today", "plan", "courses", "log"];

/**
 * The everyday view: everything at once, laid out to scan top to bottom.
 *
 *   header        back to profile · plan name 🔒 · the day · totals · settings · โหมดโฟกัส
 *   exams         four countdown cards with each course's logged hours
 *   day strip     the whole plan, one column per day
 *   ┌ timer ┐ ┌ tabs: วันนี้ | แผนทั้งหมด | รายวิชา | บันทึกเวลา ┐
 *   └ quota ┘ └───────────────────────────────────────────────┘
 *
 * โหมดโฟกัส (or F) lays the minimal timer over all of it — see focus-mode.tsx.
 */
export function Dashboard({
  profileHref,
  today,
  day,
  index,
  pinned,
  timer,
  tab,
  onTabChange,
  course,
  onCourseChange,
  onSelectDay,
  onBackToToday,
  onOpenDay,
  onSubjectChange,
  onTimeTask,
  onEnterFocus,
  settingsOpen,
  onSettingsOpenChange,
}: {
  profileHref: string;
  today: string;
  day: DailyPlan;
  index: number;
  pinned: boolean;
  timer: StudyTimer;
  tab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
  course: SubjectCode;
  onCourseChange: (code: SubjectCode) => void;
  /** Change the day, staying on the current tab. */
  onSelectDay: (date: string) => void;
  onBackToToday: () => void;
  /** Change the day and show it (from the plan or course tabs). */
  onOpenDay: (date: string) => void;
  onSubjectChange: (code: SubjectCode) => void;
  onTimeTask: (task: StudyTask) => void;
  onEnterFocus: () => void;
  settingsOpen: boolean;
  onSettingsOpenChange: (open: boolean) => void;
}) {
  const { locale } = useLocale();
  const { plan, data } = useStudySpace();
  const f = formatDay(day.date, locale);
  const done = tasksDone(data, plan);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-4 sm:px-6 sm:pt-6">
      <Link
        href={profileHref}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"
      >
        <ArrowLeft className="size-4" />
        {t(L.backToProfile, locale)}
      </Link>

      <header className="mt-3 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="min-w-0">
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-medium text-primary">
            {t(plan.title, locale)}
            <span className="inline-flex items-center gap-1 font-normal text-muted-foreground">
              <Lock className="size-3" />
              {t(L.onlyYou, locale)}
            </span>
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">{t(L.appName, locale)}</h1>
          <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
            <span>{f.long}</span>
            <span className="tabular-nums">· {fill(t(L.dayOf, locale), { n: index + 1, t: plan.days.length })}</span>
            {pinned && (
              <button
                type="button"
                onClick={onBackToToday}
                className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary transition-colors hover:bg-primary/15"
              >
                {t(L.backToToday, locale)}
              </button>
            )}
          </p>
        </div>

        <div className="flex flex-wrap items-end gap-x-5 gap-y-3">
          <Stat
            label={t(L.logged, locale)}
            value={formatHours(totalLoggedMinutes(data) / 60)}
            sub={`/ ${formatHours(planHours(plan))} ${t(L.hoursShort, locale)}`}
          />
          <Stat label={t(L.tasksDone, locale)} value={done.done} sub={`/ ${done.total}`} />
          <div className="flex items-center gap-2">
            <SettingsDialog
              trigger={
                <Button
                  variant="outline"
                  size="icon"
                  className="size-9 rounded-full"
                  aria-label={t(L.settings, locale)}
                  title={t(L.settings, locale)}
                >
                  <Settings2 />
                </Button>
              }
              open={settingsOpen}
              onOpenChange={onSettingsOpenChange}
            />
            <Button onClick={onEnterFocus} className="h-9 rounded-full px-4" title={`${t(L.focusMode, locale)} (F)`}>
              <Maximize2 />
              {t(L.focusMode, locale)}
            </Button>
          </div>
        </div>
      </header>

      <div className="mt-6 space-y-3">
        <ExamCountdown today={today} className="md:grid-cols-4" />
        <DayStrip selected={day.date} today={today} onSelect={onSelectDay} />
      </div>

      <div className="mt-6 grid items-start gap-6 lg:grid-cols-[22rem_minmax(0,1fr)]">
        <aside className="lg:sticky lg:top-24">
          <TimerCard timer={timer} day={day} onSubjectChange={onSubjectChange} onEnterFocus={onEnterFocus} />
        </aside>

        <section className="min-w-0 space-y-4">
          <Segmented<DashboardTab>
            label={t(L.viewLabel, locale)}
            value={tab}
            onChange={onTabChange}
            className="w-full sm:w-auto"
            options={[
              { value: "today", label: t(L.tabToday, locale) },
              { value: "plan", label: t(L.tabPlan, locale) },
              { value: "courses", label: t(L.tabCourses, locale) },
              { value: "log", label: t(L.tabLog, locale) },
            ]}
          />

          {tab === "today" && (
            <TodayList
              variant="expanded"
              day={day}
              isToday={day.date === today}
              timingSubject={timer.subject}
              onTimeTask={onTimeTask}
              prevDate={plan.days[index - 1]?.date}
              nextDate={plan.days[index + 1]?.date}
              onSelectDate={onSelectDay}
            />
          )}
          {tab === "plan" && <PlanBoard selected={day.date} today={today} onOpenDay={onOpenDay} />}
          {tab === "courses" && <CourseUnits subject={course} onSubjectChange={onCourseChange} onOpenDay={onOpenDay} />}
          {tab === "log" && <SessionLog key={day.date} date={day.date} defaultSubject={timer.subject} />}
        </section>
      </div>
    </div>
  );
}
