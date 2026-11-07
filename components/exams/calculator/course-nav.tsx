"use client";

import type { CourseCalculator } from "@/lib/exams/grade-calculator";
import { calculateCourseResult } from "@/lib/exams/grade-calculator";

interface CourseNavProps {
  courses: CourseCalculator[];
  activeCourseId: string;
  onSelectCourse: (id: string) => void;
}

export function CourseNav({ courses, activeCourseId, onSelectCourse }: CourseNavProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-0.5 scrollbar-thin">
      {courses.map((course) => {
        const isActive = course.id === activeCourseId;
        const result = calculateCourseResult(course);
        const hasScore = result.totalScore > 0;

        return (
          <button
            key={course.id}
            type="button"
            onClick={() => onSelectCourse(course.id)}
            className={`group flex items-center gap-2 rounded-2xl border px-3.5 py-2 text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
              isActive
                ? "border-primary/60 bg-primary/10 text-primary shadow-xs ring-1 ring-primary/30 font-semibold dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]"
                : "bg-card/80 hover:bg-muted/70 text-muted-foreground hover:text-foreground border-border/80 dark:border-white/5"
            }`}
          >
            <span
              className="size-2 rounded-full shrink-0"
              style={{ backgroundColor: course.color || "#4c93ff" }}
            />
            <span className="font-mono font-bold">{course.shortCode}</span>
            <span className="max-w-[6.5rem] truncate text-[11px] hidden sm:inline text-muted-foreground group-hover:text-foreground">
              {course.nameTh}
            </span>

            {/* Live Grade Pill */}
            {hasScore && (
              <span
                className={`ml-1 text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-md ${
                  result.grade === "A" || result.grade === "S"
                    ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                    : result.grade === "F" || result.grade === "U"
                    ? "bg-destructive/15 text-destructive border border-destructive/30"
                    : "bg-primary/15 text-primary border border-primary/30"
                }`}
              >
                {result.grade}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

