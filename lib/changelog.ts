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
    version: "Unreleased",
    date: null,
    contributors: [{ name: "Chatan Petry", github: "Jesselpetry" }],
    changes: [
      {
        kind: "added",
        text: {
          th: "นำเข้าสื่อการเรียนปี 1 ทั้งหมดจากคลัง kmitl-archive — 670 ไฟล์ ครอบคลุม 13 รายวิชาทั้งเทอม 1 และเทอม 2",
          en: "Ingested the full Year-1 media set from kmitl-archive — 670 files across 13 subjects, both semesters",
        },
      },
      {
        kind: "added",
        text: {
          th: "คลังทรัพยากรสร้างการ์ดจากไฟล์อัตโนมัติ — วางไฟล์ลง public/assets/ ตามกติกาแล้วขึ้นเว็บทันที ไม่ต้องเขียน entry มือ",
          en: "The Media Library now generates cards from the file tree — drop a file into public/assets/ and it appears without a hand-written entry",
        },
      },
      {
        kind: "added",
        text: {
          th: "workflow _dropzone/ — วางไฟล์ที่ยังไม่ได้จัดหมวด แล้วให้ AI agent จัดให้ตาม docs/DROPZONE_SOP.md",
          en: "The _dropzone/ workflow — drop unsorted files and let an AI agent file them per docs/DROPZONE_SOP.md",
        },
      },
      {
        kind: "added",
        text: {
          th: "เอกสาร FILE_STRUCTURE.md — กติกา path การตั้งชื่อไฟล์ และ taxonomy กลางภาค/ปลายภาค",
          en: "FILE_STRUCTURE.md — path rules, filename conventions, and the midterm/final taxonomy",
        },
      },
      {
        kind: "changed",
        text: {
          th: "เปลี่ยนชื่อไฟล์ใน public/assets/ ทั้งหมดเป็น kebab-case — ไฟล์เคมีที่มีช่องว่างในชื่อไม่ต้อง escape ใน URL อีกต่อไป",
          en: "Renamed every file under public/assets/ to kebab-case — the chemistry PDFs with spaces no longer need URL escaping",
        },
      },
    ],
  },
  {
    version: "0.5.0",
    date: "2026-08-17",
    contributors: [{ name: "Chatan Petry", github: "Jesselpetry" }],
    changes: [
      {
        kind: "added",
        text: {
          th: "ระบบ Technique Quiz: แบบทดสอบ Active-Recall 60 ข้อ ครอบคลุม 10 โจทย์แนะนำ พร้อมเฉลย 2 ภาษา (TH/EN)",
          en: "Technique Quiz: 60 active-recall questions covering all 10 recommended problems with bilingual explanations",
        },
      },
      {
        kind: "added",
        text: {
          th: "ระบบ Client-Side Grader: ตรวจโค้ด Python ผ่าน WebAssembly (Pyodide) ใน Web Worker โดยตรงในเบราว์เซอร์",
          en: "Client-Side Grader: evaluate and run Python code in-browser via WebAssembly (Pyodide) inside a Web Worker",
        },
      },
      {
        kind: "added",
        text: {
          th: "หน้าจอ Splitter Panel Workspace (/recommended/[slug]): แบ่ง 2 หน้าจอปรับขนาดได้ ฝั่งซ้ายเป็นโจทย์ ฝั่งขวาเป็น Grader",
          en: "Splitter Panel Workspace (/recommended/[slug]): resizable split screen with problem notes on left and Grader on right",
        },
      },
      {
        kind: "added",
        text: {
          th: "ระบบ Foldable Test Cases: แสดง Expected Input / Output แบบพับได้ (Default พับ) พร้อม Diff View แสดงช่องว่าง",
          en: "Foldable Test Cases: expandable expected I/O with whitespace diff inspector",
        },
      },
      {
        kind: "added",
        text: {
          th: "ระบบตรวจสไตล์โค้ด PEP-8 & PSCP Rules และคีย์ลัด Ctrl+Enter สำหรับสั่งรันเทส",
          en: "PEP-8 & PSCP code style linter and Ctrl+Enter execution shortcut",
        },
      },
      {
        kind: "changed",
        text: {
          th: "ปรับปรุงเลย์เอาต์หน้าโจทย์แนะนำให้ Fit-to-Screen 100% เลื่อนเฉพาะเนื้อหาแต่ละฝั่งอย่างอิสระ",
          en: "Enhanced recommended problem reader to fit 100% viewport height with independent panel scrollbars",
        },
      },
      {
        kind: "fixed",
        text: {
          th: "แก้ไขการ Hydrate ข้อมูลแบบ Primitive String ใน useDraft ป้องกันข้อผิดพลาด [object Object]",
          en: "Fixed primitive string hydration in useDraft preventing [object Object] errors",
        },
      },
    ],
  },
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
        kind: "added",
        text: {
          th: "ส่วนแสดงผล Avatar พร้อม AvatarBadge สำหรับผู้ร่วมพัฒนาในหน้า /version",
          en: "Contributor avatar badges with status indicators on the /version page",
        },
      },
      {
        kind: "changed",
        text: {
          th: "ปรับปรุง Navbar ให้รองรับอุปกรณ์เคลื่อนที่ (Mobile Responsive) พร้อมเมนู Hamburger",
          en: "Mobile responsive Navbar with hamburger menu navigation",
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
