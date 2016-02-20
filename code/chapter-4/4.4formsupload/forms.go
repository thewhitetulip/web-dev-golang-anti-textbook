package main

import (
	"crypto/md5"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"strconv"
	"text/template"
	"time"

)

var templates *template.Template

type Context struct {
	Navigation string
	Categories []string
    CSRF string
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
	if r.Method == "POST" { // Will work only for POST requests, will redirect to home
		r.ParseForm()
		file, handler, err := r.FormFile("uploadfile")
		if err != nil && handler != nil {
			//Case executed when file is uploaded and yet an error occurs
			log.Println(err)
			http.Redirect(w, r, "/", http.StatusInternalServerError)
		}

		taskPriority, priorityErr := strconv.Atoi(r.FormValue("priority"))

		if priorityErr != nil {
			log.Print(priorityErr)

			http.Redirect(w, r, "/", http.StatusInternalServerError)
		}
		priorityList := []int{1, 2, 3}
		found := false
		for _, priority := range priorityList {
			if taskPriority == priority {
				found = true
			}
		}
		//If someone gives us incorrect priority number, we give the priority
		//to that task as 1 i.e. Low
		if !found {
			taskPriority = 1
		}

		category := r.FormValue("category") // either r.Form.Get or r.FormValue
		title := template.HTMLEscapeString(r.Form.Get("title"))
		content := template.HTMLEscapeString(r.Form.Get("content"))
		formToken := template.HTMLEscapeString(r.Form.Get("csrftoken"))

		cookie, _ := r.Cookie("csrftoken")
        
		if formToken == cookie.Value {
			if handler != nil {
				// this will be executed whenever a file is uploaded
				r.ParseMultipartForm(32 << 20) //defined maximum size of file
				defer file.Close()
				randomFileName := md5.New()
				io.WriteString(randomFileName, strconv.FormatInt(time.Now().Unix(), 10))
				io.WriteString(randomFileName, handler.Filename)
				token := fmt.Sprintf("%x", randomFileName.Sum(nil))
				f, err := os.OpenFile(token, os.O_WRONLY|os.O_CREATE, 0666)
				if err != nil {
					log.Println(err)
					return
				}
				defer f.Close()
				io.Copy(f, file)
                
                log.Println(title)
                log.Println(category)
                log.Println(content)
                log.Println("File " + handler.Filename + " is now " + token)
                http.Redirect(w, r, "/", http.StatusFound)
                
                //we are just printing stuff here, we can do stuff you want to do
			}
		} else {
			log.Println("CSRF mismatch ", formToken , cookie.Value)
			http.Redirect(w, r, "/", http.StatusInternalServerError)
		}

	} else {
		http.Redirect(w, r, "/", http.StatusFound)
	}
}

// HomePageFunc will
func HomePageFunc(w http.ResponseWriter, r *http.Request) {
	homeTemplate := templates.Lookup("home.html")
    expiration := time.Now().Add(365 * 24 * time.Hour)
    cookie := http.Cookie{Name: "csrftoken", Value: "abcd", Expires: expiration}
    http.SetCookie(w, &cookie)
	//we will get the values for context from db, we are mocking the values without using a db yet
	context := Context{Navigation: "Pending", Categories: []string{"TaskApp", "writing", "reading"}, CSRF:"abcd"}
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
