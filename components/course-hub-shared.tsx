"use client";

import {
  BookOpenText,
  BrainCircuit,
  CalendarRange,
  FileCheck2,
  Flag,
  FlaskConical,
  Layers,
  Library,
  Map as MapIcon,
  Milestone,
  ScrollText,
  Target,
  Timer,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";
import type { LText } from "@/lib/i18n";
import type { ModuleId, ModuleScope, Phase, ResolvedModule } from "@/lib/courses/spine";

/**
 * What the course hub's pieces — banner, sidebar, overview, stream — agree on.
 *
 * The hub is laid out like a Google Classroom class page: one banner, a narrow
 * sidebar of topics and shortcuts, and a single-column stream of topic
 * sections. The sidebar links to sections the stream renders and filters by a
 * scope the stream obeys, so the ids, the scope vocabulary and the module
 * grouping live here once instead of being kept in step across four files.
 */

/** One icon per module. */
export const MODULE_ICONS: Record<ModuleId, LucideIcon> = {
  orientation: ScrollText,
  syllabus_map: MapIcon,
  deep_summary: BookOpenText,
  cram_sheet: Zap,
  key_cards: Layers,
  drill: BrainCircuit,
  speed_quiz: Timer,
  applied: FlaskConical,
  mock_exam: FileCheck2,
  weak_spot: Wrench,
  archive: Library,
};

/** One icon per category, so a reader can tell the four apart without reading. */
export const PHASE_ICONS: Record<Phase, LucideIcon> = {
  orient: BookOpenText,
  compress: Zap,
  retrieve: Target,
  prove: FileCheck2,
};

export const PHASE_ORDER: Phase[] = ["orient", "compress", "retrieve", "prove"];

/** Short sidebar labels for the four categories; PHASE_CATEGORY is the long form. */
export const PHASE_SHORT: Record<Phase, LText> = {
  orient: { th: "ปูพื้นฐาน", en: "Foundation" },
  compress: { th: "ย่อก่อนสอบ", en: "Cram" },
  retrieve: { th: "ตะลุยโจทย์", en: "Practice" },
  prove: { th: "แนวข้อสอบ", en: "Mock exams" },
};

export const SCOPE_OPTIONS = ["all", "midterm", "final"] as const;

export const SCOPE_ICON: Record<ModuleScope, LucideIcon> = {
  all: CalendarRange,
  midterm: Milestone,
  final: Flag,
};

export const SCOPE_LABEL: Record<ModuleScope, LText> = {
  all: { th: "ทั้งหมด", en: "All" },
  midterm: { th: "มิดเทอม", en: "Midterm" },
  final: { th: "ไฟนอล", en: "Final" },
};

/**
 * One hue — the course's `primary` — at two volumes. Kept in step with the
 * same map in components/subject-library.tsx and components/module-index.tsx.
 */
export const SCOPE_BADGE: Record<Exclude<ModuleScope, "all">, string> = {
  midterm: "border-transparent bg-primary text-primary-foreground shadow-xs",
  final: "border-primary/30 bg-primary/10 text-primary",
};

/** Anchor ids the sidebar's topic list scrolls to. */
export const OVERVIEW_ANCHOR = "course-overview";
export function phaseAnchor(phase: Phase): string {
  return `topic-${phase}`;
}

/** Nothing behind it yet, or no route to it. */
export function isLocked(mod: ResolvedModule): boolean {
  return mod.status !== "available" || !mod.href;
}

/** The archive, when it has something to open — the sidebar's resource box. */
export function openArchive(modules: ResolvedModule[]): ResolvedModule | undefined {
  return modules.find((mod) => mod.id === "archive" && !isLocked(mod));
}

/** A course whose every module applies all term has nothing to filter. */
export function hasScopes(modules: ResolvedModule[]): boolean {
  return modules.some((mod) => mod.scope !== "all");
}

export interface TopicGroup {
  phase: Phase;
  /** Openable modules, spine order. */
  open: ResolvedModule[];
  /** On the spine, nothing behind it yet. */
  locked: ResolvedModule[];
}

/**
 * The stream's topic sections for one scope: the open archive removed (it lives
 * in the sidebar), modules of the other half of the term dropped, grouped by
 * phase in spine order. Groups with neither open nor locked modules are left out.
 */
export function topicGroups(modules: ResolvedModule[], scope: ModuleScope): TopicGroup[] {
  const archive = openArchive(modules);
  const shown = modules.filter(
    (mod) =>
      mod !== archive && (scope === "all" || mod.scope === scope || mod.scope === "all"),
  );
  return PHASE_ORDER.map((phase) => {
    const items = shown.filter((mod) => mod.phase === phase).sort((a, b) => a.order - b.order);
    return {
      phase,
      open: items.filter((mod) => !isLocked(mod)),
      locked: items.filter(isLocked),
    };
  }).filter((group) => group.open.length + group.locked.length > 0);
}

/**
 * A topic heading in the stream, Classroom-style: the title in the course
 * colour over a hairline rule, an optional quiet pill beside it, no box.
 */
export function TopicHeader({
  id,
  title,
  aside,
}: {
  id: string;
  title: string;
  aside?: ReactNode;
}) {
  return (
    <div id={id} className="mb-3 flex scroll-mt-24 items-end justify-between gap-3 border-b border-primary/25 pb-2">
      <h2 className="text-lg font-semibold text-primary sm:text-xl">{title}</h2>
      {aside}
    </div>
  );
}

/** The flat card surface every stream item and sidebar box uses. */
export const SURFACE =
  "rounded-2xl bg-card shadow-[0_1px_2px_rgba(16,24,40,0.06),0_1px_3px_rgba(16,24,40,0.08)] dark:shadow-none dark:ring-1 dark:ring-border";

/** The two readings of "what is this course": the curated summary, the faculty's text. */
export type OverviewTab = "summary" | "official";

export const OVERVIEW_TAB_LABEL: Record<OverviewTab, LText> = {
  summary: { th: "ฉบับย่อ", en: "Summary" },
  official: { th: "ทางการ", en: "Official" },
};

export const OVERVIEW_TITLE: LText = { th: "ภาพรวม", en: "Overview" };
