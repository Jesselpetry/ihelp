# สัปดาห์ที่ 3 · Computing Components

> ศ.ดร. กิติ์สุชาต พสุภา · สไลด์ Lecture 03 (18 หน้า) · แล็บ Git และ GitHub
>
> บทที่ออกสอบหนักที่สุดของครึ่งแรก — machine cycle และ memory hierarchy แทบไม่เคยหลุด

## อ่านจบแล้วต้องตอบได้

- ไล่ **machine cycle** 4 ขั้นได้ และบอกว่าขั้นไหน control unit ทำ ขั้นไหน ALU ทำ
- แยก pipelining · super-pipelined · superscalar
- แปลงเลขฐานสองเป็นฐานสิบและอักขระ ASCII ได้
- เทียบ **SRAM กับ DRAM** และ volatile กับ non-volatile
- บอกว่า system bus · backside bus · expansion bus เชื่อมอะไรกับอะไร

---

## เอกสารประจำสัปดาห์

| เอกสาร | หน้า | ไฟล์ในคลัง |
|---|:---:|---|
| สไลด์บรรยาย — Lecture 03 Computing Components | 18 | `itf-lec-week03.pdf` |
| สไลด์แล็บ — Git และ Version Control | 54 | `itf-lab-week03-git-slide.pdf` |
| ใบงานแล็บ 03 — พื้นฐานการใช้งาน Git | 6 | `itf-lab-week03-git-sheet.pdf` |

---

## สรุปอ่านสอบ

### 1. ในเคสมีอะไร

- 7 องค์ประกอบ: motherboard · processor · cooling device · memory · adapter · power supply · storage
- **Motherboard** = แผงวงจรหลัก มีช่อง RAM ช่อง CPU chipset **CMOS battery** (เก็บค่าตั้ง BIOS) พอร์ต และ expansion slot
- **Power supply** แปลงไฟ AC เป็น DC · แบตเตอรี่อุปกรณ์พกพาเป็น lithium-ion

### 2. CPU และ Machine Cycle

⭐⭐⭐ machine cycle ออกสอบแทบทุกปี

- CPU = **control unit** (สั่งการและประสานงาน) + **ALU** (คำนวณเลขคณิตและเปรียบเทียบ) · multi-core = หลาย core ในชิปเดียว

| ขั้น | ใครทำ | ทำอะไร |
|---|---|---|
| 1. **Fetch** | Control unit | ดึงคำสั่งและข้อมูลจาก memory |
| 2. **Decode** | Control unit | ถอดรหัสคำสั่ง แล้วส่งให้ ALU |
| 3. **Execute** | ALU | คำนวณ |
| 4. **Store** | — | เก็บผลลัพธ์ลง memory |

| แบบ | หลักการ |
|---|---|
| No pipelining | ทำคำสั่งหนึ่งจบ cycle ก่อนเริ่มคำสั่งถัดไป |
| **Pipelining** | fetch คำสั่งถัดไปก่อนคำสั่งแรกจบ · 1 stage ต่อ clock cycle |
| Super-pipelined | 2 stage ต่อ clock cycle |
| Superscalar | หลาย pipeline ขนานกัน แต่ละ pipeline ทำ 1 stage ต่อ clock cycle |

- **Register** = ที่เก็บชั่วคราวในโปรเซสเซอร์ เร็วที่สุด
- **System clock** คุมจังหวะ · clock speed วัดเป็น GHz · **1 GHz = 10⁹ cycles ต่อวินาที**

### 3. Data Representation

- Analog = ต่อเนื่อง · digital = 2 สถานะ on/off · คอมพิวเตอร์ใช้ **binary** (0 กับ 1)
- **8 bits = 1 byte = 1 character** · ASCII = American Standard Code for Information Interchange
- น้ำหนักบิต `128 64 32 16 8 4 2 1` — เช่น `01000101` = 64+4+1 = **69 = E** · `01000001` = 65 = A
- การกดแป้น: กดปุ่ม → **scan code** ไปที่วงจร → แปลงเป็นรหัส ASCII แล้วเก็บใน memory

### 4. Memory

⭐⭐ ตาราง SRAM/DRAM และลำดับ cache ออกบ่อย

| | Volatile | Non-volatile |
|---|---|---|
| ไฟดับแล้ว | ข้อมูลหาย | ข้อมูลอยู่ |
| ตัวอย่าง | RAM | ROM · flash memory · CMOS |

| | SRAM | DRAM |
|---|---|---|
| ความเร็ว | เร็วกว่ามาก | ช้ากว่า ต้อง refresh |
| ราคา / ความจุ | แพง ความจุน้อย | ถูก ความจุสูง |
| ใช้เป็น | **cache ของ CPU** | **main memory** |

- ลำดับชั้น: **L1 → L2 → L3 → RAM** ยิ่งใกล้ CPU ยิ่งเร็วแต่ยิ่งเล็ก · L1/L2 อยู่บนชิปโปรเซสเซอร์
- **ROM** อ่านได้อย่างเดียว · **BIOS** เป็น ROM บน motherboard · **EEPROM** = flash memory ลบและเขียนใหม่ด้วยไฟฟ้า · **CMOS** ใช้แบตเตอรี่เก็บค่าตั้งเครื่อง
- **Access time** ของ memory วัดเป็น **ns** — ยิ่งน้อยยิ่งเร็ว

### 5. Adapter และ Bus

- **Adapter card** เสียบใน expansion slot (มาตรฐาน **PCI**) เช่น GPU, sound card · **Plug and Play** ให้เครื่องรู้จักอุปกรณ์อัตโนมัติ · **dongle** = adapter แบบ USB
- **Data bus** ส่งข้อมูล · **address bus** ส่งที่อยู่ของข้อมูล
- **Bus width** = จำนวนบิตต่อครั้ง — 32-bit bus ส่งได้ **4 bytes** ต่อครั้ง

| Bus | เชื่อม |
|---|---|
| System bus (front-side) | processor ↔ RAM |
| Backside bus | processor ↔ cache |
| Expansion bus | processor ↔ อุปกรณ์ต่อพ่วง |

---

## จุดที่มักพลาด

- Decode เป็นงานของ **control unit** — ALU ทำแค่ execute
- SRAM **กินไฟน้อยกว่า**และเร็วกว่า DRAM แต่แพงกว่า — ตัวเลือกมักสลับคุณสมบัติกัน
- CMOS เป็น non-volatile เพราะมีแบตเตอรี่ แต่ช้ากว่า RAM
- 32-bit bus = 4 **bytes** ไม่ใช่ 32 bytes

---

## ทดสอบตัวเอง

1. ขั้นใดของ machine cycle ที่ ALU ทำ
2. `00101010` เป็นเลขฐานสิบเท่าไร
3. หน่วยความจำชนิดใดใช้เป็น cache ของ CPU
4. Bus ที่เชื่อมโปรเซสเซอร์กับ cache ชื่ออะไร
5. โปรเซสเซอร์ 3 GHz มีกี่ clock cycle ต่อวินาที

**เฉลย** — 1. Execute · 2. 42 (32+8+2) · 3. SRAM · 4. backside bus · 5. 3 × 10⁹ = 3,000,000,000

---

## แล็บ — Git และ GitHub

> ย่อจากใบงานจริง ขั้นตอนเต็มให้ยึดไฟล์ PDF

**งานเดี่ยว** — ติดตั้ง Git · สร้าง repository บน GitHub ตั้งชื่อตรงกับชื่อบัญชี · `git clone` ลงเครื่อง ·
สร้าง `README.md` และ `app.py` แล้ว `git add` → `git commit -m` → `git push` · แก้ `README.md` บนเว็บแล้ว `git pull` ลงมา

**งานคู่ (เพิ่มเติม)** — คนที่ 1 สร้าง repository `ITF-Lab-Week3` และเชิญเพื่อนเป็น collaborator ·
คนที่ 1 push `exercise.py` ขึ้น `main` · คนที่ 2 สร้าง branch `Extra` แก้ไฟล์แล้ว push · คนที่ 1 เปิด pull request แล้ว merge

| คำสั่ง | ใช้ทำอะไร |
|---|---|
| `git init` · `git clone` | สร้าง repository ใหม่ · คัดลอกจาก remote |
| `git add` · `git commit -m` | ย้ายเข้า staging · บันทึกลงประวัติ |
| `git push` · `git pull` | ส่งขึ้น remote · ดึงของใหม่ลงมารวม |
| `git status` · `git log` · `git diff` | ดูสถานะ · ประวัติ · ความต่าง |
| `git reset` · `git rm` | เอาออกจาก staging · ลบไฟล์ |
