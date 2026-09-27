# สัปดาห์ที่ 8 · Database

> ผศ.ดร. พรสุรีย์ แจ่มศรี · สไลด์ Lecture 08 (26 หน้า) · แล็บ Microsoft Access และ SQL
>
> บทแรกของปลายภาค — ต่อยอดจากคำว่า record และ field ใน Week 7

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
| คู่มือแล็บ — Microsoft Access | 12 | `itf-lab-week08-access.pdf` |
| ฐานข้อมูลตัวอย่าง EmployeeDB | — | `itf-ref-week08-employee-db.accdb` |

---

## สรุปอ่านสอบ

### 1. ลำดับชั้นของข้อมูล

⭐⭐ `character → field → record → file → database`

| ระดับ | ความหมาย |
|---|---|
| Character | 1 byte = 8 bits แทนตัวอักษร ตัวเลข หรือสัญลักษณ์หนึ่งตัว (ASCII) |
| **Field** | กลุ่ม character ที่เกี่ยวข้องกัน · **หน่วยเล็กที่สุดที่ผู้ใช้เข้าถึง** · กำหนด field name, field size, data type |
| **Record** | กลุ่ม field ที่เกี่ยวข้องกัน · **primary key** = field ที่ไม่ซ้ำกันในแต่ละ record |
| Data file | กลุ่ม record ที่เกี่ยวข้องกัน |
| Database | กลุ่ม data file ที่เกี่ยวข้องกัน |

- ชนิดข้อมูล: text · number · **AutoNumber** (DBMS ใส่เลขไม่ซ้ำให้เอง) · currency · date · memo (long text) · hyperlink

### 2. File Maintenance และ Validation

- **File maintenance** = เพิ่ม · แก้ไข · ลบ record ให้ข้อมูลเป็นปัจจุบัน · ลบแล้วบาง DBMS ลบทันที บางตัวแค่ติด flag ไว้
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

- **DBMS** = ซอฟต์แวร์สร้าง เข้าถึง และจัดการฐานข้อมูล · **DBA** = ผู้ดูแลกิจกรรมฐานข้อมูลทั้งหมด
- **Data dictionary** (repository) เก็บข้อมูลเกี่ยวกับทุกไฟล์และทุก field
- เครื่องมือดึงข้อมูล 4 แบบ: **query language** (เช่น SQL) · **query by example** (QBE, หน้าจอ GUI) · **form** · **report writer**
- ความปลอดภัย: access privileges · **principle of least privilege** — ให้สิทธิ์เท่าที่หน้าที่ต้องใช้
- Backup & recovery: backup · log · recovery utility · continuous backup
- **Big data** — เป้าหมายคือหารูปแบบที่มีประโยชน์ในข้อมูล · ตัวอย่างในสไลด์: Netflix แนะนำหนังจากประวัติการดู

```sql
SELECT * FROM Fruits WHERE Fruit_Color = 'Red';
```

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

**เฉลย** — 1. character → field → record → file → database · 2. range check ·
3. redundant data และ isolated data · 4. multidimensional · 5. principle of least privilege

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
