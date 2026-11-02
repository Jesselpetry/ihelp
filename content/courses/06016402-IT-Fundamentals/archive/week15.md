# สัปดาห์ที่ 15 · IT Skills and System

> บรรยาย onsite ที่คณะ อ. 27 ต.ค. 2569 โดย ผศ.ดร. สุวิทย์ ภูมิฤทธิกุล (สไลด์ 72 หน้า) · แล็บออนไลน์ผ่าน Zoom ศ. 23 ต.ค. 2569 เวลา 09:00–11:00 (Web Deployment)
>
> สไลด์บรรยายฉบับ 1/2569 และใบงานแล็บของปีนี้อยู่ในคลังเรียบร้อยแล้ว · สรุปเนื้อหาด้านล่างครอบคลุมทั้ง Digital Skills, Web Server / Deployment และทฤษฎี Information System & SDLC

> **ระดับความเน้นสอบปลายภาค ⭐ อ่านผ่าน จำคีย์เวิร์ด** — มาจากสรุปของเพื่อนร่วมรุ่น ไม่ใช่ประกาศของผู้สอน · สไลด์ฉบับแปลไทยทีละหัวข้อ: `itf-sheet-week15-digital-skills-th.pdf` · [โน้ตสรุปของ Tammadon Suksa (IT24) บน Notion](https://app.notion.com/p/ITF-407363d85cea806abdc6c9ec2254f668) — ฉบับเต็มพร้อมรูปอยู่ [ท้ายหน้า](#โน้ตสรุปจาก-notion-tammadon-suksa-it24)

## อ่านจบแล้วต้องตอบได้

- อธิบายความสำคัญของ **Digital Skills** ต่อตลาดแรงงาน (Thailand Salary Guide)
- บอกขั้นตอนการทำงานของ **Web Server (Ubuntu + Nginx)** และการรีโมตด้วย **SSH**
- บอกขั้นตอนการ **Deploy เว็บไซต์ขึ้น Vercel** และเชื่อมต่อกับ GitHub
- บอกองค์ประกอบของ information system (ต่อจาก Week 10)
- เรียงเฟสของ **SDLC** และบอกงานหลักของแต่ละเฟส
- แยก feasibility 4 ด้าน และ **functional กับ non-functional requirement**
- บอกเทคนิคเก็บข้อมูลความต้องการ รวมถึง JAD
- แยก Gantt chart กับ PERT chart

---

## เอกสารประจำสัปดาห์

| เอกสาร | หน้า | ไฟล์ในคลัง |
|---|:---:|---|
| สไลด์บรรยาย — IT Skills and System (ฉบับ 2569) | 72 | `itf-lec-week15-it-skills-system-2569.pdf` |
| สรุปฉบับแปลไทย — Week 15 ทักษะดิจิทัลและระบบสารสนเทศ | 1 | `itf-sheet-week15-digital-skills-th.pdf` |
| สไลด์ประกอบแล็บ — Web Deployment | 17 | `itf-lab-week15-web-deployment-slide.pdf` |
| ใบงานแล็บ — Web Deployment | 8 | `itf-lab-week15-web-deployment-sheet.pdf` |
| สไลด์ฉบับปีก่อน — Information System | 66 | `itf-lec-week14-it-system.pdf` |

---

## สรุปอ่านสอบ (จากสไลด์ปีก่อน)

### 1. ทักษะดิจิทัลและ Information System

- สไลด์เปิดด้วยความต้องการทักษะดิจิทัล — salary guide, ทักษะที่ LinkedIn ต้องการ, roadmap.sh
- **Information system** = hardware (และเครือข่าย) · software · data · people · procedures ทำงานร่วมกันเพื่อผลิตสารสนเทศ
- ตัวอย่าง: จองตั๋วรถที่ช่องขาย → จองออนไลน์ · ตลาดสด → ตลาดออนไลน์ · กระดาษ → ดิจิทัล
- บทบาท: system analyst · system developer · system tester
- สไลด์ 2569 มีภาพวิวัฒนาการ **Web 1.0 → 2.0 → 3.0**: 1.0 อ่านอย่างเดียว (หน้าเว็บนิ่ง) · 2.0 ผู้ใช้สร้างและแชร์เนื้อหาเอง (social, mobile app) · 3.0 semantic web · กระจายอำนาจ (dApp) · AI *ยังไม่ยืนยัน — รายละเอียดมาจากสรุปเพื่อน สไลด์เป็นภาพ*

### 2. System Development และ SDLC

- **System development** = ชุดกิจกรรมสร้าง information system · จัดเป็นเฟสเรียกว่า **SDLC**
- เป้าหมาย: ระบบที่เชื่อถือได้ มีประสิทธิภาพ ดูแลรักษาได้ ส่งมอบตรงเวลาในงบประมาณ
- แนวทาง 3 ข้อ: จัดงานเป็นเฟส · ให้ผู้ใช้มีส่วนร่วม · กำหนดมาตรฐาน
- **Systems analyst** = ผู้ออกแบบพัฒนาระบบ และเป็นผู้ติดต่อหลักของผู้ใช้

`Planning → Analysis → Design → Implementation → Support & Security`

| เฟส | งานหลัก |
|---|---|
| **Planning** | steering committee รับคำขอ → ทบทวนและอนุมัติ · จัดลำดับความสำคัญ · จัดสรรทรัพยากร · ตั้งทีม |
| **Analysis** | preliminary investigation (feasibility study) → detailed analysis (logical design) → **system proposal** เสนอทางเลือก |
| **Design** | จัดหา hardware/software (RFQ · RFP · RFI) → ออกแบบละเอียด: database · input/output (mock-up, layout chart) · program |
| **Implementation** | เขียนโปรแกรม → ติดตั้งและทดสอบ → อบรมผู้ใช้ → เปลี่ยนไปใช้ระบบใหม่ |
| **Support & security** | บำรุงรักษา · เฝ้าดูประสิทธิภาพ · ประเมินความปลอดภัย |

- ทางเลือกใน system proposal: แก้ระบบเดิม · ซื้อ retail software · ใช้ web app · สร้าง custom software · outsource

| เอกสารขอราคา | ใช้เมื่อ |
|---|---|
| **RFQ** — request for quotation | รู้แล้วว่าต้องการสินค้าอะไร ให้ผู้ขายเสนอราคา |
| **RFP** — request for proposal | ให้ผู้ขายเลือกสินค้าที่ตรงความต้องการเองแล้วเสนอราคา |
| **RFI** — request for information | ขอข้อมูลสินค้าแบบไม่เป็นทางการ |

- **VAR** (value-added reseller) ซื้อจากผู้ผลิตมาขายต่อพร้อมบริการเสริม
- **Prototype (POC)** = ต้นแบบที่ทำงานได้เฉพาะส่วนสำคัญ · เอกสารมักไม่ครบ และผู้ใช้มักอยากใช้ต้นแบบเป็นระบบจริง
- **UX** = ความรู้สึกของผู้ใช้ต่อระบบ — "อย่าทำให้ฉันคิดเยอะ"

| การทดสอบ | ตรวจอะไร |
|---|---|
| Unit test | แต่ละโปรแกรมทำงานถูกต้องเดี่ยว ๆ |
| Systems test | ทุกโปรแกรมในแอปทำงานร่วมกันได้ |
| Integration test | แอปทำงานร่วมกับแอปอื่นได้ |
| Acceptance test | ผู้ใช้ตรวจว่าระบบทำงานกับข้อมูลจริงได้ |

- การเปลี่ยนระบบ 4 แบบ: **direct** (เปลี่ยนทันที) · **parallel** (ใช้คู่กัน) · **phased** (ทีละส่วน) · **pilot** (ทดลองที่เดียวก่อน)

### 3. เครื่องมือบริหารโครงการ

- **Project management** = วางแผน จัดตาราง ควบคุมกิจกรรม — ระบุ scope · เวลา · ต้นทุน · ลำดับงาน
- **Gantt chart** ง่าย · **PERT chart** (network diagram) ซับซ้อนกว่า เหมาะกับโครงการใหญ่

| Feasibility | ถามว่า |
|---|---|
| **Operational** | ผู้ใช้จะชอบและใช้ไหม ตรงความต้องการไหม |
| **Schedule** | deadline สมเหตุสมผลไหม |
| **Technical** | มีทรัพยากร ซอฟต์แวร์ และคนพอไหม |
| **Economic** (cost/benefit) | ประโยชน์ตลอดอายุมากกว่าต้นทุนไหม · ROI · payback |

- เก็บข้อมูลด้วย: review documentation · observe · survey · interview · **JAD session** (Joint Application Design) · research
  - **Survey**: closed question (วิเคราะห์ง่าย) · open question (ได้ความเห็นหลากหลาย)
  - **Interview**: structured (มีหัวข้อล่วงหน้า) · unstructured/flexible (ยืดหยุ่นตามประเด็น)
  - **JAD**: ประชุมผู้ใช้ เจ้าของระบบ ผู้บริหาร analyst นักออกแบบ โปรแกรมเมอร์ รวบรวม requirement ในคราวเดียว

| Requirement | ความหมาย |
|---|---|
| **Functional** | สิ่งที่ระบบต้องทำ — input · behavior · output |
| **Non-functional** | คุณสมบัติอื่น — UI, reliability, performance, security, ข้อจำกัด |

- ตัวอย่าง ATM: ตรวจบัตรและ PIN = functional · "เขียนด้วย C++" / เข้ารหัส 256-bit = non-functional
- **System proposal** เสนอต่อ steering committee ก่อนเข้า design phase
- ในเฟส design: สเปกทำเป็นเอกสารจัดซื้อ (RFQ · RFP · RFI) → ส่งให้ vendor หรือ VAR → ทดสอบและประเมินข้อเสนอ → ตัดสินใจ · ออกแบบ database ร่วมกับ DBA · มักออกแบบ **output ก่อน input**
- ในเฟส implementation: เขียนโปรแกรมโดย **Full Stack Developer** · อบรมผู้ใช้ได้ 3 แบบ (one-on-one · classroom · web-based)
- Conversion: **direct** เสี่ยงสุด · **parallel** ปลอดภัยสุด · **phased** ทีละส่วน · **pilot** ทดลองเต็มรูปแบบที่แผนก/สาขาเดียวก่อนขยาย

### 4. CI/CD (สไลด์ 2569)

| คำ | ความหมาย |
|---|---|
| **CI** — Continuous Integration | รวมโค้ดเข้าที่กลางอย่างต่อเนื่อง · Plan → Code → Build → Test → Merge |
| **CD** มี 2 ความหมาย | **Continuous Delivery** — โค้ดที่ผ่านทดสอบถูกเตรียมพร้อมปล่อยอัตโนมัติ · **Continuous Deployment** — deploy ขึ้น production อัตโนมัติ |

สไลด์ระบุเฉพาะชื่อ CI และ CD (Delivery หรือ Deployment) — คำอธิบายข้างบนมาจากสรุปเพื่อน *ยังไม่ยืนยัน*

### คีย์เวิร์ดต้องจำ

- **SDLC** = วงจรพัฒนาระบบ 5 เฟส: planning → analysis → design → implementation → support & security
- 3 แนวทาง: **group into phases · involve users · define standards**
- **Steering committee** รับ project request · planning 4 กิจกรรม: review/approve · prioritize · allocate resources · form team
- **Preliminary investigation** = feasibility study · **detailed analysis** = logical design
- **Feasibility 4 ด้าน**: operational · schedule · technical · economic
- **Functional** (ระบบต้องทำอะไร) vs **non-functional** (คุณสมบัติ: performance, security)
- **Survey** closed/open · **interview** structured/unstructured · **JAD**
- **System proposal** ทางเลือก: modify · buy retail · web app · custom · outsource
- **RFQ** (ระบุสินค้า ขอราคา) · **RFP** (ผู้ขายเลือกสินค้า) · **RFI** (ขอข้อมูล) · **VAR**
- **Mock-up** · **layout chart** · **prototype / POC**
- **Test 4 แบบ**: unit · systems · integration · acceptance (ข้อมูลจริง)
- **Conversion 4 แบบ**: direct · parallel · phased · pilot
- Support & security 3 งาน: maintenance · monitor performance · assess security
- **Gantt** (ง่าย) vs **PERT** (ซับซ้อน) · **CI/CD** · **Web 1.0 / 2.0 / 3.0**

---

## จุดที่มักพลาด

- Preliminary investigation เรียกอีกชื่อว่า **feasibility study** · detailed analysis เรียกว่า **logical design**
- "ระบบต้องตอบภายใน 2 วินาที" เป็น **non-functional** ไม่ใช่ functional
- Economic feasibility = cost/benefit — ไม่ใช่เรื่องเวลา
- **RFQ** รู้สินค้าแล้วขอแค่ราคา · **RFP** ให้ผู้ขายเลือกสินค้าเอง
- **Systems test** = โปรแกรมในแอปเดียวกันทำงานร่วมกัน · **integration test** = ทำงานร่วมกับแอปอื่น

---

## ทดสอบตัวเอง

1. เฟสแรกของ SDLC คืออะไร
2. "ผู้ใช้ต้องค้นหาสินค้าตามชื่อได้" เป็น requirement ชนิดใด
3. Feasibility ด้านใดถามว่าองค์กรมีคนและเทคโนโลยีพอหรือไม่
4. แผนภูมิใดเหมาะกับโครงการใหญ่ที่ซับซ้อน
5. การเปิดใช้ระบบใหม่คู่กับระบบเดิมช่วงหนึ่งเรียกว่า conversion แบบใด
6. การทดสอบที่ให้ผู้ใช้ลองกับข้อมูลจริงเรียกว่าอะไร
7. CI และ CD ย่อมาจากอะไร

**เฉลย** — 1. planning · 2. functional requirement · 3. technical feasibility · 4. PERT chart · 5. parallel conversion · 6. acceptance test · 7. CI = Continuous Integration · CD = Continuous Delivery หรือ Continuous Deployment

---

## แล็บ — Web Deployment (ศ. 23 ต.ค. 2569)

> นำเว็บไซต์ To-do List ที่พัฒนาขึ้นใน Lab 13–14 ขึ้นสู่ระบบออนไลน์จริง (Deploy) ผ่าน Vercel โดยเชื่อมต่อกับ GitHub Repository เพื่อให้เข้าถึงผ่าน URL สาธารณะได้ตลอดเวลา

### ขั้นตอนปฏิบัติการ

1. **เตรียม Repository บน GitHub**
   - นำไฟล์เว็บไซต์ (`index.html`, `script.js`, รูปภาพ/สไตล์) Push ขึ้นสู่ GitHub Repository ใหม่
2. **Deploy ผ่าน Vercel**
   - เข้า Vercel ล็อกอินผ่าน GitHub
   - กด **Add New... > Project** แล้วเลือก Import Repository ของตนเอง
   - ตั้งชื่อ **Project Name:** `itf-itxxxxxxxx` (แทน x ด้วยรหัสนักศึกษา)
   - เลือก **Framework Preset:** `Other` แล้วกดปุ่ม **Deploy**
   - ทดสอบเข้าชมผ่าน URL: `itf-itxxxxxxxx.vercel.app`
3. **AI CLI Agent (OpenCode MCP)**
   - ทดลองสั่ง AI CLI Agent ให้ช่วยจัดการการ Deploy ผ่าน Model Context Protocol (MCP)
4. **การส่งงานและการประเมิน**
   - ส่งผลงานผ่าน OnLearn ในช่องทางส่งงานของ Section ตนเอง
   - ทำแบบประเมินผู้สอนและพี่ TA ภายในวันศุกร์ที่ 30 ต.ค. 2569 เวลา 12:00 น. ผ่าน [กระทู้ OnLearn](https://onlearn.it.kmitl.ac.th/mod/forum/discuss.php?d=877)

---

## โน้ตสรุปจาก Notion · Tammadon Suksa (IT24)

> ขอบคุณ **Tammadon Suksa (IT24)** ที่สรุปและแชร์โน้ตชุดนี้ · คัดลอกจาก [ITF Week 15 บน Notion](https://app.notion.com/p/40b363d85cea80269a19f4494378a336) เมื่อ 1 พ.ย. 2569 พร้อมรูปประกอบ (ภาพสไลด์ของผู้สอนที่ผู้สรุปเขียนโน้ตทับ) · เนื้อหาเป็นสำนวนของผู้สรุป ถ้าต่างจากสไลด์ให้ยึดสไลด์ · จุดที่ iHelp ตรวจแล้วคลาดเคลื่อนมี ⚠️ กำกับไว้

System Development → คือกิจกรรมที่ใช้สร้างระบบสารสนเทศ เรียกว่า System Development life cycle (SDLC)
SDLC Goal → ระบบที่ตรงตามความต้องการของผู้ใช้ , น่าเชื่อถือ , efficient , พร้อมใช้งาน เเละเสร็จภายในงบประมาณที่กำหนด
**3 แนวทางปฏิบัติทั่วไป (General Guidelines)**:
1. **Group activities into phases** (แบ่งกิจกรรมเป็นเฟส)
2. **Involve users** (ให้ผู้ใช้งานมีส่วนร่วมทุกขั้นตอน)
3. **Define standards** (กำหนดมาตรฐานการทำงาน)

### 1.Planning Phase (เฟสวางแผน)

เริ่มขึ้นเมื่อ **Steering Committee (คณะกรรมการอำนวยการ)** ได้รับ **Project Request** โดยมี **4 กิจกรรมหลัก**:
1. **Review and approve project requests** (ทบทวนและอนุมัติคำขอโครงการ)
2. **Prioritize project requests** (จัดลำดับความสำคัญ)
3. **Allocate resources** (จัดสรรทรัพยากร)
4. **Form a project development team** (จัดตั้งทีมพัฒนาโครงการ)

### 2.Analysis Phase (เฟสวิเคราะห์)

เน้นการศึกษาการทำงานระบบเดิม และระบุความต้องการที่แท้จริงของผู้ใช้
- **2 กิจกรรมหลัก**:
  1. **Conduct a preliminary investigation**: การสืบสวนเบื้องต้นโดยการสัมภาษณ์ผู้ส่งคำขอเพื่อระบุปัญหา
  2. **Perform detailed analysis**: ศึกษาการทำงานระบบเดิม กำหนดความต้องการของผู้ใช้ และเสนอทางแก้
- *เทคนิคการเก็บรวบรวมข้อมูล (Data Gathering Techniques)**
  - **Review documentation** (ทบทวนเอกสาร)
  - **Observe** (สังเกตการณ์การทำงานจริง)
  - **Survey** (แบบสอบถาม: **Closed Questions** วิเคราะห์ง่าย / **Open Questions** ได้ความเห็นหลากหลาย)
  - **Interview** (สัมภาษณ์: **Structured** มีหัวข้อชัดเจนล่วงหน้า / **Unstructured/Flexible** ยืดหยุ่นปรับตามประเด็น)
  - **JAD Sessions (Joint Application Design)**: การประชุมร่วมกันระหว่างผู้ใช้ เจ้าของระบบ ผู้บริหาร SA นักออกแบบ และโปรแกรมเมอร์ เพื่อเก็บความต้องการพร้อมกันในคราวเดียว
- **ประเภทความต้องการ (Requirements)**:
  - **Functional Requirement**: ฟังก์ชันการทำงานที่ระบบต้องทำได้ (เช่น ถอนเงิน, โอนเงิน)
  - **Non-functional Requirement**: คุณสมบัติเชิงเทคนิค/ประสิทธิภาพ/ความปลอดภัย (เช่น เขียนด้วยภาษา C++, เข้ารหัส 256-bit, ประมวลผลภายใน 3 วินาที)
- **ผลลัพธ์สำคัญ**: **System Proposal** เอกสารเสนอทางเลือกที่เป็นไปได้ (เช่น Modify existing system, Buy retail software, Use web apps, Build custom software, Outsource) ให้ Steering Committee พิจารณาอนุมัติก่อนเข้าสู่เฟสถัดไป

### 3.Design Phase (เฟสออกแบบ)

แบ่งออกเป็น **2 กิจกรรมใหญ่**:
1. *Acquire hardware and software (จัดหาฮาร์ดแวร์/ซอฟต์แวร์)**:
   - **Identify technical specifications**: กำหนดสเปกผ่านเอกสารการจัดซื้อ (**Procurement Documents**) 3 แบบ:
     - **RFQ (Request for Quotation)**: ระบุสินค้าชัดเจน แล้วให้ Vendor **เสนอราคา**
     - **RFP (Request for Proposal)**: ระบุโจทย์ความต้องการ ให้ Vendor **เลือกสินค้าที่เหมาะสมพร้อมเสนอราคา**
     - **RFI (Request for Information)**: เอกสารไม่เป็นทางการเพื่อ **ขอข้อมูลสินค้า/บริการ** เพิ่มเติม
   - **Solicit vendor proposals**: ส่งเอกสารให้ Vendor หรือ **VAR (Value-Added Reseller)** ซึ่งเป็นบริษัทที่ซื้อสินค้าจากผู้ผลิตมาขายต่อพร้อมเสนอบริการเสริม
   - **Test, Evaluate vendor proposals & Make a decision**
2. *Develop detailed design specifications (ออกแบบรายละเอียดระบบ)**:
   - **Database design**: ออกแบบฐานข้อมูลร่วมกับ Database Administrator (DBA)
   - **Input and Output design**: ออกแบบหน้าจอ เมนู และรายงาน (มักออกแบบ Output ก่อน) ทำเป็น **Mock-up** และ **Layout chart**
   - **Program design**: เตรียม **Program specification package**
   - **Prototype / Proof of Concept (POC)**: โมเดลการทำงานจริงเพื่อทดสอบฟังก์ชันสำคัญของระบบ

### 4 Implementation Phase (เฟสนำไปปฏิบัติ/สร้างระบบ)

สร้างระบบและส่งมอบให้ผู้ใช้งาน
- **4 กิจกรรมหลัก**:
  1. **Develop programs and apps**: เขียนโค้ดพัฒนาโปรแกรมโดย **Full Stack Developer**
  2. *Install and test the new system (การทดสอบระบบ)**:
     - **Unit test**: ทดสอบว่าแต่ละโปรแกรม/ออบเจกต์เดี่ยวๆ ทำงานถูกต้อง
     - **Systems test**: ทดสอบว่าทุกโปรแกรมในแอปพลิเคชันทำงานร่วมกันได้ถูกต้อง
     - **Integration test**: ทดสอบว่าแอปพลิเคชันทำงานร่วมกับแอปพลิเคชันอื่นได้
     - **Acceptance test**: ทดสอบระบบด้วย **ข้อมูลจริง (Actual data)** เพื่อการยอมรับของผู้ใช้
  3. **Train users**: อบรมการใช้งาน (One-on-one, Classroom, Web-based)
  4. *Convert to the new system (กลยุทธ์การย้ายระบบ 4 แบบ)**:
     - **Direct conversion**: เลิกใช้ระบบเก่า เปลี่ยนเป็นระบบใหม่ทันที (ตึง/เสี่ยงสุด)
     - **Parallel conversion**: รันระบบเก่าและระบบใหม่ควบคู่กันไปช่วงหนึ่ง (ปลอดภัยสุด)
     - **Phased conversion**: ค่อยๆ เปลี่ยนทีละเฟส/ทีละมอดูล
     - **Pilot conversion**: ทดลองใช้ระบบใหม่เต็มรูปแบบในแผนก/สาขาสาธิตก่อน แล้วค่อยขยายผล

### 5. Support and Security Phase (เฟสสนับสนุนและความปลอดภัย)

การดูแลช่วยเหลือระบบและผู้ใช้งานอย่างต่อเนื่องหลังนำขึ้นใช้งานจริง
- **3 กิจกรรมหลัก**:
  1. **Perform maintenance activities** (บำรุงรักษาระบบ)
  2. **Monitor system performance** (เฝ้าระวังประสิทธิภาพ)
  3. **Assess system security** (ประเมินความปลอดภัย)
CI/CD
CI (Continuous Integration) → การรวมโค้ดเข้าสู่ระบบส่วนกลางตั้งเเต่ Plan → Code → Build → Test → Merge
CD → มีสองเเบบ
Continuous Delivery → กระบวนการผ่านการทดสอบเเล้วไปเก็บโค้ดใน repo อัตโนมัติ
Continuous Deployment → กระบวนการนำโค้ด deploy บน production อัตโนมัติ
