import streamlit as st
import numpy as np


# ----------------------------------------
# Fractional Knapsack Algorithm
# ----------------------------------------

def fractional_knapsack(weights, profits, capacity):

    n = len(weights)

    items = []

    for i in range(n):

        ratio = profits[i] / weights[i]

        items.append((ratio,
                      weights[i],
                      profits[i]))

    # Sort items by ratio in descending order
    items.sort(reverse=True)

    total_profit = 0

    selected = []

    for ratio, w, p in items:

        # Take complete item
        if capacity >= w:

            capacity -= w

            total_profit += p

            selected.append({
                "Weight": w,
                "Profit": p,
                "Fraction": 1
            })

        # Take fractional item
        else:

            fraction = capacity / w

            total_profit += p * fraction

            selected.append({
                "Weight": w,
                "Profit": p,
                "Fraction": round(fraction, 2)
            })

            break

    return total_profit, selected


# ----------------------------------------
# Gaussian Elimination
# ----------------------------------------

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


# ----------------------------------------
# Streamlit UI
# ----------------------------------------

st.set_page_config(

    page_title="Optimization Strategies",

    layout="wide"

)

st.title("Optimization Strategies")

st.markdown(

    "### Fractional Knapsack and Gaussian Elimination"

)


option = st.sidebar.selectbox(

    "Select Algorithm",

    [

        "Fractional Knapsack",

        "Gaussian Elimination"

    ]

)


# ----------------------------------------
# Fractional Knapsack UI
# ----------------------------------------

if option == "Fractional Knapsack":

    st.header("Fractional Knapsack Problem")

    st.write(

        "Enter weights and profits separated by commas."

    )

    weights_input = st.text_input(

        "Weights",

        "10,20,30"

    )

    profits_input = st.text_input(

        "Profits",

        "60,100,120"

    )

    capacity = st.number_input(

        "Capacity",

        min_value=1,

        value=50

    )

    if st.button("Compute Maximum Profit"):

        weights = list(

            map(

                int,

                weights_input.split(",")

            )

        )

        profits = list(

            map(

                int,

                profits_input.split(",")

            )

        )

        profit, selected = fractional_knapsack(

            weights,

            profits,

            capacity

        )

        st.success(

            f"Maximum Profit = {profit:.2f}"

        )

        st.subheader(

            "Selected Items"

        )

        st.table(selected)


# ----------------------------------------
# Gaussian Elimination UI
# ----------------------------------------

else:

    st.header("Gaussian Elimination")

    st.write(

        "Solve the system of linear equations AX = B"

    )

    st.markdown(

        "Default Example Matrix"

    )

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

    st.write("Matrix A")

    st.dataframe(A)

    st.write("Vector B")

    st.dataframe(B)

    if st.button("Solve Equations"):

        X = gaussian_elimination(

            A.copy(),

            B.copy()

        )

        st.success(

            "Solution Vector"

        )

        st.write(X)

        st.latex(

            r"X = "

            + str(np.round(X, 2))

        )


# ----------------------------------------
# Footer
# ----------------------------------------

st.markdown("---")

st.markdown(

    "Developed using Python and Streamlit"

)