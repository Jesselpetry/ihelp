import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import * as itgg from "./itgg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set — see .env.example");
}

/**
 * Supavisor session pooler (port 5432): prepared statements are not shared
 * across pooled sessions, hence `prepare: false`. `max` stays small because
 * every serverless invocation holds its own pool against a database that the
 * itgg-2026 app also uses.
 *
 * Cached on globalThis so dev HMR does not leak a fresh pool per reload.
 */
const globalForDb = globalThis as unknown as {
  __ihelpPg?: ReturnType<typeof postgres>;
};

const client =
  globalForDb.__ihelpPg ??
  postgres(connectionString, { prepare: false, max: 5 });

if (process.env.NODE_ENV !== "production") globalForDb.__ihelpPg = client;

/**
 * SECURITY: this connects as the `postgres` role, which BYPASSES row level
 * security. RLS protects only the PostgREST path (the anon key). Every query
 * through `db` must be preceded by an explicit check — see lib/auth/guards.ts.
 */
export const db = drizzle(client, { schema: { ...schema, ...itgg } });

export * from "./schema";
export { itggStudents, type ItggStudent } from "./itgg";
