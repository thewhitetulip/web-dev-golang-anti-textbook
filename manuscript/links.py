books = open("Book.txt","r")
lines = books.readlines()
lines = [line.strip("\n") for line in lines]

for i in range(len(lines)):
	i += 1
	cur = i
	curfile = open(lines[i], "a")
	prev = i - 1
	if i != len(lines) -1 :
		nxt = i+1
	curfile.write("\n## Links\n")
	curfile.write("-[Previous section]("+lines[prev]+")\n")
	if i != len(lines) - 1:
		curfile.write("-[Next section]("+lines[nxt]+")\n")
