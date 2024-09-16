inp=input("Enter list: ")
lst=inp.split(" ")
for i in range(len(lst)):
    lst[i]=int(lst[i])
stack=[]
stack_alt=[]
stack.append(lst[0])
for i in range(1,len(lst)):
    j=0
    while 1:
        if len(stack)==0:
            stack.append(lst[i])
            while len(stack_alt)!=0:
                stack.append(stack_alt[len(stack_alt)-1])
                stack_alt.pop()
            break
        if stack[len(stack)-1]<=lst[i]:
            stack.append(lst[i])
            while len(stack_alt)!=0:
                stack.append(stack_alt[len(stack_alt)-1])
                stack_alt.pop()
            break
        else:
            stack_alt.append(stack[len(stack)-1])
            stack.pop()
print(stack)
            