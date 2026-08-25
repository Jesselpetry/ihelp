"use client";

import Link from "next/link";
import {
  BookOpenText,
  BrainCircuit,
  FileCheck2,
  Library,
  ListChecks,
  Lock,
  ScrollText,
  type LucideIcon,
} from "lucide-react";
import { useLocale, t } from "@/lib/i18n";
import { TRACK_LABEL, TRACK_ORDER, type TrackKind } from "@/lib/catalog";

export const TRACK_ICON: Record<TrackKind, LucideIcon> = {
  overview: ScrollText,
  summary: BookOpenText,
  quiz: BrainCircuit,
  mock_exam: FileCheck2,
  problems: ListChecks,
  library: Library,
};

/**
 * One track chip. An available track links straight to its page; an
 * unavailable one still renders — greyed out and inert — so the reader sees
 * the whole roadmap and can tell "not built yet" from "does not exist".
 */
export function TrackChip({
  kind,
  href,
  color,
}: {
  kind: TrackKind;
  href?: string;
  color?: string;
}) {
  const { locale } = useLocale();
  const Icon = TRACK_ICON[kind];
  const label = t(TRACK_LABEL[kind], locale);

  if (!href) {
    return (
      <span
        aria-disabled="true"
        className="pointer-events-none inline-flex cursor-not-allowed items-center gap-1 rounded-full border border-dashed bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground opacity-40"
      >
        <Lock className="size-3" />
        {label}
      </span>
    );
  }

  const customStyle = color
    ? {
        backgroundColor: `${color}18`,
        color: color,
        borderColor: `${color}35`,
      }
    : undefined;

  return (
    <Link
      href={href}
      style={customStyle}
      className={`inline-flex items-center gap-1 rounded-full border border-transparent bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary transition-all duration-150 hover:brightness-110 hover:shadow-2xs ${
        color ? "hover:opacity-90" : "hover:bg-primary/20"
      }`}
    >
      <Icon className="size-3" />
      {label}
    </Link>
  );
}

/** The full six-track row, always in TRACK_ORDER. */
export function TrackChips({
  tracks,
  className = "",
  color,
}: {
  tracks: Partial<Record<TrackKind, string>>;
  className?: string;
  color?: string;
}) {
  return (
    <div className={`flex flex-wrap gap-1.5 ${className}`}>
      {TRACK_ORDER.map((kind) => (
        <TrackChip
          key={kind}
          kind={kind}
          href={tracks[kind]}
          color={color}
        />
      ))}
    </div>
  );
}
