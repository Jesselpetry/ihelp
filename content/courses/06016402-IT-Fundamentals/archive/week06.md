# สัปดาห์ที่ 6 · Operating System

> ผศ.ดร. พรสุรีย์ แจ่มศรี · สไลด์ Lecture 06 (50 หน้า) · แล็บ Excel 1 — สูตรพื้นฐานและกราฟ
>
> สัปดาห์แรกของครึ่งหลัง — สไลด์แนะนำครึ่งหลังของวิชาอยู่ใน[ภาพรวมและตารางเรียน](/courses/06016402-IT-Fundamentals/map?doc=course-materials-2569)

## อ่านจบแล้วต้องตอบได้

- ให้นิยาม OS และไล่หน้าที่ของ OS ตามสไลด์ได้ครบ
- เรียง **5 ขั้นตอนการ boot** และแยก cold boot กับ warm boot
- แยก **sleep กับ hibernate** · CLI · GUI · NUI
- อธิบาย **virtual memory** พร้อมคำว่า swap file · page · paging · thrashing
- แยก buffer · spooling · queue และ backward กับ upward compatible

---

## เอกสารประจำสัปดาห์

| เอกสาร | หน้า | ไฟล์ในคลัง |
|---|:---:|---|
| สไลด์บรรยาย — Lecture 06 Operating System | 50 | `itf-lec-week06-os.pdf` |
| สรุปลายมือ — Operating System | 2 | `itf-lec-week06-os-v2.pdf` |
| คู่มือแล็บ — Microsoft Excel 1 | 23 | `itf-lab-week06-excel-1.pdf` |
| โจทย์แล็บ — กลุ่ม 1 | 1 | `lab06-lab-work-group-1.pdf` |
| โจทย์แล็บ — กลุ่ม 2 | 1 | `itf-lab-week06-task-group-2.pdf` |
| โจทย์แล็บ — กลุ่ม 3 | 1 | `itf-lab-week06-task-group-3.pdf` |
| ไฟล์ข้อมูล financial.xlsx | — | `financial.xlsx` |

---

## สรุปอ่านสอบ

### 1. นิยามและหน้าที่ของ OS

⭐⭐⭐ นิยามและรายการหน้าที่ออกสอบบ่อยมาก

- **OS** = ชุดโปรแกรมที่ประสานงานกิจกรรมทั้งหมดระหว่างฮาร์ดแวร์ของคอมพิวเตอร์หรืออุปกรณ์พกพา
- สไลด์แยกหัวข้อเป็น 12 ข้อ:
  1. Starting computers · 2. Shutting down · 3. Providing a user interface · 4. Managing programs ·
  5. Managing memory · 6. Coordinating tasks · 7. Configuring devices · 8. Monitoring performance ·
  9. Establishing an Internet connection · 10. File, disk and system management tools ·
  11. Updating OS software · 12. Controlling a network
- ประโยคนิยามในสไลด์รวม start กับ shut down เป็นข้อเดียว และบอกว่า**บาง OS** เท่านั้นที่ควบคุมเครือข่ายและดูแลความปลอดภัยได้ — ถ้าโจทย์ถาม "11 ข้อ" คือนับแบบนี้

### 2. การเปิดและปิดเครื่อง

⭐⭐⭐ 5 ขั้นตอนการ boot

1. Power supply หรือแบตเตอรี่ส่งกระแสไฟเข้าวงจร
2. ชิปโปรเซสเซอร์ reset ตัวเอง แล้วหา **firmware** ที่เก็บคำสั่งเริ่มต้น (BIOS / UEFI)
3. รันชุดทดสอบฮาร์ดแวร์ (**POST**) — bus, clock, RAM, คีย์บอร์ด, ไดรฟ์ · ถ้ามีปัญหาจะมีเสียง beep หรือข้อความ error
4. โหลด **kernel** จาก storage เข้า RAM — kernel เป็น **memory resident** อยู่ใน RAM ตลอดที่เครื่องเปิด
5. OS โหลดค่าตั้งระบบ ตรวจสอบผู้ใช้ แสดงหน้าจอ และรันโปรแกรมเริ่มต้น เช่น antivirus

| | Cold boot | Warm boot |
|---|---|---|
| เริ่มจาก | ไฟดับสนิท | เครื่องยังเปิดอยู่ (restart) |
| ความเร็ว | ช้ากว่า | เร็วกว่า ข้ามบางขั้น |
| ใช้เมื่อ | สงสัยว่าฮาร์ดแวร์เสีย — ตรวจอุปกรณ์ครบ | โปรแกรมค้าง — ล้าง memory |

| | Sleep | Hibernate |
|---|---|---|
| เก็บงานไว้ที่ | **RAM** | **hard drive** |
| ถ้าไฟดับ | งานที่ยังไม่บันทึกหาย | ไม่หาย เพราะตัดไฟหลังบันทึกแล้ว |

### 3. User Interface และการจัดการโปรแกรม

- **GUI** กดเมนูและภาพ · **CLI** พิมพ์คำสั่งสั้น ๆ เช่น `dir` · **NUI** ใช้พฤติกรรมธรรมชาติ — สัมผัส ท่าทาง เสียง VR
- **Single tasking** รันได้ทีละโปรแกรม (embedded) · **multitasking** หลายโปรแกรมอยู่ใน memory พร้อมกัน มี foreground / background
- **Single user vs multiuser** นับจำนวนผู้ใช้ ไม่ใช่จำนวนโปรแกรม — server และ supercomputer ใช้ multiuser OS

### 4. Virtual Memory และ Coordinating Tasks

⭐⭐⭐ virtual memory ออกสอบแน่

- OS จัดการ memory 3 ขั้น: **allocate → monitor → release**
- **Virtual memory** = OS ใช้พื้นที่ใน storage ทำหน้าที่เป็น RAM เพิ่ม · ช้ากว่า RAM จริง

| คำ | ความหมาย |
|---|---|
| Swap file | พื้นที่บนดิสก์ที่ใช้เป็น virtual memory |
| Page | ปริมาณข้อมูลที่สลับได้ในหนึ่งครั้ง |
| Paging | เทคนิคสลับข้อมูลระหว่าง memory กับ storage |
| **Thrashing** | OS มัวแต่ paging จนแทบไม่ได้รันแอป |

| คำ | ความหมาย |
|---|---|
| Buffer | พื้นที่พักข้อมูลใน memory หรือ storage |
| **Spooling** | ส่งงานพิมพ์ไปพักใน buffer แทนส่งเข้าเครื่องพิมพ์ทันที |
| Queue | แถวงานที่รออยู่ใน buffer |
| Print spooler | โปรแกรมที่ดักงานพิมพ์แล้วนำเข้าคิว |

### 5. อุปกรณ์ เครือข่าย และประเภทของ OS

- **Driver** = โปรแกรมเล็กที่บอก OS ว่าจะคุยกับอุปกรณ์นั้นอย่างไร · **Plug and Play** ตั้งค่าอุปกรณ์ใหม่อัตโนมัติ
- Performance monitor · automatic update · **service pack** · firewall ในตัว
- Controlling a network: network administrator ใช้ server OS จัดการผู้ใช้ · **permission** กำหนดว่าใครเข้าถึงอะไรได้เมื่อไร
- **Backward compatible** = OS ใหม่รันแอปเก่าได้ · **upward compatible** = แอปเก่าอาจรันหรือไม่รันบน OS ใหม่

| OS | จุดจำ |
|---|---|
| Windows | เวอร์ชันแรก พ.ย. 1985 เป็น GUI 16-bit บน MS-DOS · Windows 11 ออก 5 ต.ค. 2021 |
| macOS | มากับ Macintosh ปี 1984 · ต้นแบบของ GUI รุ่นหลัง |
| UNIX | Bell Labs ต้นทศวรรษ 1970 · ขายเชิงพาณิชย์ไม่ได้ จึงให้มหาวิทยาลัยใช้ราคาถูก |
| Linux | ปี 1991 · **open source** · UNIX-based ที่นิยมที่สุด |
| Chrome OS | Linux-based ของ Google · เน้น web app |
| Android | Linux-based ของ Google · open source |
| iOS | proprietary ของ Apple |
| Windows Phone | proprietary ของ Microsoft · **เลิกพัฒนาแล้ว** |

---

## จุดที่มักพลาด

- **Sleep เก็บลง RAM · hibernate เก็บลงดิสก์** — สลับกันเป็นตัวลวงบ่อยที่สุดของบทนี้
- Warm boot **เร็วกว่า** cold boot · ถ้าสงสัยฮาร์ดแวร์ให้ใช้ cold boot
- Backward compatible เป็นคุณสมบัติของ **OS ใหม่** ไม่ใช่ของแอป
- Thrashing คือสภาวะที่แย่ ไม่ใช่เทคนิคเพิ่มความเร็ว
- Kernel **resident** อยู่ใน memory ตลอด · ส่วนอื่นของ OS เป็น nonresident

---

## ทดสอบตัวเอง

1. ขั้นตอนใดของการ boot ที่โหลด kernel เข้า RAM
2. โหมดประหยัดพลังงานใดที่งานไม่หายแม้ถอดปลั๊ก
3. สภาวะที่ OS ใช้เวลาส่วนใหญ่ไปกับ paging เรียกว่าอะไร
4. การส่งเอกสารไปพักใน buffer ก่อนพิมพ์เรียกว่าอะไร
5. OS เวอร์ชันใหม่ที่รันโปรแกรมของเวอร์ชันเก่าได้ มีคุณสมบัติใด

**เฉลย** — 1. ขั้นที่ 4 · 2. hibernate · 3. thrashing · 4. spooling · 5. backward compatible

---

## แล็บ — Excel 1

> ย่อจากคู่มือและโจทย์จริง ขั้นตอนเต็มให้ยึดไฟล์ PDF

**สิ่งที่คู่มือสอน** — ส่วนประกอบหน้าต่าง (quick access toolbar · title bar · ribbon · **name box** · **formula bar** · active cell · worksheet) ·
เพิ่ม แก้ (`F2`) และลบข้อมูล · เติมข้อมูลอัตโนมัติ · เลือกช่วงด้วยการลากและ `Ctrl` · sort · merge cells ·
conditional formatting · สร้างและเปลี่ยนชนิดกราฟ · formula กับ function (`SUM` `AVERAGE` `COUNT`) ·
ลำดับการคำนวณของตัวดำเนินการ · ข้อความ error เช่น `#####` `#VALUE` `#DIV/0!`

**โจทย์** — จากไฟล์ `financial.xlsx` ทำรายงานยอดขาย (Units Sold) ตามเงื่อนไข Segment · Country · Product · Discount Band
พร้อมผลรวม Total Units Sold และกราฟ **2 รายงาน** แล้วส่งไฟล์ Excel ใน OnLearn

| รอบแล็บ | รายงานที่ 1 | รายงานที่ 2 |
|---|---|---|
| กลุ่ม 1 | Channel Partners · Germany · Amarilla | Government · France · Velo · High |
| กลุ่ม 2 | Channel Partners · Mexico · Carretera · Medium | Midmarket · United States of America · Paseo · Low |
| กลุ่ม 3 | Small Business · Germany · Paseo · Low | Midmarket · Canada · Carretera · High |
