import { NextResponse } from "next/server";
import {
  STATE_COOKIE,
  OAUTH_SCOPE,
  clientId,
  appBaseUrl,
} from "@/lib/github-server";

// Kick off the OAuth web flow: store a random CSRF state in a short-lived
// httpOnly cookie and redirect to GitHub's consent screen.
export async function GET(req: Request) {
  let authorizeUrl: URL;
  try {
    const state = crypto.randomUUID();
    authorizeUrl = new URL("https://github.com/login/oauth/authorize");
    authorizeUrl.searchParams.set("client_id", clientId());
    authorizeUrl.searchParams.set("scope", OAUTH_SCOPE);
    authorizeUrl.searchParams.set(
      "redirect_uri",
      `${appBaseUrl(req)}/api/github/callback`,
    );
    authorizeUrl.searchParams.set("state", state);

    const res = NextResponse.redirect(authorizeUrl);
    res.cookies.set(STATE_COOKIE, state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 600, // 10 minutes to complete the flow
    });
    return res;
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
