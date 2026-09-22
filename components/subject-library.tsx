"use client";

import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpDown,
  Check,
  ChevronDown,
  Copy,
  LayoutGrid,
  RotateCcw,
  Rows3,
  Search,
  Table2,
  Tag,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PreviewModal, type Preview } from "@/components/preview-modal";
import { useLocale, t, type LText } from "@/lib/i18n";
import {
  ASSET_GROUPS,
  SCOPE_HEADING,
  SCOPE_LABEL,
  resolveCategory,
  type AssetCategory,
  type SubjectAsset,
} from "@/lib/subject-library-ui";

import { BookCover, ImageTile } from "./subject-library/book-cover";
import { PhotoStack, StackSheet } from "./subject-library/photo-stack";
import { CompactRow, CompactStackRow } from "./subject-library/compact-rows";
import { SubjectLibraryTable } from "./subject-library/library-table";
import { PinnedWeeklyShelf } from "./subject-library/pinned-weekly-shelf";
import {
  CATEGORY,
  L,
  SCOPE_ICON,
  SORT_OPTIONS,
  entryScope,
  sortGalleryEntries,
  type Filter,
  type GalleryEntry,
  type LayoutMode,
  type ScopeBucket,
  type ScopeFilter,
  type SortColumn,
  type SortDirection,
} from "./subject-library/types";

export * from "./subject-library";

export interface SubjectLibraryProps {
  assets: SubjectAsset[];
  backHref: string;
  backLabel: LText;
  title: LText;
  subtitle: LText;
  /** Short course code stamped on each cover, e.g. "MFIT". */
  courseCode?: string;
}

export function SubjectLibrary({
  assets,
  backHref,
  backLabel,
  title,
  subtitle,
  courseCode,
}: SubjectLibraryProps) {
  const { locale } = useLocale();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [scope, setScope] = useState<ScopeFilter>("all");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [activeChapter, setActiveChapter] = useState<number | null>(null);
  const [layout, setLayout] = useState<LayoutMode>("table");
  const [sortCol, setSortCol] = useState<SortColumn>("default");
  const [sortDir, setSortDir] = useState<SortDirection>("asc");
  const [openStacks, setOpenStacks] = useState<ReadonlySet<string>>(new Set());
  const [preview, setPreview] = useState<Preview | null>(null);
  const [hideDuplicates, setHideDuplicates] = useState(courseCode === "ICS");

  // Quick keyboard shortcut: press '/' to focus search
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "/" &&
        !["INPUT", "TEXTAREA"].includes((document.activeElement as HTMLElement)?.tagName)
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const duplicateCount = useMemo(
    () =>
      assets.filter(
        (a) => a.isDuplicate && (!a.groupId || !ASSET_GROUPS[a.groupId]),
      ).length,
    [assets],
  );

  const hasCurrentYear = useMemo(
    () => courseCode === "ICS" || assets.some((a) => a.isCurrentYear),
    [courseCode, assets],
  );

  // Category is derived, so resolve it once per asset rather than on every
  // keystroke through the filter. Filter out duplicates when hideDuplicates is active,
  // but keep grouped duplicates so they can coalesce into a single stack.
  const shelved = useMemo(() => {
    const list = hideDuplicates
      ? assets.filter(
          (asset) =>
            !asset.isDuplicate ||
            Boolean(asset.groupId && ASSET_GROUPS[asset.groupId]),
        )
      : assets;
    return list.map((asset) => ({ asset, category: resolveCategory(asset) }));
  }, [assets, hideDuplicates]);

  const counts = useMemo(() => {
    const tally = {} as Record<AssetCategory, number>;
    for (const { category } of shelved) tally[category] = (tally[category] ?? 0) + 1;
    return tally;
  }, [shelved]);

  // Only the shelves this course actually has, in the fixed order above so two
  // libraries never present the same chips in a different sequence.
  const chips = useMemo(
    () => (Object.keys(CATEGORY) as AssetCategory[]).filter((c) => counts[c]),
    [counts],
  );

  // Counted over the whole library, like the "All" chip, so the numbers on the
  // segmented control do not shift as the other filters move.
  const scopeCounts = useMemo(() => {
    const tally: Record<ScopeBucket, number> = { midterm: 0, final: 0, term: 0 };
    for (const asset of assets) tally[asset.scope ?? "term"] += 1;
    return tally;
  }, [assets]);

  // A course whose material all sits on one side of the midterm has no
  // milestone to choose between, so the control stays out of the way.
  const scoped = scopeCounts.midterm > 0 && scopeCounts.final > 0;

  // Chapters this shelf actually carries.
  const allChapters = useMemo(() => {
    const found = new Set<number>();
    for (const asset of assets) if (asset.chapter !== undefined) found.add(asset.chapter);
    return Array.from(found).sort((a, b) => a - b);
  }, [assets]);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    for (const asset of assets) for (const tag of asset.tags) tags.add(tag);
    return Array.from(tags).sort((a, b) => a.localeCompare(b, locale));
  }, [assets, locale]);

  // Tally frequency of each tag to offer popular quick chips
  const tagCounts = useMemo(() => {
    const tally: Record<string, number> = {};
    for (const asset of assets) {
      for (const tag of asset.tags) {
        tally[tag] = (tally[tag] ?? 0) + 1;
      }
    }
    return tally;
  }, [assets]);

  const popularTags = useMemo(() => {
    return [...allTags]
      .sort((a, b) => (tagCounts[b] ?? 0) - (tagCounts[a] ?? 0))
      .slice(0, 8);
  }, [allTags, tagCounts]);

  const remainingTags = useMemo(() => {
    return allTags.filter((tag) => !popularTags.includes(tag));
  }, [allTags, popularTags]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return shelved
      .filter(({ asset, category }) => {
        // Term-wide material survives either milestone: a Z-table is needed
        // for both papers, so hiding it under one would be wrong.
        if (scope !== "all" && asset.scope && asset.scope !== scope) return false;
        if (filter !== "all" && category !== filter) return false;
        if (activeTag && !asset.tags.includes(activeTag)) return false;
        if (activeChapter !== null && asset.chapter !== activeChapter) return false;
        if (!query) return true;
        const group = asset.groupId ? ASSET_GROUPS[asset.groupId] : undefined;
        return (
          t(asset.title, locale).toLowerCase().includes(query) ||
          t(asset.description, locale).toLowerCase().includes(query) ||
          asset.fileName.toLowerCase().includes(query) ||
          asset.tags.some((tag) => tag.toLowerCase().includes(query)) ||
          (group ? t(group, locale).toLowerCase().includes(query) : false)
        );
      })
      .map(({ asset }) => asset);
  }, [shelved, search, filter, activeTag, activeChapter, scope, locale]);

  const entries = useMemo<GalleryEntry[]>(() => {
    const members = new Map<string, SubjectAsset[]>();
    for (const asset of filtered) {
      if (!asset.groupId || !ASSET_GROUPS[asset.groupId]) continue;
      const list = members.get(asset.groupId);
      if (list) list.push(asset);
      else members.set(asset.groupId, [asset]);
    }

    const emitted = new Set<string>();
    const out: GalleryEntry[] = [];
    for (const asset of filtered) {
      const groupId = asset.groupId;
      const group = groupId ? members.get(groupId) : undefined;
      if (!groupId || !group || group.length < 2) {
        out.push({ kind: "single", key: asset.id, asset });
        continue;
      }
      if (emitted.has(groupId)) continue;
      emitted.add(groupId);
      out.push({
        kind: "stack",
        key: groupId,
        title: ASSET_GROUPS[groupId],
        assets: group,
      });
    }
    return out;
  }, [filtered]);

  const sortedEntries = useMemo(() => {
    return sortGalleryEntries(entries, sortCol, sortDir, locale);
  }, [entries, sortCol, sortDir, locale]);

  const sections = useMemo(() => {
    if (!scoped || scope !== "all") return null;
    const order: ScopeBucket[] = ["midterm", "final", "term"];
    return order
      .map((bucket) => ({
        bucket,
        entries: sortedEntries.filter((entry) => entryScope(entry) === bucket),
      }))
      .filter((section) => section.entries.length > 0);
  }, [sortedEntries, scope, scoped]);

  const openSingle = useCallback(
    (asset: SubjectAsset) => setPreview({ items: [asset], index: 0 }),
    [],
  );
  const openIn = useCallback(
    (items: SubjectAsset[], index: number) => setPreview({ items, index }),
    [],
  );
  const toggleStack = useCallback((id: string) => {
    setOpenStacks((current) => {
      const next = new Set(current);
      if (!next.delete(id)) next.add(id);
      return next;
    });
  }, []);

  const clearFilters = () => {
    setSearch("");
    setFilter("all");
    setActiveTag(null);
    setActiveChapter(null);
    setScope("all");
    setSortCol("default");
    setSortDir("asc");
    setHideDuplicates(courseCode === "ICS");
  };

  const filtersActive =
    search !== "" ||
    filter !== "all" ||
    activeTag !== null ||
    activeChapter !== null ||
    scope !== "all" ||
    sortCol !== "default";

  const filtersNarrowed =
    search !== "" || filter !== "all" || activeTag !== null || activeChapter !== null;

  const currentSortLabel = useMemo(() => {
    const match = SORT_OPTIONS.find(
      (opt) => opt.col === sortCol && (opt.col === "default" || opt.dir === sortDir),
    );
    return match ? t(match.label, locale) : t(L.sortDefault, locale);
  }, [sortCol, sortDir, locale]);

  const handleTableSort = (col: SortColumn) => {
    if (sortCol !== col) {
      setSortCol(col);
      setSortDir(col === "size" ? "desc" : "asc");
    } else if (sortDir === "asc") {
      setSortDir("desc");
    } else {
      setSortCol("default");
      setSortDir("asc");
    }
  };

  const renderGrid = (list: GalleryEntry[]) => (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(9.5rem,1fr))] gap-x-4 gap-y-6">
      {list.map((entry, idx) => {
        const itemKey = entry.kind === "single" ? `${entry.key}-${entry.asset.url || idx}` : entry.key;
        if (entry.kind === "single") {
          return entry.asset.fileType === "image" ? (
            <ImageTile
              key={itemKey}
              asset={entry.asset}
              courseCode={courseCode}
              onOpen={openSingle}
            />
          ) : (
            <BookCover
              key={itemKey}
              asset={entry.asset}
              courseCode={courseCode}
              onOpen={openSingle}
            />
          );
        }

        const expanded = openStacks.has(entry.key);
        return (
          <Fragment key={itemKey}>
            <PhotoStack
              title={entry.title}
              assets={entry.assets}
              courseCode={courseCode}
              expanded={expanded}
              onToggle={() => toggleStack(entry.key)}
              onOpen={(index) => openIn(entry.assets, index)}
            />
            {expanded && (
              <StackSheet
                title={entry.title}
                assets={entry.assets}
                onOpen={(index) => openIn(entry.assets, index)}
                onCollapse={() => toggleStack(entry.key)}
              />
            )}
          </Fragment>
        );
      })}
    </div>
  );

  const renderList = (list: GalleryEntry[]) => (
    <div className="overflow-hidden rounded-2xl border bg-card">
      {list.map((entry, idx) => {
        const itemKey = entry.kind === "single" ? `${entry.key}-${entry.asset.url || idx}` : entry.key;
        return entry.kind === "stack" ? (
          <CompactStackRow
            key={itemKey}
            title={entry.title}
            assets={entry.assets}
            courseCode={courseCode}
            onOpen={(index) => openIn(entry.assets, index)}
          />
        ) : (
          <CompactRow
            key={itemKey}
            asset={entry.asset}
            courseCode={courseCode}
            onOpen={openSingle}
          />
        );
      })}
    </div>
  );

  const renderEntries = (list: GalleryEntry[]) => {
    if (layout === "table") {
      return (
        <SubjectLibraryTable
          entries={list}
          courseCode={courseCode}
          sortCol={sortCol}
          sortDir={sortDir}
          onSort={handleTableSort}
          onOpenSingle={openSingle}
          onOpenStack={openIn}
        />
      );
    }
    if (layout === "list") {
      return renderList(list);
    }
    return renderGrid(list);
  };

  return (
    <main className="brand-shelf mx-auto w-full max-w-6xl px-3 py-6 sm:px-6 sm:py-10">
      <Link
        href={backHref}
        className="mb-5 inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-primary sm:text-sm"
      >
        <ArrowLeft className="size-3.5 sm:size-4" />
        {t(backLabel, locale)}
      </Link>

      <header className="mb-6 sm:mb-8">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{t(title, locale)}</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          {t(subtitle, locale)} · {filtered.length}/{assets.length} {t(L.count, locale)}
        </p>
      </header>

      {/* Pinned Current Year Shelf for ICS */}
      {hasCurrentYear && (
        <PinnedWeeklyShelf
          assets={assets}
          onOpen={openSingle}
          courseCode={courseCode}
        />
      )}

      {/* Control Deck */}
      <div className="mb-8 rounded-2xl border bg-card/75 p-3.5 sm:p-5 shadow-xs backdrop-blur-md space-y-3.5">
        {/* Row 1: Command Toolbar (Search + Sort Dropdown + View Switcher) */}
        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
          {/* Search input with Clear and Keyboard Shortcut */}
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              ref={searchInputRef}
              id="library-search"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  if (search) setSearch("");
                  else e.currentTarget.blur();
                }
              }}
              placeholder={t(L.searchPlaceholder, locale)}
              className="w-full rounded-full border bg-background/90 py-2.5 pl-10 pr-20 text-sm shadow-2xs transition-shadow placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
              {search.trim() ? (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    searchInputRef.current?.focus();
                  }}
                  aria-label={t(L.clearSearch, locale)}
                  className="rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                >
                  <X className="size-3.5" />
                </button>
              ) : (
                <kbd className="hidden sm:inline-flex items-center rounded border border-border/80 bg-muted/70 px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground/70 select-none">
                  /
                </kbd>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 self-stretch justify-between sm:self-auto sm:justify-start">
            {/* Sort Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-medium shadow-2xs transition-colors cursor-pointer ${
                    sortCol !== "default"
                      ? "border-primary bg-primary/10 text-primary hover:bg-primary/15"
                      : "bg-background/90 text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                  aria-label={t(L.sortBy, locale)}
                >
                  <ArrowUpDown className="size-3.5 shrink-0" />
                  <span className="hidden sm:inline text-muted-foreground">{t(L.sortBy, locale)}:</span>
                  <span className="font-semibold text-foreground max-w-[130px] truncate">
                    {currentSortLabel}
                  </span>
                  <ChevronDown className="size-3 opacity-60 ml-0.5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 p-1 text-xs">
                <DropdownMenuLabel className="text-[11px] text-muted-foreground font-semibold px-2 py-1">
                  {t(L.sortBy, locale)}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {SORT_OPTIONS.map((opt) => {
                  const isSelected =
                    opt.col === sortCol && (opt.col === "default" || opt.dir === sortDir);
                  return (
                    <DropdownMenuItem
                      key={opt.id}
                      onClick={() => {
                        setSortCol(opt.col);
                        if (opt.dir) setSortDir(opt.dir);
                      }}
                      className="flex items-center justify-between py-1.5 px-2 cursor-pointer text-xs"
                    >
                      <span className={isSelected ? "font-semibold text-primary" : ""}>
                        {t(opt.label, locale)}
                      </span>
                      {isSelected && <Check className="size-3.5 text-primary ml-2 shrink-0" />}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* View Mode Switcher */}
            <div className="flex shrink-0 items-center gap-0.5 rounded-full border bg-background/90 p-1 shadow-2xs">
              {(
                [
                  ["table", Table2, L.table],
                  ["gallery", LayoutGrid, L.gallery],
                  ["list", Rows3, L.list],
                ] as const
              ).map(([mode, Icon, label]) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setLayout(mode)}
                  aria-label={t(label, locale)}
                  aria-pressed={layout === mode}
                  className={`rounded-full p-1.5 transition-colors cursor-pointer ${
                    layout === mode
                      ? "bg-primary text-primary-foreground shadow-2xs"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Icon className="size-3.5" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Row 2: Scope Tabs & Category Shelf Pills */}
        <div className="flex flex-col gap-2.5 lg:flex-row lg:items-center lg:justify-between border-t border-border/40 pt-3">
          {/* Exam Milestone Tabs */}
          {scoped && (
            <div
              role="group"
              aria-label={t(L.examScope, locale)}
              className="inline-flex shrink-0 gap-1 rounded-full border bg-muted/40 p-1 self-start"
            >
              {(["all", "midterm", "final"] as const).map((option) => {
                const active = scope === option;
                const Icon = option === "all" ? null : SCOPE_ICON[option];
                const label =
                  option === "all" ? t(L.scopeAll, locale) : t(SCOPE_LABEL[option], locale);
                const total =
                  option === "all"
                    ? assets.length
                    : scopeCounts[option] + scopeCounts.term;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setScope(option)}
                    aria-pressed={active}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                      active
                        ? "bg-background text-foreground shadow-2xs font-bold"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {Icon && <Icon className="size-3.5" />}
                    <span>{label}</span>
                    <span className="tabular-nums text-[10px] opacity-70">({total})</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Category Chips */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setFilter("all")}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors cursor-pointer ${
                filter === "all"
                  ? "border-primary bg-primary text-primary-foreground shadow-2xs"
                  : "bg-background/80 text-muted-foreground hover:border-primary/40 hover:text-foreground"
              }`}
            >
              {t(L.filterAll, locale)} · {shelved.length}
            </button>
            {chips.map((category) => {
              const style = CATEGORY[category];
              const Icon = style.icon;
              const active = filter === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setFilter(active ? "all" : category)}
                  className={`${style.shelf} inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer ${
                    active
                      ? "border-primary bg-primary text-primary-foreground shadow-2xs"
                      : "shelf-pill text-primary hover:brightness-95"
                  }`}
                >
                  <Icon className="size-3" />
                  <span>{t(style.label, locale)}</span>
                  <span className="text-[10px] opacity-80 tabular-nums">· {counts[category]}</span>
                </button>
              );
            })}

            {/* Duplicate Filter Toggle */}
            {duplicateCount > 0 && (
              <button
                type="button"
                onClick={() => setHideDuplicates(!hideDuplicates)}
                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer ${
                  hideDuplicates
                    ? "border-amber-500/35 bg-amber-500/10 text-amber-700 dark:text-amber-300 hover:bg-amber-500/20"
                    : "border-border/80 bg-background/80 text-muted-foreground hover:text-foreground"
                }`}
                title={
                  hideDuplicates
                    ? "คลิกเพื่อแสดงเอกสารสำรอง/v2 ทั้งหมด"
                    : "คลิกเพื่อซ่อนเอกสารสำรอง/v2"
                }
              >
                <Copy className="size-3 shrink-0" />
                <span>
                  {hideDuplicates
                    ? locale === "th"
                      ? `ซ่อนฉบับสำรอง (${duplicateCount})`
                      : `Hide duplicates (${duplicateCount})`
                    : locale === "th"
                      ? `แสดงฉบับสำรอง (${duplicateCount})`
                      : `Showing duplicates (${duplicateCount})`}
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Row 3: Chapters & Topics / Tags */}
        {(allChapters.length > 1 || allTags.length > 0) && (
          <div className="space-y-2 border-t border-border/40 pt-3 text-xs">
            {/* Chapter Row */}
            {allChapters.length > 1 && (
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none]">
                <span className="shrink-0 text-xs font-medium text-muted-foreground mr-1">
                  {t(L.chapters, locale)}:
                </span>
                <button
                  type="button"
                  onClick={() => setActiveChapter(null)}
                  className={`shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors cursor-pointer ${
                    activeChapter === null
                      ? "border-primary bg-primary text-primary-foreground shadow-2xs"
                      : "bg-background/80 text-muted-foreground hover:border-primary/40 hover:text-foreground"
                  }`}
                >
                  {t(L.allChapters, locale)}
                </button>
                {allChapters.map((chapter) => (
                  <button
                    key={chapter}
                    type="button"
                    onClick={() =>
                      setActiveChapter(activeChapter === chapter ? null : chapter)
                    }
                    className={`shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-medium tabular-nums transition-colors cursor-pointer ${
                      activeChapter === chapter
                        ? "border-primary bg-primary text-primary-foreground shadow-2xs"
                        : "bg-background/80 text-muted-foreground hover:border-primary/40 hover:text-foreground"
                    }`}
                  >
                    {locale === "th" ? `บท ${chapter}` : `Ch. ${chapter}`}
                  </button>
                ))}
              </div>
            )}

            {/* Topics Row */}
            {allTags.length > 0 && (
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none]">
                <span className="shrink-0 text-xs font-medium text-muted-foreground mr-1">
                  {t(L.topics, locale)}:
                </span>
                {/* Active tag if not in popularTags */}
                {activeTag && !popularTags.includes(activeTag) && (
                  <button
                    type="button"
                    onClick={() => setActiveTag(null)}
                    className="shrink-0 inline-flex items-center gap-1 rounded-full border border-primary bg-primary text-primary-foreground px-2.5 py-0.5 text-xs font-medium shadow-2xs cursor-pointer"
                  >
                    <span>{activeTag}</span>
                    <X className="size-2.5" />
                  </button>
                )}
                {/* Popular Tags */}
                {popularTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                    className={`shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors cursor-pointer ${
                      activeTag === tag
                        ? "border-primary bg-primary text-primary-foreground shadow-2xs"
                        : "bg-background/80 text-muted-foreground hover:border-primary/40 hover:text-foreground"
                    }`}
                  >
                    {tag}
                    <span className="ml-1 text-[10px] opacity-60 tabular-nums">
                      {tagCounts[tag]}
                    </span>
                  </button>
                ))}
                {/* All remaining tags in a Dropdown */}
                {remainingTags.length > 0 && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        type="button"
                        className="shrink-0 inline-flex items-center gap-1 rounded-full border bg-background/80 px-2.5 py-0.5 text-xs font-medium text-muted-foreground hover:border-primary/40 hover:text-foreground transition-colors cursor-pointer"
                      >
                        <Tag className="size-3 opacity-60" />
                        <span>+{remainingTags.length} {t(L.moreTopics, locale)}</span>
                        <ChevronDown className="size-2.5 opacity-60" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-56 max-h-72 overflow-y-auto p-1 text-xs">
                      <DropdownMenuLabel className="text-[11px] text-muted-foreground px-2 py-1">
                        {t(L.allTopics, locale)} ({allTags.length})
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {activeTag && (
                        <>
                          <DropdownMenuItem
                            onClick={() => setActiveTag(null)}
                            className="flex items-center justify-between text-destructive cursor-pointer"
                          >
                            <span>{t(L.clear, locale)} ({activeTag})</span>
                            <X className="size-3" />
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                        </>
                      )}
                      {allTags.map((tag) => {
                        const isSelected = activeTag === tag;
                        return (
                          <DropdownMenuItem
                            key={tag}
                            onClick={() => setActiveTag(isSelected ? null : tag)}
                            className="flex items-center justify-between py-1.5 px-2 cursor-pointer"
                          >
                            <span className={isSelected ? "font-semibold text-primary" : ""}>
                              {tag}
                            </span>
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] text-muted-foreground tabular-nums">
                                {tagCounts[tag]}
                              </span>
                              {isSelected && <Check className="size-3 text-primary shrink-0" />}
                            </div>
                          </DropdownMenuItem>
                        );
                      })}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            )}
          </div>
        )}

        {/* Row 4: Active Filters Bar & Match Summary (conditional) */}
        {filtersActive && (
          <div className="flex flex-wrap items-center gap-1.5 border-t border-border/50 pt-2.5 text-xs animate-in fade-in-0 duration-200">
            <span className="text-[11px] font-medium text-muted-foreground mr-1">
              {t(L.activeFilters, locale)}:
            </span>
            {search.trim() && (
              <span className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                {t(L.filterQuery, locale)}: &ldquo;{search.trim()}&rdquo;
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="rounded-full p-0.5 hover:bg-primary/20 cursor-pointer"
                >
                  <X className="size-2.5" />
                </button>
              </span>
            )}
            {scope !== "all" && (
              <span className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                {t(L.filterScope, locale)}: {t(SCOPE_LABEL[scope], locale)}
                <button
                  type="button"
                  onClick={() => setScope("all")}
                  className="rounded-full p-0.5 hover:bg-primary/20 cursor-pointer"
                >
                  <X className="size-2.5" />
                </button>
              </span>
            )}
            {filter !== "all" && (
              <span className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                {t(L.filterCat, locale)}: {t(CATEGORY[filter].label, locale)}
                <button
                  type="button"
                  onClick={() => setFilter("all")}
                  className="rounded-full p-0.5 hover:bg-primary/20 cursor-pointer"
                >
                  <X className="size-2.5" />
                </button>
              </span>
            )}
            {activeChapter !== null && (
              <span className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                {t(L.filterCh, locale)} {activeChapter}
                <button
                  type="button"
                  onClick={() => setActiveChapter(null)}
                  className="rounded-full p-0.5 hover:bg-primary/20 cursor-pointer"
                >
                  <X className="size-2.5" />
                </button>
              </span>
            )}
            {activeTag !== null && (
              <span className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                {t(L.filterTag, locale)}: {activeTag}
                <button
                  type="button"
                  onClick={() => setActiveTag(null)}
                  className="rounded-full p-0.5 hover:bg-primary/20 cursor-pointer"
                >
                  <X className="size-2.5" />
                </button>
              </span>
            )}
            {sortCol !== "default" && (
              <span className="inline-flex items-center gap-1 rounded-full border bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                {t(L.sortBy, locale)}: {currentSortLabel}
                <button
                  type="button"
                  onClick={() => {
                    setSortCol("default");
                    setSortDir("asc");
                  }}
                  className="rounded-full p-0.5 hover:bg-muted-foreground/20 cursor-pointer"
                >
                  <X className="size-2.5" />
                </button>
              </span>
            )}
            {hideDuplicates && duplicateCount > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/35 bg-amber-500/10 px-2 py-0.5 text-[11px] font-medium text-amber-700 dark:text-amber-300">
                {locale === "th"
                  ? `ซ่อนฉบับสำรอง: ${duplicateCount}`
                  : `Hidden duplicates: ${duplicateCount}`}
                <button
                  type="button"
                  onClick={() => setHideDuplicates(false)}
                  className="rounded-full p-0.5 hover:bg-amber-500/20 cursor-pointer"
                  title={locale === "th" ? "แสดงฉบับสำรอง" : "Show duplicates"}
                >
                  <X className="size-2.5" />
                </button>
              </span>
            )}
            <button
              type="button"
              onClick={clearFilters}
              className="ml-auto inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline cursor-pointer"
            >
              <RotateCcw className="size-3" />
              {t(L.clearAll, locale)}
            </button>
          </div>
        )}
      </div>

      {/* Results */}
      {entries.length === 0 ? (
        <div className="rounded-2xl border bg-muted/20 py-16 text-center">
          <p className="text-sm text-muted-foreground">
            {t(scope !== "all" && !filtersNarrowed ? L.emptyScope : L.noResults, locale)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">{t(L.noResultsHint, locale)}</p>
          {filtersActive && (
            <Button variant="outline" className="mt-4 rounded-full" onClick={clearFilters}>
              {t(L.clear, locale)}
            </Button>
          )}
        </div>
      ) : sections ? (
        <div className="space-y-9">
          {sections.map(({ bucket, entries: sectionEntries }) => {
            const Icon = SCOPE_ICON[bucket];
            return (
              <section key={bucket}>
                <header className="mb-3 flex items-center gap-2 border-b pb-2">
                  <Icon className="size-4 shrink-0 text-primary" />
                  <h2 className="text-sm font-bold">
                    {bucket === "term"
                      ? t(L.termWide, locale)
                      : t(SCOPE_HEADING[bucket], locale)}
                  </h2>
                  <span className="text-xs tabular-nums text-muted-foreground">
                    {sectionEntries.length}
                  </span>
                </header>
                {renderEntries(sectionEntries)}
              </section>
            );
          })}
        </div>
      ) : (
        renderEntries(sortedEntries)
      )}

      {preview && (
        <PreviewModal
          preview={preview}
          courseCode={courseCode}
          onIndexChange={(index) => setPreview({ ...preview, index })}
          onClose={() => setPreview(null)}
        />
      )}
    </main>
  );
}
