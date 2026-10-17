/**
 * Halves of the term inside one Markdown document.
 *
 * Some courses are two courses glued together — ICS is digital logic with one
 * instructor before the midterm and bench hardware with another after it, each
 * with its own week 1–7. A summary that runs the two halves together under one
 * heading list makes it easy to revise the wrong half. A document marks each
 * half with an HTML comment pair:
 *
 *     <!-- part: midterm | ครึ่งแรก — ดิจิทัลลอจิก · สอบกลางภาค -->
 *     ### Week 01 — …
 *     <!-- /part -->
 *
 * MdView renders a marked block as its own labelled panel, and a reader that
 * filters by exam scope drops the other half. Comments, so any other Markdown
 * renderer (GitHub, the editor preview) shows the document unchanged.
 */

export type PartScope = "midterm" | "final";

export interface DocChunk {
  /** Absent for the text between and around marked parts. */
  part?: PartScope;
  /** The label after `|` in the opening marker. */
  label?: string;
  markdown: string;
}

const OPEN = /^<!--\s*part:\s*(midterm|final)\s*(?:\|\s*(.*?))?\s*-->\s*$/;
const CLOSE = /^<!--\s*\/part\s*-->\s*$/;

export function hasParts(markdown: string): boolean {
  return markdown.split("\n").some((line) => OPEN.test(line.trim()));
}

/**
 * Splits a document into unmarked and marked chunks, in order. An opening
 * marker with no closing one runs to the end of the document; empty unmarked
 * chunks are dropped.
 */
export function splitParts(markdown: string): DocChunk[] {
  const chunks: DocChunk[] = [];
  let current: DocChunk = { markdown: "" };
  const lines: string[] = [];

  const flush = () => {
    const text = lines.join("\n");
    lines.length = 0;
    if (current.part || text.trim()) chunks.push({ ...current, markdown: text });
  };

  for (const line of markdown.split("\n")) {
    const open = OPEN.exec(line.trim());
    if (open) {
      flush();
      current = { part: open[1] as PartScope, label: open[2] || undefined, markdown: "" };
      continue;
    }
    if (current.part && CLOSE.test(line.trim())) {
      flush();
      current = { markdown: "" };
      continue;
    }
    lines.push(line);
  }
  flush();
  return chunks;
}

/** The document without the half that `scope` excludes; markers are kept. */
export function filterParts(markdown: string, scope: PartScope | "all"): string {
  if (scope === "all" || !hasParts(markdown)) return markdown;
  const out: string[] = [];
  let skipping = false;
  for (const line of markdown.split("\n")) {
    const open = OPEN.exec(line.trim());
    if (open) skipping = open[1] !== scope;
    else if (skipping && CLOSE.test(line.trim())) {
      skipping = false;
      continue;
    }
    if (!skipping) out.push(line);
  }
  return out.join("\n");
}
