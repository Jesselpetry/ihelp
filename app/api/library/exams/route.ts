import { NextResponse, type NextRequest } from "next/server";

import { libraryExamsForInsider } from "@/lib/library-exams";
import type { SubjectAsset } from "@/lib/subject-library-ui";

/** Reads the session cookie and returns signed URLs, so it must never be cached. */
export const dynamic = "force-dynamic";

export type LibraryExamsResponse = { assets: SubjectAsset[] };

/**
 * A course's past exams, for insiders only.
 *
 * Split out of the page because /courses/[dir]/library is statically
 * prerendered: exam titles and filenames must not be in that HTML, and a signed
 * URL could not be baked into it anyway — it expires. The gallery asks for them
 * after it mounts, and gets an empty list for everyone who is not an insider.
 *
 * libraryExamsForInsider() does the authorization. Returning [] rather than 403
 * for a signed-out reader is deliberate: whether a course has exams on file is
 * itself not worth disclosing.
 */
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("course");
  if (!code) {
    return NextResponse.json({ error: "course required" }, { status: 400 });
  }

  const assets = await libraryExamsForInsider(code);
  const body: LibraryExamsResponse = { assets };
  return NextResponse.json(body, {
    // Signed URLs are per-reader and expire; no shared cache may hold them.
    headers: { "Cache-Control": "private, no-store" },
  });
}
