package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
)

type Message struct {
	ID       string `json:"id"`
	Sender   string `json:"sender"`
	Receiver string `json:"receiver"`
	Content  string `json:"content"`
}

var messages []Message

func SendMessage(w http.ResponseWriter, r *http.Request) {
	var message Message
	if err := json.NewDecoder(r.Body).Decode(&message); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	messages = append(messages, message)
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(message)
	fmt.Println("Hello, world!")
}

func ReceiveMessages(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(messages)
}
