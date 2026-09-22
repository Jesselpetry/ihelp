"use client";

import { Copy, Sparkles } from "lucide-react";
import { useLocale, t } from "@/lib/i18n";
import { SCOPE_SHORT, type AssetScope, type SubjectAsset } from "@/lib/library/subject-library-ui";
import { SCOPE_BADGE, SCOPE_BADGE_ON_MEDIA, SCOPE_ICON } from "./types";

/**
 * The badge every card and the modal header carry. `onMedia` switches to the
 * heavier variant for the two places it sits over a photograph.
 */
export function ScopeBadge({
  scope,
  onMedia = false,
  className = "",
}: {
  scope: AssetScope;
  onMedia?: boolean;
  className?: string;
}) {
  const { locale } = useLocale();
  const Icon = SCOPE_ICON[scope];
  const tone = (onMedia ? SCOPE_BADGE_ON_MEDIA : SCOPE_BADGE)[scope];
  return (
    <span
      className={`inline-flex items-center gap-0.5 rounded-full border px-1.5 py-0.5 text-[9px] font-semibold ${tone} ${className}`}
    >
      <Icon className="size-2.5" />
      {t(SCOPE_SHORT[scope], locale)}
    </span>
  );
}

/** Badges indicating current academic year (2569) or duplicate/variant status. */
export function StatusBadges({
  asset,
  className = "",
}: {
  asset: SubjectAsset;
  className?: string;
}) {
  const { locale } = useLocale();
  return (
    <>
      {asset.isCurrentYear && (
        <span
          className={`inline-flex items-center gap-0.5 rounded-full border border-emerald-500/35 bg-emerald-500/15 px-1.5 py-0.5 text-[9px] font-bold text-emerald-700 dark:text-emerald-300 shadow-2xs ${className}`}
          title={locale === "th" ? "เนื้อหาประจำปีการศึกษา 2569 ล่าสุด" : "Current AY 2569 Curriculum"}
        >
          <Sparkles className="size-2.5" />
          <span>2569</span>
        </span>
      )}
      {asset.isDuplicate && (
        <span
          className={`inline-flex items-center gap-0.5 rounded-full border border-amber-500/35 bg-amber-500/15 px-1.5 py-0.5 text-[9px] font-medium text-amber-700 dark:text-amber-300 shadow-2xs ${className}`}
          title={asset.duplicateOf ? `ฉบับสำรองของ ${asset.duplicateOf}` : undefined}
        >
          <Copy className="size-2.5" />
          <span>{locale === "th" ? "สำรอง" : "Alt"}</span>
        </span>
      )}
      {asset.edition && asset.edition !== "2569" && (
        <span
          className={`inline-flex items-center gap-0.5 rounded-full border border-border/80 bg-muted/60 px-1.5 py-0.5 text-[9px] font-medium text-muted-foreground ${className}`}
        >
          {asset.edition}
        </span>
      )}
    </>
  );
}
