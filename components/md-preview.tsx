"use client";

import { useState } from "react";
import { Code, BookOpenText } from "lucide-react";
import { MdView } from "@/components/md-view";
import { useLocale, t, type LText } from "@/lib/i18n";

const L: Record<string, LText> = {
  raw: { th: "Raw .md", en: "Raw .md" },
  reader: { th: "แบบอ่านง่าย", en: "Reader" },
};

// Wizard preview: raw markdown / rendered reader, switchable.
export function MarkdownPreview({ markdown }: { markdown: string }) {
  const { locale } = useLocale();
  const [tab, setTab] = useState<"raw" | "reader">("raw");
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
      <div className="max-h-[50vh] overflow-y-auto">
        {tab === "raw" ? (
          <pre className="text-xs p-4 whitespace-pre-wrap">{markdown}</pre>
        ) : (
          <div className="px-5 py-4">
            <MdView markdown={markdown} />
          </div>
        )}
      </div>
    </div>
  );
}
