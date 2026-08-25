import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: {
    template: "%s · PSCP Recommended Problems",
    default: "Recommended Problems · PSCP",
  },
  description:
    "Explore the 10 PSCP Recommended Problems with complete problem explanations, Python techniques, test cases, and solution code.",
  openGraph: {
    type: "website",
    url: "https://pscp.chatan.in.th/recommended",
    title: "Recommended Problems · PSCP",
    description:
      "Explore the 10 PSCP Recommended Problems with complete problem explanations, Python techniques, test cases, and solution code.",
    images: [
      {
        url: "/og-image-pscp.png",
        width: 1200,
        height: 630,
        alt: "PSCP Recommended Problems",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Recommended Problems · PSCP",
    description:
      "Explore the 10 PSCP Recommended Problems with complete problem explanations, Python techniques, test cases, and solution code.",
    images: ["/og-image-pscp.png"],
  },
};

export default function RecommendedLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <div className="pscp-theme min-h-screen w-full">{children}</div>;
}
