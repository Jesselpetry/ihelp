"use client";

import { User, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useLocale, t, type LText } from "@/lib/i18n";
import type { CourseScoreViewResponse, ScoreCategoryItem } from "@/lib/scores/types";
import {
  formatCellText,
  formatScore,
  isAlertToken,
  isPositiveToken,
  isWithdrawalOrAbsent,
  resolveLabel,
} from "./score-utils";

const L = {
  notFoundTitle: {
    th: "ไม่พบข้อมูลคะแนนของรหัสนี้ในรายวิชา",
    en: "No score record found for your student ID in this course",
  },
  notFoundBody: {
    th: "คุณสามารถกดดูตารางคะแนนทั้งหมดของรายวิชาได้",
    en: "You can still inspect the full course score sheet.",
  },
  viewAll: { th: "ดูคะแนนทั้งหมด", en: "View all scores" },
  earnedLabel: { th: "คะแนนที่ประกาศแล้ว", en: "Graded so far" },
  pendingSuffix: { th: "รอประกาศ", en: "pending" },
  colItem: { th: "รายการ", en: "Assessment" },
  colScore: { th: "คะแนน", en: "Score" },
  colMax: { th: "เต็ม", en: "Max" },
  colStatus: { th: "สถานะ", en: "Status" },
  statusPending: { th: "รอประกาศ", en: "Pending" },
  statusReleased: { th: "ประกาศแล้ว", en: "Graded" },
  rawPrefix: { th: "ดิบ", en: "Raw" },
} satisfies Record<string, LText>;

function StatusPill({
  category,
  locale,
}: {
  category: ScoreCategoryItem;
  locale: "th" | "en";
}) {
  if (category.pending || category.score === null) {
    return (
      <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
        {t(L.statusPending, locale)}
      </span>
    );
  }
  if (isWithdrawalOrAbsent(category.score)) {
    return (
      <span className="inline-flex items-center rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-medium text-amber-600 dark:text-amber-400">
        {category.score}
      </span>
    );
  }
  if (category.score === "N/A") {
    return (
      <span className="inline-flex items-center rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-medium text-amber-600 dark:text-amber-400">
        #N/A
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
      {t(L.statusReleased, locale)}
    </span>
  );
}

export function PersonalScoreView({
  data,
  onOpenAll,
  embedded = false,
}: {
  data: CourseScoreViewResponse;
  onOpenAll: () => void;
  /** Flatten the summary strip inside another card/accordion to avoid nested borders. */
  embedded?: boolean;
}) {
  const { locale } = useLocale();

  if (!data.enrolled || !data.mySummary) {
    const identityText = [data.viewerNickname, data.viewerFullName]
      .filter(Boolean)
      .join(" · ");
    return (
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-border/50 bg-muted/25 px-4 py-3.5">
        <div className="space-y-0.5">
          <p className="text-xs sm:text-sm font-medium text-foreground">
            {t(L.notFoundTitle, locale)} ({data.viewerId}
            {identityText ? ` · ${identityText}` : ""})
          </p>
          <p className="text-xs text-muted-foreground">{t(L.notFoundBody, locale)}</p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onOpenAll}
          className="h-8 gap-1.5 rounded-full text-xs shrink-0 self-start sm:self-auto cursor-pointer"
        >
          <Users className="size-3.5" />
          <span>{t(L.viewAll, locale)}</span>
        </Button>
      </div>
    );
  }

  const { total, gradedMax, fullMax, status } = data.mySummary;
  const safeFull = fullMax > 0 ? fullMax : Math.max(gradedMax, 1);
  const pct = (n: number) => `${Math.max(0, Math.min(100, (n / safeFull) * 100))}%`;
  const pendingCategories = data.categories.filter((c) => c.pending);
  const pendingMax = pendingCategories.reduce((sum, c) => sum + c.max, 0);
  const gradedPct = gradedMax > 0 ? Math.round((total / gradedMax) * 1000) / 10 : 0;

  const hasIdentity = Boolean(
    data.viewerFullName || data.viewerNickname || data.viewerSection,
  );

  return (
    <div className="space-y-3.5">
      {/* Compact total & progress bar */}
      <div
        className={
          embedded
            ? "px-0.5 pb-0.5"
            : "rounded-xl border border-border/50 bg-muted/20 px-3.5 py-3"
        }
      >
        {!embedded && hasIdentity && (
          <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2 border-b border-border/40 pb-2">
            <div className="flex flex-wrap items-center gap-1.5 min-w-0">
              <User className="size-3.5 shrink-0 text-muted-foreground" />
              <span className="truncate text-xs sm:text-sm font-medium text-foreground">
                {data.viewerFullName ?? data.viewerId}
              </span>
              {data.viewerNickname && (
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                  {data.viewerNickname}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <span className="font-mono">{data.viewerId}</span>
              {data.viewerSection && (
                <span className="rounded-full bg-muted/70 px-2 py-0.5 font-medium text-muted-foreground">
                  {data.viewerSection}
                </span>
              )}
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground">
              {t(L.earnedLabel, locale)}
            </span>
            {embedded && data.viewerSection && (
              <span className="rounded-full bg-muted/70 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                {data.viewerSection}
              </span>
            )}
            {status && (
              <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-semibold text-amber-600 dark:text-amber-400">
                {status}
              </span>
            )}
          </div>
          <div className="flex items-baseline gap-1.5 tabular-nums">
            <span className="text-lg font-bold text-foreground">
              {formatScore(total)}
            </span>
            <span className="text-xs text-muted-foreground">
              / {formatScore(gradedMax)} ({gradedPct}%)
            </span>
          </div>
        </div>

        <div className="mt-2 flex h-1.5 w-full gap-0.5 overflow-hidden rounded-full bg-muted/60">
          <div className="h-full bg-primary transition-all" style={{ width: pct(total) }} />
          <div
            className="h-full bg-muted"
            style={{ width: pct(Math.max(0, gradedMax - total)) }}
          />
          {pendingMax > 0 && (
            <div className="h-full bg-primary/20" style={{ width: pct(pendingMax) }} />
          )}
        </div>

        {pendingCategories.length > 0 && (
          <p className="mt-1.5 text-[11px] text-muted-foreground">
            {pendingCategories
              .map((p) => `${resolveLabel(p.label, locale)} ${p.max}`)
              .join(" · ")}{" "}
            · {t(L.pendingSuffix, locale)}
          </p>
        )}
      </div>

      {/* Breakdown table */}
      <div className="overflow-hidden rounded-xl border border-border/50">
        <Table className="text-xs sm:text-sm">
          <TableHeader>
            <TableRow className="bg-muted/35 hover:bg-muted/35 text-[11px] text-muted-foreground">
              <TableHead className="h-9 pl-3.5">{t(L.colItem, locale)}</TableHead>
              <TableHead className="h-9 text-right">{t(L.colScore, locale)}</TableHead>
              <TableHead className="h-9 text-right">{t(L.colMax, locale)}</TableHead>
              <TableHead className="h-9 pr-3.5 text-right">{t(L.colStatus, locale)}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.categories.map((cat) => {
              const title = resolveLabel(cat.label, locale);
              return (
                <TableRow key={cat.key} className="hover:bg-muted/20">
                  <TableCell className="py-2.5 pl-3.5 align-top whitespace-normal">
                    <div className="font-medium text-foreground">{title}</div>
                    {cat.rawSummary && (
                      <div className="text-[11px] text-muted-foreground tabular-nums">
                        {t(L.rawPrefix, locale)} {formatScore(cat.rawSummary.earned)} /{" "}
                        {formatScore(cat.rawSummary.max)}
                      </div>
                    )}
                    {cat.subParts && cat.subParts.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {cat.subParts.map((sub) => {
                          const isAlert = isAlertToken(sub.value);
                          const isPositive = isPositiveToken(sub.value);
                          const chipTone = isAlert
                            ? "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                            : isPositive
                              ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                              : "border-border/50 bg-muted/40 text-foreground";
                          return (
                            <span
                              key={sub.key}
                              title={sub.note}
                              className={`inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[11px] tabular-nums ${chipTone}`}
                            >
                              <span className="text-muted-foreground">{sub.label}</span>
                              <span className="font-semibold">
                                {formatCellText(sub.value)}
                              </span>
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="py-2.5 text-right font-semibold tabular-nums align-top">
                    {isWithdrawalOrAbsent(cat.score) ? "—" : formatCellText(cat.score)}
                  </TableCell>
                  <TableCell className="py-2.5 text-right text-muted-foreground tabular-nums align-top">
                    {formatScore(cat.max)}
                  </TableCell>
                  <TableCell className="py-2.5 pr-3.5 text-right align-top">
                    <StatusPill category={cat} locale={locale} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

