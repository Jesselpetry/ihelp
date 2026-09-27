# สัปดาห์ที่ 1 · Introducing Today's Technology

> ศ.ดร. กิติ์สุชาต พสุภา · สไลด์ Lecture 01 (23 หน้า) · แล็บ Windows 11 บน VirtualBox และคำสั่ง Command Prompt
>
> คลิปบรรยายของสัปดาห์นี้อยู่ใน OnLearn — เปิดได้จาก[คลังเรียนรู้](/courses/06016402-IT-Fundamentals/library) มุมมองรายสัปดาห์

## อ่านจบแล้วต้องตอบได้

- แยก **data** กับ **information** ได้ และวางถูกตำแหน่งในแบบจำลอง Input → Process → Output
- บอก 4 องค์ประกอบของ **digital literacy** และนิยามของคำว่า computer
- แยก **Internet** กับ **Web** และเล่าจุดกำเนิดจาก ARPANET ได้
- เทียบ AI 3 ระดับ **ANI / AGI / ASI** และบอกได้ว่าระดับไหนมีอยู่จริง
- จับคู่ malware แต่ละชนิดกับพฤติกรรมของมัน และบอก 4 หัวข้อของ digital safety

---

## เอกสารประจำสัปดาห์

| เอกสาร | หน้า | ไฟล์ในคลัง |
|---|:---:|---|
| สไลด์บรรยาย — Lecture 01 Introducing Today's Technology | 23 | `itf-lec-week01.pdf` |
| สไลด์แล็บ — Windows 11 และ Command Prompt | 19 | `itf-lab-week01-windows.pdf` |
| ใบงานแล็บ 01 — ติดตั้งและใช้งาน Windows 11 | 3 | `itf-lab-week01-sheet.pdf` |

---

## สรุปอ่านสอบ

### 1. คอมพิวเตอร์และแบบจำลองหลักของวิชา

- **Digital literacy** = ความรู้และความเข้าใจปัจจุบันเกี่ยวกับคอมพิวเตอร์ อุปกรณ์พกพา เว็บ และเทคโนโลยีที่เกี่ยวข้อง
  มี 4 องค์ประกอบ: **Access · Use · Understand · Create**
- **Computer** = ชิ้นส่วนอิเล็กทรอนิกส์ (hardware) ที่ทำงานภายใต้ชุดคำสั่งที่เก็บใน**หน่วยความจำของตัวเอง** (software)
- แบบจำลองที่ใช้ทั้งวิชา: `Input (Data) → Process / Store → Output (Information)`

### 2. Data vs Information
| | Data | Information |
|---|---|---|
| คืออะไร | ข้อเท็จจริงดิบ ยังไม่จัดระเบียบ | ข้อมูลที่ประมวลผลแล้ว มีความหมาย |
| ตำแหน่งในแบบจำลอง | Input | Output |
| ตัวอย่างในสไลด์ | รายการอาหาร ราคา จำนวน เงินที่รับมา | ใบเสร็จ — ยอดรวม 695 บาท เงินทอน 305 บาท |

### 3. อุปกรณ์ในภาพรวม

- **Input** — keyboard, pointing device (trackball **1952** · mouse ของ Engelbart **1963** · Xerox Alto **1973**), microphone, webcam, **scanner** (light-sensing input device)
- **Output** — printer, 3D printer, display, speaker, headphone
- **Storage** — HDD, SSD, USB flash drive, optical disc, memory card, cloud storage
- **Memory** เก็บคำสั่งที่รอประมวลผล · **storage media** เก็บถาวร โดยมี storage device เป็นตัวอ่าน/เขียน

### 4. Internet, Web และ Search Engine
- **Internet** = เครือข่ายคอมพิวเตอร์ทั่วโลก · **Web** = บริการเอกสารที่วิ่งอยู่บน Internet
- เริ่มจาก **ARPANET** ปลายทศวรรษ 1960 เพื่อการทหาร แล้วขยายไปใช้สื่อสารระหว่างนักวิทยาศาสตร์
  4 โหนดแรก: UCLA · Stanford Research Institute · UCSB · University of Utah
- **Search engine** เก็บหน้าเว็บด้วย **crawler / spiderbot** เพื่อทำ web indexing

### 5. Artificial Intelligence
| ระดับ | ความสามารถ | สถานะ |
|---|---|---|
| **ANI** — Narrow | เก่งงานเดียว ทำงานนอกขอบเขตไม่ได้ | **มีอยู่จริงแบบเดียวในปัจจุบัน** เช่น Siri, ChatGPT |
| **AGI** — General | เท่ามนุษย์ ใช้ความรู้เดิมแก้ปัญหาใหม่โดยไม่ต้อง retrain | ทฤษฎี |
| **ASI** — Super | เหนือมนุษย์ มีอารมณ์ได้ | ทฤษฎีล้วน |

- ข้อมูลแบ่งเป็น **structured** (ตาราง ตัวเลข log) และ **unstructured** (ภาพ เสียง ข้อความ)
- Machine learning เป็นส่วนหนึ่งของ AI · deep learning เป็นส่วนหนึ่งของ machine learning

### 6. Digital Safety and Security — 4 หัวข้อ
1. **Virus และ malware อื่น** — ดูตารางด้านล่าง
2. **Privacy** — identity theft, cyberstalking, รหัสผ่านที่ดีต้อง strong · long · unique
3. **Health concern** — technology addiction · technology overload · office syndrome
4. **Environmental issues** — green computing: ประหยัดพลังงาน · monitor · maintenance · recycle · green disposal · cloud

| Malware | พฤติกรรม |
|---|---|
| Virus | แทรกตัวในแอป ทำงานเมื่อแอปถูกรัน |
| Worm | ทำสำเนาตัวเองแพร่ผ่านเครือข่าย |
| Trojan | ปลอมตัวเป็นโปรแกรมน่าใช้ — **ไม่ทำสำเนาตัวเอง** |
| Ransomware | ล็อกข้อมูลแล้วเรียกค่าไถ่ |
| Spyware · Keylogger | แอบเก็บกิจกรรม · ดักการกดแป้น |
| Adware | ยิงโฆษณาที่ไม่ต้องการ |

### 7. Software และการใช้งานเทคโนโลยี

- ชั้นซอฟต์แวร์: User → **Application software** → **System software** (OS + tools) → Hardware
- ผู้ใช้ 5 กลุ่ม: home · small office/home office · mobile · power · enterprise

---

## จุดที่มักพลาด

- **Internet ≠ Web** — Web เป็นแค่บริการหนึ่งบน Internet
- ANI คือ AI ชนิดเดียวที่มีจริง — ChatGPT ก็ยังเป็น ANI
- Trojan ไม่ replicate ต่างจาก virus และ worm
- Data อยู่ฝั่ง input · information อยู่ฝั่ง output — ไม่ใช่กลับกัน

---

## ทดสอบตัวเอง

1. ใบเสร็จที่เครื่องคิดเงินพิมพ์ออกมาเป็น data หรือ information
2. Digital literacy มี 4 องค์ประกอบอะไรบ้าง
3. มัลแวร์ที่ปลอมตัวเป็น screen saver และไม่ทำสำเนาตัวเองคืออะไร
4. ถ้าโจทย์ถามว่า "AI ชนิดเดียวที่มีอยู่จริงในปัจจุบัน" ต้องตอบข้อใด
5. Crawler ทำหน้าที่อะไรใน search engine

**เฉลย** — 1. information (ผ่านการประมวลผลแล้ว) · 2. Access, Use, Understand, Create ·
3. Trojan horse · 4. ANI (Artificial Narrow Intelligence) · 5. ไล่เก็บหน้าเว็บเพื่อทำดัชนี (web indexing)

---

## แล็บ — Windows 11 และ Command Prompt

> ย่อจากใบงานจริง ขั้นตอนเต็มให้ยึดไฟล์ PDF

**เตรียมเครื่อง** — สร้าง VM ใน Oracle VirtualBox ให้ผ่านสเปกขั้นต่ำของ Windows 11:
CPU อย่างน้อย 2 core · RAM อย่างน้อย 4 GB · ดิสก์อย่างน้อย 64 GB · เปิด **EFI** และ **TPM 2.0**
เลือกติดตั้ง Windows 11 Education ภาษา English (United States)

**คำสั่งที่ใช้** — `dir` · `cd` · `md` / `mkdir` · `rd /S` · `echo … >` (เขียนทับ) · `echo … >>` (ต่อท้าย) ·
`copy` · `move` · `ren` · `del` · `type` · `find` · `ipconfig` · `ping 8.8.8.8` · `winget search` / `winget install`

**งานที่ต้องให้ TA ตรวจ**
1. ติดตั้ง Windows 11 ให้ใช้งานได้
2. สร้างและย้ายไปยังโฟลเดอร์ตามที่ระบุ
3. สร้างไฟล์พร้อมข้อความตามที่ระบุ
4. ใช้ `ipconfig` ดู IP address และใช้ `ping`
5. ติดตั้งโปรแกรมผ่าน `winget`
