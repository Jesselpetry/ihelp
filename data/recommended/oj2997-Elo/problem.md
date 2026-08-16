# OJ 2997: [Recommend] Elo

## 1. Problem Understanding
Calculate the expected score ($E$) of a player in a chess/game match using the standard Elo rating formula:

$$
E_A = \frac{1}{1 + 10^{(R_B - R_A)/400}}
$$

$$
E_B = \frac{1}{1 + 10^{(R_A - R_B)/400}}
$$

## 2. Input & Output Specification
- **Input**:
  - Line 1: `R_A` (integer rating of player A)
  - Line 2: `R_B` (integer rating of player B)
  - Line 3: `player` (string: `"A"` or `"B"`)
- **Output**: The expected win probability for the specified player formatted to exactly **2 decimal places**.

## 3. Key Takeaway & Special Method
- **Exponentiation Precedence**:
  In Python, exponentiation is written with `**`.
  To ensure the fraction exponent calculates properly, wrap it in parentheses: `10 ** ((B - A) / 400)`.
- **F-string Precision Formatting**:
  Format floating-point outputs to 2 decimal places using `f"{value:.2f}"`.

## 4. Test Cases

### Case 1: Equal Rating (50-50 chance)
- **Why this case is useful**: When both players have identical rating, expected probability must be 0.50.
- **Input**:
  ```text
  1500
  1500
  A
  ```
- **Expected Output**:
  ```text
  0.50
  ```

### Case 2: Player A Higher Rating
- **Why this case is useful**: Tests correct positive/negative sign in exponent.
- **Input**:
  ```text
  1600
  1400
  A
  ```
- **Expected Output**:
  ```text
  0.76
  ```

### Case 3: Player B Requested
- **Why this case is useful**: Tests the `else` branch for player B when player A is stronger.
- **Input**:
  ```text
  1600
  1400
  B
  ```
- **Expected Output**:
  ```text
  0.24
  ```

## 5. Verification Checklist
- [x] Converted ratings to `int`
- [x] Handled both player `"A"` and `"B"` selections
- [x] Used `f"{result:.2f}"`
- [x] Verified formula parentheses
