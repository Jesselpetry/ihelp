import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { eq } from "drizzle-orm";

import { db, itggStudents } from "@/db";
import { Navbar } from "@/components/navbar";
import { OnboardingForm } from "@/components/account/onboarding-form";
import { currentStudentId, currentUser } from "@/lib/auth/guards";

export const metadata: Metadata = {
  title: "ตั้งค่าโปรไฟล์",
  robots: { index: false, follow: false },
};

export default async function OnboardingPage() {
  const studentId = await currentStudentId();
  if (!studentId) redirect("/");

  // Already onboarded — nothing to do here.
  if (await currentUser()) redirect("/");

  // Pre-fill from the roster the itgg-2026 app maintains. Read-only, and
  // reachable only over the Drizzle connection (the table is RLS-locked with
  // no policies). A student who is not on it — a senior, say — starts blank.
  const roster = await db.query.itggStudents.findFirst({
    where: eq(itggStudents.studentId, studentId),
    columns: { frontName: true, surName: true },
  });

  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-lg flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <header className="mb-8 space-y-2">
          <p className="font-mono text-xs text-muted-foreground">{studentId}</p>
          <h1 className="text-2xl font-semibold">ยินดีต้อนรับสู่ &lt;i&gt;help</h1>
          <p className="text-sm leading-relaxed text-muted-foreground text-pretty">
            กรอกข้อมูลอีกเล็กน้อยเพื่อสร้างโปรไฟล์ของคุณ
            เพื่อนๆ จะเห็นข้อมูลนี้เมื่อคุณแชร์สรุปหรือสไลด์เข้าคลัง
          </p>
        </header>

        <OnboardingForm
          defaultFirstName={roster?.frontName ?? ""}
          defaultLastName={roster?.surName ?? ""}
        />
      </main>
    </>
  );
}
