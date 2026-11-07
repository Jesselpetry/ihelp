import type { LText } from "@/lib/i18n";
import { scheduleForCourse } from "@/lib/library/course-weeks";
import { COURSE_CHAPTERS_MAP } from "@/lib/courses/course-chapters";
import { COURSE_BINDINGS } from "@/lib/courses/course-bindings";
import { assetsForCourse } from "@/lib/library/subject-library";
import type {
  CourseExamMilestoneData,
  CourseFoundationsStats,
  CourseTimelineData,
  CourseWeekCardData,
} from "./course-timeline-types";

const pad = (n: number) => String(n).padStart(2, "0");

const L = {
  chapterLabel: { th: "บทที่", en: "Chapter" } satisfies LText,
  midtermTitle: { th: "จุดพักสอบกลางภาค", en: "Midterm Exam Milestone" } satisfies LText,
  midtermSubtitle: {
    th: "ขอบเขตเนื้อหาสำหรับสอบกลางภาค สรุปสาระสำคัญ สูตรลัด และคลังข้อสอบเก่า",
    en: "Midterm exam scope, key concepts, cheat sheets, and question banks",
  } satisfies LText,
  finalTitle: { th: "จุดพักสอบปลายภาค", en: "Final Exam Milestone" } satisfies LText,
  finalSubtitle: {
    th: "ขอบเขตเนื้อหาสำหรับสอบปลายภาค สรุปเนื้อหาครึ่งหลัง และแนวข้อสอบเสมือนจริง",
    en: "Final exam scope, second-half summaries, and realistic mock exams",
  } satisfies LText,
  midtermGuideTitle: { th: "คู่มือทบทวนสอบกลางภาค", en: "Midterm Study Guide" } satisfies LText,
  midtermGuideSub: {
    th: "สรุปสาระสำคัญ สูตรลัด และจุดที่ข้อสอบชอบหลอก",
    en: "Essential formulas, key concepts, and common pitfalls",
  } satisfies LText,
  midtermMockTitle: { th: "คลังโจทย์ & จำลองสอบกลางภาค", en: "Midterm Mock & Drill" } satisfies LText,
  midtermMockSub: {
    th: "ตะลุยโจทย์ฝึกฝนเสมือนจริง พร้อมระบบเฉลยละเอียด",
    en: "Realistic practice exam with detailed answer reviews",
  } satisfies LText,
  finalGuideTitle: { th: "คู่มือทบทวนสอบปลายภาค", en: "Final Study Guide" } satisfies LText,
  finalGuideSub: {
    th: "สรุปเข้มข้นขอบเขตปลายภาค เน้นจุดออกสอบบ่อย",
    en: "Comprehensive final review covering high-frequency exam topics",
  } satisfies LText,
  finalMockTitle: { th: "คลังโจทย์ & จำลองสอบปลายภาค", en: "Final Mock & Drill" } satisfies LText,
  finalMockSub: {
    th: "แนวข้อสอบเสมือนจริง จับเวลาและวิเคราะห์คะแนน",
    en: "Simulated timed exam with score analysis",
  } satisfies LText,
};

const ITF_WEEK_DESCRIPTIONS: Record<number, { th: string; en: string }> = {
  0: { th: "แนะนำอาจารย์ผู้สอน เกณฑ์การตัดเกรด กติกาแล็บ และภาพรวมวิชา", en: "Course orientation, grading criteria, lab rules, and syllabus" },
  1: { th: "Data vs Information, Digital Literacy, ARPANET และระดับ AI", en: "Data vs Information, Digital Literacy, ARPANET and AI levels" },
  2: { th: "คอมพิวเตอร์ ส่วนประกอบฮาร์ดแวร์ Motherboard, Processor, Memory", en: "Computer hardware, Motherboard, Processor and Memory" },
  3: { th: "หน่วยประมวลผลกลาง CPU, Registers, Cache และ Bus Architecture", en: "CPU architecture, Registers, Cache and system buses" },
  4: { th: "อุปกรณ์นำเข้าและส่งออก (Input/Output Devices) และพอร์ตเชื่อมต่อ", en: "Input and Output devices, peripheral ports and interfaces" },
  5: { th: "หน่วยเก็บข้อมูลถาวร Hard Disk, SSD, Flash Memory และ Cloud Storage", en: "Secondary storage, SSD, Flash Memory and Cloud Storage" },
  6: { th: "ระบบปฏิบัติการ (OS), หน้าที่หลัก, การจัดการ Process และ Memory", en: "Operating Systems, process management, memory and file systems" },
  7: { th: "โปรแกรมประยุกต์ Software, Apps, Open Source และลิขสิทธิ์", en: "Application software, mobile apps, open source and software licenses" },
  8: { th: "ฐานข้อมูล ระบบจัดการฐานข้อมูล (DBMS) และโครงสร้างตารางข้อมูล", en: "Databases, DBMS, relational data models and SQL basics" },
  9: { th: "จริยธรรม กฎหมายไซเบอร์ พ.ร.บ. คอมพิวเตอร์ และความปลอดภัยดิจิทัล", en: "Cyberlaw, ethics, Computer Crimes Act and digital safety" },
  10: { th: "ระบบสารสนเทศในองค์กร ERP, CRM, SCM และสายงานด้าน IT", en: "Enterprise information systems (ERP/CRM/SCM) and IT careers" },
  11: { th: "เครือข่ายคอมพิวเตอร์ OSI 7 Layers, TCP/IP, IP Address และ Subnetting", en: "Computer networks, OSI model, TCP/IP, IP addressing and Subnetting" },
  12: { th: "Routing, Switching, DNS, DHCP และการคำนวณเครือข่ายคอมพิวเตอร์", en: "Routing, Switching, DNS, DHCP and network calculations" },
  13: { th: "เครือข่ายไร้สาย Wi-Fi Standards, Cellular, Bluetooth และความปลอดภัย", en: "Wireless networks, Wi-Fi standards, cellular and security" },
  14: { th: "เทคโนโลยีเว็บ HTML, CSS, JavaScript, Client-Server และ Architecture", en: "Web technologies, HTML/CSS/JS, Client-Server architecture" },
  15: { th: "ทักษะสายงาน IT, Cloud Computing, DevOps และระบบสารสนเทศสมัยใหม่", en: "IT skill sets, Cloud computing, DevOps and modern IT systems" },
};

const ICS_SESSION_DESCRIPTIONS: Record<string, { th: string; en: string }> = {
  "midterm-1": { th: "ระบบดิจิทัลเบื้องต้น ประตูสัญญาณลอจิก และโปรแกรมจำลอง Logisim", en: "Intro to digital systems, logic gates, and Logisim simulator" },
  "midterm-2": { th: "พีชคณิตบูลีน กฎเดอมอร์แกน และการเขียนตารางค่าความจริง", en: "Boolean algebra, DeMorgan's laws, and truth tables" },
  "midterm-3": { th: "รูปแบบมาตรฐาน Sum of Products (SOP) และ Product of Sums (POS)", en: "Canonical forms, SOP and POS standard implementations" },
  "midterm-4": { th: "การลดรูปวงจรลอจิกด้วยผังคาร์โนห์ (Karnaugh Map / K-map)", en: "Logic minimization with Karnaugh Maps (K-map)" },
  "midterm-5": { th: "การตอบสนองเชิงเวลา การหน่วงเวลาแพร่กระจาย และ Timing Diagram", en: "Time response, propagation delays, and timing diagrams" },
  "midterm-6": { th: "ระบบเลขฐาน การแปลงเลขฐาน และการคำนวณเลขฐานสอง 2's Complement", en: "Number systems, base conversions, and binary arithmetic" },
  "midterm-7": { th: "วงจรมัลติเพล็กเซอร์ (MUX) และดีมัลติเพล็กเซอร์ (DEMUX)", en: "Multiplexers (MUX) and Demultiplexers (DEMUX)" },
  "final-1": { th: "ภาพรวมระบบคอมพิวเตอร์ แหล่งจ่ายไฟ และการใช้มัลติมิเตอร์วัดวงจร", en: "Computer hardware overview, power supplies, and multimeter" },
  "final-2": { th: "หน่วยความจำ บัสข้อมูล แอดเดรส I/O และการใช้ออสซิลโลสโคป", en: "Memory addressing, I/O buses, and oscilloscope usage" },
  "final-3": { th: "การต่อวงจรบนเบรดบอร์ด สวิตช์ LED มัลติเพล็กเซอร์ และแลตช์", en: "Breadboard prototyping, switches, LEDs, MUX, and latches" },
  "final-4": { th: "ฟลิปฟล็อป วงจรนับ (Counters) และวงจรกำเนิดสัญญาณออสซิลเลเตอร์", en: "Flip-flops, counter circuits, and oscillator modules" },
  "final-5": { th: "วงจรแปลงสัญญาณ DAC/ADC และการสร้าง MUX จากลอจิกเกต", en: "DAC/ADC converters and logic gate implementations" },
  "final-6": { th: "วงจรหน่วยความจำ RAM/ROM และบอร์ดทดลอง FPGA Basys2", en: "Memory circuits, RAM/ROM, and FPGA Basys2 boards" },
  "final-7": { th: "วงจรคำนวณ ALU และการต่อซีพียู 4 บิต (สอบปฏิบัติการแล็บ)", en: "ALU arithmetic logic unit and 4-bit CPU lab examination" },
};

const MFIT_DESCRIPTIONS: Record<number, { th: string; en: string }> = {
  1: { th: "เมทริกซ์ การบวก การคูณ และสมบัติการดำเนินการ", en: "Matrices, addition, multiplication, and matrix properties" },
  2: { th: "เมทริกซ์ผกผัน (Inverse) และดีเทอร์มิแนนต์ (Determinants)", en: "Inverse matrices and determinants" },
  3: { th: "การแก้ระบบสมการเชิงเส้นด้วยการกำจัดแบบเกาส์ (Gaussian Elimination)", en: "Solving linear systems via Gaussian elimination" },
  4: { th: "เวกเตอร์ในปริภูมิ Rⁿ ดอทโพรดักต์ และความตั้งฉาก", en: "Vectors in Rⁿ, dot products, and orthogonality" },
  5: { th: "ปริภูมิเวกเตอร์ ฐานหลัก มิติ และความเป็นอิสระเชิงเส้น", en: "Vector spaces, bases, dimension, and linear independence" },
  6: { th: "การแปลงเชิงเส้น (Linear Transformations) และเมทริกซ์มาตรฐาน", en: "Linear transformations and standard matrix representations" },
  7: { th: "ค่าไอเกน (Eigenvalues), เวกเตอร์ไอเกน และเมทริกซ์เชิงตั้งฉาก", en: "Eigenvalues, eigenvectors, and orthogonal diagonalization" },
  8: { th: "นิยามฟังก์ชัน ลิมิตด้านเดียว และความต่อเนื่องของฟังก์ชัน", en: "Functions, one-sided limits, and continuity" },
  9: { th: "สูตรอนุพันธ์ กฎลูกโซ่ และการหาอนุพันธ์ของฟังก์ชันอดิศัย", en: "Derivatives, chain rule, and transcendental functions" },
  10: { th: "จุดวิกฤต จุดสูงสุดต่ำสุด ค่าเฉลี่ย และการวาดกราฟฟังก์ชัน", en: "Critical points, extrema, Mean Value Theorem, and curve sketching" },
  11: { th: "ปฏิยานุพันธ์และอินทิกรัลไม่จำกัดเขต", en: "Antiderivatives and indefinite integrals" },
  12: { th: "ทฤษฎีบทมูลฐานของแคลคูลัสและพื้นที่ใต้กราฟ", en: "Fundamental Theorem of Calculus and area under curves" },
  13: { th: "การอินทิเกรตทีละส่วน (Integration by Parts) และเศษส่วนย่อย", en: "Integration by parts and partial fractions" },
  14: { th: "สมการเชิงอนุพันธ์อันดับหนึ่งและการประยุกต์การเติบโต", en: "First-order differential equations and growth models" },
  15: { th: "ภาพรวมแคลคูลัสและการประยุกต์ใช้ในวิทยาการคอมพิวเตอร์", en: "Calculus review and computer science applications" },
};

const MFIT_FINAL_TITLES: Record<number, { th: string; en: string }> = {
  8: { th: "ฟังก์ชันและลิมิต (Functions & Limits)", en: "Functions & Limits" },
  9: { th: "อนุพันธ์และการหาอนุพันธ์ (Derivatives)", en: "Derivatives & Differentiation" },
  10: { th: "การประยุกต์อนุพันธ์ (Applications of Derivatives)", en: "Applications of Derivatives" },
  11: { th: "อินทิกรัลไม่จำกัดเขต (Indefinite Integrals)", en: "Indefinite Integrals" },
  12: { th: "อินทิกรัลจำกัดเขตและการประยุกต์", en: "Definite Integrals & Applications" },
  13: { th: "เทคนิคการอินทิเกรต (Integration Techniques)", en: "Integration Techniques" },
  14: { th: "สมการเชิงอนุพันธ์เบื้องต้น", en: "Differential Equations Basics" },
  15: { th: "ทบทวนแคลคูลัสและการประยุกต์ใน IT", en: "Calculus Review & IT Applications" },
};

/**
 * Resolves the complete weekly learning timeline and exam milestones for a course.
 *
 * Runs on the server only, so full asset catalogs and manifests are never leaked
 * into client JavaScript bundles.
 */
export function resolveCourseTimeline(
  courseCode: string,
  cDir: string,
): CourseTimelineData {
  const code = courseCode.toUpperCase();
  const schedule = scheduleForCourse(code);
  const chapterConfig = COURSE_CHAPTERS_MAP[code];
  const binding = COURSE_BINDINGS[code] ?? {};
  const assets = assetsForCourse(code) ?? [];

  // Question banks by chapter
  const chapterQuestions = new Map<number, number>();
  const allBanks = [
    ...(binding.drill?.bank?.() ?? []),
    ...(binding.mock_exam?.bank?.() ?? []),
    ...(binding.speed_quiz?.bank?.() ?? []),
  ];
  for (const q of allBanks) {
    if (q.chapter !== undefined) {
      chapterQuestions.set(q.chapter, (chapterQuestions.get(q.chapter) ?? 0) + 1);
    }
  }

  // Bound docs in syllabus_map or deep_summary
  const mapDocs = binding.syllabus_map?.docs ?? [];
  const summaryDocs = binding.deep_summary?.docs ?? [];

  const weeks: CourseWeekCardData[] = [];

  if (schedule && schedule.weeks.length > 0) {
    // ── Courses with explicit weekly schedules (ITF, ICS) ───────────────────────
    for (const week of schedule.weeks) {
      const wNum = week.week;
      const wScope = week.scope ?? "all";
      const isWeekZero = wNum === 0;

      // Match bound reader doc
      let matchedDoc = mapDocs.find((d) => {
        if (d.scope && week.scope && d.scope !== week.scope) {
          return false;
        }
        if (d.chapter !== undefined && d.chapter === wNum) {
          return true;
        }
        if (d.slug === `logic-week${pad(wNum)}` && week.scope === "midterm") {
          return true;
        }
        if (d.slug === `week${pad(wNum)}` && (!d.scope || d.scope === week.scope)) {
          return true;
        }
        return false;
      });

      // Special check for Week 0 (orientation in ITF)
      if (!matchedDoc && isWeekZero && code === "ITF") {
        matchedDoc = mapDocs.find((d) => d.slug === "course-materials-2569");
      }

      // Special check for ICS: Track B weeks
      if (!matchedDoc && code === "ICS" && wScope === "final") {
        matchedDoc = mapDocs.find((d) => d.slug === `week${pad(wNum)}`);
      }

      // Assets matching this week
      const matchingAssets = assets.filter((a) => {
        const n = a.week ?? a.chapter;
        if (n !== wNum) return false;
        if (week.scope && a.scope && a.scope !== week.scope) return false;
        return true;
      });

      const slidesCount = matchingAssets.filter(
        (a) => a.category === "lecture" || a.fileName.includes("lec"),
      ).length;
      const handoutsCount = matchingAssets.filter(
        (a) =>
          a.category === "exercise" ||
          a.category === "reference" ||
          a.fileName.includes("lab") ||
          a.fileName.includes("sheet"),
      ).length;

      const label: LText = isWeekZero
        ? { th: "ปฐมนิเทศ", en: "Orientation" }
        : code === "ICS" && wScope === "final"
          ? { th: `คาบที่ ${pad(wNum)}`, en: `Session ${pad(wNum)}` }
          : { th: `สัปดาห์ที่ ${pad(wNum)}`, en: `Week ${pad(wNum)}` };

      const readerHref = matchedDoc
        ? `/courses/${cDir}/map?doc=${matchedDoc.slug}`
        : undefined;

      const description =
        code === "ITF"
          ? ITF_WEEK_DESCRIPTIONS[wNum]
          : code === "ICS"
            ? ICS_SESSION_DESCRIPTIONS[`${wScope}-${wNum}`]
            : undefined;

      weeks.push({
        id: `week-${wScope}-${wNum}`,
        weekNumber: wNum,
        label,
        title: week.title,
        description,
        scope: wScope,
        docSlug: matchedDoc?.slug,
        readerHref,
        slidesCount,
        handoutsCount,
        totalFiles: matchingAssets.length,
        quizCount: chapterQuestions.get(wNum) ?? 0,
        videoUrl: week.video,
        hasDoc: Boolean(matchedDoc),
      });
    }
  } else if (code === "MFIT") {
    // ── MFIT: Weeks 1–7 linear algebra (midterm) + Weeks 8–15 calculus (final) ──
    const midtermChapters = chapterConfig?.chapters ?? [];
    for (const ch of midtermChapters) {
      const wNum = ch.chapter;
      const matchingAssets = assets.filter((a) => (a.week ?? a.chapter) === wNum);
      weeks.push({
        id: `week-midterm-${wNum}`,
        weekNumber: wNum,
        label: { th: `สัปดาห์ที่ ${pad(wNum)}`, en: `Week ${pad(wNum)}` },
        title: ch.title,
        description: MFIT_DESCRIPTIONS[wNum],
        scope: "midterm",
        slidesCount: matchingAssets.filter((a) => a.category === "lecture").length,
        handoutsCount: matchingAssets.filter((a) => a.category === "exercise").length,
        totalFiles: matchingAssets.length,
        quizCount: chapterQuestions.get(wNum) ?? 0,
        hasDoc: false,
      });
    }

    // MFIT final weeks 8–15 from summary docs
    for (let w = 8; w <= 15; w++) {
      const summaryDoc = summaryDocs.find((d) => d.slug === `week${pad(w)}-summary`);
      const matchingAssets = assets.filter((a) => (a.week ?? a.chapter) === w);
      weeks.push({
        id: `week-final-${w}`,
        weekNumber: w,
        label: { th: `สัปดาห์ที่ ${pad(w)}`, en: `Week ${pad(w)}` },
        title: MFIT_FINAL_TITLES[w] ?? { th: `สัปดาห์ที่ ${w}`, en: `Week ${w}` },
        description: MFIT_DESCRIPTIONS[w],
        scope: "final",
        docSlug: summaryDoc?.slug,
        readerHref: summaryDoc ? `/courses/${cDir}/summary?doc=${summaryDoc.slug}` : undefined,
        slidesCount: matchingAssets.filter((a) => a.category === "lecture").length,
        handoutsCount: matchingAssets.filter((a) => a.category === "exercise").length,
        totalFiles: matchingAssets.length,
        quizCount: chapterQuestions.get(w) ?? 0,
        hasDoc: Boolean(summaryDoc),
      });
    }
  } else if (chapterConfig && chapterConfig.chapters.length > 0) {
    // ── Other courses with chapters (PSCP, OOP, DSA, PSTAT, BFIT, etc.) ────────
    const labelPrefix = chapterConfig.chapterLabel ?? L.chapterLabel;
    for (const ch of chapterConfig.chapters) {
      const wNum = ch.chapter;
      const wScope = ch.scope ?? (wNum <= 7 ? "midterm" : "final");
      const matchingAssets = assets.filter((a) => (a.week ?? a.chapter) === wNum);

      weeks.push({
        id: `ch-${wScope}-${wNum}`,
        weekNumber: wNum,
        label: {
          th: `${labelPrefix.th} ${pad(wNum)}`,
          en: `${labelPrefix.en} ${pad(wNum)}`,
        },
        title: ch.title,
        description: (ch as { description?: LText }).description,
        scope: wScope,
        slidesCount: matchingAssets.filter((a) => a.category === "lecture").length,
        handoutsCount: matchingAssets.filter((a) => a.category === "exercise").length,
        totalFiles: matchingAssets.length,
        quizCount: chapterQuestions.get(wNum) ?? 0,
        hasDoc: false,
      });
    }
  }

  // ── Exam Milestones (Midterm & Final) ─────────────────────────────────────────
  const hasSummary = Boolean(binding.deep_summary);
  const hasCram = Boolean(binding.cram_sheet);
  const hasDrill = Boolean(binding.drill);
  const hasMock = Boolean(binding.mock_exam);

  const totalBankQuestions = allBanks.length;

  const midtermMilestone: CourseExamMilestoneData = {
    scope: "midterm",
    title: L.midtermTitle,
    subtitle: L.midtermSubtitle,
    studyGuide: {
      title: L.midtermGuideTitle,
      subtitle: L.midtermGuideSub,
      href: hasSummary
        ? `/courses/${cDir}/summary`
        : hasCram
          ? `/courses/${cDir}/cram`
          : `/courses/${cDir}/overview`,
      isAvailable: hasSummary || hasCram,
    },
    mockExam: {
      title: L.midtermMockTitle,
      subtitle: L.midtermMockSub,
      href: hasMock
        ? `/courses/${cDir}/mock`
        : hasDrill
          ? `/courses/${cDir}/drill`
          : `/courses/${cDir}/drill`,
      questionCount: totalBankQuestions > 0 ? Math.ceil(totalBankQuestions / 2) : undefined,
      isAvailable: hasMock || hasDrill,
    },
  };

  const finalMilestone: CourseExamMilestoneData = {
    scope: "final",
    title: L.finalTitle,
    subtitle: L.finalSubtitle,
    studyGuide: {
      title: L.finalGuideTitle,
      subtitle: L.finalGuideSub,
      href: hasSummary
        ? `/courses/${cDir}/summary`
        : hasCram
          ? `/courses/${cDir}/cram`
          : `/courses/${cDir}/overview`,
      isAvailable: hasSummary || hasCram,
    },
    mockExam: {
      title: L.finalMockTitle,
      subtitle: L.finalMockSub,
      href: hasMock
        ? `/courses/${cDir}/mock`
        : hasDrill
          ? `/courses/${cDir}/drill`
          : `/courses/${cDir}/drill`,
      questionCount: totalBankQuestions > 0 ? Math.floor(totalBankQuestions / 2) || totalBankQuestions : undefined,
      isAvailable: hasMock || hasDrill,
    },
  };

  return {
    weeks,
    midtermMilestone,
    finalMilestone,
  };
}

/**
 * Metrics split for the resource vault card.
 */
export function resolveResourceStats(courseCode: string): CourseFoundationsStats {
  const assets = assetsForCourse(courseCode) ?? [];
  return {
    totalFiles: assets.length,
    pdfs: assets.filter((a) => a.fileType === "pdf").length,
    images: assets.filter((a) => a.fileType === "image").length,
    docs: assets.filter((a) => a.fileType === "md").length,
  };
}
