# OJ 3022: [recommend] [LEARNING LOGS] Temperature

## 1. Problem Understanding
Convert a temperature reading from any unit (`'C'`, `'F'`, `'K'`, `'R'`) into any other target unit (`'C'`, `'F'`, `'K'`, `'R'`).

## 2. Input & Output Specification
- **Input**:
  - Line 1: `temp` (float temperature value)
  - Line 2: `temp_m` (original unit string: `C`, `F`, `K`, `R`)
  - Line 3: `convert_to` (target unit string: `C`, `F`, `K`, `R`)
- **Output**: The converted temperature formatted to **2 decimal places** (`:.2f`).

## 3. Key Takeaway & Special Method
- **Hub-and-Spoke Normalization Pattern**:
  Instead of writing $4 \times 3 = 12$ independent conversion branches:
  1. Convert incoming unit $\to$ **Celsius**:
     - `C`: `celsius = temp`
     - `F`: `celsius = (temp - 32) * 5/9`
     - `K`: `celsius = temp - 273.15`
     - `R`: `celsius = (temp - 491.67) * 5/9`
  2. Convert **Celsius** $\to$ target unit:
     - `C`: `result = celsius`
     - `F`: `result = (celsius * 9/5) + 32`
     - `K`: `result = celsius + 273.15`
     - `R`: `result = (celsius + 273.15) * 9/5`

## 4. Test Cases

### Case 1: Celsius to Fahrenheit (Freezing point)
- **Why this case is useful**: $0^\circ\text{C} = 32^\circ\text{F}$.
- **Input**:
  ```text
  0.0
  C
  F
  ```
- **Expected Output**:
  ```text
  32.00
  ```

### Case 2: Fahrenheit to Celsius (Boiling point)
- **Why this case is useful**: $212^\circ\text{F} = 100^\circ\text{C}$.
- **Input**:
  ```text
  212.0
  F
  C
  ```
- **Expected Output**:
  ```text
  100.00
  ```

### Case 3: Same Unit Conversion (Identity)
- **Why this case is useful**: Converting unit to itself must yield identical value.
- **Input**:
  ```text
  300.15
  K
  K
  ```
- **Expected Output**:
  ```text
  300.15
  ```

## 5. Verification Checklist
- [x] Input float read properly
- [x] Correct formulas used for all 4 units
- [x] Handled conversion through central Celsius hub
- [x] Output formatted with `f"{result:.2f}"`
