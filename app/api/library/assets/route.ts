import { NextResponse, type NextRequest } from "next/server";

import { currentStudentId } from "@/lib/auth/guards";
import { libraryExamsForInsider } from "@/lib/library-exams";
import { assetsForCourse } from "@/lib/subject-library";
import type { SubjectAsset } from "@/lib/subject-library-ui";

/** Reads the session cookie and may return signed URLs, so it must never be cached. */
export const dynamic = "force-dynamic";

export type LibraryAssetsResponse = { assets: SubjectAsset[] };

/**
 * A course's resource library, for signed-in KMITL IT students.
 *
 * The library is not public. Two courses say so in their own summary.md — the
 * Foundation English workbook is Edusoft's and must stay behind a login, and the
 * IT-Fundamentals slides are the lecturer's and may not be published — so the
 * gate is here on the server rather than in the UI. The page that renders this
 * stays statically prerendered and holds no asset data at all; without a valid
 * session there is nothing to read in the HTML, in the RSC payload, or from this
 * route.
 *
 * Past exams are a second tier on top: insiders additionally get them, with
 * short-lived signed URLs, from libraryExamsForInsider().
 */
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("course");
  if (!code) {
    return NextResponse.json({ error: "course required" }, { status: 400 });
  }

  // The same verified-IT-student rule the rest of the app uses: a KMITL campus
  // mailbox whose id carries the IT faculty code. See lib/auth/verify.ts.
  const studentId = await currentStudentId();
  if (!studentId) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }

  const assets = [
    ...(assetsForCourse(code) ?? []),
    ...(await libraryExamsForInsider(code)),
  ];

  const body: LibraryAssetsResponse = { assets };
  return NextResponse.json(body, {
    headers: { "Cache-Control": "private, no-store" },
  });
}
