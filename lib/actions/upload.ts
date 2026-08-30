"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { db, resources } from "@/db";
import { COURSES } from "@/lib/catalog";
import { requireUser } from "@/lib/auth/guards";
import type { UploadState } from "@/lib/resources";

const SUBJECT_CODES = COURSES.map((c) => c.code) as [string, ...string[]];

const uploadSchema = z.object({
  subjectCode: z.enum(SUBJECT_CODES, {
    errorMap: () => ({ message: "กรุณาเลือกวิชา" }),
  }),
  title: z.string().trim().min(1, "กรุณาตั้งชื่อไฟล์").max(200),
  type: z.enum(["slide", "summary", "note"], {
    errorMap: () => ({ message: "กรุณาเลือกประเภท" }),
  }),
  // Notes span the whole term, so scope is optional — "" means none.
  scope: z
    .union([z.literal(""), z.enum(["midterm", "final"])])
    .transform((v) => (v === "" ? null : v)),
  storagePath: z.string().trim().min(1),
});

/**
 * Records an already-uploaded file in `ihelp.resources`.
 *
 * The browser uploads to Storage first, where the bucket policy pins the
 * object under the student's own id prefix. This action then re-derives that
 * id from the session and refuses any path outside it, so a forged
 * `storagePath` cannot attribute someone else's file — or a file that does not
 * exist — to them.
 */
export async function createResource(
  _prev: UploadState,
  formData: FormData,
): Promise<UploadState> {
  let user;
  try {
    user = await requireUser();
  } catch {
    return { error: "เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่" };
  }

  const parsed = uploadSchema.safeParse({
    subjectCode: formData.get("subjectCode"),
    title: formData.get("title"),
    type: formData.get("type"),
    scope: formData.get("scope") ?? "",
    storagePath: formData.get("storagePath"),
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0]);
      fieldErrors[key] ??= issue.message;
    }
    if (fieldErrors.storagePath) return { error: "ยังไม่ได้เลือกไฟล์" };
    return { fieldErrors };
  }

  const { storagePath, ...fields } = parsed.data;
  if (!storagePath.startsWith(`${user.studentId}/`)) {
    return { error: "ไฟล์ไม่ถูกต้อง" };
  }

  await db.insert(resources).values({
    ...fields,
    fileUrl: storagePath,
    // From the session, never the form body.
    uploaderId: user.studentId,
  });

  revalidatePath(`/profile/${user.studentId}`);
  return { ok: true };
}
