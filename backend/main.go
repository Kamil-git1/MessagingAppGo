package main

import (
	"log"
	"messagingapp/handlers"
	"messagingapp/models"
	"messagingapp/routes"
	"net/http"
	"path/filepath"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

// Middleware dodający nagłówki CORS do każdego żądania HTTP
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
	// 🔐 Dane dostępowe do PostgreSQL
	dsn := "host=localhost user=postgres password=admin dbname=messagingapp port=5432 sslmode=disable"

	// 🔌 Połączenie z bazą PostgreSQL
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("❌ Nie udało się połączyć z bazą PostgreSQL:", err)
	}
	log.Println("✅ Połączono z bazą PostgreSQL!")

	// Przekazanie połączenia z bazą do pakietów
	handlers.InitDatabase(db)
	models.InitDatabase(db)

	// Inicjalizacja routera API
	apiRouter := routes.SetupRoutes()

	// Dodanie obsługi CORS
	handlerWithCORS := enableCORS(apiRouter)

	// Ścieżka do zbudowanego frontendu React
	staticDir := filepath.Join("..", "frontend", "dist")
	fs := http.FileServer(http.Dir(staticDir))

	// Główny router HTTP
	mainRouter := http.NewServeMux()
	mainRouter.Handle("/api/", handlerWithCORS)
	mainRouter.Handle("/", fs)

	log.Println("🚀 Serwer działa na http://localhost:8080")

	// Uruchomienie serwera HTTP
	if err := http.ListenAndServe(":8080", mainRouter); err != nil {
		log.Fatal(err)
	}
}
