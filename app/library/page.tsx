import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { LibraryToc } from "@/components/library-toc";
import { LibraryComingSoon } from "@/components/library-coming-soon";
import { loadLibrary } from "@/lib/library";
import { LIBRARY_COMING_SOON } from "@/lib/flags";

export const dynamic = "force-static";

export const metadata: Metadata = LIBRARY_COMING_SOON
  ? {
      title: "Library",
      description: "The iHelp resource library is coming soon.",
      alternates: { canonical: "/library" },
      // Nothing to index behind the cover, and indexing it would leave the
      // placeholder in search results after the library opens.
      robots: { index: false, follow: true },
    }
  : {
      title: "Library",
      description: "Read the PSCP AI-Guidelines documents like a book.",
      alternates: { canonical: "/library" },
    };

export default function LibraryPage() {
  return (
    <>
      <Navbar />
      {LIBRARY_COMING_SOON ? (
        <LibraryComingSoon />
      ) : (
        <LibraryToc docs={loadLibrary()} />
      )}
    </>
  );
}
