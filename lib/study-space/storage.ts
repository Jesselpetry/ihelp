"use client";

import { useSyncExternalStore } from "react";
import { DEFAULT_SETTINGS } from "./presets";
import type { StudySessionLog, StudySettings, SubjectCode, UserProgressData } from "./types";

/**
 * Study progress in localStorage, one record per student:
 *
 *   ihelp_study_space_v1_student-<studentId>   — UserProgressData as JSON
 *
 * The student ID comes from the signed-in session (the study page passes it
 * down), so there is no profile picker any more. The key is the one the
 * first release used for its default profile, so time already logged there
 * carries over; that release stored the settings under `profile`, which is
 * read once and rewritten as `settings`.
 *
 * Reads go through a per-store cache so useSyncExternalStore gets a stable
 * snapshot; every write replaces the cache and notifies, and a `storage`
 * event from another tab drops it. Storage can be missing (private windows,
 * blocked site data), so every access is wrapped and the page keeps working
 * in memory.
 */

const KEY_PREFIX = "ihelp_study_space_v1_student-";
const MAX_LOGS = 500;

function emptyProgress(): UserProgressData {
  return { settings: DEFAULT_SETTINGS, completedTasks: {}, dailyStudyMinutes: {}, sessionLogs: [] };
}

function readRaw(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeRaw(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Storage full or blocked — the in-memory cache still holds the change.
  }
}

function parse(raw: string | null): UserProgressData {
  if (!raw) return emptyProgress();
  try {
    const parsed = JSON.parse(raw) as Partial<UserProgressData> & { profile?: Partial<StudySettings> };
    const s = { ...DEFAULT_SETTINGS, ...(parsed.settings ?? parsed.profile) };
    return {
      settings: {
        selectedPresetId: s.selectedPresetId,
        customPreset: {
          studyMinutes: Number(s.customPreset?.studyMinutes) || DEFAULT_SETTINGS.customPreset.studyMinutes,
          breakMinutes: Number(s.customPreset?.breakMinutes) || DEFAULT_SETTINGS.customPreset.breakMinutes,
        },
        soundEnabled: s.soundEnabled !== false,
        autoStartBreak: s.autoStartBreak === true,
        focusShowsList: s.focusShowsList !== false,
      },
      completedTasks: parsed.completedTasks ?? {},
      dailyStudyMinutes: parsed.dailyStudyMinutes ?? {},
      sessionLogs: parsed.sessionLogs ?? [],
    };
  } catch {
    return emptyProgress();
  }
}

function addMinutes(
  data: UserProgressData,
  date: string,
  subject: SubjectCode,
  minutes: number,
): UserProgressData["dailyStudyMinutes"] {
  const dayMap = { ...data.dailyStudyMinutes[date] };
  dayMap[subject] = Math.max(0, (dayMap[subject] ?? 0) + minutes);
  return { ...data.dailyStudyMinutes, [date]: dayMap };
}

const SERVER_SNAPSHOT = emptyProgress();

export interface StudyStore {
  subscribe(listener: () => void): () => void;
  getSnapshot(): UserProgressData;
  getServerSnapshot(): UserProgressData;
  /**
   * `id` makes the call idempotent: a log with that id already in storage —
   * written by this tab or another — turns the call into a no-op.
   */
  logSession(date: string, subject: SubjectCode, minutes: number, source: StudySessionLog["source"], id?: string): void;
  removeSession(id: string): void;
  toggleDone(key: string): void;
  updateSettings(patch: Partial<StudySettings>): void;
  resetProgress(): void;
}

function createStudyStore(studentId: string): StudyStore {
  const key = KEY_PREFIX + studentId;
  let cache: UserProgressData | null = null;
  const listeners = new Set<() => void>();

  const snapshot = () => (cache ??= parse(readRaw(key)));
  const commit = (next: UserProgressData) => {
    cache = next;
    writeRaw(key, JSON.stringify(next));
    listeners.forEach((l) => l());
  };

  return {
    subscribe(listener) {
      listeners.add(listener);
      const onStorage = (e: StorageEvent) => {
        if (e.key !== key) return;
        cache = null;
        listener();
      };
      window.addEventListener("storage", onStorage);
      return () => {
        listeners.delete(listener);
        window.removeEventListener("storage", onStorage);
      };
    },
    getSnapshot: snapshot,
    getServerSnapshot: () => SERVER_SNAPSHOT,

    logSession(date, subject, minutes, source, id) {
      // With an id, read storage itself rather than this tab's cache: the
      // other tab may have logged the same block a moment ago.
      const data = id ? parse(readRaw(key)) : snapshot();
      if (id && data.sessionLogs.some((l) => l.id === id)) {
        cache = data;
        listeners.forEach((l) => l());
        return;
      }
      const rounded = Math.round(minutes);
      if (rounded < 1) return;
      const log: StudySessionLog = {
        id: id ?? `log-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
        date,
        subjectCode: subject,
        durationMinutes: rounded,
        timestamp: Date.now(),
        source,
      };
      commit({
        ...data,
        sessionLogs: [log, ...data.sessionLogs].slice(0, MAX_LOGS),
        dailyStudyMinutes: addMinutes(data, date, subject, rounded),
      });
    },

    removeSession(id) {
      const data = snapshot();
      const log = data.sessionLogs.find((l) => l.id === id);
      if (!log) return;
      commit({
        ...data,
        sessionLogs: data.sessionLogs.filter((l) => l.id !== id),
        dailyStudyMinutes: addMinutes(data, log.date, log.subjectCode, -log.durationMinutes),
      });
    },

    toggleDone(taskKey) {
      const data = snapshot();
      commit({ ...data, completedTasks: { ...data.completedTasks, [taskKey]: !data.completedTasks[taskKey] } });
    },

    updateSettings(patch) {
      const data = snapshot();
      commit({ ...data, settings: { ...data.settings, ...patch } });
    },

    resetProgress() {
      commit({ ...emptyProgress(), settings: snapshot().settings });
    },
  };
}

const stores = new Map<string, StudyStore>();

/** One store per student, shared by every component on the page. */
export function studyStoreFor(studentId: string): StudyStore {
  let store = stores.get(studentId);
  if (!store) {
    store = createStudyStore(studentId);
    stores.set(studentId, store);
  }
  return store;
}

export function useStudyProgress(store: StudyStore): UserProgressData {
  return useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);
}
