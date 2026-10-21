import "server-only";

import { FINAL_1_2569 } from "./final-1-2569";
import type { StudyPlan } from "../types";

/**
 * Who has a study plan. A plan is someone's own schedule, so the study space
 * exists only for the student IDs listed here, and only for them: the route
 * and the profile card both compare this key with the signed-in student's
 * verified ID (lib/auth/guards.ts `currentStudentId`) before anything is
 * rendered. Everyone else — other students, signed-out visitors, crawlers —
 * gets a 404 and no plan data in the payload.
 *
 * To give someone a plan, add a file next to final-1-2569.ts and map their
 * student ID to it here.
 */
const PLANS_BY_STUDENT: Record<string, StudyPlan> = {
  "69070027": FINAL_1_2569,
};

export function studyPlanFor(studentId: string | null | undefined): StudyPlan | null {
  if (!studentId) return null;
  return PLANS_BY_STUDENT[studentId] ?? null;
}
