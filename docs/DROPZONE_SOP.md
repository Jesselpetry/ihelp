# Dropzone SOP

**Standard Operating Procedure for processing `_dropzone/`.**

You are an AI agent. A human has dropped unsorted course files into `_dropzone/`
and pointed you here. Execute the phases below **in order**. Do not skip the
verification gates.

Written in English because it is agent-facing; all paths, folder names, and
Thai keyword tables are literal values — reproduce them exactly.

> **Read [`../FILE_STRUCTURE.md`](../FILE_STRUCTURE.md) before your first run.**
> This SOP is the procedure; that file is the contract it enforces.

---

## Layout note — read this before you move anything

The layout is **not** `public/assets/[subject]/[scope]/`. Exam scope is a
**metadata field, not a directory level**. The real, mandatory shape is:

```
public/assets/<namespace>/<subject>/<category>/<filename>
```

Exactly four segments. `scripts/build-library-manifest.mjs` skips anything
shallower, so a file written to `<subject>/<scope>/<file>` lands on disk but
**never appears in the UI**. Scope is carried by the `scope?: "midterm" | "final"`
field on `SubjectAsset` in `lib/subject-library.ts`.

Rationale: some material spans the whole term (course plans, Z-tables,
submission guides) and belongs in neither bucket; a file's exam scope can change
when an instructor moves the exam week, and editing a field is cheaper than
moving a file and chasing every URL that referenced it.

---

## Phase 0 — Preflight

```bash
ls -la _dropzone/
git status --short
```

**Stop and report instead of proceeding if:**

- `_dropzone/` contains only `.gitkeep` and `README.md` → nothing to do, say so
- the working tree has uncommitted changes unrelated to this run → tell the
  human; a dropzone run touches many files and should start from a clean tree

---

## Phase 1 — Scan & Analyze

For **every** file in `_dropzone/` (recurse into subfolders), collect:

| Signal | How |
| --- | --- |
| Filename | as-is, before sanitizing |
| Size | `du -h` — flag anything over 20 MB |
| Type | extension, plus `file <path>` to catch mislabeled extensions |
| Content | see below |

Peek inside — **never classify on filename alone**:

| Type | How to read it |
| --- | --- |
| **PDF** | **Use your own file-reading tool with a page range** (in Claude Code: `Read` with `pages: "1-2"`). It renders the pages directly — no CLI dependency, and it handles scanned PDFs that carry no text layer. |
| Images (`.jpg`, `.png`, `.webp`) | Same tool — read the file and describe the header |
| Markdown / text | `head -40 "_dropzone/FILE.md"` |
| `.circ`, `.xlsx`, `.docx` | Not readable as text. Classify from filename plus sibling files in the same drop, or hold. |

> **Do not reach for `pdftotext` first.** It is not installed on this machine
> (verified 2026-08-26), and neither are `pypdf`, `pymupdf`, `mutool`, or
> `qpdf`. Your native reader has no such dependency and works on scans.
>
> If you genuinely need bulk CLI extraction, the human can install it with
> `brew install poppler` — but ask first, do not install it yourself.

For a scanned PDF with no text layer, read the rendered page and classify from
what you see — a course header, an exam paper title, a week number. If the pages
are illegible, **mark the file low-confidence and hold it** (Phase 6) rather
than guessing.

Produce a table before touching anything:

```
FILE | SUBJECT | CONFIDENCE | CATEGORY | SCOPE | TARGET PATH
```

---

## Phase 2 — Classification

### 2.1 Subject mapping

Resolve to one of these codes. The `<subject>` folder is the code **lowercased**.
`<namespace>` is `it-kmitl` for everything except ComPro and Chem, which are
`en-kmitl`.

| Code | Official | Namespace | Course dir (`content/courses/`) |
| --- | --- | --- | --- |
| `ITF` | 06016402 | it-kmitl | `06016402-IT-Fundamentals` |
| `ICS` | 06016411 | it-kmitl | `06016411-Intro-to-Computer-Systems` |
| `MFIT` | 06016401 | it-kmitl | `06016401-Math-for-IT` |
| `PSCP` | 06066303 | it-kmitl | `06066303-Problem-Solving-and-Computer-Programming` |
| `CHARM` | 90641001 | it-kmitl | `90641001-Charm-School` |
| `FE` | 90644007 | it-kmitl | `90644007-Foundation-English` |
| `SPORT` | 90641003 | it-kmitl | `90641003-Sports-and-Recreational-Activities` |
| `BFIT` | 06066101 | it-kmitl | `06066101-Business-for-IT` |
| `DSA` | 06066301 | it-kmitl | `06066301-Data-Structures-and-Algorithms` |
| `OOP` | 06016408 | it-kmitl | `06016408-Object-Oriented-Programming` |
| `PSTAT` | 06066001 | it-kmitl | `06066001-Probability-and-Statistics` |
| `FE2` | 90644008 | it-kmitl | `90644008-Foundation-English-II` |
| `DL` | 90641002 | it-kmitl | `90641002-Digital-Literacy` |
| `COMPRO` | 01006012 | **en-kmitl** | `01006012-Computer-Programming` |
| `CHEM` | — | **en-kmitl** | `General-Chemistry` |

Resolve in this order, stopping at the first hit:

1. **Official subject code** in the filename or on the document's first page
   (`06016402`, `01006012`, …). Most reliable — an exam header almost always
   carries it.
2. **Code prefix** in the filename: `ITF_`, `ics-`, `MFIT-1-2026-`, …
3. **Course name**, Thai or English, in filename or content — match against
   `nameTh` / `nameEn` in `lib/catalog.ts`.
4. **Topic keywords** (weakest — use only to confirm, never alone):

| Code | Keywords |
| --- | --- |
| `ITF` | พื้นฐานเทคโนโลยีสารสนเทศ, Computing Essentials, hardware, storage, OS, database, network |
| `ICS` | ระบบคอมพิวเตอร์, boolean algebra, K-map, canonical form, MUX, flip-flop, Logisim, `.circ` |
| `MFIT` | คณิตศาสตร์สำหรับ IT, linear algebra, matrix, eigen, limit, derivative, integral, calculus |
| `PSCP` | การแก้ปัญหา, flowchart, Python, iJudge, OJ, pseudocode |
| `CHARM` | โรงเรียนสร้างเสน่ห์, DISC, SWOT, ใบงาน, generation gap, personality |
| `FE` / `FE2` | Foundation English, Edusoft, workbook, unit, oral exam |
| `BFIT` | ธุรกิจสำหรับ IT, economics, marketing, accounting, future value |
| `DSA` | โครงสร้างข้อมูล, linked list, Big-O, recursion, sorting, greedy, dynamic programming |
| `OOP` | เชิงวัตถุ, class, inheritance, polymorphism, encapsulation, Java |
| `PSTAT` | ความน่าจะเป็น, สถิติ, distribution, hypothesis, Z-table, T-table |
| `DL` | ความฉลาดทางดิจิทัล, digital citizen, DQ framework |
| `COMPRO` | 01006012, Computer Programming, Python, คอมโปร |
| `CHEM` | เคมี, chemical bonding, stoichiometry, periodic table, atomic structure |

**Two subjects plausible → do not pick.** Hold the file (Phase 6).

### 2.2 Category mapping

`<category>` is the folder name on disk. Pick from this list — inventing a new
one silently dumps the file into the generic `reference` shelf.

| Folder | Use for |
| --- | --- |
| `lectures/` | instructor slide decks, handouts |
| `slides/` | a parallel deck set (e.g. a different academic year) |
| `sheets/` | summaries, cram sheets, formula cards, recaps, answer keys |
| `exams/` | past papers, quizzes, mock exams, midterms, finals |
| `exercises/` | worksheets, homework, practice sets, pretests |
| `labs/` | lab sheets, practical assignments |
| `activities/` | in-class activities |
| `worksheets/` | blank worksheets meant to be filled in and submitted |
| `cases/` | case studies |
| `notes/` | scanned handwriting, photographed whiteboards |
| `pages/` | an ordered page run of one scanned document |
| `references/` | lookup tables, critical-value tables, supporting material |
| `misc/` | genuinely uncategorised — use sparingly |

Adding a new category folder means also adding it to `SHELF` in
`scripts/build-library-manifest.mjs`. Do not add one without telling the human.

### 2.3 Scope mapping (`midterm` / `final`)

**The boundary is per-course and comes from that course's own
`content/courses/<dir>/summary.md`, section 2 (ขอบเขตเนื้อหา). Read it. Never
infer from a week number alone** — the courses do not split at the same place.

Current boundaries, verified against the summaries:

| Code | `midterm` | `final` |
| --- | --- | --- |
| `ITF` | Week 01–07 | Week 08–15 |
| `ICS` | Week 01–07 | Week 08+ |
| `MFIT` | Week 1–7 · linear algebra | Week 9–16 · calculus |
| `PSCP` | Week 01–07 | Week 08–14 |
| `BFIT` | **Week 01–08** | Week 09–14 |
| `DSA` | **บทที่ 2–7** | บทที่ 8–14 |
| `OOP` | **บทที่ 0–7** | บทที่ 8–14 |
| `PSTAT` | **บทที่ 1–6/7** | บทที่ 8–13 |
| `FE` | Unit 1–2 | Unit 3+ |
| `FE2` | Unit 3–5 + oral | Unit 8–10 + oral |
| `COMPRO` | Ch. 1–5 + appendix | — |
| `CHEM` | by chapter — check `summary.md` | — |
| `CHARM`, `DL`, `SPORT` | activity-based, no confirmed written split — **leave scope unset** | |

Signals, strongest first:

1. Explicit word in filename or content: `midterm`, `กลางภาค` → `midterm`;
   `final`, `ปลายภาค` → `final`
2. Week / chapter / unit number, resolved through the table above
3. Topic, matched against section 2 of the course's `summary.md`

**Leave `scope` unset when the material spans the term** — course plans,
syllabi, lookup tables, submission guides, full-term reference sheets. Unset is
a correct answer, not a failure: the card then shows under both milestones.
Guessing is worse than omitting.

---

## Phase 3 — Sanitize filenames

kebab-case only: lowercase, `-` separators, no spaces, no `_`, no uppercase.

```
✅ itf-lec-week08-database.pdf
❌ ITF_Lec_Week08-Database.pdf
❌ Ch1 Atomic structure.pdf
```

Rules, applied in order:

1. Split camelCase / PascalCase: `TimeResponse` → `time-response`,
   `ITSystem` → `it-system`
2. `_` and spaces → `-`
3. Strip anything that is not `a-z`, `0-9`, `-`, or Thai
4. Collapse repeated `-`, trim leading/trailing
5. Lowercase the extension too

Preferred shape — `<subject>-<doctype>-<topic>.<ext>`, where `<doctype>` is one
of `lec` `sheet` `ex` `hw` `lab` `quiz` `note` `ref` `midterm` `final` `archive`.
The manifest reads these back into card titles: `itf-lec-week08-database.pdf`
renders as **Lecture · Week 08 Database**.

Zero-pad week and chapter numbers to two digits (`week08`, not `week8`) so they
sort correctly.

**Collision handling.** If the target path already exists:

```bash
shasum -a 256 "_dropzone/FILE.pdf" "public/assets/<ns>/<subj>/<cat>/FILE.pdf"
```

- **Identical hashes** → the file is already ingested. Delete the dropzone copy.
  Report it as a duplicate. Do not re-add.
- **Different hashes** → both are real. Suffix the newcomer with its term or
  year: `charm-ex-worksheet02-disc-swot-y1-s1-2569.pdf`. Never overwrite.

---

## Phase 3.5 — Compress before filing

Every file you add ships inside the Vercel deployment, and that deployment has a
hard ceiling: **100 MB on Hobby, 1 GB on Pro** for static uploads. An
uncompressed archive PDF is typically 3-5x larger than it needs to be, so
compress before moving, not after.

### Setup (once)

```bash
brew install ghostscript      # the only tool that recompresses PDF internals
```

Nothing else in the toolchain does this job. `pdftotext`, `qpdf`, `pypdf` and
`mutool` are **not** installed here. ImageMagick, `cwebp`, `sips` and Pillow are,
but they only handle images -- and images are a rounding error in this repo:
621 of 670 files are PDFs, and they are 99.8% of the bytes.

### PDFs

```bash
gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.5 -dPDFSETTINGS=/ebook \
   -dNOPAUSE -dQUIET -dBATCH -dSAFER \
   -sOutputFile=out.pdf "in.pdf"
```

`/ebook` downsamples images to 150 dpi and keeps text as real text -- lecture
slides and scanned exams stay comfortably readable on screen and on paper.

| Profile | Image dpi | Use |
| --- | --- | --- |
| `/screen` | 72 | Too soft for scanned handwriting. Avoid. |
| `/ebook` | **150** | **Default.** Readable, typically 60-75% smaller. |
| `/printer` | 300 | Only when `/ebook` visibly ruins a diagram. |

On scanned material whose images already sit below 150 dpi, all three profiles
produce identical output -- `/ebook` costs nothing over `/screen` there, which
is why it is the default rather than a compromise.

### Three checks that are not optional

> **Ghostscript silently destroys some PDFs.** On a measured sample of this
> repo, **5 of 16 files (31%)** came back with every embedded raster image
> *dropped* — comparison tables, diagrams and scanned figures simply gone,
> leaving only vector text behind. Damage ran 18-86% RMSE. Page count, file size
> and exit status were all perfect on every one of them. Annotated GoodNotes
> exports and some scanner output are the usual victims.
>
> **You cannot detect this without rendering the pages and comparing them.**

**1. It must actually be smaller.** Ghostscript will happily rewrite an
already-optimised PDF into something larger. Keep it only if it lands under ~95%
of the original size.

**2. Page count must match.**

```bash
gs -q -dNODISPLAY -dNOSAFER -c "(FILE.pdf) (r) file runpdfbegin pdfpagecount = quit"
```

Necessary but nowhere near sufficient — see the warning above.

**3. It must still look the same.** Render the first and middle page of both
files and compare:

```bash
gs -sDEVICE=png16m -r55 -dFirstPage=1 -dLastPage=1 -dNOPAUSE -dQUIET -dBATCH \
   -sOutputFile=before.png "original.pdf"
gs -sDEVICE=png16m -r55 -dFirstPage=1 -dLastPage=1 -dNOPAUSE -dQUIET -dBATCH \
   -sOutputFile=after.png  "compressed.pdf"
magick compare -metric RMSE before.png after.png null:
```

Divide the reported value by 65535 for a percentage. **Reject at 6% or above.**
Clean recompressions measured under 5%; damaged ones started at 18%. If you are
compressing a handful of files by hand, just look at both renders.

**Never compress a file twice.** Each pass re-encodes lossy images, so a second
run visibly degrades quality for almost no further saving. A file already in
`public/assets/` has been through this once.

### Doing it in bulk

`scripts/compress-assets.sh` applies all of the above across the whole asset
tree in parallel, enforcing both checks per file and writing a
`.compress-report.tsv` you can audit:

```bash
./scripts/compress-assets.sh 8      # 8 parallel workers
npm run library:build               # sizes and page counts changed -- regenerate
```

It enforces all three gates per file and writes `.compress-report.tsv` with a
verdict and RMSE per file. Audit the rejects before trusting the run:

```bash
awk -F'\t' '$2!="SHRUNK"' .compress-report.tsv   # everything left uncompressed
```

Expect a meaningful share of files to come back `KEPT-VISUAL`. That is the gate
working, not a bug — those files stay at full size on purpose.

`library-stats.json` records `sizeBytes` and `pages` for every asset, and the
gallery prints both on each card, so **regenerating the manifests after
compressing is mandatory**, not housekeeping.

### Images

Rare here, but when one shows up:

```bash
# photo or scan -> webp, visually lossless at q=82
cwebp -q 82 in.jpg -o out.webp

# resize anything wider than 2000px first
magick in.png -resize '2000x>' -strip out.png
```

Prefer `.webp` for scans and photos. Keep `.png` only for screenshots with sharp
text or flat colour, where webp's chroma handling can smear glyph edges.

### Thresholds

| Size after compressing | Action |
| --- | --- |
| under 5 MB | file it |
| 5-20 MB | file it, mention it in the report |
| over 20 MB | **hold it** (Phase 6) -- ask before adding |

---

## Phase 4 — File operations

Create the target directory if missing, then move (never copy — the dropzone
must end up empty):

```bash
mkdir -p public/assets/<namespace>/<subject>/<category>
mv "_dropzone/ORIGINAL NAME.pdf" \
   "public/assets/<namespace>/<subject>/<category>/sanitized-name.pdf"
```

### Routing by file type

| Type | Destination |
| --- | --- |
| `.pdf`, `.jpg`, `.png`, `.webp` | `public/assets/<ns>/<subject>/<category>/` |
| `.circ`, `.xlsx`, `.docx`, `.txt`, `.zip` | same — they get `fileType: "file"` and render as download-only cards |
| `.md` that is a **course overview** | `content/courses/<course-dir>/summary.md` — **see warning below** |
| `.md` / `.json`, other study material | `content/courses/<course-dir>/archive/` |

> ⚠️ **`summary.md` is hand-maintained and follows a mandatory 6-section
> structure.** Never overwrite it from the dropzone. If a dropped file looks
> like a course overview, hold it (Phase 6) and let the human merge it.

Files over 20 MB: compress first, or hold and report. GitHub rejects anything
over 100 MB outright.

---

## Phase 5 — Data linkage

### 5.1 Regenerate the manifests — always

```bash
npm run library:build
```

This runs `library:manifest` then `library:stats`. Every moved asset gets a card
from its filename alone, so the file is visible in the UI after this step even
with no hand-written entry.

**`lib/library-manifest.json` and `lib/library-stats.json` are generated. Never
hand-edit them.**

### 5.2 Add curated entries — for anything carrying a scope

The manifest cannot supply a bilingual title, a description, or an exam scope.
For every file where you determined a **confident** scope in Phase 2.3, add an
entry to the right `*_ASSETS` array in `lib/subject-library.ts`:

```ts
{
  id: "itf-lec-week08-database",
  title: { th: "สัปดาห์ 8 — ฐานข้อมูล", en: "Week 8 — Databases" },
  description: {
    th: "…อธิบายว่าไฟล์นี้ครอบคลุมอะไร",
    en: "…what this file actually covers",
  },
  tags: ["Week 08", "Database"],
  category: "lecture",
  scope: "final",
  fileType: "pdf",
  url: "/assets/it-kmitl/itf/lectures/itf-lec-week08-database.pdf",
  fileName: "itf-lec-week08-database.pdf",
},
```

Rules:

- `id` must be unique across the whole file
- both `th` and `en` are required on `title` and `description` — never
  single-language. Write real Thai, not a transliteration of the English
- omit `scope` entirely for term-spanning material; do not write `scope: undefined`
- a curated entry beats the generated card when `url` matches, so the URL must
  be byte-identical to the file's real path

### 5.3 Check the course is reachable

A shelf with no declared track is unreachable — the files exist but nothing
links to them. In `lib/catalog.ts`, confirm the course's `tracks` includes:

```ts
library: "/courses/<officialCode>-<slug>/library",
```

If the course had no assets before this run, add it. `SPORT` is currently the
only course with no `library` track, because it has no material.

### 5.4 Verify

All three must pass before you report success:

```bash
npx tsc --noEmit          # must exit 0
npm run lint              # must not add errors beyond the 16 pre-existing
npm run build             # must complete
```

Pre-existing lint errors live in `app/courses/[dir]/quiz/page.tsx`,
`lib/draft.ts`, and vendored `public/pyodide/pyodide.asm.js`. Anything else is
yours — fix it.

Then confirm every curated URL still resolves:

```bash
node -e '
const fs=require("fs");
const urls=[...fs.readFileSync("lib/subject-library.ts","utf8")
  .matchAll(/url: "(\/assets\/[^"]+)"/g)].map(m=>m[1].split("#")[0]);
const bad=urls.filter(u=>!fs.existsSync("public"+u));
console.log(bad.length?"BROKEN:\n"+bad.join("\n"):"all "+urls.length+" urls resolve");
'
```

---

## Phase 6 — Hold, do not guess

Move to `_dropzone/_hold/` and report — **never** invent a classification:

- subject ambiguous or unrecognised
- scope genuinely unclear **and** the material does not look term-spanning
- looks like a course overview that would overwrite a `summary.md`
- corrupt, zero-byte, or unreadable
- over 20 MB and not compressible
- **contains a person's name or student ID that is not the repo owner's**

That last one is a hard stop. Files ending `-completed` are filled-in
worksheets. The owner's own ID (`69070027` / ฉัททัณฑ์ เพททริ) is theirs to
publish; a classmate's is not. Group work — anything like
`lab06-lab-work-group-1.pdf` — must be checked inside before it moves.

Also flag, but do not block, material marked `ห้ามเผยแพร่สาธารณะ` in a course's
`summary.md`: instructor slide decks and the FE Edusoft workbook are
copyright-restricted and still awaiting clearance before a public deploy.

---

## Phase 7 — Cleanup

The dropzone must end empty except its two tracked files:

```bash
find _dropzone -type f ! -name '.gitkeep' ! -name 'README.md' \
  ! -path '*/_hold/*'
```

Any output means Phase 4 did not finish — go back, do not delete. When the list
is empty:

```bash
find _dropzone -type d -empty -delete 2>/dev/null
mkdir -p _dropzone && touch _dropzone/.gitkeep
```

`_dropzone/` contents are gitignored except `.gitkeep` and `README.md`, so
nothing you leave there ships — but leaving files there means the next run
processes them twice.

---

## Phase 8 — Report

Do **not** commit unless the human asks. Report:

```
Processed N files from _dropzone/

MOVED
  <original name>  →  <target path>   [SUBJECT · CATEGORY · SCOPE]
  …

CURATED       M entries added to lib/subject-library.ts
DUPLICATES    K files already present, deleted from dropzone
HELD          J files in _dropzone/_hold/ — <one-line reason each>

Manifest: X cards (+Y)
Verify:   tsc ✓   lint ✓ (16 pre-existing)   build ✓

Not committed. Uncommitted paths: <git status --short summary>
```

Then update `CHANGELOG.md` under `## [Unreleased]` if the run added material a
user would notice — this repo's `CONTRIBUTING.md` requires it.

---

## Quick reference

```bash
ls -la _dropzone/                       # 1. scan
#    peek: read _dropzone/F.pdf with your own reader, pages 1-2
gs -sDEVICE=pdfwrite -dPDFSETTINGS=/ebook -dNOPAUSE -dQUIET -dBATCH \
   -sOutputFile=small.pdf "_dropzone/F.pdf"     # 2. compress (verify pages!)
mkdir -p public/assets/<ns>/<subj>/<cat>        # 3. route
mv small.pdf "public/assets/<ns>/<subj>/<cat>/f.pdf"
npm run library:build                   # 4. manifests
#    edit lib/subject-library.ts for scoped entries
npm run assets:sync                     # 5. upload to Supabase Storage
npx tsc --noEmit && npm run build       # 6. verify
find _dropzone -type f ! -name '.gitkeep' ! -name 'README.md'   # 7. must be empty
```

> `public/assets/` is **gitignored**. The files are served from the public
> `ihelp-library` Supabase Storage bucket, not from the repo — committing ~908 MB
> of PDFs pushed the git pack to 881 MB and ran the Vercel build container out of
> disk. A file that is routed but not synced will 404 in production even though it
> works locally, so step 5 is not optional. `npm run assets:sync` only uploads what
> the bucket is missing, so re-running it is cheap.

| Never | Because |
| --- | --- |
| create a `midterm/` or `final/` folder | scope is metadata; the manifest skips 3-segment paths |
| hand-edit `library-manifest.json` / `library-stats.json` | generated by `npm run library:build` |
| overwrite `summary.md` | hand-maintained, 6-section contract |
| guess a subject or scope | hold it instead — Phase 6 |
| compress a file already in public/assets/ | it went through once; a second lossy pass degrades it |
| trust page count alone after compressing | it passes while every embedded image is dropped — render and compare |
| move a file with someone else's student ID | hard stop |
| commit unprompted | the human reviews first |
| expect a routed file to appear in production without `npm run assets:sync` | `public/assets/` is gitignored; the bucket is the source of truth |
