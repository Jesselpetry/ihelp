"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, ExternalLink, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLocale, t, type LText } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const L: Record<string, LText> = {
  bannerTitle: {
    th: "ข้อแนะนำก่อนวันสอบ โดยพี่ๆ TA :3",
    en: "Pre-Exam Recommendations from TAs :3",
  },
  bannerBadge: {
    th: "ข้อสอบปลายภาค (Final Prep)",
    en: "Final Exam Prep",
  },
  bannerBody: {
    th: "จะมีข้อที่กำกับว่า [Recommend] อยู่ใน course หลัก ซึ่งอาจช่วยให้น้องๆ ทำข้อสอบได้สบายกว่าเดิม อย่าลืมเข้าไปลองทำกันน้าา — Good Luck! ขอให้น้องๆ ทำข้อสอบได้กันเยอะทุกคนน้าา",
    en: "Problems marked with [Recommend] in the main course can help you prepare and breeze through the exam. Don't forget to practice — Good Luck to everyone!",
  },
  filterAction: {
    th: "กรองดูข้อแนะนำทั้งหมด",
    en: "Filter All Recommended",
  },
  openOnIJudge: {
    th: "เปิดบน iJudge",
    en: "Open on iJudge",
  },
  solveInIHelp: {
    th: "ทำโจทย์ใน iHelp",
    en: "Solve in iHelp",
  },
};

export interface ExamRecommendedProblem {
  id: number;
  name: string;
  slug: string;
  ijudgeUrl: string;
}

export const TA_EXAM_RECOMMENDED_PROBLEMS: ExamRecommendedProblem[] = [
  { id: 3476, name: "CuteCat CuteFox", slug: "oj3476-cutecat-cutefox", ijudgeUrl: "https://ijudge.it.kmitl.ac.th/problems/3476/description" },
  { id: 3753, name: "Members", slug: "oj3753-members", ijudgeUrl: "https://ijudge.it.kmitl.ac.th/problems/3753/description" },
  { id: 3609, name: "3nPlus1", slug: "oj3609-3nplus1", ijudgeUrl: "https://ijudge.it.kmitl.ac.th/problems/3609/description" },
  { id: 3644, name: "08.00 - B RNG", slug: "oj3644-08-00-b-rng", ijudgeUrl: "https://ijudge.it.kmitl.ac.th/problems/3644/description" },
  { id: 3645, name: "PhoneNumber", slug: "oj3645-phonenumber", ijudgeUrl: "https://ijudge.it.kmitl.ac.th/problems/3645/description" },
  { id: 3650, name: "BookWorm", slug: "oj3650-bookworm", ijudgeUrl: "https://ijudge.it.kmitl.ac.th/problems/3650/description" },
  { id: 3672, name: "นับสระและหาสระเรียงกันยาวที่สุด", slug: "oj3672", ijudgeUrl: "https://ijudge.it.kmitl.ac.th/problems/3672/description" },
  { id: 3752, name: "Who's the author", slug: "oj3752-whos-the-author", ijudgeUrl: "https://ijudge.it.kmitl.ac.th/problems/3752/description" },
];

export function ExamRecommendBanner({
  onSelectProblem,
  onFilterRecommended,
  className,
}: {
  onSelectProblem?: (id: number) => void;
  onFilterRecommended?: () => void;
  className?: string;
}) {
  const { locale } = useLocale();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={cn(
        "relative mb-6 overflow-hidden rounded-2xl border border-amber-500/35 bg-gradient-to-r from-amber-500/[0.12] via-amber-500/[0.04] to-transparent p-4 sm:p-5 shadow-xs transition-all",
        className,
      )}
    >
      {/* Top row: Title, Badge & Collapse button */}
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xl select-none" aria-hidden>
              🫪
            </span>
            <h2 className="text-sm font-semibold tracking-tight text-foreground sm:text-base">
              {t(L.bannerTitle, locale)}
            </h2>
            <Badge className="rounded-full border border-amber-500/40 bg-amber-500/20 px-2.5 py-0 text-[10px] font-semibold text-amber-700 dark:text-amber-300 shadow-none">
              {t(L.bannerBadge, locale)}
            </Badge>
          </div>
          {!collapsed && (
            <p className="text-xs leading-relaxed text-muted-foreground sm:text-[13px]">
              {t(L.bannerBody, locale)}
            </p>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          {onFilterRecommended && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onFilterRecommended}
              className="h-7 cursor-pointer gap-1 rounded-full border-amber-500/40 bg-amber-500/10 px-2.5 text-xs font-semibold text-amber-700 hover:bg-amber-500/20 dark:text-amber-300"
            >
              <Sparkles className="size-3" />
              <span>{t(L.filterAction, locale)}</span>
            </Button>
          )}
          <button
            type="button"
            onClick={() => setCollapsed((prev) => !prev)}
            className="inline-flex size-7 cursor-pointer items-center justify-center rounded-lg text-muted-foreground hover:bg-muted/60 hover:text-foreground"
            aria-label={collapsed ? "Expand" : "Collapse"}
          >
            {collapsed ? <ChevronDown className="size-4" /> : <ChevronUp className="size-4" />}
          </button>
        </div>
      </div>

      {/* Recommended Problem Chips */}
      {!collapsed && (
        <div className="mt-4 pt-3 border-t border-amber-500/20">
          <div className="flex flex-wrap items-center gap-2">
            {TA_EXAM_RECOMMENDED_PROBLEMS.map((prob) => (
              <div
                key={prob.id}
                className="group inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-background/80 hover:bg-amber-500/15 hover:border-amber-500/60 pl-2.5 pr-1.5 py-1 text-xs transition-all shadow-2xs"
              >
                <Sparkles className="size-3 text-amber-500 shrink-0" />
                <button
                  type="button"
                  onClick={() => onSelectProblem?.(prob.id)}
                  className="font-medium text-foreground hover:text-amber-600 dark:hover:text-amber-400 cursor-pointer flex items-center gap-1.5"
                  title={`${prob.name} — ${t(L.solveInIHelp, locale)}`}
                >
                  <span className="font-mono text-[11px] text-muted-foreground">#{prob.id}</span>
                  <span className="truncate max-w-[140px] sm:max-w-none">{prob.name}</span>
                </button>
                <a
                  href={prob.ijudgeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="size-5 inline-flex items-center justify-center rounded-full text-muted-foreground/60 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-500/20 transition-colors"
                  title={t(L.openOnIJudge, locale)}
                >
                  <ExternalLink className="size-2.5" />
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
