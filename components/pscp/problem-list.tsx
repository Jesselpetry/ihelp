"use client";

import { Fragment } from "react";
import { ChevronDown, Info, LayoutGrid, List, Search } from "lucide-react";
import type { PscpProblem } from "@/lib/pscp";
import type { PscpProgress } from "@/lib/pscp-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ProblemCard } from "@/components/pscp/problem-card";
import { ProblemRow } from "@/components/pscp/problem-row";
import { isExpired } from "@/components/pscp/problem-primitives";
import { tagLabel } from "@/lib/pscp-tags";
import { t, type LText, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export type Filter = "all" | "ll" | "gradable" | "solved" | "unsolved";
export type ViewMode = "grid" | "table";

const L: Record<string, LText> = {
  search: { th: "ค้นหาชื่อ, ID หรือแนวคิด...", en: "Search name, ID, or concept..." },
  problem: { th: "ชื่อโจทย์", en: "Problem" },
  concepts: { th: "แนวคิด", en: "Concepts" },
  week: { th: "สัปดาห์", en: "Week" },
  difficulty: { th: "ความยาก", en: "Difficulty" },
  due: { th: "หมดเขต", en: "Due" },
  actions: { th: "การดำเนินการ", en: "Actions" },
  expiredSection: { th: "โจทย์ที่หมดเขตส่งแล้ว", en: "Past / Expired" },
  empty: { th: "ไม่พบโจทย์ที่ตรงกับตัวกรอง", en: "No problems match the filter." },
  resetFilter: { th: "ล้างตัวกรอง", en: "Reset filters" },
  all: { th: "ทั้งหมด", en: "All" },
  filterLL: { th: "Learning Log", en: "Learning Log" },
  filterGradable: { th: "ตรวจได้", en: "Gradable" },
  filterSolved: { th: "ผ่านแล้ว", en: "Solved" },
  filterUnsolved: { th: "ยังไม่ผ่าน", en: "Unsolved" },
  viewGrid: { th: "การ์ด", en: "Cards" },
  viewTable: { th: "ตาราง", en: "Matrix" },
  clearConcept: { th: "ล้างแนวคิด", en: "Clear" },
  concept: { th: "ตัวกรองเพิ่มเติม", en: "More filters" },
  llOnly: {
    th: "submission.md ต้องทำเฉพาะโจทย์ที่มีป้าย Learning Log ส่วน ai_reflection.md สร้างได้กับทุกโจทย์ที่ใช้ AI",
    en: "submission.md is required only for problems tagged Learning Log. ai_reflection.md can be made for any problem where AI was used.",
  },
  showing: { th: "แสดง", en: "Showing" },
};

/** Flat segmented control — replaces the folder-tab and pill-row metaphors. */
function Segmented<T extends string | number>({
  options,
  value,
  onChange,
  className,
}: {
  options: readonly (readonly [T, string, React.ComponentType<{ className?: string }>?])[];
  value: T;
  onChange: (v: T) => void;
  className?: string;
}) {
  return (
    <div className={cn("inline-flex items-center gap-0.5 rounded-lg bg-muted/60 p-0.5", className)}>
      {options.map(([key, label, Icon]) => (
        <button
          key={String(key)}
          type="button"
          onClick={() => onChange(key)}
          aria-pressed={value === key}
          className={cn(
            "inline-flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
            value === key
              ? "bg-background text-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {Icon && <Icon className="size-3.5" />}
          {label}
        </button>
      ))}
    </div>
  );
}

export function ProblemList({
  problems,
  progress,
  ghStatus,
  ghReady,
  weeks,
  conceptOptions,
  query,
  onQuery,
  weekFilter,
  onWeekFilter,
  filter,
  onFilter,
  concept,
  onConcept,
  viewMode,
  onViewMode,
  onOpen,
  onToggleSolved,
  onReset,
  locale,
}: {
  problems: PscpProblem[];
  progress: PscpProgress;
  ghStatus: Record<number, { submission?: boolean; reflection?: boolean } | undefined>;
  ghReady: boolean;
  weeks: number[];
  conceptOptions: [string, number][];
  query: string;
  onQuery: (v: string) => void;
  weekFilter: number | "all";
  onWeekFilter: (v: number | "all") => void;
  filter: Filter;
  onFilter: (v: Filter) => void;
  concept: string | null;
  onConcept: (v: string | null) => void;
  viewMode: ViewMode;
  onViewMode: (v: ViewMode) => void;
  onOpen: (id: number) => void;
  onToggleSolved: (id: number, next: boolean) => void;
  onReset: () => void;
  locale: Locale;
}) {
  const cardProps = (p: PscpProblem) => ({
    problem: p,
    solved: Boolean(progress[p.id]?.solved),
    attempt: progress[p.id],
    hasSub: Boolean(ghReady && ghStatus[p.id]?.submission),
    hasRefl: Boolean(ghReady && ghStatus[p.id]?.reflection),
    onOpen: () => onOpen(p.id),
    onToggleSolved: () => onToggleSolved(p.id, !progress[p.id]?.solved),
    locale,
  });

  const grid = (
    <div className="grid gap-3 p-4 sm:grid-cols-2">
      {problems.map((p) => (
        <ProblemCard key={p.id} {...cardProps(p)} />
      ))}
    </div>
  );

  return (
    <section className="overflow-hidden rounded-xl border bg-card">
      {/* Toolbar: search, week, status, view. Sticks to the top on scroll so
          filters stay reachable through a 60-problem list. */}
      <div className="sticky top-0 z-10 space-y-3 border-b bg-card/85 px-4 py-3 backdrop-blur">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-0 flex-1 sm:max-w-64">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={t(L.search, locale)}
              value={query}
              onChange={(e) => onQuery(e.target.value)}
              className="h-8 rounded-lg pl-8 text-xs"
            />
          </div>

          <Segmented
            options={
              [
                ["all", t(L.all, locale)],
                ["ll", t(L.filterLL, locale)],
                ["gradable", t(L.filterGradable, locale)],
                ["solved", t(L.filterSolved, locale)],
                ["unsolved", t(L.filterUnsolved, locale)],
              ] as const
            }
            value={filter}
            onChange={onFilter}
          />

          {/* Matrix is unusable at 7 columns on a phone, so the switch only
              appears once there is room for it. */}
          <Segmented
            className="ml-auto hidden sm:inline-flex"
            options={
              [
                ["grid", t(L.viewGrid, locale), LayoutGrid],
                ["table", t(L.viewTable, locale), List],
              ] as const
            }
            value={viewMode}
            onChange={onViewMode}
          />
        </div>

        {weeks.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto">
            <Segmented
              options={
                [
                  ["all" as const, t(L.all, locale)],
                  ...weeks.map((w) => [w, `W${w}`] as const),
                ] as readonly (readonly [number | "all", string])[]
              }
              value={weekFilter}
              onChange={onWeekFilter}
            />
          </div>
        )}

        {/* Concept chips. The full set is a lot of chips to show by default, so
            it always sits behind a disclosure — expanded only on request. */}
        <details className="group/c">
          <summary className="mb-1.5 flex cursor-pointer list-none items-center gap-1.5 text-xs text-muted-foreground">
            <ChevronDown className="size-3.5 transition-transform group-open/c:rotate-180" />
            {t(L.concept, locale)}
            {concept && <span className="font-medium text-primary">· 1</span>}
          </summary>
          <div className="flex max-h-24 flex-wrap items-center gap-1 overflow-y-auto">
          {conceptOptions.map(([tag, count]) => (
            <button
              key={tag}
              type="button"
              onClick={() => onConcept(concept === tag ? null : tag)}
              aria-pressed={concept === tag}
              className={cn(
                "cursor-pointer rounded-md border px-2 py-0.5 text-xs transition-colors",
                concept === tag
                  ? "border-primary bg-primary/10 font-medium text-primary"
                  : "border-border/70 text-muted-foreground hover:border-foreground/20 hover:text-foreground",
              )}
            >
              {t(tagLabel(tag), locale)}
              <span className="ml-1 font-mono tabular-nums opacity-50">{count}</span>
            </button>
          ))}
          {concept && (
            <button
              type="button"
              onClick={() => onConcept(null)}
              className="cursor-pointer px-1 text-xs font-medium text-primary underline underline-offset-4"
            >
              {t(L.clearConcept, locale)}
            </button>
          )}
          </div>
        </details>
      </div>

      {problems.length === 0 ? (
        <div className="p-12 text-center">
          <Info className="mx-auto size-7 text-muted-foreground/50" />
          <p className="mt-3 text-sm text-muted-foreground">{t(L.empty, locale)}</p>
          <Button variant="outline" size="sm" className="mt-4 rounded-lg" onClick={onReset}>
            {t(L.resetFilter, locale)}
          </Button>
        </div>
      ) : viewMode === "grid" ? (
        grid
      ) : (
        <>
          {/* Below `sm` the matrix falls back to cards rather than a squeezed
              7-column table. Rendered by CSS so no resize listener is needed. */}
          <div className="sm:hidden">{grid}</div>
          <div className="hidden sm:block">
            <Table>
              <TableHeader>
                <TableRow className="bg-transparent hover:bg-transparent">
                  <TableHead className="w-8 pl-4" />
                  <TableHead className="text-xs font-medium">{t(L.problem, locale)}</TableHead>
                  <TableHead className="hidden text-xs font-medium lg:table-cell">
                    {t(L.week, locale)}
                  </TableHead>
                  <TableHead className="hidden text-xs font-medium sm:table-cell">
                    {t(L.difficulty, locale)}
                  </TableHead>
                  <TableHead className="hidden text-xs font-medium lg:table-cell">
                    {t(L.due, locale)}
                  </TableHead>
                  <TableHead className="pr-4 text-right text-xs font-medium">
                    {t(L.actions, locale)}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {problems.map((p, idx) => {
                  const now = new Date();
                  const expired = isExpired(p, now);
                  const prevExpired = idx > 0 && isExpired(problems[idx - 1], now);
                  const showExpiredDivider = expired && !prevExpired && idx > 0;

                  return (
                    <Fragment key={p.id}>
                      {showExpiredDivider && (
                        <TableRow className="border-y bg-muted/30 hover:bg-muted/30">
                          <TableCell
                            colSpan={6}
                            className="px-4 py-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground"
                          >
                            {t(L.expiredSection, locale)}
                          </TableCell>
                        </TableRow>
                      )}
                      <ProblemRow {...cardProps(p)} />
                    </Fragment>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </>
      )}

      <p className="border-t px-4 py-2.5 text-xs text-muted-foreground">{t(L.llOnly, locale)}</p>
    </section>
  );
}
