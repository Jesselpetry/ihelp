import { dayHours, planHoursFor } from "./plan";
import type { DailyPlan, StudyPlan, SubjectCode, UserProgressData } from "./types";

/** Pure reads over UserProgressData. Minutes in, minutes out. */

export function loggedMinutes(data: UserProgressData, date: string, subject?: SubjectCode): number {
  const day = data.dailyStudyMinutes[date] ?? {};
  if (subject) return day[subject] ?? 0;
  return Object.values(day).reduce<number>((sum, m) => sum + (m ?? 0), 0);
}

export function targetMinutes(day: DailyPlan, subject?: SubjectCode): number {
  if (!subject) return dayHours(day) * 60;
  return day.tasks.filter((t) => t.subject === subject).reduce((sum, t) => sum + t.hours * 60, 0);
}

export function ratio(done: number, target: number): number {
  return target > 0 ? Math.min(1, done / target) : 0;
}

export function totalLoggedMinutes(data: UserProgressData, subject?: SubjectCode): number {
  return Object.keys(data.dailyStudyMinutes).reduce((sum, date) => sum + loggedMinutes(data, date, subject), 0);
}

export function subjectTargetMinutes(plan: StudyPlan, subject: SubjectCode): number {
  return planHoursFor(plan, subject) * 60;
}

/** Tasks ticked off across the whole plan. */
export function tasksDone(data: UserProgressData, plan: StudyPlan): { done: number; total: number } {
  const all = plan.days.flatMap((d) => d.tasks);
  return { done: all.filter((t) => data.completedTasks[t.id]).length, total: all.length };
}

/** "2 ชม. 15 นาที" / "2h 15m" */
export function formatMinutes(minutes: number, locale: "th" | "en"): string {
  const m = Math.round(minutes);
  const h = Math.floor(m / 60);
  const r = m % 60;
  if (locale === "th") {
    if (h && r) return `${h} ชม. ${r} นาที`;
    return h ? `${h} ชม.` : `${r} นาที`;
  }
  if (h && r) return `${h}h ${r}m`;
  return h ? `${h}h` : `${r}m`;
}

/** 7.5 -> "7.5", 3 -> "3" */
export const formatHours = (hours: number) => String(Math.round(hours * 10) / 10);
