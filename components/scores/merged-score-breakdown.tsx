"use client";

import { ChevronRight, RotateCcw } from "lucide-react";
import {
  formatCellText,
  formatScore,
  isAlertToken,
  isPositiveToken,
  isWithdrawalOrAbsent,
  resolveLabel,
} from "@/components/scores/score-utils";
import {
  hasCourseManualEntries,
  resetCourseManualScores,
  setCustomWeightValue,
  setManualInputValue,
  setPscpFinalMode,
  useManualScoresStore,
} from "@/lib/grades/manual-scores-store";
import {
  mergeCourseScores,
  type MergedCategoryItem,
} from "@/lib/grades/score-merger";
import type { GradesCourseEntry } from "@/lib/grades/y1s1-courses";
import { useLocale, t, type LText } from "@/lib/i18n";
import type { CourseScoreViewResponse, ScoreSubPart } from "@/lib/scores/types";

const L = {
  totalScoreLabel: { th: "คะแนนรวมทั้งหมด", en: "Total score" },
  sheetBreakdownPrefix: { th: "จากชีต", en: "Sheet" },
  manualAddedPrefix: { th: "กรอกเพิ่ม", en: "Manual" },
  extraBonusPrefix: { th: "เสริม", en: "Extra" },
  resetCourseBtn: { th: "ล้างคะแนนที่กรอก", en: "Clear manual" },
  colItem: { th: "องค์ประกอบคะแนน", en: "Assessment" },
  colScore: { th: "คะแนน", en: "Score" },
  colMax: { th: "เต็ม", en: "Max" },
  colStatus: { th: "สถานะ", en: "Status" },
  statusOfficial: { th: "ประกาศแล้ว", en: "Graded" },
  statusManual: { th: "กรอกเอง", en: "Manual" },
  statusPending: { th: "รอประกาศ", en: "Pending" },
  statusEmpty: { th: "ยังไม่กรอก", en: "Empty" },
  rawPrefix: { th: "ดิบ", en: "Raw" },
  subPartsToggle: { th: "รายละเอียดย่อย", en: "Sub-scores" },
  pscpModeProblems: { th: "กรอกเป็นข้อ (0–12)", en: "By problems (0–12)" },
  pscpModeScore: { th: "กรอกคะแนน (0–35)", en: "By points (0–35)" },
  pscpProblemsUnit: { th: "ข้อ", en: "probs" },
  pscpPerProblemNote: { th: "ข้อละ", en: "per problem" },
  pscpEquivPrefix: { th: "คิดเป็น", en: "Equals" },
  mfitSubSummary: {
    th: "รวม 4 ช่องย่อยด้านล่าง (ปรับเต็มย่อยได้)",
    en: "4 sub-inputs below (editable weights)",
  },
  mfitWeightMismatch: {
    th: "รวมสัดส่วนย่อยตอนนี้",
    en: "Current sub-weight sum",
  },
  invalidInput: { th: "กรอกตัวเลขเท่านั้น", en: "Numbers only" },
  overMaxPrefix: { th: "เกินเต็ม", en: "Exceeds max" },
  extraBadge: { th: "+เสริม", en: "+Extra" },
  placeholderScore: { th: "0", en: "0" },
  placeholderProblems: { th: "0–12", en: "0–12" },
} satisfies Record<string, LText>;

// Single shared grid definition guarantees every course table & sub-row aligns edge-to-edge.
const ROW_GRID_CLASS =
  "@lg:grid @lg:grid-cols-[minmax(0,1fr)_5.5rem_4.25rem_5.25rem] @lg:items-center @lg:gap-3";

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

function getScoreInputClass(
  isError: boolean,
  hasScore: boolean,
): string {
  const tone = isError
    ? "border-amber-500/70"
    : hasScore
      ? "border-emerald-500/50"
      : "border-border/70 hover:border-border";
  return `h-7 w-16 rounded-md border bg-background/85 px-2 text-right font-mono text-xs font-semibold text-foreground placeholder:text-muted-foreground/45 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 @lg:w-20 ${tone}`;
}

function ValidationNote({
  isInvalid,
  isOverMax,
  maxDisplay,
  locale,
}: {
  isInvalid: boolean;
  isOverMax: boolean;
  maxDisplay: string;
  locale: "th" | "en";
}) {
  if (isInvalid) {
    return (
      <p className="mt-0.5 text-[10px] text-amber-500">
        {t(L.invalidInput, locale)}
      </p>
    );
  }
  if (isOverMax) {
    return (
      <p className="mt-0.5 text-[10px] text-amber-500">
        {t(L.overMaxPrefix, locale)} {maxDisplay}
      </p>
    );
  }
  return null;
}

function StatusBadge({
  source,
  sheetScore,
  pending,
  locale,
  compact = false,
}: {
  source: MergedCategoryItem["source"] | "manual_filled" | "empty";
  sheetScore?: CourseScoreViewResponse["categories"][number]["score"];
  pending?: boolean;
  locale: "th" | "en";
  compact?: boolean;
}) {
  const base = compact
    ? "inline-flex items-center rounded px-1.5 py-[1px] text-[9px] leading-tight font-medium whitespace-nowrap"
    : "inline-flex items-center justify-center rounded-full px-2 py-0.5 text-[10px] font-medium whitespace-nowrap";

  if (source === "sheet" && sheetScore !== undefined) {
    if (isWithdrawalOrAbsent(sheetScore)) {
      return (
        <span className={`${base} bg-amber-500/15 text-amber-500`}>
          {sheetScore}
        </span>
      );
    }
    if (sheetScore === "N/A") {
      return (
        <span className={`${base} bg-amber-500/15 text-amber-500`}>#N/A</span>
      );
    }
    return (
      <span className={`${base} bg-primary/10 text-primary`}>
        {t(L.statusOfficial, locale)}
      </span>
    );
  }

  if (
    source === "manual" ||
    source === "sub_inputs" ||
    source === "manual_filled"
  ) {
    return (
      <span className={`${base} bg-emerald-500/15 text-emerald-500`}>
        {t(L.statusManual, locale)}
      </span>
    );
  }

  if (pending) {
    return (
      <span className={`${base} bg-muted text-muted-foreground`}>
        {t(L.statusPending, locale)}
      </span>
    );
  }

  return (
    <span className={`${base} bg-muted/60 text-muted-foreground`}>
      {t(L.statusEmpty, locale)}
    </span>
  );
}

function SubPartsDisclosure({
  subParts,
  locale,
}: {
  subParts: ScoreSubPart[];
  locale: "th" | "en";
}) {
  return (
    <details className="mt-1 group/sub">
      <summary className="-ml-1 inline-flex list-none items-center gap-1 rounded px-1 py-0.5 text-[10px] font-medium text-muted-foreground/85 transition-colors hover:bg-muted/50 hover:text-foreground cursor-pointer select-none [&::-webkit-details-marker]:hidden">
        <ChevronRight
          aria-hidden="true"
          className="size-3 shrink-0 transition-transform duration-150 group-open/sub:rotate-90"
        />
        <span>
          {t(L.subPartsToggle, locale)} ({subParts.length})
        </span>
      </summary>
      <div className="mt-1.5 flex flex-wrap gap-1">
        {subParts.map((sub) => {
          const isAlert = isAlertToken(sub.value);
          const isPositive = isPositiveToken(sub.value);
          const chipTone = isAlert
            ? "border-amber-500/30 bg-amber-500/10 text-amber-400"
            : isPositive
              ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-400"
              : "border-border/50 bg-muted/35 text-foreground/90";
          return (
            <span
              key={sub.key}
              title={sub.note}
              className={`inline-flex items-center gap-1 rounded border px-1.5 py-[1px] text-[10px] leading-tight tabular-nums ${chipTone}`}
            >
              <span className="text-muted-foreground">{sub.label}</span>
              <span className="font-semibold">{formatCellText(sub.value)}</span>
            </span>
          );
        })}
      </div>
    </details>
  );
}

export function MergedScoreBreakdown({
  course,
  sheetScore,
  embedded = false,
}: {
  course: GradesCourseEntry;
  sheetScore: CourseScoreViewResponse | null;
  embedded?: boolean;
}) {
  const { locale } = useLocale();
  const manualState = useManualScoresStore();
  const merged = mergeCourseScores(course, sheetScore, manualState);
  const hasManual = hasCourseManualEntries(manualState, course.code);

  const safeScale = merged.baseScale > 0 ? merged.baseScale : 100;
  const pctWidth = (val: number) =>
    `${Math.max(0, Math.min(100, (val / safeScale) * 100))}%`;
  const showSheetCaption = merged.hasSheet && merged.sheetMax > 0;
  const showManualSplitCaption = merged.hasSheet && merged.hasAnyManualInput;
  const showSubCaption = showSheetCaption || merged.extraMax > 0 || hasManual;

  function handleTogglePscpMode(item: MergedCategoryItem) {
    const nextMode =
      manualState.pscpFinalMode === "problems" ? "score" : "problems";
    const problemMax = item.problemCountMax ?? 12;

    if (item.score !== null) {
      if (nextMode === "score") {
        setManualInputValue(course.code, item.id, String(item.score));
      } else {
        const converted = round2((item.score / item.max) * problemMax);
        setManualInputValue(course.code, item.id, String(converted));
      }
    }

    setPscpFinalMode(nextMode);
  }

  return (
    <div className="space-y-3">
      {/* Summary & multi-segment progress bar (/100 default) */}
      <div
        className={
          embedded
            ? "px-0.5 pb-0.5"
            : "rounded-xl border border-border/50 bg-muted/20 px-3.5 py-3"
        }
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-medium text-muted-foreground">
              {t(L.totalScoreLabel, locale)}
            </span>
            {merged.sheetStatus && (
              <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-semibold text-amber-500">
                {merged.sheetStatus}
              </span>
            )}
          </div>

          <div className="flex items-baseline gap-1 font-mono tabular-nums">
            <span className="text-lg font-bold text-foreground">
              {merged.hasAnyScore ? formatScore(merged.combinedEarned) : "—"}
            </span>
            <span className="text-xs text-muted-foreground">
              / {formatScore(merged.baseScale)}
            </span>
          </div>
        </div>

        {/* Multi-segment bar: sheet (primary) + manual (emerald) */}
        <div className="mt-2 flex h-1.5 w-full gap-0.5 overflow-hidden rounded-full bg-muted/60">
          {merged.sheetEarned > 0 && (
            <div
              className="h-full bg-primary transition-all"
              style={{ width: pctWidth(merged.sheetEarned) }}
            />
          )}
          {merged.manualEarned > 0 && (
            <div
              className="h-full bg-emerald-500/85 transition-all"
              style={{ width: pctWidth(merged.manualEarned) }}
            />
          )}
        </div>

        {/* Compact breakdown caption (only when helpful) & clear button */}
        {showSubCaption && (
          <div className="mt-1.5 flex flex-wrap items-center justify-between gap-2 text-[11px] text-muted-foreground">
            <div className="flex flex-wrap items-center gap-2 tabular-nums">
              {showSheetCaption && (
                <span>
                  {t(L.sheetBreakdownPrefix, locale)}{" "}
                  <strong className="font-semibold text-foreground/90">
                    {formatScore(merged.sheetEarned)}
                  </strong>{" "}
                  / {formatScore(merged.sheetMax)}
                </span>
              )}
              {showManualSplitCaption && (
                <span>
                  {t(L.manualAddedPrefix, locale)}{" "}
                  <strong className="font-semibold text-emerald-500">
                    +{formatScore(merged.manualEarned)}
                  </strong>{" "}
                  / {formatScore(merged.manualMax)}
                </span>
              )}
              {merged.extraMax > 0 && (
                <span>
                  ({t(L.extraBonusPrefix, locale)} +{formatScore(merged.extraMax)})
                </span>
              )}
            </div>

            {hasManual && (
              <button
                type="button"
                onClick={() => resetCourseManualScores(course.code)}
                className="inline-flex items-center gap-1 rounded-md border border-border/50 bg-background/60 px-2 py-0.5 text-[10px] font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground cursor-pointer"
              >
                <RotateCcw className="size-2.5" />
                <span>{t(L.resetCourseBtn, locale)}</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Standardized Two-Section Breakdown Table (container-adaptive) */}
      <div className="@container overflow-hidden rounded-xl border border-border/50">
        {/* Column Header (>= 512px) */}
        <div
          className={`hidden border-b border-border/50 bg-muted/35 px-3.5 py-2 text-[11px] font-medium text-muted-foreground ${ROW_GRID_CLASS}`}
        >
          <div>{t(L.colItem, locale)}</div>
          <div className="text-right">{t(L.colScore, locale)}</div>
          <div className="text-right">{t(L.colMax, locale)}</div>
          <div className="text-right">{t(L.colStatus, locale)}</div>
        </div>

        <div className="divide-y divide-border/40">
          {merged.items.map((item) => {
            const title = resolveLabel(item.label, locale);
            const sheetCat = item.sheetCategory;
            const isProblemMode =
              item.inputMode === "problem_count" &&
              item.editable &&
              item.pscpFinalMode === "problems";
            const problemMax = item.problemCountMax ?? 12;
            const perProblemPts = round2(item.max / problemMax);
            const hasSubParts =
              item.source === "sheet" &&
              Boolean(sheetCat?.subParts && sheetCat.subParts.length > 0);
            const hasSubInputs = Boolean(
              item.subInputs && item.subInputs.length > 0,
            );

            return (
              <div key={item.id}>
                {/* Primary Row: Left (Title + Description) | Right (Aligned Score / Max / Status) */}
                <div className="px-3 py-2.5 transition-colors hover:bg-muted/15 @lg:px-3.5">
                  <div
                    className={`flex items-start justify-between gap-3 ${ROW_GRID_CLASS}`}
                  >
                    {/* LEFT SECTION: Title + Description + Tiny Sub-parts Disclosure */}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-xs font-medium text-foreground @lg:text-[13px]">
                          {title}
                        </span>
                        {item.isExtra && (
                          <span className="rounded bg-primary/10 px-1 py-[1px] text-[9px] font-medium leading-tight text-primary">
                            {t(L.extraBadge, locale)}
                          </span>
                        )}
                      </div>

                      {/* Description Stack (flush-left, compact, subtle) */}
                      <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-muted-foreground tabular-nums">
                        {item.source === "sheet" && sheetCat?.rawSummary && (
                          <span>
                            {t(L.rawPrefix, locale)}{" "}
                            {formatScore(sheetCat.rawSummary.earned)} /{" "}
                            {formatScore(sheetCat.rawSummary.max)}
                          </span>
                        )}

                        {hasSubInputs && (
                          <span>
                            {t(L.mfitSubSummary, locale)}
                            {Math.abs(item.max - 30) > 0.01 && (
                              <span className="ml-1.5 font-mono text-amber-500">
                                ({t(L.mfitWeightMismatch, locale)}:{" "}
                                {formatScore(item.max)} / 30)
                              </span>
                            )}
                          </span>
                        )}

                        {/* Compact status tag on narrow containers (< 512px) */}
                        <span className="@lg:hidden">
                          <StatusBadge
                            source={item.source}
                            sheetScore={sheetCat?.score}
                            pending={sheetCat?.pending}
                            locale={locale}
                            compact
                          />
                        </span>
                      </div>

                      {/* PSCP Final Mode Toggle & Conversion Note (inside Left Section so Right stays straight) */}
                      {item.inputMode === "problem_count" && item.editable && (
                        <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-[10px]">
                          <button
                            type="button"
                            onClick={() => handleTogglePscpMode(item)}
                            className="inline-flex items-center rounded border border-border/60 bg-background/70 px-1.5 py-0.5 font-medium text-foreground/85 transition-colors hover:bg-muted cursor-pointer"
                          >
                            {isProblemMode
                              ? t(L.pscpModeScore, locale)
                              : t(L.pscpModeProblems, locale)}
                          </button>
                          <span className="text-muted-foreground tabular-nums">
                            ({t(L.pscpPerProblemNote, locale)} {perProblemPts})
                          </span>
                          {isProblemMode && item.problemCount !== null && (
                            <span className="font-mono text-emerald-500 tabular-nums">
                              · {formatScore(item.problemCount)}/{problemMax}{" "}
                              {t(L.pscpProblemsUnit, locale)} →{" "}
                              {t(L.pscpEquivPrefix, locale)}{" "}
                              <strong>{formatScore(item.score ?? 0)}</strong>/
                              {formatScore(item.max)}
                            </span>
                          )}
                          {!isProblemMode && item.score !== null && (
                            <span className="font-mono text-muted-foreground tabular-nums">
                              · ≈{" "}
                              {formatScore(
                                round2((item.score / item.max) * problemMax),
                              )}
                              /{problemMax} {t(L.pscpProblemsUnit, locale)}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Collapsible Per-Week / Sub-Part Badges (hidden by default, tiny & flush-left) */}
                      {hasSubParts && sheetCat?.subParts && (
                        <SubPartsDisclosure
                          subParts={sheetCat.subParts}
                          locale={locale}
                        />
                      )}

                      {/* Validation errors inside left column so score rail never shifts */}
                      <ValidationNote
                        isInvalid={item.isInvalid}
                        isOverMax={item.isOverMax}
                        maxDisplay={String(
                          isProblemMode ? problemMax : formatScore(item.max),
                        )}
                        locale={locale}
                      />
                    </div>

                    {/* RIGHT SECTION: Fixed-rail Score | Max | Status */}
                    <div className="flex shrink-0 items-center justify-end gap-1.5 @lg:contents">
                      {/* Score cell (uniform w-16 / @lg:w-20 rail across sheet & inputs) */}
                      <div className="flex justify-end font-mono text-xs font-semibold tabular-nums @lg:text-[13px]">
                        {item.source === "sheet" && sheetCat ? (
                          <span className="inline-flex h-7 w-16 items-center justify-end px-2 text-foreground @lg:w-20">
                            {isWithdrawalOrAbsent(sheetCat.score)
                              ? "—"
                              : formatCellText(sheetCat.score)}
                          </span>
                        ) : hasSubInputs ? (
                          <span
                            className={`inline-flex h-7 w-16 items-center justify-end px-2 @lg:w-20 ${
                              item.score !== null
                                ? "text-emerald-500"
                                : "text-muted-foreground"
                            }`}
                          >
                            {item.score !== null ? formatScore(item.score) : "—"}
                          </span>
                        ) : (
                          <input
                            type="text"
                            inputMode="decimal"
                            aria-label={`${title}${isProblemMode ? ` (${t(L.pscpProblemsUnit, locale)})` : ""}`}
                            value={item.rawInput}
                            placeholder={
                              isProblemMode
                                ? t(L.placeholderProblems, locale)
                                : t(L.placeholderScore, locale)
                            }
                            disabled={!item.editable}
                            onChange={(e) =>
                              setManualInputValue(
                                course.code,
                                item.id,
                                e.target.value,
                              )
                            }
                            className={getScoreInputClass(
                              item.isInvalid || item.isOverMax,
                              item.score !== null,
                            )}
                          />
                        )}
                      </div>

                      {/* Max cell */}
                      <div className="flex items-center justify-end font-mono text-xs text-muted-foreground tabular-nums">
                        <span className="mr-1 @lg:hidden">/</span>
                        <span className="inline-flex h-7 w-10 items-center justify-end px-1 @lg:w-14 @lg:px-1.5">
                          {formatScore(item.max)}
                        </span>
                      </div>

                      {/* Status cell (>= 512px) */}
                      <div className="hidden justify-end @lg:flex">
                        <StatusBadge
                          source={item.source}
                          sheetScore={sheetCat?.score}
                          pending={sheetCat?.pending}
                          locale={locale}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Aligned Sub-Rows for MFIT Attendance & Quiz (identical right-aligned columns) */}
                {item.subInputs && item.subInputs.length > 0 && (
                  <div className="divide-y divide-border/30 border-t border-border/35 bg-muted/10">
                    {item.subInputs.map((sub) => (
                      <div
                        key={sub.id}
                        className="px-3 py-2 transition-colors hover:bg-muted/20 @lg:px-3.5"
                      >
                        <div
                          className={`flex items-center justify-between gap-3 ${ROW_GRID_CLASS}`}
                        >
                          {/* Sub-row Left: Indented title + errors */}
                          <div className="min-w-0 flex-1 pl-3 border-l-2 border-border/60 ml-1">
                            <span className="block text-xs text-foreground/90">
                              {t(sub.label, locale)}
                            </span>
                            <ValidationNote
                              isInvalid={sub.isInvalid}
                              isOverMax={sub.isOverMax}
                              maxDisplay={String(formatScore(sub.max))}
                              locale={locale}
                            />
                          </div>

                          {/* Sub-row Right: Aligned Score input | Editable Weight input | Status */}
                          <div className="flex shrink-0 items-center justify-end gap-1.5 @lg:contents">
                            <div className="flex justify-end font-mono text-xs tabular-nums">
                              <input
                                type="text"
                                inputMode="decimal"
                                aria-label={t(sub.label, locale)}
                                value={sub.rawInput}
                                placeholder={t(L.placeholderScore, locale)}
                                disabled={!item.editable}
                                onChange={(e) =>
                                  setManualInputValue(
                                    course.code,
                                    sub.id,
                                    e.target.value,
                                  )
                                }
                                className={getScoreInputClass(
                                  sub.isInvalid || sub.isOverMax,
                                  sub.score !== null,
                                )}
                              />
                            </div>

                            <div className="flex items-center justify-end font-mono text-xs tabular-nums">
                              <span className="mr-1 text-muted-foreground @lg:hidden">
                                /
                              </span>
                              {sub.editableWeight ? (
                                <input
                                  type="text"
                                  inputMode="decimal"
                                  aria-label={`${t(sub.label, locale)} ${t(L.colMax, locale)}`}
                                  value={sub.rawWeight}
                                  placeholder={String(sub.defaultWeight)}
                                  disabled={!item.editable}
                                  onChange={(e) =>
                                    setCustomWeightValue(
                                      course.code,
                                      sub.id,
                                      e.target.value,
                                    )
                                  }
                                  className="h-7 w-10 rounded-md border border-border/50 bg-muted/35 px-1 text-right font-mono text-xs text-muted-foreground placeholder:text-muted-foreground/75 transition-colors focus-visible:border-border focus-visible:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/40 @lg:w-14 @lg:px-1.5"
                                />
                              ) : (
                                <span className="inline-flex h-7 w-10 items-center justify-end px-1 text-muted-foreground @lg:w-14 @lg:px-1.5">
                                  {formatScore(sub.max)}
                                </span>
                              )}
                            </div>

                            <div className="hidden justify-end @lg:flex">
                              <StatusBadge
                                source={
                                  sub.score !== null ? "manual_filled" : "empty"
                                }
                                locale={locale}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
