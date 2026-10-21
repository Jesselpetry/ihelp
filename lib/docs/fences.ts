/**
 * What a ```youtube fence asks for.
 *
 * Syntax — one video per line, `videoId | label`:
 *
 *     ```youtube
 *     3NvqarEC1fg | บรรยาย — Computer System
 *     putCB8g1e0U | Lab 1.1 — ตัดและบัดกรีสาย
 *     ```
 *
 * Blank lines and lines starting with `#` are skipped, and so is any line whose
 * id the provider registry rejects (lib/media/providers.ts). The id is the one
 * part of an authored document that ends up inside a URL, so it is checked
 * here, before a player ever sees it — a malformed line is dropped, never
 * interpolated.
 *
 * Two places read a fence and must agree: the player (components/md-fences.tsx)
 * and the document cards' clip count (docFacts in lib/docs/doc-index.ts). Both
 * go through this function, so a card never promises a clip that a comment line
 * or a typo kept off the page.
 *
 * extractToc() already skips fenced blocks, so these never reach the outline.
 *
 * Pure: safe for client components and scripts alike.
 */

import { VIDEO_PROVIDERS } from "@/lib/media/providers";

/** One clip a fence lists. */
export interface FenceVideo {
  id: string;
  label: string;
}

export function parseYouTubeFence(source: string): FenceVideo[] {
  const videos: FenceVideo[] = [];
  const embed = VIDEO_PROVIDERS.youtube.embed;
  // No embed config means nothing can be played; the fence then stays a code
  // box, which is where a configuration slip is easiest to notice.
  if (!embed) return videos;

  for (const line of source.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const [rawId, ...rest] = trimmed.split("|");
    const id = rawId.trim();
    if (!embed.isValidId(id)) continue;
    // A label may itself contain `|`, so everything after the first one is it.
    videos.push({ id, label: rest.join("|").trim() || id });
  }
  return videos;
}
