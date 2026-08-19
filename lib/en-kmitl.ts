import fs from "fs";
import path from "path";
import { ROOT } from "@/lib/paths";

// EN-KMITL Computer Programming (01006012) midterm study material.
// Same bundled-then-sibling fallback as lib/recommended.ts's getRecommendedDir.
export function getEnKmitlDir(): string {
  if (process.env.EN_KMITL_PATH && fs.existsSync(process.env.EN_KMITL_PATH)) {
    return process.env.EN_KMITL_PATH;
  }
  const bundled = path.join(ROOT, "data", "en-kmitl");
  if (fs.existsSync(bundled)) {
    return bundled;
  }
  // Source markdown still lives under the course repo's original ce-kmitl
  // folder name — only this app's route/UI naming changed to EN-KMITL.
  const sibling = path.join(ROOT, "..", "pscp-69070027", "recommended", "ce-kmitl");
  if (fs.existsSync(sibling)) {
    return sibling;
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
  if (process.env.CHEM_PATH && fs.existsSync(process.env.CHEM_PATH)) {
    return process.env.CHEM_PATH;
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
