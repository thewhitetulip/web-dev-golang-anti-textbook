package main

import (
	"log"
	"net/http"
)

func main() {
	PORT := ":8080"
	log.Fatal(http.ListenAndServe(PORT, nil))
}
