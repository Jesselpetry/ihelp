import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { VersionView } from "@/components/version-view";
import { SITE } from "@/lib/site";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Version",
  description: `${SITE.plainName} version history and changelog.`,
  alternates: { canonical: "/version" },
};

export default function VersionPage() {
  return (
    <>
      <Navbar />
      <VersionView />
    </>
  );
}
