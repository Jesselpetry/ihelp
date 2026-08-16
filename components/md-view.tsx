"use client";
/* eslint-disable @typescript-eslint/no-unused-vars */

import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

// Shared clean markdown renderer (library reader + wizard preview).
// Roomy leading, clean tables — all inline component styling since the
// typography plugin is not installed. Headings stay on the app sans
// (IBM Plex Sans Thai); the default serif stack has no Thai glyphs.
const mdComponents: Components = {
  h1: ({ node: _node, ref: _ref, ...p }) => (
    <h1 className="tracking-tight text-3xl font-bold mt-2 mb-6 leading-snug" {...p} />
  ),
  h2: ({ node: _node, ref: _ref, ...p }) => (
    <h2
      className="tracking-tight text-xl font-bold mt-10 mb-3 pb-1.5 border-b leading-snug"
      {...p}
    />
  ),
  h3: ({ node: _node, ref: _ref, ...p }) => (
    <h3 className="tracking-tight text-lg font-semibold mt-7 mb-2" {...p} />
  ),
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

export function MdView({ markdown }: { markdown: string }) {
  return (
    <div className="text-[15px] text-foreground/90">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
