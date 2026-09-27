"use client";

import { Fragment, useState } from "react";
import Link from "next/link";
import {
  CalendarRange,
  Download,
  ExternalLink,
  Eye,
  Flag,
  Images,
  Milestone,
  PlayCircle,
} from "lucide-react";
import { assetDownloadUrl } from "@/lib/library/asset-url";
import { useLocale, t, type LText } from "@/lib/i18n";
import {
  ASSET_GROUPS,
  formatBytes,
  resolveCategory,
  type AssetCategory,
  type AssetScope,
  type CourseSchedule,
  type CourseWeek,
  type SubjectAsset,
} from "@/lib/library/subject-library-ui";
import { StatusBadges } from "./badges";
import { SourceLink } from "./card-actions";
import { CATEGORY, L, metaLine } from "./types";

/**
 * The week view every course with a schedule opens on — ITF and ICS alike.
 *
 * One table, the same four columns as the library table (name · category ·
 * size · actions), grouped under a heading row per week. Nothing else: the
 * week says what was taught, the row says what the file is. Earlier-year decks,
 * print handouts and annotated copies stay out of the way until asked for.
 */

// Pinned to the right edge only while the table scrolls sideways (narrow
// screens); on desktop it would just draw a seam down the week headings.
const ACTIONS_CELL =
  "sticky right-0 z-10 w-28 whitespace-nowrap bg-card/95 backdrop-blur-xs pl-2 pr-4 text-right shadow-[-6px_0_10px_-4px_rgba(0,0,0,0.06)] md:static md:bg-transparent md:shadow-none md:backdrop-blur-none";
const ICON_BTN =
  "inline-flex rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-primary";

/** The order a student works through a week: lecture, lab, then the rest. */
const ORDER: AssetCategory[] = ["lecture", "exercise", "reference", "cheatsheet", "note", "exam"];
const byCategory = (a: SubjectAsset, b: SubjectAsset) =>
  ORDER.indexOf(resolveCategory(a)) - ORDER.indexOf(resolveCategory(b));

function isOlder(asset: SubjectAsset): boolean {
  return Boolean(asset.isDuplicate) || asset.status === "legacy" || asset.status === "duplicate";
}

const pad = (n: number) => String(n).padStart(2, "0");
const anchor = (w: CourseWeek) => `week-${w.scope ?? "all"}-${pad(w.week)}`;
const PART_ICON: Record<AssetScope, typeof Flag> = { midterm: Milestone, final: Flag };

/** Which scheduled week an asset belongs under, if any. */
function weekOf(asset: SubjectAsset, weeks: CourseWeek[]): CourseWeek | undefined {
  const n = asset.week ?? asset.chapter;
  if (n === undefined) return undefined;
  return weeks.find(
    (w) => w.week === n && (!w.scope || !asset.scope || w.scope === asset.scope),
  );
}

type Row =
  | { kind: "asset"; asset: SubjectAsset; older: boolean }
  | { kind: "stack"; title: LText; assets: SubjectAsset[] }
  | { kind: "video"; href: string };

export function WeeklyTable({
  schedule,
  assets,
  scope,
  narrowed,
  onOpen,
}: {
  schedule: CourseSchedule;
  /** Already narrowed by the page's search, category and tag filters. */
  assets: SubjectAsset[];
  scope: AssetScope | "all";
  /** True while search or a filter is narrowing the shelf. */
  narrowed: boolean;
  onOpen: (items: SubjectAsset[], index: number) => void;
}) {
  const { locale } = useLocale();
  const [showOlder, setShowOlder] = useState(false);

  const placed = new Map<CourseWeek, SubjectAsset[]>();
  const unplaced: SubjectAsset[] = [];
  for (const asset of assets) {
    const week = weekOf(asset, schedule.weeks);
    if (!week) unplaced.push(asset);
    else placed.set(week, [...(placed.get(week) ?? []), asset]);
  }
  const olderCount = assets.filter(isOlder).length;

  const rowsFor = (week: CourseWeek): Row[] => {
    const list = placed.get(week) ?? [];
    const current = list.filter((a) => !isOlder(a)).sort(byCategory);
    const older = list.filter(isOlder).sort(byCategory);
    // A week with nothing current still shows what it has, and an unreleased
    // week's earlier-year decks are the reason to open it at all.
    const shownOlder = showOlder || current.length === 0 || week.upcoming ? older : [];
    const rows: Row[] = current.map((asset) => ({ kind: "asset", asset, older: false }));
    if (week.video && !narrowed) {
      const afterLectures = current.filter((a) => resolveCategory(a) === "lecture").length;
      rows.splice(afterLectures, 0, { kind: "video", href: week.video });
    }
    return [...rows, ...shownOlder.map((asset): Row => ({ kind: "asset", asset, older: true }))];
  };

  // The whole-term group collapses a scanned page run into one row.
  const termRows: Row[] = [];
  const seenGroups = new Set<string>();
  for (const asset of unplaced) {
    const group = asset.groupId ? ASSET_GROUPS[asset.groupId] : undefined;
    if (!group || !asset.groupId) {
      if (!isOlder(asset) || showOlder) termRows.push({ kind: "asset", asset, older: isOlder(asset) });
      continue;
    }
    if (seenGroups.has(asset.groupId)) continue;
    seenGroups.add(asset.groupId);
    termRows.push({
      kind: "stack",
      title: group,
      assets: unplaced.filter((a) => a.groupId === asset.groupId),
    });
  }

  const weeks = schedule.weeks
    .filter((w) => scope === "all" || !w.scope || w.scope === scope)
    .map((week) => ({ week, rows: rowsFor(week) }))
    .filter(({ rows }) => !narrowed || rows.length > 0);

  const jump = (week: CourseWeek) =>
    document.getElementById(anchor(week))?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <div className="space-y-3">
      {/* Week strip — one line of numbers, a mark where each half begins */}
      {weeks.length > 1 && (
        <nav
          aria-label={t(L.weeks, locale)}
          className="sticky top-[5.5rem] z-20 flex items-center gap-1 overflow-x-auto rounded-full border bg-background/90 p-1 shadow-2xs backdrop-blur-md [scrollbar-width:none]"
        >
          {weeks.map(({ week }, i) => {
            const newPart = week.scope && week.scope !== weeks[i - 1]?.week.scope;
            const PartIcon = week.scope ? PART_ICON[week.scope] : null;
            return (
              <Fragment key={anchor(week)}>
                {newPart && PartIcon && (
                  <PartIcon aria-hidden className="mx-1 size-3.5 shrink-0 text-muted-foreground" />
                )}
                <button
                  type="button"
                  onClick={() => jump(week)}
                  title={t(week.title, locale)}
                  className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold tabular-nums transition-colors hover:bg-primary hover:text-primary-foreground cursor-pointer ${
                    week.upcoming ? "text-muted-foreground/60" : "text-foreground"
                  }`}
                >
                  {pad(week.week)}
                </button>
              </Fragment>
            );
          })}
        </nav>
      )}

      <div className="overflow-hidden rounded-2xl border bg-card shadow-xs">
        {(schedule.source || olderCount > 0) && (
          <div className="flex items-center justify-between gap-2 border-b px-4 py-2 text-xs">
            {schedule.source ? (
              <a
                href={schedule.source}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                <ExternalLink className="size-3.5" />
                {t(L.source, locale)}: OnLearn
              </a>
            ) : (
              <span />
            )}
            {olderCount > 0 && (
              <button
                type="button"
                onClick={() => setShowOlder(!showOlder)}
                aria-pressed={showOlder}
                className={`rounded-full border px-2.5 py-0.5 font-medium transition-colors cursor-pointer ${
                  showOlder
                    ? "border-primary bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t(L.showOlder, locale)} · {olderCount}
              </button>
            )}
          </div>
        )}

        <div className="overflow-x-auto [scrollbar-width:thin]">
          <table className="w-full min-w-[560px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b bg-muted/40 text-xs font-semibold text-muted-foreground">
                <th scope="col" className="py-2.5 pl-4 pr-3">{t(L.colName, locale)}</th>
                <th scope="col" className="py-2.5 px-3 whitespace-nowrap">{t(L.colCategory, locale)}</th>
                <th scope="col" className="py-2.5 px-3 whitespace-nowrap">{t(L.colSize, locale)}</th>
                <th scope="col" className={`${ACTIONS_CELL} bg-muted/95 md:bg-transparent py-2.5`}>{t(L.colActions, locale)}</th>
              </tr>
            </thead>

            {weeks.map(({ week, rows }, i) => {
              const part = week.scope && week.scope !== weeks[i - 1]?.week.scope
                ? schedule.parts?.[week.scope]
                : undefined;
              const PartIcon = week.scope ? PART_ICON[week.scope] : null;
              const openable = rows.flatMap((r) => (r.kind === "asset" ? [r.asset] : []));
              return (
                <tbody key={anchor(week)} className="divide-y divide-border/40 border-b border-border/60">
                  {part && PartIcon && (
                    <tr className="bg-primary/5">
                      <th scope="colgroup" colSpan={4} className="py-2 pl-4 pr-4 text-left">
                        <div className="flex items-center gap-2 text-xs">
                          <PartIcon className="size-3.5 shrink-0 text-primary" />
                          <span className="font-bold text-primary">{t(part.label, locale)}</span>
                          {part.detail && (
                            <span className="ml-auto shrink-0 font-medium text-muted-foreground">
                              {t(part.detail, locale)}
                            </span>
                          )}
                        </div>
                      </th>
                    </tr>
                  )}
                  <tr id={anchor(week)} className="scroll-mt-36 bg-muted/25">
                    <th scope="colgroup" colSpan={4} className="py-2 pl-4 pr-4 text-left">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex shrink-0 items-center rounded-md border border-primary/30 bg-primary/10 px-2 py-0.5 text-[11px] font-bold tabular-nums text-primary">
                          {t(L.week, locale)} {pad(week.week)}
                        </span>
                        <span className="min-w-0 truncate text-xs font-bold text-foreground">
                          {t(week.title, locale)}
                        </span>
                        {week.upcoming && (
                          <span className="ml-auto shrink-0 text-[10px] font-medium text-muted-foreground">
                            {t(L.upcoming, locale)}
                          </span>
                        )}
                      </div>
                    </th>
                  </tr>
                  {rows.length === 0 ? (
                    <EmptyRow />
                  ) : (
                    rows.map((row) => (
                      <WeekRow
                        key={row.kind === "asset" ? row.asset.id : row.kind === "video" ? row.href : row.title.th}
                        row={row}
                        onOpenAsset={(asset) => onOpen(openable, Math.max(0, openable.indexOf(asset)))}
                        onOpenStack={(items) => onOpen(items, 0)}
                      />
                    ))
                  )}
                </tbody>
              );
            })}

            {termRows.length > 0 && (
              <tbody className="divide-y divide-border/40">
                <tr className="bg-muted/25">
                  <th scope="colgroup" colSpan={4} className="py-2 pl-4 pr-4 text-left">
                    <div className="flex items-center gap-2">
                      <CalendarRange className="size-3.5 shrink-0 text-primary" />
                      <span className="text-xs font-bold text-foreground">{t(L.unweeked, locale)}</span>
                    </div>
                  </th>
                </tr>
                {termRows.map((row) => {
                  const openable = termRows.flatMap((r) => (r.kind === "asset" ? [r.asset] : []));
                  return (
                    <WeekRow
                      key={row.kind === "asset" ? row.asset.id : row.kind === "stack" ? row.title.th : row.href}
                      row={row}
                      onOpenAsset={(asset) => onOpen(openable, Math.max(0, openable.indexOf(asset)))}
                      onOpenStack={(items) => onOpen(items, 0)}
                    />
                  );
                })}
              </tbody>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}

function EmptyRow() {
  const { locale } = useLocale();
  return (
    <tr>
      <td colSpan={4} className="py-2.5 pl-4 pr-3 text-xs text-muted-foreground">
        {t(L.noFiles, locale)}
      </td>
    </tr>
  );
}

function WeekRow({
  row,
  onOpenAsset,
  onOpenStack,
}: {
  row: Row;
  onOpenAsset: (asset: SubjectAsset) => void;
  onOpenStack: (assets: SubjectAsset[]) => void;
}) {
  const { locale } = useLocale();

  if (row.kind === "video") {
    return (
      <tr className="group transition-colors hover:bg-muted/35">
        <td className="py-2.5 pl-4 pr-3">
          <a
            href={row.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 text-left"
          >
            <span aria-hidden className="h-7 w-1 shrink-0 rounded-full bg-red-500/50" />
            <PlayCircle className="size-4 shrink-0 text-red-600 dark:text-red-400" />
            <span className="truncate text-sm font-medium transition-colors group-hover:text-primary">
              {t(L.video, locale)}
            </span>
          </a>
        </td>
        <td className="py-2.5 px-3 whitespace-nowrap">
          <span className="inline-flex items-center gap-1 rounded-full border border-red-500/30 bg-red-500/10 px-2 py-0.5 text-xs font-medium text-red-700 dark:text-red-300">
            <PlayCircle className="size-3" />
            {t(L.videoKind, locale)}
          </span>
        </td>
        <td className="py-2.5 px-3 text-xs text-muted-foreground whitespace-nowrap">OnLearn</td>
        <td className={`${ACTIONS_CELL} py-2.5`}>
          <a
            href={row.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t(L.video, locale)}
            className={ICON_BTN}
          >
            <ExternalLink className="size-3.5" />
          </a>
        </td>
      </tr>
    );
  }

  if (row.kind === "stack") {
    const first = row.assets[0];
    const style = CATEGORY[resolveCategory(first)];
    const StackIcon = style.icon;
    const bytes = row.assets.reduce((sum, a) => sum + (a.sizeBytes ?? 0), 0);
    return (
      <tr className={`${style.shelf} group transition-colors hover:bg-muted/35`}>
        <td className="py-2.5 pl-4 pr-3 max-w-[260px] sm:max-w-[360px] md:max-w-[480px]">
          <button
            type="button"
            onClick={() => onOpenStack(row.assets)}
            className="flex w-full min-w-0 items-center gap-2.5 text-left"
          >
            <span aria-hidden className="shelf-accent h-7 w-1 shrink-0 rounded-full" />
            <Images className="size-4 shrink-0 text-muted-foreground group-hover:text-primary" />
            <span className="truncate text-sm font-medium transition-colors group-hover:text-primary">
              {t(row.title, locale)}
            </span>
          </button>
        </td>
        <td className="py-2.5 px-3 whitespace-nowrap">
          <span className={`${style.shelf} shelf-pill inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium text-primary`}>
            <StackIcon className="size-3" />
            {t(style.label, locale)}
          </span>
        </td>
        <td className="py-2.5 px-3 tabular-nums text-xs text-muted-foreground whitespace-nowrap">
          {[`${row.assets.length} ${t(L.images, locale)}`, bytes ? formatBytes(bytes) : ""].filter(Boolean).join(" · ")}
        </td>
        <td className={`${ACTIONS_CELL} py-2.5`}>
          <button type="button" onClick={() => onOpenStack(row.assets)} aria-label={t(L.preview, locale)} className={ICON_BTN}>
            <Eye className="size-3.5" />
          </button>
        </td>
      </tr>
    );
  }

  const { asset, older } = row;
  const style = CATEGORY[resolveCategory(asset)];
  const Icon = style.icon;
  const title = t(asset.title, locale);
  const label = (
    <>
      <span aria-hidden className="shelf-accent h-7 w-1 shrink-0 rounded-full" />
      <Icon className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
      <span className="truncate text-sm font-medium transition-colors group-hover:text-primary">{title}</span>
    </>
  );

  return (
    <tr
      className={`${style.shelf} group transition-colors hover:bg-muted/35 ${older ? "text-muted-foreground [&_.shelf-accent]:opacity-40" : ""}`}
    >
      <td className="py-2.5 pl-4 pr-3 max-w-[260px] sm:max-w-[360px] md:max-w-[480px]">
        <div className="flex min-w-0 items-center gap-2">
          {asset.fileType === "md" ? (
            <Link href={asset.url} title={t(asset.description, locale)} className="flex min-w-0 items-center gap-2.5">
              {label}
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => onOpenAsset(asset)}
              title={t(asset.description, locale)}
              className="flex min-w-0 items-center gap-2.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            >
              {label}
            </button>
          )}
          {older && <StatusBadges asset={asset} hideCurrentYear className="shrink-0" />}
        </div>
      </td>
      <td className="py-2.5 px-3 whitespace-nowrap">
        <span className={`${style.shelf} shelf-pill inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium text-primary`}>
          <Icon className="size-3" />
          {t(style.label, locale)}
        </span>
      </td>
      <td className="py-2.5 px-3 tabular-nums text-xs text-muted-foreground whitespace-nowrap">
        {asset.pages || asset.sizeBytes ? metaLine(asset, locale) : "—"}
      </td>
      <td className={`${ACTIONS_CELL} py-2.5`}>
        <div className="flex items-center justify-end gap-0.5">
          {asset.fileType === "md" ? (
            <Link href={asset.url} aria-label={t(L.viewContent, locale)} className={ICON_BTN}>
              <Eye className="size-3.5" />
            </Link>
          ) : (
            <>
              <button type="button" onClick={() => onOpenAsset(asset)} aria-label={t(L.preview, locale)} className={ICON_BTN}>
                <Eye className="size-3.5" />
              </button>
              <a
                href={assetDownloadUrl(asset.url, asset.fileName)}
                download={asset.fileName}
                aria-label={`${t(L.download, locale)}: ${asset.fileName}`}
                className={ICON_BTN}
              >
                <Download className="size-3.5" />
              </a>
            </>
          )}
          <SourceLink asset={asset} />
        </div>
      </td>
    </tr>
  );
}
