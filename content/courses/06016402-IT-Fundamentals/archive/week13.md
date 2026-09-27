# สัปดาห์ที่ 13 · Wireless / Wi-Fi

> ยังไม่เปิดใน OnLearn · สรุปล่วงหน้าจากสไลด์ปีก่อนของ รศ.ดร. ปานวิทย์ ธุวะนุติ (41 หน้า)
>
> หน้านี้จะอัปเดตเมื่อสไลด์ 1/2569 ออก — ใช้อ่านนำก่อนเข้าเรียน ไม่ใช่ขอบเขตสอบที่ยืนยันแล้ว

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
| สไลด์ปีก่อน — Introduction to Wireless Network | 41 | `itf-lec-week13-wi-fi.pdf` |

---

## สรุปอ่านล่วงหน้า

### 1. องค์ประกอบของเครือข่ายไร้สาย

- **Wireless host** — laptop, smartphone, IoT · ไร้สายไม่ได้แปลว่าเคลื่อนที่เสมอ
- **Base station** — ต่อกับเครือข่ายมีสาย ส่งต่อ packet ให้ host ในพื้นที่ เช่น เสาสัญญาณมือถือ และ **access point** ของ 802.11
- **Wireless link** — ต่อ host เข้ากับ base station · คุณสมบัติหลักคือ coverage area และ link rate

| โหมด | ลักษณะ |
|---|---|
| **Infrastructure** | host ต่อผ่าน base station เข้าเครือข่ายมีสาย · ย้าย base station เรียกว่า **handoff** |
| **Ad hoc** | ไม่มี base station · node จัดเครือข่ายกันเอง เช่น MANET · VANET · Bluetooth |

### 2. ลักษณะของลิงก์ไร้สาย

- **Path loss / fading** — สัญญาณอ่อนลงตามระยะและความถี่ (ยิ่งความถี่สูงหรือไกล ยิ่ง loss มาก)
- **Interference** — ความถี่มาตรฐาน เช่น 2.4 GHz ใช้ร่วมกับอุปกรณ์อื่น
- **Multipath** — สัญญาณสะท้อนวัตถุ มาถึงปลายทางไม่พร้อมกัน
- **SNR** สูงแยกสัญญาณจากสัญญาณรบกวนได้ง่าย · เพิ่มกำลังส่ง → SNR สูงขึ้น → BER ลดลง แต่เปลืองแบตเตอรี่
- **Hidden terminal** — A กับ C ต่างได้ยิน B แต่ไม่ได้ยินกันเอง จึงส่งชนกันที่ B โดยไม่รู้ตัว

### 3. CDMA

- อยู่ในกลุ่ม channel partitioning · ทุกคนใช้ความถี่เดียวกัน แต่แต่ละคนมี **chipping sequence (code)** ของตัวเอง
- encode = ข้อมูล × code · decode = inner product ของสัญญาณกับ code · ถ้า code ตั้งฉากกัน (orthogonal) หลายคนส่งพร้อมกันได้

### 4. IEEE 802.11 Wireless LAN

| มาตรฐาน | ปี | อัตราสูงสุด | ความถี่ |
|---|---|---|---|
| 802.11b | 1999 | 11 Mbps | 2.4 GHz |
| 802.11g | 2003 | 54 Mbps | 2.4 GHz |
| 802.11n (Wi-Fi 4) | 2009 | 600 Mbps | 2.4 / 5 GHz |
| 802.11ac (Wi-Fi 5) | 2013 | 3.47 Gbps | 5 GHz |
| 802.11ax (Wi-Fi 6) | 2020 | 14 Gbps | 2.4 / 5 GHz |

- ทุกรุ่นใช้ **CSMA/CA** · หน่วยพื้นฐานคือ **BSS** (host + AP)
- **Association** — host scan หา AP แบบ passive (ฟัง beacon) หรือ active (ส่ง probe) แล้วส่ง association request / response

### 5. CSMA/CA และ RTS/CTS

- ผู้ส่งฟังช่องว่างนาน **DIFS** แล้วจึงส่ง · ผู้รับตอบ **ACK** หลัง **SIFS** เพราะผู้ส่งตรวจจับการชนเองไม่ได้
- **RTS/CTS** — ผู้ส่งจองช่องด้วย request-to-send สั้น ๆ · AP ตอบ clear-to-send ให้ทุกเครื่องได้ยิน → แก้ hidden terminal
- 802.15 (PAN) เช่น Bluetooth ใช้ระยะใกล้ อัตราต่ำ

---

## จุดที่มักพลาด

- Wireless ใช้ **CSMA/CA** (หลีกเลี่ยงการชน) · Ethernet ใช้ **CSMA/CD** (ตรวจจับการชน)
- Hidden terminal แก้ด้วย **RTS/CTS** ไม่ใช่เพิ่มกำลังส่ง
- Infrastructure mode ต้องมี base station · ad hoc ไม่มี

---

## ทดสอบตัวเอง

1. ทำไม 802.11 ต้องใช้ ACK
2. ปัญหาที่ A และ C ไม่ได้ยินกันแต่ส่งชนกันที่ B เรียกว่าอะไร
3. 802.11ac ใช้ความถี่ใด
4. การที่มือถือย้ายไปเชื่อมกับเสาสัญญาณต้นใหม่เรียกว่าอะไร

**เฉลย** — 1. ผู้ส่งตรวจจับการชนขณะส่งไม่ได้ · 2. hidden terminal problem · 3. 5 GHz · 4. handoff
