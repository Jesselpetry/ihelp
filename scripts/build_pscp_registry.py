#!/usr/bin/env python3
"""Build the PSCP problem registry consumed by /pscp.

Merges four sources from the course archive into one committed JSON file
(`data/pscp/problems.json`):

  1. oj_problems.json          — the 108-problem index (id, week, difficulty,
                                 deadline, learning-log / recommended flags).
  2. all_problems_detail.json  — full statements + official sample cases for
                                 the 67 problems iJudge exposed detail for.
  3. oj<id>/main.py            — the reference implementation (all 108).
  4. oj<id>/problem.md         — the authored write-up, when one exists.

Concept tags are derived by parsing each `main.py` with the `ast` module
rather than by regex, so "nested loop" means an actual nested loop node and
not the string "for" appearing twice.

Run:  python3 scripts/build_pscp_registry.py [--archive PATH]
"""

from __future__ import annotations

import argparse
import ast
import json
import os
import re
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
PROJECT = HERE.parent
OUT_FILE = PROJECT / "data" / "pscp" / "problems.json"

DEFAULT_ARCHIVE = PROJECT.parent / "pscp-69070027"

IJUDGE_URL = "https://ijudge.it.kmitl.ac.th/problems/{id}/description"


# ---------------------------------------------------------------------------
# statement text normalisation
# ---------------------------------------------------------------------------

# The iJudge statement bodies are markdown with a few raw HTML fragments mixed
# in (<u>, <br />, &nbsp;). The app renders markdown without rehype-raw, so any
# surviving tag would show up as literal text on the page. Fold them into
# markdown equivalents here, at ingest time, rather than shipping a raw-HTML
# renderer just for these.
_TAG_REWRITES = [
    (re.compile(r"<br\s*/?>", re.I), "\n"),
    (re.compile(r"</?(?:u|ins)>", re.I), ""),
    (re.compile(r"</?(?:b|strong)>", re.I), "**"),
    (re.compile(r"</?(?:i|em)>", re.I), "*"),
    (re.compile(r"</?(?:p|div|span|font)[^>]*>", re.I), ""),
]

_ENTITIES = {"&nbsp;": " ", "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"', "&#39;": "'"}


def normalize_statement(text: str | None) -> str:
    if not text:
        return ""
    out = text.replace("\r\n", "\n").replace("\r", "\n")
    for pattern, repl in _TAG_REWRITES:
        out = pattern.sub(repl, out)
    for entity, repl in _ENTITIES.items():
        out = out.replace(entity, repl)
    # Any tag we did not plan for is dropped rather than rendered literally.
    out = re.sub(r"<[^>\n]{1,40}>", "", out)
    # Collapse the runs of blank lines the <br /> expansion can leave behind.
    out = re.sub(r"\n{3,}", "\n\n", out)
    return out.strip()


def normalize_io(text: str | None) -> str:
    """Test-case payloads are compared byte-for-byte, so only CRLF is touched."""
    if text is None:
        return ""
    return text.replace("\r\n", "\n").replace("\r", "\n").rstrip("\n")


# ---------------------------------------------------------------------------
# deadlines
# ---------------------------------------------------------------------------

MONTHS = {
    "january": "01", "february": "02", "march": "03", "april": "04",
    "may": "05", "june": "06", "july": "07", "august": "08",
    "september": "09", "october": "10", "november": "11", "december": "12",
}

_EXPIRE_RE = re.compile(r"^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4}),?\s*(\d{2}):(\d{2})$")


def parse_expire(expire: str | None) -> str | None:
    """"31 July 2026, 00:00" -> "2026-07-31T00:00". Mirrors lib/master.ts."""
    if not expire:
        return None
    m = _EXPIRE_RE.match(expire.strip())
    if not m:
        return None
    month = MONTHS.get(m.group(2).lower())
    if not month:
        return None
    return f"{m.group(3)}-{month}-{m.group(1).zfill(2)}T{m.group(4)}:{m.group(5)}"


# ---------------------------------------------------------------------------
# concept tags, derived from the reference solution's AST
# ---------------------------------------------------------------------------

BUILTIN_AGGREGATES = {"sum", "max", "min", "len", "abs", "round", "sorted", "any", "all"}
STRING_METHODS = {
    "split", "join", "strip", "lstrip", "rstrip", "upper", "lower", "title",
    "replace", "find", "startswith", "endswith", "count", "zfill", "format",
    "isdigit", "isalpha", "capitalize",
}
LIST_METHODS = {"append", "extend", "insert", "pop", "remove", "sort", "reverse", "index"}


class _CodeFacts(ast.NodeVisitor):
    """Collects the structural facts the tag rules below are written against."""

    def __init__(self) -> None:
        self.tags: set[str] = set()
        self.func_names: set[str] = set()
        self.called_names: list[str] = []
        self.loop_depth = 0
        self.if_depth = 0
        self.subscript_chain_max = 0

    # -- helpers ----------------------------------------------------------
    def _walk_loop(self, node: ast.AST) -> None:
        self.loop_depth += 1
        if self.loop_depth >= 2:
            self.tags.add("nested-loops")
        self.generic_visit(node)
        self.loop_depth -= 1

    # -- visitors ---------------------------------------------------------
    def visit_For(self, node: ast.For) -> None:
        self.tags.add("loops-for")
        it = node.iter
        if isinstance(it, ast.Call) and isinstance(it.func, ast.Name) and it.func.id == "range":
            self.tags.add("ranges")
        self._walk_loop(node)

    def visit_While(self, node: ast.While) -> None:
        self.tags.add("loops-while")
        self._walk_loop(node)

    def visit_If(self, node: ast.If) -> None:
        # `elif X:` and `else: if X:` are the same AST shape — a single If as
        # the sole orelse statement. Both are one flat ladder, not nesting, so
        # the chain continues at the current depth. Only an If reached through
        # a body (or a multi-statement else) counts as genuinely nested.
        self.tags.add("conditionals")
        is_ladder = len(node.orelse) == 1 and isinstance(node.orelse[0], ast.If)
        if is_ladder:
            self.tags.add("chained-conditionals")

        self.if_depth += 1
        if self.if_depth >= 2:
            self.tags.add("nested-conditionals")
        self.visit(node.test)
        for stmt in node.body:
            self.visit(stmt)
        self.if_depth -= 1

        for stmt in node.orelse:
            if is_ladder:
                self.visit(stmt)
            else:
                self.if_depth += 1
                if self.if_depth >= 2:
                    self.tags.add("nested-conditionals")
                self.visit(stmt)
                self.if_depth -= 1

    def visit_FunctionDef(self, node: ast.FunctionDef) -> None:
        self.func_names.add(node.name)
        if node.args.args or node.args.kwonlyargs:
            self.tags.add("functions")
        for sub in ast.walk(node):
            if isinstance(sub, ast.Return) and sub.value is not None:
                self.tags.add("functions")
                break
        self.generic_visit(node)

    def visit_Call(self, node: ast.Call) -> None:
        func = node.func
        if isinstance(func, ast.Name):
            name = func.id
            self.called_names.append(name)
            if name == "input":
                self.tags.add("io")
            elif name in ("int", "float", "str", "bool"):
                self.tags.add("type-casting")
            elif name in BUILTIN_AGGREGATES:
                self.tags.add("aggregation")
            if name in ("sorted",):
                self.tags.add("sorting")
        elif isinstance(func, ast.Attribute):
            attr = func.attr
            self.called_names.append(attr)
            if attr in STRING_METHODS:
                self.tags.add("string-methods")
            if attr in LIST_METHODS:
                self.tags.add("lists")
            if attr in ("sort",):
                self.tags.add("sorting")
            if isinstance(func.value, ast.Name) and func.value.id == "math":
                self.tags.add("math")
        self.generic_visit(node)

    def visit_Import(self, node: ast.Import) -> None:
        for alias in node.names:
            if alias.name == "math":
                self.tags.add("math")
        self.generic_visit(node)

    def visit_ImportFrom(self, node: ast.ImportFrom) -> None:
        if node.module == "math":
            self.tags.add("math")
        self.generic_visit(node)

    def visit_BinOp(self, node: ast.BinOp) -> None:
        op = node.op
        if isinstance(op, ast.Mod):
            self.tags.add("modulo")
        elif isinstance(op, ast.FloorDiv):
            self.tags.add("integer-division")
        elif isinstance(op, ast.Pow):
            self.tags.add("exponentiation")
        self.generic_visit(node)

    def visit_BoolOp(self, node: ast.BoolOp) -> None:
        self.tags.add("boolean-logic")
        self.generic_visit(node)

    def visit_List(self, node: ast.List) -> None:
        self.tags.add("lists")
        if any(isinstance(e, (ast.List, ast.Tuple)) for e in node.elts):
            self.tags.add("nested-lists")
        self.generic_visit(node)

    def visit_Dict(self, node: ast.Dict) -> None:
        self.tags.add("dictionaries")
        self.generic_visit(node)

    def visit_Set(self, node: ast.Set) -> None:
        self.tags.add("sets")
        self.generic_visit(node)

    def visit_ListComp(self, node: ast.ListComp) -> None:
        self.tags.add("comprehension")
        self.tags.add("lists")
        self.generic_visit(node)

    def visit_DictComp(self, node: ast.DictComp) -> None:
        self.tags.add("comprehension")
        self.generic_visit(node)

    def visit_Slice(self, node: ast.Slice) -> None:
        self.tags.add("string-slicing")
        self.generic_visit(node)

    def visit_JoinedStr(self, node: ast.JoinedStr) -> None:
        self.tags.add("formatting")
        for value in node.values:
            if isinstance(value, ast.FormattedValue) and value.format_spec is not None:
                self.tags.add("decimal-formatting")
        self.generic_visit(node)

    def visit_Try(self, node: ast.Try) -> None:
        self.tags.add("error-handling")
        self.generic_visit(node)

    def visit_Subscript(self, node: ast.Subscript) -> None:
        depth = 1
        inner = node.value
        while isinstance(inner, ast.Subscript):
            depth += 1
            inner = inner.value
        self.subscript_chain_max = max(self.subscript_chain_max, depth)
        self.generic_visit(node)


def derive_tags(code: str, statement: str) -> tuple[list[str], bool]:
    """Returns (tags, parsed_ok). Falls back to text heuristics if unparsable."""
    facts = _CodeFacts()
    parsed = True
    try:
        tree = ast.parse(code)
    except SyntaxError:
        parsed = False
        tree = None

    if tree is not None:
        facts.visit(tree)
        # A function that appears in its own call list is recursive.
        for name in facts.func_names:
            if facts.called_names.count(name) >= 1:
                subtree_calls = [
                    n
                    for n in ast.walk(tree)
                    if isinstance(n, ast.Call)
                    and isinstance(n.func, ast.Name)
                    and n.func.id == name
                ]
                for call in subtree_calls:
                    for fn in ast.walk(tree):
                        if isinstance(fn, ast.FunctionDef) and fn.name == name:
                            if any(c is call for c in ast.walk(fn)):
                                facts.tags.add("recursion")
        if facts.subscript_chain_max >= 2:
            facts.tags.add("nested-lists")

    tags = facts.tags

    # Statement-level signals the code alone cannot show.
    if re.search(r"\bstring|สตริง|ตัวอักษร|ข้อความ", statement, re.I):
        if "string-methods" in tags or "string-slicing" in tags:
            tags.add("strings")
    if '"' in code or "'" in code:
        if "string-methods" in tags or "string-slicing" in tags:
            tags.add("strings")
    if ":.2f" in code or ":.1f" in code or ":.3f" in code:
        tags.add("decimal-formatting")
        tags.add("formatting")
    if "%" in code and "modulo" not in tags and re.search(r"[\w)\]]\s*%\s*[\w(]", code):
        tags.add("modulo")

    # An accumulator is an augmented assignment inside a loop.
    if tree is not None:
        for node in ast.walk(tree):
            if isinstance(node, (ast.For, ast.While)):
                if any(isinstance(n, ast.AugAssign) for n in ast.walk(node)):
                    tags.add("accumulator")
                    break

    if not tags:
        tags.add("io")

    return sorted(tags), parsed


# Ordered so the two or three most characteristic tags sort to the front of a
# card. Lower rank = more distinctive / more worth surfacing first.
TAG_RANK = [
    "recursion", "nested-lists", "nested-loops", "comprehension", "sorting",
    "dictionaries", "sets", "string-slicing", "accumulator", "chained-conditionals",
    "nested-conditionals", "loops-while", "loops-for", "ranges", "string-methods",
    "strings", "lists", "boolean-logic", "modulo", "integer-division",
    "exponentiation", "math", "decimal-formatting", "aggregation", "functions",
    "error-handling", "type-casting", "conditionals", "formatting", "io",
]
_RANK_INDEX = {tag: i for i, tag in enumerate(TAG_RANK)}


def rank_tags(tags: list[str]) -> list[str]:
    return sorted(tags, key=lambda tg: _RANK_INDEX.get(tg, len(TAG_RANK)))


# ---------------------------------------------------------------------------
# takeaways — structural, derived from the ranked tags
# ---------------------------------------------------------------------------

TAKEAWAY_TEXT: dict[str, dict[str, str]] = {
    "recursion": {
        "th": "ใช้การเรียกฟังก์ชันซ้ำ (recursion) ต้องมี base case เสมอ ไม่งั้นจะวนไม่รู้จบ",
        "en": "Solved with recursion — always pin down the base case before the recursive step.",
    },
    "nested-lists": {
        "th": "ทำงานกับลิสต์ซ้อนลิสต์ (ตาราง 2 มิติ) เข้าถึงด้วย a[row][col]",
        "en": "Works on nested lists (a 2-D grid); index with a[row][col].",
    },
    "nested-loops": {
        "th": "ใช้ลูปซ้อนลูป ลูปนอกคุมแถว ลูปในคุมคอลัมน์",
        "en": "Uses nested loops — the outer loop drives rows, the inner one columns.",
    },
    "comprehension": {
        "th": "ย่อลูปสร้างลิสต์ให้เหลือบรรทัดเดียวด้วย list comprehension",
        "en": "Collapses a build-a-list loop into a single comprehension.",
    },
    "sorting": {
        "th": "ต้องเรียงลำดับข้อมูลก่อนนำไปใช้ ด้วย sorted() หรือ .sort()",
        "en": "Requires ordering the data first via sorted() or .sort().",
    },
    "dictionaries": {
        "th": "ใช้ dict จับคู่คีย์กับค่า แทนการไล่ if หลายชั้น",
        "en": "Uses a dict for key/value lookup instead of a long if-chain.",
    },
    "sets": {
        "th": "ใช้ set เพื่อตัดค่าซ้ำและเช็คความเป็นสมาชิกได้เร็ว",
        "en": "Uses a set to drop duplicates and test membership quickly.",
    },
    "string-slicing": {
        "th": "ตัดต่อสตริงด้วย slicing [start:stop:step] เช่น [::-1] เพื่อกลับด้าน",
        "en": "Slices strings with [start:stop:step] — e.g. [::-1] to reverse.",
    },
    "accumulator": {
        "th": "ใช้รูปแบบตัวสะสม (accumulator) ประกาศตัวแปรไว้นอกลูป แล้วบวกสะสมในลูป",
        "en": "Uses the accumulator pattern: initialise outside the loop, add inside it.",
    },
    "chained-conditionals": {
        "th": "ไล่เงื่อนไขด้วย if-elif-else ลำดับการตรวจสำคัญมาก",
        "en": "Walks an if-elif-else ladder — the order of the branches matters.",
    },
    "nested-conditionals": {
        "th": "มีเงื่อนไขซ้อนเงื่อนไข ต้องระวังระดับการเยื้อง (indentation)",
        "en": "Has conditionals inside conditionals — mind the indentation levels.",
    },
    "loops-while": {
        "th": "ใช้ while loop ต้องมีคำสั่งที่ทำให้เงื่อนไขเป็นเท็จได้ ไม่งั้นลูปไม่จบ",
        "en": "Uses a while loop — make sure something inside can end the condition.",
    },
    "loops-for": {
        "th": "วนซ้ำด้วย for loop ตามจำนวนรอบที่รู้ล่วงหน้า",
        "en": "Iterates with a for loop over a known number of steps.",
    },
    "ranges": {
        "th": "ใช้ range() กำหนดรอบ จำไว้ว่า range(n) จบที่ n-1",
        "en": "Drives the loop with range() — remember range(n) stops at n-1.",
    },
    "string-methods": {
        "th": "ใช้เมท็อดของสตริง เช่น .split(), .strip(), .lower() จัดรูปข้อมูลก่อนใช้งาน",
        "en": "Leans on string methods such as .split(), .strip(), .lower().",
    },
    "strings": {
        "th": "โจทย์เน้นการจัดการข้อความ (string processing)",
        "en": "A string-processing problem at heart.",
    },
    "lists": {
        "th": "เก็บข้อมูลหลายค่าไว้ในลิสต์ แล้ววนอ่าน/เขียนทีละตัว",
        "en": "Stores many values in a list, then reads or writes them one by one.",
    },
    "boolean-logic": {
        "th": "รวมเงื่อนไขหลายข้อด้วย and / or / not",
        "en": "Combines several conditions with and / or / not.",
    },
    "modulo": {
        "th": "ใช้ % หาเศษ เหมาะกับการเช็คคู่/คี่ หรือหารลงตัว",
        "en": "Uses % for remainders — the standard even/odd and divisibility test.",
    },
    "integer-division": {
        "th": "ใช้ // หารแบบปัดลง ได้จำนวนเต็มเสมอ ต่างจาก /",
        "en": "Uses // for floor division, which always yields an integer (unlike /).",
    },
    "exponentiation": {
        "th": "ยกกำลังด้วย ** ระวังลำดับวงเล็บให้ถูกต้อง",
        "en": "Raises powers with ** — watch the parenthesisation.",
    },
    "math": {
        "th": "เรียกใช้โมดูล math สำหรับสูตรคณิตศาสตร์ เช่น sqrt, pi",
        "en": "Calls into the math module for sqrt, pi, and friends.",
    },
    "decimal-formatting": {
        "th": "ต้องจัดรูปทศนิยมให้ตรงเป๊ะด้วย f\"{x:.2f}\" มิฉะนั้นจะถือว่าผิด",
        "en": "Must format decimals exactly with f\"{x:.2f}\" or the case is marked wrong.",
    },
    "aggregation": {
        "th": "ใช้ฟังก์ชันสำเร็จรูป sum(), max(), min(), len() สรุปค่าจากลำดับข้อมูล",
        "en": "Summarises a sequence with built-ins: sum(), max(), min(), len().",
    },
    "functions": {
        "th": "แยกตรรกะออกเป็นฟังก์ชันที่รับพารามิเตอร์และ return ค่ากลับ",
        "en": "Factors the logic into a function that takes parameters and returns a value.",
    },
    "error-handling": {
        "th": "ดักข้อผิดพลาดด้วย try / except",
        "en": "Guards failure paths with try / except.",
    },
    "type-casting": {
        "th": "แปลงชนิดข้อมูลด้วย int() / float() ก่อนคำนวณ เพราะ input() คืนค่าเป็นสตริงเสมอ",
        "en": "Casts with int() / float() first — input() always hands back a string.",
    },
    "conditionals": {
        "th": "ตัดสินใจด้วย if / else ตามเงื่อนไขที่โจทย์กำหนด",
        "en": "Branches with if / else on the condition the statement specifies.",
    },
    "formatting": {
        "th": "ประกอบข้อความผลลัพธ์ด้วย f-string",
        "en": "Builds the output line with an f-string.",
    },
    "io": {
        "th": "รับค่าด้วย input() และแสดงผลด้วย print() ตามรูปแบบที่กำหนด",
        "en": "Reads with input() and prints in exactly the required shape.",
    },
}


def build_takeaway(ranked: list[str]) -> dict:
    picks = [tg for tg in ranked if tg in TAKEAWAY_TEXT][:3]
    return {
        "points": [
            {"tag": tg, "th": TAKEAWAY_TEXT[tg]["th"], "en": TAKEAWAY_TEXT[tg]["en"]}
            for tg in picks
        ]
    }


def build_pitfalls(code: str, cases: list[dict], ranked: list[str]) -> list[dict]:
    """Pitfalls only where the ingested artefacts actually evidence one."""
    out: list[dict] = []

    if "decimal-formatting" in ranked:
        out.append({
            "th": "ผลลัพธ์ต้องมีทศนิยมครบตามที่กำหนด — พิมพ์ 70 แทน 70.00 จะถือว่าผิด",
            "en": "The decimal places are part of the answer — printing 70 instead of 70.00 fails.",
        })

    expected_words = {c["expected"].strip() for c in cases}
    literal_words = {w for w in expected_words if re.fullmatch(r"[A-Za-z][A-Za-z ]{0,20}", w)}
    if literal_words:
        sample = sorted(literal_words)[0]
        out.append({
            "th": f"บางเคสต้องพิมพ์ข้อความตรงตัว เช่น \"{sample}\" — ตัวพิมพ์เล็ก/ใหญ่ต้องตรงเป๊ะ",
            "en": f"Some cases expect a literal word such as \"{sample}\" — capitalisation must match exactly.",
        })

    if any("\n" in c["stdin"] for c in cases):
        lines = max(len(c["stdin"].split("\n")) for c in cases)
        out.append({
            "th": f"อินพุตมาหลายบรรทัด ({lines} บรรทัด) ต้องเรียก input() ให้ครบทุกบรรทัด",
            "en": f"Input arrives over multiple lines ({lines}); call input() once per line.",
        })

    if "integer-division" in ranked:
        out.append({
            "th": "ใช้ // ไม่ใช่ / — ตัวหลังคืนค่า float และจะพิมพ์ .0 ติดมาด้วย",
            "en": "Use // not / — the latter returns a float and prints a trailing .0.",
        })

    if "ranges" in ranked:
        out.append({
            "th": "range(n) วนถึง n-1 เท่านั้น ถ้าต้องรวม n ต้องใช้ range(n+1)",
            "en": "range(n) stops at n-1; include n with range(n+1).",
        })

    return out[:3]


# ---------------------------------------------------------------------------
# archive readers
# ---------------------------------------------------------------------------

def slugify(name: str) -> str:
    s = re.sub(r"\[[^\]]*\]", " ", name)
    s = re.sub(r"[^A-Za-z0-9]+", "-", s).strip("-").lower()
    return s


def clean_name(name: str) -> str:
    return re.sub(r"\[\s*(?:LEARNING\s*LOGS?|RECOMMEND(?:ED)?|MIDTERM)\s*\]", "", name).strip() or name


def index_local_dirs(archive: Path) -> tuple[dict[int, Path], dict[int, Path]]:
    """Maps problem id -> main.py path and id -> problem.md path."""
    mains: dict[int, Path] = {}
    mds: dict[int, Path] = {}
    roots = [archive] + ([archive / "oj"] if (archive / "oj").is_dir() else [])
    for root in roots:
        for child in sorted(root.iterdir()):
            if not child.is_dir():
                continue
            m = re.match(r"oj(\d+)", child.name)
            if not m:
                continue
            pid = int(m.group(1))
            main_py = child / "main.py"
            prob_md = child / "problem.md"
            # Root-level dirs are the working copies and win over ./oj archives.
            if main_py.is_file() and (pid not in mains or root is archive):
                mains[pid] = main_py
            if prob_md.is_file() and (pid not in mds or root is archive):
                mds[pid] = prob_md
    return mains, mds


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--archive", default=os.environ.get("PSCP_ARCHIVE", str(DEFAULT_ARCHIVE)))
    args = ap.parse_args()

    archive = Path(args.archive).expanduser().resolve()
    if not archive.is_dir():
        print(f"error: archive not found: {archive}", file=sys.stderr)
        return 1

    index_file = archive / "oj_problems.json"
    detail_file = archive / "data" / "all_problems_detail.json"
    if not index_file.is_file():
        print(f"error: missing {index_file}", file=sys.stderr)
        return 1

    index = json.loads(index_file.read_text(encoding="utf-8"))
    details = {}
    if detail_file.is_file():
        details = {d["id"]: d for d in json.loads(detail_file.read_text(encoding="utf-8"))}

    mains, mds = index_local_dirs(archive)

    problems = []
    unparsable: list[int] = []

    for raw in sorted(index, key=lambda r: r["id"]):
        pid = raw["id"]
        detail = details.get(pid)
        name = raw["name"]
        cname = clean_name(name)

        code = ""
        if pid in mains:
            code = mains[pid].read_text(encoding="utf-8").replace("\r\n", "\n").strip("\n")
        elif detail and detail.get("beforeCode"):
            code = detail["beforeCode"].replace("\r\n", "\n").strip("\n")

        markdown = ""
        if pid in mds:
            markdown = mds[pid].read_text(encoding="utf-8").replace("\r\n", "\n")

        statement = {}
        limits = None
        note = ""
        if detail:
            p = detail.get("problem") or {}
            statement = {
                "description": normalize_statement(p.get("problem_description")),
                "inputSpec": normalize_statement(p.get("problem_input_specification")),
                "outputSpec": normalize_statement(p.get("problem_output_specification")),
            }
            note = normalize_statement(p.get("problem_note"))
            cp = detail.get("courseProblem") or {}
            limits = {
                "timeoutSec": cp.get("cp_timeout"),
                "memoryKb": cp.get("cp_memory_limit"),
                "lang": cp.get("cp_lang_type") or "Python",
            }

        cases = []
        if detail:
            for i, sc in enumerate(detail.get("sampleCases") or [], start=1):
                cases.append({
                    "id": f"{pid}-official-{i}",
                    "stdin": normalize_io(sc.get("testcase_input")),
                    "expected": normalize_io(sc.get("testcase_output")),
                    "official": True,
                    "label": {"th": f"ตัวอย่างทางการที่ {i}", "en": f"Official Example {i}"},
                })

        blob = " ".join(
            [statement.get("description", ""), statement.get("inputSpec", ""), statement.get("outputSpec", ""), markdown]
        )
        tags, parsed_ok = derive_tags(code, blob) if code else (["io"], True)
        if code and not parsed_ok:
            unparsable.append(pid)
        ranked = rank_tags(tags)

        stats = {
            "passed": raw.get("passed_count", 0),
            "attempt": raw.get("attempt_count", 0),
            "percentage": raw.get("percentage"),
        }

        problems.append({
            "id": pid,
            "slug": f"oj{pid}-{slugify(cname)}".rstrip("-"),
            "name": name,
            "cleanName": cname,
            "week": raw.get("week"),
            "difficulty": raw.get("difficulty", 0),
            "learningLog": bool(raw.get("is_learning_log")),
            "recommended": bool(raw.get("is_recommended")),
            "midterm": bool(raw.get("is_midterm")),
            "url": raw.get("url") or IJUDGE_URL.format(id=pid),
            "expireLabel": raw.get("expire_date", ""),
            "expireIso": parse_expire(raw.get("expire_date")),
            "stats": stats,
            "statement": statement or None,
            "note": note or None,
            "limits": limits,
            "tags": ranked,
            "takeaway": build_takeaway(ranked),
            "pitfalls": build_pitfalls(code, cases, ranked),
            "referenceCode": code or None,
            # `markdown` (problem.md) is deliberately NOT emitted: its body is
            # the same text as `statement` and its §4 samples are the same
            # pairs as `cases`. It is still read above, to feed tag derivation.
            "cases": cases,
        })

    OUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    payload = {
        "generatedAt": None,  # deliberately omitted: keeps the file diff-stable
        "source": "pscp-69070027 (oj_problems.json + all_problems_detail.json + oj*/main.py)",
        "problems": problems,
    }
    OUT_FILE.write_text(json.dumps(payload, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")

    with_cases = sum(1 for p in problems if p["cases"])
    with_code = sum(1 for p in problems if p["referenceCode"])
    with_stmt = sum(1 for p in problems if p["statement"])
    weeks = sorted({p["week"] for p in problems if p["week"]})
    print(f"wrote {OUT_FILE.relative_to(PROJECT)}")
    print(f"  problems       : {len(problems)}")
    print(f"  weeks covered  : {weeks}")
    print(f"  with statement : {with_stmt}")
    print(f"  with test cases: {with_cases}  (total cases: {sum(len(p['cases']) for p in problems)})")
    print(f"  with main.py   : {with_code}")
    if unparsable:
        print(f"  WARN unparsable main.py: {unparsable}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
