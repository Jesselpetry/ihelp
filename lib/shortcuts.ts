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
      th: "Feedback form — Pair Programming Week 3",
      en: "Feedback form — Pair Programming Week 3",
    },
    description: {
      th: "ฟอร์มเช็คชื่อเข้า pair programming (Lab 17/07/2026)",
      en: "Attendance check-in form for pair programming (lab of 17/07/2026)",
    },
    href: "https://forms.gle/FYWmH5Rc7jiyMLkZ9",
    date: "17/07/2026",
  },
  {
    title: {
      th: "รายชื่อคู่ Pair — Week 3",
      en: "Pair list — Week 3",
    },
    description: {
      th: "ตารางรายชื่อคู่ pair programming สำหรับ Lab 17/07/2026",
      en: "Pair programming pairings for the lab of 17/07/2026",
    },
    href: "https://docs.google.com/spreadsheets/d/15d46ZMJbPUtVPoiHoin5-wk6v94L6_l-X9vsi0VI688/edit?usp=sharing",
    date: "17/07/2026",
  },
];
