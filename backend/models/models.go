package models

import (
	"errors"
	"log"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Username     string `gorm:"uniqueIndex;not null"`
	Email        string `gorm:"uniqueIndex;not null"`
	PasswordHash string `gorm:"not null"`
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
