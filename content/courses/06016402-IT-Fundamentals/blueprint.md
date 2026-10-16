# ITF — พิมพ์เขียวสำหรับสร้างสื่อ

> ไฟล์สำหรับคนสร้างเนื้อหา ไม่ถูก render ในเว็บ — ดู `docs/COURSE_OVERVIEW_STANDARD.md` §4
> ส่วนที่นักศึกษาอ่านอยู่ใน [`summary.md`](./summary.md)

## 1. คลังข้อสอบ

| มิติ | ข้อกำหนด |
|---|---|
| สัดส่วนตามบท (กลางภาค) | L01 15% · L02 15% · L03 20% · L04 15% · L05 15% · L06 10% · L07 10% |
| สัดส่วนตามบท (ปลายภาค) | L08 15% · L09 15% · L10 10% · L11 15% · L12 20% · L13 15% · L14–15 10% |
| ชนิดข้อ | `mcq` 70% · `true-false` 10% · `short-answer` 20% (ค่าของ `QuizKind` ใน `lib/quiz/quiz.ts` · คลังกลางภาคตอนนี้ 45 · 6 · 12 ข้อ) |
| ระดับ Bloom | จำ 40% · เข้าใจ 35% · ประยุกต์/วิเคราะห์ 25% |
| ตัวลวงที่ดี | ใช้คู่คำที่สับสนกันจริง — RAM/ROM, NAS/SAN, HDD/SSD, hub/switch, virus/worm, shareware/freeware, Internet/Web |
| ทุกข้อต้องมี | `sourceRef` (บังคับ — อ้างสไลด์/หน้าที่มา) + `chapter` + `why` รายตัวเลือก หรือ `explanationMd` |

**คลังที่มีแล้ว:** `lib/quiz/itf-quiz.ts` — 63 ข้อของ Lecture 01–07 (อัตนัย 12 ข้อเป็นแบบประเมินตัวเองเทียบคำตอบตัวอย่าง)
ย้ายมาจาก `data/quiz/itf-midterm.json` ของโปรเจกต์ iLearn ซึ่งไม่ได้อยู่ใน repo นี้ · ขอบเขตปลายภาค (L08–15) ยังไม่มีคลัง
เป้าหมายคือ ≥ 60 ข้อผ่านการตรวจเฉลยต่อช่วงสอบ

## 2. แบบฝึกหัด

| แล็บ (1/2569) | ทักษะ | โจทย์ที่สร้างได้ |
|---|---|---|
| Week 01 | Windows 11, CMD (`dir` `cd` `md` `rd` `ipconfig` `ping` `winget`) | ลำดับคำสั่งสร้าง/ย้ายโฟลเดอร์ตามโจทย์ |
| Week 02 | Linux CLI (`ls` `cd` `mkdir` `touch` `cat` `grep` `man`) | เลือกคำสั่งให้ตรงงาน · อ่านผล `ls -l` |
| Week 03 | Git (`clone` `add` `commit` `push` `pull` · branch · PR) | เรียงขั้นตอน workflow · สถานะ modified/staged/committed |
| Week 04 | Word — style, caption, สารบัญ, section | จัดเอกสารตาม spec |
| Week 05 | LaTeX — `\documentclass` `\section` `\tableofcontents` · XeLaTeX | เติมคำสั่งให้ได้ผลลัพธ์ที่กำหนด |
| Week 06–07 | Excel — `SUM` `AVERAGE` `COUNT` `IF` `VLOOKUP` · กราฟ | สูตรจาก `financial.xlsx` · รายงานค่าคอมมิชชัน |
| Week 08 | Access + SQL | ออกแบบตาราง · เขียน `SELECT … WHERE` จากโจทย์เรื่องเล่า |
| Week 09 | Make.com | เรียงโมดูลใน scenario ให้ถูก |
| Week 11–12 | Cisco Packet Tracer บน SecSpace — VLAN (Layer 2) · IP ของพอร์ต router, `no shutdown`, `ip route`, `ping` (Layer 3) | หา next hop และ static route ของ router แต่ละตัวจาก topology · แบ่งวง /30 ให้ลิงก์ router–router |
| Week 13 | HTML + CSS — tag, attribute, selector `p` / `.class` / `#id`, Flexbox · AI CLI agent | เติมแท็ก/attribute ให้ตรง spec Profile Card · เลือก selector ให้ถูก · หาจุดผิดในโค้ด (แท็กไม่ปิด, class สะกดไม่ตรง) |
| ต่อยอด | Network | คำนวณ network ID/broadcast จาก IP + subnet mask |

## 3. ข้อสอบจำลอง

- **กลางภาค** — 3 ชั่วโมง · ปรนัย 40 ข้อ (60%) + อัตนัย/สถานการณ์ 5 ข้อ (40%)
- **ปลายภาค** — 3 ชั่วโมง · เน้น Week 08–15 · ต้องมีข้อคำนวณ IP addressing อย่างน้อย 1 ข้อ
- ข้อบูรณาการที่ควรมีเสมอ: ไล่เส้นทาง `Input → Process → Output → Storage` ของสถานการณ์จริง 1 ข้อ
- รูปแบบนี้เป็นสเปกของข้อสอบจำลอง ไม่ใช่รูปแบบข้อสอบจริงที่ผู้สอนประกาศ

## 4. แหล่งที่มาในคลัง

| ประเภท | จำนวน | ที่อยู่ |
|---|---|---|
| สไลด์บรรยาย 1/2569 (Week 00–11) + สไลด์แนะนำครึ่งหลัง | 13 ไฟล์ | `public/assets/it-kmitl/itf/lectures/*` (`isCurrentYear`) |
| ใบงาน/สไลด์แล็บ 1/2569 (Week 01–09, 12–13) | 20 ไฟล์ | `public/assets/it-kmitl/itf/labs/`, `misc/` |
| ไฟล์ข้อมูลแล็บ | 3 ไฟล์ | `financial.xlsx` · `itf-ref-week07-lab-data.xlsx` · `itf-ref-week08-employee-db.accdb` |
| สไลด์ปีก่อน (Week 06–15) | 15+ ไฟล์ | `public/assets/it-kmitl/itf/lectures/` (`status: "legacy"`) |
| รูปสมุดจดในชั้นเรียน | 26 หน้า (WebP) | `public/assets/it-kmitl/itf/notes/` |
| คู่มือทบทวนกลางภาค | 1 ไฟล์ | `content/courses/06016402-IT-Fundamentals/midterm-study-guide.md` |
| ข้อสอบเก่า | 8 ไฟล์ (insider เท่านั้น) | `public/assets/it-kmitl/itf/exams/` |
| ชีทสรุปนักศึกษา | 6 ไฟล์ | `public/assets/it-kmitl/itf/sheets/` |
| ต้นฉบับจากผู้สอน | — | OnLearn course 1766 — ลิงก์ต่อไฟล์อยู่ใน `sourceUrl` ของ `ITF_ASSETS` |

รายการไฟล์ทั้งหมดพร้อมชื่อ/คำอธิบาย: `ITF_ASSETS` ใน `lib/library/subject-library.ts`
ตารางรายสัปดาห์ของคลังเรียนรู้: `ITF_SCHEDULE` ใน `lib/library/course-weeks.ts`

## 5. ช่องว่างข้อมูล

- สไลด์ Lecture 12–15 ของ 1/2569, สไลด์จดโน้ต Lecture 11–12, ใบงาน Lab 10 (File Management) / Lab 11 (Network 1)
  และสไลด์ Lab 13 (Web App 1) — อยู่ใน OnLearn ยังไม่ได้ดาวน์โหลด
- คลิปบันทึก Week 13–14 และคลิปชี้แจง Lab 12–13 — ยังไม่รู้ id ของหน้า OnLearn จึงยังไม่ได้ใส่ `video` ใน `ITF_SCHEDULE`
- Topic 15 (IT Skills and System) — OnLearn ระบุเรียน 27 ต.ค. 69 ชนกับวันสอบปลายภาคใน Lecture 00 ยังไม่ยืนยันว่าตารางสอบเปลี่ยนหรือไม่
- ใบงานแล็บที่มีชื่อ/รหัสของ TA หรือนักศึกษาอื่นในตัวอย่าง เผยแพร่ได้ (เจ้าของคลังตัดสิน 15 ต.ค. 2569) — ไม่ต้องพักไว้ใน `_hold/`
- รูปแบบข้อสอบจริง (จำนวนข้อ/สัดส่วนปรนัย-อัตนัย) ของปีนี้
