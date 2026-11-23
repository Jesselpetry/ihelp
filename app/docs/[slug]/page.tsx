import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { DocsReader } from "@/components/developer-docs/docs-reader";
import { getAllDocMetas, getDeveloperDocs, getDocBySlug } from "@/lib/docs/dev-docs";
import { SITE, absoluteUrl } from "@/lib/site";

export const dynamic = "force-static";

export async function generateStaticParams() {
  return getAllDocMetas().map((doc) => ({ slug: doc.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const doc = getDocBySlug(slug);
  if (!doc) {
    return { title: "Document Not Found" };
  }

  const title = `${doc.title} — Docs`;
  const description = doc.description || `อ่านเอกสาร ${doc.title} ในคลังเอกสารนักพัฒนาของ ${SITE.plainName}`;
  const canonical = `/docs/${doc.slug}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: "article",
      url: absoluteUrl(canonical),
      title: `${title} · ${SITE.name}`,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} · ${SITE.name}`,
      description,
    },
  };
}

export default async function DocDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const doc = getDocBySlug(slug);
  if (!doc) notFound();

  const sections = getDeveloperDocs();

  return <DocsReader doc={doc} sections={sections} />;
}
