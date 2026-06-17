import streamlit as st
import numpy as np


# ---------------------------------------------------
# Fractional Knapsack using Greedy Method
# ---------------------------------------------------
def fractional_knapsack(weights, profits, capacity):

    n = len(weights)

    items = []

    for i in range(n):

        ratio = profits[i] / weights[i]

        items.append(
            (ratio, weights[i], profits[i])
        )

    # Sort by profit/weight ratio in descending order
    items.sort(reverse=True)

    total_profit = 0

    selected_items = []

    for ratio, w, p in items:

        if capacity >= w:

            capacity -= w

            total_profit += p

            selected_items.append(
                (w, p, 1.0)
            )

        else:

            fraction = capacity / w

            total_profit += p * fraction

            selected_items.append(
                (w, p, round(fraction, 2))
            )

            break

    return total_profit, selected_items


# ---------------------------------------------------
# Gaussian Elimination
# ---------------------------------------------------
def gaussian_elimination(A, B):

    A = A.astype(float)

    B = B.astype(float)

    n = len(B)

    # Forward Elimination
    for i in range(n):

        for j in range(i + 1, n):

            ratio = A[j][i] / A[i][i]

            A[j] = A[j] - ratio * A[i]

            B[j] = B[j] - ratio * B[i]

    # Back Substitution
    X = np.zeros(n)

    X[n - 1] = B[n - 1] / A[n - 1][n - 1]

    for i in range(n - 2, -1, -1):

        X[i] = (

            B[i]

            - np.dot(
                A[i][i + 1:],
                X[i + 1:]
            )

        ) / A[i][i]

    return X


# ---------------------------------------------------
# Streamlit UI
# ---------------------------------------------------

st.title("Optimization Strategies")

option = st.sidebar.selectbox(

    "Select Algorithm",

    [

        "Fractional Knapsack",

        "Gaussian Elimination"

    ]

)


# ---------------------------------------------------
# Fractional Knapsack UI
# ---------------------------------------------------

if option == "Fractional Knapsack":

    st.header("Fractional Knapsack Problem")

    weights = [10, 20, 30]

    profits = [60, 100, 120]

    st.subheader("Items")

    st.write("Weights :", weights)

    st.write("Profits :", profits)

    capacity = st.number_input(

        "Enter Knapsack Capacity",

        min_value=1,

        value=50,

        step=1

    )

    if st.button("Compute"):

        profit, selected = fractional_knapsack(

            weights,

            profits,

            capacity

        )

        st.success(

            f"Maximum Profit = {profit:.2f}"

        )

        st.subheader("Selected Items")

        st.write(

            "(Weight, Profit, Fraction Taken)"

        )

        st.table(selected)


# ---------------------------------------------------
# Gaussian Elimination UI
# ---------------------------------------------------

else:

    st.header("Gaussian Elimination")

    A = np.array([

        [2, 1, -1],

        [-3, -1, 2],

        [-2, 1, 2]

    ])

    B = np.array([

        8,

        -11,

        -3

    ])

    st.subheader("Coefficient Matrix (A)")

    st.table(A)

    st.subheader("Constant Vector (B)")

    st.table(B.reshape(-1, 1))

    if st.button("Solve"):

        solution = gaussian_elimination(

            A.copy(),

            B.copy()

        )

        st.success(

            f"Solution = {solution}"

        )

        st.write(

            f"x = {solution[0]:.2f}"

        )

        st.write(

            f"y = {solution[1]:.2f}"

        )

        st.write(

            f"z = {solution[2]:.2f}"

        )