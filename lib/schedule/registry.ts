import type { SemesterTermInfo, TermScheduleData } from "./types";
import {
  DEFAULT_SCHEDULE_SELECTIONS,
  getStudentScheduleGroup,
  SCHEDULE_PRESETS,
  Y1S2_COURSES,
} from "./y1s2-data";

export const Y1S2_TERM_INFO: SemesterTermInfo = {
  id: "2569-2",
  academicYear: "2569",
  semester: 2,
  yearLevel: 1,
  faculty: "เทคโนโลยีสารสนเทศ",
  department: "เทคโนโลยีสารสนเทศ",
  labelTh: "ภาคเรียนที่ 2 / 2569",
  labelEn: "Semester 2 / 2026",
  subtitleTh: "ระดับปริญญาตรี ชั้นปีที่ 1",
  subtitleEn: "Undergraduate Year 1",
  startDateTh: "8 ธันวาคม 2569",
  endDateTh: "26 มีนาคม 2570",
  startIsoDate: "2026-12-08",
  endIsoDate: "2027-03-26",
  isActive: true,
};

export const REGISTERED_TERMS: SemesterTermInfo[] = [
  Y1S2_TERM_INFO,
];

export const TERM_SCHEDULES: Record<string, TermScheduleData> = {
  "2569-2": {
    termInfo: Y1S2_TERM_INFO,
    courses: Y1S2_COURSES,
    presets: SCHEDULE_PRESETS,
    defaultSelections: DEFAULT_SCHEDULE_SELECTIONS,
    getStudentGroup: getStudentScheduleGroup,
  },
};

/**
 * Returns the currently active academic term info.
 */
export function getActiveTerm(): SemesterTermInfo {
  const active = REGISTERED_TERMS.find((t) => t.isActive);
  return active ?? REGISTERED_TERMS[0];
}

/**
 * Returns complete schedule bundle for a given term ID, falling back to the active term.
 */
export function getTermSchedule(termId?: string): TermScheduleData {
  const id = termId || getActiveTerm().id;
  const data = TERM_SCHEDULES[id];
  if (!data) {
    return TERM_SCHEDULES[getActiveTerm().id];
  }
  return data;
}

/**
 * Returns list of all registered academic terms.
 */
export function getAllRegisteredTerms(): SemesterTermInfo[] {
  return REGISTERED_TERMS;
}
