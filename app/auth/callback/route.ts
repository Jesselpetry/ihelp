import { NextResponse, type NextRequest } from "next/server";
import { eq } from "drizzle-orm";

import { db, users } from "@/db";
import { createClient } from "@/lib/supabase/server";
import { verifyKmitlIt } from "@/lib/auth/verify";

/**
 * Supabase OAuth callback for Google sign-in.
 *
 * Exchanges the code for a session, then enforces the KMITL-IT gate before the
 * session is allowed to survive: wrong domain, malformed id, or a non-IT
 * faculty code all sign the user straight back out.
 *
 * A verified student with an `ihelp.users` row lands on the dashboard; one
 * without goes to /onboarding to create it.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  const deny = (reason: string) =>
    NextResponse.redirect(`${origin}/auth/unauthorized?reason=${reason}`);

  if (!code) return deny("missing_code");

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) return deny("exchange_failed");

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const verified = verifyKmitlIt(user?.email);
  if (!verified.ok || !user) {
    // Kill the session before bouncing — an unverified account must not walk
    // away holding cookies.
    await supabase.auth.signOut();
    return deny(verified.ok ? "exchange_failed" : verified.reason);
  }

  const { studentId } = verified;

  const existing = await db.query.users.findFirst({
    where: eq(users.studentId, studentId),
    columns: { studentId: true, authUserId: true },
  });

  // Google exposes the account picture as `avatar_url` (and `picture` on some
  // identity shapes). Profile pages are public, so it has to be stored rather
  // than read from the session at render time.
  const googleAvatarUrl =
    (user.user_metadata?.avatar_url as string | undefined) ??
    (user.user_metadata?.picture as string | undefined) ??
    null;

  // Behind Vercel, honour the forwarded host so the redirect keeps the domain
  // the user actually typed.
  const forwardedHost = request.headers.get("x-forwarded-host");
  const base =
    process.env.NODE_ENV === "development"
      ? origin
      : forwardedHost
        ? `https://${forwardedHost}`
        : origin;

  if (!existing) {
    return NextResponse.redirect(`${base}/onboarding`);
  }

  // `auth.users` is shared with the itgg-2026 app, so a row may have been
  // seeded (or created from an ITGG-first sign-in) before it ever had an
  // identity attached here. Claim it, keep the email in step, and refresh the
  // Google picture in case they changed it.
  await db
    .update(users)
    .set({ authUserId: user.id, email: user.email!, googleAvatarUrl })
    .where(eq(users.studentId, studentId));

  // Never bounce a returning student back into onboarding they already did.
  const destination = next.startsWith("/onboarding") ? "/" : next;
  return NextResponse.redirect(`${base}${destination}`);
}
