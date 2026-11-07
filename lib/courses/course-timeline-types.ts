import type { LText } from "@/lib/i18n";
import type { AssetScope } from "@/lib/library/subject-library-ui";

export interface CourseWeekCardData {
  id: string;
  weekNumber: number;
  label: LText;
  title: LText;
  description?: LText;
  scope: "midterm" | "final" | "all";
  docSlug?: string;
  readerHref?: string;
  slidesCount: number;
  handoutsCount: number;
  totalFiles: number;
  quizCount: number;
  videoUrl?: string;
  hasDoc: boolean;
}

export interface CourseMilestoneCardAction {
  title: LText;
  subtitle: LText;
  href: string;
  badge?: LText;
  questionCount?: number;
  isAvailable: boolean;
}

export interface CourseExamMilestoneData {
  scope: AssetScope;
  title: LText;
  subtitle: LText;
  studyGuide?: CourseMilestoneCardAction;
  mockExam?: CourseMilestoneCardAction;
}

export interface CourseFoundationsStats {
  totalFiles: number;
  pdfs: number;
  images: number;
  docs: number;
}

export interface CourseFoundationsData {
  summaryMarkdown: string | null;
  officialUrl?: string;
  resourceStats: CourseFoundationsStats;
  libraryHref: string;
}

export interface CourseTimelineData {
  weeks: CourseWeekCardData[];
  midtermMilestone?: CourseExamMilestoneData;
  finalMilestone?: CourseExamMilestoneData;
}

