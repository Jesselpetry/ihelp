import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { IBM_Plex_Sans_Thai, Geist_Mono, Mali } from "next/font/google";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { LocaleProvider } from "@/lib/i18n";
import { ThemeProvider, THEME_SCRIPT } from "@/lib/theme";
import { Footer } from "@/components/footer";
import { DisclaimerModal } from "@/components/disclaimer-modal";
import { WelcomeChoiceModal } from "@/components/welcome-choice-modal";
import { Splash } from "@/components/splash";
import "./globals.css";

const plexThai = IBM_Plex_Sans_Thai({
  variable: "--font-sans",
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const mali = Mali({
  variable: "--font-mali",
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
});

/*
 * TH Sarabun New v1.3, the unhinted webfont build from
 * github.com/Phonbopit/sarabun-webfont, re-compressed here to WOFF2. Same
 * outlines as the hinted v1.35 release, but without fpgm/prep/hdmx/VDMX the
 * four faces come to 163 KB instead of 295 KB, and nothing on the web reads
 * TrueType hinting anyway.
 *
 * It ships only two weights (400/700) plus matching italics — no 500/600 — so
 * `font-medium` resolves back down to 400 and renders as normal text. Use 400
 * or 700 only; see docs/FONTS.md.
 *
 * size-adjust is not cosmetic. The face draws small: ก stands 0.612em against
 * 0.558em in IBM Plex Sans Thai. 91% = 0.558/0.612, which lines its Thai body
 * height up with --font-sans and lets the normal text-* scale apply unchanged.
 * Because that invalidates the metrics Next.js would derive for a fallback
 * face, adjustFontFallback is off and the fallback list is explicit.
 *
 * Even at 91% the mark stack spans 1.51em of ink, so anything rendering this
 * family needs roughly 1.9 line-height. MdView sets it; see docs/FONTS.md.
 *
 * preload is off: the variable sits on <html> for every route, and these faces
 * should not block pages that render no Markdown.
 */
const thSarabun = localFont({
  variable: "--font-sarabun",
  display: "swap",
  preload: false,
  adjustFontFallback: false,
  fallback: ["IBM Plex Sans Thai", "Sarabun", "Tahoma", "sans-serif"],
  declarations: [{ prop: "size-adjust", value: "91%" }],
  src: [
    {
      path: "./fonts/THSarabunNew-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/THSarabunNew-Italic.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "./fonts/THSarabunNew-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/THSarabunNew-BoldItalic.woff2",
      weight: "700",
      style: "italic",
    },
  ],
});

// Keep in sync with app/robots.ts and app/sitemap.ts.
// NOTE: domain is chatan.in.th (one "n") — a typo here silently breaks
// og:image fetches for social crawlers.
const SITE_URL = "https://ihelp.chatan.in.th";
const TITLE = "<i>Help";
const DESCRIPTION =
  "<i>help — คลังเรียนรู้สำหรับนักศึกษาปี 1 คณะ IT สจล. สรุปเนื้อหา แบบทดสอบ ข้อสอบเก่า และคลังสไลด์ ครบทุกวิชา PSCP ITF ICS MFIT";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: "%s · <i>Help",
  },
  description: DESCRIPTION,
  applicationName: "<i>Help",
  keywords: [
    "ihelp",
    "<i>help",
    "ihelp kmitl",
    "IT KMITL",
    "สจล",
    "เทคโนโลยีสารสนเทศ",
    "สรุป",
    "ข้อสอบเก่า",
    "แบบทดสอบ",
    "ติวสอบกลางภาค",
    "PSCP",
    "ITF",
    "ICS",
    "MFIT",
    "Learning Log",
    "submission.md",
    "ai_reflection.md",
    "iJudge",
  ],
  authors: [{ name: "Chatan Petry", url: "https://github.com/Jesselpetry" }],
  creator: "Chatan Petry",
  category: "education",
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  // Icons come from the App Router file conventions (app/favicon.ico,
  // app/icon.svg, app/apple-icon.png). Declaring metadata.icons here would
  // override them, so don't re-add it.
  appleWebApp: {
    capable: true,
    title: "iHelp",
    statusBarStyle: "black-translucent",
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: TITLE,
    siteName: "<i>help — คลังเรียนรู้ IT KMITL",
    description: DESCRIPTION,
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: TITLE }],
  },
  twitter: {
    card: "summary_large_image",
    description: DESCRIPTION,
    images: ["/og-image.png"],
  },
};

/**
 * themeColor paints the standalone/installed title bar. Both entries track
 * --background in app/globals.css so the PWA chrome matches the page behind
 * it in either scheme.
 */
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f6f8" },
    { media: "(prefers-color-scheme: dark)", color: "#0f1318" },
  ],
  colorScheme: "light dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="th"
      suppressHydrationWarning
      className={`${plexThai.variable} ${geistMono.variable} ${mali.variable} ${thSarabun.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/*
          beforeInteractive Scripts must be placed inside <body>, not as a
          direct child of <html>. Next.js hoists them into <head> regardless
          of where they're placed in the component.
        */}
        <Script
          id="theme-script"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }}
        />
        {/*
          Registers public/sw.js. It replaces the old self-unregistering
          worker: taking over the scope neutralizes any rogue worker on this
          origin/port just as well, and a live worker is what makes the app
          installable in Chromium.
        */}
        <Script
          id="sw-register"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `if('serviceWorker' in navigator){window.addEventListener('load',function(){navigator.serviceWorker.register('/sw.js').catch(function(){});});}`,
          }}
        />
        <ThemeProvider>
          <LocaleProvider>
            <Splash />
            <DisclaimerModal />
            <WelcomeChoiceModal />
            {children}
            <Footer />
          </LocaleProvider>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
