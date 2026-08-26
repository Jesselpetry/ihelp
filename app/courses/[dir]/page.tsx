import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { SubjectHub } from "@/components/subject-hub";
import { COURSES, courseDir, resolveCourse } from "@/lib/catalog";
import { COURSE_BINDINGS } from "@/lib/course-bindings";
import { moduleBinding, resolveCourseSpine } from "@/lib/course-spine";
import type { SpineMetrics } from "@/lib/spine";
import { getCourseScrapedInfo } from "@/lib/course-content";
import { assetsForCourse } from "@/lib/subject-library";
import type { LText } from "@/lib/i18n";

const L = {
  backLabel: { th: "← รายวิชาทั้งหมด", en: "← All courses" },
};

/**
 * Question-bank sizes, measured from the banks the course actually binds.
 *
 * Counted rather than declared: the hub used to carry hand-written counts in a
 * `questionCounts` map that had already drifted from the banks it described.
 */
function bankCounts(code: string): SpineMetrics["questions"] {
  const bindings = COURSE_BINDINGS[code.toUpperCase()] ?? {};
  const counts: Record<string, number> = {};
  for (const [id, binding] of Object.entries(bindings)) {
    const size = binding?.bank?.().length ?? 0;
    if (size > 0) counts[id] = size;
  }
  return counts as SpineMetrics["questions"];
}

/** PDF / image / in-app-document split for the archive module's card. */
function libraryMetrics(code: string): SpineMetrics["library"] {
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

  const cDir = courseDir(course);
  const modules = resolveCourseSpine(course.code, cDir, {
    questions: bankCounts(course.code),
    library: libraryMetrics(course.code),
  });

  // The overview document is whatever the course bound to its orientation
  // module. This replaces a six-branch switch that picked between three
  // different loaders by course code.
  const orientation = moduleBinding(course.code, "orientation");
  const summaryMarkdown =
    orientation?.docs?.map((doc) => doc.load()).find((md) => md !== null) ?? null;

  // Caveats a course attached to individual modules — that a bank is derived
  // from a review guide rather than the real paper, where the marks actually
  // sit — gathered under the grid so they stay attached to their module.
  const notes = modules
    .filter((mod) => mod.note !== undefined)
    .map((mod) => ({ title: mod.title, note: mod.note! }));

  return (
    <>
      <Navbar />
      <SubjectHub
        backHref="/"
        backLabel={L.backLabel}
        title={{
          th: `${course.code} — ${course.nameTh}`,
          en: `${course.code} — ${course.nameEn}`,
        }}
        subtitle={hubSubtitle(course.officialCode, course.nameEn, course.credits)}
        summaryMarkdown={summaryMarkdown}
        officialUrl={course.officialUrl}
        officialInfo={getCourseScrapedInfo(course.code)}
        modules={modules}
        notes={notes}
      />
    </>
  );
}

function hubSubtitle(
  officialCode: string | undefined,
  nameEn: string,
  credits: string | undefined,
): LText {
  const line = [officialCode, nameEn, credits].filter(Boolean).join(" · ");
  return { th: line, en: line };
}
