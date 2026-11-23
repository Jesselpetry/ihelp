import type { Metadata } from "next";
import { DocsHub } from "@/components/developer-docs/docs-hub";
import { getDeveloperDocs } from "@/lib/docs/dev-docs";
import { SITE, absoluteUrl } from "@/lib/site";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Developer Documentation Hub · คลังเอกสารนักพัฒนา",
  description: `พิมพ์เขียวสถาปัตยกรรมระบบ 12 ระบบหลัก และคู่มือวิศวกรรมของ ${SITE.plainName}`,
  alternates: { canonical: "/docs" },
  openGraph: {
    type: "website",
    url: absoluteUrl("/docs"),
    title: `Developer Documentation Hub · ${SITE.plainName}`,
    description: `พิมพ์เขียวสถาปัตยกรรมระบบ 12 ระบบหลัก และคู่มือวิศวกรรมของ ${SITE.plainName}`,
  },
};

export default function DocsPage() {
  const sections = getDeveloperDocs();
  return <DocsHub sections={sections} />;
}
