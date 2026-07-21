import type { LText } from "@/lib/i18n";

export interface Contributor {
  name: string;
  github: string; // handle, no @
}

export type ChangeKind = "added" | "changed" | "fixed";

export interface ChangeEntry {
  kind: ChangeKind;
  text: LText;
}

export interface VersionEntry {
  version: string; // e.g. "0.3.0", or "Unreleased"
  date: string | null; // ISO date, null for Unreleased
  contributors: Contributor[];
  changes: ChangeEntry[];
}

// Mirrors CHANGELOG.md at the repo root — keep both in sync when releasing.
export const CHANGELOG: VersionEntry[] = [
  {
    version: "0.4.0",
    date: "2026-07-21",
    contributors: [
      { name: "Meaookung144", github: "Meaookung144" },
      { name: "Chatan Petry", github: "Jesselpetry" },
    ],
    changes: [
      {
        kind: "added",
        text: {
          th: "ระบบเชื่อมต่อ GitHub (OAuth) และ Push ไฟล์ submission.md / ai_reflection.md เข้า Repository โดยตรง",
          en: "Direct GitHub integration (OAuth) to push submission.md / ai_reflection.md to repositories",
        },
      },
      {
        kind: "added",
        text: {
          th: "ตัวแก้ไขไฟล์ออนไลน์ (/repo) สำหรับแก้ไขและดูตัวอย่างไฟล์ก่อน Push",
          en: "Online file editor (/repo) to inspect and edit repository files before pushing",
        },
      },
      {
        kind: "added",
        text: {
          th: "หน้าประวัติเวอร์ชัน (/version) และการบันทึก Changelog ของโปรเจกต์",
          en: "Version history page (/version) and project Changelog tracking",
        },
      },
      {
        kind: "changed",
        text: {
          th: "ปรับปรุง UI ส่วน GitHub Push และ Wizard ขั้นตอน 1–10 ให้ใช้ง่ายขึ้น",
          en: "Improved GitHub Push UI and step 1–10 wizard navigation",
        },
      },
      {
        kind: "fixed",
        text: {
          th: "แก้ไขการทำงานของ Folder Component ในหน้าจัดการ Repository",
          en: "Fixed folder tree component handling in the repo editor",
        },
      },
    ],
  },
  {
    version: "0.3.0",
    date: "2026-07-20",
    contributors: [{ name: "Chatan Petry", github: "Jesselpetry" }],
    changes: [
      {
        kind: "added",
        text: {
          th: "ระบบสลับธีม (light / dark) พร้อมปุ่ม toggle แบบมี animation",
          en: "Light / dark theme system with an animated toggle button",
        },
      },
    ],
  },
  {
    version: "0.2.0",
    date: "2026-07-18",
    contributors: [{ name: "Chatan Petry", github: "Jesselpetry" }],
    changes: [
      {
        kind: "added",
        text: { th: "ประกาศเปิดโจทย์ Week 3", en: "Announced Week 3 problems" },
      },
      {
        kind: "changed",
        text: {
          th: "ปรับการเรียงลำดับโจทย์และทางลัดประจำสัปดาห์",
          en: "Improved problem sorting and weekly shortcuts",
        },
      },
      {
        kind: "changed",
        text: {
          th: "อัปเดตรายการโจทย์ใน data/oj_problems.json",
          en: "Updated the problem list in data/oj_problems.json",
        },
      },
    ],
  },
  {
    version: "0.1.1",
    date: "2026-07-13",
    contributors: [{ name: "Chatan Petry", github: "Jesselpetry" }],
    changes: [
      {
        kind: "changed",
        text: {
          th: "ต้องกดยืนยันว่าอ่านเนื้อหาแล้วก่อนดาวน์โหลดไฟล์ submission.md / ai_reflection.md",
          en: "Downloads now require confirming you've read the file first",
        },
      },
    ],
  },
  {
    version: "0.1.0",
    date: "2026-07-12",
    contributors: [{ name: "Chatan Petry", github: "Jesselpetry" }],
    changes: [
      {
        kind: "added",
        text: {
          th: "Wizard ทีละขั้นตอนสำหรับสร้าง submission.md / ai_reflection.md",
          en: "Step-by-step wizard for generating submission.md / ai_reflection.md",
        },
      },
      {
        kind: "added",
        text: {
          th: "รายการโจทย์พร้อมระดับความยาก วันหมดเขต และแท็บกรองรายสัปดาห์",
          en: "Problem list with difficulty, expiry date, and weekly filter tabs",
        },
      },
      {
        kind: "added",
        text: { th: "หน้า /library — อ่านเอกสาร AI-Guidelines-PSCP", en: "/library page for reading the AI-Guidelines-PSCP docs" },
      },
      {
        kind: "added",
        text: {
          th: "หน้า /history — เก็บประวัติไฟล์ที่เคยสร้างไว้ในเครื่อง",
          en: "/history page storing previously generated files locally",
        },
      },
      {
        kind: "added",
        text: {
          th: "แบบร่างบันทึกอัตโนมัติแยกตามโจทย์ และ splash screen",
          en: "Auto-saved drafts per problem, plus a splash screen",
        },
      },
      {
        kind: "changed",
        text: {
          th: "ปรับสีทั่วเว็บให้ผ่านมาตรฐาน WCAG AA contrast",
          en: "Adjusted colors site-wide to meet WCAG AA contrast",
        },
      },
      {
        kind: "fixed",
        text: { th: "แก้ไอคอน Instagram และ case ของข้อความบางจุด", en: "Fixed the Instagram icon and some text casing" },
      },
    ],
  },
];
