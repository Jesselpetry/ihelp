#!/usr/bin/env tsx
/**
 * Course Readiness Index — how much of the eleven-module spine each course fills.
 *
 * The blueprint's single scalar for "is the platform getting better", and a
 * production backlog that orders itself: the lowest rows are where the next
 * piece of content belongs. Run with `npm run readiness`.
 */
import { COURSES, courseDir } from "../lib/catalog";
import { resolveCourseSpine } from "../lib/course-spine";
import { MODULE_IDS } from "../lib/spine";

let total = 0;
const missingTally = new Map<string, number>();

console.log("code     ready  modules");
for (const course of COURSES) {
  const spine = resolveCourseSpine(course.code, courseDir(course));
  const filled = spine.filter((m) => m.status === "available").map((m) => m.id);
  total += filled.length;
  for (const id of MODULE_IDS) {
    if (!filled.includes(id)) missingTally.set(id, (missingTally.get(id) ?? 0) + 1);
  }
  console.log(
    `${course.code.padEnd(8)} ${String(filled.length).padStart(2)}/11  ${filled.join(", ")}`,
  );
}

const average = total / COURSES.length;
console.log(
  `\naverage ${average.toFixed(1)}/11 (${Math.round((average / 11) * 100)}%) across ${COURSES.length} courses`,
);
console.log("\nbiggest gaps — modules no course fills yet:");
for (const [id, count] of [...missingTally.entries()].sort((a, b) => b[1] - a[1])) {
  console.log(`  ${String(count).padStart(2)}/${COURSES.length} courses missing  ${id}`);
}
