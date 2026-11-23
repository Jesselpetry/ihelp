"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Calculator,
  Calendar,
  ArrowRight,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { useLocale, t } from "@/lib/i18n";
import { IHELP_GRADIENT_CSS } from "@/lib/courses/course-theme";
import { CourseWatermark } from "@/components/course-watermark";
import {
  HERO_SLIDES,
  type HeroSlide,
  type HeroIconName,
} from "@/lib/home/hero-slides";
import { cn } from "@/lib/utils";

const AUTOPLAY_INTERVAL = 6000;
const SWIPE_THRESHOLD = 50;

const HERO_ICON_MAP: Record<HeroIconName, LucideIcon> = {
  sparkles: Sparkles,
  calculator: Calculator,
  calendar: Calendar,
  "arrow-right": ArrowRight,
  "trending-up": TrendingUp,
};

export function HeroCarousel({
  slides = HERO_SLIDES,
  className,
}: {
  slides?: HeroSlide[];
  className?: string;
}) {
  const { locale } = useLocale();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const total = slides.length;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Autoplay loop
  useEffect(() => {
    if (isPaused || total <= 1) return;
    const timer = setInterval(() => {
      nextSlide();
    }, AUTOPLAY_INTERVAL);
    return () => clearInterval(timer);
  }, [isPaused, nextSlide, total]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") prevSlide();
    if (e.key === "ArrowRight") nextSlide();
  };

  // Touch swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > SWIPE_THRESHOLD) nextSlide();
    if (distance < -SWIPE_THRESHOLD) prevSlide();
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const activeSlide = slides[currentIndex];
  const BadgeIcon = activeSlide.badgeIcon ? HERO_ICON_MAP[activeSlide.badgeIcon] : null;
  const CtaIcon = activeSlide.cta.icon ? HERO_ICON_MAP[activeSlide.cta.icon] : null;

  return (
    <section
      role="region"
      aria-roledescription="carousel"
      aria-label="iHelp Featured Highlights"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ background: IHELP_GRADIENT_CSS }}
      className={cn(
        "relative isolate overflow-hidden rounded-2xl sm:rounded-3xl border border-white/10 shadow-sm sm:shadow-md text-white select-none transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/80",
        className
      )}
    >
      {/* Enlarged IT Logo Watermark Bleed (Bottom-Right) */}
      <CourseWatermark
        code={activeSlide.watermarkCode ?? "IT"}
        size="banner"
        className="-bottom-5 -right-5 sm:-bottom-7 sm:-right-7 opacity-25 scale-125 sm:scale-150 origin-bottom-right"
      />

      {/* Main Slide Content Track with Smooth Fade Transition */}
      <div
        key={activeSlide.id}
        className="relative z-10 flex flex-col justify-between p-4 sm:p-6 md:p-7 min-h-[200px] md:h-[205px] animate-in fade-in-50 duration-300"
      >
        {/* Copy & Badges */}
        <div className="space-y-2 max-w-2xl sm:max-w-3xl">
          {/* Top Badge */}
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-0.5 sm:px-3 sm:py-1 text-[11px] sm:text-xs font-semibold text-white backdrop-blur-xs border border-white/20">
            {BadgeIcon && <BadgeIcon className="size-3.5 text-white/90" />}
            <span>{t(activeSlide.badge, locale)}</span>
          </div>

          {/* Title */}
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-white leading-snug">
            {t(activeSlide.title, locale)}
          </h2>

          {/* Description */}
          <p className="text-xs sm:text-sm text-white/85 line-clamp-2 leading-relaxed max-w-2xl">
            {t(activeSlide.description, locale)}
          </p>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-wrap items-center gap-2.5 pt-2">
          <Link
            href={activeSlide.cta.href}
            className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 sm:px-5 sm:py-2 text-xs sm:text-sm font-semibold text-slate-900 shadow-sm hover:bg-white/90 active:scale-95 transition-all group"
          >
            <span>{t(activeSlide.cta.label, locale)}</span>
            {CtaIcon && (
              <CtaIcon className="size-3.5 transition-transform group-hover:translate-x-0.5" />
            )}
          </Link>

          {activeSlide.secondaryCta && (
            <Link
              href={activeSlide.secondaryCta.href}
              className="inline-flex items-center gap-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-white backdrop-blur-xs transition-all"
            >
              <span>{t(activeSlide.secondaryCta.label, locale)}</span>
            </Link>
          )}
        </div>
      </div>

      {/* Bottom Controls Bar: Expanding Pill Indicators & White Arrows */}
      <div className="relative z-20 flex items-center justify-between px-4 pb-3 sm:px-6 sm:pb-3.5">
        {/* Indicators */}
        <div className="flex items-center gap-1.5" role="tablist" aria-label="Slide Selection">
          {slides.map((slide, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={slide.id}
                role="tab"
                aria-selected={isActive}
                aria-label={`Go to slide ${idx + 1}`}
                onClick={() => setCurrentIndex(idx)}
                className={cn(
                  "transition-all duration-300 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer",
                  isActive
                    ? "w-6 h-2 bg-white"
                    : "size-2 bg-white/35 hover:bg-white/60"
                )}
              />
            );
          })}
        </div>

        {/* Navigation Arrows (White Icons on Dark Translucent Glass) */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={prevSlide}
            aria-label="Previous slide"
            className="flex size-7 sm:size-8 items-center justify-center rounded-full bg-black/40 hover:bg-black/60 dark:bg-white/10 dark:hover:bg-white/20 border border-white/15 text-white backdrop-blur-md shadow-sm active:scale-95 transition-all cursor-pointer"
          >
            <ChevronLeft className="size-3.5 sm:size-4 text-white" />
          </button>
          <button
            onClick={nextSlide}
            aria-label="Next slide"
            className="flex size-7 sm:size-8 items-center justify-center rounded-full bg-black/40 hover:bg-black/60 dark:bg-white/10 dark:hover:bg-white/20 border border-white/15 text-white backdrop-blur-md shadow-sm active:scale-95 transition-all cursor-pointer"
          >
            <ChevronRight className="size-3.5 sm:size-4 text-white" />
          </button>
        </div>
      </div>
    </section>
  );
}
