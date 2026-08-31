import fs from "fs";
import path from "path";
import { ROOT } from "@/lib/paths";

/**
 * Why every path override below is gated on NODE_ENV:
 *
 * An fs call on a value the bundler cannot resolve statically makes Turbopack's
 * file tracer give up and pull the whole project — .git included — into the
 * function bundle. That put a 1 GB output on the Vercel build container and ran
 * it out of disk (ENOSPC). Gating the overrides lets them be dead-code
 * eliminated in a production build, leaving one static path the tracer can
 * follow. The overrides still work in dev, which is the only place they are used.
 */

// IT-KMITL study material. Subjects: ICS / Digital Logic, MFIT (linear algebra).
// Same bundled-then-override pattern as lib/en-kmitl.ts.
export function getIcsDir(): string {
  // Dev-only override — see the note at the top of this file.
  if (process.env.NODE_ENV !== "production") {
    if (process.env.ICS_PATH && fs.existsSync(process.env.ICS_PATH)) {
      return process.env.ICS_PATH;
    }
  }
  return path.join(ROOT, "data", "it-kmitl", "ics");
}

export interface IcsData {
  summaryMd: string | null;
  examMd: string | null;
  analysisMd: string | null;
}

function readIfExists(file: string): string | null {
  return fs.existsSync(file) ? fs.readFileSync(file, "utf-8") : null;
}

export function loadIcs(): IcsData {
  const dir = getIcsDir();
  return {
    summaryMd: readIfExists(path.join(dir, "summarize.md")),
    examMd: readIfExists(path.join(dir, "midterm-exam.md")),
    analysisMd: readIfExists(path.join(dir, "analysis.md")),
  };
}

// ── MFIT (06016401 Mathematics for Information Technology) ────────────────────
export function getMfitDir(): string {
  // Dev-only override — see the note at the top of this file.
  if (process.env.NODE_ENV !== "production") {
    if (process.env.MFIT_PATH && fs.existsSync(process.env.MFIT_PATH)) {
      return process.env.MFIT_PATH;
    }
  }
  return path.join(ROOT, "data", "it-kmitl", "mfit");
}

export interface MfitData {
  summaryMd: string | null;
  examMd: string | null;
  /** Crash summary ordered by the instructor's exam blueprint (Q1-Q10) */
  cramMd: string | null;
  /** Six-block sprint study plan for the day before the exam */
  learningPathMd: string | null;
  /** Timed drill: 20 MCQ + 5 calculation problems mapped to the blueprint */
  mockExamMd: string | null;
}

export function loadMfit(): MfitData {
  const dir = getMfitDir();
  return {
    summaryMd: readIfExists(path.join(dir, "summarize.md")),
    examMd: readIfExists(path.join(dir, "midterm-exam.md")),
    cramMd: readIfExists(path.join(dir, "cram.md")),
    learningPathMd: readIfExists(path.join(dir, "learning-path.md")),
    mockExamMd: readIfExists(path.join(dir, "mock-exam.md")),
  };
}

// ── ITF (06016402 Information Technology Fundamentals) ────────────────────────
// Study guide and lecture bank ported from the iLearn project.
export function getItfDir(): string {
  // Dev-only override — see the note at the top of this file.
  if (process.env.NODE_ENV !== "production") {
    if (process.env.ITF_PATH && fs.existsSync(process.env.ITF_PATH)) {
      return process.env.ITF_PATH;
    }
  }
  return path.join(ROOT, "data", "it-kmitl", "itf");
}

export interface ItfData {
  summaryMd: string | null;
}

export function loadItf(): ItfData {
  const dir = getItfDir();
  return {
    summaryMd: readIfExists(path.join(dir, "summarize.md")),
  };
}
