"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

/**
 * Which documents a reader has opened, per module.
 *
 * "Opened", not "read" and not "understood" — the browser knows the first and
 * cannot know the other two, and the index labels it that way. The repo's rule
 * that a wrong chapter number is worse than none applies to progress as well: a
 * tick that claims a session is done because the page was on screen for a
 * second would make the index lie about the only thing it is there to tell you.
 *
 * localStorage rather than the account: there is nothing here worth a round
 * trip, nothing worth keeping if the student clears their browser, and the
 * module routes are statically prerendered, so a server read would cost the
 * whole page its prerender to record which tab someone clicked.
 */

export const DOCS_OPENED_EVENT = "ihelp-docs-opened-changed";
const KEY = "ihelp-docs-opened";

/** Every opened document, as "<module>:<doc slug>" -> epoch milliseconds. */
type OpenedMap = Record<string, number>;

/**
 * The store is subscribed to as a raw string rather than as a parsed object.
 *
 * useSyncExternalStore compares snapshots with Object.is, so a getSnapshot that
 * parsed the JSON would hand back a new object every call and re-render for
 * ever. The string compares by value; the parse happens once, in a useMemo
 * downstream.
 */
function subscribe(onChange: () => void): () => void {
  window.addEventListener(DOCS_OPENED_EVENT, onChange);
  // Another tab on the same module should not keep showing stale ticks.
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(DOCS_OPENED_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

function snapshot(): string | null {
  try {
    return window.localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

/** The server has no store, so the prerendered HTML shows nothing opened. */
function serverSnapshot(): string | null {
  return null;
}

function parse(raw: string | null): OpenedMap {
  if (!raw) return {};
  try {
    return (JSON.parse(raw) as OpenedMap) ?? {};
  } catch {
    return {};
  }
}

function entryKey(moduleKey: string, slug: string): string {
  return `${moduleKey}:${slug}`;
}

/** The slugs of a module's documents that have been opened before. */
export function useOpenedDocs(moduleKey: string | undefined): {
  opened: ReadonlySet<string>;
  markOpened: (slug: string) => void;
} {
  const raw = useSyncExternalStore(subscribe, snapshot, serverSnapshot);

  const opened = useMemo(() => {
    if (!moduleKey) return new Set<string>();
    const prefix = `${moduleKey}:`;
    return new Set(
      Object.keys(parse(raw))
        .filter((key) => key.startsWith(prefix))
        .map((key) => key.slice(prefix.length)),
    );
  }, [raw, moduleKey]);

  const markOpened = useCallback(
    (slug: string) => {
      if (!moduleKey || typeof window === "undefined") return;
      const current = parse(snapshot());
      const key = entryKey(moduleKey, slug);
      // Re-opening a document is not news: writing anyway would fire the event
      // and re-render every subscriber on each tab click.
      if (current[key] !== undefined) return;
      current[key] = Date.now();
      try {
        window.localStorage.setItem(KEY, JSON.stringify(current));
      } catch {
        // A full or blocked store costs the tick, not the navigation.
        return;
      }
      window.dispatchEvent(new Event(DOCS_OPENED_EVENT));
    },
    [moduleKey],
  );

  return { opened, markOpened };
}
