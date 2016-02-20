package main
		import (
			_ "github.com/mattn/go-sqlite3" 
			"fmt"
		)
		
		var database   *sql.DB
		
		func init() {
			defer database.Close()
			database, err = sql.Open("sqlite3", "./tasks.db")
			if err != nil {
				fmt.Println(err)
			}
		}
		//intentional bug exists, fix it
		func main() {
			getTasksql = "select id, title, content, created_date from task
				where finish_date is null and is_deleted='N' order by created_date asc"
				
			rows, err := database.Query(getTasksql)
			if err != nil {
				fmt.Println(err)
			}
			defer rows.Close()
			for rows.Next() {
				err := rows.Scan(&TaskID, &TaskTitle, &TaskContent, &TaskCreated)
				TaskContent = strings.Replace(TaskContent, "\n", "<br>", -1)
				if err != nil {
					fmt.Println(err)
				}
				fmt.Println(TaskID, TaskTitle, TaskContent, TaskCreated)
			}
			err = rows.Err()
			if err != nil {
				log.Fatal(err)
			}
		}