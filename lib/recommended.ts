import fs from "fs";
import path from "path";
import { ROOT } from "@/lib/paths";
import { loadProblems, type MasterProblem } from "@/lib/master";

// Locate recommended directory
export function getRecommendedDir(): string {
  if (process.env.RECOMMENDED_PATH && fs.existsSync(process.env.RECOMMENDED_PATH)) {
    return process.env.RECOMMENDED_PATH;
  }
  const bundled = path.join(ROOT, "data", "recommended");
  if (fs.existsSync(bundled)) {
    return bundled;
  }
  const sibling = path.join(ROOT, "..", "pscp-69070027", "recommended");
  if (fs.existsSync(sibling)) {
    return sibling;
  }
  return bundled;
}

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
  url: string;
  hasCode: boolean;
  pythonCode: string | null;
  markdown: string;
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
  problems: RecommendedProblem[];
  passedCount: number;
  inProgressCount: number;
  learningLogCount: number;
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
    if (parts.length < 6) continue;
    const idMatch = parts[1].match(/\b(\d{4})\b/);
    if (!idMatch) continue;
    const id = parseInt(idMatch[1], 10);
    const problemName = parts[3] || "";
    const statusCol = parts[4] || "";
    const isPassed = statusCol.includes("Passed") || statusCol.includes("✅");
    const technique = parts[5] || "";
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
    const pyPath = path.join(folderPath, "main.py");

    let markdown = "";
    if (fs.existsSync(mdPath)) {
      markdown = fs.readFileSync(mdPath, "utf-8");
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
      url: master?.url ?? `https://ijudge.it.kmitl.ac.th/problems/${id}/description`,
      hasCode: Boolean(pythonCode && pythonCode.trim().length > 0),
      pythonCode,
      markdown,
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

  const problems = loadRecommendedProblems();
  const passedCount = problems.filter((p) => p.status === "passed").length;
  const inProgressCount = problems.filter((p) => p.status === "in_progress").length;
  const learningLogCount = problems.filter((p) => p.learningLog).length;

  return {
    overviewMd,
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
