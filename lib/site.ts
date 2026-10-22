/**
 * Who this site is, in one file.
 *
 * A fork re-brands by editing this file: the few constants above the object and
 * the object itself. Metadata (the root, PSCP and recommended layouts), the web
 * manifest, robots.txt, the sitemap, and the navbar, footer, splash and the two
 * welcome modals all read from here, so none of them spells out a name, an
 * address or a handle of its own.
 *
 * Pure data plus one tiny helper, and client-safe on purpose: no "use client"
 * and no "server-only", because metadata is built on the server while the
 * navbar, footer and modals are Client Components, and both import this.
 *
 * Not brand, so not here:
 * - Page copy. Descriptions and keywords take the brand tokens from SITE, but
 *   the sentences stay next to the page that renders them.
 * - Identifiers. The `ihelp` prefix on storage keys, event names, bucket names
 *   and the Postgres schema is the name that data already lives under; renaming
 *   it would orphan every student's saved progress.
 * - Contributors in lib/docs/changelog.ts. They record who did what in each
 *   release and must not change when the site's owner does.
 *
 * Still by hand when re-branding: `themeColor` must mirror --background and
 * --primary in app/globals.css, and the files named by `og`, plus the icons
 * under app/ and public/icons/, have to be replaced.
 */

const GITHUB_OWNER = "Jesselpetry";
const REPO_NAME = "ihelp";
const REPO_URL = `https://github.com/${GITHUB_OWNER}/${REPO_NAME}`;

// NOTE: domain is chatan.in.th (one "n") — a typo here silently breaks
// og:image fetches for social crawlers.
const DEFAULT_URL = "https://ihelp.chatan.in.th";

function resolveUrl(): string {
  // Written out as a literal `process.env.NEXT_PUBLIC_…` so Next can inline it
  // into client bundles; a computed `process.env[key]` is never replaced.
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  // `||`, not `??`: a blank `NEXT_PUBLIC_SITE_URL=` line in .env has to fall
  // back, not reach `new URL("")` and take the whole build down. Trailing
  // slashes come off so `${SITE.url}/path` never doubles one.
  return (configured || DEFAULT_URL).replace(/\/+$/, "");
}

export const SITE = {
  /** Display name: tab titles, `applicationName`, og:title and its alt text. */
  name: "<i>Help",
  /** The name as it is typed in running prose and in search keywords. */
  plainName: "ihelp",
  /**
   * Label under a home-screen icon (iOS `appleWebApp.title`, PWA `short_name`),
   * and how the manifest's full name and the PSCP section's titles begin.
   */
  shortName: "iHelp",
  /**
   * The wordmark as <Wordmark /> draws it: `open` and `close` take the primary
   * colour and `text` stays plain, which spells "<ihelp>" on screen.
   * components/splash.tsx types it one character per animation step, 7 of
   * them — read the note there before changing its length.
   *
   * `plain` is the wordmark written as text: descriptions, keywords,
   * og:site_name and the onboarding heading. It is NOT open + text + close.
   * The drawn mark closes the bracket at the end, the written one closes the
   * tag after the i ("<i>help"), so each is spelled out rather than derived.
   */
  wordmark: { open: "<i", text: "help", close: ">", plain: "<i>help" },

  /**
   * Public origin with no trailing slash: metadataBase, og:url, robots, sitemap.
   * NEXT_PUBLIC_SITE_URL overrides it for a fork or a preview. It is not
   * NEXT_PUBLIC_APP_URL — that one is the GitHub OAuth callback origin and
   * points at localhost in dev.
   */
  url: resolveUrl(),

  /**
   * One-line description of what the site is. The Thai text is the headline of
   * the home page, the splash and og:site_name; the English is the home page's
   * headline when the reader switches language. Other phrasings of it exist
   * (the home page's <title>, the disclaimer's badge, the library gate), which
   * are deliberately not derived from this one.
   */
  tagline: { th: "คลังเรียนรู้ IT KMITL", en: "IT KMITL Learning Hub" },

  /** The faculty the site serves; it is the `provider` of every course in the JSON-LD. */
  org: {
    /** The short form used in running text: "Built for IT KMITL". */
    short: "IT KMITL",
    name: {
      th: "คณะเทคโนโลยีสารสนเทศ สถาบันเทคโนโลยีพระจอมเกล้าเจ้าคุณทหารลาดกระบัง",
      en: "School of Information Technology, KMITL",
    },
    url: "https://www.it.kmitl.ac.th",
  },

  /** Who runs the site: metadata authors, the footer's © line, the disclaimer's credit. */
  author: {
    name: "Chatan Petry",
    github: GITHUB_OWNER,
    url: `https://github.com/${GITHUB_OWNER}`,
    credit: { th: "By เจส IT24", en: "Made by Jes · IT24" },
  },

  /** The source repository, which the /version page links commits and diffs from. */
  repo: {
    owner: GITHUB_OWNER,
    name: REPO_NAME,
    /** The branch an "Unreleased" entry compares against, and CHANGELOG.md is read from. */
    branch: "main",
    url: REPO_URL,
  },

  /**
   * Links in the footer and the disclaimer. `handle` is the text on the footer
   * pill. The GitHub pill links to the repository while showing the author's
   * handle, as it always has.
   */
  social: {
    github: { url: REPO_URL, handle: `/${GITHUB_OWNER}` },
    instagram: { url: "https://instagram.com/chatann_", handle: "@chatann_" },
  },

  /** Share-card images under public/. */
  og: {
    default: "/og-image.png",
    pscp: "/og-image-pscp.png",
    courses: "/og/courses.png",
    map: "/og/map.png",
    week: "/og/week.png",
    library: "/og/library.png",
    summary: "/og/summary.png",
    cram: "/og/cram.png",
    drill: "/og/drill.png",
    mock: "/og/mock.png",
    examSchedule: "/og/exam-schedule.png",
    width: 1200,
    height: 630,
  },

  /**
   * Browser chrome colours. `light` and `dark` are --background in
   * app/globals.css, painted behind the installed app's title bar (and used as
   * the manifest's background_color for `light`); `primary` is --primary, the
   * manifest's theme_color.
   */
  themeColor: { light: "#f4f6f8", dark: "#0f1318", primary: "#2357A5" },

  /** Language of the pages: <html lang>, the manifest and the JSON-LD. */
  locale: "th",
} as const;

/**
 * `path` on this site as an absolute URL, for the places that write the whole
 * address: sitemap entries, robots.txt and og:url. Image paths and canonical
 * links stay relative and let `metadataBase` resolve them.
 */
export function absoluteUrl(path = "/"): string {
  return `${SITE.url}${path.startsWith("/") ? path : `/${path}`}`;
}
