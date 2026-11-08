"use client";

import { useState } from "react";
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Check,
  Copy,
  ExternalLink,
  FileText,
  Lightbulb,
  TriangleAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { MdView } from "@/components/md-view";
import { useLocale, t, type LText } from "@/lib/i18n";
import type { PscpStatement, PscpTakeawayPoint } from "@/lib/pscp/pscp";
import type { TestCase } from "@/lib/pscp/grader-types";
import { cn } from "@/lib/utils";

const L: Record<string, LText> = {
  statement: { th: "คำอธิบายโจทย์", en: "Problem Description" },
  inputSpec: { th: "รูปแบบอินพุต (Input Specification)", en: "Input Specification" },
  outputSpec: { th: "รูปแบบเอาต์พุต (Output Specification)", en: "Output Specification" },
  rawSampleInput: { th: "ตัวอย่างอินพุตดิบ (Sample stdin)", en: "Sample Input (stdin)" },
  rawSampleOutput: { th: "ตัวอย่างเอาต์พุตที่คาดหวัง (Expected stdout)", en: "Sample Expected Output" },
  copy: { th: "คัดลอก", en: "Copy" },
  copied: { th: "คัดลอกแล้ว", en: "Copied" },
  pitfalls: { th: "จุดที่มักพลาด (Common Pitfalls & Constraints)", en: "Common Pitfalls & Constraints" },
  takeaways: { th: "จุดสำคัญของข้อนี้ (Key Takeaways)", en: "Key Takeaways" },
  authorNote: { th: "โน้ตจากผู้ออกโจทย์", en: "Author's Note" },
  noStatement: {
    th: "iJudge ไม่ได้เปิดเผยตัวโจทย์ของข้อนี้ไว้ในชุดข้อมูลที่นำเข้า — สามารถกดเปิดบน iJudge เพื่ออ่านโจทย์ฉบับเต็ม",
    en: "iJudge did not expose this problem's statement in the imported export — open it on iJudge to read the full text.",
  },
  onIJudge: { th: "เปิดอ่านบน iJudge", en: "Open on iJudge" },
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
      className="inline-flex cursor-pointer items-center gap-1 rounded-md px-2 py-0.5 font-mono text-[11px] text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground"
      title={copied ? t(L.copied, locale) : t(L.copy, locale)}
    >
      {copied ? <Check className="size-3 text-emerald-500" /> : <Copy className="size-3" />}
      <span>{copied ? t(L.copied, locale) : t(L.copy, locale)}</span>
    </button>
  );
}

export function InputSpecCard({
  markdown,
  sampleStdin,
}: {
  markdown: string;
  sampleStdin?: string;
}) {
  const { locale } = useLocale();

  return (
    <div className="rounded-2xl border bg-card p-4 shadow-2xs">
      <div className="mb-2.5 flex items-center justify-between">
        <h3 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-foreground">
          <ArrowDownToLine className="size-3.5 text-primary" />
          {t(L.inputSpec, locale)}
        </h3>
      </div>

      <div className="text-xs leading-relaxed text-muted-foreground">
        <MdView markdown={markdown} />
      </div>

      {sampleStdin !== undefined && (
        <div className="mt-3 overflow-hidden rounded-xl border bg-muted/30">
          <div className="flex items-center justify-between border-b bg-muted/40 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            <span>{t(L.rawSampleInput, locale)}</span>
            <CopyButton text={sampleStdin} />
          </div>
          <pre className="overflow-x-auto p-2.5 font-mono text-xs text-foreground selection:bg-muted/60">
            {sampleStdin || "(empty stdin)"}
          </pre>
        </div>
      )}
    </div>
  );
}

export function OutputSpecCard({
  markdown,
  sampleExpected,
}: {
  markdown: string;
  sampleExpected?: string;
}) {
  const { locale } = useLocale();

  return (
    <div className="rounded-2xl border bg-card p-4 shadow-2xs">
      <div className="mb-2.5 flex items-center justify-between">
        <h3 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-foreground">
          <ArrowUpFromLine className="size-3.5 text-emerald-500" />
          {t(L.outputSpec, locale)}
        </h3>
      </div>

      <div className="text-xs leading-relaxed text-muted-foreground">
        <MdView markdown={markdown} />
      </div>

      {sampleExpected !== undefined && (
        <div className="mt-3 overflow-hidden rounded-xl border border-emerald-500/20 bg-emerald-500/5">
          <div className="flex items-center justify-between border-b border-emerald-500/15 bg-emerald-500/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
            <span>{t(L.rawSampleOutput, locale)}</span>
            <CopyButton text={sampleExpected} />
          </div>
          <pre className="overflow-x-auto p-2.5 font-mono text-xs text-emerald-950 dark:text-emerald-200">
            {sampleExpected}
          </pre>
        </div>
      )}
    </div>
  );
}

export interface ProblemIOSectionProps {
  statement?: PscpStatement | null;
  sampleCase?: TestCase;
  pitfalls?: LText[];
  takeawayPoints?: PscpTakeawayPoint[];
  note?: string | null;
  url?: string;
  className?: string;
}

export function ProblemIOSection({
  statement,
  sampleCase,
  pitfalls = [],
  takeawayPoints = [],
  note,
  url,
  className,
}: ProblemIOSectionProps) {
  const { locale } = useLocale();

  return (
    <div className={cn("space-y-4", className)}>
      {/* Streamlined Constraints / Pitfalls warning box */}
      {pitfalls.length > 0 && (
        <div className="rounded-r-lg border-l-2 border-amber-500 bg-amber-500/10 p-3 text-amber-900 dark:text-amber-200">
          <div className="mb-1.5 flex items-center gap-1.5 font-medium text-xs text-amber-800 dark:text-amber-300">
            <TriangleAlert className="size-3.5 shrink-0" />
            <span>{t(L.pitfalls, locale)}</span>
          </div>
          <ul className="space-y-1 text-xs leading-relaxed">
            {pitfalls.map((pf, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-1.5 size-1 shrink-0 rounded-full bg-amber-500" />
                <span>{t(pf, locale)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Key Takeaways */}
      {takeawayPoints.length > 0 && (
        <div className="rounded-2xl border bg-muted/20 p-4">
          <h3 className="mb-2.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-foreground">
            <Lightbulb className="size-3.5 text-primary" />
            {t(L.takeaways, locale)}
          </h3>
          <ul className="space-y-2 text-xs leading-relaxed">
            {takeawayPoints.map((pt, i) => (
              <li key={pt.tag} className="flex items-start gap-2.5">
                <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-primary font-mono text-[10px] font-bold text-primary-foreground">
                  {i + 1}
                </span>
                <span className="text-foreground/90">{t(pt, locale)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Problem Description Statement */}
      {statement ? (
        <>
          <div className="rounded-2xl border bg-card p-4 shadow-2xs">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-foreground">
              {t(L.statement, locale)}
            </h3>
            <div className="text-sm leading-relaxed text-foreground/90">
              <MdView markdown={statement.description} />
            </div>
          </div>

          {/* Separated Input / Output Specification Rows */}
          <div className="space-y-3">
            {/* Dedicated full-width Input Format Row */}
            <InputSpecCard
              markdown={statement.inputSpec}
              sampleStdin={sampleCase?.stdin}
            />

            {/* Subtle separating divider */}
            <div className="relative py-1">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/40" />
              </div>
            </div>

            {/* Distinct Output Format Row */}
            <OutputSpecCard
              markdown={statement.outputSpec}
              sampleExpected={sampleCase?.expected}
            />
          </div>
        </>
      ) : (
        <div className="rounded-2xl border border-dashed p-6 text-center">
          <p className="text-xs leading-relaxed text-muted-foreground">
            {t(L.noStatement, locale)}
          </p>
          {url && (
            <Button
              asChild
              size="sm"
              variant="outline"
              className="mt-3 gap-1.5 rounded-full text-xs"
            >
              <a href={url} target="_blank" rel="noreferrer">
                {t(L.onIJudge, locale)}
                <ExternalLink className="size-3" />
              </a>
            </Button>
          )}
        </div>
      )}

      {/* Author note */}
      {note && (
        <div className="rounded-2xl border bg-card p-4 shadow-2xs">
          <h3 className="mb-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-foreground">
            <FileText className="size-3.5 text-primary" />
            {t(L.authorNote, locale)}
          </h3>
          <p className="text-xs leading-relaxed text-muted-foreground">{note}</p>
        </div>
      )}
    </div>
  );
}
