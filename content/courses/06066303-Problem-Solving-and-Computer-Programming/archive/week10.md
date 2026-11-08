# สัปดาห์ที่ 10 · ลำดับ ทูเพิล การคัดกรอง และความถี่ (Sequences, Tuples, Duplication & Frequency Filtering)

> รศ.ดร. โชติพัชร์ ภรณวลัย · ผศ.ดร. สามารถ หมุดและ · ขอบเขต Final (ปลายภาค) · สรุปโจทย์ OJ ประจำสัปดาห์ที่ 10

## อ่านจบแล้วต้องตอบได้

- อธิบายความแตกต่างระหว่าง Tuple (Immutable Sequence) กับ List (Mutable Sequence) ทั้งด้านการแก้ไขข้อมูลและประสิทธิภาพหน่วยความจำ
- ประยุกต์ใช้ Tuple Packing, Unpacking (`x, y = point`) และการสลับค่าตัวแปรแบบไพทอนิค (`a, b = b, a`)
- ออกแบบอัลกอริทึมตรวจจับสมาชิกซ้ำ (Duplicate Detection) และการนับความถี่ (Frequency Counting) แบบรักษาลำดับเดิม (Stable Deduplication)
- กำหนดฟังก์ชันคีย์สำหรับการเรียงลำดับหลายเงื่อนไข (Multi-key Sorting) ด้วย `sorted()` ร่วมกับ `key=lambda x: ...`
- จัดการชุดข้อมูลพิกัดเรขาคณิต 2 มิติ และการประมวลผลลำดับคู่ขนานด้วย `zip()` และ `enumerate()`

---

## เอกสารประจำสัปดาห์

| เอกสาร | หน้า | ไฟล์ในคลัง |
|---|:---:|---|
| สไลด์บรรยายอ้างอิง — Chapter 05 Data Structures | 26 | `pscp-lec-chapter05.pdf` |

> 🔒 **ควิซและข้อสอบเก่า:** ข้อสอบย่อยประจำสัปดาห์และแนวข้อสอบเก่าจัดเก็บในคลังข้อสอบเฉพาะนักศึกษา IT KMITL สามารถเข้าดูได้ที่ [คลังเรียนรู้รายวิชา PSCP](/courses/06066303-Problem-Solving-and-Computer-Programming/archive) หลังเข้าสู่ระบบ

---

## สรุปอ่านสอบ

### 1. ทูเพิลและคุณสมบัติความไม่เปลี่ยนรูป (Tuple Essentials & Immutability)

**Tuple** เป็นโครงสร้างข้อมูลแบบลำดับ (Sequence) ที่คล้ายกับ List ทุกประการ ยกเว้นคุณสมบัติสำคัญข้อเดียวคือ **แก้ไขเปลี่ยนแปลงข้อมูลไม่ได้ (Immutable)** เมื่อสร้างขึ้นแล้วจะไม่สามารถเพิ่ม ลด หรือแก้ไขสมาชิกได้

#### ข้อควรจำในการสร้าง Tuple
- **เครื่องหมาย Comma คือตัวกำหนด Tuple**: ไม่ใช่วงเล็บเพียงอย่างเดียว
- **Tuple สมาชิกตัวเดียว (Single-element Tuple)**: ต้องมี Comma ปิดท้ายเสมอ
  ```python
  not_a_tuple = (42)    # ชนิดข้อมูลคือ int !
  is_a_tuple = (42,)    # ชนิดข้อมูลคือ tuple
  ```
- **การเข้าถึงข้อมูล**: ใช้ระบบ Index 0-based และ Slicing ได้เหมือนกับ List และ String

```python
point = (10, 25)
print(point[0])        # 10
print(point[-1])       # 25

# point[0] = 99        # TypeError: 'tuple' object does not support item assignment
```

| คุณสมบัติ | List | Tuple |
|---|:---:|:---:|
| ไวยากรณ์ | `[1, 2, 3]` | `(1, 2, 3)` หรือ `1, 2, 3` |
| ความสามารถในการแก้ไข (Mutability) | แก้ไขได้ (Mutable) | แก้ไขไม่ได้ (Immutable) |
| ประสิทธิภาพและหน่วยความจำ | ใช้พื้นที่มากกว่า ช้ากว่าเล็กน้อย | กะทัดรัด ทำงานเร็วกว่า |
| การนำไปเป็น Dictionary Key หรือ Set | ไม่ได้ (Unhashable) | ได้ (ถ้าสมาชิกภายในเป็น Immutable ทั้งหมด) |

---

### 2. การบรรจุและกระจายค่า (Tuple Packing & Unpacking)

Python มีความสามารถในการจัดกลุ่มข้อมูลเข้าเป็น Tuple (Packing) และการกระจายข้อมูลออกจาก Tuple ไปยังตัวแปรย่อย (Unpacking) ได้อย่างสะดวก

#### 2.1 Multiple Assignment & Unpacking
```python
# Unpacking ข้อมูลพิกัด
point = (3, 4)
x, y = point

# Extended Unpacking ด้วยเครื่องหมาย * (Star expression)
scores = [90, 85, 78, 92, 88]
best, *middle, worst = sorted(scores, reverse=True)
# best = 92, middle = [90, 88, 85], worst = 78
```

#### 2.2 การสลับค่าตัวแปรแบบไพทอนิค (Pythonic Variable Swap)
```python
a = 10
b = 20
a, b = b, a   # สลับค่าโดยไม่ต้องพึ่งพาตัวแปรชั่วคราว temp
```

#### 2.3 การส่งค่ากลับหลายค่าจากฟังก์ชัน
เบื้องหลังของการที่ฟังก์ชันใน Python สามารถส่งค่ากลับได้หลายค่านั้น แท้จริงแล้วคือการ Pack ค่าเหล่านั้นเป็น Tuple หนึ่งตัว
```python
def get_dimensions():
    return 1920, 1080    # ส่งกลับเป็น (1920, 1080)

w, h = get_dimensions()
```

---

### 3. การคัดกรองตัวซ้ำและการนับความถี่ (Duplicate & Frequency Filtering)

#### 3.1 การตัดตัวซ้ำแบบรักษาลำดับเดิม (Stable Deduplication)
หากเราใช้ `list(set(items))` ลำดับดั้งเดิมของข้อมูลอาจสูญหาย ซึ่งจะทำให้ผลลัพธ์ไม่ตรงตามที่ระบบตรวจ OJ ต้องการ วิธีการที่ปลอดภัยและรักษาลำดับดั้งเดิมคือการบันทึกสมาชิกที่เคยพบลงในเซต:

```python
def deduplicate_stable(items):
    seen = set()
    result = []
    for item in items:
        if item not in seen:
            seen.add(item)
            result.append(item)
    return result
```

#### 3.2 การนับความถี่ (Frequency Counting Pattern)
หลีกเลี่ยงการเขียนลูปแล้วเรียก `items.count(x)` ซ้ำ ๆ ในลูป เพราะคำสั่ง `.count()` ทำงานแบบ $O(N)$ เมื่ออยู่ในลูปจะกลายเป็น $O(N^2)$ ซึ่งเสี่ยงต่อการติด Time Limit Exceeded (TLE)

ทางเลือกที่ดีกว่าคือการวนลูปสร้าง Frequency Map (Dictionary หรือ List ตารางนับ):
```python
# การนับความถี่ในรอบเดียว O(N)
counts = {}
for x in items:
    counts[x] = counts.get(x, 0) + 1
```

---

### 4. การเรียงลำดับหลายเงื่อนไข (Multi-Key Sorting with Lambda)

ในโจทย์ที่ต้องจัดการพิกัด เช่น **Point Sorting** เรามักต้องเรียงลำดับข้อมูลตามเงื่อนไขมากกว่าหนึ่งข้อ เช่น:
- เงื่อนไขที่ 1: เรียงแกน $X$ จากน้อยไปมาก
- เงื่อนไขที่ 2: หากค่า $X$ เท่ากัน ให้เรียงแกน $Y$ จากมากไปน้อย

ใน Python ฟังก์ชัน `sorted()` หรือเมท็อด `.sort()` สามารถเปรียบเทียบ Tuple แบบทีละตำแหน่งได้ (Lexicographical Comparison):

```python
points = [(1, 2), (3, 5), (1, 8), (3, 2), (2, 4)]

# เรียง x จากน้อยไปมาก (p[0]) หากเท่ากัน ให้เรียง y จากมากไปน้อย (-p[1])
sorted_points = sorted(points, key=lambda p: (p[0], -p[1]))
print(sorted_points)
```

```text
[(1, 8), (1, 2), (2, 4), (3, 5), (3, 2)]
```

> **เทคนิคสำคัญ**: การใส่เครื่องหมายติดลบ `-` หน้าตัวเลขในฟังก์ชันคีย์ จะกลับทิศทางการเรียงจากน้อยไปมากให้กลายเป็นจากมากไปน้อยเฉพาะแกนนั้นได้ทันที

---

### 5. ลูปคู่ขนานและการระบุลำดับ: `enumerate()` และ `zip()`

- **`enumerate(seq, start=0)`**: คืนคู่ลำดับ `(index, value)` ในแต่ละรอบ เหมาะกับโจทย์ที่ต้องการรู้ตำแหน่งพิกัดไปพร้อมกับค่าข้อมูล
- **`zip(seq_a, seq_b)`**: จับคู่ข้อมูลจากสองลำดับที่มีดัชนีเดียวกันเข้าเป็น Tuple ทีละคู่

```python
names = ["Alice", "Bob", "Charlie"]
scores = [95, 88, 92]

for i, (name, score) in enumerate(zip(names, scores), start=1):
    print(f"อันดับที่ {i}: {name} ได้คะแนน {score}")
```

---

## จุดที่มักพลาด

1. **ลืมใส่ Trailing Comma ใน 1-element Tuple**:
   เขียน `t = ("KMITL")` ผลลัพธ์คือ `str` เมื่อนำไปวนลูปจะกลายเป็นการวนทีละตัวอักษร ไม่ได้วนตามสมาชิก Tuple! ต้องเขียน `t = ("KMITL",)`
2. **แก้ไขสมาชิกใน Tuple**:
   เรียกคำสั่ง `t[0] = 5` ส่งผลให้โปรแกรมหยุดทำงานด้วย `TypeError`
3. **Unpacking Mismatch (จำนวนตัวแปรไม่ตรงกับสมาชิก)**:
   เขียน `x, y = (1, 2, 3)` ทำให้เกิด `ValueError: too many values to unpack` หรือ `not enough values to unpack`
4. **ความซับซ้อนเวลา $O(N^2)$ จากการใช้ `.count()`**:
   การนับความถี่ของสมาชิกทุกตัวด้วย `.count()` ซ้ำในลูปใหญ่ ทำให้เวลาในการประมวลผลเพิ่มขึ้นแบบยกกำลังสอง
5. **แปลงเป็น `set()` แล้วลำดับข้อมูลเปลี่ยน**:
   โจทย์หลายข้อต้องการให้แสดงผลตัวซ้ำตามลำดับที่พบครั้งแรก การใช้ `list(set(data))` ทำให้ข้อมูลเรียงตัวใหม่ ส่งผลให้ผลลัพธ์ผิดพลาด

---

## ทดสอบตัวเอง

### คำถามที่ 1
ชนิดข้อมูลของตัวแปร `a` และ `b` ต่อไปนี้คืออะไร?
```python
a = (100)
b = (100,)
```

<details>
<summary>ดูแนวคิดและเฉลย</summary>

- `a` มีชนิดข้อมูลเป็น `int` เพราะวงเล็บเดี่ยวทำหน้าที่เพียงจัดกลุ่มนิพจน์ทางคณิตศาสตร์
- `b` มีชนิดข้อมูลเป็น `tuple` เพราะมีเครื่องหมายจุลภาค (Comma) กำกับด้านหลังตัวเลข
</details>

### คำถามที่ 2
หากต้องการเรียงลำดับรายชื่อนักเรียน `students = [("Somchai", 80), ("Somsak", 95), ("Somying", 80)]` โดยเรียงคะแนนจากมากไปน้อย หากคะแนนเท่ากันให้เรียงชื่อตามตัวอักษร A-Z ฟังก์ชัน `key` ควรเขียนอย่างไร?

<details>
<summary>ดูแนวคิดและเฉลย</summary>

```python
sorted_students = sorted(students, key=lambda s: (-s[1], s[0]))
```
- `-s[1]` หมายถึงคะแนนติดลบ ทำให้คะแนนมากที่สุดขึ้นมาเป็นอันดับแรก
- `s[0]` หมายถึงชื่อตามลำดับตัวอักษรปกติ (Lexicographical order)
</details>

### คำถามที่ 3
คำสั่ง `a, b, *rest = [1, 2, 3, 4, 5]` จะทำให้ `a`, `b`, และ `rest` มีค่าเป็นอะไร?

<details>
<summary>ดูแนวคิดและเฉลย</summary>

- `a = 1`
- `b = 2`
- `rest = [3, 4, 5]` (ตัวแปรที่นำหน้าด้วย `*` จะรวบรวมสมาชิกที่เหลือทั้งหมดเก็บลงใน List)
</details>

---

## โจทย์ iJudge ประจำสัปดาห์

| รหัส | ชื่อโจทย์ | ความยาก | แท็กเด่น | แนวคิดและจุดเน้นในการฝึกฝน |
|:---:|---|:---:|:---:|---|
| [`oj3381`](/pscp/oj3381-point-sorting) | [Point Sorting](/pscp/oj3381-point-sorting) ⭐ | 2 | `[LEARNING LOGS]` Sorting / Tuples | รับพิกัดจุด $(x, y)$ แล้วจัดเรียงหลายเงื่อนไข: เรียง $x$ น้อยไปมาก หาก $x$ เท่ากันเรียง $y$ มากไปน้อย |
| [`oj3382`](/pscp/oj3382-day08-0-02-backward) | [Day08-0_02-Backward](/pscp/oj3382-day08-0-02-backward) | 0 | Sequences / Reversal | แสดงผลลำดับข้อมูลย้อนกลับจากหลังมาหน้า |
| [`oj3383`](/pscp/oj3383-difference) | [Difference](/pscp/oj3383-difference) | 1 | Sets / Sequences | หาผลต่างของสมาชิกสองชุดข้อมูล และนับจำนวนตัวที่ไม่ปรากฏร่วมกัน |
| [`oj3384`](/pscp/oj3384-pickthem) | [PickThem](/pscp/oj3384-pickthem) | 0 | Lists / Filtering | คัดเลือกเฉพาะสมาชิกที่เป็นเลขคู่ตามเงื่อนไขที่กำหนด |
| [`oj3385`](/pscp/oj3385-busstop-i) | [BusStop I](/pscp/oj3385-busstop-i) | 2 | Simulation / Sorting | จำลองป้ายรถเมล์ รับส่งผู้โดยสารตามความจุสูงสุดและลำดับการถึงที่หมาย |
| [`oj3386`](/pscp/oj3386-duplicate-i) | [Duplicate I](/pscp/oj3386-duplicate-i) ⭐ | 1 | `[LEARNING LOGS]` Frequency / Filtering | ตรวจหาและแสดงรายการตัวเลขที่ปรากฏซ้ำตามลำดับ |
| [`oj3387`](/pscp/oj3387-tuple-s-sad-life) | [Tuple's Sad life](/pscp/oj3387-tuple-s-sad-life) | 1 | Tuples / Formatting | ค้นหาตำแหน่ง Index ของสมาชิกเป้าหมายใน Tuple แล้วพิมพ์ซ้ำเป็นตารางรูปสี่เหลี่ยม |
| [`oj3388`](/pscp/oj3388-113) | [113](/pscp/oj3388-113) | 0 | String Processing | ลบรูปแบบตัวเลข "113" ออกจากข้อความจนกว่าจะไม่มีเหลือ |
| [`oj3389`](/pscp/oj3389-smart-trash-collector) | [Smart Trash Collector](/pscp/oj3389-smart-trash-collector) | 1 | Simulation / Greedy | จัดการการเก็บขยะและตรวจสอบขีดจำกัดความจุของถังขยะอัจฉริยะ |
| [`oj3390`](/pscp/oj3390-array-2d) | [Array 2D ตรวจสอบ](/pscp/oj3390-array-2d) | 1 | 2D Arrays / Indexing | ตรวจสอบค่าในตาราง 2 มิติตามแถวและคอลัมน์ที่กำหนด |
| [`oj3391`](/pscp/oj3391) | [สะสมเหรียญเวทย์มนตร์](/pscp/oj3391) | 2 | Greedy / Simulation | วางแผนเก็บเหรียญตามกฎเพื่อสร้างแต้มคะแนนสูงสุด |
| [`oj3392`](/pscp/oj3392-array) | [Array ฮาเฮ](/pscp/oj3392-array) | 2 | Lists / Math | คำนวณและประมวลผลข้อมูลในอาเรย์ตามสูตรและเงื่อนไขความสัมพันธ์ |
| [`oj3393`](/pscp/oj3393-cave-explorer) | [นักสำรวจถ้ำ (Cave Explorer)](/pscp/oj3393-cave-explorer) | 2 | Traversal / Coordinates | เดินสำรวจเส้นทางในถ้ำตามพิกัดและทิศทางที่ได้รับ |
| [`oj3394`](/pscp/oj3394) | [ส่งต่อ](/pscp/oj3394) ⭐ | 3 | `[LEARNING LOGS]` Simulation / Graph | ติดตามการส่งต่อข้อมูลหรือวัตถุเป็นทอด ๆ และตรวจจับวงรอบ (Cycle Detection) |
| [`oj3395`](/pscp/oj3395) | [เข้าแถว](/pscp/oj3395) | 3 | Sorting / Simulation | จัดแถวตามเกณฑ์ความสูงหรือลำดับเวลาที่กำหนด |
| [`oj3396`](/pscp/oj3396) | [แซงรอบ](/pscp/oj3396) | 3 | Math / Simulation | คำนวณความเร็วและเวลาในการวิ่งแซงรอบของนักกีฬาในสนามวงกลม |
