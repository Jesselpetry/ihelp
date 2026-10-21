import { bangkokToday } from "./dates";
import { unitById } from "./units";
import type { DailyPlan, StudyPlan, StudyPlanSummary, StudyResource, StudyTask, SubjectCode } from "./types";

/**
 * Pure reads over a StudyPlan. Client-safe: the plan itself arrives as a prop,
 * these only interpret it.
 */

export function planDay(plan: StudyPlan, date: string): DailyPlan | undefined {
  return plan.days.find((d) => d.date === date);
}

export function isPlanDate(plan: StudyPlan, date: string | null | undefined): date is string {
  return !!date && plan.days.some((d) => d.date === date);
}

/** Today if it is inside the plan, else the nearest end of it. */
export function defaultPlanDate(plan: StudyPlan, now = Date.now()): string {
  const today = bangkokToday(now);
  const first = plan.days[0].date;
  const last = plan.days[plan.days.length - 1].date;
  if (today < first) return first;
  if (today > last) return last;
  return today;
}

export function dayHours(day: DailyPlan): number {
  return day.tasks.reduce((sum, t) => sum + t.hours, 0);
}

export function planHours(plan: StudyPlan): number {
  return plan.days.reduce((sum, d) => sum + dayHours(d), 0);
}

/** Hours the plan gives one subject across all its days. */
export function planHoursFor(plan: StudyPlan, subject: SubjectCode): number {
  return plan.days.reduce(
    (sum, d) => sum + d.tasks.filter((t) => t.subject === subject).reduce((s, t) => s + t.hours, 0),
    0,
  );
}

/**
 * A task's links: each unit's own, then the task's extras, without repeats.
 * A multi-unit review day lists every week page but the library only once.
 */
export function taskResources(task: StudyTask): StudyResource[] {
  const seen = new Set<string>();
  const out: StudyResource[] = [];
  const units = task.units.flatMap((id) => unitById(id)?.resources ?? []);
  for (const r of [...units, ...(task.extras ?? [])]) {
    if (seen.has(r.href)) continue;
    seen.add(r.href);
    out.push(r);
  }
  return out;
}

/** Unit id -> the plan days that cover it, in date order. */
export function plannedOn(plan: StudyPlan): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  for (const d of plan.days) for (const task of d.tasks) for (const id of task.units) (out[id] ??= []).push(d.date);
  return out;
}

/** Today's blocks for the profile card. Nothing outside the plan's dates. */
export function planSummary(plan: StudyPlan, now = Date.now()): StudyPlanSummary {
  const today = bangkokToday(now);
  const day = planDay(plan, today);
  return {
    today,
    tasks: (day?.tasks ?? []).map((task) => ({ subject: task.subject, hours: task.hours, title: task.title })),
  };
}
