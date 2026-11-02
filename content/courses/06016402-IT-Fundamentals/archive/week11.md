# สัปดาห์ที่ 11 · Internet & Computer Networks 1

> รศ.ดร. ปานวิทย์ ธุวะนุติ · สไลด์ Internet (69 หน้า) อิง Kurose & Ross *Computer Networking* 8th ed. บทที่ 1 · แล็บ Network 1 — Cisco Packet Tracer (1)
>
> คำศัพท์ภาษาอังกฤษล้วน — ข้อสอบมักถามว่า "ข้อใดไม่ใช่" end system หรือ communication link

> **ระดับความเน้นสอบปลายภาค ⭐⭐⭐ เน้นมาก** — สัปดาห์ 11–13 (Internet · Computer Networks · Wireless) ถูกระบุว่าออกสอบหนัก: ให้เข้าใจ concept
> และจำ **keyword** ให้ได้ (encapsulation · packet switching · routing vs forwarding · tier-1 ISP / IXP · packet sniffing / IP spoofing / DoS) ·
> ข้อมูลนี้มาจาก**สรุปของเพื่อนร่วมรุ่น ไม่ใช่ประกาศของผู้สอน** — ขอบเขตจริงให้ยึดประกาศใน OnLearn ·
> อ่านทบทวนจากสไลด์สรุปแปลไทยทีละหัวข้อ `itf-sheet-week11-internet-th.pdf` และ
> [โน้ตสรุปของ Tammadon Suksa (IT24) บน Notion](https://app.notion.com/p/ITF-407363d85cea806abdc6c9ec2254f668) — ฉบับเต็มพร้อมรูปอยู่ [ท้ายหน้า](#โน้ตสรุปจาก-notion-tammadon-suksa-it24)

> **สไลด์เสริม: Infraclover · ITCAMP20** — [เปิดบน Canva](https://www.canva.com/design/DAGCkM3YnoQ/Z7wwI-5nryw8dqHmKzjzog/view) ·
> สไลด์จากค่าย ITCAMP20 ที่แนะนำให้อ่านเสริมเรื่องเครือข่าย · ไม่ใช่เอกสารของผู้สอน และ*ยังไม่ยืนยัน*ว่าครอบคลุมหัวข้อใดของสัปดาห์นี้ —
> ถ้าเนื้อหาต่างจากสไลด์วิชา ให้ยึดสไลด์วิชา

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

---

## โน้ตสรุปจาก Notion · Tammadon Suksa (IT24)

> ขอบคุณ **Tammadon Suksa (IT24)** ที่สรุปและแชร์โน้ตชุดนี้ · คัดลอกจาก [ITF Week 11 บน Notion](https://app.notion.com/p/40a363d85cea80dcae3ec418e2b2a360) เมื่อ 1 พ.ย. 2569 พร้อมรูปประกอบ (ภาพสไลด์ของผู้สอนที่ผู้สรุปเขียนโน้ตทับ) · เนื้อหาเป็นสำนวนของผู้สรุป ถ้าต่างจากสไลด์ให้ยึดสไลด์ · จุดที่ iHelp ตรวจแล้วคลาดเคลื่อนมี ⚠️ กำกับไว้

Week 11 Internet
1.What is the Internet
Internet → Inter + network
nuts and bolt → คือสำนวน เเปลว่า หลักปฎิบัติขั้นพื้นฐาน
Internet → เชื่อมต่อกับ computing device หลายล้านทั่วโลก
มุมมองของ nut and bolts
**Hosts / End Systems (อุปกรณ์ปลายทาง)**: คอมพิวเตอร์, สมาร์ตโฟน, หรือเซิร์ฟเวอร์ที่อยู่ตรงขอบของเครือข่าย (Network Edge) และเป็นตัวรันแอปพลิเคชันต่างๆ
**Packet Switches (อุปกรณ์ส่งต่อข้อมูล)**: ทำหน้าที่รับและส่งต่อก้อนข้อมูล (Packet) ไปยังเป้าหมาย ได้แก่ **Router** และ **Switch**
**Communication Links (สาย/ตัวกลางสื่อสาร)**: ช่องทางเชื่อมต่อ เช่น สายใยแก้วนำแสง (Fiber), สายทองแดง (Copper), หรือคลื่นวิทยุ/ดาวเทียม โดยมีความเร็วในการส่งข้อมูลเรียกว่า **Bandwidth ,** Optical Fiber → Faster
**Networks (ระบบเครือข่าย)**: กลุ่มของอุปกรณ์ ลิงก์ และ Router ที่ถูกบริหารจัดการร่วมกันโดยองค์กรต่างๆ (เช่น เครือข่ายบ้าน, เครือข่ายองค์กร หรือ ISP ผู้ให้บริการอินเทอร์เน็ต)
เวลาส่งข้อมูลไปที่ End system มันจะ เเบ่งข้อมูลเป็นชิ้นย่อยๆก่อน ก็คือ Segment ออกมา จากนั้นจะเพิ่ม Header ข้อมูลส่วนหัวไปในเเต่ละชิ้น   
จากนั้นก้อนข้อมูลที่ได้ จะเรียกว่า Packets จะถูกส่งไปยัง End system ปลายทางที่รับ   
จากนั้นก็จะนำข้อมูลเเต่ส่วนหัวมาประกอบเข้าด้วยกัน
Encapsulation → การห่อหุ้มข้อมูล
นำข้อมูลมาเเบ่งเป็นชิ้นย่อยเพิ่มข้อมูล Header เเต่ละชิ้นไปในเเต่ละชั้นของ Layer
ไอเดียของ Encapsulation ตามรูป

![Week 11 รูปที่ 1 — สไลด์ประกอบโน้ต](/notes/itf/week11/01.webp)

TCP/IP ใช้ หลักการ Encapsulation ง่ายๆ
Application Layer → สร้าง Data หรือ Message ขึ้นมา
Transport Layer → สร้าง Header โปรโตคอลขนส่ง ในรูปคือ TCP เพื่อระบุ Port เเละการเชื่อมต่อ ชั้นนี้เรียกว่า   
                                    Segment
Internet Layer → สร้าง Header ของ IP ครอบไปอีกชั้น ชั้นนี้คือระบุ Address ต้น-ปลายทาง ชั้นนี้คือ  Packet                                    หรือ Datagram
Data Link Layer → สร้าง Header เเละ Trailer ตามรูป เพื่อระบุ MAC Address (Physical Address) ใช้ตรวจจับ                                   ข้อผิดพลาด ชั้นนี้เรียกว่า Frame
Physical Layer → เเปลงข้อมูลทั้งหมด เป็นสัญญาณ Transmit Bits (ตัวเลข Binary ที่ส่งเป็น สัญญาณไฟฟ้า หรือคลื่นวิทยุ)
Encapsulation → Message → Segment → Packet (Datagram) → Frame

![Week 11 รูปที่ 2 — สไลด์ประกอบโน้ต](/notes/itf/week11/02.webp)

เพื่อให้เห็นภาพมากขึ้นตอนเวลาส่งข้อมุลไปยัง End system destination

![Week 11 รูปที่ 3 — สไลด์ประกอบโน้ต](/notes/itf/week11/03.webp)

ประเภทของ Packet Switch → มีเยอะ เเต่สำคัญสองเเบบ
Router → โดยทั่วไปใช้งานใน network core เครือข่ายเเกนกลางหลัก
Link-layer switches → ถุกใช้งานใน access network (วงภายใน)
สวิตซืทั้งสองอย่างทำหน้าที่ส่ง Packet → ultimate destination

packet ที่เดินทางผ่าน packet switch เดินทางตั้งเเต่ sending end system ถึง receiving end system  
เรียกว่า route หรือ path ผ่าน network
End system หรือเครื่องของผู้ใช้อย่างเรา เข้าถึง Internet ผ่าน ISPs หรือ Internet Service Providers เช่น AIS True

ISPs ให้บริการ network access หลายรูปเเบบ
residential broadband access เช่น cable modem หรือ DSL
High-speed local area network access
wireless access
56 kbps dial-up modem access

Internet คือการเขื่อมต่อ end system เข้าด้วยกัน มี ISPs ที่ให้บริการ access เเก่ end system
Concept image

![Week 11 รูปที่ 4 — สไลด์ประกอบโน้ต](/notes/itf/week11/04.webp)

Lower-tier ISPs เชื่อมต่อถึง upper-tier ISPs ทั้งระดับชาติเเละประเทศ เช่น  
**Level 3 Communications**  **AT&T** (USA), **Sprint** (USA), และ **NTT** (Japan)  
  
Upper-tier ISP ประกอบด้วย
high speed router เชื่อมด้วย high speed fiber optic link
รันบน IP protocal
Tier 1 → ระดับใหญ่สัสเร็วเเรงด้วย พวก AT&T มีเคเบิ้ลใต้น้ำเบิ้มๆเลย
Tier 2 → ไก่ลงมาหน่อย AIS True
Tier 3 → ตามรูปเลย

![Week 11 รูปที่ 5 — สไลด์ประกอบโน้ต](/notes/itf/week11/05.webp)

Protocals มีอยู่ทุกที่
ควบคุมการส่งเเละรับ msg เช่น HTTP , streaming video , TCP , IP, Wifi
มาตรฐาน Internet (Internet Standard) → สร้างขึ้นโดย IETF (Internet Engineering Task Force)
RFC → Request for comment (เอกสารมาตรฐานออกโดย หน่วยงาน IETF)
IETF → Internet Engineering Task Force

End system , packet switch เเละองค์ประกอบอื่นๆของอินเทอร์เน็ต จะรัน protocal  ควบคุมการส่งข้อมูล
TCP → Transmission Control Protocal → เเบ่งข้อมูลเป็นชิ้นเล็กๆที่เรียกว่า Packet
> ⚠️ **หมายเหตุ iHelp:** ชิ้นข้อมูลของ TCP เรียก **segment** — คำว่า packet / datagram ใช้กับชั้น IP (ดูลำดับ Encapsulation ข้างบน)
IP → Internet Protocal → กำหนดที่อยู่ IP Address
สองอย่างนี้สำคัญที่สุดในอินเทอร์เน็ต

ตัวอย่างข้อสอบ

![Week 11 รูปที่ 6 — สไลด์ประกอบโน้ต](/notes/itf/week11/06.webp)

Internet a service view คืออะไร
Infrastructure → ให้บริการเเก่ application พวก web , strearming , game , email
programming interface → ได้เเก่ hook ที่ช่วยให้ sending receiving app สามารถ connect เพื่อใช้งาน transport service
application ถูกเรียกว่า distribute application
End system เชื่อมกับ API มันคือตัวระบุว่า โปรเเกรมบน end system เครื่องหนึ่ง จะร้องขอให้ส่งข้อมูล ไปยังโปรเเกรมปลายทางไปอีกเครื่องหนึ่งอย่างไรได้บ้าง
Image Concept

![Week 11 รูปที่ 7 — สไลด์ประกอบโน้ต](/notes/itf/week11/07.webp)

1. What is Protocal ? → กำหนด format ,order , ของ message ที่ถูกส่งเเละรับ ระหว่าง Network entities เเละกำหนด action ที่ต้องทำเมื่อมีการส่ง msg transmission เเละการรับ
   - ตัวอย่าง Protocal

   ```
   |                                                 |
   | ------ 1. TCP Connection Request (SYN) --------> |  (ก๊อกๆ ขอเชื่อมต่อหน่อย)
   | <----- 2. TCP Connection Response (SYN+ACK) ---- |  (ได้เลย เปิดท่อให้แล้ว)
   | ------ 3. TCP Acknowledge (ACK) ---------------> |  (รับทราบ เริ่มส่งข้อมูลกัน!)
   |                                                 |
   | ======= ท่อ TCP เชื่อมต่อสำเร็จ (Established) ======= |
   |                                                 |
   | ------ 4. HTTP GET (ส่งคำขอไฟล์ผ่านท่อ TCP) -----> |  (ขอไฟล์หน่อยจ้า)
   | <----- 5. TCP ACK (ตอบรับว่าได้คำขอแล้ว) --------- |  (ได้รับคำขอแล้ว รอแป๊บ)
   | <----- 6. HTTP Response + ไฟล์ข้อมูล ------------ |  (นี่ไฟล์ที่ขอครับ)
   | ------ 7. TCP ACK (ตอบรับว่าได้ไฟล์ครบแล้ว) ------> |  (ได้ไฟล์ครบถ้วน ขอบคุณครับ)
   ```

   ![Week 11 รูปที่ 8 — สไลด์ประกอบโน้ต](/notes/itf/week11/08.webp)

2. Network Edge
   - Edge of network → computer , device , (edge network)
   - End system ถูกเรียกว่า Host เพราะมันรันโปรเเกรม application → End system = Host
   - บางครั้ง Host เเบ่งออกเป็น 2 ประเภท
     - 1.Client → Smartphone , desktop
     - 2.Server → จัดเก็บเเจกจ่าย Web page , video , email
   - ปัจจุบัน Server ส่วนใหญ่ มี datacenter ตั้ง google ประมาณ  30/50 เเห่ง
   - Biomedical device สามารถฝังเชื่อมต่อเป็นเครือข่ายใน body area network ได้ ด้วยอุปกรณ์ หลายอย่างรวมด้วยกัน อินเทอร์เน็ตจึงกลายเป็น internet of things อย่างเเท้จริง
   - Network edge :
     - Host : client , server
   - Access network , physical media :
     - wired , wireless
   - Network core :
     - network , ISPs  , enterprise network (KMITL)
3. Access networks and physical media
   - Access Network
     - Home Access : DSL, Cable , FTTH ( Fiber to the home) Dial-Up and satellite
     - Access in the enterprise : Ethernet , Wifi
     - Wide area wireless access : 3g and lte
       - DSL → Digital subscriber line พวกสายทองเเดงของระบบโทรศัพท์บ้าน
       - FTTH → Fiber to the home เทคโนโลยี อืนเทอร์เน้ตความเร็วสูงผ่าน fiber optic หรือสายใยเเก้วนำเเสง หลักการคือ ISP ยิง Fiber วิ่งเข้าบ้านเราเลย
       - Ethernet → Local Area network ส่วนใหญ่ใช้ใน Enterprise KMITL ก้เช่นกัน
     - Wireless access networks
       - เชื่อมต่อ endsystem เข้ากับ router ผ่าน base station เรียกว่า access point (AP)
       - Wireless LANs ใช้ภายในอาคาร ประมาณ 100ft
         - 802.11b/g WiFI → trasmission rate อยู่ที่ 11 , 54 ,450 Mbps ตอนนี้ Wifi 6/7 ทำความเร็ว 1Gbps ขึ้น
         - 802.11 คือรหัส Wifi กำหนดโดย IEEE |  b/g คือรุ่น หรือเวอร์ชั่นพัฒนา
       - Wide-area wireless access ใช้ภายใน 10 km ให้บริการโดยเครือข่ายมือถือ
         - ความเร็วต่ำ 10 Mbps
         - เครือข่าย Cellular 4G 5G
     - Physical Media :
       - Bit → เคลื่อนที่ไปมาระหว่าง transmitter กับ receiver pair
       - physical link → ตัวกลางระหว่าง transmitter เเละ receiver
       - guided media → สัญญาณเคลื่อนที่ผ่านตัวกลาง , Copper , fiber optic , coax
       - unguided media → สัญญาณอิสระ
       - Twisted pair (TP) มันคือ สายคู่เกลียว ที่นำสัญญาณ ที่ใช้ทองเเดงหุ้ม เช่น LAN
         - Category 5 (Cat 5) 100Mbps - 1 Gbps
         - Category 6 (Cat 6) 10Gbps
       - Coaxial cable → สายนำสัญญาณเเบบทองเเดงเดี่ยวตรงกลางมีตาข่ายหุ้มเน้นใช้ พวก cable tv ยุคเเรกๆ
       - Fiber optic cable → สายใยเเก้วนำเเสง นำเเสงส่งพัลส์เเสง เเต่ละพัลส์เเทนข้อมูล 1 bit low error rate
         - **repeaters:** เครื่องทวนสัญญาณ ทำหน้าที่ช่วยขยายสัญญาณที่เริ่มอ่อนลงเมื่อส่งไประยะไกลๆ ยกตัวอย่างเหมือน Red stone repeater ในมายคราฟ
         - **electromagnetic noise:** สัญญาณรบกวนทางแม่เหล็กไฟฟ้า (เช่น จากสายไฟแรงสูง, มอเตอร์, ฟ้าผ่า) ซึ่งสาย **Fiber Optic** จะไม่ได้รับผลกระทบเลย (**immune**) เพราะใช้แสงในการส่ง ไม่ใช่ไฟฟ้า
4. The network core
   - mesh of interconnected routers → เครือข่ายเเบบตาข่ายของ router ที่เชื่อมต่อกัน

![Week 11 รูปที่ 9 — สไลด์ประกอบโน้ต](/notes/itf/week11/09.webp)

packet switching ตัว host จะย่อย application layer message ออกเป็น packets
วิธีการ net work ทำการส่งต่อ packets จาก router ตัวหนึ่งไปยังอีกตัว ผ่าน links บน path จาก source ต้นทาง ไปยัง destination ปลายทาง
1. Internet structure a network of networks
   - ให้ access ISPs หลายล้านคนทั่วโลก จะทำยังไงให้ connect กันได้ทั้งหมด ?
     - Step 1 : ถ้าเชื่อมต่อตรงกันทุกตัว Direct Connection / Mesh ปัญหาคือจะ O(nกำลัง2) ซึ่งมันเยอะเกิน
     - Step 2: เเนวคิดเลยสร้าง Global Transit ISP ขึ้นมาตรงกลาง เเล้วให้ access ที่ ISP ตัวนี้ ซึ่งทำให้เกิดความคิดโมเดล ธุรกิจขึ้นมาเลยมี global isp หลายเจ้า
     - Step 3: พอเกิด global ISP หลายเจ้า packet มันจะไม่ connect กันทั้งหมดหลายล้านคนได้ จึงเกิด
     - Step 4: เชื่อมต่อระหว่าง Global ISP มี 2 วิธีคือ
       1. Peering link เชื่อมต่อ สอง ISP เข้าด้วยกัน เพื่อเเลก Traffic กันโดยตรง
       2. IXP (Internet exchange point) คือศูนยืกลางเเลกเปลี่ยน ข้อมูลกลาง เชื่อมหลายๆ ISP เข้ามาที่ ตัวเดียวๆกันได้
     - Step 5: เลยทำให้มีการเพิ่มชั้นระดับ Regional ISPs ขึ้นมา เพื่อรวม access ISP ในท้องถิ่นเข้าด้วยกันก่อน เเล้วค่อยส่งออกไปใน global ISP
     - Step 6 : มีการเข้ามาของ Content Provider network หรือคือ Datacenter ขนาดยักษ์ ที่เชื่อมต่อกับ IXP หรือ Regional access ISP โดยตรง เพื่อลดระยะทางในการส่ง ข้อมูล เลยทำให้เข้าเว็บเร็วขึ้น
2. Network security
   - internet ไม่ได้ออกเเบบมาเรื่อง security ตั้งเเต่ต้น
     - internet protocal designer ต้องคอยเเก้ปัญหาตามทีหลัง → catch-up
     - ต้องพิจารณาความปลอดภัยทุก layer
   - Bad guys : packet interception
     - packet sniffing → การดักข้อมูล → Ethernet , wireless
       - อ่านเเละบันทึก packet ที่วิ่งผ่าน เช่น software wireshark software
   - Bad guys : packet fake identity ปลอมตัว
     - IP spoofing : ปลอมเเปลง ip ต้นทาง ตัวอย่างในรูป

     ![Week 11 รูปที่ 10 — สไลด์ประกอบโน้ต](/notes/itf/week11/10.webp)

   - Bad guys : denial of service (DoS)
     - ทำให้ไม่สามารถบริการได้
     - concept → โจมตี ทำให้ทรัพยากร (server,bandwidth) ไม่สามารถให้บริการกับ legitimate traffic (คนที่ใช้งานจริงๆ) โดยโจมตีด้วยการใช้ bogus traffic พวกทราฟฟิกขยะ
       - วิธีโจมตี
       1. เลือกเป้าหมาย
       2. hack เข้ายึด host ต่างๆในเครือข่าย
       3. สั่งให้ host ที่ถูกยึด ระดมส่ง packet ไปยังเป้าหมาย

       ![Week 11 รูปที่ 11 — สไลด์ประกอบโน้ต](/notes/itf/week11/11.webp)

   - Line of defense

     ![Week 11 รูปที่ 12 — สไลด์ประกอบโน้ต](/notes/itf/week11/12.webp)
