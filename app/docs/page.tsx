import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { DocsReader } from "@/components/developer-docs/docs-reader";
import { getDeveloperDocs, getDocBySlug } from "@/lib/docs/dev-docs";
import { SITE, absoluteUrl } from "@/lib/site";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Developer Documentation Hub · Master Architecture",
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
  const doc = getDocBySlug("readme");
  if (!doc) notFound();

  const sections = getDeveloperDocs();

  return <DocsReader doc={doc} sections={sections} />;
}
