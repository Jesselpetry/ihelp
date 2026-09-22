"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BrainCircuit,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  Table2,
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
import { MdView } from "@/components/md-view";
import { ModuleIndex, ScopeTag } from "@/components/module-index";
import { TocSidePanel } from "@/components/toc-side-panel";
import { extractToc } from "@/lib/docs/toc";
import { useOpenedDocs } from "@/lib/docs/reading-progress";
import { useLocale, t, type LText } from "@/lib/i18n";
import { PreviewModal, type Preview } from "@/components/preview-modal";
import type { SubjectAsset } from "@/lib/library/subject-library-ui";
import { splitTitle } from "@/lib/docs/doc-index";

/** One document, already read on the server. */
export interface ReaderDoc {
  slug: string;
  title: LText;
  markdown: string;
  chapter?: number;
  scope?: "midterm" | "final";
}

interface ModuleReaderProps {
  docs: ReaderDoc[];
  backHref: string;
  backLabel: LText;
  /**
   * Where the reader points once the last document is finished.
   *
   * Named deliberately: the old reader's only forward control was a quiz link
   * that fell back to the course hub, so on ten of fifteen courses "continue"
   * meant "go back to where you came from".
   */
  nextHref?: string;
  nextLabel?: LText;
  assets?: SubjectAsset[];
  courseCode?: string;
  /** The module's own heading, shown on the index rather than above the prose. */
  title?: LText;
  subtitle?: LText;
  /**
   * Namespace for "which of these have I opened", e.g. "ICS/map". Absent =
   * nothing is remembered, which is what a one-document module wants.
   */
  moduleKey?: string;
}

/**
 * Above this many documents, the module opens on its index instead of on its
 * first document.
 *
 * Three or fewer is a chip row you can read in one glance — the crash summary
 * beside the study plan, the notes beside the practice paper — and an index in
 * front of them would be a menu with nothing to choose between. Eight is a
 * syllabus, and pushing the first of eight into the reader's hands is how the
 * session map came to open on a wall of every week at once.
 */
const INDEX_MIN_DOCS = 4;

/** The query key that names the open document, so a session can be linked to. */
const DOC_PARAM = "doc";

const L = {
  docs: { th: "เอกสารในโมดูลนี้", en: "Documents in this module" },
  index: { th: "ดูตารางรวม", en: "Table view" },
  backToIndex: { th: "กลับไปหน้ารวมตาราง", en: "Back to table view" },
  prev: { th: "ก่อนหน้า", en: "Previous" },
  next: { th: "ถัดไป", en: "Next" },
  defaultNext: { th: "ทำแบบทดสอบ", en: "Take the quiz" },
  allSessions: { th: "บทเรียนทั้งหมด", en: "All Sessions" },
} satisfies Record<string, LText>;

function compactTitle(doc: ReaderDoc, locale: "th" | "en"): string {
  const full = t(doc.title, locale);
  const { eyebrow } = splitTitle(full);
  if (eyebrow) return eyebrow;
  if (doc.chapter !== undefined) return locale === "th" ? `บทที่ ${doc.chapter}` : `Ch. ${doc.chapter}`;
  if (doc.slug.includes("overview") || doc.slug.includes("materials")) {
    return locale === "th" ? "ภาพรวม" : "Overview";
  }
  return full.length > 22 ? `${full.slice(0, 20)}…` : full;
}

/**
 * Reads one module's documents, with a live outline panel.
 *
 * Multi-document because a module is a shelf, not a file: MFIT's study notes
 * are the seven midterm weeks plus eight final weeks, and its cram module is a
 * crash summary beside a study plan. Splitting those across separate routes is
 * what produced six near-identical page files that all rendered this component
 * with one different loader each.
 *
 * A shelf deep enough to need choosing gets an index in front of it
 * (components/module-index.tsx); the reader below is unchanged once a document
 * is open.
 */
export function ModuleReader({
  docs,
  backHref,
  backLabel,
  nextHref,
  nextLabel = L.defaultNext,
  assets,
  courseCode,
  title,
  subtitle,
  moduleKey,
}: ModuleReaderProps) {
  const { locale } = useLocale();
  const [isTocCollapsed, setIsTocCollapsed] = useState(false);
  const [preview, setPreview] = useState<Preview | null>(null);
  const activePillRef = useRef<HTMLButtonElement | null>(null);
  const { opened, markOpened } = useOpenedDocs(moduleKey);

  const hasIndex = docs.length >= INDEX_MIN_DOCS;

  /** The open document's position, or null while the index is showing. */
  const [index, setIndex] = useState<number | null>(hasIndex ? null : 0);

  useEffect(() => {
    if (activePillRef.current) {
      activePillRef.current.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [index]);

  const active = index === null ? null : docs[Math.min(index, docs.length - 1)];
  const tocItems = useMemo(() => extractToc(active?.markdown ?? ""), [active?.markdown]);

  /**
   * Which document the current URL names, or null for the index.
   *
   * Read from `window` inside an effect rather than through useSearchParams:
   * these routes are statically prerendered, and a hook that reads the query
   * during render would bail the whole reader out of that prerender to answer
   * a question that only matters after a click.
   */
  const fromUrl = useCallback(() => {
    if (typeof window === "undefined") return null;
    const slug = new URLSearchParams(window.location.search).get(DOC_PARAM);
    if (!slug) return null;
    const at = docs.findIndex((doc) => doc.slug === slug);
    return at === -1 ? null : at;
  }, [docs]);

  useEffect(() => {
    // Both the first paint of a shared ?doc= link and the Back button out of a
    // document land here, so the view always agrees with the address bar.
    const sync = () => setIndex(fromUrl() ?? (hasIndex ? null : 0));
    sync();
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, [fromUrl, hasIndex]);

  useEffect(() => {
    if (active) markOpened(active.slug);
  }, [active, markOpened]);

  /**
   * Moves to a document, or back to the index when given null.
   *
   * pushState rather than router.push: the destination is the same route with
   * a different query, so re-running the server render would fetch the same
   * payload to swap one client-side state. A history entry is still pushed, so
   * Back goes to the index rather than off the page — which is the whole point
   * of having an index.
   */
  function goTo(next: number | null) {
    setIndex(next);
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (next === null) params.delete(DOC_PARAM);
      else params.set(DOC_PARAM, docs[next].slug);
      const query = params.toString();
      window.history.pushState(null, "", query ? `?${query}` : window.location.pathname);
    }
    // A new document starts at its own top, not at the previous one's offset.
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  if (docs.length === 0) return null;

  const isLast = index !== null && index === docs.length - 1;

  return (
    <>
      <main className="mx-auto max-w-6xl xl:max-w-7xl px-3 sm:px-6 py-5 sm:py-8 w-full">
      <div className="mb-4 sm:mb-6 flex items-center justify-between gap-2 sm:gap-3 text-xs sm:text-sm">
        <Link
          href={backHref}
          className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors font-medium min-w-0"
        >
          <ArrowLeft className="size-3.5 sm:size-4 shrink-0" />
          <span className="truncate">{t(backLabel, locale)}</span>
        </Link>
        {nextHref && (
          <Button asChild size="sm" variant="outline" className="gap-1.5 rounded-full shadow-xs shrink-0 text-xs sm:text-sm">
            <Link href={nextHref}>
              <BrainCircuit className="size-3.5 text-primary shrink-0" />
              <span>{t(nextLabel, locale)}</span>
            </Link>
          </Button>
        )}
      </div>

      {active === null ? (
        <ModuleIndex
          docs={docs}
          title={title}
          subtitle={subtitle}
          opened={opened}
          onOpen={(at) => goTo(at)}
        />
      ) : (
        <>
          {docs.length > 1 && (
            <nav aria-label={t(L.docs, locale)} className="mb-5">
              <div className="rounded-2xl border bg-card/85 p-2 sm:p-2.5 shadow-xs backdrop-blur-md">
                {/* Row 1: Session Selector, Table View button & Quick Stepper */}
                <div className="flex items-center justify-between gap-1.5 sm:gap-2">
                  {hasIndex && (
                    <button
                      type="button"
                      onClick={() => goTo(null)}
                      aria-label={t(L.index, locale)}
                      title={t(L.backToIndex, locale)}
                      className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl border bg-background/90 px-2 sm:px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:bg-muted/50 hover:text-foreground cursor-pointer shadow-2xs h-8 sm:h-9"
                    >
                      <Table2 className="size-3.5 text-primary" />
                      <span className="hidden sm:inline">{t(L.index, locale)}</span>
                    </button>
                  )}

                  {/* Dropdown showing current session name with full list */}
                  <div className="min-w-0 flex-1">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          type="button"
                          className="flex w-full min-w-0 items-center justify-between gap-1.5 sm:gap-2 rounded-xl border bg-background/90 px-2.5 sm:px-3 py-1.5 text-left text-xs sm:text-sm font-semibold transition-colors hover:border-primary/40 hover:bg-muted/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 shadow-2xs cursor-pointer h-8 sm:h-9"
                        >
                          <div className="flex min-w-0 items-center gap-1.5 sm:gap-2">
                            <span className="shrink-0 font-mono text-[11px] sm:text-xs font-bold text-primary">
                              {index !== null ? `${index + 1}/${docs.length}` : ""}
                            </span>
                            <span className="truncate">
                              {active ? t(active.title, locale) : ""}
                            </span>
                            {active?.scope && (
                              <span className="hidden md:inline-flex shrink-0">
                                <ScopeTag scope={active.scope} />
                              </span>
                            )}
                          </div>
                          <ChevronDown className="size-3.5 sm:size-4 shrink-0 text-muted-foreground ml-1" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="start"
                        className="w-[calc(100vw-1.5rem)] max-w-sm sm:max-w-md max-h-[70vh] sm:max-h-[380px] overflow-y-auto p-1.5 rounded-xl shadow-xl"
                      >
                        <DropdownMenuLabel className="text-[11px] font-semibold text-muted-foreground px-2 py-1.5">
                          {t(L.allSessions, locale)} ({docs.length})
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {docs.map((doc, i) => {
                          const isCurrent = i === index;
                          const isOpened = opened.has(doc.slug);
                          return (
                            <DropdownMenuItem
                              key={doc.slug}
                              onClick={() => goTo(i)}
                              className={`flex items-center justify-between gap-2 px-2.5 py-2 sm:py-2.5 rounded-lg cursor-pointer text-xs ${
                                isCurrent
                                  ? "bg-primary/10 text-primary font-semibold"
                                  : "hover:bg-muted text-foreground"
                              }`}
                            >
                              <div className="flex min-w-0 items-center gap-2">
                                <span
                                  className={`flex size-5 shrink-0 items-center justify-center rounded-full text-[10px] font-mono font-bold ${
                                    isCurrent
                                      ? "bg-primary text-primary-foreground"
                                      : "bg-muted text-muted-foreground"
                                  }`}
                                >
                                  {i + 1}
                                </span>
                                <span className="truncate text-xs sm:text-sm">
                                  {t(doc.title, locale)}
                                </span>
                              </div>
                              <div className="flex shrink-0 items-center gap-1.5">
                                {doc.scope && <ScopeTag scope={doc.scope} />}
                                {isOpened && <Check className="size-3 text-emerald-600 dark:text-emerald-400" />}
                              </div>
                            </DropdownMenuItem>
                          );
                        })}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Quick Stepper (< >) */}
                  <div className="flex shrink-0 items-center gap-1">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      disabled={index === 0}
                      onClick={() => goTo((index ?? 1) - 1)}
                      aria-label={t(L.prev, locale)}
                      title={t(L.prev, locale)}
                      className="size-8 sm:h-9 sm:w-9 rounded-xl p-0 shadow-2xs"
                    >
                      <ChevronLeft className="size-4" />
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      disabled={index === docs.length - 1}
                      onClick={() => goTo((index ?? 0) + 1)}
                      aria-label={t(L.next, locale)}
                      title={t(L.next, locale)}
                      className="size-8 sm:h-9 sm:w-9 rounded-xl p-0 shadow-2xs"
                    >
                      <ChevronRight className="size-4" />
                    </Button>
                  </div>
                </div>

                {/* Row 2: Single-line Compact Horizontal Pill Rail */}
                <div className="mt-2 flex items-center gap-1.5 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pt-1.5 border-t border-border/40 touch-pan-x overscroll-x-contain scroll-smooth px-0.5">
                  {docs.map((doc, i) => {
                    const activeDoc = i === index;
                    const isOpened = opened.has(doc.slug);
                    const label = compactTitle(doc, locale);
                    return (
                      <button
                        key={doc.slug}
                        ref={activeDoc ? activePillRef : null}
                        type="button"
                        onClick={() => goTo(i)}
                        title={t(doc.title, locale)}
                        aria-current={activeDoc ? "true" : undefined}
                        className={`inline-flex shrink-0 items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer active:scale-95 transition-transform ${
                          activeDoc
                            ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                            : "bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground"
                        }`}
                      >
                        <span>{label}</span>
                        {!activeDoc && isOpened && (
                          <Check className="size-2.5 text-emerald-600 dark:text-emerald-400 opacity-80" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </nav>
          )}

          <div
            className={`grid grid-cols-1 ${
              isTocCollapsed
                ? "lg:grid-cols-[56px_1fr]"
                : "lg:grid-cols-[290px_1fr] xl:grid-cols-[330px_1fr]"
            } gap-6 xl:gap-8 items-start transition-all duration-300`}
          >
            <TocSidePanel
              items={tocItems}
              isCollapsed={isTocCollapsed}
              onToggleCollapse={() => setIsTocCollapsed(!isTocCollapsed)}
            />

            <div className="min-w-0 space-y-4">
              <article className="min-w-0 overflow-hidden rounded-3xl border bg-card p-4 sm:p-7 xl:p-8 shadow-sm">
                <div className="min-w-0">
                  <MdView
                    markdown={active.markdown}
                    assets={assets}
                    courseCode={courseCode}
                    onOpenPreview={(asset) => setPreview({ items: [asset], index: 0 })}
                  />
                </div>
              </article>

              {(docs.length > 1 || nextHref) && (
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3 pt-6 border-t">
                  {hasIndex ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1.5 rounded-full justify-center text-xs sm:text-sm"
                      onClick={() => goTo(null)}
                    >
                      <LayoutGrid className="size-3.5" />
                      {t(L.backToIndex, locale)}
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1.5 rounded-full justify-center text-xs sm:text-sm"
                      disabled={index === 0}
                      onClick={() => goTo((index ?? 0) - 1)}
                    >
                      <ArrowLeft className="size-3.5" />
                      {t(L.prev, locale)}
                    </Button>
                  )}

                  {isLast ? (
                    nextHref && (
                      <Button asChild size="sm" className="gap-1.5 rounded-full justify-center text-xs sm:text-sm">
                        <Link href={nextHref}>
                          <span className="truncate">{t(nextLabel, locale)}</span>
                          <ArrowRight className="size-3.5 shrink-0" />
                        </Link>
                      </Button>
                    )
                  ) : (
                    <Button
                      size="sm"
                      className="gap-1.5 rounded-full justify-center text-xs sm:text-sm max-w-full"
                      onClick={() => goTo((index ?? 0) + 1)}
                    >
                      <span className="truncate">{t(docs[(index ?? 0) + 1].title, locale)}</span>
                      <ArrowRight className="size-3.5 shrink-0" />
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </main>

    {preview && (
      <PreviewModal
        preview={preview}
        courseCode={courseCode}
        onIndexChange={(index) => setPreview({ ...preview, index })}
        onClose={() => setPreview(null)}
      />
    )}
  </>
);
}
