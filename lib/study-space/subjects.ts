import { COURSES, courseDir } from "@/lib/courses/catalog";
import type { SubjectCode, SubjectMeta } from "./types";

/**
 * The four courses with a central final exam in 1/2569, in exam order.
 *
 * Names, codes and folders come from lib/courses/catalog.ts so a rename there
 * reaches this page too. Exam dates and times are copied from
 * data/exams/final-exams.json (the registrar's central timetable); if that
 * file changes, change these with it. Rooms are not in it yet.
 */

function fromCatalog(code: SubjectCode) {
  const course = COURSES.find((c) => c.code === code);
  if (!course?.officialCode) throw new Error(`study-space: ${code} is missing from the catalog`);
  return {
    officialCode: course.officialCode,
    dir: courseDir(course),
    name: { th: course.nameTh, en: course.nameEn },
  };
}

export const SUBJECT_ORDER: SubjectCode[] = ["ITF", "ICS", "PSCP", "MFIT"];

export const SUBJECTS: Record<SubjectCode, SubjectMeta> = {
  ITF: {
    code: "ITF",
    ...fromCatalog("ITF"),
    shortName: "ITF",
    accent: {
      dot: "bg-violet-500",
      bar: "bg-violet-500",
      text: "text-violet-700 dark:text-violet-300",
      soft: "bg-violet-500/10",
    },
    exam: {
      startsAt: "2026-11-03T13:30:00+07:00",
      time: "13:30–16:30",
      date: { th: "อ. 3 พ.ย. 2569", en: "Tue 3 Nov 2026" },
      room: null,
    },
  },
  ICS: {
    code: "ICS",
    ...fromCatalog("ICS"),
    shortName: "ICS",
    accent: {
      dot: "bg-emerald-500",
      bar: "bg-emerald-500",
      text: "text-emerald-700 dark:text-emerald-300",
      soft: "bg-emerald-500/10",
    },
    exam: {
      startsAt: "2026-11-06T09:30:00+07:00",
      time: "09:30–12:30",
      date: { th: "ศ. 6 พ.ย. 2569", en: "Fri 6 Nov 2026" },
      room: null,
    },
  },
  PSCP: {
    code: "PSCP",
    ...fromCatalog("PSCP"),
    shortName: "PSCP",
    accent: {
      dot: "bg-amber-500",
      bar: "bg-amber-500",
      text: "text-amber-700 dark:text-amber-300",
      soft: "bg-amber-500/10",
    },
    exam: {
      startsAt: "2026-11-09T13:30:00+07:00",
      time: "13:30–16:30",
      date: { th: "จ. 9 พ.ย. 2569", en: "Mon 9 Nov 2026" },
      room: null,
    },
  },
  MFIT: {
    code: "MFIT",
    ...fromCatalog("MFIT"),
    shortName: "MFIT",
    accent: {
      dot: "bg-sky-500",
      bar: "bg-sky-500",
      text: "text-sky-700 dark:text-sky-300",
      soft: "bg-sky-500/10",
    },
    exam: {
      startsAt: "2026-11-11T13:30:00+07:00",
      time: "13:30–16:30",
      date: { th: "พ. 11 พ.ย. 2569", en: "Wed 11 Nov 2026" },
      room: null,
    },
  },
};
