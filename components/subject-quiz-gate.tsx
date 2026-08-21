"use client";

import { useState } from "react";
import { ListChecks, PlayCircle, BrainCircuit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocale, t, type LText } from "@/lib/i18n";
import { TechniqueQuiz } from "@/components/technique-quiz";
import type { QuizQuestion } from "@/lib/quiz";

interface SubjectChapter {
  chapter: number;
  title: LText;
}

interface SubjectQuizGateProps {
  quizId: number;
  quizName: string;
  questions: QuizQuestion[];
  chapters: SubjectChapter[];
  /** Overrides the "Chapter" prefix in the overview list (e.g. "Week" for MFIT) */
  chapterLabel?: LText;
}

const L: Record<string, LText> = {
  title: { th: "แบบทดสอบ", en: "Self-test Quiz" },
  subtitle: { th: "ภาพรวมเนื้อหาที่ครอบคลุมในแบบทดสอบนี้", en: "Overview of what this quiz covers" },
  chapter: { th: "บทที่", en: "Chapter" },
  questions: { th: "ข้อ", en: "questions" },
  notCovered: { th: "ยังไม่มีข้อสอบ", en: "No questions yet" },
  totalQuestions: { th: "จำนวนข้อทั้งหมด", en: "Total questions" },
  start: { th: "เริ่มทำแบบทดสอบ", en: "Start Quiz" },
};

/** Generic quiz gate: shows a chapter-level overview then launches TechniqueQuiz */
export function SubjectQuizGate({
  quizId,
  quizName,
  questions,
  chapters,
  chapterLabel,
}: SubjectQuizGateProps) {
  const [started, setStarted] = useState(false);
  const { locale } = useLocale();

  if (started) {
    return (
      <TechniqueQuiz
        problemId={quizId}
        problemName={quizName}
        questions={questions}
      />
    );
  }

  // Count questions per chapter
  const countByChapter: Record<number, number> = {};
  for (const q of questions) {
    if (q.chapter === undefined) continue;
    countByChapter[q.chapter] = (countByChapter[q.chapter] ?? 0) + 1;
  }

  return (
    <div className="space-y-5">
      <div className="flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <ListChecks className="size-5" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">{t(L.title, locale)} · {quizName}</h2>
          <p className="text-sm text-muted-foreground">{t(L.subtitle, locale)}</p>
        </div>
      </div>

      <ul className="space-y-2">
        {chapters.map(({ chapter, title }) => {
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
                  {t(chapterLabel ?? L.chapter, locale)} {chapter}
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
        <span className="flex items-center gap-1.5 text-sm font-medium">
          <BrainCircuit className="size-4 text-primary" />
          {t(L.totalQuestions, locale)}
        </span>
        <span className="font-mono text-lg font-bold text-primary">{questions.length}</span>
      </div>

      <Button onClick={() => setStarted(true)} className="w-full rounded-full gap-1.5" size="lg">
        <PlayCircle className="size-4" />
        {t(L.start, locale)}
      </Button>
    </div>
  );
}
