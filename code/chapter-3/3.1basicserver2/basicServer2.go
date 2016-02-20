package main

import (
	"log"
	"net/http"
)

func main() {
	PORT := ":8080"
	log.Print("Running server on " + PORT)
	http.HandleFunc("/", CompleteTaskFunc)
	log.Fatal(http.ListenAndServe(PORT, nil))
}

func CompleteTaskFunc(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte(r.URL.Path))
}
