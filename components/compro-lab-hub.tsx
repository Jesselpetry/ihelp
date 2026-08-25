"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  BookOpen,
  Check,
  ChevronDown,
  ChevronRight,
  Code2,
  Eye,
  FlaskConical,
  Loader2,
  Play,
  RotateCcw,
  ScrollText,
  Terminal,
  Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { DiffView } from "@/components/diff-view";
import { MdView } from "@/components/md-view";
import { useDraft } from "@/lib/draft";
import { useLocale, t, type LText } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import {
  COMPRO_META,
  COMPRO_PROBLEMS,
  COMPRO_RULES,
  COMPRO_TOTAL_POINTS,
  COMPRO_WEEKS,
  POINTS_PER_PROBLEM,
  findImports,
  problemsForWeek,
  type ComProCase,
  type ComProProblem,
} from "@/lib/compro-labs";
import { COMPRO_LESSONS, COMPRO_WEEK_LESSONS } from "@/lib/compro-lessons";

const STORAGE_KEY = "ihelp-compro-labs-v1";

const L: Record<string, LText> = {
  score: { th: "คะแนนที่ทำได้", en: "Score" },
  solvedCount: { th: "ข้อที่ผ่านแล้ว", en: "Problems passed" },
  rules: { th: "กติกาของวิชานี้ — อ่านก่อนเริ่ม", en: "Course rules — read first" },
  lesson: { th: "บทเรียน", en: "Lesson" },
  problem: { th: "โจทย์", en: "Problem" },
  cases: { th: "เทสเคส", en: "Test cases" },
  editor: { th: "เขียนโค้ดที่นี่", en: "Write your code here" },
  runAll: { th: "ตรวจทุกเคส", en: "Run all cases" },
  runFirst: { th: "ลองเคสแรก", en: "Try first case" },
  running: { th: "กำลังตรวจ...", en: "Running..." },
  loadingEngine: {
    th: "กำลังโหลด Python (ครั้งแรกโหลดนาน ครั้งต่อไปเร็ว)...",
    en: "Loading Python (slow the first time only)...",
  },
  engineError: { th: "โหลด Python ไม่สำเร็จ ลองกดใหม่อีกครั้ง", en: "Python failed to load. Try again." },
  starter: { th: "โหลดโครงร่าง", en: "Load scaffold" },
  clear: { th: "ล้างโค้ด", en: "Clear" },
  reveal: { th: "ดูเฉลย", en: "Show solution" },
  hideAnswer: { th: "ซ่อนเฉลย", en: "Hide solution" },
  passed: { th: "ผ่าน", en: "Passed" },
  failed: { th: "ไม่ผ่าน", en: "Failed" },
  notRun: { th: "ยังไม่ได้ตรวจ", en: "Not run" },
  timeout: { th: "หมดเวลา", en: "Timeout" },
  runtimeError: { th: "โปรแกรมพัง", en: "Runtime error" },
  stdin: { th: "อินพุต (stdin)", en: "Input (stdin)" },
  expected: { th: "ผลลัพธ์ที่ต้องได้", en: "Expected output" },
  actual: { th: "ผลลัพธ์ของคุณ", en: "Your output" },
  noStdin: { th: "(ข้อนี้ไม่รับอินพุต)", en: "(no input)" },
  allPassed: { th: "ผ่านครบทุกเคส!", en: "All cases passed!" },
  goal: { th: "ทำข้อนี้แล้วจะได้อะไร", en: "What you will learn" },
  steps: { th: "ทำทีละขั้น", en: "Step by step" },
  pitfalls: { th: "จุดที่คนพลาดบ่อย", en: "Common mistakes" },
  weekOutcomes: { th: "จบสัปดาห์นี้ต้องทำอะไรได้", en: "By the end of this week" },
  cheatsheet: { th: "คำสั่งที่ต้องใช้", en: "Syntax you need" },
  importWarning: {
    th: "พบคำสั่ง import — สัปดาห์ 1–5 ยังไม่ได้เรียน module ข้อสอบจริงจะไม่รับ",
    en: "Found an import — weeks 1–5 are builtins only and the real judge will reject it.",
  },
  echoNote: {
    th: "ทำไมผลลัพธ์ถึงหน้าตาแปลก ๆ ?",
    en: "Why does the expected output look odd?",
  },
  echoBody: {
    th: "ตอนรันในเครื่อง เราพิมพ์ค่าเข้าไปเอง จอเลยแสดงค่าที่พิมพ์ต่อท้าย prompt แต่เครื่องตรวจป้อนค่าให้อัตโนมัติ ค่าที่ป้อนจึงไม่ปรากฏบนจอ ทำให้ prompt ไปติดกับข้อความบรรทัดถัดไป เช่น Enter a name : Hello  Linda ซึ่งถูกต้องแล้ว",
    en: "When you type input yourself the terminal echoes it after the prompt. The judge pipes input instead, so nothing echoes and the prompt runs into the next printed line — that is correct.",
  },
  resetProgress: { th: "ล้างความคืบหน้าทั้งหมด", en: "Reset all progress" },
  resetConfirm: {
    th: "ล้างคะแนนและโค้ดที่บันทึกไว้ทั้งหมด?",
    en: "Erase all saved scores and code?",
  },
  revealConfirm: {
    th: "เปิดเฉลยเลยไหม? ลองทำเองก่อนจะได้ผลกว่า",
    en: "Show the solution? Trying it yourself works better.",
  },
  referenceNote: {
    th: "เฉลยอ้างอิง — เป็นโค้ดที่ผ่านการตรวจจริงบนระบบของวิชา ไม่ใช่โค้ดที่ดีที่สุดเสมอไป อ่านเทียบกับ \"จุดที่คนพลาดบ่อย\" ด้วย",
    en: "Reference solution — accepted by the course judge, not necessarily the cleanest code.",
  },
  pickProblem: { th: "เลือกข้อที่จะทำ", en: "Pick a problem" },
  points: { th: "คะแนน", en: "pts" },
};

type CaseState = {
  status: "P" | "-" | "T" | "E";
  actual: string;
  durationMs: number;
  error?: string;
};

interface Progress {
  /** problem id -> when every case first passed */
  solved: Record<string, number>;
  /** problem id -> the student's in-progress code */
  code: Record<string, string>;
}

const EMPTY_PROGRESS: Progress = { solved: {}, code: {} };

/**
 * A case passes only on an exact match. The runner's stdout keeps the trailing
 * newline print() adds; `expected` is stored without it, so exactly one
 * trailing newline is stripped before comparing. Nothing else is normalised —
 * trailing spaces and blank lines are graded, which is what the course judge
 * does and what most of these problems hinge on.
 */
function judge(expected: string, run: { stdout: string; error: string | null; timedOut: boolean }): CaseState["status"] {
  if (run.timedOut) return "T";
  if (run.error) return "E";
  return run.stdout.replace(/\n$/, "") === expected ? "P" : "-";
}

function StatusPill({ status, locale }: { status?: CaseState["status"]; locale: "th" | "en" }) {
  const map = {
    P: ["bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30", L.passed],
    "-": ["bg-destructive/15 text-destructive border-destructive/30", L.failed],
    T: ["bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30", L.timeout],
    E: ["bg-rose-600/15 text-rose-600 dark:text-rose-400 border-rose-600/30", L.runtimeError],
  } as const;
  const [cls, label] = status ? map[status] : ["bg-muted text-muted-foreground", L.notRun];
  return (
    <Badge variant="outline" className={cn("rounded-full text-[10px] font-medium px-2", cls)}>
      {t(label as LText, locale)}
    </Badge>
  );
}

function CaseCard({
  index,
  testCase,
  state,
  locale,
}: {
  index: number;
  testCase: ComProCase;
  state?: CaseState;
  locale: "th" | "en";
}) {
  const [open, setOpen] = useState(index === 0);
  const failed = state && state.status !== "P";

  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-muted/40 transition-colors cursor-pointer"
        aria-expanded={open}
      >
        {open ? (
          <ChevronDown className="size-3.5 text-muted-foreground shrink-0" />
        ) : (
          <ChevronRight className="size-3.5 text-muted-foreground shrink-0" />
        )}
        <span className="text-xs font-semibold">
          {locale === "th" ? `เคสที่ ${index + 1}` : `Case ${index + 1}`}
        </span>
        {!open && testCase.stdin && (
          <span className="font-mono text-[10px] text-muted-foreground truncate">
            {testCase.stdin.replace(/\n/g, " ↵ ")}
          </span>
        )}
        <span className="ml-auto">
          <StatusPill status={state?.status} locale={locale} />
        </span>
      </button>

      {open && (
        <div className="px-3 pb-3 space-y-2">
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                <Terminal className="size-2.5 text-primary" />
                {t(L.stdin, locale)}
              </span>
              <pre className="whitespace-pre rounded-lg border bg-muted/40 px-2.5 py-1.5 font-mono text-xs overflow-x-auto min-h-[34px]">
                {testCase.stdin || t(L.noStdin, locale)}
              </pre>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <Check className="size-2.5" />
                {t(L.expected, locale)}
              </span>
              <pre className="whitespace-pre rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-2.5 py-1.5 font-mono text-xs overflow-x-auto min-h-[34px]">
                {testCase.expected}
              </pre>
            </div>
          </div>

          {state?.status === "E" && state.error && (
            <pre className="whitespace-pre-wrap rounded-lg border border-rose-500/30 bg-rose-500/5 px-2.5 py-1.5 font-mono text-[11px] text-rose-700 dark:text-rose-300 overflow-x-auto">
              {state.error}
            </pre>
          )}

          {failed && state.status !== "E" && (
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                <Code2 className="size-3 text-primary" />
                {t(L.actual, locale)}
              </span>
              <DiffView expected={testCase.expected} actual={state.actual} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function ComProLabHub() {
  const { locale } = useLocale();
  const [progress, setProgress] = useDraft<Progress>(STORAGE_KEY, EMPTY_PROGRESS);

  const [week, setWeek] = useState(1);
  const [problemId, setProblemId] = useState(COMPRO_PROBLEMS[0].id);
  const [pane, setPane] = useState<"lesson" | "problem" | "cases">("lesson");
  const [code, setCode] = useState("");
  const [results, setResults] = useState<Record<string, CaseState>>({});
  const [engine, setEngine] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [running, setRunning] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [rulesOpen, setRulesOpen] = useState(true);
  const editorRef = useRef<HTMLTextAreaElement>(null);

  const problem = useMemo(
    () => COMPRO_PROBLEMS.find((p) => p.id === problemId) as ComProProblem,
    [problemId],
  );
  const lesson = COMPRO_LESSONS[problem.id];
  const weekLesson = COMPRO_WEEK_LESSONS[week];
  const weekProblems = useMemo(() => problemsForWeek(week), [week]);

  const solvedIds = Object.keys(progress.solved);
  const score = solvedIds.length * POINTS_PER_PROBLEM;

  // Swapping problems swaps the editor buffer too: each problem keeps its own
  // saved draft, so switching away and back does not lose work.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- editor buffer follows the selected problem
    setCode(progress.code[problemId] ?? "");
    setResults({});
    setShowAnswer(false);
    setPane("lesson");
    // Deliberately not keyed on progress.code: that object changes on every
    // keystroke, and re-running this would clobber what is being typed.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [problemId]);

  const saveCode = useCallback(
    (next: string) => {
      setCode(next);
      setProgress((p) => ({ ...p, code: { ...p.code, [problemId]: next } }));
    },
    [problemId, setProgress],
  );

  const importHits = useMemo(() => findImports(code), [code]);

  const runCases = useCallback(
    async (cases: ComProCase[]) => {
      if (running || !code.trim()) return;
      setRunning(true);
      try {
        const { preloadPyodide, runTestCase } = await import("@/lib/pyodide-client");
        if (engine !== "ready") {
          setEngine("loading");
          try {
            await preloadPyodide();
            setEngine("ready");
          } catch {
            setEngine("error");
            return;
          }
        }

        const next: Record<string, CaseState> = {};
        for (const c of cases) {
          const run = await runTestCase(code, c.stdin, { timeoutMs: 5000 });
          next[c.id] = {
            status: judge(c.expected, run),
            actual: run.stdout.replace(/\n$/, ""),
            durationMs: Math.round(run.durationMs),
            error: run.error ?? undefined,
          };
        }
        const merged = { ...results, ...next };
        setResults(merged);

        // Only a full sweep can mark the problem solved: passing the one case
        // you happened to run says nothing about the other seven.
        const complete = problem.cases.every((c) => merged[c.id]?.status === "P");
        if (complete && !progress.solved[problem.id]) {
          setProgress((p) => ({ ...p, solved: { ...p.solved, [problem.id]: Date.now() } }));
        }
      } finally {
        setRunning(false);
      }
    },
    [code, engine, problem, progress.solved, results, running, setProgress],
  );

  // Ctrl/Cmd+Enter from inside the editor runs the whole set.
  const onEditorKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      void runCases(problem.cases);
      return;
    }
    // Tab indents instead of leaving the field — indentation is the whole
    // subject of week 1 and students cannot type it if Tab moves focus away.
    if (e.key === "Tab") {
      e.preventDefault();
      const el = e.currentTarget;
      const { selectionStart: start, selectionEnd: end } = el;
      const next = `${code.slice(0, start)}    ${code.slice(end)}`;
      saveCode(next);
      requestAnimationFrame(() => el.setSelectionRange(start + 4, start + 4));
    }
  };

  const passedCount = problem.cases.filter((c) => results[c.id]?.status === "P").length;
  const ranCount = problem.cases.filter((c) => results[c.id]).length;
  const allPassed = ranCount === problem.cases.length && passedCount === problem.cases.length;

  return (
    <div className="space-y-4">
      {/* ── Score header ───────────────────────────────────────────────── */}
      <div className="rounded-2xl border bg-card p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-primary/10 p-2">
              <Trophy className="size-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{t(L.score, locale)}</p>
              <p className="text-xl font-bold tabular-nums">
                {score}
                <span className="text-sm font-normal text-muted-foreground"> / {COMPRO_TOTAL_POINTS}</span>
              </p>
            </div>
            <Separator orientation="vertical" className="h-9 hidden sm:block" />
            <div className="hidden sm:block">
              <p className="text-xs text-muted-foreground">{t(L.solvedCount, locale)}</p>
              <p className="text-xl font-bold tabular-nums">
                {solvedIds.length}
                <span className="text-sm font-normal text-muted-foreground"> / {COMPRO_PROBLEMS.length}</span>
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-muted-foreground"
            onClick={() => {
              if (window.confirm(t(L.resetConfirm, locale))) {
                setProgress(EMPTY_PROGRESS);
                setCode("");
                setResults({});
              }
            }}
          >
            <RotateCcw className="size-3.5" />
            {t(L.resetProgress, locale)}
          </Button>
        </div>
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{ width: `${(score / COMPRO_TOTAL_POINTS) * 100}%` }}
          />
        </div>
      </div>

      {/* ── Course rules ───────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 overflow-hidden">
        <button
          type="button"
          onClick={() => setRulesOpen((v) => !v)}
          className="w-full flex items-center gap-2 px-4 py-3 text-left cursor-pointer"
          aria-expanded={rulesOpen}
        >
          <AlertTriangle className="size-4 text-amber-600 dark:text-amber-400 shrink-0" />
          <span className="text-sm font-semibold">{t(L.rules, locale)}</span>
          {rulesOpen ? (
            <ChevronDown className="size-4 ml-auto text-muted-foreground" />
          ) : (
            <ChevronRight className="size-4 ml-auto text-muted-foreground" />
          )}
        </button>
        {rulesOpen && (
          <div className="px-4 pb-4 space-y-2">
            {COMPRO_RULES.map((rule) => (
              <div key={rule.title.th} className="rounded-xl border bg-card/60 px-3 py-2">
                <p className="text-xs font-semibold">{t(rule.title, locale)}</p>
                <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">
                  {t(rule.detail, locale)}
                </p>
              </div>
            ))}
            <details className="rounded-xl border bg-card/60 px-3 py-2">
              <summary className="text-xs font-semibold cursor-pointer">
                {t(L.echoNote, locale)}
              </summary>
              <p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground">
                {t(L.echoBody, locale)}
              </p>
            </details>
          </div>
        )}
      </div>

      {/* ── Week tabs ──────────────────────────────────────────────────── */}
      <div className="flex gap-1.5 overflow-x-auto pb-1" role="tablist">
        {COMPRO_WEEKS.map((w) => {
          const done = problemsForWeek(w.week).filter((p) => progress.solved[p.id]).length;
          const active = w.week === week;
          return (
            <button
              key={w.week}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => {
                setWeek(w.week);
                setProblemId(problemsForWeek(w.week)[0].id);
              }}
              className={cn(
                "shrink-0 rounded-xl border px-3 py-2 text-left transition-colors cursor-pointer",
                active ? "border-primary bg-primary/10" : "hover:bg-muted/50",
              )}
            >
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold">Week {w.week}</span>
                <Badge
                  variant="outline"
                  className={cn(
                    "rounded-full px-1.5 text-[9px]",
                    done === 5 && "border-emerald-500/40 text-emerald-600 dark:text-emerald-400",
                  )}
                >
                  {done}/5
                </Badge>
              </div>
              <p className="text-[10px] text-muted-foreground max-w-[150px] truncate">{w.titleTh}</p>
            </button>
          );
        })}
      </div>

      {/* ── Week framing ───────────────────────────────────────────────── */}
      <div className="rounded-2xl border bg-muted/20 p-4">
        <p className="text-xs leading-relaxed text-muted-foreground">{weekLesson.intro}</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              {t(L.weekOutcomes, locale)}
            </p>
            <ul className="mt-1 space-y-0.5">
              {weekLesson.outcomes.map((o) => (
                <li key={o} className="flex gap-1.5 text-[11px] leading-relaxed">
                  <Check className="size-3 mt-0.5 shrink-0 text-emerald-500" />
                  <span>{o}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              {t(L.cheatsheet, locale)}
            </p>
            <div className="mt-1 space-y-1">
              {weekLesson.syntax.map((s) => (
                <div key={s.code} className="rounded-lg border bg-card px-2 py-1">
                  <pre className="whitespace-pre-wrap font-mono text-[11px] text-primary">{s.code}</pre>
                  <p className="text-[10px] text-muted-foreground">{s.note}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Problem picker ─────────────────────────────────────────────── */}
      <div>
        <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          {t(L.pickProblem, locale)}
        </p>
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {weekProblems.map((p, i) => {
            const done = Boolean(progress.solved[p.id]);
            const active = p.id === problemId;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setProblemId(p.id)}
                className={cn(
                  "shrink-0 flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition-colors cursor-pointer",
                  active ? "border-primary bg-primary/10 font-semibold" : "hover:bg-muted/50",
                )}
              >
                {done ? (
                  <Check className="size-3 text-emerald-500" />
                ) : (
                  <span className="text-muted-foreground">{i + 1}.</span>
                )}
                <span className="max-w-[170px] truncate">{p.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Dual pane ──────────────────────────────────────────────────── */}
      <div className="grid gap-4 lg:grid-cols-2 items-start">
        {/* Left: teaching material, statement, cases */}
        <div className="rounded-2xl border bg-card overflow-hidden">
          <div className="flex items-center gap-2 border-b px-3 py-2">
            <Badge variant="outline" className="rounded-full text-[10px]">
              Week {problem.week} · {problem.item}
            </Badge>
            <h2 className="text-sm font-bold truncate">{problem.title}</h2>
            <Badge variant="outline" className="ml-auto rounded-full text-[10px] shrink-0">
              {POINTS_PER_PROBLEM} {t(L.points, locale)}
            </Badge>
          </div>

          <div className="flex gap-1 border-b px-2 py-1.5">
            {([
              ["lesson", L.lesson, BookOpen],
              ["problem", L.problem, ScrollText],
              ["cases", L.cases, FlaskConical],
            ] as const).map(([id, label, Icon]) => (
              <button
                key={id}
                type="button"
                onClick={() => setPane(id)}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs transition-colors cursor-pointer",
                  pane === id ? "bg-primary/10 font-semibold text-primary" : "text-muted-foreground hover:bg-muted/50",
                )}
              >
                <Icon className="size-3.5" />
                {t(label, locale)}
                {id === "cases" && (
                  <span className="tabular-nums text-[10px]">({problem.cases.length})</span>
                )}
              </button>
            ))}
          </div>

          <div className="max-h-[560px] overflow-y-auto p-3">
            {pane === "lesson" && (
              <div className="space-y-3">
                <div className="rounded-xl border border-primary/20 bg-primary/5 px-3 py-2">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-primary">
                    {t(L.goal, locale)}
                  </p>
                  <p className="mt-0.5 text-xs leading-relaxed">{lesson.goal}</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {lesson.concepts.map((c) => (
                      <Badge key={c} variant="outline" className="rounded-full font-mono text-[10px]">
                        {c}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    {t(L.steps, locale)}
                  </p>
                  <ol className="mt-1.5 space-y-2">
                    {lesson.steps.map((s, i) => (
                      <li key={s.title} className="rounded-xl border bg-muted/20 px-3 py-2">
                        <p className="text-xs font-semibold">
                          <span className="mr-1.5 inline-flex size-4 items-center justify-center rounded-full bg-primary/15 text-[10px] text-primary">
                            {i + 1}
                          </span>
                          {s.title}
                        </p>
                        <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{s.detail}</p>
                        {s.code && (
                          <pre className="mt-1.5 whitespace-pre overflow-x-auto rounded-lg border bg-card px-2.5 py-1.5 font-mono text-[11px]">
                            {s.code}
                          </pre>
                        )}
                      </li>
                    ))}
                  </ol>
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-destructive">
                    {t(L.pitfalls, locale)}
                  </p>
                  <ul className="mt-1.5 space-y-1">
                    {lesson.pitfalls.map((p) => (
                      <li
                        key={p}
                        className="flex gap-1.5 rounded-lg border border-destructive/20 bg-destructive/5 px-2.5 py-1.5 text-[11px] leading-relaxed"
                      >
                        <AlertTriangle className="size-3 mt-0.5 shrink-0 text-destructive" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {pane === "problem" && (
              <div className="text-sm">
                <MdView markdown={problem.descriptionMd} />
              </div>
            )}

            {pane === "cases" && (
              <div className="space-y-2">
                {problem.cases.map((c, i) => (
                  <CaseCard key={c.id} index={i} testCase={c} state={results[c.id]} locale={locale} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: the compiler */}
        <div className="rounded-2xl border bg-card overflow-hidden">
          <div className="flex flex-wrap items-center gap-1.5 border-b px-3 py-2">
            <Code2 className="size-4 text-primary" />
            <span className="text-sm font-bold">{t(L.editor, locale)}</span>
            <div className="ml-auto flex flex-wrap items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-[11px]"
                onClick={() => saveCode(lesson.starter)}
              >
                {t(L.starter, locale)}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-[11px]"
                onClick={() => saveCode("")}
              >
                {t(L.clear, locale)}
              </Button>
            </div>
          </div>

          <textarea
            ref={editorRef}
            value={code}
            onChange={(e) => saveCode(e.target.value)}
            onKeyDown={onEditorKeyDown}
            spellCheck={false}
            placeholder={
              locale === "th"
                ? '# กด "โหลดโครงร่าง" เพื่อเริ่มจากโครงที่มี TODO กำกับ\n# แล้วกด Ctrl+Enter เพื่อตรวจ'
                : '# Click "Load scaffold" to start from a TODO outline\n# Then press Ctrl+Enter to run'
            }
            className="h-[300px] w-full resize-y border-0 bg-transparent px-3 py-2 font-mono text-xs leading-relaxed outline-none"
          />

          {importHits.length > 0 && (
            <div className="mx-3 mb-2 rounded-xl border border-amber-500/40 bg-amber-500/10 px-3 py-2">
              <p className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-700 dark:text-amber-400">
                <AlertTriangle className="size-3.5" />
                {t(L.importWarning, locale)}
              </p>
              <ul className="mt-1 space-y-0.5">
                {importHits.map((h) => (
                  <li key={h.line} className="font-mono text-[10px] text-muted-foreground">
                    {locale === "th" ? "บรรทัด" : "line"} {h.line}: {h.text}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2 border-t px-3 py-2">
            <Button size="sm" disabled={running || !code.trim()} onClick={() => void runCases(problem.cases)}>
              {running ? <Loader2 className="size-3.5 animate-spin" /> : <Play className="size-3.5" />}
              {running ? t(L.running, locale) : t(L.runAll, locale)}
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={running || !code.trim()}
              onClick={() => void runCases(problem.cases.slice(0, 1))}
            >
              {t(L.runFirst, locale)}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="text-[11px]"
              onClick={() => {
                if (showAnswer) {
                  setShowAnswer(false);
                } else if (window.confirm(t(L.revealConfirm, locale))) {
                  setShowAnswer(true);
                }
              }}
            >
              <Eye className="size-3.5" />
              {showAnswer ? t(L.hideAnswer, locale) : t(L.reveal, locale)}
            </Button>
            <span className="ml-auto text-[10px] text-muted-foreground">Ctrl+Enter</span>
          </div>

          {engine === "loading" && (
            <p className="border-t px-3 py-2 text-[11px] text-muted-foreground">
              <Loader2 className="mr-1 inline size-3 animate-spin" />
              {t(L.loadingEngine, locale)}
            </p>
          )}
          {engine === "error" && (
            <p className="border-t px-3 py-2 text-[11px] text-destructive">{t(L.engineError, locale)}</p>
          )}

          {ranCount > 0 && (
            <div
              className={cn(
                "border-t px-3 py-2",
                allPassed ? "bg-emerald-500/10" : "bg-muted/30",
              )}
            >
              <p className="text-xs font-semibold">
                {allPassed ? (
                  <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                    <Check className="size-4" />
                    {t(L.allPassed, locale)} +{POINTS_PER_PROBLEM} {t(L.points, locale)}
                  </span>
                ) : (
                  <span className="tabular-nums">
                    {passedCount} / {problem.cases.length} {t(L.passed, locale)}
                  </span>
                )}
              </p>
              <div className="mt-1.5 flex flex-wrap gap-1">
                {problem.cases.map((c, i) => (
                  <span
                    key={c.id}
                    title={`${i + 1}`}
                    className={cn(
                      "inline-flex size-5 items-center justify-center rounded font-mono text-[10px]",
                      results[c.id]?.status === "P"
                        ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300"
                        : results[c.id]
                        ? "bg-destructive/20 text-destructive"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    {results[c.id]?.status ?? "·"}
                  </span>
                ))}
              </div>
              {!allPassed && (
                <button
                  type="button"
                  onClick={() => setPane("cases")}
                  className="mt-1.5 text-[11px] text-primary underline underline-offset-2 cursor-pointer"
                >
                  {locale === "th" ? "ดูว่าเคสไหนไม่ผ่าน →" : "See which cases failed →"}
                </button>
              )}
            </div>
          )}

          {showAnswer && (
            <div className="border-t p-3 space-y-1.5">
              <p className="text-[10px] leading-relaxed text-muted-foreground">
                {t(L.referenceNote, locale)}
              </p>
              <pre className="whitespace-pre overflow-x-auto rounded-xl border bg-muted/30 px-3 py-2 font-mono text-[11px]">
                {problem.reference}
              </pre>
            </div>
          )}
        </div>
      </div>

      <p className="text-[10px] leading-relaxed text-muted-foreground">
        {locale === "th"
          ? `โจทย์และเคสทดสอบดึงจากระบบของวิชา ${COMPRO_META.course} (${COMPRO_META.term}) — ${COMPRO_META.problemCount} ข้อ ${COMPRO_META.caseCount} เคส · โค้ดรันในเบราว์เซอร์ด้วย Pyodide ไม่มีการส่งขึ้นเซิร์ฟเวอร์ · ความคืบหน้าเก็บใน localStorage ของเครื่องนี้เท่านั้น`
          : `Problems and cases extracted from the ${COMPRO_META.course} portal (${COMPRO_META.term}) — ${COMPRO_META.problemCount} problems, ${COMPRO_META.caseCount} cases. Code runs in your browser via Pyodide; progress is stored in this device's localStorage only.`}
      </p>
    </div>
  );
}
