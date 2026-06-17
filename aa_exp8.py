def kmp_search(text, pattern):

    # Function to compute LPS array
    def lps_array(pattern):

        lps = [0] * len(pattern)

        j = 0

        for i in range(1, len(pattern)):

            while j > 0 and pattern[i] != pattern[j]:

                j = lps[j - 1]

            if pattern[i] == pattern[j]:

                j += 1

                lps[i] = j

        return lps


    lps = lps_array(pattern)

    i = 0      # Index for text

    j = 0      # Index for pattern


    while i < len(text):

        if text[i] == pattern[j]:

            i += 1

            j += 1

            # Pattern found
            if j == len(pattern):

                return i - j


        else:

            if j > 0:

                j = lps[j - 1]

            else:

                i += 1


    return -1


# Example

text = "ABABDABACDABABCABAB"

pattern = "ABABCABB"

print("Pattern found at index:",
      kmp_search(text, pattern))