import type { LText } from "@/lib/i18n";

export type QuickNavIconName =
  | "calculator"
  | "calendar-clock"
  | "terminal"
  | "compass"
  | "cpu";

export interface QuickNavPillItem {
  id: string;
  href: string;
  label: LText;
  description?: LText;
  icon: QuickNavIconName;
  badge?: LText;
}

export const QUICK_NAV_TITLE: LText = {
  th: "บริการและเครื่องมือด่วน",
  en: "Quick Services & Tools",
};

export const QUICK_NAV_SUBTITLE: LText = {
  th: "ทางลัดสู่ระบบคำนวณเกรด จัดตารางเรียน คลังโจทย์โปรแกรมมิ่ง และผังที่นั่งสอบ",
  en: "Direct access to GPA simulator, schedule planner, coding workspace, and exam seating",
};

export const QUICK_NAV_PILL_ITEMS: QuickNavPillItem[] = [
  {
    id: "grades",
    href: "/grades",
    label: { th: "คำนวณเกรด & GPAX", en: "Grade & Score Calculator" },
    description: { th: "จำลองผลการเรียนและเป้าหมาย Final", en: "Simulate GPAX and target final scores" },
    icon: "calculator",
    badge: { th: "Tool", en: "Tool" },
  },
  {
    id: "schedule",
    href: "/schedule",
    label: { th: "จำลอง & จัดตารางเรียน", en: "Timetable & Schedule" },
    description: { th: "เลือก Section และตรวจวิชาชน", en: "Section planner and clash detection" },
    icon: "calendar-clock",
    badge: { th: "Y1·S2", en: "Y1·S2" },
  },
  {
    id: "pscp",
    href: "/pscp",
    label: { th: "คลังโจทย์ PSCP Lab", en: "PSCP Coding Workspace" },
    description: { th: "โจทย์ iJudge 100+ ข้อและตัวรันโค้ด", en: "100+ iJudge problems & test runner" },
    icon: "terminal",
    badge: { th: "OJ", en: "OJ" },
  },
  {
    id: "exam-schedule",
    href: "/exam-schedule/archive",
    label: { th: "ผังที่นั่งสอบรายบุคคล", en: "Exam Seating Locator" },
    description: { th: "ค้นหาห้องสอบด้วยรหัส 8 หลัก", en: "Search seating by 8-digit student ID" },
    icon: "compass",
    badge: { th: "Exam", en: "Exam" },
  },
  {
    id: "docs",
    href: "/docs",
    label: { th: "Developer", en: "Developer" },
    description: { th: "พิมพ์เขียวและคู่มือสถาปัตยกรรมระบบ", en: "System architecture blueprints & docs" },
    icon: "cpu",
    badge: { th: "Docs", en: "Docs" },
  },
];
