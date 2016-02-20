package main

import (
	"log"
	"net/http"
	"os"
	"text/template"
)

var templates *template.Template

type Context struct {
	Navigation string
	Categories []string
}

func main() {
	PORT := ":8080"
	templates = PopulateTemplates()
	http.HandleFunc("/add/", AddTaskFunc)
	http.HandleFunc("/", HomePageFunc) // order is intentional, most generic should be at the bottom
	log.Println("running server on " + PORT)
	log.Fatal(http.ListenAndServe(PORT, nil))
}

func AddTaskFunc(w http.ResponseWriter, r *http.Request) {
	if r.Method == "POST" {
		log.Println("inside post")
		r.ParseForm()                    // first you have to parse the form
		log.Println(r.Form.Get("title")) //fetch the contents based on the _name_ field
		log.Println(r.Form.Get("content"))
		log.Println(r.Form.Get("category"))
		log.Println(r.Form.Get("priority"))
        /// Here you can call your database entry method
        /// which will insert your tasks inside your db
		http.Redirect(w, r, "/", http.StatusFound)
	} else {
		http.Redirect(w, r, "/", http.StatusFound)
	}
}

// HomePageFunc will 
func HomePageFunc(w http.ResponseWriter, r *http.Request) {
	homeTemplate := templates.Lookup("home.html")
	//we will get the values for context from db, we are mocking the values without using a db yet
	context := Context{Navigation: "Pending", Categories: []string{"TaskApp", "writing", "reading"}}
	homeTemplate.Execute(w, context) // nil is the context which we send with the template
}

//PopulateTemplates is used to parse all templates present in
//the templates folder
func PopulateTemplates() *template.Template {
	templates, err := template.ParseGlob("*.html")

	if err != nil {
		log.Println(err)
		os.Exit(1) // no point in our webapp if templates aren't read
	}

	return templates
}
