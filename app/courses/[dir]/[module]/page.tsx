import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { ModuleReader, type ReaderDoc } from "@/components/module-reader";
import { SubjectQuizGate } from "@/components/subject-quiz-gate";
import { SubjectLibrary } from "@/components/subject-library";
import { ComProLabHub } from "@/components/compro-lab-hub";
import { ModuleShell } from "@/components/module-shell";
import { COURSES, courseDir, resolveCourse, type CatalogCourse } from "@/lib/catalog";
import { COURSE_BINDINGS } from "@/lib/course-bindings";
import { moduleBinding, resolveModule } from "@/lib/course-spine";
import {
  moduleBySegment,
  STANDARD_SPINE,
  type ModuleId,
  type ModuleSpec,
  type ResolvedModule,
} from "@/lib/spine";
import { getCourseChapters } from "@/lib/course-chapters";
import { assetsForCourse } from "@/lib/subject-library";
import { ComingSoonOverlay } from "@/components/coming-soon-overlay";
import { RESOURCE_LIBRARY_COMING_SOON } from "@/lib/flags";
import { t, type LText } from "@/lib/ltext";

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
  return {
    title: `${title} ${course.code} — ${course.nameTh}`,
    description: `${title} รายวิชา ${course.code} ${course.nameTh} (${course.nameEn}) IT KMITL — ${t(mod.subtitle, "th")}`,
    alternates: { canonical: `/courses/${cDir}/${segment}` },
    // Behind the cover there is nothing worth indexing, and indexing it would
    // leave the placeholder in search results after the library opens. Matches
    // what /library already does while LIBRARY_COMING_SOON is set.
    ...(spec.id === "archive" && RESOURCE_LIBRARY_COMING_SOON
      ? { robots: { index: false, follow: true } }
      : {}),
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
    const assets = assetsForCourse(course.code);
    if (!assets || assets.length === 0) notFound();
    const gallery = (
      <SubjectLibrary
        assets={assets}
        courseCode={course.code}
        backHref={backHref}
        backLabel={backLabel}
        title={{
          th: `คลังทรัพยากร · ${course.code}`,
          en: `Resource Library · ${course.code}`,
        }}
        subtitle={mod.subtitle}
      />
    );
    return (
      <>
        <Navbar />
        {RESOURCE_LIBRARY_COMING_SOON ? (
          <ComingSoonOverlay backHref={backHref}>{gallery}</ComingSoonOverlay>
        ) : (
          gallery
        )}
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
        {docs.length > 0 && <ModuleReader docs={docs} backHref={backHref} backLabel={backLabel} />}
      </>
    );
  }

  // ── readers ───────────────────────────────────────────────────────────────
  const docs = readerDocs(course.code, spec.id);
  if (docs.length === 0) notFound();
  const forward = forwardHref(course, cDir);

  return (
    <>
      <Navbar />
      <ModuleReader
        docs={docs}
        backHref={backHref}
        backLabel={backLabel}
        nextHref={forward?.href}
        nextLabel={forward?.label ?? L.quizFallback}
      />
    </>
  );
}
