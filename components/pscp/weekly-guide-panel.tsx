"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Eye,
  FileText,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { MdView } from "@/components/md-view";
import { PreviewModal, type Preview } from "@/components/preview-modal";
import { WeekBadge } from "@/components/week-badge";
import { ScopeBadge } from "@/components/subject-library/badges";
import { PSCP_WEEKS } from "@/lib/pscp/pscp-weeks";
import type { PscpProblem } from "@/lib/pscp/pscp";
import type { PscpProgress } from "@/lib/pscp/pscp-client";
import type { SubjectAsset } from "@/lib/library/subject-library-ui";
import { useLocale, t, type LText } from "@/lib/i18n";

const L = {
  midtermScope: { th: "ขอบเขตกลางภาค", en: "Midterm scope" },
  finalScope: { th: "ขอบเขตปลายภาค", en: "Final scope" },
  showSummary: { th: "ดูสรุปอ่านสอบประจำสัปดาห์", en: "Show Weekly Study Notes" },
  hideSummary: { th: "ซ่อนสรุปเนื้อหา", en: "Hide Study Notes" },
  fullReader: { th: "เปิดในโหมดหนังสือเต็มจอ", en: "Open in Full Reader" },
  weekMaterials: { th: "เอกสารและสไลด์ประจำสัปดาห์", en: "Weekly Documents & Slides" },
  previewPdf: { th: "เปิดดู", en: "Preview" },
  problemsCount: { th: "โจทย์ทั้งหมด", en: "Problems" },
  solvedCount: { th: "ทำผ่านแล้ว", en: "Solved" },
  learningLogs: { th: "Learning Log", en: "Learning Log" },
  gradable: { th: "รันตรวจได้", en: "Gradable" },
  noSummaryYet: {
    th: "กำลังจัดเตรียมสรุปสำหรับสัปดาห์นี้...",
    en: "Weekly summary is being prepared...",
  },
} satisfies Record<string, LText>;

interface WeeklyGuidePanelProps {
  week: number;
  problems: PscpProblem[];
  progress: PscpProgress;
  summaryMarkdown?: string | null;
  assets?: SubjectAsset[];
  onOpenProblem?: (id: number) => void;
}

export function WeeklyGuidePanel({
  week,
  problems,
  progress,
  summaryMarkdown,
  assets = [],
  onOpenProblem,
}: WeeklyGuidePanelProps) {
  const { locale } = useLocale();
  const [showSummary, setShowSummary] = useState(false);
  const [preview, setPreview] = useState<Preview | null>(null);

  const weekMeta = useMemo(() => {
    return PSCP_WEEKS.find((w) => w.week === week) ?? {
      week,
      scope: week <= 7 ? ("midterm" as const) : ("final" as const),
      title: { th: `สัปดาห์ที่ ${week}`, en: `Week ${week}` },
    };
  }, [week]);

  const paddedWeek = String(week).padStart(2, "0");
  const readerHref = `/courses/06066303-Problem-Solving-and-Computer-Programming/map?doc=week${paddedWeek}`;

  // Filter assets specifically for this week or matching chapter
  const weekAssets = useMemo(() => {
    return assets.filter(
      (a) =>
        a.week === week ||
        a.chapter === week ||
        a.fileName.toLowerCase().includes(`week${paddedWeek}`) ||
        a.fileName.toLowerCase().includes(`chapter${paddedWeek}`),
    );
  }, [assets, week, paddedWeek]);

  const solvedCount = problems.filter((p) => progress[p.id]?.solved).length;
  const learningLogCount = problems.filter((p) => p.learningLog).length;
  const recommendedCount = problems.filter((p) => p.recommended).length;

  return (
    <div className="mb-6 overflow-hidden rounded-2xl border bg-card/90 shadow-sm transition-all duration-200">
      {/* Header Banner */}
      <div className="border-b bg-gradient-to-r from-muted/40 via-muted/20 to-transparent p-4 sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <WeekBadge week={week} />
              <ScopeBadge scope={weekMeta.scope} />
              <span className="text-xs font-medium text-muted-foreground">
                {weekMeta.scope === "midterm" ? t(L.midtermScope, locale) : t(L.finalScope, locale)}
              </span>
            </div>
            <h2 className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
              {t(weekMeta.title, locale)}
            </h2>
          </div>

          {/* Quick Metrics */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-1.5 rounded-lg border bg-background/80 px-2.5 py-1 text-xs">
              <span className="font-semibold text-foreground">{problems.length}</span>
              <span className="text-muted-foreground">{t(L.problemsCount, locale)}</span>
            </div>
            {recommendedCount > 0 && (
              <div className="flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs text-amber-600 dark:text-amber-400 font-medium">
                <Sparkles className="size-3" />
                <span className="font-semibold">{recommendedCount}</span>
                <span>{locale === "th" ? "ข้อแนะนำ" : "Recommend"}</span>
              </div>
            )}
            {learningLogCount > 0 && (
              <div className="flex items-center gap-1.5 rounded-lg border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-xs text-amber-500">
                <Sparkles className="size-3" />
                <span className="font-semibold">{learningLogCount}</span>
                <span>{t(L.learningLogs, locale)}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5 rounded-lg border bg-background/80 px-2.5 py-1 text-xs">
              <span className="font-semibold text-primary">{solvedCount}</span>
              <span className="text-muted-foreground">/ {problems.length} {t(L.solvedCount, locale)}</span>
            </div>
          </div>
        </div>

        {/* Action Controls & Resource Deck */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border/40">
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant={showSummary ? "default" : "outline"}
              size="sm"
              onClick={() => setShowSummary((prev) => !prev)}
              className="h-8 gap-1.5 rounded-lg text-xs font-medium"
            >
              <BookOpen className="size-3.5" />
              {showSummary ? t(L.hideSummary, locale) : t(L.showSummary, locale)}
              {showSummary ? <ChevronUp className="size-3.5 ml-1" /> : <ChevronDown className="size-3.5 ml-1" />}
            </Button>

            <Link
              href={readerHref}
              className="inline-flex h-8 items-center gap-1.5 rounded-lg border bg-background px-3 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <GraduationCap className="size-3.5 text-primary" />
              <span>{t(L.fullReader, locale)}</span>
              <ExternalLink className="size-3 opacity-60" />
            </Link>
          </div>

          {/* Quick PDF Badges if available */}
          {weekAssets.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-xs text-muted-foreground mr-1 hidden sm:inline">
                {t(L.weekMaterials, locale)}:
              </span>
              {weekAssets.map((asset) => (
                <button
                  key={asset.id}
                  type="button"
                  onClick={() => setPreview({ items: [asset], index: 0 })}
                  className="inline-flex items-center gap-1 rounded-md border bg-background px-2 py-1 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
                  title={t(asset.title, locale)}
                >
                  <FileText className="size-3 text-primary" />
                  <span className="max-w-[140px] truncate sm:max-w-[200px]">
                    {t(asset.title, locale)}
                  </span>
                  <Eye className="size-3 opacity-50 ml-0.5" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Expanded Study Summary Section */}
      {showSummary && (
        <div className="border-t bg-card/60 p-5 sm:p-8 animate-in fade-in-50 duration-200">
          {summaryMarkdown ? (
            <div className="mx-auto max-w-4xl space-y-4">
              <MdView
                markdown={summaryMarkdown}
                assets={assets}
                courseCode="PSCP"
                onOpenPreview={(asset) => setPreview({ items: [asset], index: 0 })}
                onOpenProblem={onOpenProblem}
                variant="notebook"
              />
            </div>
          ) : (
            <div className="py-8 text-center text-sm text-muted-foreground">
              {t(L.noSummaryYet, locale)}
            </div>
          )}
        </div>
      )}

      {/* Embedded PDF Preview Modal */}
      {preview && (
        <PreviewModal
          preview={preview}
          courseCode="PSCP"
          onIndexChange={(index) => setPreview({ ...preview, index })}
          onClose={() => setPreview(null)}
        />
      )}
    </div>
  );
}

