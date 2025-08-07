package database

import (
	"log"
	"os"

	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"

	"messagingapp/models"
)

var DB *gorm.DB

func Init() {
	_ = godotenv.Load()

	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		log.Fatal("❌ Brak DATABASE_URL w .env")
	}

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("❌ Nie udało się połączyć z bazą:", err)
	}

	err = db.AutoMigrate(&models.User{})
	if err != nil {
		log.Fatal("❌ Migracja nie powiodła się:", err)
	}

	log.Println("✅ Połączono z bazą danych.")
	DB = db
}
