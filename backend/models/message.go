package models

import "time"

type Message struct {
	Id        int       `db:"id" json:"id"`
	Username  string    `db:"username" json:"username"`
	Body      string    `db:"body" json:"body"`
	CreatedAt time.Time `db:"created_at" json:"created_at"`
}

type MessageCreate struct {
	Username string `db:"username" json:"username"`
	Body     string `db:"body" json:"body"`
}
