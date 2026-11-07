import type { LText } from "@/lib/i18n";
import type { MajorKey } from "@/lib/courses/majors";

/**
 * Role taxonomy for all contributors in iHelp:
 * - Developers: core team, platform developers, maintainers
 * - Content authors: summary sheets, slide translators, lecture note writers
 * - Mentors: seniors who shared prior mock exams or guidelines
 */
export type ContributorRole =
  | "lead-maintainer"     // ผู้ก่อตั้งและผู้ดูแลหลัก (Lead Maintainer)
  | "core-developer"      // ผู้พัฒนาหลัก (Core Contributor / Developer)
  | "developer"           // ผู้ร่วมพัฒนา (Contributor)
  | "content-contributor" // ผู้ร่วมจัดทำเนื้อหา (Content Contributor)
  | "translator"          // ผู้แปลและเรียบเรียง (Translator)
  | "note-author"         // ผู้เขียนบันทึกสรุปการเรียน (Note Author)
  | "senior-mentor";      // รุ่นพี่ผู้ร่วมแบ่งปันแนวทาง (Senior Mentor)

export interface ContributorMaterial {
  /** Course code matching catalog, e.g. "ITF", "ICS", "DSA", or "ALL" */
  courseCode: string;
  /** Title of the sheet, slide, note or feature */
  title: LText;
  /** Category of the contributed item */
  type: "sheet" | "slide" | "notes" | "mock_exam" | "code" | "tool" | "other";
  /** Optional detailed description of what was provided */
  description?: LText;
  /** Link to resource (Notion, PDF in library, external URL, or site route) */
  url?: string;
  /** Optional badge label like "79 หน้าสไลด์", "PDF 8 สัปดาห์", "VS Code" */
  badge?: LText;
}

export interface AcademicYearInfo {
  /** Current academic year in Buddhist Era (e.g. 2569) */
  academicYearBE: number;
  /** Year of admission in Buddhist Era (e.g. 2569, 2568, 2564) */
  admissionYearBE: number;
  /** Numeric year level (1 = Year 1, 2 = Year 2, ..., >4 = Alumni/Year 4+) */
  yearNumber: number;
  /** Bilingual label for the year level (e.g. "ชั้นปีที่ 1" / "1st Year") */
  yearLabel: LText;
  /** Whether the student has graduated or is beyond standard 4-year study */
  isAlumni: boolean;
  /** Cohort / Batch badge if available or deduced (e.g. "IT29", "IT24") */
  cohort?: string;
}

export interface ContributorSocials {
  github?: string;    // Handle without @ (e.g. "Jesselpetry")
  instagram?: string; // Handle without @ (e.g. "chatann_")
  facebook?: string;  // Full URL or handle
  linkedin?: string;  // Full URL or handle
  notion?: string;    // Full URL to Notion workspace / page
  website?: string;   // Full URL to personal blog / portfolio
  email?: string;     // Student or personal contact email
}

export interface ContributorProfile {
  /** Unique identifier, e.g. "chatan", "phuPunnavit", "tammadon" */
  id: string;
  /** Display name (bilingual or string) */
  name: string;
  /** Common nickname in class or online handle */
  nickname?: string;
  /**
   * KMITL Student ID (8 digits, e.g. "69070027", or masked like "6907xxxx").
   * Used by the automatic academic year calculation engine.
   */
  studentId?: string;
  /** Explicit admission BE year if studentId is not available */
  entryYearBE?: number;
  /** Faculty name (defaults to Faculty of Information Technology KMITL) */
  faculty?: LText;
  /** Major / Branch name */
  department?: LText;
  /** Major key from lib/courses/majors.ts (e.g. "IT", "DSBA", "AIT", "BIT") */
  majorKey?: MajorKey;
  /** Avatar image URL (GitHub avatar, KMITL photo or custom CDN URL) */
  avatarUrl: string;
  /** Fallback initials if image fails to load */
  avatarFallback?: string;
  /** Explicit cohort tag (e.g. "IT29", "IT28", "IT25", "IT24") */
  cohort?: string;
  /** List of assigned roles */
  roles: ContributorRole[];
  /** Primary role badge shown prominently in UI */
  primaryRole: LText;
  /** Short bio or summary of involvement */
  bio?: LText;
  /** Social channels and contact links */
  socials: ContributorSocials;
  /** Specific items / materials created */
  materials: ContributorMaterial[];
  /** List of course codes this contributor's work is featured in */
  courses: string[];
  /** Optional link to internal student profile page, e.g. "/profile/69070027" */
  profilePath?: string;
}

