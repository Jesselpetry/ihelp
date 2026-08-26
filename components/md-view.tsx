"use client";
/* eslint-disable @typescript-eslint/no-unused-vars */

import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkFrontmatter from "remark-frontmatter";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { slugifyHeading } from "@/lib/toc";

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
        className="tracking-tight text-3xl font-bold mt-2 mb-6 leading-snug scroll-mt-24"
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
        className="tracking-tight text-xl font-bold mt-10 mb-3 pb-1.5 border-b leading-snug scroll-mt-24"
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
        className="tracking-tight text-lg font-semibold mt-7 mb-2 scroll-mt-24"
        {...p}
      >
        {children}
      </h3>
    );
  },

  p: ({ node: _node, ref: _ref, ...p }) => (
    <p className="my-3 leading-relaxed" {...p} />
  ),
  ul: ({ node: _node, ref: _ref, ...p }) => (
    <ul className="my-3 space-y-1.5 list-disc pl-6 marker:text-primary/60" {...p} />
  ),
  ol: ({ node: _node, ref: _ref, ...p }) => (
    <ol className="my-3 space-y-1.5 list-decimal pl-6 marker:text-primary/60" {...p} />
  ),
  li: ({ node: _node, ref: _ref, ...p }) => (
    <li className="leading-relaxed" {...p} />
  ),
  blockquote: ({ node: _node, ref: _ref, ...p }) => (
    <blockquote
      className="my-4 border-l-[3px] border-primary/40 bg-primary/[0.04] pl-4 py-2 rounded-r-lg italic"
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
        className="text-primary underline underline-offset-4 hover:opacity-80"
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
        className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.85em]"
        {...p}
      />
    ),
  pre: ({ node: _node, ref: _ref, ...p }) => (
    <pre
      className="my-4 overflow-x-auto rounded-lg border bg-background p-4 font-mono text-sm leading-relaxed"
      {...p}
    />
  ),
  table: ({ node: _node, ref: _ref, ...p }) => (
    <div className="my-4 overflow-x-auto rounded-lg border">
      <table className="w-full text-sm border-collapse" {...p} />
    </div>
  ),
  th: ({ node: _node, ref: _ref, ...p }) => (
    <th
      className="border-b bg-muted/60 px-3 py-2 text-left font-semibold"
      {...p}
    />
  ),
  td: ({ node: _node, ref: _ref, ...p }) => (
    <td className="border-b px-3 py-2 align-top" {...p} />
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

export function MdView({ markdown }: { markdown: string }) {
  return (
    <div className="text-[15px] text-foreground/90 overflow-hidden">
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
        components={mdComponents}
      >
        {normalizeDisplayMath(markdown)}
      </ReactMarkdown>
    </div>
  );
}

