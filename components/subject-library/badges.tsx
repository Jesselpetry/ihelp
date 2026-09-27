"use client";

import { Copy, Sparkles } from "lucide-react";
import { useLocale, t, type LText } from "@/lib/i18n";
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
  hideCurrentYear = false,
  className = "",
}: {
  asset: SubjectAsset;
  /** Set where every neighbour is current too, so the badge would only be noise. */
  hideCurrentYear?: boolean;
  className?: string;
}) {
  const { locale } = useLocale();
  const edition = editionLabel(asset, locale);
  return (
    <>
      {asset.isCurrentYear && !hideCurrentYear && (
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
      {edition && (
        <span
          className={`inline-flex items-center gap-0.5 rounded-full border border-border/80 bg-muted/60 px-1.5 py-0.5 text-[9px] font-medium text-muted-foreground ${className}`}
        >
          {edition}
        </span>
      )}
    </>
  );
}

/** Edition words that read better translated; years and cohort codes pass through. */
const EDITION_LABEL: Record<string, LText> = {
  Handout: { th: "ฉบับพิมพ์", en: "Handout" },
  Annotated: { th: "มีโน้ต", en: "Annotated" },
  Scan: { th: "ภาพสแกน", en: "Scan" },
  Completed: { th: "ทำแล้ว", en: "Completed" },
  "In progress": { th: "กำลังทำ", en: "In progress" },
  "Former syllabus": { th: "หลักสูตรเดิม", en: "Former syllabus" },
};

const EARLIER: LText = { th: "ปีก่อน", en: "Earlier" };

function editionLabel(asset: SubjectAsset, locale: "th" | "en"): string | null {
  if (asset.edition && asset.edition !== "2569") {
    const known = EDITION_LABEL[asset.edition];
    return known ? t(known, locale) : asset.edition;
  }
  return asset.status === "legacy" ? t(EARLIER, locale) : null;
}
