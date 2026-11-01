import type { QuizQuestion } from "@/lib/quiz/quiz";

// ITF (06016402) final-exam practice bank — 60 items covering Week 08–15 of
// semester 1/2569. Written from the course week pages
// (content/courses/06016402-IT-Fundamentals/archive/week08.md … week15.md) and the
// 2569 Thai lecture summaries.
//
// Weighting follows a classmate's emphasis guidance (a student's opinion, not an
// announcement from the instructor): Week 11–13 count most (concepts, keywords and
// IP / subnet calculation), Week 14 less, and Week 8, 9, 10, 15 are keyword and
// definition matching. Chapter counts: W8 5 · W9 5 · W10 5 · W11 10 · W12 12 ·
// W13 10 · W14 7 · W15 6.
//
// This is NOT the real exam and none of these items is a past exam question — it is
// a practice bank written to drill the same topics. Each item carries
// `explanationMd` (why the answer is right and why every distractor is wrong), so
// the engine renders that once instead of four per-option notes.
export const ITF_FINAL_MOCK_EXAM: QuizQuestion[] = [
  {
    id: "itf-fin-001",
    kind: "mcq",
    prompt: { th: "ข้อใดเรียงลำดับชั้นของข้อมูล (data hierarchy) จากหน่วยเล็กที่สุดไปใหญ่ที่สุดได้ถูกต้อง?" },
    options: [
      {
        id: "a",
        label: { th: "character → record → field → file → database" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "b",
        label: { th: "character → field → record → file → database" },
        why: { th: "ตัวเลือกนี้ถูกต้อง — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "c",
        label: { th: "field → character → record → file → database" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "d",
        label: { th: "character → field → file → record → database" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
    ],
    correctId: "b",
    explanationMd: "**ข้อ B ถูกต้อง** — Character (1 byte) รวมกันเป็น **field** → field รวมกันเป็น **record** → record รวมกันเป็น **data file** → file รวมกันเป็น **database**\n\n**ตัวเลือกอื่นผิดเพราะ**\n- **A:** สลับ field กับ record — record ใหญ่กว่าเพราะเป็นกลุ่มของ field\n- **C:** character เป็นหน่วยเล็กที่สุด จึงต้องมาก่อน field\n- **D:** สลับ record กับ file — file คือกลุ่มของ record\n\n**จุดที่ต้องระวัง:** Field เป็นหน่วยเล็กที่สุดที่ **ผู้ใช้** เข้าถึงได้ ไม่ใช่ character",
    sourceRef: "Week 08 · ลำดับชั้นของข้อมูล",
    chapter: 8,
  },
  {
    id: "itf-fin-002",
    kind: "mcq",
    prompt: { th: "Primary key ในฐานข้อมูลคืออะไร?" },
    options: [
      {
        id: "a",
        label: { th: "ตัวเลขที่ต่อท้ายข้อมูลเพื่อตรวจสอบความถูกต้อง (check digit)" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "b",
        label: { th: "กลุ่มของ record ที่เกี่ยวข้องกันทั้งหมดใน data file หนึ่ง" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "c",
        label: { th: "กฎที่ใช้เทียบข้อมูลที่ป้อนเข้ามากับค่าที่ยอมรับได้ (validation rule)" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "d",
        label: { th: "field ที่มีค่าไม่ซ้ำกันในแต่ละ record ใช้ระบุ record นั้นได้" },
        why: { th: "ตัวเลือกนี้ถูกต้อง — ดูคำอธิบายเต็มด้านล่าง" },
      },
    ],
    correctId: "d",
    explanationMd: "**ข้อ D ถูกต้อง** — Record คือกลุ่ม field ที่เกี่ยวข้องกัน และ **primary key** คือ field ที่ไม่ซ้ำกันในแต่ละ record (เช่น รหัสนักศึกษา) ชนิดข้อมูล AutoNumber ให้ DBMS ใส่เลขไม่ซ้ำให้เอง จึงใช้เป็น primary key ได้สะดวก\n\n**ตัวเลือกอื่นผิดเพราะ**\n- **A:** check digit คือเลขที่ต่อท้าย primary key เพื่อตรวจความถูกต้อง ไม่ใช่ตัว primary key เอง\n- **B:** นั่นคือนิยามของ data file\n- **C:** นั่นคือ validation ไม่ใช่ primary key",
    sourceRef: "Week 08 · Primary key",
    chapter: 8,
  },
  {
    id: "itf-fin-003",
    kind: "mcq",
    prompt: { th: "ฐานข้อมูลตั้งกฎว่าช่อง “อายุ” ต้องมีค่าอยู่ระหว่าง 0–120 เท่านั้น เป็นการตรวจสอบข้อมูล (validation) แบบใด?" },
    options: [
      {
        id: "a",
        label: { th: "Range check" },
        why: { th: "ตัวเลือกนี้ถูกต้อง — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "b",
        label: { th: "Consistency check" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "c",
        label: { th: "Completeness check" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "d",
        label: { th: "Check digit" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
    ],
    correctId: "a",
    explanationMd: "**ข้อ A ถูกต้อง** — **Range check** ตรวจว่าตัวเลขอยู่ในช่วงที่กำหนด — ช่องอายุอยู่ในช่วง 0–120\n\n**ตัวเลือกอื่นผิดเพราะ**\n- **B:** Consistency ตรวจความสัมพันธ์ระหว่าง field ตั้งแต่ 2 ช่องขึ้นไป (เช่น วันเกิดกับอายุต้องสอดคล้องกัน) แต่โจทย์ดูแค่ช่องเดียว\n- **C:** Completeness ตรวจว่า field ที่บังคับต้องไม่ว่าง\n- **D:** Check digit คือเลขที่ต่อท้าย primary key เพื่อตรวจความถูกต้อง\n\n**จุดที่ต้องระวัง:** Consistency ดู **ความสัมพันธ์ระหว่าง field** · range ดูตัวเลขใน field เดียว",
    sourceRef: "Week 08 · Validation",
    chapter: 8,
  },
  {
    id: "itf-fin-004",
    kind: "mcq",
    prompt: { th: "ข้อใดคือจุดอ่อน 2 ข้อของ file processing system (ที่แต่ละแผนกมีไฟล์ของตัวเอง)?" },
    options: [
      {
        id: "a",
        label: { th: "ซับซ้อนกว่า และใช้ memory กับพลังประมวลผลมากกว่า" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "b",
        label: { th: "ข้อมูลเสี่ยงกว่า และซับซ้อนกว่า" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "c",
        label: { th: "redundant data (ข้อมูลซ้ำซ้อน) และ isolated data (ข้อมูลข้ามแผนกเข้าถึงยาก)" },
        why: { th: "ตัวเลือกนี้ถูกต้อง — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "d",
        label: { th: "ต้องมี DBA และ data dictionary ในการดูแลระบบ" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
    ],
    correctId: "c",
    explanationMd: "**ข้อ C ถูกต้อง** — File processing แยกไฟล์ตามแผนก จึงเกิด **redundant data** (เก็บซ้ำหลายที่) และ **isolated data** (แผนกอื่นเข้าถึงยาก) ต้องได้ทั้งสองคำ\n\n**ตัวเลือกอื่นผิดเพราะ**\n- **A:** เป็นข้อเสียของ **database approach** (ซับซ้อนกว่า ใช้ memory และพลังประมวลผลมากกว่า)\n- **B:** เป็นข้อเสียของ database approach (ข้อมูลเสี่ยงกว่า ซับซ้อนกว่า)\n- **D:** DBA และ data dictionary เป็นเครื่องมือของ DBMS/database approach ไม่ใช่จุดอ่อนของ file processing\n\n**จุดที่ต้องระวัง:** ข้อดีของ database approach คือลดความซ้ำซ้อน แชร์ข้อมูลได้ integrity ดีขึ้น — ตรงข้ามกับจุดอ่อนของ file processing",
    sourceRef: "Week 08 · File processing vs Database approach",
    chapter: 8,
  },
  {
    id: "itf-fin-005",
    kind: "mcq",
    prompt: { th: "ข้อใดจับคู่ชนิดของฐานข้อมูลกับงานที่เหมาะสมได้ถูกต้อง?" },
    options: [
      {
        id: "a",
        label: { th: "Multidimensional — data warehouse ที่วิเคราะห์ธุรกรรมย้อนหลัง" },
        why: { th: "ตัวเลือกนี้ถูกต้อง — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "b",
        label: { th: "Relational — สื่อ ภาพ เสียง วิดีโอ" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "c",
        label: { th: "Object-oriented — เงินเดือน บัญชี และใบแจ้งหนี้" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "d",
        label: { th: "Relational — data warehouse ที่ข้อมูลมีมากกว่า 2 มิติ" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
    ],
    correctId: "a",
    explanationMd: "**ข้อ A ถูกต้อง** — **Multidimensional** เก็บข้อมูลมากกว่า 2 มิติ เหมาะกับ **data warehouse**; **Relational** เก็บเป็นตาราง (แถว × คอลัมน์) เหมาะกับเงินเดือน บัญชี สต็อก; **Object-oriented** เก็บเป็น object เหมาะกับสื่อ ภาพ เสียง วิดีโอ\n\n**ตัวเลือกอื่นผิดเพราะ**\n- **B:** สื่อ ภาพ เสียง วิดีโอ เป็นงานของ object-oriented\n- **C:** เงินเดือน บัญชี ใบแจ้งหนี้ เป็นงานของ relational\n- **D:** Relational เก็บเป็นตาราง 2 มิติ ส่วนข้อมูลมากกว่า 2 มิติเป็นของ multidimensional\n\n**จุดที่ต้องระวัง:** Multidimensional ↔ data warehouse · object-oriented ↔ ไฟล์สื่อ · relational ↔ ตาราง",
    sourceRef: "Week 08 · Data model",
    chapter: 8,
  },
  {
    id: "itf-fin-006",
    kind: "mcq",
    prompt: { th: "การหมิ่นประมาทผู้อื่นด้วยการ “เขียน” โพสต์ลงสื่อสังคมออนไลน์ เรียกว่าอะไร?" },
    options: [
      {
        id: "a",
        label: { th: "Slander" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "b",
        label: { th: "Phishing" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "c",
        label: { th: "Libel" },
        why: { th: "ตัวเลือกนี้ถูกต้อง — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "d",
        label: { th: "Social engineering" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
    ],
    correctId: "c",
    explanationMd: "**ข้อ C ถูกต้อง** — **Defamation** (การหมิ่นประมาท) แบ่งเป็น **slander** (พูด) และ **libel** (เขียน) — โพสต์ข้อความจึงเป็น libel\n\n**ตัวเลือกอื่นผิดเพราะ**\n- **A:** slander คือการหมิ่นประมาทด้วยการ **พูด**\n- **B:** phishing คืออีเมลหน้าตาทางการที่หลอกเอาข้อมูลส่วนตัวหรือข้อมูลการเงิน\n- **D:** social engineering คือการหลอกเอาข้อมูลโดยอาศัยความไว้ใจของคน\n\n**จุดที่ต้องระวัง:** Slander = พูด · libel = เขียน",
    sourceRef: "Week 09 · Defamation: slander vs libel",
    chapter: 9,
  },
  {
    id: "itf-fin-007",
    kind: "mcq",
    prompt: { th: "สิ่งใดคือรหัสที่แนบไปกับข้อความอิเล็กทรอนิกส์เพื่อยืนยันตัวผู้ส่ง?" },
    options: [
      {
        id: "a",
        label: { th: "Digital certificate" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "b",
        label: { th: "Digital signature" },
        why: { th: "ตัวเลือกนี้ถูกต้อง — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "c",
        label: { th: "Encryption" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "d",
        label: { th: "Cookie" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
    ],
    correctId: "b",
    explanationMd: "**ข้อ B ถูกต้อง** — **Digital signature** คือรหัสเข้ารหัสที่แนบกับข้อความเพื่อยืนยันตัวผู้ส่ง\n\n**ตัวเลือกอื่นผิดเพราะ**\n- **A:** digital certificate คือใบรับรองว่าผู้ใช้หรือเว็บไซต์เป็นของจริง ไม่ใช่รหัสที่แนบกับข้อความ\n- **C:** encryption แปลงข้อมูลที่อ่านได้ให้เป็นรหัสเพื่อกันผู้ไม่มีสิทธิ์ ไม่ได้ยืนยันตัวผู้ส่ง\n- **D:** cookie คือไฟล์ข้อความเล็ก ๆ ที่เว็บเก็บไว้ในเครื่อง ใช้จำรหัสหรือติดตามการเข้าชม\n\n**จุดที่ต้องระวัง:** Digital **signature** ยืนยันตัวผู้ส่ง · digital **certificate** รับรองว่าผู้ใช้หรือเว็บเป็นของจริง",
    sourceRef: "Week 09 · Digital signature vs certificate",
    chapter: 9,
  },
  {
    id: "itf-fin-008",
    kind: "mcq",
    prompt: { th: "พ.ร.บ. ว่าด้วยการกระทำความผิดเกี่ยวกับคอมพิวเตอร์ ฉบับแรกประกาศใช้ในปี พ.ศ. ใด?" },
    options: [
      {
        id: "a",
        label: { th: "พ.ศ. 2560" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "b",
        label: { th: "พ.ศ. 2544" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "c",
        label: { th: "พ.ศ. 2562" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "d",
        label: { th: "พ.ศ. 2550" },
        why: { th: "ตัวเลือกนี้ถูกต้อง — ดูคำอธิบายเต็มด้านล่าง" },
      },
    ],
    correctId: "d",
    explanationMd: "**ข้อ D ถูกต้อง** — พ.ร.บ. ว่าด้วยการกระทำความผิดเกี่ยวกับคอมพิวเตอร์ ออกครั้งแรกปี **2550** และมีฉบับที่ 2 ในปี 2560\n\n**ตัวเลือกอื่นผิดเพราะ**\n- **A:** 2560 คือฉบับที่ 2 (ฉบับแก้ไข) ไม่ใช่ฉบับแรก\n- **B:** 2544 คือปีของ พ.ร.บ. ว่าด้วยธุรกรรมทางอิเล็กทรอนิกส์\n- **C:** 2562 คือปีของ PDPA และ พ.ร.บ. การรักษาความมั่นคงปลอดภัยไซเบอร์\n\n**จุดที่ต้องระวัง:** พ.ร.บ. คอมพิวเตอร์ฉบับแรกปี 2550 ไม่ใช่ 2560 · PDPA กับ พ.ร.บ. ไซเบอร์ออกปีเดียวกัน (2562) แต่คนละเรื่อง",
    sourceRef: "Week 09 · กฎหมายไอทีของไทย",
    chapter: 9,
  },
  {
    id: "itf-fin-009",
    kind: "mcq",
    prompt: { th: "หลักจริยธรรมข้อใดกล่าวว่า ผู้ที่ได้รับผลกระทบจากระบบต้องเข้าใจและยอมรับความเสี่ยงที่จะเกิดขึ้น?" },
    options: [
      {
        id: "a",
        label: { th: "Proportionality" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "b",
        label: { th: "Justice" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "c",
        label: { th: "Informed consent" },
        why: { th: "ตัวเลือกนี้ถูกต้อง — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "d",
        label: { th: "Minimized risk" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
    ],
    correctId: "c",
    explanationMd: "**ข้อ C ถูกต้อง** — **Informed consent** — ผู้ได้รับผลกระทบเข้าใจและยอมรับความเสี่ยง\n\n**ตัวเลือกอื่นผิดเพราะ**\n- **A:** proportionality — ประโยชน์ต้องมากกว่าโทษหรือความเสี่ยง\n- **B:** justice — ประโยชน์และภาระกระจายอย่างเป็นธรรม\n- **D:** minimized risk — แม้ผ่าน 3 ข้อแรกแล้วก็ต้องเลี่ยงความเสี่ยงที่ไม่จำเป็น",
    sourceRef: "Week 09 · หลักจริยธรรม 4 ข้อ",
    chapter: 9,
  },
  {
    id: "itf-fin-010",
    kind: "mcq",
    prompt: { th: "ภัยใดคือการซ่อนโปรแกรมร้ายไว้ในปุ่มหรือลิงก์บนเว็บไซต์ที่ผู้ใช้กดได้?" },
    options: [
      {
        id: "a",
        label: { th: "Clickjacking" },
        why: { th: "ตัวเลือกนี้ถูกต้อง — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "b",
        label: { th: "Phishing" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "c",
        label: { th: "Cookie" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "d",
        label: { th: "Spyware" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
    ],
    correctId: "a",
    explanationMd: "**ข้อ A ถูกต้อง** — **Clickjacking** ซ่อนโปรแกรมร้ายไว้ในสิ่งที่กดได้ เช่น ปุ่มหรือลิงก์บนเว็บ\n\n**ตัวเลือกอื่นผิดเพราะ**\n- **B:** phishing มาทางอีเมลที่หน้าตาเป็นทางการ เพื่อหลอกเอาข้อมูลส่วนตัวหรือการเงิน\n- **C:** cookie คือไฟล์ข้อความเล็ก ๆ ที่เว็บเก็บไว้ในเครื่อง ไม่ใช่โปรแกรมร้ายที่ซ่อนในปุ่ม\n- **D:** spyware แอบเก็บข้อมูลของผู้ใช้แล้วส่งออก ไม่ได้ซ่อนอยู่ในปุ่มหรือลิงก์โดยเฉพาะ\n\n**จุดที่ต้องระวัง:** Clickjacking ซ่อนในสิ่งที่กดได้ · phishing มาทางอีเมล",
    sourceRef: "Week 09 · ภัยด้านความเป็นส่วนตัว",
    chapter: 9,
  },
  {
    id: "itf-fin-011",
    kind: "mcq",
    prompt: { th: "ระบบสารสนเทศใดใช้เก็บและประมวลผลธุรกรรมประจำวัน เช่น การจองตั๋วเครื่องบินออนไลน์ โดยใช้ OLTP?" },
    options: [
      {
        id: "a",
        label: { th: "DSS (Decision Support System)" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "b",
        label: { th: "MIS (Management Information System)" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "c",
        label: { th: "CMS (Content Management System)" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "d",
        label: { th: "TPS (Transaction Processing System)" },
        why: { th: "ตัวเลือกนี้ถูกต้อง — ดูคำอธิบายเต็มด้านล่าง" },
      },
    ],
    correctId: "d",
    explanationMd: "**ข้อ D ถูกต้อง** — **TPS** เก็บและประมวลผลธุรกรรมประจำวัน และใช้ **OLTP**\n\n**ตัวเลือกอื่นผิดเพราะ**\n- **A:** DSS ช่วยวิเคราะห์เพื่อตัดสินใจ และใช้ **OLAP**\n- **B:** MIS ทำรายงานที่ถูกต้อง ทันเวลา ให้ผู้จัดการตัดสินใจและติดตามงาน\n- **C:** CMS ใช้เผยแพร่ แก้ไข จัดระเบียบ และเข้าถึงเอกสารหลายรูปแบบ\n\n**จุดที่ต้องระวัง:** TPS ↔ OLTP · DSS ↔ OLAP — ข้อสอบมักสลับคู่เป็นตัวลวง",
    sourceRef: "Week 10 · ระบบในองค์กร (TPS / OLTP)",
    chapter: 10,
  },
  {
    id: "itf-fin-012",
    kind: "mcq",
    prompt: { th: "ระบบใดเก็บความรู้ของผู้เชี่ยวชาญไว้ แล้วเลียนแบบการให้เหตุผลและการตัดสินใจของผู้เชี่ยวชาญนั้น?" },
    options: [
      {
        id: "a",
        label: { th: "DSS (Decision Support System)" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "b",
        label: { th: "Expert system" },
        why: { th: "ตัวเลือกนี้ถูกต้อง — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "c",
        label: { th: "MIS (Management Information System)" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "d",
        label: { th: "DMS (Document Management System)" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
    ],
    correctId: "b",
    explanationMd: "**ข้อ B ถูกต้อง** — **Expert system** เก็บความรู้ของผู้เชี่ยวชาญ แล้วเลียนแบบการให้เหตุผลและตัดสินใจ\n\n**ตัวเลือกอื่นผิดเพราะ**\n- **A:** DSS ช่วยผู้ใช้วิเคราะห์ข้อมูลภายในและภายนอกเพื่อตัดสินใจ ไม่ได้เลียนแบบผู้เชี่ยวชาญ\n- **C:** MIS ทำรายงานให้ผู้จัดการ\n- **D:** DMS เก็บและจัดการเอกสารของบริษัท\n\n**จุดที่ต้องระวัง:** MIS **ทำรายงาน** · DSS **ช่วยวิเคราะห์** · expert system **เลียนแบบผู้เชี่ยวชาญ**",
    sourceRef: "Week 10 · Expert system",
    chapter: 10,
  },
  {
    id: "itf-fin-013",
    kind: "mcq",
    prompt: { th: "ระบบใดเน้นเก็บและจัดการเอกสารของบริษัท โดยควบคุมสิทธิ์การเข้าถึง ติดตามเวอร์ชัน และค้นหาเอกสารได้?" },
    options: [
      {
        id: "a",
        label: { th: "CMS (Content Management System)" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "b",
        label: { th: "ERP (Enterprise Resource Planning)" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "c",
        label: { th: "TPS (Transaction Processing System)" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "d",
        label: { th: "DMS (Document Management System)" },
        why: { th: "ตัวเลือกนี้ถูกต้อง — ดูคำอธิบายเต็มด้านล่าง" },
      },
    ],
    correctId: "d",
    explanationMd: "**ข้อ D ถูกต้อง** — **DMS** เก็บและจัดการเอกสารของบริษัท พร้อมควบคุมสิทธิ์ ติดตามเวอร์ชัน และค้นหา\n\n**ตัวเลือกอื่นผิดเพราะ**\n- **A:** CMS เน้น **เผยแพร่** เนื้อหา — ใส่เนื้อหาผ่านหน้าเว็บ แก้ไข และจัดระเบียบเอกสารหลายรูปแบบ\n- **B:** ERP รวมการไหลของข้อมูลทั้งองค์กรเพื่อประสานงานทุกกิจกรรม\n- **C:** TPS เก็บและประมวลผลธุรกรรมประจำวัน\n\n**จุดที่ต้องระวัง:** CMS เน้นเผยแพร่เนื้อหา · DMS เน้นเก็บเอกสารพร้อมควบคุมเวอร์ชัน",
    sourceRef: "Week 10 · DMS vs CMS",
    chapter: 10,
  },
  {
    id: "itf-fin-014",
    kind: "mcq",
    prompt: { th: "ตำแหน่งงานใดมีหน้าที่ปรับเนื้อหาเว็บให้ขึ้นอันดับต้น ๆ ในผลการค้นหา?" },
    options: [
      {
        id: "a",
        label: { th: "SEO expert" },
        why: { th: "ตัวเลือกนี้ถูกต้อง — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "b",
        label: { th: "UX designer" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "c",
        label: { th: "Data scientist" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "d",
        label: { th: "Help desk specialist" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
    ],
    correctId: "a",
    explanationMd: "**ข้อ A ถูกต้อง** — **SEO expert** (อยู่ในกลุ่ม web marketing & social media) ดูแลให้เว็บขึ้นอันดับต้นของผลการค้นหา\n\n**ตัวเลือกอื่นผิดเพราะ**\n- **B:** UX designer ออกแบบประสบการณ์ของผู้ใช้ (อยู่กลุ่มเดียวกัน แต่ไม่ใช่งานจัดอันดับการค้นหา)\n- **C:** Data scientist อยู่กลุ่ม storage, retrieval & analysis — วิเคราะห์ข้อมูล\n- **D:** Help desk specialist อยู่กลุ่ม operations — ช่วยแก้ปัญหาให้ผู้ใช้",
    sourceRef: "Week 10 · อาชีพสายเทคโนโลยี",
    chapter: 10,
  },
  {
    id: "itf-fin-015",
    kind: "mcq",
    prompt: { th: "ข้อใดอธิบาย ERP (Enterprise Resource Planning) ได้ถูกต้อง?" },
    options: [
      {
        id: "a",
        label: { th: "ช่วยวิเคราะห์เพื่อตัดสินใจ โดยใช้ข้อมูลทั้งภายในและภายนอกองค์กร" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "b",
        label: { th: "เก็บและประมวลผลธุรกรรมประจำวันด้วย OLTP" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "c",
        label: { th: "รวมการไหลของข้อมูลทั้งองค์กร เพื่อประสานงานทุกกิจกรรมเข้าด้วยกัน" },
        why: { th: "ตัวเลือกนี้ถูกต้อง — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "d",
        label: { th: "ทำรายงานที่ถูกต้อง ทันเวลา ให้ผู้จัดการติดตามงาน" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
    ],
    correctId: "c",
    explanationMd: "**ข้อ C ถูกต้อง** — **ERP** รวมการไหลของข้อมูลทั้งองค์กรไว้ด้วยกัน เพื่อประสานงานทุกกิจกรรม\n\n**ตัวเลือกอื่นผิดเพราะ**\n- **A:** เป็นหน้าที่ของ DSS (ใช้ OLAP)\n- **B:** เป็นหน้าที่ของ TPS\n- **D:** เป็นหน้าที่ของ MIS",
    sourceRef: "Week 10 · ERP",
    chapter: 10,
  },
  {
    id: "itf-fin-016",
    kind: "mcq",
    prompt: { th: "ในโมเดล TCP/IP หน่วยข้อมูล (PDU) ของ transport layer เรียกว่าอะไร?" },
    options: [
      {
        id: "a",
        label: { th: "Message" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "b",
        label: { th: "Segment" },
        why: { th: "ตัวเลือกนี้ถูกต้อง — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "c",
        label: { th: "Datagram" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "d",
        label: { th: "Frame" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
    ],
    correctId: "b",
    explanationMd: "**ข้อ B ถูกต้อง** — หน่วยข้อมูลแต่ละชั้น: Application = message · **Transport = segment** · Network = datagram · Link = frame · Physical = bit\n\n**ตัวเลือกอื่นผิดเพราะ**\n- **A:** message คือหน่วยข้อมูลของ application layer\n- **C:** datagram คือหน่วยข้อมูลของ network layer\n- **D:** frame คือหน่วยข้อมูลของ link layer\n\n**จุดที่ต้องระวัง:** ท่อง 5 ชั้น: message → segment → datagram → frame → bit",
    sourceRef: "Week 11 · Protocol และ Encapsulation",
    chapter: 11,
  },
  {
    id: "itf-fin-017",
    kind: "mcq",
    prompt: { th: "เมื่อส่งข้อมูลจาก application ลงไปถึง physical layer หน่วยข้อมูลเปลี่ยนตามลำดับใด?" },
    options: [
      {
        id: "a",
        label: { th: "message → segment → datagram → frame → bit" },
        why: { th: "ตัวเลือกนี้ถูกต้อง — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "b",
        label: { th: "message → datagram → segment → frame → bit" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "c",
        label: { th: "segment → message → datagram → frame → bit" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "d",
        label: { th: "message → segment → frame → datagram → bit" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
    ],
    correctId: "a",
    explanationMd: "**ข้อ A ถูกต้อง** — แต่ละชั้นห่อข้อมูลของชั้นก่อนหน้าด้วย header ของตัวเอง (encapsulation): application สร้าง **message** → transport ห่อเป็น **segment** → network ห่อเป็น **datagram** → link ห่อเป็น **frame** → physical ส่งเป็น **bit**\n\n**ตัวเลือกอื่นผิดเพราะ**\n- **B:** สลับ segment กับ datagram — transport (segment) อยู่เหนือ network (datagram)\n- **C:** message อยู่ที่ชั้นบนสุด (application) ต้องมาก่อน segment\n- **D:** สลับ datagram กับ frame — network layer (datagram) อยู่เหนือ link layer (frame)",
    sourceRef: "Week 11 · Encapsulation",
    chapter: 11,
  },
  {
    id: "itf-fin-018",
    kind: "mcq",
    prompt: { th: "อุปกรณ์ใดต่อไปนี้ ไม่ใช่ end system?" },
    options: [
      {
        id: "a",
        label: { th: "เครื่องคอมพิวเตอร์ตั้งโต๊ะ" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "b",
        label: { th: "Web server" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "c",
        label: { th: "เซนเซอร์วัดสภาพแวดล้อมที่เชื่อมต่ออินเทอร์เน็ต" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "d",
        label: { th: "Link-layer switch" },
        why: { th: "ตัวเลือกนี้ถูกต้อง — ดูคำอธิบายเต็มด้านล่าง" },
      },
    ],
    correctId: "d",
    explanationMd: "**ข้อ D ถูกต้อง** — **End system (host)** คืออุปกรณ์ปลายทางที่รันแอปพลิเคชัน ทั้ง client และ server ส่วน **link-layer switch** และ router เป็น **packet switch** ที่แค่ส่งต่อ packet — แอปไม่ได้รันบน packet switch\n\n**ตัวเลือกอื่นผิดเพราะ**\n- **A:** desktop รันแอป จึงเป็น end system (client)\n- **B:** web server รันแอป จึงเป็น end system (server)\n- **C:** เซนเซอร์ที่ต่อเน็ตเป็น host รันซอฟต์แวร์ส่งข้อมูล จึงเป็น end system\n\n**จุดที่ต้องระวัง:** Web server **เป็น** end system — host ทุกเครื่องที่รันแอปคือ end system ไม่ว่าจะเป็น client หรือ server",
    sourceRef: "Week 11 · End system vs packet switch",
    chapter: 11,
  },
  {
    id: "itf-fin-019",
    kind: "mcq",
    prompt: { th: "ข้อใดอธิบาย cable internet (HFC) ได้ถูกต้อง?" },
    options: [
      {
        id: "a",
        label: { th: "ใช้สายโทรศัพท์เดิมที่ต่อตรงเฉพาะบ้านไปยังชุมสาย" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "b",
        label: { th: "ใช้ไฟเบอร์ลากเข้าถึงตัวบ้านโดยตรง" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "c",
        label: { th: "บ้านหลายหลังแชร์สายร่วมกันไปยัง cable headend และขาลงเร็วกว่าขาขึ้น (asymmetric)" },
        why: { th: "ตัวเลือกนี้ถูกต้อง — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "d",
        label: { th: "ใช้ DSLAM แยกสัญญาณข้อมูลออกจากสัญญาณเสียง" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
    ],
    correctId: "c",
    explanationMd: "**ข้อ C ถูกต้อง** — **Cable (HFC)** = hybrid fiber coax — บ้านหลายหลัง **แชร์** สายไปยัง cable headend และเป็น asymmetric (ขาลงเร็วกว่าขาขึ้น)\n\n**ตัวเลือกอื่นผิดเพราะ**\n- **A:** เป็นลักษณะของ **DSL** (สายเฉพาะบ้านไปชุมสาย)\n- **B:** นั่นคือ **FTTH** (fiber to the home)\n- **D:** DSLAM เป็นของ **DSL**\n\n**จุดที่ต้องระวัง:** DSL = สายเฉพาะ (dedicated) · cable = แชร์กับเพื่อนบ้าน",
    sourceRef: "Week 11 · Access network",
    chapter: 11,
  },
  {
    id: "itf-fin-020",
    kind: "mcq",
    prompt: { th: "สื่อส่งสัญญาณใดจัดเป็น unguided media?" },
    options: [
      {
        id: "a",
        label: { th: "Twisted pair" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "b",
        label: { th: "Radio เช่น Wi-Fi 4G/5G และดาวเทียม" },
        why: { th: "ตัวเลือกนี้ถูกต้อง — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "c",
        label: { th: "Coaxial cable" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "d",
        label: { th: "Fiber optic" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
    ],
    correctId: "b",
    explanationMd: "**ข้อ B ถูกต้อง** — **Unguided media** ส่งสัญญาณไปในอากาศ ได้แก่ radio — terrestrial microwave, Wi-Fi, 4G/5G, Bluetooth, satellite\n\n**ตัวเลือกอื่นผิดเพราะ**\n- **A:** twisted pair เป็น guided media (ในตัวกลางแข็ง)\n- **C:** coaxial เป็น guided media\n- **D:** fiber optic เป็น guided media (เร็ว error ต่ำ ไม่โดนสัญญาณรบกวนแม่เหล็กไฟฟ้า)\n\n**จุดที่ต้องระวัง:** Guided = ในสาย (copper, fiber) · unguided = ในอากาศ (radio)",
    sourceRef: "Week 11 · Guided vs unguided media",
    chapter: 11,
  },
  {
    id: "itf-fin-021",
    kind: "mcq",
    prompt: { th: "การที่ router ตัวหนึ่งย้าย packet จากพอร์ตขาเข้าไปยังพอร์ตขาออกตาม forwarding table เรียกว่าอะไร?" },
    options: [
      {
        id: "a",
        label: { th: "Routing" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "b",
        label: { th: "Handoff" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "c",
        label: { th: "Peering" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "d",
        label: { th: "Forwarding" },
        why: { th: "ตัวเลือกนี้ถูกต้อง — ดูคำอธิบายเต็มด้านล่าง" },
      },
    ],
    correctId: "d",
    explanationMd: "**ข้อ D ถูกต้อง** — **Forwarding** คืองานของ router ตัวเดียว (local action) ที่ย้าย packet จากขาเข้าไปขาออกตาม forwarding table\n\n**ตัวเลือกอื่นผิดเพราะ**\n- **A:** **Routing** คือการหาเส้นทางทั้งหมดจากต้นทางถึงปลายทางด้วย routing algorithm (global action)\n- **B:** handoff คือการที่อุปกรณ์ไร้สายย้ายไปเชื่อมกับ base station ตัวใหม่ (Week 13)\n- **C:** peering คือการเชื่อมสอง ISP เพื่อแลก traffic กันโดยตรง\n\n**จุดที่ต้องระวัง:** Routing = วางเส้นทางทั้งหมด · forwarding = ส่งต่อที่ router ตัวเดียว",
    sourceRef: "Week 11 · Routing vs Forwarding",
    chapter: 11,
  },
  {
    id: "itf-fin-022",
    kind: "mcq",
    prompt: { th: "มาตรฐานของ Internet เช่น TCP/IP ออกในรูปเอกสารใด และโดยองค์กรใด?" },
    options: [
      {
        id: "a",
        label: { th: "RFC (Request for Comments) โดย IETF" },
        why: { th: "ตัวเลือกนี้ถูกต้อง — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "b",
        label: { th: "RFC โดย IEEE" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "c",
        label: { th: "RFC โดย W3C" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "d",
        label: { th: "IEEE 802 โดย IETF" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
    ],
    correctId: "a",
    explanationMd: "**ข้อ A ถูกต้อง** — มาตรฐาน Internet ออกโดย **IETF** (Internet Engineering Task Force) ในรูปเอกสาร **RFC**\n\n**ตัวเลือกอื่นผิดเพราะ**\n- **B:** IEEE เป็นผู้กำหนดมาตรฐานตระกูล 802 เช่น 802.11 ไม่ใช่ RFC\n- **C:** W3C ดูแลมาตรฐานของ HTML/เว็บ (Week 14)\n- **D:** สลับองค์กร — 802.x เป็นมาตรฐานของ IEEE ไม่ใช่ IETF\n\n**จุดที่ต้องระวัง:** RFC ออกโดย **IETF** ไม่ใช่ IEEE",
    sourceRef: "Week 11 · IETF และ RFC",
    chapter: 11,
  },
  {
    id: "itf-fin-023",
    kind: "mcq",
    prompt: { th: "Host ส่ง packet ขนาด 8,000 บิตเข้าลิงก์ที่มีอัตราส่ง 2 Mbps (2,000,000 bit/s) ใช้เวลาส่ง (transmission delay) เท่าใด?" },
    options: [
      {
        id: "a",
        label: { th: "16 ms" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "b",
        label: { th: "4 ms" },
        why: { th: "ตัวเลือกนี้ถูกต้อง — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "c",
        label: { th: "40 ms" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "d",
        label: { th: "250 s" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
    ],
    correctId: "b",
    explanationMd: "**ข้อ B ถูกต้อง** — Transmission delay = L / R = 8,000 / 2,000,000 = 0.004 s = **4 ms**\n\n**ตัวเลือกอื่นผิดเพราะ**\n- **A:** 16 ms ได้จากการคูณ L กับ R ผิดวิธี — สูตรคือหาร ไม่ใช่คูณ\n- **C:** 40 ms คลาดเคลื่อน 10 เท่า — 8,000 / 2,000,000 = 0.004 s ไม่ใช่ 0.04 s\n- **D:** 250 มาจากการกลับสูตรเป็น R / L (= 250) ซึ่งไม่ใช่หน่วยเวลา\n\n**จุดที่ต้องระวัง:** ระวังหน่วย: 1 Mbps = 1,000,000 bit/s และ 0.001 s = 1 ms",
    sourceRef: "Week 11 · Transmission delay",
    chapter: 11,
  },
  {
    id: "itf-fin-024",
    kind: "mcq",
    prompt: { th: "Wireshark ใช้อ่านและบันทึกทุก packet ที่ผ่านสื่อแบบ broadcast เช่น Wi-Fi จัดเป็นเทคนิคใด?" },
    options: [
      {
        id: "a",
        label: { th: "IP spoofing" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "b",
        label: { th: "DoS" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "c",
        label: { th: "Packet sniffing" },
        why: { th: "ตัวเลือกนี้ถูกต้อง — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "d",
        label: { th: "Firewall" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
    ],
    correctId: "c",
    explanationMd: "**ข้อ C ถูกต้อง** — **Packet sniffing** คือการอ่านทุก packet ที่ผ่านสื่อแบบ broadcast เช่น Wi-Fi โดยมี Wireshark เป็นเครื่องมือ\n\n**ตัวเลือกอื่นผิดเพราะ**\n- **A:** IP spoofing คือการปลอม source address ของ packet\n- **B:** DoS คือการถล่มทรัพยากรด้วย traffic ปลอมจนผู้ใช้จริงใช้ไม่ได้\n- **D:** firewall เป็นแนวป้องกัน ไม่ใช่การโจมตี\n\n**จุดที่ต้องระวัง:** Sniffing = ดักอ่าน · spoofing = ปลอมที่อยู่ต้นทาง · DoS = ถล่มจนใช้งานไม่ได้",
    sourceRef: "Week 11 · Network security (sniffing)",
    chapter: 11,
  },
  {
    id: "itf-fin-025",
    kind: "mcq",
    prompt: { th: "ข้อใดอธิบายการโจมตีแบบ DoS (denial of service) ได้ถูกต้อง?" },
    options: [
      {
        id: "a",
        label: { th: "อ่านทุก packet ที่ผ่านสื่อแบบ broadcast" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "b",
        label: { th: "ปลอม source address ของ packet" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "c",
        label: { th: "ส่ง traffic ปลอมถล่มทรัพยากร (เช่น server, bandwidth) จนผู้ใช้จริงใช้งานไม่ได้ มักใช้ botnet" },
        why: { th: "ตัวเลือกนี้ถูกต้อง — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "d",
        label: { th: "แปลงข้อมูลที่อ่านได้ให้เป็นรหัส เพื่อกันผู้ไม่มีสิทธิ์" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
    ],
    correctId: "c",
    explanationMd: "**ข้อ C ถูกต้อง** — **DoS** ถล่มทรัพยากรด้วย bogus traffic จนผู้ใช้จริงใช้ไม่ได้ — มักทำโดยยึด host จำนวนมากเป็น botnet แล้วสั่งส่ง packet ไปยังเป้าหมายพร้อมกัน\n\n**ตัวเลือกอื่นผิดเพราะ**\n- **A:** นั่นคือ packet sniffing\n- **B:** นั่นคือ IP spoofing\n- **D:** นั่นคือ encryption ซึ่งเป็นแนวป้องกัน (confidentiality) ไม่ใช่การโจมตี",
    sourceRef: "Week 11 · Network security (DoS)",
    chapter: 11,
  },
  {
    id: "itf-fin-026",
    kind: "mcq",
    prompt: { th: "เครื่องหนึ่งมี IP 172.20.77.150 และ subnet mask 255.255.255.192 (/26) Network ID ของเครื่องนี้คือข้อใด?" },
    options: [
      {
        id: "a",
        label: { th: "172.20.77.0" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "b",
        label: { th: "172.20.77.128" },
        why: { th: "ตัวเลือกนี้ถูกต้อง — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "c",
        label: { th: "172.20.77.64" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "d",
        label: { th: "172.20.77.192" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
    ],
    correctId: "b",
    explanationMd: "**ข้อ B ถูกต้อง** — AND ทีละบิต: สามไบต์แรกของ mask เป็น 255 จึงคงเดิม = 172.20.77 · ไบต์สุดท้าย 150 = `10010110` AND 192 = `11000000` → `10000000` = **128**\n\nวิธีลัด: block size = 256 − 192 = 64 → วงเริ่มที่ 0, 64, 128, 192 และ 150 อยู่ในช่วง 128–191 → Network ID = **172.20.77.128**\n\n**ตัวเลือกอื่นผิดเพราะ**\n- **A:** จะได้ .0 ก็ต่อเมื่อ mask เป็น 255.255.255.0 (/24) เท่านั้น\n- **C:** วงที่เริ่ม .64 ครอบคลุม .64–.127 แต่ 150 ไม่อยู่ในช่วงนั้น\n- **D:** วงที่เริ่ม .192 ครอบคลุม .192–.255 แต่ 150 ต่ำกว่าช่วงนี้\n\n**จุดที่ต้องระวัง:** ต้องใช้ mask ของโจทย์ — ห้ามเผลอใช้ default mask ของ class",
    sourceRef: "Week 12 · IPv4 — Network ID",
    chapter: 12,
  },
  {
    id: "itf-fin-027",
    kind: "mcq",
    prompt: { th: "เครื่องหนึ่งมี IP 10.5.9.45/27 (subnet mask 255.255.255.224) Broadcast address ของวงนี้คือข้อใด?" },
    options: [
      {
        id: "a",
        label: { th: "10.5.9.63" },
        why: { th: "ตัวเลือกนี้ถูกต้อง — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "b",
        label: { th: "10.5.9.47" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "c",
        label: { th: "10.5.9.62" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "d",
        label: { th: "10.5.9.255" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
    ],
    correctId: "a",
    explanationMd: "**ข้อ A ถูกต้อง** — /27 → block size = 256 − 224 = 32 → วงเริ่มที่ 0, 32, 64, … และ 45 อยู่ในช่วง 32–63\nไบต์สุดท้ายของ 45 = `00101101` AND 224 = `11100000` → `00100000` = 32 → Network ID = 10.5.9.32\nBroadcast = ตั้ง host bits (5 บิต) เป็น 1 ทั้งหมด → `00111111` = **63** → **10.5.9.63**\n\n**ตัวเลือกอื่นผิดเพราะ**\n- **B:** .47 คือ broadcast เมื่อ mask เป็น /28 (block 16 → วง 32–47) ไม่ใช่ /27\n- **C:** .62 คือ host สุดท้ายที่ใช้ได้ (broadcast − 1) ไม่ใช่ broadcast\n- **D:** .255 คือ broadcast ของวง /24\n\n**จุดที่ต้องระวัง:** Broadcast = host bits เป็น 1 ทั้งหมด · host ที่ใช้ได้ = network+1 … broadcast−1",
    sourceRef: "Week 12 · IPv4 — Broadcast address",
    chapter: 12,
  },
  {
    id: "itf-fin-028",
    kind: "mcq",
    prompt: { th: "บริษัทต้องการแบ่งวงเครือข่ายให้รองรับ host อย่างน้อย 50 เครื่อง โดยให้วงมีขนาดเล็กที่สุดที่ยังเพียงพอ ควรใช้ prefix ใด?" },
    options: [
      {
        id: "a",
        label: { th: "/25 (host ที่ใช้ได้ 126 ตัว)" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "b",
        label: { th: "/27 (host ที่ใช้ได้ 30 ตัว)" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "c",
        label: { th: "/28 (host ที่ใช้ได้ 14 ตัว)" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "d",
        label: { th: "/26 (host ที่ใช้ได้ 62 ตัว)" },
        why: { th: "ตัวเลือกนี้ถูกต้อง — ดูคำอธิบายเต็มด้านล่าง" },
      },
    ],
    correctId: "d",
    explanationMd: "**ข้อ D ถูกต้อง** — จำนวน host ที่ใช้ได้ = 2^h − 2 (h = host bits): h = 5 → 30 (ไม่พอ) · h = 6 → 62 (พอ) → host bits = 6 → prefix = 32 − 6 = **/26**\n\n**ตัวเลือกอื่นผิดเพราะ**\n- **A:** /25 มี 2^7 − 2 = 126 host รองรับ 50 เครื่องได้ แต่ใหญ่เกินจำเป็น — โจทย์ให้เลือกวงเล็กที่สุดที่พอ\n- **B:** /27 มี 2^5 − 2 = 30 host น้อยกว่า 50\n- **C:** /28 มี 2^4 − 2 = 14 host น้อยกว่า 50\n\n**จุดที่ต้องระวัง:** ลบ 2 เสมอ เพราะ host ทั้งหมดเป็น 0 = network address และทั้งหมดเป็น 1 = broadcast",
    sourceRef: "Week 12 · IPv4 — จำนวน host ที่ใช้ได้",
    chapter: 12,
  },
  {
    id: "itf-fin-029",
    kind: "mcq",
    prompt: { th: "นำเครือข่าย 192.168.20.0/24 มาแบ่งเป็นวงย่อยด้วย mask /26 จะได้กี่ subnet และแต่ละ subnet มี host ที่ใช้ได้กี่ตัว?" },
    options: [
      {
        id: "a",
        label: { th: "2 subnet · แต่ละ subnet ใช้ได้ 126 host" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "b",
        label: { th: "4 subnet · แต่ละ subnet ใช้ได้ 62 host" },
        why: { th: "ตัวเลือกนี้ถูกต้อง — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "c",
        label: { th: "4 subnet · แต่ละ subnet ใช้ได้ 64 host" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "d",
        label: { th: "8 subnet · แต่ละ subnet ใช้ได้ 30 host" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
    ],
    correctId: "b",
    explanationMd: "**ข้อ B ถูกต้อง** — จาก /24 เป็น /26 ยืมบิต host มาเป็นบิต subnet 2 บิต → 2² = **4 subnet** (192.168.20.0, .64, .128, .192) · เหลือ host bits 6 บิต → block size 64 → ใช้ได้ 64 − 2 = **62**\n\n**ตัวเลือกอื่นผิดเพราะ**\n- **A:** 2 subnet · 126 host เป็นผลของการยืม 1 บิต (/25)\n- **C:** ลืมหัก 2 (network address และ broadcast) — 64 คือขนาด block ไม่ใช่จำนวน host ที่ใช้ได้\n- **D:** 8 subnet · 30 host เป็นผลของการยืม 3 บิต (/27)\n\n**จุดที่ต้องระวัง:** จำนวน subnet = 2^(บิตที่ยืม) · block size = 256 − ไบต์ของ mask",
    sourceRef: "Week 12 · Subnetting — จำนวน subnet",
    chapter: 12,
  },
  {
    id: "itf-fin-030",
    kind: "mcq",
    prompt: { th: "วงเครือข่าย 172.16.8.192/26 มีช่วง IP ที่กำหนดให้ host ใช้งานได้ตรงกับข้อใด?" },
    options: [
      {
        id: "a",
        label: { th: "172.16.8.192 – 172.16.8.255" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "b",
        label: { th: "172.16.8.193 – 172.16.8.255" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "c",
        label: { th: "172.16.8.193 – 172.16.8.254" },
        why: { th: "ตัวเลือกนี้ถูกต้อง — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "d",
        label: { th: "172.16.8.192 – 172.16.8.254" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
    ],
    correctId: "c",
    explanationMd: "**ข้อ C ถูกต้อง** — /26 → block size 64 → วงนี้คือ .192–.255 (192 = 3 × 64) · Network address = .192 · Broadcast = .255 → host ใช้ได้ **.193 – .254** (62 ตัว)\n\n**ตัวเลือกอื่นผิดเพราะ**\n- **A:** รวม .192 (network address) และ .255 (broadcast) ซึ่งกำหนดให้ host ไม่ได้\n- **B:** รวม .255 ซึ่งเป็น broadcast\n- **D:** รวม .192 ซึ่งเป็น network address\n\n**จุดที่ต้องระวัง:** ตัวแรกของวงคือชื่อวง ตัวสุดท้ายคือ broadcast",
    sourceRef: "Week 12 · Subnetting — ช่วง host ที่ใช้ได้",
    chapter: 12,
  },
  {
    id: "itf-fin-031",
    kind: "mcq",
    prompt: { th: "ข้อใดจับคู่ IP address กับ class ได้ถูกต้อง?" },
    options: [
      {
        id: "a",
        label: { th: "10.1.1.1 — Class B" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "b",
        label: { th: "130.61.22.204 — Class C" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "c",
        label: { th: "200.10.5.9 — Class A" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "d",
        label: { th: "239.1.2.3 — Class D (multicast)" },
        why: { th: "ตัวเลือกนี้ถูกต้อง — ดูคำอธิบายเต็มด้านล่าง" },
      },
    ],
    correctId: "d",
    explanationMd: "**ข้อ D ถูกต้อง** — ดูไบต์แรก: A = 0–127 · B = 128–191 · C = 192–223 · **D = 224–239 (multicast)** · E = 240–255 → 239 อยู่ใน Class D\n\n**ตัวเลือกอื่นผิดเพราะ**\n- **A:** 10 อยู่ในช่วง 0–127 จึงเป็น Class A\n- **B:** 130 อยู่ในช่วง 128–191 จึงเป็น Class B\n- **C:** 200 อยู่ในช่วง 192–223 จึงเป็น Class C",
    sourceRef: "Week 12 · Class ของ IPv4",
    chapter: 12,
  },
  {
    id: "itf-fin-032",
    kind: "mcq",
    prompt: { th: "ข้อใดเป็น private IP address (ตามช่วง RFC 1918)?" },
    options: [
      {
        id: "a",
        label: { th: "172.31.200.5" },
        why: { th: "ตัวเลือกนี้ถูกต้อง — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "b",
        label: { th: "172.32.0.9" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "c",
        label: { th: "192.169.1.1" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "d",
        label: { th: "11.0.0.1" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
    ],
    correctId: "a",
    explanationMd: "**ข้อ A ถูกต้อง** — Private IP: **10.0.0.0–10.255.255.255** · **172.16.0.0–172.31.255.255** · **192.168.0.0–192.168.255.255** → 172.31.200.5 อยู่ในช่วง 172.16–172.31\n\n**ตัวเลือกอื่นผิดเพราะ**\n- **B:** 172.32 พ้นช่วง 172.16–172.31 จึงเป็น public\n- **C:** ต้องเป็น 192.168.x.x — 192.169 เป็น public\n- **D:** private ของ class A มีแค่ 10.x.x.x — 11.x.x.x เป็น public\n\n**จุดที่ต้องระวัง:** 172.**16**–172.**31** เท่านั้นที่เป็น private ของ class B",
    sourceRef: "Week 12 · Private vs Public IP",
    chapter: 12,
  },
  {
    id: "itf-fin-033",
    kind: "mcq",
    prompt: { th: "ข้อใดคือจำนวน host ที่ใช้งานได้ต่อ network ของ Class B (default mask 255.255.0.0 หรือ /16)?" },
    options: [
      {
        id: "a",
        label: { th: "65,536" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "b",
        label: { th: "16,777,214" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "c",
        label: { th: "65,534" },
        why: { th: "ตัวเลือกนี้ถูกต้อง — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "d",
        label: { th: "254" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
    ],
    correctId: "c",
    explanationMd: "**ข้อ C ถูกต้อง** — Class B มี host bits 16 บิต → 2¹⁶ − 2 = 65,536 − 2 = **65,534**\n\n**ตัวเลือกอื่นผิดเพราะ**\n- **A:** 65,536 คือ 2¹⁶ โดยยังไม่หัก network address กับ broadcast\n- **B:** 16,777,214 = 2²⁴ − 2 คือ Class A\n- **D:** 254 = 2⁸ − 2 คือ Class C\n\n**จุดที่ต้องระวัง:** Class A /8 → 2²⁴−2 · Class B /16 → 2¹⁶−2 · Class C /24 → 2⁸−2 = 254",
    sourceRef: "Week 12 · Class B — host ที่ใช้ได้",
    chapter: 12,
  },
  {
    id: "itf-fin-034",
    kind: "mcq",
    prompt: { th: "Address ที่ network ID เป็นของวงนั้น แต่ host ID เป็น 1 ทั้งหมด (เช่น 130.61.255.255 ในวง 130.61.0.0/16) เรียกว่าอะไร?" },
    options: [
      {
        id: "a",
        label: { th: "Network address" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "b",
        label: { th: "Limited broadcast" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "c",
        label: { th: "Loopback address" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "d",
        label: { th: "Directed broadcast" },
        why: { th: "ตัวเลือกนี้ถูกต้อง — ดูคำอธิบายเต็มด้านล่าง" },
      },
    ],
    correctId: "d",
    explanationMd: "**ข้อ D ถูกต้อง** — network ID ของวง + host ID เป็น 1 ทั้งหมด = **directed broadcast** (ส่งถึงทุก host ในวงนั้น)\n\n**ตัวเลือกอื่นผิดเพราะ**\n- **A:** network address คือ host ID เป็น 0 ทั้งหมด ใช้เป็นชื่อวง\n- **B:** limited broadcast คือ network และ host เป็น 1 ทั้งหมด (255.255.255.255) ใช้ในวงของตัวเอง\n- **C:** loopback คือ network 127 ใช้ทดสอบเครื่องตัวเอง",
    sourceRef: "Week 12 · ประเภทของ address",
    chapter: 12,
  },
  {
    id: "itf-fin-035",
    kind: "mcq",
    prompt: { th: "อุปกรณ์ใดเรียนรู้ตาราง MAC address เพื่อกรองว่าจะส่ง frame ออกพอร์ตใด?" },
    options: [
      {
        id: "a",
        label: { th: "Bridge / layer-2 switch" },
        why: { th: "ตัวเลือกนี้ถูกต้อง — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "b",
        label: { th: "Hub" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "c",
        label: { th: "Repeater" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "d",
        label: { th: "Router" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
    ],
    correctId: "a",
    explanationMd: "**ข้อ A ถูกต้อง** — **Bridge / layer-2 switch** ดู MAC address และเรียนรู้ bridge table แล้วกรองว่าจะส่งไปพอร์ตไหน\n\n**ตัวเลือกอื่นผิดเพราะ**\n- **B:** hub ส่งต่อทุก frame ออกทุกพอร์ตโดยไม่กรอง\n- **C:** repeater เป็น regenerator ของสัญญาณ ไม่กรอง frame\n- **D:** router ใช้ IP address ในการหาเส้นทาง (layer 3) ไม่ได้ใช้ MAC เรียนรู้พอร์ต\n\n**จุดที่ต้องระวัง:** Hub **ไม่กรอง** · switch กรองด้วย MAC · router ใช้ IP",
    sourceRef: "Week 12 · อุปกรณ์เชื่อมต่อ",
    chapter: 12,
  },
  {
    id: "itf-fin-036",
    kind: "mcq",
    prompt: { th: "ข้อใดอธิบาย CSMA/CD ของ Ethernet (มีสาย) ได้ถูกต้อง?" },
    options: [
      {
        id: "a",
        label: { th: "ตรวจจับการชนด้วยการรอ ACK จากผู้รับ ถ้าไม่ได้รับถือว่าชน" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "b",
        label: { th: "ฟังช่องก่อนส่ง และตรวจจับการชนได้ขณะกำลังส่ง ถ้าชนจะรอด้วย back-off แล้วส่งใหม่" },
        why: { th: "ตัวเลือกนี้ถูกต้อง — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "c",
        label: { th: "ส่งได้เฉพาะเครื่องที่ถือ token ซึ่งส่งต่อกันเป็นวง" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "d",
        label: { th: "แบ่งช่องสัญญาณให้แต่ละเครื่องด้วยรหัส chipping sequence" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
    ],
    correctId: "b",
    explanationMd: "**ข้อ B ถูกต้อง** — **CSMA/CD** = listen before talk + collision detection: เครื่องฟังตัวกลางก่อนส่งและยังฟังต่อขณะส่ง ถ้าตรวจพบการชนก็ส่งใหม่ โดยรอเวลาสุ่มที่เรียกว่า **back-off**\n\n**ตัวเลือกอื่นผิดเพราะ**\n- **A:** การรอ ACK เป็นวิธีของ **CSMA/CA** (802.11) ที่ตรวจจับการชนเองขณะส่งไม่ได้ ไม่ใช่ CSMA/CD\n- **C:** นั่นคือ token passing\n- **D:** นั่นคือ CDMA (การแบ่งช่องสัญญาณด้วยรหัส)\n\n**จุดที่ต้องระวัง:** Ethernet = CSMA/CD (ตรวจจับการชน) · Wi-Fi = CSMA/CA (หลีกเลี่ยงการชน + ACK)",
    sourceRef: "Week 12 · Multiple access: CSMA/CD",
    chapter: 12,
  },
  {
    id: "itf-fin-037",
    kind: "mcq",
    prompt: { th: "ถ้าต่อคอมพิวเตอร์ 6 เครื่องเป็น mesh topology (ทุกเครื่องต่อตรงถึงกันทุกเครื่อง) จะต้องใช้สายกี่เส้น?" },
    options: [
      {
        id: "a",
        label: { th: "15 เส้น" },
        why: { th: "ตัวเลือกนี้ถูกต้อง — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "b",
        label: { th: "30 เส้น" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "c",
        label: { th: "36 เส้น" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "d",
        label: { th: "21 เส้น" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
    ],
    correctId: "a",
    explanationMd: "**ข้อ A ถูกต้อง** — Mesh ใช้ n(n−1)/2 เส้น → 6 × 5 / 2 = **15**\n\n**ตัวเลือกอื่นผิดเพราะ**\n- **B:** 30 = n(n−1) นับแต่ละเส้นสองครั้ง (ไป-กลับ)\n- **C:** 36 = n² นับรวมการต่อเข้าหาตัวเอง\n- **D:** 21 = n(n+1)/2 สูตรผิด\n\n**จุดที่ต้องระวัง:** Mesh ทนทานแต่ใช้สายเยอะและแพง",
    sourceRef: "Week 12 · Mesh topology",
    chapter: 12,
  },
  {
    id: "itf-fin-038",
    kind: "mcq",
    prompt: { th: "ข้อใดจับคู่ศัพท์เครือข่ายไร้สายกับความหมายได้ถูกต้อง?" },
    options: [
      {
        id: "a",
        label: { th: "SSID — หมายเลขประจำอุปกรณ์ที่ไม่ซ้ำกันบนโลก" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "b",
        label: { th: "BSS — เครือข่ายส่วนบุคคลระยะใกล้ เช่น Bluetooth" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "c",
        label: { th: "802.15 — เครือข่ายส่วนบุคคล (PAN) ระยะใกล้ อัตราต่ำ เช่น Bluetooth" },
        why: { th: "ตัวเลือกนี้ถูกต้อง — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "d",
        label: { th: "AP — host ไร้สายที่เคลื่อนที่ได้ เช่น smartphone" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
    ],
    correctId: "c",
    explanationMd: "**ข้อ C ถูกต้อง** — **802.15** คือ personal area network (PAN) สื่อสารระยะใกล้ อัตราต่ำ เช่น Bluetooth\n\n**ตัวเลือกอื่นผิดเพราะ**\n- **A:** หมายเลขประจำอุปกรณ์ที่ไม่ซ้ำกันคือ **MAC address** ส่วน **SSID** คือชื่อ Wi-Fi ที่ AP ประกาศ\n- **B:** **BSS** (basic service set) คือหน่วยพื้นฐานของ 802.11 ประกอบด้วย host + AP\n- **D:** **AP** (access point) คือ base station ของ 802.11 ที่ต่อกับเครือข่ายมีสาย ส่วนเครื่องที่เคลื่อนที่ได้คือ wireless host\n\n**จุดที่ต้องระวัง:** Base station ต่อกับเครือข่ายมีสาย ส่งต่อ packet ให้ host ในพื้นที่ — เสาสัญญาณมือถือและ AP ของ 802.11 ถือเป็น base station",
    sourceRef: "Week 13 · องค์ประกอบ/ศัพท์ของเครือข่ายไร้สาย",
    chapter: 13,
  },
  {
    id: "itf-fin-039",
    kind: "mcq",
    prompt: { th: "ข้อใดเปรียบเทียบ infrastructure mode กับ ad hoc mode ได้ถูกต้อง?" },
    options: [
      {
        id: "a",
        label: { th: "Infrastructure ไม่ต้องมี base station · Ad hoc ต้องมี base station" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "b",
        label: { th: "ทั้งสองโหมดต้องมี AP ต่อกับเครือข่ายมีสายเสมอ" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "c",
        label: { th: "Ad hoc คือการย้ายการเชื่อมต่อจาก base station ตัวเก่าไปตัวใหม่ · Infrastructure คือการเข้ารหัสสัญญาณ" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "d",
        label: { th: "Infrastructure ต้องมี base station (เช่น AP) ที่ต่อกับเครือข่ายมีสาย · Ad hoc ไม่มี base station แต่ node จัดเครือข่ายกันเอง" },
        why: { th: "ตัวเลือกนี้ถูกต้อง — ดูคำอธิบายเต็มด้านล่าง" },
      },
    ],
    correctId: "d",
    explanationMd: "**ข้อ D ถูกต้อง** — **Infrastructure**: host ต่อผ่าน base station เข้าเครือข่ายมีสาย · **Ad hoc**: ไม่มี base station, node จัดเครือข่ายกันเอง เช่น MANET, VANET, Bluetooth\n\n**ตัวเลือกอื่นผิดเพราะ**\n- **A:** สลับกัน — infrastructure ต้องมี base station ส่วน ad hoc ไม่มี\n- **B:** ad hoc ไม่มี AP/base station จึงไม่ต่อเครือข่ายมีสายผ่านตัวกลาง\n- **C:** การย้ายไป base station ตัวใหม่เรียกว่า handoff ไม่ใช่นิยามของ ad hoc\n\n**จุดที่ต้องระวัง:** Infrastructure mode ต้องมี base station · ad hoc ไม่มี",
    sourceRef: "Week 13 · Infrastructure vs Ad hoc",
    chapter: 13,
  },
  {
    id: "itf-fin-040",
    kind: "mcq",
    prompt: { th: "ผู้ใช้เดินจากพื้นที่ของ base station ตัวเดิมไปยังพื้นที่ของตัวใหม่ แล้วอุปกรณ์สลับไปเชื่อมกับ base station ตัวใหม่ได้ต่อเนื่อง เรียกกระบวนการนี้ว่าอะไร?" },
    options: [
      {
        id: "a",
        label: { th: "Multipath" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "b",
        label: { th: "Handoff" },
        why: { th: "ตัวเลือกนี้ถูกต้อง — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "c",
        label: { th: "Path loss" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "d",
        label: { th: "Hidden terminal" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
    ],
    correctId: "b",
    explanationMd: "**ข้อ B ถูกต้อง** — การย้ายจาก base station ตัวหนึ่งไปอีกตัวเรียกว่า **handoff** (เช่น มือถือสลับเสาสัญญาณ)\n\n**ตัวเลือกอื่นผิดเพราะ**\n- **A:** multipath คือสัญญาณสะท้อนวัตถุแล้วมาถึงปลายทางไม่พร้อมกัน\n- **C:** path loss คือสัญญาณอ่อนลงตามระยะและความถี่\n- **D:** hidden terminal คือสองเครื่องที่ไม่ได้ยินกันแต่ส่งชนกันที่ผู้รับ",
    sourceRef: "Week 13 · Handoff",
    chapter: 13,
  },
  {
    id: "itf-fin-041",
    kind: "mcq",
    prompt: { th: "เครื่อง A กับ C ต่างได้ยิน AP (B) แต่ไม่ได้ยินกันเอง จึงส่งข้อมูลพร้อมกันและชนกันที่ B โดยไม่รู้ตัว ปัญหานี้คืออะไร และแก้ด้วยอะไร?" },
    options: [
      {
        id: "a",
        label: { th: "Hidden terminal problem — แก้ด้วยการเพิ่มกำลังส่งของ A และ C" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "b",
        label: { th: "Multipath — แก้ด้วย RTS/CTS" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "c",
        label: { th: "Hidden terminal problem — แก้ด้วยการเปลี่ยนไปใช้ CSMA/CD" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "d",
        label: { th: "Hidden terminal problem — แก้ด้วย RTS/CTS (ส่งคำขอจองช่องก่อน แล้ว AP ตอบ CTS ให้ทุกเครื่องได้ยิน)" },
        why: { th: "ตัวเลือกนี้ถูกต้อง — ดูคำอธิบายเต็มด้านล่าง" },
      },
    ],
    correctId: "d",
    explanationMd: "**ข้อ D ถูกต้อง** — A และ C ไม่ได้ยินกัน จึงไม่รู้ว่าอีกฝ่ายกำลังส่ง ทำให้ชนกันที่ B (**hidden terminal**) · **RTS/CTS**: ผู้ส่งส่ง request-to-send สั้น ๆ จองช่อง → AP ตอบ clear-to-send ที่ทุกเครื่องได้ยิน → เครื่องอื่นเลื่อนการส่ง\n\n**ตัวเลือกอื่นผิดเพราะ**\n- **A:** การเพิ่มกำลังส่งไม่ใช่วิธีแก้ — แถมเปลืองแบตเตอรี่\n- **B:** multipath คือสัญญาณสะท้อนมาถึงไม่พร้อมกัน เป็นคนละปัญหากับ hidden terminal\n- **C:** CSMA/CD เป็นของ Ethernet (มีสาย) และผู้ส่งไร้สายตรวจจับการชนเองไม่ได้\n\n**จุดที่ต้องระวัง:** ปัญหาคือชนกันที่ **B** (ผู้รับ) — ไม่ใช่ A ต้องส่งผ่าน B ไป C",
    sourceRef: "Week 13 · Hidden terminal และ RTS/CTS",
    chapter: 13,
  },
  {
    id: "itf-fin-042",
    kind: "mcq",
    prompt: { th: "เหตุใด 802.11 (Wi-Fi) จึงให้ผู้รับตอบ ACK และใช้ CSMA/CA แทน CSMA/CD?" },
    options: [
      {
        id: "a",
        label: { th: "เพราะผู้ส่งไร้สายตรวจจับการชนขณะส่งเองไม่ได้ จึงหลีกเลี่ยงการชนและให้ผู้รับตอบ ACK หลัง SIFS" },
        why: { th: "ตัวเลือกนี้ถูกต้อง — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "b",
        label: { th: "เพราะ ACK ช่วยให้ CSMA/CD ตรวจจับการชนได้เร็วขึ้นบนอากาศ" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "c",
        label: { th: "เพราะ ACK ใช้แบ่งช่องความถี่ให้แต่ละเครื่อง (FDMA)" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "d",
        label: { th: "เพราะ ACK ใช้ขอ IP address จาก AP" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
    ],
    correctId: "a",
    explanationMd: "**ข้อ A ถูกต้อง** — 802.11 ใช้ **CSMA/CA**: ผู้ส่งฟังช่องว่างนาน DIFS แล้วจึงส่ง และผู้รับตอบ **ACK** หลัง **SIFS** เพราะผู้ส่งตรวจจับการชนเองไม่ได้\n\n**ตัวเลือกอื่นผิดเพราะ**\n- **B:** 802.11 ไม่ใช้ CSMA/CD — CSMA/CD เป็นของ Ethernet ที่ตรวจจับการชนขณะส่ง\n- **C:** ACK ไม่เกี่ยวกับการแบ่งความถี่\n- **D:** การขอ IP address ใช้ DHCP หลัง association\n\n**จุดที่ต้องระวัง:** Wireless ใช้ **CSMA/CA** (หลีกเลี่ยงการชน) · Ethernet ใช้ **CSMA/CD** (ตรวจจับการชน)",
    sourceRef: "Week 13 · CSMA/CA และ ACK",
    chapter: 13,
  },
  {
    id: "itf-fin-043",
    kind: "mcq",
    prompt: { th: "ใน CDMA (code division multiple access) หลายเครื่องส่งพร้อมกันบนความถี่เดียวกันได้อย่างไร?" },
    options: [
      {
        id: "a",
        label: { th: "แต่ละเครื่องได้ช่วงความถี่ของตัวเอง" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "b",
        label: { th: "แต่ละเครื่องมี chipping sequence (code) ของตัวเอง ถ้า code ตั้งฉากกัน (orthogonal) ผู้รับ decode แยกข้อมูลของแต่ละเครื่องได้" },
        why: { th: "ตัวเลือกนี้ถูกต้อง — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "c",
        label: { th: "แต่ละเครื่องได้ time slot ของตัวเอง" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "d",
        label: { th: "เครื่องที่ถือ token เท่านั้นที่ส่งได้" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
    ],
    correctId: "b",
    explanationMd: "**ข้อ B ถูกต้อง** — CDMA อยู่ในกลุ่ม **channel partitioning**: ทุกเครื่องใช้ความถี่เดียวกัน แต่แต่ละเครื่องมี **chipping sequence** เฉพาะตัว — encode = ข้อมูล × code, decode = inner product กับ code\n\n**ตัวเลือกอื่นผิดเพราะ**\n- **A:** นั่นคือ FDMA (แบ่งตามความถี่)\n- **C:** นั่นคือ TDMA (แบ่งตามเวลา)\n- **D:** นั่นคือ token passing (ใช้บนโครงสร้างแบบ ring)\n\n**จุดที่ต้องระวัง:** 802.11 (Wi-Fi) ใช้ CSMA/CA — CDMA ไม่ใช่วิธีเข้าถึงช่องของ Wi-Fi",
    sourceRef: "Week 13 · CDMA",
    chapter: 13,
  },
  {
    id: "itf-fin-044",
    kind: "mcq",
    prompt: { th: "ถ้าเพิ่มกำลังส่งของอุปกรณ์ไร้สาย จะเกิดผลอย่างไร?" },
    options: [
      {
        id: "a",
        label: { th: "SNR ลดลง และ BER เพิ่มขึ้น" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "b",
        label: { th: "SNR สูงขึ้น และ BER ลดลง โดยไม่มีข้อเสียใด ๆ" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "c",
        label: { th: "SNR สูงขึ้น และ BER ลดลง แต่เปลืองแบตเตอรี่มากขึ้น" },
        why: { th: "ตัวเลือกนี้ถูกต้อง — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "d",
        label: { th: "SNR ไม่เปลี่ยน แต่ coverage area ลดลง" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
    ],
    correctId: "c",
    explanationMd: "**ข้อ C ถูกต้อง** — SNR (signal-to-noise ratio) สูง = แยกสัญญาณจากสัญญาณรบกวนได้ง่าย เพิ่มกำลังส่ง → SNR สูงขึ้น → BER (bit error rate) ลดลง แต่ **เปลืองแบตเตอรี่**\n\n**ตัวเลือกอื่นผิดเพราะ**\n- **A:** ตรงข้ามกับความจริง — กำลังส่งมากขึ้นทำให้สัญญาณเด่นกว่า noise\n- **B:** มีข้อเสียคือเปลืองแบตเตอรี่ ซึ่งสำคัญกับ mobile device\n- **D:** กำลังส่งมีผลต่อสัดส่วนสัญญาณต่อ noise (SNR) โดยตรง",
    sourceRef: "Week 13 · SNR และ BER",
    chapter: 13,
  },
  {
    id: "itf-fin-045",
    kind: "mcq",
    prompt: { th: "ข้อใดเปรียบเทียบย่านความถี่ 2.4 GHz กับ 5 GHz ของ Wi-Fi ได้ถูกต้อง?" },
    options: [
      {
        id: "a",
        label: { th: "5 GHz ส่งได้ไกลกว่า เพราะความถี่สูงกว่า" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "b",
        label: { th: "2.4 GHz ส่งได้ไกลกว่า (path loss น้อยกว่า) แต่ใช้ร่วมกับอุปกรณ์อื่น จึงถูกรบกวนง่ายกว่า" },
        why: { th: "ตัวเลือกนี้ถูกต้อง — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "c",
        label: { th: "ทั้งสองย่านส่งได้ไกลเท่ากัน ต่างกันเฉพาะหมายเลขช่องสัญญาณ" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "d",
        label: { th: "ยิ่งความถี่สูง path loss ยิ่งน้อย จึงควรย้ายไป 5 GHz เมื่ออยู่ไกล AP" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
    ],
    correctId: "b",
    explanationMd: "**ข้อ B ถูกต้อง** — ยิ่งความถี่สูง สัญญาณยิ่งอ่อนตามระยะ (path loss มาก) → 5 GHz ครอบคลุมได้ใกล้กว่า · 2.4 GHz ไกลกว่า แต่เป็นความถี่มาตรฐานที่ใช้ร่วมกับอุปกรณ์อื่น (interference)\n\n**ตัวเลือกอื่นผิดเพราะ**\n- **A:** ตรงข้าม — ความถี่สูงทำให้ส่งได้ใกล้ลง\n- **C:** ความถี่ส่งผลต่อระยะ — ไม่ใช่แค่เลขช่อง\n- **D:** ความถี่สูง path loss มาก ไม่ใช่น้อย — อยู่ไกล AP ควรใช้ 2.4 GHz\n\n**จุดที่ต้องระวัง:** ความถี่สูง → ไปได้ใกล้ · ความถี่ต่ำ → ไปได้ไกล",
    sourceRef: "Week 13 · 2.4 GHz vs 5 GHz",
    chapter: 13,
  },
  {
    id: "itf-fin-046",
    kind: "mcq",
    prompt: { th: "มาตรฐาน IEEE 802.11 รุ่นใดทำงานที่ย่านความถี่ 5 GHz เท่านั้น?" },
    options: [
      {
        id: "a",
        label: { th: "802.11b" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "b",
        label: { th: "802.11g" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "c",
        label: { th: "802.11ac (Wi-Fi 5)" },
        why: { th: "ตัวเลือกนี้ถูกต้อง — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "d",
        label: { th: "802.11n (Wi-Fi 4)" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
    ],
    correctId: "c",
    explanationMd: "**ข้อ C ถูกต้อง** — **802.11ac (Wi-Fi 5)** ปี 2013 อัตราสูงสุด 3.47 Gbps ใช้ 5 GHz เท่านั้น\n\n**ตัวเลือกอื่นผิดเพราะ**\n- **A:** 802.11b ใช้ 2.4 GHz (11 Mbps)\n- **B:** 802.11g ใช้ 2.4 GHz (54 Mbps)\n- **D:** 802.11n ใช้ได้ทั้ง 2.4 และ 5 GHz จึงไม่ใช่ 5 GHz เท่านั้น\n\n**จุดที่ต้องระวัง:** ทุกรุ่น 802.11 ใช้ CSMA/CA · 802.11ax (Wi-Fi 6) ใช้ได้ทั้ง 2.4/5 GHz",
    sourceRef: "Week 13 · มาตรฐาน IEEE 802.11",
    chapter: 13,
  },
  {
    id: "itf-fin-047",
    kind: "mcq",
    prompt: { th: "หลังจากที่ host เลือก AP และยืนยันตัวตน (เช่น กรอกรหัส Wi-Fi) แล้ว host ขอรับ IP address ผ่านโปรโตคอลใด?" },
    options: [
      {
        id: "a",
        label: { th: "DNS" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "b",
        label: { th: "NAT" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "c",
        label: { th: "ICMP" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "d",
        label: { th: "DHCP" },
        why: { th: "ตัวเลือกนี้ถูกต้อง — ดูคำอธิบายเต็มด้านล่าง" },
      },
    ],
    correctId: "d",
    explanationMd: "**ข้อ D ถูกต้อง** — ขั้นตอน association: host สแกนหา AP (ฟัง beacon frame ที่ระบุ SSID หรือส่ง probe) → เลือก AP → ยืนยันตัวตน → ขอ IP ผ่าน **DHCP** เพื่ออยู่ใน subnet เดียวกับ AP\n\n**ตัวเลือกอื่นผิดเพราะ**\n- **A:** DNS แปลงชื่อโดเมนเป็น IP address\n- **B:** NAT แปลง private IP เป็น public IP เพื่อออกอินเทอร์เน็ต\n- **C:** ICMP ใช้ใน ping เพื่อทดสอบการเข้าถึง",
    sourceRef: "Week 13 · Association และ DHCP",
    chapter: 13,
  },
  {
    id: "itf-fin-048",
    kind: "mcq",
    prompt: { th: "ข้อใดอธิบาย dynamic web ได้ถูกต้อง?" },
    options: [
      {
        id: "a",
        label: { th: "เชื่อมต่อฐานข้อมูลหรือ API และโต้ตอบกับผู้ใช้ได้แบบ real-time (เรียกว่า web app)" },
        why: { th: "ตัวเลือกนี้ถูกต้อง — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "b",
        label: { th: "ไม่มี backend แสดงไฟล์ที่เขียนไว้ล่วงหน้าให้ทุกคนเห็นเหมือนกัน" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "c",
        label: { th: "ใช้เฉพาะ HTML และ CSS โดยไม่มี JavaScript" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "d",
        label: { th: "ทำงานได้เฉพาะบน Node.js เท่านั้น" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
    ],
    correctId: "a",
    explanationMd: "**ข้อ A ถูกต้อง** — **Dynamic web** เชื่อมต่อฐานข้อมูลหรือ API และโต้ตอบกับผู้ใช้ได้ (web app) ส่วน **static web** ไม่มี backend แสดงเนื้อหาตามไฟล์ที่เตรียมไว้ (website)\n\n**ตัวเลือกอื่นผิดเพราะ**\n- **B:** นั่นคือ static web\n- **C:** dynamic web ไม่ได้ห้ามใช้ JavaScript — ตัวชี้ขาดคือมี backend/ฐานข้อมูลและโต้ตอบกับผู้ใช้\n- **D:** Node.js เป็นตัวเลือกหนึ่งของ backend เท่านั้น ไม่ใช่นิยามของ dynamic web",
    sourceRef: "Week 14 · Static vs Dynamic web",
    chapter: 14,
  },
  {
    id: "itf-fin-049",
    kind: "mcq",
    prompt: { th: "ข้อใดอธิบาย Single Page Application (SPA) เมื่อเทียบกับ Server-Side Rendering (SSR) ได้ถูกต้อง?" },
    options: [
      {
        id: "a",
        label: { th: "SPA ให้ server สร้าง HTML ทั้งหน้าส่งมาใหม่ทุกครั้งที่เปลี่ยนหน้า" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "b",
        label: { th: "SPA ใช้ได้เฉพาะ static web ที่ไม่มี JavaScript" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "c",
        label: { th: "SPA กับ SSR ทำงานเหมือนกันทุกประการ ต่างกันแค่ชื่อเรียก" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "d",
        label: { th: "SPA โหลดโครงหน้าและ JavaScript ครั้งแรกครั้งเดียว แล้วขอเฉพาะข้อมูล (เช่น JSON ผ่าน AJAX) มาอัปเดตเฉพาะจุดโดยไม่ reload ทั้งหน้า" },
        why: { th: "ตัวเลือกนี้ถูกต้อง — ดูคำอธิบายเต็มด้านล่าง" },
      },
    ],
    correctId: "d",
    explanationMd: "**ข้อ D ถูกต้อง** — **SPA**: โหลดโครงและ JS ครั้งแรกครั้งเดียว หลังจากนั้นขอเฉพาะ data (JSON) ผ่าน AJAX → อัปเดตเฉพาะจุด ไม่ reload ทั้งหน้า · **SSR**: server ส่ง HTML พร้อมข้อมูลมาให้ และเมื่อเปลี่ยนหน้าต้อง reload ใหม่ทั้งหน้า\n\n**ตัวเลือกอื่นผิดเพราะ**\n- **A:** นั่นคือลักษณะของ SSR/หน้าเว็บแบบดั้งเดิม\n- **B:** SPA พึ่ง JavaScript เป็นหลัก\n- **C:** สองแนวทางต่างกันที่ว่าส่ง HTML ทั้งหน้าหรือส่งเฉพาะข้อมูล\n\n**จุดที่ต้องระวัง:** SSR = ส่ง HTML ทั้งหน้า (reload เมื่อเปลี่ยนหน้า) · SPA = ส่งเฉพาะ data (ไม่ reload)",
    sourceRef: "Week 14 · SPA vs SSR",
    chapter: 14,
  },
  {
    id: "itf-fin-050",
    kind: "mcq",
    prompt: { th: "ข้อใดอธิบายบทบาทของ HTML, CSS และ JavaScript ได้ถูกต้อง?" },
    options: [
      {
        id: "a",
        label: { th: "HTML กำหนดสีและเลย์เอาต์ · CSS กำหนดโครงสร้าง · JavaScript ทำให้โต้ตอบได้" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "b",
        label: { th: "HTML กำหนดโครงสร้างหน้า · CSS กำหนดสี ฟอนต์ เลย์เอาต์ · JavaScript ทำให้หน้าเว็บโต้ตอบได้" },
        why: { th: "ตัวเลือกนี้ถูกต้อง — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "c",
        label: { th: "HTML ทำให้หน้าเว็บโต้ตอบ · CSS กำหนดโครงสร้าง · JavaScript กำหนดสี" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "d",
        label: { th: "HTML เป็นภาษาโปรแกรม · JavaScript เป็น markup language" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
    ],
    correctId: "b",
    explanationMd: "**ข้อ B ถูกต้อง** — เปรียบกับบ้าน: **HTML** = โครงสร้าง (tag) · **CSS** = ทาสี ตกแต่ง เลย์เอาต์ · **JavaScript** = ระบบที่ทำให้บ้านโต้ตอบได้ (เป็นภาษาโปรแกรมที่ browser รันได้)\n\n**ตัวเลือกอื่นผิดเพราะ**\n- **A:** สลับบทบาทของ HTML กับ CSS\n- **C:** สลับบทบาทของทั้งสามอย่าง\n- **D:** สลับชนิด — HTML เป็น markup language ส่วน JavaScript เป็นภาษาโปรแกรม\n\n**จุดที่ต้องระวัง:** HTML เป็น markup language ไม่ใช่ภาษาโปรแกรม",
    sourceRef: "Week 14 · บทบาทของ HTML / CSS / JavaScript",
    chapter: 14,
  },
  {
    id: "itf-fin-051",
    kind: "mcq",
    prompt: { th: "ใน browser ส่วนใดทำหน้าที่แปลงโค้ด HTML ให้เป็น DOM (tree ของ node)?" },
    options: [
      {
        id: "a",
        label: { th: "CSS parser" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "b",
        label: { th: "JS runtime" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "c",
        label: { th: "HTML parser" },
        why: { th: "ตัวเลือกนี้ถูกต้อง — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "d",
        label: { th: "Web server" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
    ],
    correctId: "c",
    explanationMd: "**ข้อ C ถูกต้อง** — **HTML parser** แปลงโค้ด HTML เป็น **DOM** · **CSS parser** สร้าง **CSSOM** · **JS runtime** รัน JavaScript ที่แก้ HTML และ CSS ได้\n\n**ตัวเลือกอื่นผิดเพราะ**\n- **A:** CSS parser สร้าง CSSOM ไม่ใช่ DOM\n- **B:** JS runtime รันโค้ด JavaScript (และแก้ DOM ได้) แต่ไม่ได้สร้าง DOM จาก HTML\n- **D:** web server อยู่ฝั่ง server ทำหน้าที่ตอบกลับไฟล์ ไม่ใช่ส่วนของ browser",
    sourceRef: "Week 14 · DOM และ browser",
    chapter: 14,
  },
  {
    id: "itf-fin-052",
    kind: "mcq",
    prompt: { th: "องค์กรใดดูแลมาตรฐาน HTML และมี validator สำหรับตรวจ HTML5?" },
    options: [
      {
        id: "a",
        label: { th: "W3C (World Wide Web Consortium)" },
        why: { th: "ตัวเลือกนี้ถูกต้อง — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "b",
        label: { th: "IETF" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "c",
        label: { th: "IEEE" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "d",
        label: { th: "ISP" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
    ],
    correctId: "a",
    explanationMd: "**ข้อ A ถูกต้อง** — **W3C** กำหนดมาตรฐานที่ใช้บน WWW รวมถึง HTML และมี HTML5 validator\n\n**ตัวเลือกอื่นผิดเพราะ**\n- **B:** IETF ออกมาตรฐาน Internet ในรูป RFC\n- **C:** IEEE กำหนดมาตรฐานตระกูล 802 เช่น 802.11\n- **D:** ISP คือผู้ให้บริการอินเทอร์เน็ต ไม่ใช่องค์กรมาตรฐาน",
    sourceRef: "Week 14 · W3C",
    chapter: 14,
  },
  {
    id: "itf-fin-053",
    kind: "mcq",
    prompt: { th: "ข้อใดเปรียบเทียบ REST API กับ GraphQL ได้ถูกต้อง?" },
    options: [
      {
        id: "a",
        label: { th: "GraphQL แยก endpoint ตามทรัพยากร · REST มี endpoint เดียวและ client ระบุ field เอง" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "b",
        label: { th: "ทั้งสองเป็นภาษาสำหรับตกแต่งหน้าเว็บ เหมือน CSS" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "c",
        label: { th: "REST แยก endpoint ตามทรัพยากร และ server กำหนดรูปแบบข้อมูลที่ตอบกลับ · GraphQL มักมี endpoint เดียวและ client ระบุ field ที่ต้องการในคำขอ" },
        why: { th: "ตัวเลือกนี้ถูกต้อง — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "d",
        label: { th: "REST เป็น web server software เหมือน Nginx · GraphQL เป็นฐานข้อมูล" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
    ],
    correctId: "c",
    explanationMd: "**ข้อ C ถูกต้อง** — ทั้งคู่เป็นแนวทางออกแบบ **API** (ช่องทางที่ให้โปรแกรมขอใช้ข้อมูล) — **REST**: endpoint แยกตามทรัพยากร, server กำหนดรูปแบบข้อมูลตอบกลับ · **GraphQL**: endpoint เดียว, client ระบุ field ที่ต้องการ (รายละเอียดการเปรียบเทียบดูรูปในสไลด์ Week 14)\n\n**ตัวเลือกอื่นผิดเพราะ**\n- **A:** สลับ REST กับ GraphQL\n- **B:** REST และ GraphQL เป็นรูปแบบ API ไม่ใช่ภาษาตกแต่ง — งานตกแต่งเป็นของ CSS\n- **D:** ทั้งสองเป็นรูปแบบการออกแบบ API ไม่ใช่ web server software หรือฐานข้อมูล\n\n**จุดที่ต้องระวัง:** ตัวอย่าง web server software คือ Apache · Nginx · Caddy · IIS",
    sourceRef: "Week 14 · REST API vs GraphQL",
    chapter: 14,
  },
  {
    id: "itf-fin-054",
    kind: "mcq",
    prompt: { th: "การ deploy เว็บด้วย SCP (Secure Copy) ทำงานอย่างไร?" },
    options: [
      {
        id: "a",
        label: { th: "ส่งไฟล์ไปยัง FTP server โดยเข้ารหัสการเชื่อมต่อด้วย TLS" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "b",
        label: { th: "ใช้ version control (Git) ดันโค้ดขึ้นเครื่อง server ผ่านโปรโตคอล ssh" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "c",
        label: { th: "ให้ browser ดาวน์โหลดไฟล์จาก web server ผ่าน HTTP" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "d",
        label: { th: "คัดลอกไฟล์ระหว่างเครื่องโดยวิ่งผ่านการเชื่อมต่อที่ปลอดภัยของ SSH" },
        why: { th: "ตัวเลือกนี้ถูกต้อง — ดูคำอธิบายเต็มด้านล่าง" },
      },
    ],
    correctId: "d",
    explanationMd: "**ข้อ D ถูกต้อง** — **SCP (Secure Copy)** คัดลอกรับส่งไฟล์ระหว่างเครื่องผ่าน **SSH (Secure Shell)** — เป็นหนึ่งในวิธี deploy เว็บ ควบคู่กับ FTP/TLS และ SSH/Git\n\n**ตัวเลือกอื่นผิดเพราะ**\n- **A:** นั่นคือ FTP over TLS\n- **B:** นั่นคือวิธี SSH/Git (version control ผ่าน ssh)\n- **C:** เป็นการเข้าชมเว็บ ไม่ใช่การ deploy ไฟล์ขึ้น server\n\n**จุดที่ต้องระวัง:** 3 วิธี deploy: FTP/TLS · SCP (ผ่าน SSH) · SSH/Git",
    sourceRef: "Week 14 · Web deploy: SCP",
    chapter: 14,
  },
  {
    id: "itf-fin-055",
    kind: "mcq",
    prompt: { th: "ข้อใดเรียงเฟสของ SDLC ได้ถูกต้อง?" },
    options: [
      {
        id: "a",
        label: { th: "Planning → Analysis → Design → Implementation → Support & Security" },
        why: { th: "ตัวเลือกนี้ถูกต้อง — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "b",
        label: { th: "Analysis → Planning → Design → Implementation → Support & Security" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "c",
        label: { th: "Planning → Design → Analysis → Implementation → Support & Security" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "d",
        label: { th: "Planning → Analysis → Implementation → Design → Support & Security" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
    ],
    correctId: "a",
    explanationMd: "**ข้อ A ถูกต้อง** — SDLC มี 5 เฟสตามลำดับ: **Planning → Analysis → Design → Implementation → Support & Security**\n\n**ตัวเลือกอื่นผิดเพราะ**\n- **B:** Planning เป็นเฟสแรก — เริ่มเมื่อ steering committee รับคำขอโครงการ\n- **C:** ต้องวิเคราะห์ (Analysis) ก่อนออกแบบ (Design)\n- **D:** ต้องออกแบบ (Design) ก่อนลงมือสร้างและติดตั้ง (Implementation)",
    sourceRef: "Week 15 · SDLC",
    chapter: 15,
  },
  {
    id: "itf-fin-056",
    kind: "mcq",
    prompt: { th: "ข้อกำหนดว่า “ระบบต้องตอบสนองภายใน 2 วินาที” จัดเป็น requirement ชนิดใด?" },
    options: [
      {
        id: "a",
        label: { th: "Functional requirement" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "b",
        label: { th: "Non-functional requirement" },
        why: { th: "ตัวเลือกนี้ถูกต้อง — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "c",
        label: { th: "Economic feasibility" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "d",
        label: { th: "Acceptance test" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
    ],
    correctId: "b",
    explanationMd: "**ข้อ B ถูกต้อง** — **Non-functional requirement** คือคุณสมบัติอื่นของระบบ เช่น UI, reliability, performance, security และข้อจำกัด — เวลาตอบสนองเป็นเรื่อง performance\n\n**ตัวเลือกอื่นผิดเพราะ**\n- **A:** functional requirement คือสิ่งที่ระบบต้องทำ (input · behavior · output) เช่น ค้นหาสินค้าตามชื่อ\n- **C:** economic feasibility เป็นการประเมินความเป็นไปได้ด้านต้นทุนและประโยชน์ ไม่ใช่ชนิดของ requirement\n- **D:** acceptance test คือการทดสอบที่ผู้ใช้ตรวจว่าระบบทำงานกับข้อมูลจริงได้ ไม่ใช่ชนิดของ requirement\n\n**จุดที่ต้องระวัง:** “ระบบต้องตอบภายใน 2 วินาที” เป็น non-functional ไม่ใช่ functional",
    sourceRef: "Week 15 · Functional vs Non-functional requirement",
    chapter: 15,
  },
  {
    id: "itf-fin-057",
    kind: "mcq",
    prompt: { th: "บริษัทรู้แน่ชัดแล้วว่าต้องการสินค้ารุ่นใด และต้องการให้ผู้ขายเสนอราคา ควรส่งเอกสารใด?" },
    options: [
      {
        id: "a",
        label: { th: "RFQ (request for quotation)" },
        why: { th: "ตัวเลือกนี้ถูกต้อง — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "b",
        label: { th: "RFP (request for proposal)" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "c",
        label: { th: "RFI (request for information)" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "d",
        label: { th: "VAR (value-added reseller)" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
    ],
    correctId: "a",
    explanationMd: "**ข้อ A ถูกต้อง** — **RFQ** ใช้เมื่อรู้แล้วว่าต้องการสินค้าอะไร แล้วให้ผู้ขายเสนอราคา\n\n**ตัวเลือกอื่นผิดเพราะ**\n- **B:** RFP ใช้เมื่อให้ผู้ขายเลือกสินค้าที่ตรงความต้องการเองแล้วเสนอราคา\n- **C:** RFI ใช้ขอข้อมูลสินค้าแบบไม่เป็นทางการ\n- **D:** VAR คือบริษัทที่ซื้อจากผู้ผลิตมาขายต่อพร้อมบริการเสริม ไม่ใช่เอกสาร\n\n**จุดที่ต้องระวัง:** **RFQ** รู้สินค้าแล้วขอแค่ราคา · **RFP** ให้ผู้ขายเลือกสินค้าเอง · **RFI** ขอข้อมูล",
    sourceRef: "Week 15 · RFQ / RFP / RFI",
    chapter: 15,
  },
  {
    id: "itf-fin-058",
    kind: "mcq",
    prompt: { th: "การทดสอบที่ตรวจว่าแอปพลิเคชันของเราทำงานร่วมกับแอปพลิเคชันอื่นได้ เรียกว่าอะไร?" },
    options: [
      {
        id: "a",
        label: { th: "Unit test" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "b",
        label: { th: "Systems test" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "c",
        label: { th: "Acceptance test" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "d",
        label: { th: "Integration test" },
        why: { th: "ตัวเลือกนี้ถูกต้อง — ดูคำอธิบายเต็มด้านล่าง" },
      },
    ],
    correctId: "d",
    explanationMd: "**ข้อ D ถูกต้อง** — **Integration test** ตรวจว่าแอปทำงานร่วมกับแอปอื่นได้\n\n**ตัวเลือกอื่นผิดเพราะ**\n- **A:** unit test ตรวจแต่ละโปรแกรมแบบเดี่ยว ๆ\n- **B:** systems test ตรวจว่าทุกโปรแกรมในแอปเดียวกันทำงานร่วมกันได้\n- **C:** acceptance test ให้ผู้ใช้ตรวจว่าระบบทำงานกับข้อมูลจริงได้\n\n**จุดที่ต้องระวัง:** **Systems test** = โปรแกรมในแอปเดียวกันทำงานร่วมกัน · **integration test** = ทำงานร่วมกับแอปอื่น",
    sourceRef: "Week 15 · ประเภทการทดสอบระบบ",
    chapter: 15,
  },
  {
    id: "itf-fin-059",
    kind: "mcq",
    prompt: { th: "การเปิดใช้ระบบใหม่คู่ขนานกับระบบเดิมในช่วงเวลาหนึ่ง เรียกว่า conversion แบบใด?" },
    options: [
      {
        id: "a",
        label: { th: "Direct conversion" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "b",
        label: { th: "Parallel conversion" },
        why: { th: "ตัวเลือกนี้ถูกต้อง — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "c",
        label: { th: "Phased conversion" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "d",
        label: { th: "Pilot conversion" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
    ],
    correctId: "b",
    explanationMd: "**ข้อ B ถูกต้อง** — **Parallel conversion** ใช้ระบบเก่าและระบบใหม่ควบคู่กันช่วงหนึ่ง จึงปลอดภัยที่สุด\n\n**ตัวเลือกอื่นผิดเพราะ**\n- **A:** direct เลิกระบบเก่าแล้วเปลี่ยนเป็นระบบใหม่ทันที\n- **C:** phased เปลี่ยนทีละเฟสหรือทีละส่วน\n- **D:** pilot ทดลองใช้ระบบใหม่ที่แผนกหรือสาขาเดียวก่อนแล้วค่อยขยาย",
    sourceRef: "Week 15 · การเปลี่ยนระบบ (conversion)",
    chapter: 15,
  },
  {
    id: "itf-fin-060",
    kind: "mcq",
    prompt: { th: "การประเมิน feasibility ด้านใดถามว่าองค์กรมีทรัพยากร ซอฟต์แวร์ และบุคลากรเพียงพอหรือไม่?" },
    options: [
      {
        id: "a",
        label: { th: "Operational feasibility" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "b",
        label: { th: "Schedule feasibility" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "c",
        label: { th: "Technical feasibility" },
        why: { th: "ตัวเลือกนี้ถูกต้อง — ดูคำอธิบายเต็มด้านล่าง" },
      },
      {
        id: "d",
        label: { th: "Economic feasibility" },
        why: { th: "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง" },
      },
    ],
    correctId: "c",
    explanationMd: "**ข้อ C ถูกต้อง** — **Technical feasibility** ถามว่ามีทรัพยากร ซอฟต์แวร์ และคนพอหรือไม่\n\n**ตัวเลือกอื่นผิดเพราะ**\n- **A:** operational ถามว่าผู้ใช้จะชอบและใช้ระบบไหม ตรงความต้องการไหม\n- **B:** schedule ถามว่ากำหนดเวลา (deadline) สมเหตุสมผลไหม\n- **D:** economic (cost/benefit) ถามว่าประโยชน์ตลอดอายุระบบมากกว่าต้นทุนไหม\n\n**จุดที่ต้องระวัง:** Economic feasibility = cost/benefit ไม่ใช่เรื่องเวลา",
    sourceRef: "Week 15 · Feasibility 4 ด้าน",
    chapter: 15,
  },
];
