import itertools
def assignment_bruteforce(cost_matrix):
    n = len(cost_matrix)
    min_cost = float('inf')
    best_assignment = None
    for perm in itertools.permutations(range(n)):
        cost = sum(cost_matrix[i][perm[i]] for i in range(n))
        if cost < min_cost:
            min_cost = cost
            best_assignment = perm
    return best_assignment, min_cost
# Cost matrix
cost_matrix = [
    [9, 2, 7, 8],
    [6, 4, 3, 7],
    [5, 8, 1, 8],
    [7, 6, 9, 4]
]
# Find the optimal assignment
assignment, cost = assignment_bruteforce(cost_matrix)
print("Best Assignment:", assignment)
print("Minimum Cost:", cost)
