"use client";

import Link from "next/link";
import { ArrowRight, Code2, Sparkles, Terminal } from "lucide-react";
import type { OjProblemItem } from "@/lib/docs/oj-table";
import { useLocale, t, type LText } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface OjProblemsDeckProps {
  items: OjProblemItem[];
  onOpenProblem?: (id: number) => void;
}

const L = {
  sectionTitle: { th: "โจทย์ iJudge ประจำสัปดาห์", en: "Weekly iJudge Problems" },
  problemsCount: { th: "ข้อ", en: "problems" },
  llRequired: { th: "ต้องส่ง Learning Log", en: "Learning Log" },
  colProblem: { th: "รหัสและชื่อโจทย์", en: "Problem" },
  colDifficulty: { th: "ระดับ", en: "Level" },
  colTags: { th: "ป้ายกำกับ", en: "Tags" },
  colTakeaway: { th: "แนวคิดสำคัญและจุดสังเกต", en: "Key Concepts & Hints" },
  colActions: { th: "การดำเนินการ", en: "Actions" },
  solveInIhelp: { th: "ทำโจทย์ใน iHelp", en: "Solve in iHelp" },
  level: { th: "ระดับ", en: "Level" },
  conceptNote: { th: "แนวคิดสำคัญ:", en: "Key takeaway:" },
} satisfies Record<string, LText>;

function difficultyBadge(diff: number | undefined) {
  if (diff === undefined) return null;
  if (diff === 0) {
    return {
      label: "Level 0",
      className: "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    };
  }
  if (diff === 1) {
    return {
      label: "Level 1",
      className: "border-sky-500/30 bg-sky-500/10 text-sky-600 dark:text-sky-400",
    };
  }
  if (diff === 2) {
    return {
      label: "Level 2",
      className: "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400",
    };
  }
  return {
    label: `Level ${diff}`,
    className: "border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400",
  };
}

export function OjProblemsDeck({ items, onOpenProblem }: OjProblemsDeckProps) {
  const { locale } = useLocale();
  const llCount = items.filter((item) => item.isLearningLog).length;

  return (
    <section className="brand-shelf my-6 not-prose">
      {/* Header Bar */}
      <div className="mb-3 flex items-center justify-between gap-2 px-0.5">
        <div className="flex items-center gap-2">
          <div className="flex size-6 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Code2 className="size-3.5" />
          </div>
          <h3 className="text-xs font-semibold text-foreground sm:text-sm">
            {t(L.sectionTitle, locale)}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          {llCount > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-600 dark:text-amber-400">
              <Sparkles className="size-3" />
              <span>{llCount} {t(L.llRequired, locale)}</span>
            </span>
          )}
          <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
            {items.length} {t(L.problemsCount, locale)}
          </span>
        </div>
      </div>

      {/* Mobile Card View (shown on < sm) */}
      <div className="space-y-2.5 sm:hidden">
        {items.map((item, idx) => {
          const diffMeta = difficultyBadge(item.difficulty);

          const handleOpen = (e: React.MouseEvent) => {
            if (onOpenProblem && item.id) {
              e.preventDefault();
              onOpenProblem(item.id);
            }
          };

          return (
            <div
              key={`mobile-oj-${item.slug}-${idx}`}
              className="relative overflow-hidden rounded-2xl border bg-card p-3.5 shadow-2xs transition-colors hover:border-primary/40"
            >
              {/* Left Accent Bar */}
              <div
                aria-hidden
                className={cn(
                  "absolute left-0 top-0 bottom-0 w-1",
                  item.isLearningLog ? "bg-amber-500" : "bg-primary/50",
                )}
              />

              <div className="space-y-2 pl-1.5">
                {/* Meta Badges */}
                <div className="flex flex-wrap items-center justify-between gap-1.5">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 font-mono text-[11px] font-semibold text-foreground">
                      <Terminal className="size-2.5 text-primary" />
                      {item.code}
                    </span>
                    {diffMeta && (
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium",
                          diffMeta.className,
                        )}
                      >
                        {diffMeta.label}
                      </span>
                    )}
                    {item.isLearningLog && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-600 dark:text-amber-400">
                        <Sparkles className="size-2.5" />
                        [LL]
                      </span>
                    )}
                    {item.tags && (
                      <span className="inline-flex items-center rounded-md border bg-muted/50 px-1.5 py-0.5 text-[10px] text-muted-foreground">
                        {item.tags}
                      </span>
                    )}
                  </div>
                </div>

                {/* Problem Title */}
                <div>
                  <Link
                    href={item.href}
                    onClick={handleOpen}
                    className="block text-left text-sm font-semibold text-foreground transition-colors hover:text-primary"
                  >
                    {item.name}
                  </Link>
                </div>

                {/* Conceptual Takeaway / Hints */}
                {item.takeaway && (
                  <div className="rounded-lg bg-muted/40 p-2 text-xs text-muted-foreground leading-relaxed">
                    <span className="font-medium text-foreground mr-1">
                      {t(L.conceptNote, locale)}
                    </span>
                    {item.takeaway}
                  </div>
                )}

                {/* Action Button: redirect into iHelp workspace */}
                <div className="pt-1">
                  <Link
                    href={item.href}
                    onClick={handleOpen}
                    className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-primary/30 bg-primary/10 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground focus-visible:outline-none"
                  >
                    <span>{t(L.solveInIhelp, locale)}</span>
                    <ArrowRight className="size-3" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop Table View (shown on sm and up) */}
      <div className="hidden sm:block overflow-hidden rounded-2xl border bg-card shadow-xs">
        <div className="overflow-x-auto [scrollbar-width:thin]">
          <table className="w-full min-w-[620px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b bg-muted/40 text-xs font-semibold text-muted-foreground select-none">
                <th scope="col" className="py-3 pl-4 pr-3">
                  {t(L.colProblem, locale)}
                </th>
                <th scope="col" className="py-3 px-3 whitespace-nowrap text-center">
                  {t(L.colDifficulty, locale)}
                </th>
                <th scope="col" className="py-3 px-3 whitespace-nowrap text-center">
                  {t(L.colTags, locale)}
                </th>
                <th scope="col" className="py-3 px-3">
                  {t(L.colTakeaway, locale)}
                </th>
                <th
                  scope="col"
                  className="sticky right-0 z-10 w-32 whitespace-nowrap bg-muted/95 backdrop-blur-xs py-3 pl-2 pr-4 text-right shadow-[-6px_0_10px_-4px_rgba(0,0,0,0.06)]"
                >
                  <span>{t(L.colActions, locale)}</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {items.map((item, idx) => {
                const diffMeta = difficultyBadge(item.difficulty);

                const handleOpen = (e: React.MouseEvent) => {
                  if (onOpenProblem && item.id) {
                    e.preventDefault();
                    onOpenProblem(item.id);
                  }
                };

                return (
                  <tr
                    key={`desktop-oj-${item.slug}-${idx}`}
                    className="group transition-colors hover:bg-muted/30"
                  >
                    {/* Problem Code & Name */}
                    <td className="py-3 pl-4 pr-3 max-w-[220px]">
                      <div className="flex items-center gap-2.5">
                        <span
                          aria-hidden
                          className={cn(
                            "h-7 w-1 shrink-0 rounded-full",
                            item.isLearningLog ? "bg-amber-500" : "bg-primary/50",
                          )}
                        />
                        <div className="min-w-0 flex-1">
                          <Link
                            href={item.href}
                            onClick={handleOpen}
                            className="block truncate text-sm font-medium text-foreground transition-colors group-hover:text-primary"
                          >
                            {item.name}
                          </Link>
                          <span className="inline-block font-mono text-[11px] text-muted-foreground">
                            {item.code}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Difficulty */}
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      {diffMeta ? (
                        <span
                          className={cn(
                            "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium",
                            diffMeta.className,
                          )}
                        >
                          {diffMeta.label}
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">-</span>
                      )}
                    </td>

                    {/* Tags & LL */}
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      <div className="inline-flex flex-wrap items-center justify-center gap-1">
                        {item.isLearningLog && (
                          <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-600 dark:text-amber-400">
                            <Sparkles className="size-2.5" />
                            LL
                          </span>
                        )}
                        {item.tags && (
                          <span className="inline-flex items-center rounded-md border bg-muted/60 px-1.5 py-0.5 text-[10px] text-muted-foreground">
                            {item.tags}
                          </span>
                        )}
                        {!item.isLearningLog && !item.tags && (
                          <span className="text-xs text-muted-foreground">-</span>
                        )}
                      </div>
                    </td>

                    {/* Conceptual Takeaway / Hints */}
                    <td className="py-3 px-3 text-xs text-muted-foreground leading-relaxed max-w-[360px] lg:max-w-[460px]">
                      {item.takeaway || "-"}
                    </td>

                    {/* Action: Redirect into iHelp */}
                    <td className="sticky right-0 z-10 whitespace-nowrap bg-card/95 backdrop-blur-xs py-3 pl-2 pr-4 text-right shadow-[-6px_0_10px_-4px_rgba(0,0,0,0.06)] group-hover:bg-muted/95">
                      <Link
                        href={item.href}
                        onClick={handleOpen}
                        className="inline-flex items-center gap-1 rounded-lg border border-primary/30 bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary transition-all hover:bg-primary hover:text-primary-foreground focus-visible:outline-none"
                        title={t(L.solveInIhelp, locale)}
                      >
                        <span>{t(L.solveInIhelp, locale)}</span>
                        <ArrowRight className="size-3" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

