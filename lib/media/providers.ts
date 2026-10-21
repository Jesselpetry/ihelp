/**
 * Where course videos come from, and what the app may do with each source.
 *
 * Two providers exist today, and they are handled differently on purpose:
 *
 * - YouTube clips are embedded. A course document asks for them with a
 *   ```youtube fence (lib/docs/fences.ts), and the id is validated here before
 *   it is ever interpolated into an iframe src — the id is the one piece of
 *   authored content that ends up inside a URL.
 * - OnLearn recordings are links, never embeds. They sit behind the faculty
 *   login, and their URLs are served only through /api/library/assets after an
 *   IT KMITL sign-in (see lib/library/course-weeks.ts), so nothing here builds
 *   or stores one.
 *
 * Adding a provider means adding one entry. If a CSP is ever introduced, an
 * embeddable provider's origin also has to be allowed in frame-src.
 *
 * Pure data with no imports: safe for client components, server code and the
 * tsx scripts alike.
 */

export type VideoProviderId = "youtube" | "onlearn";

export interface VideoProvider {
  /** Brand name shown to readers ("Watch on YouTube", the OnLearn row). */
  label: string;
  /** Hostnames whose URLs belong to this provider. */
  hosts: readonly string[];
  /** Present only for providers whose clips may be embedded by id. */
  embed?: {
    isValidId: (id: string) => boolean;
    embedUrl: (id: string) => string;
    watchUrl: (id: string) => string;
  };
}

/** A YouTube id is exactly 11 characters of [A-Za-z0-9_-]. */
const YOUTUBE_ID = /^[A-Za-z0-9_-]{11}$/;

export const VIDEO_PROVIDERS: Record<VideoProviderId, VideoProvider> = {
  youtube: {
    label: "YouTube",
    hosts: ["youtube.com", "www.youtube.com", "youtu.be", "www.youtube-nocookie.com"],
    embed: {
      isValidId: (id) => YOUTUBE_ID.test(id),
      // The no-cookie host keeps an embedded player from setting tracking
      // cookies until the reader actually presses play.
      embedUrl: (id) => `https://www.youtube-nocookie.com/embed/${id}`,
      watchUrl: (id) => `https://www.youtube.com/watch?v=${id}`,
    },
  },
  onlearn: {
    label: "OnLearn",
    hosts: ["onlearn.it.kmitl.ac.th"],
  },
};

/** The provider a URL points at, or undefined for any other host. */
export function providerForUrl(url: string | undefined): VideoProvider | undefined {
  if (!url) return undefined;
  let host: string;
  try {
    host = new URL(url).hostname;
  } catch {
    return undefined;
  }
  return Object.values(VIDEO_PROVIDERS).find((p) => p.hosts.includes(host));
}
