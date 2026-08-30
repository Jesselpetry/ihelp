# Week 10 — ชุดฝึก: Chain Rule, Implicit Differentiation, Related Rates
### 9 ข้อ · พร้อมเฉลยละเอียดทีละขั้น

> **จับเวลา 50 นาที** · ข้อ Implicit ทุกข้อต้องเขียน $\frac{dy}{dx}$ ให้เห็นทุกบรรทัด
>
> 🔴 = ข้อจาก `hw10.pdf` · 🔵 = ข้อต่อยอด

---

## 📝 ชุดโจทย์

**W10-Q1** 🔵 $y=\big(3x^{2}+5\big)^{7}$ จงหา $\dfrac{dy}{dx}$

**W10-Q2** 🔵 $y=\sin^{3}(2x)$ จงหา $\dfrac{dy}{dx}$

**W10-Q3** 🔵 $y=\ln\big(x^{2}+3\big)$ จงหา $\dfrac{dy}{dx}$

**W10-Q4** 🔴 $y^{2}=(x-y)\big(x^{2}+y\big)$ จงหา $\dfrac{dy}{dx}$ **โดยใช้ implicit differentiation**

**W10-Q5** 🔴 $y\sqrt{x}-x\sqrt{y}=25$ จงหา $\dfrac{dy}{dx}$ **โดยใช้ implicit differentiation**

**W10-Q6** 🔴 $\cos(x+y)=x$ จงหา $\dfrac{dy}{dx}$ **โดยใช้ implicit differentiation**

**W10-Q7** 🔵 $x^{2}+y^{2}=25$ จงหา $\dfrac{dy}{dx}$ และหาความชันของเส้นสัมผัสที่จุด $(3,4)$

**W10-Q8** 🔵 ลูกโป่งทรงกลมถูกเป่าด้วยอัตรา $100\ \text{cm}^{3}/\text{s}$ จงหาอัตราการเพิ่มของรัศมี ณ ขณะที่รัศมี $=5$ cm

**W10-Q9** 🔵 $y=x^{5}$ จงหา $y'''$

---
---

# ✅ เฉลยละเอียด

## W10-Q1 — General Power Rule

**ขั้นที่ 1 — แยกข้างนอก/ข้างใน**
- ข้างนอก: ยกกำลัง 7
- ข้างใน: $u=3x^{2}+5$ ⇒ $u'=6x$

**ขั้นที่ 2 — ดิฟข้างนอก (เก็บข้างในไว้เหมือนเดิม)**
$$\frac{dy}{dx}=7\big(3x^{2}+5\big)^{6}\cdot u'$$

**ขั้นที่ 3 — คูณด้วย $u'$**
$$=7\big(3x^{2}+5\big)^{6}\cdot 6x$$
$$=\boxed{42x\big(3x^{2}+5\big)^{6}}$$

> 🚨 **ถ้าลืมคูณ $6x$ = ผิดทั้งข้อ** — นี่คือความผิดพลาดอันดับ 1 ของทั้งวิชา

---

## W10-Q2 — Chain Rule 3 ชั้น

$$y=\sin^{3}(2x)=\big[\sin(2x)\big]^{3}$$

**แยกเป็นชั้น ๆ**
```
ชั้นนอกสุด : ยกกำลัง 3      →  3[sin(2x)]²
ชั้นกลาง   : sin(...)        →  × cos(2x)
ชั้นในสุด  : 2x              →  × 2
```

**คูณทุกชั้น**
$$\frac{dy}{dx}=3\big[\sin(2x)\big]^{2}\cdot\cos(2x)\cdot 2$$
$$=\boxed{6\sin^{2}(2x)\cos(2x)}$$

---

## W10-Q3 — Chain Rule กับ $\ln$

**สูตร:** $\dfrac{d}{dx}\big[\ln u\big]=\dfrac{u'}{u}$

$$u=x^{2}+3 \quad\Rightarrow\quad u'=2x$$

$$\frac{dy}{dx}=\boxed{\frac{2x}{x^{2}+3}}$$

---

## W10-Q4 — Implicit Differentiation

**ขั้นที่ 0 — กระจายฝั่งขวาก่อน** (ลดโอกาสพลาด)
$$y^{2}=(x-y)\big(x^{2}+y\big)=x^{3}+xy-x^{2}y-y^{2}$$

**ขั้นที่ 1 — ดิฟทั้งสองข้างเทียบ $x$**

ดิฟทีละพจน์:
| พจน์ | อนุพันธ์ | หมายเหตุ |
|:---|:---|:---|
| $y^{2}$ | $2y\dfrac{dy}{dx}$ | Chain Rule |
| $x^{3}$ | $3x^{2}$ | ปกติ |
| $xy$ | $y+x\dfrac{dy}{dx}$ | **Product Rule** |
| $x^{2}y$ | $2xy+x^{2}\dfrac{dy}{dx}$ | **Product Rule** |
| $y^{2}$ | $2y\dfrac{dy}{dx}$ | Chain Rule |

$$2y\frac{dy}{dx}=3x^{2}+\left(y+x\frac{dy}{dx}\right)-\left(2xy+x^{2}\frac{dy}{dx}\right)-2y\frac{dy}{dx}$$

**ขั้นที่ 2 — ย้ายพจน์ที่มี $\frac{dy}{dx}$ ไปฝั่งซ้าย**
$$2y\frac{dy}{dx}-x\frac{dy}{dx}+x^{2}\frac{dy}{dx}+2y\frac{dy}{dx}=3x^{2}+y-2xy$$

**ขั้นที่ 3 — ดึง $\frac{dy}{dx}$ เป็นตัวประกอบร่วม**
$$\frac{dy}{dx}\Big(2y-x+x^{2}+2y\Big)=3x^{2}+y-2xy$$
$$\frac{dy}{dx}\Big(x^{2}-x+4y\Big)=3x^{2}+y-2xy$$

**ขั้นที่ 4 — หาร**
$$\boxed{\frac{dy}{dx}=\frac{3x^{2}+y-2xy}{x^{2}-x+4y}}$$

---

## W10-Q5 — Implicit + Product Rule + ราก

**เขียนใหม่ให้เป็นเลขชี้กำลัง**
$$y\,x^{1/2}-x\,y^{1/2}=25$$

**ขั้นที่ 1 — ดิฟทั้งสองข้าง (Product Rule ทั้ง 2 พจน์)**

พจน์ที่ 1: $\dfrac{d}{dx}\big[y\cdot x^{1/2}\big]=\dfrac{dy}{dx}x^{1/2}+y\cdot\tfrac12 x^{-1/2}$

พจน์ที่ 2: $\dfrac{d}{dx}\big[x\cdot y^{1/2}\big]=1\cdot y^{1/2}+x\cdot\tfrac12 y^{-1/2}\dfrac{dy}{dx}$

$$\sqrt{x}\,\frac{dy}{dx}+\frac{y}{2\sqrt{x}}-\sqrt{y}-\frac{x}{2\sqrt{y}}\frac{dy}{dx}=0$$

**ขั้นที่ 2 — จัดกลุ่ม**
$$\sqrt{x}\,\frac{dy}{dx}-\frac{x}{2\sqrt{y}}\frac{dy}{dx}=\sqrt{y}-\frac{y}{2\sqrt{x}}$$

**ขั้นที่ 3 — ดึงตัวร่วม**
$$\frac{dy}{dx}\left(\sqrt{x}-\frac{x}{2\sqrt{y}}\right)=\sqrt{y}-\frac{y}{2\sqrt{x}}$$

**ขั้นที่ 4 — หาร แล้วคูณ $\dfrac{2\sqrt{xy}}{2\sqrt{xy}}$ เพื่อล้างเศษส่วนซ้อน**
$$\frac{dy}{dx}=\frac{\sqrt{y}-\dfrac{y}{2\sqrt{x}}}{\sqrt{x}-\dfrac{x}{2\sqrt{y}}}\cdot\frac{2\sqrt{xy}}{2\sqrt{xy}}$$

คิดทีละก้อน — **ตัวเศษ**:
- $2\sqrt{xy}\cdot\sqrt{y}=2\sqrt{x}\cdot\sqrt{y}\cdot\sqrt{y}=2y\sqrt{x}$
- $2\sqrt{xy}\cdot\dfrac{y}{2\sqrt{x}}=\dfrac{\sqrt{x}\sqrt{y}\cdot y}{\sqrt{x}}=y\sqrt{y}$

**ตัวส่วน**:
- $2\sqrt{xy}\cdot\sqrt{x}=2x\sqrt{y}$
- $2\sqrt{xy}\cdot\dfrac{x}{2\sqrt{y}}=x\sqrt{x}$

$$\frac{dy}{dx}=\frac{2y\sqrt{x}-y\sqrt{y}}{2x\sqrt{y}-x\sqrt{x}}$$

**จัดรูปแยกตัวประกอบ**
$$=\boxed{\frac{y\big(2\sqrt{x}-\sqrt{y}\big)}{x\big(2\sqrt{y}-\sqrt{x}\big)}}$$

> 💡 **รูปที่ยอมรับได้:** คำตอบเขียนได้หลายหน้าตา ขอแค่ **สมมูลกันทางพีชคณิต**
> รูปที่ปลอดภัยที่สุดคือหยุดที่ขั้นที่ 3 แล้วหารตรง ๆ:
> $$\frac{dy}{dx}=\frac{\sqrt{y}-\dfrac{y}{2\sqrt{x}}}{\sqrt{x}-\dfrac{x}{2\sqrt{y}}}$$

---

## W10-Q6 — Implicit + Chain กับตรีโกณ

**ขั้นที่ 1 — ดิฟทั้งสองข้าง**
ข้างใน $=x+y$ ⇒ อนุพันธ์ข้างใน $=1+\dfrac{dy}{dx}$
$$-\sin(x+y)\left(1+\frac{dy}{dx}\right)=1$$

**ขั้นที่ 2 — กระจาย**
$$-\sin(x+y)-\sin(x+y)\frac{dy}{dx}=1$$

**ขั้นที่ 3 — ย้ายข้าง**
$$-\sin(x+y)\frac{dy}{dx}=1+\sin(x+y)$$

**ขั้นที่ 4 — หาร**
$$\frac{dy}{dx}=\frac{1+\sin(x+y)}{-\sin(x+y)}=-\frac{1+\sin(x+y)}{\sin(x+y)}$$

**จัดรูป (แยกเศษ)**
$$=-\frac{1}{\sin(x+y)}-\frac{\sin(x+y)}{\sin(x+y)}$$
$$=\boxed{-\csc(x+y)-1}$$

---

## W10-Q7 — Implicit วงกลม + หาความชันที่จุด

**ขั้นที่ 1**
$$\frac{d}{dx}\big[x^{2}\big]+\frac{d}{dx}\big[y^{2}\big]=\frac{d}{dx}[25]$$
$$2x+2y\frac{dy}{dx}=0$$

**ขั้นที่ 2–4**
$$2y\frac{dy}{dx}=-2x \;\Rightarrow\; \boxed{\frac{dy}{dx}=-\frac{x}{y}}$$

**หาความชันที่ $(3,4)$**
$$\left.\frac{dy}{dx}\right|_{(3,4)}=-\frac{3}{4}$$

> 💡 **ตรวจด้วยเรขาคณิต:** รัศมีจาก $(0,0)$ ถึง $(3,4)$ มีความชัน $\frac43$
> เส้นสัมผัสต้องตั้งฉากกับรัศมี ⇒ ความชัน $=-\frac{3}{4}$ ✅

---

## W10-Q8 — Related Rates

**ขั้นที่ 1 — ตัวแปร**
$V$ = ปริมาตรลูกโป่ง, $r$ = รัศมี ทั้งคู่เป็นฟังก์ชันของเวลา $t$

**ขั้นที่ 2 — สิ่งที่รู้/ต้องการ**
$$\text{รู้: } \frac{dV}{dt}=100\ \text{cm}^{3}/\text{s} \qquad \text{ต้องการ: } \frac{dr}{dt}\text{ เมื่อ } r=5$$

**ขั้นที่ 3 — สมการเชื่อม**
$$V=\frac{4}{3}\pi r^{3}$$

**ขั้นที่ 4 — ดิฟเทียบ $t$** ⚠️ ยังไม่แทนตัวเลข!
$$\frac{dV}{dt}=\frac{4}{3}\pi\cdot 3r^{2}\frac{dr}{dt}=4\pi r^{2}\frac{dr}{dt}$$

**ขั้นที่ 5 — แทนค่า**
$$100=4\pi(5)^{2}\frac{dr}{dt}=100\pi\frac{dr}{dt}$$

**ขั้นที่ 6 — ตอบพร้อมหน่วย**
$$\boxed{\frac{dr}{dt}=\frac{1}{\pi}\approx 0.318\ \text{cm/s}}$$

> 🚨 **ถ้าแทน $r=5$ ตั้งแต่ขั้นที่ 3** จะได้ $V=\frac{500\pi}{3}$ ซึ่งเป็นค่าคงตัว
> ⇒ $\frac{dV}{dt}=0$ ⇒ ผิดทั้งข้อ **ดิฟก่อน แทนทีหลัง เสมอ**

---

## W10-Q9 — อนุพันธ์อันดับสูง

$$y=x^{5}$$
$$y'=5x^{4}$$
$$y''=5\cdot 4x^{3}=20x^{3}$$
$$y'''=20\cdot 3x^{2}=\boxed{60x^{2}}$$

---

## 📊 เกณฑ์ตรวจตนเอง

| ข้อ | ได้ 1 คะแนน ก็ต่อเมื่อ… |
|:---|:---|
| Q1–Q3 | **คูณ $u'$ ครบ** — ลืมหาง = 0 |
| Q4–Q6 | มี $\dfrac{dy}{dx}$ ปรากฏทุกครั้งที่ดิฟ $y$ + ทำครบ 4 ขั้นตอน |
| Q4 | ใช้ Product Rule กับ $xy$ และ $x^{2}y$ ถูก |
| Q5 | ใช้ Product Rule ทั้งสองพจน์ + จัดรูปจนอ่านได้ |
| Q7 | ได้ $-\frac xy$ และแทนจุดถูก |
| Q8 | **ดิฟก่อนแทนค่า** + มีหน่วย cm/s |
| Q9 | ดิฟครบ 3 รอบ ไม่ข้ามขั้น |

**เป้าหมาย: 9/9** — Chain Rule จะกลับมาอีกใน Week 13 (u-Substitution)
