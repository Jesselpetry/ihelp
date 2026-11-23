export type DayOfWeek = "จันทร์" | "อังคาร" | "พุธ" | "พฤหัสบดี" | "ศุกร์";

export type SectionType = "ทฤษฎี" | "ปฏิบัติ";

export interface TimeSlot {
  day: DayOfWeek;
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
  timeStr: string;
  room: string;
  building: string;
}

export interface SectionEntry {
  section: number;
  type: SectionType;
  timeSlot: TimeSlot;
  instructors: string[];
  condition: string;
  seats: {
    total: number;
    used: number;
    remain: number;
  };
}

export interface ExamInfo {
  date: string;
  time: string;
  isSelfArranged?: boolean;
}

export interface TimetableCourse {
  code: string;
  abbr?: string;
  nameTh: string;
  nameEn: string;
  credits: string;
  creditHours: number;
  category: "วิชาบังคับ" | "วิชาเลือก / GenEd";
  hasLab: boolean;
  midterm: ExamInfo;
  final: ExamInfo;
  sections: SectionEntry[];
}

export interface UserScheduleSelection {
  /** Course code -> selected theory section */
  theory: Record<string, number>;
  /** Course code -> selected lab section (for courses with lab) */
  lab: Record<string, number>;
}

export interface ScheduleConflict {
  type: "class_overlap" | "exam_overlap";
  courseCodeA: string;
  courseCodeB: string;
  courseNameA: string;
  courseNameB: string;
  details: string;
}

export interface ScheduleStats {
  totalCredits: number;
  morningDays: number; // starts at 09:00
  lateDays: number; // starts at 11:00
  afternoonDays: number; // starts at 13:00+
  afternoonOffDays: number; // days where afternoon is free
  dailyEarliest: Record<DayOfWeek, string | null>;
}

export interface SchedulePreset {
  id: string;
  name: string;
  badge: string;
  description: string;
  recommended?: boolean;
  selections: UserScheduleSelection;
}

export interface StudentScheduleGroupInfo {
  group: 1 | 2 | 3;
  name: string;
  presetId: "group-1" | "group-2" | "group-3";
}

/**
 * Metadata defining an academic term/semester.
 * Enables dynamic white-label switching between semesters (e.g. 2569-2, 2570-1)
 * and seamless handoff to future academic batches.
 */
export interface SemesterTermInfo {
  id: string; // e.g. "2569-2"
  academicYear: string; // e.g. "2569"
  semester: number; // e.g. 2
  yearLevel: number; // e.g. 1
  faculty: string; // e.g. "เทคโนโลยีสารสนเทศ"
  department: string; // e.g. "เทคโนโลยีสารสนเทศ"
  labelTh: string; // e.g. "ภาคเรียนที่ 2 / 2569"
  labelEn: string; // e.g. "Semester 2 / 2026"
  subtitleTh: string; // e.g. "ระดับปริญญาตรี ชั้นปีที่ 1"
  subtitleEn: string; // e.g. "Undergraduate Year 1"
  startDateTh: string; // e.g. "8 ธันวาคม 2569"
  endDateTh: string; // e.g. "26 มีนาคม 2570"
  startIsoDate: string; // e.g. "2026-12-08"
  endIsoDate: string; // e.g. "2027-03-26"
  isActive: boolean;
}

/**
 * Complete bundle of schedule data for a single academic term.
 */
export interface TermScheduleData {
  termInfo: SemesterTermInfo;
  courses: TimetableCourse[];
  presets: SchedulePreset[];
  defaultSelections: UserScheduleSelection;
  getStudentGroup?: (studentId: string | null | undefined) => StudentScheduleGroupInfo | null;
}

