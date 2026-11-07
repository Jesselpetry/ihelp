"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  MODULE_ICONS,
  PHASE_ICONS,
  SCOPE_BADGE,
  SCOPE_ICON,
  SCOPE_LABEL,
  SURFACE,
  TopicHeader,
  phaseAnchor,
  topicGroups,
  type TopicGroup,
} from "@/components/course-hub-shared";
import { useLocale, t, type LText } from "@/lib/i18n";
import { PHASE_CATEGORY, type ModuleScope, type ResolvedModule } from "@/lib/courses/spine";

const L = {
  empty: {
    th: "ยังไม่มีเนื้อหาสำหรับช่วงสอบนี้",
    en: "Nothing prepared for this milestone yet",
  },
  soon: { th: "เร็วๆ นี้", en: "Coming soon" },
  inPreparation: {
    th: "อยู่ระหว่างจัดเตรียมเนื้อหาในหมวดนี้",
    en: "Content in preparation for this phase",
  },
  inPreparationSub: {
    th: "สรุปย่อความจำ คัดเฉพาะสูตร กฎ และข้อควรระวังสำคัญก่อนเข้าห้องสอบ เร็ว ๆ นี้",
    en: "Summary notes, key formulas, and exam tips are currently being curated.",
  },
} satisfies Record<string, LText>;

function ScopeTag({ scope }: { scope: Exclude<ModuleScope, "all"> }) {
  const { locale } = useLocale();
  const Icon = SCOPE_ICON[scope];
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-0.5 rounded-full border px-1.5 py-0.5 text-[10px] font-semibold ${SCOPE_BADGE[scope]}`}
    >
      <Icon className="size-2.5" />
      {t(SCOPE_LABEL[scope], locale)}
    </span>
  );
}

/**
 * One module a student can open, as a full-width row of the stream.
 *
 * A single column, not a grid: the stream reads top to bottom like a Classroom
 * topic, and every row has the same shape so the eye can scan titles down one
 * edge. The subtitle is only a tooltip — the module page is the detail view,
 * and a second line of microcopy per row made the page long.
 */
function ModuleRow({ module: mod }: { module: ResolvedModule }) {
  const { locale } = useLocale();
  const Icon = MODULE_ICONS[mod.id];

  return (
    <Link
      href={mod.href!}
      title={t(mod.subtitle, locale)}
      className={`group flex items-center gap-2.5 px-3.5 py-2.5 transition-[box-shadow,background-color] hover:bg-primary/[0.03] hover:shadow-md dark:hover:bg-primary/10 ${SURFACE}`}
    >
      <span className="flex size-8.5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Icon className="size-4" />
      </span>

      <div className="flex min-w-0 flex-1 items-center gap-2">
        <span className="min-w-0 truncate text-xs sm:text-sm font-medium">{t(mod.title, locale)}</span>
        {mod.scope !== "all" && <ScopeTag scope={mod.scope} />}
        {mod.badge && (
          <Badge
            variant="outline"
            className="shrink-0 rounded-full text-[10px] font-medium whitespace-nowrap"
          >
            {t(mod.badge, locale)}
          </Badge>
        )}
      </div>

      {mod.stats && (
        <span className="hidden shrink-0 text-xs tabular-nums text-muted-foreground sm:block">
          {t(mod.stats, locale)}
        </span>
      )}
      <ChevronRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}

/**
 * A module that is on the spine but has nothing behind it yet.
 *
 * The spine declares all eleven modules whether or not a course fills them (see
 * lib/spine.ts) and that honesty is worth keeping, but it is a quiet line of
 * text behind a pill — never a box — so a half-built course reads as in
 * progress rather than broken.
 */
function LockedItem({ module: mod }: { module: ResolvedModule }) {
  const { locale } = useLocale();
  const Icon = MODULE_ICONS[mod.id];
  return (
    <li className="flex items-center gap-1.5">
      <Icon className="size-3.5 shrink-0" />
      <span>{t(mod.title, locale)}</span>
      {mod.scope !== "all" && <ScopeTag scope={mod.scope} />}
      <Lock className="size-3 shrink-0" />
    </li>
  );
}

/**
 * Placeholder card for phases that have no open modules yet (e.g. compress / cram phase).
 * Shows what is in preparation with clean status pills.
 */
function EmptyPhaseCard({ group }: { group: TopicGroup }) {
  const { locale } = useLocale();
  const { phase, locked } = group;
  const PhaseIcon = PHASE_ICONS[phase];

  return (
    <div
      className={`relative flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 bg-muted/15 px-4 py-5 text-center transition-colors sm:px-6 sm:py-6 ${SURFACE}`}
    >
      <div className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary mb-2">
        <PhaseIcon className="size-4.5" />
      </div>
      <h4 className="text-xs sm:text-sm font-bold text-foreground">
        {t(L.inPreparation, locale)}
      </h4>
      <p className="mt-0.5 max-w-sm text-[11px] sm:text-xs text-muted-foreground leading-relaxed">
        {t(L.inPreparationSub, locale)}
      </p>
      {locked.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5">
          {locked.map((mod) => {
            const ModIcon = MODULE_ICONS[mod.id];
            return (
              <span
                key={mod.id}
                className="inline-flex items-center gap-1 rounded-full border border-border/70 bg-card/70 px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground shadow-2xs"
              >
                <ModIcon className="size-3 text-muted-foreground/70" />
                <span>{t(mod.title, locale)}</span>
                <Lock className="size-2.5 text-muted-foreground/50" />
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}

/**
 * One topic of the stream — a phase of the spine.
 *
 * The four topics keep the spine's A→D order because the order carries real
 * advice (notes, then retrieval, then a timed mock), but nothing is numbered:
 * numbered steps read as a gate, and a student grinding past papers at 22:00
 * should not feel they skipped step one.
 */
function TopicSection({ group }: { group: TopicGroup }) {
  const { locale } = useLocale();
  const [showLocked, setShowLocked] = useState(false);
  const { phase, open, locked } = group;
  const listId = `${phaseAnchor(phase)}-soon`;

  const aside =
    locked.length > 0 && open.length > 0 ? (
      <button
        type="button"
        onClick={() => setShowLocked((prev) => !prev)}
        aria-expanded={showLocked}
        aria-controls={listId}
        className="shrink-0 cursor-pointer rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
      >
        {t(L.soon, locale)} · {locked.length}
      </button>
    ) : undefined;

  return (
    <section>
      <TopicHeader
        id={phaseAnchor(phase)}
        title={t(PHASE_CATEGORY[phase], locale)}
        aside={aside}
      />

      {open.length > 0 ? (
        <div className="flex flex-col gap-2">
          {open.map((mod) => (
            <ModuleRow key={mod.id} module={mod} />
          ))}
        </div>
      ) : (
        <EmptyPhaseCard group={group} />
      )}

      {showLocked && open.length > 0 && locked.length > 0 && (
        <ul
          id={listId}
          className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground"
        >
          {locked.map((mod) => (
            <LockedItem key={mod.id} module={mod} />
          ))}
        </ul>
      )}
    </section>
  );
}

/**
 * The hub's stream: the spine's modules as topic sections, one column.
 *
 * Scope is not owned here. The sidebar holds the control and the hub holds the
 * state, so the filter and the list it filters can never disagree.
 */
export function SubjectTrackGrid({
  modules,
  scope,
}: {
  modules: ResolvedModule[];
  scope: ModuleScope;
}) {
  const { locale } = useLocale();
  const groups = topicGroups(modules, scope);

  if (groups.length === 0) {
    return <p className="py-12 text-center text-sm text-muted-foreground">{t(L.empty, locale)}</p>;
  }

  return (
    <div className="space-y-8">
      {groups.map((group) => (
        <TopicSection key={group.phase} group={group} />
      ))}
    </div>
  );
}
