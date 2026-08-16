"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  ExternalLink,
  Code2,
  FileText,
  CheckCircle2,
  Clock,
  Copy,
  Check,
  Star,
  Flame,
  LayoutGrid,
} from "lucide-react";
import type { RecommendedProblemDetail } from "@/lib/recommended";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MdView } from "@/components/md-view";
import { useLocale, t, type LText } from "@/lib/i18n";

const L: Record<string, LText> = {
  backToHub: { th: "กลับหน้ารวมโจทย์แนะนำ", en: "Back to Recommended Hub" },
  problemOf: { th: "ข้อที่", en: "Problem" },
  of: { th: "จาก", en: "of" },
  tabProblem: { th: "โจทย์ & สรุปแนวคิด (problem.md)", en: "Problem & Notes (problem.md)" },
  tabCode: { th: "โค้ด Python (main.py)", en: "Python Solution (main.py)" },
  copyCode: { th: "คัดลอกโค้ด", en: "Copy Code" },
  copied: { th: "คัดลอกแล้ว!", en: "Copied!" },
  makeSubmission: { th: "สร้าง submission.md", en: "Make submission.md" },
  makeReflection: { th: "สร้าง ai_reflection.md", en: "Make ai_reflection.md" },
  openIJudge: { th: "เปิดใน iJudge", en: "Open on iJudge" },
  keyTechnique: { th: "เทคนิคสำคัญ:", en: "Key Technique:" },
  prev: { th: "ข้อก่อนหน้า", en: "Previous" },
  next: { th: "ข้อถัดไป", en: "Next" },
  noCodeFound: { th: "ยังไม่มีไฟล์ main.py สำหรับข้อนี้", en: "No main.py found for this problem." },
};

export function RecommendedReader({ problem }: { problem: RecommendedProblemDetail }) {
  const { locale } = useLocale();
  const [activeTab, setActiveTab] = useState<"md" | "code">("md");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [problem.id]);

  function handleCopy() {
    if (!problem.pythonCode) return;
    navigator.clipboard.writeText(problem.pythonCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const progressPercent = ((problem.index + 1) / problem.total) * 100;

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 w-full">
      {/* Top Bar navigation */}
      <div className="mb-4 flex items-center justify-between text-sm">
        <Link
          href="/recommended"
          className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors"
        >
          <LayoutGrid className="size-4" />
          {t(L.backToHub, locale)}
        </Link>
        <span className="font-mono text-xs text-muted-foreground tabular-nums">
          {t(L.problemOf, locale)} {problem.index + 1} {t(L.of, locale)} {problem.total}
        </span>
      </div>

      {/* Reading Progress Indicator */}
      <div className="mb-6 h-1 w-full rounded-full bg-border overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Problem Main Container */}
      <article className="overflow-hidden rounded-3xl border bg-card shadow-sm">
        {/* Container Header */}
        <div className="border-b bg-muted/30 p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-lg bg-primary/10 px-2.5 py-1 font-mono text-xs font-bold text-primary">
                OJ {problem.id}
              </span>

              {problem.status === "passed" ? (
                <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-xs font-semibold">
                  <CheckCircle2 className="mr-1 size-3.5" />
                  Passed
                </Badge>
              ) : (
                <Badge variant="outline" className="text-amber-600 dark:text-amber-400 border-amber-500/30 text-xs">
                  <Clock className="mr-1 size-3.5" />
                  In Progress
                </Badge>
              )}

              {problem.learningLog && (
                <Badge variant="secondary" className="bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-medium">
                  <Flame className="mr-1 size-3" />
                  Learning Log
                </Badge>
              )}

              {problem.difficulty > 0 && (
                <div className="flex items-center gap-0.5 ml-1 text-amber-500">
                  {Array.from({ length: problem.difficulty }).map((_, i) => (
                    <Star key={i} className="size-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              )}
            </div>

            {/* External Links & Fast Actions */}
            <div className="flex items-center gap-2">
              <Button asChild size="sm" variant="outline" className="h-8 text-xs gap-1">
                <a href={problem.url} target="_blank" rel="noopener noreferrer">
                  <span>{t(L.openIJudge, locale)}</span>
                  <ExternalLink className="size-3.5" />
                </a>
              </Button>
            </div>
          </div>

          <h1 className="mt-4 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {problem.cleanName}
          </h1>

          {problem.technique && (
            <div className="mt-3 inline-flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/[0.05] px-3.5 py-2 text-xs font-medium text-foreground">
              <Sparkles className="size-4 text-primary shrink-0" />
              <span>
                <strong className="text-primary font-semibold">{t(L.keyTechnique, locale)}</strong>{" "}
                {problem.technique}
              </span>
            </div>
          )}

          {/* Tab Switcher */}
          <div className="mt-6 flex items-center justify-between border-t pt-4">
            <div className="flex rounded-xl border bg-background p-1 text-xs font-medium">
              <button
                onClick={() => setActiveTab("md")}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-colors ${
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
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-colors ${
                  activeTab === "code"
                    ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Code2 className="size-3.5" />
                {t(L.tabCode, locale)}
              </button>
            </div>

            {activeTab === "code" && problem.pythonCode && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleCopy}
                className="h-8 text-xs gap-1.5 border-border"
              >
                {copied ? (
                  <>
                    <Check className="size-3.5 text-emerald-500" />
                    <span className="text-emerald-500 font-semibold">{t(L.copied, locale)}</span>
                  </>
                ) : (
                  <>
                    <Copy className="size-3.5 text-muted-foreground" />
                    <span>{t(L.copyCode, locale)}</span>
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-10">
          {activeTab === "md" ? (
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <MdView markdown={problem.markdown} />
            </div>
          ) : (
            <div>
              {problem.pythonCode ? (
                <div className="overflow-hidden rounded-2xl border bg-[#0d1117] text-zinc-100 shadow-inner">
                  <div className="flex items-center justify-between border-b border-zinc-800 bg-[#161b22] px-4 py-2.5">
                    <span className="font-mono text-xs text-zinc-400">main.py</span>
                    <span className="font-mono text-[11px] text-zinc-500">Python 3</span>
                  </div>
                  <pre className="overflow-x-auto p-4 font-mono text-sm leading-relaxed text-zinc-200">
                    <code>{problem.pythonCode}</code>
                  </pre>
                </div>
              ) : (
                <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
                  {t(L.noCodeFound, locale)}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Quick Action Footer inside Card */}
        <div className="border-t bg-muted/20 px-6 py-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {problem.learningLog && (
              <Button asChild size="sm" variant="default" className="h-8 text-xs">
                <Link href={`/make/submission?id=${problem.id}`}>
                  {t(L.makeSubmission, locale)}
                </Link>
              </Button>
            )}
            <Button asChild size="sm" variant="outline" className="h-8 text-xs">
              <Link href={`/make/reflection?id=${problem.id}`}>
                {t(L.makeReflection, locale)}
              </Link>
            </Button>
          </div>

          <span className="font-mono text-xs text-muted-foreground">
            {problem.folderName}/problem.md
          </span>
        </div>
      </article>

      {/* Previous / Next Pagination Navigation */}
      <div className="mt-6 flex items-stretch justify-between gap-3">
        {problem.prev ? (
          <Button asChild variant="outline" className="h-auto max-w-[48%] py-3 justify-start rounded-2xl">
            <Link href={`/recommended/${problem.prev.slug}`}>
              <ArrowLeft className="size-4 shrink-0 text-primary" />
              <span className="text-left overflow-hidden">
                <span className="block text-[10px] uppercase tracking-wide text-muted-foreground">
                  {t(L.prev, locale)} · OJ {problem.prev.id}
                </span>
                <span className="block text-sm font-medium truncate">{problem.prev.cleanName}</span>
              </span>
            </Link>
          </Button>
        ) : (
          <span />
        )}

        {problem.next ? (
          <Button asChild variant="outline" className="h-auto max-w-[48%] py-3 justify-end ml-auto rounded-2xl">
            <Link href={`/recommended/${problem.next.slug}`}>
              <span className="text-right overflow-hidden">
                <span className="block text-[10px] uppercase tracking-wide text-muted-foreground">
                  {t(L.next, locale)} · OJ {problem.next.id}
                </span>
                <span className="block text-sm font-medium truncate">{problem.next.cleanName}</span>
              </span>
              <ArrowRight className="size-4 shrink-0 text-primary" />
            </Link>
          </Button>
        ) : (
          <span />
        )}
      </div>
    </main>
  );
}
