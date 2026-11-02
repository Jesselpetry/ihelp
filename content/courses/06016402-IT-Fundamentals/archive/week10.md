# สัปดาห์ที่ 10 · Working in the Enterprise

> ผศ.ดร. พรสุรีย์ แจ่มศรี · สไลด์ Lecture 10 (49 หน้า) · แล็บ File Management
>
> ข้อสอบบทนี้ส่วนใหญ่เป็นการจับคู่ — ระบบสารสนเทศกับหน้าที่ และตำแหน่งงานกับคำอธิบาย

> **ระดับความเน้นสอบปลายภาค ⭐ อ่านผ่าน จำคีย์เวิร์ด** — มาจากสรุปของเพื่อนร่วมรุ่น ไม่ใช่ประกาศของผู้สอน · สไลด์ฉบับแปลไทยทีละหัวข้อ: `itf-sheet-week10-enterprise-th.pdf` · [โน้ตสรุปของ Tammadon Suksa (IT24) บน Notion](https://app.notion.com/p/ITF-407363d85cea806abdc6c9ec2254f668) — ฉบับเต็มพร้อมรูปอยู่ [ท้ายหน้า](#โน้ตสรุปจาก-notion-tammadon-suksa-it24)

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
| สรุปฉบับแปลไทย — Week 10 การทำงานในองค์กร | 1 | `itf-sheet-week10-enterprise-th.pdf` |
| ใบงานแล็บ — File Management | 10 | `itf-lab-week10-file-management-sheet.pdf` |

---

## สรุปอ่านสอบ

### 1. Information System ในองค์กร

- **Information system** = hardware · software · data · people · procedures ที่ทำงานร่วมกันเพื่อผลิตสารสนเทศ
- สารสนเทศต้อง**มีคุณค่า**จึงช่วยตัดสินใจได้ — จัดหมวด เรียง กรอง จัดรูปแบบ และตรงกับความต้องการของผู้ใช้
- **Valuable information 7 ข้อ**: **accurate** (ถูกต้อง) · **verifiable** (ตรวจสอบได้) · **timely** (ทันเวลา) · **organized** (เป็นระบบ) · **accessible** (เข้าถึงได้) · **useful** (มีประโยชน์) · **cost-effective** (คุ้มค่า)
- องค์กรประกอบด้วยแผนกและฝ่ายต่าง ๆ เรียกรวมว่า **functional units** เช่น HR · บัญชี · วิศวกรรม · การผลิต · การตลาด · ขาย

### 2. ระบบในองค์กร

⭐⭐ ตารางนี้ใช้จับคู่ได้เกือบทุกข้อ

| ระบบ | หน้าที่ |
|---|---|
| **ERP** — Enterprise Resource Planning | รวมการไหลของข้อมูลทั้งองค์กร เพื่อประสานงานทุกกิจกรรม |
| **CMS** — Content Management System | เผยแพร่ แก้ไข จัดระเบียบ และเข้าถึงเอกสารหลายรูปแบบ · ใส่เนื้อหาผ่านหน้าเว็บ |
| **DMS** — Document Management System | เก็บและจัดการเอกสารของบริษัท · ควบคุมสิทธิ์ ติดตามเวอร์ชัน ค้นหา |
| **TPS** — Transaction Processing System | เก็บและประมวลผลธุรกรรมประจำวัน · ใช้ **OLTP** (ประมวลผลทันที/real-time เช่น ระบบจองตั๋ว) · อีกแบบคือ **batch processing** (สะสมรายการไว้แล้วประมวลผลเป็นงวด — *ยังไม่ยืนยันในสไลด์*) |
| **MIS** — Management Information System | ทำรายงานที่ถูกต้อง ทันเวลา เป็นระเบียบ ให้ผู้จัดการตัดสินใจและติดตามงาน |
| **DSS** — Decision Support System | ช่วยวิเคราะห์เพื่อตัดสินใจ · ใช้ข้อมูลทั้งภายในและภายนอก · ใช้ **OLAP** (วิเคราะห์ข้อมูลหลายมิติ) |
| **Expert system** | เก็บความรู้ของผู้เชี่ยวชาญ แล้วเลียนแบบการให้เหตุผลและตัดสินใจ · ประกอบด้วย **knowledge base** + **inference engine** (ตัวอย่างในสไลด์: Restaurant Advisor) |

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

| Certification (สไลด์ Top 15 IT Certifications) | เรื่อง |
|---|---|
| **CISSP** — Certified Information Systems Security Professional | ความมั่นคงปลอดภัยสารสนเทศ (เหมาะกับผู้มีประสบการณ์ด้าน security) |
| **CCNA** — Cisco Certified Network Associate | พื้นฐานเครือข่าย · IP services · security |
| **CompTIA A+** | เริ่มต้นสายไอที — hardware · OS · network |
| **CEH** — Certified Ethical Hacker | เจาะระบบอย่างมีจริยธรรมเพื่อเรียนรู้วิธีป้องกัน |
| **PMP** — Project Management Professional (PMI) | บริหารโครงการ |
| **CISA** — Certified Information Systems Auditor (ISACA) | ตรวจสอบระบบสารสนเทศ |

### คีย์เวิร์ดต้องจำ

- **Information system** = hardware · software · data · people · procedures
- **Valuable information 7 ข้อ**: accurate · verifiable · timely · organized · accessible · useful · cost-effective
- **Functional units** = แผนก/ฝ่ายในองค์กร (HR · บัญชี · ผลิต · ตลาด · ขาย)
- **ERP** = รวม data flow ทั้งองค์กร · **CMS** = เผยแพร่เนื้อหา · **DMS** = เก็บเอกสาร + version + สิทธิ์
- **TPS ↔ OLTP** (real-time) · batch = สะสมแล้วประมวลผลเป็นงวด
- **MIS** = รายงาน (detailed · summary · exception)
- **DSS ↔ OLAP** · ใช้ข้อมูลภายใน + ภายนอก
- **Expert system** = knowledge base + inference engine
- **Systems analyst** · **help desk specialist** · **SEO expert** · **UX designer** · **data scientist** · **DBA** · **digital forensics analyst**
- **Certification**: CISSP (security) · CCNA (Cisco network) · CompTIA A+ (เริ่มต้น) · CEH (ethical hacking) · PMP (โครงการ) · CISA (ตรวจสอบระบบ)

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
6. Expert system ประกอบด้วยส่วนหลักอะไรบ้าง
7. CCNA กับ CEH ใบรับรองไหนเกี่ยวกับเครือข่าย ไหนเกี่ยวกับการเจาะระบบอย่างมีจริยธรรม

**เฉลย** — 1. TPS (OLTP) · 2. expert system · 3. exception report · 4. SEO expert ·
5. hardware, software, data, people, procedures · 6. knowledge base และ inference engine ·
7. CCNA = เครือข่าย (Cisco) · CEH = ethical hacking

---

## แล็บ — File Management

> ใบงาน Lab 10 ยังไม่อยู่ในคลัง — เปิดจาก [OnLearn](https://onlearn.it.kmitl.ac.th/course/view.php?id=1766) · งานสัปดาห์นี้ส่งไฟล์แยกตามรอบแล็บ

---

## โน้ตสรุปจาก Notion · Tammadon Suksa (IT24)

> ขอบคุณ **Tammadon Suksa (IT24)** ที่สรุปและแชร์โน้ตชุดนี้ · คัดลอกจาก [ITF Week 10 บน Notion](https://app.notion.com/p/40b363d85cea80b5a64bc1e50f4bdf42) เมื่อ 1 พ.ย. 2569 พร้อมรูปประกอบ (ภาพสไลด์ของผู้สอนที่ผู้สรุปเขียนโน้ตทับ) · เนื้อหาเป็นสำนวนของผู้สรุป ถ้าต่างจากสไลด์ให้ยึดสไลด์ · จุดที่ iHelp ตรวจแล้วคลาดเคลื่อนมี ⚠️ กำกับไว้

### 🏢 1. กลุ่มระบบสารสนเทศในองค์กร (Enterprise Information Systems)

- **ERP (Enterprise Resource Planning)**: ระบบที่เชื่อมโยงและรวมสายธารข้อมูลของทุกแผนกในองค์กรเข้าด้วยกัน เพื่อบริหารจัดการกิจกรรมทั้งหมดขององค์กรได้อย่างมีประสิทธิภาพ
- **DMS (Document Management System)**: ระบบจัดเก็บและบริหารจัดการเอกสารของบริษัท รองรับการกำหนดสิทธิ์การเข้าถึง (Access control), ความปลอดภัย, การติดตามเวอร์ชัน (Version tracking) และการค้นหา
- **CMS (Content Management System)**: ระบบช่วยจัดการ เผยแพร่ ปรับปรุง และจัดระเบียบไฟล์สื่อ/เอกสารผ่านหน้าจอ GUI หรือเว็บ
- **TPS (Transaction Processing System)**: ระบบบันทึกและประมวลผลรายการเปลี่ยนแปลงทางธุรกิจประจำวัน
  - **OLTP (Online Transaction Processing)**: การประมวลผลรายการแบบทันทีทันใด/เรียลไทม์
  - **Batch Processing**: การสะสมรายการไว้ แล้วนำมาประมวลผลพร้อมกันเป็นงวดหรือตามช่วงเวลาที่กำหนด
- **MIS (Management Information System)**: ระบบสร้างสารสนเทศที่ถูกต้อง ทันเวลา และเป็นระเบียบ เพื่อช่วยให้ผู้บริหารใช้ตัดสินใจ ติดตามงาน และแก้ปัญหา
- **DSS (Decision Support System)**: ระบบช่วยวิเคราะห์ข้อมูลและสนับสนุนการตัดสินใจ โดยดึงข้อมูลทั้งจากภายในและภายนอกองค์กร (เช่น อัตราดอกเบี้ย, สภาพเศรษฐกิจ)
  - **OLAP (Online Analytical Processing)**: เทคนิคการวิเคราะห์ข้อมูลหลายมิติที่ใช้งานร่วมกับระบบ DSS
- **Expert System (ระบบผู้เชี่ยวชาญ)**: ระบบที่จัดเก็บความรู้ของผู้เชี่ยวชาญมนุษย์ลงใน **Knowledge Base** และใช้ **Inference Engine** ในการประมวลผลตรรกะเพื่อเลียนแบบการตัดสินใจและให้คำแนะนำ

---

### 🌐 2. กลุ่มวิวัฒนาการของเว็บ (Web Evolution)

- **Web 1.0**: ยุคเริ่มต้นของเว็บ เน้นการแสดงผลหน้าเว็บแบบนิ่ง (Basic Web Pages, HTML, E-commerce) ผู้ใช้ทำได้เพียงอ่านข้อมูลอย่างเดียว (Read-only)
- **Web 2.0**: ยุคสังคมออนไลน์ (Social Media, User Generated Content, Mobile Apps) ผู้ใช้สามารถสร้างและแชร์เนื้อหาได้เอง (Read-Write)
- **Web 3.0**: ยุคเว็บชาญฉลาดและกระจายอำนาจ เน้น **Semantic Web** (เว็บเข้าใจความหมายข้อมูล), **dApps** (Decentralized Apps), NFTs, VR/AR (Metaverse), AI และการเชื่อมต่อทำงานร่วมกัน (Interoperability)

---

### 📊 3. คุณลักษณะของสารสนเทศที่มีคุณค่า (Qualities of Valuable Information)

สารสนเทศที่จะนำไปใช้ตัดสินใจในองค์กรได้อย่างมีประสิทธิภาพ ต้องมีคุณลักษณะสำคัญดังนี้:
- **Accurate**: ถูกต้องแม่นยำ ไม่ผิดพลาด
- **Verifiable**: สามารถตรวจสอบความถูกต้องซ้ำได้
- **Timely**: ทันเวลา ทันต่อการใช้งาน
- **Organized**: ถูกจัดระเบียบและหมวดหมู่ชัดเจน
- **Accessible**: ผู้มีสิทธิ์สามารถเข้าถึงได้ง่าย
- **Useful**: มีประโยชน์และตรงกับสถานการณ์
- **Cost-effective**: คุ้มค่าเมื่อเทียบกับต้นทุนที่ใช้ได้มา

---

### 📜 4. กลุ่มใบรับรองไอทีสำคัญที่ต้องจำผ่านตา (IT Certifications Keywords)

- **CISSP (Certified Information Systems Security Professional)**: ใบรับรองมาตรฐานระดับสูงด้านการบริหารความมั่นคงปลอดภัยระบบสารสนเทศ
- **CCNA (Cisco Certified Network Associate)**: ใบรับรองความรู้พื้นฐานระบบเครือข่าย IP services และความปลอดภัยเน็ตเวิร์กของ Cisco
- **CompTIA A+**: ใบรับรองมาตรฐานอุตสาหกรรมสำหรับเริ่มต้นสายงานไอที ครอบคลุมฮาร์ดแวร์ ระบบปฏิบัติการ และเน็ตเวิร์ก
- **CEH (Certified Ethical Hacker)**: ใบรับรองด้านการเจาะระบบอย่างมีจริยธรรม เพื่อเรียนรู้เทคนิคแฮกเกอร์สำหรับการป้องกันระบบ
- **PMP (Project Management Professional)**: ใบรับรองมืออาชีพด้านการบริหารจัดการโครงการ
- **CISA (Certified Information Systems Auditor)**: ใบรับรองด้านการตรวจสอบระบบสารสนเทศ
