import { NextResponse } from "next/server";
import { githubFetch, UnauthenticatedError } from "@/lib/github-server";

// Generic Contents API commit for the repo editor. The client already holds the
// blob `sha` (from /api/github/file) when updating; new files send no sha.
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const owner: string = body.owner;
    const repo: string = body.repo;
    const branch: string = body.branch;
    const path: string = (body.path ?? "").trim();
    const content: string = body.content ?? "";
    const message: string | undefined = body.message;
    const sha: string | undefined = body.sha || undefined;

    if (!owner || !repo || !branch) {
      return NextResponse.json({ error: "missing owner/repo/branch" }, { status: 400 });
    }
    // Guard against path traversal / absolute paths.
    if (!path || path.startsWith("/") || path.split("/").some((seg) => seg === "..")) {
      return NextResponse.json({ error: "invalid path" }, { status: 400 });
    }

    const contentsUrl = `/repos/${owner}/${repo}/contents/${encodeURIComponent(path).replace(/%2F/g, "/")}`;
    const put = await githubFetch(contentsUrl, {
      method: "PUT",
      body: JSON.stringify({
        message: message || `${sha ? "Update" : "Add"} ${path}`,
        content: Buffer.from(content, "utf-8").toString("base64"),
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
      sha: result.content?.sha ?? null,
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
