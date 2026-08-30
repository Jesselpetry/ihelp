#!/usr/bin/env python3
"""Build data/en-kmitl/compro/labs.json from the ComPro lab scrape.

    python3 scripts/build_compro_labs.py [SOURCE_DIR] [--check]

SOURCE_DIR defaults to ~/Downloads/Midterm/Compro-Lab-EN and must contain
data/compro_problems.json as produced by that repo's scrape_compro.py.
`--check` regenerates in memory and fails if the committed JSON differs.

WHY THIS SCRIPT EXISTS
----------------------
The portal does not publish test cases as (stdin, expected) pairs. It stores a
single merged *terminal transcript* per case, in which the prompt text, the
values the grader typed (echoed back by the terminal) and the program's own
output are interleaved in one string:

     *** Get input as string ***
    Enter a name : Linda            <- "Linda" was typed, not printed
    Hello  Linda

A browser grader pipes stdin instead of typing it, so nothing echoes, and the
real expected stdout is:

     *** Get input as string ***
    Enter a name : Hello  Linda     <- prompt and next print share a line

So the two halves have to be separated. This script re-executes each problem's
reference solution (already graded Passed on the portal) with input() replaced
by a reader that lifts the next typed value out of the transcript at exactly
the cursor position the program has reached, keeping two buffers in lockstep:

    echo -- what a terminal would have shown, aligned against the transcript
    out  -- real stdout only == the expected output we ship

The transcript is LOSSY, so it is only ever used to recover the typed input,
never as the expected output. Two losses are reproduced by render() so the
alignment does not trip over them:

  * every transcript line is right-trimmed, so printed trailing spaces vanish
  * the scrape ran terminal text through an HTML parser, so anything shaped
    like a tag was swallowed -- `123 <class 'str'>` survives only as `123`

Every recovered pair is then re-verified the hard way, by piping the recovered
stdin into the reference solution in a real subprocess and diffing its stdout
against the recovered expected. A pair that fails that check is dropped rather
than shipped, because a wrong expected output would fail a correct student.
"""
import argparse
import builtins
import io
import json
import os
import re
import subprocess
import sys
import tempfile

DEFAULT_SOURCE = os.path.expanduser("~/Downloads/Midterm/Compro-Lab-EN")
OUT_PATH = os.path.join("data", "en-kmitl", "compro", "labs.json")

TAG = re.compile(r"<[^>\n]*>")

# Chapter -> the week the hub presents it as, with the skill each one drills.
WEEKS = [
    (1, "Introduction", "รู้จัก Python และคำสั่ง print",
     "พิมพ์ข้อความออกจอ คอมเมนต์ คำสงวน และกฎการย่อหน้า"),
    (2, "Variables Expression Statement", "ตัวแปร นิพจน์ และการรับค่า",
     "input() การแปลงชนิดข้อมูล เลขฐาน และการจัดรูปแบบด้วย f-string"),
    (3, "Conditional Execution", "การตัดสินใจด้วย if / elif / else",
     "เงื่อนไข การเปรียบเทียบ และการแตกกรณีหลายชั้น"),
    (4, "while", "การวนซ้ำด้วย while",
     "ตัวนับ ตัวสะสม และการวนจนกว่าเงื่อนไขจะเป็นเท็จ"),
    (5, "Definite loop", "การวนซ้ำด้วย for",
     "for กับ range() การวนบนลิสต์ และการวาดรูปด้วยลูปซ้อน"),
]


def render(text):
    """Reproduce the portal's lossy rendering of one terminal line."""
    return TAG.sub("", text).rstrip()


class Tee(io.TextIOBase):
    """Fans one write into the transcript-aligned echo buffer and the stdout buffer."""

    def __init__(self, echo, out):
        self.echo, self.out = echo, out

    def write(self, s):
        self.echo.write(s)
        self.out.write(s)
        return len(s)

    def flush(self):
        return None


class Mismatch(Exception):
    """The replay stopped lining up with the transcript."""


def _typed_value(echo_text, transcript, ordinal):
    """The value the grader typed at the cursor position the program has reached."""
    done, _, partial = echo_text.rpartition("\n")
    lines = transcript.split("\n")

    for i, line in enumerate(done.split("\n") if done else []):
        if i >= len(lines) or render(line) != render(lines[i]):
            raise Mismatch(
                f"diverged before input #{ordinal} on line {i + 1}: "
                f"ran {line!r}, transcript {(lines[i] if i < len(lines) else '<eof>')!r}"
            )

    line_no = echo_text.count("\n")
    if line_no >= len(lines):
        raise Mismatch(f"transcript ran out of lines before input #{ordinal}")

    line = lines[line_no]
    if line.startswith(partial):
        return line[len(partial):]
    # The prompt's own trailing spaces were trimmed off, which can only happen
    # when nothing was typed after the prompt.
    if render(partial) == render(line):
        return ""
    raise Mismatch(
        f"prompt mismatch before input #{ordinal}: "
        f"prompt {partial!r}, transcript {line!r}"
    )


def recover(code, transcript):
    """Return (stdin, expected_stdout) for one transcript. Raises Mismatch on drift."""
    echo, out = io.StringIO(), io.StringIO()
    tee = Tee(echo, out)
    typed = []

    def fake_input(prompt=""):
        tee.write(str(prompt))
        value = _typed_value(echo.getvalue(), transcript, len(typed) + 1)
        typed.append(value)
        echo.write(value + "\n")
        return value

    real_input, real_stdout = builtins.input, sys.stdout
    if transcript is not None:
        builtins.input = fake_input
    sys.stdout = tee
    try:
        exec(compile(code, "<solution>", "exec"), {"__name__": "__main__"})
    finally:
        builtins.input, sys.stdout = real_input, real_stdout

    if transcript is not None:
        got = [render(l) for l in echo.getvalue().rstrip("\n").split("\n")]
        want = [render(l) for l in transcript.rstrip("\n").split("\n")]
        if got != want:
            i = next((k for k in range(max(len(got), len(want)))
                      if got[k:k + 1] != want[k:k + 1]), 0)
            raise Mismatch(f"replay did not reproduce the transcript at line {i + 1}: "
                           f"ran {got[i:i + 1]}, transcript {want[i:i + 1]}")

    return "\n".join(typed), out.getvalue()


def verify(code, stdin, expected):
    """Re-run the solution as a real subprocess and confirm the pair holds."""
    with tempfile.NamedTemporaryFile("w", suffix=".py", delete=False, encoding="utf-8") as f:
        f.write(code)
        path = f.name
    try:
        proc = subprocess.run([sys.executable, path],
                              input=stdin + "\n" if stdin else "",
                              capture_output=True, text=True, timeout=15)
    finally:
        os.unlink(path)
    if proc.returncode != 0:
        return f"solution exited {proc.returncode}: {proc.stderr.strip().splitlines()[-1:]}"
    if proc.stdout != expected:
        return f"stdout differs: got {proc.stdout!r}, want {expected!r}"
    return None


def normalize(code):
    return code.replace("\r\n", "\n").replace("\r", "\n").lstrip("﻿").rstrip() + "\n"


def build(source_dir):
    src = os.path.join(source_dir, "data", "compro_problems.json")
    with open(src, encoding="utf-8") as f:
        data = json.load(f)

    week_title = {c: (th, en, note) for c, en, th, note in
                  [(w[0], w[1], w[2], w[3]) for w in WEEKS]}

    problems, dropped, case_total = [], [], 0
    for p in data["problems"]:
        chapter, item = p["chapter_id"], p["item_id"]
        if chapter > 5:
            continue
        # clean_code is the submission with the portal's identifying header
        # comment (student id and name) already stripped by the scrape; assert
        # rather than trust, since this file gets published.
        code = normalize(p["solution"]["clean_code"])
        for marker in ("Group  :", "Assigned :", "Elapsed time :"):
            assert marker not in code, f"ch{chapter}-{item} still carries submission metadata"

        transcripts = [(c["case_number"], c["sample_interaction"])
                       for c in p["test_cases"]
                       if not c["is_hidden"] and c["sample_interaction"].strip()]
        # Chapter 1 problems take no input and have no per-case transcripts;
        # a single no-stdin run of the reference solution is the whole test.
        if not transcripts:
            transcripts = [(1, None)]

        cases = []
        for number, transcript in transcripts:
            try:
                stdin, expected = recover(code, transcript)
            except Exception as exc:
                dropped.append(f"ch{chapter}-{item} case {number}: {type(exc).__name__}: {exc}")
                continue
            problem = verify(code, stdin, expected)
            if problem:
                dropped.append(f"ch{chapter}-{item} case {number}: {problem}")
                continue
            cases.append({
                "id": f"ch{chapter}-{item}-{number}",
                "stdin": stdin,
                "expected": expected.rstrip("\n"),
            })
        case_total += len(cases)

        problems.append({
            "id": f"ch{chapter}-{item}",
            "week": chapter,
            "item": item,
            "title": p["title"].strip(),
            "descriptionMd": (p.get("description_markdown") or "").strip(),
            "reference": code,
            "cases": cases,
        })

    meta = data["metadata"]
    out = {
        "meta": {
            "source": meta["source"],
            "course": meta["course"],
            "term": meta["term"],
            "institution": meta["institution"],
            "problemCount": len(problems),
            "caseCount": case_total,
        },
        "weeks": [{
            "week": c,
            "chapterTitle": en,
            "titleTh": th,
            "focusTh": note,
        } for c, en, th, note in WEEKS],
        "problems": problems,
    }
    return out, dropped


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("source", nargs="?", default=DEFAULT_SOURCE)
    ap.add_argument("--check", action="store_true",
                    help="fail if the committed JSON is out of date")
    args = ap.parse_args()

    out, dropped = build(args.source)
    text = json.dumps(out, ensure_ascii=False, indent=2) + "\n"

    for line in dropped:
        print(f"dropped {line}", file=sys.stderr)

    if args.check:
        current = open(OUT_PATH, encoding="utf-8").read() if os.path.exists(OUT_PATH) else ""
        if current != text:
            print(f"{OUT_PATH} is out of date", file=sys.stderr)
            sys.exit(1)
        print(f"{OUT_PATH} is up to date "
              f"({out['meta']['problemCount']} problems, {out['meta']['caseCount']} cases)")
        return

    os.makedirs(os.path.dirname(OUT_PATH), exist_ok=True)
    with open(OUT_PATH, "w", encoding="utf-8") as f:
        f.write(text)
    print(f"wrote {OUT_PATH}: {out['meta']['problemCount']} problems, "
          f"{out['meta']['caseCount']} verified cases, {len(dropped)} dropped")


if __name__ == "__main__":
    main()
