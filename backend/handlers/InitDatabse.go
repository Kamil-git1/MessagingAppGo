package handlers

import (
	"gorm.io/gorm"
)

// Zmienna globalna do przechowywania połączenia z bazą danych
var db *gorm.DB

// InitDatabase przypisuje połączenie do zmiennej db
func InitDatabase(database *gorm.DB) {
	db = database
}
