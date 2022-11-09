package login

import (
	"fmt"
	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v4"
	"github.com/iamyxsh/microservice-auth/auth-service/database"
	"github.com/iamyxsh/microservice-auth/auth-service/kafkaclient"
	"github.com/iamyxsh/microservice-auth/auth-service/models"
	"github.com/iamyxsh/microservice-auth/auth-service/utils"
	"golang.org/x/crypto/bcrypt"
	"time"
)

type Body struct {
	Email    string `json:"email" validate:"min=3,max=32,email"`
	Password string `json:"password" validate:"min=3,max=32"`
}

var sampleSecretKey = []byte("superSecret")

func Login(c *fiber.Ctx) error {
	var body Body

	if err := c.BodyParser(&body); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": err.Error(),
		})
	}

	errors := utils.ValidateStruct(&body)
	if errors != nil {
		return c.Status(fiber.StatusBadRequest).JSON(errors)

	}

	var user models.User

	database.DB.First(&user, "email = ?", body.Email)

	fmt.Println("Rannnnn")

	err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(body.Password))

	if err != nil {
		fmt.Println(err.Error())
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"msg": "Incorect password",
		})
	}

	token := jwt.New(jwt.SigningMethodHS256)
	claims := token.Claims.(jwt.MapClaims)

	claims["authorized"] = true
	claims["email"] = user.Email
	claims["exp"] = time.Now().Add(time.Minute * 30).Unix()

	tokenString, err := token.SignedString(sampleSecretKey)

	if err != nil {
		fmt.Println(err.Error())
	}

	kafkaclient.Produce("USER_LOGGED_IN")

	return c.Status(200).JSON(fiber.Map{
		"msg":   "Login success.",
		"token": tokenString,
	})

}
