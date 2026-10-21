"use client";

import type { ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const TONES = {
  red: {
    bar: "from-red-600 via-rose-600 to-red-600",
    accent: "text-red-600",
    close: "hover:bg-rose-50 border-red-200/80",
    cta: "hover:bg-red-50",
  },
  blue: {
    bar: "from-blue-600 via-sky-500 to-blue-600",
    accent: "text-blue-600",
    close: "hover:bg-sky-50 border-blue-200/80",
    cta: "hover:bg-sky-50",
  },
} as const;

type PromoCta = {
  label: ReactNode;
  title?: string;
} & ({ onClick: () => void; href?: never } | { href: string; onClick?: never });

export interface PromoBannerProps {
  tone: keyof typeof TONES;
  tag: string;
  emoji: string;
  title: string;
  cta: PromoCta;
  onDismiss: () => void;
}

/**
 * The floating emergency-style strip: bouncing tag + headline on the left,
 * CTA on the right, close button sticking out of the top-right corner.
 * Only the tone, copy and CTA target change between banners.
 */
export function PromoBanner({
  tone,
  tag,
  emoji,
  title,
  cta,
  onDismiss,
}: PromoBannerProps) {
  const colors = TONES[tone];
  const ctaClass = cn(
    "relative group overflow-hidden inline-flex items-center justify-center gap-1.5 rounded-xl bg-white font-extrabold text-xs sm:text-sm h-8 sm:h-8.5 px-3 sm:px-3.5 shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer",
    colors.accent,
    colors.cta,
  );

  return (
    <div
      className={cn(
        "relative rounded-2xl bg-gradient-to-r px-3.5 py-2.5 sm:px-4 sm:py-3 text-white shadow-lg shadow-black/20 border border-white/25",
        colors.bar,
      )}
    >
      {/* Animated shimmer beam confined to inner card */}
      <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
        <span className="absolute inset-0 -translate-x-full animate-[emergency-shimmer_2.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </div>

      {/* Protruding Close Button on Top-Right Corner */}
      <button
        type="button"
        onClick={onDismiss}
        className={cn(
          "absolute -top-2.5 -right-2 sm:-top-3 sm:-right-2.5 z-20 size-6 sm:size-7 rounded-full bg-white hover:scale-110 active:scale-95 shadow-md shadow-black/25 border flex items-center justify-center transition-all cursor-pointer group",
          colors.accent,
          colors.close,
        )}
        aria-label="ปิดแถบนี้ (ซ่อน 24 ชั่วโมง)"
        title="ปิดแถบนี้ (ซ่อน 24 ชั่วโมง)"
      >
        <X className="size-3.5 sm:size-4 stroke-[2.5] group-hover:rotate-90 transition-transform" />
      </button>

      <div className="flex items-center justify-between gap-3 sm:gap-4 relative z-10">
        {/* Left: Punchy title & tag */}
        <div className="flex items-center gap-2 min-w-0">
          <span
            className={cn(
              "shrink-0 bg-white font-black text-[10px] sm:text-xs px-2 py-0.5 rounded-full uppercase tracking-wider animate-bounce shadow-xs inline-flex items-center gap-1",
              colors.accent,
            )}
          >
            <span>{tag}</span>
            <span>{emoji}</span>
          </span>
          <h4 className="font-bold text-xl sm:text-xl text-white tracking-tight truncate drop-shadow-xs">
            {title}
          </h4>
        </div>

        {/* Right: CTA button */}
        <div className="flex items-center shrink-0">
          {cta.href ? (
            <a
              href={cta.href}
              target="_blank"
              rel="noopener noreferrer sponsored"
              title={cta.title}
              className={ctaClass}
            >
              {cta.label}
            </a>
          ) : (
            <button
              type="button"
              onClick={cta.onClick}
              title={cta.title}
              className={ctaClass}
            >
              {cta.label}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
