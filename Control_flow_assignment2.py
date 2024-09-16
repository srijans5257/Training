Total=20
Max=5
pile=Total
i=1
while pile!=0:
    if i%2==1:
        valid1=False
        while valid1==False:
            inp1=int(input("Enter a valid number-Player1: "))
            if inp1<=Max and inp1>=1 and inp1<=pile:
                valid1=True
                pile-=inp1
                print(f'{pile} stones left!')
                i+=1
    else: 
        valid2=False
        while valid2==False:
            inp2=int(input("Enter a valid number-Player2: "))
            if inp2<=Max and inp2>=1 and inp2<=pile:
                valid2=True
                pile-=inp2
                print(f'{pile} stones left!')
                i+=1
if i%2==1:
    print("Player 2 wins")
else:
    print("Player 1 wins")


        