# OJ 3290: [Recommend] Left Arrow (ป้ายไฟเลี้ยวซ้าย)

> - **iJudge cp_id**: 3290 — Python
> - **Time limit**: 1s | **Memory**: 32,000 KB
> - **Deadline**: 25 Sep 2026, 23:59

---

## 1. Problem Understanding

Read two integers, `k` (width) and `n` (height, always **odd**), and print a
left-pointing arrow made of `*`.

Every row is a solid bar of exactly `k` stars. What changes row to row is the
**indentation**: the middle row sits flush left, and rows above and below it
step further and further to the right, so the left edge forms a `<` shape.

```
k = 7, n = 5

  *******      row 0  — indent 2
 *******       row 1  — indent 1
*******        row 2  — indent 0  (middle, the tip)
 *******       row 3  — indent 1
  *******      row 4  — indent 2
```

## 2. Input Specification

**2 lines**

- Line 1: `k` — a positive integer, the width of the bar
- Line 2: `n` — a positive **odd** integer, the height

## 3. Output Specification

**n lines**, each `indent` spaces followed by `k` stars, forming a left arrow.

## 4. Official Examples

### Example 1
- **Input**:
  ```text
  7
  5
  ```
- **Output**:
  ```text
    *******
   *******
  *******
   *******
    *******
  ```

### Example 2
- **Input**:
  ```text
  10
  11
  ```
- **Output**:
  ```text
       **********
      **********
     **********
    **********
   **********
  **********
   **********
    **********
     **********
      **********
       **********
  ```

## 5. Key Takeaways & Techniques

### 5.1 Find the middle row first

`n` is odd, so there is exactly one middle row and `mid = n // 2` is its index.
For `n = 5`, `mid = 2`; for `n = 11`, `mid = 5`.

### 5.2 The indentation is a distance from the middle

Row `i` is indented by how far it is from the middle row:

| row `i` | `abs(i - mid)` | indent |
| :---: | :---: | :---: |
| 0 | `abs(0 - 2)` | 2 |
| 1 | `abs(1 - 2)` | 1 |
| 2 | `abs(2 - 2)` | 0 |
| 3 | `abs(3 - 2)` | 1 |
| 4 | `abs(4 - 2)` | 2 |

`abs()` makes the value symmetric — it counts up to the middle and back down
without a second loop or an `if row < mid` branch.

```python
mid = n // 2
for row in range(n):
    indent = abs(row - mid)
    print(" " * indent + "*" * k)
```

### 5.3 String multiplication builds each row

`" " * indent` is the leading spaces; `"*" * k` is the bar. Concatenating them
is the whole row — no inner loop over columns is needed for a solid bar.

> [!IMPORTANT]
> Do not add trailing spaces after the stars. iJudge compares the line exactly;
> `"*" * k + " " * indent` on the right side would fail even though it "looks"
> like an arrow.

### 5.4 Right Arrow is the mirror image

OJ 3291 asks for a right-pointing arrow. Only the indent formula flips:
`indent = mid - abs(row - mid)` — the middle row is pushed in the most, the ends
sit flush left.

## 6. Additional Test Cases

| Input | Expected Output | What it tests |
| :--- | :--- | :--- |
| `7` / `5` | see Example 1 | The standard shape |
| `10` / `11` | see Example 2 | A taller arrow, wider indents |
| `1` / `1` | `*` | `n = 1`: a single middle row, indent 0 |
| `3` / `3` | ` *` / `*` / ` *` | Smallest real arrow, `mid = 1` |
| `5` / `1` | `*****` | One row, any width |

## 7. Pre-Submission Checklist
- [ ] Read `k` then `n`, both as `int`
- [ ] `mid = n // 2` — integer division
- [ ] Row indent is `abs(row - mid)`, not `row - mid`
- [ ] Each row is exactly `k` stars with **no** trailing spaces
- [ ] Test `n = 1` and a large odd `n`
- [ ] PEP-8 clean
