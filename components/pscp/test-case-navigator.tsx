"use client";

import { useState } from "react";
import {
  AlertTriangle,
  Check,
  ChevronDown,
  ChevronRight,
  Code2,
  Copy,
  Loader2,
  Play,
  Plus,
  Terminal,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { DiffView } from "@/components/diff-view";
import { useLocale, t as tr, type LText } from "@/lib/i18n";
import type { CaseResult, TestCase } from "@/lib/pscp/grader-types";
import { cn } from "@/lib/utils";

const L: Record<string, LText> = {
  testCases: { th: "เคสทดสอบ", en: "Test Cases" },
  customInput: { th: "อินพุตกำหนดเอง", en: "Custom Input" },
  customInputTab: { th: "+ กำหนดเอง", en: "+ Custom Input" },
  passed: { th: "ผ่าน", en: "Passed" },
  failed: { th: "ไม่ผ่าน", en: "Failed" },
  notRun: { th: "ยังไม่ได้รัน", en: "Not run" },
  notRunYet: { th: "ยังไม่ได้รันเทส", en: "Not run yet" },
  stdin: { th: "อินพุตมาตรฐาน (stdin)", en: "Standard Input (stdin)" },
  expected: { th: "ผลลัพธ์ที่คาดหวัง (Expected stdout)", en: "Expected Output (stdout)" },
  actual: { th: "ผลลัพธ์จริงที่ได้ (Actual stdout)", en: "Actual Output (stdout)" },
  copy: { th: "คัดลอก", en: "Copy" },
  copied: { th: "คัดลอกแล้ว", en: "Copied" },
  official: { th: "ตัวอย่างทางการ", en: "Official" },
  extra: { th: "เคสเพิ่มเติม", en: "Extra" },
  tests: { th: "สิ่งที่ตรวจสอบ:", en: "Tests:" },
  showDiff: { th: "เปรียบเทียบความต่าง (Diff View)", en: "Inspect Output Diff" },
  hideDiff: { th: "ซ่อน Diff", en: "Hide Diff" },
  runtimeError: { th: "ข้อผิดพลาดขณะรัน (Runtime Error)", en: "Runtime Error" },
  wrongAnswer: { th: "คำตอบไม่ตรง", en: "Wrong Answer" },
  timeout: { th: "หมดเวลา", en: "Timeout" },
  runCustom: { th: "รันอินพุตนี้", en: "Run Custom Input" },
  running: { th: "กำลังรัน...", en: "Running..." },
  customPlaceholder: {
    th: "พิมพ์หรือวางอินพุต stdin ที่ต้องการทดสอบที่นี่...",
    en: "Enter standard input (stdin) to test here...",
  },
  customHelp: {
    th: "ใส่อินพุตแล้วกดรัน เพื่อดูผลลัพธ์จากโค้ด Python ของคุณ",
    en: "Enter input and click run to inspect stdout from your Python code.",
  },
  caseNumber: { th: "เคสที่", en: "Case" },
};

function CopyButton({ text }: { text: string }) {
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
      className="inline-flex cursor-pointer items-center gap-1 rounded-md px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      title={copied ? tr(L.copied, locale) : tr(L.copy, locale)}
    >
      {copied ? <Check className="size-3 text-emerald-500" /> : <Copy className="size-3" />}
      <span>{copied ? tr(L.copied, locale) : tr(L.copy, locale)}</span>
    </button>
  );
}

/** Render visible newlines as ↵ */
function renderWithVisibleLinebreaks(text: string) {
  if (!text) return <span className="text-muted-foreground/60 italic font-mono text-[11px]">(empty)</span>;
  const lines = text.split("\n");
  return (
    <span>
      {lines.map((line, idx) => (
        <span key={idx}>
          {line}
          {idx < lines.length - 1 && (
            <span className="text-muted-foreground/40 select-none mx-0.5">↵</span>
          )}
          {idx < lines.length - 1 && "\n"}
        </span>
      ))}
    </span>
  );
}

export interface TestCaseNavigatorProps {
  cases: TestCase[];
  results?: CaseResult[];
  running?: boolean;
  onRunCustom?: (stdin: string) => Promise<{ stdout: string; error: string | null; durationMs: number; timedOut?: boolean } | null>;
  onRunCustomInput?: (stdin: string) => Promise<{ stdout: string; error: string | null; durationMs: number; timedOut?: boolean } | null>;
  className?: string;
}

export function TestCaseNavigator({
  cases,
  results = [],
  running = false,
  onRunCustom,
  onRunCustomInput,
  className,
}: TestCaseNavigatorProps) {
  const runner = onRunCustom ?? onRunCustomInput;
  const { locale } = useLocale();

  // Active tab index: 0..N-1 for cases, -1 for custom input
  const [activeCaseIndex, setActiveCaseIndex] = useState<number>(0);
  const [diffOpen, setDiffOpen] = useState(true);

  // Custom Input tab state
  const [customStdin, setCustomStdin] = useState("");
  const [customResult, setCustomResult] = useState<{
    stdout: string;
    error: string | null;
    durationMs: number;
  } | null>(null);
  const [customRunning, setCustomRunning] = useState(false);

  // Map case results by caseId for quick lookup
  const resultMap = new Map<string, CaseResult>();
  for (const r of results) {
    resultMap.set(r.caseId, r);
  }

  // Calculate batch summary stats
  const totalCases = cases.length;
  const hasRun = results.length > 0;
  const passedCount = results.filter((r) => r.status === "P").length;
  const allPassed = totalCases > 0 && passedCount === totalCases;
  const failedCasesIndices = cases
    .map((c, i) => {
      const res = resultMap.get(c.id);
      return res && res.status !== "P" ? i + 1 : null;
    })
    .filter((n): n is number => n !== null);

  const activeCase = activeCaseIndex >= 0 && activeCaseIndex < cases.length ? cases[activeCaseIndex] : null;
  const activeResult = activeCase ? resultMap.get(activeCase.id) : undefined;
  const isCasePassed = activeResult?.status === "P";

  // Handle custom input run
  const handleRunCustom = async () => {
    if (!runner || customRunning) return;
    setCustomRunning(true);
    try {
      const res = await runner(customStdin);
      setCustomResult(res);
    } finally {
      setCustomRunning(false);
    }
  };

  return (
    <div className={cn("space-y-3", className)}>
      {/* Top Header Row: Test Case Tab Strip + Batch Summary Chip */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-2.5">
        {/* Horizontal flex list of numeric pills [ 1 ] [ 2 ] [ 3 ] ... [ + Custom Input ] */}
        <div className="flex min-w-0 flex-wrap items-center gap-1.5">
          {cases.map((tc, index) => {
            const res = resultMap.get(tc.id);
            const isPassed = res?.status === "P";
            const isFailed = res && res.status !== "P";
            const isActive = activeCaseIndex === index;

            return (
              <button
                key={tc.id}
                type="button"
                onClick={() => {
                  setActiveCaseIndex(index);
                  if (res && !isPassed) setDiffOpen(true);
                }}
                className={cn(
                  "inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-mono transition-all select-none",
                  isActive
                    ? "border border-border/80 bg-card font-semibold text-foreground shadow-xs ring-1 ring-ring/10"
                    : "border border-transparent bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
                title={`${tr(L.caseNumber, locale)} ${index + 1}: ${tr(tc.label, locale)}`}
              >
                {/* Pill status indicator dot */}
                {running ? (
                  <span className="size-1.5 rounded-full bg-amber-400 animate-pulse" />
                ) : isPassed ? (
                  <span className="size-1.5 rounded-full bg-emerald-500 shadow-xs" />
                ) : isFailed ? (
                  <span className="size-1.5 rounded-full bg-destructive shadow-xs" />
                ) : (
                  <span className="size-1.5 rounded-full border border-muted-foreground/50 bg-transparent" />
                )}
                <span>{index + 1}</span>
              </button>
            );
          })}

          {/* [+ Custom Input] Tab button */}
          <button
            type="button"
            onClick={() => setActiveCaseIndex(-1)}
            className={cn(
              "inline-flex cursor-pointer items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium transition-all select-none",
              activeCaseIndex === -1
                ? "border border-border/80 bg-card font-semibold text-foreground shadow-xs ring-1 ring-ring/10"
                : "border border-transparent bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <Plus className="size-3" />
            <span>{tr(L.customInput, locale)}</span>
          </button>
        </div>

        {/* Batch Results Summary Chip Bar */}
        <div className="flex shrink-0 items-center">
          {running ? (
            <span className="inline-flex items-center gap-1.5 rounded-md border border-amber-500/20 bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-300">
              <Loader2 className="size-3 animate-spin" />
              <span>{tr(L.running, locale)}</span>
            </span>
          ) : hasRun ? (
            allPassed ? (
              <span className="inline-flex items-center gap-1.5 rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                <Check className="size-3" />
                <span>
                  {tr(L.passed, locale)}: {passedCount}/{totalCases}
                </span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-md border border-destructive/20 bg-destructive/10 px-2.5 py-0.5 text-xs font-medium text-destructive">
                <X className="size-3" />
                <span>
                  {tr(L.failed, locale)}: {totalCases - passedCount}/{totalCases}
                  {failedCasesIndices.length > 0 && ` (Case ${failedCasesIndices.join(", ")})`}
                </span>
              </span>
            )
          ) : (
            <span className="rounded-md border border-border/40 bg-muted/50 px-2.5 py-0.5 text-xs text-muted-foreground">
              {tr(L.notRunYet, locale)}
            </span>
          )}
        </div>
      </div>

      {/* Dedicated Test Case Inspection Pane */}
      {activeCaseIndex >= 0 && activeCase ? (
        <div className="space-y-3 rounded-2xl border bg-card p-4 shadow-2xs">
          {/* Active case header info */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-foreground">
                {tr(L.caseNumber, locale)} {activeCaseIndex + 1}: {tr(activeCase.label, locale)}
              </span>
              <Badge variant="outline" className="rounded-md px-1.5 py-0 text-[10px] font-normal">
                {activeCase.official ? tr(L.official, locale) : tr(L.extra, locale)}
              </Badge>
            </div>

            {activeResult && (
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "font-semibold text-xs",
                    isCasePassed
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-destructive",
                  )}
                >
                  {isCasePassed
                    ? tr(L.passed, locale)
                    : activeResult.status === "T"
                      ? tr(L.timeout, locale)
                      : activeResult.status === "E"
                        ? tr(L.runtimeError, locale)
                        : tr(L.wrongAnswer, locale)}
                </span>
                <span className="font-mono text-[11px] text-muted-foreground">
                  ({activeResult.durationMs}ms)
                </span>
              </div>
            )}
          </div>

          {activeCase.tests && (
            <p className="rounded-lg border bg-muted/30 px-3 py-1.5 text-xs text-muted-foreground">
              <strong className="font-medium text-foreground">{tr(L.tests, locale)}</strong>{" "}
              {tr(activeCase.tests, locale)}
            </p>
          )}

          {/* 2-Column Grid on desktop, 1-Column on mobile */}
          <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2">
            {/* Column 1: Standard Input (stdin) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  <Terminal className="size-3 text-primary" />
                  {tr(L.stdin, locale)}
                </span>
                <CopyButton text={activeCase.stdin} />
              </div>

              <pre className="min-h-[5rem] overflow-x-auto whitespace-pre rounded-xl border bg-muted/40 p-3 font-mono text-xs leading-relaxed text-foreground selection:bg-muted/70">
                {renderWithVisibleLinebreaks(activeCase.stdin)}
              </pre>
            </div>

            {/* Column 2: Expected Output (and Actual Output post-run) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  <Check className="size-3" />
                  {tr(L.expected, locale)}
                </span>
                <CopyButton text={activeCase.expected} />
              </div>

              <pre className="min-h-[5rem] overflow-x-auto whitespace-pre rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 font-mono text-xs leading-relaxed text-emerald-950 dark:text-emerald-200">
                {renderWithVisibleLinebreaks(activeCase.expected)}
              </pre>
            </div>
          </div>

          {/* Actual Output & Diff Inspection (Post-run) */}
          {activeResult && (
            <div className="space-y-2 border-t pt-3">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  <Code2 className="size-3 text-primary" />
                  {tr(L.actual, locale)}
                </span>
                {activeResult.actual && <CopyButton text={activeResult.actual} />}
              </div>

              <pre
                className={cn(
                  "min-h-[4rem] overflow-x-auto whitespace-pre rounded-xl border p-3 font-mono text-xs leading-relaxed",
                  isCasePassed
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : "border-destructive/30 bg-destructive/10 text-destructive",
                )}
              >
                {activeResult.actual
                  ? renderWithVisibleLinebreaks(activeResult.actual)
                  : activeResult.error
                    ? "(Runtime Error)"
                    : "(empty output)"}
              </pre>

              {/* Traceback error callout */}
              {activeResult.error && (
                <div className="rounded-xl border border-destructive/30 bg-destructive/15 p-3">
                  <div className="mb-1 flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-destructive">
                    <AlertTriangle className="size-3" />
                    <span>{tr(L.runtimeError, locale)}</span>
                  </div>
                  <pre className="overflow-x-auto whitespace-pre font-mono text-xs text-destructive">
                    {activeResult.error}
                  </pre>
                </div>
              )}

              {/* Diff inspection toggle */}
              {!isCasePassed && activeResult.actual && (
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => setDiffOpen((prev) => !prev)}
                    className="inline-flex cursor-pointer items-center gap-1 text-xs font-semibold text-primary transition-colors hover:underline"
                  >
                    {diffOpen ? <ChevronDown className="size-3.5" /> : <ChevronRight className="size-3.5" />}
                    <span>{diffOpen ? tr(L.hideDiff, locale) : tr(L.showDiff, locale)}</span>
                  </button>

                  {diffOpen && (
                    <div className="mt-2 overflow-hidden rounded-xl border p-3 bg-muted/10">
                      <DiffView expected={activeCase.expected} actual={activeResult.actual} />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      ) : activeCaseIndex === -1 ? (
        /* Custom Input Tab Content */
        <div className="space-y-3.5 rounded-2xl border bg-card p-4 shadow-2xs">
          <div className="flex items-center justify-between border-b pb-2">
            <span className="font-semibold text-xs text-foreground flex items-center gap-1.5">
              <Terminal className="size-3.5 text-primary" />
              {tr(L.customInput, locale)}
            </span>
            <Button
              type="button"
              size="sm"
              onClick={handleRunCustom}
              disabled={customRunning}
              className="h-7 cursor-pointer gap-1.5 rounded-full px-3 text-xs"
            >
              {customRunning ? (
                <>
                  <Loader2 className="size-3 animate-spin" />
                  <span>{tr(L.running, locale)}</span>
                </>
              ) : (
                <>
                  <Play className="size-3 fill-current" />
                  <span>{tr(L.runCustom, locale)}</span>
                </>
              )}
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2">
            {/* Column 1: Editable Custom Stdin */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {tr(L.stdin, locale)}
                </span>
                {customStdin && (
                  <button
                    type="button"
                    onClick={() => setCustomStdin("")}
                    className="text-[10px] text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>
              <Textarea
                value={customStdin}
                onChange={(e) => setCustomStdin(e.target.value)}
                placeholder={tr(L.customPlaceholder, locale)}
                rows={5}
                className="font-mono text-xs leading-relaxed"
              />
            </div>

            {/* Column 2: Output readout from running */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {tr(L.actual, locale)}
                </span>
                {customResult?.stdout && <CopyButton text={customResult.stdout} />}
              </div>

              {customResult ? (
                <div className="space-y-2">
                  <pre
                    className={cn(
                      "min-h-[6.5rem] overflow-x-auto whitespace-pre rounded-xl border p-3 font-mono text-xs leading-relaxed",
                      customResult.error
                        ? "border-destructive/30 bg-destructive/10 text-destructive"
                        : "border-border/60 bg-muted/40 text-foreground",
                    )}
                  >
                    {customResult.stdout || (customResult.error ? "(Error)" : "(empty output)")}
                  </pre>
                  {customResult.error && (
                    <pre className="overflow-x-auto rounded-lg border border-destructive/30 bg-destructive/15 p-2 font-mono text-xs text-destructive">
                      {customResult.error}
                    </pre>
                  )}
                  <div className="text-[11px] font-mono text-muted-foreground">
                    Duration: {customResult.durationMs}ms
                  </div>
                </div>
              ) : (
                <div className="flex min-h-[6.5rem] items-center justify-center rounded-xl border border-dashed p-4 text-center text-xs text-muted-foreground">
                  {tr(L.customHelp, locale)}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
