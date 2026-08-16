# OJ 3019: [recommend] Safe Password

> - **iJudge cp_id**: 3019 — Python
> - **Time limit**: 1s | **Memory**: 32,000 KB
> - **Author's note**: practice conditionals

---

## 1. Original Problem Statement (iJudge)

A bank manager has set the safe password to **H 4567**.

Your task is to write a program that reads one character and one number from the keyboard and checks the password. The program must print the following:

- If the password is correct, print `safe unlocked`
- If only the letter H is correct, print `safe locked - change digit`
- If only the numeric value is correct, print `safe locked - change char`
- If the entered password is wrong (neither the letter nor the number matches), print `safe locked`

## 2. Input Specification

**2 lines**

- **Line 1**: a character
- **Line 2**: an integer

## 3. Output Specification

**Line 1**: one of `safe unlocked`, `safe locked - change digit`, `safe locked - change char`, or `safe locked`

## 4. Official Examples

### Example 1
- **Input**:
  ```text
  h
  4567
  ```
- **Output**:
  ```text
  safe locked - change char
  ```

### Example 2
- **Input**:
  ```text
  H
  56579
  ```
- **Output**:
  ```text
  safe locked - change digit
  ```

### Example 3
- **Input**:
  ```text
  h
  5678
  ```
- **Output**:
  ```text
  safe locked
  ```

## 5. Key Takeaways & Techniques

### 5.1 The trap: comparison is case-sensitive!
Look closely at Example 1 — the input is a lowercase `h`, but the correct password is an uppercase `H`.
The result is therefore `safe locked - change char`, not `safe unlocked`.

> **Never use `.lower()` or `.upper()` to help the comparison here** — the problem requires `h` to count as **wrong**.
> Compare directly with `==` against `"H"`.

### 5.2 Comparing the number as a string is easier than as an int
Although the statement says "an integer", comparing it as **text** is safer:

```python
digit = input()              # no int() needed
digit_ok = digit == "4567"
```

Converting to `int` and comparing against `4567` also works, but breaks immediately if the input has leading zeros or unexpected whitespace.

### 5.3 Store comparison results in boolean variables
Instead of repeating long conditions, compute them once — it reads far better:

```python
char_ok = char == "H"
digit_ok = digit == "4567"
```

### 5.4 Condition order — let `elif` do the work
Check the **most specific case first** (both correct), then work down.
Once you reach an `elif`, the conditions above are already known to be false, so there is no need to repeat `and not ...`:

```python
if char_ok and digit_ok:
    print("safe unlocked")
elif char_ok:                 # reaching here means digit is definitely wrong
    print("safe locked - change digit")
elif digit_ok:                # reaching here means char is definitely wrong
    print("safe locked - change char")
else:                         # both wrong
    print("safe locked")
```

This is shorter and clearer than `elif char_ok and not digit_ok:`, which re-checks something already known.

### 5.5 Use named constants
Per PEP-8, constants are written in **ALL_CAPS** and placed at module level, outside the function:

```python
CORRECT_CHAR = "H"
CORRECT_DIGIT = "4567"
```

## 6. Additional Test Cases

| Input (2 lines) | Expected Output | What it tests |
| :--- | :--- | :--- |
| `H` / `4567` | `safe unlocked` | Both correct |
| `h` / `4567` | `safe locked - change char` | **The case-sensitivity trap** |
| `H` / `56579` | `safe locked - change digit` | Letter right, number wrong |
| `h` / `5678` | `safe locked` | Both wrong |
| `A` / `4567` | `safe locked - change char` | A letter other than h/H |

## 7. Pre-Submission Checklist
- [x] Compare the character against `"H"` exactly — **do not** use `.lower()` / `.upper()`
- [x] Handle all 4 distinct cases
- [x] Spell all 4 output strings exactly (including the spaces around `-`)
- [x] Verify `h` / `4567` gives `safe locked - change char`
- [x] PEP-8 clean
