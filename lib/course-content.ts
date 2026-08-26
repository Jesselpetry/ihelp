import fs from "fs";
import path from "path";
import { ROOT } from "@/lib/paths";
import {
  COURSES,
  courseDir,
  resolveCourse,
  type CatalogCourse,
} from "@/lib/catalog";
import scrapedSubjectsJson from "@/lib/it-kmitl-scraped.json";

export interface ScrapedCourseInfo {
  code: string;
  dir: string;
  officialCode: string;
  year: number;
  term: number;
  termId: string;
  nameTh: string;
  credits: string;
  descTh: string;
  descEn: string;
  prerequisites: string;
  instructors: { name: string; role: string; profileUrl?: string }[];
  programs: { name: string; year: string; url?: string }[];
}

export function getCourseScrapedInfo(codeOrDir: string): ScrapedCourseInfo | null {
  const course = resolveCourse(codeOrDir);
  const code = course ? course.code : codeOrDir;
  return (scrapedSubjectsJson as Record<string, ScrapedCourseInfo>)[code] ?? null;
}

// Course-overview documents ported from iLearn's content/summaries tree.
// Override the folder with COURSE_CONTENT_PATH, same pattern as OJ_PROBLEMS_PATH.
const COURSES_DIR =
  process.env.COURSE_CONTENT_PATH ?? path.join(ROOT, "content", "courses");

function overviewPath(dir: string): string {
  return path.join(COURSES_DIR, dir, "summary.md");
}

/** Directory names that actually have an overview on disk. */
export function listCourseOverviews(): string[] {
  return COURSES.map(courseDir).filter((dir) => fs.existsSync(overviewPath(dir)));
}

export function loadCourseOverview(param: string): string | null {
  const course = resolveCourse(param);
  const dir = course ? courseDir(course) : param;
  const file = overviewPath(dir);
  return fs.existsSync(file) ? fs.readFileSync(file, "utf-8") : null;
}

export function courseWithOverview(param: string): CatalogCourse | undefined {
  const course = resolveCourse(param);
  if (!course) return undefined;
  const dir = courseDir(course);
  return fs.existsSync(overviewPath(dir)) ? course : undefined;
}


/**
 * Any Markdown file inside a course directory, by path relative to it.
 *
 * Exists for the archive/ tree. Twenty-eight files sat under
 * each course's archive/ folder that no route read — among them MFIT's weeks 8-15,
 * which is the only final-scope material in the whole project. loadCourseOverview()
 * only ever opens summary.md, so nothing could reach them.
 *
 * Traversal outside the course directory is refused rather than sanitized: a
 * content path is authored, never user input, so a "../" in one is a bug to
 * surface, not something to quietly repair.
 */
export function loadCourseDoc(param: string, relPath: string): string | null {
  const course = resolveCourse(param);
  const dir = course ? courseDir(course) : param;
  const base = path.join(COURSES_DIR, dir);
  const file = path.join(base, relPath);
  if (!file.startsWith(base + path.sep)) return null;
  return fs.existsSync(file) ? fs.readFileSync(file, "utf-8") : null;
}

/** Reads a JSON file inside a course directory. Returns null when absent or invalid. */
export function loadCourseJson<T>(param: string, relPath: string): T | null {
  const raw = loadCourseDoc(param, relPath);
  if (raw === null) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}
