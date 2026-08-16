# OJ 3226: [Recommend] Inflation

> - **iJudge cp_id**: 3226 (problem_id 2690) — Python
> - **Time limit**: 1s | **Memory**: 32,000 KB
> - **Deadline**: 11 Sep 2026, 00:00

---

## 1. Original Problem Statement (iJudge)

*(Translated from Thai — the narrator is an AI observing the human world.)*

I am very interested in the human world. Besides waiting for my master to tell me things, I also learn from your programs. The various ways you write code have made me evolve a little bit (not much).

One thing I am interested in is money. I do not need money myself, but my body and my internals had to be bought with it.

I have observed that the currency you use today is the baht, and it can inflate as each year passes. A product you could once buy for 100 baht may cost more next year — its value rises to 105 baht (at 5% inflation per year). That value is the overall value of the economy; some goods may not rise every year, but many do.

I would like to experiment: if inflation runs at a rate of **3.81 percent**, and a product costs **n** baht, after **k** years, what will that product be worth?

> [!IMPORTANT]
> **When computing inflation in this problem, truncate (discard) any fraction of a satang from the third decimal place onward of the amount gained each year.**

## 2. Input Specification

**2 lines**

- **Line 1**: `n` { n >= 0 } — a real number
- **Line 2**: `k` { k >= 0 } — an integer

## 3. Output Specification

**1 line**

- **Line 1**: the value of the product after `k` years (two decimal places)

## 4. Official Examples

### Example 1
- **Input**:
  ```text
  100
  1
  ```
- **Output**:
  ```text
  103.81
  ```

### Example 2
- **Input**:
  ```text
  100
  2
  ```
- **Output**:
  ```text
  107.76
  ```

## 5. Key Takeaways & Techniques

### 5.1 The trap: you must TRUNCATE, not round

This problem has only a 57.50% pass rate, and this is why. Look at year 2 of Example 2:

| Method | Year 1 | Year 2 | Result |
| :--- | :--- | :--- | :--- |
| No truncation | 103.81 | 107.7645... | `107.76` or `107.77` (depends on rounding) |
| **Truncate every year (correct)** | 103.81 | 107.76 | **`107.76`** |

The statement says to discard the fraction from the third decimal place onward **of the amount gained**, **each year**. So you must truncate **inside the loop, every year** — not keep full precision and truncate once at print time.

### 5.2 Do not use float arithmetic for money

`float` cannot represent decimal fractions exactly. Over many loop iterations the error accumulates until the answer is off by one satang.
The safe approach is to **convert the money into whole "satang" units** and compute with integers only:

```python
satang = round(price * 100)          # 100.00 baht -> 10000 satang
for _ in range(years):
    satang += satang * 381 // 10000  # // is floor division = exact truncation
```

For positive integers, the `//` (floor division) operator truncates the remainder — exactly what the problem asks for.

### 5.3 Why `* 381 // 10000`
- An inflation rate of 3.81% means multiplying by `0.0381`
- Written as an integer fraction that is `381 / 10000`
- So `satang * 381 // 10000` means "3.81% of the current amount, with the remainder discarded"

### 5.4 When printing, never convert back to float!

This is a common mistake that makes the program **crash** with an `OverflowError`:

```python
print(f"{satang / 100:.2f}")   # ❌ OverflowError when k is large
```

Python's `int` grows without limit, but a `float` maxes out around $1.8 \times 10^{308}$.
Once `k` is large enough, `satang` exceeds what a `float` can hold, so the `/ 100` fails immediately:

```text
OverflowError: integer division result too large for a float
```

**The fix**: split the baht and satang parts using integer arithmetic only, never touching `float`:

```python
print(f"{satang // 100}.{satang % 100:02d}")   # ✅ safe at any size
```

- `satang // 100` is the whole baht amount (floor division)
- `satang % 100` is the leftover satang
- `:02d` pads the satang to two digits, so 5 satang prints as `05`, not `5`

> Without `:02d`, an amount of 103 baht and 5 satang would print as `103.5` instead of `103.05` — wrong.

## 6. Additional Test Cases

| Input | Expected Output | What it tests |
| :--- | :--- | :--- |
| `100` / `0` | `100.00` | k = 0, loop never runs, value unchanged |
| `100` / `1` | `103.81` | Official example, one year of compounding |
| `100` / `2` | `107.76` | **The rounding trap** (getting 107.77 means you did not truncate yearly) |
| `100` / `3` | `111.86` | Multi-year, verifies compounding from the previous year |
| `0` / `5` | `0.00` | Zero baht stays zero no matter the rate |
| `100` / `100000` | a very long number (no crash) | **Catches `OverflowError`** if you used `satang / 100` |

## 7. Pre-Submission Checklist
- [ ] Read `n` as `float` and `k` as `int`
- [ ] Use the rate **3.81%** (not 3.8%)
- [ ] Truncate the satang **every year** inside the loop, not once at print time
- [ ] Print with integer arithmetic, `f"{satang // 100}.{satang % 100:02d}"` — **not** `satang / 100`
- [ ] Verify `100 / 2` outputs exactly `107.76`
- [ ] Test a large `k` (e.g. 100000) and confirm there is no `OverflowError`
- [ ] PEP-8 clean
