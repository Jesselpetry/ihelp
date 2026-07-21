import { NextResponse } from "next/server";
import { TOKEN_COOKIE, USER_COOKIE, REPO_COOKIE } from "@/lib/github-server";

// Disconnect: clear the token, identity, and linked-repo cookies.
export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(TOKEN_COOKIE);
  res.cookies.delete(USER_COOKIE);
  res.cookies.delete(REPO_COOKIE);
  return res;
}
