"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Code2,
  FileText,
  Star,
  Flame,
  LayoutGrid,
  CheckCircle2,
  Clock,
  FolderGit2,
} from "lucide-react";
import type { RecommendedProblemDetail } from "@/lib/recommended";
import {
  getStoredProblemStatuses,
  setStoredProblemStatus,
  RECOMMENDED_STATUS_EVENT,
} from "@/lib/recommended-client";
import { useGithub } from "@/lib/github";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MdView } from "@/components/md-view";
import { PythonCodeViewer } from "@/components/python-code-viewer";
import { useLocale, t, type LText } from "@/lib/i18n";

const L: Record<string, LText> = {
  backToHub: { th: "กลับหน้ารวมโจทย์แนะนำ", en: "Back to Recommended Hub" },
  problemOf: { th: "ข้อที่", en: "Problem" },
  of: { th: "จาก", en: "of" },
  tabProblem: { th: "โจทย์ & สรุปแนวคิด (problem.md)", en: "Problem & Notes (problem.md)" },
  tabCode: { th: "โค้ด Python (main.py)", en: "Python Solution (main.py)" },
  makeSubmission: { th: "สร้าง submission.md", en: "Make submission.md" },
  makeReflection: { th: "สร้าง ai_reflection.md", en: "Make ai_reflection.md" },
  openIJudge: { th: "เปิดใน iJudge", en: "Open on iJudge" },
  keyTechnique: { th: "เทคนิคสำคัญ:", en: "Key Technique:" },
  prev: { th: "ข้อก่อนหน้า", en: "Previous" },
  next: { th: "ข้อถัดไป", en: "Next" },
  noCodeFound: { th: "ยังไม่มีไฟล์ main.py สำหรับข้อนี้", en: "No main.py found for this problem." },
  markFinished: { th: "ผ่านแล้ว (Finished)", en: "Finished" },
  markInProgress: { th: "กำลังฝึก (In Progress)", en: "In Progress" },
  inRepo: { th: "ซิงก์ใน GitHub Repo แล้ว", en: "Synced in GitHub Repo" },
  browseRepo: { th: "เปิดใน Repo Editor", en: "Open in Repo Editor" },
};

export function RecommendedReader({ problem }: { problem: RecommendedProblemDetail }) {
  const { locale } = useLocale();
  const gh = useGithub();
  const [activeTab, setActiveTab] = useState<"md" | "code">("md");
  const [statuses, setStatuses] = useState<Record<number, "passed" | "in_progress">>({});

  useEffect(() => {
    window.scrollTo({ top: 0 });
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration from localStorage after mount (SSR-safe)
    setStatuses(getStoredProblemStatuses());

    const update = () => {
      setStatuses(getStoredProblemStatuses());
    };
    window.addEventListener(RECOMMENDED_STATUS_EVENT, update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener(RECOMMENDED_STATUS_EVENT, update);
      window.removeEventListener("storage", update);
    };
  }, [problem.id]);

  const effectiveStatus = statuses[problem.id] || problem.status;

  function handleToggleStatus() {
    const next = effectiveStatus === "passed" ? "in_progress" : "passed";
    setStoredProblemStatus(problem.id, next);
  }

  const inRepo = Boolean(gh.status[problem.id]?.recommended?.inRepo);
  const progressPercent = ((problem.index + 1) / problem.total) * 100;

  return (
    <main className="mx-auto max-w-4xl px-3 sm:px-6 py-5 sm:py-8 w-full">
      {/* Top Bar navigation */}
      <div className="mb-3 sm:mb-4 flex items-center justify-between text-xs sm:text-sm">
        <Link
          href="/recommended"
          className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors font-medium"
        >
          <LayoutGrid className="size-3.5 sm:size-4" />
          {t(L.backToHub, locale)}
        </Link>
        <span className="font-mono text-[11px] sm:text-xs text-muted-foreground tabular-nums">
          {t(L.problemOf, locale)} {problem.index + 1} {t(L.of, locale)} {problem.total}
        </span>
      </div>

      {/* Reading Progress Indicator */}
      <div className="mb-4 sm:mb-6 h-1 w-full rounded-full bg-border overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Problem Main Container */}
      <article className="overflow-hidden rounded-3xl border bg-card shadow-sm">
        {/* Container Header */}
        <div className="border-b bg-muted/30 p-4 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-2.5 sm:gap-3">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="rounded-full border bg-muted px-2.5 sm:px-3 py-0.5 sm:py-1 font-mono text-xs font-bold text-primary">
                OJ {problem.id}
              </span>

              {/* Status Toggle Button */}
              <button
                onClick={handleToggleStatus}
                className={`inline-flex items-center gap-1 sm:gap-1.5 rounded-full px-2.5 sm:px-3 py-0.5 sm:py-1 text-[11px] sm:text-xs font-semibold transition-all hover:opacity-90 cursor-pointer shadow-none ${
                  effectiveStatus === "passed"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground border"
                }`}
                title="Click to toggle status"
              >
                {effectiveStatus === "passed" ? (
                  <>
                    <CheckCircle2 className="size-3 sm:size-3.5" />
                    <span>{t(L.markFinished, locale)}</span>
                  </>
                ) : (
                  <>
                    <Clock className="size-3 sm:size-3.5" />
                    <span>{t(L.markInProgress, locale)}</span>
                  </>
                )}
              </button>

              {inRepo && (
                <Badge className="rounded-full bg-muted text-foreground border text-[10px] sm:text-xs font-medium px-2 sm:px-2.5 py-0.5 shadow-none">
                  <FolderGit2 className="mr-1 size-2.5 sm:size-3 text-primary" />
                  {t(L.inRepo, locale)}
                </Badge>
              )}

              {problem.learningLog && (
                <Badge className="rounded-full bg-primary text-primary-foreground text-[10px] sm:text-xs font-medium px-2 sm:px-2.5 py-0.5 shadow-none">
                  <Flame className="mr-1 size-2.5 sm:size-3" />
                  Learning Log
                </Badge>
              )}

              <div className="flex items-center gap-0.5 ml-0.5 sm:ml-1">
                {problem.difficulty > 0 ? (
                  Array.from({ length: problem.difficulty }).map((_, i) => (
                    <Star key={i} className="size-3 sm:size-3.5 fill-amber-400 text-amber-400" />
                  ))
                ) : (
                  <Star className="size-3 sm:size-3.5 text-muted-foreground/30" />
                )}
              </div>
            </div>

            {/* External Links & Fast Actions */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {inRepo && (
                <Button asChild size="sm" variant="outline" className="h-7.5 sm:h-8 text-xs gap-1 rounded-full border-primary/30 text-primary">
                  <Link href={`/repo?file=recommended/${problem.folderName}/problem.md`}>
                    <FolderGit2 className="size-3 sm:size-3.5" />
                    <span className="hidden sm:inline">{t(L.browseRepo, locale)}</span>
                  </Link>
                </Button>
              )}
              <Button asChild size="sm" variant="outline" className="h-7.5 sm:h-8 text-xs gap-1 rounded-full">
                <a href={problem.url} target="_blank" rel="noopener noreferrer">
                  <span>{t(L.openIJudge, locale)}</span>
                  <ExternalLink className="size-3 sm:size-3.5" />
                </a>
              </Button>
            </div>
          </div>

          <h1 className="mt-3 sm:mt-4 text-xl font-bold tracking-tight text-foreground sm:text-2xl md:text-3xl">
            {problem.cleanName}
          </h1>

          {problem.technique && (
            <div className="mt-2.5 sm:mt-3 inline-flex flex-wrap items-center gap-1.5 sm:gap-2 rounded-2xl sm:rounded-full border bg-muted/40 px-3 sm:px-4 py-1.5 text-xs font-medium text-foreground max-w-full leading-relaxed">
              <Code2 className="size-3.5 sm:size-4 text-primary shrink-0" />
              <span className="break-words">
                <strong className="text-primary font-semibold">{t(L.keyTechnique, locale)}:</strong>{" "}
                {problem.technique}
              </span>
            </div>
          )}

          {/* Stats Bar: Pass rate & Deadline */}
          {problem.stats && (
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-mono text-muted-foreground">
              <span className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 border">
                <span className="font-bold text-primary">{problem.stats.percentage}</span>
                <span>{locale === "th" ? "ผ่านแล้ว" : "pass rate"} ({problem.stats.passed}/{problem.stats.attempt})</span>
              </span>
              {problem.stats.expireDate && (
                <span className="inline-flex items-center gap-1 rounded-full bg-muted/50 px-3 py-1 border text-muted-foreground">
                  <Clock className="size-3 text-primary shrink-0" />
                  <span>{locale === "th" ? "กำหนดส่ง:" : "Deadline:"} {problem.stats.expireDate}</span>
                </span>
              )}
            </div>
          )}

          {/* Tab Switcher */}
          <div className="mt-4 sm:mt-6 flex items-center justify-between border-t pt-3 sm:pt-4">
            <div className="flex rounded-full border bg-background p-1 text-xs font-medium">
              <button
                onClick={() => setActiveTab("md")}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1 sm:py-1.5 transition-colors ${
                  activeTab === "md"
                    ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <FileText className="size-3.5" />
                {t(L.tabProblem, locale)}
              </button>
              <button
                onClick={() => setActiveTab("code")}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1 sm:py-1.5 transition-colors ${
                  activeTab === "code"
                    ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Code2 className="size-3.5" />
                {t(L.tabCode, locale)}
              </button>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-8 md:p-10">
          {activeTab === "md" ? (
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <MdView
                markdown={
                  locale === "th" && problem.markdownTh
                    ? problem.markdownTh
                    : problem.markdown
                }
              />
            </div>
          ) : (
            <div>
              {problem.pythonCode ? (
                <PythonCodeViewer
                  code={problem.pythonCode}
                  problemId={problem.id}
                  problemName={problem.cleanName}
                  technique={problem.technique}
                  locale={locale}
                />
              ) : (
                <div className="rounded-2xl border border-dashed p-8 sm:p-10 text-center text-sm text-muted-foreground">
                  {t(L.noCodeFound, locale)}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Quick Action Footer inside Card */}
        <div className="border-t bg-muted/20 px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {problem.learningLog && (
              <Button asChild size="sm" variant="default" className="h-8 text-xs rounded-full">
                <Link href={`/make/submission?id=${problem.id}`}>
                  {t(L.makeSubmission, locale)}
                </Link>
              </Button>
            )}
            <Button asChild size="sm" variant="outline" className="h-8 text-xs rounded-full">
              <Link href={`/make/reflection?id=${problem.id}`}>
                {t(L.makeReflection, locale)}
              </Link>
            </Button>
          </div>

          <span className="font-mono text-[11px] sm:text-xs text-muted-foreground truncate">
            {problem.folderName}/problem.md
          </span>
        </div>
      </article>

      {/* Previous / Next Pagination Navigation */}
      <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row items-stretch sm:justify-between gap-2.5 sm:gap-3">
        {problem.prev ? (
          <Button asChild variant="outline" className="h-auto w-full sm:w-auto sm:max-w-[48%] p-3 justify-start rounded-2xl">
            <Link href={`/recommended/${problem.prev.slug}`}>
              <ArrowLeft className="size-4 shrink-0 text-primary" />
              <span className="text-left overflow-hidden min-w-0">
                <span className="block text-[10px] uppercase tracking-wide text-muted-foreground">
                  {t(L.prev, locale)} · OJ {problem.prev.id}
                </span>
                <span className="block text-xs sm:text-sm font-medium truncate">{problem.prev.cleanName}</span>
              </span>
            </Link>
          </Button>
        ) : (
          <span className="hidden sm:block" />
        )}

        {problem.next ? (
          <Button asChild variant="outline" className="h-auto w-full sm:w-auto sm:max-w-[48%] p-3 justify-end sm:ml-auto rounded-2xl">
            <Link href={`/recommended/${problem.next.slug}`}>
              <span className="text-right overflow-hidden min-w-0">
                <span className="block text-[10px] uppercase tracking-wide text-muted-foreground">
                  {t(L.next, locale)} · OJ {problem.next.id}
                </span>
                <span className="block text-xs sm:text-sm font-medium truncate">{problem.next.cleanName}</span>
              </span>
              <ArrowRight className="size-4 shrink-0 text-primary" />
            </Link>
          </Button>
        ) : (
          <span className="hidden sm:block" />
        )}
      </div>
    </main>
  );
}
