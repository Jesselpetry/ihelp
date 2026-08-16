"use client";

import { useState, useCallback, useRef, useMemo, useEffect } from "react";
import {
  Play,
  Loader2,
  Download,
  ChevronDown,
  ChevronRight,
  ShieldAlert,
  BookOpen,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  Terminal,
  Code2,
  ChevronsUpDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { ScoreString } from "@/components/score-string";
import { DiffView } from "@/components/diff-view";
import { useDraft } from "@/lib/draft";
import { useLocale, t, type LText } from "@/lib/i18n";
import { TEST_CASES } from "@/lib/testcases";
import type {
  CaseResult,
  CaseStatus,
  GradeReport,
  Pep8Violation,
  TestCase,
} from "@/lib/grader-types";

const L: Record<string, LText> = {
  title: { th: "ตรวจให้คะแนนโค้ด (Client-Side Grader)", en: "Client-Side Python Grader" },
  codeLabel: { th: "โค้ด Python ของคุณ", en: "Your Python Code" },
  codePlaceholder: {
    th: "# เขียนหรือวางโค้ด Python ตรงนี้ แล้วกด 'รันเทส' (หรือกด Ctrl+Enter)",
    en: "# Write or paste your Python code here, then click 'Run Tests' (or press Ctrl+Enter)",
  },
  starterComment: {
    th: "# โค้ดตัวอย่างอ้างอิง — แก้ไขหรือเขียนใหม่ได้ตามต้องการ",
    en: "# Reference starter code — edit or rewrite as needed",
  },
  run: { th: "รันเทสโค้ด", en: "Run Tests" },
  running: { th: "กำลังประมวลผล...", en: "Running..." },
  loadingEngine: { th: "กำลังโหลด Python engine (ครั้งแรกอาจใช้เวลาสักครู่)...", en: "Loading Python engine (first run may take a moment)..." },
  engineError: { th: "โหลด Python engine ไม่สำเร็จ ลองใหม่อีกครั้ง", en: "Failed to load Python engine. Please try again." },
  exportWorkspace: { th: "ส่งออก JSON", en: "Export JSON" },
  loadStarter: { th: "โหลดโค้ดตัวอย่าง", en: "Load Sample" },
  resetDraft: { th: "ล้างโค้ด", en: "Clear" },
  pep8Title: { th: "ผลตรวจสไตล์โค้ด (PEP-8 / PSCP)", en: "PEP-8 & PSCP Style Check" },
  pep8Clean: { th: "ไม่พบปัญหาสไตล์โค้ด โค้ดสวยงามตามมาตรฐาน!", en: "No style issues found. Clean code!" },
  pep8Note: {
    th: "ผลตรวจสไตล์โค้ดไม่ส่งผลต่อการผ่านเคส ใช้เพื่อปรับปรุงคุณภาพโค้ดเท่านั้น",
    en: "Style results never block test pass — shown for code quality improvement.",
  },
  testCasesTitle: { th: "ชุดเคสทดสอบ (Expected Input / Output)", en: "Test Cases (Expected Input / Output)" },
  official: { th: "ทางการ", en: "Official" },
  extra: { th: "เพิ่มเติม", en: "Extra" },
  stdin: { th: "อินพุต (stdin)", en: "Input (stdin)" },
  expectedOutput: { th: "ผลลัพธ์ที่คาดหวัง (Expected stdout)", en: "Expected Output (stdout)" },
  actualOutput: { th: "ผลลัพธ์ที่ได้จากโค้ดของคุณ (Actual stdout)", en: "Actual Output from Your Code" },
  showDiff: { th: "เปรียบเทียบความต่าง (Diff View)", en: "Inspect Output Diff" },
  hideDiff: { th: "ซ่อน Diff", en: "Hide Diff" },
  runtimeError: { th: "ข้อผิดพลาดขณะรัน (Runtime Error)", en: "Runtime Error" },
  duration: { th: "เวลา", en: "Duration" },
  noRunYet: {
    th: "ยังไม่ได้รันเทส — กด 'รันเทสโค้ด' หรือกด Ctrl+Enter",
    en: "No run yet — click 'Run Tests' or press Ctrl+Enter",
  },
  draftSaved: { th: "บันทึกร่างอัตโนมัติ (Auto-saved)", en: "Auto-saved locally" },
  whatThisTests: { th: "สิ่งที่ทดสอบ:", en: "Tests:" },
  copied: { th: "คัดลอกแล้ว", en: "Copied" },
  copy: { th: "คัดลอก", en: "Copy" },
  shortcutHint: { th: "Ctrl+Enter เพื่อรัน", en: "Ctrl+Enter to run" },
  notRun: { th: "ยังไม่ได้รัน", en: "Not run" },
  foldAll: { th: "พับทั้งหมด", en: "Fold All" },
  unfoldAll: { th: "ขยายทั้งหมด", en: "Unfold All" },
};

/** Small wrapper around the engine so integration is a one-line fix. */
async function ensurePyodideReady(onProgress: (status: "loading" | "ready" | "error") => void) {
  const { preloadPyodide } = await import("@/lib/pyodide-client");
  await preloadPyodide(onProgress);
}

async function runOneCase(
  code: string,
  stdin: string,
): Promise<{ stdout: string; error: string | null; durationMs: number; timedOut: boolean }> {
  const { runTestCase } = await import("@/lib/pyodide-client");
  return runTestCase(code, stdin, { timeoutMs: 5000 });
}

async function lintOne(code: string): Promise<Pep8Violation[]> {
  const [{ lintCode }, { translatePep8Violations, checkCustomRules }] = await Promise.all([
    import("@/lib/pyodide-client"),
    import("@/lib/pep8-rules"),
  ]);
  const raw = await lintCode(code);
  return [...translatePep8Violations(raw), ...checkCustomRules(code)];
}

function statusFromRun(
  tc: TestCase,
  run: { stdout: string; error: string | null; durationMs: number; timedOut: boolean },
): CaseResult {
  let status: CaseStatus;
  if (run.timedOut) {
    status = "T";
  } else if (run.error) {
    status = "E";
  } else if (run.stdout.replace(/\n$/, "") === tc.expected) {
    status = "P";
  } else {
    status = "-";
  }
  return {
    caseId: tc.id,
    status,
    actual: run.stdout.replace(/\n$/, ""),
    durationMs: run.durationMs,
    error: run.error ?? undefined,
  };
}

function downloadJson(fileName: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
}

function CopyBtn({ text, label }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const { locale } = useLocale();

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
      title={copied ? t(L.copied, locale) : (label ?? t(L.copy, locale))}
    >
      {copied ? <Check className="size-3 text-emerald-500" /> : <Copy className="size-3" />}
      <span>{copied ? t(L.copied, locale) : (label ?? t(L.copy, locale))}</span>
    </button>
  );
}

function TestCaseRow({
  tc,
  result,
  locale,
  isOpen,
  onToggle,
}: {
  tc: TestCase;
  result: CaseResult | undefined;
  locale: "th" | "en";
  isOpen: boolean;
  onToggle: () => void;
}) {
  const passed = result?.status === "P";
  const [diffOpen, setDiffOpen] = useState(Boolean(result && !passed));

  const badgeClass =
    result?.status === "P"
      ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
      : result?.status === "T"
      ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30"
      : result?.status === "E"
      ? "bg-rose-600/15 text-rose-600 dark:text-rose-400 border border-rose-600/30"
      : result?.status === "-"
      ? "bg-destructive/15 text-destructive border border-destructive/30"
      : "bg-muted text-muted-foreground border";

  const statusLabel =
    result?.status === "P"
      ? locale === "th" ? "ผ่าน" : "Passed"
      : result?.status === "T"
      ? locale === "th" ? "หมดเวลา" : "Timeout"
      : result?.status === "E"
      ? locale === "th" ? "Runtime Error" : "Runtime Error"
      : result?.status === "-"
      ? locale === "th" ? "คำตอบไม่ตรง" : "Wrong Answer"
      : t(L.notRun, locale);

  const stdinPreview = tc.stdin ? tc.stdin.replace(/\n/g, " ↵ ") : "empty";

  return (
    <div className="rounded-xl border bg-card overflow-hidden shadow-xs transition-colors">
      {/* Clickable Header bar (Toggles fold / unfold) */}
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-2 px-3 py-2 bg-muted/20 hover:bg-muted/40 transition-colors text-left cursor-pointer border-b"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {isOpen ? (
            <ChevronDown className="size-3.5 text-muted-foreground shrink-0" />
          ) : (
            <ChevronRight className="size-3.5 text-muted-foreground shrink-0" />
          )}

          <Badge className={`rounded-full px-2 py-0.2 font-mono text-[11px] shadow-none shrink-0 ${badgeClass}`}>
            {result?.status ?? "•"}
          </Badge>

          <span className="text-xs font-semibold text-foreground truncate">
            {t(tc.label, locale)}
          </span>

          <Badge variant="outline" className="rounded-full text-[9px] px-1.5 py-0 shrink-0 font-normal">
            {tc.official ? t(L.official, locale) : t(L.extra, locale)}
          </Badge>

          {!isOpen && (
            <span className="font-mono text-[10px] text-muted-foreground truncate hidden sm:inline max-w-[200px]">
              stdin: &quot;{stdinPreview}&quot;
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className={`text-[11px] font-medium ${passed ? "text-emerald-600 dark:text-emerald-400" : result ? "text-destructive" : "text-muted-foreground"}`}>
            {statusLabel}
          </span>
          {result && (
            <span className="text-[10px] font-mono text-muted-foreground hidden sm:inline">
              ({result.durationMs}ms)
            </span>
          )}
        </div>
      </button>

      {/* Unfolded Content (Visible when isOpen is true) */}
      {isOpen && (
        <div className="p-3 space-y-2.5 animate-in fade-in-50 duration-150">
          {tc.tests && (
            <p className="text-[11px] text-muted-foreground bg-muted/30 rounded-lg px-2.5 py-1 border">
              <strong className="text-foreground font-semibold">{t(L.whatThisTests, locale)}</strong> {t(tc.tests, locale)}
            </p>
          )}

          {/* Expected I/O Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {/* Stdin block */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                  <Terminal className="size-2.5 text-primary" />
                  {t(L.stdin, locale)}
                </span>
                <CopyBtn text={tc.stdin} />
              </div>
              <pre className="whitespace-pre rounded-lg bg-muted/40 px-2.5 py-1.5 font-mono text-xs text-foreground border overflow-x-auto min-h-[38px]">
                {tc.stdin || "(empty stdin)"}
              </pre>
            </div>

            {/* Expected Output block */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <Check className="size-2.5" />
                  {t(L.expectedOutput, locale)}
                </span>
                <CopyBtn text={tc.expected} />
              </div>
              <pre className="whitespace-pre rounded-lg bg-emerald-500/5 text-emerald-950 dark:text-emerald-200 border border-emerald-500/20 px-2.5 py-1.5 font-mono text-xs overflow-x-auto min-h-[38px]">
                {tc.expected}
              </pre>
            </div>
          </div>

          {/* Actual output & diff if result is available */}
          {result && (
            <div className="pt-2 border-t space-y-2">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                    <Code2 className="size-3 text-primary" />
                    {t(L.actualOutput, locale)}
                  </span>
                  {result.actual && <CopyBtn text={result.actual} />}
                </div>
                <pre className={`whitespace-pre rounded-lg px-2.5 py-1.5 font-mono text-xs border overflow-x-auto min-h-[38px] ${
                  passed
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                    : "bg-destructive/10 text-destructive border-destructive/30"
                }`}>
                  {result.actual || (result.error ? "(Runtime Error)" : "(empty output)")}
                </pre>
              </div>

              {result.error && (
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wide text-destructive">
                    {t(L.runtimeError, locale)}
                  </span>
                  <pre className="whitespace-pre rounded-lg bg-destructive/15 text-destructive p-2.5 font-mono text-xs overflow-x-auto border border-destructive/30">
                    {result.error}
                  </pre>
                </div>
              )}

              {!passed && result.actual && (
                <div>
                  <button
                    type="button"
                    onClick={() => setDiffOpen((o) => !o)}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline cursor-pointer"
                  >
                    {diffOpen ? <ChevronDown className="size-3" /> : <ChevronRight className="size-3" />}
                    {diffOpen ? t(L.hideDiff, locale) : t(L.showDiff, locale)}
                  </button>
                  {diffOpen && (
                    <div className="mt-1.5">
                      <DiffView expected={tc.expected} actual={result.actual} />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function CodeGrader({
  problemId,
  problemName,
  initialCode,
  compact = false,
}: {
  problemId: number;
  problemName: string;
  initialCode?: string;
  compact?: boolean;
}) {
  const { locale } = useLocale();
  const draftKey = `ihelp-grader-draft-v1-${problemId}`;

  const defaultStarter = initialCode
    ? `${t(L.starterComment, locale)}\n${initialCode}`
    : "";

  const [code, setCode] = useDraft<string>(draftKey, defaultStarter);
  const [engineStatus, setEngineStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [running, setRunning] = useState(false);
  const [report, setReport] = useState<GradeReport | null>(null);
  const runIdRef = useRef(0);

  const cases = useMemo(() => TEST_CASES[problemId] ?? [], [problemId]);

  // Per-testcase fold state: all folded by default (normally folded)
  const [openCases, setOpenCases] = useState<Record<string, boolean>>({});

  // Safeguard: if code somehow became [object Object], reset to clean starter string
  useEffect(() => {
    if (typeof code !== "string" || code === "[object Object]") {
      setCode(defaultStarter);
    }
  }, [code, defaultStarter, setCode]);

  const toggleCase = (id: string) => {
    setOpenCases((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const areAllOpen = useMemo(() => {
    return cases.length > 0 && cases.every((tc) => openCases[tc.id]);
  }, [cases, openCases]);

  const toggleAllCases = () => {
    if (areAllOpen) {
      // Fold all
      setOpenCases({});
    } else {
      // Unfold all
      const next: Record<string, boolean> = {};
      for (const tc of cases) next[tc.id] = true;
      setOpenCases(next);
    }
  };

  const handleRun = useCallback(async () => {
    if (running) return;
    const myRunId = ++runIdRef.current;
    setRunning(true);
    try {
      if (engineStatus !== "ready") {
        setEngineStatus("loading");
        try {
          await ensurePyodideReady((status) => {
            if (runIdRef.current === myRunId) setEngineStatus(status);
          });
          if (runIdRef.current !== myRunId) return;
          setEngineStatus("ready");
        } catch {
          if (runIdRef.current === myRunId) setEngineStatus("error");
          setRunning(false);
          return;
        }
      }

      // PEP-8 linting runs first
      let violations: Pep8Violation[] = [];
      try {
        violations = await lintOne(code);
      } catch {
        violations = [];
      }

      const results: CaseResult[] = [];
      const failingIds: string[] = [];

      for (const tc of cases) {
        try {
          const run = await runOneCase(code, tc.stdin);
          const r = statusFromRun(tc, run);
          results.push(r);
          if (r.status !== "P") {
            failingIds.push(tc.id);
          }
        } catch (err) {
          results.push({
            caseId: tc.id,
            status: "E",
            actual: "",
            durationMs: 0,
            error: err instanceof Error ? err.message : String(err),
          });
          failingIds.push(tc.id);
        }
      }

      if (runIdRef.current !== myRunId) return;

      const scoreString = results.map((r) => r.status).join("");
      const newReport: GradeReport = {
        scoreString,
        results,
        violations,
        ranAt: Date.now(),
      };
      setReport(newReport);

      // Automatically unfold failing test cases so the user can immediately diagnose mismatches
      if (failingIds.length > 0) {
        setOpenCases((prev) => {
          const next = { ...prev };
          for (const id of failingIds) next[id] = true;
          return next;
        });
      }
    } finally {
      if (runIdRef.current === myRunId) setRunning(false);
    }
  }, [code, cases, engineStatus, running]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      handleRun();
    }
  };

  const handleLoadStarter = () => {
    if (initialCode) {
      setCode(`${t(L.starterComment, locale)}\n${initialCode}`);
    }
  };

  const handleResetDraft = () => {
    setCode("");
  };

  function handleExport() {
    downloadJson(`oj${problemId}_grader_workspace.json`, {
      problemId,
      problemName,
      exportedAt: new Date().toISOString(),
      code,
      lastReport: report,
    });
  }

  const resultsByCase = new Map(report?.results.map((r) => [r.caseId, r]) ?? []);

  return (
    <div className="space-y-3.5">
      {/* Code Editor Card */}
      <div className="rounded-2xl border bg-card p-3.5 sm:p-4 shadow-xs space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <Terminal className="size-3.5 text-primary" />
            <h2 className="text-xs sm:text-sm font-bold text-foreground">{t(L.title, locale)}</h2>
          </div>
          <div className="flex items-center gap-1">
            {initialCode && (
              <Button
                type="button"
                onClick={handleLoadStarter}
                variant="ghost"
                size="sm"
                className="h-6 text-[10px] gap-1 px-2 rounded-full text-muted-foreground hover:text-foreground cursor-pointer"
                title="Load clean reference implementation"
              >
                <Sparkles className="size-2.5 text-amber-500" />
                <span>{t(L.loadStarter, locale)}</span>
              </Button>
            )}
            <Button
              type="button"
              onClick={handleResetDraft}
              variant="ghost"
              size="sm"
              className="h-6 text-[10px] gap-1 px-2 rounded-full text-muted-foreground hover:text-foreground cursor-pointer"
              title="Clear editor"
            >
              <RotateCcw className="size-2.5" />
              <span>{t(L.resetDraft, locale)}</span>
            </Button>
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
            {t(L.codeLabel, locale)}
          </label>
          <Textarea
            value={typeof code === "string" ? code : ""}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t(L.codePlaceholder, locale)}
            spellCheck={false}
            className={`font-mono text-xs leading-relaxed resize-y bg-muted/20 focus:bg-background transition-colors ${
              compact ? "min-h-[180px]" : "min-h-[220px]"
            }`}
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <Button
              onClick={handleRun}
              disabled={running}
              className="rounded-full gap-1.5 h-7.5 px-3.5 shadow-xs cursor-pointer"
            >
              {running ? <Loader2 className="size-3.5 animate-spin" /> : <Play className="size-3.5 fill-current" />}
              <span className="font-semibold text-xs">{running ? t(L.running, locale) : t(L.run, locale)}</span>
            </Button>
            <Button
              onClick={handleExport}
              variant="outline"
              disabled={!report}
              className="rounded-full gap-1 h-7.5 px-2.5 text-xs cursor-pointer"
            >
              <Download className="size-3" />
              <span>{t(L.exportWorkspace, locale)}</span>
            </Button>
          </div>

          <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
            <span className="hidden sm:inline font-mono text-[9px] bg-muted/50 px-1.5 py-0.5 rounded border">
              {t(L.shortcutHint, locale)}
            </span>
            <span>{t(L.draftSaved, locale)}</span>
          </div>
        </div>

        {running && engineStatus === "loading" && (
          <p className="text-[11px] text-muted-foreground flex items-center gap-1.5 pt-0.5">
            <Loader2 className="size-3 animate-spin text-primary" />
            {t(L.loadingEngine, locale)}
          </p>
        )}
        {engineStatus === "error" && (
          <p className="text-[11px] text-destructive pt-0.5">{t(L.engineError, locale)}</p>
        )}
      </div>

      {/* Score / Grade Summary Banner when ran */}
      {report && (
        <div className="rounded-2xl border bg-card p-3.5 shadow-xs space-y-2 animate-in fade-in-50 duration-150">
          <ScoreString results={report.results} />
        </div>
      )}

      {/* PEP-8 Style Linter when ran */}
      {report && (
        <div className="rounded-2xl border bg-card p-3.5 shadow-xs space-y-2.5">
          <div className="flex items-center gap-2">
            <ShieldAlert className="size-3.5 text-primary" />
            <h3 className="text-xs font-semibold text-foreground">{t(L.pep8Title, locale)}</h3>
            <Badge variant="outline" className="rounded-full text-[9px] px-1.5 py-0">
              {report.violations.length}
            </Badge>
          </div>
          {report.violations.length === 0 ? (
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">{t(L.pep8Clean, locale)}</p>
          ) : (
            <ul className="space-y-1.5">
              {report.violations.map((v, i) => (
                <li key={`${v.code}-${v.line}-${v.col}-${i}`} className="rounded-lg border bg-muted/20 px-2.5 py-1.5 text-xs">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <Badge variant="outline" className="rounded-full font-mono text-[9px] px-1.5 py-0">
                      {v.code}
                    </Badge>
                    <span className="font-mono text-[10px] text-muted-foreground">
                      {locale === "th" ? "บรรทัด" : "line"} {v.line}:{v.col}
                    </span>
                  </div>
                  <p className="mt-0.5 text-foreground text-[11px]">{t(v.message, locale)}</p>
                  {v.sourceRef && (
                    <p className="mt-0.5 flex items-center gap-1 text-[10px] text-muted-foreground italic">
                      <BookOpen className="size-2.5" />
                      {v.sourceRef}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
          <Separator />
          <p className="text-[10px] text-muted-foreground">{t(L.pep8Note, locale)}</p>
        </div>
      )}

      {/* Test Cases List (Foldable / Collapsible by default) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5">
            <h3 className="text-xs font-bold text-foreground">
              {t(L.testCasesTitle, locale)}
            </h3>
            <Badge variant="secondary" className="rounded-full text-[10px] px-1.5 py-0">
              {cases.length}
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              onClick={toggleAllCases}
              variant="ghost"
              size="sm"
              className="h-6 text-[10px] gap-1 px-2 rounded-full text-muted-foreground hover:text-foreground cursor-pointer"
              title={areAllOpen ? t(L.foldAll, locale) : t(L.unfoldAll, locale)}
            >
              <ChevronsUpDown className="size-3" />
              <span>{areAllOpen ? t(L.foldAll, locale) : t(L.unfoldAll, locale)}</span>
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          {cases.map((tc) => (
            <TestCaseRow
              key={tc.id}
              tc={tc}
              result={resultsByCase.get(tc.id)}
              locale={locale}
              isOpen={Boolean(openCases[tc.id])}
              onToggle={() => toggleCase(tc.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
