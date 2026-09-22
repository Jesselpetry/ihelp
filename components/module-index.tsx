"use client";

import { useMemo, useState } from "react";
import {
  ArrowRight,
  Check,
  FileText,
  Flag,
  LayoutGrid,
  Milestone,
  Play,
  Search,
  Table2,
  Target,
  X,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocale, t, type LText } from "@/lib/i18n";
import { docFacts, splitTitle } from "@/lib/doc-index";
import type { ModuleScope } from "@/lib/spine";
import type { ReaderDoc } from "@/components/module-reader";

/**
 * The front door of a multi-document module.
 *
 * Supports both Table View (matching the /library design) and Grid View,
 * defaulting to Table View as requested.
 */

const SCOPE_LABEL: Record<ModuleScope, LText> = {
  all: { th: "ทั้งหมด", en: "All" },
  midterm: { th: "ก่อนมิดเทอม", en: "Midterm" },
  final: { th: "หลังมิดเทอม", en: "Final" },
};

/**
 * One hue at two volumes, matching components/subject-track-grid.tsx
 */
const SCOPE_BADGE: Record<Exclude<ModuleScope, "all">, string> = {
  midterm: "border-transparent bg-primary text-primary-foreground shadow-xs",
  final: "border-primary/30 bg-primary/10 text-primary",
};

const L = {
  progress: { th: "เปิดอ่านแล้ว", en: "Opened" },
  of: { th: "จาก", en: "of" },
  opened: { th: "เปิดแล้ว", en: "Opened" },
  resume: { th: "อ่านต่อที่นี่", en: "Continue here" },
  open: { th: "เปิดอ่าน", en: "Open" },
  overview: { th: "เริ่มที่ภาพรวม", en: "Start with the overview" },
  overviewBadge: { th: "ภาพรวม", en: "Overview" },
  videos: { th: "คลิป", en: "clips" },
  files: { th: "ไฟล์", en: "files" },
  objectives: { th: "เป้าหมาย", en: "objectives" },
  empty: { th: "ไม่มีเอกสารในช่วงนี้", en: "Nothing in this milestone" },
  filterLabel: { th: "กรองตามช่วงสอบ", en: "Filter by exam scope" },
  searchPlaceholder: { th: "ค้นหาชื่อคาบเรียน หรือเนื้อหา…", en: "Search sessions or topics…" },
  tableView: { th: "มุมมองตาราง", en: "Table view" },
  gridView: { th: "มุมมองการ์ด", en: "Grid view" },
  colSession: { th: "คาบเรียน / หัวข้อ", en: "Session / Topic" },
  colScope: { th: "ช่วงสอบ", en: "Scope" },
  colMaterials: { th: "สื่อการเรียน", en: "Materials" },
  colStatus: { th: "สถานะ", en: "Status" },
  colActions: { th: "การดำเนินการ", en: "Actions" },
  noResults: { th: "ไม่พบบทเรียนที่ตรงกับคำค้นหา", en: "No sessions match your search" },
} satisfies Record<string, LText>;

export function ScopeTag({ scope }: { scope: Exclude<ModuleScope, "all"> }) {
  const { locale } = useLocale();
  const Icon = scope === "midterm" ? Milestone : Flag;
  return (
    <span
      className={`inline-flex items-center gap-0.5 rounded-full border px-1.5 py-0.5 text-[9px] font-semibold ${SCOPE_BADGE[scope]}`}
    >
      <Icon className="size-2.5" />
      {t(SCOPE_LABEL[scope], locale)}
    </span>
  );
}

interface ModuleIndexProps {
  docs: ReaderDoc[];
  title?: LText;
  subtitle?: LText;
  /** Slugs already opened, from lib/reading-progress.ts. */
  opened: ReadonlySet<string>;
  /** Opens the document at this position in `docs`. */
  onOpen: (index: number) => void;
}

/** A count with its unit, hidden entirely when the document has none. */
function Stat({
  icon: Icon,
  value,
  label,
}: {
  icon: LucideIcon;
  value: number;
  label: LText;
}) {
  const { locale } = useLocale();
  if (value === 0) return null;
  return (
    <span className="inline-flex items-center gap-1 whitespace-nowrap">
      <Icon className="size-3 shrink-0" aria-hidden />
      {value}
      <span className="hidden sm:inline">{t(label, locale)}</span>
    </span>
  );
}

function DocCard({
  doc,
  opened,
  next,
  lead,
  onOpen,
}: {
  doc: ReaderDoc;
  opened: boolean;
  /** The first unopened document, marked so the shelf has an obvious entry point. */
  next: boolean;
  lead: ReturnType<typeof docFacts>;
  onOpen: () => void;
}) {
  const { locale } = useLocale();
  const { eyebrow, rest } = splitTitle(t(doc.title, locale));

  return (
    <button
      type="button"
      onClick={onOpen}
      className={`group relative flex h-full flex-col justify-between gap-3 overflow-hidden rounded-2xl border bg-card p-4 text-left shadow-xs transition-all hover:border-primary/50 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
        next ? "border-primary/40 ring-1 ring-primary/20" : ""
      }`}
    >
      {next && <span className="absolute inset-x-0 top-0 h-0.5 bg-primary" aria-hidden />}

      <div className="min-w-0 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <span className="inline-flex items-center gap-1.5">
            {eyebrow && (
              <span className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-semibold text-foreground/80">
                {eyebrow}
              </span>
            )}
            {doc.scope && <ScopeTag scope={doc.scope} />}
          </span>

          {opened ? (
            <span className="inline-flex shrink-0 items-center gap-0.5 text-[10px] font-medium text-muted-foreground">
              <Check className="size-3" aria-hidden />
              {t(L.opened, locale)}
            </span>
          ) : (
            next && (
              <span className="shrink-0 text-[10px] font-semibold text-primary">
                {t(L.resume, locale)}
              </span>
            )
          )}
        </div>

        <h3 className="line-clamp-2 text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
          {rest}
        </h3>

        {lead.lead && (
          <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
            {lead.lead}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between gap-2 border-t pt-2.5 text-[11px] text-muted-foreground">
        <span className="flex min-w-0 items-center gap-2.5">
          <Stat icon={Play} value={lead.videos} label={L.videos} />
          <Stat icon={FileText} value={lead.files} label={L.files} />
          <Stat icon={Target} value={lead.objectives} label={L.objectives} />
        </span>
        <span className="inline-flex shrink-0 items-center gap-0.5 font-medium text-primary">
          {t(L.open, locale)}
          <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </button>
  );
}

function ModuleTable({
  rows,
  opened,
  nextIndex,
  onOpen,
}: {
  rows: { doc: ReaderDoc; index: number; facts: ReturnType<typeof docFacts> }[];
  opened: ReadonlySet<string>;
  nextIndex: number;
  onOpen: (index: number) => void;
}) {
  const { locale } = useLocale();

  return (
    <div className="overflow-hidden rounded-2xl border bg-card shadow-xs">
      {/* Mobile Card List (shown on < sm) */}
      <div className="sm:hidden divide-y divide-border/40">
        {rows.map(({ doc, index, facts: docFact }) => {
          const { eyebrow, rest } = splitTitle(t(doc.title, locale));
          const isOpened = opened.has(doc.slug);
          const isNext = index === nextIndex;
          const isLead = doc.scope === undefined && index === 0;

          return (
            <div
              key={`mobile-${doc.slug}`}
              onClick={() => onOpen(index)}
              className={`p-3.5 transition-colors active:bg-muted/50 cursor-pointer relative ${
                isNext ? "bg-primary/[0.03]" : ""
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {eyebrow ? (
                    <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-semibold text-foreground/80">
                      {eyebrow}
                    </span>
                  ) : isLead ? (
                    <span className="rounded-md bg-primary/15 text-primary px-2 py-0.5 text-[10px] font-semibold">
                      {t(L.overviewBadge, locale)}
                    </span>
                  ) : null}
                  {doc.scope && <ScopeTag scope={doc.scope} />}
                </div>

                <div className="shrink-0">
                  {isOpened ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                      <Check className="size-3" />
                      {t(L.opened, locale)}
                    </span>
                  ) : isNext ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                      {t(L.resume, locale)}
                    </span>
                  ) : null}
                </div>
              </div>

              <h4 className="mt-1.5 text-xs sm:text-sm font-semibold text-foreground">
                {rest}
              </h4>

              {docFact.lead && (
                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                  {docFact.lead}
                </p>
              )}

              <div className="mt-2.5 flex items-center justify-between gap-2 pt-2 border-t border-border/40">
                <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
                  <Stat icon={Play} value={docFact.videos} label={L.videos} />
                  <Stat icon={FileText} value={docFact.files} label={L.files} />
                  <Stat icon={Target} value={docFact.objectives} label={L.objectives} />
                </div>

                <Button
                  type="button"
                  size="sm"
                  variant={isNext ? "default" : "outline"}
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpen(index);
                  }}
                  className="h-7 px-2.5 text-xs gap-1 rounded-full shadow-2xs"
                >
                  <span>{t(L.open, locale)}</span>
                  <ArrowRight className="size-3" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop Table (shown on >= sm) */}
      <div className="hidden sm:block overflow-x-auto [scrollbar-width:thin]">
        <table className="w-full min-w-[620px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b bg-muted/40 text-xs font-semibold text-muted-foreground select-none">
              <th scope="col" className="py-3 pl-4 pr-3">
                {t(L.colSession, locale)}
              </th>
              <th scope="col" className="py-3 px-3 whitespace-nowrap">
                {t(L.colScope, locale)}
              </th>
              <th scope="col" className="py-3 px-3 whitespace-nowrap">
                {t(L.colMaterials, locale)}
              </th>
              <th scope="col" className="py-3 px-3 whitespace-nowrap">
                {t(L.colStatus, locale)}
              </th>
              <th
                scope="col"
                className="sticky right-0 z-10 w-28 whitespace-nowrap bg-muted/95 backdrop-blur-xs py-3 pl-2 pr-4 text-right shadow-[-6px_0_10px_-4px_rgba(0,0,0,0.06)]"
              >
                <span>{t(L.colActions, locale)}</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {rows.map(({ doc, index, facts: docFact }) => {
              const { eyebrow, rest } = splitTitle(t(doc.title, locale));
              const isOpened = opened.has(doc.slug);
              const isNext = index === nextIndex;
              const isLead = doc.scope === undefined && index === 0;

              return (
                <tr
                  key={doc.slug}
                  onClick={() => onOpen(index)}
                  className={`group transition-colors hover:bg-muted/35 cursor-pointer ${
                    isNext ? "bg-primary/[0.03]" : ""
                  }`}
                >
                  {/* Session & Title */}
                  <td className="py-3 pl-4 pr-3 max-w-[280px] sm:max-w-[360px] md:max-w-[460px]">
                    <div className="flex items-start gap-2.5">
                      <span
                        aria-hidden
                        className={`h-8 w-1 shrink-0 rounded-full mt-0.5 transition-colors ${
                          isNext
                            ? "bg-primary"
                            : "bg-primary/30 group-hover:bg-primary"
                        }`}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-1.5">
                          {eyebrow ? (
                            <span className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-semibold text-foreground/80">
                              {eyebrow}
                            </span>
                          ) : isLead ? (
                            <span className="rounded-md bg-primary/15 text-primary px-2 py-0.5 text-[11px] font-semibold">
                              {t(L.overviewBadge, locale)}
                            </span>
                          ) : null}
                          <span className="truncate text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                            {rest}
                          </span>
                        </div>
                        {docFact.lead && (
                          <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                            {docFact.lead}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Scope */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    {doc.scope ? (
                      <ScopeTag scope={doc.scope} />
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </td>

                  {/* Materials / Stats */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
                      <Stat icon={Play} value={docFact.videos} label={L.videos} />
                      <Stat icon={FileText} value={docFact.files} label={L.files} />
                      <Stat icon={Target} value={docFact.objectives} label={L.objectives} />
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    {isOpened ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                        <Check className="size-3.5" />
                        {t(L.opened, locale)}
                      </span>
                    ) : isNext ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                        {t(L.resume, locale)}
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="sticky right-0 z-10 w-28 whitespace-nowrap bg-card/95 backdrop-blur-xs py-3 pl-2 pr-4 text-right shadow-[-6px_0_10px_-4px_rgba(0,0,0,0.06)]">
                    <Button
                      type="button"
                      size="sm"
                      variant={isNext ? "default" : "outline"}
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpen(index);
                      }}
                      className="gap-1 rounded-full text-xs font-medium shadow-2xs h-7 px-3"
                    >
                      <span>{t(L.open, locale)}</span>
                      <ArrowRight className="size-3" />
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function ModuleIndex({ docs, title, subtitle, opened, onOpen }: ModuleIndexProps) {
  const { locale } = useLocale();
  const [layout, setLayout] = useState<"table" | "grid">("table");
  const [search, setSearch] = useState("");

  const facts = useMemo(() => docs.map((doc) => docFacts(doc.markdown)), [docs]);

  const scoped = docs.filter((doc) => doc.scope !== undefined);
  const hasLead = scoped.length > 0 && scoped.length < docs.length;
  const leadIndex = hasLead ? docs.findIndex((doc) => doc.scope === undefined) : -1;

  const scopes = Array.from(
    new Set(scoped.map((doc) => doc.scope!)),
  ) as Exclude<ModuleScope, "all">[];
  const [scope, setScope] = useState<Exclude<ModuleScope, "all"> | "all">("all");

  const showFilter = scopes.length > 1;
  const activeScope = showFilter ? scope : "all";

  // Filtered rows
  const allRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return docs
      .map((doc, index) => ({ doc, index, facts: facts[index] }))
      .filter(({ doc, facts: docFact }) => {
        if (activeScope !== "all" && doc.scope && doc.scope !== activeScope) {
          return false;
        }
        if (!q) return true;
        const titleTh = t(doc.title, "th").toLowerCase();
        const titleEn = t(doc.title, "en").toLowerCase();
        const lead = (docFact.lead ?? "").toLowerCase();
        return titleTh.includes(q) || titleEn.includes(q) || lead.includes(q);
      });
  }, [docs, facts, activeScope, search]);

  // For grid layout, keep lead document as a banner if present
  const gridCards = useMemo(() => {
    return allRows.filter(({ index }) => index !== leadIndex);
  }, [allRows, leadIndex]);

  const openedCount = docs.filter((doc) => opened.has(doc.slug)).length;
  const percent = docs.length === 0 ? 0 : Math.round((openedCount / docs.length) * 100);

  const nextIndex = allRows.find(({ doc }) => !opened.has(doc.slug))?.index ?? -1;

  return (
    <div className="space-y-5">
      {(title || subtitle) && (
        <header className="space-y-1.5">
          {title && (
            <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              {t(title, locale)}
            </h1>
          )}
          {subtitle && (
            <p className="max-w-3xl text-xs leading-relaxed text-muted-foreground sm:text-sm">
              {t(subtitle, locale)}
            </p>
          )}
        </header>
      )}

      {/* Control Toolbar matching /library style */}
      <div className="flex flex-col gap-3 border-b pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {showFilter && (
            <div
              role="group"
              aria-label={t(L.filterLabel, locale)}
              className="inline-flex w-fit gap-1 rounded-xl border bg-muted/50 p-1"
            >
              {(["all", ...scopes] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  aria-pressed={activeScope === option}
                  onClick={() => setScope(option)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                    activeScope === option
                      ? "bg-card text-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t(SCOPE_LABEL[option], locale)}
                </button>
              ))}
            </div>
          )}

          {/* Search box */}
          <div className="relative w-full sm:w-64">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t(L.searchPlaceholder, locale)}
              className="w-full rounded-full border bg-background/90 py-1.5 pl-8 pr-7 text-xs shadow-2xs placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-muted-foreground hover:text-foreground"
              >
                <X className="size-3" />
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 sm:justify-end">
          {/* Progress */}
          <div className="flex items-center gap-2">
            <div
              className="h-1.5 w-20 overflow-hidden rounded-full bg-muted sm:w-28"
              role="progressbar"
              aria-valuenow={openedCount}
              aria-valuemin={0}
              aria-valuemax={docs.length}
            >
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: `${percent}%` }}
              />
            </div>
            <span className="whitespace-nowrap text-[11px] font-medium text-muted-foreground">
              {t(L.progress, locale)} {openedCount} {t(L.of, locale)} {docs.length}
            </span>
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center gap-0.5 rounded-full border bg-card p-1 shadow-2xs">
            <button
              type="button"
              onClick={() => setLayout("table")}
              aria-label={t(L.tableView, locale)}
              title={t(L.tableView, locale)}
              className={`rounded-full p-1.5 transition-colors cursor-pointer ${
                layout === "table"
                  ? "bg-primary text-primary-foreground shadow-2xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Table2 className="size-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setLayout("grid")}
              aria-label={t(L.gridView, locale)}
              title={t(L.gridView, locale)}
              className={`rounded-full p-1.5 transition-colors cursor-pointer ${
                layout === "grid"
                  ? "bg-primary text-primary-foreground shadow-2xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <LayoutGrid className="size-3.5" />
            </button>
          </div>
        </div>
      </div>

      {allRows.length === 0 ? (
        <p className="rounded-2xl border border-dashed p-8 text-center text-xs text-muted-foreground">
          {search ? t(L.noResults, locale) : t(L.empty, locale)}
        </p>
      ) : layout === "table" ? (
        <ModuleTable
          rows={allRows}
          opened={opened}
          nextIndex={nextIndex}
          onOpen={onOpen}
        />
      ) : (
        <div className="space-y-4">
          {leadIndex >= 0 && !search && (activeScope === "all" || docs[leadIndex].scope === activeScope) && (
            <button
              type="button"
              onClick={() => onOpen(leadIndex)}
              className="group flex w-full items-center justify-between gap-4 rounded-2xl border border-primary/25 bg-primary/5 p-4 text-left transition-colors hover:border-primary/50 hover:bg-primary/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <span className="min-w-0 space-y-1">
                <span className="block text-[10px] font-semibold uppercase tracking-wide text-primary">
                  {t(L.overview, locale)}
                </span>
                <span className="block truncate text-sm font-semibold text-foreground">
                  {t(docs[leadIndex].title, locale)}
                </span>
                {facts[leadIndex].lead && (
                  <span className="line-clamp-2 block text-xs leading-relaxed text-muted-foreground">
                    {facts[leadIndex].lead}
                  </span>
                )}
              </span>
              <ArrowRight className="size-4 shrink-0 text-primary transition-transform group-hover:translate-x-0.5" />
            </button>
          )}

          <ul className="grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2 xl:grid-cols-3">
            {gridCards.map(({ doc, index, facts: docFact }) => (
              <li key={doc.slug} className="m-0 p-0">
                <DocCard
                  doc={doc}
                  lead={docFact}
                  opened={opened.has(doc.slug)}
                  next={index === nextIndex}
                  onOpen={() => onOpen(index)}
                />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
