# OJ 3167: [Recommend] FizzBuzz

> - **iJudge cp_id**: 3167 — Python
> - **Time limit**: 1s | **Memory**: 32,000 KB
> - **Deadline**: 04 Sep 2026, 00:00

---

## 1. Original Problem Statement (iJudge)

Design a flowchart that reads one positive integer.

Then print the numbers from 1 up to that positive integer, with the following rules:

- If the number is divisible by 3, print `Fizz` instead
- If the number is divisible by 5, print `Buzz`
- If the number is divisible by both 3 and 5, print `FizzBuzz`

## 2. Input Specification

**1 line**

- A positive integer

## 3. Output Specification

**n lines**

- A number, `Fizz`, `Buzz`, or `FizzBuzz`

## 4. Official Examples

### Example 1
- **Input**:
  ```text
  15
  ```
- **Output**:
  ```text
  1
  2
  Fizz
  4
  Buzz
  Fizz
  7
  8
  Fizz
  Buzz
  11
  Fizz
  13
  14
  FizzBuzz
  ```

## 5. Key Takeaways & Techniques

### 5.1 The modulo operator (`%`)
The `%` operator gives the remainder of a division, so `i % 3 == 0` means "`i` is divisible by 3".

```python
15 % 3   # 0  -> divisible
14 % 3   # 2  -> not divisible
```

### 5.2 The trap: the order of your conditions
A number divisible by 15 (15, 30, 45, …) is **also** divisible by 3 **and** by 5.
So you must check the **most specific condition first**:

```python
if i % 15 == 0:        # ✅ check FizzBuzz first
    print("FizzBuzz")
elif i % 3 == 0:
    print("Fizz")
elif i % 5 == 0:
    print("Buzz")
else:
    print(i)
```

**What happens if you order it wrong:**

```python
if i % 3 == 0:         # ❌ wrong!
    print("Fizz")
elif i % 15 == 0:      # this branch can never run
    print("FizzBuzz")
```
The number `15` matches the first condition (`15 % 3 == 0` is true) and prints `Fizz`; the `elif` below never gets a chance.
The official example uses `n = 15` precisely to catch this.

### 5.3 `% 15` or `% 3 and % 5` — both fine
```python
if i % 15 == 0:                        # shorter
if i % 3 == 0 and i % 5 == 0:          # spells out where it comes from
```
Both are equally correct, since 15 is the LCM of 3 and 5. Pick the one you can explain.

### 5.4 Why `range(1, n + 1)`
Python's `range(a, b)` **excludes** `b`.
Writing `range(1, n)` gives only 1 through `n - 1` and drops the last value.
You need `range(1, n + 1)` to cover 1 through `n`.

### 5.5 `print(i)` needs no `str()`
`print()` converts values to text automatically — there is no need to write `print(str(i))`.

## 6. Additional Test Cases

| Input | Expected Output | What it tests |
| :--- | :--- | :--- |
| `15` | see the official example | **Catches wrong condition order** (line 15 must be `FizzBuzz`) |
| `5` | `1 / 2 / Fizz / 4 / Buzz` | Short range, checks Fizz and Buzz separately |
| `1` | `1` | Smallest boundary case |
| `3` | `1 / 2 / Fizz` | The first Fizz |
| `30` | lines 15 and 30 = `FizzBuzz` | Multiple common multiples |

## 7. Pre-Submission Checklist
- [ ] The loop bound is `range(1, n + 1)`
- [ ] Check the common multiple (`% 15 == 0`) **before** the single multiples
- [ ] Spelling and capitalization exact: `Fizz`, `Buzz`, `FizzBuzz`
- [ ] Test with `n = 15` and confirm the last line is `FizzBuzz`
- [ ] PEP-8 clean
