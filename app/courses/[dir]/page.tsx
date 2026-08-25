import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { SubjectHub, type SubjectChapter } from "@/components/subject-hub";
import { COURSES, courseDir, resolveCourse, tracksFor } from "@/lib/catalog";
import { buildCourseTracks, type CourseTrackMetrics } from "@/lib/course-tracks";
import { getCourseScrapedInfo } from "@/lib/course-content";
import { assetsForCourse } from "@/lib/subject-library";
import { loadIcs, loadMfit } from "@/lib/it-kmitl";
import type { LText } from "@/lib/i18n";
import type { QuizQuestion } from "@/lib/quiz";

// Interactive quiz & chapter metadata imports
import { ITF_CHAPTERS, ITF_QUIZ } from "@/lib/itf-quiz";
import { ICS_CHAPTERS, ICS_QUIZ } from "@/lib/ics-quiz";
import { MFIT_CHAPTERS, MFIT_QUIZ, MFIT_BLUEPRINT_QUIZ } from "@/lib/mfit-quiz";
import { EN_KMITL_CHAPTERS, EN_KMITL_QUIZ } from "@/lib/en-kmitl-quiz";
import { EN_KMITL_MOCK_EXAM } from "@/lib/en-kmitl-mock-exam";
import { CHEM_CHAPTERS, CHEM_QUIZ } from "@/lib/chem-quiz";

export const dynamic = "force-dynamic";

const L = {
  backLabel: { th: "← รายวิชาทั้งหมด", en: "← All courses" },
  overviewTitle: { th: "ภาพรวมเนื้อหา", en: "Content Overview" },
};

/**
 * Everything a hub needs beyond its track cards. The cards themselves come
 * from lib/course-tracks.ts; this only carries the page framing and whatever
 * live data the badges quote.
 */
interface CourseHub {
  title: LText;
  subtitle: LText;
  chapters?: SubjectChapter[];
  chapterLabel?: LText;
  questions?: QuizQuestion[];
  footerNote?: LText;
  /** Track hrefs beyond the catalogue's, keyed by track id. */
  extraHrefs?: Record<string, string | undefined>;
  /** Question-bank sizes the card badges quote, keyed by track id. */
  questionCounts?: Record<string, number>;
}

/**
 * Per-course framing. Only the subjects with bespoke copy appear here; every
 * other course falls through to a heading built from the catalogue, which is
 * what the standard hub already did.
 */
function hubFor(code: string, base: string): CourseHub | undefined {
  switch (code) {
    case "ITF":
      return {
        title: { th: "ITF — พื้นฐานทางด้านเทคโนโลยีสารสนเทศ", en: "IT Fundamentals" },
        subtitle: {
          th: "06016402 · เตรียมสอบกลางภาค · Lecture 01–07",
          en: "06016402 · Midterm prep · Lectures 01–07",
        },
        chapters: ITF_CHAPTERS,
        chapterLabel: { th: "Lecture", en: "Lecture" },
        questions: ITF_QUIZ,
        questionCounts: { quiz: ITF_QUIZ.length },
        footerNote: {
          th: "คลังข้อสอบสร้างจากคู่มือทบทวนกลางภาค ไม่ใช่ข้อสอบจริง — ใช้ทบทวนความเข้าใจ ไม่ใช่เดาแนวข้อสอบ",
          en: "Questions derived from midterm review guides for concept reinforcement.",
        },
      };

    case "ICS": {
      const ics = loadIcs();
      return {
        title: {
          th: "ICS — ระบบคอมพิวเตอร์เบื้องต้น",
          en: "ICS — Intro to Computer Systems",
        },
        subtitle: {
          th: "06016411 · เตรียมสอบกลางภาค · บทที่ 1-6 (120 คะแนน + เสริม 10)",
          en: "06016411 · Midterm prep · Chapters 1-6 (120 marks + 10 bonus)",
        },
        chapters: ICS_CHAPTERS,
        questions: ICS_QUIZ,
        questionCounts: { quiz: ICS_QUIZ.length },
        extraHrefs: {
          analysis: ics.analysisMd ? `${base}/analysis` : undefined,
        },
        footerNote: {
          th: "ข้อสอบเป็นอัตนัยทั้งฉบับ — ต้องแสดงวิธีทำทุกข้อ คะแนนกระจุกที่พีชคณิตบูลีน + K-Map + ออกแบบวงจร รวม 90 จาก 120 คะแนน (75%)",
          en: "The exam is constructed-response — Boolean algebra + K-maps + circuit design carry 75% of marks.",
        },
      };
    }

    case "MFIT": {
      const mfit = loadMfit();
      return {
        title: {
          th: "MFIT — คณิตศาสตร์สำหรับเทคโนโลยีสารสนเทศ",
          en: "MFIT — Mathematics for IT",
        },
        subtitle: {
          th: "06016401 · เตรียมสอบกลางภาค · 10 ข้อ 180 นาที (พีชคณิตเชิงเส้น Week 1-7)",
          en: "06016401 · Midterm prep · 10 questions in 180 minutes (linear algebra, weeks 1-7)",
        },
        chapters: MFIT_CHAPTERS,
        chapterLabel: { th: "สัปดาห์ที่", en: "Week" },
        questions: [...MFIT_QUIZ, ...MFIT_BLUEPRINT_QUIZ],
        questionCounts: {
          quiz: MFIT_QUIZ.length + MFIT_BLUEPRINT_QUIZ.length,
          speed_quiz: MFIT_BLUEPRINT_QUIZ.length,
        },
        extraHrefs: {
          cram: mfit.cramMd ? `${base}/cram` : undefined,
          learning_path: mfit.learningPathMd ? `${base}/plan` : undefined,
          speed_quiz: mfit.mockExamMd ? `${base}/mock` : undefined,
        },
        footerNote: {
          th: "โครงข้อสอบจากสไลด์ Q&A ของอาจารย์: 10 ข้อ · 180 นาที · ตอบเป็นตัวเลข · มีเครื่องคิดเลขให้ — ข้อ 10 (ค่าเจาะจง) ได้เวลามากสุด 20 นาที",
          en: "Blueprint from instructor's Q&A: 10 questions in 180 minutes with calculators allowed.",
        },
      };
    }

    case "COMPRO":
      return {
        title: {
          th: "Computer Programming — การเขียนโปรแกรมคอมพิวเตอร์",
          en: "Computer Programming",
        },
        subtitle: {
          th: "01006012 · เตรียมสอบกลางภาค (บทที่ 1-5)",
          en: "01006012 · Midterm Prep (Chapters 1-5)",
        },
        chapters: EN_KMITL_CHAPTERS,
        questions: [...EN_KMITL_QUIZ, ...EN_KMITL_MOCK_EXAM],
        questionCounts: {
          quiz: EN_KMITL_QUIZ.length + EN_KMITL_MOCK_EXAM.length,
        },
      };

    case "CHEM":
      return {
        title: { th: "General Chemistry — เคมีทั่วไป", en: "General Chemistry" },
        subtitle: {
          th: "เตรียมสอบกลางภาค · บทที่ 1-5",
          en: "Midterm Prep · Chapters 1-5",
        },
        chapters: CHEM_CHAPTERS,
        questions: CHEM_QUIZ,
        questionCounts: { quiz: CHEM_QUIZ.length },
      };

    case "PSCP":
      return {
        title: {
          th: "PSCP — การแก้ปัญหาและการโปรแกรมคอมพิวเตอร์",
          en: "Problem Solving and Computer Programming",
        },
        subtitle: {
          th: "06066303 · คลังโจทย์และสื่อการเรียนรู้",
          en: "06066303 · Problem sets & learning materials",
        },
      };

    default:
      return undefined;
  }
}

/** PDF / image / in-app-document split for the resource library's card. */
function libraryMetrics(code: string): CourseTrackMetrics["library"] {
  const assets = assetsForCourse(code);
  if (!assets || assets.length === 0) return undefined;
  return {
    pdfs: assets.filter((a) => a.fileType === "pdf").length,
    images: assets.filter((a) => a.fileType === "image").length,
    docs: assets.filter((a) => a.fileType === "md").length,
  };
}

export async function generateStaticParams() {
  const dirs = COURSES.map((c) => ({ dir: courseDir(c) }));
  const codes = COURSES.map((c) => ({ dir: c.code.toLowerCase() }));
  const slugs = COURSES.map((c) => ({ dir: c.slug }));
  return [...dirs, ...codes, ...slugs];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ dir: string }>;
}): Promise<Metadata> {
  const { dir } = await params;
  const course = resolveCourse(dir);
  if (!course) return { title: "ไม่พบรายวิชา" };
  const code = course.officialCode ? `${course.officialCode} ` : "";
  return {
    title: `${course.code} — ${course.nameTh}`,
    description: `ภาพรวมรายวิชา ${code}${course.nameTh} (${course.nameEn}) IT KMITL — ขอบเขตเนื้อหารายสัปดาห์ สรุปหัวข้อ แบบทดสอบ และคลังสื่อการเรียน`,
    alternates: { canonical: `/courses/${courseDir(course)}` },
  };
}

export default async function CoursePage({
  params,
}: {
  params: Promise<{ dir: string }>;
}) {
  const { dir } = await params;
  const course = resolveCourse(dir);
  if (!course) notFound();

  const baseHref = `/courses/${courseDir(course)}`;
  const hub = hubFor(course.code, baseHref);
  const officialInfo = getCourseScrapedInfo(course.code);

  // The catalogue owns the standard tracks; a course's own config adds the
  // ones only it has (MFIT's cram sheet, ICS's exam analysis) and answers
  // whether their markdown is actually on disk.
  //
  // The overview track is the exception: the catalogue points it at the hub,
  // which is this page, so from here it has to scroll to the official-info
  // panel further down. With no panel to scroll to there is nothing to link.
  const hrefs: Record<string, string | undefined> = {
    ...tracksFor(course.code),
    ...hub?.extraHrefs,
    overview: officialInfo ? "#course-overview" : undefined,
  };

  const tracks = buildCourseTracks(course.code, hrefs, {
    questions: hub?.questionCounts,
    library: libraryMetrics(course.code),
  });

  return (
    <>
      <Navbar />
      <SubjectHub
        backHref="/"
        backLabel={L.backLabel}
        title={
          hub?.title ?? {
            th: `${course.code} — ${course.nameTh}`,
            en: `${course.code} — ${course.nameEn}`,
          }
        }
        subtitle={
          hub?.subtitle ?? {
            th: `${course.officialCode ? course.officialCode + " · " : ""}${course.nameEn}${course.credits ? " · " + course.credits : ""}`,
            en: `${course.officialCode ? course.officialCode + " · " : ""}${course.nameEn}${course.credits ? " · " + course.credits : ""}`,
          }
        }
        officialUrl={course.officialUrl}
        officialInfo={officialInfo}
        tracks={tracks}
        overviewTitle={L.overviewTitle}
        chapterLabel={hub?.chapterLabel}
        chapters={hub?.chapters ?? []}
        questions={hub?.questions ?? []}
        footerNote={hub?.footerNote}
      />
    </>
  );
}
