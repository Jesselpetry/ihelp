import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { VersionView } from "@/components/version-view";

export const metadata: Metadata = {
  title: "Version",
  description: "ihelp version history and changelog.",
};

export default function VersionPage() {
  return (
    <>
      <Navbar />
      <VersionView />
    </>
  );
}
