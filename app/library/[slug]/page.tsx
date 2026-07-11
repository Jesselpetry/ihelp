import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { LibraryReader } from "@/components/library-reader";
import { loadLibraryDoc } from "@/lib/library";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const doc = loadLibraryDoc(slug);
  return { title: doc ? `${doc.title} — Library` : "Library" };
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
