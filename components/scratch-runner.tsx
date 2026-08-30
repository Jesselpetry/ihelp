"use client";

import { useCallback, useState } from "react";
import { Play, Loader2, Terminal, Code2, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useDraft } from "@/lib/draft";
import { useLocale, t, type LText } from "@/lib/i18n";

const L: Record<string, LText> = {
  title: { th: "รันโค้ดด้วยอินพุตของคุณเอง", en: "Run With Your Own Input" },
  why: {
    th: "โจทย์ข้อนี้ iJudge ไม่ได้เปิดเผยเคสตัวอย่างไว้ จึงไม่มีชุดเทสให้ตรวจอัตโนมัติ — ใส่อินพุตเองแล้วเทียบผลกับโจทย์ได้",
    en: "iJudge published no sample cases for this problem, so there is no suite to auto-grade against. Enter input yourself and compare the result against the statement.",
  },
  codeLabel: { th: "โค้ด Python ของคุณ", en: "Your Python Code" },
  stdinLabel: { th: "อินพุต (stdin)", en: "Input (stdin)" },
  stdoutLabel: { th: "ผลลัพธ์ (stdout)", en: "Output (stdout)" },
  run: { th: "รันโค้ด", en: "Run Code" },
  running: { th: "กำลังประมวลผล...", en: "Running..." },
  loadingEngine: {
    th: "กำลังโหลด Python engine (ครั้งแรกอาจใช้เวลาสักครู่)...",
    en: "Loading Python engine (first run may take a moment)...",
  },
  engineError: {
    th: "โหลด Python engine ไม่สำเร็จ ลองใหม่อีกครั้ง",
    en: "Failed to load Python engine. Please try again.",
  },
  runtimeError: { th: "ข้อผิดพลาดขณะรัน (Runtime Error)", en: "Runtime Error" },
  timedOut: { th: "รันนานเกินกำหนด (หมดเวลา)", en: "Timed out" },
  noRun: { th: "ยังไม่ได้รัน", en: "Not run yet" },
  draftSaved: { th: "บันทึกร่างอัตโนมัติ", en: "Auto-saved locally" },
  shortcutHint: { th: "Ctrl+Enter เพื่อรัน", en: "Ctrl+Enter to run" },
};

interface ScratchResult {
  stdout: string;
  error: string | null;
  timedOut: boolean;
  durationMs: number;
}

/**
 * A bare stdin -> stdout Python runner on the same Pyodide worker the grader
 * uses. Shown for problems with no official sample cases, where an empty
 * grader would otherwise be a dead end.
 */
export function ScratchRunner({ problemId }: { problemId: number }) {
  const { locale } = useLocale();
  const [code, setCode] = useDraft<string>(`ihelp-grader-draft-v1-${problemId}`, "");
  const [stdin, setStdin] = useDraft<string>(`ihelp-pscp-stdin-v1-${problemId}`, "");
  const [engineStatus, setEngineStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<ScratchResult | null>(null);

  const handleRun = useCallback(async () => {
    if (running) return;
    setRunning(true);
    try {
      if (engineStatus !== "ready") {
        setEngineStatus("loading");
        try {
          const { preloadPyodide } = await import("@/lib/pyodide-client");
          await preloadPyodide((s) => setEngineStatus(s));
          setEngineStatus("ready");
        } catch {
          setEngineStatus("error");
          return;
        }
      }
      const { runTestCase } = await import("@/lib/pyodide-client");
      const run = await runTestCase(typeof code === "string" ? code : "", stdin, {
        timeoutMs: 5000,
      });
      setResult({
        stdout: run.stdout.replace(/\n$/, ""),
        error: run.error,
        timedOut: run.timedOut,
        durationMs: run.durationMs,
      });
    } finally {
      setRunning(false);
    }
  }, [code, stdin, engineStatus, running]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      handleRun();
    }
  };

  return (
    <div className="space-y-3.5">
      <div className="rounded-2xl border border-amber-500/30 bg-amber-500/[0.06] px-3.5 py-2.5">
        <p className="flex items-start gap-2 text-[11px] leading-relaxed text-amber-700 dark:text-amber-300">
          <TriangleAlert className="mt-0.5 size-3.5 shrink-0" />
          <span>{t(L.why, locale)}</span>
        </p>
      </div>

      <div className="space-y-2.5 rounded-2xl border bg-card p-3.5 shadow-xs sm:p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <Terminal className="size-3.5 text-primary" />
            <h3 className="text-xs font-bold text-foreground sm:text-sm">{t(L.title, locale)}</h3>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            {t(L.codeLabel, locale)}
          </label>
          <Textarea
            value={typeof code === "string" ? code : ""}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={handleKeyDown}
            spellCheck={false}
            className="min-h-[200px] resize-y bg-muted/20 font-mono text-xs leading-relaxed transition-colors focus:bg-background"
          />
        </div>

        <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2">
          <div>
            <label className="mb-1 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              <Terminal className="size-2.5 text-primary" />
              {t(L.stdinLabel, locale)}
            </label>
            <Textarea
              value={stdin}
              onChange={(e) => setStdin(e.target.value)}
              onKeyDown={handleKeyDown}
              spellCheck={false}
              className="min-h-[90px] resize-y bg-muted/20 font-mono text-xs"
            />
          </div>
          <div>
            <span className="mb-1 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              <Code2 className="size-3 text-primary" />
              {t(L.stdoutLabel, locale)}
            </span>
            <pre
              className={`min-h-[90px] overflow-x-auto whitespace-pre rounded-lg border px-2.5 py-1.5 font-mono text-xs ${
                result?.error || result?.timedOut
                  ? "border-destructive/30 bg-destructive/10 text-destructive"
                  : "bg-muted/30 text-foreground"
              }`}
            >
              {result
                ? result.timedOut
                  ? t(L.timedOut, locale)
                  : result.error
                  ? result.error
                  : result.stdout || "(empty output)"
                : t(L.noRun, locale)}
            </pre>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5">
          <Button
            onClick={handleRun}
            disabled={running}
            className="h-7.5 cursor-pointer gap-1.5 rounded-full px-3.5 shadow-xs"
          >
            {running ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Play className="size-3.5 fill-current" />
            )}
            <span className="text-xs font-semibold">
              {running ? t(L.running, locale) : t(L.run, locale)}
            </span>
          </Button>
          <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
            <span className="hidden rounded border bg-muted/50 px-1.5 py-0.5 font-mono text-[9px] sm:inline">
              {t(L.shortcutHint, locale)}
            </span>
            <span>{t(L.draftSaved, locale)}</span>
            {result && !result.error && !result.timedOut && (
              <span className="font-mono">({result.durationMs}ms)</span>
            )}
          </div>
        </div>

        {running && engineStatus === "loading" && (
          <p className="flex items-center gap-1.5 pt-0.5 text-[11px] text-muted-foreground">
            <Loader2 className="size-3 animate-spin text-primary" />
            {t(L.loadingEngine, locale)}
          </p>
        )}
        {engineStatus === "error" && (
          <p className="pt-0.5 text-[11px] text-destructive">{t(L.engineError, locale)}</p>
        )}
      </div>
    </div>
  );
}
