""" Left Arrow """


def main():
    """Left Arrow"""
    k = int(input())          # ความกว้าง: จำนวน '*' ในทุกบรรทัด
    n = int(input())          # ความสูง เป็นเลขคี่เสมอ

    mid = n // 2              # ดัชนีของแถวกลาง แถวที่ยื่นออกไปทางซ้ายสุด
    for row in range(n):
        # ยิ่งห่างจากแถวกลาง ยิ่งถูกดันเข้าไปทางขวา
        indent = abs(row - mid)
        print(" " * indent + "*" * k)


if __name__ == "__main__":
    main()
