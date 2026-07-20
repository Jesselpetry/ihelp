"use client";

import Link from "next/link";
import {
  Star,
  Clock,
  TriangleAlert,
  ChartColumn,
  Folder,
  FolderOpen,
  GraduationCap,
  ExternalLink,
  Check,
} from "lucide-react";
import { useMemo, useState } from "react";
import type { MasterProblem } from "@/lib/master";
import { Badge } from "@/components/ui/badge";
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
import { WeekBadge } from "@/components/week-badge";
import { Shortcuts } from "@/components/shortcuts";
import { COURSE } from "@/lib/course";
import { GithubConnect } from "@/components/github/github-connect";
import { useGithub } from "@/lib/github";
import { useLocale, t, type LText } from "@/lib/i18n";

const L: Record<string, LText> = {
  crumbCourses: { th: "Courses", en: "Courses" },
  crumbCourse: {
    th: "[2026] Problem Solving and Computer Programming (IT)",
    en: "[2026] Problem Solving and Computer Programming (IT)",
  },
  heading: { th: "Problems", en: "Problems" },
  intro: {
    th: "เลือกโจทย์เพื่อสร้าง submission.md / ai_reflection.md แบบทีละขั้นตอน แล้วดาวน์โหลดไฟล์ไปเก็บในเครื่องของคุณ",
    en: "Pick a problem to build submission.md / ai_reflection.md step by step, then download the file to your machine.",
  },
  total: { th: "โจทย์ทั้งหมด", en: "Total problems" },
  logs: { th: "Learning logs", en: "Learning logs" },
  listTitle: { th: "รายการโจทย์ (Problems List)", en: "Problems List" },
  search: { th: "ค้นหาชื่อหรือ ID...", en: "Search name or ID..." },
  problem: { th: "ชื่อโจทย์", en: "Problem" },
  difficulty: { th: "ความยาก", en: "Difficulty" },
  actions: { th: "สร้างไฟล์ (Learning Log)", en: "Make files (Learning Log)" },
  expires: { th: "หมดเขต", en: "Expires" },
  expired: { th: "หมดเขตแล้ว", en: "Expired" },
  learningLog: { th: "Learning Log", en: "Learning Log" },
  submissionBtn: { th: "สร้าง submission.md", en: "Make submission.md" },
  reflectionBtn: { th: "สร้าง ai_reflection.md", en: "Make ai_reflection.md" },
  openProblem: { th: "เปิดโจทย์บน iJudge", en: "Open on iJudge" },
  llOnly: {
    th: "submission.md ต้องทำเฉพาะโจทย์ที่มีป้าย Learning Log (แสดงไว้ด้านบนสุด) ส่วน ai_reflection.md สร้างได้กับทุกโจทย์ที่ใช้ AI",
    en: "submission.md is required only for problems tagged Learning Log (sorted to the top). ai_reflection.md can be made for any problem where AI was used.",
  },
  empty: {
    th: "ไม่พบโจทย์ที่ตรงกับตัวกรอง",
    en: "No problems match the filter.",
  },
  all: { th: "All", en: "All" },
  stats: { th: "สถิติ", en: "Stats" },
  coursePage: { th: "หน้ารายวิชา", en: "Course page" },
  week3BannerTitle: {
    th: "โจทย์ Week 3 มาแล้วว!",
    en: "Week 3 Problems are here!",
  },
  week3BannerDesc: {
    th: "เริ่มทำโจทย์ประจำสัปดาห์นี้และสร้างบันทึกประวัติการส่ง (Learning Log) ได้เลย",
    en: "Start solving this week's problems and create your Learning Logs.",
  },
  syncedSub: { th: "submission", en: "submission" },
  syncedRefl: { th: "reflection", en: "reflection" },
  editOnRepo: { th: "เปิดแก้ไฟล์นี้ใน repo", en: "Open this file in the repo editor" },
};

// Raw expire label is English ("31 July 2026, 00:00"); render it in the
// active locale from the parsed ISO — Thai shows Thai months + Buddhist era.
function formatExpire(
  iso: string | null,
  label: string,
  locale: string,
): string {
  if (!iso) return label;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return label;
  return d.toLocaleDateString(locale === "th" ? "th-TH" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function DifficultyStars({ value }: { value: number }) {
  if (value <= 0) {
    return <span className="text-sm text-muted-foreground/50">—</span>;
  }
  return (
    <span
      className="inline-flex items-center gap-1.5 whitespace-nowrap"
      title={`difficulty ${value}/5`}
    >
      <span className="inline-flex items-center gap-0.5">
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            className={
              i < value
                ? "size-4 fill-amber-400 text-amber-400"
                : "size-4 text-border"
            }
          />
        ))}
      </span>
      <span className="text-xs font-medium text-muted-foreground tabular-nums">
        {value}/5
      </span>
    </span>
  );
}

export function ProblemsView({ problems }: { problems: MasterProblem[] }) {
  const { locale } = useLocale();
  const gh = useGithub();
  const [query, setQuery] = useState("");
  const [weekFilter, setWeekFilter] = useState<number | "all">("all");

  const weeks = useMemo(
    () =>
      [
        ...new Set(
          problems.map((p) => p.week).filter((w): w is number => w !== null),
        ),
      ].sort((a, b) => a - b),
    [problems],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (
      problems
        .filter((p) => {
          if (weekFilter !== "all" && p.week !== weekFilter) return false;
          if (!q) return true;
          return p.name.toLowerCase().includes(q) || String(p.id).includes(q);
        })
        // learning-log problems first: they are the ones that require submission.md
        .sort((a, b) => {
          // 1. Learning Log first
          if (a.learningLog !== b.learningLog) {
            return a.learningLog ? -1 : 1;
          }
          // 2. Then latest week (descending)
          const weekA = a.week ?? 0;
          const weekB = b.week ?? 0;
          if (weekA !== weekB) {
            return weekB - weekA;
          }
          // 3. Then by ID (ascending)
          return a.id - b.id;
        })
    );
  }, [problems, query, weekFilter]);

  return (
    <main className="max-w-6xl mx-auto px-6 py-8 w-full">
      {/* Week 3 Announcement Banner */}
      <div className="mb-6 rounded-2xl bg-primary px-5 py-4 text-primary-foreground shadow-md flex items-center justify-between gap-4 transition-all hover:brightness-105">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-foreground/20 text-lg">
            🎉
          </span>
          <div className="text-left">
            <h4 className="font-bold text-base md:text-lg">
              {t(L.week3BannerTitle, locale)}
            </h4>
            <p className="text-xs md:text-sm text-primary-foreground/80 font-normal mt-0.5">
              {t(L.week3BannerDesc, locale)}
            </p>
          </div>
        </div>
        <div className="hidden sm:block">
          <span className="rounded-full bg-primary-foreground/25 px-3 py-1 text-xs font-semibold backdrop-blur-sm">
            Active
          </span>
        </div>
      </div>

      <div className="mb-6">
        <p className="text-sm text-muted-foreground mb-1">
          {t(L.crumbCourses, locale)} / {t(L.crumbCourse, locale)}
        </p>
        <h1 className="text-4xl font-bold">{t(L.heading, locale)}</h1>
        <p className="text-sm text-muted-foreground mt-2">
          {t(L.intro, locale)}
        </p>

        {/* official course facts */}
        <div className="mt-4 rounded-xl border bg-card/60 px-4 py-3.5">
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
            <Badge className="bg-primary/10 text-primary font-mono font-semibold">
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
              className="ml-auto inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              {t(L.coursePage, locale)}
              <ExternalLink className="size-3" />
            </a>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed mt-2">
            {t(COURSE.description, locale)}
          </p>
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground mt-1.5">
            <GraduationCap className="size-3.5 text-primary/70" />
            {COURSE.instructors.map((ins, i) => (
              <span key={ins.url} className="inline-flex items-center gap-x-2">
                {i > 0 && <span className="text-border">·</span>}
                <a
                  href={ins.url}
                  target="_blank"
                  rel="noreferrer"
                  className="underline underline-offset-4 decoration-border hover:text-primary hover:decoration-current transition-colors"
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

      {/* Stats + weekly shortcuts share one card, split into two columns */}
      <div className="bg-card rounded-2xl border shadow-sm mb-6 grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x">
        <div className="p-5 flex flex-col">
          <h2 className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wide mb-3">
            <ChartColumn className="size-3.5" />
            {t(L.stats, locale)}
          </h2>
          <div className="grid auto-rows-fr gap-3 flex-1">
            {[
              { label: t(L.total, locale), value: problems.length },
              {
                label: t(L.logs, locale),
                value: problems.filter((p) => p.learningLog).length,
              },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-xl border bg-background/50 px-5 py-4 flex flex-col justify-center"
              >
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                  {s.label}
                </p>
                <p className="text-2xl font-bold mt-1">{s.value}</p>
              </div>
            ))}
          </div>
        </div>
        <Shortcuts />
      </div>

      {/* folder-style week tabs: the active tab merges into the card below */}
      {weeks.length > 0 && (
        <div className="flex items-end gap-1 pl-4 overflow-x-auto">
          {([["all", t(L.all, locale)] as const, ...weeks.map((w) => [w, `Week ${w}`] as const)]).map(
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
                      ? "relative z-10 -mb-px border border-b-0 bg-card text-primary font-semibold"
                      : "border border-transparent text-muted-foreground hover:bg-muted/60 hover:text-foreground")
                  }
                >
                  {active ? (
                    <FolderOpen className="size-3.5" />
                  ) : (
                    <Folder className="size-3.5" />
                  )}
                  {label}
                </button>
              );
            },
          )}
        </div>
      )}

      <div className="bg-card rounded-2xl border shadow-sm overflow-hidden">
        <div className="flex flex-wrap items-center gap-3 px-6 py-5 border-b">
          <h3 className="text-xl font-semibold mr-auto">
            {t(L.listTitle, locale)}
          </h3>
          <Input
            placeholder={t(L.search, locale)}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-52"
          />
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-background hover:bg-background">
                <TableHead>{t(L.problem, locale)}</TableHead>
                <TableHead>{t(L.difficulty, locale)}</TableHead>
                <TableHead>{t(L.actions, locale)}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="py-16 text-center text-muted-foreground"
                  >
                    {t(L.empty, locale)}
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((p) => {
                  const expired =
                    p.expireIso !== null && new Date(p.expireIso) < new Date();
                  return (
                    <TableRow
                      key={p.id}
                      className="group border-l-2 border-l-transparent transition-colors hover:border-l-primary hover:bg-primary/[0.03] data-[ll=true]:border-l-primary/40"
                      data-ll={p.learningLog || undefined}
                    >
                      <TableCell className="py-4">
                        <div className="flex flex-wrap items-center gap-2">
                          <a
                            href={p.url}
                            target="_blank"
                            rel="noreferrer"
                            title={t(L.openProblem, locale)}
                            className="text-primary font-semibold text-base underline-offset-4 hover:underline"
                          >
                            {p.name}
                          </a>
                          {p.learningLog && (
                            <Badge className="bg-primary/10 text-primary font-semibold">
                              {t(L.learningLog, locale)}
                            </Badge>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5 mt-2">
                          <Badge
                            variant="outline"
                            className="font-mono text-muted-foreground"
                          >
                            #{p.id}
                          </Badge>
                          {p.week !== null && <WeekBadge week={p.week} />}
                          <Badge
                            variant="outline"
                            className={
                              expired
                                ? "border-destructive/30 bg-destructive/10 text-destructive font-medium"
                                : "text-muted-foreground"
                            }
                          >
                            {expired ? (
                              <TriangleAlert className="size-3" />
                            ) : (
                              <Clock className="size-3" />
                            )}
                            {t(expired ? L.expired : L.expires, locale)}{" "}
                            {formatExpire(p.expireIso, p.expireLabel, locale)}
                          </Badge>
                          {gh.connected && gh.repo && gh.status[p.id]?.submission && (
                            <Link href={`/repo?path=oj${p.id}/submission.md`} title={t(L.editOnRepo, locale)}>
                              <Badge className="bg-green-500/10 text-green-600 dark:text-green-400 font-medium cursor-pointer hover:bg-green-500/20 transition-colors">
                                <Check className="size-3" />
                                {t(L.syncedSub, locale)}
                              </Badge>
                            </Link>
                          )}
                          {gh.connected && gh.repo && gh.status[p.id]?.reflection && (
                            <Link href={`/repo?path=oj${p.id}/ai_reflection.md`} title={t(L.editOnRepo, locale)}>
                              <Badge className="bg-green-500/10 text-green-600 dark:text-green-400 font-medium cursor-pointer hover:bg-green-500/20 transition-colors">
                                <Check className="size-3" />
                                {t(L.syncedRefl, locale)}
                              </Badge>
                            </Link>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <DifficultyStars value={p.difficulty} />
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex flex-wrap gap-2">
                          {p.learningLog && (
                            <Button
                              asChild
                              size="sm"
                              className="h-8 rounded-full text-xs font-medium"
                            >
                              <Link href={`/make/submission?problem=${p.id}`}>
                                {t(L.submissionBtn, locale)}
                              </Link>
                            </Button>
                          )}
                          <Button
                            asChild
                            size="sm"
                            variant="outline"
                            className="h-8 rounded-full text-xs font-medium text-muted-foreground hover:text-foreground"
                          >
                            <Link href={`/make/reflection?problem=${p.id}`}>
                              {t(L.reflectionBtn, locale)}
                            </Link>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
        <p className="px-6 py-3 border-t text-xs text-muted-foreground">
          {t(L.llOnly, locale)}
        </p>
      </div>
    </main>
  );
}
