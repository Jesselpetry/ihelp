import fs from "fs";
import path from "path";
import { ROOT } from "@/lib/paths";
import type { LText } from "@/lib/ltext";
import type { TestCase } from "@/lib/grader-types";

// Registry built by `scripts/build_pscp_registry.py` from the course archive
// (oj_problems.json + all_problems_detail.json + oj*/main.py). Override the
// location with PSCP_REGISTRY_PATH when running against a different export.
// Development only — see lib/it-kmitl.ts for why the gate exists.
const REGISTRY_FILE =
  process.env.NODE_ENV !== "production" && process.env.PSCP_REGISTRY_PATH
    ? process.env.PSCP_REGISTRY_PATH
    : path.join(ROOT, "data", "pscp", "problems.json");

export interface PscpStatement {
  description: string;
  inputSpec: string;
  outputSpec: string;
}

export interface PscpLimits {
  timeoutSec: number | null;
  memoryKb: number | null;
  lang: string;
}

export interface PscpStats {
  passed: number;
  attempt: number;
  percentage: number | null;
}

export interface PscpTakeawayPoint extends LText {
  tag: string;
}

export interface PscpProblem {
  id: number;
  slug: string;
  name: string;
  cleanName: string;
  week: number | null;
  difficulty: number;
  learningLog: boolean;
  recommended: boolean;
  midterm: boolean;
  url: string;
  expireLabel: string;
  /** "YYYY-MM-DDTHH:mm", or null when the export's date could not be parsed. */
  expireIso: string | null;
  stats: PscpStats;
  /** Present for the problems iJudge exposed a full statement for. */
  statement: PscpStatement | null;
  /** The problem author's own note, when the export carried one. */
  note: string | null;
  limits: PscpLimits | null;
  /** Concept tags, most distinctive first. See TAG_META for display labels. */
  tags: string[];
  takeaway: { points: PscpTakeawayPoint[] };
  pitfalls: LText[];
  /** Official iJudge sample cases. */
  cases: TestCase[];
  /**
   * Derived differential cases: inputs mutated one token at a time away from an
   * official sample, with the expected output taken from the problem's own
   * reference solution. Built by scripts/build_pscp_edge_cases.py.
   */
  edgeCases: TestCase[];
}

/**
 * The registry row as it exists on disk. `referenceCode` is the problem's
 * `main.py`; it is used at BUILD time (tag derivation, edge-case expected
 * outputs) and is deliberately never part of what `loadPscpProblems` returns,
 * so it cannot reach the browser — not through the UI, and not through the
 * serialised RSC payload either, where a "hidden" section would still be
 * readable in page source.
 */
interface StoredPscpProblem extends PscpProblem {
  referenceCode: string | null;
}

interface Registry {
  source: string;
  problems: StoredPscpProblem[];
}

let cached: PscpProblem[] | null = null;

export function loadPscpProblems(): PscpProblem[] {
  if (cached) return cached;
  if (!fs.existsSync(REGISTRY_FILE)) {
    cached = [];
    return cached;
  }
  const parsed: Registry = JSON.parse(fs.readFileSync(REGISTRY_FILE, "utf-8"));
  cached = (parsed.problems ?? [])
    .map((row) => {
      const pub: PscpProblem & { referenceCode?: string | null } = { ...row };
      delete pub.referenceCode;
      return pub as PscpProblem;
    })
    .sort((a, b) => a.id - b.id);
  return cached;
}

export interface PscpHubData {
  problems: PscpProblem[];
  total: number;
  learningLogCount: number;
  recommendedCount: number;
  gradableCount: number;
  caseCount: number;
  edgeCaseCount: number;
  weeks: number[];
}

export function loadPscpHub(): PscpHubData {
  const problems = loadPscpProblems();
  return {
    problems,
    total: problems.length,
    learningLogCount: problems.filter((p) => p.learningLog).length,
    recommendedCount: problems.filter((p) => p.recommended).length,
    gradableCount: problems.filter((p) => p.cases.length > 0).length,
    caseCount: problems.reduce((n, p) => n + p.cases.length + p.edgeCases.length, 0),
    edgeCaseCount: problems.reduce((n, p) => n + p.edgeCases.length, 0),
    weeks: [...new Set(problems.map((p) => p.week).filter((w): w is number => w !== null))].sort(
      (a, b) => a - b,
    ),
  };
}

export function loadPscpProblem(slug: string): PscpProblem | null {
  const normalized = decodeURIComponent(slug).toLowerCase().trim();
  const byId = Number.parseInt(normalized.replace(/^oj/, ""), 10);
  const problems = loadPscpProblems();
  return (
    problems.find((p) => p.slug.toLowerCase() === normalized) ??
    problems.find((p) => p.id === byId) ??
    null
  );
}
