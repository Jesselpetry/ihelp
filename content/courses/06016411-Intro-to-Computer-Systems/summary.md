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
semester: "1/2569"
updated: "2026-09-26"
sources:
  - ประมวลการสอน 1/2569 (ฉบับร่าง รออนุมัติ)
  - สไลด์ Lecture 1–7 ศ.ดร. สุขสันต์ พาณิชพาพิบูล
  - สไลด์ Chapter 1–7 ฉบับ 2569 ผศ.ดร. สุภกิจ นุตยะสกุล
  - ใบงานแล็บ Logisim 01–04 และแล็บต่อวงจร 01–06 (2569)
  - supakit.net/learning/?file=ics
---

# ICS — ระบบคอมพิวเตอร์เบื้องต้น

> ไล่ระบบคอมพิวเตอร์จากชั้นล่างสุดขึ้นไป — ครึ่งแรกเป็นตรรกศาสตร์ดิจิทัลบน Logisim
> ครึ่งหลังเป็นฮาร์ดแวร์จริงบนโพรโทบอร์ดและ FPGA จนถึงการออกแบบซีพียู 4 บิต
>
> **อัปเดตล่าสุด** 26 ก.ย. 2569 · ข้อมูลภาคเรียน 1/2569

## 1. ข้อมูลรายวิชา

| หัวข้อ | รายละเอียด |
|---|---|
| รหัสวิชา | `06016411` |
| ชื่อวิชา | ระบบคอมพิวเตอร์เบื้องต้น · Introduction to Computer Systems |
| หน่วยกิต | 3 (2-2-5) — บรรยาย 2 · ปฏิบัติ 2 · ศึกษาด้วยตนเอง 5 |
| ชั้นปี / ภาคเรียน | ปี 1 ภาคเรียนที่ 1 |
| วิชาบังคับก่อน | ไม่มี |
| ผู้สอน (1/2569) | ครั้งที่ 1–7 ศ.ดร. สุขสันต์ พาณิชพาพิบูล (ดิจิทัลลอจิก) · ครั้งที่ 8–15 ผศ.ดร. สุภกิจ นุตยะสกุล (ฮาร์ดแวร์) |
| ตำรา / สื่อหลัก | ผศ.ดร. สุภกิจ นุตยะสกุล, *Introduction to Computer System* v0.5 (ฉบับร่าง เอกสารประกอบ ไม่ใช่ตำราบังคับ) · อ้างอิง: Katz & Borriello, *Contemporary Logic Design* · Hamacher et al., *Computer Organization and Embedded System* |
| ช่องทางเรียน | ครึ่งแรก Logisim (ส่งไฟล์ `.circ`) · ครึ่งหลัง มัลติมิเตอร์ ออสซิลโลสโคป โพรโทบอร์ด Tinkercad บอร์ด FPGA Basys2 · วิดีโอบรรยายครึ่งหลัง 35 คลิป |

### คำอธิบายรายวิชา

วิชานี้**แบ่งเป็นสองครึ่งที่ออกสอบเท่ากัน** ครึ่งแรกคือ**ตรรกศาสตร์ดิจิทัล** — สัญญาณ analog/digital,
logic gate, พีชคณิตบูลีน, SOP/POS, K-map, ไทม์ไดอะแกรม, ระบบเลขและ complement, MUX/DEMUX
ครึ่งหลังคือ**ฮาร์ดแวร์คอมพิวเตอร์** — บัส, parity, decoder, latch/buffer/tristate, flip-flop และตัวนับ,
ADC/DAC, หน่วยความจำ ปิดท้ายด้วย ALU และซีพียู 4 บิต ข้ามครึ่งใดครึ่งหนึ่งคือทิ้งคะแนนครึ่งวิชา

### สัดส่วนคะแนน (ประมวลการสอน + สไลด์ Chapter 1, 1/2569)

| ช่วง | รายการ | สัดส่วน |
|---|---|---:|
| ครึ่งแรก (ครั้งที่ 1–7) | สอบกลางภาค | 50% |
| ครึ่งหลัง (ครั้งที่ 8–15) | Quiz ในคาบบรรยาย (ทุกสัปดาห์) | 15% |
| | งานแล็บ 1–5 | 10% |
| | Lab Exam | 15% |
| | สอบปลายภาค | 10% |

> ประมวลการสอน 1/2569 ยังเป็น**ฉบับร่างรออนุมัติ** — สไลด์รุ่นก่อนเคยสลับน้ำหนักงานแล็บกับสอบแล็บ
> (Lab Quiz 15% · Lab Exam 10%) ให้ยึดประกาศในคาบเรียน

### วันสำคัญ

| วัน | กิจกรรม |
|---|---|
| 9 และ 16 ต.ค. 2569 | Lab Exam ครึ่งหลัง (สุ่มหมายเลขข้อสอบ 1–20) |
| วันสอบกลางภาค / ปลายภาค | *ยังไม่ยืนยัน* — ดูประกาศตารางสอบของสถาบัน |

## 2. ขอบเขตเนื้อหา

### 2.1 ขอบเขตสอบกลางภาค — ครึ่งแรก ดิจิทัลลอจิก (Week 01–07)

| สัปดาห์ | หัวข้อ | แล็บ (Logisim) |
|---|---|---|
| 01 | Introduction to Digital Systems | Lab 01 — รู้จัก Logisim, subcircuit, 4-bit comparator |
| 02 | Boolean Algebra | Lab 02 — ลอจิกเกท, 7-segment decoder, 2-bit adder |
| 03 | Canonical Forms (SOP / POS) | Lab 03 — ลดรูปด้วยพีชคณิตบูลีน, ตัวเปรียบเทียบ 2 บิต |
| 04 | Boolean Minimization (Karnaugh Map) | Lab 04 — K-map 3–4 ตัวแปร + don't care, 3-bit incrementer |
| 05 | Time Response / Time Diagram | — |
| 06 | Number Systems & Complement | — |
| 07 | Multiplexer & Demultiplexer | — |

### 2.2 ขอบเขตสอบปลายภาค — ครึ่งหลัง ฮาร์ดแวร์ (ครั้งที่ 8–15)

| บท | หัวข้อ | แล็บ (ต่อวงจรจริง) |
|---|---|---|
| 1 | ภาพรวมระบบคอมพิวเตอร์ · วิวัฒนาการฮาร์ดแวร์ | Lab 01 — มัลติมิเตอร์ อ่านค่า ไล่สาย บัดกรี |
| 2 | Memory & I/O addressing — bus, parity, decoder, 7-segment | Lab 02 — ฟังก์ชันเจเนอเรเตอร์ ออสซิลโลสโคป low-pass filter |
| 3 | Latch, Buffer, Tristate gate · SR flip-flop | Lab 03 — อุปกรณ์บนโพรโทบอร์ด ตัวต้านทาน LED หน่วงเวลา RC |
| 4 | Flip-flop SR/JK/D/T · Counter · FIFO · ADC ตอนที่ 1 | Lab 04 — RC ring oscillator จาก 74LS04 |
| 5 | DAC (R-2R, op-amp) และ ADC (Flash, SAR) | Lab 05 — มัลติเพล็กเซอร์จาก universal gate (IC 7400) |
| 6 | Memory unit — SRAM, DRAM, ROM/PROM/EPROM/EEPROM | Lab 06 — วงจรบนบอร์ด FPGA Basys2 |
| 7 | ALU · Instruction set · ซีพียู 4 บิต | Lab Exam |

> ข้อสอบปลายภาคออกเฉพาะเนื้อหาครึ่งหลัง

### 2.3 แยกสไลด์สองชุดให้ออก

| | ครึ่งแรก — Digital Logic | ครึ่งหลัง — Computer Hardware |
|---|---|---|
| หน้าปก | แถบน้ำเงิน KMITL เขียนว่า *"Lecture N"* | พื้นขาว *"ChapterN:"* พร้อมชื่อ ผศ.ดร. สุภกิจ |
| หัวใบงาน | *การปฏิบัติการที่ N* — ทำใน Logisim ส่ง `.circ` | *การทดลองที่ N* — ต่อบนโพรโทบอร์ด TA เซ็นในคาบ |
| แนวข้อสอบ | ออกแบบวงจร ลดรูปสมการ ไทม์ไดอะแกรม | ทฤษฎีวงจร/สัญญาณ + คำนวณ + โครงสร้างซีพียู |

## 3. สรุปเนื้อหารายหัวข้อ

**ครึ่งแรก — ดิจิทัลลอจิก (กลางภาค)**

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

**ครึ่งหลัง — ฮาร์ดแวร์คอมพิวเตอร์ (ปลายภาค)**

### บทที่ 2 — Memory & I/O Addressing

- Address bus / Data bus / Control bus และการถอดรหัสตำแหน่ง (**decoder circuit**)
- 7-segment แบบ common anode / common cathode
- **Parity bit** — even/odd parity สำหรับตรวจจับข้อผิดพลาด 1 บิต
- **ASCII** — `A` = 41H = `1000001`

### บทที่ 3–4 — Latch, Flip-flop และ Counter

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

### บทที่ 4–5 — สัญญาณ ADC และ DAC

- คุณสมบัติสัญญาณ: amplitude, frequency (`f = 1/T`), period, RMS
- **Modulation** — AM / FM
- **ADC 5 ขั้นตอน** ⭐ — (1) รับสัญญาณ analog (2) กำหนดจำนวนระดับ (บิต) (3) กำหนดอัตราสุ่ม (4) แมประดับกับเวลาสุ่ม (5) อ่านค่าออกเป็นดิจิทัล
- **DAC** — voltage divider, **R-2R ladder**, op-amp
- **ADC** — Flash ADC (ตัวต้านทานอนุกรม + encoder เร็วที่สุด แต่ใช้ comparator 2ⁿ−1 ตัว) และ **SAR-ADC** (successive approximation)

### บทที่ 6 — Memory Unit

- **SRAM** — สร้างจาก D flip-flop เร็ว แพง ไม่ต้อง refresh
- **DRAM** — เก็บประจุใน capacitor ต้อง **refresh** ถูกกว่า ความจุสูงกว่า
- **ROM ตระกูล** — ROM, PROM, EPROM (ลบด้วย UV), EEPROM (ลบด้วยไฟฟ้า), Flash

### บทที่ 7 — ALU และซีพียู 4 บิต

- ALU · instruction set · แผนผังซีพียู 4 บิต — ใช้ต่อยอดทุกบทก่อนหน้า (บัส หน่วยความจำ ตัวนับ)

## 4. สิ่งที่ต้องจำ

| เรื่อง | ค่าที่ต้องจำ |
|---|---|
| Truth table | อินพุต n บิต มี 2ⁿ แถว |
| De Morgan | `(AB)′ = A′ + B′` · `(A + B)′ = A′B′` |
| Absorption | `A(A + B) = A` · `A + AB = A` · `A + A′B = A + B` |
| SOP ↔ POS | ดัชนีที่ไม่อยู่ใน Σm อยู่ใน ΠM — `Σm(0,2,5)` ⟺ `ΠM(1,3,4,6,7)` (3 ตัวแปร) |
| K-map | Gray code 00 01 11 10 · กลุ่มขนาด 1/2/4/8/16 · ขอบวนรอบ |
| 2's complement | กลับบิต + 1 · ช่วงค่า n บิต `−2ⁿ⁻¹` ถึง `2ⁿ⁻¹ − 1` |
| Overflow | บวกเลขเครื่องหมายเดียวกันแล้วได้เครื่องหมายตรงข้าม |
| MUX | 2ⁿ:1 ใช้สายเลือก n เส้น · 2:1 → `Z = S′I₀ + SI₁` |
| Flip-flop | JK: J=K=1 toggle · D: `Q(next) = D` · T: T=1 toggle · SR: S=R=1 invalid |
| หารความถี่ | flip-flop n ตัว หารด้วย 2ⁿ |
| Flash ADC | ใช้ comparator 2ⁿ − 1 ตัว |
| สัญญาณ | `f = 1/T` |

## 5. การประเมินและเตรียมสอบ

### 5.1 รูปแบบการประเมิน

- **กลางภาค (50%)** — ครึ่งแรกทั้งหมด เน้นออกแบบวงจร ลดรูปสมการ เลขฐาน และไทม์ไดอะแกรม
- **Quiz ในคาบ (15%)** — ทุกสัปดาห์ของครึ่งหลัง
- **งานแล็บ 1–5 (10%)** — แล็บครึ่งหลังให้ TA เซ็นในคาบ · อุปกรณ์ที่ต้องเตรียมอยู่ในรายการอุปกรณ์แล็บ 2569
- **Lab Exam (15%)** — สุ่มหมายเลขข้อสอบ 1–20 แล้วต่อวงจรในเวลาจำกัด
- **ปลายภาค (10%)** — ครึ่งหลัง: ทฤษฎีวงจร/สัญญาณ คำนวณ และโครงสร้างซีพียู

### 5.2 หัวข้อที่ออกบ่อย

1. กฎพีชคณิตบูลีน โดยเฉพาะ Absorption และ De Morgan
2. 3 วิธีแทนระบบดิจิทัล — truth table · Boolean expression · schematic
3. แปลง SOP ↔ POS
4. จับกลุ่ม K-map พร้อม don't care
5. ออกแบบ comparator / adder / incrementer / 7-segment decoder
6. 2's complement และการตรวจ overflow
7. สร้างฟังก์ชันด้วย MUX (เช่น Full Adder)
8. Flip-flop SR/JK/D/T และ timing diagram
9. ADC 5 ขั้นตอน · R-2R DAC
10. SRAM vs DRAM

### 5.3 จุดที่มักพลาด

- SR flip-flop: S = R = 1 คือ**สถานะต้องห้าม** ไม่ใช่ toggle
- One's complement ต้อง**บวกตัวทดวนกลับ** (end-around carry) ส่วน two's complement **ทิ้ง**ตัวทด
- Don't care ใช้เป็น 1 เมื่อช่วยให้กลุ่มใหญ่ขึ้นเท่านั้น ไม่จำเป็นต้องคลุม
- ช่องขอบ K-map ติดกันแบบวนรอบ — ลืมแล้วได้กลุ่มเล็กเกินจำเป็น
- ชื่อไฟล์สไลด์บางไฟล์ไม่ตรงเนื้อหา — ดูหน้าปกหรือใช้มุมมองรายสัปดาห์ในคลังเรียนรู้

## 6. แหล่งเรียนรู้

| สื่อ | ที่อยู่ |
|---|---|
| สไลด์และใบงานทั้งสองครึ่ง แยกรายสัปดาห์ | [คลังเรียนรู้](/courses/06016411-Intro-to-Computer-Systems/library) |
| แผนที่เนื้อหารายสัปดาห์ | [แผนที่เนื้อหา](/courses/06016411-Intro-to-Computer-Systems/map) |
| คู่มือทบทวน | [คู่มือทบทวน](/courses/06016411-Intro-to-Computer-Systems/summary) |
| แบบฝึกหัดรายบท | [คลังโจทย์รายบท](/courses/06016411-Intro-to-Computer-Systems/quiz) |
| ข้อสอบอัตนัยพร้อมเฉลยทีละขั้น | [ข้อสอบจำลอง](/courses/06016411-Intro-to-Computer-Systems/mock) |
| วิดีโอบรรยายและสาธิตแล็บครึ่งหลัง | [YouTube @SupakitNootyaskool](https://www.youtube.com/@SupakitNootyaskool) |
| เอกสารครึ่งหลังจากผู้สอน | [supakit.net](https://supakit.net/learning/?file=ics) |

> สไลด์บรรยายและตำราเป็นลิขสิทธิ์ของผู้สอน — ใช้เพื่อการเรียนเท่านั้น
