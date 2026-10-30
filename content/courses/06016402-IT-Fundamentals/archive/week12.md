# สัปดาห์ที่ 12 · Computer Networks 2

> รศ.ดร. ปานวิทย์ ธุวะนุติ · สไลด์ Introduction to Computer Network (92 หน้า) · แล็บ Network 2 — Cisco Packet Tracer (2) เรียนออนไลน์
>
> สรุปบรรยายจากสไลด์ที่มีในคลัง — ฉบับ 22 ก.ย. 2569 อยู่ใน OnLearn ถ้าเนื้อหาต่างกันให้ยึดฉบับใน OnLearn ·
> หัวข้อแล็บสรุปจากใบงานจริงของ 1/2569

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

- **Logical topology** = กติกาแชร์ตัวกลางร่วม (multiple access protocol)
  - **CSMA** — ฟังก่อนพูด (listen before talk) · ลดการชนแต่เลี่ยงไม่ได้ทั้งหมดเพราะ propagation delay
  - **CSMA/CD** — เพิ่มการตรวจจับการชน ชนแล้วส่งใหม่ และรอด้วย **back-off**
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
| **Backbone** | เชื่อมหลาย LAN — bus backbone หรือ star backbone (switch ตัวเดียว) |

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

| Private IP | ช่วง |
|---|---|
| Class A | 10.0.0.0 – 10.255.255.255 |
| Class B | 172.16.0.0 – 172.31.255.255 |
| Class C | 192.168.0.0 – 192.168.255.255 |

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

---

## ทดสอบตัวเอง

1. IP 192.168.10.77 subnet mask 255.255.255.0 มี network ID อะไร
2. IP 150.20.3.4 อยู่ class ใด และ default mask คืออะไร
3. บริษัทมี PC 100 เครื่อง server 1 router 1 ใช้ class C จะเหลือ address ว่างกี่ตัว
4. อุปกรณ์ใดเรียนรู้ MAC address เพื่อกรอง frame
5. Topology แบบใดใช้ token passing บนวงแหวนคู่
6. วง 10.0.0.4/30 มี IP ที่ใช้ได้กี่ตัว อะไรบ้าง
7. Router0 ต่อกับ Router1 ด้วยวง 10.0.0.0/30 (Router0 = .1 · Router1 = .2) ถ้า Router0 จะส่งไปวง 172.16.1.0/24 ที่อยู่หลัง Router1 ต้องพิมพ์คำสั่งใด

**เฉลย** — 1. 192.168.10.0 · 2. class B · 255.255.0.0 · 3. 254 − 102 = 152 · 4. bridge / layer-2 switch · 5. FDDI ·
6. 2 ตัว คือ 10.0.0.5 และ 10.0.0.6 · 7. `ip route 172.16.1.0 255.255.255.0 10.0.0.2`

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
