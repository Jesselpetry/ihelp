"use client";
/* eslint-disable @typescript-eslint/no-unused-vars */

import { useMemo, useState } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import { SessionMaterialsDeck, type SessionDocumentItem } from "@/components/session-materials";
import type { SubjectAsset } from "@/lib/library/subject-library-ui";
import remarkGfm from "remark-gfm";
import remarkFrontmatter from "remark-frontmatter";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { slugifyHeading } from "@/lib/docs/toc";
import { useLocale, t, type LText } from "@/lib/i18n";

function getNodeText(node: React.ReactNode): string {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(getNodeText).join("");
  if (node && typeof node === "object" && "props" in node) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return getNodeText((node as any).props?.children);
  }
  return "";
}

/**
 * A ```youtube fence renders as a player instead of a code box.
 *
 * There is no other way for a course document to ask for an embed here. This
 * project renders content with react-markdown and no `rehype-raw`, so raw HTML
 * in a Markdown file is dropped, and there is no MDX pipeline to fall back on.
 * A fence keeps the door shut on arbitrary HTML in content while still letting
 * a week page carry its lecture and lab videos: the only thing a document can
 * express is "play these ids", and every id is validated before it reaches an
 * iframe src.
 *
 * Syntax — one video per line, `videoId | label`:
 *
 *     ```youtube
 *     3NvqarEC1fg | บรรยาย — Computer System
 *     putCB8g1e0U | Lab 1.1 — ตัดและบัดกรีสาย
 *     ```
 *
 * extractToc() already skips fenced blocks, so these never reach the outline.
 */
interface Video {
  id: string;
  label: string;
}

const L_VIDEO = {
  pick: { th: "เลือกวิดีโอ", en: "Choose a video" },
  openOn: { th: "เปิดใน YouTube", en: "Watch on YouTube" },
} satisfies Record<string, LText>;

function parseVideos(source: string): Video[] {
  const videos: Video[] = [];
  for (const line of source.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const [rawId, ...rest] = trimmed.split("|");
    const id = rawId.trim();
    // A YouTube id is exactly 11 characters of [A-Za-z0-9_-]. Anything else is
    // skipped rather than interpolated: content here is authored, not user
    // input, but an id is the one part of it that ends up inside a URL.
    if (!/^[A-Za-z0-9_-]{11}$/.test(id)) continue;
    videos.push({ id, label: rest.join("|").trim() || id });
  }
  return videos;
}

function YouTubeBlock({ videos }: { videos: Video[] }) {
  const { locale } = useLocale();
  const [index, setIndex] = useState(0);
  const active = videos[Math.min(index, videos.length - 1)];

  return (
    <figure className="my-5">
      {videos.length > 1 && (
        <nav
          aria-label={t(L_VIDEO.pick, locale)}
          className="mb-2 flex flex-wrap gap-1.5"
        >
          {videos.map((video, i) => (
            <button
              key={video.id}
              type="button"
              onClick={() => setIndex(i)}
              aria-current={i === index ? "true" : undefined}
              className={
                i === index
                  ? "rounded-full border border-primary bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                  : "rounded-full border px-3 py-1 text-xs text-muted-foreground hover:bg-muted"
              }
            >
              {video.label}
            </button>
          ))}
        </nav>
      )}

      {/*
       * The wrapper owns the 16:9 box and the iframe fills it absolutely, so
       * the player keeps its shape from a 400px phone up to the reader's full
       * width without the iframe's own default 300x150 showing through.
       */}
      <div className="relative w-full overflow-hidden rounded-xl border bg-muted">
        <div style={{ paddingTop: "56.25%" }} />
        <iframe
          key={active.id}
          src={`https://www.youtube-nocookie.com/embed/${active.id}`}
          title={active.label}
          aria-label={active.label}
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0"
        />
      </div>

      <figcaption className="mt-2 text-sm text-muted-foreground">
        {active.label}
        {" · "}
        <a
          className="text-primary underline underline-offset-4 hover:opacity-80"
          href={`https://www.youtube.com/watch?v=${active.id}`}
          target="_blank"
          rel="noreferrer"
        >
          {t(L_VIDEO.openOn, locale)}
        </a>
      </figcaption>
    </figure>
  );
}

// Shared clean markdown renderer (library reader + wizard preview).
// Roomy leading, clean tables — all inline component styling since the
// typography plugin is not installed. Headings stay on the app sans
// (IBM Plex Sans Thai); the default serif stack has no Thai glyphs.
const mdComponents: Components = {
  h1: ({ node: _node, ref: _ref, children, ...p }) => {
    const text = getNodeText(children);
    const id = slugifyHeading(text);
    return (
      <h1
        id={id || undefined}
        className="tracking-tight text-2xl sm:text-3xl font-bold mt-1 sm:mt-2 mb-4 sm:mb-6 leading-snug scroll-mt-24 [overflow-wrap:anywhere]"
        {...p}
      >
        {children}
      </h1>
    );
  },
  h2: ({ node: _node, ref: _ref, children, ...p }) => {
    const text = getNodeText(children);
    const id = slugifyHeading(text);
    return (
      <h2
        id={id || undefined}
        className="tracking-tight text-lg sm:text-xl font-bold mt-8 sm:mt-10 mb-2.5 sm:mb-3 pb-1.5 border-b leading-snug scroll-mt-24 [overflow-wrap:anywhere]"
        {...p}
      >
        {children}
      </h2>
    );
  },
  h3: ({ node: _node, ref: _ref, children, ...p }) => {
    const text = getNodeText(children);
    const id = slugifyHeading(text);
    return (
      <h3
        id={id || undefined}
        className="tracking-tight text-base sm:text-lg font-semibold mt-6 sm:mt-7 mb-2 scroll-mt-24 [overflow-wrap:anywhere]"
        {...p}
      >
        {children}
      </h3>
    );
  },

  h4: ({ node: _node, ref: _ref, children, ...p }) => {
    const id = slugifyHeading(getNodeText(children));
    return (
      <h4
        id={id || undefined}
        className="text-sm sm:text-base font-semibold mt-5 sm:mt-6 mb-1.5 text-foreground/90 scroll-mt-24 [overflow-wrap:anywhere]"
        {...p}
      >
        {children}
      </h4>
    );
  },

  p: ({ node: _node, ref: _ref, ...p }) => (
    <p className="my-3 leading-relaxed [overflow-wrap:anywhere]" {...p} />
  ),
  ul: ({ node: _node, ref: _ref, ...p }) => (
    <ul className="my-3 space-y-1.5 list-disc pl-5 sm:pl-6 marker:text-primary/60" {...p} />
  ),
  ol: ({ node: _node, ref: _ref, ...p }) => (
    <ol className="my-3 space-y-1.5 list-decimal pl-5 sm:pl-6 marker:text-primary/60" {...p} />
  ),

  /*
   * Markdown images carry no width of their own, so one screenshot wider than
   * the phone used to push the whole article sideways.
   */
  img: ({ node: _node, ref: _ref, alt, ...p }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt={alt ?? ""}
      loading="lazy"
      className="my-4 h-auto w-auto max-w-full rounded-xl border"
      {...p}
    />
  ),
  li: ({ node: _node, ref: _ref, ...p }) => (
    <li className="leading-relaxed" {...p} />
  ),
  blockquote: ({ node: _node, ref: _ref, ...p }) => (
    <blockquote
      className="my-3.5 sm:my-4 border-l-[3px] border-primary/40 bg-primary/[0.04] pl-3 sm:pl-4 py-1.5 sm:py-2 rounded-r-lg italic [overflow-wrap:anywhere]"
      {...p}
    />
  ),
  hr: () => (
    <div className="my-8 flex items-center justify-center gap-2 text-border select-none">
      <span className="h-px flex-1 bg-border" />
      <span className="text-xs tracking-[0.5em] text-muted-foreground/50">···</span>
      <span className="h-px flex-1 bg-border" />
    </div>
  ),
  a: ({ node: _node, ref: _ref, href, ...p }) => {
    let targetHref = href;
    if (targetHref && (targetHref.startsWith("./oj") || targetHref.startsWith("oj"))) {
      const cleanSlug = targetHref.replace(/^\.\//, "").replace(/\/$/, "");
      targetHref = `/recommended/${cleanSlug}`;
    }

    const isExternal = targetHref?.startsWith("http://") || targetHref?.startsWith("https://");

    return (
      <a
        className="text-primary underline underline-offset-4 hover:opacity-80 [overflow-wrap:anywhere]"
        href={targetHref}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noreferrer" : undefined}
        {...p}
      />
    );
  },
  code: ({ node: _node, ref: _ref, className, ...p }) =>
    className ? (
      // fenced block content: <pre> wrapper handles the box
      <code className={className} {...p} />
    ) : (
      <code
        className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.85em] [overflow-wrap:anywhere]"
        {...p}
      />
    ),
  pre: ({ node: _node, ref: _ref, children, ...p }) => {
    // Caught here rather than in `code` because `code` renders *inside* this
    // <pre>; intercepting there would leave the player boxed in a code frame.
    const child = Array.isArray(children) ? children[0] : children;
    const language =
      child && typeof child === "object" && "props" in child
        ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ((child as any).props?.className as string | undefined)
        : undefined;

    if (language?.includes("language-youtube")) {
      const videos = parseVideos(getNodeText(children));
      // An empty or malformed fence falls through to the code box rather than
      // rendering an empty player — a content bug should be visible, not silent.
      if (videos.length > 0) return <YouTubeBlock videos={videos} />;
    }

    return (
      <pre
        className="my-4 overflow-x-auto overscroll-x-contain [scrollbar-width:thin] rounded-lg border bg-background p-3 sm:p-4 font-mono text-[13px] sm:text-sm leading-relaxed"
        {...p}
      >
        {children}
      </pre>
    );
  },
  table: ({ node: _node, ref: _ref, ...p }) => (
    <div className="my-4 overflow-x-auto overscroll-x-contain [scrollbar-width:thin] rounded-lg border">
      <table className="w-full text-[13px] sm:text-sm border-collapse" {...p} />
    </div>
  ),
  th: ({ node: _node, ref: _ref, ...p }) => (
    <th
      className="border-b bg-muted/60 px-2.5 py-2 sm:px-3 text-left font-semibold min-w-[6.5rem] sm:min-w-0"
      {...p}
    />
  ),
  td: ({ node: _node, ref: _ref, ...p }) => (
    <td className="border-b px-2.5 py-2 sm:px-3 align-top min-w-[6.5rem] sm:min-w-0 [overflow-wrap:anywhere]" {...p} />
  ),
};

/**
 * `$$...$$` -> a valid remark-math fence, one block at a time.
 *
 * remark-math's `$$` is a fence construct, not a pair of inline delimiters:
 * per its grammar, `math_flow ::= fence_open *( eol *line ) [ eol fence_close ]`,
 * where `fence_close` only matches a line that is *nothing but* `$$`. Every
 * study-guide file in this repo writes display math the LaTeX way instead —
 * `$$formula$$`, opening and closing flush against the content, sometimes on
 * one line and sometimes spanning a few. Two failure modes follow from that
 * mismatch:
 *
 *   1. A same-line block (`$$x^2$$`) never closes at all, because
 *      `fence_close` requires a line break before it. It falls through as
 *      literal text — ugly, but contained to that one line.
 *   2. A multi-line block whose opening line carries no second `$` opens a
 *      genuine fence, and then the closing `$$` on a LATER line — which also
 *      has content before it — still doesn't satisfy `fence_close`. The
 *      parser keeps scanning for a bare `$$` line and, finding none, consumes
 *      every line to the end of the file into one giant unrendered math node.
 *      Every heading, list, and paragraph after that point stops being parsed
 *      as markdown at all.
 *
 * Rewriting each pair onto its own lines before the file reaches remark
 * satisfies the fence grammar exactly as the author intended it — display
 * math, on its own block — without touching any of the LaTeX inside `$$...$$`
 * or the inline `$...$` math these same files also use correctly. Verified
 * against content/courses/06016401-Math-for-IT/archive/study-guide-week08-quiz.md,
 * where this was silently eating W08-Q5 through the end of the document.
 */
function normalizeDisplayMath(markdown: string): string {
  return markdown.replace(/\$\$([\s\S]*?)\$\$/g, (_match, body: string) => {
    const trimmed = body.trim();
    return trimmed ? `\n\n$$\n${trimmed}\n$$\n\n` : "$$$$";
  });
}

export interface MdViewProps {
  markdown: string;
  assets?: SubjectAsset[];
  courseCode?: string;
  onOpenPreview?: (asset: SubjectAsset) => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getHastText(node: any): string {
  if (!node) return "";
  if (typeof node === "string") return node;
  if (node.type === "text") return node.value || "";
  if (Array.isArray(node.children)) {
    return node.children.map(getHastText).join("");
  }
  return "";
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseSessionDocTable(node: any, assets?: SubjectAsset[]): SessionDocumentItem[] | null {
  if (!node || node.tagName !== "table") return null;

  // Search for thead and tbody
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const thead = node.children?.find((c: any) => c.type === "element" && c.tagName === "thead");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tbody = node.children?.find((c: any) => c.type === "element" && c.tagName === "tbody");
  if (!thead || !tbody) return null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const headerRow = thead.children?.find((c: any) => c.type === "element" && c.tagName === "tr");
  if (!headerRow) return null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const thCells = (headerRow.children ?? []).filter((c: any) => c.type === "element" && c.tagName === "th");
  const headers = thCells.map(getHastText).map((s: string) => s.trim().toLowerCase());

  const isStatusTable = headers.some(
    (h: string) => h.includes("สถานะ") || h.includes("status") || h.includes("ผลกระทบ"),
  );
  if (isStatusTable) return null;

  const isDocTable =
    headers.some((h: string) => h.includes("ไฟล์ในคลัง") || h.includes("คลัง")) ||
    (headers.some((h: string) => h.includes("เอกสาร") || h.includes("document") || h.includes("title") || h.includes("ชื่อ")) &&
      headers.some((h: string) => h.includes("ไฟล์") || h.includes("file")));

  if (!isDocTable) return null;

  let fileColIdx = headers.findIndex((h: string) => h.includes("ไฟล์") || h.includes("file"));
  let titleColIdx = headers.findIndex((h: string) => h.includes("เอกสาร") || h.includes("document") || h.includes("title") || h.includes("ชื่อ"));
  const pagesColIdx = headers.findIndex((h: string) => h.includes("หน้า") || h.includes("page"));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rows = (tbody.children ?? []).filter((c: any) => c.type === "element" && c.tagName === "tr");
  if (rows.length === 0) return null;

  // If fileColIdx not detected from header, check if cells look like filenames (.pdf, .png, etc.)
  if (fileColIdx === -1) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const firstRowCells = (rows[0].children ?? []).filter((c: any) => c.type === "element" && c.tagName === "td");
    const cellTexts = firstRowCells.map(getHastText);
    const candidateIdx = cellTexts.findIndex((t: string) => /\.(pdf|png|jpg|docx|pptx)$/i.test(t.replace(/[`'"]/g, "").trim()));
    if (candidateIdx !== -1) {
      fileColIdx = candidateIdx;
    }
  }

  if (fileColIdx === -1) return null;
  if (titleColIdx === -1) titleColIdx = 0 === fileColIdx ? 1 : 0;

  const items: SessionDocumentItem[] = [];
  for (const row of rows) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cells = (row.children ?? []).filter((c: any) => c.type === "element" && c.tagName === "td");
    if (!cells[fileColIdx]) continue;

    const rawFileName = getHastText(cells[fileColIdx]).replace(/[`'"]/g, "").trim();
    if (!rawFileName) continue;

    const title = cells[titleColIdx] ? getHastText(cells[titleColIdx]).trim() : rawFileName;
    const pages = pagesColIdx >= 0 && cells[pagesColIdx] ? getHastText(cells[pagesColIdx]).trim() : undefined;

    const cleanName = rawFileName.toLowerCase();
    const baseName = cleanName.replace(/\.[^/.]+$/, "");
    const matchedAsset = assets?.find((a) => {
      const aFile = a.fileName.toLowerCase();
      return aFile === cleanName || aFile === `${cleanName}.pdf` || aFile.replace(/\.[^/.]+$/, "") === baseName;
    });

    items.push({
      title,
      pages,
      fileName: rawFileName,
      matchedAsset,
    });
  }

  return items.length > 0 ? items : null;
}

export function MdView({ markdown, assets, courseCode, onOpenPreview }: MdViewProps) {
  const components: Components = useMemo(() => {
    return {
      ...mdComponents,
      table: ({ node, ...p }) => {
        const sessionDocs = parseSessionDocTable(node, assets);
        if (sessionDocs) {
          return (
            <SessionMaterialsDeck
              items={sessionDocs}
              courseCode={courseCode}
              onOpenPreview={onOpenPreview}
            />
          );
        }
        return (
          <div className="my-4 overflow-x-auto overscroll-x-contain [scrollbar-width:thin] rounded-lg border">
            <table className="w-full text-[13px] sm:text-sm border-collapse" {...p} />
          </div>
        );
      },
    };
  }, [assets, courseCode, onOpenPreview]);

  return (
    <div className="text-[15px] sm:text-base leading-relaxed text-foreground/90 overflow-hidden">
      <ReactMarkdown
        remarkPlugins={[
          remarkFrontmatter,
          remarkGfm,
          [remarkMath, { singleDollarTextMath: true }],
        ]}
        rehypePlugins={[
          [
            rehypeKatex,
            {
              output: "htmlAndMathml",
              strict: false,
              throwOnError: false,
              trust: true,
            },
          ],
        ]}
        components={components}
      >
        {normalizeDisplayMath(markdown)}
      </ReactMarkdown>
    </div>
  );
}

