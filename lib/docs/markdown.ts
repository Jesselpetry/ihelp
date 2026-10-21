/**
 * The parts of the Markdown pipeline that more than one program must get
 * identically right.
 *
 * Two programs read the course Markdown: components/md-view.tsx draws it for
 * readers, and scripts/library-shared.ts re-parses the same documents to find
 * the file tables that the resource index and the audit report on. If they
 * ever disagreed about what `$$` means, they would disagree about where a
 * table starts, and the audit would judge a page the reader never sees.
 * MdView is a Client Component that pulls in React, so a script cannot import
 * anything from it — what they share lives here instead.
 *
 * Pure on purpose: no React, no remark/rehype import, nothing a tsx script
 * cannot load. The plugin chain itself is therefore NOT here. The plugins are
 * ESM-only; MdView imports them statically, while the script (run as CJS by
 * tsx) has to load them with dynamic import(). Each side builds its own list,
 * in this order, from the constants below:
 *
 *   remarkFrontmatter, remarkGfm, [remarkMath, REMARK_MATH_OPTIONS], remarkNotebook
 *   then, MdView only: [rehypeKatex, KATEX_OPTIONS]
 *
 * The table reader leaves rehype-katex out — a math cell is never a filename.
 * Adding or reordering a plugin means changing both lists.
 */

/**
 * `$x$` is inline math. That is remark-math's default; it is written out
 * because every study guide in content/ relies on it, and a plugin upgrade
 * that flipped the default would otherwise quietly unrender them all.
 */
export const REMARK_MATH_OPTIONS = { singleDollarTextMath: true } as const;

/**
 * Options for rehype-katex.
 *
 * `trust` is off. It is the switch that lets a formula do more than draw:
 * `\href` and `\url` become links, `\includegraphics` becomes an <img> loaded
 * from any web address, and `\htmlClass` / `\htmlId` / `\htmlStyle` /
 * `\htmlData` put arbitrary classes, ids, inline styles and data attributes on
 * the page — enough to lay a full-screen overlay over the reader's UI, or to
 * reuse an id the page already has. (react-markdown's own URL filter blanks a
 * `javascript:` href, so running script is not the risk; phishing, tracking and
 * spoofing are.) Most of the Markdown here is written by us, but not all of it:
 * data/pscp/problems.json holds problem statements scraped from the course
 * judge, and those reach this pipeline as text nobody on this project wrote or
 * read. With `trust` off, KaTeX prints each of those commands as its own name
 * in its error red and drops the arguments, so a hostile statement shows up as
 * junk instead of as a link, an image or a restyled page. Nothing in content/
 * or data/ uses any of them, so nothing legitimate is lost; a link belongs in
 * Markdown, where the `a` renderer in MdView decides how it opens.
 */
export const KATEX_OPTIONS = {
  // Both the drawn HTML and the MathML that screen readers and copy/paste use.
  output: "htmlAndMathml",
  // A Thai word typed straight into a formula, outside \text{…}, is a
  // strict-mode violation; with strict on it would log a console warning on
  // every render.
  strict: false,
  // No effect today: rehype-katex always renders with `throwOnError: true`
  // first and, if that throws, once more with `throwOnError: false` and
  // `strict: "ignore"`, so a broken formula shows as red source text instead of
  // taking the page down. Kept so this is exactly what MdView passed before.
  throwOnError: false,
  trust: false,
} as const;

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
 *
 * Whoever parses Markdown for its structure has to run this first, not only
 * whoever renders it: a `$$` pair inside a table row breaks the table, so a
 * parser that skipped the rewrite would disagree with the reader about where
 * the tables are.
 */
export function normalizeDisplayMath(markdown: string): string {
  return markdown.replace(/\$\$([\s\S]*?)\$\$/g, (_match, body: string) => {
    const trimmed = body.trim();
    return trimmed ? `\n\n$$\n${trimmed}\n$$\n\n` : "$$$$";
  });
}

/**
 * Matches a whole part-marker line (see lib/docs/parts.ts). Global: hand it to
 * String.replace, never to .test() or .exec(), which would carry `lastIndex`
 * from one call to the next.
 */
export const PART_MARKER_LINE = /^[ \t]*<!--\s*(?:\/part|part:.*?)\s*-->[ \t]*$/gm;
