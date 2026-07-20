import { NextResponse } from "next/server";
import { githubFetch, UnauthenticatedError } from "@/lib/github-server";

// List the connected user's repositories for the repo picker.
export async function GET() {
  try {
    const res = await githubFetch(
      "/user/repos?per_page=100&sort=updated&affiliation=owner,collaborator",
    );
    if (!res.ok) {
      return NextResponse.json(
        { error: `GitHub API error (${res.status})` },
        { status: res.status },
      );
    }
    const repos = (await res.json()) as Array<{
      name: string;
      owner: { login: string };
      default_branch: string;
      private: boolean;
    }>;
    return NextResponse.json({
      repos: repos.map((r) => ({
        owner: r.owner.login,
        repo: r.name,
        branch: r.default_branch,
        private: r.private,
      })),
    });
  } catch (e) {
    if (e instanceof UnauthenticatedError) {
      return NextResponse.json({ error: e.message }, { status: 401 });
    }
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
