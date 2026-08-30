#!/usr/bin/env tsx
/**
 * Enforces the learning blueprint's contract. Run with `npm run content:check`.
 *
 * Two severities, on purpose:
 *
 *   error — breaks the build. A bank that cannot be graded, a module id that
 *           does not exist, a question with no provenance.
 *   warn  — counted and printed, does not break the build. These are the known
 *           content debts the blueprint schedules for repair (the 123 hollow
 *           explanations, the fake-bilingual mock paper). They are warnings
 *           only until that work lands, at which point they become errors and
 *           can never come back.
 *
 * The point of running them as warnings first is that the debt becomes a number
 * that moves, instead of a paragraph in a report.
 */
import { COURSES, courseDir } from "../lib/catalog";
import { COURSE_BINDINGS } from "../lib/course-bindings";
import { resolveCourseSpine } from "../lib/course-spine";
import { MODULE_IDS, STANDARD_SPINE, type ModuleId } from "../lib/spine";
import { checkBank, isFakeBilingual, type Finding } from "../lib/schemas/content";

const findings: Finding[] = [];

/** Modules whose bank a student drills or sits by chapter. */
const CHAPTERED_MODULES: ModuleId[] = ["drill", "speed_quiz", "mock_exam"];

// ── 1. the spine itself ──────────────────────────────────────────────────────
const segments = new Set<string>();
for (const spec of STANDARD_SPINE) {
  if (segments.has(spec.segment)) {
    findings.push({
      severity: "error",
      rule: "spine-segment",
      where: spec.id,
      message: `duplicate URL segment "${spec.segment}"`,
    });
  }
  segments.add(spec.segment);
}
if (STANDARD_SPINE.length !== 11) {
  findings.push({
    severity: "error",
    rule: "spine-size",
    where: "STANDARD_SPINE",
    message: `the blueprint declares eleven modules, found ${STANDARD_SPINE.length}`,
  });
}

// ── 2. bindings point at modules that exist ──────────────────────────────────
const known = new Set<string>(MODULE_IDS);
for (const [code, binding] of Object.entries(COURSE_BINDINGS)) {
  for (const id of Object.keys(binding)) {
    if (!known.has(id)) {
      findings.push({
        severity: "error",
        rule: "unknown-module",
        where: `${code}.${id}`,
        message: "not one of the eleven spine modules",
      });
    }
  }
  for (const [id, mod] of Object.entries(binding)) {
    if (mod?.bank && mod.quizId === undefined) {
      findings.push({
        severity: "error",
        rule: "missing-quiz-id",
        where: `${code}.${id}`,
        message: "a bank needs a quizId or its progress cannot be stored",
      });
    }
    if (mod?.subtitle && isFakeBilingual(mod.subtitle)) {
      findings.push({
        severity: "warn",
        rule: "fake-bilingual",
        where: `${code}.${id}.subtitle`,
        message: "en duplicates the Thai",
      });
    }
  }
}

// quizIds must be unique across the whole app, or two modules share a score
const quizIds = new Map<number, string>();
for (const [code, binding] of Object.entries(COURSE_BINDINGS)) {
  for (const [id, mod] of Object.entries(binding)) {
    if (mod?.quizId === undefined) continue;
    const owner = quizIds.get(mod.quizId);
    if (owner) {
      findings.push({
        severity: "error",
        rule: "quiz-id-collision",
        where: `${code}.${id}`,
        message: `quizId ${mod.quizId} is already used by ${owner} — progress would be merged`,
      });
    }
    quizIds.set(mod.quizId, `${code}.${id}`);
  }
}

// ── 3. every course declares the whole spine, and every bound module resolves ─
for (const course of COURSES) {
  const spine = resolveCourseSpine(course.code, courseDir(course));
  if (spine.length !== 11) {
    findings.push({
      severity: "error",
      rule: "course-spine",
      where: course.code,
      message: `resolved ${spine.length} modules, expected 11`,
    });
  }
  if (!COURSE_BINDINGS[course.code]) {
    findings.push({
      severity: "error",
      rule: "no-binding",
      where: course.code,
      message: "course is catalogued but binds nothing — not even an overview",
    });
  }
}

// ── 4. the question banks ────────────────────────────────────────────────────
for (const [code, binding] of Object.entries(COURSE_BINDINGS)) {
  for (const [id, mod] of Object.entries(binding)) {
    const bank = mod?.bank?.();
    if (!bank) continue;
    findings.push(
      ...checkBank(`${code}.${id}`, bank, {
        requireChapter: CHAPTERED_MODULES.includes(id as ModuleId),
      }),
    );
  }
}

// ── report ───────────────────────────────────────────────────────────────────
const errors = findings.filter((f) => f.severity === "error");
const warnings = findings.filter((f) => f.severity === "warn");

function summarise(list: Finding[]) {
  const byRule = new Map<string, number>();
  for (const f of list) byRule.set(f.rule, (byRule.get(f.rule) ?? 0) + 1);
  return [...byRule.entries()].sort((a, b) => b[1] - a[1]);
}

for (const f of errors) {
  console.error(`ERROR  ${f.rule.padEnd(20)} ${f.where}\n       ${f.message}`);
}

if (warnings.length) {
  console.log(`\n${warnings.length} warnings (content debt, not build-breaking):`);
  for (const [rule, count] of summarise(warnings)) {
    console.log(`  ${String(count).padStart(4)}  ${rule}`);
  }
}

if (errors.length) {
  console.error(`\n${errors.length} errors:`);
  for (const [rule, count] of summarise(errors)) {
    console.error(`  ${String(count).padStart(4)}  ${rule}`);
  }
  process.exit(1);
}

console.log(`\ncontent contract OK — ${warnings.length} warnings, 0 errors`);
