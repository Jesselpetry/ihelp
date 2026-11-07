import fs from "node:fs";
import path from "node:path";

interface IndexTotals {
  courses: number;
  coursesWithLibrary: number;
  assets: number;
  files: number;
  pages: number;
}

const ROOT = path.resolve(__dirname, "..");
const INDEX_FILE = path.join(ROOT, "lib/library/resource-index.json");
const README_FILE = path.join(ROOT, "README.md");
const FULL_README_FILE = path.join(ROOT, "docs/FULL_README.md");

export function generateStatsMarkdown(totals: IndexTotals, month = "พฤศจิกายน 2569"): string {
  const pagesFormatted = totals.pages.toLocaleString("th-TH");
  return [
    `| 📚 รายวิชาในระบบ | 🗂️ วิชามีคลังสื่อ | 📄 การ์ดสื่อการเรียน | 💾 ไฟล์เอกสารจริง | 📖 จำนวนหน้าเอกสาร | 🗓️ อัปเดตล่าสุด |`,
    `|:---:|:---:|:---:|:---:|:---:|:---:|`,
    `| **${totals.courses}** วิชา | **${totals.coursesWithLibrary}** วิชา | **${totals.assets}** รายการ | **${totals.files}** ไฟล์ | **${pagesFormatted}** หน้า | ${month} |`,
  ].join("\n");
}

export function updateReadmeStats(): void {
  if (!fs.existsSync(INDEX_FILE)) return;

  const indexRaw = fs.readFileSync(INDEX_FILE, "utf-8");
  const index = JSON.parse(indexRaw);
  const totals: IndexTotals = index.totals;

  const tableMd = generateStatsMarkdown(totals);

  for (const file of [README_FILE, FULL_README_FILE]) {
    if (!fs.existsSync(file)) continue;
    let content = fs.readFileSync(file, "utf-8");

    if (content.includes("<!-- stats:start -->") && content.includes("<!-- stats:end -->")) {
      content = content.replace(
        /<!-- stats:start -->[\s\S]*?<!-- stats:end -->/,
        `<!-- stats:start -->\n${tableMd}\n<!-- stats:end -->`
      );
      fs.writeFileSync(file, content);
    }
  }
}

if (require.main === module) {
  updateReadmeStats();
  console.log("synchronized readme stats table from resource-index.json");
}

