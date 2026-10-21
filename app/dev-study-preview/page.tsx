// TEMPORARY local QA harness — delete before handing back. Renders the study
// space without a session so headless tests can reach it; 404 outside dev.
import { notFound } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { StudySpaceView } from "@/components/study-space/study-space-view";
import { FINAL_1_2569 } from "@/lib/study-space/plans/final-1-2569";

export default function DevStudyPreview() {
  if (process.env.NODE_ENV !== "development") notFound();
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <StudySpaceView plan={FINAL_1_2569} studentId="00000000" profileHref="/" />
      </main>
    </>
  );
}
