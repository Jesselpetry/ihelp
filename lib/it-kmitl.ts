import fs from "fs";
import path from "path";
import { ROOT } from "@/lib/paths";

// IT-KMITL study material. Currently one subject: ICS / Digital Logic.
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
