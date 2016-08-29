package main

import "fmt"

type Human struct {
	name  string
	age   int
	phone string // Human has phone field
}

type Employee struct {
	Human     // embedded field Human
	specialty string
	phone     string // phone in employee
}

func main() {
	Bob := Employee{Human{"Bob", 34, "777-444-XXXX"},
		"Designer", "333-222"}
	fmt.Println("Bob's work phone is:", Bob.phone)
	// access phone field in Human
	fmt.Println("Bob's personal phone is:", Bob.Human.phone)
}
