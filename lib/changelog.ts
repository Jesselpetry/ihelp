import type { LText } from "@/lib/i18n";

/** owner/repo on GitHub — used to build commit and compare links below. */
export const GITHUB_REPO = "Jesselpetry/ihelp";

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
  /**
   * The commit that marks this entry, short SHA.
   *
   * For a released version, the commit itself — the badge links straight to it
   * on GitHub. For "Unreleased", the previous release's commit instead: the
   * badge links to a compare view from there to `main`, which is what "what's
   * new since the last release" actually means until this entry gets its own
   * release commit and date.
   */
  commit?: string;
  contributors: Contributor[];
  changes: ChangeEntry[];
}

// Mirrors CHANGELOG.md at the repo root — keep both in sync when releasing.
export const CHANGELOG: VersionEntry[] = [
  {
    version: "0.6.0",
    date: "2026-08-30",
    contributors: [{ name: "Chatan Petry", github: "Jesselpetry" }],
    changes: [
      // ── Added: community learning hub ──────────────────────────────────
      {
        kind: "added",
        text: {
          th: "บัญชีผู้ใช้และการยืนยันตัวตน: เข้าสู่ระบบด้วย Google บัญชี @kmitl.ac.th ตรวจรหัสนักศึกษา 8 หลักและรหัสคณะ เปิดให้เฉพาะนักศึกษาคณะ IT",
          en: "Accounts and verification: Google sign-in restricted to @kmitl.ac.th, checking the 8-digit student id and the faculty code so only IT students get in",
        },
      },
      {
        kind: "added",
        text: {
          th: "โปรไฟล์สาธารณะ /profile/[รหัสนักศึกษา]: ชื่อเล่น สาขา ลิงก์โซเชียล และรายการทรัพยากรที่แชร์เข้าคลังทั้งหมด",
          en: "Public profiles at /profile/[student id]: nickname, major, social links, and everything that student has shared",
        },
      },
      {
        kind: "added",
        text: {
          th: "รูปโปรไฟล์: อัปโหลดเองพร้อมเครื่องมือครอบรูปและบีบอัดในเบราว์เซอร์ หรือใช้รูปจากบัญชี Google เป็นค่าเริ่มต้น",
          en: "Profile pictures: upload with an in-browser cropper and compressor, or fall back to the Google account photo",
        },
      },
      {
        kind: "added",
        text: {
          th: "แชร์เข้าคลัง /upload: อัปโหลดสไลด์ สรุป หรือโน้ต ระบุวิชา ประเภท และช่วงสอบ พร้อมให้เครดิตผู้แชร์",
          en: "Community uploads at /upload: share slides, summaries, or notes tagged by subject, type, and exam scope, credited to the uploader",
        },
      },
      {
        kind: "added",
        text: {
          th: "คลังข้อสอบเก่า /exams: จำกัดสิทธิ์เฉพาะบทบาท insider/admin ไฟล์อยู่ในที่เก็บแบบปิด เข้าถึงผ่านลิงก์ที่หมดอายุใน 10 นาที",
          en: "Past-exam archive at /exams: insider/admin only, served from a private bucket through links that expire in 10 minutes",
        },
      },
      {
        kind: "added",
        text: {
          th: "ตัวนับผู้เข้าชมที่ footer: วันนี้ / 7 วัน / ทั้งหมด นับตามวันเวลาไทย ไม่เก็บ IP และไม่ใช้คุกกี้ติดตาม",
          en: "Footer visitor counter: today / 7 days / all time on Bangkok days, storing no IP and no tracking cookie",
        },
      },
      {
        kind: "added",
        text: {
          th: "ไดอะล็อกต้อนรับแบบเลือกปลายทาง ถามผู้ใช้ใหม่ว่าอยากเริ่มที่ห้องแลป PSCP หรือคลังทรัพยากร",
          en: "A welcome dialog that asks new visitors whether to start in the PSCP lab or the resource library",
        },
      },
      // ── Changed: this release ──────────────────────────────────────────
      {
        kind: "changed",
        text: {
          th: "แท็บช่วงสอบในหน้ารายวิชาเป็นดรอปดาวน์บนมือถือ ปุ่มสามตัวพร้อมไอคอนและตัวเลขล้นแถวเดียวบนจอ 360px จนข้อความถูกตัด",
          en: "The exam-scope tabs on subject pages become a dropdown on mobile: three buttons with icons and counts overflowed a 360px row and truncated",
        },
      },
      {
        kind: "changed",
        text: {
          th: "แถบนำทางแสดงรูปโปรไฟล์พร้อมชื่อเล่น และนำลิงก์ iJudge ออก (ยังอยู่ที่ footer)",
          en: "The navbar shows your picture and nickname, and the iJudge link moved out of it (still in the footer)",
        },
      },
      {
        kind: "changed",
        text: {
          th: "คลังทรัพยากรขึ้นหน้า \"เร็วๆ นี้\" ชั่วคราวระหว่างจัดหมวดหมู่เอกสาร",
          en: "The resource library sits behind a \"coming soon\" cover while its documents are being sorted",
        },
      },
      // ── Added: earlier in this release ─────────────────────────────────
      {
        kind: "added",
        text: {
          th: "ฮับวิชา EN-KMITL (คอมโปร): หน้าสารบัญก่อนเริ่มทำแบบทดสอบ ปุ่มกระโดดไปข้อที่ต้องการ และข้อสอบจำลอง 60 ข้อ รวมกับ 10 ข้อคัดสรรเป็น 70 ข้อ",
          en: "EN-KMITL (ComPro) hub: a syllabus screen before the quiz starts, a jump-to-question navigator, and a 60-question mock exam merged with the 10 curated questions for 70 total",
        },
      },
      {
        kind: "added",
        text: {
          th: "หมวดวิชา IT-KMITL — ฮับ ICS/Digital Logic: สรุปเนื้อหา แบบทดสอบ 50 ข้อ ข้อสอบฝึกพร้อมเฉลยละเอียด บทวิเคราะห์โครงข้อสอบ และคลังทรัพยากร",
          en: "IT-KMITL faculty section — ICS / Digital Logic hub: summary, a 50-question quiz, a practice exam with worked solutions, an exam-blueprint analysis, and a resource library",
        },
      },
      {
        kind: "added",
        text: {
          th: "ฮับวิชา MFIT (คณิตศาสตร์สำหรับ IT): สรุปเนื้อหา แบบทดสอบ 45 ข้อ ข้อสอบจำลอง และคลังทรัพยากร ครอบคลุมพีชคณิตเชิงเส้นสัปดาห์ 1–7",
          en: "MFIT (Math for IT) hub: summary, a 45-question quiz, a mock exam, and a resource library covering linear algebra weeks 1-7",
        },
      },
      {
        kind: "added",
        text: {
          th: "เตรียมสอบ MFIT ตามโครงข้อสอบจริง: สรุปเร่งด่วนเรียงตามข้อสอบ 10 ข้อจริง แผนอ่าน 6 ชั่วโมงตามน้ำหนักคะแนน และชุดฝึกจับเวลา (ปรนัย 20 + คำนวณ 5) รวมคลังข้อสอบเป็น 65 ข้อ",
          en: "MFIT blueprint-led exam prep: a crash summary ordered by the real 10-question exam, a 6-hour study plan weighted by actual marks, and a timed drill (20 MCQ + 5 calculations), bringing the quiz bank to 65 questions",
        },
      },
      {
        kind: "added",
        text: {
          th: "ฮับ EN-KMITL แบบหลายวิชา พร้อมข้อสอบจำลองเคมีทั่วไป 60 ข้อ และคลังทรัพยากรของตัวเอง",
          en: "A multi-subject EN-KMITL hub with a 60-question General Chemistry mock exam and its own resource library",
        },
      },
      {
        kind: "added",
        text: {
          th: "สารบัญด้านข้างแบบโต้ตอบในทุกหน้าอ่าน: ไล่ตามตำแหน่งที่อ่าน แถบความคืบหน้า ค้นหาหัวข้อ พับ/ขยายได้ และเลื่อนแยกอิสระจากเนื้อหา",
          en: "An interactive table-of-contents side panel on every reader: scroll-spy, live reading progress, a search filter, and independent, foldable scrolling",
        },
      },
      {
        kind: "added",
        text: {
          th: "route เดียว /courses/[dir] รองรับทุกวิชา แทนโครง en-kmitl และ it-kmitl ที่แยกกันคนละต้นไม้",
          en: "One unified /courses route tree serving every subject, replacing the separate en-kmitl and it-kmitl route trees",
        },
      },
      {
        kind: "added",
        text: {
          th: "route /pscp — ฮับห้องแลป Python พร้อมหน้าย่อยแยกตามโมดูล",
          en: "The /pscp route: a Python lab hub with per-module pages",
        },
      },
      {
        kind: "added",
        text: {
          th: "คลังทรัพยากรสร้างการ์ดจากไฟล์อัตโนมัติ (scripts/build-library-manifest.mjs) — วางไฟล์ลง public/assets/ ตามกติกาแล้วขึ้นเว็บทันที ไม่ต้องเขียน entry มือ",
          en: "The resource library now generates cards from the file tree (scripts/build-library-manifest.mjs) — drop a file into public/assets/ and it appears without a hand-written entry",
        },
      },
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
          th: "นำเข้าเอกสาร Markdown จาก kmitl-archive และ iLearn — 30 ไฟล์ รวมคู่มือทบทวน MFIT สัปดาห์ 8–15",
          en: "Ingested 30 course markdown documents from kmitl-archive and iLearn, including MFIT's weeks 8-15 study guide",
        },
      },
      {
        kind: "added",
        text: {
          th: "workflow _dropzone/ — วางไฟล์ที่ยังไม่ได้จัดหมวด แล้วให้ AI agent จัดวิชา/หมวด/ขอบเขตสอบให้ตาม docs/DROPZONE_SOP.md",
          en: "The _dropzone/ workflow — drop unsorted files and let an AI agent classify subject, category, and exam scope per docs/DROPZONE_SOP.md",
        },
      },
      {
        kind: "added",
        text: {
          th: "เอกสาร FILE_STRUCTURE.md — กติกา path การตั้งชื่อไฟล์ และ taxonomy กลางภาค/ปลายภาคที่ทุกวิชาต้องทำตาม",
          en: "FILE_STRUCTURE.md — the path rules, filename conventions, and midterm/final taxonomy every subject follows",
        },
      },
      {
        kind: "added",
        text: {
          th: "พิมพ์เขียวการเรียนรู้ 11 โมดูล (lib/spine.ts) — สัญญาเดียวว่าหน้าวิชาต้องมีอะไรบ้าง แทนที่ track 6 แบบเดิมที่เขียนตายตัวในแต่ละหน้า เชื่อมกับแต่ละวิชาผ่าน lib/course-bindings.ts",
          en: "An eleven-module learning spine (lib/spine.ts) — one declared contract for what a course page offers, replacing six hard-coded tracks; lib/course-bindings.ts declares what each course actually fills",
        },
      },
      {
        kind: "added",
        text: {
          th: "สัญญาคลังข้อสอบที่ตรวจได้ด้วยเครื่อง (lib/schemas/content.ts, npm run content:check) รันในขั้น build — ทุกข้อต้องมีแหล่งอ้างอิง ตัวเลือกห้าม id ซ้ำ คลังข้อสอบแต่ละชุดต้องมี progress key ไม่ชนกัน",
          en: "A machine-checked content contract (lib/schemas/content.ts, npm run content:check) wired into the build — every question needs a source reference, option ids must be unique, and quiz banks need unique progress keys",
        },
      },
      {
        kind: "added",
        text: {
          th: "npm run readiness — รายงานความครบของพิมพ์เขียวแต่ละวิชาเป็นคะแนน x/11",
          en: "npm run readiness — reports each course's spine completion as an x/11 score",
        },
      },
      {
        kind: "added",
        text: {
          th: "เอกสาร docs/LEARNING_BLUEPRINT.md — สัญญาเต็มของพิมพ์เขียว 11 โมดูลที่ระบบตรวจอยู่",
          en: "docs/LEARNING_BLUEPRINT.md — the full eleven-module contract the build enforces",
        },
      },
      {
        kind: "added",
        text: {
          th: "การ์ดสรุปวิชาแบบพับ/ขยายได้ พร้อมสารบัญของตัวเองเมื่อดูเนื้อหาเต็ม",
          en: "A collapsible course summary card with its own table-of-contents panel when viewing the full content",
        },
      },
      {
        kind: "added",
        text: {
          th: "ฟิลด์ chapter บนไฟล์ในคลังทรัพยากรและข้อสอบ อ่านจากชื่อไฟล์อัตโนมัติ — กรองคลังทรัพยากรตามบท/สัปดาห์ได้แล้ว",
          en: "A chapter field on library assets and quiz questions, backfilled from filenames — the resource library can now be filtered by chapter/week",
        },
      },

      // ── Changed ────────────────────────────────────────────────────────
      {
        kind: "changed",
        text: {
          th: "ออกแบบใหม่: navbar, footer, splash screen, subject hub และหน้าต่างพรีวิวคลังทรัพยากร",
          en: "Redesigned the navbar, footer, splash screen, subject hub, and the library preview modal",
        },
      },
      {
        kind: "changed",
        text: {
          th: "คอมโพเนนต์ร่วมชุดใหม่: course directory, module/track grid, การ์ดโมดูล PSCP, lab hub และ badge ของแต่ละวิชา",
          en: "New shared components: course directory, module/track grid, PSCP module cards, lab hub, and subject badges",
        },
      },
      {
        kind: "changed",
        text: {
          th: "เปลี่ยนชื่อไฟล์ใน public/assets/ ทั้งหมดเป็น kebab-case (155 ไฟล์) และจัดเข้าโฟลเดอร์หมวด — ไฟล์เคมีที่มีช่องว่างในชื่อไม่ต้อง escape ใน URL อีกต่อไป",
          en: "Renamed every file under public/assets/ to kebab-case (155 files) and sorted into category folders — the chemistry PDFs with spaces no longer need URL escaping",
        },
      },
      {
        kind: "changed",
        text: {
          th: "บีบอัด PDF ทุกไฟล์ผ่านการตรวจสอบภาพก่อน-หลัง (visual regression gate) — จาก 1,328 MB เหลือ 908 MB (ลด 32%) ใน 475 จาก 621 ไฟล์ ส่วน 101 ไฟล์ที่ภาพจะเสียถูกกันไว้ที่ขนาดเดิม",
          en: "PDFs recompressed behind a visual-regression gate — 1,328 MB down to 908 MB (32% smaller) across 475 of 621 files, holding back the 101 that would visibly degrade",
        },
      },
      {
        kind: "changed",
        text: {
          th: "แยกข้อสอบจำลอง 60 ข้อของ COMPRO ออกจากคลังฝึก 10 ข้อ เป็นโมดูลของตัวเองพร้อม progress แยกต่างหาก (เดิมต่อท้ายกันเงียบๆ ทำให้เจอ 70 ข้อตอนกดทำแบบทดสอบ)",
          en: "COMPRO's 60-question mock paper is now its own module with its own progress tracking, separated from its 10-question practice quiz (previously concatenated silently, so a student saw 70 questions when practicing 10)",
        },
      },
      {
        kind: "changed",
        text: {
          th: "URL เก่า /exam /plan /analysis redirect ไปยัง segment ใหม่ของแต่ละโมดูล",
          en: "Legacy /exam, /plan, and /analysis URLs redirect to their new module segments",
        },
      },
      {
        kind: "changed",
        text: {
          th: "sitemap สร้างจากพิมพ์เขียว 11 โมดูลอัตโนมัติ แทนรายการ route ที่เขียนมือ",
          en: "The sitemap is generated from the eleven-module spine instead of a hand-maintained route list",
        },
      },
      {
        kind: "changed",
        text: {
          th: "การ์ดโมดูลในหน้าวิชาเรียงลำดับที่พร้อมใช้ก่อนในแต่ละเฟส และดึงคลังทรัพยากรขึ้นเป็นแบนเนอร์เด่นเหนือกริดโมดูล",
          en: "Module cards on a course page sort available-first within each phase, and the resource archive is promoted to a featured banner above the module grid",
        },
      },
      {
        kind: "changed",
        text: {
          th: "ปรับข้อความ modal ต้อนรับให้ตรงกับสิ่งที่ ihelp เป็นตอนนี้ — คลังการเรียนรู้เปิด ไม่ใช่แค่เครื่องมือ PSCP",
          en: "Refreshed the welcome/disclaimer modal copy for what ihelp actually offers today — an open learning hub, not just the PSCP tool",
        },
      },
      {
        kind: "changed",
        text: {
          th: "แปลงหลาย route จาก force-dynamic เป็น static generation เพื่อให้อยู่ในโควตา 12 serverless function ของ Vercel Hobby",
          en: "Converted several force-dynamic routes to static generation to stay within Vercel Hobby's 12-function limit",
        },
      },

      // ── Fixed ──────────────────────────────────────────────────────────
      {
        kind: "fixed",
        text: {
          th: "รวมเนื้อหา EN-KMITL เข้า repo เอง — deploy จริงไม่มี repo พี่น้องที่โค้ดเคยอ้างอิง ทำให้หน้าเพจ 404",
          en: "Bundled EN-KMITL content into this repo — production only deploys this repo, so the page 404'd looking for markdown in a sibling repo that doesn't exist there",
        },
      },
      {
        kind: "fixed",
        text: {
          th: "แก้การเรนเดอร์สูตรคณิตศาสตร์ (KaTeX) ใน markdown viewer",
          en: "Fixed math formula rendering (KaTeX) in the markdown viewer",
        },
      },
      {
        kind: "fixed",
        text: {
          th: "แก้ asset ID ชนกันในตัวสร้าง library manifest",
          en: "Fixed a duplicate asset ID collision in the library manifest generator",
        },
      },
      {
        kind: "fixed",
        text: {
          th: "สูตร $$...$$ แบบหลายบรรทัดเคยกลืนหัวข้อและย่อหน้าที่เหลือทั้งไฟล์ให้กลายเป็นข้อความดิบ — เกิดกับทุกหน้า markdown ในเว็บ ไม่ใช่แค่ไฟล์เดียว",
          en: "Multi-line $$...$$ math blocks were silently swallowing every heading and paragraph after them into raw text — affecting every markdown page in the app, not just one file",
        },
      },
      {
        kind: "fixed",
        text: {
          th: "แก้คำเตือน workspace-root ของ Turbopack และลบ lockfile ที่ไม่ตรงกับตัวจัดการแพ็กเกจของโปรเจกต์อีกต่อไป",
          en: "Fixed a Turbopack workspace-root warning and dropped a stray lockfile that no longer matched the project's package manager",
        },
      },
    ],
  },
  {
    version: "0.5.0",
    date: "2026-08-17",
    commit: "6cac82c",
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
    commit: "0f7b7ce",
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
    commit: "e2f4b32",
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
    commit: "9f653a5",
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
    commit: "1c1136f",
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
    commit: "c288176",
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
