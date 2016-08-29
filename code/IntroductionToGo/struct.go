package main

import "fmt"

// Product will denote a physical object
// which we will sell online to be rich
type Product struct {
	name          string
	itemID        int
	cost          float32
	isAvailable   bool
	inventoryLeft int
}

func main() {
	var goBook Product

	// initialization
	goBook.name, goBook.itemID, goBook.isAvailable, goBook.inventoryLeft = "Webapps in Go", 10025, true, 25

	// initialize two values by format "field:value"
	pythonBook := Product{itemID: 10026, name: "Learn Python", inventoryLeft: 0, isAvailable: false}

	// initialize two values with order
	rubyBook := Product{"Learn Ruby", 10043, 100, true, 12}

	if goBook.isAvailable {
		fmt.Printf("%d copies of %s are available\n",
			goBook.inventoryLeft, goBook.name)
	}

	if pythonBook.isAvailable {
		fmt.Printf("%d copies of %s are available\n",
			pythonBook.inventoryLeft, pythonBook.name)
	}

	if rubyBook.isAvailable {
		fmt.Printf("%d copies of %s are available\n",
			rubyBook.inventoryLeft, rubyBook.name)
	}

}
