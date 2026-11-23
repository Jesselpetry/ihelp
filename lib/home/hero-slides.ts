import type { LText } from "@/lib/i18n";

export type HeroIconName =
  | "sparkles"
  | "calculator"
  | "calendar"
  | "arrow-right"
  | "trending-up";

export interface HeroCta {
  label: LText;
  href: string;
  icon?: HeroIconName;
  external?: boolean;
}

export interface HeroSlide {
  id: string;
  badge: LText;
  badgeIcon?: HeroIconName;
  title: LText;
  description: LText;
  cta: HeroCta;
  secondaryCta?: {
    label: LText;
    href: string;
    external?: boolean;
  };
  watermarkCode?: string;
}

export const HERO_SLIDES: HeroSlide[] = [
  // ── Slide 1: Welcome & Active Term Y1-S2 Study Portal ─────────────────────
  {
    id: "active-term-y1s2",
    badge: {
      th: "ภาคการศึกษา 2/2569 · กำลังศึกษา",
      en: "Term 2/2026 · Active Study Portal",
    },
    badgeIcon: "sparkles",
    title: {
      th: "ศูนย์รวมการเรียนรู้ IT KMITL ชั้นปีที่ 1",
      en: "IT KMITL Year 1 Core Learning Hub",
    },
    description: {
      th: "รวมสรุปเนื้อหา คลังข้อสอบเก่า เอกสารบรรยาย และโจทย์ฝึกเขียนโปรแกรมครบทุกวิชาหลัก BFIT, DSA, OOP และ PSTAT พร้อมระบบตรวจทานมาตรฐาน",
      en: "Comprehensive lecture summaries, past exams, slides, and algorithmic problem banks for BFIT, DSA, OOP, and PSTAT.",
    },
    cta: {
      label: { th: "สำรวจรายวิชาทั้งหมด", en: "Explore All Courses" },
      href: "#courses-library",
      icon: "arrow-right",
    },
    secondaryCta: {
      label: { th: "คลังโจทย์ PSCP", en: "PSCP Workspace" },
      href: "/pscp",
    },
    watermarkCode: "IT",
  },

  // ── Slide 2: Grade & Exam Score Calculator ────────────────────────────────
  {
    id: "grade-calculator",
    badge: {
      th: "เครื่องมือคำนวณเกรด & วิเคราะห์คะแนน",
      en: "GPA & Score Projection Engine",
    },
    badgeIcon: "calculator",
    title: {
      th: "คำนวณเกรดและจำลองเป้าหมาย GPA",
      en: "Grade Calculator & Target Simulator",
    },
    description: {
      th: "วางแผนคะแนนสอบปลายภาคด้วย Safe Math Parser (เช่น 10+5+8.5) พร้อม Preset สัดส่วนคะแนนจริง Y1-S1/S2 และฟังก์ชันฉายภาพเกรดขั้นต่ำที่ต้องการ",
      en: "Project required final scores with safe arithmetic parser (10+5+8.5), exact syllabus weight presets, and letter/S-U target cutoffs.",
    },
    cta: {
      label: { th: "คำนวณเกรดของคุณ", en: "Calculate Grades" },
      href: "/grades",
      icon: "trending-up",
    },
    secondaryCta: {
      label: { th: "ตารางเรียน", en: "Timetable" },
      href: "/schedule",
    },
    watermarkCode: "IT",
  },

  // ── Slide 3: Class Timetable & Exam Room Seating ───────────────────────────
  {
    id: "schedule-and-seating",
    badge: {
      th: "ตารางเรียน & ค้นหาผังที่นั่งสอบ",
      en: "Timetable & Exam Seating Locator",
    },
    badgeIcon: "calendar",
    title: {
      th: "จัดตารางเรียนและค้นหาที่นั่งสอบรายบุคคล",
      en: "Class Timetable & Room Seating Maps",
    },
    description: {
      th: "ระบบวางแผนตารางเรียน ตรวจสอบเวลาเรียนชนกัน เลือก Section ที่ใช่ พร้อมระบบค้นหาเลขที่นั่งสอบแบบ Interactive ด้วยรหัสนักศึกษา 8 หลัก",
      en: "Plan weekly schedules with conflict detection, simulate sleep routines, and find exact exam room seats via 8-digit student ID.",
    },
    cta: {
      label: { th: "วางแผนตารางเรียน", en: "Plan Timetable" },
      href: "/schedule",
      icon: "calendar",
    },
    secondaryCta: {
      label: { th: "ผังที่นั่งสอบ", en: "Exam Seating" },
      href: "/exam-schedule/archive",
    },
    watermarkCode: "IT",
  },
];
