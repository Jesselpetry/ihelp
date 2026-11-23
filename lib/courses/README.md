# มาตรฐานข้อมูลรายวิชาและชื่อย่อ (Course Identity & Abbreviations Standard)

เอกสารนี้กำหนดมาตรฐานการจัดเก็บข้อมูลรายวิชา รหัสวิชาทางการ และ**ชื่อย่อรายวิชา (Course Abbreviations)** ของระบบ iHelp เพื่อให้ทุกหน้า ทุกโมดูล และทุก Component แสดงผลตรงกัน 100%

---

## 1. จุดศูนย์กลางของข้อมูล (Single Source of Truth)

ข้อมูลอัตลักษณ์รายวิชาทั้งหมดถูกจัดเก็บและดูแลที่:
* **TypeScript Source of Truth:** [`lib/courses/catalog.ts`](./catalog.ts)
* **Master JSON Snapshot:** [`data/courses/courses-master.json`](../../data/courses/courses-master.json)
* **Visual Theme & Gradients:** [`lib/courses/course-theme.ts`](./course-theme.ts)
* **Markdown Content:** [`content/courses/<officialCode>-<slug>/`](../../content/courses/)

ทุกการอ้างอิงรายวิชาในหน้าเว็บ (เช่น Header, Sidebar, Timetable, Badge, Calculator) ต้องดึงข้อมูลผ่านฟังก์ชันมาตรฐานใน `lib/courses/catalog.ts` เท่านั้น **ห้ามเขียนชื่อย่อแบบอิสระ (Ad-hoc) เช่น `BizFund`, `ProbStat`, หรือ `Business Fundamentals`**

---

## 2. ตารางมาตรฐานชื่อย่อและรหัสวิชา (Year 1 Curriculum)

### ชั้นปีที่ 1 ภาคเรียนที่ 1 (Y1-S1)

| ชื่อย่อมาตรฐาน | รหัสวิชาทางการ | ชื่อภาษาไทย | ชื่อภาษาอังกฤษ | หน่วยกิต | หมวดหมู่ | โฟลเดอร์เนื้อหา |
| :---: | :---: | :--- | :--- | :---: | :---: | :--- |
| **ITF** | `06016402` | พื้นฐานทางด้านเทคโนโลยีสารสนเทศ | IT Fundamentals | 3 (2-2-5) | วิชาบังคับ | `06016402-IT-Fundamentals` |
| **ICS** | `06016411` | ระบบคอมพิวเตอร์เบื้องต้น | Intro to Computer Systems | 3 (2-2-5) | วิชาบังคับ | `06016411-Intro-to-Computer-Systems` |
| **MFIT** | `06016401` | คณิตศาสตร์สำหรับเทคโนโลยีสารสนเทศ | Mathematics for Information Technology | 3 (3-0-6) | วิชาบังคับ | `06016401-Math-for-IT` |
| **PSCP** | `06066303` | การแก้ปัญหาและการโปรแกรมคอมพิวเตอร์ | Problem Solving and Computer Programming | 3 (2-2-5) | วิชาบังคับ | `06066303-Problem-Solving-and-Computer-Programming` |
| **CHARM** | `90641001` | โรงเรียนสร้างเสน่ห์ | Charm School | 2 (1-2-3) | GenEd | `90641001-Charm-School` |
| **FE** | `90644007` | ภาษาอังกฤษพื้นฐาน 1 | Foundation English | 3 (3-0-6) | GenEd | `90644007-Foundation-English` |
| **SPORT** | `90641003` | กีฬาและนันทนาการ | Sports and Recreational Activities | 1 (0-2-1) | GenEd | `90641003-Sports-and-Recreational-Activities` |

### ชั้นปีที่ 1 ภาคเรียนที่ 2 (Y1-S2)

| ชื่อย่อมาตรฐาน | รหัสวิชาทางการ | ชื่อภาษาไทย | ชื่อภาษาอังกฤษ | หน่วยกิต | หมวดหมู่ | โฟลเดอร์เนื้อหา |
| :---: | :---: | :--- | :--- | :---: | :---: | :--- |
| **BFIT** | `06066101` | พื้นฐานทางธุรกิจสำหรับเทคโนโลยีสารสนเทศ | Business for IT | 3 (3-0-6) | วิชาบังคับ | `06066101-Business-for-IT` |
| **DSA** | `06066301` | โครงสร้างข้อมูลและอัลกอริทึม | Data Structures and Algorithms | 3 (2-2-5) | วิชาบังคับ | `06066301-Data-Structures-and-Algorithms` |
| **OOP** | `06016408` | การสร้างโปรแกรมเชิงวัตถุ | Object-Oriented Programming | 3 (2-2-5) | วิชาบังคับ | `06016408-Object-Oriented-Programming` |
| **PSTAT** | `06066001` | ความน่าจะเป็นและสถิติ | Probability and Statistics | 3 (3-0-6) | วิชาบังคับ | `06066001-Probability-and-Statistics` |
| **FE2** | `90644008` | ภาษาอังกฤษพื้นฐาน 2 | Foundation English II | 3 (3-0-6) | GenEd | `90644008-Foundation-English-II` |
| **DC** | `90641007` | พลเมืองดิจิทัล | Digital Citizen | 3 (3-0-6) | GenEd | `90641002-Digital-Literacy` *(Alias DL)* |

### วิชาข้ามคณะ (EN-KMITL)

| ชื่อย่อมาตรฐาน | รหัสวิชาทางการ | ชื่อภาษาไทย | ชื่อภาษาอังกฤษ | หน่วยกิต | หมวดหมู่ | โฟลเดอร์เนื้อหา |
| :---: | :---: | :--- | :--- | :---: | :---: | :--- |
| **COMPRO** | `01006012` | การเขียนโปรแกรมคอมพิวเตอร์ | Computer Programming | 3 (2-2-5) | ข้ามคณะ | `01006012-Computer-Programming` |
| **CHEM** | *(ไม่มี)* | เคมีทั่วไป | General Chemistry | 3 (3-0-6) | ข้ามคณะ | `General-Chemistry` |

---

## 3. ฟังก์ชันและวิธีเรียกใช้งานในโค้ด (Developer API)

### 3.1 การแปลงรหัสวิชาเป็นชื่อย่อมาตรฐาน (`getCourseAbbr`)
เมื่อมีรหัสวิชา 8 หลัก เช่น `06066101` หรือรหัสเดิม ต้องการให้แสดงเป็น `BFIT`:
```tsx
import { getCourseAbbr } from "@/lib/courses/catalog";

getCourseAbbr("06066101"); // -> "BFIT"
getCourseAbbr("06066001"); // -> "PSTAT"
getCourseAbbr("06016408"); // -> "OOP"
getCourseAbbr("BFIT");     // -> "BFIT"
```

### 3.2 การแปลงชื่อย่อเป็นรหัสวิชาทางการ (`getCourseOfficialCode`)
```tsx
import { getCourseOfficialCode } from "@/lib/courses/catalog";

getCourseOfficialCode("BFIT"); // -> "06066101"
getCourseOfficialCode("PSTAT"); // -> "06066001"
```

### 3.3 การค้นหาข้อมูลวิชาฉบับเต็ม (`resolveCourse`)
สามารถค้นหาด้วยชื่อย่อ, รหัสทางการ, slug, หรือชื่อโฟลเดอร์ได้โดยอัตโนมัติ:
```tsx
import { resolveCourse } from "@/lib/courses/catalog";

const course = resolveCourse("06066101"); // หรือ resolveCourse("BFIT")
// { code: "BFIT", officialCode: "06066101", nameTh: "...", nameEn: "...", slug: "..." }
```

### 3.4 การแสดง Badge ชื่อย่อใน UI (`CourseCodeBadge`)
Component `<CourseCodeBadge />` รองรับทั้งการส่งรหัสทางการ 8 หลัก หรือชื่อย่อ โดยจะแปลงเป็นชื่อย่อสี Gradient น้ำเงิน iHelp มาตรฐานให้อัตโนมัติ:
```tsx
import { CourseCodeBadge } from "@/components/grades/course-code-badge";

<CourseCodeBadge code="06066101" /> // แสดงป้าย "BFIT"
<CourseCodeBadge code="BFIT" />     // แสดงป้าย "BFIT"
```
