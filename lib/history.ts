"use client";

// Local generation history: every successfully generated file is kept in
// localStorage so students can revisit and re-download past outputs.

export type HistoryKind = "submission" | "reflection";

export interface HistoryEntry {
  id: string;
  kind: HistoryKind;
  problemId: string;
  ojTitle: string;
  fileLocale: "th" | "en";
  fileName: string;
  markdown: string;
  createdAt: number;
}

const KEY = "ihelp-history";
// Full markdown per entry: cap the list well under the localStorage quota.
const MAX_ENTRIES = 100;

export function loadHistory(): HistoryEntry[] {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (e): e is HistoryEntry =>
        e && typeof e.id === "string" && typeof e.markdown === "string",
    );
  } catch {
    // corrupted history: ignore
    return [];
  }
}

// Fired on every history change so live UI (navbar counter) can refresh.
export const HISTORY_EVENT = "ihelp-history-changed";

function notify() {
  window.dispatchEvent(new Event(HISTORY_EVENT));
}

function persist(entries: HistoryEntry[]) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(entries));
  } catch {
    // quota exceeded: retry with the newest half only
    try {
      window.localStorage.setItem(
        KEY,
        JSON.stringify(entries.slice(0, Math.ceil(entries.length / 2))),
      );
    } catch {
      // still failing: give up silently, generation itself must not break
    }
  }
  notify();
}

export function addHistoryEntry(
  entry: Omit<HistoryEntry, "id" | "createdAt">,
): void {
  const entries = loadHistory();
  // Repeat preview/download of the same content only refreshes the timestamp.
  const dup = entries.find(
    (e) =>
      e.kind === entry.kind &&
      e.problemId === entry.problemId &&
      e.markdown === entry.markdown,
  );
  if (dup) {
    dup.createdAt = Date.now();
    entries.sort((a, b) => b.createdAt - a.createdAt);
    persist(entries);
    return;
  }
  entries.unshift({
    ...entry,
    id: crypto.randomUUID(),
    createdAt: Date.now(),
  });
  persist(entries.slice(0, MAX_ENTRIES));
}

export function deleteHistoryEntry(id: string): void {
  persist(loadHistory().filter((e) => e.id !== id));
}

export function clearHistory(): void {
  window.localStorage.removeItem(KEY);
  notify();
}
