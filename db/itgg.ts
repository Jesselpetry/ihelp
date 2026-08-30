import { pgSchema, text, timestamp } from "drizzle-orm/pg-core";

/**
 * The student roster owned by the neighbouring itgg-2026 app.
 *
 * READ ONLY. Never write here, and never make this file reachable from
 * drizzle.config.ts's `schema` path — drizzle-kit must not manage a table
 * another live app owns.
 *
 * The table has RLS enabled with zero policies, so PostgREST (the Supabase
 * anon key) cannot see it at all. This Drizzle connection uses DATABASE_URL
 * and can. Its only use in iHelp is pre-filling a student's real name during
 * onboarding.
 *
 * `gate` (the ITGG house assignment) is deliberately omitted: it is an
 * ITGG-activity concept with no meaning here.
 */
const itgg = pgSchema("itgg_2026");

export const itggStudents = itgg.table("students", {
  studentId: text("student_id").primaryKey(),
  /** นาย | นางสาว */
  prefix: text("prefix").notNull(),
  frontName: text("front_name").notNull(),
  surName: text("sur_name").notNull(),
  gender: text("gender").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
});

export type ItggStudent = typeof itggStudents.$inferSelect;
