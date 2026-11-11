"use client";

import { useSyncExternalStore } from "react";
import type { Y1S1CourseCode } from "./y1s1-courses";

const STORAGE_KEY = "ihelp_manual_scores_v1";

export type PscpFinalInputMode = "problems" | "score";

export interface ManualScoresState {
  inputs: Partial<Record<Y1S1CourseCode, Record<string, string>>>;
  customWeights: Partial<Record<Y1S1CourseCode, Record<string, string>>>;
  pscpFinalMode: PscpFinalInputMode;
}

export const EMPTY_MANUAL_SCORES: ManualScoresState = {
  inputs: {},
  customWeights: {},
  pscpFinalMode: "problems",
};

let cachedRaw: string | null = null;
let cachedParsed: ManualScoresState = EMPTY_MANUAL_SCORES;
const listeners = new Set<() => void>();

function sanitizeRecordMap(
  raw: unknown,
): Partial<Record<Y1S1CourseCode, Record<string, string>>> {
  if (!raw || typeof raw !== "object") return {};
  const result: Partial<Record<Y1S1CourseCode, Record<string, string>>> = {};
  for (const [courseKey, entries] of Object.entries(raw)) {
    if (!entries || typeof entries !== "object") continue;
    const cleanEntries: Record<string, string> = {};
    for (const [fieldKey, val] of Object.entries(entries)) {
      if (typeof val === "string") {
        cleanEntries[fieldKey] = val;
      }
    }
    if (Object.keys(cleanEntries).length > 0) {
      result[courseKey as Y1S1CourseCode] = cleanEntries;
    }
  }
  return result;
}

export function readManualScoresStore(): ManualScoresState {
  if (typeof window === "undefined") return EMPTY_MANUAL_SCORES;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === cachedRaw) return cachedParsed;
    cachedRaw = raw;
    if (!raw) {
      cachedParsed = EMPTY_MANUAL_SCORES;
      return cachedParsed;
    }
    const parsed = JSON.parse(raw) as Partial<ManualScoresState>;
    cachedParsed = {
      inputs: sanitizeRecordMap(parsed?.inputs),
      customWeights: sanitizeRecordMap(parsed?.customWeights),
      pscpFinalMode: parsed?.pscpFinalMode === "score" ? "score" : "problems",
    };
    return cachedParsed;
  } catch {
    return EMPTY_MANUAL_SCORES;
  }
}

function writeManualScoresStore(next: ManualScoresState) {
  if (typeof window === "undefined") return;
  try {
    const raw = JSON.stringify(next);
    cachedRaw = raw;
    cachedParsed = next;
    window.localStorage.setItem(STORAGE_KEY, raw);
  } catch {
    // Ignore storage quota or private browsing errors
  }
  for (const listener of listeners) {
    listener();
  }
}

function subscribeManualScoresStore(callback: () => void) {
  listeners.add(callback);
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) callback();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", onStorage);
  };
}

export function useManualScoresStore(): ManualScoresState {
  return useSyncExternalStore(
    subscribeManualScoresStore,
    readManualScoresStore,
    () => EMPTY_MANUAL_SCORES,
  );
}

export function setManualInputValue(
  courseCode: Y1S1CourseCode,
  inputId: string,
  value: string,
) {
  const current = readManualScoresStore();
  const prevCourse = { ...(current.inputs[courseCode] ?? {}) };
  if (value === "") {
    delete prevCourse[inputId];
  } else {
    prevCourse[inputId] = value;
  }
  const nextInputs = { ...current.inputs };
  if (Object.keys(prevCourse).length === 0) {
    delete nextInputs[courseCode];
  } else {
    nextInputs[courseCode] = prevCourse;
  }
  writeManualScoresStore({ ...current, inputs: nextInputs });
}

export function setCustomWeightValue(
  courseCode: Y1S1CourseCode,
  inputId: string,
  value: string,
) {
  const current = readManualScoresStore();
  const prevCourse = { ...(current.customWeights[courseCode] ?? {}) };
  if (value.trim() === "") {
    delete prevCourse[inputId];
  } else {
    prevCourse[inputId] = value;
  }
  const nextWeights = { ...current.customWeights };
  if (Object.keys(prevCourse).length === 0) {
    delete nextWeights[courseCode];
  } else {
    nextWeights[courseCode] = prevCourse;
  }
  writeManualScoresStore({ ...current, customWeights: nextWeights });
}

export function setPscpFinalMode(mode: PscpFinalInputMode) {
  const current = readManualScoresStore();
  if (current.pscpFinalMode === mode) return;
  writeManualScoresStore({ ...current, pscpFinalMode: mode });
}

export function resetCourseManualScores(courseCode: Y1S1CourseCode) {
  const current = readManualScoresStore();
  const nextInputs = { ...current.inputs };
  const nextWeights = { ...current.customWeights };
  delete nextInputs[courseCode];
  delete nextWeights[courseCode];
  writeManualScoresStore({
    ...current,
    inputs: nextInputs,
    customWeights: nextWeights,
  });
}

export function resetAllManualScores() {
  writeManualScoresStore(EMPTY_MANUAL_SCORES);
}

export function hasCourseManualEntries(
  state: ManualScoresState,
  courseCode: Y1S1CourseCode,
): boolean {
  const hasInput = Object.values(state.inputs[courseCode] ?? {}).some(
    (v) => v.trim() !== "",
  );
  const hasWeight = Object.values(state.customWeights[courseCode] ?? {}).some(
    (v) => v.trim() !== "",
  );
  return hasInput || hasWeight;
}

