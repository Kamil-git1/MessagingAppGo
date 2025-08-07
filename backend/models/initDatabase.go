package models

import (
	"gorm.io/gorm"
)

var db *gorm.DB

// InitDatabase wykonuje migrację tabeli messages
func InitDatabase(database *gorm.DB) {
	db = database
	db.AutoMigrate(&Message{})
}
