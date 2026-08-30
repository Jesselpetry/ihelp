import "server-only";

import { createHash } from "node:crypto";
import { sql } from "drizzle-orm";

import { db, siteVisits } from "@/db";

/** The site is for one Thai campus, so "today" means a Bangkok day, not UTC. */
export const SITE_TIMEZONE = "Asia/Bangkok";

export type SiteStats = {
  today: number;
  week: number;
  allTime: number;
};

/** Today in Asia/Bangkok as YYYY-MM-DD (en-CA formats dates that way). */
export function bangkokDay(now: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: SITE_TIMEZONE,
  }).format(now);
}

/**
 * A per-day pseudonym for one visitor.
 *
 * The day is part of the input, so the same person hashes differently
 * tomorrow: the value can spot a repeat visit within a day and cannot be used
 * to follow anyone across days. The IP itself is never stored.
 *
 * ANALYTICS_SALT is what stops the hash being reversible - the IPv4 space is
 * small enough to brute force without it - so a missing salt is a hard error
 * rather than a silent downgrade.
 */
export function visitorHash(
  ip: string,
  userAgent: string,
  day: string,
): string {
  const salt = process.env.ANALYTICS_SALT;
  if (!salt) throw new Error("ANALYTICS_SALT is not set - see .env.example");

  return createHash("sha256")
    .update(`${salt} ${day} ${ip} ${userAgent}`)
    .digest("hex");
}

/**
 * Counts one visit. Idempotent per visitor per day for the headline numbers:
 * (day, visitor_hash) is the primary key, so a repeat visit bumps `hits`
 * without adding a row.
 */
export async function recordVisit(ip: string, userAgent: string) {
  const day = bangkokDay();

  await db
    .insert(siteVisits)
    .values({ day, visitorHash: visitorHash(ip, userAgent, day) })
    .onConflictDoUpdate({
      target: [siteVisits.day, siteVisits.visitorHash],
      set: { hits: sql`${siteVisits.hits} + 1`, lastSeenAt: new Date() },
    });
}

/**
 * All three figures are visitor-days: one visitor counted once per day they
 * show up. So "today" is unique visitors today, and the wider windows are the
 * sum of those daily uniques - the metric Plausible and friends call "visits".
 *
 * Using one metric for all three keeps the footer honest. True all-time unique
 * *people* is not knowable from a hash that rotates daily, which is the trade
 * made for not tracking anyone across days.
 */
export async function getSiteStats(): Promise<SiteStats> {
  const day = bangkokDay();

  const rows = await db.execute<{
    today: number;
    week: number;
    all_time: number;
  }>(sql`
    select
      count(*) filter (where day = ${day}::date)::int      as today,
      count(*) filter (where day > ${day}::date - 7)::int  as week,
      count(*)::int                                        as all_time
    from ihelp.site_visits
  `);

  const row = rows[0];
  return {
    today: row?.today ?? 0,
    week: row?.week ?? 0,
    allTime: row?.all_time ?? 0,
  };
}
