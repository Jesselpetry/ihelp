"use client";

import { useState, useRef, useCallback, useMemo } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { indentWithTab } from "@codemirror/commands";
import { indentUnit, HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { keymap, EditorView } from "@codemirror/view";
import { tags as t } from "@lezer/highlight";
import {
  Check,
  Code2,
  Copy,
  Download,
  FileCode,
  Loader2,
  Maximize2,
  Minimize2,
  Play,
  RotateCcw,
  Sparkles,
  Wand2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLocale, t as tr, type LText } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const L: Record<string, LText> = {
  pythonVer: { th: "Python 3.11", en: "Python 3.11" },
  saved: { th: "บันทึกแล้ว", en: "Saved" },
  saving: { th: "กำลังบันทึก...", en: "Saving..." },
  reset: { th: "ล้างโค้ด (Reset)", en: "Reset Code" },
  resetConfirm: { th: "ต้องการรีเซ็ตโค้ดเป็นค่าเริ่มต้นหรือไม่?", en: "Reset code to starter template?" },
  format: { th: "จัดรูปแบบโค้ด (Format)", en: "Format Code" },
  formatted: { th: "จัดรูปแบบแล้ว", en: "Formatted" },
  copyAll: { th: "คัดลอกโค้ดทั้งหมด", en: "Copy All" },
  copied: { th: "คัดลอกแล้ว", en: "Copied" },
  fullscreen: { th: "เต็มหน้าจอ", en: "Fullscreen" },
  exitFullscreen: { th: "ออกจากเต็มหน้าจอ", en: "Exit Fullscreen" },
  runTests: { th: "รันเทส (Run Tests)", en: "Run Tests" },
  running: { th: "กำลังรัน...", en: "Running..." },
  shortcutHint: { th: "Ctrl+Enter หรือ ⌘Enter เพื่อรัน", en: "Ctrl+Enter to run" },
  exportSolution: { th: "ส่งออกโค้ด (Export)", en: "Export Solution" },
  exportPy: { th: "ส่งออกไฟล์ .py", en: "Export .py file" },
  exportJson: { th: "ส่งออกไฟล์ .json (Workspace)", en: "Export .json workspace" },
  duration: { th: "เวลาที่ใช้", en: "Duration" },
  loadStarter: { th: "โค้ดเริ่มต้น", en: "Load Starter" },
};

/** Solid Neutral Dark theme matching professional IDE / VS Code dark surfaces */
const pscpEditorTheme = EditorView.theme(
  {
    "&": {
      backgroundColor: "#0d0d11",
      color: "#f4f4f5",
      height: "100%",
      fontSize: "13px",
      fontFamily:
        "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
    },
    ".cm-scroller": {
      lineHeight: "1.6",
      backgroundColor: "#0d0d11",
    },
    ".cm-content": {
      caretColor: "oklch(0.65 0.24 350)", // PSCP Pink
      padding: "10px 0",
    },
    ".cm-cursor, .cm-dropCursor": {
      borderLeftColor: "oklch(0.65 0.24 350)",
      borderLeftWidth: "2px",
    },
    "&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection": {
      backgroundColor: "rgba(236, 72, 153, 0.25) !important",
    },
    ".cm-gutters": {
      backgroundColor: "#0d0d11",
      color: "#71717a",
      borderRight: "1px solid #1e1e26",
      paddingRight: "8px",
      userSelect: "none",
    },
    ".cm-gutterElement": {
      paddingLeft: "10px",
      color: "#71717a",
      opacity: "0.7",
    },
    ".cm-activeLineGutter": {
      backgroundColor: "#16161f",
      color: "#f4f4f5",
      opacity: "1",
      fontWeight: "bold",
    },
    ".cm-activeLine": {
      backgroundColor: "#16161f",
    },
    ".cm-foldPlaceholder": {
      backgroundColor: "#272733",
      border: "none",
      color: "#a1a1aa",
    },
    ".cm-matchingBracket, .cm-nonmatchingBracket": {
      backgroundColor: "rgba(255, 255, 255, 0.15)",
      outline: "1px solid rgba(255, 255, 255, 0.3)",
      borderRadius: "2px",
    },
  },
  { dark: true },
);

const pscpSyntaxHighlight = HighlightStyle.define([
  { tag: t.keyword, color: "#f472b6", fontWeight: "600" }, // Pink
  { tag: [t.name, t.deleted, t.character, t.propertyName, t.macroName], color: "#e4e4e7" },
  { tag: [t.function(t.variableName), t.labelName], color: "#60a5fa" }, // Sky/Blue
  { tag: [t.color, t.constant(t.name), t.standard(t.name)], color: "#38bdf8" },
  { tag: [t.definition(t.name), t.separator], color: "#f4f4f5" },
  {
    tag: [t.typeName, t.className, t.number, t.changed, t.annotation, t.modifier, t.self, t.namespace],
    color: "#fb923c",
  }, // Orange
  { tag: [t.operator, t.operatorKeyword, t.url, t.escape, t.regexp, t.link, t.special(t.string)], color: "#f43f5e" },
  { tag: [t.meta, t.comment], color: "#71717a", fontStyle: "italic" }, // Gray
  { tag: t.strong, fontWeight: "bold" },
  { tag: t.emphasis, fontStyle: "italic" },
  { tag: [t.atom, t.bool, t.special(t.variableName)], color: "#f87171" }, // Red
  { tag: [t.processingInstruction, t.string, t.inserted], color: "#4ade80" }, // Emerald
  { tag: t.invalid, color: "#ef4444" },
]);

/** Format Python code: normalize 4-space indent, clean trailing spaces, normalize blank lines */
function formatPythonCode(source: string): string {
  const lines = source.split("\n");
  const cleaned: string[] = [];
  let blankCount = 0;

  for (const line of lines) {
    const trimmedRight = line.replace(/\s+$/, "");
    if (trimmedRight.trim().length === 0) {
      blankCount++;
      if (blankCount <= 2) {
        cleaned.push("");
      }
    } else {
      blankCount = 0;
      // Convert leading tabs to 4 spaces
      const leadingMatch = trimmedRight.match(/^[\t ]+/);
      if (leadingMatch) {
        const leading = leadingMatch[0];
        const rest = trimmedRight.slice(leading.length);
        const spaces = leading.replace(/\t/g, "    ");
        cleaned.push(spaces + rest);
      } else {
        cleaned.push(trimmedRight);
      }
    }
  }

  return cleaned.join("\n").trim() + "\n";
}

function downloadFile(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export interface CodeEditorProps {
  problemId: number | string;
  problemTitle?: string;
  initialCode?: string;
  starterCode?: string;
  value?: string;
  onChange?: (code: string) => void;
  onRun?: () => void;
  running?: boolean;
  durationMs?: number;
  memoryFormatted?: string;
  className?: string;
}

export function CodeEditor({
  problemId,
  problemTitle = "Solution",
  initialCode,
  starterCode,
  value: controlledValue,
  onChange: controlledOnChange,
  onRun,
  running = false,
  durationMs,
  memoryFormatted,
  className,
}: CodeEditorProps) {
  const { locale } = useLocale();
  const primaryStorageKey = `pscp_problem_${problemId}`;
  const legacyStorageKey = `ihelp-grader-draft-v1-${problemId}`;

  // Default starter code
  const defaultStarter = starterCode ?? initialCode ?? "";

  // Local state initialized from storage
  const [code, setCode] = useState<string>(() => {
    if (controlledValue !== undefined) return controlledValue;
    if (typeof window === "undefined") return defaultStarter;
    try {
      const saved =
        window.localStorage.getItem(primaryStorageKey) ??
        window.localStorage.getItem(legacyStorageKey);
      if (saved !== null && typeof saved === "string" && saved !== "[object Object]") {
        return saved;
      }
    } catch {}
    return defaultStarter;
  });

  const [saveStatus, setSaveStatus] = useState<"saved" | "saving">("saved");
  const [copied, setCopied] = useState(false);
  const [formatted, setFormatted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const displayCode = controlledValue !== undefined ? controlledValue : code;

  // Handle code change and auto-save
  const handleCodeChange = useCallback(
    (newVal: string) => {
      setCode(newVal);
      controlledOnChange?.(newVal);
      setSaveStatus("saving");

      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = setTimeout(() => {
        try {
          window.localStorage.setItem(primaryStorageKey, newVal);
          window.localStorage.setItem(legacyStorageKey, newVal);
        } catch {}
        setSaveStatus("saved");
      }, 400);
    },
    [controlledOnChange, primaryStorageKey, legacyStorageKey],
  );

  // Reset code handler
  const handleReset = () => {
    if (displayCode.trim().length > 0 && !window.confirm(tr(L.resetConfirm, locale))) {
      return;
    }
    const next = starterCode ?? "";
    handleCodeChange(next);
  };

  // Format code handler
  const handleFormat = () => {
    const formattedCode = formatPythonCode(displayCode);
    handleCodeChange(formattedCode);
    setFormatted(true);
    setTimeout(() => setFormatted(false), 1500);
  };

  // Copy code handler
  const handleCopy = () => {
    navigator.clipboard.writeText(displayCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  // Export handlers
  const handleExportPy = () => {
    const cleanId = String(problemId).replace(/[^a-zA-Z0-9_-]/g, "");
    downloadFile(`oj${cleanId}_solution.py`, displayCode, "text/x-python;charset=utf-8");
  };

  const handleExportJson = () => {
    const cleanId = String(problemId).replace(/[^a-zA-Z0-9_-]/g, "");
    const data = {
      problemId,
      problemTitle,
      code: displayCode,
      exportedAt: new Date().toISOString(),
    };
    downloadFile(
      `oj${cleanId}_workspace.json`,
      JSON.stringify(data, null, 2),
      "application/json;charset=utf-8",
    );
  };

  // CodeMirror extensions
  const extensions = useMemo(() => {
    return [
      python(),
      indentUnit.of("    "),
      keymap.of([
        indentWithTab,
        {
          key: "Mod-Enter",
          run: () => {
            onRun?.();
            return true;
          },
        },
      ]),
      pscpEditorTheme,
      syntaxHighlighting(pscpSyntaxHighlight),
      EditorView.lineWrapping,
    ];
  }, [onRun]);

  return (
    <div
      className={cn(
        "flex flex-col rounded-2xl border border-zinc-800/80 bg-[#141419] shadow-sm overflow-hidden text-zinc-100 transition-all",
        isFullscreen
          ? "fixed inset-0 z-50 rounded-none border-none bg-[#0d0d11] p-4 sm:p-6"
          : "min-h-[22rem]",
        className,
      )}
    >
      {/* Editor Header Utility Bar */}
      <div className="flex shrink-0 items-center justify-between border-b border-zinc-800/80 bg-[#181820] px-4 py-2.5">
        {/* Left: Language indicator and status dot */}
        <div className="flex items-center gap-2.5">
          <span className="flex items-center gap-1.5 font-mono text-xs font-semibold text-zinc-100">
            <Code2 className="size-3.5 text-primary" />
            {tr(L.pythonVer, locale)}
          </span>

          <span className="text-zinc-600 select-none">·</span>

          <span className="flex items-center gap-1.5 text-xs text-zinc-400">
            <span
              className={cn(
                "size-1.5 rounded-full transition-colors",
                saveStatus === "saved" ? "bg-emerald-400" : "bg-amber-400 animate-pulse",
              )}
            />
            <span>{saveStatus === "saved" ? tr(L.saved, locale) : tr(L.saving, locale)}</span>
          </span>
        </div>

        {/* Right: Utility Tools grouped into compact ghost icon buttons */}
        <div className="flex items-center gap-0.5">
          {starterCode && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => handleCodeChange(starterCode)}
              className="h-7 cursor-pointer gap-1 px-2 text-[11px] text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60"
              title={tr(L.loadStarter, locale)}
            >
              <Sparkles className="size-3 text-amber-400" />
              <span className="hidden sm:inline">{tr(L.loadStarter, locale)}</span>
            </Button>
          )}

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="size-7 cursor-pointer p-0 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60"
            title={tr(L.reset, locale)}
            aria-label={tr(L.reset, locale)}
          >
            <RotateCcw className="size-3.5" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleFormat}
            className="size-7 cursor-pointer p-0 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60"
            title={formatted ? tr(L.formatted, locale) : tr(L.format, locale)}
            aria-label={tr(L.format, locale)}
          >
            {formatted ? (
              <Check className="size-3.5 text-emerald-400" />
            ) : (
              <Wand2 className="size-3.5" />
            )}
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="size-7 cursor-pointer p-0 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60"
            title={copied ? tr(L.copied, locale) : tr(L.copyAll, locale)}
            aria-label={tr(L.copyAll, locale)}
          >
            {copied ? (
              <Check className="size-3.5 text-emerald-400" />
            ) : (
              <Copy className="size-3.5" />
            )}
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setIsFullscreen((prev) => !prev)}
            className="size-7 cursor-pointer p-0 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60"
            title={isFullscreen ? tr(L.exitFullscreen, locale) : tr(L.fullscreen, locale)}
            aria-label={isFullscreen ? tr(L.exitFullscreen, locale) : tr(L.fullscreen, locale)}
          >
            {isFullscreen ? (
              <Minimize2 className="size-3.5" />
            ) : (
              <Maximize2 className="size-3.5" />
            )}
          </Button>
        </div>
      </div>

      {/* CodeMirror Editor Body */}
      <div className="relative min-h-0 flex-1 overflow-hidden bg-[#0d0d11]">
        <CodeMirror
          value={displayCode}
          height={isFullscreen ? "calc(100vh - 10rem)" : "100%"}
          className="h-full min-h-[14rem] overflow-auto text-sm"
          theme="dark"
          basicSetup={{
            lineNumbers: true,
            highlightActiveLineGutter: true,
            bracketMatching: true,
            closeBrackets: true,
            autocompletion: true,
            indentOnInput: true,
            foldGutter: true,
          }}
          extensions={extensions}
          onChange={handleCodeChange}
        />
      </div>

      {/* Editor Bottom Action Bar */}
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-t border-zinc-800/80 bg-[#181820] px-4 py-2.5">
        {/* Left: Execution readout & shortcut hint */}
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          {durationMs !== undefined ? (
            <span className="font-mono tabular-nums text-zinc-200">
              {tr(L.duration, locale)}: {durationMs}ms
              {memoryFormatted && ` · ${memoryFormatted}`}
            </span>
          ) : (
            <span className="text-[11px] text-zinc-500">
              {tr(L.shortcutHint, locale)}
            </span>
          )}
        </div>

        {/* Right: Primary CTA and Export solutions dropdown */}
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 cursor-pointer gap-1.5 rounded-full border-zinc-700 bg-zinc-800/60 px-3 text-xs font-normal text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
              >
                <Download className="size-3.5" />
                <span>{tr(L.exportSolution, locale)}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-[#181820] border-zinc-800 text-zinc-200">
              <DropdownMenuItem onClick={handleExportPy} className="cursor-pointer gap-2 text-xs focus:bg-zinc-800 focus:text-zinc-100">
                <FileCode className="size-4 text-primary" />
                <span>{tr(L.exportPy, locale)}</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportJson} className="cursor-pointer gap-2 text-xs focus:bg-zinc-800 focus:text-zinc-100">
                <Download className="size-4 text-zinc-400" />
                <span>{tr(L.exportJson, locale)}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            type="button"
            size="sm"
            onClick={onRun}
            disabled={running}
            className="h-8 cursor-pointer gap-1.5 rounded-full bg-primary hover:bg-primary/90 px-4 text-xs font-semibold text-primary-foreground shadow-sm transition-transform active:scale-95 disabled:pointer-events-none"
          >
            {running ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                <span>{tr(L.running, locale)}</span>
              </>
            ) : (
              <>
                <Play className="size-3.5 fill-current" />
                <span>{tr(L.runTests, locale)}</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
