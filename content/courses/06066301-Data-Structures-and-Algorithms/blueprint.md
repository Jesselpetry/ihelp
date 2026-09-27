# DSA — พิมพ์เขียวสำหรับสร้างสื่อ

> ไฟล์สำหรับคนสร้างเนื้อหา ไม่ถูก render ในเว็บ — ดู `docs/COURSE_OVERVIEW_STANDARD.md` §4
> ส่วนที่นักศึกษาอ่านอยู่ใน [`summary.md`](./summary.md)

## 1. คลังข้อสอบ

| มิติ | ข้อกำหนด |
|---|---|
| กลางภาค | Linked list 15% · Stack/Queue 20% · Binary tree 15% · BST 15% · Heap/Huffman 15% · AVL 10% · Graph 10% |
| ปลายภาค | Big-O 20% · Searching/Hashing 15% · Sorting 20% · Greedy 10% · Recursion 15% · D&C 10% · DP 10% |
| ชนิดข้อ | วาด/ไล่ขั้นตอน 45% · คำนวณ Big-O 20% · เขียน pseudocode 20% · ปรนัยมโนทัศน์ 15% |

## 2. แบบฝึกหัด

| หัวข้อ | เทมเพลตโจทย์ | วิธีตรวจ |
|---|---|---|
| Linked list | สุ่มลำดับ insert/delete → ถามสถานะลิสต์สุดท้าย | simulate ด้วยโค้ด |
| Infix → Postfix | สุ่มนิพจน์ 6–10 token | เทียบกับ shunting-yard |
| Tree traversal | สุ่ม BST จากลำดับ insert → ถาม pre/in/post/level order | simulate |
| BST deletion | สุ่มต้นไม้ + โหนดที่ลบ (บังคับให้เจอกรณี 2 ลูก) | simulate |
| AVL | สุ่มลำดับ insert ที่ทำให้เกิดครบทั้ง 4 กรณีหมุน | simulate |
| Heap | สุ่มอาเรย์ → build max-heap → ถามอาเรย์ผลลัพธ์ | simulate |
| Huffman | สุ่มความถี่อักขระ → ถามความยาวรหัสรวม | simulate |
| Big-O | สุ่มโครงลูปซ้อน → ถาม Big-O | สร้างจากเทมเพลตที่รู้คำตอบ |
| Sorting | สุ่มอาเรย์ 8 ตัว → ถามสถานะหลัง pass ที่ k | simulate |
| DP | สุ่มโจทย์ knapsack เล็ก (5 ของ, W ≤ 15) → ถามตาราง `dp` | simulate |

## 3. ข้อสอบจำลอง

- **กลางภาค** — 6 ข้อใหญ่: linked list 1 · stack (infix→postfix) 1 · tree traversal 1 ·
  BST insert/delete 1 · heap หรือ Huffman 1 · graph (matrix/list + DFS/BFS) 1
- **ปลายภาค** — 7 ข้อ: Big-O 1 · binary search trace 1 · hashing + collision 1 ·
  sorting trace 2 · greedy 1 · DP (knapsack หรือ LCS) 1
- ในคลังมีข้อสอบจริง `DSA_Midterm_2565-Term2.pdf` และ `DSA_Final_2023.pdf` ให้เทียบแนว

## 4. แหล่งที่มาในคลัง

| ประเภท | จำนวน | หมายเหตุ |
|---|---|---|
| สไลด์บรรยาย | 14 ไฟล์ (Week02–Week15) | ครบทุกบท มีลายมือจดในสไลด์หลายไฟล์ |
| แบบฝึกหัด + เฉลย | 36 ไฟล์ | มี `DSA_Ex_Solution-*` แยกตามบท — ใช้เป็นต้นแบบเฉลยได้ทันที |
| Posttest | Posttest 8–14 | แบบทดสอบหลังเรียนรายสัปดาห์ |
| การบ้าน | HW 05, 06, 09, 10, 13, 14 | มีฉบับทำแล้ว |
| ข้อสอบเก่า | 30 ไฟล์ | midterm/final แยกตามบทและตามปี |
| ชีทสรุป | `DSA_Sheet_Recap-Final.pdf` | |

- ต้นทาง: `kmitl-archive/archive/Y1-S2/Data-Structures-and-Algorithms`

## 5. ช่องว่างข้อมูล

- สัดส่วนคะแนนและข้อมูลภาคเรียน 2/2569
