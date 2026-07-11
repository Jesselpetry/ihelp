"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Shared clean markdown renderer (library reader + wizard preview).
// Roomy leading, clean tables — all inline component styling since the
// typography plugin is not installed. Headings stay on the app sans
// (IBM Plex Sans Thai); the default serif stack has no Thai glyphs.
const mdComponents = {
  h1: (p: React.ComponentProps<"h1">) => (
    <h1 className="tracking-tight text-3xl font-bold mt-2 mb-6 leading-snug" {...p} />
  ),
  h2: (p: React.ComponentProps<"h2">) => (
    <h2
      className="tracking-tight text-xl font-bold mt-10 mb-3 pb-1.5 border-b leading-snug"
      {...p}
    />
  ),
  h3: (p: React.ComponentProps<"h3">) => (
    <h3 className="tracking-tight text-lg font-semibold mt-7 mb-2" {...p} />
  ),
  p: (p: React.ComponentProps<"p">) => (
    <p className="my-3 leading-relaxed" {...p} />
  ),
  ul: (p: React.ComponentProps<"ul">) => (
    <ul className="my-3 space-y-1.5 list-disc pl-6 marker:text-primary/60" {...p} />
  ),
  ol: (p: React.ComponentProps<"ol">) => (
    <ol className="my-3 space-y-1.5 list-decimal pl-6 marker:text-primary/60" {...p} />
  ),
  li: (p: React.ComponentProps<"li">) => (
    <li className="leading-relaxed" {...p} />
  ),
  blockquote: (p: React.ComponentProps<"blockquote">) => (
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
  a: (p: React.ComponentProps<"a">) => (
    <a
      className="text-primary underline underline-offset-4 hover:opacity-80"
      target="_blank"
      rel="noreferrer"
      {...p}
    />
  ),
  code: ({ className, ...p }: React.ComponentProps<"code">) =>
    className ? (
      // fenced block content: <pre> wrapper handles the box
      <code className={className} {...p} />
    ) : (
      <code
        className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.85em]"
        {...p}
      />
    ),
  pre: (p: React.ComponentProps<"pre">) => (
    <pre
      className="my-4 overflow-x-auto rounded-lg border bg-background p-4 font-mono text-sm leading-relaxed"
      {...p}
    />
  ),
  table: (p: React.ComponentProps<"table">) => (
    <div className="my-4 overflow-x-auto rounded-lg border">
      <table className="w-full text-sm border-collapse" {...p} />
    </div>
  ),
  th: (p: React.ComponentProps<"th">) => (
    <th
      className="border-b bg-muted/60 px-3 py-2 text-left font-semibold"
      {...p}
    />
  ),
  td: (p: React.ComponentProps<"td">) => (
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
