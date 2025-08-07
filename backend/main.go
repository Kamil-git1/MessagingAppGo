package main

import (
	"log"
	"messagingapp/database"
	"messagingapp/routes"
	"net/http"
	"path/filepath"
)

func enableCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func main() {
	database.Init()

	apiRouter := routes.SetupRoutes()
	handlerWithCORS := enableCORS(apiRouter)

	staticDir := filepath.Join("..", "frontend", "dist")
	fs := http.FileServer(http.Dir(staticDir))

	mainRouter := http.NewServeMux()
	mainRouter.Handle("/api/", handlerWithCORS)
	mainRouter.Handle("/", fs)

	log.Println("🚀 Serwer działa na http://localhost:8080")

	if err := http.ListenAndServe(":8080", mainRouter); err != nil {
		log.Fatal(err)
	}
}
