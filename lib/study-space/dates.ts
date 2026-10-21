import type { Locale } from "@/lib/ltext";

/**
 * Plan dates are plain "YYYY-MM-DD" strings in Bangkok time. They are never
 * turned into a Date at local midnight — a visitor in another timezone would
 * see every day shift by one.
 */

const TZ = "Asia/Bangkok";

export function bangkokToday(now = Date.now()): string {
  // en-CA formats as YYYY-MM-DD.
  return new Intl.DateTimeFormat("en-CA", { timeZone: TZ }).format(now);
}

/** "14:05", Bangkok time. */
export function bangkokClock(now: number, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === "th" ? "th-TH" : "en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: TZ,
  }).format(now);
}

/** Noon UTC keeps the calendar day the same in every timezone. */
const noon = (date: string) => new Date(`${date}T12:00:00Z`);

export function formatDay(date: string, locale: Locale) {
  const d = noon(date);
  const tag = locale === "th" ? "th-TH" : "en-GB";
  return {
    weekday: new Intl.DateTimeFormat(tag, { weekday: "short", timeZone: "UTC" }).format(d),
    day: d.getUTCDate(),
    month: new Intl.DateTimeFormat(tag, { month: "short", timeZone: "UTC" }).format(d),
    long: new Intl.DateTimeFormat(tag, { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" }).format(d),
  };
}

/** Whole calendar days from `from` to `to`, both "YYYY-MM-DD". */
export function daysBetween(from: string, to: string): number {
  return Math.round((noon(to).getTime() - noon(from).getTime()) / 86_400_000);
}
