# สัปดาห์ที่ 4 · Input & Output

> ศ.ดร. กิติ์สุชาต พสุภา · สไลด์ Lecture 04 (33 หน้า) · แล็บ Microsoft Word
>
> บทนี้เป็นรายการยาว — ข้อสอบชอบถามว่าอุปกรณ์นี้อยู่ในวิธีไหน และชื่อเต็มของตัวย่อ

## อ่านจบแล้วต้องตอบได้

- ท่อง **8 input methods** และ **6 output methods** ได้ครบ
- แยก OCR · OMR · MICR · bar code · QR code · RFID · magstripe
- บอก 5 ปัจจัยคุณภาพของ display และสัญญาณของ VGA · DVI · HDMI · DisplayPort
- แยก **nonimpact กับ impact printer** และยกตัวอย่างแต่ละชนิด
- อธิบายว่าทำไม game controller ที่มี force feedback นับเป็น output

---

## เอกสารประจำสัปดาห์

| เอกสาร | หน้า | ไฟล์ในคลัง |
|---|:---:|---|
| สไลด์บรรยาย — Lecture 04 Input & Output | 33 | `itf-lec-week04.pdf` |
| สไลด์แล็บ — Microsoft Word | 24 | `itf-lab-week04-word-slide.pdf` |

---

## สรุปอ่านสอบ

### 1. Input — 8 วิธี

⭐⭐ ต้องท่องให้ครบทั้ง 8

- **Input** = ข้อมูลและคำสั่งที่ป้อนเข้า **memory** ผ่าน input device

| วิธี | จุดจำ |
|---|---|
| Keyboard | มาตรฐาน **ANSI 104 ปุ่ม** · QWERTY มีไว้ลดการติดขัดของเครื่องพิมพ์ดีด · ergonomic keyboard ลด RSI |
| Pointing device | mouse · touchpad · **trackball (อยู่กับที่)** · pointing stick (หน้าตาเหมือนยางลบดินสอ) |
| Touch screen | จอไวต่อการสัมผัส ใช้ gesture |
| Pen input | stylus / digital pen · graphics tablet (digitizer) · handwriting recognition |
| Motion input | gesture recognition · gyroscope, accelerometer, magnetometer · Kinect, Wii |
| Voice input | พูดใส่ไมโครโฟน · voice / speech recognition |
| Video input | webcam · videoconference · webinar |
| Reading device | scanner และเครื่องอ่านแบบต่าง ๆ ด้านล่าง |

| เครื่องอ่าน | ชื่อเต็ม | ใช้อ่าน |
|---|---|---|
| **OCR** | Optical Character Recognition | ตัวอักษรพิมพ์/เขียนจากภาพสแกน |
| **OMR** | Optical Mark Recognition | เครื่องหมายที่คนฝน เช่น กระดาษคำตอบ |
| **MICR** | Magnetic Ink Character Recognition | หมึกแม่เหล็กบน**เช็คธนาคาร** |
| Bar code | — | เส้นขนานความกว้างต่างกัน |
| **QR code** | Quick Response | เก็บข้อมูลทั้งแนวตั้งและแนวนอน จึงจุมากกว่า bar code |
| **RFID** | Radio Frequency Identification | tag ผ่านคลื่นวิทยุ |
| Magstripe | — | แถบแม่เหล็กหลังบัตร · บัตรจะไม่มีแถบภายในปี 2033 |

### 2. Output — 6 วิธี

⭐⭐ Display · Printer · Audio · Projector · Interactive whiteboard · Game controller

- **Output device** แปลงสารสนเทศให้คนอ่านได้ · **monitor** = display ที่แยกเป็นอุปกรณ์ต่อพ่วง
- คุณภาพ display 5 ปัจจัย: **resolution · response time · brightness · dot pitch · contrast ratio**

| พอร์ตจอ | ชื่อเต็ม | สัญญาณ |
|---|---|---|
| VGA | Video Graphics Array | analog อย่างเดียว |
| DVI | Digital Video Interface | analog และ digital |
| HDMI | High-Definition Media Interface | digital พร้อมเสียง |
| DisplayPort | — | ทางเลือกแทน HDMI |

- DTV · **HDTV** (digital TV ที่ก้าวหน้าที่สุด) · **smart TV** = HDTV ที่ต่ออินเทอร์เน็ตได้

| | Nonimpact printer | Impact printer |
|---|---|---|
| หลักการ | **ไม่สัมผัสกระดาษ** | ตอกผ่านผ้าหมึกกระทบกระดาษ |
| ตัวอย่าง | ink-jet · photo · laser · all-in-one · thermal · dye sublimation · mobile · label · plotter · large-format · 3D | **dot matrix** |

- Ink-jet วัดความเร็วเป็น **ppm** · all-in-one = multifunction · thermal ใช้เข็มร้อนกดกระดาษไวความร้อน · 3D printer = additive manufacturing ทีละชั้น
- ลำโพง **7.1** = satellite 7 ตัว + subwoofer 1 ตัว · earbuds อยู่ในรูหู · headphones ครอบหู
- **Game controller** นับเป็น output เมื่อมี **force feedback** ส่งแรงต้านกลับไปที่มือผู้ใช้
- Assistive technology: head-mounted pointer · braille printer

---

## จุดที่มักพลาด

- **OMR** อ่านเครื่องหมายที่ฝน · **OCR** อ่านตัวอักษร · **MICR** อ่านหมึกแม่เหล็ก — สามตัวนี้สลับกันเป็นตัวลวงเสมอ
- VGA = analog อย่างเดียว · DVI = ทั้งคู่ · HDMI = digital + audio
- Printer มีแบบ impact แค่ dot matrix — ที่เหลือเป็น nonimpact ทั้งหมด
- Trackball **อยู่กับที่** ต่างจาก mouse

---

## ทดสอบตัวเอง

1. ธนาคารใช้เทคโนโลยีใดอ่านตัวเลขบนเช็ค
2. พอร์ตจอใดส่งได้ทั้ง analog และ digital
3. เครื่องพิมพ์ใดเป็น impact printer
4. อุปกรณ์ output ใดส่งแรงต้านกลับไปยังผู้ใช้
5. คีย์บอร์ดมาตรฐาน ANSI มีกี่ปุ่ม

**เฉลย** — 1. MICR · 2. DVI · 3. dot matrix · 4. game controller ที่มี force feedback · 5. 104 ปุ่ม

---

## แล็บ — Microsoft Word

> ใบงาน Lab 04 ยังไม่อยู่ในคลัง รายการตรวจด้านล่างมาจากสไลด์แล็บ — ยึดใบงานใน OnLearn เป็นหลัก

**สิ่งที่สไลด์สอน** — ส่วนประกอบหน้าต่าง (title bar · quick access toolbar · ribbon · view bar · status bar) ·
แก้ไข style · insert caption · cross-reference · table of contents · แบ่ง section ให้แต่ละช่วงมีเลขหน้าคนละแบบ

**รายการตรวจ**
1. เอกสารอย่างน้อย 3 หน้า
2. ใช้และแก้ไข style **Heading 1** และ **Heading 2**
3. ตารางอย่างน้อย 1 ตาราง และบางแถวมีจำนวนคอลัมน์ไม่เท่ากัน
4. รูปภาพอย่างน้อย 2 รูป
5. **Caption** ของภาพหรือตารางรวมอย่างน้อย 2 จุด
6. **Cross-reference** ที่กดได้รวมอย่างน้อย 2 จุด
7. หน้าสารบัญจาก **Table of Contents**
8. ลิงก์ไปยัง URL อย่างน้อย 1 จุด
9. ใช้ทั้ง **page break** และ **section break**
10. เลขหน้าทุกหน้าที่ไม่ใช่สารบัญ
