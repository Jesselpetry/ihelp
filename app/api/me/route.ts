import { NextResponse } from "next/server";

import { currentStudentId, currentUser } from "@/lib/auth/guards";
import { avatarInitial, resolveAvatarUrl } from "@/lib/avatar";

/** Reads the session cookie, so it must never be cached. */
export const dynamic = "force-dynamic";

export type MeResponse = {
  studentId: string;
  /** Null until the student has finished onboarding. */
  displayName: string | null;
  avatarUrl: string | null;
  initial: string;
  onboarded: boolean;
};

/**
 * The signed-in student's own profile, trimmed to what the navbar badge needs.
 *
 * <Navbar /> renders from many static pages without props, so it cannot be
 * handed this from the server; it fetches instead.
 */
export async function GET() {
  const studentId = await currentStudentId();
  if (!studentId) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }

  const user = await currentUser();
  if (!user) {
    // Signed in and verified, but no profile row yet.
    const body: MeResponse = {
      studentId,
      displayName: null,
      avatarUrl: null,
      initial: studentId.charAt(0),
      onboarded: false,
    };
    return NextResponse.json(body);
  }

  const body: MeResponse = {
    studentId: user.studentId,
    displayName: user.nickname ?? user.firstName ?? user.studentId,
    avatarUrl: resolveAvatarUrl(user),
    initial: avatarInitial(user),
    onboarded: true,
  };
  return NextResponse.json(body);
}
