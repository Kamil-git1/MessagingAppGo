package handlers

import (
    "net/http"
    "github.com/gorilla/mux"
    "encoding/json"
)

type Message struct {
    ID      string `json:"id"`
    Sender  string `json:"sender"`
    Receiver string `json:"receiver"`
    Content string `json:"content"`
}

var messages []Message

func SendMessage(w http.ResponseWriter, r *http.Request) {
    var message Message
    err := json.NewDecoder(r.Body).Decode(&message)
    if err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }
    messages = append(messages, message)
    w.WriteHeader(http.StatusCreated)
    json.NewEncoder(w).Encode(message)
}

func GetMessages(w http.ResponseWriter, r *http.Request) {
    json.NewEncoder(w).Encode(messages)
}

func RegisterRoutes(r *mux.Router) {
    r.HandleFunc("/messages", SendMessage).Methods("POST")
    r.HandleFunc("/messages", GetMessages).Methods("GET")
}