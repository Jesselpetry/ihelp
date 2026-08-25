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
programmingLanguage: Python 3
judge: https://ijudge.it.kmitl.ac.th
sources:
  - kmitl-archive/archive/Y1-S1/Problem-Solving-and-Computer-Programming
  - IT-KMITL/Y1-S1/PSCP/pscp-69070027
  - IT-KMITL/Y1-S1/PSCP/ihelp
---

# PSCP — การแก้ปัญหาและการโปรแกรมคอมพิวเตอร์

## 1. ภาพรวมรายวิชา (ข้อมูลอย่างเป็นทางการจาก IT KMITL)

| หัวข้อ | รายละเอียด |
|---|---|
| **รหัสวิชา** | `06066303` |
| **ชื่อภาษาไทย** | การแก้ปัญหาและการโปรแกรมคอมพิวเตอร์ |
| **ชื่อภาษาอังกฤษ** | Problem Solving and Computer Programming |
| **หน่วยกิต** | 3 (3-0-6) |
| **ระดับการศึกษา** | ปริญญาตรี |
| **ชั้นปี / ภาคการศึกษา** | ปี 1 เทอม 1 (Y1-S1) |
| **วิชาบังคับก่อน** | ไม่มีวิชาบังคับก่อน |
| **อาจารย์ผู้สอน** | รศ.ดร. โชติพัชร์ ภรณวลัย · ผศ.ดร. สามารถ หมุดและ |

### คำอธิบายรายวิชา (Course Description)

> **ภาษาไทย:**  
> กลยุทธ์และหลักการแก้ปัญหา การคิดแบบขั้นตอนวิธี ผังงาน แนวคิดและเกริ่นนำการเขียนโปรแกรมคอมพิวเตอร์

> **English:**  
> Problem solving strategies and concepts, algorithmic thinking, flowchart, concepts and introduction to computer programming.


### รูปแบบการเรียน (1/2026)

- **บรรยาย** — แนวคิดการแก้ปัญหา + ไวยากรณ์ Python
- **แล็บ + Pair Programming** — จับคู่ทำโจทย์รายสัปดาห์ มีฟอร์มเช็คชื่อ/ประเมินผลทุกครั้ง
- **โจทย์ OJ** — ส่งโค้ดขึ้น iJudge ให้ผ่าน test case ทุกชุด แต่ละชุดมีวันหมดเขต
- **Learning Log** — โจทย์ที่ติดป้าย `[LEARNING LOGS]` ต้องส่ง `submission.md` + `ai_reflection.md`
  ตามเทมเพลตทางการของรายวิชา (มีนโยบายการใช้ AI กำกับชัดเจน — ดู `AI-Guidelines-PSCP`)
- **Quiz รายสัปดาห์** — พบร่องรอยในคลังตั้งแต่ Quiz Week01 ถึง Week14

---

## 2. ขอบเขตเนื้อหา

### 2.1 ขอบเขตสอบกลางภาค

| บท | หัวข้อ | ไฟล์อ้างอิง |
|---|---|---|
| 1 | Python เบื้องต้น — รันโปรแกรม, `print`, ชนิดข้อมูล, ตัวดำเนินการ, `input`, การจัดรูปแบบข้อความ | `PSCP_Lec_Chapter01-2022.pdf` |
| 2 | ฟังก์ชันและมอดูล — `import`, การเรียกใช้, การนิยามฟังก์ชัน, `return`, composite function | `PSCP_Lec_Chapter02-2022.pdf` |
| 3 | การทำงานแบบมีเงื่อนไข — `if` / `elif` / `else`, ตัวดำเนินการตรรกะ, nested condition | `PSCP_Lec_Chapter03-2022.pdf` |
| 4 | การทำงานซ้ำ — `for`, `range`, `while`, `break`, `continue`, nested loop | `PSCP_Lec_Chapter04-2022.pdf` |
| 5 | สตริง — index, `len`, slicing, immutability, การวนซ้ำบนสตริง | `PSCP_Lec_Chapter05-2022.pdf` |

### 2.2 ขอบเขตสอบปลายภาค

ตามชุดโจทย์และ quiz ที่พบในคลัง (Week 08–14) หัวข้อหลังกลางภาคครอบคลุม:

| หัวข้อ | หลักฐานในคลัง |
|---|---|
| List และการดำเนินการกับ list | Quiz Week08–09 |
| List หลายมิติ / ตาราง | Quiz Week11 |
| Dictionary และ set | Quiz Week12 |
| File I/O | Quiz Week13 |
| **อัลกอริทึมการเรียงลำดับ** — merge / selection / bubble / quick sort | `PSCP_Ex_SortingTest.pdf` |
| การค้นหา และการแก้ปัญหาเชิงอัลกอริทึม | Quiz Week14 |

> ไฟล์ quiz หลังกลางภาคเป็นภาพสแกน จึงยังยืนยันหัวข้อรายสัปดาห์แบบละเอียดไม่ได้
> รายการข้างบนอนุมานจากชื่อไฟล์และเนื้อหาที่อ่านออก — ให้ยึดประกาศของผู้สอนเป็นหลัก

---

## 3. สรุปเนื้อหารายหัวข้อ

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

### หัวข้อหลังกลางภาค

**List**
- สร้าง/เข้าถึง/แก้ไข (`list` **mutable** ต่างจาก `str`) ⭐
- เมท็อด: `.append()`, `.insert()`, `.pop()`, `.remove()`, `.sort()`, `.reverse()`
- slicing บน list, list comprehension, **list ซ้อน list** (ตาราง 2 มิติ)
- การคัดลอก: `b = a` เป็น reference เดียวกัน ต้องใช้ `a[:]` หรือ `list(a)` ⭐

**Dictionary & Set**
- `dict` — คู่ `key: value`, `.keys()`, `.values()`, `.items()`, `.get()`
- `set` — สมาชิกไม่ซ้ำ, union/intersection/difference

**File I/O**
- `open(path, 'r'/'w'/'a')`, `with open(...) as f:`, `.read()`, `.readline()`, `.readlines()`, `.write()`

**อัลกอริทึมการเรียงลำดับ** ⭐⭐ (พบใน `PSCP_Ex_SortingTest.pdf`)

| อัลกอริทึม | แนวคิด | Best | Average | Worst |
|---|---|---|---|---|
| **Bubble Sort** | สลับคู่ที่อยู่ติดกันจนไม่มีการสลับ | O(n) | O(n²) | O(n²) |
| **Selection Sort** | หาค่าน้อยสุดแล้วสลับมาไว้ต้นแถว | O(n²) | O(n²) | O(n²) |
| **Insertion Sort** | แทรกสมาชิกใหม่เข้าที่ในส่วนที่เรียงแล้ว | O(n) | O(n²) | O(n²) |
| **Merge Sort** | แบ่งครึ่ง → เรียงย่อย → รวม (divide & conquer) | O(n log n) | O(n log n) | O(n log n) |
| **Quick Sort** | เลือก pivot → แบ่งพาร์ทิชัน → เรียกซ้ำ | O(n log n) | O(n log n) | O(n²) |

> โจทย์ที่ออกบ่อย: ให้ลำดับตัวเลขเริ่มต้น แล้วให้เขียนสถานะของอาเรย์ **หลังจบแต่ละรอบ**

---

## 4. คลังโจทย์ OJ (iJudge)

โจทย์ 64 ข้อในคลัง `pscp-69070027/oj_problems.json` แบ่งตามชุดวันหมดเขต — สอดคล้องกับลำดับเนื้อหา:

| ชุด (วันหมดเขต) | จำนวน | หัวข้อที่ฝึก | ตัวอย่างโจทย์ |
|---|---|---|---|
| 16–17 ส.ค. 2026 | 6 | ตัวแปร นิพจน์ `input`/`print` การจัดรูปแบบ | Elo · EuclideanDistance2D · Safe Password · Coke · Temperature |
| 28 ส.ค. 2026 | 30 | เงื่อนไข `if`/`elif`/`else` | ผลการสอบ · ปีอธิกสุรทิน · ราศี · ค่าตั๋ว · Basic ATM · ภาษีรถยนต์ |
| 4 ก.ย. 2026 | 16 | ลูป `for`/`while` และ accumulator | Factorial · FizzBuzz · ตารางสูตรคูณ · ผลรวมกำลัง 2 · หาจำนวนเฉพาะ |
| 11 ก.ย. 2026 | 13 | Nested loop และการพิมพ์รูปแบบ | สามเหลี่ยม · Elon Musk (X-shape) · ไฟคริสตมาส · โรงแรมไม่มีชั้น 13 |

**ระดับความยาก** — `difficulty: 0` (พื้นฐาน) · `1` (ปานกลาง) · `2` (ยาก เช่น Arcade of Time)

**โจทย์ Learning Log** (ต้องเขียนบันทึกประกอบ): 2996, 3011, 3017, 3022, 3024, 3025, 3031, 3036,
3042, 3058, 3071, 3072, 3110, 3111, 3115, 3135, 3157, 3160, 3227, 3232, 3233

---

## 5. พิมพ์เขียวสำหรับสร้างสื่อต่อยอด

### 5.1 คลังโจทย์ฝึก (Lab Challenge)

สคีมาที่โปรเจกต์กำหนดไว้แล้วใน `docs/DEVELOPMENT.md`:

```ts
type LabChallenge = {
  id: string;                 // "pscp-lab-01"
  courseCode: "PSCP";
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  description: string;
  testCases: { input: string; expected: string; hidden?: boolean }[];
  hints: string[];
};
```

**ข้อกำหนดเพิ่มสำหรับการ generate**

| มิติ | ข้อกำหนด |
|---|---|
| Test case ต่อโจทย์ | อย่างน้อย 5 ชุด — ตัวอย่างจากโจทย์ 2 ชุด (เปิด) + edge case 3 ชุด (ซ่อน) |
| Edge case บังคับ | ค่าน้อยสุด/มากสุดของช่วง · ค่า 0 · ค่าติดลบ (ถ้าโจทย์อนุญาต) · อินพุตบรรทัดเดียว vs หลายบรรทัด |
| Hint | 3 ระดับ — (1) ชี้แนวคิด (2) ชี้โครงสร้างโค้ด (3) ชี้บรรทัดที่มักผิด **ห้ามให้โค้ดเฉลย** |
| การรันในเว็บ | ใช้ Pyodide (มีอยู่แล้วใน `ihelp/lib/pyodide-client.ts`) ตรวจ stdout เทียบตรง |
| สไตล์โค้ด | ตรวจ PEP8 พื้นฐาน (มี `ihelp/lib/pep8-rules.ts` ให้ใช้ซ้ำ) |

### 5.2 คลังข้อสอบ (Quiz Bank)

| ชนิดข้อ | สัดส่วน | ตัวอย่าง |
|---|---|---|
| **Trace output** | 35% | ให้โค้ด → เขียนผลลัพธ์ที่พิมพ์ออกมา |
| **Find the bug** | 20% | โค้ดที่ผิด 1 บรรทัด → ระบุบรรทัดและแก้ |
| **Fill in the blank** | 20% | เติมนิพจน์/เงื่อนไขที่ขาด |
| **เขียนโปรแกรม** | 25% | โจทย์สั้น ๆ เขียนได้ใน 15 บรรทัด |

**หลุมพรางที่ควรใช้ทำตัวลวง** ⭐ — `input()` คืน `str` · `range` ไม่รวม stop ·
`/` vs `//` · สตริง immutable · `list` assignment เป็น reference · การเยื้องผิดชั้น ·
`=` vs `==` · ลูปที่รันเกิน/ขาดไป 1 รอบ (off-by-one)

### 5.3 ข้อสอบจำลอง

- **กลางภาค** — 2 ส่วน (พบในคลัง `PSCP_Midterm_Part1/Part2`)
  - Part 1: อ่านโค้ด/หาผลลัพธ์/แก้บั๊ก
  - Part 2: เขียนโปรแกรมแก้โจทย์ 3–4 ข้อ
- **ปลายภาค** — เพิ่มโจทย์ list/dict/file และให้ไล่รอบการทำงานของอัลกอริทึมเรียงลำดับ
- **Mock lab** — จับเวลา 2 ชั่วโมง ให้โจทย์ OJ 4 ข้อ (Easy 2 · Medium 1 · Hard 1)

### 5.4 การเชื่อมกับ iHelp (Phase 4)

- `data/oj_problems.json` ใช้เป็นดัชนีโจทย์ได้เลย (มี id, ชื่อ, ความยาก, วันหมดเขต, ป้าย Learning Log, URL)
- เทมเพลต `submission.md` / `ai_reflection.md` อยู่ใน `AI-Guidelines-PSCP/templates`
- นโยบายการใช้ AI อยู่ใน `AI-Guidelines-PSCP/instructions/COURSE_AI_INSTRUCTIONS.md`

---

## 6. แหล่งข้อมูลในคลัง

| ประเภท | จำนวน | หมายเหตุ |
|---|---|---|
| สไลด์บรรยาย | 7 ไฟล์ (Chapter 01–05) | พิมพ์จาก markdown — ฟอนต์ไทยในไฟล์ PDF อ่านยาก ให้เปิดไฟล์จริงประกอบ |
| Quiz | Week 01, 03, 07–09, 11–14 + Quiz 02, 04, 05, 06 | **เป็นภาพสแกนทั้งหมด** ต้องทำ OCR ก่อนใช้ |
| แบบฝึกหัด/การบ้าน | 11 ไฟล์ | รวม `PSCP_Ex_SortingTest.pdf` ที่อ่านออก |
| ข้อสอบกลางภาค | Part1 (8 หน้า) + Part2 (12 หน้า) | ภาพสแกน |
| โค้ดโจทย์ OJ | 64 โจทย์ | `pscp-69070027/` — มีทั้งโค้ดที่ผ่านและ learning log |
| เครื่องมือช่วย | `ihelp/` | Next.js app สร้าง learning log + รัน Python ในเบราว์เซอร์ |

> ⚠️ **ต้อง sanitize ก่อนนำเข้า** — ไฟล์ในคลัง PSCP มีชื่อ-นามสกุลจริงและรหัสนักศึกษาอยู่หลายจุด
