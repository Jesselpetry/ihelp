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

// EN-KMITL Computer Programming (01006012) midterm study material.
// Same bundled-then-sibling fallback as lib/recommended.ts's getRecommendedDir.
export function getEnKmitlDir(): string {
  // Dev-only override — see the note at the top of this file.
  if (process.env.NODE_ENV !== "production") {
    if (process.env.EN_KMITL_PATH && fs.existsSync(process.env.EN_KMITL_PATH)) {
      return process.env.EN_KMITL_PATH;
    }
  }
  const bundled = path.join(ROOT, "data", "en-kmitl");
  if (fs.existsSync(bundled)) {
    return bundled;
  }
  // Source markdown still lives under the course repo's original ce-kmitl
  // folder name — only this app's route/UI naming changed to EN-KMITL.
  // Dev-only, and gated on NODE_ENV for the same file-tracing reason as
  // getRecommendedDir().
  if (process.env.NODE_ENV !== "production") {
    const sibling = path.join(ROOT, "..", "pscp-69070027", "recommended", "ce-kmitl");
    if (fs.existsSync(sibling)) {
      return sibling;
    }
  }
  return bundled;
}

export interface EnKmitlData {
  summaryMd: string | null;
  mockExamMd: string | null;
}

export function loadEnKmitl(): EnKmitlData {
  const dir = getEnKmitlDir();
  const summaryPath = path.join(dir, "สรุปคอมโปร-Midterm.md");
  const mockExamPath = path.join(dir, "ข้อสอบ-Mock-Midterm-60ข้อ.md");
  return {
    summaryMd: fs.existsSync(summaryPath) ? fs.readFileSync(summaryPath, "utf-8") : null,
    mockExamMd: fs.existsSync(mockExamPath) ? fs.readFileSync(mockExamPath, "utf-8") : null,
  };
}

// ── Chemistry ────────────────────────────────────────────────────────────────
// Chemistry data lives in data/en-kmitl/chem/ (or ENV override CHEM_PATH).
export function getChemDir(): string {
  // Dev-only override — see the note at the top of this file.
  if (process.env.NODE_ENV !== "production") {
    if (process.env.CHEM_PATH && fs.existsSync(process.env.CHEM_PATH)) {
      return process.env.CHEM_PATH;
    }
  }
  return path.join(ROOT, "data", "en-kmitl", "chem");
}

export interface ChemData {
  summaryMd: string | null;
}

export function loadChem(): ChemData {
  const dir = getChemDir();
  const summaryPath = path.join(dir, "summarize.md");
  return {
    summaryMd: fs.existsSync(summaryPath) ? fs.readFileSync(summaryPath, "utf-8") : null,
  };
}
