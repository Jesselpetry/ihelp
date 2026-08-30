---
code: "06066301"
slug: Data-Structures-and-Algorithms
shortCode: DSA
nameTh: โครงสร้างข้อมูลและอัลกอริทึม
nameEn: Data Structures and Algorithms
credits: "3 (2-2-5)"
year: 1
term: 2
termId: Y1-S2
prerequisites: ["06066303 PSCP"]
language: th
sources:
  - kmitl-archive/archive/Y1-S2/Data-Structures-and-Algorithms
---

# DSA — โครงสร้างข้อมูลและอัลกอริทึม

## 1. ภาพรวมรายวิชา

| หัวข้อ | รายละเอียด |
|---|---|
| รหัสวิชา | `06066301` |
| ชื่อไทย | โครงสร้างข้อมูลและอัลกอริทึม |
| ชื่ออังกฤษ | DATA STRUCTURES AND ALGORITHMS |
| หน่วยกิต | 3 (2-2-5) |
| ชั้นปี/เทอม | ปี 1 เทอม 2 |
| วิชาบังคับก่อน | ไม่มีระบุอย่างเป็นทางการ — **ในทางปฏิบัติต่อยอดจาก PSCP** (ต้องเขียนโปรแกรมได้) |
| หลักสูตรที่ใช้ร่วม | IT, DSBA, AIT |
| ภาษาที่ใช้ในสไลด์ | Python (มีหัวข้อ "LIST IN PYTHON") + pseudocode |

### คำอธิบายโดยสังเขป

วิชาแกนที่สอนโครงสร้างข้อมูลพื้นฐานและอัลกอริทึมมาตรฐาน แบ่งชัดเป็นสองครึ่ง:
**ครึ่งแรกเป็นโครงสร้างข้อมูล** (list, stack, queue, tree, graph)
**ครึ่งหลังเป็นการวิเคราะห์และออกแบบอัลกอริทึม** (Big-O, searching, sorting, greedy,
recursion, divide & conquer, dynamic programming)

---

## 2. ขอบเขตเนื้อหา — 14 บท

### 2.1 ขอบเขตสอบกลางภาค (บทที่ 2–7)

| สัปดาห์ | บท | หัวข้อ |
|---|---|---|
| 01 | 1 | Introduction to Data Structures |
| 02 | 2 | Linear List — Array & Linked List |
| 03 | 3 | Stack & Queue |
| 04 | 4 | Binary Tree |
| 05 | 5 | Binary Search Tree (BST) |
| 05b | 6 | Other Trees — Expression Tree, Huffman Tree, Heap |
| 06 | 7 | AVL Tree |
| 07 | 7 | Graph |
| **08** | | **สอบกลางภาค** |

### 2.2 ขอบเขตสอบปลายภาค (บทที่ 8–14)

| สัปดาห์ | บท | หัวข้อ |
|---|---|---|
| 09 | 8 | Algorithm Analysis (Big-O) |
| 10 | 9 | Searching & Hashing |
| 11 | 10 | Sorting |
| 12 | 11 | Greedy Algorithms |
| 13 | 12 | Recursion |
| 14 | 13 | Divide and Conquer |
| 15 | 14 | Dynamic Programming |

---

## 3. สรุปเนื้อหารายหัวข้อ

### บทที่ 2 — Array & Linked List

- **Linear list** — โครงสร้างข้อมูลเชิงเส้น; เทียบกับ tree/graph ที่ไม่เชิงเส้น
- **Static vs Dynamic memory allocation** ⭐ — array จองล่วงหน้าตายตัว; linked list จองตอนรันไทม์
- **Array** — เข้าถึงด้วย index `O(1)`; แทรก/ลบตรงกลางต้องเลื่อนสมาชิก `O(n)`
- **Linked list** — กลุ่มของ **node** ที่เรียงต่อกันด้วย **link (pointer)**
  - node ประกอบด้วย **data** + **link**; มี **head node** (metadata) และ **data node**
- **การดำเนินการพื้นฐาน** ⭐⭐

| งาน | จุดที่ต้องระวัง |
|---|---|
| Insert ที่ต้นลิสต์ | ต่อ `new.link = root` ก่อน แล้วค่อย `root = new` (สลับลำดับ = ลิสต์ขาด) |
| Insert ที่ท้ายลิสต์ | ต้อง traverse หา node ที่ `link == None` |
| Insert ใน ordered list | 3 กรณี — ต้นลิสต์ / กลางลิสต์ / ท้ายลิสต์ |
| Delete | ต้องจำ node ก่อนหน้า (`pPre`) เพื่อเชื่อม link ข้าม |
| Traverse | ใช้ `pos = root` แล้ว `pos = pos.link` จนกว่าจะเป็น `None` |

- **Doubly linked list** — มี `next` และ `prev`; แทรก/ลบง่ายขึ้น แต่ใช้หน่วยความจำมากกว่า
- **List ใน Python** — `list` เป็น dynamic array ไม่ใช่ linked list

### บทที่ 3 — Stack & Queue

**Stack (LIFO)**
- ปฏิบัติการ: `push`, `pop`, `stackTop`, `isEmpty`
- **การประยุกต์** ⭐⭐
  - **Reversing data** — กลับลำดับข้อมูล
  - **Parsing** — ตรวจวงเล็บสมดุล (parse parenthesis)
  - **Postponement** — **แปลง infix → postfix** และการประเมินค่า postfix
  - **Backtracking** — ปัญหา 4 Queens
- **การแปลง infix → postfix** ⭐⭐ (ออกสอบเกือบทุกปี)
  1. เจอ operand → พิมพ์ออกทันที
  2. เจอ operator → pop operator ที่ลำดับความสำคัญ ≥ ออกมาก่อน แล้วจึง push
  3. เจอ `(` → push · เจอ `)` → pop จนถึง `(`
  4. จบนิพจน์ → pop ทุกตัวออก
- Prefix / Infix / Postfix — เช่น `A + B` → prefix `+AB` → postfix `AB+`

**Queue (FIFO)**
- ปฏิบัติการ: `enqueue`, `dequeue`, `queueFront`, `queueRear`
- Implementation แบบ linked list (มี `front` และ `rear`)
- **การประยุกต์** — categorizing data, การจัดคิวงาน, BFS

### บทที่ 4 — Binary Tree

- **คำศัพท์** ⭐⭐ — root, parent, child, sibling, leaf, internal node, subtree,
  **degree**, **level**, **height/depth**, path
- **Binary tree** — แต่ละ node มีลูกได้ไม่เกิน 2
- **Complete / Full / Balanced binary tree**
- ความสูงต่ำสุดของ binary tree ที่มี n โหนด = `⌊log₂ n⌋`; จำนวน node สูงสุดที่ level `h` = `2^h`
- **การท่องต้นไม้ (traversal)** ⭐⭐⭐

| แบบ | ลำดับ | ใช้ทำอะไร |
|---|---|---|
| **Preorder** | Node → Left → Right | คัดลอกต้นไม้, ได้ prefix notation |
| **Inorder** | Left → Node → Right | ได้ข้อมูลเรียงลำดับใน BST, ได้ infix notation |
| **Postorder** | Left → Right → Node | ลบต้นไม้, ได้ postfix notation |
| **Breadth-first (level order)** | ทีละชั้นจากบนลงล่าง | ใช้ queue ช่วย |

> โจทย์มาตรฐาน: ให้ preorder + inorder → สร้างต้นไม้กลับ

### บทที่ 5 — Binary Search Tree

- **สมบัติ BST** ⭐ — ทุก node: ค่าใน subtree ซ้าย < node < ค่าใน subtree ขวา
- **Inorder traversal ของ BST ได้ลำดับเรียงจากน้อยไปมาก** ⭐⭐
- ปฏิบัติการ: search, findSmallest (ซ้ายสุด), findLargest (ขวาสุด), insert, delete
- **การลบ 4 กรณี** ⭐⭐⭐
  1. ไม่มีลูก → ลบทิ้ง
  2. มีลูกซ้ายอย่างเดียว → เอาลูกซ้ายขึ้นแทน
  3. มีลูกขวาอย่างเดียว → เอาลูกขวาขึ้นแทน
  4. มีลูกสองข้าง → แทนด้วย **largest ของ subtree ซ้าย** หรือ **smallest ของ subtree ขวา** แล้วลบ node นั้นแทน
- ประสิทธิภาพ: เฉลี่ย `O(log n)` แต่กรณีแย่สุด (ต้นไม้เอียง) `O(n)`

### บทที่ 6 — Expression Tree, Huffman Tree, Heap

**Binary Expression Tree**
- ใบ = operand, node ภายใน = operator
- traversal ให้ prefix / infix / postfix ตรงกับ preorder / inorder / postorder

**Huffman Tree & Huffman Code** ⭐⭐
- ใช้บีบอัดข้อมูลแบบไม่สูญเสีย ให้อักขระที่พบบ่อยได้รหัสสั้น
- ขั้นตอน: (1) เรียงอักขระตามความถี่ (2) รวมสองตัวที่ความถี่น้อยสุดเป็นโหนดใหม่
  (3) ทำซ้ำจนเหลือต้นไม้เดียว (4) ซ้าย = `0`, ขวา = `1`
- เป็น **prefix code** — ไม่มีรหัสใดเป็นคำนำหน้าของอีกรหัส
- โจทย์: คำนวณจำนวนบิตรวมและอัตราการบีบอัด

**Heap** ⭐⭐
- **Max-heap** — ทุก node มีค่า ≥ ลูกทั้งสอง (min-heap คือกลับกัน); ต้องเป็น complete binary tree
- **เก็บใน array** — โหนดที่ index `i`: ลูกซ้าย `2i+1`, ลูกขวา `2i+2`, พ่อ `(i−1)//2`
- **ReheapUp** (ใช้ตอน insert) และ **ReheapDown** (ใช้ตอน delete root)
- Build heap, insert, delete — ทุกอย่าง `O(log n)`

### บทที่ 7 — AVL Tree

- **AVL** = BST ที่สมดุล; **balance factor** = ความสูง subtree ซ้าย − ความสูง subtree ขวา ∈ {−1, 0, 1}
- **4 กรณีการหมุน** ⭐⭐⭐

| กรณี | สถานการณ์ | วิธีแก้ |
|---|---|---|
| **LL** (Left to Left) | แทรกใน subtree ซ้ายของลูกซ้าย | หมุนขวา 1 ครั้ง |
| **RR** (Right to Right) | แทรกใน subtree ขวาของลูกขวา | หมุนซ้าย 1 ครั้ง |
| **LR** (Left to Right) | แทรกใน subtree ขวาของลูกซ้าย | หมุนซ้ายที่ลูก แล้วหมุนขวาที่ราก |
| **RL** (Right to Left) | แทรกใน subtree ซ้ายของลูกขวา | หมุนขวาที่ลูก แล้วหมุนซ้ายที่ราก |

- ความสูงของ AVL ที่มี n โหนด = `O(log n)` → ค้นหา/แทรก/ลบ `O(log n)` รับประกัน
- โจทย์มาตรฐาน: แทรกลำดับตัวเลขทีละตัว วาดต้นไม้หลังการหมุนแต่ละครั้ง

### บทที่ 7 (ต่อ) — Graph

- **นิยาม** — `G = (V, E)`; vertex และ edge
- **Directed vs Undirected graph**; degree, in-degree, out-degree
- **Complete graph** — undirected มี `n(n−1)/2` เส้น; directed มี `n(n−1)` เส้น
- **การท่องกราฟ** ⭐⭐

| แบบ | โครงสร้างช่วย | ใช้ทำอะไร |
|---|---|---|
| **DFS** (depth-first) | Stack / recursion | ตรวจ connectivity, หา cycle |
| **BFS** (breadth-first) | Queue | หาเส้นทางสั้นสุดในกราฟไม่ถ่วงน้ำหนัก |

- **โครงสร้างเก็บกราฟ** ⭐⭐

| | Adjacency Matrix | Adjacency List |
|---|---|---|
| หน่วยความจำ | `O(V²)` | `O(V + E)` |
| ตรวจว่ามีเส้นเชื่อมไหม | `O(1)` | `O(degree)` |
| เหมาะกับ | กราฟหนาแน่น (dense) | กราฟเบาบาง (sparse) |

- **Network** = กราฟถ่วงน้ำหนัก
- **Minimum Spanning Tree** — Prim / Kruskal
- **Shortest path** — Dijkstra

### บทที่ 8 — Algorithm Analysis

- **อัลกอริทึม** — ขั้นตอนวิธีแก้ปัญหา จาก initial state ไป end state
- **Pseudocode** — เขียนอธิบายขั้นตอนโดยไม่ผูกกับภาษาใดภาษาหนึ่ง
- **รูปแบบลูปมาตรฐานและจำนวนรอบ** ⭐⭐

| รูปแบบ | ตัวอย่าง | จำนวนรอบ |
|---|---|---|
| **Linear loop** | `i = 1; while i <= n: i += 1` | `n` |
| **Linear loop (step k)** | `i += 2` | `n/2` |
| **Logarithmic loop (คูณ)** | `i *= 2` | `log₂ n` |
| **Logarithmic loop (หาร)** | `i //= 2` | `log₂ n` |
| **Nested — linear logarithmic** | ลูปนอก `n`, ลูปใน `log n` | `n log n` |
| **Nested — quadratic** | ลูปนอก `n`, ลูปใน `n` | `n²` |
| **Nested — dependent quadratic** | ลูปในขึ้นกับตัวนับลูปนอก | `n(n+1)/2` |

- **Big-O notation** ⭐⭐⭐ — ตัดค่าคงที่และพจน์อันดับต่ำทิ้ง
  - `f(n) = 3n² + 2n + 3` → `O(n²)`
  - `f(n) = 4n³ + 2n` → `O(n³)`
- **ลำดับความเร็ว** — `O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(n³) < O(2ⁿ)`
- ตารางเปรียบเทียบจำนวนขั้นเมื่อ `n = 10,000` (ในสไลด์) ใช้สื่อว่าอัลกอริทึม `O(n²)` ใช้ไม่ได้จริง

### บทที่ 9 — Searching & Hashing

- **Sequential search** — `O(n)`; เฉลี่ยเทียบ `(n+1)/2` ครั้ง
- **Binary search** ⭐⭐ — ต้องเรียงข้อมูลก่อน; `O(log n)`
  ```
  while first <= last:
      mid = (first + last) // 2
      if target == list[mid]: found
      elif target <  list[mid]: last = mid - 1
      else: first = mid + 1
  ```
- เปรียบเทียบ sequential vs binary — จุดคุ้มทุนเมื่อ n ใหญ่พอ
- **Hashing** ⭐⭐ — `index = hash(key)`; เข้าถึงเฉลี่ย `O(1)`
- **Collision** และการแก้

| วิธี | หลักการ |
|---|---|
| **Linear probing** | ชนแล้วเลื่อนไปช่องถัดไปเรื่อย ๆ (เกิด clustering) |
| **Quadratic probing** | เลื่อนไป `1², 2², 3², …` |
| **Bucket** | แต่ละช่องเก็บได้หลายรายการ |
| **Chaining** | แต่ละช่องเป็นหัวของ linked list |

- **Load factor** = จำนวนข้อมูล / ขนาดตาราง — ยิ่งสูงยิ่งชนบ่อย

### บทที่ 10 — Sorting

| อัลกอริทึม | หลักการ | Best | Average | Worst | เสถียร | หน่วยความจำเพิ่ม |
|---|---|---|---|---|---|---|
| **Insertion** | แทรกเข้าที่ในส่วนที่เรียงแล้ว | `O(n)` | `O(n²)` | `O(n²)` | ใช่ | `O(1)` |
| **Selection** | หาค่าน้อยสุดแล้วสลับ | `O(n²)` | `O(n²)` | `O(n²)` | ไม่ | `O(1)` |
| **Bubble** | สลับคู่ติดกันไปเรื่อย ๆ | `O(n)` | `O(n²)` | `O(n²)` | ใช่ | `O(1)` |
| **Merge** | แบ่งครึ่ง เรียงย่อย แล้วรวม | `O(n log n)` | `O(n log n)` | `O(n log n)` | ใช่ | `O(n)` |
| **Quick** | เลือก pivot แบ่งพาร์ทิชัน เรียกซ้ำ | `O(n log n)` | `O(n log n)` | `O(n²)` | ไม่ | `O(log n)` |

- แนวคิด **walker** (ตัวชี้ `w`) ที่ใช้ในสไลด์สำหรับ insertion/bubble
- Quick sort กรณีแย่สุดเกิดเมื่อ pivot เป็นค่าน้อยสุด/มากสุดเสมอ (ข้อมูลเรียงมาแล้ว)

> โจทย์มาตรฐาน: ให้ลำดับตัวเลข → เขียนสถานะของอาเรย์หลังจบแต่ละ pass

### บทที่ 11 — Greedy Algorithms

- **หลักการ** — เลือกตัวเลือกที่ดีที่สุด ณ ขั้นนั้น ๆ โดยไม่ย้อนกลับมาแก้
- **ไม่รับประกันคำตอบดีที่สุดเสมอไป** ⭐ — ต้องรู้ว่าปัญหาไหนใช้ได้/ใช้ไม่ได้
- ปัญหามาตรฐานในสไลด์

| ปัญหา | Greedy ให้คำตอบดีที่สุดไหม |
|---|---|
| **Coin exchange** | ได้ เฉพาะชุดเหรียญบางชุด (เช่น เหรียญไทย) — ชุดอื่นอาจไม่ได้ |
| **Classroom scheduling** (activity selection) | ได้ — เลือกกิจกรรมที่จบเร็วที่สุดก่อน |
| **Knapsack** | **Fractional** ได้ · **0/1 ไม่ได้** (ต้องใช้ DP) |
| **Set-covering** | ไม่ได้ — เป็น approximation |
| **Traveling salesman** | ไม่ได้ — NP-hard |

### บทที่ 12 — Recursion

- **นิยามเวียนเกิด** — ฟังก์ชันเรียกตัวเอง
- **องค์ประกอบบังคับ 2 อย่าง** ⭐⭐ — **base case** (เงื่อนไขหยุด) และ **recursive case** ที่เข้าใกล้ base case
- **Case study: factorial** — `n! = n × (n−1)!`, `0! = 1`
- ตัวอย่างอื่น: print reverse, **GCD (Euclidean)** `gcd(a,b) = gcd(b, a mod b)`,
  **Fibonacci** `F(n) = F(n−1) + F(n−2)`, **Towers of Hanoi** (`2ⁿ − 1` ครั้ง)
- **ข้อจำกัด** ⭐ — ใช้ stack frame มาก อาจ stack overflow; Fibonacci แบบ recursion ธรรมดาเป็น `O(2ⁿ)`
- Iterative vs recursive — recursion อ่านง่ายกว่า แต่มักช้ากว่าและกินหน่วยความจำมากกว่า

### บทที่ 13 — Divide and Conquer

- **3 ขั้นตอน** ⭐ — **Divide** แบ่งปัญหาเป็นปัญหาย่อย → **Conquer** แก้ปัญหาย่อย (มักเวียนเกิด) → **Combine** รวมคำตอบ
- ตัวอย่าง: **Merge sort**, **Quick sort**
- **Modular exponentiation** — `aⁿ mod m` ด้วยการยกกำลังแบบแบ่งครึ่ง → `O(log n)`
- **Integer multiplication** ⭐⭐
  - Brute force: `O(n²)`
  - **Karatsuba**: `O(n^1.585)` — จาก 4 การคูณย่อยเหลือ 3
- **Matrix multiplication** — Brute force `O(n³)` vs **Strassen** `O(n^2.807)`

### บทที่ 14 — Dynamic Programming

- **แนวคิด** ⭐⭐ — ปัญหาที่มี **overlapping subproblems** + **optimal substructure**
  → เก็บคำตอบของปัญหาย่อยไว้ใช้ซ้ำ
- **Fibonacci** เป็นตัวอย่างเปิดบท: recursion ธรรมดาคำนวณ `F(n)` ซ้ำหลายรอบ
  - **Memoization (top-down)** — จำค่าที่เคยคำนวณ
  - **Tabulation (bottom-up)** — ไล่คำนวณจาก `F(0)` ขึ้นไป → `O(n)`
- **0/1 Knapsack** ⭐⭐⭐
  - ตาราง `dp[i][w]` = มูลค่าสูงสุดเมื่อพิจารณาของ i ชิ้นแรก และน้ำหนักไม่เกิน `w`
  - `dp[i][w] = max(dp[i−1][w], value[i] + dp[i−1][w − weight[i]])`
- **Longest Common Substring** และ **Longest Common Subsequence (LCS)** ⭐⭐
  - LCS: `dp[i][j] = dp[i−1][j−1] + 1` ถ้าตัวอักษรตรงกัน มิฉะนั้น `max(dp[i−1][j], dp[i][j−1])`
- **DP vs Divide & Conquer** — D&C ปัญหาย่อยไม่ซ้อนทับ; DP ซ้อนทับจึงคุ้มที่จะจำ

---

## 4. พิมพ์เขียวสำหรับสร้างสื่อต่อยอด

### 4.1 คลังข้อสอบ

| มิติ | ข้อกำหนด |
|---|---|
| กลางภาค | Linked list 15% · Stack/Queue 20% · Binary tree 15% · BST 15% · Heap/Huffman 15% · AVL 10% · Graph 10% |
| ปลายภาค | Big-O 20% · Searching/Hashing 15% · Sorting 20% · Greedy 10% · Recursion 15% · D&C 10% · DP 10% |
| ชนิดข้อ | วาด/ไล่ขั้นตอน 45% · คำนวณ Big-O 20% · เขียน pseudocode 20% · ปรนัยมโนทัศน์ 15% |

### 4.2 รูปแบบโจทย์ที่ generate ได้อัตโนมัติ

| หัวข้อ | เทมเพลตโจทย์ | วิธีตรวจ |
|---|---|---|
| Linked list | สุ่มลำดับ insert/delete → ถามสถานะลิสต์สุดท้าย | simulate ด้วยโค้ด |
| Infix → Postfix | สุ่มนิพจน์ 6–10 token | เทียบกับ shunting-yard |
| Tree traversal | สุ่ม BST จากลำดับ insert → ถาม pre/in/post/level order | simulate |
| BST deletion | สุ่มต้นไม้ + โหนดที่ลบ (บังคับให้เจอกรณี 2 ลูก) | simulate |
| AVL | สุ่มลำดับ insert ที่ทำให้เกิดครบทั้ง 4 กรณีหมุน | simulate |
| Heap | สุ่มอาเรย์ → build max-heap → ถามอาเรย์ผลลัพธ์ | simulate |
| Huffman | สุ่มความถี่อักขระ → ถามความยาวรหัสรวม | simulate |
| Big-O | สุ่มโครงลูปซ้อน → ถาม Big-O | สร้างจากเทมเพลตที่รู้คำตอบ |
| Sorting | สุ่มอาเรย์ 8 ตัว → ถามสถานะหลัง pass ที่ k | simulate |
| DP | สุ่มโจทย์ knapsack เล็ก (5 ของ, W ≤ 15) → ถามตาราง `dp` | simulate |

### 4.3 ข้อสอบจำลอง

- **กลางภาค** — 6 ข้อใหญ่: linked list 1 · stack (infix→postfix) 1 · tree traversal 1 ·
  BST insert/delete 1 · heap หรือ Huffman 1 · graph (matrix/list + DFS/BFS) 1
- **ปลายภาค** — 7 ข้อ: Big-O 1 · binary search trace 1 · hashing + collision 1 ·
  sorting trace 2 · greedy 1 · DP (knapsack หรือ LCS) 1
- ในคลังมีข้อสอบจริง `DSA_Midterm_2565-Term2.pdf` และ `DSA_Final_2023.pdf` ให้เทียบแนว

---

## 5. แหล่งข้อมูลในคลัง

| ประเภท | จำนวน | หมายเหตุ |
|---|---|---|
| สไลด์บรรยาย | 14 ไฟล์ (Week02–Week15) | ครบทุกบท มีลายมือจดในสไลด์หลายไฟล์ |
| แบบฝึกหัด + เฉลย | 36 ไฟล์ | มี `DSA_Ex_Solution-*` แยกตามบท — ใช้เป็นต้นแบบเฉลยได้ทันที |
| Posttest | Posttest 8–14 | แบบทดสอบหลังเรียนรายสัปดาห์ |
| การบ้าน | HW 05, 06, 09, 10, 13, 14 | มีฉบับทำแล้ว |
| ข้อสอบเก่า | 30 ไฟล์ | midterm/final แยกตามบทและตามปี |
| ชีทสรุป | `DSA_Sheet_Recap-Final.pdf` | |
