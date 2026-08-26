"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpenText,
  BrainCircuit,
  CalendarRange,
  FileCheck2,
  Flag,
  FlaskConical,
  Layers,
  Library,
  Lock,
  Map as MapIcon,
  Milestone,
  ScrollText,
  Timer,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useLocale, t, type LText } from "@/lib/i18n";
import {
  PHASE_GOAL,
  PHASE_LABEL,
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

const SCOPE_ICON: Record<ModuleScope, LucideIcon> = {
  all: CalendarRange,
  midterm: Milestone,
  final: Flag,
};

const SCOPE_LABEL: Record<ModuleScope, LText> = {
  all: { th: "ทั้งหมด", en: "All" },
  midterm: { th: "ก่อนมิดเทอม", en: "Midterm" },
  final: { th: "หลังมิดเทอม", en: "Final" },
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
  heading: { th: "เส้นทางการเรียนในวิชานี้", en: "The learning path for this course" },
  examScope: { th: "ช่วงสอบ", en: "Exam scope" },
  empty: {
    th: "ยังไม่มีเนื้อหาสำหรับช่วงสอบนี้",
    en: "Nothing prepared for this milestone yet",
  },
  browse: { th: "เปิดคลัง", en: "Browse the archive" },
} satisfies Record<string, LText>;

const PHASE_ORDER: Phase[] = ["orient", "compress", "retrieve", "prove"];

const CARD_BASE = "rounded-3xl border p-5 transition-colors";

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

function ModuleCard({ module: mod }: { module: ResolvedModule }) {
  const { locale } = useLocale();
  const Icon = MODULE_ICONS[mod.id];
  const unavailable = isLocked(mod);

  const body = (
    <>
      <div className="flex items-start justify-between gap-2">
        {unavailable ? <Lock className="size-6" /> : <Icon className="size-6 text-primary" />}
        {mod.badge && (
          <Badge
            variant="outline"
            className="rounded-full text-[10px] font-medium whitespace-nowrap"
          >
            {t(mod.badge, locale)}
          </Badge>
        )}
      </div>

      <h3
        className={`mt-3 text-base font-semibold ${
          unavailable ? "" : "transition-colors group-hover:text-primary"
        }`}
      >
        {t(mod.title, locale)}
      </h3>

      <p
        className={`mt-1.5 text-xs leading-relaxed ${
          unavailable ? "" : "text-muted-foreground"
        }`}
      >
        {t(mod.subtitle, locale)}
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        {mod.scope !== "all" && <ScopeTag scope={mod.scope} />}
        {mod.stats && (
          <span className="text-[10px] font-medium tabular-nums text-muted-foreground">
            {t(mod.stats, locale)}
          </span>
        )}
      </div>
    </>
  );

  if (unavailable) {
    return (
      <div
        aria-disabled="true"
        className={`${CARD_BASE} pointer-events-none cursor-not-allowed border-dashed bg-muted text-muted-foreground opacity-40`}
      >
        {body}
      </div>
    );
  }

  return (
    <Link
      href={mod.href!}
      className={`${CARD_BASE} group bg-card shadow-xs hover:-translate-y-0.5 hover:border-primary/50 hover:bg-primary/5 hover:shadow-md`}
    >
      {body}
    </Link>
  );
}

/**
 * The archive, pulled out of the grid and promoted above it.
 *
 * It is almost always the richest thing on the hub — hundreds of slides and
 * past papers behind one card — and it used to render as an identically-sized
 * tile buried in the last phase group, indistinguishable from a locked stub
 * except for opacity. Rendered here as its own banner, first thing on the
 * page, whenever there's something behind it to open. When there is nothing
 * (a course with no assets at all), it stays a normal locked card in its D
 * phase slot — an empty promo banner at the top of the page would be worse
 * than no banner.
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
 * The hub's action cards: all eleven spine modules, grouped by phase.
 *
 * Phases are shown, not just implied by order. A student who reads notes and
 * then jumps straight to a timed mock — skipping untimed retrieval — scores
 * badly and concludes they are bad at the subject rather than that they skipped
 * a step, so the sequence is worth naming on screen.
 *
 * The milestone control filters and reorders in one move: picking a milestone
 * floats the modules specific to it above the ones that apply all term.
 */
export function SubjectTrackGrid({ modules }: { modules: ResolvedModule[] }) {
  const { locale } = useLocale();
  const [scope, setScope] = useState<ModuleScope>("all");

  // Pulled out and rendered as its own banner above the phase groups — see
  // ArchiveHero. Kept out of `shown` so it never also renders inside the D
  // phase grid, and kept independent of the milestone tabs below: it's a
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

  const counts = useMemo(() => {
    const allTerm = modules.filter((mod) => mod.scope === "all").length;
    return {
      all: modules.length,
      midterm: modules.filter((m) => m.scope === "midterm").length + allTerm,
      final: modules.filter((m) => m.scope === "final").length + allTerm,
    } satisfies Record<ModuleScope, number>;
  }, [modules]);

  const readiness = modules.filter((mod) => mod.status === "available").length;

  const byPhase = useMemo(
    () =>
      PHASE_ORDER.map((phase) => ({
        phase,
        // Available modules first within a phase — a locked stub is only
        // useful as "here's what's coming," and burying it behind whatever a
        // student can actually open means they never have to scan past grey
        // cards to reach the one that works. Ties (available-vs-available,
        // locked-vs-locked) keep the spine's fixed order.
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

      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <h2 className="flex items-baseline gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {t(L.heading, locale)}
          <span className="font-mono text-[11px] normal-case tracking-normal text-primary">
            {readiness}/11
          </span>
        </h2>

        {scoped && (
          <div
            role="group"
            aria-label={t(L.examScope, locale)}
            className="flex w-full gap-1 rounded-full border bg-card p-1 sm:w-auto"
          >
            {(["all", "midterm", "final"] as const).map((option) => {
              const active = scope === option;
              const Icon = SCOPE_ICON[option];
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => setScope(option)}
                  aria-pressed={active}
                  className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors sm:flex-none sm:px-3.5 ${
                    active
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Icon className="size-3.5" />
                  <span className="truncate">{t(SCOPE_LABEL[option], locale)}</span>
                  <span className="tabular-nums opacity-70">{counts[option]}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {byPhase.length === 0 ? (
        <p className="rounded-3xl border bg-muted/20 py-12 text-center text-sm text-muted-foreground">
          {t(L.empty, locale)}
        </p>
      ) : (
        <div className="space-y-6">
          {byPhase.map(({ phase, items }) => (
            <div key={phase}>
              <div className="mb-2.5 flex items-baseline gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-primary">
                  {t(PHASE_LABEL[phase], locale)}
                </span>
                <span className="text-[11px] text-muted-foreground">
                  {t(PHASE_GOAL[phase], locale)}
                </span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((mod) => (
                  <ModuleCard key={mod.id} module={mod} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
