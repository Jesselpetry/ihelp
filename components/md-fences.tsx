import type { ReactNode } from "react";
import { VideoPlayer } from "@/components/media/video-player";
import { parseYouTubeFence } from "@/lib/docs/fences";

/**
 * Fenced blocks that render as something other than a code box.
 *
 * A fence is the only embed mechanism a course document has. This project
 * renders content with react-markdown and no `rehype-raw`, so raw HTML in a
 * Markdown file is printed as literal text — never parsed, never executed —
 * and there is no MDX pipeline to fall back on. A fence keeps the door shut on
 * arbitrary HTML in content while still letting a week page carry its lecture
 * and lab videos: all a document can express is "play these ids", and the
 * parser behind the fence validates every one before it reaches an iframe src.
 *
 * To add a fence (say ```quiz):
 *   1. Write a pure parser for its source in lib/docs/fences.ts. It must check
 *      every authored value that will land in a URL or an attribute — this
 *      is the one door content has to anything beyond Markdown, so the check
 *      lives in the parser, not in the component.
 *   2. Write the component. Keep it a Client Component under components/media/
 *      if it holds state.
 *   3. Register it below under the fence's language. Return null when the
 *      source holds nothing renderable: the reader then gets the ordinary code
 *      box, so a typo in a document shows up instead of leaving an empty gap.
 *   4. If a document's card should count it (docFacts in lib/docs/doc-index.ts),
 *      count with the same parser, so the card never promises more than the
 *      page shows.
 */

/** Draws one fenced block from its source text, or returns null to leave it as a code box. */
export type FenceRenderer = (source: string) => ReactNode | null;

export const FENCES: Record<string, FenceRenderer> = {
  youtube: (source) => {
    const videos = parseYouTubeFence(source);
    return videos.length > 0 ? <VideoPlayer provider="youtube" videos={videos} /> : null;
  },
};

/**
 * The renderer registered for a code element's `language-*` class, if any.
 *
 * The match is on the whole language name, and only on names FENCES defines
 * itself — a fence labelled `constructor` must not find Object's.
 */
export function fenceFor(className: string | undefined): FenceRenderer | undefined {
  const language = className?.match(/(?:^|\s)language-(\S+)/)?.[1];
  if (language === undefined || !Object.prototype.hasOwnProperty.call(FENCES, language)) {
    return undefined;
  }
  return FENCES[language];
}
