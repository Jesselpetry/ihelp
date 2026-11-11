"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, Search, X } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useLocale, t, type LText } from "@/lib/i18n";
import type { CourseScoreAllRow, CourseScoreColumn } from "@/lib/scores/types";
import {
  computeClassStats,
  formatCellText,
  formatScore,
  isWithdrawalOrAbsent,
} from "./score-utils";

const L = {
  searchPlaceholder: {
    th: "ค้นหารหัส, ชื่อจริง หรือชื่อเล่น...",
    en: "Search ID, name, or nickname...",
  },
  clearSearch: { th: "ล้างคำค้นหา", en: "Clear search" },
  onlyMine: { th: "เฉพาะของฉัน", en: "Only me" },
  allStudents: { th: "ทั้งหมด", en: "Total" },
  peopleUnit: { th: "คน", en: "students" },
  avg: { th: "เฉลี่ย", en: "Avg" },
  max: { th: "สูงสุด", en: "Max" },
  colName: { th: "ชื่อ - สกุล", en: "Name" },
  meTag: { th: "ฉัน", en: "You" },
  noMatch: {
    th: "ไม่พบข้อมูลนักศึกษาที่ตรงกับคำค้นหา",
    en: "No matching student found",
  },
} satisfies Record<string, LText>;

type SortDir = "asc" | "desc";

function sortNumericValue(
  row: CourseScoreAllRow,
  key: string,
): number {
  if (key === "total") return row.total;
  const val = row.cells[key];
  return typeof val === "number" && Number.isFinite(val) ? val : -1;
}

export function AllScoresTable({
  columns,
  rows,
  viewerId,
  enrolled,
}: {
  columns: CourseScoreColumn[];
  rows: CourseScoreAllRow[];
  viewerId: string;
  enrolled: boolean;
}) {
  const { locale } = useLocale();
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<string>("studentId");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const stats = useMemo(() => computeClassStats(rows), [rows]);
  const hasNames = useMemo(
    () => rows.some((r) => Boolean(r.fullName || r.nickname || r.section)),
    [rows],
  );

  const filteredRows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const matched = q
      ? rows.filter(
          (row) =>
            row.studentId.includes(q) ||
            (row.fullName?.toLowerCase().includes(q) ?? false) ||
            (row.nickname?.toLowerCase().includes(q) ?? false) ||
            (row.section?.toLowerCase().includes(q) ?? false),
        )
      : rows;

    return [...matched].sort((a, b) => {
      if (sortKey === "studentId") {
        const cmp = a.studentId.localeCompare(b.studentId);
        return sortDir === "asc" ? cmp : -cmp;
      }
      if (sortKey === "fullName") {
        const na = a.fullName ?? a.nickname ?? a.studentId;
        const nb = b.fullName ?? b.nickname ?? b.studentId;
        const cmp = na.localeCompare(nb, "th");
        return sortDir === "asc" ? cmp : -cmp;
      }
      const va = sortNumericValue(a, sortKey);
      const vb = sortNumericValue(b, sortKey);
      if (va === vb) return a.studentId.localeCompare(b.studentId);
      return sortDir === "asc" ? va - vb : vb - va;
    });
  }, [rows, query, sortKey, sortDir]);

  function toggleSort(key: string) {
    if (sortKey === key) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "studentId" || key === "fullName" ? "asc" : "desc");
    }
  }

  function renderSortIcon(key: string) {
    if (sortKey !== key) {
      return <ArrowUpDown className="size-3 opacity-40" />;
    }
    return sortDir === "asc" ? (
      <ArrowUp className="size-3 text-primary" />
    ) : (
      <ArrowDown className="size-3 text-primary" />
    );
  }

  return (
    <div className="space-y-3">
      {/* Search + class stats */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          <div className="relative flex items-center w-full max-w-60 h-8 rounded-full border border-border/80 bg-background/70 transition-all focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/20">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t(L.searchPlaceholder, locale)}
              className="h-full w-full rounded-full bg-transparent pl-8 pr-7 text-xs text-foreground placeholder:text-muted-foreground/70 focus:outline-hidden"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label={t(L.clearSearch, locale)}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors cursor-pointer"
              >
                <X className="size-3" />
              </button>
            )}
          </div>

          {enrolled && (
            <button
              type="button"
              onClick={() => setQuery((prev) => (prev === viewerId ? "" : viewerId))}
              className={`h-8 shrink-0 rounded-full border px-2.5 text-[11px] font-medium transition-colors cursor-pointer ${
                query === viewerId
                  ? "border-primary/40 bg-primary/10 text-primary"
                  : "border-border/60 text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              {t(L.onlyMine, locale)}
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-muted-foreground tabular-nums">
          <span className="rounded-full bg-muted/60 px-2 py-0.5">
            {t(L.allStudents, locale)} {stats.count} {t(L.peopleUnit, locale)}
          </span>
          {stats.activeCount > 0 && (
            <>
              <span className="rounded-full bg-muted/60 px-2 py-0.5">
                {t(L.avg, locale)} {formatScore(stats.avg)}
              </span>
              <span className="rounded-full bg-muted/60 px-2 py-0.5">
                {t(L.max, locale)} {formatScore(stats.max)}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Scrollable table */}
      {filteredRows.length === 0 ? (
        <p className="py-8 text-center text-xs text-muted-foreground">
          {t(L.noMatch, locale)}
        </p>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border/50">
          <div className="max-h-[400px] overflow-auto [scrollbar-width:thin]">
            <Table className="text-xs">
              <TableHeader className="sticky top-0 z-20 bg-card/95 backdrop-blur-xs">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="sticky left-0 z-30 bg-card/95 h-9 pl-3 pr-2.5 border-r border-border/40">
                    <button
                      type="button"
                      onClick={() => toggleSort("studentId")}
                      className="inline-flex items-center gap-1 font-semibold text-foreground cursor-pointer"
                    >
                      <span>ID</span>
                      {renderSortIcon("studentId")}
                    </button>
                  </TableHead>
                  {hasNames && (
                    <TableHead className="h-9 px-2.5">
                      <button
                        type="button"
                        onClick={() => toggleSort("fullName")}
                        className="inline-flex items-center gap-1 font-medium text-muted-foreground hover:text-foreground cursor-pointer"
                      >
                        <span>{t(L.colName, locale)}</span>
                        {renderSortIcon("fullName")}
                      </button>
                    </TableHead>
                  )}
                  {columns.map((col) => (
                    <TableHead key={col.key} className="h-9 px-2.5 text-right">
                      <button
                        type="button"
                        onClick={() => toggleSort(col.key)}
                        className="inline-flex items-center justify-end gap-1 font-medium text-muted-foreground hover:text-foreground cursor-pointer"
                      >
                        <span>{col.label}</span>
                        {renderSortIcon(col.key)}
                      </button>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRows.map((row) => {
                  const isMe = row.studentId === viewerId;
                  return (
                    <TableRow
                      key={row.studentId}
                      className={
                        isMe
                          ? "bg-primary/10 hover:bg-primary/15"
                          : "hover:bg-muted/30"
                      }
                    >
                      <TableCell
                        className={`sticky left-0 z-10 py-2 pl-3 pr-2.5 font-mono text-[11px] sm:text-xs border-r border-border/40 ${
                          isMe ? "bg-primary/15 font-semibold text-primary" : "bg-card"
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <span>{row.studentId}</span>
                          {isMe && (
                            <span className="rounded-full bg-primary px-1.5 py-0.2 text-[9px] font-sans font-semibold text-primary-foreground">
                              {t(L.meTag, locale)}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      {hasNames && (
                        <TableCell className="px-2.5 py-2 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs text-foreground">
                              {row.fullName ?? "—"}
                            </span>
                            {row.nickname && (
                              <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                                {row.nickname}
                              </span>
                            )}
                            {row.section && (
                              <span className="rounded-full bg-muted/70 px-1.5 py-0.5 text-[10px] text-muted-foreground">
                                {row.section}
                              </span>
                            )}
                          </div>
                        </TableCell>
                      )}
                      {columns.map((col) => {
                        const rawVal =
                          col.key === "total" ? row.total : row.cells[col.key];
                        const isTotalCol = col.key === "total";
                        const isNa = rawVal === "N/A";
                        const isSpecial = isWithdrawalOrAbsent(rawVal);

                        return (
                          <TableCell
                            key={col.key}
                            className={`px-2.5 py-2 text-right tabular-nums ${
                              isTotalCol ? "font-semibold text-foreground" : ""
                            } ${
                              isNa || isSpecial || (isTotalCol && row.status)
                                ? "text-amber-600 dark:text-amber-400"
                                : rawVal === null
                                  ? "text-muted-foreground/60"
                                  : ""
                            }`}
                          >
                            {isTotalCol && row.status
                              ? row.total > 0
                                ? `${formatScore(row.total)} · ${row.status}`
                                : row.status
                              : formatCellText(rawVal)}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
}

