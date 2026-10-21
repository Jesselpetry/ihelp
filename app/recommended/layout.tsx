import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SITE, absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    template: "%s · PSCP Recommended Problems",
    default: "Recommended Problems · PSCP",
  },
  description:
    "Explore the 10 PSCP Recommended Problems with complete problem explanations, Python techniques, test cases, and solution code.",
  openGraph: {
    type: "website",
    url: absoluteUrl("/recommended"),
    title: "Recommended Problems · PSCP",
    description:
      "Explore the 10 PSCP Recommended Problems with complete problem explanations, Python techniques, test cases, and solution code.",
    images: [
      {
        url: SITE.og.pscp,
        width: SITE.og.width,
        height: SITE.og.height,
        alt: "PSCP Recommended Problems",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Recommended Problems · PSCP",
    description:
      "Explore the 10 PSCP Recommended Problems with complete problem explanations, Python techniques, test cases, and solution code.",
    images: [SITE.og.pscp],
  },
};

export default function RecommendedLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <div className="pscp-theme min-h-screen w-full">{children}</div>;
}
