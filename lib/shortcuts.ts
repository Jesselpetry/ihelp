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
      th: "รายชื่อคู่ Pair — Week 4",
      en: "Pair list — Week 4",
    },
    description: {
      th: "ตารางรายชื่อคู่ pair programming สำหรับ Lab 24/07/2026 (เข้าด้วยอีเมลสถาบัน 69070XXX@kmitl.ac.th)",
      en: "Pair programming pairings for the lab of 24/07/2026 (use your institute email 69070XXX@kmitl.ac.th)",
    },
    href: "https://docs.google.com/spreadsheets/d/15d46ZMJbPUtVPoiHoin5-wk6v94L6_l-X9vsi0VI688/edit?usp=sharing",
    date: "24/07/2026",
  },
  {
    title: {
      th: "รายชื่อ Code Interview ครั้งที่ 1",
      en: "Code Interview #1 list",
    },
    description: {
      th: "เช็กชื่อ Code Interview ครั้งที่ 1 ที่แท็บ \"Code Interview\" ในชีตเดียวกัน (Lab 24/07/2026, อีเมลสถาบันเท่านั้น)",
      en: "Check the Code Interview #1 roster in the \"Code Interview\" tab of the same sheet (lab of 24/07/2026, institute email only)",
    },
    href: "https://docs.google.com/spreadsheets/d/15d46ZMJbPUtVPoiHoin5-wk6v94L6_l-X9vsi0VI688/edit?usp=sharing",
    date: "24/07/2026",
  },
];
