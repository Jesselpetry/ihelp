"use client";

import React, { type ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { useLocale, t, type LText } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export interface SectionHeaderProps {
  /** Lucide icon rendered inside the signature white-on-primary icon box */
  icon: LucideIcon;
  /** Bilingual LText ({ th, en }) or plain string title */
  title: LText | string;
  /** Optional bilingual LText or string subtitle/description */
  description?: LText | string;
  /** Optional badge placed immediately adjacent to the title */
  badge?: ReactNode;
  /** Optional right-aligned action slot (e.g. counter pill, view all link, search bar) */
  rightSlot?: ReactNode;
  /** Custom class overrides for outer container */
  className?: string;
  /** Anchor ID for navigation jump targets */
  id?: string;
}

export function SectionHeader({
  icon: Icon,
  title,
  description,
  badge,
  rightSlot,
  className,
  id,
}: SectionHeaderProps) {
  const { locale } = useLocale();

  const titleText = typeof title === "string" ? title : t(title, locale);
  const descText =
    description && (typeof description === "string" ? description : t(description, locale));

  return (
    <div
      id={id}
      className={cn(
        "flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/80 pb-3.5 mb-5",
        className
      )}
    >
      {/* Left cluster: Icon box + Title & Description */}
      <div className="flex items-start sm:items-center gap-3 min-w-0">
        {/* Strict White Icon Standard Box */}
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-white shadow-xs">
          <Icon className="size-5 text-white" strokeWidth={2.25} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-base sm:text-lg font-bold tracking-tight text-foreground">
              {titleText}
            </h2>
            {badge && <div className="shrink-0">{badge}</div>}
          </div>
          {descText && (
            <p className="mt-0.5 text-xs sm:text-sm text-muted-foreground leading-normal line-clamp-1 sm:line-clamp-none">
              {descText}
            </p>
          )}
        </div>
      </div>

      {/* Right cluster: Optional action pill, count badge, or link */}
      {rightSlot && (
        <div className="flex items-center gap-2 shrink-0 self-start sm:self-center pl-13 sm:pl-0">
          {rightSlot}
        </div>
      )}
    </div>
  );
}
