package main

import "fmt"

type Human struct {
	name   string
	age    int
	weight int
}

type Student struct {
	Human // embedded field, it means Student struct
	// includes all fields that Human has.
	specialty string
}

func main() {
	// initialize a student
	mark := Student{Human{"Mark", 25, 120}, "Computer Science"}

	// access fields
	fmt.Println("His name is ", mark.name)
	fmt.Println("His age is ", mark.age)
	fmt.Println("His weight is ", mark.weight)
	fmt.Println("His specialty is ", mark.specialty)
	// modify notes
	mark.specialty = "AI"
	fmt.Println("Mark changed his specialty")
	fmt.Println("His specialty is ", mark.specialty)
	// modify age
	fmt.Println("Mark become old")
	mark.age = 46
	fmt.Println("His age is", mark.age)
	// modify weight
	fmt.Println("Mark is not an athlete anymore")
	mark.weight += 60
	fmt.Println("His weight is", mark.weight)
}
