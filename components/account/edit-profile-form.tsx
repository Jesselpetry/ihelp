"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { CheckCircle2, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ProfileFields } from "@/components/account/profile-fields";
import { updateProfile } from "@/lib/actions/profile";
import type { ProfileFieldDefaults, ProfileFormState } from "@/lib/profile-form";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? <Loader2 className="animate-spin" /> : null}
      บันทึก
    </Button>
  );
}

export function EditProfileForm({
  defaults,
  studentId,
}: {
  defaults: ProfileFieldDefaults;
  studentId: string;
}) {
  const [state, formAction] = useActionState<ProfileFormState, FormData>(
    updateProfile,
    {},
  );

  return (
    <form action={formAction} className="space-y-5">
      {state.ok ? (
        <p className="flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-2 text-sm text-primary">
          <CheckCircle2 className="size-4" />
          บันทึกเรียบร้อยแล้ว
        </p>
      ) : null}

      {state.error ? (
        <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.error}
        </p>
      ) : null}

      <ProfileFields defaults={defaults} errors={state.fieldErrors} />

      <div className="flex items-center gap-2">
        <SubmitButton />
        <Button asChild variant="ghost">
          <Link href={`/profile/${studentId}`}>กลับไปหน้าโปรไฟล์</Link>
        </Button>
      </div>
    </form>
  );
}
