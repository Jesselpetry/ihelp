import "server-only";

import { desc } from "drizzle-orm";

import { db, exams, type Exam } from "@/db";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireInsider } from "@/lib/auth/guards";

export const EXAM_BUCKET = "ihelp-exams";

/** Long enough to open the file, short enough not to be worth passing around. */
const SIGNED_URL_TTL_SECONDS = 60 * 10;

export type ExamWithUrl = Exam & { signedUrl: string | null };

/**
 * Past exams with short-lived signed URLs.
 *
 * requireInsider() is the actual access control: Drizzle connects as the
 * `postgres` role and bypasses the RLS policy on ihelp.exams, and the service
 * role client used for signing bypasses the storage policy too. Both are
 * reached only after the role check throws for everyone else.
 */
export async function listExamsForInsider(): Promise<ExamWithUrl[]> {
  await requireInsider();

  const rows = await db
    .select()
    .from(exams)
    .orderBy(desc(exams.examYear), desc(exams.createdAt));

  if (rows.length === 0) return [];

  const storage = createAdminClient().storage.from(EXAM_BUCKET);
  const { data } = await storage.createSignedUrls(
    rows.map((r) => r.fileUrl),
    SIGNED_URL_TTL_SECONDS,
  );

  const byPath = new Map(
    (data ?? []).map((d) => [d.path, d.signedUrl] as const),
  );

  return rows.map((row) => ({
    ...row,
    signedUrl: byPath.get(row.fileUrl) ?? null,
  }));
}
