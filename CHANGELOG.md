# Changelog

ทุกการเปลี่ยนแปลงที่มีผลต่อผู้ใช้ของโปรเจกต์นี้จะถูกบันทึกไว้ในไฟล์นี้

รูปแบบอ้างอิงจาก [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)
และเลขเวอร์ชันอ้างอิงจาก [Semantic Versioning](https://semver.org/lang/th/)
(`MAJOR.MINOR.PATCH` — MAJOR = การเปลี่ยนสถาปัตยกรรมใหญ่ / Milestones หลัก, MINOR = ฟีเจอร์ใหม่, PATCH = แก้บั๊ก/ปรับเล็กน้อยตามรอบการพัฒนา)

วันที่ของทุกเวอร์ชันเขียนด้วยรูปแบบไทยและปีพุทธศักราช (เช่น `8 พฤศจิกายน 2569`)
เพื่อให้อ่านง่ายสำหรับผู้ใช้งานที่เป็นนักศึกษาไทย หัวข้อย่อยใช้ **เพิ่ม** / **ปรับปรุง** / **แก้ไข** /
**ความปลอดภัย** แทน Added / Changed / Fixed / Security และมีชื่อผู้พัฒนา `(โดย @username)` กำกับท้ายทุกรายการ

---

## [1.0.0] - 8 พฤศจิกายน 2569

**ผู้ร่วมพัฒนา:** Chatan Petry ([@Jesselpetry](https://github.com/Jesselpetry), IG: [@chatann_](https://instagram.com/chatann_))

### เพิ่ม

- **ปรับโครงสร้างหน้าหลักรายวิชาสู่ระบบเส้นทางการเรียนรู้รายสัปดาห์ (Weekly Learning Path)** — แยกเนื้อหาครึ่งแรก/ครึ่งหลัง คั่นด้วยจุดพักสอบกลางภาคและปลายภาค (Isolated Exam Milestones) พร้อมช่องค้นหาแคปซูลแบบ Real-time และตัวกรองช่วงสอบ (โดย @Jesselpetry)
- **จัดทำเอกสารและหน้ารายสัปดาห์สำหรับวิชา ICS ครึ่งแรก (Track A: Digital Logic สัปดาห์ที่ 1–7)** — เพิ่มเอกสาร 7 บท (`archive/logic-week01.md` ถึง `logic-week07.md`) ครอบคลุมดิจิทัลลอจิก, พีชคณิตบูลีน, SOP/POS, K-map, Time Response, เลขฐาน และ MUX/DEMUX พร้อมตารางเชื่อมโยงสไลด์และแล็บ Logisim (โดย @Jesselpetry)
- **ระบบ Contributor Credit และโปรไฟล์ผู้ร่วมแบ่งปันเนื้อหาท้ายหน้ารายวิชา (`lib/contributors/`)** — รวมศูนย์ข้อมูลผู้ร่วมพัฒนาและผู้แบ่งปันเนื้อหา พร้อมระบบคำนวณและเลื่อนชั้นปีอัตโนมัติตามรหัสนักศึกษา (Auto Academic Year Engine) (โดย @Jesselpetry)
- **ระบบตรวจสอบความถูกต้องของรุ่นนักศึกษาไอที (KMITL IT Cohort Formula & Auditing Rule: IT<yy-45>)** — ตรวจสอบความถูกต้องของเลขรุ่นกับรหัสนักศึกษา (รหัส 69 = IT24, 68 = IT23, 67 = IT22) เชื่อมต่อกระบวนการตรวจสอบอัตโนมัติใน `content:check` (โดย @Jesselpetry)

### ปรับปรุง

- **ปรับปรุงโครงสร้าง Contributor Profile Modal ให้ Responsive 100% และไม่โดนแบนเนอร์บดบัง** — ปรับ Avatar ทรงกลมมน (`rounded-full`), จัดลำดับข้อมูล คณะ > สาขา > ชั้นปี > รหัสนักศึกษา > รุ่น IT พร้อมระบบ Accordion พับ-ขยายสำหรับผลงานรายวิชาและประวัติ Commit (โดย @Jesselpetry)
- **ปรับปรุงการ์ดเครดิตผู้จัดทำและร่วมแบ่งปันเนื้อหาท้ายหน้ารายวิชาสู่ดีไซน์แนวนอนแบบกว้าง (Wide Horizontal Cards)** — แสดงผลงานรายวิชาแนวนอน พร้อมไอคอน Dev/Terminal สำหรับ Lead Maintainer และปุ่มโซเชียลแบดจ์เต็ม (โดย @Jesselpetry)
- **ปรับปรุงระบบเลย์เอาต์หน้ารายวิชา (`/courses/[dir]`) คืนสู่ระบบการเลื่อนหน้าแบบธรรมชาติ (Natural Page Scroll)** — เลื่อนหน้าพร้อมกันอย่างลื่นไหลและเชื่อมโยง Sidebar Jump Links อัตโนมัติ (โดย @Jesselpetry)
- **ปรับปรุงแถบค้นหารายวิชาและการ์ดรายวิชากะทัดรัด แนวนอน สไตล์ MIT OpenCourseWare (`/`)** — เพิ่ม Mini Calendar Y1·S1, กรอบไล่เฉดสีฟ้า iHelp Blue Gradient และคู่มือมาตรฐานแบรนด์ [`docs/BRANDING.md`](./docs/BRANDING.md) (โดย @Jesselpetry)
- **ปรับเปลี่ยนลายน้ำตราสัญลักษณ์บนการ์ดรายวิชา Charm School และ FE เป็นตรา GE สีขาว และวิชา EN-KMITL เป็นตราสถาบัน** — แสดงตราสำนักวิชาศึกษาทั่วไปและตราพระจอมเกล้าลาดกระบังตามสังกัดวิชา (โดย @Jesselpetry)

### แก้ไข

- **แก้ไขปัญหาลิงก์สัปดาห์ที่ 7 (MUX/DEMUX) ของวิชา ICS จับคู่ผิดสโคปไปยังครึ่งหลัง (ALU/CPU)** — แยกสโคป `scope: "midterm"` และ `scope: "final"` ออกจากกันอย่างเด็ดขาด และแก้ไขลิงก์สัปดาห์ที่ 0 404 (โดย @Jesselpetry)

---

## [0.9.0] - 7 พฤศจิกายน 2569

**ผู้ร่วมพัฒนา:** Chatan Petry ([@Jesselpetry](https://github.com/Jesselpetry), IG: [@chatann_](https://instagram.com/chatann_))

### เพิ่ม

- **Public API คลังสื่อการเรียนรู้ `/api/library/catalog`** — REST API endpoint สาธารณะความเร็วสูงสำหรับ AI Agents และบุคคลภายนอก ค้นหาและกรอง Dictionary สื่อ 570 รายการ ปลอดภัยด้วย Zero-Trust ตัดเอกสารลับ 100% (โดย @Jesselpetry)
- **จัดทำเอกสารสถาปัตยกรรมคลังสื่อฉบับสมบูรณ์และคู่มือการจัดการเวอร์ชัน** — เผยแพร่ [`docs/LIBRARY_ARCHITECTURE_AND_WORKFLOW.md`](./docs/LIBRARY_ARCHITECTURE_AND_WORKFLOW.md) และ [`docs/VERSION_CONTROL_GUIDE.md`](./docs/VERSION_CONTROL_GUIDE.md) (โดย @Jesselpetry)

### ปรับปรุง

- **ยกเครื่องระบบคำนวณคะแนนและตัดเกรด `/grade-calculator` สู่สถาปัตยกรรม 3 แผง** — แบ่งสัดส่วน CourseNav / ScoreInputs / ResultsPanel พร้อมแผนที่เป้าหมายคะแนน Final, แผนภูมิ GPS Simulator และคำนวณสูตรสด (โดย @Jesselpetry)
- **ปรับโฉมหน้าประวัติเวอร์ชันและผู้ร่วมพัฒนา `/version` สไตล์ GitHub Releases** — แบ่งเลย์เอาต์ 2 แผง พร้อมป้ายระบุเวอร์ชันปัจจุบัน และการ์ดข้อมูลผู้ร่วมพัฒนาแบบคลีนไม่มีเส้นขอบ (โดย @Jesselpetry)
- **ยกเครื่อง Contributor Profile Modal ให้ Responsive** — ปรับปุ่มโซเชียลเป็นทรงมน (`rounded-full`) เงา `shadow-sm`/`shadow-md` และแจกแจงประวัติการพัฒนาละเอียด (โดย @Jesselpetry)

### แก้ไข

- **นำจุดเขียว AvatarBadge (online status indicator) ออกจาก Avatar ผู้ร่วมพัฒนาทั้งหมด** — เพื่อไม่ให้บดบังรูปโปรไฟล์ (โดย @Jesselpetry)

---

## [0.8.5] - 3 พฤศจิกายน 2569

**ผู้ร่วมพัฒนา:** Chatan Petry ([@Jesselpetry](https://github.com/Jesselpetry), IG: [@chatann_](https://instagram.com/chatann_))

### เพิ่ม

- **ระบบคำนวณคะแนนและตัดเกรดรุ่นแรก (`/grade-calculator`)** — คำนวณคะแนนตามสัดส่วนวิชา ปี 1 เทอม 1 IT KMITL, คิดเลขสดในช่อง (`10+5+8.5`), ตัดเกรด A-F และ S/U, และรองรับการวางข้อมูลจาก Excel/TSV (โดย @Jesselpetry)
- **ITF ชุดเตรียมสอบปลายภาค Week 08–15** — คู่มือทบทวนและวิธีคำนวณ IP Subnet ละเอียด พร้อมแนวข้อสอบ 60 ข้อพร้อมเฉลย (โดย @Jesselpetry)
- **ITF โน้ตสรุปจาก Notion ของ Tammadon Suksa (IT24)** — 79 ภาพสไลด์พร้อมจดโน้ตทับ ในหน้าสรุปรายสัปดาห์ Week 08-15 (โดย @Jesselpetry)
- **ลิงก์สไลด์เสริม Infraclover ITCAMP20 สำหรับสัปดาห์เน็ตเวิร์ก** — สไลด์อ่านเสริมเรื่องเครือข่ายแปะไว้ต้นหน้าสัปดาห์ (โดย @Jesselpetry)

### ปรับปรุง

- **ยกเครื่องพาเลทสีโหมดมืดสู่ Neutral Charcoal สไตล์ Figma (`#141416`, `#1c1c1f`, `#222226`)** — มิติความลึกคมชัด สบายตา ลดการเมื่อยล้าสายตาด้วยข้อความ Off-white (`#f4f4f6`) (โดย @Jesselpetry)

---

## [0.8.4] - 30 ตุลาคม 2569

**ผู้ร่วมพัฒนา:** PhuPunnavit ([@PhuPunnavit](https://github.com/PhuPunnavit), IG: [@priiu_i](https://instagram.com/priiu_i)), Chatan Petry ([@Jesselpetry](https://github.com/Jesselpetry), IG: [@chatann_](https://instagram.com/chatann_))

### เพิ่ม

- **ฟีเจอร์ Chat Help-Desk มุมขวาล่าง** — ผู้ช่วยตอบคำถามการใช้งานทันใจด้วย FAQ กว่า 75 ข้อ ค้นหาไฟล์ในคลังรายวิชาแบบเรียลไทม์ และระบบ AI สตรีมมิ่ง พร้อม Guard Rails เข้มงวด (โดย @PhuPunnavit)
- **ITF สไลด์บรรยายฉบับสรุปแปลไทย Week 08–15** — เลกเชอร์ครึ่งหลังแปลไทยย่อจบใน 1 หน้าต่อสัปดาห์ ออกแบบใน Figma บรรจุในคลังเอกสารและหน้าสัปดาห์เรียน พร้อมคำค้นหา 'แปลไทย' (โดย @PhuPunnavit)

### ปรับปรุง

- **เชื่อมโยงสไลด์แปลไทยเข้ากับระบบค้นหาของ Help-Desk Chat และหน้าสารบัญสัปดาห์เรียน** — รองรับคำค้นหาฉบับแปลไทยและเปิดดูตัวอย่างได้ทันใจ (โดย @PhuPunnavit)

---

## [0.8.3] - 22 ตุลาคม 2569

**ผู้ร่วมพัฒนา:** Chatan Petry ([@Jesselpetry](https://github.com/Jesselpetry), IG: [@chatann_](https://instagram.com/chatann_))

### เพิ่ม

- **ตารางสอบและผังที่นั่งสอบรายบุคคล (`/exam-schedule`)** — ค้นหากำหนดการสอบ ห้องสอบ และเลขที่นั่งสอบด้วยรหัสนักศึกษา 8 หลัก พร้อมผังที่นั่ง Interactive Seating Map ในห้องเรียน และส่งออกปฏิทิน .ics (โดย @Jesselpetry)
- **ตัวนับถอยหลังพร้อมเสียงเตือนขอยกเลิกสอบ (Resign countdown sound & loud-mode config)** — ตัวช่วยแจ้งเตือนและระบบยืนยันความพร้อม (โดย @Jesselpetry)
- **พื้นที่อ่านหนังสือสอบปลายภาค (`/profile/<รหัส>/study`)** — หน้าโฟกัสพร้อมตัวจับเวลา Standby โควตา 112 ชั่วโมง และบันทึกเวลาในเครื่อง (โดย @Jesselpetry)
- **ระบบภาพแชร์ OpenGraph Card (`/og/*.png`) และคำอธิบาย Meta อัตโนมัติ** — รองรับทุกหน้ารายวิชา โมดูล คลังเอกสาร และตารางสอบ (โดย @Jesselpetry)

---

## [0.8.2] - 17 ตุลาคม 2569

**ผู้ร่วมพัฒนา:** Chatan Petry ([@Jesselpetry](https://github.com/Jesselpetry), IG: [@chatann_](https://instagram.com/chatann_))

### เพิ่ม

- **ดัชนีคลังรวมศูนย์ `resource-index.json` และชุดคำสั่ง CLI** — สคริปต์ `library:audit` สำหรับตรวจสอบความสอดคล้องของคลัง และ `library:find` สำหรับค้นหาทรัพยากร (โดย @Jesselpetry)
- **ซิงก์เนื้อหา OnLearn ITF Week 11-15** — เพิ่มใบงานแล็บ 04, 05, 12, 13 และฝังวิดีโอบันทึกการสอน Lab 13-14 บนหน้าสัปดาห์ (โดย @Jesselpetry)

### ปรับปรุง

- **ปรับเลย์เอาต์แบนเนอร์รายวิชาสไตล์ Google Classroom** — พร้อมลายน้ำรหัสวิชาโปร่งแสงและลดความสูงให้กะทัดรัด (โดย @Jesselpetry)
- **แยกโครงสร้างเนื้อหาและข้อสอบครึ่งแรก/ครึ่งหลังของวิชา ICS ออกจากกันชัดเจน** — แยกระหว่าง Track A (Digital Logic) และ Track B (Computer Hardware) (โดย @Jesselpetry)

---

## [0.8.1] - 27 กันยายน 2569

**ผู้ร่วมพัฒนา:** Chatan Petry ([@Jesselpetry](https://github.com/Jesselpetry), IG: [@chatann_](https://instagram.com/chatann_))

### เพิ่ม

- **มุมมองคลังทรัพยากรรายสัปดาห์แบบเดียวกันทั้ง ITF และ ICS** — จัดกลุ่มตามสัปดาห์และช่วงสอบ พร้อมลิงก์ต้นทาง OnLearn (โดย @Jesselpetry)
- **หน้าคาบเรียนรายสัปดาห์วิชา ITF (`/courses/06016402-IT-Fundamentals/map`) ครบ 15 สัปดาห์** — พร้อมสรุปอ่านสอบและแบบทดสอบตนเอง (โดย @Jesselpetry)
- **มาตรฐานภาพรวมรายวิชา `summary.md`** — โครงสร้างเดียวกัน 6 หัวข้อสำหรับทุกรายวิชา ตรวจสอบผ่าน `content:check` (โดย @Jesselpetry)

### แก้ไข

- **ปรับปรุงการจัดหน้าตารางกว้างในตัวอ่าน Markdown ไม่ให้ล้นการ์ดบนสมาร์ตโฟน** — จัดการ Responsive Table บนอุปกรณ์จอเล็ก (โดย @Jesselpetry)

---

## [0.8.0] - 22 กันยายน 2569

**ผู้ร่วมพัฒนา:** Chatan Petry ([@Jesselpetry](https://github.com/Jesselpetry), IG: [@chatann_](https://instagram.com/chatann_))

### เพิ่ม

- **สื่อแต่ละชิ้นมีข้อมูลกำกับรุ่นและสัปดาห์ (`edition`, `week`, `isCurrentYear`)** — จับคู่สไลด์กับแล็บและซ่อนไฟล์เก่าอัตโนมัติ (โดย @Jesselpetry)
- **ทำเนียบอาจารย์ผู้สอนคณะ IT KMITL** — จัดมาตรฐานชื่ออาจารย์ผู้สอนทุกรายวิชา (โดย @Jesselpetry)
- **ฟอนต์ TH Sarabun New สำหรับตัวอ่านเอกสาร Markdown** — พร้อมชุดแต่งสมุดบันทึกเส้นแดง (Red Ink Notebook variant) (โดย @Jesselpetry)

### ปรับปรุง

- **ปรับโครงสร้างหน้ารายวิชาสู่ 4 หมวดตามจุดประสงค์การเรียนรู้** — ปูพื้นฐาน, ย่อสอบ, ตะลุยโจทย์, จำลองสอบ (โดย @Jesselpetry)
- **เปิดให้บริการคลังทรัพยากร `/library` อย่างเป็นทางการเต็มรูปแบบ** — นำหน้าคลุม Coming Soon ออก (โดย @Jesselpetry)

---

## [0.7.0] - 22 กันยายน 2569

**ผู้ร่วมพัฒนา:** Chatan Petry ([@Jesselpetry](https://github.com/Jesselpetry), IG: [@chatann_](https://instagram.com/chatann_))

### เพิ่ม

- **ติดตั้งเป็น Progressive Web App (PWA)** — พร้อม Service Worker (`sw.js`) แคชเฉพาะไฟล์จำเป็น และหน้าออฟไลน์ภาษาไทย (โดย @Jesselpetry)
- **หน้ารวมเอกสารก่อนเข้าอ่าน (Module Index)** — ตรวจนับจำนวนไฟล์จริงจาก Markdown และจำสถานะการเปิดอ่านในเครื่อง (โดย @Jesselpetry)
- **หน้าคาบเรียนรายสัปดาห์ ICS พร้อมเครื่องเล่นวิดีโอ YouTube ฝังในตัว 35 คลิป** — พร้อมทะเบียนถาวร `RESOURCES_MANIFEST.md` (โดย @Jesselpetry)
- **ระบบเปิดดูตัวอย่างไฟล์ PDF/รูปภาพ (Preview) ได้ทันทีจากในหน้าเว็บ** — ผ่านระบบสิทธิ์ของคลังโดยตรง (โดย @Jesselpetry)

### ความปลอดภัย

- **ลบประวัติและข้อมูลรหัสนักศึกษาอื่น (PII) ออกจาก Storage และป้องกันข้อมูลสื่อรั่วไหลเข้า Bundle** — รักษาความเป็นส่วนตัวและลดขนาดไฟล์ JS (โดย @Jesselpetry)

---

## [0.6.2] - 15 กันยายน 2569

**ผู้ร่วมพัฒนา:** Chatan Petry ([@Jesselpetry](https://github.com/Jesselpetry), IG: [@chatann_](https://instagram.com/chatann_))

### ปรับปรุง

- **ย้ายโดเมนหลักอย่างเป็นทางการสู่ `ihelp.chatan.in.th`** — พร้อม redirect เส้นทางเดิมอย่างไร้รอยต่อ (โดย @Jesselpetry)
- **รีแบรนด์ Site Metadata จาก PSCP สู่ศูนย์กลางการเรียนรู้คณะ IT KMITL (iHelp) ครบวงจร** — ตั้งค่า OpenGraph และ SEO ให้ครอบคลุมทุกวิชา (โดย @Jesselpetry)

---

## [0.6.1] - 10 กันยายน 2569

**ผู้ร่วมพัฒนา:** Chatan Petry ([@Jesselpetry](https://github.com/Jesselpetry), IG: [@chatann_](https://instagram.com/chatann_))

### เพิ่ม

- **โจทย์สัปดาห์ 8–9 เข้าสู่ระบบการเรียนรู้ครบวงจร** — พร้อมเฉลยอ้างอิงและ Concept Tags จากโค้ดจริง 27 ข้อ (โดย @Jesselpetry)
- **โจทย์แนะนำเพิ่มเป็น 14 ข้อ (BigFrame, Left Arrow, กองชาม, Shorten)** — พร้อมคู่มือ 2 ภาษา (โดย @Jesselpetry)
- **สคริปต์ตรวจความถูกต้องของเฉลยอ้างอิงทั้งคลัง `scripts/verify_solutions.py`** — ทดสอบครอบคลุมทุกข้อสอบ (โดย @Jesselpetry)

### ปรับปรุง

- **หน้ารายการโจทย์ PSCP แสดงผลแบบตาราง (Table View) เป็นค่าเริ่มต้น** — พร้อมมาตรวัดความยากดาว 5 ดวง (โดย @Jesselpetry)

---

## [0.6.0] - 30 สิงหาคม 2569

**ผู้ร่วมพัฒนา:** Chatan Petry ([@Jesselpetry](https://github.com/Jesselpetry), IG: [@chatann_](https://instagram.com/chatann_))

### เพิ่ม

- **ระบบบัญชีผู้ใช้และยืนยันตัวตนด้วย Google `@kmitl.ac.th`** — ตรวจรหัสคณะ IT 8 หลักเฉพาะนักศึกษาคณะ IT (โดย @Jesselpetry)
- **หน้าโปรไฟล์นักศึกษาสาธารณะ `/profile/[รหัส]`** — แสดงชื่อเล่น สาขา และผลงานที่แบ่งปัน พร้อมตัวนับผู้เข้าชมที่เคารพความเป็นส่วนตัวที่ Footer (โดย @Jesselpetry)
- **ย้ายสื่อการเรียนรู้ทั้งหมดออกจาก Git ไปเก็บยัง Supabase Storage** — แยก Bucket สาธารณะและ Bucket ข้อสอบลับ (โดย @Jesselpetry)

### ความปลอดภัย

- **กั้นสิทธิ์คลังทรัพยากรเฉพาะนักศึกษาคณะ IT ที่ล็อกอิน และกั้นข้อสอบเก่าเฉพาะ Insider** — ป้องกันข้อสอบหลุดสู่สาธารณะ (โดย @Jesselpetry)

---

## [0.5.2] - 26 สิงหาคม 2569

**ผู้ร่วมพัฒนา:** Chatan Petry ([@Jesselpetry](https://github.com/Jesselpetry), IG: [@chatann_](https://instagram.com/chatann_))

### เพิ่ม

- **รวมเส้นทางรายวิชาทั้งหมดเป็นต้นไม้เดียว `/courses/[dir]` และฮับห้องแลป `/pscp`** — รองรับทุกวิชาอย่างเป็นระบบ (โดย @Jesselpetry)
- **พิมพ์เขียวการเรียนรู้ 11 โมดูลมาตรฐาน (`lib/spine.ts`)** — สัญญาเดียวเชื่อมโยงทุกรายวิชาในระบบ (โดย @Jesselpetry)
- **นำเข้าชุดสื่อการเรียนปี 1 จากคลัง `kmitl-archive` (662 ไฟล์)** — และสร้างเวิร์กโฟลว์จัดการไฟล์ `_dropzone/` (โดย @Jesselpetry)

### ปรับปรุง

- **บีบอัดเอกสาร PDF ทั้งหมดผ่าน Visual Regression Gate ลดขนาดลง 32%** — ประหยัดแบนด์วิดท์โดยไม่เสียความคมชัด (โดย @Jesselpetry)
- **ปรับชื่อไฟล์สื่อการสอนทั้งหมดเป็นรูปแบบมาตรฐาน kebab-case** — สะอาดและปลอดภัยต่อ URL (โดย @Jesselpetry)

### แก้ไข

- **แก้ไขปัญหาสูตรคณิตศาสตร์ `$$...$$` หลายบรรทัดกลืนเนื้อหาในตัวอ่าน Markdown** — แก้ไขจุดปิด KaTeX ใน `MdView` (โดย @Jesselpetry)

---

## [0.5.1] - 22 สิงหาคม 2569

**ผู้ร่วมพัฒนา:** Chatan Petry ([@Jesselpetry](https://github.com/Jesselpetry), IG: [@chatann_](https://instagram.com/chatann_))

### เพิ่ม

- **ขยายฮับสู่หลายรายวิชา** — CE-KMITL, EN-KMITL (ข้อสอบเคมี 60 ข้อ และคอมโปร), ICS Digital Logic และ MFIT Linear Algebra (โดย @Jesselpetry)
- **แผนอ่านติวเข้ม MFIT 6 ชั่วโมง** — พร้อมชุดฝึกจับเวลา และสรุปตามพิมพ์เขียวข้อสอบจริง (โดย @Jesselpetry)
- **สารบัญด้านข้างแบบโต้ตอบ (Interactive Real-Time TOC)** — พร้อม Scroll Spy และค้นหาหัวข้อในหน้าอ่านเอกสาร (โดย @Jesselpetry)

---

## [0.5.0] - 17 สิงหาคม 2569

**ผู้ร่วมพัฒนา:** Chatan Petry ([@Jesselpetry](https://github.com/Jesselpetry), IG: [@chatann_](https://instagram.com/chatann_)), Akarapach Yootsukprasert ([@PGTHEGOD](https://github.com/PGTHEGOD), IG: [@pgthegod_x](https://instagram.com/pgthegod_x))

### เพิ่ม

- **ฮับโจทย์แนะนำ 10 ข้อหลัก (`/recommended`)** — พร้อมบทวิเคราะห์จุดสำคัญและสถิติจริงจาก iJudge (โดย @Jesselpetry)
- **ระบบ Client-Side Python Grader** — ตรวจโค้ดในเบราว์เซอร์ 100% ด้วย WebAssembly (Pyodide in Web Worker) (โดย @Jesselpetry)
- **ระบบ Technique Quiz Active-Recall 60 ข้อ** — พร้อมคำอธิบายเฉลย 2 ภาษา (โดย @Jesselpetry)
- **หน้าจอ Splitter Panel Workspace ลากปรับขนาดได้** — พร้อม Foldable Expected I/O และ Diff View (โดย @Jesselpetry)
- **ระบบตรวจสอบสไตล์โค้ด PEP-8 & PSCP Rules และคีย์ลัดสั่งรันโค้ดทันที** — อำนวยความสะดวกในการฝึกทำโจทย์ (โดย @Jesselpetry)

### ปรับปรุง

- **ยกระดับ UI มือถือเต็มรูปแบบ** — แท็บปรับตามความกว้างจอ และตัวแปร CSS สำหรับ Split Layout (โดย @Jesselpetry)

### แก้ไข

- **แก้ไขการ Hydrate ข้อมูล Primitive String ใน `useDraft`** — ป้องกันข้อผิดพลาด `[object Object]` (โดย @Jesselpetry)

---

## [0.4.2] - 13 สิงหาคม 2569

**ผู้ร่วมพัฒนา:** Akarapach Yootsukprasert ([@PGTHEGOD](https://github.com/PGTHEGOD), IG: [@pgthegod_x](https://instagram.com/pgthegod_x)), Chatan Petry ([@Jesselpetry](https://github.com/Jesselpetry), IG: [@chatann_](https://instagram.com/chatann_))

### เพิ่ม

- **หน้า Landing Page `/pro` สำหรับ PG IJUDGE · VS Code Extension** — แนะนำส่วนขยายส่งโค้ดตรงเข้า iJudge, รันเทสต์ในเครื่อง, เทสต์เคสซ่อน, ทำงานออฟไลน์ และขอรับ License Key ผ่าน IG @pgthegod_x (โดย @PGTHEGOD)

### ปรับปรุง

- **ผูก Metadata SEO และโครงสร้างเส้นทางสำหรับส่วนขยายเครื่องมือช่วยเขียนโค้ด** — ตกแต่งธีมเอกลักษณ์ PSCP Pink และเอฟเฟกต์ Glow/Grid สวยงาม (โดย @PGTHEGOD)

---

## [0.4.1] - 31 กรกฎาคม 2569

**ผู้ร่วมพัฒนา:** Chatan Petry ([@Jesselpetry](https://github.com/Jesselpetry), IG: [@chatann_](https://instagram.com/chatann_))

### เพิ่ม

- **แบนเนอร์ประกาศเตรียมตัวสอบสัมภาษณ์โค้ด (Code Interview)** — แจ้งเตือนนักศึกษาล่วงหน้า (โดย @Jesselpetry)
- **เพิ่มชุดโจทย์ OJ Week 4 และ Week 5 (รหัส 3101–3116)** — พร้อมสคริปต์ตรวจสถานะซิงก์จาก iJudge (โดย @Jesselpetry)

### ปรับปรุง

- **แผงพรีวิวไฟล์เลื่อนไปยังไฟล์ที่รอ Push อัตโนมัติ (Auto-scroll target preview)** — ไม่ต้องเลื่อนหาเองในหน้าจอ (โดย @Jesselpetry)

---

## [0.4.0] - 21 กรกฎาคม 2569

**ผู้ร่วมพัฒนา:** Meaookung144 ([@Meaookung144](https://github.com/Meaookung144), IG: [@meaookung144](https://instagram.com/meaookung144)), Chatan Petry ([@Jesselpetry](https://github.com/Jesselpetry), IG: [@chatann_](https://instagram.com/chatann_))

### เพิ่ม

- **ระบบเชื่อมต่อ GitHub OAuth และ Push ไฟล์ `submission.md` / `ai_reflection.md` เข้า Repository โดยตรง** — ส่งงานได้ในคลิกเดียว (โดย @Meaookung144)
- **ตัวแก้ไขไฟล์ออนไลน์ (`/repo`)** — ตรวจทานและแก้ไขโค้ดใน Repo ก่อนกด Push (โดย @Meaookung144)
- **หน้าประวัติเวอร์ชันและผู้ร่วมพัฒนา (`/version`)** — พร้อม Changelog workflow ในการปล่อยเวอร์ชัน (โดย @Jesselpetry)

### ปรับปรุง

- **ปรับปรุง Navbar รองรับ Mobile Responsive** — พร้อมเมนู Hamburger และ Contributor Avatars (โดย @Jesselpetry)

### แก้ไข

- **ปรับปรุงการทำงานของ Folder Component ในหน้าจัดการ Repo** — จัดการโครงสร้างโฟลเดอร์ให้ถูกต้อง (โดย @Meaookung144)

---

## [0.3.0] - 20 กรกฎาคม 2569

**ผู้ร่วมพัฒนา:** Chatan Petry ([@Jesselpetry](https://github.com/Jesselpetry), IG: [@chatann_](https://instagram.com/chatann_))

### เพิ่ม

- **ระบบสลับธีม Light / Dark Mode** — พร้อมปุ่ม Toggle แอนิเมชันนุ่มนวล (โดย @Jesselpetry)

---

## [0.2.0] - 18 กรกฎาคม 2569

**ผู้ร่วมพัฒนา:** Chatan Petry ([@Jesselpetry](https://github.com/Jesselpetry), IG: [@chatann_](https://instagram.com/chatann_))

### เพิ่ม

- **ประกาศเปิดโจทย์ Week 3** — ต้อนรับเนื้อหาสัปดาห์ใหม่ของวิชา PSCP (โดย @Jesselpetry)

### ปรับปรุง

- **ปรับปรุงการจัดเรียงโจทย์และเพิ่มคีย์ลัดประจำสัปดาห์ `lib/shortcuts.ts`** — อำนวยความสะดวกในการค้นหา (โดย @Jesselpetry)
- **อัปเดตข้อมูลโจทย์ใน `data/oj_problems.json`** — สถิติและการจัดหมวดหมู่ล่าสุด (โดย @Jesselpetry)

---

## [0.1.1] - 13 กรกฎาคม 2569

**ผู้ร่วมพัฒนา:** Chatan Petry ([@Jesselpetry](https://github.com/Jesselpetry), IG: [@chatann_](https://instagram.com/chatann_))

### ปรับปรุง

- **บังคับยืนยันว่าอ่านเงื่อนไขและแนวปฏิบัติ AI ของวิชาก่อนดาวน์โหลดไฟล์** — ป้องกันการส่งงานโดยไม่อ่านกติกา (โดย @Jesselpetry)

### แก้ไข

- **แก้ไข Path การสร้างไฟล์ของโจทย์ Week 2** — ชี้ไปยังโฟลเดอร์ที่ถูกต้อง (โดย @Jesselpetry)

---

## [0.1.0] - 12 กรกฎาคม 2569

**ผู้ร่วมพัฒนา:** Chatan Petry ([@Jesselpetry](https://github.com/Jesselpetry), IG: [@chatann_](https://instagram.com/chatann_))

### เพิ่ม

- **ระบบสร้าง `submission.md` และ `ai_reflection.md` สำหรับวิชา PSCP ทีละขั้นตอน (Wizard)** — ผู้ช่วยกรอกคำตอบและฟอร์แมตเอกสารส่งการบ้าน (โดย @Jesselpetry)
- **รายการโจทย์พร้อมระดับความยาก วันหมดเขต และแท็บกรองรายสัปดาห์** — รวมศูนย์ข้อมูลโจทย์ PSCP (โดย @Jesselpetry)
- **หน้า `/library` อ่านเอกสารแนวปฏิบัติการใช้ AI ของวิชา PSCP** — อ่านแนวทางทางการของคณะ (โดย @Jesselpetry)
- **หน้า `/history` จัดเก็บประวัติไฟล์ที่เคยสร้างไว้ในเครื่อง** — กู้คืนงานที่เคยทำได้ตลอดเวลา (โดย @Jesselpetry)
- **ระบบบันทึกแบบร่างอัตโนมัติแยกตามโจทย์ และหน้า Splash Screen** — ไม่สูญเสียข้อมูลขณะกรอก (โดย @Jesselpetry)

### ปรับปรุง

- **ปรับปรุงสีทั่วทั้งเว็บไซต์ให้ผ่านมาตรฐานความคมชัด WCAG AA** — สีอ่านง่ายสบายตา (โดย @Jesselpetry)

### แก้ไข

- **ปรับแก้ไอคอน Instagram และ case ของข้อความบางจุด** — ความถูกต้องของ UI (โดย @Jesselpetry)
