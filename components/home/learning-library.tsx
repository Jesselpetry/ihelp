"use client";

import { useState, useMemo, useCallback } from "react";
import { COURSES, GROUPS } from "@/lib/courses/catalog";
import { useLocale } from "@/lib/i18n";
import {
  filterAndSortCourses,
  DEFAULT_FILTER_STATE,
  type CourseFilterGroup,
  type CourseSortOption,
} from "@/lib/home/course-filter";
import { LibraryHeader } from "./library-header";
import { LibraryToolbar, LibraryEmptyState } from "./library-toolbar";
import { SemesterGroup } from "./semester-group";
import { cn } from "@/lib/utils";

export function LearningLibrary({
  readiness = {},
  className,
}: {
  readiness?: Record<string, number>;
  className?: string;
}) {
  const { locale } = useLocale();
  const [query, setQuery] = useState(DEFAULT_FILTER_STATE.query);
  const [selectedGroup, setSelectedGroup] = useState<CourseFilterGroup>(
    DEFAULT_FILTER_STATE.selectedGroup
  );
  const [sortBy, setSortBy] = useState<CourseSortOption>(
    DEFAULT_FILTER_STATE.sortBy
  );

  const resetFilters = useCallback(() => {
    setQuery("");
    setSelectedGroup("all");
    setSortBy("current-first");
  }, []);

  const filteredCourses = useMemo(() => {
    return filterAndSortCourses(
      COURSES,
      { query, selectedGroup, sortBy },
      locale
    );
  }, [query, selectedGroup, sortBy, locale]);

  // Group definitions: Put Y1-S2 first when sorting current-first
  const orderedGroups = useMemo(() => {
    if (selectedGroup !== "all") {
      return GROUPS.filter((g) => g.id === selectedGroup);
    }

    if (sortBy === "current-first") {
      const current = GROUPS.filter((g) => g.id === "Y1-S2");
      const others = GROUPS.filter((g) => g.id !== "Y1-S2");
      return [...current, ...others];
    }

    return GROUPS;
  }, [selectedGroup, sortBy]);

  return (
    <div id="courses-library" className={cn("space-y-4 scroll-mt-20", className)}>
      {/* ── 1. Aligned Section Header & Search Input ── */}
      <LibraryHeader query={query} onQueryChange={setQuery} />

      {/* ── 2. Category Filter Pills & Sorting Dropdown ── */}
      <LibraryToolbar
        selectedGroup={selectedGroup}
        onGroupChange={setSelectedGroup}
        sortBy={sortBy}
        onSortChange={setSortBy}
        matchCount={filteredCourses.length}
      />

      {/* ── 3. Empty State ── */}
      {filteredCourses.length === 0 && (
        <LibraryEmptyState onReset={resetFilters} className="mt-6" />
      )}

      {/* ── 4. Semester Groups (Card-Based Accordion Stream) ── */}
      {filteredCourses.length > 0 && (
        <div className="space-y-3 sm:space-y-3.5 pt-2">
          {orderedGroups.map((group) => {
            const groupCourses = filteredCourses.filter(
              (c) => c.group === group.id
            );
            if (groupCourses.length === 0) return null;

            const isCurrent = group.id === "Y1-S2";

            return (
              <SemesterGroup
                key={group.id}
                groupId={group.id}
                groupLabel={group.label}
                groupNote={group.note}
                courses={groupCourses}
                readiness={readiness}
                isCurrent={isCurrent}
                searchQuery={query}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
