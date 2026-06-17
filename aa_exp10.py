from collections import deque


def bfs(capacity, flow, source, sink, parent):

    visited = [False] * len(capacity)
    queue = deque([source])
    visited[source] = True
    parent[source] = -1


    while queue:

        u = queue.popleft()

        for v in range(len(capacity)):

            # Check residual capacity
            if (not visited[v] and capacity[u][v] - flow[u][v] > 0):

                queue.append(v)
                visited[v] = True
                parent[v] = u

                if v == sink:
                    return True

    return False


def ford_fulkerson(capacity, source, sink):

    n = len(capacity)

    # Initialize flow matrix
    flow = [[0] * n for _ in range(n)]
    parent = [-1] * n
    max_flow = 0


    # Find augmenting paths
    while bfs(capacity, flow, source, sink, parent):

        path_flow = float('inf')
        s = sink


        # Find minimum residual capacity
        while s != source:

            path_flow = min(
                path_flow,
                capacity[parent[s]][s] -
                flow[parent[s]][s]
            )
            s = parent[s]


        # Add path flow to overall flow
        max_flow += path_flow


        # Update residual capacities
        v = sink
        while v != source:
            u = parent[v]
            flow[u][v] += path_flow
            flow[v][u] -= path_flow
            v = parent[v]

    return max_flow



# Example

capacity = [

    [0, 16, 13, 0, 0, 0],
    [0, 0, 10, 12, 0, 0],
    [0, 4, 0, 0, 14, 0],
    [0, 0, 9, 0, 0, 20],
    [0, 0, 0, 7, 0, 4],
    [0, 0, 0, 0, 0, 0]

]

source = 0

sink = 5

print("Maximum Flow:",
      ford_fulkerson(capacity, source, sink))