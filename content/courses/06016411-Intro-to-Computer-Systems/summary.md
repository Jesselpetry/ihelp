---
code: "06016411"
slug: Intro-to-Computer-Systems
shortCode: ICS
nameTh: ระบบคอมพิวเตอร์เบื้องต้น
nameEn: Introduction to Computer Systems
credits: "3 (2-2-5)"
year: 1
term: 1
termId: Y1-S1
prerequisites: []
language: th
tool: Logisim
sources:
  - kmitl-archive/archive/Y1-S1/Intro-to-Computer-Systems
  - kmitl-archive/archive/Y1-S1-2569/Intro-to-Computer-Systems
---

# ICS — ระบบคอมพิวเตอร์เบื้องต้น

## 1. ภาพรวมรายวิชา (ข้อมูลอย่างเป็นทางการจาก IT KMITL)

| หัวข้อ | รายละเอียด |
|---|---|
| **รหัสวิชา** | `06016411` |
| **ชื่อภาษาไทย** | ระบบคอมพิวเตอร์เบื้องต้น |
| **ชื่อภาษาอังกฤษ** | Intro to Computer Systems |
| **หน่วยกิต** | 3 (3-0-6) |
| **ระดับการศึกษา** | ปริญญาตรี |
| **ชั้นปี / ภาคการศึกษา** | ปี 1 เทอม 1 (Y1-S1) |
| **วิชาบังคับก่อน** | ไม่มีวิชาบังคับก่อน |
| **อาจารย์ผู้สอน** | ศ.ดร. สุขสันต์ พาณิชพาพิบูล · ผศ.ดร. สุภกิจ นุตยะสกุล |

### คำอธิบายรายวิชา (Course Description)

> **ภาษาไทย:**  
> ระบบจำนวนระบบฐานสองพีชคณิตบูลีนเทคนิคการออกแบบเชิงดิจิทัล ลอจิกเกตและการลดจำนวน วงจรเชิงผสมเบื้องต้นหน่วยคำนวณและตรรก วิวัฒนาการของคอมพิวเตอร์ องค์ประกอบของระบบคอมพิวเตอร์และการเชื่อมต่อระหว่างกัน วิธีการคำนวณทางคณิตศาสตร์ของเครื่องคอมพิวเตอร์

> **English:**  
> Number systems, binary system, Boolean algebras, digital design techniques, logic gate and minimization, basic combinational circuits, arithmetic logic units, computer evolution, computer function and interconnection, computer arithmetic.


### สัดส่วนคะแนน (สายฮาร์ดแวร์, ตามสไลด์ Chapter 01)

| รายการ | สัดส่วน |
|---|---|
| Quiz (7 ครั้ง) | 15% |
| Lab Quiz (7 ครั้ง) | 15% |
| Final Exam | 10% |
| Lab Exam | 10% |
| *(รวมส่วนที่ระบุในสไลด์ = 50%)* | |

---

## 2. สองสายเนื้อหาในคลัง

| | **สาย A — Digital Logic (ปัจจุบัน, cohort 2569)** | **สาย B — Computer Hardware (คลังปีก่อน)** |
|---|---|---|
| ชื่อไฟล์ | `ICS_Lec_Week01-07…`, `…_v2` | `ICS_Lec_Chapter01-06`, `ICS_Lec_Week0X` (ไม่มี `_v2`) |
| ผู้สอน | ไม่ระบุในสไลด์ (เทมเพลต KMITL) | Asst. Prof. Dr. Supakit Nootyaskool |
| เครื่องมือ | Logisim | Tinkercad, FPGA, ออสซิลโลสโคป |
| แนวข้อสอบ | ออกแบบวงจร ลดรูปสมการ ไทม์ไดอะแกรม | ทฤษฎีอิเล็กทรอนิกส์ + วงจร + คำนวณสัญญาณ |

**ให้ยึดสาย A เป็นหลัก** สำหรับ cohort 2569 — สาย B ใช้เป็นเนื้อหาเสริม/อ้างอิงเชิงลึก

---

## 3. ขอบเขตเนื้อหา

### 3.1 ขอบเขตสอบกลางภาค — สาย A (Week 01–07)

| สัปดาห์ | หัวข้อ | ไฟล์สไลด์ |
|---|---|---|
| 01 | Introduction to Digital Systems | `ICS_Lec_Week01-Introduction.pdf` |
| 02 | Boolean Algebra | `ICS_Lec_Week02-Boolean.pdf` |
| 03 | Canonical Forms (SOP / POS) | `ICS_Lec_Week03-CanonicalForms.pdf` |
| 04 | Boolean Minimization (Karnaugh Map) | `ICS_Lec_Week04-Kmap.pdf` |
| 05 | Time Response / Time Diagram | `ICS_Lec_Week05-TimeResponse.pdf` |
| 06 | Number Systems & Complement | `ICS_Lec_Week06-NumberSystems.pdf` |
| 07 | Multiplexer & Demultiplexer | `ICS_Lec_Week07-MUX.pdf` |

> ข้อสอบเก่าในคลังยืนยันขอบเขตนี้ — `ICS_Midterm_Week-1-7.pdf`

### 3.2 ขอบเขตสอบปลายภาค

คลังยังไม่มีสไลด์ Week 08–15 ของสาย A **หัวข้อด้านล่างมาจากแผนการสอนของสาย B**
(สไลด์ `ICS_Lec_Chapter01.pdf` หน้า 6–8) และเป็นลำดับมาตรฐานของวิชาลักษณะนี้:

| ลำดับ | หัวข้อ | ไฟล์อ้างอิงในคลัง |
|---|---|---|
| 1 | Combinational vs Sequential logic · edge trigger | `ICS_Lec_Chapter04.pdf` |
| 2 | Flip-flop: SR, JK, D, T | `ICS_Lec_Chapter04.pdf` |
| 3 | Latch, Buffer, Tristate gate | `ICS_Lec_Chapter03.pdf` / `Slide03-1.pdf` |
| 4 | Counter — asynchronous vs synchronous, frequency division, FIFO | `ICS_Lec_Chapter04.pdf` |
| 5 | Analog vs digital signal · sampling · quantization · modulation | `ICS_Lec_Chapter04.pdf` |
| 6 | DAC (R-2R, op-amp) และ ADC (Flash, SAR) | `ICS_Lec_Chapter05.pdf` |
| 7 | Memory unit — SRAM, DRAM, ROM/PROM/EPROM/EEPROM | `ICS_Lec_Chapter06.pdf` |
| 8 | ALU · Instruction set และ CPU | ยังไม่มีในคลัง |

---

## 4. สรุปเนื้อหารายหัวข้อ

### Week 01 — Introduction to Digital Systems

- **Analog vs Digital** — analog เป็นสัญญาณต่อเนื่อง; digital เป็นสัญญาณไม่ต่อเนื่อง จำกัดด้วยจำนวนบิตและ sampling rate
- **Digital circuit** และ **logic gate** พื้นฐาน
- **ประเภทวงจรดิจิทัล** — combinational (เอาต์พุตขึ้นกับอินพุตปัจจุบันเท่านั้น) vs sequential (มีสถานะ/หน่วยความจำ)
- **3 วิธีแทนระบบดิจิทัล** ⭐ — Truth Table · Boolean Expression · Schematic Diagram (แปลงไปมาได้ทั้งสามทาง)
- Truth table ของอินพุต n บิต มี 2ⁿ แถว

### Week 02 — Boolean Algebra

- **Basic gates** — AND (`·`), OR (`+`), NOT (`′` / overbar)
- **Other gates** — NAND, NOR, XOR (`⊕`), XNOR
- แปลง Boolean ↔ truth table ↔ schematic
- **Equivalent equations** — สมการต่างรูปแต่ให้ truth table เดียวกัน

**กฎที่ต้องท่อง** ⭐⭐⭐

| กฎ | รูป AND | รูป OR |
|---|---|---|
| Identity | `A · 1 = A` | `A + 0 = A` |
| Null / Dominance | `A · 0 = 0` | `A + 1 = 1` |
| Idempotent | `A · A = A` | `A + A = A` |
| Complement | `A · A′ = 0` | `A + A′ = 1` |
| Involution | `(A′)′ = A` | — |
| Commutative | `AB = BA` | `A + B = B + A` |
| Associative | `A(BC) = (AB)C` | `A + (B + C) = (A + B) + C` |
| Distributive | `A(B + C) = AB + AC` | `A + BC = (A + B)(A + C)` |
| **Absorption** | `A(A + B) = A` | `A + AB = A` |
| **De Morgan** | `(AB)′ = A′ + B′` | `(A + B)′ = A′B′` |
| Useful | `A + A′B = A + B` | `A(A′ + B) = AB` |

### Week 03 — Canonical Forms

- **Minterm** — พจน์ AND ที่มีตัวแปรครบทุกตัว; เขียนย่อ `mᵢ`
- **Sum of Products (SOP)** — `F = Σm(…)` สร้างจากแถวที่เอาต์พุต = 1
- **Maxterm** — พจน์ OR ที่มีตัวแปรครบทุกตัว; เขียนย่อ `Mᵢ`
- **Product of Sums (POS)** — `F = ΠM(…)` สร้างจากแถวที่เอาต์พุต = 0
- **การสลับ SOP ↔ POS** ⭐ — ดัชนีที่ไม่อยู่ใน Σ จะอยู่ใน Π เสมอ
  เช่น 3 ตัวแปร `F = Σm(0,2,5)` ⟺ `F = ΠM(1,3,4,6,7)`
- **Incomplete function** — มี **don't care** (`d` / `X`) ใช้เขียนเป็น `Σm(…) + Σd(…)`

### Week 04 — Boolean Minimization (Karnaugh Map)

- **K-map** — ตารางเรียงด้วย **Gray code** (00, 01, 11, 10) ให้ช่องข้างกันต่างกัน 1 บิต
- ขนาด 2, 3, 4 ตัวแปร; ช่องขอบซ้าย-ขวาและบน-ล่าง **ติดกันแบบวนรอบ**
- **กติกาจับกลุ่ม** ⭐⭐
  1. กลุ่มต้องมีขนาดเป็นกำลังของ 2 (1, 2, 4, 8, 16)
  2. กลุ่มต้องเป็นสี่เหลี่ยม ทับซ้อนกันได้
  3. ทำให้กลุ่มใหญ่ที่สุดและจำนวนกลุ่มน้อยที่สุด
  4. ทุก 1 ต้องถูกคลุมอย่างน้อยหนึ่งกลุ่ม
- **Don't care** ใช้เป็น 1 ได้ถ้าช่วยให้กลุ่มใหญ่ขึ้น ไม่ต้องคลุมถ้าไม่ช่วย
- ได้ **SOP** จากการจับ 1 · ได้ **POS** จากการจับ 0
- **การออกแบบวงจรที่ออกสอบบ่อย** ⭐⭐ — Two-bit Comparator, Two-bit Binary Adder, 3-bit Incrementer, 7-segment decoder

### Week 05 — Time Response / Time Diagram

- **Gate delay (propagation delay)** — เวลาที่สัญญาณใช้ผ่านเกท
- **Time / timing diagram** — วาดเอาต์พุตตามเวลาโดยรวมดีเลย์สะสมของแต่ละชั้น
- **Glitch / hazard** — เอาต์พุตกระตุกชั่วขณะเพราะเส้นทางสัญญาณยาวไม่เท่ากัน
- โจทย์มาตรฐาน: กำหนดวงจร + ดีเลย์ต่อเกท → วาดรูปคลื่นเอาต์พุต

### Week 06 — Number Systems & Complement

- ฐาน 2 / 8 / 10 / 16 และการแปลงไปมา
  - Binary → Hex: จัดกลุ่มละ 4 บิต · Binary → Octal: จัดกลุ่มละ 3 บิต
- **Signed magnitude** — บิตซ้ายสุดเป็นเครื่องหมาย
- **One's complement** — กลับทุกบิต; มีศูนย์สองแบบ (`+0`, `−0`)
  - การบวก: ถ้ามีตัวทด (carry) ออกจากบิตซ้ายสุด ให้บวกกลับเข้าบิตขวาสุด (**end-around carry**)
- **Two's complement** ⭐⭐ — กลับทุกบิตแล้วบวก 1 (หรือ: คงบิตขวาสุดถึง 1 ตัวแรกไว้ แล้วกลับที่เหลือ)
  - ช่วงค่าของ n บิต: `−2ⁿ⁻¹` ถึง `2ⁿ⁻¹ − 1`
  - การบวก: ทิ้งตัวทดที่ล้นออก
- **Overflow** ⭐⭐ — เกิดเมื่อบวกเลขเครื่องหมายเดียวกันแล้วได้ผลลัพธ์เครื่องหมายตรงข้าม
  - ตรวจอีกวิธี: carry เข้าบิตเครื่องหมาย ≠ carry ออกจากบิตเครื่องหมาย

### Week 07 — Multiplexer & Demultiplexer

- **MUX** — เลือก 1 จาก 2ⁿ อินพุต ด้วยสายเลือก n เส้น
  - 2:1 → `Z = S′I₀ + SI₁`
  - 4:1 ใช้สายเลือก 2 เส้น · 8:1 ใช้ 3 เส้น
- **สร้าง MUX ใหญ่จาก MUX เล็ก** — เช่น 8:1 จาก 4:1 สองตัว + 2:1 หนึ่งตัว
- **MUX เป็น logic building block** ⭐⭐ — ฟังก์ชัน n ตัวแปร ทำได้ด้วย MUX ขนาด 2ⁿ:1
  หรือย่อเหลือ 2ⁿ⁻¹:1 โดยให้อินพุตเป็น `0`, `1`, ตัวแปร หรือ complement ของตัวแปร
  (ตัวอย่างที่ออกบ่อย: สร้าง **Full Adder** ด้วย MUX)
- **DEMUX** — กระจาย 1 อินพุตไปยัง 1 ใน 2ⁿ เอาต์พุต; 1:2, 2:4, 3:8
- DEMUX ที่ตรึงอินพุต = 1 ทำหน้าที่เหมือน **decoder**

### หัวข้อหลังกลางภาค (สาย B / ต่อยอด)

**Flip-flop**

| ชนิด | สมการ/พฤติกรรม | จุดที่ออกสอบ |
|---|---|---|
| **SR** | S=1,R=0 → Set · S=0,R=1 → Reset · S=R=1 → **invalid** | ตาราง truth + debounced switch |
| **JK** | J=K=1 → **toggle** (แก้ปัญหา invalid ของ SR) | timing diagram |
| **D** | `Q(next) = D` | สร้างจาก JK โดยต่อ `K = J′` |
| **T** | T=1 → toggle · T=0 → hold | สร้างจาก JK โดยต่อ `J = K = T` |

- **Edge trigger** — rising (positive) / falling (negative) edge
- **Counter** — asynchronous (ripple, มีปัญหาดีเลย์สะสม) vs synchronous (ทุก FF ใช้ clock เดียวกัน)
- **Frequency division** — FF หนึ่งตัวหารความถี่ลงครึ่งหนึ่ง; n ตัว หารด้วย 2ⁿ
- **4-bit latch / FIFO**

**สัญญาณและการแปลง**

- คุณสมบัติสัญญาณ: amplitude, frequency (`f = 1/T`), period, RMS
- **Modulation** — AM / FM
- **ADC 5 ขั้นตอน** ⭐ — (1) รับสัญญาณ analog (2) กำหนดจำนวนระดับ (บิต) (3) กำหนดอัตราสุ่ม (4) แมประดับกับเวลาสุ่ม (5) อ่านค่าออกเป็นดิจิทัล
- **DAC** — voltage divider, **R-2R ladder**, op-amp
- **ADC** — Flash ADC (ตัวต้านทานอนุกรม + encoder เร็วที่สุด แต่ใช้ comparator 2ⁿ−1 ตัว) และ **SAR-ADC** (successive approximation)

**หน่วยความจำ**

- **SRAM** — สร้างจาก D flip-flop เร็ว แพง ไม่ต้อง refresh
- **DRAM** — เก็บประจุใน capacitor ต้อง **refresh** ถูกกว่า ความจุสูงกว่า
- **ROM ตระกูล** — ROM, PROM, EPROM (ลบด้วย UV), EEPROM (ลบด้วยไฟฟ้า), Flash
- Address bus / Data bus / Control bus และการถอดรหัสตำแหน่ง (**decoder circuit**), 7-segment common anode/cathode
- **Parity bit** — even/odd parity สำหรับตรวจจับข้อผิดพลาด 1 บิต
- **ASCII** — `A` = 41H = `1000001`

---

## 5. แล็บ (Logisim)

| Lab | เนื้อหา | ทักษะที่วัด |
|---|---|---|
| 01 | รู้จัก Logisim, สร้าง subcircuit, `myXNOR`, 4-bit comparator | ต่อวงจร ตั้งชื่อพิน อ่าน schematic |
| 02 | ตารางความจริงของ AND/OR/NAND/NOR, `numDecoderV6` + 7-segment, 2-bit adder | ทดลองและบันทึกผล |
| 03 | ลดรูปสมการด้วยพีชคณิตบูลีน (การทดลองย่อย 1.1–1.5) + ออกแบบตัวเปรียบเทียบ 2 บิต | พิสูจน์สมการ + ออกแบบ |
| 04 | K-map 3 ตัวแปร, 4 ตัวแปร, 4 ตัวแปรที่มี don't care, 3-bit incrementer, 2-bit comparator | ลดรูปด้วย K-map และแปลงเป็นวงจร |
| 05 | (ตามคลัง) วงจรลำดับ/ไทม์ไดอะแกรม | — |
| 07 | (ฉบับร่างในคลัง) MUX/DEMUX | — |

---

## 6. พิมพ์เขียวสำหรับสร้างสื่อต่อยอด

### 6.1 คลังข้อสอบ

| มิติ | ข้อกำหนด |
|---|---|
| สัดส่วนกลางภาค | Boolean algebra 20% · Canonical form 15% · K-map 25% · Number system/complement 20% · MUX/DEMUX 15% · Timing 5% |
| ชนิดข้อ | คำนวณ/ออกแบบ 60% · ปรนัย 30% · เติมตาราง 10% |
| รูปแบบโจทย์มาตรฐาน | (1) ให้ truth table → เขียน SOP/POS → ลดรูปด้วย K-map → วาดวงจร<br>(2) ให้สมการ → พิสูจน์เท่ากันด้วยกฎบูลีน<br>(3) ให้เลขฐานสิบ → แปลงเป็น 2's complement n บิต → บวก/ลบ → ตรวจ overflow<br>(4) ให้ฟังก์ชัน → สร้างด้วย MUX ขนาดที่กำหนด<br>(5) ให้วงจร + ดีเลย์ → วาด timing diagram |
| ต้องมีเฉลย | แสดงขั้นตอนกลาง (กลุ่มบน K-map, การกลับบิต) ไม่ใช่แค่คำตอบ |

### 6.2 แบบฝึกหัด/Lab ที่สร้างได้

- **Auto-gradable:** โจทย์แปลงเลขฐาน / 2's complement / ตรวจ overflow — ตรวจด้วย string เทียบตรง ๆ
- **K-map generator:** สุ่ม `Σm(…)` 4 ตัวแปร + don't care แล้วเช็คคำตอบด้วยการเทียบ truth table
- **Logisim challenge:** ให้ spec (เช่น "3-bit even parity generator") ผู้เรียนส่งไฟล์ `.circ`
  ตรวจด้วยการรัน truth table ครบทุกอินพุต
- **Timing diagram:** ให้วงจร + ดีเลย์ ผู้เรียนกรอกค่าเอาต์พุตในแต่ละช่วงเวลา

### 6.3 ข้อสอบจำลอง

- **กลางภาค** 3 ชั่วโมง — ข้อออกแบบวงจร 2 ข้อใหญ่ (comparator/adder) + ลดรูป 2 ข้อ + เลขฐาน 2 ข้อ + MUX 1 ข้อ
- **Lab Exam** — ต่อวงจรใน Logisim ตาม spec ภายในเวลาจำกัด แล้วส่ง `.circ`

---

## 7. แหล่งข้อมูลในคลัง

| ประเภท | จำนวน | หมายเหตุ |
|---|---|---|
| สไลด์บรรยาย | 25 ไฟล์ | มีทั้งสองสาย ระวังไฟล์ซ้ำ (`_v2`) |
| แล็บ | 22 ไฟล์ | มีทั้งโจทย์และฉบับทำแล้ว (`-Completed`) |
| ข้อสอบ/quiz | 25 ไฟล์ | รวมไฟล์ `.circ` ของโจทย์ Logisim |
| แบบฝึกหัด | 2 ไฟล์ | |
| ชีทสรุป | 4 ไฟล์ | `ICS_Sheet_Recap-Boolean.pdf` สรุปกฎบูลีนครบ |
| _Archive | 27 หน้า สแกน Final Graded Quiz Review | ยังไม่ได้ถอดเป็นข้อความ (เป็นรูป) |
