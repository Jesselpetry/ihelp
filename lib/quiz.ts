"use client";

import type { LText } from "@/lib/i18n";

export type QuizKind = "mcq" | "predict-output" | "spot-the-bug" | "pep8";

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
  options: QuizOption[]; // exactly 4
  correctId: string;
  sourceRef: string; // REQUIRED — e.g. "problem.md §5.2" or "main.py:7-14"
  chapter?: number; // optional syllabus grouping, e.g. 1..5 for EN-KMITL chapters
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

export function gradeAnswer(question: QuizQuestion, selectedId: string): boolean {
  return selectedId === question.correctId;
}
