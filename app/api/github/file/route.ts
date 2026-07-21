import { NextResponse } from "next/server";
import { githubFetch, UnauthenticatedError } from "@/lib/github-server";

// Read a single file's content (base64-decoded) + its blob sha, for editing.
export async function GET(req: Request) {
  const url = new URL(req.url);
  const owner = url.searchParams.get("owner");
  const repo = url.searchParams.get("repo");
  const branch = url.searchParams.get("branch");
  const path = url.searchParams.get("path");
  if (!owner || !repo || !branch || !path) {
    return NextResponse.json({ error: "missing owner/repo/branch/path" }, { status: 400 });
  }
  try {
    const res = await githubFetch(
      `/repos/${owner}/${repo}/contents/${encodeURIComponent(path).replace(/%2F/g, "/")}?ref=${encodeURIComponent(branch)}`,
    );
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return NextResponse.json(
        { error: data.message || `GitHub API error (${res.status})` },
        { status: res.status },
      );
    }
    const data = (await res.json()) as {
      sha: string;
      size: number;
      content?: string;
      encoding?: string;
      download_url?: string;
      type: string;
    };
    if (data.type !== "file") {
      return NextResponse.json({ error: "not a file" }, { status: 400 });
    }

    const buf = data.content && data.encoding === "base64"
      ? Buffer.from(data.content, "base64")
      : Buffer.from("");
    // Binary heuristic: a NUL byte never appears in UTF-8 text.
    const isBinary = buf.includes(0);

    return NextResponse.json({
      path,
      sha: data.sha,
      size: data.size,
      isBinary,
      content: isBinary ? null : buf.toString("utf-8"),
      download_url: data.download_url ?? null,
    });
  } catch (e) {
    if (e instanceof UnauthenticatedError) {
      return NextResponse.json({ error: e.message }, { status: 401 });
    }
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
