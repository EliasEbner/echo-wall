package main

import (
	"database/sql"
	"echo-wall/rate_limiter"
	"echo-wall/services"
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
	"golang.org/x/net/websocket"
)

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

func enableCORS(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// allow the origin your frontend is served from
		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")

		// common headers you usually need
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		// pre-flight request
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}

		next(w, r)
	}
}

func main() {
	db := openDB()
	defer db.Close()
	Migrate(db)

	http.Handle("/messages", rate_limiter.RateLimit(enableCORS(services.Messages(db))))
	http.Handle("/message", rate_limiter.RateLimit(enableCORS(services.Message(db))))
	http.Handle("/messages/subscribe", websocket.Handler(services.Echo(db)))
	log.Println("listening on :8080...")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
