"use client";

import { useState, useCallback, useRef, useMemo, useEffect } from "react";
import { BookOpen, ShieldAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CodeEditor } from "@/components/pscp/code-editor";
import { TestCaseNavigator } from "@/components/pscp/test-case-navigator";
import { useDraft } from "@/lib/submission/draft";
import { useLocale, t, type LText } from "@/lib/i18n";
import { TEST_CASES } from "@/lib/pscp/testcases";
import type {
  CaseResult,
  CaseStatus,
  GradeReport,
  Pep8Violation,
  TestCase,
} from "@/lib/pscp/grader-types";

const L: Record<string, LText> = {
  starterComment: {
    th: "# โค้ดตัวอย่างอ้างอิง — แก้ไขหรือเขียนใหม่ได้ตามต้องการ",
    en: "# Reference starter code — edit or rewrite as needed",
  },
  loadingEngine: {
    th: "กำลังโหลด Python engine (ครั้งแรกอาจใช้เวลาสักครู่)...",
    en: "Loading Python engine (first run may take a moment)...",
  },
  engineError: {
    th: "โหลด Python engine ไม่สำเร็จ ลองใหม่อีกครั้ง",
    en: "Failed to load Python engine. Please try again.",
  },
  pep8Title: { th: "ผลตรวจสไตล์โค้ด (PEP-8 / PSCP)", en: "PEP-8 & PSCP Style Check" },
  pep8Clean: { th: "ไม่พบปัญหาสไตล์โค้ด โค้ดสวยงามตามมาตรฐาน!", en: "No style issues found. Clean code!" },
  pep8Note: {
    th: "ผลตรวจสไตล์โค้ดไม่ส่งผลต่อการผ่านเคส ใช้เพื่อปรับปรุงคุณภาพโค้ดเท่านั้น",
    en: "Style results never block test pass — shown for code quality improvement.",
  },
};

/** Small wrapper around the engine so integration is a one-line fix. */
async function ensurePyodideReady(onProgress: (status: "loading" | "ready" | "error") => void) {
  const { preloadPyodide } = await import("@/lib/pscp/pyodide-client");
  await preloadPyodide(onProgress);
}

async function runOneCase(
  code: string,
  stdin: string,
): Promise<{ stdout: string; error: string | null; durationMs: number; timedOut: boolean }> {
  const { runTestCase } = await import("@/lib/pscp/pyodide-client");
  return runTestCase(code, stdin, { timeoutMs: 5000 });
}

async function lintOne(code: string): Promise<Pep8Violation[]> {
  const [{ lintCode }, { translatePep8Violations, checkCustomRules }] = await Promise.all([
    import("@/lib/pscp/pyodide-client"),
    import("@/lib/pscp/pep8-rules"),
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

export function CodeGrader({
  problemId,
  problemName,
  initialCode,
  compact = false,
  cases: providedCases,
  onReport,
  prefill = true,
}: {
  problemId: number;
  problemName: string;
  initialCode?: string;
  compact?: boolean;
  /**
   * Suite to grade against. Defaults to the bundled TEST_CASES table, which is
   * what /recommended relies on; /pscp passes the ingested official iJudge
   * samples for its problem instead.
   */
  cases?: TestCase[];
  /** Fires after every completed run, for callers that persist progress. */
  onReport?: (report: GradeReport) => void;
  /**
   * Whether `initialCode` seeds an empty editor. /recommended seeds it (its
   * pages are walkthroughs of the worked solution); /pscp does not, so the
   * 108 practice problems are not answered before the student starts. Either
   * way the "Load Sample" button stays available.
   */
  prefill?: boolean;
}) {
  const { locale } = useLocale();
  const draftKey = `ihelp-grader-draft-v1-${problemId}`;

  const referenceStarter = initialCode
    ? `${t(L.starterComment, locale)}\n${initialCode}`
    : "";
  const defaultStarter = prefill ? referenceStarter : "";

  const [code, setCode] = useDraft<string>(draftKey, defaultStarter);
  const [engineStatus, setEngineStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [running, setRunning] = useState(false);
  const [report, setReport] = useState<GradeReport | null>(null);
  const runIdRef = useRef(0);

  const cases = useMemo(
    () => providedCases ?? TEST_CASES[problemId] ?? [],
    [providedCases, problemId],
  );

  // Safeguard: if code somehow became [object Object], reset to clean starter string
  useEffect(() => {
    if (typeof code !== "string" || code === "[object Object]") {
      setCode(defaultStarter);
    }
  }, [code, defaultStarter, setCode]);

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

      const currentCode = typeof code === "string" ? code : "";

      // PEP-8 linting runs first
      let violations: Pep8Violation[] = [];
      try {
        violations = await lintOne(currentCode);
      } catch {
        violations = [];
      }

      const results: CaseResult[] = [];

      for (const tc of cases) {
        try {
          const run = await runOneCase(currentCode, tc.stdin);
          const r = statusFromRun(tc, run);
          results.push(r);
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
      onReport?.(newReport);
    } finally {
      if (runIdRef.current === myRunId) setRunning(false);
    }
  }, [code, cases, engineStatus, running, onReport]);

  const handleRunCustomInput = useCallback(
    async (stdin: string) => {
      if (engineStatus !== "ready") {
        try {
          await ensurePyodideReady((status) => setEngineStatus(status));
          setEngineStatus("ready");
        } catch {
          setEngineStatus("error");
          return null;
        }
      }
      const currentCode = typeof code === "string" ? code : "";
      const run = await runOneCase(currentCode, stdin);
      return {
        stdout: run.stdout.replace(/\n$/, ""),
        error: run.error,
        durationMs: run.durationMs,
        timedOut: run.timedOut,
      };
    },
    [code, engineStatus],
  );

  const totalDuration = useMemo(() => {
    if (!report?.results || report.results.length === 0) return undefined;
    return report.results.reduce((acc, r) => acc + r.durationMs, 0);
  }, [report]);

  return (
    <div className="space-y-4">
      {/* Real Code Editor with CodeMirror 6, Python highlight, tab indent, line numbers, shortcuts */}
      <CodeEditor
        problemId={problemId}
        problemTitle={problemName}
        initialCode={initialCode}
        starterCode={referenceStarter}
        value={typeof code === "string" ? code : ""}
        onChange={setCode}
        onRun={handleRun}
        running={running}
        durationMs={totalDuration}
        className={compact ? "min-h-[18rem]" : "min-h-[22rem]"}
      />

      {/* Engine Status / Loading warnings */}
      {running && engineStatus === "loading" && (
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground animate-pulse px-1">
          <span className="size-2 rounded-full bg-primary" />
          <span>{t(L.loadingEngine, locale)}</span>
        </p>
      )}

      {engineStatus === "error" && (
        <p className="text-xs text-destructive px-1">{t(L.engineError, locale)}</p>
      )}

      {/* PEP-8 Style Linter (shown if violations exist) */}
      {report && report.violations.length > 0 && (
        <div className="rounded-2xl border bg-card p-3.5 shadow-xs space-y-2.5 animate-in fade-in-50 duration-150">
          <div className="flex items-center gap-2">
            <ShieldAlert className="size-3.5 text-primary" />
            <h3 className="text-xs font-semibold text-foreground">{t(L.pep8Title, locale)}</h3>
            <Badge variant="outline" className="rounded-full text-[9px] px-1.5 py-0 font-mono">
              {report.violations.length}
            </Badge>
          </div>
          <ul className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {report.violations.map((v, i) => (
              <li
                key={`${v.code}-${v.line}-${v.col}-${i}`}
                className="rounded-lg border bg-muted/20 px-2.5 py-1.5 text-xs"
              >
                <div className="flex flex-wrap items-center gap-1.5">
                  <Badge variant="outline" className="rounded-full font-mono text-[9px] px-1.5 py-0">
                    {v.code}
                  </Badge>
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {locale === "th" ? "บรรทัด" : "line"} {v.line}:{v.col}
                  </span>
                </div>
                <p className="mt-0.5 text-foreground text-[11px] leading-relaxed">
                  {t(v.message, locale)}
                </p>
                {v.sourceRef && (
                  <p className="mt-0.5 flex items-center gap-1 text-[10px] text-muted-foreground italic">
                    <BookOpen className="size-2.5" />
                    {v.sourceRef}
                  </p>
                )}
              </li>
            ))}
          </ul>
          <Separator />
          <p className="text-[10px] text-muted-foreground">{t(L.pep8Note, locale)}</p>
        </div>
      )}

      {/* Compact Tabbed Test Case Runner with Numbered Tab Strip */}
      <TestCaseNavigator
        cases={cases}
        results={report?.results}
        running={running}
        onRunCustomInput={handleRunCustomInput}
      />
    </div>
  );
}
