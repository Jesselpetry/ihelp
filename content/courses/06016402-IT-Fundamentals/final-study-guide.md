# 📘 คู่มือทบทวนสอบปลายภาค
## 06016402 Information Technology Fundamentals (1/2569)

> **วันสอบ:** อังคาร 3 พ.ย. 2569 เวลา 13:30–16:30 (ตามตารางสอบในระบบ [/exam-schedule](/exam-schedule) — ตรวจห้องและที่นั่งที่นั่น)
> **ระยะเวลา:** 3 ชั่วโมง | **สัดส่วนคะแนน:** 30% (ตาม `summary.md`)
> **ขอบเขต:** Week 08–15 · สัดส่วนปรนัย/อัตนัยของปีนี้ *ยังไม่ยืนยัน*
> **หนังสืออ้างอิง:** O'Leary, O'Leary & O'Leary (2026) *Computing Essentials 2026* · Kurose & Ross, *Computer Networking* 8th ed. (Week 11)
>
> คู่มือนี้เป็นคู่ของ [คู่มือทบทวนกลางภาค](/courses/06016402-IT-Fundamentals/summary?doc=midterm-study-guide) — สรุปจากหน้าสัปดาห์ (`week08`–`week15`) สไลด์ฉบับแปลไทยในคลัง และสรุปของเพื่อนร่วมรุ่น ไม่ใช่ข้อสอบจริงและไม่ใช่ประกาศของผู้สอน

### 🧭 ทางลัด

| อยากไปที่ | ลิงก์ |
|---|---|
| Week 08 · Database | [สรุปอ่านสอบ Week 08](/courses/06016402-IT-Fundamentals/map?doc=week08) |
| Week 09 · Ethical, Social & Legal Aspects of IT | [สรุปอ่านสอบ Week 09](/courses/06016402-IT-Fundamentals/map?doc=week09) |
| Week 10 · Working in the Enterprise | [สรุปอ่านสอบ Week 10](/courses/06016402-IT-Fundamentals/map?doc=week10) |
| Week 11 · Internet & Computer Networks 1 ⭐⭐⭐ | [สรุปอ่านสอบ Week 11](/courses/06016402-IT-Fundamentals/map?doc=week11) |
| Week 12 · Computer Networks 2 ⭐⭐⭐ | [สรุปอ่านสอบ Week 12](/courses/06016402-IT-Fundamentals/map?doc=week12) |
| Week 13 · Wireless Networks ⭐⭐⭐ | [สรุปอ่านสอบ Week 13](/courses/06016402-IT-Fundamentals/map?doc=week13) |
| Week 14 · Web Technology ⭐⭐ | [สรุปอ่านสอบ Week 14](/courses/06016402-IT-Fundamentals/map?doc=week14) |
| Week 15 · IT Skills and System | [สรุปอ่านสอบ Week 15](/courses/06016402-IT-Fundamentals/map?doc=week15) |
| ข้อสอบจำลองปลายภาค 60 ข้อ | [Final Mock](/courses/06016402-IT-Fundamentals/mock) |
| สไลด์สรุปภาษาไทยของแต่ละสัปดาห์ | [คลังไฟล์วิชา ITF](/courses/06016402-IT-Fundamentals/library) (ไฟล์ชื่อลงท้าย `-2569-thai.pdf`) |
| โน้ตสรุปของเพื่อนร่วมรุ่น (Notion) | [ITF — Notion](https://app.notion.com/p/ITF-407363d85cea806abdc6c9ec2254f668) |

> โน้ต Notion เป็นงานของเพื่อนร่วมรุ่น ใช้เป็นตัวช่วยทวน ถ้าขัดกับสไลด์ให้ยึดสไลด์ — คู่มือนี้แก้จุดที่ขัดไว้ให้แล้ว (ดูหัวข้อกับดักท้ายเล่ม)

---

### 🎯 ขอบเขตและระดับความเน้น

> ระดับความเน้นด้านล่างมาจาก**สรุปของเพื่อนร่วมรุ่น ไม่ใช่ประกาศของผู้สอน** — ใช้จัดลำดับเวลาอ่าน ไม่ใช่ตัวรับประกันว่าบทไหนจะออกกี่ข้อ

| Week | หัวข้อ | ความเน้น | ต้องทำอะไร |
|---|---|---|---|
| 08 | Database | ⭐ | จำคีย์เวิร์ด |
| 09 | Ethical, Social & Legal Aspects of IT | ⭐ | จำคีย์เวิร์ด |
| 10 | Working in the Enterprise | ⭐ | จำคีย์เวิร์ด |
| 11 | Internet & Computer Networks 1 | ⭐⭐⭐ | เข้าใจ + จำคีย์เวิร์ด + คำนวณ |
| 12 | Computer Networks 2 | ⭐⭐⭐ | เข้าใจ + จำคีย์เวิร์ด + คำนวณ (IP · Network ID · Host ID · Subnet mask) |
| 13 | Wireless Networks | ⭐⭐⭐ | เข้าใจ + จำคีย์เวิร์ด + คำนวณ |
| 14 | Web Technology | ⭐⭐ | เข้าใจ + จำคีย์เวิร์ด (หลายคนรู้พื้นฐานอยู่แล้ว) |
| 15 | IT Skills and System | ⭐ | จำคีย์เวิร์ด |

**แผนเวลา (ถ้าเหลือน้อย):** Week 12 Part 2 (คำนวณ IP) ก่อน → Week 11–13 ทั้งชุด → Week 14 → ไล่ตารางคีย์เวิร์ดของ Week 08–10 และ 15

---

# ส่วนที่ 1: สรุปเนื้อหาแยกตามสัปดาห์

---

## 📗 Week 08 — Database ⭐

### 8.1 ลำดับชั้นของข้อมูล ⭐⭐

```
Bit → Byte/Character → Field → Record → Data file → Database
 0/1   8 bits = 1 ตัวอักษร   (เล็กสุดที่ผู้ใช้เข้าถึง)       (ไฟล์หลายไฟล์)
```

| ระดับ | จุดจำ |
|---|---|
| **Character** | 1 byte = 8 bits แทนตัวอักษร ตัวเลข หรือสัญลักษณ์ 1 ตัว |
| **Field** | **หน่วยเล็กที่สุดที่ผู้ใช้เข้าถึง** · มี field name · field size · data type |
| **Record** | กลุ่ม field ที่เกี่ยวข้อง · **primary key** = field ที่ไม่ซ้ำกันในแต่ละ record |
| **Data file** | กลุ่ม record ที่เกี่ยวข้อง |
| **Database** | กลุ่ม data file ที่เกี่ยวข้อง |

- ชนิดข้อมูล: text · number · **AutoNumber** · currency · date · memo (long text) · hyperlink
- ตารางในฐานข้อมูลเชิงสัมพันธ์: **row = record (tuple)** · **column = field (attribute)**

### 8.2 File maintenance และ Validation ⭐⭐

- **File maintenance** = เพิ่ม · แก้ไข · ลบ record — บาง DBMS ลบจริงทันที บางตัวแค่ติด flag ว่าถูกลบ

| Validation check | ตรวจอะไร | ตัวอย่าง |
|---|---|---|
| Alphabetic / numeric | ใส่ได้เฉพาะตัวอักษร / ตัวเลข | ช่องชื่อห้ามมีตัวเลข |
| **Range** | ตัวเลขอยู่ในช่วงที่กำหนด (field เดียว) | อายุ 0–120 |
| **Consistency** | ความสัมพันธ์ระหว่าง **2 field ขึ้นไป** สมเหตุสมผล | วันที่ส่งของต้องไม่ก่อนวันที่สั่ง |
| **Completeness** | field บังคับต้องไม่ว่าง | ต้องกรอกอีเมล |
| **Check digit** | เลขต่อท้าย primary key ไว้ตรวจความถูกต้อง | หลักสุดท้ายของเลขบัตร |

### 8.3 File processing vs Database approach ⭐⭐ (ออกบ่อย)

| | File processing system | Database approach |
|---|---|---|
| โครงสร้าง | แต่ละแผนกมีไฟล์ของตัวเอง | หลายโปรแกรมและผู้ใช้แชร์ฐานข้อมูลเดียว |
| จุดอ่อน/ข้อดี | **redundant data** (ซ้ำ) และ **isolated data** (แยกโดดเดี่ยว) | ลดความซ้ำ · **data integrity** ดีขึ้น · แชร์ได้ · เข้าถึงง่าย · พัฒนาเร็ว |
| ข้อเสีย | — | ซับซ้อนกว่า · กิน memory/CPU มากกว่า · ข้อมูลเสี่ยงกว่า |

### 8.4 ชนิดฐานข้อมูลและ DBMS

| Data model | เก็บแบบ | เหมาะกับ |
|---|---|---|
| **Relational** | ตาราง (แถว × คอลัมน์) | เงินเดือน บัญชี สต็อก ใบแจ้งหนี้ |
| **Object-oriented** | object | สื่อ ภาพ เสียง วิดีโอ |
| **Multidimensional** | มากกว่า 2 มิติ | **data warehouse** วิเคราะห์ธุรกรรมย้อนหลัง |

| คำ | ความหมาย |
|---|---|
| **DBMS** | ซอฟต์แวร์สร้าง เข้าถึง จัดการฐานข้อมูล |
| **DBA** | ผู้ดูแลกิจกรรมฐานข้อมูลทั้งหมด |
| **Data dictionary** | คลังข้อมูลเกี่ยวกับโครงสร้างทุกไฟล์/ทุก field |
| เครื่องมือดึงข้อมูล 4 แบบ | **query language (SQL)** · **QBE** (GUI) · **form** · **report writer** |
| Principle of **least privilege** | ให้สิทธิ์เท่าที่หน้าที่ต้องใช้ |
| Backup & recovery | backup · log · recovery utility · continuous backup |
| **Big data** | หารูปแบบที่มีประโยชน์ในข้อมูลมหาศาล — เช่น Netflix แนะนำหนังจากประวัติการดู · 5V = Volume · Velocity · Variety · Veracity · Value |

```sql
SELECT * FROM Fruits WHERE Fruit_Color = 'Red';
-- SELECT เลือก field · FROM ระบุตาราง · WHERE เงื่อนไข
-- GROUP BY / HAVING รวมกลุ่ม / เงื่อนไขของกลุ่ม · ORDER BY ... DESC/ASC เรียง
```

---

## 📗 Week 09 — Ethical, Social & Legal Aspects of IT ⭐

### 9.1 การขโมยและการป้องกัน

| ประเภท | ความหมาย |
|---|---|
| **Software theft (piracy)** | คัดลอก/activate ซอฟต์แวร์ผิดกฎหมาย · ป้องกันด้วย **product activation** + **license agreement** |
| **Information theft** | ขโมยข้อมูลส่วนตัว/ความลับ (**PII**) |
| **Hardware theft** | ขโมยอุปกรณ์ |
| **Hardware vandalism** | ทำลาย/ทำให้เสียหาย |

| เครื่องมือ | หน้าที่ |
|---|---|
| **Encryption** | แปลงข้อมูลอ่านได้เป็นรหัส |
| **Digital signature** | ยืนยันตัว**ผู้ส่ง** |
| **Digital certificate** | รับรองว่าผู้ใช้/เว็บเป็นของจริง |
| Secure site | เว็บที่เข้ารหัสปกป้องข้อมูล |

### 9.2 Ethics และ Information privacy

- **Technology ethics** · **intellectual property** · **copyright** · **DRM** (กันแจกจ่ายสื่อดิจิทัลผิดกฎหมาย) · **code of conduct** · **green computing**
- **Information privacy** = สิทธิ์ปฏิเสธ/จำกัดการเก็บ ใช้ เผยแพร่ข้อมูลของตน

| ภัย | ความหมาย |
|---|---|
| **Cookie** | ไฟล์ข้อความเล็กที่เว็บเก็บในเครื่อง (จำรหัส ติดตามการเข้าชม ยิงโฆษณา) |
| **Phishing** | **อีเมล**ทางการปลอมหลอกเอาข้อมูล |
| **Clickjacking** | ปุ่ม/ลิงก์ที่**ซ่อนโปรแกรมร้าย** |
| Spyware · Adware | แอบเก็บข้อมูล · ยิงโฆษณา |
| **Social engineering** | หลอกโดยอาศัยความไว้ใจของคน |

- กฎหมาย privacy: สหรัฐไม่มีฉบับเดียว (HIPAA, FERPA, COPPA) · EU = **GDPR** · ไทย = **PDPA พ.ศ. 2562**
- **Employee monitoring** ถูกกฎหมาย · **content filtering** จำกัดเนื้อหา

### 9.3 หลักจริยธรรม 4 ข้อ ⭐⭐

| หลัก | ใจความ |
|---|---|
| **Proportionality** | ประโยชน์ต้องมากกว่าโทษ/ความเสี่ยง |
| **Informed consent** | ผู้ได้รับผลกระทบเข้าใจและยอมรับความเสี่ยง |
| **Justice** | ประโยชน์และภาระกระจายเป็นธรรม |
| **Minimized risk** | ผ่านสามข้อแรกแล้วยังต้องเลี่ยงความเสี่ยงที่ไม่จำเป็น |

- **5 มิติทางศีลธรรม:** information rights · property rights · system quality · quality of life · accountability and control
- **Digital disruption** = เปลี่ยนฉับพลันจนรูปแบบเดิมต้องยุติ (หุ่นยนต์แทนแรงงาน, กล้องดิจิทัลแทนฟิล์ม)
- **Digital native** (เกิดยุคดิจิทัล, Gen Z) vs **digital immigrant** (เกิดก่อน มาเรียนรู้ทีหลัง)
- **Defamation:** **slander = พูด** · **libel = เขียน** · อื่น ๆ: cyberbullying · identity theft · gaming addiction · **cashless society** · **social media literacy**

### 9.4 กฎหมายไอทีของไทย ⭐⭐ (จับคู่ชื่อกับปี)

| กฎหมาย | ปี พ.ศ. | สาระ |
|---|---|---|
| พ.ร.บ. คอมพิวเตอร์ | **2550** · ฉบับ 2 ปี 2560 | ความผิดทางคอมพิวเตอร์ · เก็บข้อมูลจราจร |
| **PDPA** คุ้มครองข้อมูลส่วนบุคคล | **2562** | เก็บ/ใช้/เปิดเผยข้อมูลส่วนบุคคล |
| พ.ร.บ. ไซเบอร์ | **2562** | ภัยคุกคามไซเบอร์ต่อโครงสร้างพื้นฐานสำคัญ |
| พ.ร.บ. ธุรกรรมทางอิเล็กทรอนิกส์ | 2544 (แก้ 2551, 2562) | ธุรกรรม/ลายมือชื่ออิเล็กทรอนิกส์ |
| พ.ร.บ. ลิขสิทธิ์ | 2537 (แก้ 2558, 2561) | คุ้มครองงานสร้างสรรค์ |
| พ.ร.บ. สิทธิบัตร | 2522 (แก้ 2535, 2542) | คุ้มครองการประดิษฐ์ |

**แล็บ 09:** Make.com (no-code) — Google Forms → Google Sheets → Text aggregator → Gemini → Telegram bot (สร้างบอทผ่าน BotFather)

---

## 📗 Week 10 — Working in the Enterprise ⭐

### 10.1 Information system และสารสนเทศที่มีคุณค่า

- **Information system** = hardware · software · data · people · procedures (**5 องค์ประกอบ**)
- สารสนเทศมีคุณค่า: **Accurate · Verifiable · Timely · Organized · Accessible · Useful · Cost-effective**
- องค์กรแบ่งเป็น **functional units** (HR · บัญชี · วิศวกรรม · ผลิต · การตลาด · ขาย)

### 10.2 ระบบในองค์กร ⭐⭐ (จับคู่ได้เกือบทุกข้อ)

| ระบบ | หน้าที่ | คีย์เวิร์ด |
|---|---|---|
| **ERP** | รวมการไหลของข้อมูลทั้งองค์กร | ประสานทุกแผนก |
| **CMS** | เผยแพร่ แก้ไข จัดระเบียบเนื้อหาผ่านเว็บ/GUI | **เผยแพร่เนื้อหา** |
| **DMS** | เก็บและจัดการเอกสารบริษัท | สิทธิ์ · **เวอร์ชัน** · ค้นหา |
| **TPS** | บันทึก/ประมวลผลธุรกรรมประจำวัน | **OLTP** (real-time) หรือ batch |
| **MIS** | รายงานที่ถูกต้อง ทันเวลา เป็นระเบียบ ให้ผู้จัดการ | detailed / **exception** report |
| **DSS** | ช่วยวิเคราะห์เพื่อตัดสินใจ ใช้ข้อมูลภายในและ**ภายนอก** | **OLAP** |
| **Expert system** | เก็บความรู้ผู้เชี่ยวชาญ เลียนแบบการให้เหตุผล | knowledge base + inference engine |

- **TPS ↔ OLTP · DSS ↔ OLAP** — ตัวลวงชอบสลับ
- ข้อมูลภายนอกของ DSS: อัตราดอกเบี้ย แนวโน้มประชากร ราคาวัตถุดิบ
- **Web 1.0** อ่านอย่างเดียว · **Web 2.0** อ่าน-เขียน (social, UGC) · **Web 3.0** semantic web / decentralized (dApps) — เป็นหัวข้อรอบข้างของ Week 10/15 (ตามสไลด์ Week 15 หน้า 23)

### 10.3 อาชีพและ Certification

| กลุ่มงาน | ตำแหน่งที่ต้องจำ |
|---|---|
| System development | **systems analyst** · cloud architect · web developer · program/app developer |
| Operations | **help desk specialist** · network administrator · technical project manager |
| Web marketing | **SEO expert** (ทำให้เว็บขึ้นอันดับต้น) · **UX designer** · CRM specialist |
| Storage/analysis | **data scientist** · **database administrator** · database analyst · digital forensics examiner |
| Security | security analyst · **digital forensics analyst** · network security administrator |

- **Certification** = หลักฐานความรู้เฉพาะด้านต่อนายจ้าง (ลงทั้งเวลาและเงิน) · ตัวอย่าง **CISSP** (security) · **CCNA** (Cisco networking) · PMP (project management)
- กลุ่ม certification: application software · data analysis & database · hardware · networking · operating system · programmer/developer · security
- หางาน: ฝ่ายแนะแนวอาชีพ · เว็บวางแผนอาชีพ · **LinkedIn**
- DBA ดูแล data dictionary/ประสิทธิภาพ · database analyst วิเคราะห์การใช้ข้อมูล

---

## 📗 Week 11 — Internet & Computer Networks 1 ⭐⭐⭐

### 11.1 Internet คืออะไร — 2 มุมมอง ⭐⭐⭐

| มุมมอง | ใจความ |
|---|---|
| **Nuts and bolts view** | ฮาร์ดแวร์/ซอฟต์แวร์ที่ประกอบเป็น Internet: **host (end system)** · **communication link** · **packet switch** · **ISP** |
| **Service view** | โครงสร้างพื้นฐานที่ให้บริการแก่ **distributed application** (web, streaming, email, game) · end system มี **API** ให้โปรแกรมขอส่งข้อมูลไปยังอีกเครื่อง |

| ส่วนประกอบ | รายละเอียด |
|---|---|
| **Host = end system** | เครื่องที่**รันแอป** — ทั้ง **client** (PC, smartphone) และ **server** (web server, email server) · **web server ก็เป็น end system** |
| **Communication link** | fiber · copper · radio · satellite · อัตราส่ง = **bandwidth** (bits/sec) · fiber เร็วที่สุด |
| **Packet switch** | **router** (network core) และ **link-layer switch** (access network) — **ไม่ใช่ end system** |
| **ISP** | เชื่อม end system เข้า Internet · ทุกตัวรัน **IP** |

- แอปรันบน end system **ไม่ได้รัน**บน packet switch
- **Protocol** = กำหนด **รูปแบบ** + **ลำดับ** ของข้อความ และ **การกระทำ** เมื่อส่ง/รับข้อความ

```
Client                                  Server
  | --- TCP connection request ------->  |
  | <-- TCP connection response -------  |   ตัวอย่าง protocol ในสไลด์
  | --- GET http://... --------------->  |   (เทียบกับ human protocol: "สวัสดี" / "กี่โมงแล้ว")
  | <-- <file> -------------------------  |
```

- มาตรฐาน Internet ออกโดย **IETF** เป็นเอกสาร **RFC** (ไม่ใช่ IEEE) · โปรโตคอลหลัก **TCP/IP**

### 11.2 Layering และ Encapsulation ⭐⭐⭐

```
Application   message     ← ข้อมูลของแอป (HTTP, email)
     ↓ + header
Transport     segment     ← TCP/UDP: port, การเชื่อมต่อ
     ↓ + header
Network       datagram    ← IP: address ต้นทาง/ปลายทาง (เรียก packet ได้)
     ↓ + header
Link          frame       ← header + trailer: MAC address, ตรวจ error
     ↓
Physical      bits        ← สัญญาณไฟฟ้า/แสง/วิทยุ
```

- **Encapsulation** = แต่ละชั้นห่อข้อมูลชั้นบนด้วย header ของตัวเอง (สไลด์เปรียบ **matryoshka**)
- จำเป็น **Message → Segment → Datagram → Frame → Bits**
- **Transmission delay = L / R** (L = ขนาด packet เป็นบิต, R = อัตราลิงก์ bit/s) — ตัวอย่าง 1,000 บิต ที่ 1 Mbps = 1,000 / 1,000,000 = **0.001 s = 1 ms**

### 11.3 Network edge และ Access network ⭐⭐

| Access | จุดจำ |
|---|---|
| **DSL** | สายโทรศัพท์เดิม · สาย**เฉพาะ** (dedicated) ไปชุมสาย · DSLAM แยกข้อมูลกับเสียง |
| **Cable (HFC)** | hybrid fiber coax · บ้านหลายหลัง**แชร์**สายไป cable headend · **asymmetric** (ขาลงเร็วกว่าขาขึ้น) |
| **FTTH** | ไฟเบอร์ถึงบ้าน |
| Dial-up · Satellite | ใช้เมื่อไม่มีทางเลือก เช่น ชนบท (satellite ดีเลย์ราว 270 ms) |
| Enterprise | **Ethernet** (10 Mbps–10 Gbps) + **Wi-Fi** |
| Wide-area wireless | 3G/4G LTE/5G ผ่านเสาผู้ให้บริการ |

| Physical media | ตัวอย่าง |
|---|---|
| **Guided** (ผ่านตัวกลางแข็ง) | **twisted pair** (Cat 5 = 100 Mbps–1 Gbps · Cat 6 = 10 Gbps) · **coaxial** · **fiber optic** (เร็ว error ต่ำ **immune** ต่อสัญญาณรบกวนแม่เหล็กไฟฟ้า) |
| **Unguided** (ไปในอากาศ) | radio — terrestrial microwave · Wi-Fi · 4G/5G · Bluetooth · satellite |

### 11.4 Network core และโครงสร้าง Internet ⭐⭐⭐

- **Packet switching** — แบ่ง message เป็น packet แล้วส่งต่อทีละ router
- **Forwarding vs Routing** (ออกบ่อย):

| | Forwarding | Routing |
|---|---|---|
| ขอบเขต | **local** — router ตัวเดียว | **global** — ทั้งเส้นทางต้นทาง→ปลายทาง |
| ทำอะไร | ย้าย packet จากพอร์ตเข้าไปพอร์ตออกตาม **forwarding table** | หาเส้นทางด้วย **routing algorithm** |

**Network of networks — ทำไมถึงเป็นแบบนี้:**

```
ต่อ access ISP ทุกคู่ตรง ๆ (mesh) → O(N²) สายเยอะเกิน
        ↓ แก้ด้วย
Global transit ISP (tier-1) ตรงกลาง  ← Level 3, Sprint, AT&T, NTT
        ↓ มีหลายเจ้า → ต้องเชื่อมกันเอง
Peering link (ISP ต่อ ISP ตรง) + IXP (จุดแลกเปลี่ยนกลาง)
        ↓
Regional ISP รวม access ISP ในพื้นที่ → ส่งขึ้น global ISP
        ↓
Content provider network (Google, Facebook) — เครือข่ายส่วนตัว ต่อ IXP/regional ตรง เลี่ยง tier-1
```

### 11.5 Network security ⭐⭐

| การโจมตี | ความหมาย | จุดจำ |
|---|---|---|
| **Packet sniffing** | อ่านทุก packet ที่ผ่านสื่อ broadcast (Wi-Fi, Ethernet) | เครื่องมือ **Wireshark** |
| **IP spoofing** | ปลอม **source address** | แอบอ้างตัวตน |
| **DoS** | ถล่มทรัพยากรด้วย traffic ปลอมจนผู้ใช้จริงใช้ไม่ได้ | เลือกเป้า → ยึด host (**botnet**) → สั่งยิงพร้อมกัน |

- แนวป้องกัน: authentication · encryption (confidentiality) · digital signature (integrity) · **VPN** · **firewall**
- Internet ไม่ได้ออกแบบเรื่อง security มาตั้งแต่ต้น — ต้องแก้ตามหลัง ("catch-up")

---

## 📗 Week 12 — Computer Networks 2 ⭐⭐⭐

### 12.1 Physical topology — 5 แบบ ⭐⭐

| Topology | ลักษณะ | ข้อดี | ข้อเสีย |
|---|---|---|---|
| **Mesh** | ทุกเครื่องต่อตรงถึงกัน — n เครื่องใช้ **n(n−1)/2** สาย | redundancy สูงสุด ทนทาน | สายมาก แพงสุด |
| **Star** | ทุกเครื่องต่อเข้าศูนย์กลาง (hub/switch) | จัดการง่าย หาจุดเสียง่าย สายเส้นเดียวขาดไม่กระทบคนอื่น | ศูนย์กลางเป็น **single point of failure** |
| **Bus** | สายหลัก (backbone) เส้นเดียวร่วมกัน มี **terminator** ปลายสาย | ประหยัดสาย ติดตั้งง่าย | สายหลักขาดจุดเดียว ล่มทั้งระบบ |
| **Ring** | ต่อเป็นวงปิด ข้อมูลวิ่งทิศเดียว | ไม่ชนกัน | โหนดใดโหนดหนึ่งขาด วงล่ม |
| **Hybrid** | ผสม เช่น star backbone ต่อ bus หลายวง | ขยายง่าย แยกจุดเสียง่าย | สายหลักขาด ข้ามกลุ่มไม่ได้ |

ตัวอย่างคำนวณ: mesh 6 เครื่อง = 6×5/2 = **15 สาย** · 10 เครื่อง = 10×9/2 = **45 สาย**

### 12.2 Logical topology = Multiple access protocol ⭐⭐⭐

เป้าหมาย: ไม่ให้เครื่องหลายตัวส่งชนกัน และไม่ให้ใครผูกขาดตัวกลาง

| โปรโตคอล | หลักการ | ใช้กับ |
|---|---|---|
| **CSMA** | ฟังก่อนพูด (listen before talk) · ลดการชน**แต่ไม่หมด** เพราะ propagation delay | พื้นฐาน |
| **CSMA/CD** | CSMA + **ตรวจจับการชน (collision detection)** **ขณะส่ง** → ชนแล้วหยุดส่ง รอเวลาสุ่ม (**back-off**) แล้วส่งใหม่ | **Ethernet (มีสาย)** |
| **Token passing** | ต้องเป็น **ring** · ส่งได้เฉพาะตอนถือ **token** | Token Ring · Token Bus · FDDI |
| FDMA / TDMA / CDMA | แบ่งช่องสัญญาณ: ความถี่ / เวลา / รหัส | cellular (ดู Week 13) |

| Physical | Logical | มาตรฐาน |
|---|---|---|
| Bus, star | CSMA/CD | **Ethernet** |
| Bus | Token passing | Token Bus |
| Ring | Token passing | Token Ring |
| Dual ring | Token passing | FDDI |

> **CSMA/CD ตรวจการชนด้วยการ "ฟังสัญญาณบนสายขณะตัวเองส่ง"** — ไม่ได้รอ ACK · ส่วนการรอ ACK เป็นของ **CSMA/CA** ใน Wi-Fi (Week 13)

### 12.3 Ethernet ⭐⭐

- คิดค้นโดย Robert Metcalfe ปี 1973 · physical = star/bus · logical = CSMA/CD
- **Standard Ethernet 10 Mbps:** 10Base5 (coax หนา) · 10Base2 (coax บาง) · **10Base-T** (twisted pair, UTP) · 10Base-F (fiber) — อ่านชื่อ: 10 = Mbps · Base = baseband · ท้าย = ตัวกลาง/ความยาว
- ลำดับวิวัฒนาการ: Standard (10) → **Fast** (100) → **Gigabit** → **10-Gigabit**

| | Gigabit | 10-Gigabit |
|---|---|---|
| โหมด | CSMA/CD + full duplex | **full duplex อย่างเดียว** (ไม่ใช้ CSMA/CD) |
| สื่อ | optical และ copper | optical เป็นหลัก |
| ระยะ LAN | ถึง 5 km | ถึง 40 km |
| coding | 8B/10B | 64B/66B |

- **Bridge** แบ่ง **collision domain** → **Switched Ethernet** แยก collision domain ทุกพอร์ต → **Full-duplex switched Ethernet** ส่ง/รับพร้อมกัน **ไม่ชนเลย**

### 12.4 อุปกรณ์เชื่อมต่อ ⭐⭐⭐

```
Layer 1  Physical   Repeater / Hub      ทำงานระดับ bit / สัญญาณ
Layer 2  Data link  Bridge / L2 switch  ทำงานระดับ frame (MAC address)
Layer 3  Network    Router / L3 switch  ทำงานระดับ packet (IP address)
```

| อุปกรณ์ | ใช้อะไรตัดสิน | กรอง? | แยก domain |
|---|---|---|---|
| **Repeater / Hub** | ไม่ดูอะไร | **ไม่กรอง** ส่งทุก frame ออกทุกพอร์ต | ไม่แยก (collision domain เดียว) |
| **Bridge / L2 switch** | **MAC address** + bridge table (เรียนรู้เอง) | กรองว่าส่งพอร์ตไหน | แยก **collision domain** |
| **Router / L3 switch** | **IP address** | ตัดสินเส้นทางข้ามเครือข่าย | แยก **broadcast domain** |

- Repeater เป็น **regenerator** (สร้างสัญญาณใหม่) ไม่ใช่ amplifier
- **Backbone** = เครือข่ายที่เชื่อมหลาย LAN — สถานีไม่ต่อตรงกับ backbone (สถานีเป็นส่วนของ LAN) · แบบ **bus backbone** / **star backbone** (switch ตัวเดียว)
- Router ต่อ LAN เข้ากับ WAN → Internet

### 12.5 IPv4 addressing ⭐⭐⭐

- IPv4 ยาว **32 บิต** · address space = 2³² = **4,294,967,296** · เขียนแบบ dotted-decimal (4 ชุด ชุดละ 8 บิต)
- **IP address = Network ID + Host ID** — เปรียบกับที่อยู่ไปรษณีย์: Network ID = ถนน/เมือง, Host ID = บ้านเลขที่
- **Subnet mask** = ป้ายขีดเส้นแบ่ง: บิต 1 = ส่วน network · บิต 0 = ส่วน host
- **Network ID = IP AND Subnet mask** (ทีละบิต: `1 AND x = x` · `0 AND x = 0`)

| IP | Network ID | Host ID |
|---|---|---|
| 10.16.127.104 | 10. | 16.127.104 |
| 131.16.82.97 | 131.16. | 82.97 |
| 195.31.72.123 | 195.31.72. | 123 |

- **Network ID เดียวกัน** → คุยตรงผ่าน switch · **ต่างกัน** → ส่งให้ **router (default gateway)** — เป็นวิธีที่เครื่องต้นทางตัดสิน
- **DNS server** แปลงชื่อโดเมนเป็น IP (เช่น 8.8.8.8 ของ Google) — ไม่มี DNS เข้าด้วยชื่อไม่ได้ แต่เข้าด้วย IP ได้

| ส่งแบบ | ถึงใคร |
|---|---|
| **Unicast** | host เดียว |
| **Broadcast** | ทุก host ในเครือข่าย · host bits เป็น 1 ทั้งหมด · router ไม่ส่งต่อถ้าไม่ได้ตั้งค่า |
| **Multicast** | กลุ่มที่ join · ใช้ class D (224.0.0.0 ขึ้นไป) |

| Network | Host | ความหมาย |
|---|---|---|
| 0 ทั้งหมด | 0 ทั้งหมด | เครื่องนี้ (ตอน bootstrap) |
| network | 0 ทั้งหมด | **network address** (ชื่อวง) |
| network | 1 ทั้งหมด | **directed broadcast** (เช่น 203.165.16.255) |
| 1 ทั้งหมด | 1 ทั้งหมด | **limited broadcast** 255.255.255.255 |
| 127 | อะไรก็ได้ | **loopback** ทดสอบ |

### 12.6 Class ของ IPv4 ⭐⭐⭐

| Class | ไบต์แรก | Network/Host bits | Default mask | จำนวน network | Host ต่อ network | Usable (−2) |
|---|---|---|---|---|---|---|
| **A** | 0–127 | 8 / 24 | 255.0.0.0 (/8) | 126 | 2²⁴ = 16,777,216 | **16,777,214** |
| **B** | 128–191 | 16 / 16 | 255.255.0.0 (/16) | 16,384 | 2¹⁶ = 65,536 | **65,534** |
| **C** | 192–223 | 24 / 8 | 255.255.255.0 (/24) | 2,097,152 | 2⁸ = 256 | **254** |
| D | 224–239 | — | — | — | multicast | — |
| E | 240–255 | — | — | — | ทดลอง | — |

- ลบ 2 เพราะ host ทั้งหมดเป็น 0 = **network address** และ host ทั้งหมดเป็น 1 = **broadcast address**
- Class A มี 126 network (0 และ 127 สงวน — 127 = loopback)
- **Address depletion** (ตั้งแต่ราวต้นทศวรรษ 1990): แก้ด้วย **private address** (RFC 1918) · **NAT** (RFC 1631) · **CIDR** (RFC 1519) · **IPv6** (RFC 1883)
- **NAT** = แปลง private address ภายในเป็น public ตอนออก Internet ให้หลายเครื่องใช้ public IP เดียว (ISP ให้มา 1 address)

| Private IP | ช่วง |
|---|---|
| Class A | 10.0.0.0 – 10.255.255.255 |
| Class B | **172.16.0.0 – 172.31.255.255** (16 วง) |
| Class C | 192.168.0.0 – 192.168.255.255 |

- **Waste of address (Class C = 254 usable):** 100 PC + 1 server + 1 router = 102 → เหลือ 254 − 102 = **152** · 225 + 3 + 1 = 229 → เหลือ **25** · 55 + 1 + 1 = 57 → เหลือ **197** · 60 + 1 = 61 → เหลือ **193**

### 12.7 Static route (แล็บ Packet Tracer) ⭐

- Router รู้แค่วงที่ **directly connected** — วงไกลต้องใส่ **static route**: `ip route <วงปลายทาง> <mask> <next hop>`
- **Next hop** = IP พอร์ตของ router ตัวถัดไป**ที่อยู่วงเดียวกับเรา** · `ip route` ใส่ **ชื่อวง** ไม่ใช่ IP เครื่อง
- ping ข้ามวงต้องมี route **ขากลับ** ด้วย · พอร์ต router ปิดเป็นค่าเริ่มต้น ต้อง `no shutdown`
- **/30** = 4 address ใช้ได้ **2** (เหมาะต่อ router 2 ตัว): 10.0.0.0/30 → .1 .2 · 10.0.0.4/30 → .5 .6
- ตัวอย่าง: `ip route 172.16.1.0 255.255.255.0 10.0.0.2`

---

## 📗 Week 13 — Wireless Networks ⭐⭐⭐

### 13.1 องค์ประกอบ ⭐⭐

| ส่วน | หน้าที่ |
|---|---|
| **Wireless host** | laptop · smartphone · IoT — ไร้สาย**ไม่ได้แปลว่าเคลื่อนที่เสมอ** |
| **Base station** | ต่อกับเครือข่ายมีสาย relay packet ให้ host ในพื้นที่ — **cell tower** (cellular) · **access point (AP)** (802.11) |
| **Wireless link** | ต่อ host กับ base station · สมบัติหลัก 2 อย่าง: **coverage area** และ **link rate** |

| โหมด | ลักษณะ |
|---|---|
| **Infrastructure** | host ต่อผ่าน base station เข้าเครือข่ายมีสาย · ย้ายไป base station ใหม่ = **handoff** |
| **Ad hoc** | **ไม่มี base station** · node จัดเครือข่ายและ route กันเอง |

### 13.2 Wireless network taxonomy 2×2 ⭐⭐⭐

```
                      Single hop                      Multiple hops
              ┌──────────────────────────┬─────────────────────────────┐
  มี          │ host ต่อตรง base station │ host อาจต้อง relay ผาน node │
  infrastructure│ ที่ต่อ Internet          │ ไร้สายอื่น เพื่อไปถึง base  │
              │ → Wi-Fi, Cellular        │ station → Mesh network      │
              ├──────────────────────────┼─────────────────────────────┤
  ไม่มี       │ ไม่มี base station       │ ไม่มี base station          │
  infrastructure│ ไม่ต่อ Internet ใหญ่     │ ต้อง relay เพื่อถึง node อื่น│
              │ → Bluetooth, ad hoc      │ → MANET, VANET              │
              └──────────────────────────┴─────────────────────────────┘
```

- **MANET** = mobile ad hoc network · **VANET** = vehicular ad hoc network

### 13.3 ลักษณะของลิงก์ไร้สาย ⭐⭐⭐

ไร้สาย "ยากกว่ามีสายมาก" เพราะ:

| ปัญหา | อธิบาย |
|---|---|
| **Path loss / fading** | สัญญาณอ่อนลงตามระยะและความถี่ — **ความถี่สูงหรือไกล ยิ่ง loss มาก** |
| **Interference** | ความถี่มาตรฐาน เช่น 2.4 GHz ใช้ร่วมกับอุปกรณ์อื่น (โทรศัพท์ไร้สาย มอเตอร์) |
| **Multipath propagation** | สัญญาณสะท้อนพื้น/วัตถุ/อาคาร ถึงปลายทางไม่พร้อมกัน |
| **Hidden terminal** | ดูด้านล่าง |

- **SNR** (signal-to-noise ratio) สูง = แยกสัญญาณจาก noise ง่าย (เป็นสิ่งดี) · เพิ่มกำลังส่ง → SNR สูงขึ้น → **BER** (bit error rate) ลด แต่ **เปลืองแบตเตอรี่**
- ที่ SNR เท่ากัน modulation ที่ bit rate สูงกว่า → BER สูงกว่า · SNR เปลี่ยนตามการเคลื่อนที่ จึงมี **rate adaptation** (สลับ modulation ตาม SNR; ตัวอย่างในสไลด์ BPSK 1 Mbps · QAM16 4 Mbps · QAM256 8 Mbps)

**Hidden terminal problem**

```
   A ))))      ((((  C        A กับ C อยู่ไกลกัน ได้ยินเฉพาะ B
         \    /               ไม่รู้ว่าอีกฝ่ายกำลังส่ง
           B                  → A และ C ส่งไปหา B พร้อมกัน
                              → ชนกัน "ที่ B"
```

- แก้ด้วย **RTS/CTS** (ไม่ใช่การเพิ่มกำลังส่ง)

### 13.4 CDMA ⭐⭐

- อยู่ในกลุ่ม **channel partitioning** (อีก 2 กลุ่ม: random access, taking turns) · ใช้ในเครือข่ายเซลลูลาร์
- ทุกคนใช้**ความถี่เดียวกัน** แต่แต่ละคนมี **chipping sequence (code)** ของตัวเอง
- **Encode:** สัญญาณ = ข้อมูล × code · **Decode:** inner product ของสัญญาณรวมกับ code ÷ M · ถ้า code **orthogonal** ส่งพร้อมกันได้

**ตัวอย่างคำนวณ (M = 4):** c₁ = (+1, −1, +1, −1) · c₂ = (+1, +1, −1, −1) · c₁·c₂ = 1 − 1 − 1 + 1 = **0** (orthogonal)

| | ข้อมูล d | ส่งออก d × c |
|---|---|---|
| Sender 1 | +1 | (+1, −1, +1, −1) |
| Sender 2 | −1 | (−1, −1, +1, +1) |
| **ผลรวมในช่อง** | | **(0, −2, +2, 0)** |

- Decode sender 1: (0×1 + (−2)×(−1) + 2×1 + 0×(−1)) ÷ 4 = (0 + 2 + 2 + 0) ÷ 4 = **+1** ✓
- Decode sender 2: (0×1 + (−2)×1 + 2×(−1) + 0×(−1)) ÷ 4 = (0 − 2 − 2 + 0) ÷ 4 = **−1** ✓

### 13.5 FDMA / TDMA / CDMA เทียบกัน

| แบบ | แบ่งด้วย | ภาพ |
|---|---|---|
| **FDMA** | **ความถี่** | แต่ละคนได้ความถี่ของตัวเอง |
| **TDMA** | **เวลา** | ความถี่เดียว แบ่งเป็น time slot |
| **CDMA** | **รหัส** | ความถี่เดียว เวลาเดียว แยกกันด้วย code |

### 13.6 IEEE 802.11 Wireless LAN ⭐⭐⭐

| มาตรฐาน | ปี | อัตราสูงสุด | ความถี่ |
|---|---|---|---|
| 802.11b | 1999 | 11 Mbps | 2.4 GHz |
| 802.11g | 2003 | 54 Mbps | 2.4 GHz |
| 802.11n (Wi-Fi 4) | 2009 | 600 Mbps | 2.4 / 5 GHz |
| 802.11ac (Wi-Fi 5) | 2013 | 3.47 Gbps | **5 GHz** |
| 802.11ax (Wi-Fi 6) | 2020 | 14 Gbps | 2.4 / 5 GHz |
| 802.11af · 802.11ah | 2014 · 2017 | 35–560 Mbps · 347 Mbps | TV white space · 900 MHz (ไกลถึง 1 km) |

- ลำดับความเร็ว: ax > ac > n > g > b · **ทุกรุ่นใช้ CSMA/CA** เป็น multiple access
- **BSS** (Basic Service Set / "cell") = host + AP (infrastructure) · ad hoc มีแต่ host
- **SSID** = ชื่อ Wi-Fi · **channel** = ช่องความถี่ (AP ข้างเคียงใช้ช่องเดียวกันจะรบกวนกัน)

**Association (host เข้า AP):**

| ขั้น | passive scanning | active scanning |
|---|---|---|
| 1 | AP ส่ง **beacon frame** (มี SSID, MAC) | host broadcast **probe request** |
| 2 | host ส่ง **association request** | AP ตอบ **probe response** |
| 3 | AP ตอบ **association response** | host ส่ง association request |
| 4 | — | AP ตอบ association response |

- หลังเข้า AP อาจ authenticate (ใส่รหัส) แล้วขอ IP ผ่าน **DHCP** ให้อยู่ subnet เดียวกับ AP
- **Power management:** node แจ้ง AP ว่าจะหลับ → AP **buffer** frame ไว้ → beacon ระบุรายชื่อ node ที่มี frame รอ

### 13.7 CSMA/CA และ RTS/CTS ⭐⭐⭐

**ทำไมไม่ใช้ CSMA/CD บนไร้สาย:** ตรวจการชน**ขณะส่ง**ยากเพราะสัญญาณที่ได้รับอ่อน (fading) และตรวจไม่ได้ทุกกรณี (hidden terminal) → เปลี่ยนเป้าหมายเป็น **"avoid"** การชน

| ขั้น | ผู้ส่ง (sender) | ผู้รับ (receiver) |
|---|---|---|
| 1 | ช่องว่างนาน **DIFS** → ส่งทั้ง frame | — |
| 2 | ช่องไม่ว่าง → เริ่ม **random backoff timer** นับถอยหลังตอนช่องว่าง หมดแล้วจึงส่ง | — |
| 3 | ไม่ได้ **ACK** → เพิ่มช่วง backoff แบบสุ่มแล้วลองใหม่ | รับถูกต้อง → ส่ง **ACK** หลัง **SIFS** |

- ต้องมี ACK เพราะผู้ส่ง**ตรวจจับการชนเองไม่ได้**

**RTS/CTS (ตัวเลือก):**

```
Sender ──RTS (สั้น)──►  AP        1) จองช่อง บอกเวลารวมของ DATA + ACK
Sender ◄──CTS────────  AP         2) AP broadcast CTS ให้ "ทุกเครื่อง" ได้ยิน
Sender ──DATA────────► AP         3) เครื่องอื่นที่ได้ยิน CTS เลื่อนการส่ง (defer)
Sender ◄──ACK────────  AP
```

- RTS ชนกันได้ แต่สั้น เสียน้อย · CTS มี 2 หน้าที่: ให้สิทธิ์ผู้ส่ง + สั่งคนอื่นห้ามส่ง → **แก้ hidden terminal**

### 13.8 เทียบความถี่ 2.4 GHz กับ 5 GHz

| | 2.4 GHz | 5 GHz |
|---|---|---|
| ระยะ | **ไกลกว่า** | สั้นกว่า (path loss มาก) |
| การรบกวน | ใช้ร่วมกับอุปกรณ์อื่น มักแออัด | แออัดน้อยกว่า |
| มาตรฐาน | b, g, n, ax | n, ac, ax |

### 13.9 802.15 PAN และเซลลูลาร์

- **Bluetooth (802.15.1)** — ระยะสั้น (< 10 m) พลังงานต่ำ ต้นทุนต่ำ อัตราต่ำ ใช้แทนสาย · ย่าน 2.4 GHz · แบบ ad hoc (master/slave, piconet)
- **Zigbee (802.15.4)** — กำลังไฟต่ำกว่า Bluetooth เหมาะเซนเซอร์/สวิตช์ในบ้าน
- **Cellular (4G LTE/5G)** — ระยะไกลหลาย km · **handoff** เนียนเมื่อย้ายเสา

---

## 📗 Week 14 — Web Technology ⭐⭐

### 14.1 เครื่องมือและเทคโนโลยีเว็บ

| คำ | ความหมาย |
|---|---|
| **Text editor** | คล้าย word processor แต่ไม่จัดรูปแบบ |
| **Code editor** | text editor ที่เพิ่มฟีเจอร์ช่วยเขียนโค้ด |
| **CMS** | จัดการเผยแพร่/แก้ไขเนื้อหา — นักพัฒนาทำ theme ผู้ดูแลใส่เนื้อหา (เช่น **WordPress**) |
| **HTML** | markup language — tag บอก**โครงสร้างและเนื้อหา** (ไม่ใช่ภาษาโปรแกรม) |
| **CSS** | **การแต่งตัว** — ฟอนต์ สี layout |
| **JavaScript** | ภาษาโปรแกรม — **พฤติกรรม** (โต้ตอบ) |
| **W3C** | องค์กรกำกับมาตรฐาน HTML · มี HTML5 validator |
| **Responsive** | ปรับเนื้อหาตามขนาดจอ |

```
HTML = โครงกระดูก      CSS = เสื้อผ้า      JavaScript = พฤติกรรม
```

### 14.2 Static web vs Dynamic web ⭐⭐

| | Static website | Dynamic website |
|---|---|---|
| เนื้อหา | คงที่ เหมือนกันทุกคน | สร้างแบบ real time ตามการโต้ตอบ ปรับแต่งได้ |
| Backend | ไม่มี (no backend) | ต่อ **ฐานข้อมูล** (PHP, Ruby on Rails, JavaScript) |
| เรียกว่า | เว็บไซต์ (website) | เว็บแอป (web app) |

- **Frontend (client side)** = ส่วนที่ผู้ใช้โต้ตอบ · **Backend (server side)** = ส่วนที่มองไม่เห็น เก็บ/จัดการข้อมูล
- Web server software: **Apache** · **Nginx** · Caddy · **Microsoft IIS** · Client = web browser (Chrome, Edge, Firefox, Safari)
- ลำดับ: client ส่ง **HTTP request** → web server ค้นไฟล์/ประมวลผล → ตอบ **response** · ถ้าใช้ชื่อโดเมน client ถาม **DNS** หา IP ก่อน

### 14.3 โครงหน้าเว็บ

```html
<!DOCTYPE html>
<html>
<head>
  <title>My Website Title</title>   <!-- ข้อความบนแท็บ browser -->
</head>
<body>
  <h1>Hello World</h1>              <!-- h1–h6 รวม 6 ระดับ -->
  <p>ย่อหน้า</p>                     <!-- browser ไม่สนการขึ้นบรรทัดในไฟล์ -->
  <img src="img/dog.jpg" alt="dog" width="384">
  <a href="https://www.kmitl.ac.th">KMITL</a>
</body>
</html>
```

- ไฟล์ภาพโฟลเดอร์เดียวกับ HTML: `src="cat.jpg"` · อยู่โฟลเดอร์ย่อย: `src="img/dog.jpg"`
- `<ul>` รายการไม่มีลำดับ · `<ol>` มีลำดับ · `<li>` แต่ละรายการ · hyperlink เป็นได้ทั้งข้อความและภาพ (absolute / relative reference)
- tag ที่ไม่มีแท็กปิด: `<img>` `<br>` `<input>`

### 14.4 CSS ⭐⭐

| วิธีใส่ | ที่อยู่ |
|---|---|
| **Inline** | attribute `style` ในแท็ก |
| **Internal** | `<style>` ใน `<head>` — มีผลทั้งหน้า |
| **External** | ไฟล์ `.css` แยก (`style.css`) |

| Selector | ตัวอย่าง | จุดจำ |
|---|---|---|
| Element | `p { … }` | ทุกแท็ก `<p>` |
| **Id** | `#para1 { … }` | **ใช้ได้ element เดียว**ในหน้า |
| **Class** | `.center { … }` | ใช้ได้**หลาย** element |
| Universal | `* { … }` | ทุก element |
| Group | `h1, h2, p { … }` | หลายตัวพร้อมกัน |

- Rule = **selector** + **declaration block** `{ property: value; }` · `<div>` แบ่งส่วนเพื่อจัดรูปแบบ อ้างด้วย id/class

### 14.5 Browser ทำงานอย่างไร ⭐⭐

| ส่วน | ทำอะไร |
|---|---|
| **HTML parser** | แปลง HTML → **DOM** (tree) |
| **CSS parser** | แปลง CSS → **CSSOM** |
| **JS runtime** | รัน JavaScript ที่อ่าน/แก้ HTML และ CSS ได้ (browser มีให้แล้ว) |

ลำดับ render: parse HTML → สร้าง DOM · fetch resource (CSS **บล็อก** render, JS บล็อก parser เว้น `defer`/`async`) · parse CSS → CSSOM · รัน JS · **DOM + CSSOM = render tree** · layout + paint

- **Node.js** = JavaScript runtime สร้างบน **Chrome V8** ทำให้รัน JS นอก browser ได้ (backend) — "JavaScript everywhere"

### 14.6 SPA vs SSR ⭐⭐

| | Traditional / **SSR** | **SPA** (Single Page Application) |
|---|---|---|
| Server ตอบอะไร | **HTML พร้อมข้อมูล** | โหลดโครง + JS ครั้งแรก แล้วตอบแค่ **JSON** ผ่าน AJAX |
| เปลี่ยนหน้า | **reload ทั้งหน้า** (มีช่วงหน้าขาว) | **อัปเดตเฉพาะจุด ไม่ reload** |
| ตัวอย่าง | เว็บ PHP เดิม | Gmail, Facebook, Netflix, Airbnb, Uber |

### 14.7 API: REST vs GraphQL ⭐⭐

- **API** (Application Programming Interface) = ทำให้ซอฟต์แวร์สองตัว "คุย" กัน — เปรียบกับ**ปลั๊กไฟ**ที่เป็นช่องมาตรฐานเข้าถึงไฟฟ้า (ตัวอย่าง: Google Maps API, YouTube Data API, Payment API)

| | **REST API** | **GraphQL** |
|---|---|---|
| คืออะไร | วิธีสร้าง web service ด้วย **HTTP methods** | **query language** สำหรับ API |
| คำสั่ง | `GET` `POST` `PUT` `DELETE` | ผู้เรียกระบุเองว่าต้องการ field ไหน |
| ผลลัพธ์ | **JSON** หรือ XML | ได้เท่าที่ขอ |
| ปัญหา/จุดเด่น | บางครั้งดึงข้อมูล**เกินจำเป็น** หรือต้องยิง**หลายครั้ง**เพื่อประกอบ | เกิดมาเพื่อแก้สองข้อนั้น |

### 14.8 Web deployment และ stack

| วิธี deploy | จุดจำ |
|---|---|
| **FTP** (นิยม SFTP / FTP over **TLS**) | โอนไฟล์ client↔server |
| **SCP** | คัดลอกไฟล์ผ่าน **SSH** |
| **SSH** | remote login / รัน command แบบเข้ารหัส (`ssh admin@161.200.1.1`) |
| **SSH/Git** | deploy ผ่าน git local → remote repository |
| **Vercel + GitHub** (แล็บ) | push ขึ้น GitHub → import project ใน Vercel → Deploy ได้ URL `xxx.vercel.app` |

| Stack | ประกอบด้วย |
|---|---|
| **LAMP** | Linux · Apache · MySQL · PHP |
| **MEAN** | MongoDB · Express.js · AngularJS · Node.js |
| **XAMPP** | Apache + MariaDB + PHP + Perl |

- เว็บ dynamic ต้องมีเพิ่ม: **DBMS** (MySQL/MariaDB) + **server-side script** (PHP, Node.js, ASP.NET, Python)

### 14.9 สรุปแล็บ: JavaScript และ DOM

- `<script src="script.js">` วางท้าย `<body>` เพื่อให้ DOM สร้างเสร็จก่อน
- `document.getElementById("id")` · `createElement("li")` · `textContent` · `appendChild` · `addEventListener("click", …)` · `input.value`
- **Local Storage** เก็บข้อมูลฝั่ง client ไม่หายเมื่อรีเฟรช: `localStorage.setItem("todos", JSON.stringify(items))` · `JSON.parse(localStorage.getItem("todos")) || []`

---

## 📗 Week 15 — IT Skills and System ⭐

### 15.1 Digital skills และ Information system

- ความต้องการทักษะดิจิทัล: Thailand Salary Guide · LinkedIn Economic Graph · roadmap.sh · **Full Stack Developer** (front-end + back-end + database + Git)
- **Information system** = hardware (และ network) · software · data · people · procedures — เช่น จองตั๋วที่ช่องขาย → จองออนไลน์ · ตลาดสด → ตลาดออนไลน์ · กระดาษ → ดิจิทัล
- บทบาท: **system analyst** · **system developer** · **system tester**

### 15.2 SDLC — 5 เฟส ⭐⭐

```
Planning → Analysis → Design → Implementation → Support & Security
```

- เป้าหมาย: ระบบตรงความต้องการ · **reliable · efficient · available** · ตรงเวลาและงบ
- แนวทาง 3 ข้อ: **จัดงานเป็นเฟส · ให้ผู้ใช้มีส่วนร่วม · กำหนดมาตรฐาน**
- **Systems analyst** = ออกแบบพัฒนาระบบ และเป็นผู้ติดต่อหลักกับผู้ใช้

| เฟส | กิจกรรมหลัก |
|---|---|
| **Planning** | **steering committee** รับ project request → ทบทวน/อนุมัติ · จัดลำดับความสำคัญ · จัดสรรทรัพยากร · ตั้งทีม |
| **Analysis** | **preliminary investigation** (= feasibility study) → **detailed analysis** (= logical design) → **system proposal** |
| **Design** | จัดหา hardware/software (RFQ · RFP · RFI) → ออกแบบละเอียด: database · input/output (mock-up, layout chart) · program · **prototype/POC** |
| **Implementation** | เขียนโปรแกรม → ติดตั้ง+ทดสอบ → อบรมผู้ใช้ → เปลี่ยนไปใช้ระบบใหม่ |
| **Support & Security** | บำรุงรักษา · เฝ้าดูประสิทธิภาพ · ประเมินความปลอดภัย |

- ทางเลือกใน system proposal: แก้ระบบเดิม · ซื้อ retail software · ใช้ web app · สร้าง custom software · outsource
- **VAR** = ซื้อจากผู้ผลิตมาขายต่อพร้อมบริการเสริม · **UX** = ความรู้สึกผู้ใช้ต่อระบบ

### 15.3 Feasibility, Requirement, เก็บข้อมูล ⭐⭐

| Feasibility | ถามว่า |
|---|---|
| **Operational** | ผู้ใช้จะใช้ไหม ตรงความต้องการไหม |
| **Schedule** | deadline สมเหตุสมผลไหม |
| **Technical** | มีทรัพยากร ซอฟต์แวร์ คนพอไหม |
| **Economic** | ประโยชน์ > ต้นทุนไหม (cost/benefit, ROI, payback) |

| Requirement | ความหมาย | ตัวอย่าง |
|---|---|---|
| **Functional** | สิ่งที่ระบบ**ต้องทำ** | ถอนเงิน โอนเงิน ค้นหาสินค้าตามชื่อ |
| **Non-functional** | คุณสมบัติอื่น: UI · reliability · performance · security · ข้อจำกัด | ตอบภายใน 3 วินาที · เข้ารหัส 256-bit |

- เก็บข้อมูล: review documentation · observe · survey (closed/open) · interview (structured/unstructured) · **JAD session** (ประชุมร่วมผู้ใช้ เจ้าของระบบ ผู้บริหาร SA นักออกแบบ โปรแกรมเมอร์) · research
- **Gantt chart** ง่าย · **PERT chart** (network diagram) ซับซ้อนกว่า เหมาะโครงการใหญ่ · project management ระบุ scope · เวลา · ต้นทุน · ลำดับงาน

### 15.4 ทดสอบ การเปลี่ยนระบบ และ CI/CD

| การทดสอบ | ตรวจอะไร |
|---|---|
| **Unit test** | แต่ละโปรแกรมเดี่ยว ๆ |
| **Systems test** | ทุกโปรแกรม**ในแอปเดียวกัน**ทำงานร่วมกัน |
| **Integration test** | แอปทำงานร่วมกับ**แอปอื่น** |
| **Acceptance test** | ผู้ใช้ตรวจด้วย**ข้อมูลจริง** |

- **CI** = Continuous Integration (รวมโค้ดเข้าส่วนกลางและทดสอบสม่ำเสมอ) · **CD** = Continuous Delivery หรือ Continuous Deployment (สไลด์แสดงวงจรทั้งสาม)
- แล็บ: deploy To-do List ขึ้น **Vercel** ผ่าน GitHub (Framework Preset = Other) · MCP = วิธีให้ AI agent เรียกใช้เครื่องมือภายนอก

---

# ส่วนที่ 2: การคำนวณ IP / Subnet ⭐⭐⭐

> ข้อสอบ Week 12 ออกเป็นโจทย์คำนวณ — ฝึกจนทำได้โดยไม่ดูสูตร ตัวเลขทุกตัวในส่วนนี้ตรวจซ้ำสองรอบแล้ว

## 2.1 สูตรที่ต้องจำ

| สิ่งที่หา | สูตร |
|---|---|
| Host bits (h) | 32 − (ตัวเลขหลัง `/`) |
| จำนวน address ต่อวง | 2ʰ |
| **Usable host ต่อวง** | **2ʰ − 2** |
| Network ID | IP **AND** mask (ทุกบิต) |
| Broadcast | network ID ที่ host bits เป็น 1 ทั้งหมด |
| ช่วงใช้ได้ | network + 1 … broadcast − 1 |
| Block size | 256 − (ค่า mask ใน octet ที่ "ไม่เต็ม") |
| จำนวน subnet | 2ᵇ เมื่อ b = บิตที่ยืม = prefix ใหม่ − prefix เดิม |

## 2.2 วิธีทำ 6 ขั้น (ใช้ได้ทุกข้อ)

1. **Class** จากไบต์แรก: 0–127 = A (/8) · 128–191 = B (/16) · 192–223 = C (/24) · ถ้าโจทย์ให้ `/n` มาแล้วใช้ `/n` ตามนั้น
2. **Mask** จาก `/n` — เติม 1 จำนวน n บิตจากซ้าย (octet ละ 8 บิต)
3. **Host bits** h = 32 − n → usable = 2ʰ − 2
4. หา **octet ที่ไม่เต็ม** (ไม่ใช่ 255 และไม่ใช่ 0) → block size = 256 − ค่า mask ใน octet นั้น
5. **Network ID** = ตัวคูณของ block size ที่ใหญ่ที่สุดที่ **≤** ค่า octet ของ IP (octet ซ้ายมือคงเดิม ขวามือเป็น 0)
6. **Broadcast** = network + block size − 1 · ช่วงใช้ได้ = network + 1 … broadcast − 1

### ตาราง mask ที่ใช้บ่อย (อยู่ใน octet สุดท้าย ของวง /24)

| Prefix | Mask | Block size | Host bits | Usable (2ʰ−2) | Subnet ใน /24 |
|---|---|---|---|---|---|
| /24 | 255.255.255.0 | 256 | 8 | 254 | 1 |
| /25 | 255.255.255.128 | 128 | 7 | 126 | 2 |
| /26 | 255.255.255.192 | 64 | 6 | 62 | 4 |
| /27 | 255.255.255.224 | 32 | 5 | 30 | 8 |
| /28 | 255.255.255.240 | 16 | 4 | 14 | 16 |
| /29 | 255.255.255.248 | 8 | 3 | 6 | 32 |
| /30 | 255.255.255.252 | 4 | 2 | 2 | 64 |

> ที่มาของค่า mask: 128, 192 = 128+64, 224 = 128+64+32, 240 = …+16, 248 = …+8, 252 = …+4

## 2.3 ตัวอย่างที่ 1 — 161.246.18.x /26 (แบ่งเป็น 4 subnet) ⭐⭐⭐

**โจทย์:** เครือข่าย 161.246.18.x ใช้ prefix /26 — mask คืออะไร แบ่งได้กี่ subnet แต่ละวงมีกี่ IP ใช้ได้กี่เครื่อง ใช้ได้ทั้งหมดกี่เครื่อง

**ทำทีละขั้น**

1. `/26` = เติม 1 จำนวน 26 บิต → `11111111.11111111.11111111.11000000`
2. octet สุดท้าย `11000000` = 128 + 64 = **192** → mask = **255.255.255.192**
3. Host bits h = 32 − 26 = **6** → address ต่อวง = 2⁶ = **64** (เช็ก: block size = 256 − 192 = **64** ✓)
4. วง /26 อยู่ใน /24 เดิมที่ /24 → ยืมมา 26 − 24 = **2 บิต** → จำนวน subnet = 2² = **4**
5. Usable ต่อวง = 64 − 2 = **62** (หัก network address 1 และ broadcast 1)
6. รวมใช้ได้ = 4 × 62 = **248** เครื่อง (ไม่ใช่ 4 × 64 = 256)

**ช่วงของทั้ง 4 subnet**

| Subnet | Network ID | ช่วง IP ที่ใช้ได้ | Broadcast | จำนวนใช้ได้ |
|---|---|---|---|---|
| 1 | 161.246.18.**0** | 161.246.18.1 – 161.246.18.62 | 161.246.18.63 | 62 |
| 2 | 161.246.18.**64** | 161.246.18.65 – 161.246.18.126 | 161.246.18.127 | 62 |
| 3 | 161.246.18.**128** | 161.246.18.129 – 161.246.18.190 | 161.246.18.191 | 62 |
| 4 | 161.246.18.**192** | 161.246.18.193 – 161.246.18.254 | 161.246.18.255 | 62 |

- สองบิตหน้าของ octet สุดท้ายเป็นตัวบอกว่าอยู่ subnet ไหน: `00` = วงที่ 1 · `01` = วงที่ 2 · `10` = วงที่ 3 · `11` = วงที่ 4
- **ลองตรวจเครื่อง 161.246.18.100:** 100 อยู่ระหว่าง 64 กับ 127 → วงที่ 2 → network ID = 161.246.18.64
  ตรวจด้วย AND: 100 = `01100100` · 192 = `11000000` → `01000000` = **64** ✓
- ตรวจผลรวม address: 4 × 64 = 256 ครบ /24 พอดี

## 2.4 ตัวอย่างที่ 2 — Host เดียวใน /27 (192.168.1.70 /27)

**โจทย์:** เครื่อง 192.168.1.70 mask /27 — หา mask, network ID, broadcast, ช่วงที่ใช้ได้, จำนวนเครื่อง

1. `/27` → 27 − 24 = 3 บิตใน octet สุดท้าย → `11100000` = 128 + 64 + 32 = **224** → mask **255.255.255.224**
2. h = 32 − 27 = **5** → address ต่อวง = 2⁵ = 32 (block size = 256 − 224 = **32** ✓)
3. Usable = 32 − 2 = **30**
4. วงของ /27 ใน octet สุดท้าย: 0, 32, 64, 96, 128, 160, 192, 224 (8 วง)
5. 70 อยู่ระหว่าง 64 กับ 95 → **Network ID = 192.168.1.64**
   ตรวจด้วย AND: 70 = `01000110` · 224 = `11100000` → `01000000` = **64** ✓
6. **Broadcast** = 64 + 32 − 1 = **192.168.1.95**
7. ช่วงที่ใช้ได้ = **192.168.1.65 – 192.168.1.94** (30 ตัว: 94 − 65 + 1 = 30 ✓)

**ตัวอย่างเสริมแบบ /25** (จากหน้า Week 12): 161.246.38.200 /25 → mask 255.255.255.128 · block 128 · วง 0 กับ 128 · 200 ≥ 128 → network **161.246.38.128** · broadcast 161.246.38.255 · ใช้ได้ .129 – .254 · usable = 2⁷ − 2 = **126**

## 2.5 ตัวอย่างที่ 3 — Class B /16 (130.61.22.204)

**โจทย์:** IP 130.61.22.204/16 — class อะไร, mask, network ID, broadcast, ช่วงใช้ได้, จำนวนเครื่อง

1. ไบต์แรก 130 อยู่ใน 128–191 → **Class B**
2. Default mask /16 = **255.255.0.0** (network 16 บิต · host 16 บิต)
3. Network ID = AND ทีละ octet: 130 AND 255 = 130 · 61 AND 255 = 61 · 22 AND 0 = 0 · 204 AND 0 = 0 → **130.61.0.0**
4. **Broadcast** = host bits เป็น 1 หมด → **130.61.255.255**
5. ช่วงใช้ได้ = **130.61.0.1 – 130.61.255.254**
6. Usable = 2¹⁶ − 2 = 65,536 − 2 = **65,534**

**เปรียบเทียบ IP เดียวกันกับ mask ต่างกัน (161.246.38.35)**

| Mask | Network ID |
|---|---|
| 255.255.255.0 (/24) | 161.246.38.0 |
| 255.255.0.0 (/16) | 161.246.0.0 |
| 255.0.0.0 (/8) | 161.0.0.0 |
| 255.255.255.128 (/25) | 161.246.38.0 (35 < 128) |

**ตรวจว่าอยู่วงเดียวกันไหม:** 192.168.200.200 กับ 192.168.100.100
- mask /24 → 192.168.**200**.0 กับ 192.168.**100**.0 → **คนละวง** ต้องผ่าน router
- mask /16 → ทั้งคู่ 192.168.0.0 → **วงเดียวกัน** คุยตรงผ่าน switch

## 2.6 ตัวอย่างที่ 4 — Class A /8 (10.16.127.104) ⭐⭐⭐

**โจทย์:** IP 10.16.127.104 — หา class, Network ID, Host ID, จำนวนเครื่องที่ใช้ได้

1. ไบต์แรก 10 อยู่ใน 0–127 → **Class A** → default mask **255.0.0.0 (/8)**
2. Network = 8 บิตแรก → **Network ID = 10** (เขียนเต็ม 10.0.0.0) · Host ID = 3 ชุดหลัง = **16.127.104**
3. Host bits = 32 − 8 = **24** → address ต่อวง = 2²⁴ = **16,777,216**
4. Usable = 2²⁴ − 2 = **16,777,214**
5. Broadcast = **10.255.255.255** · ช่วงใช้ได้ = **10.0.0.1 – 10.255.255.254**
6. ตรวจด้วย AND: 10 AND 255 = 10 · 16 AND 0 = 0 · 127 AND 0 = 0 · 104 AND 0 = 0 → **10.0.0.0** ✓
7. 10.x.x.x ยังอยู่ในช่วง **private address** (10.0.0.0 – 10.255.255.255) จึงออก Internet ตรง ๆ ไม่ได้ ต้องผ่าน **NAT**

**ภาพรวม:** ยิ่ง network bits มาก (mask ยาว) ยิ่งมีวงเยอะแต่เครื่องต่อวงน้อย — A (/8) → 16,777,214 · B (/16) → 65,534 · C (/24) → 254

## 2.7 โจทย์ย้อนกลับ: ต้องการกี่เครื่อง → เลือก prefix

หา h เล็กที่สุดที่ **2ʰ − 2 ≥ จำนวนเครื่อง** (นับ PC + server + router ทุกตัว)

| ต้องการ | 2ʰ − 2 | เลือก |
|---|---|---|
| ≤ 2 | 2 | /30 |
| ≤ 6 | 6 | /29 |
| ≤ 14 | 14 | /28 |
| ≤ 30 | 30 | /27 |
| ≤ 62 | 62 | /26 |
| ≤ 126 | 126 | /25 |
| ≤ 254 | 254 | /24 |

## 2.8 โจทย์ฝึก (ทำเองก่อน ค่อยดูเฉลยท้ายหัวข้อ)

**ข้อ 1.** IP 172.16.5.130 /26 — หา mask, network ID, broadcast, ช่วงใช้ได้, จำนวนเครื่องที่ใช้ได้

**ข้อ 2.** IP 192.168.50.99 /28 — หา mask, network ID, broadcast, ช่วงใช้ได้, จำนวนเครื่องที่ใช้ได้

**ข้อ 3.** IP 150.20.3.4 ใช้ default mask — class อะไร, mask, network ID, broadcast, จำนวนเครื่องที่ใช้ได้ต่อ network

**ข้อ 4.** แผนกหนึ่งมี PC 60 เครื่อง + server 1 + router 1 (รวม 62 อุปกรณ์) ต้องการวงที่เล็กที่สุดที่พอใช้ — เลือก prefix อะไร และ mask คืออะไร (ถ้าใช้ /27 พอไหม)

**ข้อ 5.** 192.168.5.70 กับ 192.168.5.100 mask /27 อยู่วงเดียวกันหรือไม่ — แสดง network ID ของทั้งสองเครื่อง

---

**เฉลยโจทย์ฝึก**

| ข้อ | คำตอบ |
|---|---|
| **1** | /26 → mask **255.255.255.192** · block 64 · 130 อยู่ใน 128–191 → network **172.16.5.128** · broadcast 128 + 64 − 1 = **172.16.5.191** · ใช้ได้ **172.16.5.129 – 172.16.5.190** · usable 2⁶ − 2 = **62** |
| **2** | /28 → mask **255.255.255.240** · block 16 · 99 อยู่ใน 96–111 (96 = 16×6) → network **192.168.50.96** · broadcast 96 + 16 − 1 = **192.168.50.111** · ใช้ได้ **192.168.50.97 – 192.168.50.110** · usable 2⁴ − 2 = **14** |
| **3** | 150 อยู่ใน 128–191 → **Class B** · mask **255.255.0.0 (/16)** · network **150.20.0.0** · broadcast **150.20.255.255** · usable 2¹⁶ − 2 = **65,534** |
| **4** | ต้องการ ≥ 62 usable → h = 6 (2⁶ − 2 = 62 พอดี) → **/26** = **255.255.255.192** · /27 มีแค่ 2⁵ − 2 = 30 **ไม่พอ** |
| **5** | block size 32: 70 อยู่ใน 64–95 → network **192.168.5.64** · 100 อยู่ใน 96–127 → network **192.168.5.96** · network ID ต่างกัน → **คนละวง** (ต้องผ่าน router) |

---

# ส่วนที่ 3: ตารางเปรียบเทียบที่มักออก

## 3.1 CSMA/CD vs CSMA/CA ⭐⭐⭐

| | **CSMA/CD** | **CSMA/CA** |
|---|---|---|
| ใช้กับ | **Ethernet** (มีสาย) | **802.11 Wi-Fi** (ไร้สาย) |
| D / A | Collision **Detection** (ตรวจจับ) | Collision **Avoidance** (หลีกเลี่ยง) |
| ตรวจการชนอย่างไร | **ฟังสายขณะส่ง** รู้ว่ามีการชนก็หยุดส่ง | ตรวจขณะส่งไม่ได้ → ใช้ **ACK** หลัง SIFS เป็นหลักฐานว่าส่งสำเร็จ |
| หลังชน/ล้มเหลว | back-off (รอเวลาสุ่ม) แล้วส่งใหม่ | ขยายช่วง random backoff แล้วลองใหม่ |
| ตัวเสริม | — | **RTS/CTS** แก้ hidden terminal |
| ทำไมเลือกแบบนี้ | บนสายตรวจการชนได้ง่าย | ไร้สายสัญญาณอ่อน + hidden terminal ทำให้ตรวจการชนไม่ได้ |

## 3.2 Hub vs Switch vs Router ⭐⭐⭐

| | Hub (Repeater) | Switch (Bridge / L2) | Router (L3) |
|---|---|---|---|
| Layer | 1 Physical | 2 Data link | 3 Network |
| หน่วยข้อมูล | bit / สัญญาณ | **frame** | **packet** |
| ใช้ address | ไม่ใช้ | **MAC** | **IP** |
| กรองข้อมูล | **ไม่กรอง** ส่งออกทุกพอร์ต | กรอง (bridge table) | ตัดสินเส้นทาง (routing/forwarding table) |
| Collision domain | เดียวทั้งหมด | **แยกต่อพอร์ต** | แยก |
| Broadcast domain | ไม่แยก | ไม่แยก | **แยก** |

## 3.3 Routing vs Forwarding ⭐⭐

| | Routing | Forwarding |
|---|---|---|
| ขอบเขต | **global** — ทั้งเส้นทาง | **local** — router ตัวเดียว |
| ใช้อะไร | routing algorithm | forwarding table |
| ทำอะไร | หาเส้นทางต้นทาง→ปลายทาง | ย้าย packet ขาเข้า→ขาออก |

## 3.4 DSL vs Cable vs FTTH ⭐⭐

| | DSL | Cable (HFC) | FTTH |
|---|---|---|---|
| สาย | สายโทรศัพท์เดิม | coax + fiber | fiber ถึงบ้าน |
| การใช้ร่วม | **dedicated** ไปชุมสาย | **shared** กับเพื่อนบ้าน | — |
| อุปกรณ์ปลายทาง | DSLAM | cable headend | — |
| ลักษณะ | — | asymmetric (ขาลงเร็วกว่า) | เร็วสูง |

## 3.5 Guided vs Unguided media ⭐⭐

| | Guided | Unguided |
|---|---|---|
| สัญญาณ | วิ่งในตัวกลางแข็ง | แพร่ในอากาศ |
| ตัวอย่าง | twisted pair (Cat 5/6) · coaxial · fiber optic | radio · Wi-Fi · 4G/5G · Bluetooth · satellite · microwave |
| จุดเด่น | fiber: เร็ว error ต่ำ ไม่โดนรบกวนแม่เหล็กไฟฟ้า | ครอบคลุมพื้นที่ แต่โดน path loss/interference |

## 3.6 FDMA vs TDMA vs CDMA

| | แบ่งด้วย | ข้อสังเกต |
|---|---|---|
| FDMA | ความถี่ | ช่องความถี่แยกคนละคน |
| TDMA | เวลา | ความถี่เดียว แบ่ง time slot |
| CDMA | รหัส (chipping sequence) | ความถี่เดียว เวลาเดียว ต้อง orthogonal |

## 3.7 Wi-Fi 2.4 GHz vs 5 GHz

| | 2.4 GHz | 5 GHz |
|---|---|---|
| ระยะ | ไกลกว่า | สั้นกว่า |
| path loss | น้อยกว่า | มากกว่า (ความถี่สูง) |
| การรบกวน | ใช้ร่วมกับอุปกรณ์อื่น | น้อยกว่า |
| มาตรฐาน | b/g/n/ax | n/ac/ax (ac = 5 GHz เท่านั้น) |

## 3.8 Infrastructure mode vs Ad hoc mode

| | Infrastructure | Ad hoc |
|---|---|---|
| Base station / AP | **มี** | **ไม่มี** |
| การจัดเครือข่าย | ผ่าน AP | node จัดกันเอง |
| ตัวอย่าง | Wi-Fi บ้าน/มหาวิทยาลัย · มือถือ + เสา | Bluetooth · MANET · VANET |
| เฉพาะ | handoff เมื่อเปลี่ยน base station | — |

## 3.9 Topology 5 แบบ (สรุปจุดอ่อน)

| Topology | จุดเสี่ยงที่ข้อสอบชอบถาม |
|---|---|
| Mesh | แพง สายมาก (n(n−1)/2) |
| Star | ศูนย์กลางเสีย = ล่ม (single point of failure) |
| Bus | สายหลักขาด = ล่มทั้งระบบ |
| Ring | โหนดขาด = วงล่ม |
| Hybrid | สายหลักขาด = ข้ามกลุ่มไม่ได้ |

## 3.10 Static vs Dynamic web ⭐⭐

| | Static | Dynamic |
|---|---|---|
| Backend / DB | ไม่มี | มี |
| เนื้อหา | เหมือนกันทุกคน | ตามผู้ใช้/เวลา |
| เรียกว่า | website | web app |

## 3.11 SPA vs SSR ⭐⭐

| | SPA | SSR |
|---|---|---|
| Server ส่ง | JSON (ข้อมูลดิบ) ผ่าน AJAX | HTML พร้อมข้อมูล |
| เปลี่ยนหน้า | ไม่ reload อัปเดตเฉพาะจุด | reload ทั้งหน้า |

## 3.12 REST vs GraphQL ⭐⭐

| | REST | GraphQL |
|---|---|---|
| หลัก | HTTP methods (GET/POST/PUT/DELETE) | query language |
| ข้อมูล | JSON/XML | ผู้เรียกระบุ field |
| ปัญหาที่ GraphQL แก้ | ดึงเกิน หรือต้องยิงหลายรอบ | — |

## 3.13 CSS: Inline vs Internal vs External · Id vs Class

| | ที่เขียน | ขอบเขต |
|---|---|---|
| Inline | attribute `style` | element เดียว |
| Internal | `<style>` ใน `<head>` | ทั้งหน้า |
| External | ไฟล์ `.css` | หลายหน้า |

| | Id | Class |
|---|---|---|
| สัญลักษณ์ | `#` | `.` |
| จำนวน element | 1 ในหน้า | หลายตัว |

## 3.14 TPS / MIS / DSS / Expert system ⭐⭐

| | TPS | MIS | DSS | Expert system |
|---|---|---|---|---|
| ทำอะไร | เก็บ/ประมวลผลธุรกรรมประจำวัน | **ทำรายงาน**ให้ผู้จัดการ | **ช่วยวิเคราะห์**ตัดสินใจ | **เลียนแบบ**ผู้เชี่ยวชาญ |
| เทคนิค | **OLTP** / batch | detailed · exception report | **OLAP** · ข้อมูลภายใน+ภายนอก | knowledge base + inference engine |
| ตัวอย่าง | จองตั๋วออนไลน์ | รายชื่อผู้โดยสาร · เที่ยวบินต่ำกว่าเป้า | ดอกเบี้ย แนวโน้มประชากร | Restaurant Advisor |

## 3.15 CMS vs DMS vs ERP

| | CMS | DMS | ERP |
|---|---|---|---|
| เน้น | **เผยแพร่**เนื้อหา | **เก็บเอกสาร** + สิทธิ์ + เวอร์ชัน | รวมข้อมูลทั้งองค์กร |

## 3.16 Digital signature vs Digital certificate vs Encryption

| | ทำอะไร |
|---|---|
| Encryption | แปลงเป็นรหัส กันคนไม่มีสิทธิ์อ่าน |
| Digital signature | ยืนยันตัว**ผู้ส่ง** |
| Digital certificate | รับรองว่า**ผู้ใช้/เว็บ**เป็นของจริง |

## 3.17 กลยุทธ์การเปลี่ยนระบบ (Conversion) ⭐⭐

| แบบ | ทำอย่างไร | ความเสี่ยง |
|---|---|---|
| **Direct** | เลิกระบบเก่า ใช้ระบบใหม่**ทันที** | **สูงสุด** (ถ้าพังไม่มีตัวสำรอง) |
| **Parallel** | ใช้**ทั้งสองระบบคู่กัน**ช่วงหนึ่ง | **ปลอดภัยสุด** แต่ค่าใช้จ่ายสูง |
| **Phased** | เปลี่ยน**ทีละส่วน/โมดูล** | กลาง |
| **Pilot** | ทดลองเต็มรูปแบบที่**หน่วยงานเดียว**ก่อน แล้วขยาย | ต่ำ-กลาง |

## 3.18 RFQ vs RFP vs RFI ⭐⭐

| | ใช้เมื่อ | ผู้ขายทำอะไร |
|---|---|---|
| **RFQ** (quotation) | **รู้สินค้าแล้ว** | เสนอ**ราคา** |
| **RFP** (proposal) | บอกความต้องการ | **เลือกสินค้าเอง** + เสนอราคา |
| **RFI** (information) | ขอข้อมูลแบบไม่เป็นทางการ | ให้**ข้อมูล**สินค้า/บริการ |

## 3.19 Functional vs Non-functional · 4 Feasibility · 4 Tests

| คู่ | ต่างกันที่ |
|---|---|
| Functional vs Non-functional | สิ่งที่ระบบ**ทำ** vs คุณสมบัติ (เร็ว ปลอดภัย เสถียร) |
| Systems test vs Integration test | โปรแกรมใน**แอปเดียวกัน** vs ร่วมกับ**แอปอื่น** |
| Gantt vs PERT | ง่าย vs ซับซ้อน เหมาะโครงการใหญ่ |
| Preliminary investigation vs Detailed analysis | = feasibility study vs = logical design |

## 3.20 Validation check · Slander vs Libel · Network attacks

| คู่ | ต่างกันที่ |
|---|---|
| Range vs Consistency | field เดียว vs ความสัมพันธ์หลาย field |
| Slander vs Libel | **พูด** vs **เขียน** |
| Phishing vs Clickjacking | อีเมลหลอก vs ปุ่ม/ลิงก์ที่ซ่อนโปรแกรมร้าย |
| Sniffing vs Spoofing vs DoS | **อ่าน**packet vs **ปลอม**ต้นทาง vs **ถล่ม**จนใช้ไม่ได้ |
| Unicast vs Broadcast vs Multicast | 1 เครื่อง vs ทุกเครื่อง vs กลุ่มที่ join |

---

# ส่วนที่ 4: เช็กลิสต์คืนก่อนสอบ

## ✅ ต้องรู้รายสัปดาห์

**Week 08 — Database ⭐**
- [ ] ลำดับชั้นข้อมูล character → field → record → file → database · field = เล็กสุดที่ผู้ใช้เข้าถึง
- [ ] Primary key · AutoNumber · ชนิดข้อมูล
- [ ] Validation 5 แบบ (alphabetic/numeric · range · consistency · completeness · check digit)
- [ ] File processing: redundant + isolated · ข้อดีข้อเสีย database approach
- [ ] Relational / object-oriented / multidimensional (data warehouse)
- [ ] DBMS · DBA · data dictionary · เครื่องมือดึงข้อมูล 4 แบบ · least privilege · SQL SELECT-FROM-WHERE

**Week 09 — Ethics & Law ⭐**
- [ ] Software / information / hardware theft · vandalism · encryption · digital signature vs certificate
- [ ] Cookie · phishing · clickjacking · spyware · social engineering
- [ ] หลักจริยธรรม 4 ข้อ (proportionality · informed consent · justice · minimized risk)
- [ ] Digital disruption · digital native · slander vs libel · cyberbullying
- [ ] กฎหมายไทย + ปี: คอมพิวเตอร์ 2550 · PDPA 2562 · ไซเบอร์ 2562 · ธุรกรรมอิเล็กทรอนิกส์ 2544 · ลิขสิทธิ์ 2537 · สิทธิบัตร 2522

**Week 10 — Enterprise ⭐**
- [ ] Information system 5 องค์ประกอบ
- [ ] ERP · CMS · DMS · TPS (OLTP) · MIS · DSS (OLAP) · expert system
- [ ] detailed vs exception report
- [ ] ตำแหน่งงาน: systems analyst · help desk · SEO · data scientist · DBA · digital forensics
- [ ] Certification: CISSP, CCNA · LinkedIn

**Week 11 — Internet ⭐⭐⭐**
- [ ] Nuts-and-bolts view vs service view
- [ ] Host = end system (web server ด้วย) · router/link-layer switch ไม่ใช่ end system · router ไม่ใช่ link
- [ ] Protocol = format + order + actions · IETF/RFC · TCP/IP
- [ ] Layer และหน่วย: message → segment → datagram → frame → bits
- [ ] Encapsulation (matryoshka)
- [ ] DSL vs cable · FTTH · Cat 5/6 · guided vs unguided
- [ ] Forwarding (local) vs routing (global)
- [ ] Network of networks: tier-1 · IXP · peering · regional ISP · content provider
- [ ] Packet sniffing · IP spoofing · DoS (botnet) · firewall · VPN
- [ ] Transmission delay = L/R

**Week 12 — Networks 2 ⭐⭐⭐**
- [ ] Topology 5 แบบ + mesh n(n−1)/2
- [ ] CSMA · CSMA/CD (ฟังขณะส่ง) · token passing (ring)
- [ ] Ethernet: 10Base-T · Fast / Gigabit / 10-Gigabit (full duplex เท่านั้น)
- [ ] Hub (ไม่กรอง) / switch (MAC) / router (IP) · repeater = regenerator
- [ ] IP = Network ID + Host ID · Network ID = IP AND mask
- [ ] Class A/B/C ช่วงไบต์แรก, mask, usable 16,777,214 / 65,534 / 254
- [ ] Special address: network / directed broadcast / limited broadcast / loopback 127
- [ ] Private: 10/8 · 172.16–172.31 · 192.168/16 · NAT
- [ ] **ทำโจทย์ Part 2 ทั้ง 4 ตัวอย่าง + 5 ข้อฝึกซ้ำโดยไม่ดูเฉลย**
- [ ] static route / next hop / /30

**Week 13 — Wireless ⭐⭐⭐**
- [ ] Wireless host · base station · wireless link · infrastructure vs ad hoc · handoff
- [ ] Taxonomy 2×2: Wi-Fi/cellular · mesh · Bluetooth · MANET/VANET
- [ ] Path loss · interference · multipath · SNR/BER · hidden terminal
- [ ] CDMA: chipping sequence · encode/decode · orthogonal
- [ ] 802.11 b/g/n/ac/ax: ปี อัตรา ความถี่ (ac = 5 GHz)
- [ ] BSS · SSID · channel · association (passive/active) · DHCP
- [ ] CSMA/CA: DIFS · SIFS · ACK · backoff · RTS/CTS
- [ ] Bluetooth 802.15.1 · Zigbee 802.15.4

**Week 14 — Web ⭐⭐**
- [ ] HTML / CSS / JavaScript หน้าที่ · text editor vs code editor vs CMS
- [ ] โครง HTML · h1–h6 · p · img · a · ul/ol/li
- [ ] CSS 3 แบบ · selector (element, #id, .class, *, group)
- [ ] Static vs dynamic · frontend vs backend · web server (Apache, Nginx, IIS)
- [ ] DOM / CSSOM / JS runtime · Node.js (V8)
- [ ] SPA vs SSR · REST vs GraphQL
- [ ] FTP / SCP / SSH / Git · LAMP / MEAN / XAMPP · Vercel deploy
- [ ] DOM API + Local Storage จากแล็บ

**Week 15 — IT Skills & System ⭐**
- [ ] SDLC 5 เฟสเรียงลำดับ + กิจกรรมของแต่ละเฟส
- [ ] 3 แนวทาง (เฟส · ผู้ใช้มีส่วนร่วม · มาตรฐาน) · steering committee · systems analyst
- [ ] Feasibility 4 ด้าน · functional vs non-functional · JAD
- [ ] RFQ / RFP / RFI · VAR · prototype/POC
- [ ] Unit / systems / integration / acceptance test
- [ ] Direct / parallel / phased / pilot
- [ ] Gantt vs PERT · CI/CD

## ⚠️ กับดักที่พบบ่อย (รวมจากทุกสัปดาห์)

**Database / Ethics / Enterprise**
- **Field** เป็นหน่วยเล็กสุดที่ผู้ใช้เข้าถึง — ไม่ใช่ character
- Consistency check ดู**ความสัมพันธ์ระหว่าง field** · range check ดูตัวเลขใน field เดียว
- จุดอ่อน file processing ต้องตอบทั้ง **redundant และ isolated**
- Multidimensional → data warehouse · object-oriented → ไฟล์สื่อ
- **Slander = พูด · libel = เขียน**
- Digital **signature** ยืนยันผู้ส่ง · digital **certificate** รับรองผู้ใช้/เว็บ
- PDPA กับ พ.ร.บ. ไซเบอร์ ออกปีเดียวกัน (2562) แต่คนละเรื่อง · พ.ร.บ. คอมพิวเตอร์ฉบับแรก **2550** (2560 คือฉบับแก้ไข)
- Clickjacking ซ่อนโปรแกรมร้ายในสิ่งที่กดได้ · phishing มาทางอีเมล
- **TPS ↔ OLTP · DSS ↔ OLAP** อย่าสลับ
- MIS = ทำรายงาน · DSS = ช่วยวิเคราะห์ · expert system = เลียนแบบผู้เชี่ยวชาญ
- CMS เน้นเผยแพร่ · DMS เน้นเก็บเอกสารพร้อมเวอร์ชัน
- DB **administrator** ดูแล data dictionary · DB **analyst** วิเคราะห์การใช้ข้อมูล

**Week 11**
- **Web server เป็น end system** (host ทุกเครื่องที่รันแอป)
- **Router ไม่ใช่ communication link** · **link-layer switch ไม่ใช่ end system**
- RFC ออกโดย **IETF** ไม่ใช่ IEEE
- DSL = สายเฉพาะ · cable = แชร์กับเพื่อนบ้าน
- Routing = วางเส้นทางทั้งหมด · forwarding = ส่งต่อที่ router ตัวเดียว
- ชั้น transport ใช้คำว่า **segment** (ไม่ใช่ packet) · network layer = **datagram**

**Week 12**
- Hub **ไม่กรอง** · switch กรองด้วย **MAC** · router ใช้ **IP**
- Repeater เป็น regenerator ไม่ใช่ amplifier
- **CSMA/CD ตรวจการชนโดยฟังสายขณะส่ง** — ไม่ได้รอ ACK (ACK เป็นของ CSMA/CA)
- Class C ใช้ได้ **254** ไม่ใช่ 256 · /26 หนึ่งวงใช้ได้ **62** ไม่ใช่ 64
- 4 วง /26 รวมใช้ได้ **248** ไม่ใช่ 256
- **172.16–172.31** เท่านั้นที่เป็น private class B — 172.32.x.x ไม่ใช่
- 10-Gigabit Ethernet ไม่ใช้ CSMA/CD — full duplex อย่างเดียว
- /30 มี 4 address ใช้ได้ **2** (ตัวแรกชื่อวง ตัวสุดท้าย broadcast)
- **Next hop** ต้องอยู่วงเดียวกับพอร์ตของ router เรา · `ip route` ใส่**ชื่อวง** ไม่ใช่ IP เครื่อง · ping ข้ามวงต้องมี route **ขากลับ**
- Network ID = IP AND mask — อย่าลืม AND กับ **mask ที่โจทย์ให้** ไม่ใช่ default mask เสมอไป

**Week 13**
- Wi-Fi (802.11) ใช้ **CSMA/CA** (ไม่ใช่ CDMA, ไม่ใช่ CSMA/CD) · CDMA เป็นการแบ่งช่องสัญญาณ (channel partitioning) ที่ใช้ในเซลลูลาร์
- Ethernet = CSMA/**CD** (ตรวจจับ) · wireless = CSMA/**CA** (หลีกเลี่ยง)
- **Hidden terminal:** A กับ C ไม่ได้ยินกัน ต่างส่งไป B แล้ว**ชนกันที่ B** — แก้ด้วย **RTS/CTS** ไม่ใช่เพิ่มกำลังส่ง
- Infrastructure ต้องมี base station · ad hoc ไม่มี
- 802.11ac = **5 GHz เท่านั้น**
- ความถี่สูงส่งได้**สั้น**กว่า (ไม่ใช่ไกลกว่า)

**Week 14**
- **Id ใช้ `#` · class ใช้ `.`** — id ใช้ได้ element เดียว class ใช้ได้หลายตัว
- Internal CSS อยู่ใน **`<head>`** ไม่ใช่ `<body>`
- HTML เป็น markup language ไม่ใช่ภาษาโปรแกรม · JavaScript เป็นภาษาโปรแกรม
- `<script>` วางท้าย `<body>` เพื่อรอ DOM

**Week 15**
- Preliminary investigation = **feasibility study** · detailed analysis = **logical design**
- "ตอบภายใน 2 วินาที" = **non-functional** ไม่ใช่ functional
- Economic feasibility = cost/benefit — ไม่ใช่เรื่องเวลา (นั่นคือ schedule)
- **RFQ** รู้สินค้าแล้วขอราคา · **RFP** ให้ผู้ขายเลือกสินค้าเอง
- **Systems test** = โปรแกรมในแอปเดียวกัน · **integration test** = ร่วมกับแอปอื่น

## ⚡ เทคนิคทำข้อสอบ

1. **ข้อสอบเน็ตเวิร์กมักถาม "ข้อใดไม่ใช่"** — อ่านโจทย์ให้ครบก่อนตอบ
2. **ตัวเลือกที่สลับคุณสมบัติกัน** เป็นตัวลวงที่พบบ่อย (CD ↔ CA, TPS ↔ DSS, slander ↔ libel, RFQ ↔ RFP)
3. **โจทย์ IP:** เขียนเลขฐานสองเฉพาะ octet ที่ไม่เต็ม แล้วเช็กคำตอบด้วย block size (network ต้องหารด้วย block ลงตัว)
4. **ลบ 2 ทุกครั้ง** เมื่อถามจำนวนเครื่องที่ใช้ได้ แต่**ไม่ลบ**เมื่อถามจำนวน address ทั้งหมดของวง
5. **คีย์เวิร์ดภาษาอังกฤษ** ต้องสะกดได้ตรง — ข้อสอบ Week 11–13 เป็นศัพท์อังกฤษล้วน
6. เวลา 3 ชั่วโมง: ทำข้อที่มั่นใจก่อน ข้อคำนวณ IP ใช้ขั้นตอน 6 ขั้นใน Part 2

---

> 📌 **ที่มาของเนื้อหา:** สรุปจากหน้าสัปดาห์ `week08`–`week15`, สไลด์ฉบับแปลไทย (`-2569-thai.pdf`) และสรุปของเพื่อนร่วมรุ่น — ส่วนที่ขัดกับสไลด์ยึดสไลด์ · วันสอบ ห้อง และที่นั่ง ตรวจที่ [/exam-schedule](/exam-schedule)
> ✍️ จัดทำเพื่อทบทวนก่อนสอบปลายภาค 1/2569 — **ขอให้โชคดีในการสอบครับ/ค่ะ! 🎓**
