package services

import (
	"database/sql"
	"echo-wall/models"
	"encoding/json"
	"net/http"
	"strconv"
	"strings"
)

func Messages(db *sql.DB) http.HandlerFunc {
	return func(writer http.ResponseWriter, request *http.Request) {
		switch request.Method {
		// GET /messages?limit={limit}&offset={offset}
		case http.MethodGet:
			// parse limit from query params
			limitStr := request.URL.Query().Get("limit")
			var limit int
			var err error
			if limitStr == "" {
				limit = 30
			} else {
				limit, err = strconv.Atoi(limitStr)
				if err != nil {
					http.Error(writer, "limit is not a valid integer", http.StatusBadRequest)
					return
				}
			}

			// parse offset from query params
			offsetStr := request.URL.Query().Get("offset")
			var offset int
			if offsetStr == "" {
				offset = 0
			} else {
				offset, err = strconv.Atoi(offsetStr)
				if err != nil {
					http.Error(writer, "offset is not a valid integer", http.StatusBadRequest)
				}
			}

			// get db rows
			rows, err := db.Query("SELECT id, username, body, created_at FROM messages LIMIT $1 OFFSET $2", limit, offset)
			if err != nil {
				http.Error(writer, err.Error(), http.StatusInternalServerError)
				return
			}
			defer rows.Close()

			// parse rows to Message array
			var messages []models.Message
			for rows.Next() {
				var message models.Message
				err := rows.Scan(&message.Id, &message.Username, &message.Body, &message.CreatedAt)
				if err != nil {
					http.Error(writer, err.Error(), http.StatusInternalServerError)
					return
				}
				messages = append(messages, message)
			}

			writer.Header().Set("Content-Type", "application/json")
			json.NewEncoder(writer).Encode(messages)

		default:
			http.Error(writer, "Method not allowed", http.StatusMethodNotAllowed)
		}
	}
}

func Message(db *sql.DB) http.HandlerFunc {
	return func(writer http.ResponseWriter, request *http.Request) {
		switch request.Method {
		// GET /message/{id} -> 200 models.Message | 404
		case http.MethodGet:
			messageId := strings.TrimPrefix(request.URL.Path, "/message/")
			var message models.Message
			err := db.QueryRow("SELECT id, username, body, created_at FROM messages WHERE id = $1", messageId).Scan(&message)
			if err == sql.ErrNoRows {
				http.Error(writer, "The message with the specified id does not exist.", http.StatusNotFound)
				return
			} else if err != nil {
				http.Error(writer, err.Error(), http.StatusInternalServerError)
				return
			}

			writer.Header().Set("Content-Type", "application/json")
			json.NewEncoder(writer).Encode(message)

		// POST /message body:models.MessageCreate -> 200 int -> 404
		case http.MethodPost:
			var message models.MessageCreate
			err := json.NewDecoder(request.Body).Decode(&message)
			if err != nil {
				http.Error(writer, `Message needs to have the following body:
					{
						username:string
						body:string
					}`, http.StatusBadRequest)
			}
			
			rows, 

		default:
			http.Error(writer, "Method not allowed", http.StatusMethodNotAllowed)
		}
	}
}
