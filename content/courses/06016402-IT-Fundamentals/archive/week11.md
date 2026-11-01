# สัปดาห์ที่ 11 · Internet & Computer Networks 1

> รศ.ดร. ปานวิทย์ ธุวะนุติ · สไลด์ Internet (69 หน้า) อิง Kurose & Ross *Computer Networking* 8th ed. บทที่ 1 · แล็บ Network 1 — Cisco Packet Tracer (1)
>
> คำศัพท์ภาษาอังกฤษล้วน — ข้อสอบมักถามว่า "ข้อใดไม่ใช่" end system หรือ communication link

> **ระดับความเน้นสอบปลายภาค ⭐⭐⭐ เน้นมาก** — สัปดาห์ 11–13 (Internet · Computer Networks · Wireless) ถูกระบุว่าออกสอบหนัก: ให้เข้าใจ concept
> และจำ **keyword** ให้ได้ (encapsulation · packet switching · routing vs forwarding · tier-1 ISP / IXP · packet sniffing / IP spoofing / DoS) ·
> ข้อมูลนี้มาจาก**สรุปของเพื่อนร่วมรุ่น ไม่ใช่ประกาศของผู้สอน** — ขอบเขตจริงให้ยึดประกาศใน OnLearn ·
> อ่านทบทวนจากสไลด์สรุปแปลไทยทีละหัวข้อ `itf-sheet-week11-internet-th.pdf` และ
> [โน้ต Notion ของเพื่อน](https://app.notion.com/p/ITF-407363d85cea806abdc6c9ec2254f668)

## อ่านจบแล้วต้องตอบได้

- อธิบาย Internet ได้ทั้งแบบ **nuts and bolts** และแบบ **service view**
- ให้นิยาม **protocol** และไล่ **encapsulation** จาก message ถึง frame
- แยก access network แต่ละแบบ (DSL · cable/HFC · FTTH · Ethernet · Wi-Fi · cellular)
- แยก guided กับ unguided media และบอกหน้าที่ **routing กับ forwarding**
- อธิบายโครงสร้าง network of networks (tier-1 ISP · IXP · content provider) และการโจมตี 3 แบบ

---

## เอกสารประจำสัปดาห์

| เอกสาร | หน้า | ไฟล์ในคลัง |
|---|:---:|---|
| สไลด์บรรยาย — Internet | 69 | `itf-lec-week11-internet.pdf` |
| สรุปฉบับแปลไทย — Week 11 อินเทอร์เน็ต | 1 | `itf-sheet-week11-internet-th.pdf` |
| ใบงานแล็บ — Network 1 · Cisco Packet Tracer (1) | 18 | `itf-lab-week11-network-1-sheet.pdf` |
| บทนำเครือข่าย — สไลด์ Kurose ฉบับแปลไทย | 81 | `itf-lec-internet-thai.pdf` |
| สรุปลายมือ — Network 1 | 6 | `itf-lec-network-1.pdf` |

> **มีใน OnLearn แต่ยังไม่อยู่ในคลัง** — สไลด์ Lecture 11 ที่ผู้สอนจดโน้ตทับ แยกตามรอบบรรยาย (14:00–16:00 และ 16:00–18:00)

---

## สรุปอ่านสอบ

### 1. Internet คืออะไร

- **Nuts and bolts view** — ฮาร์ดแวร์และซอฟต์แวร์ที่ประกอบเป็น Internet:
  - **Host = end system** — อุปกรณ์ปลายทางที่รันแอป ทั้ง client และ server
  - **Communication link** — fiber · copper · radio · satellite · อัตราส่งเรียกว่า **bandwidth** (bits/sec)
  - **Packet switch** — **router** (อยู่ใน network core) และ **link-layer switch** (อยู่ใน access network)
  - **ISP** เชื่อม end system เข้ากับ Internet · ทุก ISP รัน **IP protocol**
- **Service view** — โครงสร้างพื้นฐานที่ให้บริการแก่ **distributed application** · end system มี **API** ให้โปรแกรมขอส่งข้อมูล (เปรียบกับกติกาของไปรษณีย์)
- แอปรันบน end system **ไม่ได้รัน**บน packet switch
- มาตรฐาน Internet ออกโดย **IETF** ในรูปเอกสาร **RFC** · โปรโตคอลหลักเรียกรวมว่า **TCP/IP**

### 2. Protocol และ Encapsulation

- **Protocol** กำหนด **รูปแบบ** และ **ลำดับ** ของข้อความที่รับส่ง และ **การกระทำ**เมื่อส่งหรือรับข้อความ
- ผู้ส่งแบ่งข้อมูลเป็น **packet** แล้วเติม header · ผู้รับประกอบกลับเป็นข้อมูลเดิม

| Layer | หน่วยข้อมูล |
|---|---|
| Application | message |
| Transport | segment |
| Network | datagram |
| Link | frame |
| Physical | bit |

สไลด์เปรียบ encapsulation กับตุ๊กตาแม่ลูกดก (matryoshka) — แต่ละชั้นห่อชั้นก่อนหน้าด้วย header ของตัวเอง

⭐⭐⭐ **แต่ละชั้นเติมอะไรตอน encapsulation** (ฝั่งรับทำย้อนกลับ = decapsulation)

| Layer | สิ่งที่เติม | หน่วย |
|---|---|---|
| Application | สร้างข้อมูล | **message** |
| Transport (TCP/UDP) | header ระบุ **port** (และการเชื่อมต่อ) | **segment** |
| Network (IP) | header ระบุ **IP address** ต้นทาง–ปลายทาง | **packet / datagram** |
| Link (Ethernet · Wi-Fi) | **header + trailer** ระบุ **MAC address** และใช้ตรวจ error | **frame** |
| Physical | แปลงเป็นสัญญาณไฟฟ้า แสง หรือคลื่นวิทยุ | **bit** |

ลำดับจำ: **Message → Segment → Packet (Datagram) → Frame → bits** · ชั้น Link เป็นชั้นเดียวที่เติม **trailer**

**ตัวอย่าง protocol — เปิดเว็บ** (สไลด์โชว์ 4 ข้อความแรก · ACK ขั้น 5 และ 7 เป็นรายละเอียดเสริมจากสรุปของเพื่อน)

| # | ทิศทาง | ข้อความ | ความหมาย |
|:---:|---|---|---|
| 1 | client → server | TCP connection request (**SYN**) | ขอเชื่อมต่อ |
| 2 | server → client | TCP connection response (**SYN + ACK**) | ตกลง เปิดท่อให้ |
| 3 | client → server | TCP **ACK** | เชื่อมต่อสำเร็จ (established) — จบ **3-way handshake** |
| 4 | client → server | **HTTP GET** | ขอไฟล์ผ่านท่อ TCP |
| 5 | server → client | TCP ACK | รับคำขอแล้ว |
| 6 | server → client | HTTP response + ไฟล์ | ส่งไฟล์ที่ขอ |
| 7 | client → server | TCP ACK | ได้ไฟล์ครบแล้ว |

### 3. Network Edge และ Access Network

⭐⭐ access network แต่ละแบบต่างกันที่สายและการแชร์

| Access | จุดจำ |
|---|---|
| **DSL** | ใช้สายโทรศัพท์เดิม · สายตรงไปชุมสาย (**dedicated**) · DSLAM แยกข้อมูลกับเสียง |
| **Cable (HFC)** | hybrid fiber coax · บ้านหลายหลัง**แชร์**สายไป cable headend · asymmetric ขาลงเร็วกว่าขาขึ้น |
| **FTTH** | ไฟเบอร์ถึงบ้าน |
| Satellite · dial-up | ใช้เมื่อไม่มีทางเลือกอื่น เช่น ชนบท |
| Enterprise | Ethernet 10 Mbps – 10 Gbps + Wi-Fi |
| Wide-area wireless | 4G / 5G ผ่านเสาของผู้ให้บริการ |
| Data center | ลิงก์หลายสิบถึงหลายร้อย Gbps |

- **Wireless access** ต่อ end system เข้า router ผ่าน base station ที่เรียกว่า **access point (AP)**
  - **Wireless LAN** (Wi-Fi · 802.11b/g…) — ใช้**ในอาคาร** ระยะราว **100 ft (~30 m)** · อัตรา 11 · 54 · 450 Mbps ตามรุ่น
  - **Wide-area wireless** (4G / 5G ของเครือข่ายมือถือ) — ระยะ**หลายสิบ km** · ราว 10 Mbps ตามสไลด์

- Host ส่ง packet ยาว L บิตเข้าลิงก์อัตรา R → **transmission delay = L / R** วินาที

| Physical media | ตัวอย่าง |
|---|---|
| **Guided** (ในตัวกลางแข็ง) | twisted pair (Cat 5 = 100 Mbps–1 Gbps · Cat 6 = 10 Gbps) · coaxial · **fiber optic** (เร็ว error ต่ำ ไม่โดนสัญญาณรบกวนแม่เหล็กไฟฟ้า) |
| **Unguided** (ไปในอากาศ) | radio — terrestrial microwave · Wi-Fi · 4G/5G · Bluetooth · satellite (ดีเลย์ราว 270 ms) |

- **Fiber** ส่งเป็นพัลส์แสง (1 พัลส์ = 1 bit) · error ต่ำ จึงวาง **repeater** (ทวนสัญญาณที่อ่อนลงตามระยะ) ห่างกันได้ ·
  **immune ต่อ electromagnetic noise** (สายไฟแรงสูง · มอเตอร์ · ฟ้าผ่า) เพราะใช้แสงไม่ใช่ไฟฟ้า — twisted pair / coax ยังโดนรบกวนได้

### 4. Network Core และโครงสร้าง Internet

- **Packet switching** — แบ่ง message เป็น packet แล้วส่งต่อทีละ router ตามเส้นทาง
- **Forwarding** = งานของ router ตัวเดียว ย้าย packet จากขาเข้าไปขาออกตาม forwarding table (local action)
- **Routing** = หาเส้นทางทั้งหมดจากต้นทางถึงปลายทางด้วย routing algorithm (global action)
- **Network of networks** — ต่อ access ISP ทุกคู่ตรง ๆ ไม่ไหว (O(N²)) จึงมี global transit ISP → **IXP** และ peering link → regional ISP → content provider network
- ศูนย์กลาง: **tier-1 ISP** ไม่กี่ราย (Level 3, Sprint, AT&T, NTT) และ content provider (Google, Facebook) ที่มีเครือข่ายส่วนตัวเลี่ยง tier-1

| ระดับ ISP | ลักษณะ |
|---|---|
| **Tier 1** | ครอบคลุมระดับชาติ/นานาชาติ ใช้ high-speed router + fiber ความเร็วสูง (มีสายเคเบิลใต้น้ำ) เช่น Level 3 · Sprint · AT&T (สหรัฐฯ) · NTT (ญี่ปุ่น) |
| **Tier 2** | ระดับถัดลงมา — **regional ISP** รวม ISP ท้องถิ่นก่อนส่งขึ้น tier-1 |
| **Tier 3** | **access ISP** ที่ผู้ใช้สมัครใช้ตรง ๆ — สรุปของเพื่อนยกตัวอย่าง AIS · True (สไลด์ใช้คำว่า regional / access ISP ไม่ได้ระบุ tier 2/3 — *ยังไม่ยืนยัน*) |

**network of networks เกิดขึ้นเป็น 6 ขั้น** (ต่อ access ISP หลายล้านรายเข้าหากันอย่างไร)

1. ต่อทุกคู่ตรง ๆ (mesh) → จำนวนลิงก์ **O(N²)** เยอะเกินไป
2. ให้ทุกรายต่อเข้า **global transit ISP** ตัวกลาง (ลูกค้า–ผู้ให้บริการ มีข้อตกลงทางธุรกิจ)
3. มี global ISP หลายเจ้าแข่งกัน → ต้องเชื่อมถึงกันเอง
4. เชื่อม global ISP ด้วย **peering link** (ISP สองรายแลก traffic ตรง ๆ) หรือ **IXP** (จุดศูนย์กลางแลก traffic ให้หลาย ISP มาเชื่อมที่เดียว)
5. เพิ่มชั้น **regional ISP** รวม access ISP ในพื้นที่ก่อนส่งออกไป global ISP
6. **content provider network** (data center ของ Google ฯลฯ) ต่อ IXP หรือ regional ISP โดยตรง ลดระยะทางส่ง → เปิดเว็บเร็วขึ้น

### 5. Network Security

| การโจมตี | ความหมาย |
|---|---|
| **Packet sniffing** | อ่านทุก packet ที่ผ่านสื่อแบบ broadcast เช่น Wi-Fi · เครื่องมือ Wireshark |
| **IP spoofing** | ปลอม source address ของ packet |
| **DoS** | ถล่มทรัพยากรด้วย traffic ปลอมจนผู้ใช้จริงใช้ไม่ได้ — มักใช้ botnet |

- **DoS 3 ขั้นตอน** (ตามสไลด์): ① เลือกเป้าหมาย ② เจาะยึด host ต่าง ๆ ในเครือข่าย (เรียกรวมว่า **botnet**) ③ สั่งให้ host ที่ถูกยึดระดมส่ง packet ไปยังเป้าหมาย
- Internet ไม่ได้ออกแบบมาพร้อมความปลอดภัย (เดิมเชื่อว่าผู้ใช้ไว้ใจกัน) — ผู้ออกแบบ protocol ต้อง "catch-up" แก้ทีหลัง และต้องคิดเรื่องความปลอดภัย**ทุก layer**

แนวป้องกัน: authentication · encryption (confidentiality) · digital signature (integrity) · VPN · **firewall**

### คีย์เวิร์ดต้องจำ

- **Nuts and bolts** (host · packet switch · link · network) vs **service view** (infrastructure + API → distributed application)
- **End system = host** (client · server) · **packet switch** = router (core) + link-layer switch (access) · **ISP** · **bandwidth**
- **Protocol** = format + order + action · **IETF** → **RFC** · **TCP** (แบ่งข้อมูล/เชื่อมต่อ) · **IP** (address)
- **Encapsulation**: message → segment → packet/datagram → frame → bit · port → IP address → MAC address · trailer อยู่ชั้น link
- **TCP 3-way handshake** SYN → SYN+ACK → ACK แล้วจึง **HTTP GET**
- Access: **DSL** (dedicated · DSLAM) · **cable/HFC** (shared · headend) · **FTTH** · Ethernet · Wi-Fi · cellular
- Media: **guided** (twisted pair Cat 5/6 · coax · fiber) · **unguided** (radio) · fiber → repeater, immune ต่อ EM noise
- **Packet switching** · **routing** (global) vs **forwarding** (local) · **transmission delay = L / R**
- **Network of networks**: tier-1 ISP · regional ISP · access ISP · **IXP** · **peering** · content provider (O(N²))
- Security: **packet sniffing** (Wireshark) · **IP spoofing** · **DoS** (botnet) · **firewall** · VPN

---

## จุดที่มักพลาด

- **Web server เป็น end system** — host ทุกเครื่องที่รันแอปคือ end system ไม่ว่าจะเป็น client หรือ server
  (ไฟล์สไลด์ในคลังมีลายมือเขียนตอบว่า "No" ไว้ — ข้อนี้ผิดตามตำรา Kurose)
- **Router ไม่ใช่ communication link** · **link-layer switch ไม่ใช่ end system**
- RFC ออกโดย **IETF** ไม่ใช่ IEEE
- DSL = สายเฉพาะของบ้าน · cable = แชร์กับเพื่อนบ้าน
- Routing = วางเส้นทางทั้งหมด · forwarding = ส่งต่อที่ router ตัวเดียว

---

## ทดสอบตัวเอง

1. ข้อใดไม่ใช่ end system: desktop · web server · เซนเซอร์วัดสภาพแวดล้อม · link-layer switch
2. หน่วยข้อมูลของ network layer เรียกว่าอะไร
3. packet 1,000 บิต ส่งเข้าลิงก์ 1 Mbps ใช้เวลาส่งเท่าไร
4. การโจมตีที่ปลอม source address ของ packet เรียกว่าอะไร
5. สื่อใดจัดเป็น unguided media
6. ชั้นใดของ TCP/IP เติมทั้ง header และ trailer และ address ที่ใช้ในชั้นนั้นคืออะไร
7. เรียงขั้นตอนของ DoS ที่ใช้ botnet ให้ถูก
8. packet 5,000 บิต ส่งเข้าลิงก์ 10 Mbps ใช้เวลาส่งเท่าไร
9. IXP คืออะไร และต่างจากการต่อ ISP ตรง ๆ แบบ peering link อย่างไร

**เฉลย** — 1. link-layer switch · 2. datagram · 3. L/R = 1,000 / 1,000,000 = 1 ms · 4. IP spoofing ·
5. radio (Wi-Fi, 4G/5G, satellite) · 6. ชั้น Link (frame) — ใช้ MAC address · 7. เลือกเป้าหมาย → เจาะยึด host (botnet) → สั่ง host ที่ถูกยึดส่ง packet ถล่มเป้าหมาย ·
8. L/R = 5,000 / 10,000,000 = 0.0005 s = 0.5 ms · 9. IXP = จุดศูนย์กลางที่หลาย ISP มาแลก traffic กัน · peering link = ISP สองรายต่อแลก traffic กันโดยตรง

---

## แล็บ — Network 1 · Cisco Packet Tracer (1)

> ใบงาน Lab 11 ยังไม่อยู่ในคลัง — เปิดจาก [OnLearn](https://onlearn.it.kmitl.ac.th/course/view.php?id=1766) · ส่งงานใน OnLearn แยกตามรอบแล็บ
>
> สรุปจากใบงาน Lab 12 ที่ทวนแล็บสัปดาห์นี้ไว้ ขั้นตอนเต็มให้ยึดใบงาน Lab 11

- **เป้าหมาย** — ให้อุปกรณ์ที่อยู่**วงเครือข่ายเดียวกัน**คุยกันผ่าน switch เป็นงานระดับ **Layer 2 (link layer)** ยังไม่มี router
- ทำโจทย์ใน **Cisco Packet Tracer** ผ่านระบบ **SecSpace** (`ctf.it.kmitl.ac.th`) คอร์ส *Cisco Packet Tracer | ITF 2026* —
  ดาวน์โหลดไฟล์ `.pka` ทำจน PC ส่งข้อมูลถึง server ได้ แล้วนำ flag ที่ได้ไปส่งในหน้าโจทย์
- โจทย์ Layer 2 ในคอร์สคือ `[CONFIG]-VLAN-1` และ `[CONFIG]-VLAN-2` — ถ้า PC ไปไม่ถึง server ให้ตรวจ VLAN ก่อน
- วิธีเข้า SecSpace และคำสั่ง Cisco IOS อยู่ในหัวข้อแล็บของ [Week 12](/courses/06016402-IT-Fundamentals/map?doc=week12)
