# OJ 2998: [Recommend] EuclideanDistance2D

> - **iJudge cp_id**: 2998 — Python
> - **Time limit**: 1s | **Memory**: 32,000 KB

---

## 1. Original Problem Statement (iJudge)

Write a program that reads 4 numbers from the user in the order *q1*, *q2*, *p1*, *p2*.

In a 2-dimensional plane, point **Q** is at (*q1*, *q2*) and point **P** is at (*p1*, *p2*).

Find the Euclidean distance between **Q** and **P**. The Euclidean distance between any **Q** and **P** in an *n*-dimensional plane is:

$$d(\mathbf{p}, \mathbf{q}) = d(\mathbf{q}, \mathbf{p}) = \sqrt{(q_1 - p_1)^2 + (q_2 - p_2)^2 + \cdots + (q_n - p_n)^2} = \sqrt{\sum_{i=1}^{n}(q_i - p_i)^2}$$

This problem is 2-dimensional, so it reduces to:

$$d = \sqrt{(q_1 - p_1)^2 + (q_2 - p_2)^2}$$

## 2. Input Specification

**4 lines**

- **Line 1**: `q1`
- **Line 2**: `q2`
- **Line 3**: `p1`
- **Line 4**: `p2`

All are **real numbers**.

## 3. Output Specification

**1 line**

- **Line 1**: the Euclidean distance between Q and P — **a real number**

## 4. Official Examples

### Example 1
- **Input**:
  ```text
  1
  1
  2
  2
  ```
- **Output**:
  ```text
  1.4142135623730951
  ```

### Example 2
- **Input**:
  ```text
  2.05
  -3
  1.69
  0
  ```
- **Output**:
  ```text
  3.0215227948834014
  ```

## 5. Key Takeaways & Techniques

### 5.1 The trap: this problem forbids rounding
Look carefully at the expected output — `1.4142135623730951` has 16 decimal digits.
That is the full `float` value in Python, so **never use `:.2f` or `round()`** here.

```python
print(distance)              # ✅ correct -> 1.4142135623730951
print(f"{distance:.2f}")     # ❌ wrong   -> 1.41
```

> This differs from Temperature / Elo, which require exactly 2 decimals — **always read the output spec for every problem**.

### 5.2 `print(distance)` is enough — skip the f-string
`print(f"{distance}")` produces exactly the same output as `print(distance)`, just with extra syntax that buys nothing. The direct form is easier to read.

### 5.3 Two ways to take a square root
```python
import math
distance = math.sqrt(x)      # option 1: explicitly a square root
distance = x ** 0.5          # option 2: no import needed
```
Both give the same value, but `math.sqrt()` states the intent more clearly.

### 5.4 Do not alias `import math`
```python
import math          # ✅ PEP-8 preferred
import math as m     # ⚠️ legal but discouraged — `m` carries no meaning
```
`math` is only 4 characters; abbreviating saves nothing and hurts readability.

### 5.5 Watch the input order
The problem gives **q1, q2, p1, p2** — not q1, p1, q2, p2.
Pairing them wrongly produces a wrong distance. The pairs that must be subtracted are `(q1 - p1)` and `(q2 - p2)`.

### 5.6 Why negative differences are not a problem
`(q1 - p1)` may be negative, but squaring always yields a non-negative value — e.g. `(-3) ** 2 = 9`. The distance is therefore always positive, as it should be.

> **Careful with operator precedence**: `-3 ** 2` evaluates to `-9` (exponentiation binds tighter than the unary minus), while `(-3) ** 2` is `9`. Our code writes `(q1 - p1) ** 2`, which is already parenthesized and therefore safe.

## 6. Additional Test Cases

| Input (q1/q2/p1/p2) | Expected Output | What it tests |
| :--- | :--- | :--- |
| `1 / 1 / 2 / 2` | `1.4142135623730951` | Official example ($\sqrt{2}$) |
| `2.05 / -3 / 1.69 / 0` | `3.0215227948834014` | Official example with negative values |
| `0 / 0 / 3 / 4` | `5.0` | The classic 3-4-5 triangle, checkable by hand |
| `7.5 / -3.2 / 7.5 / -3.2` | `0.0` | Identical points, distance must be 0 |

## 7. Pre-Submission Checklist
- [x] Read all 4 inputs as `float`
- [x] Pair the variables correctly: `(q1 - p1)` and `(q2 - p2)`
- [x] **Do not round** — print the full value with `print(distance)`
- [x] Put `import math` at the top of the file (below the docstring)
- [x] PEP-8 clean
