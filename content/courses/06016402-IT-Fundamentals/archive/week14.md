# สัปดาห์ที่ 14 · Web Technology

> บรรยายออนไลน์ผ่าน Zoom อ. 6 ต.ค. 2569 (Sec 1, 3 เวลา 13:45–15:45 · Sec 2 เวลา 16:00–18:00) · แล็บ 14 ศ. 16 ต.ค. 2569 (มีคลิปย้อนหลังในหัวข้อแล็บ)
>
> สไลด์ Lecture 14 *Introduction to Web Technology* ฉบับ 1/2569 และคลิปบันทึกการสอนอยู่ใน OnLearn แต่ยังไม่อยู่ในคลัง —
> สรุปด้านล่างมาจากสไลด์ปีก่อน *Focus on Web Technology* ของ รศ.ดร. ปานวิทย์ ธุวะนุติ (74 หน้า) ถ้าเนื้อหาต่างกันให้ยึดฉบับใน OnLearn

## อ่านจบแล้วต้องตอบได้

- แยกเครื่องมือสร้างเว็บ: text editor · code editor · CMS
- บอกหน้าที่ของ **HTML · CSS · JavaScript**
- เขียนโครงหน้าเว็บพื้นฐานและใช้แท็ก heading · paragraph · image · link · list
- แยกการใส่ CSS 3 แบบ และ selector แต่ละชนิด
- อธิบายการทำงานของ web client-server และ browser (DOM · CSSOM · JS runtime)

---

## เอกสารประจำสัปดาห์

| เอกสาร | หน้า | ไฟล์ในคลัง |
|---|:---:|---|
| สไลด์ปีก่อน — Focus on Web Technology | 74 | `itf-lec-week15-web.pdf` |
| สไลด์ Focus on Web Development (Discovering Computers ©2017) | 95 | `itf-lec-focuson-web.pdf` |
| ชีททบทวน Web Technology | 54 | `itf-sheet-reviews-web-app.pdf` |

> **มีใน OnLearn แต่ยังไม่อยู่ในคลัง** — สไลด์ Lecture 14 ฉบับ 6 ต.ค. 69 · คลิปบันทึกการสอน

---

## สรุปอ่านสอบ (จากสไลด์ปีก่อน)

### 1. เครื่องมือและเทคโนโลยีของเว็บ

- **Text editor** คล้าย word processor แต่ไม่มีการจัดรูปแบบ · **code editor** เพิ่มฟีเจอร์ช่วยเขียนโค้ด
- **CMS** = ระบบจัดการเผยแพร่และแก้ไขเนื้อหา · นักพัฒนาทำ theme แล้วผู้ดูแลใส่เนื้อหาเอง เช่น WordPress
- **HTML** ใช้ **tag** บอกโครงสร้างหน้า · **CSS** กำหนดฟอนต์ สี เลย์เอาต์ · **JavaScript** เป็นภาษาโปรแกรมที่ browser รันได้
- **Responsive** = ปรับขนาดเนื้อหาตามจอของอุปกรณ์
- **W3C** ดูแลมาตรฐาน HTML และมี validator ตรวจ HTML5

### 2. โครงหน้าเว็บ

```html
<!DOCTYPE html>
<html>
<head>
  <title>My Website Title</title>
</head>
<body>
  <h1>Hello World</h1>
  <p>ย่อหน้าแรก</p>
  <img src="img/dog.jpg" alt="dog" width="384">
  <a href="https://www.kmitl.ac.th">KMITL</a>
</body>
</html>
```

- heading มี 6 ระดับ `<h1>`–`<h6>` · `<p>` แบ่งย่อหน้า — browser ไม่สนการขึ้นบรรทัดในไฟล์
- `<img src>` อ้างไฟล์ภาพแยกต่างหาก · ไฟล์อยู่โฟลเดอร์เดียวกันใช้ `cat.jpg` · อยู่ในโฟลเดอร์ย่อยใช้ `img/dog.jpg`
- **Link (hyperlink)** เป็นได้ทั้งข้อความและภาพ · รายการใช้ `<ul>` (ไม่มีลำดับ) และ `<ol>` (มีลำดับ)

### 3. CSS

| วิธีใส่ | ที่อยู่ |
|---|---|
| **Inline** | attribute `style` ในแท็ก |
| **Internal** | แท็ก `<style>` ในส่วน `<head>` — มีผลทั้งหน้า |
| **External** | ไฟล์ `.css` แยก |

- Rule = **selector** + declaration block `{ property: value; }`

| Selector | ตัวอย่าง |
|---|---|
| Element | `p { … }` |
| **Id** | `#para1 { … }` — ใช้ได้กับ element เดียวในหน้า |
| **Class** | `.center { … }` — ใช้ได้หลาย element |
| Universal | `* { … }` |
| Group | `h1, h2, p { … }` |

- `<div>` แบ่งส่วนของหน้าเพื่อจัดรูปแบบ อ้างด้วย id หรือ class

### 4. Web Client–Server และ Browser

- Browser ขอไฟล์ → **web server** หาไฟล์ อ่าน แล้วตอบกลับ · web server software เช่น Apache · Nginx · Caddy · Microsoft IIS
- ใน browser: **HTML parser** สร้าง **DOM** · **CSS parser** สร้าง **CSSOM** · **JS runtime** รัน JavaScript ที่แก้ HTML และ CSS ได้
- **Node.js** = JavaScript runtime สร้างบน Chrome V8 ทำให้ JavaScript รันนอก browser ได้ (backend)
- ท้ายสไลด์: single page application และแนวคิด **API** (เปรียบกับปลั๊กไฟที่ให้ใช้ไฟจากโรงไฟฟ้า)

---

## จุดที่มักพลาด

- **Id ใช้ `#` · class ใช้ `.`** — id ใช้ได้ element เดียว class ใช้ได้หลายตัว
- Internal CSS อยู่ใน `<head>` ไม่ใช่ `<body>`
- HTML เป็น markup language ไม่ใช่ภาษาโปรแกรม · JavaScript เป็นภาษาโปรแกรม

---

## ทดสอบตัวเอง

1. แท็กใดกำหนดข้อความบนแท็บของ browser
2. CSS แบบใดเขียนไว้ในไฟล์ `.css` แยก
3. selector `.center` เป็นชนิดใด
4. องค์กรใดดูแลมาตรฐาน HTML
5. ส่วนใดของ browser สร้าง DOM

**เฉลย** — 1. `<title>` · 2. external · 3. class selector · 4. W3C · 5. HTML parser

---

## แล็บ — Lab 14 (ศ. 16 ต.ค. 2569)

> ใบงาน Lab 14 ยังไม่อยู่ในคลัง และยังไม่รู้หัวข้อแน่ชัด — ที่มาคือคลิปย้อนหลังที่ TA โพสต์ให้ชั้นเรียน ใบงาน Lab 13 บอกว่า
> คาบถัดไปจะใช้ JavaScript ทำให้ปุ่มของ Profile Card + To-do List ทำงาน จึงน่าจะต่อจาก Lab 13 *ยังไม่ยืนยัน*

```youtube
uGbbBMKC10Q | คลิปย้อนหลัง Lab 14 (ศ. 16 ต.ค. 69)
```

- ก่อนดูคลิป เปิดไฟล์ `week13/index.html` ของตัวเองไว้ — ใบงาน Lab 13 ให้ตั้ง id `todo-input` · `add-btn` · `todo-list`
  ไว้ให้ JavaScript ใช้หาช่องพิมพ์ ปุ่ม และรายการ
- แล็บเว็บครั้งแรก (Web App 1 · HTML และ CSS · ศ. 9 ต.ค.) สรุปอยู่ในหัวข้อแล็บของ
  [Week 13](/courses/06016402-IT-Fundamentals/map?doc=week13)
