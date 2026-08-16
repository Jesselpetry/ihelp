# OJ 3020: [recommend] Coke

> - **iJudge cp_id**: 3020 — Python
> - **Time limit**: 1s | **Memory**: 32,000 KB

---

## 1. Original Problem Statement (iJudge)

Coke is running a new promotion. The normal price is `a baht` per bottle. If you bring in `b caps`, you can buy a new bottle at the special price of `c baht` (down from `a` baht per bottle, where c <= a). If you want `d bottles` of Coke, what is the least amount of money you must pay?

## 2. Input Specification

**4 lines**

- **Line 1**: `a`, a non-negative integer (a >= 0)
- **Line 2**: `b`, a non-negative integer (b >= 0); **b = 0 means caps cannot be redeemed for a discount, so every bottle must be bought at price a**
- **Line 3**: `c`, a non-negative integer (c >= 0, c <= a)
- **Line 4**: `d`, a non-negative integer (d >= 0)

## 3. Output Specification

**1 line**

- **Line 1**: the minimum amount of money to pay (a non-negative integer)

## 4. Official Examples

### Example 1
- **Input**:
  ```text
  10
  3
  7
  50
  ```
- **Output**:
  ```text
  452
  ```

### Example 2
- **Input**:
  ```text
  1
  10
  0
  50
  ```
- **Output**:
  ```text
  46
  ```

## 5. Key Takeaways & Techniques

### 5.1 Understand the mechanic first: buying 1 bottle yields 1 cap
Every bottle you buy — at the normal price or the promo price — gives you one cap.
So buying `d` bottles total yields `d` caps, but the very last cap arrives too late to redeem.

### 5.2 An $O(1)$ formula instead of a loop
Rather than simulating purchases one at a time with a `while` loop (slow and easy to get wrong), compute it directly:

```python
promo_bottles = max(d - 1, 0) // b     # bottles bought at the promo price
normal_bottles = d - promo_bottles     # the rest at the normal price
total = promo_bottles * c + normal_bottles * a
```

**Why `d - 1`?**
The first bottle must be bought at full price because you have no caps yet, so only `d - 1` caps can actually be redeemed.

### 5.3 Verify against Example 1 (`a=10, b=3, c=7, d=50`)
- `promo_bottles = (50 - 1) // 3 = 49 // 3 = 16`
- `normal_bottles = 50 - 16 = 34`
- Total = `16 × 7 + 34 × 10` = `112 + 340` = **`452`** ✅

### 5.4 Verify against Example 2 (`a=1, b=10, c=0, d=50`)
- `promo_bottles = (50 - 1) // 10 = 49 // 10 = 4`
- `normal_bottles = 50 - 4 = 46`
- Total = `4 × 0 + 46 × 1` = **`46`** ✅

### 5.5 Edge cases you must guard
| Case | Why it is dangerous | How to handle it |
| :--- | :--- | :--- |
| `b = 0` | `// 0` raises `ZeroDivisionError` and crashes the program | Guard with `if` and set `promo_bottles = 0` |
| `d = 0` | Nothing is bought so the answer must be `0`, and `(0-1)//b` goes negative | Use `max(d - 1, 0)` |

`max(d - 1, 0)` removes the need for a separate `if d == 0: return` line — one expression covers it.

### 5.6 `//` is floor division
`49 // 3` is `16` (not 16.33) because the remainder is discarded — which matches reality: leftover caps below `b` cannot be redeemed.
Using plain `/` yields a `float`, and multiplying that produces a decimal answer, violating the output spec immediately.

## 6. Additional Test Cases

| Input (a/b/c/d) | Expected Output | What it tests |
| :--- | :--- | :--- |
| `10 / 3 / 7 / 50` | `452` | Official example |
| `1 / 10 / 0 / 50` | `46` | Official example, promo price is 0 |
| `10 / 3 / 7 / 0` | `0` | **d = 0, must charge nothing** |
| `20 / 0 / 0 / 5` | `100` | **b = 0, guards ZeroDivisionError** |
| `10 / 3 / 7 / 1` | `10` | A single bottle, no cap can be redeemed |

## 7. Pre-Submission Checklist
- [x] Guard `b = 0` against division by zero
- [x] Guard `d = 0` (or use `max(d - 1, 0)`)
- [x] Use floor division `//`, not `/`
- [x] Compute from `d - 1`, not `d`
- [x] Output is an integer with no decimal point
- [x] PEP-8 clean
