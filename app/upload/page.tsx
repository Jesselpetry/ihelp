import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

import { Navbar } from "@/components/navbar";
import { UploadForm } from "@/components/account/upload-form";
import { currentStudentId, currentUser } from "@/lib/auth/guards";

export const metadata: Metadata = {
  title: "แชร์เข้าคลัง",
  robots: { index: false, follow: false },
};

export default async function UploadPage() {
  const studentId = await currentStudentId();
  if (!studentId) redirect("/");

  // Signed in but never onboarded — no users row means no valid uploader_id.
  const user = await currentUser();
  if (!user) redirect("/onboarding");

  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-lg flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <header className="mb-8 space-y-2">
          <h1 className="text-2xl font-semibold">แชร์เข้าคลัง</h1>
          <p className="text-sm leading-relaxed text-muted-foreground text-pretty">
            อัปโหลดสไลด์ สรุป หรือโน้ตของคุณให้เพื่อนๆ คณะ IT
            ไฟล์จะแสดงบน{" "}
            <Link
              href={`/profile/${user.studentId}`}
              className="text-primary underline underline-offset-4"
            >
              โปรไฟล์ของคุณ
            </Link>{" "}
            พร้อมเครดิตชื่อคุณ
          </p>
        </header>

        <UploadForm studentId={user.studentId} />
      </main>
    </>
  );
}
