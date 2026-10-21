<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# AGENTS.md — working on \<i\>Help

Entry point for AI agents (Claude Code loads it through `CLAUDE.md`). Humans start at
[README.md](./README.md). Last verified: 15 Oct 2026.

## What this repo is

A study site for KMITL IT year-1 students: Next.js 16 App Router, React 19, TypeScript,
Tailwind 4, Supabase (auth + storage), Drizzle. Bun is the package manager; Next runs on
Node — use `bun run dev`, never `bun --bun next`.

- **Course hubs** `/courses/<dir>` — every course declares the same 11-module spine
  (`lib/courses/spine.ts`); `lib/courses/course-bindings.ts` says what each course fills.
- **Media library** — PDFs and images on Supabase Storage, card metadata in `lib/library/`.
- **PSCP tools** `/pscp` — problem registry and the Learning Log wizard, which only formats
  answers the student wrote.
- Content is Thai with English technical terms. UI strings are bilingual through `LText`
  (`{ th, en }`) — never hardcode one language.

## Rules that are easy to break

1. **Generated files are never edited by hand.** Change the source, then regenerate:

   | File | Regenerate with |
   |---|---|
   | `lib/library/library-manifest.json` | `bun run library:manifest` |
   | `lib/library/library-stats.json` | `bun run library:stats` |
   | `lib/library/resource-index.json` | `bun run library:index` |
   | all three, in order | `bun run library:build` |
   | `data/pscp/problems.json` | `bun run pscp:build` (reads the archive repo's `OP` worktree, see `scripts/build_pscp_registry.py`) |
   | `data/en-kmitl/compro/labs.json` | `bun run compro:labs` |

2. **Client bundles must not see library data.** A Client Component never imports
   `lib/library/subject-library.ts` (it pulls the manifest and stats, past exams included,
   into the browser) — use `lib/library/subject-library-ui.ts`. Nothing in `app/`,
   `components/` or `lib/` imports `resource-index.json`; it is for scripts and agents.
3. **Gate on the server, never by hiding UI.** Hidden data is still in the payload.
4. **Know what is actually private.**
   - Past exams (`isRestrictedAsset()`: `category === "exam"` or a path containing `/exams/`)
     live in the private bucket `ihelp-library-exams`, served by short-lived signed URLs to
     insiders only.
   - Every other library file lives in the **public** bucket `ihelp-library`, and its path is
     in this public repo. The library page's list needs an IT KMITL login; the files do not.
     Treat anything you add outside `exams/` as public.
5. **Privacy (owner's rules, 15 Oct 2026).** Official handouts already given to the class
   (OnLearn lab sheets, slides) may be added even when a TA's or sample student's name shows
   in a screenshot. Never add other students' own work (submissions, group work naming
   classmates), personal data that was not already handed to the class, graded files
   (Cisco `.pka`) or saved pages of a personal account (SecSpace). Content Markdown never
   names other students.
6. **Academic integrity.** Never write OJ/iJudge solutions or the content of a student's
   `submission.md` / `ai_reflection.md`.
7. **Don't guess course facts.** Mark unverified facts *ยังไม่ยืนยัน*. Midterm/final `scope`
   comes from the course's `summary.md` §2, never from a week number in a filename.
8. **Ask before outward-facing actions, every time:** `bun run assets:sync` (uploads),
   `git push`, deleting Storage objects, posting anywhere outside the repo. A read-only bucket
   listing (`bun run library:audit -- --remote`) needs no approval.
9. **Commits only when asked.** Conventional Commits with a scope — `feat(itf): …`,
   `fix(reader): …`, `docs: …`, `chore(pscp): …`. User-visible changes get a line in
   `CHANGELOG.md` under `## [Unreleased]` with the Thai headings `### เพิ่ม` / `### ปรับปรุง` /
   `### แก้ไข` / `### ความปลอดภัย`.

## Where things live — edit the source of truth

| To change… | Edit | Then run |
|---|---|---|
| Course identity — code, names, credits, group | `lib/courses/catalog.ts` | `content:check` |
| What a course's 11 modules show | `lib/courses/course-bindings.ts` | `readiness`, `library:index` |
| Course overview page | `content/courses/<dir>/summary.md` ([standard](./docs/COURSE_OVERVIEW_STANDARD.md)) | `content:check` |
| Weekly pages (ITF, ICS) | `content/courses/<dir>/archive/weekNN.md` | `library:index`, `library:audit` |
| Week titles (ITF, ICS) — declared **twice** | `ITF_WEEKS` / `ICS_SESSIONS` in `course-bindings.ts` **and** `ITF_SCHEDULE` / `ICS_SCHEDULE` in `lib/library/course-weeks.ts` | change both, then `library:index` |
| Notes for content builders (never rendered) | `content/courses/<dir>/blueprint.md` | — |
| Library card metadata — titles, scope, week, edition, `sourceUrl` | `lib/library/subject-library.ts` | `library:build`, `library:audit` |
| Library week view (ITF, ICS) | `lib/library/course-weeks.ts` | `library:index` |
| Library files | `public/assets/<ns>/<subject>/<category>/<kebab-name>` (gitignored) | `library:build` → `library:audit` → `assets:sync` |
| Quiz banks | `lib/quiz/*.ts`, notes in `data/it-kmitl/<subject>/` | `content:check` |
| Study space (`/profile/<id>/study`, owner only) — a student's day plan; course weeks, links, exam dates | personal plans: `lib/study-space/plans/` (`server-only`; `plans/index.ts` maps student ID → plan, and the page renders only when the session's verified ID matches the URL and has a plan) · shared: `lib/study-space/units.ts`, `links.ts`, `subjects.ts` ([docs/STUDY_SPACE.md](./docs/STUDY_SPACE.md)) | `tsc`, then open every changed link |
| PSCP problems | the archive repo's `OP` branch | `pscp:build` |
| UI | `app/`, `components/` (`components/ui/` = shadcn primitives) | `lint` |

Paths, naming rules and the scope taxonomy: [FILE_STRUCTURE.md](./FILE_STRUCTURE.md).
The `lib/` layout and its import boundaries: [lib/README.md](./lib/README.md).

## Finding resources — the resource index

`lib/library/resource-index.json` joins the catalog, the module bindings, the week schedules,
every content doc and every library card. Each field is documented in
`lib/library/resource-index.schema.json`.

- `courses.<CODE>` — dir, href, modules (status and bound docs), weeks (docs and assets per
  week), counts
- `docs.<repo path>` — role (overview, week, blueprint…), title, the module and route that
  render it, week, `assetRefs` and `unresolvedRefs` from its file tables
- `assets.<id>` — course, origin (curated or generated), category, week, scope,
  edition/status, path, storage bucket and key, access (member or insider), pages, size,
  `onDisk`, `usedBy`

```bash
bun run library:find -- packet tracer --course ITF   # search cards
bun run library:find -- --course ITF --week 13       # everything filed under one week
bun run library:find -- --docs --course ITF          # a course's docs
jq '.courses.ITF.weeks[] | select(.week == 13)' lib/library/resource-index.json
jq '.docs | to_entries[] | select(.value.unresolvedRefs | length > 0) | .key' lib/library/resource-index.json
```

The index is a snapshot: rebuild it after changing any source (`bun run library:build`).
`bun run library:audit` reports when it is stale, along with missing files, dead file cards in
docs, id collisions, unmapped or badly named files and duplicate content; add `-- --remote`
to compare against the buckets.

## Recipes

**Add or refresh course files (new OnLearn handouts).**
1. OnLearn needs a login, so agents can't fetch from it. The owner downloads files into
   `~/Downloads/_INBOX/<COURSE>/`; copy (don't move) them into `_dropzone/`.
2. File them by [docs/DROPZONE_SOP.md](./docs/DROPZONE_SOP.md): classify, rename to
   kebab-case, compress, move under `public/assets/…`.
3. Add or adjust curated entries in `lib/library/subject-library.ts`.
4. `bun run library:build` → `bun run library:audit` (fix every error) → ask the owner →
   `bun run assets:sync` → `bun run library:audit -- --remote`.
5. Update the weekly page or overview that should list the file. Doc file tables match
   cards on `fileName` (`parseSessionDocTable()` in `components/md-view.tsx`).

**Edit a weekly page or overview.** Follow the existing week pages (ITF `archive/week13.md`
is a full example) and [docs/COURSE_OVERVIEW_STANDARD.md](./docs/COURSE_OVERVIEW_STANDARD.md).
Bump `updated:` in `summary.md` frontmatter and the **อัปเดตล่าสุด** line together.

**Add a course.** Follow the checklist in [FILE_STRUCTURE.md](./FILE_STRUCTURE.md) §8.

## Verify before handing work back

```bash
npx tsc --noEmit -p .
bun run lint
bun run content:check     # also runs as prebuild
bun run library:audit     # after touching library files, card metadata or docs
bun run build             # before a release or a large change
```

Known baseline (16 Oct 2026): `bun run lint` already exits 1 — 13 errors in the vendored
`public/pyodide/pyodide.asm.js` and 1 `react-hooks/set-state-in-effect` in
`lib/submission/draft.ts`. Don't add new ones; lint the files you touched with
`npx eslint <files>`. `library:audit` warns about 9 unbound `archive/links.md` /
`RESOURCES_MANIFEST.md` notes and one non-kebab CHARM file name — known, not yours to fix.

## Docs map

| Doc | Read it for |
|---|---|
| [README.md](./README.md) | what the site is, how to run it, the stack |
| [CONTRIBUTING.md](./CONTRIBUTING.md) | the contribution workflow, task by task |
| [FILE_STRUCTURE.md](./FILE_STRUCTURE.md) | paths, naming, scope taxonomy, generated files |
| [docs/DROPZONE_SOP.md](./docs/DROPZONE_SOP.md) | filing a pile of raw course files |
| [docs/COURSE_OVERVIEW_STANDARD.md](./docs/COURSE_OVERVIEW_STANDARD.md) | the `summary.md` / `blueprint.md` contract |
| [docs/LEARNING_BLUEPRINT.md](./docs/LEARNING_BLUEPRINT.md) | the 11-module spine, bindings, readiness |
| [docs/Current_Architecture_Report.md](./docs/Current_Architecture_Report.md) | architecture review and known inconsistencies |
| [docs/FONTS.md](./docs/FONTS.md) | typography rules for the reader |
| [docs/STUDY_SPACE.md](./docs/STUDY_SPACE.md) | personal study space, timer preset and 22-day exam quota tracker |
| [lib/README.md](./lib/README.md) | the `lib/` folder and its import boundaries |
| [content/courses/README.md](./content/courses/README.md) | course content status and gaps |
