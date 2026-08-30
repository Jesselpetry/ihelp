"use client";

import Link from "next/link";
import { Fragment, useEffect, useMemo, useState } from "react";
import {
  ChartColumn,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  Code2,
  ExternalLink,
  FileText,
  Folder,
  FolderOpen,
  GraduationCap,
  Info,
  LayoutGrid,
  PanelsTopLeft,
  Lightbulb,
  List,
  PlayCircle,
  Sparkles,
  Star,
  TriangleAlert,
} from "lucide-react";
import type { PscpHubData, PscpProblem } from "@/lib/pscp";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { WeekBadge } from "@/components/week-badge";
import { Shortcuts } from "@/components/shortcuts";
import { COURSE } from "@/lib/course";
import { GithubConnect } from "@/components/github/github-connect";
import { useGithub } from "@/lib/github";
import { ConceptTags, PscpWorkspace } from "@/components/pscp-workspace";
import { tagLabel } from "@/lib/pscp-tags";
import {
  loadPscpProgress,
  setPscpSolved,
  PSCP_PROGRESS_EVENT,
  type PscpProgress,
} from "@/lib/pscp-client";
import { useLocale, t, type LText } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const L: Record<string, LText> = {
  crumbCourses: { th: "Courses", en: "Courses" },
  crumbCourse: {
    th: "[2026] Problem Solving and Computer Programming (IT)",
    en: "[2026] Problem Solving and Computer Programming (IT)",
  },
  heading: { th: "Problems", en: "Problems" },
  intro: {
    th: "เปิดโจทย์เพื่อทำงานในพื้นที่ทำงานแบบโต้ตอบ — รันโค้ด Python ในเบราว์เซอร์ ตรวจกับเคสจริงของ iJudge แล้วสร้าง submission.md / ai_reflection.md ต่อได้ทันที",
    en: "Open a problem into an interactive workspace — run Python in the browser, grade against the real iJudge cases, then build submission.md / ai_reflection.md from the same place.",
  },
  total: { th: "โจทย์ทั้งหมด", en: "Total problems" },
  logs: { th: "Learning logs", en: "Learning logs" },
  recommendedStat: { th: "โจทย์แนะนำ", en: "Recommended" },
  gradable: { th: "ตรวจอัตโนมัติได้", en: "Auto-gradable" },
  listTitle: { th: "รายการโจทย์ (Problems List)", en: "Problems List" },
  search: { th: "ค้นหาชื่อ, ID หรือแนวคิด...", en: "Search name, ID, or concept..." },
  problem: { th: "ชื่อโจทย์", en: "Problem" },
  concepts: { th: "แนวคิด", en: "Concepts" },
  difficulty: { th: "ความยาก", en: "Difficulty" },
  actions: { th: "การดำเนินการ", en: "Actions" },
  expires: { th: "หมดเขต", en: "Expires" },
  expired: { th: "หมดเขตแล้ว", en: "Expired" },
  expiredSection: { th: "โจทย์ที่หมดเขตส่งแล้ว (Expired Problems)", en: "Past / Expired Problems" },
  learningLog: { th: "Learning Log", en: "Learning Log" },
  recommended: { th: "แนะนำ", en: "Recommended" },
  submissionBtn: { th: "สร้าง submission.md", en: "Make submission.md" },
  reflectionBtn: { th: "สร้าง ai_reflection.md", en: "Make ai_reflection.md" },
  openProblem: { th: "เปิดโจทย์บน iJudge", en: "Open on iJudge" },
  openWorkspace: { th: "เปิดพื้นที่ทำงาน", en: "Open Workspace" },
  quickPeek: { th: "ดูแบบเร็ว (ป๊อปอัป)", en: "Quick view (popup)" },
  practise: { th: "ฝึกทำ", en: "Practise" },
  llOnly: {
    th: "submission.md ต้องทำเฉพาะโจทย์ที่มีป้าย Learning Log ส่วน ai_reflection.md สร้างได้กับทุกโจทย์ที่ใช้ AI",
    en: "submission.md is required only for problems tagged Learning Log. ai_reflection.md can be made for any problem where AI was used.",
  },
  empty: { th: "ไม่พบโจทย์ที่ตรงกับตัวกรอง", en: "No problems match the filter." },
  resetFilter: { th: "ล้างตัวกรอง", en: "Reset filters" },
  all: { th: "All", en: "All" },
  stats: { th: "สถิติ", en: "Stats" },
  coursePage: { th: "หน้ารายวิชา", en: "Course page" },
  syncedSub: { th: "submission", en: "submission" },
  syncedRefl: { th: "reflection", en: "reflection" },
  editOnRepo: { th: "เปิดแก้ไฟล์นี้ใน repo", en: "Open this file in the repo editor" },
  quickTools: { th: "เครื่องมือด่วน", en: "Quick Tools" },
  solvedHere: { th: "ผ่านครบทุกเคสในเว็บนี้", en: "Passed all cases here" },
  progressSolved: { th: "ตรวจผ่านแล้ว", en: "Graded clean" },
  progressSub: { th: "submission.md ใน repo", en: "submission.md in repo" },
  progressRefl: { th: "ai_reflection.md ใน repo", en: "ai_reflection.md in repo" },
  connectRepoHint: {
    th: "เชื่อม GitHub เพื่อดูความคืบหน้าไฟล์ที่ส่งแล้ว",
    en: "Connect GitHub to track which files you have pushed.",
  },
  viewGrid: { th: "การ์ด", en: "Cards" },
  viewTable: { th: "ตารางสรุป", en: "Matrix" },
  filterAll: { th: "ทั้งหมด", en: "All" },
  filterLL: { th: "Learning Log", en: "Learning Log" },
  filterGradable: { th: "ตรวจได้", en: "Gradable" },
  filterSolved: { th: "ผ่านแล้ว", en: "Solved" },
  filterUnsolved: { th: "ยังไม่ผ่าน", en: "Unsolved" },
  noCases: { th: "ไม่มีเคสตัวอย่าง", en: "No sample cases" },
  casesCount: { th: "เคส", en: "cases" },
  clearConcept: { th: "ล้างแนวคิด", en: "Clear concept" },
  markSolved: { th: "ทำเครื่องหมายว่าผ่านแล้ว", en: "Mark as solved" },
  markUnsolved: { th: "ยกเลิกเครื่องหมายผ่าน", en: "Unmark solved" },
  inProgress: { th: "กำลังฝึก", en: "In Progress" },
};

type Filter = "all" | "ll" | "gradable" | "solved" | "unsolved";

/** A problem is past due once its parsed deadline is behind `now`. */
function isExpired(p: PscpProblem, now: Date): boolean {
  if (!p.expireIso) return false;
  const due = new Date(p.expireIso);
  return !Number.isNaN(due.getTime()) && due < now;
}

function DifficultyStars({ value }: { value: number }) {
  if (value <= 0) {
    return <span className="text-sm text-muted-foreground/50">—</span>;
  }
  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap" title={`difficulty ${value}`}>
      <span className="inline-flex items-center gap-0.5">
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            className={i < value ? "size-4 fill-amber-400 text-amber-400" : "size-4 text-border"}
          />
        ))}
      </span>
      <span className="text-xs font-medium tabular-nums text-muted-foreground">{value}/5</span>
    </span>
  );
}

/** Thin labelled meter used by the quick-tools bar. */
function ProgressMeter({
  label,
  value,
  total,
  icon: Icon,
}: {
  label: string;
  value: number;
  total: number;
  icon: typeof Check;
}) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="min-w-0 flex-1">
      <div className="flex items-center justify-between gap-2">
        <span className="inline-flex min-w-0 items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
          <Icon className="size-3 shrink-0 text-primary" />
          <span className="truncate">{label}</span>
        </span>
        <span className="shrink-0 font-mono text-[11px] font-semibold text-foreground tabular-nums">
          {value}/{total}
        </span>
      </div>
      <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export function ProblemsView({ data }: { data: PscpHubData }) {
  const { locale } = useLocale();
  const gh = useGithub();
  const [query, setQuery] = useState("");
  const [weekFilter, setWeekFilter] = useState<number | "all">("all");
  const [filter, setFilter] = useState<Filter>("all");
  const [concept, setConcept] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
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
        // Expired sinks to the bottom, then Learning Log, then Recommended,
        // then newest week first, then id — unchanged from the previous view.
        const expA = isExpired(a, now);
        const expB = isExpired(b, now);
        if (expA !== expB) return expA ? 1 : -1;
        if (a.learningLog !== b.learningLog) return a.learningLog ? -1 : 1;
        if (a.recommended !== b.recommended) return a.recommended ? -1 : 1;
        const weekA = a.week ?? 0;
        const weekB = b.week ?? 0;
        if (weekA !== weekB) return weekB - weekA;
        return a.id - b.id;
      });
  }, [problems, query, weekFilter, filter, concept, progress, locale]);

  const openProblem = openId !== null ? problems.find((p) => p.id === openId) ?? null : null;

  // Quick-tools progress counters.
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
      <div className="mb-6">
        <p className="mb-1 text-sm text-muted-foreground">
          {t(L.crumbCourses, locale)} / {t(L.crumbCourse, locale)}
        </p>
        <h1 className="text-4xl font-bold">{t(L.heading, locale)}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{t(L.intro, locale)}</p>

        {/* official course facts */}
        <div className="mt-4 rounded-xl border bg-card/60 px-4 py-3.5">
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
            <Badge className="bg-primary/10 font-mono font-semibold text-primary">
              {COURSE.code}
            </Badge>
            <span className="text-sm font-semibold">{t(COURSE.name, locale)}</span>
            <span className="text-xs text-muted-foreground">
              {t(COURSE.credits, locale)} · {t(COURSE.degree, locale)}
            </span>
            <a
              href={COURSE.url}
              target="_blank"
              rel="noreferrer"
              className="ml-auto inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {t(L.coursePage, locale)}
              <ExternalLink className="size-3" />
            </a>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            {t(COURSE.description, locale)}
          </p>
          <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
            <GraduationCap className="size-3.5 text-primary/70" />
            {COURSE.instructors.map((ins, i) => (
              <span key={ins.url} className="inline-flex items-center gap-x-2">
                {i > 0 && <span className="text-border">·</span>}
                <a
                  href={ins.url}
                  target="_blank"
                  rel="noreferrer"
                  className="underline decoration-border underline-offset-4 transition-colors hover:text-primary hover:decoration-current"
                >
                  {t(ins.name, locale)}
                </a>
              </span>
            ))}
          </p>
        </div>
      </div>

      {/* Optional GitHub sync: connect a repo to push generated files */}
      <div className="mb-6">
        <GithubConnect
          connected={gh.connected}
          user={gh.user}
          repo={gh.repo}
          hydrated={gh.hydrated}
          onChanged={gh.refresh}
        />
      </div>

      {/* Unified quick-tools bar: wizard entry points + live progress meters */}
      <section className="mb-6 rounded-2xl border bg-card p-5 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-primary">
            <Sparkles className="size-3.5" />
            {t(L.quickTools, locale)}
          </h2>
          <div className="ml-auto flex flex-wrap items-center gap-2">
            <Button asChild size="sm" className="h-8 gap-1.5 rounded-full text-xs font-medium">
              <Link href="/make/submission">
                <FileText className="size-3.5" />
                {t(L.submissionBtn, locale)}
              </Link>
            </Button>
            <Button
              asChild
              size="sm"
              variant="outline"
              className="h-8 gap-1.5 rounded-full text-xs font-medium"
            >
              <Link href="/make/reflection">
                <Lightbulb className="size-3.5" />
                {t(L.reflectionBtn, locale)}
              </Link>
            </Button>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
          <ProgressMeter
            label={t(L.progressSolved, locale)}
            value={solvedCount}
            total={data.gradableCount}
            icon={CheckCircle2}
          />
          <ProgressMeter
            label={t(L.progressSub, locale)}
            value={subCount}
            total={learningLogs.length}
            icon={FileText}
          />
          <ProgressMeter
            label={t(L.progressRefl, locale)}
            value={reflCount}
            total={problems.length}
            icon={Lightbulb}
          />
        </div>
        {!gh.connected && (
          <p className="mt-3 text-[11px] text-muted-foreground">{t(L.connectRepoHint, locale)}</p>
        )}
      </section>

      {/* Stats + weekly shortcuts share one card, split into two columns */}
      <div className="mb-6 grid grid-cols-1 divide-y rounded-2xl border bg-card shadow-sm lg:grid-cols-2 lg:divide-x lg:divide-y-0">
        <div className="flex flex-col p-5">
          <h2 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-primary">
            <ChartColumn className="size-3.5" />
            {t(L.stats, locale)}
          </h2>
          <div className="grid flex-1 grid-cols-2 gap-3 sm:grid-cols-4">
            {([
              { label: t(L.total, locale), value: data.total },
              { label: t(L.logs, locale), value: data.learningLogCount },
              {
                label: t(L.gradable, locale),
                value: data.gradableCount,
                sub: `${data.caseCount} ${t(L.casesCount, locale)} · ${data.edgeCaseCount} edge`,
              },
              {
                label: t(L.recommendedStat, locale),
                value: data.recommendedCount,
                href: "/recommended",
              },
            ] as { label: string; value: number; href?: string; sub?: string }[]).map((s) =>
              s.href ? (
                <Link
                  key={s.label}
                  href={s.href}
                  className="group flex flex-col justify-center rounded-xl border bg-background/50 px-4 py-3 transition-all hover:border-primary/40 hover:bg-primary/[0.04]"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground transition-colors group-hover:text-primary">
                      {s.label}
                    </p>
                    <Sparkles className="size-3 text-primary opacity-70 transition-opacity group-hover:opacity-100" />
                  </div>
                  <p className="mt-1 text-2xl font-bold text-primary">{s.value}</p>
                </Link>
              ) : (
                <div
                  key={s.label}
                  className="flex flex-col justify-center rounded-xl border bg-background/50 px-4 py-3"
                >
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {s.label}
                  </p>
                  <p className="mt-1 text-2xl font-bold">{s.value}</p>
                  {s.sub && (
                    <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">{s.sub}</p>
                  )}
                </div>
              ),
            )}
          </div>
        </div>
        <Shortcuts />
      </div>

      {/* folder-style week tabs: the active tab merges into the card below */}
      {data.weeks.length > 0 && (
        <div className="flex items-end gap-1 overflow-x-auto pl-4">
          {([["all", t(L.all, locale)] as const, ...data.weeks.map((w) => [w, `Week ${w}`] as const)]).map(
            ([w, label]) => {
              const active = weekFilter === w;
              return (
                <button
                  key={String(w)}
                  type="button"
                  onClick={() => setWeekFilter(w)}
                  className={
                    "inline-flex items-center gap-1.5 whitespace-nowrap rounded-t-xl px-4 py-2 text-xs font-medium transition-colors " +
                    (active
                      ? "relative z-10 -mb-px border border-b-0 bg-card font-semibold text-primary"
                      : "border border-transparent text-muted-foreground hover:bg-muted/60 hover:text-foreground")
                  }
                >
                  {active ? <FolderOpen className="size-3.5" /> : <Folder className="size-3.5" />}
                  {label}
                </button>
              );
            },
          )}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
        <div className="flex flex-wrap items-center gap-3 border-b px-6 py-5">
          <h3 className="mr-auto text-xl font-semibold">{t(L.listTitle, locale)}</h3>

          {/* view switch */}
          <div className="inline-flex rounded-full border p-0.5">
            {(
              [
                ["grid", LayoutGrid, t(L.viewGrid, locale)],
                ["table", List, t(L.viewTable, locale)],
              ] as const
            ).map(([mode, Icon, label]) => (
              <button
                key={mode}
                type="button"
                onClick={() => setViewMode(mode)}
                className={cn(
                  "inline-flex cursor-pointer items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition-colors",
                  viewMode === mode
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className="size-3.5" />
                {label}
              </button>
            ))}
          </div>

          <Input
            placeholder={t(L.search, locale)}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full sm:w-60"
          />
        </div>

        {/* status filters + concept chips */}
        <div className="space-y-2.5 border-b px-6 py-3.5">
          <div className="flex flex-wrap items-center gap-1.5">
            {(
              [
                ["all", t(L.filterAll, locale)],
                ["ll", t(L.filterLL, locale)],
                ["gradable", t(L.filterGradable, locale)],
                ["solved", t(L.filterSolved, locale)],
                ["unsolved", t(L.filterUnsolved, locale)],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setFilter(key)}
                className={cn(
                  "cursor-pointer rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                  filter === key
                    ? "border-primary bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {conceptOptions.map(([tag, count]) => (
              <button
                key={tag}
                type="button"
                onClick={() => setConcept((c) => (c === tag ? null : tag))}
                className={cn(
                  "cursor-pointer rounded-full border px-2.5 py-0.5 text-[11px] font-medium transition-colors",
                  concept === tag
                    ? "border-primary bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                {t(tagLabel(tag), locale)}
                <span className="ml-1 font-mono opacity-60">{count}</span>
              </button>
            ))}
            {concept && (
              <button
                type="button"
                onClick={() => setConcept(null)}
                className="cursor-pointer text-[11px] font-medium text-primary underline underline-offset-4"
              >
                {t(L.clearConcept, locale)}
              </button>
            )}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="p-12 text-center">
            <Info className="mx-auto size-8 text-muted-foreground/60" />
            <p className="mt-3 text-sm text-muted-foreground">{t(L.empty, locale)}</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4 rounded-full"
              onClick={() => {
                setQuery("");
                setFilter("all");
                setConcept(null);
                setWeekFilter("all");
              }}
            >
              {t(L.resetFilter, locale)}
            </Button>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid gap-4 p-5 sm:grid-cols-2">
            {filtered.map((p) => (
              <ProblemCard
                key={p.id}
                problem={p}
                solved={Boolean(progress[p.id]?.solved)}
                attempt={progress[p.id]}
                hasSub={Boolean(gh.connected && gh.repo && gh.status[p.id]?.submission)}
                hasRefl={Boolean(gh.connected && gh.repo && gh.status[p.id]?.reflection)}
                onOpen={() => setOpenId(p.id)}
                onToggleSolved={() => setPscpSolved(p.id, !progress[p.id]?.solved)}
                locale={locale}
              />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-background hover:bg-background">
                  <TableHead>{t(L.problem, locale)}</TableHead>
                  <TableHead className="hidden md:table-cell">{t(L.concepts, locale)}</TableHead>
                  <TableHead>{t(L.difficulty, locale)}</TableHead>
                  <TableHead>{t(L.actions, locale)}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((p, idx) => {
                  const now = new Date();
                  const expired = isExpired(p, now);
                  const prevExpired = idx > 0 && isExpired(filtered[idx - 1], now);
                  const showExpiredDivider = expired && !prevExpired && idx > 0;

                  return (
                    <Fragment key={p.id}>
                      {showExpiredDivider && (
                        <TableRow className="border-y bg-muted/40 hover:bg-muted/40">
                          <TableCell
                            colSpan={4}
                            className="px-6 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                          >
                            <span className="inline-flex items-center gap-2">
                              <TriangleAlert className="size-3.5 text-destructive" />
                              {t(L.expiredSection, locale)}
                            </span>
                          </TableCell>
                        </TableRow>
                      )}
                      <TableRow
                        className={cn(
                          "group border-l-2 transition-colors",
                          expired
                            ? "border-l-transparent bg-muted/10 opacity-80 hover:border-l-destructive/50 hover:bg-muted/20 hover:opacity-100"
                            : "border-l-transparent hover:border-l-primary hover:bg-primary/[0.03] data-[ll=true]:border-l-primary/40",
                        )}
                        data-ll={p.learningLog || undefined}
                      >
                        <TableCell className="py-4">
                          <div className="flex flex-wrap items-center gap-2">
                            <Link
                              href={`/pscp/${p.slug}`}
                              className="text-base font-semibold text-primary underline-offset-4 hover:underline"
                            >
                              {p.cleanName || p.name}
                            </Link>
                            {p.learningLog && (
                              <Badge className="bg-primary/10 font-semibold text-primary">
                                {t(L.learningLog, locale)}
                              </Badge>
                            )}
                            {p.recommended && (
                              <Badge className="gap-1 border-amber-500/30 bg-amber-500/10 font-semibold text-amber-600 shadow-xs dark:text-amber-400">
                                <Sparkles className="size-3 fill-amber-500/20 text-amber-500" />
                                {t(L.recommended, locale)}
                              </Badge>
                            )}
                            {progress[p.id]?.solved && (
                              <Badge className="gap-1 bg-emerald-500/10 font-medium text-emerald-600 dark:text-emerald-400">
                                <CheckCircle2 className="size-3" />
                                {t(L.filterSolved, locale)}
                              </Badge>
                            )}
                          </div>
                          <div className="mt-2 flex flex-wrap items-center gap-1.5">
                            <Badge variant="outline" className="font-mono text-muted-foreground">
                              #{p.id}
                            </Badge>
                            {p.week !== null && <WeekBadge week={p.week} />}
                            <Badge
                              variant="outline"
                              className={
                                expired
                                  ? "border-destructive/30 bg-destructive/10 font-medium text-destructive"
                                  : "text-muted-foreground"
                              }
                            >
                              {expired ? (
                                <TriangleAlert className="size-3" />
                              ) : (
                                <Clock className="size-3" />
                              )}
                              {t(expired ? L.expired : L.expires, locale)}{" "}
                              {p.expireLabel}
                            </Badge>
                            {gh.connected && gh.repo && gh.status[p.id]?.submission && (
                              <Link
                                href={`/repo?path=oj${p.id}/submission.md`}
                                title={t(L.editOnRepo, locale)}
                              >
                                <Badge className="cursor-pointer bg-green-500/10 font-medium text-green-600 transition-colors hover:bg-green-500/20 dark:text-green-400">
                                  <Check className="size-3" />
                                  {t(L.syncedSub, locale)}
                                </Badge>
                              </Link>
                            )}
                            {gh.connected && gh.repo && gh.status[p.id]?.reflection && (
                              <Link
                                href={`/repo?path=oj${p.id}/ai_reflection.md`}
                                title={t(L.editOnRepo, locale)}
                              >
                                <Badge className="cursor-pointer bg-green-500/10 font-medium text-green-600 transition-colors hover:bg-green-500/20 dark:text-green-400">
                                  <Check className="size-3" />
                                  {t(L.syncedRefl, locale)}
                                </Badge>
                              </Link>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="hidden max-w-[220px] py-4 md:table-cell">
                          <ConceptTags tags={p.tags} limit={3} />
                        </TableCell>
                        <TableCell className="py-4">
                          <DifficultyStars value={p.difficulty} />
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex flex-wrap gap-2">
                            <Button
                              asChild
                              size="sm"
                              className="h-8 gap-1 rounded-full text-xs font-medium"
                            >
                              <Link href={`/pscp/${p.slug}`}>
                                <PlayCircle className="size-3.5" />
                                {t(L.practise, locale)}
                              </Link>
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              onClick={() => setOpenId(p.id)}
                              className="size-8 cursor-pointer rounded-full p-0"
                              title={t(L.quickPeek, locale)}
                            >
                              <PanelsTopLeft className="size-3.5 text-muted-foreground" />
                            </Button>
                            {p.learningLog && (
                              <Button
                                asChild
                                size="sm"
                                variant="outline"
                                className="h-8 rounded-full text-xs font-medium"
                              >
                                <Link href={`/make/submission?problem=${p.id}`}>submission</Link>
                              </Button>
                            )}
                            <Button
                              asChild
                              size="sm"
                              variant="ghost"
                              className="h-8 rounded-full text-xs font-medium text-muted-foreground hover:text-foreground"
                            >
                              <Link href={`/make/reflection?problem=${p.id}`}>reflection</Link>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    </Fragment>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}

        <p className="border-t px-6 py-3 text-xs text-muted-foreground">{t(L.llOnly, locale)}</p>
      </div>

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

function ProblemCard({
  problem,
  solved,
  attempt,
  hasSub,
  hasRefl,
  onOpen,
  onToggleSolved,
  locale,
}: {
  problem: PscpProblem;
  solved: boolean;
  attempt: PscpProgress[number] | undefined;
  hasSub: boolean;
  hasRefl: boolean;
  onOpen: () => void;
  onToggleSolved: () => void;
  locale: "th" | "en";
}) {
  const expired = isExpired(problem, new Date());
  const takeaway = problem.takeaway?.points?.[0];

  return (
    <article
      className={cn(
        "group relative flex flex-col justify-between rounded-2xl border bg-card p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md",
        expired && "opacity-75 hover:opacity-100",
      )}
    >
      <div>
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="font-mono text-sm font-bold text-primary">OJ {problem.id}</span>
            {problem.week !== null && <WeekBadge week={problem.week} />}
            {problem.learningLog && (
              <Badge className="rounded-full bg-primary px-2 py-0 text-[10px] font-medium text-primary-foreground shadow-none">
                {t(L.learningLog, locale)}
              </Badge>
            )}
            {problem.recommended && (
              <Badge className="gap-1 rounded-full border-amber-500/30 bg-amber-500/10 px-2 py-0 text-[10px] font-semibold text-amber-600 shadow-none dark:text-amber-400">
                <Sparkles className="size-2.5" />
                {t(L.recommended, locale)}
              </Badge>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-0.5">
            {problem.difficulty > 0 ? (
              Array.from({ length: problem.difficulty }).map((_, i) => (
                <Star key={i} className="size-3.5 fill-amber-400 text-amber-400" />
              ))
            ) : (
              <Star className="size-3.5 text-muted-foreground/30" />
            )}
          </div>
        </div>

        <h2 className="mt-3 text-lg font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary">
          <Link href={`/pscp/${problem.slug}`}>{problem.cleanName}</Link>
        </h2>

        <ConceptTags tags={problem.tags} limit={4} className="mt-2.5" />

        {/* Key takeaway micro-summary */}
        {takeaway && (
          <p className="mt-2.5 flex items-start gap-1.5 rounded-xl bg-muted/60 px-2.5 py-1.5 text-[11px] leading-relaxed text-muted-foreground">
            <Lightbulb className="mt-0.5 size-3 shrink-0 text-primary" />
            <span className="min-w-0">{t(takeaway, locale)}</span>
          </p>
        )}

        {/* Status strip */}
        <div className="mt-3 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[11px] text-muted-foreground">
          <button
            type="button"
            onClick={onToggleSolved}
            title={t(solved ? L.markUnsolved : L.markSolved, locale)}
            className={cn(
              "inline-flex cursor-pointer items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold transition-colors",
              solved
                ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                : "border text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            {solved ? <CheckCircle2 className="size-3" /> : <Clock className="size-3" />}
            <span>{t(solved ? L.solvedHere : L.inProgress, locale)}</span>
          </button>

          {!solved && attempt && (
            <span className="inline-flex items-center gap-1 font-mono">
              <PlayCircle className="size-3 text-primary" />
              {attempt.passed}/{attempt.total}
            </span>
          )}

          {problem.cases.length > 0 ? (
            <span className="inline-flex items-center gap-1 font-mono">
              <Code2 className="size-3" />
              {problem.cases.length} {t(L.casesCount, locale)}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 italic">{t(L.noCases, locale)}</span>
          )}

          <span
            className={cn(
              "inline-flex items-center gap-1",
              expired && "font-medium text-destructive",
            )}
          >
            {expired ? <TriangleAlert className="size-3" /> : <Clock className="size-3" />}
            {problem.expireLabel}
          </span>

          {hasSub && (
            <Link href={`/repo?path=oj${problem.id}/submission.md`} title={t(L.editOnRepo, locale)}>
              <Badge className="gap-1 rounded-full bg-green-500/10 px-2 py-0 text-[10px] font-medium text-green-600 shadow-none dark:text-green-400">
                <Check className="size-2.5" />
                {t(L.syncedSub, locale)}
              </Badge>
            </Link>
          )}
          {hasRefl && (
            <Link
              href={`/repo?path=oj${problem.id}/ai_reflection.md`}
              title={t(L.editOnRepo, locale)}
            >
              <Badge className="gap-1 rounded-full bg-green-500/10 px-2 py-0 text-[10px] font-medium text-green-600 shadow-none dark:text-green-400">
                <Check className="size-2.5" />
                {t(L.syncedRefl, locale)}
              </Badge>
            </Link>
          )}
        </div>
      </div>

      {/* Footer actions */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t pt-3">
        <div className="flex flex-wrap items-center gap-1">
          {problem.learningLog && (
            <Button
              asChild
              size="sm"
              variant="ghost"
              className="h-8 rounded-full px-2.5 text-[11px] text-primary hover:bg-muted hover:text-primary"
            >
              <Link href={`/make/submission?problem=${problem.id}`}>+ submission</Link>
            </Button>
          )}
          <Button
            asChild
            size="sm"
            variant="ghost"
            className="h-8 rounded-full px-2.5 text-[11px] text-muted-foreground hover:text-foreground"
          >
            <Link href={`/make/reflection?problem=${problem.id}`}>+ reflection</Link>
          </Button>
        </div>

        <div className="ml-auto flex items-center gap-1.5">
          <Button
            asChild
            size="sm"
            variant="ghost"
            className="size-8 rounded-full p-0"
            title={t(L.openProblem, locale)}
          >
            {/* iJudge deep link, carried through from the export unchanged. */}
            <a href={problem.url} target="_blank" rel="noreferrer">
              <ExternalLink className="size-3.5 text-muted-foreground" />
            </a>
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={onOpen}
            className="size-8 cursor-pointer rounded-full p-0"
            title={t(L.quickPeek, locale)}
          >
            <PanelsTopLeft className="size-3.5 text-muted-foreground" />
          </Button>
          <Button
            asChild
            size="sm"
            className="h-8 gap-1 rounded-full px-3 text-[11px] font-medium shadow-none"
          >
            <Link href={`/pscp/${problem.slug}`}>
              <PlayCircle className="size-3.5" />
              <span>{t(L.openWorkspace, locale)}</span>
              <ChevronRight className="size-3.5" />
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
