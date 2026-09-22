/**
 * What a document can say about itself before you open it.
 *
 * A module binds a shelf of documents (lib/course-bindings.ts). Until now the
 * reader's only way of describing that shelf was a row of title chips, so a
 * module with eight documents opened straight into the first one's full text —
 * every week's objectives, videos, parts list and lab summary poured onto one
 * page, with no way to see "which session am I looking for" before reading.
 *
 * These facts are what the index cards are built from. Everything here is
 * counted out of the Markdown rather than declared beside it, for the same
 * reason the course hub counts its question banks instead of carrying a
 * hand-written `questionCounts` map: a declared number drifts from the file it
 * describes, and a card that promises four videos and delivers two is worse
 * than a card that promises nothing.
 *
 * Pure string work, no `fs` — this is imported by a client component.
 */

export interface DocFacts {
  /** The document's own lead line, plain text, or null when it has no lead. */
  lead: string | null;
  /** Clips listed inside ```youtube fences. */
  videos: number;
  /** Distinct document files named anywhere in the body. */
  files: number;
  /** Items in the document's first bullet list — its objectives, by convention. */
  objectives: number;
}

const YOUTUBE_FENCE = /```youtube\n([\s\S]*?)```/g;
const ANY_FENCE = /```[\s\S]*?```/g;
const DOC_FILE = /[\w.-]+\.(?:pdf|zip|docx|pptx|ova)/gi;

/**
 * Markdown inline syntax removed, so a lead reads as a sentence on a card.
 *
 * Deliberately not a Markdown parser: the card renders plain text into a
 * clamped two-line box, and pulling react-markdown into it would ship the
 * whole renderer for a string nobody can click.
 */
function plain(markdown: string): string {
  return markdown
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[*_`]+/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * The first blockquote paragraph, falling back to the first body paragraph.
 *
 * Blockquote first because that is where every session page already puts its
 * one-line summary — the syllabus session number, the date, the deck and its
 * page count. A document that does not follow that habit still gets a lead,
 * just from its opening prose instead.
 */
function leadOf(body: string): string | null {
  const lines = body.split("\n");
  const quoted: string[] = [];
  let seenQuote = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith(">")) {
      const text = trimmed.replace(/^>\s?/, "");
      // A blank quote line ends the first paragraph; later ones are detail the
      // card has no room for.
      if (text === "" && quoted.length > 0) break;
      if (text !== "") quoted.push(text);
      seenQuote = true;
      continue;
    }
    if (seenQuote && quoted.length > 0) break;
    if (trimmed === "" || trimmed.startsWith("#") || trimmed.startsWith("---")) continue;
    if (!seenQuote) return plain(trimmed) || null;
  }

  return quoted.length > 0 ? plain(quoted.join(" ")) || null : null;
}

/** Items in the first run of consecutive bullets. */
function firstListLength(body: string): number {
  let count = 0;
  for (const line of body.split("\n")) {
    const trimmed = line.trim();
    if (/^[-*]\s+\S/.test(trimmed)) {
      count += 1;
      continue;
    }
    if (count > 0 && trimmed !== "") break;
  }
  return count;
}

export function docFacts(markdown: string): DocFacts {
  let videos = 0;
  for (const [, block] of markdown.matchAll(YOUTUBE_FENCE)) {
    videos += block.split("\n").filter((line) => line.trim() !== "").length;
  }

  // Fences are stripped before the prose scans so a code sample can never be
  // read as a lead, and so a video id is never counted as a file.
  const body = markdown.replace(ANY_FENCE, "");

  const files = new Set(
    (body.match(DOC_FILE) ?? []).map((name) => name.toLowerCase()),
  ).size;

  return {
    lead: leadOf(body),
    videos,
    files,
    objectives: firstListLength(body),
  };
}

/**
 * "คาบที่ 2 — ออสซิลโลสโคป" -> { eyebrow: "คาบที่ 2", rest: "ออสซิลโลสโคป" }.
 *
 * Bindings already write their session and week titles this way, so the card
 * can put the position in a badge and give the rest of the line to the topic.
 * A title with no dash keeps its whole self and gets no badge — inventing one
 * would number documents the binding deliberately left unnumbered.
 */
export function splitTitle(title: string): { eyebrow: string | null; rest: string } {
  const at = title.indexOf("—");
  if (at === -1) return { eyebrow: null, rest: title };
  const eyebrow = title.slice(0, at).trim();
  const rest = title.slice(at + 1).trim();
  if (eyebrow === "" || rest === "") return { eyebrow: null, rest: title };
  return { eyebrow, rest };
}
