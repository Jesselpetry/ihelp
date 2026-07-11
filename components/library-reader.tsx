"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, TableOfContents } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MdView } from "@/components/md-view";
import { useLocale, t, type LText } from "@/lib/i18n";
import type { LibraryDoc } from "@/lib/library";

const L: Record<string, LText> = {
  toc: { th: "สารบัญ", en: "Contents" },
  prev: { th: "บทก่อนหน้า", en: "Previous" },
  next: { th: "บทถัดไป", en: "Next" },
  chapter: { th: "บทที่", en: "Chapter" },
  of: { th: "จาก", en: "of" },
  onlyVariant: {
    th: "เอกสารนี้มีเฉพาะภาษาอังกฤษ",
    en: "This document is only available in Thai.",
  },
};

interface ReaderProps {
  title: string;
  sectionTitle: LText;
  index: number;
  total: number;
  th: string | null;
  en: string | null;
  prev: LibraryDoc | null;
  next: LibraryDoc | null;
}

export function LibraryReader({
  title,
  sectionTitle,
  index,
  total,
  th,
  en,
  prev,
  next,
}: ReaderProps) {
  const { locale } = useLocale();

  // Follow the UI locale, falling back to whichever variant exists.
  const content = locale === "th" ? (th ?? en) : (en ?? th);
  const missingVariant = locale === "th" ? !th : !en;

  // New chapter = start reading from the top, like turning a page.
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [index]);

  return (
    <main className="max-w-3xl mx-auto px-6 py-8 w-full">
      <div className="mb-4 flex items-center justify-between text-sm">
        <Link
          href="/library"
          className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-primary"
        >
          <TableOfContents className="size-4" />
          {t(L.toc, locale)}
        </Link>
        <span className="text-xs text-muted-foreground tabular-nums">
          {t(L.chapter, locale)} {index + 1} {t(L.of, locale)} {total}
        </span>
      </div>

      {/* progress like a reading position bar */}
      <div className="mb-6 h-1 rounded-full bg-border overflow-hidden">
        <div
          className="h-full bg-primary transition-all"
          style={{ width: `${((index + 1) / total) * 100}%` }}
        />
      </div>

      <article className="bg-card rounded-2xl border shadow-sm px-6 sm:px-10 py-10">
        <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-1">
          {t(sectionTitle, locale)}
        </p>
        {missingVariant && (
          <p className="text-xs text-muted-foreground mb-2">
            {th ? L.onlyVariant.en : L.onlyVariant.th}
          </p>
        )}
        {content && !/^#\s/.test(content.trimStart()) && (
          <h1 className="tracking-tight text-3xl font-bold mt-2 mb-6 leading-snug">{title}</h1>
        )}
        <MdView markdown={content ?? ""} />
        <p className="mt-10 text-center tracking-tight text-sm text-muted-foreground select-none">
          — {index + 1} —
        </p>
      </article>

      <div className="mt-6 flex items-stretch justify-between gap-3">
        {prev ? (
          <Button asChild variant="outline" className="h-auto max-w-[48%] py-2.5 justify-start">
            <Link href={`/library/${prev.slug}`}>
              <ArrowLeft className="size-4 shrink-0" />
              <span className="text-left">
                <span className="block text-[10px] uppercase tracking-wide text-muted-foreground">
                  {t(L.prev, locale)}
                </span>
                <span className="block text-sm font-medium truncate">{prev.title}</span>
              </span>
            </Link>
          </Button>
        ) : (
          <span />
        )}
        {next ? (
          <Button asChild variant="outline" className="h-auto max-w-[48%] py-2.5 justify-end ml-auto">
            <Link href={`/library/${next.slug}`}>
              <span className="text-right">
                <span className="block text-[10px] uppercase tracking-wide text-muted-foreground">
                  {t(L.next, locale)}
                </span>
                <span className="block text-sm font-medium truncate">{next.title}</span>
              </span>
              <ArrowRight className="size-4 shrink-0" />
            </Link>
          </Button>
        ) : (
          <span />
        )}
      </div>
    </main>
  );
}
