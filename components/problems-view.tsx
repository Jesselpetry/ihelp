"use client";

import { useEffect, useMemo, useState } from "react";
import type { PscpHubData } from "@/lib/pscp";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useGithub } from "@/lib/github";
import { PscpWorkspace } from "@/components/pscp-workspace";
import { ProblemsHeader } from "@/components/pscp/problems-header";
import { ProblemList, type Filter, type ViewMode } from "@/components/pscp/problem-list";
import { isExpired } from "@/components/pscp/problem-primitives";
import { tagLabel } from "@/lib/pscp-tags";
import {
  loadPscpProgress,
  setPscpSolved,
  PSCP_PROGRESS_EVENT,
  type PscpProgress,
} from "@/lib/pscp-client";
import { useLocale, t } from "@/lib/i18n";

/**
 * The PSCP problems hub: filter state and data derivation live here; the
 * header, list and card presentation live in components/pscp/.
 */
export function ProblemsView({ data }: { data: PscpHubData }) {
  const { locale } = useLocale();
  const gh = useGithub();
  const [query, setQuery] = useState("");
  const [weekFilter, setWeekFilter] = useState<number | "all">("all");
  const [filter, setFilter] = useState<Filter>("all");
  const [concept, setConcept] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [openId, setOpenId] = useState<number | null>(null);
  const [progress, setProgress] = useState<PscpProgress>({});

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration from localStorage after mount (SSR-safe)
    setProgress(loadPscpProgress());
    const update = () => setProgress(loadPscpProgress());
    window.addEventListener(PSCP_PROGRESS_EVENT, update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener(PSCP_PROGRESS_EVENT, update);
      window.removeEventListener("storage", update);
    };
  }, []);

  const problems = data.problems;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const now = new Date();
    return problems
      .filter((p) => {
        if (weekFilter !== "all" && p.week !== weekFilter) return false;
        if (concept && !p.tags.includes(concept)) return false;
        if (filter === "ll" && !p.learningLog) return false;
        if (filter === "gradable" && p.cases.length === 0) return false;
        if (filter === "solved" && !progress[p.id]?.solved) return false;
        if (filter === "unsolved" && progress[p.id]?.solved) return false;
        if (!q) return true;
        return (
          p.name.toLowerCase().includes(q) ||
          p.cleanName.toLowerCase().includes(q) ||
          String(p.id).includes(q) ||
          p.tags.some(
            (tag) =>
              tag.includes(q) ||
              t(tagLabel(tag), locale).toLowerCase().includes(q),
          )
        );
      })
      .sort((a, b) => {
        // Expired sinks to the bottom, then Learning Log (submission first),
        // then newest week first, then Recommended, then id.
        const expA = isExpired(a, now);
        const expB = isExpired(b, now);
        if (expA !== expB) return expA ? 1 : -1;
        if (a.learningLog !== b.learningLog) return a.learningLog ? -1 : 1;
        const weekA = a.week ?? 0;
        const weekB = b.week ?? 0;
        if (weekA !== weekB) return weekB - weekA;
        if (a.recommended !== b.recommended) return a.recommended ? -1 : 1;
        return a.id - b.id;
      });
  }, [problems, query, weekFilter, filter, concept, progress, locale]);

  const openProblem = openId !== null ? problems.find((p) => p.id === openId) ?? null : null;

  // Header progress counters.
  const learningLogs = problems.filter((p) => p.learningLog);
  const solvedCount = problems.filter((p) => progress[p.id]?.solved).length;
  const subCount = learningLogs.filter((p) => gh.status[p.id]?.submission).length;
  const reflCount = problems.filter((p) => gh.status[p.id]?.reflection).length;

  const conceptOptions = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of problems) for (const tag of p.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1);
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 14);
  }, [problems]);

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-8">
      <ProblemsHeader
        data={data}
        solvedCount={solvedCount}
        subCount={subCount}
        reflCount={reflCount}
        learningLogTotal={learningLogs.length}
        gh={gh}
        locale={locale}
      />

      <ProblemList
        problems={filtered}
        progress={progress}
        ghStatus={gh.status}
        ghReady={Boolean(gh.connected && gh.repo)}
        weeks={data.weeks}
        conceptOptions={conceptOptions}
        query={query}
        onQuery={setQuery}
        weekFilter={weekFilter}
        onWeekFilter={setWeekFilter}
        filter={filter}
        onFilter={setFilter}
        concept={concept}
        onConcept={setConcept}
        viewMode={viewMode}
        onViewMode={setViewMode}
        onOpen={setOpenId}
        onToggleSolved={setPscpSolved}
        onReset={() => {
          setQuery("");
          setFilter("all");
          setConcept(null);
          setWeekFilter("all");
        }}
        locale={locale}
      />

      {/* Interactive workspace drawer */}
      <Dialog open={openProblem !== null} onOpenChange={(o) => !o && setOpenId(null)}>
        <DialogContent
          showCloseButton={false}
          /* `pscp-theme` is re-applied here on purpose: DialogContent renders
             through a portal attached to document.body, outside the themed
             wrapper in app/pscp/layout.tsx, so without it the dialog inherits
             the global blue --primary/--ring instead of PSCP Pink. */
          className="pscp-theme h-[92vh] max-w-[calc(100vw-1rem)] gap-0 overflow-hidden rounded-3xl p-0 sm:max-w-5xl lg:max-w-6xl"
        >
          {openProblem && (
            <>
              <DialogTitle className="sr-only">
                OJ {openProblem.id} — {openProblem.cleanName}
              </DialogTitle>
              <PscpWorkspace problem={openProblem} onClose={() => setOpenId(null)} />
            </>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}
