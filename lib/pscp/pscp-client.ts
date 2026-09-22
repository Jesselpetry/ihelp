"use client";

// Per-problem progress for /pscp, persisted locally. The grader's code drafts
// are handled separately by `useDraft` (key: ihelp-grader-draft-v1-<id>); this
// module only tracks the outcome of a run and the student's own solved mark.

export const PSCP_PROGRESS_EVENT = "ihelp-pscp-progress-changed";
export const PSCP_PROGRESS_KEY = "ihelp-pscp-progress-v1";

export interface PscpAttempt {
  /** Cases passed on the best run so far. */
  passed: number;
  /** Cases in the suite at the time of that run. */
  total: number;
  /** Set once every case passed, or when the student marks it by hand. */
  solved: boolean;
  /** Epoch ms of the most recent run. */
  ranAt?: number;
}

export type PscpProgress = Record<number, PscpAttempt>;

export function loadPscpProgress(): PscpProgress {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(PSCP_PROGRESS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? (parsed as PscpProgress) : {};
  } catch {
    return {};
  }
}

function persist(next: PscpProgress): void {
  try {
    window.localStorage.setItem(PSCP_PROGRESS_KEY, JSON.stringify(next));
  } catch {
    // Quota or private-mode failure: progress is a convenience, never block on it.
  }
  window.dispatchEvent(new Event(PSCP_PROGRESS_EVENT));
}

/**
 * Records a grader run. Keeps the best `passed` seen so far rather than the
 * latest, so experimenting after a green run cannot walk the progress back.
 */
export function recordPscpRun(id: number, passed: number, total: number): void {
  if (typeof window === "undefined") return;
  const all = loadPscpProgress();
  const prev = all[id];
  const bestPassed = Math.max(passed, prev?.passed ?? 0);
  all[id] = {
    passed: bestPassed,
    total,
    solved: (total > 0 && bestPassed === total) || Boolean(prev?.solved),
    ranAt: Date.now(),
  };
  persist(all);
}

/** Explicit student-set solved flag, independent of any grader run. */
export function setPscpSolved(id: number, solved: boolean): void {
  if (typeof window === "undefined") return;
  const all = loadPscpProgress();
  const prev = all[id] ?? { passed: 0, total: 0, solved: false };
  all[id] = { ...prev, solved };
  persist(all);
}
