import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  TOKEN_COOKIE,
  USER_COOKIE,
  REPO_COOKIE,
  type GithubUser,
} from "@/lib/github-server";

// Report the current connection state to the UI (reads cookies only).
export async function GET() {
  const store = await cookies();
  const connected = Boolean(store.get(TOKEN_COOKIE)?.value);

  let user: GithubUser | null = null;
  const rawUser = store.get(USER_COOKIE)?.value;
  if (rawUser) {
    try {
      user = JSON.parse(rawUser);
    } catch {
      user = null;
    }
  }

  let repo: { owner: string; repo: string; branch: string } | null = null;
  const rawRepo = store.get(REPO_COOKIE)?.value;
  if (rawRepo) {
    try {
      const p = JSON.parse(rawRepo);
      if (p?.owner && p?.repo) {
        repo = { owner: p.owner, repo: p.repo, branch: p.branch || "main" };
      }
    } catch {
      repo = null;
    }
  }

  return NextResponse.json({ connected, user, repo });
}
