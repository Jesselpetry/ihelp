import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { SITE, absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    template: `%s · ${SITE.plainName} Developer Docs`,
    default: `Developer Documentation Hub · ${SITE.plainName}`,
  },
  description: `ศูนย์รวมคลังข้อมูลวิศวกรรม สถาปัตยกรรมระบบ 12 ส่วนหลัก และคู่มือการพัฒนาของ ${SITE.plainName}`,
  alternates: { canonical: "/docs" },
  openGraph: {
    type: "website",
    url: absoluteUrl("/docs"),
    title: `Developer Documentation Hub · ${SITE.plainName}`,
    description: `ศูนย์รวมคลังข้อมูลวิศวกรรม สถาปัตยกรรมระบบ 12 ส่วนหลัก และคู่มือการพัฒนาของ ${SITE.plainName}`,
  },
};

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <div className="flex-1">{children}</div>
    </>
  );
}
