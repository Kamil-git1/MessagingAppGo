package utils

import (
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type User struct {
	ID       uint   `gorm:"primaryKey"`
	Email    string `gorm:"unique;not null"`
	Username string `gorm:"unique;not null"`
	Password string `gorm:"not null"`
}

// Rejestracja z haszowaniem
func (user *User) Register(db *gorm.DB) error {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	user.Password = string(hashedPassword)
	return db.Create(user).Error
}

// Autoryzacja przez email lub username
func Authenticate(db *gorm.DB, identifier string, password string) (*User, bool) {
	var user User
	if err := db.Where("email = ? OR username = ?", identifier, identifier).First(&user).Error; err != nil {
		return nil, false
	}
	err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))
	return &user, err == nil
}
