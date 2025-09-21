package database

import (
	"database/sql"
	"echo-wall/models"
)

func CreateMessage(db *sql.DB, message models.MessageCreate) (int, error) {
	var id int
	row := db.QueryRow("INSERT INTO messages(username, body) VALUES ($1, $2) RETURNING id", message.Username, message.Body)
	err := row.Scan(&id)
	if err != nil {
		return id, err
	}

	return id, nil
}

func GetMessage(db *sql.DB, messageId int) (models.Message, error) {
	var message models.Message
	row := db.QueryRow("SELECT id, username, body, created_at FROM messages WHERE id = $1", messageId)
	err := row.Scan(&message.Id, &message.Username, &message.Body, &message.CreatedAt)
	if err != nil {
		return message, err
	}

	return message, nil
}

func GetMessages(db *sql.DB, limit int, offset int) ([]models.Message, error) {
	var messages []models.Message
	rows, err := db.Query("SELECT id, username, body, created_at FROM messages ORDER BY created_at DESC LIMIT $1 OFFSET $2", limit, offset)
	if err != nil {
		return messages, err
	}
	defer rows.Close()

	for rows.Next() {
		var message models.Message
		err = rows.Scan(&message.Id, &message.Username, &message.Body, &message.CreatedAt)
		if err != nil {
			return messages, err
		}

		messages = append(messages, message)
	}

	return messages, nil
}

func DeleteMessage(db *sql.DB, messageId int) (int, error) {
	var id int
	row := db.QueryRow("DELETE FROM messages WHERE id = $1", messageId)
	err := row.Scan(&id)
	if err != nil {
		return id, err
	}

	return id, nil
}
