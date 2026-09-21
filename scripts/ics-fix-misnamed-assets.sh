#!/usr/bin/env bash
#
# Corrects the seven ICS assets whose filename does not match their contents.
#
# Six `ics-lec-weekNN.pdf` files are Track B (Supakit) chapter decks, not Track A
# week decks — verified by rendering page 1 of each. The seventh is a textbook
# excerpt filed as a lecture. See content/courses/06016411-Intro-to-Computer-Systems/
# RESOURCES_MANIFEST.md section 7.
#
# Renaming an asset is not just a mv: the path IS the Supabase Storage object key
# and the manifest key, so this script also removes the stale objects and tells
# you which follow-up commands to run. Two of the six are byte-for-byte duplicates
# of files that are already correctly named, so they are deleted rather than moved.
#
#   ./scripts/ics-fix-misnamed-assets.sh            # dry run, prints the plan
#   ./scripts/ics-fix-misnamed-assets.sh --apply    # actually do it
#
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LEC="$ROOT/public/assets/it-kmitl/ics/lectures"
REF="$ROOT/public/assets/it-kmitl/ics/references"
APPLY=0
[[ "${1:-}" == "--apply" ]] && APPLY=1

say() { printf '%s\n' "$*"; }
run() {
  if [[ $APPLY -eq 1 ]]; then "$@"; else printf '  would run: %s\n' "$*"; fi
}

# ── 1. renames: file is real and unique, the name is simply wrong ────────────
# old basename                         new basename
RENAMES=(
  "ics-lec-week01.pdf|ics-lec-chapter01-computer-system-v2.pdf"
  "ics-lec-week04.pdf|ics-lec-chapter04-counter-adc-annotated.pdf"
  "ics-lec-week05.pdf|ics-lec-chapter05-dac-adc-part2-v2.pdf"
  "ics-lec-week06.pdf|ics-lec-chapter06-memory-unit-v2.pdf"
)

# ── 2. deletions: byte-equivalent to a correctly named file already present ──
# duplicate                    the file it duplicates (must exist, or we stop)
DUPES=(
  "ics-lec-week02.pdf|ics-lec-chapter02-v2.pdf"
  "ics-lec-week03.pdf|ics-lec-slide03-1.pdf"
)

# ── 3. recategorise: not a lecture deck at all ───────────────────────────────
MOVE_SRC="$LEC/ics-lec-chapter02.pdf"
MOVE_DST="$REF/ics-ref-textbook-ch02-excerpt.pdf"

say "ICS misnamed-asset fix — $([[ $APPLY -eq 1 ]] && echo APPLY || echo 'DRY RUN (pass --apply to execute)')"
say ""

say "1. rename (${#RENAMES[@]} files)"
for pair in "${RENAMES[@]}"; do
  old="$LEC/${pair%%|*}"; new="$LEC/${pair##*|}"
  if [[ ! -f "$old" ]]; then say "  skip: ${pair%%|*} not on disk"; continue; fi
  if [[ -e "$new" ]]; then say "  ABORT: ${pair##*|} already exists"; exit 1; fi
  say "  ${pair%%|*}  ->  ${pair##*|}"
  run mv "$old" "$new"
done
say ""

say "2. delete duplicates (${#DUPES[@]} files)"
for pair in "${DUPES[@]}"; do
  dup="$LEC/${pair%%|*}"; keep="$LEC/${pair##*|}"
  if [[ ! -f "$dup" ]]; then say "  skip: ${pair%%|*} not on disk"; continue; fi
  if [[ ! -f "$keep" ]]; then say "  ABORT: keeper ${pair##*|} is missing — not deleting"; exit 1; fi
  say "  ${pair%%|*}  (duplicate of ${pair##*|})"
  run rm "$dup"
done
say ""

say "3. recategorise textbook excerpt"
if [[ -f "$MOVE_SRC" ]]; then
  say "  lectures/ics-lec-chapter02.pdf  ->  references/ics-ref-textbook-ch02-excerpt.pdf"
  run mkdir -p "$REF"
  run mv "$MOVE_SRC" "$MOVE_DST"
else
  say "  skip: already moved"
fi
say ""

cat <<'NEXT'
Follow-up — these are NOT optional, run them in this order:

  bun run library:build     # regenerate manifest + stats off the new filenames
  bun run assets:sync       # upload the renamed objects to Supabase Storage
  bunx tsc --noEmit && bun run build

Then delete the SEVEN stale objects from the bucket by hand. assets:sync only
uploads what is missing; it never deletes, so the old keys keep serving the old
URLs until they are removed:

  it-kmitl/ics/lectures/ics-lec-week01.pdf
  it-kmitl/ics/lectures/ics-lec-week02.pdf
  it-kmitl/ics/lectures/ics-lec-week03.pdf
  it-kmitl/ics/lectures/ics-lec-week04.pdf
  it-kmitl/ics/lectures/ics-lec-week05.pdf
  it-kmitl/ics/lectures/ics-lec-week06.pdf
  it-kmitl/ics/lectures/ics-lec-chapter02.pdf

None of the seven has a curated entry in lib/subject-library.ts, so no `url:`
field needs editing — verified before this script was written. Re-check with:

  grep -n 'ics-lec-week0[1-6]\.pdf\|ics-lec-chapter02\.pdf' lib/subject-library.ts
NEXT
