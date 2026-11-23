import type {
  DayOfWeek,
  ScheduleConflict,
  SchedulePreset,
  ScheduleStats,
  TimetableCourse,
  UserScheduleSelection,
} from "./types";

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
    nameTh: "การเขียนโปรแกรมเชิงวัตถุ",
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
        condition: "กลุ่ม 1 (เฉพาะรหัส 67070235)",
        seats: { total: 73, used: 0, remain: 0 },
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
        condition: "กลุ่ม 2 (เฉพาะรหัส 67070235)",
        seats: { total: 73, used: 0, remain: 0 },
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
        condition: "กลุ่ม 3 (เฉพาะรหัส 67070235)",
        seats: { total: 73, used: 0, remain: 0 },
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
        condition: "กลุ่ม 1 (เฉพาะรหัส 67070235)",
        seats: { total: 73, used: 0, remain: 0 },
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
        condition: "กลุ่ม 2 (เฉพาะรหัส 67070235)",
        seats: { total: 73, used: 0, remain: 0 },
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
        condition: "กลุ่ม 3 (เฉพาะรหัส 67070235)",
        seats: { total: 73, used: 0, remain: 0 },
      },
    ],
  },
  {
    code: "06066001",
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
        condition: "กลุ่ม 1 (เฉพาะรหัส 69070001)",
        seats: { total: 71, used: 0, remain: 0 },
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
        condition: "กลุ่ม 2 (เฉพาะรหัส 69070100)",
        seats: { total: 71, used: 0, remain: 0 },
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
        condition: "กลุ่ม 3 (เฉพาะรหัส 69070203)",
        seats: { total: 71, used: 0, remain: 0 },
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
        condition: "รับเฉพาะนักศึกษาเก็บตก IT 3-5",
        seats: { total: 22, used: 0, remain: 0 },
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
        condition: "รับเฉพาะนักศึกษาเก็บตก IT 3-5",
        seats: { total: 22, used: 0, remain: 0 },
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
        condition: "รับเฉพาะนักศึกษาเก็บตก IT 3-5",
        seats: { total: 22, used: 0, remain: 0 },
      },
    ],
  },
  {
    code: "06066101",
    nameTh: "พื้นฐานธุรกิจสำหรับเทคโนโลยีสารสนเทศ",
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
        condition: "กลุ่ม 1 (เฉพาะรหัส 66070257)",
        seats: { total: 77, used: 0, remain: 0 },
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
        condition: "กลุ่ม 2 (เฉพาะรหัส 66070257)",
        seats: { total: 77, used: 0, remain: 0 },
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
        condition: "กลุ่ม 3 (เฉพาะรหัส 66070257)",
        seats: { total: 77, used: 0, remain: 0 },
      },
    ],
  },
  {
    code: "06066301",
    nameTh: "โครงสร้างข้อมูลและขั้นตอนวิธี",
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
        condition: "กลุ่ม 1 (เฉพาะรหัส 67070011)",
        seats: { total: 78, used: 0, remain: 0 },
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
        condition: "กลุ่ม 2 (เฉพาะรหัส 67070011)",
        seats: { total: 78, used: 0, remain: 0 },
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
        condition: "กลุ่ม 3 (เฉพาะรหัส 67070011)",
        seats: { total: 78, used: 0, remain: 0 },
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
        condition: "กลุ่ม 1 (เฉพาะรหัส 67070011)",
        seats: { total: 78, used: 0, remain: 0 },
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
        condition: "กลุ่ม 2 (เฉพาะรหัส 67070011)",
        seats: { total: 78, used: 0, remain: 0 },
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
        condition: "กลุ่ม 3 (เฉพาะรหัส 67070011)",
        seats: { total: 78, used: 0, remain: 0 },
      },
    ],
  },
  {
    code: "90641007",
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
        condition: "ช่วงรหัส 69070001 - 69079999",
        seats: { total: 83, used: 0, remain: 0 },
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
        condition: "ช่วงรหัส 69070001 - 69079999",
        seats: { total: 83, used: 0, remain: 0 },
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
        condition: "ช่วงรหัส 69070001 - 69079999",
        seats: { total: 83, used: 0, remain: 0 },
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
        condition: "ช่วงรหัส 69070001 - 69079999",
        seats: { total: 83, used: 0, remain: 0 },
      },
    ],
  },
  {
    code: "90644008",
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
        condition: "ช่วงรหัส 69050001 - 69059999 / IT ปี 1",
        seats: { total: 55, used: 0, remain: 0 },
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
        condition: "ช่วงรหัส 69050001 - 69059999 / IT ปี 1",
        seats: { total: 55, used: 0, remain: 0 },
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
        condition: "ช่วงรหัส 69050001 - 69059999 / IT ปี 1",
        seats: { total: 55, used: 0, remain: 0 },
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
        condition: "ช่วงรหัส 69050001 - 69059999 / IT ปี 1",
        seats: { total: 55, used: 0, remain: 0 },
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
        condition: "ช่วงรหัส 69050001 - 69059999 / IT ปี 1",
        seats: { total: 55, used: 0, remain: 0 },
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
        condition: "ช่วงรหัส 69050001 - 69059999 / IT ปี 1",
        seats: { total: 55, used: 0, remain: 0 },
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
        condition: "ช่วงรหัส 69050001 - 69059999 / IT ปี 1",
        seats: { total: 55, used: 0, remain: 0 },
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
        condition: "ช่วงรหัส 69050001 - 69059999 / IT ปี 1",
        seats: { total: 55, used: 0, remain: 0 },
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
        condition: "ช่วงรหัส 69050001 - 69059999 / IT ปี 1",
        seats: { total: 55, used: 0, remain: 0 },
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
        condition: "ช่วงรหัส 69050001 - 69059999 / IT ปี 1",
        seats: { total: 55, used: 0, remain: 0 },
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
        condition: "ช่วงรหัส 69050001 - 69059999 / IT ปี 1",
        seats: { total: 55, used: 0, remain: 0 },
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
    "06066001": 2, // ProbStat Tue 13:00-16:00
    "06066101": 2, // BizFund Wed 13:00-16:00
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
        "06016408": 2, // Mon 11-13
        "06066301": 2, // Mon 14-16
        "06066001": 2, // Tue 13-16
        "06066101": 2, // Wed 13-16
        "90641007": 602, // Wed 09-12
        "90644008": 922, // Thu 09-12
      },
      lab: {
        "06016408": 5, // Fri 11-13
        "06066301": 5, // Fri 14-16
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
        "06016408": 1, // Mon 09-11
        "06066301": 1, // Mon 11-13
        "06066001": 1, // Tue 09-12
        "06066101": 1, // Tue 13-16
        "90641007": 601, // Wed 09-12
        "90644008": 921, // Thu 09-12
      },
      lab: {
        "06016408": 4, // Fri 09-11
        "06066301": 4, // Fri 11-13
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
        "06016408": 3, // Mon 14-16
        "06066301": 3, // Mon 09-11
        "06066001": 3, // Wed 13-16
        "06066101": 3, // Tue 09-12
        "90641007": 603, // Wed 09-12
        "90644008": 923, // Thu 09-12
      },
      lab: {
        "06016408": 6, // Fri 14-16
        "06066301": 6, // Fri 09-11
      },
    },
  },
  {
    id: "hybrid-afternoon",
    name: "สลับช่วงบ่าย (Hybrid ทางเลือก)",
    badge: "ตื่นเช้า 2 วัน / สลับวิชาบ่าย",
    description:
      "ทางเลือกสำรองในกรณี Sec 2 ของบางวิชาเต็ม โดยสลับ Business Fundamentals มาวันอังคารบ่าย (Sec 1) และสลับ Prob & Stat ไปวันพุธบ่าย (Sec 3) ได้เวลาตื่นสายเหมือนกลุ่ม 2 ทุกประการ",
    recommended: false,
    selections: {
      theory: {
        "06016408": 2, // Mon 11-13
        "06066301": 2, // Mon 14-16
        "06066001": 3, // Wed 13-16
        "06066101": 1, // Tue 13-16
        "90641007": 602, // Wed 09-12
        "90644008": 922, // Thu 09-12
      },
      lab: {
        "06016408": 5, // Fri 11-13
        "06066301": 5, // Fri 14-16
      },
    },
  },
];

export interface ScheduledClassSlot {
  courseCode: string;
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
): string {
  const slots = getScheduledSlots(selection, courses);
  const stats = calculateScheduleStats(slots, courses);
  const conflicts = detectScheduleClashes(slots);

  const payload = {
    semester: "2/2569",
    faculty: "คณะเทคโนโลยีสารสนเทศ",
    program: "เทคโนโลยีสารสนเทศ (ชั้นปีที่ 1)",
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
