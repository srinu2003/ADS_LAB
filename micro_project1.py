import streamlit as st
import itertools


# -------------------------------
# Assignment Problem (Brute Force)
# -------------------------------
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


# -------------------------------
# Karatsuba Multiplication
# -------------------------------
def karatsuba(x, y):

    # Base Case
    if x < 10 or y < 10:
        return x * y

    # Number of digits to split
    m = min(len(str(x)), len(str(y))) // 2

    # Split the numbers
    high_x, low_x = divmod(x, 10 ** m)
    high_y, low_y = divmod(y, 10 ** m)

    # Recursive calls
    z0 = karatsuba(low_x, low_y)

    z1 = karatsuba(
        low_x + high_x,
        low_y + high_y
    )

    z2 = karatsuba(
        high_x,
        high_y
    )

    # Combine results
    return (
        z2 * (10 ** (2 * m))
        + (z1 - z2 - z0) * (10 ** m)
        + z0
    )


# -------------------------------
# Streamlit UI
# -------------------------------

st.title("Brute Force and Divide-and-Conquer Algorithms")

choice = st.sidebar.selectbox(
    "Select Algorithm",
    [
        "Assignment Problem",
        "Karatsuba Multiplication"
    ]
)


# -------------------------------
# Karatsuba UI
# -------------------------------
if choice == "Karatsuba Multiplication":

    st.header("Karatsuba Multiplication")

    x = st.number_input(
        "Enter First Number",
        min_value=1,
        step=1
    )

    y = st.number_input(
        "Enter Second Number",
        min_value=1,
        step=1
    )

    if st.button("Multiply"):

        result = karatsuba(
            int(x),
            int(y)
        )

        st.success(f"Product = {result}")


# -------------------------------
# Assignment Problem UI
# -------------------------------
else:

    st.header("Assignment Problem using Brute Force")

    cost_matrix = [

        [9, 2, 7, 8],

        [6, 4, 3, 7],

        [5, 8, 1, 8],

        [7, 6, 9, 4]

    ]

    st.subheader("Cost Matrix")

    st.table(cost_matrix)

    if st.button("Find Optimal Assignment"):

        assignment, cost = assignment_bruteforce(
            cost_matrix
        )

        st.success("Optimal Assignment Found")

        st.write("Assignment:")

        for worker, task in enumerate(assignment):
            st.write(
                f"Worker {worker + 1} → Task {task + 1}"
            )

        st.write(f"Minimum Cost = {cost}")