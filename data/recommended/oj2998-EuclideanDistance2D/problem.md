# OJ 2998: [Recommend] EuclideanDistance2D

## 1. Problem Understanding
Calculate the Euclidean distance between two 2D points $Q(q_1, q_2)$ and $P(p_1, p_2)$ using the Pythagorean distance formula:
$$d = \sqrt{(q_1 - p_1)^2 + (q_2 - p_2)^2}$$

## 2. Input & Output Specification
- **Input**: 4 lines of floating-point numbers:
  - Line 1: $q_1$
  - Line 2: $q_2$
  - Line 3: $p_1$
  - Line 4: $p_2$
- **Output**: The distance printed as a floating-point number.

## 3. Key Takeaway & Special Method
- **`import math` and `math.sqrt()`**:
  Standard mathematical square root is available via `math.sqrt(x)`. Alternatively, `(x) ** 0.5` can be used.
- **Reading Multi-line Float Inputs**:
  Read each coordinate individually using `float(input())`.

## 4. Test Cases

### Case 1: Standard 3-4-5 Triangle
- **Why this case is useful**: Classic Pythagorean triple to verify correctness.
- **Input**:
  ```text
  0.0
  0.0
  3.0
  4.0
  ```
- **Expected Output**:
  ```text
  5.0
  ```

### Case 2: Identical Coordinates
- **Why this case is useful**: Distance between identical points must be 0.0.
- **Input**:
  ```text
  7.5
  -3.2
  7.5
  -3.2
  ```
- **Expected Output**:
  ```text
  0.0
  ```

### Case 3: Negative Coordinate Values
- **Why this case is useful**: Tests that squaring negative differences $(-\Delta x)^2$ produces positive squares.
- **Input**:
  ```text
  -1.0
  -1.0
  2.0
  3.0
  ```
- **Expected Output**:
  ```text
  5.0
  ```

## 5. Verification Checklist
- [x] Input read as `float`
- [x] Correct index pairings $(q_1 - p_1)$ and $(q_2 - p_2)$
- [x] Square root computed properly
