package handlers

import (
	"encoding/json"
	"log"
	"messagingapp/database"
	"messagingapp/models"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
)

// Struktura żądania wysłania wiadomości
type SendMessageRequest struct {
	SenderID   uint   `json:"senderId"`
	ReceiverID *uint  `json:"receiverId,omitempty"` // null dla publicznych
	Content    string `json:"content"`
	Public     bool   `json:"public"`
}

// Wysyłanie wiadomości
func SendMessage(w http.ResponseWriter, r *http.Request) {
	var req SendMessageRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Nieprawidłowe dane", http.StatusBadRequest)
		return
	}

	if req.Content == "" || req.SenderID == 0 {
		http.Error(w, "Brak treści lub nadawcy", http.StatusBadRequest)
		return
	}

	// Walidacja wiadomości prywatnej
	if !req.Public && (req.ReceiverID == nil || *req.ReceiverID == 0) {
		http.Error(w, "Brak odbiorcy dla wiadomości prywatnej", http.StatusBadRequest)
		return
	}

	// Przekazujemy wskaźnik bezpośrednio
	msg, err := models.CreateMessage(database.DB, req.SenderID, req.ReceiverID, req.Content, req.Public)
	if err != nil {
		http.Error(w, "Błąd zapisu wiadomości", http.StatusInternalServerError)
		return
	}

	var sender models.User
	senderName := "Użytkownik"
	if err := database.DB.First(&sender, msg.SenderID).Error; err == nil {
		senderName = sender.Username
	}

	response := map[string]interface{}{
		"id":         msg.ID,
		"senderId":   msg.SenderID,
		"receiverId": msg.ReceiverID,
		"content":    msg.Content,
		"public":     msg.Public,
		"senderName": senderName,
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(response)
}

// Pobieranie wiadomości publicznych
func GetPublicMessages(w http.ResponseWriter, r *http.Request) {
	var messages []models.Message
	err := database.DB.Preload("Sender").
		Where("public = ?", true).
		Order("created_at asc").
		Find(&messages).Error

	if err != nil {
		http.Error(w, "Błąd pobierania wiadomości", http.StatusInternalServerError)
		return
	}

	jsonMessages := make([]map[string]interface{}, 0)
	for _, msg := range messages {
		jsonMessages = append(jsonMessages, map[string]interface{}{
			"id":         msg.ID,
			"senderId":   msg.SenderID,
			"content":    msg.Content,
			"public":     true,
			"senderName": msg.Sender.Username,
		})
	}

	json.NewEncoder(w).Encode(jsonMessages)
}

// Pobieranie wiadomości prywatnych między dwoma użytkownikami

func respondWithError(w http.ResponseWriter, code int, message string) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	json.NewEncoder(w).Encode(map[string]string{"error": message})
}

func GetPrivateMessages(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	senderIDStr := vars["senderId"]
	receiverIDStr := vars["receiverId"]

	log.Println("senderIDStr:", senderIDStr)
	log.Println("receiverIDStr:", receiverIDStr)

	if senderIDStr == "" || receiverIDStr == "" {
		respondWithError(w, http.StatusBadRequest, "Brak senderId lub receiverId w URL")
		return
	}

	senderID, err := strconv.ParseUint(senderIDStr, 10, 64)
	if err != nil || senderID == 0 {
		respondWithError(w, http.StatusBadRequest, "Nieprawidłowy senderId")
		return
	}

	receiverID, err := strconv.ParseUint(receiverIDStr, 10, 64)
	if err != nil || receiverID == 0 {
		respondWithError(w, http.StatusBadRequest, "Nieprawidłowy receiverId")
		return
	}

	var messages []models.Message
	err = database.DB.Preload("Sender").
		Where("(sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)",
			uint(senderID), uint(receiverID), uint(receiverID), uint(senderID)).
		Order("created_at asc").
		Find(&messages).Error

	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Błąd pobierania wiadomości")
		return
	}

	jsonMessages := make([]map[string]interface{}, 0)
	for _, msg := range messages {
		jsonMessages = append(jsonMessages, map[string]interface{}{
			"id":         msg.ID,
			"senderId":   msg.SenderID,
			"receiverId": msg.ReceiverID,
			"content":    msg.Content,
			"public":     false,
			"senderName": msg.Sender.Username,
		})
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(jsonMessages)
}

// 🗑️ Kasowanie wszystkich wiadomości
func DeleteAllMessages(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodDelete {
		http.Error(w, "Metoda niedozwolona", http.StatusMethodNotAllowed)
		return
	}

	if err := database.DB.Exec("DELETE FROM messages").Error; err != nil {
		http.Error(w, "Błąd usuwania wiadomości", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{
		"status": "wszystkie wiadomości zostały usunięte",
	})
}
