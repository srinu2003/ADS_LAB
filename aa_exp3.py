def fractional_knapsack(weights, values, capacity):
    n = len(values)
    # Calculate value-to-weight ratio
    ratio = [(values[i] / weights[i], weights[i], values[i]) for i in range(n)]
    # Sort items in descending order of ratio
    ratio.sort(reverse=True, key=lambda x: x[0])
    total_value = 0
    for r, w, v in ratio:
        # If the whole item can be taken
        if capacity - w >= 0:
            capacity -= w
            total_value += v
        # Take only the fractional part
        else:
            total_value += v * (capacity / w)
            break
    return total_value
# Example
weights = [10, 20, 30]
values = [60, 100, 120]
capacity = 50
print("Maximum value:", fractional_knapsack(weights, values, capacity))
