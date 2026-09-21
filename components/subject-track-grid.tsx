"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpenText,
  BrainCircuit,
  CalendarRange,
  ChevronDown,
  FileCheck2,
  Flag,
  FlaskConical,
  Layers,
  Library,
  Lock,
  Map as MapIcon,
  Milestone,
  ScrollText,
  Target,
  Timer,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useLocale, t, type LText } from "@/lib/i18n";
import {
  PHASE_CATEGORY,
  PHASE_GOAL,
  type ModuleId,
  type ModuleScope,
  type Phase,
  type ResolvedModule,
} from "@/lib/spine";

/**
 * One icon per module. Keyed by ModuleId rather than by a separate icon union:
 * the two used to be different sizes — six track kinds against ten icons — which
 * is why the compact chip row could never show a cram sheet or an exam analysis.
 */
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
const PHASE_ICONS: Record<Phase, LucideIcon> = {
  orient: BookOpenText,
  compress: Zap,
  retrieve: Target,
  prove: FileCheck2,
};

const SCOPE_ICON: Record<ModuleScope, LucideIcon> = {
  all: CalendarRange,
  midterm: Milestone,
  final: Flag,
};

const SCOPE_OPTIONS = ["all", "midterm", "final"] as const;

/**
 * Two labels per scope: the short one fits three-across on a 360px phone, the
 * long one says what the choice actually means. The control shows the short
 * label and a line under it spells out the active filter in full.
 */
const SCOPE_LABEL: Record<ModuleScope, LText> = {
  all: { th: "ทั้งหมด", en: "All" },
  midterm: { th: "มิดเทอม", en: "Midterm" },
  final: { th: "ไฟนอล", en: "Final" },
};

const SCOPE_DESCRIPTION: Record<ModuleScope, LText> = {
  all: {
    th: "กำลังแสดงทุกอย่างในวิชานี้ ทั้งก่อนและหลังมิดเทอม",
    en: "Showing everything in the course, both halves of the term",
  },
  midterm: {
    th: "กำลังแสดงเฉพาะสิ่งที่ใช้เตรียมสอบมิดเทอม",
    en: "Showing only what the midterm asks for",
  },
  final: {
    th: "กำลังแสดงเฉพาะสิ่งที่ใช้เตรียมสอบไฟนอล",
    en: "Showing only what the final asks for",
  },
};

/**
 * Marks a card that only applies to one half of the term.
 *
 * One hue — the KMITL brand blue — at two volumes, so the milestone reads as a
 * single family rather than two unrelated colours. Uses the `primary` token
 * rather than a literal #2357A5: the hub layout rebinds it per course, and it
 * relights to #5c9bf5 in dark mode.
 *
 * Kept in step with the same map in components/subject-library.tsx.
 */
const SCOPE_BADGE: Record<Exclude<ModuleScope, "all">, string> = {
  midterm: "border-transparent bg-primary text-primary-foreground shadow-xs",
  final: "border-primary/30 bg-primary/10 text-primary",
};

const L = {
  heading: { th: "เนื้อหาและแบบฝึกหัดในวิชานี้", en: "What this course gives you" },
  lead: {
    th: "เลือกหมวดไหนก่อนก็ได้ — ลำดับด้านล่างคือลำดับที่แนะนำ ไม่ใช่ข้อบังคับ",
    en: "Start anywhere — the order below is a suggestion, not a requirement",
  },
  examScope: { th: "เลือกช่วงสอบ", en: "Exam scope" },
  empty: {
    th: "ยังไม่มีเนื้อหาสำหรับช่วงสอบนี้",
    en: "Nothing prepared for this milestone yet",
  },
  browse: { th: "เปิดคลัง", en: "Browse the archive" },
  ready: { th: "พร้อมใช้", en: "ready" },
  none: { th: "หมวดนี้กำลังทยอยเปิด", en: "This section is still being built" },
  soonToggle: { th: "กำลังจะเปิด", en: "Coming soon" },
  items: { th: "รายการ", en: "items" },
} satisfies Record<string, LText>;

const PHASE_ORDER: Phase[] = ["orient", "compress", "retrieve", "prove"];

/** Shared with the sort in SubjectTrackGrid, so "available first" agrees with what actually renders as clickable. */
function isLocked(mod: ResolvedModule): boolean {
  return mod.status !== "available" || !mod.href;
}

function ScopeTag({ scope }: { scope: Exclude<ModuleScope, "all"> }) {
  const { locale } = useLocale();
  const Icon = SCOPE_ICON[scope];
  return (
    <span
      className={`inline-flex items-center gap-0.5 rounded-full border px-1.5 py-0.5 text-[9px] font-semibold ${SCOPE_BADGE[scope]}`}
    >
      <Icon className="size-2.5" />
      {t(SCOPE_LABEL[scope], locale)}
    </span>
  );
}

/**
 * One module a student can actually open, as a compact tile.
 *
 * Tiles in a two-column grid, not full-width rows on a rail: the categories no
 * longer claim to be ordered steps, so "pick one of these" is exactly the right
 * reading, and two columns roughly halve the scroll depth of a hub that had
 * eleven stacked rows between the header and the summary.
 */
function ModuleTile({ module: mod }: { module: ResolvedModule }) {
  const { locale } = useLocale();
  const Icon = MODULE_ICONS[mod.id];

  return (
    <Link
      href={mod.href!}
      className="group flex items-start gap-2.5 rounded-2xl border bg-card p-2.5 shadow-xs transition-colors hover:border-primary/50 hover:bg-primary/5"
    >
      <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
        <Icon className="size-4" />
      </span>

      <div className="min-w-0 flex-1">
        <h4 className="text-sm font-semibold leading-snug transition-colors group-hover:text-primary">
          {t(mod.title, locale)}
        </h4>
        <p className="mt-0.5 line-clamp-2 text-[11px] leading-relaxed text-muted-foreground">
          {t(mod.subtitle, locale)}
        </p>
        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
          {mod.scope !== "all" && <ScopeTag scope={mod.scope} />}
          {mod.badge && (
            <Badge
              variant="outline"
              className="rounded-full text-[10px] font-medium whitespace-nowrap"
            >
              {t(mod.badge, locale)}
            </Badge>
          )}
          {mod.stats && (
            <span className="text-[10px] font-medium tabular-nums text-muted-foreground">
              {t(mod.stats, locale)}
            </span>
          )}
        </div>
      </div>

      <ArrowRight className="mt-1 size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
    </Link>
  );
}

/**
 * A module that is on the spine but has nothing behind it yet.
 *
 * One line, no subtitle, and only visible once a reader opens the "กำลังจะเปิด"
 * disclosure. The spine deliberately declares all eleven modules whether or not
 * a course fills them (see lib/spine.ts), and that honesty is worth keeping —
 * but rendering six padlocks at full size between the things that do work made
 * a half-built course look broken rather than in progress.
 */
function LockedChip({ module: mod }: { module: ResolvedModule }) {
  const { locale } = useLocale();
  const Icon = MODULE_ICONS[mod.id];
  return (
    <span
      aria-disabled="true"
      className="flex items-center gap-2 rounded-xl border border-dashed bg-muted/30 px-2.5 py-1.5 text-xs text-muted-foreground"
    >
      <Icon className="size-3.5 shrink-0" />
      <span className="min-w-0 flex-1 truncate">{t(mod.title, locale)}</span>
      {mod.scope !== "all" && <ScopeTag scope={mod.scope} />}
      <Lock className="size-3 shrink-0" />
    </span>
  );
}

/**
 * The archive, pulled out of the categories and promoted above them.
 *
 * It is almost always the richest thing on the hub — hundreds of slides and
 * past papers behind one card — and it belongs to no single category: a student
 * reaches for it at every one of them. Rendered here as its own banner, above
 * the rest, whenever there's something behind it to open. When there is nothing
 * (a course with no assets at all), it stays a normal locked entry in its
 * category — an empty promo banner at the top of the page would be worse than
 * no banner.
 */
function ArchiveHero({ module: mod }: { module: ResolvedModule }) {
  const { locale } = useLocale();
  const Icon = MODULE_ICONS.archive;

  return (
    <Link
      href={mod.href!}
      className="group relative mb-5 flex items-center gap-4 overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/10 via-card to-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/60 hover:shadow-lg hover:shadow-primary/10 sm:p-6"
    >
      <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm sm:size-14">
        <Icon className="size-6 sm:size-7" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-lg font-bold transition-colors group-hover:text-primary sm:text-xl">
            {t(mod.title, locale)}
          </h3>
          {mod.stats && (
            <span className="relative overflow-hidden rounded-full bg-primary px-2.5 py-0.5 text-[11px] font-semibold text-primary-foreground shadow-xs">
              {t(mod.stats, locale)}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent"
              />
            </span>
          )}
        </div>
        <p className="mt-1 truncate text-xs text-muted-foreground sm:text-sm">
          {t(mod.subtitle, locale)}
        </p>
      </div>

      <span className="hidden shrink-0 items-center gap-1 text-sm font-semibold text-primary transition-transform group-hover:translate-x-0.5 sm:inline-flex">
        {t(L.browse, locale)}
        <ArrowRight className="size-4" />
      </span>
    </Link>
  );
}

/**
 * One category of the spine — what used to be "ขั้นที่ N".
 *
 * The phase is still the spine's own A→D order, and the categories still render
 * in that order, because the order carries real advice: a student who reads
 * notes and then jumps straight to a timed mock scores badly and concludes they
 * are bad at the subject rather than that they skipped retrieval. What is gone
 * is the *numbering* — a rail labelled "ขั้นที่ 1..4" reads as a gate, and a
 * student who came in at 22:00 to grind past papers is not going to start at
 * step one. Named categories describe the same four groups as somewhere to go.
 */
function CategorySection({ phase, items }: { phase: Phase; items: ResolvedModule[] }) {
  const { locale } = useLocale();
  const [showLocked, setShowLocked] = useState(false);
  const Icon = PHASE_ICONS[phase];

  const open = items.filter((mod) => !isLocked(mod));
  const locked = items.filter(isLocked);

  return (
    <section>
      <div className="mb-2.5 flex flex-wrap items-center gap-x-2 gap-y-1">
        <span
          aria-hidden="true"
          className={`flex size-7 shrink-0 items-center justify-center rounded-lg ${
            open.length > 0
              ? "bg-primary/10 text-primary"
              : "border border-dashed text-muted-foreground"
          }`}
        >
          <Icon className="size-4" />
        </span>
        <h3 className="text-sm font-bold sm:text-base">{t(PHASE_CATEGORY[phase], locale)}</h3>
        {open.length > 0 && (
          <span className="text-[11px] tabular-nums text-muted-foreground">
            {open.length} {t(L.ready, locale)}
          </span>
        )}
        <p className="w-full text-xs text-muted-foreground sm:w-auto sm:basis-full sm:pl-9">
          {t(PHASE_GOAL[phase], locale)}
        </p>
      </div>

      {open.length > 0 ? (
        <div className="grid gap-2 sm:grid-cols-2">
          {open.map((mod) => (
            <ModuleTile key={mod.id} module={mod} />
          ))}
        </div>
      ) : (
        <p className="rounded-2xl border border-dashed bg-muted/20 px-3 py-4 text-center text-xs text-muted-foreground">
          {t(L.none, locale)}
        </p>
      )}

      {locked.length > 0 && (
        <div className="mt-2">
          <button
            type="button"
            onClick={() => setShowLocked((prev) => !prev)}
            aria-expanded={showLocked}
            className="inline-flex cursor-pointer items-center gap-1 rounded-full px-1 py-0.5 text-[11px] font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ChevronDown
              className={`size-3 transition-transform ${showLocked ? "rotate-180" : ""}`}
            />
            {t(L.soonToggle, locale)} {locked.length} {t(L.items, locale)}
          </button>

          {showLocked && (
            <div className="mt-1.5 grid gap-1.5 sm:grid-cols-2">
              {locked.map((mod) => (
                <LockedChip key={mod.id} module={mod} />
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}

/**
 * The hub's action list: all eleven spine modules, grouped into four categories.
 *
 * The milestone control filters in one move: picking a milestone drops the
 * modules that belong to the other half of the term. Its buttons carry no
 * counts any more — "ทั้งหมด 11 · ก่อนมิดเทอม 11 · หลังมิดเทอม 6" invited the
 * reader to subtract, and the numbers do not subtract: every all-term module is
 * counted under both milestones. One line under the control says how many
 * modules the active filter is showing, which is the only number that answers
 * a question anyone was asking.
 */
export function SubjectTrackGrid({ modules }: { modules: ResolvedModule[] }) {
  const { locale } = useLocale();
  const [scope, setScope] = useState<ModuleScope>("all");

  // Pulled out and rendered as its own banner above the categories — see
  // ArchiveHero. Kept out of `shown` so it never also renders inside its
  // category, and kept independent of the milestone control below: it's a
  // permanent fixture of the page, not one more filtered card.
  const archiveHero = modules.find((mod) => mod.id === "archive" && !isLocked(mod));

  // A course whose every module applies all term has no milestone to pick
  // between, so the control stays out of the way.
  const scoped = modules.some((mod) => mod.scope !== "all");

  const shown = useMemo(() => {
    const rest = archiveHero ? modules.filter((mod) => mod.id !== "archive") : modules;
    if (scope === "all") return rest;
    return rest.filter((mod) => mod.scope === scope || mod.scope === "all");
  }, [modules, scope, archiveHero]);

  const readiness = modules.filter((mod) => mod.status === "available").length;

  const sections = useMemo(
    () =>
      PHASE_ORDER.map((phase) => ({
        phase,
        // Available modules first within a category, then the spine's fixed
        // order for ties. CategorySection splits the two groups anyway, but
        // sorting here keeps "what renders" and "what is open" in one order.
        items: shown
          .filter((mod) => mod.phase === phase)
          .sort((a, b) => {
            const availability = Number(isLocked(a)) - Number(isLocked(b));
            return availability !== 0 ? availability : a.order - b.order;
          }),
      })).filter((group) => group.items.length > 0),
    [shown],
  );

  return (
    <section>
      {archiveHero && <ArchiveHero module={archiveHero} />}

      {/* Milestone filter, above everything it filters. */}
      {scoped && (
        <div className="mb-4 rounded-2xl border bg-card p-2.5">
          <div
            role="group"
            aria-label={t(L.examScope, locale)}
            className="grid grid-cols-3 gap-1 rounded-full bg-muted/50 p-1"
          >
            {SCOPE_OPTIONS.map((option) => {
              const active = scope === option;
              const Icon = SCOPE_ICON[option];
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => setScope(option)}
                  aria-pressed={active}
                  className={`inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-full px-2 py-1.5 text-xs font-semibold transition-colors ${
                    active
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:bg-background hover:text-foreground"
                  }`}
                >
                  <Icon className="size-3.5 shrink-0" />
                  <span className="truncate">{t(SCOPE_LABEL[option], locale)}</span>
                </button>
              );
            })}
          </div>
          <p className="mt-2 px-1 text-[11px] text-muted-foreground">
            {t(SCOPE_DESCRIPTION[scope], locale)}
          </p>
        </div>
      )}

      <div className="mb-4">
        <h2 className="flex items-baseline gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {t(L.heading, locale)}
          <span className="font-mono text-[11px] normal-case tracking-normal text-primary">
            {readiness}/11
          </span>
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">{t(L.lead, locale)}</p>
      </div>

      {sections.length === 0 ? (
        <p className="rounded-3xl border bg-muted/20 py-12 text-center text-sm text-muted-foreground">
          {t(L.empty, locale)}
        </p>
      ) : (
        <div className="space-y-6">
          {sections.map(({ phase, items }) => (
            <CategorySection key={phase} phase={phase} items={items} />
          ))}
        </div>
      )}
    </section>
  );
}
