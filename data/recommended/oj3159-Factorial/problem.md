# OJ 3159: [Recommend] Factorial

> - **iJudge cp_id**: 3159 (problem_id 6110) — Python
> - **Time limit**: 1s | **Memory**: 32,000 KB
> - **Deadline**: 04 Sep 2026, 00:00
> - **Author's note**: practice `for` loops with a product accumulator to compute n! — sum vs product accumulator

---

## 1. Original Problem Statement (iJudge)

Write a program that reads one positive integer, computes the factorial of that number, and prints the result to the screen.

(The factorial is the product of the numbers from 1 to n, e.g. 5! = 5 * 4 * 3 * 2 * 1 = 120)

## 2. Input Specification

A positive integer whose factorial is to be computed.

## 3. Output Specification

The factorial of that number, as an integer.

## 4. Official Examples

### Example 1
- **Input**:
  ```text
  5
  ```
- **Output**:
  ```text
  120
  ```

### Example 2
- **Input**:
  ```text
  12
  ```
- **Output**:
  ```text
  479001600
  ```

## 5. Key Takeaways & Techniques

### 5.1 The accumulator pattern — sum vs product
This is the heart of the problem, per the author's note. **The initial value differs**:

| Kind | Initial value | Reason |
| :--- | :---: | :--- |
| **Sum** accumulator | `0` | 0 is the additive identity — adding 0 changes nothing |
| **Product** accumulator | `1` | 1 is the multiplicative identity — multiplying by 1 changes nothing |

> Starting a product accumulator at `0` makes the result `0` forever, because anything times 0 is 0.

```python
result = 1
for i in range(2, n + 1):
    result *= i
```

### 5.2 Why start the loop at 2 instead of 1
`result` already starts at `1`, so multiplying by `1` on the first pass changes nothing.
Starting at `2` saves one iteration and states the intent more clearly.

Writing `range(1, n + 1)` gives an identical result and is not wrong — it just runs one extra iteration.

### 5.3 Why `n = 0` and `n = 1` are correct automatically
- `n = 0` → `range(2, 1)` is empty, the loop never runs → `result` stays `1` ✅ (matching $0! = 1$)
- `n = 1` → `range(2, 2)` is also empty → `result` stays `1` ✅

**No `if` special-case is needed at all** — choosing the right initial value handles both. That is the elegance of the accumulator pattern.

### 5.4 Python integers are unbounded
`12!` = 479,001,600, which already exceeds the range of a 32-bit `int` in C/Java.
Python's `int` grows automatically to fit the value, so overflow is never a concern — even for `100!`.

### 5.5 The standard-library alternative
```python
import math
print(math.factorial(n))
```
This works and is faster, but **this problem is meant to practice writing the loop yourself**, per the author's note. Write the loop to understand the mechanism.

## 6. Additional Test Cases

| Input | Expected Output | What it tests |
| :--- | :--- | :--- |
| `5` | `120` | Official example, standard case |
| `12` | `479001600` | Official example, large value |
| `0` | `1` | **Boundary case**, the definition $0! = 1$ |
| `1` | `1` | Base case, the loop barely runs |
| `20` | `2432902008176640000` | Very large value, verifies Python handles it |

## 7. Pre-Submission Checklist
- [ ] Read `n` as `int`
- [ ] Initialize the accumulator to `1` (not `0`)
- [ ] The loop bound ends at `n + 1` (not `n`)
- [ ] Test `n = 0`, which must output `1`
- [ ] Verified in VS Code
- [ ] PEP-8 clean
