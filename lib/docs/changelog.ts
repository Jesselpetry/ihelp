import type { LText } from "@/lib/i18n";
import { SITE } from "@/lib/site";

/**
 * owner/repo on GitHub. Derived from SITE.repo so the repository is named in
 * one place; the contributors listed per release below stay literal, because
 * they record who did the work and must not follow the site's owner.
 */
export const GITHUB_REPO = `${SITE.repo.owner}/${SITE.repo.name}`;

export interface Contributor {
  name: string;
  github: string; // handle, no @
  instagram?: string; // handle, no @
}

export const CONTRIBUTORS = {
  chatan: {
    name: "Chatan Petry",
    github: "Jesselpetry",
    instagram: "chatann_",
  },
  phuPunnavit: {
    name: "Punnavit Tangkolchan",
    github: "PhuPunnavit",
    instagram: "priiu_i",
  },
  pgthegod: {
    name: "Akarapach Yootsukprasert",
    github: "PGTHEGOD",
    instagram: "pgthegod_x",
  },
  meaookung: {
    name: "Kittinan Atthasiri",
    github: "Meaookung144",
    instagram: "meaookung144",
  },
} as const satisfies Record<string, Contributor>;

export type ChangeKind = "added" | "changed" | "fixed" | "security";

export interface ChangeEntry {
  kind: ChangeKind;
  text: LText;
}

export interface VersionEntry {
  version: string; // e.g. "1.0.0", "0.9.0"
  date: string | null; // ISO date "YYYY-MM-DD", null for Unreleased
  /**
   * The commit that marks this entry, short SHA.
   */
  commit?: string;
  contributors: Contributor[];
  changes: ChangeEntry[];
}

export interface EvolutionMilestone {
  version: string;
  summary: LText;
  highlight?: boolean;
}

/**
 * การนับลำดับวิวัฒนาการหลักของ <i>Help (Major Evolution Milestones)
 */
export const MAJOR_EVOLUTION_MILESTONES: EvolutionMilestone[] = [
  {
    version: "v0.1.x",
    summary: {
      th: "จุดเริ่มต้น PSCP Learning-Log Maker & AI Guidelines",
      en: "Origins: PSCP Learning-Log Maker & AI Guidelines",
    },
  },
  {
    version: "v0.4.x",
    summary: {
      th: "การเชื่อมต่อ GitHub OAuth โดย Meaookung144 และหน้า /pro โดย PGTHEGOD",
      en: "GitHub OAuth integration by Meaookung144 & /pro landing page by PGTHEGOD",
    },
  },
  {
    version: "v0.5.x",
    summary: {
      th: "ห้องแลปโจทย์แนะนำ, Client-Side WASM Grader, Technique Quiz และการขยายสู่ 11 โมดูล (Spine)",
      en: "Curated Problem Labs, Client-Side WASM Grader, Technique Quiz & 11-module Spine expansion",
    },
  },
  {
    version: "v0.6.x",
    summary: {
      th: "ระบบสมาชิกไอที (@kmitl.ac.th), ย้ายสื่อขึ้น Supabase Storage และรีแบรนด์สู่ iHelp",
      en: "IT KMITL Member Auth (@kmitl.ac.th), Supabase Storage migration & rebrand to iHelp",
    },
  },
  {
    version: "v0.7.x",
    summary: {
      th: "PWA ออฟไลน์ และคาบเรียนรายสัปดาห์ ICS พร้อมวิดีโอ YouTube",
      en: "Offline PWA & ICS Weekly Sessions with integrated YouTube lectures",
    },
  },
  {
    version: "v0.8.x",
    summary: {
      th: "คลังสื่อเปิดเต็มรูปแบบ, ตารางสอบผังที่นั่ง, Help-Desk Chat โดย PhuPunnavit, สไลด์แปลไทย และเครื่องคิดเกรด",
      en: "Open Media Library, Exam Seating Locator, Help-Desk Chat by PhuPunnavit, Thai slides & Grade Calculator",
    },
  },
  {
    version: "v0.9.x",
    summary: {
      th: "REST API คลังสื่อสาธารณะ, ยกเครื่อง Grade Calculator 3 แผง และหน้ารวมผู้พัฒนา",
      en: "Public Catalog REST API, 3-panel Grade Calculator overhaul & Version/Contributors page",
    },
  },
  {
    version: "v1.0.0",
    highlight: true,
    summary: {
      th: "Production Release: สถาปัตยกรรม Weekly Learning Path, ICS Track A และระบบ Contributor Credit System สมบูรณ์แบบ",
      en: "Production Release: Weekly Learning Path architecture, ICS Track A & Full Contributor Credit System",
    },
  },
];

// Mirrors CHANGELOG.md at the repo root — keep both in sync when releasing.
export const CHANGELOG: VersionEntry[] = [
  {
    version: "1.0.0",
    date: "2026-11-08",
    commit: "08aafdc",
    contributors: [CONTRIBUTORS.chatan],
    changes: [
      {
        kind: "added",
        text: {
          th: "ปรับโครงสร้างหน้าหลักรายวิชาสู่ระบบเส้นทางการเรียนรู้รายสัปดาห์ (Weekly Learning Path) แยกเนื้อหาครึ่งแรก/ครึ่งหลัง คั่นด้วยจุดพักสอบ (Isolated Exam Milestones) พร้อมช่องค้นหาแคปซูลแบบ Real-time (โดย @Jesselpetry)",
          en: "Restructured course hub to Weekly Learning Path with isolated exam milestones, real-time search, and exam period filters (by @Jesselpetry)",
        },
      },
      {
        kind: "added",
        text: {
          th: "จัดทำเอกสารและหน้ารายสัปดาห์สำหรับวิชา ICS ครึ่งแรก (Track A: Digital Logic สัปดาห์ที่ 1–7) ครบ 7 บท พร้อมตารางเชื่อมโยงสไลด์และแล็บ Logisim (โดย @Jesselpetry)",
          en: "Authored 7 weekly docs and lab mappings for ICS Track A (Digital Logic weeks 1-7) covering gates, canonical forms, and MUX/DEMUX (by @Jesselpetry)",
        },
      },
      {
        kind: "added",
        text: {
          th: "ระบบ Contributor Credit และโปรไฟล์ผู้ร่วมแบ่งปันเนื้อหาท้ายหน้ารายวิชา (/courses/[dir]) รวมศูนย์ข้อมูลผู้ร่วมพัฒนาและผู้แบ่งปันเนื้อหา พร้อมระบบคำนวณและเลื่อนชั้นปีอัตโนมัติตามรหัสนักศึกษา (โดย @Jesselpetry)",
          en: "Contributor credit & profile showcase at course hub footers with automated student academic year advancement engine (by @Jesselpetry)",
        },
      },
      {
        kind: "added",
        text: {
          th: "ระบบตรวจสอบความถูกต้องของรุ่นนักศึกษาไอที (KMITL IT Cohort Formula & Auditing Rule: IT<yy-45>) ตรวจสอบความถูกต้องของเลขรุ่นกับรหัสนักศึกษา (รหัส 69 = IT24, 68 = IT23, 67 = IT22) เชื่อมต่อกระบวนการตรวจสอบ content:check (โดย @Jesselpetry)",
          en: "Automated KMITL IT cohort calculation and auditing rule (IT<yy-45>) verifying student IDs (69 -> IT24, 68 -> IT23) integrated with content:check (by @Jesselpetry)",
        },
      },
      {
        kind: "changed",
        text: {
          th: "ปรับปรุงโครงสร้าง Contributor Profile Modal ให้ Responsive 100% ไม่โดนแบนเนอร์บดบัง ปรับ Avatar เป็น rounded-full จัดลำดับข้อมูล คณะ > สาขา > ชั้นปี > รหัสนักศึกษา > รุ่น IT พร้อมระบบ Accordion พับ-ขยายสำหรับผลงานรายวิชาและประวัติ Commit (โดย @Jesselpetry)",
          en: "Redesigned Contributor Profile Modal for full mobile responsiveness without banner clipping, rounded-full avatar, hierarchical credentials, and interactive accordions for course materials and commit history (by @Jesselpetry)",
        },
      },
      {
        kind: "changed",
        text: {
          th: "ปรับปรุงการ์ดเครดิตผู้จัดทำและร่วมแบ่งปันเนื้อหาท้ายหน้ารายวิชาสู่ดีไซน์แนวนอนแบบกว้าง พร้อมไอคอน Dev/Terminal สำหรับ Lead Maintainer และปุ่มโซเชียลแบดจ์เต็ม (โดย @Jesselpetry)",
          en: "Redesigned course contributor cards to wide horizontal layout with Terminal/Dev role icons and full channel badges (by @Jesselpetry)",
        },
      },
      {
        kind: "changed",
        text: {
          th: "ปรับปรุงระบบเลย์เอาต์หน้ารายวิชา (/courses/[dir]) คืนสู่ระบบการเลื่อนหน้าแบบธรรมชาติ (Natural Page Scroll) พร้อมแถบข้าง Sticky นุ่มนวล (โดย @Jesselpetry)",
          en: "Restored natural whole-page scrolling layout on course hubs with smooth sticky navigation sidebar (by @Jesselpetry)",
        },
      },
      {
        kind: "changed",
        text: {
          th: "ปรับปรุงแถบค้นหารายวิชาและการ์ดรายวิชากะทัดรัด แนวนอน สไตล์ MIT OpenCourseWare (/) พร้อมคู่มือมาตรฐานแบรนด์ docs/BRANDING.md (โดย @Jesselpetry)",
          en: "Redesigned course search bar and compact horizontal cards (/) inspired by MIT OpenCourseWare with brand guide docs/BRANDING.md (by @Jesselpetry)",
        },
      },
      {
        kind: "changed",
        text: {
          th: "ปรับเปลี่ยนลายน้ำตราสัญลักษณ์บนการ์ดรายวิชา Charm School และ Foundation English เป็นตรา GE สีขาว และวิชา EN-KMITL เป็นตราสถาบัน (โดย @Jesselpetry)",
          en: "Updated course card watermarks for Charm School & FE to white GE logo and EN-KMITL to official KMITL seal (by @Jesselpetry)",
        },
      },
      {
        kind: "fixed",
        text: {
          th: "แก้ไขปัญหาลิงก์สัปดาห์ที่ 7 (MUX/DEMUX) ของวิชา ICS จับคู่ผิดสโคปไปยังครึ่งหลัง (ALU/CPU) และแก้ไขลิงก์สัปดาห์ที่ 0 404 (โดย @Jesselpetry)",
          en: "Fixed week 7 MUX/DEMUX routing to final exam scope and resolved week 0 course intro 404 links (by @Jesselpetry)",
        },
      },
    ],
  },
  {
    version: "0.9.0",
    date: "2026-11-07",
    commit: "2d88966",
    contributors: [CONTRIBUTORS.chatan],
    changes: [
      {
        kind: "added",
        text: {
          th: "Public API คลังสื่อการเรียนรู้ /api/library/catalog ค้นหาและกรอง Dictionary สื่อ 570 รายการ ปลอดภัยด้วย Zero-Trust ตัดเอกสารลับ 100% (โดย @Jesselpetry)",
          en: "High-speed public REST API /api/library/catalog indexing 570 public learning assets with zero-trust defense (by @Jesselpetry)",
        },
      },
      {
        kind: "added",
        text: {
          th: "จัดทำเอกสารสถาปัตยกรรมคลังสื่อ docs/LIBRARY_ARCHITECTURE_AND_WORKFLOW.md และคู่มือการจัดการเวอร์ชัน docs/VERSION_CONTROL_GUIDE.md (โดย @Jesselpetry)",
          en: "Published comprehensive library architecture docs and version control guidelines (by @Jesselpetry)",
        },
      },
      {
        kind: "changed",
        text: {
          th: "ยกเครื่องระบบคำนวณคะแนนและตัดเกรด /grade-calculator สู่สถาปัตยกรรม 3 แผง พร้อมแผนที่เป้าหมาย Final และ GPS Simulator (โดย @Jesselpetry)",
          en: "Overhauled grade calculator to 3-panel architecture with final target roadmap, GPS simulator, and Excel paste (by @Jesselpetry)",
        },
      },
      {
        kind: "changed",
        text: {
          th: "ปรับโฉมหน้าประวัติเวอร์ชันและผู้ร่วมพัฒนา /version สไตล์ GitHub Releases แบ่ง 2 แผง พร้อมป้ายระบุเวอร์ชันปัจจุบัน และการ์ดผู้ร่วมพัฒนาแบบคลีน (โดย @Jesselpetry)",
          en: "GitHub Releases-inspired 2-panel /version redesign with current version pill and clean borderless contributor cards (by @Jesselpetry)",
        },
      },
      {
        kind: "changed",
        text: {
          th: "ยกเครื่อง Contributor Profile Modal ให้ Responsive ปรับปุ่มโซเชียลเป็นทรงมน (rounded-full) เงา shadow-sm/md และแจกแจงประวัติการพัฒนาละเอียด (โดย @Jesselpetry)",
          en: "Contributor Profile Modal overhaul — responsive dialog, rounded-full social buttons, subtle shadow tokens, and rich version history (by @Jesselpetry)",
        },
      },
      {
        kind: "fixed",
        text: {
          th: "นำจุดเขียว AvatarBadge (online status indicator) ออกจาก Avatar ผู้ร่วมพัฒนาทั้งหมด เพื่อไม่ให้บดบังรูปโปรไฟล์ (โดย @Jesselpetry)",
          en: "Removed overlapping online status AvatarBadge dot from contributor avatars to prevent profile image obstruction (by @Jesselpetry)",
        },
      },
    ],
  },
  {
    version: "0.8.5",
    date: "2026-11-03",
    commit: "b993e25",
    contributors: [CONTRIBUTORS.chatan],
    changes: [
      {
        kind: "added",
        text: {
          th: "ระบบคำนวณคะแนนและตัดเกรดรุ่นแรก (/grade-calculator) รองรับสัดส่วนวิชา ปี 1 เทอม 1 IT KMITL, คิดเลขสดในช่อง, ตัดเกรด A-F และ S/U (โดย @Jesselpetry)",
          en: "First-generation exam score & grade calculator with Y1-S1 presets, safe arithmetic parser, and Excel paste support (by @Jesselpetry)",
        },
      },
      {
        kind: "added",
        text: {
          th: "ITF ชุดเตรียมสอบปลายภาค Week 08–15 คู่มือคำนวณ IP Subnet ละเอียด และแนวข้อสอบ 60 ข้อพร้อมเฉลย (โดย @Jesselpetry)",
          en: "ITF final exam prep kit (Weeks 08–15) — subnetting calculation guides, 60-question drill with answer explanations (by @Jesselpetry)",
        },
      },
      {
        kind: "added",
        text: {
          th: "ITF โน้ตสรุปจาก Notion ของ Tammadon Suksa (IT24) 79 ภาพสไลด์พร้อมจดโน้ตทับ ในหน้า Week 08-15 (โดย @Jesselpetry)",
          en: "ITF Notion study notes by Tammadon Suksa (IT24) for Weeks 08–15 — 79 annotated slide images embedded on weekly pages (by @Jesselpetry)",
        },
      },
      {
        kind: "added",
        text: {
          th: "ลิงก์สไลด์เสริม Infraclover ITCAMP20 สำหรับสัปดาห์เน็ตเวิร์ก (โดย @Jesselpetry)",
          en: "Linked Infraclover ITCAMP20 slides on network weeks (by @Jesselpetry)",
        },
      },
      {
        kind: "changed",
        text: {
          th: "ยกเครื่องพาเลทสีโหมดมืดสู่ Neutral Charcoal สไตล์ Figma (#141416, #1c1c1f, #222226) เพิ่มความลึก คมชัด และสบายตา (โดย @Jesselpetry)",
          en: "Overhauled dark theme with Figma-inspired neutral gray palette (#141416, #1c1c1f, #222226) with refined depth (by @Jesselpetry)",
        },
      },
    ],
  },
  {
    version: "0.8.4",
    date: "2026-10-30",
    commit: "faa09ef",
    contributors: [CONTRIBUTORS.phuPunnavit, CONTRIBUTORS.chatan],
    changes: [
      {
        kind: "added",
        text: {
          th: "ฟีเจอร์ Chat Help-Desk มุมขวาล่าง — ผู้ช่วยตอบคำถามการใช้งานทันใจด้วย FAQ กว่า 75 ข้อ ค้นหาไฟล์ในคลังรายวิชาแบบเรียลไทม์ และระบบ AI สตรีมมิ่ง พร้อม Guard Rails เข้มงวด (โดย @PhuPunnavit)",
          en: "Help-Desk Chat Widget — instant how-to answers with 75+ FAQs, real-time course file search with direct previews, and guarded streaming AI fallback (by @PhuPunnavit)",
        },
      },
      {
        kind: "added",
        text: {
          th: "ITF สไลด์บรรยายฉบับสรุปแปลไทย Week 08–15 — เลกเชอร์ครึ่งหลังแปลไทยย่อจบใน 1 หน้า ออกแบบใน Figma บรรจุในคลังเอกสารและหน้าสัปดาห์เรียน พร้อมคำค้นหา 'แปลไทย' (โดย @PhuPunnavit)",
          en: "ITF Thai lecture summaries for Weeks 08–15 — one-page condensed sheets in Figma, filed under library cheatsheets and linked on weekly pages (by @PhuPunnavit)",
        },
      },
      {
        kind: "changed",
        text: {
          th: "เชื่อมโยงสไลด์แปลไทยเข้ากับระบบค้นหาของ Help-Desk Chat และหน้าสารบัญสัปดาห์เรียน (โดย @PhuPunnavit)",
          en: "Connected Thai lecture summaries to Help-Desk Chat instant search and weekly syllabus pages (by @PhuPunnavit)",
        },
      },
    ],
  },
  {
    version: "0.8.3",
    date: "2026-10-22",
    commit: "ed1d38a",
    contributors: [CONTRIBUTORS.chatan],
    changes: [
      {
        kind: "added",
        text: {
          th: "ตารางสอบและผังที่นั่งสอบรายบุคคล (/exam-schedule) ค้นหากำหนดการสอบ ห้องสอบ และเลขที่นั่งสอบด้วยรหัสนักศึกษา 8 หลัก พร้อมผังที่นั่ง Interactive Seating Map ในห้องเรียน และส่งออกปฏิทิน .ics (โดย @Jesselpetry)",
          en: "Exam schedule & interactive seating map (/exam-schedule) — individual exam dates, rooms, and seat finder with .ics export (by @Jesselpetry)",
        },
      },
      {
        kind: "added",
        text: {
          th: "ตัวนับถอยหลังพร้อมเสียงเตือนขอยกเลิกสอบ (Resign countdown sound & loud-mode config) (โดย @Jesselpetry)",
          en: "Resign countdown timer with sound alert and loud-mode confirmation modal (by @Jesselpetry)",
        },
      },
      {
        kind: "added",
        text: {
          th: "พื้นที่อ่านหนังสือสอบปลายภาค (/profile/<รหัส>/study) หน้าโฟกัสพร้อมตัวจับเวลา Standby โควตา 112 ชั่วโมง และบันทึกเวลาในเครื่อง (โดย @Jesselpetry)",
          en: "Personal study space (/profile/<id>/study) with standby focus timer, 112-hour 22-day quota tracker, and Khan Academy calculus links (by @Jesselpetry)",
        },
      },
      {
        kind: "added",
        text: {
          th: "ระบบภาพแชร์ OpenGraph Card (/og/*.png) และคำอธิบาย Meta อัตโนมัติทุกหน้ารายวิชา โมดูล คลังเอกสาร และตารางสอบ (โดย @Jesselpetry)",
          en: "Automated OpenGraph social preview cards and rich metadata across courses, modules, map, library, and exam schedule (by @Jesselpetry)",
        },
      },
    ],
  },
  {
    version: "0.8.2",
    date: "2026-10-17",
    commit: "ba39a96",
    contributors: [CONTRIBUTORS.chatan],
    changes: [
      {
        kind: "added",
        text: {
          th: "ดัชนีคลังรวมศูนย์ resource-index.json และชุดคำสั่ง CLI ตรวจสอบคลัง library:audit และค้นหาคลัง library:find (โดย @Jesselpetry)",
          en: "Unified resource-index.json manifest with library:audit and library:find CLI utilities (by @Jesselpetry)",
        },
      },
      {
        kind: "added",
        text: {
          th: "ซิงก์เนื้อหา OnLearn ITF Week 11-15 ใบงานแล็บ 04, 05, 12, 13 และฝังวิดีโอบันทึกการสอน Lab 13-14 บนหน้าสัปดาห์ (โดย @Jesselpetry)",
          en: "Synced ITF Weeks 11-15 with OnLearn, added lab sheets 04, 05, 12, 13 and embedded lecture recordings (by @Jesselpetry)",
        },
      },
      {
        kind: "changed",
        text: {
          th: "ปรับเลย์เอาต์แบนเนอร์รายวิชาสไตล์ Google Classroom พร้อมลายน้ำรหัสวิชาโปร่งแสง (โดย @Jesselpetry)",
          en: "Laid out course hubs like Google Classroom with course code watermark banners (by @Jesselpetry)",
        },
      },
      {
        kind: "changed",
        text: {
          th: "แยกโครงสร้างเนื้อหาและข้อสอบครึ่งแรก/ครึ่งหลังของวิชา ICS ออกจากกันชัดเจน (โดย @Jesselpetry)",
          en: "Separated first and second half of ICS curriculum into distinct tracks (by @Jesselpetry)",
        },
      },
    ],
  },
  {
    version: "0.8.1",
    date: "2026-09-27",
    commit: "d74328a",
    contributors: [CONTRIBUTORS.chatan],
    changes: [
      {
        kind: "added",
        text: {
          th: "มุมมองคลังทรัพยากรรายสัปดาห์แบบเดียวกันทั้ง ITF และ ICS จัดกลุ่มตามสัปดาห์และช่วงสอบ พร้อมลิงก์ต้นทาง OnLearn (โดย @Jesselpetry)",
          en: "Unified week-grouped library view for ITF and ICS with semester-half segmentation and OnLearn source links (by @Jesselpetry)",
        },
      },
      {
        kind: "added",
        text: {
          th: "หน้าคาบเรียนรายสัปดาห์วิชา ITF (/courses/06016402-IT-Fundamentals/map) ครบ 15 สัปดาห์ พร้อมสรุปอ่านสอบและแบบทดสอบ (โดย @Jesselpetry)",
          en: "ITF weekly sessions and exam notes mapped across 15 weeks with summaries and quizzes (by @Jesselpetry)",
        },
      },
      {
        kind: "added",
        text: {
          th: "มาตรฐานภาพรวมรายวิชา summary.md โครงสร้างเดียวกัน 6 หัวข้อสำหรับทุกรายวิชา ตรวจสอบผ่าน content:check (โดย @Jesselpetry)",
          en: "Standardised 6-section course overview format for every course in summary.md (by @Jesselpetry)",
        },
      },
      {
        kind: "fixed",
        text: {
          th: "ปรับปรุงการจัดหน้าตารางกว้างในตัวอ่าน Markdown ไม่ให้ล้นการ์ดบนสมาร์ตโฟน (โดย @Jesselpetry)",
          en: "Kept wide markdown tables within card bounds on mobile phones (by @Jesselpetry)",
        },
      },
    ],
  },
  {
    version: "0.8.0",
    date: "2026-09-22",
    commit: "adec45a",
    contributors: [CONTRIBUTORS.chatan],
    changes: [
      {
        kind: "added",
        text: {
          th: "สื่อแต่ละชิ้นมีข้อมูลกำกับรุ่นและสัปดาห์ (edition, week, isCurrentYear) จับคู่สไลด์กับแล็บและซ่อนไฟล์เก่าอัตโนมัติ (โดย @Jesselpetry)",
          en: "Asset versioning and week metadata tagging to pair slides with labs and hide superseded assets (by @Jesselpetry)",
        },
      },
      {
        kind: "added",
        text: {
          th: "ทำเนียบอาจารย์ผู้สอนคณะ IT KMITL และจัดมาตรฐานชื่ออาจารย์ผู้สอน (โดย @Jesselpetry)",
          en: "Added IT KMITL academic roster and standardised instructor names (by @Jesselpetry)",
        },
      },
      {
        kind: "added",
        text: {
          th: "ฟอนต์ TH Sarabun New สำหรับตัวอ่านเอกสาร Markdown พร้อมชุดแต่งสมุดบันทึกเส้นแดง (Red Ink Notebook variant) (โดย @Jesselpetry)",
          en: "Render markdown in THSarabunNew webfont with red-ink notebook styling for course overviews (by @Jesselpetry)",
        },
      },
      {
        kind: "changed",
        text: {
          th: "ปรับโครงสร้างหน้ารายวิชาสู่ 4 หมวดตามจุดประสงค์ (ปูพื้นฐาน, ย่อสอบ, ตะลุยโจทย์, จำลองสอบ) (โดย @Jesselpetry)",
          en: "Restructured course hub into 4 learning objective categories instead of rigid sequential steps (by @Jesselpetry)",
        },
      },
      {
        kind: "changed",
        text: {
          th: "เปิดให้บริการคลังทรัพยากร /library อย่างเป็นทางการเต็มรูปแบบ นำหน้า Coming Soon ออก (โดย @Jesselpetry)",
          en: "Officially opened the /library catalog and removed the temporary coming-soon veil (by @Jesselpetry)",
        },
      },
    ],
  },
  {
    version: "0.7.0",
    date: "2026-09-22",
    commit: "83ec90e",
    contributors: [CONTRIBUTORS.chatan],
    changes: [
      {
        kind: "added",
        text: {
          th: "ติดตั้งเป็น Progressive Web App (PWA) พร้อม Service Worker (sw.js) แคชเฉพาะไฟล์จำเป็น และหน้าออฟไลน์ภาษาไทย (โดย @Jesselpetry)",
          en: "PWA installable app with content-hashed caching service worker and Thai offline fallback (by @Jesselpetry)",
        },
      },
      {
        kind: "added",
        text: {
          th: "หน้ารวมเอกสารก่อนเข้าอ่าน (Module Index) พร้อมตรวจจับจำนวนไฟล์จริงจาก Markdown และจำสถานะการเปิดอ่านในเครื่อง (โดย @Jesselpetry)",
          en: "Module Index view counting assets directly from markdown and tracking read status locally (by @Jesselpetry)",
        },
      },
      {
        kind: "added",
        text: {
          th: "หน้าคาบเรียนรายสัปดาห์ ICS พร้อมเครื่องเล่นวิดีโอ YouTube ฝังในตัว 35 คลิป และทะเบียนถาวร RESOURCES_MANIFEST.md (โดย @Jesselpetry)",
          en: "ICS weekly map sessions with 35 embedded YouTube videos and permanent asset manifest (by @Jesselpetry)",
        },
      },
      {
        kind: "added",
        text: {
          th: "ระบบเปิดดูตัวอย่างไฟล์ PDF/รูปภาพ (Preview) ได้ทันทีจากในหน้าเว็บ (โดย @Jesselpetry)",
          en: "In-page media previews for PDFs and images directly from course session tables (by @Jesselpetry)",
        },
      },
      {
        kind: "security",
        text: {
          th: "ลบประวัติและข้อมูลรหัสนักศึกษาอื่น (PII) ออกจาก Storage และป้องกันข้อมูลสื่อรั่วไหลเข้า Bundle (โดย @Jesselpetry)",
          en: "Purged leaked student PII from storage and separated client-safe library tokens to avoid JS bundle leak (by @Jesselpetry)",
        },
      },
    ],
  },
  {
    version: "0.6.2",
    date: "2026-09-15",
    commit: "e9cded1",
    contributors: [CONTRIBUTORS.chatan],
    changes: [
      {
        kind: "changed",
        text: {
          th: "ย้ายโดเมนหลักอย่างเป็นทางการสู่ ihelp.chatan.in.th (โดย @Jesselpetry)",
          en: "Migrated production domain to ihelp.chatan.in.th (by @Jesselpetry)",
        },
      },
      {
        kind: "changed",
        text: {
          th: "รีแบรนด์ Site Metadata จาก PSCP สู่ศูนย์กลางการเรียนรู้คณะ IT KMITL (iHelp) ครบวงจร (โดย @Jesselpetry)",
          en: "Rebranded site metadata from PSCP-specific tool to comprehensive IT KMITL Learning Hub (by @Jesselpetry)",
        },
      },
    ],
  },
  {
    version: "0.6.1",
    date: "2026-09-10",
    commit: "1f6d236",
    contributors: [CONTRIBUTORS.chatan],
    changes: [
      {
        kind: "added",
        text: {
          th: "โจทย์สัปดาห์ 8–9 เข้าสู่ระบบการเรียนรู้ครบวงจร พร้อมเฉลยอ้างอิงและ Concept Tags จากโค้ดจริง 27 ข้อ (โดย @Jesselpetry)",
          en: "Integrated PSCP Week 8-9 problems with verified reference solutions and AST concept tags (by @Jesselpetry)",
        },
      },
      {
        kind: "added",
        text: {
          th: "โจทย์แนะนำเพิ่มเป็น 14 ข้อ (BigFrame, Left Arrow, กองชาม, Shorten) พร้อมคู่มือ 2 ภาษา (โดย @Jesselpetry)",
          en: "Added 4 new recommended problems (BigFrame, Left Arrow, Bowl Stack, Shorten) with bilingual guides (by @Jesselpetry)",
        },
      },
      {
        kind: "added",
        text: {
          th: "สคริปต์ตรวจความถูกต้องของเฉลยอ้างอิงทั้งคลัง scripts/verify_solutions.py (โดย @Jesselpetry)",
          en: "Generalised solution verifier script across entire problem registry (by @Jesselpetry)",
        },
      },
      {
        kind: "changed",
        text: {
          th: "หน้ารายการโจทย์ PSCP แสดงผลแบบตาราง (Table View) เป็นค่าเริ่มต้น พร้อมมาตรวัดความยากดาว 5 ดวง (โดย @Jesselpetry)",
          en: "Reworked PSCP problem list with table view default, concept badges, and 5-star difficulty (by @Jesselpetry)",
        },
      },
    ],
  },
  {
    version: "0.6.0",
    date: "2026-08-30",
    commit: "e0f09e9",
    contributors: [CONTRIBUTORS.chatan],
    changes: [
      {
        kind: "added",
        text: {
          th: "ระบบบัญชีผู้ใช้และยืนยันตัวตนด้วย Google @kmitl.ac.th ตรวจรหัสคณะ IT 8 หลัก (โดย @Jesselpetry)",
          en: "User accounts and authentication enforcing @kmitl.ac.th 8-digit IT student ID verification (by @Jesselpetry)",
        },
      },
      {
        kind: "added",
        text: {
          th: "หน้าโปรไฟล์นักศึกษาสาธารณะ /profile/[รหัส] พร้อมตัวนับผู้เข้าชมที่เคารพความเป็นส่วนตัวที่ Footer (โดย @Jesselpetry)",
          en: "Public student profiles (/profile/[id]) and privacy-preserving visitor counter in footer (by @Jesselpetry)",
        },
      },
      {
        kind: "added",
        text: {
          th: "ย้ายสื่อการเรียนรู้ทั้งหมดออกจาก Git ไปเก็บยัง Supabase Storage แยก Bucket สาธารณะและ Bucket ข้อสอบลับ (โดย @Jesselpetry)",
          en: "Migrated all learning media from Git to Supabase Storage with public and restricted exam buckets (by @Jesselpetry)",
        },
      },
      {
        kind: "security",
        text: {
          th: "กั้นสิทธิ์คลังทรัพยากรเฉพาะนักศึกษาคณะ IT ที่ล็อกอิน และกั้นข้อสอบเก่าเฉพาะ Insider (โดย @Jesselpetry)",
          en: "Restricted resource library to authenticated IT students and past exam papers to insiders only (by @Jesselpetry)",
        },
      },
    ],
  },
  {
    version: "0.5.2",
    date: "2026-08-26",
    commit: "1b82b9b",
    contributors: [CONTRIBUTORS.chatan],
    changes: [
      {
        kind: "added",
        text: {
          th: "รวมเส้นทางรายวิชาทั้งหมดเป็นต้นไม้เดียว /courses/[dir] และฮับห้องแลป /pscp (โดย @Jesselpetry)",
          en: "Unified /courses/[dir] route tree for all courses and dedicated /pscp lab hub (by @Jesselpetry)",
        },
      },
      {
        kind: "added",
        text: {
          th: "พิมพ์เขียวการเรียนรู้ 11 โมดูลมาตรฐาน (lib/spine.ts) เชื่อมโยงทุกรายวิชาเข้าด้วยกัน (โดย @Jesselpetry)",
          en: "Standardised 11-module learning spine (lib/spine.ts) binding every course to the same contract (by @Jesselpetry)",
        },
      },
      {
        kind: "added",
        text: {
          th: "นำเข้าชุดสื่อการเรียนปี 1 จากคลัง kmitl-archive (662 ไฟล์) และเวิร์กโฟลว์จัดการไฟล์ _dropzone/ (โดย @Jesselpetry)",
          en: "Ingested Year-1 media archive (662 files) and introduced agent-driven _dropzone/ file intake workflow (by @Jesselpetry)",
        },
      },
      {
        kind: "changed",
        text: {
          th: "บีบอัดเอกสาร PDF ทั้งหมดผ่าน Visual Regression Gate ลดขนาดลง 32% (โดย @Jesselpetry)",
          en: "Recompressed PDFs behind visual regression gate reducing total size by 32% (by @Jesselpetry)",
        },
      },
      {
        kind: "changed",
        text: {
          th: "ปรับชื่อไฟล์สื่อการสอนทั้งหมดเป็นรูปแบบมาตรฐาน kebab-case (โดย @Jesselpetry)",
          en: "Sanitised all asset filenames to standard kebab-case across public/assets/ (by @Jesselpetry)",
        },
      },
      {
        kind: "fixed",
        text: {
          th: "แก้ไขปัญหาสูตรคณิตศาสตร์ $$...$$ หลายบรรทัดกลืนเนื้อหาในตัวอ่าน Markdown (โดย @Jesselpetry)",
          en: "Fixed multi-line KaTeX display math swallowing following document text in MdView (by @Jesselpetry)",
        },
      },
    ],
  },
  {
    version: "0.5.1",
    date: "2026-08-22",
    commit: "319b244",
    contributors: [CONTRIBUTORS.chatan],
    changes: [
      {
        kind: "added",
        text: {
          th: "ขยายฮับสู่หลายรายวิชา — CE-KMITL, EN-KMITL (ข้อสอบเคมี 60 ข้อ และคอมโปร), ICS Digital Logic และ MFIT Linear Algebra (โดย @Jesselpetry)",
          en: "Expanded course hubs to CE, EN-KMITL (Chem 60-q mock & ComPro), ICS Digital Logic, and MFIT (by @Jesselpetry)",
        },
      },
      {
        kind: "added",
        text: {
          th: "แผนอ่านติวเข้ม MFIT 6 ชั่วโมง พร้อมชุดฝึกจับเวลา และสรุปตามพิมพ์เขียวข้อสอบจริง (โดย @Jesselpetry)",
          en: "MFIT cram summary, 6-hour study plan, timed drill, and 20-question blueprint quiz (by @Jesselpetry)",
        },
      },
      {
        kind: "added",
        text: {
          th: "สารบัญด้านข้างแบบโต้ตอบ (Interactive Real-Time TOC) พร้อม Scroll Spy ในหน้าอ่านเอกสาร (โดย @Jesselpetry)",
          en: "Interactive real-time TOC side panel with scroll spy, reading progress, and search filter (by @Jesselpetry)",
        },
      },
    ],
  },
  {
    version: "0.5.0",
    date: "2026-08-17",
    commit: "6cac82c",
    contributors: [CONTRIBUTORS.chatan, CONTRIBUTORS.pgthegod],
    changes: [
      {
        kind: "added",
        text: {
          th: "ฮับโจทย์แนะนำ 10 ข้อหลัก (/recommended) พร้อมบทวิเคราะห์จุดสำคัญและสถิติจริงจาก iJudge (โดย @Jesselpetry)",
          en: "Recommended problems hub (/recommended) with 10 core pattern problems and scraped iJudge stats (by @Jesselpetry)",
        },
      },
      {
        kind: "added",
        text: {
          th: "ระบบ Client-Side Python Grader ตรวจโค้ดในเบราว์เซอร์ 100% ด้วย WebAssembly (Pyodide in Web Worker) (โดย @Jesselpetry)",
          en: "Client-side Python grader running in Web Worker via WebAssembly Pyodide (by @Jesselpetry)",
        },
      },
      {
        kind: "added",
        text: {
          th: "ระบบ Technique Quiz Active-Recall 60 ข้อ พร้อมคำอธิบาย 2 ภาษา (โดย @Jesselpetry)",
          en: "Active-recall technique quiz bank with 60 questions and bilingual explanations (by @Jesselpetry)",
        },
      },
      {
        kind: "added",
        text: {
          th: "หน้าจอ Splitter Panel Workspace ลากปรับขนาดได้ พร้อม Foldable Expected I/O และ Diff View (โดย @Jesselpetry)",
          en: "Resizable splitter panel workspace with foldable test cases and expected I/O diff view (by @Jesselpetry)",
        },
      },
      {
        kind: "added",
        text: {
          th: "ระบบตรวจสอบสไตล์โค้ด PEP-8 & PSCP Rules และคีย์ลัดสั่งรันโค้ดทันที (โดย @Jesselpetry)",
          en: "PEP-8 and PSCP rule style checker with Cmd+Enter keyboard shortcut execution (by @Jesselpetry)",
        },
      },
      {
        kind: "changed",
        text: {
          th: "ยกระดับ UI มือถือเต็มรูปแบบ แท็บปรับตามความกว้างจอ และตัวแปร CSS สำหรับ Split Layout (โดย @Jesselpetry)",
          en: "Polished mobile responsiveness with adaptive tabs and fluid responsive CSS split variables (by @Jesselpetry)",
        },
      },
      {
        kind: "fixed",
        text: {
          th: "แก้ไขการ Hydrate ข้อมูล Primitive String ใน useDraft ป้องกันข้อผิดพลาด [object Object] (โดย @Jesselpetry)",
          en: "Fixed useDraft primitive string hydration issue preventing [object Object] serialization (by @Jesselpetry)",
        },
      },
    ],
  },
  {
    version: "0.4.2",
    date: "2026-08-13",
    commit: "de8ce4b",
    contributors: [CONTRIBUTORS.pgthegod, CONTRIBUTORS.chatan],
    changes: [
      {
        kind: "added",
        text: {
          th: "หน้า Landing Page /pro สำหรับ PG IJUDGE · VS Code Extension แนะนำส่วนขยายส่งโค้ดตรงเข้า iJudge, รันเทสต์ในเครื่อง, เทสต์เคสซ่อน, ทำงานออฟไลน์ และขอรับ License Key ผ่าน IG @pgthegod_x (โดย @PGTHEGOD)",
          en: "PG IJUDGE VS Code Extension landing page (/pro) showcasing direct submissions, local sample runner, hidden test cases, and license requests via IG @pgthegod_x (by @PGTHEGOD)",
        },
      },
      {
        kind: "changed",
        text: {
          th: "ผูก Metadata SEO และโครงสร้างเส้นทางสำหรับส่วนขยายเครื่องมือช่วยเขียนโค้ด (โดย @PGTHEGOD)",
          en: "Integrated SEO metadata, Open Graph cards, and top-level route routing for PG IJUDGE (by @PGTHEGOD)",
        },
      },
    ],
  },
  {
    version: "0.4.1",
    date: "2026-07-31",
    commit: "22c4528",
    contributors: [CONTRIBUTORS.chatan],
    changes: [
      {
        kind: "added",
        text: {
          th: "แบนเนอร์ประกาศเตรียมตัวสอบสัมภาษณ์โค้ด (Code Interview) (โดย @Jesselpetry)",
          en: "Announcement banner for upcoming PSCP Code Interview (by @Jesselpetry)",
        },
      },
      {
        kind: "added",
        text: {
          th: "เพิ่มชุดโจทย์ OJ Week 4 และ Week 5 (รหัส 3101–3116) พร้อมตรวจสถานะซิงก์ (โดย @Jesselpetry)",
          en: "Added OJ problems for Week 4 and Week 5 (ids 3101-3116) with sync verification (by @Jesselpetry)",
        },
      },
      {
        kind: "changed",
        text: {
          th: "แผงพรีวิวไฟล์เลื่อนไปยังไฟล์ที่รอ Push อัตโนมัติ (Auto-scroll target preview) (โดย @Jesselpetry)",
          en: "Auto-scrolled target preview panel to pending unpushed file (by @Jesselpetry)",
        },
      },
    ],
  },
  {
    version: "0.4.0",
    date: "2026-07-21",
    commit: "0f7b7ce",
    contributors: [CONTRIBUTORS.meaookung, CONTRIBUTORS.chatan],
    changes: [
      {
        kind: "added",
        text: {
          th: "ระบบเชื่อมต่อ GitHub OAuth และ Push ไฟล์ submission.md / ai_reflection.md เข้า Repository โดยตรง (โดย @Meaookung144)",
          en: "Direct edit submission and push to GitHub repository via OAuth integration (by @Meaookung144)",
        },
      },
      {
        kind: "added",
        text: {
          th: "ตัวแก้ไขไฟล์ออนไลน์ (/repo) ตรวจทานและแก้ไขโค้ดใน Repo ก่อนกด Push (โดย @Meaookung144)",
          en: "Online repository file viewer and editor before committing to GitHub (by @Meaookung144)",
        },
      },
      {
        kind: "added",
        text: {
          th: "หน้าประวัติเวอร์ชันและผู้ร่วมพัฒนา (/version) พร้อม Changelog workflow (โดย @Jesselpetry)",
          en: "Version history page (/version) and standardized changelog release workflow (by @Jesselpetry)",
        },
      },
      {
        kind: "changed",
        text: {
          th: "ปรับปรุง Navbar รองรับ Mobile Responsive พร้อมเมนู Hamburger และ Contributor Avatars (โดย @Jesselpetry)",
          en: "Mobile-responsive navbar with hamburger drawer and contributor avatar showcases (by @Jesselpetry)",
        },
      },
      {
        kind: "fixed",
        text: {
          th: "ปรับปรุงการทำงานของ Folder Component ในหน้าจัดการ Repo (โดย @Meaookung144)",
          en: "Fixed folder tree component rendering in repository explorer (by @Meaookung144)",
        },
      },
    ],
  },
  {
    version: "0.3.0",
    date: "2026-07-20",
    commit: "e2f4b32",
    contributors: [CONTRIBUTORS.chatan],
    changes: [
      {
        kind: "added",
        text: {
          th: "ระบบสลับธีม Light / Dark Mode พร้อมปุ่ม Toggle แอนิเมชันนุ่มนวล (โดย @Jesselpetry)",
          en: "Theme system (light/dark) with animated toggle button (by @Jesselpetry)",
        },
      },
    ],
  },
  {
    version: "0.2.0",
    date: "2026-07-18",
    commit: "9f653a5",
    contributors: [CONTRIBUTORS.chatan],
    changes: [
      {
        kind: "added",
        text: {
          th: "ประกาศเปิดโจทย์ Week 3 (โดย @Jesselpetry)",
          en: "Announced Week 3 problems opening (by @Jesselpetry)",
        },
      },
      {
        kind: "changed",
        text: {
          th: "ปรับปรุงการจัดเรียงโจทย์และเพิ่มคีย์ลัดประจำสัปดาห์ lib/shortcuts.ts (โดย @Jesselpetry)",
          en: "Updated problem sorting and weekly shortcuts in lib/shortcuts.ts (by @Jesselpetry)",
        },
      },
      {
        kind: "changed",
        text: {
          th: "อัปเดตข้อมูลโจทย์ใน data/oj_problems.json (โดย @Jesselpetry)",
          en: "Refreshed problem list in data/oj_problems.json (by @Jesselpetry)",
        },
      },
    ],
  },
  {
    version: "0.1.1",
    date: "2026-07-13",
    commit: "1c1136f",
    contributors: [CONTRIBUTORS.chatan],
    changes: [
      {
        kind: "changed",
        text: {
          th: "บังคับยืนยันว่าอ่านเงื่อนไขและแนวปฏิบัติ AI ของวิชาก่อนดาวน์โหลดไฟล์ ป้องกันการส่งงานโดยไม่อ่านกติกา (โดย @Jesselpetry)",
          en: "Gate downloads behind read confirmation to ensure students review AI guidelines first (by @Jesselpetry)",
        },
      },
      {
        kind: "fixed",
        text: {
          th: "แก้ไข Path การสร้างไฟล์ของโจทย์ Week 2 (โดย @Jesselpetry)",
          en: "Fixed file generation path for Week 2 problems (by @Jesselpetry)",
        },
      },
    ],
  },
  {
    version: "0.1.0",
    date: "2026-07-12",
    commit: "c288176",
    contributors: [CONTRIBUTORS.chatan],
    changes: [
      {
        kind: "added",
        text: {
          th: "ระบบสร้าง submission.md และ ai_reflection.md สำหรับวิชา PSCP ทีละขั้นตอน (Wizard) (โดย @Jesselpetry)",
          en: "Step-by-step wizard for generating submission.md and ai_reflection.md for PSCP (by @Jesselpetry)",
        },
      },
      {
        kind: "added",
        text: {
          th: "รายการโจทย์พร้อมระดับความยาก วันหมดเขต และแท็บกรองรายสัปดาห์ (โดย @Jesselpetry)",
          en: "Problem registry with difficulty, deadlines, and weekly filter tabs (by @Jesselpetry)",
        },
      },
      {
        kind: "added",
        text: {
          th: "หน้า /library อ่านเอกสารแนวปฏิบัติการใช้ AI ของวิชา PSCP (โดย @Jesselpetry)",
          en: "/library page for reading the official AI Guidelines for PSCP (by @Jesselpetry)",
        },
      },
      {
        kind: "added",
        text: {
          th: "หน้า /history จัดเก็บประวัติไฟล์ที่เคยสร้างไว้ในเครื่อง (โดย @Jesselpetry)",
          en: "/history page storing previously generated files locally (by @Jesselpetry)",
        },
      },
      {
        kind: "added",
        text: {
          th: "ระบบบันทึกแบบร่างอัตโนมัติแยกตามโจทย์ และหน้า Splash Screen (โดย @Jesselpetry)",
          en: "Auto-saved drafts per problem, plus a welcoming splash screen (by @Jesselpetry)",
        },
      },
      {
        kind: "changed",
        text: {
          th: "ปรับปรุงสีทั่วทั้งเว็บไซต์ให้ผ่านมาตรฐานความคมชัด WCAG AA (โดย @Jesselpetry)",
          en: "Adjusted site-wide color contrast to comply with WCAG AA accessibility standards (by @Jesselpetry)",
        },
      },
      {
        kind: "fixed",
        text: {
          th: "ปรับแก้ไอคอน Instagram และ case ของข้อความบางจุด (โดย @Jesselpetry)",
          en: "Fixed Instagram icon rendering and casing in multiple headings (by @Jesselpetry)",
        },
      },
    ],
  },
];

/** Get the latest stable release or current version */
export function getCurrentVersion(): VersionEntry {
  return CHANGELOG[0];
}
