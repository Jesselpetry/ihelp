import type { QuizQuestion } from "@/lib/quiz";

// CE-KMITL 01006012 midterm self-test bank.
// Not an OJ problem — uses a fixed pseudo problem-id so progress tracking
// (keyed by number in lib/quiz.ts) doesn't collide with real OJ ids (all 4-digit).
export const CE_KMITL_QUIZ_ID = 900001;

export const CE_KMITL_QUIZ: QuizQuestion[] = [
  {
    id: "ce-q1",
    kind: "mcq",
    prompt: {
      th: "`2**2**3` มีค่าเท่าใด?",
      en: "What is the value of `2**2**3`?",
    },
    options: [
      {
        id: "a",
        label: { th: "256", en: "256" },
        why: { th: "ถูกต้อง — `**` ทำจากขวามาซ้าย จึงเป็น 2**(2**3) = 2**8 = 256", en: "Correct — `**` is right-associative: 2**(2**3) = 2**8 = 256." },
      },
      {
        id: "b",
        label: { th: "64", en: "64" },
        why: { th: "ผิด — 64 คือ (2**2)**3 ซึ่งใช้ลำดับซ้ายไปขวา ไม่ใช่กฎจริงของ Python", en: "Wrong — 64 comes from (2**2)**3, left-to-right, which is not how ** associates." },
      },
      {
        id: "c",
        label: { th: "16", en: "16" },
        why: { th: "ผิด — ไม่ตรงกับผลลัพธ์ของสูตรใดเลย", en: "Wrong — matches neither valid evaluation order." },
      },
      {
        id: "d",
        label: { th: "8", en: "8" },
        why: { th: "ผิด — นี่คือ 2**3 เพียงส่วนเดียวของนิพจน์", en: "Wrong — this is only the inner 2**3." },
      },
    ],
    correctId: "a",
    sourceRef: "สรุปคอมโปร-Midterm.md §2.6",
  },
  {
    id: "ce-q2",
    kind: "mcq",
    prompt: {
      th: "ทำไม `0.1 + 0.2 == 0.3` จึงได้ผลเป็น False ใน Python?",
      en: "Why does `0.1 + 0.2 == 0.3` evaluate to False in Python?",
    },
    options: [
      {
        id: "a",
        label: { th: "float เก็บค่าในหน่วยความจำแบบมีค่าคลาดเคลื่อน ทำให้ 0.1+0.2 ได้ 0.30000000000000004", en: "Floats are stored with rounding error, so 0.1+0.2 actually equals 0.30000000000000004" },
        why: { th: "ถูกต้อง — ห้ามใช้ `==`/`!=` เปรียบเทียบ float โดยตรงเพราะมีความคลาดเคลื่อนจากการเก็บค่าฐานสอง", en: "Correct — never compare floats with == directly due to binary floating-point rounding error." },
      },
      {
        id: "b",
        label: { th: "เพราะ Python ปัดเศษ 0.3 เป็น 0 โดยอัตโนมัติ", en: "Because Python automatically rounds 0.3 down to 0" },
        why: { th: "ผิด — Python ไม่มีพฤติกรรมปัดค่าคงที่แบบนี้", en: "Wrong — Python has no such automatic rounding behavior." },
      },
      {
        id: "c",
        label: { th: "เพราะ `==` ใช้กับจำนวนทศนิยมไม่ได้เลยจะเกิด SyntaxError", en: "Because == cannot be used on floats and raises SyntaxError" },
        why: { th: "ผิด — `==` ใช้ได้กับ float ทางไวยากรณ์ เพียงแต่ผลลัพธ์ไม่น่าเชื่อถือ", en: "Wrong — == is syntactically valid on floats; the result is just unreliable." },
      },
      {
        id: "d",
        label: { th: "เพราะ 0.2 ถูกตีความเป็น string โดยอัตโนมัติ", en: "Because 0.2 is automatically interpreted as a string" },
        why: { th: "ผิด — ตัวเลขทศนิยมยังคงเป็น float ตามปกติ", en: "Wrong — numeric literals stay as floats." },
      },
    ],
    correctId: "a",
    sourceRef: "สรุปคอมโปร-Midterm.md §3.1",
  },
  {
    id: "ce-q3",
    kind: "predict-output",
    prompt: {
      th: "โปรแกรมรับตัวเลขจำนวนเต็ม 2 ตัวจากผู้ใช้ด้วย `input()` โดยยังไม่แปลงชนิดข้อมูล แล้วพิมพ์ `type()` ของค่าที่รับมา ถ้าผู้ใช้พิมพ์ 706 ผลลัพธ์ของ `type()` คือข้อใด?",
      en: "A program reads a value with `input()` without converting its type, then prints `type()` of it. If the user types 706, what does `type()` print?",
    },
    stdin: "706\n",
    options: [
      {
        id: "a",
        label: { th: "<class 'str'>", en: "<class 'str'>" },
        why: { th: "ถูกต้อง — `input()` คืนค่าเป็น string เสมอไม่ว่าผู้ใช้จะพิมพ์ตัวเลขหรือไม่", en: "Correct — input() always returns a string regardless of what the user types." },
      },
      {
        id: "b",
        label: { th: "<class 'int'>", en: "<class 'int'>" },
        why: { th: "ผิด — ต้องแปลงด้วย int() ก่อนจึงจะเป็น int", en: "Wrong — requires an explicit int() conversion first." },
      },
      {
        id: "c",
        label: { th: "<class 'float'>", en: "<class 'float'>" },
        why: { th: "ผิด — input() ไม่คืนค่า float โดยอัตโนมัติ", en: "Wrong — input() never returns a float automatically." },
      },
      {
        id: "d",
        label: { th: "706", en: "706" },
        why: { th: "ผิด — โจทย์ถามผลของ type() ไม่ใช่ค่าตัวแปรเอง", en: "Wrong — the question asks for type(), not the raw value." },
      },
    ],
    correctId: "a",
    sourceRef: "สรุปคอมโปร-Midterm.md §2.7",
  },
  {
    id: "ce-q4",
    kind: "spot-the-bug",
    prompt: {
      th: "ลูปด้านล่างนี้มีปัญหาอะไร?",
      en: "What is wrong with the loop below?",
    },
    snippet: 'n = 5\nwhile n > 0:\n    print(n)\n    n = n + 1',
    options: [
      {
        id: "a",
        label: { th: "ตัวแปรควบคุม n เพิ่มค่าขึ้นเรื่อย ๆ แทนที่จะลด จึงไม่มีวันเข้าเงื่อนไข n > 0 เป็นเท็จ กลายเป็น infinite loop", en: "Control variable n keeps increasing instead of decreasing, so n > 0 never becomes false — infinite loop" },
        why: { th: "ถูกต้อง — ต้องใช้ `n = n - 1` เพื่อให้ n ลดลงจนกระทั่งเงื่อนไขเป็นเท็จและลูปจบ", en: "Correct — must decrement with n = n - 1 so the condition eventually becomes false." },
      },
      {
        id: "b",
        label: { th: "while ต้องใช้ `<` แทน `>` เท่านั้น", en: "while must always use < instead of >" },
        why: { th: "ผิด — เงื่อนไขเลือกใช้ได้ตามตรรกะของโปรแกรม ไม่ได้บังคับเครื่องหมายเดียว", en: "Wrong — the comparison operator depends on program logic, not a fixed rule." },
      },
      {
        id: "c",
        label: { th: "print(n) ต้องอยู่นอกลูป", en: "print(n) must be outside the loop" },
        why: { th: "ผิด — การพิมพ์ค่าทุกรอบเป็นการใช้งาน while ตามปกติ", en: "Wrong — printing each iteration is normal while-loop usage." },
      },
      {
        id: "d",
        label: { th: "ต้องกำหนดค่าเริ่มต้น n เป็น 0", en: "n must start at 0" },
        why: { th: "ผิด — ค่าเริ่มต้นไม่ใช่ปัญหา ปัญหาคือทิศทางการเปลี่ยนค่า", en: "Wrong — the starting value isn't the issue; the direction of change is." },
      },
    ],
    correctId: "a",
    sourceRef: "สรุปคอมโปร-Midterm.md §4.2",
  },
  {
    id: "ce-q5",
    kind: "predict-output",
    prompt: {
      th: "ลูปวนค่า a จาก 10 ลดลงทีละ 1 ทุกรอบ (`a -= 1`) ก่อนพิมพ์ และใช้ `continue` เมื่อ a เท่ากับ 5 (ข้ามการพิมพ์เฉพาะรอบนั้น) ลูปหยุดเมื่อ a ไม่มากกว่า 0 ผลลัพธ์ตัวเลขที่ถูกพิมพ์ (คั่นด้วยช่องว่าง) คือข้อใด?",
      en: "A loop starts a=10, decrements a by 1 each round (`a -= 1`) before printing, and uses `continue` to skip printing only when a equals 5. It stops once a is not greater than 0. What numbers get printed (space-separated)?",
    },
    stdin: "",
    options: [
      {
        id: "a",
        label: { th: "9 8 7 6 4 3 2 1 0", en: "9 8 7 6 4 3 2 1 0" },
        why: { th: "ถูกต้อง — ทุกค่าจาก 9 ลงไป 0 จะถูกพิมพ์ ยกเว้น 5 ที่ถูกข้ามด้วย continue", en: "Correct — every value from 9 down to 0 prints except 5, skipped by continue." },
      },
      {
        id: "b",
        label: { th: "9 8 7 6 5 4 3 2 1 0", en: "9 8 7 6 5 4 3 2 1 0" },
        why: { th: "ผิด — ลืมว่า continue ข้ามการพิมพ์ตอน a เท่ากับ 5", en: "Wrong — forgets that continue skips printing when a equals 5." },
      },
      {
        id: "c",
        label: { th: "10 9 8 7 6 4 3 2 1 0", en: "10 9 8 7 6 4 3 2 1 0" },
        why: { th: "ผิด — a ลดค่าก่อนพิมพ์เสมอ จึงไม่มีวันพิมพ์ 10", en: "Wrong — a is decremented before printing, so 10 is never printed." },
      },
      {
        id: "d",
        label: { th: "9 8 7 6 4 3 2 1", en: "9 8 7 6 4 3 2 1" },
        why: { th: "ผิด — ลูปหยุดเมื่อ a ไม่มากกว่า 0 คือหลังพิมพ์ 0 แล้ว ไม่ใช่ก่อนพิมพ์ 0", en: "Wrong — the loop stops once a is not greater than 0, meaning 0 is printed before it exits." },
      },
    ],
    correctId: "a",
    sourceRef: "สรุปคอมโปร-Midterm.md §4.4",
  },
  {
    id: "ce-q6",
    kind: "mcq",
    prompt: {
      th: "ทำไมการหาค่าน้อยที่สุด (smallest) ในลิสต์ด้วยการตั้งค่าเริ่มต้นเป็น `-1` แล้วเทียบ `<` จึงเป็นวิธีที่ผิด?",
      en: "Why is initializing `smallest_so_far = -1` and comparing with `<` the wrong way to find the smallest value in a list?",
    },
    options: [
      {
        id: "a",
        label: { th: "ถ้าทุกค่าในลิสต์มากกว่า -1 เงื่อนไข value < -1 จะไม่เป็นจริงเลย ผลลัพธ์จึงค้างที่ -1 ซึ่งไม่ใช่สมาชิกจริง", en: "If every value in the list is greater than -1, value < -1 is never true, so the result stays stuck at -1 — not a real element" },
        why: { th: "ถูกต้อง — ค่าเริ่มต้นที่ไม่ใช่สมาชิกจริงทำให้ผลลัพธ์ผิดได้ วิธีที่ถูกต้องคือเริ่มด้วย None แล้วเช็ก `is None`", en: "Correct — an initial value not from the actual data can corrupt the result; the safe idiom starts with None and checks is None." },
      },
      {
        id: "b",
        label: { th: "เพราะ -1 เป็นค่าติดลบซึ่ง Python ไม่รองรับในการเปรียบเทียบ", en: "Because -1 is negative and Python cannot compare negative numbers" },
        why: { th: "ผิด — Python เปรียบเทียบจำนวนติดลบได้ตามปกติ", en: "Wrong — Python compares negative numbers cleanly." },
      },
      {
        id: "c",
        label: { th: "เพราะต้องใช้ `<=` แทน `<` เท่านั้น", en: "Because you must use <= instead of <" },
        why: { th: "ผิด — เครื่องหมายไม่ใช่สาเหตุของปัญหานี้", en: "Wrong — the comparison operator isn't the root cause here." },
      },
      {
        id: "d",
        label: { th: "เพราะลิสต์ต้องเรียงลำดับก่อนเสมอ", en: "Because the list must always be sorted first" },
        why: { th: "ผิด — loop idiom หาค่าน้อยสุด/มากสุดทำงานได้โดยไม่ต้องเรียงลำดับก่อน", en: "Wrong — the largest/smallest loop idiom works without pre-sorting." },
      },
    ],
    correctId: "a",
    sourceRef: "สรุปคอมโปร-Midterm.md §5.3 (7)",
  },
  {
    id: "ce-q7",
    kind: "predict-output",
    prompt: {
      th: "`range(13, 5, -2)` เมื่อวนด้วย for แล้วพิมพ์ทีละค่า จะได้ลำดับตัวเลขใด?",
      en: "When iterating `range(13, 5, -2)` with a for loop and printing each value, what sequence of numbers results?",
    },
    stdin: "",
    options: [
      {
        id: "a",
        label: { th: "13 11 9 7", en: "13 11 9 7" },
        why: { th: "ถูกต้อง — เริ่มที่ 13 ลดทีละ 2 และหยุดก่อนถึง 5 (ไม่รวม stop)", en: "Correct — starts at 13, steps by -2, and stops before reaching 5 (stop excluded)." },
      },
      {
        id: "b",
        label: { th: "13 11 9 7 5", en: "13 11 9 7 5" },
        why: { th: "ผิด — range ไม่รวมค่า stop (5) เสมอ", en: "Wrong — range never includes the stop value (5)." },
      },
      {
        id: "c",
        label: { th: "5 7 9 11 13", en: "5 7 9 11 13" },
        why: { th: "ผิด — step เป็นค่าลบ (-2) จึงต้องนับถอยหลังจาก start ไม่ใช่นับขึ้น", en: "Wrong — a negative step counts downward from start, not upward." },
      },
      {
        id: "d",
        label: { th: "13 12 11 10 9 8 7 6", en: "13 12 11 10 9 8 7 6" },
        why: { th: "ผิด — นี่คือ step = -1 ไม่ใช่ -2", en: "Wrong — this is what step = -1 would produce, not -2." },
      },
    ],
    correctId: "a",
    sourceRef: "สรุปคอมโปร-Midterm.md §5.2",
  },
  {
    id: "ce-q8",
    kind: "spot-the-bug",
    prompt: {
      th: "โครงสร้าง if/elif ด้านล่างมีบรรทัดใดที่ไม่มีวันถูกทำงาน?",
      en: "In the if/elif structure below, which branch can never execute?",
    },
    snippet: 'if x < 2:\n    print("Below 2")\nelif x < 20:\n    print("Below 20")\nelif x < 10:\n    print("Below 10")',
    options: [
      {
        id: "a",
        label: { th: "'Below 10' ไม่มีวันพิมพ์ เพราะทุกค่าที่ x < 10 ต้องผ่าน x < 20 ไปก่อนแล้ว", en: "'Below 10' never prints because any x < 10 already satisfies x < 20 first" },
        why: { th: "ถูกต้อง — Python ไล่เช็กจากบนลงล่างและออกทันทีที่เจอเงื่อนไขจริงข้อแรก elif x<20 จะดักทุกกรณีของ x<10 ไปก่อน", en: "Correct — Python checks top-to-bottom and exits at the first true branch; elif x<20 always catches x<10 cases first." },
      },
      {
        id: "b",
        label: { th: "'Below 2' ไม่มีวันพิมพ์", en: "'Below 2' never prints" },
        why: { th: "ผิด — เมื่อ x < 2 เงื่อนไขแรกเป็นจริงและพิมพ์ได้ปกติ", en: "Wrong — when x < 2 the first branch is true and prints normally." },
      },
      {
        id: "c",
        label: { th: "'Below 20' ไม่มีวันพิมพ์", en: "'Below 20' never prints" },
        why: { th: "ผิด — ค่า x ระหว่าง 10 ถึง 19 จะเข้าเงื่อนไขนี้ได้ปกติ", en: "Wrong — x values between 10 and 19 reach this branch normally." },
      },
      {
        id: "d",
        label: { th: "ทุกบรรทัดทำงานได้ปกติ ไม่มีปัญหา", en: "All branches work fine; there is no issue" },
        why: { th: "ผิด — ลำดับเงื่อนไขที่วางผิดทำให้ branch หนึ่งตายไปจริง ๆ", en: "Wrong — the branch ordering genuinely dead-codes one condition." },
      },
    ],
    correctId: "a",
    sourceRef: "สรุปคอมโปร-Midterm.md §3.6",
  },
  {
    id: "ce-q9",
    kind: "predict-output",
    prompt: {
      th: "โค้ดครอบคำสั่งแปลงข้อความ 'Bob' เป็น int ด้วย try/except และกำหนด istr = -1 เมื่อเกิด error ผลลัพธ์ของ print('First', istr) คือข้อใด?",
      en: "Code wraps int('Bob') in a try/except that sets istr = -1 on error. What does print('First', istr) output?",
    },
    stdin: "",
    options: [
      {
        id: "a",
        label: { th: "First -1", en: "First -1" },
        why: { th: "ถูกต้อง — int('Bob') ทำให้เกิด ValueError จึงกระโดดไปทำ except และกำหนด istr เป็น -1", en: "Correct — int('Bob') raises ValueError, jumping to except which sets istr to -1." },
      },
      {
        id: "b",
        label: { th: "First Bob", en: "First Bob" },
        why: { th: "ผิด — istr ถูกกำหนดใหม่เป็น -1 ใน except ไม่ใช่ข้อความเดิม", en: "Wrong — istr is reassigned to -1 inside except, not left as the original text." },
      },
      {
        id: "c",
        label: { th: "โปรแกรม crash ด้วย ValueError", en: "The program crashes with ValueError" },
        why: { th: "ผิด — try/except ดักข้อผิดพลาดไว้แล้ว โปรแกรมจึงทำงานต่อได้ไม่พัง", en: "Wrong — try/except catches the error, so the program continues without crashing." },
      },
      {
        id: "d",
        label: { th: "First 0", en: "First 0" },
        why: { th: "ผิด — except กำหนดค่าเป็น -1 ตามที่โค้ดระบุไว้ ไม่ใช่ 0", en: "Wrong — the except block sets the value to -1 as coded, not 0." },
      },
    ],
    correctId: "a",
    sourceRef: "สรุปคอมโปร-Midterm.md §3.7",
  },
  {
    id: "ce-q10",
    kind: "mcq",
    prompt: {
      th: "`ord()` และ `chr()` ใช้ทำอะไร และมีข้อจำกัดสำคัญอย่างไร?",
      en: "What do `ord()` and `chr()` do, and what is their key restriction?",
    },
    options: [
      {
        id: "a",
        label: { th: "ord(ch) แปลงตัวอักษร 1 ตัวเป็นรหัส ASCII และ chr(num) แปลงกลับ — ord() รับได้แค่ตัวอักษรตัวเดียวเท่านั้น", en: "ord(ch) converts a single character to its ASCII code and chr(num) reverses it — ord() only accepts a single character" },
        why: { th: "ถูกต้อง — ord('Abx') จะเกิด TypeError เพราะยาวเกิน 1 ตัวอักษร", en: "Correct — ord('Abx') raises TypeError because it is longer than one character." },
      },
      {
        id: "b",
        label: { th: "ord() และ chr() ใช้แปลงสตริงทั้งก้อนเป็นตัวเลขฐานสอง", en: "ord() and chr() convert an entire string to binary" },
        why: { th: "ผิด — ทั้งสองฟังก์ชันทำงานกับตัวอักษรเดี่ยว/รหัสตัวเลขเดี่ยวเท่านั้น", en: "Wrong — both functions operate on a single character/code, not a whole string." },
      },
      {
        id: "c",
        label: { th: "ord() รับได้หลายตัวอักษรพร้อมกันโดยไม่จำกัด", en: "ord() accepts multiple characters at once without limit" },
        why: { th: "ผิด — ord() รับได้เฉพาะตัวอักษรความยาว 1 เท่านั้น มิฉะนั้นเกิด TypeError", en: "Wrong — ord() only accepts a string of length 1, otherwise it raises TypeError." },
      },
      {
        id: "d",
        label: { th: "chr() ใช้แปลงตัวอักษรเป็นตัวพิมพ์ใหญ่", en: "chr() converts a character to uppercase" },
        why: { th: "ผิด — การแปลงตัวพิมพ์ใหญ่คือ .upper() ไม่ใช่ chr()", en: "Wrong — uppercase conversion is done via .upper(), not chr()." },
      },
    ],
    correctId: "a",
    sourceRef: "สรุปคอมโปร-Midterm.md §4.5",
  },
];
