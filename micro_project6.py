import streamlit as st
import pandas as pd
import time


# ==================================================
# Rabin-Karp Algorithm
# ==================================================

def rabin_karp(text, pattern):

    if len(pattern) == 0:
        return -1

    if len(pattern) > len(text):
        return -1

    d = 256
    q = 101

    m = len(pattern)
    n = len(text)

    h_pattern = 0
    h_text = 0

    h = 1

    for i in range(m - 1):
        h = (h * d) % q

    for i in range(m):

        h_pattern = (

            d * h_pattern +

            ord(pattern[i])

        ) % q

        h_text = (

            d * h_text +

            ord(text[i])

        ) % q

    for i in range(n - m + 1):

        if h_pattern == h_text:

            if text[i:i + m] == pattern:

                return i

        if i < n - m:

            h_text = (

                d *

                (

                    h_text -

                    ord(text[i]) * h

                )

                +

                ord(text[i + m])

            ) % q

            if h_text < 0:

                h_text += q

    return -1


# ==================================================
# KMP Algorithm
# ==================================================

def compute_lps(pattern):

    m = len(pattern)

    lps = [0] * m

    length = 0

    i = 1

    while i < m:

        if pattern[i] == pattern[length]:

            length += 1

            lps[i] = length

            i += 1

        else:

            if length != 0:

                length = lps[length - 1]

            else:

                lps[i] = 0

                i += 1

    return lps


def kmp_search(text, pattern):

    if len(pattern) == 0:

        return -1

    if len(pattern) > len(text):

        return -1

    lps = compute_lps(pattern)

    i = 0

    j = 0

    n = len(text)

    m = len(pattern)

    while i < n:

        if text[i] == pattern[j]:

            i += 1

            j += 1

        if j == m:

            return i - j

        elif i < n and text[i] != pattern[j]:

            if j != 0:

                j = lps[j - 1]

            else:

                i += 1

    return -1


# ==================================================
# Horspool Algorithm
# ==================================================

def shift_table(pattern):

    m = len(pattern)

    table = {}

    for i in range(m - 1):

        table[pattern[i]] = m - 1 - i

    return table


def horspool(text, pattern):

    if len(pattern) == 0:

        return -1

    if len(pattern) > len(text):

        return -1

    m = len(pattern)

    n = len(text)

    table = shift_table(pattern)

    i = m - 1

    while i < n:

        k = 0

        while (

                k < m

                and

                pattern[m - 1 - k]

                ==

                text[i - k]

        ):

            k += 1

        if k == m:

            return i - m + 1

        else:

            c = text[i]

            i += table.get(c, m)

    return -1


# ==================================================
# Search Function
# ==================================================

def search_articles(df, pattern, algorithm):

    results = []

    start_time = time.time()

    for index, row in df.iterrows():

        text = str(row["text"])

        try:

            if algorithm == "Rabin-Karp":

                pos = rabin_karp(

                    text.lower(),

                    pattern.lower()

                )

            elif algorithm == "KMP":

                pos = kmp_search(

                    text.lower(),

                    pattern.lower()

                )

            else:

                pos = horspool(

                    text.lower(),

                    pattern.lower()

                )

            if pos != -1:

                results.append(

                    {

                        "Title":

                            row["title"],

                        "Match Position":

                            pos,

                        "Article":

                            text[:250] + "..."

                    }

                )

        except Exception:

            continue

    end_time = time.time()

    elapsed_time = end_time - start_time

    return results, elapsed_time


# ==================================================
# Streamlit UI
# ==================================================

st.set_page_config(

    page_title="Text Mining",

    layout="wide"

)

st.title(

    "Text Mining using Advanced String Matching Algorithms"

)

st.markdown("""

### Algorithms Used

- Rabin-Karp Algorithm
- Knuth-Morris-Pratt (KMP)
- Horspool Algorithm

### Dataset Format

CSV file with columns:

- title
- text

""")

uploaded_file = st.file_uploader(

    "Upload News Dataset (CSV)",

    type=["csv"]

)

if uploaded_file is not None:

    try:

        df = pd.read_csv(uploaded_file)

        st.success(

            "Dataset Loaded Successfully"

        )

        st.subheader(

            "Dataset Preview"

        )

        st.dataframe(

            df.head(),

            use_container_width=True

        )

        if "title" not in df.columns or "text" not in df.columns:

            st.error(

                "CSV must contain 'title' and 'text' columns."

            )

        else:

            algorithm = st.selectbox(

                "Select Algorithm",

                [

                    "Rabin-Karp",

                    "KMP",

                    "Horspool"

                ]

            )

            pattern = st.text_input(

                "Enter Search Keyword",

                "India"

            )

            if st.button(

                    "Search"

            ):

                results, exec_time = search_articles(

                    df,

                    pattern,

                    algorithm

                )

                st.success(

                    f"{len(results)} Articles Found"

                )

                st.write(

                    f"Execution Time: {exec_time:.6f} seconds"

                )

                if len(results) > 0:

                    result_df = pd.DataFrame(

                        results

                    )

                    st.subheader(

                        "Search Results"

                    )

                    st.dataframe(

                        result_df,

                        use_container_width=True

                    )

                else:

                    st.warning(

                        "No Match Found"

                    )

    except Exception as e:

        st.error(

            f"Error reading file: {e}"

        )


# ==================================================
# Footer
# ==================================================

st.markdown("---")

st.markdown(

    "Developed using Python, Streamlit and Advanced String Matching Algorithms"

)