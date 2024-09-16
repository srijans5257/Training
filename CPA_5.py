inp2=input("Enter Dictionary: ")
dict=inp2.split(" ")
dict2=set()
for i in range(len(dict)):
    dict2.add(dict[i].lower())
inp=input("Enter the string: ").lower()
dp = []
for i in range(len(inp)+1):
    dp.append(False)
dp[0]=True
for i in range(1,len(inp)+1):
    for j in range(i):
        if dp[j] and inp[j:i] in dict2:
            dp[i]=True
            break
if dp[len(inp)]==True:
    print("1")
else:
    print("0")

