def longest_proper_prefix(s):
    maxi=-1
    for i in range(1,len(s)):
        if s[0:i]==s[len(s)-i:len(s)]:
            maxi=i
    if maxi==-1:
        return 0
    return maxi
inp=input("Enter a string: ")
print(longest_proper_prefix(inp))