"use client";

import Link from "next/link";
import { ItKmitlBadge } from "@/components/it-kmitl-badge";
import { OVERVIEW_TAB_LABEL, type OverviewTab } from "@/components/course-hub-shared";
import { useLocale, t, type LText } from "@/lib/i18n";

export interface CourseBannerProps {
  backHref: string;
  backLabel: LText;
  /** Short code, e.g. "ICS". */
  code: string;
  name: LText;
  /** Already joined, e.g. "06016411 · 3 (2-2-5)". */
  meta: string;
  /** One-line course description. */
  tagline?: LText | null;
  /** Faculty page; the badge is left out without it. */
  officialUrl?: string;
  /** Which readings exist (0–2); the switch only shows for two. */
  overviewTabs: OverviewTab[];
  overviewTab: OverviewTab;
  onOverviewTabChange: (tab: OverviewTab) => void;
}

const SWITCH_LABEL: LText = { th: "รูปแบบภาพรวม", en: "Overview version" };

/**
 * The class banner, Google Classroom style: one calm block in the course
 * colour with the name bottom-left. The summary/official switch sits in the
 * top-right corner — it changes how the overview below reads, so it belongs to
 * the course, not to the stream.
 */
export function CourseBanner({
  backHref,
  backLabel,
  code,
  name,
  meta,
  tagline,
  officialUrl,
  overviewTabs,
  overviewTab,
  onOverviewTabChange,
}: CourseBannerProps) {
  const { locale } = useLocale();
  const showSwitch = overviewTabs.length > 1;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <Link
          href={backHref}
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          {t(backLabel, locale)}
        </Link>
        {officialUrl && <ItKmitlBadge href={officialUrl} />}
      </div>

      <header
        className={`relative isolate flex min-h-36 flex-col justify-end overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary/80 p-5 text-primary-foreground sm:min-h-44 sm:p-7 ${
          showSwitch ? "pt-14 sm:pt-7 sm:pr-48" : ""
        }`}
      >
        {/*
         * The course code as a watermark, bleeding off the bottom-right corner:
         * each banner gets its own texture without per-course artwork. The chip
         * below still carries the code for screen readers.
         */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-3 -right-2 -z-10 select-none whitespace-nowrap text-[5.5rem] font-black leading-none tracking-tighter opacity-10 sm:-bottom-5 sm:text-[9rem]"
        >
          {code}
        </span>

        {showSwitch && (
          <div
            role="group"
            aria-label={t(SWITCH_LABEL, locale)}
            className="absolute right-3 top-3 inline-flex rounded-full bg-primary-foreground/15 p-0.5 backdrop-blur sm:right-5 sm:top-5"
          >
            {overviewTabs.map((tab) => {
              const active = tab === overviewTab;
              return (
                <button
                  key={tab}
                  type="button"
                  aria-pressed={active}
                  onClick={() => onOverviewTabChange(tab)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                    active
                      ? "bg-primary-foreground text-primary"
                      : "text-primary-foreground/85 hover:text-primary-foreground"
                  }`}
                >
                  {t(OVERVIEW_TAB_LABEL[tab], locale)}
                </button>
              );
            })}
          </div>
        )}

        <div className="space-y-1.5">
          <span className="inline-block rounded-full bg-primary-foreground/15 px-2.5 py-0.5 font-mono text-xs">
            {code}
          </span>
          <h1 className="text-2xl font-semibold leading-tight sm:text-3xl">{t(name, locale)}</h1>
          {meta && <p className="text-sm opacity-85">{meta}</p>}
          {tagline && (
            <p className="line-clamp-2 text-sm opacity-90 sm:line-clamp-1">{t(tagline, locale)}</p>
          )}
        </div>
      </header>
    </div>
  );
}
