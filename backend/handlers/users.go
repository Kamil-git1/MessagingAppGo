package handlers

import (
	"encoding/json"
	"fmt"
	"messagingapp/database"
	"messagingapp/models"
	"net/http"

	"golang.org/x/crypto/bcrypt"
)

type RegisterRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
	Email    string `json:"email"`
}

type LoginRequest struct {
	Identifier string `json:"identifier"` // może być email lub username
	Password   string `json:"password"`
}

func RegisterUser(w http.ResponseWriter, r *http.Request) {
	var req RegisterRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Nieprawidłowe dane wejściowe", http.StatusBadRequest)
		return
	}

	if req.Username == "" || req.Email == "" || req.Password == "" {
		http.Error(w, "Wszystkie pola są wymagane", http.StatusBadRequest)
		return
	}

	exists, err := models.UserExists(database.DB, req.Username)
	if err != nil {
		http.Error(w, "Błąd serwera", http.StatusInternalServerError)
		return
	}
	if exists {
		http.Error(w, "Użytkownik już istnieje", http.StatusConflict)
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		http.Error(w, "Błąd podczas szyfrowania hasła", http.StatusInternalServerError)
		return
	}

	err = models.CreateUser(database.DB, req.Username, req.Email, string(hashedPassword))
	if err != nil {
		http.Error(w, "Nie udało się zapisać użytkownika", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{
		"message": "Rejestracja zakończona sukcesem",
	})
}

func LoginUser(w http.ResponseWriter, r *http.Request) {
	var req LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Nieprawidłowe dane wejściowe", http.StatusBadRequest)
		return
	}

	if req.Identifier == "" || req.Password == "" {
		http.Error(w, "Nazwa użytkownika i hasło są wymagane", http.StatusBadRequest)
		return
	}

	user, ok := models.Authenticate(database.DB, req.Identifier, req.Password)
	if !ok {
		http.Error(w, "Nieprawidłowa nazwa użytkownika lub hasło", http.StatusUnauthorized)
		return
	}

	json.NewEncoder(w).Encode(map[string]string{
		"message": "Logowanie zakończone sukcesem",
		"userId":  fmt.Sprint(user.ID),
	})
}
