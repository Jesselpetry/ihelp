import { NextResponse } from "next/server";
import { githubFetch, UnauthenticatedError } from "@/lib/github-server";

const FILE_NAMES = {
  submission: "submission.md",
  reflection: "ai_reflection.md",
} as const;

type Kind = keyof typeof FILE_NAMES;

// Upsert oj<id>/<file>.md in the linked repo via the Contents API. GitHub needs
// the current blob sha to overwrite an existing file, so we GET-before-PUT to
// update in place (edited re-pushes) instead of getting a 409.
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const owner: string = body.owner;
    const repo: string = body.repo;
    const branch: string = body.branch;
    const problemId: string = String(body.problemId ?? "");
    const kind: Kind = body.kind;
    const markdown: string = body.markdown ?? "";
    const message: string | undefined = body.message;

    if (!owner || !repo || !branch) {
      return NextResponse.json({ error: "missing owner/repo/branch" }, { status: 400 });
    }
    if (!/^\d+$/.test(problemId)) {
      return NextResponse.json(
        { error: "This entry has no OJ problem id and cannot be pushed" },
        { status: 400 },
      );
    }
    const fileName = FILE_NAMES[kind];
    if (!fileName) {
      return NextResponse.json({ error: "invalid kind" }, { status: 400 });
    }

    const path = `oj${problemId}/${fileName}`;
    const contentsUrl = `/repos/${owner}/${repo}/contents/${encodeURIComponent(path).replace(/%2F/g, "/")}`;

    // Look up the existing file sha (404 => new file).
    const existing = await githubFetch(
      `${contentsUrl}?ref=${encodeURIComponent(branch)}`,
    );
    let sha: string | undefined;
    if (existing.ok) {
      const json = await existing.json();
      sha = json.sha;
    } else if (existing.status !== 404) {
      return NextResponse.json(
        { error: `GitHub API error (${existing.status})` },
        { status: existing.status },
      );
    }

    const put = await githubFetch(contentsUrl, {
      method: "PUT",
      body: JSON.stringify({
        message: message || `${sha ? "Update" : "Add"} ${path}`,
        content: Buffer.from(markdown, "utf-8").toString("base64"),
        branch,
        ...(sha ? { sha } : {}),
      }),
    });
    const result = await put.json();
    if (!put.ok) {
      return NextResponse.json(
        { error: result.message || `GitHub API error (${put.status})` },
        { status: put.status },
      );
    }
    return NextResponse.json({
      path,
      html_url: result.content?.html_url ?? null,
      commit: result.commit?.sha ?? null,
    });
  } catch (e) {
    if (e instanceof UnauthenticatedError) {
      return NextResponse.json({ error: e.message }, { status: 401 });
    }
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
