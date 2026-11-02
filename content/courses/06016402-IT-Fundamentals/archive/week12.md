# สัปดาห์ที่ 12 · Computer Networks 2

> รศ.ดร. ปานวิทย์ ธุวะนุติ · สไลด์ Introduction to Computer Network (92 หน้า) · แล็บ Network 2 — Cisco Packet Tracer (2) เรียนออนไลน์
>
> สรุปบรรยายจากสไลด์ที่มีในคลัง — ฉบับ 22 ก.ย. 2569 อยู่ใน OnLearn ถ้าเนื้อหาต่างกันให้ยึดฉบับใน OnLearn ·
> หัวข้อแล็บสรุปจากใบงานจริงของ 1/2569

> **ระดับความเน้นสอบปลายภาค ⭐⭐⭐ เน้นมาก** — สัปดาห์ 12 เป็นสัปดาห์ที่ถูกเน้นที่สุด: เข้าใจ concept + จำ **keyword** (topology · CSMA/CD ·
> collision vs broadcast domain · class/private IP · NAT) และต้อง**คำนวณ IP address · Network ID · Host ID · Subnet mask** ได้ — ฝึกจากหัวข้อ
> "วิธีคำนวณ IP ทีละขั้น" (§6) ข้างล่าง · ข้อมูลนี้มาจาก**สรุปของเพื่อนร่วมรุ่น ไม่ใช่ประกาศของผู้สอน** — ขอบเขตจริงให้ยึดประกาศใน OnLearn ·
> อ่านทบทวนจากสไลด์สรุปแปลไทยทีละหัวข้อ `itf-sheet-week12-computer-networks-th.pdf` และ
> [โน้ตสรุปของ Tammadon Suksa (IT24) บน Notion](https://app.notion.com/p/ITF-407363d85cea806abdc6c9ec2254f668) — ฉบับเต็มพร้อมรูปอยู่ [ท้ายหน้า](#โน้ตสรุปจาก-notion-tammadon-suksa-it24)

> **สไลด์เสริม: Infraclover · ITCAMP20** — [เปิดบน Canva](https://www.canva.com/design/DAGCkM3YnoQ/Z7wwI-5nryw8dqHmKzjzog/view) ·
> สไลด์จากค่าย ITCAMP20 ที่แนะนำให้อ่านเสริมเรื่องเครือข่าย · ไม่ใช่เอกสารของผู้สอน และ*ยังไม่ยืนยัน*ว่าครอบคลุมหัวข้อใดของสัปดาห์นี้ —
> ถ้าเนื้อหาต่างจากสไลด์วิชา ให้ยึดสไลด์วิชา

## อ่านจบแล้วต้องตอบได้

- แยก physical topology 5 แบบ และ multiple access protocol (CSMA · CSMA/CD · token passing)
- บอกมาตรฐาน Ethernet แต่ละรุ่นและความต่างของ Gigabit กับ 10-Gigabit
- แยก **repeater/hub · bridge/switch · router** ตามหน้าที่
- **หา network ID** จาก IP address และ subnet mask ด้วยการ AND
- บอก class A/B/C, private IP และวิธีแก้ปัญหา IPv4 ไม่พอ
- ตั้ง IP ให้พอร์ตของ router เขียน **static route** และหา **next hop** ของ router แต่ละตัว (แล็บ)

---

## เอกสารประจำสัปดาห์

| เอกสาร | หน้า | ไฟล์ในคลัง |
|---|:---:|---|
| สไลด์บรรยาย — Introduction to Computer Network (ฉบับ 2569) | 92 | `itf-lec-week12-computer-networks-2569.pdf` |
| สรุปฉบับแปลไทย — Week 12 เครือข่ายคอมพิวเตอร์ | 1 | `itf-sheet-week12-computer-networks-th.pdf` |
| สไลด์บรรยายฉบับปีก่อน | 92 | `itf-lec-week12-computer-networks.pdf` |
| ใบงานแล็บ Network 2 — Cisco Packet Tracer (2) ฉบับ 1/2569 | 20 | `itf-lab-week12-packet-tracer-2-sheet.pdf` |
| สรุปลายมือ — Network 2 | 2 | `itf-lec-network-2.pdf` |
| ใบงานแล็บ Cisco Packet Tracer #2 (ฉบับ 1/2566 ใช้ฝึกเพิ่ม) | 4 | `itf-lab-week12.pdf` |

> **มีใน OnLearn แต่ยังไม่อยู่ในคลัง** — สไลด์ Lecture 12 ฉบับที่ผู้สอนจดโน้ตทับ (รอบ 14:00–16:00 และ 16:00–18:00) · คลิปบันทึกการชี้แจงแล็บ (id 27575)

---

## สรุปอ่านสอบ

### 1. Topology

| Physical topology | ลักษณะ |
|---|---|
| **Mesh** | ทุกเครื่องต่อตรงถึงกัน — n เครื่องใช้ n(n−1)/2 สาย · ทนทานแต่แพง |
| **Star** | ทุกเครื่องต่อเข้าศูนย์กลาง (hub/switch) |
| **Bus** | ใช้สายหลักเส้นเดียวร่วมกัน |
| **Ring** | ต่อกันเป็นวง |
| **Hybrid** | ผสม เช่น star backbone ต่อ bus หลายวง |

| Topology | ข้อดี | ข้อเสีย |
|---|---|---|
| **Mesh** | **redundancy** สูงสุด — สายเส้นหนึ่งขาด ข้อมูลไปเส้นทางอื่นได้ทันที | ใช้สายมาก ค่าใช้จ่ายสูงสุด |
| **Star** | จัดการง่าย หาจุดเสียง่าย สายของเครื่องใดขาด เครื่องอื่นยังใช้ได้ | ศูนย์กลางเสีย = ล่มทั้งหมด (**single point of failure**) |
| **Bus** | ประหยัดสาย ติดตั้งง่าย | สายหลัก (**backbone / bus**) ขาดจุดเดียว ล่มทั้งระบบ · ต้องมี **terminator** ปิดปลายสายทั้งสองด้าน |
| **Ring** | ข้อมูลวิ่งทิศทางเดียวทีละ node ไม่ชนกัน · เหมาะพื้นที่ใหญ่ ประหยัด | node ใด node หนึ่งขาด วงล่มทั้งระบบ |
| **Hybrid** (star backbone + bus) | ขยายระบบง่าย แยกจุดเสียง่าย | สายหลักขาด การสื่อสารข้ามกลุ่มหาย · ใช้สายเยอะ |

- **Logical topology** = กติกาแชร์ตัวกลางร่วม (multiple access protocol)
  - **MA มีไว้เพื่อ** ① ไม่ให้อุปกรณ์ที่ไม่เกี่ยวข้องรบกวนกันจนข้อมูลเสียหาย ② ไม่ให้ใครยึดตัวกลางร่วม (common link) ไว้คนเดียว
  - **CSMA** — ฟังก่อนพูด (listen before talk) · ลดการชนแต่เลี่ยงไม่ได้ทั้งหมดเพราะ propagation delay
  - **CSMA/CD** — เพิ่มการตรวจจับการชน ชนแล้วส่งใหม่ และรอด้วย **back-off**
    - ตรวจจับการชน**ขณะกำลังส่ง** (ฟังสายไปด้วย) ไม่ได้รอ ACK — การรอ ACK เป็นของ **CSMA/CA** (Wi-Fi 802.11, Week 13)
    - **back-off**: สุ่มรอ **0 ถึง 2ⁿ − 1 slot time** แล้วค่อยส่งใหม่ · **n = จำนวนครั้งที่ชนมาแล้ว** (ชนซ้ำ ช่วงสุ่มกว้างขึ้น โอกาสชนซ้ำลดลง)
  - **Token passing** — ต้องเป็น ring (physical หรือ logical) · ส่งได้เฉพาะตอนถือ token
  - แบบแบ่งช่องสัญญาณ: FDMA (ความถี่) · TDMA (เวลา) · CDMA (รหัส)

| Physical | Logical | มาตรฐาน |
|---|---|---|
| Bus, star | CSMA/CD | **Ethernet** |
| Bus | Token passing | Token Bus |
| Ring | Token passing | Token Ring |
| Dual ring | Token passing | FDDI |

### 2. Ethernet

- คิดค้นโดย Robert Metcalfe ปี 1973
- **Standard Ethernet 10 Mbps**: 10Base5 (coax หนา) · 10Base2 (coax บาง) · **10Base-T** (twisted pair) · 10Base-F (fiber)
  - อ่านชื่อ **10Base5**: **10** = 10 Mbps · **Base** = baseband (สัญญาณดิจิทัล) · **5** = ความยาวสายต่อ segment (หน่วย ~100 m → ราว 500 m) ·
    **T** = twisted pair (UTP — สาย LAN) · **F** = fiber optic
- Fast Ethernet 100 Mbps · Gigabit Ethernet · 10-Gigabit Ethernet

| | Gigabit | 10-Gigabit |
|---|---|---|
| โหมด | CSMA/CD + full duplex | **full duplex อย่างเดียว** |
| สื่อ | optical และ copper | optical เป็นหลัก |
| ระยะ LAN | ถึง 5 km | ถึง 40 km |

- Bridge แบ่ง **collision domain** · switched Ethernet และ full-duplex switch ทำให้ไม่ชนกันเลย

### 3. อุปกรณ์เชื่อมต่อ

⭐⭐ แยกหน้าที่ให้ออก

| อุปกรณ์ | หน้าที่ |
|---|---|
| **Repeater / hub** | ต่อ segment ของ LAN · ส่งต่อทุก frame **ไม่กรอง** · เป็น regenerator ไม่ใช่ amplifier |
| **Bridge / layer-2 switch** | ดู **MAC address** และเรียนรู้ตาราง bridge · กรองว่าจะส่งไปพอร์ตไหน |
| **Router / layer-3 switch** | เชื่อม LAN และ WAN ที่เป็นอิสระต่อกัน · หาเส้นทางด้วย IP |
| **Backbone** | เชื่อมหลาย LAN — bus backbone หรือ star backbone (switch ตัวเดียว) · เป็นแกนกลาง สถานีไม่ต่อตรงเข้า backbone เพราะอยู่ใน LAN ของตัวเองแล้ว |

⭐⭐⭐ **อุปกรณ์ต่อ layer · collision domain · broadcast domain**

| Layer | อุปกรณ์ | ทำงานกับ | Collision domain | Broadcast domain |
|---|---|---|---|---|
| Physical | **Passive hub** | แค่จุดต่อสายทางกายภาพ ไม่ประมวลผลสัญญาณ | ไม่แยก | ไม่แยก |
| Physical | **Repeater / hub** | สัญญาณไฟฟ้า/แสง ระดับ bit — ทวนสัญญาณ | ไม่แยก | ไม่แยก |
| Data link | **Bridge / layer-2 switch** | **frame** + **MAC address** | **แยก** | ไม่แยก |
| Network | **Router / layer-3 switch** | **packet** + **IP address** — ส่งข้าม subnet | แยก | **แยก** |
| Transport · Application | **Gateway** | แปลง protocol ให้เครือข่าย/แอปที่ใช้คนละ protocol คุยกันได้ | — | — |

จำสั้น ๆ: **switch แยก collision domain · router แยก broadcast domain**

### 4. IPv4 Addressing

⭐⭐⭐ การหา network ID ออกเป็นโจทย์คำนวณ

- IPv4 ยาว **32 บิต** · มี 2³² = 4,294,967,296 address · เขียนแบบ dotted-decimal
- IP address = **network ID + host ID** · **subnet mask** บอกว่าบิตไหนเป็น network
- หา network ID: นำ IP **AND** กับ subnet mask ทีละบิต — `1 AND x = x` · `0 AND x = 0`

| IP address | Subnet mask | Network ID |
|---|---|---|
| 161.246.18.4 | 255.255.0.0 | 161.246.0.0 |
| 192.168.1.200 | 255.255.255.0 | 192.168.1.0 |
| 161.246.38.200 | 255.255.255.128 | 161.246.38.128 |
| 192.168.1.130 | 255.255.255.192 | 192.168.1.128 |
| 192.168.1.70 | 255.255.255.192 | 192.168.1.64 |

- network ID เดียวกัน → คุยกันตรงผ่าน switch · ต่างกัน → ส่งให้ **router (gateway)** หาเส้นทาง
- ค่าที่เครื่องต้องตั้ง: **IP address · subnet mask · default gateway** (ทางออกไปวงอื่น/อินเทอร์เน็ต) · **DNS server**
  - **DNS** แปลง domain name เป็น IP — ถ้า DNS ไม่มี/พัง เข้าเว็บด้วยชื่อไม่ได้ (ใช้ IP ตรง ๆ ยังได้) · ตัวอย่าง DNS สาธารณะของ Google = **8.8.8.8**
  - ISP ให้ public address จริงมา 1 ตัว ส่วนเครื่องในบ้าน/องค์กรใช้ private address ออกเน็ตผ่าน **NAT**

| ส่งแบบ | ถึงใคร |
|---|---|
| **Unicast** | host เดียว |
| **Broadcast** | ทุก host ใน network · host bits เป็น 1 ทั้งหมด · router ไม่ส่งต่อถ้าไม่ได้ตั้งค่า |
| **Multicast** | กลุ่มที่เลือก · ใช้ช่วง 224.0.0.0 |

| Network | Host | ความหมาย |
|---|---|---|
| 0 ทั้งหมด | 0 ทั้งหมด | เครื่องนี้ (ตอน bootstrap) |
| network | 0 ทั้งหมด | **network address** |
| network | 1 ทั้งหมด | **directed broadcast** |
| 1 ทั้งหมด | 1 ทั้งหมด | limited broadcast (local) |
| 127 | อะไรก็ได้ | **loopback** ใช้ทดสอบ |

### 5. Class ของ IPv4 และการประหยัด address

| Class | ไบต์แรก | Network / host bits | Default mask | host ที่ใช้ได้ต่อ network |
|---|---|---|---|---|
| **A** | 0–127 | 8 / 24 | 255.0.0.0 (/8) | 2²⁴ − 2 = 16,777,214 |
| **B** | 128–191 | 16 / 16 | 255.255.0.0 (/16) | 2¹⁶ − 2 = 65,534 |
| **C** | 192–223 | 24 / 8 | 255.255.255.0 (/24) | 2⁸ − 2 = **254** |
| D | — | — | — | multicast |
| E | — | — | — | ทดลอง |

- ลบ 2 เพราะ host ทั้งหมดเป็น 0 = network address · host ทั้งหมดเป็น 1 = broadcast
- ตัวอย่าง: 130.61.22.204/16 → class B · network 130.61.0.0 · broadcast 130.61.255.255 · ใช้ได้ 130.61.0.1 – 130.61.255.254
- **Address depletion** แก้ด้วย private address (RFC 1918) · **NAT** (RFC 1631) · CIDR (RFC 1519) · **IPv6** (RFC 1883)
  - เริ่มสังเกตว่า IP 32 บิตจะไม่พอตั้งแต่ราวปี 1991 เมื่ออินเทอร์เน็ตโตขึ้น
  - **Private address** = ช่วง IP ที่ไม่ใช้เชื่อมออกอินเทอร์เน็ตโดยตรง
  - **NAT** (concept) = router แปล **private IP → public IP** ตอนส่งออก และแปลกลับตอนข้อมูลตอบ — หลายเครื่องใน LAN ใช้ public IP เดียวออกเน็ตได้

| Private IP | ช่วง |
|---|---|
| Class A | 10.0.0.0 – 10.255.255.255 |
| Class B | 172.16.0.0 – 172.31.255.255 |
| Class C | 192.168.0.0 – 192.168.255.255 |

### 6. วิธีคำนวณ IP · Network ID · Host ID · Subnet mask ทีละขั้น ⭐⭐⭐

**ศัพท์ที่ต้องแยกให้ออก** (ให้ h = 32 − prefix = จำนวนบิต host)

| คำ | ความหมาย |
|---|---|
| **IP address** | 32 บิต = Network ID + Host ID |
| **Prefix `/n`** (CIDR) | n บิตซ้ายสุดเป็นส่วน network |
| **Subnet mask** | 32 บิต — n ตัวแรกเป็น `1` ที่เหลือ `0` · ตัวคั่นระหว่าง Network ID กับ Host ID |
| **Network ID** (network address) | IP AND mask = host bits เป็น `0` ทั้งหมด · "ชื่อวง" ใช้กับเครื่องไม่ได้ |
| **Host ID** | ส่วน host bits ของ IP = เลขประจำเครื่องในวงนั้น (นับจาก network ID) |
| **Broadcast address** | host bits เป็น `1` ทั้งหมด = address สุดท้ายของวง · ใช้ไม่ได้กับเครื่อง |
| **Block size** | จำนวน address ต่อวง = 2^h = 256 − ค่า mask ในชุดที่ไม่ใช่ 255 |
| **Usable host** | 2^h − 2 (หัก network address กับ broadcast) |

**ขั้นตอน**

1. **Prefix → mask**: เขียน `1` n ตัวแล้วเติม `0` ให้ครบ 32 → แบ่งเป็น 4 ชุดละ 8 บิต → แปลงเป็นทศนิยม
   (ชุดที่ครบ 8 บิต = 255 · ชุดที่ยืมบางบิต: 1 บิต = 128 · 2 = **192** · 3 = **224** · 4 = **240** · 5 = **248** · 6 = **252** · 7 = **254**)
2. **Block size** = 256 − ค่า mask ในชุดที่ไม่ใช่ 255 (เช่น 256 − 192 = 64)
3. **จำนวนวงย่อย** = 2^(จำนวนบิตที่ยืม) นับจากขอบเขตที่โจทย์ถาม (เช่น ยืม 2 บิตจาก /24 → 2² = 4 วง) = 256 ÷ block size เมื่ออยู่ในชุดเดียว
4. **Usable host ต่อวง** = 2^h − 2 = block size − 2
5. **Network ID** = IP AND mask — ชุดที่ mask = 255 คัดลอกจาก IP · ชุดที่ mask = 0 ใส่ 0 · ชุดที่ถูกแบ่ง ให้**ปัด IP ลงเป็นจำนวนเท่าของ block size**
   (ทางเลือก: AND ทีละบิต)
6. **Broadcast** = Network ID + block size − 1 (ในชุดที่ถูกแบ่ง) · ชุดหลังจากนั้นเป็น 255
7. **ช่วงที่ใช้ได้** = Network ID + 1 ถึง Broadcast − 1
8. **Host ID** = IP − Network ID (ส่วน host bits)

| Prefix | Subnet mask | Block size | Usable host ต่อวง |
|:---:|---|:---:|:---:|
| /24 | 255.255.255.0 | 256 | 254 |
| /25 | 255.255.255.128 | 128 | 126 |
| /26 | 255.255.255.192 | 64 | 62 |
| /27 | 255.255.255.224 | 32 | 30 |
| /28 | 255.255.255.240 | 16 | 14 |
| /29 | 255.255.255.248 | 8 | 6 |
| /30 | 255.255.255.252 | 4 | 2 |

**ตัวอย่าง (ก) — 161.246.18.x /26 แบ่งวง /24 ออกเป็นวงย่อย** (ตัวอย่างในสไลด์)

- Prefix 26 → `11111111.11111111.11111111.11000000` → mask **255.255.255.192** (192 = 128 + 64)
- Block size = 256 − 192 = **64** · ยืม 2 บิตจาก /24 → 2² = **4 วง** · host bits h = 6 → usable = 2⁶ − 2 = **62** ต่อวง
- รวมใช้ได้ 4 × 62 = **248** เครื่อง (256 address หัก network 4 + broadcast 4)

| วงที่ | Network ID | ช่วงที่ใช้ได้ | Broadcast |
|:---:|---|---|---|
| 1 | 161.246.18.0 | .1 – .62 | 161.246.18.63 |
| 2 | 161.246.18.64 | .65 – .126 | 161.246.18.127 |
| 3 | 161.246.18.128 | .129 – .190 | 161.246.18.191 |
| 4 | 161.246.18.192 | .193 – .254 | 161.246.18.255 |

ลองเครื่อง 161.246.18.**100**: 100 = `01100100` AND `11000000` = `01000000` = 64 → อยู่**วงที่ 2** · Network ID 161.246.18.64 · broadcast .127 · Host ID = 100 − 64 = 36
(ถ้ามองจาก class B เดิม /16 ยืมไป 26 − 16 = 10 บิต → 2¹⁰ = 1,024 วงทั้งหมด — แต่โจทย์แบบนี้มักถามเฉพาะวง /24 เดียว)

**ตัวอย่าง (ข) — 192.168.10.200 /27 หา network, broadcast, ช่วง, Host ID**

- mask = **255.255.255.224** (3 บิต: 128 + 64 + 32) · block size = 256 − 224 = **32** · h = 5 → usable = 2⁵ − 2 = **30** · ยืม 3 บิตจาก /24 → 2³ = 8 วง
- วงเริ่มที่ 0, 32, 64, 96, 128, 160, **192**, 224 → 200 ÷ 32 = 6.25 → ปัดลง 6 × 32 = **192**
- ตรวจด้วยบิต: 200 = `11001000` AND `11100000` = `11000000` = 192 ✓
- **Network ID = 192.168.10.192** · **Broadcast** = 192 + 32 − 1 = 223 → **192.168.10.223** · **ช่วงใช้ได้ 192.168.10.193 – 192.168.10.222**
- **Host ID** = 200 − 192 = **8** (host bits `01000`)

**ตัวอย่าง (ค) — IP ที่ prefix ลงตัว (class A และ class B)**

- **10.16.127.104 /8** (class A — ตัวอย่างในสไลด์): mask **255.0.0.0** · network = ชุดแรก → **Network ID 10.0.0.0** · **Host ID 16.127.104** (24 บิตหลัง)
  · broadcast **10.255.255.255** · ช่วงใช้ได้ 10.0.0.1 – 10.255.255.254 · usable = 2²⁴ − 2 = **16,777,214**
- **172.16.5.20 /16** (class B): mask **255.255.0.0** · **Network ID 172.16.0.0** · **Host ID 5.20** (0.0.5.20) · broadcast **172.16.255.255**
  · ช่วงใช้ได้ 172.16.0.1 – 172.16.255.254 · usable = 2¹⁶ − 2 = **65,534** · เป็น private (172.16–172.31)

**ต่อยอด — prefix ที่ไปตกกลางชุดที่ 3**: 172.16.37.9 /20 → 20 − 16 = 4 บิตในชุดที่ 3 → mask **255.255.240.0** (240 = 128 + 64 + 32 + 16) ·
block size ในชุดที่ 3 = 256 − 240 = 16 → 37 ÷ 16 = 2.3 → 2 × 16 = **32** → **Network ID 172.16.32.0** · broadcast **172.16.47.255** (32 + 16 − 1 = 47, ชุดสุดท้าย 255) ·
host bits = 12 → usable = 2¹² − 2 = **4,094**

### คีย์เวิร์ดต้องจำ

- **Topology**: mesh (redundancy · n(n−1)/2) · star (single point of failure) · bus (backbone · terminator) · ring · hybrid
- **Multiple access**: CSMA · **CSMA/CD** (ตรวจจับการชนขณะส่ง · back-off 0…2ⁿ−1) · token passing (ring) · FDMA / TDMA / CDMA
- **Ethernet**: Metcalfe 1973 · 10Base5 / 10Base2 / **10Base-T** / 10Base-F · Fast · Gigabit · 10-Gigabit (full duplex อย่างเดียว) · switched Ethernet → ไม่ชน
- **อุปกรณ์**: passive hub · repeater/hub (bit, ไม่กรอง) · bridge / L2 switch (frame, MAC, **แยก collision domain**) · router / L3 switch (packet, IP, **แยก broadcast domain**) · gateway · backbone
- **IPv4**: 32 บิต · **Network ID + Host ID** · **subnet mask** · **prefix / CIDR** · AND · block size · broadcast · network address
- **ส่ง**: unicast · broadcast (host bits = 1) · multicast (class D) · loopback 127.x
- **Class**: A 0–127 /8 · B 128–191 /16 · C 192–223 /24 · D multicast · E ทดลอง · usable = 2^h − 2
- **Private**: 10.0.0.0/8 · 172.16–172.31 · 192.168.0.0/16 · **NAT** · IPv6 · CIDR
- **ตั้งค่าเครื่อง**: default gateway · **DNS** (8.8.8.8) · static route · next hop

---

## จุดที่มักพลาด

- Hub **ไม่กรอง** ส่งทุก frame · switch กรองด้วย MAC · router ใช้ IP
- Repeater เป็น **regenerator** ไม่ใช่ amplifier
- Class C ใช้ได้ **254** host ไม่ใช่ 256 — ต้องหัก network กับ broadcast
- 172.**16**–172.**31** เท่านั้นที่เป็น private ของ class B — 172.32.x.x ไม่ใช่
- 10-Gigabit Ethernet ไม่ใช้ CSMA/CD แล้ว — full duplex อย่างเดียว
- วง **/30** มี 4 address แต่ใช้ได้แค่ **2** — ตัวแรกเป็นชื่อวง ตัวสุดท้ายเป็น broadcast
- **Next hop** ต้องอยู่วงเดียวกับพอร์ตของ router เรา — ใส่ IP ของ router ที่อยู่ไกลออกไปไม่ได้
- `ip route` ใส่**ชื่อวง**ปลายทาง (เช่น 172.16.1.0) ไม่ใช่ IP ของเครื่องปลายทาง · ping ข้ามวงต้องมี route **ขากลับ**ด้วย
- **CSMA/CD ไม่ได้ตรวจการชนด้วย ACK** — ฟังสายขณะส่ง แล้ว back-off · ACK เป็นของ CSMA/CA (Wi-Fi)
- Usable host = block size **− 2** ไม่ใช่ block size · /26 → 4 วง × 62 = **248** ไม่ใช่ 256
- Network ID ต้องเป็น**จำนวนเท่าของ block size** (/26 → .0 · .64 · .128 · .192 เท่านั้น — .100 ไม่ใช่ network ID) · ใช้ "256 − mask" ได้เฉพาะชุดที่ไม่ใช่ 255
- Host ID ไม่ใช่เลขชุดสุดท้ายเสมอ — class A 10.16.127.104 มี Host ID = **16.127.104** (ขึ้นกับ prefix)
- **switch** แยก collision domain แต่ไม่แยก broadcast domain · **router** แยก broadcast domain

---

## ทดสอบตัวเอง

1. IP 192.168.10.77 subnet mask 255.255.255.0 มี network ID อะไร
2. IP 150.20.3.4 อยู่ class ใด และ default mask คืออะไร
3. บริษัทมี PC 100 เครื่อง server 1 router 1 ใช้ class C จะเหลือ address ว่างกี่ตัว
4. อุปกรณ์ใดเรียนรู้ MAC address เพื่อกรอง frame
5. Topology แบบใดใช้ token passing บนวงแหวนคู่
6. วง 10.0.0.4/30 มี IP ที่ใช้ได้กี่ตัว อะไรบ้าง
7. Router0 ต่อกับ Router1 ด้วยวง 10.0.0.0/30 (Router0 = .1 · Router1 = .2) ถ้า Router0 จะส่งไปวง 172.16.1.0/24 ที่อยู่หลัง Router1 ต้องพิมพ์คำสั่งใด
8. IP 192.168.5.77 /26 — หา subnet mask · Network ID · Broadcast · ช่วงที่ใช้ได้ · จำนวน host ต่อวง
9. ต้องการวงที่ใส่ host ได้อย่างน้อย 50 เครื่อง ใช้ prefix ที่ยาวที่สุดเท่าไรได้ และ mask คืออะไร
10. IP 172.16.5.20 /16 — หา Network ID · Host ID · Broadcast และเป็น private IP หรือไม่
11. IP 192.168.1.130 /25 — หา Network ID · Broadcast · ช่วงที่ใช้ได้ · Host ID
12. อุปกรณ์ใดแยก broadcast domain และ back-off ใน CSMA/CD สุ่มรอกี่ slot time เมื่อชนมาแล้ว n ครั้ง

**เฉลย** — 1. 192.168.10.0 · 2. class B · 255.255.0.0 · 3. 254 − 102 = 152 · 4. bridge / layer-2 switch · 5. FDDI ·
6. 2 ตัว คือ 10.0.0.5 และ 10.0.0.6 · 7. `ip route 172.16.1.0 255.255.255.0 10.0.0.2` ·
8. mask 255.255.255.192 (block 64) · 77 ปัดลง = 64 → Network ID **192.168.5.64** · Broadcast **192.168.5.127** · ใช้ได้ .65 – .126 · 2⁶ − 2 = **62** host ·
9. ต้อง 2^h − 2 ≥ 50 → h = 6 (62 host; h = 5 ได้แค่ 30) → prefix 32 − 6 = **/26** · mask **255.255.255.192** ·
10. Network ID **172.16.0.0** · Host ID **0.0.5.20** · Broadcast **172.16.255.255** · เป็น private (อยู่ในช่วง 172.16–172.31) ·
11. mask 255.255.255.128 (block 128) · 130 − 128 → Network ID **192.168.1.128** · Broadcast **192.168.1.255** · ใช้ได้ .129 – .254 (126 host) · Host ID = 130 − 128 = **2** ·
12. router / layer-3 switch · สุ่ม 0 ถึง 2ⁿ − 1 slot time

---

## แล็บ — Network 2 · Cisco Packet Tracer (2)

> ย่อจากใบงานจริง 1/2569 (`itf-lab-week12-packet-tracer-2-sheet.pdf`, 20 หน้า) · เรียนออนไลน์ผ่าน Google Meet พฤ. 1 ต.ค. 2569 เวลา 09:00–11:00 รอบเดียวทุกกลุ่ม ·
> คลิปบันทึกการชี้แจงแล็บและที่ส่งงานแยกตามรอบอยู่ใน [OnLearn](https://onlearn.it.kmitl.ac.th/course/view.php?id=1766)

**เป้าหมาย** — สัปดาห์ก่อนให้เครื่องในวงเดียวกันคุยกัน (Layer 2) สัปดาห์นี้ส่งข้อมูล**ข้ามวง**ด้วย router (Layer 3) ·
ตั้ง IP ให้ PC, server และพอร์ตของ router → เขียน static route ให้ router ทุกตัว → ทดสอบด้วย `ping`

**ศัพท์ที่ใบงานใช้** — ใบงานเปรียบเครือข่ายกับการส่งจดหมาย: IP คือบ้านเลขที่ วงเครือข่ายคือซอย router คือที่ทำการไปรษณีย์

| คำ | ความหมาย |
|---|---|
| **Subnet mask** | บอกว่าส่วนไหนของ IP คือชื่อวง · `/24` = 255.255.255.0 · `/30` = 255.255.255.252 (ตัวเลขหลัง `/` = จำนวนบิตของชื่อวง) |
| **Interface** | พอร์ตของ router เช่น `G0/0/0` (GigabitEthernet) แต่ละพอร์ตต่อคนละวง · **ปิดอยู่เป็นค่าเริ่มต้น** ต้องสั่ง `no shutdown` |
| **Default gateway** | IP ของพอร์ต router ที่อยู่วงเดียวกับเครื่อง — ถ้าไม่ตั้ง เครื่องคุยได้แค่ในวงตัวเอง |
| **Routing table** | ตาราง "ไปวงนี้ต้องส่งทางไหน" · เริ่มต้นรู้แค่วงที่ต่อตรง (directly connected) · หาวงปลายทางไม่เจอ = ทิ้ง packet |
| **Static route** | สั่งเองว่าวงที่อยู่ไกลออกไปต้องส่งทางไหน — `ip route <วงปลายทาง> <mask> <next hop>` |
| **Next hop** | IP ของพอร์ต router ตัวถัดไป**ฝั่งที่หันมาหาเรา** |
| **Ping** | ส่ง packet ไปถามว่าอยู่ไหม — ผ่านได้ต้องมีเส้นทาง**ทั้งขาไปและขากลับ** |

- **วง /30** มี 4 address เหลือใช้ได้ 2 ตัว พอดีกับสายที่ต่อ router 2 ตัว — 10.0.0.0/30 ใช้ .1 กับ .2 · วงถัดไป 10.0.0.4/30 ใช้ .5 กับ .6
- **TCP/IP 5 ชั้นในใบงาน** — Application (HTTP, FTP, SSH) · Transport (TCP, UDP, QUIC) · **Internet = Layer 3** หาเส้นทาง และมี ICMP (ping) ·
  **Link = Layer 2** ส่งในวงเดียวกัน · Physical ส่งบิตผ่านตัวกลาง
- ไม่มี router = เครือข่ายทำงานแค่ Layer 2 ออกนอกวงหรือออกอินเทอร์เน็ตไม่ได้ · มี router = Layer 3

**ตัวอย่างในใบงาน — Config Routing 1** · PC0 → Router0 → Router1 → Router2 → Server0 มี 4 วง

| วง | อยู่ระหว่าง |
|---|---|
| 192.168.1.0/24 | PC0 (.10) กับ Router0 (.1) |
| 10.0.0.0/30 | Router0 (.1) กับ Router1 (.2) |
| 10.0.0.4/30 | Router1 (.5) กับ Router2 (.6) |
| 172.16.1.0/24 | Router2 (.1) กับ Server0 (.10) |

| Router | รู้จักอยู่แล้ว (ต่อตรง) | ต้องเพิ่ม | Next hop |
|---|---|---|---|
| Router0 | 192.168.1.0/24 · 10.0.0.0/30 | 172.16.1.0/24 | 10.0.0.2 |
| Router1 | 10.0.0.0/30 · 10.0.0.4/30 | 172.16.1.0/24 และ 192.168.1.0/24 (ขากลับ) | 10.0.0.6 · 10.0.0.1 |
| Router2 | 10.0.0.4/30 · 172.16.1.0/24 | 192.168.1.0/24 (ขากลับ) | 10.0.0.5 |

ก่อนใส่ route ลอง ping จาก PC0 จะผ่านถึง 10.0.0.1 แต่ 10.0.0.2 timeout เพราะ Router1 ไม่รู้ทางกลับไปวงของ PC0 ·
ใส่ route ครบแล้ว `ping 172.16.1.10` (ครั้งแรกอาจ timeout 1 ครั้งระหว่างอุปกรณ์หากัน) แล้วเปิด Web Browser ใน PC0
ไปที่ `http://172.16.1.10` เพื่อดู flag รูปแบบ `ITF2026{…}`

**คำสั่ง Cisco IOS ที่ใช้**

| คำสั่ง | ใช้ทำอะไร |
|---|---|
| `enable` (`en`) | เข้าโหมดผู้ดูแล — prompt เปลี่ยนจาก `>` เป็น `#` |
| `configure terminal` (`conf t`) | เข้าโหมดตั้งค่า |
| `interface g0/0/0` (`int g0/0/0`) | เลือกพอร์ตที่จะตั้งค่า |
| `ip address <IP> <mask>` (`ip add`) | ใส่ IP และ subnet mask ให้พอร์ต |
| `no shutdown` (`no sh`) | เปิดพอร์ต |
| `ip route <วง> <mask> <next hop>` | เพิ่ม static route |
| `exit` · `end` | ถอยออกหนึ่งขั้น · กลับไป `Router#` ทันที |
| `show ip interface brief` | ดู IP และสถานะ up/down ทุกพอร์ต — เช็กว่าลืม `no shutdown` หรือไม่ |
| `show ip route` | ดู routing table — `C` ต่อตรง · `L` IP ของพอร์ตตัวเอง · `S` static route |
| `show running-config` · `write` | ดูค่าที่ตั้งไว้ทั้งหมด · บันทึกค่า (ไม่บันทึก รีสตาร์ทแล้วหาย) |

**งานที่ต้องส่ง** — โจทย์ `[CONFIG]-ROUTING-1` และ `[CONFIG]-ROUTING-2` บน SecSpace:
`ctf.it.kmitl.ac.th` → Login ด้วยบัญชี IT → Learning → *Cisco Packet Tracer | ITF 2026* → Labs → ดาวน์โหลดไฟล์ `.pka`
ทำจนได้ flag แล้ว Submit · flag ของแต่ละคนไม่เหมือนกัน ห้ามส่ง flag ของเพื่อน · โจทย์ที่ 2 มี router 2 ตัว ใช้หลักเดียวกับตัวอย่าง

---

## โน้ตสรุปจาก Notion · Tammadon Suksa (IT24)

> ขอบคุณ **Tammadon Suksa (IT24)** ที่สรุปและแชร์โน้ตชุดนี้ · คัดลอกจาก [ITF Week 12 บน Notion](https://app.notion.com/p/40a363d85cea80bcb6f0c1788845fc26) เมื่อ 1 พ.ย. 2569 พร้อมรูปประกอบ (ภาพสไลด์ของผู้สอนที่ผู้สรุปเขียนโน้ตทับ) · เนื้อหาเป็นสำนวนของผู้สรุป ถ้าต่างจากสไลด์ให้ยึดสไลด์ · จุดที่ iHelp ตรวจแล้วคลาดเคลื่อนมี ⚠️ กำกับไว้

1.Network Topology หรือ physical topology
→ ลักษณะทางกายภาพ รูปเเบบการเชื่อมต่อคอมพิวเตอร์
1. Mesh  มีความน่าเชื่อถือและ **Redundancy** สูงสุด หากสายเส้นใดขาด ข้อมูลจะสลับไปใช้เส้นทางอื่นทันที แต่ใช้สายสัญญาณจำนวนมากและมีค่าใช้จ่ายสูงที่สุด

![Week 12 รูปที่ 1 — สไลด์ประกอบโน้ต](/notes/itf/week12/01.webp)

1. Star จัดการง่ายและหาจุดเสียได้สะดวก หากสายของเครื่องใดขาด เครื่องอื่นยังใช้งานได้ปกติ แต่มีจุดอ่อนอยู่ที่ตัวศูนย์กลาง (**Single Point of Failure**)

![Week 12 รูปที่ 2 — สไลด์ประกอบโน้ต](/notes/itf/week12/02.webp)

1. Bus ทุกอุปกรณ์เชื่อมต่อเข้ากับสายนำสัญญาณแกนกลางสายเดียวกัน เรียกว่า **Backbone** หรือ **Bus** โดยมี **Terminator** ปิดอยู่ที่ปลายสายทั้งสองด้าน ประหยัดสายและติดตั้งง่าย แต่ถ้าสาย **Backbone** ขาดเพียงจุดเดียว เครือข่ายจะล่มทั้งระบบ

![Week 12 รูปที่ 3 — สไลด์ประกอบโน้ต](/notes/itf/week12/03.webp)

1. Ring เป็นวงกลมปิด ข้อมูลวิ่งทิศทางเดียวกันทีละโหนด ข้อมูลไม่ชนกัน เเต่ถ้าโหนดใดโหนดนึงขาด วงเเหวนจะล่มทั้งระบบ เหมาะกับพื้นที่ใหญ่ ประหยัดรายจ่าย

   ![Week 12 รูปที่ 4 — สไลด์ประกอบโน้ต](/notes/itf/week12/04.webp)

2. Hybrid with star backbone with three bus หรือ Star + Bus ขยายระบบง่าย เเยกจุดเสียง่าย เเต่ถ้าสาย หลักขาด การสื่อสารข้ามกลุ่มหาย ใช้สายเยอะ

![Week 12 รูปที่ 5 — สไลด์ประกอบโน้ต](/notes/itf/week12/05.webp)

1. Logical Topology (Multiple Access Protocal) → การจัดการการส่งสัญญาณภายใน network
   - MA → คือข้อกำหนดควบคุมการเชื่อมต่อ ระหว่างอุปกรณ์หลายชุด ที่ใช้ ตัวกลางร่วมกัน common link
     - จุดประสงค์ MA
       - 1.ป้องกันการเสือกของอุปกรณ์ไม่เกี่ยวข้อง
       - 2.ป้องกันการยึดตัวกลางเเต่เพียงผู้เดียว
   - 2.1 CSMA (Carrier-sense multiple access) ป้องกันการชนกันของข่าวสาร
     - มันจะเช็คก่อนว่ามีข่าวสารมั้ย ถ้ามี ก็จะไม่ส่ง เเต่ถ้าไม่มี ก็จะส่งไป
     - BUT!!! มีโอกาสที่จะชนกันอยู่ดี เพราะ → เมื่อส่งข้อมูลไปเเล้วตรวจว่าไม่มี เเต่ จริงๆ เเล้วมี เพราะข่าวสารนั้น มันกำลังส่งมา มันยังไม่ถึงสถานี ก็เลยทำให้เกิด collision ได้

     ![Week 12 รูปที่ 6 — สไลด์ประกอบโน้ต](/notes/itf/week12/06.webp)

   - 2.2 CSMA/CD (Carrier-sense multiple access with Collision detection) ใช้งานจริงในทางปติบัติ
     - Collision Detection → ดู ACK ว่าส่งข้อมูลสำเร้จหรือไม่ ถ้าไม่เเสดงว่ามันชนกัน จึงต้องส่ง Data Frame ชุดนั้นใหม่อีกรอบ เพื่อไม่ให้เกิดการชนซ้ำจึงใช้หลักการ Back off
       - ⚠️ **หมายเหตุ iHelp:** CSMA/CD บนสาย Ethernet ตรวจการชน*ระหว่างที่ยังส่งอยู่* โดยฟังสัญญาณบนสายไปพร้อมกัน — เจอชนก็หยุดส่ง ส่ง jam signal แล้วค่อย back off · การรอ ACK เพื่อดูว่าส่งสำเร็จไหมเป็นวิธีของ **CSMA/CA** ใน Wi-Fi (Week 13)
     - หลักการ Back off → สุ่มเวลาการรอตั้งหลัก ในช่วง 0 ถึง 2 กำลัง n เท่า ของ Propagation Delay ในตัวกลาง เมื่อ N คือจำนวนครั้งงที่ back off
   - 2.3 Token Passing → วิธีนี้เครือข่ายต้องมีโครงสร้างเเบบ Ring (Logical หรือ Physical)
     - หลักการคือ จะส่ง Packet พิเศษก็คือ Token วิ่งอยู่ใน Ring ถ้าสถานีไหนใน Ring จะส่งข้อมูล มันจะยึด Token มาไว้ที่สถานีนั้น เเล้วมันจะบรรจุลงใน Data Frame จนกว่า Token จะหมดเวลา ถ้าหมดเวลา ก็จะส่งกลับคืนเข้าไปใน Ring ต่อไป
     - Image concept

     ![Week 12 รูปที่ 7 — สไลด์ประกอบโน้ต](/notes/itf/week12/07.webp)

2. Network Communication Standard
   - 3.1 Ethernet
     - Physical topology → star , bus
     - logical topology → CSMA/CD

     ![Week 12 รูปที่ 8 — สไลด์ประกอบโน้ต](/notes/itf/week12/08.webp)

   - วิวัฒนาการ Ethernet
     - 3.1.1 Standard Ethernet
     - Ex. 10Base5 → 10 คือ Mbps , Base คือ Baseband ก็คือ Digital , 5 คือความยาวสาย
       - ⚠️ **หมายเหตุ iHelp:** เลขท้ายบอกความยาวสายสูงสุดเป็นหน่วยร้อยเมตร — 10Base5 ยาวได้ 500 m, 10Base2 ราว 185 m (ปัดเป็น 2)
     - ส่วน T คือ UTP มันก็คือ สาย Unshielded Twisted pair เช่น LAN
     - ส่วน F คือ Fiber เช่นสาย Fiber Optic

     ![Week 12 รูปที่ 9 — สไลด์ประกอบโน้ต](/notes/itf/week12/09.webp)

   - 3.2 Change in standard
     - 1.network ที่มีสะพานกับไม่มี

     ![Week 12 รูปที่ 10 — สไลด์ประกอบโน้ต](/notes/itf/week12/10.webp)

     - ถ้า Without Bridge ในรูปบน จะเกิด Collision ง่าย
     - ถ้า With Bridge → อธิบายการเเบ่ง Subnet mask
       - ยกตัวอย่าง 161.246.18.x /26
       - /26 ตรงนี้คือ Prefix หรือ CIDR จำนวนที่เเบ่งจำนวนบิต เเละถูกล็อกไว้เป็น Network ID ทั้หมด 26 บิตเเรกนับจากซ้าย ก็จะเป็น 11111111 11111111 11111111 11000000
       - พอเเปลงเเล้วมันจะได้เป็น 255.255.255.192
       - 192 ตรงนี้คือ Subnetmask
       - เอา 256 - Subnet Mask ได้ = 64
       - หมายความว่าใน 1 วงย่อย จะมีทั้งหมด 64 IP
       - เเละ ใน สองบิต ซ้ายด้านหน้า ที่เป็นชุดที่ 4 11000000
       - เลข 11 ด้านหน้า จะเป็นตัวในการคำนวณ วงของเครื่อง คิดจากบิตก็คือ 2กำลัง n n คือจำนวน bit อย่างตัวอย่าง คือ 2 bit ก็คือ 2 กำลัง 2
       - งั้นหมายความว่ามันมีทั้งหมด 4 วง โดย 1 วงมีทั้งหมด 64 IP ก็จะสามารถ Access ในเเต่ละ IP ในเเต่ละวงได้ ทั้งหมด 64*4 = 256 เครื่อง
       - เเต่อย่าลืม ในเเต่ละวง - ด้วยสอง เนื่องจากมี
       - Network Address IP กับ Broadcast Address IP
         - Network Address IP → หมายเลขเเรกสุด ใช้ระบุชื่อวง
         - Broadcast Address IP → หมายเลขสุดท้ายของวง (ใช้ระบุข้อมูลหาทุกเครื่องในวง)
       - เเสดงตัวอย่างนี้ก็หมายความว่ามีทั้งหมด 248 เครื่องหรือ 248 IP ที่สามารถ Access ได้
       - *** สามารถดูรูป Ref ได้ รูปก่อนหน้านะ ไม่ใช่รูปด้านล่างนี้ ***

     ![Week 12 รูปที่ 11 — สไลด์ประกอบโน้ต](/notes/itf/week12/11.webp)

     1. Switched Ethernet เเยก Collision Domain ออกจากกัน ช่วยขจัดข้อมูลชนกันข้ามเครื่อง

     ![Week 12 รูปที่ 12 — สไลด์ประกอบโน้ต](/notes/itf/week12/12.webp)

     1. Full-duplex switched Ethernet → มี Transmit เเละ Receiver 2 ทางพร้อมกัน เเละ Zero Collision
   - 3.3 Fast Ethernet → Point-to-Point , Star Topology

     ![Week 12 รูปที่ 13 — สไลด์ประกอบโน้ต](/notes/itf/week12/13.webp)

   - 3.4 Gigabit Ethernet → Point-to-Point , star , Two stars , Hierarchy of star Topologies

   ![Week 12 รูปที่ 14 — สไลด์ประกอบโน้ต](/notes/itf/week12/14.webp)

   ![Week 12 รูปที่ 15 — สไลด์ประกอบโน้ต](/notes/itf/week12/15.webp)

   ![Week 12 รูปที่ 16 — สไลด์ประกอบโน้ต](/notes/itf/week12/16.webp)

   - 3.5 Ten-Gigabit Ethernet
     - PMD (Physical Media Dependent) → ตัวรับสัญญาณของไฟเบอร์ ทำหน้าที่เเปลงข้อมูลให้สามารถส่งผ่านไปยังสายสัญญาณที่ใช้ได้

     ![Week 12 รูปที่ 17 — สไลด์ประกอบโน้ต](/notes/itf/week12/17.webp)

     ![Week 12 รูปที่ 18 — สไลด์ประกอบโน้ต](/notes/itf/week12/18.webp)

3. Connecting LAN
   - 4.1 Connecting Devices

     ![Week 12 รูปที่ 19 — สไลด์ประกอบโน้ต](/notes/itf/week12/19.webp)

   - Physical Layer → Passive Hub → ไม่มีข้อมูลวิ่งผ่านเป็นเเค่จุดต่อสายทางกายภาพ
   - Physical Layer → Repeater or hub → ทำงานกับสัญญาณไฟฟ้าหรือเเสงในระดับ bit ไว้ขยายสัญญาณ
   - Data link Layer → Bridge or two layer switch → ทำในระดับ Frame หน้าที่ตรวจสอบเเละใช้ MAC Address ส่งต่อข้อมูล เเละเเยก Collision Domain ออกจากกัน
   - Network Layer → Router or three layer switch → ทำในระดับ Packets หน้าที่ตรวจสอบ ip address ในการ routing เพื่อส่งข้อมูลข้าม Subnet เเละเเยก Broadcast domain
   - Transport And Application Layer → หน้าที่เเปลง Protocal ทำให้เครือข่ายหรือเเอพพลิเคชันที่ใช้คนละ protocal สื่อสารกันได้
   - 4.2 Repeater หลักการเหมือน Redstone Repeater ใน Minecraft มันสร้าง สัญญาณใหม่ ที่เหมือนกันเปี้ยบก่อนหน้า เเล้วส่งต่อไปเพิ่ม
   - 4.3 Bridge or Layer2 Switch → Concept คือการเชื่อม LAN โดย มี Bridge table อยู่ตรงกลาง คอยเชื่อม ระหว่าง Port สองตัว โดยเก็บเป็น Mac address

   ![Week 12 รูปที่ 20 — สไลด์ประกอบโน้ต](/notes/itf/week12/20.webp)

   - 4.4 Router or Layer3 Switch → concept LAN เครือข่ายภายใน ต่อกับ Router เเล้วไอ Router ที่ต่อเนี่ย มันก็ไปเชื่อมกับ router อีกตัวนึง เป็น WAN จากนั้นก็จะสามารถข้อมุลที่ส่งออกไปเป็น internet

   ![Week 12 รูปที่ 21 — สไลด์ประกอบโน้ต](/notes/itf/week12/21.webp)

   - 4.5. Backbone Network
     - Concept คือ สามารถเชื่อมต่อ LAN หลายๆวงเข้าด้วยกันได้ เเละ Station ไม่ต้องต่อตรงเข้ากับ Backbone เลย เพราะ Station มันคือส่วนนึงของ LAN อยู่เเล้ว เเละ Backbone มันเชื่อมกับ LAN อีกที ในที่นี้ backbone → มันคือเเกนกลางเชื่อมต่อ ของ LAN หลายๆวงเข้าด้วยกัน เปรียบเสมือน กระดูกสันหลัง หรือเเกนหลัก ตามรูปงับ

     ![Week 12 รูปที่ 22 — สไลด์ประกอบโน้ต](/notes/itf/week12/22.webp)

     ![Week 12 รูปที่ 23 — สไลด์ประกอบโน้ต](/notes/itf/week12/23.webp)

4. Logical Addressing
   - 5.1 IP Version4 Address → มี 32 bits เเบ่งเป็น 4 ชุด

   ![Week 12 รูปที่ 24 — สไลด์ประกอบโน้ต](/notes/itf/week12/24.webp)

   - IPv4 Address Component

   ![Week 12 รูปที่ 25 — สไลด์ประกอบโน้ต](/notes/itf/week12/25.webp)

   - IP Address คือรวมกัน
   - Network ID คือวงเครือข่าย
   - Host ID คือ IP ตัวเครื่อง
   - Subnet Mask คือป้ายขีดเเบ่ง ระหว่าง Network ID เเละ Host ID
   - ตามตัวอย่างเเรก 10.16.127.104 → ชุดเเรก หรือ 8 bit เเรก คือ Network ID เเละ 8 bit 3 ชุดหลังมันคือ Host ID หมายความว่า เครื่องนี้มีเครื่องย่อยที่สามารถใช้ได้ทั้งหมด 2กำลัง 24 ก็คือ 16 ล้านกว่าๆ
   - สรุป → IP Address (32 bits) = Network ID + Host ID
   - 5.2 การตั้งค่า ipv4

   ![Week 12 รูปที่ 26 — สไลด์ประกอบโน้ต](/notes/itf/week12/26.webp)

   - 5.3 IP Address & Subnet Mask

   ![Week 12 รูปที่ 27 — สไลด์ประกอบโน้ต](/notes/itf/week12/27.webp)

   - เวลาหาค่าNetwork ID
   - ใน คอมพิวเตอร์ เวลา ดู IP มันก็จะมีพวก DNS , gateway ทางออก Internet , หรือออกไป network อื่น
   - Dns server → ทำหน้าที่เเปลง domain name ที่เราสนใจ
   - ถ้า DNS sever พังหรือไม่มี เราจะเข้าเเค่ www ชื่อ domain ไม่ได้
   - ของ Google 8.8.8.8 DNS

   ![Week 12 รูปที่ 28 — สไลด์ประกอบโน้ต](/notes/itf/week12/28.webp)

   - วิธีการหา Network ID โดยการใช้ IP Address เเละเเบ่ง วง /16 ตามตัวยอย่าง
     - 5.4 Network ID → ถ้าอยู่ใน Network ID เดียวกันจะสามารถสื่อสารกันได้ เช่นตามรูป

     ![Week 12 รูปที่ 29 — สไลด์ประกอบโน้ต](/notes/itf/week12/29.webp)

   - 5.5 การสื่อสารในเครือข่ายคอมพิวเตอร์

     ![Week 12 รูปที่ 30 — สไลด์ประกอบโน้ต](/notes/itf/week12/30.webp)

     ![Week 12 รูปที่ 31 — สไลด์ประกอบโน้ต](/notes/itf/week12/31.webp)

     - ISP ก็จะให้เลข Address จริงๆมา 1 addressตามรูปด้านล่าง

     ![Week 12 รูปที่ 32 — สไลด์ประกอบโน้ต](/notes/itf/week12/32.webp)

   1. Types of Communication in an IPv4 Network
      - Unicast → ส่งรายคน
      - Broadcast → ส่งไปทุกคน → Destination 255.255.255.255 หรือ All 1
      - Multicast → ส่งเป็น Group → เราต้องไป Group IP Class(D) ในวงนั้นก่อน ก่อนที่เราจะส่งไป จากนั้น เครื่องปลายทางที่สนใจเเละต้องการข้อมูลนั้นก็กดเข้าไปที่ IP ที่จอง
   2. Class of IPv4

      ![Week 12 รูปที่ 33 — สไลด์ประกอบโน้ต](/notes/itf/week12/33.webp)

      ![Week 12 รูปที่ 34 — สไลด์ประกอบโน้ต](/notes/itf/week12/34.webp)

      - รูปภาพด้านบน
      - Blocksize มันคือ Host ID ทั้งหมดที่มีได้
      - Number of blocks มันก็คือ Network ID จำนวนของมัน

      ![Week 12 รูปที่ 35 — สไลด์ประกอบโน้ต](/notes/itf/week12/35.webp)

      - Classful IP Address - Class C
        - ตัวเเรกสุดกับท้ายสุดที่สงวนไว้มีดังนี้
          - Network Address : เช่น 210.20.77.0 → ตัวเเรกสุดไว้ระบุตัวเองของวงนั้นทั้งวง LAN
          - Broadcast Address : เช่น 210.20.77.255 → ตัวท้ายสุดไว้กระจายพวก packet ให้ทุกเครื่องในวงนั้น
          - เช่นเดียวกันกับทั้ง Class B เเละ Class A ขึ้นอยู่กับ Subnet mask หรือจำนวน bit ของ Host ID

      ![Week 12 รูปที่ 36 — สไลด์ประกอบโน้ต](/notes/itf/week12/36.webp)

      - Number of useable host addresses จำนวน Host ID ที่ว่างให้เข้าไปใช้งานในวงนั้นๆ
      - Address Depletion → Concept ปี 1991 IP เริ่มหมด เครือข่าย Internet มันมีขนาดใหญ่ขึ้น ทำให้ IP 32 Bit เลยอาจจะไม่พอ เลยต้องใช้วิธีหลายๆอย่างดังนี้

        ![Week 12 รูปที่ 37 — สไลด์ประกอบโน้ต](/notes/itf/week12/37.webp)

      - จำว่ามีวิธี NAT ตามรูป → Concept เเปลง Private IP ให้เป็น Public เเละเเปลงข้อมูลกลับตอนข้อมูลตอบกลับ เเปลงเพื่อให้อุปกรณ์หลายตัวใน LAN ใช้ Public IP เดียวกันออก net ได้

      ![Week 12 รูปที่ 38 — สไลด์ประกอบโน้ต](/notes/itf/week12/38.webp)

      - Private Address  → IP Address ที่ไม่เชื่อม Internet

      ![Week 12 รูปที่ 39 — สไลด์ประกอบโน้ต](/notes/itf/week12/39.webp)

สรุป Internet มันก็คือการเชื่อมต่อ ระหว่างเครือข่ายอย่างในรูป เชื่อมต่อ เเบบ LAN โดยมี router ในการสื่อสาร

![Week 12 รูปที่ 40 — สไลด์ประกอบโน้ต](/notes/itf/week12/40.webp)
