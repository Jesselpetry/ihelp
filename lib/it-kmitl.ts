import fs from "fs";
import path from "path";
import { ROOT } from "@/lib/paths";

// IT-KMITL study material. Subjects: ICS / Digital Logic, MFIT (linear algebra).
// Same bundled-then-override pattern as lib/en-kmitl.ts.
export function getIcsDir(): string {
  if (process.env.ICS_PATH && fs.existsSync(process.env.ICS_PATH)) {
    return process.env.ICS_PATH;
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
  if (process.env.MFIT_PATH && fs.existsSync(process.env.MFIT_PATH)) {
    return process.env.MFIT_PATH;
  }
  return path.join(ROOT, "data", "it-kmitl", "mfit");
}

export interface MfitData {
  summaryMd: string | null;
  examMd: string | null;
}

export function loadMfit(): MfitData {
  const dir = getMfitDir();
  return {
    summaryMd: readIfExists(path.join(dir, "summarize.md")),
    examMd: readIfExists(path.join(dir, "midterm-exam.md")),
  };
}
