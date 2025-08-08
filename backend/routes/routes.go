package routes // Deklaracja pakietu — ten plik należy do pakietu 'routes'

import (
	"context"
	"messagingapp/handlers" // Importujemy pakiet z funkcjami obsługującymi żądania HTTP
	"net/http"
	"strings" // Standardowa biblioteka HTTP w Go
)

// SetupRoutes konfiguruje wszystkie dostępne ścieżki API i zwraca handler HTTP
func SetupRoutes() http.Handler {
	mux := http.NewServeMux() // Tworzymy nowy multiplexer (router) do obsługi ścieżek

	// Rejestracja nowego użytkownika — POST /api/register
	mux.HandleFunc("/api/register", handlers.RegisterUser)

	// Logowanie użytkownika — POST /api/login
	mux.HandleFunc("/api/login", handlers.LoginUser)

	// Wysyłanie wiadomości — POST /api/messages/send
	mux.HandleFunc("/api/messages/send", handlers.SendMessage)

	// Pobieranie wiadomości publicznych — GET /api/messages/public
	mux.HandleFunc("/api/messages/public", handlers.GetPublicMessages)
	mux.HandleFunc("/api/users", handlers.GetUsers) // Obsługa z dodatkowym ukośnikiem
	// Obsługa wiadomości prywatnych — GET /api/messages/{senderId}/{receiverId}
	// Ponieważ net/http nie obsługuje dynamicznych ścieżek, używamy funkcji pomocniczej
	mux.HandleFunc("/api/messages/", func(w http.ResponseWriter, r *http.Request) {
		// Dzielimy ścieżkę URL na segmenty
		segments := splitPath(r.URL.Path)

		// Sprawdzamy, czy ścieżka ma dokładnie 4 segmenty: ["api", "messages", "senderId", "receiverId"]
		if len(segments) == 4 {
			r.URL.Path = "" // Resetujemy ścieżkę, aby uniknąć konfliktów

			// Dodajemy senderId i receiverId do kontekstu żądania
			r = setPathValues(r, segments[2], segments[3])

			// Wywołujemy handler do pobierania wiadomości prywatnych
			handlers.GetPrivateMessages(w, r)
			return
		}

		// Jeśli ścieżka nie pasuje, zwracamy 404
		http.NotFound(w, r)
	})

	return mux // Zwracamy skonfigurowany router
}

// splitPath dzieli ścieżkę URL na segmenty, ignorując puste elementy
func splitPath(path string) []string {
	var parts []string
	for _, p := range strings.Split(path, "/") { // Dzielimy ścieżkę po '/'
		if p != "" {
			parts = append(parts, p) // Dodajemy niepuste segmenty
		}
	}
	return parts // Zwracamy listę segmentów
}

// setPathValues dodaje senderId i receiverId do kontekstu żądania
// setPathValues dodaje senderId i receiverId do kontekstu żądania
func setPathValues(r *http.Request, senderId, receiverId string) *http.Request {
	ctx := r.Context()                                // Pobieramy aktualny kontekst
	ctx = setPathValue(ctx, "senderId", senderId)     // Dodajemy senderId
	ctx = setPathValue(ctx, "receiverId", receiverId) // Dodajemy receiverId
	return r.WithContext(ctx)                         // Zwracamy nowe żądanie z uzupełnionym kontekstem
}

// setPathValue dodaje pojedynczą wartość do kontekstu
func setPathValue(ctx context.Context, key, value string) context.Context {
	type contextKey string                                // Definiujemy typ klucza kontekstu
	return context.WithValue(ctx, contextKey(key), value) // Zwracamy nowy kontekst z wartością
}
