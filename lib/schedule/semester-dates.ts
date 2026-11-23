import type { DayOfWeek } from "./types";
import rawMeetings from "@/data/schedule/y1s2-meeting-dates.json";

export interface SemesterMeeting {
  courseCode: string;
  courseNameTh: string;
  courseNameEn: string;
  section: number;
  type: "ทฤษฎี" | "ปฏิบัติ";
  sessionNumber: number;
  day: DayOfWeek;
  dateStr: string;
  fullDateTh: string;
  isoDate: string;
  timeStr: string;
  room: string;
  building: string;
  instructors: string[];
  teachingWeek: number;
}

export interface SemesterCalendarConfig {
  academicYear: string;
  semester: string;
  startDateTh: string;
  endDateTh: string;
  startIsoDate: string;
  endIsoDate: string;
  midtermWeek: {
    startDateTh: string;
    endDateTh: string;
    startIsoDate: string;
    endIsoDate: string;
    description: string;
  };
  finalWeek: {
    startDateTh: string;
    endDateTh: string;
    startIsoDate: string;
    endIsoDate: string;
    description: string;
  };
  totalTeachingWeeks: number;
  totalCalendarWeeks: number;
}

export const SEMESTER_CONFIG_2_2569: SemesterCalendarConfig = {
  academicYear: "2569",
  semester: "2",
  startDateTh: "8 ธันวาคม 2569",
  endDateTh: "26 มีนาคม 2570",
  startIsoDate: "2026-12-08",
  endIsoDate: "2027-03-26",
  midtermWeek: {
    startDateTh: "1 กุมภาพันธ์ 2570",
    endDateTh: "6 กุมภาพันธ์ 2570",
    startIsoDate: "2027-02-01",
    endIsoDate: "2027-02-06",
    description: "สัปดาห์สอบกลางภาค ภาคเรียนที่ 2/2569 (ไม่มีการเรียนการสอน)",
  },
  finalWeek: {
    startDateTh: "29 มีนาคม 2570",
    endDateTh: "8 เมษายน 2570",
    startIsoDate: "2027-03-29",
    endIsoDate: "2027-04-08",
    description: "สัปดาห์สอบไล่ประจำภาคเรียนที่ 2/2569",
  },
  totalTeachingWeeks: 15,
  totalCalendarWeeks: 16,
};

export const SEMESTER_MEETINGS: SemesterMeeting[] = rawMeetings as SemesterMeeting[];

/**
 * Returns all meeting dates for a specific course and section.
 */
export function getMeetingsByCourseSection(
  courseCode: string,
  section: number,
): SemesterMeeting[] {
  return SEMESTER_MEETINGS.filter(
    (m) => m.courseCode === courseCode && m.section === section,
  );
}

/**
 * Returns all meetings scheduled for a given teaching week (1 to 15).
 */
export function getMeetingsByTeachingWeek(week: number): SemesterMeeting[] {
  return SEMESTER_MEETINGS.filter((m) => m.teachingWeek === week);
}

/**
 * Returns all meetings on a specific calendar date (ISO: "YYYY-MM-DD").
 */
export function getMeetingsByDate(isoDate: string): SemesterMeeting[] {
  return SEMESTER_MEETINGS.filter((m) => m.isoDate === isoDate);
}

/**
 * Get distinct courses in the semester plan with their meeting counts.
 */
export function getCourseMeetingStats() {
  const map = new Map<string, { code: string; nameEn: string; nameTh: string; section: number; type: string; count: number }>();
  for (const m of SEMESTER_MEETINGS) {
    const key = `${m.courseCode}-${m.section}`;
    if (!map.has(key)) {
      map.set(key, {
        code: m.courseCode,
        nameEn: m.courseNameEn,
        nameTh: m.courseNameTh,
        section: m.section,
        type: m.type,
        count: 0,
      });
    }
    map.get(key)!.count += 1;
  }
  return Array.from(map.values());
}
