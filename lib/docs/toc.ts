/**
 * TOC (Table of Contents) extraction & heading slug utilities.
 */

export interface TocItem {
  id: string;
  text: string;
  level: 1 | 2 | 3;
  raw: string;
}

/**
 * Creates a URL-safe, clean slug from heading text.
 * Preserves Thai characters, alphanumeric ASCII, and hyphens.
 */
export function slugifyHeading(text: string): string {
  // Strip custom anchor syntax if present, e.g. "## Title {#custom-id}"
  const customIdMatch = text.match(/\{#([^}]+)\}/);
  if (customIdMatch) {
    return customIdMatch[1].trim();
  }

  return text
    // Strip markdown links [text](url) -> text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    // Strip bold/italic/code syntax
    .replace(/[*_`~#]/g, "")
    // Strip LaTeX math blocks
    .replace(/\$[^$]+\$/g, "")
    .trim()
    .toLowerCase()
    // Replace spaces and punctuation with hyphens
    .replace(/[\s\t\n\r]+/g, "-")
    // Remove special symbols but keep Thai, Latin, Numbers, and Hyphens
    .replace(/[^\w\u0E00-\u0E7F-]/g, "")
    // Collapse multiple hyphens
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Clean display title by removing markdown markup, custom anchor tags, etc.
 */
export function cleanHeadingTitle(text: string): string {
  return text
    .replace(/\{#[^}]+\}/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*_`~]/g, "")
    .trim();
}

/**
 * Extracts table of contents items from a markdown string.
 */
export function extractToc(markdown: string): TocItem[] {
  if (!markdown) return [];

  const cleanMd = markdown.replace(/^---[\r\n]+[\s\S]*?[\r\n]+---[\r\n]*/, "");
  const lines = cleanMd.split("\n");
  const items: TocItem[] = [];
  let inCodeBlock = false;

  for (const line of lines) {
    const trimmed = line.trim();

    // Skip code fences
    if (trimmed.startsWith("```")) {
      inCodeBlock = !inCodeBlock;
      continue;
    }
    if (inCodeBlock) continue;

    const match = trimmed.match(/^(#{1,3})\s+(.+)$/);
    if (!match) continue;

    const level = match[1].length as 1 | 2 | 3;
    const rawText = match[2].trim();

    const id = slugifyHeading(rawText);
    const displayText = cleanHeadingTitle(rawText);

    if (id && displayText) {
      items.push({
        id,
        text: displayText,
        level,
        raw: rawText,
      });
    }
  }

  return items;
}
