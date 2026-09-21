"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpenText,
  BrainCircuit,
  CalendarRange,
  Check,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

const SCOPE_OPTIONS = ["all", "midterm", "final"] as const;

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
  lead: {
    th: "เดินตามลำดับ 4 ขั้น ตั้งแต่ทำความเข้าใจวิชา จนถึงพิสูจน์ว่าพร้อมสอบ",
    en: "Four steps in order — from understanding the course to proving you are exam-ready",
  },
  examScope: { th: "ช่วงสอบ", en: "Exam scope" },
  empty: {
    th: "ยังไม่มีเนื้อหาสำหรับช่วงสอบนี้",
    en: "Nothing prepared for this milestone yet",
  },
  browse: { th: "เปิดคลัง", en: "Browse the archive" },
  step: { th: "ขั้นที่", en: "Step" },
  ready: { th: "เปิดใช้ได้แล้ว", en: "open now" },
  stepLocked: { th: "ยังไม่เปิด", en: "not open yet" },
  open: { th: "เปิด", en: "Open" },
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
 * One module, as a row on the journey rather than a tile in a grid.
 *
 * A row, not a card: the steps are ordered, and a three-column grid inside an
 * ordered step reads as "pick one of these", which is the opposite of what the
 * spine says. Stacked rows keep the top-to-bottom reading order the phases
 * already imply, and leave the horizontal room for the title and its subtitle
 * to sit on one line at the width the hub actually renders at (max-w-3xl).
 */
function ModuleRow({ module: mod }: { module: ResolvedModule }) {
  const { locale } = useLocale();
  const Icon = MODULE_ICONS[mod.id];
  const unavailable = isLocked(mod);

  const tags = (
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
  );

  if (unavailable) {
    return (
      <div
        aria-disabled="true"
        className="flex items-start gap-3 rounded-2xl border border-dashed bg-muted/30 p-3 text-muted-foreground sm:p-3.5"
      >
        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-dashed bg-background/60">
          <Lock className="size-4" />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold">{t(mod.title, locale)}</h3>
          <p className="mt-0.5 text-xs leading-relaxed">{t(mod.subtitle, locale)}</p>
          {tags}
        </div>
      </div>
    );
  }

  return (
    <Link
      href={mod.href!}
      className="group flex items-start gap-3 rounded-2xl border bg-card p-3 shadow-xs transition-colors hover:border-primary/50 hover:bg-primary/5 sm:p-3.5"
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
        <Icon className="size-4" />
      </span>

      <div className="min-w-0 flex-1">
        <h3 className="text-sm font-semibold transition-colors group-hover:text-primary">
          {t(mod.title, locale)}
        </h3>
        <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
          {t(mod.subtitle, locale)}
        </p>
        {tags}
      </div>

      <ArrowRight className="mt-1 size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
    </Link>
  );
}

/**
 * The archive, pulled out of the journey and promoted above it.
 *
 * It is almost always the richest thing on the hub — hundreds of slides and
 * past papers behind one card — and it belongs to no single step: a student
 * reaches for it at every one of them. Rendered here as its own banner, above
 * the numbered path, whenever there's something behind it to open. When there
 * is nothing (a course with no assets at all), it stays a normal locked row in
 * its D phase slot — an empty promo banner at the top of the page would be
 * worse than no banner.
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
 * One phase of the spine, drawn as a step on a vertical rail.
 *
 * The node carries the step number — the thing the old grid could not say. A
 * phase whose modules are all locked gets an outlined node instead of a filled
 * one, so a reader scanning only the rail can see how far the course is
 * actually built before reading a single card.
 *
 * `last` drops the connector so the rail stops at the final node rather than
 * trailing into the summary card below it.
 */
function JourneyStep({
  phase,
  index,
  items,
  last,
}: {
  phase: Phase;
  index: number;
  items: ResolvedModule[];
  last: boolean;
}) {
  const { locale } = useLocale();
  const open = items.filter((mod) => !isLocked(mod)).length;
  const started = open > 0;

  return (
    <li className="relative flex gap-3 sm:gap-4">
      {/* Rail: the connector runs behind the next node, so it is drawn first. */}
      {!last && (
        <span
          aria-hidden="true"
          className="absolute left-[15px] top-9 bottom-0 w-px bg-border sm:left-[17px]"
        />
      )}

      <span
        aria-hidden="true"
        className={`relative z-10 mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold tabular-nums sm:size-9 ${
          started
            ? "bg-primary text-primary-foreground shadow-xs"
            : "border border-dashed bg-background text-muted-foreground"
        }`}
      >
        {started && open === items.length ? <Check className="size-4" /> : index + 1}
      </span>

      <div className={`min-w-0 flex-1 ${last ? "" : "pb-7"}`}>
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            {t(L.step, locale)} {index + 1}
          </span>
          <h3 className="text-sm font-bold text-primary sm:text-base">
            {t(PHASE_LABEL[phase], locale)}
          </h3>
          <span className="text-[11px] tabular-nums text-muted-foreground">
            {started
              ? `${open}/${items.length} ${t(L.ready, locale)}`
              : t(L.stepLocked, locale)}
          </span>
        </div>

        <p className="mt-0.5 text-xs text-muted-foreground">
          {t(PHASE_GOAL[phase], locale)}
        </p>

        <div className="mt-3 space-y-2">
          {items.map((mod) => (
            <ModuleRow key={mod.id} module={mod} />
          ))}
        </div>
      </div>
    </li>
  );
}

/**
 * The hub's action list: all eleven spine modules, walked as a numbered path.
 *
 * Phases are shown as steps, not just implied by order. A student who reads
 * notes and then jumps straight to a timed mock — skipping untimed retrieval —
 * scores badly and concludes they are bad at the subject rather than that they
 * skipped a step, so the sequence is worth numbering on screen.
 *
 * The milestone control filters and reorders in one move: picking a milestone
 * floats the modules specific to it above the ones that apply all term. Step
 * numbers come from the phase's fixed position in the spine, not from its
 * position after filtering, so "ขั้นที่ 3" means the same thing on every course
 * and under every milestone.
 */
export function SubjectTrackGrid({ modules }: { modules: ResolvedModule[] }) {
  const { locale } = useLocale();
  const [scope, setScope] = useState<ModuleScope>("all");

  // Pulled out and rendered as its own banner above the steps — see
  // ArchiveHero. Kept out of `shown` so it never also renders inside the D
  // phase step, and kept independent of the milestone tabs below: it's a
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

  const steps = useMemo(
    () =>
      PHASE_ORDER.map((phase, index) => ({
        phase,
        // The number is the phase's place in the spine, kept even when an
        // earlier step filters out entirely — a path that jumps 1, 2, 4 is
        // honest; one that renumbers 4 to 3 quietly lies about the order.
        index,
        // Available modules first within a step — a locked stub is only useful
        // as "here's what's coming," and burying it behind whatever a student
        // can actually open means they never have to scan past grey rows to
        // reach the one that works. Ties (available-vs-available,
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

      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="flex items-baseline gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {t(L.heading, locale)}
            <span className="font-mono text-[11px] normal-case tracking-normal text-primary">
              {readiness}/11
            </span>
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">{t(L.lead, locale)}</p>
        </div>

        {scoped && (
          <>
            {/*
              Below sm the three-way segmented control does not fit: the Thai
              labels ("ก่อนมิดเทอม") plus an icon and a count overflow a 360px
              row and truncate to nothing useful. A dropdown shows the full
              label of whichever scope is active and keeps the rest one tap
              away.
            */}
            <div className="w-full sm:hidden">
              <Select
                value={scope}
                onValueChange={(value) => setScope(value as ModuleScope)}
              >
                <SelectTrigger
                  className="h-9 w-full"
                  aria-label={t(L.examScope, locale)}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SCOPE_OPTIONS.map((option) => {
                    const Icon = SCOPE_ICON[option];
                    return (
                      <SelectItem key={option} value={option}>
                        <Icon className="size-3.5" />
                        <span>{t(SCOPE_LABEL[option], locale)}</span>
                        <span className="tabular-nums text-muted-foreground">
                          {counts[option]}
                        </span>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div
              role="group"
              aria-label={t(L.examScope, locale)}
              className="hidden gap-1 rounded-full border bg-card p-1 sm:flex"
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
                    className={`inline-flex items-center justify-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                      active
                        ? "bg-primary text-primary-foreground shadow-xs"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <Icon className="size-3.5" />
                    <span>{t(SCOPE_LABEL[option], locale)}</span>
                    <span className="tabular-nums opacity-70">
                      {counts[option]}
                    </span>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>

      {steps.length === 0 ? (
        <p className="rounded-3xl border bg-muted/20 py-12 text-center text-sm text-muted-foreground">
          {t(L.empty, locale)}
        </p>
      ) : (
        <ol className="relative">
          {steps.map(({ phase, index, items }, position) => (
            <JourneyStep
              key={phase}
              phase={phase}
              index={index}
              items={items}
              last={position === steps.length - 1}
            />
          ))}
        </ol>
      )}
    </section>
  );
}
