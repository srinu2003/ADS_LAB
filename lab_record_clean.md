## Experiment-1

Experiment: Implement assignment problem using Brute Force method

AIM: To Implement assignment problem using Brute Force Method

**Description:**
The assignment problem is a standard optimization problem where a number of tasks must be assigned to an equal number of agents in a one-to-one manner. The goal is to minimize the total cost of assignment. The brute-force approach finds the solution by generating all possible permutations of task assignments (N!) and calculating the cost of each permutation to determine the permutation that yields the minimum total cost.

**Program:**

**OUTPUT:-**

**Conclusion:**
The assignment problem was successfully implemented and evaluated using the brute-force approach. While simple to implement and guaranteed to find the global optimum, its time complexity of O(N!) makes it inefficient for large values of N.

## Experiment-2

AIM: To perform multiplication of long integers using the Karatsuba divide and conquer method.

**Description:**
The Karatsuba algorithm is an efficient procedure for multiplying two large integers. Instead of the classical O(N^2) multiplication method, it utilizes a divide-and-conquer strategy to split the N-digit numbers into high and low halves. By performing only three recursive multiplications instead of four, it reduces the computational complexity to approximately O(N^1.585).

**Program:**

Perform multiplication of long integers using divide and conquer method

**OUTPUT:-**

**Conclusion:**
The Karatsuba multiplication algorithm was successfully implemented. The algorithm demonstrates the power of the divide-and-conquer paradigm in reducing the multiplication complexity of multi-digit integers.

## Experiment-3

AIM: To implement a solution for the fractional knapsack problem using the Greedy method.

**Description:**
In the fractional knapsack problem, the objective is to choose items with given weights and values to maximize the total value in a knapsack of limited capacity, where fractions of items are allowed to be selected. The greedy method solves this by sorting the items in descending order of their value-to-weight ratio. Items are added greedily: complete items are taken as long as the knapsack has sufficient capacity, and a fraction of the next item is taken to completely fill the remaining capacity.

**Program:**

Implement a solution for the knapsack problem using the Greedy method.

**OUTPUT:-**

**Conclusion:**
The fractional knapsack problem was successfully solved using the greedy technique. Sorting items by value-to-weight ratio produces an optimal solution in O(N log N) time complexity.

## Experiment-4

AIM: To solve a system of linear equations using the Gaussian elimination method.

**Description:**
Gaussian elimination is an algorithm in linear algebra for solving systems of linear equations. It operates on the augmented matrix of coefficients and constant terms. Through a sequence of elementary row operations, it transforms the matrix into row echelon form (upper triangular form), from which back-substitution is applied to solve for the unknown variables. It has a time complexity of O(N^3).

**Program:**

Implement Gaussian elimination method.

**OUTPUT:-**

**Conclusion:**
Systems of linear equations were successfully solved using the Gaussian elimination algorithm.

## Experiment-5

AIM: To factor a square matrix using the LU decomposition method.

**Description:**
LU decomposition factors a square matrix A into the product of a lower triangular matrix L and an upper triangular matrix U such that A = LU. This factorization simplifies solving multiple systems of linear equations with the same coefficient matrix A but different constant vectors, as well as finding matrix inverses and determinants.

**Program:**

Implement LU decomposition.

**OUTPUT:-**

**Conclusion:**
Matrix factorization was successfully achieved using the LU decomposition algorithm, producing correct lower and upper triangular matrices.

## Experiment-6

AIM: To implement Warshall's algorithm for finding the transitive closure of a directed graph.

**Description:**
Warshall's algorithm is an efficient method to compute the transitive closure of a directed graph represented by an adjacency matrix. It determines the reachability between all pairs of vertices by testing paths through intermediate vertices, running with a time complexity of O(N^3).

**Program:**

Implement Warshall algorithm

**OUTPUT:-**

**Conclusion:**
The transitive closure of a directed graph was successfully calculated using Warshall's algorithm.

## Experiment-7

AIM: To implement the Rabin-Karp string matching algorithm.

**Description:**
The Rabin-Karp algorithm is a string-searching algorithm that uses hashing to find any one of a set of pattern strings in a text. By utilizing a rolling hash function to quickly compute hash values of substrings of the text and comparing them against the pattern hash, it achieves an average-case search time of O(N + M).

**Program:**

Implement the Rabin Karp algorithm.

**OUTPUT:-**

**Conclusion:**
String pattern matching was successfully implemented using the Rabin-Karp algorithm.

## Experiment-8

AIM: To implement the Knuth-Morris-Pratt (KMP) string matching algorithm.

**Description:**
The KMP string matching algorithm searches for occurrences of a pattern within a text by utilizing the observation that when a mismatch occurs, the pattern itself contains sufficient information to determine where the next match could begin. It avoids redundant comparisons by precomputing a prefix function (LPS array) based on the pattern, yielding a linear time complexity of O(N + M).

**Program:**

Implement the KMP algorithm.

**OUTPUT:-**

**Conclusion:**
The Knuth-Morris-Pratt algorithm was successfully implemented, demonstrating linear time text search.

## Experiment-9

AIM: To implement the Heap Sort algorithm.

**Description:**
Heap Sort is an in-place, comparison-based sorting algorithm that uses a binary heap data structure to sort elements. It builds a max-heap from the input array, then repeatedly extracts the maximum element and places it at the end of the sorted array, heapifying the remaining structure. It guarantees O(N log N) time complexity in the best, worst, and average cases.

**Program:**

Implement Harspool algorithm

**OUTPUT:-**

**Conclusion:**
The Heap Sort algorithm was successfully implemented, demonstrating O(N log N) sorting performance.

## Experiment-10

AIM: To implement a solution for the maximum flow problem.

**Description:**
The maximum flow problem involves finding the feasible flow through a single-source, single-sink flow network that is maximum. The Ford-Fulkerson algorithm solves this by repeatedly finding augmenting paths from source to sink in the residual graph using breadth-first search (BFS, also known as Edmonds-Karp algorithm) and increasing the flow along these paths until no more paths can be found.

**Program:**

Implement max-flow problem

**OUTPUT:-**

**Conclusion:**
The maximum flow problem was successfully solved using the Ford-Fulkerson algorithm.

## Additional Experiment

## MICRO PROJECT
