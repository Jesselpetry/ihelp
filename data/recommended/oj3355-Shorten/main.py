""" [LEARNING LOGS] Shorten """
import sys


def main():
    """[LEARNING LOGS] Shorten"""
    nums = []
    for token in sys.stdin.read().split():
        value = int(token)
        if value == -1:              # เจอ -1 หยุดรับ
            break
        nums.append(value)

    parts = []
    start = prev = nums[0]           # ค่าเริ่มต้นและค่าล่าสุดของช่วงที่กำลังสร้าง
    for value in nums[1:]:
        if value == prev + 1:        # ยังต่อเนื่องกับช่วงเดิม ขยายช่วงออกไป
            prev = value
            continue
        parts.append(str(start) if start == prev else f"{start}-{prev}")
        start = prev = value         # เปิดช่วงใหม่
    parts.append(str(start) if start == prev else f"{start}-{prev}")

    print(", ".join(parts))


if __name__ == "__main__":
    main()
