import "server-only";

import { res } from "../links";
import type { DailyPlan, StudyPlan, StudyTask, SubjectCode } from "../types";

/**
 * Final exams 1/2569, IT year 1 — the site owner's 22-day plan, 21 Oct – 11 Nov 2026:
 * 112 hours split as ITF 24.5 · ICS 31 · PSCP 21.5 · MFIT 35.
 *
 * Personal: it reaches a browser only through /profile/<id>/study, after that
 * page has checked the session (plans/index.ts). `server-only` turns any
 * client import of this file into a build error.
 *
 * Quotas, not time slots — a day says how many hours each course gets, and
 * the student spends them whenever they like. A task's links come from the
 * units it names (units.ts) plus its `extras`; key points come from the week
 * pages' "อ่านจบแล้วต้องตอบได้" / "เป้าหมายของคาบนี้" sections so they cannot
 * drift from what the pages actually teach.
 *
 * What is *not* here on purpose: the ITF and ICS question banks and the ICS
 * practice paper are midterm-scoped (course-bindings.ts), so no final-exam
 * day points at them.
 */

type TaskInput = Omit<StudyTask, "id">;

function day(date: string, tasks: TaskInput[], exam?: SubjectCode): DailyPlan {
  return {
    date,
    exam,
    tasks: tasks.map((t) => ({ ...t, id: `${date}-${t.subject.toLowerCase()}` })),
  };
}

const u = (code: SubjectCode, ...weeks: number[]) => weeks.map((w) => `${code}-week-${w}`);

const DAYS: DailyPlan[] = [
  day("2026-10-21", [
    {
      subject: "MFIT",
      hours: 3,
      title: { th: "ฟังก์ชัน ลิมิต และความต่อเนื่อง", en: "Functions, limits & continuity" },
      units: u("MFIT", 8),
      keyPoints: [
        "ลิมิตด้านเดียว (ซ้าย–ขวา) และเงื่อนไขที่ลิมิตจะมีค่า",
        "ผังตัดสินใจ 3 ชั้นสำหรับรูปแบบ 0/0 — แทนค่า → แยกตัวประกอบ/สังยุค → ทฤษฎีบทบีบ",
        "ความต่อเนื่อง 3 เงื่อนไข: f(c) มีค่า · lim f(x) มีค่า · ทั้งสองเท่ากัน",
      ],
      extras: [res.khanDiff("dc-limits", { th: "Khan: ลิมิตและความต่อเนื่อง (Unit 1)", en: "Khan: Limits & continuity (Unit 1)" })],
    },
    {
      subject: "ICS",
      hours: 2,
      title: { th: "ภาพรวมระบบคอมพิวเตอร์ · มัลติมิเตอร์", en: "Computer systems · Multimeter" },
      units: u("ICS", 1),
      keyPoints: [
        "อ่านค่าหน้าปัดมิเตอร์เข็มและเลือกย่านวัดให้ถูก",
        "วัดแรงดันและความต้านทานด้วยมิเตอร์เข็มและมิเตอร์ดิจิทัล",
        "ความละเอียดและความคลาดเคลื่อนของมิเตอร์สองแบบต่างกันอย่างไร",
      ],
    },
  ]),

  day("2026-10-22", [
    {
      subject: "MFIT",
      hours: 3,
      title: { th: "อนุพันธ์ ภาค 1", en: "Derivatives, part 1" },
      units: u("MFIT", 9),
      keyPoints: [
        "นิยามอนุพันธ์ด้วยลิมิต f'(x) = lim (f(x+h) − f(x)) / h — ออกสอบเกือบทุกปี",
        "differentiable ⇒ continuous แต่กลับกันไม่จริง",
        "กฎพื้นฐาน · product rule · quotient rule · อัตราการเปลี่ยนแปลงและการเคลื่อนที่",
      ],
      extras: [res.khanDiff("dc-derivatives", { th: "Khan: นิยามและกฎอนุพันธ์ (Unit 2)", en: "Khan: Derivatives: definition & rules (Unit 2)" })],
    },
    {
      subject: "ITF",
      hours: 2,
      title: { th: "Database", en: "Database" },
      units: u("ITF", 8),
      keyPoints: [
        "ลำดับชั้นข้อมูล character → field → record → file → database และ primary key",
        "file processing system เทียบ database approach · ชนิด field และ validation",
        "relational / object-oriented / multidimensional database · เครื่องมือ DBMS · SQL SELECT … FROM … WHERE",
      ],
    },
  ]),

  day("2026-10-23", [
    {
      subject: "ICS",
      hours: 3,
      title: { th: "Memory & I/O addressing · ออสซิลโลสโคป", en: "Memory & I/O addressing · Oscilloscope" },
      units: u("ICS", 2),
      keyPoints: [
        "การกำหนดตำแหน่งหน่วยความจำและอุปกรณ์ด้วย address bus และวงจรถอดรหัส",
        "ตั้ง volts/div และ time/div แล้วอ่านรูปคลื่นพร้อมสเกล",
        "พฤติกรรมของ R กับ C ในวงจรเดียวกัน (low-pass filter)",
      ],
    },
    {
      subject: "PSCP",
      hours: 2,
      title: { th: "Nested Loops & Pattern Printing", en: "Nested Loops & Pattern Printing" },
      units: u("PSCP", 8),
      keyPoints: [
        "ลูปซ้อนสองชั้นวาดรูป 2 มิติ — คิดเป็นพิกัด (row, col)",
        "เขียนเงื่อนไขว่าช่องไหนพิมพ์อักขระ ช่องไหนเว้นว่าง",
        "ทำโจทย์ Learning Log ⭐ ของสัปดาห์ (BigFrame, RGB Mixed, แปลงดอกไม้)",
      ],
    },
  ]),

  day("2026-10-24", [
    {
      subject: "MFIT",
      hours: 3,
      title: { th: "อนุพันธ์ ภาค 2", en: "Derivatives, part 2" },
      units: u("MFIT", 10),
      keyPoints: [
        "อนุพันธ์อันดับสูง",
        "chain rule หลายชั้น — กฎที่ใช้บ่อยที่สุดในวิชา",
        "implicit differentiation และ related rates",
      ],
      extras: [
        res.khanDiff("dc-chain-rule", { th: "Khan: Chain rule & อนุพันธ์ขั้นสูง (Unit 3)", en: "Khan: Chain rule & advanced topics (Unit 3)" }),
        res.khanDiff("dc-apps-of-derivatives", { th: "Khan: Related rates & การประยุกต์ (Unit 4)", en: "Khan: Applications of derivatives (Unit 4)" }),
      ],
    },
    {
      subject: "ICS",
      hours: 2.5,
      title: { th: "Latch, Buffer, Tristate · LED และ RC", en: "Latch, buffer, tristate · LED & RC" },
      units: u("ICS", 3),
      keyPoints: [
        "MUX, DEMUX, tristate gate, latch, buffer และ SR flip-flop จากสไลด์",
        "อ่านรหัสสีตัวต้านทาน · แถวไหนบนโพรโทบอร์ดเชื่อมกัน",
        "คำนวณกระแสด้วย V = IR และหน่วงเวลา RC ด้วย T = R × C",
      ],
    },
    {
      subject: "PSCP",
      hours: 2,
      title: { th: "Lists, Sequence Processing & Simulation", en: "Lists & Simulation" },
      units: u("PSCP", 9),
      keyPoints: [
        "วนซ้ำบน list · แปลงและกรองข้อมูล",
        "ย่อช่วงตัวเลข (range compression) และจำลองขั้นตอนตามโจทย์ (simulation)",
        "ทำโจทย์ Learning Log ⭐ ของสัปดาห์ (Shorten, Giraffe, หั่นขนมปัง)",
      ],
    },
  ]),

  day("2026-10-25", [
    {
      subject: "MFIT",
      hours: 3.5,
      title: { th: "การประยุกต์ของอนุพันธ์", en: "Applications of the derivative" },
      units: u("MFIT", 11),
      keyPoints: [
        "critical numbers และค่าสุดขีดบนช่วงปิด",
        "first / second derivative test · ความเว้าและจุดเปลี่ยนเว้า · checklist วาดกราฟ 7 ข้อ",
        "optimization — หัวใจของ HW11",
      ],
      extras: [res.khanDiff("dc-analyzing-functions", { th: "Khan: วิเคราะห์ฟังก์ชัน & Optimization (Unit 5)", en: "Khan: Analyzing functions & optimization (Unit 5)" })],
    },
    {
      subject: "ITF",
      hours: 2.5,
      title: { th: "Ethical, Social & Legal Aspects of IT", en: "Ethical, Social & Legal Aspects of IT" },
      units: u("ITF", 9),
      keyPoints: [
        "software / information / hardware theft และ vandalism",
        "encryption · digital signature · digital certificate · ภัยต่อความเป็นส่วนตัว (cookie, phishing, spyware, social engineering)",
        "หลักจริยธรรม 4 ข้อ และจับคู่กฎหมายไทยแต่ละฉบับกับปี พ.ศ.",
      ],
    },
  ]),

  day("2026-10-26", [
    {
      subject: "ICS",
      hours: 3,
      title: { th: "Flip-flop และวงจรนับ · ออสซิลเลเตอร์", en: "Flip-flops & counters · Oscillator" },
      units: u("ICS", 4),
      keyPoints: [
        "วงจรเชิงผสมกับเชิงลำดับ · edge trigger ขอบขึ้น/ขอบลง",
        "ตารางความจริง SR, JK, D, T และการแปลงชนิด flip-flop",
        "ripple counter กับ synchronous counter · ADC 5 ขั้น · ออสซิลเลเตอร์จาก 74LS04",
      ],
    },
    {
      subject: "PSCP",
      hours: 2,
      title: { th: "Nested Lists & Matrices (1)", en: "Nested Lists & Matrices (1)" },
      units: u("PSCP", 10),
      keyPoints: [
        "สร้างลิสต์ 2 มิติให้ถูก — ระวัง [[0] * n] * m ที่ทุกแถวเป็นอ็อบเจกต์เดียวกัน",
        "เข้าถึง matrix[row][col] และวนลูปซ้อน",
        "ผลรวมแถว/คอลัมน์ · เส้นทแยง",
      ],
    },
  ]),

  day("2026-10-27", [
    {
      subject: "MFIT",
      hours: 3,
      title: { th: "ปริพันธ์ ภาค 1", en: "Integration, part 1" },
      units: u("MFIT", 12),
      keyPoints: [
        "antiderivative และกฎปริพันธ์พื้นฐาน — จัดรูปก่อนแล้วค่อยปริพันธ์",
        "สมการเชิงอนุพันธ์เบื้องต้นกับเงื่อนไขเริ่มต้น",
        "Riemann sum · ปริพันธ์จำกัดเขต · ทฤษฎีบทหลักมูลของแคลคูลัส",
      ],
      extras: [res.khanIntegral("ic-integration-intro", { th: "Khan: ปริพันธ์ & FTC (Integral Calculus)", en: "Khan: Integration & FTC (Integral Calculus)" })],
    },
    {
      subject: "ITF",
      hours: 2,
      title: { th: "Working in the Enterprise", en: "Working in the Enterprise" },
      units: u("ITF", 10),
      keyPoints: [
        "องค์ประกอบ 5 อย่างของ information system",
        "แยก ERP · CMS · DMS · TPS · MIS · DSS · expert system · จับคู่ OLTP–TPS และ OLAP–DSS",
        "สายงานไอทีหลัก และ certification มีไว้ทำไม",
      ],
    },
  ]),

  day("2026-10-28", [
    {
      subject: "ICS",
      hours: 3,
      title: { th: "DAC และ ADC · MUX จาก NAND", en: "DAC & ADC · MUX from NAND" },
      units: u("ICS", 5),
      keyPoints: [
        "DAC แบบ R-2R ladder และ op-amp · คำนวณแรงดันเอาต์พุต",
        "ADC แบบ flash และ SAR",
        "ทำไม NAND แทนได้ทั้งวงจร และ NOR แทนได้หรือไม่",
      ],
    },
    {
      subject: "PSCP",
      hours: 2,
      title: { th: "Nested Lists & Matrices (2)", en: "Nested Lists & Matrices (2)" },
      units: u("PSCP", 11),
      keyPoints: [
        "เดินบนตาราง 2 มิติด้วย (dr, dc) และตรวจขอบตาราง",
        "ตรวจแถว/คอลัมน์/ทแยงแบบเกมตาราง",
        "transpose และหมุนเมทริกซ์",
      ],
    },
  ]),

  day("2026-10-29", [
    {
      subject: "MFIT",
      hours: 3,
      title: { th: "ปริพันธ์ ภาค 2 — u-substitution", en: "Integration, part 2 — u-substitution" },
      units: u("MFIT", 13),
      keyPoints: [
        "u-substitution 6 ขั้นตอน — chain rule กลับหลัง · เปลี่ยนขอบเขตเมื่อเป็นปริพันธ์จำกัดเขต",
        "ปริพันธ์ของค่าสัมบูรณ์ · ฟังก์ชันคู่/คี่บนช่วงสมมาตร",
        "การกระจัดเทียบระยะทางรวม",
      ],
      extras: [res.khanIntegral("ic-integration-techniques", { th: "Khan: เทคนิค u-sub & By parts (Integral Calculus)", en: "Khan: Integration techniques (Integral Calculus)" })],
    },
    {
      subject: "ITF",
      hours: 2.5,
      title: { th: "Internet & Computer Networks 1", en: "Internet & Computer Networks 1" },
      units: u("ITF", 11),
      keyPoints: [
        "Internet แบบ nuts and bolts และแบบ service view · นิยาม protocol",
        "encapsulation จาก message ถึง frame · access network แต่ละแบบ · guided/unguided media",
        "routing กับ forwarding · tier-1 ISP, IXP, content provider · การโจมตี 3 แบบ",
      ],
    },
  ]),

  day("2026-10-30", [
    {
      subject: "ITF",
      hours: 3.5,
      title: { th: "Computer Networks 2", en: "Computer Networks 2" },
      units: u("ITF", 12),
      keyPoints: [
        "physical topology 5 แบบ · CSMA, CSMA/CD, token passing · มาตรฐาน Ethernet",
        "repeater/hub · bridge/switch · router ทำหน้าที่ต่างกันอย่างไร",
        "หา network ID ด้วยการ AND · class A/B/C · private IP · static route และ next hop (แล็บ)",
      ],
    },
    {
      subject: "ICS",
      hours: 2,
      title: { th: "Memory unit · FPGA Basys2", en: "Memory unit · FPGA Basys2" },
      units: u("ICS", 6),
      keyPoints: [
        "โครงสร้าง SRAM, DRAM และตระกูล ROM/PROM/EPROM/EEPROM",
        "schematic capture → สังเคราะห์ลง FPGA · pin assignment",
        "การโปรแกรม FPGA ต่างจากไมโครคอนโทรลเลอร์อย่างไร",
      ],
    },
  ]),

  day("2026-10-31", [
    {
      subject: "ITF",
      hours: 4,
      title: { th: "Wireless Networks + Web Technology", en: "Wireless Networks + Web Technology" },
      units: u("ITF", 13, 14),
      keyPoints: [
        "infrastructure กับ ad hoc · path loss, interference, multipath, hidden terminal · CDMA",
        "IEEE 802.11 แต่ละรุ่น · association · CSMA/CA กับ RTS/CTS",
        "หน้าที่ HTML / CSS / JavaScript · CSS 3 แบบและ selector · web client-server และ DOM/CSSOM",
      ],
    },
    {
      subject: "MFIT",
      hours: 2,
      title: { th: "ปริพันธ์ทีละส่วน · พื้นที่ · ปริมาตร", en: "Integration by parts · area · volume" },
      units: u("MFIT", 14),
      keyPoints: [
        "integration by parts — เลือก u ด้วย LIATE · tabular method · เคสวนซ้ำ",
        "พื้นที่ระหว่างเส้นโค้ง",
        "ปริมาตรทรงตันจากการหมุน",
      ],
      extras: [res.khanIntegral("ic-applications-of-integration", { th: "Khan: พื้นที่ & ปริมาตรรูปทรงหมุน (Integral Calculus)", en: "Khan: Applications of integration (Integral Calculus)" })],
    },
  ]),

  day("2026-11-01", [
    {
      subject: "ITF",
      hours: 4,
      title: { th: "IT Skills and System + ทดสอบตัวเองทุกสัปดาห์", en: "IT Skills and System + every self-check" },
      units: u("ITF", 15),
      keyPoints: [
        "เฟสของ SDLC · feasibility 4 ด้าน · functional กับ non-functional requirement",
        "เทคนิคเก็บความต้องการ (รวม JAD) · Gantt chart กับ PERT chart",
        "ทำ \"ทดสอบตัวเอง\" ท้ายหน้าสัปดาห์ 8–15 ให้ครบ — คลังควิซ ITF ครอบคลุมแค่กลางภาค",
      ],
    },
    {
      subject: "ICS",
      hours: 2,
      title: { th: "ALU และการสร้างซีพียู", en: "ALU & building a CPU" },
      units: u("ICS", 7),
      keyPoints: [
        "องค์ประกอบของ ALU — วงจรบวก ลบ และตัวเปรียบเทียบ",
        "รีจิสเตอร์ ชุดคำสั่ง และวงจรของแต่ละคำสั่ง",
        "ไล่อ่าน datapath ของซีพียู 4 บิต",
      ],
    },
  ]),

  day("2026-11-02", [
    {
      subject: "ITF",
      hours: 4,
      title: { th: "ทบทวน ITF รอบสุดท้าย", en: "ITF final review" },
      units: u("ITF", 8, 9, 10, 11, 12, 13, 14, 15),
      keyPoints: [
        "ไล่หัวข้อ \"จุดที่มักพลาด\" ของทุกสัปดาห์ 8–15",
        "เครือข่าย: encapsulation · อุปกรณ์แต่ละชั้น · หา network ID · 802.11",
        "กฎหมายไทยกับปี พ.ศ. · ระบบองค์กร · SDLC",
      ],
      extras: [res.overview("ITF")],
    },
  ]),

  day(
    "2026-11-03",
    [
      {
        subject: "ICS",
        hours: 2.5,
        title: { th: "เปิดภาพรวม ICS ครึ่งหลัง", en: "ICS second half — overview" },
        units: [],
        keyPoints: [
          "หลังสอบ ITF พักก่อน แล้วค่อยเปิด ICS",
          "อ่านขอบเขตปลายภาคและตารางแยกสไลด์สองชุดในหน้าภาพรวมวิชา",
          "แนวข้อสอบครึ่งหลัง: ทฤษฎีวงจร/สัญญาณ + คำนวณ + โครงสร้างซีพียู",
        ],
        extras: [res.overview("ICS")],
      },
    ],
    "ITF",
  ),

  day("2026-11-04", [
    {
      subject: "ICS",
      hours: 6.5,
      title: { th: "ไล่ ICS คาบ 1–7 เต็มวัน", en: "ICS sessions 1–7, full day" },
      units: u("ICS", 1, 2, 3, 4, 5, 6, 7),
      keyPoints: [
        "รอบเช้า (3.5 ชม.): คาบ 1–4 — เครื่องวัด, addressing, latch/buffer, flip-flop และวงจรนับ",
        "รอบบ่าย (3 ชม.): คาบ 5–7 — DAC/ADC, หน่วยความจำ, ALU และซีพียู",
        "ทำ \"ข้อควรระวังของคาบนี้\" ทุกคาบ และฝึกโจทย์คำนวณ",
      ],
    },
  ]),

  day("2026-11-05", [
    {
      subject: "ICS",
      hours: 4.5,
      title: { th: "สรุป ICS ก่อนสอบเช้า", en: "ICS summary before the morning paper" },
      units: u("ICS", 2, 4, 5, 6, 7),
      keyPoints: [
        "ตารางความจริง flip-flop ทุกชนิด · ripple กับ synchronous counter",
        "สูตร DAC R-2R · ลำดับการทำงานของ SAR ADC · โครงสร้าง SRAM/DRAM",
        "datapath ซีพียู · นอนเร็ว — สอบ 09:30",
      ],
      extras: [res.overview("ICS")],
    },
  ]),

  day(
    "2026-11-06",
    [
      {
        subject: "PSCP",
        hours: 4,
        title: { th: "Dictionary, Sets และ File I/O", en: "Dictionary, Sets & File I/O" },
        units: u("PSCP", 12, 13),
        keyPoints: [
          "dict — นับความถี่ · lookup · วนบน items()",
          "set — union, intersection, difference · ตัดตัวซ้ำ",
          "อ่าน/เขียนไฟล์ด้วย with open() · try-except",
        ],
      },
    ],
    "ICS",
  ),

  day("2026-11-07", [
    {
      subject: "PSCP",
      hours: 5,
      title: { th: "Sorting & Searching", en: "Sorting & Searching" },
      units: u("PSCP", 14),
      keyPoints: [
        "bubble, selection, insertion, merge sort — ไล่ทีละรอบได้",
        "binary search — low, high, mid และ O(log n)",
        "sort ด้วย key=lambda หลายเงื่อนไข",
      ],
    },
    {
      subject: "MFIT",
      hours: 2,
      title: { th: "โมเมนต์ · อนุพันธ์ย่อย", en: "Moments · partial derivatives" },
      units: u("MFIT", 15),
      keyPoints: [
        "ระบบมวลไม่ต่อเนื่อง และ centroid ของแผ่นระนาบด้วยปริพันธ์",
        "ฟังก์ชันหลายตัวแปร z = f(x, y)",
        "อนุพันธ์ย่อยและอันดับสูง · หาค่าที่จุดที่กำหนด",
      ],
      extras: [res.khanMulti("multivariable-derivatives/partial-derivatives", { th: "Khan: อนุพันธ์ย่อย (Multivariable Calculus)", en: "Khan: Partial derivatives (Multivariable Calculus)" })],
    },
  ]),

  day("2026-11-08", [
    {
      subject: "PSCP",
      hours: 4.5,
      title: { th: "ซ้อมจับเวลาเขียนโค้ด", en: "Timed coding drill" },
      units: u("PSCP", 8, 9, 10, 11, 12, 13, 14),
      keyPoints: [
        "จับเวลาทำโจทย์ผสม: ลูปซ้อน · เมทริกซ์ · dict · ไฟล์ · sorting",
        "เลือกโจทย์ที่ยังไม่ผ่านจากคลังแต่ละสัปดาห์",
        "ทวนข้อผิดพลาดที่เจอบ่อยของตัวเอง",
      ],
      extras: [res.pscpHub(), res.overview("PSCP")],
    },
  ]),

  day(
    "2026-11-09",
    [
      {
        subject: "MFIT",
        hours: 3,
        title: { th: "ทบทวนลิมิตและอนุพันธ์", en: "Review: limits & derivatives" },
        units: u("MFIT", 8, 9, 10, 11),
        keyPoints: [
          "หลังสอบ PSCP พักก่อน แล้วเปิดวิชาสุดท้าย",
          "ทวนตารางสูตรและ pitfall ของสัปดาห์ 8–11",
          "ทำแบบฝึกรายสัปดาห์และ Quiz/Course Challenge ใน Khan Academy",
        ],
        extras: [
          res.mfitSyllabus(),
          res.khanDiff("", { th: "Khan: Differential Calculus (แบบฝึกรวม)", en: "Khan: Differential Calculus (Course Review)" }),
        ],
      },
    ],
    "PSCP",
  ),

  day("2026-11-10", [
    {
      subject: "MFIT",
      hours: 7.5,
      title: { th: "ปริพันธ์ทั้งหมด + ข้อสอบจำลอง", en: "All of integration + mock paper" },
      units: u("MFIT", 12, 13, 14, 15),
      keyPoints: [
        "ช่วงเช้า (3.5 ชม.): u-sub · by parts · พื้นที่ · ปริมาตร",
        "ช่วงบ่าย (2.5 ชม.): อนุพันธ์ย่อย แล้วทำข้อสอบจำลองปลายภาคแบบจับเวลา",
        "ช่วงค่ำ (1.5 ชม.): ตรวจเฉลย ซ่อมจุดผิด จดสูตรที่ต้องใช้พรุ่งนี้",
      ],
      extras: [
        res.mfitMock(),
        res.khanIntegral("", { th: "Khan: Integral Calculus (แบบฝึกรวม)", en: "Khan: Integral Calculus (Course Review)" }),
      ],
    },
  ]),

  day(
    "2026-11-11",
    [
      {
        subject: "MFIT",
        hours: 2,
        title: { th: "วอร์มสูตรก่อนสอบ", en: "Formula warm-up" },
        units: u("MFIT", 8, 9, 10, 11, 12, 13, 14, 15),
        keyPoints: [
          "ไล่ \"ตารางสูตร\" ท้ายสรุปแต่ละสัปดาห์",
          "สูตรพื้นที่ ปริมาตร u-sub และ by parts",
          "กินข้าว ดื่มน้ำ ไปถึงห้องสอบก่อน 13:30",
        ],
      },
    ],
    "MFIT",
  ),
];

export const FINAL_1_2569: StudyPlan = {
  id: "final-1-2569",
  title: { th: "แผนอ่านสอบปลายภาค 1/2569", en: "Finals plan · 1/2569" },
  days: DAYS,
};
