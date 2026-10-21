import { SUBJECTS } from "./subjects";
import type { StudyResource, SubjectCode } from "./types";

/**
 * Every href the study space builds, in one place.
 *
 * They lean on routes that already exist: /courses/<dir>/<segment> from the
 * course spine (lib/courses/spine.ts), with `?doc=<slug>` picking a document
 * inside a multi-doc module (ModuleReader's DOC_PARAM), and /pscp with
 * `?week=<n>` preselecting the week filter. Slugs are the ones declared in
 * lib/courses/course-bindings.ts — if a binding renames a slug, fix it here.
 */

const pad = (n: number) => String(n).padStart(2, "0");
const base = (code: SubjectCode) => `/courses/${SUBJECTS[code].dir}`;

export const href = {
  hub: (code: SubjectCode) => base(code),
  overview: (code: SubjectCode) => `${base(code)}/overview`,
  library: (code: SubjectCode) => `${base(code)}/library`,
  /** ITF weeks 1–15 and ICS sessions 1–7 live on the "map" module. */
  weekPage: (code: "ITF" | "ICS", week: number) => `${base(code)}/map?doc=week${pad(week)}`,
  mfitSummary: (week: number) => `${base("MFIT")}/summary?doc=week${pad(week)}-summary`,
  mfitQuiz: (week: number) => `${base("MFIT")}/quiz?doc=week${pad(week)}-quiz`,
  mfitSyllabus: () => `${base("MFIT")}/map?doc=syllabus`,
  mfitFinalMock: () => `${base("MFIT")}/mock?doc=final-paper`,
  pscpWeek: (week: number) => `/pscp?week=${week}`,
  pscpProblem: (slug: string) => `/pscp/${slug}`,
  pscpHub: () => "/pscp",
  examSchedule: () => "/exam-schedule",
};

/** Ready-made resources the plan reuses. */
export const res = {
  overview: (code: SubjectCode): StudyResource => ({
    kind: "overview",
    label: { th: "ภาพรวมวิชาและขอบเขตสอบ", en: "Course overview & exam scope" },
    href: href.overview(code),
  }),
  library: (code: SubjectCode): StudyResource => ({
    kind: "library",
    label: { th: "คลังสไลด์และใบงาน", en: "Slides & lab sheets" },
    href: href.library(code),
  }),
  mfitMock: (): StudyResource => ({
    kind: "mock",
    label: { th: "ข้อสอบจำลองปลายภาค + เฉลย", en: "Final mock paper + key" },
    href: href.mfitFinalMock(),
  }),
  mfitSyllabus: (): StudyResource => ({
    kind: "summary",
    label: { th: "แผนที่เนื้อหาปลายภาค", en: "Final-scope syllabus map" },
    href: href.mfitSyllabus(),
  }),
  pscpProblem: (slug: string, name: string): StudyResource => ({
    kind: "problems",
    label: { th: name, en: name },
    href: href.pscpProblem(slug),
  }),
  pscpHub: (): StudyResource => ({
    kind: "problems",
    label: { th: "คลังโจทย์ iJudge ทั้งหมด", en: "All iJudge problems" },
    href: href.pscpHub(),
  }),
};
