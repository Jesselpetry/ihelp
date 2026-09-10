#!/usr/bin/env python3
"""Run every wk89 solution against its official sample cases."""
import json, subprocess, sys, os, glob

DETAIL = json.load(open("data/all_problems_detail.json"))
BY_ID = {x["id"]: x for x in DETAIL}
SOL_DIR = "scripts/wk89_solutions"

def norm(s):
    return s.replace("\r\n", "\n").rstrip("\n")

ids = sorted(int(os.path.basename(p)[2:-3]) for p in glob.glob(f"{SOL_DIR}/oj*.py"))
if len(sys.argv) > 1:
    ids = [int(a) for a in sys.argv[1:]]

allok = True
for pid in ids:
    sol = f"{SOL_DIR}/oj{pid}.py"
    if not os.path.exists(sol):
        print(f"oj{pid}: NO SOLUTION FILE"); allok = False; continue
    x = BY_ID.get(pid)
    cases = x.get("sampleCases") or []
    ok = True
    for i, c in enumerate(cases, 1):
        stdin = c.get("testcase_input") or ""
        expect = norm(c.get("testcase_output") or "")
        try:
            r = subprocess.run([sys.executable, sol], input=stdin,
                               capture_output=True, text=True, timeout=10)
        except subprocess.TimeoutExpired:
            print(f"oj{pid} sample {i}: TIMEOUT"); ok = False; continue
        got = norm(r.stdout)
        if r.returncode != 0:
            print(f"oj{pid} sample {i}: CRASH\n{r.stderr.strip()[:400]}"); ok = False; continue
        if got != expect:
            print(f"oj{pid} sample {i}: MISMATCH")
            print(f"  stdin=   {stdin!r}")
            print(f"  expected={expect!r}")
            print(f"  got=     {got!r}")
            ok = False
    if ok:
        print(f"oj{pid}: OK ({len(cases)} samples)")
    else:
        allok = False

sys.exit(0 if allok else 1)
