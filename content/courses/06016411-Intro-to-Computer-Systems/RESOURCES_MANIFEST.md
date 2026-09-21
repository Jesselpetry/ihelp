# ICS · ทะเบียนสื่อการเรียน (RESOURCES MANIFEST)

**วิชา 06016411 ระบบคอมพิวเตอร์เบื้องต้น · 120 ไฟล์คลังเดิม (กักกัน PII 9 ไฟล์ / คงเหลือเผยแพร่ 111 ไฟล์) · ปรับปรุง 21 ก.ย. 2569**

เอกสารนี้คือ **ทะเบียนถาวร** ของสื่อทุกชิ้นในชั้นวาง ICS
เขียนขึ้นเพื่อให้คนที่มาทำงานต่อ **ไม่ต้องเปิดไฟล์ดิบมาไล่วิเคราะห์ใหม่**

ทุกบรรทัดในตารางสไลด์ด้านล่าง **ยืนยันด้วยการเรนเดอร์หน้าปกของไฟล์นั้นจริง**
ไม่ได้เดาจากชื่อไฟล์ — เพราะชื่อไฟล์ในคลังนี้เชื่อไม่ได้ทั้งหมด (ดูหัวข้อ 5)

---

## 1. วิชานี้มีสองสาย — เรื่องสำคัญที่สุดในเอกสารนี้

ประมวลการสอนฉบับ 1/2569 (`ics-ref-syllabus-2569.pdf`) ระบุว่า 06016411
**แบ่งผู้สอนคนละครึ่งเทอม** ไม่ใช่สไลด์สองชุดที่แข่งกัน

|             | **สาย A — Digital Logic**                                      | **สาย B — Computer Hardware**                                                             |
| ----------- | -------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| ครั้งที่    | 1–7                                                            | 8–15                                                                                      |
| ผู้สอน      | อ. Sooksan Panichpapiboon                                      | ผศ.ดร.สุภกิจ นุตยะสกุล                                                                    |
| สอบ         | **กลางภาค 50%**                                                | **ปลายภาค 50%**                                                                           |
| หน้าปกสไลด์ | เทมเพลตแถบน้ำเงิน KMITL เขียนว่า _"Lecture N"_ ไม่มีชื่อผู้สอน | พื้นขาว เขียนว่า _"ChapterN:"_ พร้อมชื่อ Asst.Prof.Dr.Supakit Nootyaskool และเลขไทยลายน้ำ |
| เครื่องมือ  | Logisim                                                        | ออสซิลโลสโคป · Tinkercad · FPGA                                                           |
| หัวข้อ      | บูลีน · canonical form · K-map · timing · เลขฐาน · MUX         | บัส/แอดเดรส · flip-flop · counter · ADC/DAC · หน่วยความจำ · ALU/CPU                       |

**วิธีแยกเร็วที่สุด:** เปิดหน้าแรก ถ้ามีแถบสีน้ำเงินด้านบนคือสาย A
ถ้าเป็นพื้นขาวมีชื่อ อ.สุภกิจ คือสาย B

> ⚠️ [`summary.md` หัวข้อ 2](summary.md) ยังเขียนว่าสองชุดนี้คือ "สาย A (ปัจจุบัน)"
> กับ "สาย B (คลังปีก่อน)" แล้วแนะนำให้ยึดสาย A เป็นหลัก — **ขัดกับประมวลการสอน**
> ทำตามคำแนะนำนั้นคือข้ามเนื้อหาครึ่งเทอม ยังไม่ได้แก้เพราะ `summary.md` ดูแลด้วยมือ

---

## 2. หลักการตั้งชื่อไฟล์ที่ใช้อยู่จริง

ชื่อไฟล์ในคลังนี้ **เป็น kebab-case มาตรฐานอยู่แล้ว** ตาม
[`docs/DROPZONE_SOP.md`](../../../docs/DROPZONE_SOP.md) เฟส 3:

```
public/assets/<namespace>/<subject>/<category>/<subject>-<doctype>-<topic>.<ext>
public/assets/it-kmitl/ics/lectures/ics-lec-chapter04-counter-adc-2569.pdf
```

`<doctype>` ที่ใช้ได้: `lec` `sheet` `ex` `hw` `lab` `quiz` `note` `ref` `midterm` `final` `archive`

**ข้อควรรู้สามข้อก่อนคิดจะเปลี่ยนชื่อไฟล์:**

1. **สี่ระดับเท่านั้น** — `scripts/build-library-manifest.mjs` ข้ามไฟล์ที่ path ตื้นกว่านี้
   ไฟล์จะอยู่บนดิสก์แต่ไม่ขึ้นใน UI เลย
2. **ชื่อไฟล์คือ object key บน Supabase Storage** — เปลี่ยนชื่อ = ลิงก์เดิมตาย
   และของเก่าค้างอยู่ใน bucket จนกว่าจะลบมือ
3. **ขอบเขตสอบเป็น metadata ไม่ใช่โฟลเดอร์** — ห้ามสร้าง `midterm/` หรือ `final/`
   ใช้ฟิลด์ `scope` ใน `lib/subject-library.ts`

> ชื่อที่เห็นในหน้าเว็บ เช่น "Lecture · Chapter 02 V 2" **ไม่ใช่ชื่อไฟล์**
> แต่เป็นข้อความที่ `titleFrom()` สร้างจากชื่อไฟล์ `ics-lec-chapter02-v2.pdf`
> อีกที ไฟล์ที่มี entry ใน `lib/subject-library.ts` จะใช้ชื่อไทยที่เขียนมือแทน

---

## 3. ทะเบียนสไลด์บรรยาย (`lectures/` · 39 ไฟล์)

สถานะ: **หลัก** = ใช้อ่านสอบ · **สำรอง** = ฉบับย่อ/ต่างรุ่น เก็บไว้เทียบ ·
**เก่า** = ฉบับปีก่อน · **ซ้ำ** = เนื้อหาตรงกับไฟล์อื่น · **ชื่อผิด** = ชื่อไม่ตรงเนื้อหา (แก้ด้วย metadata ใน subject-library.ts)

| ไฟล์                                              | หน้า |    ขนาด | สาย | สถานะ   | curated | คำอธิบาย                                                                                                                                                                       | แท็ก                                               |
| ------------------------------------------------- | ---: | ------: | --- | ------- | :-----: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------- |
| `ics-lec-week01-introduction.pdf`                 |   12 | 1008 KB | A   | หลัก    |   ✅    | หน้าปก _Introduction to Computer Systems · Lecture 1_ เทมเพลต KMITL — เปิดวิชา อธิบาย analog vs digital, logic gate, และ 3 วิธีแทนระบบดิจิทัล (`scope: midterm`, `chapter: 1`) | `Digital Systems` `Logic Gate`                     |
| `ics-lec-week01-v2.pdf`                           |   12 |  463 KB | A   | ซ้ำ     |    —    | ไฟล์เดียวกับ `week01-introduction` คนละรอบบีบอัด (12 หน้าเท่ากัน)                                                                                                              | `Digital Systems`                                  |
| `ics-lec-week02-boolean-algebra.pdf`              |   23 |  253 KB | A   | หลัก    |   ✅    | หน้าปก _Boolean Algebra · Lecture 2_ — กฎพีชคณิตบูลีน De Morgan การแปลงสมการ↔ตารางความจริง↔วงจร (`scope: midterm`, `chapter: 2`)                                               | `Boolean Algebra` `De Morgan`                      |
| `ics-lec-week02-boolean.pdf`                      |   23 |  402 KB | A   | ซ้ำ     |    —    | เนื้อหาเดียวกับ `week02-v2` ทุกหน้า (RMSE 0.0000)                                                                                                                              | `Boolean Algebra`                                  |
| `ics-lec-week02-v2.pdf`                           |   23 |  672 KB | A   | ซ้ำ     |    —    | เนื้อหาเดียวกับ `week02-boolean` ทุกหน้า                                                                                                                                       | `Boolean Algebra`                                  |
| `ics-lec-week03-canonical-forms.pdf`              |   15 |  205 KB | A   | หลัก    |   ✅    | หน้าปก _Canonical Forms · Lecture 3_ — minterm/maxterm, SOP/POS, don't care (`scope: midterm`, `chapter: 3`)                                                                   | `Canonical Forms` `SOP/POS` `Minterm`              |
| `ics-lec-week03-canonical-forms-y1-s1.pdf`        |   16 |  416 KB | A   | สำรอง   |    —    | _Canonical Forms · Lecture 3_ ฉบับ 16 หน้า ต่างจากฉบับหลัก 1 หน้า                                                                                                              | `Canonical Forms`                                  |
| `ics-lec-week03-v2.pdf`                           |   16 |  540 KB | A   | ซ้ำ     |    —    | เท่ากับ `week03-canonical-forms-y1-s1` (16 หน้า หน้าปกตรงกัน)                                                                                                                  | `Canonical Forms`                                  |
| `ics-lec-week04-boolean-minimization.pdf`         |    3 |   55 KB | A   | หลัก    |   ✅    | หน้าปก _Boolean Minimization · Lecture 4_ ฉบับย่อ 3 หน้า (`scope: midterm`, `chapter: 4`)                                                                                      | `K-Map` `Minimization`                             |
| `ics-lec-week04-kmap.pdf`                         |   25 |  434 KB | A   | หลัก    |    —    | _Boolean Minimization · Lecture 4_ ฉบับเต็ม 25 หน้า — กติกาจับกลุ่ม K-map, don't care, ออกแบบวงจร                                                                              | `K-Map` `Gray Code` `Minimization`                 |
| `ics-lec-week04-v2.pdf`                           |   25 |  768 KB | A   | ซ้ำ     |    —    | เกือบเท่ากับ `week04-kmap` (หน้าปกตรงกัน ต่างกันกลางเล่มเล็กน้อย)                                                                                                              | `K-Map`                                            |
| `ics-lec-week05-time-response.pdf`                |    6 |  232 KB | A   | หลัก    |   ✅    | หน้าปก _Time Diagram · Lecture 5_ — gate delay, timing diagram, glitch/hazard (`scope: midterm`, `chapter: 5`)                                                                 | `Timing` `Propagation Delay` `Glitch`              |
| `ics-lec-week05-v2.pdf`                           |    5 |  157 KB | A   | สำรอง   |    —    | _Time Diagram · Lecture 5_ ฉบับย่อ 5 หน้า                                                                                                                                      | `Timing`                                           |
| `ics-lec-week06-number-systems.pdf`               |   11 |  260 KB | A   | หลัก    |   ✅    | หน้าปก _Number Systems · Lecture 6_ — ฐาน 2/8/10/16, 1's & 2's complement, overflow (`scope: midterm`, `chapter: 6`)                                                           | `Number Systems` `2's Complement` `Overflow`       |
| `ics-lec-week06-v2.pdf`                           |   12 |   99 KB | A   | สำรอง   |    —    | _Number Systems · Lecture 6_ ฉบับ 12 หน้า                                                                                                                                      | `Number Systems`                                   |
| `ics-lec-week07-mux.pdf`                          |   18 |  375 KB | A   | หลัก    |   ✅    | หน้าปก _Multiplexer & Demultiplexer · Lecture 7_ — MUX เป็น logic building block, full adder ด้วย MUX (`scope: midterm`, `chapter: 7`)                                         | `MUX` `DEMUX` `Decoder`                            |
| `ics-lec-week07.pdf`                              |   18 |  288 KB | A   | ซ้ำ     |    —    | หน้าปก _Multiplexer & Demultiplexer · Lecture 7_ เหมือน `week07-mux` (18 หน้าเท่ากัน)                                                                                          | `MUX` `DEMUX`                                      |
| `ics-lec-chapter01-computer-system-2569.pdf`      |   55 | 2078 KB | B   | หลัก    |   ✅    | _Chapter1: Computer System_ ฉบับ 2569 — หน้า 1–11 เป็นแนวการสอน ที่เหลือเป็นวิวัฒนาการฮาร์ดแวร์และการผลิตชิป (`scope: final`, `chapter: 1`)                                    | `Course Plan` `Computer Evolution` `Semiconductor` |
| `ics-lec-chapter02-memory-io-addressing-2569.pdf` |   49 | 2381 KB | B   | หลัก    |   ✅    | _Chapter2: Memory, I/O addressing_ ฉบับ 2569 — parity, ASCII, address/data bus, decoder, 7-segment (`scope: final`, `chapter: 2`)                                              | `Address Bus` `Parity` `Decoder` `7-Segment`       |
| `ics-lec-chapter03-mux-latch-buffer-2569.pdf`     |   39 |  998 KB | B   | หลัก    |   ✅    | _Chapter3: Multiplexer, Latch, Buffer_ ฉบับ 2569 (ประทับ Update 2026-09-14) — tristate, latch vs buffer, SR flip-flop (`scope: final`, `chapter: 3`)                           | `MUX` `Latch` `Tristate` `SR Flip-Flop`            |
| `ics-lec-chapter04-counter-adc-2569.pdf`          |   59 |  991 KB | B   | หลัก    |   ✅    | _Chapter4: Counter and DAC & ADC Part-I_ ฉบับ 2569 — flip-flop SR/JK/D/T, ตัวนับ, หารความถี่, ADC 5 ขั้น (`scope: final`, `chapter: 4`)                                        | `Flip-Flop` `Counter` `ADC` `FIFO`                 |
| `ics-lec-chapter05-dac-adc-part2-2569.pdf`        |   32 |  858 KB | B   | หลัก    |   ✅    | _Chapter5: DAC and ADC Part-II_ ฉบับ 2569 — R-2R ladder, op-amp DAC, flash ADC, SAR (`scope: final`, `chapter: 5`)                                                             | `DAC` `ADC` `R-2R` `SAR`                           |
| `ics-lec-chapter06-memory-circuit-2569.pdf`       |   26 |  663 KB | B   | หลัก    |   ✅    | _Chapter6: Memory unit_ ฉบับ 2569 — SRAM, DRAM, ROM/PROM/EPROM/EEPROM (`scope: final`, `chapter: 6`)                                                                           | `SRAM` `DRAM` `ROM`                                |
| `ics-lec-chapter07-alu-cpu-2569.pdf`              |   40 |  610 KB | B   | หลัก    |   ✅    | _Chapter 7: ALU and CPU creation_ ฉบับ 2569 — ALU, รีจิสเตอร์, ชุดคำสั่ง, แผนผังซีพียู 4 บิต (`scope: final`, `chapter: 7`)                                                    | `ALU` `CPU` `Instruction Set`                      |
| `ics-lec-chapter01.pdf`                           |   37 | 1308 KB | B   | เก่า    |   ✅    | หน้าปก _Introduction to Computer System_ โดย อ.สุภกิจ — ฉบับปีก่อนของ Chapter 1 (`scope: final`, `chapter: 1`)                                                                 | `Computer Evolution`                               |
| `ics-lec-chapter02-v2.pdf`                        |   48 | 2020 KB | B   | เก่า    |   ✅    | หน้าปก _Chapter2: Memory, I/O addressing_ — ฉบับปีก่อน (`scope: final`, `chapter: 2`)                                                                                          | `Address Bus` `Decoder`                            |
| `ics-lec-chapter03.pdf`                           |   24 | 1170 KB | B   | เก่า    |   ✅    | หน้าปก _Chapter3: Multiplexer, Latch, Buffer_ ฉบับ 24 หน้า (`scope: final`, `chapter: 3`)                                                                                      | `MUX` `Latch`                                      |
| `ics-lec-chapter04.pdf`                           |   47 | 1718 KB | B   | เก่า    |   ✅    | หน้าปก _Chapter4: Counter and DAC & ADC Part-I_ ฉบับ 47 หน้า (`scope: final`, `chapter: 4`)                                                                                    | `Flip-Flop` `Counter`                              |
| `ics-lec-chapter04-v2.pdf`                        |   57 |  896 KB | B   | เก่า    |   ✅    | หน้าปก _Chapter4: Counter and DAC & ADC Part-I_ ฉบับ 57 หน้า (`scope: final`, `chapter: 4`)                                                                                    | `Flip-Flop` `Counter` `ADC`                        |
| `ics-lec-chapter05.pdf`                           |   27 |  697 KB | B   | เก่า    |   ✅    | หน้าปก _Chapter5: DAC and ADC Part-II_ ฉบับ 27 หน้า (`scope: final`, `chapter: 5`)                                                                                             | `DAC` `ADC`                                        |
| `ics-lec-slide03-1.pdf`                           |   39 |  908 KB | B   | ซ้ำ     |   ✅    | หน้าปก _Chapter3: Multiplexer, Latch, Buffer_ (`scope: final`, `chapter: 3`)                                                                                                   | `MUX` `Latch`                                      |
| `ics-lec-basic-computer-knowledge-computer.pdf`   |   40 | 2311 KB | B   | เสริม   |   ✅    | _Basic computer knowledge and computer evolution_ โดย อ.สุภกิจ ลงวันที่ 10 ส.ค. 2022 — เอกสารเสริมนอกลำดับบท (`scope: final`)                                                  | `Computer Evolution`                               |
| `ics-lec-week01.pdf`                              |   42 | 2289 KB | B   | ชื่อผิด |   ✅    | หน้าปกคือ **Chapter1: Computer System** ของ อ.สุภกิจ — แมปเป็น `scope: final`, `chapter: 1` ใน subject-library.ts                                                              | `Computer Evolution`                               |
| `ics-lec-week02.pdf`                              |   48 | 2025 KB | B   | ชื่อผิด |   ✅    | หน้าปกคือ **Chapter2: Memory, I/O addressing** — แมปเป็น `scope: final`, `chapter: 2` ใน subject-library.ts                                                                    | `Address Bus` `Decoder`                            |
| `ics-lec-week03.pdf`                              |   39 |  892 KB | B   | ชื่อผิด |   ✅    | หน้าปกคือ **Chapter3: Multiplexer, Latch, Buffer** — แมปเป็น `scope: final`, `chapter: 3` ใน subject-library.ts                                                                | `MUX` `Latch`                                      |
| `ics-lec-week04.pdf`                              |   58 | 1015 KB | B   | ชื่อผิด |   ✅    | หน้าปกคือ **Chapter4: Counter and DAC & ADC Part-I** — แมปเป็น `scope: final`, `chapter: 4` ใน subject-library.ts                                                              | `Flip-Flop` `Counter`                              |
| `ics-lec-week05.pdf`                              |   32 |  707 KB | B   | ชื่อผิด |   ✅    | หน้าปกคือ **Chapter5: DAC and ADC Part-II** — แมปเป็น `scope: final`, `chapter: 5` ใน subject-library.ts                                                                       | `DAC` `ADC`                                        |
| `ics-lec-week06.pdf`                              |   25 |  640 KB | B   | ชื่อผิด |   ✅    | หน้าปกคือ **Chapter6: Memory unit** — แมปเป็น `scope: final`, `chapter: 6` ใน subject-library.ts                                                                               | `SRAM` `DRAM` `ROM`                                |
| `ics-lec-chapter02.pdf`                           |   12 | 1029 KB | —   | ผิดหมวด |   ✅    | **ไม่ใช่สไลด์** — เป็นหน้าที่สแกนจากตำราปี 2015 แมปเป็น `category: reference` (ไม่ระบุ scope เพื่อเข้าถึงได้ตลอดเทอม)                                                          | `Textbook Excerpt` `Address Bus`                   |

---

## 4. ทะเบียนใบงานแล็บ (`labs/` · 35 ไฟล์)

แล็บก็แยกสองสายเหมือนสไลด์ และ **หัวกระดาษใช้คำต่างกัน** ซึ่งเป็นวิธีแยกที่เร็วที่สุด:

|            | **สาย A — Logisim**                                 | **สาย B — ต่อวงจรจริง**                                                 |
| ---------- | --------------------------------------------------- | ----------------------------------------------------------------------- |
| หัวกระดาษ  | `การปฏิบัติการที่ N` + โลโก้ IT KMITL สีส้ม/น้ำเงิน | `การทดลองที่ N` + ท้ายกระดาษ `IT-KMITL Introduction to computer system` |
| ทำที่ไหน   | ในโปรแกรม Logisim                                   | บนโพรโทบอร์ด ใช้มิเตอร์/สโคป                                            |
| ความยาว    | 4–11 หน้า                                           | 2 หน้าทุกใบ                                                             |
| ส่งอย่างไร | ไฟล์ `.circ`                                        | ให้พี่ TA เซ็นในคาบ                                                     |

### 4.1 สาย A — ใบงาน Logisim (ต้นฉบับเปล่า)

| ไฟล์             | หน้า | หัวข้อจริงบนหัวกระดาษ                                                    | แท็ก                        |
| ---------------- | ---: | ------------------------------------------------------------------------ | --------------------------- |
| `ics-lab-01.pdf` |    4 | การปฏิบัติการที่ 1 — การใช้โปรแกรมจำลองการทำงานของระบบดิจิทัล (Logisim)  | `Logisim` `Schematic`       |
| `ics-lab-02.pdf` |    5 | การปฏิบัติการที่ 2 — การทำงานของลอจิกเกท (Logic Gates)                   | `Logic Gates` `Truth Table` |
| `ics-lab-03.pdf` |    8 | การปฏิบัติการที่ 3 — พีชคณิตบูลีน (Boolean Algebra)                      | `Boolean Algebra`           |
| `ics-lab-04.pdf` |   10 | การปฏิบัติการที่ 4 — วงจรเชิงผสมเบื้องต้น (Basic Combinational Circuits) | `Combinational` `K-Map`     |

> ⚠️ **แก้แล้วในรอบนี้** — ชื่อไทยที่เขียนมือไว้ใน `lib/subject-library.ts` ของทั้งสี่ใบ
> **เลื่อนไปหนึ่งช่อง** (ใบที่ 1 ถูกตั้งชื่อว่า "ประตูลอจิกพื้นฐาน" ซึ่งเป็นหัวข้อของใบที่ 2)
> ตอนนี้แก้ให้ตรงกับหัวกระดาษจริงแล้วทั้งสี่รายการ

### 4.2 สาย B — ใบทดลองต่อวงจรจริง ฉบับ 2569 (ต้นฉบับเปล่า · หลัก)

| ไฟล์                                      | หัวข้อจริง                                               | แท็ก                          |
| ----------------------------------------- | -------------------------------------------------------- | ----------------------------- |
| `ics-lab-01-multimeter-2569.pdf`          | การทดลองที่ 1 — มัลติมิเตอร์อนาล็อกและดิจิทัล            | `Multimeter` `Measurement`    |
| `ics-lab-02-oscilloscope-2569.pdf`        | การทดลองที่ 2 — ฟังก์ชันเจเนอเรเตอร์กับออสซิลโลสโคป      | `Oscilloscope` `RC`           |
| `ics-lab-03-breadboard-basics-2569.pdf`   | การทดลองที่ 3 — สวิตช์กดเปิด/ปิด LED และหน่วงเวลาด้วย RC | `Breadboard` `LED` `RC Delay` |
| `ics-lab-04-inverter-oscillator-2569.pdf` | การทดลองที่ 4 — วงจรออสซิลเลเตอร์ (74LS04)               | `Oscillator` `74LS04`         |
| `ics-lab-05-logic-gates-2569.pdf`         | การทดลองที่ 5 — สร้างมัลติเพล็กเซอร์ด้วย universal gate  | `MUX` `NAND` `7400`           |
| `ics-lab-06-fpga-basys2-2569.pdf`         | การทดลองที่ 6 — สร้างวงจรบนบอร์ด FPGA Basys2             | `FPGA` `Basys2`               |

### 4.3 ใบงานรุ่นเก่าและฉบับซ้ำ (legacy)

`ics-lab-01-v2` `ics-lab-01-y1-s1` `ics-lab-02-v2` `ics-lab-02-v3` `ics-lab-02-v4`
`ics-lab-02-y1-s1` `ics-lab-03-v2` `ics-lab-03-y1-s1` `ics-lab-04-y1-s1` `ics-lab-05`
`ics-lab-05-v2` `ics-lab-05-v3` `ics-lab-lab04` `ics-lab-week03` `ics-lab-week04`
`ics-lab-week05` `ics-lab-week05-v2` `ics-lab-week07-draft` `ics-lab-mock-lab01`

เก็บไว้เทียบรุ่น ไม่ต้องอ่านถ้ามีฉบับหลักแล้ว — ดูคู่ที่ซ้ำกันจริงในหัวข้อ 6

---

## 5. ⛔ งานที่นักศึกษาทำแล้ว — มีชื่อและรหัสนักศึกษาของผู้อื่น

**นี่คือหัวข้อที่ต้องจัดการก่อนหัวข้ออื่นทั้งหมด**

ไฟล์สามชิ้นนี้เปิดจาก URL ของ bucket ได้ตรง ๆ โดย**ไม่ต้องล็อกอิน** (ตอบ HTTP 200)
และข้างในมีลายมือกรอกชื่อ-นามสกุลพร้อมรหัสนักศึกษา:

| ไฟล์                            | สิ่งที่พบข้างใน                             |
| ------------------------------- | ------------------------------------------- |
| `labs/ics-lab-02-completed.pdf` | ชื่อ + รหัส **65070021**                    |
| `labs/ics-lab-03-y1-s1.pdf`     | ชื่อสองคน + รหัส **65070021**, **65070027** |
| `labs/ics-lab-lab04.pdf`        | ชื่อสองคน + รหัส **65070021**, **65070027** |

สังเกตว่า `ics-lab-03-y1-s1.pdf` **ไม่มีคำว่า `-completed` ในชื่อ** — การไล่ตรวจด้วยชื่อไฟล์
อย่างเดียวจึงหาไม่เจอ ต้องเปิดดูข้างใน

ไฟล์ที่ชื่อลงท้าย `-completed` ในคลังทั้งโปรเจกต์ยังมีอีกราว 27 ไฟล์ (CHARM, DSA, OOP,
MFIT, DL, PSTAT และ ICS) — **ยังไม่ได้เปิดตรวจทีละไฟล์** ควรตรวจก่อน deploy สาธารณะ

ไฟล์ ICS ที่ยังไม่ได้ตรวจแต่ชื่อบอกว่าเป็นงานที่ทำแล้ว:
`ics-lab-01-completed.pdf` · `ics-lab-01-completed.circ` · `ics-lab-02-completed-v2.pdf` ·
`ics-lab-03-completed.pdf` · `ics-lab-04-completed.pdf`

---

## 6. ไฟล์ที่เนื้อหาซ้ำกัน (ยืนยันด้วยการเรนเดอร์เทียบหน้า)

SHA-256 ใช้ตัดสินไม่ได้ เพราะไฟล์ในคลังผ่าน Ghostscript มาคนละรอบ
ตารางนี้เทียบจากภาพที่เรนเดอร์จริง (RMSE < 0.02 = เอกสารเดียวกัน)

| กลุ่ม         | ไฟล์ที่ซ้ำกัน                                                                  | ควรเก็บไฟล์ไหน                                          |
| ------------- | ------------------------------------------------------------------------------ | ------------------------------------------------------- |
| Quiz C        | `ics-midterm-ans-quiz-c` · `ics-midterm-quiz-c` · `ics-quiz-c` · `ics-quiz1-b` | เก็บ `ics-quiz1-b.pdf` (curated อยู่แล้ว) สามชิ้นแรกซ้ำ |
| สาย B บทที่ 2 | `ics-lec-chapter02-v2` = `ics-lec-week02`                                      | เก็บ `chapter02-v2` — ชื่อตรงเนื้อหา                    |
| สาย B บทที่ 3 | `ics-lec-slide03-1` = `ics-lec-week03`                                         | เก็บ `slide03-1`                                        |
| สาย A บทที่ 2 | `ics-lec-week02-boolean` = `ics-lec-week02-v2`                                 | เก็บ `week02-boolean-algebra` ที่ curated ไว้           |
| ข้อสอบกลางภาค | `ics-midterm-01` = `ics-midterm-introduction-computer-ddigjiltaal-grounding`   | เก็บ `ics-midterm-01` — ชื่ออีกอันพิมพ์เพี้ยน           |
| แล็บ 5        | `ics-lab-05-v2` = `ics-lab-week05`                                             | เก็บอันใดอันหนึ่ง                                       |
| สาย A บทที่ 3 | `ics-lec-week03-canonical-forms-y1-s1` ≈ `ics-lec-week03-v2`                   | ต่างกันเล็กน้อยกลางเล่ม — เก็บทั้งคู่                   |
| สาย A บทที่ 4 | `ics-lec-week04-kmap` ≈ `ics-lec-week04-v2`                                    | ต่างกันเล็กน้อยกลางเล่ม — เก็บทั้งคู่                   |

ไม่มีไฟล์คู่ไหนที่ hash ตรงกันเป๊ะ — การลบจึงต้องตัดสินจากเนื้อหา ไม่ใช่จาก checksum

---

## 7. ไฟล์ที่ชื่อไม่ตรงเนื้อหา — ควรเปลี่ยนชื่อ

**หกไฟล์นี้ชื่อขึ้นต้น `week` แต่เนื้อในเป็นสไลด์สาย B ของ อ.สุภกิจ**
ผลเสียไม่ใช่แค่ชื่อไม่สวย — ใครเปิดหา "สัปดาห์ 5 Time Diagram" เพื่ออ่านสอบกลางภาค
จะได้สไลด์ DAC/ADC ของปลายภาคแทน และ `chapterFrom()` ยังอ่านเลขไปใส่ผิดช่องด้วย

| ชื่อปัจจุบัน         | หน้าปกจริง                             | ชื่อที่ควรเป็น                                                   |
| -------------------- | -------------------------------------- | ---------------------------------------------------------------- |
| `ics-lec-week01.pdf` | Chapter1: Computer System              | `ics-lec-chapter01-computer-system-v2.pdf`                       |
| `ics-lec-week02.pdf` | Chapter2: Memory, I/O addressing       | ซ้ำกับ `chapter02-v2` — ลบได้                                    |
| `ics-lec-week03.pdf` | Chapter3: Multiplexer, Latch, Buffer   | ซ้ำกับ `slide03-1` — ลบได้                                       |
| `ics-lec-week04.pdf` | Chapter4: Counter and DAC & ADC Part-I | `ics-lec-chapter04-counter-adc-annotated.pdf` (มีลายมือเขียนทับ) |
| `ics-lec-week05.pdf` | Chapter5: DAC and ADC Part-II          | `ics-lec-chapter05-dac-adc-part2-v2.pdf`                         |
| `ics-lec-week06.pdf` | Chapter6: Memory unit                  | `ics-lec-chapter06-memory-unit-v2.pdf`                           |

อีกหนึ่งไฟล์ **ผิดหมวด ไม่ใช่ผิดชื่อ**:

| ไฟล์                             | ปัญหา                                          | ควรย้ายไป                                      |
| -------------------------------- | ---------------------------------------------- | ---------------------------------------------- |
| `lectures/ics-lec-chapter02.pdf` | ไม่ใช่สไลด์ — เป็นหน้าสแกนจากตำรา (เลขหน้า 30) | `references/ics-ref-textbook-ch02-excerpt.pdf` |

---

## 8. วิธีตรวจซ้ำ (ถ้าไม่เชื่อตารางข้างบน)

```bash
# หน้าปกของไฟล์ไหนก็ได้ — เปิดดูเองได้ใน 2 วินาที
gs -sDEVICE=png16m -r60 -dFirstPage=1 -dLastPage=1 -dNOPAUSE -dQUIET -dBATCH \
   -sOutputFile=/tmp/cover.png public/assets/it-kmitl/ics/lectures/ics-lec-week05.pdf
open /tmp/cover.png

# จำนวนหน้า (ghostscript เท่านั้น — pdfinfo/pdftotext ไม่ได้ติดตั้งบนเครื่องนี้)
gs -q -dNODISPLAY -dNOSAFER \
   -c "(FILE.pdf) (r) file runpdfbegin pdfpagecount = quit"

# เทียบว่าสองไฟล์เป็นเอกสารเดียวกันไหม — RMSE < 0.02 คือใช่
magick compare -metric RMSE a.png b.png null:
```

> **อย่าใช้ `shasum` ตัดสินว่าซ้ำ** — ทุกไฟล์ใน `public/assets/` ผ่าน
> `scripts/compress-assets.sh` มาแล้ว hash จึงต่างกันทั้งที่เนื้อหาเหมือนกัน

---

## 9. สรุปจำนวน

| หมวด          |    ไฟล์ | หมายเหตุ                                                                     |
| ------------- | ------: | ---------------------------------------------------------------------------- |
| `lectures/`   |      39 | สาย A 17 · สาย B 21 · ตัดตอนจากตำรา 1 (Curated ครบ 100%)                      |
| `labs/`       |      29 | ต้นฉบับเปล่า 10 · ฉบับเก่า/ตัวแปร 19 (Curated ครบ 100% · กักกัน PII 6 ไฟล์)   |
| `exams/`      |      22 | รวมไฟล์ `.circ` Logisim 5 ไฟล์ (Curated ครบ 100% · กักกัน PII 3 ไฟล์)          |
| `pages/`      |      10 | ภาพสแกนข้อสอบกลางภาค 1/2564 (Curated ครบ 100%)                                |
| `sheets/`     |       4 | ชีทสรุป (Curated ครบ 100%)                                                    |
| `references/` |       3 | ประมวลการสอน · ตำรา · รายการอุปกรณ์ (Curated ครบ 100%)                        |
| `exercises/`  |       2 | ชุดแบบฝึกหัด (Curated ครบ 100%)                                               |
| `misc/`       |       2 | โปรแกรมสุ่มข้อสอบแล็บ · ไฟล์ Logisim `.circ` (Curated ครบ 100%)               |
| **รวมที่เผยแพร่** | **111** | **Curated ครบ 100% (111/111 ไฟล์บนดิสก์ + 3 ลิงก์ภายในระบบ · ไม่มี Fallback)** |
| **กักกัน PII** | **9**   | ย้ายไป `_quarantine/it-kmitl/ics/` ป้องกันข้อมูลส่วนบุคคลรั่วไหล              |

