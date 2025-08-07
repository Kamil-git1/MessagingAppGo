package models

import (
	"gorm.io/gorm"
)

type Message struct {
	gorm.Model
	SenderID   uint   // ID użytkownika wysyłającego wiadomość
	ReceiverID uint   // ID użytkownika odbierającego wiadomość
	Content    string `gorm:"type:text"` // treść wiadomości
}
