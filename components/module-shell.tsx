"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useLocale, t, type LText } from "@/lib/i18n";

/**
 * Framing for the modules that are not a plain reader — a quiz gate, a lab
 * bench. A client component because the heading is bilingual and the locale
 * lives in a context; rendering it on the server would pin every module page
 * to Thai regardless of the toggle.
 */
export function ModuleShell({
  backHref,
  backLabel,
  title,
  subtitle,
  children,
}: {
  backHref: string;
  backLabel: LText;
  title: LText;
  subtitle: LText;
  children: React.ReactNode;
}) {
  const { locale } = useLocale();
  return (
    <main className="mx-auto w-full max-w-4xl px-3 sm:px-6 py-5 sm:py-8">
      <div className="mb-4 flex items-center justify-between text-xs sm:text-sm">
        <Link
          href={backHref}
          className="inline-flex items-center gap-1.5 font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="size-3.5 sm:size-4" />
          {t(backLabel, locale)}
        </Link>
      </div>
      <header className="mb-5">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">{t(title, locale)}</h1>
        <p className="mt-1 text-xs sm:text-sm text-muted-foreground">{t(subtitle, locale)}</p>
      </header>
      {children}
    </main>
  );
}
