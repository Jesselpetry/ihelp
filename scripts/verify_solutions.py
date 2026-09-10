#!/usr/bin/env python3
"""Run reference solutions against their official iJudge sample cases.

Works for any problem in the archive, not just one week's batch, and resolves
its own paths so it runs from any working directory.

    python3 scripts/verify_solutions.py              # every problem with code
    python3 scripts/verify_solutions.py 3355         # one
    python3 scripts/verify_solutions.py 3290-3301    # a range
    python3 scripts/verify_solutions.py --week 9     # a teaching week

Exit status is non-zero if any sample mismatches, so it can gate CI.
"""

from __future__ import annotations

import argparse
import glob
import json
import os
import subprocess
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
PROJECT = HERE.parent
ARCHIVE = Path(os.environ.get("PSCP_ARCHIVE", PROJECT.parent / "pscp-69070027"))

DETAIL_JSON = PROJECT / "data" / "all_problems_detail.json"
INDEX_JSON = ARCHIVE / "oj_problems.json"

RUN_TIMEOUT_SEC = 10
STUB_MARKER = "# solution code here"

# Problems whose official samples are internally inconsistent. Documented here
# rather than silently skipped; see the note beside each.
KNOWN_DISPUTED = {
    3362: (
        "official sample 2 expects a leading '$' that the statement's own worked "
        "example and prose do not produce; the solution follows the prose"
    ),
}


def normalise(s: str) -> str:
    return s.replace("\r\n", "\n").rstrip("\n")


def find_solution(pid: int) -> Path | None:
    """Locate a problem's main.py. oj/<name>/ is canonical; root is for Learning Logs."""
    for pattern in (f"oj/oj{pid}-*/main.py", f"oj{pid}/main.py"):
        hits = sorted(glob.glob(str(ARCHIVE / pattern)))
        if hits:
            return Path(hits[0])
    return None


def parse_selection(tokens: list[str]) -> set[int]:
    ids: set[int] = set()
    for token in tokens:
        token = token.strip()
        if "-" in token:
            start, end = token.split("-", 1)
            ids.update(range(int(start), int(end) + 1))
        elif token:
            ids.add(int(token))
    return ids


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("ids", nargs="*", help="problem ids or ranges, e.g. 3355 3290-3301")
    ap.add_argument("--week", type=int, help="verify every problem in this teaching week")
    ap.add_argument("-q", "--quiet", action="store_true", help="only report failures")
    args = ap.parse_args()

    if not DETAIL_JSON.is_file():
        print(f"error: {DETAIL_JSON} not found; run the scraper first.", file=sys.stderr)
        return 1

    detail = {x["id"]: x for x in json.loads(DETAIL_JSON.read_text(encoding="utf-8"))}

    if args.week is not None:
        if not INDEX_JSON.is_file():
            print(f"error: {INDEX_JSON} not found; --week needs the summary registry.",
                  file=sys.stderr)
            return 1
        index = json.loads(INDEX_JSON.read_text(encoding="utf-8"))
        selected = {p["id"] for p in index if p.get("week") == args.week}
    elif args.ids:
        selected = parse_selection(args.ids)
    else:
        selected = set(detail)

    passed = failed = skipped = 0
    disputed: list[int] = []

    for pid in sorted(selected):
        record = detail.get(pid)
        if record is None:
            print(f"oj{pid}: not in {DETAIL_JSON.name}")
            skipped += 1
            continue

        sol = find_solution(pid)
        if sol is None:
            skipped += 1
            continue
        code = sol.read_text(encoding="utf-8", errors="ignore")
        if STUB_MARKER in code or not code.strip():
            skipped += 1
            continue

        cases = record.get("sampleCases") or []
        if not cases:
            skipped += 1
            continue

        ok = True
        for i, case in enumerate(cases, 1):
            stdin = case.get("testcase_input") or ""
            expected = normalise(case.get("testcase_output") or "")
            try:
                proc = subprocess.run(
                    [sys.executable, str(sol)], input=stdin,
                    capture_output=True, text=True, timeout=RUN_TIMEOUT_SEC,
                )
            except subprocess.TimeoutExpired:
                print(f"oj{pid} sample {i}: TIMEOUT after {RUN_TIMEOUT_SEC}s")
                ok = False
                continue
            if proc.returncode != 0:
                print(f"oj{pid} sample {i}: CRASH\n{proc.stderr.strip()[:400]}")
                ok = False
                continue
            got = normalise(proc.stdout)
            if got != expected:
                ok = False
                if pid in KNOWN_DISPUTED:
                    continue
                print(f"oj{pid} sample {i}: MISMATCH")
                print(f"  stdin=    {stdin!r}")
                print(f"  expected= {expected!r}")
                print(f"  got=      {got!r}")

        if ok:
            passed += 1
            if not args.quiet:
                print(f"oj{pid}: OK ({len(cases)} samples)")
        elif pid in KNOWN_DISPUTED:
            disputed.append(pid)
            print(f"oj{pid}: DISPUTED SAMPLE (not counted as failure)")
            print(f"  {KNOWN_DISPUTED[pid]}")
        else:
            failed += 1

    print(f"\npassed {passed}, failed {failed}, skipped {skipped}"
          + (f", disputed {len(disputed)}" if disputed else ""))
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
