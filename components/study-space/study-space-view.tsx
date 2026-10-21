"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { activePreset } from "@/lib/study-space/presets";
import { bangkokToday } from "@/lib/study-space/dates";
import { defaultPlanDate, isPlanDate, planDay } from "@/lib/study-space/plan";
import type { StudyPlan, StudyTask, SubjectCode } from "@/lib/study-space/types";
import { chime } from "./audio-chime";
import { StudySpaceProvider, useStudySpace } from "./context";
import { DASHBOARD_TABS, Dashboard, type DashboardTab } from "./dashboard";
import { FocusMode } from "./focus-mode";
import { useShortcuts, useStandby } from "./use-standby";
import { useStudyTimer } from "./use-study-timer";

/**
 * /profile/<id>/study — two views over one clock.
 *
 *   Dashboard  (default) everything at once: exams, the day strip, the timer
 *              card with the day's quota, and tabs for today / the whole plan
 *              / courses / the time log
 *   FocusMode  (?view=focus, F) the minimal timer laid over the dashboard and
 *              filling the window, with today's list or the timer alone —
 *              the page to leave open
 *
 * Both read the same useStudyTimer, so switching never touches a running
 * block. Space starts/pauses in either view.
 *
 * Progress lives in this browser, so the server ships only the shell and the
 * plan; the views mount on the client, which keeps every lazy initializer
 * below free to read window. The URL carries the view, the tab and — when it
 * is not today — the day, so a reload or a bookmark lands where it was. With
 * no ?day= the page follows the calendar and rolls over at Bangkok midnight;
 * choices made on one calendar day (a pinned day, a course picked for the
 * timer) lapse when the next one starts.
 */

const noop = () => () => {};
function useMounted(): boolean {
  return useSyncExternalStore(noop, () => true, () => false);
}

export function StudySpaceView({
  plan,
  studentId,
  profileHref,
}: {
  plan: StudyPlan;
  studentId: string;
  profileHref: string;
}) {
  if (!useMounted()) return <StudySpaceSkeleton />;
  return (
    <StudySpaceProvider plan={plan} studentId={studentId}>
      <StudySpace profileHref={profileHref} />
    </StudySpaceProvider>
  );
}

interface QueryState {
  day: string | null;
  focus: boolean;
  tab: DashboardTab;
}

function readQuery(plan: StudyPlan): QueryState {
  const q = new URLSearchParams(window.location.search);
  const day = q.get("day");
  const tab = q.get("tab") as DashboardTab | null;
  return {
    day: isPlanDate(plan, day) && day !== defaultPlanDate(plan) ? day : null,
    focus: q.get("view") === "focus",
    tab: tab && DASHBOARD_TABS.includes(tab) ? tab : "today",
  };
}

/** Writes only what differs from the defaults, so a plain visit keeps a plain URL. */
function writeQuery(state: QueryState) {
  const q = new URLSearchParams(window.location.search);
  const set = (key: string, value: string | null) => (value ? q.set(key, value) : q.delete(key));
  set("day", state.day);
  set("view", state.focus ? "focus" : null);
  set("tab", state.tab === "today" ? null : state.tab);
  const query = q.toString();
  window.history.replaceState(window.history.state, "", `${window.location.pathname}${query ? `?${query}` : ""}`);
}

function StudySpace({ profileHref }: { profileHref: string }) {
  const { plan, studentId, data, store } = useStudySpace();

  const [initial] = useState(() => readQuery(plan));
  const [now, setNow] = useState(() => Date.now());
  /** `setOn`: the calendar day the pin was made; it lapses when that day ends. */
  const [pin, setPin] = useState<{ day: string; setOn: string } | null>(() =>
    initial.day ? { day: initial.day, setOn: defaultPlanDate(plan) } : null,
  );
  /** A course picked for the timer, for one viewed day. */
  const [subjectChoice, setSubjectChoice] = useState<{ code: SubjectCode; forDate: string } | null>(null);
  /** Focus mode's list — undefined: follow the timer · null: all closed · id: that row. */
  const [openChoice, setOpenChoice] = useState<string | null | undefined>(undefined);
  const [focusOpen, setFocusOpen] = useState(initial.focus);
  const [tab, setTab] = useState<DashboardTab>(initial.tab);
  const [course, setCourse] = useState<SubjectCode | null>(null);
  /** Which of the two settings buttons opened the dialog — focus returns there. */
  const [settingsFrom, setSettingsFrom] = useState<"dashboard" | "focus" | null>(null);

  // The clock in focus mode's top bar, and the day rolling over at midnight.
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 15_000);
    return () => window.clearInterval(id);
  }, []);

  // The end-of-block chime needs an AudioContext unlocked by a gesture.
  useEffect(() => chime.arm(), []);

  const today = bangkokToday(now);
  const followDate = defaultPlanDate(plan, now);
  const pinnedDay = pin && pin.setOn === followDate && pin.day !== followDate ? pin.day : null;
  const day = planDay(plan, pinnedDay ?? followDate) ?? plan.days[0];
  const index = plan.days.indexOf(day);
  const subject = (subjectChoice?.forDate === day.date ? subjectChoice.code : null) ?? day.tasks[0]?.subject ?? "ITF";

  // A lapsed pin leaves the URL too, or a reload would bring it back.
  useEffect(() => {
    if (pin && !pinnedDay) writeQuery({ day: null, focus: focusOpen, tab });
  }, [pin, pinnedDay, focusOpen, tab]);

  const preset = activePreset(data.settings);
  const timer = useStudyTimer({
    studentId,
    studyMinutes: preset.studyMinutes,
    breakMinutes: preset.breakMinutes,
    autoAdvance: data.settings.autoStartBreak,
    sound: data.settings.soundEnabled,
    subject,
    date: day.date,
    onFocusLogged: (code, logDate, minutes, logId) => store.logSession(logDate, code, minutes, "timer", logId),
  });
  const standby = useStandby({ keepAwake: timer.running || focusOpen, autoHide: focusOpen });

  // A row opened on a day the screen has since rolled past falls back to the timer's.
  const choice =
    typeof openChoice === "string" && !day.tasks.some((task) => task.id === openChoice) ? undefined : openChoice;
  const openTaskId =
    choice === undefined ? (day.tasks.find((task) => task.subject === timer.subject)?.id ?? null) : choice;

  const query = (patch: Partial<QueryState>) => writeQuery({ day: pinnedDay, focus: focusOpen, tab, ...patch });

  const selectDay = (next: string) => {
    const pinned = next === followDate ? null : next;
    setPin(pinned ? { day: pinned, setOn: followDate } : null);
    setSubjectChoice(null);
    setOpenChoice(undefined);
    query({ day: pinned });
  };

  /** From the plan or course tabs: go to the day and show it. */
  const openDay = (next: string) => {
    selectDay(next);
    setTab("today");
    query({ day: next === followDate ? null : next, tab: "today" });
  };

  const changeTab = (next: DashboardTab) => {
    setTab(next);
    query({ tab: next });
  };

  const chooseSubject = (code: SubjectCode) => {
    setSubjectChoice({ code, forDate: day.date });
    setOpenChoice(undefined);
  };

  /** Dashboard "จับเวลาวิชานี้": aim the timer, and bring it into view on a phone. */
  const timeTask = (task: StudyTask) => {
    if (!timer.focusLocked) chooseSubject(task.subject);
    if (window.matchMedia("(max-width: 1023px)").matches) {
      document.getElementById("timer-heading")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  /** Focus-mode row: open it, and aim the timer there unless a focus block runs. */
  const openTask = (task: StudyTask) => {
    if (task.id === openTaskId) {
      setOpenChoice(null);
      return;
    }
    setOpenChoice(task.id);
    if (!timer.focusLocked) setSubjectChoice({ code: task.subject, forDate: day.date });
  };

  const setFocus = (open: boolean) => {
    setFocusOpen(open);
    query({ focus: open });
    // Leaving focus mode leaves the browser's full screen with it.
    if (!open) standby.exitFullscreen();
  };

  useShortcuts({
    Space: () => (timer.running ? timer.pause() : timer.start()),
    KeyF: () => setFocus(!focusOpen),
  });

  return (
    <>
      <div inert={focusOpen}>
        <Dashboard
          profileHref={profileHref}
          today={today}
          day={day}
          index={index}
          pinned={!!pinnedDay}
          timer={timer}
          tab={tab}
          onTabChange={changeTab}
          course={course ?? subject}
          onCourseChange={setCourse}
          onSelectDay={selectDay}
          onBackToToday={() => selectDay(followDate)}
          onOpenDay={openDay}
          onSubjectChange={chooseSubject}
          onTimeTask={timeTask}
          onEnterFocus={() => setFocus(true)}
          settingsOpen={settingsFrom === "dashboard"}
          onSettingsOpenChange={(open) => setSettingsFrom(open ? "dashboard" : null)}
        />
      </div>

      {focusOpen && (
        <FocusMode
          now={now}
          today={today}
          day={day}
          index={index}
          pinned={!!pinnedDay}
          timer={timer}
          idle={standby.idle}
          showList={data.settings.focusShowsList}
          onToggleList={() => store.updateSettings({ focusShowsList: !data.settings.focusShowsList })}
          openTaskId={openTaskId}
          onOpenTask={openTask}
          onSelectDay={selectDay}
          onBackToToday={() => selectDay(followDate)}
          onSubjectChange={chooseSubject}
          onExit={() => setFocus(false)}
          fullscreen={{ can: standby.canFullscreen, active: standby.isFullscreen, toggle: standby.toggleFullscreen }}
          settingsOpen={settingsFrom === "focus"}
          onSettingsOpenChange={(open) => setSettingsFrom(open ? "focus" : null)}
        />
      )}
    </>
  );
}

function StudySpaceSkeleton() {
  return (
    <div className="mx-auto w-full max-w-6xl animate-pulse px-4 pb-16 pt-4 sm:px-6 sm:pt-6" aria-hidden>
      <div className="h-4 w-20 rounded bg-muted" />
      <div className="mt-4 h-3 w-40 rounded bg-muted" />
      <div className="mt-2 h-8 w-48 rounded bg-muted" />
      <div className="mt-6 grid grid-cols-2 gap-2 md:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-24 rounded-xl bg-muted" />
        ))}
      </div>
      <div className="mt-3 h-20 rounded-xl bg-muted" />
      <div className="mt-6 grid gap-6 lg:grid-cols-[22rem_minmax(0,1fr)]">
        <div className="h-[30rem] rounded-2xl bg-muted" />
        <div className="h-[30rem] rounded-2xl bg-muted" />
      </div>
    </div>
  );
}
