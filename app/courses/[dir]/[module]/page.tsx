import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { ModuleReader, type ReaderDoc } from "@/components/module-reader";
import { SubjectQuizGate } from "@/components/subject-quiz-gate";
import { ComProLabHub } from "@/components/compro-lab-hub";
import { ModuleShell } from "@/components/module-shell";
import { COURSES, courseDir, resolveCourse, type CatalogCourse } from "@/lib/courses/catalog";
import { COURSE_BINDINGS } from "@/lib/courses/course-bindings";
import { moduleBinding, resolveModule } from "@/lib/courses/course-spine";
import {
  moduleBySegment,
  STANDARD_SPINE,
  type ModuleId,
  type ModuleSpec,
  type ResolvedModule,
} from "@/lib/courses/spine";
import { getCourseChapters } from "@/lib/courses/course-chapters";
import { assetsForCourse, mergedAssets } from "@/lib/library/subject-library";
import { SubjectLibraryGate } from "@/components/subject-library-gate";
import { t, type LText } from "@/lib/ltext";
import { SITE, absoluteUrl } from "@/lib/site";

/**
 * Every module of every course, on one route.
 *
 * Replaces seven page files — summary, exam, mock, cram, plan, analysis and
 * quiz — that were near-copies of each other. Six of them differed only in
 * which loader they called, and each carried its own `if (course.code === ...)`
 * chain; the two that both built MFIT's bank concatenated it in opposite
 * orders, so the hub described a question sequence the quiz did not run.
 *
 * Nothing here switches on a course code. The spine says what the module is,
 * the binding says what this course put in it.
 */

const L = {
  quizFallback: { th: "ทำแบบทดสอบ", en: "Take the quiz" },
  drillNext: { th: "ฝึกทำโจทย์รายบท", en: "Drill this by chapter" },
} satisfies Record<string, LText>;

/** The documents a module can actually show, read from disk. */
/**
 * Modules that read as study material, and so get MdView's notebook accents.
 *
 * "mock" is deliberately absent. It is where a course keeps its practice
 * paper — ICS renders a 1224-line midterm there — and an exam should not look
 * marked up before the student has written on it. The other markdown-bearing
 * modules are lecture notes by another name: ICS alone puts its 566-line
 * syllabus summary on "summary" and a 179-line exam-analysis walkthrough,
 * built out of 12 "กลไกของกับดัก" callouts, on "overview".
 */
const NOTEBOOK_SEGMENTS = new Set(["summary", "overview"]);

function readerDocs(code: string, id: ModuleId): ReaderDoc[] {
  return (moduleBinding(code, id)?.docs ?? []).flatMap((doc) => {
    const markdown = doc.load();
    if (markdown === null) return [];
    return [{
      slug: doc.slug,
      title: doc.title,
      markdown,
      chapter: doc.chapter,
      scope: doc.scope,
    }];
  });
}

/**
 * Where a reader points once its last document is done.
 *
 * Forward, into retrieval — never back to the hub the reader was opened from.
 */
function forwardHref(course: CatalogCourse, dir: string): { href: string; label: LText } | null {
  const drill = resolveModule(course.code, "drill", dir);
  if (drill?.href) return { href: drill.href, label: L.drillNext };
  return null;
}

export async function generateStaticParams() {
  const params: { dir: string; module: string }[] = [];
  for (const course of COURSES) {
    const bindings = COURSE_BINDINGS[course.code.toUpperCase()] ?? {};
    for (const spec of STANDARD_SPINE) {
      // A module with its own href lives on another route; one with no binding
      // renders as a locked slot on the hub and has no page of its own.
      if (!bindings[spec.id] || bindings[spec.id]?.href) continue;
      params.push({ dir: courseDir(course), module: spec.segment });
      params.push({ dir: course.code.toLowerCase(), module: spec.segment });
    }
  }
  return params;
}

function lookup(dir: string, segment: string): {
  course: CatalogCourse;
  spec: ModuleSpec;
  mod: ResolvedModule;
  cDir: string;
} | null {
  const course = resolveCourse(dir);
  const spec = moduleBySegment(segment);
  if (!course || !spec) return null;
  const cDir = courseDir(course);
  const mod = resolveModule(course.code, spec.id, cDir);
  if (!mod) return null;
  return { course, spec, mod, cDir };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ dir: string; module: string }>;
}): Promise<Metadata> {
  const { dir, module: segment } = await params;
  const found = lookup(dir, segment);
  if (!found) return { title: "ไม่พบเนื้อหา" };
  const { course, spec, mod, cDir } = found;
  const title = t(mod.title, "th");
  const pageTitle = `${title} ${course.code} — ${course.nameTh}`;

  let description = `${title} รายวิชา ${course.code} ${course.nameTh} (${course.nameEn}) IT KMITL — ${t(mod.subtitle, "th")}`;
  if (spec.id === "syllabus_map") {
    description = `แผนที่เนื้อหาและโครงสร้างรายสัปดาห์ รายวิชา ${course.code} ${course.nameTh} (${course.nameEn}) IT KMITL — ตรวจสอบสถานะสรุป สไลด์ และจำนวนข้อสอบในแต่ละบท`;
  } else if (spec.id === "archive") {
    description = `คลังสื่อการเรียนรู้ สไลด์ OnLearn เลกเชอร์ และเอกสารประกอบการสอน รายวิชา ${course.code} ${course.nameTh} (${course.nameEn}) IT KMITL`;
  } else if (spec.id === "deep_summary") {
    description = `สรุปเนื้อหาและชีทติวเข้มข้น รายวิชา ${course.code} ${course.nameTh} (${course.nameEn}) IT KMITL — ${t(mod.subtitle, "th")}`;
  } else if (spec.id === "cram_sheet") {
    description = `สรุปย่อความจำ คัดเฉพาะสูตร กฎ และนิยามสำคัญก่อนเข้าห้องสอบ รายวิชา ${course.code} ${course.nameTh} (${course.nameEn}) IT KMITL`;
  } else if (spec.id === "drill" || spec.id === "speed_quiz") {
    description = `คลังแบบฝึกหัด ตะลุยโจทย์ และแบบทดสอบความเข้าใจ รายวิชา ${course.code} ${course.nameTh} (${course.nameEn}) IT KMITL — ${t(mod.subtitle, "th")}`;
  } else if (spec.id === "mock_exam" || spec.id === "weak_spot") {
    description = `แบบจำลองข้อสอบเสมือนจริง จับเวลาและวิเคราะห์จุดอ่อน รายวิชา ${course.code} ${course.nameTh} (${course.nameEn}) IT KMITL — ${t(mod.subtitle, "th")}`;
  }

  const canonical = `/courses/${cDir}/${segment}`;

  const MODULE_OG_MAP: Record<string, string> = {
    syllabus_map: SITE.og.map,
    map: SITE.og.map,
    archive: SITE.og.library,
    deep_summary: SITE.og.summary,
    summary: SITE.og.summary,
    cram_sheet: SITE.og.cram,
    cram: SITE.og.cram,
    drill: SITE.og.drill,
    speed_quiz: SITE.og.drill,
    mock_exam: SITE.og.mock,
    mock: SITE.og.mock,
    weak_spot: SITE.og.mock,
  };

  const knownCourseOg = ["itf", "ics", "mfit", "pscp", "charm", "fe", "sport", "compro"];
  const courseOg = knownCourseOg.includes(course.code.toLowerCase())
    ? `/og/${course.code.toLowerCase()}.png`
    : SITE.og.courses;

  const ogImage = MODULE_OG_MAP[spec.id] ?? MODULE_OG_MAP[spec.segment] ?? courseOg;

  return {
    title: pageTitle,
    description,
    alternates: { canonical },
    openGraph: {
      type: "website",
      url: absoluteUrl(canonical),
      title: `${pageTitle} · ${SITE.shortName}`,
      description,
      images: [
        {
          url: ogImage,
          width: SITE.og.width,
          height: SITE.og.height,
          alt: pageTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${pageTitle} · ${SITE.shortName}`,
      description,
      images: [ogImage],
    },
    // The library is behind a sign-in, so the page holds nothing a crawler
    // could index — and listing it would only advertise material the courses
    // asked not to have published.
    ...(spec.id === "archive" ? { robots: { index: false, follow: true } } : {}),
  };
}

export default async function CourseModulePage({
  params,
}: {
  params: Promise<{ dir: string; module: string }>;
}) {
  const { dir, module: segment } = await params;
  const found = lookup(dir, segment);
  if (!found) notFound();

  const { course, spec, mod, cDir } = found;
  const backHref = `/courses/${cDir}`;
  const backLabel: LText = { th: course.nameTh, en: course.nameEn };

  // ── archive ───────────────────────────────────────────────────────────────
  if (spec.id === "archive") {
    // Existence only — the assets themselves are never rendered here. The
    // library is for signed-in KMITL IT students, and this page is statically
    // prerendered, so the list is fetched from /api/library/assets behind that
    // check instead of being baked into HTML anyone can read.
    if (mergedAssets(course.code).length === 0) notFound();
    return (
      <>
        <Navbar />
        <SubjectLibraryGate
          courseCode={course.code}
          backHref={backHref}
          backLabel={backLabel}
          title={{
            th: `คลังเรียนรู้ · ${course.code}`,
            en: `Learning Library · ${course.code}`,
          }}
          subtitle={mod.subtitle}
        />
      </>
    );
  }

  // ── applied ───────────────────────────────────────────────────────────────
  // The lab bank is ComPro-specific: its problems, its exact-output rules and
  // every walkthrough are written against that portal's chapters 1-5. Courses
  // whose applied practice lives elsewhere carry an `href` and never land here.
  if (spec.id === "applied") {
    if (course.code !== "COMPRO") notFound();
    return (
      <>
        <Navbar />
        <ModuleShell backHref={backHref} backLabel={backLabel} title={mod.title} subtitle={mod.subtitle}>
          <ComProLabHub />
        </ModuleShell>
      </>
    );
  }

  // ── question banks ────────────────────────────────────────────────────────
  const binding = moduleBinding(course.code, spec.id);
  const bank = binding?.bank?.() ?? [];
  if (bank.length > 0) {
    const { chapters, chapterLabel } = getCourseChapters(course.code);
    const docs = readerDocs(course.code, spec.id);
    return (
      <>
        <Navbar />
        <ModuleShell backHref={backHref} backLabel={backLabel} title={mod.title} subtitle={mod.subtitle}>
          <article className="overflow-hidden rounded-3xl border bg-card p-4 sm:p-6 shadow-sm">
            <SubjectQuizGate
              quizId={binding?.quizId ?? 0}
              quizName={course.code}
              questions={bank}
              chapters={chapters}
              chapterLabel={chapterLabel}
            />
          </article>
        </ModuleShell>

        {/*
         * Rendered as its own top-level block, not nested inside ModuleShell's
         * max-w-4xl column or wrapped in a second card. ModuleReader already
         * lays its outline panel out as a sibling of the article, at its own
         * max-w-6xl/7xl width — nesting it inside a padded card here used to
         * squeeze that sidebar into the card instead of letting it sit beside
         * the reader.
         */}
        {docs.length > 0 && (
          <ModuleReader
            docs={docs}
            backHref={backHref}
            backLabel={backLabel}
            assets={assetsForCourse(course.code) ?? []}
            courseCode={course.code}
            moduleKey={`${course.code}/${spec.segment}`}
            variant={NOTEBOOK_SEGMENTS.has(spec.segment) ? "notebook" : "default"}
          />
        )}
      </>
    );
  }

  // ── readers ───────────────────────────────────────────────────────────────
  const docs = readerDocs(course.code, spec.id);
  if (docs.length === 0) notFound();
  const forward = forwardHref(course, cDir);

  const assets = assetsForCourse(course.code) ?? [];

  return (
    <>
      <Navbar />
      <ModuleReader
        docs={docs}
        backHref={backHref}
        backLabel={backLabel}
        nextHref={forward?.href}
        nextLabel={forward?.label ?? L.quizFallback}
        assets={assets}
        courseCode={course.code}
        title={mod.title}
        subtitle={mod.subtitle}
        moduleKey={`${course.code}/${spec.segment}`}
        variant={NOTEBOOK_SEGMENTS.has(spec.segment) ? "notebook" : "default"}
      />
    </>
  );
}
