/**
 * Splits a course overview's opening off its body.
 *
 * Every `summary.md` opens the same way (docs/COURSE_OVERVIEW_STANDARD.md): an
 * H1 repeating the course code and name, then a blockquote saying in a line or
 * two what the course is, often followed by an "อัปเดตล่าสุด" line. On the hub
 * both already have a home — the name is the banner's heading and the quote's
 * first paragraph is the banner's tagline — so leaving them in the overview
 * card printed the course name twice and put a grey quote box inside the card. The full document page still renders the file untouched.
 *
 * Frontmatter is kept as is (MdView drops it). A document without a leading
 * H1 comes back unchanged with no tagline; one with an H1 but no quote loses
 * only the H1.
 */
export function splitSummaryLead(markdown: string): { tagline: string | null; body: string } {
  const lines = markdown.split("\n");
  let i = 0;

  if (lines[0]?.trim() === "---") {
    const close = lines.findIndex((line, index) => index > 0 && line.trim() === "---");
    if (close === -1) return { tagline: null, body: markdown };
    i = close + 1;
  }
  const head = lines.slice(0, i);

  while (i < lines.length && lines[i].trim() === "") i++;
  if (!/^#\s/.test(lines[i] ?? "")) return { tagline: null, body: markdown };
  i++;

  while (i < lines.length && lines[i].trim() === "") i++;
  const quote: string[] = [];
  while (i < lines.length && lines[i].startsWith(">")) {
    quote.push(lines[i].replace(/^>\s?/, "").trimEnd());
    i++;
  }

  // The first paragraph is the tagline. Anything after it in the quote — the
  // "อัปเดตล่าสุด" line — stays in the body as plain text, out of its grey box.
  const gap = quote.findIndex((line, index) => index > 0 && line.trim() === "");
  const first = gap === -1 ? quote : quote.slice(0, gap);
  const rest = gap === -1 ? [] : quote.slice(gap + 1);

  const tagline = plainText(first.map((line) => line.trim()).filter(Boolean).join(" ")) || null;
  return { tagline, body: [...head, "", ...rest, "", ...lines.slice(i)].join("\n") };
}

/** The banner shows the tagline as text, so inline markdown must not leak in. */
function plainText(markdown: string): string {
  return markdown
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/(\*\*|\*|`)(.+?)\1/g, "$2");
}
