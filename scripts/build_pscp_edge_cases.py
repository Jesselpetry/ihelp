#!/usr/bin/env python3
"""Derive an extra edge-case suite for each PSCP problem.

Rebuilds `data/pscp/problems.json` in place, adding an `edgeCases` list beside
the official `cases`.

METHOD — and its limits, which the UI states too.
iJudge publishes only the sample cases; its real judging set is hidden. So
these cases cannot be "the official hidden tests". What they are instead is a
DIFFERENTIAL suite: each candidate input is run through the problem's own
reference `main.py`, and whatever that prints becomes the expected output. A
student's code passing them means "agrees with the reference implementation on
these inputs" — which is exactly what catches off-by-one, rounding, integer vs
float division, and output-format bugs.

To keep every generated input inside the problem's real domain, candidates are
built by varying ONE token at a time away from an actual official sample, and
only within the type and sign range that the official samples themselves
demonstrate. A candidate whose reference run crashes, times out, or prints
nothing is discarded rather than shipped, since that means the mutation left
the problem's valid domain.

Run:  python3 scripts/build_pscp_edge_cases.py
"""

from __future__ import annotations

import json
import re
import subprocess
import sys
import tempfile
from collections import Counter
from pathlib import Path

HERE = Path(__file__).resolve().parent
PROJECT = HERE.parent
REGISTRY = PROJECT / "data" / "pscp" / "problems.json"

MAX_EDGE_CASES = 6
RUN_TIMEOUT_SEC = 10
# A suite of five cases that all print "Error" teaches nothing, so cap how many
# kept cases may share one expected output.
MAX_PER_EXPECTED = 2

INT_RE = re.compile(r"-?\d+$")
FLOAT_RE = re.compile(r"-?\d*\.\d+$")
ALPHA_RE = re.compile(r"[A-Za-z]+$")


# ---------------------------------------------------------------------------
# input-shape inference
# ---------------------------------------------------------------------------

def classify_token(col: list[str]) -> tuple[str, list]:
    """Classifies one token position given the value it took in every sample."""
    if all(INT_RE.fullmatch(c) for c in col):
        return "int", [int(c) for c in col]
    if all(FLOAT_RE.fullmatch(c) or INT_RE.fullmatch(c) for c in col):
        return "float", [float(c) for c in col]
    if all(len(c) == 1 and c.isalpha() for c in col):
        return "char", col
    if all(ALPHA_RE.fullmatch(c) for c in col):
        return "word", col
    return "other", col


def infer_shape(cases: list[dict]) -> list[list[tuple[str, list]]] | None:
    """
    Returns per-line, per-token slot types, or None when the samples do not
    share one rigid shape (e.g. "N then N lines" problems, where mutating a
    value would desynchronise the input and is not safe to guess at).
    """
    grids = [c["stdin"].split("\n") for c in cases]
    line_counts = {len(g) for g in grids}
    if len(line_counts) != 1:
        return None
    n_lines = line_counts.pop()
    if n_lines == 0:
        return None

    shape: list[list[tuple[str, list]]] = []
    for li in range(n_lines):
        toks = [g[li].split() for g in grids]
        widths = {len(t) for t in toks}
        if len(widths) != 1:
            return None
        width = widths.pop()
        if width == 0:
            return None
        shape.append([classify_token([t[i] for t in toks]) for i in range(width)])
    return shape


# ---------------------------------------------------------------------------
# candidate values per slot
# ---------------------------------------------------------------------------

def int_candidates(observed: list[int]) -> list[tuple[int, str, str]]:
    """(value, th-reason, en-reason), constrained to the observed sign range."""
    lo, hi = min(observed), max(observed)
    non_negative = lo >= 0
    positive = lo >= 1
    out: list[tuple[int, str, str]] = []

    out.append((hi + 1, "หนึ่งค่าเหนือค่าสูงสุดที่โจทย์ยกตัวอย่าง", "One above the largest sampled value"))
    if not positive or lo - 1 >= 1:
        out.append((lo - 1, "หนึ่งค่าใต้ค่าต่ำสุดที่โจทย์ยกตัวอย่าง", "One below the smallest sampled value"))
    if positive and lo == 1:
        # 1 is the smallest sampled value, so 0 is the adjacent boundary.
        out.append((0, "ค่าขอบเขตศูนย์", "Zero boundary"))
    if positive and lo > 1:
        out.append((1, "ค่าต่ำสุดที่เป็นบวก", "Smallest positive value"))
    out.append((hi * 3 + 7, "ค่าที่ใหญ่กว่าตัวอย่างมาก", "Value well beyond the samples"))
    if non_negative and lo != hi:
        out.append(((lo + hi) // 2, "ค่ากลางระหว่างตัวอย่าง", "Midpoint between sampled values"))
    return out


def float_candidates(observed: list[float]) -> list[tuple[str, str, str]]:
    lo, hi = min(observed), max(observed)
    out = [
        (f"{hi + 1:g}", "สูงกว่าตัวอย่างสูงสุด", "Above the largest sampled value"),
        (f"{lo:.3f}", "ทศนิยมหลายตำแหน่ง ทดสอบการปัดเศษ", "Extra decimal places, exercises rounding"),
        (f"{(lo + hi) / 2:.2f}", "ค่ากลางแบบมีทศนิยม", "Fractional midpoint"),
    ]
    if lo >= 1:
        out.append(("1", "ค่าหน่วยเดียว", "Unit value"))
    return out


def char_candidates(observed: list[str]) -> list[tuple[str, str, str]]:
    seen = set(observed)
    pool = [
        (c, "สลับไปใช้ค่าจากตัวอย่างอื่นในตำแหน่งเดียวกัน",
         "Swapped to a value this slot takes in another sample")
        for c in list(dict.fromkeys(observed))[1:]
    ] + [
        ("a", "สระตัวพิมพ์เล็ก", "Lowercase vowel"),
        ("z", "พยัญชนะตัวพิมพ์เล็กตัวสุดท้าย", "Last lowercase consonant"),
        ("A", "สระตัวพิมพ์ใหญ่", "Uppercase vowel"),
        ("Z", "พยัญชนะตัวพิมพ์ใหญ่ตัวสุดท้าย", "Last uppercase consonant"),
        ("u", "สระตัวสุดท้าย", "Final vowel"),
    ]
    # Keep the cross-substituted values (already in `seen`) plus fresh letters.
    cross = {c for c in observed}
    out, used = [], set()
    for value, th, en in pool:
        if value in used:
            continue
        if value not in cross and value in seen:
            continue
        used.add(value)
        out.append((value, th, en))
    return out


def word_candidates(observed: list[str]) -> list[tuple[str, str, str]]:
    """Only reshuffles values the samples already prove are legal."""
    uniq = list(dict.fromkeys(observed))
    out: list[tuple[str, str, str]] = []
    # Cross-sample substitution first: a value seen at this very slot in another
    # sample is guaranteed in-domain, and usually selects a different branch.
    for w in uniq[1:]:
        out.append((w, "สลับไปใช้ค่าจากตัวอย่างอื่นในตำแหน่งเดียวกัน",
                    "Swapped to a value this slot takes in another sample"))
    for w in uniq[:1]:
        if w.lower() != w:
            out.append((w.lower(), "ตัวพิมพ์เล็กทั้งหมด", "All-lowercase spelling"))
        if w.upper() != w:
            out.append((w.upper(), "ตัวพิมพ์ใหญ่ทั้งหมด", "All-uppercase spelling"))
    return out


# ---------------------------------------------------------------------------
# generation + verification
# ---------------------------------------------------------------------------

def build_candidates(cases: list[dict], shape) -> list[tuple[str, str, str]]:
    """(stdin, th-reason, en-reason), varying exactly one token from a sample."""
    seen_inputs = {c["stdin"] for c in cases}
    out: list[tuple[str, str, str]] = []

    # Every official sample is used as a base, not just the first. A sample
    # often sits in a different branch (an early `if` can short-circuit the
    # rest of the input), so mutating from only one base leaves whole branches
    # of the reference unexercised.
    bases = [[line.split() for line in c["stdin"].split("\n")] for c in cases]

    for base_grid in bases:
      for li, line_slots in enumerate(shape):
        for ti, (kind, observed) in enumerate(line_slots):
              if kind == "int":
                  cands = [(str(v), th, en) for v, th, en in int_candidates(observed)]
              elif kind == "float":
                  cands = float_candidates(observed)
              elif kind == "char":
                  cands = char_candidates(observed)
              elif kind == "word":
                  cands = word_candidates(observed)
              else:
                  continue

              for value, th, en in cands:
                  grid = [row[:] for row in base_grid]
                  grid[li][ti] = value
                  stdin = "\n".join(" ".join(row) for row in grid)
                  if stdin in seen_inputs:
                      continue
                  seen_inputs.add(stdin)
                  pos = f"บรรทัด {li + 1}" if len(shape) > 1 else "อินพุต"
                  pos_en = f"line {li + 1}" if len(shape) > 1 else "input"
                  out.append((stdin, f"{pos}: {th}", f"{pos_en.capitalize()}: {en}"))
    return out


def run_reference(code_path: Path, stdin: str) -> tuple[str, bool]:
    """Returns (stdout, ok). ok=False means the mutation left the valid domain."""
    try:
        proc = subprocess.run(
            [sys.executable, str(code_path)],
            input=stdin + "\n",
            capture_output=True,
            text=True,
            timeout=RUN_TIMEOUT_SEC,
        )
    except subprocess.TimeoutExpired:
        return "", False
    if proc.returncode != 0:
        return "", False
    out = proc.stdout.rstrip("\n")
    if out == "":
        return "", False
    return out, True


def main() -> int:
    registry = json.loads(REGISTRY.read_text(encoding="utf-8"))
    problems = registry["problems"]

    stats = Counter()
    total_edge = 0

    with tempfile.TemporaryDirectory() as tmp:
        tmpdir = Path(tmp)
        for p in problems:
            p["edgeCases"] = []
            cases = p.get("cases") or []
            code = p.get("referenceCode")

            if not cases or not code:
                stats["skipped_no_source"] += 1
                continue

            shape = infer_shape(cases)
            if shape is None:
                stats["skipped_ragged_shape"] += 1
                continue

            code_path = tmpdir / f"oj{p['id']}.py"
            code_path.write_text(code, encoding="utf-8")

            kept: list[dict] = []
            rejected = 0
            expected_seen: Counter = Counter()
            for stdin, th, en in build_candidates(cases, shape):
                if len(kept) >= MAX_EDGE_CASES:
                    break
                expected, ok = run_reference(code_path, stdin)
                if not ok:
                    rejected += 1
                    continue
                if expected_seen[expected] >= MAX_PER_EXPECTED:
                    stats["dropped_duplicate_outcome"] += 1
                    continue
                expected_seen[expected] += 1
                idx = len(kept) + 1
                kept.append({
                    "id": f"{p['id']}-edge-{idx}",
                    "stdin": stdin,
                    "expected": expected,
                    "official": False,
                    "label": {"th": f"เคสขอบเขตที่ {idx}", "en": f"Edge Case {idx}"},
                    "tests": {"th": th, "en": en},
                })

            p["edgeCases"] = kept
            total_edge += len(kept)
            stats["generated"] += 1 if kept else 0
            stats["rejected_out_of_domain"] += rejected
            if not kept:
                stats["no_valid_candidates"] += 1

    REGISTRY.write_text(
        json.dumps(registry, ensure_ascii=False, indent=1) + "\n", encoding="utf-8"
    )

    covered = sum(1 for p in problems if p["edgeCases"])
    print(f"wrote {REGISTRY.relative_to(PROJECT)}")
    print(f"  problems with edge cases : {covered}")
    print(f"  edge cases generated     : {total_edge}")
    for k, v in sorted(stats.items()):
        print(f"  {k:25}: {v}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
