# OJ 3167: [Recommend] FizzBuzz

## 1. Problem Understanding
Print the integers from $1$ up to $N$ on separate lines, with the following substitution rules:
- If a number is divisible by both 3 and 5 (i.e. divisible by 15), print `FizzBuzz`.
- Else if divisible by 3, print `Fizz`.
- Else if divisible by 5, print `Buzz`.
- Otherwise, print the number itself.

## 2. Input & Output Specification
- **Input**: 1 integer $N$ ($N \ge 1$).
- **Output**: $N$ lines, each containing the appropriate string or number.

## 3. Key Takeaway & Special Method
- **Conditional Precedence & Modulo Operator (`%`)**:
  The `%` operator finds the remainder of integer division: `i % 3 == 0` means `i` is a multiple of 3.
- **Rule of Strict-to-General Ordering**:
  Because numbers divisible by 15 are also divisible by 3 and 5, you **must** check `i % 15 == 0` (or `i % 3 == 0 and i % 5 == 0`) before checking `% 3` or `% 5`. If `% 3` is checked first, `15` would print `Fizz` instead of `FizzBuzz`.

```python
for i in range(1, n + 1):
    if i % 15 == 0:
        print("FizzBuzz")
    elif i % 3 == 0:
        print("Fizz")
    elif i % 5 == 0:
        print("Buzz")
    else:
        print(i)
```

## 4. Test Cases

### Case 1: Small Range ($N = 5$)
- **Why this case is useful**: Checks single multiples of 3 (`Fizz`) and 5 (`Buzz`).
- **Input**:
  ```text
  5
  ```
- **Expected Output**:
  ```text
  1
  2
  Fizz
  4
  Buzz
  ```

### Case 2: Range Reaching Common Multiple ($N = 16$)
- **Why this case is useful**: Checks that 15 outputs `FizzBuzz` correctly.
- **Input**:
  ```text
  16
  ```
- **Expected Output**:
  ```text
  1
  2
  Fizz
  4
  Buzz
  Fizz
  7
  8
  Fizz
  Buzz
  11
  Fizz
  13
  14
  FizzBuzz
  16
  ```

## 5. Verification Checklist
- [ ] Loop bounds from `1` to `n + 1`
- [ ] Checked common multiple (`% 15 == 0`) before individual multiples
- [ ] Exact casing: `"Fizz"`, `"Buzz"`, `"FizzBuzz"`
