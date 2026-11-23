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
