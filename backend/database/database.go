package database

import (
	"log"
	"messagingapp/models"
	"os"

	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
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

	DB = db // ✅ najpierw przypisujemy

	err = DB.AutoMigrate(&models.User{}, &models.Message{})
	if err != nil {
		log.Fatal("❌ Błąd migracji:", err)
	}

	log.Println("✅ Połączono z bazą danych.")
}
