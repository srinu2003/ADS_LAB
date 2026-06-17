import streamlit as st
import time

# -------------------------
# Rabin Karp
# -------------------------

def rabin_karp(text, pattern):

    n=len(text)

    m=len(pattern)

    d=256

    q=101

    h=pow(d,m-1)%q

    p=0

    t=0

    result=[]

    for i in range(m):

        p=(d*p+ord(pattern[i]))%q

        t=(d*t+ord(text[i]))%q

    for i in range(n-m+1):

        if p==t:

            if text[i:i+m]==pattern:

                result.append(i)

        if i<n-m:

            t=(d*(t-ord(text[i])*h)
               +ord(text[i+m]))%q

            if t<0:

                t=t+q

    return result


# -------------------------
# KMP
# -------------------------

def compute_lps(pattern):

    m=len(pattern)

    lps=[0]*m

    length=0

    i=1

    while i<m:

        if pattern[i]==pattern[length]:

            length+=1

            lps[i]=length

            i+=1

        else:

            if length!=0:

                length=lps[length-1]

            else:

                lps[i]=0

                i+=1

    return lps


def kmp(text,pattern):

    n=len(text)

    m=len(pattern)

    lps=compute_lps(pattern)

    i=0

    j=0

    result=[]

    while i<n:

        if text[i]==pattern[j]:

            i+=1

            j+=1

        if j==m:

            result.append(i-j)

            j=lps[j-1]

        elif i<n and text[i]!=pattern[j]:

            if j!=0:

                j=lps[j-1]

            else:

                i+=1

    return result


# -------------------------
# Horspool
# -------------------------

def shift_table(pattern):

    m=len(pattern)

    table={}

    for i in range(m-1):

        table[pattern[i]]=m-1-i

    return table


def horspool(text,pattern):

    n=len(text)

    m=len(pattern)

    table=shift_table(pattern)

    i=m-1

    result=[]

    while i<n:

        k=0

        while k<m and \
        pattern[m-1-k]==text[i-k]:

            k+=1

        if k==m:

            result.append(i-m+1)

        shift=table.get(text[i],m)

        i+=shift

    return result


# -------------------------
# Streamlit GUI
# -------------------------

st.title("String Matching Algorithms")

algorithm=st.sidebar.selectbox(

"Select Algorithm",

["Rabin-Karp",

"KMP",

"Horspool"]

)


text=st.text_area(

"Enter Text",

"ABABDABACDABABCABAB"

)

pattern=st.text_input(

"Enter Pattern",

"ABAB"

)


if st.button("Search"):

    start=time.time()

    if algorithm=="Rabin-Karp":

        result=rabin_karp(

        text,

        pattern)

    elif algorithm=="KMP":

        result=kmp(

        text,

        pattern)

    else:

        result=horspool(

        text,

        pattern)

    end=time.time()

    st.success(

    f"Pattern Found at {result}"

    )

    st.write(

    "Execution Time:",

    round(end-start,6),

    "seconds"

    )
