"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ChevronRight } from "lucide-react";
import {
  MODULE_ICONS,
  OVERVIEW_ANCHOR,
  OVERVIEW_TITLE,
  PHASE_ICONS,
  PHASE_SHORT,
  SCOPE_ICON,
  SCOPE_LABEL,
  SCOPE_OPTIONS,
  SURFACE,
  hasScopes,
  isLocked,
  openArchive,
  phaseAnchor,
  topicGroups,
} from "@/components/course-hub-shared";
import { useLocale, t, type LText } from "@/lib/i18n";
import type { ModuleScope, ResolvedModule } from "@/lib/courses/spine";

export interface CourseSidebarProps {
  /** All eleven, from lib/courses/spine. */
  modules: ResolvedModule[];
  scope: ModuleScope;
  onScopeChange: (scope: ModuleScope) => void;
  /** Whether the stream renders the overview section. */
  hasOverview: boolean;
}

const ArchiveIcon = MODULE_ICONS.archive;

const HEADING = "mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground";

const L = {
  scope: { th: "ช่วงสอบ", en: "Exam scope" } satisfies LText,
  topics: { th: "หัวข้อ", en: "Topics" } satisfies LText,
  resources: { th: "คลังทรัพยากร", en: "Resources" } satisfies LText,
  soon: { th: "เร็วๆ นี้", en: "Soon" } satisfies LText,
  ready: { th: "พร้อมใช้", en: "ready" } satisfies LText,
};

interface TopicLink {
  id: string;
  title: LText;
  Icon: (typeof PHASE_ICONS)[keyof typeof PHASE_ICONS];
  /** Openable modules in the section. */
  count: number;
}

/**
 * Classroom's left rail: the exam-scope filter, a jump list for the stream's
 * topic sections, and the resource library. On phones it stacks above the
 * stream, so the topic list collapses to a row of chips and the order puts the
 * two controls first.
 */
export function CourseSidebar({ modules, scope, onScopeChange, hasOverview }: CourseSidebarProps) {
  const { locale } = useLocale();
  const archive = openArchive(modules);
  const groups = useMemo(() => topicGroups(modules, scope), [modules, scope]);
  const readyCount = modules.filter((mod) => !isLocked(mod)).length;

  const links = useMemo<TopicLink[]>(() => {
    return groups.map((group) => ({
      id: phaseAnchor(group.phase),
      title: PHASE_SHORT[group.phase],
      Icon: PHASE_ICONS[group.phase],
      count: group.open.length,
    }));
  }, [groups]);

  const ids = useMemo(
    () => [...(hasOverview ? [OVERVIEW_ANCHOR] : []), ...links.map((link) => link.id)],
    [hasOverview, links],
  );
  const activeId = useActiveSection(ids);

  function jump(event: React.MouseEvent<HTMLAnchorElement>, id: string) {
    // Leave modified clicks to the browser — they mean "open in a new tab".
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    const target = document.getElementById(id);
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    history.replaceState(null, "", `#${id}`);
  }

  const rowClass = (id: string, dim: boolean) =>
    `flex items-center gap-2 text-sm transition-colors ${
      id === activeId
        ? "bg-primary/10 font-medium text-primary"
        : `hover:bg-muted ${dim ? "text-muted-foreground/70" : ""}`
    }`;

  return (
    <aside className="flex flex-col gap-3 lg:sticky lg:top-20 lg:self-start lg:gap-4">
      {hasScopes(modules) && (
        <section className={`${SURFACE} order-1 p-4`}>
          <h2 className={HEADING}>{t(L.scope, locale)}</h2>
          <div className="grid grid-cols-3 rounded-full bg-muted p-1">
            {SCOPE_OPTIONS.map((option) => {
              const Icon = SCOPE_ICON[option];
              const active = option === scope;
              return (
                <button
                  key={option}
                  type="button"
                  aria-pressed={active}
                  onClick={() => onScopeChange(option)}
                  className={`inline-flex items-center justify-center gap-1 rounded-full px-1.5 py-1.5 text-xs font-medium transition-colors ${
                    active
                      ? "bg-card text-primary shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {/* Icons only where the segment is wide enough; at 260px "มิดเทอม" lost its tail. */}
                  <Icon className="size-3.5 shrink-0 lg:hidden" aria-hidden="true" />
                  <span className="truncate">{t(SCOPE_LABEL[option], locale)}</span>
                </button>
              );
            })}
          </div>
        </section>
      )}

      <section className={`${SURFACE} order-3 p-4 lg:order-2`}>
        <h2 className={HEADING}>{t(L.topics, locale)}</h2>

        {/* Phones: chips in one scrollable row. */}
        <nav
          aria-label={t(L.topics, locale)}
          className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 lg:hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {hasOverview && (
            <a
              href={`#${OVERVIEW_ANCHOR}`}
              onClick={(event) => jump(event, OVERVIEW_ANCHOR)}
              aria-current={activeId === OVERVIEW_ANCHOR ? "location" : undefined}
              className={`shrink-0 rounded-full border border-border px-3 py-1 text-xs ${rowClass(OVERVIEW_ANCHOR, false)}`}
            >
              {t(OVERVIEW_TITLE, locale)}
            </a>
          )}
          {links.map(({ id, title, Icon, count }) => (
            <a
              key={id}
              href={`#${id}`}
              onClick={(event) => jump(event, id)}
              aria-current={activeId === id ? "location" : undefined}
              className={`shrink-0 rounded-full border border-border px-3 py-1 text-xs ${rowClass(id, count === 0)}`}
            >
              <Icon className="size-3.5 shrink-0" aria-hidden="true" />
              {t(title, locale)}
            </a>
          ))}
        </nav>

        {/* Desktop: a vertical jump list with counts. */}
        <nav aria-label={t(L.topics, locale)} className="hidden space-y-0.5 lg:block">
          {hasOverview && (
            <a
              href={`#${OVERVIEW_ANCHOR}`}
              onClick={(event) => jump(event, OVERVIEW_ANCHOR)}
              aria-current={activeId === OVERVIEW_ANCHOR ? "location" : undefined}
              className={`rounded-lg px-2.5 py-2 ${rowClass(OVERVIEW_ANCHOR, false)}`}
            >
              {t(OVERVIEW_TITLE, locale)}
            </a>
          )}
          {links.map(({ id, title, Icon, count }) => (
            <a
              key={id}
              href={`#${id}`}
              onClick={(event) => jump(event, id)}
              aria-current={activeId === id ? "location" : undefined}
              className={`rounded-lg px-2.5 py-2 ${rowClass(id, count === 0)}`}
            >
              <Icon className="size-4 shrink-0" aria-hidden="true" />
              <span className="min-w-0 flex-1 truncate">{t(title, locale)}</span>
              {count === 0 ? (
                <span className="text-xs text-muted-foreground">{t(L.soon, locale)}</span>
              ) : (
                <span className="text-xs tabular-nums text-muted-foreground">{count}</span>
              )}
            </a>
          ))}
        </nav>

        <p className="mt-3 hidden text-xs text-muted-foreground lg:block">
          <span className="tabular-nums">
            {readyCount}/{modules.length}
          </span>{" "}
          {t(L.ready, locale)}
        </p>
      </section>

      {archive && !isLocked(archive) && archive.href && (
        <section className={`${SURFACE} order-2 p-4 lg:order-3`}>
          <h2 className={HEADING}>{t(L.resources, locale)}</h2>
          <Link
            href={archive.href}
            className="-mx-2 flex items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-muted"
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <ArchiveIcon className="size-4" aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium">{t(archive.title, locale)}</span>
              {archive.stats && (
                <span className="block truncate text-xs text-muted-foreground">
                  {t(archive.stats, locale)}
                </span>
              )}
            </span>
            <ChevronRight className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          </Link>
        </section>
      )}
    </aside>
  );
}

/**
 * The last section whose heading has scrolled past the top third of the
 * viewport — the same rule the summary's outline uses. An observer on the thin
 * headings missed sections near the page bottom (their heading never reaches
 * the band) and kept the lower one lit while scrolling back up. State is only
 * set from the scroll listener, never during the effect itself.
 */
function useActiveSection(ids: string[]): string | undefined {
  const [seenId, setSeenId] = useState<string>();
  const key = ids.join("|");

  useEffect(() => {
    const list = key.split("|").filter(Boolean);
    if (list.length === 0) return;

    const update = () => {
      const line = window.innerHeight * 0.3;
      let current: string | undefined;
      for (const id of list) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) current = id;
      }
      // At the very bottom the last section wins even if its heading is low.
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      setSeenId(atBottom ? list[list.length - 1] : (current ?? list[0]));
    };

    const frame = requestAnimationFrame(update);
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [key]);

  // A section dropped by a scope switch must not stay highlighted.
  return seenId && ids.includes(seenId) ? seenId : undefined;
}
