"use client";

import { useEffect, useRef, useState } from "react";
import type { SubjectCode } from "@/lib/study-space/types";
import { chime } from "./audio-chime";

/**
 * The focus/break clock.
 *
 * Time is kept as an end timestamp, not by counting ticks: a background tab
 * throttles setInterval to once a minute or less, and a counter would drift
 * by however long the tab slept. The interval only repaints.
 *
 * The clock is one record in localStorage, shared by every tab of the page:
 * a write in one tab reaches the others through the `storage` event, so
 * pausing in one pauses all. Each block has an id and is logged under it
 * (`timer-<id>`), and the store drops a second log with the same id — two
 * tabs reaching the end together still log the block once.
 *
 * A focus block that ran out while every tab was closed is still logged,
 * unless it ended more than STALE_MS ago — by then the clock was forgotten,
 * not studied to. The next phase starts on its own (auto-advance) only if a
 * tab was open when the boundary passed; a break that ended an hour ago
 * does not start a focus block the moment the page reopens.
 *
 * Completion is handled in the interval callback, never inside a state
 * updater: updaters run twice under Strict Mode, and the first release
 * logged its sessions from one.
 */

export type TimerMode = "focus" | "break";

interface Session {
  id: string;
  mode: TimerMode;
  running: boolean;
  /** Set while running. */
  endsAt: number | null;
  /** Authoritative while paused. */
  remainingMs: number;
  totalMs: number;
  /** Locked for a focus block — browsing to another day mid-block doesn't move it. */
  subject: SubjectCode;
  date: string;
}

interface TimerRecord {
  session: Session | null;
  /** The phase the next Start begins. */
  idleMode: TimerMode;
}

/** Suffixed with the student ID, like the progress record. */
const STORAGE_PREFIX = "ihelp_study_space_timer_v1_";
/** The pre-release build kept one unsuffixed bare session here. */
const LEGACY_KEY = "ihelp_study_space_timer_v1";
const STALE_MS = 12 * 60 * 60 * 1000;
/** A boundary passed less than this long ago was seen by an open tab. */
const PROMPT_MS = 60_000;
const TICK_MS = 250;

const newId = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

function parseRecord(raw: string | null): TimerRecord | null {
  if (!raw) return null;
  try {
    const value = JSON.parse(raw) as Partial<TimerRecord> & Partial<Session>;
    // Pre-release: a bare Session without an id.
    const session = ("session" in value ? value.session : (value as Session)) ?? null;
    const valid =
      session && (session.mode === "focus" || session.mode === "break") && session.totalMs > 0 ? session : null;
    const idleMode = value.idleMode === "break" || value.idleMode === "focus" ? value.idleMode : (valid?.mode ?? "focus");
    return { session: valid && { ...valid, id: valid.id ?? `legacy-${valid.endsAt ?? valid.remainingMs}` }, idleMode };
  } catch {
    return null;
  }
}

function loadRecord(key: string): TimerRecord {
  try {
    return (
      parseRecord(window.localStorage.getItem(key)) ??
      parseRecord(window.localStorage.getItem(LEGACY_KEY)) ?? { session: null, idleMode: "focus" }
    );
  } catch {
    return { session: null, idleMode: "focus" };
  }
}

function saveRecord(key: string, record: TimerRecord): void {
  try {
    // Writing an unchanged value fires no `storage` event, so tabs that just
    // received this record from each other do not echo it back and forth.
    window.localStorage.setItem(key, JSON.stringify(record));
    window.localStorage.removeItem(LEGACY_KEY);
  } catch {
    // Private mode: the clock still runs, it just won't survive a reload.
  }
}

export interface StudyTimerOptions {
  /** Whose clock this is — one saved record per student. */
  studentId: string;
  studyMinutes: number;
  breakMinutes: number;
  /** Roll straight into the next phase instead of stopping at each boundary. */
  autoAdvance: boolean;
  sound: boolean;
  /** What the next focus block is credited to. */
  subject: SubjectCode;
  date: string;
  /** `logId` is stable per block; logging the same id twice must be a no-op. */
  onFocusLogged: (subject: SubjectCode, date: string, minutes: number, logId: string) => void;
}

export function useStudyTimer(opts: StudyTimerOptions) {
  const storageKey = STORAGE_PREFIX + opts.studentId;
  const [record, setRecord] = useState<TimerRecord>(() => loadRecord(storageKey));
  const [now, setNow] = useState(() => Date.now());
  const { session, idleMode } = record;

  // The interval reads the latest options without re-subscribing every render.
  const optsRef = useRef(opts);
  useEffect(() => {
    optsRef.current = opts;
  });
  const handled = useRef<string | null>(null);

  const minutesFor = (mode: TimerMode) => (mode === "focus" ? opts.studyMinutes : opts.breakMinutes) * 60_000;

  useEffect(() => saveRecord(storageKey, record), [storageKey, record]);

  // Another tab started, paused, reset or finished the clock.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== storageKey) return;
      const next = parseRecord(e.newValue);
      if (next) setRecord(next);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [storageKey]);

  useEffect(() => {
    if (!session?.running || session.endsAt === null) return;
    const finished = session;
    const endsAt = session.endsAt;

    const tick = () => {
      const t = Date.now();
      setNow(t);
      if (t < endsAt || handled.current === finished.id) return;
      handled.current = finished.id;

      const o = optsRef.current;
      const overdue = t - endsAt;

      if (finished.mode === "focus") {
        if (overdue < STALE_MS) {
          o.onFocusLogged(finished.subject, finished.date, finished.totalMs / 60_000, `timer-${finished.id}`);
        }
        if (o.sound) chime.playBreak();
      } else if (o.sound) {
        chime.playStart();
      }

      const next: TimerMode = finished.mode === "focus" ? "break" : "focus";
      if (!o.autoAdvance || overdue >= PROMPT_MS) {
        setRecord({ session: null, idleMode: next });
        return;
      }
      // Chained from the boundary, not from `t`, so every open tab computes
      // the same next block — same id, same end — and agrees without a vote.
      const nextTotal = (next === "focus" ? o.studyMinutes : o.breakMinutes) * 60_000;
      const nextEnds = endsAt + nextTotal;
      setRecord({
        idleMode: next,
        session: {
          id: `auto-${nextEnds.toString(36)}`,
          mode: next,
          running: true,
          endsAt: nextEnds,
          remainingMs: nextTotal,
          totalMs: nextTotal,
          // A new focus block follows the current selection, not the last one.
          subject: next === "focus" ? o.subject : finished.subject,
          date: next === "focus" ? o.date : finished.date,
        },
      });
    };

    // First tick on the next task: catches a block that expired while closed.
    const first = window.setTimeout(tick, 0);
    const id = window.setInterval(tick, TICK_MS);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(id);
    };
  }, [session]);

  // ── derived ──────────────────────────────────────────────────────────────
  const mode = session?.mode ?? idleMode;
  const totalMs = session?.totalMs ?? minutesFor(idleMode);
  const remainingMs = session
    ? session.running && session.endsAt !== null
      ? Math.max(0, session.endsAt - now)
      : session.remainingMs
    : totalMs;
  const running = !!session?.running;
  const elapsedFocusMs = mode === "focus" ? totalMs - remainingMs : 0;
  /** Course and day are fixed only while a focus block is under way. */
  const focusLocked = session?.mode === "focus";

  // ── tab title ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!running) return;
    const original = document.title;
    const s = Math.ceil(remainingMs / 1000);
    const clock = `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
    document.title = `${clock} · ${mode === "focus" ? "Focus" : "Break"}`;
    return () => {
      document.title = original;
    };
  }, [running, remainingMs, mode]);

  // ── controls ─────────────────────────────────────────────────────────────
  function start() {
    const t = Date.now();
    setNow(t);
    if (opts.sound) chime.playStart();
    if (session) {
      setRecord({ idleMode, session: { ...session, running: true, endsAt: t + session.remainingMs } });
      return;
    }
    const total = minutesFor(idleMode);
    setRecord({
      idleMode,
      session: {
        id: newId(),
        mode: idleMode,
        running: true,
        endsAt: t + total,
        remainingMs: total,
        totalMs: total,
        subject: opts.subject,
        date: opts.date,
      },
    });
  }

  function pause() {
    if (!session?.running || session.endsAt === null) return;
    setRecord({
      idleMode,
      session: { ...session, running: false, endsAt: null, remainingMs: Math.max(0, session.endsAt - Date.now()) },
    });
  }

  function reset() {
    setRecord({ idleMode: mode, session: null });
  }

  /** Only while idle — switching mid-block would silently drop the time. */
  function switchMode(next: TimerMode) {
    if (session) return;
    setRecord({ idleMode: next, session: null });
  }

  /** Log the focus time so far (whole minutes, at least one) and stop. */
  function finishEarly() {
    if (!session || session.mode !== "focus") return;
    const minutes = Math.floor(elapsedFocusMs / 60_000);
    if (minutes >= 1) {
      opts.onFocusLogged(session.subject, session.date, minutes, `timer-${session.id}`);
      if (opts.sound) chime.playComplete();
    }
    setRecord({ idleMode: "break", session: null });
  }

  return {
    mode,
    running,
    /** A block has been started and not finished or reset. */
    inProgress: !!session,
    focusLocked,
    remainingMs,
    totalMs,
    elapsedFocusMs,
    subject: focusLocked ? session.subject : opts.subject,
    date: focusLocked ? session.date : opts.date,
    start,
    pause,
    reset,
    switchMode,
    finishEarly,
  };
}

export type StudyTimer = ReturnType<typeof useStudyTimer>;
