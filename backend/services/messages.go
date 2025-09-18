package services

import (
	"database/sql"
	"echo-wall/database"
	"echo-wall/models"
	"encoding/json"
	"io"
	"log"
	"net/http"
	"strconv"
	"strings"

	"golang.org/x/net/websocket"
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
			messages, err := database.GetMessages(db, limit, offset)
			if err != nil {
				http.Error(writer, err.Error(), http.StatusInternalServerError)
				return
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
			messageIdStr := strings.TrimPrefix(request.URL.Path, "/message/")
			messageId, err := strconv.ParseInt(messageIdStr, 10, 32)
			if err != nil {
				http.Error(writer, "Invalid message id", http.StatusBadRequest)
				return
			}

			var message models.Message
			message, err = database.GetMessage(db, int(messageId))
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
			var messageCreate models.MessageCreate
			err := json.NewDecoder(request.Body).Decode(&messageCreate)
			if err != nil {
				http.Error(writer, `Message needs to have the following body:
					{
						username:string
						body:string
					}`, http.StatusBadRequest)
			}

			var insertedMessageId int
			insertedMessageId, err = database.CreateMessage(db, messageCreate)
			if err != nil {
				http.Error(writer, err.Error(), http.StatusInternalServerError)
				return
			}

			writer.Header().Set("Content-Type", "application/json")
			json.NewEncoder(writer).Encode(insertedMessageId)

		default:
			http.Error(writer, "Method not allowed", http.StatusMethodNotAllowed)
		}
	}
}

func Echo(db *sql.DB) websocket.Handler {
	return func(ws *websocket.Conn) {
		decoder := json.NewDecoder(ws)
		encoder := json.NewEncoder(ws)
		var msg models.MessageCreate
		for {
			err := decoder.Decode(&msg)
			log.Println(msg)
			if err != nil {
				if err == io.EOF {
					break
				}
				continue
			}
			log.Println(msg)
			var insertedMessageId int
			insertedMessageId, err = database.CreateMessage(db, msg)
			if err != nil {
				// TODO: better error handling
				return
			}

			var insertedMessage models.Message
			insertedMessage, err = database.GetMessage(db, insertedMessageId)
			if err != nil {
				// TODO: better error handling
				return
			}
			encoder.Encode(insertedMessage)
		}
	}
}
