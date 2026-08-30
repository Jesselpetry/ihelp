---
code: "06016402"
slug: IT-Fundamentals
shortCode: ITF
nameTh: พื้นฐานทางด้านเทคโนโลยีสารสนเทศ
nameEn: Information Technology Fundamentals
credits: "3 (2-2-5)"
year: 1
term: 1
termId: Y1-S1
prerequisites: []
language: th
sources:
  - kmitl-archive/archive/Y1-S1/IT-Fundamentals
  - kmitl-archive/archive/Y1-S1-2569/IT-Fundamentals
  - ITF_bank (สไลด์ 1/2026 + คู่มือทบทวนกลางภาค)
  - content/itf/ITF_Sheet_MidtermStudyGuide.md
---

# ITF — พื้นฐานทางด้านเทคโนโลยีสารสนเทศ

## 1. ภาพรวมรายวิชา

| หัวข้อ | รายละเอียด |
|---|---|
| รหัสวิชา | `06016402` |
| ชื่อไทย | พื้นฐานทางด้านเทคโนโลยีสารสนเทศ |
| ชื่ออังกฤษ | INFORMATION TECHNOLOGY FUNDAMENTALS |
| หน่วยกิต | 3 (2-2-5) — บรรยาย 2 · ปฏิบัติ 2 · ศึกษาด้วยตนเอง 5 |
| ชั้นปี/เทอม | ปี 1 เทอม 1 |
| วิชาบังคับก่อน | ไม่มี |
| หลักสูตร | IT |
| ผู้สอน (1/2026) | Prof. Dr. Kitsuchart Pasupa (KP) · Asst. Prof. Dr. Pornsuree Jamsri (PJ) · Asst. Prof. Dr. Suvit Poomrittigul |
| ตำรา | O'Leary, O'Leary & O'Leary (2026), *Computing Essentials 2026* |
| ระบบเรียน | OnLearn (`onlearn.it.kmitl.ac.th`) — บรรยายวันอังคาร · แล็บวันศุกร์ |

### คำอธิบายโดยสังเขป

วิชาปูพื้นภาพรวมของเทคโนโลยีสารสนเทศทั้งระบบ ตั้งแต่นิยาม **data vs information**,
แบบจำลอง **Input–Process–Output**, ส่วนประกอบฮาร์ดแวร์ (CPU, memory, storage, I/O),
ระบบปฏิบัติการ ซอฟต์แวร์ประยุกต์ ฐานข้อมูล จริยธรรม/กฎหมายไอที ไปจนถึงเครือข่าย
อินเทอร์เน็ต และการทำงานในองค์กร ภาคปฏิบัติเน้นทักษะเครื่องมือสำนักงาน
(Windows, Word, Excel, PowerPoint) ผ่าน Lab รายสัปดาห์

### สัดส่วนคะแนน (ประกาศใน Lecture 00, 1/2026)

| รายการ | สัดส่วน |
|---|---|
| สอบกลางภาค | 30% |
| สอบปลายภาค | 30% |
| Laboratory + Homework | 30% |
| Attendance | 10% |

---

## 2. ขอบเขตเนื้อหา

### 2.1 ขอบเขตสอบกลางภาค (Week 01–07)

| สัปดาห์ | หัวข้อ | ผู้สอน |
|---|---|---|
| 01 | Introducing Today Technology | KP |
| 02 | Computers | KP |
| 03 | Computing Components | KP |
| 04 | Input & Output | KP |
| 05 | Storage | KP |
| 06 | Operating System | PJ |
| 07 | Programs and Apps | PJ |

> ใน 1/2026 หัวข้อ Week 08–10 ยังไม่เปิดใน OnLearn ตอนสอบกลางภาค จึง **ไม่อยู่ในขอบเขตกลางภาค**

### 2.2 ขอบเขตสอบปลายภาค (Week 08 เป็นต้นไป)

| สัปดาห์ | หัวข้อ | สถานะในคลัง |
|---|---|---|
| 08 | Database | มีสไลด์ (คลังปีก่อน) |
| 09 | Ethical, Social, and Legal Aspects of IT | มีสไลด์ |
| 10 | Working in the Enterprise: Systems, Certifications, and Careers | มีสไลด์ |
| 11 | The Internet | มีสไลด์ (คลังปีก่อน) |
| 12 | Computer Networks | มีสไลด์ |
| 13 | Wireless / Wi-Fi | มีสไลด์ |
| 14 | Information Systems & System Development | มีสไลด์ |
| 15 | Focus on Web Technology | มีสไลด์ |

> Week 11–15 มาจากคลังปีการศึกษาก่อน — ใน 1/2026 หัวข้อ 11–15 ยังไม่ประกาศ
> ให้ยึด OnLearn ของเทอมปัจจุบันเป็นหลัก

---

## 3. สรุปเนื้อหารายหัวข้อ

> เนื้อหา Week 01–07 มีฉบับละเอียด (พร้อมตัวอย่างจากสไลด์จริง) อยู่ที่
> [`content/itf/ITF_Sheet_MidtermStudyGuide.md`](../../itf/ITF_Sheet_MidtermStudyGuide.md)
> ส่วนด้านล่างคือโครงกระดูกที่ใช้อ้างอิงเวลาสร้างข้อสอบ/แบบฝึกหัด

### Week 01 — Introducing Today Technology

- **Digital Literacy** = Access · Use · Understand · Create
- **Computer** = hardware ที่ทำงานภายใต้ software ที่เก็บไว้ในหน่วยความจำของตัวเอง
- **แบบจำลองหลักของวิชา:** `Input (Data) → Process/Store → Output (Information)`
- **Data vs Information** ⭐ — data คือข้อเท็จจริงดิบ (input); information คือผลที่ผ่านการประมวลผลแล้ว (output)
- ภาพรวมอุปกรณ์: keyboard, pointing device (trackball 1952 · mouse 1963 · Xerox Alto 1973), scanner, camera, printer, display, speaker
- **Web vs Internet** — Internet คือเครือข่ายทางกายภาพ; Web คือบริการที่วิ่งบน Internet
- **AI** — narrow / general / super AI, machine learning, generative AI
- **Digital Safety and Security** 4 หัวข้อ: privacy · security · ethics · environment
- Programs & Apps: system software (OS, utility) vs application software

### Week 02 — Computers

- **Class of Computer** ⭐⭐: microcomputer → minicomputer/mid-range → mainframe → supercomputer; และกลุ่ม server, embedded, game console, mobile device, wearable
- **Microcomputer** — desktop (tower / all-in-one), laptop, tablet, phablet, smartphone
- **Moore's Law** ⭐⭐ — จำนวนทรานซิสเตอร์บนชิปเพิ่มเป็นสองเท่าราวทุก 2 ปี
- **Server** — rack server / blade server / tower server; **client/terminal** — thin client, ATM, POS
- **Supercomputer** — วัดด้วย FLOPS ใช้กับงานจำลองสภาพอากาศ/โมเลกุล/สมองมนุษย์
- **Ports & Connection** ⭐ — USB (A/B/C), HDMI, DisplayPort, Thunderbolt, Ethernet; docking station
- การเก็บภาพในคอมพิวเตอร์: pixel · resolution · bit depth
- **Protecting Hardware** — theft, vandalism, hardware failure, surge protector, UPS

### Week 03 — Computing Components

- **Case & Motherboard** ⭐ — system unit, form factor, chipset, expansion slot
- **CPU** ⭐⭐ — control unit + ALU; multi-core; cores/threads
- **Machine Cycle** ⭐⭐⭐ — `Fetch → Decode → Execute → Store` (ออกสอบแทบทุกปี)
- **Instruction Pipelining** — ซ้อนขั้นตอนของหลายคำสั่งเพื่อเพิ่ม throughput
- **Register & System Clock** — clock speed (GHz), clock cycle
- **Data Representation** ⭐⭐ — bit/byte, binary ↔ decimal, ASCII, Unicode
- **Memory hierarchy** ⭐⭐ — register → cache (L1/L2/L3) → RAM (DRAM/SRAM) → virtual memory → storage; ROM/PROM/EPROM/EEPROM, flash memory, CMOS
- **Buses** ⭐⭐ — data bus, address bus, control bus; bus width; expansion bus
- Adapters (การ์ดจอ/เสียง/เครือข่าย), cooling device (heat sink, fan, liquid cooling), power supply

### Week 04 — Input & Output

- **Input** = ข้อมูล/คำสั่งที่ส่งเข้าเครื่อง; **8 วิธี input หลัก** ⭐⭐ — keyboard, pointing device, touch, pen, motion/gesture, voice, video, scanner/reader
- Scanner คือ *light-sensing input device* แปลงข้อความ/ภาพที่พิมพ์ให้อยู่ในรูปดิจิทัล
- Reader ต่าง ๆ: OCR, OMR, MICR, bar code, RFID, magstripe, biometric
- **Output** = ข้อมูลที่ประมวลผลแล้วซึ่งส่งให้ผู้ใช้; **6 วิธี output** ⭐⭐ — display, printer, speaker/headphone, interactive whiteboard, force-feedback/haptic, data projector
- Display: LCD/LED/OLED, resolution, response time, พอร์ตต่อจอ (VGA/DVI/HDMI/DisplayPort)
- Printer: inkjet, laser, thermal, 3D printer, plotter; วัดคุณภาพด้วย dpi และ ppm
- **Assistive technology** — screen reader, braille display, head-mounted pointer

### Week 05 — Storage

- **4 ระดับของ storage** ⭐⭐ — register → cache/memory → primary storage → secondary/tertiary
- **Storage medium vs storage device** ⭐ — medium คือวัสดุที่เก็บ; device คือตัวอ่าน/เขียน
- **ตารางความจุ** ⭐⭐⭐ — KB → MB → GB → TB → PB → EB → ZB → YB (คูณ 1,024 หรือประมาณ 1,000)
- **Access time** ⭐ — วัดเป็น ms (จานหมุน) หรือ ns (หน่วยความจำ); transfer rate วัดเป็น MBps/GBps
- **HDD** ⭐⭐ — platter, track, sector, cylinder, read/write head, RPM (5400/7200), latency
- **SSD** ⭐⭐ — flash memory + controller; ไม่มีชิ้นส่วนเคลื่อนไหว เร็วกว่า/ทนกว่า/แพงกว่า HDD
- **RAID** ⭐⭐ — RAID 0 (striping) · RAID 1 (mirroring) · RAID 5 (parity)
- Memory card (SD/microSD, class/speed rating), USB flash drive, cloud storage
- **Optical disc** ⭐⭐ — CD (700 MB) · DVD (4.7 GB single layer) · Blu-ray (25 GB/layer); -ROM / -R / -RW
- **Enterprise storage** ⭐⭐ — NAS (ต่อผ่าน LAN, file-level) vs SAN (เครือข่ายความเร็วสูงเฉพาะ, block-level)
- NFC, tape, magnetic stripe card, smart card

### Week 06 — Operating System

- **นิยาม** ⭐⭐⭐ — ชุดโปรแกรมที่ประสานงานทุกกิจกรรมของฮาร์ดแวร์และซอฟต์แวร์
- **12 หน้าที่ของ OS** (โครงหลักของบท):
  1. Starting computers ⭐⭐⭐ — 5 ขั้นตอนการ boot (power → POST → BIOS/UEFI → โหลด kernel → โหลด configuration/registry); *booting* vs *warm boot*
  2. Shutting down — shut down / sleep / hibernate
  3. Providing a user interface — CLI, GUI, **NUI** (touch, voice, gesture)
  4. Managing programs — single tasking vs multitasking, foreground/background
  5. Managing memory ⭐⭐⭐ — **virtual memory**, page/paging, swap file, thrashing
  6. Coordinating tasks — spooling, print queue
  7. Configuring devices — **driver**, Plug and Play
  8. Monitoring performance — performance monitor
  9. Establishing an Internet connection
  10. Providing file, disk, and system management tools
  11. Updating OS software — automatic update
  12. Controlling a network — server OS, user account, permission
- **Backward compatibility** ⭐⭐ (มักออกเป็นข้อลวง): เวอร์ชันใหม่รองรับซอฟต์แวร์เก่าได้
- **Desktop OS** — Windows (1985 → Windows 11), macOS (1984 → macOS Tahoe 26), UNIX (Bell Labs ต้นทศวรรษ 1970), Linux (1991), Chrome OS
- **Mobile OS** — Android, iOS/iPadOS, Windows Phone (เลิกพัฒนาแล้ว)
- **Server OS** — multiuser, จัดการผู้ใช้หลายคนพร้อมกัน

### Week 07 — Programs and Apps

- **Program/software vs application vs OS** ⭐⭐
- **การได้มาซึ่งซอฟต์แวร์ 8 ประเภท** ⭐⭐⭐ — retail, custom, web app, mobile app, shareware, freeware, open source, public domain
- **Productivity applications** ⭐⭐ — word processing, presentation, spreadsheet (cell/formula/function/chart), database (table/record/field), note taking, calendar & contact, software suite, project management, accounting, personal finance, legal, tax, document management, enterprise computing
- **Graphics & media** ⭐⭐ — CAD, desktop publishing (DTP), paint/image editing, photo editing & management, video/audio editing, multimedia & website authoring, media player
- **Communications applications** ⭐⭐ — email, browser, chat/IM, VoIP, FTP, video conferencing, blog, wiki ฯลฯ
- **Security tools** ⭐⭐⭐ — malware (virus, worm, trojan horse, rootkit, spyware, adware), antivirus, personal firewall, spyware remover, internet filter/anti-spam
- **File, disk, and system management tools** ⭐⭐ — file manager, search, image viewer, uninstaller, disk cleanup, disk defragmenter, screen saver, file compression, PC maintenance, backup & restore

### Week 08 — Database

- Databases, data, and information
- **Hierarchy of data** — character → field → record → file → database
- File maintenance (add / modify / delete) และ **data validation** (range, consistency, completeness, check digit)
- **File processing system vs database approach** — ข้อเสียของ file processing: data redundancy, isolated data
- ประเภทฐานข้อมูล: relational, object-oriented, multidimensional, NoSQL
- **DBMS** — data dictionary, query, form, report generator, backup & recovery
- **SQL** เบื้องต้น — `SELECT … FROM … WHERE`
- **Big Data** — ปริมาณ/ความเร็ว/ความหลากหลาย และตัวอย่างระบบแนะนำคอนเทนต์

### Week 09 — Ethical, Social, and Legal Aspects of IT

- **Software theft / software piracy** และ license (ตัวอย่าง: KMITL Office 365 license)
- **Information theft**, hardware theft, vandalism
- **Ethics and society**, information privacy, major aspects of information privacy
- Digital literacy · **digital disruption** · digital native vs digital immigrant
- Defamation, **cyberbullying** และรูปแบบการกลั่นแกล้งออนไลน์
- Social media literacy, cashless society
- **กฎหมายไทยที่เกี่ยวข้อง** ⭐⭐
  - พ.ร.บ. ว่าด้วยการกระทำความผิดเกี่ยวกับคอมพิวเตอร์
  - พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล (PDPA)
  - พ.ร.บ. การรักษาความมั่นคงปลอดภัยไซเบอร์
  - กฎหมายธุรกรรมทางอิเล็กทรอนิกส์ · ลิขสิทธิ์ (copyright) · สิทธิบัตร (patent)
  - หน่วยงาน: ETDA, กองบังคับการปราบปรามการกระทำความผิดเกี่ยวกับอาชญากรรมทางเทคโนโลยี

### Week 10 — Working in the Enterprise

- The technology industry · information systems in the enterprise
- **Technology careers** — สาย development, infrastructure, data, security, support
- **Technology certifications** ⭐ — CompTIA A+, CCNA, CISSP, CEH, CDP
- Job searching, career planning, professional online presence

### Week 11 — The Internet

- Internet แบบ "nuts and bolts" (host, link, router, protocol) vs แบบ "service view"
- **Protocol** คืออะไร · **encapsulation** และการแบ่ง layer
- Network edge / network core; **packet switching vs circuit switching**; routing vs forwarding
- **Access network** — DSL, cable/HFC, FTTH, Ethernet, wireless, data center network
- Physical media — twisted pair, coax, fiber, radio
- Internet structure: network of networks, **Tier-1 ISP**, IXP
- Network security เบื้องต้น — packet interception (sniffing), fake identity (spoofing), DoS

### Week 12 — Computer Networks

- **Physical topology** — mesh, star, bus, ring, hybrid
- **Logical topology / multiple access protocol** — CSMA, CSMA/CD, token passing
- **Ethernet** — Standard (10Base5/10Base2/10Base-T/10Base-F), Fast, Gigabit, 10-Gigabit
- Hub vs bridge (bridge table, learning bridge) vs switch; full-duplex switched Ethernet
- **Connecting LAN** — repeater, hub, bridge, switch, router/L3 switch, backbone (bus/star)
- **IPv4 addressing** ⭐⭐ — network ID / host ID, subnet mask, การหา network ID
- **Class A/B/C**, private IP address, **NAT**, address depletion
- **ชนิดการสื่อสาร** — unicast, broadcast, multicast; network address, broadcast address

### Week 13 — Wireless / Wi-Fi

- องค์ประกอบเครือข่ายไร้สาย — wireless host, base station/AP, wireless link, infrastructure mode
- **คุณสมบัติของลิงก์ไร้สาย** — path loss/fading, multipath, interference, **hidden terminal problem**
- **CDMA** — encode/decode, two-sender interference
- **IEEE 802.11 WLAN** — architecture (BSS), channels, association, passive/active scanning
- **CSMA/CA** ⭐⭐ และ **RTS/CTS** สำหรับแก้ hidden terminal
- 802.11 advanced capabilities (power management, rate adaptation); **802.15 PAN** (Bluetooth)

### Week 14 — Information Systems & System Development

- ความต้องการทักษะดิจิทัลในตลาดแรงงาน (salary guide, LinkedIn skill demand, developer roadmap)
- **Information system** — คน กระบวนการ ข้อมูล ซอฟต์แวร์ ฮาร์ดแวร์
- **System development life cycle** ⭐⭐ — Planning → Analysis → Design → Implementation → Support & Maintenance
- เทคนิคเก็บความต้องการ: observe, survey, interview, **JAD**
- **Functional vs non-functional requirement**
- Design phase: UI/UX; ตัวอย่าง bad UX

### Week 15 — Focus on Web Technology

- เครื่องมือสร้างเว็บ — text editor, WYSIWYG, **CMS** (WordPress ฯลฯ)
- Website technologies — HTML, CSS, JavaScript, server-side
- **โครงสร้างหน้าเว็บ** — `<!DOCTYPE>`, `<html>`, `<head>`, `<title>`, `<body>`
- การสร้างไฟล์ `index.html` และการใส่ title

---

## 4. สูตร ตัวเลข และตารางที่ต้องจำ

| เรื่อง | ค่าที่ต้องจำ |
|---|---|
| หน่วยข้อมูล | 1 byte = 8 bits · 1 KB ≈ 1,024 B · 1 MB ≈ 1,024 KB · 1 GB ≈ 1,024 MB · 1 TB ≈ 1,024 GB |
| Machine cycle | Fetch → Decode → Execute → Store |
| ความจุแผ่น | CD 700 MB · DVD 4.7 GB (SL) / 8.5 GB (DL) · Blu-ray 25 GB/layer |
| HDD RPM | 5,400 / 7,200 rpm (โน้ตบุ๊ก/เดสก์ท็อป) |
| ASCII | `A` = 65 = `0100 0001` = 41H |
| Moore's Law | ทรานซิสเตอร์เพิ่มเป็น 2 เท่า ทุก ~2 ปี |
| RAID | 0 = striping (เร็ว ไม่ทน) · 1 = mirroring · 5 = striping + parity |
| หน่วยเวลา | ms (10⁻³) · µs (10⁻⁶) · ns (10⁻⁹) |

---

## 5. พิมพ์เขียวสำหรับสร้างสื่อต่อยอด

### 5.1 คลังข้อสอบ (Quiz Bank)

| มิติ | ข้อกำหนด |
|---|---|
| สัดส่วนตามบท (กลางภาค) | L01 15% · L02 15% · L03 20% · L04 15% · L05 15% · L06 10% · L07 10% |
| สัดส่วนตามบท (ปลายภาค) | L08 15% · L09 15% · L10 10% · L11 15% · L12 20% · L13 15% · L14–15 10% |
| ชนิดข้อ | `multiple_choice` 70% · `true_false` 10% · `short_answer` 20% |
| ระดับ Bloom | จำ 40% · เข้าใจ 35% · ประยุกต์/วิเคราะห์ 25% |
| ตัวลวงที่ดี | ใช้คู่คำที่สับสนกันจริง — RAM/ROM, NAS/SAN, HDD/SSD, hub/switch, virus/worm, shareware/freeware, Internet/Web |
| ทุกข้อต้องมี | `explanation` + `sourceAssetId` อ้างสไลด์/หน้าที่มา |

**คลังที่มีแล้ว:** `data/quiz/itf-midterm.json` (ปรนัย 10 + อัตนัย 5 พร้อมเฉลย)
เป้าหมาย Phase 2 คือ ≥ 60 ข้อผ่านการตรวจเฉลย

### 5.2 แบบฝึกหัด/Lab

| Lab | ทักษะ | โจทย์ที่สร้างได้ |
|---|---|---|
| Week 01 | Windows พื้นฐาน, file management | จัดโครงโฟลเดอร์ตามโจทย์ · ตั้งชื่อไฟล์ตามข้อกำหนด |
| Week 02–05 | Word / PowerPoint | จัดรูปแบบเอกสารตาม spec · ทำสไลด์นำเสนอ 5 หน้า |
| Week 06–07 | Excel 1–2 | สูตร, `IF`, `VLOOKUP`, PivotTable, chart, งบการเงินอย่างง่าย |
| ต่อยอด | Database | ออกแบบตาราง + เขียน `SELECT … WHERE` จากโจทย์เรื่องเล่า |
| ต่อยอด | Network | คำนวณ network ID/broadcast จาก IP + subnet mask |

### 5.3 ข้อสอบจำลอง (Mock Exam)

- **กลางภาค** — 3 ชั่วโมง · ปรนัย 40 ข้อ (60%) + อัตนัย/สถานการณ์ 5 ข้อ (40%)
- **ปลายภาค** — 3 ชั่วโมง · เน้น Week 08–15 · ต้องมีข้อคำนวณ IP addressing อย่างน้อย 1 ข้อ
- ข้อบูรณาการที่ควรมีเสมอ: ไล่เส้นทาง `Input → Process → Output → Storage` ของสถานการณ์จริง 1 ข้อ

### 5.4 หัวข้อที่ออกสอบบ่อยที่สุด

1. Machine cycle 4 ขั้นตอน
2. Virtual memory / memory hierarchy
3. ตารางหน่วยความจุ + การแปลงหน่วย
4. HDD vs SSD และ RAID
5. 5 ขั้นตอนการ boot
6. ตาราง 8 ประเภทการได้มาซึ่งซอฟต์แวร์
7. Moore's Law
8. NAS vs SAN
9. คำศัพท์ที่สับสนกัน (ดูภาคผนวก B5 ของคู่มือทบทวน)
10. IPv4 class + subnet mask (ปลายภาค)

---

## 6. แหล่งข้อมูลในคลัง

| ประเภท | จำนวน | ที่อยู่ |
|---|---|---|
| สไลด์บรรยาย 1/2026 (Week 00–07) | 8 ไฟล์ / 340 หน้า | `public/bank/itf/lectures/` |
| รูปสมุดจดในชั้นเรียน | 26 หน้า (WebP) | `public/bank/itf/notes/` |
| คู่มือทบทวนกลางภาค | 1 ไฟล์ | `content/itf/ITF_Sheet_MidtermStudyGuide.md` |
| สไลด์คลังปีก่อน (Week 08–15) | 20+ ไฟล์ | `kmitl-archive/…/Y1-S1/IT-Fundamentals/Lectures/` |
| ข้อสอบเก่า | 10 ไฟล์ | `…/IT-Fundamentals/Exams/` |
| ชีทสรุปนักศึกษา | 6 ไฟล์ | `…/IT-Fundamentals/Sheets/` |
| Lab | Week 01, 06, 07, 12 | `…/IT-Fundamentals/Labs/`, `Y1-S1-2569/IT-Fundamentals/` |

> ⚠️ สไลด์บรรยายเป็นเอกสารของผู้สอน — ห้ามเผยแพร่สาธารณะจนกว่าจะได้รับอนุญาต
