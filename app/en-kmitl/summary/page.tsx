import { redirect } from "next/navigation";

// Legacy route — ComPro summary moved to /en-kmitl/compro/summary
export default function OldSummaryPage() {
  redirect("/en-kmitl/compro/summary");
}
