"use client";

import type { LText } from "@/lib/i18n";

export type QuizKind =
  | "mcq"
  | "predict-output"
  | "spot-the-bug"
  | "pep8"
  | "true-false"
  | "short-answer";

export interface QuizOption {
  id: string; // stable "a".."d", must survive option shuffling
  label: LText;
  why: LText; // explanation shown for the picked AND the correct option —
  // a wrong pick should still teach the misconception
}

export interface QuizQuestion {
  id: string; // e.g. "3167-q3" — stable, used as React key and in progress.missed[]
  kind: QuizKind;
  prompt: LText;
  snippet?: string; // <= 5 lines, never a full solution
  stdin?: string; // predict-output only: copied verbatim from problem.md §4 or §6
  options: QuizOption[]; // 4 for mcq, 2 for true-false, empty for short-answer
  correctId: string; // unused by short-answer, which is self-assessed
  sourceRef: string; // REQUIRED — e.g. "problem.md §5.2" or "main.py:7-14"
  chapter?: number; // optional syllabus grouping, e.g. 1..5 for EN-KMITL chapters
  /**
   * Question-level explanation as raw Markdown (tables, bold, lists).
   *
   * When set, the engine renders it once after the answer is checked and
   * skips the per-option `why` blocks — banks written this way carry their
   * teaching in one prose block rather than split across four options.
   * For "short-answer" this is the model answer.
   */
  explanationMd?: string;
}

export const QUIZ_PROGRESS_KEY = "ihelp-quiz-progress-v1";
export const QUIZ_PROGRESS_EVENT = "ihelp-quiz-progress-changed";

export interface QuizProblemProgress {
  best: number;
  total: number;
  attempts: number;
  lastAt: number;
  missed: string[]; // question ids missed on the MOST RECENT run
}

export type QuizProgress = Record<number, QuizProblemProgress>; // keyed by OJ id, e.g. 3167

export function loadQuizProgress(): QuizProgress {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(QUIZ_PROGRESS_KEY);
    if (!raw) return {};
    return JSON.parse(raw) ?? {};
  } catch {
    return {};
  }
}

export function recordQuizAttempt(
  problemId: number,
  result: { score: number; total: number; missed: string[] },
): void {
  if (typeof window === "undefined") return;
  const current = loadQuizProgress();
  const prior = current[problemId];
  const isBetterOrFirst = !prior || result.score >= prior.best;

  current[problemId] = {
    best: isBetterOrFirst ? result.score : prior.best,
    total: result.total,
    attempts: (prior?.attempts ?? 0) + 1,
    lastAt: Date.now(),
    missed: result.missed,
  };

  window.localStorage.setItem(QUIZ_PROGRESS_KEY, JSON.stringify(current));
  window.dispatchEvent(new Event(QUIZ_PROGRESS_EVENT));
}

// Self-assessment verdicts stored in place of an option id for "short-answer".
export const SELF_CORRECT = "self:correct";
export const SELF_WRONG = "self:wrong";

/**
 * "short-answer" questions are open essays with a model answer, not fill-ins —
 * no string comparison can grade them, so the student marks their own work and
 * we record that verdict. Every other kind compares against correctId.
 */
export function gradeAnswer(question: QuizQuestion, selectedId: string): boolean {
  if (question.kind === "short-answer") return selectedId === SELF_CORRECT;
  return selectedId === question.correctId;
}
