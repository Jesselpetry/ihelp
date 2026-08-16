# OJ 2996: [Recommend] [LEARNING LOGS] Swap Characters

> - **iJudge cp_id**: 2996 — Python
> - **Time limit**: 1s | **Memory**: 32,000 KB
> - **Author's note**: practice accessing characters by index and building a new string by swapping positions

---

## 1. Original Problem Statement (iJudge)

Write a program that reads a text of **5 characters**, where the last character becomes the first character of the rearranged text, and each following character is taken from back to front in order. The printed result should be converted to lowercase.

## 2. Input Specification

A string of **5 English letters**.

## 3. Output Specification

The reversed English text, in **lowercase only**.

## 4. Official Examples

### Example 1
- **Input**:
  ```text
  harry
  ```
- **Output**:
  ```text
  yrrah
  ```

### Example 2
- **Input**:
  ```text
  Maryi
  ```
- **Output**:
  ```text
  iyram
  ```

## 5. Key Takeaways & Techniques

### 5.1 Reverse slicing (negative step)
In Python, slicing is written as `string[start:stop:step]`.
Setting `step = -1` and omitting start and stop (written `text[::-1]`) makes Python walk the string from the last character back to the first, with no explicit loop.

```python
text = "harry"
print(text[::-1])   # yrrah
```

### 5.2 The index-based alternative (what the author intended)
The author's note asks you to practice "accessing characters by index". That looks like this, and gives an identical result:

```python
text = input()
print((text[4] + text[3] + text[2] + text[1] + text[0]).lower())
```

Or with a backward loop:

```python
result = ""
for i in range(len(text) - 1, -1, -1):
    result += text[i]
print(result.lower())
```

> The `[::-1]` form is the shortest and most readable, but you should understand the index form too — an exam may ask you to explain the code line by line.

### 5.3 Converting to lowercase
The `.lower()` method converts all uppercase letters to lowercase. Non-letters (digits, spaces, punctuation) are left unchanged.

**Does order matter?** No — `text[::-1].lower()` and `text.lower()[::-1]` produce the same result, because reversing does not change the case of any character.

## 6. Additional Test Cases

| Input | Expected Output | What it tests |
| :--- | :--- | :--- |
| `harry` | `yrrah` | Official example, already lowercase |
| `Maryi` | `iyram` | Official example, has an uppercase letter to convert |
| `ABCDE` | `edcba` | All uppercase, verifies `.lower()` |
| `aBcDe` | `edcba` | Mixed case |

## 7. Pre-Submission Checklist
- [x] Read the input as `str` (no type conversion needed)
- [x] Reverse with `[::-1]` or by index
- [x] Apply `.lower()`
- [x] Tested in VS Code
- [x] PEP-8 clean
