import { cn } from "@/lib/utils";
import { getCourseAbbr } from "@/lib/courses/catalog";

/**
 * Signature iHelp gradient blue course code pill used across Grades, Timetable, and Course Hubs.
 * Automatically resolves numeric KMITL codes to standard abbreviations (e.g. 06066101 -> BFIT).
 */
export function CourseCodeBadge({
  code,
  className,
}: {
  code: string;
  className?: string;
}) {
  const displayCode = getCourseAbbr(code) || code;

  return (
    <span
      className={cn(
        "inline-flex min-w-13 shrink-0 items-center justify-center rounded-md border border-white/15 bg-ihelp-gradient px-2 py-0.5 font-mono text-[11px] font-bold tracking-tight text-white shadow-2xs select-none",
        className,
      )}
    >
      {displayCode}
    </span>
  );
}

