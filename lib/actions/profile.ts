"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { db, users } from "@/db";
import { requireUser } from "@/lib/auth/guards";
import { MAJOR_KEYS } from "@/lib/majors";
import { createClient } from "@/lib/supabase/server";
import { AVATAR_BUCKET } from "@/lib/avatar";
import type { ProfileFormState } from "@/lib/profile-form";

/** An empty optional URL field arrives as "" - treat it as absent. */
const optionalUrl = z
  .union([z.literal(""), z.string().trim().url("ลิงก์ไม่ถูกต้อง")])
  .transform((v) => (v === "" ? null : v))
  .nullable();

const profileSchema = z.object({
  firstName: z.string().trim().min(1, "กรุณากรอกชื่อ").max(100),
  lastName: z.string().trim().min(1, "กรุณากรอกนามสกุล").max(100),
  nickname: z.string().trim().min(1, "กรุณากรอกชื่อเล่น").max(50),
  major: z.enum(MAJOR_KEYS as unknown as [string, ...string[]], {
    errorMap: () => ({ message: "กรุณาเลือกสาขา" }),
  }),
  facebookUrl: optionalUrl,
  igUrl: optionalUrl,
});

/** Edits the signed-in student's own profile. There is no way to edit another. */
export async function updateProfile(
  _prev: ProfileFormState,
  formData: FormData,
): Promise<ProfileFormState> {
  let user;
  try {
    user = await requireUser();
  } catch {
    return { error: "เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่" };
  }

  const parsed = profileSchema.safeParse({
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

  // `role`, `studentId` and `googleAvatarUrl` are not in this set on purpose.
  await db
    .update(users)
    .set(parsed.data)
    .where(eq(users.studentId, user.studentId));

  revalidatePath(`/profile/${user.studentId}`);
  return { ok: true };
}

/**
 * Points the profile at a freshly uploaded avatar.
 *
 * The browser uploads to Storage first, where the bucket policy pins the
 * object under the student's own id prefix. This re-derives that id from the
 * session and refuses anything outside it, so a forged path cannot claim
 * another student's file.
 */
export async function setAvatar(
  objectPath: string,
): Promise<{ ok: true } | { error: string }> {
  let user;
  try {
    user = await requireUser();
  } catch {
    return { error: "เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่" };
  }

  if (!objectPath.startsWith(`${user.studentId}/`)) {
    return { error: "ไฟล์ไม่ถูกต้อง" };
  }

  const previous = user.avatarUrl;

  await db
    .update(users)
    .set({ avatarUrl: objectPath })
    .where(eq(users.studentId, user.studentId));

  // Best effort: the old file is now unreachable, so failing to delete it
  // costs storage, not correctness.
  if (previous && previous !== objectPath) {
    const supabase = await createClient();
    await supabase.storage.from(AVATAR_BUCKET).remove([previous]);
  }

  revalidatePath(`/profile/${user.studentId}`);
  return { ok: true };
}

/** Drops the custom picture so the Google account photo shows again. */
export async function resetAvatar(): Promise<
  { ok: true } | { error: string }
> {
  let user;
  try {
    user = await requireUser();
  } catch {
    return { error: "เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่" };
  }

  await db
    .update(users)
    .set({ avatarUrl: null })
    .where(eq(users.studentId, user.studentId));

  if (user.avatarUrl) {
    const supabase = await createClient();
    await supabase.storage.from(AVATAR_BUCKET).remove([user.avatarUrl]);
  }

  revalidatePath(`/profile/${user.studentId}`);
  return { ok: true };
}
