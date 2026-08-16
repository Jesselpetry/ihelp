# OJ 3020: [recommend] Coke

## 1. Problem Understanding
You want to buy a total of $D$ bottles of Coke with a promotional exchange:
- $A$: Normal price per bottle
- $B$: Number of bottle caps required for 1 promotional exchange
- $C$: Discounted promotional price per bottle when exchanging $B$ caps
- $D$: Total number of bottles you need

Find the minimum total money spent.

## 2. Input & Output Specification
- **Input**: 4 lines of integers: $A, B, C, D$.
- **Output**: Total minimum cost (integer).

## 3. Key Takeaway & Special Method
- **$O(1)$ Math Formulation vs $O(N)$ Loop Simulation**:
  Instead of simulating bottle purchases in a `while` loop (which can cause Time Limit Exceeded when $D$ is huge), compute the usable promotion count directly:
  - If $D == 0$: cost is `0`.
  - If $B == 0$: promo is not usable $\to$ promo count = `0`.
  - Otherwise: `promo_useable = (D - 1) // B`
  - Normal bottles bought at regular price $A$: `D - promo_useable`
  - Total Cost: `(promo_useable * C) + ((D - promo_useable) * A)`

## 4. Test Cases

### Case 1: Standard Promotion
- **Why this case is useful**: Normal case where promotion can be redeemed multiple times.
- **Input**:
  ```text
  10
  4
  5
  10
  ```
- **Calculation**:
  - `promo_useable = (10 - 1) // 4 = 2`
  - Promo cost: `2 * 5 = 10`
  - Regular bottles: `10 - 2 = 8` bottles $\times 10 = 80$
  - Total = `90`
- **Expected Output**:
  ```text
  90
  ```

### Case 2: Zero Bottles Needed ($D = 0$)
- **Why this case is useful**: Boundary edge case.
- **Input**:
  ```text
  15
  3
  5
  0
  ```
- **Expected Output**:
  ```text
  0
  ```

### Case 3: No Caps Required / Promo Disabled ($B = 0$)
- **Why this case is useful**: Prevents `ZeroDivisionError`.
- **Input**:
  ```text
  20
  0
  0
  5
  ```
- **Expected Output**:
  ```text
  100
  ```

## 5. Verification Checklist
- [x] Handled $D = 0$ guard clause
- [x] Handled $B = 0$ division-by-zero prevention
- [x] Used integer floor division `//`
