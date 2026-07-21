import { NextResponse } from "next/server";
import { REPO_COOKIE } from "@/lib/github-server";

// Persist the selected destination repo as part of the session (a cookie), so
// it survives reloads and is available to the server. POST sets it, DELETE
// clears it.
export async function POST(req: Request) {
  try {
    const { owner, repo, branch } = await req.json();
    if (!owner || !repo || !branch) {
      return NextResponse.json({ error: "missing owner/repo/branch" }, { status: 400 });
    }
    const res = NextResponse.json({ ok: true });
    res.cookies.set(REPO_COOKIE, JSON.stringify({ owner, repo, branch }), {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days, matches the token cookie
    });
    return res;
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(REPO_COOKIE);
  return res;
}
