import { cn } from "@/lib/utils";

/**
 * Neutral monospace course code pill used in the Grades Hub.
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
        "inline-flex min-w-13 shrink-0 items-center justify-center rounded-md border border-border/60 bg-muted px-2 py-0.5 font-mono text-[11px] font-bold tracking-tight text-foreground select-none",
        className,
      )}
    >
      {code}
    </span>
  );
}

