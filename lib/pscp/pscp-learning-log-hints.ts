import type { LText } from "@/lib/i18n";

/**
 * Per-problem nudges for the six post-midterm PSCP Learning Log problems
 * (Weeks 8 & 9). Shown in the submission wizard as an optional panel at the
 * "My Understanding" and "My First Plan" steps.
 *
 * These are prompts, NOT solutions. `understanding` points at what is worth
 * restating precisely (the input shape, the output format, the trap); `firstPlan`
 * points at the shape of a plan without giving the algorithm away. Students must
 * still write their own words — the wizard says so.
 */
export interface LearningLogHint {
  /** What to be precise about when writing "My Understanding". */
  understanding: LText;
  /** A planning question for "My First Plan" — never a worked solution. */
  firstPlan: LText;
}

export const PSCP_LL_HINTS: Record<number, LearningLogHint> = {
  // 3293 — BigFrame
  3293: {
    understanding: {
      th: "ระบุให้ชัดว่า อินพุตมีกี่บรรทัด (5 เสมอ) เอาต์พุตมีกี่บรรทัด และช่องว่างระหว่างข้อความกับกรอบมีด้านละกี่ช่อง ที่พลาดกันบ่อยคือช่องว่างท้ายบรรทัดในอินพุตไม่นับเป็นข้อความ",
      en: "State exactly how many input lines there are (always 5), how many output lines, and how many spaces sit between the text and the frame on each side. The common miss: trailing spaces in an input line are not part of the text.",
    },
    firstPlan: {
      th: "ลองเขียนว่า คุณต้องรู้อะไรก่อนจึงจะพิมพ์ขอบกรอบบรรทัดแรกได้ และความกว้างของกรอบมาจากบรรทัดไหน",
      en: "Write down: what do you need to know before you can print the top border, and which line determines the frame width?",
    },
  },
  // 3296 — RGB Mixed
  3296: {
    understanding: {
      th: "อธิบายว่ารับค่าอะไรมาบ้าง (RGB ของสองสี บรรทัดละสี) การผสมสีหนึ่งช่องคำนวณอย่างไร และผลลัพธ์พิมพ์เป็นรูปแบบใด (สามจำนวนคั่นด้วยช่องว่าง)",
      en: "Describe what is read (the RGB of two colours, one per line), how a single channel is mixed, and the output format (three numbers separated by spaces).",
    },
    firstPlan: {
      th: "โจทย์บอกให้ทำเป็นฟังก์ชัน ลองวางแผนว่าจะแยกส่วน 'ผสมหนึ่งช่อง' ออกเป็นฟังก์ชันของตัวเองอย่างไร แล้ว main เรียกใช้กี่ครั้ง",
      en: "The problem asks for a function. Plan how you would factor 'mix one channel' into its own function, and how many times main would call it.",
    },
  },
  // 3299 — แปลงดอกไม้ (Flower Garden)
  3299: {
    understanding: {
      th: "ระบุว่าอินพุตคือ L (ความหนาของแถบ) กับ N (จำนวนช่องที่ปลูก) และเอาต์พุตคือหมายเลขแถบของช่องสุดท้าย ลองวาดตารางเล็ก ๆ ตามตัวอย่าง L=1, N=17 ด้วยมือเพื่อดูว่าแต่ละแถบกินกี่ช่อง",
      en: "State that the input is L (band thickness) and N (cells planted), and the output is the band number of the last cell. Draw the small L=1, N=17 example by hand to see how many cells each band covers.",
    },
    firstPlan: {
      th: "ลองหาสูตรว่าแถบที่ k มีกี่ช่อง (ผลรวมของแนวทแยงที่มันครอบ) แล้ววางแผนว่าจะไล่บวกไปเรื่อย ๆ จนถึง N อย่างไร",
      en: "Try to find how many cells band k holds (the sum of the diagonals it spans), then plan how to accumulate band by band until you reach N.",
    },
  },
  // 3355 — Shorten
  3355: {
    understanding: {
      th: "ระบุว่าจำนวนบรรทัดไม่แน่นอน อ่านไปเรื่อย ๆ จนเจอ -1 ตัวเลขเรียงเพิ่มขึ้นเสมอ และรูปแบบเอาต์พุต: ช่วงต่อเนื่องเขียน a-b ตัวเดี่ยวเขียน a คั่นด้วย ', '",
      en: "State that the line count is unknown — read until -1 — the numbers always increase, and the output format: a consecutive run is a-b, a lone number is a, joined by ', '.",
    },
    firstPlan: {
      th: "ลองเขียนว่าจะใช้ตัวแปรกี่ตัวในการจำ 'ช่วงที่กำลังสร้างอยู่' และจะรู้ได้อย่างไรว่าช่วงหนึ่งจบแล้ว",
      en: "Write down how many variables you need to remember 'the range being built', and how you will know a range has ended.",
    },
  },
  // 3357 — Giraffe
  3357: {
    understanding: {
      th: "ระบุว่าบรรทัดแรกคือ N ตามด้วยความสูง N บรรทัด และต้องนับยีราฟที่สูงกว่าเพื่อนทั้งซ้ายและขวา อย่าลืมกรณีตัวหัวแถวและท้ายแถวที่มีเพื่อนข้างเดียว",
      en: "State that line 1 is N, then N heights, and you count giraffes taller than both neighbours. Do not forget the first and last giraffe, which have only one neighbour.",
    },
    firstPlan: {
      th: "ลองวางแผนว่าจะเช็กเงื่อนไข 'สูงกว่าซ้าย' และ 'สูงกว่าขวา' อย่างไรเมื่ออยู่ที่ขอบแถว (ไม่มีเพื่อนด้านนั้น)",
      en: "Plan how you will evaluate 'taller than the left' and 'taller than the right' when you are at an edge (no neighbour on that side).",
    },
  },
  // 3360 — หั่นขนมปัง (Bread Slicing)
  3360: {
    understanding: {
      th: "ระบุว่ารับ W H M N แล้วพิกัดรอยตัดแนวตั้ง M ค่า และแนวนอน N ค่า ต้องหาพื้นที่ของชิ้นที่ใหญ่ที่สุดสองชิ้น ลองนึกว่าความกว้างของชิ้นมาจากระยะห่างระหว่างรอยตัด (รวมขอบ 0 และ W)",
      en: "State that you read W H M N, then M vertical cut coordinates and N horizontal ones, and must find the two largest piece areas. Note that a piece's width comes from the gap between adjacent cuts (including the edges 0 and W).",
    },
    firstPlan: {
      th: "ลองวางแผนว่า เมื่อได้รายการความกว้างของชิ้นและความสูงของชิ้นแล้ว ชิ้นที่ใหญ่ที่สุดสองชิ้นจะมาจากคู่ (กว้าง, สูง) แบบไหนบ้าง",
      en: "Plan this: once you have the list of piece widths and the list of piece heights, which (width, height) pairings can the two largest pieces come from?",
    },
  },
};
