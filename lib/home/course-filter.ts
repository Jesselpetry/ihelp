import type { CatalogCourse, CourseGroup } from "@/lib/courses/catalog";
import { COURSES } from "@/lib/courses/catalog";
import type { Locale } from "@/lib/ltext";

export type CourseFilterGroup = "all" | CourseGroup;

export type CourseSortOption =
  | "current-first"
  | "semester-asc"
  | "code-asc"
  | "name-asc";

export interface CourseFilterState {
  query: string;
  selectedGroup: CourseFilterGroup;
  sortBy: CourseSortOption;
}

export const DEFAULT_FILTER_STATE: CourseFilterState = {
  query: "",
  selectedGroup: "all",
  sortBy: "current-first",
};

/** Semester priority ranking */
const GROUP_WEIGHTS_CURRENT_FIRST: Record<CourseGroup, number> = {
  "Y1-S2": 0,
  "Y1-S1": 1,
  "EN-KMITL": 2,
};

const GROUP_WEIGHTS_CHRONOLOGICAL: Record<CourseGroup, number> = {
  "Y1-S1": 0,
  "Y1-S2": 1,
  "EN-KMITL": 2,
};

/**
 * Checks if a course matches the search query across:
 * code, officialCode, nameTh, nameEn, slug, and instructors.
 */
export function matchesCourse(course: CatalogCourse, query: string): boolean {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return true;

  const terms = normalized.split(/\s+/).filter(Boolean);

  const searchableText = [
    course.code,
    course.officialCode ?? "",
    course.nameTh,
    course.nameEn,
    course.slug,
    ...(course.instructors ?? []),
  ]
    .join(" ")
    .toLowerCase();

  return terms.every((term) => searchableText.includes(term));
}

/**
 * Sorts catalog courses based on the chosen sort option and locale.
 */
export function sortCourses(
  courses: CatalogCourse[],
  sortBy: CourseSortOption,
  locale: Locale = "th"
): CatalogCourse[] {
  const copy = [...courses];

  switch (sortBy) {
    case "current-first": {
      return copy.sort((a, b) => {
        const weightA = GROUP_WEIGHTS_CURRENT_FIRST[a.group] ?? 99;
        const weightB = GROUP_WEIGHTS_CURRENT_FIRST[b.group] ?? 99;
        if (weightA !== weightB) return weightA - weightB;
        // Maintain original catalog order as secondary sort
        return COURSES.indexOf(a) - COURSES.indexOf(b);
      });
    }

    case "semester-asc": {
      return copy.sort((a, b) => {
        const weightA = GROUP_WEIGHTS_CHRONOLOGICAL[a.group] ?? 99;
        const weightB = GROUP_WEIGHTS_CHRONOLOGICAL[b.group] ?? 99;
        if (weightA !== weightB) return weightA - weightB;
        return COURSES.indexOf(a) - COURSES.indexOf(b);
      });
    }

    case "code-asc": {
      return copy.sort((a, b) => a.code.localeCompare(b.code));
    }

    case "name-asc": {
      return copy.sort((a, b) => {
        const nameA = locale === "en" ? a.nameEn : a.nameTh;
        const nameB = locale === "en" ? b.nameEn : b.nameTh;
        return nameA.localeCompare(nameB, locale === "en" ? "en" : "th");
      });
    }

    default:
      return copy;
  }
}

/**
 * Filters and sorts catalog courses.
 */
export function filterAndSortCourses(
  courses: CatalogCourse[],
  state: CourseFilterState,
  locale: Locale = "th"
): CatalogCourse[] {
  const filtered = courses.filter((course) => {
    // 1. Group filter
    if (state.selectedGroup !== "all" && course.group !== state.selectedGroup) {
      return false;
    }
    // 2. Query filter
    return matchesCourse(course, state.query);
  });

  return sortCourses(filtered, state.sortBy, locale);
}
