# สัปดาห์ที่ 15 · IT Skills and System

> บรรยาย onsite ที่คณะ อ. 27 ต.ค. 2569 โดย ผศ.ดร. สุวิทย์ ภูมิฤทธิกุล (สไลด์ 72 หน้า) · แล็บออนไลน์ผ่าน Zoom ศ. 23 ต.ค. 2569 เวลา 09:00–11:00 (Web Deployment)
>
> สไลด์บรรยายฉบับ 1/2569 และใบงานแล็บของปีนี้อยู่ในคลังเรียบร้อยแล้ว · สรุปเนื้อหาด้านล่างครอบคลุมทั้ง Digital Skills, Web Server / Deployment และทฤษฎี Information System & SDLC

> **ระดับความเน้นสอบปลายภาค ⭐ อ่านผ่าน จำคีย์เวิร์ด** — มาจากสรุปของเพื่อนร่วมรุ่น ไม่ใช่ประกาศของผู้สอน · สไลด์ฉบับแปลไทยทีละหัวข้อ: `itf-lec-week15-it-skills-system-2569-thai.pdf` · [โน้ต Notion](https://app.notion.com/p/ITF-407363d85cea806abdc6c9ec2254f668)

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
| สไลด์บรรยายฉบับแปลไทย — สรุปทีละหัวข้อคู่ภาพสไลด์ (ฉบับ 2569) | 1 หน้ายาว | `itf-lec-week15-it-skills-system-2569-thai.pdf` |
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
