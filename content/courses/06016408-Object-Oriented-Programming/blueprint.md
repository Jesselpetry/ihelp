# OOP — พิมพ์เขียวสำหรับสร้างสื่อ

> ไฟล์สำหรับคนสร้างเนื้อหา ไม่ถูก render ในเว็บ — ดู `docs/COURSE_OVERVIEW_STANDARD.md` §4
> ส่วนที่นักศึกษาอ่านอยู่ใน [`summary.md`](./summary.md)

## 1. คลังข้อสอบ

| มิติ | ข้อกำหนด |
|---|---|
| กลางภาค | ไวยากรณ์ Java (บท 1–3) 25% · คลาส/อ็อบเจ็ค 20% · encapsulation/inheritance 20% · polymorphism 20% · constructor/abstract/interface 15% |
| ปลายภาค | GUI 15% · Event 15% · Array/Collection/Generic 20% · Exception 20% · File I/O 15% · Thread 15% |
| ชนิดข้อ | Trace output 30% · หาข้อผิดพลาดคอมไพล์/รันไทม์ 25% · เขียนคลาสตาม UML 25% · ปรนัยมโนทัศน์ 20% |

**ตัวลวง** — ใช้รายการใน `summary.md` §5.3 (จุดที่มักพลาด)

## 2. แบบฝึกหัด

| Lab | โจทย์ | สิ่งที่วัด |
|---|---|---|
| 01–03 | ไวยากรณ์พื้นฐาน, เงื่อนไข, ลูป | เขียนโปรแกรม console ได้ |
| 04–05 | สร้างคลาส `BankAccount` / `Student` พร้อม getter-setter | encapsulation |
| 06–07 | ลำดับชั้น `Shape` → `Circle`/`Rectangle` + abstract + interface | inheritance + polymorphism |
| 08–09 | เครื่องคิดเลข GUI ด้วย Swing + event | GUI + event handling |
| 10 | ระบบจัดการรายชื่อด้วย `ArrayList` / `HashMap` | Collection + Generic |
| 11–12 | อ่าน/เขียนไฟล์ CSV พร้อมจัดการ exception | I/O + exception |
| 13 | โปรแกรมนับเลขหลายเธรดพร้อม `synchronized` | thread |

**การตรวจอัตโนมัติ** — คอมไพล์ด้วย `javac` แล้วรัน JUnit เทียบผลลัพธ์ของเมธอดสาธารณะ;
โจทย์ console ตรวจด้วยการเทียบ stdout

## 3. ข้อสอบจำลอง

- **กลางภาค** — Trace output 6 ข้อ · หาบั๊ก 4 ข้อ · เขียนคลาสจาก UML 2 ข้อ · อธิบายมโนทัศน์ 2 ข้อ
- **ปลายภาค** — เพิ่มโจทย์ GUI (เขียนโค้ดสร้างหน้าจอตามภาพ) · Collection · exception · thread
- คลังมีข้อสอบจริง `OOP_Midterm_2023.pdf`, `OOP_Final_2023.pdf` และ `OOP_Midterm_MockExam.pdf`

## 4. แหล่งที่มาในคลัง

| ประเภท | จำนวน | หมายเหตุ |
|---|---|---|
| สไลด์บรรยาย | 32 ไฟล์ | มีทั้งชุด `Chapter00–13` และ `Week01–14` (เนื้อหาเดียวกัน คนละรอบปี) |
| ตำราประกอบ | `OOP_Lec_Java-Book.pdf` | |
| Lab | 21 ไฟล์ (Week01–12) | มีทั้งโจทย์และฉบับทำแล้ว |
| ข้อสอบเก่า | 7 ไฟล์ | midterm/final ปี 2023 + mock exam |
| ชีทสรุป | 5 ไฟล์ | `CheatSheet-2022`, `CheatSheet-2024`, `Summary-OOP-Midterm/Final` |

- ต้นทาง: `kmitl-archive/archive/Y1-S2/Object-Oriented-Programming`

## 5. ช่องว่างข้อมูล

- สัดส่วนคะแนนและข้อมูลภาคเรียน 2/2569
