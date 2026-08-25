import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: {
    template: "%s · PSCP iHelp",
    default: "PSCP · การแก้ปัญหาและการโปรแกรมคอมพิวเตอร์",
  },
  description:
    "คลังโจทย์ PSCP 06066303 IT KMITL — รายการโจทย์ iJudge พร้อมกำหนดส่ง โจทย์แนะนำพร้อมเฉลย ตัวช่วยสร้าง submission.md และ ai_reflection.md",
  openGraph: {
    type: "website",
    url: "https://pscp.chatan.in.th/pscp",
    title: "PSCP · การแก้ปัญหาและการโปรแกรมคอมพิวเตอร์",
    description:
      "คลังโจทย์ PSCP 06066303 IT KMITL — รายการโจทย์ iJudge พร้อมกำหนดส่ง โจทย์แนะนำพร้อมเฉลย ตัวช่วยสร้าง submission.md และ ai_reflection.md",
    images: [
      {
        url: "/og-image-pscp.png",
        width: 1200,
        height: 630,
        alt: "PSCP iHelp",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PSCP · การแก้ปัญหาและการโปรแกรมคอมพิวเตอร์",
    description:
      "คลังโจทย์ PSCP 06066303 IT KMITL — รายการโจทย์ iJudge พร้อมกำหนดส่ง โจทย์แนะนำพร้อมเฉลย ตัวช่วยสร้าง submission.md และ ai_reflection.md",
    images: ["/og-image-pscp.png"],
  },
};

export default function PscpLayout({ children }: { children: ReactNode }) {
  return <div className="pscp-theme min-h-screen w-full">{children}</div>;
}
