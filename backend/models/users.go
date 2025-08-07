package models

import (
	"gorm.io/gorm"
)

// User reprezentuje użytkownika w bazie danych
type User struct {
	gorm.Model
	Username string `gorm:"uniqueIndex;not null"` // unikalna nazwa użytkownika
	Email    string `gorm:"uniqueIndex;not null"` // unikalny email
	Password string `gorm:"not null"`             // zaszyfrowane hasło
}

// Authenticate sprawdza, czy użytkownik istnieje i hasło się zgadza
func Authenticate(database *gorm.DB, identifier, password string) (*User, bool) {
	var user User
	// Szukaj po nazwie użytkownika lub emailu
	if err := database.Where("username = ? OR email = ?", identifier, identifier).First(&user).Error; err != nil {
		return nil, false
	}
	// Tu powinna być weryfikacja hasła (np. bcrypt)
	if user.Password != password {
		return nil, false
	}
	return &user, true
}
