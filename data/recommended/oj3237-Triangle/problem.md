# OJ 3237: [Recommend] Triangle (สามเหลี่ยม)

> - **iJudge cp_id**: 3237 — Python
> - **Time limit**: 1s | **Memory**: 32,000 KB
> - **Deadline**: 11 Sep 2026, 00:00

---

## 1. Problem Understanding

Read an integer `n` and print a triangle `n` lines tall, drawn with the digits `0` and `1`.

The triangle is **left-aligned** and **hollow**:
- The **border** is drawn with `0`
- The **hollow interior** is filled with `1`

> [!IMPORTANT]
> This problem uses **no asterisks (`*`) and no leading spaces**. Row `i` contains exactly `i` characters.

## 2. Input Specification

**1 line**

- An integer `n` (the height of the triangle)

## 3. Output Specification

**n lines** forming a hollow triangle.

## 4. Official Examples

### Example 1
- **Input**:
  ```text
  7
  ```
- **Output**:
  ```text
  0
  00
  010
  0110
  01110
  011110
  0000000
  ```

### Example 2
- **Input**:
  ```text
  3
  ```
- **Output**:
  ```text
  0
  00
  000
  ```

## 5. Key Takeaways & Techniques

### 5.1 First, work out which rows are border rows

Break down the rows of `n = 7`:

| Row | Output | What it is |
| :---: | :--- | :--- |
| 1 | `0` | **Top border** (the apex) |
| 2 | `00` | Left border + right border, adjacent with no gap between them |
| 3 | `010` | Left border + 1 hollow cell + right border |
| 4 | `0110` | Left border + 2 hollow cells + right border |
| 5 | `01110` | Left border + 3 hollow cells + right border |
| 6 | `011110` | Left border + 4 hollow cells + right border |
| 7 | `0000000` | **Bottom border** (the base), fully solid |

The rule is therefore:
- The **first row (i = 1)** and the **last row (i = n)** are borders — print `0` repeated `i` times
- **Middle rows** print `0` + `1` repeated `(i - 2)` times + `0`

### 5.2 Why the middle rows use `(i - 2)`
Row `i` holds `i` characters in total. One is the left border and one is the right border, so the hollow part is `i - 2` characters.

### 5.3 Row 2 works automatically
For `i = 2`, the middle-row formula gives `"0" + "1" * 0 + "0"` = `"00"` ✅
because `"1" * 0` is the empty string — **no separate `if` for row 2 is needed**.

### 5.4 But row 1 must be special-cased!
If `i = 1` fell through to the middle-row formula you would get `"0" + "1" * (-1) + "0"` = `"00"`, which is **wrong** (it must be a single `"0"`).

> In Python, multiplying a string by a negative number (`"1" * -1`) does not raise an error — it returns an empty string. That makes this a silent bug that is hard to spot.
> Always guard it with `if i == 1`.

### 5.5 Combine the two border rows with `in`
The first and last rows do the same thing (print `0` repeated `i` times), so combine the conditions:

```python
if i in (1, n):
    print("0" * i)
else:
    print("0" + "1" * (i - 2) + "0")
```

This is shorter than `if i == 1 or i == n:`, and pylint prefers it too (the `consider-using-in` warning).

### 5.6 Watch out for n = 1 and n = 2
- `n = 1` → a single row matching both sides of `i in (1, n)`, giving `0` ✅
- `n = 2` → `0` then `00` (row 2 is also the last row) ✅
- `n = 3` → `0`, `00`, `000` — **no hollow rows at all**, since row 2 has zero hollow cells and row 3 is the base ✅

## 6. Additional Test Cases

| Input | Expected Output | What it tests |
| :--- | :--- | :--- |
| `7` | see the official example | The full shape with a visible hollow interior |
| `3` | `0` / `00` / `000` | **Official example**, no hollow part yet |
| `1` | `0` | **Smallest boundary case** (getting `00` means row 1 was not guarded) |
| `2` | `0` / `00` | The last row arrives immediately |
| `5` | `0` / `00` / `010` / `0110` / `00000` | Confirms the base is solid, not `01110` |

## 7. Pre-Submission Checklist
- [ ] Read the height `n` as `int`
- [ ] Use the digits `0` and `1` — **not** `*` — and no leading spaces
- [ ] The last row is solid `0`
- [ ] Guard row 1 (`i = 1`) so it prints a single `0`
- [ ] Test `n = 1` and `n = 7`
- [ ] PEP-8 clean
