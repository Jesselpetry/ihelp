import type { Metadata } from "next";
import { IBM_Plex_Sans_Thai, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { LocaleProvider } from "@/lib/i18n";
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

const SITE_URL = "https://pscp.chatann.in.th";
const TITLE = "<i>Help";
const DESCRIPTION =
  "เครื่องมือสร้าง submission.md / ai_reflection.md แบบทีละขั้นตอน สำหรับนักศึกษา PSCP IT KMITL — เลือกโจทย์ ทำตามขั้นตอน แล้วดาวน์โหลดไฟล์ Learning Log ของคุณ";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: "%s · <i>Help",
  },
  description: DESCRIPTION,
  applicationName: "<i>Help",
  keywords: [
    "PSCP",
    "IT KMITL",
    "Learning Log",
    "submission.md",
    "ai_reflection.md",
    "iJudge",
    "problem solving",
    "programming",
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
    siteName: "<i>help — PSCP Learning-Log Maker",
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: TITLE }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
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
      className={`${plexThai.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <LocaleProvider>
          <Splash />
          <DisclaimerModal />
          {children}
          <Footer />
        </LocaleProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
