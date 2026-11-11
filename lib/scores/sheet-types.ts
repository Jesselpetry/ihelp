import type {
  CourseScoreColumn,
  ScoreCellValue,
  ScoreUpdateEntry,
} from "@/lib/scores/types";

export type ScoreSubPartDef = {
  key: string;
  label: string;
  max?: number;
  note?: string;
};

/** One graded column of a course's score sheet. */
export type ScorePart = {
  key: string;
  label: string;
  max: number;
  group?: string;
  pending?: boolean;
  rawMax?: number;
  rawKey?: string;
  subParts?: ScoreSubPartDef[];
};

/** A part not graded yet, e.g. the final before it is marked. */
export type PendingPart = { key?: string; label: string; max: number };

/** Optional scaling rule that turns multiple sub-parts into one weighted category. */
export type QuizScaleConfig = {
  key: string;
  label: string;
  sourceKeys: string[];
  rawMax: number;
  scaledMax: number;
};

/** Server-only JSON score sheet stored locally or in the private `ihelp-scores` bucket. */
export type ScoreSheet = {
  courseCode: string;
  title: string;
  aliases: string[];
  hub?: boolean;
  source: string;
  importedAt: string;
  updates?: ScoreUpdateEntry[];
  notes?: string[];
  fullMax?: number;
  quizScale?: QuizScaleConfig;
  parts: ScorePart[];
  pending: PendingPart[];
  columns?: CourseScoreColumn[];
  studentNames?: Record<string, string>;
  studentSections?: Record<string, string>;
  studentStatuses?: Record<string, "ลาออก" | "ขาดสอบ">;
  subScores?: Record<string, Record<string, ScoreCellValue>>;
  rawTotals?: Record<string, Record<string, number>>;
  extraCells?: Record<string, Record<string, ScoreCellValue>>;
  /** student id -> part key -> value */
  scores: Record<string, Record<string, ScoreCellValue>>;
};

export interface ScoreManifestEntry {
  file: string;
  courseCode: string;
  title: string;
  aliases: string[];
  hub: boolean;
  importedAt?: string;
}

export interface ScoreManifest {
  version: 1;
  updatedAt: string;
  hasNames: boolean;
  sheets: ScoreManifestEntry[];
}

