import streamlit as st
import pandas as pd
from collections import deque


# -------------------------------------------------
# BFS to find augmenting path
# -------------------------------------------------

def bfs(capacity, flow, source, sink, parent):

    n = len(capacity)

    visited = [False] * n

    queue = deque([source])

    visited[source] = True

    parent[source] = -1


    while queue:

        u = queue.popleft()

        for v in range(n):

            residual = capacity[u][v] - flow[u][v]

            if not visited[v] and residual > 0:

                visited[v] = True

                parent[v] = u

                queue.append(v)

                if v == sink:

                    return True

    return False


# -------------------------------------------------
# Ford-Fulkerson Algorithm
# -------------------------------------------------

def ford_fulkerson(capacity, source, sink):

    n = len(capacity)

    flow = [[0] * n for _ in range(n)]

    parent = [-1] * n

    max_flow = 0


    while bfs(

        capacity,

        flow,

        source,

        sink,

        parent

    ):

        path_flow = float("inf")

        s = sink


        # Find minimum residual capacity

        while s != source:

            path_flow = min(

                path_flow,

                capacity[parent[s]][s]

                -

                flow[parent[s]][s]

            )

            s = parent[s]


        max_flow += path_flow


        # Update flow

        v = sink

        while v != source:

            u = parent[v]

            flow[u][v] += path_flow

            flow[v][u] -= path_flow

            v = parent[v]


    return max_flow, flow



# -------------------------------------------------
# Streamlit UI
# -------------------------------------------------

st.set_page_config(

    page_title="Maximum Flow Network",

    layout="wide"

)


st.title(

    "Network Flow-Based Solutions"

)


st.subheader(

    "Maximum Flow using Ford-Fulkerson Algorithm"

)


st.markdown(

"""

Applications:

- Logistics Optimization

- Communication Networks

- Resource Allocation

"""

)


# Number of nodes

n = st.sidebar.slider(

    "Number of Nodes",

    2,

    8,

    6

)


st.sidebar.write(

    "Enter Capacity Matrix"

)


# Default matrix

default_matrix = [

    [0,16,13,0,0,0],

    [0,0,10,12,0,0],

    [0,4,0,0,14,0],

    [0,0,9,0,0,20],

    [0,0,0,7,0,4],

    [0,0,0,0,0,0]

]


# Resize if nodes changed

capacity = []


for i in range(n):

    row = []

    cols = st.columns(n)

    for j in range(n):

        if i < len(default_matrix) and j < len(default_matrix):

            val = default_matrix[i][j]

        else:

            val = 0

        value = cols[j].number_input(

            f"C{i}{j}",

            min_value=0,

            value=int(val),

            key=f"{i}{j}"

        )

        row.append(value)

    capacity.append(row)


st.write("### Capacity Matrix")

df = pd.DataFrame(capacity)

st.dataframe(df)


source = st.sidebar.number_input(

    "Source Node",

    min_value=0,

    max_value=n-1,

    value=0

)


sink = st.sidebar.number_input(

    "Sink Node",

    min_value=0,

    max_value=n-1,

    value=n-1

)


if st.button(

        "Compute Maximum Flow"):


    max_flow, flow = ford_fulkerson(

        capacity,

        source,

        sink

    )


    st.success(

        f"Maximum Flow = {max_flow}"

    )


    st.write(

        "### Flow Matrix"

    )


    flow_df = pd.DataFrame(flow)

    st.dataframe(flow_df)


    st.write(

        "### Network Information"

    )


    st.write(

        f"Source Node : {source}"

    )


    st.write(

        f"Sink Node : {sink}"

    )


    st.write(

        f"Maximum Flow : {max_flow}"

    )


# Footer

st.markdown("---")

st.markdown(

"Developed using Python and Streamlit"

)