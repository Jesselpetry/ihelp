"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ProfileFields } from "@/components/account/profile-fields";
import { completeOnboarding } from "@/lib/actions/onboarding";
import type { ProfileFormState } from "@/lib/profile-form";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" className="w-full" disabled={pending}>
      {pending ? <Loader2 className="animate-spin" /> : null}
      เริ่มใช้งาน
    </Button>
  );
}

export function OnboardingForm({
  defaultFirstName,
  defaultLastName,
}: {
  defaultFirstName: string;
  defaultLastName: string;
}) {
  const [state, formAction] = useActionState<ProfileFormState, FormData>(
    completeOnboarding,
    {},
  );

  return (
    <form action={formAction} className="space-y-5">
      {state.error ? (
        <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.error}
        </p>
      ) : null}

      <ProfileFields
        defaults={{
          firstName: defaultFirstName,
          lastName: defaultLastName,
        }}
        errors={state.fieldErrors}
      />

      <SubmitButton />
    </form>
  );
}
