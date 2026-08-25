import type { LText } from "@/lib/i18n";
import type { SubjectChapter } from "@/components/subject-hub";
import { loadCourseOverview } from "@/lib/course-content";
import { resolveCourse } from "@/lib/catalog";

// Pre-registered interactive quizzes chapters
import { ITF_CHAPTERS } from "@/lib/itf-quiz";
import { ICS_CHAPTERS } from "@/lib/ics-quiz";
import { MFIT_CHAPTERS } from "@/lib/mfit-quiz";
import { EN_KMITL_CHAPTERS } from "@/lib/en-kmitl-quiz";
import { CHEM_CHAPTERS } from "@/lib/chem-quiz";

export interface CourseChapterConfig {
  chapterLabel?: LText;
  chapters: SubjectChapter[];
}

/**
 * Standardized course chapters and weekly scopes derived from
 * iLearn's content/summaries blueprints.
 */
export const COURSE_CHAPTERS_MAP: Record<string, CourseChapterConfig> = {
  ITF: {
    chapterLabel: { th: "Lecture", en: "Lecture" },
    chapters: ITF_CHAPTERS,
  },
  ICS: {
    chapterLabel: { th: "บทที่", en: "Ch." },
    chapters: ICS_CHAPTERS,
  },
  MFIT: {
    chapterLabel: { th: "สัปดาห์ที่", en: "Week" },
    chapters: MFIT_CHAPTERS,
  },
  OOP: {
    chapterLabel: { th: "บทที่", en: "Ch." },
    chapters: [
      { chapter: 0, title: { th: "แนะนำการโปรแกรมเชิงวัตถุ", en: "Introduction to OOP" } },
      { chapter: 1, title: { th: "ความรู้เบื้องต้นของภาษาจาวา", en: "Java Basics" } },
      { chapter: 2, title: { th: "คำสั่งควบคุมและโครงสร้างแบบซ้อน (Selection)", en: "Control Flow & Selection" } },
      { chapter: 3, title: { th: "คำสั่งทำงานซ้ำ · ขอบเขต · การแปลงชนิดข้อมูล", en: "Loops, Scope & Type Casting" } },
      { chapter: 4, title: { th: "การเขียนโปรแกรมเชิงวัตถุเบื้องต้น (Classes & Objects)", en: "Basic OOP Concepts" } },
      { chapter: 5, title: { th: "หลักการห่อหุ้มและการสืบทอด (Encapsulation & Inheritance)", en: "Encapsulation & Inheritance" } },
      { chapter: 6, title: { th: "การมีได้หลากหลายรูปแบบ (Polymorphism)", en: "Polymorphism" } },
      { chapter: 7, title: { th: "คอนสตรัคเตอร์ · คลาสไม่สมบูรณ์ · อินเตอร์เฟส", en: "Constructors, Abstract Classes & Interfaces" } },
      { chapter: 8, title: { th: "ส่วนต่อประสานกราฟิกกับผู้ใช้ (GUI)", en: "Graphical User Interface (GUI)" } },
      { chapter: 9, title: { th: "การจัดการเหตุการณ์ (Event Handling)", en: "Event Handling" } },
      { chapter: 10, title: { th: "อาร์เรย์ · Collection API · Generic", en: "Arrays, Collections & Generics" } },
      { chapter: 11, title: { th: "ข้อผิดพลาดและการจัดการ (Exception Handling)", en: "Exception Handling" } },
      { chapter: 12, title: { th: "คลาสนำเข้าและส่งออกข้อมูล (Stream / File I/O)", en: "Streams & File I/O" } },
      { chapter: 13, title: { th: "เธรด (Multithreading)", en: "Multithreading" } },
      { chapter: 14, title: { th: "แนวคิดการเขียนโปรแกรมเชิงวัตถุขั้นสูง", en: "Advanced OOP Concepts" } },
    ],
  },
  DSA: {
    chapterLabel: { th: "บทที่", en: "Ch." },
    chapters: [
      { chapter: 1, title: { th: "Introduction to Data Structures", en: "Introduction to Data Structures" } },
      { chapter: 2, title: { th: "Linear List — Array & Linked List", en: "Linear List — Array & Linked List" } },
      { chapter: 3, title: { th: "Stack & Queue", en: "Stack & Queue" } },
      { chapter: 4, title: { th: "Binary Tree", en: "Binary Tree" } },
      { chapter: 5, title: { th: "Binary Search Tree (BST)", en: "Binary Search Tree (BST)" } },
      { chapter: 6, title: { th: "Other Trees — Expression Tree, Huffman Tree & Heap", en: "Other Trees — Expression Tree, Huffman Tree & Heap" } },
      { chapter: 7, title: { th: "AVL Tree & Graph", en: "AVL Tree & Graph" } },
      { chapter: 8, title: { th: "Algorithm Analysis (Big-O)", en: "Algorithm Analysis (Big-O)" } },
      { chapter: 9, title: { th: "Searching & Hashing", en: "Searching & Hashing" } },
      { chapter: 10, title: { th: "Sorting Algorithms", en: "Sorting Algorithms" } },
      { chapter: 11, title: { th: "Greedy Algorithms", en: "Greedy Algorithms" } },
      { chapter: 12, title: { th: "Recursion", en: "Recursion" } },
      { chapter: 13, title: { th: "Divide and Conquer", en: "Divide and Conquer" } },
      { chapter: 14, title: { th: "Dynamic Programming", en: "Dynamic Programming" } },
    ],
  },
  PSTAT: {
    chapterLabel: { th: "บทที่", en: "Ch." },
    chapters: [
      { chapter: 1, title: { th: "ความน่าจะเป็นเบื้องต้น", en: "Basic Probability" } },
      { chapter: 2, title: { th: "การนับ (Counting Techniques)", en: "Counting Techniques" } },
      { chapter: 3, title: { th: "ความน่าจะเป็นแบบมีเงื่อนไข", en: "Conditional Probability" } },
      { chapter: 4, title: { th: "ตัวแปรสุ่มชนิดไม่ต่อเนื่อง", en: "Discrete Random Variables" } },
      { chapter: 5, title: { th: "ตัวแปรสุ่มไม่ต่อเนื่องหลายตัว", en: "Joint Discrete Random Variables" } },
      { chapter: 6, title: { th: "ตัวแปรสุ่มชนิดต่อเนื่อง", en: "Continuous Random Variables" } },
      { chapter: 7, title: { th: "การแจกแจงความน่าจะเป็นมาตรฐาน", en: "Standard Probability Distributions" } },
      { chapter: 8, title: { th: "สถิติเบื้องต้น (Basic Statistics)", en: "Basic Statistics" } },
      { chapter: 9, title: { th: "การกระจายแบบปกติ (Normal Distribution)", en: "Normal Distribution" } },
      { chapter: 10, title: { th: "ทฤษฎีบทขีดจำกัดส่วนกลางและช่วงความเชื่อมั่น", en: "CLT & Confidence Intervals" } },
      { chapter: 11, title: { th: "การทดสอบสมมติฐาน (Hypothesis Testing)", en: "Hypothesis Testing" } },
      { chapter: 12, title: { th: "การทดสอบสมมติฐานแบบไคสแควร์ (Chi-Square)", en: "Chi-Square Tests" } },
      { chapter: 13, title: { th: "สหสัมพันธ์และการถดถอยเชิงเส้น", en: "Correlation & Linear Regression" } },
    ],
  },
  BFIT: {
    chapterLabel: { th: "สัปดาห์ที่", en: "Week" },
    chapters: [
      { chapter: 1, title: { th: "เศรษฐศาสตร์และระบบเศรษฐกิจ", en: "Economics & Economic Systems" } },
      { chapter: 2, title: { th: "อุปสงค์–อุปทาน และกลไกตลาด", en: "Demand, Supply & Market Equilibrium" } },
      { chapter: 3, title: { th: "มูลค่าเงินตามเวลา — ดอกเบี้ยคงที่ vs ทบต้น", en: "Time Value of Money I" } },
      { chapter: 4, title: { th: "มูลค่าเงินตามเวลา — Annuity & Cash Flow", en: "Time Value of Money II" } },
      { chapter: 5, title: { th: "งบดุล (Balance Sheet)", en: "Balance Sheet" } },
      { chapter: 6, title: { th: "งบกำไรขาดทุน (Income Statement)", en: "Income Statement" } },
      { chapter: 7, title: { th: "การตลาด — STP & ผลิตภัณฑ์", en: "Marketing I (STP & Product)" } },
      { chapter: 8, title: { th: "การตลาด — ราคา & ช่องทางจัดจำหน่าย", en: "Marketing II (Price & Place)" } },
      { chapter: 9, title: { th: "ธุรกิจในโลกของการเปลี่ยนแปลง", en: "Business in a Changing World" } },
      { chapter: 10, title: { th: "พื้นฐานการจัดการ (Management)", en: "Management Fundamentals" } },
      { chapter: 11, title: { th: "การจัดองค์กร (Organizing)", en: "Organizing & Structure" } },
      { chapter: 12, title: { th: "การจัดการทรัพยากรมนุษย์ (HRM)", en: "Human Resource Management" } },
      { chapter: 13, title: { th: "ระบบสารสนเทศในธุรกิจ", en: "Business Information Systems" } },
      { chapter: 14, title: { th: "ทบทวนและนำเสนอโครงงาน", en: "Review & Project Presentation" } },
    ],
  },
  PSCP: {
    chapterLabel: { th: "บทที่", en: "Ch." },
    chapters: [
      { chapter: 1, title: { th: "Python เบื้องต้น, ตัวแปร และตัวดำเนินการ", en: "Python Basics, Variables & Operators" } },
      { chapter: 2, title: { th: "ฟังก์ชันและโมดูล", en: "Functions & Modules" } },
      { chapter: 3, title: { th: "การทำงานแบบมีเงื่อนไข (Conditionals)", en: "Conditionals & Logic" } },
      { chapter: 4, title: { th: "การทำงานซ้ำ (Loops & Iteration)", en: "Loops & Iteration" } },
      { chapter: 5, title: { th: "สตริงและการประมวลผลข้อความ", en: "Strings & Text Processing" } },
      { chapter: 6, title: { th: "List และการดำเนินการกับ List", en: "Lists & List Operations" } },
      { chapter: 7, title: { th: "Nested List และเมทริกซ์ 2 มิติ", en: "Nested Lists & Matrices" } },
      { chapter: 8, title: { th: "Tuple และ Set", en: "Tuples & Sets" } },
      { chapter: 9, title: { th: "Dictionary และการค้นหา", en: "Dictionaries & Hash Lookup" } },
      { chapter: 10, title: { th: "File I/O และการจัดการ Error", en: "File I/O & Exceptions" } },
      { chapter: 11, title: { th: "การเรียกซ้ำ (Recursion)", en: "Recursion" } },
      { chapter: 12, title: { th: "อัลกอริทึมการเรียงลำดับ (Sorting)", en: "Sorting Algorithms" } },
      { chapter: 13, title: { th: "อัลกอริทึมการค้นหา (Searching)", en: "Searching Algorithms" } },
      { chapter: 14, title: { th: "การแก้ปัญหาเชิงคำนวณขั้นสูง", en: "Advanced Problem Solving" } },
    ],
  },
  CHARM: {
    chapterLabel: { th: "สัปดาห์ที่", en: "Week" },
    chapters: [
      { chapter: 1, title: { th: "Introduction / Know You Know Future", en: "Know You Know Future" } },
      { chapter: 2, title: { th: "Generation Gap (ความเข้าใจต่างวัย)", en: "Generation Gap" } },
      { chapter: 3, title: { th: "Time & Stress Management", en: "Time & Stress Management" } },
      { chapter: 4, title: { th: "DISC Team Building & SWOT Analysis", en: "DISC Team Building & SWOT" } },
      { chapter: 5, title: { th: "The Power of Vision (พลังแห่งวิสัยทัศน์)", en: "The Power of Vision" } },
      { chapter: 6, title: { th: "Charming Communication (การสื่อสารอย่างมีเสน่ห์)", en: "Charming Communication" } },
      { chapter: 7, title: { th: "Charming Personalities (บุคลิกภาพที่น่าประทับใจ)", en: "Charming Personalities" } },
      { chapter: 8, title: { th: "Charming Progression Presentation 1", en: "Charming Progression Presentation 1" } },
      { chapter: 9, title: { th: "ลาดกระบังนิทรรศน์", en: "Ladkrabang Exhibition" } },
      { chapter: 10, title: { th: "Spirit of KMITL (จิตวิญญาณแห่งพระจอมเกล้า)", en: "Spirit of KMITL" } },
      { chapter: 11, title: { th: "From Thinking to Doing (จากความคิดสู่การปฏิบัติ)", en: "From Thinking to Doing" } },
      { chapter: 12, title: { th: "To be a SDGs Citizen (พลเมืองเพื่อความยั่งยืน)", en: "To be a SDGs Citizen" } },
      { chapter: 13, title: { th: "นำเสนอ Charming Volunteer (จิตอาสา)", en: "Charming Volunteer Presentation" } },
      { chapter: 14, title: { th: "Final Charming Progression Presentation", en: "Final Charming Progression" } },
    ],
  },
  DL: {
    chapterLabel: { th: "สัปดาห์ที่", en: "Week" },
    chapters: [
      { chapter: 1, title: { th: "Digital Intelligence Quotient (ภาพรวม DQ)", en: "Digital Intelligence Quotient" } },
      { chapter: 2, title: { th: "Digital Citizen Identity & การบริหารเวลา", en: "Digital Citizen Identity" } },
      { chapter: 3, title: { th: "Digital Marketing Strategy", en: "Digital Marketing Strategy" } },
      { chapter: 4, title: { th: "Digital Use & Screen Time Balance", en: "Digital Use & Screen Time" } },
      { chapter: 5, title: { th: "Digital Safety & การรับมือภัยไซเบอร์", en: "Digital Safety & Cyber Resilience" } },
      { chapter: 6, title: { th: "Digital Security & การปกป้องข้อมูล", en: "Digital Security & Data Protection" } },
      { chapter: 7, title: { th: "Digital Emotional Intelligence", en: "Digital Emotional Intelligence" } },
      { chapter: 8, title: { th: "Digital Communication & Netiquette", en: "Digital Communication & Netiquette" } },
      { chapter: 9, title: { th: "Digital Literacy & การรู้เท่าทันข่าวปลอม", en: "Digital Literacy & Fake News Evaluation" } },
      { chapter: 10, title: { th: "Digital Rights & ทรัพย์สินทางปัญญา", en: "Digital Rights & IP" } },
      { chapter: 11, title: { th: "Cloud Computing & การทำงานร่วมกันออนไลน์", en: "Cloud & Online Collaboration" } },
      { chapter: 12, title: { th: "AI & Emerging Technologies", en: "AI & Emerging Technologies" } },
      { chapter: 13, title: { th: "Data Privacy & PDPA", en: "Data Privacy & PDPA" } },
      { chapter: 14, title: { th: "Digital Ethics & ความรับผิดชอบต่อสังคม", en: "Digital Ethics & Social Responsibility" } },
    ],
  },
  FE: {
    chapterLabel: { th: "Unit", en: "Unit" },
    chapters: [
      { chapter: 1, title: { th: "Buying A Car", en: "Buying A Car" } },
      { chapter: 2, title: { th: "Accidents", en: "Accidents" } },
      { chapter: 3, title: { th: "Problems", en: "Problems" } },
      { chapter: 4, title: { th: "Helping Out", en: "Helping Out" } },
      { chapter: 5, title: { th: "Dreams And Ambitions", en: "Dreams And Ambitions" } },
      { chapter: 6, title: { th: "Money Matters", en: "Money Matters" } },
      { chapter: 7, title: { th: "Politics", en: "Politics" } },
      { chapter: 8, title: { th: "Instructions", en: "Instructions" } },
      { chapter: 9, title: { th: "Recycling", en: "Recycling" } },
      { chapter: 10, title: { th: "Movie Making", en: "Movie Making" } },
    ],
  },
  FE2: {
    chapterLabel: { th: "Unit", en: "Unit" },
    chapters: [
      { chapter: 1, title: { th: "Getting Ahead", en: "Getting Ahead" } },
      { chapter: 2, title: { th: "Big Business", en: "Big Business" } },
      { chapter: 3, title: { th: "Problems at Work", en: "Problems at Work" } },
      { chapter: 4, title: { th: "A Helping Hand", en: "A Helping Hand" } },
      { chapter: 5, title: { th: "Health and Happiness", en: "Health and Happiness" } },
      { chapter: 6, title: { th: "Going Places", en: "Going Places" } },
      { chapter: 7, title: { th: "Modern Living", en: "Modern Living" } },
      { chapter: 8, title: { th: "Meeting People", en: "Meeting People" } },
      { chapter: 9, title: { th: "Ecotourism", en: "Ecotourism" } },
      { chapter: 10, title: { th: "Personality Types", en: "Personality Types" } },
    ],
  },
  SPORT: {
    chapterLabel: { th: "สัปดาห์ที่", en: "Week" },
    chapters: [
      { chapter: 1, title: { th: "ปฐมนิเทศและหลักการออกกำลังกาย", en: "Orientation & Exercise Principles" } },
      { chapter: 2, title: { th: "สมรรถภาพทางกายเพื่อสุขภาพ", en: "Physical Fitness for Health" } },
      { chapter: 3, title: { th: "กีฬาประเภทบุคคล 1 (Individual Sports I)", en: "Individual Sports I" } },
      { chapter: 4, title: { th: "กีฬาประเภทบุคคล 2 (Individual Sports II)", en: "Individual Sports II" } },
      { chapter: 5, title: { th: "กีฬาประเภททีม 1 (Team Sports I)", en: "Team Sports I" } },
      { chapter: 6, title: { th: "กีฬาประเภททีม 2 (Team Sports II)", en: "Team Sports II" } },
      { chapter: 7, title: { th: "กีฬาประเภททีม 3 (Team Sports III)", en: "Team Sports III" } },
      { chapter: 8, title: { th: "นันทนาการและกิจกรรมกลางแจ้ง", en: "Recreation & Outdoor Activities" } },
      { chapter: 9, title: { th: "การเคลื่อนไหวประกอบจังหวะ", en: "Rhythmic Movement" } },
      { chapter: 10, title: { th: "ความปลอดภัยและการปฐมพยาบาลทางการกีฬา", en: "Safety & Sports First Aid" } },
      { chapter: 11, title: { th: "โภชนาการกับการออกกำลังกาย", en: "Nutrition & Exercise" } },
      { chapter: 12, title: { th: "การจัดการความเครียดด้วยกิจกรรมทางกาย", en: "Stress Relief through Physical Activity" } },
      { chapter: 13, title: { th: "กิจกรรมนันทนาการกลุ่ม", en: "Group Recreational Activities" } },
      { chapter: 14, title: { th: "การทดสอบสมรรถภาพทางกาย", en: "Physical Fitness Assessment" } },
      { chapter: 15, title: { th: "สรุปและประเมินผล", en: "Course Evaluation & Wrap-up" } },
    ],
  },
  COMPRO: {
    chapterLabel: { th: "บทที่", en: "Ch." },
    chapters: EN_KMITL_CHAPTERS,
  },
  CHEM: {
    chapterLabel: { th: "บทที่", en: "Ch." },
    chapters: CHEM_CHAPTERS,
  },
};

/**
 * Extracts or resolves chapters for a given course code or directory.
 */
export function getCourseChapters(codeOrDir: string): CourseChapterConfig {
  const course = resolveCourse(codeOrDir);
  const code = course ? course.code.toUpperCase() : codeOrDir.toUpperCase();

  if (COURSE_CHAPTERS_MAP[code]) {
    return COURSE_CHAPTERS_MAP[code];
  }

  // Dynamic fallback: attempt to parse Section 2 of summary.md if available
  const md = loadCourseOverview(codeOrDir);
  if (md) {
    const parsed = parseChaptersFromMarkdown(md);
    if (parsed.chapters.length > 0) {
      return parsed;
    }
  }

  return { chapters: [] };
}

function parseChaptersFromMarkdown(content: string): CourseChapterConfig {
  const sec2Match = content.match(/## 2\.[^\n]*\n([\s\S]*?)(?=\n## [345]|\Z)/);
  if (!sec2Match) return { chapters: [] };

  const tableLines = sec2Match[1]
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.startsWith("|") && !l.startsWith("|---"));

  const chapters: SubjectChapter[] = [];
  let isWeek = false;
  let isUnit = false;

  for (const line of tableLines) {
    const parts = line.split("|").slice(1, -1).map((p) => p.replace(/\*\*/g, "").replace(/`/g, "").trim());
    if (parts.length < 2) continue;
    const [c0, c1, c2] = parts;
    if (c0.includes("สัปดาห์") || c0.includes("บท") || c0.includes("Unit") || c0.includes("หัวข้อ")) {
      if (c0.includes("สัปดาห์")) isWeek = true;
      if (c0.includes("Unit")) isUnit = true;
      continue;
    }

    const num = parseInt(c0.replace(/[^\d]/g, ""), 10);
    const title = c1 || c2;
    if (!isNaN(num) && title && !title.includes("สอบกลางภาค") && !title.includes("สอบปลายภาค")) {
      chapters.push({
        chapter: num,
        title: { th: title, en: title },
      });
    }
  }

  return {
    chapterLabel: isUnit
      ? { th: "Unit", en: "Unit" }
      : isWeek
        ? { th: "สัปดาห์ที่", en: "Week" }
        : { th: "บทที่", en: "Ch." },
    chapters,
  };
}
