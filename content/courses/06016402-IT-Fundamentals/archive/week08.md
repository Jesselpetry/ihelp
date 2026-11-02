# สัปดาห์ที่ 8 · Database

> ผศ.ดร. พรสุรีย์ แจ่มศรี · สไลด์ Lecture 08 (26 หน้า) · แล็บ Microsoft Access และ SQL
>
> บทแรกของปลายภาค — ต่อยอดจากคำว่า record และ field ใน Week 7

> **ระดับความเน้นสอบปลายภาค ⭐ อ่านผ่าน จำคีย์เวิร์ด** — มาจากสรุปของเพื่อนร่วมรุ่น ไม่ใช่ประกาศของผู้สอน · สไลด์ฉบับแปลไทยทีละหัวข้อ: `itf-sheet-week08-database-th.pdf` · [โน้ตสรุปของ Tammadon Suksa (IT24) บน Notion](https://app.notion.com/p/ITF-407363d85cea806abdc6c9ec2254f668) — ฉบับเต็มพร้อมรูปอยู่ [ท้ายหน้า](#โน้ตสรุปจาก-notion-tammadon-suksa-it24)

## อ่านจบแล้วต้องตอบได้

- เรียง **ลำดับชั้นข้อมูล** จาก character ถึง database และบอกว่า primary key คืออะไร
- บอกชนิดข้อมูลของ field และวิธี **validation** แต่ละแบบ
- เทียบ **file processing system กับ database approach** ทั้งข้อดีและข้อเสีย
- แยก relational · object-oriented · multidimensional database
- บอกเครื่องมือของ DBMS และเขียน SQL `SELECT … FROM … WHERE` ได้

---

## เอกสารประจำสัปดาห์

| เอกสาร | หน้า | ไฟล์ในคลัง |
|---|:---:|---|
| สไลด์บรรยาย — Lecture 08 Database | 26 | `itf-lec-week08-database-2569.pdf` |
| สรุปฉบับแปลไทย — Week 08 ฐานข้อมูล | 1 | `itf-sheet-week08-database-th.pdf` |
| คู่มือแล็บ — Microsoft Access | 12 | `itf-lab-week08-access.pdf` |
| ฐานข้อมูลตัวอย่าง EmployeeDB | — | `itf-ref-week08-employee-db.accdb` |

---

## สรุปอ่านสอบ

### 1. ลำดับชั้นของข้อมูล

⭐⭐ `character → field → record → file → database`

| ระดับ | ความหมาย |
|---|---|
| **Bit** | หน่วยข้อมูลเล็กที่สุดที่คอมพิวเตอร์ประมวลผลได้ (0 หรือ 1) · 8 bits = 1 byte |
| Character | 1 byte = 8 bits แทนตัวอักษร ตัวเลข หรือสัญลักษณ์หนึ่งตัว (ASCII) |
| **Field** | กลุ่ม character ที่เกี่ยวข้องกัน · **หน่วยเล็กที่สุดที่ผู้ใช้เข้าถึง** · กำหนด field name, field size, data type |
| **Record** | กลุ่ม field ที่เกี่ยวข้องกัน · **primary key** = field ที่ไม่ซ้ำกันในแต่ละ record |
| Data file | กลุ่ม record ที่เกี่ยวข้องกัน |
| Database | กลุ่ม data file ที่เกี่ยวข้องกัน |

- **Data** = ข้อความ ตัวเลข ภาพ เสียง วิดีโอที่ยังไม่ประมวลผล · **Information** = data ที่ประมวลผลแล้ว มีลักษณะ **organized · meaningful · useful** · **Database** = ข้อมูลที่จัดระเบียบไว้ให้เข้าถึงและนำไปใช้ต่อได้
- ชนิดข้อมูล: text · number · **AutoNumber** (DBMS ใส่เลขไม่ซ้ำให้เอง) · currency · date · memo (long text) · hyperlink

### 2. File Maintenance และ Validation

- **File maintenance** = เพิ่ม · แก้ไข · ลบ record ให้ข้อมูลเป็นปัจจุบัน · ลบแล้วบาง DBMS ลบทันที บางตัวแค่ติด flag ไว้ (**flagged / marked record** = ทำเครื่องหมายว่าถูกลบ ไม่ให้นำไปประมวลผลอีก)
- **Validation** = เทียบข้อมูลกับกฎที่ตั้งไว้

| Check | ตรวจอะไร |
|---|---|
| Alphabetic / numeric | ใส่ได้เฉพาะตัวอักษร หรือเฉพาะตัวเลข |
| **Range** | ตัวเลขอยู่ในช่วงที่กำหนด |
| **Consistency** | ข้อมูลใน 2 field ขึ้นไปสัมพันธ์กันอย่างสมเหตุสมผล |
| **Completeness** | field ที่บังคับต้องไม่ว่าง |
| **Check digit** | ตัวเลขที่ต่อท้าย primary key เพื่อตรวจความถูกต้อง |

### 3. File Processing vs Database Approach

⭐⭐ ข้อดีข้อเสียของ database approach ออกบ่อย

- **File processing** — แต่ละแผนกมีไฟล์ของตัวเอง · จุดอ่อน 2 ข้อ: **redundant data** (ข้อมูลซ้ำ) และ **isolated data** (ข้ามแผนกเข้าถึงยาก)
- **Database approach** — หลายโปรแกรมและผู้ใช้แชร์ฐานข้อมูลเดียว

| ข้อดี | ข้อเสีย |
|---|---|
| ลดความซ้ำซ้อน · ข้อมูลถูกต้องสมบูรณ์ขึ้น (integrity) · แชร์ข้อมูลได้ · เข้าถึงง่าย · พัฒนาเร็วขึ้น | ซับซ้อนกว่า · ใช้ memory และพลังประมวลผลมากกว่า · ข้อมูลเสี่ยงกว่า |

### 4. ประเภทฐานข้อมูลและ DBMS

| Data model | เก็บข้อมูลแบบ | ใช้กับ |
|---|---|---|
| **Relational** | ตาราง แถว × คอลัมน์ | เงินเดือน บัญชี สต็อก ใบแจ้งหนี้ |
| **Object-oriented** | object | สื่อ ภาพ เสียง วิดีโอ |
| **Multidimensional** | มากกว่า 2 มิติ | **data warehouse** วิเคราะห์ธุรกรรมย้อนหลัง |

- **DBMS** = ซอฟต์แวร์สร้าง เข้าถึง และจัดการฐานข้อมูล (เพิ่ม แก้ไข ลบ ค้นหา ทำฟอร์ม/รายงาน โดยผู้ใช้ไม่แตะไฟล์ข้อมูลตรง ๆ) · **DBA** = ผู้ดูแลกิจกรรมฐานข้อมูลทั้งหมด
- **Data dictionary** (repository) เก็บข้อมูลเกี่ยวกับทุกไฟล์และทุก field
- เครื่องมือดึงข้อมูล 4 แบบ: **query language** (เช่น SQL) · **query by example** (QBE, หน้าจอ GUI) · **form** · **report writer**
- **SQL** ใช้ทำ **CRUD**: Create/`INSERT` · Read/`SELECT` · `UPDATE` · `DELETE`
- ความปลอดภัย: access privileges · **principle of least privilege** — ให้สิทธิ์เท่าที่หน้าที่ต้องใช้
- Backup & recovery: backup · log · recovery utility · continuous backup
- **Big data** — เป้าหมายคือหารูปแบบที่มีประโยชน์ในข้อมูล · ตัวอย่างในสไลด์: Netflix แนะนำหนังจากประวัติการดู
- **5Vs** ของ big data: **Volume** (ปริมาณ) · **Velocity** (ความเร็ว/real-time) · **Variety** (ความหลากหลาย) · **Value** (คุณค่า/นำไปตัดสินใจได้) · **Veracity** (ความน่าเชื่อถือ)

```sql
SELECT * FROM Fruits WHERE Fruit_Color = 'Red';
```

### คีย์เวิร์ดต้องจำ

- **Bit** = 0/1 เล็กสุด · 8 bits = **byte** = 1 character
- **Field** = หน่วยเล็กสุดที่ผู้ใช้เข้าถึง · **record** = กลุ่ม field · **primary key** = field ไม่ซ้ำ
- **Data** (ดิบ) → **information** (organized · meaningful · useful)
- **Redundant data** (ซ้ำ) + **isolated data** (แยกโดด) = จุดอ่อน file processing
- **Integrity** · **shared data** = ข้อดี database approach · ข้อเสีย: ซับซ้อน ใช้ทรัพยากรมาก เสี่ยงกว่า
- **Validation 5 แบบ**: alphabetic/numeric · range · consistency · completeness · check digit
- **Flagged / marked record** = ติดเครื่องหมายว่าลบ ไม่ลบทิ้งทันที
- **Relational** (table: row/tuple × column/attribute) · **OODB** (object, สื่อ) · **multidimensional** (data warehouse)
- **DBMS** ซอฟต์แวร์จัดการ · **DBA** ผู้ดูแล · **data dictionary** = metadata ของทุกไฟล์และ field
- เครื่องมือ query: **SQL** · **QBE** · **form** · **report writer**
- **CRUD** = Create/Insert · Read/Select · Update · Delete
- **Principle of least privilege** · backup · log · recovery · continuous backup
- **Big data 5Vs**: Volume · Velocity · Variety · Value · Veracity

---

## จุดที่มักพลาด

- **Field** เป็นหน่วยเล็กสุดที่ผู้ใช้เข้าถึง — ไม่ใช่ character
- Consistency check ดู **ความสัมพันธ์ระหว่าง field** · range check ดูตัวเลขใน field เดียว
- จุดอ่อนของ file processing คือ redundant **และ** isolated data — ต้องได้ทั้งสองคำ
- Multidimensional ใช้กับ data warehouse · object-oriented ใช้กับไฟล์สื่อ

---

## ทดสอบตัวเอง

1. เรียงลำดับชั้นข้อมูลจากเล็กไปใหญ่
2. การตรวจว่าช่อง "อายุ" ต้องอยู่ระหว่าง 0–120 คือ validation แบบใด
3. จุดอ่อน 2 ข้อของ file processing system คืออะไร
4. ฐานข้อมูลชนิดใดเหมาะกับ data warehouse
5. หลักการให้สิทธิ์ผู้ใช้เท่าที่จำเป็นต่อหน้าที่เรียกว่าอะไร
6. Information ต่างจาก data อย่างไร
7. 5Vs ของ big data คืออะไรบ้าง

**เฉลย** — 1. character → field → record → file → database · 2. range check ·
3. redundant data และ isolated data · 4. multidimensional · 5. principle of least privilege · 6. information คือ data ที่ผ่านการประมวลผลแล้ว (organized, meaningful, useful) ·
7. Volume, Velocity, Variety, Value, Veracity

---

## แล็บ — Microsoft Access

> ย่อจากคู่มือจริง ขั้นตอนเต็มให้ยึดไฟล์ PDF

**สิ่งที่คู่มือสอน** — Access เป็น relational database ในชุด Microsoft 365 ·
สร้างฐานข้อมูลเปล่า → สร้างตาราง (field มีชนิดข้อมูลเดียว · record ควรมี primary key) ·
สลับ **Datasheet View** กับ **Design View** (ตั้ง primary key ใน Design View) · import ข้อมูลจาก Excel ·
แก้และลบ record · สร้าง report

**SQL ที่ใช้**

| ส่วน | ใช้ทำอะไร |
|---|---|
| `SELECT` | เลือก attribute ที่จะดึง |
| `FROM` | ระบุตาราง |
| `WHERE` | เงื่อนไขการดึง |
| `GROUP BY` · `HAVING` | รวมกลุ่ม · เงื่อนไขของกลุ่ม |
| `ORDER BY … DESC / ASC` | เรียงมากไปน้อย / น้อยไปมาก |

ทุกคำสั่งจบด้วย `;` — ใช้ฐานข้อมูลตัวอย่าง EmployeeDB ในตารางเอกสารด้านบนฝึกได้

---

## โน้ตสรุปจาก Notion · Tammadon Suksa (IT24)

> ขอบคุณ **Tammadon Suksa (IT24)** ที่สรุปและแชร์โน้ตชุดนี้ · คัดลอกจาก [ITF Week 8 บน Notion](https://app.notion.com/p/40b363d85cea800bb221e074cbeff094) เมื่อ 1 พ.ย. 2569 พร้อมรูปประกอบ (ภาพสไลด์ของผู้สอนที่ผู้สรุปเขียนโน้ตทับ) · เนื้อหาเป็นสำนวนของผู้สรุป ถ้าต่างจากสไลด์ให้ยึดสไลด์ · จุดที่ iHelp ตรวจแล้วคลาดเคลื่อนมี ⚠️ กำกับไว้

### 1. Databases, Data, and Information

- **Data (ข้อมูล)**: ข้อความ ตัวเลข ภาพ เสียง หรือวิดีโอที่ยังไม่ผ่านการประประมวลผล
- **Database (ฐานข้อมูล)**: กลุ่มของข้อมูลที่ถูกจัดระเบียบไว้อย่างเป็นระบบเพื่อให้เข้าถึง เรียกใช้ และนำไปใช้ต่อได้
- **Information (สารสนเทศ)**: ข้อมูลที่ผ่านการประมวลผลแล้ว มีลักษณะ **Organized** (มีระเบียบ), **Meaningful** (มีความหมาย) และ **Useful** (นำไปใช้ประโยชน์ได้)
- **DBMS (Database Management System)**: ซอฟต์แวร์ที่ช่วยสร้าง เพิ่ม แก้ไข ลบ ค้นหา จัดเรียง สร้างฟอร์ม และรายงานข้อมูล โดยผู้ใช้ไม่ต้องเข้าถึงไฟล์ข้อมูลโดยตรง

---

### 2. The Hierarchy of Data (ลำดับชั้นของข้อมูล)

ลำดับจากเล็กไปใหญ่: **Bit ➔ Byte / Character ➔ Field ➔ Record ➔ Data File ➔ Database**
- **Bit**: หน่วยข้อมูลที่เล็กที่สุดที่คอมพิวเตอร์ประมวลผลได้ (0 หรือ 1)
- **Byte / Character**: กลุ่มของ 8 bits รวมกันเป็น 1 byte ซึ่งแทน 1 ตัวอักษร ตัวเลข หรือสัญลักษณ์
- **Field**: การรวมกันของตัวอักษรหรือ bytes เป็นหน่วยข้อมูลที่เล็กที่สุดที่ผู้ใช้เข้าถึงได้ โดยมี **Field Name**, **Field Size** (จำนวนอักขระสูงสุด) และ **Data Type** (ชนิดข้อมูล เช่น Text, Number, AutoNumber, Currency, Date/Time, Memo/Long Text, Hyperlink)
- **Record**: กลุ่มของ Fields ที่เกี่ยวข้องกัน
  - **Primary Key (คีย์หลัก)**: Field ที่ใช้ระบุแต่ละ Record เอกลักษณ์เฉพาะตัว ไม่ซ้ำกัน
- **Data File**: กลุ่มของ Records ที่เกี่ยวข้องกัน
- **Database**: กลุ่มของ Data Files ที่เกี่ยวข้องกัน

![Week 8 รูปที่ 1 — สไลด์ประกอบโน้ต](/notes/itf/week08/01.webp)

---

### 3. File Maintenance (การบำรุงรักษาไฟล์)

กระบวนการปรับปรุงข้อมูลให้เป็นปัจจุบัน ประกอบด้วย **Add** (เพิ่ม), **Modify** (แก้ไข/ปรับปรุง) และ **Delete** (ลบข้อมูลที่ไม่ต้องการแล้ว)
- **Flagged / Marked Record**: เทคนิคที่ DBMS ทำเครื่องหมายไว้ว่าถูกลบ เพื่อไม่ให้นำมาประมวลผลอีก (แทนที่จะลบทิ้งทันที)

---

### 4. Validating Data (การตรวจสอบความถูกต้องของข้อมูล)

กระบวนการเปรียบเทียบข้อมูลกับกฎหรือเงื่อนไข (Validity check) เพื่อป้องกันข้อมูลผิดพลาด:
- **Alphabetic / Numeric Check**: ตรวจสอบว่าเป็นตัวอักษรล้วน หรือตัวเลขล้วน
- **Range Check**: ตรวจสอบว่าตัวเลขอยู่ในช่วงที่กำหนดหรือไม่
- **Consistency Check**: ตรวจสอบความสอดคล้องระหว่าง 2 Fields ขึ้นไปว่าตรรกะถูกต้องหรือไม่
- **Completeness Check**: ตรวจสอบว่า Field ที่จำเป็นได้กรอกข้อมูลหรือไม่ (ห้ามเว้นว่าง)
- **Check Digit**: ตัวเลขหรืออักขระที่ต่อท้าย Primary Key เพื่อตรวจสอบความถูกต้อง

---

### 5. File Processing Systems vs. The Database Approach

- **File Processing Systems (ระบบไฟล์แบบดั้งเดิม)**: แต่ละแผนกเก็บไฟล์แยกกัน มีข้อเสียหลัก 2 อย่าง:
  - **Redundant data**: ข้อมูลซ้ำซ้อน เพิ่มโอกาสเกิดข้อผิดพลาด
  - **Isolated data**: ข้อมูลถูกแยกโดดเดี่ยว เข้าถึงยาก
- **Database Approach (วิธีฐานข้อมูล)**: ใช้งานข้อมูลร่วมกัน
  - **ข้อดี**: ลดความซ้ำซ้อน (**Reduced data redundancy**), เพิ่มความสมบูรณ์ของข้อมูล (**Improved data integrity**), ใช้ข้อมูลร่วมกันได้ (**Shared data**), เข้าถึงง่าย และลดเวลาพัฒนา
  - **ข้อเสีย**: ซับซ้อนกว่า, ใช้หน่วยความจำ/กำลังประมวลผลสูงกว่า และอาจมีความเสี่ยงด้านความปลอดภัยสูงขึ้น

---

### 6. Types of Databases / Data Models

- **Data Model**: กำหนดมุมมองการจัดระเบียบข้อมูลของผู้ใช้ มี 3 แบบหลัก:
  - **Relational Database**: จัดเก็บข้อมูลเป็น **Tables** ประกอบด้วย **Rows (Tuples)** และ **Columns (Attributes/Fields)**
  - **Object-Oriented Database (OODB)**: จัดเก็บข้อมูลในรูปแบบ **Objects** เหมาะกับสื่อมัลติมีเดีย ภาพ เสียง วิดีโอ
  - **Multidimensional Database**: จัดเก็บข้อมูลมากกว่า 2 มิติ นิยมใช้ใน **Data Warehouse** สำหรับวิเคราะห์ข้อมูลในอดีตและปัจจุบัน

  ![Week 8 รูปที่ 2 — สไลด์ประกอบโน้ต](/notes/itf/week08/02.webp)

---

### 7. Database Management Systems (DBMS) & Tools

- **DBA (Database Administrator)**: ผู้รับผิดชอบบริหารและประสานงานกิจกรรมฐานข้อมูลทั้งหมด ทั้งการพัฒนา การบำรุงรักษา และสิทธิการใช้งาน
- **Data Dictionary / Repository**: คลังเก็บข้อมูลเกี่ยวกับโครงสร้างไฟล์และฟิลด์ทั้งหมด (Metadata)
- **การสอบถามข้อมูล (Query)**: คำขอข้อมูลเฉพาะจากฐานข้อมูลผ่านเครื่องมือต่างๆ เช่น:
  - **SQL (Structured Query Language)**: ภาษามาตรฐานสำหรับสั่งการคำสั่ง **CRUD** (`CREATE/INSERT`, `READ/SELECT`, `UPDATE`, `DELETE`)
  - **QBE (Query by Example)**: เครื่องมือช่วยสร้างคำถามผ่านหน้าจอ Graphical User Interface
  - **Forms**: หน้าต่างสำหรับกรอกหรือแก้ไขข้อมูล
  - **Report Writer**: เครื่องมือออกแบบและพิมพ์รายงาน
- **Data Security & Recovery**:
  - **Access privileges / Principle of least privilege policy**: การกำหนดสิทธิตามภาระหน้าที่
  - **Backup, Log, Recovery utility, Continuous backup**: เทคนิคคืนสภาพฐานข้อมูลเมื่อเกิดความเสียหาย

---

### 8. Big Data

- **เป้าหมาย**: ค้นหาความสัมพันธ์หรือรูปแบบที่เป็นประโยชน์ (Patterns or models) ในข้อมูลขนาดใหญ่
- **คุณลักษณะ 5Vs**: **Volume** (ปริมาณมหาศาล), **Velocity** (ความเร็วแบบ Real-time), **Variety** (ความหลากหลายของรูปแบบ), **Value** (มูลค่า/แปลงเป็นข้อสรุปที่ใช้ตัดสินใจได้) และ **Veracity** (ความน่าเชื่อถือ/ถูกต้อง)
- **ตัวอย่าง**: Netflix ใช้ Big Data วิเคราะห์ประวัติการรับชมเพื่อแนะนำหนังเรื่องถัดไป
