import numpy as np


def lu_decomposition(matrix):
    n = len(matrix)
    L = np.zeros_like(matrix, dtype=float)
    U = np.zeros_like(matrix, dtype=float)

    for i in range(n):
        L[i][i] = 1
        for j in range(i, n):
            U[i][j] = matrix[i][j] - sum(L[i][k] * U[k][j] for k in range(i))
        for j in range(i + 1, n):
            L[j][i] = (matrix[j][i] - sum(L[j][k] * U[k][i] for k in range(i))) / U[i][i]

    return L, U

# Example
A = np.array([[4, 3], [6, 3]])
L, U = lu_decomposition(A)
print("L:", L)
print("U:", U)
