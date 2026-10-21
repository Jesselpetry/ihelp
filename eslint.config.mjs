import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

// ── Import boundaries ────────────────────────────────────────────────────────
// lib/README.md rules 2–3, enforced instead of remembered. None of these breaks
// anything on a developer's machine; each costs something only in production: a
// Client Component that imports the library data ships every card, past papers
// included, to the browser, and a second importer of the service-role client is
// a second place that can sign URLs without asking who is calling.
//
// Type-only imports stay allowed everywhere (allowTypeImports): they are erased
// at compile time, so they cannot pull a module into a bundle. Three client
// components import types from course-content that way.

/**
 * A pattern for modules, written as the tail of their paths so it matches the
 * specifier however it is spelled: "@/lib/x/y", "../lib/x/y", "../../lib/x/y".
 * The "$" keeps ".../subject-library" from also catching its client-safe sibling
 * ".../subject-library-ui"; the optional extension covers an explicit ".../y.ts".
 *
 * Start the tail at "lib/" only for rules that apply outside lib/. From inside
 * lib/ the "lib/" segment is gone ("../x/y", "./x/y"), so a rule that must hold
 * there starts below it.
 */
const modulePattern = (...tails) => `(?:^|/)(?:${tails.join("|")})(?:\\.[cm]?[jt]sx?)?$`;

/** What a component may not import: modules that read the file system or hold the whole library. */
const SERVER_DATA = {
  regex: modulePattern(
    "lib/library/subject-library",
    "lib/library/course-weeks",
    "lib/courses/course-spine",
    "lib/courses/course-content",
    "lib/courses/course-bindings",
  ),
  allowTypeImports: true,
  message:
    "Data reaches components as props from the app/ routes. This module reads the file system or " +
    "pulls the whole library (past papers included) into the browser bundle — see lib/README.md " +
    "rules 2–3. Take what you need as a prop; for types and display constants use " +
    "lib/library/subject-library-ui.ts, or `import type`.",
};

/** The generated index lists every card, past papers included; it is for scripts and agents. */
const RESOURCE_INDEX = {
  regex: "(?:^|/)resource-index\\.json$",
  allowTypeImports: true,
  message:
    "resource-index.json lists every library card, past papers included (~1 MB). It is for scripts " +
    "and agents — `bun run library:find`, `jq` — never for code in app/, components/ or lib/ " +
    "(lib/README.md rule 2).",
};

/** The service-role client bypasses RLS, so it has exactly one door. */
const SERVICE_ROLE = {
  regex: modulePattern("supabase/admin"),
  allowTypeImports: true,
  message:
    "The service-role client bypasses RLS. Only lib/storage/signed-url.ts may import " +
    "lib/supabase/admin; go through the helpers there instead of opening a second door.",
};

/** Inside lib/supabase/ the same module is "./admin", which no tail pattern can tell from any other ./admin. */
const SERVICE_ROLE_SIBLING = {
  regex: "^\\./admin(?:\\.[cm]?[jt]sx?)?$",
  allowTypeImports: true,
  message: SERVICE_ROLE.message,
};

/**
 * One rule entry per zone. A zone's list has to be complete: a later config
 * object replaces an earlier one's options for the same rule, it does not merge
 * with them, so every zone below repeats what it shares with the broader one.
 */
const restrict = (...patterns) => ({
  "@typescript-eslint/no-restricted-imports": ["error", { patterns }],
});

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // The Pyodide runtime, copied out of node_modules by scripts/copy-pyodide-assets.mjs.
    // Vendored, minified and regenerated, so there is nothing here to fix — yet it was 13
    // of the 14 errors and 4,481 of the 4,484 warnings `bun run lint` reported.
    "public/pyodide/**",
  ]),

  // The zones run broad to narrow: a block replaces the options of the one before it for
  // the files both match, so the order below is the order of precedence.

  // Everything linted, scripts/ and the root configs included: one door to the admin client.
  { files: ["**/*.{ts,tsx}"], rules: restrict(SERVICE_ROLE) },

  // Components run in the browser. They get data as props, never by reaching for it.
  {
    files: ["components/**/*.{ts,tsx}"],
    rules: restrict(SERVER_DATA, RESOURCE_INDEX, SERVICE_ROLE),
  },

  // Routes and lib/ may read the library, but not through the generated index.
  {
    files: ["app/**/*.{ts,tsx}", "lib/**/*.{ts,tsx}"],
    rules: restrict(RESOURCE_INDEX, SERVICE_ROLE),
  },
  {
    files: ["lib/supabase/**/*.{ts,tsx}"],
    rules: restrict(RESOURCE_INDEX, SERVICE_ROLE, SERVICE_ROLE_SIBLING),
  },

  // The one allowed caller of the admin client.
  { files: ["lib/storage/signed-url.ts"], rules: restrict(RESOURCE_INDEX) },
]);

export default eslintConfig;
