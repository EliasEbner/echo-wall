package main

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

type User struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}

func openDB() *sql.DB {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Couldn't load .env file.")
	}
	conn := os.Getenv("DATABASE_URL")
	if conn == "" {
		log.Fatalf("Couldn't find connection string from .env file.")
	}
	db, err := sql.Open("postgres", conn)
	if err != nil {
		log.Fatalf("open: %v", err)
	}
	if err := db.Ping(); err != nil {
		log.Fatalf("ping: %v", err)
	}
	return db
}

func handleUsers(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			rows, err := db.Query("SELECT id, name FROM users ORDER BY id")
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			defer rows.Close()

			var users []User
			for rows.Next() {
				var u User
				if err := rows.Scan(&u.ID, &u.Name); err != nil {
					http.Error(w, err.Error(), http.StatusInternalServerError)
					return
				}
				users = append(users, u)
			}
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(users)

		case http.MethodPost:
			var u User
			if err := json.NewDecoder(r.Body).Decode(&u); err != nil {
				http.Error(w, "bad JSON", http.StatusBadRequest)
				return
			}
			if u.Name == "" {
				http.Error(w, "missing name", http.StatusBadRequest)
				return
			}
			err := db.QueryRow("INSERT INTO users(name) VALUES($1) RETURNING id", u.Name).Scan(&u.ID)
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusCreated)
			json.NewEncoder(w).Encode(u)

		default:
			http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		}
	}
}

// --------------------------------------------------
// 3. main = wire things together
// --------------------------------------------------
func main() {
	db := openDB()
	defer db.Close()
	Migrate(db)

	http.Handle("/users", handleUsers(db))
	log.Println("listening on :8080...")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
