import { NextResponse, type NextRequest } from "next/server";

import { getSiteStats, recordVisit, type SiteStats } from "@/lib/analytics";

/** Counts come from a live table, so nothing here may be cached by the CDN. */
export const dynamic = "force-dynamic";

/**
 * The footer is on every page of a mostly-static site, so an uncached read per
 * page view would be one database round-trip per navigation. A short in-process
 * memo keeps that to roughly one per minute per warm instance; the numbers do
 * not need to be to-the-second.
 */
const STATS_TTL_MS = 60_000;
let cached: { at: number; stats: SiteStats } | null = null;

async function readStats(force = false): Promise<SiteStats> {
  if (!force && cached && Date.now() - cached.at < STATS_TTL_MS) {
    return cached.stats;
  }
  const stats = await getSiteStats();
  cached = { at: Date.now(), stats };
  return stats;
}

/** First proxy hop is the client; the rest of the chain is the proxies. */
function clientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

/** Read-only: the numbers for a visitor already counted this session. */
export async function GET() {
  try {
    return NextResponse.json(await readStats());
  } catch (error) {
    console.error("site stats read failed:", error);
    return NextResponse.json({ error: "unavailable" }, { status: 503 });
  }
}

/** Records the visit, then returns the numbers including it. */
export async function POST(request: NextRequest) {
  try {
    await recordVisit(clientIp(request), request.headers.get("user-agent") ?? "");
    // Skip the memo so the visitor sees their own visit reflected.
    return NextResponse.json(await readStats(true));
  } catch (error) {
    console.error("site visit record failed:", error);
    return NextResponse.json({ error: "unavailable" }, { status: 503 });
  }
}
