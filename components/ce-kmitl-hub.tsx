"use client";

import Link from "next/link";
import { BookOpenText, BrainCircuit } from "lucide-react";
import { useLocale, t, type LText } from "@/lib/i18n";

const L: Record<string, LText> = {
  title: { th: "CE-KMITL · Computer Programming", en: "CE-KMITL · Computer Programming" },
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
    th: "ทดสอบความเข้าใจจุดที่ข้อสอบชอบออก เช่น operator precedence, float comparison, loop idioms",
    en: "Test yourself on exam-favorite traps: operator precedence, float comparison, loop idioms",
  },
  mockExamNote: {
    th: "มีข้อสอบจำลอง 60 ข้อพร้อมเฉลยในโฟลเดอร์ recommended/ce-kmitl ของ repo pscp-69070027",
    en: "A 60-question mock exam with answers is available in the pscp-69070027 repo's recommended/ce-kmitl folder",
  },
};

export function CeKmitlHub({ hasMockExam }: { hasMockExam: boolean }) {
  const { locale } = useLocale();
  return (
    <main className="mx-auto max-w-3xl px-3 sm:px-6 py-6 sm:py-10 w-full">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{t(L.title, locale)}</h1>
        <p className="mt-1.5 text-sm sm:text-base text-muted-foreground">{t(L.subtitle, locale)}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/ce-kmitl/summary"
          className="group rounded-3xl border bg-card p-5 sm:p-6 shadow-sm transition-colors hover:border-primary/50 hover:bg-primary/5"
        >
          <BookOpenText className="size-6 text-primary" />
          <h2 className="mt-3 text-lg font-semibold group-hover:text-primary transition-colors">
            {t(L.summaryTitle, locale)}
          </h2>
          <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{t(L.summaryDesc, locale)}</p>
        </Link>

        <Link
          href="/ce-kmitl/quiz"
          className="group rounded-3xl border bg-card p-5 sm:p-6 shadow-sm transition-colors hover:border-primary/50 hover:bg-primary/5"
        >
          <BrainCircuit className="size-6 text-primary" />
          <h2 className="mt-3 text-lg font-semibold group-hover:text-primary transition-colors">
            {t(L.quizTitle, locale)}
          </h2>
          <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{t(L.quizDesc, locale)}</p>
        </Link>
      </div>

      {hasMockExam && (
        <p className="mt-6 text-xs sm:text-sm text-muted-foreground">{t(L.mockExamNote, locale)}</p>
      )}
    </main>
  );
}
