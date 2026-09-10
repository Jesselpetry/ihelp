/**
 * Quiz content bank for the "technique self-test" feature.
 *
 * VERIFICATION PROCEDURE (read before adding/editing any question):
 *
 * 1. Every `mcq` and `spot-the-bug` question's correct answer must describe
 *    something literally present in the corresponding `data/recommended/<folder>/main.py`
 *    (a real variable name, a real condition, a real order of branches, etc.) —
 *    never an invented API or a plausible-sounding but fictional detail.
 *
 * 2. Every `predict-output` input/expected pair is either:
 *      (a) copied verbatim from that problem's `problem.md` §4 (Official Examples)
 *          or §6 (Additional Test Cases), or
 *      (b) independently verified by actually running:
 *            printf '<stdin>' | python3 data/recommended/<folder>/main.py
 *    Hand-computed numeric/formatted answers are NOT allowed — every one of them
 *    was produced by running the real script. See the PR/agent notes for the
 *    full transcript of verification commands run for this file.
 *
 * 3. Every `spot-the-bug` snippet is <= 5 real lines taken from the problem's
 *    main.py with exactly one deliberate mutation (e.g. swapped comparison,
 *    wrong initial value, wrong range bound). `sourceRef` names the original
 *    location the snippet was mutated from, e.g. "main.py:7-9".
 *
 * 4. No question stem, snippet, or option contains more than 5 consecutive
 *    lines of code, and none contains a complete working entry-point function.
 *    This file must contain zero occurrences of a Python function definition
 *    named "main" or a dunder-name guard clause (grep-checked before commit).
 *
 * 5. `predict-output` questions show NO code in the prompt/snippet — only the
 *    problem's I/O contract (in prose) plus a concrete stdin value under
 *    `stdin`. The student reasons from the spec, like a real exam question.
 */

import type { QuizQuestion } from "@/lib/quiz";

// ---------------------------------------------------------------------------
// 2996 — Swap Characters (สลับตัวอักษร)
// ---------------------------------------------------------------------------
const swapCharacters: QuizQuestion[] = [
  {
    id: "2996-q1",
    kind: "mcq",
    prompt: {
      th: "การตัดข้อความ (String Slicing) รูปแบบ `text[::-1]` ใน Python ทำงานอย่างไร?",
      en: "How does string slicing with `text[::-1]` work in Python?",
    },
    options: [
      {
        id: "a",
        label: { th: "ละเว้น start และ stop แล้วกำหนด step = -1 เพื่ออ่านย้อนหลังจากตัวสุดท้ายมาตัวแรก", en: "Omits start and stop while setting step = -1 to traverse backwards from end to start" },
        why: { th: "ถูกต้อง — รูปแบบ slicing คือ `[start:stop:step]` เมื่อกำหนด step = -1 และไม่ใส่ขอบเขต จะได้สตริงกลับด้านใน O(N)", en: "Correct — slicing syntax is `[start:stop:step]`. With step = -1 and omitted bounds, it reverses the string in O(N)." },
      },
      {
        id: "b",
        label: { th: "ลบตัวอักษรตัวสุดท้ายของสตริงออก 1 ตัว", en: "Deletes the last character from the string" },
        why: { th: "ผิด — การตัดตัวสุดท้ายออกคือ `text[:-1]` ไม่ใช่ `text[::-1]` (มีโคลอนสองตัว)", en: "Wrong — removing the last character is `text[:-1]`, not `text[::-1]` (two colons)." },
      },
      {
        id: "c",
        label: { th: "แปลงตัวอักษรทุกตัวเป็นตัวพิมพ์เล็กโดยไม่สลับลำดับ", en: "Converts all letters to lowercase without reordering" },
        why: { th: "ผิด — การแปลงตัวพิมพ์เล็กคือเมธอด `.lower()`", en: "Wrong — converting to lowercase is done via `.lower()`." },
      },
      {
        id: "d",
        label: { th: "ตรวจสอบว่าสตริงเป็นพาลินโดรม (Palindrome) หรือไม่", en: "Checks whether the string is a palindrome boolean" },
        why: { th: "ผิด — `text[::-1]` คืนค่าสตริงที่กลับด้านแล้ว ไม่ได้คืนค่า True/False", en: "Wrong — `text[::-1]` returns the reversed string, not a boolean." },
      },
    ],
    correctId: "a",
    sourceRef: "problem.md §3",
  },
  {
    id: "2996-q2",
    kind: "mcq",
    prompt: {
      th: "เมธอด `.lower()` ส่งผลอย่างไรต่อตัวเลขอักขระและเครื่องหมายวรรคตอน?",
      en: "How does `.lower()` affect numbers and punctuation characters in a string?",
    },
    options: [
      {
        id: "a",
        label: { th: "คงค่าตัวเลขและสัญลักษณ์ไว้ตามเดิม แปลงเฉพาะตัวอักษรภาษาอังกฤษพิมพ์ใหญ่", en: "Leaves digits and punctuation untouched, only transforming uppercase letters" },
        why: { th: "ถูกต้อง — `.lower()` จะแปลงเฉพาะ A-Z เป็น a-z ส่วนตัวเลขและสัญลักษณ์อื่น ๆ จะไม่เปลี่ยนแปลง", en: "Correct — `.lower()` converts only A-Z to a-z while preserving all other characters." },
      },
      {
        id: "b",
        label: { th: "ลบตัวเลขและช่องว่างทั้งหมดออกจากสตริง", en: "Removes all digits and spaces from the string" },
        why: { th: "ผิด — `.lower()` ไม่มีการลบอักขระใด ๆ ออกจากสตริง", en: "Wrong — `.lower()` never deletes any characters from the string." },
      },
      {
        id: "c",
        label: { th: "เกิดข้อผิดพลาด ValueError ถ้ามีตัวเลขปนอยู่", en: "Raises a ValueError if digits are encountered" },
        why: { th: "ผิด — `.lower()` ทำงานได้กับทุกสตริงโดยไม่เกิด Error เมื่อมีตัวเลข", en: "Wrong — `.lower()` handles strings containing numbers cleanly without error." },
      },
      {
        id: "d",
        label: { th: "แปลงตัวเลขเป็น 0 และแปลงช่องว่างเป็นขีดล่าง", en: "Converts digits to 0 and spaces to underscores" },
        why: { th: "ผิด — ไม่มีพฤติกรรมนี้ใน `.lower()`", en: "Wrong — `.lower()` has no such behavior." },
      },
    ],
    correctId: "a",
    sourceRef: "problem.md §3",
  },
  {
    id: "2996-q3",
    kind: "predict-output",
    prompt: {
      th: "โปรแกรมอ่านข้อความ 1 บรรทัด กลับลำดับตัวอักษรทั้งหมด และแปลงเป็นตัวพิมพ์เล็ก ถ้าอินพุตคือ 'Hello World' ผลลัพธ์คือข้อใด?",
      en: "The program reads one line of text, reverses all characters, and converts to lowercase. If input is 'Hello World', what is the output?",
    },
    stdin: "Hello World\n",
    options: [
      {
        id: "a",
        label: { th: "dlrow olleh", en: "dlrow olleh" },
        why: { th: "ถูกต้อง — 'Hello World' กลับด้านได้ 'dlroW olleH' แล้วแปลงตัวพิมพ์เล็กทั้งหมดเป็น 'dlrow olleh'", en: "Correct — 'Hello World' reversed is 'dlroW olleH', converted to lowercase is 'dlrow olleh'." },
      },
      {
        id: "b",
        label: { th: "hello world", en: "hello world" },
        why: { th: "ผิด — ลืมสลับลำดับตัวอักษร", en: "Wrong — character order was not reversed." },
      },
      {
        id: "c",
        label: { th: "dlroW olleH", en: "dlroW olleH" },
        why: { th: "ผิด — สลับลำดับแล้วแต่ยังไม่ได้แปลงเป็นตัวพิมพ์เล็ก", en: "Wrong — reversed, but uppercase W and H were not converted to lowercase." },
      },
      {
        id: "d",
        label: { th: "world hello", en: "world hello" },
        why: { th: "ผิด — นี่คือการสลับคำ ไม่ใช่การสลับตัวอักษรรายตัว", en: "Wrong — this swaps words, not individual characters." },
      },
    ],
    correctId: "a",
    sourceRef: "problem.md §4 (Case 1)",
  },
  {
    id: "2996-q4",
    kind: "predict-output",
    prompt: {
      th: "ถ้าอินพุตคือ 'Python 3.10' ผลลัพธ์จากการกลับด้านและแปลงเป็นตัวพิมพ์เล็กคือข้อใด?",
      en: "If the input is 'Python 3.10', what is the output after reversing and lowercasing?",
    },
    stdin: "Python 3.10\n",
    options: [
      {
        id: "a",
        label: { th: "01.3 nohtyp", en: "01.3 nohtyp" },
        why: { th: "ถูกต้อง — ตัวเลข '3.10' กลับด้านเป็น '01.3 ' และ 'Python' กลับด้านเป็น 'nohtyp'", en: "Correct — '3.10' reverses to '01.3 ' and 'Python' reverses to lowercase 'nohtyp'." },
      },
      {
        id: "b",
        label: { th: "3.10 nohtyp", en: "3.10 nohtyp" },
        why: { th: "ผิด — ตัวเลขและจุดทศนิยมต้องถูกกลับด้านด้วย", en: "Wrong — the numbers and dot must also be reversed in string slicing." },
      },
      {
        id: "c",
        label: { th: "01.3 nohtyP", en: "01.3 nohtyP" },
        why: { th: "ผิด — ตัวอักษร P ต้องแปลงเป็น p ตัวพิมพ์เล็ก", en: "Wrong — the letter P must be converted to lowercase p." },
      },
      {
        id: "d",
        label: { th: "nohtyp 01.3", en: "nohtyp 01.3" },
        why: { th: "ผิด — ลำดับผิดตำแหน่ง", en: "Wrong — incorrect ordering." },
      },
    ],
    correctId: "a",
    sourceRef: "problem.md §4 (Case 2)",
  },
  {
    id: "2996-q5",
    kind: "spot-the-bug",
    prompt: {
      th: "โค้ดด้านล่างมีข้อผิดพลาดใดที่ทำให้ไม่ได้ผลลัพธ์ย้อนกลับ?",
      en: "What bug in the snippet below prevents the string from reversing?",
    },
    snippet: 'text = input()\nprint(text[::1].lower())',
    options: [
      {
        id: "a",
        label: { th: "step เป็น 1 ทำให้เดินไปข้างหน้าตามลำดับเดิม ต้องแก้เป็น -1", en: "step is 1 (forward traversal); must be changed to -1 for reverse order" },
        why: { th: "ถูกต้อง — `[::1]` คือการอ่านทีละ 1 ตัวตามปกติ ต้องใช้ `[::-1]` เพื่ออ่านย้อนกลับ", en: "Correct — `[::1]` traverses forward normally; `[::-1]` is needed for reverse." },
      },
      {
        id: "b",
        label: { th: "ต้องเรียก `.lower()` ก่อน slice", en: "Must call `.lower()` before slicing" },
        why: { th: "ผิด — การเรียก `.lower()` ก่อนหรือหลัง slice ให้ผลลัพธ์เท่ากัน", en: "Wrong — calling `.lower()` before or after slicing yields the same result." },
      },
      {
        id: "c",
        label: { th: "input() ต้องระบุประเภทเป็น str(input())", en: "input() must be wrapped in str(input())" },
        why: { th: "ผิด — input() ใน Python คืนค่าเป็น str อยู่แล้ว", en: "Wrong — input() in Python returns a string by default." },
      },
      {
        id: "d",
        label: { th: "ห้ามใช้ print ซ้อนในบรรทัดเดียวกัน", en: "Cannot chain methods inside print" },
        why: { th: "ผิด — Python อนุญาตให้ประมวลผลนิพจน์ภายใน print() ได้ตามปกติ", en: "Wrong — Python evaluates expressions inside print() normally." },
      },
    ],
    correctId: "a",
    sourceRef: "main.py:9",
  },
  {
    id: "2996-q6",
    kind: "pep8",
    prompt: {
      th: "ตามมาตรฐาน PEP-8 การจัดรูปแบบโค้ดในข้อใดถูกต้องและกระชับที่สุดสำหรับข้อนี้?",
      en: "According to PEP-8, which form is cleanest and most idiomatic for this problem?",
    },
    options: [
      {
        id: "a",
        label: { th: "print(text[::-1].lower()) ไม่ต้องเว้นวรรคใน slice", en: "print(text[::-1].lower()) without spaces inside slice colons" },
        why: { th: "ถูกต้อง — PEP-8 แนะนำว่าใน slice `[:]` ที่ไม่มีนิพจน์ซับซ้อน ไม่ต้องเว้นวรรครอบโคลอน", en: "Correct — PEP-8 specifies no spaces around colons in simple slices." },
      },
      {
        id: "b",
        label: { th: "print( text [ : : -1 ] . lower ( ) )", en: "print( text [ : : -1 ] . lower ( ) )" },
        why: { th: "ผิด — PEP-8 ห้ามเว้นวรรคติดกับวงเล็บและก้ามปู", en: "Wrong — PEP-8 explicitly forbids whitespace inside brackets and parentheses." },
      },
      {
        id: "c",
        label: { th: "ต้องสร้างตัวแปรแยก 4 บรรทัดเพื่อทำทีละขั้นตอนเสมอ", en: "Must assign intermediate variables across 4 lines" },
        why: { th: "ผิด — การต่อเมธอดสั้น ๆ (Method Chaining) เป็นวิธีที่อ่านง่ายและยอมรับใน Python", en: "Wrong — simple method chaining is clear and standard in Python." },
      },
      {
        id: "d",
        label: { th: "ต้องใช้เครื่องหมายบวกเชื่อมสตริงแทน slicing", en: "Must use string concatenation loop instead of slicing" },
        why: { th: "ผิด — การใช้ loop ต่อสตริงช้ากว่า slicing และไม่เป็น Pythonic", en: "Wrong — slicing is idiomatic and implemented in C under the hood." },
      },
    ],
    correctId: "a",
    sourceRef: "problem.md §3",
  },
];

// ---------------------------------------------------------------------------
// 2997 — Elo
// ---------------------------------------------------------------------------
const elo: QuizQuestion[] = [
  {
    id: "2997-q1",
    kind: "mcq",
    prompt: {
      th: "ในการคำนวณสูตร Elo `10 ** ((B - A) / 400)` ทำไมต้องใส่วงเล็บรอบ `(B - A)`?",
      en: "In the Elo formula `10 ** ((B - A) / 400)`, why must `(B - A)` be in parentheses?",
    },
    options: [
      {
        id: "a",
        label: { th: "เพราะเครื่องหมาย `/` มีลำดับสูงกว่า `-` ถ้าไม่ใส่วงเล็บ `A / 400` จะถูกหารก่อน", en: "Because `/` has higher precedence than `-`; without parentheses, `A / 400` executes first" },
        why: { th: "ถูกต้อง — ตามลำดับตัวดำเนินการคณิตศาสตร์ การหาร `/` จะทำก่อนการลบ `-` เสมอ จึงต้องใส่วงเล็บ", en: "Correct — division `/` has higher precedence than subtraction `-`, requiring parentheses." },
      },
      {
        id: "b",
        label: { th: "เพราะ Python ไม่อนุญาตให้ใช้ตัวแปร 2 ตัวเป็นเลขชี้กำลัง", en: "Because Python does not allow multiple variables in an exponent" },
        why: { th: "ผิด — Python อนุญาตให้ใช้นิพจน์ใด ๆ เป็นเลขชี้กำลังได้", en: "Wrong — Python allows any valid expression as an exponent." },
      },
      {
        id: "c",
        label: { th: "เพราะฟังก์ชัน expected_score รับเฉพาะจำนวนเต็ม", en: "Because expected_score only accepts integers" },
        why: { th: "ผิด — ฟังก์ชันสามารถคำนวณ float ได้ปกติ", en: "Wrong — the function computes floating-point values cleanly." },
      },
      {
        id: "d",
        label: { th: "เพราะผลลัพธ์ของเลขชี้กำลังจะกลายเป็นจำนวนเชิงซ้อน", en: "Because the exponent would become a complex number" },
        why: { th: "ผิด — ผลลัพธ์ยังคงเป็นจำนวนจริง (Real Number)", en: "Wrong — the calculation stays in real numbers." },
      },
    ],
    correctId: "a",
    sourceRef: "problem.md §3",
  },
  {
    id: "2997-q2",
    kind: "mcq",
    prompt: {
      th: "การจัดรูปแบบทศนิยม 2 ตำแหน่งด้วย f-string ใน Python ต้องเขียนอย่างไร?",
      en: "How do you format a float to exactly 2 decimal places using f-strings in Python?",
    },
    options: [
      {
        id: "a",
        label: { th: 'f"{result:.2f}"', en: 'f"{result:.2f}"' },
        why: { th: "ถูกต้อง — `:2f` กำหนดให้แสดงเลขทศนิยมแบบ fixed-point 2 ตำแหน่ง พร้อมเติม 0 ให้ครบ", en: "Correct — `:.2f` specifies a fixed-point float formatted to 2 decimal places." },
      },
      {
        id: "b",
        label: { th: 'f"{result:2d}"', en: 'f"{result:2d}"' },
        why: { th: "ผิด — `:2d` ใช้สำหรับจำนวนเต็ม (Decimal Integer) ไม่ใช่ Float", en: "Wrong — `d` is for integers, causing a ValueError on floats." },
      },
      {
        id: "c",
        label: { th: 'f"{round(result, 2)}"', en: 'f"{round(result, 2)}"' },
        why: { th: "ผิด — round() อาจตัดเลข 0 ตัวท้ายทิ้ง เช่น 0.50 จะกลายเป็น '0.5' ซึ่งไม่ตรงกับสเปกโจทย์", en: "Wrong — round() drops trailing zeros (e.g. 0.50 -> '0.5'), failing OJ strict formatting." },
      },
      {
        id: "d",
        label: { th: 'f"{result:%2}"', en: 'f"{result:%2}"' },
        why: { th: "ผิด — `%` ใช้สำหรับแสดงผลเป็นเปอร์เซ็นต์ (คูณ 100 และใส่เครื่องหมาย %)", en: "Wrong — `%` formats as percentage, multiplying by 100." },
      },
    ],
    correctId: "a",
    sourceRef: "problem.md §3",
  },
  {
    id: "2997-q3",
    kind: "predict-output",
    prompt: {
      th: "ผู้เล่น A มีเรตติง 1500, ผู้เล่น B มีเรตติง 1500 ถามโอกาสชนะของผู้เล่น A ผลลัพธ์ที่พิมพ์ออกมาคือข้อใด?",
      en: "Player A rating is 1500, Player B is 1500. What is the printed expected score for player A?",
    },
    stdin: "1500\n1500\nA\n",
    options: [
      {
        id: "a",
        label: { th: "0.50", en: "0.50" },
        why: { th: "ถูกต้อง — เมื่อเรตติงเท่ากัน (1500 - 1500 = 0), 10**0 = 1, ได้ 1/(1+1) = 0.50", en: "Correct — identical ratings yield 10**0 = 1, giving 1/(1+1) = 0.50." },
      },
      {
        id: "b",
        label: { th: "0.5", en: "0.5" },
        why: { th: "ผิด — ต้องมีทศนิยม 2 ตำแหน่งพอดี (0.50)", en: "Wrong — must have exactly 2 decimal places (0.50)." },
      },
      {
        id: "c",
        label: { th: "1.00", en: "1.00" },
        why: { th: "ผิด — เรตติงเท่ากันโอกาสชนะต้องเป็น 50-50 ไม่ใช่ชนะแน่นอน 1.00", en: "Wrong — equal ratings mean a 50-50 probability, not guaranteed win." },
      },
      {
        id: "d",
        label: { th: "0.00", en: "0.00" },
        why: { th: "ผิด — คำนวณไม่ถูกต้อง", en: "Wrong — calculation is incorrect." },
      },
    ],
    correctId: "a",
    sourceRef: "problem.md §4 (Case 1)",
  },
  {
    id: "2997-q4",
    kind: "predict-output",
    prompt: {
      th: "ผู้เล่น A มีเรตติง 1600, ผู้เล่น B มีเรตติง 1400 ถามโอกาสชนะของผู้เล่น A ผลลัพธ์ที่พิมพ์ออกมาคือข้อใด?",
      en: "Player A rating is 1600, Player B is 1400. What is the printed expected score for player A?",
    },
    stdin: "1600\n1400\nA\n",
    options: [
      {
        id: "a",
        label: { th: "0.76", en: "0.76" },
        why: { th: "ถูกต้อง — คำนวณได้ประมาณ 0.7597 จัดรูปทศนิยม 2 ตำแหน่งปัดเป็น 0.76", en: "Correct — computes to ~0.7597, rounded to 2 decimal places is 0.76." },
      },
      {
        id: "b",
        label: { th: "0.24", en: "0.24" },
        why: { th: "ผิด — 0.24 คือโอกาสชนะของผู้เล่น B (ผู้เล่นที่เรตติงต่ำกว่า)", en: "Wrong — 0.24 is the probability for Player B (the lower-rated player)." },
      },
      {
        id: "c",
        label: { th: "0.75", en: "0.75" },
        why: { th: "ผิด — ปัดเศษไม่ถูกต้อง (0.7597 ต้องปัดขึ้นเป็น 0.76)", en: "Wrong — incorrect rounding (0.7597 rounds up to 0.76)." },
      },
      {
        id: "d",
        label: { th: "0.80", en: "0.80" },
        why: { th: "ผิด — ค่าคลาดเคลื่อนจากสูตรจริง", en: "Wrong — deviates from the true formula result." },
      },
    ],
    correctId: "a",
    sourceRef: "problem.md §4 (Case 2)",
  },
  {
    id: "2997-q5",
    kind: "spot-the-bug",
    prompt: {
      th: "ฟังก์ชันคำนวณด้านล่างนี้มีจุดบกพร่องทางคณิตศาสตร์ใด?",
      en: "What mathematical bug exists in the helper function below?",
    },
    snippet: 'def expected_score(rating, opponent_rating):\n    return 1 / (1 + 10 ** (opponent_rating - rating / 400))',
    options: [
      {
        id: "a",
        label: { th: "ขาดวงเล็บรอบ (opponent_rating - rating) ทำให้ rating / 400 ถูกหารก่อน", en: "Missing parentheses around (opponent_rating - rating); rating / 400 evaluates first" },
        why: { th: "ถูกต้อง — ต้องเขียน `((opponent_rating - rating) / 400)` เพื่อให้ลบผลต่างเรตติงก่อนหารด้วย 400", en: "Correct — must be `((opponent_rating - rating) / 400)` to subtract before dividing." },
      },
      {
        id: "b",
        label: { th: "ต้องใช้เครื่องหมาย `^` แทน `**`", en: "Must use `^` instead of `**`" },
        why: { th: "ผิด — ใน Python `^` คือ Bitwise XOR ไม่ใช่เลขยกกำลัง", en: "Wrong — `^` is bitwise XOR in Python, not exponentiation." },
      },
      {
        id: "c",
        label: { th: "สูตรต้องคูณด้วย 100 ก่อนคืนค่า", en: "The formula must multiply by 100 before returning" },
        why: { th: "ผิด — สูตร Elo คืนค่าความน่าจะเป็น 0.00 ถึง 1.00 ไม่ใช่เปอร์เซ็นต์เต็มร้อย", en: "Wrong — Elo returns probability between 0.00 and 1.00." },
      },
      {
        id: "d",
        label: { th: "ฟังก์ชันห้ามมีพารามิเตอร์ 2 ตัว", en: "Functions cannot accept 2 parameters" },
        why: { th: "ผิด — ฟังก์ชันใน Python สามารถรับพารามิเตอร์ได้หลายตัวตามต้องการ", en: "Wrong — Python functions can take multiple arguments normally." },
      },
    ],
    correctId: "a",
    sourceRef: "main.py:6",
  },
  {
    id: "2997-q6",
    kind: "pep8",
    prompt: {
      th: "ตามมาตรฐาน PEP-8 ควรเว้นบรรทัดว่างกี่บรรทัดระหว่างฟังก์ชันระดับบนสุด (Top-level functions)?",
      en: "According to PEP-8, how many blank lines should separate top-level functions?",
    },
    options: [
      {
        id: "a",
        label: { th: "2 บรรทัดว่าง", en: "2 blank lines" },
        why: { th: "ถูกต้อง — PEP-8 ระบุชัดเจนว่า top-level functions และ classes ต้องคั่นด้วย 2 blank lines เสมอ", en: "Correct — PEP-8 specifies exactly 2 blank lines between top-level functions/classes." },
      },
      {
        id: "b",
        label: { th: "1 บรรทัดว่าง", en: "1 blank line" },
        why: { th: "ผิด — 1 บรรทัดว่างใช้สำหรับคั่นเมธอดภายใน class ไม่ใช่ฟังก์ชันระดับนอกสุด", en: "Wrong — 1 blank line is used between methods inside a class." },
      },
      {
        id: "c",
        label: { th: "ไม่ต้องเว้นบรรทัดเลย", en: "No blank lines" },
        why: { th: "ผิด — จะทำให้เกิด PEP-8 warning E302", en: "Wrong — triggers PEP-8 warning E302 expected 2 blank lines." },
      },
      {
        id: "d",
        label: { th: "3 บรรทัดว่างขึ้นไป", en: "3 or more blank lines" },
        why: { th: "ผิด — เว้นเกิน 2 บรรทัดจะเกิด warning E303 too many blank lines", en: "Wrong — triggers PEP-8 warning E303 too many blank lines." },
      },
    ],
    correctId: "a",
    sourceRef: "problem.md §3",
  },
];

// ---------------------------------------------------------------------------
// 2998 — EuclideanDistance2D
// ---------------------------------------------------------------------------
const euclidean: QuizQuestion[] = [
  {
    id: "2998-q1",
    kind: "mcq",
    prompt: {
      th: "โจทย์ EuclideanDistance2D รับข้อมูลเข้า 4 บรรทัดในลำดับใด?",
      en: "In what order does EuclideanDistance2D read its 4 input lines?",
    },
    options: [
      {
        id: "a",
        label: { th: "q1, q2, p1, p2 (พิกัดจุด Q ก่อน แล้วตามด้วยจุด P)", en: "q1, q2, p1, p2 (Point Q coordinates followed by Point P)" },
        why: { th: "ถูกต้อง — ตรงตามสเปกโจทย์ที่กำหนดให้อ่าน q1, q2, p1, p2 ตามลำดับ", en: "Correct — matches the problem specification reading q1, q2, p1, p2 in order." },
      },
      {
        id: "b",
        label: { th: "p1, p2, q1, q2 (พิกัดจุด P ก่อน แล้วตามด้วยจุด Q)", en: "p1, p2, q1, q2 (Point P coordinates followed by Point Q)" },
        why: { th: "ผิด — สลับลำดับจุด", en: "Wrong — swapped point ordering." },
      },
      {
        id: "c",
        label: { th: "q1, p1, q2, p2 (พิกัดแกน x ทั้งหมดก่อน แล้วตามด้วยแกน y)", en: "q1, p1, q2, p2 (All x coordinates then all y coordinates)" },
        why: { th: "ผิด — โจทย์อ่านพิกัดทีละจุด (q1, q2) แล้วจึง (p1, p2)", en: "Wrong — problem reads coordinates by point pair." },
      },
      {
        id: "d",
        label: { th: "รับค่าทั้ง 4 ตัวในบรรทัดเดียวคั่นด้วยช่องว่าง", en: "Reads all 4 numbers on a single line separated by spaces" },
        why: { th: "ผิด — โจทย์ระบุว่ารับ 4 บรรทัด บรรทัดละ 1 ตัวเลข", en: "Wrong — problem specifies 4 separate lines." },
      },
    ],
    correctId: "a",
    sourceRef: "problem.md §2",
  },
  {
    id: "2998-q2",
    kind: "mcq",
    prompt: {
      th: "ผลลัพธ์ของ EuclideanDistance2D ต้องจัดรูปแบบทศนิยมหรือไม่?",
      en: "Does EuclideanDistance2D require rounding or decimal formatting on its output?",
    },
    options: [
      {
        id: "a",
        label: { th: "ไม่ต้องจัดรูปแบบ ให้พิมพ์ค่า Float เต็มความแม่นยำออกมาโดยตรง", en: "No formatting required; print the full-precision float directly" },
        why: { th: "ถูกต้อง — โจทย์ข้อนี้ต้องการค่า Float ดิบที่คำนวณได้ ห้ามใช้ round() หรือ :.2f", en: "Correct — this problem expects the raw float without rounding or fixed decimals." },
      },
      {
        id: "b",
        label: { th: "ต้องปัดเศษเป็นจำนวนเต็มด้วย int()", en: "Must truncate to an integer with int()" },
        why: { th: "ผิด — ระยะทางแบบยูคลิดต้องเป็นจำนวนจริง (Float)", en: "Wrong — Euclidean distance is a continuous floating-point value." },
      },
      {
        id: "c",
        label: { th: "ต้องจัดทศนิยม 2 ตำแหน่งเสมอ", en: "Must always format to 2 decimal places" },
        why: { th: "ผิด — การปัดเป็น 2 ตำแหน่งจะทำให้ Testcase ที่ตรวจทศนิยมละเอียดไม่ผ่าน", en: "Wrong — rounding to 2 decimals will fail high-precision test cases." },
      },
      {
        id: "d",
        label: { th: "ต้องแปลงเป็นสตริงแล้วเติมคำว่า 'units' ต่อท้าย", en: "Must append 'units' to the output string" },
        why: { th: "ผิด — พิมพ์เฉพาะตัวเลขเท่านั้น", en: "Wrong — print the numeric output only." },
      },
    ],
    correctId: "a",
    sourceRef: "problem.md §3",
  },
  {
    id: "2998-q3",
    kind: "predict-output",
    prompt: {
      th: "คำนวณระยะทางระหว่างจุด Q(0, 0) และ P(3, 4) ผลลัพธ์ที่ได้คือข้อใด?",
      en: "Calculate Euclidean distance between Q(0, 0) and P(3, 4). What is the output?",
    },
    stdin: "0\n0\n3\n4\n",
    options: [
      {
        id: "a",
        label: { th: "5.0", en: "5.0" },
        why: { th: "ถูกต้อง — sqrt((0-3)**2 + (0-4)**2) = sqrt(9 + 16) = sqrt(25) = 5.0", en: "Correct — sqrt((0-3)**2 + (0-4)**2) = sqrt(25) = 5.0." },
      },
      {
        id: "b",
        label: { th: "5", en: "5" },
        why: { th: "ผิด — math.sqrt() หรือ ** 0.5 ใน Python ให้ผลลัพธ์เป็น float (5.0)", en: "Wrong — square root operations in Python return a float (5.0)." },
      },
      {
        id: "c",
        label: { th: "25.0", en: "25.0" },
        why: { th: "ผิด — นี่คือค่ากำลังสองก่อนถอดสแควร์รูท", en: "Wrong — this is the squared sum before taking the square root." },
      },
      {
        id: "d",
        label: { th: "7.0", en: "7.0" },
        why: { th: "ผิด — 3 + 4 = 7 คือ Manhattan distance ไม่ใช่ Euclidean distance", en: "Wrong — 3 + 4 = 7 is Manhattan distance, not Euclidean." },
      },
    ],
    correctId: "a",
    sourceRef: "problem.md §4 (Case 1)",
  },
  {
    id: "2998-q4",
    kind: "predict-output",
    prompt: {
      th: "คำนวณระยะทางระหว่างจุด Q(1, 1) และ P(4, 5) ผลลัพธ์ที่ได้คือข้อใด?",
      en: "Calculate Euclidean distance between Q(1, 1) and P(4, 5). What is the output?",
    },
    stdin: "1\n1\n4\n5\n",
    options: [
      {
        id: "a",
        label: { th: "5.0", en: "5.0" },
        why: { th: "ถูกต้อง — sqrt((1-4)**2 + (1-5)**2) = sqrt((-3)**2 + (-4)**2) = sqrt(9 + 16) = 5.0", en: "Correct — sqrt((-3)**2 + (-4)**2) = sqrt(25) = 5.0." },
      },
      {
        id: "b",
        label: { th: "-5.0", en: "-5.0" },
        why: { th: "ผิด — ระยะทางมีค่าเป็นบวกเสมอ", en: "Wrong — distance is strictly non-negative." },
      },
      {
        id: "c",
        label: { th: "7.0", en: "7.0" },
        why: { th: "ผิด — ผลต่างแกน x คือ 3 และแกน y คือ 4 ระยะทางต้องเป็น 5.0", en: "Wrong — dx is 3 and dy is 4, yielding distance 5.0." },
      },
      {
        id: "d",
        label: { th: "5.00", en: "5.00" },
        why: { th: "ผิด — ไม่มีการจัดฟอร์แมตทศนิยม 2 ตำแหน่ง", en: "Wrong — default float representation is 5.0." },
      },
    ],
    correctId: "a",
    sourceRef: "problem.md §4 (Case 2)",
  },
  {
    id: "2998-q5",
    kind: "spot-the-bug",
    prompt: {
      th: "โค้ดคำนวณระยะทางด้านล่างนี้มีข้อผิดพลาดตรงจุดใด?",
      en: "Where is the bug in the distance calculation below?",
    },
    snippet: 'distance = math.sqrt((q1 - q2) ** 2 + (p1 - p2) ** 2)',
    options: [
      {
        id: "a",
        label: { th: "นำพิกัดจุดเดียวกันมาลบกัน (q1 - q2) ที่ถูกต้องคือแกนเดียวกันต่างจุด (q1 - p1)", en: "Subtracted axes of the same point (q1 - q2); must be corresponding axes across points (q1 - p1)" },
        why: { th: "ถูกต้อง — สูตรคือ $\\sqrt{(q_1 - p_1)^2 + (q_2 - p_2)^2}$ ต้องนำแกน x ลบแกน x และแกน y ลบแกน y", en: "Correct — formula requires $(q1 - p1)^2 + (q2 - p2)^2$ across point pairs." },
      },
      {
        id: "b",
        label: { th: "math.sqrt ต้องส่งค่าเป็นจำนวนเต็มเท่านั้น", en: "math.sqrt only accepts integers" },
        why: { th: "ผิด — math.sqrt รับ float ได้", en: "Wrong — math.sqrt accepts floats cleanly." },
      },
      {
        id: "c",
        label: { th: "ห้ามใช้เลขยกกำลัง `** 2` ภายใน math.sqrt", en: "Cannot use `** 2` inside math.sqrt" },
        why: { th: "ผิด — นิพจน์ภายในวงเล็บคำนวณได้ตามปกติ", en: "Wrong — standard mathematical expression in Python." },
      },
      {
        id: "d",
        label: { th: "ต้องใช้เครื่องหมายลบคั่นระหว่างเทอมแทนเครื่องหมายบวก", en: "Must use minus between the two terms instead of plus" },
        why: { th: "ผิด — ทฤษฎีพีทาโกรัสใช้การบวกกำลังสอง $a^2 + b^2$", en: "Wrong — Pythagorean theorem adds squared components." },
      },
    ],
    correctId: "a",
    sourceRef: "main.py:13",
  },
  {
    id: "2998-q6",
    kind: "pep8",
    prompt: {
      th: "ตามมาตรฐาน PEP-8 การ import โมดูล `math` ควรวางไว้ตำแหน่งใด?",
      en: "According to PEP-8, where should the `import math` statement be placed?",
    },
    options: [
      {
        id: "a",
        label: { th: "บนสุดของไฟล์ ก่อนนิยามฟังก์ชันใด ๆ", en: "At the top of the file, before any function definitions" },
        why: { th: "ถูกต้อง — PEP-8 ระบุว่า imports ต้องอยู่บนสุดของไฟล์เสมอ ถัดจาก docstring ประจำโมดูล", en: "Correct — PEP-8 dictates imports at the top of the file following module docstrings." },
      },
      {
        id: "b",
        label: { th: "ข้างในฟังก์ชัน main() ตรงบรรทัดที่ใช้งาน", en: "Inside main() right where it is first used" },
        why: { th: "ผิด — PEP-8 ไม่แนะนำให้ import ภายในฟังก์ชันยกเว้นกรณีพิเศษเรื่อง circular import", en: "Wrong — PEP-8 discourages function-level imports for standard modules." },
      },
      {
        id: "c",
        label: { th: "ล่างสุดของไฟล์", en: "At the very bottom of the file" },
        why: { th: "ผิด — จะทำให้เกิด NameError หากฟังก์ชันถูกเรียกก่อน import", en: "Wrong — causes NameError and violates PEP-8." },
      },
      {
        id: "d",
        label: { th: "ต่อท้ายบรรทัดที่เรียกใช้ เช่น distance = math.sqrt(...) import math", en: "Appended to the line calling it" },
        why: { th: "ผิด — ผิดไวยากรณ์ของภาษา Python (SyntaxError)", en: "Wrong — invalid Python syntax." },
      },
    ],
    correctId: "a",
    sourceRef: "problem.md §3",
  },
];

// ---------------------------------------------------------------------------
// 3019 — Safe Password
// ---------------------------------------------------------------------------
const safePassword: QuizQuestion[] = [
  {
    id: "3019-q1",
    kind: "mcq",
    prompt: {
      th: "ทำไมใน Safe Password ต้องตรวจสอบ `if char_ok and digit_ok:` เป็นเงื่อนไขแรก?",
      en: "Why must `if char_ok and digit_ok:` be checked first in Safe Password?",
    },
    options: [
      {
        id: "a",
        label: { th: "เพราะเป็นเงื่อนไขที่เจาะจงที่สุด (ผ่านทั้งคู่) ถ้าเช็กเงื่อนไขเดี่ยวก่อน จะเข้า branch ผิดพลาด", en: "Because it is the most specific condition (both pass); checking single matches first causes false partial locks" },
        why: { th: "ถูกต้อง — ถ้าเช็ก `if char_ok:` ก่อน กรณีที่ถูกทั้งคู่จะเข้าเงื่อนไขแรกแล้วบอกว่าให้เปลี่ยน digit ทันที", en: "Correct — if single match is checked first, a fully correct login triggers partial match instead." },
      },
      {
        id: "b",
        label: { th: "เพราะรหัสผ่านที่ถูกต้องต้องมีความยาว 4 หลัก", en: "Because valid passwords must be 4 digits long" },
        why: { th: "ผิด — นี่คือเหตุผลทางตรรกะของเงื่อนไข ไม่ใช่เรื่องความยาวสตริง", en: "Wrong — this is a logical branching decision." },
      },
      {
        id: "c",
        label: { th: "เพราะ Python บังคับให้ใช้ตัวดำเนินการ and ก่อน or เสมอ", en: "Because Python requires and operators before or" },
        why: { th: "ผิด — ไม่เกี่ยวกับไวยากรณ์บังคับ แต่เป็นเรื่องลำดับผลลัพธ์ที่ถูกต้อง", en: "Wrong — this is control flow logic, not syntax enforcement." },
      },
      {
        id: "d",
        label: { th: "เพราะช่วยลดการใช้หน่วยความจำ RAM", en: "Because it optimizes RAM usage" },
        why: { th: "ผิด — การสลับเงื่อนไข if-elif ไม่ได้ส่งผลต่อการประหยัด RAM", en: "Wrong — condition ordering does not impact memory allocation." },
      },
    ],
    correctId: "a",
    sourceRef: "problem.md §3",
  },
  {
    id: "3019-q2",
    kind: "mcq",
    prompt: {
      th: "ทำไม PIN '4567' จึงควรเก็บเป็นสตริง (str) แทนที่จะแปลงเป็นจำนวนเต็ม (int)?",
      en: "Why should the PIN '4567' be stored as a string (str) rather than an integer (int)?",
    },
    options: [
      {
        id: "a",
        label: { th: "input() คืนค่าสตริงอยู่แล้ว เปรียบเทียบเป็นสตริงได้โดยตรงและปลอดภัยต่อเลข 0 นำหน้า", en: "input() returns a string; comparing directly avoids conversion overhead and preserves leading zeros" },
        why: { th: "ถูกต้อง — รหัสผ่าน/PIN มักมีเลข 0 นำหน้าได้ และการเทียบ str กับ str ตรง ๆ ปลอดภัยกว่า", en: "Correct — PINs may contain leading zeros, and comparing raw strings avoids type conversion bugs." },
      },
      {
        id: "b",
        label: { th: "เพราะ Python ไม่รองรับจำนวนเต็มเกิน 1000", en: "Because Python does not support integers larger than 1000" },
        why: { th: "ผิด — Python รองรับจำนวนเต็มขนาดไม่จำกัด (Arbitrary Precision)", en: "Wrong — Python supports arbitrarily large integers." },
      },
      {
        id: "c",
        label: { th: "เพราะตัวดำเนินการ == ใช้กับ int ไม่ได้", en: "Because == operator cannot be used on ints" },
        why: { th: "ผิด — `==` ใช้เปรียบเทียบ int ได้ตามปกติ", en: "Wrong — `==` compares integers cleanly." },
      },
      {
        id: "d",
        label: { th: "เพราะโจทย์บังคับให้ตั้งชื่อตัวแปรเป็น str เท่านั้น", en: "Because problem requires variable names to be strings" },
        why: { th: "ผิด — ไม่มีการบังคับดังกล่าว", en: "Wrong — no such restriction exists." },
      },
    ],
    correctId: "a",
    sourceRef: "problem.md §1",
  },
  {
    id: "3019-q3",
    kind: "predict-output",
    prompt: {
      th: "ตัวอักษรคือ 'H' และรหัส PIN คือ '4567' ผลลัพธ์ที่พิมพ์ออกมาคือข้อใด?",
      en: "Character is 'H' and PIN is '4567'. What is the printed output?",
    },
    stdin: "H\n4567\n",
    options: [
      {
        id: "a",
        label: { th: "safe unlocked", en: "safe unlocked" },
        why: { th: "ถูกต้อง — ทั้งตัวอักษร 'H' และรหัส '4567' ถูกต้องทั้งคู่ ปลดล็อกสำเร็จ", en: "Correct — both character 'H' and PIN '4567' match successfully." },
      },
      {
        id: "b",
        label: { th: "safe locked - change digit", en: "safe locked - change digit" },
        why: { th: "ผิด — รหัสตัวเลขถูกต้องแล้ว ไม่ต้องเปลี่ยน digit", en: "Wrong — the PIN is correct." },
      },
      {
        id: "c",
        label: { th: "safe locked - change char", en: "safe locked - change char" },
        why: { th: "ผิด — ตัวอักษรถูกต้องแล้ว ไม่ต้องเปลี่ยน char", en: "Wrong — the character is correct." },
      },
      {
        id: "d",
        label: { th: "safe locked", en: "safe locked" },
        why: { th: "ผิด — เข้าเงื่อนไขปลดล็อกสำเร็จ", en: "Wrong — matches unlocked condition." },
      },
    ],
    correctId: "a",
    sourceRef: "problem.md §4 (Case 1)",
  },
  {
    id: "3019-q4",
    kind: "predict-output",
    prompt: {
      th: "ตัวอักษรคือ 'H' และรหัส PIN คือ '1234' ผลลัพธ์ที่พิมพ์ออกมาคือข้อใด?",
      en: "Character is 'H' and PIN is '1234'. What is the printed output?",
    },
    stdin: "H\n1234\n",
    options: [
      {
        id: "a",
        label: { th: "safe locked - change digit", en: "safe locked - change digit" },
        why: { th: "ถูกต้อง — ตัวอักษร 'H' ถูกต้อง แต่รหัสตัวเลขผิด แจ้งให้เปลี่ยนตัวเลข", en: "Correct — character matches but PIN is incorrect, prompting to change digit." },
      },
      {
        id: "b",
        label: { th: "safe locked - change char", en: "safe locked - change char" },
        why: { th: "ผิด — ตัวอักษรถูกต้องแล้ว", en: "Wrong — character is already correct." },
      },
      {
        id: "c",
        label: { th: "safe unlocked", en: "safe unlocked" },
        why: { th: "ผิด — รหัสผิด ปลดล็อกไม่ได้", en: "Wrong — PIN is wrong; cannot unlock." },
      },
      {
        id: "d",
        label: { th: "safe locked", en: "safe locked" },
        why: { th: "ผิด — ตัวอักษรถูก 1 อย่าง ต้องแจ้งเจาะจงว่า change digit ไม่ใช่ locked ทั่วไป", en: "Wrong — partial match requires the specific 'change digit' message." },
      },
    ],
    correctId: "a",
    sourceRef: "problem.md §4 (Case 2)",
  },
  {
    id: "3019-q5",
    kind: "spot-the-bug",
    prompt: {
      th: "โครงสร้าง if-elif ด้านล่างนี้มีข้อบกพร่องทางตรรกะอย่างไร?",
      en: "What logical flaw exists in the if-elif structure below?",
    },
    snippet: 'if char_ok:\n    print("safe locked - change digit")\nelif char_ok and digit_ok:\n    print("safe unlocked")',
    options: [
      {
        id: "a",
        label: { th: "เมื่อถูกต้องทั้งคู่ จะติดเงื่อนไขแรก (char_ok) ทำให้ 'safe unlocked' ไม่มีวันทำงาน", en: "When both are correct, the first branch triggers and 'safe unlocked' can never execute" },
        why: { th: "ถูกต้อง — เงื่อนไขรวม `char_ok and digit_ok` ต้องอยู่ก่อนเงื่อนไขเดี่ยวเสมอ", en: "Correct — combined condition must precede single conditions." },
      },
      {
        id: "b",
        label: { th: "ต้องใช้เครื่องหมาย & แทนคำว่า and", en: "Must use & instead of and" },
        why: { th: "ผิด — & คือ Bitwise AND ส่วน and คือ Logical AND", en: "Wrong — & is bitwise AND, while and is logical AND." },
      },
      {
        id: "c",
        label: { th: "ใน Python ห้ามใช้ elif หลัง if", en: "Python does not allow elif after if" },
        why: { th: "ผิด — elif เป็นโครงสร้างมาตรฐานของ Python", en: "Wrong — elif is standard Python syntax." },
      },
      {
        id: "d",
        label: { th: "print ต้องใช้เครื่องหมาย single quote เท่านั้น", en: "print must use single quotes only" },
        why: { th: "ผิด — ภาษา Python ใช้ double quote หรือ single quote ก็ได้ผลเหมือนกัน", en: "Wrong — single and double quotes are interchangeable in Python." },
      },
    ],
    correctId: "a",
    sourceRef: "main.py:15-18",
  },
  {
    id: "3019-q6",
    kind: "pep8",
    prompt: {
      th: "ตามมาตรฐาน PEP-8 ค่าคงที่ระดับโมดูล (Constants) เช่น รหัสผ่านที่ถูกต้อง ควรตั้งชื่ออย่างไร?",
      en: "According to PEP-8, how should module-level constants be named?",
    },
    options: [
      {
        id: "a",
        label: { th: "UPPER_SNAKE_CASE เช่น CORRECT_CHAR, CORRECT_DIGIT", en: "UPPER_SNAKE_CASE such as CORRECT_CHAR, CORRECT_DIGIT" },
        why: { th: "ถูกต้อง — PEP-8 ระบุให้ค่าคงที่ระดับโมดูลใช้ตัวพิมพ์ใหญ่ทั้งหมดคั่นด้วยขีดล่าง", en: "Correct — PEP-8 dictates all-caps with underscores for module constants." },
      },
      {
        id: "b",
        label: { th: "camelCase เช่น correctChar, correctDigit", en: "camelCase such as correctChar, correctDigit" },
        why: { th: "ผิด — camelCase นิยมใน JavaScript/Java ไม่ใช่มาตรฐานของ Python", en: "Wrong — camelCase is non-standard in Python." },
      },
      {
        id: "c",
        label: { th: "kebab-case เช่น correct-char", en: "kebab-case such as correct-char" },
        why: { th: "ผิด — เครื่องหมายลบจะถูกมองเป็นตัวดำเนินการทางคณิตศาสตร์ใน Python", en: "Wrong — hyphens cause SyntaxError in variable names." },
      },
      {
        id: "d",
        label: { th: "ขึ้นต้นด้วยตัวเลข เช่น 1st_char", en: "Leading digits such as 1st_char" },
        why: { th: "ผิด — ตัวแปรใน Python ห้ามขึ้นต้นด้วยตัวเลข", en: "Wrong — identifier cannot start with digits." },
      },
    ],
    correctId: "a",
    sourceRef: "problem.md §3",
  },
];

// ---------------------------------------------------------------------------
// 3020 — Coke
// ---------------------------------------------------------------------------
const coke: QuizQuestion[] = [
  {
    id: "3020-q1",
    kind: "mcq",
    prompt: {
      th: "ในสูตรคำนวณโปรโมชันโค้ก ทำไมต้องคำนวณจำนวนขวดโปรโมชันจาก `max(bottles_wanted - 1, 0) // caps_needed`?",
      en: "Why is the number of promo bottles calculated from `max(bottles_wanted - 1, 0) // caps_needed`?",
    },
    options: [
      {
        id: "a",
        label: { th: "เพราะขวดแรกต้องซื้อราคาเต็มก่อนเสมอ จึงมีฝาเริ่มต้นสำหรับแลกในขวดถัดไป", en: "Because the very first bottle must be bought at full price to gain caps for subsequent exchanges" },
        why: { th: "ถูกต้อง — ไม่สามารถนำฝาในอนาคตมาแลกขวดแรกได้ จึงต้องหัก 1 ออกก่อนคำนวณรอบการแลก", en: "Correct — you cannot use future caps on bottle #1, requiring (d - 1) // b." },
      },
      {
        id: "b",
        label: { th: "เพราะระบบจะแถมโค้กฟรี 1 ขวดให้ลูกค้าทุกคน", en: "Because the store gives 1 free Coke to every customer" },
        why: { th: "ผิด — ไม่มีการแถมฟรีโดยไม่ใช้ฝาแลก", en: "Wrong — promotions strictly require bottle caps." },
      },
      {
        id: "c",
        label: { th: "เพื่อป้องกันไม่ให้ค่าติดลบเมื่อ b = 0", en: "To prevent negative numbers when b = 0" },
        why: { th: "ผิด — กรณี b = 0 ต้องแยกเช็กเพื่อป้องกัน ZeroDivisionError", en: "Wrong — b = 0 is guarded separately against ZeroDivisionError." },
      },
      {
        id: "d",
        label: { th: "เพราะเป็นกฎบังคับของฟังก์ชัน max ใน Python", en: "Because max() requires this syntax in Python" },
        why: { th: "ผิด — max(d - 1, 0) ใช้กันกรณี d = 0 ไม่ใช่กฎของฟังก์ชัน", en: "Wrong — max(d - 1, 0) simply guards against d = 0 edge case." },
      },
    ],
    correctId: "a",
    sourceRef: "problem.md §3",
  },
  {
    id: "3020-q2",
    kind: "mcq",
    prompt: {
      th: "ถ้าจำนวนฝาที่ต้องใช้แลก `caps_needed = 0` (b = 0) โปรแกรมต้องจัดการอย่างไร?",
      en: "If the caps required `caps_needed = 0` (b = 0), how must the program handle it?",
    },
    options: [
      {
        id: "a",
        label: { th: "กำหนดขวดโปรโมชันเป็น 0 เพื่อหลีกเลี่ยง ZeroDivisionError และคิดราคาเต็มทุกขวด", en: "Set promo bottles to 0 to avoid ZeroDivisionError and charge full price for all bottles" },
        why: { th: "ถูกต้อง — b = 0 หมายถึงไม่มีโปรโมชันแลกฝา และการหารด้วย 0 จะทำให้โปรแกรมแครชทันที", en: "Correct — b = 0 means no promotion, and dividing by 0 raises ZeroDivisionError." },
      },
      {
        id: "b",
        label: { th: "ให้ทุกขวดได้ราคาโปรโมชันทั้งหมด", en: "Apply promo price to every bottle" },
        why: { th: "ผิด — b = 0 คือแลกฝาไม่ได้ ไม่ใช่ได้ราคาพิเศษฟรี", en: "Wrong — b = 0 means exchange is not offered." },
      },
      {
        id: "c",
        label: { th: "โยนข้อผิดพลาด ValueError", en: "Raise a ValueError immediately" },
        why: { th: "ผิด — โปรแกรมต้องพิมพ์ราคาที่ถูกต้อง (d * a) ออกมาได้ ไม่แครช", en: "Wrong — program must output full price cleanly." },
      },
      {
        id: "d",
        label: { th: "พิมพ์ค่า 0 เสมอ", en: "Always print 0" },
        why: { th: "ผิด — ลูกค้ายังต้องจ่ายราคาปกติของโค้ก", en: "Wrong — customer still pays normal price." },
      },
    ],
    correctId: "a",
    sourceRef: "main.py:11-13",
  },
  {
    id: "3020-q3",
    kind: "predict-output",
    prompt: {
      th: "ราคาปกติขวดละ 10 บาท, ใช้ 4 ฝาแลกซื้อในราคา 5 บาท, ต้องการโค้ก 10 ขวด ต้องจ่ายเงินทั้งหมดกี่บาท?",
      en: "Normal price = 10, 4 caps needed for 5 baht promo price, want 10 bottles. What is the total cost?",
    },
    stdin: "10\n4\n5\n10\n",
    options: [
      {
        id: "a",
        label: { th: "90", en: "90" },
        why: { th: "ถูกต้อง — (10 - 1) // 4 = 2 ขวดโปรโมชัน (2 * 5 = 10) + 8 ขวดราคาปกติ (8 * 10 = 80) รวมเป็น 90 บาท", en: "Correct — (10 - 1) // 4 = 2 promo bottles (2*5=10) + 8 normal bottles (8*10=80) = 90." },
      },
      {
        id: "b",
        label: { th: "100", en: "100" },
        why: { th: "ผิด — 100 คือราคาเต็มเมื่อไม่ใช้โปรโมชัน", en: "Wrong — 100 is full price without promo." },
      },
      {
        id: "c",
        label: { th: "85", en: "85" },
        why: { th: "ผิด — คำนวณขวดโปรโมชันเกินจริง (ถ้าคิด 10 // 4 = 2.5)", en: "Wrong — calculation error." },
      },
      {
        id: "d",
        label: { th: "50", en: "50" },
        why: { th: "ผิด — นี่คือราคาหากทุกขวดได้ลดราคาโปรโมชัน", en: "Wrong — this would be all bottles at promo price." },
      },
    ],
    correctId: "a",
    sourceRef: "problem.md §4 (Case 1)",
  },
  {
    id: "3020-q4",
    kind: "predict-output",
    prompt: {
      th: "ราคาปกติขวดละ 10 บาท, ไม่ร่วมโปรโมชัน (b = 0, c = 0), ต้องการโค้ก 5 ขวด ต้องจ่ายเงินทั้งหมดกี่บาท?",
      en: "Normal price = 10, no promo (b = 0, c = 0), want 5 bottles. What is the total cost?",
    },
    stdin: "10\n0\n0\n5\n",
    options: [
      {
        id: "a",
        label: { th: "50", en: "50" },
        why: { th: "ถูกต้อง — b = 0 ทำให้ซื้อราคาปกติทั้ง 5 ขวด (5 * 10 = 50 บาท)", en: "Correct — b = 0 forces full price on all 5 bottles (5 * 10 = 50)." },
      },
      {
        id: "b",
        label: { th: "0", en: "0" },
        why: { th: "ผิด — สินค้ามีราคาขวดละ 10 บาท", en: "Wrong — bottles cost 10 baht each." },
      },
      {
        id: "c",
        label: { th: "ZeroDivisionError", en: "ZeroDivisionError" },
        why: { th: "ผิด — โค้ดที่ถูกต้องมีเงื่อนไข `if caps_needed == 0:` ป้องกันการหารด้วยศูนย์", en: "Wrong — proper code guards against ZeroDivisionError." },
      },
      {
        id: "d",
        label: { th: "40", en: "40" },
        why: { th: "ผิด — คำนวณไม่ถูกต้อง", en: "Wrong — incorrect calculation." },
      },
    ],
    correctId: "a",
    sourceRef: "problem.md §4 (Case 2)",
  },
  {
    id: "3020-q5",
    kind: "spot-the-bug",
    prompt: {
      th: "โค้ดคำนวณด้านล่างนี้มีข้อผิดพลาดตรงจุดใด?",
      en: "What bug exists in the calculation snippet below?",
    },
    snippet: 'promo_bottles = bottles_wanted // caps_needed\nnormal_bottles = bottles_wanted - promo_bottles',
    options: [
      {
        id: "a",
        label: { th: "ลืมหัก 1 ออกจากจำนวนขวดก่อนหาร ทำให้ใช้ฝาล่วงหน้าแลกขวดแรกได้", en: "Forgot to subtract 1 from bottles_wanted; allows using future caps prematurely" },
        why: { th: "ถูกต้อง — ต้องใช้ `(bottles_wanted - 1) // caps_needed` เพื่อสะท้อนความจริงว่าขวดแรกต้องซื้อราคาเต็มก่อน", en: "Correct — must be `(bottles_wanted - 1) // caps_needed`." },
      },
      {
        id: "b",
        label: { th: "ต้องใช้เครื่องหมาย `/` แทน `//`", en: "Must use `/` instead of `//`" },
        why: { th: "ผิด — จำนวนขวดต้องเป็นจำนวนเต็ม จึงต้องใช้การหารปัดเศษลง `//`", en: "Wrong — bottle count must be integer floor division `//`." },
      },
      {
        id: "c",
        label: { th: "normal_bottles ต้องบวกด้วย promo_bottles", en: "normal_bottles must add promo_bottles" },
        why: { th: "ผิด — ผลรวมของขวดปกติกับขวดโปรโมชันต้องเท่ากับจำนวนที่ต้องการซื้อ", en: "Wrong — sum of normal + promo must equal total wanted." },
      },
      {
        id: "d",
        label: { th: "สูตรนี้ถูกต้องสมบูรณ์แล้ว", en: "This formula is completely correct" },
        why: { th: "ผิด — มีข้อผิดพลาดในกรณีที่มีการแลกฝา", en: "Wrong — produces wrong counts when promo is available." },
      },
    ],
    correctId: "a",
    sourceRef: "main.py:16",
  },
  {
    id: "3020-q6",
    kind: "pep8",
    prompt: {
      th: "ตามมาตรฐาน PEP-8 การตั้งชื่อตัวแปรที่สื่อความหมายเช่น `normal_price`, `caps_needed` มีข้อดีกว่า `a`, `b` อย่างไร?",
      en: "Under PEP-8, why are descriptive names like `normal_price`, `caps_needed` better than `a`, `b`?",
    },
    options: [
      {
        id: "a",
        label: { th: "ช่วยให้อ่านโค้ดเข้าใจง่าย ไม่สับสนระหว่างราคาปกติ ราคาโปร และจำนวนฝา", en: "Improves readability and eliminates confusion between prices and cap counts" },
        why: { th: "ถูกต้อง — PEP-8 แนะนำให้อนุรักษ์ความชัดเจน อ่านเข้าใจได้ทันทีโดยไม่ต้องจำว่า a, b คืออะไร", en: "Correct — PEP-8 emphasizes self-documenting, meaningful variable names." },
      },
      {
        id: "b",
        label: { th: "ทำให้โปรแกรมทำงานได้เร็วกว่าตัวแปรตัวอักษรเดียว", en: "Makes the program run faster than single-letter names" },
        why: { th: "ผิด — ความยาวชื่อตัวแปรไม่มีผลต่อความเร็วการทำงานของโปรแกรม", en: "Wrong — variable name length does not affect runtime speed." },
      },
      {
        id: "c",
        label: { th: "เป็นข้อบังคับที่หากไม่ทำจะติด SyntaxError", en: "It is mandatory; otherwise Python throws a SyntaxError" },
        why: { th: "ผิด — Python อนุญาตให้ตั้งชื่อตัวแปรตัวเดียวได้ แต่ไม่เป็น Best Practice", en: "Wrong — single-letter names are syntactically valid but poor practice." },
      },
      {
        id: "d",
        label: { th: "ช่วยให้ตัวแปรเปลี่ยนชนิดข้อมูลเป็น float อัตโนมัติ", en: "Automatically casts variables to float" },
        why: { th: "ผิด — ชื่อตัวแปรไม่ส่งผลต่อ Type", en: "Wrong — variable names have no effect on data types." },
      },
    ],
    correctId: "a",
    sourceRef: "problem.md §3",
  },
];

// ---------------------------------------------------------------------------
// 3022 — Temperature
// ---------------------------------------------------------------------------
const temperature: QuizQuestion[] = [
  {
    id: "3022-q1",
    kind: "mcq",
    prompt: {
      th: "ทำไมการแปลงอุณหภูมิผ่านหน่วยกลาง (Celsius) จึงดีกว่าการเขียนสูตรแปลงระหว่างทุกคู่หน่วยตรง ๆ?",
      en: "Why is converting through a central unit (Celsius) better than pairwise formulas between all units?",
    },
    options: [
      {
        id: "a",
        label: { th: "เขียนสูตรเพียง 2N ฟังก์ชัน (เข้า/ออกเซลเซียส) แทนที่จะต้องเขียน N*(N-1) = 12 สูตร", en: "Requires only 2N conversions (to/from Celsius) instead of N*(N-1) = 12 pairwise formulas" },
        why: { th: "ถูกต้อง — รูปแบบ Hub-and-Spoke ช่วยลดจำนวนเงื่อนไขและโอกาสเขียนสูตรผิดพลาดได้อย่างมาก", en: "Correct — Hub-and-Spoke reduces logic complexity from O(N^2) to O(N)." },
      },
      {
        id: "b",
        label: { th: "เพราะองศาเซลเซียสเป็นหน่วยเดียวที่เก็บเป็น Float ได้", en: "Because Celsius is the only unit storable as a Float" },
        why: { th: "ผิด — ทุกหน่วยอุณหภูมิเก็บเป็น Float ในคอมพิวเตอร์ได้เหมือนกัน", en: "Wrong — all temperature values are stored as floats." },
      },
      {
        id: "c",
        label: { th: "เพราะกฎหมายระหว่างประเทศบังคับให้ใช้เซลเซียสในซอฟต์แวร์", en: "Because international law mandates Celsius in code" },
        why: { th: "ผิด — เป็นเรื่องของรูปแบบสถาปัตยกรรมโค้ด (Design Pattern) ล้วน ๆ", en: "Wrong — purely an architectural pattern decision." },
      },
      {
        id: "d",
        label: { th: "เพราะการคำนวณข้ามหน่วยโดยตรงจะทำให้เกิด OverflowError", en: "Because direct conversion triggers OverflowError" },
        why: { th: "ผิด — การแปลงเชิงเส้นไม่ทำให้เกิด overflow ในช่วงอุณหภูมิปกติ", en: "Wrong — linear formulas do not cause overflow." },
      },
    ],
    correctId: "a",
    sourceRef: "problem.md §3",
  },
  {
    id: "3022-q2",
    kind: "mcq",
    prompt: {
      th: "สูตรแปลงจากหน่วยเคลวิน (K) ไปเป็นเซลเซียส (C) ในฟังก์ชัน `to_celsius` คือข้อใด?",
      en: "What is the formula to convert Kelvin (K) to Celsius (C) in `to_celsius`?",
    },
    options: [
      {
        id: "a",
        label: { th: "value - 273.15", en: "value - 273.15" },
        why: { th: "ถูกต้อง — อุณหภูมิในหน่วยเซลเซียสคือ Kelvin ลบด้วย 273.15 (0 K = -273.15 °C)", en: "Correct — Celsius = Kelvin - 273.15 (0 K = -273.15 °C)." },
      },
      {
        id: "b",
        label: { th: "value + 273.15", en: "value + 273.15" },
        why: { th: "ผิด — นี่คือการแปลงจากเซลเซียสไปเป็นเคลวิน", en: "Wrong — this is Celsius to Kelvin." },
      },
      {
        id: "c",
        label: { th: "(value - 32) * 5 / 9", en: "(value - 32) * 5 / 9" },
        why: { th: "ผิด — นี่คือสูตรแปลงจากฟาเรนไฮต์ (F) เป็นเซลเซียส", en: "Wrong — this is Fahrenheit to Celsius." },
      },
      {
        id: "d",
        label: { th: "(value - 491.67) * 5 / 9", en: "(value - 491.67) * 5 / 9" },
        why: { th: "ผิด — นี่คือสูตรแปลงจากแรงคิน (R) เป็นเซลเซียส", en: "Wrong — this is Rankine to Celsius." },
      },
    ],
    correctId: "a",
    sourceRef: "main.py:9",
  },
  {
    id: "3022-q3",
    kind: "predict-output",
    prompt: {
      th: "แปลงอุณหภูมิ 100 องศาเซลเซียส (C) ไปเป็นฟาเรนไฮต์ (F) ผลลัพธ์ที่พิมพ์ออกมาคือข้อใด?",
      en: "Convert 100 °C to Fahrenheit (F). What is the printed output?",
    },
    stdin: "100\nC\nF\n",
    options: [
      {
        id: "a",
        label: { th: "212.00", en: "212.00" },
        why: { th: "ถูกต้อง — 100 * 9 / 5 + 32 = 180 + 32 = 212.00", en: "Correct — 100 * 9 / 5 + 32 = 212.00." },
      },
      {
        id: "b",
        label: { th: "212", en: "212" },
        why: { th: "ผิด — ต้องจัดทศนิยม 2 ตำแหน่งตามโจทย์ (212.00)", en: "Wrong — requires 2 decimal places (212.00)." },
      },
      {
        id: "c",
        label: { th: "180.00", en: "180.00" },
        why: { th: "ผิด — ลืมบวกด้วย 32 จุดเยือกแข็งของฟาเรนไฮต์", en: "Wrong — forgot to add 32." },
      },
      {
        id: "d",
        label: { th: "373.15", en: "373.15" },
        why: { th: "ผิด — 373.15 คือหน่วยเคลวิน (K) ไม่ใช่ฟาเรนไฮต์ (F)", en: "Wrong — 373.15 is Kelvin, not Fahrenheit." },
      },
    ],
    correctId: "a",
    sourceRef: "problem.md §4 (Case 1)",
  },
  {
    id: "3022-q4",
    kind: "predict-output",
    prompt: {
      th: "แปลงอุณหภูมิ 32 ฟาเรนไฮต์ (F) ไปเป็นเซลเซียส (C) ผลลัพธ์ที่พิมพ์ออกมาคือข้อใด?",
      en: "Convert 32 °F to Celsius (C). What is the printed output?",
    },
    stdin: "32\nF\nC\n",
    options: [
      {
        id: "a",
        label: { th: "0.00", en: "0.00" },
        why: { th: "ถูกต้อง — (32 - 32) * 5 / 9 = 0.00", en: "Correct — (32 - 32) * 5 / 9 = 0.00." },
      },
      {
        id: "b",
        label: { th: "0", en: "0" },
        why: { th: "ผิด — ต้องแสดงทศนิยม 2 ตำแหน่ง (0.00)", en: "Wrong — must be formatted with 2 decimals (0.00)." },
      },
      {
        id: "c",
        label: { th: "32.00", en: "32.00" },
        why: { th: "ผิด — 32 ฟาเรนไฮต์เท่ากับ 0 องศาเซลเซียส", en: "Wrong — 32 °F equals 0 °C." },
      },
      {
        id: "d",
        label: { th: "-17.78", en: "-17.78" },
        why: { th: "ผิด — 0 °F จึงจะได้ -17.78 °C", en: "Wrong — 0 °F yields -17.78 °C, not 32 °F." },
      },
    ],
    correctId: "a",
    sourceRef: "problem.md §4 (Case 2)",
  },
  {
    id: "3022-q5",
    kind: "spot-the-bug",
    prompt: {
      th: "สูตรแปลงฟาเรนไฮต์เป็นเซลเซียสด้านล่างนี้มีจุดผิดพลาดตรงไหน?",
      en: "What bug exists in the Fahrenheit-to-Celsius conversion below?",
    },
    snippet: 'if unit == "F":\n    return value - 32 * 5 / 9',
    options: [
      {
        id: "a",
        label: { th: "ขาดวงเล็บรอบ `(value - 32)` ทำให้ `32 * 5 / 9` ถูกคำนวณก่อน", en: "Missing parentheses around `(value - 32)`; `32 * 5 / 9` evaluates first" },
        why: { th: "ถูกต้อง — การคูณ/หารมีลำดับสูงกว่าการลบ ต้องใส่วงเล็บ `(value - 32) * 5 / 9`", en: "Correct — multiplication/division precedence requires parentheses around subtraction." },
      },
      {
        id: "b",
        label: { th: "ต้องคูณด้วย 9/5 แทนที่จะเป็น 5/9", en: "Must multiply by 9/5 instead of 5/9" },
        why: { th: "ผิด — การแปลง F -> C ต้องคูณด้วย 5/9", en: "Wrong — F to C uses 5/9." },
      },
      {
        id: "c",
        label: { th: "ห้ามใช้ string เปรียบเทียบกับตัวแปร unit", en: "Cannot compare string with unit variable" },
        why: { th: "ผิด — `unit == 'F'` เป็นการเปรียบเทียบสตริงที่ถูกต้อง", en: "Wrong — string equality comparison is completely valid." },
      },
      {
        id: "d",
        label: { th: "ต้องใช้ return value เสมอ", en: "Must return value unchanged" },
        why: { th: "ผิด — ต้องแปลงค่าก่อนคืนผลลัพธ์", en: "Wrong — temperature must be converted." },
      },
    ],
    correctId: "a",
    sourceRef: "main.py:7",
  },
  {
    id: "3022-q6",
    kind: "pep8",
    prompt: {
      th: "ตามมาตรฐาน PEP-8 ข้อความ Docstring `\"\"\" ... \"\"\"` ควรวางไว้ตำแหน่งใดในฟังก์ชัน?",
      en: "According to PEP-8, where should a docstring `\"\"\" ... \"\"\"` be placed in a function?",
    },
    options: [
      {
        id: "a",
        label: { th: "บรรทัดแรกสุดภายในบล็อกของฟังก์ชัน ทันทีหลังบรรทัด `def`", en: "On the first line inside the function body, immediately following the `def` header" },
        why: { th: "ถูกต้อง — PEP-257 และ PEP-8 กำหนดให้ docstring เป็นประโยคแรกสุดใน body ของฟังก์ชัน", en: "Correct — PEP-257 and PEP-8 mandate docstrings as the first statement in the body." },
      },
      {
        id: "b",
        label: { th: "ก่อนบรรทัด `def` ด้านนอกฟังก์ชัน", en: "Above the `def` line outside the function" },
        why: { th: "ผิด — ถ้าอยู่นอกฟังก์ชันจะเป็นคอมเมนต์ทั่วไป ไม่ถูกผูกเป็น `__doc__` ของฟังก์ชัน", en: "Wrong — outside the def header it won't bind to `__doc__`." },
      },
      {
        id: "c",
        label: { th: "บรรทัดสุดท้ายก่อน return", en: "On the last line before return" },
        why: { th: "ผิด — Python จะไม่นับเป็น docstring ถ้าไม่ได้อยู่บรรทัดแรก", en: "Wrong — Python only parses docstrings at the beginning of bodies." },
      },
      {
        id: "d",
        label: { th: "ตำแหน่งใดก็ได้ในโค้ด", en: "Any arbitrary location in the file" },
        why: { th: "ผิด — ต้องอยู่บรรทัดแรกของฟังก์ชันหรือโมดูลเท่านั้น", en: "Wrong — position is strictly defined." },
      },
    ],
    correctId: "a",
    sourceRef: "problem.md §3",
  },
];

// ---------------------------------------------------------------------------
// 3159 — Factorial
// ---------------------------------------------------------------------------
const factorial: QuizQuestion[] = [
  {
    id: "3159-q1",
    kind: "mcq",
    prompt: {
      th: "ตัวแปรสะสมผลคูณ (Product Accumulator) ใน main.py ของ Factorial เริ่มต้นด้วยค่าใด และเพราะอะไร?",
      en: "What initial value does the product accumulator start with in Factorial, and why?",
    },
    options: [
      {
        id: "a",
        label: { th: "1 — เพราะ 1 เป็นเอกลักษณ์การคูณ และ 0! มีค่าเท่ากับ 1", en: "1 — because 1 is the multiplicative identity and 0! = 1" },
        why: { th: "ถูกต้อง — ถ้าเริ่มต้นด้วย 0 ผลคูณทุกรอบจะได้ 0 เสมอ และ 0! นิยามเป็น 1", en: "Correct — starting with 0 makes the product 0 forever, and 0! is mathematically defined as 1." },
      },
      {
        id: "b",
        label: { th: "0 — เพราะตัวแปรตัวเลขใน Python ต้องเริ่มที่ศูนย์เสมอ", en: "0 — because numeric accumulators in Python must always start at 0" },
        why: { th: "ผิด — 0 ใช้กับผลรวม (Sum) ถ้าใช้กับการคูณจะกลืนทุกค่าให้เป็น 0", en: "Wrong — 0 is for sums. In products, multiplying by 0 collapses the accumulator to 0." },
      },
      {
        id: "c",
        label: { th: "n — เพื่อเริ่มคูณถอยหลังจากค่าสูงสุด", en: "n — to start multiplying downward from the top" },
        why: { th: "ผิด — แม้การคูณถอยหลังจะได้ผลเท่ากัน แต่กรณี n=0 จะต้องเขียน logic แยก", en: "Wrong — starting at n requires special-casing n=0." },
      },
      {
        id: "d",
        label: { th: "-1 — เพื่อรองรับจำนวนลบ", en: "-1 — to handle negative inputs" },
        why: { th: "ผิด — แฟกทอเรียลนิยามเฉพาะจำนวนเต็มไม่เป็นลบ", en: "Wrong — factorial is defined for non-negative integers only." },
      },
    ],
    correctId: "a",
    sourceRef: "main.py:9",
  },
  {
    id: "3159-q2",
    kind: "mcq",
    prompt: {
      th: "การวนลูปคำนวณ n! จาก 1 ถึง n ต้องใช้ range รูปแบบใด?",
      en: "Which range computes n! by iterating from 1 through n?",
    },
    options: [
      {
        id: "a",
        label: { th: "range(1, n + 1)", en: "range(1, n + 1)" },
        why: { th: "ถูกต้อง — range(1, n + 1) ให้ลำดับ 1, 2, ..., n ครบถ้วน", en: "Correct — range(1, n + 1) generates 1, 2, ..., n." },
      },
      {
        id: "b",
        label: { th: "range(1, n)", en: "range(1, n)" },
        why: { th: "ผิด — ขาดค่า n ตัวสุดท้ายไป จะได้แค่ (n-1)!", en: "Wrong — drops the final multiplier n, computing (n-1)!." },
      },
      {
        id: "c",
        label: { th: "range(0, n)", en: "range(0, n)" },
        why: { th: "ผิด — การคูณด้วย 0 จะทำให้ผลคูณสะสมกลายเป็น 0 ทันที", en: "Wrong — multiplying by 0 collapses the accumulator to 0." },
      },
      {
        id: "d",
        label: { th: "range(n)", en: "range(n)" },
        why: { th: "ผิด — เริ่มที่ 0 เหมือนกัน ทำให้ได้ผลลัพธ์เป็น 0", en: "Wrong — starts at 0, resulting in 0." },
      },
    ],
    correctId: "a",
    sourceRef: "main.py:10",
  },
  {
    id: "3159-q3",
    kind: "predict-output",
    prompt: {
      th: "โปรแกรมอ่านจำนวนเต็ม n แล้วพิมพ์ค่า n! ถ้าอินพุตคือ 5 ผลลัพธ์คือข้อใด?",
      en: "The program reads n and prints n!. If input is 5, what is the output?",
    },
    stdin: "5\n",
    options: [
      {
        id: "a",
        label: { th: "120", en: "120" },
        why: { th: "ถูกต้อง — 5! = 1 * 2 * 3 * 4 * 5 = 120", en: "Correct — 5! = 1 * 2 * 3 * 4 * 5 = 120." },
      },
      {
        id: "b",
        label: { th: "24", en: "24" },
        why: { th: "ผิด — 24 คือ 4!", en: "Wrong — 24 is 4!." },
      },
      {
        id: "c",
        label: { th: "720", en: "720" },
        why: { th: "ผิด — 720 คือ 6!", en: "Wrong — 720 is 6!." },
      },
      {
        id: "d",
        label: { th: "15", en: "15" },
        why: { th: "ผิด — 15 คือ 1+2+3+4+5 (ผลบวก ไม่ใช่ผลคูณ)", en: "Wrong — 15 is the sum, not the product." },
      },
    ],
    correctId: "a",
    sourceRef: "problem.md §4 (Case 1)",
  },
  {
    id: "3159-q4",
    kind: "predict-output",
    prompt: {
      th: "ถ้าอินพุตคือ 0 ผลลัพธ์ค่าแฟกทอเรียล 0! คือข้อใด?",
      en: "If input is 0, what is the output of 0!?",
    },
    stdin: "0\n",
    options: [
      {
        id: "a",
        label: { th: "1", en: "1" },
        why: { th: "ถูกต้อง — ตามนิยามคณิตศาสตร์ 0! = 1 และลูป range(1, 1) จะไม่ทำงาน คืนค่าเริ่มต้น 1 ออกมาทันที", en: "Correct — mathematically 0! = 1; range(1, 1) does not run, returning the initial 1." },
      },
      {
        id: "b",
        label: { th: "0", en: "0" },
        why: { th: "ผิด — 0! มีค่าเท่ากับ 1 ไม่ใช่ 0", en: "Wrong — 0! equals 1 by definition, not 0." },
      },
      {
        id: "c",
        label: { th: "Error", en: "Error" },
        why: { th: "ผิด — range(1, 1) ทำงานได้ปกติโดยเป็นลูปว่าง", en: "Wrong — range(1, 1) executes cleanly as an empty loop." },
      },
      {
        id: "d",
        label: { th: "-1", en: "-1" },
        why: { th: "ผิด — ไม่มีค่า -1", en: "Wrong — no negative values." },
      },
    ],
    correctId: "a",
    sourceRef: "problem.md §4 (Case 2)",
  },
  {
    id: "3159-q5",
    kind: "spot-the-bug",
    prompt: {
      th: "โค้ดคำนวณแฟกทอเรียลด้านล่างนี้มีข้อผิดพลาดตรงจุดใด?",
      en: "What bug exists in the factorial snippet below?",
    },
    snippet: 'result = 0\nfor i in range(1, n + 1):\n    result *= i',
    options: [
      {
        id: "a",
        label: { th: "result เริ่มต้นที่ 0 ทำให้ผลคูณทุกรอบกลายเป็น 0 เสมอ ต้องเริ่มที่ 1", en: "result starts at 0, making every multiplication 0; must start at 1" },
        why: { th: "ถูกต้อง — ตัวแปรสะสมผลคูณต้องเริ่มต้นด้วย 1 (เอกลักษณ์การคูณ)", en: "Correct — product accumulators must start at 1." },
      },
      {
        id: "b",
        label: { th: "ต้องใช้เครื่องหมาย += แทน *=", en: "Must use += instead of *=" },
        why: { th: "ผิด — แฟกทอเรียลคือผลคูณ ต้องใช้ *=", en: "Wrong — factorial is a product, requiring *=." },
      },
      {
        id: "c",
        label: { th: "range ต้องเริ่มจาก 0", en: "range must start at 0" },
        why: { th: "ผิด — ถ้าเริ่มที่ 0 จะคูณด้วย 0", en: "Wrong — starting at 0 multiplies by 0." },
      },
      {
        id: "d",
        label: { th: "ตัวแปร i ต้องแปลงเป็น float(i)", en: "Variable i must be cast to float(i)" },
        why: { th: "ผิด — แฟกทอเรียลเป็นจำนวนเต็ม (int)", en: "Wrong — factorial is integer-based." },
      },
    ],
    correctId: "a",
    sourceRef: "main.py:9",
  },
  {
    id: "3159-q6",
    kind: "pep8",
    prompt: {
      th: "ใน Python การตั้งชื่อตัวแปรสะสมผลลัพธ์ที่ดีตาม PEP-8 ควรเป็นอย่างไร?",
      en: "Under PEP-8, what is the cleanest naming convention for accumulator variables?",
    },
    options: [
      {
        id: "a",
        label: { th: "ใช้ชื่อที่มีความหมายชัดเจน เช่น `result` หรือ `total_product` เป็นตัวพิมพ์เล็ก snake_case", en: "Use descriptive names like `result` or `total_product` in lowercase snake_case" },
        why: { th: "ถูกต้อง — PEP-8 แนะนำให้ใช้ snake_case สื่อความหมายชัดเจน", en: "Correct — PEP-8 emphasizes meaningful snake_case identifiers." },
      },
      {
        id: "b",
        label: { th: "ใช้ตัวแปรตัวเดียวเช่น `a`, `x`, `temp` ในทุกกรณี", en: "Use arbitrary single-letter names everywhere" },
        why: { th: "ผิด — ทำให้อ่านโค้ดยากและไม่สื่อความหมาย", en: "Wrong — obscures code intent." },
      },
      {
        id: "c",
        label: { th: "ใช้ชื่อภาษาไทยแบบทับศัพท์ เช่น `phon_khun`", en: "Use transliterated phonetic variable names" },
        why: { th: "ผิด — มาตรฐานสากลแนะนำให้ใช้ภาษาอังกฤษที่เข้าใจตรงกัน", en: "Wrong — standard English identifiers are preferred." },
      },
      {
        id: "d",
        label: { th: "ต้องใช้อักษรตัวพิมพ์ใหญ่ทั้งหมด เช่น RESULT", en: "Must use all-uppercase RESULT" },
        why: { th: "ผิด — ตัวพิมพ์ใหญ่ทั้งหมดสงวนไว้สำหรับค่าคงที่ระดับโมดูล (Constants)", en: "Wrong — all-caps is reserved for module-level constants." },
      },
    ],
    correctId: "a",
    sourceRef: "problem.md §3",
  },
];

// ---------------------------------------------------------------------------
// 3167 — FizzBuzz
// ---------------------------------------------------------------------------
const fizzbuzz: QuizQuestion[] = [
  {
    id: "3167-q1",
    kind: "mcq",
    prompt: {
      th: "ทำไมโค้ดจริงใน main.py จึงเช็ก `i % 15` ก่อน `i % 3` และ `i % 5`?",
      en: "Why does the real main.py check `i % 15` before `i % 3` and `i % 5`?",
    },
    options: [
      {
        id: "a",
        label: { th: "เพราะ 15 หารด้วย 3 และ 5 ลงตัวทั้งคู่ ถ้าไม่เช็กก่อน จะเข้า branch Fizz/Buzz ก่อนถึง FizzBuzz เสมอ", en: "Because 15 is divisible by both 3 and 5 — checking it last means the Fizz/Buzz branch always fires first and FizzBuzz never runs" },
        why: { th: "ถูกต้อง — elif ตัวแรกที่เป็นจริงจะ \"ชนะ\" เสมอ ถ้า `i % 3 == 0` มาก่อน เลข 15 จะพิมพ์ Fizz แล้วจบ ไม่มีทางไปถึง elif ที่เช็ก 15 อีก", en: "Correct — the first true elif branch always wins. If `i % 3 == 0` comes first, 15 prints Fizz and the elif chain exits before ever reaching the 15-check." },
      },
      {
        id: "b",
        label: { th: "เพราะ Python บังคับให้เรียง elif จากเลขมากไปน้อยเสมอ", en: "Because Python requires elif branches to be ordered from largest to smallest number" },
        why: { th: "ไม่จริง — Python ไม่มีกฎแบบนี้ ลำดับ elif เป็นทางเลือกของผู้เขียนโค้ด แต่ผลลัพธ์ที่ถูกต้องบังคับให้ต้องเรียงจากเจาะจงที่สุดก่อน", en: "Not true — Python has no such rule. elif order is the programmer's choice; it's correctness (most-specific-first) that forces this particular order here." },
      },
      {
        id: "c",
        label: { th: "เพราะการหารด้วย 15 เร็วกว่าการหารด้วย 3 หรือ 5", en: "Because dividing by 15 is computationally faster than dividing by 3 or 5" },
        why: { th: "ไม่จริง — ความเร็วของ `%` ไม่ขึ้นกับขนาดตัวเลขในระดับที่มีผลตรงนี้ นี่ไม่ใช่เหตุผลที่แท้จริง", en: "Not true — the speed of `%` here isn't meaningfully different by divisor size. That isn't the real reason for the ordering." },
      },
      {
        id: "d",
        label: { th: "เพราะโจทย์กำหนดให้ต้องพิมพ์ FizzBuzz ก่อนเสมอไม่ว่ากรณีใด", en: "Because the problem statement requires FizzBuzz to always print before anything else" },
        why: { th: "ไม่จริง — โจทย์ไม่ได้พูดถึงลำดับการพิมพ์แบบนั้น มันพูดถึงกฎเงื่อนไข ไม่ใช่ลำดับการรัน", en: "Not true — the problem statement doesn't dictate print ordering like this; it defines the divisibility rules, not execution order." },
      },
    ],
    correctId: "a",
    sourceRef: "problem.md §5.2",
  },
  {
    id: "3167-q2",
    kind: "mcq",
    prompt: {
      th: "ตัวแปรสะสม/ตัวแปรวนซ้ำใน main.py ของ FizzBuzz ใช้ range แบบใด?",
      en: "What range does the real main.py loop over in FizzBuzz?",
    },
    options: [
      {
        id: "a",
        label: { th: "range(1, n + 1)", en: "range(1, n + 1)" },
        why: { th: "ถูกต้อง — ตรงกับ main.py บรรทัด `for i in range(1, n + 1):` เพราะ range(a, b) ไม่รวม b ต้อง +1 เพื่อให้ครอบคลุมถึง n", en: "Correct — matches main.py's `for i in range(1, n + 1):`. range(a, b) excludes b, so +1 is required to include n." },
      },
      {
        id: "b",
        label: { th: "range(1, n)", en: "range(1, n)" },
        why: { th: "ผิด — จะพลาดค่า n ตัวสุดท้ายไปเลย เพราะ range ไม่รวมขอบบน", en: "Wrong — this would drop the final value n entirely, since range excludes its upper bound." },
      },
      {
        id: "c",
        label: { th: "range(0, n)", en: "range(0, n)" },
        why: { th: "ผิด — จะเริ่มที่ 0 ซึ่งไม่ตรงกับโจทย์ที่ต้องเริ่มพิมพ์จาก 1", en: "Wrong — this starts at 0, but the problem requires printing starting from 1." },
      },
      {
        id: "d",
        label: { th: "range(n, 0, -1)", en: "range(n, 0, -1)" },
        why: { th: "ผิด — นี่คือการวนถอยหลังจาก n ลงมาถึง 1 ซึ่งจะสลับลำดับผลลัพธ์ ไม่ตรงกับ Official Example", en: "Wrong — this counts backward from n to 1, reversing the expected output order shown in the Official Example." },
      },
    ],
    correctId: "a",
    sourceRef: "main.py:8",
  },
  {
    id: "3167-q3",
    kind: "predict-output",
    prompt: {
      th: "โปรแกรมอ่านจำนวนเต็มบวก n หนึ่งบรรทัด แล้วพิมพ์เลข 1 ถึง n ทีละบรรทัด โดยแทนที่ตัวเลขที่หารด้วย 3 ลงตัวด้วย Fizz, หารด้วย 5 ลงตัวด้วย Buzz, และหารด้วยทั้ง 3 และ 5 ลงตัวด้วย FizzBuzz ถ้า n = 5 ผลลัพธ์คือบรรทัดใดตามลำดับ?",
      en: "The program reads one positive integer n, then prints 1 through n one per line — replacing multiples of 3 with Fizz, multiples of 5 with Buzz, and multiples of both with FizzBuzz. If n = 5, what are the output lines in order?",
    },
    stdin: "5\n",
    options: [
      {
        id: "a",
        label: { th: "1, 2, Fizz, 4, Buzz (แยกบรรทัด)", en: "1, 2, Fizz, 4, Buzz (one per line)" },
        why: { th: "ถูกต้อง — 1,2 ไม่เข้าเงื่อนไข; 3 เข้าเงื่อนไขหาร 3 ลงตัว -> Fizz; 4 ไม่เข้า; 5 เข้าเงื่อนไขหาร 5 ลงตัว -> Buzz", en: "Correct — 1,2 are printed as-is; 3 is divisible by 3 -> Fizz; 4 is printed as-is; 5 is divisible by 5 -> Buzz." },
      },
      {
        id: "b",
        label: { th: "1, 2, 3, 4, 5", en: "1, 2, 3, 4, 5" },
        why: { th: "ผิด — พิมพ์ตัวเลขตรงๆ โดยไม่แทนที่ด้วย Fizz และ Buzz ตามกฎของโจทย์", en: "Wrong — prints raw numbers without replacing multiples of 3 and 5 as required." },
      },
      {
        id: "c",
        label: { th: "Fizz, Buzz, 3, 4, 5", en: "Fizz, Buzz, 3, 4, 5" },
        why: { th: "ผิด — ลำดับสับสน ไม่ได้แทนที่ตามค่าที่หารลงตัวจริง", en: "Wrong — positions are scrambled; replacements must match the actual divisible values." },
      },
      {
        id: "d",
        label: { th: "1, 2, Fizz, 4", en: "1, 2, Fizz, 4" },
        why: { th: "ผิด — ตกค่าสุดท้าย (5) ไป เหมือนใช้ range(1, n) แทนที่จะเป็น range(1, n + 1)", en: "Wrong — missing the last value (5), as would happen with `range(1, n)` instead of `range(1, n + 1)`." },
      },
    ],
    correctId: "a",
    sourceRef: "problem.md §6 (Additional Test Cases)",
  },
  {
    id: "3167-q4",
    kind: "predict-output",
    prompt: {
      th: "ถ้ารัน FizzBuzz ด้วย n = 3 บรรทัดสุดท้ายที่พิมพ์ออกมาคืออะไร?",
      en: "If you run FizzBuzz with n = 3, what is the very last line printed?",
    },
    stdin: "3\n",
    options: [
      {
        id: "a",
        label: { th: "Fizz", en: "Fizz" },
        why: { th: "ถูกต้อง — เมื่อ n = 3 ลูปจะทำงานที่ i = 1, 2, 3 โดยที่ i = 3 จะเข้าเงื่อนไข `i % 3 == 0` แล้วพิมพ์ 'Fizz' เป็นบรรทัดสุดท้าย", en: "Correct — for n = 3 the loop runs i = 1, 2, 3; at i = 3 the `i % 3 == 0` branch fires, printing 'Fizz' as the final line." },
      },
      {
        id: "b",
        label: { th: "3", en: "3" },
        why: { th: "ผิด — 3 หารด้วย 3 ลงตัว ต้องแทนที่ด้วย 'Fizz' ไม่ใช่พิมพ์เลข 3", en: "Wrong — 3 is divisible by 3, so it must be replaced with 'Fizz', not printed as 3." },
      },
      {
        id: "c",
        label: { th: "Buzz", en: "Buzz" },
        why: { th: "ผิด — 3 หารด้วย 5 ไม่ลงตัว 'Buzz' จะพิมพ์เฉพาะเมื่อหารด้วย 5 ลงตัว", en: "Wrong — 3 is not divisible by 5; 'Buzz' is only printed for multiples of 5." },
      },
      {
        id: "d",
        label: { th: "FizzBuzz", en: "FizzBuzz" },
        why: { th: "ผิด — 3 หารด้วย 15 ไม่ลงตัว 'FizzBuzz' จะพิมพ์เฉพาะเมื่อหารด้วยทั้ง 3 และ 5 ลงตัว (เช่น 15, 30)", en: "Wrong — 3 is not divisible by 15; 'FizzBuzz' requires divisibility by both 3 and 5." },
      },
    ],
    correctId: "a",
    sourceRef: "problem.md §6 (Additional Test Cases)",
  },
  {
    id: "3167-q5",
    kind: "spot-the-bug",
    prompt: {
      th: "โค้ดจำลองด้านล่างนี้มีบั๊กที่ทำให้ผลลัพธ์ผิดพลาดสำหรับเลข 15 จุดผิดพลาดคืออะไร?",
      en: "The snippet below contains a bug that produces incorrect output for n = 15. What is the bug?",
    },
    snippet: 'if i % 3 == 0:\n    print("Fizz")\nelif i % 15 == 0:\n    print("FizzBuzz")',
    options: [
      {
        id: "a",
        label: { th: "เช็ก `i % 3 == 0` ก่อน `i % 15 == 0` ทำให้เลข 15 เข้าเงื่อนไขแรกและพิมพ์ Fizz แทน FizzBuzz", en: "Checks `i % 3 == 0` before `i % 15 == 0`, causing 15 to hit the first branch and print Fizz instead of FizzBuzz" },
        why: { th: "ถูกต้อง — 15 หารด้วย 3 ลงตัว จึงเข้า branch แรกทันที และข้าม branch 15 ไปเลย ต้องสลับเอาเงื่อนไข 15 ขึ้นก่อน", en: "Correct — 15 is divisible by 3, so it matches the first branch immediately and skips the 15-branch. 15 must come first." },
      },
      {
        id: "b",
        label: { th: "ใช้ print() ซ้อนกันไม่ได้ใน elif", en: "print() cannot be used inside an elif block" },
        why: { th: "ไม่จริง — print() เรียกในบล็อกไหนก็ได้ใน Python", en: "Not true — print() can be called inside any block in Python." },
      },
      {
        id: "c",
        label: { th: "เครื่องหมาย `%` ใช้กับเลข 15 ไม่ได้ใน Python", en: "The `%` operator does not work with the number 15 in Python" },
        why: { th: "ไม่จริง — `%` ใช้งานได้กับจำนวนเต็มทุกตัว", en: "Not true — `%` works with any integer operand." },
      },
      {
        id: "d",
        label: { th: "ต้องใช้ `== 0` สองตัวติดกันเป็น `==== 0`", en: "Must use double equality as `==== 0`" },
        why: { th: "ไม่จริง — `====` เป็น SyntaxError ใน Python", en: "Not true — `====` is a syntax error in Python." },
      },
    ],
    correctId: "a",
    sourceRef: "problem.md §5.2",
  },
  {
    id: "3167-q6",
    kind: "pep8",
    prompt: {
      th: "ตามมาตรฐาน PEP-8 และคำแนะนำของ Pylint การเขียนเงื่อนไขตรวจสอบการหารลงตัวรูปแบบใดที่กระชับและลด warning ได้ดีที่สุด?",
      en: "According to PEP-8 and Pylint guidelines, which form for checking divisibility is cleanest?",
    },
    options: [
      {
        id: "a",
        label: { th: "if not i % 15: (เพราะ 0 มีค่าความจริงเป็น Falsey)", en: "if not i % 15: (since 0 is falsey in boolean context)" },
        why: { th: "ถูกต้อง — Pylint แนะนำ `not i % 15` เพื่อความกระชับและเป็น Pythonic เนื่องจากเศษ 0 คือ False", en: "Correct — Pylint suggests `not i % 15` as idiomatic Python since remainder 0 is falsey." },
      },
      {
        id: "b",
        label: { th: "if (i%15==0):", en: "if (i%15==0):" },
        why: { th: "ผิด — PEP-8 กำหนดให้เว้นวรรค 1 ช่องรอบตัวดำเนินการเปรียบเทียบ และไม่จำเป็นต้องครอบวงเล็บรอบ if", en: "Wrong — PEP-8 requires spaces around comparison operators and discourages redundant parentheses around `if`." },
      },
      {
        id: "c",
        label: { th: "if i % 15 == True:", en: "if i % 15 == True:" },
        why: { th: "ผิด — เศษจากการหารเป็นตัวเลข int ไม่ใช่ Boolean การเทียบกับ True จะทำให้ผลลัพธ์เพี้ยน", en: "Wrong — remainder is an integer, not a boolean; comparing to True yields incorrect logic." },
      },
      {
        id: "d",
        label: { th: "if i % 15 is 0:", en: "if i % 15 is 0:" },
        why: { th: "ผิด — ห้ามใช้ `is` กับ literal numbers ใน Python จะเกิด SyntaxWarning/Error", en: "Wrong — `is` must not be used with numeric literals (triggers SyntaxWarning in Python)." },
      },
    ],
    correctId: "a",
    sourceRef: "problem.md §5.6",
  },
];

// ---------------------------------------------------------------------------
// 3226 — Inflation (อัตราเงินเฟ้อ) — Hardest Problem (57.50% pass rate)
// ---------------------------------------------------------------------------
const inflation: QuizQuestion[] = [
  {
    id: "3226-q1",
    kind: "mcq",
    prompt: {
      th: "ทำไมในโจทย์ Inflation จึงต้องเก็บเงินเป็น 'สตางค์' (จำนวนเต็ม int) แทนที่จะเก็บเป็น float?",
      en: "Why must Inflation store money as integer 'satang' (int) rather than float?",
    },
    options: [
      {
        id: "a",
        label: { th: "เพื่อป้องกันความคลาดเคลื่อนจากการปัดเศษทศนิยมของ float เมื่อคำนวณทบต้นหลายปี", en: "To prevent floating-point precision accumulation errors across multiple compounding years" },
        why: { th: "ถูกต้อง — float มีปัญหา precision เมื่อคูณต่อเนื่อง การใช้จำนวนเต็ม (satang) จะให้ผลลัพธ์ที่แม่นยำ 100%", en: "Correct — floating-point arithmetic introduces drift over iterations; integer arithmetic remains exact." },
      },
      {
        id: "b",
        label: { th: "เพราะภาษา Python ไม่มีชนิดข้อมูล float ให้ใช้งาน", en: "Because Python does not have a float data type" },
        why: { th: "ผิด — Python มี float ตามปกติ", en: "Wrong — Python has built-in float support." },
      },
      {
        id: "c",
        label: { th: "เพราะอัตราเงินเฟ้อติดลบไม่ได้", en: "Because inflation rates cannot be negative" },
        why: { th: "ผิด — ไม่เกี่ยวกับเรื่องค่าลบ แต่เป็นเรื่องความแม่นยำของทศนิยม", en: "Wrong — this is strictly about numeric precision." },
      },
      {
        id: "d",
        label: { th: "เพราะฟังก์ชัน round() คืนค่าเป็น int เสมอ", en: "Because round() always returns an int" },
        why: { th: "ผิด — round(float, ndigits) คืนค่าเป็น float", en: "Wrong — round() behavior depends on parameters." },
      },
    ],
    correctId: "a",
    sourceRef: "main.py:9-10",
  },
  {
    id: "3226-q2",
    kind: "mcq",
    prompt: {
      th: "อัตราเงินเฟ้อ 3.81% ต่อปีในโจทย์ข้อนี้คำนวณส่วนเพิ่มของสตางค์ในแต่ละปีอย่างไร?",
      en: "How does the 3.81% annual inflation add to satang each year in this problem?",
    },
    options: [
      {
        id: "a",
        label: { th: "satang += satang * 381 // 10000 (ตัดเศษทิ้งตั้งแต่สตางค์หลักที่ 3 เป็นต้นไป)", en: "satang += satang * 381 // 10000 (truncates beyond the 2nd decimal place of satang)" },
        why: { th: "ถูกต้อง — 3.81% คือ 381/10000 การใช้ `//` ช่วยตัดเศษสตางค์ส่วนเกินทิ้งปีต่อปีตรงตามสเปก iJudge", en: "Correct — 3.81% = 381/10000; integer floor division matches iJudge exact yearly truncation." },
      },
      {
        id: "b",
        label: { th: "satang *= 1.07", en: "satang *= 1.07" },
        why: { th: "ผิด — อัตราจริงคือ 3.81% ไม่ใช่ 7% และการคูณ float จะทำให้เกิด precision error", en: "Wrong — rate is 3.81%, not 7%, and float multiplication drifts." },
      },
      {
        id: "c",
        label: { th: "satang += satang * 0.0381", en: "satang += satang * 0.0381" },
        why: { th: "ผิด — การคูณ float จะไม่ตัดเศษตามรอบปี ทำให้คำนวณหลายปีแล้วได้ค่าคลาดเคลื่อน", en: "Wrong — float calculation does not perform yearly integer truncation." },
      },
      {
        id: "d",
        label: { th: "satang = satang * (1 + 0.0381) ** years", en: "satang = satang * (1 + 0.0381) ** years" },
        why: { th: "ผิด — สูตรทางคณิตศาสตร์แบบก้อนเดียวไม่ตัดเศษรายปี ผลลัพธ์จะต่างจากการทบต้นแบบตัดเศษใน iJudge", en: "Wrong — closed-form power formula skips per-year truncation." },
      },
    ],
    correctId: "a",
    sourceRef: "main.py:13",
  },
  {
    id: "3226-q3",
    kind: "predict-output",
    prompt: {
      th: "ราคาสินค้าเริ่มต้น 100.0 บาท ผ่านไป 1 ปีที่อัตราเงินเฟ้อ 3.81% ผลลัพธ์ที่พิมพ์ออกมาคือข้อใด?",
      en: "Initial price is 100.0 baht. After 1 year at 3.81% inflation, what is the printed output?",
    },
    stdin: "100.0\n1\n",
    options: [
      {
        id: "a",
        label: { th: "103.81", en: "103.81" },
        why: { th: "ถูกต้อง — 100.0 บาท = 10000 สตางค์, เพิ่มขึ้น 10000 * 381 // 10000 = 381 สตางค์ รวมเป็น 10381 สตางค์ = 103.81", en: "Correct — 10000 satang + 381 satang = 10381 satang -> 103.81." },
      },
      {
        id: "b",
        label: { th: "103.8", en: "103.8" },
        why: { th: "ผิด — ต้องแสดงทศนิยม 2 ตำแหน่งครบถ้วน (103.81)", en: "Wrong — must display full 2 decimal digits (103.81)." },
      },
      {
        id: "c",
        label: { th: "107.00", en: "107.00" },
        why: { th: "ผิด — อัตราเงินเฟ้อคือ 3.81% ไม่ใช่ 7%", en: "Wrong — inflation rate is 3.81%, not 7%." },
      },
      {
        id: "d",
        label: { th: "100.00", en: "100.00" },
        why: { th: "ผิด — ราคาต้องเพิ่มขึ้นตามอัตราเงินเฟ้อ", en: "Wrong — price must compound." },
      },
    ],
    correctId: "a",
    sourceRef: "problem.md §4 (Case 1)",
  },
  {
    id: "3226-q4",
    kind: "predict-output",
    prompt: {
      th: "ราคาสินค้าเริ่มต้น 100.0 บาท ผ่านไป 5 ปี ผลลัพธ์ที่พิมพ์ออกมาคือข้อใด?",
      en: "Initial price is 100.0 baht. After 5 years, what is the printed output?",
    },
    stdin: "100.0\n5\n",
    options: [
      {
        id: "a",
        label: { th: "120.54", en: "120.54" },
        why: { th: "ถูกต้อง — ทบต้นแบบตัดเศษ 5 ปีได้ 12054 สตางค์ = 120.54 บาท", en: "Correct — compounding with yearly truncation for 5 years yields 12054 satang = 120.54." },
      },
      {
        id: "b",
        label: { th: "119.05", en: "119.05" },
        why: { th: "ผิด — 119.05 เป็นการคิดดอกเบี้ยเชิงเดี่ยว (Simple Interest) ไม่ใช่ทบต้น", en: "Wrong — 119.05 is simple interest, not compound." },
      },
      {
        id: "c",
        label: { th: "120.56", en: "120.56" },
        why: { th: "ผิด — 120.56 เกิดจากการใช้ float โดยไม่ได้ตัดเศษสตางค์รายปี", en: "Wrong — 120.56 comes from un-truncated float compounding." },
      },
      {
        id: "d",
        label: { th: "140.25", en: "140.25" },
        why: { th: "ผิด — คำนวณคลาดเคลื่อน", en: "Wrong — incorrect calculation." },
      },
    ],
    correctId: "a",
    sourceRef: "problem.md §4 (Case 2)",
  },
  {
    id: "3226-q5",
    kind: "spot-the-bug",
    prompt: {
      th: "โค้ดด้านล่างนี้มีบั๊กที่ทำให้เกิด OverflowError หรือผลลัพธ์เพี้ยนเมื่อ years มีค่ามาก คืออะไร?",
      en: "What bug in the snippet below causes float drift or OverflowError when years is large?",
    },
    snippet: 'satang = round(price * 100)\nfor _ in range(years):\n    satang += satang * 381 // 10000\nprint(f"{float(satang / 100):.2f}")',
    options: [
      {
        id: "a",
        label: { th: "การแปลงกลับเป็น float อาจทำให้ float ล้น (Overflow) เมื่อ years มีค่าหลักพัน ควรถอดเป็นบาท/สตางค์ด้วย int `// 100` และ `% 100`", en: "Converting back to float can overflow on large years; extract integer baht and satang via `// 100` and `% 100`" },
        why: { th: "ถูกต้อง — Python int มีขนาดไม่จำกัด (Unlimited precision) แต่ float มีขีดจำกัด การพิมพ์ด้วย f'{satang // 100}.{satang % 100:02d}' ปลอดภัยกว่า 100%", en: "Correct — Python ints have unlimited precision while floats can overflow." },
      },
      {
        id: "b",
        label: { th: "for _ in range(years) ต้องเปลี่ยนเป็น while True", en: "for loop must be replaced with while True" },
        why: { th: "ผิด — for loop วนตามจำนวนปีถูกต้องแล้ว", en: "Wrong — for loop bounds are correct." },
      },
      {
        id: "c",
        label: { th: "satang * 381 // 10000 ต้องใช้เครื่องหมาย modulo แทน", en: "satang * 381 // 10000 must use modulo instead" },
        why: { th: "ผิด — การคิดอัตราส่วนต้องใช้การคูณและหาร", en: "Wrong — rate calculation requires multiplication and division." },
      },
      {
        id: "d",
        label: { th: "price ต้องรับเป็น int(input()) เท่านั้น", en: "price must be parsed as int(input())" },
        why: { th: "ผิด — ราคาเริ่มต้นมีทศนิยมได้ จึงต้องรับเป็น float", en: "Wrong — price can be a float initially." },
      },
    ],
    correctId: "a",
    sourceRef: "main.py:16-17",
  },
  {
    id: "3226-q6",
    kind: "pep8",
    prompt: {
      th: "การจัดรูปแบบสตริง `f\"{satang // 100}.{satang % 100:02d}\"` มีประโยชน์อย่างไรในแง่ของความถูกต้อง?",
      en: "Why is `f\"{satang // 100}.{satang % 100:02d}\"` superior for formatting satang?",
    },
    options: [
      {
        id: "a",
        label: { th: "`:02d` ช่วยเติมเลข 0 นำหน้าให้สตางค์มี 2 หลักเสมอ เช่น 5 สตางค์จะแสดงเป็น '.05' ไม่ใช่ '.5'", en: "`:02d` guarantees a 2-digit zero-padded satang (e.g. 5 satang displays as '.05', not '.5')" },
        why: { th: "ถูกต้อง — หากไม่ใส่ `:02d` กรณีเศษ 5 สตางค์ จะกลายเป็น '100.5' ซึ่งมีค่าเท่ากับ 50 สตางค์ ทำให้ผิดทันที", en: "Correct — without `:02d`, 5 satang formats as '.5' (representing 50 satang), causing test failures." },
      },
      {
        id: "b",
        label: { th: "ทำให้ฟังก์ชัน print ทำงานเร็วขึ้น 10 เท่า", en: "Makes print run 10x faster" },
        why: { th: "ผิด — เป็นเรื่องความถูกต้องของการจัดรูปทศนิยม ไม่ใช่ความเร็ว", en: "Wrong — purely an output correctness feature." },
      },
      {
        id: "c",
        label: { th: "แปลงตัวเลขทั้งหมดให้เป็นค่าบูลีน", en: "Casts all numbers into booleans" },
        why: { th: "ผิด — f-string ส่งออกเป็นข้อความ str", en: "Wrong — f-strings output formatted strings." },
      },
      {
        id: "d",
        label: { th: "เป็นรูปแบบที่ใช้เฉพาะกับสกุลเงินดอลลาร์สหรัฐ", en: "A format used exclusively for US Dollars" },
        why: { th: "ผิด — ใช้ได้กับทุกสกุลเงินที่มี 100 หน่วยย่อย", en: "Wrong — standard 2-digit subunit formatting." },
      },
    ],
    correctId: "a",
    sourceRef: "main.py:17",
  },
];

// ---------------------------------------------------------------------------
// 3237 — Triangle (สามเหลี่ยม)
// ---------------------------------------------------------------------------
const triangle: QuizQuestion[] = [
  {
    id: "3237-q1",
    kind: "mcq",
    prompt: {
      th: "ในโจทย์สามเหลี่ยมกลวง ทำไมแถวที่ `i in (1, n)` จึงต้องพิมพ์ `'0' * i`?",
      en: "In hollow triangle, why do rows `i in (1, n)` print `'0' * i`?",
    },
    options: [
      {
        id: "a",
        label: { th: "เพราะแถวแรก (ยอด) และแถวสุดท้าย (ฐาน) เป็นขอบทึบทั้งหมด จึงต้องพิมพ์เลข 0 ตลอดทั้งแถว", en: "Because the top peak (row 1) and bottom base (row n) are solid borders filled with '0'" },
        why: { th: "ถูกต้อง — แถว 1 และแถว n เป็นขอบนอกของสามเหลี่ยม จึงไม่มีช่องกลวง '1' ภายใน", en: "Correct — rows 1 and n are outer borders and have no hollow '1' interior." },
      },
      {
        id: "b",
        label: { th: "เพราะ Python ไม่อนุญาตให้พิมพ์เลข 1 ในแถวแรก", en: "Because Python forbids printing '1' on row 1" },
        why: { th: "ผิด — เป็นไปตามรูปแบบลวดลายของโจทย์", en: "Wrong — this is determined by problem pattern specifications." },
      },
      {
        id: "c",
        label: { th: "เพราะความกว้างของแถว 1 มีค่าเป็น 0", en: "Because row 1 has a width of 0" },
        why: { th: "ผิด — แถว 1 มีความกว้าง 1 ตัวอักษร ('0')", en: "Wrong — row 1 has width 1 ('0')." },
      },
      {
        id: "d",
        label: { th: "เพื่อล้างค่าบัฟเฟอร์ของหน้าจอ", en: "To flush the terminal screen buffer" },
        why: { th: "ผิด — การพิมพ์ '0' เป็นเพียงการแสดงผลลวดลาย", en: "Wrong — standard character output." },
      },
    ],
    correctId: "a",
    sourceRef: "main.py:9-11",
  },
  {
    id: "3237-q2",
    kind: "mcq",
    prompt: {
      th: "สำหรับแถวกลาง (แถวที่ 2 ถึง n-1) การสร้างข้อความ `'0' + '1' * (i - 2) + '0'` มีโครงสร้างอย่างไร?",
      en: "For middle rows (row 2 to n-1), how is `'0' + '1' * (i - 2) + '0'` structured?",
    },
    options: [
      {
        id: "a",
        label: { th: "ขอบซ้ายเป็น '0', ขอบขวาเป็น '0', และตรงกลางกลวงเป็น '1' จำนวน i - 2 ตัว", en: "Left border '0', right border '0', and hollow interior '1' of length i - 2" },
        why: { th: "ถูกต้อง — แถวที่ i มีความยาวทั้งหมด i ตัวอักษร โดยมีขอบซ้าย 1 ตัว ขอบขวา 1 ตัว เหลือตรงกลาง i - 2 ตัว", en: "Correct — row i has length i: 1 border on each side + (i - 2) interior '1's." },
      },
      {
        id: "b",
        label: { th: "พิมพ์เฉพาะเลข 1 ทั้งหมดโดยไม่มีขอบ", en: "Prints only '1's with no borders" },
        why: { th: "ผิด — ต้องมีขอบเลข 0 ซ้ายและขวา", en: "Wrong — requires border '0' on both flanks." },
      },
      {
        id: "c",
        label: { th: "เว้นวรรคช่องว่างตรงกลางแทนเลข 1", en: "Uses spaces in the middle instead of '1'" },
        why: { th: "ผิด — โจทย์ข้อนี้ใช้ '1' สำหรับพื้นที่ด้านใน", en: "Wrong — problem specifies '1' for inner hollow area." },
      },
      {
        id: "d",
        label: { th: "ความยาวของแถวจะลดลงทีละ 2", en: "Row length decreases by 2 each step" },
        why: { th: "ผิด — ความยาวของแถวเพิ่มขึ้นตาม i", en: "Wrong — row length increases linearly with i." },
      },
    ],
    correctId: "a",
    sourceRef: "main.py:14",
  },
  {
    id: "3237-q3",
    kind: "predict-output",
    prompt: {
      th: "ถ้าอินพุตความสูงสามเหลี่ยมคือ 1 (n = 1) ผลลัพธ์ที่พิมพ์ออกมาคือข้อใด?",
      en: "If the triangle height input is 1 (n = 1), what is the printed output?",
    },
    stdin: "1\n",
    options: [
      {
        id: "a",
        label: { th: "0", en: "0" },
        why: { th: "ถูกต้อง — เมื่อ n = 1 มีเพียง 1 แถว พิมพ์ '0' เพียงตัวเดียว", en: "Correct — for n = 1, exactly 1 row with a single '0' is printed." },
      },
      {
        id: "b",
        label: { th: "1", en: "1" },
        why: { th: "ผิด — ขอบและยอดของสามเหลี่ยมเป็น '0'", en: "Wrong — peak of triangle is '0'." },
      },
      {
        id: "c",
        label: { th: "00", en: "00" },
        why: { th: "ผิด — n = 1 มีความกว้างเพียง 1 ตัวอักษร", en: "Wrong — width is 1 for n = 1." },
      },
      {
        id: "d",
        label: { th: "บรรทัดว่าง (ไม่มีอะไรแสดงผล)", en: "Empty line (no output)" },
        why: { th: "ผิด — ลูปทำงาน 1 รอบพิมพ์ '0'", en: "Wrong — loop executes once printing '0'." },
      },
    ],
    correctId: "a",
    sourceRef: "problem.md §4 (Case 1)",
  },
  {
    id: "3237-q4",
    kind: "predict-output",
    prompt: {
      th: "ถ้าอินพุตคือ 4 (n = 4) ลายสามเหลี่ยมที่ได้มีลักษณะอย่างไรตามลำดับบรรทัด?",
      en: "If input is 4 (n = 4), what is the exact line-by-line triangle output?",
    },
    stdin: "4\n",
    options: [
      {
        id: "a",
        label: { th: "0 / 00 / 010 / 0000 (แยกบรรทัด)", en: "0 / 00 / 010 / 0000 (one per line)" },
        why: { th: "ถูกต้อง — แถว 1: '0', แถว 2: '00', แถว 3: '010', แถว 4: '0000'", en: "Correct — row 1: '0', row 2: '00', row 3: '010', row 4: '0000'." },
      },
      {
        id: "b",
        label: { th: "0 / 00 / 000 / 0000", en: "0 / 00 / 000 / 0000" },
        why: { th: "ผิด — แถว 3 ต้องมีไส้ในเป็น '1' คือ '010' (สามเหลี่ยมกลวง)", en: "Wrong — row 3 must have hollow interior '1' -> '010'." },
      },
      {
        id: "c",
        label: { th: "1 / 11 / 101 / 1111", en: "1 / 11 / 101 / 1111" },
        why: { th: "ผิด — สลับเลข 0 กับ 1 กลับกัน", en: "Wrong — inverted 0 and 1." },
      },
      {
        id: "d",
        label: { th: "0 / 01 / 010 / 0000", en: "0 / 01 / 010 / 0000" },
        why: { th: "ผิด — แถว 2 ต้องเป็น '00' เพราะ i - 2 = 0 ทำให้ไม่มีเลข 1 ตรงกลาง", en: "Wrong — row 2 has i - 2 = 0 interior '1's, so it is '00'." },
      },
    ],
    correctId: "a",
    sourceRef: "problem.md §4 (Case 2)",
  },
  {
    id: "3237-q5",
    kind: "spot-the-bug",
    prompt: {
      th: "โค้ดพิมพ์แถวกลางด้านล่างนี้มีข้อผิดพลาดเรื่องขนาดความยาวสตริงอย่างไร?",
      en: "What string length bug exists in the middle row snippet below?",
    },
    snippet: 'print("0" + "1" * (i - 1) + "0")',
    options: [
      {
        id: "a",
        label: { th: "ใช้ `(i - 1)` ทำให้แถวยาวเกินไป 1 ตัวอักษร (กลายเป็น i + 1 ตัว) ที่ถูกต้องคือ `(i - 2)`", en: "Using `(i - 1)` makes the row 1 character too long (i + 1 characters); must be `(i - 2)`" },
        why: { th: "ถูกต้อง — ขอบซ้าย 1 ตัว + ขอบขวา 1 ตัว = 2 ตัว ดังนั้นตรงกลางต้องมี `i - 2` ตัว", en: "Correct — 1 left border + 1 right border = 2; interior must be `i - 2`." },
      },
      {
        id: "b",
        label: { th: "ห้ามใช้เครื่องหมาย `+` เชื่อมสตริงใน print", en: "Cannot use `+` to concatenate strings inside print" },
        why: { th: "ผิด — `+` สำหรับสตริงเป็นการต่อข้อความที่ถูกต้องตามไวยากรณ์", en: "Wrong — `+` is valid string concatenation in Python." },
      },
      {
        id: "c",
        label: { th: "ต้องพิมพ์เลข 0 สลับกับ 1 ทีละตัวในลูปย่อย", en: "Must alternate 0 and 1 in a nested loop" },
        why: { th: "ผิด — การใช้ String Multiplication `'1' * k` รวดเร็วและกระชับกว่า", en: "Wrong — string multiplication is idiomatic and fast." },
      },
      {
        id: "d",
        label: { th: "ตัวแปร i ต้องเริ่มต้นที่ 0 เสมอ", en: "Variable i must always start at 0" },
        why: { th: "ผิด — ในข้อนี้ i คือหมายเลขแถว (1 ถึง n)", en: "Wrong — i represents 1-indexed row number." },
      },
    ],
    correctId: "a",
    sourceRef: "main.py:14",
  },
  {
    id: "3237-q6",
    kind: "pep8",
    prompt: {
      th: "ตามมาตรฐาน PEP-8 การตรวจสอบว่าค่า `i` เป็นแถวแรกหรือแถวสุดท้าย การเขียนแบบใดเป็น Pythonic ที่สุด?",
      en: "Under PEP-8, which form is most Pythonic for checking if `i` is the first or last row?",
    },
    options: [
      {
        id: "a",
        label: { th: "if i in (1, n):", en: "if i in (1, n):" },
        why: { th: "ถูกต้อง — การใช้ tuple membership `in (1, n)` กระชับ อ่านเข้าใจง่าย และเป็น Pythonic", en: "Correct — tuple membership `in (1, n)` is concise, readable, and idiomatic." },
      },
      {
        id: "b",
        label: { th: "if i == 1 or i == n:", en: "if i == 1 or i == n:" },
        why: { th: "ใช้ได้เช่นกัน แต่ `in (1, n)` นิยมกว่าเมื่อเปรียบเทียบค่าเดี่ยวกับชุดตัวเลือก", en: "Valid, but `in (1, n)` is cleaner when testing single variable against multiple options." },
      },
      {
        id: "c",
        label: { th: "if i == 1 or n:", en: "if i == 1 or n:" },
        why: { th: "ผิด — `or n` จะประเมินค่าความจริงของ `n` เสมอ ซึ่งทำให้เป็นจริงตลอดเวลาถ้า n > 0", en: "Wrong — `or n` tests truthiness of n, evaluating to True always when n > 0." },
      },
      {
        id: "d",
        label: { th: "if i == (1 or n):", en: "if i == (1 or n):" },
        why: { th: "ผิด — `(1 or n)` จะประเมินค่าเป็น 1 เสมอ ทำให้เช็กแค่ `i == 1` เท่านั้น", en: "Wrong — `(1 or n)` evaluates to 1, completely ignoring n." },
      },
    ],
    correctId: "a",
    sourceRef: "main.py:9",
  },
];

// ---------------------------------------------------------------------------
// 3290 — Left Arrow (ป้ายไฟเลี้ยวซ้าย)
// ---------------------------------------------------------------------------
const leftArrow: QuizQuestion[] = [
  {
    id: "3290-q1",
    kind: "mcq",
    prompt: {
      th: "ในโจทย์ Left Arrow ทำไมจึงใช้ mid = n // 2 เป็นดัชนีของแถวกลาง?",
      en: "In Left Arrow, why is mid = n // 2 the index of the middle row?",
    },
    options: [
      {
        id: "a",
        label: { th: "เพราะ n เป็นเลขคี่เสมอ n // 2 จึงชี้ไปที่แถวกลางพอดี (เช่น n=5 -> 2)", en: "n is always odd, so n // 2 lands exactly on the middle row (e.g. n=5 -> 2)" },
        why: { th: "ถูกต้อง — แถว 0..n-1 มีแถวกลางแถวเดียวเมื่อ n คี่ และดัชนีของมันคือ n // 2", en: "Correct — rows 0..n-1 have one middle row when n is odd, at index n // 2." },
      },
      {
        id: "b",
        label: { th: "เพราะ // ปัดขึ้นเสมอ", en: "Because // always rounds up" },
        why: { th: "ผิด — // คือ floor division ปัดลง", en: "Wrong — // is floor division, it rounds down." },
      },
      {
        id: "c",
        label: { th: "เพราะแถวกลางต้องเยื้องมากที่สุด", en: "Because the middle row must be indented the most" },
        why: { th: "ผิด — แถวกลางเยื้อง 0 (ชิดซ้ายสุด) ในลูกศรชี้ซ้าย", en: "Wrong — the middle row has indent 0 (flush left) in a left arrow." },
      },
      {
        id: "d",
        label: { th: "เพราะ n // 2 คือจำนวนดาวในแต่ละแถว", en: "Because n // 2 is the number of stars per row" },
        why: { th: "ผิด — จำนวนดาวต่อแถวคือ k ไม่เกี่ยวกับ n", en: "Wrong — stars per row is k, unrelated to n." },
      },
    ],
    correctId: "a",
    sourceRef: "main.py:9",
  },
  {
    id: "3290-q2",
    kind: "mcq",
    prompt: {
      th: "การเยื้อง (จำนวนช่องว่างนำหน้า) ของแถว i ในลูกศรชี้ซ้ายคำนวณอย่างไร?",
      en: "How is the indent (leading spaces) of row i computed for a left arrow?",
    },
    options: [
      {
        id: "a",
        label: { th: "abs(i - mid) — ระยะห่างจากแถวกลาง", en: "abs(i - mid) — the distance from the middle row" },
        why: { th: "ถูกต้อง — abs() ทำให้ค่าไต่ขึ้นถึงแถวกลางแล้วไต่ลง โดยไม่ต้องแยก if", en: "Correct — abs() ramps up to the middle then back down with no separate if." },
      },
      {
        id: "b",
        label: { th: "i - mid", en: "i - mid" },
        why: { th: "ผิด — แถวก่อนแถวกลางจะได้ค่าติดลบ ทำให้ \" \" * ค่าติดลบ = สตริงว่าง", en: "Wrong — rows before the middle get a negative value; \" \" * negative is empty." },
      },
      {
        id: "c",
        label: { th: "mid - abs(i - mid)", en: "mid - abs(i - mid)" },
        why: { th: "ผิด — นั่นคือสูตรของลูกศรชี้ขวา (OJ 3291) ที่แถวกลางเยื้องมากสุด", en: "Wrong — that is the right-arrow formula (OJ 3291), where the middle is indented most." },
      },
      {
        id: "d",
        label: { th: "k - i", en: "k - i" },
        why: { th: "ผิด — ผสมความกว้าง k กับดัชนีแถว ไม่มีความหมาย", en: "Wrong — mixes the width k with the row index." },
      },
    ],
    correctId: "a",
    sourceRef: "main.py:12",
  },
  {
    id: "3290-q3",
    kind: "predict-output",
    prompt: {
      th: "Left Arrow: k คือความกว้าง (จำนวน '*' ต่อบรรทัด), n คือความสูง (คี่) แต่ละแถวเยื้องตามระยะห่างจากแถวกลาง อินพุตคือ k=3, n=3 ผลลัพธ์คือข้อใด?",
      en: "Left Arrow: k is the width (stars per line), n the odd height; each row is indented by its distance from the middle. For k=3, n=3, what is the output?",
    },
    stdin: "3\n3\n",
    options: [
      {
        id: "a",
        label: { th: "' ***' / '***' / ' ***'", en: "' ***' / '***' / ' ***'" },
        why: { th: "ถูกต้อง — mid=1 การเยื้องคือ abs(0-1), abs(1-1), abs(2-1) = 1, 0, 1", en: "Correct — mid=1; indents are abs(0-1), abs(1-1), abs(2-1) = 1, 0, 1." },
      },
      {
        id: "b",
        label: { th: "'***' / ' ***' / '***'", en: "'***' / ' ***' / '***'" },
        why: { th: "ผิด — นั่นคือลูกศรชี้ขวา แถวกลางเยื้องเข้า", en: "Wrong — that is a right arrow, with the middle row indented in." },
      },
      {
        id: "c",
        label: { th: "'***' / '***' / '***'", en: "'***' / '***' / '***'" },
        why: { th: "ผิด — ไม่มีการเยื้องเลย ต้องมีช่องว่างนำหน้าแถวบน-ล่าง", en: "Wrong — no indentation at all; the top and bottom rows need a leading space." },
      },
      {
        id: "d",
        label: { th: "'  ***' / ' ***' / '***'", en: "'  ***' / ' ***' / '***'" },
        why: { th: "ผิด — นั่นเยื้อง 2,1,0 ซึ่งเป็นครึ่งบนของลูกศรที่สูงกว่านี้", en: "Wrong — that is indent 2,1,0, the top half of a taller arrow." },
      },
    ],
    correctId: "a",
    sourceRef: "problem.md §6 (row 3×3)",
  },
  {
    id: "3290-q4",
    kind: "spot-the-bug",
    prompt: {
      th: "โค้ดนี้ควรวาดลูกศรชี้ซ้าย แต่แถวบนครึ่งหนึ่งไม่มีช่องว่างนำหน้า บั๊กอยู่ที่ใด?",
      en: "This should draw a left arrow, but the top half of the rows have no leading spaces. Where is the bug?",
    },
    snippet: [
      "mid = n // 2",
      "for row in range(n):",
      "    indent = row - mid",
      '    print(" " * indent + "*" * k)',
    ].join("\n"),
    options: [
      {
        id: "a",
        label: { th: "indent = row - mid ควรเป็น abs(row - mid)", en: "indent = row - mid should be abs(row - mid)" },
        why: { th: "ถูกต้อง — เมื่อ row < mid ค่าเป็นลบ และ \" \" * (ลบ) คืนสตริงว่าง แถวบนจึงชิดซ้าย", en: "Correct — when row < mid the value is negative, and \" \" * negative is empty, so the top rows sit flush left." },
      },
      {
        id: "b",
        label: { th: "range(n) ควรเป็น range(1, n + 1)", en: "range(n) should be range(1, n + 1)" },
        why: { th: "ผิด — โจทย์นี้ใช้ดัชนีแถว 0..n-1 อยู่แล้ว การเลื่อนเป็น 1-indexed จะทำให้ mid ผิด", en: "Wrong — this uses 0-based rows already; shifting to 1-based breaks the mid calculation." },
      },
      {
        id: "c",
        label: { th: 'print ควรใช้ "*" * k + " " * indent', en: 'print should be "*" * k + " " * indent' },
        why: { th: "ผิด — นั่นย้ายช่องว่างไปต่อท้าย ทำให้ขอบซ้ายตรงและ iJudge ไม่ผ่านเพราะมีช่องว่างท้ายบรรทัด", en: "Wrong — that moves the spaces to the end, straightening the left edge and adding trailing spaces iJudge rejects." },
      },
      {
        id: "d",
        label: { th: "mid = n // 2 ควรเป็น n / 2", en: "mid = n // 2 should be n / 2" },
        why: { th: "ผิด — n / 2 คืน float ใช้เป็นตัวคูณสตริงไม่ได้ // ถูกแล้ว", en: "Wrong — n / 2 returns a float, which cannot multiply a string; // is correct." },
      },
    ],
    correctId: "a",
    sourceRef: "main.py:11-13",
  },
  {
    id: "3290-q5",
    kind: "pep8",
    prompt: {
      th: "แต่ละแถวของลูกศรสร้างจากสตริงคูณอย่างไรจึงถือว่าอ่านง่ายและตรงตาม PEP-8?",
      en: "How should each arrow row be built from string multiplication to stay readable and PEP-8 clean?",
    },
    snippet: '" " * indent + "*" * k',
    options: [
      {
        id: "a",
        label: { th: '" " * indent + "*" * k — เว้นวรรครอบ * และ + ตามมาตรฐาน', en: '" " * indent + "*" * k — spaces around * and + per the standard' },
        why: { th: "ถูกต้อง — PEP-8 ให้เว้นวรรครอบ binary operator; สื่อว่า 'ช่องว่างนำหน้า แล้วดาว'", en: "Correct — PEP-8 wants spaces around binary operators; it reads as 'leading spaces, then stars'." },
      },
      {
        id: "b",
        label: { th: '" "*indent+"*"*k', en: '" "*indent+"*"*k' },
        why: { th: "ผิด — ติดกันหมด อ่านยากและผิด PEP-8 (E225 missing whitespace around operator)", en: "Wrong — everything is jammed together; PEP-8 E225, missing whitespace around operator." },
      },
      {
        id: "c",
        label: { th: 'f"{\' \' * indent}{\'*\' * k}"', en: 'f"{\' \' * indent}{\'*\' * k}"' },
        why: { th: "ผิด — f-string ที่มีนิพจน์ซับซ้อนข้างในอ่านยากกว่าการต่อสตริงตรง ๆ", en: "Wrong — an f-string with complex expressions inside is harder to read than plain concatenation." },
      },
      {
        id: "d",
        label: { th: 'str(" " * indent) + str("*" * k)', en: 'str(" " * indent) + str("*" * k)' },
        why: { th: "ผิด — str() ซ้ำซ้อน ผลของการคูณสตริงเป็นสตริงอยู่แล้ว", en: "Wrong — the str() calls are redundant; string multiplication already returns a string." },
      },
    ],
    correctId: "a",
    sourceRef: "main.py:13",
  },
];

// ---------------------------------------------------------------------------
// 3293 — BigFrame (กรอบข้อความ)
// ---------------------------------------------------------------------------
const bigFrame: QuizQuestion[] = [
  {
    id: "3293-q1",
    kind: "mcq",
    prompt: {
      th: "ใน BigFrame ทำไมต้องอ่านข้อความครบทั้ง 5 บรรทัดก่อน แล้วจึงพิมพ์กรอบ?",
      en: "In BigFrame, why must you read all 5 lines before printing the frame?",
    },
    options: [
      {
        id: "a",
        label: { th: "เพราะความกว้างของกรอบขึ้นกับบรรทัดที่ยาวที่สุด ซึ่งรู้ได้ก็ต่อเมื่ออ่านครบแล้ว", en: "The frame width depends on the longest line, which is only known once every line has been read" },
        why: { th: "ถูกต้อง — ขอบบนต้องยาว width + 4 แต่ width = max(len(บรรทัด)) ต้องเห็นทุกบรรทัดก่อน", en: "Correct — the top border is width + 4 long, but width = max(len(line)) needs every line first." },
      },
      {
        id: "b",
        label: { th: "เพราะ input() อ่านได้ครั้งเดียว", en: "Because input() can only be called once" },
        why: { th: "ผิด — เรียก input() ได้หลายครั้ง โค้ดนี้เรียก 5 ครั้งใน list comprehension", en: "Wrong — input() can be called many times; this code calls it 5 times in a comprehension." },
      },
      {
        id: "c",
        label: { th: "เพราะต้องเรียงบรรทัดตามความยาวก่อน", en: "Because the lines must be sorted by length first" },
        why: { th: "ผิด — ไม่มีการเรียงลำดับ บรรทัดพิมพ์ตามลำดับที่รับเข้ามา", en: "Wrong — nothing is sorted; the lines print in input order." },
      },
      {
        id: "d",
        label: { th: "เพราะกรอบล่างต่างจากกรอบบน", en: "Because the bottom border differs from the top" },
        why: { th: "ผิด — กรอบบนและล่างเป็นสตริงเดียวกัน ใช้ซ้ำได้", en: "Wrong — the top and bottom borders are the same string, reused." },
      },
    ],
    correctId: "a",
    sourceRef: "main.py:7-9",
  },
  {
    id: "3293-q2",
    kind: "mcq",
    prompt: {
      th: "ความยาวของขอบกรอบ (บรรทัดดาวล้วน) เท่ากับเท่าใด เมื่อ width คือความยาวของบรรทัดที่ยาวที่สุด?",
      en: "How long is a border row (all stars), where width is the longest line's length?",
    },
    options: [
      {
        id: "a",
        label: { th: "width + 4 — ดาวซ้าย+ขวา และช่องว่างข้างละ 1", en: "width + 4 — left/right star plus one pad space on each side" },
        why: { th: "ถูกต้อง — \"* \" (2) + พื้นที่ข้อความ (width) + \" *\" (2) = width + 4", en: "Correct — \"* \" (2) + text area (width) + \" *\" (2) = width + 4." },
      },
      {
        id: "b",
        label: { th: "width + 2 — ดาวซ้ายกับขวาเท่านั้น", en: "width + 2 — just the left and right star" },
        why: { th: "ผิด — ลืมช่องว่าง 1 ช่องระหว่างดาวกับข้อความทั้งสองด้าน", en: "Wrong — forgets the one space between the star and the text on each side." },
      },
      {
        id: "c",
        label: { th: "width", en: "width" },
        why: { th: "ผิด — ขอบต้องกว้างกว่าพื้นที่ข้อความเพื่อครอบมันไว้", en: "Wrong — the border must be wider than the text area to enclose it." },
      },
      {
        id: "d",
        label: { th: "width * 2", en: "width * 2" },
        why: { th: "ผิด — ความกว้างเพิ่มแบบคงที่ (+4) ไม่ใช่คูณสอง", en: "Wrong — the width grows by a fixed 4, not doubled." },
      },
    ],
    correctId: "a",
    sourceRef: "main.py:10",
  },
  {
    id: "3293-q3",
    kind: "mcq",
    prompt: {
      th: "ทำไมต้องเรียก .rstrip() กับแต่ละบรรทัดก่อนวัดความกว้าง?",
      en: "Why call .rstrip() on each line before measuring the width?",
    },
    options: [
      {
        id: "a",
        label: { th: "ช่องว่างท้ายบรรทัดในอินพุตไม่นับเป็นข้อความ ถ้าไม่ตัดออก กรอบจะกว้างเกินจริง", en: "Trailing spaces in the input are not part of the text; leaving them makes the frame too wide" },
        why: { th: "ถูกต้อง — ตัวอย่างที่ 1 มี \"Hello World       \" ถ้าไม่ rstrip width จะเป็น 17 แทน 11", en: "Correct — Example 1 has \"Hello World       \"; without rstrip, width becomes 17 instead of 11." },
      },
      {
        id: "b",
        label: { th: "เพื่อลบช่องว่างนำหน้าด้วย", en: "To also remove leading spaces" },
        why: { th: "ผิด — .rstrip() ตัดเฉพาะด้านขวา ช่องว่างนำหน้า (ถ้ามี) ยังอยู่", en: "Wrong — .rstrip() only trims the right side; leading spaces stay." },
      },
      {
        id: "c",
        label: { th: "เพื่อแปลงบรรทัดว่างให้เป็น None", en: "To turn empty lines into None" },
        why: { th: "ผิด — บรรทัดว่างหลัง rstrip ยังเป็นสตริงว่าง \"\" ไม่ใช่ None", en: "Wrong — an empty line after rstrip is still \"\", not None." },
      },
      {
        id: "d",
        label: { th: "เพราะ input() เก็บ \\n ไว้ท้ายสตริง", en: "Because input() keeps the trailing \\n" },
        why: { th: "ผิด — input() ตัด newline ให้อยู่แล้ว rstrip ที่นี่จัดการช่องว่างที่ผู้ใช้พิมพ์", en: "Wrong — input() already strips the newline; this rstrip handles user-typed spaces." },
      },
    ],
    correctId: "a",
    sourceRef: "main.py:7",
  },
  {
    id: "3293-q4",
    kind: "predict-output",
    prompt: {
      th: "BigFrame: รับข้อความ 5 บรรทัด ครอบด้วยกรอบ '*' โดยเว้น 1 ช่องระหว่างข้อความกับกรอบ และเติมช่องว่างท้ายให้ทุกบรรทัดยาวเท่าบรรทัดที่ยาวสุด อินพุต 5 บรรทัด: 'Hi' แล้วบรรทัดว่างอีก 4 บรรทัด ขอบกรอบบนคือบรรทัดใด?",
      en: "BigFrame: 5 lines are framed with '*', one space between text and frame, every line right-padded to the longest line's width. Input: 'Hi' then 4 empty lines. What is the top border row?",
    },
    stdin: "Hi\n\n\n\n\n",
    options: [
      {
        id: "a",
        label: { th: "'******' (ดาว 6 ตัว)", en: "'******' (6 stars)" },
        why: { th: "ถูกต้อง — บรรทัดยาวสุดคือ 'Hi' (2) width+4 = 6", en: "Correct — the longest line is 'Hi' (2); width + 4 = 6." },
      },
      {
        id: "b",
        label: { th: "'****' (ดาว 4 ตัว)", en: "'****' (4 stars)" },
        why: { th: "ผิด — นั่นคือกรณี width=0 (ทุกบรรทัดว่าง) แต่ 'Hi' ยาว 2", en: "Wrong — that is the width=0 case (all lines empty), but 'Hi' has length 2." },
      },
      {
        id: "c",
        label: { th: "'**' (ดาว 2 ตัว)", en: "'**' (2 stars)" },
        why: { th: "ผิด — width อย่างเดียว ลืม +4 สำหรับดาวและช่องว่าง", en: "Wrong — width alone, forgetting the +4 for the stars and spaces." },
      },
      {
        id: "d",
        label: { th: "'* Hi *'", en: "'* Hi *'" },
        why: { th: "ผิด — นั่นคือแถวข้อความ ไม่ใช่ขอบกรอบ", en: "Wrong — that is a text row, not the border." },
      },
    ],
    correctId: "a",
    sourceRef: "problem.md §6 (Hi + 4 empty)",
  },
  {
    id: "3293-q5",
    kind: "spot-the-bug",
    prompt: {
      th: "โค้ดนี้ควรตีกรอบข้อความ แต่กับตัวอย่างที่ 1 กรอบกว้างเกินไปและทุกแถวมีช่องว่างเกิน บั๊กอยู่ที่ใด?",
      en: "This should frame the text, but on Example 1 the frame is too wide and every row has extra padding. Where is the bug?",
    },
    snippet: [
      "lines = [input() for _ in range(5)]",
      "width = max(len(s) for s in lines)",
      'border = "*" * (width + 4)',
      "print(border)",
    ].join("\n"),
    options: [
      {
        id: "a",
        label: { th: "input() ควรเป็น input().rstrip()", en: "input() should be input().rstrip()" },
        why: { th: "ถูกต้อง — ช่องว่างท้ายบรรทัดในอินพุตทำให้ len() มากเกินจริง width จึงกว้างเกิน", en: "Correct — trailing spaces in the input inflate len(), so width comes out too large." },
      },
      {
        id: "b",
        label: { th: "range(5) ควรเป็น range(7)", en: "range(5) should be range(7)" },
        why: { th: "ผิด — อินพุตมี 5 บรรทัด เอาต์พุต 7 บรรทัดเกิดจากกรอบบน-ล่าง", en: "Wrong — the input is 5 lines; the 7 output lines come from adding the borders." },
      },
      {
        id: "c",
        label: { th: "width + 4 ควรเป็น width + 2", en: "width + 4 should be width + 2" },
        why: { th: "ผิด — +4 ถูกแล้ว (ดาว 2 + ช่องว่าง 2) ปัญหาคือ width เองผิด", en: "Wrong — +4 is right (2 stars + 2 spaces); the problem is width itself." },
      },
      {
        id: "d",
        label: { th: "max(...) ควรเป็น min(...)", en: "max(...) should be min(...)" },
        why: { th: "ผิด — กรอบต้องกว้างพอสำหรับบรรทัดที่ยาวที่สุด จึงต้องใช้ max", en: "Wrong — the frame must fit the longest line, so max is correct." },
      },
    ],
    correctId: "a",
    sourceRef: "main.py:7",
  },
  {
    id: "3293-q6",
    kind: "mcq",
    prompt: {
      th: "s.ljust(width) ทำอะไร เมื่อ s สั้นกว่า width?",
      en: "What does s.ljust(width) do when s is shorter than width?",
    },
    options: [
      {
        id: "a",
        label: { th: "คืน s ที่เติมช่องว่างต่อท้ายจนยาวเท่า width", en: "Returns s with spaces appended until it is width characters long" },
        why: { th: "ถูกต้อง — จัดชิดซ้ายในความกว้าง width ทำให้ขอบขวาของทุกแถวตรงกัน", en: "Correct — left-justifies within width, so every row's right border lines up." },
      },
      {
        id: "b",
        label: { th: "คืน s ที่เติมช่องว่างนำหน้า (ชิดขวา)", en: "Returns s padded with leading spaces (right-justified)" },
        why: { th: "ผิด — นั่นคือ .rjust() ; .ljust() ชิดซ้าย เติมท้าย", en: "Wrong — that is .rjust(); .ljust() left-aligns, padding the end." },
      },
      {
        id: "c",
        label: { th: "ตัด s ให้เหลือ width ตัวอักษร", en: "Truncates s to width characters" },
        why: { th: "ผิด — ljust ไม่เคยตัด ถ้า s ยาวกว่า width จะคืน s เดิม", en: "Wrong — ljust never truncates; if s is longer it returns s unchanged." },
      },
      {
        id: "d",
        label: { th: "เติม '0' นำหน้า", en: "Pads with leading '0'" },
        why: { th: "ผิด — นั่นคือ .zfill() ; ljust เติมช่องว่าง (หรืออักขระที่ระบุ)", en: "Wrong — that is .zfill(); ljust pads with spaces (or a given fill char)." },
      },
    ],
    correctId: "a",
    sourceRef: "main.py:15",
  },
];

// ---------------------------------------------------------------------------
// 3349 — Bowl Stack (กองชาม)
// ---------------------------------------------------------------------------
const bowlStack: QuizQuestion[] = [
  {
    id: "3349-q1",
    kind: "mcq",
    prompt: {
      th: "ในโจทย์ กองชาม จำนวนกองที่น้อยที่สุดเท่ากับอะไร?",
      en: "In Bowl Stack, the minimum number of stacks equals what?",
    },
    options: [
      {
        id: "a",
        label: { th: "จำนวนชามของขนาดที่ปรากฏซ้ำมากที่สุด", en: "The count of the size that appears most often" },
        why: { th: "ถูกต้อง — ขนาดเท่ากันซ้อนกันไม่ได้ ชามที่ขนาดซ้ำ k ครั้งต้องอยู่ k กอง; ที่เหลือแทรกรอบ ๆ ได้", en: "Correct — equal sizes cannot stack, so a size repeated k times needs k stacks; the rest slot in around them." },
      },
      {
        id: "b",
        label: { th: "จำนวนขนาดที่แตกต่างกันทั้งหมด", en: "The number of distinct sizes" },
        why: { th: "ผิด — ขนาดที่ต่างกันทั้งหมดเรียงเป็นกองเดียวได้ (ถ้าไม่มีตัวซ้ำ คำตอบคือ 1)", en: "Wrong — all-distinct sizes form one stack; with no repeats the answer is 1." },
      },
      {
        id: "c",
        label: { th: "N หารด้วย 2 ปัดขึ้น", en: "N divided by 2, rounded up" },
        why: { th: "ผิด — ไม่เกี่ยวกับ N โดยตรง ขึ้นกับการซ้ำของขนาด", en: "Wrong — it does not depend on N directly, only on how sizes repeat." },
      },
      {
        id: "d",
        label: { th: "ค่ามากสุดของขนาดชาม", en: "The largest bowl size" },
        why: { th: "ผิด — ค่าของขนาดไม่เกี่ยว มีแต่ความถี่ของมัน", en: "Wrong — the size values do not matter, only their frequencies." },
      },
    ],
    correctId: "a",
    sourceRef: "main.py:12-15",
  },
  {
    id: "3349-q2",
    kind: "mcq",
    prompt: {
      th: "ทำไมจึงใช้ sys.stdin.read().split() แทน input() ทีละบรรทัด?",
      en: "Why use sys.stdin.read().split() instead of input() line by line?",
    },
    options: [
      {
        id: "a",
        label: { th: "ขนาดชามมาทีละบรรทัด (สูงสุด 100,000 บรรทัด) split() บน whitespace อ่านทั้งหมดได้ในครั้งเดียว", en: "Sizes arrive one per line (up to 100,000); split() on whitespace reads them all at once" },
        why: { th: "ถูกต้อง — .split() แยกทั้งช่องว่างและ newline จึงรับได้ทั้งแบบบรรทัดละตัวและหลายตัวต่อบรรทัด", en: "Correct — .split() breaks on spaces and newlines alike, handling both one-per-line and many-per-line input." },
      },
      {
        id: "b",
        label: { th: "เพราะ input() ใช้กับตัวเลขไม่ได้", en: "Because input() cannot read numbers" },
        why: { th: "ผิด — input() อ่านได้ แต่ต้อง int() เอง; ประเด็นคือความเร็วและความยืดหยุ่นของรูปแบบ", en: "Wrong — input() works, you just int() it yourself; the point is speed and format flexibility." },
      },
      {
        id: "c",
        label: { th: "เพราะต้องเรียงข้อมูลก่อน", en: "Because the data must be sorted first" },
        why: { th: "ผิด — วิธีนับความถี่ไม่ต้องเรียงเลย", en: "Wrong — the frequency-count approach needs no sorting." },
      },
      {
        id: "d",
        label: { th: "เพราะ read() คืน list ของ int ให้เลย", en: "Because read() returns a list of ints directly" },
        why: { th: "ผิด — read() คืนสตริง ต้อง .split() แล้ว map(int, ...) เอง", en: "Wrong — read() returns a string; you .split() then map(int, ...) yourself." },
      },
    ],
    correctId: "a",
    sourceRef: "main.py:8",
  },
  {
    id: "3349-q3",
    kind: "predict-output",
    prompt: {
      th: "กองชาม: บรรทัดแรกคือ N ตามด้วยขนาดชาม N ค่า ชามขนาดเท่ากันซ้อนกันไม่ได้ ต้องหาจำนวนกองน้อยสุด อินพุต: N=4 ขนาด 5 5 5 5 ผลลัพธ์คือข้อใด?",
      en: "Bowl Stack: line 1 is N, then N bowl sizes; equal sizes cannot share a stack; find the minimum number of stacks. Input: N=4, sizes 5 5 5 5. What is the output?",
    },
    stdin: "4\n5\n5\n5\n5\n",
    options: [
      {
        id: "a",
        label: { th: "4", en: "4" },
        why: { th: "ถูกต้อง — ชามขนาด 5 มี 4 ใบ ซ้อนกันไม่ได้เลย ต้อง 4 กอง", en: "Correct — four bowls of size 5, none can stack, so 4 stacks." },
      },
      {
        id: "b",
        label: { th: "1", en: "1" },
        why: { th: "ผิด — ขนาดเท่ากันต้อง 'เล็กกว่า' อย่างเดียว ซ้อนกันไม่ได้", en: "Wrong — equal sizes need to be strictly smaller to stack; they cannot." },
      },
      {
        id: "c",
        label: { th: "2", en: "2" },
        why: { th: "ผิด — นั่นคือคำตอบของตัวอย่างทางการ (ขนาดหลากหลาย) ไม่ใช่กรณีนี้", en: "Wrong — that is the official example's answer (varied sizes), not this case." },
      },
      {
        id: "d",
        label: { th: "0", en: "0" },
        why: { th: "ผิด — มีชาม 4 ใบ ต้องมีกองอย่างน้อย 1", en: "Wrong — there are 4 bowls; there must be at least 1 stack." },
      },
    ],
    correctId: "a",
    sourceRef: "problem.md §6 (4 / 5 5 5 5)",
  },
  {
    id: "3349-q4",
    kind: "spot-the-bug",
    prompt: {
      th: "โค้ดนี้ควรหาจำนวนกองชามน้อยสุด แต่ตอบผิดเมื่อชามบางขนาดซ้ำกัน บั๊กอยู่ที่ใด?",
      en: "This should find the minimum stacks, but it is wrong when some sizes repeat. Where is the bug?",
    },
    snippet: [
      "data = list(map(int, sys.stdin.read().split()))",
      "n = data[0]",
      "sizes = data[1:1 + n]",
      "counts = Counter(sizes)",
      "print(len(counts))",
    ].join("\n"),
    options: [
      {
        id: "a",
        label: { th: "print(len(counts)) ควรเป็น print(max(counts.values()))", en: "print(len(counts)) should be print(max(counts.values()))" },
        why: { th: "ถูกต้อง — len(counts) นับจำนวนขนาดที่ต่างกัน; คำตอบคือความถี่สูงสุดของขนาดใดขนาดหนึ่ง", en: "Correct — len(counts) counts distinct sizes; the answer is the highest frequency of any one size." },
      },
      {
        id: "b",
        label: { th: "data[1:1 + n] ควรเป็น data[1:n]", en: "data[1:1 + n] should be data[1:n]" },
        why: { th: "ผิด — ต้องเอา n ค่าหลังตัวแรก คือ index 1..n ซึ่งคือ [1:1+n]", en: "Wrong — you need n values after the first, indices 1..n, which is [1:1+n]." },
      },
      {
        id: "c",
        label: { th: "Counter(sizes) ควรเป็น sorted(sizes)", en: "Counter(sizes) should be sorted(sizes)" },
        why: { th: "ผิด — การนับความถี่คือหัวใจของวิธีนี้ ไม่ต้องเรียง", en: "Wrong — frequency counting is the whole method; no sort needed." },
      },
      {
        id: "d",
        label: { th: "n = data[0] ควรเป็น n = len(data)", en: "n = data[0] should be n = len(data)" },
        why: { th: "ผิด — data[0] คือ N ที่โจทย์ให้มา len(data) จะรวม N เข้าไปด้วย", en: "Wrong — data[0] is the given N; len(data) would include the N itself." },
      },
    ],
    correctId: "a",
    sourceRef: "main.py:14-15",
  },
  {
    id: "3349-q5",
    kind: "mcq",
    prompt: {
      th: "Counter(sizes) จากโมดูล collections คืนค่าอะไร?",
      en: "What does Counter(sizes) from the collections module return?",
    },
    options: [
      {
        id: "a",
        label: { th: "dict-like ที่จับคู่ค่าแต่ละตัวกับจำนวนครั้งที่ปรากฏ", en: "A dict-like mapping each value to how many times it appears" },
        why: { th: "ถูกต้อง — เช่น Counter([2,7,2,3,7]) -> {2: 2, 7: 2, 3: 1}", en: "Correct — e.g. Counter([2,7,2,3,7]) -> {2: 2, 7: 2, 3: 1}." },
      },
      {
        id: "b",
        label: { th: "list ที่เรียงลำดับแล้ว", en: "A sorted list" },
        why: { th: "ผิด — Counter ไม่เรียงลำดับและไม่คืน list", en: "Wrong — Counter does not sort and does not return a list." },
      },
      {
        id: "c",
        label: { th: "จำนวนสมาชิกทั้งหมด (เท่ากับ len)", en: "The total number of elements (same as len)" },
        why: { th: "ผิด — นั่นคือ len(sizes) ; Counter คืนตารางความถี่", en: "Wrong — that is len(sizes); Counter returns a frequency table." },
      },
      {
        id: "d",
        label: { th: "set ของค่าที่ไม่ซ้ำ", en: "A set of the unique values" },
        why: { th: "ผิด — set(sizes) ทิ้งจำนวนครั้ง Counter เก็บไว้", en: "Wrong — set(sizes) drops the counts; Counter keeps them." },
      },
    ],
    correctId: "a",
    sourceRef: "main.py:14",
  },
];

// ---------------------------------------------------------------------------
// 3355 — Shorten (ย่อช่วงตัวเลข)
// ---------------------------------------------------------------------------
const shorten: QuizQuestion[] = [
  {
    id: "3355-q1",
    kind: "mcq",
    prompt: {
      th: "ใน Shorten การอ่านอินพุตหยุดเมื่อใด?",
      en: "In Shorten, when does reading the input stop?",
    },
    options: [
      {
        id: "a",
        label: { th: "เมื่ออ่านได้ค่า -1 (sentinel) — ค่าอื่นทั้งหมดก่อนหน้านั้นคือข้อมูลจริง", en: "When it reads -1 (the sentinel) — everything before that is real data" },
        why: { th: "ถูกต้อง — for token ...: if int(token) == -1: break", en: "Correct — for token ...: if int(token) == -1: break." },
      },
      {
        id: "b",
        label: { th: "เมื่ออ่านครบ N บรรทัด", en: "After reading N lines" },
        why: { th: "ผิด — โจทย์ไม่บอก N จำนวนบรรทัดไม่แน่นอน จบด้วย -1", en: "Wrong — there is no N; the line count is unknown, ended by -1." },
      },
      {
        id: "c",
        label: { th: "เมื่อค่าเริ่มลดลง", en: "When a value decreases" },
        why: { th: "ผิด — โจทย์รับประกันว่าค่าเพิ่มขึ้นเสมอ (ยกเว้น -1 ปิดท้าย)", en: "Wrong — values are guaranteed increasing (except the -1 terminator)." },
      },
      {
        id: "d",
        label: { th: "เมื่อเจอบรรทัดว่าง", en: "On an empty line" },
        why: { th: "ผิด — ตัวจบคือ -1 ไม่ใช่บรรทัดว่าง", en: "Wrong — the terminator is -1, not a blank line." },
      },
    ],
    correctId: "a",
    sourceRef: "main.py:8-12",
  },
  {
    id: "3355-q2",
    kind: "mcq",
    prompt: {
      th: "ตัวแปร start และ prev ในลูปหลักเก็บอะไร?",
      en: "What do start and prev hold in the main loop?",
    },
    options: [
      {
        id: "a",
        label: { th: "start = เลขแรกของช่วงที่กำลังสร้าง, prev = เลขล่าสุดที่เพิ่งเพิ่มเข้าช่วงนั้น", en: "start = the first number of the current range; prev = the most recent number added to it" },
        why: { th: "ถูกต้อง — เมื่อเจอ gap จะ emit ช่วง start..prev แล้วเปิดช่วงใหม่", en: "Correct — on a gap it emits the range start..prev, then opens a new range." },
      },
      {
        id: "b",
        label: { th: "start = 0 เสมอ, prev = ตัวนับ", en: "start is always 0; prev is a counter" },
        why: { th: "ผิด — start เริ่มที่ nums[0] และเปลี่ยนทุกครั้งที่ขึ้นช่วงใหม่", en: "Wrong — start begins at nums[0] and changes at every new range." },
      },
      {
        id: "c",
        label: { th: "start = ผลรวม, prev = ค่าเฉลี่ย", en: "start = a sum; prev = an average" },
        why: { th: "ผิด — ไม่มีการบวกหรือหาค่าเฉลี่ยในโจทย์นี้", en: "Wrong — there is no summing or averaging in this problem." },
      },
      {
        id: "d",
        label: { th: "start = index, prev = ค่า", en: "start = an index; prev = a value" },
        why: { th: "ผิด — ทั้งคู่เป็นค่าตัวเลขจากอินพุต ไม่ใช่ดัชนี", en: "Wrong — both are values from the input, not indices." },
      },
    ],
    correctId: "a",
    sourceRef: "main.py:15-16",
  },
  {
    id: "3355-q3",
    kind: "predict-output",
    prompt: {
      th: "Shorten: รับจำนวนเต็มบวกทีละบรรทัด (เรียงเพิ่มขึ้น) จนเจอ -1 แล้วย่อช่วงต่อเนื่องเป็น a-b ตัวเดี่ยวเป็น a คั่นด้วย ', ' อินพุตก่อน -1 คือ 1 3 5 7 ผลลัพธ์คือข้อใด?",
      en: "Shorten: read increasing positive integers, one per line, until -1; compress consecutive runs to a-b, singletons to a, joined by ', '. Input before -1 is 1 3 5 7. What is the output?",
    },
    stdin: "1\n3\n5\n7\n-1\n",
    options: [
      {
        id: "a",
        label: { th: "1, 3, 5, 7", en: "1, 3, 5, 7" },
        why: { th: "ถูกต้อง — ไม่มีคู่ที่ต่างกัน 1 เลย ทุกตัวเป็น singleton", en: "Correct — no pair differs by 1, so every value is a singleton." },
      },
      {
        id: "b",
        label: { th: "1-7", en: "1-7" },
        why: { th: "ผิด — 1 ถึง 7 ไม่ต่อเนื่อง (ขาด 2, 4, 6)", en: "Wrong — 1 to 7 is not consecutive (2, 4, 6 are missing)." },
      },
      {
        id: "c",
        label: { th: "1-3, 5-7", en: "1-3, 5-7" },
        why: { th: "ผิด — 1 กับ 3 ไม่ติดกัน ต้อง prev + 1 เท่านั้นจึงต่อช่วง", en: "Wrong — 1 and 3 are not adjacent; a range continues only on prev + 1." },
      },
      {
        id: "d",
        label: { th: "1 3 5 7", en: "1 3 5 7" },
        why: { th: "ผิด — ต้องคั่นด้วย ', ' (จุลภาคและช่องว่าง) ไม่ใช่ช่องว่างเปล่า", en: "Wrong — pieces are joined by ', ' (comma and space), not a bare space." },
      },
    ],
    correctId: "a",
    sourceRef: "problem.md §6 (1 3 5 7)",
  },
  {
    id: "3355-q4",
    kind: "spot-the-bug",
    prompt: {
      th: "โค้ดนี้ควรย่อช่วงตัวเลข แต่ผลลัพธ์ขาดช่วงสุดท้ายไปเสมอ บั๊กอยู่ที่ใด?",
      en: "This should shorten the ranges, but the output always drops the final range. Where is the bug?",
    },
    snippet: [
      "start = prev = nums[0]",
      "for value in nums[1:]:",
      "    if value == prev + 1:",
      "        prev = value",
      "        continue",
      '    parts.append(str(start) if start == prev else f"{start}-{prev}")',
      "    start = prev = value",
    ].join("\n"),
    options: [
      {
        id: "a",
        label: { th: "ขาดการ emit ช่วงสุดท้ายหลังจบลูป — ต้องมี parts.append(...) อีกครั้ง", en: "Missing a final emit after the loop — one more parts.append(...) is needed" },
        why: { th: "ถูกต้อง — ลูป emit เฉพาะตอนเจอ gap ช่วงสุดท้ายไม่มี gap ตามหลัง จึงไม่ถูกเพิ่ม", en: "Correct — the loop only emits on a gap; the last range has no trailing gap, so it is never added." },
      },
      {
        id: "b",
        label: { th: "nums[1:] ควรเป็น nums[0:]", en: "nums[1:] should be nums[0:]" },
        why: { th: "ผิด — nums[0] ถูกใช้ตั้งค่า start/prev แล้ว ลูปต้องเริ่มที่ตัวที่สอง", en: "Wrong — nums[0] already seeds start/prev; the loop must start at the second value." },
      },
      {
        id: "c",
        label: { th: "value == prev + 1 ควรเป็น value >= prev + 1", en: "value == prev + 1 should be value >= prev + 1" },
        why: { th: "ผิด — ช่วงต่อเนื่องแปลว่าห่างกันพอดี 1 การใช้ >= จะรวมเลขที่ไม่ติดกัน", en: "Wrong — a consecutive run means exactly +1; >= would merge non-adjacent numbers." },
      },
      {
        id: "d",
        label: { th: "continue ควรเป็น break", en: "continue should be break" },
        why: { th: "ผิด — break จะออกจากลูปทันทีเมื่อเจอคู่ต่อเนื่องคู่แรก", en: "Wrong — break would exit the loop at the first consecutive pair." },
      },
    ],
    correctId: "a",
    sourceRef: "main.py:20-22",
  },
  {
    id: "3355-q5",
    kind: "mcq",
    prompt: {
      th: 'นิพจน์ str(start) if start == prev else f"{start}-{prev}" ทำหน้าที่อะไร?',
      en: 'What does str(start) if start == prev else f"{start}-{prev}" do?',
    },
    options: [
      {
        id: "a",
        label: { th: "พิมพ์ช่วงเป็น a ถ้ามีตัวเดียว (start == prev) หรือ a-b ถ้าเป็นช่วง", en: "Renders the range as a when it is a singleton (start == prev), or a-b for a real range" },
        why: { th: "ถูกต้อง — ternary เดียวจัดการทั้งสองกรณี ไม่ต้อง if/else สองชั้น", en: "Correct — one ternary handles both cases without a nested if/else." },
      },
      {
        id: "b",
        label: { th: "บวก start กับ prev", en: "Adds start and prev" },
        why: { th: "ผิด — ไม่มีการบวก มีแต่การจัดรูปแบบเป็นสตริง", en: "Wrong — nothing is added; it only formats a string." },
      },
      {
        id: "c",
        label: { th: "ตรวจว่า start น้อยกว่า prev หรือไม่", en: "Checks whether start is less than prev" },
        why: { th: "ผิด — เทียบ == (เท่ากัน) ไม่ใช่ < ", en: "Wrong — it compares == (equal), not <." },
      },
      {
        id: "d",
        label: { th: "แปลง start เป็น int", en: "Converts start to int" },
        why: { th: "ผิด — start เป็น int อยู่แล้ว str() แปลงเป็นสตริงเพื่อพิมพ์", en: "Wrong — start is already an int; str() makes it a string for output." },
      },
    ],
    correctId: "a",
    sourceRef: "main.py:20",
  },
  {
    id: "3355-q6",
    kind: "pep8",
    prompt: {
      th: "การเขียน start = prev = nums[0] ในบรรทัดเดียวถือว่าอย่างไรตาม PEP-8?",
      en: "How does PEP-8 view start = prev = nums[0] on one line?",
    },
    options: [
      {
        id: "a",
        label: { th: "ใช้ได้ — chained assignment ตั้งค่าสองตัวแปรให้ค่าเดียวกันอย่างชัดเจน", en: "Fine — a chained assignment clearly sets two names to the same value" },
        why: { th: "ถูกต้อง — PEP-8 ยอมรับ a = b = value เมื่อสองตัวแปรควรเริ่มเท่ากันจริง ๆ", en: "Correct — PEP-8 accepts a = b = value when both names genuinely should start equal." },
      },
      {
        id: "b",
        label: { th: "ผิด — ต้องแยกเป็นสองบรรทัดเสมอ", en: "Wrong — it must always be two separate lines" },
        why: { th: "ผิด — PEP-8 ไม่ห้าม chained assignment", en: "Wrong — PEP-8 does not forbid chained assignment." },
      },
      {
        id: "c",
        label: { th: "ผิด — ควรใช้ tuple: start, prev = nums[0], nums[0]", en: "Wrong — use a tuple: start, prev = nums[0], nums[0]" },
        why: { th: "ผิด — นั่นทำงานเหมือนกันแต่ยาวกว่าและซ้ำ nums[0] ", en: "Wrong — that behaves the same but is longer and repeats nums[0]." },
      },
      {
        id: "d",
        label: { th: "ผิด — chained assignment ทำให้ทั้งสองตัวชี้ list เดียวกัน", en: "Wrong — chained assignment makes both names share one list" },
        why: { th: "ผิด — nums[0] เป็น int (immutable) ไม่มีปัญหา aliasing เหมือน list", en: "Wrong — nums[0] is an int (immutable); there is no list-aliasing issue here." },
      },
    ],
    correctId: "a",
    sourceRef: "main.py:15",
  },
];

// ---------------------------------------------------------------------------
// QUIZ_BANK registry for all 14 PSCP Recommended Problems
// ---------------------------------------------------------------------------
export const QUIZ_BANK: Record<number, QuizQuestion[]> = {
  2996: swapCharacters,
  2997: elo,
  2998: euclidean,
  3019: safePassword,
  3020: coke,
  3022: temperature,
  3159: factorial,
  3167: fizzbuzz,
  3226: inflation,
  3237: triangle,
  3290: leftArrow,
  3293: bigFrame,
  3349: bowlStack,
  3355: shorten,
};
