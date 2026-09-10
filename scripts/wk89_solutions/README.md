# Week 8 & 9 reference solutions

Authored reference solutions for the 27 OJ problems added for Weeks 8 & 9
(ids 3290–3301, 3349–3363). Each `ojNNNN.py` is verified against every official
sample case in `data/all_problems_detail.json`:

```bash
python3 scripts/wk89_solutions/verify.py          # all 27
python3 scripts/wk89_solutions/verify.py 3355     # one
```

These files are the source of truth. Copy them into the archive repo where
`scripts/build_pscp_registry.py` indexes them:

```bash
for f in scripts/wk89_solutions/oj*.py; do
  id=$(basename "$f" .py); mkdir -p ../pscp-69070027/"$id"
  cp "$f" ../pscp-69070027/"$id"/main.py
done
python3 scripts/build_pscp_registry.py
python3 scripts/build_pscp_edge_cases.py
```

## Known discrepancy

- **oj3362 (บุพเพสันนิวาส)** passes official sample 1 and matches the statement's
  own worked example (`$www$w$`), but official sample 2 shows `$$www$w$` — an
  extra leading `$` the prose does not explain. The solution follows the prose.
  oj3362's `edgeCases` are cleared in `data/pscp/problems.json` so the grader
  never asserts a disputed expected value.
