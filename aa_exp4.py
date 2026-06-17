import numpy as np
def gaussian_elimination(a, b):
    n = len(b)

    # Convert to NumPy arrays
    a = np.array(a, dtype=float)
    b = np.array(b, dtype=float)

    # Forward Elimination
    for i in range(n):

        # Partial Pivoting
        max_row = np.argmax(np.abs(a[i:, i])) + i

        # Swap rows in matrix A
        a[[i, max_row]] = a[[max_row, i]]

        # Swap corresponding elements in vector B
        b[i], b[max_row] = b[max_row], b[i]

        # Eliminate below pivot
        for j in range(i + 1, n):

            factor = a[j][i] / a[i][i]

            a[j, i:] -= factor * a[i, i:]

            b[j] -= factor * b[i]

    # Back Substitution
    x = np.zeros_like(b)

    for i in range(n - 1, -1, -1):

        x[i] = (b[i] -
                np.dot(a[i, i + 1:], x[i + 1:])) / a[i][i]

    return x


# Example
a = [
    [2, -1, 1],
    [-3, -1, 2],
    [-2, 1, 2]
]

b = [8, -11, -3]

solution = gaussian_elimination(a, b)

print("Solution:", solution)
