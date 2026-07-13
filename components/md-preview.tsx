"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Code, BookOpenText, ChevronDown } from "lucide-react";
import { MdView } from "@/components/md-view";
import { useLocale, t, type LText } from "@/lib/i18n";

const L: Record<string, LText> = {
  raw: { th: "Raw .md", en: "Raw .md" },
  reader: { th: "แบบอ่านง่าย", en: "Reader" },
  scrollDown: { th: "เลื่อนลงอ่านให้ถึงล่างสุด", en: "Scroll to the bottom" },
};

// distance from the bottom (px) that still counts as "read to the end"
const BOTTOM_SLOP = 8;

// Wizard preview: raw markdown / rendered reader, switchable.
// onReachedBottom fires once the reader has scrolled to the end of the file
// (or the file is short enough to fit without scrolling). While there is more
// to read, a bounce indicator nudges the student to keep scrolling.
export function MarkdownPreview({
  markdown,
  onReachedBottom,
}: {
  markdown: string;
  onReachedBottom?: () => void;
}) {
  const { locale } = useLocale();
  const [tab, setTab] = useState<"raw" | "reader">("raw");
  const [atBottom, setAtBottom] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  const checkBottom = useCallback(
    (el: HTMLElement) => {
      const reached = el.scrollHeight - el.scrollTop - el.clientHeight <= BOTTOM_SLOP;
      setAtBottom(reached);
      if (reached) onReachedBottom?.();
    },
    [onReachedBottom],
  );

  // A short file never scrolls, so treat it as already read once rendered.
  // Re-checks when the content or the active tab changes.
  useEffect(() => {
    if (scrollRef.current) checkBottom(scrollRef.current);
  }, [markdown, tab, checkBottom]);

  const scrollToBottom = () =>
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });

  return (
    <div className="rounded-lg border bg-background overflow-hidden">
      <div className="flex items-center gap-1 border-b bg-muted/40 px-2 py-1.5">
        {(
          [
            ["raw", L.raw, Code],
            ["reader", L.reader, BookOpenText],
          ] as const
        ).map(([key, label, Icon]) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={
              "inline-flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium transition-colors " +
              (tab === key
                ? "bg-card border shadow-sm text-primary"
                : "text-muted-foreground hover:text-foreground")
            }
          >
            <Icon className="size-3.5" />
            {t(label, locale)}
          </button>
        ))}
      </div>
      <div className="relative">
        <div
          ref={scrollRef}
          onScroll={(e) => checkBottom(e.currentTarget)}
          className="max-h-[50vh] overflow-y-auto"
        >
          {tab === "raw" ? (
            <pre className="text-xs p-4 whitespace-pre-wrap">{markdown}</pre>
          ) : (
            <div className="px-5 py-4">
              <MdView markdown={markdown} />
            </div>
          )}
        </div>

        {/* nudge the student to keep scrolling until the end is reached */}
        <div
          className={
            "pointer-events-none absolute inset-x-0 bottom-0 flex justify-center pb-2 pt-8 " +
            "bg-gradient-to-t from-background to-transparent transition-opacity duration-200 " +
            (atBottom ? "opacity-0" : "opacity-100")
          }
        >
          <button
            type="button"
            onClick={scrollToBottom}
            className="pointer-events-auto inline-flex items-center gap-1.5 rounded-full border bg-card px-3 py-1 text-xs font-medium text-primary shadow-sm hover:bg-muted"
          >
            <ChevronDown className="size-3.5 animate-bounce" />
            {t(L.scrollDown, locale)}
          </button>
        </div>
      </div>
    </div>
  );
}
