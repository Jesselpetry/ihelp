import { NextResponse } from "next/server";
import { githubFetch, UnauthenticatedError } from "@/lib/github-server";

// List every file (blob) in the linked repo for the repo-editor file browser.
export async function GET(req: Request) {
  const url = new URL(req.url);
  const owner = url.searchParams.get("owner");
  const repo = url.searchParams.get("repo");
  const branch = url.searchParams.get("branch");
  if (!owner || !repo || !branch) {
    return NextResponse.json({ error: "missing owner/repo/branch" }, { status: 400 });
  }
  try {
    const res = await githubFetch(
      `/repos/${owner}/${repo}/git/trees/${encodeURIComponent(branch)}?recursive=1`,
    );
    if (res.status === 404 || res.status === 409) {
      return NextResponse.json({ files: [] });
    }
    if (!res.ok) {
      return NextResponse.json(
        { error: `GitHub API error (${res.status})` },
        { status: res.status },
      );
    }
    const data = (await res.json()) as {
      tree?: Array<{ path: string; type: string; size?: number }>;
    };
    const files = (data.tree ?? [])
      .filter((n) => n.type === "blob")
      .map((n) => ({ path: n.path, size: n.size ?? 0 }));
    return NextResponse.json({ files });
  } catch (e) {
    if (e instanceof UnauthenticatedError) {
      return NextResponse.json({ error: e.message }, { status: 401 });
    }
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
