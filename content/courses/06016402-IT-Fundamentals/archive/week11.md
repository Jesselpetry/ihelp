# สัปดาห์ที่ 11 · Internet & Computer Networks 1

> รศ.ดร. ปานวิทย์ ธุวะนุติ · สไลด์ Internet (69 หน้า) อิง Kurose & Ross *Computer Networking* 8th ed. บทที่ 1 · แล็บ Network 1
>
> คำศัพท์ภาษาอังกฤษล้วน — ข้อสอบมักถามว่า "ข้อใดไม่ใช่" end system หรือ communication link

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
| บทนำเครือข่าย — สไลด์ Kurose ฉบับแปลไทย | 81 | `itf-lec-internet-thai.pdf` |
| สรุปลายมือ — Network 1 | 6 | `itf-lec-network-1.pdf` |

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

- Host ส่ง packet ยาว L บิตเข้าลิงก์อัตรา R → **transmission delay = L / R** วินาที

| Physical media | ตัวอย่าง |
|---|---|
| **Guided** (ในตัวกลางแข็ง) | twisted pair (Cat 5 = 100 Mbps–1 Gbps · Cat 6 = 10 Gbps) · coaxial · **fiber optic** (เร็ว error ต่ำ ไม่โดนสัญญาณรบกวนแม่เหล็กไฟฟ้า) |
| **Unguided** (ไปในอากาศ) | radio — terrestrial microwave · Wi-Fi · 4G/5G · Bluetooth · satellite (ดีเลย์ราว 270 ms) |

### 4. Network Core และโครงสร้าง Internet

- **Packet switching** — แบ่ง message เป็น packet แล้วส่งต่อทีละ router ตามเส้นทาง
- **Forwarding** = งานของ router ตัวเดียว ย้าย packet จากขาเข้าไปขาออกตาม forwarding table (local action)
- **Routing** = หาเส้นทางทั้งหมดจากต้นทางถึงปลายทางด้วย routing algorithm (global action)
- **Network of networks** — ต่อ access ISP ทุกคู่ตรง ๆ ไม่ไหว (O(N²)) จึงมี global transit ISP → **IXP** และ peering link → regional ISP → content provider network
- ศูนย์กลาง: **tier-1 ISP** ไม่กี่ราย (Level 3, Sprint, AT&T, NTT) และ content provider (Google, Facebook) ที่มีเครือข่ายส่วนตัวเลี่ยง tier-1

### 5. Network Security

| การโจมตี | ความหมาย |
|---|---|
| **Packet sniffing** | อ่านทุก packet ที่ผ่านสื่อแบบ broadcast เช่น Wi-Fi · เครื่องมือ Wireshark |
| **IP spoofing** | ปลอม source address ของ packet |
| **DoS** | ถล่มทรัพยากรด้วย traffic ปลอมจนผู้ใช้จริงใช้ไม่ได้ — มักใช้ botnet |

แนวป้องกัน: authentication · encryption (confidentiality) · digital signature (integrity) · VPN · **firewall**

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

**เฉลย** — 1. link-layer switch · 2. datagram · 3. L/R = 1,000 / 1,000,000 = 1 ms · 4. IP spoofing ·
5. radio (Wi-Fi, 4G/5G, satellite)

---

## แล็บ — Network 1

> ใบงาน Lab 11 ยังไม่อยู่ในคลัง — เปิดจาก [OnLearn](https://onlearn.it.kmitl.ac.th/course/view.php?id=1766) · งานสัปดาห์นี้ส่งไฟล์แยกตามรอบแล็บ
