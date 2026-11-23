import fs from "fs";
import path from "path";
import { ROOT } from "@/lib/paths";
import type { LText } from "@/lib/ltext";

export const DOCS_DIR = path.join(ROOT, "docs");

export interface DevDocMeta {
  slug: string;
  fileName: string;
  title: string;
  description: string;
  category: string;
  order: number;
}

export interface DevDocSection {
  id: string;
  title: LText;
  description?: LText;
  docs: DevDocMeta[];
}

export interface DevDocDetail extends DevDocMeta {
  content: string;
  section: DevDocSection;
  prev: DevDocMeta | null;
  next: DevDocMeta | null;
}

interface RawDocConfig {
  fileName: string;
  slug: string;
  category: "architecture" | "subsystems" | "standards" | "design";
  order: number;
  customTitle?: string;
  customDescription?: string;
}

const DOC_CONFIGS: RawDocConfig[] = [
  // 1. Architecture & Blueprints
  {
    fileName: "README.md",
    slug: "readme",
    category: "architecture",
    order: 1,
    customTitle: "Master Developer Hub & Architecture Blueprint",
    customDescription: "ศูนย์กลางคลังข้อมูลวิศวกรรม สถาปัตยกรรมระบบทั้ง 12 ส่วน และคู่มือแม่บท",
  },
  {
    fileName: "FULL_README.md",
    slug: "full-readme",
    category: "architecture",
    order: 2,
    customTitle: "Full README & Platform Overview",
    customDescription: "ภาพรวมแพลตฟอร์ม iHelp ทั้งหมด พันธกิจ และฟีเจอร์เด่นสำหรับนักศึกษา IT KMITL",
  },
  {
    fileName: "Current_Architecture_Report.md",
    slug: "current-architecture-report",
    category: "architecture",
    order: 3,
    customTitle: "State of the Architecture Report",
    customDescription: "รายงานการตรวจสอบสถานะสถาปัตยกรรมและประเด็นทางวิศวกรรมซอฟต์แวร์",
  },
  {
    fileName: "LEARNING_BLUEPRINT.md",
    slug: "learning-blueprint",
    category: "architecture",
    order: 4,
    customTitle: "Learning Blueprint & 11-Module Spine",
    customDescription: "พิมพ์เขียวการเรียนรู้และสัญญาข้อกำหนด 11 โมดูลของศูนย์การเรียนรู้รายวิชา",
  },

  // 2. Core Subsystems
  {
    fileName: "LIBRARY_ARCHITECTURE_AND_WORKFLOW.md",
    slug: "library-architecture-and-workflow",
    category: "subsystems",
    order: 1,
    customTitle: "Library Architecture & Workflow Guide",
    customDescription: "สถาปัตยกรรมคลังสื่อการเรียนรู้ Supabase Storage, Manifests และ Resource Index",
  },
  {
    fileName: "SCHEDULE_DATA_GUIDE.md",
    slug: "schedule-data-guide",
    category: "subsystems",
    order: 2,
    customTitle: "Schedule & Multi-Term Timetable Data Guide",
    customDescription: "คู่มือโครงสร้างข้อมูลตารางเรียน การบริหารจัดการหลายเทอม และการส่งต่อระบบ",
  },
  {
    fileName: "STUDY_SPACE.md",
    slug: "study-space",
    category: "subsystems",
    order: 3,
    customTitle: "Study Space & Exam Quota Tracker",
    customDescription: "ข้อกำหนดพื้นที่อ่านหนังสือส่วนบุคคล แผนรายวัน ตัวจับเวลา และโควตาสอบ 22 วัน",
  },
  {
    fileName: "CONTRIBUTOR_SYSTEM.md",
    slug: "contributor-system",
    category: "subsystems",
    order: 4,
    customTitle: "Contributor Attribution & Academic Promotion",
    customDescription: "ระบบจัดเก็บเครดิตผู้ร่วมพัฒนา โปรไฟล์นักศึกษา และตรรกะเลื่อนชั้นปีอัตโนมัติ",
  },

  // 3. Standards & SOPs
  {
    fileName: "COURSE_OVERVIEW_STANDARD.md",
    slug: "course-overview-standard",
    category: "standards",
    order: 1,
    customTitle: "Course Overview (summary.md) Standard",
    customDescription: "มาตรฐานโครงสร้างไฟล์สรุปภาพรวมรายวิชา summary.md และ blueprint.md",
  },
  {
    fileName: "DROPZONE_SOP.md",
    slug: "dropzone-sop",
    category: "standards",
    order: 2,
    customTitle: "Dropzone Ingestion SOP",
    customDescription: "ขั้นตอนมาตรฐานในการคัดแยก จัดหมวดหมู่ ตั้งชื่อ kebab-case และบีบอัดไฟล์สื่อ",
  },
  {
    fileName: "FILE_STRUCTURE.md",
    slug: "file-structure",
    category: "standards",
    order: 3,
    customTitle: "File Structure & Scope Taxonomy",
    customDescription: "ผังโครงสร้างโฟลเดอร์ นามบัญญัติไฟล์ และอนุกรมวิธานขอบเขตเนื้อหา",
  },
  {
    fileName: "VERSION_CONTROL_GUIDE.md",
    slug: "version-control-guide",
    category: "standards",
    order: 4,
    customTitle: "Version Control & Changelog Standard",
    customDescription: "มาตรฐานการตัดเวอร์ชัน SemVer บันทึกประวัติ และการผูกข้อมูลหน้ารายการเวอร์ชัน",
  },

  // 4. Design & Audits
  {
    fileName: "BRANDING.md",
    slug: "branding",
    category: "design",
    order: 1,
    customTitle: "Brand Identity & Style Guide",
    customDescription: "คู่มือมาตรฐานแบรนด์ iHelp การสะกดเครื่องหมายคำ <i\\>Help และรหัสสี",
  },
  {
    fileName: "FONTS.md",
    slug: "fonts",
    category: "design",
    order: 2,
    customTitle: "Typography & Font Family Standard",
    customDescription: "มาตรฐานการใช้งานฟอนต์ IBM Plex Sans Thai และการจัดลำดับชั้นตัวอักษร",
  },
  {
    fileName: "QUARANTINE_AUDIT.md",
    slug: "quarantine-audit",
    category: "design",
    order: 3,
    customTitle: "Quarantine Assets & PDPA Audit",
    customDescription: "รายงานตรวจสอบไฟล์กักกันความปลอดภัย สิทธิความเป็นส่วนตัว และการให้เครดิต",
  },
  {
    fileName: "FULL_CONTRIBUTING.md",
    slug: "full-contributing",
    category: "design",
    order: 4,
    customTitle: "Contribution Guidelines",
    customDescription: "คู่มือการร่วมพัฒนาเว็บไซต์ สำหรับนักศึกษา สรุปเนื้อหา หรือส่งโค้ดเข้าระบบ",
  },
];

const SECTIONS_CONFIG: Record<
  string,
  { title: LText; description: LText }
> = {
  architecture: {
    title: { th: "ภาพรวมและสถาปัตยกรรมระบบ", en: "Architecture & Blueprints" },
    description: {
      th: "เอกสารแม่บท พิมพ์เขียวสันแกน 11 โมดูล และรายงานสถานะระบบ",
      en: "Master blueprints, 11-module course spine, and architectural health reports.",
    },
  },
  subsystems: {
    title: { th: "ระบบและเครื่องมือหลัก", en: "Core Subsystems & Engines" },
    description: {
      th: "สถาปัตยกรรมคลังสื่อ ตารางเรียนหลายเทอม พื้นที่อ่านหนังสือ และระบบเครดิต",
      en: "Media library, timetable engine, personal study space, and contributor system.",
    },
  },
  standards: {
    title: { th: "มาตรฐานและขั้นตอนปฏิบัติ (SOP)", en: "Standards & SOPs" },
    description: {
      th: "มาตรฐานโครงสร้างไฟล์ การนำเข้าสื่อ Dropzone และการจัดการเวอร์ชัน",
      en: "File contracts, dropzone ingestion procedures, and version control guidelines.",
    },
  },
  design: {
    title: { th: "การออกแบบ ความปลอดภัย และการร่วมพัฒนา", en: "Design, Security & Audits" },
    description: {
      th: "คู่มือแบรนด์ การจัดวรรณยุกต์และฟอนต์ การตรวจสอบ PDPA และแนวทางร่วมพัฒนา",
      en: "Brand style guide, font discipline, PDPA safety audit, and contributing guide.",
    },
  },
};

function extractTitleAndDescription(
  content: string,
  fallbackTitle: string,
  fallbackDesc: string
): { title: string; description: string } {
  const headingMatch = content.match(/^#\s+(.+)$/m);
  const rawTitle = headingMatch ? headingMatch[1].trim() : fallbackTitle;
  // Clean markdown links or formatting in title
  const cleanTitle = rawTitle.replace(/\[(.*?)\]\(.*?\)/g, "$1").replace(/[#*`_]/g, "");

  // Look for blockquote or first paragraph as description
  const blockquoteMatch = content.match(/^>\s*\*\*?(.*?)\*\*?$/m) || content.match(/^>\s*(.+)$/m);
  let description = fallbackDesc;
  if (blockquoteMatch && blockquoteMatch[1]) {
    description = blockquoteMatch[1].replace(/[#*`_]/g, "").trim();
  }

  return { title: cleanTitle || fallbackTitle, description: description || fallbackDesc };
}

export function getDeveloperDocs(): DevDocSection[] {
  const sectionsMap = new Map<string, DevDocMeta[]>();

  for (const catKey of Object.keys(SECTIONS_CONFIG)) {
    sectionsMap.set(catKey, []);
  }

  for (const cfg of DOC_CONFIGS) {
    const filePath = path.join(DOCS_DIR, cfg.fileName);
    if (!fs.existsSync(filePath)) continue;

    let title = cfg.customTitle || cfg.fileName;
    let description = cfg.customDescription || "";

    try {
      const content = fs.readFileSync(filePath, "utf-8");
      const extracted = extractTitleAndDescription(content, title, description);
      if (!cfg.customTitle) title = extracted.title;
      if (!cfg.customDescription) description = extracted.description;
    } catch {
      // ignore read error
    }

    const meta: DevDocMeta = {
      slug: cfg.slug,
      fileName: cfg.fileName,
      title,
      description,
      category: cfg.category,
      order: cfg.order,
    };

    const list = sectionsMap.get(cfg.category) || [];
    list.push(meta);
    sectionsMap.set(cfg.category, list);
  }

  const sections: DevDocSection[] = [];
  for (const [catKey, metaList] of sectionsMap.entries()) {
    metaList.sort((a, b) => a.order - b.order);
    sections.push({
      id: catKey,
      title: SECTIONS_CONFIG[catKey].title,
      description: SECTIONS_CONFIG[catKey].description,
      docs: metaList,
    });
  }

  return sections;
}

export function getAllDocMetas(): DevDocMeta[] {
  const sections = getDeveloperDocs();
  const all: DevDocMeta[] = [];
  for (const s of sections) {
    all.push(...s.docs);
  }
  return all;
}

export function getDocBySlug(slug: string): DevDocDetail | null {
  const normalizedSlug = slug.toLowerCase().trim();
  const allDocs = getAllDocMetas();

  const index = allDocs.findIndex(
    (d) =>
      d.slug.toLowerCase() === normalizedSlug ||
      d.fileName.toLowerCase() === normalizedSlug ||
      d.fileName.toLowerCase().replace(/\.md$/, "") === normalizedSlug
  );

  if (index === -1) return null;

  const currentMeta = allDocs[index];
  const filePath = path.join(DOCS_DIR, currentMeta.fileName);
  if (!fs.existsSync(filePath)) return null;

  const content = fs.readFileSync(filePath, "utf-8");
  const sections = getDeveloperDocs();
  const section =
    sections.find((s) => s.id === currentMeta.category) || {
      id: currentMeta.category,
      title: { th: currentMeta.category, en: currentMeta.category },
      docs: [currentMeta],
    };

  const prev = index > 0 ? allDocs[index - 1] : null;
  const next = index < allDocs.length - 1 ? allDocs[index + 1] : null;

  return {
    ...currentMeta,
    content,
    section,
    prev,
    next,
  };
}
