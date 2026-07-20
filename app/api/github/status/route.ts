import { NextResponse } from "next/server";
import { githubFetch, UnauthenticatedError } from "@/lib/github-server";

// Which problems already have files pushed to the linked repo. Reads the repo
// tree once and reports, per problem id, whether oj<id>/submission.md and
// oj<id>/ai_reflection.md exist. Drives the "already uploaded" indicators.
export interface RepoStatus {
  [problemId: string]: { submission: boolean; reflection: boolean };
}

const FILE_RE = /^oj(\d+)\/(submission|ai_reflection)\.md$/;

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
    // Empty repo / unknown branch: nothing uploaded yet, not an error for the UI.
    if (res.status === 404 || res.status === 409) {
      return NextResponse.json({ status: {} });
    }
    if (!res.ok) {
      return NextResponse.json(
        { error: `GitHub API error (${res.status})` },
        { status: res.status },
      );
    }
    const data = (await res.json()) as { tree?: Array<{ path: string; type: string }> };
    const status: RepoStatus = {};
    for (const node of data.tree ?? []) {
      if (node.type !== "blob") continue;
      const m = node.path.match(FILE_RE);
      if (!m) continue;
      const id = m[1];
      status[id] ??= { submission: false, reflection: false };
      if (m[2] === "submission") status[id].submission = true;
      else status[id].reflection = true;
    }
    return NextResponse.json({ status });
  } catch (e) {
    if (e instanceof UnauthenticatedError) {
      return NextResponse.json({ error: e.message }, { status: 401 });
    }
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
