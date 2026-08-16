# OJ 3159: [Recommend] Factorial

## 1. Problem Understanding
Calculate the factorial of a non-negative integer $N$:
$$N! = 1 \times 2 \times 3 \times \dots \times N$$
where $0! = 1$ and $1! = 1$.

## 2. Input & Output Specification
- **Input**: 1 integer $N$ ($N \ge 0$).
- **Output**: The integer value of $N!$.

## 3. Key Takeaway & Special Method
- **Accumulator Pattern (Multiplication)**:
  When accumulating a sum, initialize the accumulator to $0$.
  When accumulating a product, initialize the accumulator to $1$:
  ```python
  ans = 1
  for i in range(1, n + 1):
      ans *= i
  ```
- **Standard Library Option**:
  `import math` provides `math.factorial(n)` which handles arbitrary large integers in Python automatically.
- **Boundary Handling**:
  When $N = 0$, `range(1, 1)` is empty, so the loop does not run and `ans = 1` is preserved ($0! = 1$).

## 4. Test Cases

### Case 1: Standard Positive Integer
- **Why this case is useful**: Standard case ($5! = 120$).
- **Input**:
  ```text
  5
  ```
- **Expected Output**:
  ```text
  120
  ```

### Case 2: Zero Input ($N = 0$)
- **Why this case is useful**: Tests mathematical definition $0! = 1$.
- **Input**:
  ```text
  0
  ```
- **Expected Output**:
  ```text
  1
  ```

### Case 3: Small Value ($N = 1$)
- **Why this case is useful**: Base case $1! = 1$.
- **Input**:
  ```text
  1
  ```
- **Expected Output**:
  ```text
  1
  ```

### Case 4: Larger Value ($N = 10$)
- **Why this case is useful**: Checks that loop accumulates all factors correctly ($10! = 3628800$).
- **Input**:
  ```text
  10
  ```
- **Expected Output**:
  ```text
  3628800
  ```

## 5. Verification Checklist
- [ ] Read $N$ as `int`
- [ ] Initialized accumulator to `1`
- [ ] Tested $N = 0$ case
- [ ] Verified in VS Code
