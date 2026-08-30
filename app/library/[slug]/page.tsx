import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { LibraryReader } from "@/components/library-reader";
import { loadLibraryDoc } from "@/lib/library";

import { loadLibrary } from "@/lib/library";
import { LIBRARY_COMING_SOON } from "@/lib/flags";

export async function generateStaticParams() {
  // Behind the cover there is nothing to prerender, and leaving these routes
  // reachable would make /library's placeholder trivial to walk around.
  if (LIBRARY_COMING_SOON) return [];
  return loadLibrary().map((doc) => ({ slug: doc.slug }));
}

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
  if (LIBRARY_COMING_SOON) notFound();

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
