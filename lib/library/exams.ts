import "server-only";

import { desc } from "drizzle-orm";

import { db, exams, type Exam } from "@/db";
import { requireInsider } from "@/lib/auth/guards";
import { BUCKETS } from "@/lib/storage/buckets";
import { signObjectUrls } from "@/lib/storage/signed-url";

export const EXAM_BUCKET = BUCKETS.exams;

export type ExamWithUrl = Exam & { signedUrl: string | null };

/**
 * Past exams with short-lived signed URLs.
 *
 * requireInsider() is the actual access control: Drizzle connects as the
 * `postgres` role and bypasses the RLS policy on ihelp.exams, and the service
 * role client behind signObjectUrls() bypasses the storage policy too. Both are
 * reached only after the role check throws for everyone else.
 */
export async function listExamsForInsider(): Promise<ExamWithUrl[]> {
  await requireInsider();

  const rows = await db
    .select()
    .from(exams)
    .orderBy(desc(exams.examYear), desc(exams.createdAt));

  if (rows.length === 0) return [];

  const byPath = await signObjectUrls("exams", rows.map((r) => r.fileUrl));

  return rows.map((row) => ({
    ...row,
    signedUrl: byPath.get(row.fileUrl) ?? null,
  }));
}
