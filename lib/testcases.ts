import type { TestCase } from "@/lib/grader-types";

// Test cases for each recommended problem (keyed by OJ id), extracted verbatim
// from each problem's `data/recommended/<folder>/problem.md`:
//   - §4 "Official Examples" -> official: true
//   - §6 "Additional Test Cases" -> official: false
// Every `stdin`/`expected` pair below has been verified by running the
// problem's reference `main.py` directly:
//   printf '<stdin>' | python3 data/recommended/<folder>/main.py
// and diffing against the value shown here. See the PR/agent report for the
// full verification transcript.

export const TEST_CASES: Record<number, TestCase[]> = {
  // OJ 2996 - Swap Characters
  2996: [
    {
      id: "2996-off-1",
      stdin: "harry",
      expected: "yrrah",
      label: { th: "ตัวอย่างทางการที่ 1", en: "Official Example 1" },
      official: true,
    },
    {
      id: "2996-off-2",
      stdin: "Maryi",
      expected: "iyram",
      label: { th: "ตัวอย่างทางการที่ 2", en: "Official Example 2" },
      official: true,
    },
    {
      id: "2996-extra-1",
      stdin: "harry",
      expected: "yrrah",
      label: { th: "เคสทดสอบเพิ่มเติม 1", en: "Extra Case 1" },
      official: false,
      tests: { th: "ตัวอย่างทางการ ตัวพิมพ์เล็กอยู่แล้ว", en: "Official example, already lowercase" },
    },
    {
      id: "2996-extra-2",
      stdin: "Maryi",
      expected: "iyram",
      label: { th: "เคสทดสอบเพิ่มเติม 2", en: "Extra Case 2" },
      official: false,
      tests: { th: "ตัวอย่างทางการ มีตัวพิมพ์ใหญ่ให้แปลง", en: "Official example, has an uppercase letter to convert" },
    },
    {
      id: "2996-extra-3",
      stdin: "ABCDE",
      expected: "edcba",
      label: { th: "เคสทดสอบเพิ่มเติม 3", en: "Extra Case 3" },
      official: false,
      tests: { th: "ตัวพิมพ์ใหญ่ทั้งหมด ทดสอบ .lower()", en: "All uppercase, verifies .lower()" },
    },
    {
      id: "2996-extra-4",
      stdin: "aBcDe",
      expected: "edcba",
      label: { th: "เคสทดสอบเพิ่มเติม 4", en: "Extra Case 4" },
      official: false,
      tests: { th: "ตัวพิมพ์ผสม", en: "Mixed case" },
    },
  ],

  // OJ 2997 - Elo
  2997: [
    {
      id: "2997-off-1",
      stdin: "1500\n1500\nA",
      expected: "0.50",
      label: { th: "ตัวอย่างทางการที่ 1", en: "Official Example 1" },
      official: true,
      tests: { th: "เรตติ้งเท่ากัน โอกาสต้อง 50-50", en: "Equal rating, expected probability must be 0.50" },
    },
    {
      id: "2997-off-2",
      stdin: "1600\n1400\nA",
      expected: "0.76",
      label: { th: "ตัวอย่างทางการที่ 2", en: "Official Example 2" },
      official: true,
      tests: { th: "ทดสอบเครื่องหมายบวก/ลบในเลขชี้กำลัง", en: "Tests correct positive/negative sign in exponent" },
    },
    {
      id: "2997-off-3",
      stdin: "1600\n1400\nB",
      expected: "0.24",
      label: { th: "ตัวอย่างทางการที่ 3", en: "Official Example 3" },
      official: true,
      tests: { th: "ทดสอบกิ่ง else สำหรับผู้เล่น B", en: "Tests the else branch for player B when player A is stronger" },
    },
  ],

  // OJ 2998 - Euclidean Distance 2D
  2998: [
    {
      id: "2998-off-1",
      stdin: "1\n1\n2\n2",
      expected: "1.4142135623730951",
      label: { th: "ตัวอย่างทางการที่ 1", en: "Official Example 1" },
      official: true,
    },
    {
      id: "2998-off-2",
      stdin: "2.05\n-3\n1.69\n0",
      expected: "3.0215227948834014",
      label: { th: "ตัวอย่างทางการที่ 2", en: "Official Example 2" },
      official: true,
    },
    {
      id: "2998-extra-1",
      stdin: "1\n1\n2\n2",
      expected: "1.4142135623730951",
      label: { th: "เคสทดสอบเพิ่มเติม 1", en: "Extra Case 1" },
      official: false,
      tests: { th: "ตัวอย่างทางการ (√2)", en: "Official example (√2)" },
    },
    {
      id: "2998-extra-2",
      stdin: "2.05\n-3\n1.69\n0",
      expected: "3.0215227948834014",
      label: { th: "เคสทดสอบเพิ่มเติม 2", en: "Extra Case 2" },
      official: false,
      tests: { th: "ตัวอย่างทางการที่มีค่าติดลบ", en: "Official example with negative values" },
    },
    {
      id: "2998-extra-3",
      stdin: "0\n0\n3\n4",
      expected: "5.0",
      label: { th: "เคสทดสอบเพิ่มเติม 3", en: "Extra Case 3" },
      official: false,
      tests: { th: "สามเหลี่ยม 3-4-5 คลาสสิก ตรวจด้วยมือได้", en: "The classic 3-4-5 triangle, checkable by hand" },
    },
    {
      id: "2998-extra-4",
      stdin: "7.5\n-3.2\n7.5\n-3.2",
      expected: "0.0",
      label: { th: "เคสทดสอบเพิ่มเติม 4", en: "Extra Case 4" },
      official: false,
      tests: { th: "จุดซ้ำกัน ระยะทางต้องเป็น 0", en: "Identical points, distance must be 0" },
    },
  ],

  // OJ 3019 - Safe Password
  3019: [
    {
      id: "3019-off-1",
      stdin: "h\n4567",
      expected: "safe locked - change char",
      label: { th: "ตัวอย่างทางการที่ 1", en: "Official Example 1" },
      official: true,
    },
    {
      id: "3019-off-2",
      stdin: "H\n56579",
      expected: "safe locked - change digit",
      label: { th: "ตัวอย่างทางการที่ 2", en: "Official Example 2" },
      official: true,
    },
    {
      id: "3019-off-3",
      stdin: "h\n5678",
      expected: "safe locked",
      label: { th: "ตัวอย่างทางการที่ 3", en: "Official Example 3" },
      official: true,
    },
    {
      id: "3019-extra-1",
      stdin: "H\n4567",
      expected: "safe unlocked",
      label: { th: "เคสทดสอบเพิ่มเติม 1", en: "Extra Case 1" },
      official: false,
      tests: { th: "ถูกทั้งคู่", en: "Both correct" },
    },
    {
      id: "3019-extra-2",
      stdin: "h\n4567",
      expected: "safe locked - change char",
      label: { th: "เคสทดสอบเพิ่มเติม 2", en: "Extra Case 2" },
      official: false,
      tests: { th: "กับดักเรื่อง case-sensitivity", en: "The case-sensitivity trap" },
    },
    {
      id: "3019-extra-3",
      stdin: "H\n56579",
      expected: "safe locked - change digit",
      label: { th: "เคสทดสอบเพิ่มเติม 3", en: "Extra Case 3" },
      official: false,
      tests: { th: "ตัวอักษรถูก ตัวเลขผิด", en: "Letter right, number wrong" },
    },
    {
      id: "3019-extra-4",
      stdin: "h\n5678",
      expected: "safe locked",
      label: { th: "เคสทดสอบเพิ่มเติม 4", en: "Extra Case 4" },
      official: false,
      tests: { th: "ผิดทั้งคู่", en: "Both wrong" },
    },
    {
      id: "3019-extra-5",
      stdin: "A\n4567",
      expected: "safe locked - change char",
      label: { th: "เคสทดสอบเพิ่มเติม 5", en: "Extra Case 5" },
      official: false,
      tests: { th: "ตัวอักษรอื่นที่ไม่ใช่ h/H", en: "A letter other than h/H" },
    },
  ],

  // OJ 3020 - Coke
  3020: [
    {
      id: "3020-off-1",
      stdin: "10\n3\n7\n50",
      expected: "452",
      label: { th: "ตัวอย่างทางการที่ 1", en: "Official Example 1" },
      official: true,
    },
    {
      id: "3020-off-2",
      stdin: "1\n10\n0\n50",
      expected: "46",
      label: { th: "ตัวอย่างทางการที่ 2", en: "Official Example 2" },
      official: true,
    },
    {
      id: "3020-extra-1",
      stdin: "10\n3\n7\n50",
      expected: "452",
      label: { th: "เคสทดสอบเพิ่มเติม 1", en: "Extra Case 1" },
      official: false,
      tests: { th: "ตัวอย่างทางการ", en: "Official example" },
    },
    {
      id: "3020-extra-2",
      stdin: "1\n10\n0\n50",
      expected: "46",
      label: { th: "เคสทดสอบเพิ่มเติม 2", en: "Extra Case 2" },
      official: false,
      tests: { th: "ตัวอย่างทางการ ราคาโปรโมชันเป็น 0", en: "Official example, promo price is 0" },
    },
    {
      id: "3020-extra-3",
      stdin: "10\n3\n7\n0",
      expected: "0",
      label: { th: "เคสทดสอบเพิ่มเติม 3", en: "Extra Case 3" },
      official: false,
      tests: { th: "d = 0 ต้องไม่เก็บเงินเลย", en: "d = 0, must charge nothing" },
    },
    {
      id: "3020-extra-4",
      stdin: "20\n0\n0\n5",
      expected: "100",
      label: { th: "เคสทดสอบเพิ่มเติม 4", en: "Extra Case 4" },
      official: false,
      tests: { th: "b = 0 ป้องกัน ZeroDivisionError", en: "b = 0, guards ZeroDivisionError" },
    },
    {
      id: "3020-extra-5",
      stdin: "10\n3\n7\n1",
      expected: "10",
      label: { th: "เคสทดสอบเพิ่มเติม 5", en: "Extra Case 5" },
      official: false,
      tests: { th: "ขวดเดียว ยังแลกฝาไม่ได้", en: "A single bottle, no cap can be redeemed" },
    },
  ],

  // OJ 3022 - Temperature
  3022: [
    {
      id: "3022-off-1",
      stdin: "37.6\nC\nK",
      expected: "310.75",
      label: { th: "ตัวอย่างทางการที่ 1", en: "Official Example 1" },
      official: true,
    },
    {
      id: "3022-off-2",
      stdin: "100\nR\nC",
      expected: "-217.59",
      label: { th: "ตัวอย่างทางการที่ 2", en: "Official Example 2" },
      official: true,
    },
    {
      id: "3022-off-3",
      stdin: "212.0\nF\nK",
      expected: "373.15",
      label: { th: "ตัวอย่างทางการที่ 3", en: "Official Example 3" },
      official: true,
    },
    {
      id: "3022-extra-1",
      stdin: "37.6\nC\nK",
      expected: "310.75",
      label: { th: "เคสทดสอบเพิ่มเติม 1", en: "Extra Case 1" },
      official: false,
      tests: { th: "ตัวอย่างทางการ", en: "Official example" },
    },
    {
      id: "3022-extra-2",
      stdin: "100\nR\nC",
      expected: "-217.59",
      label: { th: "เคสทดสอบเพิ่มเติม 2", en: "Extra Case 2" },
      official: false,
      tests: { th: "ตัวอย่างทางการ ผลลัพธ์ติดลบ", en: "Official example, negative result" },
    },
    {
      id: "3022-extra-3",
      stdin: "212.0\nF\nK",
      expected: "373.15",
      label: { th: "เคสทดสอบเพิ่มเติม 3", en: "Extra Case 3" },
      official: false,
      tests: { th: "ตัวอย่างทางการ แปลงสองขั้นตอนจริง", en: "Official example, a real two-step conversion" },
    },
    {
      id: "3022-extra-4",
      stdin: "0\nC\nF",
      expected: "32.00",
      label: { th: "เคสทดสอบเพิ่มเติม 4", en: "Extra Case 4" },
      official: false,
      tests: { th: "ค่าอ้างอิงที่รู้จักกันดี", en: "A well-known reference value" },
    },
    {
      id: "3022-extra-5",
      stdin: "300.15\nK\nK",
      expected: "300.15",
      label: { th: "เคสทดสอบเพิ่มเติม 5", en: "Extra Case 5" },
      official: false,
      tests: { th: "หน่วยต้นทางและปลายทางเดียวกัน ค่าต้องไม่เพี้ยน", en: "Same unit in and out — the value must not drift" },
    },
  ],

  // OJ 3159 - Factorial
  3159: [
    {
      id: "3159-off-1",
      stdin: "5",
      expected: "120",
      label: { th: "ตัวอย่างทางการที่ 1", en: "Official Example 1" },
      official: true,
    },
    {
      id: "3159-off-2",
      stdin: "12",
      expected: "479001600",
      label: { th: "ตัวอย่างทางการที่ 2", en: "Official Example 2" },
      official: true,
    },
    {
      id: "3159-extra-1",
      stdin: "5",
      expected: "120",
      label: { th: "เคสทดสอบเพิ่มเติม 1", en: "Extra Case 1" },
      official: false,
      tests: { th: "ตัวอย่างทางการ กรณีมาตรฐาน", en: "Official example, standard case" },
    },
    {
      id: "3159-extra-2",
      stdin: "12",
      expected: "479001600",
      label: { th: "เคสทดสอบเพิ่มเติม 2", en: "Extra Case 2" },
      official: false,
      tests: { th: "ตัวอย่างทางการ ค่าขนาดใหญ่", en: "Official example, large value" },
    },
    {
      id: "3159-extra-3",
      stdin: "0",
      expected: "1",
      label: { th: "เคสทดสอบเพิ่มเติม 3", en: "Extra Case 3" },
      official: false,
      tests: { th: "ขอบเขต นิยาม 0! = 1", en: "Boundary case, the definition 0! = 1" },
    },
    {
      id: "3159-extra-4",
      stdin: "1",
      expected: "1",
      label: { th: "เคสทดสอบเพิ่มเติม 4", en: "Extra Case 4" },
      official: false,
      tests: { th: "กรณีฐาน ลูปแทบไม่ทำงาน", en: "Base case, the loop barely runs" },
    },
    {
      id: "3159-extra-5",
      stdin: "20",
      expected: "2432902008176640000",
      label: { th: "เคสทดสอบเพิ่มเติม 5", en: "Extra Case 5" },
      official: false,
      tests: { th: "ค่ามหาศาล ยืนยันว่า Python รองรับ", en: "Very large value, verifies Python handles it" },
    },
  ],

  // OJ 3167 - FizzBuzz
  3167: [
    {
      id: "3167-off-1",
      stdin: "15",
      expected:
        "1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz",
      label: { th: "ตัวอย่างทางการที่ 1", en: "Official Example 1" },
      official: true,
    },
    {
      id: "3167-extra-1",
      stdin: "15",
      expected:
        "1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz",
      label: { th: "เคสทดสอบเพิ่มเติม 1", en: "Extra Case 1" },
      official: false,
      tests: {
        th: "จับกรณีลำดับเงื่อนไขผิด (บรรทัดที่ 15 ต้องเป็น FizzBuzz)",
        en: "Catches wrong condition order (line 15 must be FizzBuzz)",
      },
    },
    {
      id: "3167-extra-2",
      stdin: "5",
      expected: "1\n2\nFizz\n4\nBuzz",
      label: { th: "เคสทดสอบเพิ่มเติม 2", en: "Extra Case 2" },
      official: false,
      tests: { th: "ช่วงสั้น ตรวจ Fizz และ Buzz แยกกัน", en: "Short range, checks Fizz and Buzz separately" },
    },
    {
      id: "3167-extra-3",
      stdin: "1",
      expected: "1",
      label: { th: "เคสทดสอบเพิ่มเติม 3", en: "Extra Case 3" },
      official: false,
      tests: { th: "ขอบเขตเล็กที่สุด", en: "Smallest boundary case" },
    },
    {
      id: "3167-extra-4",
      stdin: "3",
      expected: "1\n2\nFizz",
      label: { th: "เคสทดสอบเพิ่มเติม 4", en: "Extra Case 4" },
      official: false,
      tests: { th: "Fizz ตัวแรก", en: "The first Fizz" },
    },
    {
      id: "3167-extra-5",
      stdin: "30",
      expected:
        "1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz\n16\n17\nFizz\n19\nBuzz\nFizz\n22\n23\nFizz\nBuzz\n26\nFizz\n28\n29\nFizzBuzz",
      label: { th: "เคสทดสอบเพิ่มเติม 5", en: "Extra Case 5" },
      official: false,
      tests: { th: "ตัวคูณร่วมหลายค่า (บรรทัด 15 และ 30 = FizzBuzz)", en: "Multiple common multiples (lines 15 and 30 = FizzBuzz)" },
    },
  ],

  // OJ 3226 - Inflation
  3226: [
    {
      id: "3226-off-1",
      stdin: "100\n1",
      expected: "103.81",
      label: { th: "ตัวอย่างทางการที่ 1", en: "Official Example 1" },
      official: true,
    },
    {
      id: "3226-off-2",
      stdin: "100\n2",
      expected: "107.76",
      label: { th: "ตัวอย่างทางการที่ 2", en: "Official Example 2" },
      official: true,
    },
    {
      id: "3226-extra-1",
      stdin: "100\n0",
      expected: "100.00",
      label: { th: "เคสทดสอบเพิ่มเติม 1", en: "Extra Case 1" },
      official: false,
      tests: { th: "k = 0 ลูปไม่ทำงาน ค่าไม่เปลี่ยน", en: "k = 0, loop never runs, value unchanged" },
    },
    {
      id: "3226-extra-2",
      stdin: "100\n1",
      expected: "103.81",
      label: { th: "เคสทดสอบเพิ่มเติม 2", en: "Extra Case 2" },
      official: false,
      tests: { th: "ตัวอย่างทางการ ทบต้นหนึ่งปี", en: "Official example, one year of compounding" },
    },
    {
      id: "3226-extra-3",
      stdin: "100\n2",
      expected: "107.76",
      label: { th: "เคสทดสอบเพิ่มเติม 3", en: "Extra Case 3" },
      official: false,
      tests: {
        th: "กับดักการปัดเศษ (ได้ 107.77 แปลว่าไม่ได้ตัดเศษรายปี)",
        en: "The rounding trap (getting 107.77 means you did not truncate yearly)",
      },
    },
    {
      id: "3226-extra-4",
      stdin: "100\n3",
      expected: "111.86",
      label: { th: "เคสทดสอบเพิ่มเติม 4", en: "Extra Case 4" },
      official: false,
      tests: { th: "หลายปี ยืนยันการทบต้นจากปีก่อนหน้า", en: "Multi-year, verifies compounding from the previous year" },
    },
    {
      id: "3226-extra-5",
      stdin: "0\n5",
      expected: "0.00",
      label: { th: "เคสทดสอบเพิ่มเติม 5", en: "Extra Case 5" },
      official: false,
      tests: { th: "0 บาท ต้องเป็น 0 เสมอไม่ว่าจะอัตราเท่าไร", en: "Zero baht stays zero no matter the rate" },
    },
    {
      id: "3226-extra-6",
      // The markdown documents this only as "a very long number (no crash)".
      // Verified via: printf '100\n100000' | python3 data/recommended/oj3226-Inflation/main.py
      // The exact value below is the real computed output (2094 digits), captured
      // so this case can be graded as an exact string match rather than a vague
      // "did it crash" check.
      stdin: "100\n100000",
      expected:
        "828982498752554802405159904363970447397701071879294058407730438262501927676167388866929307155273190735932571653246322231106032611490302148528262025691178682012986219306397562204164431152395488141456073787731146712323098961150110976757310973514359130856130059044153730032999648328848229476781758370801432946470032464259912937291395798910758880403470566219984259672778625916026135824960803388422755117720059152698860418629222252025228471357950896570108364979163932851922010090649812744722290282494060691920135005207305531829704854102980694800451111123962797552583806307344746769566719272070022078950746791149055036409771915381860164523323936086731601081568277981755023211177089750902555490212293717300339656247002956950650119693428121427578372285464270777857954681031391575135747095429088382910639463228342887181231207945766795428881000358314683238506937219924387433636064987120274126331530095345352197127649568508160031805896295474186369728756945512913497087479250666202252466795363959615606378758394535124308697935262269591529077099982028032939621514682488100251098779586041468495182054384439062980887350507066179438185550197911163117792456229591949598191307623822789517165303604670528114775591514107891189502810592396367523697291986652552876663747776716579785698145293235860175593512991414870233466516195423801399115212850588197688551541722010948181215894488776568184739536502981233949943138566534820346742568781578261227265008335636800196565460210774537859614880209575244709662251149511756555728151807573581708310428350409851769799568929599230646315457581721631832709953133277452388701947392064121595012068755659705620767123.54",
      label: { th: "เคสทดสอบเพิ่มเติม 6", en: "Extra Case 6" },
      official: false,
      tests: { th: "ตัวเลขยาวมาก (ต้องไม่ crash)", en: "A very long number (no crash)" },
    },
  ],

  // OJ 3237 - Triangle
  3237: [
    {
      id: "3237-off-1",
      stdin: "7",
      expected: "0\n00\n010\n0110\n01110\n011110\n0000000",
      label: { th: "ตัวอย่างทางการที่ 1", en: "Official Example 1" },
      official: true,
    },
    {
      id: "3237-off-2",
      stdin: "3",
      expected: "0\n00\n000",
      label: { th: "ตัวอย่างทางการที่ 2", en: "Official Example 2" },
      official: true,
    },
    {
      id: "3237-extra-1",
      stdin: "7",
      expected: "0\n00\n010\n0110\n01110\n011110\n0000000",
      label: { th: "เคสทดสอบเพิ่มเติม 1", en: "Extra Case 1" },
      official: false,
      tests: { th: "รูปทรงเต็ม เห็นโพรงตรงกลางชัดเจน", en: "The full shape with a visible hollow interior" },
    },
    {
      id: "3237-extra-2",
      stdin: "3",
      expected: "0\n00\n000",
      label: { th: "เคสทดสอบเพิ่มเติม 2", en: "Extra Case 2" },
      official: false,
      tests: { th: "ตัวอย่างทางการ ยังไม่มีส่วนกลวง", en: "Official example, no hollow part yet" },
    },
    {
      id: "3237-extra-3",
      stdin: "1",
      expected: "0",
      label: { th: "เคสทดสอบเพิ่มเติม 3", en: "Extra Case 3" },
      official: false,
      tests: { th: "ขอบเขตเล็กที่สุด (ได้ 00 แปลว่าแถวแรกไม่ได้ถูกป้องกัน)", en: "Smallest boundary case (getting 00 means row 1 was not guarded)" },
    },
    {
      id: "3237-extra-4",
      stdin: "2",
      expected: "0\n00",
      label: { th: "เคสทดสอบเพิ่มเติม 4", en: "Extra Case 4" },
      official: false,
      tests: { th: "แถวสุดท้ายมาถึงทันที", en: "The last row arrives immediately" },
    },
    {
      id: "3237-extra-5",
      stdin: "5",
      expected: "0\n00\n010\n0110\n00000",
      label: { th: "เคสทดสอบเพิ่มเติม 5", en: "Extra Case 5" },
      official: false,
      tests: { th: "ยืนยันฐานทึบ ไม่ใช่ 01110", en: "Confirms the base is solid, not 01110" },
    },
  ],
};
