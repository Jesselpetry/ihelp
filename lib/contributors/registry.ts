import type { ContributorProfile } from "./types";
import { calculateAcademicYear, facultyFromStudentId } from "./academic-year";
import { majorLabel } from "@/lib/courses/majors";

export const CONTRIBUTOR_REGISTRY: Record<string, ContributorProfile> = {
  chatan: {
    id: "chatan",
    name: "Chatan Petry",
    nickname: "Jess",
    studentId: "69070027",
    entryYearBE: 2569,
    majorKey: "IT",
    department: {
      th: "เทคโนโลยีสารสนเทศ (IT)",
      en: "Information Technology (IT)",
    },
    faculty: {
      th: "คณะเทคโนโลยีสารสนเทศ",
      en: "Faculty of Information Technology",
    },
    cohort: "IT24",
    avatarUrl: "https://github.com/Jesselpetry.png",
    avatarFallback: "CP",
    roles: ["lead-maintainer", "core-developer"],
    primaryRole: {
      th: "ผู้ก่อตั้งและผู้ดูแลหลัก (Lead Maintainer)",
      en: "Creator & Lead Maintainer",
    },
    bio: {
      th: "สถาปัตยกรรมหลักของ iHelp, ระบบตัดเกรด, ธีมมืด Figma, แผนที่ผังสอบ, คลังเอกสาร และเครื่องมือเตรียมสอบ",
      en: "Core architecture of iHelp, Grade Calculator, Figma dark theme, Exam Seating, Library & Exam tools",
    },
    socials: {
      github: "Jesselpetry",
      instagram: "chatann_",
      email: "69070027@kmitl.ac.th",
    },
    profilePath: "/profile/69070027",
    courses: ["ALL", "ITF", "ICS", "MFIT", "PSCP", "COMPRO", "CHEM", "FE", "CHARM", "SPORT"],
    materials: [
      {
        courseCode: "ALL",
        title: {
          th: "ระบบเส้นทางการเรียนรู้รายวิชาและคลังสื่อการเรียนรู้",
          en: "Course Weekly Learning Path & Learning Media Library",
        },
        type: "tool",
        badge: { th: "ระบบหลัก", en: "Core Engine" },
      },
      {
        courseCode: "ICS",
        title: {
          th: "สรุปภาพรวมและจุดระวังสอบกลางภาค ICS (19 Pitfalls)",
          en: "ICS Midterm Summary & 19 Pitfalls Checklist",
        },
        type: "sheet",
        url: "/courses/06016411-Intro-to-Computer-Systems/summary",
        badge: { th: "สรุปหลัก", en: "Summary" },
      },
      {
        courseCode: "MFIT",
        title: {
          th: "คู่มือทบทวนและกลยุทธ์ทำข้อสอบ Math for IT (Q1–Q10)",
          en: "MFIT Exam Strategy & Crash Guide (Q1–Q10)",
        },
        type: "sheet",
        url: "/courses/06016401-Math-for-IT/summary",
        badge: { th: "กลยุทธ์สอบ", en: "Strategy" },
      },
      {
        courseCode: "COMPRO",
        title: {
          th: "สรุปเนื้อหา Computer Programming 5 บทเรียนและ Appendix",
          en: "Computer Programming 5 Chapters & Appendix Summary",
        },
        type: "sheet",
        url: "/courses/01006012-Computer-Programming/summary",
        badge: { th: "สรุปครบ", en: "Full Recap" },
      },
    ],
  },

  phuPunnavit: {
    id: "phuPunnavit",
    name: "Punnavit Tangkolchan",
    nickname: "Phu",
    studentId: "69070119",
    entryYearBE: 2569,
    majorKey: "IT",
    department: {
      th: "เทคโนโลยีสารสนเทศ (IT)",
      en: "Information Technology (IT)",
    },
    faculty: {
      th: "คณะเทคโนโลยีสารสนเทศ",
      en: "Faculty of Information Technology",
    },
    cohort: "IT24",
    avatarUrl: "https://github.com/PhuPunnavit.png",
    avatarFallback: "PT",
    roles: ["core-developer", "content-contributor", "translator"],
    primaryRole: {
      th: "ผู้ร่วมพัฒนาหลัก & แปลสไลด์สรุป (Core Contributor)",
      en: "Core Developer & Slide Translator",
    },
    bio: {
      th: "ผู้พัฒนาระบบ Help-Desk Chat Widget และผู้แปลสไลด์บรรยายสรุปวิชา ITF ฉบับภาษาไทยสัปดาห์ที่ 08–15",
      en: "Developer of Help-Desk Chat Widget and Thai translated lecture slide summaries for ITF Weeks 08–15",
    },
    socials: {
      github: "PhuPunnavit",
      instagram: "priiu_i",
      email: "69070119@kmitl.ac.th",
    },
    courses: ["ITF"],
    materials: [
      {
        courseCode: "ITF",
        title: {
          th: "สไลด์สรุปเนื้อหาบรรยาย ITF ฉบับแปลไทย Week 08–15 (PDF 8 สัปดาห์)",
          en: "Thai Translated Lecture Slide Summaries for ITF Weeks 08–15 (8 PDFs)",
        },
        type: "slide",
        description: {
          th: "แปลและสรุปเนื้อหาสไลด์ภาษาไทยทีละหัวข้อ: Database, Ethics, Enterprise, Internet, Computer Networks, Wireless, Web Tech และ Digital Skills",
          en: "Detailed Thai summaries matching instructor lecture slides for Weeks 08 to 15",
        },
        badge: { th: "สไลด์แปลไทย", en: "Thai Slides" },
      },
      {
        courseCode: "ITF",
        title: {
          th: "ระบบแชทผู้ช่วยตอบคำถาม Help Desk Chat Widget",
          en: "Help Desk Assistant Chat Widget",
        },
        type: "tool",
        badge: { th: "ฟีเจอร์", en: "Feature" },
      },
    ],
  },

  tammadon: {
    id: "tammadon",
    name: "Tammadon Suksa",
    nickname: "Bank",
    studentId: "69070082",
    entryYearBE: 2569,
    cohort: "IT24",
    faculty: {
      th: "คณะเทคโนโลยีสารสนเทศ",
      en: "Faculty of Information Technology",
    },
    department: {
      th: "เทคโนโลยีสารสนเทศ (IT)",
      en: "Information Technology (IT)",
    },
    avatarUrl: "https://github.com/identicons/tammadon.png",
    avatarFallback: "TS",
    roles: ["content-contributor", "note-author"],
    primaryRole: {
      th: "ผู้ร่วมแบ่งปันบันทึกสรุป Notion (IT24)",
      en: "Notion Study Notes Author (IT24)",
    },
    bio: {
      th: "เพื่อนร่วมรุ่น IT24 ผู้จัดทำและแบ่งปันโน้ตสรุปวิชา ITF สัปดาห์ที่ 08–15 บน Notion พร้อม 79 ภาพสไลด์จดคำอธิบายละเอียด",
      en: "IT24 classmate who authored and shared comprehensive ITF Notion notes for Weeks 08–15 with 79 annotated slide images",
    },
    socials: {
      email: "69070082@kmitl.ac.th",
      notion: "https://app.notion.com/p/ITF-407363d85cea806abdc6c9ec2254f668",
    },
    courses: ["ITF"],
    materials: [
      {
        courseCode: "ITF",
        title: {
          th: "บันทึกสรุปการเรียน Notion วิชา ITF สัปดาห์ที่ 08–15 (79 ภาพสไลด์พร้อมจดเลกเชอร์)",
          en: "ITF Notion Study Notes for Weeks 08–15 (79 Annotated Slide Images)",
        },
        type: "notes",
        description: {
          th: "จดโน้ตทับสไลด์จริง อธิบายศัพท์เฉพาะ แนะนำระดับความเน้นสอบปลายภาค และสรุปประเด็นสำคัญในทุกสัปดาห์",
          en: "Slide annotations, key vocabulary, exam weight highlights, and conceptual walkthroughs across 8 weeks",
        },
        url: "https://app.notion.com/p/ITF-407363d85cea806abdc6c9ec2254f668",
        badge: { th: "79 หน้าสไลด์", en: "79 Slides" },
      },
    ],
  },

  pgthegod: {
    id: "pgthegod",
    name: "Akarapach Yootsukprasert",
    nickname: "Park",
    studentId: "69070225",
    entryYearBE: 2569,
    majorKey: "IT",
    department: {
      th: "เทคโนโลยีสารสนเทศ (IT)",
      en: "Information Technology (IT)",
    },
    faculty: {
      th: "คณะเทคโนโลยีสารสนเทศ",
      en: "Faculty of Information Technology",
    },
    cohort: "IT24",
    avatarUrl: "https://github.com/PGTHEGOD.png",
    avatarFallback: "AY",
    roles: ["developer"],
    primaryRole: {
      th: "ผู้ร่วมพัฒนา (Contributor)",
      en: "Contributor",
    },
    bio: {
      th: "หน้า Landing Page /pro และการผูกระบบสำหรับ PG IJUDGE VS Code Extension",
      en: "/pro landing page and integration for PG IJUDGE VS Code Extension",
    },
    socials: {
      github: "PGTHEGOD",
      instagram: "pgthegod_x",
      email: "69070225@kmitl.ac.th",
    },
    courses: ["PSCP"],
    materials: [
      {
        courseCode: "PSCP",
        title: {
          th: "หน้า Landing Page /pro และระบบเชื่อมต่อ PG IJUDGE Extension",
          en: "/pro Landing Page & PG IJUDGE Extension Integration",
        },
        type: "tool",
        url: "/pro",
        badge: { th: "PG IJUDGE", en: "Extension" },
      },
    ],
  },

  meaookung: {
    id: "meaookung",
    name: "Kittinan Atthasiri (Meao)",
    nickname: "Meao",
    studentId: "6907xxxx", // Placeholder
    entryYearBE: 2569,
    majorKey: "IT",
    department: {
      th: "เทคโนโลยีสารสนเทศ (IT)",
      en: "Information Technology (IT)",
    },
    faculty: {
      th: "คณะเทคโนโลยีสารสนเทศ",
      en: "Faculty of Information Technology",
    },
    cohort: "IT24",
    avatarUrl: "https://github.com/Meaookung144.png",
    avatarFallback: "KA",
    roles: ["developer"],
    primaryRole: {
      th: "ผู้ร่วมพัฒนา (Contributor)",
      en: "Contributor",
    },
    bio: {
      th: "ระบบฟอร์มแก้ไขไฟล์ส่งงาน PSCP และระบบ Learning Log Direct Edit",
      en: "PSCP Submission management and Learning Log direct edit workflow",
    },
    socials: {
      github: "Meaookung144",
      instagram: "meaookung144",
      email: "6907xxxx@kmitl.ac.th",
    },
    courses: ["PSCP"],
    materials: [
      {
        courseCode: "PSCP",
        title: {
          th: "ระบบฟอร์มแก้ไขไฟล์ส่งงาน PSCP (Submission Wizard)",
          en: "PSCP Submission Wizard & Direct Markdown Edit",
        },
        type: "tool",
        url: "/pscp",
        badge: { th: "PSCP Tool", en: "Tool" },
      },
    ],
  },

  fewIt25: {
    id: "fewIt25",
    name: "พี่ฟิว (Few IT25)",
    nickname: "Few",
    cohort: "IT25",
    faculty: {
      th: "คณะเทคโนโลยีสารสนเทศ",
      en: "Faculty of Information Technology",
    },
    department: {
      th: "เทคโนโลยีสารสนเทศ (IT)",
      en: "Information Technology (IT)",
    },
    avatarUrl: "https://github.com/identicons/few-it25.png",
    avatarFallback: "FW",
    roles: ["senior-mentor", "content-contributor"],
    primaryRole: {
      th: "รุ่นพี่ผู้จัดทำข้อสอบจำลอง (IT25)",
      en: "Senior Mock Exam Author (IT25)",
    },
    bio: {
      th: "รุ่นพี่ IT25 ผู้รวบรวมและเฉลยชุดโจทย์ข้อสอบจำลองกลางภาควิชา DSA และ OOP เพื่อให้น้อง ๆ ได้ฝึกฝนทักษะ",
      en: "Senior IT25 who authored and solved pre-midterm mock exam problem sets for DSA and OOP",
    },
    socials: {},
    courses: ["DSA", "OOP"],
    materials: [
      {
        courseCode: "DSA",
        title: {
          th: "ข้อสอบจำลองกลางภาค OOP & Data Structure (ปี 65 โดยพี่ฟิว)",
          en: "Pre-Midterm OOP & Data Structure Mock (2022 by P'Few)",
        },
        type: "mock_exam",
        badge: { th: "ข้อสอบจำลอง", en: "Mock Exam" },
      },
    ],
  },
};

/** Returns all registered contributor profiles */
export function getAllContributors(): ContributorProfile[] {
  return Object.values(CONTRIBUTOR_REGISTRY);
}

/** Looks up a contributor by ID or GitHub username */
export function getContributorById(idOrGithub: string): ContributorProfile | undefined {
  const normalized = idOrGithub.toLowerCase();
  return Object.values(CONTRIBUTOR_REGISTRY).find(
    (c) =>
      c.id.toLowerCase() === normalized ||
      c.socials.github?.toLowerCase() === normalized,
  );
}

/**
 * Returns all contributors who contributed to a given course.
 * Also includes lead maintainers if they have content in the course.
 */
export function getContributorsForCourse(courseCode: string): ContributorProfile[] {
  const code = courseCode.toUpperCase();
  return Object.values(CONTRIBUTOR_REGISTRY).filter((c) =>
    c.courses.includes("ALL") || c.courses.includes(code),
  );
}

/**
 * Returns enriched profile information including the dynamic academic year
 * calculated automatically from the contributor's student ID or entry year.
 */
export function getContributorWithAcademicYear(
  contributor: ContributorProfile,
  asOfDate: Date = new Date(),
) {
  const academic = calculateAcademicYear(
    contributor.studentId,
    contributor.entryYearBE,
    asOfDate,
    contributor.cohort,
  );

  const faculty =
    contributor.faculty ??
    facultyFromStudentId(contributor.studentId) ?? {
      th: "คณะเทคโนโลยีสารสนเทศ",
      en: "Faculty of Information Technology",
    };

  const major =
    contributor.department ??
    (contributor.majorKey
      ? { th: majorLabel(contributor.majorKey) ?? contributor.majorKey, en: contributor.majorKey }
      : undefined);

  return {
    ...contributor,
    academic,
    faculty,
    major,
  };
}

