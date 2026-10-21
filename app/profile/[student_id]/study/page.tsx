import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { Navbar } from "@/components/navbar";
import { StudySpaceView } from "@/components/study-space/study-space-view";
import { currentStudentId } from "@/lib/auth/guards";
import { studyPlanFor } from "@/lib/study-space/plans";

export const metadata: Metadata = {
  title: "พื้นที่อ่าน",
  robots: { index: false, follow: false },
};

/**
 * A student's own study space. Personal on the server, not by hiding UI
 * (AGENTS.md rule 3): the plan is read only after the session's verified ID
 * matches the URL, so no other visitor — signed in or not — receives it.
 */
export default async function StudySpacePage({
  params,
}: {
  params: Promise<{ student_id: string }>;
}) {
  const { student_id } = await params;

  const viewer = await currentStudentId();
  if (!viewer) redirect("/");

  // Your own plan only - the URL is not the authority (same rule as /edit).
  if (viewer !== student_id) notFound();

  const plan = studyPlanFor(viewer);
  if (!plan) notFound();

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <StudySpaceView plan={plan} studentId={viewer} profileHref={`/profile/${viewer}`} />
      </main>
    </>
  );
}
