def rabin_karp(text, pattern):
    d = 256          # Number of characters in the input alphabet
    q = 101          # A prime number
    m = len(pattern)
    n = len(text)
    h_pattern = 0    # Hash value for pattern
    h_text = 0       # Hash value for text
    h = 1            # Value of d^(m-1) % q

    # Compute h = pow(d, m-1) % q
    for i in range(m - 1):
        h = (h * d) % q

    # Calculate hash values for pattern and first window of text
    for i in range(m):
        h_pattern = (d * h_pattern + ord(pattern[i])) % q
        h_text = (d * h_text + ord(text[i])) % q

    # Slide the pattern over the text
    for i in range(n - m + 1):

        # Check if hash values match
        if h_pattern == h_text:

            # Check characters one by one
            if text[i:i + m] == pattern:

                return i

        # Compute hash value for next window
        if i < n - m:
            h_text = (
                d * (h_text - ord(text[i]) * h)
                + ord(text[i + m])
            ) % q

            # Ensure positive hash value
            if h_text < 0:
                h_text += q

    return -1

# Example
text = "ABABDABACDABABCABAB"

pattern = "ABABCABAB"

print("Pattern found at index:",
      rabin_karp(text, pattern))
