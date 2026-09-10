"use client";

import Link from "next/link";
import {
  BookOpen,
  ChevronDown,
  ExternalLink,
  FileText,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import { GithubIcon } from "@/components/social-icons";
import type { PscpHubData } from "@/lib/pscp";
import type { GithubUser, LinkedRepo } from "@/lib/github";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Shortcuts } from "@/components/shortcuts";
import { COURSE } from "@/lib/course";
import { t, type LText, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const L: Record<string, LText> = {
  crumbCourses: { th: "Courses", en: "Courses" },
  crumbCourse: { th: "PSCP (06066303)", en: "PSCP (06066303)" },
  heading: { th: "Problems", en: "Problems" },
  courseInfo: { th: "ข้อมูลรายวิชา", en: "Course info" },
  coursePage: { th: "หน้ารายวิชา", en: "Course page" },
  recommendedPill: { th: "โจทย์แนะนำ", en: "Recommended" },
  guidelinesPill: { th: "AI Guidelines", en: "AI Guidelines" },
  makeMenu: { th: "สร้างเอกสาร", en: "Generate" },
  makeSub: { th: "สร้าง submission.md", en: "Make submission.md" },
  makeRefl: { th: "สร้าง ai_reflection.md", en: "Make ai_reflection.md" },
  total: { th: "ทั้งหมด", en: "total" },
  gradable: { th: "รันได้", en: "gradable" },
  recommendedStat: { th: "แนะนำ", en: "recommended" },
  progressSolved: { th: "ตรวจผ่าน", en: "Graded" },
  progressSub: { th: "submission.md", en: "submission.md" },
  progressRefl: { th: "ai_reflection.md", en: "ai_reflection.md" },
  connect: { th: "เชื่อมต่อ GitHub", en: "Connect GitHub" },
  synced: { th: "ซิงก์แล้ว", en: "synced" },
  change: { th: "เปลี่ยน", en: "change" },
};

/** `value/total` over a hairline meter — three of these carry all the progress. */
function Meter({
  label,
  value,
  total,
  accent = "bg-primary",
}: {
  label: string;
  value: number;
  total: number;
  accent?: string;
}) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="min-w-0 flex-1 basis-full space-y-1 sm:basis-28">
      <div className="flex items-baseline justify-between gap-3 text-xs text-muted-foreground">
        <span className="truncate">{label}</span>
        <span className="shrink-0 font-mono font-medium tabular-nums text-foreground">
          {value}/{total}
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={cn("h-full rounded-full transition-[width] duration-500 ease-out", accent)}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

/** Neutral count pill for the dataset-scope tags (total / gradable / recommended). */
function ScopeTag({ value, label }: { value: number; label: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border bg-muted/40 px-2.5 py-1 text-xs text-muted-foreground">
      <span className="font-mono font-semibold tabular-nums text-foreground">{value}</span>
      {label}
    </span>
  );
}

/**
 * Everything above the list, in two compact rows: a title + pill-button
 * toolbar, then one unified strip carrying scope tags, progress meters and
 * the GitHub sync state. Replaces the old four-card module grid plus a
 * separate stats card plus a full-width GitHub banner.
 */
export function ProblemsHeader({
  data,
  solvedCount,
  subCount,
  reflCount,
  learningLogTotal,
  gh,
  locale,
}: {
  data: PscpHubData;
  solvedCount: number;
  subCount: number;
  reflCount: number;
  learningLogTotal: number;
  gh: {
    connected: boolean;
    user: GithubUser | null;
    repo: LinkedRepo | null;
    hydrated: boolean;
    refresh: () => void;
  };
  locale: Locale;
}) {
  return (
    <header className="mb-6 space-y-4">
      {/* Row 1: breadcrumb + title, quick-action pills */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs text-muted-foreground">
            {t(L.crumbCourses, locale)} <span className="text-muted-foreground/40">/</span>{" "}
            {t(L.crumbCourse, locale)}
          </p>
          <h1 className="mt-1 text-xl font-semibold tracking-tight sm:text-2xl">
            {t(L.heading, locale)}
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/recommended"
            className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary transition-colors hover:bg-primary/15"
          >
            <Sparkles className="size-3.5" />
            {t(L.recommendedPill, locale)}
            <span className="rounded-full bg-primary/15 px-1.5 py-0.5 font-mono text-[10px] tabular-nums">
              {data.recommendedCount}
            </span>
          </Link>

          <Link
            href="/library"
            className="inline-flex items-center gap-1.5 rounded-full border bg-card px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <BookOpen className="size-3.5" />
            {t(L.guidelinesPill, locale)}
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border bg-card px-3 py-1 text-xs font-medium text-foreground shadow-xs transition-colors hover:bg-muted">
              <FileText className="size-3.5" />
              {t(L.makeMenu, locale)}
              <ChevronDown className="size-3 text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuItem asChild>
                <Link href="/make/submission">{t(L.makeSub, locale)}</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/make/reflection">{t(L.makeRefl, locale)}</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Collapsed course-info disclosure: real, but reference material. It
          sits one click away rather than between the reader and the problems. */}
      <details className="group rounded-xl border bg-card">
        <summary className="flex cursor-pointer list-none items-center gap-2 px-3 py-2.5 text-xs font-medium sm:px-4">
          <GraduationCap className="size-3.5 shrink-0 text-muted-foreground" />
          <span className="shrink-0 font-mono text-muted-foreground">{COURSE.code}</span>
          <span className="min-w-0 flex-1 truncate">{t(COURSE.name, locale)}</span>
          <ChevronDown className="size-3.5 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
        </summary>
        <div className="border-t px-3 py-3 sm:px-4">
          <p className="text-xs leading-relaxed text-muted-foreground">
            {t(COURSE.description, locale)}
          </p>
          <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
            <span>{t(COURSE.credits, locale)}</span>
            <span className="text-border">·</span>
            <span>{t(COURSE.degree, locale)}</span>
            {COURSE.instructors.map((ins) => (
              <span key={ins.url} className="inline-flex items-center gap-2">
                <span className="text-border">·</span>
                <a
                  href={ins.url}
                  target="_blank"
                  rel="noreferrer"
                  className="underline decoration-border underline-offset-4 transition-colors hover:text-primary"
                >
                  {t(ins.name, locale)}
                </a>
              </span>
            ))}
            <a
              href={COURSE.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 transition-colors hover:text-primary"
            >
              {t(L.coursePage, locale)}
              <ExternalLink className="size-3" />
            </a>
          </p>
          <Shortcuts />
        </div>
      </details>

      {/* Row 2: unified strip — scope tags, progress meters, GitHub status. */}
      <div className="flex flex-col gap-4 rounded-2xl border bg-card/60 p-3 sm:flex-row sm:flex-wrap sm:items-center sm:p-3.5">
        <div className="flex flex-wrap items-center gap-1.5">
          <ScopeTag value={data.total} label={t(L.total, locale)} />
          <ScopeTag value={data.gradableCount} label={t(L.gradable, locale)} />
          <ScopeTag value={data.recommendedCount} label={t(L.recommendedStat, locale)} />
        </div>

        <div className="h-8 w-px bg-border max-sm:hidden" />

        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-6 gap-y-3 max-sm:w-full">
          <Meter
            label={t(L.progressSolved, locale)}
            value={solvedCount}
            total={data.gradableCount}
            accent="bg-emerald-500"
          />
          <Meter
            label={t(L.progressSub, locale)}
            value={subCount}
            total={learningLogTotal}
            accent="bg-primary"
          />
          <Meter label={t(L.progressRefl, locale)} value={reflCount} total={data.total} />
        </div>

        {/* Connected is the steady state, so it collapses to one line; the
            connect action is a single button when there is a decision to make. */}
        {gh.hydrated && gh.connected && gh.repo ? (
          <span className="inline-flex min-w-0 max-w-full shrink-0 flex-wrap items-center gap-x-1.5 gap-y-0.5 text-xs text-muted-foreground max-sm:w-full">
            <GithubIcon className="size-3.5 shrink-0" />
            <span className="min-w-0 truncate font-mono">
              {gh.repo.owner}/{gh.repo.repo}
            </span>
            <span className="shrink-0 text-emerald-600 dark:text-emerald-400">
              · {t(L.synced, locale)} ✓
            </span>
            <button
              type="button"
              onClick={gh.refresh}
              className="shrink-0 cursor-pointer underline underline-offset-4 hover:text-foreground"
            >
              {t(L.change, locale)}
            </button>
          </span>
        ) : (
          gh.hydrated &&
          !gh.connected && (
            // eslint-disable-next-line @next/next/no-html-link-for-pages -- OAuth redirect API endpoint requires full navigation
            <a
              href="/api/github/login"
              className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg border bg-background px-3 py-1.5 text-xs font-medium shadow-xs transition-colors hover:bg-muted max-sm:w-full"
            >
              <GithubIcon className="size-3.5" />
              {t(L.connect, locale)}
            </a>
          )
        )}
      </div>
    </header>
  );
}
