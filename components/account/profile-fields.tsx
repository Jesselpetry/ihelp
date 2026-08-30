"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MAJORS } from "@/lib/majors";
import type { ProfileFieldDefaults } from "@/lib/profile-form";

function Field({
  id,
  label,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error ? (
        <p className="text-xs text-destructive">{error}</p>
      ) : hint ? (
        <p className="text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}

/**
 * The six profile fields, shared by onboarding and the edit page so the two
 * cannot drift apart. Both submit to actions validated by the same shape.
 */
export function ProfileFields({
  defaults = {},
  errors = {},
}: {
  defaults?: ProfileFieldDefaults;
  errors?: Record<string, string>;
}) {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="firstName" label="ชื่อจริง" error={errors.firstName}>
          <Input
            id="firstName"
            name="firstName"
            defaultValue={defaults.firstName ?? ""}
            autoComplete="given-name"
            required
          />
        </Field>
        <Field id="lastName" label="นามสกุล" error={errors.lastName}>
          <Input
            id="lastName"
            name="lastName"
            defaultValue={defaults.lastName ?? ""}
            autoComplete="family-name"
            required
          />
        </Field>
      </div>

      <Field id="nickname" label="ชื่อเล่น" error={errors.nickname}>
        <Input
          id="nickname"
          name="nickname"
          defaultValue={defaults.nickname ?? ""}
          maxLength={50}
          required
        />
      </Field>

      <Field id="major" label="สาขา" error={errors.major}>
        <Select name="major" defaultValue={defaults.major ?? undefined} required>
          <SelectTrigger id="major" className="w-full">
            <SelectValue placeholder="เลือกสาขาของคุณ" />
          </SelectTrigger>
          <SelectContent>
            {MAJORS.map((m) => (
              <SelectItem key={m.key} value={m.key}>
                {m.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <Field
        id="facebookUrl"
        label="Facebook"
        hint="ไม่บังคับ - แสดงบนโปรไฟล์สาธารณะของคุณ"
        error={errors.facebookUrl}
      >
        <Input
          id="facebookUrl"
          name="facebookUrl"
          type="url"
          inputMode="url"
          defaultValue={defaults.facebookUrl ?? ""}
          placeholder="https://facebook.com/..."
        />
      </Field>

      <Field id="igUrl" label="Instagram" hint="ไม่บังคับ" error={errors.igUrl}>
        <Input
          id="igUrl"
          name="igUrl"
          type="url"
          inputMode="url"
          defaultValue={defaults.igUrl ?? ""}
          placeholder="https://instagram.com/..."
        />
      </Field>
    </>
  );
}
