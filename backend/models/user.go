package models

import (
	"gorm.io/gorm"
)

type User struct {
	ID       uint   `gorm:"primaryKey"`
	Phone    string `gorm:"unique;not null"`
	Email    string `gorm:"unique;not null"`
	Username string `gorm:"unique;not null"`
	Password string `gorm:"not null"`
}

func (user *User) Register(db *gorm.DB) error {
	return db.Create(user).Error
}

func (user *User) Authenticate(db *gorm.DB, password string) bool {
	var existingUser User
	if err := db.Where("email = ?", user.Email).First(&existingUser).Error; err != nil {
		return false
	}
	return existingUser.Password == password
}