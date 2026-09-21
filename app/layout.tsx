import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { IBM_Plex_Sans_Thai, Geist_Mono, Mali } from "next/font/google";
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
      className={`${plexThai.variable} ${geistMono.variable} ${mali.variable} h-full antialiased`}
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
