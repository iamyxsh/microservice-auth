package main

import (
	"fmt"
	"github.com/gofiber/fiber/v2"
	"github.com/iamyxsh/microservice-auth/auth-service/database"
	"github.com/iamyxsh/microservice-auth/auth-service/kafkaclient"
	"github.com/iamyxsh/microservice-auth/auth-service/models"
	"github.com/iamyxsh/microservice-auth/auth-service/services/login"
)

func main() {
	fmt.Println("Hello")
	go kafkaclient.Consume("USER_CREATED")

	database.DB.AutoMigrate(models.User{})

	app := fiber.New()

	app.Post("/login", login.Login)

	app.Listen(":3002")
}
