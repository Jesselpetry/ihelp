"use client";

import { useState } from "react";
import {
  Check,
  Code2,
  Copy,
  Loader2,
  Play,
  Plus,
  Terminal,
  X,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DiffView } from "@/components/diff-view";
import { useLocale, t as tr, type LText } from "@/lib/i18n";
import type { CaseResult, TestCase } from "@/lib/pscp/grader-types";
import { cn } from "@/lib/utils";

const L: Record<string, LText> = {
  customInput: { th: "อินพุตกำหนดเอง", en: "Custom" },
  passed: { th: "ผ่าน", en: "Passed" },
  failed: { th: "ไม่ผ่าน", en: "Failed" },
  notRun: { th: "ยังไม่ได้รัน", en: "Not run yet" },
  stdin: { th: "อินพุต (stdin)", en: "Input (stdin)" },
  expected: { th: "ผลลัพธ์ที่คาดหวัง", en: "Expected Output" },
  actual: { th: "ผลลัพธ์จากโค้ดของคุณ", en: "Your Output" },
  copy: { th: "คัดลอก", en: "Copy" },
  copied: { th: "คัดลอกแล้ว", en: "Copied" },
  showDiff: { th: "ดู Diff", en: "Diff" },
  hideDiff: { th: "ซ่อน Diff", en: "Raw" },
  runtimeError: { th: "ข้อผิดพลาด", en: "Runtime Error" },
  wrongAnswer: { th: "คำตอบไม่ตรง", en: "Wrong Answer" },
  timeout: { th: "หมดเวลา", en: "Timeout" },
  runCustom: { th: "รัน", en: "Run" },
  running: { th: "กำลังรัน...", en: "Running..." },
  customPlaceholder: {
    th: "พิมพ์หรือวางอินพุต stdin ที่ต้องการทดสอบที่นี่...",
    en: "Enter standard input (stdin) to test here...",
  },
  noRunPrompt: {
    th: "(กด 'รันเทสโค้ด' หรือ Ctrl+Enter เพื่อดูผลลัพธ์)",
    en: "(Run tests or press Ctrl+Enter to view output)",
  },
  customNoExpected: {
    th: "(อินพุตกำหนดเอง — ไม่มีเฉลยอ้างอิง)",
    en: "(Custom input — no expected output)",
  },
  clear: { th: "ล้าง", en: "Clear" },
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
      className="inline-flex cursor-pointer items-center gap-1 rounded px-1.5 py-0.5 font-mono text-[10px] text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-100"
      title={copied ? tr(L.copied, locale) : tr(L.copy, locale)}
    >
      {copied ? <Check className="size-2.5 text-emerald-400" /> : <Copy className="size-2.5" />}
      <span>{copied ? tr(L.copied, locale) : tr(L.copy, locale)}</span>
    </button>
  );
}

/** Render visible newlines as ↵ */
function renderWithVisibleLinebreaks(text: string) {
  if (!text) return <span className="text-zinc-500 italic font-mono text-[11px]">(empty)</span>;
  const lines = text.split("\n");
  return (
    <span>
      {lines.map((line, idx) => (
        <span key={idx}>
          {line}
          {idx < lines.length - 1 && (
            <span className="text-zinc-600 select-none mx-0.5">↵</span>
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
  const [diffOpen, setDiffOpen] = useState(false);

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
    <div className={cn("rounded-2xl border border-zinc-800/80 bg-[#141419] p-4 text-zinc-100 shadow-sm space-y-3", className)}>
      {/* Top Header Row: 1 2 3 4 5 Buttons Strip + Batch Summary Chip */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800/80 pb-3">
        {/* Numbered Buttons [ 1 ] [ 2 ] [ 3 ] [ 4 ] [ 5 ] ... [ + Custom ] */}
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
                  setDiffOpen(false);
                }}
                className={cn(
                  "relative inline-flex size-8 items-center justify-center rounded-lg font-mono text-xs font-semibold transition-all cursor-pointer select-none",
                  isActive
                    ? "bg-zinc-100 text-zinc-950 font-bold shadow-sm"
                    : "bg-[#1c1c24] text-zinc-400 hover:bg-[#252530] hover:text-zinc-200 border border-zinc-800",
                )}
                title={`Case ${index + 1}: ${tr(tc.label, locale)}`}
              >
                <span>{index + 1}</span>

                {/* Status Dot */}
                {res && (
                  <span
                    className={cn(
                      "absolute -top-1 -right-1 size-2 rounded-full ring-2 ring-[#141419]",
                      isPassed ? "bg-emerald-400" : isFailed ? "bg-rose-500" : "bg-zinc-400",
                    )}
                  />
                )}
              </button>
            );
          })}

          {/* [+ Custom] Button */}
          <button
            type="button"
            onClick={() => {
              setActiveCaseIndex(-1);
              setDiffOpen(false);
            }}
            className={cn(
              "inline-flex h-8 items-center gap-1 rounded-lg px-2.5 font-mono text-xs font-medium transition-all cursor-pointer select-none",
              activeCaseIndex === -1
                ? "bg-zinc-100 text-zinc-950 font-bold shadow-sm"
                : "bg-[#1c1c24] text-zinc-400 hover:bg-[#252530] hover:text-zinc-200 border border-zinc-800",
            )}
          >
            <Plus className="size-3" />
            <span>{tr(L.customInput, locale)}</span>
          </button>
        </div>

        {/* Batch Results Summary Chip Bar */}
        <div className="flex shrink-0 items-center">
          {running ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-300">
              <Loader2 className="size-3 animate-spin" />
              <span>{tr(L.running, locale)}</span>
            </span>
          ) : hasRun ? (
            allPassed ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
                <Check className="size-3" />
                <span>
                  {tr(L.passed, locale)} {passedCount}/{totalCases}
                </span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 px-2.5 py-0.5 text-xs font-semibold text-rose-400">
                <X className="size-3" />
                <span>
                  {tr(L.failed, locale)} {totalCases - passedCount}/{totalCases}
                  {failedCasesIndices.length > 0 && ` (Case ${failedCasesIndices.join(", ")})`}
                </span>
              </span>
            )
          ) : (
            <span className="rounded-full border border-zinc-800 bg-[#1c1c24] px-2.5 py-0.5 text-xs text-zinc-400">
              {tr(L.notRun, locale)}
            </span>
          )}
        </div>
      </div>

      {/* Fixed Static Location Inspection Grid (2 Columns, strictly fixed height) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {/* Left Column: Fixed Location Test Case Input (stdin) */}
        <div className="flex flex-col space-y-1.5">
          <div className="flex h-5 items-center justify-between">
            <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
              <Terminal className="size-3 text-primary" />
              <span>{tr(L.stdin, locale)}</span>
              {activeCase?.official && (
                <span className="rounded bg-zinc-800/80 px-1 py-0.2 text-[9px] font-normal text-zinc-400">
                  Official
                </span>
              )}
            </span>

            {activeCaseIndex >= 0 && activeCase && (
              <CopyButton text={activeCase.stdin} />
            )}

            {activeCaseIndex === -1 && customStdin && (
              <button
                type="button"
                onClick={() => setCustomStdin("")}
                className="text-[10px] text-zinc-400 hover:text-zinc-200 cursor-pointer"
              >
                {tr(L.clear, locale)}
              </button>
            )}
          </div>

          {activeCaseIndex >= 0 && activeCase ? (
            <pre className="h-52 overflow-y-auto whitespace-pre rounded-xl border border-zinc-800/80 bg-[#0d0d11] p-3 font-mono text-xs leading-relaxed text-zinc-200 selection:bg-zinc-800 scrollbar-thin">
              {renderWithVisibleLinebreaks(activeCase.stdin)}
            </pre>
          ) : (
            <textarea
              value={customStdin}
              onChange={(e) => setCustomStdin(e.target.value)}
              placeholder={tr(L.customPlaceholder, locale)}
              className="h-52 w-full resize-none rounded-xl border border-zinc-800/80 bg-[#0d0d11] p-3 font-mono text-xs leading-relaxed text-zinc-200 placeholder:text-zinc-600 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary scrollbar-thin"
            />
          )}
        </div>

        {/* Right Column: Fixed Location Test Case Output (Expected on top, Actual below) */}
        <div className="flex flex-col space-y-2">
          {/* Top Half: Expected Output (Fixed position & height) */}
          <div className="space-y-1">
            <div className="flex h-5 items-center justify-between">
              <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
                <Check className="size-3" />
                <span>{tr(L.expected, locale)}</span>
              </span>
              {activeCaseIndex >= 0 && activeCase && (
                <CopyButton text={activeCase.expected} />
              )}
            </div>

            <pre className="h-[90px] overflow-y-auto whitespace-pre rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-2.5 font-mono text-xs leading-relaxed text-emerald-200 scrollbar-thin">
              {activeCaseIndex >= 0 && activeCase ? (
                renderWithVisibleLinebreaks(activeCase.expected)
              ) : (
                <span className="text-zinc-500 italic text-[11px]">{tr(L.customNoExpected, locale)}</span>
              )}
            </pre>
          </div>

          {/* Bottom Half: Your Output (Actual / Diff / Error) (Fixed position & height) */}
          <div className="space-y-1">
            <div className="flex h-5 items-center justify-between">
              <div className="flex items-center gap-1.5 text-[11px]">
                <span className="flex items-center gap-1 font-semibold uppercase tracking-wider text-zinc-400">
                  <Code2 className="size-3 text-primary" />
                  <span>{tr(L.actual, locale)}</span>
                </span>

                {/* Status indicator on the output box */}
                {activeCaseIndex >= 0 && activeResult && (
                  <span
                    className={cn(
                      "font-mono text-[10px] font-semibold px-1.5 py-0.2 rounded",
                      isCasePassed
                        ? "bg-emerald-500/20 text-emerald-300"
                        : "bg-rose-500/20 text-rose-300",
                    )}
                  >
                    {isCasePassed
                      ? `${tr(L.passed, locale)} (${activeResult.durationMs}ms)`
                      : activeResult.status === "T"
                        ? `${tr(L.timeout, locale)} (${activeResult.durationMs}ms)`
                        : activeResult.status === "E"
                          ? tr(L.runtimeError, locale)
                          : `${tr(L.wrongAnswer, locale)} (${activeResult.durationMs}ms)`}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1">
                {activeCaseIndex >= 0 && !isCasePassed && activeResult?.actual && (
                  <button
                    type="button"
                    onClick={() => setDiffOpen((prev) => !prev)}
                    className="inline-flex cursor-pointer items-center gap-1 rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] font-medium text-zinc-300 hover:bg-zinc-700"
                  >
                    <Sparkles className="size-2.5 text-primary" />
                    <span>{diffOpen ? tr(L.hideDiff, locale) : tr(L.showDiff, locale)}</span>
                  </button>
                )}

                {activeCaseIndex >= 0 && activeResult?.actual && (
                  <CopyButton text={activeResult.actual} />
                )}

                {activeCaseIndex === -1 && (
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleRunCustom}
                    disabled={customRunning}
                    className="h-5 cursor-pointer gap-1 rounded px-2 text-[10px] bg-primary text-primary-foreground font-medium"
                  >
                    {customRunning ? (
                      <Loader2 className="size-2.5 animate-spin" />
                    ) : (
                      <Play className="size-2.5 fill-current" />
                    )}
                    <span>{tr(L.runCustom, locale)}</span>
                  </Button>
                )}
              </div>
            </div>

            <div
              className={cn(
                "h-[90px] overflow-y-auto rounded-xl border p-2.5 font-mono text-xs leading-relaxed scrollbar-thin",
                activeCaseIndex >= 0
                  ? activeResult
                    ? isCasePassed
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                      : "border-rose-500/30 bg-rose-500/10 text-rose-300"
                    : "border-zinc-800/80 bg-[#0d0d11] text-zinc-500 flex items-center justify-center italic text-xs"
                  : customResult
                    ? customResult.error
                      ? "border-rose-500/30 bg-rose-500/10 text-rose-300"
                      : "border-zinc-800/80 bg-[#0d0d11] text-zinc-200"
                    : "border-zinc-800/80 bg-[#0d0d11] text-zinc-500 flex items-center justify-center italic text-xs",
              )}
            >
              {activeCaseIndex >= 0 ? (
                activeResult ? (
                  diffOpen && !isCasePassed ? (
                    <div className="text-xs">
                      <DiffView expected={activeCase?.expected ?? ""} actual={activeResult.actual} />
                    </div>
                  ) : (
                    <pre className="whitespace-pre">
                      {activeResult.actual
                        ? renderWithVisibleLinebreaks(activeResult.actual)
                        : activeResult.error
                          ? activeResult.error
                          : "(empty output)"}
                    </pre>
                  )
                ) : (
                  <span>{tr(L.noRunPrompt, locale)}</span>
                )
              ) : customResult ? (
                <pre className="whitespace-pre">
                  {customResult.stdout || customResult.error || "(empty output)"}
                </pre>
              ) : (
                <span>{tr(L.noRunPrompt, locale)}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
