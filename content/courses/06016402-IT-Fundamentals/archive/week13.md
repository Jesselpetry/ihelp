# สัปดาห์ที่ 13 · Wireless Networks

> บรรยายออนไลน์ผ่าน Zoom อ. 29 ก.ย. 2569 (Sec 1, 3 เวลา 13:45–15:45 · Sec 2 เวลา 16:00–18:00) · แล็บ Web App 1 ออนไลน์ ศ. 9 ต.ค. 2569
>
> สไลด์ Lecture 13 ฉบับ 1/2569 อยู่ในคลังแล้ว (`itf-lec-week13-wireless-network-2569.pdf`) ส่วนคลิปบันทึกการสอนยังอยู่ใน OnLearn เท่านั้น —
> สรุปด้านล่างเขียนจากสไลด์ปีก่อนชื่อเดียวกัน *Introduction to Wireless Network* ของ รศ.ดร. ปานวิทย์ ธุวะนุติ (41 หน้า)
> ซึ่งเทียบกับฉบับ 2569 แล้วเนื้อหาตรงกัน (ต่างที่ชื่อผู้สอนบนปก) ถ้าเนื้อหาต่างกันให้ยึดฉบับใน OnLearn

> **ระดับความเน้นสอบปลายภาค ⭐⭐⭐ เน้นมาก** — สัปดาห์ 11–13 ถูกระบุว่าออกสอบหนัก: เข้าใจ concept + จำ **keyword** ของเครือข่ายไร้สาย
> (infrastructure vs ad hoc · SNR / BER · CDMA · BSS / AP / SSID · CSMA/CA · RTS/CTS) · ข้อมูลนี้มาจาก**สรุปของเพื่อนร่วมรุ่น ไม่ใช่ประกาศของผู้สอน** —
> ขอบเขตจริงให้ยึดประกาศใน OnLearn · อ่านทบทวนจากสไลด์สรุปแปลไทยทีละหัวข้อ `itf-lec-week13-wireless-network-2569-thai.pdf` และ
> [โน้ต Notion ของเพื่อน](https://app.notion.com/p/ITF-407363d85cea806abdc6c9ec2254f668)

## อ่านจบแล้วต้องตอบได้

- บอกองค์ประกอบของเครือข่ายไร้สาย และแยก infrastructure mode กับ ad hoc mode
- อธิบายว่าลิงก์ไร้สายต่างจากลิงก์มีสายอย่างไร — path loss · interference · multipath · hidden terminal
- อธิบายหลักการของ CDMA
- บอกมาตรฐาน IEEE 802.11 แต่ละรุ่น และขั้นตอน association
- อธิบาย **CSMA/CA** และการใช้ RTS/CTS

---

## เอกสารประจำสัปดาห์

| เอกสาร | หน้า | ไฟล์ในคลัง |
|---|:---:|---|
| สไลด์บรรยาย — Introduction to Wireless Network (ฉบับ 2569) | 41 | `itf-lec-week13-wireless-network-2569.pdf` |
| สไลด์บรรยายฉบับแปลไทย — สรุปทีละหัวข้อคู่ภาพสไลด์ (ฉบับ 2569) | 1 หน้ายาว | `itf-lec-week13-wireless-network-2569-thai.pdf` |
| สไลด์ประกอบแล็บ — Web App 1 | 18 | `itf-lab-week13-web-app-1-slide.pdf` |
| ใบงานแล็บ — Web App 1 · HTML และ CSS | 16 | `itf-lab-week13-web-app-1-sheet.pdf` |
| สไลด์ฉบับปีก่อน | 41 | `itf-lec-week13-wi-fi.pdf` |

> **มีใน OnLearn แต่ยังไม่อยู่ในคลัง** — คลิปบันทึกการสอนแยกตามรอบ (Sec 1, 3 และ Sec 2, id 27560, 27561) · คลิป brief แล็บ (id 27663)

---

## สรุปอ่านสอบ

### 1. องค์ประกอบของเครือข่ายไร้สาย

- **Wireless host** — laptop, smartphone, IoT · ไร้สายไม่ได้แปลว่าเคลื่อนที่เสมอ
- **Base station** — ต่อกับเครือข่ายมีสาย ส่งต่อ packet ให้ host ในพื้นที่ เช่น เสาสัญญาณมือถือ และ **access point** ของ 802.11
- **Wireless link** — ต่อ host เข้ากับ base station · คุณสมบัติหลักคือ coverage area และ link rate

| โหมด | ลักษณะ |
|---|---|
| **Infrastructure** | host ต่อผ่าน base station เข้าเครือข่ายมีสาย · ย้าย base station เรียกว่า **handoff** |
| **Ad hoc** | ไม่มี base station · node จัดเครือข่ายกันเอง เช่น MANET · VANET · Bluetooth |

⭐⭐ **Wireless network taxonomy** (2 × 2 — แกน infrastructure × จำนวน hop)

| | **Single hop** | **Multiple hops** |
|---|---|---|
| **มี infrastructure** (AP / base station) | host ต่อตรงกับ base station ซึ่งต่อเข้า Internet — **Wi-Fi** บ้าน/มหาวิทยาลัย · **cellular** | host อาจต้องส่งต่อผ่าน wireless node หลายตัวก่อนถึง base station — **mesh network** |
| **ไม่มี infrastructure** | ไม่มี base station ไม่ต่อ Internet ใหญ่ — **Bluetooth** · **ad hoc mode** · AirDrop | ไม่มี base station ต้องให้ node อื่นช่วยส่งต่อเป็นทอด ๆ — **MANET** (mobile ad hoc) · **VANET** (vehicular ad hoc) |

- ตัวอย่าง ad hoc mode: คอมที่ต่อ Wi-Fi ของมหาวิทยาลัยอยู่ปล่อย hotspot ให้มือถือต่อ — เครื่องทำตัวเป็น AP
- **Cellular (4G / 5G)** — base station คือเสาสัญญาณ (Wi-Fi เรียก AP) · เสริมด้วย **handoff** ที่ต่อเนื่อง ย้ายเสาโดยไม่หลุด
- ลิงก์ไร้สายครอบคลุมพื้นที่แคบกว่าและ bandwidth ต่ำกว่าสายเสมอ จึงยังต้องมีโครงข่ายมีสายเป็นแกนหลัก
- **เรียงอัตราส่งสูงสุด: 802.11ax > ac > n > g > b** (14 Gbps > 3.47 Gbps > 600 Mbps > 54 Mbps > 11 Mbps) · Bluetooth ช้ากว่าทุกรุ่น (ราว 2 Mbps ตามสไลด์) ·
  802.11af / ah ไปได้ไกลขึ้น (ราว 1 km) แต่ใช้ความถี่ต่ำและอัตราต่ำกว่า

### 2. ลักษณะของลิงก์ไร้สาย

- **Path loss / fading** — สัญญาณอ่อนลงตามระยะและความถี่ (ยิ่งความถี่สูงหรือไกล ยิ่ง loss มาก)
- **Interference** — ความถี่มาตรฐาน เช่น 2.4 GHz ใช้ร่วมกับอุปกรณ์อื่น
- **Multipath** — สัญญาณสะท้อนวัตถุ มาถึงปลายทางไม่พร้อมกัน
- **SNR** สูงแยกสัญญาณจากสัญญาณรบกวนได้ง่าย · เพิ่มกำลังส่ง → SNR สูงขึ้น → BER ลดลง แต่เปลืองแบตเตอรี่
- **Hidden terminal** — A กับ C ต่างได้ยิน B แต่ไม่ได้ยินกันเอง จึงส่งชนกันที่ B โดยไม่รู้ตัว

| ปัจจัย | จำ |
|---|---|
| **ความถี่ vs ระยะ** | ความถี่**สูง** → ส่งได้**ใกล้** (loss มาก) · ความถี่**ต่ำ** → ส่งได้**ไกล** · เช่น 5 GHz เร็วแต่ใกล้ · 2.4 GHz ไกลกว่าแต่ใช้ร่วมกับอุปกรณ์อื่นมาก จึงรบกวนกันง่าย |
| **SNR** | อัตราส่วนสัญญาณจริงต่อสัญญาณรบกวน — สูงยิ่งดี · เครื่องที่อยู่ใกล้ AP มี SNR สูงกว่าโดยธรรมชาติ |
| **SNR ↔ BER** | เพิ่มกำลังส่ง → SNR สูงขึ้น → **BER** (bit error rate) ต่ำลง — แต่**เปลืองแบตเตอรี่** (ปัญหาของ mobile device) |
| **Modulation** | เทคนิคใส่ข้อมูลลงบนคลื่น · modulation ที่ส่ง bit rate สูงกว่าจะมี BER สูงกว่าที่ SNR เท่ากัน → ต้องเลือกให้เหมาะกับ SNR (SNR ต่ำใช้แบบช้าแต่ทน) |

- คลื่นวิ่งกระจายอิสระ จึงสะท้อนวัตถุ (multipath) และชนกับคลื่นสะท้อนของตัวเอง

### 3. CDMA

- อยู่ในกลุ่ม channel partitioning · ทุกคนใช้ความถี่เดียวกัน แต่แต่ละคนมี **chipping sequence (code)** ของตัวเอง
- encode = ข้อมูล × code · decode = inner product ของสัญญาณกับ code · ถ้า code ตั้งฉากกัน (orthogonal) หลายคนส่งพร้อมกันได้

⭐⭐ **สูตร CDMA** (code ยาว M chip, ค่าแต่ละ chip เป็น +1 / −1, ข้อมูลของ slot นั้น dᵢ = ±1)

| ขั้น | สูตร |
|---|---|
| **Encode** (ผู้ส่ง) | Zᵢ,ₘ = dᵢ · cₘ  (m = 1…M) — ข้อมูลคูณ chipping sequence ทีละ chip |
| **Decode** (ผู้รับ) | Dᵢ = (1/M) · Σₘ Zᵢ,ₘ · cₘ  — inner / dot product กับ code ของผู้ส่งที่ต้องการ แล้วหารด้วย M |

ได้ข้อมูลคืนเพราะ cₘ · cₘ = 1 ทุก chip → ผลรวม = M · dᵢ · ถ้ามีผู้ส่งหลายคน channel รวมสัญญาณทุกคนเข้าด้วยกัน แต่ code ของคนอื่นตั้งฉากกับ code ที่ใช้ถอด → ผลรวมของส่วนนั้นเป็น 0

**ช่องทางใช้ร่วมกันแบ่งได้กี่แบบ** — CDMA อยู่กลุ่ม channel partitioning ไม่เกี่ยวกับ CSMA

| วิธี | แบ่งด้วย | หมายเหตุ |
|---|---|---|
| **FDMA** (Frequency Division) | ความถี่ — แต่ละคนได้ช่องความถี่ของตัวเอง | channel partitioning |
| **TDMA** (Time Division) | เวลา — แต่ละคนได้ time slot ในความถี่เดียวกัน | channel partitioning |
| **CDMA** (Code Division) | รหัส — ใช้ความถี่และเวลาเดียวกัน แยกด้วย chipping sequence | channel partitioning · พบใน cellular (2G ใช้ FDMA/TDMA, 3G ใช้ CDMA — ตามสรุปของเพื่อน *ยังไม่ยืนยันรุ่น*) |
| **CSMA/CD** | ฟังสายขณะส่ง ชนแล้วถอยแล้วส่งใหม่ | random access · **เครือข่ายมีสาย** (Ethernet) |
| **CSMA/CA** | ฟังช่องว่าง + ACK (+ RTS/CTS) | random access · **Wi-Fi 802.11** |

### 4. IEEE 802.11 Wireless LAN

| มาตรฐาน | ปี | อัตราสูงสุด | ความถี่ |
|---|---|---|---|
| 802.11b | 1999 | 11 Mbps | 2.4 GHz |
| 802.11g | 2003 | 54 Mbps | 2.4 GHz |
| 802.11n (Wi-Fi 4) | 2009 | 600 Mbps | 2.4 / 5 GHz |
| 802.11ac (Wi-Fi 5) | 2013 | 3.47 Gbps | 5 GHz |
| 802.11ax (Wi-Fi 6) | 2020 | 14 Gbps | 2.4 / 5 GHz |

- ทุกรุ่นใช้ **CSMA/CA** · หน่วยพื้นฐานคือ **BSS** (host + AP)
- ระยะตามสไลด์: b / g ราว 30 m · n / ac / ax ราว 70 m · af / ah ราว 1 km
- **Association** — host scan หา AP แบบ passive (ฟัง beacon) หรือ active (ส่ง probe) แล้วส่ง association request / response
- **Channel · SSID · MAC**: AP มี **SSID** (ชื่อ Wi-Fi) และ **MAC address** (ไม่ซ้ำกันทั่วโลก ใช้ระบุอุปกรณ์) ·
  spectrum แบ่งเป็นหลาย **channel** ผู้ดูแลเลือกช่องของ AP · AP ข้างกันใช้ช่องเดียวกัน → สัญญาณซ้อนทับ/รบกวนกัน ·
  ย่าน **2.4 GHz** ช่องที่**ไม่ overlap** กันคือ **1 · 6 · 11**

**ขั้นตอน association (เรียงตามลำดับ)**

| # | ขั้น | รายละเอียด |
|:---:|---|---|
| 1 | **Scan** | ฟัง **beacon frame** ที่ AP ปล่อย (มี SSID และ MAC address) |
| 2 | เลือก AP | host เลือก AP ที่จะต่อ |
| 3 | **Authenticate** | ยืนยันตัวตนกับ AP เช่น กรอกรหัส Wi-Fi |
| 4 | **DHCP** | ขอ IP address ให้อยู่ใน subnet เดียวกับ AP แล้วใช้งานได้ |

- **Power management** — host แจ้ง AP ว่า "จะหลับจนถึง beacon ถัดไป" → AP **buffer** frame ที่ส่งถึง host นั้นไว้แทนการส่ง ·
  beacon frame มีรายชื่อ host ที่มีข้อมูลฝากไว้ · ไม่มีชื่อ = หลับต่อ · มี = host ส่งข้อความ (poll) ขอให้ AP ส่งข้อมูลที่พักไว้

### 5. CSMA/CA และ RTS/CTS

- ผู้ส่งฟังช่องว่างนาน **DIFS** แล้วจึงส่ง · ผู้รับตอบ **ACK** หลัง **SIFS** เพราะผู้ส่งตรวจจับการชนเองไม่ได้
- **RTS/CTS** — ผู้ส่งจองช่องด้วย request-to-send สั้น ๆ · AP ตอบ clear-to-send ให้ทุกเครื่องได้ยิน → แก้ hidden terminal
- 802.15 (PAN) เช่น Bluetooth ใช้ระยะใกล้ อัตราต่ำ
  - **802.15 = personal area network** — สื่อสารระยะสั้นมาก ใช้ย่าน 2.4 GHz แบบ ad hoc (ไม่มี infrastructure)
  - **Bluetooth** (802.15.1) — กำลังต่ำ ราคาถูก ระยะสั้น อัตราต่ำ · **Zigbee** (802.15.4) — กำลังต่ำและอัตราข้อมูลต่ำกว่า เหมาะอุปกรณ์เซนเซอร์/สวิตช์ที่ส่งไม่บ่อย

### คีย์เวิร์ดต้องจำ

- **องค์ประกอบ**: wireless host · **base station** (เสามือถือ · **AP**) · wireless link · **infrastructure** vs **ad hoc** · **handoff** · taxonomy (single/multi hop × มี/ไม่มี infra → Wi-Fi · mesh · Bluetooth · MANET · VANET)
- **ลิงก์ไร้สาย**: path loss · interference · multipath · **SNR ↔ BER** · modulation · ความถี่สูง = ใกล้ / ต่ำ = ไกล (5 GHz vs 2.4 GHz) · **hidden terminal**
- **การแบ่งช่อง**: channel partitioning = **FDMA** (ความถี่) · **TDMA** (เวลา) · **CDMA** (รหัส — chipping sequence, orthogonal, inner product)
- **802.11**: b / g / n / ac / ax (ax > ac > n > g > b) · **BSS** (host + AP) · **SSID** · **MAC address** · channel (2.4 GHz: **1 · 6 · 11**) · **beacon frame**
- **Association**: scan beacon → เลือก AP → authenticate → **DHCP** · passive vs active scanning (probe)
- **Multiple access**: Wi-Fi = **CSMA/CA** (DIFS · SIFS · **ACK** · **RTS/CTS**) · Ethernet = **CSMA/CD** · Wi-Fi ไม่ใช้ CDMA
- **Power management**: sleep → AP **buffer** → beacon แจ้งรายชื่อ → poll
- **802.15 PAN**: Bluetooth (802.15.1) · Zigbee (802.15.4) · ย่าน 2.4 GHz · ad hoc

---

## จุดที่มักพลาด

- Wireless ใช้ **CSMA/CA** (หลีกเลี่ยงการชน) · Ethernet ใช้ **CSMA/CD** (ตรวจจับการชน)
- Hidden terminal แก้ด้วย **RTS/CTS** ไม่ใช่เพิ่มกำลังส่ง
- Infrastructure mode ต้องมี base station · ad hoc ไม่มี
- **Wi-Fi ไม่ได้ใช้ CDMA** — 802.11 ใช้ CSMA/CA (random access) · CDMA เป็นการแบ่งช่อง (channel partitioning) ที่พบใน cellular
- Hidden terminal: A กับ C **ไม่ได้ยินกัน** จึงส่งชนที่ B (ไม่ใช่ A ส่งผ่าน B ไป C) · แก้ด้วย RTS/CTS
- ไม่ใช่ว่าความถี่สูงจะส่งได้ไกลกว่า — ความถี่**สูง**ส่งได้**ใกล้**กว่า (5 GHz ใกล้กว่า 2.4 GHz)

---

## ทดสอบตัวเอง

1. ทำไม 802.11 ต้องใช้ ACK
2. ปัญหาที่ A และ C ไม่ได้ยินกันแต่ส่งชนกันที่ B เรียกว่าอะไร
3. 802.11ac ใช้ความถี่ใด
4. การที่มือถือย้ายไปเชื่อมกับเสาสัญญาณต้นใหม่เรียกว่าอะไร
5. AP สองตัวในย่าน 2.4 GHz ที่อยู่ใกล้กัน ควรตั้งช่องใดจึงไม่ซ้อนทับกัน (เลือกได้ 3 ช่อง)
6. CDMA: code c = (+1, −1, +1, +1) ผู้ส่งส่งข้อมูล d = −1 — encode ได้อะไร และผู้รับ decode ได้เท่าไร
7. เรียงขั้นตอนที่ host เข้า Wi-Fi ได้จนมี IP: DHCP · authenticate · scan beacon · เลือก AP

**เฉลย** — 1. ผู้ส่งตรวจจับการชนขณะส่งไม่ได้ · 2. hidden terminal problem · 3. 5 GHz · 4. handoff ·
5. ช่อง 1, 6, 11 · 6. Z = d · c = (−1, +1, −1, −1) · decode = ¼ × [(−1)(+1) + (+1)(−1) + (−1)(+1) + (−1)(+1)] = ¼ × (−4) = **−1** (ได้ d เดิม) ·
7. scan beacon → เลือก AP → authenticate → DHCP

---

## แล็บ — Web App 1 · HTML และ CSS

> ย่อจากใบงานจริง 1/2569 (`itf-lab-week13-web-app-1-sheet.pdf`, 16 หน้า) · เรียนออนไลน์ผ่าน Zoom **ศ. 9 ต.ค. 2569 เวลา 09:00–11:00
> รอบเดียวทุกกลุ่ม** · สไลด์แล็บและที่ส่งงานแยกตามรอบ (09:00 · 11:00 · 14:00) อยู่ใน [OnLearn](https://onlearn.it.kmitl.ac.th/course/view.php?id=1766)

```youtube
G6_oVVDa5Gg | คลิปย้อนหลัง Lab 13 — Web App 1 (ศ. 9 ต.ค. 69)
```

ใบงานเปรียบหน้าเว็บกับบ้าน: **HTML** คือโครงสร้าง · **CSS** คือการทาสีตกแต่ง · **JavaScript** คือระบบที่ทำให้บ้านโต้ตอบได้ —
สัปดาห์นี้ใช้แค่ HTML และ CSS ปุ่มที่สร้างจึงกดแล้วยังไม่เกิดอะไร คาบถัดไปจะใช้ JavaScript ทำให้ทำงาน

**ขั้นตอนในใบงาน**
1. **Part 0** — ติดตั้ง extension **Live Server** (Ritwick Dey) ใน VS Code · สร้างโฟลเดอร์ `week13` · ไฟล์ `index.html` พิมพ์ `!` แล้วกด Tab
   ได้โครงเริ่มต้น · คลิกขวา **Open with Live Server** (หน้าเว็บรีเฟรชเองทุกครั้งที่ Save)
2. **Part 1** — พิมพ์หน้าเว็บแรก: `<h1>` สี `tomato` · `<p>` · `<a href>` แล้วลองแก้ข้อความ สี และเพิ่ม `text-align: center;`
3. **Part 2** — syntax ที่ต้องใช้ (สรุปด้านล่าง)
4. **Part 3 (ส่งงาน)** — Profile Card + To-do List ด้วยมือ
5. **Part 4 (ส่งงาน)** — ทำโจทย์เดิมซ้ำด้วย AI CLI agent ผ่าน **OpenCode** (ใช้ Claude Code หรือ Codex CLI แทนได้)

**Syntax ที่ใบงานสรุป**

| เรื่อง | จุดจำ |
|---|---|
| โครงไฟล์ | `<head>` = ข้อมูลเบื้องหลัง ไม่แสดงผล · `<body>` = ทุกอย่างที่เห็น · `<meta charset="UTF-8">` ทำให้ภาษาไทยไม่เพี้ยน |
| Tag ไม่มีแท็กปิด | `<img>` · `<br>` · `<input>` |
| Tag ที่ใช้ | `<h1>`–`<h6>` · `<p>` · `<a>` · `<img>` · `<div>` · `<ul>` + `<li>` · `<strong>` · `<input>` · `<button>` · `<span>` |
| Attribute | `href` + `target="_blank"` (แท็บใหม่) · `src` + `alt` · `class` (ใช้ซ้ำได้) · `id` (ห้ามซ้ำในหน้า) · `type` · `placeholder` |
| CSS selector | `p` = ทุกแท็ก `<p>` · `.card` = class · `#title` = id · ทุกบรรทัดปิดด้วย `;` |
| วางข้างกัน | ใส่ Flexbox ให้กล่องแม่ — ปกติ `<div>` เรียงจากบนลงล่าง |
| คีย์ลัด | `div.card` + Tab (Emmet) · Shift + Alt + F จัดโค้ด · Ctrl + / comment · F12 เปิด DevTools |

**ข้อกำหนด Part 3** — ทุกอย่างอยู่ในการ์ดใบเดียว กึ่งกลางหน้า สีพื้นต่างจากหน้า ขอบมน มีเงา
- ซ้าย: `<img>` · ชื่อ (`<h1>`/`<h2>`) · รหัสนักศึกษาและสาขา · แนะนำตัว 1–2 ประโยค · ลิงก์ติดต่อ ≥ 1
- ขวา: หัวข้อ "To-do List" · `<input>` + ปุ่ม "เพิ่ม" · รายการ ≥ 4 ข้อ ท้ายทุกข้อมีปุ่ม "ลบ"
- ต้องตั้ง id: ช่องพิมพ์ `todo-input` · ปุ่มเพิ่ม `add-btn` · รายการ `todo-list` — คาบหน้า JavaScript ใช้ id เหล่านี้
- **ห้ามมี `<script>`** · CSS เขียนใน `<style>` ของไฟล์เดียวกัน

**Part 4 — OpenCode** — ทำในโฟลเดอร์ใหม่ `week13-ai` เท่านั้น · `/models` เลือกโมเดลที่ลงท้าย `-free` · `/variants` เลือก `xhigh` ·
prompt ควรบอก เป้าหมาย · ข้อจำกัด · โครงสร้าง · ข้อมูลของเรา · หน้าตา · อ่านทุกคำขออนุญาตของ agent ก่อนกดยอมรับ แล้วตรวจผลกับข้อกำหนด Part 3

**ส่งงาน** — `lab13-รหัสนักศึกษา.zip` มีโฟลเดอร์ `week13` และ `week13-ai` (แต่ละโฟลเดอร์มี `index.html` + รูป) และภาพหน้าจอ prompt เช่น `prompt.png`

**จุดพลาดในแล็บ** — แก้แล้วหน้าเว็บไม่เปลี่ยนเพราะยังไม่ Save · ลืมแท็กปิด · ชื่อ class ใน HTML กับ CSS สะกดไม่ตรงกัน (ตัวพิมพ์เล็ก-ใหญ่มีผล) ·
ชื่อไฟล์ต้องเป็นภาษาอังกฤษตัวเล็ก ไม่เว้นวรรค ลงท้าย `.html`
