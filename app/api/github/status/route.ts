import { NextResponse } from "next/server";
import { githubFetch, UnauthenticatedError } from "@/lib/github-server";

// Which problems already have files pushed to the linked repo. Reads the repo
// tree once and reports, per problem id, whether oj<id>/submission.md and
// oj<id>/ai_reflection.md exist. Drives the "already uploaded" indicators.
export interface RepoStatus {
  [problemId: string]: {
    submission: boolean;
    reflection: boolean;
    recommended?: {
      inRepo: boolean;
      hasProblemMd: boolean;
      hasMainPy: boolean;
      folder?: string;
    };
  };
}

const FILE_RE = /^oj(\d+)\/(submission|ai_reflection)\.md$/;
const REC_FILE_RE = /^recommended\/(oj\d+[^\/]*)\/(problem\.md|main\.py|submission\.md|ai_reflection\.md)$/i;
const REC_ROOT_RE = /^oj(\d+)\/(problem\.md|main\.py)$/i;

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

      // 1. Standard oj<id>/submission.md or oj<id>/ai_reflection.md
      const m1 = node.path.match(FILE_RE);
      if (m1) {
        const id = m1[1];
        status[id] ??= { submission: false, reflection: false };
        if (m1[2] === "submission") status[id].submission = true;
        else status[id].reflection = true;
        continue;
      }

      // 2. recommended/oj<id>-name/problem.md or main.py
      const m2 = node.path.match(REC_FILE_RE);
      if (m2) {
        const folder = m2[1];
        const fileName = m2[2].toLowerCase();
        const idMatch = folder.match(/oj(\d+)/i);
        if (idMatch) {
          const id = idMatch[1];
          status[id] ??= { submission: false, reflection: false };
          status[id].recommended ??= {
            inRepo: true,
            hasProblemMd: false,
            hasMainPy: false,
            folder,
          };
          status[id].recommended.inRepo = true;
          if (fileName === "problem.md") status[id].recommended.hasProblemMd = true;
          if (fileName === "main.py") status[id].recommended.hasMainPy = true;
        }
        continue;
      }

      // 3. oj<id>/problem.md or main.py
      const m3 = node.path.match(REC_ROOT_RE);
      if (m3) {
        const id = m3[1];
        const fileName = m3[2].toLowerCase();
        status[id] ??= { submission: false, reflection: false };
        status[id].recommended ??= {
          inRepo: true,
          hasProblemMd: false,
          hasMainPy: false,
          folder: `oj${id}`,
        };
        status[id].recommended.inRepo = true;
        if (fileName === "problem.md") status[id].recommended.hasProblemMd = true;
        if (fileName === "main.py") status[id].recommended.hasMainPy = true;
      }
    }
    return NextResponse.json({ status });
  } catch (e) {
    if (e instanceof UnauthenticatedError) {
      return NextResponse.json({ error: e.message }, { status: 401 });
    }
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
