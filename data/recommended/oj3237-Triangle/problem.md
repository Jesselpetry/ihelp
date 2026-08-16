# OJ 3237: [Recommend] สามเหลี่ยม (Triangle)

## 1. Problem Understanding
Given an integer $N$, print a triangle pattern of height $N$ using asterisks (`*`) and spaces (` `).

## 2. Input & Output Specification
- **Input**: 1 integer $N$ ($N \ge 1$).
- **Output**: $N$ lines forming the triangle pattern.

## 3. Key Takeaway & Special Method
- **String Multiplication (`"*" * count`)**:
  In Python, multiplying a string by an integer repeats it that many times without needing a nested inner loop:
  - `" " * spaces` creates leading indentation.
  - `"*" * stars` creates the block of asterisks.

### Common Triangle Patterns in PSCP:
1. **Right-Aligned Triangle (Most common in PSCP)**:
   For row $i$ from $1$ to $N$:
   - Spaces: $N - i$
   - Stars: $i$
   ```python
   for i in range(1, n + 1):
       print(" " * (n - i) + "*" * i)
   ```
2. **Left-Aligned Triangle**:
   ```python
   for i in range(1, n + 1):
       print("*" * i)
   ```
3. **Pyramid Triangle**:
   ```python
   for i in range(1, n + 1):
       print(" " * (n - i) + "*" * (2 * i - 1))
   ```

## 4. Test Cases (Right-Aligned Pattern)

### Case 1: Height $N = 3$
- **Why this case is useful**: Small standard case.
- **Input**:
  ```text
  3
  ```
- **Expected Output**:
  ```text
    *
   **
  ***
  ```

### Case 2: Height $N = 1$
- **Why this case is useful**: Minimum boundary condition.
- **Input**:
  ```text
  1
  ```
- **Expected Output**:
  ```text
  *
  ```

### Case 3: Height $N = 5$
- **Why this case is useful**: Tests larger height and consistent column alignment.
- **Input**:
  ```text
  5
  ```
- **Expected Output**:
  ```text
      *
     **
    ***
   ****
  *****
  ```

## 5. Verification Checklist
- [ ] Read height $N$ as `int`
- [ ] Counted row index from $1$ to $N$
- [ ] Verified alignment and spacing per line
- [ ] Tested in VS Code
