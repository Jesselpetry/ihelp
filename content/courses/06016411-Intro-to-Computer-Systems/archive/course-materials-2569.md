# ICS · ครึ่งหลังของวิชา — Computer Hardware (ภาค 1/2569)

> **ที่มา:** [เว็บการสอนของ ผศ.ดร.สุภกิจ นุตยะสกุล](https://supakit.net/learning/?file=ics) ·
> ช่อง [@SupakitNootyaskool](https://www.youtube.com/@SupakitNootyaskool) · รวบรวม 21 ก.ย. 2569

## วิชานี้มีผู้สอนสองคน คนละครึ่งเทอม

ประมวลการสอนฉบับ 1/2569 (อยู่ในคลังของวิชา) ระบุชัดว่า 06016411 **แบ่งผู้สอนเป็นสองช่วง**
ไม่ใช่สไลด์สองชุดที่แข่งกัน:

| ช่วง | ครั้งที่ | เนื้อหา | ผู้สอน | สอบ |
|---|:---:|---|---|---|
| ครึ่งแรก | 1–7 | ดิจิทัลลอจิก — เลขฐาน · บูลีน · SOP/POS · K-map · timing · MUX/DEMUX | อ. Sooksan Panichpapiboon | **กลางภาค 50%** |
| ครึ่งหลัง | 8–15 | ฮาร์ดแวร์คอมพิวเตอร์ — จากวงจรดิจิทัลถึงการออกแบบ CPU 4 บิต | **ผศ.ดร.สุภกิจ นุตยะสกุล** | **ปลายภาค 50%** |

**หน้านี้คือครึ่งหลังทั้งหมด** — เนื้อหาที่ออกปลายภาค ไม่ใช่เนื้อหาเสริม
ตัวเลข "สัปดาห์ 1–7" ในหน้านี้เป็นลำดับคาบของ อ.สุภกิจ เอง ซึ่งตรงกับ
**ครั้งที่ 8–15 ของประมวลการสอน** ไม่ใช่สัปดาห์ 1–7 ที่ใช้สอบกลางภาค

> ⚠️ [`summary.md` หัวข้อ 2](../summary) ของวิชานี้เขียนไว้ว่าสไลด์สองชุดคือ
> "สาย A (ปัจจุบัน)" กับ "สาย B (คลังปีก่อน)" แล้วแนะนำให้ *"ยึดสาย A เป็นหลัก
> สาย B ใช้เป็นเนื้อหาเสริม"* — **ประมวลการสอนฉบับ 1/2569 ขัดกับคำแนะนำนั้น**
> ทั้งสองชุดคือครึ่งแรกและครึ่งหลังของวิชาเดียวกัน ข้ามชุดใดชุดหนึ่งคือข้ามครึ่งเทอม
> (ยังไม่ได้แก้ `summary.md` เพราะเป็นไฟล์ที่ดูแลด้วยมือตามสัญญา 6 หัวข้อ)

---

## 1. ตารางเรียน 7 สัปดาห์

| # | วันที่ | หัวข้อบรรยาย (สไลด์) | หน้า | ใบงานแล็บ — **หัวข้อจริงในใบงาน** | วิดีโอ |
|:---:|:---:|:---|:---:|:---|:---:|
| 1 | 24 ส.ค. | Computer system — ภาพรวมระบบคอมพิวเตอร์ | 55 | **Lab 1** — มัลติมิเตอร์เข็มและดิจิทัล อ่านค่า/ไล่สายเคเบิล | 4 |
| 2 | 31 ส.ค. | Memory and I/O addressing | 49 | **Lab 2** — ออสซิลโลสโคปและฟังก์ชันเจเนอเรเตอร์ | 4 |
| 3 | 7 ก.ย. | Input and output signal | 39 | **Lab 3** — อุปกรณ์พื้นฐานบนโพรโทบอร์ด · รหัสสีตัวต้านทาน · หน่วงเวลาด้วย RC | 7 |
| 4 | 14 ก.ย. | Flip flop, Counter, ADC part-I | 59 | **Lab 4** — วงจรออสซิลเลเตอร์จากอินเวอร์เตอร์ (RC ring oscillator) | 6 |
| 5 | 21 ก.ย. | ADC DAC part-II | 32 | **Lab 5** — เกทลอจิก IC 7400/7401 ต่อเป็นวงจรผสม | 9 |
| 6 | 28 ก.ย. | Memory circuit · **Lab Exam** | 26 | **Lab 6** — ลงวงจรบนบอร์ด FPGA Digilent Basys2 | 3 |
| 7 | 5 ต.ค. | Instruction set & CPU structure · **Lab Exam** | 40 | — | 2 |
| — | — | **Final Exam** — ครอบคลุมทั้งรายวิชา | — | — | — |

> ⚠️ **ชื่อหัวข้อของแล็บไม่ตรงกับชื่อหัวข้อบรรยายในสัปดาห์เดียวกัน**
> โฟลเดอร์ต้นทางตั้งชื่อตามสไลด์ ไม่ใช่ตามใบงาน — เช่นใบงานสัปดาห์ 5 ที่อยู่ใน
> โฟลเดอร์ "ADC-DAC-Part-II" ไม่มีเนื้อหา ADC/DAC เลย เป็นการต่อเกทลอจิก
> คอลัมน์ขวาข้างบนอ่านมาจาก **เนื้อในใบงานจริง** ส่วนวิดีโอแล็บในหัวข้อ 2
> ตรงกับใบงาน ไม่ตรงกับชื่อโฟลเดอร์

ไฟล์ PDF ทุกชิ้นอยู่ใน [คลังเรียนรู้ของวิชา](../library) (ต้องเข้าสู่ระบบด้วยอีเมล `@kmitl.ac.th`)

---

## 2. วิดีโอบรรยายและสาธิตแล็บ — 35 คลิป

### สัปดาห์ 1 · Computer System

**บรรยาย**
- [ICS Chapter1 Computer System](https://www.youtube.com/watch?v=3NvqarEC1fg)
- [ICS 1 Overview computer system](https://www.youtube.com/watch?v=BdJE9kZkneQ) — ภาพรวมหัวข้อ

**แล็บ 1**
- [Lab 1.1 — ตัดและบัดกรีสาย (Cut and Soldering Cable)](https://www.youtube.com/watch?v=putCB8g1e0U)
- [Lab 1.2 — การใช้มัลติมิเตอร์อนาล็อกและดิจิทัล](https://www.youtube.com/watch?v=nZJrSUrbw9w)

### สัปดาห์ 2 · Memory and I/O Addressing

**บรรยาย**
- [ICS Chapter2 Address, Data Bus, Parity Bit, Decoder circuit](https://www.youtube.com/watch?v=1y0a2dmONi8)
- [ICS 2 device connection](https://www.youtube.com/watch?v=CpRYePrFXLo) — ภาพรวมหัวข้อ

**แล็บ 2 — LED and Switch**
- [Lab 2.1 — เริ่มต้นใช้สโคป (start using oscilloscope)](https://www.youtube.com/watch?v=gyAi_4V5uVs)
- [Lab 2.2 — ใช้สโคปวัดสัญญาณในวงจร low-pass filter](https://www.youtube.com/watch?v=F3WZlaGuUdU)

### สัปดาห์ 3 · Input and Output Signal

**บรรยาย**
- [ICS Chapter3 MUX Latch Buffer SR Flip-flop](https://www.youtube.com/watch?v=7Qjz8pPZOvI)
- [ICS Chapter03 Set-Reset Flip Flop ตอนที่ 1](https://www.youtube.com/watch?v=-NxwewzEpy4)
- [ICS Chapter03 Set-Reset Flip Flop ตอนที่ 2 — จำลองด้วย C++](https://www.youtube.com/watch?v=vNeE5IsVfIc)
- [ICS 3 Input output](https://www.youtube.com/watch?v=ZP4JrLYh8so) — ภาพรวมหัวข้อ

**แล็บ 3**
- [Lab 3.1 — LED SW (กดสวิตช์ LED ดับ ปล่อย LED ติด)](https://www.youtube.com/watch?v=olwTrEiSFIU)
- [Lab 3.2 — หน่วงเวลาเปิด LED ด้วยตัวเก็บประจุ](https://www.youtube.com/watch?v=XMdfIwTWcA0)
- [ตัวอย่าง — SR Flip Flop บน Tinkercad](https://www.youtube.com/watch?v=FLuLCeqh7bI)

### สัปดาห์ 4 · Flip Flop, Counter, ADC ตอนที่ 1

**บรรยาย**
- [ICS Chapter4-1 Flipflop](https://www.youtube.com/watch?v=VasSC1iQxiU)
- [ICS Chapter4-2 Counter ADC](https://www.youtube.com/watch?v=2fpTQvhru9U)
- [ICS 4 ADC and DAC circuit](https://www.youtube.com/watch?v=OSDD7ojmnbM) — ภาพรวมหัวข้อ

**แล็บ 4**
- [Lab 4 — Oscillator circuit](https://www.youtube.com/watch?v=5UQfdLAsDDA)
- [ICS JK Flip Flop](https://www.youtube.com/watch?v=Q2BubNYuQkY)
- [โบนัส FPGA — วาดวงจรดิจิทัลลงโปรแกรมบน FPGA](https://www.youtube.com/watch?v=2kwDOdr2oTw)

### สัปดาห์ 5 · ADC DAC ตอนที่ 2

**บรรยาย**
- [ICS Chapter05 DAC ADC Part II](https://www.youtube.com/watch?v=wO5qHIucBTE)
- [ICS DAC บน Tinkercad](https://www.youtube.com/watch?v=825bEE7MdRE)
- [ICS 4-bit counter ต่อเข้า DAC บน Tinkercad](https://www.youtube.com/watch?v=uW8lVi4gXbQ)
- [ICS 5 Memory circuit](https://www.youtube.com/watch?v=jpcyleZvV1U) — ภาพรวมหัวข้อ

**แล็บ 5 — Multiplexer**
- [Lab 5 — ต่อและตรวจสอบวงจรมัลติเพล็กเซอร์](https://www.youtube.com/watch?v=Xciu-EDIwUY)
- [2-to-1 MUX บน Tinkercad](https://www.youtube.com/watch?v=qnZITvRFgFI)
- [2-to-1 MUX จากเกท NAND บน Tinkercad](https://www.youtube.com/watch?v=-NKx_4h_yeE)
- [Lab 5.1 — ระบบบัส (Bus)](https://www.youtube.com/watch?v=23NBrpRo7pk)
- [Lab 5.2 — สัญญาณนาฬิกา (Clock signal)](https://www.youtube.com/watch?v=bnTPDOstsQA)

### สัปดาห์ 6 · Memory Circuit · Lab Exam

**บรรยาย**
- [ICS Chapter6 Circuit concept in memory devices](https://www.youtube.com/watch?v=PFW979f5Onw)
- [ICS 6 Arithmetic logic unit](https://www.youtube.com/watch?v=UGx4ieWyyWk) — ภาพรวมหัวข้อ

**แล็บ 6 / FPGA**
- [Lab 6 — สร้างวงจรบน FPGA](https://www.youtube.com/watch?v=BV7piMHvsrE)

### สัปดาห์ 7 · Instruction Set & CPU Structure · Lab Exam

**บรรยาย**
- [ICS Chapter7 ALU and CPU creation](https://www.youtube.com/watch?v=DOcyT0i8_yQ)
- [ICS 7 CPU design](https://www.youtube.com/watch?v=8ZCjVAkFIfA) — ภาพรวมหัวข้อ

---

## 3. เอกสารประกอบรายวิชา

| เอกสาร | หน้า | หมายเหตุ |
|---|:---:|---|
| ประมวลการสอนรายวิชา (Syllabus) | 10 | รายละเอียดเนื้อหาและเกณฑ์วัดผล |
| ตำรา *Introduction to Computer System* v0.5 | 251 | เขียนโดย อ.สุภกิจ นุตยะสกุล |
| Hardware Component List (HWL) | 1 | รายการอุปกรณ์ที่ต้องเตรียมสำหรับแล็บ |
| ICS Random Exam Number Tool | — | โปรแกรม Windows (VB) สุ่มหมายเลขข้อสอบแล็บ 1–20 · ไฟล์ ZIP |

ทั้งสี่รายการอยู่ใน [คลังเรียนรู้ของวิชา](../library)

### ข้อควรรู้ก่อนใช้เอกสารสองชิ้นนี้

**Syllabus เป็นฉบับร่าง ยังไม่อนุมัติ** — หน้าสุดท้ายระบุสถานะ
`SUBMIT / WAITING_FOR_APPROVE` ลงวันที่ 1 ก.ค. 2569 (Revision 1, Draft revision)
ใช้ดูโครงเนื้อหาได้ แต่**อย่าอ้างเป็นเกณฑ์วัดผลฉบับทางการ** และมีจุดที่ขัดกับ
ชุดไฟล์จากเว็บอาจารย์: syllabus เขียนว่า *Required textbooks/materials: None*
และไม่ได้ระบุตำรา ICS v0.5 ของ อ.สุภกิจ ไว้ในรายการหนังสือแนะนำ

**ตำรา v0.5 เป็นฉบับร่าง** — ทุกหน้ามีลายน้ำ *"ฉบับร่าง September 6, 2024 ใช้เรียน ICS"*
และมีข้อบกพร่องที่ยังไม่ได้แก้:

- **ไม่มี text layer เลยสักหน้า** ทั้ง 251 หน้าเป็นภาพ — ค้นหาข้อความไม่ได้
  คัดลอกไม่ได้ และโปรแกรมอ่านหน้าจอใช้ไม่ได้
- สารบัญมีการอ้างอิงที่ยังไม่ resolve — หัวข้อ 9.5/9.6 ขึ้นว่า `ERROR: sram` / `ERROR:dram`
  และ **ชื่อบทที่ 10 (ALU) หายไปจากสารบัญ** กลายเป็น `ERROR:alu`
- ในเนื้อหน้า 125 และ 200 มีคีย์ของรูปหลุดออกมาเป็นข้อความ เช่น `fig-4bit-latch-circuit`, `fig-empty`
- รูปที่ 12.8 (หน้า 200) เป็นกรอบเปล่า — ภาพวัดตัวต้านทาน 560 โอห์มหายไป

> **ลิขสิทธิ์:** ตำราเล่มนี้เป็นผลงานภายใต้โครงการส่งเสริมการผลิตหนังสือและตำรา
> ของ สจล. และ **ไม่มีข้อความอนุญาตให้เผยแพร่ซ้ำพิมพ์อยู่ในเล่ม**
> ต้นทางที่ถูกต้องคือ [เว็บของอาจารย์](https://supakit.net/learning/?file=ics)

---

## 4. เกณฑ์การวัดผล (คะแนนระหว่างภาค 50%)

| รายการ | สัดส่วน |
|---|---:|
| Quiz ในคาบบรรยาย (ทุกสัปดาห์) | 15% |
| คะแนนงานแล็บ 1–5 | 10% |
| Lab Exam | 15% |
| Final Exam | 10% |

สัดส่วนชุดนี้พิมพ์อยู่บนสไลด์ Chapter 1 ฉบับ 2569 เอง (หน้า 1–11 เป็นส่วนแนะนำรายวิชา)
และคือการแบ่งย่อยของ **50% ครึ่งหลัง** ตามที่ประมวลการสอนกำหนด

> ⚠️ ตัวเลขนี้ **ไม่ตรงกับ** ตารางใน [`summary.md` หัวข้อ 1](../summary)
> ซึ่งระบุ Quiz 15% · **Lab Quiz 15%** · Final 10% · **Lab Exam 10%**
> รวมได้ 50% เท่ากันแต่สลับน้ำหนักระหว่างงานแล็บกับสอบแล็บ
> สไลด์ฉบับ 2569 เป็นแหล่งที่ใหม่กว่า — ถ้าต่างกันให้ยึดประกาศในคาบเรียน

สไลด์ตารางเรียนของ อ.สุภกิจ **ไม่มีสอบกลางภาคในช่วงของท่าน** — มี quiz 7 ครั้ง,
Lab Exam วันที่ 9 และ 16 ต.ค. และ Final Exam ในสัปดาห์สอบ โดยมีหมายเหตุกำกับว่า
ข้อสอบปลายภาคออกเฉพาะเนื้อหาหลังกลางภาค

---

## 5. หนังสือและเอกสารอ้างอิง

**ตำราหลัก**
- สุภกิจ นุตยะสกุล, *Introduction to Computer System* (ฉบับ v0.5) — อยู่ในคลังของวิชา

**อ้างอิง**
1. R. H. Katz and G. Borriello, *Contemporary Logic Design*, 2nd ed., Pearson Education.
2. C. Hamacher, Z. Varanasi, S. Zaky, and N. Majikian, *Computer Organization and Embedded System*, 6th ed., McGraw-Hill, 2011.
3. P. Vincent, *Computer Systems Design and Architecture*, Pearson Education, 2004.

---

## 6. สิ่งที่หายไปจากต้นทาง

ไฟล์ด้านล่างถูกอ้างถึงบนเว็บต้นทาง แต่ **ดึงมาไม่ได้** — บันทึกไว้เพื่อไม่ให้ใครเสียเวลาตามหาซ้ำ

| ไฟล์ | สถานะ | ผลกระทบ |
|---|---|---|
| `chap02.pdf` – `chap07.pdf` | ต้นทางตอบ 404 Not Found | เป็น "เอกสารฉบับเก่า" คู่ขนานกับสไลด์ — สไลด์ `slide02`–`slide07` ที่ได้มาครบครอบคลุมเนื้อหาเดียวกันแล้ว |
| `WINXP_XILINX_ICS_LAB.ova` | ไม่มีในชุดไฟล์ที่ดึงมา | ไฟล์ VM (Windows XP + Xilinx ISE) สำหรับแล็บ FPGA — ถ้าต้องใช้ ต้องขอจากอาจารย์โดยตรง |

> `chap01.pdf` ไม่ปรากฏในบันทึกการดึงไฟล์เช่นกัน — ต้นทางอาจไม่เคยมี
