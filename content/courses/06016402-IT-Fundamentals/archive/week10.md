# สัปดาห์ที่ 10 · Working in the Enterprise

> ผศ.ดร. พรสุรีย์ แจ่มศรี · สไลด์ Lecture 10 (49 หน้า) · แล็บ File Management
>
> ข้อสอบบทนี้ส่วนใหญ่เป็นการจับคู่ — ระบบสารสนเทศกับหน้าที่ และตำแหน่งงานกับคำอธิบาย

## อ่านจบแล้วต้องตอบได้

- บอกองค์ประกอบ 5 อย่างของ **information system**
- แยก **ERP · CMS · DMS · TPS · MIS · DSS · expert system** ตามหน้าที่
- จับคู่ OLTP กับ TPS และ OLAP กับ DSS
- บอกสายงานไอทีหลัก และจับคู่ชื่อตำแหน่งกับคำอธิบายงาน
- อธิบายว่า certification มีไว้ทำไม และแบ่งเป็นกลุ่มใดบ้าง

---

## เอกสารประจำสัปดาห์

| เอกสาร | หน้า | ไฟล์ในคลัง |
|---|:---:|---|
| สไลด์บรรยาย — Lecture 10 Working in the Enterprise | 49 | `itf-lec-week10-enterprise-2569.pdf` |

---

## สรุปอ่านสอบ

### 1. Information System ในองค์กร

- **Information system** = hardware · software · data · people · procedures ที่ทำงานร่วมกันเพื่อผลิตสารสนเทศ
- สารสนเทศต้อง**มีคุณค่า**จึงช่วยตัดสินใจได้ — จัดหมวด เรียง กรอง จัดรูปแบบ และตรงกับความต้องการของผู้ใช้
- องค์กรประกอบด้วยแผนกและฝ่ายต่าง ๆ เรียกรวมว่า **functional units** เช่น HR · บัญชี · วิศวกรรม · การผลิต · การตลาด · ขาย

### 2. ระบบในองค์กร

⭐⭐ ตารางนี้ใช้จับคู่ได้เกือบทุกข้อ

| ระบบ | หน้าที่ |
|---|---|
| **ERP** — Enterprise Resource Planning | รวมการไหลของข้อมูลทั้งองค์กร เพื่อประสานงานทุกกิจกรรม |
| **CMS** — Content Management System | เผยแพร่ แก้ไข จัดระเบียบ และเข้าถึงเอกสารหลายรูปแบบ · ใส่เนื้อหาผ่านหน้าเว็บ |
| **DMS** — Document Management System | เก็บและจัดการเอกสารของบริษัท · ควบคุมสิทธิ์ ติดตามเวอร์ชัน ค้นหา |
| **TPS** — Transaction Processing System | เก็บและประมวลผลธุรกรรมประจำวัน · ใช้ **OLTP** |
| **MIS** — Management Information System | ทำรายงานที่ถูกต้อง ทันเวลา เป็นระเบียบ ให้ผู้จัดการตัดสินใจและติดตามงาน |
| **DSS** — Decision Support System | ช่วยวิเคราะห์เพื่อตัดสินใจ · ใช้ข้อมูลทั้งภายในและภายนอก · ใช้ **OLAP** |
| **Expert system** | เก็บความรู้ของผู้เชี่ยวชาญ แล้วเลียนแบบการให้เหตุผลและตัดสินใจ |

- ตัวอย่างในสไลด์: MIS ทำ **detailed report** (รายชื่อผู้โดยสารเที่ยวบิน) และ **exception report** (เที่ยวบินที่ต่ำกว่าเป้า)
- ข้อมูลภายนอกของ DSS เช่น อัตราดอกเบี้ย แนวโน้มประชากร ราคาวัตถุดิบ

### 3. อาชีพสายเทคโนโลยี

- สายงานหลัก: management · research & software development · technical support · operations · training/support · information security · marketing/strategy
- ภาคธุรกิจ: ผลิตและจำหน่ายอุปกรณ์ · ซอฟต์แวร์และแอป · บริการและซ่อม · ขาย · การศึกษาและฝึกอบรม · IT consultant

| กลุ่มงาน | ตัวอย่างตำแหน่ง |
|---|---|
| System development | cloud architect · database designer · program/app developer · **systems analyst** · systems programmer · web designer · web developer |
| Operations | computer technician · **help desk specialist** · network administrator · technical project manager |
| Web marketing & social media | CRM specialist · social media marketing specialist · **SEO expert** · **UX designer** |
| Storage, retrieval & analysis | **data scientist** · database analyst · **database administrator** · digital forensics examiner · web analytics expert |
| Information & systems security | security specialist · network security administrator · security analyst · **digital forensics analyst** |
| App development & mobile | desktop/mobile app programmer · games designer · mobile strategist |

### 4. Certification และการหางาน

- **Certification** = หลักฐานว่ามีความรู้เฉพาะด้านต่อนายจ้าง · ต้องลงทั้งเวลาและเงิน · ตัวอย่างในสไลด์ **CISSP**
- กลุ่ม certification: application software · data analysis & database · hardware · networking · operating system · programmer/developer · security
- เครื่องมือหางาน: ฝ่ายแนะแนวอาชีพของมหาวิทยาลัย · เว็บวางแผนอาชีพ · social network อย่าง LinkedIn

---

## จุดที่มักพลาด

- **TPS ↔ OLTP · DSS ↔ OLAP** — จับคู่สลับกันเป็นตัวลวงบ่อย
- MIS **ทำรายงาน** · DSS **ช่วยวิเคราะห์** · expert system **เลียนแบบผู้เชี่ยวชาญ**
- CMS เน้นเผยแพร่เนื้อหา · DMS เน้นเก็บเอกสารพร้อมควบคุมเวอร์ชัน
- Database **administrator** ดูแล data dictionary และประสิทธิภาพ · database **analyst** วิเคราะห์การใช้ข้อมูล

---

## ทดสอบตัวเอง

1. ระบบใดเก็บธุรกรรมการจองตั๋วประจำวันแบบออนไลน์
2. ระบบใดเลียนแบบการตัดสินใจของผู้เชี่ยวชาญ
3. รายงานที่แสดงเฉพาะเที่ยวบินที่ต่ำกว่าเป้าเรียกว่าอะไร
4. ตำแหน่งใดเขียนเนื้อหาเว็บให้ขึ้นอันดับต้นของผลการค้นหา
5. Information system มีองค์ประกอบอะไรบ้าง

**เฉลย** — 1. TPS (OLTP) · 2. expert system · 3. exception report · 4. SEO expert ·
5. hardware, software, data, people, procedures

---

## แล็บ — File Management

> ใบงาน Lab 10 ยังไม่อยู่ในคลัง — เปิดจาก [OnLearn](https://onlearn.it.kmitl.ac.th/course/view.php?id=1766) · งานสัปดาห์นี้ส่งไฟล์แยกตามรอบแล็บ
