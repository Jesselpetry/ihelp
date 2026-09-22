import type { LText } from "@/lib/i18n";

// Course shortcuts shown on the home page. Edit this list to add/remove links.
export interface Shortcut {
  title: LText;
  description: LText;
  href: string;
  // deadline/lab date the shortcut relates to, shown as a badge (dd/mm/yyyy)
  date?: string;
}

export const SHORTCUTS: Shortcut[] = [
  {
    title: {
      th: "รายชื่อคู่ Pair — Week 7 (สัปดาห์สุดท้าย)",
      en: "Pair list — Week 7 (Final Week)",
    },
    description: {
      th: "สัปดาห์สุดท้ายของ pair programming! ดูรายชื่อเพื่อนร่วมสนุกสำหรับ Lab 14/08/2026 ที่แท็บ \"week 7\" ด้านล่าง (ใช้อีเมลสถาบัน 69070XXX@kmitl.ac.th)",
      en: "Final week of pair programming! Check your pairing for the lab of 14/08/2026 in the \"week 7\" tab (use institute email 69070XXX@kmitl.ac.th)",
    },
    href: "https://docs.google.com/spreadsheets/d/15d46ZMJbPUtVPoiHoin5-wk6v94L6_l-X9vsi0VI688/edit?usp=sharing",
    date: "14/08/2026",
  },
  {
    title: {
      th: "Feedback Form — Pair Programming Week 6",
      en: "Feedback Form — Pair Programming Week 6",
    },
    description: {
      th: "ฟอร์มเช็คชื่อ/ประเมินผล Pair programming week 6 (07/08/2026) คนที่ไม่ได้ทำมีตัวเลือก \"ไม่ได้ทำ\" (ใช้อีเมลสถาบัน 69070XXX@kmitl.ac.th)",
      en: "Attendance & feedback form for Pair programming week 6 (07/08/2026). Options available for absentees (use institute email)",
    },
    href: "https://forms.gle/2UPTCgeDJGaRmLMg9",
    date: "07/08/2026",
  },
];
