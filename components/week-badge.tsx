import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Cycle of soft badge palettes; week N picks (N-1) mod length. Blue-free so
// nothing here competes with the PSCP Pink accent (used only on /pscp views).
const WEEK_STYLES = [
  "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-300 dark:border-orange-900",
  "bg-violet-100 text-violet-700 border-violet-200 dark:bg-violet-950 dark:text-violet-300 dark:border-violet-900",
  "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-900",
  "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-900",
  "bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-900",
  "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-900",
];

export function WeekBadge({ week, className }: { week: number; className?: string }) {
  const style = WEEK_STYLES[(week - 1) % WEEK_STYLES.length];
  return (
    <Badge variant="outline" className={cn("font-semibold", style, className)}>
      Week {week}
    </Badge>
  );
}
