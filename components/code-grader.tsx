"use client";

import { useState, useCallback, useRef, useMemo } from "react";
import {
  Play,
  Loader2,
  Download,
  ChevronDown,
  ChevronRight,
  ShieldAlert,
  BookOpen,
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
  title: { th: "ตรวจให้คะแนนโค้ด", en: "Grade Your Code" },
  codeLabel: { th: "วางโค้ด Python ของคุณที่นี่", en: "Paste your Python code here" },
  codePlaceholder: {
    th: "# วางโค้ด Python ของคุณตรงนี้แล้วกด Run",
    en: "# Paste your Python code here, then click Run",
  },
  starterComment: {
    th: "# นี่คือจุดเริ่มต้นตัวอย่าง ไม่ใช่คำตอบสำเร็จรูป — แก้ไข/เขียนใหม่ก่อนส่ง",
    en: "# This is a reference starting point, not a ready-to-submit answer — edit it before grading",
  },
  run: { th: "รันเทส", en: "Run Tests" },
  running: { th: "กำลังรัน...", en: "Running..." },
  loadingEngine: { th: "กำลังโหลด Python engine (ครั้งแรกอาจใช้เวลาสักครู่)...", en: "Loading Python engine (first run may take a moment)..." },
  engineError: { th: "โหลด Python engine ไม่สำเร็จ ลองใหม่อีกครั้ง", en: "Failed to load the Python engine. Please try again." },
  exportWorkspace: { th: "ส่งออกไฟล์งาน", en: "Export Workspace" },
  pep8Title: { th: "ผลตรวจสไตล์โค้ด (PEP-8)", en: "PEP-8 Style Check" },
  pep8Clean: { th: "ไม่พบปัญหาสไตล์โค้ด เยี่ยมมาก!", en: "No style issues found. Nice work!" },
  pep8Note: {
    th: "ผลตรวจสไตล์โค้ดไม่ส่งผลต่อการรันเทส ใช้เพื่อเรียนรู้เท่านั้น",
    en: "Style results never block running tests — shown for learning purposes only.",
  },
  testCasesTitle: { th: "ผลการทดสอบทีละเคส", en: "Test Case Results" },
  official: { th: "ทางการ", en: "Official" },
  extra: { th: "เพิ่มเติม", en: "Extra" },
  stdin: { th: "อินพุต (stdin)", en: "Input (stdin)" },
  showDiff: { th: "แสดงความต่าง", en: "Show diff" },
  hideDiff: { th: "ซ่อนความต่าง", en: "Hide diff" },
  runtimeError: { th: "ข้อผิดพลาดขณะรัน", en: "Runtime error" },
  duration: { th: "เวลาที่ใช้", en: "Duration" },
  noRunYet: {
    th: "ยังไม่ได้รันเทส — กดปุ่ม \"รันเทส\" เพื่อเริ่มตรวจโค้ดของคุณ",
    en: 'No run yet — click "Run Tests" to grade your code.',
  },
  draftSaved: { th: "ร่างของคุณถูกบันทึกอัตโนมัติในเบราว์เซอร์นี้", en: "Your draft auto-saves in this browser." },
  whatThisTests: { th: "ทดสอบอะไร:", en: "Tests:" },
};

/** Small wrapper around the (parallel-built) engine so integration is a one-line fix. */
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

function TestCaseRow({
  tc,
  result,
  locale,
}: {
  tc: TestCase;
  result: CaseResult | undefined;
  locale: "th" | "en";
}) {
  const passed = result?.status === "P";
  const [open, setOpen] = useState(!passed);

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

  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2.5 bg-muted/20">
        <div className="flex flex-wrap items-center gap-2 min-w-0">
          <Badge className={`rounded-full px-2 py-0.5 font-mono shadow-none shrink-0 ${badgeClass}`}>
            {result?.status ?? "?"}
          </Badge>
          <span className="text-xs sm:text-sm font-medium text-foreground truncate">
            {t(tc.label, locale)}
          </span>
          <Badge variant="outline" className="rounded-full text-[10px] px-2 py-0 shrink-0">
            {tc.official ? t(L.official, locale) : t(L.extra, locale)}
          </Badge>
        </div>
        {result && (
          <span className="text-[11px] font-mono text-muted-foreground shrink-0">
            {t(L.duration, locale)}: {result.durationMs}ms
          </span>
        )}
      </div>

      <div className="px-3 py-2.5 space-y-2">
        {tc.tests && (
          <p className="text-[11px] text-muted-foreground">
            <span className="font-semibold">{t(L.whatThisTests, locale)}</span> {t(tc.tests, locale)}
          </p>
        )}

        <div className="overflow-x-auto">
          <div className="min-w-full">
            <div className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
              {t(L.stdin, locale)}
            </div>
            <pre className="whitespace-pre rounded-lg bg-muted/40 px-2.5 py-2 font-mono text-xs text-foreground overflow-x-auto">
              {tc.stdin || "(empty)"}
            </pre>
          </div>
        </div>

        {result?.error && (
          <div className="overflow-x-auto">
            <pre className="whitespace-pre rounded-lg bg-destructive/10 text-destructive px-2.5 py-2 font-mono text-xs overflow-x-auto">
              {result.error}
            </pre>
          </div>
        )}

        {result && (
          <div>
            <button
              onClick={() => setOpen((o) => !o)}
              className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              {open ? <ChevronDown className="size-3.5" /> : <ChevronRight className="size-3.5" />}
              {open ? t(L.hideDiff, locale) : t(L.showDiff, locale)}
            </button>
            {open && (
              <div className="mt-2">
                <DiffView expected={tc.expected} actual={result.actual} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export function CodeGrader({
  problemId,
  problemName,
  initialCode,
}: {
  problemId: number;
  problemName: string;
  initialCode?: string;
}) {
  const { locale } = useLocale();
  const draftKey = `ihelp-grader-draft-v1-${problemId}`;

  const seed = initialCode
    ? `${t(L.starterComment, locale)}\n${initialCode
        .split("\n")
        .map((line) => `# ${line}`)
        .join("\n")}\n\n`
    : "";

  const [code, setCode] = useDraft<string>(draftKey, seed);
  const [engineStatus, setEngineStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [running, setRunning] = useState(false);
  const [report, setReport] = useState<GradeReport | null>(null);
  const runIdRef = useRef(0);

  const cases = useMemo(() => TEST_CASES[problemId] ?? [], [problemId]);

  const handleRun = useCallback(async () => {
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

      // PEP-8 linting always runs first and never blocks test execution.
      let violations: Pep8Violation[] = [];
      try {
        violations = await lintOne(code);
      } catch {
        violations = [];
      }

      const results: CaseResult[] = [];
      for (const tc of cases) {
        try {
          const run = await runOneCase(code, tc.stdin);
          results.push(statusFromRun(tc, run));
        } catch (err) {
          results.push({
            caseId: tc.id,
            status: "E",
            actual: "",
            durationMs: 0,
            error: err instanceof Error ? err.message : String(err),
          });
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
    } finally {
      if (runIdRef.current === myRunId) setRunning(false);
    }
  }, [code, cases, engineStatus]);

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
    <div className="space-y-5">
      <div className="rounded-2xl border bg-card p-4 sm:p-6 shadow-sm space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-base sm:text-lg font-bold text-foreground">{t(L.title, locale)}</h2>
          <span className="font-mono text-xs text-muted-foreground">{problemName}</span>
        </div>

        <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {t(L.codeLabel, locale)}
        </label>
        <Textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder={t(L.codePlaceholder, locale)}
          spellCheck={false}
          className="min-h-[280px] font-mono text-xs sm:text-sm leading-relaxed resize-y"
        />
        <p className="text-[11px] text-muted-foreground">{t(L.draftSaved, locale)}</p>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <Button onClick={handleRun} disabled={running} className="rounded-full gap-1.5">
            {running ? <Loader2 className="size-4 animate-spin" /> : <Play className="size-4" />}
            {running ? t(L.running, locale) : t(L.run, locale)}
          </Button>
          <Button
            onClick={handleExport}
            variant="outline"
            disabled={!report}
            className="rounded-full gap-1.5"
          >
            <Download className="size-4" />
            {t(L.exportWorkspace, locale)}
          </Button>
        </div>

        {running && engineStatus === "loading" && (
          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Loader2 className="size-3.5 animate-spin" />
            {t(L.loadingEngine, locale)}
          </p>
        )}
        {engineStatus === "error" && (
          <p className="text-xs text-destructive">{t(L.engineError, locale)}</p>
        )}
      </div>

      {!report && (
        <div className="rounded-2xl border border-dashed p-6 sm:p-8 text-center text-sm text-muted-foreground">
          {t(L.noRunYet, locale)}
        </div>
      )}

      {report && (
        <>
          <div className="rounded-2xl border bg-card p-4 sm:p-6 shadow-sm">
            <ScoreString results={report.results} />
          </div>

          <div className="rounded-2xl border bg-card p-4 sm:p-6 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <ShieldAlert className="size-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">{t(L.pep8Title, locale)}</h3>
              <Badge variant="outline" className="rounded-full text-[10px] px-2 py-0">
                {report.violations.length}
              </Badge>
            </div>
            {report.violations.length === 0 ? (
              <p className="text-xs text-muted-foreground">{t(L.pep8Clean, locale)}</p>
            ) : (
              <ul className="space-y-2">
                {report.violations.map((v, i) => (
                  <li key={`${v.code}-${v.line}-${v.col}-${i}`} className="rounded-lg border bg-muted/20 px-3 py-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="outline" className="rounded-full font-mono text-[10px] px-2 py-0">
                        {v.code}
                      </Badge>
                      <span className="font-mono text-[11px] text-muted-foreground">
                        {locale === "th" ? "บรรทัด" : "line"} {v.line}:{v.col}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-foreground">{t(v.message, locale)}</p>
                    {v.sourceRef && (
                      <p className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground italic">
                        <BookOpen className="size-3" />
                        {v.sourceRef}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            )}
            <Separator />
            <p className="text-[11px] text-muted-foreground">{t(L.pep8Note, locale)}</p>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground px-1">{t(L.testCasesTitle, locale)}</h3>
            <div className="space-y-2.5">
              {cases.map((tc) => (
                <TestCaseRow key={tc.id} tc={tc} result={resultsByCase.get(tc.id)} locale={locale} />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
