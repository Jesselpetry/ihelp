"use client";

import Link from "next/link";
import {
  ChevronRight,
  Compass,
  Calculator,
  CalendarClock,
  Terminal,
  Cpu,
  type LucideIcon,
} from "lucide-react";
import { useLocale, t } from "@/lib/i18n";
import {
  QUICK_NAV_PILL_ITEMS,
  QUICK_NAV_SUBTITLE,
  QUICK_NAV_TITLE,
  type QuickNavPillItem,
  type QuickNavIconName,
} from "@/lib/home/quick-nav-data";
import { StudentProfileCapsule } from "./student-profile-capsule";
import { cn } from "@/lib/utils";

const PILL_ICON_MAP: Record<QuickNavIconName, LucideIcon> = {
  calculator: Calculator,
  "calendar-clock": CalendarClock,
  terminal: Terminal,
  compass: Compass,
  cpu: Cpu,
};

export function QuickNavPill({ item }: { item: QuickNavPillItem }) {
  const { locale } = useLocale();
  const Icon = PILL_ICON_MAP[item.icon] ?? Compass;

  return (
    <Link
      href={item.href}
      className="group relative flex items-center justify-between gap-3 rounded-full border border-border/80 bg-card px-3.5 py-2 sm:px-4 sm:py-2.5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-accent/40 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 dark:border-white/10 cursor-pointer"
    >
      {/* ── Left: iHelp Blue Icon + Normal Foreground Text ── */}
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary transition-transform duration-200 group-hover:scale-110">
          <Icon className="size-4 text-primary shrink-0" strokeWidth={2.25} />
        </div>
        <span className="truncate text-xs sm:text-sm font-semibold text-foreground tracking-tight transition-colors group-hover:text-primary">
          {t(item.label, locale)}
        </span>
      </div>

      {/* ── Right: Subtle Chevron Indicator ── */}
      <div className="flex items-center gap-1.5 shrink-0 text-muted-foreground/40 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-primary">
        {item.badge && (
          <span className="hidden sm:inline-block rounded-full bg-muted px-2 py-0.5 font-mono text-[10px] font-medium text-muted-foreground">
            {t(item.badge, locale)}
          </span>
        )}
        <ChevronRight className="size-3.5" />
      </div>
    </Link>
  );
}

export function QuickNavPillsSection({
  items = QUICK_NAV_PILL_ITEMS,
  className,
}: {
  items?: QuickNavPillItem[];
  className?: string;
}) {
  const { locale } = useLocale();

  return (
    <section
      aria-label={t(QUICK_NAV_TITLE, locale)}
      className={cn("w-full space-y-3.5", className)}
    >
      {/* Section Header with Student Profile Badge on Right — Standardized height & icon */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/80 pb-3 sm:pb-3.5">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-white shadow-xs">
            <Compass className="size-5 text-white" strokeWidth={2.25} />
          </div>
          <div className="min-w-0">
            <h2 className="text-base sm:text-lg font-bold tracking-tight text-foreground truncate">
              {t(QUICK_NAV_TITLE, locale)}
            </h2>
            <p className="text-xs text-muted-foreground leading-normal line-clamp-1 sm:line-clamp-none">
              {t(QUICK_NAV_SUBTITLE, locale)}
            </p>
          </div>
        </div>

        {/* Clean Student Profile Badge / Google Sign-in */}
        <div className="shrink-0 self-start sm:self-center">
          <StudentProfileCapsule />
        </div>
      </div>

      {/* Dynamic 5-column Pill Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-2.5 sm:gap-3">
        {items.map((item) => (
          <QuickNavPill key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
