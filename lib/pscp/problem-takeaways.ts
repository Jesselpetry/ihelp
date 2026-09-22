/**
 * Per-problem takeaway cards for the /recommended reader, keyed by OJ id.
 * Pure data — kept out of python-code-viewer.tsx so the content validator
 * (scripts/validate-content.ts) can import it without pulling client-only
 * modules (a CSS import breaks tsx).
 */
export interface ProblemTakeaway {
  summary: { th: string; en: string };
  points: { th: string; en: string }[];
  complexity: { time: string; space: string };
  pep8Tip: { th: string; en: string };
}

export const PROBLEM_TAKEAWAYS: Record<number, ProblemTakeaway> = {
  2996: {
    summary: {
      th: "การกลับลำดับตัวอักษร (String Reversal) และการแปลงตัวพิมพ์เล็ก/ใหญ่",
      en: "String reversal slicing pattern and case normalization.",
    },
    points: [
      {
        th: "ใช้ String Slicing [::-1] เพื่อกลับด้านสตริงทั้งหมดได้ทันทีในเวลา O(N)",
        en: "Use [::-1] slice step of -1 to reverse the entire string in O(N).",
      },
      {
        th: "ใช้ .lower() หรือ .upper() ในการปรับขนาดตัวอักษรให้สอดคล้องกับข้อกำหนด",
        en: "Use .lower() or .upper() methods for consistent character casing.",
      },
      {
        th: "ระวังการตัดช่องว่างหัว-ท้ายด้วย .strip() หากต้องการลบ newline",
        en: "Handle whitespace and newlines carefully using .strip().",
      },
    ],
    complexity: { time: "O(N)", space: "O(N)" },
    pep8Tip: {
      th: "เว้นวรรค 2 บรรทัดว่างก่อนและหลังฟังก์ชันหลักตามมาตรฐาน PEP-8",
      en: "Surround top-level function definitions with 2 blank lines.",
    },
  },
  2997: {
    summary: {
      th: "การคำนวณสูตรคณิตศาสตร์ยกกำลังและการจัด Format ทศนิยม 2 ตำแหน่ง",
      en: "Elo rating exponentiation formula and 2-decimal formatting.",
    },
    points: [
      {
        th: "สูตรความน่าจะเป็น Elo: Ea = 1 / (1 + 10 ** ((Rb - Ra) / 400))",
        en: "Elo formula: Ea = 1 / (1 + 10 ** ((Rb - Ra) / 400)).",
      },
      {
        th: "ใช้ตัวดำเนินการ ** สำหรับการยกกำลัง และระวังลำดับการใส่วงเล็บ",
        en: "Use ** operator for exponentiation and enclose parentheses correctly.",
      },
      {
        th: "จัดแสดงผลทศนิยม 2 ตำแหน่งด้วย f-string {:.2f}",
        en: "Format output to exactly 2 decimal places using f'{ea:.2f}'.",
      },
    ],
    complexity: { time: "O(1)", space: "O(1)" },
    pep8Tip: {
      th: "เว้นวรรค 1 ช่องรอบตัวดำเนินการคำนวณ เช่น +, -, *, / ยกเว้น ** อาจไม่เว้นเพื่อเน้นความสำคัญ",
      en: "Place a space around binary operators (+, -, *, /).",
    },
  },
  2998: {
    summary: {
      th: "การหาระยะทางแบบยูคลิด 2 มิติ (Euclidean Distance)",
      en: "Calculating 2D Euclidean Distance between two coordinate points.",
    },
    points: [
      {
        th: "สูตรระยะห่าง: d = sqrt((x1 - x2)**2 + (y1 - y2)**2)",
        en: "Distance formula: d = sqrt((x1 - x2)**2 + (y1 - y2)**2).",
      },
      {
        th: "สามารถใช้ math.sqrt(...) หรือยกกำลังครึ่ง ** 0.5 ได้อย่างถูกต้อง",
        en: "Use math.sqrt(...) or ** 0.5 for square root calculation.",
      },
      {
        th: "แปลง input เป็น float() เพื่อรองรับพิกัดที่มีจุดทศนิยม",
        en: "Cast inputs to float() to handle non-integer coordinates.",
      },
      {
        th: "ห้ามปัดทศนิยม! print(distance) ตรง ๆ พิมพ์ค่าเต็มของ float ต่างจากข้อ Temperature/Elo ที่บังคับ :.2f",
        en: "Do not round! print(distance) directly outputs the full float precision — unlike Temperature/Elo, which require :.2f.",
      },
    ],
    complexity: { time: "O(1)", space: "O(1)" },
    pep8Tip: {
      th: "นำเข้า import math ไว้ที่บรรทัดบนสุดของไฟล์เสมอ อย่าย่อชื่อเป็น import math as m",
      en: "Place import math at the top of the file — do not abbreviate it as import math as m.",
    },
  },
  3019: {
    summary: {
      th: "เทียบรหัสตู้เซฟแบบตรงตัว (case-sensitive) แล้วแยก 4 กรณีด้วย if-elif-else",
      en: "Exact case-sensitive safe-code comparison branched into 4 states with if-elif-else.",
    },
    points: [
      {
        th: 'เทียบตัวอักษรกับ "H" ด้วย == ตรง ๆ ห้ามใช้ .lower()/.upper() ช่วย เพราะ "h" ต้องนับว่าผิด',
        en: 'Compare the character to "H" with == directly — never .lower()/.upper(), since "h" must count as wrong.',
      },
      {
        th: "เก็บผลเทียบไว้ในตัวแปรบูลีน (char_ok, digit_ok) ก่อน แล้วค่อยแยกเงื่อนไข อ่านง่ายกว่า",
        en: "Store each comparison in a boolean (char_ok, digit_ok) first, then branch — easier to read than inline conditions.",
      },
      {
        th: "เช็กกรณีเจาะจงที่สุดก่อน (ถูกทั้งคู่) แล้วไล่ elif ลงมา ไม่ต้องเขียน and not ซ้ำเพราะเข้า elif แปลว่าเงื่อนไขก่อนหน้าเป็นเท็จแล้ว",
        en: "Check the most specific case first (both correct), then elif down — no need for and not since reaching elif already means the prior condition was false.",
      },
    ],
    complexity: { time: "O(1)", space: "O(1)" },
    pep8Tip: {
      th: "ตั้งชื่อค่าคงที่ CORRECT_CHAR และ CORRECT_DIGIT เป็นตัวพิมพ์ใหญ่ทั้งหมด วางไว้นอกฟังก์ชัน",
      en: "Name constants CORRECT_CHAR and CORRECT_DIGIT in ALL_CAPS, declared outside the function.",
    },
  },
  3020: {
    summary: {
      th: "เทคนิคคณิตศาสตร์ O(1) สำหรับปัญหาการแลกฝาโค้ก แทนการวนลูปทีละขวด",
      en: "Fast O(1) mathematical reduction for the Coke bottle-cap exchange, instead of simulating bottle by bottle.",
    },
    points: [
      {
        th: "ขวดแรกยังไม่มีฝาเลย ฝาที่แลกได้จริงจึงมีแค่ max(d - 1, 0) ฝา ไม่ใช่ d ฝา",
        en: "The first bottle earns no cap yet, so only max(d - 1, 0) caps are actually redeemable — not d caps.",
      },
      {
        th: "promo_bottles = max(d - 1, 0) // b, total = promo_bottles * c + (d - promo_bottles) * a",
        en: "promo_bottles = max(d - 1, 0) // b, total = promo_bottles * c + (d - promo_bottles) * a.",
      },
      {
        th: "max(d - 1, 0) กันทั้งกรณี d = 0 ในนิพจน์เดียว และต้องดัก b = 0 แยกเพื่อกัน ZeroDivisionError",
        en: "max(d - 1, 0) covers the d == 0 case in one expression; b == 0 still needs a separate guard to avoid ZeroDivisionError.",
      },
    ],
    complexity: { time: "O(1)", space: "O(1)" },
    pep8Tip: {
      th: "ใช้ // สำหรับการหารปัดเศษลง (Integer Division) และ % สำหรับเศษ",
      en: "Use integer division // and modulo % clearly with spaces.",
    },
  },
  3022: {
    summary: {
      th: "Hub-and-Spoke Pattern สำหรับแปลงหน่วยวัดอุณหภูมิ",
      en: "Hub-and-Spoke Normalization pattern for unit conversion.",
    },
    points: [
      {
        th: "แปลงหน่วยต้นทางใดๆ เข้าสู่หน่วยกลาง (Celsius) ก่อนเสมอ",
        en: "Always normalize the source unit into Celsius first.",
      },
      {
        th: "จาก Celsius จึงแปลงออกไปยังหน่วยปลายทางที่ต้องการ",
        en: "Then convert from Celsius out to the target destination unit.",
      },
      {
        th: "ลดจำนวนเงื่อนไขจาก N x N เหลือเพียง 2N กิ่ง ทำให้โค้ดอ่านง่ายและไม่มีบั๊ก",
        en: "Reduces combinatorial paths from N*N down to 2N branches.",
      },
    ],
    complexity: { time: "O(1)", space: "O(1)" },
    pep8Tip: {
      th: "ตั้งชื่อตัวแปรและฟังก์ชันเป็นพิมพ์เล็กคั่นด้วย underscore (snake_case)",
      en: "Use lowercase words separated by underscores for function and variable names.",
    },
  },
  3159: {
    summary: {
      th: "Loop Accumulator และการคำนวณ Factorial",
      en: "Product accumulator loop pattern and factorial handling.",
    },
    points: [
      {
        th: "ตั้งค่าตัวแปรสะสมผลคูณเริ่มต้น result = 1 (ห้ามเริ่มด้วย 0) เพราะ 1 คือเอกลักษณ์การคูณ",
        en: "Initialize the product accumulator to result = 1 (never 0) — 1 is the multiplicative identity.",
      },
      {
        th: "วนลูป for i in range(2, n + 1): แล้วสะสมค่า result *= i (เริ่มที่ 2 เพราะคูณ 1 รอบแรกไม่เปลี่ยนอะไร)",
        en: "Iterate with range(2, n + 1) and accumulate result *= i — starting at 2 since multiplying by 1 first changes nothing.",
      },
      {
        th: "n = 0 และ n = 1 ได้คำตอบถูกอัตโนมัติ: range(2, n+1) ว่างเปล่า ลูปไม่ทำงาน result คงเป็น 1 โดยไม่ต้องเขียน if ดักพิเศษ",
        en: "n = 0 and n = 1 resolve automatically: range(2, n+1) is empty, so the loop never runs and result stays 1 — no special-case if needed.",
      },
    ],
    complexity: { time: "O(N)", space: "O(1)" },
    pep8Tip: {
      th: "ไม่เว้นวรรคชิดกับเครื่องหมายวงเล็บ: range(1, n + 1) ถูกต้อง, range( 1, n + 1 ) ผิด",
      en: "Avoid extraneous whitespace immediately inside parentheses.",
    },
  },
  3167: {
    summary: {
      th: "การจัดลำดับเงื่อนไข Modulo (%) ในปัญหา FizzBuzz",
      en: "Modulo condition ordering and branch precedence.",
    },
    points: [
      {
        th: "ตรวจสอบเงื่อนไขที่เฉพาะเจาะจงที่สุดก่อนเสมอ: if not i % 15 (FizzBuzz)",
        en: "Check the most specific condition first: if not i % 15.",
      },
      {
        th: "จากนั้นจึงตรวจสอบ elif not i % 3 (Fizz) และ elif not i % 5 (Buzz)",
        en: "Follow with elif not i % 3 for Fizz and elif not i % 5 for Buzz.",
      },
      {
        th: "หากไม่ตรงกับเงื่อนไขใด ให้พิมพ์ตัวเลข i ในบล็อก else",
        en: "Fallback to printing the number itself in the else branch.",
      },
    ],
    complexity: { time: "O(1)", space: "O(1)" },
    pep8Tip: {
      th: "ใช้ if not i % 15 แทน if i % 15 == 0 ตามคำแนะนำของ Pylint เพื่อความกระชับและลด warning",
      en: "Simplify i % k == 0 to not i % k as 0 is falsey in boolean context.",
    },
  },
  3226: {
    summary: {
      th: "เงินเฟ้อทบต้น 3.81% ต่อปี คำนวณด้วยจำนวนเต็ม (สตางค์) เพื่อตัดเศษให้ตรงตามโจทย์",
      en: "Compound inflation at 3.81% per year, computed in integer satang to truncate exactly as required.",
    },
    points: [
      {
        th: "อัตราคือ 3.81% ไม่ใช่ 7% — ต้องตัดเศษทุกปีระหว่างลูป ไม่ใช่เก็บค่าเต็มไว้แล้วตัดตอนพิมพ์ (จุดที่คนพลาดบ่อยสุด)",
        en: "The rate is 3.81%, not 7% — truncate every year inside the loop, not once at the end (the most common mistake here).",
      },
      {
        th: "แปลงเป็นสตางค์ก่อนคำนวณ: satang += satang * 381 // 10000 ใช้ // เพื่อตัดเศษทิ้งพอดี ห้ามใช้ float สะสมหลายปีเพราะคลาดเคลื่อนสะสม",
        en: "Convert to satang first: satang += satang * 381 // 10000, using // to truncate exactly — never accumulate in float across years, error compounds.",
      },
      {
        th: "ตอนพิมพ์ห้ามหาร / กลับเป็น float ถ้า k มากพอ satang จะใหญ่เกิน float รับไหวจนเกิด OverflowError",
        en: "Never divide back to float with / when printing — for large k, satang can exceed what float can hold, raising OverflowError.",
      },
    ],
    complexity: { time: "O(K)", space: "O(1)" },
    pep8Tip: {
      th: "ใช้ตัวแปร _ สำหรับลูปที่ไม่ได้นำค่า index ไปใช้งาน",
      en: "Use throwaway variable _ for dummy loop iterations.",
    },
  },
  3237: {
    summary: {
      th: "สามเหลี่ยมกลวงชิดซ้ายด้วยเลข 0/1 (ไม่ใช่ดอกจัน) โดยใช้ String Multiplication",
      en: "Hollow left-aligned triangle drawn with 0/1 digits (not asterisks), via string multiplication.",
    },
    points: [
      {
        th: 'แถวแรก (i=1) และแถวสุดท้าย (i=n) เป็นขอบทึบ: "0" * i ส่วนแถวกลางคือ "0" + "1" * (i - 2) + "0"',
        en: 'First (i=1) and last (i=n) rows are solid edges: "0" * i; middle rows are "0" + "1" * (i - 2) + "0".',
      },
      {
        th: 'ต้องดักแถวแรกแยก มิฉะนั้น "1" * (1 - 2) จะเป็น "1" * -1 ซึ่งคืนสตริงว่างเปล่าแบบเงียบ ๆ ไม่ error ทำให้ได้ "00" ที่ผิด',
        en: 'The first row must be special-cased — otherwise "1" * (1 - 2) becomes "1" * -1, which silently returns an empty string (no error), giving the wrong "00".',
      },
      {
        th: "รวมเงื่อนไขขอบบน-ล่างด้วย if i in (1, n): แทน if i == 1 or i == n: สั้นกว่าและ pylint แนะนำ (consider-using-in)",
        en: "Combine the top/bottom edge check as if i in (1, n): instead of if i == 1 or i == n: — shorter, and pylint recommends it (consider-using-in).",
      },
    ],
    complexity: { time: "O(N)", space: "O(N)" },
    pep8Tip: {
      th: "ใช้ i in (1, n) แทนการเทียบ == ต่อกันด้วย or ตามคำแนะนำ consider-using-in ของ pylint",
      en: "Use i in (1, n) instead of chained == comparisons with or, per pylint's consider-using-in advice.",
    },
  },
  3290: {
    summary: {
      th: "ลูกศรชี้ซ้ายด้วย loop เดียว: การเยื้องของแต่ละแถวคือระยะห่างจากแถวกลาง",
      en: "A left arrow drawn with one loop: each row's indent is its distance from the middle row.",
    },
    points: [
      {
        th: "n เป็นเลขคี่ จึงมีแถวกลางแถวเดียว mid = n // 2 คือดัชนีของมัน",
        en: "n is odd, so there is exactly one middle row; mid = n // 2 is its index.",
      },
      {
        th: "การเยื้องของแถว i คือ abs(i - mid) — abs() ทำให้ค่าสมมาตรทั้งด้านบนและล่างโดยไม่ต้องมี if row < mid",
        en: "Row i's indent is abs(i - mid) — abs() makes the value symmetric above and below the middle without an if row < mid branch.",
      },
      {
        th: 'แต่ละแถวสร้างจาก " " * indent + "*" * k ห้ามมีช่องว่างต่อท้ายดาว มิฉะนั้น iJudge จะไม่ผ่าน',
        en: 'Each row is " " * indent + "*" * k — no trailing spaces after the stars, or iJudge rejects the line.',
      },
    ],
    complexity: { time: "O(n * k)", space: "O(k)" },
    pep8Tip: {
      th: "ตั้งชื่อ mid ให้สื่อความหมาย ดีกว่าใส่ n // 2 ซ้ำ ๆ กลางลูป",
      en: "Name the midpoint (mid) rather than repeating n // 2 inside the loop.",
    },
  },
  3293: {
    summary: {
      th: "ตีกรอบข้อความ 5 บรรทัด: หาความกว้างมากสุดก่อน แล้วเติมช่องว่างให้เท่ากันด้วย ljust",
      en: "Frame 5 lines of text: find the widest line first, then pad every line to that width with ljust.",
    },
    points: [
      {
        th: "ต้องอ่านครบ 5 บรรทัดก่อน จึงจะรู้ความกว้างของกรอบ — เก็บลง list ก่อน แล้วค่อยพิมพ์",
        en: "You must read all 5 lines before you know the frame width — collect into a list first, print second.",
      },
      {
        th: "ตัดช่องว่างท้ายบรรทัดด้วย .rstrip() ก่อนวัดความกว้าง มิฉะนั้นกรอบจะกว้างเกินจริง (บั๊กที่พบบ่อย)",
        en: "Strip trailing spaces with .rstrip() before measuring, or the frame comes out too wide (the common bug).",
      },
      {
        th: 'ขอบกรอบยาว width + 4 (ดาวซ้าย-ขวา + ช่องว่างข้างละ 1) แถวข้อความคือ "* " + s.ljust(width) + " *"',
        en: 'The border is width + 4 long (left/right star + one pad space each side); a text row is "* " + s.ljust(width) + " *".',
      },
    ],
    complexity: { time: "O(total characters)", space: "O(total characters)" },
    pep8Tip: {
      th: "สร้างสตริงขอบกรอบไว้ครั้งเดียวแล้วใช้ซ้ำทั้งบน-ล่าง ไม่ต้องสร้างใหม่",
      en: "Build the border string once and reuse it top and bottom — do not rebuild it.",
    },
  },
  3349: {
    summary: {
      th: "จำนวนกองชามน้อยสุด = จำนวนชามของขนาดที่ซ้ำมากที่สุด (เพราะขนาดเท่ากันซ้อนกันไม่ได้)",
      en: "Minimum bowl stacks = the count of the most-repeated size (equal sizes cannot share a stack).",
    },
    points: [
      {
        th: "จัดกองได้อิสระ ชุดที่ขนาดต่างกันหมดเรียงเป็นกองเดียวได้เสมอ สิ่งที่บังคับให้เพิ่มกองคือขนาดที่ซ้ำ",
        en: "You may reorder freely; all-distinct sizes always fit one decreasing stack. Only a repeated size forces another stack.",
      },
      {
        th: "รับ N แล้วอีก N บรรทัด ใช้ sys.stdin.read().split() ตัดทุก whitespace รวม newline",
        en: "Read N then N more lines with sys.stdin.read().split(), which splits on any whitespace, newlines included.",
      },
      {
        th: "collections.Counter นับความถี่ในรอบเดียว O(N) แล้ว max(counts.values()) คือคำตอบ",
        en: "collections.Counter tallies frequencies in one O(N) pass; max(counts.values()) is the answer.",
      },
    ],
    complexity: { time: "O(N)", space: "O(distinct sizes)" },
    pep8Tip: {
      th: "import ที่หัวไฟล์ (sys, from collections import Counter) เว้น 2 บรรทัดว่างก่อน def",
      en: "Imports at the top (sys, from collections import Counter); two blank lines before def.",
    },
  },
  3355: {
    summary: {
      th: "ย่อลำดับเลขต่อเนื่องเป็นช่วง a-b โดยจำ start กับ prev ของช่วงปัจจุบันไว้",
      en: "Compress consecutive integers into a-b ranges by tracking the current range's start and prev.",
    },
    points: [
      {
        th: "อ่านจนเจอ sentinel -1 ไม่ใช่จนจบไฟล์ — for token in ...: if int(token) == -1: break",
        en: "Read until the sentinel -1, not until end of file — for token in ...: if int(token) == -1: break.",
      },
      {
        th: "ช่วงต่อเมื่อ value == prev + 1 (เลื่อน prev) มิฉะนั้นปิดช่วงเดิมแล้วเปิดช่วงใหม่",
        en: "The range continues when value == prev + 1 (advance prev); otherwise close it and open a new one.",
      },
      {
        th: "ต้อง emit ช่วงสุดท้ายหลังจบลูป (ไม่มี gap ตามหลัง) — บั๊กที่พบบ่อยคือลืมบรรทัดนี้",
        en: "You must emit the final range after the loop (no trailing gap) — forgetting this line is the common bug.",
      },
    ],
    complexity: { time: "O(N)", space: "O(N)" },
    pep8Tip: {
      th: 'ใช้ ternary เดียว str(start) if start == prev else f"{start}-{prev}" แทน if/else สองชั้น',
      en: 'Use one ternary, str(start) if start == prev else f"{start}-{prev}", instead of a nested if/else.',
    },
  },
};
