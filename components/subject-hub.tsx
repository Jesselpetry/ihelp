"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  BookOpenText,
  BrainCircuit,
  FileCheck2,
  Library,
  Microscope,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useLocale, t, type LText } from "@/lib/i18n";
import type { QuizQuestion } from "@/lib/quiz";

interface SubjectChapter {
  chapter: number;
  title: LText;
}

// Icons are looked up by key, not passed as props: a Server Component page
// cannot hand a component reference to this Client Component.
const EXTRA_ICONS = {
  "file-check": FileCheck2,
  microscope: Microscope,
  book: BookOpenText,
} satisfies Record<string, LucideIcon>;

export type SubjectExtraIcon = keyof typeof EXTRA_ICONS;

/** Extra module card rendered next to summary / quiz / library */
export interface SubjectExtraCard {
  /** Path appended to baseHref, e.g. "exam" → "/it-kmitl/ics/exam" */
  slug: string;
  icon: SubjectExtraIcon;
  title: LText;
  desc: LText;
}

interface SubjectHubProps {
  /** Root href of this subject, e.g. "/en-kmitl/compro" */
  baseHref: string;
  /** Link back to the selection hub */
  backHref: string;
  backLabel: LText;
  title: LText;
  subtitle: LText;
  summaryCardTitle: LText;
  summaryCardDesc: LText;
  quizCardTitle: LText;
  quizCardDesc: LText;
  libraryCardTitle: LText;
  libraryCardDesc: LText;
  overviewTitle: LText;
  chapters: SubjectChapter[];
  questions: QuizQuestion[];
  /** Optional footer note rendered below the chapter table */
  footerNote?: LText;
  /** Optional extra module cards (e.g. past exam, exam analysis) */
  extraCards?: SubjectExtraCard[];
}

const L: Record<string, LText> = {
  chapter: { th: "บทที่", en: "Ch." },
  questions: { th: "ข้อ", en: "q" },
  back: { th: "← EN-KMITL", en: "← EN-KMITL" },
};

export function SubjectHub({
  baseHref,
  backHref,
  backLabel,
  title,
  subtitle,
  summaryCardTitle,
  summaryCardDesc,
  quizCardTitle,
  quizCardDesc,
  libraryCardTitle,
  libraryCardDesc,
  overviewTitle,
  chapters,
  questions,
  footerNote,
  extraCards,
}: SubjectHubProps) {
  const { locale } = useLocale();

  const countByChapter = useMemo(() => {
    const counts: Record<number, number> = {};
    for (const q of questions) {
      if (q.chapter === undefined) continue;
      counts[q.chapter] = (counts[q.chapter] ?? 0) + 1;
    }
    return counts;
  }, [questions]);

  return (
    <main className="mx-auto max-w-3xl px-3 sm:px-6 py-6 sm:py-10 w-full">
      {/* Back link */}
      <Link
        href={backHref}
        className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors font-medium mb-5 sm:mb-6"
      >
        {t(backLabel, locale)}
      </Link>

      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          {t(title, locale)}
        </h1>
        <p className="mt-1.5 text-sm sm:text-base text-muted-foreground">
          {t(subtitle, locale)}
        </p>
      </div>

      {/* Module cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Link
          href={`${baseHref}/summary`}
          className="group rounded-3xl border bg-card p-5 shadow-sm transition-colors hover:border-primary/50 hover:bg-primary/5"
        >
          <BookOpenText className="size-6 text-primary" />
          <h2 className="mt-3 text-base font-semibold group-hover:text-primary transition-colors">
            {t(summaryCardTitle, locale)}
          </h2>
          <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
            {t(summaryCardDesc, locale)}
          </p>
        </Link>

        <Link
          href={`${baseHref}/quiz`}
          className="group rounded-3xl border bg-card p-5 shadow-sm transition-colors hover:border-primary/50 hover:bg-primary/5"
        >
          <BrainCircuit className="size-6 text-primary" />
          <h2 className="mt-3 text-base font-semibold group-hover:text-primary transition-colors">
            {t(quizCardTitle, locale)}
          </h2>
          <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
            {t(quizCardDesc, locale)}
          </p>
        </Link>

        <Link
          href={`${baseHref}/library`}
          className="group rounded-3xl border bg-card p-5 shadow-sm transition-colors hover:border-primary/50 hover:bg-primary/5"
        >
          <Library className="size-6 text-primary" />
          <h2 className="mt-3 text-base font-semibold group-hover:text-primary transition-colors">
            {t(libraryCardTitle, locale)}
          </h2>
          <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
            {t(libraryCardDesc, locale)}
          </p>
        </Link>

        {extraCards?.map(({ slug, icon, title: cardTitle, desc }) => {
          const Icon = EXTRA_ICONS[icon];
          return (
            <Link
              key={slug}
              href={`${baseHref}/${slug}`}
              className="group rounded-3xl border bg-card p-5 shadow-sm transition-colors hover:border-primary/50 hover:bg-primary/5"
            >
              <Icon className="size-6 text-primary" />
              <h2 className="mt-3 text-base font-semibold group-hover:text-primary transition-colors">
                {t(cardTitle, locale)}
              </h2>
              <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                {t(desc, locale)}
              </p>
            </Link>
          );
        })}
      </div>

      {/* Chapter overview */}
      <div className="mt-6 rounded-3xl border bg-card p-5 sm:p-6 shadow-sm">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {t(overviewTitle, locale)}
        </h3>
        <ul className="mt-3 space-y-1.5">
          {chapters.map(({ chapter, title: chTitle }) => {
            const count = countByChapter[chapter] ?? 0;
            return (
              <li
                key={chapter}
                className="flex items-center justify-between gap-3 rounded-xl px-2.5 py-1.5 text-sm"
              >
                <span className="min-w-0 truncate">
                  <span className="font-mono text-muted-foreground">
                    {t(L.chapter, locale)} {chapter}
                  </span>{" "}
                  {t(chTitle, locale)}
                </span>
                <Badge
                  variant={count > 0 ? "default" : "outline"}
                  className="rounded-full font-mono text-[10px] shrink-0"
                >
                  {count} {t(L.questions, locale)}
                </Badge>
              </li>
            );
          })}
        </ul>
      </div>

      {footerNote && (
        <p className="mt-6 text-xs sm:text-sm text-muted-foreground">
          {t(footerNote, locale)}
        </p>
      )}
    </main>
  );
}
