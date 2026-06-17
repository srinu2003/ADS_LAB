def warshall_algorithm(graph):
    n = len(graph)
    reach = [row[:] for row in graph]

    for k in range(n):
        for i in range(n):
            for j in range(n):
                reach[i][j] = reach[i][j] or (reach[i][k] and reach[k][j])

    return reach

# Example adjacency matrix
graph = [
    [0, 1, 0],
    [0, 0, 1],
    [1, 0, 0]
]

transitive_closure = warshall_algorithm(graph)
print("Transitive Closure:", transitive_closure)
