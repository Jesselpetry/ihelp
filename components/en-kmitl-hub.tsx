"use client";

import { useMemo } from "react";
import Link from "next/link";
import { BookOpenText, BrainCircuit } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useLocale, t, type LText } from "@/lib/i18n";
import { EN_KMITL_CHAPTERS, EN_KMITL_QUIZ } from "@/lib/en-kmitl-quiz";

const L: Record<string, LText> = {
  title: { th: "EN-KMITL · Computer Programming", en: "EN-KMITL · Computer Programming" },
  subtitle: {
    th: "01006012 Computer Programming — เตรียมสอบกลางภาค (บทที่ 1-5)",
    en: "01006012 Computer Programming — midterm prep (Chapters 1-5)",
  },
  summaryTitle: { th: "สรุปเนื้อหา", en: "Summary" },
  summaryDesc: {
    th: "สรุปครบทุกบท: พื้นฐานคอมพิวเตอร์, ตัวแปร/นิพจน์, เงื่อนไข, while, for, และภาคผนวก (list/string/dict/tuple/file)",
    en: "Full chapter recap: computer basics, variables/expressions, conditionals, while, for, plus appendix (list/string/dict/tuple/file)",
  },
  quizTitle: { th: "แบบทดสอบตัวเอง", en: "Self-test Quiz" },
  quizDesc: {
    th: "ทดสอบความเข้าใจจุดที่ข้อสอบชอบออก รวมข้อสอบจำลอง 60 ข้อ",
    en: "Test yourself on exam-favorite traps, including all 60 mock exam questions",
  },
  mockExamNote: {
    th: "ข้อสอบจำลอง 60 ข้อรวมอยู่ในแบบทดสอบแล้ว (ต้นฉบับอยู่ในโฟลเดอร์ recommended/ce-kmitl ของ repo pscp-69070027)",
    en: "All 60 mock exam questions are included in the quiz (source markdown lives in the pscp-69070027 repo's recommended/ce-kmitl folder)",
  },
  overviewTitle: { th: "ภาพรวมเนื้อหา", en: "Content Overview" },
  chapter: { th: "บทที่", en: "Ch." },
  questions: { th: "ข้อ", en: "q" },
};

export function EnKmitlHub({ hasMockExam }: { hasMockExam: boolean }) {
  const { locale } = useLocale();

  const countByChapter = useMemo(() => {
    const counts: Record<number, number> = {};
    for (const q of EN_KMITL_QUIZ) {
      if (q.chapter === undefined) continue;
      counts[q.chapter] = (counts[q.chapter] ?? 0) + 1;
    }
    return counts;
  }, []);

  return (
    <main className="mx-auto max-w-3xl px-3 sm:px-6 py-6 sm:py-10 w-full">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{t(L.title, locale)}</h1>
        <p className="mt-1.5 text-sm sm:text-base text-muted-foreground">{t(L.subtitle, locale)}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/en-kmitl/summary"
          className="group rounded-3xl border bg-card p-5 sm:p-6 shadow-sm transition-colors hover:border-primary/50 hover:bg-primary/5"
        >
          <BookOpenText className="size-6 text-primary" />
          <h2 className="mt-3 text-lg font-semibold group-hover:text-primary transition-colors">
            {t(L.summaryTitle, locale)}
          </h2>
          <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{t(L.summaryDesc, locale)}</p>
        </Link>

        <Link
          href="/en-kmitl/quiz"
          className="group rounded-3xl border bg-card p-5 sm:p-6 shadow-sm transition-colors hover:border-primary/50 hover:bg-primary/5"
        >
          <BrainCircuit className="size-6 text-primary" />
          <h2 className="mt-3 text-lg font-semibold group-hover:text-primary transition-colors">
            {t(L.quizTitle, locale)}
          </h2>
          <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{t(L.quizDesc, locale)}</p>
        </Link>
      </div>

      <div className="mt-6 rounded-3xl border bg-card p-5 sm:p-6 shadow-sm">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {t(L.overviewTitle, locale)}
        </h3>
        <ul className="mt-3 space-y-1.5">
          {EN_KMITL_CHAPTERS.map(({ chapter, title }) => {
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
                  {t(title, locale)}
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

      {hasMockExam && (
        <p className="mt-6 text-xs sm:text-sm text-muted-foreground">{t(L.mockExamNote, locale)}</p>
      )}
    </main>
  );
}
