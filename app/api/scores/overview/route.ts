import { NextResponse } from "next/server";

import { currentStudentId } from "@/lib/auth/guards";
import { buildHubScoreResponse } from "@/lib/scores/hub-builder";
import {
  listHubScoreCatalog,
  listHubScoreSheets,
} from "@/lib/scores/registry";
import { resolveStudentIdentity } from "@/lib/scores/roster";
import type { GradesOverviewResponse } from "@/lib/scores/types";

/** Reads the session cookie and private Storage sheets, so never cache publicly. */
export const dynamic = "force-dynamic";

const NO_STORE = { "Cache-Control": "private, no-store" };

/**
 * Multi-course score overview for `/grades`.
 *
 * - Checks course catalog manifest (zero student data) first when signed out.
 * - Returns 404 when no hub sheets are configured yet.
 * - Returns 401 (with course metadata only) when signed out.
 * - Returns 200 with personal score breakdowns across every `hub: true` sheet
 *   for verified @kmitl.ac.th IT students.
 */
export async function GET() {
  const viewerId = await currentStudentId();

  if (!viewerId) {
    const catalog = await listHubScoreCatalog();
    if (catalog.length === 0) {
      return NextResponse.json({ error: "no_sheets" }, { status: 404 });
    }
    return NextResponse.json(
      {
        error: "unauthenticated",
        availableCourses: catalog.map((c) => ({
          courseCode: c.courseCode,
          title: c.title,
        })),
      },
      { status: 401, headers: NO_STORE },
    );
  }

  const sheets = await listHubScoreSheets();
  const sheetNamesMerged: Record<string, string> = {};
  for (const sheet of sheets) {
    if (sheet.studentNames?.[viewerId]) {
      sheetNamesMerged[viewerId] = sheet.studentNames[viewerId];
    }
  }

  const viewerIdentity = await resolveStudentIdentity(
    viewerId,
    sheetNamesMerged,
  );
  const roster = new Map([[viewerId, viewerIdentity]]);

  const courses = sheets.map((sheet) =>
    buildHubScoreResponse(sheet, viewerId, false, roster),
  );

  const body: GradesOverviewResponse = {
    viewerId,
    viewerFullName: viewerIdentity.fullName,
    viewerNickname: viewerIdentity.nickname,
    courses,
  };

  return NextResponse.json(body, { headers: NO_STORE });
}

