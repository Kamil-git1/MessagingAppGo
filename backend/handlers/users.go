package handlers

import (
	"encoding/json"
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

func GetUsers(w http.ResponseWriter, r *http.Request) {
	var users []models.User

	if err := database.DB.Find(&users).Error; err != nil {
		http.Error(w, "Błąd pobierania użytkowników", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(users)
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
		http.Error(w, "Nieprawidłowe dane logowania", http.StatusBadRequest)
		return
	}

	var user models.User

	// Szukamy użytkownika po nazwie lub emailu
	err := database.DB.Where("username = ? OR email = ?", req.Identifier, req.Identifier).First(&user).Error
	if err != nil {
		http.Error(w, "Użytkownik nie istnieje", http.StatusUnauthorized)
		return
	}

	// Sprawdzenie hasła
	if !user.CheckPassword(req.Password) {
		http.Error(w, "Nieprawidłowe hasło", http.StatusUnauthorized)
		return
	}

	// Zwracamy dane użytkownika (bez hasła)
	response := map[string]interface{}{
		"id":       user.ID,
		"username": user.Username,
		"email":    user.Email,
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
}
