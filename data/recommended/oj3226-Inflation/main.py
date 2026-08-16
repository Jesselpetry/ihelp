""" Inflation """

def main():
    """Inflation"""
    amount = float(input())
    k = int(input())
    for _ in range(k):
        amount = int(amount * 1038) / 1000
    print(int(amount))

if __name__ == "__main__":
    main()
