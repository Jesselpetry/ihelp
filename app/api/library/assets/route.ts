import { NextResponse, type NextRequest } from "next/server";

import { scheduleForCourse } from "@/lib/library/course-weeks";
import { libraryExamsForCourse } from "@/lib/library/library-exams";
import { assetsForCourse } from "@/lib/library/subject-library";
import type { CourseSchedule, SubjectAsset } from "@/lib/library/subject-library-ui";

/** Reads the session cookie and may return signed URLs, so it must never be cached. */
export const dynamic = "force-dynamic";

export type LibraryAssetsResponse = { assets: SubjectAsset[]; schedule?: CourseSchedule };

/**
 * A course's resource library assets, including public materials and signed exam assets.
 */
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("course");
  if (!code) {
    return NextResponse.json({ error: "course required" }, { status: 400 });
  }

  const [courseAssets, examAssets] = await Promise.all([
    assetsForCourse(code) ?? [],
    libraryExamsForCourse(code),
  ]);

  const assets = [...courseAssets, ...examAssets];

  const body: LibraryAssetsResponse = { assets, schedule: scheduleForCourse(code) };
  return NextResponse.json(body, {
    headers: { "Cache-Control": "private, no-store" },
  });
}
