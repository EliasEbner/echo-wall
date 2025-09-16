package main

import (
	"database/sql"
	"log"
)

func Migrate(db *sql.DB) {
	const migration = `
		CREATE TABLE IF NOT EXISTS messages (
			id SERIAL PRIMARY KEY,
			username VARCHAR(255) NOT NULL,
			body VARCHAR(2500) NOT NULL,
			created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
		);
	`
	if _, err := db.Exec(migration); err != nil {
		log.Fatalf("migrate: %v", err)
	}
}
