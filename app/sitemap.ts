import type { MetadataRoute } from "next";
import { loadRecommendedProblems } from "@/lib/recommended";
import { loadLibrary } from "@/lib/library";
import { COURSES, courseHref } from "@/lib/catalog";

// Keep this in sync with SITE_URL in app/layout.tsx.
const SITE_URL = "https://pscp.chatan.in.th";

export const dynamic = "force-dynamic";

type Entry = MetadataRoute.Sitemap[number];

// Static routes that exist regardless of what content is on disk.
const STATIC_ROUTES: { path: string; priority: number; changeFrequency: Entry["changeFrequency"] }[] = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/pscp", priority: 0.9, changeFrequency: "daily" },
  { path: "/recommended", priority: 0.8, changeFrequency: "weekly" },
  { path: "/library", priority: 0.6, changeFrequency: "monthly" },
  { path: "/courses/06016402-IT-Fundamentals", priority: 0.8, changeFrequency: "weekly" },
  { path: "/courses/06016402-IT-Fundamentals/summary", priority: 0.7, changeFrequency: "monthly" },
  { path: "/courses/06016402-IT-Fundamentals/quiz", priority: 0.7, changeFrequency: "monthly" },
  { path: "/courses/06016402-IT-Fundamentals/library", priority: 0.6, changeFrequency: "monthly" },
  { path: "/courses/06016411-Intro-to-Computer-Systems", priority: 0.8, changeFrequency: "weekly" },
  { path: "/courses/06016411-Intro-to-Computer-Systems/summary", priority: 0.7, changeFrequency: "monthly" },
  { path: "/courses/06016411-Intro-to-Computer-Systems/quiz", priority: 0.7, changeFrequency: "monthly" },
  { path: "/courses/06016411-Intro-to-Computer-Systems/library", priority: 0.6, changeFrequency: "monthly" },
  { path: "/courses/06016411-Intro-to-Computer-Systems/exam", priority: 0.6, changeFrequency: "monthly" },
  { path: "/courses/06016411-Intro-to-Computer-Systems/analysis", priority: 0.5, changeFrequency: "monthly" },
  { path: "/courses/06016401-Math-for-IT", priority: 0.8, changeFrequency: "weekly" },
  { path: "/courses/06016401-Math-for-IT/summary", priority: 0.7, changeFrequency: "monthly" },
  { path: "/courses/06016401-Math-for-IT/quiz", priority: 0.7, changeFrequency: "monthly" },
  { path: "/courses/06016401-Math-for-IT/library", priority: 0.6, changeFrequency: "monthly" },
  { path: "/courses/06016401-Math-for-IT/exam", priority: 0.6, changeFrequency: "monthly" },
  { path: "/courses/06016401-Math-for-IT/cram", priority: 0.6, changeFrequency: "monthly" },
  { path: "/courses/06016401-Math-for-IT/plan", priority: 0.6, changeFrequency: "monthly" },
  { path: "/courses/06016401-Math-for-IT/mock", priority: 0.6, changeFrequency: "monthly" },
  { path: "/courses/01006012-Computer-Programming", priority: 0.7, changeFrequency: "weekly" },
  { path: "/courses/01006012-Computer-Programming/summary", priority: 0.6, changeFrequency: "monthly" },
  { path: "/courses/01006012-Computer-Programming/quiz", priority: 0.6, changeFrequency: "monthly" },
  { path: "/courses/01006012-Computer-Programming/library", priority: 0.5, changeFrequency: "monthly" },
  { path: "/courses/General-Chemistry", priority: 0.7, changeFrequency: "weekly" },
  { path: "/courses/General-Chemistry/summary", priority: 0.6, changeFrequency: "monthly" },
  { path: "/courses/General-Chemistry/quiz", priority: 0.6, changeFrequency: "monthly" },
  { path: "/courses/General-Chemistry/library", priority: 0.5, changeFrequency: "monthly" },
  { path: "/make/submission", priority: 0.6, changeFrequency: "monthly" },
  { path: "/make/reflection", priority: 0.6, changeFrequency: "monthly" },
  { path: "/version", priority: 0.3, changeFrequency: "weekly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = STATIC_ROUTES.map((r) => ({
    url: `${SITE_URL}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  for (const problem of loadRecommendedProblems()) {
    entries.push({
      url: `${SITE_URL}/recommended/${problem.slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  for (const doc of loadLibrary()) {
    entries.push({
      url: `${SITE_URL}/library/${doc.slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    });
  }

  // Catalogue courses
  for (const course of COURSES) {
    const href = courseHref(course);
    if (!href || !href.startsWith("/courses/")) continue;
    if (STATIC_ROUTES.some((r) => r.path === href)) continue;
    entries.push({
      url: `${SITE_URL}${href}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }

  return entries;
}
