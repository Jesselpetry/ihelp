import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";

import { Navbar } from "@/components/navbar";
import { EditProfileForm } from "@/components/account/edit-profile-form";
import { AvatarUploader } from "@/components/account/avatar-uploader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { currentStudentId, currentUser } from "@/lib/auth/guards";
import { avatarInitial, resolveAvatarUrl } from "@/lib/avatar";

export const metadata: Metadata = {
  title: "แก้ไขโปรไฟล์",
  robots: { index: false, follow: false },
};

export default async function EditProfilePage({
  params,
}: {
  params: Promise<{ student_id: string }>;
}) {
  const { student_id } = await params;

  const viewer = await currentStudentId();
  if (!viewer) redirect("/");

  // You can only ever edit your own profile - the URL is not the authority.
  if (viewer !== student_id) notFound();

  const user = await currentUser();
  if (!user) redirect("/onboarding");

  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-lg flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <h1 className="mb-8 text-2xl font-semibold">แก้ไขโปรไฟล์</h1>

        <section className="mb-8 flex items-center gap-4 rounded-lg border p-4">
          <Avatar className="size-16 shrink-0">
            {resolveAvatarUrl(user) ? (
              <AvatarImage src={resolveAvatarUrl(user)!} alt="" />
            ) : null}
            <AvatarFallback className="bg-primary/10 text-xl font-semibold text-primary">
              {avatarInitial(user)}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0">
            <AvatarUploader
              studentId={user.studentId}
              hasCustomAvatar={Boolean(user.avatarUrl)}
              hasGoogleAvatar={Boolean(user.googleAvatarUrl)}
            />
          </div>
        </section>

        <EditProfileForm
          studentId={user.studentId}
          defaults={{
            firstName: user.firstName,
            lastName: user.lastName,
            nickname: user.nickname,
            major: user.major,
            facebookUrl: user.facebookUrl,
            igUrl: user.igUrl,
          }}
        />
      </main>
    </>
  );
}
