"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, BrainCircuit, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MdView } from "@/components/md-view";
import { ModuleIndex, ScopeTag } from "@/components/module-index";
import { TocSidePanel } from "@/components/toc-side-panel";
import { extractToc } from "@/lib/toc";
import { useOpenedDocs } from "@/lib/reading-progress";
import { useLocale, t, type LText } from "@/lib/i18n";
import { PreviewModal, type Preview } from "@/components/preview-modal";
import type { SubjectAsset } from "@/lib/subject-library-ui";

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
  index: { th: "ดูทั้งหมด", en: "All documents" },
  backToIndex: { th: "กลับไปหน้ารวม", en: "Back to the index" },
  prev: { th: "ก่อนหน้า", en: "Previous" },
  next: { th: "ถัดไป", en: "Next" },
  defaultNext: { th: "ทำแบบทดสอบ", en: "Take the quiz" },
} satisfies Record<string, LText>;

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
  const { opened, markOpened } = useOpenedDocs(moduleKey);

  const hasIndex = docs.length >= INDEX_MIN_DOCS;

  /** The open document's position, or null while the index is showing. */
  const [index, setIndex] = useState<number | null>(hasIndex ? null : 0);

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
      <div className="mb-4 sm:mb-6 flex items-center justify-between gap-3 text-xs sm:text-sm">
        <Link
          href={backHref}
          className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors font-medium"
        >
          <ArrowLeft className="size-3.5 sm:size-4" />
          {t(backLabel, locale)}
        </Link>
        {nextHref && (
          <Button asChild size="sm" variant="outline" className="gap-1.5 rounded-full shadow-xs">
            <Link href={nextHref}>
              <BrainCircuit className="size-3.5 text-primary" />
              {t(nextLabel, locale)}
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
            <nav aria-label={t(L.docs, locale)} className="mb-4">
              <div className="flex flex-wrap gap-1.5">
                {hasIndex && (
                  <button
                    type="button"
                    onClick={() => goTo(null)}
                    className="inline-flex items-center gap-1.5 rounded-full border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
                  >
                    <LayoutGrid className="size-3" />
                    {t(L.index, locale)}
                  </button>
                )}
                {docs.map((doc, i) => {
                  const activeDoc = i === index;
                  return (
                    <button
                      key={doc.slug}
                      type="button"
                      onClick={() => goTo(i)}
                      aria-current={activeDoc ? "true" : undefined}
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                        activeDoc
                          ? "border-transparent bg-primary text-primary-foreground shadow-xs"
                          : "bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground"
                      }`}
                    >
                      {t(doc.title, locale)}
                      {!activeDoc && doc.scope && <ScopeTag scope={doc.scope} />}
                    </button>
                  );
                })}
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
                <div className="prose prose-xs sm:prose-sm dark:prose-invert max-w-none">
                  <MdView
                    markdown={active.markdown}
                    assets={assets}
                    courseCode={courseCode}
                    onOpenPreview={(asset) => setPreview({ items: [asset], index: 0 })}
                  />
                </div>
              </article>

              {(docs.length > 1 || nextHref) && (
                <div className="flex items-center justify-between gap-3">
                  {hasIndex ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1.5 rounded-full"
                      onClick={() => goTo(null)}
                    >
                      <LayoutGrid className="size-3.5" />
                      {t(L.backToIndex, locale)}
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1.5 rounded-full"
                      disabled={index === 0}
                      onClick={() => goTo((index ?? 0) - 1)}
                    >
                      <ArrowLeft className="size-3.5" />
                      {t(L.prev, locale)}
                    </Button>
                  )}

                  {isLast ? (
                    nextHref && (
                      <Button asChild size="sm" className="gap-1.5 rounded-full">
                        <Link href={nextHref}>
                          {t(nextLabel, locale)}
                          <ArrowRight className="size-3.5" />
                        </Link>
                      </Button>
                    )
                  ) : (
                    <Button
                      size="sm"
                      className="gap-1.5 rounded-full"
                      onClick={() => goTo((index ?? 0) + 1)}
                    >
                      {t(docs[(index ?? 0) + 1].title, locale)}
                      <ArrowRight className="size-3.5" />
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
