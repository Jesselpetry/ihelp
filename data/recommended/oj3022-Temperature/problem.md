# OJ 3022: [recommend] [LEARNING LOGS] Temperature

> - **iJudge cp_id**: 3022 — Python
> - **Time limit**: 1s | **Memory**: 32,000 KB

---

## 1. Original Problem Statement (iJudge)

The formulas for converting a temperature into Fahrenheit (F), Kelvin (K), and Rankine (R) from Celsius (C) are given in the table below.

![Temperature conversion formula table](https://ijudge.it.kmitl.ac.th:7159/api/file/file/1751611041998_e2f0a4.png)

Write a program that converts a temperature from one unit into another, as specified.

## 2. Input Specification

**3 lines**

- **Line 1**: a real number, the temperature value
- **Line 2**: a letter `C`, `F`, `K`, or `R`, meaning Celsius, Fahrenheit, Kelvin, and Rankine respectively — the unit of the value on line 1
- **Line 3**: a letter `C`, `F`, `K`, or `R` — the desired output unit

## 3. Output Specification

**1 line**, a real number: the temperature in the unit given on line 3 of the input spec — **answer with two decimal places**.

## 4. Official Examples

### Example 1
- **Input**:
  ```text
  37.6
  C
  K
  ```
- **Output**:
  ```text
  310.75
  ```

### Example 2
- **Input**:
  ```text
  100
  R
  C
  ```
- **Output**:
  ```text
  -217.59
  ```

### Example 3
- **Input**:
  ```text
  212.0
  F
  K
  ```
- **Output**:
  ```text
  373.15
  ```

## 5. Key Takeaways & Techniques

### 5.1 The hub-and-spoke conversion technique
With 4 units, writing every pair separately gives $4 \times 3 = 12$ cases — a lot of code and easy to get wrong.
Instead, use **Celsius as the hub** and convert in two steps:

```
source unit  ──►  Celsius  ──►  target unit
```

That is only 6 formulas (not counting C, which needs no conversion) instead of 12.

**Step 1 — into Celsius:**

| Source unit | Formula |
| :--- | :--- |
| `C` | `celsius = temp` |
| `F` | `celsius = (temp - 32) * 5 / 9` |
| `K` | `celsius = temp - 273.15` |
| `R` | `celsius = (temp - 491.67) * 5 / 9` |

**Step 2 — out of Celsius:**

| Target unit | Formula |
| :--- | :--- |
| `C` | `result = celsius` |
| `F` | `result = celsius * 9 / 5 + 32` |
| `K` | `result = celsius + 273.15` |
| `R` | `result = (celsius + 273.15) * 9 / 5` |

### 5.2 Verify against Example 2 (`100 R` → `C`)
- Into Celsius: `(100 - 491.67) * 5 / 9` = `-391.67 * 5 / 9` = `-217.594...`
- The target is already C, so no second conversion
- Printing with `:.2f` gives **`-217.59`** ✅

### 5.3 Split into helper functions for readability
Writing the two steps as two functions keeps the code short and lets you explain it piece by piece:

```python
def to_celsius(value, unit):
    """Convert from `unit` into Celsius."""
    if unit == "F":
        return (value - 32) * 5 / 9
    if unit == "K":
        return value - 273.15
    if unit == "R":
        return (value - 491.67) * 5 / 9
    return value          # unit == "C"
```

Then compose them in a single line:

```python
result = from_celsius(to_celsius(temperature, source_unit), target_unit)
```

### 5.4 Why plain `if` instead of `if / elif`
Once a block contains `return`, the function exits immediately and never reaches the following checks anyway.
So `elif` is unnecessary — and the final `return value` acts as the `else`.

> **The important benefit**: this guarantees the function **always returns a value**. A chain of `if/elif` with no `else` leaves the variable unassigned if the input matches nothing, causing an error.

### 5.5 Do not forget `:.2f`
The problem explicitly requires two decimal places, so use `print(f"{result:.2f}")`.
A bare `print(result)` would output `310.75000000000006`, which fails immediately.

## 6. Additional Test Cases

| Input (value/from/to) | Expected Output | What it tests |
| :--- | :--- | :--- |
| `37.6 / C / K` | `310.75` | Official example |
| `100 / R / C` | `-217.59` | Official example, negative result |
| `212.0 / F / K` | `373.15` | Official example, a real two-step conversion |
| `0 / C / F` | `32.00` | A well-known reference value |
| `300.15 / K / K` | `300.15` | **Same unit in and out — the value must not drift** |

## 7. Pre-Submission Checklist
- [x] Read line 1 as `float`
- [x] Read the units as `str` (no `str()` wrapper needed — `input()` already returns `str`)
- [x] All 4 units have correct formulas
- [x] Convert through Celsius as the hub
- [x] Format output with `f"{result:.2f}"`
- [x] Test a same-unit conversion (e.g. K → K)
- [x] PEP-8 clean
