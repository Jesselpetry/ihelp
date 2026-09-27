# สัปดาห์ที่ 12 · Computer Networks 2

> รศ.ดร. ปานวิทย์ ธุวะนุติ · สไลด์ Introduction to Computer Network (92 หน้า) · ยังไม่มีใบงานแล็บของสัปดาห์นี้ใน OnLearn
>
> สรุปจากสไลด์ที่มีในคลัง — ฉบับ 22 ก.ย. 2569 อยู่ใน OnLearn แล้ว ถ้าเนื้อหาต่างกันให้ยึดฉบับใน OnLearn

## อ่านจบแล้วต้องตอบได้

- แยก physical topology 5 แบบ และ multiple access protocol (CSMA · CSMA/CD · token passing)
- บอกมาตรฐาน Ethernet แต่ละรุ่นและความต่างของ Gigabit กับ 10-Gigabit
- แยก **repeater/hub · bridge/switch · router** ตามหน้าที่
- **หา network ID** จาก IP address และ subnet mask ด้วยการ AND
- บอก class A/B/C, private IP และวิธีแก้ปัญหา IPv4 ไม่พอ

---

## เอกสารประจำสัปดาห์

| เอกสาร | หน้า | ไฟล์ในคลัง |
|---|:---:|---|
| สไลด์บรรยาย — Introduction to Computer Network | 92 | `itf-lec-week12-computer-networks.pdf` |
| สรุปลายมือ — Network 2 | 2 | `itf-lec-network-2.pdf` |
| ใบงานแล็บ Cisco Packet Tracer #2 (ฉบับ 1/2566) | 4 | `itf-lab-week12.pdf` |

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

---

## ทดสอบตัวเอง

1. IP 192.168.10.77 subnet mask 255.255.255.0 มี network ID อะไร
2. IP 150.20.3.4 อยู่ class ใด และ default mask คืออะไร
3. บริษัทมี PC 100 เครื่อง server 1 router 1 ใช้ class C จะเหลือ address ว่างกี่ตัว
4. อุปกรณ์ใดเรียนรู้ MAC address เพื่อกรอง frame
5. Topology แบบใดใช้ token passing บนวงแหวนคู่

**เฉลย** — 1. 192.168.10.0 · 2. class B · 255.255.0.0 · 3. 254 − 102 = 152 · 4. bridge / layer-2 switch · 5. FDDI

---

## แล็บ

ยังไม่มีใบงานแล็บของสัปดาห์นี้ใน OnLearn · ใบงาน Cisco Packet Tracer ในตารางเอกสารเป็นของปี 1/2566 ใช้ฝึกเพิ่มเติมได้
