# 📘 คู่มือทบทวนสอบกลางภาค
## 06016402 Information Technology Fundamentals (1/2026)

> **วันสอบ:** อังคารที่ 18 สิงหาคม 2026 เวลา 13:30–16:30 | **สัดส่วนคะแนน:** 30%
> **ผู้สอน:** Prof. Dr. Kitsuchart Pasupa (KP) · Asst. Prof. Dr. Pornsuree Jamsri (PJ) · Asst. Prof. Dr. Suvit Poomrittigul
> **หนังสืออ้างอิง:** O'Leary, O'Leary & O'Leary (2026) *Computing Essentials 2026*

### 🎯 ขอบเขตการสอบ (Week 01–07)

| สัปดาห์ | หัวข้อ | ผู้สอน |
|---|---|---|
| 01 | Introducing Today Technology | KP |
| 02 | Computers | KP |
| 03 | Computing Components | KP |
| 04 | Input & Output | KP |
| 05 | Storage | KP |
| 06 | Operating System | PJ |
| 07 | Programs and Apps | PJ |

> ⚠️ Week 08 (Database), Week 09 (Ethics/Legal), Week 10 (Enterprise) **ยังไม่เปิดใน OnLearn** → ไม่อยู่ในขอบเขตสอบกลางภาค

---

# ส่วนที่ 1: สรุปเนื้อหาแยกตามบท

---

## 📗 Lecture 01 — Introducing Today Technology

### 1.1 Digital Literacy (ความรู้เท่าทันดิจิทัล)
- เทคโนโลยีเปลี่ยนแปลงทุกวัน ต้องตามให้ทันเพื่อคง "digital literacy"
- **นิยาม:** การมีความรู้และความเข้าใจปัจจุบันเกี่ยวกับคอมพิวเตอร์ อุปกรณ์พกพา เว็บ และเทคโนโลยีที่เกี่ยวข้อง
- **แผนภาพวงกลม 4 องค์ประกอบ (จำให้ได้):**

```
              Access (เข้าถึง)
                    ↑
   Use (ใช้) ← Digital Literacy → Understand (เข้าใจ)
                    ↓
             Create (สร้างสรรค์)
```

### 1.2 Computer & แบบจำลอง Input–Process–Output
- **Computer** = ประกอบด้วยชิ้นส่วนไฟฟ้า/อิเล็กทรอนิกส์ (และอาจมีชิ้นส่วนกลไก) เรียกรวมว่า **Hardware**
- ทำงานภายใต้การควบคุมของ **ชุดคำสั่งที่เก็บไว้ในหน่วยความจำของตัวเอง** เรียกว่า **Software**

**แผนภาพหลักของวิชา (ออกสอบบ่อยมาก):**

```
   Input  ──────►  ┌───────────┐  ──────►  Output
   (Data)          │ Computer  │          (Information)
                   └───────────┘
```

### 1.3 Data vs Information ⭐

| | **Data (ข้อมูลดิบ)** | **Information (สารสนเทศ)** |
|---|---|---|
| นิยาม | ข้อเท็จจริงดิบ ยังไม่จัดระเบียบ ต้องผ่านการประมวลผลจึงมีความหมาย | ชุดข้อมูลที่ถูกประมวลผลและจัดโครงสร้างให้มีความหมายตามความต้องการ |
| ประกอบด้วย | facts, observations, perceptions, numbers, characters, symbols, images | รายงาน สรุป ใบเสร็จ ฯลฯ |
| ตำแหน่งในแผนภาพ | Input | Output |

**ตัวอย่างจากสไลด์ (ใบเสร็จ IT.KMITL SuperStore):**

| ขั้น | เนื้อหา |
|---|---|
| **Data (Input)** | Medium Sodas ฿60.0 × 2, Small Chicken Wings ฿100.0 × 2, Caesar Salad ฿150.0 × 1, Cookies ฿75 × 3, Amount Received ฿1,000 |
| **Process/Store** | คำนวณยอดรวมต่อรายการและยอดสุทธิ |
| **Information (Output)** | ใบเสร็จ: Total Due 695.00, Amount Received 1000.00, **Change 305.00** |

### 1.4 อุปกรณ์ Input / Output / Storage (ภาพรวม)

| กลุ่ม | อุปกรณ์ที่ปรากฏในสไลด์ |
|---|---|
| **Keyboard** | Desktop, Laptop, Onscreen, Type Cover, Mini, Virtual Keyboard |
| **Pointing Device** | Trackball (Tom Cranston, Fred Longstaff, Kenyon Taylor – **1952**), Mouseketeer (Douglas Engelbart – **1963**), Xerox Alto Mouse (**1973**) |
| **Voice Input** | Microphone, Built-in Microphone, Ear Phone |
| **Video Input** | Webcam, Built-in Webcam |
| **Image Capture** | **Scanner** (light-sensing input device แปลงข้อความ/ภาพที่พิมพ์ให้อยู่ในรูปที่คอมประมวลผลได้), Digital Camera |
| **Output** | Printer, 3D Printer, Display (Desktop/Laptop/Tablet/Smartphone/Camera), Speaker, Headphone, Earbud, Ear Phone |
| **Storage** | HDD, USB Flash Drive, Optical Disc, SSD, Memory Card, Cloud Storage |

- **Memory** = ชิ้นส่วนอิเล็กทรอนิกส์ที่เก็บ**คำสั่งที่รอถูกประมวลผล**และข้อมูลที่คำสั่งเหล่านั้นต้องใช้
- **Storage media** = เก็บข้อมูล คำสั่ง สารสนเทศ; ทำงานโดย **storage device** (เขียน/อ่าน)

### 1.5 The Web & Internet ⭐
- **Internet** = เครือข่ายคอมพิวเตอร์ทั่วโลก เชื่อมต่อธุรกิจ หน่วยงานรัฐ สถาบันการศึกษา และบุคคลนับล้าน
- **จุดกำเนิด:** สร้างเพื่อ**วัตถุประสงค์ทางการทหาร**ก่อน → ต่อมาขยายเพื่อ**การสื่อสารระหว่างนักวิทยาศาสตร์** ภายใต้การพัฒนา **ARPANET (Advanced Research Projects Agency Network)** ในช่วง **ปลายทศวรรษ 1960s**
- **4 โหนดแรกของ ARPANET (ท่องให้ได้):**
  1. University of California, Los Angeles (**UCLA**)
  2. Stanford Research Institute's Augmentation Research Center
  3. University of California, Santa Barbara (**UCSB**)
  4. University of Utah

### 1.6 Web Browser & Search Engine
- **Browser** = ซอฟต์แวร์ที่ให้ผู้ใช้ที่มีการเชื่อมต่ออินเทอร์เน็ตเข้าถึงและดูเว็บเพจ
- **ส่วนประกอบหน้าจอ browser (จากภาพสไลด์):** Back Button, Address Bar, Refresh Button, Link, Scroll bar
- **Search Engine** = ซอฟต์แวร์ที่ค้นหาเว็บไซต์ เว็บเพจ รูปภาพ วิดีโอ ข่าว แผนที่ และข้อมูลอื่น ๆ ที่เกี่ยวกับหัวข้อที่ระบุ
  - เก็บรวบรวมเว็บไซต์โดยใช้ **spiderbot** หรือ **crawler**
  - **Crawler** = Internet bot ที่ท่องเว็บ (World Wide Web) อย่างเป็นระบบเพื่อทำ **Web Indexing**

### 1.7 Artificial Intelligence ⭐⭐
- **นิยาม:** Thinking and acting *humanly* and *rationally*
- ใช้ computer science, engineering, cognitive sciences ร่วมกับการเขียนโปรแกรม
- ทำให้คอมพิวเตอร์มีความสามารถแบบมนุษย์ เช่น image recognition, speech recognition
- **5 สาขาหลักของ AI (ตามสไลด์):** Problem Solving · Knowledge, Reasoning, and Planning · Uncertain Knowledge and Reasoning · Machine Learning · Communicating, Perceiving and Acting

**ประเภทข้อมูล (Types of Data):**

| ประเภท | ตัวอย่าง |
|---|---|
| **Structured** | tables, numerical data, logs |
| **Unstructured** | images, audio, text |

- ข้อมูลไม่สมบูรณ์เสมอ (imperfect) — อาจมี label ผิด หรือค่าหายไป (missing values)
- การเก็บข้อมูลอย่างเดียวไม่พอ ต้อง **refine + validate** ก่อนจึงจะมีค่าจริงต่อการพัฒนา AI

**ความสัมพันธ์ AI / Data Science / ML (แผนภาพในสไลด์):**

```
Data ──Transformation──► Data Science ──Analysis──► Insight ──► Human Decision ──► Action
  │                                                                     ▲
  ├──► Deep Learning ──► Feature ──┬──► Unsupervised Learning           │
  │                                └──► Supervised Learning ──► Prediction ──► Automated Decision
  └────────────── Machine Learning ⊂ Artificial Intelligence ──────────┘
```

**Type of AI – Based on Capabilities ⭐ (ออกสอบแน่นอน)**

| ประเภท | ขอบเขตความสามารถ | รายละเอียด | ตัวอย่าง |
|---|---|---|---|
| **ANI** — Artificial Narrow Intelligence | Narrow range of abilities | **AI ชนิดเดียวที่มีอยู่จริงในปัจจุบัน**; ฝึกมาเพื่องานเดียว/แคบ มักเร็วและเก่งกว่ามนุษย์ในงานนั้น; **ทำงานนอกขอบเขตที่กำหนดไม่ได้** | Siri, Alexa, IBM Watson, OpenAI ChatGPT |
| **AGI** — Artificial General Intelligence | On par with human | **ยังเป็นทฤษฎี**; เรียนรู้และทำงานทางปัญญาใดก็ได้ที่มนุษย์ทำได้; ใช้ความรู้เดิมแก้ปัญหาใหม่ **โดยไม่ต้อง retrain** | — |
| **ASI** — Artificial Super Intelligence | More capable than human | **เป็นทฤษฎีล้วน ๆ**; เหนือกว่าความสามารถทางปัญญาของมนุษย์; คิด ใช้เหตุผล เรียนรู้ ตัดสิน และ**มีอารมณ์**ได้ | — |

- **ผู้เล่นในตลาด AI ตามสไลด์:** Anthropic, Google, OpenAI, Perplexity AI, X.AI, Mistral AI, MiniMax, Z.ai, Alibaba Cloud, Deepseek, Meta AI

### 1.8 Online Social Network
- **นิยาม:** เครือข่ายที่สนับสนุนให้สมาชิกแบ่งปันความสนใจ ความคิด เรื่องราว ภาพ เพลง วิดีโอ กับผู้ใช้ที่ลงทะเบียนคนอื่น
- **แพลตฟอร์มตามสไลด์:** Facebook, Instagram, LinkedIn, Medium, X, Clubhouse, YouTube, TikTok

### 1.9 Digital Safety and Security ⭐⭐ (4 หัวข้อหลัก)

```
┌────────────────────────┬────────────────────────┐
│ 1. Virus & Other       │ 2. Privacy             │
│    Malwares            │                        │
├────────────────────────┼────────────────────────┤
│ 3. Health Concern      │ 4. Environmental Issues│
└────────────────────────┴────────────────────────┘
```

**(1) Virus and Other Malwares — ตารางเปรียบเทียบ ⭐**

| Malware | นิยาม (ตามสไลด์) | จำสั้น ๆ |
|---|---|---|
| **Virus** | โค้ดที่แทรกตัวเองเข้าไปในแอปพลิเคชัน และทำงานเมื่อแอปนั้นถูกรัน | แทรกแซง ทำงานเมื่อเปิดแอป |
| **Ransomware** | ปิดกั้นการเข้าถึงข้อมูลของเหยื่อจนกว่าจะจ่ายค่าไถ่ | เรียกค่าไถ่ |
| **Spyware** | เก็บข้อมูลกิจกรรมของผู้ใช้โดยที่ผู้ใช้ไม่รู้ตัว | แอบเก็บข้อมูล |
| **Adware** | แสดงโฆษณาที่ไม่ต้องการ | ยิงโฆษณา |
| **Trojans** | ปลอมตัวเป็นโค้ด/โปรแกรมที่น่าใช้งาน | ปลอมตัว (**ไม่ replicate**) |
| **Worms** | แพร่กระจายผ่านเครือข่ายโดยการทำสำเนาตัวเอง (replicating itself) | แพร่ผ่านเน็ตเวิร์ก |
| **Keyloggers** | เฝ้าติดตามการกดแป้นพิมพ์ของผู้ใช้ | ดักคีย์บอร์ด |

**(2) Privacy**
- **Crimes Opportunities:** Social Media ทำให้เกิด real-world stalking เพิ่มขึ้นมาก
- **Cybercrimes Opportunities:** identity theft, financial fraud, การเปิดเผยข้อมูลส่วนบุคคล (ข้อความ ภาพ วิดีโอ เสียง) โดยไม่ได้รับความยินยอม → cyberstalking, cyberharassment/cyberbullying
- **Password (ออกสอบ):**
  - เก็บข้อมูลส่วนตัวให้ปลอดภัย และป้องกันคนอื่นเข้าบัญชี
  - สร้างรหัสที่ **strong, long, unique** — จำได้เองแต่คนอื่นเดาแทบไม่ได้
  - ใช้ **ตัวอักษร + ตัวเลข + สัญลักษณ์** (ASCII-standard characters only)
  - **หลีกเลี่ยง**ข้อมูลส่วนตัวและคำทั่วไป
  - ซ่อนรหัสที่จดไว้ · จัดการรหัสด้วยเครื่องมือ (password manager)

**(3) Health Concern — 3 อาการ ⭐**

| อาการ | นิยามตามสไลด์ |
|---|---|
| **Technology addiction** | หมกมุ่นกับการใช้เทคโนโลยี การพึ่งพาเทคโนโลยีทำให้เกิดผลตั้งแต่รำคาญเล็กน้อยเมื่ออยู่ห่างเทคโนโลยี ไปจนถึงรู้สึกโดดเดี่ยว วิตกกังวลรุนแรง และซึมเศร้า |
| **Technology overload** | การมีอุปกรณ์แพร่หลาย/ข้อมูลล้นเกิน ก่อภาระทางปัญญาและร่างกาย จากการใช้อุปกรณ์หลายชิ้นหลายฟังก์ชันเพื่อทำงานหลายอย่างในชีวิตประจำวัน → รู้สึกวอกแวก วิตกกังวล อ่อนล้า หรือซึมเศร้า |
| **Office syndrome** | กลุ่มอาการหลายอย่างรวมถึงการอักเสบของกล้ามเนื้อคอ ไหล่ และหลัง เกิดจากการใช้กล้ามเนื้อซ้ำ ๆ ในท่าที่ไม่เหมาะสมเป็นเวลานาน เช่น นั่งหน้าจอคอมพิวเตอร์หลายชั่วโมง |

- ประเด็นในสไลด์ Office Syndrome: **Do / Don't / Ergonomic Chair / Spinal Disc Herniation (หมอนรองกระดูกเคลื่อน)**

**(4) Environmental Issues — Green Computing**
- **นิยาม:** แนวทางลดการใช้ไฟฟ้าและลดขยะ/ผลกระทบสิ่งแวดล้อมที่เกิดจากการใช้คอมพิวเตอร์
- **6 แนวทางตามสไลด์:** Saving/Efficiency · Monitoring · Maintenance · Recycle · Green Disposal · Cloud Computing

### 1.10 Programs & Apps — ชั้นซอฟต์แวร์ ⭐

```
┌──────────────┐
│     User     │   ← ผู้ใช้
├──────────────┤
│ Applications │   ← Application Software (Office 365, Adobe CC, Matlab)
├──────────────┤
│ Operating    │   ← System Software: OS (PC / Mobile) + Tools
│ Systems      │
├──────────────┤
│   Hardware   │
└──────────────┘
```

- **Program (Software)** = บอกคอมพิวเตอร์ว่าต้องทำงานอะไรและทำอย่างไร
- **System Software** = Operating System (PC, Mobile) + Tools
- **Application Software** = โปรแกรมที่ทำให้ผู้ใช้ทำงานได้มีประสิทธิภาพ/ช่วยงานส่วนตัว

### 1.11 Communications and Networks
- **8 เทคโนโลยีการสื่อสารตามสไลด์:** Internet · E-mail · Instant Messaging · Chat Room · VoIP · Video Conference · News Group · Fax
- **Communications device** = ฮาร์ดแวร์ที่สามารถถ่ายโอนสิ่งต่าง ๆ จากคอมพิวเตอร์/อุปกรณ์ไปยังสื่อส่งข้อมูล และในทางกลับกัน
- **Network** = กลุ่มของคอมพิวเตอร์และอุปกรณ์ที่เชื่อมต่อกัน มักเชื่อมแบบไร้สาย ผ่าน communications devices และ transmission media
- **ตัวอย่างสื่อไร้สาย:** Cellular Radio, Wi-Fi, Bluetooth

### 1.12 Technology Uses & Users

| **Technology Uses (8 ด้าน)** | Education · Finance · Retail · Government · Entertainment · Healthcare · Research · Manufacturing |
|---|---|
| **Technology Users (5 ประเภท)** | Home User · Small Home/Office User · Mobile User · Power User · Enterprise User |

---

## 📗 Lecture 02 — Computers

### 2.1 Class of Computer ⭐⭐
- จำแนกได้หลายวิธี: by **purpose, function, usage, generation of technology**
- **สไลด์นี้จำแนกตาม purpose บนพื้นฐานของ "ขนาด (size)" → 4 กลุ่ม**

```
┌─────────────────────────┬──────────────────────────┐
│ 1. Microcomputers       │ 2. Minicomputers         │
│    (Personal Computers) │    (Mid-range Computers) │
├─────────────────────────┼──────────────────────────┤
│ 3. Mainframe Computers  │ 4. Supercomputers        │
└─────────────────────────┴──────────────────────────┘
```

### 2.2 Microcomputer
- **นิยาม:** คอมพิวเตอร์ขนาดเล็ก ราคาไม่แพง ที่ใช้ **microprocessor เป็น CPU**
- มี microprocessor + memory + วงจร I/O ขั้นต่ำ ติดตั้งบน **แผงวงจรพิมพ์แผ่นเดียว (single PCB)**

**4 ประเภทย่อยของ Microcomputer ⭐ (ตารางสรุปในสไลด์หน้า 22)**

| ประเภท | นิยาม |
|---|---|
| **Personal Computer** | หมวดคอมพิวเตอร์ที่ได้รับความนิยม; เป็น mobile หรือ desktop ที่ทำ input, processing, output, storage **ได้ครบด้วยตัวเอง**; ออกแบบให้ใช้ **ทีละหนึ่งคน** |
| **Mobile Device** | คอมพิวเตอร์ส่วนบุคคลแบบพกพา ออกแบบให้ผู้ใช้พกจากที่หนึ่งไปอีกที่ได้ง่าย |
| **Game Console** | อุปกรณ์คอมพิวเตอร์แบบพกพาที่ออกแบบสำหรับวิดีโอเกมแบบผู้เล่นเดี่ยวหรือหลายผู้เล่น |
| **Embedded Computer** | คอมพิวเตอร์เฉพาะทางที่ทำหน้าที่เป็น **ส่วนประกอบในผลิตภัณฑ์ที่ใหญ่กว่า** |

**(ก) Personal Computer**

| ชนิด | นิยาม |
|---|---|
| **Desktop** | PC ที่ออกแบบให้อยู่กับที่ ส่วนประกอบทั้งหมดวางบน/ใต้โต๊ะได้ (มีแบบ All-in-one) |
| **Laptop/Notebook** | คอมพิวเตอร์พกพาน้ำหนักเบาและบาง มีจอในฝาและคีย์บอร์ดที่ฐาน |
| **Tablet** | คอมพิวเตอร์พกพาที่บาง เบากว่า มี **touch screen** |

**(ข) Mobile Device**

| ชนิด | นิยาม / จุดจำ |
|---|---|
| **Smartphone** | โทรศัพท์ที่เชื่อมอินเทอร์เน็ตได้ มักมีปฏิทิน สมุดที่อยู่ เครื่องคิดเลข โน้ต เกม เบราว์เซอร์ และแอปอื่นอีกมาก |
| **Phablet** | **คำผสม (portmanteau) ของ phone + tablet**; อยู่ระหว่างขนาดสมาร์ตโฟนกับแท็บเล็ต; หน้าจอวัดตามแนวทแยง **5–7 นิ้ว**; บางรุ่นมี stylus |
| **Handheld Computer** | คอมพิวเตอร์เล็กพอที่จะอยู่ในมือเดียว |
| **Portable Media Player** | เก็บ จัดระเบียบ เล่น/ดูสื่อดิจิทัล |
| **E-book Reader** | สำหรับอ่าน e-book และสิ่งพิมพ์ดิจิทัล |
| **Wearable Device** | ออกแบบให้สวมใส่ใกล้/บนผิวหนัง จึงตรวจจับ วิเคราะห์ และส่งข้อมูลเกี่ยวกับผู้ใช้ได้ |
| **Digital Camera** | ถ่ายภาพและเก็บภาพในรูปแบบดิจิทัล |

> 💡 **Technological convergence** = แนวโน้มที่เทคโนโลยีซึ่งเดิมไม่เกี่ยวข้องกัน จะรวมเข้าด้วยกันอย่างใกล้ชิดและกลายเป็นหนึ่งเดียวเมื่อพัฒนาไป (เช่น โทรศัพท์ = กล้อง + เครื่องเล่นเพลง + GPS)

**ชนิดกล้องดิจิทัล ⭐**

| ชนิด | นิยาม |
|---|---|
| **Point-and-Shoot** | กล้องนิ่งสำหรับใช้งานง่าย เรียกว่า "Compact Digital Camera" |
| **DSLR** (Digital Single-Lens Reflex) | กล้องดิจิทัลที่รวม **optics และกลไกของกล้อง single-lens reflex** เข้ากับ **digital imaging sensor** |
| **Mirrorless (MILC)** | Mirrorless Interchangeable-Lens Camera — เปลี่ยนเลนส์ได้ มีจอดิจิทัล **ไม่มี reflex mirror และไม่มี optical viewfinder แบบ DSLR** |

**การเก็บภาพในคอมพิวเตอร์:** ภาพประกอบด้วย **Pixel**; ระบบสีที่ใช้คือ **RGB** (และมีแบบ Grayscale)

### 2.3 Moore's Law ⭐⭐ (ออกสอบแน่)

| ปี | คำกล่าว |
|---|---|
| **1965** | Gordon Moore (**ผู้ร่วมก่อตั้ง Intel**) สังเกตว่า จำนวน components ต่อ integrated circuit **เพิ่มเป็น 2 เท่าทุก 1 ปี** |
| **1975** | ปรับการคาดการณ์เป็น **"เพิ่มเป็น 2 เท่าทุก 2 ปี"** |
| **2015** | Intel ระบุว่าจังหวะปัจจุบันใกล้ **2.5 ปี** มากกว่า 2 ปี |
| **2010→** | เพราะการพัฒนาอุปกรณ์ **MOSFET ชะลอตัวลงตั้งแต่ปี 2010** |

> **ประโยคสรุปในสไลด์:** *The number of transistors on a CPU would double every two years*

### 2.4 Minicomputers (Mid-range Computers)
- คอมพิวเตอร์ขนาดกลาง
- เป็นระบบ **multiprocessing** รองรับผู้ใช้ **ได้ถึง 200 คนพร้อมกัน**
- มีลักษณะ: มีโปรเซสเซอร์ตั้งแต่ 1 ตัวขึ้นไป, รองรับ multiprocessing และ multi-tasking, ทนต่อภาระงานสูง (resilient for high workloads)
- ให้ **centralized storage area** สำหรับโปรแกรม ข้อมูล และสารสนเทศ

### 2.5 Mainframe Computers
- ใหญ่ แพง ทรงพลัง รองรับผู้ใช้ที่เชื่อมต่อ **หลักร้อยถึงหลักพันคนพร้อมกัน** และรันหลายโปรแกรมพร้อมกัน
- **ความจุจัดเก็บสูงมาก (high storage capacity)**
- ใช้ในภาค **ธนาคาร โทรคมนาคม** ฯลฯ ที่ประมวลผลข้อมูล/ธุรกรรมปริมาณมาก
- ทำงานได้ราบรื่นต่อเนื่องยาวนาน อายุการใช้งานยาว
- **ตัวอย่าง: Four-frame IBM Z15**

### 2.6 Server ⭐
- **นิยาม:** คอมพิวเตอร์ที่อุทิศให้บริการหนึ่งอย่างหรือมากกว่า แก่คอมพิวเตอร์/อุปกรณ์อื่นบนเครือข่าย
- **3 รูปแบบ:** Tower Server · Rack Server · Blade Server

**Rack Server vs Blade Server ⭐⭐ (ตารางนี้ออกสอบง่ายมาก)**

| | **Rack Server** | **Blade Server** |
|---|---|---|
| **Pros** | **Cable Management** – ใช้สายเยอะแต่จัดระเบียบง่าย<br>**Failure Containment** – ระบุ ถอด และเปลี่ยนเครื่องที่เสียได้ง่าย<br>**Cost** – ให้พลังประมวลผลมากในราคาที่ค่อนข้างต่ำ | **Size** – อัดพลังประมวลผลมากในพื้นที่น้อยที่สุด<br>**Centralized Management** – จัดการทุก blade ผ่าน interface เดียว<br>**Cabling** – ใช้สายน้อยกว่า rack server |
| **Cons** | **Power Usage** – ต้องมีระบบระบายความร้อน<br>**Size** – อาจกินพื้นที่ว่างทั้งหมด<br>**Maintenance** – งานบำรุงรักษาตามปกติกินเวลามากเมื่อ rack แน่น | **Heat** – การระบายความร้อนเป็นเรื่องท้าทาย<br>**Cost** – แพงกว่า rack server<br>**Power Requirement** – **ถ้าไฟดับ เซิร์ฟเวอร์ดับทั้งหมด** |

### 2.7 Client — Terminal & ATM

| | นิยาม |
|---|---|
| **Terminal** | คอมพิวเตอร์ที่มักมีพลังประมวลผล**จำกัด** ให้ผู้ใช้ส่งข้อมูลไปยัง และ/หรือ รับสารสนเทศจาก server หรือ host computer |
| **Thin client** | terminal ที่หน้าตาเหมือน desktop แต่มีขีดความสามารถและส่วนประกอบจำกัด |
| **POS terminal** | ร้านค้าปลีกส่วนใหญ่ใช้บันทึกการซื้อ ประมวลผลบัตรเครดิต/เดบิต และอัปเดตสต็อกสินค้า |
| **ATM** | **Automated Teller Machine** — terminal บริการตนเองด้านธนาคาร ที่เชื่อมต่อกับ host computer ผ่านเครือข่าย |

### 2.8 Supercomputers ⭐⭐
- **เร็วที่สุด ทรงพลังที่สุด และแพงที่สุด**
- ประมวลผลได้ **ล้านล้านคำสั่ง (10¹²) ต่อวินาที**
- ใช้ในงานวิทยาศาสตร์และวิศวกรรม: **พยากรณ์อากาศ, การจำลองทางวิทยาศาสตร์, การสำรวจระบบสุริยะ, การวิจัยพลังงานนิวเคลียร์**

**ตัวอย่างในสไลด์ — Supercomputer Fugaku (RIKEN Center for Computational Science)**

| รายการ | ค่า |
|---|---|
| จำนวน cores | **7,630,848 cores** |
| สมรรถนะ | **442 Pflop/s** (Peta = 10¹⁵) |
| อันดับ | **อันดับ 1 ของโลก มิถุนายน 2021** (top500.org) |
| เทียบกับ | Intel Core i7-11370H (Gen 11) ≈ **200 Gflops** (10⁹) |

- สไลด์ **Simulation of Human Brain**: การจำลองสมองมนุษย์ **1 วินาที** ต้องใช้ supercomputer คำนวณราว **40 นาที**

### 2.9 Cloud Computing
- **นิยาม:** สภาพแวดล้อมที่ให้ทรัพยากรและบริการ ซึ่งเข้าถึงได้ผ่านอินเทอร์เน็ต

### 2.10 Ports & Connection ⭐
- **Port** = จุดที่อุปกรณ์ต่อพ่วง (peripheral device) เชื่อมต่อหรือสื่อสารกับอุปกรณ์ เพื่อถ่ายโอนข้อมูล
- **Connector** = ตัวเชื่อมสายเคเบิลเข้ากับพอร์ต
- **USB (Universal Serial Bus):** พอร์ต USB หนึ่งพอร์ตเชื่อมต่ออุปกรณ์ต่อพ่วงได้ **ถึง 127 อุปกรณ์** ด้วย connector เดียว
- **Port replicator / Docking station:** ผู้ใช้ mobile บางคนชอบความยืดหยุ่นนี้แทนการต่ออุปกรณ์เข้าพอร์ตโดยตรง

### 2.11 Wireless Communication
- **Wi-Fi · Bluetooth · NFC (Near Field Communication)**
- 📝 *จากโน้ตในชั้นเรียน:* NFC/RFID Tag ใช้คลื่นความถี่วิทยุ **13.56 MHz**

### 2.12 Protecting Hardware ⭐

| ภัยคุกคาม | มาตรการป้องกันตามสไลด์ |
|---|---|
| **Theft (ขโมย)** | Physical access controls · Alarm system · Physical security devices · Security or device-tracking app · Require identification |
| **Failure (เสียหาย)** | **Surge Protector** (ป้องกันไฟกระชาก) · **UPS – Uninterruptible Power Supply** (จ่ายไฟต่อเนื่องเมื่อไฟดับ) |

---

## 📗 Lecture 03 — Computing Components

### 3.1 Case & Inside the Case ⭐
- **ชนิดของ Case:** Desktop Tower · All-in-one Desktop · Laptop · Slate Tablet · Smartphone · Handheld Game Device · Wearable Device · Digital Camera

**7 องค์ประกอบภายในเคส (ท่องให้ครบ):**

```
Motherboard → Processor → Cooling Device → Memory → Adapter
                    ↓                          ↓
              Power Supply                 Storage
```

### 3.2 Motherboard ⭐
- **นิยาม:** แผงวงจรหลัก (main circuit board) ของคอมพิวเตอร์
- **ส่วนประกอบบน motherboard (จากภาพสไลด์ — ต้องจำตำแหน่ง):**

| ส่วนประกอบ | หน้าที่ |
|---|---|
| **Slot for Memory Modules** | ใส่ RAM |
| **Slot for Processor Chip** | ใส่ CPU |
| **Chipset + Heatsink** | ควบคุมการสื่อสาร + ระบายความร้อน |
| **CMOS Battery** | รักษาการตั้งค่า BIOS ไว้เมื่อปิดเครื่อง |
| **Ports** | ต่ออุปกรณ์ภายนอก |
| **Slots for Adapter Cards** | ใส่การ์ดขยาย เช่น การ์ดจอ |

- **A computer chip contains integrated circuits (IC)**

### 3.3 Central Processing Unit (CPU) ⭐⭐
- **นิยาม:** CPU หรือ **processor** ตีความและดำเนินการคำสั่งพื้นฐานที่ทำให้คอมพิวเตอร์ทำงาน
- CPU ตัวเดียวทำงานเป็น **multi-core processor** ได้ = มี 2 core ขึ้นไปแยกกันในตัวเดียว
- **CPU ประกอบด้วย 2 ส่วน:**

| ส่วน | หน้าที่ |
|---|---|
| **Control Unit (CU)** | ส่วนของโปรเซสเซอร์ที่ **สั่งการและประสานงาน (directs and coordinates)** การทำงานส่วนใหญ่ในคอมพิวเตอร์ |
| **Arithmetic Logic Unit (ALU)** | ส่วนที่ทำการ **คำนวณเลขคณิต การเปรียบเทียบ และการดำเนินการอื่น ๆ** |

**แผนภาพสถาปัตยกรรมหลัก (สไลด์หน้า 9 — ออกสอบ):**

```
                  ┌──────────── Processor ────────────┐
                  │  Control Unit   │  Arithmetic     │
                  │  (สั่งการ/ประสาน) │  Logic Unit     │
                  └───────┬─────────┴────────┬────────┘
                          │ Instruction / Data / Information
                          ▼
  ┌────────┐   Data   ┌────────┐   Information   ┌────────┐
  │ Input  │ ───────► │ Memory │ ──────────────► │ Output │
  │ Device │          │        │                 │ Device │
  └────────┘          └───┬────┘                 └────────┘
                          │ Instruction / Data / Information
                          ▼
                  ┌───────────────┐
                  │Storage Device │
                  └───────────────┘
```

### 3.4 A Machine Cycle ⭐⭐⭐ (ออกสอบชัวร์)

```
                    ┌─────────┐
              ┌────►│  Fetch  │──────┐
              │     └─────────┘      │  Control Unit
       ┌──────┴──┐              ┌────▼────┐
       │  Store  │              │ Decode  │
       └──────▲──┘              └────┬────┘
              │     ┌─────────┐      │
              └─────│ Execute │◄─────┘  ALU
                    └─────────┘
```

| ขั้น | ผู้ทำ | รายละเอียด |
|---|---|---|
| **S1 – Fetch** | **Control Unit** | ดึงคำสั่งและข้อมูลจาก **memory** |
| **S2 – Decode** | **Control Unit** | ถอดรหัสคำสั่ง แล้วส่งคำสั่งและข้อมูลไปยัง **ALU** |
| **S3 – Execute** | **ALU** | ทำการคำนวณกับข้อมูล |
| **S4 – Store** | — | ผลลัพธ์ถูกเก็บใน **memory** และปรากฏบนหน้าจอ |

> 🔑 จำ: **Fetch → Decode → Execute → Store**; Fetch/Decode = Control Unit, Execute = ALU

### 3.5 Instruction Pipelining ⭐⭐

| แบบ | นิยามตามสไลด์ |
|---|---|
| **No Pipelining** | ทำคำสั่งหนึ่งให้จบ machine cycle ก่อน จึงเริ่มคำสั่งถัดไป |
| **Pipelining** | โปรเซสเซอร์เริ่ม **fetch คำสั่งที่ 2 ก่อนที่ machine cycle ของคำสั่งแรกจะเสร็จ**; ทำได้ **เพียง 1 stage ต่อ 1 clock cycle** |
| **Super-pipelined** | สามารถทำ **2 pipeline stages ต่อ 1 clock cycle** |
| **Superscalar** | ทำ **เพียง 1 pipeline stage ต่อ clock cycle ในแต่ละ pipeline ที่ขนานกัน** (มีหลาย pipeline ขนานกัน) |

### 3.6 Processor: Register & System Clock ⭐
- **Register** = ชุดเล็ก ๆ ของที่เก็บข้อมูลในโปรเซสเซอร์ ใช้เก็บข้อมูลและคำสั่ง**ชั่วคราว**
  - เป็นตำแหน่งที่ **เข้าถึงได้เร็วมาก**
  - มี register เพียงพอ → ทำงานเร็วและราบรื่นขึ้น
- **System clock** = ควบคุมจังหวะเวลาของการทำงานทั้งหมดของคอมพิวเตอร์
  - จังหวะของ system clock เรียกว่า **clock speed** วัดเป็น **gigahertz (GHz)**
  - 🔢 **สูตรที่ต้องจำ: 1 GHz = 1,000,000,000 cycles/second (10⁹)**

### 3.7 Data Representation ⭐⭐

| | **Analog signals** | **Digital signals** |
|---|---|---|
| ลักษณะ | ต่อเนื่อง (continuous) และแปรผันตาม strength และ quality | อยู่ในหนึ่งใน **สองสถานะ – On & Off** |
| รูปคลื่น | คลื่นโค้งต่อเนื่อง 〜 | คลื่นสี่เหลี่ยม ⊓⊔ |

- คอมพิวเตอร์ส่วนใหญ่เป็น **digital** ใช้ **binary system** = ใช้เลข 2 ตัว (**0 และ 1**)
- ในคอมพิวเตอร์มีแต่ 0 กับ 1 เรียกว่า **bits**
- 🔢 **สูตรทอง: 8 bits = 1 byte = 1 character**

**ตารางน้ำหนักบิต (จากสไลด์):**

| 2⁷ | 2⁶ | 2⁵ | 2⁴ | 2³ | 2² | 2¹ | 2⁰ | **DEC** | **CHAR** |
|---|---|---|---|---|---|---|---|---|---|
| 128 | 64 | 32 | 16 | 8 | 4 | 2 | 1 | | |
| 0 | 1 | 0 | 0 | 0 | 1 | 0 | 1 | **69** | **E** |
| 0 | 0 | 1 | 0 | 1 | 0 | 1 | 0 | **42** | **\*** |
| 0 | 0 | 1 | 1 | 0 | 1 | 1 | 0 | **54** | **6** |

> ตรวจสอบ: 64+4+1 = 69 (E) · 32+8+2 = 42 (*) · 32+16+4+2 = 54 (6)

- **ASCII** = **American Standard Code For Information Interchange**

**ขั้นตอนการแปลงตัวอักษรเป็นไบนารี ⭐ (3 ขั้น):**
1. ผู้ใช้กดปุ่มบนคีย์บอร์ด
2. **scan code** ของตัวอักษรถูกส่งไปยังวงจรอิเล็กทรอนิกส์ในคอมพิวเตอร์
3. วงจรแปลง scan code เป็น **ASCII binary code** แล้วเก็บใน **memory** เพื่อประมวลผล

### 3.8 Cooling Device
- ชิปโปรเซสเซอร์สร้างความร้อนที่อาจทำให้ชิปทำงานผิดพลาดหรือเสียหาย จึงจำเป็นต้องมีอุปกรณ์ระบายความร้อน
- **3 แบบ:** Heat Sink · Liquid Cooling Technology · Cooling Pad

### 3.9 Memory ⭐⭐
- **นิยาม:** ชิ้นส่วนอิเล็กทรอนิกส์ที่เก็บ (1) คำสั่งที่รอถูกประมวลผลโดยโปรเซสเซอร์ (2) ข้อมูลที่คำสั่งเหล่านั้นต้องการ และ (3) ผลลัพธ์ของการประมวลผล
- **แต่ละตำแหน่งใน memory มี address (ที่อยู่)**

| | **Volatile Memory** | **Non-volatile Memory** |
|---|---|---|
| ลักษณะ | **สูญเสียข้อมูลเมื่อไฟดับ** | **ไม่สูญเสียข้อมูลเมื่อไฟดับ** |
| ตัวอย่าง | **RAM** | **ROM, flash memory, CMOS** |

**RAM: SRAM vs DRAM ⭐⭐ (ตารางเปรียบเทียบสำคัญ)**

| | **Static RAM (SRAM)** | **Dynamic RAM (DRAM)** |
|---|---|---|
| โครงสร้าง | เป็น semiconductor memory | สร้างจาก **transistor + capacitor** ใน IC; **บิตข้อมูลเก็บใน capacitor** |
| การคงข้อมูล | เก็บข้อมูลได้ตราบเท่าที่ยังจ่ายไฟให้ระบบ | ต้อง refresh (จึงชื่อ dynamic) |
| ความเร็ว | **เร็วกว่ามาก** | ช้ากว่า |
| พลังงาน | **กินไฟน้อยกว่า** DRAM | กินไฟมากกว่า |
| ราคา | แพงกว่า | **ถูกกว่า SRAM มาก** |
| ความจุ | น้อยกว่า | **ความจุสูงกว่า** |
| การใช้งาน | ส่วนใหญ่ใช้เป็น **cache memory ของ CPU** | ใช้เป็น **main memory ของคอมพิวเตอร์** |

**Memory Cache ⭐ (แผนภาพลำดับชั้น — ออกสอบ)**
- ช่วยเร่งกระบวนการของคอมพิวเตอร์ เพราะเก็บ**คำสั่งและข้อมูลที่ใช้บ่อย**
- L1, L2 อยู่บน **Processor Chip**; L3 และ RAM อยู่บน **Mainboard**

```
        Speed                            Capacity
         ▲  Fast  ┌────────────┐  Small     │
         │        │  L1 cache  │            │
         │        ├────────────┤            │
         │        │  L2 cache  │            ▼
         │        ├────────────┤
         │        │  L3 cache  │
         │        ├────────────┤
         │  Slow  │    RAM     │  Large
```

> 🔑 ยิ่งใกล้ CPU → **เร็วขึ้น แต่ความจุน้อยลง**

**Non-volatile Memory**

| | นิยาม |
|---|---|
| **ROM** (Read Only Memory) | ชิปหน่วยความจำที่เก็บข้อมูลและคำสั่ง**ถาวรจากผู้ผลิต**; ไมโครโปรเซสเซอร์**อ่านได้อย่างเดียว เขียนหรือแก้ไขไม่ได้**; มีคำสั่งพิเศษสำหรับคอมพิวเตอร์ที่อยู่ตลอดเพราะลบไม่ได้ |
| **BIOS** | **Basic Input/Output System** (อ่านว่า "บาย-ออส"); เป็น **ROM chip บน motherboard** ที่ให้ผู้ใช้เข้าถึงและตั้งค่าระบบคอมพิวเตอร์ในระดับพื้นฐานที่สุด |
| **EEPROM** | **Electrically Erasable Programmable Read-Only Memory** = เรียกว่า **"flash memory"**; **ลบด้วยไฟฟ้าและเขียนใหม่ได้**; คอมพิวเตอร์ส่วนใหญ่ใช้ flash memory เก็บคำสั่งเริ่มต้น (start-up) เพราะอัปเดตเนื้อหาได้ง่าย; ชิป flash เก็บข้อมูล/โปรแกรมในอุปกรณ์พกพา เช่น สมาร์ตโฟน portable media player |
| **CMOS** | **Complementary Metal–Oxide–Semiconductor**; ใช้ **พลังงานจากแบตเตอรี่** เพื่อรักษาข้อมูล (การตั้งค่าคอมพิวเตอร์) เมื่อปิดเครื่อง; **กินไฟต่ำ**; **ช้ากว่า RAM** |

**Access Time (ของ Memory) ⭐**
- **นิยาม:** ระยะเวลาที่โปรเซสเซอร์ใช้ในการ**อ่านข้อมูลจากหน่วยความจำ**
- แสดงเป็นหน่วย **ns (nanoseconds)**
- **ยิ่งเวลาต่ำ ยิ่งดี/ยิ่งเร็ว**

### 3.10 Adapters ⭐

| | นิยาม |
|---|---|
| **Adapter Card** | เสริมฟังก์ชันของส่วนประกอบใน desktop/system unit และ/หรือ ให้การเชื่อมต่อกับอุปกรณ์ต่อพ่วง |
| **Expansion slot** | ซ็อกเก็ตบน motherboard ที่ใส่ adapter card; มีจำนวนไม่กี่ช่อง — มาตรฐาน **PCI (Peripheral Component Interconnect)** |
| **Plug and Play** | ความสามารถของ adapter card ที่ทำให้คอมพิวเตอร์ **รู้จักอุปกรณ์ต่อพ่วงโดยอัตโนมัติเมื่อติดตั้ง** |
| **ตัวอย่างการ์ด** | **GPU (Graphics Processing Unit)**, **Sound Card** |
| **Dongle** | USB adapter ที่เสริมฟังก์ชันของคอมพิวเตอร์พกพา และ/หรือ ให้การเชื่อมต่อกับอุปกรณ์ต่อพ่วง เช่น **Bluetooth dongle, Mobile Broadband Modem** |

### 3.11 Buses ⭐⭐

**นิยาม:** Bus ทำให้อุปกรณ์ต่าง ๆ ทั้งภายในและที่ต่อกับ system unit สื่อสารกันได้

**แบ่งตามสิ่งที่ส่ง:**

| ชนิด | ส่งอะไร |
|---|---|
| **Data bus** | ส่ง **ข้อมูลอย่างเดียว** |
| **Address bus** | ส่ง **แอดเดรสที่เก็บข้อมูล** อย่างเดียว |

**Width (Word size) — 🔢 คำนวณออกสอบ:**
- **width (word size)** = จำนวนบิตที่ส่งได้ในครั้งเดียว
- ตัวอย่างในสไลด์: **32-bit bus ส่งได้ 32 bits ต่อครั้ง = 4 bytes** (เพราะ 1 byte = 8 bits)

**Physical Types of Buses (3 ชนิด) ⭐**

| ชนิด | เชื่อมอะไรกับอะไร |
|---|---|
| **System bus (Front-side bus)** | เชื่อม **processor ↔ main memory (RAM)** |
| **Backside bus** | เชื่อม **processor ↔ cache** |
| **Expansion bus** | เชื่อม **processor ↔ peripherals** |

### 3.12 Power Supply
- **Power supply** หรือ **laptop AC adapter** แปลงไฟ **AC จากเต้าเสียบ → DC**
- คอมพิวเตอร์/อุปกรณ์พกพารันได้ทั้งจาก power supply หรือแบตเตอรี่
- แบตเตอรี่โดยทั่วไปเป็น **rechargeable lithium-ion batteries**

---

## 📗 Lecture 04 — Input and Output

### 4.1 นิยาม Input ⭐
- **Input** = ข้อมูลและคำสั่งใด ๆ ที่ถูกป้อนเข้าสู่ **หน่วยความจำ (memory)** ของคอมพิวเตอร์
- ป้อนโดย **input device** = ฮาร์ดแวร์ใด ๆ ที่ใช้ป้อนข้อมูลหรือคำสั่งเข้าสู่คอมพิวเตอร์

### 4.2 Commonly Used Input Methods — 8 วิธี ⭐⭐ (ท่องให้ครบ)

```
┌───────────┬──────────────────┬──────────────┬─────────────────┐
│ Keyboard  │ Pointing Devices │ Touch Screen │   Pen Input     │
├───────────┼──────────────────┼──────────────┼─────────────────┤
│Motion Input│   Voice Input   │ Video Input  │ Reading Devices │
└───────────┴──────────────────┴──────────────┴─────────────────┘
```

**(1) Keyboard**
- **นิยาม:** อุปกรณ์อินพุตที่มีปุ่มให้ผู้ใช้กดเพื่อป้อนข้อมูลและคำสั่ง
- **มาตรฐาน: ANSI standard 104-key keyboard** (**A**merican **N**ational **S**tandards **I**nstitute)
- **กลุ่มปุ่มบนคีย์บอร์ด (จากภาพสไลด์):** FUNCTION KEYS · TYPING KEY · CONTROL KEYS · NAVIGATION KEYS · NUMERIC KEYPAD · LED STATUS
- **ทำไม QWERTY ไม่ใช่ ABCD? ⭐** → เพื่อ **ลดความถี่ของการที่ก้านตัวอักษรติดขัด (key jams) บนเครื่องพิมพ์ดีดกลไกสมัยก่อน**
- **ชนิดคีย์บอร์ด:** Desktop, Laptop, Onscreen, Type Cover, Mini, Virtual
- **Ergonomic keyboard** = ออกแบบเพื่อลดโอกาสเกิด **repetitive strain injuries (RSI)** ที่ข้อมือและมือ
  - **Ergonomics** = การผนวก **comfort, efficiency, safety** เข้าไปในการออกแบบสถานที่ทำงาน

**(2) Pointing Devices ⭐**
- **Pointer** = สัญลักษณ์เล็ก ๆ บนหน้าจอ ที่ตำแหน่งและรูปร่างเปลี่ยนไปเมื่อผู้ใช้ขยับอุปกรณ์ชี้ตำแหน่ง

| อุปกรณ์ | นิยาม |
|---|---|
| **Mouse** | อุปกรณ์ชี้ตำแหน่งที่วางใต้ฝ่ามือได้พอดี |
| **Touchpad** | อุปกรณ์ชี้ตำแหน่งขนาดเล็ก แบน สี่เหลี่ยมผืนผ้า ที่ไวต่อ **แรงกดและการเคลื่อนไหว** |
| **Trackball** | อุปกรณ์ชี้ตำแหน่งที่**อยู่กับที่ (stationary)** มีลูกบอลอยู่ด้านบนหรือด้านข้าง |
| **Pointing Stick** | อุปกรณ์ชี้ตำแหน่งที่ไวต่อแรงกด รูปร่างเหมือน**ยางลบดินสอ** วางอยู่ระหว่างปุ่มบนคีย์บอร์ดของคอมพิวเตอร์พกพา |

- **Ergonomic mouse (vertical mouse)** = จัดมือให้อยู่ในท่า **"handshake"** ลดแรงกดที่ข้อมือและปลายแขน

**(3) Touch Screen** = จอแสดงผลที่ไวต่อการสัมผัส (touch-sensitive display) — ใช้ **Gesture**

**(4) Pen Input ⭐**
- ใช้ **stylus** หรือ **digital pen** แตะบนพื้นผิวเรียบเพื่อเขียน วาด หรือเลือก
- **Graphics tablet (digitizer)** = แผ่นพลาสติกอิเล็กทรอนิกส์ที่ **ตรวจจับและแปลงการเคลื่อนไหวของ stylus/digital pen เป็นสัญญาณ** ส่งไปยังคอมพิวเตอร์
- เกี่ยวข้องกับ **Handwriting Recognition**

**(5) Motion Input ⭐**
- บางครั้งเรียก **gesture recognition** — ผู้ใช้ควบคุมองค์ประกอบบนหน้าจอด้วย **air gestures**

| เซนเซอร์ | หน้าที่ |
|---|---|
| **Gyroscope** | วัดหรือรักษา **orientation และ angular velocity** |
| **Accelerometer** | วัด **proper acceleration** |
| **Magnetometer** | ให้ความสามารถแบบ **เข็มทิศ (compass)** |
| **Infrared detection** | ตรวจจับ **ตำแหน่งวัตถุในปริภูมิ 3 มิติ** |
| **Color sensor** | ตรวจจับ **สีของวัตถุ** |

- **ตัวอย่างอุปกรณ์:** Nintendo Wii, Nintendo Switch, Xbox – Kinect Sensor, Sony PlayStation Move
- **งานวิจัย tracking 4 แบบในสไลด์:** Eye Tracking (**EyeTribe**) · Forearm Tracking (**Myo**) · Hand Tracking (**Leap Motion**) · Brain Signal Tracking (**NeuroSky**)

**(6) Voice Input**
- **Voice input** = กระบวนการป้อนอินพุตโดยการพูดใส่ไมโครโฟน
- **Voice recognition (speech recognition)** = กระบวนการที่ให้คนพูดกับคอมพิวเตอร์ได้อย่างเป็นธรรมชาติในหัวข้อใดก็ได้ และเข้าใจได้อย่างแม่นยำ

**(7) Video Input ⭐**
- **นิยาม:** กระบวนการจับภาพเคลื่อนไหวเต็มรูปแบบ (full-motion images) และเก็บลงสื่อบันทึกของคอมพิวเตอร์/อุปกรณ์พกพา
- **Webcam** = กล้องวิดีโอดิจิทัลที่ให้ผู้ใช้: จับวิดีโอและภาพนิ่ง · ถ่ายทอดสดผ่านอินเทอร์เน็ต · ทำ videoconference · โทรวิดีโอ

| คำศัพท์ | นิยาม | ตัวอย่างเครื่องมือ |
|---|---|---|
| **Videoconference** | การประชุมระหว่างคนตั้งแต่ 2 คนขึ้นไปที่อยู่ห่างกันทางภูมิศาสตร์ | Microsoft Teams, Zoom, Skype, Google Meet, Jabber |
| **Webinar** | เว็บคอนเฟอเรนซ์ชนิดหนึ่ง เหมือน **สัมมนาผ่านเว็บ**; เหมาะกับสัมมนา บรรยาย เวิร์กช็อป หรือสาธิตสินค้า/บริการ | Microsoft Teams, Zoho Meeting, GoToWebinar, Zoom |
| **Gather.Town** | ซอฟต์แวร์เว็บคอนเฟอเรนซ์คล้าย Zoom แต่เพิ่ม **"ห้องเสมือน"** ที่เห็นและเดินไปมาโต้ตอบกับผู้อื่นตามตำแหน่งในห้องได้เหมือนชีวิตจริง | — |

**(8) Reading Devices ⭐⭐ (ออกสอบเยอะ)**

| อุปกรณ์ | ชื่อเต็ม | นิยาม / การใช้งาน |
|---|---|---|
| **Scanner** | — | อุปกรณ์อินพุตแบบ **light-sensing** ที่อ่านข้อความและกราฟิกที่พิมพ์ แล้วแปลผลให้อยู่ในรูปที่คอมพิวเตอร์ประมวลผลได้ |
| **Flatbed scanner** | — | ทำงานคล้ายเครื่องถ่ายเอกสาร ต่างกันที่**สร้างไฟล์ของเอกสารในหน่วยความจำแทนที่จะเป็นสำเนากระดาษ** |
| **OCR** | **Optical Character Recognition** | โซลูชันสำหรับ **ทำให้การดึงข้อมูลจากข้อความที่พิมพ์หรือเขียน** จากเอกสารสแกน/ไฟล์ภาพ เป็นอัตโนมัติ แล้วแปลงเป็นรูปแบบที่เครื่องอ่านได้ เพื่อนำไปแก้ไขหรือค้นหา |
| **OMR** | **Optical Mark Recognition** | กระบวนการจับข้อมูลที่ **มนุษย์ทำเครื่องหมาย** จากแบบฟอร์ม เช่น แบบสำรวจและข้อสอบ; ใช้อ่านแบบสอบถาม **กระดาษคำตอบปรนัยในรูปแบบพื้นที่ที่ฝนดำ** |
| **Bar code** | — | รหัสที่เครื่องอ่านได้ ในรูปของ**ตัวเลขและรูปแบบเส้นขนานที่มีความกว้างต่างกัน** พิมพ์บนและใช้ระบุสินค้า |
| **QR code** | **Quick Response code** | เก็บข้อมูลได้ทั้ง**แนวตั้งและแนวนอน** จึงบรรจุข้อมูลได้**มากกว่า bar code** |
| **RFID** | **Radio Frequency Identification** | ใช้ **สัญญาณวิทยุ** สื่อสารกับ **tag** ที่อยู่ในหรือติดกับวัตถุ; **RFID reader** อ่านข้อมูลบน tag ผ่านคลื่นวิทยุ |
| **Magstripe Reader** | — | อ่าน**แถบแม่เหล็กด้านหลังบัตร** เช่น บัตรเครดิต/เดบิต บัตรสมาชิก; เก็บข้อมูลผู้ใช้ทั้งหมด เช่น ชื่อ เลขบัญชี วันหมดอายุ รหัสประเทศ — ทั้งหมด **encoded**<br>📅 **ภายในปี 2033 บัตรเดบิต/เครดิตจะไม่มีแถบแม่เหล็กอีกเลย** ธนาคารหลายภูมิภาครวมยุโรปออกบัตรไร้แถบได้ **ตั้งแต่ปี 2024** |
| **MICR** | **Magnetic Ink Character Recognition** | อ่านข้อความที่พิมพ์ด้วย**หมึกแม่เหล็ก**; **MICR reader** แปลงอักขระ MICR เป็นรูปที่คอมพิวเตอร์ประมวลผลได้; **อุตสาหกรรมธนาคารใช้ MICR สำหรับประมวลผลเช็ค** |

### 4.3 นิยาม Output ⭐
- **Output** = ข้อมูลที่ผ่านการประมวลผลจนอยู่ในรูปที่มีประโยชน์
- **Output device** = อุปกรณ์ฮาร์ดแวร์ที่แปลงสารสนเทศให้อยู่ในรูปที่มนุษย์อ่านได้

### 4.4 Commonly Used Output Methods — 6 วิธี ⭐⭐

```
┌─────────┬─────────┬──────────────┬───────────┬──────────────────────┬─────────────────┐
│ Display │ Printer │ Audio Output │ Projector │ Interactive Whiteboard│ Game Controller │
└─────────┴─────────┴──────────────┴───────────┴──────────────────────┴─────────────────┘
```

**(1) Display ⭐**
- **Display** = อุปกรณ์เอาต์พุตที่แสดงข้อความ กราฟิก และวิดีโอด้วยภาพ
- **Monitor** = display ที่บรรจุมาเป็น **peripheral device แยกต่างหาก**

**คุณภาพของ display ขึ้นกับ 5 ปัจจัยหลัก ⭐ (ออกสอบ):**

| ปัจจัย | ความหมาย |
|---|---|
| **Resolution** | ความละเอียด |
| **Response Time** | เวลาตอบสนอง |
| **Brightness** | ความสว่าง |
| **Dot Pitch** | ระยะห่างระหว่างจุด |
| **Contrast Ratio** | อัตราส่วนความคมชัดของสีขาว-สีดำ |

**พอร์ตแสดงผล 4 ชนิด ⭐⭐ (ตารางนี้ออกสอบง่ายมาก)**

| พอร์ต | ชื่อเต็ม | รองรับสัญญาณ |
|---|---|---|
| **VGA** | Video Graphics Array | **Analog** อย่างเดียว |
| **DVI** | Digital Video Interface | **Analog และ Digital** |
| **HDMI** | High-Definition Media Interface | **Digital พร้อม digital audio signal** |
| **DisplayPort** | — | **ทางเลือกทดแทน HDMI (alternative to HDMI)** |

**โทรทัศน์:**

| | นิยาม |
|---|---|
| **DTV** | Digital Television — ผู้ใช้ตามบ้านบางครั้งใช้เป็นจอแสดงผล |
| **HDTV** | High-Definition Television — **รูปแบบที่ก้าวหน้าที่สุดของ digital television** |
| **Smart TV** | **HDTV ที่เชื่อมต่ออินเทอร์เน็ตได้ (Internet-enabled HDTV)** |

**(2) Printer ⭐⭐**
- **Printer** = ผลิตข้อความและกราฟิกบนสื่อกายภาพ
- **แบ่งเป็น 2 กลุ่มใหญ่: Nonimpact vs Impact**

| | **Nonimpact Printer** | **Impact Printer** |
|---|---|---|
| นิยาม | สร้างตัวอักษรและกราฟิกบนกระดาษ **โดยไม่สัมผัสกระดาษจริง ๆ** | สร้างตัวอักษรและกราฟิกบนกระดาษโดย **ตอกกลไกกระทบผ้าหมึก (inked ribbon) ที่สัมผัสกระดาษทางกายภาพ** |
| ตัวอย่าง | Ink-jet, Photo, Laser, All-in-one, Thermal, Dye Sublimation, Mobile, Label, Plotter, Large-format, 3D | **Dot Matrix Printer** |

**รายละเอียด Nonimpact Printer แต่ละชนิด ⭐**

| ชนิด | นิยาม / จุดจำ |
|---|---|
| **Ink-jet Printer** | สร้างตัวอักษรและกราฟิกโดย **พ่นหยดหมึกเหลวเล็ก ๆ ลงบนกระดาษ**; มีทั้งสีและขาวดำ; **วัดความเร็วเป็น ppm (pages per minute)** |
| **Photo Printer** | ผลิตภาพถ่ายคุณภาพระดับแล็บ; หลายรุ่นใช้เทคโนโลยี ink-jet; บางยี่ห้อพิมพ์จาก **กล้องดิจิทัลโดยตรง** หรือจาก **memory card** ได้ |
| **Laser Printer** | **ความเร็วสูงและคุณภาพสูง**; มีทั้งขาวดำและสี |
| **All-in-one Printer** | อุปกรณ์เดียวที่ **พิมพ์ สแกน ถ่ายเอกสาร และบางรุ่นแฟกซ์ได้**; เรียกอีกชื่อว่า **multifunction printer** |
| **Thermal Printer** | สร้างภาพโดย **ดันเข็มที่ถูกทำให้ร้อนด้วยไฟฟ้า กดลงบนกระดาษที่ไวต่อความร้อน** |
| **Dye Sublimation Printer** | เทคนิคการพิมพ์ที่ใช้ **ความร้อนถ่ายโอนสีย้อม (dye)** ลงบนวัสดุ เช่น พลาสติก บัตร กระดาษ หรือผ้า |
| **Mobile Printer** | เครื่องพิมพ์เล็ก เบา **ใช้แบตเตอรี่** ให้ผู้ใช้พกพาพิมพ์จากอุปกรณ์พกพาได้ |
| **Label Printer** | เครื่องพิมพ์เล็กที่พิมพ์บน**วัสดุกาว** ติดบนสิ่งของต่าง ๆ ได้ |
| **Plotter** | ใช้ผลิต **ภาพวาด/แบบเขียนคุณภาพสูง** |
| **Large-format Printer** | สร้างงานพิมพ์สีคุณภาพ **photo-realistic** |
| **3-D Printer** | ใช้กระบวนการ **additive manufacturing** สร้างวัตถุโดย **เติมวัสดุลงบนวัตถุสามมิติทีละชั้นแนวนอน** |

**(3) Audio Output**
- ผู้ใช้จำนวนมากต่อลำโพง surround sound เข้ากับคอมพิวเตอร์ เกมคอนโซล และอุปกรณ์พกพา เพื่อสร้างเสียงคุณภาพสูงขึ้น
- **7.1-Channel Speakers** ประกอบด้วย **Subwoofer · Center Speaker · Satellite Speakers** (📝 โน้ตชั้นเรียน: ลำโพง 7 ตัว + subwoofer 1 ตัว; subwoofer ขับเสียงความถี่ต่ำ/เสียงเบส)
- **Earbuds (earphones)** = วางอยู่ **ภายในรูหู**
- **Headphones** = ลำโพงที่ **ครอบหรือวางอยู่ด้านนอกหู**

**(4) Projector** — **Data projector** = อุปกรณ์ที่ฉายข้อความและภาพที่แสดงบนหน้าจอคอมพิวเตอร์/อุปกรณ์พกพา ไปยังจอที่ใหญ่กว่า เพื่อให้ผู้ชมเห็นภาพได้ชัดเจน

**(5) Interactive Whiteboard** — อุปกรณ์ที่ไวต่อการสัมผัส หน้าตาคล้ายกระดานไวท์บอร์ด ที่แสดงภาพจากหน้าจอคอมพิวเตอร์ที่เชื่อมต่ออยู่

**(6) Game Controller ⭐**
- **Joysticks, wheels, gamepads และ motion-sensing game controllers ถือเป็น output device ได้** เมื่อมี **force feedback**
- **Force feedback** = เทคโนโลยีที่ **ส่งแรงต้าน (resistance) กลับไปยังอุปกรณ์** เพื่อตอบสนองต่อการกระทำของผู้ใช้

### 4.5 Assistive Technology Input and Output
- **Head-mounted pointer** — ใช้ศีรษะควบคุม pointer
- **Braille printer** — พิมพ์อักษรเบรลล์

---

## 📗 Lecture 05 — Storage

### 5.1 ระดับของ Storage — 4 ระดับ ⭐⭐ (ตารางนี้ออกสอบแน่)

| | **Primary Storage** | **Secondary Storage** | **Offline Storage** | **Tertiary Storage** |
|---|---|---|---|---|
| **นิยาม** | หน่วยความจำหลักที่เก็บข้อมูลและสารสนเทศ | หน่วยความจำภายนอกที่เก็บข้อมูล **อย่างถาวร** | เรียกว่า **disconnected / removable storage** | คล้าย secondary storage แต่**เข้าถึงได้ผ่านอุปกรณ์เครือข่ายเท่านั้น** |
| **ชื่อเรียก** | เรียกว่า **"memory"** | เรียกว่า **"storage medium"** | — | — |
| **ลักษณะ** | **Volatile / Non-volatile** ได้ทั้งคู่ | **Non-volatile** | ที่จัดเก็บบนสื่อหรืออุปกรณ์ที่**ไม่ได้อยู่ใต้การควบคุมของหน่วยประมวลผล**; **ต้องถูกใส่หรือเชื่อมต่อโดยมนุษย์ก่อนคอมพิวเตอร์จึงเข้าถึงได้อีกครั้ง** | **เข้าถึงช้ายิ่งกว่า**; ใช้กลไกหุ่นยนต์เพิ่มเติมย้ายสื่อระหว่างที่เก็บระยะยาวกับไดรฟ์ที่ว่าง **โดยไม่ต้องมีมนุษย์เข้ามาเกี่ยวข้อง** |
| **ตัวอย่าง** | **RAM, ROM** | **HDD, SSD** | **CD, DVD, USB Flash Drive** | **NAS, SAN, Tape, Optical Disc** |

### 5.2 Storage Medium & Storage Device ⭐
- **Storage medium** = วัสดุกายภาพที่คอมพิวเตอร์ใช้เก็บข้อมูล สารสนเทศ โปรแกรม และแอปพลิเคชัน
- **Cloud storage** = เก็บสารสนเทศบนเซิร์ฟเวอร์บนอินเทอร์เน็ต โดย **สื่อจริงที่ใช้เก็บไฟล์นั้นโปร่งใส (transparent) ต่อผู้ใช้**
- **Storage device** = ฮาร์ดแวร์ที่บันทึกและ/หรือดึงข้อมูลไปยัง/จาก storage media

| การทำงาน | นิยาม | เทียบเท่า |
|---|---|---|
| **Read** | กระบวนการถ่ายโอนสิ่งของจาก **storage medium → memory** | **Input** |
| **Write** | กระบวนการถ่ายโอนสิ่งของจาก **memory → storage medium** | **Output** |

> ⚠️ **จุดที่มักออกสอบเป็นข้อลวง:** สไลด์ระบุชัดว่า **"It is NOT I/O device"** — Storage device **ไม่ถือเป็น I/O device** แม้การอ่านจะเทียบเท่า input และการเขียนจะเทียบเท่า output

### 5.3 ชนิดของ Storage ทั้งหมดในบทนี้ (13 ชนิด)
Internal Hard Disk · Internal Solid-State Drive · External Hard Drive · Memory Cards · USB Flash Drive · Cloud Storage · Optical Discs · Network Attached Storage Device · Magnetic Stripe Card · Smart Card · RFID Tags · NFC Tags · Film

### 5.4 Capacity — ตารางหน่วยความจุ ⭐⭐⭐ (ต้องท่องได้ทั้งตาราง)

| Storage Term | Short Form | จำนวนไบต์โดยประมาณ | จำนวนไบต์ที่แน่นอน |
|---|---|---|---|
| **Kilobyte** | KB | 1 thousand (10³) | **2¹⁰ = 1,024** |
| **Megabyte** | MB | 1 million (10⁶) | **2²⁰ = 1,048,576** |
| **Gigabyte** | GB | 1 billion (10⁹) | **2³⁰ = 1,073,741,824** |
| **Terabyte** | TB | 1 trillion (10¹²) | **2⁴⁰** |
| **Petabyte** | PB | 1 quadrillion (10¹⁵) | **2⁵⁰** |
| **Exabyte** | EB | 1 quintillion (10¹⁸) | **2⁶⁰** |
| **Zettabyte** | ZB | 1 sextillion (10²¹) | **2⁷⁰** |
| **Yottabyte** | YB | 1 septillion (10²⁴) | **2⁸⁰** |

> 🔑 **เทคนิคจำ:** เลขชี้กำลังฐาน 10 เพิ่มทีละ **3** (3,6,9,12,15,18,21,24) · เลขชี้กำลังฐาน 2 เพิ่มทีละ **10** (10,20,30,...,80)
> **K → M → G → T → P → E → Z → Y** ("**K**ing **M**ust **G**et **T**he **P**izza, **E**at **Z**ero **Y**ogurt")

### 5.5 Access Time (ของ Storage) ⭐
- **Access time วัด 2 อย่าง:**
  1. เวลาที่ storage device ใช้ **ค้นหาตำแหน่งของสิ่งของบน storage medium**
  2. เวลาที่ต้องใช้ในการ **ส่งสิ่งของจาก memory ไปยัง processor**
- ผู้ผลิตบางรายใช้ **transfer rate** แทน: **Kbps** (kilobyte per second) · **Mbps** (Megabyte per second) · **Gbps** (Gigabyte per second)

**พีระมิดความเร็ว/เวลาเข้าถึง ⭐⭐ (เรียงลำดับ — ออกสอบ)**

```
  Fast (เร็ว)  ┌─────────────────────┐
      ▲        │  RAM                │  ← Memory
      │        ├─────────────────────┤
      │        │  SSDs               │
      │        │  Hard Disks         │
  Access Time  │  USB Flash Drives   │  ← Storage
  /Transfer    │  Memory Cards       │
      │        │  Optical Discs      │
      ▼        └─────────────────────┘
  Slow (ช้า)
```

> 🔑 ลำดับจากเร็วไปช้า: **RAM > SSD > Hard Disk > USB Flash Drive > Memory Card > Optical Disc**

### 5.6 Hard Disk (HDD) ⭐⭐
- **นิยาม:** hard disk (hard disk drive, HDD) ประกอบด้วย **จานกลมแข็ง (inflexible, circular platters)** หนึ่งแผ่นหรือมากกว่า ที่ใช้ **อนุภาคแม่เหล็ก (magnetic particles)** เก็บข้อมูล คำสั่ง และสารสนเทศ

**ความจุของ HDD ขึ้นกับ 3 ปัจจัย ⭐:**
1. **จำนวน platters** ที่ hard disk มี
2. ใช้การบันทึกแบบ **longitudinal หรือ perpendicular recording**
3. **Density (ความหนาแน่น)**

**Longitudinal vs Perpendicular Recording (แผนภาพในสไลด์):**

```
Longitudinal (แนวนอน):     [NS][SN]  [NS][SN]        ← ขั้วแม่เหล็กวางตัวขนานกับผิวจาน

Perpendicular (แนวตั้ง):   N S N S N S N S N S       ← ขั้วแม่เหล็กตั้งฉากกับผิวจาน
                           S N S N S N S N S N          → เก็บข้อมูลได้หนาแน่นกว่า
```

**รายละเอียดทางเทคนิคของ HDD ⭐:**

| หัวข้อ | รายละเอียด |
|---|---|
| **Form factor** | **3.5 นิ้ว** สำหรับ **desktop** · **2.5 นิ้ว** สำหรับ **laptop** เป็นหลัก |
| **Disk read/write heads** | ชิ้นส่วนเล็ก ๆ ของไดรฟ์ที่เคลื่อนอยู่เหนือ platter<br>**Read** = แปลง**สนามแม่เหล็กของ platter → กระแสไฟฟ้า**<br>**Write** = แปลง**กระแสไฟฟ้า → สนามแม่เหล็ก** |
| **Formatting** | กระบวนการ **แบ่งดิสก์ออกเป็น tracks และ sectors** |
| **RPM** | **Revolutions Per Minute** — ใช้ช่วยกำหนด **access time** ของฮาร์ดไดรฟ์; ค่าที่พบบ่อยที่สุดในทั้งแล็ปท็อปและเดสก์ท็อปอยู่ระหว่าง **5400–7200 RPM** |
| **Head crash** | เกิดขึ้นเมื่อ **read/write head สัมผัสพื้นผิวของ platter** → ควรสำรองข้อมูล hard disk เสมอ |
| **สิ่งที่ทำให้เกิด head crash** | ระยะ clearance เล็กมาก — **เส้นผม (Hair) · ฝุ่น (Dust) · ควัน (Smoke)** ใหญ่กว่าช่องว่างนั้น |
| **Disk cache (buffer)** | ชิปหน่วยความจำบน hard disk ที่เก็บ**ข้อมูล คำสั่ง และสารสนเทศที่ถูกเข้าถึงบ่อย**<br>🔑 **ยิ่ง disk cache ใหญ่ ยิ่งทำให้ hard disk เร็วขึ้น** |
| **ข้อสรุปสำคัญ** | **ชิ้นส่วนกลไกของ hard disk ส่งผลโดยตรงต่อ access time** |

### 5.7 Solid-State Drive (SSD) ⭐⭐
- **นิยาม:** SSD คืออุปกรณ์จัดเก็บแบบ **flash memory ที่มีโปรเซสเซอร์ของตัวเอง** เพื่อจัดการการจัดเก็บ

**ข้อได้เปรียบของ SSD เหนือ HDD (magnetic) — 9 ข้อ ⭐ (ท่องให้ครบ):**

| # | ข้อได้เปรียบ | คำแปล |
|---|---|---|
| 1 | Faster access times | เข้าถึงข้อมูลเร็วกว่า |
| 2 | Faster transfer rates | อัตราถ่ายโอนเร็วกว่า |
| 3 | Quieter operation | ทำงานเงียบกว่า |
| 4 | More durable | ทนทานกว่า |
| 5 | Lighter weight | น้ำหนักเบากว่า |
| 6 | Less power consumption | กินไฟน้อยกว่า |
| 7 | Less heat generation | สร้างความร้อนน้อยกว่า |
| 8 | Longer life | อายุการใช้งานยาวกว่า |
| 9 | **Defragmentation not required** | **ไม่ต้องทำ defragment** |

### 5.8 External Hard Disk & RAID ⭐⭐
- **External hard disk** = อุปกรณ์จัดเก็บแบบตั้งอิสระที่แยกออกมา เชื่อมต่อด้วยสายเข้ากับ **USB port** หรือพอร์ตอื่นบนคอมพิวเตอร์/อุปกรณ์พกพา

**RAID = Redundant Array of Independent Disks ⭐**
- **นิยาม:** เทคโนโลยี **data storage virtualization**
- เป็นกลุ่มของ hard disk หรือ SSD ตั้งแต่ **2 ตัวขึ้นไป** ที่รวมกัน
- **วัตถุประสงค์ 3 อย่าง:** (1) **data redundancy** (2) **performance improvement** (3) **ทั้งสองอย่าง**

**เทคนิคหลัก 2 แบบ (จากสไลด์ Enterprise Storage) ⭐⭐**

| เทคนิค | แผนภาพ | หลักการ |
|---|---|---|
| **Mirroring** | `A` ↔ `A'` | **ทำสำเนาข้อมูลเหมือนกันเป๊ะ** ลงดิสก์อีกตัว → เน้น **redundancy/ความน่าเชื่อถือ** |
| **Striping** | Disk1: `A1 B1 C1`<br>Disk2: `A2 B2 C2` | **แบ่งข้อมูลกระจายเก็บลงหลายดิสก์** → เน้น **performance** |

### 5.9 Memory Card ⭐⭐
- **นิยาม:** อุปกรณ์จัดเก็บแบบ **flash memory ที่ถอดออกได้** ใส่และถอดจากช่องในคอมพิวเตอร์ อุปกรณ์พกพา หรือ card reader/writer

**ความจุสูงสุดของ SD Card แต่ละรุ่น ⭐⭐⭐ (ตัวเลขนี้ออกสอบบ่อย):**

| ชื่อเต็ม | ตัวย่อ | ความจุสูงสุด |
|---|---|---|
| **Secured Digital** | **SD** | **2 GB (Max)** |
| **Secured Digital High Capacity** | **SDHC** | **32 GB (Max)** |
| **Secure Digital Extended Capacity** | **SDXC** | **2 TB (Max)** |
| **Secure Digital Ultra Capacity** | **SDUC** | **128 TB (Max)** |

**Memory Card ชนิดอื่น:**
- **Compact Flash** (📝 โน้ตชั้นเรียน: ใหญ่กว่า นิยมใช้กับ DSLR)
- **Memory Stick** (📝 โน้ตชั้นเรียน: มักใช้กับอุปกรณ์ Sony)
- **อุปกรณ์ที่ใช้ร่วมกับ memory card:** Card Reader/Writer, Printer, Laptop, Smartphone/Tablet

### 5.10 USB Flash Drive & Cloud Storage
- **USB flash drive** = เสียบเข้ากับ **USB port** บนคอมพิวเตอร์หรืออุปกรณ์พกพา
- **Cloud storage** = บริการอินเทอร์เน็ตที่ให้พื้นที่จัดเก็บแก่ผู้ใช้คอมพิวเตอร์หรืออุปกรณ์พกพา

### 5.11 Optical Disc ⭐⭐
- **นิยาม:** แผ่นกลม แบน พกพาได้ ทำจาก **metal, plastic, and lacquer** ที่ถูก **เขียนและอ่านด้วยเลเซอร์**

**How a Laser Reads Data on an Optical Disc ⭐⭐⭐ (แผนภาพนี้ออกสอบ):**

```
                    Disc surface
        ╔═══════════════╗       ╔═══════════════╗
        ║  PIT (หลุม)   ║       ║  LAND (ราบ)   ║
        ╚═══════╤═══════╝       ╚═══════╤═══════╝
             [ Lens ]                [ Lens ]
                │  →  0                 │  →  1
          [Prism]──►[Light-sensing  [Prism]──►[Light-sensing
                       Diode]                    Diode]
                │                       │
          [Laser Diode]           [Laser Diode]
```

| ลักษณะผิว | ค่าที่อ่านได้ |
|---|---|
| **PIT** (หลุม) | **0** |
| **LAND** (ผิวราบ) | **1** |

- **องค์ประกอบในเส้นทางแสง:** Laser Diode → Lens → Disc → Prism → Light-sensing Diode

**โครงสร้างการเก็บข้อมูล ⭐:**
- Optical disc เก็บข้อมูลใน **track เดียวที่วนเป็นเกลียว (spiral) จากศูนย์กลางแผ่นออกไปยังขอบแผ่น**
- **Track ถูกแบ่งเป็น sector ขนาดเท่ากัน**

> 📝 **CD vs DVD (จากโน้ตชั้นเรียน):** CD ใช้ pit pitch ราว **800 nm** ส่วน DVD ราว **400 nm** → **ยิ่งหลุมเล็กและถี่ ยิ่งเก็บข้อมูลได้มากขึ้น**

**รูปแบบ CD และ DVD ⭐⭐ (ตารางนี้ออกสอบแน่)**

| รูปแบบ | เขียนได้กี่ครั้ง | นิยามตามสไลด์ |
|---|---|---|
| **CD-ROM** | **อ่านอย่างเดียว** | อ่านได้แต่เขียนไม่ได้ — **single-session disc** |
| **CD-R** | **เขียนได้ครั้งเดียว** | ผู้ใช้เขียนได้ครั้งเดียว **แต่ลบไม่ได้** |
| **CD-RW** | **เขียนซ้ำได้** | แผ่นแบบ **erasable multisession** |
| **DVD-ROM** | **อ่านอย่างเดียว** | แผ่นความจุสูงที่อ่านได้ แต่เขียนหรือลบไม่ได้ |
| **DVD-R / DVD+R** | **เขียนได้ครั้งเดียว** | รูปแบบ DVD-recordable ที่แข่งกัน — **WORM format** (Write Once, Read Many) เขียนได้ครั้งเดียวแต่ลบไม่ได้ |
| **DVD-RW / DVD+RW / DVD+RAM** | **เขียนซ้ำได้หลายครั้ง** | รูปแบบ DVD-rewritable ที่แข่งกัน ผู้ใช้เขียนได้หลายครั้ง |

### 5.12 Enterprise Storage, NAS, SAN ⭐⭐

**Enterprise Storage**
- **นิยาม:** ฮาร์ดแวร์ระดับองค์กรที่ให้องค์กรขนาดใหญ่จัดการและจัดเก็บข้อมูล/สารสนเทศ ด้วยอุปกรณ์ที่ออกแบบมาเพื่อ **การใช้งานหนัก (heavy use), ประสิทธิภาพสูงสุด (maximum efficiency) และความพร้อมใช้งานสูงสุด (maximum availability)**
- ใช้ **RAID** เพื่อทำสำเนาข้อมูล คำสั่ง และสารสนเทศ เพื่อ**เพิ่มความน่าเชื่อถือของข้อมูล**

**NAS vs SAN ⭐⭐ (ต้องแยกให้ออก — ออกสอบเป็นข้อลวง)**

| | **NAS (Network Attached Storage)** | **SAN (Storage Area Network)** |
|---|---|---|
| **คืออะไร** | เป็น **เซิร์ฟเวอร์ (server)** | เป็น **เครือข่ายความเร็วสูง (high-speed network)** |
| **วัตถุประสงค์เดียว** | ให้พื้นที่จัดเก็บแก่ **ผู้ใช้ คอมพิวเตอร์ และอุปกรณ์ที่ต่อกับเครือข่าย** | ให้พื้นที่จัดเก็บแก่ **เซิร์ฟเวอร์อื่น ๆ ที่ต่ออยู่ (other attached servers)** |
| **ตำแหน่งในแผนภาพ** | Client → Network → Server → NAS | Client → Network → Server → SAN → (RAID, Tape, RAID, Optical Disc) |

**Magnetic Tape System**
- **Tape** = ริบบิ้นพลาสติกเคลือบสารแม่เหล็ก ที่เก็บข้อมูลและสารสนเทศได้ปริมาณมาก
- **Tape drive** = อ่านและเขียนข้อมูล/สารสนเทศบนเทปแม่เหล็ก

### 5.13 Other Types of Storage
- **Magnetic Stripe Card** · **Smart Card** · **RFID Tag**
- **NFC (Near Field Communications) ⭐:**
  - อุปกรณ์ที่รองรับ NFC มี **NFC chip**
  - **NFC tag** ประกอบด้วย **chip และ antenna** ที่บรรจุข้อมูลที่จะส่ง
  - **NFC tag ส่วนใหญ่เป็นแบบมีกาวในตัว (self-adhesive)**
- **Film:** **Microfilm** และ **Microfiche** เก็บภาพขนาดจิ๋วของเอกสารบน **ฟิล์มม้วน (roll) หรือฟิล์มแผ่น (sheet)**

---

## 📗 Lecture 06 — Operating System

### 6.1 นิยาม & หน้าที่ของ OS ⭐⭐⭐
- **Operating System (OS)** = **ชุดโปรแกรมที่ประสานงานกิจกรรมทั้งหมดระหว่างฮาร์ดแวร์ของคอมพิวเตอร์หรืออุปกรณ์พกพา**

**หน้าที่ของ OS — 11 ข้อหลัก (+ 1 ข้อเสริม) ⭐⭐⭐ (ท่องให้ครบ! ออกสอบแน่)**

| # | หน้าที่ |
|---|---|
| 1 | **Starting and shutting down** a computer or mobile device |
| 2 | **Providing a user interface** |
| 3 | **Managing programs** |
| 4 | **Managing memory** |
| 5 | **Coordinating tasks** |
| 6 | **Configuring devices** |
| 7 | **Monitoring performance** |
| 8 | **Establishing an Internet connection** |
| 9 | **Providing File, Disk, and System Management Tools** |
| 10 | **Updating operating system software** |
| 11 | **(บาง OS)** Controlling a network **และ Administering security** |

### 6.2 (1) Starting Computers and Mobile Devices ⭐⭐⭐ (5 ขั้นตอน — ออกสอบชัวร์)

| ขั้น | รายละเอียด |
|---|---|
| **Step 1** | เมื่อเปิดเครื่อง **power supply หรือ battery ส่งกระแสไฟฟ้า** ไปยังวงจรในคอมพิวเตอร์/อุปกรณ์ |
| **Step 2** | ประจุไฟฟ้าทำให้ **processor chip รีเซ็ตตัวเอง** และค้นหา **firmware ที่บรรจุ start-up instructions** |
| **Step 3** | กระบวนการ start-up รัน **ชุดการทดสอบเพื่อตรวจสอบส่วนประกอบต่าง ๆ** — ตรวจ **buses, system clock, adapter cards, RAM chips, mouse, keyboard, drives** และตรวจว่าอุปกรณ์ต่อพ่วงเชื่อมต่อถูกต้องและทำงานได้<br>**ถ้าพบปัญหา** → เครื่องอาจ **ส่งเสียงบี๊บ (beep), แสดง error message, หรือหยุดทำงาน** ขึ้นกับความรุนแรงของปัญหา |
| **Step 4** | ถ้าทดสอบผ่าน → **kernel ของ OS** และคำสั่งที่ใช้บ่อยอื่น ๆ **ถูกโหลดจาก internal storage media เข้าสู่ memory (RAM)** |
| **Step 5** | OS ใน memory **เข้าควบคุมเครื่อง** และโหลด **system configuration information**; OS อาจตรวจสอบว่าผู้ใช้เป็นผู้ใช้ที่ถูกต้อง; สุดท้าย **user interface ปรากฏบนหน้าจอ** และ start-up applications เช่น antivirus ก็เริ่มทำงาน |

**Kernel ⭐⭐ (นิยามสำคัญ)**
- **Kernel** = **แกนกลาง (core) ของ operating system** ที่จัดการ **memory และ devices**, รักษา **internal clock**, รันโปรแกรม และจัดสรร **ทรัพยากร** เช่น อุปกรณ์ โปรแกรม แอป ข้อมูล และสารสนเทศ

| | **Memory Resident** | **Nonresident** |
|---|---|---|
| คืออะไร | **Kernel** | ส่วนอื่น ๆ ของ OS |
| ลักษณะ | **คงอยู่ใน memory ตลอดเวลาที่เครื่องทำงาน** | **อยู่บน storage medium จนกว่าจะถูกเรียกใช้** เมื่อนั้นจึงย้ายเข้า **memory (RAM)** |

**Booting ⭐⭐ (Cold vs Warm — ออกสอบ)**
- **Booting** = กระบวนการเริ่มต้นหรือรีสตาร์ตคอมพิวเตอร์/อุปกรณ์พกพา

| | **Cold Boot** | **Warm Boot** |
|---|---|---|
| **นิยาม** | เริ่มเครื่องจากสถานะที่ **ปิดสนิท (powered off completely)** | รีสตาร์ตเครื่อง **ขณะที่ยังเปิดอยู่ (remains powered on)** |
| **ความเร็ว** | ช้ากว่า | **เร็วกว่า** เพราะ**ข้ามคำสั่ง start-up บางส่วนที่เป็นส่วนหนึ่งของ cold boot** |
| **ใช้เมื่อไร** | **สงสัยว่ามีปัญหาฮาร์ดแวร์** → แนะนำให้ใช้ cold boot เพราะกระบวนการนี้**ตรวจจับและตรวจสอบอุปกรณ์ฮาร์ดแวร์ที่เชื่อมต่อ** | **โปรแกรมหรือแอปหยุดทำงาน** → warm boot มักเพียงพอ เพราะกระบวนการนี้**ล้างหน่วยความจำ (clears memory)** |

### 6.3 (2) Shutting Down Computers and Mobile Devices ⭐⭐
- ตัวเลือกด้านพลังงาน: **Shut down (ปิดเครื่อง)** · **Sleep mode** · **Hibernate mode**
- ทั้ง sleep และ hibernate ออกแบบมาเพื่อ **ประหยัดเวลาเมื่อกลับมาทำงานต่อ**

| | **Sleep Mode** | **Hibernate Mode** |
|---|---|---|
| **บันทึกเอกสาร/โปรแกรมที่เปิดอยู่ไปที่** | **RAM** | **Internal hard drive** |
| **สถานะพลังงาน** | ปิดฟังก์ชันที่ไม่จำเป็น แล้วให้เครื่องอยู่ในสถานะ **low-power state** | **ตัดไฟออกจากเครื่อง (removing power)** |
| **ความเสี่ยง** | **ถ้าไฟถูกตัดออกไปขณะอยู่ใน sleep mode งานที่ยังไม่บันทึกอาจสูญหาย** | ไม่สูญหาย เพราะเก็บลง hard drive แล้ว |

### 6.4 (3) Providing a User Interface ⭐⭐
- **User Interface (UI)** = ควบคุมว่าคุณป้อนข้อมูลและคำสั่งอย่างไร และสารสนเทศแสดงบนหน้าจออย่างไร

| ชนิด UI | นิยาม |
|---|---|
| **GUI** (Graphical User Interface) | โต้ตอบกับ **เมนูและภาพ (visual images)** โดยการ **สัมผัส ชี้ แตะ หรือคลิก** ปุ่มและวัตถุอื่น ๆ เพื่อออกคำสั่ง |
| **CLI** (Command-Line Interface) | ผู้ใช้ **พิมพ์คำสั่ง** ที่แทนด้วยคีย์เวิร์ดสั้น ๆ หรือคำย่อ (เช่น `dir` เพื่อดูไดเรกทอรีหรือรายการไฟล์) หรือกดปุ่มพิเศษบนคีย์บอร์ดเพื่อป้อนข้อมูลและคำสั่ง |
| **NUI** (Natural User Interface) | ผู้ใช้โต้ตอบกับซอฟต์แวร์ผ่าน **พฤติกรรมธรรมดาและเป็นสัญชาตญาณ**<br>**4 รูปแบบการนำไปใช้:** touch screens (touch input) · gesture recognition (motion input) · speech recognition (voice input) · virtual reality (simulations) |

### 6.5 (4) Managing Programs ⭐⭐
- วิธีที่ OS จัดการโปรแกรมส่งผลโดยตรงต่อ **ผลิตภาพ (productivity)** ของคุณ

| ประเภทตาม **จำนวนโปรแกรม** | นิยาม |
|---|---|
| **Single tasking OS** | อนุญาตให้รัน **โปรแกรม/แอปเดียวในแต่ละครั้ง**; ใช้ใน **embedded computers และอุปกรณ์พกพาบางชนิด** |
| **Multitasking OS** | **OS ส่วนใหญ่ในปัจจุบัน**; ให้โปรแกรม/แอป **ตั้งแต่ 2 ตัวขึ้นไปอยู่ใน memory พร้อมกัน** |

- เมื่อรันหลายโปรแกรมพร้อมกัน: **โปรแกรมหนึ่งอยู่ foreground ที่เหลืออยู่ background**

| ประเภทตาม **จำนวนผู้ใช้** | นิยาม |
|---|---|
| **Single user** | รองรับผู้ใช้คนเดียว (เช่น PC) |
| **Multiuser OS** | ให้ผู้ใช้ **2 คนขึ้นไปรันโปรแกรมพร้อมกัน**; **Networks, servers, และ supercomputers** ให้ผู้ใช้หลักร้อยถึงหลักพันคนเชื่อมต่อพร้อมกัน จึงใช้ multiuser OS |

### 6.6 (5) Managing Memory ⭐⭐⭐ (Virtual Memory ออกสอบแน่)
- **วัตถุประสงค์:** เพื่อ **optimize การใช้หน่วยความจำภายในของเครื่อง**
- **3 ขั้นตอนการทำงานของ OS:**
  1. **Allocate (จัดสรร)** ข้อมูลและคำสั่งไปยังพื้นที่ใน memory ขณะกำลังถูกประมวลผล
  2. **Monitor (เฝ้าติดตาม)** เนื้อหาใน memory อย่างระมัดระวัง
  3. **Release (ปล่อย)** สิ่งเหล่านั้นออกจากการเฝ้าติดตาม เมื่อโปรเซสเซอร์ไม่ต้องการแล้ว

**Virtual Memory ⭐⭐⭐ (คำศัพท์ชุดนี้ต้องแม่น)**
- เมื่อ RAM ที่ใช้ได้เหลือน้อย → เครื่องมักทำงาน **ช้าลง (sluggishly)**
- **Virtual memory** = OS **จัดสรรพื้นที่ส่วนหนึ่งของ storage medium** (เช่น hard drive หรือ USB flash drive) ให้ **ทำหน้าที่เป็น RAM เพิ่มเติม**
- ขณะใช้โปรแกรม บางส่วนอยู่ใน **physical RAM** ส่วนที่เหลืออยู่บน **hard drive ในฐานะ virtual memory**
- **virtual memory ช้ากว่า RAM** ผู้ใช้จึงอาจสังเกตว่าเครื่องช้าลงขณะใช้ virtual memory

| คำศัพท์ | นิยาม ⭐ |
|---|---|
| **Swap file** | **พื้นที่ของ hard drive ที่ใช้เป็น virtual memory** เรียกเช่นนี้เพราะมัน **สลับ (swaps/exchanges)** ข้อมูล สารสนเทศ และคำสั่ง **ระหว่าง memory กับ storage** |
| **Page** | **ปริมาณข้อมูลและคำสั่งโปรแกรมที่สามารถ swap ได้ในคราวหนึ่ง** |
| **Paging** | **เทคนิคการสลับสิ่งของไปมาระหว่าง memory กับ storage** |
| **Thrashing** | สภาวะที่ OS **ใช้เวลาส่วนใหญ่ไปกับการทำ paging แทนที่จะรันซอฟต์แวร์แอปพลิเคชัน** → ประสิทธิภาพการทำงานของคอมพิวเตอร์ลดลง |

**ทิศทางการโอนย้าย (จากโน้ตชั้นเรียน):**
1. **RAM → Hard drive** (โปรแกรมที่ใช้งานน้อยที่สุดถูกย้ายออก) → เก็บใน **swap file**
2. **Hard drive → RAM** (เมื่อต้องใช้ข้อมูลเหล่านั้นอีกครั้ง)

### 6.7 (6) Coordinating Tasks ⭐⭐
- OS **กำหนดลำดับที่ tasks จะถูกประมวลผล**
- **Task (job)** ประกอบด้วย: รับข้อมูลจาก input device · ประมวลผลคำสั่ง · ส่งสารสนเทศไปยัง output device · ถ่ายโอนสิ่งของจาก storage→memory และ memory→storage

| คำศัพท์ | นิยาม ⭐ |
|---|---|
| **Buffer** | **ส่วนหนึ่งของ memory หรือ storage ที่ใช้พักสิ่งของ** ขณะรอถูกถ่ายโอนจาก input device หรือไปยัง output device |
| **Spooling** | กระบวนการที่ **ส่งเอกสารที่จะพิมพ์ไปยัง buffer แทนที่จะส่งไปยังเครื่องพิมพ์ทันที** (OS มักใช้ buffer กับเอกสารที่พิมพ์) |
| **Queue** | **คิว** ที่เอกสารหลายฉบับต่อแถวกันอยู่ใน buffer |
| **Print spooler** | **โปรแกรมที่ดักจับเอกสารที่จะพิมพ์จาก OS แล้วนำไปวางไว้ในคิว** |

### 6.8 (7) Configuring Devices ⭐
- **Driver (device driver)** = **โปรแกรมขนาดเล็กที่บอก OS ว่าจะสื่อสารกับอุปกรณ์เฉพาะนั้นอย่างไร**
  - อุปกรณ์แต่ละชิ้นที่เชื่อมต่อกับคอมพิวเตอร์ **มีชุดคำสั่งเฉพาะของตัวเอง จึงต้องมี driver เฉพาะของตัวเอง**
  - **ต้องติดตั้ง driver ก่อนจึงจะใช้อุปกรณ์ได้**
- **Plug and Play** = **OS ตั้งค่าอุปกรณ์ใหม่โดยอัตโนมัติเมื่อคุณติดตั้งหรือเชื่อมต่อ**
  - ช่วยติดตั้งโดย **โหลด driver ที่จำเป็นโดยอัตโนมัติจากตัวอุปกรณ์** และ **ตรวจสอบความขัดแย้งกับอุปกรณ์อื่น**

### 6.9 (8)–(11) หน้าที่ที่เหลือ

| หน้าที่ | รายละเอียด |
|---|---|
| **(8) Monitoring performance** | **Performance monitor** = โปรแกรมที่ **ประเมินและรายงานสารสนเทศ** เกี่ยวกับทรัพยากรและอุปกรณ์ต่าง ๆ ของคอมพิวเตอร์ เช่น เฝ้าดู **processor, drives, network, memory usage** |
| **(9) Establishing an Internet connection** | OS มักมีวิธีสร้างการเชื่อมต่ออินเทอร์เน็ต; บาง OS มี **browser และ email program** มาให้ ใช้เว็บและสื่อสารได้ทันทีที่ตั้งค่าการเชื่อมต่อ; บางครั้งมี **firewalls** และเครื่องมืออื่นเพื่อปกป้องจาก **unauthorized intrusions และ unwanted software** |
| **(10) File, Disk, System Management Tools** | OS มักให้เครื่องมือหลากหลายที่เกี่ยวกับการจัดการคอมพิวเตอร์ อุปกรณ์ หรือโปรแกรม (ดูรายละเอียดใน Lecture 07 หัวข้อ 9) |
| **(11) Updating OS software** | หลายโปรแกรมรวมถึง OS มี **automatic update feature** ที่ให้ฟีเจอร์ใหม่หรือการแก้ไขอย่างสม่ำเสมอ<br>**การอัปเดตครอบคลุม:** แก้ program errors · ปรับปรุง functionality · ขยาย features · **เพิ่มความปลอดภัย** · แก้ไข device drivers<br>**Service pack** = ชุดอัปเดตที่ดาวน์โหลดฟรี ที่ผู้ผลิตซอฟต์แวร์ให้กับผู้ใช้ที่ **ลงทะเบียนและ/หรือ activate ซอฟต์แวร์แล้ว** |

### 6.10 (12) Controlling a Network ⭐
- บาง OS ออกแบบมาให้ทำงานกับ **server บนเครือข่าย**; multiuser OS เหล่านี้ให้ผู้ใช้หลายคน **แชร์เครื่องพิมพ์ การเข้าถึงอินเทอร์เน็ต ไฟล์ และโปรแกรม**
- **Network administrator** = ผู้ดูแลการดำเนินงานเครือข่าย ใช้ **server operating system** เพื่อ **เพิ่มและลบผู้ใช้ คอมพิวเตอร์ และอุปกรณ์อื่นเข้า/ออกจากเครือข่าย**
- **Administrator account** = ผู้ดูแลระบบและเจ้าของเครื่อง มีบัญชีที่ทำให้ **เข้าถึงไฟล์และโปรแกรมทั้งหมด ติดตั้งโปรแกรม และกำหนดการตั้งค่าที่ส่งผลต่อผู้ใช้ทุกคน** บนคอมพิวเตอร์ อุปกรณ์ หรือเครือข่าย

| คำศัพท์ | นิยาม |
|---|---|
| **Permissions** | กำหนดว่า **ใครเข้าถึงทรัพยากรใดได้ และเข้าถึงได้เมื่อไร** |
| **User account** | ทำให้ผู้ใช้ **sign in หรือเข้าถึงทรัพยากร** บนเครือข่ายหรือคอมพิวเตอร์ |
| **User name (user ID)** | **ระบุตัวตนผู้ใช้เฉพาะราย** |
| **Password** | **ชุดอักขระส่วนตัวที่ผูกกับ user name** |

### 6.11 Type of Operating Systems — Compatibility ⭐⭐ (มักออกเป็นข้อลวง)

| | **Backward Compatible** | **Upward Compatible** |
|---|---|---|
| **ใครมีคุณสมบัตินี้** | **OS เวอร์ชันใหม่** | **Application (แอปพลิเคชัน)** |
| **นิยาม** | เวอร์ชันใหม่ของ OS **มักจะ backward compatible** = **รู้จักและทำงานกับแอปที่เขียนสำหรับ OS เวอร์ชันเก่ากว่าได้** | แอปพลิเคชัน **อาจจะหรืออาจจะไม่** upward compatible = **อาจรันหรืออาจไม่รันบน OS เวอร์ชันใหม่** |

### 6.12 Desktop Operating Systems ⭐⭐

**Windows**
- **กลางทศวรรษ 1980s** Microsoft พัฒนา Windows เวอร์ชันแรก ซึ่งให้ **graphical user interface**
- **Windows 1:** ออก **พฤศจิกายน 1985** เป็นความพยายามจริงจังครั้งแรกของ Microsoft ในการทำ GUI แบบ **16-bit**; นำโดย **Bill Gates**; รันอยู่บน **MS-DOS** ซึ่งใช้ **command-line input**
- **Windows 11:** เปิดตัวสู่สาธารณะ **5 ตุลาคม 2021**
- **Windows 11 version 25H2 (2025 Update):** ออก **30 กันยายน 2025**
- **Windows 11 version 26H1 (ARM-optimized):** ออก **10 กุมภาพันธ์ 2026**

**ฟีเจอร์ของ Windows เวอร์ชันล่าสุด (ตามสไลด์):**
- ใช้ **tiles** เพื่อเข้าถึงแอป · มี **desktop interface** · รองรับอินพุตแบบ **touch, mouse, keyboard**
- มี Email app, calendar app, browser (Internet Explorer)
- ซิงก์ภาพ ไฟล์ และการตั้งค่ากับ **OneDrive** (cloud server ของ Microsoft)
- ความปลอดภัยที่เพิ่มขึ้นผ่าน **antivirus, firewall, automatic updates**
- **Windows Store** ให้ซื้อแอปเพิ่ม

**Mac OS**
- ออกในปี **1984 พร้อมคอมพิวเตอร์ Macintosh**
- มีชื่อเสียงเรื่อง **ความง่ายในการใช้งาน (ease of use)** และเป็น **ต้นแบบ (model) ให้กับ GUI ใหม่ ๆ ส่วนใหญ่ที่พัฒนาสำหรับระบบที่ไม่ใช่ Macintosh**
- **macOS 26.6 Tahoe** — ออกกรกฎาคม 2026 (คาดว่า macOS 27 กันยายน 2026); **iOS 26.6** เป็นระบบ multitasking (คาด iOS 27 ออกภายในปี 2026)

**ฟีเจอร์เวอร์ชันล่าสุด (iOS/macOS 26.6):**

| ฟีเจอร์ | รายละเอียด |
|---|---|
| **Apple Intelligence** | ช่วยเขียน/สรุปข้อความ, สร้าง Genmoji/ภาพ, Siri โฉมใหม่เข้าใจบริบทดีขึ้น |
| **Visual Intelligence** | ใช้กล้องสแกนวิเคราะห์สถานที่ พืช สัตว์ และข้อมูลจากใบปลิว |
| **Live Translation** | แปลภาษาเรียลไทม์ในข้อความ สายโทรศัพท์ FaceTime และ AirPods |
| **Phone & Messages** | สรุปเสียงคอล/วอยซ์เมล, คัดกรองสายอัตโนมัติ, สร้างโพล, ใส่พื้นหลังแชต |
| **Photos & Notes** | ลบวัตถุในภาพ (Clean Up), ค้นหาภาพด้วยคำพูด, จัด/ถอดสคริปต์ลายมือในโน้ต |
| **Calculator** | เพิ่ม "Math Notes" คำนวณสมการและวาดกราฟจากลายมือ |
| **Accessibility** | คำบรรยายเสียงสด (Live Captions) และตรวจจับข้อความ/ฉากรอบตัว |

**องค์ประกอบหน้าจอ macOS (จากภาพสไลด์ — อาจออกสอบ):**

| องค์ประกอบ | หน้าที่ |
|---|---|
| **Apple menu** | มีคำสั่งที่ใช้ได้เสมอ |
| **Menu bar** | ชื่อเมนูปรากฏบนแถบนี้ |
| **Notifications** | คลิกเพื่อแสดง |
| **Close button** | ปิดหน้าต่าง |
| **Zoom button** | สลับขนาดหน้าต่าง |
| **Desktop** | แสดงหน้าต่าง โฟลเดอร์ และไอคอน |
| **Dock** | มีไอคอนสำหรับ **รันแอป แสดงหน้าต่างที่ย่อไว้ และเข้าถึงเอกสาร** |
| **Launchpad** | ปรากฏเมื่อกด **ปุ่ม F4**; แสดงไอคอนแอป; **Dock ยังคงปรากฏใน Launchpad** |

**UNIX ⭐⭐**
- **multitasking OS** ที่พัฒนาใน **ต้นทศวรรษ 1970s** โดยนักวิทยาศาสตร์ที่ **Bell Laboratories**
- **Bell Labs (บริษัทลูกของ AT&T) ถูกห้ามส่งเสริม UNIX ในตลาดเชิงพาณิชย์อย่างจริงจัง เพราะกฎระเบียบของรัฐบาลกลาง (federal regulations)**
- Bell Labs จึงให้สิทธิ์ (license) UNIX **ในราคาต่ำแก่วิทยาลัยและมหาวิทยาลัยจำนวนมาก** ทำให้ UNIX ได้รับความนิยมอย่างกว้างขวางในหมู่นักศึกษา
- บางเวอร์ชันมี **CLI** แต่ **ส่วนใหญ่มี GUI**

**Linux ⭐⭐**
- เปิดตัวในปี **1991**; เป็น **multitasking UNIX-based OS** ที่นิยม รันบน PC เซิร์ฟเวอร์ และอุปกรณ์หลากหลาย
- นอกจาก OS พื้นฐาน ยังมี **เครื่องมือฟรีและภาษาโปรแกรมมิ่งจำนวนมาก**
- **ไม่ใช่ proprietary software** เหมือน OS อื่นที่กล่าวมา — **Linux เป็น open source software** = **โค้ดถูกให้ไว้เพื่อการใช้ การแก้ไข และการเผยแพร่ต่อ**
- โปรแกรมเมอร์จำนวนมากอุทิศเวลาแก้ไขและเผยแพร่ต่อ ทำให้เป็น **UNIX-based OS ที่ได้รับความนิยมสูงสุด**

**Chrome OS ⭐**
- แนะนำโดย **Google**; เป็น **Linux-based OS** ที่ออกแบบมาเพื่อทำงานกับ **web apps เป็นหลัก**
- แอปมีให้ผ่าน **Chrome Web Store**; ข้อมูลเก็บบน **Google Drive**
- **Chromebook** = แล็ปท็อปเฉพาะที่รัน Chrome OS · **Chromebox** = เดสก์ท็อปเฉพาะที่รัน Chrome OS
- โดยทั่วไปใช้ **SSD** เป็น internal storage; เพราะทำงานกับ web apps เป็นหลัก จึง **ไม่ต้องการความจุจัดเก็บภายในมากเท่า desktop OS อื่น ๆ**

**Server Operating System**
- เป็น **multiuser OS ที่จัดระเบียบและประสานงานว่าผู้ใช้หลายคนเข้าถึงและแชร์ทรัพยากรบนเครือข่ายอย่างไร**
- 📝 ตัวอย่างจากโน้ต: Windows Server, OS X Server, UNIX, Linux

### 6.13 Mobile Operating Systems ⭐⭐

**Android**
- **Linux-based mobile OS ออกแบบโดย Google** — เป็น **open source** ผู้ผลิตหลายรายจึงปรับ UI และซอฟต์แวร์ได้เอง
- 📝 คุณสมบัติจากโน้ต: Google Play, Google Drive, Face recognition, NFC, Speech Output, Health
- **ชื่อเวอร์ชัน (เรียงตามลำดับ):** Cupcake (1.5) → Donut (1.6) → Eclair (2.0–2.1) → Froyo (2.2) → Gingerbread (2.3) → Honeycomb (3.0–3.2) → Ice Cream Sandwich (4.0) → Jelly Bean (4.1–4.3) → KitKat (4.4) → Lollipop (5.0–5.1) → Marshmallow (6.0) → Nougat (7.0–7.1) → Oreo (8.0–8.1) → Pie (9.0) → Android 10, 11, 12, 13, 14, 15…
- **Android 17 — ออก 16 มิถุนายน 2026 (เวอร์ชันล่าสุด)**

**iOS**
- เดิมชื่อ **iPhone OS**; พัฒนาโดย **Apple**; เป็น **proprietary mobile OS ที่สร้างมาเฉพาะสำหรับอุปกรณ์ Apple**
- **อุปกรณ์ที่รองรับ:** iPhone, iPod Touch, iPad
- **ฟีเจอร์เฉพาะ:**
  - **Siri** — แอปรู้จำเสียง ให้พูดคำสั่งหรือคำถาม แล้วตอบสนองด้วยการกระทำหรือเสียงพูด
  - **Apple Pay** — ที่เก็บรวมศูนย์ที่ปลอดภัยสำหรับบัตรเครดิต/เดบิต คูปอง บอร์ดดิ้งพาส บัตรสะสมแต้ม และบัญชีชำระเงินมือถือ
  - **iCloud** — ซิงก์เมล ปฏิทิน รายชื่อ และอื่น ๆ
  - **iTunes Store** — เข้าถึงเพลง หนังสือ พอดแคสต์ ริงโทน และภาพยนตร์
  - รวมเข้ากับ **iPod** เพื่อเล่นเพลง วิดีโอ และสื่ออื่น
  - ปรับปรุงการเชื่อมต่อกับอุปกรณ์อื่นที่รัน **Mac OS**
  - **Mac App Store** — เข้าถึงแอปเพิ่มเติมและการอัปเดตซอฟต์แวร์
- **iPadOS 26 — ออก 27 กรกฎาคม 2026**

**Windows Phone ⭐**
- พัฒนาโดย **Microsoft**; เป็น **proprietary mobile OS** ที่รันบนสมาร์ตโฟนบางรุ่น
- เป็น **ตระกูล OS มือถือที่ยุติการพัฒนาแล้ว (discontinued)** สร้างมาเป็น**ผู้สืบทอดแทน Windows Mobile และ Zune**
- มี **user interface ใหม่ที่มาจาก Metro design language**
- **ฟีเจอร์:**
  - ซิงก์ภาพ ไฟล์ และการตั้งค่ากับ **OneDrive**
  - ใช้โทรศัพท์เป็น **รีโมตควบคุมโทรทัศน์**
  - เข้าถึงแคตตาล็อกเพลง วิดีโอ พอดแคสต์ระดับโลก หรือฟังเพลง iTunes
  - **Geofencing** — ให้โทรศัพท์ **ส่งหรือรับการแจ้งเตือนเมื่อคุณเข้าหรือออกจากพื้นที่ทางภูมิศาสตร์ที่กำหนด**
  - **Windows Phone Store** — เข้าถึงแอปเพิ่มและอัปเดต
  - **Wallet app** — ที่เก็บรวมศูนย์สำหรับคูปอง บัตรเครดิต บัตรสะสมแต้ม และการเป็นสมาชิก
- **📅 มกราคม 2019** Microsoft ประกาศว่า **การสนับสนุน Windows 10 Mobile จะสิ้นสุด 10 ธันวาคม 2019** และผู้ใช้ควร **ย้ายไปใช้ iOS หรือ Android**

---

## 📗 Lecture 07 — Programs and Apps

### 7.1 Programs, Apps, and Operating System ⭐⭐

| คำศัพท์ | นิยาม |
|---|---|
| **Program (Software)** | **ชุดคำสั่งที่เกี่ยวข้องกัน จัดระเบียบเพื่อวัตถุประสงค์ร่วมกัน ที่บอกคอมพิวเตอร์ว่าต้องทำงานอะไรและทำอย่างไร** |
| **Application (App / Application software)** | ประกอบด้วยโปรแกรมที่ **ออกแบบมาเพื่อทำให้ผู้ใช้มีผลิตภาพมากขึ้น และ/หรือ ช่วยผู้ใช้ในงานส่วนตัว** |
| **Operating System** | ชุดโปรแกรมที่ประสานกิจกรรมทั้งหมดระหว่างฮาร์ดแวร์<br>➡️ **OS จึงทำหน้าที่เป็น interface ระหว่าง (1) ผู้ใช้ (2) แอปพลิเคชันและโปรแกรมอื่น และ (3) ฮาร์ดแวร์** |

### 7.2 Obtaining Software — 8 ประเภท ⭐⭐⭐ (ตารางนี้ออกสอบแน่นอน)

| ประเภท | ลิขสิทธิ์ | ค่าใช้จ่าย | นิยามตามสไลด์ |
|---|---|---|---|
| **Retail software** | มีลิขสิทธิ์ (copyrighted) | ซื้อ | ซอฟต์แวร์ที่ **ผลิตจำนวนมาก (mass-produced)** ตอบสนองความต้องการของผู้ใช้หลากหลาย ไม่ใช่แค่ผู้ใช้/บริษัทเดียว |
| **Custom software** | — | **แพงกว่า retail** | ทำงานเฉพาะสำหรับ **ธุรกิจหรืออุตสาหกรรมหนึ่ง ๆ** (ซอฟต์แวร์แบบว่าจ้างทำ) |
| **Web app** | — | — | แอปที่ **เก็บอยู่บน web server** และเข้าถึงผ่าน **browser** |
| **Mobile app** | — | — | แอปที่คุณ **ดาวน์โหลดจาก app store (marketplace)** ของอุปกรณ์พกพา หรือที่อื่นบนอินเทอร์เน็ต ลงสมาร์ตโฟน/อุปกรณ์พกพา |
| **Mobile web app** | — | — | **web app ที่ปรับให้แสดงผลใน browser บนอุปกรณ์พกพา** ไม่ว่าจะขนาดหรือแนวจอใด; นักพัฒนาหลายรายเลือกส่งผ่านเว็บเพราะ **ไม่ต้องสร้างเวอร์ชันแยกสำหรับ app store ของแต่ละอุปกรณ์**; ใช้ **responsive design** = แอปแสดงผลถูกต้องบนคอมพิวเตอร์หรืออุปกรณ์ใดก็ได้ |
| **Shareware** | **มีลิขสิทธิ์** | **แจกฟรีช่วงทดลอง** | ซอฟต์แวร์มีลิขสิทธิ์ที่แจกจ่ายโดยไม่คิดเงิน **สำหรับช่วงทดลองใช้**; ถ้าใช้ต่อหลังหมดช่วงนั้น ต้องส่งเงินให้ผู้พัฒนา หรืออาจถูกเรียกเก็บเงินอัตโนมัติหากไม่ยกเลิกภายในเวลาที่กำหนด |
| **Freeware** | **มีลิขสิทธิ์ — ผู้ให้ยังสงวนสิทธิ์ทั้งหมด** | **ฟรี** | ซอฟต์แวร์มีลิขสิทธิ์ที่บุคคลหรือบริษัทให้ **โดยไม่คิดเงิน** โดย **ยังคงสงวนสิทธิ์ทั้งหมดในซอฟต์แวร์นั้น** |
| **Open source software** | ไม่มีข้อจำกัดจากผู้ถือลิขสิทธิ์เรื่องการแก้ไข/เผยแพร่ | — | ซอฟต์แวร์ที่ให้มาเพื่อ **การใช้ การแก้ไข และการเผยแพร่ต่อ**; **ไม่มีข้อจำกัดจากผู้ถือลิขสิทธิ์** เรื่องการแก้ไขคำสั่งภายในและการเผยแพร่ต่อ |
| **Public-domain software** | **ไม่มีข้อจำกัดลิขสิทธิ์เลย** | ฟรี | ซอฟต์แวร์ที่ **บริจาคให้สาธารณะใช้ และไม่มีข้อจำกัดทางลิขสิทธิ์** |

> ⚠️ **จุดสับสนที่ออกสอบบ่อย:** **Freeware ยังมีลิขสิทธิ์** (แจกฟรีแต่แก้ไขไม่ได้) ต่างจาก **Open source** (แก้ไขและเผยแพร่ต่อได้) และ **Public-domain** (ไม่มีลิขสิทธิ์เลย)

### 7.3 Productivity Applications ⭐⭐
- **นิยาม:** ช่วยให้คุณมี **ประสิทธิผล (effective) และประสิทธิภาพ (efficient)** มากขึ้นในกิจกรรมประจำวันที่ทำงาน โรงเรียน และบ้าน

**13 ประเภทของ Productivity Applications (ตามสไลด์):**
Word processing · Presentation · Spreadsheet · Database · Note taking · Calendar and contact management · Project management · Accounting · Personal finance · Legal · Tax preparation · Document management · Enterprise computing

**Developing Projects — 5 ขั้นตอน ⭐:**

```
Create a project → Edit a project → Format a project → Save a project → Distribute a project
```

**รายละเอียดแต่ละประเภท ⭐⭐**

| # | แอป | นิยาม / คำศัพท์สำคัญ |
|---|---|---|
| **4.1** | **Word Processing** | (word processor) แอปที่ให้ผู้ใช้ **สร้างและจัดการเอกสารที่ประกอบด้วยข้อความเป็นหลัก และบางครั้งมีกราฟิก**<br>**ข้อได้เปรียบหลัก: ทำให้ผู้ใช้เปลี่ยนคำที่เขียนไว้ได้ง่าย**<br>ตัวอย่างฟีเจอร์: เปลี่ยน font, size, color, ใส่ special effects, จัดข้อความแบบ newspaper-style columns |
| **4.2** | **Presentation** | แอปที่ให้ผู้ใช้ **สร้างสื่อช่วยนำเสนอ (visual aids)** เพื่อสื่อสารความคิด ข้อความ และสารสนเทศต่อกลุ่มคน; ดูเป็น **slides (slide show)** บนจอใหญ่หรือจอฉาย |
| **4.3** | **Spreadsheet** ⭐ | แอปที่ให้ผู้ใช้ **จัดระเบียบข้อมูลเป็นคอลัมน์และแถว และคำนวณกับข้อมูล**<br>**Worksheet** = คอลัมน์และแถวเหล่านี้รวมกัน<br>**Cell** = จุดตัดของคอลัมน์และแถว (เช่น จุดตัดคอลัมน์ B แถว 4 = **cell B4**)<br>**Formula** = คำนวณกับข้อมูลใน worksheet และแสดงค่าผลลัพธ์ในเซลล์ (มักเป็นเซลล์ที่มีสูตรอยู่) — ผู้ใช้เขียนเองได้<br>**Function** = **สูตรที่ถูกกำหนดไว้ล่วงหน้า (predefined formula)** สำหรับการคำนวณทั่วไป เช่น **`=SUM(B9:B16)`**<br>**ฟีเจอร์ทรงพลัง:** **recalculate** ส่วนที่เหลือของ worksheet โดยอัตโนมัติเมื่อข้อมูลในเซลล์เปลี่ยน<br>**Charting** = แสดงข้อมูลในรูปกราฟิก เช่น bar chart หรือ pie chart |
| **4.4** | **Database** ⭐ | **Database** = การรวบรวมข้อมูลที่จัดระเบียบในลักษณะที่ **ให้เข้าถึง เรียกคืน และใช้ข้อมูลนั้นได้**<br>**Database software (DBMS – Database Management System)** = แอปที่ให้ผู้ใช้ **สร้าง เข้าถึง และจัดการฐานข้อมูล**; เพิ่ม เปลี่ยน ลบข้อมูล; เรียงและดึงข้อมูล; สร้าง **forms และ reports**<br>**โครงสร้าง:** ฐานข้อมูลประกอบด้วย **tables** จัดเป็นแถวและคอลัมน์<br>**Record** = **แต่ละแถว** — บรรจุข้อมูลของรายการหนึ่ง ๆ (มักเป็นคน สินค้า วัตถุ หรือเหตุการณ์)<br>**Field** = **แต่ละคอลัมน์** — บรรจุ **หมวดข้อมูลเฉพาะ (specific category of data)** ภายใน record |
| **4.5** | **Note Taking** | แอปที่ให้ผู้ใช้ป้อน **ข้อความพิมพ์ ความเห็นเขียนมือ ภาพวาด สเก็ตช์ ภาพถ่าย และลิงก์ ที่ตำแหน่งใดก็ได้บนหน้า** แล้วบันทึกหน้านั้นเป็นส่วนหนึ่งของ **notebook**; บางตัวซิงก์โน้ตขึ้น **cloud**; หลายตัวมีฟีเจอร์ **calendar**<br>ตัวอย่าง: **Microsoft OneNote, Apple Notes** |
| **4.6** | **Calendar and Contact Management** | แอปที่ช่วย **จัดระเบียบปฏิทิน ติดตามรายชื่อผู้ติดต่อ และแบ่งปันสารสนเทศนี้กับผู้ใช้อื่น** ที่ดูได้บนคอมพิวเตอร์และอุปกรณ์พกพา; ให้บุคคลและ **workgroups** จัดระเบียบ ค้นหา ดู และแบ่งปันข้อมูลนัดหมายและผู้ติดต่อได้ง่าย<br>ตัวอย่าง: **Google Calendar, Apple Calendar** |
| **4.7** | **Software Suite** ⭐ | **การรวบรวมแอปพลิเคชันที่เกี่ยวข้องกันหลายตัว ที่มีให้ใช้ด้วยกันเป็นหน่วยเดียว**<br>Productivity suite โดยทั่วไปมีอย่างน้อย: **word processing, presentation, spreadsheet, email**<br>**ตัวอย่างและไทม์ไลน์:** 2011 Microsoft Office 365 → 2020 **Microsoft 365** · 2006 Google Apps → G Suite → 2020 **Google Workspace** · 2013 Adobe Creative Suite (CS) → **Adobe Creative Cloud (CC)** |
| **4.8** | **Project Management** ⭐ | แอปที่ให้ผู้ใช้ **วางแผน จัดตาราง ติดตาม และวิเคราะห์เหตุการณ์ ทรัพยากร และต้นทุนของโครงการ**; ช่วยจัดการ **project variables** เพื่อทำโครงการ **ให้เสร็จตรงเวลาและอยู่ในงบประมาณ**<br>ตัวอย่าง: **Microsoft Project** (📝 โน้ตเพิ่ม: Trello, Asana, Slack, Jira) |
| **4.9** | **Accounting** | แอปที่ช่วยธุรกิจทุกขนาด **บันทึกและรายงานธุรกรรมทางการเงิน**<br>กิจกรรมที่ทำได้: **general ledger (บัญชีแยกประเภท), accounts receivable (ลูกหนี้), accounts payable (เจ้าหนี้), purchasing (การซื้อ), invoicing (ใบสั่งซื้อ/ใบแจ้งหนี้), payroll (เงินเดือน)**<br>ส่วนใหญ่รองรับ **online credit checks, bill payment, direct deposit, payroll services** |
| **4.10** | **Personal Finance** | **แอปบัญชีแบบง่าย** ที่ช่วยผู้ใช้ตามบ้านและสำนักงานขนาดเล็ก: **ปรับสมุดเช็คให้ตรง (balance checkbooks), จ่ายบิล, ติดตามรายรับ-รายจ่ายส่วนตัว, ตรวจสอบยอดคงเหลือ, โอนเงิน, ติดตามการลงทุน, ประเมินแผนการเงิน**<br>ช่วยระบุว่าคุณใช้เงินที่ไหนและเพื่ออะไร<br>ตัวอย่าง: **Quicken, Microsoft Money** |
| **4.11** | **Legal** | แอปที่ช่วยใน **การเตรียมเอกสารทางกฎหมาย** และให้ข้อมูลกฎหมายแก่บุคคล ครอบครัว และธุรกิจขนาดเล็ก<br>ให้ **สัญญาและเอกสารมาตรฐาน** ที่เกี่ยวกับการซื้อ ขาย เช่าทรัพย์สิน; การวางแผนมรดก; การสมรสและการหย่า; และการเตรียม **พินัยกรรม (will) หรือ living trust** |
| **4.12** | **Tax Preparation** | แอปที่ **นำทางบุคคล ครอบครัว หรือธุรกิจขนาดเล็กผ่านกระบวนการยื่นภาษีระดับสหพันธรัฐและระดับรัฐ**; **พยากรณ์ภาระภาษี (tax liability)** และเสนอเคล็ดลับประหยัดภาษี; หลังตอบคำถามชุดหนึ่งและกรอกแบบฟอร์มพื้นฐาน ซอฟต์แวร์จะสร้างและวิเคราะห์แบบฟอร์มภาษีเพื่อ **ค้นหาข้อผิดพลาดที่อาจพลาดไปและโอกาสหักลดหย่อน** |
| **4.13** | **Document Management** ⭐ | แอปที่ให้วิธี **แบ่งปัน แจกจ่าย และค้นหาเอกสาร** โดย **แปลงให้อยู่ในรูปแบบที่ผู้ใช้ใด ๆ ก็ดูได้**<br>เอกสารที่แปลงแล้ว **สะท้อนหน้าตาของเอกสารต้นฉบับ** ดูและพิมพ์ได้ **โดยไม่ต้องมีซอฟต์แวร์ที่สร้างเอกสารต้นฉบับ**<br>บางตัวให้ผู้ใช้ **แก้ไขเนื้อหาและเพิ่มความเห็น** ลงในเอกสารที่แปลงแล้ว<br>**รูปแบบไฟล์ภาพอิเล็กทรอนิกส์ที่นิยม: PDF (Portable Document Format) พัฒนาโดย Adobe Systems** |
| **4.14** | **Enterprise Computing** ⭐ | องค์กรขนาดใหญ่ (**enterprise**) ต้องการโซลูชันคอมพิวเตอร์พิเศษเพราะ **ขนาดและการกระจายทางภูมิศาสตร์**<br>องค์กรทั่วไปประกอบด้วยแผนก ศูนย์ และฝ่ายที่หลากหลาย — รวมเรียกว่า **functional units**<br>**ซอฟต์แวร์ตาม functional unit (9 กลุ่มตามสไลด์):** Human resources · Accounting · Engineering or product development · Manufacturing · Marketing · Sales · Distribution · Customer service · Software for information technology staff |

### 7.4 Graphics and Media Applications ⭐⭐

| # | แอป | นิยาม |
|---|---|---|
| **5.1** | **CAD** (Computer-Aided Design) | แอปที่ช่วยผู้เชี่ยวชาญและนักออกแบบใน **การสร้างแบบและแบบจำลองทางวิศวกรรม สถาปัตยกรรม และวิทยาศาสตร์**; โปรแกรม CAD สามมิติให้นักออกแบบ **หมุนแบบวัตถุ 3 มิติเพื่อดูจากมุมใดก็ได้** (📝 ตัวอย่าง: AutoCAD) |
| **5.2** | **Desktop Publishing (DTP)** | แอปที่ให้นักออกแบบ **สร้างสิ่งพิมพ์ที่ซับซ้อนซึ่งมีข้อความ กราฟิก และสีหลายสี**<br>DTP ระดับมืออาชีพเหมาะกับงานสีคุณภาพสูง เช่น **ตำราเรียน จดหมายข่าวองค์กร เอกสารการตลาด แคตตาล็อกสินค้า และรายงานประจำปี**<br>พิมพ์ที่เครื่องพิมพ์สี, ส่งโรงพิมพ์มืออาชีพ, หรือโพสต์บนเว็บในรูปแบบที่คนไม่มี DTP ก็ดูได้ (📝 ตัวอย่าง: Adobe InDesign) |
| **5.3** | **Paint / Image Editing** | **Paint software (illustration software)** = ให้ผู้ใช้ **วาดภาพ รูปทรง และกราฟิกอื่น** ด้วยเครื่องมือบนจอ เช่น **pen, brush, eyedropper, paint bucket**<br>**Image editing software** = มีความสามารถของ paint software **บวกกับ** ความสามารถ **ปรับปรุงและแก้ไขภาพถ่ายและภาพที่มีอยู่แล้ว**<br>การแก้ไขรวมถึง: ปรับ/เพิ่มสีภาพ, ใส่เอฟเฟกต์พิเศษ เช่น เงาและแสงเรือง, สร้างแอนิเมชัน, และ **image stitching** (รวมภาพหลายภาพเป็นภาพใหญ่ภาพเดียว)<br>ตัวอย่าง: **Microsoft Paint, SketchUp (by Trimble)** |
| **5.4** | **Photo Editing & Photo Management** | **Photo editing software** = image editing ชนิดหนึ่งที่ให้ **แก้ไขและปรับแต่งภาพถ่ายดิจิทัล**<br>ทำได้: **retouch photos, crop images, remove red-eye, erase blemishes, restore aged photos, add special effects, enhance image quality, change image shapes, color-correct, straighten, remove/rearrange objects, add layers**<br>สไลด์เน้น: **Adjust sharpness** และ **Adjust contrast**<br>**Photo management software** = **ดู จัดระเบียบ เรียง ทำแคตตาล็อก พิมพ์ และแบ่งปันภาพถ่ายดิจิทัล**; บริการเก็บภาพออนไลน์หลายแห่งให้สร้าง **scrapbooks**<br>ตัวอย่าง: **ACDSee Photo Studio Standard 2018, Flickr** |
| **5.5** | **Video & Audio Editing** | **Video editing software** = ให้มืออาชีพ **แก้ไขส่วนหนึ่งของวิดีโอ เรียกว่า clip**; ลดความยาว clip, จัดลำดับ clip ใหม่, ใส่เอฟเฟกต์พิเศษ เช่น คำที่เคลื่อนผ่านจอ; **โดยทั่วไปมีความสามารถแก้ไขเสียงด้วย**<br>**Audio editing software** = ให้ผู้ใช้ **แก้ไข audio clips, ผลิตซาวด์แทร็กคุณภาพสตูดิโอ และใส่เสียงเข้ากับ video clips**<br>ตัวอย่าง: **Adobe Premiere Pro, Vegas Pro, Final Cut Pro** (📝 audio: Audacity) |
| **5.6** | **Multimedia & Website Authoring** | **Multimedia authoring software** = ให้ผู้ใช้ **รวมข้อความ กราฟิก เสียง วิดีโอ และแอนิเมชันไว้ในแอปพลิเคชันแบบโต้ตอบ**; ควบคุมตำแหน่งของข้อความและภาพ และ **ระยะเวลาของเสียง วิดีโอ และแอนิเมชัน**<br>**Website authoring software** = ช่วยผู้ใช้ **ทุกระดับทักษะสร้างเว็บเพจที่เกี่ยวข้องกัน** ซึ่งมีกราฟิก วิดีโอ เสียง แอนิเมชัน เอฟเฟกต์พิเศษพร้อมเนื้อหาแบบโต้ตอบ และโพสต์บล็อก; หลายโปรแกรมยังให้ **จัดระเบียบ จัดการ และดูแลเว็บไซต์**<br>ตัวอย่าง: **Google Sites, Wix, WordPress** |
| **5.7** | **Media Player** | โปรแกรมที่ให้คุณ **ดูภาพและแอนิเมชัน ฟังเสียง และดูไฟล์วิดีโอ** บนคอมพิวเตอร์หรืออุปกรณ์พกพา<br>หัวใจของ Media Player คือ **music library ที่มีฟีเจอร์ครบ** ให้เรียกดูและเล่นเพลงได้เร็ว รวมถึง **สร้างและจัดการ playlists**; เนื้อหาในโฟลเดอร์เพลงและวิดีโอบนเครื่องจะปรากฏใน library โดยอัตโนมัติ |

### 7.5 Personal Interest Applications ⭐
- โปรแกรมส่วนใหญ่ในหมวดนี้ **ราคาไม่แพง หลายตัวฟรี**; บางแอปเน้นบริการเดียว บางแอปให้หลายบริการในแอปเดียว

| ประเภท | ตัวอย่างการใช้งานตามสไลด์ |
|---|---|
| **Lifestyle applications** | เข้าถึงข่าวล่าสุดหรือผลกีฬา, เช็คพยากรณ์อากาศ, แต่งเพลง, ค้นคว้าลำดับวงศ์ตระกูล, หาสูตรอาหาร, หาร้านอาหาร ปั๊มน้ำมัน หรือจุดสนใจใกล้เคียง |
| **Medical applications** | ค้นคว้าอาการของโรค, จัดโปรแกรมฟิตเนสหรือสุขภาพ, ติดตามการออกกำลังกาย, เติมใบสั่งยา, นับแคลอรี, หรือติดตามรูปแบบการนอน |
| **Entertainment applications** | ฟังเพลงหรือวิทยุ, ดูภาพ, ดูวิดีโอหรือรายการ, อ่านหนังสือหรือสิ่งพิมพ์, จัดและติดตามทีมกีฬาแฟนตาซี, เล่นเกมคนเดียวหรือกับผู้อื่น |
| **Convenience applications** | ขอเส้นทางขับรถหรือตำแหน่งปัจจุบัน, สตาร์ต/ล็อก-ปลดล็อกรถจากระยะไกล, ตั้งนาฬิกาปลุกหรือตัวจับเวลา, ดูเวลา, คำนวณทิป, ใช้โทรศัพท์เป็นไฟฉาย, หรือใช้ผู้ช่วยส่วนตัวที่ทำตามคำสั่งเสียง |
| **Education applications** | เข้าถึงคู่มือ how-to, เรียนรู้หรือฝึกฝนทักษะเฉพาะ, ทำตาม tutorial, รัน simulation, ช่วยเด็กเรื่องการอ่านและทักษะพื้นฐานอื่น, หรือสนับสนุนงานวิชาการ |

### 7.6 Communications Applications ⭐⭐ (12 ประเภท — ตารางนี้ออกสอบ)

| แอป | นิยามตามสไลด์ |
|---|---|
| **Blog** | บทความหรือโพสต์ที่มี **timestamp** ในรูปแบบไดอารีหรือวารสาร ปกติเรียงลำดับ **ย้อนกลับตามเวลา (reverse chronological order)** |
| **Browsing** | ให้ผู้ใช้ **เข้าถึงและดูเว็บเพจ** บนอินเทอร์เน็ต |
| **Chat** | **การสนทนาแบบพิมพ์ออนไลน์แบบเรียลไทม์** กับผู้ใช้หนึ่งคนหรือมากกว่า |
| **Online Discussion** | พื้นที่ออนไลน์ที่ผู้ใช้มี **การอภิปรายที่เขียนไว้** |
| **Email** | ข้อความและไฟล์ที่ส่งผ่านเครือข่าย เช่น อินเทอร์เน็ต |
| **File Transfer** | วิธี **อัปโหลดไฟล์ไปยังและดาวน์โหลดไฟล์จากเซิร์ฟเวอร์** บนอินเทอร์เน็ต |
| **Internet Phone** | ให้ผู้ใช้ **พูดกับผู้ใช้อื่นผ่านการเชื่อมต่ออินเทอร์เน็ต** |
| **Internet/Instant Messaging** | **การแลกเปลี่ยนข้อความ ไฟล์ ภาพ เสียง และ/หรือ วิดีโอแบบเรียลไทม์** กับผู้ใช้ออนไลน์อีกคน |
| **Mobile Messaging** | ข้อความสั้น ภาพ หรือวิดีโอ ที่ส่งและรับ **ส่วนใหญ่บนอุปกรณ์พกพา** |
| **Videoconference** | การประชุมระหว่างคนที่แยกกันทางภูมิศาสตร์ ซึ่งใช้เครือข่ายในการส่ง **วิดีโอ/เสียง** |
| **Web Feeds** | **ติดตามการเปลี่ยนแปลงที่เกิดกับบล็อกโดยการตรวจสอบ feeds** |

### 7.7 Security Tools ⭐⭐⭐

**Virus — วงจรชีวิตของไวรัส (ออกสอบแน่)**
- **Virus author** = โปรแกรมเมอร์ที่เขียนโปรแกรมไวรัส **โดยเจตนา**; การเขียนไวรัสมักต้องใช้ทักษะการเขียนโปรแกรมอย่างมาก
- ผู้เขียนไวรัสทำให้แน่ใจว่าไวรัสสามารถ: **replicate ตัวเอง · conceal (ปกปิด) ตัวเอง · monitor เหตุการณ์บางอย่าง · deliver payload**

**Infection Phase (ระยะติดเชื้อ) — 3 ขั้น ⭐**

| ขั้น | รายละเอียด |
|---|---|
| **1. Replicate** | ไวรัสทำสำเนาตัวเองโดย **แนบตัวเองเข้ากับไฟล์โปรแกรม** |
| **2. Conceal** | ไวรัส **ปกปิดตัวเองเพื่อหลบเลี่ยงการตรวจจับ** |
| **3. Trigger / Watch** | ไวรัส **เฝ้ารอเงื่อนไขหรือเหตุการณ์บางอย่าง แล้วเริ่มทำงานเมื่อเงื่อนไขนั้นเกิดขึ้น** เช่น การเริ่มเครื่อง หรือ **การถึงวันที่ตามนาฬิกาของระบบ** |

> **ขั้นแรกของ infection phase คือ "activation of the virus"** และ **วิธีแพร่กระจายที่พบบ่อยที่สุดคือผู้ใช้รันโปรแกรม/แอปที่ติดเชื้อ**

**Delivery Phase (ระยะส่งมอบ) ⭐**
- ไวรัส **ปลดปล่อย payload** ซึ่งอาจเป็น **การล้อเล่นที่ไม่เป็นอันตราย** ที่แสดงข้อความไร้ความหมาย — หรืออาจ **ทำลาย** โดยทำให้ข้อมูลและไฟล์เสียหายหรือถูกลบ
- ⚠️ **ไวรัสที่อันตรายที่สุดคือไวรัสที่ไม่มี payload ที่เห็นได้ชัด** — มันจะ **แก้ไขไฟล์อย่างเงียบ ๆ**
- **วิธีหนึ่งที่ antivirus ตรวจจับไวรัส คือการ monitor ไฟล์เพื่อหาการเปลี่ยนแปลงที่ไม่ทราบที่มา (unknown changes)**

> 📝 **จากโน้ตชั้นเรียน — Virus Lifecycle 4 ระยะ:** **Dormant (สงบนิ่ง) → Propagation (แพร่กระจาย/สำเนาตัวเอง) → Trigger (ถูกกระตุ้น) → Execution (ทำงานตามที่ตั้งไว้)**

**Malware อื่น ๆ ⭐⭐ (ตารางเปรียบเทียบ — ออกสอบ)**

| Malware | นิยามตามสไลด์ | ทำสำเนาตัวเอง? |
|---|---|---|
| **Worm** | **อยู่ใน active memory** และ **ทำสำเนาตัวเองผ่านเครือข่าย** เพื่อติดเชื้อคอมพิวเตอร์และอุปกรณ์ ใช้ทรัพยากรระบบจนหมด และอาจทำให้ระบบล่ม | ✅ ใช่ |
| **Trojan horse** | **โปรแกรมทำลายที่ปลอมตัวเป็นโปรแกรมจริง** เช่น screen saver; เมื่อผู้ใช้รันโปรแกรมที่ดูไร้พิษภัย โทรจันที่ซ่อนอยู่ข้างในสามารถ **จับข้อมูล เช่น ชื่อผู้ใช้และรหัสผ่าน** หรือ **ให้ใครบางคนควบคุมเครื่องของคุณจากระยะไกล** | ❌ **ไม่ — ต่างจากไวรัส โทรจันไม่ทำสำเนาตัวเอง** |
| **Rootkit** | โปรแกรมที่ **ซ่อนตัวได้ง่ายและให้ใครบางคนควบคุมเครื่องของคุณได้เต็มรูปแบบจากระยะไกล** มักเพื่อจุดประสงค์ร้าย; เช่น ซ่อนในโฟลเดอร์ — โฟลเดอร์นั้นดูว่างเปล่าเพราะ rootkit **สั่งให้คอมพิวเตอร์ไม่แสดงเนื้อหาของโฟลเดอร์**; **อันตรายมากและมักต้องใช้ซอฟต์แวร์พิเศษในการตรวจจับและกำจัด** | — |

**เครื่องมือความปลอดภัย 4 กลุ่ม ⭐**

| # | เครื่องมือ | นิยาม |
|---|---|---|
| **8.1** | **Antivirus program** | ปกป้องคอมพิวเตอร์จากไวรัสโดย **ระบุและกำจัดไวรัสที่พบใน memory, บน storage media, หรือในไฟล์ขาเข้า**<br>ตัวอย่าง: **AVG Antivirus, McAfee Antivirus** |
| **8.2** | **Personal firewall** | เครื่องมือความปลอดภัยที่ **ตรวจจับและปกป้องคอมพิวเตอร์ส่วนบุคคลและข้อมูลจากการบุกรุกที่ไม่ได้รับอนุญาต (unauthorized intrusions)** |
| **8.3** | **Spyware & Adware** | **Spyware** = โปรแกรมที่วางบนเครื่อง **โดยที่ผู้ใช้ไม่รู้** ซึ่ง **แอบเก็บข้อมูลเกี่ยวกับผู้ใช้** แล้วส่งข้อมูลที่เก็บได้ไปยัง **แหล่งภายนอกขณะที่ผู้ใช้ออนไลน์**<br>**Adware** = โปรแกรมที่ **แสดงโฆษณาออนไลน์ในแบนเนอร์ หรือหน้าต่าง pop-up/pop-under** บนเว็บเพจ ข้อความอีเมล หรือบริการอินเทอร์เน็ตอื่น<br>**Spyware remover** = ตรวจจับและลบ spyware และโปรแกรมคล้ายกัน · **Adware remover** = ตรวจจับและลบ adware |
| **8.4** | **Internet filter** | **Filters** = โปรแกรมที่ **ลบหรือบล็อกไม่ให้บางรายการถูกแสดง** — มี 4 ชนิด |

**Internet Filter — 4 ชนิด ⭐⭐**

| ชนิด | นิยาม |
|---|---|
| **Anti-Spam Programs** | **Spam** = ข้อความอีเมลหรือโพสต์ที่ **ไม่ได้ร้องขอ (unsolicited)** ส่งไปยังผู้รับหรือฟอรัมจำนวนมากในคราวเดียว |
| **Web Filters** | **Web filtering software** = โปรแกรมที่ **จำกัดการเข้าถึงเนื้อหาบางอย่างบนเว็บ** |
| **Phishing Filters** | **Phishing** = การหลอกลวงที่ผู้กระทำผิดส่ง **อีเมลที่ดูเป็นทางการ** เพื่อ **พยายามให้ได้ข้อมูลส่วนตัวและ/หรือทางการเงินของคุณ** |
| **Pop-Up and Pop-Under Blockers** | **Pop-up ad** = โฆษณาอินเทอร์เน็ตที่ **ปรากฏขึ้นทันทีในหน้าต่างใหม่ทับบนเว็บเพจ** |

### 7.8 File, Disk, and System Management Tools ⭐⭐ (11 เครื่องมือ)

| เครื่องมือ | นิยาม |
|---|---|
| **File manager** | เครื่องมือที่ทำหน้าที่เกี่ยวกับ **การจัดการไฟล์** |
| **Search tool** | โปรแกรมที่มักมากับ OS ที่ **พยายามค้นหาไฟล์ รายชื่อ เหตุการณ์ในปฏิทิน แอป หรือรายการอื่นใด** ที่เก็บบนเครื่อง **ตามเกณฑ์ที่คุณระบุ** |
| **Image viewer** | เครื่องมือที่ให้ผู้ใช้ **แสดง คัดลอก และพิมพ์เนื้อหาของไฟล์กราฟิก** เช่น ภาพถ่าย |
| **Uninstaller** | เครื่องมือที่ **ลบโปรแกรม รวมถึงรายการที่เกี่ยวข้องในไฟล์ระบบ** |
| **Disk cleanup** | เครื่องมือที่ **ค้นหาและลบไฟล์ที่ไม่จำเป็น** |
| **Disk defragmenter** ⭐ | เครื่องมือที่ **จัดระเบียบไฟล์และพื้นที่ว่างบน hard disk ใหม่ เพื่อให้ OS เข้าถึงข้อมูลได้เร็วขึ้นและโปรแกรมรันเร็วขึ้น** |
| **Screen saver** | เครื่องมือที่ทำให้จอแสดงผล **แสดงภาพเคลื่อนไหวหรือจอเปล่า** ถ้า **ไม่มีการใช้งานคีย์บอร์ดหรือเมาส์ตามเวลาที่กำหนด** |
| **File compression tool** | **ลดขนาดของไฟล์** |
| **PC maintenance tool** | โปรแกรมที่ **ระบุและแก้ปัญหาระบบปฏิบัติการ, ตรวจจับและซ่อมปัญหาไดรฟ์ และมีความสามารถในการปรับปรุงประสิทธิภาพของคอมพิวเตอร์** |
| **Backup tool** | ให้ผู้ใช้ **คัดลอก (back up) ไฟล์ที่เลือกหรือเนื้อหาทั้งหมดของสื่อจัดเก็บไปยังที่จัดเก็บอื่น** |
| **Restore tool** | **ย้อนกระบวนการ** และ **คืนไฟล์ที่สำรองไว้กลับสู่รูปแบบเดิม** |

---

# ส่วนที่ 2: สูตรสำคัญ & อภิธานศัพท์ (Glossary)

---

## 🔢 A. สูตรและตัวเลขที่ต้องท่องให้ได้

### A1. หน่วยข้อมูลพื้นฐาน ⭐⭐⭐

| สูตร | ค่า |
|---|---|
| **1 byte** | **= 8 bits** |
| **1 character** | **= 1 byte = 8 bits** |
| **บิตมี 2 ค่า** | **0 และ 1** (binary system) |
| **จำนวนค่าที่ n bits แทนได้** | **2ⁿ** (เช่น 8 bits → 2⁸ = 256 ค่า) |
| **1 GHz** | **= 1,000,000,000 cycles/second = 10⁹ cycles/s** |
| **Bus width n-bit** | ส่งได้ **n bits ต่อครั้ง = n ÷ 8 bytes** (เช่น 32-bit bus = **4 bytes**) |

### A2. ตารางความจุ (แปลงหน่วย) ⭐⭐⭐

| หน่วย | 10ⁿ | 2ⁿ | ค่าที่แน่นอน |
|---|---|---|---|
| KB | 10³ | 2¹⁰ | **1,024** |
| MB | 10⁶ | 2²⁰ | **1,048,576** |
| GB | 10⁹ | 2³⁰ | **1,073,741,824** |
| TB | 10¹² | 2⁴⁰ | — |
| PB | 10¹⁵ | 2⁵⁰ | — |
| EB | 10¹⁸ | 2⁶⁰ | — |
| ZB | 10²¹ | 2⁷⁰ | — |
| YB | 10²⁴ | 2⁸⁰ | — |

### A3. การแปลง Binary ↔ Decimal ↔ ASCII ⭐⭐

**น้ำหนักบิต 8 ตำแหน่ง:** `128 · 64 · 32 · 16 · 8 · 4 · 2 · 1` (2⁷…2⁰)

| Binary | คำนวณ | DEC | ASCII CHAR |
|---|---|---|---|
| `01000101` | 64+4+1 | **69** | **E** |
| `00101010` | 32+8+2 | **42** | **\*** |
| `00110110` | 32+16+4+2 | **54** | **6** |

**ตัวอย่างจากสไลด์:** binary `00101110` = Hex **2E** · binary `00110101` = Dec **53**

### A4. ตัวเลขที่ต้องจำ (Key Numbers) ⭐⭐

| หัวข้อ | ตัวเลข |
|---|---|
| USB port รองรับอุปกรณ์ต่อพ่วง | **127 อุปกรณ์** ด้วย connector เดียว |
| ANSI standard keyboard | **104 keys** |
| Phablet ขนาดหน้าจอ | **5–7 นิ้ว** (แนวทแยง) |
| Minicomputer รองรับผู้ใช้ | **ถึง 200 คน** พร้อมกัน |
| Mainframe รองรับผู้ใช้ | **หลักร้อยถึงหลักพันคน** พร้อมกัน |
| Supercomputer ประมวลผล | **10¹² คำสั่ง/วินาที** |
| Fugaku | **7,630,848 cores, 442 Pflop/s, อันดับ 1 มิ.ย. 2021** |
| Intel Core i7-11370H | ประมาณ **200 Gflops (10⁹)** |
| HDD form factor | **3.5"** = desktop · **2.5"** = laptop |
| HDD ความเร็วรอบทั่วไป | **5400–7200 RPM** |
| SD / SDHC / SDXC / SDUC | **2 GB / 32 GB / 2 TB / 128 TB** |
| Moore's Law | **1965 = 2 เท่า/ปี** · **1975 = 2 เท่า/2 ปี** · **2015 ≈ 2.5 ปี** |
| MOSFET ชะลอตัว | **ตั้งแต่ปี 2010** |
| ARPANET | **ปลายทศวรรษ 1960s**, 4 โหนดแรก |
| Windows 1 | **พฤศจิกายน 1985** (16-bit, บน MS-DOS) |
| Windows 11 | **5 ตุลาคม 2021** |
| Mac OS ออกครั้งแรก | **1984** (พร้อม Macintosh) |
| UNIX | **ต้นทศวรรษ 1970s** โดย **Bell Laboratories** |
| Linux | **1991** (open source) |
| Windows 10 Mobile สิ้นสุดการสนับสนุน | **10 ธันวาคม 2019** (ประกาศ ม.ค. 2019) |
| Magstripe จะหมดไป | **ภายในปี 2033** (ยุโรปออกบัตรไร้แถบได้ตั้งแต่ **2024**) |
| Android เวอร์ชันล่าสุด | **Android 17 — 16 มิ.ย. 2026** |
| iPadOS 26 | **27 ก.ค. 2026** |
| NFC / RFID (โน้ตชั้นเรียน) | **13.56 MHz** |
| CD vs DVD pit pitch (โน้ตชั้นเรียน) | **CD ≈ 800 nm · DVD ≈ 400 nm** |

---

## 📖 B. อภิธานศัพท์และตัวย่อ (Acronym Glossary) ⭐⭐⭐

### B1. ตัวย่อฮาร์ดแวร์และสถาปัตยกรรม

| ตัวย่อ | ชื่อเต็ม | ความหมายสั้น |
|---|---|---|
| **CPU** | Central Processing Unit | หน่วยประมวลผลกลาง = CU + ALU |
| **CU** | Control Unit | สั่งการและประสานงานการทำงาน |
| **ALU** | Arithmetic Logic Unit | คำนวณเลขคณิต เปรียบเทียบ และการดำเนินการอื่น |
| **GPU** | Graphics Processing Unit | การ์ดประมวลผลกราฟิก |
| **PCB** | Printed Circuit Board | แผงวงจรพิมพ์ |
| **PCI** | Peripheral Component Interconnect | มาตรฐาน expansion slot |
| **IC** | Integrated Circuit | วงจรรวมในชิป |
| **MOSFET** | Metal-Oxide-Semiconductor Field-Effect Transistor | ทรานซิสเตอร์ที่การพัฒนาชะลอตัวตั้งแต่ 2010 |
| **I/O** | Input/Output | อินพุต/เอาต์พุต |
| **AC / DC** | Alternating / Direct Current | ไฟสลับ / ไฟตรง |
| **UPS** | Uninterruptible Power Supply | จ่ายไฟต่อเนื่องเมื่อไฟดับ |
| **RPM** | Revolutions Per Minute | รอบต่อนาที (HDD) |
| **ppm** | pages per minute | หน้าต่อนาที (เครื่องพิมพ์) |
| **ns** | nanoseconds | หน่วยของ access time |
| **GHz** | Gigahertz | หน่วยของ clock speed |

### B2. ตัวย่อหน่วยความจำและจัดเก็บ

| ตัวย่อ | ชื่อเต็ม | ความหมายสั้น |
|---|---|---|
| **RAM** | Random Access Memory | หน่วยความจำ **volatile** |
| **SRAM** | Static RAM | เร็ว กินไฟน้อย → ใช้เป็น **cache** |
| **DRAM** | Dynamic RAM | ถูก ความจุสูง → ใช้เป็น **main memory** |
| **ROM** | Read Only Memory | **non-volatile** อ่านอย่างเดียว |
| **BIOS** | Basic Input/Output System | ROM chip บน motherboard ตั้งค่าระบบพื้นฐาน |
| **EEPROM** | Electrically Erasable Programmable Read-Only Memory | = **flash memory** |
| **CMOS** | Complementary Metal–Oxide–Semiconductor | ใช้แบตเตอรี่เก็บการตั้งค่า กินไฟต่ำ ช้ากว่า RAM |
| **HDD** | Hard Disk Drive | จานแม่เหล็ก |
| **SSD** | Solid-State Drive | flash memory + processor ของตัวเอง |
| **RAID** | Redundant Array of Independent Disks | รวมดิสก์ ≥2 เพื่อ redundancy/performance |
| **NAS** | Network Attached Storage | **เซิร์ฟเวอร์**ที่ให้ storage แก่ผู้ใช้/เครื่องบนเครือข่าย |
| **SAN** | Storage Area Network | **เครือข่ายความเร็วสูง**ที่ให้ storage แก่ **เซิร์ฟเวอร์อื่น** |
| **SD / SDHC / SDXC / SDUC** | Secure(d) Digital / High Capacity / Extended Capacity / Ultra Capacity | 2GB / 32GB / 2TB / 128TB |
| **WORM** | Write Once, Read Many | รูปแบบของ DVD-R / DVD+R |
| **KB/MB/GB/TB/PB/EB/ZB/YB** | Kilo/Mega/Giga/Tera/Peta/Exa/Zetta/Yotta-byte | ตารางความจุ |
| **Kbps/Mbps/Gbps** | Kilo/Mega/Giga byte per second | transfer rate |

### B3. ตัวย่ออินพุต/เอาต์พุตและการเชื่อมต่อ

| ตัวย่อ | ชื่อเต็ม | ความหมายสั้น |
|---|---|---|
| **ANSI** | American National Standards Institute | มาตรฐานคีย์บอร์ด 104 keys |
| **ASCII** | American Standard Code For Information Interchange | รหัสแทนอักขระ |
| **OCR** | Optical Character Recognition | แปลงข้อความจากภาพ/สแกนเป็นข้อมูลที่เครื่องอ่านได้ |
| **OMR** | Optical Mark Recognition | อ่านเครื่องหมายที่มนุษย์ฝน เช่น กระดาษคำตอบ |
| **MICR** | Magnetic Ink Character Recognition | อ่านหมึกแม่เหล็ก → **ใช้ในธนาคารประมวลผลเช็ค** |
| **RFID** | Radio Frequency Identification | ใช้คลื่นวิทยุอ่าน tag |
| **QR code** | Quick Response code | เก็บข้อมูล 2 มิติ มากกว่า bar code |
| **NFC** | Near Field Communication | สื่อสารระยะใกล้ (chip + antenna) |
| **USB** | Universal Serial Bus | รองรับ 127 อุปกรณ์ |
| **VGA** | Video Graphics Array | **analog** |
| **DVI** | Digital Video Interface | **analog + digital** |
| **HDMI** | High-Definition Media Interface | **digital + digital audio** |
| **DTV / HDTV** | Digital / High-Definition Television | HDTV = DTV ที่ก้าวหน้าที่สุด |
| **DSLR** | Digital Single-Lens Reflex | มีกระจกสะท้อน + optical viewfinder |
| **MILC** | Mirrorless Interchangeable-Lens Camera | ไม่มีกระจกสะท้อน/optical viewfinder |
| **RGB** | Red Green Blue | ระบบสีของภาพในคอมพิวเตอร์ |
| **POS** | Point of Sale | terminal ในร้านค้าปลีก |
| **ATM** | Automated Teller Machine | terminal บริการธนาคารตนเอง |
| **RSI** | Repetitive Strain Injury | บาดเจ็บจากการใช้กล้ามเนื้อซ้ำ ๆ |

### B4. ตัวย่อ OS / ซอฟต์แวร์ / เครือข่าย

| ตัวย่อ | ชื่อเต็ม | ความหมายสั้น |
|---|---|---|
| **OS** | Operating System | ประสานงานฮาร์ดแวร์ทั้งหมด |
| **UI** | User Interface | ควบคุมการป้อนข้อมูลและการแสดงผล |
| **GUI** | Graphical User Interface | เมนู/ภาพ กด แตะ คลิก |
| **CLI** | Command-Line Interface | พิมพ์คำสั่ง เช่น `dir` |
| **NUI** | Natural User Interface | touch, gesture, speech, VR |
| **DBMS** | Database Management System | สร้าง เข้าถึง จัดการฐานข้อมูล |
| **CAD** | Computer-Aided Design | ออกแบบวิศวกรรม/สถาปัตย์/วิทยาศาสตร์ |
| **DTP** | Desktop Publishing | สร้างสิ่งพิมพ์ซับซ้อน |
| **PDF** | Portable Document Format | พัฒนาโดย **Adobe Systems** |
| **VoIP** | Voice over Internet Protocol | โทรผ่านอินเทอร์เน็ต |
| **ARPANET** | Advanced Research Projects Agency Network | ต้นกำเนิดอินเทอร์เน็ต ปลาย 1960s |
| **WWW** | World Wide Web | เว็บที่ crawler ท่องเพื่อทำ indexing |
| **AI** | Artificial Intelligence | คิดและกระทำอย่างมนุษย์และมีเหตุผล |
| **ANI / AGI / ASI** | Artificial Narrow / General / Super Intelligence | แคบ (มีจริง) / เท่ามนุษย์ (ทฤษฎี) / เหนือมนุษย์ (ทฤษฎี) |
| **ML** | Machine Learning | ส่วนย่อยของ AI |

### B5. คำศัพท์ที่มักสับสน (Confusable Pairs) ⭐⭐⭐

| คู่คำ | ความต่างที่ออกสอบ |
|---|---|
| **Data vs Information** | Data = ดิบ ยังไม่ประมวลผล (Input) · Information = ผ่านการประมวลผลและมีโครงสร้าง (Output) |
| **Memory vs Storage** | Memory = primary, เก็บสิ่งที่รอประมวลผล · Storage = secondary, เก็บถาวร |
| **Volatile vs Non-volatile** | Volatile หายเมื่อไฟดับ (RAM) · Non-volatile ไม่หาย (ROM, flash, CMOS) |
| **SRAM vs DRAM** | SRAM เร็ว กินไฟน้อย ใช้เป็น cache · DRAM ถูก ความจุสูง ใช้เป็น main memory |
| **Read vs Write** | Read = storage → memory (≈input) · Write = memory → storage (≈output) |
| **Cold boot vs Warm boot** | Cold = จากปิดสนิท ตรวจฮาร์ดแวร์ · Warm = ขณะเปิดอยู่ เร็วกว่า ล้าง memory |
| **Sleep vs Hibernate** | Sleep เก็บลง **RAM** (เสี่ยงข้อมูลหายถ้าไฟดับ) · Hibernate เก็บลง **hard drive** |
| **Single tasking vs Multitasking** | จำนวน **โปรแกรม** ที่รันพร้อมกัน |
| **Single user vs Multiuser** | จำนวน **ผู้ใช้** ที่รันโปรแกรมพร้อมกัน |
| **Backward vs Upward compatible** | Backward = **OS ใหม่** รันแอปเก่าได้ · Upward = **แอปเก่า** อาจรัน/ไม่รันบน OS ใหม่ |
| **Virus vs Worm vs Trojan** | Virus แนบกับไฟล์โปรแกรม · Worm อยู่ใน active memory + แพร่ผ่านเครือข่าย · **Trojan ปลอมตัวและไม่ทำสำเนาตัวเอง** |
| **Spyware vs Adware** | Spyware แอบเก็บข้อมูล · Adware แสดงโฆษณา |
| **Shareware vs Freeware vs Open source vs Public-domain** | ทดลองแล้วจ่าย · ฟรีแต่ยังมีลิขสิทธิ์ · แก้ไข/เผยแพร่ต่อได้ · ไม่มีลิขสิทธิ์เลย |
| **Formula vs Function** | Formula = ผู้ใช้เขียนเอง · Function = **สูตรที่กำหนดไว้ล่วงหน้า** เช่น `=SUM()` |
| **Record vs Field** | Record = **แถว** (ข้อมูลของรายการหนึ่ง) · Field = **คอลัมน์** (หมวดข้อมูลเฉพาะ) |
| **NAS vs SAN** | NAS = **เซิร์ฟเวอร์** ให้ storage แก่ผู้ใช้/เครื่อง · SAN = **เครือข่าย** ให้ storage แก่ **เซิร์ฟเวอร์อื่น** |
| **Mirroring vs Striping** | Mirroring = สำเนาเหมือนกัน (redundancy) · Striping = แบ่งกระจายหลายดิสก์ (performance) |
| **Nonimpact vs Impact printer** | Nonimpact **ไม่สัมผัสกระดาษ** · Impact **ตอกผ่านผ้าหมึกกระทบกระดาษ** (dot matrix) |
| **PIT vs LAND** | PIT (หลุม) = **0** · LAND (ราบ) = **1** |
| **Longitudinal vs Perpendicular** | ขั้วแม่เหล็กขนานผิวจาน vs ตั้งฉากผิวจาน (หนาแน่นกว่า) |
| **Buffer vs Spooling vs Queue** | Buffer = พื้นที่พัก · Spooling = ส่งไป buffer แทนพิมพ์ทันที · Queue = คิวใน buffer |
| **Swap file vs Page vs Paging vs Thrashing** | พื้นที่บนดิสก์ · ปริมาณต่อครั้ง · เทคนิคการสลับ · **สภาวะที่ OS มัวแต่ paging จนไม่ได้รันแอป** |
| **VGA vs DVI vs HDMI** | analog · analog+digital · digital+audio |
| **OCR vs OMR vs MICR** | อ่านตัวอักษรจากภาพ · อ่านเครื่องหมายที่ฝน · อ่านหมึกแม่เหล็ก (ธนาคาร) |
| **Web app vs Mobile app vs Mobile web app** | บน web server เข้าผ่าน browser · โหลดจาก app store · web app ที่ปรับให้เข้ากับจอมือถือ (responsive design) |

---

# ส่วนที่ 3: แบบฝึกหัดเตรียมสอบกลางภาค (Midterm Practice Quiz)

---

## 📝 ส่วน A: ข้อสอบปรนัย 10 ข้อ (Multiple Choice)

> **คำแนะนำ:** ลองทำเองก่อน ปิดเฉลย แล้วค่อยเปิดดูคำอธิบายด้านล่างแต่ละข้อ

---

### ข้อ 1. (Lecture 03 — Machine Cycle)
ในวงจรการทำงานของเครื่อง (machine cycle) ขั้นตอน **"Decode"** ดำเนินการโดยส่วนใด และมีหน้าที่อะไร?

- **A.** ALU — ทำการคำนวณกับข้อมูล
- **B.** Control Unit — ถอดรหัสคำสั่งและส่งคำสั่งกับข้อมูลไปยัง ALU
- **C.** Register — เก็บผลลัพธ์ไว้ชั่วคราว
- **D.** Control Unit — ดึงคำสั่งและข้อมูลจากหน่วยความจำ

<details><summary>👉 เฉลยและคำอธิบาย</summary>

**เฉลย: B**

Machine cycle มี 4 ขั้น: **S1 Fetch → S2 Decode → S3 Execute → S4 Store**
- **S1 Fetch:** Control Unit ดึงคำสั่งและข้อมูลจาก memory → นี่คือตัวเลือก **D** (ถูกเนื้อหาแต่ผิดขั้น)
- **S2 Decode:** **Control Unit** ถอดรหัสคำสั่ง แล้วส่งคำสั่งและข้อมูลไปยัง **ALU** ✅
- **S3 Execute:** **ALU** ทำการคำนวณ → ตัวเลือก **A** เป็นหน้าที่ของ Execute ไม่ใช่ Decode
- **S4 Store:** ผลลัพธ์ถูกเก็บใน memory และปรากฏบนหน้าจอ

**จุดที่ต้องระวัง:** Fetch และ Decode เป็นงานของ **Control Unit** ส่วน Execute เป็นงานของ **ALU** — ข้อสอบมักสลับสองส่วนนี้
</details>

---

### ข้อ 2. (Lecture 05 — Storage Fundamentals)
ข้อความใดต่อไปนี้ **ไม่ถูกต้อง** เกี่ยวกับ storage device?

- **A.** Reading คือกระบวนการถ่ายโอนสิ่งของจาก storage medium เข้าสู่ memory ซึ่งเทียบเท่ากับ input
- **B.** Writing คือกระบวนการถ่ายโอนสิ่งของจาก memory ไปยัง storage medium ซึ่งเทียบเท่ากับ output
- **C.** เนื่องจาก storage device ทำหน้าที่ทั้งอ่านและเขียน จึงจัดเป็น I/O device
- **D.** Storage medium คือวัสดุกายภาพที่คอมพิวเตอร์ใช้เก็บข้อมูล สารสนเทศ โปรแกรม และแอปพลิเคชัน

<details><summary>👉 เฉลยและคำอธิบาย</summary>

**เฉลย: C**

สไลด์ Lecture 05 หน้า 4 ระบุไว้อย่างชัดเจนที่ท้ายหน้าว่า **"It is not I/O device"** แม้ว่าการ Read จะเทียบเท่ากับ Input และการ Write จะเทียบเท่ากับ Output ก็ตาม

- **A** ถูก — Read = storage medium → memory (Input)
- **B** ถูก — Write = memory → storage medium (Output)
- **D** ถูก — เป็นนิยามตรงตัวของ storage medium

**เทคนิคจำ:** storage device เป็นตัวกลางระหว่าง memory กับ medium ไม่ได้รับข้อมูลจากมนุษย์หรือแสดงผลให้มนุษย์โดยตรง จึงไม่นับเป็น I/O device
</details>

---

### ข้อ 3. (Lecture 02 — Moore's Law)
ตามที่กล่าวไว้ในบทเรียน Gordon Moore ได้ **ปรับแก้** คำทำนายเดิมของเขาในปีใด และเปลี่ยนเป็นอะไร?

- **A.** ปี 1965 — เปลี่ยนจาก 2 เท่าทุก 2 ปี เป็น 2 เท่าทุก 1 ปี
- **B.** ปี 1975 — เปลี่ยนจาก 2 เท่าทุก 1 ปี เป็น 2 เท่าทุก 2 ปี
- **C.** ปี 2015 — เปลี่ยนจาก 2 เท่าทุก 2 ปี เป็น 2 เท่าทุก 2.5 ปี
- **D.** ปี 2010 — เปลี่ยนเพราะการพัฒนา MOSFET ชะลอตัว

<details><summary>👉 เฉลยและคำอธิบาย</summary>

**เฉลย: B**

ไทม์ไลน์ตามสไลด์:
- **1965:** Moore (ผู้ร่วมก่อตั้ง Intel) **สังเกต** ว่าจำนวน components ต่อ IC เพิ่มเป็น 2 เท่า **ทุก 1 ปี** — นี่คือคำทำนาย**เดิม** ไม่ใช่การปรับแก้ (A จึงผิดเพราะสลับทิศทาง)
- **1975:** Moore **revised the forecast** เป็น **"doubling every two years"** ✅ นี่คือปีที่ปรับแก้
- **2015:** **Intel** (ไม่ใช่ Moore) ระบุว่าจังหวะปัจจุบันใกล้ **2.5 ปี** — เป็นการรายงานสถานะ ไม่ใช่การปรับคำทำนายของ Moore (C จึงผิด)
- **2010:** เป็นปีที่การพัฒนา **MOSFET ชะลอตัว** ซึ่งเป็น**สาเหตุ** ไม่ใช่ปีที่ปรับคำทำนาย (D จึงผิด)
</details>

---

### ข้อ 4. (Lecture 06 — Virtual Memory)
พื้นที่บนฮาร์ดไดรฟ์ที่ถูกใช้เป็น virtual memory เรียกว่าอะไร และสภาวะที่ OS ใช้เวลาส่วนใหญ่ไปกับการ paging แทนการรันแอปพลิเคชันเรียกว่าอะไร?

- **A.** Buffer และ Spooling
- **B.** Page และ Paging
- **C.** Swap file และ Thrashing
- **D.** Cache และ Head crash

<details><summary>👉 เฉลยและคำอธิบาย</summary>

**เฉลย: C**

ชุดคำศัพท์ virtual memory ตามสไลด์:
- **Swap file** = พื้นที่ของ hard drive ที่ใช้เป็น virtual memory เรียกเช่นนี้เพราะมัน **swap (แลกเปลี่ยน)** ข้อมูล สารสนเทศ และคำสั่งระหว่าง memory กับ storage ✅
- **Page** = **ปริมาณ** ข้อมูลและคำสั่งโปรแกรมที่ swap ได้ในคราวหนึ่ง
- **Paging** = **เทคนิค** การสลับสิ่งของระหว่าง memory กับ storage
- **Thrashing** = **สภาวะ** ที่ OS ใช้เวลาส่วนใหญ่ไปกับ paging แทนที่จะรันแอปพลิเคชัน → ประสิทธิภาพลดลง ✅

**ตัวลวง:** Buffer/Spooling เป็นเรื่องของ **Coordinating tasks** (การพิมพ์) ไม่ใช่ memory management · Head crash เป็นเรื่องของ HDD ใน Lecture 05
</details>

---

### ข้อ 5. (Lecture 04 — Display Ports)
พอร์ตแสดงผลชนิดใดที่ **รองรับทั้งสัญญาณ analog และ digital**?

- **A.** VGA (Video Graphics Array)
- **B.** DVI (Digital Video Interface)
- **C.** HDMI (High-Definition Media Interface)
- **D.** DisplayPort

<details><summary>👉 เฉลยและคำอธิบาย</summary>

**เฉลย: B**

ตารางพอร์ตแสดงผลตามสไลด์ Lecture 04:

| พอร์ต | รองรับ |
|---|---|
| **VGA** | **analog เท่านั้น** → A ผิด |
| **DVI** | **analog และ digital** ✅ |
| **HDMI** | **digital พร้อม digital audio signal** → C ผิด (ไม่รองรับ analog) |
| **DisplayPort** | เป็น **ทางเลือกทดแทน HDMI** → D ผิด |

**เทคนิคจำ:** เรียงตามยุค — VGA เก่าสุด (analog) → DVI ยุคเปลี่ยนผ่าน (**ได้ทั้งสอง**) → HDMI (digital + เสียง) → DisplayPort (คู่แข่ง HDMI)
</details>

---

### ข้อ 6. (Lecture 07 — Obtaining Software)
ซอฟต์แวร์ประเภทใดที่ **ยังคงมีลิขสิทธิ์ (copyrighted) โดยผู้ให้สงวนสิทธิ์ทั้งหมด แต่แจกจ่ายให้ใช้โดยไม่คิดเงิน**?

- **A.** Shareware
- **B.** Freeware
- **C.** Open source software
- **D.** Public-domain software

<details><summary>👉 เฉลยและคำอธิบาย</summary>

**เฉลย: B**

เปรียบเทียบตามนิยามในสไลด์:

| ประเภท | ลิขสิทธิ์ | ค่าใช้จ่าย | แก้ไข/เผยแพร่ต่อได้? |
|---|---|---|---|
| **Shareware** | มีลิขสิทธิ์ | **ฟรีเฉพาะช่วงทดลอง** — ใช้ต่อต้องจ่าย | ไม่ |
| **Freeware** | **มีลิขสิทธิ์ — ผู้ให้สงวนสิทธิ์ทั้งหมด** | **ฟรี** | **ไม่** ✅ |
| **Open source** | มีลิขสิทธิ์ แต่ **ไม่มีข้อจำกัดเรื่องการแก้ไข/เผยแพร่** | ปกติฟรี | **ได้** |
| **Public-domain** | **ไม่มีข้อจำกัดทางลิขสิทธิ์เลย** (บริจาคให้สาธารณะ) | ฟรี | ได้ |

**A ผิด** เพราะ shareware ฟรีเฉพาะ trial period แล้วต้องจ่าย
**C ผิด** เพราะ open source เน้นการแก้ไขและเผยแพร่ต่อได้
**D ผิด** เพราะ public-domain **ไม่มีลิขสิทธิ์**

**จุดสำคัญที่ออกสอบ:** *ฟรี ≠ ไม่มีลิขสิทธิ์* — Freeware ฟรีแต่ยังมีลิขสิทธิ์
</details>

---

### ข้อ 7. (Lecture 02 + 05 — Rack/Blade & Enterprise)
ข้อใดคือ **ข้อเสีย (Cons)** ของ **Blade Server** ตามที่ระบุในบทเรียน?

- **A.** ต้องใช้สายเคเบิลจำนวนมากและจัดระเบียบยาก
- **B.** ถ้าปิดไฟ เซิร์ฟเวอร์ทั้งหมดจะดับพร้อมกัน
- **C.** ระบุและเปลี่ยนเครื่องที่เสียได้ยากเพราะไม่มีการจัดการรวมศูนย์
- **D.** ให้พลังประมวลผลต่ำเมื่อเทียบกับพื้นที่ที่ใช้

<details><summary>👉 เฉลยและคำอธิบาย</summary>

**เฉลย: B**

ตาราง Rack vs Blade ตามสไลด์ Lecture 02:

**Blade Server — Cons (3 ข้อ):**
1. **Heat** — การระบายความร้อนเป็นเรื่องท้าทาย
2. **Cost** — แพงกว่า rack server
3. **Power Requirement** — **"Power off, all server is off"** ✅

**ทำไมข้ออื่นผิด:**
- **A ผิด** — Blade มี **Cabling เป็นข้อดี** (ใช้สายน้อยกว่า rack); เรื่องสายเยอะเป็นของ Rack แต่ Rack ก็ยังจัด**ระเบียบง่าย** ซึ่งเป็น **Pros** ของ Rack
- **C ผิด** — Blade มี **Centralized Management เป็นข้อดี** (จัดการทุก blade ผ่าน interface เดียว); ส่วน Failure Containment (เปลี่ยนเครื่องเสียง่าย) เป็น **Pros ของ Rack**
- **D ผิด** — **Size เป็นข้อดีของ Blade** (อัดพลังประมวลผลมากในพื้นที่น้อย)
</details>

---

### ข้อ 8. (Lecture 03 — Memory Hierarchy & Types)
ข้อความใดต่อไปนี้ **ถูกต้อง** เกี่ยวกับ SRAM และ DRAM?

- **A.** DRAM เร็วกว่าและกินไฟน้อยกว่า SRAM จึงนิยมใช้เป็น cache memory
- **B.** SRAM สร้างจาก transistor และ capacitor โดยเก็บบิตข้อมูลไว้ใน capacitor
- **C.** SRAM เร็วกว่าและกินไฟน้อยกว่า DRAM มักใช้เป็น cache memory ของ CPU ส่วน DRAM ถูกกว่าและมีความจุสูงกว่า จึงใช้เป็น main memory
- **D.** ทั้ง SRAM และ DRAM เป็น non-volatile memory จึงเก็บข้อมูลได้แม้ปิดเครื่อง

<details><summary>👉 เฉลยและคำอธิบาย</summary>

**เฉลย: C**

ตามตารางเปรียบเทียบในสไลด์ Lecture 03:

| | **SRAM** | **DRAM** |
|---|---|---|
| โครงสร้าง | semiconductor memory | **transistor + capacitor** (บิตเก็บใน capacitor) |
| ความเร็ว | **เร็วกว่ามาก** | ช้ากว่า |
| พลังงาน | **กินไฟน้อยกว่า** | มากกว่า |
| ราคา/ความจุ | แพงกว่า ความจุน้อย | **ถูกกว่ามาก ความจุสูงกว่า** |
| การใช้งาน | **cache memory ของ CPU** | **main memory** |

- **A ผิด** — สลับคุณสมบัติ SRAM กับ DRAM
- **B ผิด** — transistor + capacitor เป็นโครงสร้างของ **DRAM** ไม่ใช่ SRAM
- **D ผิด** — **RAM ทั้งสองชนิดเป็น volatile memory** ข้อมูลหายเมื่อไฟดับ; non-volatile ได้แก่ ROM, flash memory, CMOS
</details>

---

### ข้อ 9. (Lecture 01 — Types of AI)
ข้อใดอธิบาย **Artificial General Intelligence (AGI)** ได้ถูกต้องที่สุดตามบทเรียน?

- **A.** เป็น AI ชนิดเดียวที่มีอยู่จริงในปัจจุบัน ฝึกมาเพื่องานเดียว เช่น Siri และ ChatGPT
- **B.** ยังเป็นทฤษฎี สามารถเรียนรู้และทำงานทางปัญญาใดก็ได้ที่มนุษย์ทำได้ และใช้ความรู้เดิมแก้ปัญหาใหม่โดยไม่ต้อง retrain
- **C.** เป็นทฤษฎีล้วน ๆ เหนือกว่าความสามารถทางปัญญาของมนุษย์ และสามารถมีอารมณ์ได้
- **D.** เป็น AI ที่ทำงานได้เฉพาะภายในขอบเขตที่ถูกกำหนดไว้เท่านั้น

<details><summary>👉 เฉลยและคำอธิบาย</summary>

**เฉลย: B**

ตารางประเภท AI ตามความสามารถ (Lecture 01):

| ประเภท | คำอธิบาย |
|---|---|
| **ANI** (Narrow) | **AI ชนิดเดียวที่มีอยู่จริงในวันนี้**; ฝึกเพื่องานเดียว/แคบ มักเร็วและเก่งกว่ามนุษย์ในงานนั้น; **ทำงานนอกขอบเขตไม่ได้**; ตัวอย่าง Siri, Alexa, IBM Watson, ChatGPT → ตรงกับตัวเลือก **A** และ **D** |
| **AGI** (General) | **Currently theoretical**; เรียนรู้และทำงานทางปัญญาใดก็ได้ที่มนุษย์ทำได้; **ใช้ prior knowledge แก้ปัญหาใหม่โดยไม่ต้อง retraining**; เป็น human-level machine intelligence ที่แท้จริง ✅ |
| **ASI** (Super) | **Strictly theoretical**; เหนือกว่าความสามารถทางปัญญาของมนุษย์; คิด ใช้เหตุผล เรียนรู้ ตัดสิน และ **experience emotions** ได้ → ตรงกับตัวเลือก **C** |

**คีย์เวิร์ดแยกแยะ:** AGI = **"without retraining"** และ **"on par with human"** · ASI = **"emotions"** และ **"beyond human comprehension"**
</details>

---

### ข้อ 10. (Lecture 05 — Capacity & Optical Disc)
ข้อใดต่อไปนี้ **ถูกต้องทั้งหมด**?

- **A.** 1 Gigabyte = 2²⁰ bytes และ PIT บนแผ่นออปติคัลถูกอ่านเป็นค่า 1
- **B.** 1 Gigabyte = 2³⁰ bytes และ LAND บนแผ่นออปติคัลถูกอ่านเป็นค่า 1
- **C.** 1 Terabyte = 2³⁰ bytes และ PIT ถูกอ่านเป็นค่า 0 ส่วน LAND อ่านเป็น 0
- **D.** 1 Megabyte = 2³⁰ bytes และ CD-R สามารถเขียนซ้ำได้หลายครั้ง

<details><summary>👉 เฉลยและคำอธิบาย</summary>

**เฉลย: B**

**ส่วนที่ 1 — ตารางความจุ:**
- KB = 2¹⁰ = 1,024
- MB = 2²⁰ = 1,048,576
- **GB = 2³⁰ = 1,073,741,824** ✅
- TB = 2⁴⁰

**ส่วนที่ 2 — การอ่านแผ่นออปติคัล:**
- **PIT (หลุม) → อ่านได้ค่า 0**
- **LAND (ผิวราบ) → อ่านได้ค่า 1** ✅

**ทำไมข้ออื่นผิด:**
- **A ผิดทั้งสองส่วน** — GB คือ 2³⁰ ไม่ใช่ 2²⁰ (2²⁰ คือ MB) และ PIT = 0 ไม่ใช่ 1
- **C ผิด** — TB = 2⁴⁰ ไม่ใช่ 2³⁰ และ LAND = 1 ไม่ใช่ 0
- **D ผิด** — MB = 2²⁰ ไม่ใช่ 2³⁰ และ **CD-R เขียนได้ครั้งเดียวลบไม่ได้**; ตัวที่เขียนซ้ำได้คือ **CD-RW** (erasable multisession)
</details>

---

## ✍️ ส่วน B: ข้อสอบอัตนัย / สถานการณ์ 5 ข้อ (Short-Answer & Scenario-Based)

---

### ข้อ 1. (Lecture 03 + 06 — Machine Cycle & Memory Hierarchy)

**คำถาม:** จงอธิบายวงจรการทำงานของเครื่อง (machine cycle) ทั้ง 4 ขั้นตอน พร้อมระบุว่าแต่ละขั้นดำเนินการโดยส่วนใดของโปรเซสเซอร์ จากนั้นอธิบายว่าเหตุใดคอมพิวเตอร์จึงต้องมีลำดับชั้นของหน่วยความจำ (L1 → L2 → L3 → RAM) แทนที่จะใช้หน่วยความจำชนิดเดียว

<details><summary>👉 ตัวอย่างคำตอบ</summary>

**ส่วนที่ 1 — Machine Cycle 4 ขั้นตอน**

| ขั้น | ผู้ดำเนินการ | รายละเอียด |
|---|---|---|
| **S1 Fetch** | **Control Unit** | ดึงคำสั่ง (instructions) และข้อมูลจาก **memory** |
| **S2 Decode** | **Control Unit** | ถอดรหัสคำสั่ง แล้วส่งคำสั่งและข้อมูลไปยัง **ALU** |
| **S3 Execute** | **ALU** | ทำการคำนวณ (arithmetic, comparison และการดำเนินการอื่น) กับข้อมูล |
| **S4 Store** | — | ผลลัพธ์ถูกเก็บกลับใน **memory** และปรากฏบนหน้าจอ |

วงจรนี้วนซ้ำต่อเนื่อง โดยมี **system clock** ควบคุมจังหวะเวลา (clock speed วัดเป็น GHz; 1 GHz = 1,000,000,000 cycles/second) และมี **register** ในโปรเซสเซอร์ทำหน้าที่เก็บข้อมูลกับคำสั่งไว้ชั่วคราวในตำแหน่งที่เข้าถึงได้เร็วมาก

**ส่วนที่ 2 — เหตุผลของลำดับชั้นหน่วยความจำ**

หน่วยความจำมี **การแลกเปลี่ยน (trade-off) ระหว่างความเร็ว ความจุ และราคา** กล่าวคือ:
- หน่วยความจำที่**เร็ว**มักมี**ความจุน้อย**และ**ราคาแพง** (SRAM ที่ใช้ทำ cache)
- หน่วยความจำที่**ความจุมาก**มัก**ช้ากว่า**แต่**ราคาถูก** (DRAM ที่ใช้ทำ main memory)

ถ้าใช้ SRAM ทั้งหมดจะเร็วมากแต่แพงเกินไปและความจุไม่พอ ถ้าใช้ DRAM ทั้งหมดจะราคาถูกแต่ CPU ต้องรอข้อมูลนาน จึงเกิดลำดับชั้น:

```
Fast/Small  L1 cache  (บน processor chip)
            L2 cache  (บน processor chip)
            L3 cache  (บน mainboard)
Slow/Large  RAM       (บน mainboard)
```

**หลักการทำงาน:** memory cache เก็บ **คำสั่งและข้อมูลที่ถูกใช้บ่อย** ไว้ใกล้ CPU ที่สุด ทำให้ CPU ดึงข้อมูลส่วนใหญ่ได้จาก cache ที่เร็วมาก แทนที่จะต้องไปดึงจาก RAM ที่ช้ากว่าทุกครั้ง จึง **เร่งกระบวนการของคอมพิวเตอร์โดยรวม** ในราคาที่ยอมรับได้ — เป็นการได้ความเร็วใกล้เคียง SRAM ในราคาใกล้เคียง DRAM
</details>

---

### ข้อ 2. (Lecture 06 — Booting & Power Management: สถานการณ์)

**สถานการณ์:** นักศึกษาคนหนึ่งกำลังทำรายงานบนแล็ปท็อป และพบปัญหา 3 อย่างในวันเดียวกัน:
1. โปรแกรม Word ค้างไม่ตอบสนอง แต่เครื่องยังทำงานอยู่
2. หลังจากนั้นเมาส์ USB ที่เพิ่งเสียบใหม่ไม่ทำงาน สงสัยว่าฮาร์ดแวร์มีปัญหา
3. ตอนเย็นต้องเดินทาง 3 ชั่วโมง อยากปิดเครื่องแต่ไม่อยากเสียงานที่เปิดค้างไว้ และกังวลว่าแบตจะหมดระหว่างทาง

**คำถาม:** จงแนะนำวิธีจัดการแต่ละสถานการณ์ พร้อมอธิบายเหตุผลเชิงเทคนิค

<details><summary>👉 ตัวอย่างคำตอบ</summary>

**สถานการณ์ที่ 1 — โปรแกรมค้าง → ใช้ Warm Boot**

**Warm boot** คือการรีสตาร์ตเครื่องขณะที่เครื่อง **ยังเปิดอยู่ (remains powered on)** เหมาะกับกรณีนี้เพราะกระบวนการ warm boot **ล้างหน่วยความจำ (clears memory)** ซึ่งเพียงพอที่จะแก้ปัญหาโปรแกรมหรือแอปที่หยุดทำงาน นอกจากนี้ warm boot ยัง **เร็วกว่า cold boot** เพราะ **ข้ามคำสั่ง start-up บางส่วน** ที่เป็นส่วนหนึ่งของ cold boot ไป

**สถานการณ์ที่ 2 — สงสัยปัญหาฮาร์ดแวร์ → ใช้ Cold Boot**

**Cold boot** คือการเริ่มเครื่องจากสถานะที่ **ปิดสนิท (powered off completely)** บทเรียนแนะนำให้ใช้ cold boot เมื่อสงสัยปัญหาฮาร์ดแวร์ เพราะกระบวนการนี้จะ **ตรวจจับและตรวจสอบอุปกรณ์ฮาร์ดแวร์ที่เชื่อมต่อ**

เหตุผลเชิงลึกอยู่ที่ **Step 3 ของกระบวนการ start-up:** ระบบจะรันชุดการทดสอบเพื่อตรวจสอบส่วนประกอบต่าง ๆ ได้แก่ **buses, system clock, adapter cards, RAM chips, mouse, keyboard และ drives** รวมถึงตรวจว่าอุปกรณ์ต่อพ่วงเชื่อมต่อถูกต้องและทำงานปกติหรือไม่ หากพบปัญหาเครื่องจะ **ส่งเสียงบี๊บ แสดงข้อความ error หรือหยุดทำงาน** ตามความรุนแรงของปัญหา

นอกจากนี้ควรตรวจสอบเรื่อง **driver** ด้วย เพราะอุปกรณ์แต่ละชิ้นมีชุดคำสั่งเฉพาะและต้องมี driver ของตัวเอง ซึ่งต้องติดตั้งก่อนจึงใช้งานได้ หากอุปกรณ์รองรับ **Plug and Play** ระบบปฏิบัติการจะโหลด driver ที่จำเป็นอัตโนมัติและตรวจสอบความขัดแย้งกับอุปกรณ์อื่นให้

**สถานการณ์ที่ 3 — เดินทางนาน กังวลแบตหมด → ใช้ Hibernate Mode**

เปรียบเทียบสองโหมด:

| | **Sleep Mode** | **Hibernate Mode** |
|---|---|---|
| บันทึกงานที่เปิดอยู่ไปที่ | **RAM** | **Internal hard drive** |
| สถานะพลังงาน | low-power state (ยังจ่ายไฟ) | **ตัดไฟออกจากเครื่อง** |
| ความเสี่ยง | **ถ้าไฟถูกตัดออกไป งานที่ยังไม่บันทึกอาจสูญหาย** | ไม่เสี่ยง เพราะเก็บลงดิสก์แล้ว |

กรณีนี้ควรเลือก **Hibernate mode** เพราะบันทึกเอกสารและโปรแกรมที่เปิดอยู่ทั้งหมดลง **internal hard drive** ก่อนตัดไฟออกจากเครื่อง ดังนั้นแม้แบตเตอรี่จะหมดระหว่างเดินทาง งานก็จะไม่สูญหาย ต่างจาก sleep mode ที่เก็บไว้ใน **RAM** ซึ่งเป็น **volatile memory** — หากไฟถูกตัดออกไป งานที่ยังไม่ได้บันทึกจะสูญหาย
</details>

---

### ข้อ 3. (Lecture 05 — HDD vs SSD & RAID: สถานการณ์)

**สถานการณ์:** บริษัทแห่งหนึ่งกำลังจะอัปเกรดระบบจัดเก็บข้อมูล ผู้บริหารถามว่า (ก) ควรเปลี่ยนจาก HDD เป็น SSD หรือไม่ (ข) ทำไมต้องใช้ RAID และ Mirroring กับ Striping ต่างกันอย่างไร (ค) บริษัทควรเลือก NAS หรือ SAN

**คำถาม:** จงตอบคำถามทั้งสามข้อโดยอ้างอิงเนื้อหาในบทเรียน

<details><summary>👉 ตัวอย่างคำตอบ</summary>

**(ก) HDD vs SSD**

**HDD (Hard Disk Drive)** ประกอบด้วย **จานกลมแข็ง (platters)** หนึ่งแผ่นหรือมากกว่า ที่ใช้ **อนุภาคแม่เหล็ก** เก็บข้อมูล มี **read/write heads** เคลื่อนอยู่เหนือ platter ความจุขึ้นกับ **จำนวน platters, การบันทึกแบบ longitudinal หรือ perpendicular, และ density** เนื่องจากมีชิ้นส่วนกลไก **ชิ้นส่วนกลไกเหล่านี้จึงส่งผลโดยตรงต่อ access time** และยังเสี่ยงต่อ **head crash** เมื่อ read/write head สัมผัสผิว platter (เกิดจากเส้นผม ฝุ่น หรือควันที่ใหญ่กว่าระยะ clearance)

**SSD (Solid-State Drive)** เป็นอุปกรณ์จัดเก็บแบบ **flash memory ที่มีโปรเซสเซอร์ของตัวเอง** เพื่อจัดการการจัดเก็บ มี **ข้อได้เปรียบเหนือ HDD 9 ประการ:** เข้าถึงเร็วกว่า (faster access times), อัตราถ่ายโอนเร็วกว่า, ทำงานเงียบกว่า, ทนทานกว่า, น้ำหนักเบากว่า, กินไฟน้อยกว่า, สร้างความร้อนน้อยกว่า, อายุการใช้งานยาวกว่า และ **ไม่ต้องทำ defragmentation**

**สรุปคำแนะนำ:** ควรเปลี่ยนเป็น SSD หากต้องการประสิทธิภาพและความทนทาน เพราะจากพีระมิด access time นั้น **SSD เร็วกว่า Hard Disk** (ลำดับความเร็ว: RAM > SSD > Hard Disk > USB Flash Drive > Memory Card > Optical Disc)

**(ข) RAID, Mirroring และ Striping**

**RAID (Redundant Array of Independent Disks)** คือเทคโนโลยี **data storage virtualization** เป็นกลุ่มของ hard disk หรือ SSD **ตั้งแต่ 2 ตัวขึ้นไป** ที่รวมกันเพื่อวัตถุประสงค์ **(1) data redundancy (2) performance improvement หรือ (3) ทั้งสองอย่าง**

ในบริบท **Enterprise Storage** องค์กรขนาดใหญ่ใช้ RAID เพื่อ **ทำสำเนาข้อมูล คำสั่ง และสารสนเทศ เพื่อเพิ่มความน่าเชื่อถือของข้อมูล (data reliability)** โดยฮาร์ดแวร์ระดับองค์กรออกแบบมาเพื่อ **การใช้งานหนัก ประสิทธิภาพสูงสุด และความพร้อมใช้งานสูงสุด**

| เทคนิค | หลักการ | เน้นอะไร |
|---|---|---|
| **Mirroring** | ทำสำเนาข้อมูลชุดเดียวกัน (A และ A') ไว้บนดิสก์คนละตัว | **ความซ้ำซ้อน/ความน่าเชื่อถือ** — ถ้าดิสก์หนึ่งเสีย ยังมีสำเนาอีกชุด |
| **Striping** | แบ่งข้อมูลกระจายเก็บลงหลายดิสก์ (Disk1: A1 B1 C1 / Disk2: A2 B2 C2) | **ประสิทธิภาพ** — อ่าน/เขียนหลายดิสก์พร้อมกันได้ |

**(ค) NAS หรือ SAN**

| | **NAS** | **SAN** |
|---|---|---|
| **คืออะไร** | **เซิร์ฟเวอร์ (server)** ที่วางอยู่บนเครือข่าย | **เครือข่ายความเร็วสูง (high-speed network)** |
| **วัตถุประสงค์เดียว** | ให้พื้นที่จัดเก็บแก่ **ผู้ใช้ คอมพิวเตอร์ และอุปกรณ์ที่ต่อกับเครือข่าย** | ให้พื้นที่จัดเก็บแก่ **เซิร์ฟเวอร์อื่น ๆ ที่ต่ออยู่** |

**คำแนะนำ:** ถ้าต้องการให้ **ผู้ใช้และเครื่องลูกข่ายทั่วไป** ใช้พื้นที่ร่วมกัน ควรเลือก **NAS** แต่ถ้าองค์กรมี **เซิร์ฟเวอร์หลายตัว** ที่ต้องการพื้นที่จัดเก็บส่วนกลางความเร็วสูง (โดยเชื่อมกับ RAID, Tape, Optical Disc) ควรเลือก **SAN**

> หมายเหตุ: ทั้ง NAS และ SAN จัดอยู่ในระดับ **Tertiary Storage** ซึ่งเข้าถึงได้ผ่านอุปกรณ์เครือข่ายเท่านั้น และเข้าถึงช้ากว่า secondary storage
</details>

---

### ข้อ 4. (Lecture 01 + 07 — Malware & Security Tools: สถานการณ์)

**สถานการณ์:** พนักงานคนหนึ่งได้รับอีเมลหน้าตาเป็นทางการอ้างว่ามาจากธนาคาร ให้คลิกลิงก์เพื่อยืนยันข้อมูลบัญชี เขาคลิกและดาวน์โหลดไฟล์ชื่อ "screen_saver_free.exe" มารัน หลังจากนั้นเครื่องเริ่มมีโฆษณาเด้งขึ้นมาตลอด ทำงานช้าลง และเพื่อนร่วมงานหลายเครื่องในเครือข่ายเดียวกันก็เริ่มมีอาการช้าลงเช่นกัน

**คำถาม:** จงระบุภัยคุกคามที่น่าจะเกิดขึ้นในสถานการณ์นี้ อธิบายวงจรการทำงานของไวรัส และแนะนำเครื่องมือความปลอดภัยที่ควรใช้

<details><summary>👉 ตัวอย่างคำตอบ</summary>

**ส่วนที่ 1 — ระบุภัยคุกคาม**

| อาการ | ภัยคุกคาม | นิยาม |
|---|---|---|
| อีเมลหน้าตาเป็นทางการอ้างว่ามาจากธนาคาร ขอข้อมูลบัญชี | **Phishing** | การหลอกลวงที่ผู้กระทำผิดส่งอีเมลที่ดูเป็นทางการ เพื่อพยายามให้ได้ข้อมูลส่วนตัวและ/หรือทางการเงินของคุณ |
| ไฟล์ "screen_saver_free.exe" ที่ดูไร้พิษภัย | **Trojan horse** | โปรแกรมทำลายที่ **ปลอมตัวเป็นโปรแกรมจริง เช่น screen saver**; เมื่อรัน โทรจันที่ซ่อนอยู่สามารถ **จับข้อมูล เช่น ชื่อผู้ใช้และรหัสผ่าน** หรือให้ใครบางคน **ควบคุมเครื่องจากระยะไกล**; ⚠️ **ต่างจากไวรัส โทรจันไม่ทำสำเนาตัวเอง** |
| โฆษณาเด้งขึ้นตลอด | **Adware** | โปรแกรมที่แสดงโฆษณาออนไลน์ในแบนเนอร์ หรือหน้าต่าง **pop-up/pop-under** บนเว็บเพจ ข้อความอีเมล หรือบริการอินเทอร์เน็ตอื่น |
| เครื่องอื่นในเครือข่ายเดียวกันช้าลงตามไปด้วย | **Worm** | **อยู่ใน active memory** และ **ทำสำเนาตัวเองผ่านเครือข่าย** เพื่อติดเชื้อเครื่องอื่น **ใช้ทรัพยากรระบบจนหมดและอาจทำให้ระบบล่ม** |
| (อาจมีร่วมด้วย) เครื่องถูกควบคุมจากระยะไกลโดยไม่รู้ตัว | **Rootkit** | โปรแกรมที่ซ่อนตัวได้ง่ายและให้ควบคุมเครื่องเต็มรูปแบบจากระยะไกล; เช่น ซ่อนในโฟลเดอร์ที่ดูว่างเปล่า เพราะสั่งไม่ให้คอมพิวเตอร์แสดงเนื้อหา; **อันตรายมากและมักต้องใช้ซอฟต์แวร์พิเศษตรวจจับและกำจัด** |
| (อาจมีร่วมด้วย) ข้อมูลถูกส่งออกไปภายนอก | **Spyware** | โปรแกรมที่วางบนเครื่องโดยผู้ใช้ไม่รู้ ซึ่งแอบเก็บข้อมูลเกี่ยวกับผู้ใช้ แล้วส่งไปยังแหล่งภายนอกขณะผู้ใช้ออนไลน์ |

**ส่วนที่ 2 — วงจรการทำงานของไวรัส**

**Infection Phase (ระยะติดเชื้อ)** — ขั้นแรกคือ **การ activate ไวรัส** และ **วิธีแพร่กระจายที่พบบ่อยที่สุดคือผู้ใช้รันโปรแกรมหรือแอปที่ติดเชื้อ** (ตรงกับสถานการณ์นี้ที่พนักงานรันไฟล์ .exe)

1. **Replicate** — ไวรัสทำสำเนาตัวเองโดย **แนบตัวเองเข้ากับไฟล์โปรแกรม**
2. **Conceal** — ไวรัส **ปกปิดตัวเองเพื่อหลบเลี่ยงการตรวจจับ**
3. **Trigger** — ไวรัส **เฝ้ารอเงื่อนไขหรือเหตุการณ์บางอย่าง** แล้วทำงานเมื่อเงื่อนไขนั้นเกิดขึ้น เช่น การเริ่มเครื่อง หรือการถึงวันที่ตามนาฬิกาของระบบ

**Delivery Phase (ระยะส่งมอบ)** — ไวรัส **ปลดปล่อย payload** ซึ่งอาจเป็นการล้อเล่นที่ไม่เป็นอันตรายที่แสดงข้อความไร้ความหมาย หรืออาจเป็นการทำลาย โดยทำให้ข้อมูลและไฟล์เสียหายหรือถูกลบ

⚠️ **ข้อควรระวังที่สำคัญ:** **ไวรัสที่อันตรายที่สุดคือไวรัสที่ไม่มี payload ที่เห็นได้ชัด** เพราะมันจะ **แก้ไขไฟล์อย่างเงียบ ๆ** ด้วยเหตุนี้ วิธีหนึ่งที่ antivirus ใช้ตรวจจับไวรัสจึงเป็นการ **เฝ้าติดตามไฟล์เพื่อหาการเปลี่ยนแปลงที่ไม่ทราบที่มา (unknown changes)**

> (จากโน้ตชั้นเรียน วงจรชีวิตไวรัส 4 ระยะ: **Dormant → Propagation → Trigger → Execution**)

**ส่วนที่ 3 — เครื่องมือความปลอดภัยที่แนะนำ**

| เครื่องมือ | หน้าที่ | แก้ปัญหาข้อใด |
|---|---|---|
| **Antivirus program** | ปกป้องเครื่องจากไวรัสโดย **ระบุและกำจัดไวรัสที่พบใน memory, บน storage media, หรือในไฟล์ขาเข้า** (เช่น AVG, McAfee) | Trojan, Virus, Worm |
| **Personal firewall** | **ตรวจจับและปกป้องเครื่องและข้อมูลจากการบุกรุกที่ไม่ได้รับอนุญาต** | การควบคุมเครื่องจากระยะไกล |
| **Adware remover** | ตรวจจับและลบ adware | โฆษณาเด้ง |
| **Spyware remover** | ตรวจจับและลบ spyware และโปรแกรมคล้ายกัน | การแอบเก็บข้อมูล |
| **Phishing filter** | กรองอีเมลหลอกลวงที่พยายามขอข้อมูลส่วนตัว/การเงิน | อีเมลปลอมจากธนาคาร |
| **Pop-up / Pop-under blocker** | บล็อกโฆษณาที่ปรากฏขึ้นในหน้าต่างใหม่ทับเว็บเพจ | โฆษณาเด้ง |
| **Anti-spam program** | กรอง **spam** = อีเมลหรือโพสต์ที่ไม่ได้ร้องขอ ที่ส่งไปยังผู้รับจำนวนมากในคราวเดียว | อีเมลขยะ |
| **Web filtering software** | จำกัดการเข้าถึงเนื้อหาบางอย่างบนเว็บ | ป้องกันการเข้าเว็บอันตราย |

**มาตรการเพิ่มเติมด้าน Privacy:** ควรใช้รหัสผ่านที่ **strong, long, unique** ประกอบด้วยตัวอักษร ตัวเลข และสัญลักษณ์ (ASCII-standard characters เท่านั้น) หลีกเลี่ยงข้อมูลส่วนตัวและคำทั่วไป ซ่อนรหัสที่จดไว้ และจัดการรหัสด้วยเครื่องมือ (password manager) เพื่อป้องกัน **identity theft และ financial fraud**
</details>

---

### ข้อ 5. (Lecture 01–07 — Integration: Input → Process → Output → Storage)

**สถานการณ์:** โรงพยาบาลแห่งหนึ่งต้องการปรับปรุงระบบ โดยมีความต้องการดังนี้:
1. รับข้อมูลผู้ป่วยจาก **แบบสอบถามที่ผู้ป่วยฝนคำตอบด้วยดินสอ** และจาก **บัตรประจำตัวที่ติดชิปไร้สัมผัส**
2. ระบบต้อง **ประมวลผลเช็คที่รับจากผู้ป่วย**
3. ต้อง **พิมพ์ป้ายข้อมือผู้ป่วย** และ **พิมพ์ฟิล์มเอกซเรย์ขนาดใหญ่คุณภาพสูง**
4. เก็บข้อมูลผู้ป่วยไว้ในระบบฐานข้อมูล และแปลงเอกสารทั้งหมดให้อยู่ในรูปแบบที่ทุกคนเปิดดูได้แม้ไม่มีโปรแกรมต้นฉบับ

**คำถาม:** จงเลือกเทคโนโลยีที่เหมาะสมกับแต่ละความต้องการ พร้อมอธิบายเหตุผล และระบุว่าซอฟต์แวร์ประเภทใดควรถูกนำมาใช้

<details><summary>👉 ตัวอย่างคำตอบ</summary>

**ความต้องการที่ 1 — รับข้อมูลจากแบบสอบถามและบัตรไร้สัมผัส**

| เทคโนโลยี | เหตุผล |
|---|---|
| **OMR (Optical Mark Recognition)** | เป็นกระบวนการ **จับข้อมูลที่มนุษย์ทำเครื่องหมาย (human-marked data)** จากแบบฟอร์ม เช่น **แบบสำรวจและข้อสอบ** ใช้อ่านแบบสอบถามและกระดาษคำตอบในรูปแบบ **พื้นที่ที่ฝนดำ** ตรงกับความต้องการพอดี |
| **NFC (Near Field Communication) หรือ RFID** | **NFC** — อุปกรณ์ที่รองรับมี **NFC chip**; **NFC tag** ประกอบด้วย **chip และ antenna** ที่บรรจุข้อมูลที่จะส่ง<br>**RFID** — ใช้ **สัญญาณวิทยุ** สื่อสารกับ tag ที่อยู่ในหรือติดกับวัตถุ โดย **RFID reader** อ่านข้อมูลบน tag ผ่านคลื่นวิทยุ |

> ⚠️ **ไม่ควรเลือก OCR** เพราะ OCR ใช้กับ **ข้อความที่พิมพ์หรือเขียน** ในเอกสารสแกน/ไฟล์ภาพ ไม่ใช่เครื่องหมายที่ฝน

**ความต้องการที่ 2 — ประมวลผลเช็ค**

**MICR (Magnetic Ink Character Recognition)** — อุปกรณ์ MICR **อ่านข้อความที่พิมพ์ด้วยหมึกแม่เหล็ก** และ **MICR reader** แปลงอักขระ MICR เป็นรูปที่คอมพิวเตอร์ประมวลผลได้ บทเรียนระบุชัดว่า **อุตสาหกรรมธนาคารใช้ MICR สำหรับการประมวลผลเช็ค (check processing)**

**ความต้องการที่ 3 — พิมพ์ป้ายข้อมือและฟิล์มเอกซเรย์ขนาดใหญ่**

| งาน | เครื่องพิมพ์ | เหตุผล |
|---|---|---|
| ป้ายข้อมือผู้ป่วย | **Label Printer** | เครื่องพิมพ์เล็กที่ **พิมพ์บนวัสดุกาว (adhesive-type material)** ที่ติดบนสิ่งของหลากหลายได้ |
| ภาพขนาดใหญ่คุณภาพสูง | **Large-format Printer** | สร้างงานพิมพ์สีคุณภาพ **photo-realistic** |

ทั้งสองเป็น **Nonimpact Printer** ซึ่ง **สร้างตัวอักษรและกราฟิกบนกระดาษโดยไม่สัมผัสกระดาษจริง ๆ** — เหมาะกับสภาพแวดล้อมโรงพยาบาลที่ต้องการความเงียบและความสะอาด ต่างจาก **Impact Printer** (เช่น dot matrix) ที่ **ตอกกลไกกระทบผ้าหมึกที่สัมผัสกระดาษ** ซึ่งเสียงดังกว่า

**ความต้องการที่ 4 — ฐานข้อมูลและการแปลงเอกสาร**

| ซอฟต์แวร์ | นิยามและเหตุผล |
|---|---|
| **Database software (DBMS)** | **Database** = การรวบรวมข้อมูลที่จัดระเบียบในลักษณะที่ให้เข้าถึง เรียกคืน และใช้ข้อมูลนั้นได้<br>**DBMS (Database Management System)** = แอปที่ให้ผู้ใช้ **สร้าง เข้าถึง และจัดการฐานข้อมูล** — เพิ่ม เปลี่ยน ลบข้อมูล; เรียงและดึงข้อมูล; สร้าง forms และ reports<br>โครงสร้าง: ฐานข้อมูลประกอบด้วย **tables** ที่จัดเป็นแถวและคอลัมน์ โดยแต่ละ **row = record** (ข้อมูลของผู้ป่วยหนึ่งคน) และแต่ละ **column = field** (หมวดข้อมูลเฉพาะ เช่น ชื่อ อายุ กรุ๊ปเลือด) |
| **Document management software** | ให้วิธี **แบ่งปัน แจกจ่าย และค้นหาเอกสาร** โดย **แปลงให้อยู่ในรูปแบบที่ผู้ใช้ใด ๆ ก็ดูได้**<br>เอกสารที่แปลงแล้ว **สะท้อนหน้าตาของเอกสารต้นฉบับ** และ **ดูและพิมพ์ได้โดยไม่ต้องมีซอฟต์แวร์ที่สร้างเอกสารต้นฉบับ** — ตรงกับความต้องการพอดี<br>บางตัวยังให้ **แก้ไขเนื้อหาและเพิ่มความเห็น** ลงในเอกสารที่แปลงแล้ว<br>**รูปแบบไฟล์ที่นิยม: PDF (Portable Document Format) พัฒนาโดย Adobe Systems** |

**ข้อเสนอแนะด้าน Storage:** เนื่องจากเป็นข้อมูลผู้ป่วยที่สำคัญ ควรใช้ **RAID** เพื่อ **data redundancy** โดยเฉพาะแบบ **Mirroring** เพื่อความน่าเชื่อถือ และควรใช้ **Enterprise Storage** ที่ออกแบบมาเพื่อ **การใช้งานหนัก ประสิทธิภาพสูงสุด และความพร้อมใช้งานสูงสุด** ร่วมกับการเลือก **SSD** ที่ให้ **faster access times, more durable และ less heat generation** สำหรับข้อมูลที่ต้องเข้าถึงบ่อย

**สรุปการไหลของข้อมูลตามแบบจำลองพื้นฐาน:**

```
Input (OMR, NFC/RFID, MICR)  →  Computer/Process (DBMS)  →  Output (Label Printer, Large-format Printer)
        [Data]                          ↕                              [Information]
                                Storage (SSD/RAID/Enterprise Storage)
```
</details>

---

# ✅ เช็กลิสต์ทบทวนก่อนเข้าห้องสอบ

## 🔥 หัวข้อที่มีโอกาสออกสูงสุด (Top Priority)

- [ ] **Machine Cycle 4 ขั้น** + ใครทำขั้นไหน (Fetch/Decode = CU · Execute = ALU)
- [ ] **ตารางความจุ KB→YB** ทั้ง 10ⁿ และ 2ⁿ
- [ ] **8 bits = 1 byte = 1 character** + การแปลง binary ↔ decimal ↔ ASCII
- [ ] **Volatile vs Non-volatile** + **SRAM vs DRAM** + ลำดับชั้น cache L1/L2/L3/RAM
- [ ] **Type of AI: ANI / AGI / ASI** (ANI = มีจริงเท่านั้น)
- [ ] **Moore's Law: 1965 / 1975 / 2015**
- [ ] **Class of Computer 4 กลุ่ม** + Rack vs Blade Server
- [ ] **8 Input methods + 6 Output methods**
- [ ] **VGA / DVI / HDMI / DisplayPort**
- [ ] **OCR / OMR / MICR / RFID / Bar code / QR code / Magstripe**
- [ ] **Nonimpact vs Impact printer** + ชนิดย่อยทั้งหมด
- [ ] **Primary / Secondary / Offline / Tertiary Storage**
- [ ] **PIT = 0, LAND = 1** + CD/DVD formats (ROM / R / RW)
- [ ] **SD 2GB / SDHC 32GB / SDXC 2TB / SDUC 128TB**
- [ ] **SSD 9 ข้อได้เปรียบ** + RAID (Mirroring vs Striping) + **NAS vs SAN**
- [ ] **หน้าที่ของ OS 11 ข้อ** + **Booting 5 Steps** + **Kernel**
- [ ] **Cold vs Warm boot** + **Sleep vs Hibernate**
- [ ] **GUI / CLI / NUI** + Single/Multi tasking + Single/Multi user
- [ ] **Virtual memory: Swap file / Page / Paging / Thrashing**
- [ ] **Buffer / Spooling / Queue / Print spooler**
- [ ] **Backward vs Upward compatible**
- [ ] **Obtaining software 8 ประเภท** (โดยเฉพาะ Freeware vs Open source vs Public-domain)
- [ ] **Record (แถว) vs Field (คอลัมน์)** + Formula vs Function
- [ ] **Virus / Worm / Trojan / Rootkit / Spyware / Adware** (Trojan ไม่ replicate!)
- [ ] **Internet filter 4 ชนิด** + Phishing

## ⚡ เทคนิคทำข้อสอบ

1. **ระวังคำว่า "ไม่ถูกต้อง" / "ยกเว้น"** — อ่านโจทย์ให้ครบก่อนตอบ
2. **ตัวเลือกที่สลับคุณสมบัติกัน** เป็นตัวลวงที่พบบ่อยที่สุด (เช่น SRAM ↔ DRAM, PIT ↔ LAND, Cold ↔ Warm boot)
3. **ตัวเลือกที่เนื้อหาถูกแต่ผิดหัวข้อ** เช่น เอานิยาม Fetch มาตอบคำถามเรื่อง Decode
4. **จำคีย์เวิร์ดเฉพาะ** ที่ปรากฏในสไลด์ เช่น "the only AI that exists today", "It is not I/O device", "Power off, all server is off", "without retraining"
5. **ตัวเลขต้องแม่น** — ปี, ความจุ, จำนวน (127 USB, 104 keys, 200 users, 5–7 นิ้ว)

---

> 📌 **ที่มาของเนื้อหา:** สังเคราะห์จากสไลด์ ITF-Lecture 00–05, ITF06-OS69, ITF07-PrgApp69 (PDF), หน้ารายวิชาบน OnLearn KMITL และสมุดจดบันทึกในชั้นเรียน 26 หน้า
> ✍️ จัดทำเพื่อการทบทวนก่อนสอบกลางภาค 1/2026 — **ขอให้โชคดีในการสอบครับ/ค่ะ! 🎓**
