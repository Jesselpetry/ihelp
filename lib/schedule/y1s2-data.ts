import { getCourseAbbr } from "@/lib/courses/catalog";
import type {
  DayOfWeek,
  ScheduleConflict,
  SchedulePreset,
  ScheduleStats,
  SemesterTermInfo,
  TimetableCourse,
  UserScheduleSelection,
} from "./types";
import studentGroupsData from "@/data/schedule/y1s2-student-groups.json";

export interface StudentScheduleGroupInfo {
  group: 1 | 2 | 3;
  name: string;
  presetId: "group-1" | "group-2" | "group-3";
}

/**
 * Returns the official assigned group (1, 2, or 3) for a given student ID.
 * Based on the live KMITL registration quota and roster data for 2/2569.
 */
export function getStudentScheduleGroup(
  studentId: string | null | undefined,
): StudentScheduleGroupInfo | null {
  if (!studentId) return null;
  const cleanId = studentId.replace(/\D/g, "").trim();
  if (studentGroupsData.group1.includes(cleanId)) {
    return { group: 1, name: "กลุ่ม 1", presetId: "group-1" };
  }
  if (studentGroupsData.group2.includes(cleanId)) {
    return { group: 2, name: "กลุ่ม 2", presetId: "group-2" };
  }
  if (studentGroupsData.group3.includes(cleanId)) {
    return { group: 3, name: "กลุ่ม 3", presetId: "group-3" };
  }
  const num = Number.parseInt(cleanId, 10);
  if (!Number.isNaN(num)) {
    if (num >= 69070001 && num <= 69070098) {
      return { group: 1, name: "กลุ่ม 1", presetId: "group-1" };
    }
    if (num >= 69070100 && num <= 69070201) {
      return { group: 2, name: "กลุ่ม 2", presetId: "group-2" };
    }
    if (num >= 69070203 && num <= 69070331) {
      return { group: 3, name: "กลุ่ม 3", presetId: "group-3" };
    }
  }
  return null;
}

export const DAYS_OF_WEEK: DayOfWeek[] = [
  "จันทร์",
  "อังคาร",
  "พุธ",
  "พฤหัสบดี",
  "ศุกร์",
];

export const Y1S2_COURSES: TimetableCourse[] = [
  {
    code: "06016408",
    abbr: "OOP",
    nameTh: "การสร้างโปรแกรมเชิงวัตถุ",
    nameEn: "OBJECT-ORIENTED PROGRAMMING",
    credits: "3(2-2-5)",
    creditHours: 3,
    category: "วิชาบังคับ",
    hasLab: true,
    midterm: {
      date: "ศุกร์ 5 กุมภาพันธ์ 2570",
      time: "13:30 - 16:30",
    },
    final: {
      date: "ศุกร์ 2 เมษายน 2570",
      time: "09:30 - 12:30",
    },
    sections: [
      {
        section: 1,
        type: "ทฤษฎี",
        timeSlot: {
          day: "จันทร์",
          startHour: 9,
          startMinute: 0,
          endHour: 11,
          endMinute: 0,
          timeStr: "09:00 - 11:00",
          room: "M 22",
          building: "IT",
        },
        instructors: ["ผศ. ดร. ธราวิเชษฐ์ ธิติจรูญโรจน์"],
        condition: "กลุ่ม 1 (รหัส 69070001 - 69070098 และตกค้าง)",
        seats: { total: 73, used: 14, remain: 59 },
      },
      {
        section: 2,
        type: "ทฤษฎี",
        timeSlot: {
          day: "จันทร์",
          startHour: 11,
          startMinute: 0,
          endHour: 13,
          endMinute: 0,
          timeStr: "11:00 - 13:00",
          room: "M 22",
          building: "IT",
        },
        instructors: ["ผศ. ดร. ธราวิเชษฐ์ ธิติจรูญโรจน์"],
        condition: "กลุ่ม 2 (รหัส 69070100 - 69070201 และตกค้าง)",
        seats: { total: 73, used: 10, remain: 63 },
      },
      {
        section: 3,
        type: "ทฤษฎี",
        timeSlot: {
          day: "จันทร์",
          startHour: 14,
          startMinute: 0,
          endHour: 16,
          endMinute: 0,
          timeStr: "14:00 - 16:00",
          room: "M 22",
          building: "IT",
        },
        instructors: ["ผศ. ดร. ธราวิเชษฐ์ ธิติจรูญโรจน์"],
        condition: "กลุ่ม 3 (รหัส 69070203 - 69070331 และตกค้าง)",
        seats: { total: 73, used: 5, remain: 68 },
      },
      {
        section: 4,
        type: "ปฏิบัติ",
        timeSlot: {
          day: "ศุกร์",
          startHour: 9,
          startMinute: 0,
          endHour: 11,
          endMinute: 0,
          timeStr: "09:00 - 11:00",
          room: "L203",
          building: "IT",
        },
        instructors: ["ผศ. ดร. ธราวิเชษฐ์ ธิติจรูญโรจน์"],
        condition: "กลุ่ม 1 (รหัส 69070001 - 69070098 และตกค้าง)",
        seats: { total: 73, used: 14, remain: 59 },
      },
      {
        section: 5,
        type: "ปฏิบัติ",
        timeSlot: {
          day: "ศุกร์",
          startHour: 11,
          startMinute: 0,
          endHour: 13,
          endMinute: 0,
          timeStr: "11:00 - 13:00",
          room: "L203",
          building: "IT",
        },
        instructors: ["ผศ. ดร. ธราวิเชษฐ์ ธิติจรูญโรจน์"],
        condition: "กลุ่ม 2 (รหัส 69070100 - 69070201 และตกค้าง)",
        seats: { total: 73, used: 10, remain: 63 },
      },
      {
        section: 6,
        type: "ปฏิบัติ",
        timeSlot: {
          day: "ศุกร์",
          startHour: 14,
          startMinute: 0,
          endHour: 16,
          endMinute: 0,
          timeStr: "14:00 - 16:00",
          room: "L203",
          building: "IT",
        },
        instructors: ["ผศ. ดร. ธราวิเชษฐ์ ธิติจรูญโรจน์"],
        condition: "กลุ่ม 3 (รหัส 69070203 - 69070331 และตกค้าง)",
        seats: { total: 73, used: 5, remain: 68 },
      },
    ],
  },
  {
    code: "06066001",
    abbr: "PSTAT",
    nameTh: "ความน่าจะเป็นและสถิติ",
    nameEn: "PROBABILITY AND STATISTICS",
    credits: "3(3-0-6)",
    creditHours: 3,
    category: "วิชาบังคับ",
    hasLab: false,
    midterm: {
      date: "พฤหัสบดี 4 กุมภาพันธ์ 2570",
      time: "13:30 - 16:30",
    },
    final: {
      date: "พฤหัสบดี 8 เมษายน 2570",
      time: "09:30 - 12:30",
    },
    sections: [
      {
        section: 1,
        type: "ทฤษฎี",
        timeSlot: {
          day: "อังคาร",
          startHour: 9,
          startMinute: 0,
          endHour: 12,
          endMinute: 0,
          timeStr: "09:00 - 12:00",
          room: "slope",
          building: "IT",
        },
        instructors: ["ศ. ดร. สุขสันต์ พาณิชพาพิบูล"],
        condition: "กลุ่ม 1 (รหัส 69070001 - 69070098)",
        seats: { total: 71, used: 14, remain: 57 },
      },
      {
        section: 2,
        type: "ทฤษฎี",
        timeSlot: {
          day: "อังคาร",
          startHour: 13,
          startMinute: 0,
          endHour: 16,
          endMinute: 0,
          timeStr: "13:00 - 16:00",
          room: "slope",
          building: "IT",
        },
        instructors: ["ศ. ดร. สุขสันต์ พาณิชพาพิบูล"],
        condition: "กลุ่ม 2 (รหัส 69070100 - 69070201)",
        seats: { total: 71, used: 10, remain: 61 },
      },
      {
        section: 3,
        type: "ทฤษฎี",
        timeSlot: {
          day: "พุธ",
          startHour: 13,
          startMinute: 0,
          endHour: 16,
          endMinute: 0,
          timeStr: "13:00 - 16:00",
          room: "Project Base4 ชั้น 3",
          building: "IT",
        },
        instructors: ["ศ. ดร. สุขสันต์ พาณิชพาพิบูล"],
        condition: "กลุ่ม 3 (รหัส 69070203 - 69070331)",
        seats: { total: 71, used: 5, remain: 66 },
      },
      {
        section: 4,
        type: "ทฤษฎี",
        timeSlot: {
          day: "อังคาร",
          startHour: 9,
          startMinute: 0,
          endHour: 12,
          endMinute: 0,
          timeStr: "09:00 - 12:00",
          room: "slope",
          building: "IT",
        },
        instructors: ["ศ. ดร. สุขสันต์ พาณิชพาพิบูล"],
        condition: "รับเฉพาะนักศึกษาตกค้าง / ชั้นปี 2-4 (65 คน)",
        seats: { total: 22, used: 0, remain: 22 },
      },
      {
        section: 5,
        type: "ทฤษฎี",
        timeSlot: {
          day: "อังคาร",
          startHour: 13,
          startMinute: 0,
          endHour: 16,
          endMinute: 0,
          timeStr: "13:00 - 16:00",
          room: "slope",
          building: "IT",
        },
        instructors: ["ศ. ดร. สุขสันต์ พาณิชพาพิบูล"],
        condition: "รับเฉพาะนักศึกษาตกค้าง / ชั้นปี 2-4 (65 คน)",
        seats: { total: 22, used: 1, remain: 21 },
      },
      {
        section: 6,
        type: "ทฤษฎี",
        timeSlot: {
          day: "พุธ",
          startHour: 13,
          startMinute: 0,
          endHour: 16,
          endMinute: 0,
          timeStr: "13:00 - 16:00",
          room: "Project Base4 ชั้น 3",
          building: "IT",
        },
        instructors: ["ศ. ดร. สุขสันต์ พาณิชพาพิบูล"],
        condition: "รับเฉพาะนักศึกษาตกค้าง / ชั้นปี 2-4 (65 คน)",
        seats: { total: 22, used: 4, remain: 18 },
      },
    ],
  },
  {
    code: "06066101",
    abbr: "BFIT",
    nameTh: "พื้นฐานทางธุรกิจสำหรับเทคโนโลยีสารสนเทศ",
    nameEn: "BUSINESS FUNDAMENTALS FOR INFORMATION",
    credits: "3(3-0-6)",
    creditHours: 3,
    category: "วิชาบังคับ",
    hasLab: false,
    midterm: {
      date: "จันทร์ 1 กุมภาพันธ์ 2570",
      time: "09:30 - 12:30",
    },
    final: {
      date: "จันทร์ 29 มีนาคม 2570",
      time: "13:30 - 16:30",
    },
    sections: [
      {
        section: 1,
        type: "ทฤษฎี",
        timeSlot: {
          day: "อังคาร",
          startHour: 13,
          startMinute: 0,
          endHour: 16,
          endMinute: 0,
          timeStr: "13:00 - 16:00",
          room: "M 03",
          building: "IT",
        },
        instructors: ["ศ. ดร. อาริต ธรรมโน", "ผศ. ดร. พรสุรีย์ แจ่มศรี"],
        condition: "กลุ่ม 1 (รหัส 69070001 - 69070098 และตกค้าง)",
        seats: { total: 77, used: 14, remain: 63 },
      },
      {
        section: 2,
        type: "ทฤษฎี",
        timeSlot: {
          day: "พุธ",
          startHour: 13,
          startMinute: 0,
          endHour: 16,
          endMinute: 0,
          timeStr: "13:00 - 16:00",
          room: "M 03",
          building: "IT",
        },
        instructors: ["ศ. ดร. อาริต ธรรมโน", "ผศ. ดร. พรสุรีย์ แจ่มศรี"],
        condition: "กลุ่ม 2 (รหัส 69070100 - 69070201 และตกค้าง)",
        seats: { total: 77, used: 9, remain: 68 },
      },
      {
        section: 3,
        type: "ทฤษฎี",
        timeSlot: {
          day: "อังคาร",
          startHour: 9,
          startMinute: 0,
          endHour: 12,
          endMinute: 0,
          timeStr: "09:00 - 12:00",
          room: "M 03",
          building: "IT",
        },
        instructors: ["ศ. ดร. อาริต ธรรมโน", "ผศ. ดร. พรสุรีย์ แจ่มศรี"],
        condition: "กลุ่ม 3 (รหัส 69070203 - 69070331 และตกค้าง)",
        seats: { total: 77, used: 5, remain: 72 },
      },
    ],
  },
  {
    code: "06066301",
    abbr: "DSA",
    nameTh: "โครงสร้างข้อมูลและอัลกอริทึม",
    nameEn: "DATA STRUCTURES AND ALGORITHMS",
    credits: "3(2-2-5)",
    creditHours: 3,
    category: "วิชาบังคับ",
    hasLab: true,
    midterm: {
      date: "อังคาร 2 กุมภาพันธ์ 2570",
      time: "13:30 - 16:30",
    },
    final: {
      date: "พฤหัสบดี 1 เมษายน 2570",
      time: "09:30 - 12:30",
    },
    sections: [
      {
        section: 1,
        type: "ทฤษฎี",
        timeSlot: {
          day: "จันทร์",
          startHour: 11,
          startMinute: 0,
          endHour: 13,
          endMinute: 0,
          timeStr: "11:00 - 13:00",
          room: "M 04",
          building: "IT",
        },
        instructors: ["ผศ. ดร. สุพัณณดา โชติพันธ์"],
        condition: "กลุ่ม 1 (รหัส 69070001 - 69070098 และตกค้าง)",
        seats: { total: 78, used: 14, remain: 64 },
      },
      {
        section: 2,
        type: "ทฤษฎี",
        timeSlot: {
          day: "จันทร์",
          startHour: 14,
          startMinute: 0,
          endHour: 16,
          endMinute: 0,
          timeStr: "14:00 - 16:00",
          room: "M 04",
          building: "IT",
        },
        instructors: ["ผศ. ดร. สุพัณณดา โชติพันธ์"],
        condition: "กลุ่ม 2 (รหัส 69070100 - 69070201 และตกค้าง)",
        seats: { total: 78, used: 10, remain: 68 },
      },
      {
        section: 3,
        type: "ทฤษฎี",
        timeSlot: {
          day: "จันทร์",
          startHour: 9,
          startMinute: 0,
          endHour: 11,
          endMinute: 0,
          timeStr: "09:00 - 11:00",
          room: "M 04",
          building: "IT",
        },
        instructors: ["ผศ. ดร. สุพัณณดา โชติพันธ์"],
        condition: "กลุ่ม 3 (รหัส 69070203 - 69070331 และตกค้าง)",
        seats: { total: 78, used: 6, remain: 72 },
      },
      {
        section: 4,
        type: "ปฏิบัติ",
        timeSlot: {
          day: "ศุกร์",
          startHour: 11,
          startMinute: 0,
          endHour: 13,
          endMinute: 0,
          timeStr: "11:00 - 13:00",
          room: "L207",
          building: "IT",
        },
        instructors: ["ผศ. ดร. สุพัณณดา โชติพันธ์"],
        condition: "กลุ่ม 1 (รหัส 69070001 - 69070098 และตกค้าง)",
        seats: { total: 78, used: 14, remain: 64 },
      },
      {
        section: 5,
        type: "ปฏิบัติ",
        timeSlot: {
          day: "ศุกร์",
          startHour: 14,
          startMinute: 0,
          endHour: 16,
          endMinute: 0,
          timeStr: "14:00 - 16:00",
          room: "L207",
          building: "IT",
        },
        instructors: ["ผศ. ดร. สุพัณณดา โชติพันธ์"],
        condition: "กลุ่ม 2 (รหัส 69070100 - 69070201 และตกค้าง)",
        seats: { total: 78, used: 10, remain: 68 },
      },
      {
        section: 6,
        type: "ปฏิบัติ",
        timeSlot: {
          day: "ศุกร์",
          startHour: 9,
          startMinute: 0,
          endHour: 11,
          endMinute: 0,
          timeStr: "09:00 - 11:00",
          room: "L207",
          building: "IT",
        },
        instructors: ["ผศ. ดร. สุพัณณดา โชติพันธ์"],
        condition: "กลุ่ม 3 (รหัส 69070203 - 69070331 และตกค้าง)",
        seats: { total: 78, used: 6, remain: 72 },
      },
    ],
  },
  {
    code: "90641007",
    abbr: "DC",
    nameTh: "พลเมืองดิจิทัล",
    nameEn: "DIGITAL CITIZEN",
    credits: "3(3-0-6)",
    creditHours: 3,
    category: "วิชาเลือก / GenEd",
    hasLab: false,
    midterm: {
      date: "จัดสอบเอง",
      time: "-",
      isSelfArranged: true,
    },
    final: {
      date: "จัดสอบเอง",
      time: "-",
      isSelfArranged: true,
    },
    sections: [
      {
        section: 601,
        type: "ทฤษฎี",
        timeSlot: {
          day: "พุธ",
          startHour: 9,
          startMinute: 0,
          endHour: 12,
          endMinute: 0,
          timeStr: "09:00 - 12:00",
          room: "M 21",
          building: "IT",
        },
        instructors: ["ผศ. ดร. กนกวรรณ อัจฉริยะชาญวณิช"],
        condition: "เฉพาะรหัสนักศึกษา 69070001 - 69079999",
        seats: { total: 83, used: 5, remain: 78 },
      },
      {
        section: 602,
        type: "ทฤษฎี",
        timeSlot: {
          day: "พุธ",
          startHour: 9,
          startMinute: 0,
          endHour: 12,
          endMinute: 0,
          timeStr: "09:00 - 12:00",
          room: "D-305",
          building: "พระเทพฯ-D",
        },
        instructors: ["ผศ. ดร. ชุติมา ไวยสุระสิงห์"],
        condition: "เฉพาะรหัสนักศึกษา 69070001 - 69079999",
        seats: { total: 83, used: 15, remain: 68 },
      },
      {
        section: 603,
        type: "ทฤษฎี",
        timeSlot: {
          day: "พุธ",
          startHour: 9,
          startMinute: 0,
          endHour: 12,
          endMinute: 0,
          timeStr: "09:00 - 12:00",
          room: "M 22",
          building: "IT",
        },
        instructors: ["ผศ. ดร. อนันตพัฒน์ อนันตชัย"],
        condition: "เฉพาะรหัสนักศึกษา 69070001 - 69079999",
        seats: { total: 83, used: 20, remain: 63 },
      },
      {
        section: 604,
        type: "ทฤษฎี",
        timeSlot: {
          day: "พุธ",
          startHour: 9,
          startMinute: 0,
          endHour: 12,
          endMinute: 0,
          timeStr: "09:00 - 12:00",
          room: "M 23",
          building: "IT",
        },
        instructors: ["รศ. ดร. พนารัตน์ เชิญถนอมวงศ์"],
        condition: "เฉพาะรหัสนักศึกษา 69070001 - 69079999",
        seats: { total: 83, used: 9, remain: 74 },
      },
    ],
  },
  {
    code: "90644008",
    abbr: "FE2",
    nameTh: "ภาษาอังกฤษพื้นฐาน 2",
    nameEn: "FOUNDATION ENGLISH 2",
    credits: "3(3-0-6)",
    creditHours: 3,
    category: "วิชาเลือก / GenEd",
    hasLab: false,
    midterm: {
      date: "จัดสอบเอง",
      time: "-",
      isSelfArranged: true,
    },
    final: {
      date: "จัดสอบเอง",
      time: "-",
      isSelfArranged: true,
    },
    sections: [
      {
        section: 921,
        type: "ทฤษฎี",
        timeSlot: {
          day: "พฤหัสบดี",
          startHour: 9,
          startMinute: 0,
          endHour: 12,
          endMinute: 0,
          timeStr: "09:00 - 12:00",
          room: "D-304 A",
          building: "พระเทพฯ-D",
        },
        instructors: ["ดร. ANDY CUBALIT", "อ. ณัฏฐริณันท์ ปั้นเฉย"],
        condition: "เฉพาะรหัสนักศึกษา 69050001 - 69059999 และ 69070001 - 69079999",
        seats: { total: 55, used: 10, remain: 45 },
      },
      {
        section: 922,
        type: "ทฤษฎี",
        timeSlot: {
          day: "พฤหัสบดี",
          startHour: 9,
          startMinute: 0,
          endHour: 12,
          endMinute: 0,
          timeStr: "09:00 - 12:00",
          room: "D-304 B",
          building: "พระเทพฯ-D",
        },
        instructors: ["ดร. ANDY CUBALIT", "อ. ณัฏฐริณันท์ ปั้นเฉย"],
        condition: "เฉพาะรหัสนักศึกษา 69050001 - 69059999 และ 69070001 - 69079999",
        seats: { total: 55, used: 29, remain: 26 },
      },
      {
        section: 923,
        type: "ทฤษฎี",
        timeSlot: {
          day: "พฤหัสบดี",
          startHour: 9,
          startMinute: 0,
          endHour: 12,
          endMinute: 0,
          timeStr: "09:00 - 12:00",
          room: "D-201 A",
          building: "พระเทพฯ-D",
        },
        instructors: ["อ. ธัญณัฐพรรณ สินถิรมั่น", "ดร. MANASHI DUTTA"],
        condition: "เฉพาะรหัสนักศึกษา 69050001 - 69059999 และ 69070001 - 69079999",
        seats: { total: 55, used: 21, remain: 34 },
      },
      {
        section: 924,
        type: "ทฤษฎี",
        timeSlot: {
          day: "พฤหัสบดี",
          startHour: 9,
          startMinute: 0,
          endHour: 12,
          endMinute: 0,
          timeStr: "09:00 - 12:00",
          room: "D-201 B",
          building: "พระเทพฯ-D",
        },
        instructors: ["อ. ธัญณัฐพรรณ สินถิรมั่น", "ดร. MANASHI DUTTA"],
        condition: "เฉพาะรหัสนักศึกษา 69050001 - 69059999 และ 69070001 - 69079999",
        seats: { total: 55, used: 21, remain: 34 },
      },
      {
        section: 925,
        type: "ทฤษฎี",
        timeSlot: {
          day: "พฤหัสบดี",
          startHour: 9,
          startMinute: 0,
          endHour: 12,
          endMinute: 0,
          timeStr: "09:00 - 12:00",
          room: "D-202 A",
          building: "พระเทพฯ-D",
        },
        instructors: ["อ. รัตนสุดา กิตติก้องนภางค์", "อ. สุรีรัตน์ ทองอินทร์"],
        condition: "เฉพาะรหัสนักศึกษา 69050001 - 69059999 และ 69070001 - 69079999",
        seats: { total: 55, used: 97, remain: 0 },
      },
      {
        section: 926,
        type: "ทฤษฎี",
        timeSlot: {
          day: "พฤหัสบดี",
          startHour: 9,
          startMinute: 0,
          endHour: 12,
          endMinute: 0,
          timeStr: "09:00 - 12:00",
          room: "D-202 B",
          building: "พระเทพฯ-D",
        },
        instructors: ["อ. รัตนสุดา กิตติก้องนภางค์", "อ. สุรีรัตน์ ทองอินทร์"],
        condition: "เฉพาะรหัสนักศึกษา 69050001 - 69059999 และ 69070001 - 69079999",
        seats: { total: 55, used: 24, remain: 31 },
      },
      {
        section: 927,
        type: "ทฤษฎี",
        timeSlot: {
          day: "พฤหัสบดี",
          startHour: 9,
          startMinute: 0,
          endHour: 12,
          endMinute: 0,
          timeStr: "09:00 - 12:00",
          room: "D-301 A",
          building: "พระเทพฯ-D",
        },
        instructors: ["อ. สิริรัตน์ ปัญญาสุขสกุล", "อ. นพนันท์ อะดุงเดชจรูญ"],
        condition: "เฉพาะรหัสนักศึกษา 69050001 - 69059999 และ 69070001 - 69079999",
        seats: { total: 55, used: 10, remain: 45 },
      },
      {
        section: 928,
        type: "ทฤษฎี",
        timeSlot: {
          day: "พฤหัสบดี",
          startHour: 9,
          startMinute: 0,
          endHour: 12,
          endMinute: 0,
          timeStr: "09:00 - 12:00",
          room: "D-301 B",
          building: "พระเทพฯ-D",
        },
        instructors: ["อ. สิริรัตน์ ปัญญาสุขสกุล", "อ. นพนันท์ อะดุงเดชจรูญ"],
        condition: "เฉพาะรหัสนักศึกษา 69050001 - 69059999 และ 69070001 - 69079999",
        seats: { total: 55, used: 9, remain: 46 },
      },
      {
        section: 929,
        type: "ทฤษฎี",
        timeSlot: {
          day: "พฤหัสบดี",
          startHour: 9,
          startMinute: 0,
          endHour: 12,
          endMinute: 0,
          timeStr: "09:00 - 12:00",
          room: "D-302 A",
          building: "พระเทพฯ-D",
        },
        instructors: ["ดร. หทัยมาตร เมฆนาคา", "อ. วรัญญา โรงคำ"],
        condition: "เฉพาะรหัสนักศึกษา 69050001 - 69059999 และ 69070001 - 69079999",
        seats: { total: 55, used: 15, remain: 40 },
      },
      {
        section: 930,
        type: "ทฤษฎี",
        timeSlot: {
          day: "พฤหัสบดี",
          startHour: 9,
          startMinute: 0,
          endHour: 12,
          endMinute: 0,
          timeStr: "09:00 - 12:00",
          room: "D-302 B",
          building: "พระเทพฯ-D",
        },
        instructors: ["ดร. หทัยมาตร เมฆนาคา", "อ. วรัญญา โรงคำ"],
        condition: "เฉพาะรหัสนักศึกษา 69050001 - 69059999 และ 69070001 - 69079999",
        seats: { total: 55, used: 6, remain: 49 },
      },
      {
        section: 931,
        type: "ทฤษฎี",
        timeSlot: {
          day: "พฤหัสบดี",
          startHour: 9,
          startMinute: 0,
          endHour: 12,
          endMinute: 0,
          timeStr: "09:00 - 12:00",
          room: "D-303 B",
          building: "พระเทพฯ-D",
        },
        instructors: ["อ. ยิหวามาดา ลิลา", "ผศ. ดร. มธุรดา จิโนรส"],
        condition: "เฉพาะรหัสนักศึกษา 69050001 - 69059999 และ 69070001 - 69079999",
        seats: { total: 55, used: 10, remain: 45 },
      },
    ],
  },
];

export const FACULTY_COURSES: TimetableCourse[] = Y1S2_COURSES.filter(
  (c) => c.category === "วิชาบังคับ",
);

export const GENED_COURSES: TimetableCourse[] = Y1S2_COURSES.filter(
  (c) => c.category === "วิชาเลือก / GenEd",
);

export const DEFAULT_SCHEDULE_SELECTIONS: UserScheduleSelection = {
  theory: {
    "06016408": 2, // OOP Mon 11:00-13:00
    "06066301": 2, // DSA Mon 14:00-16:00
    "06066001": 2, // PSTAT Tue 13:00-16:00
    "06066101": 2, // BFIT Wed 13:00-16:00
    "90641007": 602, // Digital Citizen Wed 09:00-12:00
    "90644008": 922, // Foundation English 2 Thu 09:00-12:00
  },
  lab: {
    "06016408": 5, // OOP Fri 11:00-13:00
    "06066301": 5, // DSA Fri 14:00-16:00
  },
};

/** Selectable GenEd Courses only (FE and Digital Citizen) */
export const SELECTABLE_GENED_COURSES = GENED_COURSES;
export const DEFAULT_GENED_SELECTIONS = DEFAULT_SCHEDULE_SELECTIONS;

export const SCHEDULE_PRESETS: SchedulePreset[] = [
  {
    id: "group-2",
    name: "กลุ่ม 2 (แนะนำ: ตื่นสายที่สุด / เลี่ยงตื่นเช้า)",
    badge: "ตื่นเช้า 2 วัน / เริ่มสาย 11:00 / เริ่มบ่าย 13:00",
    description:
      "สูตรตารางที่ดีที่สุดสำหรับคนไม่อยากตื่นเช้า: วันจันทร์และศุกร์เริ่มเรียน 11:00 น., วันอังคารเรียนบ่าย 13:00 น. คาบเดียว, ตื่นเช้า 09:00 น. เฉพาะวิชาบังคับ GenEd ในวันพุธและพฤหัสบดีเท่านั้น",
    recommended: true,
    selections: {
      theory: {
        "06016408": 2, // OOP Mon 11-13
        "06066301": 2, // DSA Mon 14-16
        "06066001": 2, // PSTAT Tue 13-16
        "06066101": 2, // BFIT Wed 13-16
        "90641007": 602, // DC Wed 09-12
        "90644008": 922, // FE2 Thu 09-12
      },
      lab: {
        "06016408": 5, // OOP Fri 11-13
        "06066301": 5, // DSA Fri 14-16
      },
    },
  },
  {
    id: "group-1",
    name: "กลุ่ม 1 (มาตรฐานรอบเช้า)",
    badge: "ตื่นเช้า 09:00 น. ทุกวัน (5 วัน)",
    description:
      "สูตรตารางเริ่มต้นของกลุ่ม 1: เรียนคาบแรก 09:00 น. ครบทั้ง 5 วัน เลิกเรียนเร็วช่วงบ่าย 13:00–16:00 น.",
    recommended: false,
    selections: {
      theory: {
        "06016408": 1, // OOP Mon 09-11
        "06066301": 1, // DSA Mon 11-13
        "06066001": 1, // PSTAT Tue 09-12
        "06066101": 1, // BFIT Tue 13-16
        "90641007": 601, // DC Wed 09-12
        "90644008": 921, // FE2 Thu 09-12
      },
      lab: {
        "06016408": 4, // OOP Fri 09-11
        "06066301": 4, // DSA Fri 11-13
      },
    },
  },
  {
    id: "group-3",
    name: "กลุ่ม 3 (มาตรฐานกลุ่ม 3)",
    badge: "ตื่นเช้า 5 วัน / มีช่วงว่าง 3 ชม.",
    description:
      "สูตรตารางเริ่มต้นของกลุ่ม 3: เริ่มเรียน 09:00 น. ทุกวัน และมีช่วงว่างเว้นช่วง 3 ชั่วโมงในวันจันทร์และวันศุกร์ (09:00–11:00 แล้วข้ามไป 14:00–16:00)",
    recommended: false,
    selections: {
      theory: {
        "06016408": 3, // OOP Mon 14-16
        "06066301": 3, // DSA Mon 09-11
        "06066001": 3, // PSTAT Wed 13-16
        "06066101": 3, // BFIT Tue 09-12
        "90641007": 603, // DC Wed 09-12
        "90644008": 923, // FE2 Thu 09-12
      },
      lab: {
        "06016408": 6, // OOP Fri 14-16
        "06066301": 6, // DSA Fri 09-11
      },
    },
  },
  {
    id: "hybrid-afternoon",
    name: "สลับช่วงบ่าย (Hybrid ทางเลือก)",
    badge: "ตื่นเช้า 2 วัน / สลับวิชาบ่าย",
    description:
      "ทางเลือกสำรองในกรณี Sec 2 ของบางวิชาเต็ม โดยสลับ BFIT มาวันอังคารบ่าย (Sec 1) และสลับ PSTAT ไปวันพุธบ่าย (Sec 3) ได้เวลาตื่นสายเหมือนกลุ่ม 2 ทุกประการ",
    recommended: false,
    selections: {
      theory: {
        "06016408": 2, // OOP Mon 11-13
        "06066301": 2, // DSA Mon 14-16
        "06066001": 3, // PSTAT Wed 13-16
        "06066101": 1, // BFIT Tue 13-16
        "90641007": 602, // DC Wed 09-12
        "90644008": 922, // FE2 Thu 09-12
      },
      lab: {
        "06016408": 5, // OOP Fri 11-13
        "06066301": 5, // DSA Fri 14-16
      },
    },
  },
];

export interface ScheduledClassSlot {
  courseCode: string;
  abbr: string;
  courseNameTh: string;
  courseNameEn: string;
  category: "วิชาบังคับ" | "วิชาเลือก / GenEd";
  section: number;
  type: "ทฤษฎี" | "ปฏิบัติ";
  day: DayOfWeek;
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
  timeStr: string;
  room: string;
  building: string;
  instructors: string[];
}

export function getScheduledSlots(
  selection: UserScheduleSelection,
  courses: TimetableCourse[] = Y1S2_COURSES,
): ScheduledClassSlot[] {
  const result: ScheduledClassSlot[] = [];

  for (const course of courses) {
    const theorySecNum = selection.theory[course.code];
    if (theorySecNum !== undefined) {
      const sec = course.sections.find(
        (s) => s.section === theorySecNum && s.type === "ทฤษฎี",
      );
      if (sec) {
        result.push({
          courseCode: course.code,
          abbr: course.abbr || getCourseAbbr(course.code),
          courseNameTh: course.nameTh,
          courseNameEn: course.nameEn,
          category: course.category,
          section: sec.section,
          type: sec.type,
          day: sec.timeSlot.day,
          startHour: sec.timeSlot.startHour,
          startMinute: sec.timeSlot.startMinute,
          endHour: sec.timeSlot.endHour,
          endMinute: sec.timeSlot.endMinute,
          timeStr: sec.timeSlot.timeStr,
          room: sec.timeSlot.room,
          building: sec.timeSlot.building,
          instructors: sec.instructors,
        });
      }
    }

    if (course.hasLab) {
      const labSecNum = selection.lab[course.code];
      if (labSecNum !== undefined) {
        const sec = course.sections.find(
          (s) => s.section === labSecNum && s.type === "ปฏิบัติ",
        );
        if (sec) {
          result.push({
            courseCode: course.code,
            abbr: course.abbr || getCourseAbbr(course.code),
            courseNameTh: course.nameTh,
            courseNameEn: course.nameEn,
            category: course.category,
            section: sec.section,
            type: sec.type,
            day: sec.timeSlot.day,
            startHour: sec.timeSlot.startHour,
            startMinute: sec.timeSlot.startMinute,
            endHour: sec.timeSlot.endHour,
            endMinute: sec.timeSlot.endMinute,
            timeStr: sec.timeSlot.timeStr,
            room: sec.timeSlot.room,
            building: sec.timeSlot.building,
            instructors: sec.instructors,
          });
        }
      }
    }
  }

  return result;
}

export function detectScheduleClashes(
  slots: ScheduledClassSlot[],
): ScheduleConflict[] {
  const conflicts: ScheduleConflict[] = [];

  for (let i = 0; i < slots.length; i++) {
    for (let j = i + 1; j < slots.length; j++) {
      const s1 = slots[i];
      const s2 = slots[j];

      if (s1.day === s2.day) {
        const s1Start = s1.startHour * 60 + s1.startMinute;
        const s1End = s1.endHour * 60 + s1.endMinute;
        const s2Start = s2.startHour * 60 + s2.startMinute;
        const s2End = s2.endHour * 60 + s2.endMinute;

        if (Math.max(s1Start, s2Start) < Math.min(s1End, s2End)) {
          conflicts.push({
            type: "class_overlap",
            courseCodeA: s1.courseCode,
            courseCodeB: s2.courseCode,
            courseNameA: `${s1.courseNameEn} (${s1.type} Sec ${s1.section})`,
            courseNameB: `${s2.courseNameEn} (${s2.type} Sec ${s2.section})`,
            details: `เวลาเรียนชนกันในวัน${s1.day}: ${s1.timeStr} กับ ${s2.timeStr}`,
          });
        }
      }
    }
  }

  return conflicts;
}

export function calculateScheduleStats(
  slots: ScheduledClassSlot[],
  courses: TimetableCourse[] = Y1S2_COURSES,
): ScheduleStats {
  const dailyEarliest: Record<DayOfWeek, string | null> = {
    จันทร์: null,
    อังคาร: null,
    พุธ: null,
    พฤหัสบดี: null,
    ศุกร์: null,
  };

  const dailyHasAfternoonClass: Record<DayOfWeek, boolean> = {
    จันทร์: false,
    อังคาร: false,
    พุธ: false,
    พฤหัสบดี: false,
    ศุกร์: false,
  };

  for (const day of DAYS_OF_WEEK) {
    const daySlots = slots.filter((s) => s.day === day);
    if (daySlots.length > 0) {
      const minHour = Math.min(...daySlots.map((s) => s.startHour));
      dailyEarliest[day] = `${String(minHour).padStart(2, "0")}:00`;

      const hasAfternoon = daySlots.some((s) => s.endHour > 12);
      dailyHasAfternoonClass[day] = hasAfternoon;
    }
  }

  let morningDays = 0;
  let lateDays = 0;
  let afternoonDays = 0;
  let afternoonOffDays = 0;

  for (const day of DAYS_OF_WEEK) {
    const earliest = dailyEarliest[day];
    if (earliest) {
      if (earliest === "09:00") morningDays++;
      else if (earliest === "11:00") lateDays++;
      else if (parseInt(earliest, 10) >= 13) afternoonDays++;

      if (!dailyHasAfternoonClass[day]) {
        afternoonOffDays++;
      }
    }
  }

  const totalCredits = courses.reduce((acc, c) => acc + c.creditHours, 0);

  return {
    totalCredits,
    morningDays,
    lateDays,
    afternoonDays,
    afternoonOffDays,
    dailyEarliest,
  };
}

export function exportScheduleAsJson(
  selection: UserScheduleSelection,
  courses: TimetableCourse[] = Y1S2_COURSES,
  termInfo?: SemesterTermInfo,
): string {
  const slots = getScheduledSlots(selection, courses);
  const stats = calculateScheduleStats(slots, courses);
  const conflicts = detectScheduleClashes(slots);

  const payload = {
    semester: termInfo ? `${termInfo.semester}/${termInfo.academicYear}` : "2/2569",
    faculty: termInfo ? `คณะ${termInfo.faculty}` : "คณะเทคโนโลยีสารสนเทศ",
    program: termInfo
      ? `${termInfo.department} (${termInfo.subtitleTh})`
      : "เทคโนโลยีสารสนเทศ (ชั้นปีที่ 1)",
    totalCredits: stats.totalCredits,
    stats: {
      morningDaysCount: stats.morningDays,
      lateStartsCount: stats.lateDays,
      afternoonStartsCount: stats.afternoonDays,
      afternoonOffDaysCount: stats.afternoonOffDays,
      dailyStartTime: stats.dailyEarliest,
    },
    hasConflicts: conflicts.length > 0,
    conflicts,
    registeredClasses: slots.map((s) => ({
      courseCode: s.courseCode,
      courseNameTh: s.courseNameTh,
      courseNameEn: s.courseNameEn,
      category: s.category,
      section: s.section,
      type: s.type,
      day: s.day,
      time: s.timeStr,
      room: s.room,
      building: s.building,
      instructors: s.instructors,
    })),
  };

  return JSON.stringify(payload, null, 2);
}

export function exportScheduleAsCsv(
  selection: UserScheduleSelection,
  courses: TimetableCourse[] = Y1S2_COURSES,
): string {
  const slots = getScheduledSlots(selection, courses);
  const rows = [
    [
      "CourseCode",
      "CourseNameTh",
      "CourseNameEn",
      "Category",
      "Section",
      "Type",
      "Day",
      "Time",
      "Room",
      "Building",
      "Instructors",
    ],
    ...slots.map((s) => [
      s.courseCode,
      `"${s.courseNameTh}"`,
      `"${s.courseNameEn}"`,
      `"${s.category}"`,
      String(s.section),
      `"${s.type}"`,
      `"${s.day}"`,
      `"${s.timeStr}"`,
      `"${s.room}"`,
      `"${s.building}"`,
      `"${s.instructors.join(", ")}"`,
    ]),
  ];

  return rows.map((r) => r.join(",")).join("\n");
}
