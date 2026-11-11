import { cn } from "@/lib/utils";

/**
 * Signature iHelp gradient blue course code pill used in the Grades Hub.
 */
export function CourseCodeBadge({
  code,
  className,
}: {
  code: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex min-w-13 shrink-0 items-center justify-center rounded-md border border-white/15 bg-ihelp-gradient px-2 py-0.5 font-mono text-[11px] font-bold tracking-tight text-white shadow-2xs select-none",
        className,
      )}
    >
      {code}
    </span>
  );
}

