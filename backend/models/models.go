package models

import (
	"errors"
	"log"

	"time"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Username     string `gorm:"uniqueIndex;not null"`
	Email        string `gorm:"uniqueIndex;not null"`
	PasswordHash string `gorm:"not null"`
}
type Message struct {
	ID         uint      `json:"id" gorm:"primaryKey"`
	SenderID   uint      `json:"senderId"`
	Sender     User      `json:"sender" gorm:"foreignKey:SenderID"` // 👈 dodaj to!
	ReceiverID *uint     `json:"receiverId"`
	Content    string    `json:"content"`
	Public     bool      `json:"public"`
	CreatedAt  time.Time `json:"createdAt"`
}

func CreateMessage(db *gorm.DB, senderID uint, receiverID *uint, content string, public bool) (*Message, error) {
	message := Message{
		Content:    content,
		SenderID:   senderID,
		ReceiverID: receiverID,
		Public:     public,
	}
	err := db.Create(&message).Error
	return &message, err
}
func CreateUser(db *gorm.DB, username, email, passwordHash string) error {
	user := User{
		Username:     username,
		Email:        email,
		PasswordHash: passwordHash,
	}
	return db.Create(&user).Error
}

func UserExists(db *gorm.DB, identifier string) (bool, error) {
	var user User
	err := db.Where("username = ? OR email = ?", identifier, identifier).First(&user).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return false, nil
	}
	return err == nil, err
}

func Authenticate(db *gorm.DB, identifier, password string) (*User, bool) {
	var user User
	err := db.Where("username = ? OR email = ?", identifier, identifier).First(&user).Error
	if err != nil {
		log.Println("Użytkownik nie znaleziony:", identifier)
		return nil, false
	}

	if bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(password)) != nil {
		log.Println("Hasło nie pasuje")
		return nil, false
	}

	return &user, true
}
func (u *User) CheckPassword(password string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(u.PasswordHash), []byte(password))
	return err == nil
}
