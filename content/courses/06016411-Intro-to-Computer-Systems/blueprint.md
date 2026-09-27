# ICS — พิมพ์เขียวสำหรับสร้างสื่อ

> ไฟล์สำหรับคนสร้างเนื้อหา ไม่ถูก render ในเว็บ — ดู `docs/COURSE_OVERVIEW_STANDARD.md` §4
> ส่วนที่นักศึกษาอ่านอยู่ใน [`summary.md`](./summary.md) · ทะเบียนไฟล์รายชิ้นอยู่ใน [`RESOURCES_MANIFEST.md`](./RESOURCES_MANIFEST.md)

## 1. คลังข้อสอบ

| มิติ | ข้อกำหนด |
|---|---|
| สัดส่วนกลางภาค | Boolean algebra 20% · Canonical form 15% · K-map 25% · Number system/complement 20% · MUX/DEMUX 15% · Timing 5% |
| ชนิดข้อ | คำนวณ/ออกแบบ 60% · ปรนัย 30% · เติมตาราง 10% |
| รูปแบบโจทย์มาตรฐาน | (1) ให้ truth table → เขียน SOP/POS → ลดรูปด้วย K-map → วาดวงจร<br>(2) ให้สมการ → พิสูจน์เท่ากันด้วยกฎบูลีน<br>(3) ให้เลขฐานสิบ → แปลงเป็น 2's complement n บิต → บวก/ลบ → ตรวจ overflow<br>(4) ให้ฟังก์ชัน → สร้างด้วย MUX ขนาดที่กำหนด<br>(5) ให้วงจร + ดีเลย์ → วาด timing diagram |
| ต้องมีเฉลย | แสดงขั้นตอนกลาง (กลุ่มบน K-map, การกลับบิต) ไม่ใช่แค่คำตอบ |

## 2. แบบฝึกหัด

- **Auto-gradable:** โจทย์แปลงเลขฐาน / 2's complement / ตรวจ overflow — ตรวจด้วย string เทียบตรง ๆ
- **K-map generator:** สุ่ม `Σm(…)` 4 ตัวแปร + don't care แล้วเช็คคำตอบด้วยการเทียบ truth table
- **Logisim challenge:** ให้ spec (เช่น "3-bit even parity generator") ผู้เรียนส่งไฟล์ `.circ`
  ตรวจด้วยการรัน truth table ครบทุกอินพุต
- **Timing diagram:** ให้วงจร + ดีเลย์ ผู้เรียนกรอกค่าเอาต์พุตในแต่ละช่วงเวลา

## 3. ข้อสอบจำลอง

- **กลางภาค** 3 ชั่วโมง — ข้อออกแบบวงจร 2 ข้อใหญ่ (comparator/adder) + ลดรูป 2 ข้อ + เลขฐาน 2 ข้อ + MUX 1 ข้อ
- **Lab Exam** — ต่อวงจรใน Logisim ตาม spec ภายในเวลาจำกัด แล้วส่ง `.circ`

## 4. แหล่งที่มาในคลัง

นับจากไฟล์ที่อยู่บนชั้นวางจริง — คลังเดิม 120 ไฟล์ เผยแพร่ 111 ไฟล์
กักกันไว้ 9 ไฟล์เพราะมีชื่อ-นามสกุลและรหัสนักศึกษาของผู้อื่นอยู่ข้างใน

| หมวด | ไฟล์ | หมายเหตุ |
|---|---:|---|
| สไลด์บรรยาย | 39 | สาย A 17 · สาย B 21 · ตัดตอนจากตำรา 1 — ระวังฉบับซ้ำและชื่อไม่ตรงเนื้อหา |
| แล็บ | 29 | ต้นฉบับเปล่า 10 · ฉบับเก่า/ตัวแปร 19 (กักกัน PII 6 ไฟล์) |
| ข้อสอบ/quiz | 22 | รวมไฟล์ `.circ` ของโจทย์ Logisim 5 ไฟล์ (กักกัน PII 3 ไฟล์) |
| ภาพสแกนข้อสอบ | 10 | ข้อสอบกลางภาค 1/2564 ทีละหน้า |
| ชีทสรุป | 4 | `ics-sheet-recap-boolean.pdf` สรุปกฎบูลีนครบ |
| เอกสารอ้างอิง | 3 | ประมวลการสอน · ตำรา v0.5 · รายการอุปกรณ์แล็บ |
| แบบฝึกหัด | 2 | |
| อื่น ๆ | 2 | โปรแกรมสุ่มข้อสอบแล็บ · ไฟล์ Logisim `.circ` |
| **รวมเผยแพร่** | **111** | ทุกไฟล์มี metadata เขียนมือครบ ไม่มีรายการที่ตกไป fallback |

**นอกคลังไฟล์** — วิดีโอบรรยายและสาธิตแล็บของครึ่งหลัง 35 คลิป
บนช่อง [@SupakitNootyaskool](https://www.youtube.com/@SupakitNootyaskool)
รวบรวมไว้แล้วใน `archive/course-materials-2569.md`

**สิ่งที่ยังขาด** — ต้นทางตอบ 404 สำหรับ `chap02.pdf`–`chap07.pdf` (เอกสารฉบับเก่าคู่ขนานกับสไลด์
เนื้อหาซ้ำกับสไลด์ที่ได้มาครบแล้ว) และไฟล์ VM `WINXP_XILINX_ICS_LAB.ova` สำหรับแล็บ FPGA
ซึ่งต้องขอจากอาจารย์โดยตรง — รายละเอียดอยู่ใน `RESOURCES_MANIFEST.md`

### ไฟล์สไลด์ที่ควรใช้ — ครึ่งแรก

| สัปดาห์ | หัวข้อ | ไฟล์สไลด์ |
|---|---|---|
| 01 | Introduction to Digital Systems | `ics-lec-week01-v2.pdf` |
| 02 | Boolean Algebra | `ics-lec-week02-v2.pdf` |
| 03 | Canonical Forms (SOP / POS) | `ics-lec-week03-v2.pdf` |
| 04 | Boolean Minimization (Karnaugh Map) | `ics-lec-week04-kmap.pdf` |
| 05 | Time Response / Time Diagram | `ics-lec-week05-time-response.pdf` |
| 06 | Number Systems & Complement | `ics-lec-week06-number-systems.pdf` |
| 07 | Multiplexer & Demultiplexer | `ics-lec-week07-mux.pdf` |

> คอลัมน์ขวาคือฉบับที่ควรใช้อ่านสอบ — ในคลังมีฉบับซ้ำและฉบับขอบหน้าถูกตัดอีกหลายไฟล์
> ข้อสอบเก่าในคลังยืนยันขอบเขตนี้ — `ics-midterm-week01-07.pdf`

### ไฟล์สไลด์ — ครึ่งหลัง 2569

| ลำดับ | หัวข้อ | ไฟล์อ้างอิงในคลัง |
|---|---|---|
| 1 | ภาพรวมระบบคอมพิวเตอร์ · วิวัฒนาการฮาร์ดแวร์ | `ics-lec-chapter01-computer-system-2569.pdf` |
| 2 | Memory & I/O addressing — address/data bus, parity, decoder, 7-segment | `ics-lec-chapter02-memory-io-addressing-2569.pdf` |
| 3 | Latch, Buffer, Tristate gate · SR flip-flop | `ics-lec-chapter03-mux-latch-buffer-2569.pdf` |
| 4 | Flip-flop SR/JK/D/T · Counter · frequency division · FIFO · ADC ตอนที่ 1 | `ics-lec-chapter04-counter-adc-2569.pdf` |
| 5 | DAC (R-2R, op-amp) และ ADC (Flash, SAR) | `ics-lec-chapter05-dac-adc-part2-2569.pdf` |
| 6 | Memory unit — SRAM, DRAM, ROM/PROM/EPROM/EEPROM | `ics-lec-chapter06-memory-circuit-2569.pdf` |
| 7 | ALU · Instruction set · แผนผังซีพียู 4 บิต | `ics-lec-chapter07-alu-cpu-2569.pdf` |

> ⚠️ มีหกไฟล์ที่ชื่อขึ้นต้น `ics-lec-week01` ถึง `ics-lec-week06` แต่เนื้อในเป็นสไลด์ Chapter 1–6
> ของครึ่งหลัง — ตารางเทียบชื่อไฟล์กับหน้าปกจริงอยู่ใน `RESOURCES_MANIFEST.md` หัวข้อ 3 และ 7

### ใบงาน — ครึ่งแรก (Logisim)

| Lab | หัวข้อบนหัวกระดาษ | เนื้อหา | ไฟล์ |
|---|---|---|---|
| 01 | การใช้โปรแกรมจำลองการทำงานของระบบดิจิทัล (Logisim) | รู้จัก Logisim, สร้าง subcircuit, `myXNOR`, 4-bit comparator | `ics-lab-01.pdf` |
| 02 | การทำงานของลอจิกเกท (Logic Gates) | ตารางความจริงของ AND/OR/NAND/NOR, `numDecoderV6` + 7-segment, 2-bit adder | `ics-lab-02.pdf` |
| 03 | พีชคณิตบูลีน (Boolean Algebra) | ลดรูปสมการด้วยพีชคณิตบูลีน (การทดลองย่อย 1.1–1.5) + ออกแบบตัวเปรียบเทียบ 2 บิต | `ics-lab-03.pdf` |
| 04 | วงจรเชิงผสมเบื้องต้น (Basic Combinational Circuits) | K-map 3 ตัวแปร, 4 ตัวแปร, 4 ตัวแปรที่มี don't care, 3-bit incrementer, 2-bit comparator | `ics-lab-04.pdf` |

> ใบงานสาย A ในคลังมีฉบับเก่าและฉบับตัวแปรอีก 19 ไฟล์ (`-v2` `-v3` `-y1-s1` `-week0N`
> `-draft`) เก็บไว้เทียบรุ่นเท่านั้น ถ้ามีฉบับหลักแล้วไม่ต้องอ่าน

### ใบงาน — ครึ่งหลัง (ต่อวงจรจริง 2569)

| Lab | หัวข้อ | เนื้อหา | ไฟล์ |
|---|---|---|---|
| 01 | มัลติมิเตอร์อนาล็อกและดิจิทัล | อ่านค่า ไล่สายเคเบิล ตัดและบัดกรีสาย | `ics-lab-01-multimeter-2569.pdf` |
| 02 | ฟังก์ชันเจเนอเรเตอร์กับออสซิลโลสโคป | วัดสัญญาณ วงจร low-pass filter | `ics-lab-02-oscilloscope-2569.pdf` |
| 03 | อุปกรณ์พื้นฐานบนโพรโทบอร์ด | รหัสสีตัวต้านทาน สวิตช์กด LED หน่วงเวลาด้วย RC | `ics-lab-03-breadboard-basics-2569.pdf` |
| 04 | วงจรออสซิลเลเตอร์ (74LS04) | RC ring oscillator จากอินเวอร์เตอร์ | `ics-lab-04-inverter-oscillator-2569.pdf` |
| 05 | สร้างมัลติเพล็กเซอร์ด้วย universal gate | ต่อเกท IC 7400 เป็นวงจรผสม | `ics-lab-05-logic-gates-2569.pdf` |
| 06 | สร้างวงจรบนบอร์ด FPGA Basys2 | ลงวงจรดิจิทัลบนบอร์ด Digilent Basys2 | `ics-lab-06-fpga-basys2-2569.pdf` |

> ⚠️ **ชื่อโฟลเดอร์ต้นทางตั้งตามสไลด์ ไม่ใช่ตามใบงาน** — เช่นใบงานสัปดาห์ 5 ที่อยู่ใน
> โฟลเดอร์ "ADC-DAC-Part-II" ไม่มีเนื้อหา ADC/DAC เลย เป็นการต่อเกทลอจิก
> ตารางข้างบนอ่านจากเนื้อในใบงานจริง
>
> อุปกรณ์ที่ต้องเตรียมเองอยู่ใน `ics-ref-hardware-component-list-2569.pdf`
> และ Lab Exam ใช้โปรแกรมสุ่มหมายเลขข้อสอบ 1–20 (`ics-ref-random-exam-number-tool.zip`)

## 5. ช่องว่างข้อมูล

- ประมวลการสอน 1/2569 ฉบับอนุมัติ (ที่มีอยู่เป็นฉบับร่าง `SUBMIT / WAITING_FOR_APPROVE`)
- วันสอบกลางภาค/ปลายภาค 1/2569
- ต้นทางตอบ 404 สำหรับ `chap02.pdf`–`chap07.pdf` และไฟล์ VM `WINXP_XILINX_ICS_LAB.ova` สำหรับแล็บ FPGA
