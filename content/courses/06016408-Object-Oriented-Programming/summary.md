---
code: "06016408"
slug: Object-Oriented-Programming
shortCode: OOP
nameTh: การสร้างโปรแกรมเชิงวัตถุ
nameEn: Object-Oriented Programming
credits: "3 (2-2-5)"
year: 1
term: 2
termId: Y1-S2
prerequisites: ["06066303 PSCP"]
language: th
programmingLanguage: Java
sources:
  - kmitl-archive/archive/Y1-S2/Object-Oriented-Programming
---

# OOP — การสร้างโปรแกรมเชิงวัตถุ

## 1. ภาพรวมรายวิชา (ข้อมูลอย่างเป็นทางการจาก IT KMITL)

| หัวข้อ | รายละเอียด |
|---|---|
| **รหัสวิชา** | `06016408` |
| **ชื่อภาษาไทย** | การสร้างโปรแกรมเชิงวัตถุ |
| **ชื่อภาษาอังกฤษ** | Object Oriented Programming |
| **หน่วยกิต** | 3 (3-0-6) |
| **ระดับการศึกษา** | ปริญญาตรี |
| **ชั้นปี / ภาคการศึกษา** | ปี 1 เทอม 2 (Y1-S2) |
| **วิชาบังคับก่อน** | ไม่มีวิชาบังคับก่อน |
| **อาจารย์ผู้สอน** | ผศ.ดร. ธราวิเชษฐ์ ธิติจรูญโรจน์ |

### คำอธิบายรายวิชา (Course Description)

> **ภาษาไทย:**  
> การออกแบบและพัฒนาโปรแกรมเชิงอ็อบเจกต์ หลักการห่อหุ้ม คลาสและอ็อบเจกต์ เมธอดและการส่งสาร การสืบทอดคุณลักษณะ ภาวะพหุสัณฐาน การพัฒนาส่วนต่อประสานกราฟิกกับผู้ใช้และการจัดการกับเหตุการณ์ อาร์เรย์และคอลเลคชัน การจัดการกับสิ่งผิดปกติ คลาสที่เกี่ยวข้องกับอินพุตและเอาต์พุต เธรด

> **English:**  
> Object-oriented program design and development, encapsulation, classes and objects, methods and message passing, inheritance and polymorphism, graphical user interface development and event handling, data structures, arrays and collections, exception handling, input/output classes, threads.

---

## 2. ขอบเขตเนื้อหา

### 2.1 ขอบเขตสอบกลางภาค (บทที่ 0–7)

| สัปดาห์ | บท | หัวข้อ |
|---|---|---|
| — | 0 | แนะนำการโปรแกรมเชิงวัตถุ |
| 01 | 1 | ความรู้เบื้องต้นของภาษาจาวา |
| 02 | 2 | คำสั่งควบคุมและโครงสร้างแบบซ้อน (Selection) |
| 03 | 3 | คำสั่งทำงานซ้ำ · ขอบเขต · การแปลงชนิดข้อมูล |
| 04 | 4 | การเขียนโปรแกรมเชิงวัตถุเบื้องต้น |
| 05 | 5 | หลักการห่อหุ้มและการสืบทอด |
| 06 | 6 | การมีได้หลากหลายรูปแบบ (Polymorphism) |
| 07 | 7 | คอนสตรัคเตอร์ · คลาสไม่สมบูรณ์ · อินเตอร์เฟส |
| **08** | | **สอบกลางภาค** |

### 2.2 ขอบเขตสอบปลายภาค (บทที่ 8–14)

| สัปดาห์ | บท | หัวข้อ |
|---|---|---|
| 08 | 8 | ส่วนต่อประสานกราฟิกกับผู้ใช้ (GUI) |
| 09 | 9 | การจัดการเหตุการณ์ (Event Handling) |
| 10 | 10 | อาร์เรย์ · Collection API · Generic |
| 11 | 11 | ข้อผิดพลาดและการจัดการ (Exception) |
| 12 | 12 | คลาสนำเข้าและส่งออกข้อมูล (Stream / File I/O) |
| 13 | 13 | เธรด (Thread) |
| 14 | 14 | แนวคิดการเขียนโปรแกรมเชิงวัตถุขั้นสูง |

---

## 3. สรุปเนื้อหารายหัวข้อ

### บทที่ 0 — แนะนำการโปรแกรมเชิงวัตถุ

- **ออปเจ็ค (Object)** = **คุณลักษณะ (Attribute)** + **เมธอด (Method)**
- หลักการทำงาน 4 ขั้น ⭐
  1. วิเคราะห์ปัญหาโดยมองว่าประกอบด้วยออปเจ็คต่าง ๆ
  2. จำลองคุณลักษณะและพฤติกรรมของออปเจ็ค
  3. ออปเจ็คส่งข้อมูลกันผ่าน **ข่าวสาร (Message)**
  4. พิจารณาลำดับการทำงานและแบ่งงานตามหน้าที่
- กรณีศึกษา *Open the dog door* — คลาส `DogDoor`, `Remote`, `BarkRecognizer`

### บทที่ 1 — ความรู้เบื้องต้นของภาษาจาวา

- โครงสร้างโปรแกรม Java, `public class Main { public static void main(String[] args) }`
- **การแสดงผล** — `System.out.print` / `println` / `printf`
- **การรับค่า** — คลาส `Scanner` (`nextInt()`, `nextDouble()`, `nextLine()`)
- **ชนิดข้อมูลพื้นฐาน (primitive) 8 ชนิด** ⭐⭐

| กลุ่ม | ชนิด | ขนาด | ช่วงค่า |
|---|---|---|---|
| จำนวนเต็ม | `byte` | 1 byte | −128 … 127 |
| | `short` | 2 bytes | −32,768 … 32,767 |
| | `int` | 4 bytes | ≈ ±2.1 × 10⁹ |
| | `long` | 8 bytes | ≈ ±9.2 × 10¹⁸ |
| ทศนิยม | `float` | 4 bytes | ~7 หลักนัยสำคัญ |
| | `double` | 8 bytes | ~15 หลักนัยสำคัญ |
| ตรรกะ | `boolean` | — | `true` / `false` |
| อักขระ | `char` | 2 bytes | Unicode |

- **ชนิดข้อมูลแบบอ้างอิง (reference)** — object, array, คลาส `String` ⭐ (ต่างจาก primitive ตรงที่เก็บที่อยู่)
- การประกาศตัวแปร, กฎการตั้งชื่อ, **keyword** ที่ห้ามใช้, ค่าคงที่ด้วย `final`
- **ตัวดำเนินการ** — assignment, arithmetic, compound (`+=`), increment/decrement (`++`/`--` แบบ prefix/postfix)
- **ลำดับความสำคัญของตัวดำเนินการ**
- ตัวดำเนินการกับ `String` — `+` คือการเชื่อมข้อความ
- ความต่างระหว่าง `void` และ `null` ⭐

### บทที่ 2 — คำสั่งควบคุม (Selection)

- โครงสร้างการเขียนโปรแกรม 3 แบบ: เรียงลำดับ (sequence) · มีเงื่อนไข (selection) · ทำซ้ำ (iteration)
- **Single selection** — `if`
- **Double selection** — `if…else` และรูปย่อ **ternary** `cond ? a : b`
- **Multiple selection** — `else if` ซ้อน และ **`switch…case`**
  - `switch` รับ `char`, `int`, `String`, `enum`; ต้องมี `break` ไม่งั้นจะ **fall through** ⭐
- **นิพจน์ที่คืนค่าความจริง** — ตัวแปร `boolean`, การเปรียบเทียบ, ตัวดำเนินการตรรกะ, เมธอดที่คืน `boolean`
- **ตัวดำเนินการเปรียบเทียบ** `== != > >= < <=`
- **ตัวดำเนินการตรรกะ** `&&`, `||`, `!` และ **short-circuit evaluation**
- **การเปรียบเทียบความเท่ากันของอ็อบเจ็ค** ⭐⭐ — `==` เทียบที่อยู่; `.equals()` เทียบเนื้อหา (สำคัญมากกับ `String`)

### บทที่ 3 — การทำงานซ้ำ ขอบเขต และการแปลงชนิดข้อมูล

- **`for`** — `for (init; condition; update)`; **nested for**
- **`while`** vs **`do…while`** ⭐ — `do…while` ทำงานอย่างน้อย 1 รอบเสมอ
- **`break`** / **`continue`** และ **labeled break/continue**
- **ขอบเขตตัวแปร (scope)** — block scope, method scope, class scope
- **การแปลงชนิดข้อมูล** ⭐⭐
  1. ผ่านเครื่องหมาย `=` (widening — อัตโนมัติ เช่น `int → double`)
  2. ผ่านเมธอด (เช่น `Integer.parseInt()`)
  3. ผ่าน **casting** (narrowing — ตัดข้อมูลทิ้ง เช่น `(int) 3.9` = `3`)
- **Package** และคำสั่ง **`import`**

### บทที่ 4 — การเขียนโปรแกรมเชิงวัตถุเบื้องต้น

- **คลาส = แบบแปลน · อ็อบเจ็ค = สิ่งที่สร้างจากแบบแปลน** ⭐
- การสร้างอ็อบเจ็ค: `ClassName obj = new ClassName();`
- **ส่วนประกอบของคลาส** — attribute (field) + method
- **ค่าเริ่มต้นของ attribute** ⭐ — ตัวเลข = `0`, `boolean` = `false`, reference = `null`
  (ต่างจากตัวแปรใน method ที่**ต้องกำหนดค่าก่อนใช้**)
- **การส่งค่าเข้าเมธอด (argument)** ⭐⭐
  - **primitive → pass by value** (แก้ในเมธอดไม่กระทบตัวจริง)
  - **reference → ส่งสำเนาของที่อยู่** (แก้เนื้อในอ็อบเจ็คกระทบตัวจริง แต่ reassign ไม่กระทบ)
- การคืนค่าจากเมธอด (`return`)
- **UML class diagram** ⭐ — 3 ช่อง: ชื่อคลาส / attribute / method; `+` = public, `−` = private, `#` = protected
- **Abstract Data Type (ADT)** และการเทียบ OOP กับโครงสร้างข้อมูล

### บทที่ 5 — การห่อหุ้มและการสืบทอด

**Encapsulation**

- **Access modifier** ⭐⭐⭐

| Modifier | คลาสเดียวกัน | แพ็กเกจเดียวกัน | คลาสลูกต่างแพ็กเกจ | ทุกที่ |
|---|:---:|:---:|:---:|:---:|
| `private` | ✓ | ✗ | ✗ | ✗ |
| *(default)* | ✓ | ✓ | ✗ | ✗ |
| `protected` | ✓ | ✓ | ✓ | ✗ |
| `public` | ✓ | ✓ | ✓ | ✓ |

- แนวปฏิบัติ: attribute เป็น `private` แล้วเปิดผ่าน **setter** / **getter**
- ประโยชน์: ควบคุมความถูกต้องของข้อมูล ซ่อนรายละเอียดภายใน แก้ไขภายหลังได้โดยไม่กระทบผู้ใช้คลาส

**Inheritance**

- `class Child extends Parent`
- ความสัมพันธ์ **is-a** ⭐ — ถ้าพูดว่า "GradStudent เป็น Student" ได้ ค่อยสืบทอด
  (ถ้าเป็น **has-a** ให้ใช้ composition แทน)
- คลาสลูกเข้าถึงสมาชิก `private` ของแม่ไม่ได้ → แก้ด้วยการเปลี่ยนเป็น `protected` หรือใช้ getter/setter
- **คีย์เวิร์ด `super`** — เรียกสมาชิกของคลาสแม่
- ทุกคลาสใน Java สืบทอดจาก **`Object`** โดยปริยาย
- Java เป็น **single inheritance** (สืบทอดคลาสได้ทีละคลาส) แต่ implement interface ได้หลายตัว

### บทที่ 6 — Polymorphism

- **ประเภทของ polymorphism** ⭐⭐

| ประเภท | รูปแบบย่อย | ตัวอย่างใน Java |
|---|---|---|
| **Ad hoc** | Overloading | เมธอดชื่อเดียวกัน พารามิเตอร์ต่างกัน |
| | Coercion | การแปลงชนิดอัตโนมัติ (`int` → `double`) |
| **Universal** | Inclusion (subtype) | `Animal a = new Dog();` + overriding |
| | Parametric | Generic (`List<T>`) |

- **Method Overloading** ⭐ — ชื่อเดียวกัน **ต่างที่จำนวน/ชนิด/ลำดับพารามิเตอร์**
  - **เปลี่ยนแค่ชนิดที่คืนค่าไม่นับเป็น overloading** ⭐ (ข้อสอบชอบถาม)
- **Method Overriding** ⭐ — คลาสลูกเขียนเมธอดชื่อ/พารามิเตอร์/ชนิดคืนค่าเหมือนแม่ทับลงไป
  - สิทธิ์การเข้าถึงห้ามแคบลงกว่าของแม่
- **Static Binding vs Dynamic Binding** ⭐⭐⭐
  - static (compile-time) — overloading, `private`/`static`/`final` method
  - dynamic (runtime) — overriding; เรียกว่า **virtual method invocation**
  - `Animal a = new Dog(); a.speak();` → เรียกเวอร์ชันของ `Dog`
- **เมธอดสำคัญของคลาส `Object`** — `toString()`, `equals(Object o)`, `hashCode()`

### บทที่ 7 — Constructor, Abstract Class, Interface

**Constructor**

- ชื่อเดียวกับคลาส ไม่มีชนิดคืนค่า ทำงานตอน `new`
- **Default constructor** — คอมไพเลอร์สร้างให้เมื่อไม่ได้เขียนเอง (หายไปทันทีที่เขียน constructor เอง) ⭐
- **Overload constructor** ได้
- **`this()`** เรียก constructor ตัวอื่นในคลาสเดียวกัน · **`super()`** เรียก constructor ของคลาสแม่
  - ถ้าไม่เขียน Java แทรก `super()` ให้อัตโนมัติเป็นบรรทัดแรก ⭐
  - ปัญหาที่พบบ่อย: คลาสแม่ไม่มี default constructor → คลาสลูกคอมไพล์ไม่ผ่าน
    (แก้ได้ 2 ทาง: เรียก `super(args)` เอง หรือเพิ่ม default constructor ให้คลาสแม่)

**คีย์เวิร์ด `final`** ⭐

| ใช้กับ | ความหมาย |
|---|---|
| คลาส | ห้ามสืบทอด |
| เมธอด | ห้าม override |
| ตัวแปร | ค่าคงที่ กำหนดค่าได้ครั้งเดียว |

**Abstract Class vs Interface** ⭐⭐⭐

| | Abstract Class | Interface |
|---|---|---|
| สร้างอ็อบเจ็คโดยตรง | ไม่ได้ | ไม่ได้ |
| เมธอดที่ยังไม่มีบอดี้ | มีได้ (`abstract`) | เป็นค่าปริยาย |
| เมธอดที่มีบอดี้ | มีได้ | ได้ตั้งแต่ Java 8 (`default`, `static`) |
| attribute | มีได้ทุกแบบ | เป็น `public static final` เท่านั้น |
| การสืบทอด | `extends` ได้ 1 คลาส | `implements` ได้หลายตัว |
| ใช้เมื่อ | คลาสลูกมีสภาพร่วมกันชัดเจน (is-a) | กำหนดสัญญา/ความสามารถร่วม (can-do) |

### บทที่ 8 — GUI

- **Java Foundation Class (JFC)** ประกอบด้วย AWT, **Swing**, Java 2D, Accessibility
- **AWT vs Swing** ⭐ — AWT เป็น heavyweight ผูกกับ OS; Swing เป็น lightweight วาดเอง หน้าตาเหมือนกันทุกแพลตฟอร์ม
- โครงสร้างโปรแกรม GUI — **Container** (`JFrame`, `JPanel`) บรรจุ **Component**
- **`JFrame`** — `setTitle`, `setSize`, `setDefaultCloseOperation`, `setVisible`, `getContentPane()`
- **Layout manager** ⭐⭐

| Layout | พฤติกรรม |
|---|---|
| **BorderLayout** | 5 ตำแหน่ง — NORTH, SOUTH, EAST, WEST, CENTER (ค่าปริยายของ `JFrame`) |
| **FlowLayout** | เรียงจากซ้ายไปขวา ขึ้นบรรทัดใหม่เมื่อเต็ม (ค่าปริยายของ `JPanel`) |
| **GridLayout** | ตารางแถว × หลัก ทุกช่องขนาดเท่ากัน |
| **ผสม** | ซ้อน `JPanel` ที่ใช้ layout ต่างกัน |

- **Swing components** — `JButton`, `JLabel`, `JTextField`, `JTextArea`, `JCheckBox`,
  `JRadioButton` (+ `ButtonGroup`), `JComboBox`, `JList`, `JTable`
- **เมนู** — `JMenuBar` → `JMenu` → `JMenuItem` / `JCheckBoxMenuItem` / เมนูย่อยซ้อน
- **MDI** — `JDesktopPane` + `JInternalFrame`
- Look and Feel, `SwingUtilities.invokeLater()`, คลาส `Font` และ `Color`

### บทที่ 9 — Event Handling

- **องค์ประกอบ 3 ส่วน** ⭐ — **Event Source** (ปุ่ม/เมาส์) → **Event Object** → **Event Listener**
- **คลาส Event** — `ActionEvent`, `MouseEvent`, `KeyEvent`, `WindowEvent`, `ItemEvent`
- **ขั้นตอนจัดการเหตุการณ์**
  1. เขียนคลาสที่ `implements` อินเตอร์เฟส Listener
  2. เขียนเมธอดที่ต้อง override (เช่น `actionPerformed(ActionEvent e)`)
  3. **ลงทะเบียน** listener กับคอมโพเนนต์ (`btn.addActionListener(...)`)
- **4 รูปแบบการเขียน** ⭐⭐ — คลาสภายนอก · คลาสภายใน (inner class) · คลาสเดียวกัน (`this`) · **anonymous class**
- **Event Adapter** — คลาสนามธรรมที่ implement เมธอดว่างไว้ให้แล้ว (เช่น `MouseAdapter`)
  ใช้เมื่อไม่อยากเขียนเมธอดครบทุกตัวของ interface

### บทที่ 10 — Array, Collection API, Generic

**Array**
- ประกาศ `int[] a = new int[5];` หรือ `int[] a = {1,2,3};`
- array ของ primitive vs array ของอ็อบเจ็ค (ค่าเริ่มต้นเป็น `null` ต้อง `new` ทีละตัว) ⭐
- `a.length` (property ไม่ใช่เมธอด) · **`ArrayIndexOutOfBoundsException`**
- **อาร์เรย์หลายมิติ** และ **jagged array** (แต่ละแถวยาวไม่เท่ากัน)
- คลาสช่วย `java.util.Arrays` — `sort`, `fill`, `copyOf`, `toString`

**Collection API** ⭐⭐

| อินเตอร์เฟส | คลาสที่ใช้บ่อย | สมบัติ |
|---|---|---|
| **Set** | `HashSet`, `TreeSet` | สมาชิกไม่ซ้ำ ไม่รับประกันลำดับ (`TreeSet` เรียง) |
| **List** | `ArrayList`, `LinkedList`, `Vector` | มีลำดับ ซ้ำได้ เข้าถึงด้วย index |
| **Map** | `HashMap`, `TreeMap` | คู่ key-value; key ไม่ซ้ำ |

- **Iterator** / **ListIterator** / **Enumeration** (ตัวเก่า ใช้กับ `Vector`)
- `ArrayList` (เข้าถึงเร็ว) vs `LinkedList` (แทรก/ลบเร็ว)

**Generic**
- `List<String> list = new ArrayList<>();` — ตรวจชนิดตอนคอมไพล์ ไม่ต้อง cast ⭐
- เทียบ Generic กับ raw type และกับ array ของอ็อบเจ็ค
- `for (String s : list)` — enhanced for loop

### บทที่ 11 — Exception

- **ลำดับชั้น** ⭐⭐ — `Throwable` → `Error` (ระบบ กู้ไม่ได้) และ `Exception`
  - `Exception` → **checked** (ต้องจัดการ เช่น `IOException`) และ **unchecked / `RuntimeException`**
- **Exception ที่พบบ่อย** — `ArithmeticException` (หารด้วยศูนย์),
  `NumberFormatException`, `ArrayIndexOutOfBoundsException`, `NullPointerException`
- **`try…catch…finally`** ⭐⭐
  - `finally` ทำงานเสมอไม่ว่าจะเกิด exception หรือไม่ (ใช้ปิดทรัพยากร)
  - จับหลายชนิดได้ — เรียงจาก**เฉพาะเจาะจงไปกว้าง** (`catch (Exception e)` ต้องอยู่ท้ายสุด) ⭐
  - **multi-catch** `catch (A | B e)`
- **`try-with-resources`** — ปิดทรัพยากรอัตโนมัติ
- **`throw`** (โยนออกไปเอง) vs **`throws`** (ประกาศว่าเมธอดอาจโยน)
- Rethrowing และ wrapping; กฎของเมธอดที่ override ต้องไม่โยน checked exception กว้างกว่าของแม่
- **ทำไมใช้ try-catch แทน if** — แยกโค้ดหลักออกจากโค้ดจัดการข้อผิดพลาด อ่านง่ายกว่า

### บทที่ 12 — Stream / File I/O

- **คลาส `File`** — `exists()`, `getName()`, `length()`, `delete()`, `mkdir()`
- **แนวคิด stream** — ช่องทางการสื่อสารข้อมูล มีทิศทางเดียว
- **สองตระกูลหลัก** ⭐⭐

| | Byte Stream | Character Stream |
|---|---|---|
| คลาสฐาน | `InputStream` / `OutputStream` | `Reader` / `Writer` |
| ใช้กับ | ข้อมูลไบนารี (รูป เสียง) | ข้อความ |
| ตัวอย่าง | `FileInputStream`, `FileOutputStream` | `FileReader`, `FileWriter` |

- **Node stream vs Filter/High-level stream** — ต่อ stream หลายชั้นเพื่อเพิ่มความสามารถ
  - `DataInputStream` / `DataOutputStream` — อ่าน/เขียนชนิดข้อมูลพื้นฐาน
  - `BufferedReader`, `PrintWriter`
  - `InputStreamReader` / `OutputStreamWriter` — สะพานแปลง byte ↔ char
- **Serialization** ⭐ — คลาสต้อง `implements Serializable`; ใช้ `ObjectOutputStream` / `ObjectInputStream`
  - คีย์เวิร์ด **`transient`** — ไม่เก็บฟิลด์นั้นลง stream

### บทที่ 13 — Thread

- **Multitasking** ของ OS vs **multithreading** ในโปรแกรมเดียว
- **สองวิธีสร้างเธรด** ⭐⭐
  1. `implements Runnable` แล้วเขียน `run()` → `new Thread(obj).start()`
     — **แนะนำ** เพราะยัง extends คลาสอื่นได้
  2. `extends Thread` แล้ว override `run()`
- **`start()` ไม่ใช่ `run()`** ⭐ — เรียก `run()` ตรง ๆ จะทำงานในเธรดเดิม
- **วงจรชีวิตของเธรด** — New → Runnable → Running → Blocked/Waiting → Terminated
- เมธอดสำคัญ — `sleep()`, `join()`, `yield()`, `interrupt()`, `setPriority()`
- **Synchronization** ⭐⭐ — ปัญหา race condition เมื่อหลายเธรดแก้ข้อมูลเดียวกัน
  - คีย์เวิร์ด **`synchronized`** (เมธอด/บล็อก) ใช้ล็อกอ็อบเจ็ค
  - **`wait()` / `notify()` / `notifyAll()`** สำหรับประสานงานระหว่างเธรด
- **Deadlock** — เธรดต่างรอล็อกของกันและกัน

### บทที่ 14 — แนวคิดขั้นสูง

- **Dependency Injection** ⭐ — ส่ง dependency เข้ามาจากภายนอกแทนที่จะ `new` ในคลาสเอง
  → ทดสอบง่ายขึ้น ผูกกันน้อยลง (เทียบกับ *dependency non-injection*)
- **Sealed class / interface** — จำกัดว่าคลาสใดสืบทอดได้ (`permits`)
- **Inner class** — คลาสในคลาส (member / static nested / local / anonymous)
  และคุณสมบัติในการเข้าถึงสมาชิกของคลาสภายนอก

---

## 4. พิมพ์เขียวสำหรับสร้างสื่อต่อยอด

### 4.1 คลังข้อสอบ

| มิติ | ข้อกำหนด |
|---|---|
| กลางภาค | ไวยากรณ์ Java (บท 1–3) 25% · คลาส/อ็อบเจ็ค 20% · encapsulation/inheritance 20% · polymorphism 20% · constructor/abstract/interface 15% |
| ปลายภาค | GUI 15% · Event 15% · Array/Collection/Generic 20% · Exception 20% · File I/O 15% · Thread 15% |
| ชนิดข้อ | Trace output 30% · หาข้อผิดพลาดคอมไพล์/รันไทม์ 25% · เขียนคลาสตาม UML 25% · ปรนัยมโนทัศน์ 20% |

### 4.2 หลุมพรางที่ใช้ทำตัวลวงได้ดี ⭐

- `==` vs `.equals()` กับ `String`
- overloading ที่ต่างแค่ชนิดคืนค่า (คอมไพล์ไม่ผ่าน)
- static binding vs dynamic binding เมื่อเป็น `private`/`static`/`final`
- เขียน constructor เองแล้ว default constructor หายไป
- `super()` โดยปริยายกับคลาสแม่ที่ไม่มี default constructor
- ลำดับ `catch` จากกว้างไปแคบ (คอมไพล์ไม่ผ่าน)
- `finally` ทำงานแม้มี `return` ใน `try`
- เรียก `run()` แทน `start()`
- ค่าเริ่มต้นของ attribute (`0`/`null`) vs ตัวแปรใน method (ต้องกำหนดก่อนใช้)
- casting แบบ narrowing ทำให้ข้อมูลหาย
- `switch` ที่ลืม `break` แล้ว fall through

### 4.3 แบบฝึกหัด/Lab

| Lab | โจทย์ | สิ่งที่วัด |
|---|---|---|
| 01–03 | ไวยากรณ์พื้นฐาน, เงื่อนไข, ลูป | เขียนโปรแกรม console ได้ |
| 04–05 | สร้างคลาส `BankAccount` / `Student` พร้อม getter-setter | encapsulation |
| 06–07 | ลำดับชั้น `Shape` → `Circle`/`Rectangle` + abstract + interface | inheritance + polymorphism |
| 08–09 | เครื่องคิดเลข GUI ด้วย Swing + event | GUI + event handling |
| 10 | ระบบจัดการรายชื่อด้วย `ArrayList` / `HashMap` | Collection + Generic |
| 11–12 | อ่าน/เขียนไฟล์ CSV พร้อมจัดการ exception | I/O + exception |
| 13 | โปรแกรมนับเลขหลายเธรดพร้อม `synchronized` | thread |

**การตรวจอัตโนมัติ** — คอมไพล์ด้วย `javac` แล้วรัน JUnit เทียบผลลัพธ์ของเมธอดสาธารณะ;
โจทย์ console ตรวจด้วยการเทียบ stdout

### 4.4 ข้อสอบจำลอง

- **กลางภาค** — Trace output 6 ข้อ · หาบั๊ก 4 ข้อ · เขียนคลาสจาก UML 2 ข้อ · อธิบายมโนทัศน์ 2 ข้อ
- **ปลายภาค** — เพิ่มโจทย์ GUI (เขียนโค้ดสร้างหน้าจอตามภาพ) · Collection · exception · thread
- คลังมีข้อสอบจริง `OOP_Midterm_2023.pdf`, `OOP_Final_2023.pdf` และ `OOP_Midterm_MockExam.pdf`

---

## 5. แหล่งข้อมูลในคลัง

| ประเภท | จำนวน | หมายเหตุ |
|---|---|---|
| สไลด์บรรยาย | 32 ไฟล์ | มีทั้งชุด `Chapter00–13` และ `Week01–14` (เนื้อหาเดียวกัน คนละรอบปี) |
| ตำราประกอบ | `OOP_Lec_Java-Book.pdf` | |
| Lab | 21 ไฟล์ (Week01–12) | มีทั้งโจทย์และฉบับทำแล้ว |
| ข้อสอบเก่า | 7 ไฟล์ | midterm/final ปี 2023 + mock exam |
| ชีทสรุป | 5 ไฟล์ | `CheatSheet-2022`, `CheatSheet-2024`, `Summary-OOP-Midterm/Final` |
