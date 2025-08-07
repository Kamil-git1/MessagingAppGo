package routes

import (
	"github.com/gorilla/mux"

	"messagingapp/handlers"
)

func SetupRoutes() *mux.Router {
	router := mux.NewRouter()

	// User routes
	router.HandleFunc("/api/users/register", handlers.RegisterUser).Methods("POST")
	router.HandleFunc("/api/users/login", handlers.LoginUser).Methods("POST")

	// Message routes
	router.HandleFunc("/api/messages/send", handlers.SendMessage).Methods("POST")
	router.HandleFunc("/api/messages/receive", handlers.ReceiveMessages).Methods("GET")

	return router
}
