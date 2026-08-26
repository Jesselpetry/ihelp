# iHelp — State of the Architecture

**Instructional architecture audit, prepared for handoff to an EdTech / E-Learning Platform expert.**

| | |
|---|---|
| Repository | `ihelp` (private, Next.js 16.2.10 / React 19.2.4, App Router) |
| Version | `0.5.0` |
| Branch scanned | `compressed` @ `7f8448c` |
| Date of scan | 2026-08-26 |
| Audience | Redesign of the instructional architecture — taxonomy, content schemas, learning modality coverage |
| Scope of this document | Descriptive only. No source files were modified during this scan. |

> **Reading note.** This is an audit of *what exists*, not a proposal. Section 5 flags structural
> problems for the incoming expert; it does not prescribe fixes. All counts are measured from the
> tree at the commit above, not quoted from existing docs.

---

## 1. Executive Summary

iHelp is a **single-tenant, zero-backend study portal** for first-year Information Technology
students at KMITL (King Mongkut's Institute of Technology Ladkrabang). It is not an LMS: there is
no user account, no enrolment, no gradebook, no instructor role, and no database. Every piece of
content ships **inside the deployment artifact** — as Markdown files, as TypeScript modules, or as
PDFs under `public/`. All learner state lives in the browser's `localStorage`.

### Scale

| Dimension | Count | Where |
|---|---:|---|
| Courses in the catalogue | **15** | `lib/catalog.ts` — 7× Y1-S1, 6× Y1-S2, 2× cross-faculty (EN-KMITL) |
| Courses with a resource library | **14** | 13 auto-manifested + ComPro (in-app docs only). `SPORT` has zero assets |
| Course overview documents | **13** | `content/courses/<dir>/summary.md`, 247 KB total |
| Long-form study documents | **12** | `data/it-kmitl/`, `data/en-kmitl/`, 742 KB total |
| Orphaned content files | **28** | `content/courses/*/archive/` — on disk, wired to no route (§5.4) |
| Media assets | **670 files / 996 MB** | `public/assets/` — 621 PDFs (**12,263 pages**), 26 webp, 10 jpg, 7 `.circ`, 4 xlsx, 1 docx, 1 txt |
| Curated asset records | **172** | Hand-written entries in `lib/subject-library.ts` (137 KB) |
| Generated asset records | **670** | `lib/library-manifest.json` (335 KB), built from the file tree |
| Quiz / exam questions | **368** | 6 subject banks + 10 per-problem banks, all typed `QuizQuestion` |
| Executable coding problems | **35** | 10 OJ "recommended" problems (66 cases) + 25 ComPro labs (123 cases) |
| Problem-set index | **64** | `data/oj_problems.json` — iJudge export incl. 14 learning logs |
| Policy / how-to documents | **12** | `data/ai-guidelines/`, rendered as a paginated "book" at `/library` |
| App routes | **25 pages / 13 API routes** | 13 of 13 API routes are GitHub OAuth + 2 document generators |

### Question bank composition

| Bank | Questions | Course | Notes |
|---|---:|---|---|
| `ITF_QUIZ` | 63 | ITF (06016402) | Thai-only; 12 self-assessed short-answer, 6 true/false |
| `ICS_QUIZ` | 50 | ICS (06016411) | Bilingual; derived from the 1/2564 past paper |
| `MFIT_QUIZ` + `MFIT_BLUEPRINT_QUIZ` | 45 + 20 | MFIT (06016401) | Blueprint set mirrors the instructor's 10-question exam plan |
| `CHEM_QUIZ` | 60 | CHEM | 5-choice (ก–จ), unusual among the banks (all others are 4-choice) |
| `EN_KMITL_CURATED_QUIZ` + `EN_KMITL_MOCK_EXAM` | 10 + 60 | COMPRO (01006012) | Mock exam is auto-generated from a Markdown paper |
| `QUIZ_BANK` (per-OJ) | 60 | PSCP | 10 problems × 6 questions, keyed by iJudge problem id |

**Item-type distribution:** `mcq` 304 · `predict-output` 24 · `short-answer` 12 · `spot-the-bug` 12 ·
`pep8` 10 · `true-false` 6. **83% of all assessment is four-option multiple choice.**

### Primary user paths

There are three, and they barely intersect:

1. **Course path** — `/` (directory of 15 course cards) → `/courses/<officialCode>-<Slug>` (subject
   hub with a track grid) → one of `summary` · `quiz` · `library` · `exam` · `mock` · `cram` ·
   `plan` · `analysis` · `labs`. This is the path 13 of 15 courses use.
2. **PSCP problem path** — `/pscp` (64 iJudge problems with deadlines) and `/recommended`
   (10 annotated problems) → `/recommended/<slug>` (reader) → `/recommended/<slug>/quiz` (technique
   self-test) or `/recommended/<slug>/grade` (in-browser Python grader).
3. **Coursework-compliance path** — `/make/submission` and `/make/reflection` (form wizards that
   fill official Markdown templates) → `/history` → optional GitHub push (`/repo`, 13 API routes).

Path 3 is an academic-integrity workflow, not learning content, but it occupies a third of the
codebase's server surface.

---

## 2. Curriculum Taxonomy & Information Architecture

### 2.1 How subjects are grouped

The catalogue is a **flat array of 15 records** in `lib/catalog.ts`, partitioned by a single
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

### 2.2 How time and scope are partitioned

Three **independent, non-reconciled** partitioning schemes coexist:

**(a) Track scope — `TrackScope`, on the course-hub card.**

```ts
export type TrackScope = "all" | "midterm" | "final";   // lib/course-tracks.ts
```
Declared per track blueprint. In practice nearly every blueprint is hardcoded to `"midterm"`,
reflecting that the portal was built during a midterm cram cycle.

**(b) Asset scope — `AssetScope`, on the media library card.**

```ts
export type AssetScope = "midterm" | "final";           // lib/subject-library.ts (optional field)
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

**(c) Chapter / week partitioning — `SubjectChapter`.**
Each quiz bank ships its own chapter list (`ITF_CHAPTERS`, `ICS_CHAPTERS`, `MFIT_CHAPTERS`,
`EN_KMITL_CHAPTERS`, `CHEM_CHAPTERS`), and the label varies per subject: MFIT uses
`สัปดาห์ที่` (Week), ITF uses `Lecture`, ICS/OOP use `บทที่` (Ch.), FE uses `Unit`. For a course with
no registered chapter list, `lib/course-chapters.ts` **screen-scrapes section 2 of its own
`summary.md`** with a regex over Markdown table rows, sniffing the header cell for
`สัปดาห์` / `บท` / `Unit` to pick the label. This is the only place in the system where a syllabus
is parsed rather than authored.

### 2.3 How metadata links files to the UI

Four registries, layered:

```
lib/catalog.ts          15 course records + a `tracks` map of TrackKind -> href
        │                  (a track appears here only once it actually renders)
        ▼
lib/course-tracks.ts    per-course roadmap blueprints -> buildCourseTracks(code, hrefs, metrics)
        │                  status = "available" when an href exists, else "coming_soon"
        ▼
app/courses/[dir]/page.tsx   a switch on course code that supplies bespoke copy, extra
        │                    hrefs (cram/plan/analysis/mock), and live question counts
        ▼
lib/subject-library.ts  mergedAssets(code) = curated entries ++ generated manifest entries
                        (curated wins on matching URL), then withAssetStats() stamps
                        page counts and byte sizes from lib/library-stats.json
```

Two of these files are **build artifacts and must not be hand-edited**:

| File | Generator | Contents |
|---|---|---|
| `lib/library-manifest.json` (335 KB) | `npm run library:manifest` | One card per file under `public/assets/`, title humanized from the filename |
| `lib/library-stats.json` (72 KB) | `npm run library:stats` | 670 entries of `{ sizeBytes, pages? }` — PDF page counts must be computed at build time |

The asset path contract is **exactly four segments**:

```
public/assets/<namespace>/<subject>/<category>/<filename>
              it-kmitl     mfit      lectures    mfit-lec-week03-vectors.pdf
```

`scripts/build-library-manifest.mjs` skips anything shallower — a file written one level up lands
on disk but never appears in the UI. Category folders map to gallery shelves:
`lectures|slides → lecture`, `sheets → cheatsheet`, `exams → exam`,
`exercises|labs|activities|worksheets|cases → exercise`, `notes|pages → note`,
`references|misc → reference`.

**Ingest.** New files land in `_dropzone/` (git-ignored staging) and an AI agent processes them
against `docs/DROPZONE_SOP.md`: scan → classify by *reading inside the file*, never by filename →
rename to the sanitized convention → move to the four-segment path → regenerate both manifests →
clear the dropzone. The SOP explicitly forbids guessing `scope` and requires low-confidence files
to be held rather than filed.

---

## 3. Learning Modalities & Asset Types

### 3.1 Passive learning

| Modality | Storage | Engine | Coverage |
|---|---|---|---|
| **Course overview / syllabus** | `content/courses/<dir>/summary.md` with YAML front matter | `course-summary-card.tsx` — collapsible card with live outline panel and read-progress | 13 courses |
| **Study notes (long form)** | `data/it-kmitl/<subj>/summarize.md`, `data/en-kmitl/…` | `subject-summary-reader.tsx` + `toc-side-panel.tsx` | ITF, ICS, MFIT, COMPRO, CHEM |
| **Cram sheet** | `data/it-kmitl/mfit/cram.md` | same reader | MFIT only |
| **Study plan / learning path** | `data/it-kmitl/mfit/learning-path.md` | same reader | MFIT only (a 6-block, day-before-the-exam sprint) |
| **Exam analysis** | `data/it-kmitl/ics/analysis.md` | same reader | ICS only (mark distribution across topics) |
| **Lecture slides / past papers** | `public/assets/**` (621 PDFs, 12,263 pages) | `subject-library.tsx` (1,642 lines) — gallery/list toggle, category shelves, midterm/final segmented control, tag chips, search, in-modal PDF preview with zoom/pan/fullscreen | 13 courses |
| **Handwritten note scans** | 26 webp + 10 jpg | same, collapsed into stacks via `groupId` | 2 groups defined (`itf-class-notes`, `ics-midterm-2564-scan`) |
| **Policy book** | `data/ai-guidelines/**` (12 docs, th/en pairs) | `library-reader.tsx` — prev/next pagination, "doc *n* of *N*" | Course-wide |

Markdown rendering is uniform: `react-markdown` + `remark-gfm` + `remark-math` + `rehype-katex`
(LaTeX is used heavily by MFIT and PSTAT) with a shared heading-slug/TOC extractor (`lib/toc.ts`)
that preserves Thai characters in anchors.

### 3.2 Active assessment

One engine serves **all** question types: `components/technique-quiz.tsx` (585 lines), fronted by
`components/subject-quiz-gate.tsx` for subject banks.

Flow: gate screen listing chapters and per-chapter question counts → **Start** → one question per
screen → select → **Check** → feedback → Next → summary screen with per-question review and Retry.
Keyboard shortcuts (1–9 to select, Enter to advance) are wired.

Supported kinds (`QuizKind` in `lib/quiz.ts`):

| Kind | Grading | Count | Notes |
|---|---|---:|---|
| `mcq` | `selectedId === correctId` | 304 | 4 options everywhere except CHEM (5, ก–จ) |
| `predict-output` | same | 24 | Shows only the I/O contract in prose plus a concrete `stdin` — deliberately *no* code, so the student reasons from spec |
| `spot-the-bug` | same | 12 | ≤ 5 real lines from a reference solution with exactly one mutation |
| `pep8` | same | 10 | Style/lint reasoning |
| `true-false` | same | 6 | 2 options |
| `short-answer` | **self-assessed** — the learner reveals a model answer and marks `self:correct` / `self:wrong` | 12 | Open essays; no string matching is attempted |

**Mock exams** are not a distinct engine or schema. Two different things carry the name:
- COMPRO's 60-question mock paper is `QuizQuestion[]` and is **concatenated into the practice quiz**
  (`[...EN_KMITL_QUIZ, ...EN_KMITL_MOCK_EXAM]`), so the "quiz" a COMPRO student takes is 70 items.
- MFIT's mock exam is **Markdown** rendered by the reader at `/courses/…/mock`; ICS's and MFIT's
  real past papers are Markdown at `/courses/…/exam`.

There is **no timer** anywhere in the codebase (`grep` for `setInterval`/countdown in the quiz
engine returns nothing), despite the welcome modal advertising `พร้อมเฉลยละเอียดและจับเวลา`
("with detailed solutions and timing").

### 3.3 Applied practice

Two **independent** code-practice systems with different data models, different UIs, and different
persistence keys:

**(a) PSCP recommended problems** — `/recommended/<slug>/grade`, `components/code-grader.tsx`
(690 lines) over `lib/pyodide-client.ts`.

- Runs **CPython in the browser** via Pyodide in a dedicated Web Worker
  (`public/workers/python-runner.worker.js`), with the full runtime vendored into `public/pyodide/`.
- Lazy-load contract is explicit and documented: nothing may trigger the ~16 MB Pyodide download
  except a deliberate user gesture. A single worker is reused across runs; a timed-out worker is
  terminated and the reference dropped so the next call cold-starts rather than hanging.
- Grading is **iJudge-compatible**: per-case status `P` (passed) / `-` (wrong answer) / `T` (time
  limit) / `E` (runtime error), presented as a score string like `PPPP-`, with a diff view.
- Style feedback is separate and **non-blocking**: `pycodestyle` via micropip, plus four bespoke
  course rules (`PSCP-NOT-MOD`, `PSCP-CONSIDER-IN`, `PSCP-IMPORT-ALIAS`, `PSCP-CONST-CASE`) in
  `lib/pep8-rules.ts`, each able to carry a `sourceRef` back into the teaching material.
- Coverage: **10 problems, 66 test cases** (`lib/testcases.ts`), split `official: true` (copied
  verbatim from the problem's §4) and `official: false` (extra cases from §6, each annotated with
  what it tests, e.g. "boundary N=0").

**(b) ComPro labs** — `/courses/01006012-Computer-Programming/labs`,
`components/compro-lab-hub.tsx` (819 lines).

- **25 problems across weeks 1–5, 123 cases**, in `data/en-kmitl/compro/labs.json`, regenerated by
  `scripts/build_compro_labs.py` from the course portal and re-verified by piping recovered stdin
  through a reference solution in a real CPython subprocess.
- Grading is **byte-exact stdout match** (the portal grades on spacing quirks), not the P/-/T/E model.
- Teaching material is deliberately kept out of the generated JSON: `lib/compro-lessons.ts` (1,204
  lines, hand-written Thai) keys walkthroughs by the same problem ids — `goal`, `concepts[]`,
  ordered `steps[]` with snippets, `pitfalls[]`, and a `starter` scaffold that is structure + TODOs
  rather than the answer.

**(c) Problem index** — `/pscp` renders all 64 iJudge problems from `data/oj_problems.json` with
deadlines. Week numbers are **derived, not stored**: distinct expiry dates are sorted ascending and
the ordinal becomes the week (`lib/master.ts`).

### 3.4 Coursework compliance (adjacent to learning)

`/make/submission` and `/make/reflection` are form wizards that fill the official course templates
(`data/templates/*.md`) by replacing fenced ```` ```text ```` blocks positionally and filling
labelled table rows — with a guard that **refuses to guess** if the template's block count has
changed. Output goes to `localStorage` history (capped at 100 entries, halving on quota overflow)
and can be pushed to GitHub through 13 OAuth-backed API routes.

---

## 4. Data Structures & Content Schemas

### 4.1 Course catalogue — `lib/catalog.ts`

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

### 4.2 Track blueprint — `lib/course-tracks.ts`

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

### 4.3 Question schema — `lib/quiz.ts` (the one schema every bank shares)

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
  `lib/quiz-content.ts` opens with a five-clause verification procedure: correct answers must
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

### 4.4 Asset schema — `lib/subject-library.ts`

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

`category` and `fileType` are **orthogonal on purpose**: a cheatsheet and a lecture deck are both
PDFs but never belong on the same shelf. When `category` is absent, `resolveCategory()` walks a
bilingual tag vocabulary most-specific-first (`note` → `lecture` → `exercise` → `cheatsheet` →
`reference` → `exam`), falling back to `note` for images and `lecture` for everything else.

Generated entries (`lib/library-manifest.json`) use the identical shape, so the two layers merge
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

### 4.5 Grader schemas — `lib/grader-types.ts` vs `lib/compro-labs.ts`

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

Every field here **duplicates a field in `lib/catalog.ts`** — including `year` and `term`, which
the runtime taxonomy does *not* model separately. `remark-frontmatter` is installed; the TOC
extractor strips the block with a regex; no loader parses it. Its real value is `sources:`, the
only provenance trail from a rendered page back to the archive it was built from.

Every `summary.md` follows a five-part convention (documented in `content/courses/README.md`):
1. Course overview — code, names, credits, prerequisites, instructors, textbooks, grade weighting
2. **Content scope** — a week-by-week table explicitly split into midterm scope and final scope
3. Topic-by-topic summary — key concepts, terminology, formulas, comparison tables
4. **A blueprint for generating derived material** — question-bank proportions, generatable problem
   templates, mock-exam structure
5. Source inventory — which archive files exist, and which are text-extractable

Part 4 is unusual and worth flagging to the incoming expert: **these documents were written to be
machine-consumed** as generation specs for question banks, not only read by students.

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

### 5.9 Delivery and build-shape constraints

| Constraint | Detail | Consequence for a redesign |
|---|---|---|
| **996 MB of assets in `public/`** | 621 PDFs committed to git and shipped in the deployment artifact | Every asset is public and unauthenticated; `content/courses/README.md` warns that lecture slides and the FE Edusoft workbook are **instructor/publisher copyright** and must not be publicly deployed without permission, and that files ending `-Completed` and the PSCP archive contain **real names and student IDs requiring sanitization**. `scripts/compress-assets.sh` exists behind a visual-regression gate |
| **Banks are TypeScript modules, not data** | `en-kmitl-mock-exam.ts` 271 KB · `subject-library.ts` 137 KB · `itf-quiz.ts` 202 KB · `quiz-content.ts` 131 KB | Content edits require a rebuild and a deploy; non-technical contributors cannot author questions; no validation layer (Zod is a dependency but is not applied to any bank) |
| **Every quiz bank is statically imported by the hub page** | `app/courses/[dir]/page.tsx` imports ITF + ICS + MFIT + EN-KMITL + mock + CHEM banks solely to compute badge counts | All 368 questions enter the server bundle for **every** course page, including courses with no quiz |
| **`export const dynamic = "force-dynamic"`** | On the hub, summary, quiz, library, exam, mock, cram, plan, and analysis routes | `generateStaticParams()` is defined on these routes but cannot take effect; fully static Markdown is re-read from disk on every request |
| **~16 MB Pyodide payload** | Vendored under `public/pyodide/` | Correctly gated behind an explicit user gesture, but it makes the code grader unusable on a slow connection and it is a per-session cost |
| **No test suite** | No test runner in `package.json`; correctness is enforced by prose procedures in file headers and by the dropzone SOP's manual verification gates | The verification discipline is real and unusually rigorous, but it is unautomated and unenforceable at review time |

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

---

## Appendix A — Route map

| Route | Rendering | Engine |
|---|---|---|
| `/` | dynamic | `course-directory.tsx` + `Course` JSON-LD for 15 courses |
| `/courses/[dir]` | dynamic | `subject-hub.tsx` + `subject-track-grid.tsx` + `course-summary-card.tsx` |
| `/courses/[dir]/summary` · `/exam` · `/mock` · `/cram` · `/plan` · `/analysis` | dynamic | `subject-summary-reader.tsx` (one shared Markdown reader, five entry points) |
| `/courses/[dir]/quiz` | dynamic | `subject-quiz-gate.tsx` → `technique-quiz.tsx` |
| `/courses/[dir]/library` | dynamic | `subject-library.tsx` |
| `/courses/[dir]/labs` | dynamic | `compro-lab-hub.tsx` (COMPRO only; 404 for everything else) |
| `/pscp` | static | `pscp-modules.tsx` + `problems-view.tsx` (64 iJudge problems) |
| `/recommended` · `/recommended/[slug]` | dynamic | `recommended-hub.tsx` · `recommended-reader.tsx` |
| `/recommended/[slug]/quiz` · `/grade` | dynamic | `technique-quiz.tsx` · `code-grader.tsx` |
| `/library` · `/library/[slug]` | static | `library-toc.tsx` · `library-reader.tsx` |
| `/make/submission` · `/make/reflection` · `/history` · `/repo` | mixed | wizards, history, GitHub editor |
| `/[slug]` | dynamic | Redirect resolver: OJ id / `oj####` / problem slug / library slug |
| `/pro` · `/version` · `/robots.txt` · `/sitemap.xml` | static | marketing, changelog, SEO |
| `/api/github/*` (11) · `/api/generate/{submission,reflection}` | route handlers | OAuth + Markdown generation |

## Appendix B — Where each concern is implemented

| Concern | File |
|---|---|
| Course registry / taxonomy | `lib/catalog.ts` |
| Track roadmap and badges | `lib/course-tracks.ts` |
| Chapter/week lists (+ summary.md fallback parser) | `lib/course-chapters.ts` |
| Course document loaders | `lib/course-content.ts`, `lib/it-kmitl.ts`, `lib/en-kmitl.ts` |
| Question schema, grading, progress | `lib/quiz.ts` |
| Question banks | `lib/{quiz-content,itf-quiz,ics-quiz,mfit-quiz,chem-quiz,en-kmitl-quiz,en-kmitl-mock-exam}.ts` |
| Asset registry (curated) | `lib/subject-library.ts` |
| Asset registry (generated) | `lib/library-manifest.json` ← `scripts/build-library-manifest.mjs` |
| Asset file stats | `lib/library-stats.json` ← `scripts/build-library-stats.mjs` |
| Python execution | `lib/pyodide-client.ts`, `public/workers/python-runner.worker.js` |
| Grading contracts | `lib/grader-types.ts`, `lib/testcases.ts`, `lib/pep8-rules.ts` |
| ComPro labs | `lib/compro-labs.ts`, `lib/compro-lessons.ts`, `data/en-kmitl/compro/labs.json` |
| Problem index | `lib/master.ts`, `data/oj_problems.json` |
| Localization | `lib/i18n.tsx` (`LText`, `t()`) |
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

