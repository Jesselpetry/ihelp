import finalExamsData from "@/data/exams/final-exams.json";
import studentIndexData from "@/data/exams/student-seating-index.json";
import facultyMasterData from "@/data/exams/faculty-07-master.json";
import roomSeatingData from "@/data/exams/room-seating-map.json";
import { COURSES } from "@/lib/courses/catalog";
import type {
  FinalExamItem,
  MidtermSeatingItem,
  StudentExamProfile,
  FacultyMasterExamItem,
  RoomSeatingSession,
} from "./types";

interface StudentIndexEntry {
  student_id: string;
  name: string;
  exams: MidtermSeatingItem[];
}

const studentIndex = studentIndexData as unknown as Record<string, StudentIndexEntry>;
const facultyMaster = facultyMasterData as unknown as FacultyMasterExamItem[];

export function sanitizeStudentId(id: string): string {
  return id.replace(/\D/g, "").trim();
}

export function resolveCatalogCourseByCode(courseCode: string) {
  const code = courseCode.trim();
  const aliasMap: Record<string, string> = {
    "90642999": "90641001",
    "06016409": "06066303",
  };
  const targetCode = aliasMap[code] ?? code;
  return COURSES.find(
    (c) =>
      c.officialCode === targetCode ||
      c.code.toLowerCase() === targetCode.toLowerCase(),
  );
}

export function getStudentProfile(rawId: string): StudentExamProfile | null {
  const studentId = sanitizeStudentId(rawId);
  if (!studentId || studentId.length < 8) return null;

  const foundInIndex = studentIndex[studentId];
  const isYear1 = studentId.startsWith("6907");
  const yearDigit = studentId.slice(0, 2);
  const currentYear = 69;
  const yearNumber = Number(yearDigit) ? currentYear - Number(yearDigit) + 1 : undefined;

  let cohortOrder: string | undefined = undefined;
  let sectionGroup = 1;

  if (isYear1) {
    const orderNum = parseInt(studentId.slice(4), 10);
    if (!isNaN(orderNum)) {
      if (orderNum <= 70) {
        cohortOrder = `IT1 ลำดับ 1-70 (ลำดับที่ ${orderNum})`;
        sectionGroup = 1;
      } else if (orderNum <= 140) {
        cohortOrder = `IT1 ลำดับ 71-140 (ลำดับที่ ${orderNum})`;
        sectionGroup = 2;
      } else {
        cohortOrder = `IT1 ลำดับ 141-210 (ลำดับที่ ${orderNum})`;
        sectionGroup = 3;
      }
    }
  }

  // Final exams for Year 1 students (based on centralized KMITL registration schedule)
  const finalExams: FinalExamItem[] = isYear1
    ? (finalExamsData.central_final_exams as FinalExamItem[]).map((exam) => {
        const item = { ...exam };
        const course = resolveCatalogCourseByCode(item.course_code);
        if (course) {
          item.course_name = course.nameEn;
          item.course_name_th = course.nameTh;
          item.short_name = course.code;
        }

        if (sectionGroup === 2) {
          // Sec 2 Theory adjustments
          if (item.course_code === "06016401") {
            item.sections = { theory: { section: 2, day: "อังคาร (Tue)", time: "13:00 - 16:00", room: "M 22 IT", instructors: item.sections?.theory?.instructors || [] } };
          } else if (item.course_code === "06016402") {
            item.sections = {
              theory: { section: 2, day: "อังคาร (Tue)", time: "16:00 - 18:00", room: "Project Base4 ชั้น 3 IT", instructors: item.sections?.theory?.instructors || [] },
              practice: { section: 5, day: "ศุกร์ (Fri)", time: "11:00 - 13:00", room: "Lab 434 IT", instructors: item.sections?.practice?.instructors || [] },
            };
          } else if (item.course_code === "06016411") {
            item.sections = {
              theory: { section: 2, day: "จันทร์ (Mon)", time: "14:00 - 16:00", room: "Project Base3 ชั้น 3 IT", instructors: item.sections?.theory?.instructors || [] },
              practice: { section: 5, day: "ศุกร์ (Fri)", time: "14:00 - 16:00", room: "L207 IT", instructors: item.sections?.practice?.instructors || [] },
            };
          } else if (item.course_code === "06066303") {
            item.sections = {
              theory: { section: 2, day: "จันทร์ (Mon)", time: "11:00 - 13:00", room: "slope IT", instructors: item.sections?.theory?.instructors || [] },
              practice: { section: 6, day: "ศุกร์ (Fri)", time: "09:00 - 11:00", room: "L203 IT", instructors: item.sections?.practice?.instructors || [] },
            };
          }
        } else if (sectionGroup === 3) {
          // Sec 3 Theory adjustments
          if (item.course_code === "06016401") {
            item.sections = { theory: { section: 3, day: "พุธ (Wed)", time: "09:00 - 12:00", room: "M 21 IT", instructors: item.sections?.theory?.instructors || [] } };
          } else if (item.course_code === "06016402") {
            item.sections = {
              theory: { section: 3, day: "อังคาร (Tue)", time: "14:00 - 16:00", room: "Audi IT", instructors: item.sections?.theory?.instructors || [] },
              practice: { section: 6, day: "ศุกร์ (Fri)", time: "14:00 - 16:00", room: "Lab 434 IT", instructors: item.sections?.practice?.instructors || [] },
            };
          } else if (item.course_code === "06016411") {
            item.sections = {
              theory: { section: 3, day: "จันทร์ (Mon)", time: "11:00 - 13:00", room: "Project Base3 ชั้น 3 IT", instructors: item.sections?.theory?.instructors || [] },
              practice: { section: 6, day: "ศุกร์ (Fri)", time: "09:00 - 11:00", room: "L207 IT", instructors: item.sections?.practice?.instructors || [] },
            };
          } else if (item.course_code === "06066303") {
            item.sections = {
              theory: { section: 4, day: "จันทร์ (Mon)", time: "09:00 - 11:00", room: "slope IT", instructors: item.sections?.theory?.instructors || [] },
              practice: { section: 8, day: "ศุกร์ (Fri)", time: "11:00 - 13:00", room: "L203 IT", instructors: item.sections?.practice?.instructors || [] },
            };
          }
        }
        return item;
      })
    : [];

  const inClassExams = isYear1
    ? (finalExamsData.in_class_or_arranged_exams as unknown as FinalExamItem[]).map((exam) => {
        const item = { ...exam };
        const course = resolveCatalogCourseByCode(item.course_code);
        if (course) {
          item.course_name = course.nameEn;
          item.course_name_th = course.nameTh;
          item.short_name = course.code;
        }
        return item;
      })
    : [];

  const midtermExams: MidtermSeatingItem[] = (foundInIndex?.exams ?? []).map((exam) => {
    const item = { ...exam };
    const course = resolveCatalogCourseByCode(item.course_code);
    if (course) {
      item.course_name = course.nameEn;
      item.course_name_th = course.nameTh;
      item.short_name = course.code;
    }
    return item;
  });

  if (!foundInIndex && !isYear1) {
    return null;
  }

  return {
    student_id: studentId,
    name: foundInIndex?.name,
    faculty: "คณะเทคโนโลยีสารสนเทศ (IT)",
    year: yearNumber,
    cohort_order: cohortOrder,
    is_year1: isYear1,
    midterm_exams: midtermExams,
    final_exams: finalExams,
    in_class_exams: inClassExams,
  };
}

export function getAllFacultyExams(
  searchQuery?: string,
  selectedDate?: string,
): FacultyMasterExamItem[] {
  let list = facultyMaster.map((item) => {
    const course = resolveCatalogCourseByCode(item.course_code);
    if (course) {
      return {
        ...item,
        course_name: course.nameEn,
      };
    }
    return item;
  });

  if (selectedDate && selectedDate !== "ALL") {
    list = list.filter((item) => item.exam_date === selectedDate);
  }
  if (searchQuery && searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    list = list.filter((item) => {
      const course = resolveCatalogCourseByCode(item.course_code);
      const matchesCatalog =
        course &&
        (course.code.toLowerCase().includes(q) ||
          course.nameEn.toLowerCase().includes(q) ||
          course.nameTh.toLowerCase().includes(q));

      return (
        matchesCatalog ||
        item.course_code.toLowerCase().includes(q) ||
        item.course_name.toLowerCase().includes(q) ||
        item.room.toLowerCase().includes(q) ||
        item.building.toLowerCase().includes(q) ||
        item.student_id_range.toLowerCase().includes(q)
      );
    });
  }
  return list;
}

export function getAllExamDates(): string[] {
  const dates = new Set<string>();
  facultyMaster.forEach((item) => {
    if (item.exam_date) dates.add(item.exam_date);
  });
  return Array.from(dates).sort();
}

export function generateICS(
  exams: FinalExamItem[],
  studentId: string,
  studentName?: string,
): string {
  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//iHelp//IT KMITL Exam Schedule//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:IT KMITL Final Exams (${studentId})`,
    "X-WR-TIMEZONE:Asia/Bangkok",
  ];

  exams.forEach((item) => {
    const isoDate = item.final_exam.date_iso.replace(/-/g, "");
    const timeMatch = item.final_exam.time.match(/(\d{2}):(\d{2})\s*-\s*(\d{2}):(\d{2})/);
    const startHour = timeMatch ? timeMatch[1] : "09";
    const startMin = timeMatch ? timeMatch[2] : "30";
    const endHour = timeMatch ? timeMatch[3] : "12";
    const endMin = timeMatch ? timeMatch[4] : "30";

    const dtStart = `${isoDate}T${startHour}${startMin}00`;
    const dtEnd = `${isoDate}T${endHour}${endMin}00`;
    const uid = `final-${item.course_code}-${studentId}@ihelp.kmitl.ac.th`;

    const summary = `สอบปลายภาค: ${item.course_code} ${item.short_name || item.course_name}`;
    const desc = `วิชา: ${item.course_name}\nกลุ่ม: ${item.sections?.theory?.section ? "Sec " + item.sections.theory.section : "-"}\nผู้สอบ: ${studentName || studentId}\nจัดสอบ: ${item.final_exam.type}`;

    lines.push(
      "BEGIN:VEVENT",
      `UID:${uid}`,
      `DTSTAMP:${isoDate}T000000Z`,
      `DTSTART;TZID=Asia/Bangkok:${dtStart}`,
      `DTEND;TZID=Asia/Bangkok:${dtEnd}`,
      `SUMMARY:${summary}`,
      `DESCRIPTION:${desc}`,
      "LOCATION:คณะเทคโนโลยีสารสนเทศ สจล.",
      "BEGIN:VALARM",
      "ACTION:DISPLAY",
      `DESCRIPTION:แจ้งเตือนสอบ: ${item.course_code}`,
      "TRIGGER:-P1D",
      "END:VALARM",
      "END:VEVENT",
    );
  });

  lines.push("END:VCALENDAR", "");
  return lines.join("\r\n");
}

const roomSeatingMap = roomSeatingData as unknown as Record<string, RoomSeatingSession>;

export function getCoursePortalHref(courseCode: string): string | null {
  const course = resolveCatalogCourseByCode(courseCode);
  if (course?.portalHref) return course.portalHref;
  return null;
}

export function findSeatingForCourse(
  midtermExams: MidtermSeatingItem[],
  courseCode: string,
): MidtermSeatingItem | undefined {
  const code = courseCode.trim();
  const alias =
    code === "06016409" ? "06066303" : code === "06066303" ? "06016409" : null;

  return midtermExams.find(
    (m) => m.course_code === code || (alias && m.course_code === alias),
  );
}

export function getRoomSeatingSession(
  courseCode: string,
  room?: string,
  examDate?: string,
): RoomSeatingSession | null {
  const code = courseCode.trim();
  const alias =
    code === "06016409" ? "06066303" : code === "06066303" ? "06016409" : null;

  if (room && examDate) {
    const key = `${code}_${room}_${examDate}`;
    if (roomSeatingMap[key]) return roomSeatingMap[key];
    if (alias) {
      const aliasKey = `${alias}_${room}_${examDate}`;
      if (roomSeatingMap[aliasKey]) return roomSeatingMap[aliasKey];
    }
  }

  if (room) {
    const normRoom = room.trim().toLowerCase();
    const entry = Object.values(roomSeatingMap).find(
      (item) =>
        (item.course_code === code || (alias && item.course_code === alias)) &&
        item.room.trim().toLowerCase() === normRoom,
    );
    if (entry) return entry;
  }

  // Fallback search if exact key differs slightly
  const fallback = Object.values(roomSeatingMap).find(
    (item) => item.course_code === code || (alias && item.course_code === alias),
  );
  return fallback || null;
}
