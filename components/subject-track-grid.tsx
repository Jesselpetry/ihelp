"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  BookOpenText,
  BrainCircuit,
  CalendarClock,
  CalendarRange,
  FileCheck2,
  Flag,
  Library,
  ListChecks,
  Lock,
  Microscope,
  Milestone,
  ScrollText,
  Timer,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useLocale, t, type LText } from "@/lib/i18n";
import type {
  CourseTrackItem,
  TrackIcon,
  TrackScope,
} from "@/lib/course-tracks";

export const TRACK_ICONS: Record<TrackIcon, LucideIcon> = {
  overview: ScrollText,
  summary: BookOpenText,
  cram: Zap,
  learning_path: CalendarClock,
  quiz: BrainCircuit,
  mock_exam: FileCheck2,
  speed_quiz: Timer,
  problems: ListChecks,
  library: Library,
  analysis: Microscope,
};

const SCOPE_ICON: Record<TrackScope, LucideIcon> = {
  all: CalendarRange,
  midterm: Milestone,
  final: Flag,
};

const SCOPE_LABEL: Record<TrackScope, LText> = {
  all: { th: "ทั้งหมด", en: "All" },
  midterm: { th: "ก่อนมิดเทอม", en: "Midterm" },
  final: { th: "หลังมิดเทอม", en: "Final" },
};

/**
 * Marks a card that only applies to one half of the term.
 *
 * One hue — the KMITL brand blue — at two volumes, so the milestone reads as a
 * single family rather than two unrelated colours. Uses the `primary` token
 * rather than a literal #2357A5: the hub layout rebinds it per course, and it
 * relights to #5c9bf5 in dark mode.
 *
 * Kept in step with the same map in components/subject-library.tsx.
 */
const SCOPE_BADGE: Record<Exclude<TrackScope, "all">, string> = {
  midterm: "border-transparent bg-primary text-primary-foreground shadow-xs",
  final: "border-primary/30 bg-primary/10 text-primary",
};

const L = {
  heading: { th: "เนื้อหาในวิชานี้", en: "What this course offers" },
  examScope: { th: "ช่วงสอบ", en: "Exam scope" },
  empty: {
    th: "ยังไม่มีเนื้อหาสำหรับช่วงสอบนี้",
    en: "Nothing prepared for this milestone yet",
  },
} satisfies Record<string, LText>;

const CARD_BASE = "rounded-3xl border p-5 transition-colors";

function ScopeTag({ scope }: { scope: Exclude<TrackScope, "all"> }) {
  const { locale } = useLocale();
  const Icon = SCOPE_ICON[scope];
  return (
    <span
      className={`inline-flex items-center gap-0.5 rounded-full border px-1.5 py-0.5 text-[9px] font-semibold ${SCOPE_BADGE[scope]}`}
    >
      <Icon className="size-2.5" />
      {t(SCOPE_LABEL[scope], locale)}
    </span>
  );
}

function TrackCard({ track }: { track: CourseTrackItem }) {
  const { locale } = useLocale();
  const Icon = track.icon ? TRACK_ICONS[track.icon] : ScrollText;
  const unavailable = track.status !== "available" || !track.href;

  const body = (
    <>
      <div className="flex items-start justify-between gap-2">
        {unavailable ? <Lock className="size-6" /> : <Icon className="size-6 text-primary" />}
        {track.badge && (
          <Badge
            variant="outline"
            className="rounded-full text-[10px] font-medium whitespace-nowrap"
          >
            {t(track.badge, locale)}
          </Badge>
        )}
      </div>

      <h3
        className={`mt-3 text-base font-semibold ${
          unavailable ? "" : "transition-colors group-hover:text-primary"
        }`}
      >
        {t(track.title, locale)}
      </h3>

      <p
        className={`mt-1.5 text-xs leading-relaxed ${
          unavailable ? "" : "text-muted-foreground"
        }`}
      >
        {t(track.subtitle, locale)}
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        {track.scope !== "all" && <ScopeTag scope={track.scope} />}
        {track.stats && (
          <span className="text-[10px] font-medium tabular-nums text-muted-foreground">
            {t(track.stats, locale)}
          </span>
        )}
      </div>
    </>
  );

  if (unavailable) {
    return (
      <div
        aria-disabled="true"
        className={`${CARD_BASE} pointer-events-none cursor-not-allowed border-dashed bg-muted text-muted-foreground opacity-40`}
      >
        {body}
      </div>
    );
  }

  return (
    <Link
      href={track.href!}
      className={`${CARD_BASE} group bg-card shadow-xs hover:-translate-y-0.5 hover:border-primary/50 hover:bg-primary/5 hover:shadow-md`}
    >
      {body}
    </Link>
  );
}

/**
 * The hub's action cards, rendered from the course's track config.
 *
 * The milestone control filters and reorders in one move: picking a milestone
 * floats the cards specific to it above the ones that apply all term, so the
 * thing a student came for is first rather than wherever the roadmap order
 * happened to put it.
 */
export function SubjectTrackGrid({ tracks }: { tracks: CourseTrackItem[] }) {
  const { locale } = useLocale();
  const [scope, setScope] = useState<TrackScope>("all");

  // A course whose every card applies all term has no milestone to pick
  // between, so the control stays out of the way.
  const scoped = tracks.some((track) => track.scope !== "all");

  const shown = useMemo(() => {
    if (scope === "all") return tracks;
    const matching = tracks.filter((track) => track.scope === scope);
    const allTerm = tracks.filter((track) => track.scope === "all");
    return [...matching, ...allTerm];
  }, [tracks, scope]);

  const counts = useMemo(() => {
    const allTerm = tracks.filter((track) => track.scope === "all").length;
    return {
      all: tracks.length,
      midterm: tracks.filter((t2) => t2.scope === "midterm").length + allTerm,
      final: tracks.filter((t2) => t2.scope === "final").length + allTerm,
    } satisfies Record<TrackScope, number>;
  }, [tracks]);

  return (
    <section>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {t(L.heading, locale)}
        </h2>

        {scoped && (
          <div
            role="group"
            aria-label={t(L.examScope, locale)}
            className="flex w-full gap-1 rounded-full border bg-card p-1 sm:w-auto"
          >
            {(["all", "midterm", "final"] as const).map((option) => {
              const active = scope === option;
              const Icon = SCOPE_ICON[option];
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => setScope(option)}
                  aria-pressed={active}
                  className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors sm:flex-none sm:px-3.5 ${
                    active
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Icon className="size-3.5" />
                  <span className="truncate">{t(SCOPE_LABEL[option], locale)}</span>
                  <span className="tabular-nums opacity-70">{counts[option]}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {shown.length === 0 ? (
        <p className="rounded-3xl border bg-muted/20 py-12 text-center text-sm text-muted-foreground">
          {t(L.empty, locale)}
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((track) => (
            <TrackCard key={track.id} track={track} />
          ))}
        </div>
      )}
    </section>
  );
}
