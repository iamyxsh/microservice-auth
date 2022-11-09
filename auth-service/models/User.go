package models

import (
	"github.com/iamyxsh/microservice-auth/auth-service/database"
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Email    string `json:"email"`
	Password string `json:"password"`
}

func (u *User) Create() {
	database.DB.Create(u)
}
