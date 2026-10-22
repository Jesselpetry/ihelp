"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  ClipboardCheck,
  Code2,
  FileText,
  FolderOpen,
  GraduationCap,
  type LucideIcon,
  Map,
  NotebookPen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocale, t } from "@/lib/i18n";
import { SUBJECTS } from "@/lib/study-space/subjects";
import type { ResourceKind, StudyResource, SubjectCode } from "@/lib/study-space/types";

/**
 * The study space's building blocks. Every bar, tag, toggle and link on the
 * page is one of these, so spacing, radius and type scale are decided here
 * once:
 *
 *   surface   rounded-2xl border bg-card (rounded-xl inside the sheet)
 *   padding   p-4 (p-3 inside the sheet)
 *   title     text-sm/base font-semibold
 *   meta      text-xs text-muted-foreground
 *   numbers   tabular-nums
 */

export function SubjectDot({ code, className }: { code: SubjectCode; className?: string }) {
  return <span aria-hidden className={cn("inline-block size-2 shrink-0 rounded-full", SUBJECTS[code].accent.dot, className)} />;
}

export function SubjectTag({ code, className }: { code: SubjectCode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-xs font-semibold", className)}>
      <SubjectDot code={code} />
      {SUBJECTS[code].shortName}
    </span>
  );
}

export function ProgressBar({
  value,
  className,
  barClassName,
  label,
}: {
  /** 0..1 */
  value: number;
  className?: string;
  barClassName?: string;
  label?: string;
}) {
  const pct = Math.round(Math.min(1, Math.max(0, value)) * 100);
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={pct}
      aria-label={label}
      className={cn("h-1.5 w-full overflow-hidden rounded-full bg-muted", className)}
    >
      <div
        className={cn("h-full rounded-full bg-primary transition-[width] duration-500", barClassName)}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export function Stat({ label, value, sub }: { label: string; value: React.ReactNode; sub?: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-0.5 text-lg font-semibold tabular-nums leading-tight">
        {value}
        {sub && <span className="ml-1 text-xs font-normal text-muted-foreground">{sub}</span>}
      </div>
    </div>
  );
}

export function Segmented<T extends string>({
  value,
  onChange,
  options,
  className,
  size = "md",
  label,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: React.ReactNode; disabled?: boolean }[];
  className?: string;
  size?: "sm" | "md";
  label: string;
}) {
  // A labelled group of pressed/unpressed buttons: it switches what one area
  // shows (or a mode), so tab semantics would promise panels and arrow keys
  // it does not have.
  return (
    <div role="group" aria-label={label} className={cn("inline-flex rounded-xl bg-muted p-1", className)}>
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            aria-pressed={active}
            disabled={o.disabled}
            onClick={() => onChange(o.value)}
            className={cn(
              "flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg font-medium transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50",
              size === "sm" ? "px-2.5 py-1 text-xs" : "px-3 py-1.5 text-sm",
              active ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

const RESOURCE_ICON: Record<ResourceKind, LucideIcon> = {
  week: BookOpen,
  summary: FileText,
  quiz: ClipboardCheck,
  mock: NotebookPen,
  problems: Code2,
  library: FolderOpen,
  overview: Map,
  exam: CalendarDays,
  external: GraduationCap,
};

/**
 * A link to course material. Opens in a new tab: the study page is usually
 * running a timer, and navigating it away would silence the chime.
 *
 *   row   full-width list row (sheet, course checklist)
 *   chip  compact pill (today's list)
 */
export function ResourceLink({
  resource,
  variant = "row",
  className,
}: {
  resource: StudyResource;
  variant?: "row" | "chip";
  className?: string;
}) {
  const { locale } = useLocale();
  const Icon = RESOURCE_ICON[resource.kind];
  return (
    <Link
      href={resource.href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
        variant === "row"
          ? "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm hover:bg-muted"
          : "inline-flex max-w-full items-center gap-1.5 rounded-full border bg-card px-3 py-1.5 text-xs hover:border-primary/40 hover:text-primary",
        className,
      )}
    >
      <Icon className={cn("shrink-0 text-muted-foreground group-hover:text-primary", variant === "row" ? "size-4" : "size-3.5")} />
      <span className={cn("min-w-0 truncate", variant === "row" && "flex-1")}>{t(resource.label, locale)}</span>
      {variant === "row" && (
        <ArrowUpRight className="size-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
      )}
    </Link>
  );
}

/** A round check that reads as a checkbox to assistive tech. */
export function DoneToggle({
  done,
  onToggle,
  label,
  className,
}: {
  done: boolean;
  onToggle: () => void;
  label: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={done}
      aria-label={label}
      title={label}
      onClick={onToggle}
      className={cn(
        "grid size-5 shrink-0 place-items-center rounded-full border transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
        done ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/40 hover:border-primary",
        className,
      )}
    >
      {done && (
        <svg viewBox="0 0 12 12" className="size-3" aria-hidden>
          <path d="M2.5 6.2 5 8.5l4.5-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  );
}
