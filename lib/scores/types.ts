import type { LText } from "@/lib/i18n";

export type ScoreStatus =
  | "N/A"
  | "ลาออก"
  | "ขาดสอบ"
  | "ขาด"
  | "ไม่ส่ง"
  | "มา"
  | "ส่ง"
  | "pending";
export type ScoreCellValue = number | ScoreStatus | null;

export interface ScoreSubPart {
  key: string;
  label: string;
  max?: number;
  value: ScoreCellValue;
  note?: string;
}

export interface ScoreCategoryItem {
  key: string;
  label: LText | string;
  max: number;
  /** Numeric score earned, a special status, or null when pending announcement. */
  score: ScoreCellValue;
  pending?: boolean;
  /** Present when multiple sub-parts (e.g. ch01..ch07) are scaled into one category weight. */
  rawSummary?: {
    earned: number;
    max: number;
  };
  subParts?: ScoreSubPart[];
}

export interface ScoreUpdateEntry {
  date: string;
  note: string;
}

export interface CourseScoreColumn {
  key: string;
  label: string;
  max?: number;
  pending?: boolean;
  /** Whether this column should render right-aligned tabular numbers and sort numerically. */
  numeric?: boolean;
}

export interface CourseScoreAllRow {
  studentId: string;
  fullName?: string | null;
  nickname?: string | null;
  section?: string | null;
  status?: "ลาออก" | "ขาดสอบ" | null;
  cells: Record<string, ScoreCellValue>;
  /** Graded total out of `gradedMax`. */
  total: number;
}

export interface CourseScoreSummary {
  total: number;
  gradedMax: number;
  fullMax: number;
  status?: "ลาออก" | "ขาดสอบ" | null;
}

export interface CourseScoreViewResponse {
  courseCode: string;
  title: string;
  viewerId: string;
  viewerFullName?: string | null;
  viewerNickname?: string | null;
  viewerSection?: string | null;
  lastUpdated: string;
  updates: ScoreUpdateEntry[];
  notes: string[];
  totalStudents: number;
  enrolled: boolean;
  mySummary: CourseScoreSummary | null;
  categories: ScoreCategoryItem[];
  columns: CourseScoreColumn[];
  allRows?: CourseScoreAllRow[];
}

export interface GradesOverviewResponse {
  viewerId: string;
  viewerFullName?: string | null;
  viewerNickname?: string | null;
  courses: CourseScoreViewResponse[];
}

