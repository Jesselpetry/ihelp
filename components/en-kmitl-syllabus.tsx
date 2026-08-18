"use client";

import { useMemo } from "react";
import { ListChecks, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocale, t, type LText } from "@/lib/i18n";
import type { QuizQuestion } from "@/lib/quiz";
import { EN_KMITL_CHAPTERS } from "@/lib/en-kmitl-quiz";

const L: Record<string, LText> = {
  title: { th: "แบบทดสอบ EN-KMITL", en: "EN-KMITL Self-test" },
  subtitle: {
    th: "ภาพรวมเนื้อหาที่ครอบคลุมในแบบทดสอบนี้ ก่อนเริ่มทำ",
    en: "Overview of what this quiz covers before you start",
  },
  chapter: { th: "บทที่", en: "Chapter" },
  questions: { th: "ข้อ", en: "questions" },
  notCovered: { th: "ยังไม่มีข้อสอบในบทนี้", en: "No questions yet for this chapter" },
  totalQuestions: { th: "จำนวนข้อทั้งหมด", en: "Total questions" },
  start: { th: "เริ่มทำแบบทดสอบ", en: "Start Quiz" },
};

export function EnKmitlSyllabus({
  questions,
  onStart,
}: {
  questions: QuizQuestion[];
  onStart: () => void;
}) {
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
    <div className="space-y-5">
      <div className="flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <ListChecks className="size-5" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">{t(L.title, locale)}</h2>
          <p className="text-sm text-muted-foreground">{t(L.subtitle, locale)}</p>
        </div>
      </div>

      <ul className="space-y-2">
        {EN_KMITL_CHAPTERS.map(({ chapter, title }) => {
          const count = countByChapter[chapter] ?? 0;
          return (
            <li
              key={chapter}
              className={
                "flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 " +
                (count > 0 ? "bg-card" : "bg-muted/20 opacity-60")
              }
            >
              <div className="min-w-0">
                <p className="text-xs font-mono uppercase tracking-wide text-muted-foreground">
                  {t(L.chapter, locale)} {chapter}
                </p>
                <p className="truncate text-sm font-medium">{t(title, locale)}</p>
              </div>
              <Badge
                variant={count > 0 ? "default" : "outline"}
                className="rounded-full font-mono text-[11px] shrink-0"
              >
                {count > 0 ? `${count} ${t(L.questions, locale)}` : t(L.notCovered, locale)}
              </Badge>
            </li>
          );
        })}
      </ul>

      <div className="flex items-center justify-between rounded-2xl border bg-muted/20 px-4 py-3">
        <span className="text-sm font-medium">{t(L.totalQuestions, locale)}</span>
        <span className="font-mono text-lg font-bold text-primary">{questions.length}</span>
      </div>

      <Button onClick={onStart} className="w-full rounded-full gap-1.5" size="lg">
        <PlayCircle className="size-4" />
        {t(L.start, locale)}
      </Button>
    </div>
  );
}
