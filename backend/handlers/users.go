package handlers

import (
	"encoding/json"
	"fmt"
	"messagingapp/models"
	"net/http"
)

type User struct {
	Username string `json:"username"`
	Password string `json:"password"`
	Email    string `json:"email"`
}

var users = make(map[string]User) // username -> User

func RegisterUser(w http.ResponseWriter, r *http.Request) {
	var user User
	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		http.Error(w, "Nieprawidłowe dane wejściowe", http.StatusBadRequest)
		return
	}

	if _, exists := users[user.Username]; exists {
		http.Error(w, "Użytkownik już istnieje", http.StatusConflict)
		return
	}

	users[user.Username] = user
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{
		"message": "Rejestracja zakończona sukcesem",
	})
}

func LoginUser(w http.ResponseWriter, r *http.Request) {
	var creds struct {
		Identifier string `json:"username"` // może być email lub username
		Password   string `json:"password"`
	}

	if err := json.NewDecoder(r.Body).Decode(&creds); err != nil {
		http.Error(w, "Nieprawidłowe dane wejściowe", http.StatusBadRequest)
		return
	}

	user, ok := models.Authenticate(db, creds.Identifier, creds.Password)
	if !ok {
		http.Error(w, "Nieprawidłowa nazwa użytkownika lub hasło", http.StatusUnauthorized)
		return
	}

	json.NewEncoder(w).Encode(map[string]string{
		"message": "Logowanie zakończone sukcesem",
		"userId":  fmt.Sprint(user.ID),
	})
}
