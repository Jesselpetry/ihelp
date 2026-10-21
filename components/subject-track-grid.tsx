"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  MODULE_ICONS,
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
      className={`group flex items-center gap-3 px-4 py-3 transition-[box-shadow,background-color] hover:bg-primary/[0.03] hover:shadow-md dark:hover:bg-primary/10 ${SURFACE}`}
    >
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Icon className="size-5" />
      </span>

      <div className="flex min-w-0 flex-1 items-center gap-2">
        <span className="min-w-0 truncate text-sm font-medium">{t(mod.title, locale)}</span>
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
    locked.length > 0 ? (
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

      {open.length > 0 && (
        <div className="flex flex-col gap-2">
          {open.map((mod) => (
            <ModuleRow key={mod.id} module={mod} />
          ))}
        </div>
      )}

      {showLocked && locked.length > 0 && (
        <ul
          id={listId}
          className={`flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground ${open.length > 0 ? "mt-3" : ""}`}
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
