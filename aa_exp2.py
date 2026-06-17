def karatsuba(x, y):
    # Base case for recursion
    if x < 10 or y < 10:
        return x * y

    # Calculate the size of the numbers
    m = min(len(str(x)), len(str(y))) // 2

    # Split the numbers into high and low parts
    high_x, low_x = divmod(x, 10**m)
    high_y, low_y = divmod(y, 10**m)

    # Recursive calls
    z0 = karatsuba(low_x, low_y)
    z1 = karatsuba(low_x + high_x, low_y + high_y)
    z2 = karatsuba(high_x, high_y)

    # Combine the results
    return z2 * 10**(2 * m) + (z1 - z2 - z0) * 10**m + z0

# Example
x = 4321
y = 8765

result = karatsuba(x, y)

print("First Number :", x)
print("Second Number:", y)
print("Product      :", result)
