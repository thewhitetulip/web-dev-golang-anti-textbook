package main

import (
	"database/sql"
	"log"
	"net/http"
	"os"
	"text/template"
	"time"

	_ "github.com/mattn/go-sqlite3" //we want to use sqlite natively
	md "github.com/shurcooL/github_flavored_markdown"
)

var database Database
var err error
var templates *template.Template

func main() {
	PORT := ":8080"
	templates = PopulateTemplates()

	http.HandleFunc("/", HomePageFunc) // order is intentional, most generic should be at the bottom
	log.Println("running server on " + PORT)
	log.Fatal(http.ListenAndServe(PORT, nil))

}

// HomePageFunc will
func HomePageFunc(w http.ResponseWriter, r *http.Request) {
	homeTemplate := templates.Lookup("home.html")
	//we will get the values for context from db, we are mocking the values without using a db yet
	context, err := GetTasks("pending", "")
	if err != nil {
		log.Println("error getting tasks")
	}
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

//Database encapsulates database
type Database struct {
	db *sql.DB
}

func (db Database) begin() (tx *sql.Tx) {
	tx, err := db.db.Begin()
	if err != nil {
		log.Println(err)
		return nil
	}
	return tx
}

func (db Database) prepare(q string) (stmt *sql.Stmt) {
	stmt, err := db.db.Prepare(q)
	if err != nil {
		log.Println(err)
		return nil
	}
	return stmt
}

func (db Database) query(q string, args ...interface{}) (rows *sql.Rows) {
	rows, err := db.db.Query(q, args...)
	if err != nil {
		log.Println(err)
		return nil
	}
	return rows
}

func init() {
	database.db, err = sql.Open("sqlite3", "./tasks.db")
	if err != nil {
		log.Fatal(err)
	}
}

//Close function closes this database connection
func Close() {
	database.db.Close()
}

//GetTasks retrieves all the tasks depending on the
//status pending or trashed or completed
func GetTasks(status, category string) (Context, error) {
	var tasks []Task
	var task Task
	var TaskCreated time.Time
	var context Context
	var getTasksql string
	var rows *sql.Rows

	if err != nil {
		return context, err
	}

	basicSQL := "select id, title, content, created_date, priority from task t"
	if status == "pending" && category == "" {
		getTasksql = basicSQL + " where finish_date is null and is_deleted='N' order by priority desc, created_date asc"
	} else if status == "deleted" {
		getTasksql = basicSQL + " where is_deleted='Y' order by priority desc, created_date asc"
	} else if status == "completed" {
		getTasksql = basicSQL + " where finish_date is not null order by priority desc, created_date asc"
	}

	if category != "" {
		status = category
		getTasksql = "select t.id, title, content, created_date, priority from task t, category c where c.id = t.cat_id and name = ?  and  t.is_deleted!='Y' and t.finish_date is null  order by priority desc, created_date asc, finish_date asc"
		rows, err = database.db.Query(getTasksql, category)
		if err != nil {
			log.Println("something went wrong while getting query")
		}
	} else {
		rows = database.query(getTasksql)
	}
	defer rows.Close()
	for rows.Next() {
		task = Task{}
		err := rows.Scan(&task.Id, &task.Title, &task.Content, &TaskCreated, &task.Priority)
		task.Content = string(md.Markdown([]byte(task.Content)))
		// TaskContent = strings.Replace(TaskContent, "\n", "<br>", -1)
		if err != nil {
			log.Println(err)
		}

		TaskCreated = TaskCreated.Local()
		task.Created = TaskCreated.Format("Jan 01 2006")

		tasks = append(tasks, task)
	}
	context = Context{Tasks: tasks, Navigation: status}
	return context, nil
}

type Task struct {
	Id       int
	Title    string
	Content  string
	Created  string
	Priority string
	Category string
	Referer  string
	Comments []Comment
}

//Comment is the struct used to populate comments per tasks
type Comment struct {
	ID      int
	Content string
	Created string
}

//Context is the struct passed to templates
type Context struct {
	Tasks      []Task
	Navigation string
	Search     string
	Message    string
	CSRFToken  string
	Categories []CategoryCount
	Referer    string
}

//CategoryCount is the struct used to populate the sidebar
//which contains the category name and the count of the tasks
//in each category
type CategoryCount struct {
	Name  string
	Count int
}
