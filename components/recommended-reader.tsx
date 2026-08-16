"use client";

import { useEffect, useState, useRef } from "react";
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
  GripVertical,
  Columns2,
  PanelLeft,
  PanelRight,
  Terminal,
  Play,
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
import { QuizLaunchButton } from "@/components/quiz-launch-button";
import { CodeGrader } from "@/components/code-grader";
import { useLocale, t, type LText } from "@/lib/i18n";

const L: Record<string, LText> = {
  backToHub: { th: "กลับหน้ารวมโจทย์", en: "Hub" },
  problemOf: { th: "ข้อที่", en: "Problem" },
  of: { th: "จาก", en: "of" },
  tabProblem: { th: "โจทย์ & สรุปแนวคิด", en: "Problem & Notes" },
  tabCode: { th: "โค้ดเฉลย", en: "Solution" },
  makeSubmission: { th: "submission.md", en: "submission.md" },
  makeReflection: { th: "ai_reflection.md", en: "ai_reflection.md" },
  openIJudge: { th: "iJudge", en: "iJudge" },
  keyTechnique: { th: "เทคนิคสำคัญ", en: "Key Technique" },
  prev: { th: "ข้อก่อนหน้า", en: "Previous" },
  next: { th: "ข้อถัดไป", en: "Next" },
  noCodeFound: { th: "ยังไม่มีไฟล์ main.py สำหรับข้อนี้", en: "No main.py found for this problem." },
  markFinished: { th: "ผ่านแล้ว", en: "Finished" },
  markInProgress: { th: "กำลังฝึก", en: "In Progress" },
  inRepo: { th: "GitHub", en: "GitHub" },
  browseRepo: { th: "Repo Editor", en: "Repo Editor" },
  viewSplit: { th: "แบ่ง 2 ฝั่ง", en: "Split" },
  viewProblemOnly: { th: "โจทย์เต็ม", en: "Problem" },
  viewGraderOnly: { th: "ตรวจโค้ด", en: "Grader" },
  dragToResize: { th: "ลากเพื่อปรับขนาด (ดับเบิลคลิกเพื่อรีเซ็ต 50:50)", en: "Drag to resize (double-click to reset 50:50)" },
  mobileTabProblem: { th: "โจทย์ & คำอธิบาย", en: "Problem & Notes" },
  mobileTabGrader: { th: "เขียนโค้ด & ตรวจสอบ", en: "Code & Grader" },
  goToGrader: { th: "ไปที่ตัวตรวจโค้ด", en: "Open Code Grader" },
  goToProblem: { th: "ดูคำอธิบายโจทย์", en: "View Problem" },
};

type ViewMode = "split" | "problem" | "grader";

export function RecommendedReader({ problem }: { problem: RecommendedProblemDetail }) {
  const { locale } = useLocale();
  const gh = useGithub();

  // Tab inside Problem pane
  const [activeTab, setActiveTab] = useState<"md" | "code">("md");

  // Status & local storage
  const [statuses, setStatuses] = useState<Record<number, "passed" | "in_progress">>({});

  // Splitter & View Layout states
  const [viewMode, setViewMode] = useState<ViewMode>("split");
  const [splitRatio, setSplitRatio] = useState<number>(50); // percentage for left panel (25 - 75)
  const [isDragging, setIsDragging] = useState(false);
  const [mobileTab, setMobileTab] = useState<"problem" | "grader">("problem");

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration from localStorage after mount (SSR-safe)
    setStatuses(getStoredProblemStatuses());

    const savedRatio = localStorage.getItem("ihelp-recommended-split-ratio-v1");
    if (savedRatio) {
      const parsed = parseFloat(savedRatio);
      if (!isNaN(parsed) && parsed >= 25 && parsed <= 75) {
        setSplitRatio(parsed);
      }
    }

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

  // Pointer drag events for splitter
  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    setIsDragging(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const rawX = e.clientX - rect.left;
    const rawRatio = (rawX / rect.width) * 100;
    const clamped = Math.max(25, Math.min(75, rawRatio));
    setSplitRatio(clamped);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
    localStorage.setItem("ihelp-recommended-split-ratio-v1", String(splitRatio));
  };

  const handleResetSplit = () => {
    setSplitRatio(50);
    localStorage.setItem("ihelp-recommended-split-ratio-v1", "50");
  };

  const setRatioPreset = (ratio: number) => {
    setViewMode("split");
    setSplitRatio(ratio);
    localStorage.setItem("ihelp-recommended-split-ratio-v1", String(ratio));
  };

  const inRepo = Boolean(gh.status[problem.id]?.recommended?.inRepo);
  const progressPercent = ((problem.index + 1) / problem.total) * 100;

  return (
    <div className="flex-1 min-h-0 flex flex-col overflow-hidden w-full max-w-[1920px] mx-auto px-2 sm:px-4 md:px-6 py-1.5 sm:py-2.5">
      {/* Top Header & Layout Switcher Bar */}
      <div className="shrink-0 mb-1.5 sm:mb-2 flex items-center justify-between gap-1.5 sm:gap-2">
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
          <Link
            href="/recommended"
            className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-primary transition-colors bg-muted/30 px-2.5 py-1 rounded-full border shrink-0"
          >
            <LayoutGrid className="size-3.5" />
            <span>{t(L.backToHub, locale)}</span>
          </Link>
          <span className="font-mono text-[11px] sm:text-xs text-muted-foreground tabular-nums truncate">
            OJ {problem.id} · {problem.index + 1}/{problem.total}
          </span>
        </div>

        {/* View Mode & Split Presets Controls (Desktop md+) */}
        <div className="hidden md:flex items-center gap-2">
          <div className="flex items-center rounded-full border bg-muted/30 p-0.5 text-xs">
            <button
              type="button"
              onClick={() => setViewMode("split")}
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                viewMode === "split"
                  ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title={t(L.viewSplit, locale)}
            >
              <Columns2 className="size-3.5" />
              <span>{t(L.viewSplit, locale)}</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("problem")}
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                viewMode === "problem"
                  ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title={t(L.viewProblemOnly, locale)}
            >
              <PanelLeft className="size-3.5" />
              <span>{t(L.viewProblemOnly, locale)}</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("grader")}
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                viewMode === "grader"
                  ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title={t(L.viewGraderOnly, locale)}
            >
              <PanelRight className="size-3.5" />
              <span>{t(L.viewGraderOnly, locale)}</span>
            </button>
          </div>

          {viewMode === "split" && (
            <div className="flex items-center gap-1 text-[11px] font-mono text-muted-foreground border bg-muted/20 px-2 py-0.5 rounded-full">
              <button
                type="button"
                onClick={() => setRatioPreset(50)}
                className={`px-1.5 py-0.5 rounded hover:bg-muted transition-colors cursor-pointer ${
                  Math.round(splitRatio) === 50 ? "font-bold text-primary" : ""
                }`}
                title="50% / 50% split"
              >
                50:50
              </button>
              <span>·</span>
              <button
                type="button"
                onClick={() => setRatioPreset(60)}
                className={`px-1.5 py-0.5 rounded hover:bg-muted transition-colors cursor-pointer ${
                  Math.round(splitRatio) === 60 ? "font-bold text-primary" : ""
                }`}
                title="60% Problem, 40% Grader"
              >
                60:40
              </button>
              <span>·</span>
              <button
                type="button"
                onClick={() => setRatioPreset(40)}
                className={`px-1.5 py-0.5 rounded hover:bg-muted transition-colors cursor-pointer ${
                  Math.round(splitRatio) === 40 ? "font-bold text-primary" : ""
                }`}
                title="40% Problem, 60% Grader"
              >
                40:60
              </button>
            </div>
          )}
        </div>

        {/* Prev / Next Shortcuts */}
        <div className="flex items-center gap-1 shrink-0">
          {problem.prev && (
            <Button asChild size="sm" variant="outline" className="h-6.5 sm:h-7 text-[11px] sm:text-xs rounded-full px-2">
              <Link href={`/recommended/${problem.prev.slug}`} title={problem.prev.cleanName}>
                <ArrowLeft className="size-3 text-primary" />
                <span className="hidden sm:inline">OJ {problem.prev.id}</span>
              </Link>
            </Button>
          )}
          {problem.next && (
            <Button asChild size="sm" variant="outline" className="h-6.5 sm:h-7 text-[11px] sm:text-xs rounded-full px-2">
              <Link href={`/recommended/${problem.next.slug}`} title={problem.next.cleanName}>
                <span className="hidden sm:inline">OJ {problem.next.id}</span>
                <ArrowRight className="size-3 text-primary" />
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Reading Progress Line */}
      <div className="shrink-0 mb-1.5 sm:mb-2 h-0.5 w-full rounded-full bg-border overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Mobile Tab Switcher (< md) */}
      <div className="shrink-0 flex md:hidden mb-2 rounded-xl border bg-muted/40 p-1 text-xs shadow-xs">
        <button
          type="button"
          onClick={() => setMobileTab("problem")}
          className={`flex-1 py-1.5 rounded-lg font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            mobileTab === "problem"
              ? "bg-background text-primary font-bold shadow-xs border"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <FileText className="size-3.5" />
          <span>{t(L.mobileTabProblem, locale)}</span>
        </button>
        <button
          type="button"
          onClick={() => setMobileTab("grader")}
          className={`flex-1 py-1.5 rounded-lg font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            mobileTab === "grader"
              ? "bg-background text-emerald-600 dark:text-emerald-400 font-bold shadow-xs border"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Terminal className="size-3.5" />
          <span>{t(L.mobileTabGrader, locale)}</span>
        </button>
      </div>

      {/* Main Splitter Workspace */}
      <div
        ref={containerRef}
        onPointerMove={isDragging ? handlePointerMove : undefined}
        onPointerUp={isDragging ? handlePointerUp : undefined}
        style={{
          ["--split-ratio" as string]: `${splitRatio}%`,
          ["--split-ratio-right" as string]: `${100 - splitRatio}%`,
        }}
        className={`flex-1 min-h-0 flex flex-col md:flex-row w-full overflow-hidden select-auto ${
          isDragging ? "select-none cursor-col-resize" : ""
        }`}
      >
        {/* ======================================================== */}
        {/* LEFT PANEL: problem.md, concept, takeaways, and solution */}
        {/* ======================================================== */}
        <div
          className={`h-full flex-col min-w-0 overflow-hidden w-full ${
            viewMode === "grader" ? "hidden md:hidden" : "flex"
          } ${
            mobileTab === "grader" ? "hidden md:flex" : "flex"
          } ${
            viewMode === "split"
              ? "md:[width:var(--split-ratio)]"
              : viewMode === "problem"
              ? "md:w-full"
              : "md:w-0 md:hidden"
          }`}
        >
          <article className="h-full flex flex-col overflow-hidden rounded-2xl border bg-card shadow-xs w-full">
            {/* Header section */}
            <div className="shrink-0 border-b bg-muted/30 p-2.5 sm:p-4 lg:p-5">
              <div className="flex flex-wrap items-center justify-between gap-1.5 sm:gap-2">
                <div className="flex flex-wrap items-center gap-1 sm:gap-1.5">
                  <span className="rounded-full border bg-muted px-2 sm:px-2.5 py-0.5 font-mono text-[11px] sm:text-xs font-bold text-primary">
                    OJ {problem.id}
                  </span>

                  {/* Status Toggle Button */}
                  <button
                    type="button"
                    onClick={handleToggleStatus}
                    className={`inline-flex items-center gap-1 rounded-full px-2 sm:px-2.5 py-0.5 text-[10px] sm:text-[11px] font-semibold transition-all hover:opacity-90 cursor-pointer shadow-none ${
                      effectiveStatus === "passed"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground border"
                    }`}
                    title="Click to toggle status"
                  >
                    {effectiveStatus === "passed" ? (
                      <>
                        <CheckCircle2 className="size-2.5 sm:size-3" />
                        <span>{t(L.markFinished, locale)}</span>
                      </>
                    ) : (
                      <>
                        <Clock className="size-2.5 sm:size-3" />
                        <span>{t(L.markInProgress, locale)}</span>
                      </>
                    )}
                  </button>

                  {inRepo && (
                    <Badge className="rounded-full bg-muted text-foreground border text-[9px] sm:text-[10px] font-medium px-1.5 sm:px-2 py-0.5 shadow-none">
                      <FolderGit2 className="mr-0.5 size-2.5 text-primary" />
                      {t(L.inRepo, locale)}
                    </Badge>
                  )}

                  {problem.learningLog && (
                    <Badge className="rounded-full bg-primary text-primary-foreground text-[9px] sm:text-[10px] font-medium px-1.5 sm:px-2 py-0.5 shadow-none">
                      <Flame className="mr-0.5 size-2.5" />
                      Learning Log
                    </Badge>
                  )}

                  <div className="flex items-center gap-0.5 ml-0.5">
                    {problem.difficulty > 0 ? (
                      Array.from({ length: problem.difficulty }).map((_, i) => (
                        <Star key={i} className="size-2.5 sm:size-3 fill-amber-400 text-amber-400" />
                      ))
                    ) : (
                      <Star className="size-2.5 sm:size-3 text-muted-foreground/30" />
                    )}
                  </div>
                </div>

                {/* External Actions */}
                <div className="flex items-center gap-1">
                  {inRepo && (
                    <Button asChild size="sm" variant="outline" className="h-6 text-[10px] sm:text-[11px] gap-1 rounded-full border-primary/30 text-primary px-2">
                      <Link href={`/repo?file=recommended/${problem.folderName}/problem.md`}>
                        <FolderGit2 className="size-2.5" />
                        <span className="hidden sm:inline">{t(L.browseRepo, locale)}</span>
                      </Link>
                    </Button>
                  )}
                  <Button asChild size="sm" variant="outline" className="h-6 text-[10px] sm:text-[11px] gap-1 rounded-full px-2">
                    <a href={problem.url} target="_blank" rel="noopener noreferrer">
                      <span>{t(L.openIJudge, locale)}</span>
                      <ExternalLink className="size-2.5" />
                    </a>
                  </Button>
                </div>
              </div>

              <h1 className="mt-1.5 sm:mt-2 text-sm sm:text-lg font-bold tracking-tight text-foreground truncate">
                {problem.cleanName}
              </h1>

              {problem.technique && (
                <div className="mt-1 sm:mt-1.5 inline-flex flex-wrap items-center gap-1 sm:gap-1.5 rounded-lg sm:rounded-full border bg-muted/40 px-2 sm:px-2.5 py-0.5 text-[10px] sm:text-[11px] font-medium text-foreground max-w-full leading-relaxed">
                  <Code2 className="size-3 text-primary shrink-0" />
                  <span className="break-words">
                    <strong className="text-primary font-semibold">{t(L.keyTechnique, locale)}:</strong>{" "}
                    {problem.technique}
                  </span>
                </div>
              )}

              {/* Stats Bar */}
              {problem.stats && (
                <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-[10px] sm:text-[11px] font-mono text-muted-foreground">
                  <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.2 border text-[10px]">
                    <span className="font-bold text-primary">{problem.stats.percentage}</span>
                    <span>{locale === "th" ? "ผ่าน" : "pass"} ({problem.stats.passed}/{problem.stats.attempt})</span>
                  </span>
                  {problem.stats.expireDate && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-muted/50 px-2 py-0.2 border text-muted-foreground text-[10px]">
                      <Clock className="size-2.5 text-primary shrink-0" />
                      <span>{locale === "th" ? "กำหนดส่ง:" : "Due:"} {problem.stats.expireDate}</span>
                    </span>
                  )}
                </div>
              )}

              {/* Tab Switcher: Problem vs Solution */}
              <div className="mt-2 flex items-center justify-between border-t pt-1.5 sm:pt-2">
                <div className="flex rounded-full border bg-background p-0.5 text-xs font-medium">
                  <button
                    type="button"
                    onClick={() => setActiveTab("md")}
                    className={`flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] sm:text-xs transition-colors cursor-pointer ${
                      activeTab === "md"
                        ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <FileText className="size-3" />
                    <span>{t(L.tabProblem, locale)}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("code")}
                    className={`flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] sm:text-xs transition-colors cursor-pointer ${
                      activeTab === "code"
                        ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Code2 className="size-3" />
                    <span>{t(L.tabCode, locale)}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Scrollable Problem Body */}
            <div className="flex-1 min-h-0 overflow-y-auto p-3 sm:p-5 lg:p-6 overscroll-contain">
              {activeTab === "md" ? (
                <div className="prose prose-xs sm:prose-sm dark:prose-invert max-w-none">
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
                    <div className="rounded-2xl border border-dashed p-6 text-center text-xs text-muted-foreground">
                      {t(L.noCodeFound, locale)}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer actions inside problem panel */}
            <div className="shrink-0 border-t bg-muted/20 px-3 py-2 flex flex-wrap items-center justify-between gap-1.5">
              <div className="flex flex-wrap items-center gap-1.5">
                {problem.learningLog && (
                  <Button asChild size="sm" variant="default" className="h-6 text-[10px] sm:text-[11px] rounded-full px-2">
                    <Link href={`/make/submission?id=${problem.id}`}>
                      {t(L.makeSubmission, locale)}
                    </Link>
                  </Button>
                )}
                <Button asChild size="sm" variant="outline" className="h-6 text-[10px] sm:text-[11px] rounded-full px-2">
                  <Link href={`/make/reflection?id=${problem.id}`}>
                    {t(L.makeReflection, locale)}
                  </Link>
                </Button>
                <QuizLaunchButton
                  problemId={problem.id}
                  problemName={problem.cleanName}
                  nextSlug={problem.next?.slug}
                  nextName={problem.next?.cleanName}
                  variant="outline"
                  size="sm"
                  className="rounded-full h-6 text-[10px] sm:text-[11px] px-2"
                />
                <Button
                  type="button"
                  onClick={() => setMobileTab("grader")}
                  size="sm"
                  variant="secondary"
                  className="md:hidden rounded-full h-6 text-[10px] gap-1 px-2.5 cursor-pointer font-medium border"
                >
                  <Play className="size-2.5 fill-current text-primary" />
                  <span>{t(L.goToGrader, locale)}</span>
                </Button>
              </div>

              <span className="font-mono text-[9px] text-muted-foreground truncate hidden sm:inline">
                {problem.folderName}/problem.md
              </span>
            </div>
          </article>
        </div>

        {/* ======================================================== */}
        {/* DRAGGABLE SPLITTER DIVIDER (Desktop only)                */}
        {/* ======================================================== */}
        {viewMode === "split" && (
          <div
            onPointerDown={handlePointerDown}
            onDoubleClick={handleResetSplit}
            className="hidden md:flex items-center justify-center w-3 shrink-0 cursor-col-resize group relative select-none"
            title={t(L.dragToResize, locale)}
          >
            {/* Hit area line */}
            <div
              className={`w-1 h-full rounded-full transition-all duration-150 ${
                isDragging
                  ? "bg-primary w-1.5 shadow-sm"
                  : "bg-border group-hover:bg-primary/70 group-hover:w-1.5"
              }`}
            />
            {/* Grip Icon */}
            <div
              className={`absolute top-1/2 -translate-y-1/2 rounded-full border bg-card p-1 shadow-xs transition-transform ${
                isDragging ? "scale-110 border-primary text-primary" : "text-muted-foreground group-hover:text-foreground"
              }`}
            >
              <GripVertical className="size-3.5" />
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* RIGHT PANEL: Code Grader with Expected Input / Output    */}
        {/* ======================================================== */}
        <div
          className={`h-full flex-col min-w-0 overflow-hidden w-full ${
            viewMode === "problem" ? "hidden md:hidden" : "flex"
          } ${
            mobileTab === "problem" ? "hidden md:flex" : "flex"
          } ${
            viewMode === "split"
              ? "md:[width:var(--split-ratio-right)]"
              : viewMode === "grader"
              ? "md:w-full"
              : "md:w-0 md:hidden"
          }`}
        >
          <div className="h-full flex-1 min-h-0 overflow-y-auto overscroll-contain pr-0.5 sm:pr-1">
            {/* Mobile back to problem shortcut button */}
            <div className="md:hidden mb-2 flex items-center justify-between">
              <Button
                type="button"
                onClick={() => setMobileTab("problem")}
                variant="ghost"
                size="sm"
                className="h-6 text-[10px] gap-1 px-2 rounded-full text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <ArrowLeft className="size-2.5 text-primary" />
                <span>{t(L.goToProblem, locale)}</span>
              </Button>
            </div>

            <CodeGrader
              problemId={problem.id}
              problemName={problem.cleanName}
              initialCode={problem.pythonCode ?? undefined}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
