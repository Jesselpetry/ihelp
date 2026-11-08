import type { LText } from "@/lib/i18n";

export interface PscpWeekMeta {
  week: number;
  scope: "midterm" | "final";
  title: LText;
}

export const PSCP_WEEKS: readonly PscpWeekMeta[] = [
  { week: 1, scope: "midterm", title: { th: "การแก้ปัญหาและผังงาน", en: "Problem Solving & Flowcharts" } },
  { week: 2, scope: "midterm", title: { th: "พื้นฐาน Python ตัวแปร และการจัดรูปแบบ", en: "Python Basics, Variables & Formatting" } },
  { week: 3, scope: "midterm", title: { th: "การทำงานแบบมีเงื่อนไข", en: "Conditionals & Boolean Logic" } },
  { week: 4, scope: "midterm", title: { th: "การทำงานซ้ำ ลูป และตัวสะสมค่า", en: "Loops, While, For & Range" } },
  { week: 5, scope: "midterm", title: { th: "สตริงและการแบ่งส่วน", en: "Strings, Slicing & Methods" } },
  { week: 6, scope: "midterm", title: { th: "ฟังก์ชันและขอบเขตตัวแปร", en: "Functions, Parameters & Scope" } },
  { week: 7, scope: "midterm", title: { th: "ทบทวนสอบกลางภาคและการไล่โค้ด", en: "Midterm Review & Code Tracing" } },
  { week: 8, scope: "final", title: { th: "ลูปซ้อนลูปและพิมพ์ลวดลาย 2 มิติ", en: "Nested Loops & Pattern Printing" } },
  { week: 9, scope: "final", title: { th: "ลิสต์และการจำลองระบบ", en: "Lists, Slicing & Simulation" } },
  { week: 10, scope: "final", title: { th: "ทูเพิลและการกรองความถี่", en: "Tuples, Duplication & Filtering" } },
  { week: 11, scope: "final", title: { th: "ลิสต์ 2 มิติและเมทริกซ์", en: "2D Lists & Matrices" } },
  { week: 12, scope: "final", title: { th: "ดิกชันนารีและเซต", en: "Dictionaries & Sets" } },
  { week: 13, scope: "final", title: { th: "การเรียกซ้ำและจัดการไฟล์", en: "Recursion & File I/O" } },
  { week: 14, scope: "final", title: { th: "อัลกอริทึมเรียงลำดับและการค้นหา", en: "Sorting & Searching Algorithms" } },
];
