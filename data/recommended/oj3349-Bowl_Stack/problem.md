# OJ 3349: [Recommend] Bowl Stack (กองชาม)

> - **iJudge cp_id**: 3349 — Python
> - **Time limit**: 1s | **Memory**: 32,000 KB
> - **Deadline**: 9 Oct 2026, 00:00

---

## 1. Problem Understanding

A noodle shop has `N` bowls to stack for washing. In any one stack, every bowl
must be **strictly smaller** than the bowl directly below it. Two bowls of the
**same** size can never sit in the same stack.

You may arrange the bowls into stacks any way you like, and each stack may hold
any number of bowls. Find the **minimum number of stacks**.

### The key observation

Because you can reorder freely, a set of bowls with **all distinct sizes** can
always be arranged into a single strictly-decreasing stack. The only thing that
forces a second stack is a **repeated size** — two bowls of size 7 must go in
two different stacks.

So the answer is simply: **how many bowls share the most common size?**

```
sizes:  1  5  2  7  3  2  7  3  8  4
count:  size 2 → 2,  size 3 → 2,  size 7 → 2,  everything else → 1
answer: 2
```

## 2. Input Specification

- Line 1: `N` (`1 ≤ N ≤ 100,000`)
- Next `N` lines: one integer per line, the size of each bowl (`1..300`)

## 3. Output Specification

**1 line** — the minimum number of stacks.

## 4. Official Examples

### Example 1
- **Input**:
  ```text
  10
  1
  5
  2
  7
  3
  2
  7
  3
  8
  4
  ```
- **Output**:
  ```text
  2
  ```

### Example 2
- **Input**:
  ```text
  1
  42
  ```
- **Output**:
  ```text
  1
  ```

## 5. Key Takeaways & Techniques

### 5.1 Read `N`, then `N` more lines

The sizes come one per line, not space-separated. Read everything at once and
slice:

```python
import sys
data = list(map(int, sys.stdin.read().split()))
n = data[0]
sizes = data[1:1 + n]
```

`sys.stdin.read().split()` splits on **any** whitespace — newlines included — so
this works whether the judge sends one number per line or several per line.

### 5.2 `collections.Counter` counts everything in one pass

```python
from collections import Counter
counts = Counter(sizes)      # {1: 1, 5: 1, 2: 2, 7: 2, 3: 2, 8: 1, 4: 1}
print(max(counts.values()))  # 2
```

`Counter(sizes)` builds a frequency table in O(N). `max(counts.values())` is the
size that appears most often — and that many stacks are both necessary (those
equal bowls can't share) and sufficient (distribute the rest around them).

### 5.3 Why greedy "place on the shortest valid pile" also works

A common first idea is: sort the bowls, then for each bowl put it on the pile
whose top is the smallest size still larger than it, else start a new pile. That
is patience sorting, and it gives the same answer — but it is O(N log N) and
more code. The frequency argument collapses it to one line because reordering is
free here.

> [!IMPORTANT]
> The comparison is **strictly** smaller. If the problem allowed "smaller or
> equal", equal sizes could stack and the answer would always be 1.

## 6. Additional Test Cases

| Input | Expected | What it tests |
| :--- | :--- | :--- |
| `10` + `1 5 2 7 3 2 7 3 8 4` | `2` | Max frequency is 2 |
| `1` + `42` | `1` | Single bowl |
| `4` + `5 5 5 5` | `4` | All identical — every bowl its own stack |
| `5` + `1 2 3 4 5` | `1` | All distinct — one decreasing stack |
| `6` + `3 1 3 1 3 1` | `3` | Two sizes, three of each |

## 7. Pre-Submission Checklist
- [ ] Read `N` then exactly `N` sizes
- [ ] Use `sys.stdin.read().split()` (sizes are one per line)
- [ ] Count frequencies with `Counter`
- [ ] Answer is `max` of the frequencies
- [ ] Test all-equal and all-distinct inputs
- [ ] PEP-8 clean
