import { NextResponse, type NextRequest } from "next/server";

import { currentStudentId } from "@/lib/auth/guards";
import { buildHubScoreResponse } from "@/lib/scores/hub-builder";
import {
  findHubManifestEntry,
  findHubScoreSheet,
} from "@/lib/scores/registry";
import {
  buildStudentRoster,
  resolveStudentIdentity,
} from "@/lib/scores/roster";

/** Reads the session cookie and private Storage sheets, so never cache publicly. */
export const dynamic = "force-dynamic";

const NO_STORE = { "Cache-Control": "private, no-store" };

/**
 * Course hub score feed for `/courses/[dir]` and `/grades`.
 *
 * - Returns 404 when the course has no hub score sheet.
 * - Returns 401 (courseCode & title only) when visitor is not signed in.
 * - Returns 200 to verified @kmitl.ac.th IT students (`currentStudentId()`).
 *   Pass `?view=all` to include the full class table.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ course: string }> },
) {
  const { course } = await params;
  const entry = await findHubManifestEntry(course);
  if (!entry) {
    return NextResponse.json({ error: "no_course" }, { status: 404 });
  }

  const viewerId = await currentStudentId();
  if (!viewerId) {
    return NextResponse.json(
      {
        error: "unauthenticated",
        courseCode: entry.courseCode,
        title: entry.title,
      },
      { status: 401, headers: NO_STORE },
    );
  }

  const sheet = await findHubScoreSheet(course);
  if (!sheet || !sheet.hub) {
    return NextResponse.json({ error: "no_course" }, { status: 404 });
  }

  const includeAll = request.nextUrl.searchParams.get("view") === "all";
  const roster = includeAll
    ? await buildStudentRoster(
        Array.from(new Set([...Object.keys(sheet.scores), viewerId])),
        sheet.studentNames,
      )
    : new Map([
        [viewerId, await resolveStudentIdentity(viewerId, sheet.studentNames)],
      ]);

  const body = buildHubScoreResponse(sheet, viewerId, includeAll, roster);
  return NextResponse.json(body, { headers: NO_STORE });
}

