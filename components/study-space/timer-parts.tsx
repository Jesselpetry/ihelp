"use client";

import { Check, ChevronDown, Maximize2, Pause, Play, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocale, t } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SUBJECTS, SUBJECT_ORDER } from "@/lib/study-space/subjects";
import { activePreset } from "@/lib/study-space/presets";
import { formatDay } from "@/lib/study-space/dates";
import { formatHours, formatMinutes, loggedMinutes, ratio, targetMinutes } from "@/lib/study-space/progress";
import type { DailyPlan, SubjectCode } from "@/lib/study-space/types";
import { useStudySpace } from "./context";
import { ProgressBar, Segmented, SubjectDot, SubjectTag } from "./primitives";
import { fill, L } from "./strings";
import type { StudyTimer, TimerMode } from "./use-study-timer";

/**
 * The clock, in two arrangements built from the same parts:
 *
 *   TimerCard  — the dashboard's compact card: dial, controls, the day's quota
 *   TimerHero  — focus mode's centrepiece: a large dial whose controls fade
 *                when the screen goes idle
 */

/** Fades with the rest of focus mode's controls when it goes idle (see use-standby.ts). */
export const CHROME =
  "transition-opacity duration-500 group-data-[idle=true]/focus:pointer-events-none group-data-[idle=true]/focus:opacity-0";

type DialSize = "md" | "lg" | "xl";

/**
 * Dial widths. The large ones are also capped by the viewport height so focus
 * mode fits a 1280×720 laptop without scrolling.
 */
export const DIAL_SIZE: Record<DialSize, string> = {
  md: "w-56 sm:w-60",
  lg: "w-[min(78vw,20rem)] sm:w-80 lg:w-[min(34vw,26rem,calc(100dvh-21rem))] 2xl:w-[min(30vw,34rem,calc(100dvh-21rem))]",
  xl: "w-[min(84vw,22rem)] sm:w-[26rem] lg:w-[min(48vw,34rem,calc(100dvh-19rem))] 2xl:w-[min(40vw,42rem,calc(100dvh-19rem))]",
};

const DIGITS: Record<DialSize, string> = {
  md: "text-5xl",
  lg: "text-[clamp(3.5rem,15vw,5.75rem)] 2xl:text-[7rem]",
  xl: "text-[clamp(4rem,17vw,7.5rem)] 2xl:text-[9rem]",
};

export function TimerDial({
  timer,
  size,
  className,
  children,
}: {
  timer: StudyTimer;
  size: DialSize;
  className?: string;
  children?: React.ReactNode;
}) {
  const secs = Math.ceil(timer.remainingMs / 1000);
  const clock = `${String(Math.floor(secs / 60)).padStart(2, "0")}:${String(secs % 60).padStart(2, "0")}`;
  const r = 94;
  const c = 2 * Math.PI * r;
  const progress = timer.totalMs > 0 ? timer.remainingMs / timer.totalMs : 0;

  return (
    <div className={cn("relative aspect-square", DIAL_SIZE[size], className)}>
      <svg viewBox="0 0 200 200" className="size-full -rotate-90" aria-hidden>
        <circle cx="100" cy="100" r={r} fill="none" strokeWidth={size === "md" ? 4 : 2.5} className="stroke-border" />
        <circle
          cx="100"
          cy="100"
          r={r}
          fill="none"
          strokeWidth={size === "md" ? 4 : 2.5}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - progress)}
          className={cn(
            "transition-[stroke-dashoffset] duration-300 ease-linear",
            timer.mode === "focus" ? "stroke-primary" : "stroke-emerald-500",
          )}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span
          role="timer"
          aria-live="off"
          className={cn(
            "font-mono font-light leading-none tracking-tight tabular-nums",
            DIGITS[size],
            !timer.running && "text-foreground/85",
          )}
        >
          {clock}
        </span>
        {/* Full width, so the caption's max-w-[72%] is measured against the dial. */}
        {children && <div className={cn("flex w-full flex-col items-center", size === "md" ? "mt-2" : "mt-3")}>{children}</div>}
      </div>
    </div>
  );
}

export function ModeSwitch({ timer, className }: { timer: StudyTimer; className?: string }) {
  const { locale } = useLocale();
  const { data } = useStudySpace();
  const preset = activePreset(data.settings);
  return (
    <Segmented<TimerMode>
      size="sm"
      label={t(L.modeLabel, locale)}
      value={timer.mode}
      onChange={timer.switchMode}
      className={className}
      options={[
        { value: "focus", label: `${t(L.focus, locale)} ${preset.studyMinutes}′`, disabled: timer.inProgress && timer.mode !== "focus" },
        { value: "break", label: `${t(L.break, locale)} ${preset.breakMinutes}′`, disabled: timer.inProgress && timer.mode !== "break" },
      ]}
    />
  );
}

export function TimerControls({
  timer,
  size,
  className,
}: {
  timer: StudyTimer;
  size: "md" | "lg";
  className?: string;
}) {
  const { locale } = useLocale();
  const elapsedMin = Math.floor(timer.elapsedFocusMs / 60_000);
  const side = size === "md" ? "size-10" : "size-11";
  return (
    <div className={cn("flex items-center justify-center gap-3", className)}>
      <Button
        variant="outline"
        size="icon-lg"
        className={cn(side, "rounded-full")}
        onClick={timer.reset}
        disabled={!timer.inProgress}
        aria-label={t(L.reset, locale)}
        title={t(L.reset, locale)}
      >
        <RotateCcw />
      </Button>
      <Button
        size="lg"
        className={cn("rounded-full", size === "md" ? "h-10 min-w-28 px-5 text-sm" : "h-12 min-w-36 px-7 text-base")}
        onClick={timer.running ? timer.pause : timer.start}
        title="Space"
      >
        {timer.running ? <Pause className="fill-current" /> : <Play className="fill-current" />}
        {t(timer.running ? L.pause : timer.inProgress ? L.resume : L.start, locale)}
      </Button>
      <Button
        variant="outline"
        size="icon-lg"
        className={cn(side, "rounded-full")}
        onClick={timer.finishEarly}
        disabled={timer.mode !== "focus" || elapsedMin < 1}
        aria-label={fill(t(L.saveNow, locale), { m: elapsedMin })}
        title={fill(t(L.saveNow, locale), { m: elapsedMin })}
      >
        <Check />
      </Button>
    </div>
  );
}

/** "บันทึก n นาที" once a minute is in, or where a block from another day is credited. */
function TimerHint({ timer, day, className }: { timer: StudyTimer; day: DailyPlan; className?: string }) {
  const { locale } = useLocale();
  const elapsedMin = Math.floor(timer.elapsedFocusMs / 60_000);
  const f = formatDay(timer.date, locale);
  const text =
    timer.mode === "focus" && elapsedMin >= 1
      ? fill(t(L.saveNow, locale), { m: elapsedMin })
      : timer.focusLocked && timer.date !== day.date
        ? fill(t(L.creditTo, locale), { d: `${f.day} ${f.month}` })
        : "";
  return <p className={cn("h-4 text-center text-xs text-muted-foreground", className)}>{text}</p>;
}

export function SubjectPicker({
  timer,
  day,
  onChange,
}: {
  timer: StudyTimer;
  day: DailyPlan;
  onChange: (code: SubjectCode) => void;
}) {
  const { locale } = useLocale();
  const planned = new Map(day.tasks.map((x) => [x.subject, x.hours]));
  const ordered = [...SUBJECT_ORDER].sort((a, b) => Number(planned.has(b)) - Number(planned.has(a)));
  const locked = timer.focusLocked;

  if (timer.mode === "break") {
    return <span className="text-sm text-muted-foreground">{t(L.break, locale)}</span>;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={locked}>
        <button
          type="button"
          title={locked ? t(L.lockedWhileRunning, locale) : t(L.chooseSubject, locale)}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-sm font-medium transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
            locked ? "cursor-default" : "hover:bg-muted",
          )}
        >
          <SubjectDot code={timer.subject} />
          {SUBJECTS[timer.subject].shortName}
          {!locked && <ChevronDown className="size-3.5 text-muted-foreground" />}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="min-w-52">
        <DropdownMenuLabel>{t(L.chooseSubject, locale)}</DropdownMenuLabel>
        {ordered.map((code) => (
          <DropdownMenuItem key={code} onSelect={() => onChange(code)}>
            <SubjectDot code={code} />
            <span className="flex-1">{SUBJECTS[code].shortName}</span>
            <span className="text-xs tabular-nums text-muted-foreground">
              {planned.has(code) ? `${formatHours(planned.get(code)!)} ${t(L.hoursShort, locale)}` : t(L.notToday, locale)}
            </span>
            {code === timer.subject && <Check className="size-3.5" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/** What the dial says under the digits: the course, and the day's title for it. */
function DialCaption({
  timer,
  day,
  onSubjectChange,
}: {
  timer: StudyTimer;
  day: DailyPlan;
  onSubjectChange: (code: SubjectCode) => void;
}) {
  const { locale } = useLocale();
  const task = day.tasks.find((x) => x.subject === timer.subject);
  return (
    <>
      <SubjectPicker timer={timer} day={day} onChange={onSubjectChange} />
      {timer.mode === "focus" && task && (
        <span className="mt-1 max-w-[72%] truncate text-xs text-muted-foreground">{t(task.title, locale)}</span>
      )}
    </>
  );
}

/** The day's target, total and per course. */
export function QuotaList({ day }: { day: DailyPlan }) {
  const { locale } = useLocale();
  const { data } = useStudySpace();
  const subjects = [...new Set(day.tasks.map((task) => task.subject))];
  const done = loggedMinutes(data, day.date);
  const target = targetMinutes(day);

  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <h3 className="text-xs font-medium text-muted-foreground">{t(L.quotaFor, locale)}</h3>
        <span className="text-xs tabular-nums">
          <span className="font-semibold">{formatMinutes(done, locale)}</span>
          <span className="text-muted-foreground"> / {formatMinutes(target, locale)}</span>
        </span>
      </div>
      <ProgressBar value={ratio(done, target)} className="mb-3 h-2" label={t(L.quotaFor, locale)} />
      <ul className="space-y-2">
        {subjects.map((code) => {
          const d = loggedMinutes(data, day.date, code);
          const tg = targetMinutes(day, code);
          return (
            <li key={code} className="grid grid-cols-[4.5rem_1fr_auto] items-center gap-2">
              <SubjectTag code={code} className="font-medium" />
              <ProgressBar value={ratio(d, tg)} barClassName={SUBJECTS[code].accent.bar} label={SUBJECTS[code].shortName} />
              <span className="text-[11px] tabular-nums text-muted-foreground">
                {d >= tg ? t(L.quotaMet, locale) : fill(t(L.left, locale), { t: formatMinutes(tg - d, locale) })}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/** The dashboard's timer: a compact dial, its controls and the day's quota. */
export function TimerCard({
  timer,
  day,
  onSubjectChange,
  onEnterFocus,
}: {
  timer: StudyTimer;
  day: DailyPlan;
  onSubjectChange: (code: SubjectCode) => void;
  onEnterFocus: () => void;
}) {
  const { locale } = useLocale();
  const { data, store } = useStudySpace();
  const sound = data.settings.soundEnabled;

  return (
    <section aria-labelledby="timer-heading" className="rounded-2xl border bg-card p-4 sm:p-5">
      <header className="flex items-center justify-between">
        <h2 id="timer-heading" className="text-sm font-semibold">
          {t(L.timer, locale)}
        </h2>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => store.updateSettings({ soundEnabled: !sound })}
            aria-label={t(sound ? L.soundOn : L.soundOff, locale)}
            title={t(sound ? L.soundOn : L.soundOff, locale)}
          >
            {sound ? <Volume2 /> : <VolumeX />}
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onEnterFocus}
            aria-label={t(L.focusMode, locale)}
            title={`${t(L.focusMode, locale)} (F)`}
          >
            <Maximize2 />
          </Button>
        </div>
      </header>

      <div className="mt-3 flex flex-col items-center">
        <ModeSwitch timer={timer} />
        <TimerDial timer={timer} size="md" className="mt-4">
          <DialCaption timer={timer} day={day} onSubjectChange={onSubjectChange} />
        </TimerDial>
        <TimerControls timer={timer} size="md" className="mt-4" />
        <TimerHint timer={timer} day={day} className="mt-2" />
      </div>

      <div className="mt-4 border-t pt-4">
        <QuotaList day={day} />
      </div>
    </section>
  );
}

/**
 * Focus mode's timer. Everything but the dial and the day's total carries
 * CHROME and fades when the screen goes idle — that is the standby look.
 */
export function TimerHero({
  timer,
  day,
  size,
  onSubjectChange,
}: {
  timer: StudyTimer;
  day: DailyPlan;
  size: "lg" | "xl";
  onSubjectChange: (code: SubjectCode) => void;
}) {
  const { locale } = useLocale();
  const { data } = useStudySpace();
  const done = loggedMinutes(data, day.date);
  const target = targetMinutes(day);

  return (
    <section aria-label={t(L.timer, locale)} className="flex flex-col items-center">
      <ModeSwitch timer={timer} className={CHROME} />
      <TimerDial timer={timer} size={size} className="mt-6">
        <DialCaption timer={timer} day={day} onSubjectChange={onSubjectChange} />
      </TimerDial>
      <TimerControls timer={timer} size="lg" className={cn("mt-6", CHROME)} />
      <TimerHint timer={timer} day={day} className={cn("mt-2", CHROME)} />

      <div className="mt-5 w-full max-w-64">
        <div className="mb-1.5 flex items-baseline justify-between text-xs">
          <span className="text-muted-foreground">{t(L.todayProgress, locale)}</span>
          <span className="tabular-nums">
            {formatMinutes(done, locale)}
            <span className="text-muted-foreground"> / {formatHours(target / 60)} {t(L.hoursShort, locale)}</span>
          </span>
        </div>
        {/* On the page background, not a card — bg-muted would vanish into it. */}
        <ProgressBar value={ratio(done, target)} className="bg-foreground/10" label={t(L.todayProgress, locale)} />
      </div>
    </section>
  );
}
