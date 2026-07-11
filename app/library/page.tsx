import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { LibraryToc } from "@/components/library-toc";
import { loadLibrary } from "@/lib/library";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Library",
  description: "Read the PSCP AI-Guidelines documents like a book.",
};

export default function LibraryPage() {
  return (
    <>
      <Navbar />
      <LibraryToc docs={loadLibrary()} />
    </>
  );
}
