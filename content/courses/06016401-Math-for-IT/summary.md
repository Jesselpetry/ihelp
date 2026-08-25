---
code: "06016401"
slug: Math-for-IT
shortCode: MFIT
nameTh: คณิตศาสตร์สำหรับเทคโนโลยีสารสนเทศ
nameEn: Mathematics for Information Technology
credits: "3 (3-0-6)"
year: 1
term: 1
termId: Y1-S1
prerequisites: []
language: th
sources:
  - kmitl-archive/archive/Y1-S1/Math-for-IT
  - kmitl-archive/archive/Y1-S1-2569/Math-for-IT
---

# MFIT — คณิตศาสตร์สำหรับเทคโนโลยีสารสนเทศ

## 1. ภาพรวมรายวิชา (ข้อมูลอย่างเป็นทางการจาก IT KMITL)

| หัวข้อ | รายละเอียด |
|---|---|
| **รหัสวิชา** | `06016401` |
| **ชื่อภาษาไทย** | คณิตศาสตร์สำหรับเทคโนโลยีสารสนเทศ |
| **ชื่อภาษาอังกฤษ** | Math for IT |
| **หน่วยกิต** | 3 (3-0-6) |
| **ระดับการศึกษา** | ปริญญาตรี |
| **ชั้นปี / ภาคการศึกษา** | ปี 1 เทอม 1 (Y1-S1) |
| **วิชาบังคับก่อน** | ไม่มีวิชาบังคับก่อน |
| **อาจารย์ผู้สอน** | ผศ.ดร. สมเกียรติ วังศิริพิทักษ์ · ผศ.ดร. ประพันธ์ ปวรางกูร |

### คำอธิบายรายวิชา (Course Description)

> **ภาษาไทย:**  
> ลิมิตและความต่อเนื่องอนุพันธ์ของฟังก์ชันอนุพันธ์อันดับสูงการประยุกต์ของอนุพันธ์ปัญหาค่าสูงสุดและต่ำสุดของฟังก์ชัน การอินทิเกรตและเทคนิคของการอินทเกรต การประยุกต์ของการอินทิเกรตฟังก์ชันสองตัวแปร อนุพันธ์ย่อยพีชคณิตเชิงเส้น เมทริกซ์และดีเทอร์มิแนนท์ ระบบสมการเชิงเส้นและการหาผลเฉลยของระบบสมการเชิงเส้น เวกเตอร์สเปซ การแปลงเชิงเส้น การแปลงเมทริกซ์ เมทริกซ์เชิงตั้งฉาก

> **English:**  
> Limit and continuity, derivative of functions, higher derivatives, applications of derivative, maxima and minima of functions, integration and techniques of integration, applications of integration, functions of two variables, partial derivatives, linear algebra, matrices and determinants, system of linear equations and its solutions, vector spaces, linear transformations, matrix transformation, orthogonal matrix.


### จุดมุ่งหมาย

ให้ผู้เรียนมีความรู้พื้นฐานทางคณิตศาสตร์ที่จำเป็นสำหรับวิชาอื่นด้านเทคโนโลยีสารสนเทศ
และประยุกต์ซอฟต์แวร์ช่วยคำนวณเพื่อแก้ปัญหาทางไอทีได้

### สัดส่วนคะแนน

| รายการ | สัดส่วน |
|---|---|
| Class Participation and Activities (participation + homework + quiz) | 30% |
| Midterm Examination | 35% |
| Final Examination | 35% |

> ตัวเลขบนสไลด์เรียงเป็น `35% / 30% / 35%` โดยไม่ระบุคู่กันชัดเจน — รวมเป็น 100%
> ให้ยืนยันกับผู้สอนของเทอมปัจจุบันก่อนใช้อ้างอิง

---

## 2. ขอบเขตเนื้อหา — แผน 17 สัปดาห์

### 2.1 ครึ่งแรก: พีชคณิตเชิงเส้น (สอบกลางภาค)

| สัปดาห์ | หัวข้อ |
|---|---|
| 1 | Linear algebra — บทนำ + เมทริกซ์ |
| 2 | Matrices and determinants |
| 3 | System of linear equations and its solutions |
| 4 | Vector space (1) — เวกเตอร์ใน `Rⁿ`, dot product |
| 5 | Vector space (2) — subspace, span, linear independence |
| 6 | Linear transformations |
| 7 | Orthogonal matrix — eigenvalue, diagonalization |
| **8** | **สอบกลางภาค** |

### 2.2 ครึ่งหลัง: แคลคูลัส (สอบปลายภาค)

| สัปดาห์ | หัวข้อ |
|---|---|
| 9 | Function, limit and continuity |
| 10 | Derivative of functions |
| 11 | Higher-order derivatives, chain rule, implicit differentiation |
| 12 | Applications of the derivative |
| 13 | Integration (indefinite & definite) |
| 14 | Integration by substitution |
| 15 | Applications of integration |
| 16 | Function of two variables, partial derivatives |
| **17** | **สอบปลายภาค** |

> ไฟล์ในคลังใช้เลขสัปดาห์สองระบบ: `MFIT_Lec_Week01–07_v2` = พีชคณิตเชิงเส้น
> ส่วน `MFIT_Lec_Calculus-01…08` และ `MFIT_HW_Week08–14` = แคลคูลัส (คือสัปดาห์ 9–16 ตามแผนข้างบน)

---

## 3. สรุปเนื้อหารายหัวข้อ — ภาคพีชคณิตเชิงเส้น

### W1 — Matrices

- **นิยามเมทริกซ์** ขนาด `m × n`, สมาชิก `aᵢⱼ`, เมทริกซ์แถว/หลัก/จัตุรัส/ศูนย์/เอกลักษณ์
- **การบวก** — ทำได้เมื่อขนาดเท่ากัน บวกทีละตำแหน่ง
- **การคูณสเกลาร์** — `c·A` คูณทุกสมาชิก
- **การคูณเมทริกซ์** ⭐ — `A(m×n) · B(n×p) = C(m×p)`; `cᵢⱼ = Σₖ aᵢₖ bₖⱼ`
  - **ไม่มีสมบัติสลับที่** — โดยทั่วไป `AB ≠ BA`
- **สมบัติ** — associative, distributive, `AI = IA = A`
- **ทรานสโพส** — `(Aᵀ)ᵀ = A` · `(A + B)ᵀ = Aᵀ + Bᵀ` · **`(AB)ᵀ = BᵀAᵀ`** ⭐

### W2 — Determinants & Inverse

- **ตัวผกผัน** `A⁻¹` — มีเมื่อ `det(A) ≠ 0` (nonsingular)
  - `(AB)⁻¹ = B⁻¹A⁻¹` ⭐
- **ดีเทอร์มิแนนต์**
  - 2×2: `det = ad − bc`
  - n×n: **การกระจายตามโคแฟกเตอร์ (expansion by cofactors)**
- **Minor `Mᵢⱼ`** — ดีเทอร์มิแนนต์ที่ตัดแถว i หลัก j ออก
- **Cofactor `Cᵢⱼ = (−1)^(i+j) · Mᵢⱼ`** ⭐
- **สมบัติดีเทอร์มิแนนต์** — `det(Aᵀ) = det(A)` · `det(AB) = det(A)det(B)` ·
  สลับแถว → เครื่องหมายเปลี่ยน · มีแถวซ้ำ/แถวศูนย์ → `det = 0`
- **Adjoint** — `adj(A) = Cᵀ` (ทรานสโพสของเมทริกซ์โคแฟกเตอร์)
- **สูตรหาตัวผกผัน** ⭐⭐ — `A⁻¹ = adj(A) / det(A)`
- **การประยุกต์** — พื้นที่สามเหลี่ยม, สมการเส้นตรงผ่านสองจุด, ปริมาตรทรงสี่หน้า, **cryptography** (เข้ารหัส/ถอดรหัสข้อความด้วยเมทริกซ์)

### W3 — Systems of Linear Equations

- จำนวนผลเฉลย: มีคำตอบเดียว · ไม่มีคำตอบ · มีคำตอบไม่จำกัด
- **Cramer's Rule** ⭐ — `xᵢ = det(Aᵢ) / det(A)` (ใช้ได้เมื่อ `det(A) ≠ 0`)
- **การดำเนินการตามแถวมูลฐาน (elementary row operations)**
  1. สลับสองแถว 2. คูณแถวด้วยค่าคงที่ที่ไม่เป็นศูนย์ 3. บวกผลคูณของแถวหนึ่งเข้าอีกแถว
- **Row-echelon form** และ **reduced row-echelon form**
- **Gaussian elimination** (+ back substitution) vs **Gauss-Jordan elimination**
- **Polynomial curve fitting** — หาพหุนามผ่านจุดที่กำหนด
- **LU-Factorization** — `A = LU` แล้วแก้ `Ly = b`, `Ux = y`

### W4 — Vector Spaces (1)

- เวกเตอร์ในระนาบและใน `Rⁿ`; การบวก การคูณสเกลาร์ และสมบัติ
- **ความยาว (norm)** — `‖v‖ = √(v₁² + … + vₙ²)`
- **เวกเตอร์หนึ่งหน่วย** — `u = v / ‖v‖`
- **ระยะทาง** — `d(u, v) = ‖u − v‖`
- **Dot product** ⭐ — `u · v = Σ uᵢvᵢ`; `u · v = ‖u‖‖v‖cos θ`
  - ตั้งฉาก (orthogonal) เมื่อ `u · v = 0`
- **Cross product** ใน `R³` และการหาพื้นที่สี่เหลี่ยมด้านขนาน

### W5 — Vector Spaces (2)

- **สัจพจน์ของ vector space** (10 ข้อ) และตัวอย่าง: `R²`, `Rⁿ`, `M₂,₃`, พหุนามดีกรี ≤ n
- ตัวอย่างที่ **ไม่ใช่** vector space — เซตจำนวนเต็ม, พหุนามดีกรี = 2 พอดี, ควอดรันต์ที่หนึ่ง
- **Subspace** ⭐ — ทดสอบ 3 ข้อ: (1) มี `0` (2) ปิดภายใต้การบวก (3) ปิดภายใต้การคูณสเกลาร์
- **Linear combination** และ **spanning set**; `span(S)` เป็น subspace เสมอ
- **Linear (in)dependence** ⭐⭐ — `c₁v₁ + … + cₙvₙ = 0` มีคำตอบเดียวคือ `cᵢ = 0` ทั้งหมด → อิสระเชิงเส้น
- **Basis** และ **dimension**

### W6 — Linear Transformations

- **นิยาม** ⭐ — `T` เป็นเชิงเส้นเมื่อ `T(u + v) = T(u) + T(v)` และ `T(cu) = cT(u)`
- **Standard matrix** — `T(v) = Av`; หาได้จาก `T(e₁), T(e₂), …`
- **Composition** — `T₂ ∘ T₁` มี standard matrix `A₂A₁`
- **Inverse linear transformation** — มีเมื่อ `A` invertible
- **การแปลงมาตรฐานในระนาบ** — reflection, expansion/contraction, shear, **rotation**
  - หมุนมุม θ: `[[cos θ, −sin θ], [sin θ, cos θ]]`
- **คอมพิวเตอร์กราฟิก** — การหมุนรอบแกน x, y, z ใน 3 มิติ

### W7 — Eigenvalues, Diagonalization, Orthogonal Matrix

- **นิยาม** ⭐⭐ — `Av = λv` โดย `v ≠ 0`; `λ` = eigenvalue, `v` = eigenvector
- **สมการลักษณะเฉพาะ** — `det(λI − A) = 0`
- **Eigenspace** — เซตของ eigenvector ของ `λ` รวมกับเวกเตอร์ศูนย์ เป็น subspace
- eigenvalue ของเมทริกซ์ทแยงมุม/สามเหลี่ยม = สมาชิกบนเส้นทแยงมุม
- **Diagonalization** ⭐⭐ — `A` ทแยงมุมได้เมื่อมี eigenvector อิสระเชิงเส้น n ตัว
  - `P⁻¹AP = D` โดย `P` = เมทริกซ์ที่เอา eigenvector เป็นหลัก, `D` = ทแยงมุมของ eigenvalue
  - เงื่อนไขเพียงพอ: eigenvalue ต่างกัน n ค่า
- **Symmetric matrix** — `A = Aᵀ`; eigenvalue เป็นจำนวนจริงเสมอ
- **Orthogonal matrix** ⭐ — `AᵀA = I` ⟺ `A⁻¹ = Aᵀ`; หลักของ `A` เป็น orthonormal set
- **Orthogonal diagonalization** — ทำได้ก็ต่อเมื่อ `A` สมมาตร
- การประยุกต์: population growth (Markov)

---

## 4. สรุปเนื้อหารายหัวข้อ — ภาคแคลคูลัส

### W9 — Function, Limit and Continuity

- ฟังก์ชัน โดเมน เรนจ์
- **ลิมิต** — วิธีตัวเลข (numerical), กราฟ, พีชคณิต
- **ลิมิตที่ไม่มีค่า (limits that fail to exist)** ⭐ — ซ้าย ≠ ขวา · โตไม่จำกัด · แกว่งไม่หยุด
- **สมบัติของลิมิต** — ผลบวก ผลคูณ ผลหาร ยกกำลัง
- เทคนิค: แยกตัวประกอบ, **rationalizing** (คูณคอนจูเกต)
- **ลิมิตตรีโกณมิติ** ⭐ — `lim(x→0) sin x / x = 1` · `lim(x→0) (1 − cos x)/x = 0`
- **ความต่อเนื่อง** — ต่อเนื่องที่ `c` เมื่อ `f(c)` นิยามได้, ลิมิตมีค่า, และลิมิต = `f(c)`

### W10 — Derivative

- **นิยาม** ⭐⭐ — `f′(x) = lim(h→0) [f(x+h) − f(x)] / h` (ความชันของเส้นสัมผัส)
- เส้นตัด (secant) → เส้นสัมผัส (tangent)
- จุดที่หาอนุพันธ์ไม่ได้: หักมุม, เส้นสัมผัสแนวตั้ง, ไม่ต่อเนื่อง
- **กฎพื้นฐาน** — `d/dx xⁿ = nxⁿ⁻¹` · product rule · quotient rule
- อนุพันธ์ของฟังก์ชันตรีโกณมิติ, เลขชี้กำลัง, ลอการิทึม
- อัตราการเปลี่ยนแปลง, การเคลื่อนที่ (`s → v → a`)

### W11 — Higher-Order Derivatives, Chain Rule, Implicit Differentiation

- **Chain rule** ⭐⭐ — `dy/dx = (dy/du)(du/dx)`
- **อนุพันธ์อันดับสูง** — `f″`, `f‴`, `f⁽ⁿ⁾`
- **Implicit differentiation** ⭐ — หา `dy/dx` จากสมการที่แยก `y` ไม่ได้ (เช่น `y³ − x²y = 25`, `cos(x + y) = x`)
- **Related rates** — โยงอัตราการเปลี่ยนแปลงหลายตัวผ่านเวลา

### W12 — Applications of the Derivative

- จุดวิกฤต, **ค่าสูงสุด/ต่ำสุดสัมบูรณ์และสัมพัทธ์**
- **First derivative test** และ **second derivative test**
- ความเว้า (concavity) และ **จุดเปลี่ยนเว้า (inflection point)**
- **Optimization** ⭐⭐ — โจทย์มาตรฐาน: หาพื้นที่/ปริมาตรมากที่สุด (เช่น สามเหลี่ยมหน้าจั่วที่ใหญ่ที่สุดที่บรรจุในวงกลม)
- Mean Value Theorem, กฎของโลปิตาล

### W13 — Integration

- **ปฏิยานุพันธ์ (antiderivative)** และอินทิกรัลไม่จำกัดเขต `∫f(x)dx = F(x) + C`
- ผลรวมรีมันน์ → **อินทิกรัลจำกัดเขต**
- **ทฤษฎีบทหลักมูลของแคลคูลัส** ⭐⭐ — `∫ₐᵇ f(x)dx = F(b) − F(a)`
- สมบัติของอินทิกรัลจำกัดเขต, ค่าเฉลี่ยของฟังก์ชัน

### W14 — Integration by Substitution (และเทคนิคอื่น)

- **Substitution (u-substitution)** ⭐⭐ — `∫f(g(x))g′(x)dx = ∫f(u)du`
- **Integration by parts** ⭐⭐ — `∫u dv = uv − ∫v du` (เลือก `u` ตาม LIATE)
- อินทิกรัลตรีโกณมิติ, trigonometric substitution, เศษส่วนย่อย

### W15 — Applications of Integration

- **พื้นที่ระหว่างเส้นโค้ง** — `∫ₐᵇ [f(x) − g(x)]dx`
- **ปริมาตรของรูปทรงหมุน** ⭐⭐
  - **Disk method:** `V = π∫ₐᵇ [R(x)]²dx`
  - **Washer method:** `V = π∫ₐᵇ ([R]² − [r]²)dx`
  - **Shell method:** `V = 2π∫ₐᵇ x·f(x)dx`
- ความยาวส่วนโค้ง, พื้นที่ผิวของรูปทรงหมุน
- **งาน (work)** — `W = ∫F(x)dx`
- **โมเมนต์และจุดศูนย์กลางมวล (centroid)**

### W16 — Functions of Two Variables & Partial Derivatives

- ฟังก์ชันสองตัวแปร `z = f(x, y)`, โดเมน, level curve
- **อนุพันธ์ย่อย** ⭐⭐ — `fₓ` (มอง `y` เป็นค่าคงที่), `f_y`
- อนุพันธ์ย่อยอันดับสอง `fₓₓ`, `f_yy`, `fₓ_y`; **ทฤษฎีบทของแคลโรต์** `fₓ_y = f_yₓ`
- chain rule สำหรับหลายตัวแปร

---

## 5. พิมพ์เขียวสำหรับสร้างสื่อต่อยอด

### 5.1 คลังข้อสอบ

| มิติ | ข้อกำหนด |
|---|---|
| กลางภาค | W1 10% · W2 20% · W3 20% · W4 15% · W5 15% · W6 10% · W7 10% |
| ปลายภาค | ลิมิต 10% · อนุพันธ์ 25% · ประยุกต์อนุพันธ์ 15% · อินทิเกรต 25% · ประยุกต์อินทิเกรต 15% · อนุพันธ์ย่อย 10% |
| ชนิดข้อ | แสดงวิธีทำ 80% · ปรนัยเช็คมโนทัศน์ 20% |
| การตรวจ | ให้คะแนนขั้นตอน ไม่ใช่แค่คำตอบสุดท้าย |

### 5.2 รูปแบบโจทย์มาตรฐานที่ generate ได้อัตโนมัติ

| หัวข้อ | เทมเพลตโจทย์ | วิธีตรวจอัตโนมัติ |
|---|---|---|
| เมทริกซ์ | สุ่ม `A`, `B` ขนาด 2×3, 3×2 → หา `AB`, `(AB)ᵀ` | คูณเมทริกซ์เทียบตรง |
| ดีเทอร์มิแนนต์ | สุ่มเมทริกซ์ 3×3 สมาชิกเต็ม → หา `det`, `adj`, `A⁻¹` | คำนวณสัญลักษณ์ |
| ระบบสมการ | สุ่มระบบ 3×3 ที่มีคำตอบจำนวนเต็ม → Cramer / Gauss-Jordan | เทียบเวกเตอร์คำตอบ |
| อิสระเชิงเส้น | สุ่มเซตเวกเตอร์ → ตัดสินอิสระ/ไม่อิสระ | หา rank |
| Eigen | สุ่มเมทริกซ์ 2×2/3×3 ที่ eigenvalue เป็นจำนวนเต็ม → หา `λ`, `v`, `P`, `D` | ตรวจ `P⁻¹AP = D` |
| ลิมิต | สุ่มฟังก์ชันตรรกยะที่ต้องแยกตัวประกอบ | เทียบค่าเชิงสัญลักษณ์ |
| อนุพันธ์ | สุ่มฟังก์ชันประกอบ → chain/product/quotient rule | เทียบ `sympy.diff` |
| อินทิกรัล | สุ่มโจทย์ u-substitution และ by parts | เทียบ `sympy.integrate` |
| ปริมาตร | สุ่มบริเวณ + แกนหมุน → disk/washer/shell | เทียบค่าตัวเลข |

> คลังใช้ `sympy` ตรวจได้ทั้งภาคพีชคณิตเชิงเส้นและแคลคูลัส — คุ้มที่จะทำเป็นตัว generate โจทย์

### 5.3 ข้อสอบจำลอง

- **กลางภาค** — 6–8 ข้อใหญ่ ต้องมี: คูณ/ทรานสโพสเมทริกซ์ 1 ข้อ · `det`+`A⁻¹` 1 ข้อ · ระบบสมการ 1 ข้อ ·
  ทดสอบ subspace/อิสระเชิงเส้น 1 ข้อ · linear transformation 1 ข้อ · eigen+diagonalize 1 ข้อ
- **ปลายภาค** — ต้องมี: ลิมิต 1 ข้อ · อนุพันธ์ (chain + implicit) 2 ข้อ · optimization 1 ข้อ ·
  อินทิกรัล (substitution + by parts) 2 ข้อ · พื้นที่/ปริมาตร 1 ข้อ · อนุพันธ์ย่อย 1 ข้อ
- ในคลังมีข้อสอบจริงย้อนหลัง ปี 2559, 2560, 2561 และ cheat sheet ปี 2022–2023 ให้เทียบแนว

---

## 6. แหล่งข้อมูลในคลัง

| ประเภท | จำนวน | หมายเหตุ |
|---|---|---|
| สไลด์พีชคณิตเชิงเส้น | `MFIT_Lec_Week01–07_v2.pdf` | ครบทั้ง 7 สัปดาห์ ภาษาอังกฤษ |
| สไลด์แคลคูลัส | `MFIT_Lec_Calculus-01–08(-Handout).pdf` | มีทั้งฉบับเต็มและ handout ที่มีลายมือจด |
| แบบฝึกหัดรายสัปดาห์ | `MFIT_Ex_Week01–07-Activity` | โจทย์พีชคณิตเชิงเส้น มีฉบับเฉลย `_v2` |
| การบ้านแคลคูลัส | `MFIT_HW_Week08–14` + `MFIT_HW_Calculus-Week08–14` | จับคู่โจทย์กับเฉลยลายมือได้ |
| ข้อสอบเก่า | 20 ไฟล์ | Final 2559/2560/2561 · Midterm หลายชุด |
| ชีทสรุป | 6 ไฟล์ | `FinalCheatSheet-2023`, `Recap-Calculus`, `Summary-Mfit` |
