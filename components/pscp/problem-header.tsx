"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { ExternalLink, Star, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocale, t, type LText } from "@/lib/i18n";
import { tagLabel } from "@/lib/pscp/pscp-tags";
import { isPscpBookmarked, togglePscpBookmark, PSCP_BOOKMARKS_EVENT } from "@/lib/pscp/pscp-client";
import { shortDate } from "@/components/pscp/problem-primitives";
import type { PscpLimits, PscpStats } from "@/lib/pscp/pscp";
import { cn } from "@/lib/utils";

const L: Record<string, LText> = {
  pscp: { th: "PSCP", en: "PSCP" },
  week: { th: "สัปดาห์ที่", en: "Week" },
  midterm: { th: "Midterm", en: "Midterm" },
  onIJudge: { th: "เปิดบน iJudge", en: "Open on iJudge" },
  close: { th: "ปิด", en: "Close" },
  pass: { th: "ผ่าน", en: "Pass" },
  limit: { th: "จำกัด", en: "Limit" },
  due: { th: "หมดเขต", en: "Due" },
  expired: { th: "หมดเขตแล้ว", en: "Expired" },
  bookmark: { th: "บันทึกบุ๊กมาร์ก", en: "Bookmark problem" },
  bookmarked: { th: "บุ๊กมาร์กแล้ว", en: "Bookmarked" },
  difficulty: { th: "ความยาก", en: "Difficulty" },
};

export interface ProblemHeaderProps {
  id: string | number;
  title: string;
  week?: number | null;
  examType?: string;
  tags: string[];
  stats: PscpStats;
  expireLabel?: string;
  expireIso?: string | null;
  limits?: PscpLimits | null;
  difficulty?: number;
  url?: string;
  onClose?: () => void;
  className?: string;
  isBookmarked?: boolean;
  onToggleBookmark?: () => void;
}

export function ProblemHeader({
  id,
  title,
  week,
  examType,
  tags,
  stats,
  expireLabel,
  expireIso,
  limits,
  difficulty,
  url,
  onClose,
  className,
  isBookmarked: controlledBookmarked,
  onToggleBookmark: controlledToggleBookmark,
}: ProblemHeaderProps) {
  const { locale } = useLocale();
  const numericId = typeof id === "number" ? id : parseInt(String(id), 10);

  // Local bookmark state if not controlled externally
  const [localBookmarked, setLocalBookmarked] = useState(false);

  useEffect(() => {
    if (controlledBookmarked !== undefined || Number.isNaN(numericId)) return;
    const check = () => setLocalBookmarked(isPscpBookmarked(numericId));
    check();
    window.addEventListener(PSCP_BOOKMARKS_EVENT, check);
    return () => window.removeEventListener(PSCP_BOOKMARKS_EVENT, check);
  }, [numericId, controlledBookmarked]);

  const bookmarked = controlledBookmarked !== undefined ? controlledBookmarked : localBookmarked;

  const handleToggleBookmark = useCallback(() => {
    if (controlledToggleBookmark) {
      controlledToggleBookmark();
    } else if (!Number.isNaN(numericId)) {
      togglePscpBookmark(numericId);
    }
  }, [controlledToggleBookmark, numericId]);

  const [isPastDue] = useState(() => Boolean(expireIso && new Date(expireIso).getTime() < Date.now()));

  // Format memory limit nicely
  const memoryFormatted = limits?.memoryKb
    ? limits.memoryKb >= 1024
      ? `${Math.round(limits.memoryKb / 1024)}MB`
      : `${limits.memoryKb}KB`
    : "32MB";

  const timeoutFormatted = limits?.timeoutSec != null ? `${limits.timeoutSec.toFixed(1)}s` : "1.0s";

  // Build the breadcrumb week / exam segment
  const weekLabel = week != null ? `Week ${week}` : null;
  const examLabel = examType ?? null;
  const middleSegment =
    weekLabel && examLabel
      ? `${weekLabel} (${examLabel})`
      : weekLabel
        ? weekLabel
        : examLabel;

  return (
    <header className={cn("shrink-0 border-b bg-card/95 px-4 py-3.5 backdrop-blur sm:px-6", className)}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          {/* Subtle single-line breadcrumb path */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground"
          >
            <Link
              href="/pscp"
              className="transition-colors hover:text-foreground hover:underline"
            >
              PSCP
            </Link>
            {middleSegment && (
              <>
                <span className="text-muted-foreground/40 font-normal select-none">/</span>
                <span>{middleSegment}</span>
              </>
            )}
            <span className="text-muted-foreground/40 font-normal select-none">/</span>
            <span className="font-mono text-muted-foreground/90">#{id}</span>
          </nav>

          {/* Title & Inline Star Bookmark */}
          <div className="mt-1 flex items-center gap-2">
            <h1 className="truncate text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              {title}
            </h1>
            <button
              type="button"
              onClick={handleToggleBookmark}
              className="inline-flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-md text-muted-foreground/60 transition-colors hover:bg-muted/60 hover:text-amber-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              title={
                bookmarked
                  ? t(L.bookmarked, locale)
                  : difficulty
                    ? `${t(L.bookmark, locale)} · ${t(L.difficulty, locale)} ${difficulty}/5`
                    : t(L.bookmark, locale)
              }
              aria-label={bookmarked ? t(L.bookmarked, locale) : t(L.bookmark, locale)}
              aria-pressed={bookmarked}
            >
              <Star
                className={cn(
                  "size-4 sm:size-4.5 transition-transform active:scale-90",
                  bookmarked
                    ? "fill-amber-400 text-amber-400"
                    : "fill-transparent text-muted-foreground/50 hover:text-amber-400",
                )}
              />
            </button>
          </div>

          {/* Monochromatic, subtle topic chips */}
          {tags.length > 0 && (
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md border border-border/40 bg-muted/60 px-2 py-0.5 text-xs font-normal text-muted-foreground"
                >
                  {t(tagLabel(tag), locale)}
                </span>
              ))}
            </div>
          )}

          {/* Clean Metric Metadata Bar */}
          <div className="mt-2.5 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-muted-foreground">
            {stats.percentage !== null && (
              <span className="tabular-nums">
                <span className="font-semibold text-foreground">{stats.percentage}%</span>{" "}
                {t(L.pass, locale)} ({stats.passed}/{stats.attempt})
              </span>
            )}

            {stats.percentage !== null && (
              <span className="text-muted-foreground/40 select-none">·</span>
            )}

            <span className="tabular-nums font-mono text-[11px] sm:text-xs">
              {t(L.limit, locale)}: {timeoutFormatted} / {memoryFormatted}
            </span>

            {expireLabel && (
              <>
                <span className="text-muted-foreground/40 select-none">·</span>
                <span
                  className={cn(
                    "tabular-nums",
                    isPastDue ? "font-medium text-destructive" : "text-muted-foreground",
                  )}
                >
                  {t(L.due, locale)}: {shortDate(expireLabel)}
                  {isPastDue && ` (${t(L.expired, locale)})`}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Top Right Utilities: iJudge link & Close */}
        <div className="flex shrink-0 items-center gap-1.5">
          {url && (
            <Button
              asChild
              size="sm"
              variant="outline"
              className="h-8 gap-1.5 rounded-full px-3 text-xs"
            >
              <a href={url} target="_blank" rel="noreferrer">
                <ExternalLink className="size-3.5" />
                <span className="hidden sm:inline">{t(L.onIJudge, locale)}</span>
              </a>
            </Button>
          )}

          {onClose && (
            <Button
              type="button"
              onClick={onClose}
              size="sm"
              variant="ghost"
              className="size-8 cursor-pointer rounded-full p-0 text-muted-foreground hover:text-foreground"
              title={t(L.close, locale)}
              aria-label={t(L.close, locale)}
            >
              <X className="size-4" />
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
