# Week 12 — ปริพันธ์ ภาค 1
### (Integration I — สไลด์ `Calculus-05`)

> **OBJECTIVES จากสไลด์:**
> ① evaluate indefinite integrals using basic integration rules
> ② evaluate a sum and approximate the area of a plane region
> ③ evaluate a definite integral using a limit
> ④ evaluate a definite integral using the **Fundamental Theorem of Calculus**
>
> **HW12 ออกหัวข้อ Antiderivative ล้วน ๆ**

---

## 1. Antiderivative — "ดิฟกลับหลัง"

### 1.1 ความคิดหลัก

```
        ── ดิฟ (differentiate) ──►
   F(x)                            f(x)
        ◄── ปริพันธ์ (integrate) ──
```

$F$ เป็น **antiderivative** ของ $f$ ก็ต่อเมื่อ $F'(x)=f(x)$

**ตัวอย่าง:** อะไรดิฟแล้วได้ $3x^{2}$?
คำตอบ: $x^3$ ✅ … แต่ $x^3+5$ ก็ใช่ … $x^3-\pi$ ก็ใช่ … **มีเป็นอนันต์!**

### 1.2 ทำไมต้องมี $+C$

ทุกฟังก์ชันที่ต่างกันแค่ **ค่าคงตัว** จะมีอนุพันธ์เท่ากัน (เพราะ $\frac{d}{dx}[c]=0$)
⇒ **General solution** ต้องเขียนเป็น
$$\int 3x^{2}\,dx=x^{3}+C$$

**ภาพ:** กราฟ $y=x^3+C$ คือเส้นโค้งรูปร่างเดียวกัน **เลื่อนขึ้น-ลง** เป็นตระกูลเส้นโค้ง

> ### ⚠️⚠️ ลืม `+C` = ผิดทั้งข้อ = 0 คะแนน ⚠️⚠️
> ในระบบ all-or-nothing นี่คือสาเหตุการเสียคะแนนอันดับ 1 ของบทปริพันธ์
> **สร้างนิสัย: เขียน `+ C` ทันทีที่เขียนเครื่องหมาย $\int$ เสร็จ** ก่อนจะคิดอย่างอื่น

### 1.3 สัญลักษณ์

$$\underbrace{\int}_{\text{เครื่องหมายปริพันธ์}} \underbrace{f(x)}_{\text{integrand}} \underbrace{dx}_{\text{ตัวแปรที่ integrate}} = F(x)+C$$

---

## 2. กฎปริพันธ์พื้นฐาน (Basic Integration Rules)

### 2.1 Power Rule for Integration — ตัวหลัก

$$\boxed{\;\int x^{n}\,dx=\frac{x^{\,n+1}}{n+1}+C \qquad (n\neq -1)\;}$$

**ภาษาคน: "บวกกำลังอีก 1 แล้วหารด้วยกำลังใหม่"**
(สลับกับ Power Rule ของอนุพันธ์ ที่ "เอากำลังลงมาคูณ แล้วลบกำลัง 1")

**กรณีพิเศษ $n=-1$:**
$$\int x^{-1}dx=\int\frac{1}{x}dx=\ln|x|+C$$
> ⚠️ **ต้องใส่ค่าสัมบูรณ์** $|x|$ — เพราะ $\ln$ รับเฉพาะค่าบวก

### 2.2 ตารางสูตรปริพันธ์ (ท่องให้ครบ)

| สูตร | | สูตร |
|:---|:---|:---|
| $\displaystyle\int k\,dx=kx+C$ | | $\displaystyle\int \sin x\,dx=-\cos x+C$ |
| $\displaystyle\int x^{n}dx=\frac{x^{n+1}}{n+1}+C$ | | $\displaystyle\int \cos x\,dx=\sin x+C$ |
| $\displaystyle\int \frac1x dx=\ln|x|+C$ | | $\displaystyle\int \sec^{2}x\,dx=\tan x+C$ |
| $\displaystyle\int e^{x}dx=e^{x}+C$ | | $\displaystyle\int \csc^{2}x\,dx=-\cot x+C$ |
| $\displaystyle\int a^{x}dx=\frac{a^{x}}{\ln a}+C$ | | $\displaystyle\int \sec x\tan x\,dx=\sec x+C$ |
| $\displaystyle\int kf\,dx=k\!\int\! f\,dx$ | | $\displaystyle\int \csc x\cot x\,dx=-\csc x+C$ |
| $\displaystyle\int (f\pm g)dx=\int\! f\,dx\pm\int\! g\,dx$ | | |

> **💡 เคล็ดจำเครื่องหมาย:** ปริพันธ์ = ดิฟกลับหลัง ⇒ อันไหนดิฟแล้วติดลบ ปริพันธ์จะติดลบด้วย
> $(\cos x)'=-\sin x$ ⇒ $\int\sin x\,dx=-\cos x+C$

### 2.3 ⚠️ สิ่งที่ **ไม่มี** ในปริพันธ์

$$\int f(x)g(x)\,dx \;\neq\; \left(\int f\,dx\right)\left(\int g\,dx\right)$$
$$\int \frac{f(x)}{g(x)}\,dx \;\neq\; \frac{\int f\,dx}{\int g\,dx}$$

**ไม่มี Product Rule / Quotient Rule สำหรับปริพันธ์!**
เจอผลคูณ/ผลหาร ต้องใช้ **u-Substitution (W13)** หรือ **Integration by Parts (W14)** หรือ **จัดรูปก่อน**

---

## 3. 🔑 Pattern: "จัดรูปก่อน แล้วค่อยปริพันธ์" — หัวใจของ HW12

**เกือบทุกข้อของ HW12 แก้ได้ด้วยการจัดรูปให้เป็น $x^{n}$ ก่อน**

### 3.1 ตารางการจัดรูป

| เห็นแบบนี้ | เขียนใหม่เป็น | ปริพันธ์ได้ |
|:---|:---|:---|
| $\sqrt{x}$ | $x^{1/2}$ | $\frac{2}{3}x^{3/2}$ |
| $\sqrt[3]{x^{2}}$ | $x^{2/3}$ | $\frac{3}{5}x^{5/3}$ |
| $\dfrac{1}{\sqrt[6]{x}}$ | $x^{-1/6}$ | $\frac{6}{5}x^{5/6}$ |
| $\dfrac{10}{x^{3}}$ | $10x^{-3}$ | $-5x^{-2}$ |
| $\dfrac{x^{2}+3\sqrt x}{x^{3}}$ | $x^{-1}+3x^{-5/2}$ | $\ln|x|-2x^{-3/2}$ |
| $\dfrac{\cos x}{\sin^{2}x}$ | $\csc x\cot x$ | $-\csc x$ |
| $\dfrac{1}{\sin^2 x}$ | $\csc^2 x$ | $-\cot x$ |
| $\sin^2x$ | $\frac{1-\cos 2x}{2}$ | (ใช้เอกลักษณ์ตรีโกณ) |

> **กฎเหล็ก:** เศษส่วนที่มี**หลายพจน์บนตัวเศษ** ให้ **แยกเป็นพจน์ ๆ ก่อน**
> $\dfrac{A+B}{C}=\dfrac{A}{C}+\dfrac{B}{C}$ ← **ทำได้!**
> $\dfrac{A}{B+C}\neq\dfrac{A}{B}+\dfrac{A}{C}$ ← **ทำไม่ได้!** (ตัวส่วนหลายพจน์แยกไม่ได้)

### 3.2 ตัวอย่างเต็ม — HW12 ข้อ 1
$$f'(x)=8x^{3}+5\sqrt[3]{x^{2}}-\frac{10}{\sqrt[6]{x}}+7 \quad\Rightarrow\quad f(x)=?$$

**ขั้นที่ 1 — จัดรูปเป็นเลขชี้กำลังทั้งหมด**
$$f'(x)=8x^{3}+5x^{2/3}-10x^{-1/6}+7$$

**ขั้นที่ 2 — ปริพันธ์ทีละพจน์**
$$f(x)=\int\!\big(8x^{3}+5x^{2/3}-10x^{-1/6}+7\big)dx$$
$$=8\cdot\frac{x^{4}}{4}+5\cdot\frac{x^{5/3}}{5/3}-10\cdot\frac{x^{5/6}}{5/6}+7x+C$$

**ขั้นที่ 3 — คิดเลขให้เรียบร้อย**
- $5\div\frac53 = 5\times\frac35=3$
- $10\div\frac56 = 10\times\frac65=12$

$$\boxed{f(x)=2x^{4}+3x^{5/3}-12x^{5/6}+7x+C}$$

> 💡 **ตรวจคำตอบเสมอ: ดิฟกลับ** ⇒ $8x^3+3\cdot\frac53x^{2/3}-12\cdot\frac56x^{-1/6}+7=8x^3+5x^{2/3}-10x^{-1/6}+7$ ✅

### 3.3 ตัวอย่างเต็ม — HW12 ข้อ 2 (ต้องรู้จักเอกลักษณ์ตรีโกณ)
$$g'(x)=\frac{3\cos x}{\sin^{2}x}$$

**ขั้นที่ 1 — แยกเป็นตรีโกณมาตรฐาน**
$$\frac{\cos x}{\sin^{2}x}=\frac{1}{\sin x}\cdot\frac{\cos x}{\sin x}=\csc x\cot x$$
$$\Rightarrow g'(x)=3\csc x\cot x$$

**ขั้นที่ 2 — ใช้สูตร $\int\csc x\cot x\,dx=-\csc x+C$**
$$g(x)=3(-\csc x)+C=\boxed{-3\csc x+C}$$

### 3.4 ตัวอย่างเต็ม — HW12 ข้อ 3 (แยกเศษส่วน)
$$y'=\frac{x^{2}+3\sqrt{x}}{x^{3}}$$

**ขั้นที่ 1 — แยกเศษออกเป็น 2 พจน์**
$$y'=\frac{x^{2}}{x^{3}}+\frac{3x^{1/2}}{x^{3}}=x^{-1}+3x^{1/2-3}=x^{-1}+3x^{-5/2}$$

**ขั้นที่ 2 — ปริพันธ์** (พจน์แรกเป็นกรณีพิเศษ $n=-1$!)
$$y=\ln|x|+3\cdot\frac{x^{-3/2}}{-3/2}+C=\boxed{\ln|x|-2x^{-3/2}+C}=\ln|x|-\frac{2}{x^{3/2}}+C$$

> ⚠️ **จุดตายของข้อนี้:** ถ้าเผลอใช้ Power Rule กับ $x^{-1}$ จะได้ $\frac{x^{0}}{0}$ = **หารด้วยศูนย์**
> **เห็น $x^{-1}$ หรือ $\frac1x$ ปุ๊บ → $\ln|x|$ ทันที**

---

## 4. สมการเชิงอนุพันธ์เบื้องต้น + เงื่อนไขเริ่มต้น

### 🔑 Pattern: หา $C$ จากเงื่อนไขเริ่มต้น
```
1) ปริพันธ์ → ได้ general solution พร้อม C
2) แทนเงื่อนไขที่โจทย์ให้ (เช่น f(1) = 5)
3) แก้หา C
4) เขียน particular solution (คำตอบเฉพาะ) กลับมาให้เต็ม
```

**ตัวอย่าง:** $f'(x)=6x$, $f(1)=5$
$$f(x)=3x^{2}+C \;\xrightarrow{\;f(1)=5\;}\; 3(1)^2+C=5 \Rightarrow C=2$$
$$\boxed{f(x)=3x^{2}+2}$$

### การเคลื่อนที่ (ปริพันธ์กลับทาง)
$$a(t)\;\xrightarrow{\int}\;v(t)\;\xrightarrow{\int}\;s(t)$$
$C$ ตัวแรกคือ $v_0$ (ความเร็วต้น) และตัวที่สองคือ $s_0$ (ตำแหน่งเริ่มต้น)

---

## 5. Sigma Notation, Riemann Sum และปริพันธ์จำกัดเขต

### 5.1 Sigma Notation
$$\sum_{i=1}^{n}a_i=a_1+a_2+\cdots+a_n$$

**สูตรผลรวมที่ต้องท่อง:**
$$\sum_{i=1}^{n}c=cn \qquad \sum_{i=1}^{n}i=\frac{n(n+1)}{2}$$
$$\sum_{i=1}^{n}i^{2}=\frac{n(n+1)(2n+1)}{6} \qquad \sum_{i=1}^{n}i^{3}=\left[\frac{n(n+1)}{2}\right]^{2}$$

### 5.2 หาพื้นที่ด้วยสี่เหลี่ยม (แนวคิด)
```
   แบ่งพื้นที่ใต้เส้นโค้งเป็นแท่งสี่เหลี่ยม n แท่ง
   → รวมพื้นที่ทุกแท่ง (ได้ค่าประมาณ)
   → เพิ่ม n ให้มากขึ้นเรื่อย ๆ (แท่งบางลง แม่นขึ้น)
   → ให้ n → ∞  ได้พื้นที่จริง
```
$$\text{Area}=\lim_{n\to\infty}\sum_{i=1}^{n}f(c_i)\,\Delta x, \qquad \Delta x=\frac{b-a}{n}$$

### 5.3 ปริพันธ์จำกัดเขต (Definite Integral)
$$\int_{a}^{b}f(x)\,dx=\lim_{\|\Delta\|\to 0}\sum_{i=1}^{n}f(c_i)\Delta x_i$$

**ความหมาย: "พื้นที่ที่มีเครื่องหมาย (signed area)"** — ส่วนที่อยู่ **ใต้แกน $x$ นับเป็นลบ**

### 5.4 สมบัติของปริพันธ์จำกัดเขต

$$\int_{a}^{a}f(x)dx=0 \qquad \int_{b}^{a}f(x)dx=-\int_{a}^{b}f(x)dx$$
$$\int_{a}^{b}f\,dx=\int_{a}^{c}f\,dx+\int_{c}^{b}f\,dx \qquad \int_a^b kf\,dx = k\int_a^b f\,dx$$

> ⚠️ **ปริพันธ์จำกัดเขต ไม่มี $+C$** (เพราะ $C$ ตัดกันตอนลบ $F(b)-F(a)$)
> แต่ **ปริพันธ์ไม่จำกัดเขต ต้องมี $+C$** เสมอ

---

## 6. 🔑 ทฤษฎีบทหลักมูลของแคลคูลัส (Fundamental Theorem of Calculus)

### 6.1 FTC ภาคที่ 1 — เครื่องมือคำนวณ

$$\boxed{\;\int_{a}^{b}f(x)\,dx=\Big[F(x)\Big]_{a}^{b}=F(b)-F(a)\;}$$
โดย $F$ เป็น antiderivative ตัวใดก็ได้ของ $f$

### 🔑 Pattern: คำนวณปริพันธ์จำกัดเขต (4 บรรทัด)
```
1) หา antiderivative F(x)          ← ไม่ต้องใส่ +C
2) เขียนวงเล็บก้ามปู [ F(x) ] จาก a ถึง b
3) แทนขอบบน ลบ แทนขอบล่าง:  F(b) − F(a)
4) คิดเลข → ตอบเป็นตัวเลข (ไม่มีตัวแปร ไม่มี C)
```

**ตัวอย่าง:**
$$\int_{1}^{3}(2x+1)\,dx=\Big[x^{2}+x\Big]_{1}^{3}=(9+3)-(1+1)=12-2=\boxed{10}$$

> ⚠️ **จุดพลาดยอดฮิต:** ตอนแทนขอบล่าง **ต้องใส่วงเล็บครอบทั้งก้อน** แล้วค่อยกระจายลบ
> $(9+3)-(1+1)$ ← ถูก
> $9+3-1+1$ ← **ผิด!** (ลืมกระจายลบเข้า $+1$)

### 6.2 FTC ภาคที่ 2 (Second FTC)
$$\frac{d}{dx}\left[\int_{a}^{x}f(t)\,dt\right]=f(x)$$
**ภาษาคน: ปริพันธ์แล้วดิฟ = ได้ของเดิม** (สองการกระทำนี้ยกเลิกกัน)

แบบมี Chain Rule:
$$\frac{d}{dx}\left[\int_{a}^{g(x)}f(t)\,dt\right]=f(g(x))\cdot g'(x)$$

### 6.3 ทฤษฎีบทค่าเฉลี่ยของปริพันธ์ (Mean Value Theorem for Integrals)
ถ้า $f$ ต่อเนื่องบน $[a,b]$ จะมี $c\in[a,b]$ ที่
$$\int_{a}^{b}f(x)dx=f(c)(b-a)$$

**ค่าเฉลี่ยของฟังก์ชัน (Average Value):**
$$\boxed{\;f_{\text{avg}}=\frac{1}{b-a}\int_{a}^{b}f(x)\,dx\;}$$

**ภาษาคน:** ถ้าเอาพื้นที่ใต้โค้งไป "รีดให้แบนเป็นสี่เหลี่ยมผืนผ้าฐานเท่าเดิม" ความสูงจะเป็นเท่าไหร่

---

## 7. ตารางสูตร Week 12 (ฉีกไปติดผนัง)

$$\int x^{n}dx=\frac{x^{n+1}}{n+1}+C\ (n\neq-1) \qquad \int\frac1x dx=\ln|x|+C$$

$$\int\sin x\,dx=-\cos x+C \qquad \int\cos x\,dx=\sin x+C \qquad \int e^{x}dx=e^{x}+C$$

$$\int\sec^{2}x\,dx=\tan x+C \qquad \int\csc^{2}x\,dx=-\cot x+C$$

$$\int\sec x\tan x\,dx=\sec x+C \qquad \int\csc x\cot x\,dx=-\csc x+C$$

$$\int_{a}^{b}f(x)dx=F(b)-F(a) \qquad f_{\text{avg}}=\frac{1}{b-a}\int_a^b f\,dx$$

---

## 8. 🚨 Pitfall Alerts — จุดที่ นศ. มักโดนตัดเป็น 0 คะแนน

### ❌ Pitfall 1: **ลืม `+C`**
อันดับ 1 ตลอดกาล ในระบบ all-or-nothing = 0 คะแนนทันที
**นิสัยกันตาย: เขียน `+ C` ตั้งแต่ยังไม่ทันคิดคำตอบ**

### ❌ Pitfall 2: ใช้ Power Rule กับ $x^{-1}$
$\int x^{-1}dx \neq \frac{x^{0}}{0}$ (หารศูนย์!) → ต้องเป็น $\ln|x|+C$

### ❌ Pitfall 3: ลืมค่าสัมบูรณ์ใน $\ln|x|$
เขียน $\ln x$ เฉย ๆ → เสี่ยงโดนตัด เพราะไม่ครอบคลุม $x<0$

### ❌ Pitfall 4: คิดว่ามี Product/Quotient Rule ของปริพันธ์
$\int x\cos x\,dx \neq \frac{x^2}{2}\sin x$ ← **ผิดสนิท** (ข้อนี้ต้องใช้ by parts ใน W14)

### ❌ Pitfall 5: แยกเศษส่วนผิดข้าง
$\dfrac{A+B}{C}=\dfrac AC+\dfrac BC$ ✅ | $\dfrac{A}{B+C}\neq\dfrac AB+\dfrac AC$ ❌

### ❌ Pitfall 6: ปริพันธ์จำกัดเขตแล้วยังใส่ $+C$ ติดไป
$\int_1^3(2x+1)dx=[x^2+x+C]_1^3$ ← ไม่ผิดทางคณิตศาสตร์ (C ตัดกัน) แต่ **ทำให้ TA สับสน**
ตัดออกให้เรียบร้อย

### ❌ Pitfall 7: ลืมวงเล็บตอนแทนขอบล่าง
$F(b)-F(a)$ → เมื่อ $F(a)$ มีหลายพจน์ **ต้องใส่วงเล็บ** ก่อนกระจายลบ

### ❌ Pitfall 8: เศษส่วนซ้อนคิดผิด
$5\div\frac53$ → คนมักตอบ $\frac{5}{5/3}=\frac{25}{3}$ (ผิด) หรือ $\frac{1}{3}$ (ผิด)
**ถูกคือ $5\times\frac35=3$** — หารด้วยเศษส่วน = คูณด้วยส่วนกลับ

### ❌ Pitfall 9: ไม่ตรวจคำตอบด้วยการดิฟกลับ
ปริพันธ์เป็นวิชาเดียวที่ **ตรวจคำตอบเองได้ 100%** — ดิฟผลลัพธ์ ต้องได้ integrand เดิม
**ใช้เวลา 20 วินาที แลกกับ 0 คะแนน — คุ้มมาก**

---

## 9. Self-Check ก่อนไปสัปดาห์หน้า

- [ ] เขียน `+C` โดยอัตโนมัติทุกครั้งที่ทำปริพันธ์ไม่จำกัดเขต
- [ ] ท่องตารางสูตรปริพันธ์ 10 สูตรหลักได้
- [ ] จัดรูป $\frac{x^2+3\sqrt x}{x^3}$ เป็นผลบวกของ $x^n$ ได้ใน 30 วินาที
- [ ] รู้ว่า $\int\frac1x dx$ เป็นกรณีพิเศษ และเขียน $\ln|x|$ พร้อมค่าสัมบูรณ์
- [ ] ทำ $\int_0^2(3x^2-1)dx$ ได้ (คำตอบ: $6$)
- [ ] ตรวจคำตอบปริพันธ์ทุกข้อด้วยการดิฟกลับ

👉 ต่อไป: **[`week12_quiz.md`](week12_quiz.md)**
