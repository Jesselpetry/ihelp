"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { useLocale, t } from "@/lib/i18n";
import { formatDay } from "@/lib/study-space/dates";
import { loggedMinutes, ratio, targetMinutes } from "@/lib/study-space/progress";
import { useStudySpace } from "./context";
import { SubjectDot } from "./primitives";
import { L } from "./strings";

/**
 * Every plan day as one row of equal columns: date, the courses it holds and
 * how much of its quota is logged; exam days carry a tag. The whole plan
 * fits from about 1100 px wide, narrower screens scroll it, and the selected
 * day is centred when it changes — by scrolling the row itself, never the
 * page (which may sit under focus mode at the time).
 */
export function DayStrip({
  selected,
  today,
  onSelect,
}: {
  selected: string;
  today: string;
  onSelect: (date: string) => void;
}) {
  const { locale } = useLocale();
  const { plan, data } = useStudySpace();
  const navRef = useRef<HTMLElement>(null);
  const activeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const nav = navRef.current;
    const active = activeRef.current;
    if (!nav || !active) return;
    nav.scrollTo({ left: active.offsetLeft - (nav.clientWidth - active.offsetWidth) / 2, behavior: "smooth" });
  }, [selected]);

  return (
    <nav
      ref={navRef}
      aria-label={t(L.planDays, locale)}
      className="relative -mx-4 overflow-x-auto px-4 pb-1 pt-2 [scrollbar-width:none] sm:-mx-6 sm:px-6"
    >
      <ol
        className="grid gap-1"
        style={{ gridTemplateColumns: `repeat(${plan.days.length}, minmax(2.75rem, 1fr))` }}
      >
        {plan.days.map((day) => {
          const f = formatDay(day.date, locale);
          const isSelected = day.date === selected;
          const isToday = day.date === today;
          const isPast = day.date < today;
          const progress = ratio(loggedMinutes(data, day.date), targetMinutes(day));
          const subjects = [...new Set(day.tasks.map((task) => task.subject))];

          return (
            <li key={day.date}>
              <button
                ref={isSelected ? activeRef : undefined}
                type="button"
                onClick={() => onSelect(day.date)}
                aria-current={isSelected ? "date" : undefined}
                aria-label={f.long}
                className={cn(
                  "relative flex w-full flex-col items-center gap-1 rounded-xl border px-1 pb-2 pt-1.5 transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                  isSelected
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-transparent bg-card hover:border-border",
                  !isSelected && isPast && "text-muted-foreground",
                  day.exam && !isSelected && "border-primary/40",
                )}
              >
                <span className={cn("text-[10px]", isSelected ? "opacity-80" : "text-muted-foreground")}>{f.weekday}</span>
                <span className="text-base font-semibold leading-none tabular-nums">{f.day}</span>
                <span className="flex h-2 items-center gap-0.5">
                  {subjects.map((code) => (
                    <SubjectDot
                      key={code}
                      code={code}
                      className={cn("size-1.5", isSelected && "ring-1 ring-primary-foreground/60")}
                    />
                  ))}
                </span>
                <span className={cn("h-0.5 w-8 overflow-hidden rounded-full", isSelected ? "bg-primary-foreground/25" : "bg-muted")}>
                  <span
                    className={cn("block h-full rounded-full", isSelected ? "bg-primary-foreground" : "bg-primary")}
                    style={{ width: `${Math.round(progress * 100)}%` }}
                  />
                </span>
                {isToday && !isSelected && (
                  <span aria-hidden className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-primary" />
                )}
                {day.exam && (
                  <span
                    aria-hidden
                    className={cn(
                      "absolute -top-2 left-1/2 -translate-x-1/2 rounded-full px-1.5 text-[9px] font-semibold leading-4",
                      isSelected ? "bg-primary-foreground text-primary" : "bg-primary text-primary-foreground",
                    )}
                  >
                    {day.exam}
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
