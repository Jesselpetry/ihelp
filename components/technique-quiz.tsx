"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Terminal,
  BookOpenCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocale, t, type LText } from "@/lib/i18n";
import { gradeAnswer, recordQuizAttempt, type QuizQuestion } from "@/lib/quiz";

const L: Record<string, LText> = {
  questionOf: { th: "ข้อที่", en: "Question" },
  of: { th: "จาก", en: "of" },
  check: { th: "ตรวจคำตอบ", en: "Check" },
  next: { th: "ข้อถัดไป", en: "Next" },
  seeSummary: { th: "ดูสรุปผล", en: "See Summary" },
  correct: { th: "ถูกต้อง!", en: "Correct!" },
  incorrect: { th: "ยังไม่ถูก", en: "Not quite" },
  source: { th: "อ้างอิง", en: "Source" },
  yourScore: { th: "คะแนนของคุณ", en: "Your Score" },
  reviewTitle: { th: "ทบทวนคำตอบทีละข้อ", en: "Question Review" },
  retry: { th: "ทำใหม่อีกครั้ง", en: "Retry Quiz" },
  nextProblem: { th: "ไปข้อถัดไป", en: "Next Problem" },
  stdinLabel: { th: "ข้อมูลนำเข้า (stdin)", en: "Input (stdin)" },
  hideExplain: { th: "ซ่อนคำอธิบาย", en: "Hide explanation" },
  showExplain: { th: "แสดงคำอธิบาย", en: "Show explanation" },
  keyHint: {
    th: "กด 1-4 เพื่อเลือกตัวเลือก, Enter เพื่อตรวจ/ไปต่อ",
    en: "Press 1-4 to select, Enter to check/continue",
  },
  wasCorrect: { th: "ตอบถูก", en: "Correct" },
  wasWrong: { th: "ตอบผิด", en: "Missed" },
};

interface TechniqueQuizProps {
  problemId: number;
  problemName: string;
  questions: QuizQuestion[];
  nextSlug?: string | null;
  nextName?: string | null;
}

const KIND_LABEL: Record<QuizQuestion["kind"], LText> = {
  mcq: { th: "ปรนัย", en: "Multiple Choice" },
  "predict-output": { th: "ทายผลลัพธ์", en: "Predict Output" },
  "spot-the-bug": { th: "หาจุดบัค", en: "Spot the Bug" },
  pep8: { th: "PEP-8", en: "PEP-8 Style" },
};

export function TechniqueQuiz({
  problemId,
  problemName,
  questions,
  nextSlug,
  nextName,
}: TechniqueQuizProps) {
  const { locale } = useLocale();
  const [index, setIndex] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [answers, setAnswers] = useState<Record<string, { selectedId: string; correct: boolean }>>({});
  const [done, setDone] = useState(false);
  const [expandedReview, setExpandedReview] = useState<string | null>(null);

  const question = questions[index];
  const isLast = index === questions.length - 1;

  const score = useMemo(
    () => Object.values(answers).filter((a) => a.correct).length,
    [answers],
  );

  function selectOption(id: string) {
    if (checked) return;
    setSelectedId(id);
  }

  function handleCheck() {
    if (!selectedId || !question) return;
    const correct = gradeAnswer(question, selectedId);
    setAnswers((prev) => ({ ...prev, [question.id]: { selectedId, correct } }));
    setChecked(true);
  }

  function handleNext() {
    if (!checked) return;
    if (isLast) {
      finishQuiz();
      return;
    }
    setIndex((i) => i + 1);
    setSelectedId(null);
    setChecked(false);
  }

  function finishQuiz() {
    // `answers` is already up to date here: handleNext (the only caller) is
    // only reachable once `checked` is true, which means handleCheck already
    // wrote this question's result into `answers` via setAnswers.
    const missed = questions.filter((q) => !answers[q.id]?.correct).map((q) => q.id);
    recordQuizAttempt(problemId, {
      score: Object.values(answers).filter((a) => a.correct).length,
      total: questions.length,
      missed,
    });
    setDone(true);
  }

  function handleRetry() {
    setIndex(0);
    setSelectedId(null);
    setChecked(false);
    setAnswers({});
    setDone(false);
    setExpandedReview(null);
  }

  // Keyboard support: 1-4 selects an option, Enter checks/advances.
  useEffect(() => {
    if (done) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key >= "1" && e.key <= "4") {
        const idx = parseInt(e.key, 10) - 1;
        const opt = question?.options[idx];
        if (opt) selectOption(opt.id);
      } else if (e.key === "Enter") {
        if (!checked) {
          if (selectedId) handleCheck();
        } else {
          handleNext();
        }
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentionally re-bind on the values the handler closes over
  }, [done, checked, selectedId, question]);

  if (done) {
    return (
      <div className="space-y-5">
        <div className="rounded-2xl border bg-muted/20 p-5 text-center">
          <BookOpenCheck className="mx-auto size-8 text-primary" />
          <p className="mt-2 text-sm text-muted-foreground">{t(L.yourScore, locale)}</p>
          <p className="mt-1 font-mono text-3xl font-bold text-primary">
            {score} / {questions.length}
          </p>
        </div>

        <div className="space-y-2">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {t(L.reviewTitle, locale)}
          </h4>
          <ul className="space-y-1.5">
            {questions.map((q) => {
              const answer = answers[q.id];
              const isOpen = expandedReview === q.id;
              return (
                <li key={q.id} className="rounded-xl border bg-card overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setExpandedReview(isOpen ? null : q.id)}
                    className="flex w-full items-start gap-2 px-3 py-2.5 text-left text-xs sm:text-sm hover:bg-muted/40 transition-colors"
                  >
                    {answer?.correct ? (
                      <CheckCircle2 className="size-4 text-primary shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="size-4 text-destructive shrink-0 mt-0.5" />
                    )}
                    <span className="flex-1 min-w-0">{t(q.prompt, locale)}</span>
                  </button>
                  {isOpen && (
                    <div className="border-t bg-muted/20 px-3 py-2.5 space-y-2 text-xs">
                      {q.options.map((opt) => (
                        <div
                          key={opt.id}
                          className={
                            opt.id === q.correctId
                              ? "rounded-lg border border-primary/40 bg-primary/5 p-2"
                              : opt.id === answer?.selectedId
                                ? "rounded-lg border border-destructive/30 bg-destructive/5 p-2"
                                : "rounded-lg border border-transparent p-2 opacity-60"
                          }
                        >
                          <p className="font-medium text-foreground">{t(opt.label, locale)}</p>
                          <p className="mt-0.5 text-muted-foreground">{t(opt.why, locale)}</p>
                        </div>
                      ))}
                      <p className="font-mono text-[10px] text-muted-foreground">
                        {t(L.source, locale)}: {q.sourceRef}
                      </p>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 pt-1">
          <Button variant="outline" onClick={handleRetry} className="rounded-full gap-1.5">
            <RotateCcw className="size-3.5" />
            {t(L.retry, locale)}
          </Button>
          {nextSlug && (
            <Button asChild className="rounded-full gap-1.5">
              <Link href={`/recommended/${nextSlug}/quiz`}>
                <span>
                  {t(L.nextProblem, locale)}
                  {nextName ? `: ${nextName}` : ""}
                </span>
                <ArrowRight className="size-3.5" />
              </Link>
            </Button>
          )}
        </div>
      </div>
    );
  }

  if (!question) return null;

  const progressPercent = ((index + (checked ? 1 : 0)) / questions.length) * 100;

  return (
    <div className="space-y-4">
      {/* Progress */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span className="font-mono">
          {t(L.questionOf, locale)} {index + 1} {t(L.of, locale)} {questions.length} · {problemName}
        </span>
        <Badge variant="outline" className="rounded-full font-mono text-[10px]">
          {t(KIND_LABEL[question.kind], locale)}
        </Badge>
      </div>
      <div className="h-1 w-full rounded-full bg-border overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Prompt */}
      <div className="space-y-3">
        <p className="text-sm font-medium text-foreground leading-relaxed">
          {t(question.prompt, locale)}
        </p>

        {question.stdin !== undefined && (
          <div className="rounded-xl border bg-muted/30 p-3">
            <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
              <Terminal className="size-3" />
              {t(L.stdinLabel, locale)}
            </p>
            <pre className="mt-1.5 whitespace-pre-wrap font-mono text-xs text-foreground">{question.stdin}</pre>
          </div>
        )}

        {question.snippet && (
          <pre className="overflow-x-auto rounded-xl border border-zinc-800 bg-[#090d13] p-3 font-mono text-xs text-zinc-200">
            {question.snippet}
          </pre>
        )}
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 gap-2">
        {question.options.map((opt, i) => {
          const isSelected = selectedId === opt.id;
          const isCorrectOption = opt.id === question.correctId;
          let stateClass =
            "border-border bg-background text-foreground hover:border-primary/50 hover:bg-muted/40";
          if (checked) {
            if (isCorrectOption) {
              stateClass = "border-primary bg-primary/10 text-foreground";
            } else if (isSelected) {
              stateClass = "border-destructive/50 bg-destructive/5 text-foreground";
            } else {
              stateClass = "border-border bg-background text-muted-foreground opacity-60";
            }
          } else if (isSelected) {
            stateClass = "border-primary bg-primary/10 text-foreground";
          }

          return (
            <div key={opt.id}>
              <button
                type="button"
                onClick={() => selectOption(opt.id)}
                disabled={checked}
                className={`flex w-full items-start gap-2.5 rounded-xl border px-3.5 py-2.5 text-left text-sm font-medium transition-colors ${stateClass}`}
              >
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full border border-current font-mono text-[11px]">
                  {i + 1}
                </span>
                <span className="flex-1 min-w-0">{t(opt.label, locale)}</span>
                {checked && isCorrectOption && (
                  <CheckCircle2 className="size-4 text-primary shrink-0" />
                )}
                {checked && !isCorrectOption && isSelected && (
                  <XCircle className="size-4 text-destructive shrink-0" />
                )}
              </button>
              {checked && (isSelected || isCorrectOption) && (
                <div className="mt-1.5 ml-2 rounded-lg border bg-muted/20 px-3 py-2 text-xs text-muted-foreground leading-relaxed">
                  <p>{t(opt.why, locale)}</p>
                  {isCorrectOption && (
                    <p className="mt-1 font-mono text-[10px] text-muted-foreground/80">
                      {t(L.source, locale)}: {question.sourceRef}
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between gap-2 pt-1">
        <p className="hidden sm:block text-[11px] text-muted-foreground">{t(L.keyHint, locale)}</p>
        {!checked ? (
          <Button
            onClick={handleCheck}
            disabled={!selectedId}
            className="ml-auto rounded-full"
          >
            {t(L.check, locale)}
          </Button>
        ) : (
          <Button onClick={handleNext} className="ml-auto rounded-full gap-1.5">
            <span>{isLast ? t(L.seeSummary, locale) : t(L.next, locale)}</span>
            <ArrowRight className="size-3.5" />
          </Button>
        )}
      </div>
    </div>
  );
}
