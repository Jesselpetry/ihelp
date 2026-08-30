import type { LText } from "@/lib/i18n";
import { COURSE_BINDINGS, type ModuleBinding } from "@/lib/course-bindings";
import { coursesWithAssets } from "@/lib/subject-library";
import {
  STANDARD_SPINE,
  type ModuleId,
  type ModuleStatus,
  type ResolvedModule,
  type SpineMetrics,
} from "@/lib/spine";

/**
 * Joins the eleven-module spine to what a course actually bound.
 *
 * Split from lib/spine.ts because it reaches the filesystem: a binding's docs
 * are loaders, and asking whether a module is filled means asking whether its
 * markdown is on disk. Client components import the spine for its types and
 * labels, so the spine itself has to stay free of `fs`.
 */

const COMING_SOON: LText = { th: "เร็วๆ นี้", en: "Coming soon" };

/**
 * Modules whose content lives in a registry rather than in a binding.
 *
 * The asset library is built from the file tree by
 * scripts/build-library-manifest.mjs, so a course's archive is filled by what
 * is on disk, not by anything anyone wrote into a binding.
 */
const REGISTRY_SOURCES: Partial<Record<ModuleId, (code: string) => boolean>> = {
  archive: (code) => coursesWithAssets().has(code.toUpperCase()),
};

/** Whether a binding has anything to show. */
function isFilled(
  binding: ModuleBinding | undefined,
  id: ModuleId,
  code: string,
): binding is ModuleBinding {
  if (!binding) return false;
  if (binding.href) return true;
  if (binding.filled?.()) return true;
  if (binding.bank && binding.bank().length > 0) return true;
  if (binding.docs?.some((doc) => doc.load() !== null)) return true;
  return REGISTRY_SOURCES[id]?.(code) ?? false;
}

function libraryStats(library: SpineMetrics["library"]): LText | undefined {
  if (!library) return undefined;
  const { pdfs, images, docs } = library;
  const th: string[] = [];
  const en: string[] = [];
  if (pdfs) { th.push(`${pdfs} PDF`); en.push(`${pdfs} PDF${pdfs > 1 ? "s" : ""}`); }
  if (images) { th.push(`${images} ภาพ`); en.push(`${images} image${images > 1 ? "s" : ""}`); }
  if (docs) { th.push(`${docs} เอกสาร`); en.push(`${docs} doc${docs > 1 ? "s" : ""}`); }
  return th.length ? { th: th.join(" · "), en: en.join(" · ") } : undefined;
}

/**
 * Every module a course offers, always all eleven, always in spine order.
 *
 * `courseDir` is the directory segment the hrefs are built from. Counts come
 * from `metrics` rather than from a hand-typed string, so a badge can never
 * drift from the bank it describes — the old hub had "63 ข้อ" and "65 ข้อ"
 * written into two different files.
 */
export function resolveCourseSpine(
  code: string,
  courseDir: string,
  metrics: SpineMetrics = {},
): ResolvedModule[] {
  const bindings = COURSE_BINDINGS[code.toUpperCase()] ?? {};

  return STANDARD_SPINE.map((spec): ResolvedModule => {
    const binding = bindings[spec.id];
    const filled = isFilled(binding, spec.id, code);
    const status: ModuleStatus = filled ? "available" : "coming_soon";
    const href = filled
      ? (binding.href ?? `/courses/${courseDir}/${spec.segment}`)
      : undefined;

    const questionCount = metrics.questions?.[spec.id];
    let badge: LText | undefined;
    if (!filled) {
      badge = COMING_SOON;
    } else if (questionCount) {
      badge = { th: `${questionCount} ข้อ`, en: `${questionCount} questions` };
    }

    return {
      id: spec.id,
      phase: spec.phase,
      order: spec.order,
      title: binding?.title ?? spec.title,
      subtitle: binding?.subtitle ?? spec.subtitle,
      scope: binding?.scope ?? spec.scope,
      status,
      href,
      badge,
      stats: filled && spec.id === "archive" ? libraryStats(metrics.library) : undefined,
      note: filled ? binding.note : undefined,
    };
  });
}

/** One module of one course, or null when the course does not bind it. */
export function resolveModule(
  code: string,
  id: ModuleId,
  courseDir: string,
  metrics: SpineMetrics = {},
): ResolvedModule | null {
  const resolved = resolveCourseSpine(code, courseDir, metrics).find((m) => m.id === id);
  return resolved && resolved.status === "available" ? resolved : null;
}

/**
 * The raw binding behind one module, loaders and all.
 *
 * Server-only by nature: what it returns cannot cross into a client component.
 * Routes use it to read a module's documents or its question bank.
 */
export function moduleBinding(code: string, id: ModuleId): ModuleBinding | undefined {
  return (COURSE_BINDINGS[code.toUpperCase()] ?? {})[id];
}

/** How many of the eleven modules a course actually fills — the Readiness Index. */
export function readinessIndex(code: string, courseDir: string): number {
  return resolveCourseSpine(code, courseDir).filter((m) => m.status === "available").length;
}
