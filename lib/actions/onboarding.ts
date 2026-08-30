"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { db, users } from "@/db";
import { MAJOR_KEYS } from "@/lib/majors";
import { getSessionUser } from "@/lib/supabase/server";
import { verifyKmitlIt } from "@/lib/auth/verify";
import type { ProfileFormState } from "@/lib/profile-form";

/** An empty optional URL field arrives as "" — treat it as absent. */
const optionalUrl = z
  .union([z.literal(""), z.string().trim().url("ลิงก์ไม่ถูกต้อง")])
  .transform((v) => (v === "" ? null : v))
  .nullable();

const onboardingSchema = z.object({
  firstName: z.string().trim().min(1, "กรุณากรอกชื่อ").max(100),
  lastName: z.string().trim().min(1, "กรุณากรอกนามสกุล").max(100),
  nickname: z.string().trim().min(1, "กรุณากรอกชื่อเล่น").max(50),
  major: z.enum(MAJOR_KEYS as unknown as [string, ...string[]], {
    errorMap: () => ({ message: "กรุณาเลือกสาขา" }),
  }),
  facebookUrl: optionalUrl,
  igUrl: optionalUrl,
});

export async function completeOnboarding(
  _prev: ProfileFormState,
  formData: FormData,
): Promise<ProfileFormState> {
  const user = await getSessionUser();

  // Re-run the gate rather than trusting that the callback did: a session can
  // outlive a change to the rules, and the check costs nothing.
  const verified = verifyKmitlIt(user?.email);
  if (!user || !verified.ok) {
    return { error: "เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่" };
  }

  const parsed = onboardingSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    nickname: formData.get("nickname"),
    major: formData.get("major"),
    facebookUrl: formData.get("facebookUrl") ?? "",
    igUrl: formData.get("igUrl") ?? "",
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0]);
      fieldErrors[key] ??= issue.message;
    }
    return { fieldErrors };
  }

  const profile = {
    ...parsed.data,
    // Never from the form body: identity comes from the verified session only.
    studentId: verified.studentId,
    authUserId: user.id,
    email: user.email!,
    googleAvatarUrl:
      (user.user_metadata?.avatar_url as string | undefined) ??
      (user.user_metadata?.picture as string | undefined) ??
      null,
  };

  await db
    .insert(users)
    .values(profile)
    .onConflictDoUpdate({
      // A row may already exist if it was seeded by an admin. Claim it —
      // `role` is intentionally not in the update set, so a student can never
      // reset a role someone granted them.
      target: users.studentId,
      set: {
        authUserId: profile.authUserId,
        email: profile.email,
        googleAvatarUrl: profile.googleAvatarUrl,
        firstName: profile.firstName,
        lastName: profile.lastName,
        nickname: profile.nickname,
        major: profile.major,
        facebookUrl: profile.facebookUrl,
        igUrl: profile.igUrl,
      },
    });

  redirect("/");
}
