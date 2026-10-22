#!/usr/bin/env python3
"""
Generate crisp, modern, left-aligned, vertically centered OpenGraph images
for iHelp pages using public/og/og-base.png (1200x630) as background.

Features:
- Bigger typography and generous spacing
- Exact vertical centering calculated per card
- Full color badge (solid white pill with rich iHelp brand blue text)
- Preserves the official School of IT KMITL logo and Jess IT24 avatar
"""

import os
from PIL import Image, ImageDraw, ImageFont

BASE_PATH = "public/og/og-base.png"
OUTPUT_DIR = "public/og"

FONT_BOLD_PATH = "/System/Library/Fonts/Supplemental/SukhumvitSet.ttc"

def get_fonts(title_size=68):
    return {
        "title": ImageFont.truetype(FONT_BOLD_PATH, title_size, index=5),
        "sub": ImageFont.truetype(FONT_BOLD_PATH, 33, index=4),
        "body": ImageFont.truetype(FONT_BOLD_PATH, 23, index=3),
        "tag": ImageFont.truetype(FONT_BOLD_PATH, 18, index=4),
        "badge": ImageFont.truetype(FONT_BOLD_PATH, 19, index=5),
    }

CARDS = [
    {
        "filename": "courses.png",
        "badge": "<ihelp>  ·  IT KMITL  ·  CURRICULUM",
        "title": "Course Hub",
        "subtitle": "ศูนย์รวมรายวิชา คณะเทคโนโลยีสารสนเทศ (IT KMITL)",
        "desc": [
            "สรุปเนื้อหา แผนที่หลักสูตร คลังข้อสอบเก่า และสื่อการเรียนการสอนรายวิชา",
            "จัดระบบตาม 11 โมดูลการเรียนรู้ เข้าใจ ย่อ ฝึก และพิสูจน์ ครบจบในที่เดียว",
        ],
        "tags": ["15 สัปดาห์ครบถ้วน", "ขอบเขตสอบ Midterm / Final", "สไลด์ OnLearn & ชีทติว", "คลังข้อสอบเก่า"],
    },
    {
        "filename": "itf.png",
        "badge": "<ihelp>  ·  IT KMITL  ·  06016402",
        "title": "IT Fundamentals",
        "subtitle": "พื้นฐานทางด้านเทคโนโลยีสารสนเทศ (ITF)",
        "desc": [
            "สรุปเนื้อหาเข้มข้น 15 สัปดาห์ พร้อมแนวข้อสอบกลางภาคและปลายภาค",
            "รวบรวมสไลด์ เอกสารสรุป แบบทดสอบย่อย และคลังสื่อการเรียนรู้ครบวงจร",
        ],
        "tags": ["15 สัปดาห์ครบถ้วน", "ขอบเขตสอบ Midterm / Final", "คลังสไลด์ OnLearn", "แบบทดสอบฝึกทำ"],
    },
    {
        "filename": "ics.png",
        "badge": "<ihelp>  ·  IT KMITL  ·  06016411",
        "title": "Intro to Computer Systems",
        "subtitle": "ระบบคอมพิวเตอร์เบื้องต้น (ICS)",
        "desc": [
            "สรุปบทเรียน ฮาร์ดแวร์ วงจรดิจิทัล สถาปัตยกรรมคอมพิวเตอร์ และการคำนวณ",
            "รวบรวมใบงาน Lab การต่อวงจร บอร์ดทดลอง พร้อมแนวข้อสอบเสมือนจริง",
        ],
        "tags": ["สถาปัตยกรรมคอมพิวเตอร์", "วงจรดิจิทัล & Logic", "คู่มือ Lab ทดลอง", "แนวข้อสอบเก่า"],
    },
    {
        "filename": "mfit.png",
        "badge": "<ihelp>  ·  IT KMITL  ·  06016401",
        "title": "Mathematics for IT",
        "subtitle": "คณิตศาสตร์สำหรับเทคโนโลยีสารสนเทศ (MFIT)",
        "desc": [
            "สรุปสูตร นิยาม ทฤษฎีเซต ตรรกศาสตร์ เมทริกซ์ และความน่าจะเป็นสำหรับไอที",
            "พร้อมแบบฝึกหัด ตะลุยโจทย์ และแนวข้อสอบปลายภาคเจาะลึก 8 สัปดาห์",
        ],
        "tags": ["สรุปสูตร & ทฤษฎี", "สัปดาห์ 8-15 (Final)", "โจทย์ฝึกฝนพร้อมวิธีทำ", "แบบทดสอบวัดความเข้าใจ"],
    },
    {
        "filename": "pscp.png",
        "badge": "<ihelp>  ·  IT KMITL  ·  06066303",
        "title": "Problem Solving & Programming",
        "subtitle": "การแก้ปัญหาและการโปรแกรมคอมพิวเตอร์ (PSCP)",
        "desc": [
            "คลังโจทย์ iJudge รายสัปดาห์ เทคนิคการวิเคราะห์อัลกอริทึม และการแก้ปัญหา",
            "ตัวช่วยสร้างเอกสาร submission & reflection พร้อมแนวทางการเขียนโค้ด Python",
        ],
        "tags": ["คลังโจทย์ iJudge", "เทคนิคการแก้โจทย์", "ตัวช่วยสร้าง Reflection", "Python Best Practices"],
    },
    {
        "filename": "charm.png",
        "badge": "<ihelp>  ·  IT KMITL  ·  90641001",
        "title": "Charm School",
        "subtitle": "โรงเรียนสร้างเสน่ห์ (CHARM)",
        "desc": [
            "แนวทางการพัฒนาบุคลิกภาพ ทักษะการสื่อสาร มารยาทสังคม และการทำงานร่วมกัน",
            "สรุปเนื้อหาการบรรยาย กิจกรรมกลุ่ม และเกณฑ์การประเมินรายวิชา",
        ],
        "tags": ["พัฒนาบุคลิกภาพ", "การสื่อสาร & มารยาท", "กิจกรรมในชั้นเรียน", "เกณฑ์การให้คะแนน"],
    },
    {
        "filename": "fe.png",
        "badge": "<ihelp>  ·  IT KMITL  ·  90644007",
        "title": "Foundation English 1",
        "subtitle": "ภาษาอังกฤษพื้นฐาน 1 (FE)",
        "desc": [
            "สรุปไวยากรณ์ คำศัพท์เชิงวิชาการ การอ่านจับใจความ และทักษะการฟังเพื่อการสื่อสาร",
            "พร้อมแนวทางทำข้อสอบ แบบฝึกหัดทบทวน และเทคนิคการทำคะแนนสอบ",
        ],
        "tags": ["Grammar & Vocab", "Reading & Listening", "แนวข้อสอบ Midterm/Final", "เทคนิคทำข้อสอบ"],
    },
    {
        "filename": "sport.png",
        "badge": "<ihelp>  ·  IT KMITL  ·  90641003",
        "title": "Sports & Recreation",
        "subtitle": "กีฬาและนันทนาการ (SPORT)",
        "desc": [
            "หลักการเสริมสร้างสมรรถภาพทางกาย กฎกติกาการแข่งขัน และกิจกรรมนันทนาการ",
            "ข้อมูลเกณฑ์การทดสอบสมรรถภาพ การบันทึกกิจกรรม และแนวทางการเก็บคะแนน",
        ],
        "tags": ["สมรรถภาพทางกาย", "กติกากีฬา", "กิจกรรมนันทนาการ", "เกณฑ์การผ่าน"],
    },
    {
        "filename": "compro.png",
        "badge": "<ihelp>  ·  EN KMITL  ·  01006012",
        "title": "Computer Programming",
        "subtitle": "การเขียนโปรแกรมคอมพิวเตอร์ (ComPro)",
        "desc": [
            "คลัง Lab เขียนโปรแกรมภาษา C/Python เทคนิคแก้โจทย์ และแนวคิดอัลกอริทึม",
            "แบบฝึกหัด Lab Chapters 1-5 พร้อมแนวทางการตรวจผลลัพธ์และคำอธิบายละเอียด",
        ],
        "tags": ["Lab Chapters 1-5", "ภาษา C & Python", "คลังโจทย์แบบฝึกหัด", "คำอธิบายโค้ด"],
    },
    {
        "filename": "map.png",
        "badge": "<ihelp>  ·  IT KMITL  ·  SYLLABUS MAP",
        "title": "Syllabus Map",
        "subtitle": "แผนที่เนื้อหา & โครงสร้างรายสัปดาห์",
        "desc": [
            "สำรวจผังเนื้อหาตลอดภาคการศึกษา ตรวจสอบสถานะหัวข้อเรียน สรุปเนื้อหา",
            "เช็กจำนวนข้อสอบ สไลด์บรรยาย และวางแผนอ่านหนังสือสอบอย่างเป็นระบบ",
        ],
        "tags": ["โครงสร้าง 15 สัปดาห์", "เช็กความพร้อมรายบท", "สถานะสรุป & สไลด์", "ตารางทบทวนสอบ"],
    },
    {
        "filename": "week.png",
        "badge": "<ihelp>  ·  IT KMITL  ·  WEEKLY GUIDE",
        "title": "Weekly Study Guide",
        "subtitle": "สรุปเนื้อหาและบทเรียนรายสัปดาห์",
        "desc": [
            "เจาะลึกเนื้อหาประจำแต่ละสัปดาห์ สรุปใจความสำคัญที่ต้องรู้ก่อนเข้าเรียน",
            "รวบรวมเอกสารประกอบการสอน สไลด์ เลกเชอร์ และแบบฝึกหัดทบทวนท้ายคาบ",
        ],
        "tags": ["เจาะลึกรายสัปดาห์", "เลกเชอร์ & สไลด์", "จุดสำคัญที่มักออกสอบ", "โจทย์ทบทวนประจำบท"],
    },
    {
        "filename": "library.png",
        "badge": "<ihelp>  ·  IT KMITL  ·  RESOURCE LIBRARY",
        "title": "Learning Library",
        "subtitle": "คลังสื่อการเรียนรู้และเอกสารประกอบการสอน",
        "desc": [
            "ศูนย์รวมสไลด์ OnLearn ชีทสรุป เลกเชอร์ คู่มือปฏิบัติการ และคู่มือรายวิชา",
            "จัดหมวดหมู่ตามรายวิชาและสัปดาห์ เข้าถึงง่าย รวดเร็ว และเป็นระเบียบ",
        ],
        "tags": ["สไลด์บรรยาย OnLearn", "ชีทติว & สรุปย่อ", "คู่มือปฏิบัติการ Lab", "คลังเอกสารรายวิชา"],
    },
    {
        "filename": "summary.png",
        "badge": "<ihelp>  ·  IT KMITL  ·  STUDY NOTES",
        "title": "Study Notes & Summary",
        "subtitle": "สรุปเนื้อหาและชีทติวฉบับเข้มข้น",
        "desc": [
            "เนื้อหาอ่านเข้าใจง่าย กระชับ ตรงประเด็น แบ่งสัดส่วนชัดเจนตามบทเรียน",
            "พร้อมสารบัญนำทางแบบเรียลไทม์ และไฮไลต์ประเด็นสำคัญที่ออกสอบบ่อย",
        ],
        "tags": ["อ่านจบใน 12 นาที", "สารบัญนำทางสด", "เน้นจุดสำคัญ", "ครอบคลุมทุกบท"],
    },
    {
        "filename": "cram.png",
        "badge": "<ihelp>  ·  IT KMITL  ·  CRAM SHEET",
        "title": "Cram Sheet",
        "subtitle": "สรุปย่อความจำก่อนเข้าห้องสอบ",
        "desc": [
            "คัดเฉพาะสูตร กฎ นิยาม ข้อควรระวัง และใจความสำคัญที่ต้องจำเข้าห้องสอบ",
            "ย่อเนื้อหาให้สั้นกระชับที่สุด เหมาะสำหรับเปิดทบทวนด่วนก่อนสอบ",
        ],
        "tags": ["สูตรสำคัญที่ต้องจำ", "นิยาม & คีย์เวิร์ด", "ทบทวนหน้าห้องสอบ", "ฉบับย่อขั้นสุด"],
    },
    {
        "filename": "drill.png",
        "badge": "<ihelp>  ·  IT KMITL  ·  PRACTICE DRILL",
        "title": "Practice & Quiz Bank",
        "subtitle": "ตะลุยโจทย์และคลังแบบฝึกหัด",
        "desc": [
            "ฝึกฝนทักษะการดึงความจำผ่านแบบทดสอบจำแนกตามบทและระดับความยาก",
            "พร้อมเฉลยละเอียด ตรวจคำตอบทันที และประเมินจุดที่ต้องทบทวนเพิ่ม",
        ],
        "tags": ["แยกตามบทเรียน", "ตรวจคำตอบทันที", "วิเคราะห์จุดอ่อน", "คลังโจทย์ตรงประเด็น"],
    },
    {
        "filename": "mock.png",
        "badge": "<ihelp>  ·  IT KMITL  ·  MOCK EXAM",
        "title": "Mock Exam & Weak Spots",
        "subtitle": "จำลองสอบจริงและซ่อมจุดอ่อน",
        "desc": [
            "ทดสอบความพร้อมในสภาพแวดล้อมจับเวลาเสมือนจริงตามสัดส่วนข้อสอบ",
            "ประเมินคะแนนคาดการณ์ และชี้เป้าหัวข้อที่ต้องอ่านซ่อมก่อนลงสนามสอบจริง",
        ],
        "tags": ["จับเวลาเสมือนจริง", "ประเมินความพร้อมสอบ", "วิเคราะห์จุดบกพร่อง", "แนวข้อสอบเสมือน"],
    },
    {
        "filename": "exam-schedule.png",
        "badge": "<ihelp>  ·  IT KMITL  ·  EXAM SCHEDULE",
        "title": "Exam Schedule",
        "subtitle": "ตารางสอบและผังที่นั่งสอบรายบุคคล",
        "desc": [
            "ตรวจสอบวัน เวลา สถานที่สอบ และผังที่นั่งสอบปลายภาค คณะเทคโนโลยีสารสนเทศ",
            "ค้นหาด้วยรหัสนักศึกษา พร้อมปุ่มเพิ่มเข้าปฏิทินส่วนตัวได้ในคลิกเดียว",
        ],
        "tags": ["ผังที่นั่งสอบรายคน", "แจ้งเตือนลงปฏิทิน", "สถานที่สอบ & ห้องสอบ", "อัปเดตตรงตามคณะ"],
    },
]

def render_card(card, base_img):
    img = base_img.copy()
    overlay = Image.new("RGBA", img.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)

    # Dynamic title sizing for long titles
    title_len = len(card["title"])
    title_size = 60 if title_len > 24 else (64 if title_len > 18 else 70)
    fonts = get_fonts(title_size=title_size)

    x = 85
    canvas_h = img.size[1] # 630

    # 1. Measure Badge
    pill_text = card["badge"]
    b_bbox = draw.textbbox((0, 0), pill_text, font=fonts["badge"])
    b_tw = b_bbox[2] - b_bbox[0]
    b_th = b_bbox[3] - b_bbox[1]
    b_px, b_py = 20, 10
    pill_w = b_tw + b_px * 2
    pill_h = b_th + b_py * 2

    # 2. Measure Title
    t_bbox = draw.textbbox((0, 0), card["title"], font=fonts["title"])
    title_h = t_bbox[3] - t_bbox[1]

    # 3. Measure Subtitle
    s_bbox = draw.textbbox((0, 0), card["subtitle"], font=fonts["sub"])
    sub_h = s_bbox[3] - s_bbox[1]

    # 4. Measure Description
    desc_lh = 38
    desc_h = len(card["desc"]) * desc_lh

    # 5. Measure Tags
    sample_tag = card["tags"][0] if card["tags"] else "Tag"
    tb_sample = draw.textbbox((0, 0), sample_tag, font=fonts["tag"])
    tag_h = (tb_sample[3] - tb_sample[1]) + 18

    # Spacing configuration
    sp_badge_title = 28
    sp_title_sub = 26
    sp_sub_desc = 24
    sp_desc_tags = 28

    total_h = (
        pill_h
        + sp_badge_title
        + title_h
        + sp_title_sub
        + sub_h
        + sp_sub_desc
        + desc_h
        + sp_desc_tags
        + tag_h
    )

    # Perfect vertical centering
    y = (canvas_h - total_h) // 2

    # ── Draw 1: Full Color Badge (Solid White Pill with iHelp Brand Blue Text) ──
    draw.rounded_rectangle(
        [x, y, x + pill_w, y + pill_h],
        radius=pill_h // 2,
        fill=(255, 255, 255, 255),
        outline=(255, 255, 255, 255),
        width=1,
    )
    draw.text((x + b_px, y + b_py - 3), pill_text, font=fonts["badge"], fill=(28, 78, 156, 255))

    # ── Draw 2: Main Title ──
    y += pill_h + sp_badge_title
    draw.text((x, y), card["title"], font=fonts["title"], fill=(255, 255, 255, 255))

    # ── Draw 3: Subtitle ──
    y += title_h + sp_title_sub
    draw.text((x, y), card["subtitle"], font=fonts["sub"], fill=(186, 230, 253, 255))

    # ── Draw 4: Description ──
    y += sub_h + sp_sub_desc
    for line in card["desc"]:
        draw.text((x, y), line, font=fonts["body"], fill=(241, 245, 249, 230))
        y += desc_lh

    # ── Draw 5: Feature Tags ──
    y += sp_desc_tags
    tag_x = x
    for tag in card["tags"]:
        tb = draw.textbbox((0, 0), tag, font=fonts["tag"])
        tw = tb[2] - tb[0]
        th = tb[3] - tb[1]
        tpx, tpy = 18, 9
        cw = tw + tpx * 2
        ch = th + tpy * 2
        draw.rounded_rectangle(
            [tag_x, y, tag_x + cw, y + ch],
            radius=ch // 2,
            fill=(255, 255, 255, 38),
            outline=(255, 255, 255, 90),
            width=1,
        )
        draw.text((tag_x + tpx, y + tpy - 3), tag, font=fonts["tag"], fill=(255, 255, 255, 245))
        tag_x += cw + 12

    final_img = Image.alpha_composite(img, overlay)
    out_file = os.path.join(OUTPUT_DIR, card["filename"])
    final_img.save(out_file, optimize=True)
    print(f"✓ Saved {out_file} (vertically centered at y={((canvas_h - total_h) // 2)})")

def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    if not os.path.exists(BASE_PATH):
        raise FileNotFoundError(f"Missing base template at {BASE_PATH}")

    base = Image.open(BASE_PATH).convert("RGBA")
    print(f"Loaded base template: {base.size}")

    for card in CARDS:
        render_card(card, base)

    print("\nAll OG images generated successfully!")

if __name__ == "__main__":
    main()
