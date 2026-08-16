"use client";

import Link from "next/link";
import { useState, useMemo, useEffect, useCallback } from "react";
import {
  Sparkles,
  Search,
  BookOpen,
  ArrowRight,
  ExternalLink,
  Code2,
  FileText,
  Star,
  Layers,
  LayoutGrid,
  List,
  Flame,
  Info,
  Check,
  CheckCircle2,
  Clock,
  FolderGit2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  GraduationCap,
  Scale,
} from "lucide-react";
import type {
  RecommendedHubData,
  RecommendedProblem,
} from "@/lib/recommended";
import {
  getStoredProblemStatuses,
  setStoredProblemStatus,
  RECOMMENDED_STATUS_EVENT,
} from "@/lib/recommended-client";
import { useGithub } from "@/lib/github";
import { GithubConnect } from "@/components/github/github-connect";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MdView } from "@/components/md-view";
import { useLocale, t, type LText } from "@/lib/i18n";

const PDF_BOOKS = [
  { name: "ThinkPython 2", url: "https://ijudge.it.kmitl.ac.th/uploads/thinkpython2.pdf", label: "ThinkPython2.pdf" },
  { name: "Chapter 01", url: "https://ijudge.it.kmitl.ac.th/uploads/PSCP-Book/PSCP_Chapter01-2024.pdf", label: "Intro to PSCP" },
  { name: "Chapter 02", url: "https://ijudge.it.kmitl.ac.th/uploads/PSCP-Book/PSCP_Chapter02-2024.pdf", label: "Data Types & Expressions" },
  { name: "Chapter 03", url: "https://ijudge.it.kmitl.ac.th/uploads/PSCP-Book/PSCP_Chapter03-2024.pdf", label: "Conditionals & Logic" },
  { name: "Chapter 04", url: "https://ijudge.it.kmitl.ac.th/uploads/PSCP-Book/PSCP_Chapter04-2024.pdf", label: "Loops & Iteration" },
  { name: "Chapter 05", url: "https://ijudge.it.kmitl.ac.th/uploads/PSCP-Book/PSCP_Chapter05-2024.pdf", label: "Functions & Strings" },
];

const L: Record<string, LText> = {
  hubBadge: { th: "คลังโจทย์แนะนำ · PSCP", en: "PSCP Recommended Hub" },
  title: { th: "10 โจทย์แนะนำสำหรับฝึกฝน", en: "10 Recommended Problems" },
  subtitle: {
    th: "โจทย์สำคัญที่คัดสรรมาเพื่อฝึกฝน Pattern และเทคนิคการเขียนโปรแกรมด้วย Python พร้อมระบบซิงก์ GitHub และเช็คสถานะความคืบหน้า",
    en: "Core curriculum problems to master algorithmic patterns with GitHub repo sync and interactive progress tracking.",
  },
  statTotal: { th: "โจทย์ทั้งหมด", en: "Total Problems" },
  statPassed: { th: "ผ่านแล้ว / เสร็จ", en: "Finished / Passed" },
  statInProgress: { th: "กำลังฝึก", en: "In Progress" },
  statInRepo: { th: "ใน GitHub Repo", en: "In GitHub Repo" },
  statLL: { th: "Learning Logs", en: "Learning Logs" },
  statPatterns: { th: "เทคนิคสำคัญ", en: "Key Patterns" },
  searchPlaceholder: {
    th: "ค้นหาโจทย์, รหัส OJ หรือเทคนิค (เช่น slicing, math, modulo)...",
    en: "Search problems, OJ ID, or technique (e.g. slicing, math, modulo)...",
  },
  filterAll: { th: "ทั้งหมด", en: "All" },
  filterPassed: { th: "ผ่านแล้ว", en: "Finished" },
  filterInProgress: { th: "กำลังฝึก", en: "In Progress" },
  filterInRepo: { th: "ใน GitHub", en: "In GitHub" },
  filterLL: { th: "Learning Log", en: "Learning Log" },
  viewGrid: { th: "การ์ด", en: "Cards" },
  viewTable: { th: "ตารางสรุป", en: "Matrix" },
  viewGuide: { th: "คู่มือ & กฎ", en: "Study Guide" },
  openProblem: { th: "อ่านแนวคิด & โค้ด", en: "Read Notes & Code" },
  makeSub: { th: "สร้าง submission.md", en: "Make submission" },
  makeRefl: { th: "สร้าง reflection", en: "Make reflection" },
  onIJudge: { th: "เปิดบน iJudge", en: "Open on iJudge" },
  technique: { th: "เทคนิคสำคัญ", en: "Key Technique" },
  status: { th: "สถานะ & GitHub", en: "Status & GitHub" },
  difficulty: { th: "ความยาก", en: "Difficulty" },
  actions: { th: "การดำเนินการ", en: "Actions" },
  problemCol: { th: "โจทย์", en: "Problem" },
  noMatch: { th: "ไม่พบโจทย์ที่ตรงกับคำค้นหา", en: "No problems match your search." },
  resetFilter: { th: "ล้างตัวกรอง", en: "Reset filters" },
  markFinished: { th: "ทำเสร็จแล้ว", en: "Mark Finished" },
  markInProgress: { th: "กำลังทำ", en: "Mark In Progress" },
  inRepoBadge: { th: "มีใน Repo", en: "In Repo" },
  ruleTitle: { th: "กฎสำคัญก่อนส่ง iJudge", en: "Quick Rules Before Submitting" },
  rule1: { th: "ทดสอบโค้ดใน VS Code ให้ผ่านอย่างน้อย 3 กรณี (เคสปกติ, เคสขอบเขต/ค่าต่ำสุด, เคสดักทาง)", en: "Test code in VS Code across at least 3 distinct cases (normal, boundary, tricky)." },
  rule2: { th: "ตรวจรูปแบบ output ให้ตรงเป๊ะ (ตัวพิมพ์เล็ก/ใหญ่, การเว้นวรรค, จุดทศนิยม)", en: "Ensure exact output formatting (spelling, capitalization, and decimal precision)." },
  rule3: { th: "ต้องสามารถอธิบายโค้ดทุกบรรทัดได้ด้วยความเข้าใจของตนเอง", en: "Be able to explain every line of your code in your own words." },
};

export function RecommendedHub({ data }: { data: RecommendedHubData }) {
  const { locale } = useLocale();
  const gh = useGithub();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "passed" | "in_progress" | "in_repo" | "ll">("all");
  const [viewMode, setViewMode] = useState<"grid" | "table" | "guide">("grid");
  const [customStatuses, setCustomStatuses] = useState<Record<number, "passed" | "in_progress">>({});

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration from localStorage after mount (SSR-safe)
    setCustomStatuses(getStoredProblemStatuses());
    const update = () => setCustomStatuses(getStoredProblemStatuses());
    window.addEventListener(RECOMMENDED_STATUS_EVENT, update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener(RECOMMENDED_STATUS_EVENT, update);
      window.removeEventListener("storage", update);
    };
  }, []);

  const getEffectiveStatus = useCallback(
    (p: RecommendedProblem): "passed" | "in_progress" => {
      if (customStatuses[p.id]) return customStatuses[p.id];
      return p.status;
    },
    [customStatuses],
  );

  function toggleStatus(id: number) {
    const current = customStatuses[id] || data.problems.find((p) => p.id === id)?.status || "in_progress";
    const next = current === "passed" ? "in_progress" : "passed";
    setStoredProblemStatus(id, next);
  }

  const passedCount = useMemo(() => {
    return data.problems.filter((p) => getEffectiveStatus(p) === "passed").length;
  }, [data.problems, getEffectiveStatus]);

  const inProgressCount = useMemo(() => {
    return data.problems.filter((p) => getEffectiveStatus(p) === "in_progress").length;
  }, [data.problems, getEffectiveStatus]);

  const inRepoCount = useMemo(() => {
    return data.problems.filter((p) => Boolean(gh.status[p.id]?.recommended?.inRepo)).length;
  }, [data.problems, gh.status]);

  const filteredProblems = useMemo(() => {
    const q = search.toLowerCase().trim();
    return data.problems.filter((p) => {
      const effStatus = getEffectiveStatus(p);
      const inRepo = Boolean(gh.status[p.id]?.recommended?.inRepo);

      if (filter === "passed" && effStatus !== "passed") return false;
      if (filter === "in_progress" && effStatus !== "in_progress") return false;
      if (filter === "in_repo" && !inRepo) return false;
      if (filter === "ll" && !p.learningLog) return false;

      if (!q) return true;
      const matchId = String(p.id).includes(q);
      const matchName = p.cleanName.toLowerCase().includes(q);
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchTech = p.technique.toLowerCase().includes(q);
      const matchFolder = p.folderName.toLowerCase().includes(q);
      return matchId || matchName || matchTitle || matchTech || matchFolder;
    });
  }, [data.problems, search, filter, getEffectiveStatus, gh.status]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 w-full">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-b from-primary/[0.08] via-background to-card p-6 sm:p-10 shadow-sm">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-primary/15 blur-3xl"
        />
        <div className="relative flex flex-col items-start gap-4">
          <Badge
            variant="outline"
            className="flex items-center gap-1.5 border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"
          >
            <Sparkles className="size-3.5" />
            {t(L.hubBadge, locale)}
          </Badge>

          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {t(L.title, locale)}
            </h1>
            <p className="mt-2 max-w-2xl text-base text-muted-foreground leading-relaxed">
              {t(L.subtitle, locale)}
            </p>
          </div>

          {/* Quick Stats Strip */}
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5 w-full">
            <div className="rounded-2xl border bg-card/80 backdrop-blur px-4 py-3">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{t(L.statTotal, locale)}</span>
                <Layers className="size-4 text-primary" />
              </div>
              <p className="mt-1 font-mono text-2xl font-bold">{data.problems.length}</p>
            </div>

            <div className="rounded-2xl border bg-card/80 backdrop-blur px-4 py-3">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{t(L.statPassed, locale)}</span>
                <CheckCircle2 className="size-4 text-emerald-500" />
              </div>
              <p className="mt-1 font-mono text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {passedCount}
              </p>
            </div>

            <div className="rounded-2xl border bg-card/80 backdrop-blur px-4 py-3">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{t(L.statInProgress, locale)}</span>
                <Clock className="size-4 text-amber-500" />
              </div>
              <p className="mt-1 font-mono text-2xl font-bold text-amber-600 dark:text-amber-400">
                {inProgressCount}
              </p>
            </div>

            <div className="rounded-2xl border bg-card/80 backdrop-blur px-4 py-3">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{t(L.statLL, locale)}</span>
                <Flame className="size-4 text-rose-500" />
              </div>
              <p className="mt-1 font-mono text-2xl font-bold text-rose-600 dark:text-rose-400">
                {data.learningLogCount}
              </p>
            </div>

            {gh.connected ? (
              <div className="rounded-2xl border bg-card/80 backdrop-blur px-4 py-3">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{t(L.statInRepo, locale)}</span>
                  <FolderGit2 className="size-4 text-blue-500" />
                </div>
                <p className="mt-1 font-mono text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {inRepoCount}/{data.problems.length}
                </p>
              </div>
            ) : (
              <div className="rounded-2xl border bg-card/80 backdrop-blur px-4 py-3">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{t(L.statPatterns, locale)}</span>
                  <Sparkles className="size-4 text-primary" />
                </div>
                <p className="mt-1 font-mono text-2xl font-bold text-primary">
                  10 Patterns
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Exam Day Briefing Banner */}
      <ExamBriefingCard locale={locale} />

      {/* GitHub Sync Banner */}
      <div className="mt-6">
        <GithubConnect
          connected={gh.connected}
          user={gh.user}
          repo={gh.repo}
          hydrated={gh.hydrated}
          onChanged={gh.refresh}
        />
      </div>

      {/* Control Bar: Search + Filter Tabs + View Mode */}
      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t(L.searchPlaceholder, locale)}
            className="pl-10 h-10 rounded-xl bg-card border-border/80"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Filter buttons */}
          <div className="flex rounded-xl border bg-card p-1 text-xs font-medium">
            <button
              onClick={() => setFilter("all")}
              className={`rounded-lg px-3 py-1.5 transition-colors ${
                filter === "all"
                  ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t(L.filterAll, locale)} ({data.problems.length})
            </button>
            <button
              onClick={() => setFilter("passed")}
              className={`rounded-lg px-3 py-1.5 transition-colors ${
                filter === "passed"
                  ? "bg-emerald-600 text-white font-semibold shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t(L.filterPassed, locale)} ({passedCount})
            </button>
            <button
              onClick={() => setFilter("in_progress")}
              className={`rounded-lg px-3 py-1.5 transition-colors ${
                filter === "in_progress"
                  ? "bg-amber-600 text-white font-semibold shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t(L.filterInProgress, locale)} ({inProgressCount})
            </button>
            {gh.connected && (
              <button
                onClick={() => setFilter("in_repo")}
                className={`rounded-lg px-3 py-1.5 transition-colors ${
                  filter === "in_repo"
                    ? "bg-blue-600 text-white font-semibold shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t(L.filterInRepo, locale)} ({inRepoCount})
              </button>
            )}
            <button
              onClick={() => setFilter("ll")}
              className={`rounded-lg px-3 py-1.5 transition-colors ${
                filter === "ll"
                  ? "bg-rose-600 text-white font-semibold shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t(L.filterLL, locale)} ({data.learningLogCount})
            </button>
          </div>

          {/* View mode toggle */}
          <div className="flex rounded-xl border bg-card p-1 text-xs">
            <button
              onClick={() => setViewMode("grid")}
              title={t(L.viewGrid, locale)}
              className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 transition-colors ${
                viewMode === "grid"
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <LayoutGrid className="size-4" />
              <span className="hidden md:inline">{t(L.viewGrid, locale)}</span>
            </button>
            <button
              onClick={() => setViewMode("table")}
              title={t(L.viewTable, locale)}
              className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 transition-colors ${
                viewMode === "table"
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <List className="size-4" />
              <span className="hidden md:inline">{t(L.viewTable, locale)}</span>
            </button>
            <button
              onClick={() => setViewMode("guide")}
              title={t(L.viewGuide, locale)}
              className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 transition-colors ${
                viewMode === "guide"
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <BookOpen className="size-4" />
              <span className="hidden md:inline">{t(L.viewGuide, locale)}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area based on View Mode */}
      {viewMode === "grid" && (
        <div className="mt-6">
          {filteredProblems.length === 0 ? (
            <div className="rounded-2xl border border-dashed p-12 text-center">
              <Info className="mx-auto size-8 text-muted-foreground/60" />
              <p className="mt-3 text-sm text-muted-foreground">{t(L.noMatch, locale)}</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => {
                  setSearch("");
                  setFilter("all");
                }}
              >
                {t(L.resetFilter, locale)}
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
              {filteredProblems.map((problem) => (
                <ProblemCard
                  key={problem.id}
                  problem={problem}
                  effectiveStatus={getEffectiveStatus(problem)}
                  inRepo={Boolean(gh.status[problem.id]?.recommended?.inRepo)}
                  onToggleStatus={() => toggleStatus(problem.id)}
                  locale={locale}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {viewMode === "table" && (
        <div className="mt-6 overflow-hidden rounded-2xl border bg-card shadow-sm">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-20 font-mono">OJ ID</TableHead>
                <TableHead>{t(L.problemCol, locale)}</TableHead>
                <TableHead>{t(L.technique, locale)}</TableHead>
                <TableHead className="w-36 text-center">{t(L.status, locale)}</TableHead>
                <TableHead className="w-40 text-right">{t(L.actions, locale)}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProblems.map((p) => {
                const effStatus = getEffectiveStatus(p);
                const inRepo = Boolean(gh.status[p.id]?.recommended?.inRepo);
                return (
                  <TableRow key={p.id} className="hover:bg-muted/40 transition-colors">
                    <TableCell className="font-mono font-bold text-primary">
                      {p.id}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <Link
                          href={`/recommended/${p.slug}`}
                          className="font-medium text-foreground hover:text-primary hover:underline underline-offset-4"
                        >
                          {p.cleanName}
                        </Link>
                        <div className="flex items-center gap-1.5 mt-1">
                          {p.learningLog && (
                            <Badge variant="secondary" className="text-[10px] bg-rose-500/10 text-rose-600 dark:text-rose-400">
                              Learning Log
                            </Badge>
                          )}
                          {p.hasCode && (
                            <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground font-mono">
                              <Code2 className="size-3" /> main.py
                            </span>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-muted-foreground font-mono bg-muted px-2 py-1 rounded-md">
                        {p.technique || "Pattern Practice"}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex flex-col items-center gap-1">
                        <button
                          onClick={() => toggleStatus(p.id)}
                          className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold transition-all hover:scale-105 active:scale-95 ${
                            effStatus === "passed"
                              ? "bg-emerald-600/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                              : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                          }`}
                          title="Click to toggle status"
                        >
                          {effStatus === "passed" ? (
                            <>
                              <CheckCircle2 className="size-3" />
                              <span>{t(L.filterPassed, locale)}</span>
                            </>
                          ) : (
                            <>
                              <Clock className="size-3" />
                              <span>{t(L.filterInProgress, locale)}</span>
                            </>
                          )}
                        </button>
                        {inRepo && (
                          <span className="inline-flex items-center gap-1 text-[10px] text-blue-600 dark:text-blue-400 font-medium">
                            <FolderGit2 className="size-2.5" />
                            {t(L.inRepoBadge, locale)}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button asChild size="sm" variant="outline" className="h-8 text-xs">
                          <Link href={`/recommended/${p.slug}`}>
                            <FileText className="mr-1 size-3.5" />
                            {t(L.openProblem, locale)}
                          </Link>
                        </Button>
                        <Button asChild size="sm" variant="ghost" className="size-8 p-0" title="Open on iJudge">
                          <a href={p.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="size-3.5 text-muted-foreground" />
                          </a>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {viewMode === "guide" && (
        <div className="mt-6 rounded-2xl border bg-card p-6 sm:p-10 shadow-sm space-y-6">
          {/* Quick Rules */}
          <div className="rounded-xl border border-primary/20 bg-primary/[0.04] p-5">
            <h3 className="flex items-center gap-2 font-semibold text-primary">
              <Sparkles className="size-4" />
              {t(L.ruleTitle, locale)}
            </h3>
            <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <Check className="size-4 text-primary shrink-0 mt-0.5" />
                <span>{t(L.rule1, locale)}</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="size-4 text-primary shrink-0 mt-0.5" />
                <span>{t(L.rule2, locale)}</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="size-4 text-primary shrink-0 mt-0.5" />
                <span>{t(L.rule3, locale)}</span>
              </li>
            </ul>
          </div>

          <MdView markdown={data.overviewMd} />
        </div>
      )}
    </main>
  );
}

/**
 * Sleek, minimal, and informative Exam Briefing Component
 */
function ExamBriefingCard({ locale }: { locale: "th" | "en" }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <section aria-label="Exam Announcement" className="mt-6 overflow-hidden rounded-3xl border border-amber-500/30 bg-gradient-to-b from-amber-500/[0.07] via-background to-card p-5 sm:p-6 shadow-sm transition-all">
      {/* Header with expand / collapse */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400">
            <AlertTriangle className="size-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base font-bold text-foreground sm:text-lg">
                {locale === "th" ? "🚨 แจ้งเตือนสำคัญก่อนวันสอบ PSCP‼️" : "🚨 Important PSCP Exam Day Briefing"}
              </h2>
              <Badge variant="outline" className="border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300 text-[11px] font-medium">
                {locale === "th" ? "Course iJudge ปิด 23:59 คืนนี้" : "iJudge Closes 23:59 Tonight"}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {locale === "th"
                ? "Course iJudge จะปิดวันนี้เวลา 23:59 เพื่อให้น้องๆ ได้พักผ่อนก่อนสอบ 🛏️"
                : "Course iJudge will close at 23:59 tonight so everyone can rest well before the exam."}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors px-2.5 py-1 rounded-lg border bg-background/80 hover:bg-muted"
        >
          <span>{isOpen ? (locale === "th" ? "ย่อข้อมูล" : "Collapse") : (locale === "th" ? "แสดงรายละเอียด" : "Expand")}</span>
          {isOpen ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
        </button>
      </div>

      {/* Expanded Content */}
      {isOpen && (
        <div className="mt-5 space-y-4 pt-4 border-t border-amber-500/20 text-sm">
          <div className="grid gap-3 sm:grid-cols-3">
            {/* 1. Schedule & Environment */}
            <div className="rounded-2xl border bg-card/80 p-4">
              <div className="flex items-center gap-2 font-semibold text-foreground text-xs uppercase tracking-wide">
                <Clock className="size-4 text-primary" />
                <span>{locale === "th" ? "กำหนดการ & เครื่องสอบ" : "Schedule & Lab Setup"}</span>
              </div>
              <ul className="mt-2.5 space-y-1.5 text-xs text-muted-foreground leading-relaxed">
                <li className="flex items-start gap-1.5">
                  <span className="font-bold text-foreground">09:10 น.</span>
                  <span>เริ่มเข้าห้องสอบเพื่อเช็ค Python & VS Code</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="font-bold text-foreground">09:30 น.</span>
                  <span>เริ่มทำข้อสอบ</span>
                </li>
                <li className="pt-1 text-[11px] font-medium text-amber-600 dark:text-amber-400">
                  ⚠️ {locale === "th" ? "สามารถใช้ได้แค่ VS Code เท่านั้น" : "Only VS Code is permitted"}
                </li>
              </ul>
            </div>

            {/* 2. Regulations & ID */}
            <div className="rounded-2xl border bg-card/80 p-4">
              <div className="flex items-center gap-2 font-semibold text-foreground text-xs uppercase tracking-wide">
                <GraduationCap className="size-4 text-emerald-500" />
                <span>{locale === "th" ? "สิ่งที่ต้องเตรียมพร้อม" : "Must-Bring Checklist"}</span>
              </div>
              <ul className="mt-2.5 space-y-1.5 text-xs text-muted-foreground leading-relaxed">
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-500 font-bold">🪪</span>
                  <span className="font-semibold text-foreground">พกบัตรนักศึกษา</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-500 font-bold">👔</span>
                  <span>แต่งกายตามระเบียบของสถาบัน (อาจารย์คุมสอบตรวจเข้มงวด)</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-500 font-bold">📄</span>
                  <span>มีกระดาษ A4 ให้ในห้องสอบสำหรับทดเลข/คิดโจทย์</span>
                </li>
              </ul>
            </div>

            {/* 3. Score Breakdown */}
            <div className="rounded-2xl border bg-card/80 p-4">
              <div className="flex items-center gap-2 font-semibold text-foreground text-xs uppercase tracking-wide">
                <Scale className="size-4 text-rose-500" />
                <span>{locale === "th" ? "สัดส่วนคะแนนต่อ 1 ข้อ" : "Scoring per Problem"}</span>
              </div>
              <div className="mt-2.5 space-y-2 text-xs">
                <div className="flex items-center justify-between rounded-xl bg-muted/60 px-3 py-1.5">
                  <span className="text-muted-foreground">Testcases</span>
                  <span className="font-mono font-bold text-foreground">100 คะแนน</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-rose-500/10 px-3 py-1.5 text-rose-600 dark:text-rose-400">
                  <span className="font-semibold">PEP-8 Standard</span>
                  <span className="font-mono font-bold">9,900 คะแนน</span>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  {locale === "th" ? "ระวัง PEP-8 กันดีๆ นะคับ 😸 (เว้นวรรค & การตั้งชื่อ)" : "Mind PEP-8 formatting strictly!"}
                </p>
              </div>
            </div>
          </div>

          {/* Available Textbooks in Exam */}
          <div className="rounded-2xl border bg-card/80 p-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                <BookOpen className="size-4 text-blue-500" />
                <span>{locale === "th" ? "📝 สิ่งที่มีให้ในห้องสอบ — Textbooks & PSCP Books" : "Provided Exam Reference Textbooks"}</span>
              </div>
              <span className="text-[11px] text-muted-foreground hidden sm:inline">
                {locale === "th" ? "(กดเพื่อเปิดอ่านไฟล์ PDF ได้ทันที)" : "(Click to open PDF)"}
              </span>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
              {PDF_BOOKS.map((book) => (
                <a
                  key={book.name}
                  href={book.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col justify-between rounded-xl border bg-background p-2.5 text-xs transition-all hover:border-primary/50 hover:bg-primary/[0.04] hover:shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {book.name}
                    </span>
                    <ExternalLink className="size-3 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <span className="mt-1 text-[10px] text-muted-foreground truncate">
                    {book.label}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* TA Good Luck Footer */}
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-amber-500/10 px-4 py-2.5 text-xs text-amber-800 dark:text-amber-200">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <span className="font-medium">
                {locale === "th"
                  ? "ขอให้น้องๆ ทุกคนทำข้อสอบได้เยอะๆ น้าา ✌️ Good Luck!"
                  : "Good luck to everyone on the exam! You've got this ✌️"}
              </span>
            </div>
            <span className="font-mono text-[11px] font-semibold text-amber-700 dark:text-amber-300">
              — By พี่ TA :3
            </span>
          </div>
        </div>
      )}
    </section>
  );
}

function ProblemCard({
  problem,
  effectiveStatus,
  inRepo,
  onToggleStatus,
  locale,
}: {
  problem: RecommendedProblem;
  effectiveStatus: "passed" | "in_progress";
  inRepo: boolean;
  onToggleStatus: () => void;
  locale: "th" | "en";
}) {
  return (
    <article className="group relative flex flex-col justify-between rounded-2xl border bg-card p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md">
      <div>
        {/* Card Header: OJ ID, Badges, Difficulty, Status Button */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-sm font-bold text-primary">
              OJ {problem.id}
            </span>

            {/* Interactive Status Toggle Button */}
            <button
              onClick={onToggleStatus}
              className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-semibold transition-all hover:scale-105 active:scale-95 cursor-pointer ${
                effectiveStatus === "passed"
                  ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                  : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
              }`}
              title="Click to toggle status (Finished / In Progress)"
            >
              {effectiveStatus === "passed" ? (
                <>
                  <CheckCircle2 className="size-3" />
                  <span>{locale === "th" ? "ผ่านแล้ว" : "Finished"}</span>
                </>
              ) : (
                <>
                  <Clock className="size-3" />
                  <span>{locale === "th" ? "กำลังฝึก" : "In Progress"}</span>
                </>
              )}
            </button>

            {inRepo && (
              <Badge variant="outline" className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 text-[10px] font-medium">
                <FolderGit2 className="mr-1 size-2.5" />
                {locale === "th" ? "ใน Repo" : "In Repo"}
              </Badge>
            )}

            {problem.learningLog && (
              <Badge variant="secondary" className="text-[11px] bg-rose-500/10 text-rose-600 dark:text-rose-400 font-medium">
                Learning Log
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-0.5 text-amber-500">
            {problem.difficulty > 0 ? (
              Array.from({ length: problem.difficulty }).map((_, i) => (
                <Star key={i} className="size-3.5 fill-amber-400 text-amber-400" />
              ))
            ) : (
              <span className="text-[11px] text-muted-foreground font-mono">0★</span>
            )}
          </div>
        </div>

        {/* Title */}
        <h2 className="mt-3 text-lg font-semibold tracking-tight text-foreground group-hover:text-primary transition-colors">
          <Link href={`/recommended/${problem.slug}`}>
            {problem.cleanName}
          </Link>
        </h2>

        {/* Technique Badge */}
        {problem.technique && (
          <div className="mt-2.5 flex items-start gap-1.5">
            <span className="rounded-md bg-muted px-2 py-1 font-mono text-xs text-muted-foreground leading-snug">
              💡 {problem.technique}
            </span>
          </div>
        )}
      </div>

      {/* Card Footer: Action Links */}
      <div className="mt-5 pt-3 border-t flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {problem.learningLog && (
            <Button asChild size="sm" variant="ghost" className="h-8 px-2.5 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30">
              <Link href={`/make/submission?id=${problem.id}`}>
                + submission
              </Link>
            </Button>
          )}
          <Button asChild size="sm" variant="ghost" className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground">
            <Link href={`/make/reflection?id=${problem.id}`}>
              + reflection
            </Link>
          </Button>
        </div>

        <div className="flex items-center gap-1.5">
          <Button asChild size="sm" variant="default" className="h-8 px-3 text-xs gap-1">
            <Link href={`/recommended/${problem.slug}`}>
              <span>{t(L.openProblem, locale)}</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
