import { getCourseAbbr } from "@/lib/courses/catalog";
import type {
  DayOfWeek,
  SectionEntry,
  SemesterTermInfo,
  TimetableCourse,
  UserScheduleSelection,
} from "./types";
import { getScheduledSlots, Y1S2_COURSES } from "./y1s2-data";
import {
  SEMESTER_CONFIG_2_2569,
  THAI_PUBLIC_HOLIDAYS_2_2569,
} from "./semester-dates";

const THAI_DAY_INDEX: Record<DayOfWeek, number> = {
  จันทร์: 1,
  อังคาร: 2,
  พุธ: 3,
  พฤหัสบดี: 4,
  ศุกร์: 5,
};

const THAI_MONTHS: Record<string, string> = {
  มกราคม: "01",
  กุมภาพันธ์: "02",
  มีนาคม: "03",
  เมษายน: "04",
  พฤษภาคม: "05",
  มิถุนายน: "06",
  กรกฎาคม: "07",
  สิงหาคม: "08",
  กันยายน: "09",
  ตุลาคม: "10",
  พฤศจิกายน: "11",
  ธันวาคม: "12",
};

const THAI_MONTH_SHORT = [
  "",
  "ม.ค.",
  "ก.พ.",
  "มี.ค.",
  "เม.ย.",
  "พ.ค.",
  "มิ.ย.",
  "ก.ค.",
  "ส.ค.",
  "ก.ย.",
  "ต.ค.",
  "พ.ย.",
  "ธ.ค.",
];

export function formatThaiDateShort(isoDate: string, day: DayOfWeek): string {
  const parts = isoDate.split("-").map(Number);
  const y = parts[0];
  const m = parts[1];
  const d = parts[2];
  const yearBe = y + 543;
  return `วัน${day}ที่ ${d} ${THAI_MONTH_SHORT[m]} ${yearBe}`;
}

export interface CourseMeetingItem {
  type: "class" | "holiday" | "midterm_break";
  sessionNumber?: number;
  dateIso: string;
  dateTh: string;
  day: DayOfWeek;
  timeStr: string;
  room: string;
  building: string;
  note: string;
}

/**
 * Returns a comprehensive meeting timeline for a section across semester 2/2569,
 * explicitly tracking each class session, official public holiday, and midterm week.
 */
export function getCourseSectionMeetingTimeline(
  section: SectionEntry,
  startIsoDate = SEMESTER_CONFIG_2_2569.startIsoDate,
  endIsoDate = SEMESTER_CONFIG_2_2569.endIsoDate,
): CourseMeetingItem[] {
  const targetWeekday = THAI_DAY_INDEX[section.timeSlot.day];
  const holidayMap = new Map(
    THAI_PUBLIC_HOLIDAYS_2_2569.map((h) => [h.dateIso, h.nameTh]),
  );
  const items: CourseMeetingItem[] = [];
  const current = new Date(`${startIsoDate}T00:00:00Z`);
  const end = new Date(`${endIsoDate}T00:00:00Z`);
  let sessionNumber = 1;

  while (current <= end) {
    if (current.getUTCDay() === targetWeekday) {
      const isoDate = current.toISOString().slice(0, 10);
      const isMidterm =
        isoDate >= SEMESTER_CONFIG_2_2569.midtermWeek.startIsoDate &&
        isoDate <= SEMESTER_CONFIG_2_2569.midtermWeek.endIsoDate;
      const holidayName = holidayMap.get(isoDate);
      const dateTh = formatThaiDateShort(isoDate, section.timeSlot.day);

      if (isMidterm) {
        items.push({
          type: "midterm_break",
          dateIso: isoDate,
          dateTh,
          day: section.timeSlot.day,
          timeStr: section.timeSlot.timeStr,
          room: section.timeSlot.room,
          building: section.timeSlot.building,
          note: "สัปดาห์สอบกลางภาค (งดการเรียนการสอน)",
        });
      } else if (holidayName) {
        items.push({
          type: "holiday",
          dateIso: isoDate,
          dateTh,
          day: section.timeSlot.day,
          timeStr: section.timeSlot.timeStr,
          room: section.timeSlot.room,
          building: section.timeSlot.building,
          note: `วันหยุดราชการ: ${holidayName} (งดการเรียนการสอน)`,
        });
      } else {
        items.push({
          type: "class",
          sessionNumber,
          dateIso: isoDate,
          dateTh,
          day: section.timeSlot.day,
          timeStr: section.timeSlot.timeStr,
          room: section.timeSlot.room,
          building: section.timeSlot.building,
          note: "เรียนตามปกติ",
        });
        sessionNumber += 1;
      }
    }
    current.setUTCDate(current.getUTCDate() + 1);
  }

  return items;
}

/**
 * Parses Thai academic date string (e.g. "ศุกร์ 5 กุมภาพันธ์ 2570") into ISO string ("2027-02-05").
 */
export function parseThaiDateToIso(thaiDateStr: string): string | null {
  const match = thaiDateStr.match(/(\d{1,2})\s+([^\s\d]+)\s+(\d{4})/);
  if (!match) return null;
  const day = match[1].padStart(2, "0");
  const monthName = match[2];
  const yearBe = Number.parseInt(match[3], 10);
  const month = THAI_MONTHS[monthName];
  if (!month) return null;
  const yearCe = yearBe - 543;
  return `${yearCe}-${month}-${day}`;
}

/**
 * Parses time range string (e.g. "09:30 - 12:30") into padded start/end hours and minutes.
 */
export function parseTimeRange(timeStr: string): {
  startHour: string;
  startMinute: string;
  endHour: string;
  endMinute: string;
} | null {
  const m = timeStr.match(/(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/);
  if (!m) return null;
  return {
    startHour: m[1].padStart(2, "0"),
    startMinute: m[2],
    endHour: m[3].padStart(2, "0"),
    endMinute: m[4],
  };
}

/**
 * Escapes characters for iCalendar (RFC 5545) text fields.
 */
function escapeIcsText(str: string): string {
  return str
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

function getNextDateIso(isoDate: string): string {
  const d = new Date(`${isoDate}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10);
}

/**
 * Returns all active teaching dates for a given day of the week in semester 2/2569,
 * strictly skipping official Thai public holidays and Midterm exam week.
 */
export function getTeachingDatesForDay(
  day: DayOfWeek,
  startIsoDate = SEMESTER_CONFIG_2_2569.startIsoDate,
  endIsoDate = SEMESTER_CONFIG_2_2569.endIsoDate,
): string[] {
  const targetWeekday = THAI_DAY_INDEX[day];
  const holidaySet = new Set(THAI_PUBLIC_HOLIDAYS_2_2569.map((h) => h.dateIso));
  const dates: string[] = [];
  const current = new Date(`${startIsoDate}T00:00:00Z`);
  const end = new Date(`${endIsoDate}T00:00:00Z`);

  while (current <= end) {
    if (current.getUTCDay() === targetWeekday) {
      const isoDate = current.toISOString().slice(0, 10);
      const isMidterm =
        isoDate >= SEMESTER_CONFIG_2_2569.midtermWeek.startIsoDate &&
        isoDate <= SEMESTER_CONFIG_2_2569.midtermWeek.endIsoDate;
      const isHoliday = holidaySet.has(isoDate);

      if (!isMidterm && !isHoliday) {
        dates.push(isoDate);
      }
    }
    current.setUTCDate(current.getUTCDate() + 1);
  }

  return dates;
}

/**
 * Generates an RFC 5545 compliant iCalendar (.ics) string for the user's selected timetable.
 * Accurately schedules each class session on its actual teaching dates,
 * filters out Thai public holidays and Midterm exam week,
 * and includes midterm and final exam schedules.
 */
export function exportScheduleAsIcs(
  selection: UserScheduleSelection,
  courses: TimetableCourse[] = Y1S2_COURSES,
  termInfo?: SemesterTermInfo,
): string {
  const slots = getScheduledSlots(selection, courses);
  const termName = termInfo ? `${termInfo.semester}/${termInfo.academicYear}` : "2/2569";
  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//iHelp//IT KMITL Schedule Calendar//TH",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:ตารางเรียน IT KMITL (${termName})`,
    "X-WR-TIMEZONE:Asia/Bangkok",
    "BEGIN:VTIMEZONE",
    "TZID:Asia/Bangkok",
    "TZURL:http://tzurl.org/zoneinfo-outlook/Asia/Bangkok",
    "X-LIC-LOCATION:Asia/Bangkok",
    "BEGIN:STANDARD",
    "TZOFFSETFROM:+0700",
    "TZOFFSETTO:+0700",
    "TZNAME:+07",
    "DTSTART:19700101T000000",
    "END:STANDARD",
    "END:VTIMEZONE",
  ];

  const nowIsoCompact = new Date().toISOString().replace(/[-:]/g, "").slice(0, 15) + "Z";

  // 1. Generate class sessions for each active scheduled slot
  for (const slot of slots) {
    const teachingDates = getTeachingDatesForDay(
      slot.day,
      termInfo?.startIsoDate || SEMESTER_CONFIG_2_2569.startIsoDate,
      termInfo?.endIsoDate || SEMESTER_CONFIG_2_2569.endIsoDate,
    );

    const startH = String(slot.startHour).padStart(2, "0");
    const startM = String(slot.startMinute).padStart(2, "0");
    const endH = String(slot.endHour).padStart(2, "0");
    const endM = String(slot.endMinute).padStart(2, "0");
    const abbr = slot.abbr || getCourseAbbr(slot.courseCode) || slot.courseNameEn;

    teachingDates.forEach((isoDate, index) => {
      const dateCompact = isoDate.replace(/-/g, "");
      const dtStart = `${dateCompact}T${startH}${startM}00`;
      const dtEnd = `${dateCompact}T${endH}${endM}00`;
      const uid = `class-${slot.courseCode}-sec${slot.section}-${dateCompact}@ihelp.kmitl.ac.th`;

      const summary = `${slot.courseCode} ${abbr} (${slot.type} Sec ${slot.section})`;
      const descLines = [
        `รายวิชา: ${slot.courseCode} ${slot.courseNameTh} (${slot.courseNameEn})`,
        `หมวดวิชา: ${slot.category}`,
        `กลุ่มเรียน: Section ${slot.section} (${slot.type})`,
        `ห้องเรียน: ${slot.room} (อาคาร ${slot.building})`,
        `อาจารย์ผู้สอน: ${slot.instructors.join(", ")}`,
        `คาบเรียนที่: ${index + 1} จากทั้งหมด ${teachingDates.length} คาบ`,
      ];
      const location = `ห้อง ${slot.room} อาคาร ${slot.building} คณะเทคโนโลยีสารสนเทศ สจล.`;

      lines.push(
        "BEGIN:VEVENT",
        `UID:${uid}`,
        `DTSTAMP:${nowIsoCompact}`,
        `DTSTART;TZID=Asia/Bangkok:${dtStart}`,
        `DTEND;TZID=Asia/Bangkok:${dtEnd}`,
        `SUMMARY:${escapeIcsText(summary)}`,
        `DESCRIPTION:${escapeIcsText(descLines.join("\n"))}`,
        `LOCATION:${escapeIcsText(location)}`,
        "BEGIN:VALARM",
        "ACTION:DISPLAY",
        `DESCRIPTION:${escapeIcsText(`แจ้งเตือนเข้าเรียน: ${slot.courseCode} (Sec ${slot.section})`)}`,
        "TRIGGER:-PT15M",
        "END:VALARM",
        "END:VEVENT",
      );
    });
  }

  // 2. Add Thai Public Holidays as all-day events
  for (const holiday of THAI_PUBLIC_HOLIDAYS_2_2569) {
    const startCompact = holiday.dateIso.replace(/-/g, "");
    const endCompact = getNextDateIso(holiday.dateIso).replace(/-/g, "");
    const uid = `holiday-${startCompact}@ihelp.kmitl.ac.th`;

    lines.push(
      "BEGIN:VEVENT",
      `UID:${uid}`,
      `DTSTAMP:${nowIsoCompact}`,
      `DTSTART;VALUE=DATE:${startCompact}`,
      `DTEND;VALUE=DATE:${endCompact}`,
      `SUMMARY:${escapeIcsText(`วันหยุดราชการ: ${holiday.nameTh} (${holiday.nameEn})`)}`,
      `DESCRIPTION:${escapeIcsText("วันหยุดราชการตามประกาศสำนักนายกรัฐมนตรี (ไม่มีการเรียนการสอน)")}`,
      "TRANSP:TRANSPARENT",
      "END:VEVENT",
    );
  }

  // 3. Add Midterm Exam Week as all-day event
  const midStartCompact = SEMESTER_CONFIG_2_2569.midtermWeek.startIsoDate.replace(/-/g, "");
  const midEndExclusive = getNextDateIso(SEMESTER_CONFIG_2_2569.midtermWeek.endIsoDate).replace(/-/g, "");
  lines.push(
    "BEGIN:VEVENT",
    `UID:midterm-week-2569-2@ihelp.kmitl.ac.th`,
    `DTSTAMP:${nowIsoCompact}`,
    `DTSTART;VALUE=DATE:${midStartCompact}`,
    `DTEND;VALUE=DATE:${midEndExclusive}`,
    `SUMMARY:${escapeIcsText("สัปดาห์สอบกลางภาค ภาคเรียนที่ 2/2569 (Midterm Exam Week)")}`,
    `DESCRIPTION:${escapeIcsText("สัปดาห์สอบกลางภาคประจำภาคการศึกษา (ไม่มีการเรียนการสอนตามปกติ)")}`,
    "TRANSP:TRANSPARENT",
    "END:VEVENT",
  );

  // 4. Add Midterm and Final exam events for enrolled courses
  const enrolledCourseCodes = new Set(slots.map((s) => s.courseCode));
  for (const course of courses) {
    if (!enrolledCourseCodes.has(course.code)) continue;
    const abbr = course.abbr || getCourseAbbr(course.code) || course.nameEn;

    // Midterm Exam
    if (course.midterm && course.midterm.date && course.midterm.time && course.midterm.time !== "-") {
      const examIso = parseThaiDateToIso(course.midterm.date);
      const timeParsed = parseTimeRange(course.midterm.time);
      if (examIso && timeParsed) {
        const dateCompact = examIso.replace(/-/g, "");
        const dtStart = `${dateCompact}T${timeParsed.startHour}${timeParsed.startMinute}00`;
        const dtEnd = `${dateCompact}T${timeParsed.endHour}${timeParsed.endMinute}00`;
        const uid = `exam-midterm-${course.code}@ihelp.kmitl.ac.th`;

        lines.push(
          "BEGIN:VEVENT",
          `UID:${uid}`,
          `DTSTAMP:${nowIsoCompact}`,
          `DTSTART;TZID=Asia/Bangkok:${dtStart}`,
          `DTEND;TZID=Asia/Bangkok:${dtEnd}`,
          `SUMMARY:${escapeIcsText(`สอบกลางภาค: ${course.code} ${abbr}`)}`,
          `DESCRIPTION:${escapeIcsText(`การสอบกลางภาควิชา ${course.code} ${course.nameTh} (${course.nameEn})\nเวลาสอบ: ${course.midterm.time}\nจัดสอบโดย: คณะเทคโนโลยีสารสนเทศ สจล.`)}`,
          `LOCATION:${escapeIcsText("คณะเทคโนโลยีสารสนเทศ สจล.")}`,
          "BEGIN:VALARM",
          "ACTION:DISPLAY",
          `DESCRIPTION:${escapeIcsText(`แจ้งเตือนสอบกลางภาค: ${course.code} ${abbr}`)}`,
          "TRIGGER:-P1D",
          "END:VALARM",
          "END:VEVENT",
        );
      }
    }

    // Final Exam
    if (course.final && course.final.date && course.final.time && course.final.time !== "-") {
      const examIso = parseThaiDateToIso(course.final.date);
      const timeParsed = parseTimeRange(course.final.time);
      if (examIso && timeParsed) {
        const dateCompact = examIso.replace(/-/g, "");
        const dtStart = `${dateCompact}T${timeParsed.startHour}${timeParsed.startMinute}00`;
        const dtEnd = `${dateCompact}T${timeParsed.endHour}${timeParsed.endMinute}00`;
        const uid = `exam-final-${course.code}@ihelp.kmitl.ac.th`;

        lines.push(
          "BEGIN:VEVENT",
          `UID:${uid}`,
          `DTSTAMP:${nowIsoCompact}`,
          `DTSTART;TZID=Asia/Bangkok:${dtStart}`,
          `DTEND;TZID=Asia/Bangkok:${dtEnd}`,
          `SUMMARY:${escapeIcsText(`สอบไล่ประจำภาค: ${course.code} ${abbr}`)}`,
          `DESCRIPTION:${escapeIcsText(`การสอบไล่ประจำภาคเรียนที่ 2/2569 วิชา ${course.code} ${course.nameTh} (${course.nameEn})\nเวลาสอบ: ${course.final.time}\nจัดสอบโดย: สำนักทะเบียนและคณะเทคโนโลยีสารสนเทศ สจล.`)}`,
          `LOCATION:${escapeIcsText("คณะเทคโนโลยีสารสนเทศ สจล.")}`,
          "BEGIN:VALARM",
          "ACTION:DISPLAY",
          `DESCRIPTION:${escapeIcsText(`แจ้งเตือนสอบไล่ประจำภาค: ${course.code} ${abbr}`)}`,
          "TRIGGER:-P1D",
          "END:VALARM",
          "END:VEVENT",
        );
      }
    }
  }

  lines.push("END:VCALENDAR", "");
  return lines.join("\r\n");
}
