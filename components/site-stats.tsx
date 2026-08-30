"use client";

import { useEffect, useState } from "react";

import { t, useLocale, type LText } from "@/lib/i18n";

type Stats = { today: number; week: number; allTime: number };

/**
 * Marks the visit as counted for this tab. Without it every client-side
 * navigation would POST again: harmless for the headline numbers, since
 * (day, visitor_hash) is a primary key, but a write per page view all the
 * same.
 */
const SESSION_KEY = "ihelp-visit-counted";

const LABELS: { key: keyof Stats; label: LText }[] = [
  { key: "today", label: { th: "วันนี้", en: "Today" } },
  { key: "week", label: { th: "7 วัน", en: "7 days" } },
  { key: "allTime", label: { th: "ทั้งหมด", en: "All time" } },
];

export function SiteStats() {
  const { locale } = useLocale();
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    let cancelled = false;

    // sessionStorage throws in some privacy modes - a failed read just means
    // this tab counts itself again, which the primary key absorbs.
    let counted = false;
    try {
      counted = window.sessionStorage.getItem(SESSION_KEY) === "1";
    } catch {
      // ignore
    }

    fetch("/api/views", { method: counted ? "GET" : "POST" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: Stats | null) => {
        if (cancelled || !data) return;
        setStats(data);
        try {
          window.sessionStorage.setItem(SESSION_KEY, "1");
        } catch {
          // ignore
        }
      })
      .catch(() => {
        // The counter is decoration - never surface a failure to the reader.
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const format = (n: number) =>
    new Intl.NumberFormat(locale === "th" ? "th-TH" : "en-US").format(n);

  return (
    <dl
      className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground"
      aria-label={locale === "th" ? "จำนวนผู้เข้าชม" : "Visitor counts"}
      aria-busy={stats === null}
    >
      {LABELS.map(({ key, label }) => (
        <div key={key} className="flex items-baseline gap-1.5">
          <dt>{t(label, locale)}</dt>
          <dd className="font-mono font-medium tabular-nums text-foreground">
            {stats ? (
              format(stats[key])
            ) : (
              <span
                className="inline-block h-3 w-6 animate-pulse rounded bg-muted align-middle"
                aria-hidden="true"
              />
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}
