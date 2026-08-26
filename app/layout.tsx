import type { Metadata } from "next";
import Script from "next/script";
import { IBM_Plex_Sans_Thai, Geist_Mono, Mali } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { LocaleProvider } from "@/lib/i18n";
import { ThemeProvider, THEME_SCRIPT } from "@/lib/theme";
import { Footer } from "@/components/footer";
import { DisclaimerModal } from "@/components/disclaimer-modal";
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
const SITE_URL = "https://pscp.chatan.in.th";
const TITLE = "<i>Help";
const DESCRIPTION =
  "คลังเรียนรู้สำหรับนักศึกษาปี 1 คณะ IT สจล. — สรุปเนื้อหา แบบทดสอบ ข้อสอบเก่า และคลังสไลด์ ครบทุกวิชา PSCP ITF ICS MFIT";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: "%s · <i>Help",
  },
  description: DESCRIPTION,
  applicationName: "<i>Help",
  keywords: [
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
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.png", type: "image/png" },
    ],
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
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
        <ThemeProvider>
          <LocaleProvider>
            <Splash />
            <DisclaimerModal />
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
