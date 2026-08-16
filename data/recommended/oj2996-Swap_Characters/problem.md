# OJ 2996: [Recommend] [LEARNING LOGS] สลับตัวอักษร

## 1. Problem Understanding
The program reads a string from input, reverses the character order, and converts all alphabetic characters into lowercase.

## 2. Input & Output Specification
- **Input**: 1 line of string `text`.
- **Output**: The reversed string in all lowercase characters.

## 3. Key Takeaway & Special Method
- **Sequence Slicing with Negative Step**:
  In Python, string slicing has the syntax `string[start:stop:step]`.
  When `step = -1` and start/stop are omitted (`text[::-1]`), Python traverses the string in reverse from the last element to the first in $O(N)$ time without requiring an explicit loop.
- **Case Conversion**:
  The `.lower()` method turns all uppercase characters into lowercase while preserving non-alphabetic characters (digits, spaces, punctuation).

## 4. Test Cases

### Case 1: Normal Mixed-Case Sentence
- **Why this case is useful**: Tests standard reversal with spaces and mixed uppercase/lowercase.
- **Input**:
  ```text
  Hello World
  ```
- **Expected Output**:
  ```text
  dlrow olleh
  ```

### Case 2: Numbers & Mixed Letters
- **Why this case is useful**: Checks that digits and non-alphabetic symbols remain unchanged while letters convert to lowercase.
- **Input**:
  ```text
  Python 3.10
  ```
- **Expected Output**:
  ```text
  01.3 nohtyp
  ```

### Case 3: Single Character / Already Lowercase
- **Why this case is useful**: Checks boundary condition with single character.
- **Input**:
  ```text
  A
  ```
- **Expected Output**:
  ```text
  a
  ```

## 5. Verification Checklist
- [x] Input read as `str`
- [x] Sliced using `[::-1]`
- [x] Applied `.lower()`
- [x] Tested in VS Code
