import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

// Next loads .env.local automatically; drizzle-kit only loads .env, so point
// it at the same file the app uses.
config({ path: ".env.local" });

export default defineConfig({
  schema: "./db/schema.ts",
  out: "./db/migrations",
  dialect: "postgresql",
  // This database is SHARED with the itgg-2026 app, which owns the `itgg_2026`
  // schema. Without this filter drizzle-kit diffs `public` and can propose
  // changes that touch a live neighbouring app. Never remove it — and note
  // that db/itgg.ts is deliberately NOT reachable from `schema` above, so the
  // roster table we read stays outside drizzle-kit's control.
  schemaFilter: ["ihelp"],
  dbCredentials: { url: process.env.DATABASE_URL! },
  verbose: true,
  strict: true,
});
