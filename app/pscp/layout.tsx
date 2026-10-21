import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SITE, absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    template: `%s · PSCP ${SITE.shortName}`,
    default: "PSCP · การแก้ปัญหาและการโปรแกรมคอมพิวเตอร์",
  },
  description:
    "คลังโจทย์ PSCP 06066303 IT KMITL — รายการโจทย์ iJudge พร้อมกำหนดส่ง โจทย์แนะนำพร้อมเฉลย ตัวช่วยสร้าง submission.md และ ai_reflection.md",
  openGraph: {
    type: "website",
    url: absoluteUrl("/pscp"),
    title: "PSCP · การแก้ปัญหาและการโปรแกรมคอมพิวเตอร์",
    description:
      "คลังโจทย์ PSCP 06066303 IT KMITL — รายการโจทย์ iJudge พร้อมกำหนดส่ง โจทย์แนะนำพร้อมเฉลย ตัวช่วยสร้าง submission.md และ ai_reflection.md",
    images: [
      {
        url: SITE.og.pscp,
        width: SITE.og.width,
        height: SITE.og.height,
        alt: `PSCP ${SITE.shortName}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PSCP · การแก้ปัญหาและการโปรแกรมคอมพิวเตอร์",
    description:
      "คลังโจทย์ PSCP 06066303 IT KMITL — รายการโจทย์ iJudge พร้อมกำหนดส่ง โจทย์แนะนำพร้อมเฉลย ตัวช่วยสร้าง submission.md และ ai_reflection.md",
    images: [SITE.og.pscp],
  },
};

export default function PscpLayout({ children }: { children: ReactNode }) {
  return <div className="pscp-theme min-h-screen w-full">{children}</div>;
}
