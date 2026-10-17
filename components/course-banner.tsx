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
        {/* Quiet circles on the right: texture, not content. */}
        <svg
          aria-hidden="true"
          viewBox="0 0 240 180"
          className="pointer-events-none absolute -right-8 -top-6 -z-10 h-full w-auto max-w-none text-primary-foreground opacity-10"
          fill="currentColor"
        >
          <circle cx="170" cy="60" r="90" />
          <circle cx="60" cy="150" r="48" opacity="0.6" />
          <circle cx="225" cy="165" r="30" opacity="0.8" />
        </svg>

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
