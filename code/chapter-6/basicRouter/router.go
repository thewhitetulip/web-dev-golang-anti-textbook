package main

import (
	"fmt"
	"github.com/julienschmidt/httprouter"
	"log"
	"net/http"
)

func Index(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	fmt.Fprint(w, "Welcome!\n")
}

func Hello(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	fmt.Fprintf(w, "hello, %s!\n", ps.ByName("name"))
}

func main() {
	router := httprouter.New()        // creates a new router
	router.GET("/", Index)            // will direct the GET / request to the Index function
	router.GET("/hello/:name", Hello) // will redirect the GET /name to Hello, stores the name of the parameter
	// in the a variable of httprouter.Params
	log.Println("running on :8080")
	log.Fatal(http.ListenAndServe(":8080", router))
}
