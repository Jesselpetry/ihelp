# OJ 3226: [Recommend] Inflation

## 1. Problem Understanding
Calculate the value of an amount after $K$ years with an inflation/interest rate applied every year.
In standard compounding inflation in PSCP:
- Each year, the amount increases by the inflation rate (3.8% or multiplier $1.038$ / $1038/1000$).
- The new amount compounds each year for $K$ years.

## 2. Input & Output Specification
- **Input**:
  - Line 1: `amount` (float or int)
  - Line 2: `k` (integer number of years)
- **Output**: The compounded amount formatted (or truncated to integer/float based on problem requirement).

## 3. Key Takeaway & Special Method
- **Discrete Compounding Loop**:
  Instead of a single continuous formula, apply the compounding step inside a `for` loop so each intermediate year's state is computed sequentially:
  ```python
  amount = float(input())
  k = int(input())
  for _ in range(k):
      amount = int(amount * 1038) / 1000  # or int(amount * 103.8) / 100
  print(int(amount)) # or f"{amount:.2f}" depending on format
  ```
- **Precision and Truncation**:
  Pay close attention to whether the problem asks to floor/truncate decimals year by year or keep full precision until output.

## 4. Test Cases

### Case 1: 1 Year Compounding
- **Why this case is useful**: Verifies single period inflation calculation.
- **Input**:
  ```text
  1000.0
  1
  ```
- **Expected Output**:
  ```text
  1038
  ```

### Case 2: 0 Years (No Inflation)
- **Why this case is useful**: When $K = 0$, the amount remains unchanged.
- **Input**:
  ```text
  500.0
  0
  ```
- **Expected Output**:
  ```text
  500
  ```

### Case 3: Multiple Years Compounding
- **Why this case is useful**: Tests that inflation compounds on top of previous years.
- **Input**:
  ```text
  1000.0
  2
  ```
- **Expected Output**:
  ```text
  1077
  ```

## 5. Verification Checklist
- [ ] Read amount and years $K$ correctly
- [ ] Applied iterative compounding loop
- [ ] Checked precision/format with sample test cases in VS Code
