# OJ 3019: [recommend] Safe Password

## 1. Problem Understanding
The safe requires a specific character (`'H'`) and a specific 4-digit code (`'4567'`).
Based on the input:
- If both char and digit are correct $\to$ output `safe unlocked`
- If char is correct but digit is wrong $\to$ output `safe locked - change digit`
- If char is wrong but digit is correct $\to$ output `safe locked - change char`
- If both are wrong $\to$ output `safe locked`

## 2. Input & Output Specification
- **Input**:
  - Line 1: Character (str)
  - Line 2: PIN / Digit sequence (str)
- **Output**: The exact status string (case-sensitive, exact spacing).

## 3. Key Takeaway & Special Method
- **Decision Hierarchy & Boolean Logic**:
  When multiple conditions can partially match, test the **most specific success condition first**, then specific partial failures with `elif`, and finally the general fallback with `else`.
  ```python
  if char_match and digit_match:
      ...
  elif char_match and not digit_match:
      ...
  elif not char_match and digit_match:
      ...
  else:
      ...
  ```

## 4. Test Cases

### Case 1: Perfect Match (Unlocked)
- **Why this case is useful**: Both credentials match.
- **Input**:
  ```text
  H
  4567
  ```
- **Expected Output**:
  ```text
  safe unlocked
  ```

### Case 2: Wrong PIN only
- **Why this case is useful**: Tests partial match branch (`change digit`).
- **Input**:
  ```text
  H
  1234
  ```
- **Expected Output**:
  ```text
  safe locked - change digit
  ```

### Case 3: Wrong Char only
- **Why this case is useful**: Tests partial match branch (`change char`).
- **Input**:
  ```text
  A
  4567
  ```
- **Expected Output**:
  ```text
  safe locked - change char
  ```

### Case 4: Both Wrong
- **Why this case is useful**: Tests fallback branch (`safe locked`).
- **Input**:
  ```text
  X
  9999
  ```
- **Expected Output**:
  ```text
  safe locked
  ```

## 5. Verification Checklist
- [x] Compared string values without stripping required formatting
- [x] Handled all 4 mutually exclusive states
- [x] Exact spelling of all 4 output messages
