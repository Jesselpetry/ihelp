#!/usr/bin/env bash
# Recompress PDFs under public/assets/ to Ghostscript's /ebook profile so the
# tree fits inside a Vercel deployment.
#
# Ghostscript's pdfwrite device SILENTLY DROPS embedded raster images on some
# PDFs — annotated GoodNotes exports and certain scanner output are the usual
# victims. Page count and file size both look perfect when it happens, so this
# script renders the before and after and compares them pixel-for-pixel. A
# rewrite is kept only if it passes ALL of:
#
#   1. same page count
#   2. meaningfully smaller (under MIN_GAIN% of the original)
#   3. renders visually identical (RMSE under MAX_RMSE%) on first and middle page
#
# Anything else keeps the original bytes untouched.
#
#   ./scripts/compress-assets.sh [jobs]
#
# Needs: brew install ghostscript imagemagick
set -uo pipefail

JOBS="${1:-8}"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LOG="$ROOT/.compress-report.tsv"
MIN_GAIN=95   # keep only if under 95% of original size
MAX_RMSE=6    # percent; sampled damage ran 18-86%, clean files stayed under 5%

command -v gs      >/dev/null || { echo "need: brew install ghostscript" >&2; exit 1; }
command -v magick  >/dev/null || { echo "need: brew install imagemagick" >&2; exit 1; }

pagecount() {
  gs -q -dNODISPLAY -dNOSAFER -c \
    "($1) (r) file runpdfbegin pdfpagecount = quit" 2>/dev/null || echo "?"
}

# Worst-case RMSE (percent) between two PDFs across the given pages.
visual_delta() {
  local a="$1" b="$2" worst=0 p rm pct d
  shift 2
  d=$(mktemp -d)
  for p in "$@"; do
    gs -sDEVICE=png16m -r55 -dFirstPage="$p" -dLastPage="$p" -dNOPAUSE -dQUIET \
       -dBATCH -sOutputFile="$d/a.png" "$a" 2>/dev/null
    gs -sDEVICE=png16m -r55 -dFirstPage="$p" -dLastPage="$p" -dNOPAUSE -dQUIET \
       -dBATCH -sOutputFile="$d/b.png" "$b" 2>/dev/null
    [ -s "$d/a.png" ] && [ -s "$d/b.png" ] || { echo 100; rm -rf "$d"; return; }
    magick "$d/b.png" -resize "$(magick identify -format '%wx%h' "$d/a.png")!" \
           "$d/b2.png" 2>/dev/null || { echo 100; rm -rf "$d"; return; }
    rm=$(magick compare -metric RMSE "$d/a.png" "$d/b2.png" null: 2>&1 | sed 's/ .*//')
    pct=$(awk -v r="$rm" 'BEGIN{printf "%.0f", (r+0)/65535*100}')
    [ "$pct" -gt "$worst" ] && worst=$pct
  done
  rm -rf "$d"
  echo "$worst"
}

one() {
  local f="$1" tmp orig new op np mid delta
  orig=$(stat -f%z "$f")
  tmp="$(mktemp -t gsz).pdf"
  if ! gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.5 -dPDFSETTINGS=/ebook \
          -dNOPAUSE -dQUIET -dBATCH -dSAFER \
          -sOutputFile="$tmp" "$f" 2>/dev/null; then
    printf '%s\tERROR\t%s\t%s\t-\n' "$f" "$orig" "$orig"; rm -f "$tmp"; return
  fi
  new=$(stat -f%z "$tmp" 2>/dev/null || echo 0)

  if [ "$new" -le 0 ] || [ $((new * 100 / orig)) -ge "$MIN_GAIN" ]; then
    rm -f "$tmp"; printf '%s\tKEPT-NO-GAIN\t%s\t%s\t-\n' "$f" "$orig" "$new"; return
  fi
  op=$(pagecount "$f"); np=$(pagecount "$tmp")
  if [ "$op" != "$np" ]; then
    rm -f "$tmp"; printf '%s\tKEPT-PAGES\t%s\t%s\t-\n' "$f" "$orig" "$new"; return
  fi

  mid=1; [ "$op" -gt 2 ] 2>/dev/null && mid=$(( (op + 1) / 2 ))
  delta=$(visual_delta "$f" "$tmp" 1 "$mid")
  if [ "$delta" -ge "$MAX_RMSE" ]; then
    rm -f "$tmp"; printf '%s\tKEPT-VISUAL\t%s\t%s\t%s\n' "$f" "$orig" "$new" "$delta"; return
  fi

  mv "$tmp" "$f"; printf '%s\tSHRUNK\t%s\t%s\t%s\n' "$f" "$orig" "$new" "$delta"
}
export -f one pagecount visual_delta
export MIN_GAIN MAX_RMSE

: > "$LOG"
find "$ROOT/public/assets" -name '*.pdf' -type f -print0 \
  | xargs -0 -P "$JOBS" -I{} bash -c 'one "$@"' _ {} >> "$LOG"

awk -F'\t' '
  {n++; o+=$3; s+=($2=="SHRUNK"?$4:$3); st[$2]++}
  END {
    printf "\n%d PDFs\n", n
    for (k in st) printf "  %-14s %d\n", k, st[k]
    printf "  %.0f MB -> %.0f MB  (%.0f%% saved)\n", o/1048576, s/1048576, (1-s/o)*100
  }' "$LOG"
