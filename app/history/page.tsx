import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { HistoryView } from "@/components/history-view";

export const metadata: Metadata = {
  title: "History",
  description: "Your locally saved generated submission.md / ai_reflection.md files.",
};

export default function HistoryPage() {
  return (
    <>
      <Navbar />
      <HistoryView />
    </>
  );
}
