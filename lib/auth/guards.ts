import "server-only";

import { cache } from "react";
import { eq } from "drizzle-orm";

import { db, users, type User } from "@/db";
import { getSessionUser } from "@/lib/supabase/server";
import { verifyKmitlIt } from "@/lib/auth/verify";

/**
 * Authorization for the Drizzle path.
 *
 * Drizzle connects as the `postgres` role and therefore BYPASSES row level
 * security. The RLS policies on `ihelp.*` only guard PostgREST (the anon key).
 * These helpers are the real control: every server read or write of restricted
 * data must go through one of them.
 */

export class UnauthorizedError extends Error {
  constructor(message = "Not signed in") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends Error {
  constructor(message = "Insufficient role") {
    super(message);
    this.name = "ForbiddenError";
  }
}

/**
 * The signed-in student's verified id, or null. Re-runs the KMITL-IT gate
 * rather than trusting that the callback did — a session could predate a
 * change to the rules, and the check is free.
 */
export const currentStudentId = cache(async (): Promise<string | null> => {
  const user = await getSessionUser();
  const verified = verifyKmitlIt(user?.email);
  return verified.ok ? verified.studentId : null;
});

/** The signed-in student's `ihelp.users` row, or null if they never onboarded. */
export const currentUser = cache(async (): Promise<User | null> => {
  const studentId = await currentStudentId();
  if (!studentId) return null;
  return (
    (await db.query.users.findFirst({
      where: eq(users.studentId, studentId),
    })) ?? null
  );
});

/** Throws unless a verified IT student is signed in. Returns their id. */
export async function requireStudentId(): Promise<string> {
  const studentId = await currentStudentId();
  if (!studentId) throw new UnauthorizedError();
  return studentId;
}

/** Throws unless the signed-in student has completed onboarding. */
export async function requireUser(): Promise<User> {
  const user = await currentUser();
  if (!user) throw new UnauthorizedError("No iHelp profile — onboarding needed");
  return user;
}

/**
 * Throws unless the signed-in student is an insider or admin. This is the only
 * thing standing between a student and the past-exam archive on the Drizzle
 * path — call it before every `ihelp.exams` query.
 */
export async function requireInsider(): Promise<User> {
  const user = await requireUser();
  if (user.role !== "insider" && user.role !== "admin") {
    throw new ForbiddenError("Insider or admin role required");
  }
  return user;
}

export async function isInsider(): Promise<boolean> {
  const user = await currentUser();
  return user?.role === "insider" || user?.role === "admin";
}
