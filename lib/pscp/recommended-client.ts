"use client";

export const RECOMMENDED_STATUS_EVENT = "ihelp-recommended-status-changed";
export const RECOMMENDED_STATUS_KEY = "ihelp-recommended-status";

export function getStoredProblemStatuses(): Record<number, "passed" | "in_progress"> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(RECOMMENDED_STATUS_KEY);
    if (!raw) return {};
    return JSON.parse(raw) ?? {};
  } catch {
    return {};
  }
}

export function setStoredProblemStatus(id: number, status: "passed" | "in_progress"): void {
  if (typeof window === "undefined") return;
  const current = getStoredProblemStatuses();
  current[id] = status;
  window.localStorage.setItem(RECOMMENDED_STATUS_KEY, JSON.stringify(current));
  window.dispatchEvent(new Event(RECOMMENDED_STATUS_EVENT));
}
