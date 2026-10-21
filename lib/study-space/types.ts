import type { LText } from "@/lib/ltext";

/**
 * Types for the study space (/profile/<id>/study).
 *
 * Shared, public data — the courses, their final-scope weeks, the links — is
 * client-safe and lives in subjects.ts, units.ts and links.ts. A StudyPlan is
 * someone's personal schedule: it is declared under plans/ (server-only) and
 * reaches the browser only as a prop, after the page has checked that the
 * signed-in student owns it.
 */

export type SubjectCode = "ITF" | "ICS" | "PSCP" | "MFIT";

export interface SubjectExam {
  /** Start of the paper, Asia/Bangkok, ISO 8601 with offset. */
  startsAt: string;
  /** "13:30–16:30" — the window as printed by the registrar. */
  time: string;
  date: LText;
  /**
   * The registrar has not published final-exam rooms yet (21 Oct 2026). Stays
   * null until it does — a guessed room is worse than none.
   */
  room: string | null;
}

export interface SubjectMeta {
  code: SubjectCode;
  officialCode: string;
  /** Folder under content/courses/ and the /courses/<dir> segment. */
  dir: string;
  name: LText;
  shortName: string;
  /** Tailwind classes — literal strings so the scanner keeps them. */
  accent: { dot: string; bar: string; text: string; soft: string };
  exam: SubjectExam;
}

/** What a link opens, which decides its icon and wording. */
export type ResourceKind =
  | "week" // a weekly page inside the course hub
  | "summary" // a summary or study-guide document
  | "quiz" // a question bank or self-check
  | "mock" // a mock paper
  | "problems" // the PSCP iJudge bank, or one problem
  | "library" // the course's file library (sign-in)
  | "overview" // course overview and exam scope
  | "exam"; // the exam schedule page

export interface StudyResource {
  kind: ResourceKind;
  label: LText;
  href: string;
}

/**
 * One final-scope week of one course. `id` doubles as the checklist key in
 * storage (`<CODE>-week-<n>`), so it must never be renamed.
 */
export interface StudyUnit {
  id: string;
  subject: SubjectCode;
  week: number;
  /** "สัปดาห์ที่ 8", "คาบที่ 1" — how the course itself numbers it. */
  label: LText;
  topic: LText;
  resources: StudyResource[];
}

export interface StudyTask {
  /** `<date>-<code>` — also the checklist key in storage. */
  id: string;
  subject: SubjectCode;
  hours: number;
  title: LText;
  /** Units this block covers; their resources are listed first. */
  units: string[];
  /** Thai with English terms, like the course content it summarises. */
  keyPoints: string[];
  /** Links beyond the units' own — mocks, reviews, problem sets. */
  extras?: StudyResource[];
}

export interface DailyPlan {
  /** "2026-10-21" */
  date: string;
  tasks: StudyTask[];
  /** Set on the day a paper is sat. */
  exam?: SubjectCode;
}

/** A personal schedule. Plain data — it crosses the server/client boundary as a prop. */
export interface StudyPlan {
  id: string;
  title: LText;
  /** Days in date order, one entry per calendar day. */
  days: DailyPlan[];
}

/** What the profile card shows — computed on the server from a StudyPlan. */
export interface StudyPlanSummary {
  /** Bangkok date the server rendered for. */
  today: string;
  /** Today's blocks; empty outside the plan's dates. */
  tasks: { subject: SubjectCode; hours: number; title: LText }[];
}

export interface TimerPreset {
  id: string;
  label: LText;
  studyMinutes: number;
  breakMinutes: number;
}

/** Per-student timer preferences, kept with their progress. */
export interface StudySettings {
  selectedPresetId: string;
  customPreset: { studyMinutes: number; breakMinutes: number };
  soundEnabled: boolean;
  /** Roll into the next phase without stopping at each boundary. */
  autoStartBreak: boolean;
  /** Focus mode shows today's list beside the timer (else the timer alone). */
  focusShowsList: boolean;
}

export interface StudySessionLog {
  id: string;
  date: string;
  subjectCode: SubjectCode;
  durationMinutes: number;
  timestamp: number;
  /** "timer" when the clock logged it, "manual" when typed in. */
  source?: "timer" | "manual";
}

export interface UserProgressData {
  settings: StudySettings;
  /** taskId or unitId -> done */
  completedTasks: Record<string, boolean>;
  /** date -> subject -> minutes */
  dailyStudyMinutes: Record<string, Partial<Record<SubjectCode, number>>>;
  sessionLogs: StudySessionLog[];
}
