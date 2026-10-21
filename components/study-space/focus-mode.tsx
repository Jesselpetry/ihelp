"use client";

import { useEffect, useRef } from "react";
import { Expand, Minimize2, PanelRightClose, PanelRightOpen, Settings2, Shrink } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocale, t } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { bangkokClock, formatDay } from "@/lib/study-space/dates";
import type { DailyPlan, StudyTask, SubjectCode } from "@/lib/study-space/types";
import { useStudySpace } from "./context";
import { SettingsDialog } from "./settings-dialog";
import { fill, L } from "./strings";
import { CHROME, TimerHero } from "./timer-parts";
import { TodayList } from "./today-list";
import type { StudyTimer } from "./use-study-timer";

/**
 * The minimal view, laid over the dashboard and filling the browser window —
 * not the browser's own full screen, which stays one optional button away.
 *
 *   top bar   leave · the day · clock · list on/off · settings · full screen
 *   body      the timer, with today's list beside it or the timer alone
 *
 * After five seconds without input everything but the dial, its caption,
 * the day's total and the list fades, cursor included (use-standby.ts). Esc
 * leaves, as F does from either view.
 *
 * Built like components/preview-modal.tsx: a fixed `role="dialog"` layer that
 * locks the page scroll and closes on Esc. It sits at z-40, under the z-50
 * dialogs, so settings still open on top of it.
 */
export function FocusMode({
  now,
  today,
  day,
  index,
  pinned,
  timer,
  idle,
  showList,
  onToggleList,
  openTaskId,
  onOpenTask,
  onSelectDay,
  onBackToToday,
  onSubjectChange,
  onExit,
  fullscreen,
  settingsOpen,
  onSettingsOpenChange,
}: {
  now: number;
  today: string;
  day: DailyPlan;
  index: number;
  pinned: boolean;
  timer: StudyTimer;
  idle: boolean;
  showList: boolean;
  onToggleList: () => void;
  openTaskId: string | null;
  onOpenTask: (task: StudyTask) => void;
  onSelectDay: (date: string) => void;
  onBackToToday: () => void;
  onSubjectChange: (code: SubjectCode) => void;
  onExit: () => void;
  fullscreen: { can: boolean; active: boolean; toggle: () => void };
  settingsOpen: boolean;
  onSettingsOpenChange: (open: boolean) => void;
}) {
  const { locale } = useLocale();
  const { plan } = useStudySpace();
  const rootRef = useRef<HTMLDivElement>(null);
  const exitRef = useRef(onExit);
  useEffect(() => {
    exitRef.current = onExit;
  });

  // Lock the page behind, take focus, and hand it back on the way out.
  useEffect(() => {
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    rootRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape" || e.defaultPrevented || document.fullscreenElement) return;
      // Esc belongs to a dialog or menu opened on top of focus mode first.
      if (document.querySelector("[role=dialog][data-state=open], [role=menu][data-state=open]")) return;
      exitRef.current();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, []);

  const f = formatDay(day.date, locale);

  return (
    <div
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      aria-label={t(L.focusMode, locale)}
      data-focus-mode
      data-idle={idle ? "true" : undefined}
      tabIndex={-1}
      className={cn(
        "group/focus fixed inset-0 z-40 flex flex-col overflow-y-auto bg-background outline-none",
        "animate-in fade-in-0 duration-200",
        idle && "cursor-none",
      )}
    >
      <header className={cn("flex h-14 shrink-0 items-center gap-1 px-2 sm:gap-2 sm:px-4", CHROME)}>
        <Button variant="ghost" size="sm" onClick={onExit} title={`${t(L.exitFocus, locale)} (Esc)`}>
          <Minimize2 />
          <span className="hidden sm:inline">{t(L.exitFocus, locale)}</span>
        </Button>

        <div className="flex min-w-0 flex-1 items-center justify-center gap-2 text-sm sm:justify-start">
          <span className="truncate font-medium">{f.long}</span>
          <span className="hidden shrink-0 text-xs tabular-nums text-muted-foreground sm:inline">
            {fill(t(L.dayOf, locale), { n: index + 1, t: plan.days.length })}
          </span>
          {pinned && (
            <button
              type="button"
              onClick={onBackToToday}
              className="shrink-0 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary transition-colors hover:bg-primary/15"
            >
              {t(L.backToToday, locale)}
            </button>
          )}
        </div>

        <span className="hidden px-2 text-sm tabular-nums text-muted-foreground md:inline">{bangkokClock(now, locale)}</span>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onToggleList}
          aria-pressed={showList}
          aria-label={t(showList ? L.hideList : L.showList, locale)}
          title={t(showList ? L.hideList : L.showList, locale)}
        >
          {showList ? <PanelRightClose /> : <PanelRightOpen />}
        </Button>
        <SettingsDialog
          trigger={
            <Button variant="ghost" size="icon-sm" aria-label={t(L.settings, locale)} title={t(L.settings, locale)}>
              <Settings2 />
            </Button>
          }
          open={settingsOpen}
          onOpenChange={onSettingsOpenChange}
        />
        {fullscreen.can && (
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={fullscreen.toggle}
            aria-label={t(fullscreen.active ? L.exitBrowserFullscreen : L.browserFullscreen, locale)}
            title={t(fullscreen.active ? L.exitBrowserFullscreen : L.browserFullscreen, locale)}
          >
            {fullscreen.active ? <Shrink /> : <Expand />}
          </Button>
        )}
      </header>

      <main
        className={cn(
          "mx-auto grid w-full flex-1 items-center gap-10 px-4 pb-10 pt-4 sm:px-6 lg:pb-14",
          showList
            ? "max-w-6xl content-start lg:grid-cols-2 lg:content-center lg:gap-16 2xl:max-w-7xl"
            : "max-w-3xl content-center",
        )}
      >
        <TimerHero timer={timer} day={day} size={showList ? "lg" : "xl"} onSubjectChange={onSubjectChange} />
        {showList && (
          <TodayList
            variant="accordion"
            day={day}
            isToday={day.date === today}
            timingSubject={timer.subject}
            openTaskId={openTaskId}
            onOpenTask={onOpenTask}
            prevDate={plan.days[index - 1]?.date}
            nextDate={plan.days[index + 1]?.date}
            onSelectDate={onSelectDay}
          />
        )}
      </main>
    </div>
  );
}
