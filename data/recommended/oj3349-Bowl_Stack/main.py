""" กองชาม """
import sys
from collections import Counter


def main():
    """กองชาม"""
    data = list(map(int, sys.stdin.read().split()))
    n = data[0]
    sizes = data[1:1 + n]

    # จัดกองได้อิสระ ชามขนาดเท่ากันซ้อนกันไม่ได้ (ต้องเล็กกว่าอย่างเดียว)
    # ดังนั้นจำนวนกองน้อยสุด = จำนวนชามของขนาดที่ซ้ำมากที่สุด
    counts = Counter(sizes)
    print(max(counts.values()))


if __name__ == "__main__":
    main()
