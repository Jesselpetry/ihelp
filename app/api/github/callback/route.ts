import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  TOKEN_COOKIE,
  USER_COOKIE,
  STATE_COOKIE,
  RETURN_COOKIE,
  clientId,
  clientSecret,
  appBaseUrl,
  type GithubUser,
} from "@/lib/github-server";

// OAuth callback: verify state, exchange the code for an access token, keep the
// token in an httpOnly cookie and a readable identity cookie for the UI, then
// send the student back to the home page.
export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const home = new URL("/", appBaseUrl(req));

  const store = await cookies();
  const expected = store.get(STATE_COOKIE)?.value;

  const fail = (reason: string) => {
    home.searchParams.set("github", reason);
    return NextResponse.redirect(home);
  };

  if (!code || !state || !expected || state !== expected) {
    return fail("error");
  }

  try {
    const tokenRes = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          client_id: clientId(),
          client_secret: clientSecret(),
          code,
          redirect_uri: `${appBaseUrl(req)}/api/github/callback`,
        }),
      },
    );
    const tokenJson = await tokenRes.json();
    const token: string | undefined = tokenJson.access_token;
    if (!token) return fail("error");

    // Fetch the login/avatar to show a connected identity in the UI.
    const userRes = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });
    const userJson = await userRes.json();
    const user: GithubUser = {
      login: userJson.login ?? "",
      avatar: userJson.avatar_url ?? "",
    };

    // Return to where the user started the flow, if it was recorded.
    const ret = store.get(RETURN_COOKIE)?.value;
    const dest =
      ret && ret.startsWith("/") && !ret.startsWith("//")
        ? new URL(ret, appBaseUrl(req))
        : home;
    dest.searchParams.set("github", "connected");
    const res = NextResponse.redirect(dest);
    res.cookies.delete(RETURN_COOKIE);
    res.cookies.set(TOKEN_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
    res.cookies.set(USER_COOKIE, JSON.stringify(user), {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
    res.cookies.delete(STATE_COOKIE);
    return res;
  } catch {
    return fail("error");
  }
}
