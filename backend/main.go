package main

import (
	"database/sql"
	"echo-wall/rate_limiter"
	"echo-wall/services"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
	"log"
	"net/http"
	"os"
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

func main() {
	db := openDB()
	defer db.Close()
	Migrate(db)

	http.Handle("/messages", rate_limiter.RateLimit(services.Messages(db)))
	http.Handle("/message", rate_limiter.RateLimit(services.Message(db)))
	log.Println("listening on :8080...")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
