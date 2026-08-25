import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { SubjectLibrary } from "@/components/subject-library";
import { resolveCourse, courseDir, COURSES } from "@/lib/catalog";
import { assetsForCourse, coursesWithAssets } from "@/lib/subject-library";
import type { LText } from "@/lib/i18n";

export const dynamic = "force-dynamic";

/**
 * Per-course subtitle. Only courses whose shelf needs describing beyond "slides
 * and past papers" appear here; everything else falls back to the generic line
 * built from the course name.
 */
const SUBTITLE: Record<string, LText> = {
  ITF: {
    th: "สไลด์บรรยาย Week 00–07 ภาพสมุดจดในชั้นเรียน 26 หน้า ชีททบทวน และข้อสอบเก่า",
    en: "Week 00–07 slide decks, 26 pages of class notes, recap sheets, and past papers",
  },
  ICS: {
    th: "สไลด์บรรยายและใบงานปฏิบัติการปี 2569 ชีทสรุป ข้อสอบเก่าพร้อมเฉลย และภาพสมุดจด",
    en: "The 2569 lecture and lab set, summary sheets, past papers with answers, and note scans",
  },
  MFIT: {
    th: "สไลด์เลกเชอร์ 7 สัปดาห์ In-Class Activity ชีทสูตร และข้อสอบกลางภาคปีก่อน",
    en: "Seven weeks of slides, in-class activities, formula sheets, and past midterm papers",
  },
  PSCP: {
    th: "สไลด์บรรยายบทที่ 1–5 ข้อสอบกลางภาค ควิซรายสัปดาห์ และชุดแบบฝึกหัด",
    en: "Chapter 1–5 lecture decks, midterm papers, weekly quizzes, and practice sets",
  },
  CHARM: {
    th: "แผนการสอน สไลด์บรรยาย และใบงานเปล่าสำหรับทำส่ง",
    en: "The course plan, lecture slides, and blank worksheets to fill in",
  },
  DSA: {
    th: "ชีททบทวนและเฉลยแบบฝึกหัดแบบแสดงวิธีทำครบทุกหัวข้อ",
    en: "The recap sheet plus worked solutions across every topic",
  },
  PSTAT: {
    th: "ชีททบทวนและตารางค่าวิกฤตที่นำเข้าห้องสอบได้",
    en: "Recap sheets and the critical-value tables you may bring into the exam",
  },
  COMPRO: {
    th: "เอกสาร สรุปเนื้อหารายบท และแหล่งอ้างอิงเพิ่มเติมสำหรับ ComPro",
    en: "Chapter-by-chapter documents, reference sheets, and study materials",
  },
  CHEM: {
    th: "สรุปเนื้อหารายบท สไลด์ทางการ สูตรอ้างอิง และเอกสารสำหรับเคมีทั่วไป",
    en: "Chapter summaries, official slides, formula references, and documents",
  },
};

export async function generateStaticParams() {
  const covered = coursesWithAssets();
  const withLibrary = COURSES.filter((c) => covered.has(c.code));
  return [
    ...withLibrary.map((c) => ({ dir: courseDir(c) })),
    ...withLibrary.map((c) => ({ dir: c.code.toLowerCase() })),
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ dir: string }>;
}): Promise<Metadata> {
  const { dir } = await params;
  const course = resolveCourse(dir);
  if (!course) return { title: "ไม่พบรายวิชา" };
  return {
    title: `คลังทรัพยากร ${course.code} — ${course.nameTh}`,
    description: `คลังเอกสาร สไลด์บรรยาย ข้อสอบเก่า และชีทสรุปสำหรับวิชา ${course.code} ${course.nameTh} (${course.nameEn}) IT KMITL`,
    alternates: { canonical: `/courses/${courseDir(course)}/library` },
  };
}

export default async function CourseLibraryPage({
  params,
}: {
  params: Promise<{ dir: string }>;
}) {
  const { dir } = await params;
  const course = resolveCourse(dir);
  if (!course) notFound();

  const assets = assetsForCourse(course.code);
  if (!assets || assets.length === 0) notFound();

  const cDir = courseDir(course);

  return (
    <>
      <Navbar />
      <SubjectLibrary
        assets={assets}
        courseCode={course.code}
        backHref={`/courses/${cDir}`}
        backLabel={{ th: course.nameTh, en: course.nameEn }}
        title={{
          th: `คลังทรัพยากร · ${course.code}`,
          en: `Resource Library · ${course.code}`,
        }}
        subtitle={
          SUBTITLE[course.code] ?? {
            th: `สไลด์บรรยาย เอกสารประกอบการสอน และสื่อการเรียนสำหรับวิชา ${course.nameTh}`,
            en: `Lecture slides, worksheets, and study documents for ${course.nameEn}`,
          }
        }
      />
    </>
  );
}
