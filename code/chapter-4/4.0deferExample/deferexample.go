package main

import (
	"fmt"
	"os"
)

func main() {
	file, err := os.Open("file.dat")
	if err != nil {
		fmt.Println("File doesn't exist or you don't have read permission")
	}

	defer file.Close()
	inputReader := bufio.NewReader(file)
	//do something about inputReader
}
