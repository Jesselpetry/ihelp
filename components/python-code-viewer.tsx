"use client";

import { useState } from "react";
import {
  Check,
  Copy,
  Download,
  Code2,
  Sparkles,
  Lightbulb,
  Cpu,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ProblemTakeaway {
  summary: { th: string; en: string };
  points: { th: string; en: string }[];
  complexity: { time: string; space: string };
  pep8Tip: { th: string; en: string };
}

const PROBLEM_TAKEAWAYS: Record<number, ProblemTakeaway> = {
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
    ],
    complexity: { time: "O(1)", space: "O(1)" },
    pep8Tip: {
      th: "นำเข้า import math ไว้ที่บรรทัดบนสุดของไฟล์เสมอ",
      en: "Place imports at the top of the file, right after module comments.",
    },
  },
  3019: {
    summary: {
      th: "การตรวจสอบเงื่อนไขความปลอดภัยและโครงสร้าง Branching if-elif-else",
      en: "Password security rules and multi-branch boolean validation.",
    },
    points: [
      {
        th: "ตรวจสอบเงื่อนไขความยาว >= 8 ตัวอักษรเป็นเกณฑ์แรก",
        en: "Check length >= 8 as the primary prerequisite.",
      },
      {
        th: "ใช้ boolean accumulator หรือ isupper(), islower(), isdigit() ตรวจสอบชนิดตัวอักษร",
        en: "Inspect character classes using isupper(), islower(), and isdigit().",
      },
      {
        th: "รวมเงื่อนไขทั้งหมดด้วย and/or เพื่อตัดสินผลลัพธ์ Safe หรือ Unsafe",
        en: "Combine conditions cleanly using boolean logic.",
      },
    ],
    complexity: { time: "O(N)", space: "O(1)" },
    pep8Tip: {
      th: "หลีกเลี่ยงการเขียน if cond == True ให้เขียน if cond: แทน",
      en: "Do not compare boolean values to True/False with ==.",
    },
  },
  3020: {
    summary: {
      th: "เทคนิคคณิตศาสตร์ O(1) สำหรับปัญหาการสะสมฝาแลกซื้อ",
      en: "Fast O(1) mathematical reduction for bottle cap exchange.",
    },
    points: [
      {
        th: "สูตรคำนวณจำนวนครั้งที่ได้ส่วนลด = (d - 1) // b โดยไม่ต้องวนลูป",
        en: "Calculate promo exchanges in O(1) with (d - 1) // b instead of loop.",
      },
      {
        th: "คิดราคารวม = (ราคาปกติ * จำนวน) - (จำนวนครั้งแลก * ส่วนลดต่อครั้ง)",
        en: "Total cost = (a * d) - (promos * c).",
      },
      {
        th: "จัดการ Edge Cases กรณี b = 0 หรือจำนวนที่ต้องการ d = 0 อย่างรัดกุม",
        en: "Safeguard against division by zero when b == 0.",
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
        th: "ตั้งค่าตัวแปรสะสมผลคูณเริ่มต้น ans = 1 (ห้ามเริ่มด้วย 0)",
        en: "Initialize product accumulator to 1 (never 0).",
      },
      {
        th: "วนลูป for i in range(1, n + 1): แล้วสะสมค่า ans *= i",
        en: "Iterate with range(1, n + 1) and multiply accumulatively ans *= i.",
      },
      {
        th: "กรณี n = 0 หรือ n = 1 ให้ผลลัพธ์เป็น 1 เสมอ",
        en: "Ensure 0! returns 1 as defined mathematically.",
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
        th: "ตรวจสอบเงื่อนไขที่เฉพาะเจาะจงที่สุดก่อนเสมอ: n % 15 == 0 (FizzBuzz)",
        en: "Check the most specific condition first: n % 15 == 0.",
      },
      {
        th: "จากนั้นจึงตรวจสอบ elif n % 3 == 0 (Fizz) และ elif n % 5 == 0 (Buzz)",
        en: "Follow with elif n % 3 == 0 for Fizz and elif n % 5 == 0 for Buzz.",
      },
      {
        th: "หากไม่ตรงกับเงื่อนไขใด ให้พิมพ์ตัวเลข n ในบล็อก else",
        en: "Fallback to printing the number itself in the else branch.",
      },
    ],
    complexity: { time: "O(1)", space: "O(1)" },
    pep8Tip: {
      th: "เว้นวรรค 1 ช่องรอบเครื่องหมายเปรียบเทียบ == เช่น i % 15 == 0",
      en: "Always place single spaces around comparison operators ==.",
    },
  },
  3226: {
    summary: {
      th: "การเติบโตแบบทบต้น (Compound Growth) และการคำนวณเงินเฟ้อ",
      en: "Compound growth loop and integer percentage calculation.",
    },
    points: [
      {
        th: "คำนวณเงินเฟ้อทบต้นปีต่อปี: money = int(money * 107 // 100) หรือบวก 7%",
        en: "Apply annual compound rate iteratively across k years.",
      },
      {
        th: "วนลูป for _ in range(years): ตามจำนวนปีที่โจทย์กำหนด",
        en: "Use for _ in range(years): when loop index variable is unused.",
      },
      {
        th: "จัดการการปัดเศษและแสดงผลตัวเลขจำนวนเต็มตามข้อกำหนด",
        en: "Handle integer truncation or rounding exactly as specified.",
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
      th: "การสร้าง Pattern สามเหลี่ยมด้วย String Multiplication",
      en: "Triangle shape synthesis with string multiplication.",
    },
    points: [
      {
        th: "สร้างช่องว่างและดาวด้วย String Multiplication: ' ' * spaces + '*' * stars",
        en: "Generate row patterns with ' ' * spaces + '*' * stars.",
      },
      {
        th: "หาความสัมพันธ์ระหว่าง index แถว i กับจำนวน spaces และ stars",
        en: "Formulate geometric formula relating row index to space/star counts.",
      },
      {
        th: "พิมพ์ทีละแถวในลูปเดียว O(H) โดยไม่ต้องใช้ Nested Loop ที่ซับซ้อน",
        en: "Print row by row in a single O(H) loop.",
      },
    ],
    complexity: { time: "O(H)", space: "O(H)" },
    pep8Tip: {
      th: "ใช้เครื่องหมายคูณ * กับสตริงได้โดยเว้นวรรครอบตัวดำเนินการอย่างเหมาะสม",
      en: "String repetition with * should maintain clear spacing.",
    },
  },
};

/**
 * High-performance Python syntax highlighter that returns tokenized lines.
 */
function highlightPythonLine(line: string): React.ReactNode[] {
  // Python syntax token regex
  const regex =
    /(#.*$)|(\b(?:def|return|if|elif|else|for|while|in|import|from|as|pass|break|continue|and|or|not|is|None|True|False|class|lambda|try|except|finally|raise|with|yield|async|await)\b)|(\b(?:print|input|int|float|str|bool|list|dict|set|tuple|range|len|sum|min|max|abs|round|enumerate|zip|map|filter|sorted|any|all|math|sqrt|factorial|lower|upper|strip|split|join)\b)|("[^"\\]*(?:\\.[^"\\]*)*"|'[^'\\]*(?:\\.[^'\\]*)*')|(\b\d+(?:\.\d+)?\b)|(==|!=|<=|>=|\+=|-=|\*=|\/=|%=|\*\*|\/\/|[+\-*/%<>=])/g;

  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(line)) !== null) {
    // Normal text before match
    if (match.index > lastIndex) {
      nodes.push(
        <span key={`txt-${lastIndex}`} className="text-zinc-200">
          {line.slice(lastIndex, match.index)}
        </span>,
      );
    }

    const [
      ,
      comment,
      keyword,
      builtin,
      stringLit,
      numberLit,
      operator,
    ] = match;

    if (comment) {
      nodes.push(
        <span key={`cmt-${match.index}`} className="text-zinc-400 dark:text-zinc-500 italic">
          {comment}
        </span>,
      );
    } else if (keyword) {
      // iHelp Pink for Python Keywords!
      nodes.push(
        <span key={`kw-${match.index}`} className="text-pink-500 dark:text-pink-400 font-semibold">
          {keyword}
        </span>,
      );
    } else if (builtin) {
      // Cyan / Blue for Built-in functions
      nodes.push(
        <span key={`bi-${match.index}`} className="text-sky-400 dark:text-sky-300 font-medium">
          {builtin}
        </span>,
      );
    } else if (stringLit) {
      // Emerald Green for Strings
      nodes.push(
        <span key={`str-${match.index}`} className="text-emerald-400 dark:text-emerald-300">
          {stringLit}
        </span>,
      );
    } else if (numberLit) {
      // Amber for Numbers
      nodes.push(
        <span key={`num-${match.index}`} className="text-amber-400 dark:text-amber-300">
          {numberLit}
        </span>,
      );
    } else if (operator) {
      // Violet for Operators
      nodes.push(
        <span key={`op-${match.index}`} className="text-pink-400/90 dark:text-pink-300/90">
          {operator}
        </span>,
      );
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < line.length) {
    nodes.push(
      <span key={`txt-${lastIndex}`} className="text-zinc-200">
        {line.slice(lastIndex)}
      </span>,
    );
  }

  return nodes;
}

export function PythonCodeViewer({
  code,
  problemId,
  problemName,
  technique,
  locale,
}: {
  code: string;
  problemId: number;
  problemName: string;
  technique: string;
  locale: "th" | "en";
}) {
  const [copied, setCopied] = useState(false);
  const lines = code.split("\n");
  const takeaway = PROBLEM_TAKEAWAYS[problemId];

  function handleCopy() {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleDownload() {
    const blob = new Blob([code], { type: "text/x-python;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `oj${problemId}_main.py`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      {/* Code Editor Container */}
      <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-[#090d13] text-zinc-100 shadow-lg">
        {/* Editor Toolbar */}
        <div className="flex items-center justify-between border-b border-zinc-800/80 bg-[#121720] px-4 py-2.5">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="size-3 rounded-full bg-rose-500/80" />
              <span className="size-3 rounded-full bg-amber-500/80" />
              <span className="size-3 rounded-full bg-emerald-500/80" />
            </div>
            <div className="h-4 w-px bg-zinc-700" />
            <div className="flex items-center gap-2">
              <Code2 className="size-3.5 text-primary" />
              <span className="font-mono text-xs font-semibold text-zinc-300">
                main.py
              </span>
              {problemName && (
                <span className="text-zinc-500 font-mono text-[11px] hidden md:inline">
                  ({problemName})
                </span>
              )}
              <Badge className="rounded-full bg-primary text-primary-foreground text-[10px] px-2 py-0 font-mono shadow-none">
                Python 3
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={handleDownload}
              className="h-7 px-2.5 text-xs text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-full gap-1"
              title="Download main.py"
            >
              <Download className="size-3.5" />
              <span className="hidden sm:inline">Download</span>
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleCopy}
              className="h-7 px-2.5 text-xs text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-full gap-1"
              title="Copy source code"
            >
              {copied ? (
                <>
                  <Check className="size-3.5 text-primary" />
                  <span className="text-primary font-semibold">
                    {locale === "th" ? "คัดลอกแล้ว" : "Copied"}
                  </span>
                </>
              ) : (
                <>
                  <Copy className="size-3.5" />
                  <span className="hidden sm:inline">
                    {locale === "th" ? "คัดลอกโค้ด" : "Copy Code"}
                  </span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Syntax Highlighted Lines with Line Numbers */}
        <pre className="overflow-x-auto p-4 font-mono text-sm leading-relaxed text-zinc-200">
          <table className="w-full border-collapse">
            <tbody>
              {lines.map((line, idx) => {
                const lineNum = idx + 1;
                return (
                  <tr key={idx} className="hover:bg-zinc-800/40 transition-colors">
                    <td className="w-10 select-none pr-4 text-right text-xs font-mono text-zinc-600 dark:text-zinc-600">
                      {lineNum < 10 ? `0${lineNum}` : lineNum}
                    </td>
                    <td className="whitespace-pre pl-2">
                      {highlightPythonLine(line)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </pre>
      </div>

      {/* Key Takeaway & Pattern Breakdown Card */}
      {takeaway && (
        <div className="rounded-2xl border bg-card p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-3">
            <div className="flex items-center gap-2">
              <Lightbulb className="size-4 text-primary" />
              <h3 className="font-bold text-foreground text-sm sm:text-base">
                {locale === "th" ? "จุดสำคัญ & Pattern การเขียนโค้ดข้อนี้" : "Key Takeaways & Pattern Analysis"}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="rounded-full bg-primary text-primary-foreground text-xs font-mono px-3 py-0.5 shadow-none">
                {technique || "Pattern Practice"}
              </Badge>
            </div>
          </div>

          <p className="text-xs sm:text-sm font-medium text-foreground leading-relaxed">
            {locale === "th" ? takeaway.summary.th : takeaway.summary.en}
          </p>

          {/* Key Breakdown Bullet Points */}
          <div className="rounded-xl border bg-muted/20 p-4">
            <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-foreground mb-3">
              <Sparkles className="size-3.5 text-primary" />
              <span>{locale === "th" ? "สรุปหลักคิดสำคัญ (Core Logic)" : "Core Logic Highlights"}</span>
            </h4>
            <ul className="space-y-2 text-xs text-muted-foreground leading-relaxed">
              {takeaway.points.map((pt, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="flex size-4 items-center justify-center rounded-full bg-primary text-primary-foreground font-mono text-[10px] font-bold shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span className="text-foreground/90">
                    {locale === "th" ? pt.th : pt.en}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Complexity & PEP-8 Tips Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="rounded-xl border bg-card p-3.5 flex items-start gap-3">
              <Cpu className="size-4 text-primary shrink-0 mt-0.5" />
              <div>
                <span className="block text-[11px] font-semibold text-foreground uppercase tracking-wide">
                  {locale === "th" ? "ความซับซ้อน (Complexity)" : "Complexity"}
                </span>
                <span className="mt-1 block font-mono text-xs text-muted-foreground">
                  Time: <strong className="text-primary">{takeaway.complexity.time}</strong> · Space: <strong className="text-primary">{takeaway.complexity.space}</strong>
                </span>
              </div>
            </div>

            <div className="rounded-xl border bg-card p-3.5 flex items-start gap-3">
              <ShieldCheck className="size-4 text-primary shrink-0 mt-0.5" />
              <div>
                <span className="block text-[11px] font-semibold text-foreground uppercase tracking-wide">
                  {locale === "th" ? "คำแนะนำ PEP-8 (Code Style)" : "PEP-8 Guideline"}
                </span>
                <p className="mt-1 text-xs text-muted-foreground leading-snug">
                  {locale === "th" ? takeaway.pep8Tip.th : takeaway.pep8Tip.en}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
