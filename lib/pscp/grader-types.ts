import type { LText } from "@/lib/i18n";

// iJudge-style per-case status: Passed / Wrong answer / Time limit exceeded / Runtime error.
export type CaseStatus = "P" | "-" | "T" | "E";

export interface TestCase {
  id: string;
  stdin: string;
  expected: string;
  label: LText;
  /** true = copied verbatim from problem.md §4 (official example); false = extra case from §6. */
  official: boolean;
  /** What this case is checking, e.g. "boundary N=0" — usually from the §6 table's third column. */
  tests?: LText;
}

export interface CaseResult {
  caseId: string;
  status: CaseStatus;
  actual: string;
  durationMs: number;
  /** Traceback text, present when status is "E". */
  error?: string;
}

export interface Pep8Violation {
  line: number;
  col: number;
  /** pycodestyle code ("E302", "W291") or a custom rule id ("PSCP-NOT-MOD", "PSCP-CONSIDER-IN"). */
  code: string;
  message: LText;
  /** Pointer into problem.md, e.g. "problem.md §5.6", when the violation maps to a documented tip. */
  sourceRef?: string;
}

export interface GradeReport {
  /** e.g. "PPPP-" */
  scoreString: string;
  results: CaseResult[];
  violations: Pep8Violation[];
  ranAt: number;
}
