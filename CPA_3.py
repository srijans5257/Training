def convert(list):
    return tuple(list)
def subset(list,n,i,output,result):
    if i==n:
        result.append(output[:])
        return
    output.append(list[i])
    subset(list,n,i+1,output,result)
    output.pop()
    subset(list,n,i+1,output,result)
    return result
inp=input("Enter the array: ")
list=inp.split(" ")
n=len(list)
i=0
output=[]
result=[]
result=subset(list,n,i,output,result)
unique=set()
for i in result:
    unique.add(convert(i))
new_output=sorted(unique)
print(new_output)