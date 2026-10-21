"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { useLocale, t } from "@/lib/i18n";
import { SUBJECTS, SUBJECT_ORDER } from "@/lib/study-space/subjects";
import { href } from "@/lib/study-space/links";
import { daysBetween } from "@/lib/study-space/dates";
import { formatHours, ratio, subjectTargetMinutes, totalLoggedMinutes } from "@/lib/study-space/progress";
import type { SubjectCode } from "@/lib/study-space/types";
import { useStudySpace } from "./context";
import { ProgressBar, SubjectDot } from "./primitives";
import { fill, L } from "./strings";

/** "อีก 13 วัน" / "พรุ่งนี้" / "สอบวันนี้" / "สอบแล้ว", in Bangkok calendar days. */
export function examStatus(code: SubjectCode, today: string, locale: "th" | "en"): { days: number; label: string } {
  const days = daysBetween(today, SUBJECTS[code].exam.startsAt.slice(0, 10));
  const label =
    days < 0 ? t(L.examDone, locale)
    : days === 0 ? t(L.examTodayShort, locale)
    : days === 1 ? t(L.dayLeft, locale)
    : fill(t(L.daysLeft, locale), { n: days });
  return { days, label };
}

/**
 * Four exam cards in exam order: days left, date and time, and how many of
 * the plan's hours for that course are logged.
 */
export function ExamCountdown({ today, className }: { today: string; className?: string }) {
  const { locale } = useLocale();
  const { plan, data } = useStudySpace();

  return (
    <div className={cn("grid grid-cols-2 gap-2", className)}>
      {SUBJECT_ORDER.map((code) => {
        const s = SUBJECTS[code];
        const { days, label } = examStatus(code, today, locale);
        const logged = totalLoggedMinutes(data, code);
        const target = subjectTargetMinutes(plan, code);
        return (
          <Link
            key={code}
            href={href.hub(code)}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "rounded-xl border bg-card p-3 transition-colors hover:border-primary/40",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
              days < 0 && "opacity-60",
            )}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold">
                <SubjectDot code={code} />
                {s.shortName}
              </span>
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-[11px] font-medium tabular-nums",
                  days === 0 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                )}
              >
                {label}
              </span>
            </div>
            <div className="mt-1.5 flex flex-wrap gap-x-1.5 text-xs text-muted-foreground">
              <span className="whitespace-nowrap">{t(s.exam.date, locale)}</span>
              <span className="whitespace-nowrap tabular-nums">{s.exam.time}</span>
            </div>
            <div className="mt-2.5 flex items-center gap-2">
              <ProgressBar value={ratio(logged, target)} barClassName={s.accent.bar} label={s.shortName} />
              <span className="shrink-0 text-[11px] tabular-nums text-muted-foreground">
                {formatHours(logged / 60)}/{formatHours(target / 60)}
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
