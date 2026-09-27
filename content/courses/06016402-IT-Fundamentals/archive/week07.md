# สัปดาห์ที่ 7 · Programs and Apps

> ผศ.ดร. พรสุรีย์ แจ่มศรี · สไลด์ Lecture 07 (83 หน้า) · แล็บ Excel 2 — IF และ VLOOKUP
>
> สไลด์ยาวที่สุดของครึ่งแรก แต่ข้อสอบวนอยู่ที่ 3 ตาราง: การได้มาซึ่งซอฟต์แวร์ · malware · เครื่องมือความปลอดภัย

## อ่านจบแล้วต้องตอบได้

- แยก program · application · operating system
- ท่องช่องทางการได้มาซึ่งซอฟต์แวร์ และแยก **shareware · freeware · open source · public domain**
- จับคู่ productivity และ graphics application กับงานที่มันทำ
- อธิบายวงจรของ virus และแยก **worm · trojan horse · rootkit**
- บอก internet filter 4 ชนิด และเครื่องมือจัดการไฟล์/ดิสก์ที่สำคัญ

---

## เอกสารประจำสัปดาห์

| เอกสาร | หน้า | ไฟล์ในคลัง |
|---|:---:|---|
| สไลด์บรรยาย — Lecture 07 Programs and Apps | 83 | `itf-lec-week07-programs-apps.pdf` |
| คู่มือแล็บ — Excel 2 (IF และ VLOOKUP) | 6 | `lab07-2569-microsoft-excel-2.pdf` |
| โจทย์แล็บ — รายงานค่าคอมมิชชัน | 1 | `itf-lab-week07-instruction.pdf` |
| ไฟล์ข้อมูลตั้งต้น (Excel) | — | `itf-ref-week07-lab-data.xlsx` |

---

## สรุปอ่านสอบ

### 1. Program, App และ OS

- **Program (software)** = ชุดคำสั่งที่บอกคอมพิวเตอร์ว่าต้องทำอะไรและทำอย่างไร
- **Application** = โปรแกรมที่ช่วยให้ผู้ใช้ทำงานได้มากขึ้นหรือช่วยงานส่วนตัว
- **OS** เป็นตัวกลางระหว่างผู้ใช้ · แอป · ฮาร์ดแวร์

### 2. การได้มาซึ่งซอฟต์แวร์

⭐⭐⭐ ตารางนี้ออกสอบแน่นอน

| ประเภท | ลิขสิทธิ์ / ค่าใช้จ่าย | จุดจำ |
|---|---|---|
| Retail | มีลิขสิทธิ์ · ซื้อ | ผลิตจำนวนมากสำหรับผู้ใช้ทั่วไป |
| Custom | จ้างทำ · แพงกว่า retail | ทำเฉพาะธุรกิจหนึ่ง |
| Web app | — | อยู่บน web server เปิดผ่าน browser |
| Mobile app / mobile web app | — | โหลดจาก app store · หรือเป็น web app ที่ปรับจอด้วย responsive design |
| **Shareware** | มีลิขสิทธิ์ · ฟรีช่วงทดลอง | ใช้ต่อต้องจ่าย |
| **Freeware** | มีลิขสิทธิ์ · ฟรี | ผู้ให้**ยังสงวนสิทธิ์ทั้งหมด** |
| **Open source** | ไม่จำกัดการแก้และแจกต่อ | ใช้ แก้ไข เผยแพร่ต่อได้ |
| **Public domain** | **ไม่มีลิขสิทธิ์เลย** | บริจาคให้สาธารณะ |

### 3. แอปพลิเคชันกลุ่มต่าง ๆ

- **Productivity** 13 ประเภท: word processing · presentation · spreadsheet · database · note taking · calendar & contact ·
  project management · accounting · personal finance · legal · tax preparation · document management · enterprise computing
- ขั้นตอนทำงาน: create → edit → format → save → distribute
- Spreadsheet: **cell** = จุดตัดคอลัมน์กับแถว เช่น B4 · **formula** ผู้ใช้เขียนเอง · **function** สูตรสำเร็จรูป เช่น `=SUM()`
- Database: **record = แถว** · **field = คอลัมน์** · DBMS สร้าง form และ report
- **Software suite** = หลายแอปขายรวมกัน — Microsoft 365 · Google Workspace · Adobe Creative Cloud
- Document management แปลงเอกสารเป็นรูปแบบที่ใครก็เปิดได้ เช่น **PDF**
- **Graphics & media**: CAD · desktop publishing · paint / image editing · photo editing · video & audio editing · multimedia & website authoring · media player
- **Communications** เช่น blog (เรียงย้อนเวลา) · chat · email · file transfer · internet phone · instant messaging · videoconference · web feeds

### 4. Malware และเครื่องมือความปลอดภัย

⭐⭐⭐ ตาราง malware และ filter ออกสอบบ่อย

- Virus ต้อง replicate · conceal · monitor เหตุการณ์ · deliver **payload**
- ระยะติดเชื้อ: replicate (แนบไฟล์โปรแกรม) → conceal → รอ trigger เช่น วันที่ในนาฬิกาเครื่อง
- ไวรัสที่อันตรายที่สุดคือตัวที่**ไม่มี payload ให้เห็น** แต่แก้ไฟล์เงียบ ๆ

| Malware | จุดจำ |
|---|---|
| **Worm** | อยู่ใน active memory · สำเนาตัวเองผ่านเครือข่าย จนทรัพยากรหมด |
| **Trojan horse** | ปลอมเป็นโปรแกรมจริง เช่น screen saver · **ไม่สำเนาตัวเอง** |
| **Rootkit** | ซ่อนตัวและให้คนอื่นควบคุมเครื่องจากระยะไกล · ต้องใช้ซอฟต์แวร์พิเศษกำจัด |
| Spyware · Adware | แอบเก็บข้อมูลส่งออก · แสดงโฆษณา pop-up |

- เครื่องมือ: **antivirus** · **personal firewall** กันการบุกรุก · spyware / adware remover · **internet filter**
- Internet filter 4 ชนิด: **anti-spam** · **web filter** · **phishing filter** · **pop-up / pop-under blocker**

### 5. File, Disk and System Management Tools

- file manager · search tool · image viewer · **uninstaller** · **disk cleanup** (ลบไฟล์ไม่จำเป็น) ·
  **disk defragmenter** (จัดไฟล์บนฮาร์ดดิสก์ใหม่ให้อ่านเร็วขึ้น) · screen saver · file compression · PC maintenance · backup · restore

---

## จุดที่มักพลาด

- **Freeware ยังมีลิขสิทธิ์** · public domain ไม่มีเลย · open source แก้ไขได้ — สามตัวนี้คือตัวลวงหลัก
- Shareware ≠ freeware — shareware ฟรีแค่ช่วงทดลอง
- Trojan ไม่ replicate · worm replicate ผ่านเครือข่าย · virus แนบกับไฟล์โปรแกรม
- Disk cleanup **ลบ**ไฟล์ · defragmenter **จัดเรียง**ไฟล์ — ไม่ได้ลบ
- Formula เขียนเอง · function กำหนดไว้แล้ว

---

## ทดสอบตัวเอง

1. ซอฟต์แวร์ที่แจกฟรีแต่ผู้พัฒนายังสงวนสิทธิ์ทั้งหมดเรียกว่าอะไร
2. มัลแวร์ใดทำให้โฟลเดอร์ดูว่างเปล่าเพื่อซ่อนตัว และให้คนอื่นควบคุมเครื่องได้
3. เครื่องมือใดจัดเรียงไฟล์บนฮาร์ดดิสก์ใหม่ให้โปรแกรมรันเร็วขึ้น
4. อีเมลหลอกขอข้อมูลบัตรเครดิตควรถูกกันด้วย filter ชนิดใด
5. ใน database หนึ่งแถวเรียกว่าอะไร

**เฉลย** — 1. freeware · 2. rootkit · 3. disk defragmenter · 4. phishing filter · 5. record

---

## แล็บ — Excel 2

> ย่อจากคู่มือและโจทย์จริง ขั้นตอนเต็มให้ยึดไฟล์ PDF

**สิ่งที่คู่มือสอน**
- `=IF(logical_test, value_if_true, [value_if_false])` — ข้อความในสูตรต้องมีเครื่องหมายคำพูด · IF ซ้อนกันได้ถึง 64 ระดับ ·
  ตัวดำเนินการ `<` `>` `<=` `>=` `<>` `=` · `#NAME?` มักแปลว่าสะกดสูตรผิด
- `=VLOOKUP(lookup_value, table_array, col_index_num, [range_lookup])` — ค่าที่หาต้องอยู่คอลัมน์แรกของตาราง ·
  `FALSE` = ตรงเป๊ะ · `TRUE` = ใกล้เคียง (ตารางต้องเรียงแล้ว) · ถ้าตารางอยู่คนละชีทใช้ `Sheet2!$F$1:$H$7`

**โจทย์** — ทำรายงานค่าตอบแทนพนักงานขายไตรมาส 3 ปี 2026 จากไฟล์ข้อมูลตั้งต้น:
ยอดขายรายเดือนอยู่ในชีท July / August / September 2026 · อัตราคอมมิชชันรายเดือนในชีท `CommissionRate` ·
โบนัสรายไตรมาสในชีท `BonusRate` — แสดงยอดขายรายไตรมาส โบนัส เงินที่บริษัทต้องจ่าย และกราฟที่เหมาะสม
