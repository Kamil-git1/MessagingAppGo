package main

import (
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

func main() {
	r := mux.NewRouter()

	// Set up routes
	setupRoutes(r)

	// Start the server
	log.Println("Starting server on :8080")
	if err := http.ListenAndServe(":8080", r); err != nil {
		log.Fatal(err)
	}
}

func setupRoutes(r *mux.Router) {
	// Define your routes here
	// Example: r.HandleFunc("/api/messages", messageHandler).Methods("GET", "POST")
}
