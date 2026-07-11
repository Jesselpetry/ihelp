import path from "path";

// Standalone project: bundled course data lives in ./data at the project root.
export const ROOT = process.cwd();
const DATA_DIR = path.join(ROOT, "data");

// Master problem list exported from iJudge. Override with OJ_PROBLEMS_PATH.
export const OJ_PROBLEMS_FILE =
  process.env.OJ_PROBLEMS_PATH ?? path.join(DATA_DIR, "oj_problems.json");

const TEMPLATES_DIR = path.join(DATA_DIR, "templates");

export function submissionTemplatePath(locale: "en" | "th"): string {
  return path.join(
    TEMPLATES_DIR,
    locale === "th" ? "SUBMISSION_TEMPLATE.th.md" : "SUBMISSION_TEMPLATE.md",
  );
}

export function reflectionTemplatePath(locale: "en" | "th"): string {
  return path.join(
    TEMPLATES_DIR,
    locale === "th" ? "AI_REFLECTION_TEMPLATE.th.md" : "AI_REFLECTION_TEMPLATE.md",
  );
}
