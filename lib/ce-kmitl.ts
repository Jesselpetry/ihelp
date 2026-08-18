import fs from "fs";
import path from "path";
import { ROOT } from "@/lib/paths";

// CE-KMITL Computer Programming (01006012) midterm study material.
// Same bundled-then-sibling fallback as lib/recommended.ts's getRecommendedDir.
export function getCeKmitlDir(): string {
  if (process.env.CE_KMITL_PATH && fs.existsSync(process.env.CE_KMITL_PATH)) {
    return process.env.CE_KMITL_PATH;
  }
  const bundled = path.join(ROOT, "data", "ce-kmitl");
  if (fs.existsSync(bundled)) {
    return bundled;
  }
  const sibling = path.join(ROOT, "..", "pscp-69070027", "recommended", "ce-kmitl");
  if (fs.existsSync(sibling)) {
    return sibling;
  }
  return bundled;
}

export interface CeKmitlData {
  summaryMd: string | null;
  mockExamMd: string | null;
}

export function loadCeKmitl(): CeKmitlData {
  const dir = getCeKmitlDir();
  const summaryPath = path.join(dir, "สรุปคอมโปร-Midterm.md");
  const mockExamPath = path.join(dir, "ข้อสอบ-Mock-Midterm-60ข้อ.md");
  return {
    summaryMd: fs.existsSync(summaryPath) ? fs.readFileSync(summaryPath, "utf-8") : null,
    mockExamMd: fs.existsSync(mockExamPath) ? fs.readFileSync(mockExamPath, "utf-8") : null,
  };
}
