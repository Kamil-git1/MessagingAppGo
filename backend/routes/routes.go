package routes

import (
	"messagingapp/handlers"
	"net/http"
)

func SetupRoutes() http.Handler {
	mux := http.NewServeMux()

	mux.HandleFunc("/api/register", handlers.RegisterUser)
	mux.HandleFunc("/api/login", handlers.LoginUser)

	return mux
}
