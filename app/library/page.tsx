import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { LibraryToc } from "@/components/library-toc";
import { loadLibrary } from "@/lib/library/library";
import { SITE, absoluteUrl } from "@/lib/site";

export const dynamic = "force-static";

const TITLE = `คลังเรียนรู้ · Library · ${SITE.shortName}`;
const DESCRIPTION =
  "คลังสื่อการเรียนรู้ สไลด์ OnLearn เลกเชอร์ คู่มือปฏิบัติการ และเอกสารประกอบการสอน คณะเทคโนโลยีสารสนเทศ IT KMITL";

export const metadata: Metadata = {
  title: "คลังเรียนรู้ · Library",
  description: DESCRIPTION,
  alternates: { canonical: "/library" },
  openGraph: {
    type: "website",
    url: absoluteUrl("/library"),
    title: TITLE,
    description: DESCRIPTION,
    images: [
      {
        url: SITE.og.library,
        width: SITE.og.width,
        height: SITE.og.height,
        alt: TITLE,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [SITE.og.library],
  },
};

export default function LibraryPage() {
  return (
    <>
      <Navbar />
      <LibraryToc docs={loadLibrary()} />
    </>
  );
}
