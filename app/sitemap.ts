import type { MetadataRoute } from "next";
import { loadRecommendedProblems } from "@/lib/recommended";
import { loadLibrary } from "@/lib/library";
import { LIBRARY_COMING_SOON } from "@/lib/flags";
import { COURSES, courseDir } from "@/lib/catalog";
import { resolveCourseSpine } from "@/lib/course-spine";
import type { ModuleId } from "@/lib/spine";

// Keep this in sync with SITE_URL in app/layout.tsx.
const SITE_URL = "https://pscp.chatan.in.th";

type Entry = MetadataRoute.Sitemap[number];

/** Routes that exist regardless of what content is on disk. */
const STATIC_ROUTES: { path: string; priority: number; changeFrequency: Entry["changeFrequency"] }[] = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/pscp", priority: 0.9, changeFrequency: "daily" },
  { path: "/recommended", priority: 0.8, changeFrequency: "weekly" },
  { path: "/library", priority: 0.6, changeFrequency: "monthly" },
  { path: "/make/submission", priority: 0.6, changeFrequency: "monthly" },
  { path: "/make/reflection", priority: 0.6, changeFrequency: "monthly" },
  { path: "/version", priority: 0.3, changeFrequency: "weekly" },
];

/**
 * How much of a course's crawl budget each module deserves.
 *
 * Used to be thirty hand-written rows, one per course-module pair, which listed
 * `/analysis` and `/plan` for courses that had them and silently omitted the
 * same modules for courses that did not. Generated from the spine now: a course
 * that gains a module gains its sitemap entry in the same commit.
 */
const MODULE_PRIORITY: Record<ModuleId, number> = {
  orientation: 0.8,
  syllabus_map: 0.6,
  deep_summary: 0.7,
  cram_sheet: 0.6,
  key_cards: 0.5,
  drill: 0.7,
  speed_quiz: 0.6,
  applied: 0.7,
  mock_exam: 0.6,
  weak_spot: 0.5,
  archive: 0.6,
};

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = STATIC_ROUTES.map((r) => ({
    url: `${SITE_URL}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  for (const course of COURSES) {
    const dir = courseDir(course);
    entries.push({
      url: `${SITE_URL}/courses/${dir}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    });

    for (const mod of resolveCourseSpine(course.code, dir)) {
      // An unbound module is a locked slot with no page, and one with its own
      // href is another route's entry to claim.
      if (mod.status !== "available" || !mod.href) continue;
      if (!mod.href.startsWith(`/courses/${dir}/`)) continue;
      entries.push({
        url: `${SITE_URL}${mod.href}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: MODULE_PRIORITY[mod.id],
      });
    }
  }

  for (const problem of loadRecommendedProblems()) {
    entries.push({
      url: `${SITE_URL}/recommended/${problem.slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  // Skipped behind the cover: these routes 404 while the flag is set, and a
  // sitemap full of 404s is worse than an absent entry.
  if (!LIBRARY_COMING_SOON) {
    for (const doc of loadLibrary()) {
      entries.push({
        url: `${SITE_URL}/library/${doc.slug}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.5,
      });
    }
  }

  return entries;
}
