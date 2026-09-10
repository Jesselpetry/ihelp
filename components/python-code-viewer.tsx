"use client";

import { useState } from "react";
import {
  Check,
  Copy,
  Download,
  Code2,
  Sparkles,
  Lightbulb,
  Cpu,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { QuizLaunchButton } from "@/components/quiz-launch-button";

import { PROBLEM_TAKEAWAYS } from "@/lib/problem-takeaways";


/**
 * High-performance Python syntax highlighter that returns tokenized lines.
 */
function highlightPythonLine(line: string): React.ReactNode[] {
  // Python syntax token regex
  const regex =
    /(#.*$)|(\b(?:def|return|if|elif|else|for|while|in|import|from|as|pass|break|continue|and|or|not|is|None|True|False|class|lambda|try|except|finally|raise|with|yield|async|await)\b)|(\b(?:print|input|int|float|str|bool|list|dict|set|tuple|range|len|sum|min|max|abs|round|enumerate|zip|map|filter|sorted|any|all|math|sqrt|factorial|lower|upper|strip|split|join)\b)|("[^"\\]*(?:\\.[^"\\]*)*"|'[^'\\]*(?:\\.[^'\\]*)*')|(\b\d+(?:\.\d+)?\b)|(==|!=|<=|>=|\+=|-=|\*=|\/=|%=|\*\*|\/\/|[+\-*/%<>=])/g;

  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(line)) !== null) {
    // Normal text before match
    if (match.index > lastIndex) {
      nodes.push(
        <span key={`txt-${lastIndex}`} className="text-zinc-200">
          {line.slice(lastIndex, match.index)}
        </span>,
      );
    }

    const [
      ,
      comment,
      keyword,
      builtin,
      stringLit,
      numberLit,
      operator,
    ] = match;

    if (comment) {
      nodes.push(
        <span key={`cmt-${match.index}`} className="text-zinc-400 dark:text-zinc-500 italic">
          {comment}
        </span>,
      );
    } else if (keyword) {
      // PSCP Pink (--primary) for Python keywords.
      nodes.push(
        <span key={`kw-${match.index}`} className="text-primary font-semibold">
          {keyword}
        </span>,
      );
    } else if (builtin) {
      // Cyan / Blue for Built-in functions
      nodes.push(
        <span key={`bi-${match.index}`} className="text-sky-400 dark:text-sky-300 font-medium">
          {builtin}
        </span>,
      );
    } else if (stringLit) {
      // Emerald Green for Strings
      nodes.push(
        <span key={`str-${match.index}`} className="text-emerald-400 dark:text-emerald-300">
          {stringLit}
        </span>,
      );
    } else if (numberLit) {
      // Amber for Numbers
      nodes.push(
        <span key={`num-${match.index}`} className="text-amber-400 dark:text-amber-300">
          {numberLit}
        </span>,
      );
    } else if (operator) {
      // Violet for Operators
      nodes.push(
        <span key={`op-${match.index}`} className="text-violet-500 dark:text-violet-300">
          {operator}
        </span>,
      );
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < line.length) {
    nodes.push(
      <span key={`txt-${lastIndex}`} className="text-zinc-200">
        {line.slice(lastIndex)}
      </span>,
    );
  }

  return nodes;
}

export function PythonCodeViewer({
  code,
  problemId,
  problemName,
  technique,
  locale,
}: {
  code: string;
  problemId: number;
  problemName: string;
  technique: string;
  locale: "th" | "en";
}) {
  const [copied, setCopied] = useState(false);
  const lines = code.split("\n");
  const takeaway = PROBLEM_TAKEAWAYS[problemId];

  function handleCopy() {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleDownload() {
    const blob = new Blob([code], { type: "text/x-python;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `oj${problemId}_main.py`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      {/* Code Editor Container */}
      <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-[#090d13] text-zinc-100 shadow-lg">
        {/* Editor Toolbar */}
        <div className="flex items-center justify-between border-b border-zinc-800/80 bg-[#121720] px-4 py-2.5">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="size-3 rounded-full bg-rose-500/80" />
              <span className="size-3 rounded-full bg-amber-500/80" />
              <span className="size-3 rounded-full bg-emerald-500/80" />
            </div>
            <div className="h-4 w-px bg-zinc-700" />
            <div className="flex items-center gap-2">
              <Code2 className="size-3.5 text-primary" />
              <span className="font-mono text-xs font-semibold text-zinc-300">
                main.py
              </span>
              {problemName && (
                <span className="text-zinc-500 font-mono text-[11px] hidden md:inline">
                  ({problemName})
                </span>
              )}
              <Badge className="rounded-full bg-primary text-primary-foreground text-[10px] px-2 py-0 font-mono shadow-none">
                Python 3
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={handleDownload}
              className="h-7 px-2.5 text-xs text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-full gap-1"
              title="Download main.py"
            >
              <Download className="size-3.5" />
              <span className="hidden sm:inline">Download</span>
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleCopy}
              className="h-7 px-2.5 text-xs text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-full gap-1"
              title="Copy source code"
            >
              {copied ? (
                <>
                  <Check className="size-3.5 text-primary" />
                  <span className="text-primary font-semibold">
                    {locale === "th" ? "คัดลอกแล้ว" : "Copied"}
                  </span>
                </>
              ) : (
                <>
                  <Copy className="size-3.5" />
                  <span className="hidden sm:inline">
                    {locale === "th" ? "คัดลอกโค้ด" : "Copy Code"}
                  </span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Syntax Highlighted Lines with Line Numbers */}
        <pre className="overflow-x-auto p-3 sm:p-4 font-mono text-xs sm:text-sm leading-relaxed text-zinc-200">
          <table className="w-full border-collapse">
            <tbody>
              {lines.map((line, idx) => {
                const lineNum = idx + 1;
                return (
                  <tr key={idx} className="hover:bg-zinc-800/40 transition-colors">
                    <td className="w-8 sm:w-10 select-none pr-2 sm:pr-4 text-right text-[11px] sm:text-xs font-mono text-zinc-600 dark:text-zinc-600">
                      {lineNum < 10 ? `0${lineNum}` : lineNum}
                    </td>
                    <td className="whitespace-pre pl-1 sm:pl-2">
                      {highlightPythonLine(line)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </pre>
      </div>

      {/* Key Takeaway & Pattern Breakdown Card */}
      {takeaway && (
        <div className="rounded-2xl border bg-card p-4 sm:p-6 shadow-sm space-y-3.5 sm:space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-3">
            <div className="flex items-center gap-2">
              <Lightbulb className="size-4 text-primary" />
              <h3 className="font-bold text-foreground text-sm sm:text-base">
                {locale === "th" ? "จุดสำคัญ & Pattern การเขียนโค้ดข้อนี้" : "Key Takeaways & Pattern Analysis"}
              </h3>
            </div>
            <div className="flex items-center gap-2 max-w-full">
              <Badge className="rounded-2xl sm:rounded-full bg-primary text-primary-foreground text-[11px] sm:text-xs font-mono px-3 py-1 shadow-none max-w-full whitespace-normal break-words h-auto leading-relaxed text-left">
                {technique || "Pattern Practice"}
              </Badge>
            </div>
          </div>

          <p className="text-xs sm:text-sm font-medium text-foreground leading-relaxed">
            {locale === "th" ? takeaway.summary.th : takeaway.summary.en}
          </p>

          {/* Key Breakdown Bullet Points */}
          <div className="rounded-xl border bg-muted/20 p-4">
            <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-foreground mb-3">
              <Sparkles className="size-3.5 text-primary" />
              <span>{locale === "th" ? "สรุปหลักคิดสำคัญ (Core Logic)" : "Core Logic Highlights"}</span>
            </h4>
            <ul className="space-y-2 text-xs text-muted-foreground leading-relaxed">
              {takeaway.points.map((pt, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="flex size-4 items-center justify-center rounded-full bg-primary text-primary-foreground font-mono text-[10px] font-bold shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span className="text-foreground/90">
                    {locale === "th" ? pt.th : pt.en}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Complexity & PEP-8 Tips Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="rounded-xl border bg-card p-3.5 flex items-start gap-3">
              <Cpu className="size-4 text-primary shrink-0 mt-0.5" />
              <div>
                <span className="block text-[11px] font-semibold text-foreground uppercase tracking-wide">
                  {locale === "th" ? "ความซับซ้อน (Complexity)" : "Complexity"}
                </span>
                <span className="mt-1 block font-mono text-xs text-muted-foreground">
                  Time: <strong className="text-primary">{takeaway.complexity.time}</strong> · Space: <strong className="text-primary">{takeaway.complexity.space}</strong>
                </span>
              </div>
            </div>

            <div className="rounded-xl border bg-card p-3.5 flex items-start gap-3">
              <ShieldCheck className="size-4 text-primary shrink-0 mt-0.5" />
              <div>
                <span className="block text-[11px] font-semibold text-foreground uppercase tracking-wide">
                  {locale === "th" ? "คำแนะนำ PEP-8 (Code Style)" : "PEP-8 Guideline"}
                </span>
                <p className="mt-1 text-xs text-muted-foreground leading-snug">
                  {locale === "th" ? takeaway.pep8Tip.th : takeaway.pep8Tip.en}
                </p>
              </div>
            </div>
          </div>

          {/* Technique self-test quiz entry point */}
          <div className="pt-1">
            <QuizLaunchButton
              problemId={problemId}
              problemName={problemName}
              variant="default"
              size="sm"
              className="w-full sm:w-auto rounded-full gap-1.5"
            />
          </div>
        </div>
      )}
    </div>
  );
}
