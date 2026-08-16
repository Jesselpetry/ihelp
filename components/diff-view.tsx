"use client";

import { useLocale, t, type LText } from "@/lib/i18n";

const L: Record<string, LText> = {
  expected: { th: "คำตอบที่ถูกต้อง", en: "Expected" },
  actual: { th: "คำตอบที่ได้", en: "Actual" },
  firstDiff: {
    th: "ต่างกันครั้งแรกที่ตำแหน่งอักขระ",
    en: "First difference at character position",
  },
  identical: { th: "เหมือนกันทุกตัวอักษร", en: "Identical, character for character" },
  legend: {
    th: "· = ช่องว่าง, ↵ = ขึ้นบรรทัดใหม่",
    en: "· = space, ↵ = newline",
  },
};

/** Render a raw string with every space shown as `·` and every newline as `↵` (visible, inline). */
function renderVisible(text: string, diffIndex: number | null) {
  const nodes: React.ReactNode[] = [];
  let plainRun = "";
  let key = 0;

  function flushPlain() {
    if (plainRun.length > 0) {
      nodes.push(<span key={`p-${key++}`}>{plainRun}</span>);
      plainRun = "";
    }
  }

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const isDiffChar = diffIndex !== null && i === diffIndex;
    const wrapperClass = isDiffChar
      ? "bg-destructive/25 text-destructive rounded-sm outline outline-1 outline-destructive/60"
      : "";

    if (ch === " ") {
      flushPlain();
      nodes.push(
        <span
          key={`s-${key++}`}
          className={`text-muted-foreground/70 ${wrapperClass}`}
        >
          ·
        </span>,
      );
    } else if (ch === "\n") {
      flushPlain();
      nodes.push(
        <span key={`n-${key++}`} className={`text-muted-foreground/70 ${wrapperClass}`}>
          ↵
        </span>,
      );
      nodes.push(<br key={`br-${key++}`} />);
    } else if (isDiffChar) {
      flushPlain();
      nodes.push(
        <span key={`d-${key++}`} className={wrapperClass}>
          {ch}
        </span>,
      );
    } else {
      plainRun += ch;
    }
  }
  flushPlain();

  // Mark a diff position that falls exactly at end-of-string (length mismatch).
  if (diffIndex !== null && diffIndex >= text.length) {
    nodes.push(
      <span
        key={`d-end-${key++}`}
        className="bg-destructive/25 text-destructive rounded-sm outline outline-1 outline-destructive/60 px-0.5"
      >
        &nbsp;
      </span>,
    );
  }

  return nodes;
}

function firstDivergence(a: string, b: string): number | null {
  const len = Math.min(a.length, b.length);
  for (let i = 0; i < len; i++) {
    if (a[i] !== b[i]) return i;
  }
  if (a.length !== b.length) return len;
  return null;
}

/**
 * Stacked diff view: `expected` on top, `actual` below, both rendered with
 * spaces as `·` and newlines as `↵` so whitespace/precision mismatches are
 * immediately visible. The first differing character position is highlighted
 * in both strings.
 */
export function DiffView({ expected, actual }: { expected: string; actual: string }) {
  const { locale } = useLocale();
  const diffIndex = firstDivergence(expected, actual);

  return (
    <div className="rounded-xl border bg-muted/20 overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b bg-muted/30 px-3 py-1.5">
        <span className="text-[11px] font-medium text-muted-foreground">
          {diffIndex === null ? t(L.identical, locale) : `${t(L.firstDiff, locale)} ${diffIndex}`}
        </span>
        <span className="text-[11px] font-mono text-muted-foreground/70">{t(L.legend, locale)}</span>
      </div>

      <div className="divide-y">
        <div className="overflow-x-auto">
          <div className="min-w-full px-3 py-2">
            <div className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
              {t(L.expected, locale)}
            </div>
            <pre className="whitespace-pre font-mono text-xs leading-relaxed text-foreground">
              {renderVisible(expected, diffIndex)}
            </pre>
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-full px-3 py-2">
            <div className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
              {t(L.actual, locale)}
            </div>
            <pre className="whitespace-pre font-mono text-xs leading-relaxed text-foreground">
              {renderVisible(actual, diffIndex)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
