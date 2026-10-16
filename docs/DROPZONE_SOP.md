# Dropzone SOP

**Standard Operating Procedure for processing `_dropzone/`.**

Last verified: 15 Oct 2026 — against `scripts/`, `lib/library/`, `package.json`, and a local run of
`bun run library:audit`.

You are an AI agent. A human has dropped unsorted course files into `_dropzone/`
and pointed you here. Execute the phases below **in order**. Do not skip the
verification gates.

Written in English because it is agent-facing; all paths, folder names, and
Thai keyword tables are literal values — reproduce them exactly.

> **Read [`../FILE_STRUCTURE.md`](../FILE_STRUCTURE.md) before your first run.**
> This SOP is the procedure; that file is the contract it enforces.
> [`../AGENTS.md`](../AGENTS.md) lists the rules that are easy to break (generated
> files, what is actually private, asking before uploads).

---

## Layout note — read this before you move anything

The layout is **not** `public/assets/[subject]/[scope]/`. Exam scope is a
**metadata field, not a directory level**. The real, mandatory shape is:

```
public/assets/<namespace>/<subject>/<category>/<filename>
```

Exactly four segments. `scripts/build-library-manifest.mjs` skips anything
shallower, and any `<subject>` folder it has no code for (`SUBJECT_CODE`), so a
file written to `<subject>/<scope>/<file>` lands on disk but **never appears in
the UI** (`bun run library:audit` reports it as `unmapped-file`). Scope is
carried by the `scope?: "midterm" | "final"` field on `SubjectAsset` in
`lib/library/subject-library-ui.ts`, written on the card in
`lib/library/subject-library.ts`.

Rationale: some material spans the whole term (course plans, Z-tables,
submission guides) and belongs in neither bucket; a file's exam scope can change
when an instructor moves the exam week, and editing a field is cheaper than
moving a file and chasing every URL that referenced it.

---

## Access model — who can read what

Read this before deciding that something is "safe to file". It is stated here
neutrally; it is not a to-do list.

| Layer | Who can read it | Mechanism (code) |
| --- | --- | --- |
| The library page's **file list** | a signed-in KMITL IT student (a campus `@kmitl.ac.th` address whose student id carries faculty code `07`) — enforced in production | `GET /api/library/assets` (`app/api/library/assets/route.ts`). The page itself is static and ships no card data |
| **Document pages with file tables** — the ITF/ICS weekly pages and any other module reader | any visitor; these pages are not behind login (`proxy.ts` guards only `/onboarding`, `/upload`, `/exams`) | the reader receives the course's non-exam cards as props (`assetsForCourse()` in `app/courses/[dir]/[module]/page.tsx`) so a table can show matching file cards |
| **Non-exam files** — public bucket `ihelp-library` | anyone who holds the object URL; the paths are also in this public repo (`lib/library/subject-library.ts`, `library-manifest.json`) | `assetUrl()` builds the public Storage URL |
| **Past exams** — private bucket `ihelp-library-exams` | insider / admin accounts only, through 10-minute signed URLs | `isRestrictedAsset()` decides the bucket; `libraryExamsForInsider()` signs |

So "behind login" is **not** "private". Only past exams are private. Treat
everything you file outside an exam card as public.

---

## Phase 0 — Preflight

```bash
ls -la _dropzone/
git status --short
bun run library:audit | tail -40     # baseline: what is already wrong before you touch anything
```

Note the audit's error and warning counts (on 15 Oct 2026 the baseline was 0
errors and 10 warnings: 9 `orphan-doc`, 1 `bad-filename`). Findings that existed
before your run are not yours to fix silently — list them in the Phase 8 report.

**Where the files come from.** Course files are posted on OnLearn, which needs a
login, so you cannot fetch them. The owner downloads them to
`~/Downloads/_INBOX/<COURSE>/` (for example `_INBOX/ITF/`). If you are asked to
pick up new files, look there, **copy (do not move)** them into `_dropzone/`,
and leave the INBOX alone. Everything below works on `_dropzone/`.

**Stop and report instead of proceeding if:**

- `_dropzone/` contains only `.gitkeep`, `README.md` and `_hold/` → nothing to do, say so
- the working tree has uncommitted changes unrelated to this run → tell the
  human; a dropzone run touches many files and should start from a clean tree

---

## Phase 1 — Scan & Analyze

For **every** file in `_dropzone/` (recurse into subfolders, skip `_hold/`), collect:

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
| `.circ`, `.xlsx`, `.docx`, `.accdb` | Not readable as text. Classify from filename plus sibling files in the same drop, or hold. |
| `.pka` (Cisco Packet Tracer) | A graded artefact — do not read it, do not file it (Phase 6) |

> **Do not reach for `pdftotext` first.** It is not installed on this machine
> (re-checked 15 Oct 2026), and neither are `pdfinfo`, `pypdf`, `pymupdf`, `mutool`,
> or `qpdf`. Your native reader has no such dependency and works on scans.
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
`en-kmitl`. The codes, official codes and directory names below are the rows of
`COURSES` in `lib/courses/catalog.ts`.

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
   `nameTh` / `nameEn` in `lib/courses/catalog.ts`.
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

Current boundaries, re-read from the 15 summaries on 15 Oct 2026:

| Code | `midterm` | `final` |
| --- | --- | --- |
| `ITF` | Week 01–07 | Week 08–15 |
| `ICS` | Track A · Week 01–07 (digital logic) | Track B · sessions 8–15 (hardware) — its handouts number these 1–7 again, so `(week, scope)` is the key |
| `MFIT` | Week 1–7 · linear algebra | Week 9–16 · calculus — the library's calculus decks and homework count weeks 8–15 (the midterm week is skipped); that is the summary's 9–16 |
| `PSCP` | chapters 1–5 (everything before Week 08) | Week 08–14 |
| `BFIT` | **Week 01–08** | Week 09–14 |
| `DSA` | **บทที่ 2–7** | บทที่ 8–14 |
| `OOP` | **บทที่ 0–7** | บทที่ 8–14 |
| `PSTAT` | **บทที่ 1–6/7** | บทที่ 8–13 |
| `FE` | Unit 1–2 | Unit 3–10 |
| `FE2` | Unit 3–5 + oral | Unit 8–10 + oral |
| `COMPRO` | Ch. 1–5 + appendix | — (no final-scope data yet) |
| `CHEM` | Ch. 1–5 | — (no final-scope data yet) |
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

kebab-case only: lowercase ASCII, `-` separators, no spaces, no `_`, no uppercase.
`bun run library:audit` warns `bad-filename` for anything else.

```
✅ itf-lec-week08-database.pdf
❌ ITF_Lec_Week08-Database.pdf
❌ Ch1 Atomic structure.pdf
```

Rules, applied in order:

1. Split camelCase / PascalCase: `TimeResponse` → `time-response`,
   `ITSystem` → `it-system`
2. `_` and spaces → `-`
3. Strip anything that is not `a-z`, `0-9`, or `-`. Thai characters are not kept in
   the filename — `library:audit` flags them (`bad-filename`), and a non-ASCII name
   needs a transliterated bucket key from `storageKey()` anyway. Write an English
   slug and let the card's Thai `title` carry the Thai name
4. Collapse repeated `-`, trim leading/trailing
5. Lowercase the extension too

Preferred shape — `<subject>-<doctype>-<topic>.<ext>`, where `<doctype>` is one
of `lec` `sheet` `ex` `hw` `lab` `quiz` `note` `ref` `midterm` `final` `archive`.
The manifest reads these back into card titles: `itf-lec-week08-database.pdf`
renders as **Lecture · Week 08 Database**.

Zero-pad week and chapter numbers to two digits (`week08`, not `week8`) so they
sort correctly. **Put the token in the name when the file states its week or
chapter** (`weekNN`, `chN`, `lecNN`, `unitN`; also `wk`, `chapter`, `lecture`, numbers
1–20): the manifest reads `chapter` from exactly those tokens and from nothing
else — a bare number such as a year is ignored.

**Collision handling.** If the target path already exists:

```bash
shasum -a 256 "_dropzone/FILE.pdf" "public/assets/<ns>/<subj>/<cat>/FILE.pdf"
```

- **Identical hashes** → the file is already ingested. Delete the dropzone copy.
  Report it as a duplicate. Do not re-add.
- **Different hashes** → both are real. Suffix the newcomer with its term or
  year: `charm-ex-worksheet02-disc-swot-y1-s1-2569.pdf`. Never overwrite.

(`bun run library:audit` also reports byte-identical files that already sit under
different names as `duplicate-content`.)

---

## Phase 3.5 — Compress before filing

Library files are not part of the Vercel deployment any more — `public/assets/`
is gitignored and the bytes are served from Supabase Storage — so the old
deployment-size ceiling no longer applies. Compressing still matters: the library
is about 950 MB (949 MiB in `lib/library/library-stats.json`), PDFs are 99% of
those bytes, and every student downloads them. An uncompressed archive PDF is
typically 3-5x larger than it needs to be, so compress before moving, not after.

### Setup

Ghostscript and ImageMagick are installed on the owner's machine (checked
15 Oct 2026). Elsewhere:

```bash
brew install ghostscript imagemagick
```

Ghostscript is the only tool that recompresses PDF internals. `pdftotext`, `qpdf`,
`pypdf` and `mutool` are **not** installed here. ImageMagick, `cwebp`, `sips` and
Pillow are, but they only handle images -- and images are a rounding error in
this repo: 653 of 705 files are PDFs, and they are 99% of the bytes.

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

`scripts/compress-assets.sh` (`bun run assets:compress`) applies all of the above
across the asset tree in parallel, enforcing all three gates per file and writing
a `.compress-report.tsv` (gitignored) with a verdict and RMSE per file:

```bash
./scripts/compress-assets.sh 8      # 8 parallel workers
bun run library:build               # sizes and page counts changed -- regenerate
```

> **It has no incremental mode.** It walks *every* PDF under `public/assets/`,
> including ones already compressed, so running it after adding a few files
> re-encodes the whole library a second time. Use it for a one-off sweep of a tree
> that has never been compressed. For files you are adding, compress each one
> yourself (above) *before* moving it in.

Audit the rejects before trusting a run:

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

(Today no file in the library is over 20 MB; the largest is 19.3 MiB.)

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
| `.circ`, `.xlsx`, `.docx`, `.accdb`, `.txt`, `.zip` | same — they get `fileType: "file"` and render as download-only cards |
| `.pka` (Cisco Packet Tracer), saved pages of a personal account (e.g. SecSpace) | **do not file, do not hold** — skip and report (Phase 6) |
| `.md` that is a **course overview** | `content/courses/<course-dir>/summary.md` — **see warning below** |
| `.md` / `.json`, other study material | `content/courses/<course-dir>/archive/` |

> ⚠️ **`public/assets/` is gitignored.** Moving a file there does not commit it.
> The bytes are served from Supabase Storage, so a routed file is invisible in
> production until `bun run assets:sync` uploads it — see Phase 5.

### Routing past exams

Anything that is a past paper — `category: "exam"` — is **restricted content**.
It is uploaded to the private `ihelp-library-exams` bucket and served only to
insiders through a short-lived signed URL. `bun run assets:sync` decides that
from the same `isRestrictedAsset()` rule the app uses, so you do not route it by
hand. What you must get right is the **classification**:

- The rule is `category === "exam"` **or** a path that contains `/exams/`. Nothing
  else makes a file private, and the folder alone is not enough in the other
  direction: a past paper filed under `notes/` or `pages/` because it is a
  photograph is still an exam, and it stays public unless its entry says
  `category: "exam"`. Ten scanned exam pages under `ics/pages/` are exactly this case.
- If you are unsure whether something is a past paper, treat it as one and say
  so in the Phase 8 report. Over-restricting is recoverable; publishing someone's
  exam paper is not.

> ⚠️ **`summary.md` is hand-maintained and follows the 6-section standard in
> [`COURSE_OVERVIEW_STANDARD.md`](./COURSE_OVERVIEW_STANDARD.md).** Never overwrite
> it from the dropzone. If a dropped file looks like a course overview, hold it
> (Phase 6) and let the human merge it. The same goes for the hand-written weekly
> pages `archive/weekNN.md` (ITF, ICS): a new handout does not replace one — add
> its row to the page's file table instead (Phase 5.1).

Files over 20 MB: compress first, or hold and report. (GitHub's 100 MB limit only
matters for files committed to git — Markdown and JSON under `content/` and
`data/`; library files are gitignored.)

---

## Phase 5 — Data linkage & upload

The order matters. In short:

```
5.1 curated cards  →  5.3 library:build  →  5.4 library:audit  →  5.5 tsc · lint · content:check
        →  (ask the owner)  5.6 assets:sync  →  library:audit -- --remote
```

### 5.1 Add curated entries — for anything carrying a scope or a week

The manifest cannot supply a bilingual title, a description, an exam scope or a
week. For every file where you determined a **confident** scope in Phase 2.3,
add an entry to the right `*_ASSETS` array in `lib/library/subject-library.ts`
(follow the neighbouring entries of that course):

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
  chapter: 8,
  fileType: "pdf",
  url: "/assets/it-kmitl/itf/lectures/itf-lec-week08-database.pdf",
  fileName: "itf-lec-week08-database.pdf",
},
```

Optional fields the library understands: `chapter` (set it whenever the filename
states one) · `week` (a week or session number — the week view matches it first and
falls back to `chapter`) · `edition` (e.g. `"2569"`) and `isCurrentYear` · `status`
(`primary | current_year | duplicate | compact | legacy`) · `isDuplicate` +
`duplicateOf` (a card id or fileName) · `sourceUrl` (the file's OnLearn page — only
for files that really came from OnLearn) · `groupId` (a key of `ASSET_GROUPS` in
`subject-library-ui.ts`, which stacks several files into one card). Never write
`pages` or `sizeBytes`: they are stamped from `library-stats.json`.

Rules:

- `id` must be unique across the whole library (`id-collision`)
- both `th` and `en` are required on `title` and `description` — never
  single-language. Write real Thai, not a transliteration of the English
- omit `scope` entirely for term-spanning material; do not write `scope: undefined`
- a curated entry beats the generated card when `url` matches, so the URL must
  be byte-identical to the file's real path
- `fileName` is the suggested download name: the file's real name, or a prefixed
  copy of it (`ics-2564-pg-01.jpg` for `pages/pg-01.jpg`). Anything else is a
  `filename-mismatch` warning. Docs match cards by `fileName`, so a weekly page
  must list the name the card carries
- two curated cards in one course may not share a `url` unless a `#page=` fragment
  tells them apart (`duplicate-url`)
- ITF and ICS open on the week view: the card's `week` (or `chapter`) must be a
  row of that course's schedule in `lib/library/course-weeks.ts`, and for ICS the
  `scope` too, because both halves number their weeks 1–7 (`week-not-in-schedule`)
- if the file belongs on a weekly page or overview, add a row to that page's file
  table, using the card's `fileName` — rows match cards by it, and a name no card
  carries is `dead-doc-card`

### 5.2 Check the course is reachable

A course's shelf is reachable when its binding in `lib/courses/course-bindings.ts`
declares `archive: {}` (`baseline(dir)` does this by default) and the course has
at least one card. Check that the course's row in `bun run readiness` lists
`archive`.

`SPORT` is the only course without it: its binding is
`baseline(…, { archive: false })`, and `SUBJECT_CODE` in
`scripts/build-library-manifest.mjs` has no `sport` entry. The first SPORT file
needs both changed — tell the human before you do, the same way as for a new
category folder. A subject folder missing from `SUBJECT_CODE` is skipped by the
manifest (`unmapped-file`).

### 5.3 Regenerate the generated files — always

```bash
bun run library:build
```

This runs `library:manifest`, then `library:stats`, then `library:index`. Every
moved asset gets a card from its filename alone, so the file is visible in the UI
after this step even with no hand-written entry.

**`lib/library/library-manifest.json`, `lib/library/library-stats.json` and
`lib/library/resource-index.json` are generated. Never hand-edit them, and never
import the index from app code** (see below).

`resource-index.json` is a snapshot joining every course, doc and card (what
renders it, which week, which files its tables reference, which bucket and access
tier a card lands in). It goes stale as soon as a card, binding, schedule or doc
changes — rebuild after editing any of them. Query it instead of grepping 5,000
lines of TypeScript:

```bash
bun run library:find -- packet tracer --course ITF   # cards matching both words
bun run library:find -- --course ITF --week 13       # everything filed under week 13
bun run library:find -- --kind exercise --course ICS # one shelf of one course
bun run library:find -- --docs --course ITF          # a course's docs (add --json: the module that renders each, the files it references)
bun run library:find -- week13 --json                # the matching records as JSON
```

### 5.4 Audit — fix every error

```bash
bun run library:audit                  # local checks; exit 1 if any error remains
bun run library:audit -- --course ITF  # one course only
bun run library:audit -- --json        # machine-readable
```

It reads the cards, the generated files, the docs, `public/assets/` and (with
`--remote`) the two buckets, and says where they disagree. Fix every **error**
your run caused; read the warnings. Errors that were already there in Phase 0 go
in the report, not into a silent fix.

| Severity | Finding | Means |
| --- | --- | --- |
| error | `missing-file` | a card points at a file that is not on disk |
| error | `id-collision` | two cards share one id |
| error | `duplicate-url` | two curated cards in one course share a url |
| error | `course-mismatch` | a card's file sits in another course's asset folder |
| error | `dead-doc-card` | a rendered doc lists a file that no card matches |
| warn | `unmapped-file` | a file the manifest skips, so no card lists it |
| warn | `filename-mismatch` | a card's `fileName` is neither the file's real name nor a prefixed copy of it |
| warn | `bad-filename` | not lowercase kebab-case (Phase 3) |
| warn | `duplicate-content` | byte-identical files on disk |
| warn | `stale-generated` | the manifest, the stats or the index is out of date → `bun run library:build` |
| warn | `orphan-doc` | a doc under `content/courses/` that no module renders |
| warn | `week-not-in-schedule` | a card's week matches no row of its course's schedule |
| warn | `status-conflict` | contradictory status flags, or a `duplicateOf` that points nowhere |
| info | `coverage` | per course: cards, generated-only cards, cards without scope, without week |

With `-- --remote` it also lists the Storage buckets (read-only; needs
`NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in the environment or
`.env.local`) and adds:

| Severity | Finding | Means |
| --- | --- | --- |
| error | `not-uploaded` | a file is missing from its bucket — 404 in production |
| error | `insider-in-public-bucket` | a past exam is readable in the public bucket |
| warn | `wrong-bucket` | a member file sits only in the private bucket |
| warn | `stale-object` | a bucket object with no file on disk |

Exit code: `1` if any error-level finding, `0` otherwise, `2` if the audit could
not run. Without `public/assets/` (a fresh clone) the checks that need it are skipped, and
the report says so.

### 5.5 Verify

All of these must pass before you report success:

```bash
bunx tsc --noEmit          # must exit 0
bun run lint               # must not add errors beyond the baseline (below)
bun run content:check      # the blueprint contract; also runs as `prebuild`
bun run build              # must complete
```

The lint baseline on 15 Oct 2026 is 14 errors, all pre-existing: 13 in the vendored
`public/pyodide/pyodide.asm.js` and 1 in `lib/submission/draft.ts`
(`react-hooks/set-state-in-effect`). Anything else is yours — fix it.

### 5.6 Upload — ask the owner first, then audit the buckets

`public/assets/` is gitignored, so this is the step that actually publishes a
file. Uploading is outward-facing: **ask the owner before running it**
(`AGENTS.md` rule 8).

```bash
bun run assets:sync                       # upload only what the buckets are missing
bun run library:audit -- --remote         # confirm: no not-uploaded, no insider-in-public-bucket
```

`assets:sync` reads the cards you just wrote to decide which bucket each file
belongs in — public `ihelp-library`, or private `ihelp-library-exams` for anything
`isRestrictedAsset()` says is an exam. Run it **after** 5.1 and 5.3, never before:
run in the wrong order and a past paper whose `category` is only set on its
curated card gets uploaded to the public bucket.

Check the line it prints — it names how many files went to the restricted
bucket. If a past paper is not counted there, its classification is wrong; fix
the entry and re-run rather than moving the object by hand. `-- --force`
re-uploads everything; use it only if the owner asks.

If the remote audit reports `insider-in-public-bucket`, stop and tell the owner:
the fix is deleting that public object, and deleting Storage objects needs their
approval.

---

## Phase 6 — Hold, do not guess

Move to `_dropzone/_hold/<course>-<reason>/` and report — **never** invent a
classification:

- subject ambiguous or unrecognised
- scope genuinely unclear **and** the material does not look term-spanning
- looks like a course overview that would overwrite a `summary.md`
- corrupt, zero-byte, or unreadable
- over 20 MB and not compressible
- **another student's own work** — submissions, filled-in worksheets
  (`-completed`) that are not the owner's, group work that names classmates
  (anything like `lab06-lab-work-group-1.pdf` must be checked inside before it moves)
- **personal data that was not already handed to the whole class**
- a file whose subject or scope you cannot determine

The owner's own work (student id `69070027`, the number in the `pscp-69070027` repo name)
is theirs to publish.

**Do not hold** (owner's decision, 15 Oct 2026): official course handouts already
distributed to the class on OnLearn — lab sheets, slides — even when a screenshot
shows a TA's or a sample student's name or ID. File them normally. The old
`_dropzone/_hold/itf-privacy/` folder was removed for this reason.

**Do not file, and do not hold — skip and report:**

- graded artefacts, for example Cisco Packet Tracer `.pka` files
- saved pages of a personal account, for example SecSpace pages

Also flag, but do not block, material marked `ห้ามเผยแพร่สาธารณะ` in a course's
`summary.md`: ITF says its lecture slides are the lecturer's, and FE says the
Edusoft workbook may only sit behind login. The library list is behind login now,
but the files themselves are in a public bucket (see the access model above) — so
say so in the report and let the owner decide.

---

## Phase 7 — Cleanup

The dropzone must end empty except its two tracked files (and `_hold/`):

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
processes them twice. Leave the copies in `~/Downloads/_INBOX/` alone; that is
the owner's staging area.

---

## Phase 8 — Report

Do **not** commit unless the human asks. Report:

```
Processed N files from _dropzone/

MOVED
  <original name>  →  <target path>   [SUBJECT · CATEGORY · SCOPE]
  …

CURATED       M entries added to lib/library/subject-library.ts
DUPLICATES    K files already present, deleted from dropzone
HELD          J files in _dropzone/_hold/ — <one-line reason each>
SKIPPED       S files neither filed nor held (.pka, saved personal pages) — <names>

Library:  X cards (+Y), index rebuilt
Audit:    library:audit — E errors, W warnings (baseline before the run: E0 / W0)
          library:audit -- --remote — run after the upload / not run
Verify:   tsc ✓   lint ✓ (baseline only)   content:check ✓   build ✓
Upload:   assets:sync — done / waiting for the owner's OK

Not committed. Uncommitted paths: <git status --short summary>
```

Then update `CHANGELOG.md` under `## [Unreleased]` if the run added material a
user would notice — `CONTRIBUTING.md` requires it (Thai headings `### เพิ่ม` /
`### ปรับปรุง` / `### แก้ไข` / `### ความปลอดภัย`).

---

## Quick reference

```bash
ls -la _dropzone/                       # 1. scan   (course files: ~/Downloads/_INBOX/<COURSE>/ → copy in)
bun run library:audit | tail -40        #    baseline before you touch anything
#    peek: read _dropzone/F.pdf with your own reader, pages 1-2
gs -sDEVICE=pdfwrite -dPDFSETTINGS=/ebook -dNOPAUSE -dQUIET -dBATCH \
   -sOutputFile=small.pdf "_dropzone/F.pdf"     # 2. compress (verify pages + render!)
mkdir -p public/assets/<ns>/<subj>/<cat>        # 3. route
mv small.pdf "public/assets/<ns>/<subj>/<cat>/f.pdf"
#    edit lib/library/subject-library.ts for scoped entries                     # 4. curated cards (5.1)
bun run library:build                   # 5. manifest + stats + index              (5.3)
bun run library:audit                   # 6. fix every error you caused            (5.4)
bunx tsc --noEmit; bun run lint; bun run content:check; bun run build           # 7. verify (5.5)
#    (lint exits 1 on its baseline errors -- compare against the baseline, do not chain it with &&)
#    ask the owner, then:
bun run assets:sync                     # 8. upload to Supabase Storage            (5.6)
bun run library:audit -- --remote       # 9. confirm the buckets
find _dropzone -type f ! -name '.gitkeep' ! -name 'README.md' ! -path '*/_hold/*'   # 10. must be empty (Phase 7)
```

> `public/assets/` is **gitignored**. The files are served from the public
> `ihelp-library` Supabase Storage bucket, not from the repo — committing ~908 MB
> of PDFs pushed the git pack to 881 MB and ran the Vercel build container out of
> disk. A file that is routed but not synced will 404 in production even though it
> works locally, so step 8 is not optional. `bun run assets:sync` only uploads what
> the bucket is missing, so re-running it is cheap.

| Never | Because |
| --- | --- |
| create a `midterm/` or `final/` folder | scope is metadata; the manifest skips 3-segment paths |
| hand-edit `library-manifest.json` / `library-stats.json` / `resource-index.json` | generated by `bun run library:build` |
| import `resource-index.json` from `app/`, `components/` or `lib/` | it lists every card, past exams included, and would ship that to the browser |
| overwrite `summary.md` or a weekly page | hand-maintained, 6-section contract |
| guess a subject or scope | hold it instead — Phase 6 |
| compress a file already in public/assets/ | it went through once; a second lossy pass degrades it |
| run `scripts/compress-assets.sh` to compress a few new files | it re-encodes every PDF in the tree, not just yours |
| trust page count alone after compressing | it passes while every embedded image is dropped — render and compare |
| file another student's own work, or personal data not already given to the class | hold it — Phase 6 |
| hold an official handout only because a TA's or sample student's name shows | the owner decided on 15 Oct 2026 to file these |
| file a `.pka` or a saved personal-account page | graded / personal — skip and report |
| assume "behind login" means private | non-exam files sit in a public bucket; only past exams are private |
| run `assets:sync` without asking the owner | it publishes; and `library:build` → `library:audit` must come first |
| commit unprompted | the human reviews first |
| expect a routed file to appear in production without `bun run assets:sync` | `public/assets/` is gitignored; the bucket is the source of truth |
