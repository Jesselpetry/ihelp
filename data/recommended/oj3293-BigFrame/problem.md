# OJ 3293: [Recommend] [LEARNING LOGS] BigFrame (กรอบข้อความ)

> - **iJudge cp_id**: 3293 — Python
> - **Time limit**: 1s | **Memory**: 32,000 KB
> - **Deadline**: 25 Sep 2026, 23:59

---

## 1. Problem Understanding

Read **exactly 5 lines** of text (letters, digits, spaces — each line may be
empty) and print them inside a rectangular frame of `*`.

The frame is a fixed 7 lines tall: a top border, the 5 text lines, a bottom
border. Every text line is wrapped as `* ` … ` *` with **one** space of padding
on each side, and all 5 are padded on the right to the same width so the right
border lines up.

```
Input                Output
Hello World          ***************
in                   * Hello World *
a                    * in          *
big                  * a           *
frame                * big         *
                     * frame       *
                     ***************
```

> [!IMPORTANT]
> Trailing spaces on an input line are **not** part of the text. `"Hello World   "`
> is framed as `"Hello World"`. Strip each line before measuring it.

## 2. Input Specification

**5 lines.** Each line is a string of `a-z`, `A-Z`, `0-9`, and spaces, length
**0 or more**. Copy the sample input exactly when testing — the trailing spaces
in the samples are deliberate.

## 3. Output Specification

**7 lines.** Border rows are `*` repeated `width + 4` times, where `width` is the
longest (right-stripped) text line. Each text row is `* ` + line padded to
`width` + ` *`. Left and right borders are always at least 2 spaces apart (this
holds automatically once you add the ` * ` … ` * ` wrapper).

## 4. Official Examples

### Example 1
- **Input**:
  ```text
  Hello World       
  in 
  a 
  big
  frame
  ```
- **Output**:
  ```text
  ***************
  * Hello World *
  * in          *
  * a           *
  * big         *
  * frame       *
  ***************
  ```

### Example 2
- **Input**:
  ```text
  Hello
  World in      
  a

  big frame
  ```
- **Output**:
  ```text
  *************
  * Hello     *
  * World in  *
  * a         *
  *           *
  * big frame *
  *************
  ```

## 5. Key Takeaways & Techniques

### 5.1 Read all five lines first, then measure

You cannot print the top border until you know how wide the frame is, and you
cannot know that until you have seen every line. So collect first, print second:

```python
lines = [input().rstrip() for _ in range(5)]
width = max(len(s) for s in lines)
```

`.rstrip()` drops the trailing whitespace; `max(len(s) for s in lines)` is the
width of the widest line — this is the single most important number in the
problem.

### 5.2 `str.ljust` does the right-padding

`s.ljust(width)` returns `s` with spaces appended until it is `width` characters
long (and returns `s` unchanged if it is already that long or longer). That is
exactly the alignment the frame needs:

```python
for s in lines:
    print("* " + s.ljust(width) + " *")
```

An empty line becomes `"* " + " " * width + " *"` — a row of spaces between two
stars, as in Example 2.

### 5.3 The border width is `width + 4`

Two stars (left, right) plus two padding spaces = 4 extra characters beyond the
text area:

| piece | length |
| :--- | :---: |
| left `* ` | 2 |
| text area | `width` |
| right ` *` | 2 |
| **total** | `width + 4` |

```python
border = "*" * (width + 4)
```

Print `border`, then the rows, then `border` again — reuse the one string, do
not rebuild it.

### 5.4 Why this is a good Learning Log problem

The bug that catches people is measuring the width from the **un-stripped**
lines, so `"Hello World   "` makes the frame too wide and every other row gets
extra padding. Write in your `submission.md` how you found it — the fix is one
`.rstrip()`, but only if you tested with the trailing-space sample.

## 6. Additional Test Cases

| Input (5 lines, `·` = space) | Expected | What it tests |
| :--- | :--- | :--- |
| `Hello World···` / `in·` / `a·` / `big` / `frame` | Example 1 | Trailing spaces ignored |
| `Hi` / `` / `` / `` / `` | `******` / `* Hi *` / `*    *` ×4 / `******` | Four empty lines |
| `` / `` / `` / `` / `` | `****` / `*  *` ×5 / `****` | All empty — width 0 |
| `X` / `XX` / `XXX` / `XXXX` / `XXXXX` | width 5 frame, staircase | Width comes from the last line |

## 7. Pre-Submission Checklist
- [ ] Read exactly 5 lines
- [ ] `.rstrip()` each line before measuring or printing
- [ ] `width` is `max(len(line) for line in lines)`
- [ ] Border is `"*" * (width + 4)`, printed top and bottom
- [ ] Text rows use `"* " + line.ljust(width) + " *"`
- [ ] Handle an all-empty input (width 0)
- [ ] PEP-8 clean
