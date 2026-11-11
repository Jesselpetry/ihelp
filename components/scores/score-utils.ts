import { t, type LText } from "@/lib/i18n";
import type { CourseScoreAllRow, ScoreCellValue } from "@/lib/scores/types";

export function formatScore(value: number): string {
  return value.toLocaleString("en-US", { maximumFractionDigits: 2 });
}

export function formatScoreDate(iso: string, locale: "th" | "en"): string {
  const parsed = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return iso;
  return parsed.toLocaleDateString(locale === "th" ? "th-TH" : "en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function resolveLabel(
  label: LText | string,
  locale: "th" | "en",
): string {
  return typeof label === "string" ? label : t(label, locale);
}

export function formatCellText(value: ScoreCellValue | undefined): string {
  if (value === null || value === undefined || value === "pending") return "—";
  if (value === "N/A") return "#N/A";
  if (typeof value === "number") return formatScore(value);
  return value;
}

export function isWithdrawalOrAbsent(
  value: ScoreCellValue | undefined,
): value is "ลาออก" | "ขาดสอบ" {
  return value === "ลาออก" || value === "ขาดสอบ";
}

export function isAlertToken(value: ScoreCellValue | undefined): boolean {
  return (
    value === "N/A" ||
    value === "ลาออก" ||
    value === "ขาดสอบ" ||
    value === "ขาด" ||
    value === "ไม่ส่ง"
  );
}

export function isPositiveToken(value: ScoreCellValue | undefined): boolean {
  return value === "มา" || value === "ส่ง";
}

export function computeClassStats(rows: CourseScoreAllRow[]): {
  count: number;
  activeCount: number;
  avg: number;
  max: number;
} {
  const active = rows.filter((r) => !r.status);
  if (active.length === 0) {
    return { count: rows.length, activeCount: 0, avg: 0, max: 0 };
  }
  let sum = 0;
  let max = -Infinity;
  for (const row of active) {
    sum += row.total;
    if (row.total > max) max = row.total;
  }
  return {
    count: rows.length,
    activeCount: active.length,
    avg: Math.round((sum / active.length) * 100) / 100,
    max: Math.round(max * 100) / 100,
  };
}
