import fs from "fs";
import path from "path";
import { ROOT } from "@/lib/paths";
import { loadProblems, type MasterProblem } from "@/lib/master";

// Locate recommended directory
export function getRecommendedDir(): string {
  // Dev-only override. Gated on NODE_ENV so production resolves to the single
  // static path below: an fs call on a value the bundler cannot resolve makes
  // Turbopack's file tracer give up and pull the whole project — .git included —
  // into the function bundle, which is what blew the Vercel build container's
  // disk (ENOSPC).
  if (process.env.NODE_ENV !== "production") {
    if (process.env.RECOMMENDED_PATH && fs.existsSync(process.env.RECOMMENDED_PATH)) {
      return process.env.RECOMMENDED_PATH;
    }
  }
  const bundled = path.join(ROOT, "data", "recommended");
  if (fs.existsSync(bundled)) {
    return bundled;
  }
  // Dev-only fallback to the sibling course repo. Gated on NODE_ENV so the
  // branch is dead-code-eliminated in a production build: a traced path that
  // escapes the project root (ROOT/..) makes Turbopack give up and pull the
  // whole project — .git included — into the function bundle, which is what
  // blew the Vercel build container's disk.
  if (process.env.NODE_ENV !== "production") {
    const sibling = path.join(ROOT, "..", "pscp-69070027", "recommended");
    if (fs.existsSync(sibling)) {
      return sibling;
    }
  }
  return bundled;
}

export interface ChecklistInfo {
  total: number;
  checked: number;
  completed: boolean;
}

export interface ProblemStats {
  passed: number;
  attempt: number;
  percentage: string;
  expireDate: string;
}

export const IJUDGE_SCRAPED_STATS: Record<number, ProblemStats> = {
  2996: { passed: 211, attempt: 215, percentage: "98.14%", expireDate: "16 August 2026, 23:59" },
  2997: { passed: 211, attempt: 214, percentage: "98.60%", expireDate: "16 August 2026, 23:59" },
  2998: { passed: 211, attempt: 214, percentage: "98.60%", expireDate: "16 August 2026, 23:59" },
  3019: { passed: 209, attempt: 215, percentage: "97.21%", expireDate: "16 August 2026, 23:59" },
  3020: { passed: 196, attempt: 207, percentage: "94.69%", expireDate: "17 August 2026, 00:00" },
  3022: { passed: 199, attempt: 213, percentage: "93.43%", expireDate: "17 August 2026, 00:00" },
  3159: { passed: 182, attempt: 183, percentage: "99.45%", expireDate: "4 September 2026, 00:00" },
  3167: { passed: 180, attempt: 183, percentage: "98.36%", expireDate: "4 September 2026, 00:00" },
  3226: { passed: 92, attempt: 160, percentage: "57.50%", expireDate: "11 September 2026, 00:00" },
  3237: { passed: 161, attempt: 167, percentage: "96.41%", expireDate: "11 September 2026, 00:00" },
};

export interface RecommendedProblem {
  id: number;
  slug: string; // e.g. "oj2996-swap-characters"
  folderName: string; // e.g. "oj2996-Swap_Characters"
  title: string; // full raw title from problem.md (e.g. "OJ 2996: [Recommend] [LEARNING LOGS] สลับตัวอักษร")
  cleanName: string; // e.g. "สลับตัวอักษร" or "Coke"
  status: "passed" | "in_progress";
  statusLabel: string; // e.g. "Passed" | "In Progress"
  technique: string; // e.g. "String slicing [::-1], .lower()"
  learningLog: boolean;
  difficulty: number;
  stats: ProblemStats;
  url: string;
  hasCode: boolean;
  pythonCode: string | null;
  markdown: string;
  /** Thai translation of problem.md, when a problem.th.md exists beside it. */
  markdownTh: string | null;
  checklist: ChecklistInfo;
}

export interface RecommendedProblemDetail extends RecommendedProblem {
  prev: RecommendedProblemSummary | null;
  next: RecommendedProblemSummary | null;
  index: number;
  total: number;
}

export interface RecommendedProblemSummary {
  id: number;
  slug: string;
  cleanName: string;
  status: "passed" | "in_progress";
  technique: string;
}

export interface RecommendedHubData {
  overviewMd: string;
  /** Thai translation of README.md, when a README.th.md exists beside it. */
  overviewMdTh: string | null;
  problems: RecommendedProblem[];
  passedCount: number;
  inProgressCount: number;
  learningLogCount: number;
}

export const RECOMMENDED_STATUS_EVENT = "ihelp-recommended-status-changed";
export const RECOMMENDED_STATUS_KEY = "ihelp-recommended-status";

export function getStoredProblemStatuses(): Record<number, "passed" | "in_progress"> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(RECOMMENDED_STATUS_KEY);
    if (!raw) return {};
    return JSON.parse(raw) ?? {};
  } catch {
    return {};
  }
}

export function setStoredProblemStatus(id: number, status: "passed" | "in_progress"): void {
  if (typeof window === "undefined") return;
  const current = getStoredProblemStatuses();
  current[id] = status;
  window.localStorage.setItem(RECOMMENDED_STATUS_KEY, JSON.stringify(current));
  window.dispatchEvent(new Event(RECOMMENDED_STATUS_EVENT));
}

export function parseChecklist(markdown: string): ChecklistInfo {
  const checked = (markdown.match(/- \[[xX]\]/g) || []).length;
  const unchecked = (markdown.match(/- \[ \]/g) || []).length;
  const total = checked + unchecked;
  return {
    total,
    checked,
    completed: total > 0 && checked === total,
  };
}

function parseIdFromFolder(folder: string): number {
  const m = folder.match(/oj(\d+)/i);
  return m ? parseInt(m[1], 10) : 0;
}

function parseOverviewTable(
  readmeContent: string,
): Map<number, { status: "passed" | "in_progress"; technique: string; name: string }> {
  const map = new Map<
    number,
    { status: "passed" | "in_progress"; technique: string; name: string }
  >();
  const lines = readmeContent.split("\n");
  for (const line of lines) {
    if (!line.includes("|")) continue;
    const parts = line.split("|").map((p) => p.trim());
    if (parts.length < 5) continue;
    const idMatch = parts[1].match(/\b(\d{4})\b/);
    if (!idMatch) continue;
    const id = parseInt(idMatch[1], 10);
    const problemName = parts[3] || "";
    const col4 = parts[4] || "";
    const col5 = parts[5] || "";
    const hasStatus =
      col4.includes("Passed") ||
      col4.includes("✅") ||
      col4.includes("Progress") ||
      col4.includes("🔄");
    const isPassed = col4.includes("Passed") || col4.includes("✅");
    const technique = hasStatus ? col5 : (col5 || col4);
    map.set(id, {
      status: isPassed ? "passed" : "in_progress",
      technique,
      name: problemName,
    });
  }
  return map;
}

function extractCleanTitle(firstHeading: string, fallback: string): string {
  if (!firstHeading) return fallback;
  return firstHeading
    .replace(/^#\s*/, "")
    .replace(/^OJ\s*\d+:\s*/i, "")
    .replace(/\[\s*(?:LEARNING\s*LOGS?|RECOMMEND(?:ED)?)\s*\]/gi, "")
    .trim() || fallback;
}

export function loadRecommendedProblems(): RecommendedProblem[] {
  const dir = getRecommendedDir();
  if (!fs.existsSync(dir)) {
    return [];
  }

  let readmeContent = "";
  const readmePath = path.join(dir, "README.md");
  if (fs.existsSync(readmePath)) {
    readmeContent = fs.readFileSync(readmePath, "utf-8");
  }
  const tableData = parseOverviewTable(readmeContent);

  // Load master problems from oj_problems.json for extra metadata
  let masterMap = new Map<number, MasterProblem>();
  try {
    const masterList = loadProblems();
    masterMap = new Map(masterList.map((p) => [p.id, p]));
  } catch {
    // ignore if master not available
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const problemFolders = entries
    .filter((e) => e.isDirectory() && e.name.startsWith("oj"))
    .sort((a, b) => {
      const idA = parseIdFromFolder(a.name);
      const idB = parseIdFromFolder(b.name);
      return idA - idB;
    });

  const list: RecommendedProblem[] = [];

  for (const folder of problemFolders) {
    const folderPath = path.join(dir, folder.name);
    const id = parseIdFromFolder(folder.name);
    const mdPath = path.join(folderPath, "problem.md");
    const mdThPath = path.join(folderPath, "problem.th.md");
    const pyPath = path.join(folderPath, "main.py");

    let markdown = "";
    if (fs.existsSync(mdPath)) {
      markdown = fs.readFileSync(mdPath, "utf-8");
    }

    // Locale is resolved on the client, so ship both variants and let the
    // reader pick. Same .md / .th.md pairing the guidelines library uses.
    let markdownTh: string | null = null;
    if (fs.existsSync(mdThPath)) {
      markdownTh = fs.readFileSync(mdThPath, "utf-8");
    }

    let pythonCode: string | null = null;
    if (fs.existsSync(pyPath)) {
      pythonCode = fs.readFileSync(pyPath, "utf-8");
    }

    const firstHeadingMatch = markdown.match(/^#\s+(.+)$/m);
    const heading = firstHeadingMatch ? firstHeadingMatch[1].trim() : folder.name;

    const master = masterMap.get(id);
    const meta = tableData.get(id);

    const isPassed = meta
      ? meta.status === "passed"
      : markdown.includes("- [x]");

    const cleanName = meta?.name
      ? meta.name
      : master?.cleanName
      ? master.cleanName
      : extractCleanTitle(heading, folder.name);

    const technique = meta?.technique || "";
    const isLearningLog =
      master?.learningLog ??
      (/\[\s*learning\s*logs?\s*\]/i.test(heading) ||
        (pythonCode ? /\[\s*learning\s*logs?\s*\]/i.test(pythonCode) : false));

    const slug = folder.name;

    list.push({
      id,
      slug,
      folderName: folder.name,
      title: heading,
      cleanName,
      status: isPassed ? "passed" : "in_progress",
      statusLabel: isPassed ? "Passed" : "In Progress",
      technique,
      learningLog: isLearningLog,
      difficulty: master?.difficulty ?? 0,
      stats: IJUDGE_SCRAPED_STATS[id] || {
        passed: 0,
        attempt: 0,
        percentage: "0.00%",
        expireDate: "",
      },
      url: master?.url ?? `https://ijudge.it.kmitl.ac.th/problems/${id}/description`,
      hasCode: Boolean(pythonCode && pythonCode.trim().length > 0),
      pythonCode,
      markdown,
      markdownTh,
      checklist: parseChecklist(markdown),
    });
  }

  return list;
}

export function loadRecommendedHub(): RecommendedHubData {
  const dir = getRecommendedDir();
  let overviewMd = "";
  const readmePath = path.join(dir, "README.md");
  if (fs.existsSync(readmePath)) {
    overviewMd = fs.readFileSync(readmePath, "utf-8");
  }

  let overviewMdTh: string | null = null;
  const readmeThPath = path.join(dir, "README.th.md");
  if (fs.existsSync(readmeThPath)) {
    overviewMdTh = fs.readFileSync(readmeThPath, "utf-8");
  }

  const problems = loadRecommendedProblems();
  const passedCount = problems.filter((p) => p.status === "passed").length;
  const inProgressCount = problems.filter((p) => p.status === "in_progress").length;
  const learningLogCount = problems.filter((p) => p.learningLog).length;

  return {
    overviewMd,
    overviewMdTh,
    problems,
    passedCount,
    inProgressCount,
    learningLogCount,
  };
}

export function loadRecommendedProblem(slugOrId: string): RecommendedProblemDetail | null {
  const problems = loadRecommendedProblems();
  if (problems.length === 0) return null;

  const normalized = decodeURIComponent(slugOrId).toLowerCase().trim();
  const idNum = parseInt(normalized.replace(/^[^\d]*/, ""), 10);

  const index = problems.findIndex((p) => {
    if (p.slug.toLowerCase() === normalized) return true;
    if (p.folderName.toLowerCase() === normalized) return true;
    if (String(p.id) === normalized) return true;
    if (idNum > 0 && p.id === idNum) return true;
    if (p.slug.toLowerCase().replace(/[^a-z0-9]/g, "") === normalized.replace(/[^a-z0-9]/g, "")) return true;
    return false;
  });

  if (index === -1) return null;

  const current = problems[index];
  const prevProblem = index > 0 ? problems[index - 1] : null;
  const nextProblem = index < problems.length - 1 ? problems[index + 1] : null;

  return {
    ...current,
    index,
    total: problems.length,
    prev: prevProblem
      ? {
          id: prevProblem.id,
          slug: prevProblem.slug,
          cleanName: prevProblem.cleanName,
          status: prevProblem.status,
          technique: prevProblem.technique,
        }
      : null,
    next: nextProblem
      ? {
          id: nextProblem.id,
          slug: nextProblem.slug,
          cleanName: nextProblem.cleanName,
          status: nextProblem.status,
          technique: nextProblem.technique,
        }
      : null,
  };
}
