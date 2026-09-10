# OJ 3355: [Recommend] [LEARNING LOGS] Shorten (ย่อช่วงตัวเลข)

> - **iJudge cp_id**: 3355 — Python
> - **Time limit**: 1s | **Memory**: 32,000 KB
> - **Deadline**: 9 Oct 2026, 00:00

---

## 1. Problem Understanding

Read positive integers, one per line, until you read `-1`. The numbers are
**strictly increasing**. Print them in shortened form: any run of consecutive
integers `a, a+1, …, b` becomes `a-b`, and a lone integer stays as itself.
Join the pieces with `", "`.

```
input:  1  2  3  5  7  9  10  -1
output: 1-3, 5, 7, 9-10
```

`1 2 3` is consecutive → `1-3`. `5` stands alone → `5`. `9 10` is consecutive →
`9-10`.

## 2. Input Specification

An **unknown number of lines**, each a positive integer in increasing order,
terminated by a line containing `-1`.

## 3. Output Specification

**1 line** — the shortened form, ranges written `a-b`, singletons written `a`,
separated by `, `.

## 4. Official Examples

### Example 1
- **Input**:
  ```text
  1
  2
  3
  5
  7
  9
  10
  -1
  ```
- **Output**:
  ```text
  1-3, 5, 7, 9-10
  ```

### Example 2
- **Input**:
  ```text
  1
  2
  3
  4
  5
  -1
  ```
- **Output**:
  ```text
  1-5
  ```

## 5. Key Takeaways & Techniques

### 5.1 Read until a sentinel, not to end of file

The input does not tell you how many numbers there are; `-1` is the **sentinel**
that ends it. Read tokens and break:

```python
import sys
nums = []
for token in sys.stdin.read().split():
    value = int(token)
    if value == -1:
        break
    nums.append(value)
```

Everything after `-1` (there is nothing, but be safe) is ignored.

### 5.2 Track a range with two variables: `start` and `prev`

Walk the list once. `start` is the first number of the range you are currently
building; `prev` is the last number you have added to it.

- If the next number is `prev + 1`, the range continues — just move `prev`.
- Otherwise the range is finished — emit it, then open a new range at the next
  number.

```python
parts = []
start = prev = nums[0]
for value in nums[1:]:
    if value == prev + 1:
        prev = value
        continue
    parts.append(str(start) if start == prev else f"{start}-{prev}")
    start = prev = value
parts.append(str(start) if start == prev else f"{start}-{prev}")  # last range
```

### 5.3 Do not forget the final range

The loop emits a range only when it sees a **gap**. The last range has no gap
after it, so you must emit it once more after the loop ends. Missing this line
is the most common bug — it drops the final piece of the output.

### 5.4 A singleton is a range where `start == prev`

`5` alone means `start` and `prev` are both 5. The ternary
`str(start) if start == prev else f"{start}-{prev}"` prints `5` in that case and
`9-10` otherwise — one expression handles both.

> [!IMPORTANT]
> For your `submission.md`: trace your `start` / `prev` values through Example 1
> by hand. Being able to say what each variable holds at every step is exactly
> what the Learning Log is checking.

## 6. Additional Test Cases

| Input (before `-1`) | Expected | What it tests |
| :--- | :--- | :--- |
| `1 2 3 5 7 9 10` | `1-3, 5, 7, 9-10` | Mixed ranges and singletons |
| `1 2 3 4 5` | `1-5` | One long range |
| `4` | `4` | A single number |
| `1 3 5 7` | `1, 3, 5, 7` | No consecutive pairs |
| `2 3 10 11 12` | `2-3, 10-12` | Two ranges, nothing between |

## 7. Pre-Submission Checklist
- [ ] Stop reading at `-1`
- [ ] Track the current range with `start` and `prev`
- [ ] Continue the range only when `value == prev + 1`
- [ ] Emit the final range after the loop
- [ ] A singleton prints as `a`, a range as `a-b`
- [ ] Join pieces with `", "` (comma **and** space)
- [ ] PEP-8 clean
