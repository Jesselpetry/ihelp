# iHelp — State of the Architecture

**Instructional architecture audit, prepared for handoff to an EdTech / E-Learning Platform expert.**

| | |
|---|---|
| Repository | `ihelp` (open source, MIT; Next.js 16.2.10 / React 19.2.4, App Router) |
| Version | `0.6.0` at the scan · `0.8.0` today (`package.json`) |
| Branch scanned | `main` @ `137d3b7` |
| Date of scan | 2026-08-26, media/storage sections revised 2026-08-31; file paths refreshed 2026-09-22 (`lib/` regroup, `366a9e7`) |
| Last verified | **15 Oct 2026** against `main` @ `3ab42d3` plus the uncommitted working tree — see §0 |
| Audience | Redesign of the instructional architecture — taxonomy, content schemas, learning modality coverage |
| Scope of this document | Descriptive only. No source files were modified during the scan or the re-verification. |

> **Reading note.** This is an audit of *what exists*, not a proposal. Section 5 flags structural
> problems for the incoming expert; it does not prescribe fixes. Counts in §1–§4 were measured from the
> tree at the commit above, not quoted from existing docs; where the system has since changed, the
> original text is kept as history and a **Status 15 Oct 2026** line says what is true now. **§0
> lists what changed.** Volatile numbers carry the command that re-measures them (most come from
> `jq .totals lib/library/resource-index.json` after `bun run library:index`).

---

## 0. What changed since the scan

*Added 15 Oct 2026 (verified against `main` @ `3ab42d3` plus the uncommitted working tree).
Sections 1–5 keep their original text as history; wherever reality moved they carry a
**Status 15 Oct 2026** line.*

### 0.1 Architecture

| Area | At the scan | Now | Where to look |
|---|---|---|---|
| Course page model | `TrackKind` (6) + `lib/course-tracks.ts` roadmap + a `switch` on course code in every route (§2.3, §4.2, §5.1, §5.2) | 11-module `STANDARD_SPINE`, one binding record per course, **one route for every module**. `lib/course-tracks.ts` no longer exists; `catalog.ts` is identity-only (no `tracks`) | `lib/courses/spine.ts` · `course-bindings.ts` · `course-spine.ts` · `app/courses/[dir]/[module]/page.tsx` · `docs/LEARNING_BLUEPRINT.md` |
| Accounts and database | "no user account … and no database" (§1) | Google sign-in limited to KMITL IT student ids (`@kmitl.ac.th`, faculty code 07); roles `student` / `insider` / `admin`; Postgres schema `ihelp` (`users`, `resources`, `exams`, `site_visits`) through Drizzle, in a database shared with the itgg-2026 app; `proxy.ts` refreshes the Supabase session on every request. Quiz and lab **progress is still `localStorage` only** | `lib/auth/verify.ts` · `lib/auth/guards.ts` · `db/schema.ts` · `proxy.ts` |
| Library access | files public; past papers insider-only (§3.1) | The library page is static and carries no card data; its list comes from `GET /api/library/assets`, which needs an IT KMITL sign-in. Files other than past papers still sit in the **public** bucket `ihelp-library` and their paths are in this public repo, so *behind login* is not *private* — and the module pages that render documents (e.g. the ITF/ICS weekly pages) are open and receive the course's non-exam cards as props to match their file tables (`proxy.ts` guards only `/onboarding`, `/upload`, `/exams`). Past papers: private bucket `ihelp-library-exams`, 10-minute signed URLs, insider/admin only | `app/api/library/assets/route.ts` · `lib/library/library-exams.ts` · `lib/library/asset-url.ts` |
| Library data model | `SubjectAsset`: `scope`, `chapter`, `groupId`, `pages`, `sizeBytes` | + `week`, `edition`, `status`, `isCurrentYear`, `isDuplicate` / `duplicateOf`, `sourceUrl`; ITF and ICS open on a week-by-week view driven by `COURSE_SCHEDULES` | `lib/library/subject-library-ui.ts` · `lib/library/course-weeks.ts` |
| Library tooling | `library:manifest`, `library:stats`, `assets:sync` | + `library:index` (one generated JSON joining courses, docs and cards), `library:audit` (consistency report; `--remote` compares with the buckets, read-only), `library:find` (search the index). `library:build` = manifest + stats + index | `package.json` · `scripts/library-*.ts` |
| Contract checks | "No test suite" (§5.9) | `bun run content:check` (runs as `prebuild`; error and warn rules for banks, spine, bindings, recommended problems and the overview standard), `bun run readiness`, `bun run library:audit`. Still no unit-test runner | `scripts/validate-content.ts` · `scripts/readiness.ts` · `scripts/library-audit.ts` |
| Course overviews | loose "five-part" convention (§4.6) | six fixed sections + 14-key frontmatter, machine-checked (`overview-*`); authoring notes moved to a non-rendered `blueprint.md` | `docs/COURSE_OVERVIEW_STANDARD.md` · `docs/templates/` |
| Reader typography | not covered | every Markdown body renders in THSarabunNew via `MdView`; a "notebook" variant for the `overview` and `summary` modules; `{==…==}` / `{++…++}` marks | `docs/FONTS.md` · `components/md-view.tsx` · `lib/docs/remark-notebook.ts` |
| PSCP data | 64 iJudge problems, 10 recommended | 222 in `data/oj_problems.json`, 235 in the registry `data/pscp/problems.json` (built from the archive repo's `OP` branch), 14 recommended; `/pscp/[slug]` is an in-browser workspace | `scripts/build_pscp_registry.py` · `lib/pscp/pscp.ts` |
| Code layout | flat `lib/*.ts` (paths in §2–§4 as scanned) | grouped by domain: `lib/courses` · `library` · `quiz` · `pscp` · `submission` · `docs` · `github` · `profile` · `actions` · `auth` · `supabase` · `schemas` | `lib/README.md` |
| Releases | 0.6.0 | 0.7.0 and 0.8.0 (both 22 Sep); the site moved to `ihelp.chatan.in.th` on 15 Sep | `CHANGELOG.md` |

### 0.2 Status of the §5 inconsistencies

| § | Inconsistency | Status 15 Oct 2026 |
|---|---|---|
| 5.1 | three content stores chosen by a `switch` in every route | **Partly resolved** — no route branches any more (the stores are reached only through `ModuleBinding.docs[].load`; MFIT's bank order is declared once). Adding a course still touches 5–6 registries (see `docs/LEARNING_BLUEPRINT.md` §8) and two hardcoded course checks remain |
| 5.2 | two incompatible track vocabularies | **Resolved** — `ModuleId` (11) replaced `TrackKind` and the open `string` ids; no `extraHrefs` |
| 5.3 | "mock exam" is three unrelated things | **Partly resolved** — COMPRO's 60-question paper is its own `mock_exam` module; ICS/MFIT mocks are still Markdown; there is still no timer |
| 5.4 | 28 orphaned content files | **Mostly resolved** — 19 of the 28 are bound through `loadCourseDoc()`; 9 remain unread plus 2 files added since |
| 5.5 | bilingual coverage and hollow explanations | **Partly resolved** — the live debt is the COMPRO mock paper and 6 CHEM items; ITF's placeholder strings are inert (every ITF question uses `explanationMd`) |
| 5.6 | scope on ~20% of the library, flat shelves | **Partly resolved** — scope on 41% of cards, week/chapter on 40%, `chapter`/`week` fields exist, week view for ITF and ICS; the other shelves are still flat |
| 5.7 | learner state is write-mostly and per-device | **Open** — `loadQuizProgress()` is still read by one component; `missed[]` is still unused; four independent progress stores; accounts exist but progress is not synced |
| 5.8 | navigation bottlenecks | **Partly resolved** — readers point forward to the drill, every module is reachable from the hub grid; no chapter-scoped run, no content search, no resume surface |
| 5.9 | delivery and build-shape constraints | **Partly resolved** — assets left git (0.6.0), `force-dynamic` is gone from the course routes, a contract check gates the build; banks are still TypeScript and still all imported by `course-bindings.ts` |
| 5.10 | coverage is thin | **Open** — 9 of 15 courses are still `baseline()`-only; average readiness 3.9/11 |

---

## 1. Executive Summary

iHelp is a **single-tenant study portal** for first-year Information Technology
students at KMITL (King Mongkut's Institute of Technology Ladkrabang). It is not an LMS: there is
no enrolment, no gradebook and no instructor role. *(Scan text, kept as history: "no user account
… and no database".)* Every piece of content ships **inside the deployment artifact** — as
Markdown files and TypeScript modules — or sits in Supabase Storage as PDFs and images. Learner
state (quiz scores, lab drafts, read marks) lives in the browser's `localStorage`.

> **Status 15 Oct 2026.** The "zero-backend, no account, no database" description no longer
> holds: sign-in with a KMITL IT student id, an `ihelp` Postgres schema (profiles, roles, past-exam
> index, community uploads, visitor counter) and five Storage buckets (`ihelp-library`,
> `ihelp-library-exams`, `ihelp-exams`, `ihelp-resources`, `ihelp-avatars`) now exist (§0.1). Learner
> *progress* is the part that still has no server side.

### Scale

Counts as of **15 Oct 2026** (the scan's figures are in the "At the scan" column). Library figures
come from `bun run library:index` → `jq .totals lib/library/resource-index.json`; the others have
their own command.

| Dimension | At the scan | 15 Oct 2026 | Where / how to re-measure |
|---|---:|---:|---|
| Courses in the catalogue | 15 | **15** | `lib/courses/catalog.ts` — 7× Y1-S1, 6× Y1-S2, 2× cross-faculty (EN-KMITL) · `.totals.courses` |
| Courses with a resource library | 14 | **14** | 13 auto-manifested + ComPro (in-app docs only). `SPORT` has zero assets · `.totals.coursesWithLibrary` |
| Course overview documents | 13 | **15** (+15 `blueprint.md`, not rendered) | `content/courses/<dir>/summary.md`, 278 KB total · `bun run library:find -- --docs` |
| Long-form study documents | 12 | **12** | `data/it-kmitl/`, `data/en-kmitl/` — 725 KB of Markdown |
| Content files read by no module | 28 | **11** (+15 `blueprint.md`, unrendered by design) | §5.4 — 8 `archive/links.md`, MFIT `study-guide-curriculum.json`, PSCP `archive/readme.md`, ICS `RESOURCES_MANIFEST.md` · `bun run library:audit` flags 9 of them as `orphan-doc` (not the JSON, not the PSCP readme) |
| Media assets | 670 files / 908 MB | **705 files / 949 MiB** | Supabase Storage, **not** the repo — 653 PDFs (**13,173 pages**), 27 webp, 10 jpg, 6 `.circ`, 5 xlsx, 1 each of docx, txt, zip, accdb. Split across `ihelp-library` (537 public, 613 MiB) and `ihelp-library-exams` (168 insider-only, 335 MiB) · `.totals.files` / `.sizeBytes` / `.pages` |
| Library cards (merged) | — | **722** | 314 curated + 408 generated-only (a curated card hides the generated one for the same URL) · `.totals.assets` / `.curated` / `.generated` · `.insider` = 171 cards flagged as past papers |
| Curated asset records | 172 | **314** | Hand-written entries in `lib/library/subject-library.ts` (5,227 lines / 276 KB; was 137 KB) |
| Generated asset records | 670 | **705** | `lib/library/library-manifest.json` (353 KB), built from the file tree |
| Quiz / exam questions | 368 | **390** | 308 in the six banks bound to courses (ITF 63, ICS 50, MFIT 65, COMPRO 10 + 60, CHEM 60) + 82 per-problem for 14 recommended problems; all typed `QuizQuestion` |
| Executable coding problems | 35 | **39** | 14 OJ "recommended" problems (86 cases, 30 of them official) + 25 ComPro labs (123 cases) |
| Problem-set index | 64 | **222** | `data/oj_problems.json` — weeks 1–14, 36 learning logs; the registry `data/pscp/problems.json` holds 235 |
| Policy / how-to documents | 12 | **13** | `data/ai-guidelines/` (23 files, th/en pairs), rendered as a paginated "book" at `/library` |
| App routes | 25 pages / 13 API routes | **24 pages / 17 route handlers** | `find app -name page.tsx`, `find app -name route.ts` — 16 handlers under `app/api/` (11 GitHub OAuth, 2 document generators, `library/assets`, `me`, `views`) + `auth/callback` |

### Question bank composition

| Bank | Questions | Course | Notes |
|---|---:|---|---|
| `ITF_QUIZ` | 63 | ITF (06016402) | Thai-only; 12 self-assessed short-answer, 6 true/false; every question carries `explanationMd` |
| `ICS_QUIZ` | 50 | ICS (06016411) | Bilingual; derived from the 1/2564 past paper |
| `MFIT_QUIZ` + `MFIT_BLUEPRINT_QUIZ` | 45 + 20 | MFIT (06016401) | Blueprint set mirrors the instructor's 10-question exam plan |
| `CHEM_QUIZ` | 60 | CHEM | 5-choice (ก–จ), like the COMPRO mock paper; every other bank is 4-choice |
| `EN_KMITL_CURATED_QUIZ` + `EN_KMITL_MOCK_EXAM` | 10 + 60 | COMPRO (01006012) | Mock exam is auto-generated from a Markdown paper. *Status 15 Oct 2026: now two modules — `drill` (10) and `mock_exam` (60, own progress key 900006)* |
| `QUIZ_BANK` (per-OJ) | 82 | PSCP | 14 problems × 5–6 questions (60 in 10 problems at the scan), keyed by iJudge problem id |

**Item-type distribution** (15 Oct 2026, 390 questions): `mcq` 316 · `predict-output` 28 ·
`spot-the-bug` 16 · `short-answer` 12 · `pep8` 12 · `true-false` 6. At the scan (368 questions) it was
`mcq` 304 · `predict-output` 24 · `short-answer` 12 · `spot-the-bug` 12 · `pep8` 10 · `true-false` 6.
**81% of all assessment is plain multiple choice** (83% at the scan).

### Primary user paths

There are three, and they barely intersect:

1. **Course path** — `/` (directory of 15 course cards) → `/courses/<officialCode>-<Slug>` (subject
   hub with a track grid) → one of `summary` · `quiz` · `library` · `exam` · `mock` · `cram` ·
   `plan` · `analysis` · `labs`. This is the path 13 of 15 courses use.
   *Status 15 Oct 2026: the hub shows the 11-module grid and the routes are `overview` · `map` ·
   `summary` · `cram` · `cards` · `quiz` · `speed` · `labs` · `mock` · `weak-spots` · `library`
   (`/exam`, `/plan`, `/analysis` redirect). All 15 courses use it; PSCP's `labs` slot links out to
   `/pscp`.*
2. **PSCP problem path** — `/pscp` (64 iJudge problems with deadlines) and `/recommended`
   (10 annotated problems) → `/recommended/<slug>` (reader) → `/recommended/<slug>/quiz` (technique
   self-test) or `/recommended/<slug>/grade` (in-browser Python grader).
   *Status 15 Oct 2026: `/pscp` lists the 235-problem registry and each problem opens an in-browser
   workspace at `/pscp/<slug>`; `/recommended` has 14 problems.*
3. **Coursework-compliance path** — `/make/submission` and `/make/reflection` (form wizards that
   fill official Markdown templates) → `/history` → optional GitHub push (`/repo`, 13 API routes).
   *Status 15 Oct 2026: 11 GitHub OAuth routes + 2 document generators.*

Path 3 is an academic-integrity workflow, not learning content, but it occupies a third of the
codebase's server surface. *(Status 15 Oct 2026: 13 of the 17 route handlers; the rest are the
library list, the session probe, the visitor counter and the sign-in callback.)*

---

## 2. Curriculum Taxonomy & Information Architecture

### 2.1 How subjects are grouped

The catalogue is a **flat array of 15 records** in `lib/courses/catalog.ts`, partitioned by a single
`group` field:

```ts
export type CourseGroup = "Y1-S1" | "Y1-S2" | "EN-KMITL";
```

- `Y1-S1` / `Y1-S2` — Year 1, semester 1 and 2 of the IT KMITL curriculum (2022 revision).
- `EN-KMITL` — Faculty-of-Engineering courses IT students cross-register into (COMPRO, CHEM).

There is **no Year dimension** — the type is a fused year+term string, so a Year 2 expansion means
extending a union type rather than adding a field. There is no department, no programme, no
credit-block, and no prerequisite graph in the runtime taxonomy (`prerequisites` exists only as
Markdown front matter and in the scraped JSON, and is never rendered as a graph).

Identity for a course is **triple-keyed**, and all three keys resolve to the same record via
`resolveCourse()`:

| Key | Example | Used by |
|---|---|---|
| `officialCode` | `06016402` | KMITL registrar, folder names, deep links |
| `code` (short) | `ITF` | Badges, asset folders, every `switch` in the route layer |
| `slug` | `IT-Fundamentals` | URLs, `content/courses/` directories |

The canonical directory name is `${officialCode}-${slug}` (`courseDir()`), which mirrors the folder
contract of the sibling `kmitl-archive` repository. Two courses lack an official code path: CHEM
(no published code, so `courseDir` degrades to the bare slug) and COMPRO (code `01006012` exists in
the catalogue but the corresponding `content/courses/` directory does not — its content is loaded
from `data/en-kmitl/` by a hardcoded Thai filename).
*Status 15 Oct 2026: both now have a `content/courses/` directory (`01006012-Computer-Programming`,
`General-Chemistry`) holding the standard `summary.md` + `blueprint.md`; the full study notes are
still loaded from `data/en-kmitl/` by hardcoded Thai filenames (`lib/courses/en-kmitl.ts`).*

### 2.2 How time and scope are partitioned

Three **independent, non-reconciled** partitioning schemes coexist:

**(a) Track scope — `TrackScope`, on the course-hub card.**

```ts
export type TrackScope = "all" | "midterm" | "final";   // lib/course-tracks.ts
```
Declared per track blueprint. In practice nearly every blueprint is hardcoded to `"midterm"`,
reflecting that the portal was built during a midterm cram cycle.
*Status 15 Oct 2026: `TrackScope` went away with `lib/course-tracks.ts`. Its successor is
`ModuleScope = "all" | "midterm" | "final"` in `lib/courses/spine.ts`, declared once per module in
`STANDARD_SPINE` (`cram_sheet`, `speed_quiz` and `mock_exam` default to `midterm`, the rest to
`all`) and overridable per course in its binding.*

**(b) Asset scope — `AssetScope`, on the media library card.**

```ts
export type AssetScope = "midterm" | "final";           // lib/library/subject-library-ui.ts (optional field; re-exported by subject-library.ts)
```
This is the project's most deliberate design decision, and it is documented in `FILE_STRUCTURE.md`
§3: **exam scope is metadata, never a directory level**. Rationale recorded in-repo: (1) some
material spans the term (course plans, Z-tables, submission guides) and would be falsified by
either bucket; (2) an instructor moving the exam week should be a field edit, not a file move plus
a URL chase; (3) asset URLs must stay stable for sharing. Absence of `scope` is meaningful — it
means "shown under both milestones."

The boundary is **per course, taken from that course's own `summary.md`**, never inferred from a
week number in a filename:

| Courses | Midterm/final boundary |
|---|---|
| ITF · ICS · MFIT · PSCP | end of week 7 |
| DSA · PSTAT | end of chapter 7 |
| BFIT | end of week 8 |

*Status 15 Oct 2026: OOP also splits at chapter 7 (0–7 / 8–14); PSCP's summary states the midterm as
chapters 1–5 and the final as Week 08–14; FE and FE2 split by Unit (1–2 / 3–10, 3–5 / 8–10). The
authoritative table, re-read from the 15 summaries, is in `docs/DROPZONE_SOP.md` §2.3.*

**(c) Chapter / week partitioning — `SubjectChapter`.**
Each quiz bank ships its own chapter list (`ITF_CHAPTERS`, `ICS_CHAPTERS`, `MFIT_CHAPTERS`,
`EN_KMITL_CHAPTERS`, `CHEM_CHAPTERS`), and the label varies per subject: MFIT uses
`สัปดาห์ที่` (Week), ITF uses `Lecture`, ICS/OOP use `บทที่` (Ch.), FE uses `Unit`. For a course with
no registered chapter list, `lib/courses/course-chapters.ts` **screen-scrapes section 2 of its own
`summary.md`** with a regex over Markdown table rows, sniffing the header cell for
`สัปดาห์` / `บท` / `Unit` to pick the label. This is the only place in the system where a syllabus
is parsed rather than authored.
*Status 15 Oct 2026: `COURSE_CHAPTERS_MAP` registers all 15 courses (the lists for ITF, ICS, MFIT,
COMPRO and CHEM still come from `lib/quiz/*-quiz.ts`, the other ten are inline in
`course-chapters.ts`), so the `summary.md` parser is now only a fallback for a course added but not
yet registered, and runs for none today.*

### 2.3 How metadata links files to the UI

Four registries, layered (as scanned — superseded, the current chain follows the diagram):

```
lib/courses/catalog.ts          15 course records + a `tracks` map of TrackKind -> href
        │                  (a track appears here only once it actually renders)
        ▼
lib/course-tracks.ts    per-course roadmap blueprints -> buildCourseTracks(code, hrefs, metrics)
        │                  status = "available" when an href exists, else "coming_soon"
        ▼
app/courses/[dir]/page.tsx   a switch on course code that supplies bespoke copy, extra
        │                    hrefs (cram/plan/analysis/mock), and live question counts
        ▼
lib/library/subject-library.ts  mergedAssets(code) = curated entries ++ generated manifest entries
                        (curated wins on matching URL), then withAssetStats() stamps
                        page counts and byte sizes from lib/library/library-stats.json
```

*Status 15 Oct 2026 — the chain now:*

```
lib/courses/catalog.ts          15 course records, identity only (code, officialCode, slug, names,
        │                       credits, group) — no `tracks`, no TrackKind
        ▼
lib/courses/spine.ts            STANDARD_SPINE: 11 modules, fixed order, URL segment, default scope, DoD
lib/courses/course-bindings.ts  COURSE_BINDINGS: per course, which modules have docs / a bank / an href
        │
        ▼
lib/courses/course-spine.ts     resolveCourseSpine(): status "available" when bound content exists,
        │                       else "coming_soon"; readinessIndex() counts the available ones
        ▼
app/courses/[dir]/page.tsx             the hub: the 11-slot grid, question counts measured from the banks
app/courses/[dir]/[module]/page.tsx    one route for every module (docs reader, quiz gate, library gate)
        ▼
lib/library/subject-library.ts  mergedAssets(code) = curated entries ++ generated manifest entries
                                (curated wins on matching URL); withAssetStats() stamps pages and sizes
```

Three files are **build artifacts and must not be hand-edited**:

| File | Generator | Contents |
|---|---|---|
| `lib/library/library-manifest.json` (353 KB; 335 KB at the scan) | `bun run library:manifest` | One card per file under `public/assets/`, title humanized from the filename, `chapter` only when the filename states one. Server-only — a client import would ship every asset name to the browser, so display helpers live in `lib/library/subject-library-ui.ts` |
| `lib/library/library-stats.json` (74 KB) | `bun run library:stats` | 705 entries of `{ sizeBytes, pages? }` (670 at the scan) — PDF page counts must be computed at build time |
| `lib/library/resource-index.json` (~1.1 MB; schema `resource-index.schema.json`) | `bun run library:index` | *New.* One snapshot joining `courses` (modules and status, weeks, counts), `docs` (every Markdown under `content/courses`, `data/it-kmitl`, `data/en-kmitl`: role, which module renders it, week, the files its tables reference, unresolved references) and `assets` (every card: origin, category, week, scope, edition/status, path, bucket and key, access tier, pages, size, `onDisk`, `usedBy`). Never imported by app code — it lists past papers too. Search it with `bun run library:find` |

`bun run library:build` runs all three in order. `bun run library:audit` reads the same sources and
reports where they disagree (missing files, id collisions, dead file references in docs, a stale
index, …); with `--remote` it also compares the files with the two buckets.

The asset path contract is **exactly four segments**:

```
public/assets/<namespace>/<subject>/<category>/<filename>
              it-kmitl     mfit      lectures    mfit-lec-week03-vectors.pdf
```

`scripts/build-library-manifest.mjs` skips anything shallower, and any `<subject>` folder missing
from its `SUBJECT_CODE` table — a file written one level up lands on disk but never appears in the
UI (`library:audit` reports it as `unmapped-file`). Category folders map to gallery shelves:
`lectures|slides → lecture`, `sheets → cheatsheet`, `exams → exam`,
`exercises|labs|activities|worksheets|cases → exercise`, `notes|pages → note`,
`references|misc → reference`.

**Ingest.** New files land in `_dropzone/` (git-ignored staging) and an AI agent processes them
against `docs/DROPZONE_SOP.md`: scan → classify by *reading inside the file*, never by filename →
rename to the sanitized convention → move to the four-segment path → regenerate both manifests →
clear the dropzone. The SOP explicitly forbids guessing `scope` and requires low-confidence files
to be held rather than filed.
*Status 15 Oct 2026: the SOP now also compresses before filing, regenerates with `library:build`
(manifest + stats + index), audits with `library:audit`, and uploads with `assets:sync` only after the
owner agrees, followed by `library:audit -- --remote`. Course files come from the owner's
`~/Downloads/_INBOX/<COURSE>/` (OnLearn needs a login). Privacy rule of 15 Oct 2026: official class
handouts that show a TA's or sample student's name are filed normally; other students' own work and
personal data not already given to the class are held; graded artefacts (`.pka`) and saved
personal-account pages are skipped.*

---

## 3. Learning Modalities & Asset Types

### 3.1 Passive learning

| Modality | Storage | Engine | Coverage |
|---|---|---|---|
| **Course overview / syllabus** | `content/courses/<dir>/summary.md` with YAML front matter | `course-overview.tsx` — tabbed overview card (curated summary / official info) with live outline panel and read-progress | 15 courses *(13 at the scan)* |
| **Study notes (long form)** | `data/it-kmitl/<subj>/summarize.md`, `data/en-kmitl/…` | `module-reader.tsx` + `toc-side-panel.tsx` *(`subject-summary-reader.tsx` at the scan)* — the `deep_summary` module | ITF, ICS, MFIT, COMPRO, CHEM |
| **Cram sheet** | `data/it-kmitl/mfit/cram.md` | same reader — the `cram_sheet` module (`/cram`) | MFIT only |
| **Study plan / learning path** | `data/it-kmitl/mfit/learning-path.md` | second document of the same `cram_sheet` module (`/plan` redirects to `/cram`) | MFIT only (a 6-block, day-before-the-exam sprint) |
| **Exam analysis** | `data/it-kmitl/ics/analysis.md` | second document of the `orientation` module (`/analysis` redirects to `/overview`) | ICS only (mark distribution across topics) |
| **Weekly session pages** | `content/courses/<dir>/archive/weekNN.md` | the `syllabus_map` module (`/map`): one page per week with its file table, exam notes and lab summary | ITF (15 weeks), ICS (7 sessions) — *new since the scan* |
| **Lecture slides** | Supabase `ihelp-library` (public bucket) | `subject-library.tsx` (961 lines; 1,642 at the scan) + `components/subject-library/` (table, weekly table, book cover, photo stack) behind `subject-library-gate.tsx` — gallery/list toggle, category shelves, midterm/final segmented control, tag chips, search, in-modal PDF preview with zoom/pan/fullscreen; ITF and ICS open on the week view | 13 courses |
| **Handwritten note scans** | 27 webp + 10 jpg *(26 + 10 at the scan)* | same, collapsed into stacks via `groupId` | 24 groups defined in `ASSET_GROUPS` *(2 at the scan)* — the note and exam-scan sets plus ICS lecture/lab editions and exam copies |
| **Policy book** | `data/ai-guidelines/**` (13 docs, th/en pairs where both exist; 12 at the scan) | `library-reader.tsx` — prev/next pagination, "doc *n* of *N*" | Course-wide |
| **Past papers** | Supabase `ihelp-library-exams` (**private bucket**) | Same gallery, but the entries come from `GET /api/library/assets` after mount, and only insiders receive them (signed) | 10 courses, 168 files *(169 at the scan)* |

### Media delivery

Assets left the repository in 0.6.0. 908 MB of PDFs had pushed the git pack to 881 MB and the
Turbopack file trace — which had gone project-wide because of an unresolvable `fs` path — to a
1 GB build output, running the Vercel build container out of disk. They are now served from
Supabase Storage:

| | Public library | Past papers |
|---|---|---|
| Bucket | `ihelp-library` | `ihelp-library-exams` (private) |
| Files | 501 *(537 files / 613 MiB on 15 Oct 2026)* | 169 *(168 files / 335 MiB)* |
| Addressed by | `assetUrl()` → public URL | `libraryExamsForInsider()` → 10-minute signed URL |
| Gate | none *(15 Oct 2026: object URLs are still public, but the **list** of them needs an IT KMITL sign-in — `GET /api/library/assets`)* | `isInsider()`, before the service-role client is touched |
| In prerendered HTML | yes *(15 Oct 2026: not on the library page, which is static, carries no card data and fetches the list after mount — but the other module pages that render documents receive the course's non-exam cards as props)* | **no** — the page is static, and a signed URL cannot be baked into it |

Classification is on `category === "exam"`, not on path: ten scanned exam pages live under
`ics/pages/` rather than an `exams/` folder, and a path rule publishes them. `storageKey()` is
shared by the uploader and the resolver so the two cannot disagree about where a file is.
*Status 15 Oct 2026: `isRestrictedAsset()` (`lib/library/subject-library-ui.ts`) is `category ===
"exam"` **or** a path containing `/exams/`; `scripts/sync-library-assets.ts` and `library:audit
--remote` use the same rule. Because the non-exam bucket is public and its paths are in this public
repo, "behind login" describes the list, not the files.*

Markdown rendering is uniform: `react-markdown` + `remark-gfm` + `remark-math` + `rehype-katex`
(LaTeX is used heavily by MFIT and PSTAT) with a shared heading-slug/TOC extractor (`lib/docs/toc.ts`)
that preserves Thai characters in anchors.
*Status 15 Oct 2026: `components/md-view.tsx` is still the only importer of `react-markdown`. It now
sets every body in THSarabunNew, adds a "notebook" variant (used for the `overview` and `summary`
modules) and a `remarkNotebook` plugin for `{==highlight==}` / `{++underline++}` / `<sub>` / `<sup>`,
renders a ```` ```youtube ```` fence as a player, and turns a weekly page's file table into openable
file cards by matching `fileName` against the library cards — see `docs/FONTS.md`.*

### 3.2 Active assessment

One engine serves **all** question types: `components/technique-quiz.tsx` (585 lines), fronted by
`components/subject-quiz-gate.tsx` for subject banks.

Flow: gate screen listing chapters and per-chapter question counts → **Start** → one question per
screen → select → **Check** → feedback → Next → summary screen with per-question review and Retry.
Keyboard shortcuts (1–9 to select, Enter to advance) are wired.

Supported kinds (`QuizKind` in `lib/quiz/quiz.ts`):

| Kind | Grading | Count | Notes |
|---|---|---:|---|
| `mcq` | `selectedId === correctId` | 316 *(304)* | 4 options everywhere except CHEM and the COMPRO mock paper (5, ก–จ) |
| `predict-output` | same | 28 *(24)* | Shows only the I/O contract in prose plus a concrete `stdin` — deliberately *no* code, so the student reasons from spec |
| `spot-the-bug` | same | 16 *(12)* | ≤ 5 real lines from a reference solution with exactly one mutation |
| `pep8` | same | 12 *(10)* | Style/lint reasoning |
| `true-false` | same | 6 | 2 options |
| `short-answer` | **self-assessed** — the learner reveals a model answer and marks `self:correct` / `self:wrong` | 12 | Open essays; no string matching is attempted |

*(Counts are 15 Oct 2026; the scan's figure is in italics.)*

**Mock exams** are not a distinct engine or schema. Two different things carry the name:
- COMPRO's 60-question mock paper is `QuizQuestion[]` and is **concatenated into the practice quiz**
  (`[...EN_KMITL_QUIZ, ...EN_KMITL_MOCK_EXAM]`), so the "quiz" a COMPRO student takes is 70 items.
  *Status 15 Oct 2026: split — the 10 practice items are the `drill` module and the 60-item paper is
  its own `mock_exam` module with its own progress key (`900006`), so the two scores no longer mix.*
- MFIT's mock exam is **Markdown** rendered by the reader at `/courses/…/mock`; ICS's and MFIT's
  real past papers are Markdown at `/courses/…/exam`. *(Status 15 Oct 2026: `/exam` redirects to
  `/mock`; ICS's practice paper and MFIT's midterm and final papers are Markdown documents of the
  `mock_exam` module, and MFIT's timed drill is a Markdown document of `speed_quiz`.)*

There is **no timer** anywhere in the codebase (`grep` for `setInterval`/countdown in the quiz
engine returns nothing), despite the welcome modal advertising `พร้อมเฉลยละเอียดและจับเวลา`
("with detailed solutions and timing"). *Status 15 Oct 2026: unchanged — the modal copy is still in
`components/disclaimer-modal.tsx` and `technique-quiz.tsx` still has no clock.*

### 3.3 Applied practice

Two **independent** code-practice systems with different data models, different UIs, and different
persistence keys:

**(a) PSCP recommended problems** — `/recommended/<slug>/grade`, `components/code-grader.tsx`
(690 lines at the scan, 747 on 15 Oct 2026) over `lib/pscp/pyodide-client.ts`. The same grader also
backs the `/pscp/<slug>` workspace (`components/pscp-workspace.tsx`).

- Runs **CPython in the browser** via Pyodide in a dedicated Web Worker
  (`public/workers/python-runner.worker.js`), with the full runtime vendored into `public/pyodide/`.
- Lazy-load contract is explicit and documented: nothing may trigger the ~16 MB Pyodide download
  except a deliberate user gesture. A single worker is reused across runs; a timed-out worker is
  terminated and the reference dropped so the next call cold-starts rather than hanging.
- Grading is **iJudge-compatible**: per-case status `P` (passed) / `-` (wrong answer) / `T` (time
  limit) / `E` (runtime error), presented as a score string like `PPPP-`, with a diff view.
- Style feedback is separate and **non-blocking**: `pycodestyle` via micropip, plus four bespoke
  course rules (`PSCP-NOT-MOD`, `PSCP-CONSIDER-IN`, `PSCP-IMPORT-ALIAS`, `PSCP-CONST-CASE`) in
  `lib/pscp/pep8-rules.ts`, each able to carry a `sourceRef` back into the teaching material.
- Coverage: **10 problems, 66 test cases** (`lib/pscp/testcases.ts`), split `official: true` (copied
  verbatim from the problem's §4) and `official: false` (extra cases from §6, each annotated with
  what it tests, e.g. "boundary N=0"). *Status 15 Oct 2026: 14 problems, 86 cases (30 official).*

**(b) ComPro labs** — `/courses/01006012-Computer-Programming/labs`,
`components/compro-lab-hub.tsx` (819 lines).

- **25 problems across weeks 1–5, 123 cases**, in `data/en-kmitl/compro/labs.json`, regenerated by
  `scripts/build_compro_labs.py` from the course portal and re-verified by piping recovered stdin
  through a reference solution in a real CPython subprocess.
- Grading is **byte-exact stdout match** (the portal grades on spacing quirks), not the P/-/T/E model.
- Teaching material is deliberately kept out of the generated JSON: `lib/pscp/compro-lessons.ts` (1,204
  lines, hand-written Thai) keys walkthroughs by the same problem ids — `goal`, `concepts[]`,
  ordered `steps[]` with snippets, `pitfalls[]`, and a `starter` scaffold that is structure + TODOs
  rather than the answer.

**(c) Problem index** — `/pscp` renders all 64 iJudge problems from `data/oj_problems.json` with
deadlines. Week numbers are **derived, not stored**: distinct expiry dates are sorted ascending and
the ordinal becomes the week (`lib/pscp/master.ts`).
*Status 15 Oct 2026: `/pscp` now renders the registry `data/pscp/problems.json` (235 problems),
built by `scripts/build_pscp_registry.py` from the course archive repo — the problem index
(`data/oj_problems.json`, 222 problems), `all_problems_detail.json` and the reference solutions come
from its `OP` branch, the authored `problem.md` write-ups from its main branch. `oj_problems.json`
carries a stored `week` (the derived ordinal in `master.ts` is only the fallback), and each registry
problem opens an in-browser workspace at `/pscp/<slug>`.*

### 3.4 Coursework compliance (adjacent to learning)

`/make/submission` and `/make/reflection` are form wizards that fill the official course templates
(`data/templates/*.md`) by replacing fenced ```` ```text ```` blocks positionally and filling
labelled table rows — with a guard that **refuses to guess** if the template's block count has
changed. Output goes to `localStorage` history (capped at 100 entries, halving on quota overflow)
and can be pushed to GitHub through 13 OAuth-backed API routes (11 GitHub routes + the 2 document
generators, `app/api/github/*` and `app/api/generate/*`).

---

## 4. Data Structures & Content Schemas

### 4.1 Course catalogue — `lib/courses/catalog.ts`

```ts
export type TrackKind =
  | "overview" | "summary" | "quiz" | "mock_exam" | "problems" | "library";

export interface CatalogCourse {
  code: string;              // "MFIT" — short code used in filenames and badges
  officialCode?: string;     // "06016401" — absent for courses with no published code
  slug: string;              // "Math-for-IT" — shared with content/courses/{officialCode}-{slug}/
  nameTh: string;
  nameEn: string;
  credits?: string;          // "3 (3-0-6)"
  group: CourseGroup;        // "Y1-S1" | "Y1-S2" | "EN-KMITL"
  portalHref?: string;
  officialUrl?: string;      // it.kmitl.ac.th subject page
  tracks: Partial<Record<TrackKind, string>>;   // ONLY tracks that actually render
}
```

The `tracks` map is deliberately partial: an absent track still renders in the UI as a **locked
slot**, so a student can distinguish "not built yet" from "does not exist."

*Status 15 Oct 2026 — the interface above is the scan's. `TrackKind` and `tracks` are gone;
`CatalogCourse` is identity only:*

```ts
export interface CatalogCourse {
  code: string; officialCode?: string; slug: string;
  nameTh: string; nameEn: string; credits?: string;
  group: CourseGroup;        // "Y1-S1" | "Y1-S2" | "EN-KMITL"
  portalHref?: string; officialUrl?: string;
}
```

*What a course offers is declared in `COURSE_BINDINGS` against the eleven modules (§4.2). The
"locked slot" behaviour survived: every unbound module of the spine still renders, as `coming_soon`.*

### 4.2 Track blueprint — `lib/course-tracks.ts` (deleted; successor at the end of this section)

```ts
export type TrackScope  = "all" | "midterm" | "final";
export type TrackStatus = "available" | "coming_soon" | "locked";

export interface CourseTrackItem {
  id: string;            // NOTE: a bare string, not TrackKind — see §5.2
  title: LText;
  subtitle: LText;
  icon?: TrackIcon;      // icon key, resolved client-side (components can't cross the boundary as data)
  href?: string;         // absent => not available
  scope: TrackScope;
  status: TrackStatus;
  badge?: LText;         // "65 ข้อ" / "65 questions", or the coming-soon marker
  stats?: LText;         // "7 PDF · 26 ภาพ"
}
```

Badges are **measured, not typed in**: `buildCourseTracks(code, hrefs, metrics)` joins the static
roadmap to live counts, a fix for a documented drift where the same bank was labelled "63 ข้อ" in
one file and "65 ข้อ" in another.

**Status 15 Oct 2026 — the successor.** `lib/course-tracks.ts`, `TrackScope`, `TrackStatus`,
`CourseTrackItem` and `buildCourseTracks()` no longer exist. The same job is split three ways
(`docs/LEARNING_BLUEPRINT.md` is the contract):

```ts
// lib/courses/spine.ts — pure data, importable by client components
export type ModuleId =                       // eleven, in fixed order, replacing TrackKind AND the open string ids
  | "orientation" | "syllabus_map" | "deep_summary"          // A · orient
  | "cram_sheet" | "key_cards"                               // B · compress
  | "drill" | "speed_quiz" | "applied"                       // C · retrieve
  | "mock_exam" | "weak_spot" | "archive";                   // D · prove
export type ModuleScope  = "all" | "midterm" | "final";      // was TrackScope
export type ModuleStatus = "available" | "coming_soon" | "locked";
export interface ModuleSpec { id; phase; order; segment; title; subtitle; scope; dod: LText[] }
export const STANDARD_SPINE: readonly ModuleSpec[];          // the eleven, declared once

// lib/courses/course-bindings.ts — the whole of a course's configuration
export interface ModuleBinding {
  docs?: ModuleDoc[];          // Markdown the module renders (loaders, so server-only)
  bank?: () => QuizQuestion[]; // question bank; needs `quizId`, the progress key
  quizId?: number;
  filled?: () => boolean;      // for modules whose content lives in a registry
  href?: string;               // route override (PSCP's problem hub)
  title?: LText; subtitle?: LText; scope?: ModuleScope; note?: LText;
}
export const COURSE_BINDINGS: Record<string, Partial<Record<ModuleId, ModuleBinding>>>;

// lib/courses/course-spine.ts — server-only join
resolveCourseSpine(code, courseDir, metrics): ResolvedModule[]   // always 11, status from what is bound
resolveModule() · moduleBinding() · readinessIndex()
```

`ResolvedModule` is plain data so it can cross into client components; the bindings hold loader
functions and stay on the server. Badges are still measured: the hub counts each bound bank and the
library cards and passes them in as `SpineMetrics`. `bun run readiness` prints how many of the eleven
each course fills.

### 4.3 Question schema — `lib/quiz/quiz.ts` (the one schema every bank shares)

```ts
export interface QuizQuestion {
  id: string;             // "3167-q3" — stable, used as React key and in progress.missed[]
  kind: QuizKind;
  prompt: LText;
  snippet?: string;       // <= 5 lines, never a full solution
  stdin?: string;         // predict-output only: verbatim from problem.md §4 or §6
  options: QuizOption[];  // 4 for mcq, 2 for true-false, empty for short-answer
  correctId: string;      // unused by short-answer (self-assessed)
  sourceRef: string;      // REQUIRED — "problem.md §5.2" or "main.py:7-14"
  chapter?: number;       // syllabus grouping
  explanationMd?: string; // question-level explanation as raw Markdown
}

export interface QuizOption {
  id: string;    // stable "a".."d", must survive option shuffling
  label: LText;
  why: LText;    // shown for BOTH the picked and the correct option
}
```

Two properties are pedagogically load-bearing:

- **`sourceRef` is mandatory.** Every question must name the line of source material it came from.
  `lib/quiz/quiz-content.ts` opens with a five-clause verification procedure: correct answers must
  describe something literally present in the reference `main.py`; every `predict-output` pair is
  either copied verbatim from the problem statement or produced by *actually running*
  `printf '<stdin>' | python3 main.py` (hand-computed answers are forbidden); every
  `spot-the-bug` snippet is real code with exactly one mutation; no item may contain a complete
  working entry point (grep-checked before commit).
- **`why` on every option**, so a wrong pick still teaches the misconception — not just "incorrect."

`explanationMd` is an **alternative mode**: when set, the engine renders it once after checking and
*skips the per-option `why` blocks*. Banks ported from Thai-only sources whose explanations are
Markdown tables (ITF) use this path.

Progress:

```ts
export interface QuizProblemProgress {
  best: number; total: number; attempts: number; lastAt: number;
  missed: string[];   // question ids missed on the MOST RECENT run
}
export type QuizProgress = Record<number, QuizProblemProgress>;  // keyed by OJ id
```

Because the key is a number tied to iJudge, subject banks need synthetic ids to avoid collision with
real 4-digit OJ ids: `EN_KMITL 900001`, `CHEM 900002`, `ICS 900003`, `MFIT 900004`, `ITF 900005`.
*Status 15 Oct 2026: `COMPRO_MOCK_QUIZ_ID = 900006` (in `course-bindings.ts`) joins them, and
`quiz-id-collision` in `content:check` now fails the build if two modules ever share a key.*

### 4.4 Asset schema — `lib/library/subject-library-ui.ts` (types) · `subject-library.ts` (data)

*(At the scan the types lived in `subject-library.ts`; they moved to the client-safe `-ui` file, which
`subject-library.ts` re-exports. The interface below is the scan's — the fields added since follow it.)*

```ts
export type AssetFileType = "pdf" | "image" | "md" | "file";
export type AssetScope    = "midterm" | "final";
export type AssetCategory =
  | "lecture"     // slide decks handed out by the lecturer
  | "cheatsheet"  // condensed summaries, recap sheets, formula cards
  | "exam"        // past papers, quizzes, mock exams
  | "exercise"    // worksheets, labs, practice sets, activities
  | "note"        // scanned handwriting and photographed whiteboards
  | "reference";  // lookup tables and other supporting material

export interface SubjectAsset {
  id: string;
  title: LText;
  description: LText;
  tags: string[];        // ["Ch.2", "Variables", "Cheatsheet"]
  fileType: AssetFileType;
  url: string;           // "/assets/en-kmitl/compro/cheatsheet.pdf"
  fileName: string;
  category?: AssetCategory;  // inferred from tags + fileType when unset
  courseCode?: string;
  scope?: AssetScope;        // unset = spans the whole term
  groupId?: string;          // collapses a page run of scans into one stack
  pages?: number;            // stamped from library-stats.json at request time
  sizeBytes?: number;        // ditto
}
```

*Status 15 Oct 2026 — fields added to `SubjectAsset` since the scan:*

```ts
  chapter?: number;          // join key to syllabus weeks and quiz questions; the manifest fills it only when
                             // the filename states one (week08, ch3, lec02, unit4), curated cards by hand
  week?: number;             // week or session number; the week view matches it first, falls back to `chapter`
  edition?: string;          // "2569" …
  isCurrentYear?: boolean;   // belongs to the current academic year
  status?: "primary" | "current_year" | "duplicate" | "compact" | "legacy";
  isDuplicate?: boolean;     // a copy of a canonical card …
  duplicateOf?: string;      // … named by card id or fileName
  sourceUrl?: string;        // the file's OnLearn page, shown as "ต้นทาง"
```

*The week view itself is data: `CourseSchedule` / `CourseWeek` / `CoursePart` in the same `-ui` file, filled
for ITF and ICS in `lib/library/course-weeks.ts` (`COURSE_SCHEDULES`) and served only through
`/api/library/assets` because it links the OnLearn lecture recordings.*

`category` and `fileType` are **orthogonal on purpose**: a cheatsheet and a lecture deck are both
PDFs but never belong on the same shelf. When `category` is absent, `resolveCategory()` walks a
bilingual tag vocabulary most-specific-first (`note` → `lecture` → `exercise` → `cheatsheet` →
`reference` → `exam`), falling back to `note` for images and `lecture` for everything else.

Generated entries (`lib/library/library-manifest.json`) use the identical shape, so the two layers merge
without adaptation:

```json
{ "id": "gen-chem-lectures-ch1-atomic-structure-pdf",
  "title": { "th": "Ch 1 Atomic Structure", "en": "Ch 1 Atomic Structure" },
  "description": { "th": "", "en": "" },
  "tags": ["CHEM", "lectures"],
  "category": "lecture", "fileType": "pdf",
  "url": "/assets/en-kmitl/chem/lectures/ch1-atomic-structure.pdf",
  "fileName": "ch1-atomic-structure.pdf", "courseCode": "CHEM" }
```

*(The current manifest also writes `"chapter": 1` here, because the filename says `ch1`.)*

### 4.5 Grader schemas — `lib/pscp/grader-types.ts` vs `lib/pscp/compro-labs.ts`

```ts
// (a) PSCP — iJudge-compatible
export type CaseStatus = "P" | "-" | "T" | "E";
export interface TestCase {
  id: string; stdin: string; expected: string;
  label: LText;
  official: boolean;   // true = verbatim from problem.md §4; false = extra case from §6
  tests?: LText;       // what this case checks, e.g. "boundary N=0"
}
export interface Pep8Violation {
  line: number; col: number; code: string;   // "E302" | "PSCP-NOT-MOD"
  message: LText; sourceRef?: string;        // pointer back into problem.md
}
export interface GradeReport {
  scoreString: string;          // "PPPP-"
  results: CaseResult[]; violations: Pep8Violation[]; ranAt: number;
}

// (b) ComPro — a parallel, incompatible model
export interface ComProCase { id: string; stdin: string; expected: string; }
export interface ComProProblem {
  id: string;            // "ch3-4" — stable across regeneration, used as the localStorage key
  week: number; item: number; title: string;
  descriptionMd: string; // problem statement as published by the portal (Thai)
  reference: string;     // a solution the portal graded 2/2
  cases: ComProCase[];
}
```

The ComPro case has **no `label`, no `official` flag, no `tests` rationale**, and its problem
record carries a full reference solution the PSCP model deliberately keeps in a separate file.

### 4.6 Markdown front matter

Only `content/courses/<dir>/summary.md` carries front matter, and it is **descriptive metadata that
nothing in the app reads**:

```yaml
---
code: "06016402"
slug: IT-Fundamentals
shortCode: ITF
nameTh: พื้นฐานทางด้านเทคโนโลยีสารสนเทศ
nameEn: Information Technology Fundamentals
credits: "3 (2-2-5)"
year: 1
term: 1
termId: Y1-S1
prerequisites: []
language: th
sources:
  - kmitl-archive/archive/Y1-S1/IT-Fundamentals
  - kmitl-archive/archive/Y1-S1-2569/IT-Fundamentals
  - ITF_bank (สไลด์ 1/2026 + คู่มือทบทวนกลางภาค)
---
```

Every field here **duplicates a field in `lib/courses/catalog.ts`** — including `year` and `term`, which
the runtime taxonomy does *not* model separately. `remark-frontmatter` is installed; the TOC
extractor strips the block with a regex; no loader parses it. Its real value is `sources:`, the
only provenance trail from a rendered page back to the archive it was built from.

*Status 15 Oct 2026: the sample above is the scan's. Front matter is now 14 fixed keys in a fixed
order (`code, slug, shortCode, nameTh, nameEn, credits, year, term, termId, prerequisites,
language, semester, updated, sources`); `sources:` lists official documents (slides, syllabus), not
paths into the archive repo. `bun run content:check` enforces the key names and order
(`overview-frontmatter`) but not the values, and the app still reads none of it.*

Every `summary.md` follows a five-part convention (documented in `content/courses/README.md`):
1. Course overview — code, names, credits, prerequisites, instructors, textbooks, grade weighting
2. **Content scope** — a week-by-week table explicitly split into midterm scope and final scope
3. Topic-by-topic summary — key concepts, terminology, formulas, comparison tables
4. **A blueprint for generating derived material** — question-bank proportions, generatable problem
   templates, mock-exam structure
5. Source inventory — which archive files exist, and which are text-extractable

Part 4 is unusual and worth flagging to the incoming expert: **these documents were written to be
machine-consumed** as generation specs for question banks, not only read by students.

*Status 15 Oct 2026: replaced by a six-section student-facing standard
(`docs/COURSE_OVERVIEW_STANDARD.md`: course info · scope · topic summaries · things to memorise ·
assessment and exam prep · learning resources), checked by `overview-sections`. Parts 4–5 of the old
convention (question-bank proportions, exercise templates, mock-exam structure, source inventory
with file paths) moved to a separate `blueprint.md` per course — 15 of 15 exist, none is rendered,
and `overview-internal-path` rejects local paths in `summary.md`. The "machine-consumed" material is
now confined to those blueprint files.*

The richest schema in the repository is not wired to anything —
`content/courses/06016401-Math-for-IT/archive/study-guide-curriculum.json`:

```json
{ "$schema_version": "1.0",
  "course": { "name_en": "...", "track": "Calculus", "year_semester": "Y1-S1",
              "known_course_codes": ["06016201","06016302","06026101"] },
  "scope": { "label": "Final Exam Scope", "weeks": [8,…,15],
             "source_slides": ["MFIT_Lec_Calculus-01", …],
             "pillars": ["Limit Literacy","Differentiation Mechanics",
                         "Derivative as a Tool","Integration Mechanics",
                         "Integration as a Tool"] },
  "assessment": { "grading_model": "all_or_nothing", "partial_credit": false,
                  "full_solution_required": true, "handwritten_required": true,
                  "zero_score_conditions": [ … ] } }
```

Learning pillars, an assessment model, zero-score conditions, and slide-level provenance — none of
it reachable from the running app (§5.4).
*Status 15 Oct 2026: still true for this file. `lib/courses/curriculum.ts` now exists with a typed
loader (`loadCurriculum()`) and helpers that turn the spec into chapters, pillars and plain-language
assessment rules, but nothing in `app/`, `components/`, `lib/` or `scripts/` calls it. The eight
weeks of final-scope Markdown that sat beside it are bound (§5.4).*

---

## 5. Systemic Inconsistencies & Constraints

*Ordered by how much they constrain a redesign, not by how easy they are to fix.*

### 5.1 Content lives in three parallel stores, chosen by a `switch` in every route

The same logical thing — "this course's study notes" — is loaded three different ways:

| Store | Access | Courses |
|---|---|---|
| `content/courses/<dir>/summary.md` | `loadCourseOverview(dir)` — generic, catalogue-driven | 13 (the default path) |
| `data/it-kmitl/<subj>/*.md` | `loadItf()` / `loadIcs()` / `loadMfit()` — one bespoke loader per subject, hardcoded filenames | ITF, ICS, MFIT |
| `data/en-kmitl/…` | `loadEnKmitl()` / `loadChem()` — hardcoded **Thai** filenames (`สรุปคอมโปร-Midterm.md`, `ข้อสอบ-Mock-Midterm-60ข้อ.md`) | COMPRO, CHEM |

Consequently every route repeats the same branch:

```ts
// app/courses/[dir]/summary/page.tsx
if (course.code === "ITF")        markdown = loadItf().summaryMd;
else if (course.code === "ICS")   markdown = loadIcs().summaryMd;
else if (course.code === "MFIT")  markdown = loadMfit().summaryMd;
else if (course.code === "COMPRO")markdown = loadEnKmitl().summaryMd;
else if (course.code === "CHEM")  markdown = loadChem().summaryMd;
else                              markdown = loadCourseOverview(cDir);
```

This branch (or a variant) appears in `summary/`, `exam/`, `quiz/`, and the hub page. **Adding a
course means editing 4–6 files**, and the branches have already diverged: `app/courses/[dir]/page.tsx`
builds MFIT's bank as `[...MFIT_QUIZ, ...MFIT_BLUEPRINT_QUIZ]` while
`app/courses/[dir]/quiz/page.tsx` builds it as `[...MFIT_BLUEPRINT_QUIZ, ...MFIT_QUIZ]` — the same
65 questions in **two different orders**, so the hub's description and the quiz's actual sequence
disagree. The quiz route also types both arrays as `any[]`, disabling the type system exactly where
the schemas would otherwise be enforced.

*Status 15 Oct 2026 — **partly resolved.** The route-level branch is gone: the per-module pages
(`summary/`, `exam/`, `quiz/`, …) were replaced by one `app/courses/[dir]/[module]/page.tsx` that
asks `resolveCourseSpine()` and `moduleBinding()`, and there is no `switch (course.code)`. The three
stores still exist (`content/courses/` now with 15 overviews, `data/it-kmitl/`, `data/en-kmitl/`,
read by `loadItf()` / `loadIcs()` / `loadMfit()` / `loadEnKmitl()` / `loadChem()`), but each is
reached only through a binding's `docs[].load`. MFIT's bank order is declared once
(`bank: () => [...MFIT_QUIZ, ...MFIT_BLUEPRINT_QUIZ]` in `course-bindings.ts`), and the quiz page that
cast it to `any[]` no longer exists. What is left: adding a course still touches 5–6 registries
(`catalog.ts`, `summary.md` + `blueprint.md`, `course-bindings.ts`, `COURSE_CHAPTERS_MAP`,
`SUBJECT_CODE` in the manifest script, optionally `SUBJECT_ASSETS`) — none of them a route — and two
hardcoded course checks remain (the `applied` module renders COMPRO's lab hub only; the library UI
hides duplicate files by default for ICS only).*

### 5.2 The track taxonomy has two incompatible vocabularies

`TrackKind` (catalogue) is a closed union of six. `TrackBlueprint.id` (roadmap) is an open `string`
and in practice includes four kinds the union does not know: `cram`, `learning_path`, `speed_quiz`,
`analysis`. These extra tracks reach the UI through a per-course `extraHrefs` bag assembled in the
page component:

```ts
extraHrefs: {
  cram:          mfit.cramMd         ? `${base}/cram` : undefined,
  learning_path: mfit.learningPathMd ? `${base}/plan` : undefined,
  speed_quiz:    mfit.mockExamMd     ? `${base}/mock` : undefined,
}
```

Effects: `TRACK_ORDER`, `TRACK_LABEL`, and `TrackChip` (which types its icon map as
`Record<TrackKind, LucideIcon>`) can only ever represent six of the ten track types, so the
compact chip row on course cards is **structurally incapable** of surfacing cram sheets, study
plans, or exam analyses. Note also that `speed_quiz` points at `/mock`, which renders a **Markdown
document**, not a quiz.

Track semantics are also overloaded per course. For PSCP the catalogue maps
`summary → /recommended` and `problems → /pscp` — so a student clicking **"Study Notes"** on PSCP
lands in a *problem hub*, in a different information architecture, with different navigation.

*Status 15 Oct 2026 — **resolved.** `TrackKind`, `TrackBlueprint`, `TRACK_ORDER`, `TRACK_LABEL`,
`TrackChip` and `extraHrefs` are gone (a grep for them in `app/`, `components/`, `lib/` and `scripts/`
finds only a comment). One closed union, `ModuleId` (11), names every module; cram sheets, study
plans and exam analyses are documents of `cram_sheet` / `orientation`, reachable from the same hub
grid. PSCP's overloaded mapping is gone too: its `deep_summary` now opens the course overview and its
`applied` module links to `/pscp`. One mismatch remains in the data rather than the taxonomy: MFIT's
`speed_quiz` is bound to a Markdown document (the timed drill), while the spine defines that module
as a timed mode.*

### 5.3 "Mock exam" is three unrelated things

| Course | `/exam` | `/mock` | Practice quiz |
|---|---|---|---|
| MFIT | past paper (Markdown) | mock exam (Markdown, badged `speed_quiz`) | 65 interactive items |
| ICS | past paper (Markdown) | — | 50 interactive items |
| COMPRO | — | — | 70 items = **10 practice + 60 mock, silently merged** |

A COMPRO student cannot take the mock exam as an exam: it has no start/stop, no timer, no separate
score, and no distinction from practice items. An MFIT student cannot take the mock exam
interactively at all — it is prose. The catalogue's `mock_exam` `TrackKind` is therefore assigned
inconsistently across the three cases, and no schema distinguishes "formative practice item" from
"summative exam item." Difficulty, mark value, and expected time-per-item are **absent from
`QuizQuestion` entirely**, so no blueprint-weighted paper can be assembled from the bank.

*Status 15 Oct 2026 — **partly resolved.** `mock_exam` is now defined once as "a mode, not a
document" (`STANDARD_SPINE`), and COMPRO's 60-question paper is its own `mock_exam` module with its
own score key (`quizId` 900006); the 10 practice items stay in `drill`, so the silent merge is gone.
ICS (practice paper with key) and MFIT (midterm and final mock papers) are still Markdown documents
of `mock_exam`, MFIT's timed drill is a Markdown document of `speed_quiz`, and there is still no
timer, no start/stop and no separate summative score. `QuizQuestion` still has no difficulty, mark
value or time per item.*

### 5.4 28 content files are orphaned — including the best-structured material in the repo

Nothing in `app/`, `lib/`, or `components/` references `content/courses/*/archive/`:

- **MFIT** — 8 weekly summaries + 8 weekly quizzes for **weeks 8–15 (the entire final-exam scope)**,
  a syllabus study guide, a mock exam, and `study-guide-curriculum.json` (§4.6).
- **ITF** — `midterm-study-guide.md` (the app instead serves the 242 KB `data/it-kmitl/itf/summarize.md`).
- **8 courses** — `archive/links.md` provenance files.

This is the single largest instructional gap found: **the only week-by-week paired
summary+quiz sequence in the entire project, and the only formal curriculum schema, are invisible
to students.** Everything the app does surface is midterm-scoped; the final-scope material exists
but is unreachable.

Separately, `data/templates/*.md` and `data/ai-guidelines/templates/*.md` are **byte-identical
duplicates** (verified by `diff`), with the wizards reading the former and the `/library` book
rendering the latter.

*Status 15 Oct 2026 — **mostly resolved.** `loadCourseDoc()` in `lib/courses/course-content.ts` was
added for exactly this and now feeds `ModuleBinding.docs`: MFIT's eight weekly summaries and eight
weekly quizzes (weeks 8–15), the syllabus study guide and the final mock paper are bound (18 files),
and ITF's `midterm-study-guide.md` is the second `deep_summary` document — **19 of the 28 files are
now reachable** (measured by running every binding's `load()` and recording which files were read).
Still read by nothing: the eight `archive/links.md` provenance files and MFIT's
`study-guide-curriculum.json` (the loader `loadCurriculum()` exists but has no caller, §4.6) — 9 — plus
two files added since the scan, PSCP `archive/readme.md` and ICS `RESOURCES_MANIFEST.md`. The 15
`blueprint.md` files are not rendered by design. ITF's `archive/week01–15.md` and
`course-materials-2569.md` and ICS's `archive/week01–07.md` and `course-materials-2569.md` were added
since the scan and are bound as the `syllabus_map` module. `bun run library:audit` reports the
Markdown orphans as `orphan-doc` warnings (9). The `data/templates` ≡ `data/ai-guidelines/templates`
duplication is unchanged: `diff -r` still reports the two folders identical.*

### 5.5 Bilingual support is structurally present but substantively absent in the largest banks

`LText` makes `th` required and `en` optional, with an explicit rationale: content ported from
Thai-only sources should fall back to Thai rather than ship an unproofread machine translation.
That rationale is sound. What it does not cover is the **fake-bilingual** pattern that dominates
the largest bank: all 60 items of `EN_KMITL_MOCK_EXAM` set `en` to the *same Thai string* as `th`,
so the locale toggle reports coverage that does not exist. `ITF_QUIZ` (63 items) more honestly omits
`en` altogether — two different conventions for the same situation.

Distractor feedback degrades in both files. ITF sets every wrong option's `why` to the placeholder
`"ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง"` ("this option is wrong — see the full explanation
below"), and the mock exam repeats one identical paragraph across all four distractors. The schema's
central pedagogical promise — *a wrong pick should still teach the misconception* — holds in
`quiz-content.ts`, `ics-quiz.ts`, `mfit-quiz.ts`, and `chem-quiz.ts`, and is hollow in the 123
items of ITF + COMPRO mock (**one third of all questions**).

*Status 15 Oct 2026 — **partly resolved.** `content:check` now counts this debt instead of leaving
it in prose (`lib/schemas/content.ts`; warnings, not errors): 157 `fake-bilingual` and 60
`why-duplicate` findings sit in COMPRO's `mock_exam` paper, plus 6 `why-duplicate` in CHEM `drill`;
nothing else is flagged. `why-placeholder` reports 0 only because a question carrying `explanationMd`
is exempt: `itf-quiz.ts` still holds 141 placeholder `why` strings, but all 63 ITF questions use
`explanationMd`, so the engine never shows them — the student reads the one Markdown explanation. The
user-visible hollow feedback is therefore the COMPRO mock paper (60 items) and the 6 CHEM items,
not "one third of all questions". The `LText` fallback rule is unchanged.*

### 5.6 Scope metadata covers 20% of the library; the shelves are flat

| Layer | Entries | With `scope` |
|---|---:|---:|
| Curated (`SUBJECT_ASSETS`) | 172 | **163** |
| Generated (`library-manifest.json`) | 670 | **0** |

The generator deliberately refuses to guess `scope` (§2.2 — correct, given per-course boundaries),
so the midterm/final segmented control — the library's primary organising affordance — is
inoperative for roughly 80% of cards. Coverage is also lopsided: ITF has 43 curated entries and ICS
32, while BFIT has 3 curated entries against **45 files** and PSTAT 4 against **117 files**. On
PSTAT and DSA the student sees a flat, unscoped, auto-titled wall of cards.

"Flat" is literal. The path contract is exactly four segments, with **no chapter or week level**, so
MFIT's shelf is 101 sibling cards and PSTAT's is 117. The only sub-grouping mechanism is `groupId`,
and only **two groups** are defined across the whole library. Crucially, `SubjectAsset` has **no
`chapter` field** — so although the app knows MFIT week 3 covers systems of linear equations
(`MFIT_CHAPTERS`) and knows the file `mfit-lec-week03-*.pdf` exists, **nothing links them**. Slides
cannot be filtered by syllabus week, and a quiz question cannot deep-link to the deck it came from.

*Status 15 Oct 2026 — **partly resolved.** Of 722 cards, 295 (41%) carry a `scope` — all curated;
the 408 generated-only cards still carry none, by design — and 289 (40%) are filed under a week or
chapter. `SubjectAsset` now has `chapter` (filled by the manifest when the filename says `week08` /
`ch3` / `lec02` / `unit4`) and `week`; ITF and ICS open on a week-by-week view built from
`COURSE_SCHEDULES`; `ASSET_GROUPS` has 24 groups (2 at the scan). The lopsidedness is unchanged — per
course, cards / with scope / filed by week: MFIT 110 / 26 / 51, PSTAT 117 / 2 / 39, DSA 85 / 14 / 17,
OOP 60 / 2 / 37, BFIT 45 / 0 / 8 — so those shelves are still mostly flat, auto-titled walls, and a
quiz question still cannot deep-link to the deck it came from. Re-measure with `bun run library:audit`
(a `coverage` line per course) or `jq '.courses[].counts' lib/library/resource-index.json`.*

### 5.7 Learner state is write-mostly, per-device, and never used to adapt

Everything is `localStorage` under 14 keys — no accounts, no sync, no cross-device continuity, and
loss on cache clear. Beyond that:

- `recordQuizAttempt()` writes `{ best, total, attempts, lastAt, missed[] }` for every run of every
  bank. **`loadQuizProgress()` is consumed in exactly one component** — `recommended-hub.tsx` (the
  PSCP OJ problem hub). The five subject quizzes — **308 of 368 questions** — record progress that
  is never read back, never displayed on the course hub, and never surfaces on `/`.
- `missed[]` is captured on every run but **never drives anything**: there is no "retry the ones you
  missed," no weak-chapter report, no spaced repetition, no review queue. The data required for
  targeted remediation is collected and discarded.
- The gate screen displays per-chapter question counts but offers **only one button: Start**. There
  is no way to take a chapter-scoped run — an MFIT student wanting to drill eigenvalues must sit all
  65 questions.
- Progress is keyed by an integer OJ id, forcing synthetic 900001–900005 ids for subject banks. It
  cannot key a chapter, a week, a track, or a course.
- The three practice systems keep **three independent progress stores**
  (`ihelp-quiz-progress-v1`, `ihelp-recommended-status`, `ihelp-compro-labs-v1`) with no
  common learner model between them.

*Status 15 Oct 2026 — **open.** Accounts now exist (§0.1) but quiz and lab progress is still not
stored with them: it stays in `localStorage`, under about 15 `ihelp-*` keys (`grep -rn localStorage
components lib` lists the users), and there are now **four** independent progress stores — the three
above plus `ihelp-pscp-progress-v1` for the `/pscp` workspace. `loadQuizProgress()` is still read by
exactly one component (`recommended-hub.tsx`); `missed[]` still drives nothing; the quiz gate still
lists chapters with their counts behind a single Start button (a chapter-scoped run is the first item
of the `drill` module's definition of done and is not built); the `weak_spot` module is unfilled in
all 15 courses. The course banks hold 308 of the 390 questions (six banks, since COMPRO's mock paper
is its own bank).*

### 5.8 Navigation bottlenecks on the syllabus → practice path

Tracing a student who reads the ICS syllabus and wants to practise Karnaugh maps:

1. `/` → course card → `/courses/06016411-Intro-to-Computer-Systems` (hub).
2. Hub → **Study Notes** → the full 32 KB summary in a single reader with a side outline.
3. The reader's only forward CTA is one `quizHref` button, which **falls back to the hub** when the
   course has no quiz — so on 10 of 15 courses "continue" means "go back."
4. Quiz → gate → **Start** → all 50 questions from chapter 1. K-maps are chapter 3; there is no
   jump, no filter, no resume.
5. Result screen offers Retry (the same 50) — not "retry the 9 you missed."

Additional friction:

- **Dead ends by design.** `cram`, `plan`, `analysis`, `mock`, and `labs` are reachable **only** from
  their course hub card. They are absent from the navbar, absent from `TrackChip` (§5.2), and absent
  from every reader's footer.
- **No lateral links.** A library asset cannot link to the quiz for its chapter; a quiz question's
  mandatory `sourceRef` (`"midterm-exam.md ข้อ 1(a)"`) is displayed as **plain text**, not as a link
  into the document it names — the provenance data is there and unexploited.
- **No search across content.** `subject-library.tsx` has search within one course's assets.
  Markdown documents, question banks, and problems are not searchable at all, jointly or severally.
- **No global progress or "resume" surface.** `/history` lists generated compliance documents only.

*Status 15 Oct 2026 — **partly resolved.** A reader's last button now goes forward:
`forwardHref()` in `app/courses/[dir]/[module]/page.tsx` sends a finished document to the course's
`drill` module and falls back to "take the quiz" only when there is none. `cram`, `plan`,
`analysis`, `mock` and `labs` are no longer reachable from one hub card only: they are slots of the
same 11-module grid (and `/plan`, `/analysis`, `/exam` redirect to their successors). Not done:
jumping into a chapter, "retry the ones you missed", search across Markdown, banks and problems (the
library has search within a course), a global progress or resume surface, and linking a question's
`sourceRef` (still plain text in `technique-quiz.tsx`).*

### 5.9 Delivery and build-shape constraints

| Constraint | Detail | Consequence for a redesign |
|---|---|---|
| **996 MB of assets in `public/`** | 621 PDFs committed to git and shipped in the deployment artifact | Every asset is public and unauthenticated; `content/courses/README.md` warns that lecture slides and the FE Edusoft workbook are **instructor/publisher copyright** and must not be publicly deployed without permission, and that files ending `-Completed` and the PSCP archive contain **real names and student IDs requiring sanitization**. `scripts/compress-assets.sh` exists behind a visual-regression gate |
| **Banks are TypeScript modules, not data** | `en-kmitl-mock-exam.ts` 271 KB · `subject-library.ts` 137 KB · `itf-quiz.ts` 202 KB · `quiz-content.ts` 131 KB | Content edits require a rebuild and a deploy; non-technical contributors cannot author questions; no validation layer (Zod is a dependency but is not applied to any bank) |
| **Every quiz bank is statically imported by the hub page** | `app/courses/[dir]/page.tsx` imports ITF + ICS + MFIT + EN-KMITL + mock + CHEM banks solely to compute badge counts | All 368 questions enter the server bundle for **every** course page, including courses with no quiz |
| **`export const dynamic = "force-dynamic"`** | On the hub, summary, quiz, library, exam, mock, cram, plan, and analysis routes | `generateStaticParams()` is defined on these routes but cannot take effect; fully static Markdown is re-read from disk on every request |
| **~16 MB Pyodide payload** | Vendored under `public/pyodide/` | Correctly gated behind an explicit user gesture, but it makes the code grader unusable on a slow connection and it is a per-session cost |
| **No test suite** | No test runner in `package.json`; correctness is enforced by prose procedures in file headers and by the dropzone SOP's manual verification gates | The verification discipline is real and unusually rigorous, but it is unautomated and unenforceable at review time |

*Status 15 Oct 2026, row by row — **partly resolved:***

- **Assets in `public/`:** out of git since 0.6.0 (`public/assets/` is gitignored, 949 MiB served from
  Supabase Storage). Access is not "public and unauthenticated" any more in one respect: the *list*
  of files needs an IT KMITL sign-in. The files themselves, apart from past papers, are in a public
  bucket and their paths are in this public repo. `ITF` and `FE` summaries still say their slides /
  workbook must not be published openly; `content/courses/README.md` and `FILE_STRUCTURE.md` track
  that decision. On personal data, the owner's rule of 15 Oct 2026 for new files is in
  `docs/DROPZONE_SOP.md` Phase 6.
- **Banks are TypeScript modules:** unchanged (`en-kmitl-mock-exam.ts` 265 KB, `quiz-content.ts`
  175 KB, `itf-quiz.ts` 197 KB, `subject-library.ts` 276 KB). The validation gap is closed:
  `lib/schemas/content.ts` applies Zod and the contract rules to every bank through `content:check`.
- **Every bank imported by the hub:** now by `lib/courses/course-bindings.ts`, which the hub, the
  module route, the sitemap and the readiness script all import, so all banks still load for every
  course page.
- **`force-dynamic`:** no course route declares it any more — the hub and `[module]` route define
  `generateStaticParams()`. `force-dynamic` remains on `/recommended`, `/make/*`, `/repo`, `/exams`
  and three API routes; `/pscp`, `/pscp/[slug]`, `/library` and `/version` are `force-static`.
- **Pyodide:** unchanged in design; `public/pyodide/` measures 13 MB on disk (the ~16 MB download
  figure was not re-measured).
- **No test suite:** still no unit-test runner, but the build is now gated by
  `bun run content:check` (`prebuild`), and `bun run readiness` and `bun run library:audit` exist.

### 5.10 Coverage is thin and unevenly distributed

| Course | Notes | Quiz | Mock | Library | Code practice |
|---|:--:|:--:|:--:|:--:|:--:|
| ITF | ● | 63 | — | 84 | — |
| ICS | ● | 50 | past paper | 103 | — |
| MFIT | ● | 65 | ● (md) | 101 | — |
| PSCP | via `/recommended` | 60 (per-problem) | — | 38 | 10 problems |
| COMPRO | ● | 70 (incl. mock) | merged | md only | 25 labs |
| CHEM | ● | 60 | — | 11 | — |
| CHARM · FE · SPORT · BFIT · DSA · OOP · PSTAT · FE2 · DL | ● (summary only) | — | — | 2–117 files | — |

**9 of 15 courses have exactly one modality: a summary document plus an unscoped file shelf.**
Six courses carry 100% of the assessment content. Every question in the system targets a **midterm**;
the final-exam material that does exist (MFIT weeks 8–15) is the orphaned set from §5.4.

*Status 15 Oct 2026 — **open.** Nine courses (CHARM, FE, SPORT, BFIT, DSA, OOP, PSTAT, FE2, DL) are
still `baseline()`-only, now 3/11 modules each (SPORT 2/11); average readiness is 3.9/11 (36%)
(`bun run readiness`). The same table today (cards = library cards, the merged curated + generated
count):*

| Course | Overview | Drill (questions) | Mock | Library cards | Code practice | Readiness |
|---|:--:|:--:|:--:|---:|:--:|:--:|
| ITF | ● + 15 weekly pages | 63 | — | 108 | — | 5/11 |
| ICS | ● + 7 session pages | 50 | practice paper (md) | 114 | — | 6/11 |
| MFIT | ● + weeks 8–15 (md) | 65 | midterm + final papers (md) | 110 | — | 8/11 |
| PSCP | ● | — | — | 38 | `/pscp` registry (235) · 14 recommended | 4/11 |
| COMPRO | ● | 10 | 60 (bank, own module) | 7 (in-app docs) | 25 labs | 6/11 |
| CHEM | ● | 60 | — | 12 | — | 4/11 |
| CHARM · FE · SPORT · BFIT · DSA · OOP · PSTAT · FE2 · DL | ● | — | — | 0–117 | — | 2–3/11 |

*The interactive banks are still midterm-scoped (ITF, ICS, COMPRO and CHEM bind theirs with
`scope: "midterm"`); MFIT's eight final-scope weekly quizzes are now reachable, but as Markdown
documents below the drill, not as a question bank.*

---

## Appendix A — Route map

*Updated 15 Oct 2026 (the scan's version is in git at `137d3b7`). "Declared" is what the route file
exports — `force-static`, `force-dynamic`, `generateStaticParams()` — read from the code; no build was
run, so the effective rendering mode is not claimed.*

| Route | Declared | Engine |
|---|---|---|
| `/` | — | `course-directory.tsx` + `Course` JSON-LD for 15 courses; per-course `readinessIndex()` |
| `/courses/[dir]` | `generateStaticParams()` (dir, code and slug forms) | `subject-hub.tsx` + `subject-track-grid.tsx` + `course-overview.tsx` — the 11-module grid |
| `/courses/[dir]/[module]` — `overview` · `map` · `summary` · `cram` · `cards` · `quiz` · `speed` · `labs` · `mock` · `weak-spots` · `library` | `generateStaticParams()` (every bound module without its own `href`) | **one route for all modules:** `module-reader.tsx` (docs; `MdView` notebook variant for `overview` and `summary`), `subject-quiz-gate.tsx` → `technique-quiz.tsx` (banks), `subject-library-gate.tsx` → `GET /api/library/assets` (`library`), `compro-lab-hub.tsx` (`labs`, COMPRO only; 404 for everything else) |
| `/courses/[dir]/exam` · `/plan` · `/analysis` | redirects in `next.config.ts` | → `/mock` · `/cram` · `/overview` |
| `/pscp` · `/pscp/[slug]` | `force-static` | `problems-view.tsx` (registry list) · `pscp-workspace.tsx` (statement + in-browser grader) |
| `/recommended` | `force-dynamic` | `recommended-hub.tsx` |
| `/recommended/[slug]` · `/quiz` · `/grade` | `generateStaticParams()` | `recommended-reader.tsx` · `technique-quiz.tsx` · `code-grader.tsx` |
| `/library` · `/library/[slug]` | `force-static` · `generateStaticParams()` | `library-toc.tsx` · `library-reader.tsx` (the AI-Guidelines "book") |
| `/make/submission` · `/make/reflection` | `force-dynamic` | form wizards |
| `/history` · `/version` | `force-static` | history of generated documents · changelog |
| `/repo` | `force-dynamic` | GitHub editor |
| `/exams` | `force-dynamic` | insider-only past-exam archive (`ihelp.exams`, bucket `ihelp-exams`) |
| `/upload` | — | community uploads; 404 unless `NEXT_PUBLIC_UPLOADS_ENABLED=1` |
| `/onboarding` · `/profile/[student_id]` (+ `/edit`) · `/auth/callback` · `/auth/unauthorized` | — | accounts |
| `/[slug]` | `generateStaticParams()` | Redirect resolver: OJ id / `oj####` / problem slug / library slug |
| `/pro` · `/robots.txt` · `/sitemap.xml` | — | marketing, SEO (the sitemap is generated from the spine) |
| `/api/github/*` (11) · `/api/generate/{submission,reflection}` | route handlers | OAuth + Markdown generation |
| `/api/library/assets` · `/api/me` · `/api/views` | `force-dynamic` | the gated library list (+ week schedule) · session probe · visitor counter |

## Appendix B — Where each concern is implemented

*Updated 15 Oct 2026 — paths follow the `lib/` regroup (`lib/README.md`); the scan listed
`lib/course-tracks.ts` and flat `lib/*.ts` banks.*

| Concern | File |
|---|---|
| Course registry / taxonomy (identity only) | `lib/courses/catalog.ts` |
| The 11 modules, phases, definitions of done | `lib/courses/spine.ts` (`STANDARD_SPINE`) |
| What each course fills (replaces the track roadmap and badges) | `lib/courses/course-bindings.ts` (`COURSE_BINDINGS`) · `lib/courses/course-spine.ts` (`resolveCourseSpine()`, `readinessIndex()`) · `scripts/readiness.ts` |
| Chapter/week lists (+ summary.md fallback parser) | `lib/courses/course-chapters.ts` |
| Course document loaders | `lib/courses/course-content.ts` (`loadCourseOverview` / `loadCourseDoc` / `loadCourseJson`), `lib/courses/it-kmitl.ts`, `lib/courses/en-kmitl.ts`, `lib/courses/curriculum.ts` (no caller) |
| Content contract (schemas, error/warn rules) | `lib/schemas/content.ts`, `scripts/validate-content.ts` (`bun run content:check`) |
| Question schema, grading, progress | `lib/quiz/quiz.ts` |
| Question banks | `lib/quiz/{quiz-content,itf-quiz,ics-quiz,mfit-quiz,chem-quiz,en-kmitl-quiz,en-kmitl-mock-exam}.ts` |
| Asset registry (curated) | `lib/library/subject-library.ts` (data) · `lib/library/subject-library-ui.ts` (types, client-safe) |
| Asset registry (generated) | `lib/library/library-manifest.json` ← `scripts/build-library-manifest.mjs` |
| Asset file stats | `lib/library/library-stats.json` ← `scripts/build-library-stats.mjs` |
| Resource index, audit, search | `lib/library/resource-index.json` (+ `.schema.json`) ← `scripts/library-index.ts`; `scripts/library-audit.ts`; `scripts/library-find.ts`; shared code `scripts/library-shared.ts` |
| Week-by-week schedules (ITF, ICS) | `lib/library/course-weeks.ts` |
| Storage URLs, keys, upload, exam signing | `lib/library/asset-url.ts`, `lib/library/storage-key.ts`, `scripts/sync-library-assets.ts`, `lib/library/library-exams.ts` |
| The gated library list | `app/api/library/assets/route.ts`, `components/subject-library-gate.tsx` |
| Sign-in, roles, database | `lib/auth/verify.ts`, `lib/auth/guards.ts`, `lib/supabase/*`, `proxy.ts`, `db/schema.ts` |
| Python execution | `lib/pscp/pyodide-client.ts`, `public/workers/python-runner.worker.js` |
| Grading contracts | `lib/pscp/grader-types.ts`, `lib/pscp/testcases.ts`, `lib/pscp/pep8-rules.ts` |
| ComPro labs | `lib/pscp/compro-labs.ts`, `lib/pscp/compro-lessons.ts`, `data/en-kmitl/compro/labs.json` |
| Problem index | `lib/pscp/master.ts`, `lib/pscp/pscp.ts`, `data/oj_problems.json`, `data/pscp/problems.json` |
| Markdown reader and typography | `components/md-view.tsx`, `lib/docs/remark-notebook.ts`, `docs/FONTS.md` |
| Localization | `lib/ltext.ts` (`LText`, `t()`, server-safe), `lib/i18n.tsx` (React context; re-exports them) |
| Ingest procedure | `docs/DROPZONE_SOP.md`, `FILE_STRUCTURE.md` |

## Appendix C — Strengths worth preserving in any redesign

1. **Provenance is mandatory and enforced.** `sourceRef` on every question, `sources:` front matter
   on every summary, `official: true/false` on every test case, and a documented verification
   procedure requiring answers to be *executed* rather than reasoned about.
2. **Scope-as-metadata.** The refusal to make midterm/final a directory level, with the reasoning
   written down, is a correct call that survives instructors moving exam weeks.
3. **Two-layer asset registry.** Auto-manifest as the floor (nothing on disk is invisible), curated
   entries on top (bilingual titles, descriptions, scope) — new files appear without a human, and
   human effort compounds where it adds real value.
4. **Measured badges.** Counts are computed from the banks they describe, closing a documented
   drift bug.
5. **Honest failure states.** Locked/coming-soon track slots, `LText` falling back to Thai instead
   of machine-translating, and low-confidence dropzone files held rather than guessed.
6. **Distractor-level teaching** in the four hand-authored banks — each wrong option explains the
   specific misconception that produces it.
7. **Zero-install applied practice.** In-browser CPython with iJudge-compatible scoring and
   non-blocking style feedback that links back to the teaching material.
8. **Contracts a machine checks** *(added 15 Oct 2026)*. `bun run content:check` gates every build
   (banks, spine, bindings, recommended problems, the overview standard), `bun run readiness` turns
   "is the platform getting better" into one number, and `bun run library:audit` says where the cards,
   the files, the docs and the buckets disagree. (Item 5's "locked/coming-soon track slots" are now
   the eleven module slots of the spine.)

