---
code: "06066303"
slug: Problem-Solving-and-Computer-Programming
shortCode: PSCP
nameTh: การแก้ปัญหาและการโปรแกรมคอมพิวเตอร์
nameEn: Problem Solving and Computer Programming
credits: "3 (2-2-5)"
year: 1
term: 1
termId: Y1-S1
prerequisites: []
language: th
semester: "1/2569"
updated: "2026-09-26"
sources:
  - คำอธิบายรายวิชาจากเว็บคณะ
  - สไลด์ Chapter 01–05
  - ชุดโจทย์ iJudge Course 78 (1/2569) และ quiz รายสัปดาห์
  - แนวปฏิบัติการใช้ AI ของรายวิชา (AI-Guidelines-PSCP)
---

# PSCP — การแก้ปัญหาและการโปรแกรมคอมพิวเตอร์

> คิดแก้ปัญหาเป็นขั้นตอนแล้วเขียนเป็นโปรแกรม Python — ฝึกผ่านโจทย์ OJ บน iJudge ทุกสัปดาห์
> ตั้งแต่ตัวแปรและเงื่อนไข ไปจนถึง list, dictionary, ไฟล์ และอัลกอริทึมเรียงลำดับ
>
> **อัปเดตล่าสุด** 26 ก.ย. 2569 · ข้อมูลภาคเรียน 1/2569 (โจทย์ iJudge ถึงสัปดาห์ 9)

## 1. ข้อมูลรายวิชา

| หัวข้อ | รายละเอียด |
|---|---|
| รหัสวิชา | `06066303` |
| ชื่อวิชา | การแก้ปัญหาและการโปรแกรมคอมพิวเตอร์ · Problem Solving and Computer Programming |
| หน่วยกิต | 3 (2-2-5) |
| ชั้นปี / ภาคเรียน | ปี 1 ภาคเรียนที่ 1 (เรียนร่วม IT · DSBA · AIT) |
| วิชาบังคับก่อน | ไม่มี |
| ผู้สอน (1/2569) | รศ.ดร. โชติพัชร์ ภรณวลัย · ผศ.ดร. สามารถ หมุดและ |
| ตำรา / สื่อหลัก | สไลด์ Chapter 01–05 ของรายวิชา · ภาษา **Python 3** |
| ช่องทางเรียน | บรรยาย + แล็บ pair programming · ส่งโจทย์ที่ [iJudge](https://ijudge.it.kmitl.ac.th) (ตรวจอัตโนมัติด้วย test case) |

### คำอธิบายรายวิชา

กลยุทธ์และหลักการแก้ปัญหา · การคิดแบบขั้นตอนวิธี · ผังงาน (flowchart) ·
แนวคิดและเกริ่นนำการเขียนโปรแกรมคอมพิวเตอร์ (จากเว็บคณะ)

### สัดส่วนคะแนน

*ยังไม่ยืนยัน* — ยังไม่มีประกาศสัดส่วนคะแนนของ 1/2569 ในคลัง ให้ดูประกาศในคาบแรก

### วันสำคัญ

| วัน | กิจกรรม |
|---|---|
| 25 ก.ย. 2569 | หมดเขตชุดโจทย์สัปดาห์ 8 (nested loop วาดรูป) |
| 9 ต.ค. 2569 | หมดเขตชุดโจทย์สัปดาห์ 9 (list และการจำลอง) |

## 2. ขอบเขตเนื้อหา

### 2.1 ขอบเขตสอบกลางภาค (บทที่ 1–5)

| บท | หัวข้อ |
|---|---|
| 1 | Python เบื้องต้น — รันโปรแกรม, `print`, ชนิดข้อมูล, ตัวดำเนินการ, `input`, การจัดรูปแบบข้อความ |
| 2 | ฟังก์ชันและมอดูล — `import`, การเรียกใช้, การนิยามฟังก์ชัน, `return`, composite function |
| 3 | การทำงานแบบมีเงื่อนไข — `if` / `elif` / `else`, ตัวดำเนินการตรรกะ, nested condition |
| 4 | การทำงานซ้ำ — `for`, `range`, `while`, `break`, `continue`, nested loop |
| 5 | สตริง — index, `len`, slicing, immutability, การวนซ้ำบนสตริง |

### 2.2 ขอบเขตสอบปลายภาค (Week 08–14)

| สัปดาห์ | หัวข้อหลัก | แนวคิดที่ต้องใช้ | ตัวอย่างโจทย์เด่นบน iJudge |
|---|---|---|---|
| **Week 8** | **Nested Loops & Pattern Printing** | ลูปซ้อนลูปเพื่อวาดรูปทรง 2 มิติ, การคำนวณตำแหน่งพิกัด (row, col), การจัดรูปแบบข้อความและตีเส้นกรอบ | [`oj3290 Left Arrow`](/pscp/oj3290-left-arrow), [`oj3291 Right Arrow`](/pscp/oj3291-right-arrow), [`oj3293 BigFrame`](/pscp/oj3293-bigframe) ⭐, [`oj3296 RGB Mixed`](/pscp/oj3296-rgb-mixed) ⭐, [`oj3299 แปลงดอกไม้`](/pscp/oj3299) ⭐ |
| **Week 9** | **Lists, Sequence Processing & Simulation** | การวนซ้ำบน List, การแปลง/กรองข้อมูล, การย่อช่วงตัวเลข (Range Compression), การจำลองขั้นตอนตามโจทย์ (Simulation) | [`oj3349 กองชาม`](/pscp/oj3349), [`oj3350 ขายรถยนต์`](/pscp/oj3350), [`oj3352 LastStand`](/pscp/oj3352-laststand), [`oj3355 Shorten`](/pscp/oj3355-shorten) ⭐, [`oj3357 Giraffe`](/pscp/oj3357-giraffe) ⭐, [`oj3360 หั่นขนมปัง`](/pscp/oj3360) ⭐ |
| **Week 10–11** | **Nested Lists & Matrices** | ลิสต์ซ้อนลิสต์, เมทริกซ์ 2 มิติ, ตารางข้อมูล | Quiz Week 11 |
| **Week 12** | **Dictionary & Sets** | Key-Value mappings, Hash lookup, การตัดตัวซ้ำ | Quiz Week 12 |
| **Week 13** | **File I/O & Exceptions** | การอ่าน/เขียนไฟล์, `try-except` | Quiz Week 13 |
| **Week 14** | **Sorting & Searching Algorithms** | Bubble sort, Selection sort, Insertion sort, Merge sort, Binary search | แบบทดสอบ Sorting · Quiz Week 14 |

> ⭐ = โจทย์ติดป้าย `[LEARNING LOGS]` ต้องส่งรายงาน `submission.md` + `ai_reflection.md`

## 3. สรุปเนื้อหารายหัวข้อ

**ก่อนกลางภาค — บทที่ 1–5**

### บทที่ 1 — Python เบื้องต้น

- การรันโปรแกรม: interactive mode (`>>>`) vs script mode (`.py`)
- **`print()`** — ส่งได้หลายค่า, พารามิเตอร์ `sep` และ `end`
- **ชนิดข้อมูลพื้นฐาน** — `int`, `float`, `str`, `bool`
- **ตัวดำเนินการเลขคณิต** ⭐

| ตัวดำเนินการ | ความหมาย | ตัวอย่าง |
|---|---|---|
| `+ - *` | บวก ลบ คูณ | `3 * 4 = 12` |
| `/` | หารได้ผลเป็น `float` เสมอ | `7 / 2 = 3.5` |
| `//` | หารปัดลง (floor division) | `7 // 2 = 3` |
| `%` | หารเอาเศษ (modulo) | `5 % 3 = 2` |
| `**` | ยกกำลัง | `2 ** 10 = 1024` |

- **ลำดับความสำคัญ** — `()` → `**` → `* / // %` → `+ -`
- **ตัวแปร** — การกำหนดค่า, การตั้งชื่อ (ห้ามขึ้นต้นด้วยตัวเลข, ห้ามใช้ keyword)
- **`input()`** — คืนค่าเป็น `str` เสมอ ต้อง `int(...)` / `float(...)` ถ้าจะคำนวณ ⭐ (ที่พลาดกันบ่อย)
- **การจัดรูปแบบข้อความ** ⭐⭐ — format string + format sequence
  - `'{:8.2f}'.format(x)` = ความกว้างรวม 8 ตำแหน่ง ทศนิยม 2 หลัก
  - f-string: `f'{x:8.2f}'`
- escape character: `\n`, `\t`, `\'`, `\\`
- **ธรรมเนียมของรายวิชา** — โปรแกรมต้องผ่านทุก test case บน iJudge; เขียน comment อธิบาย

### บทที่ 2 — ฟังก์ชันและมอดูล

- **การเรียกใช้ฟังก์ชัน** — ชื่อฟังก์ชัน + argument
- **ฟังก์ชันแปลงชนิด** — `int()`, `float()`, `str()`; `int('abc')` เกิด error
- **มอดูล** — `import math` แล้วเรียก `math.sqrt()`, `math.hypot()`, `math.pi`
  - ใช้ `help(math)` / `dir(math)` ดูว่ามีอะไรให้ใช้
- **การนิยามฟังก์ชันเอง** ⭐
  ```python
  def area(width, height):
      return width * height
  ```
- **Fruitful function** (มี `return`) vs **void function** (ไม่มี `return` → คืน `None`) ⭐
- **Composite function** — `f(g(x))`; ตัวอย่าง `print(entryway())` เทียบกับ `x = entryway()`
- กฎการตั้งชื่อฟังก์ชัน: ตัวอักษร ตัวเลข และ `_` เท่านั้น ห้ามขึ้นต้นด้วยตัวเลข

### บทที่ 3 — การทำงานแบบมีเงื่อนไข

- **ตัวดำเนินการเปรียบเทียบ** — `== != < <= > >=` (ระวัง `=` กับ `==`) ⭐
- **ตัวดำเนินการตรรกะ** — `and`, `or`, `not` พร้อมตารางความจริง
- **รูปแบบเงื่อนไข**
  ```python
  if cond:          # conditional execution
      ...
  elif cond2:       # chained conditional
      ...
  else:             # alternative execution
      ...
  ```
- **Nested condition** — `if` ซ้อนใน `if` (เทียบเท่ากับ `elif` ในหลายกรณี)
- **การเยื้อง (indentation)** เป็นส่วนหนึ่งของไวยากรณ์ Python ⭐
- โจทย์ประจำบท: Grade I, Robot I, SurprisingVote

### บทที่ 4 — การทำงานซ้ำ

- **`for` + `range`** ⭐
  - `range(stop)` · `range(start, stop)` · `range(start, stop, step)`
  - `range(5)` = `range(0, 5)` = `0,1,2,3,4` (ไม่รวม stop)
  - step ติดลบได้: `range(10, 0, -1)`
- **`while`** — ตรวจเงื่อนไขก่อนทำงานทุกรอบ
- **`break`** — ออกจากลูปทันที · **`continue`** — ข้ามไปรอบถัดไป
- **Infinite loop** — `while True:` ต้องมี `break`
- **Nested loop** ⭐⭐ — ลูปนอกคุมแถว ลูปในคุมหลัก ใช้ `print()` เปล่าเพื่อขึ้นบรรทัดใหม่
  (โจทย์พิมพ์รูปสามเหลี่ยม/สี่เหลี่ยม/X-shape มาจากหัวข้อนี้)
- Accumulator pattern — ตัวแปรสะสมผลรวม/นับจำนวน

### บทที่ 5 — สตริง

- **Index** — `s[0]` คือตัวแรก, `s[-1]` คือตัวสุดท้าย
- **`len(s)`** และการวนด้วย `for ch in s:` (อ่านง่ายกว่าใช้ `range(len(s))`)
- **Slicing** ⭐ — `s[start:stop:step]`; `s[::-1]` = กลับด้าน
  - step ติดลบใช้กลับลำดับได้ แต่ต้องระวัง start/stop
- **Immutability** ⭐⭐ — สตริงแก้ค่าทีละตัวไม่ได้ (`s[0] = 'a'` เกิด error) ต้องสร้างสตริงใหม่
- เมท็อดที่ใช้บ่อย: `.upper()`, `.lower()`, `.strip()`, `.split()`, `.replace()`, `.find()`, `.count()`
- `in` / `not in` สำหรับตรวจสตริงย่อย

**หลังกลางภาค — Week 08–14**

### Week 08 — Nested Loops & Pattern Printing

- ลูปนอกคุมแถว (row) ลูปในคุมคอลัมน์ (col)
  แต่ละช่องตัดสินด้วย `if` จากระยะห่างพิกัด เช่น `abs(row - mid)` สำหรับหัวลูกศร
  ส่วนการตีกรอบข้อความใช้ `len()` หาความกว้างมากสุดแล้ว `.ljust()` เติมช่องว่าง

### Week 09–11 — List, list ซ้อน list และการจำลอง

- สร้าง/เข้าถึง/แก้ไข (`list` **mutable** ต่างจาก `str`) ⭐
- เมท็อด: `.append()`, `.insert()`, `.pop()`, `.remove()`, `.sort()`, `.reverse()`
- slicing บน list, list comprehension, **list ซ้อน list** (ตาราง 2 มิติ)
- การคัดลอก: `b = a` เป็น reference เดียวกัน ต้องใช้ `a[:]` หรือ `list(a)` ⭐
- วนบน list เพื่อกรอง/แปลง/นับ, การย่อช่วงเลข
  ต่อเนื่อง (range compression) ด้วยการจำค่าเริ่ม-ค่าล่าสุดของช่วง, และการจำลอง
  ขั้นตอนตามกติกาโจทย์ทีละก้าว (simulation) เช่น กองชาม หั่นขนมปัง

### Week 12 — Dictionary & Set

- `dict` — คู่ `key: value`, `.keys()`, `.values()`, `.items()`, `.get()`
- `set` — สมาชิกไม่ซ้ำ, union/intersection/difference

### Week 13 — File I/O

- `open(path, 'r'/'w'/'a')`, `with open(...) as f:`, `.read()`, `.readline()`, `.readlines()`, `.write()`
- `try` / `except` สำหรับจัดการ error ตอนเปิดไฟล์หรือแปลงชนิดข้อมูล

### Week 14 — Sorting & Searching

| อัลกอริทึม | แนวคิด | Best | Average | Worst |
|---|---|---|---|---|
| **Bubble Sort** | สลับคู่ที่อยู่ติดกันจนไม่มีการสลับ | O(n) | O(n²) | O(n²) |
| **Selection Sort** | หาค่าน้อยสุดแล้วสลับมาไว้ต้นแถว | O(n²) | O(n²) | O(n²) |
| **Insertion Sort** | แทรกสมาชิกใหม่เข้าที่ในส่วนที่เรียงแล้ว | O(n) | O(n²) | O(n²) |
| **Merge Sort** | แบ่งครึ่ง → เรียงย่อย → รวม (divide & conquer) | O(n log n) | O(n log n) | O(n log n) |
| **Quick Sort** | เลือก pivot → แบ่งพาร์ทิชัน → เรียกซ้ำ | O(n log n) | O(n log n) | O(n²) |

> โจทย์ที่ออกบ่อย: ให้ลำดับตัวเลขเริ่มต้น แล้วให้เขียนสถานะของอาเรย์ **หลังจบแต่ละรอบ**

## 4. สิ่งที่ต้องจำ

| เรื่อง | ค่าที่ต้องจำ |
|---|---|
| หาร | `/` ได้ `float` เสมอ · `//` หารปัดลง · `%` เศษ — `7 / 2 = 3.5` · `7 // 2 = 3` · `5 % 3 = 2` |
| ลำดับความสำคัญ | `()` → `**` → `* / // %` → `+ -` |
| `input()` | คืน `str` เสมอ — ต้อง `int(...)` / `float(...)` ก่อนคำนวณ |
| `range` | `range(start, stop, step)` ไม่รวม `stop` · `range(5)` = 0–4 |
| จัดรูปแบบ | `f'{x:8.2f}'` = กว้าง 8 ทศนิยม 2 |
| Slicing | `s[start:stop:step]` · `s[::-1]` กลับด้าน |
| Mutability | `str` แก้ทีละตัวไม่ได้ · `list` แก้ได้ · `b = a` คือ reference เดียวกัน ใช้ `a[:]` เพื่อคัดลอก |
| Sorting | Bubble/Selection/Insertion O(n²) · Merge O(n log n) ทุกกรณี · Quick แย่สุด O(n²) |

## 5. การประเมินและเตรียมสอบ

### 5.1 รูปแบบการประเมิน

- **โจทย์ OJ บน iJudge** — ส่งให้ผ่าน test case ทุกชุดก่อนหมดเขตของแต่ละชุด
- **Learning Log** — โจทย์ป้าย `[LEARNING LOGS]` ต้องส่ง `submission.md` + `ai_reflection.md` ตามเทมเพลตและนโยบายการใช้ AI ของรายวิชา
- **แล็บ + Pair Programming** — จับคู่ทำโจทย์รายสัปดาห์ มีฟอร์มเช็คชื่อ/ประเมินทุกครั้ง
- **Quiz รายสัปดาห์** — มีตั้งแต่สัปดาห์ 1 ถึง 14
- **กลางภาค** (จากข้อสอบปีก่อน) — Part 1 อ่านโค้ด/หาผลลัพธ์/แก้บั๊ก · Part 2 เขียนโปรแกรม 3–4 ข้อ

### 5.2 หัวข้อที่ออกบ่อย

1. Trace output — อ่านโค้ดแล้วเขียนผลที่พิมพ์ออกมา
2. การจัดรูปแบบข้อความ `'{:8.2f}'`
3. เงื่อนไขซ้อนและตัวดำเนินการตรรกะ
4. Nested loop พิมพ์รูปแบบ
5. Slicing และเมท็อดของสตริง
6. List — เพิ่ม/ลบ/เรียง และ list ซ้อน list
7. Dictionary — นับความถี่ จับคู่ key-value
8. ไล่สถานะอาเรย์หลังจบแต่ละรอบของอัลกอริทึมเรียงลำดับ

### 5.3 จุดที่มักพลาด

- ลืมแปลง `input()` เป็นตัวเลข
- `range` ไม่รวม stop → ลูปขาดหรือเกินไป 1 รอบ (off-by-one)
- สับสน `/` กับ `//` และ `=` กับ `==`
- แก้สตริงทีละตัว (`s[0] = 'a'`) → error เพราะสตริง immutable
- `b = a` แล้วแก้ `b` ทำให้ `a` เปลี่ยนตาม
- เยื้องผิดชั้น — การเยื้องเป็นไวยากรณ์ของ Python

## 6. แหล่งเรียนรู้

| สื่อ | ที่อยู่ |
|---|---|
| สไลด์ quiz แบบฝึกหัด และข้อสอบเก่า | [คลังเรียนรู้](/courses/06066303-Problem-Solving-and-Computer-Programming/library) |
| คู่มือทบทวน | [คู่มือทบทวน](/courses/06066303-Problem-Solving-and-Computer-Programming/summary) |
| โจทย์ OJ พร้อมคำอธิบาย ตัวรัน Python และเครื่องมือเขียน Learning Log | [PSCP บน iHelp](/pscp) |
| ส่งงานและตรวจ test case | [iJudge](https://ijudge.it.kmitl.ac.th) |

### คลังโจทย์ OJ บน iJudge

โจทย์ในคลังครอบคลุมสัปดาห์ที่ 1–9
แบ่งตามชุดวันหมดเขต — สอดคล้องกับลำดับเนื้อหา:

| ชุด (วันหมดเขต) | จำนวน | หัวข้อที่ฝึก | ตัวอย่างโจทย์ |
|---|---|---|---|
| 16–17 ส.ค. 2026 | 6 | ตัวแปร นิพจน์ `input`/`print` การจัดรูปแบบ | Elo · EuclideanDistance2D · Safe Password · Coke · Temperature |
| 28 ส.ค. 2026 | 30 | เงื่อนไข `if`/`elif`/`else` | ผลการสอบ · ปีอธิกสุรทิน · ราศี · ค่าตั๋ว · Basic ATM · ภาษีรถยนต์ |
| 4 ก.ย. 2026 | 16 | ลูป `for`/`while` และ accumulator | Factorial · FizzBuzz · ตารางสูตรคูณ · ผลรวมกำลัง 2 · หาจำนวนเฉพาะ |
| 11 ก.ย. 2026 | 13 | Nested loop และการพิมพ์รูปแบบ | สามเหลี่ยม · Elon Musk (X-shape) · ไฟคริสตมาส · โรงแรมไม่มีชั้น 13 |
| 25 ก.ย. 2026 (สัปดาห์ 8) | 12 | Nested loop วาดรูป 2 มิติ · พิกัด (row, col) · ตีเส้นกรอบข้อความ | Left Arrow · Right Arrow · BigFrame · RGB Mixed · แปลงดอกไม้ |
| 9 ต.ค. 2026 (สัปดาห์ 9) | 15 | List · การกรอง/แปลงลำดับ · การย่อช่วงตัวเลข · การจำลองขั้นตอน | Shorten · Giraffe · กองชาม · LastStand · หั่นขนมปัง |

**ระดับความยาก** — `difficulty: 0` (พื้นฐาน) · `1` (ปานกลาง) · `2` (ยาก) · `3` (ยากมาก เช่น หั่นขนมปัง ขายรถยนต์)

**โจทย์ Learning Log** (ต้องเขียนบันทึกประกอบ `submission.md` + `ai_reflection.md`):

- ก่อนกลางภาค — 2996, 3011, 3017, 3022, 3024, 3025, 3031, 3036, 3042, 3058, 3071,
  3072, 3110, 3111, 3115, 3135, 3157, 3160, 3227, 3232, 3233
- หลังกลางภาค — 3293 (BigFrame), 3296 (RGB Mixed), 3299 (แปลงดอกไม้),
  3355 (Shorten), 3357 (Giraffe), 3360 (หั่นขนมปัง)
