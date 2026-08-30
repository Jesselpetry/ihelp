import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { HistoryView } from "@/components/history-view";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "History",
  description: "Your locally saved generated submission.md / ai_reflection.md files.",
  alternates: { canonical: "/history" },
};

export default function HistoryPage() {
  return (
    <div className="pscp-theme min-h-screen w-full">
      <Navbar />
      <HistoryView />
    </div>
  );
}
