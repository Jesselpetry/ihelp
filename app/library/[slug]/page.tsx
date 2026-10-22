import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { LibraryReader } from "@/components/library-reader";
import { loadLibrary, loadLibraryDoc } from "@/lib/library/library";
import { SITE, absoluteUrl } from "@/lib/site";

export async function generateStaticParams() {
  return loadLibrary().map((doc) => ({ slug: doc.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const doc = loadLibraryDoc(slug);
  const title = doc ? `${doc.title} — Library` : "Library";
  const description = doc
    ? `อ่านเอกสาร ${doc.title} (${doc.section.title}) — คลังเอกสารและคู่มือการเรียนรู้ IT KMITL`
    : "คลังเอกสารและคู่มือการเรียนรู้ IT KMITL";
  const canonical = `/library/${slug}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: "website",
      url: absoluteUrl(canonical),
      title: `${title} · ${SITE.shortName}`,
      description,
      images: [
        {
          url: SITE.og.library,
          width: SITE.og.width,
          height: SITE.og.height,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} · ${SITE.shortName}`,
      description,
      images: [SITE.og.library],
    },
  };
}

export default async function LibraryDocPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const doc = loadLibraryDoc(slug);
  if (!doc) notFound();
  return (
    <>
      <Navbar />
      <LibraryReader
        title={doc.title}
        sectionTitle={doc.section.title}
        index={doc.index}
        total={doc.total}
        th={doc.th}
        en={doc.en}
        prev={doc.prev}
        next={doc.next}
      />
    </>
  );
}
